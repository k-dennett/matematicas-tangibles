import { useEffect, useRef } from 'react'
import { Canvas, useThree } from '@react-three/fiber'
import { CanvasTexture, PlaneGeometry } from 'three'

// Dibujar cara en canvas con estilo profesional
function drawFaceCanvas(ctx, expr) {
  const w = 256
  const h = 256
  ctx.fillStyle = expr.taken ? '#ff9f68' : '#ffd9bc'
  ctx.fillRect(0, 0, w, h)

  // Cara redondeada (círculo suavizado)
  ctx.fillStyle = expr.taken ? '#ff9f68' : '#ffd9bc'
  ctx.beginPath()
  ctx.ellipse(w / 2, h / 2, 90, 110, 0, 0, Math.PI * 2)
  ctx.fill()

  // Sombra debajo (profundidad)
  ctx.fillStyle = 'rgba(0, 0, 0, 0.15)'
  ctx.beginPath()
  ctx.ellipse(w / 2, h / 2 + 95, 85, 15, 0, 0, Math.PI * 2)
  ctx.fill()

  // === OJOS ===
  const eyeY = h / 2 - 20
  const eyeL = w / 2 - 30
  const eyeR = w / 2 + 30

  // Cuencas (sombra)
  ctx.fillStyle = 'rgba(0, 0, 0, 0.1)'
  ctx.beginPath()
  ctx.ellipse(eyeL, eyeY, 20, 22, 0, 0, Math.PI * 2)
  ctx.fill()
  ctx.beginPath()
  ctx.ellipse(eyeR, eyeY, 20, 22, 0, 0, Math.PI * 2)
  ctx.fill()

  // Blanco del ojo
  ctx.fillStyle = '#ffffff'
  const eyeScale = expr.eyeScale ?? 1
  const blinkMult = expr.blink ?? 1
  ctx.beginPath()
  ctx.ellipse(eyeL, eyeY, 16 * eyeScale, 18 * eyeScale * blinkMult, 0, 0, Math.PI * 2)
  ctx.fill()
  ctx.beginPath()
  ctx.ellipse(eyeR, eyeY, 16 * eyeScale, 18 * eyeScale * blinkMult, 0, 0, Math.PI * 2)
  ctx.fill()

  // Pupila
  ctx.fillStyle = '#0a0a1a'
  ctx.beginPath()
  ctx.ellipse(eyeL, eyeY, 9 * eyeScale, 11 * eyeScale * blinkMult, 0, 0, Math.PI * 2)
  ctx.fill()
  ctx.beginPath()
  ctx.ellipse(eyeR, eyeY, 9 * eyeScale, 11 * eyeScale * blinkMult, 0, 0, Math.PI * 2)
  ctx.fill()

  // Brillo en ojos
  ctx.fillStyle = '#ffffff'
  ctx.beginPath()
  ctx.ellipse(eyeL - 5, eyeY - 3, 5, 5, 0, 0, Math.PI * 2)
  ctx.fill()
  ctx.beginPath()
  ctx.ellipse(eyeR - 5, eyeY - 3, 5, 5, 0, 0, Math.PI * 2)
  ctx.fill()

  // === CEJAS ===
  ctx.strokeStyle = '#16233a'
  ctx.lineWidth = 4
  ctx.lineCap = 'round'

  const browY = eyeY - 28
  const browRot = expr.browRot ?? 0

  // Ceja izquierda
  ctx.save()
  ctx.translate(eyeL, browY)
  ctx.rotate(browRot)
  ctx.beginPath()
  ctx.moveTo(-18, 0)
  ctx.quadraticCurveTo(-5, -8, 8, -3)
  ctx.stroke()
  ctx.restore()

  // Ceja derecha
  ctx.save()
  ctx.translate(eyeR, browY)
  ctx.rotate(-browRot)
  ctx.beginPath()
  ctx.moveTo(-8, -3)
  ctx.quadraticCurveTo(5, -8, 18, 0)
  ctx.stroke()
  ctx.restore()

  // === NARIZ ===
  ctx.fillStyle = expr.taken ? '#ff9f68' : '#ffc9a8'
  ctx.beginPath()
  ctx.ellipse(w / 2, h / 2 + 5, 12, 18, 0, 0, Math.PI * 2)
  ctx.fill()

  // === MEJILLAS ===
  if (expr.cheekOpacity > 0) {
    ctx.fillStyle = `rgba(255, 136, 153, ${expr.cheekOpacity * 0.4})`
    ctx.beginPath()
    ctx.ellipse(eyeL - 35, h / 2 + 10, 22, 18, 0, 0, Math.PI * 2)
    ctx.fill()
    ctx.beginPath()
    ctx.ellipse(eyeR + 35, h / 2 + 10, 22, 18, 0, 0, Math.PI * 2)
    ctx.fill()
  }

  // === BOCA ===
  const mouthY = h / 2 + 50
  ctx.strokeStyle = '#16233a'
  ctx.fillStyle = '#e74c3c'
  ctx.lineWidth = 2

  if (expr.expression === 'surprise') {
    // Boca abierta
    ctx.fillStyle = '#cc3333'
    ctx.beginPath()
    ctx.ellipse(w / 2, mouthY, 18, 22 * (expr.mouthOpen ?? 0.5), 0, 0, Math.PI * 2)
    ctx.fill()
  } else if (expr.expression === 'happy') {
    // Sonrisa
    ctx.strokeStyle = '#ff6b6b'
    ctx.lineWidth = 5
    ctx.beginPath()
    ctx.arc(w / 2, mouthY - 10, 28, 0.2, Math.PI - 0.2, false)
    ctx.stroke()
  } else {
    // Línea neutra
    ctx.strokeStyle = '#16233a'
    ctx.lineWidth = 3
    ctx.beginPath()
    ctx.moveTo(w / 2 - 20, mouthY)
    ctx.quadraticCurveTo(w / 2, mouthY + 5, w / 2 + 20, mouthY)
    ctx.stroke()
  }
}

export default function Head2D({ expression = 'idle', taken = false, blink = 1 }) {
  const canvasRef = useRef()
  const textureRef = useRef()

  // Mapear expressiones
  const exprMap = {
    idle: { eyeScale: 1, browRot: 0, cheekOpacity: 0.1, blink, expression: 'idle' },
    surprise: { eyeScale: 1.3, browRot: -0.25, cheekOpacity: 0.2, mouthOpen: 0.8, blink, expression: 'surprise' },
    happy: { eyeScale: 1.15, browRot: 0.2, cheekOpacity: 0.75, mouthOpen: 0.5, blink, expression: 'happy' },
    confused: { eyeScale: 1.05, browRot: 0.15, cheekOpacity: 0.2, blink, expression: 'idle' },
  }

  useEffect(() => {
    if (!canvasRef.current) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    const expr = exprMap[expression] || exprMap.idle
    expr.taken = taken

    // Dibujar cara
    drawFaceCanvas(ctx, expr)

    // Crear textura
    if (textureRef.current) textureRef.current.dispose()
    textureRef.current = new CanvasTexture(canvas)

    return () => {
      // Cleanup
    }
  }, [expression, taken, blink])

  return (
    <>
      <canvas ref={canvasRef} width={256} height={256} style={{ display: 'none' }} />
      <mesh position={[0, 0, 0]}>
        <planeGeometry args={[0.25, 0.25]} />
        <meshStandardMaterial map={textureRef.current} roughness={0.7} metalness={0} />
      </mesh>
    </>
  )
}
