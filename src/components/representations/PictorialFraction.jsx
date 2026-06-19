// Representación PICTÓRICA: el dibujo de la barra dividida, con las partes tomadas
// sombreadas. Es dumb: recibe { partes, taken } (el mismo estado que el 3D y el
// símbolo) y lo dibuja en SVG. Usa los tokens de color por CSS var().

const W = 240
const H = 84

export default function PictorialFraction({ partes = 1, taken = [] }) {
  const gap = partes > 1 ? 3 : 0
  const seg = (W - gap * (partes - 1)) / partes
  return (
    <div className="rep">
      <p className="rep__label">Dibujo</p>
      <svg
        className="pictorial"
        viewBox={`0 0 ${W} ${H}`}
        role="img"
        aria-label={`Barra dividida en ${partes} ${partes === 1 ? 'parte' : 'partes'}, ${taken.length} tomada${taken.length === 1 ? '' : 's'}`}
      >
        {Array.from({ length: partes }, (_, i) => {
          const x = i * (seg + gap)
          const isTaken = taken.includes(i)
          return (
            <rect
              key={i}
              x={x}
              y={0}
              width={seg}
              height={H}
              rx={6}
              fill={isTaken ? 'var(--pieza)' : 'var(--pieza-suave)'}
              stroke="var(--tinta)"
              strokeWidth="2"
            />
          )
        })}
      </svg>
    </div>
  )
}
