# 04 · Roadmap

Construir **una fase a la vez**. Cada fase debe quedar funcionando y verificable
antes de avanzar. Mejor poco y excelente que mucho a medias.

---

## Fase 0 — Cimientos (cerrada)

**Meta:** que el proyecto levante y la arquitectura base esté en pie.

Entregables:
- [x] Estructura de carpetas y documentación (este repo).
- [x] Esqueleto que corre con `npm run dev` (escena 3D mínima con un objeto dividido).
- [x] Store de zustand inicial (ajustes: audio, reduced-motion, modo).
- [x] Sistema de audio para instrucciones (hook + control en UI).
- [x] Lógica matemática base en `src/lib/fractions.js` con tests.
- [x] Shell de la app con navegación entre actividades (placeholder).

**Listo cuando:** levanta sin errores, hay una escena 3D visible, existe la base de
`lib/fractions.js` testeada y el shell navega entre pantallas vacías.

**Estado actual:** completada y subida al remoto. El siguiente foco es la Fase 1.

---

## Fase 1 — MVP: la fracción como parte de un todo

**OA:** MA04 OA 08, MA04 OA 10. **Es el corazón del MVP.**

**Estado:** En progreso. Iteración actual enfocada en **lúdico visual** sin sacrificar
pedagogía. La app apunta a ser divertida para 8–12 años manteniendo COPISI riguroso.

Entregables:
- [x] Manipulable 3D "barra fraccionable": el estudiante elige en cuántas
      partes iguales dividir y toma algunas.
      - [x] Lógica de partición y toma de partes funcional.
      - [x] Interacción drag/rotate/click diferenciada con threshold (6px).
      - [x] Densidad (10+ partes) con layout inteligente en "carriles" de etiquetas.
      - [x] Visuales lúdicas: caras coloridas, pulso en split, sombras suaves.
      - [x] Números 3D nítidos (drei Text + outline, no HTML).
      - [x] Sombra estable (SoftShadowBlob, canvas-based, sin parpadeo).
- [ ] Las tres representaciones sincronizadas en pantalla: objeto 3D ↔ dibujo
      pictórico ↔ símbolo (`n/d`).
- [ ] Primera actividad data-driven completa (definición en `activities/definitions/`).
- [ ] Feedback inmediato y positivo; sin penalización ni tiempo.
- [ ] Instrucciones con audio + íconos (sin depender de lectura).

**Listo cuando:** un estudiante de 3°–5° puede, sin ayuda para leer, partir el
objeto, tomar partes y ver/anticipar la fracción correcta. Validado con docentes.

**Cambios en esta iteración (lúdico):**
- **GuideMascot.jsx**: Personaje 3D flotante que reacciona a mood (idle → animada → celebra).
- **SoftShadowBlob**: Canvas-based gradient shadow (reemplaza ContactShadows inestable).
- **Caras coloridas**: Cada segmento tiene ojos + boca (Face component) con 8 colores (FRUIT_COLORS).
- **Split-pulse**: Segmentos escalan 1.05 con easing en 420ms cuando se parte la barra.
- **Lighting mejorada**: Hemispheric + directional para mejor profundidad.
- **Pointer tracking**: Click vs drag diferenciado; drag-to-rotate no activa selección.


---

## Fase 2 — Comparar, ordenar y recta numérica

**OA:** MA04 OA 08.

Entregables:
- [ ] Manipulable para poner fracciones lado a lado y compararlas/ordenarlas.
- [ ] Descubrimiento guiado: con igual numerador, mayor denominador = parte menor.
- [ ] Recta numérica 3D para ubicar fracciones como posiciones.
- [ ] Conexión explícita entre "parte del todo" y "posición en la recta".

**Listo cuando:** el estudiante ordena fracciones justificando con las partes y
ubica fracciones simples en la recta.

---

## Fase 3 — Sumar y restar (igual denominador)

**OA:** MA04 OA 09.

Entregables:
- [ ] Manipulable para unir y quitar partes del mismo denominador.
- [ ] El algoritmo "emerge" de la acción (se suman numeradores, el denominador queda).
- [ ] Conexión con el símbolo paso a paso.
- [ ] Problemas simples en contexto cotidiano (repartir, juntar).

**Listo cuando:** el estudiante resuelve sumas/restas de igual denominador con las
partes y luego las escribe correctamente.

---

## Fase 4 — Pulido, accesibilidad y validación en aula

Entregables:
- [ ] Auditoría de accesibilidad (contraste, teclado, reduced-motion, audio completo).
- [ ] Auditoría de rendimiento en hardware escolar real; optimizar hasta cumplir el
      presupuesto (60 fps objetivo / 30 mínimo).
- [ ] Modo "proyección" (sala completa) y modo individual, pulidos.
- [ ] Empaquetado PWA para uso offline (evaluar).
- [ ] Telemetría anónima y agregada opt-in (si se decide incluir), documentada.
- [ ] Piloto de aula con medición pre/post de comprensión.
- [ ] Notas didácticas para docentes por actividad (qué OA, cómo usarla).

**Listo cuando:** corre bien en equipos modestos, es accesible, y un piloto real
muestra resultados de aprendizaje y feedback docente.

---

## Futuro (post-MVP)

- Geometría: cuerpos 3D, aristas/caras, redes (desarrollos de cubos/prismas),
  simetría y transformaciones (traslación, reflexión, rotación), plano cartesiano.
  (OA de 5° básico ya identificados en `docs/02-PEDAGOGIA.md`.)
- Fracciones avanzadas: distinto denominador, números mixtos, equivalencia, decimales.
- Panel docente con seguimiento anónimo/agregado.
- Editor de actividades para docentes (aprovechando la arquitectura data-driven).
- Más niveles (1°–2° con nociones de mitad/cuarto; 6° con razones y porcentajes).
