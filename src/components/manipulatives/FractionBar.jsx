import { useRef, useState } from 'react'
import { useFrame } from '@react-three/fiber'
import { RoundedBox, Text } from '@react-three/drei'

// Manipulable 3D: una barra dividida en `partes` iguales. Es DUMB: no sabe de la
// actividad; recibe el estado ({ partes, taken }) y emite onToggleParte(i) cuando
// el estudiante toca una parte. R3F libera geometrías/materiales al desmontar.

// Colores espejo de los tokens de diseño (ver src/styles/global.css y docs/05).
const PIEZA = '#2e6be6'
const PIEZA_SUAVE = '#bcd4fb'

const BAR_W = 3.4 // ancho total base de la barra
const BAR_H = 0.6
const BAR_D = 0.85 // grosor "agarrable" (docs/05)
const GAP = 0.05 // separación visible entre partes
const RAISE = 0.26 // cuánto sube una parte "tomada"
const HOVER = 0.08 // pequeño alzado al pasar el cursor (affordance de "se puede tomar")
const TRAY_PAD = 0.18
const BADGE_Y = BAR_H / 2 + 0.3

function setCursor(value) {
  if (typeof document !== 'undefined') document.body.style.cursor = value
}

function getBarWidth(partes) {
  if (partes >= 10) return 5.8
  if (partes >= 8) return 5.0
  if (partes >= 6) return 4.2
  return BAR_W
}

// Una parte de la barra. Al tomarse sube con una animación con propósito (muestra
// la acción); al pasar el cursor se asoma un poco para invitar a tocarla. Respeta
// `prefers-reduced-motion`: si está activo, los cambios son instantáneos.
function Segment({ x, width, taken, onClick, reducedMotion, index }) {
  const ref = useRef()
  const [hovered, setHovered] = useState(false)
  const pointerDown = useRef(null)
  const moved = useRef(false)
  const allowClick = useRef(false)
  const interactive = typeof onClick === 'function'
  const dense = width < 0.45
  const compact = width < 0.34
  const badgeWidth = dense ? (compact ? 0.18 : 0.22) : 0.28
  const badgeHeight = dense ? (compact ? 0.18 : 0.22) : 0.28
  const fontSize = dense ? (compact ? 0.12 : 0.14) : 0.18
  const badgeY = BADGE_Y + (dense ? 0.06 : 0)
  const lane = dense ? index % 2 : 0
  const laneY = badgeY + lane * (dense ? 0.17 : 0)
  const MOVE_THRESHOLD = 6

  useFrame(() => {
    if (!ref.current) return
    const lift = interactive && hovered && !taken ? HOVER : 0
    const targetY = (taken ? RAISE : 0) + lift
    if (reducedMotion) {
      ref.current.position.y = targetY
    } else {
      // Ease exponencial hacia el objetivo: ágil pero suave (no decorativo).
      ref.current.position.y += (targetY - ref.current.position.y) * 0.22
    }
  })

  return (
    <group ref={ref} position={[x, 0, 0]}>
      <mesh
        onClick={
          interactive
            ? (e) => {
                e.stopPropagation()
                if (!allowClick.current) return
                allowClick.current = false
                onClick(e)
              }
            : undefined
        }
        onPointerDown={
          interactive
            ? (e) => {
                pointerDown.current = { x: e.clientX, y: e.clientY }
              moved.current = false
              allowClick.current = false
            }
            : undefined
        }
        onPointerMove={
          interactive
            ? (e) => {
                const start = pointerDown.current
                if (!start) return
                const dx = e.clientX - start.x
                const dy = e.clientY - start.y
                if (Math.hypot(dx, dy) > MOVE_THRESHOLD) {
                  moved.current = true
                  allowClick.current = false
                  return
                }
                allowClick.current = true
              }
            : undefined
        }
        onPointerUp={
          interactive
            ? () => {
                allowClick.current = !!pointerDown.current && !moved.current
                pointerDown.current = null
              }
            : undefined
        }
        onPointerCancel={interactive ? () => { pointerDown.current = null; moved.current = false; allowClick.current = false } : undefined}
        onPointerLeave={interactive ? () => { pointerDown.current = null; moved.current = false; allowClick.current = false } : undefined}
        onPointerOver={interactive ? (e) => { e.stopPropagation(); setHovered(true); setCursor('pointer') } : undefined}
        onPointerOut={interactive ? () => { setHovered(false); setCursor('auto'); pointerDown.current = null; moved.current = false; allowClick.current = false } : undefined}
      >
        <boxGeometry args={[width, BAR_H, BAR_D]} />
        <meshStandardMaterial
          color={taken ? PIEZA : PIEZA_SUAVE}
          emissive={taken ? PIEZA : '#000000'}
          emissiveIntensity={taken ? 0.18 : hovered ? 0.04 : 0}
          roughness={0.65}
          metalness={0.05}
        />
      </mesh>

      <group position={[0, laneY, 0.44]}>
        <RoundedBox args={[badgeWidth, badgeHeight, 0.03]} radius={0.03} smoothness={6}>
          <meshStandardMaterial
            color={taken ? PIEZA : '#ffffff'}
            emissive={taken ? PIEZA : '#000000'}
            emissiveIntensity={taken ? 0.15 : 0}
            roughness={0.45}
            metalness={0.02}
          />
        </RoundedBox>
        <Text
          position={[0, 0, 0.02]}
          fontSize={fontSize}
          color={taken ? '#ffffff' : '#16233a'}
          anchorX="center"
          anchorY="middle"
          outlineWidth={dense ? 0.0025 : 0.0035}
          outlineColor={taken ? '#2e6be6' : '#ffffff'}
          outlineOpacity={0.9}
          material-toneMapped={false}
          renderOrder={10}
        >
          {taken ? '✓' : index + 1}
        </Text>
      </group>
    </group>
  )
}

export default function FractionBar({ partes = 1, taken = [], onToggleParte, reducedMotion = false }) {
  const barW = getBarWidth(partes)
  const segWidth = (barW - GAP * (partes - 1)) / partes
  return (
    <group>
      <mesh position={[0, -0.41, 0]}>
        <boxGeometry args={[barW + TRAY_PAD * 2, 0.12, BAR_D + 0.24]} />
        <meshStandardMaterial color="#e9eef7" roughness={0.95} metalness={0} />
      </mesh>

      {Array.from({ length: partes }, (_, i) => {
        const x = -barW / 2 + segWidth / 2 + i * (segWidth + GAP)
        const gapX = x + segWidth / 2 + GAP / 2
        return (
          <group key={i}>
            {i < partes - 1 && (
              <mesh position={[gapX, 0, 0]} renderOrder={2}>
                <boxGeometry args={[GAP * 0.35, BAR_H + 0.08, BAR_D * 0.88]} />
                <meshStandardMaterial color="#9fb2d1" roughness={1} metalness={0} />
              </mesh>
            )}
            <Segment
              x={x}
              width={segWidth}
              taken={taken.includes(i)}
              reducedMotion={reducedMotion}
              index={i}
              onClick={
                onToggleParte
                  ? (e) => {
                      e?.stopPropagation?.()
                      onToggleParte(i)
                    }
                  : undefined
              }
            />
          </group>
        )
      })}
    </group>
  )
}
