# CLAUDE.md

> Este archivo es lo primero que debes leer. Define el contexto, las reglas y la
> forma de trabajar en este proyecto. Antes de escribir código, lee también la
> carpeta `docs/` completa (están numerados del 01 al 06).

## Qué es este proyecto

**Matemáticas Tangibles** es una experiencia educativa 3D que corre en el
navegador (WebGL), pensada para estudiantes chilenos de educación básica
(foco inicial: 3° a 5° básico). El objetivo es enseñar **fracciones y geometría**
volviéndolas **manipulables**: el estudiante parte, combina, compara y rota
objetos en 3D en lugar de mirar dibujos estáticos.

Lo construye el **Centro de Innovación de la Subsecretaría de Educación** (Chile).
Es un proyecto del Estado: la calidad, la accesibilidad, la privacidad de los
menores y el anclaje al currículo nacional son innegociables.

## La estrella polar pedagógica (no la pierdas de vista)

El currículo chileno de matemática se construye sobre la progresión
**Concreto → Pictórico → Simbólico (COPISI)**. Los Objetivos de Aprendizaje
literalmente exigen trabajar "de manera concreta, pictórica y simbólica".

**Nuestra app ES la capa concreta digitalizada.** Todo lo que construyas debe:

1. Empezar por la manipulación concreta (tocar, mover, partir, combinar en 3D).
2. Conectar esa manipulación con la representación pictórica (la fracción como
   dibujo) y simbólica (el número `3/4`) **en pantalla y al mismo tiempo**.
3. Dar feedback inmediato, positivo y sin penalización. El error es parte del
   aprendizaje, nunca un castigo. No hay cronómetros ni rankings de velocidad.

Si una decisión de diseño o de código se aleja de esto, está mal. Detente y
revísalo. El detalle pedagógico vive en `docs/02-PEDAGOGIA.md`.

## Stack técnico

- **React 18** + **Vite** (bundler y dev server).
- **@react-three/fiber** (R3F): three.js de forma declarativa con componentes React.
- **@react-three/drei**: helpers de R3F (controles de cámara, texto, loaders, etc.).
- **zustand**: estado global ligero (estado de la actividad, progreso, ajustes).
- three.js viene como dependencia de R3F; no lo uses imperativamente salvo que
  sea estrictamente necesario.

No agregues dependencias pesadas sin justificarlo. Antes de instalar algo nuevo,
pregúntate si drei o el propio R3F ya lo resuelven.

## Convenciones de código

- **Idioma**: el texto que ve el estudiante va **en español de Chile**. El código
  (nombres de variables, funciones, archivos) va **en inglés**. Los comentarios
  pueden ir en español.
- **Componentes**: un componente por archivo, `PascalCase.jsx`. Hooks en
  `camelCase.js` con prefijo `use`.
- **Separación estricta entre lógica matemática y render.** Toda la lógica de
  fracciones, comparaciones, equivalencias, etc. vive en `src/lib/` como funciones
  puras y testeables, **sin** dependencias de React ni de three. Los componentes 3D
  solo consumen esa lógica.
- **Las actividades son data-driven.** Una actividad se define con un objeto de
  datos (ver `docs/06-CONTENIDO.md`) que describe el OA, los manipulables, las
  metas y el feedback. El motor las renderiza. No hardcodees actividades en JSX.
- Nada de `localStorage` para datos sensibles. El progreso, si se guarda, es
  anónimo y local (ver sección Privacidad).

## Reglas innegociables

1. **Privacidad de menores.** No recolectes datos personales. Sin login, sin
   nombres reales, sin analytics que identifiquen a la persona. Si hay telemetría,
   es anónima, agregada y opt-in, y debe estar documentada.
2. **Rendimiento en equipos modestos.** El público objetivo usa notebooks y
   tablets escolares de gama baja. Presupuesto: que parta y sea usable en un equipo
   de 4 GB de RAM y gráfica integrada. Mantén los polígonos bajos, usa modelos
   comprimidos (glTF + Draco), `instancing` cuando repitas geometría, y libera
   recursos (`dispose`) al desmontar escenas. Apunta a 60 fps; nunca bajes de 30.
3. **Accesibilidad.** Targets táctiles grandes (mínimo 44px), alto contraste,
   foco de teclado visible, respeto a `prefers-reduced-motion`, y **soporte de
   audio** porque muchos estudiantes de estos niveles aún leen con dificultad: toda
   instrucción escrita debe poder escucharse.
4. **Funciona con conectividad pobre.** Carga inicial liviana, assets diferidos
   por actividad, y idealmente empaquetable como PWA para uso offline.
5. **Sin contenido que requiera lectura fluida para avanzar.** Usa íconos, audio y
   demostración. El texto apoya, no bloquea.

## Cómo trabajar en este repo

1. Lee `docs/` en orden (01 → 06) antes de tu primera tarea.
2. Sigue el `docs/04-ROADMAP.md`. Construye **una fase a la vez** y deja cada fase
   funcionando y verificable antes de avanzar.
3. La Fase 0 (setup) ya está esbozada: hay un esqueleto que corre con
   `npm install && npm run dev`. Verifica que levante antes de construir encima.
4. Prefiere prototipos pequeños y funcionales sobre features grandes a medias.
5. Cuando termines algo, explica brevemente qué OA cubre y cómo lo probarías con
   un estudiante real.

## Cosas que NO debes hacer

- No conviertas esto en un juego de velocidad o competencia.
- No agregues recolección de datos de menores de ningún tipo.
- No uses texto denso ni jerga matemática sin apoyo visual/auditivo.
- No hardcodees el contenido de las actividades en los componentes.
- No mezcles la lógica matemática con el código de render.
- No asumas hardware potente.
