interface Props {
  wpm: number;
  accuracy: number;
  time: number;
  maxCombo: number;
  onRestart: () => void;
}

function FinishScreen({ wpm, accuracy, time, maxCombo, onRestart }: Props) {
  const mins = Math.floor(time / 60);
  const secs = time % 60;

  return (
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
          <div className="value">{mins}:{secs.toString().padStart(2, '0')}</div>
          <div className="label">Tiempo</div>
        </div>
        <div className="finish-stat">
          <div className="value">{maxCombo}</div>
          <div className="label">Max Combo</div>
        </div>
      </div>
      <button className="restart-btn" onClick={onRestart}>
        Reiniciar
      </button>
    </div>
  );
}

export default FinishScreen;
