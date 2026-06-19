import { useRef, useState } from 'react'
import { useFrame } from '@react-three/fiber'

// Manipulable 3D: una barra dividida en `partes` iguales. Es DUMB: no sabe de la
// actividad; recibe el estado ({ partes, taken }) y emite onToggleParte(i) cuando
// el estudiante toca una parte. R3F libera geometrías/materiales al desmontar.

// Colores espejo de los tokens de diseño (ver src/styles/global.css y docs/05).
const PIEZA = '#2e6be6'
const PIEZA_SUAVE = '#bcd4fb'

const BAR_W = 3.4 // ancho total de la barra
const BAR_H = 0.6
const BAR_D = 0.85 // grosor "agarrable" (docs/05)
const GAP = 0.05 // separación visible entre partes
const RAISE = 0.26 // cuánto sube una parte "tomada"
const HOVER = 0.08 // pequeño alzado al pasar el cursor (affordance de "se puede tomar")

function setCursor(value) {
  if (typeof document !== 'undefined') document.body.style.cursor = value
}

// Una parte de la barra. Al tomarse sube con una animación con propósito (muestra
// la acción); al pasar el cursor se asoma un poco para invitar a tocarla. Respeta
// `prefers-reduced-motion`: si está activo, los cambios son instantáneos.
function Segment({ x, width, taken, onClick, reducedMotion }) {
  const ref = useRef()
  const [hovered, setHovered] = useState(false)
  const interactive = typeof onClick === 'function'

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
    <mesh
      ref={ref}
      position={[x, 0, 0]}
      onClick={interactive ? (e) => { e.stopPropagation(); onClick() } : undefined}
      onPointerOver={interactive ? (e) => { e.stopPropagation(); setHovered(true); setCursor('pointer') } : undefined}
      onPointerOut={interactive ? () => { setHovered(false); setCursor('auto') } : undefined}
    >
      <boxGeometry args={[width, BAR_H, BAR_D]} />
      <meshStandardMaterial color={taken ? PIEZA : PIEZA_SUAVE} />
    </mesh>
  )
}

export default function FractionBar({ partes = 1, taken = [], onToggleParte, reducedMotion = false }) {
  const segWidth = (BAR_W - GAP * (partes - 1)) / partes
  return (
    <group>
      {Array.from({ length: partes }, (_, i) => {
        const x = -BAR_W / 2 + segWidth / 2 + i * (segWidth + GAP)
        return (
          <Segment
            key={i}
            x={x}
            width={segWidth}
            taken={taken.includes(i)}
            reducedMotion={reducedMotion}
            onClick={onToggleParte ? () => onToggleParte(i) : undefined}
          />
        )
      })}
    </group>
  )
}
