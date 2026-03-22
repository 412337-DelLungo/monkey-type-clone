const WORD_LIST = [
  "el", "la", "los", "las", "un", "una", "unos", "unas", "de", "del", "al",
  "que", "y", "en", "es", "por", "para", "con", "sin", "sobre", "entre",
  "este", "esta", "esto", "ese", "esa", "eso", "aquel", "aquella", "como",
  "pero", "mas", "porque", "cuando", "donde", "quien", "cual", "todo",
  "todos", "toda", "todas", "nada", "nadie", "alguno", "algunos", "cada",
  "mucho", "muchos", "poca", "pocos", "otro", "otros", "mismo", "mismos",
  "tener", "hacer", "ir", "ser", "estar", "poder", "decir", "ver", "dar",
  "saber", "querer", "llegar", "pasar", "deber", "poner", "parecer", "quedar",
  "creer", "hablar", "llevar", "tocar", "oir", "escribir", "leer", "comer",
  "dormir", "correr", "saltar", "jugar", "escribir", "estudiar", "trabajar",
  "casa", "tiempo", "dia", "noche", "manana", "ahora", "siempre", "nunca",
  "lugar", "forma", "parte", "manera", "cosa", "mundo", "vida", "gente",
  "persona", "hombre", "mujer", "nio", "familia", "amigo", "trabajo",
  "ciudad", "pais", "calle", "agua", "aire", "fuego", "tierra", "mar",
  "sol", "luna", "estrella", "color", "blanco", "negro", "rojo", "azul",
  "verde", "grande", "pequeo", "nuevo", "viejo", "bueno", "malo", "largo",
  "corto", "alto", "bajo", "rapido", "lento", "facil", "dificil", "primero",
  "ultimo", "siguiente", "anterior", "diferente", "importante", "posible",
  "necesario", "verdadero", "falso", "correcto", "incorrecto", "completo",
  "abierto", "cerrado", "lleno", "vacio", "caliente", "frio", "duro", "blando",
  "ordenador", "teclado", "pantalla", "raton", "ventana", "programa", "dato",
  "informacion", "sistema", "red", "internet", "navegador", "aplicacion",
  "texto", "letra", "palabra", "frase", "numero", "cifra", "resultado",
  "problema", "solucion", "pregunta", "respuesta", "ejemplo", "explicacion",
  "desarrollo", "aprendizaje", "conocimiento", "memoria", "proceso",
  "metodo", "tecnica", "idea", "concepto", "ejercicio", "practica",
];

export function getRandomWords(count: number): string[] {
  const words: string[] = [];
  for (let i = 0; i < count; i++) {
    words.push(WORD_LIST[Math.floor(Math.random() * WORD_LIST.length)]);
  }
  return words;
}
