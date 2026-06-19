# 02 · Pedagogía

Este es el documento más importante del proyecto. Define **qué** enseñamos, **por
qué** en 3D, y **cómo** debe estar diseñada cada actividad. Cualquier decisión de
producto o de código se valida contra esto.

## Marco: COPISI (Concreto → Pictórico → Simbólico)

El currículo nacional de matemática (basado en el enfoque del método Singapur)
organiza el aprendizaje en tres niveles de representación que el estudiante recorre
en orden:

1. **Concreto**: manipular objetos reales (partir un pan, mover regletas, repartir
   fichas).
2. **Pictórico**: representar con dibujos y diagramas (la fracción como una figura
   sombreada, la recta numérica).
3. **Simbólico**: usar el número y la notación (`3/4`, `1/2 + 1/4`).

Los Objetivos de Aprendizaje lo dicen textualmente: trabajar las fracciones
"de manera **concreta, pictórica y simbólica**".

**Nuestra tesis de diseño:** la capa concreta es la que más se salta en la sala
real (cuesta gestionar material físico con 30 estudiantes). Nuestra app **es esa
capa concreta, digitalizada e ilimitada**, y su gran ventaja sobre el material
físico es que puede mostrar las **tres representaciones a la vez y en vivo**: cuando
el estudiante parte el objeto 3D, el dibujo y el número se actualizan en el mismo
instante. Ahí está el aprendizaje.

## Por qué 3D (fundamento del desarrollo)

Entre los 6 y 12 años el estudiante está, en términos de Piaget, en el estadio de
las **operaciones concretas**: razona sobre lo que puede ver y manipular, no sobre
lo abstracto. Por eso la fracción —un objeto abstracto— es difícil, y por eso los
manipulables y el aprendizaje multisensorial (vista, tacto, movimiento) son tan
efectivos. Un entorno 3D manipulable es manipulación concreta a demanda: partir,
unir, comparar y rotar sin límite de material y sin desorden.

## Objetivos de Aprendizaje (currículo chileno) que cubre el MVP

Foco: 4° básico (donde se formaliza la fracción) con puentes a 3° y 5°.

### Fracciones — 4° básico
- **MA04 OA 08** — Demostrar que comprende las fracciones con denominadores 100, 12,
  10, 8, 6, 5, 4, 3, 2: que una fracción representa la parte de un todo o de un grupo
  y un lugar en la recta numérica; que puede tener distintas representaciones; y
  comparar y ordenar fracciones con material concreto y pictórico.
- **MA04 OA 09** — Resolver adiciones y sustracciones de fracciones con igual
  denominador, de manera concreta y pictórica, en la resolución de problemas.
- **MA04 OA 10** — Identificar, escribir y representar fracciones propias y números
  mixtos (hasta el 5), de manera concreta, pictórica y simbólica.

### Puente a 5° básico (fase posterior)
- Operaciones de adición y sustracción de fracciones propias y decimales.
- Ubicación de fracciones y números mixtos en la recta numérica.

### Geometría — 5° básico (fuera del MVP, fase futura)
- Describir aristas y caras de figuras 3D y lados de figuras 2D.
- Congruencia mediante traslación, reflexión y rotación.
- Puntos en el primer cuadrante del plano cartesiano.

> Nota para el equipo: confirmar los OA exactos y su priorización vigente en
> curriculumnacional.cl antes de cerrar cada fase, ya que la priorización
> curricular se actualiza.

## Progresión de aprendizaje del MVP

Cada actividad sube un peldaño, siempre mostrando las tres representaciones:

1. **La parte de un todo.** Partir un objeto 3D en partes iguales; sombrear/tomar
   algunas; ver el dibujo y el número aparecer. (`MA04 OA 08`, `OA 10`)
2. **Representaciones distintas de la misma fracción.** Mostrar que `1/2` se ve igual
   en una pizza, una barra o la recta. (`MA04 OA 08`)
3. **Comparar y ordenar.** Poner fracciones lado a lado en 3D y ordenarlas; descubrir
   que con igual numerador, mayor denominador = parte más chica. (`MA04 OA 08`)
4. **Recta numérica 3D.** Ubicar fracciones como posiciones; relacionar con la parte
   del todo. (`MA04 OA 08`)
5. **Sumar y restar (igual denominador).** Unir y quitar partes; descubrir el
   algoritmo desde la acción, no desde la regla. (`MA04 OA 09`)

## Principios de diseño pedagógico (obligatorios)

- **Concreto primero, siempre.** Ninguna actividad empieza pidiendo el símbolo. Se
  empieza manipulando.
- **Tres representaciones simultáneas.** Concreto, pictórico y simbólico visibles y
  sincronizados. Es el diferencial del producto.
- **Feedback inmediato y positivo.** La acción muestra su consecuencia al instante.
  El acierto se celebra de forma sobria; el error se acompaña, nunca se penaliza.
- **El error es información, no fracaso.** Si el estudiante se equivoca, se le
  muestra qué pasó y se le invita a probar de nuevo. Sin "perder vidas", sin marcar
  en rojo de forma punitiva.
- **Sin presión de tiempo.** No hay cronómetros ni puntajes por velocidad. Esto
  además ayuda a reducir la ansiedad matemática y la brecha de género: la evidencia
  sugiere que los formatos de velocidad/competencia perjudican más a las niñas.
- **Exploración por sobre instrucción.** Preferir que el estudiante descubra
  manipulando, con andamiaje suave (pistas opcionales), antes que explicar la regla.
- **Texto que no bloquea.** Toda instrucción tiene audio e íconos. Un estudiante que
  aún no lee con fluidez debe poder avanzar.
- **Lenguaje concreto.** Hablarle al estudiante con ejemplos que puede imaginar, no
  con justificaciones abstractas sobre "para qué sirve".

## Criterios de logro (cómo sabemos que una actividad funciona)

- El estudiante puede pasar de la manipulación a anticipar el símbolo correcto.
- Puede comparar dos fracciones y justificar cuál es mayor mostrando las partes.
- Puede resolver una suma de igual denominador uniendo partes y luego escribirla.
- Completa la actividad sin necesitar que un adulto le lea las instrucciones.

## Validación con docentes y estudiantes

El Centro de Innovación tiene acceso a aulas reales: es nuestra mayor ventaja.
Plan mínimo de validación por fase:
- Revisión de cada actividad con 2–3 docentes de básica antes de codificar a fondo.
- Prueba de usabilidad con un grupo pequeño de estudiantes del nivel objetivo.
- Medición pre/post sencilla de comprensión en al menos un piloto de aula.
