import { useEffect, useRef, useState } from 'react';
import { Gauge } from 'lucide-react';

/**
 * Scroll speed, kept dead simple: one small pill, one number.
 * Smoothed scroll velocity mapped to a 0–320 km/h readout.
 */
export default function ScrollSpeedo() {
  const [kmh, setKmh] = useState(0);
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
      s.vel += (inst - s.vel) * 0.12;
      setKmh(Math.min(320, Math.round(s.vel * 130)));
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  const hot = kmh > 250;
  return (
    <div
      dir="ltr"
      className={`fixed bottom-4 left-4 z-[120] flex items-center gap-2 rounded-full border border-white/10 bg-void/70 px-3.5 py-2 backdrop-blur-md transition-opacity duration-500 ${kmh < 3 ? 'opacity-50' : 'opacity-100'}`}
      aria-hidden
    >
      <Gauge size={14} className={hot ? 'text-signal' : 'text-bone/60'} />
      <span className={`font-grotesk text-sm font-bold leading-none tabular-nums ${hot ? 'text-signal' : 'text-bone'}`} dir="ltr">
        {kmh}
      </span>
      <span className="font-grotesk text-[9px] uppercase tracking-[0.18em] text-bone/50" dir="ltr">km/h</span>
    </div>
  );
}
