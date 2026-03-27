import data from "./words.json";
const WORD_LIST = data.words;

export function getRandomWords(count: number): string[] {
  // 1. Creamos una copia para no mutar el original
  const array = [...WORD_LIST];

  // 2. Algoritmo Fisher-Yates (recorrido inverso)
  for (let i = array.length - 1; i > 0; i--) {
    // Elegimos un índice aleatorio entre 0 e i
    const j = Math.floor(Math.random() * (i + 1));

    // Intercambiamos los elementos (Destructuring assignment)
    [array[i], array[j]] = [array[j], array[i]];
  }

  // 3. Retornamos la cantidad de palabras pedidas
  return array.slice(0, count);
}
