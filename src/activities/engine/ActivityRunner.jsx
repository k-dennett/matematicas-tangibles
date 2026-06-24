import { useEffect, useMemo, useRef } from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls, Bounds, useBounds, Sparkles } from '@react-three/drei'
import { CanvasTexture, RepeatWrapping } from 'three'
import FractionBar from '../../components/manipulatives/FractionBar.jsx'
import PictorialFraction from '../../components/representations/PictorialFraction.jsx'
import SymbolicFraction from '../../components/representations/SymbolicFraction.jsx'
import GuideMascot from '../../components/ui/GuideMascot.jsx'
import SplitControl from '../../components/ui/SplitControl.jsx'
import PartToggles from '../../components/ui/PartToggles.jsx'
import InstructionPanel from '../../components/ui/InstructionPanel.jsx'
import FeedbackBanner from '../../components/ui/FeedbackBanner.jsx'
import { useActivityStore, selectFraccionEstado } from '../../state/activityStore.js'
import { useReducedMotion } from '../../hooks/useReducedMotion.js'
import { evaluateGoal } from '../../lib/activityGoal.js'

// Motor de actividades: interpreta una definición y conecta el manipulable 3D + las
// representaciones al MISMO estado del activityStore, evalúa la meta con la lógica
// pura de lib/ y orquesta el feedback. Sin penalización ni tiempo (docs/02).

// Re-encuadra la cámara (vía <Bounds>) para que la barra completa quepa y quede
// centrada al cambiar el número de partes. Así se ve bien en notebook/proyector y
// en tablet, sin importar el aspecto del canvas.
function FitToBar({ partes }) {
  const bounds = useBounds()
  useEffect(() => {
    bounds.refresh().clip().fit()
  }, [partes, bounds])
  return null
}

function SoftShadowBlob({ position = [0, -0.78, 0], scale = [6, 1.6, 1], opacity = 0.2, color = '#12213c' }) {
  const texture = useMemo(() => {
    const canvas = document.createElement('canvas')
    canvas.width = 256
    canvas.height = 128
    const ctx = canvas.getContext('2d')
    const gradient = ctx.createRadialGradient(128, 64, 8, 128, 64, 108)
    gradient.addColorStop(0, 'rgba(0,0,0,0.48)')
    gradient.addColorStop(0.45, 'rgba(0,0,0,0.18)')
    gradient.addColorStop(1, 'rgba(0,0,0,0)')
    ctx.fillStyle = gradient
    ctx.fillRect(0, 0, 256, 128)
    const tex = new CanvasTexture(canvas)
    tex.wrapS = RepeatWrapping
    tex.wrapT = RepeatWrapping
    tex.needsUpdate = true
    return tex
  }, [])

  useEffect(() => () => texture.dispose(), [texture])

  return (
    <mesh position={position} rotation={[-Math.PI / 2, 0, 0]} scale={scale}>
      <planeGeometry args={[1, 1]} />
      <meshBasicMaterial map={texture} transparent opacity={opacity} color={color} depthWrite={false} />
    </mesh>
  )
}

export default function ActivityRunner({ definicion }) {
  const partes = useActivityStore((s) => s.partes)
  const taken = useActivityStore((s) => s.taken)
  const intentos = useActivityStore((s) => s.intentos)
  const dividir = useActivityStore((s) => s.dividir)
  const alternarParte = useActivityStore((s) => s.alternarParte)
  const registrarIntento = useActivityStore((s) => s.registrarIntento)
  const marcarLograda = useActivityStore((s) => s.marcarLograda)
  const reiniciar = useActivityStore((s) => s.reiniciar)
  const reducedMotion = useReducedMotion()

  // Al montar la actividad, la barra arranca entera (sin partir).
  useEffect(() => {
    reiniciar({ partes: 1 })
  }, [definicion.id, reiniciar])

  const dividida = partes > 1
  const maxPartes = definicion?.manipulativo?.maxPartes ?? 12

  // Evaluación de la meta con la lógica PURA de lib/ (única fuente de verdad → resultado).
  const resultado = useMemo(
    () => evaluateGoal(selectFraccionEstado({ partes, taken }), definicion.meta),
    [partes, taken, definicion.meta],
  )
  const cumplida = resultado.cumplida

  // Logro: marcar al pasar de no-cumplida a cumplida (el audio lo dispara el banner).
  const eraCumplida = useRef(false)
  useEffect(() => {
    if (cumplida && !eraCumplida.current) marcarLograda(true)
    eraCumplida.current = cumplida
  }, [cumplida, marcarLograda])

  // Intentos: cuenta cuando el estudiante TOMA una parte (no soltar) y, habiendo
  // tomado ya al menos las que pide la meta, el resultado sigue sin ser correcto.
  // No penaliza: solo sirve para ofrecer una pista de andamiaje más adelante.
  const largoPrevio = useRef(0)
  const objetivoNum = definicion.meta?.fraccion?.numerador ?? Infinity
  useEffect(() => {
    const largo = taken.length
    if (largo > largoPrevio.current && !cumplida && largo >= objetivoNum) {
      registrarIntento()
    }
    largoPrevio.current = largo
  }, [taken, cumplida, objetivoNum, registrarIntento])

  const pistaTrasIntentos = definicion.andamiaje?.pistaTrasIntentos ?? 2
  const mostrarPista = !cumplida && intentos >= pistaTrasIntentos
  const mood = cumplida ? 'celebra' : taken.length > 0 ? 'animada' : 'idle'

  return (
    <div className="activity">
      <div className="activity__stage">
        <Canvas dpr={[1, 2]} camera={{ position: [0, 1.9, 5.4], fov: 42 }}>
          <color attach="background" args={['#f7f9ff']} />
          <fog attach="fog" args={['#f7f9ff', 7, 15]} />
        <ambientLight intensity={0.98} />
        <hemisphereLight intensity={0.7} groundColor="#d6e0ef" />
        <directionalLight position={[4, 7, 5]} intensity={1.15} />
        <SoftShadowBlob position={[-0.1, -0.78, 0.05]} scale={[6.3, 1.7, 1]} opacity={0.16} color="#16233a" />
        <SoftShadowBlob position={[-2.45, 0.02, 0.7]} scale={[1.9, 1.2, 1]} opacity={0.12} color="#16233a" />
        <Sparkles count={18} size={2.4} speed={0.25} opacity={0.2} scale={[9, 4, 5]} color="#ff8a3d" />
        <Sparkles count={10} size={1.8} speed={0.18} opacity={0.16} scale={[6, 3, 4]} color="#2e6be6" />
        <GuideMascot reducedMotion={reducedMotion} mood={mood} position={[-2.45, 1.25, 0.7]} />
        <Bounds fit clip observe margin={1.25} maxDuration={reducedMotion ? 0.2 : 0.6}>
          <FitToBar partes={partes} />
          <FractionBar
            partes={partes}
            taken={taken}
              // Solo se pueden tomar partes una vez que la barra está partida.
              onToggleParte={dividida ? alternarParte : undefined}
              reducedMotion={reducedMotion}
              mood={mood}
            />
          </Bounds>
          <OrbitControls makeDefault enablePan={false} minDistance={1.5} maxPolarAngle={Math.PI / 2} />
        </Canvas>
      </div>

      <aside className="activity__panel">
        <h1 className="activity__title">{definicion.titulo}</h1>
        <InstructionPanel instruccion={definicion.instruccion} />

        <SplitControl maxPartes={maxPartes} onDividir={dividir} />
        <PartToggles partes={partes} taken={taken} onToggle={alternarParte} />

        <div className="reps">
          <PictorialFraction partes={partes} taken={taken} />
          <SymbolicFraction numerador={taken.length} denominador={partes} dividida={dividida} />
        </div>

        {/* Aviso para lectores de pantalla: anuncia la fracción al cambiar. */}
        <p className="sr-only" aria-live="polite">
          {dividida ? `${taken.length} de ${partes} partes tomadas` : 'Barra sin partir'}
        </p>

        {cumplida && <FeedbackBanner tipo="logro" contenido={definicion.feedback?.logro} />}
        {mostrarPista && <FeedbackBanner tipo="pista" contenido={definicion.feedback?.pista} />}
      </aside>
    </div>
  )
}
