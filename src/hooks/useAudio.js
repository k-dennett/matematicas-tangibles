import { useCallback } from 'react'
import { useSettingsStore } from '../state/settingsStore.js'

// Reproduce el audio de instrucciones y feedback. Recibe un descriptor
// { texto, audio } (el mismo que traen las definiciones de actividad, ver docs/06)
// y respeta el ajuste global de audio (settingsStore.audio).
//
// ⚠️⚠️ TEMPORAL — SpeechSynthesis (voz del navegador) es solo un STOPGAP para poder
// probar el flujo. NO va al producto final: los audios definitivos son archivos
// grabados con voz humana (español de Chile, tono cálido), ver docs/06.
// Cuando se agreguen los .mp3 en /public/audio, poner AUDIOS_GRABADOS = true y se
// usarán los archivos automáticamente; el stopgap de voz dejará de activarse.

// TEMP: mientras no existan los archivos grabados, vamos directo a la voz del
// navegador para no generar un 404 por cada reproducción.
const AUDIOS_GRABADOS = false

let current = null // <audio> en reproducción, para poder cortarlo
let currentUtterance = null // referencia viva: evita que el GC corte la locución (bug Chrome)

// Voces: Chrome devuelve [] en la primera llamada y las carga ASÍNCRONO (evento
// 'voiceschanged'). Si hablamos con 0 voces, la locución NO arranca y el motor queda
// colgado en speaking:true. Por eso "cebamos" la lista al importar el módulo (apenas
// arranca la app), así para cuando el usuario hace clic ya hay voces disponibles.
let voices = []
function refreshVoices() {
  if (typeof window !== 'undefined' && window.speechSynthesis) {
    voices = window.speechSynthesis.getVoices()
  }
}
if (typeof window !== 'undefined' && window.speechSynthesis) {
  refreshVoices()
  window.speechSynthesis.addEventListener('voiceschanged', refreshVoices)
}

// Voz en español: es-CL (rara vez existe) → es-MX/es-ES/es-419 → cualquier es-*.
function pickSpanishVoice() {
  return (
    voices.find((v) => /^es-CL/i.test(v.lang)) ||
    voices.find((v) => /^es-(MX|ES|419)/i.test(v.lang)) ||
    voices.find((v) => /^es/i.test(v.lang)) ||
    null
  )
}

// ⚠️ TEMP stopgap — eliminar junto con AUDIOS_GRABADOS cuando existan los audios.
//
// SpeechSynthesis de Chrome tiene defectos conocidos que hay que sortear:
//  - speak() DEBE correr dentro del gesto del usuario (en el clic). Diferirlo con
//    setTimeout lo silencia. => speak() SÍNCRONO.
//  - Tras hablar una vez, el motor queda atascado y la siguiente locución sale muda
//    si no se resetea. => reseteamos con cancel() al TERMINAR cada locución (onend),
//    no en el clic, para no gatillar la carrera cancel()+speak() del mismo tick.
//  - A veces el motor queda "pausado". => resume() antes de hablar (no cancela nada).
function speakFallback(texto) {
  const ss = typeof window !== 'undefined' ? window.speechSynthesis : null
  if (!texto || !ss) return

  if (voices.length === 0) refreshVoices() // último intento por si ya cargaron
  const voice = pickSpanishVoice()

  const busy = ss.speaking || ss.pending

  const u = new SpeechSynthesisUtterance(texto)
  if (voice) u.voice = voice // voz explícita
  u.lang = voice ? voice.lang : 'es-CL'
  u.rate = 0.95 // un pelo más lento, para niñas y niños que recién leen
  currentUtterance = u

  // Soltar la referencia al terminar/fallar (evita fugas y permite el GC).
  u.onend = () => {
    if (currentUtterance === u) currentUtterance = null
  }
  u.onerror = () => {
    if (currentUtterance === u) currentUtterance = null
  }

  if (busy) {
    // Hay algo sonando: lo interrumpimos y hablamos en el SIGUIENTE tick. Hacer
    // cancel()+speak() en el MISMO tick deja el motor colgado (la carrera de Chrome).
    ss.cancel()
    setTimeout(() => {
      if (currentUtterance === u) ss.speak(u)
    }, 0)
  } else {
    // Motor limpio: hablar YA, síncrono, para preservar el gesto del usuario
    // (requisito de Chrome para el botón "Escuchar").
    ss.speak(u)
  }
}

function stopAll() {
  if (current) {
    current.pause()
    current = null
  }
  if (typeof window !== 'undefined' && window.speechSynthesis) window.speechSynthesis.cancel()
}

export function useAudio() {
  const audioOn = useSettingsStore((s) => s.audio)

  const play = useCallback(
    (descriptor) => {
      if (!audioOn || !descriptor) return
      const { audio, texto } = descriptor

      if (audio && AUDIOS_GRABADOS) {
        stopAll()
        const el = new Audio(audio)
        current = el
        let usedFallback = false
        const fallback = () => {
          if (!usedFallback) {
            usedFallback = true
            speakFallback(texto)
          }
        }
        el.addEventListener('error', fallback)
        el.play().catch(fallback)
      } else {
        // Corta cualquier <audio> grabado en curso; el ÚNICO cancel() de voz lo hace
        // speakFallback (+ speak diferido), para no duplicar el cancel ni gatillar la carrera.
        if (current) {
          current.pause()
          current = null
        }
        speakFallback(texto)
      }
    },
    [audioOn],
  )

  return { play, stop: stopAll }
}
