import { useAudio } from '../../hooks/useAudio.js'

// Instrucción de la actividad: texto + botón para escucharla (docs/05: el audio
// siempre disponible, para quien aún no lee con fluidez).
//
// NO habla sola al cargar: la política de autoplay del navegador bloquea
// SpeechSynthesis sin un gesto del usuario y, peor, deja el motor de voz trabado
// (speaking:true), lo que silencia todo lo demás. La voz suena al tocar "Escuchar".

export default function InstructionPanel({ instruccion }) {
  const { play } = useAudio()

  return (
    <div className="instruction">
      <p className="instruction__text">{instruccion?.texto}</p>
      <button className="btn btn--audio" onClick={() => play(instruccion)} aria-label="Escuchar la instrucción">
        <span aria-hidden="true">🔊</span> Escuchar
      </button>
    </div>
  )
}
