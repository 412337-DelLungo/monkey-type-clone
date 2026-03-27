import { useState, useEffect, useCallback, useRef, useMemo } from "react";
import TypingArea, { TypingAreaHandle } from "./TypingArea/TypingArea";
import ComboCounter from "./ComboCounter/ComboCounter";
import Particles from "./Particles/Particles";
import Stats from "./Stats/Stats";
import "./App.css";
import { getRandomWords } from "../utils/wordsProvider";

interface ParticleData {
  id: number;
  x: number;
  y: number;
  color: string;
}

function App() {
  const [words, setWords] = useState<string[]>([]);
  const [completedWords, setCompletedWords] = useState<string[]>([]);
  const [currentInput, setCurrentInput] = useState("");
  const [started, setStarted] = useState(false);
  const [finished, setFinished] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const [combo, setCombo] = useState(0);
  const [maxCombo, setMaxCombo] = useState(0);
  const [particles, setParticles] = useState<ParticleData[]>([]);
  const [shake, setShake] = useState(false);
  const particleId = useRef(0);
  const startTimeRef = useRef<number | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const typingAreaRef = useRef<TypingAreaHandle>(null);

  const loadWords = useCallback(() => {
    const selected = getRandomWords(50);
    setWords(selected);
  }, []);

  useEffect(() => {
    loadWords();
  }, [loadWords]);

  const spawnParticles = useCallback(() => {
    const rect = typingAreaRef.current?.getCursorRect();
    if (!rect) return;
    const colors = ["#e2b714", "#f0c040", "#fff", "#ffd700", "#ffb347"];
    const newParts: ParticleData[] = [];
    const count = 4 + Math.floor(Math.random() * 3);
    for (let i = 0; i < count; i++) {
      newParts.push({
        id: particleId.current++,
        x: rect.left + Math.random() * rect.width,
        y: rect.top + Math.random() * rect.height,
        color: colors[Math.floor(Math.random() * colors.length)],
      });
    }
    setParticles((prev) => [...prev, ...newParts]);
    setTimeout(() => {
      setParticles((prev) =>
        prev.filter((p) => !newParts.find((np) => np.id === p.id)),
      );
    }, 800);
  }, []);

  const currentWordIdx = completedWords.length;

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (finished || !started) return;

      const printable =
        e.key.length === 1 && !e.ctrlKey && !e.metaKey && !e.altKey;

      if (e.key === "Backspace" || e.key === "Tab" || e.key === " ") return;

      if (!printable) return;

      const word = words[currentWordIdx];
      if (!word) return;

      if (currentInput.length >= word.length) return;

      const isCorrect = e.key === word[currentInput.length];

      if (isCorrect) {
        const nextInput = currentInput + e.key;
        if (nextInput.length === word.length) {
          setCompletedWords((prev) => [...prev, nextInput]);
          setCurrentInput("");
          setCombo((prev) => {
            const next = prev + 1;
            setMaxCombo((m) => Math.max(m, next));
            return next;
          });
          spawnParticles();
        } else {
          setCurrentInput(nextInput);
          setCombo((prev) => {
            const next = prev + 1;
            setMaxCombo((m) => Math.max(m, next));
            return next;
          });
          spawnParticles();
        }
      } else {
        setCombo(0);
        setShake(true);
        setTimeout(() => setShake(false), 200);
      }
    },
    [finished, started, currentWordIdx, currentInput, words, spawnParticles],
  );

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  useEffect(() => {
    if (started && !finished) {
      startTimeRef.current = Date.now();
      timerRef.current = setInterval(() => {
        setElapsed(Math.floor((Date.now() - startTimeRef.current!) / 1000));
      }, 100);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [started, finished]);

  useEffect(() => {
    if (finished && timerRef.current) {
      clearInterval(timerRef.current);
    }
  }, [finished]);

  useEffect(() => {
    if (words.length === 0) return;
    if (completedWords.length >= words.length) {
      setFinished(true);
    }
  }, [completedWords.length, words.length]);

  const handleStart = () => {
    setStarted(true);
  };

  const handleRestart = useCallback(() => {
    setCompletedWords([]);
    setCurrentInput("");
    setStarted(false);
    setFinished(false);
    setElapsed(0);
    setCombo(0);
    setMaxCombo(0);
    setParticles([]);
    if (timerRef.current) clearInterval(timerRef.current);
    loadWords();
  }, [loadWords]);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (finished && (e.key === "Tab" || (e.key === "Enter" && !e.shiftKey))) {
        handleRestart();
      }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [finished, handleRestart]);

  const { correctChars, totalChars } = useMemo(() => {
    let correct = 0;
    let total = 0;

    // 1. Contar caracteres en palabras ya completadas
    completedWords.forEach((typed, wIdx) => {
      const target = words[wIdx];
      if (!target) return;

      for (let c = 0; c < typed.length; c++) {
        if (typed[c] === target[c]) correct++;
      }
      total += typed.length;
    });

    // 2. Contar caracteres de la palabra que estás escribiendo ahora
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

  return (
    <div className="app">
      <div className="header">
        <h1>monkey type</h1>
      </div>

      <div className="main">
        <div className="typing-section">
          <Stats wpm={wpm} accuracy={accuracy} time={elapsed} />
          <TypingArea
            ref={typingAreaRef}
            words={words}
            completedWords={completedWords}
            currentInput={currentInput}
            currentWordIdx={currentWordIdx}
            started={started}
            shake={shake}
          />

          {!started && !finished && (
            <button className="start-btn" onClick={handleStart}>
              Start
            </button>
          )}

          <p className={`restart-hint ${finished ? "visible" : ""}`}>
            Presiona <kbd>Tab</kbd> + <kbd>Enter</kbd> para reiniciar
          </p>
        </div>

        <ComboCounter combo={combo} maxCombo={maxCombo} />

        {particles.map((p) => (
          <Particles key={p.id} x={p.x} y={p.y} color={p.color} />
        ))}

        {finished && (
          <div className="finish-overlay">
            <h2>Completado!</h2>
            <div className="finish-stats">
              <div className="finish-stat">
                <div className="value">{wpm}</div>
                <div className="label">WPM</div>
              </div>
              <div className="finish-stat">
                <div className="value">{accuracy}%</div>
                <div className="label">Precision</div>
              </div>
              <div className="finish-stat">
                <div className="value">{elapsed}s</div>
                <div className="label">Tiempo</div>
              </div>
              <div className="finish-stat">
                <div className="value">{maxCombo}</div>
                <div className="label">Max Combo</div>
              </div>
            </div>
            <button className="restart-btn" onClick={handleRestart}>
              Reiniciar
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
