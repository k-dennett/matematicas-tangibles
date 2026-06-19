// Control accesible para tomar/soltar partes con teclado o toque (alternativa al
// clic sobre la barra 3D, que no es enfocable). Despacha la MISMA acción del store
// (onToggle = alternarParte), así queda sincronizado con el 3D, el dibujo y el número.
// Son <button> nativos: foco de teclado visible, Enter/Espacio, estado con aria-pressed.

export default function PartToggles({ partes = 1, taken = [], onToggle }) {
  if (partes < 2) return null // sin partir todavía: no hay partes que tomar

  return (
    <div className="parts">
      <p className="parts__hint" id="parts-hint">
        Toma partes (con el dedo, el mouse o el teclado):
      </p>
      <div className="parts__row" role="group" aria-labelledby="parts-hint">
        {Array.from({ length: partes }, (_, i) => {
          const tomada = taken.includes(i)
          return (
            <button
              key={i}
              type="button"
              className={`part-btn${tomada ? ' part-btn--tomada' : ''}`}
              aria-pressed={tomada}
              aria-label={`Parte ${i + 1} de ${partes}, ${tomada ? 'tomada' : 'sin tomar'}`}
              onClick={() => onToggle?.(i)}
            >
              {i + 1}
            </button>
          )
        })}
      </div>
    </div>
  )
}
