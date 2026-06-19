import { create } from 'zustand'

// ÚNICA FUENTE DE VERDAD del estado vivo de la actividad en curso.
//
// Las tres representaciones (objeto 3D, dibujo pictórico, símbolo n/d) LEEN este
// mismo estado y nunca guardan una copia propia. El manipulable 3D no muta nada
// directamente: solo despacha acciones (dividir / alternarParte). Por eso las tres
// vistas no pueden desincronizarse — la sincronía es por construcción.
//
// Estado crudo de "la fracción como parte de un todo":
//   - partes: en cuántas partes iguales está dividido el todo (denominador). >= 1.
//             1 = barra entera, sin partir todavía.
//   - taken:  arreglo ordenado con los índices de las partes tomadas. El numerador
//             es taken.length (qué partes específicas se tomaron da igual para la
//             fracción; lo que importa es cuántas).
//   - intentos / lograda: progreso de la actividad; los fija el motor, no el render.

const ESTADO_INICIAL = {
  partes: 1,
  taken: [],
  intentos: 0,
  lograda: false,
}

export const useActivityStore = create((set) => ({
  ...ESTADO_INICIAL,

  /** Dividir el todo en `n` partes iguales. Resetea tomadas, logro e intentos
   *  (una nueva división es un intento fresco). */
  dividir: (n) =>
    set(() => {
      const partes = Math.max(1, Math.floor(n))
      return { partes, taken: [], lograda: false, intentos: 0 }
    }),

  /** Tomar/soltar la parte `i` (toggle). Ignora índices fuera de rango. */
  alternarParte: (i) =>
    set((s) => {
      if (!Number.isInteger(i) || i < 0 || i >= s.partes) return s
      const taken = s.taken.includes(i)
        ? s.taken.filter((x) => x !== i)
        : [...s.taken, i].sort((a, b) => a - b)
      return { taken }
    }),

  /** Suma un intento (lo llama el motor cuando el estudiante "confirma"/falla). */
  registrarIntento: () => set((s) => ({ intentos: s.intentos + 1 })),

  /** Marca la meta como lograda (lo decide el motor con lib/activityGoal). */
  marcarLograda: (lograda = true) => set({ lograda }),

  /** Reinicia la actividad. `inicial` permite fijar las partes de arranque. */
  reiniciar: (inicial = {}) =>
    set({ ...ESTADO_INICIAL, partes: Math.max(1, Math.floor(inicial.partes ?? 1)) }),
}))

/**
 * Selector: estado vivo en la forma que espera lib/activityGoal ({ partes, tomadas }).
 * Úsalo para alimentar evaluateGoal sin recalcular en cada componente.
 */
export const selectFraccionEstado = (s) => ({ partes: s.partes, tomadas: s.taken.length })
