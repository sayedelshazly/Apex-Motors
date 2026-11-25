/* ELSHAZLY MOTORS mark — just the letter E built from three big speed
   bars (bone → signal gradient). No frame, no hexagon. */
export default function Logo({ className = 'h-9 w-9' }) {
  return (
    <svg viewBox="0 0 100 100" className={className} fill="none" aria-hidden="true">
      <defs>
        <linearGradient id="em-grad" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#f2f0ea" />
          <stop offset="55%" stopColor="#ff7a3d" />
          <stop offset="100%" stopColor="#ff4b1f" />
        </linearGradient>
      </defs>
      <polygon points="22,13 93,13 76,31 5,31" fill="url(#em-grad)" />
      <polygon points="20,41 83,41 66,59 3,59" fill="url(#em-grad)" />
      <polygon points="18,69 89,69 72,87 1,87" fill="url(#em-grad)" />
    </svg>
  );
}
