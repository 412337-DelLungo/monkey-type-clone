import './Stats.css';

interface Props {
  wpm: number;
  accuracy: number;
  time: number;
}

function Stats({ wpm, accuracy, time }: Props) {
  const mins = Math.floor(time / 60);
  const secs = time % 60;

  return (
    <div className="stats-bar">
      <div className="stat-item">
        <span>{wpm}</span> wpm
      </div>
      <div className="stat-item">
        <span>{accuracy}</span>%
      </div>
      <div className="stat-item">
        <span>{mins}:{secs.toString().padStart(2, '0')}</span>
      </div>
    </div>
  );
}

export default Stats;
