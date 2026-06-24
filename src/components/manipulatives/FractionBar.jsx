import { useRef, useState, useEffect } from 'react'
import { useFrame } from '@react-three/fiber'
import Character from './Character'

/**
 * FractionBar: Renderiza N personajes (criaturas) lado a lado.
 * 
 * Cuando partes === 1: 1 criatura
 * Cuando partes === 3: 3 criaturas lado a lado
 * Etc.
 * 
 * Props:
 * - partes: cantidad de divisiones (criaturas)
 * - taken: array de índices "tomados" (comidos)
 * - onToggleParte(index): callback al tocar una criatura
 * - reducedMotion: boolean
 * - mood: 'idle', 'celebra', etc.
 */
export default function FractionBar({
  partes = 1,
  taken = [],
  onToggleParte = null,
  reducedMotion = false,
  mood = 'idle',
}) {
  const groupRef = useRef()
  const [splitPulse, setSplitPulse] = useState({})
  const prevPartesRef = useRef(partes)

  // Trigger animación de sorpresa cuando cambia partes
  useEffect(() => {
    if (partes !== prevPartesRef.current) {
      // Marcar todas las nuevas partes con sorpresa temporal
      const newPulse = {}
      for (let i = 0; i < partes; i++) {
        newPulse[i] = true
      }
      setSplitPulse(newPulse)
      
      // Limpiar después de 420ms
      const timeout = setTimeout(() => {
        setSplitPulse({})
      }, 420)
      
      prevPartesRef.current = partes
      return () => clearTimeout(timeout)
    }
  }, [partes])

  // Distribuir criaturas horizontalmente
  const spacing = 2.2 // espacio entre criaturas
  const totalWidth = (partes - 1) * spacing
  const startX = -totalWidth / 2

  // Tamaño de cada criatura (se hace más pequeña con más partes)
  let charWidth = 1
  let charHeight = 1.2
  if (partes >= 8) {
    charWidth = 0.6
    charHeight = 0.8
  } else if (partes >= 5) {
    charWidth = 0.75
    charHeight = 0.95
  } else if (partes >= 3) {
    charWidth = 0.85
    charHeight = 1.05
  }

  return (
    <group ref={groupRef}>
      {Array.from({ length: partes }).map((_, i) => {
        const x = startX + i * spacing
        const isTaken = taken.includes(i)
        const hasExpression = splitPulse[i] ? 'surprise' : 'idle'

        return (
          <group key={i} position={[x, 0, 0]}>
            <Character
              index={i}
              width={charWidth}
              height={charHeight}
              expression={hasExpression}
              taken={isTaken}
              onClick={onToggleParte ? () => onToggleParte(i) : null}
              reducedMotion={reducedMotion}
              mood={mood}
              interactive={typeof onToggleParte === 'function'}
            />
          </group>
        )
      })}
    </group>
  )
}
