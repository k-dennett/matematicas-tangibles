// Lógica matemática PURA de fracciones.
// Sin dependencias de React ni de three. Debe ser testeable de forma aislada.
// Esta es la parte donde un error hace más daño: la matemática tiene que ser correcta.
//
// Convención: una fracción es { numerador, denominador } con denominador > 0.

/** Máximo común divisor (Euclides). */
export function gcd(a, b) {
  a = Math.abs(a)
  b = Math.abs(b)
  while (b) {
    ;[a, b] = [b, a % b]
  }
  return a
}

/** Crea una fracción validada. */
export function makeFraction(numerador, denominador) {
  if (!Number.isInteger(numerador) || !Number.isInteger(denominador)) {
    throw new Error('numerador y denominador deben ser enteros')
  }
  if (denominador === 0) {
    throw new Error('el denominador no puede ser 0')
  }
  return { numerador, denominador }
}

/** Simplifica a su mínima expresión. */
export function simplify({ numerador, denominador }) {
  const d = gcd(numerador, denominador) || 1
  return { numerador: numerador / d, denominador: denominador / d }
}

/** Valor decimal (útil para ubicar en la recta numérica). */
export function toDecimal({ numerador, denominador }) {
  return numerador / denominador
}

/** ¿Son equivalentes? (p. ej. 1/2 y 2/4) */
export function areEquivalent(a, b) {
  return a.numerador * b.denominador === b.numerador * a.denominador
}

/**
 * Compara dos fracciones.
 * Retorna -1 si a < b, 0 si a === b, 1 si a > b.
 */
export function compare(a, b) {
  const left = a.numerador * b.denominador
  const right = b.numerador * a.denominador
  if (left < right) return -1
  if (left > right) return 1
  return 0
}

/** Suma con IGUAL denominador (MA04 OA 09). Lanza error si difieren. */
export function addSameDenominator(a, b) {
  if (a.denominador !== b.denominador) {
    throw new Error('addSameDenominator requiere igual denominador')
  }
  return { numerador: a.numerador + b.numerador, denominador: a.denominador }
}

/** Resta con IGUAL denominador (MA04 OA 09). */
export function subtractSameDenominator(a, b) {
  if (a.denominador !== b.denominador) {
    throw new Error('subtractSameDenominator requiere igual denominador')
  }
  return { numerador: a.numerador - b.numerador, denominador: a.denominador }
}

/** Formato simbólico "n/d". */
export function format({ numerador, denominador }) {
  return `${numerador}/${denominador}`
}
