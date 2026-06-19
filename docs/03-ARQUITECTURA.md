# 03 · Arquitectura técnica

## Stack y por qué

| Pieza | Para qué | Por qué esta |
|---|---|---|
| **React 18** | UI y estructura de la app | Estándar, componible, integra bien con R3F. |
| **Vite** | Bundler + dev server | Arranque y HMR rápidos; build estático simple. |
| **@react-three/fiber** (R3F) | three.js declarativo | Escribir escenas 3D como componentes React; menos código imperativo y más mantenible. |
| **@react-three/drei** | Helpers de R3F | Controles de cámara, `Text`, loaders de glTF, `Html`, etc. Evita reinventar. |
| **zustand** | Estado global | Mínimo y sin boilerplate; ideal para estado de actividad/progreso/ajustes. |
| **three.js** | Motor 3D | Viene con R3F. Usar imperativamente solo si es imprescindible. |

Regla: antes de sumar una dependencia nueva, verificar que drei o R3F no lo
resuelvan ya. Mantener el árbol de dependencias chico ayuda al rendimiento y a la
mantenibilidad de un proyecto público de largo plazo.

## Principio rector: separar lógica matemática de render

La lógica de fracciones (crear, simplificar, comparar, sumar, validar, equivalencias)
vive en `src/lib/` como **funciones puras**, sin React ni three. Esto permite:
- Testearla de forma aislada (es la parte donde un error es más grave: la matemática
  debe ser correcta).
- Reutilizarla entre la representación 3D, la pictórica y la simbólica.
- Cambiar el render sin tocar la matemática.

Los componentes 3D y la UI **consumen** esa lógica; no la implementan.

## Estructura de carpetas

```
src/
├── main.jsx              # punto de entrada
├── App.jsx              # shell: layout, router de actividades, ajustes
├── scenes/             # una escena 3D por actividad o "mundo"
│   └── FractionScene.jsx
├── components/         # componentes R3F y de UI reutilizables
│   ├── manipulatives/  # los objetos que el estudiante manipula (barra, disco...)
│   ├── representations/# vistas pictórica y simbólica sincronizadas
│   └── ui/             # botones, panel de instrucción, control de audio
├── activities/         # definiciones de actividades (data) + motor que las corre
│   ├── engine/         # lógica que interpreta una definición de actividad
│   └── definitions/    # un archivo de datos por actividad (ver doc 06)
├── state/              # stores de zustand (actividad actual, progreso, ajustes)
├── hooks/              # hooks compartidos (audio, reduced-motion, etc.)
├── lib/                # LÓGICA MATEMÁTICA PURA (sin React ni three)
│   └── fractions.js
└── styles/             # estilos globales / tokens de diseño
```

## Patrones clave

**Actividades data-driven.** Una actividad NO es un componente a medida; es un
objeto de datos (ver `docs/06-CONTENIDO.md`) que describe el OA, los manipulables,
la meta y el feedback. Un "motor" (`activities/engine/`) lo interpreta y renderiza.
Así, crear una nueva actividad = escribir datos, no código nuevo. Esto es lo que
permite que el catálogo crezca rápido y que un docente pueda, a futuro, configurar
actividades.

**Manipulables como componentes reutilizables.** Cada tipo de manipulable (barra
fraccionada, disco/pizza, recta numérica, fichas) es un componente en
`components/manipulatives/` que expone una interfaz común: recibe una fracción/estado
y emite eventos cuando el estudiante actúa (partir, tomar, mover). No saben de la
actividad; solo manipulan.

**Representaciones sincronizadas.** `components/representations/` contiene la vista
pictórica y la simbólica, que leen el **mismo** estado que el manipulable 3D. Mover
el 3D actualiza las tres. Esta sincronía es el diferencial pedagógico (COPISI).

**Estado en zustand.** Un store para el estado de la actividad en curso (qué
fracción, qué partes tomadas, si la meta se cumplió), otro para ajustes (audio on/off,
reduced motion, modo proyección vs individual). Evitar prop-drilling profundo.

## Rendimiento (presupuesto y técnicas)

Objetivo: 60 fps, nunca bajar de 30, en hardware modesto (~4 GB RAM, gráfica
integrada).

- **Geometría baja en polígonos.** Estos objetos son simples (barras, discos,
  cubos); no necesitan alta densidad.
- **glTF + Draco** para cualquier modelo importado (compresión de malla). Cargar con
  el loader de drei.
- **Instancing** cuando se repita la misma geometría (p. ej. muchas partes iguales).
- **Lazy loading por actividad.** No cargar los assets de todas las actividades al
  inicio; diferir con `React.lazy`/`Suspense` y cargar al entrar a la actividad.
- **`dispose` al desmontar.** Liberar geometrías, materiales y texturas al salir de
  una escena para no acumular memoria.
- **Limitar sombras y posprocesado.** Son caros; usarlos con mucha moderación o
  evitarlos en gama baja.
- **`dpr` acotado.** Limitar el device pixel ratio del canvas (p. ej. máx 2) para no
  matar la GPU en pantallas densas.
- **Medir en hardware real**, no solo en el equipo de desarrollo.

## Build, deploy y offline

- Build estático con `vite build` → se puede servir desde cualquier hosting estático
  o CDN del Estado.
- Evaluar empaquetar como **PWA** (service worker + manifest) para uso offline en
  salas con mala conectividad: cachear el shell y los assets de la actividad.
- Detectar ausencia de WebGL y mostrar un mensaje claro (degradación elegante).

## Accesibilidad técnica

- Targets táctiles ≥ 44px; foco de teclado visible en todos los controles.
- Respetar `prefers-reduced-motion`: ofrecer versión con menos/sin animación.
- Audio para toda instrucción (Web Audio o `<audio>`); control claro de
  play/pausa/repetir.
- Texto sobre fondos con contraste suficiente (apuntar a WCAG AA).
- Para el contenido 3D, proveer alternativas/etiquetas donde sea posible y un
  recorrido por teclado para las acciones esenciales.

## Testing

- **Lógica matemática (`src/lib/`)**: tests unitarios obligatorios. Es donde un
  error hace daño real.
- **Motor de actividades**: tests de que una definición produce el estado esperado.
- **Componentes**: pruebas ligeras de interacción donde aporte; no sobre-testear el
  render 3D.
