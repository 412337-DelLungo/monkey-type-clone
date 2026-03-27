import { useState, useCallback, useRef } from "react";
import TypingArea, { TypingAreaHandle } from "./TypingArea/TypingArea";
import ComboCounter from "./ComboCounter/ComboCounter";
import Particles from "./Particles/Particles";
import Stats from "./Stats/Stats";
import FinishScreen from "./FinishScreen/FinishScreen";
import { useTimer } from "../hooks/useTimer";
import { useTypingGame } from "../hooks/useTypingGame";
import "./App.css";

interface ParticleData {
  id: number;
  x: number;
  y: number;
  color: string;
}

function App() {
  const typingAreaRef = useRef<TypingAreaHandle>(null);
  const particleId = useRef(0);

  // Timer
  const { elapsed, startTimer, stopTimer, resetTimer } = useTimer();

  // Partículas — el padre solo "dispara", cada una se autodestruye
  const [particles, setParticles] = useState<ParticleData[]>([]);

  const spawnParticles = useCallback(() => {
    const rect = typingAreaRef.current?.getCursorRect();
    if (!rect) return;
    const colors = ["#e2b714", "#f0c040", "#fff", "#ffd700", "#ffb347"];
    const count = 4 + Math.floor(Math.random() * 3);
    const newParts: ParticleData[] = [];
    for (let i = 0; i < count; i++) {
      newParts.push({
        id: particleId.current++,
        x: rect.left + Math.random() * rect.width,
        y: rect.top + Math.random() * rect.height,
        color: colors[Math.floor(Math.random() * colors.length)],
      });
    }
    setParticles((prev) => [...prev, ...newParts]);
  }, []);

  const removeParticle = useCallback((id: number) => {
    setParticles((prev) => prev.filter((p) => p.id !== id));
  }, []);

  // Juego de escritura
  const {
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
  } = useTypingGame({
    elapsed,
    onCorrectChar: spawnParticles,
    onStart: startTimer,
    onStop: stopTimer,
    onReset: resetTimer,
  });

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
          <Particles
            key={p.id}
            x={p.x}
            y={p.y}
            color={p.color}
            onDone={() => removeParticle(p.id)}
          />
        ))}

        {finished && (
          <FinishScreen
            wpm={wpm}
            accuracy={accuracy}
            time={elapsed}
            maxCombo={maxCombo}
            onRestart={handleRestart}
          />
        )}
      </div>
    </div>
  );
}

export default App;
