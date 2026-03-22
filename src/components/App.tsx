import { useState, useEffect, useCallback, useRef } from 'react';
import TypingArea, { TypingAreaHandle } from './TypingArea';
import ComboCounter from './ComboCounter';
import Particles from './Particles';
import Stats from './Stats';
import './App.css';

interface ParticleData {
  id: number;
  x: number;
  y: number;
  color: string;
}

function App() {
  const [words, setWords] = useState<string[]>([]);
  const [completedWords, setCompletedWords] = useState<string[]>([]);
  const [currentInput, setCurrentInput] = useState('');
  const [started, setStarted] = useState(false);
  const [finished, setFinished] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const [combo, setCombo] = useState(0);
  const [maxCombo, setMaxCombo] = useState(0);
  const [particles, setParticles] = useState<ParticleData[]>([]);
  const [shake, setShake] = useState(false);
  const particleId = useRef(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const typingAreaRef = useRef<TypingAreaHandle>(null);

  const WORD_LIST = [
    "el","la","los","las","un","una","de","del","al","que","y","en","es",
    "por","para","con","sin","sobre","entre","este","esta","esto","como",
    "pero","mas","porque","cuando","donde","todo","tener","hacer","ir",
    "ser","estar","poder","decir","ver","dar","saber","querer","llegar",
    "casa","tiempo","dia","noche","ahora","siempre","nunca","lugar","forma",
    "parte","cosa","mundo","vida","gente","persona","trabajo","ciudad",
    "pais","agua","aire","fuego","tierra","sol","luna","grande","pequeno",
    "nuevo","viejo","bueno","malo","largo","corto","alto","bajo","rapido",
    "lento","facil","dificil","ordenador","teclado","pantalla","raton",
    "ventana","programa","dato","informacion","sistema","red","internet",
    "texto","letra","palabra","numero","resultado","problema","solucion",
    "idea","concepto","practica","libro","musica","foto","video","juego",
    "luz","sombra","color","blanco","negro","rojo","azul","verde","amarillo",
    "lluvia","viento","nube","arbol","flor","planta","perro","gato","pajaro",
    "nio","amigo","familia","trabajador","estudiante","profesor","medico",
    "comer","beber","dormir","correr","saltar","jugar","leer","escribir",
    "hablar","escuchar","mirar","tocar","oler","sentir","pensar","crear",
    "aprender","enseñar","preguntar","responder","buscar","encontrar",
    "empezar","terminar","continuar","parar","cambiar","mejorar","crecer"
  ];

  const loadWords = useCallback(() => {
    const shuffled = [...WORD_LIST].sort(() => Math.random() - 0.5);
    const selected: string[] = [];
    while (selected.length < 50) {
      for (const w of shuffled) {
        if (selected.length >= 50) break;
        selected.push(w);
      }
    }
    setWords(selected);
  }, []);

  useEffect(() => { loadWords(); }, [loadWords]);

  const spawnParticles = useCallback(() => {
    const rect = typingAreaRef.current?.getCursorRect();
    if (!rect) return;
    const colors = ['#e2b714', '#f0c040', '#fff', '#ffd700', '#ffb347'];
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
    setParticles(prev => [...prev, ...newParts]);
    setTimeout(() => {
      setParticles(prev => prev.filter(p => !newParts.find(np => np.id === p.id)));
    }, 800);
  }, []);

  const currentWordIdx = completedWords.length;

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (finished || !started) return;

    const printable = e.key.length === 1 && !e.ctrlKey && !e.metaKey && !e.altKey;

    if (e.key === 'Backspace' || e.key === 'Tab' || e.key === ' ') return;

    if (!printable) return;

    const word = words[currentWordIdx];
    if (!word) return;

    if (currentInput.length >= word.length) return;

    const isCorrect = e.key === word[currentInput.length];

    if (isCorrect) {
      const nextInput = currentInput + e.key;
      if (nextInput.length === word.length) {
        setCompletedWords(prev => [...prev, nextInput]);
        setCurrentInput('');
        setCombo(prev => {
          const next = prev + 1;
          setMaxCombo(m => Math.max(m, next));
          return next;
        });
        spawnParticles();
      } else {
        setCurrentInput(nextInput);
        setCombo(prev => {
          const next = prev + 1;
          setMaxCombo(m => Math.max(m, next));
          return next;
        });
        spawnParticles();
      }
    } else {
      setCombo(0);
      setShake(true);
      setTimeout(() => setShake(false), 200);
    }
  }, [finished, started, currentWordIdx, currentInput, words, spawnParticles]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  useEffect(() => {
    if (started && !finished) {
      const startTime = Date.now();
      timerRef.current = setInterval(() => {
        setElapsed(Math.floor((Date.now() - startTime) / 1000));
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

  const handleRestart = () => {
    setCompletedWords([]);
    setCurrentInput('');
    setStarted(false);
    setFinished(false);
    setElapsed(0);
    setCombo(0);
    setMaxCombo(0);
    setParticles([]);
    if (timerRef.current) clearInterval(timerRef.current);
    loadWords();
  };

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (finished && (e.key === 'Tab' || (e.key === 'Enter' && !e.shiftKey))) {
        handleRestart();
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [finished, handleRestart]);

  const totalChars = completedWords.join('').length + currentInput.length;
  let correctChars = 0;
  for (let w = 0; w < completedWords.length; w++) {
    const target = words[w];
    const typed = completedWords[w];
    for (let c = 0; c < target.length; c++) {
      if (typed[c] === target[c]) correctChars++;
    }
  }
  const targetWord = words[currentWordIdx] || '';
  for (let c = 0; c < currentInput.length; c++) {
    if (currentInput[c] === targetWord[c]) correctChars++;
  }

  const wpm = elapsed > 0 ? Math.round((correctChars / 5) / (elapsed / 60)) : 0;
  const accuracy = totalChars > 0 ? Math.round((correctChars / totalChars) * 100) : 100;

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

          <p className={`restart-hint ${finished ? 'visible' : ''}`}>
            Presiona <kbd>Tab</kbd> + <kbd>Enter</kbd> para reiniciar
          </p>
        </div>

        <ComboCounter combo={combo} maxCombo={maxCombo} />

        {particles.map(p => (
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
