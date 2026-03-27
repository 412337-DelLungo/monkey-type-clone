## Mejorar

### Division en componentes
 - Primero: FinishScreen — es el más fácil. No tiene lógica, solo muestra datos.
 [ ] Crear FinishScreen.tsx:

    Mover el JSX del finish-overlay a este nuevo archivo.
    Definir la interfaz de Props (wpm, accuracy, time, maxCombo, onRestart).
    Verificar que el botón de "Reiniciar" dispare la función que viene por props.
 
 - Segundo: useTimer — te enseña qué es un hook y por qué los timers necesitan limpieza. Es chico y tiene un propósito muy claro.

[]Crear hooks/useTimer.ts:

    Mover el elapsed state y el timerRef.
    Implementar funciones startTimer, stopTimer y resetTimer.
    Crucial: Asegurar que el useEffect de limpieza (cleanup) funcione para no dejar procesos colgados en memoria.

 - Tercero: Particles mejorado — aprendés cómo un componente puede manejar su propio estado sin molestar al resto.

[ ] Refactorizar Particles.tsx:

    Cambiar la lógica: en lugar de que el padre gestione un array, el padre solo "dispara" la creación.
    Hacer que cada partícula maneje su propio setTimeout para desaparecer.
    Esto limpia el App.tsx de estados innecesarios de UI.

 - Cuarto: useTypingGame — el más grande. Una vez que entendiste hooks con useTimer, este es el mismo concepto pero más completo.

[ ] Crear hooks/useTypingGame.ts:

    Mover la gestión de words, completedWords y currentInput.
    Migrar el handleKeyDown y la lógica de validación de caracteres que corregimos.
    Mover los useMemo de correctChars, accuracy y wpm aquí dentro.
    Exportar: Un objeto limpio con el estado actual y los manejadores de eventos.

 - Último: GameScreen — cuando ya separaste todo, App.tsx queda tan liviano que refactorizarlo es trivial.

 [ ] Refactorizar App.tsx (o crear GameScreen.tsx):

    Borrar casi todos los useState y useEffect originales.
    Llamar a useTimer() y useTypingGame().
    Conectar ambos: "Si el juego termina en el hook de juego, llamar a stopTimer()".
    Pasar los datos a los subcomponentes (Stats, TypingArea, FinishScreen).
