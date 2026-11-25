import { useEffect, useRef, useState } from 'react';

/**
 * Scroll speed as a proper needle gauge — one clean 240° dial,
 * a chunky needle, red zone past 250, and a big digital readout.
 */
const MAX = 320;
const REDLINE = 250;

const polar = (cx, cy, r, deg) => {
  const rad = ((deg - 90) * Math.PI) / 180;
  return [cx + r * Math.cos(rad), cy + r * Math.sin(rad)];
};
const arc = (cx, cy, r, from, to) => {
  const [sx, sy] = polar(cx, cy, r, from);
  const [ex, ey] = polar(cx, cy, r, to);
  return `M ${sx} ${sy} A ${r} ${r} 0 ${to - from > 180 ? 1 : 0} 1 ${ex} ${ey}`;
};
const angleFor = (v) => -120 + (Math.min(MAX, Math.max(0, v)) / MAX) * 240;

export default function ScrollSpeedo() {
  const [kmh, setKmh] = useState(0);
  const [show, setShow] = useState(false);
  const state = useRef({ last: 0, vel: 0 });

  useEffect(() => {
    let raf;
    let lastT = performance.now();
    const tick = (t) => {
      const dt = Math.max(1, t - lastT);
      lastT = t;
      const s = state.current;
      const y = window.scrollY;
      const inst = Math.abs(y - s.last) / dt; // px per ms
      s.last = y;
      s.vel += (inst - s.vel) * 0.075;
      const next = Math.min(MAX, Math.round(s.vel * 130));
      setKmh((prev) => (prev === next ? prev : next));
      const vis = y > 60 && document.documentElement.scrollHeight - (y + window.innerHeight) > 180;
      setShow((prev) => (prev === vis ? prev : vis));
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  const hot = kmh >= REDLINE;
  const ticks = [0, 40, 80, 120, 160, 200, 240, 280, 320];

  return (
    <div
      dir="ltr"
      className={`fixed bottom-4 left-4 z-[120] w-[116px] origin-bottom-left transition-all duration-500 [filter:drop-shadow(0_2px_10px_rgba(0,0,0,0.7))] max-sm:scale-[0.6] ${show ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-5 opacity-0"}`}
      aria-hidden
    >
      <svg viewBox="0 0 160 100" className="w-full">
        {/* track */}
        <path d={arc(80, 76, 60, -120, 120)} fill="none" stroke="rgba(255,255,255,0.28)" strokeWidth="9" strokeLinecap="round" />
        {/* red zone */}
        <path d={arc(80, 76, 60, angleFor(REDLINE), 120)} fill="none" stroke="rgba(255,75,31,0.45)" strokeWidth="9" />
        {/* active arc */}
        {kmh > 2 && (
          <path
            d={arc(80, 76, 60, -120, angleFor(kmh))}
            fill="none"
            stroke="#ff4b1f"
            strokeWidth="9"
            strokeLinecap="round"
            style={{ filter: 'drop-shadow(0 0 6px rgba(255,75,31,0.75))' }}
          />
        )}
        {/* ticks + labels */}
        {ticks.map((v) => {
          const a = angleFor(v);
          const [x1, y1] = polar(80, 76, 48, a);
          const [x2, y2] = polar(80, 76, 43, a);
          const major = v % 80 === 0;
          const [lx, ly] = polar(80, 76, 33, a);
          return (
            <g key={v}>
              <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={v >= REDLINE ? '#ff4b1f' : 'rgba(255,255,255,0.55)'} strokeWidth={major ? 2.4 : 1.4} />
              {major && (
                <text x={lx} y={ly + 3} textAnchor="middle" fontSize="9.5" fontWeight="600" fill="rgba(255,255,255,0.65)" fontFamily="Space Grotesk, sans-serif">
                  {v}
                </text>
              )}
            </g>
          );
        })}
        {/* needle */}
        <g
          style={{
            transform: `rotate(${angleFor(kmh)}deg)`,
            transformOrigin: '80px 76px',
            transition: 'transform 240ms cubic-bezier(0.22, 1, 0.36, 1)',
          }}
        >
          <line x1="80" y1="76" x2="80" y2="34" stroke="#f5efe4" strokeWidth="3.5" strokeLinecap="round" />
        </g>
        <circle cx="80" cy="76" r="6.5" fill="#ff4b1f" stroke="#0a0a0c" strokeWidth="2" />
      </svg>
      <div className="mt-0.5 flex items-baseline justify-center gap-1.5">
        <span className={`font-grotesk text-[18px] font-bold leading-none tabular-nums ${hot ? 'text-signal' : 'text-bone'}`}>
          {kmh}
        </span>
        <span className="font-grotesk text-[9px] font-semibold uppercase tracking-[0.2em] text-bone/55">km/h</span>
      </div>
    </div>
  );
}
