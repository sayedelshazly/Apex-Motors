/* ELSHAZLY MOTORS badge — hexagon crest with the E built from three
   speed bars (bone → signal gradient). Hexagon follows currentColor. */
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
      <path d="M50 5 L89 27.5 V72.5 L50 95 L11 72.5 V27.5 Z" stroke="currentColor" strokeWidth="6" strokeLinejoin="round" />
      <polygon points="37,30 78,30 66,41.5 29,41.5" fill="url(#em-grad)" />
      <polygon points="35,44.5 69,44.5 57,56 27,56" fill="url(#em-grad)" />
      <polygon points="33,59 74,59 62,70.5 25,70.5" fill="url(#em-grad)" />
    </svg>
  );
}
