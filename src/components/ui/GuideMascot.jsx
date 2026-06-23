import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Float, RoundedBox, Text } from '@react-three/drei'

function Eye({ position }) {
  return (
    <mesh position={position}>
      <sphereGeometry args={[0.045, 16, 16]} />
      <meshStandardMaterial color="#16233a" roughness={0.55} />
    </mesh>
  )
}

export default function GuideMascot({ reducedMotion = false, mood = 'idle', position = [0, 0, 0] }) {
  const group = useRef()

  useFrame((state) => {
    if (!group.current) return
    const t = state.clock.getElapsedTime()
    const targetWiggle = mood === 'celebra' ? 0.22 : mood === 'animada' ? 0.14 : 0.08
    const targetTilt = mood === 'celebra' ? 0.14 : 0.05
    group.current.rotation.z += (Math.sin(t * 1.8) * targetWiggle - group.current.rotation.z) * 0.08
    group.current.rotation.y += (Math.cos(t * 1.2) * targetTilt - group.current.rotation.y) * 0.08
  })

  const Wrapper = reducedMotion ? 'group' : Float
  const wrapperProps = reducedMotion
    ? {}
    : {
        speed: mood === 'celebra' ? 2.2 : 1.5,
        floatIntensity: mood === 'celebra' ? 0.38 : 0.22,
        rotationIntensity: mood === 'celebra' ? 0.14 : 0.08,
        floatingRange: [0.02, 0.08],
      }

  return (
    <group position={position}>
      <Wrapper {...wrapperProps}>
        <group ref={group}>
        <group position={[0, 0.05, 0]}>
          <RoundedBox args={[0.92, 1.0, 0.66]} radius={0.18} smoothness={8}>
            <meshStandardMaterial color="#ff8a3d" roughness={0.55} metalness={0.05} />
          </RoundedBox>

          <RoundedBox args={[0.68, 0.52, 0.18]} radius={0.09} smoothness={8} position={[0, 0.08, 0.37]}>
            <meshStandardMaterial color="#fff7ef" roughness={0.35} />
          </RoundedBox>

          <Eye position={[-0.12, 0.15, 0.47]} />
          <Eye position={[0.12, 0.15, 0.47]} />

          <mesh position={[0, -0.02, 0.48]}>
            <boxGeometry args={[0.2, 0.03, 0.03]} />
            <meshStandardMaterial color="#16233a" />
          </mesh>

          <mesh position={[0, -0.1, 0.48]}>
            <boxGeometry args={[0.34, 0.03, 0.03]} />
            <meshStandardMaterial color="#16233a" />
          </mesh>

          <mesh position={[-0.58, 0.02, 0]} rotation={[0, 0, Math.PI / 8]}>
            <RoundedBox args={[0.16, 0.52, 0.14]} radius={0.05} smoothness={6}>
              <meshStandardMaterial color="#ffb36a" roughness={0.6} />
            </RoundedBox>
          </mesh>

          <mesh position={[0.58, 0.02, 0]} rotation={[0, 0, -Math.PI / 8]}>
            <RoundedBox args={[0.16, 0.52, 0.14]} radius={0.05} smoothness={6}>
              <meshStandardMaterial color="#ffb36a" roughness={0.6} />
            </RoundedBox>
          </mesh>

          <mesh position={[-0.18, -0.65, 0.08]} rotation={[0, 0, Math.PI / 30]}>
            <RoundedBox args={[0.18, 0.22, 0.16]} radius={0.04} smoothness={6}>
              <meshStandardMaterial color="#16233a" roughness={0.8} />
            </RoundedBox>
          </mesh>

          <mesh position={[0.18, -0.65, 0.08]} rotation={[0, 0, -Math.PI / 30]}>
            <RoundedBox args={[0.18, 0.22, 0.16]} radius={0.04} smoothness={6}>
              <meshStandardMaterial color="#16233a" roughness={0.8} />
            </RoundedBox>
          </mesh>

          <mesh position={[0, 0.56, 0.12]}>
            <sphereGeometry args={[0.08, 16, 16]} />
            <meshStandardMaterial color="#ffdf6b" emissive="#ffdf6b" emissiveIntensity={0.25} />
          </mesh>

          <mesh position={[0, 0.74, 0.12]}>
            <boxGeometry args={[0.03, 0.22, 0.03]} />
            <meshStandardMaterial color="#16233a" />
          </mesh>

          <Text
            position={[0, 1.02, 0.12]}
            fontSize={0.16}
            color="#16233a"
            anchorX="center"
            anchorY="middle"
            outlineWidth={0.002}
            outlineColor="#ffffff"
            renderOrder={10}
          >
            {mood === 'celebra' ? '¡Bien!' : 'Mira'}
          </Text>
        </group>
        </group>
      </Wrapper>
    </group>
  )
}
