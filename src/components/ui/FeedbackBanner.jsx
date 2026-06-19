import { useEffect, useRef } from 'react'
import { useAudio } from '../../hooks/useAudio.js'

// Banner de feedback. Dos tonos (docs/02 y 05):
//  - "logro": celebración SOBRIA y positiva.
//  - "pista": orienta sin penalizar; aparece como andamiaje tras varios intentos.
// Reproduce su audio UNA vez al aparecer y deja un botón para repetirlo.

export default function FeedbackBanner({ tipo, contenido }) {
  const { play } = useAudio()
  const yaSono = useRef(false)

  // Reproducir una sola vez al aparecer. El ref evita el doble-disparo del
  // doble-montaje de React StrictMode (que encadenaba dos play() y colgaba la voz).
  useEffect(() => {
    if (yaSono.current) return
    yaSono.current = true
    if (contenido) play(contenido)
  }, [tipo, contenido, play])

  if (!contenido) return null

  return (
    <div className={`feedback feedback--${tipo}`} role="status" aria-live="polite">
      <p className="feedback__text">{contenido.texto}</p>
      <button className="btn btn--audio" onClick={() => play(contenido)} aria-label="Escuchar de nuevo">
        <span aria-hidden="true">🔊</span> Repetir
      </button>
    </div>
  )
}
