import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowUpLeft, Gauge, Timer, X } from 'lucide-react';
import { cars, categories } from '../data/cars';
import { Reveal, SectionHeading } from './Reveal';

function CarModal({ car, onClose }) {
  if (!car) return null;
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[160] flex items-end justify-center bg-void/80 backdrop-blur-sm md:items-center md:p-8"
      onClick={onClose}
    >
      <motion.div
        initial={{ y: 80, opacity: 0, scale: 0.98 }}
        animate={{ y: 0, opacity: 1, scale: 1 }}
        exit={{ y: 60, opacity: 0, scale: 0.98 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="relative max-h-[92svh] w-full max-w-4xl overflow-y-auto bg-carbon"
        onClick={(e) => e.stopPropagation()}
      >
        <button onClick={onClose} className="absolute left-4 top-4 z-10 flex h-10 w-10 items-center justify-center bg-void/70 text-bone backdrop-blur hover:bg-signal" aria-label="إغلاق">
          <X size={18} />
        </button>
        <div className="relative aspect-[16/9] overflow-hidden">
          <img src={car.img} alt={car.model} className="h-full w-full object-cover" />
          <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-carbon to-transparent" />
          {car.tag && <span className="absolute right-4 top-4 bg-signal px-3 py-1.5 text-xs font-black text-white">{car.tag}</span>}
        </div>
        <div className="px-6 pb-8 pt-2 md:px-10">
          <p className="font-grotesk text-xs uppercase tracking-[0.35em] text-signal" dir="ltr">{car.brand} — {car.year}</p>
          <h3 className="mt-2 text-4xl font-black text-bone">{car.modelAr}</h3>
          <p className="mt-4 leading-relaxed text-dim">{car.desc}</p>
          <div className="mt-6 grid grid-cols-2 gap-px border border-line bg-line md:grid-cols-4" dir="ltr">
            {[
              [car.hp.toLocaleString('en-US'), 'HORSEPOWER'],
              [car.accel.toFixed(1) + 's', '0—100 KM/H'],
              [car.topSpeed, 'TOP SPEED KM/H'],
              [car.year, 'MODEL YEAR'],
            ].map(([v, l]) => (
              <div key={l} className="bg-void px-4 py-4 text-center">
                <div className="font-display text-xl text-bone md:text-2xl">{v}</div>
                <div className="mt-1 font-grotesk text-[9px] uppercase tracking-[0.22em] text-dim">{l}</div>
              </div>
            ))}
          </div>
          <p className="mt-4 font-grotesk text-sm text-dim" dir="ltr">{car.engine}</p>
          <div className="mt-6 flex flex-wrap items-center justify-between gap-4">
            <div className="font-display text-3xl text-bone" dir="ltr">{car.price} <span className="text-base text-signal">EGP</span></div>
            <a href="#testdrive" onClick={onClose} className="rounded-full bg-signal px-7 py-3.5 font-black text-white transition-transform hover:scale-105">
              جرّبها بنفسك
            </a>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default function Collection() {
  const [cat, setCat] = useState('all');
  const [selected, setSelected] = useState(null);
  const list = cat === 'all' ? cars : cars.filter((c) => c.category === cat);

  return (
    <section id="collection" className="relative px-6 py-24 md:px-12 md:py-32">
      <SectionHeading tag="The Collection — 2026" ar="التشكيلة" en="COLLECTION" stroke />

      {/* filters */}
      <Reveal className="mb-10 flex flex-wrap gap-2">
        {categories.map((c) => (
          <button
            key={c.id}
            onClick={() => setCat(c.id)}
            className={`relative rounded-full px-5 py-2.5 text-sm font-bold transition-colors ${
              cat === c.id ? 'text-white' : 'border border-line text-dim hover:border-bone/40 hover:text-bone'
            }`}
            data-cursor={c.ar}
          >
            {cat === c.id && (
              <motion.span layoutId="cat-pill" className="absolute inset-0 rounded-full bg-signal" transition={{ type: 'spring', stiffness: 400, damping: 32 }} />
            )}
            <span className="relative z-10">{c.ar}</span>
            <span className="relative z-10 mr-2 font-grotesk text-xs opacity-70" dir="ltr">
              {c.id === 'all' ? cars.length : cars.filter((x) => x.category === c.id).length}
            </span>
          </button>
        ))}
      </Reveal>

      {/* grid */}
      <motion.div layout className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
        <AnimatePresence mode="popLayout">
          {list.map((car) => (
            <motion.article
              layout
              key={car.id}
              initial={{ opacity: 0, scale: 0.92, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.92, y: 30 }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              className="group relative overflow-hidden bg-carbon"
              data-cursor="شوفها"
              onClick={() => setSelected(car)}
            >
              <div className="relative aspect-[16/10] overflow-hidden">
                <img
                  src={car.img}
                  alt={`${car.brand} ${car.model}`}
                  loading="lazy"
                  className="h-full w-full object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-carbon via-transparent to-transparent" />
                {car.tag && <span className="absolute right-3 top-3 bg-signal px-2.5 py-1 text-[11px] font-black text-white">{car.tag}</span>}
                <span className="absolute left-3 top-3 flex h-9 w-9 translate-y-2 items-center justify-center rounded-full bg-bone text-void opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
                  <ArrowUpLeft size={17} />
                </span>
              </div>
              <div className="p-5">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-grotesk text-[10px] uppercase tracking-[0.3em] text-signal" dir="ltr">{car.brand}</p>
                    <h3 className="mt-1.5 text-xl font-black text-bone">{car.modelAr}</h3>
                  </div>
                  <span className="border border-line px-2 py-1 font-grotesk text-xs text-dim" dir="ltr">{car.year}</span>
                </div>
                <div className="mt-4 flex items-center gap-5 border-t border-line pt-4 text-sm text-dim" dir="ltr">
                  <span className="flex items-center gap-1.5"><Gauge size={15} className="text-signal" />{car.hp} HP</span>
                  <span className="flex items-center gap-1.5"><Timer size={15} className="text-signal" />{car.accel.toFixed(1)}s</span>
                  <span className="mr-auto font-display text-lg text-bone">{car.price} <span className="text-[11px] text-signal">EGP</span></span>
                </div>
              </div>
              <span className="absolute inset-x-0 bottom-0 h-[3px] origin-right scale-x-0 bg-signal transition-transform duration-500 group-hover:scale-x-100" />
            </motion.article>
          ))}
        </AnimatePresence>
      </motion.div>

      <AnimatePresence>
        {selected && <CarModal car={selected} onClose={() => setSelected(null)} />}
      </AnimatePresence>
    </section>
  );
}
