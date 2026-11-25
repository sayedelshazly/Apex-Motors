import { useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { CarFront, Cog, Dices, Flame, Gauge, Timer, Wallet, Wind } from 'lucide-react';
import { cars } from '../data/cars';
import { carName, useLang } from '../i18n';
import { Reveal, SectionHeading } from './Reveal';
import EngineStarter from './EngineStarter';

const WA = '201099687092';
const parsePrice = (c) => Number(String(c.price).replace(/[^0-9]/g, '')) || 0;
const fmt = (n) => Math.round(n).toLocaleString('en-US');

/* spirit of a category bends the sprint a little */
const SPIRIT_FACTOR = { hyper: 0.95, electric: 0.93, super: 0.98, sport: 1.0, muscle: 1.04 };
const ENGINE_HUE = { hyper: -10, super: 0, sport: 14, muscle: -22, electric: 28 };

function blendName(body, engine) {
  const A = (body.model.split(' ')[0] || 'X').replace(/[^A-Za-z0-9]/g, '');
  const B = (engine.model.split(' ')[0] || 'Z').replace(/[^A-Za-z0-9]/g, '');
  const cutA = Math.max(2, Math.ceil(A.length / 2));
  const cutB = Math.floor(B.length / 2);
  return A.slice(0, cutA) + B.slice(cutB).toLowerCase();
}

function DonorPicker({ label, icon: Icon, car, onPick, lang, t }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="relative">
      <div className="mb-2 flex items-center gap-2 text-signal">
        <Icon size={16} />
        <span className="text-xs font-black uppercase tracking-wider text-bone">{label}</span>
      </div>
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-center gap-3 border border-line bg-carbon px-3 py-2.5 text-start transition-colors hover:border-signal"
        data-cursor={t('cmp.change')}
      >
        <img src={car.img} alt="" className="h-10 w-16 shrink-0 object-cover" />
        <span className="min-w-0 flex-1 truncate text-sm font-black text-bone">{carName(car, lang)}</span>
        <span className="font-grotesk text-signal">{open ? '—' : '+'}</span>
      </button>
      <AnimatePresence>
        {open && (
          <motion.ul
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.18 }}
            className="absolute inset-x-0 top-full z-30 mt-1 max-h-64 overflow-auto border border-line bg-[#0c0c0e] shadow-2xl"
          >
            {cars.map((c) => (
              <li key={c.id}>
                <button
                  onClick={() => { onPick(c); setOpen(false); }}
                  className={`flex w-full items-center gap-3 px-3 py-2 text-start transition-colors hover:bg-white/5 ${c.id === car.id ? 'bg-signal/15' : ''}`}
                >
                  <img src={c.img} alt="" className="h-8 w-12 shrink-0 object-cover" />
                  <span className="min-w-0 flex-1 truncate text-[13px] font-bold text-bone">{carName(c, lang)}</span>
                  <span className="font-grotesk text-[10px] uppercase tracking-wider text-dim">{c.hp} HP</span>
                </button>
              </li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function Hybrid() {
  const { lang, t } = useLang();
  const [body, setBody] = useState(() => cars.find((c) => c.id === 'chiron'));
  const [engine, setEngine] = useState(() => cars.find((c) => c.id === 'laferrari'));
  const [spirit, setSpirit] = useState(() => cars.find((c) => c.id === 'mustang'));

  const beast = useMemo(() => {
    const hp = engine.hp;
    const accel = Math.max(1.9, (engine.accel * 0.6 + body.accel * 0.4) * (SPIRIT_FACTOR[spirit.category] ?? 1));
    const top = Math.round(body.topSpeed * 0.55 + engine.topSpeed * 0.45);
    const price = parsePrice(body) * 0.65 + parsePrice(engine) * 0.45 + parsePrice(spirit) * 0.1;
    const score = Math.max(1, Math.min(99, Math.round((hp / 1600) * 50 + ((4.6 - accel) / 4.6) * 30 + (top / 460) * 20)));
    const suffix = { hyper: 'ULTRA', super: 'VELOCE', sport: 'RS', muscle: 'BRUTE', electric: 'VOLT' }[spirit.category] || 'X';
    return { hp, accel, top, price, score, name: `${blendName(body, engine)} ${suffix}` };
  }, [body, engine, spirit]);

  const shuffle = () => {
    const pick = () => cars[Math.floor(Math.random() * cars.length)];
    setBody(pick()); setEngine(pick()); setSpirit(pick());
  };

  const waText = encodeURIComponent(
    lang === 'ar'
      ? `أهلًا الشاذلي موتورز، بنيت وحش مهجّن: جسم ${carName(body, 'ar')} + موتور ${carName(engine, 'ar')} + روح ${carName(spirit, 'ar')} وطلع «${beast.name}» — ${beast.hp} حصان، تسارع ${beast.accel.toFixed(1)} ث، سرعة ${beast.top} كم/س، تقديره ${fmt(beast.price)} ج.م. عايز أعرف أكتر.`
      : `Hi ELSHAZLY MOTORS, I built a hybrid beast: ${carName(body, 'en')} body + ${carName(engine, 'en')} engine + ${carName(spirit, 'en')} spirit = "${beast.name}" — ${beast.hp} HP, 0-100 in ${beast.accel.toFixed(1)}s, ${beast.top} km/h, estimated ${fmt(beast.price)} EGP. Tell me more.`
  );

  const stats = [
    { icon: Gauge, label: t('cmp.hp'), value: `${beast.hp}`, unit: lang === 'ar' ? 'حصان' : 'HP' },
    { icon: Timer, label: t('cmp.accel'), value: beast.accel.toFixed(1), unit: lang === 'ar' ? 'ثانية' : 'sec' },
    { icon: Wind, label: t('cmp.top'), value: `${beast.top}`, unit: lang === 'ar' ? 'كم/س' : 'km/h' },
    { icon: Wallet, label: t('hyb.price'), value: fmt(beast.price), unit: lang === 'ar' ? 'ج.م' : 'EGP' },
  ];

  return (
    <section id="hybrid" className="relative px-6 py-28 md:px-12 md:py-36">
      <SectionHeading sub={t('hyb.sub')} h={t('hyb.h')} watermark={t('hyb.wm')} />

      <div className="grid gap-5 lg:grid-cols-3">
        <Reveal delay={0.05}><DonorPicker label={t('hyb.body')} icon={CarFront} car={body} onPick={setBody} lang={lang} t={t} /></Reveal>
        <Reveal delay={0.12}><DonorPicker label={t('hyb.engine')} icon={Cog} car={engine} onPick={setEngine} lang={lang} t={t} /></Reveal>
        <Reveal delay={0.19}><DonorPicker label={t('hyb.spirit')} icon={Flame} car={spirit} onPick={setSpirit} lang={lang} t={t} /></Reveal>
      </div>

      <Reveal delay={0.1}>
        <div className="mt-8 grid overflow-hidden border border-line bg-carbon lg:grid-cols-5">
          {/* the beast */}
          <div className="relative lg:col-span-3" dir="ltr">
            <AnimatePresence mode="wait">
              <motion.img
                key={body.id + engine.id}
                src={body.img}
                alt={beast.name}
                initial={{ opacity: 0.3, scale: 1.04 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0.3 }}
                transition={{ duration: 0.5 }}
                className="car-idle h-72 w-full object-cover md:h-[430px]"
                style={{ filter: `saturate(1.2) hue-rotate(${ENGINE_HUE[engine.category] ?? 0}deg)` }}
              />
            </AnimatePresence>
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-transparent to-black/25" />
            <div className="absolute start-5 top-5 border border-signal/60 bg-black/55 px-3 py-1.5 backdrop-blur-sm" dir="ltr">
              <span className="font-grotesk text-[10px] uppercase tracking-[0.3em] text-bone/70">{t('hyb.score')}</span>
              <span className="ms-2 font-display text-2xl text-signal">{beast.score}</span>
              <span className="font-grotesk text-xs text-bone/60">/99</span>
            </div>
            <div className="absolute inset-x-5 bottom-5">
              <div className="font-grotesk text-[10px] uppercase tracking-[0.35em] text-signal" dir="ltr">HYBRID BEAST</div>
              <AnimatePresence mode="wait">
                <motion.h3
                  key={beast.name}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.3 }}
                  className="font-display text-4xl uppercase leading-[0.95] text-white sm:text-5xl md:text-6xl"
                  dir="ltr"
                >
                  {beast.name}
                </motion.h3>
              </AnimatePresence>
              <p className="mt-2 max-w-md text-sm font-bold text-white/75">
                {t('hyb.mix', { body: carName(body, lang), engine: carName(engine, lang), spirit: carName(spirit, lang) })}
              </p>
            </div>
          </div>

          {/* stats + starter + actions */}
          <div className="flex flex-col gap-5 p-6 lg:col-span-2">
            <div className="grid grid-cols-2 gap-3">
              {stats.map((s) => (
                <div key={s.label} className="border border-line bg-black/30 px-4 py-3">
                  <div className="flex items-center gap-1.5 text-[11px] font-bold text-dim">
                    <s.icon size={13} className="text-signal" /> {s.label}
                  </div>
                  <div className="mt-1 font-display text-[26px] leading-none text-bone" dir="ltr">
                    {s.value} <span className="font-grotesk text-[11px] normal-case text-dim">{s.unit}</span>
                  </div>
                </div>
              ))}
            </div>
            <p className="text-[13px] leading-relaxed text-dim">{t('hyb.spiritLine', { spirit: carName(spirit, lang) })}</p>

            <EngineStarter key={engine.id} car={engine} />

            <div className="mt-auto flex flex-wrap gap-3">
              <button
                onClick={shuffle}
                className="flex items-center gap-2 border border-line px-5 py-3 text-sm font-black text-bone transition-colors hover:border-signal hover:text-signal"
                data-cursor={t('hyb.shuffle')}
              >
                <Dices size={16} /> {t('hyb.shuffle')}
              </button>
              <a
                href={`https://wa.me/${WA}?text=${waText}`}
                target="_blank"
                rel="noreferrer"
                className="flex-1 bg-signal px-5 py-3 text-center text-sm font-black text-white transition-transform hover:scale-[1.02]"
                data-cursor="WhatsApp"
              >
                {t('hyb.wa')}
              </a>
            </div>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
