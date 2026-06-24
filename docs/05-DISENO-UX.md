# 05 · Diseño y UX

## A quién le diseñamos

Estudiantes de 6 a 12 años (foco 3°–5° básico). Leen con fluidez variable, tienen
motricidad fina en desarrollo, se motivan explorando y se frustran rápido si algo
es confuso o los castiga. El diseño debe ser **claro, cálido y sin miedo al error**,
sin caer en lo infantilizante.

## Principios de UX para esta edad (obligatorios)

- **Poco texto, mucho mostrar.** Demostrar la acción con animación/íconos antes que
  explicarla por escrito. El texto es apoyo, no requisito.
- **Audio siempre disponible.** Toda instrucción se puede escuchar (botón de
  repetir). Un niño que aún no lee bien debe poder avanzar solo.
- **Targets grandes** (≥ 44px) y zonas de interacción generosas; tolerancia al error
  de puntería.
- **Una acción principal por pantalla.** No saturar. Que sea obvio qué hacer ahora.
- **Feedback inmediato y positivo.** Cada acción tiene una consecuencia visible al
  instante. Celebrar el logro de forma sobria; acompañar el error sin penalizar.
- **Sin presión de tiempo ni competencia.** Nada de cronómetros, vidas o rankings de
  velocidad. Reduce ansiedad y ayuda con la equidad de género.
- **Consistencia.** Los mismos gestos hacen lo mismo en toda la app; los íconos y
  colores significan siempre lo mismo.
- **Reversibilidad.** Siempre se puede deshacer y volver a intentar.

## Identidad visual (propuesta inicial, a validar)

Buscamos algo con **personalidad propia, lúdico sin ser infantilizante**, no un template
genérico de "app educativa". La pista la da el propio tema: **partes, piezas, divisiones,
lo que se arma y se parte**. Una dirección posible: estética de *bloques y piezas
tangibles* —superficies limpias, materiales que se sienten "agarrables", colores que
distinguen partes con claridad, animaciones que hacen sonreír (caras, pulsos, transformaciones)
**sin distraer del aprendizaje**. 

**Lúdico ≠ Juego; es amigable y engancha.**
El objetivo es que el estudiante sienta que la app "tiene personalidad" (el mascota guía,
los segmentos coloridos con caras, la sombra suave), no que sea un videojuego de fast-paced.
Cada elemento serve al aprendizaje concreto → pictórico → simbólico.

**Paleta (borrador — 5 colores nombrados):**
- `--fondo` `#F3F6FB` (fondo claro, descansado, alto contraste con las piezas)
- `--pieza` `#2E6BE6` (azul para la parte "tomada"/activa)
- `--pieza-suave` `#Bcd4Fb` (azul claro para la parte "no tomada")
- `--acento` `#FF8A3D` (naranjo cálido para el logro y el llamado a la acción)
- `--tinta` `#16233A` (texto y contornos)

(Verificar contraste AA de cada combinación texto/fondo antes de fijarla.)

**Tipografía:**
- Una **display** redondeada y amable para títulos y números grandes (los números
  de la fracción son protagonistas: deben verse y leerse muy bien).
- Una **body** legible y sobria para instrucciones cortas.
- Escala de tipo clara y con pocos tamaños. El símbolo de la fracción merece su
  propio tratamiento, grande y nítido.

**Firma visual:** el momento en que el objeto 3D se parte y, sincronizadamente, el
dibujo se sombrea y el número se escribe. Esa transición es lo que la persona
recuerda. Gastar ahí la "audacia" y mantener el resto tranquilo.

## Movimiento

La animación sirve al aprendizaje: muestra la **transformación** (cómo el todo se
parte, cómo las partes se unen). Animaciones con propósito, no decorativas. Respetar
`prefers-reduced-motion` con una versión sobria. Menos es más: el exceso de animación
distrae y resta.

## Accesibilidad (piso de calidad, no opcional)

- Contraste AA en texto y elementos significativos.
- Foco de teclado visible; acciones esenciales operables por teclado.
- `prefers-reduced-motion` respetado.
- Audio para todo el contenido textual.
- No depender solo del color para transmitir información (usar también forma/posición/
  etiqueta), pensando en daltonismo.

## Voz y copy (en español de Chile)

- Hablarle al estudiante en **segunda persona**, con verbos simples y concretos:
  "Parte la barra en 4", "Toma 3 partes". No: "Procede a fraccionar".
- El control dice exactamente qué hace y mantiene el nombre en todo el flujo.
- El error orienta, no regaña: "Casi. Mira cuántas partes tomaste" en vez de
  "Incorrecto". Sin disculpas ni dramatismo.
- Una pantalla vacía invita a actuar; un error explica qué pasó y cómo seguir.
- Cada elemento hace un solo trabajo: la etiqueta etiqueta, el ejemplo demuestra.
