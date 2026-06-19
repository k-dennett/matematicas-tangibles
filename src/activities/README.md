# activities/

Las actividades son data-driven (ver docs/06-CONTENIDO.md).

- `definitions/` — un archivo de datos por actividad. Describe OA, manipulativo,
  meta, representaciones y feedback. NO contiene lógica de render.
- `engine/` — el motor que interpreta una definición y la renderiza usando los
  manipulables y representaciones de components/.

Crear una actividad nueva = escribir una definición, no código nuevo.
