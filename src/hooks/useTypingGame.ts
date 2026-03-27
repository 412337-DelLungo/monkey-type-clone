import { useState, useCallback, useMemo, useEffect } from "react";
import { getRandomWords } from "../utils/wordsProvider";

interface UseTypingGameOptions {
  elapsed: number;
  onCorrectChar: () => void;
  onStart: () => void;
  onStop: () => void;
  onReset: () => void;
}

export function useTypingGame({
  elapsed,
  onCorrectChar,
  onStart,
  onStop,
  onReset,
}: UseTypingGameOptions) {
  const [words, setWords] = useState<string[]>([]);
  const [completedWords, setCompletedWords] = useState<string[]>([]);
  const [currentInput, setCurrentInput] = useState("");
  const [started, setStarted] = useState(false);
  const [finished, setFinished] = useState(false);
  const [combo, setCombo] = useState(0);
  const [maxCombo, setMaxCombo] = useState(0);
  const [shake, setShake] = useState(false);

  const loadWords = useCallback(() => {
    setWords(getRandomWords(50));
  }, []);

  useEffect(() => {
    loadWords();
  }, [loadWords]);

  const currentWordIdx = completedWords.length;

  // Manejar teclas
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (finished || !started) return;

      const printable =
        e.key.length === 1 && !e.ctrlKey && !e.metaKey && !e.altKey;

      // Ignorar teclas de control
      if (e.key === "Backspace" || e.key === "Tab" || e.key === " ") return;
      if (!printable) return;

      const word = words[currentWordIdx];
      if (!word) return;
      if (currentInput.length >= word.length) return;

      const isCorrect = e.key === word[currentInput.length];

      if (isCorrect) {
        const nextInput = currentInput + e.key;

        setCurrentInput(nextInput);
        setCombo((prev) => {
          const next = prev + 1;
          setMaxCombo((m) => Math.max(m, next));
          return next;
        });
        onCorrectChar();

        // Palabra completada
        if (nextInput.length === word.length) {
          setCompletedWords((prev) => [...prev, nextInput]);
          setCurrentInput("");
        }
      } else {
        setCombo(0);
        setShake(true);
        setTimeout(() => setShake(false), 200);
      }
    },
    [finished, started, currentWordIdx, currentInput, words, onCorrectChar],
  );

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  // Detectar cuando se completan todas las palabras
  useEffect(() => {
    if (words.length === 0) return;
    if (completedWords.length >= words.length) {
      setFinished(true);
      onStop();
    }
  }, [completedWords.length, words.length, onStop]);

  // Start
  const handleStart = useCallback(() => {
    setStarted(true);
    onStart();
  }, [onStart]);

  // Restart
  const handleRestart = useCallback(() => {
    setCompletedWords([]);
    setCurrentInput("");
    setStarted(false);
    setFinished(false);
    setCombo(0);
    setMaxCombo(0);
    onReset();
    loadWords();
  }, [loadWords, onReset]);

  // Escuchar Tab+Enter para reiniciar
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (finished && (e.key === "Tab" || (e.key === "Enter" && !e.shiftKey))) {
        handleRestart();
      }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [finished, handleRestart]);

  // Calcular correctChars y totalChars
  const { correctChars, totalChars } = useMemo(() => {
    let correct = 0;
    let total = 0;

    // Palabras completadas
    completedWords.forEach((typed, wIdx) => {
      const target = words[wIdx];
      if (!target) return;
      for (let c = 0; c < typed.length; c++) {
        if (typed[c] === target[c]) correct++;
      }
      total += typed.length;
    });

    // Palabra actual
    const targetWord = words[currentWordIdx];
    if (targetWord) {
      for (let c = 0; c < currentInput.length; c++) {
        if (currentInput[c] === targetWord[c]) correct++;
      }
      total += currentInput.length;
    }

    return { correctChars: correct, totalChars: total };
  }, [completedWords, currentInput, words, currentWordIdx]);

  const wpm = useMemo(() => {
    if (elapsed === 0) return 0;
    return Math.round(correctChars / 5 / (elapsed / 60));
  }, [correctChars, elapsed]);

  const accuracy = useMemo(() => {
    if (totalChars === 0) return 100;
    return Math.round((correctChars / totalChars) * 100);
  }, [correctChars, totalChars]);

  return {
    words,
    completedWords,
    currentInput,
    currentWordIdx,
    started,
    finished,
    combo,
    maxCombo,
    shake,
    wpm,
    accuracy,
    handleStart,
    handleRestart,
  };
}
