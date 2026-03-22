import type { CSSProperties } from 'react';
import './Particles.css';

interface Props {
  x: number;
  y: number;
  color: string;
}

function Particles({ x, y, color }: Props) {
  return (
    <div className="particles-container" style={{ left: x, top: y }}>
      {[...Array(6)].map((_, i) => {
        const dx = (Math.random() - 0.5) * 80;
        const dy = -30 - Math.random() * 40;
        const delay = i * 0.04;
        const style: CSSProperties = {
          background: color,
          '--dx': `${dx}px`,
          '--dy': `${dy}px`,
          '--delay': `${delay}s`,
        } as CSSProperties;
        return (
          <div key={i} className="particle" style={style} />
        );
      })}
    </div>
  );
}

export default Particles;
