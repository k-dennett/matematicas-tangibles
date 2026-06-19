import { create } from 'zustand'

// Ajustes globales de la app (accesibilidad y modo de uso).
// No es la fuente de verdad de la actividad (eso es activityStore); aquí van
// preferencias transversales: audio, movimiento reducido y modo de uso.

const DEFAULTS = {
  audio: true, // las instrucciones se pueden escuchar (clave para quien aún no lee)
  // reducedMotion arranca en false; el hook useReducedMotion lo sincroniza con la
  // media query `prefers-reduced-motion` (no tocamos el DOM aquí para mantener el
  // store puro y testeable).
  reducedMotion: false,
  modo: 'individual', // 'individual' | 'proyeccion' (sala completa)
}

export const useSettingsStore = create((set) => ({
  ...DEFAULTS,

  toggleAudio: () => set((s) => ({ audio: !s.audio })),
  setAudio: (audio) => set({ audio: !!audio }),
  setReducedMotion: (reducedMotion) => set({ reducedMotion: !!reducedMotion }),
  setModo: (modo) => set({ modo }),

  reiniciar: () => set({ ...DEFAULTS }),
}))
