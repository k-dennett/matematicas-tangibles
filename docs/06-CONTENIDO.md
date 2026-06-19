# 06 · Contenido y actividades

Las actividades son **data-driven**: cada una se define con un objeto de datos que el
motor (`src/activities/engine/`) interpreta y renderiza. Crear una actividad nueva es
escribir datos, no código. Esto permite crecer rápido y, a futuro, que un docente
configure actividades.

## Anatomía de una definición de actividad

Estructura propuesta (ajustable por Claude Code al implementar el motor):

```js
{
  id: "fraccion-parte-de-un-todo-01",
  oa: ["MA04 OA 08", "MA04 OA 10"],   // OA que cubre (trazabilidad curricular)
  nivel: "4° básico",
  titulo: "Parte la barra",            // visible, corto
  instruccion: {
    texto: "Parte la barra en 4 partes iguales y toma 3.",
    audio: "/audio/parte-la-barra-en-4.mp3"   // SIEMPRE hay audio
  },
  manipulativo: {
    tipo: "barra",            // "barra" | "disco" | "recta" | "fichas"
    maxPartes: 12             // límite razonable para la edad
  },
  meta: {                     // condición de logro (la evalúa la lógica de lib/)
    tipo: "fraccionObjetivo",
    fraccion: { numerador: 3, denominador: 4 }
  },
  representaciones: ["concreta", "pictorica", "simbolica"], // sincronizadas
  feedback: {
    logro: { texto: "¡Esa es 3/4!", audio: "/audio/esa-es-3-4.mp3" },
    // El error NO penaliza: orienta y deja reintentar.
    pista: { texto: "Mira cuántas partes tomaste de las 4.", audio: "/audio/pista-01.mp3" }
  },
  andamiaje: {
    pistaTrasIntentos: 2,     // recién después de 2 intentos ofrece la pista
    permitirReintentoInfinito: true
  }
}
```

Reglas de contenido:
- **Siempre** las tres representaciones disponibles y sincronizadas.
- **Siempre** audio en instrucción y feedback.
- El feedback de error **orienta**, nunca castiga; reintento ilimitado.
- Cada actividad declara su(s) OA para trazabilidad curricular.
- Sin tiempo, sin puntaje por velocidad.

## Actividades del MVP (resumen)

### A1 · La parte de un todo  — `MA04 OA 08`, `OA 10` (Fase 1)
Partir un objeto 3D en partes iguales y tomar algunas; ver dibujo y símbolo
aparecer. Variantes: distintos denominadores; objetivo dado como dibujo, como
símbolo o como audio.

### A2 · Misma fracción, distintas formas — `MA04 OA 08` (Fase 2)
Mostrar que `1/2` se ve igual en barra, disco y recta. El estudiante reconoce la
misma fracción en representaciones distintas.

### A3 · Comparar y ordenar — `MA04 OA 08` (Fase 2)
Poner fracciones lado a lado en 3D y ordenarlas de mayor a menor. Descubrimiento
clave: con igual numerador, **mayor denominador = parte más chica** (el error
intuitivo más común: creer que `1/5 > 1/2` porque 5 > 2).

### A4 · Recta numérica 3D — `MA04 OA 08` (Fase 2)
Ubicar fracciones como posiciones en una recta en el espacio; relacionarlo con la
parte del todo.

### A5 · Sumar y restar (igual denominador) — `MA04 OA 09` (Fase 3)
Unir y quitar partes del mismo denominador; el algoritmo emerge de la acción.
Problemas en contexto cotidiano (juntar, repartir, comer porciones).

## Ejemplo detallado: A1 "Parte la barra"

**Pantalla:** a la izquierda, una barra 3D entera sobre una mesa. A la derecha
(o abajo), dos cajas: el dibujo (pictórico) y el número (simbólico), ambas vacías
al inicio.

**Flujo:**
1. Suena/aparece la instrucción: "Parte la barra en 4 partes iguales y toma 3".
2. El estudiante elige el número de cortes (control simple con +/− y botón "partir").
   Al partir, la barra 3D se divide en 4 con animación.
3. El denominador `4` se escribe solo en la caja simbólica y el dibujo muestra 4
   partes. (Concreto → pictórico → simbólico, en vivo.)
4. El estudiante toca partes para "tomarlas"; cada parte tomada se pinta de `--pieza`,
   el dibujo se sombrea y el numerador sube. Toma 3 → aparece `3/4`.
5. Al alcanzar la meta: feedback de logro sobrio y positivo ("¡Esa es 3/4!").
6. Si toma de más o de menos: pista orientadora tras un par de intentos, sin
   penalización, con reintento libre.

**Qué aprende:** que la fracción es partes iguales de un todo; que el denominador es
en cuántas partes se dividió y el numerador cuántas se tomaron; y la conexión entre
las tres representaciones.

## Pendientes de contenido para el equipo

- Redactar y grabar los **audios** de instrucciones y feedback (voz clara, español
  de Chile, tono cálido y no infantilizante).
- Definir el set exacto de denominadores por actividad (alineado a los OA: 2, 3, 4,
  5, 6, 8, 10, 12, 100).
- Revisar redacción de instrucciones y pistas con docentes de básica.
- Definir los problemas en contexto de A5 (que sean cotidianos y cercanos).
