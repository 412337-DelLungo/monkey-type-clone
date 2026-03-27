import { useEffect, useState } from 'react';
import type { CSSProperties } from 'react';
import './Particles.css';

interface Props {
  x: number;
  y: number;
  color: string;
  onDone: () => void;
}

function Particles({ x, y, color, onDone }: Props) {
  const [particles] = useState(() => {
    const count = 4 + Math.floor(Math.random() * 3);
    return [...Array(count)].map(() => ({
      dx: (Math.random() - 0.5) * 80,
      dy: -30 - Math.random() * 40,
      delay: Math.random() * 0.24,
    }));
  });

  // Se autodestruye después de que termina la animación
  useEffect(() => {
    const timer = setTimeout(onDone, 1100);
    return () => clearTimeout(timer);
  }, [onDone]);

  return (
    <div className="particles-container" style={{ left: x, top: y }}>
      {particles.map((p, i) => {
        const style: CSSProperties = {
          background: color,
          '--dx': `${p.dx}px`,
          '--dy': `${p.dy}px`,
          '--delay': `${p.delay}s`,
        } as CSSProperties;
        return <div key={i} className="particle" style={style} />;
      })}
    </div>
  );
}

export default Particles;
