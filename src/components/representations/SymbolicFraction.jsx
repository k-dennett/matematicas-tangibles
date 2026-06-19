// Representación SIMBÓLICA: el número n/d, grande y nítido — es el PROTAGONISTA
// (docs/05). Es dumb: recibe numerador/denominador y los muestra. Lee el mismo
// estado que las otras dos representaciones (vía las props que le pasa el motor).

export default function SymbolicFraction({ numerador = 0, denominador = 1, dividida = true }) {
  const vacio = !dividida // barra aún entera: todavía no hay fracción que mostrar
  return (
    <div className="rep rep--simbolo">
      <p className="rep__label">Número</p>
      <div className="symbol-card">
        <div
          className={`symbol${vacio ? ' symbol--vacio' : ''}`}
          aria-label={vacio ? 'Todavía sin partir' : `${numerador} de ${denominador}`}
        >
          <span className="symbol__num">{vacio ? '?' : numerador}</span>
          <span className="symbol__line" />
          <span className="symbol__den">{vacio ? '?' : denominador}</span>
        </div>
      </div>
    </div>
  )
}
