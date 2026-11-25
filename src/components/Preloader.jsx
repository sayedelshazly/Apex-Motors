import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { BatteryCharging, CircleGauge, Fuel, TriangleAlert } from 'lucide-react';
import { useLang } from '../i18n.jsx';

/**
 * Preloader as a car dashboard: ignition self-test lights, a big RPM
 * gauge whose needle sweeps with the loading count, a km/h readout,
 * and a final redline flash before the curtain lifts.
 */
export default function Preloader({ onDone }) {
  const { t } = useLang();
  const [count, setCount] = useState(0);

  useEffect(() => {
    let v = 0;
    const id = setInterval(() => {
      v += Math.floor(Math.random() * 9) + 3;
      if (v >= 100) {
        v = 100;
        clearInterval(id);
        setTimeout(onDone, 520);
      }
      setCount(v);
    }, 92);
    return () => clearInterval(id);
  }, [onDone]);

  // count -> RPM (0..8000) with a little overshoot drama near the end
  const rpm = Math.round((count / 100) * 8000);
  const kmh = Math.round((count / 100) * 320);
  const needleDeg = -120 + (count / 100) * 240;
  const lightsOff = count > 55; // self-test done

  const ticks = Array.from({ length: 9 }, (_, i) => i); // 0..8 (x1000)

  return (
    <motion.div
      className="noise fixed inset-0 z-[300] flex flex-col justify-between overflow-hidden bg-[#08080a] px-6 py-7 md:px-12"
      exit={{ y: '-100%' }}
      transition={{ duration: 0.9, ease: [0.83, 0, 0.17, 1] }}
    >
      <div className="flex items-center justify-between font-grotesk text-[11px] uppercase tracking-[0.35em] text-[#9b978c]">
        <span className="font-display text-lg tracking-wide text-[#f2f0ea]" dir="ltr">
          ELSHAZLY<span className="text-signal">.</span>
        </span>
        <span className="flex items-center gap-2">
          <span className={`h-2 w-2 rounded-full ${count >= 100 ? 'bg-signal' : 'bg-amber-400 animate-pulse-dot'}`} />
          {count >= 100 ? 'Engine ready' : 'Ignition check'}
        </span>
      </div>

      {/* dashboard cluster */}
      <div className="flex flex-col items-center" dir="ltr">
        <div className="w-[min(430px,86vw)]">
          <div className="relative">
          <svg viewBox="0 0 220 190" className="w-full">
            {/* track — 240° dashboard sweep */}
            <path d="M 30 164 A 92 92 0 1 1 190 164" fill="none" stroke="#232329" strokeWidth="11" strokeLinecap="round" />
            {/* redline zone (last 25%) */}
            <path d="M 30 164 A 92 92 0 1 1 190 164" fill="none" stroke="#ff4b1f" strokeWidth="11" strokeLinecap="round"
              strokeDasharray="385" strokeDashoffset="-289" opacity="0.95" />
            {/* progress arc */}
            <path d="M 30 164 A 92 92 0 1 1 190 164" fill="none" stroke="#f2f0ea" strokeWidth="4" strokeLinecap="round"
              strokeDasharray="385" strokeDashoffset={385 - (count / 100) * 385} style={{ transition: 'stroke-dashoffset .12s linear' }} />
            {ticks.map((n) => {
              const ang = (-120 + (n / 8) * 240) * (Math.PI / 180);
              const x1 = 110 + Math.sin(ang) * 74, y1 = 118 - Math.cos(ang) * 74;
              const x2 = 110 + Math.sin(ang) * 83, y2 = 118 - Math.cos(ang) * 83;
              const tx = 110 + Math.sin(ang) * 57, ty = 118 - Math.cos(ang) * 57;
              return (
                <g key={n}>
                  <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={n >= 6 ? '#ff4b1f' : '#6d6a61'} strokeWidth="2.5" />
                  <text x={tx} y={ty + 4} textAnchor="middle" fontSize="11" fontFamily="Anton, sans-serif"
                    fill={n >= 6 ? '#ff4b1f' : '#9b978c'}>{n}</text>
                </g>
              );
            })}
          </svg>
          {/* needle — hub sits at (110,118) of the 220×190 viewBox */}
          <div
            className="absolute bottom-[37.9%] left-1/2 h-[36%] w-[4px] origin-bottom rounded-full bg-signal shadow-[0_0_14px_rgba(255,75,31,0.8)]"
            style={{ transform: `rotate(${needleDeg}deg)`, translate: '-50% 0', transition: 'transform .12s linear' }}
          />
          <div className="absolute bottom-[37.9%] left-1/2 h-5 w-5 -translate-x-1/2 translate-y-1/2 rounded-full border-[3px] border-[#232329] bg-[#f2f0ea]" />
          </div>
          <div className="mt-1 text-center">
            <span className="font-display text-4xl text-[#f2f0ea] md:text-5xl">{rpm.toLocaleString('en-US')}</span>
            <span className="ml-2 font-grotesk text-[10px] uppercase tracking-[0.25em] text-[#9b978c]">rpm</span>
          </div>
        </div>

        {/* warning lights — ignition self-test */}
        <div className="mt-14 flex items-center gap-6 md:mt-16">
          {[
            { Icon: BatteryCharging, label: 'BAT' },
            { Icon: TriangleAlert, label: 'CHECK' },
            { Icon: Fuel, label: 'FUEL' },
            { Icon: CircleGauge, label: 'BOOST' },
          ].map(({ Icon, label }) => (
            <span
              key={label}
              className={`flex flex-col items-center gap-1 transition-all duration-500 ${
                lightsOff ? 'text-[#3a3a41]' : 'text-amber-400 drop-shadow-[0_0_8px_rgba(251,191,36,0.65)]'
              }`}
            >
              <Icon size={21} />
              <span className="font-grotesk text-[8px] uppercase tracking-[0.2em]">{label}</span>
            </span>
          ))}
        </div>
      </div>

      {/* bottom readouts */}
      <div>
        <div className="mb-4 flex items-end justify-between" dir="ltr">
          <div>
            <span className="font-display text-6xl leading-none text-[#f2f0ea] md:text-7xl">{count}</span>
            <span className="ml-1 font-display text-2xl text-signal">%</span>
          </div>
          <div className="text-right">
            <div className="font-display text-3xl leading-none text-[#f2f0ea] md:text-4xl">
              {kmh}<span className="ml-1 text-sm text-signal">KM/H</span>
            </div>
            <div className="mt-1 font-ar text-sm text-[#9b978c]">{t('pre.line')}</div>
          </div>
        </div>
        <div className="h-[3px] w-full overflow-hidden bg-white/10" dir="ltr">
          <div className="h-full bg-signal transition-[width] duration-150 ease-out" style={{ width: `${count}%` }} />
        </div>
      </div>
    </motion.div>
  );
}
