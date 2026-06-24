import { useRef, useState, useEffect } from 'react'
import { useFrame } from '@react-three/fiber'
import { RoundedBox } from '@react-three/drei'
import Head2D from './Head2D'

const FRUIT_COLORS = [
  '#ff6b6b', '#ff8787', '#ffa5a5', '#ffb3b3',
  '#ffc9a8', '#ffb399', '#ff9f68', '#ff8c42',
]

/**
 * Character: una criatura simple 3D.
 * - Cabeza (canvas 2D con expresión)
 * - Cuerpo (RoundedBox)
 * - Brazos (animados)
 * 
 * Props:
 * - index: para color único
 * - width: ancho del cuerpo
 * - height: alto del cuerpo
 * - expression: 'idle', 'surprise', 'happy', etc.
 * - taken: boolean (si fue "comido")
 * - onClick: callback
 * - reducedMotion: boolean
 * - mood: 'idle', 'celebra', etc.
 */
export default function Character({
  index = 0,
  width = 1,
  height = 1.2,
  expression = 'idle',
  taken = false,
  onClick = null,
  reducedMotion = false,
  mood = 'idle',
  interactive = false,
}) {
  const groupRef = useRef()
  const bodyRef = useRef()
  const armLRef = useRef()
  const armRRef = useRef()
  const [hovered, setHovered] = useState(false)
  const [armPhase, setArmPhase] = useState(0)

  // Ciclo de brazos flotantes
  useEffect(() => {
    const interval = setInterval(() => {
      setArmPhase(p => (p + 0.05) % (Math.PI * 2))
    }, 50)
    return () => clearInterval(interval)
  }, [])

  // Animar brazos
  useFrame(() => {
    if (!armLRef.current || !armRRef.current) return
    const armMove = Math.sin(armPhase) * 0.3
    const armRotate = Math.sin(armPhase) * 0.3
    
    if (reducedMotion) {
      armLRef.current.position.y = 0
      armRRef.current.position.y = 0
    } else {
      armLRef.current.position.y = armMove
      armRRef.current.position.y = armMove
      armLRef.current.rotation.z = -armRotate
      armRRef.current.rotation.z = armRotate
    }
  })

  const bodyColor = FRUIT_COLORS[index % FRUIT_COLORS.length]
  const targetY = hovered && interactive && !taken ? 0.15 : 0

  return (
    <group ref={groupRef}>
      {/* Cuerpo */}
      <group ref={bodyRef}>
        <RoundedBox
          args={[width * 0.8, height * 0.7, 0.3]}
          radius={0.15}
          smoothness={6}
          onClick={interactive && onClick ? (e) => { e.stopPropagation(); onClick(e) } : undefined}
          onPointerOver={interactive ? () => setHovered(true) : undefined}
          onPointerOut={interactive ? () => setHovered(false) : undefined}
        >
          <meshStandardMaterial
            color={bodyColor}
            emissive={taken || mood === 'celebra' ? bodyColor : '#ffffff'}
            emissiveIntensity={taken ? 0.2 : hovered ? 0.08 : mood === 'celebra' ? 0.1 : 0}
            roughness={0.6}
            metalness={0.1}
          />
        </RoundedBox>

        {/* Cabeza (arriba del cuerpo) */}
        <group position={[0, height * 0.5, 0]}>
          <Head2D
            expression={taken ? 'happy' : expression}
            taken={taken}
            blink={1}
          />
        </group>
      </group>

      {/* Brazo izquierdo */}
      <group ref={armLRef} position={[-(width * 0.5 + 0.15), height * 0.15, 0]}>
        <RoundedBox args={[0.15, 0.5, 0.15]} radius={0.08} smoothness={4}>
          <meshStandardMaterial
            color={bodyColor}
            roughness={0.6}
            metalness={0.1}
          />
        </RoundedBox>
      </group>

      {/* Brazo derecho */}
      <group ref={armRRef} position={[width * 0.5 + 0.15, height * 0.15, 0]}>
        <RoundedBox args={[0.15, 0.5, 0.15]} radius={0.08} smoothness={4}>
          <meshStandardMaterial
            color={bodyColor}
            roughness={0.6}
            metalness={0.1}
          />
        </RoundedBox>
      </group>
    </group>
  )
}
