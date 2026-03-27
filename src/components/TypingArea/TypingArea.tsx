import { useMemo, useRef, useEffect, useCallback, forwardRef, useImperativeHandle } from 'react';
import './TypingArea.css';

export interface TypingAreaHandle {
  getCursorRect: () => DOMRect | null;
}

interface Props {
  words: string[];
  completedWords: string[];
  currentInput: string;
  currentWordIdx: number;
  started: boolean;
  shake: boolean;
}

const TypingArea = forwardRef<TypingAreaHandle, Props>(
  ({ words, completedWords, currentInput, currentWordIdx, started, shake }, ref) => {
    const cursorRef = useRef<HTMLSpanElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    const getCursorRect = useCallback(() => {
      return cursorRef.current?.getBoundingClientRect() || null;
    }, []);

    useImperativeHandle(ref, () => ({ getCursorRect }));

    useEffect(() => {
      if (cursorRef.current && started) {
        cursorRef.current.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
      }
    }, [completedWords.length, currentInput.length, started]);

    const lines = useMemo(() => {
      const result: { wordIdx: number }[] = [];
      for (let i = 0; i < words.length; i += 15) {
        result.push({ wordIdx: i });
      }
      return result;
    }, [words]);

    return (
      <div ref={containerRef} className={`typing-area ${shake ? 'shake' : ''}`}>
        {lines.map((line, li) => (
          <div key={li} className="word-line">
            {words.slice(line.wordIdx, line.wordIdx + 15).map((word, wi) => {
              const absIdx = line.wordIdx + wi;
              const isCompleted = absIdx < completedWords.length;
              const isActive = absIdx === currentWordIdx;
              const typed = isCompleted ? completedWords[absIdx] : (isActive ? currentInput : '');

              return (
                <span key={wi} className="word">
                  {[...word].map((char, ci) => {
                    const tc = typed[ci];
                    let cls = 'char';
                    if (tc !== undefined) {
                      cls += tc === char ? ' correct' : ' incorrect';
                    }
                    const isCursorHere = isActive && ci === typed.length;
                    if (isCursorHere) cls += ' cursor';
                    return (
                      <span key={ci} ref={isCursorHere ? cursorRef : undefined} className={cls}>
                        {char}
                      </span>
                    );
                  })}
                  {isActive && typed.length === word.length && (
                    <span ref={cursorRef} className="char cursor"></span>
                  )}
                </span>
              );
            })}
          </div>
        ))}
      </div>
    );
  }
);

TypingArea.displayName = 'TypingArea';
export default TypingArea;
