// Lógica PURA de evaluación de metas de una actividad.
// Sin React ni three. Es lo que el motor de actividades usa para decidir si el
// estudiante alcanzó el objetivo. Mantenerla pura la hace testeable de forma aislada.
//
// El "estado vivo" de una actividad de fracción-parte-de-un-todo es:
//   { partes, tomadas }
//   - partes:  en cuántas partes iguales se dividió el todo (denominador). >= 1.
//   - tomadas: cuántas de esas partes tomó el estudiante (numerador). 0..partes.

import { makeFraction, areEquivalent } from './fractions.js'

/**
 * La fracción que el estudiante construyó hasta ahora, derivada del estado vivo.
 * Es SIEMPRE derivada (nunca se guarda aparte): así las tres representaciones
 * leen el mismo origen y no pueden desincronizarse.
 */
export function currentFraction({ partes, tomadas }) {
  return makeFraction(tomadas, partes)
}

/**
 * Evalúa la meta de una actividad contra el estado vivo.
 *
 * Soporta `meta.tipo === 'fraccionObjetivo'` (ver docs/06):
 *   meta = { tipo: 'fraccionObjetivo', fraccion: { numerador, denominador }, permitirEquivalentes? }
 *
 * Por defecto exige coincidencia EXACTA (la instrucción dice "parte en N partes y
 * toma M", así que 3/4 se logra con 4 partes y 3 tomadas, no con 6/8). Si la
 * definición pone `permitirEquivalentes: true`, basta con un valor equivalente
 * (6/8 cuenta como 3/4) — útil para actividades de equivalencia más adelante.
 *
 * Devuelve información rica para que el motor arme el feedback/pista sin recalcular:
 *   { cumplida, exacto, equivalente, actual, objetivo, faltanTomar }
 */
export function evaluateGoal(estado, meta) {
  switch (meta.tipo) {
    case 'fraccionObjetivo': {
      const actual = currentFraction(estado)
      const objetivo = makeFraction(meta.fraccion.numerador, meta.fraccion.denominador)

      const exacto = actual.numerador === objetivo.numerador && actual.denominador === objetivo.denominador
      const equivalente = areEquivalent(actual, objetivo)
      const cumplida = meta.permitirEquivalentes ? equivalente : exacto

      // Pista para el feedback orientador cuando el denominador YA coincide pero el
      // numerador no: cuántas partes faltan por tomar (negativo = tomó de más).
      const faltanTomar =
        actual.denominador === objetivo.denominador ? objetivo.numerador - actual.numerador : null

      return { cumplida, exacto, equivalente, actual, objetivo, faltanTomar }
    }
    default:
      throw new Error(`meta.tipo no soportado: ${meta.tipo}`)
  }
}
