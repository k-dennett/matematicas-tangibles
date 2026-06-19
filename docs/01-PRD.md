# 01 · PRD — Documento de Producto

## Problema

Las fracciones y la geometría son el punto donde muchos estudiantes chilenos
"se caen" en matemática. No es casualidad: entre los 6 y 12 años el pensamiento es
predominantemente concreto, y estos contenidos son abstractos. La evidencia y el
propio currículo nacional señalan que el aprendizaje debe ir de lo **concreto** a
lo **pictórico** y luego a lo **simbólico** (COPISI). El problema es que la capa
concreta (manipulables físicos: regletas, fichas, material fraccionado) es difícil
de gestionar en una sala con 30+ estudiantes y tiende a saltarse.

Contexto país: tras la pandemia, 6° básico retrocedió en matemática en el SIMCE
2024 y persiste una brecha de género en la asignatura. La comprensión de fracciones
es uno de los nudos más reportados por docentes.

## Oportunidad

Una experiencia 3D en el navegador puede entregar la capa concreta —manipulable,
ilimitada, sin costo de material— a cualquier sala con un equipo y un proyector, o
a cada estudiante en su tablet/notebook. El 3D permite partir, combinar, comparar y
rotar objetos, y conectar esa acción en vivo con el dibujo y el símbolo. Es
exactamente lo que la pizarra no puede hacer.

## Usuarios

**Primario — Estudiante (foco inicial 3° a 5° básico).** Piensa en concreto, lee
con fluidez variable, se motiva con la exploración y el descubrimiento. Necesita
feedback inmediato y un entorno sin miedo a equivocarse.

**Secundario — Docente.** Necesita una herramienta que se alinee a los OA, que pueda
proyectar para toda la sala o asignar para trabajo individual, y que no le agregue
carga administrativa. Idealmente con notas didácticas de qué OA cubre cada actividad.

**Contexto de uso.** Sala de clases (proyectada o 1:1) y, secundariamente, hogar.
Equipos modestos y conectividad variable son la norma, no la excepción.

## Visión

Que un estudiante de educación básica pueda **construir su intuición de fracción y
de forma geométrica manipulando objetos**, y que vea —en el mismo momento— cómo esa
acción se escribe como dibujo y como número. Empezamos por fracciones; la misma
plataforma crece luego hacia geometría, proporción y medición.

## Objetivos y métricas de éxito

Como es un producto de aprendizaje (no de engagement), las métricas se centran en
comprensión y en uso pedagógicamente sano, **nunca** en tiempo de pantalla.

- **Comprensión**: mejora medible en tareas de fracciones (pre/post) en pilotos de
  aula, evaluada con docentes.
- **Usabilidad**: un estudiante de 3°–5° puede completar una actividad sin ayuda
  adulta para leer las instrucciones (gracias a audio + íconos + demostración).
- **Alineación curricular**: cada actividad mapea explícitamente a uno o más OA.
- **Adopción docente**: docentes pilotos reportan que la usarían y por qué.
- **Rendimiento**: usable en el hardware objetivo (ver restricciones).

## Alcance del MVP

Dentro:
- Un "mundo" de fracciones con manipulables 3D.
- Actividad 1: la fracción como parte de un todo (partir, representar, comparar).
- Actividad 2: ubicar fracciones en una recta numérica 3D.
- Actividad 3: suma y resta de fracciones con igual denominador (concreto).
- Conexión simultánea concreto ↔ pictórico ↔ simbólico en todas.
- Audio para todas las instrucciones. Accesibilidad base.
- Modo "para proyectar" (toda la sala) y modo individual.

Fuera del MVP (futuro):
- Geometría (cuerpos 3D, redes/desarrollos, simetría, transformaciones).
- Operaciones con distinto denominador, números mixtos, decimales.
- Panel docente con seguimiento (anónimo/agregado).
- Multijugador / colaboración.
- Cuentas de usuario (no se contemplan por privacidad de menores).

## Restricciones

- **Hardware**: debe partir y ser usable en notebooks/tablets escolares de gama
  baja (~4 GB RAM, gráfica integrada).
- **Conectividad**: carga inicial liviana, assets diferidos, idealmente PWA offline.
- **Privacidad**: proyecto del Estado con menores de edad. Sin datos personales,
  sin login, sin tracking identificable.
- **Navegador**: Chrome/Edge recientes como base (los más comunes en el parque
  escolar). Verificar WebGL disponible y degradar con un mensaje claro si no.

## Riesgos y mitigaciones

- *Que el "wow" 3D opaque lo pedagógico* → cada interacción debe enseñar; el 3D
  sirve a la comprensión, no al revés. Validar con docentes desde temprano.
- *Que no corra en equipos reales* → fijar presupuesto de rendimiento desde el día
  uno y probar en hardware modesto, no solo en el equipo de desarrollo.
- *Sobre-alcance* → roadmap por fases; un concepto excelente antes que muchos a
  medias.
