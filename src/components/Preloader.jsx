import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

export default function Preloader({ onDone }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let v = 0;
    const id = setInterval(() => {
      v += Math.floor(Math.random() * 9) + 3;
      if (v >= 100) {
        v = 100;
        clearInterval(id);
        setTimeout(onDone, 450);
      }
      setCount(v);
    }, 90);
    return () => clearInterval(id);
  }, [onDone]);

  return (
    <motion.div
      className="noise fixed inset-0 z-[300] flex flex-col justify-between overflow-hidden bg-void px-6 py-8 md:px-12"
      exit={{ y: '-100%' }}
      transition={{ duration: 0.9, ease: [0.83, 0, 0.17, 1] }}
    >
      <div className="flex items-center justify-between font-grotesk text-xs uppercase tracking-[0.35em] text-dim">
        <span>APEX MOTORS</span>
        <span className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-signal animate-pulse-dot" />
          Loading the beasts
        </span>
      </div>

      <div className="flex items-end justify-between" dir="ltr">
        <div className="font-display text-[26vw] leading-[0.8] text-bone md:text-[19rem]">
          {count}
          <span className="text-signal">%</span>
        </div>
      </div>

      <div>
        <div className="mb-4 flex justify-between font-ar text-sm text-dim">
          <span>بنجهّز الوحوش…</span>
          <span className="font-grotesk" dir="ltr">EST. 2012 — CAIRO</span>
        </div>
        <div className="h-[3px] w-full overflow-hidden bg-smoke" dir="ltr">
          <div
            className="h-full bg-signal transition-[width] duration-150 ease-out"
            style={{ width: `${count}%` }}
          />
        </div>
      </div>
    </motion.div>
  );
}
