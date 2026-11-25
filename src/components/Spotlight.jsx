import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowLeft, ArrowRight, Gauge, Timer, Wind } from 'lucide-react';
import { heroCars } from '../data/cars';
import { SectionHeading } from './Reveal';
import EngineStarter from './EngineStarter';

function Counter({ value, active }) {
  const [n, setN] = useState(0);
  useEffect(() => {
    if (!active) return;
    setN(0);
    const target = value;
    const steps = 28;
    let i = 0;
    const id = setInterval(() => {
      i += 1;
      setN(Math.round((target * i) / steps));
      if (i >= steps) clearInterval(id);
    }, 26);
    return () => clearInterval(id);
  }, [value, active]);
  return <span dir="ltr">{n.toLocaleString('en-US')}</span>;
}

export default function Spotlight() {
  const [[idx, dir], setIdx] = useState([0, 1]);
  const [engineOn, setEngineOn] = useState(false);
  const car = heroCars[idx];

  const go = (d) => setIdx(([i]) => [(i + d + heroCars.length) % heroCars.length, d]);

  // auto-rotate pauses while the engine is running — the beast has your attention
  useEffect(() => {
    if (engineOn) return;
    const id = setInterval(() => go(1), 6500);
    return () => clearInterval(id);
  }, [idx, engineOn]);

  return (
    <section id="spotlight" className="relative overflow-hidden px-6 py-24 md:px-12 md:py-32">
      <span className="text-stroke-faint pointer-events-none absolute -top-4 left-0 select-none font-display text-[22vw] leading-none" dir="ltr" aria-hidden>
        BEAST
      </span>

      <SectionHeading tag="Spotlight — Car of the week" ar="نجم الأسبوع" en="SPOTLIGHT" />

      <div className="relative grid items-center gap-10 lg:grid-cols-[1.5fr_1fr]">
        {/* cutout stage — the car floats on a lit podium */}
        <div className="relative aspect-[16/10] overflow-hidden border border-line bg-gradient-to-b from-smoke/70 via-carbon to-void max-lg:-order-1" data-cursor="الوحش">
          <span className="text-stroke-faint pointer-events-none absolute inset-x-0 top-6 select-none text-center font-display text-[7.5rem] leading-none md:text-[10rem]" dir="ltr" aria-hidden>
            {car.brand}
          </span>
          <div className="absolute left-1/2 top-1/2 h-56 w-[75%] -translate-x-1/2 -translate-y-1/2 rounded-[100%] bg-signal/15 blur-[80px]" />
          <AnimatePresence custom={dir} mode="popLayout">
            <motion.div
              key={car.id}
              initial={{ x: dir > 0 ? '55%' : '-55%', opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: dir > 0 ? '-55%' : '55%', opacity: 0 }}
              transition={{ duration: 0.85, ease: [0.83, 0, 0.17, 1] }}
              className="absolute inset-0 flex flex-col items-center justify-center px-8 pt-10"
            >
              <img
                src={car.cut}
                alt={`${car.brand} ${car.model} — من غير خلفية`}
                className="max-h-[74%] w-auto max-w-full object-contain drop-shadow-[0_25px_30px_rgba(0,0,0,0.4)]"
                dir="ltr"
              />
              <div className="car-shadow -mt-3 h-10 w-[68%] rounded-[100%]" />
            </motion.div>
          </AnimatePresence>
          {car.tag && (
            <span className="absolute right-4 top-4 z-10 bg-signal px-3 py-1.5 text-xs font-black text-white">
              {car.tag}
            </span>
          )}
          <div className="absolute bottom-4 left-5 font-display text-xl tracking-widest text-bone/90" dir="ltr">
            0{idx + 1} <span className="text-dim">/ 0{heroCars.length}</span>
          </div>
          <div className="absolute bottom-4 right-4 flex gap-2" dir="ltr">
            <button onClick={() => go(-1)} className="flex h-11 w-11 items-center justify-center border border-bone/30 bg-void/50 text-bone backdrop-blur transition-colors hover:bg-signal hover:border-signal" aria-label="السابق" data-cursor="قبل">
              <ArrowLeft size={18} />
            </button>
            <button onClick={() => go(1)} className="flex h-11 w-11 items-center justify-center border border-bone/30 bg-void/50 text-bone backdrop-blur transition-colors hover:bg-signal hover:border-signal" aria-label="التالي" data-cursor="بعد">
              <ArrowRight size={18} />
            </button>
          </div>
        </div>

        {/* details */}
        <div>
          <AnimatePresence mode="wait">
            <motion.div
              key={car.id}
              initial={{ opacity: 0, y: 26 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -18 }}
              transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            >
              <p className="font-grotesk text-xs uppercase tracking-[0.35em] text-signal" dir="ltr">{car.brand} — {car.year}</p>
              <h3 className="mt-3 text-4xl font-black leading-tight text-bone md:text-5xl">{car.modelAr}</h3>
              <p className="font-display mt-1 text-xl tracking-wide text-dim" dir="ltr">{car.model}</p>
              <p className="mt-5 leading-relaxed text-dim">{car.desc}</p>

              <div className="mt-8 grid grid-cols-3 gap-px border border-line bg-line" dir="ltr">
                {[
                  { icon: Gauge, v: car.hp, u: 'HP', l: 'POWER' },
                  { icon: Timer, v: car.accel, u: 'S', l: '0—100' },
                  { icon: Wind, v: car.topSpeed, u: 'KM/H', l: 'TOP SPEED' },
                ].map(({ icon: Icon, v, u, l }) => (
                  <div key={l} className="bg-carbon px-4 py-4 text-center">
                    <Icon size={16} className="mx-auto text-signal" />
                    <div className="mt-2 font-display text-2xl text-bone md:text-3xl">
                      {typeof v === 'number' && !Number.isInteger(v) ? v.toFixed(1) : <Counter value={v} active />}
                      <span className="ml-1 text-xs text-signal">{u}</span>
                    </div>
                    <div className="mt-1 font-grotesk text-[9px] uppercase tracking-[0.25em] text-dim">{l}</div>
                  </div>
                ))}
              </div>

              <div className="mt-8 flex flex-wrap items-center justify-between gap-4">
                <div>
                  <div className="text-xs text-dim">السعر يبدأ من</div>
                  <div className="font-display text-3xl text-bone" dir="ltr">
                    {car.price} <span className="text-base text-signal">EGP</span>
                  </div>
                </div>
                <a href="#testdrive" className="rounded-full bg-signal px-7 py-3.5 font-black text-white transition-transform hover:scale-105" data-cursor="احجز">
                  احجز تجربة قيادة
                </a>
              </div>

              <div className="mt-6">
                <EngineStarter car={car} onStateChange={setEngineOn} />
              </div>
            </motion.div>
          </AnimatePresence>

          {/* progress dots */}
          <div className="mt-10 flex gap-2" dir="ltr">
            {heroCars.map((c, i) => (
              <button
                key={c.id}
                onClick={() => setIdx([i, i > idx ? 1 : -1])}
                className={`h-1 transition-all duration-500 ${i === idx ? 'w-14 bg-signal' : 'w-6 bg-smoke hover:bg-dim'}`}
                aria-label={c.model}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
