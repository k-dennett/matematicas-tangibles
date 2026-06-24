import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Vector2, LatheGeometry, TorusGeometry } from 'three'

// Expresiones dinámicas para cabezas 3D
const EXPRESSIONS = {
  idle: { eyeDepth: 0.006, eyeScale: 1, browRot: 0, mouthOpen: 0, cheekOpacity: 0.1 },
  surprise: { eyeDepth: 0.014, eyeScale: 1.35, browRot: -0.3, mouthOpen: 0.9, cheekOpacity: 0.2 },
  happy: { eyeDepth: 0.008, eyeScale: 1.15, browRot: 0.25, mouthOpen: 0.4, cheekOpacity: 0.8 },
  confused: { eyeDepth: 0.007, eyeScale: 1.08, browRot: 0.2, mouthOpen: 0.15, cheekOpacity: 0.3 },
}

// Crear geometría de cabeza 3D volumétrica usando LatheGeometry (rotación de perfil)
function createHeadGeometry() {
  const points = [
    new Vector2(0.0, -0.095),    // punta arriba
    new Vector2(0.045, -0.070),  // frente superior
    new Vector2(0.075, -0.015),  // frente
    new Vector2(0.085, 0.035),   // mejilla
    new Vector2(0.080, 0.080),   // mandíbula
    new Vector2(0.050, 0.115),   // barbilla
    new Vector2(0.015, 0.130),   // barbilla fondo
    new Vector2(0.0, 0.135),     // centro fondo
  ]
  return new LatheGeometry(points, 36)
}

export default function Head3D({ expression = 'idle', taken = false, mood = 'idle', blinkPhase = 0 }) {
  const headRef = useRef()
  const expr = EXPRESSIONS[expression] || EXPRESSIONS.idle
  const blinkY = Math.max(0.08, Math.sin(blinkPhase * Math.PI) * 0.95 + 0.05)
  
  // Memoizar geometrías
  const headGeo = useRef(null)
  if (!headGeo.current) {
    headGeo.current = createHeadGeometry()
  }

  return (
    <group position={[0, 0, 0]} ref={headRef}>
      {/* === CABEZA VOLUMÉTRICA 3D === */}
      <mesh geometry={headGeo.current} castShadow receiveShadow>
        <meshStandardMaterial
          color={taken ? '#ff9f68' : '#ffd9bc'}
          roughness={0.62}
          metalness={0.05}
        />
      </mesh>

      {/* === CUENCAS DE OJOS (hundidas) === */}
      <mesh position={[-0.038, 0.008, expr.eyeDepth]} castShadow>
        <sphereGeometry args={[0.019, 16, 12]} />
        <meshStandardMaterial color="#2d2d4a" roughness={0.85} metalness={0} />
      </mesh>

      <mesh position={[0.038, 0.008, expr.eyeDepth]} castShadow>
        <sphereGeometry args={[0.019, 16, 12]} />
        <meshStandardMaterial color="#2d2d4a" roughness={0.85} metalness={0} />
      </mesh>

      {/* === OJOS === */}
      {/* Blanco ojo izquierdo */}
      <mesh position={[-0.038, 0.008, expr.eyeDepth + 0.008]} scale={[expr.eyeScale, expr.eyeScale * blinkY, 1]}>
        <sphereGeometry args={[0.0125, 20, 16]} />
        <meshStandardMaterial color="#ffffff" roughness={0.3} metalness={0.05} />
      </mesh>

      {/* Pupila izquierda */}
      <mesh position={[-0.038, 0.008, expr.eyeDepth + 0.016]}>
        <sphereGeometry args={[0.0065, 18, 14]} />
        <meshStandardMaterial color="#0a0a1a" roughness={0.15} metalness={0.15} />
      </mesh>

      {/* Brillo left eye */}
      <mesh position={[-0.042, 0.012, expr.eyeDepth + 0.018]}>
        <sphereGeometry args={[0.0035, 12, 12]} />
        <meshStandardMaterial color="#ffffff" transparent opacity={0.85} roughness={0.05} />
      </mesh>

      {/* Blanco ojo derecho */}
      <mesh position={[0.038, 0.008, expr.eyeDepth + 0.008]} scale={[expr.eyeScale, expr.eyeScale * blinkY, 1]}>
        <sphereGeometry args={[0.0125, 20, 16]} />
        <meshStandardMaterial color="#ffffff" roughness={0.3} metalness={0.05} />
      </mesh>

      {/* Pupila derecha */}
      <mesh position={[0.038, 0.008, expr.eyeDepth + 0.016]}>
        <sphereGeometry args={[0.0065, 18, 14]} />
        <meshStandardMaterial color="#0a0a1a" roughness={0.15} metalness={0.15} />
      </mesh>

      {/* Brillo right eye */}
      <mesh position={[0.042, 0.012, expr.eyeDepth + 0.018]}>
        <sphereGeometry args={[0.0035, 12, 12]} />
        <meshStandardMaterial color="#ffffff" transparent opacity={0.85} roughness={0.05} />
      </mesh>

      {/* === CEJAS === */}
      <mesh position={[-0.038, 0.042, 0.014]} scale={[1.15, 0.75, 1]} rotation={[0, 0, expr.browRot]} castShadow>
        <boxGeometry args={[0.033, 0.0095, 0.009]} />
        <meshStandardMaterial color="#16233a" roughness={0.55} />
      </mesh>

      <mesh position={[0.038, 0.042, 0.014]} scale={[1.15, 0.75, 1]} rotation={[0, 0, -expr.browRot]} castShadow>
        <boxGeometry args={[0.033, 0.0095, 0.009]} />
        <meshStandardMaterial color="#16233a" roughness={0.55} />
      </mesh>

      {/* === NARIZ === */}
      <mesh position={[0, -0.008, 0.038]} castShadow receiveShadow>
        <coneGeometry args={[0.0095, 0.045, 8]} />
        <meshStandardMaterial color={taken ? '#ff9f68' : '#ffc9a8'} roughness={0.58} />
      </mesh>

      {/* === MEJILLAS (blush) === */}
      <mesh position={[-0.058, -0.015, 0.028]}>
        <sphereGeometry args={[0.0165, 16, 16]} />
        <meshStandardMaterial color="#ff8899" transparent opacity={expr.cheekOpacity * 0.5} roughness={0.8} metalness={0} />
      </mesh>

      <mesh position={[0.058, -0.015, 0.028]}>
        <sphereGeometry args={[0.0165, 16, 16]} />
        <meshStandardMaterial color="#ff8899" transparent opacity={expr.cheekOpacity * 0.5} roughness={0.8} metalness={0} />
      </mesh>

      {/* === BOCA === */}
      {expression === 'surprise' ? (
        // Boca abierta sorprendida
        <mesh position={[0, -0.068, 0.022]} scale={[1, expr.mouthOpen, 1]} castShadow>
          <sphereGeometry args={[0.018, 16, 14]} />
          <meshStandardMaterial color="#cc3333" roughness={0.4} metalness={0.05} />
        </mesh>
      ) : expression === 'happy' ? (
        // Sonrisa feliz (arco)
        <mesh position={[0, -0.062, 0.028]} scale={[1.1, 0.55, 1]} castShadow>
          <TorusGeometry args={[0.027, 0.009, 8, 32, 0, Math.PI]} />
          <meshStandardMaterial color="#e74c3c" roughness={0.48} />
        </mesh>
      ) : (
        // Boca neutral
        <mesh position={[0, -0.064, 0.025]} scale={[1, 0.75, 1]} castShadow>
          <boxGeometry args={[0.044, 0.009, 0.007]} />
          <meshStandardMaterial color="#16233a" roughness={0.5} />
        </mesh>
      )}
    </group>
  )
}
