import { describe, it, expect } from 'vitest'
import { currentFraction, evaluateGoal } from './activityGoal.js'

describe('currentFraction', () => {
  it('deriva la fracción desde el estado vivo', () => {
    expect(currentFraction({ partes: 4, tomadas: 3 })).toEqual({ numerador: 3, denominador: 4 })
  })

  it('barra entera sin tomar nada = 0/1', () => {
    expect(currentFraction({ partes: 1, tomadas: 0 })).toEqual({ numerador: 0, denominador: 1 })
  })
})

describe('evaluateGoal · fraccionObjetivo (coincidencia exacta por defecto)', () => {
  const meta = { tipo: 'fraccionObjetivo', fraccion: { numerador: 3, denominador: 4 } }

  it('se cumple con 4 partes y 3 tomadas (3/4)', () => {
    const r = evaluateGoal({ partes: 4, tomadas: 3 }, meta)
    expect(r.cumplida).toBe(true)
    expect(r.exacto).toBe(true)
    expect(r.equivalente).toBe(true)
    expect(r.faltanTomar).toBe(0)
  })

  it('NO se cumple con 6/8 aunque sea equivalente (la instrucción pide partir en 4)', () => {
    const r = evaluateGoal({ partes: 8, tomadas: 6 }, meta)
    expect(r.cumplida).toBe(false)
    expect(r.exacto).toBe(false)
    expect(r.equivalente).toBe(true)
    expect(r.faltanTomar).toBe(null) // denominador distinto: no aplica la pista de "faltan"
  })

  it('mismo denominador, faltan partes por tomar', () => {
    const r = evaluateGoal({ partes: 4, tomadas: 2 }, meta)
    expect(r.cumplida).toBe(false)
    expect(r.faltanTomar).toBe(1) // faltan 1 para llegar a 3
  })

  it('mismo denominador, tomó de más (faltanTomar negativo)', () => {
    const r = evaluateGoal({ partes: 4, tomadas: 4 }, meta)
    expect(r.cumplida).toBe(false)
    expect(r.faltanTomar).toBe(-1)
  })
})

describe('evaluateGoal · fraccionObjetivo con permitirEquivalentes', () => {
  const meta = {
    tipo: 'fraccionObjetivo',
    fraccion: { numerador: 3, denominador: 4 },
    permitirEquivalentes: true,
  }

  it('acepta 6/8 como equivalente de 3/4', () => {
    const r = evaluateGoal({ partes: 8, tomadas: 6 }, meta)
    expect(r.cumplida).toBe(true)
    expect(r.exacto).toBe(false)
    expect(r.equivalente).toBe(true)
  })

  it('sigue rechazando un valor distinto', () => {
    const r = evaluateGoal({ partes: 4, tomadas: 2 }, meta)
    expect(r.cumplida).toBe(false)
  })
})

describe('evaluateGoal · meta no soportada', () => {
  it('lanza error para tipos desconocidos', () => {
    expect(() => evaluateGoal({ partes: 4, tomadas: 3 }, { tipo: 'otraCosa' })).toThrow()
  })
})
