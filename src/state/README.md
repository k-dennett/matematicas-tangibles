# state/

Stores de zustand.

- Estado de la actividad en curso (fracción, partes tomadas, si se cumplió la meta).
- Ajustes (audio on/off, prefers-reduced-motion, modo proyección vs individual).

Mantener mínimo; evitar prop-drilling. Sin datos personales (ver CLAUDE.md).

Estado actual:
- `activityStore.js` maneja la barra, las partes tomadas y el progreso.
- `settingsStore.js` maneja audio, reduced motion y modo de uso.
