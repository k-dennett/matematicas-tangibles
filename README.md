# Matemáticas Tangibles

> Experiencia educativa 3D en el navegador para enseñar **fracciones y geometría**
> a estudiantes de educación básica, volviéndolas manipulables.
>
> Proyecto del **Centro de Innovación — Subsecretaría de Educación (Chile)**.

## La idea en una frase

Un niño no entiende `3/4` mirando un dibujo; lo entiende **partiendo el todo con
sus propias manos**. Esta app digitaliza esa manipulación concreta —la capa que el
currículo chileno (COPISI: concreto → pictórico → simbólico) exige y que más cuesta
llevar a la sala— y la conecta en vivo con la fracción dibujada y escrita.

## Por qué 3D / WebGL

Entre los 6 y 12 años los estudiantes piensan en concreto: comprenden lo que pueden
ver, tocar y mover. Las fracciones y la geometría son abstractas y por eso son el
muro clásico. Un mundo 3D manipulable convierte lo abstracto en algo que se agarra,
se parte y se compara. El 3D acá no es decorativo: es el corazón pedagógico.

## Estado

MVP en construcción. Este repositorio contiene la documentación de producto, la
arquitectura, el roadmap y un **esqueleto que ya corre**, listo para desarrollarse
con Claude Code.

## Quick start

```bash
npm install
npm run dev
```

Abre la URL que muestra Vite. Deberías ver una escena 3D mínima con un objeto
dividido en fracciones (el esqueleto de Fase 0).

```bash
npm run build      # build de producción (estático)
npm run preview    # previsualizar el build
```

## Estructura del repositorio

```
matematicas-tangibles/
├── CLAUDE.md              ← LÉEME PRIMERO si eres Claude Code
├── README.md              ← este archivo
├── docs/                  ← documentación del proyecto (leer en orden)
│   ├── 01-PRD.md          ← qué, para quién y por qué
│   ├── 02-PEDAGOGIA.md    ← marco COPISI, OA del currículo, diseño de aprendizaje
│   ├── 03-ARQUITECTURA.md ← stack, patrones, rendimiento
│   ├── 04-ROADMAP.md      ← fases e hitos
│   ├── 05-DISENO-UX.md    ← UX para niños, identidad visual, accesibilidad
│   └── 06-CONTENIDO.md    ← especificación de actividades (data-driven)
├── public/                ← assets estáticos (modelos, texturas, audio)
└── src/
    ├── scenes/            ← escenas 3D (una por actividad/mundo)
    ├── components/        ← componentes R3F reutilizables (manipulables, UI)
    ├── activities/        ← definiciones de actividades + motor que las corre
    ├── state/             ← store de zustand
    ├── hooks/             ← hooks compartidos
    ├── lib/               ← lógica matemática pura (sin React ni three)
    └── styles/            ← estilos globales
```

## Cómo usar este paquete con Claude Code

1. Abre esta carpeta como proyecto en Claude Code.
2. Pídele que lea `CLAUDE.md` y la carpeta `docs/` antes de empezar.
3. Pídele que trabaje siguiendo `docs/04-ROADMAP.md`, **una fase a la vez**.
4. Revisa y prueba cada fase antes de avanzar a la siguiente.

Sugerencia de primer prompt para Claude Code:

> "Lee CLAUDE.md y toda la carpeta docs/. Luego verifica que el esqueleto de
> Fase 0 levante con npm run dev. Cuando esté ok, implementa la Fase 1 del roadmap
> (manipulable de fracción de un todo) respetando la arquitectura y los principios
> pedagógicos. No avances a la Fase 2 hasta que validemos la Fase 1."

## Nombre del producto

"Matemáticas Tangibles" es el título de trabajo. Algunas alternativas de marca
para evaluar con el equipo: **Pichintún** (palabra chilena para "un poquito / una
parte"), **Cuociente**, **Entero**, **Pieza**. Cambiar el nombre no cambia la
arquitectura.

## Licencia

Por definir por la Subsecretaría. Al ser un proyecto público, evaluar una licencia
abierta para que otros establecimientos puedan reutilizarlo.
