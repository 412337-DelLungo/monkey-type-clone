import { useEffect, useRef, useState } from 'react';
import './ComboCounter.css';

interface Props {
  combo: number;
  maxCombo: number;
}

function ComboCounter({ combo, maxCombo }: Props) {
  const [pop, setPop] = useState(false);
  const prevCombo = useRef(0);

  useEffect(() => {
    if (combo > prevCombo.current && combo > 0) {
      setPop(true);
      setTimeout(() => setPop(false), 200);
    }
    prevCombo.current = combo;
  }, [combo]);

  return (
    <div className="combo-container">
      <div className={`combo-number ${combo > 0 ? 'active' : ''} ${pop ? 'pop' : ''}`}>
        {combo}
      </div>
      <div className="combo-label">combo</div>
      {maxCombo > 5 && (
        <div className="max-combo">
          max: <span>{maxCombo}</span>
        </div>
      )}
    </div>
  );
}

export default ComboCounter;
