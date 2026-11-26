import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowUpLeft, Gauge, Timer, X } from 'lucide-react';
import { cars, categories } from '../data/cars';
import { Reveal, SectionHeading } from './Reveal';
import EngineStarter from './EngineStarter';
import { useLang, carDesc, carTag } from '../i18n.jsx';

function CarModal({ car, onClose }) {
  const { lang, t } = useLang();
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
        transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
        className="relative max-h-[92svh] w-full max-w-4xl overflow-y-auto bg-carbon"
        onClick={(e) => e.stopPropagation()}
      >
        <button onClick={onClose} className="absolute left-4 top-4 z-10 flex h-10 w-10 items-center justify-center bg-void/70 text-bone backdrop-blur hover:bg-signal" aria-label={t('coll.close')}>
          <X size={18} />
        </button>
        <div className="relative aspect-[16/9] overflow-hidden">
          <img src={car.img} alt={car.model} className="car-idle h-full w-full bg-void object-contain md:object-cover" />
          <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-carbon to-transparent" />
          {carTag(car, lang) && <span className="absolute right-4 top-4 bg-signal px-3 py-1.5 text-xs font-black text-white">{carTag(car, lang)}</span>}
          {car.id === 'supra' && <span className="absolute bottom-4 right-4 bg-amber-400 px-3 py-1.5 text-xs font-black text-black shadow-[0_0_18px_rgba(251,191,36,0.55)]">{t('coll.legend')}</span>}
        </div>
        <div className="px-6 pb-8 pt-2 md:px-10">
          <p className="font-grotesk text-xs uppercase tracking-[0.35em] text-signal" dir="ltr">{car.brand} — {car.year}</p>
          <h3 className="mt-2 text-4xl font-black text-bone">{lang === 'ar' ? car.modelAr : car.model}</h3>
          <p className="mt-4 leading-relaxed text-dim">{carDesc(car, lang)}</p>
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
          <div className="mt-5">
            <EngineStarter car={car} compact />
          </div>
          <div className="mt-6 flex flex-wrap items-center justify-between gap-4">
            <div className="font-display text-3xl text-bone" dir="ltr">{car.price} <span className="text-base text-signal">EGP</span></div>
            <a href="#testdrive" onClick={onClose} className="rounded-full bg-signal px-7 py-3.5 font-black text-white transition-transform hover:scale-105">
              {t('coll.try')}
            </a>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default function Collection() {
  const { lang, t } = useLang();
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
            data-cursor={lang === 'ar' ? c.ar : c.en}
          >
            {cat === c.id && (
              <motion.span layoutId="cat-pill" className="absolute inset-0 rounded-full bg-signal" transition={{ type: 'spring', stiffness: 400, damping: 32 }} />
            )}
            <span className="relative z-10">{lang === 'ar' ? c.ar : c.en}</span>
            <span className="relative z-10 mr-2 font-grotesk text-xs opacity-70" dir="ltr">
              {c.id === 'all' ? cars.length : cars.filter((x) => x.category === c.id).length}
            </span>
          </button>
        ))}
      </Reveal>

      {/* grid */}
      <motion.div layout className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-4 lg:grid-cols-3 lg:gap-5">
        <AnimatePresence mode="popLayout">
          {list.map((car) => (
            <motion.article
              layout
              key={car.id}
              initial={{ opacity: 0, scale: 0.92, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.92, y: 30 }}
              transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
              className={`group relative overflow-hidden border border-line bg-carbon lg:border-transparent ${car.id === 'supra' ? 'ring-2 ring-amber-400/80' : ''}`}
              data-cursor={t('coll.view')}
              onClick={() => setSelected(car)}
            >
              <div className="relative aspect-[16/10] overflow-hidden">
                <img
                  src={car.img}
                  alt={`${car.brand} ${car.model}`}
                  loading="lazy"
                  className="h-full w-full bg-black object-contain transition-transform duration-[1200ms] ease-out group-hover:scale-110 lg:object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-carbon via-transparent to-transparent" />
                {carTag(car, lang) && <span className="absolute right-3 top-3 bg-signal px-2.5 py-1 text-[10px] font-black text-white lg:text-[11px]">{carTag(car, lang)}</span>}
                {car.id === 'supra' && <span className="absolute bottom-3 right-3 bg-amber-400 px-2.5 py-1 text-[10px] font-black text-black shadow-[0_0_18px_rgba(251,191,36,0.55)] lg:text-[11px]">{t('coll.legend')}</span>}
                <span className="absolute left-3 top-3 font-grotesk text-xs tracking-[0.2em] text-bone/60 lg:hidden" dir="ltr">{String(cars.indexOf(car) + 1).padStart(2, '0')} / {cars.length}</span>
                <span className="absolute bottom-3 left-3 flex h-8 w-8 items-center justify-center rounded-full border border-bone/25 text-bone backdrop-blur-sm lg:hidden">
                  <ArrowUpLeft size={15} />
                </span>
                <span className="absolute left-3 top-3 hidden h-9 w-9 translate-y-2 items-center justify-center rounded-full bg-bone text-void opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100 lg:flex">
                  <ArrowUpLeft size={17} />
                </span>
              </div>
              <div className="p-4 sm:p-5">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-grotesk text-[10px] uppercase tracking-[0.3em] text-signal" dir="ltr">{car.brand}</p>
                    <h3 className="mt-1.5 text-lg font-black leading-snug text-bone lg:text-xl">{lang === 'ar' ? car.modelAr : car.model}</h3>
                  </div>
                  <span className="border border-line px-2 py-1 font-grotesk text-[11px] text-dim lg:text-xs" dir="ltr">{car.year}</span>
                </div>
                <div className="mt-3 flex flex-wrap items-center gap-4 border-t border-line pt-3 text-xs text-dim lg:mt-4 lg:pt-4 lg:text-sm" dir="ltr">
                  <span className="flex items-center gap-1 md:gap-1.5"><Gauge size={15} className="h-3.5 w-3.5 text-signal lg:h-[15px] lg:w-[15px]" />{car.hp} HP</span>
                  <span className="flex items-center gap-1 md:gap-1.5"><Timer size={15} className="h-3.5 w-3.5 text-signal lg:h-[15px] lg:w-[15px]" />{car.accel.toFixed(1)}s</span>
                  <span className="ml-auto font-display text-base text-bone lg:text-lg">{car.price} <span className="text-[10px] text-signal lg:text-[11px]">EGP</span></span>
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
