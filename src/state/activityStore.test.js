import { describe, it, expect, beforeEach } from 'vitest'
import { useActivityStore, selectFraccionEstado } from './activityStore.js'

const get = () => useActivityStore.getState()

beforeEach(() => {
  useActivityStore.getState().reiniciar()
})

describe('estado inicial', () => {
  it('arranca como barra entera, sin tomar nada', () => {
    expect(get().partes).toBe(1)
    expect(get().taken).toEqual([])
    expect(get().intentos).toBe(0)
    expect(get().lograda).toBe(false)
  })
})

describe('dividir', () => {
  it('fija el número de partes', () => {
    get().dividir(4)
    expect(get().partes).toBe(4)
  })

  it('resetea las partes tomadas, el logro y los intentos (división fresca)', () => {
    get().dividir(4)
    get().alternarParte(0)
    get().marcarLograda(true)
    get().registrarIntento()
    get().dividir(6)
    expect(get().partes).toBe(6)
    expect(get().taken).toEqual([])
    expect(get().lograda).toBe(false)
    expect(get().intentos).toBe(0)
  })

  it('nunca baja de 1 parte', () => {
    get().dividir(0)
    expect(get().partes).toBe(1)
    get().dividir(-3)
    expect(get().partes).toBe(1)
  })
})

describe('alternarParte', () => {
  beforeEach(() => get().dividir(4))

  it('toma una parte', () => {
    get().alternarParte(2)
    expect(get().taken).toEqual([2])
  })

  it('suelta una parte ya tomada (toggle)', () => {
    get().alternarParte(2)
    get().alternarParte(2)
    expect(get().taken).toEqual([])
  })

  it('mantiene el arreglo ordenado', () => {
    get().alternarParte(3)
    get().alternarParte(0)
    get().alternarParte(1)
    expect(get().taken).toEqual([0, 1, 3])
  })

  it('ignora índices fuera de rango', () => {
    get().alternarParte(4) // partes = 4 → índices válidos 0..3
    get().alternarParte(-1)
    expect(get().taken).toEqual([])
  })
})

describe('selectFraccionEstado', () => {
  it('deriva { partes, tomadas } para alimentar evaluateGoal', () => {
    get().dividir(4)
    get().alternarParte(0)
    get().alternarParte(1)
    get().alternarParte(2)
    expect(selectFraccionEstado(get())).toEqual({ partes: 4, tomadas: 3 })
  })
})

describe('progreso (lo fija el motor)', () => {
  it('cuenta intentos y marca logro', () => {
    get().registrarIntento()
    get().registrarIntento()
    expect(get().intentos).toBe(2)
    get().marcarLograda()
    expect(get().lograda).toBe(true)
  })
})
