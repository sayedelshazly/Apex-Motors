import { useEffect, useRef } from 'react';

/**
 * Fixed HUD speedometer that reads your SCROLL velocity as km/h.
 * Scroll fast enough and it hits the redline.
 */
const MAX = 320;

export default function ScrollSpeedo() {
  const needleRef = useRef(null);
  const numRef = useRef(null);
  const boxRef = useRef(null);

  useEffect(() => {
    let lastY = window.scrollY;
    let lastT = performance.now();
    let velocity = 0; // px per second (smoothed)
    let shown = 0;
    let raf;

    const onScroll = () => {
      const now = performance.now();
      const dy = Math.abs(window.scrollY - lastY);
      const dt = Math.max(1, now - lastT);
      const v = (dy / dt) * 1000;
      velocity = velocity * 0.55 + v * 0.45;
      lastY = window.scrollY;
      lastT = now;
    };
    window.addEventListener('scroll', onScroll, { passive: true });

    const loop = () => {
      // decay when the user stops scrolling
      if (performance.now() - lastT > 60) velocity *= 0.9;
      const kmh = Math.min(MAX, velocity / 13);
      shown += (kmh - shown) * 0.18;
      if (shown < 0.4) shown = 0;

      const ratio = shown / MAX;
      if (needleRef.current) {
        needleRef.current.style.transform = `rotate(${-90 + ratio * 180}deg)`;
      }
      if (numRef.current) {
        numRef.current.textContent = String(Math.round(shown));
      }
      if (boxRef.current) {
        boxRef.current.dataset.red = ratio > 0.8 ? 'true' : 'false';
      }
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => {
      window.removeEventListener('scroll', onScroll);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div
      ref={boxRef}
      data-red="false"
      dir="ltr"
      className="fixed bottom-4 left-4 z-[120] hidden select-none items-end gap-1 border border-line bg-void/70 px-3 pb-2 pt-1 backdrop-blur-md transition-shadow duration-300 data-[red=true]:shadow-[0_0_30px_rgba(255,75,31,0.35)] sm:flex"
      aria-hidden
    >
      <div className="relative w-[86px]">
        <svg viewBox="0 0 200 120" className="w-full">
          <path d="M 20 105 A 85 85 0 0 1 180 105" fill="none" stroke="#26262c" strokeWidth="12" strokeLinecap="round" />
          <path d="M 20 105 A 85 85 0 0 1 180 105" fill="none" stroke="#ff4b1f" strokeWidth="12" strokeLinecap="round" strokeDasharray="267" strokeDashoffset="-213" />
        </svg>
        <div
          ref={needleRef}
          className="absolute bottom-[10px] left-1/2 h-[38px] w-[3px] origin-bottom rounded bg-bone"
          style={{ transform: 'rotate(-90deg)', translate: '-50% 0' }}
        />
        <div className="absolute bottom-[5px] left-1/2 h-2.5 w-2.5 -translate-x-1/2 rounded-full bg-bone" />
      </div>
      <div className="pb-1 text-left">
        <div className="flex items-baseline gap-1">
          <span ref={numRef} className="font-display text-[26px] leading-none text-bone">0</span>
          <span className="font-grotesk text-[8px] uppercase tracking-[0.18em] text-dim">km/h</span>
        </div>
        <div className="mt-0.5 font-grotesk text-[8px] uppercase tracking-[0.28em] text-dim">
          Scroll speed
        </div>
        <div className="font-grotesk text-[8px] font-bold uppercase tracking-[0.28em] text-signal opacity-0 transition-opacity duration-200 [[data-red=true]_&]:opacity-100">
          Redline!
        </div>
      </div>
    </div>
  );
}
