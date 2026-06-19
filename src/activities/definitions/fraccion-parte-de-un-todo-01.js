// Actividad A1 · "La parte de un todo" (docs/06). Data-driven: el motor la
// interpreta y la renderiza; crear otra actividad = escribir otro objeto como este.

const actividad = {
  id: 'fraccion-parte-de-un-todo-01',
  oa: ['MA04 OA 08', 'MA04 OA 10'], // trazabilidad curricular
  nivel: '4° básico',
  titulo: 'Parte la barra',
  instruccion: {
    texto: 'Parte la barra en 4 partes iguales y toma 3.',
    // TODO(audio): grabar audio definitivo con voz humana (español de Chile).
    // Aún NO conectado; el reproductor de audio llega en el paso de feedback/audios.
    audio: '/audio/parte-la-barra-en-4.mp3',
  },
  manipulativo: {
    tipo: 'barra', // "barra" | "disco" | "recta" | "fichas" (barra implementada)
    maxPartes: 12, // límite razonable para la edad
  },
  meta: {
    tipo: 'fraccionObjetivo',
    fraccion: { numerador: 3, denominador: 4 },
    // permitirEquivalentes ausente => coincidencia EXACTA (6/8 no cuenta como 3/4).
  },
  representaciones: ['concreta', 'pictorica', 'simbolica'], // sincronizadas
  // Datos de feedback/andamiaje listos para el siguiente paso (aún no conectados).
  feedback: {
    logro: { texto: '¡Esa es 3/4!', audio: '/audio/esa-es-3-4.mp3' },
    pista: { texto: 'Mira cuántas partes tomaste de las 4.', audio: '/audio/pista-01.mp3' },
  },
  andamiaje: {
    pistaTrasIntentos: 2,
    permitirReintentoInfinito: true,
  },
}

export default actividad
