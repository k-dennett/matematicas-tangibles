import { describe, it, expect } from 'vitest'
import {
  gcd,
  makeFraction,
  simplify,
  toDecimal,
  areEquivalent,
  compare,
  addSameDenominator,
  subtractSameDenominator,
  format,
} from './fractions.js'

describe('gcd', () => {
  it('calcula el máximo común divisor', () => {
    expect(gcd(12, 8)).toBe(4)
    expect(gcd(8, 12)).toBe(4)
    expect(gcd(7, 5)).toBe(1) // coprimos
    expect(gcd(9, 3)).toBe(3)
  })

  it('maneja el 0 (gcd(n,0) === n)', () => {
    expect(gcd(5, 0)).toBe(5)
    expect(gcd(0, 5)).toBe(5)
  })

  it('usa el valor absoluto', () => {
    expect(gcd(-12, 8)).toBe(4)
    expect(gcd(12, -8)).toBe(4)
  })
})

describe('makeFraction', () => {
  it('crea una fracción válida', () => {
    expect(makeFraction(3, 4)).toEqual({ numerador: 3, denominador: 4 })
  })

  it('rechaza no-enteros', () => {
    expect(() => makeFraction(1.5, 4)).toThrow()
    expect(() => makeFraction(3, 2.5)).toThrow()
  })

  it('rechaza denominador 0', () => {
    expect(() => makeFraction(3, 0)).toThrow()
  })

  it('permite numerador 0 (cero partes tomadas)', () => {
    expect(makeFraction(0, 4)).toEqual({ numerador: 0, denominador: 4 })
  })
})

describe('simplify', () => {
  it('reduce a la mínima expresión', () => {
    expect(simplify({ numerador: 6, denominador: 8 })).toEqual({ numerador: 3, denominador: 4 })
    expect(simplify({ numerador: 2, denominador: 4 })).toEqual({ numerador: 1, denominador: 2 })
    expect(simplify({ numerador: 10, denominador: 5 })).toEqual({ numerador: 2, denominador: 1 })
  })

  it('deja igual una fracción ya reducida', () => {
    expect(simplify({ numerador: 3, denominador: 4 })).toEqual({ numerador: 3, denominador: 4 })
  })

  it('simplifica 0/d a 0/1 sin dividir por cero', () => {
    // 0/4 = 0/1 es la mínima expresión correcta. (En la actividad la fracción viva
    // se muestra cruda con currentFraction, no se pasa por simplify, así que el
    // estudiante igual ve "0/4".)
    expect(simplify({ numerador: 0, denominador: 4 })).toEqual({ numerador: 0, denominador: 1 })
  })
})

describe('toDecimal', () => {
  it('entrega el valor decimal', () => {
    expect(toDecimal({ numerador: 1, denominador: 2 })).toBe(0.5)
    expect(toDecimal({ numerador: 3, denominador: 4 })).toBe(0.75)
    expect(toDecimal({ numerador: 0, denominador: 4 })).toBe(0)
  })
})

describe('areEquivalent', () => {
  it('reconoce fracciones equivalentes', () => {
    expect(areEquivalent({ numerador: 1, denominador: 2 }, { numerador: 2, denominador: 4 })).toBe(true)
    expect(areEquivalent({ numerador: 3, denominador: 4 }, { numerador: 6, denominador: 8 })).toBe(true)
  })

  it('distingue fracciones no equivalentes', () => {
    expect(areEquivalent({ numerador: 1, denominador: 2 }, { numerador: 1, denominador: 3 })).toBe(false)
    expect(areEquivalent({ numerador: 3, denominador: 4 }, { numerador: 2, denominador: 4 })).toBe(false)
  })
})

describe('compare', () => {
  it('retorna -1 / 0 / 1', () => {
    expect(compare({ numerador: 1, denominador: 4 }, { numerador: 1, denominador: 2 })).toBe(-1)
    expect(compare({ numerador: 1, denominador: 2 }, { numerador: 1, denominador: 4 })).toBe(1)
    expect(compare({ numerador: 1, denominador: 2 }, { numerador: 2, denominador: 4 })).toBe(0)
  })

  it('captura el error intuitivo común: 1/5 < 1/2 (mayor denominador = parte menor)', () => {
    expect(compare({ numerador: 1, denominador: 5 }, { numerador: 1, denominador: 2 })).toBe(-1)
  })
})

describe('addSameDenominator', () => {
  it('suma con igual denominador', () => {
    expect(addSameDenominator({ numerador: 1, denominador: 4 }, { numerador: 2, denominador: 4 })).toEqual({
      numerador: 3,
      denominador: 4,
    })
  })

  it('lanza error con distinto denominador', () => {
    expect(() => addSameDenominator({ numerador: 1, denominador: 4 }, { numerador: 1, denominador: 2 })).toThrow()
  })
})

describe('subtractSameDenominator', () => {
  it('resta con igual denominador', () => {
    expect(subtractSameDenominator({ numerador: 3, denominador: 4 }, { numerador: 1, denominador: 4 })).toEqual({
      numerador: 2,
      denominador: 4,
    })
  })

  it('lanza error con distinto denominador', () => {
    expect(() => subtractSameDenominator({ numerador: 3, denominador: 4 }, { numerador: 1, denominador: 2 })).toThrow()
  })
})

describe('format', () => {
  it('da el formato simbólico n/d', () => {
    expect(format({ numerador: 3, denominador: 4 })).toBe('3/4')
    expect(format({ numerador: 0, denominador: 4 })).toBe('0/4')
  })
})
