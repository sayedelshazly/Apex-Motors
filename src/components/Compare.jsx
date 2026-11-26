import { useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowLeftRight, ChevronDown, Crown, Swords } from 'lucide-react';
import { Reveal, SectionHeading } from './Reveal';
import { cars } from '../data/cars';
import { useLang, carName } from '../i18n.jsx';

const priceNum = (car) => parseInt(car.price.replace(/,/g, ''), 10);

const STATS = [
  { key: 'hp', labelKey: 'cmp.hp', unit: 'HP', better: 'high', get: (c) => c.hp, fmt: (v) => v.toLocaleString('en-US') },
  { key: 'accel', labelKey: 'cmp.accel', unit: 'SEC', better: 'low', get: (c) => c.accel, fmt: (v) => v.toFixed(1) },
  { key: 'topSpeed', labelKey: 'cmp.top', unit: 'KM/H', better: 'high', get: (c) => c.topSpeed, fmt: (v) => v },
  { key: 'year', labelKey: 'cmp.year', unit: '', better: 'high', get: (c) => c.year, fmt: (v) => v },
  { key: 'price', labelKey: 'cmp.price', unit: 'EGP', better: 'low', get: priceNum, fmt: (v) => (v >= 1e6 ? `${parseFloat((v / 1e6).toFixed(1))}M` : v.toLocaleString('en-US')) },
];

function CarPicker({ car, other, onPick, align = 'start' }) {
  const { lang, t } = useLang();
  const [open, setOpen] = useState(false);
  return (
    <div className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-center gap-3 border border-white/15 bg-white/[0.03] px-3 py-2.5 text-start transition-colors hover:border-signal/60"
        data-cursor={t('cmp.change')}
      >
        <img src={car.img} alt={car.model} className="h-11 w-16 shrink-0 object-cover" />
        <span className="min-w-0 flex-1">
          <span className="block truncate text-sm font-bold text-bone">{carName(car, lang)}</span>
          <span className="block font-grotesk text-[10px] uppercase tracking-[0.18em] text-bone/45" dir="ltr">{car.brand} · {car.year}</span>
        </span>
        <ChevronDown size={16} className={`shrink-0 text-signal transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.18 }}
            className={`absolute top-full z-40 mt-2 max-h-72 w-[19rem] max-w-[86vw] overflow-y-auto border border-white/15 bg-void/95 shadow-[0_24px_60px_rgba(0,0,0,0.7)] backdrop-blur-xl ${align === 'end' ? 'end-0' : 'start-0'}`}
          >
            {cars.map((c) => (
              <button
                key={c.id}
                onClick={() => { onPick(c.id); setOpen(false); }}
                className={`flex w-full items-center gap-3 px-3 py-2 text-start transition-colors hover:bg-signal/15 ${c.id === car.id ? 'bg-signal/10' : ''}`}
              >
                <img src={c.img} alt={c.model} className="h-9 w-14 shrink-0 object-cover" loading="lazy" />
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-[13px] font-bold text-bone">
                    {carName(c, lang)}
                    {c.id === other.id && <span className="ms-2 text-[10px] font-semibold text-signal">{t('cmp.inDuel')}</span>}
                  </span>
                  <span className="block font-grotesk text-[10px] text-bone/45" dir="ltr">{c.hp} HP · {c.price} EGP</span>
                </span>
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function FighterPhoto({ car, flip = false }) {
  const { lang } = useLang();
  return (
    <div className="relative aspect-[16/9] overflow-hidden bg-carbon">
      <AnimatePresence mode="popLayout">
        <motion.img
          key={car.id}
          src={car.img}
          alt={`${car.brand} ${car.model}`}
          initial={{ opacity: 0, scale: 1.07 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
          className="car-idle absolute inset-0 h-full w-full object-contain lg:object-cover"
          style={flip ? { scaleX: -1 } : undefined}
        />
      </AnimatePresence>
      <div className="absolute inset-0 bg-gradient-to-t from-void/85 via-transparent to-transparent" />
      <div className="absolute bottom-3 right-4 left-4">
        <p className="font-grotesk text-[10px] uppercase tracking-[0.3em] text-signal" dir="ltr">{car.brand}</p>
        <p className="text-lg font-black leading-tight text-bone">{carName(car, lang)}</p>
        <p className="font-grotesk text-[10px] tracking-[0.14em] text-bone/55" dir="ltr">{car.engine}</p>
      </div>
    </div>
  );
}

export default function Compare() {
  const { lang, t } = useLang();
  const [leftId, setLeftId] = useState('chiron');
  const [rightId, setRightId] = useState(() => (cars.find((c) => c.id === 'laferrari') || cars[1]).id);
  const left = cars.find((c) => c.id === leftId) || cars[0];
  const right = cars.find((c) => c.id === rightId) || cars[1];

  const pick = (side) => (id) => {
    if (side === 'left') {
      if (id === rightId) { setRightId(leftId); }
      setLeftId(id);
    } else {
      if (id === leftId) { setLeftId(rightId); }
      setRightId(id);
    }
  };
  const swap = () => { setLeftId(rightId); setRightId(leftId); };

  const { rows, leftWins, rightWins } = useMemo(() => {
    let lw = 0;
    let rw = 0;
    const rows = STATS.map((s) => {
      const lv = s.get(left);
      const rv = s.get(right);
      const winner = lv === rv ? null : (s.better === 'high' ? (lv > rv ? 'L' : 'R') : (lv < rv ? 'L' : 'R'));
      if (winner === 'L') lw++;
      if (winner === 'R') rw++;
      const lpct = s.better === 'high' ? (lv / Math.max(lv, rv)) * 100 : (Math.min(lv, rv) / lv) * 100;
      const rpct = s.better === 'high' ? (rv / Math.max(lv, rv)) * 100 : (Math.min(lv, rv) / rv) * 100;
      return { ...s, lv, rv, winner, lpct, rpct };
    });
    return { rows, leftWins: lw, rightWins: rw };
  }, [left, right]);

  const champion = leftWins === rightWins ? null : leftWins > rightWins ? left : right;
  const waText = champion
    ? encodeURIComponent(t('cmp.waText', { name: carName(champion, lang), price: champion.price }))
    : '';

  return (
    <section id="compare" className="relative mx-auto max-w-7xl px-5 py-24 sm:px-8">
      <SectionHeading tag="Head to Head — Pick your fighters" ar="قارن وحشين" en="THE DUEL" />

      <Reveal>
        <div className="grid items-start gap-4 lg:grid-cols-[1fr_auto_1fr]" dir="ltr">
          <div className="space-y-3" dir={lang === 'ar' ? 'rtl' : 'ltr'}>
            <CarPicker car={left} other={right} onPick={pick('left')} />
            <FighterPhoto car={left} />
          </div>

          <div className="flex items-center justify-center lg:pt-24">
            <button
              onClick={swap}
              data-cursor={t('cmp.swap')}
              className="group relative flex h-16 w-16 items-center justify-center rounded-full border border-signal/50 bg-void/80 backdrop-blur transition-transform hover:scale-110"
              aria-label={t('cmp.swap')}
            >
              <span className="font-display text-xl text-signal" dir="ltr">VS</span>
              <ArrowLeftRight size={13} className="absolute -bottom-1 -right-1 rounded-full bg-signal p-0.5 text-void" />
            </button>
          </div>

          <div className="space-y-3" dir={lang === 'ar' ? 'rtl' : 'ltr'}>
            <CarPicker car={right} other={left} onPick={pick('right')} align="end" />
            <FighterPhoto car={right} flip />
          </div>
        </div>
      </Reveal>

      {/* stat battles */}
      <Reveal className="mx-auto mt-10 max-w-4xl">
        <div className="space-y-5" dir="ltr">
          {rows.map((r) => (
            <div key={r.key} className="grid grid-cols-[86px_1fr_auto_1fr_86px] items-center gap-3 max-sm:grid-cols-[64px_1fr_auto_1fr_64px]">
              <span className={`flex items-center gap-1 font-grotesk text-sm font-bold tabular-nums max-sm:text-xs ${r.winner === 'L' ? 'text-signal' : 'text-bone/60'}`}>
                {r.winner === 'L' && <Crown size={13} className="shrink-0" />}
                {r.fmt(r.lv)}
                {r.unit && <span className="text-[8px] font-semibold tracking-widest text-bone/40">{r.unit}</span>}
              </span>
              <div className="flex h-2.5 justify-end overflow-hidden rounded-full bg-white/8">
                <motion.div
                  className={`h-full rounded-full ${r.winner === 'L' ? 'bg-signal shadow-[0_0_12px_rgba(255,75,31,0.6)]' : 'bg-bone/35'}`}
                  animate={{ width: `${r.lpct}%` }}
                  transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                />
              </div>
              <span className="min-w-20 text-center text-xs font-bold text-bone/75 max-sm:min-w-14 max-sm:text-[10px]">{t(r.labelKey)}</span>
              <div className="flex h-2.5 overflow-hidden rounded-full bg-white/8">
                <motion.div
                  className={`h-full rounded-full ${r.winner === 'R' ? 'bg-signal shadow-[0_0_12px_rgba(255,75,31,0.6)]' : 'bg-bone/35'}`}
                  animate={{ width: `${r.rpct}%` }}
                  transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                />
              </div>
              <span className={`flex items-center justify-end gap-1 font-grotesk text-sm font-bold tabular-nums max-sm:text-xs ${r.winner === 'R' ? 'text-signal' : 'text-bone/60'}`}>
                {r.fmt(r.rv)}
                {r.unit && <span className="text-[8px] font-semibold tracking-widest text-bone/40">{r.unit}</span>}
                {r.winner === 'R' && <Crown size={13} className="shrink-0" />}
              </span>
            </div>
          ))}
        </div>

        {/* verdict */}
        <div className="mt-10 border border-signal/30 bg-signal/[0.06] px-5 py-5 text-center">
          <AnimatePresence mode="wait">
            <motion.div
              key={champion ? champion.id : `tie-${leftWins}`}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.3 }}
            >
              {champion ? (
                <>
                  <p className="flex items-center justify-center gap-2 text-lg font-black text-bone sm:text-xl">
                    <Crown className="text-signal" size={22} />
                    {t('cmp.winner')}: {carName(champion, lang)}
                    <span className="font-grotesk text-sm text-bone/50" dir="ltr">{leftWins} — {rightWins}</span>
                  </p>
                  <a
                    href={`https://wa.me/201099687091?text=${waText}`}
                    target="_blank"
                    rel="noreferrer"
                    className="btn-primary mt-4 inline-flex items-center gap-2 px-6 py-3 text-sm font-bold"
                    data-cursor={lang === 'ar' ? 'كلّمنا' : 'Ask us'}
                  >
                    <Swords size={15} />
                    {t('cmp.waBtn')}
                  </a>
                </>
              ) : (
                <p className="text-lg font-black text-bone">{t('cmp.tie')}</p>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </Reveal>
    </section>
  );
}
