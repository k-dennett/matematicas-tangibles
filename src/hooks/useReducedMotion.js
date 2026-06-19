import { useEffect } from 'react'
import { useSettingsStore } from '../state/settingsStore.js'

// Sincroniza la preferencia del sistema `prefers-reduced-motion` con el
// settingsStore y la devuelve. Los componentes (3D y UI) la consultan para
// ofrecer una versión con menos/sin animación (accesibilidad, docs/03 y 05).

const QUERY = '(prefers-reduced-motion: reduce)'

export function useReducedMotion() {
  const reducedMotion = useSettingsStore((s) => s.reducedMotion)
  const setReducedMotion = useSettingsStore((s) => s.setReducedMotion)

  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return
    const mq = window.matchMedia(QUERY)
    setReducedMotion(mq.matches)
    const onChange = (e) => setReducedMotion(e.matches)
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [setReducedMotion])

  return reducedMotion
}
