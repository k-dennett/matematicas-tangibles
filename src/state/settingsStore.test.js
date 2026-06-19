import { describe, it, expect, beforeEach } from 'vitest'
import { useSettingsStore } from './settingsStore.js'

const get = () => useSettingsStore.getState()

beforeEach(() => {
  useSettingsStore.getState().reiniciar()
})

describe('valores por defecto', () => {
  it('audio activo, sin movimiento reducido, modo individual', () => {
    expect(get().audio).toBe(true)
    expect(get().reducedMotion).toBe(false)
    expect(get().modo).toBe('individual')
  })
})

describe('audio', () => {
  it('toggle alterna el valor', () => {
    get().toggleAudio()
    expect(get().audio).toBe(false)
    get().toggleAudio()
    expect(get().audio).toBe(true)
  })

  it('setAudio fuerza booleano', () => {
    get().setAudio(0)
    expect(get().audio).toBe(false)
  })
})

describe('reducedMotion y modo', () => {
  it('setReducedMotion', () => {
    get().setReducedMotion(true)
    expect(get().reducedMotion).toBe(true)
  })

  it('setModo cambia entre individual y proyección', () => {
    get().setModo('proyeccion')
    expect(get().modo).toBe('proyeccion')
  })
})
