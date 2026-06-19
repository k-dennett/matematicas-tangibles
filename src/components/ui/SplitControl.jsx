import { useState } from 'react'

// Control simple para elegir en cuántas partes partir y confirmar con "Partir"
// (docs/06). Targets ≥44px y foco de teclado visible (accesibilidad).

const MIN = 2

export default function SplitControl({ maxPartes = 12, onDividir }) {
  const [pendiente, setPendiente] = useState(MIN)

  const dec = () => setPendiente((p) => Math.max(MIN, p - 1))
  const inc = () => setPendiente((p) => Math.min(maxPartes, p + 1))

  return (
    <div className="split">
      <p className="split__hint">¿En cuántas partes la parto?</p>
      <div className="split__row">
        <button className="btn btn--round" onClick={dec} disabled={pendiente <= MIN} aria-label="Menos partes">
          −
        </button>
        <span className="split__num" aria-live="polite">
          {pendiente}
        </span>
        <button className="btn btn--round" onClick={inc} disabled={pendiente >= maxPartes} aria-label="Más partes">
          +
        </button>
      </div>
      <button className="btn btn--primary" onClick={() => onDividir?.(pendiente)}>
        Partir
      </button>
    </div>
  )
}
