import { useEffect, useRef, useState } from 'react'
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
const FACE_Z = BAR_D / 2 + 0.04
const FRUIT_COLORS = ['#ff9f68', '#7ad7ff', '#92e3a9', '#ffd166', '#bda0ff', '#ff8fab', '#6ed3cf', '#ffa94d']
const FRUIT_SOFT = ['#ffd9bc', '#d7f3ff', '#def8df', '#fff0b8', '#ece3ff', '#ffd6e3', '#d7f7f4', '#ffe2bf']

function setCursor(value) {
  if (typeof document !== 'undefined') document.body.style.cursor = value
}

function getBarWidth(partes) {
  if (partes >= 10) return 5.8
  if (partes >= 8) return 5.0
  if (partes >= 6) return 4.2
  return BAR_W
}

function getSegmentTone(index, taken, mood) {
  const palette = taken || mood === 'celebra' ? FRUIT_COLORS : FRUIT_SOFT
  const base = palette[index % palette.length]
  return base
}

// Expresiones dinámicas para que los segmentos sean "personajes vivos"
const EXPRESSIONS = {
  idle: { eyeY: 0, eyeScale: 1, mouthShape: 0, mouthHeight: 0 }, // normal, relajado
  surprise: { eyeY: 0.02, eyeScale: 1.3, mouthShape: 1, mouthHeight: 0.08 }, // 😮 boca abierta
  happy: { eyeY: 0, eyeScale: 0.95, mouthShape: 2, mouthHeight: -0.02 }, // 😊 sonrisa feliz
  confused: { eyeY: 0.01, eyeScale: 1.1, mouthShape: 0, mouthHeight: -0.01 }, // 🤔 confundido
  thinking: { eyeY: -0.01, eyeScale: 0.85, mouthShape: 0, mouthHeight: -0.03 }, // pensando
}

function Face({ mood, taken, compact, width, expression = 'idle', blinkProgress = 0 }) {
  const eyeSize = compact ? 0.022 : 0.028
  const eyeOffsetX = compact ? 0.05 : 0.085
  const mouthWidth = compact ? 0.075 : 0.11
  const shine = compact ? 0.008 : 0.012
  
  const expr = EXPRESSIONS[expression] || EXPRESSIONS.idle
  
  // Parpadeo: cierra ojos interpolando escala (0 = cerrado, 1 = abierto)
  const blinkScale = Math.max(0.1, blinkProgress) // min 0.1 para que no desaparezcan completamente
  
  // Boca animada según tipo de expresión
  let mouthY = expr.eyeY + expr.mouthHeight
  let mouthOpenness = expr.mouthShape === 1 ? 1 : 0.7 // forma de O vs línea
  
  return (
    <group position={[0, 0.01, FACE_Z]}>
      {/* Ojo izquierdo */}
      <mesh position={[-eyeOffsetX, expr.eyeY, 0]} scale={[expr.eyeScale * blinkScale, expr.eyeScale * blinkScale, 1]}>
        <sphereGeometry args={[eyeSize, 12, 12]} />
        <meshStandardMaterial color="#16233a" roughness={0.45} />
      </mesh>
      
      {/* Ojo derecho */}
      <mesh position={[eyeOffsetX, expr.eyeY, 0]} scale={[expr.eyeScale * blinkScale, expr.eyeScale * blinkScale, 1]}>
        <sphereGeometry args={[eyeSize, 12, 12]} />
        <meshStandardMaterial color="#16233a" roughness={0.45} />
      </mesh>
      
      {/* Boca animada (cambia forma según expresión) */}
      {expr.mouthShape === 1 ? (
        // Boca abierta (sorpresa): óvalo
        <mesh position={[0, mouthY, 0.01]} scale={[1, mouthOpenness, 1]}>
          <sphereGeometry args={[mouthWidth * 0.5, 12, 12]} />
          <meshStandardMaterial color="#e74c3c" roughness={0.6} />
        </mesh>
      ) : (
        // Boca cerrada (feliz, pensando, etc): línea redondeada
        <mesh position={[0, mouthY, 0.01]} scale={[1, expr.mouthShape === 2 ? 1.2 : 0.9, 1]}>
          <RoundedBox args={[mouthWidth, 0.018, 0.018]} radius={0.01} smoothness={4}>
            <meshStandardMaterial color={expr.mouthShape === 2 ? '#ff6b6b' : '#16233a'} roughness={0.5} />
          </RoundedBox>
        </mesh>
      )}
      
      {/* Brillo en los ojos */}
      <mesh position={[0, expr.eyeY + 0.08, -0.005]}>
        <sphereGeometry args={[shine, 10, 10]} />
        <meshStandardMaterial color="#ffffff" transparent opacity={0.7 * blinkScale} />
      </mesh>
      
      {/* Segundo brillo (solo en segmentos más grandes) */}
      {width > 0.7 && (
        <mesh position={[0, expr.eyeY + 0.11, 0.01]} scale={[1, 1, 1]}>
          <sphereGeometry args={[compact ? 0.012 : 0.016, 12, 12]} />
          <meshStandardMaterial color="#fff7ef" roughness={0.35} transparent opacity={0.6 * blinkScale} />
        </mesh>
      )}
    </group>
  )
}

// Una parte de la barra. Al tomarse sube con una animación con propósito (muestra
// la acción); al pasar el cursor se asoma un poco para invitar a tocarla. Respeta
// `prefers-reduced-motion`: si está activo, los cambios son instantáneos.
function Segment({ x, width, taken, onClick, reducedMotion, index, mood, splitPulse }) {
  const ref = useRef()
  const [hovered, setHovered] = useState(false)
  const pointerDown = useRef(null)
  const moved = useRef(false)
  const allowClick = useRef(false)
  const [blinkPhase, setBlinkPhase] = useState(0) // 0-1: ciclo de parpadeo
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
  const tone = getSegmentTone(index, taken, mood)
  const accent = taken || mood === 'celebra' ? PIEZA : '#ffffff'
  const targetScale = splitPulse ? 1.05 : 1
  
  // Determinar expresión del segmento
  let expression = 'idle'
  if (splitPulse) {
    expression = 'surprise' // 😮 cuando se parte
  } else if (taken) {
    expression = 'happy' // 😊 cuando se toma
  } else if (hovered) {
    expression = 'confused' // 🤔 cuando se pasa cursor (coqueto)
  }
  
  // Ciclo de parpadeo natural (~1.5s en total: 0.3s cierra, 0.05s cerrado, 0.05s abre, 1.1s abierto)
  useEffect(() => {
    const interval = setInterval(() => {
      setBlinkPhase(p => (p + 0.016) % 1) // ~60fps, ciclo de 1s normalizado
    }, 16)
    return () => clearInterval(interval)
  }, [])
  
  // Convertir fase a progreso de parpadeo (1=abierto, 0=cerrado)
  const blinkProgressRaw = blinkPhase < 0.2 
    ? 1 - (blinkPhase / 0.2) * 0.9 // cierra (0.2s)
    : blinkPhase < 0.25
    ? 0.1 // cerrado (0.05s)
    : blinkPhase < 0.3
    ? 0.1 + ((blinkPhase - 0.25) / 0.05) * 0.9 // abre (0.05s)
    : 1 // abierto (0.7s)
  
  const blinkProgress = taken || splitPulse ? 1 : blinkProgressRaw // sin parpadeo si se toma o en sorpresa

  useFrame(() => {
    if (!ref.current) return
    const lift = interactive && hovered && !taken ? HOVER : 0
    const targetY = (taken ? RAISE : 0) + lift
    const pulse = splitPulse ? 1.05 : 1
    if (reducedMotion) {
      ref.current.position.y = targetY
      ref.current.scale.setScalar(pulse)
    } else {
      // Ease exponencial hacia el objetivo: ágil pero suave (no decorativo).
      ref.current.position.y += (targetY - ref.current.position.y) * 0.22
      ref.current.scale.x += (targetScale - ref.current.scale.x) * 0.16
      ref.current.scale.y += (targetScale - ref.current.scale.y) * 0.16
      ref.current.scale.z += (targetScale - ref.current.scale.z) * 0.16
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
          color={tone}
          emissive={accent}
          emissiveIntensity={taken ? 0.18 : hovered ? 0.07 : mood === 'celebra' ? 0.09 : 0}
          roughness={0.58}
          metalness={0.08}
        />
      </mesh>

      <Face mood={mood} taken={taken} compact={compact} width={width} expression={expression} blinkProgress={blinkProgress} />

      <group position={[0, laneY, 0.44]}>
        <RoundedBox args={[badgeWidth, badgeHeight, 0.03]} radius={0.03} smoothness={6}>
          <meshStandardMaterial
            color={taken ? PIEZA : '#ffffff'}
            emissive={taken ? PIEZA : '#000000'}
            emissiveIntensity={taken ? 0.16 : 0}
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

export default function FractionBar({ partes = 1, taken = [], onToggleParte, reducedMotion = false, mood = 'idle' }) {
  const barW = getBarWidth(partes)
  const segWidth = (barW - GAP * (partes - 1)) / partes
  const [splitPulse, setSplitPulse] = useState(false)

  useEffect(() => {
    setSplitPulse(true)
    const timeout = window.setTimeout(() => setSplitPulse(false), 420)
    return () => window.clearTimeout(timeout)
  }, [partes])

  return (
    <group>
      <mesh position={[0, -0.41, 0]}>
        <boxGeometry args={[barW + TRAY_PAD * 2, 0.12, BAR_D + 0.24]} />
        <meshStandardMaterial color="#dfe8f7" roughness={0.95} metalness={0} />
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
              mood={mood}
              splitPulse={splitPulse}
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
