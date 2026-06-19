# components/

Componentes R3F y de UI reutilizables.

- `manipulatives/` — objetos que el estudiante manipula (barra, disco, recta, fichas).
  Cada uno expone una interfaz común: recibe una fracción/estado y emite eventos
  cuando el estudiante actúa. No saben de la actividad; solo manipulan.
- `representations/` — vistas pictórica y simbólica, sincronizadas con el manipulable
  3D (leen el mismo estado). Esta sincronía es el diferencial pedagógico (COPISI).
- `ui/` — botones, panel de instrucción, control de audio, etc.

Ver docs/03-ARQUITECTURA.md.
