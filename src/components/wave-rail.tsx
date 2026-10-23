const heights = [
  10, 15, 8, 19, 12, 25, 14, 9, 31, 16, 22, 44, 17, 11, 32, 55, 25, 13, 20, 36,
  15, 29, 62, 22, 17, 46, 78, 34, 22, 52, 28, 13, 40, 26, 18, 33, 55, 16, 11, 31,
  20, 13, 41, 19, 29, 45, 11, 17, 37, 20, 12, 48, 25, 13, 33, 11, 16, 44, 20, 9,
];

export function WaveRail() {
  return (
    <div className="wave-rail" aria-hidden="true">
      <div className="wave-bars">
        {heights.map((height, index) => (
          <span key={index} className={index < 29 ? "lit" : ""} style={{ height: `${height}%` }} />
        ))}
      </div>
      <span className="wave-playhead" />
      <span className="wave-time">00:12 / 03:24</span>
    </div>
  );
}
