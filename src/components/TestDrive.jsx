import { useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowLeft, CheckCircle2, MapPin } from 'lucide-react';
import { cars } from '../data/cars';
import { Reveal, SectionHeading } from './Reveal';

const branches = [
  { id: 'newcairo', ar: 'القاهرة الجديدة', addr: 'التسعين الشمالي، بجوار مول ٥A' },
  { id: 'zayed', ar: 'الشيخ زايد', addr: 'وصلة دهشور، جاليريا ٤٠' },
  { id: 'alex', ar: 'الإسكندرية', addr: 'طريق الكورنيش، سيدي جابر' },
];
const times = ['10:00', '12:30', '15:00', '17:30', '20:00'];
const driveCars = cars.slice(0, 8);

function nextDays(n = 7) {
  const out = [];
  const fmtDay = new Intl.DateTimeFormat('ar-EG', { weekday: 'short' });
  const fmtNum = new Intl.DateTimeFormat('ar-EG', { day: 'numeric', month: 'short' });
  for (let i = 1; i <= n; i++) {
    const d = new Date();
    d.setDate(d.getDate() + i);
    out.push({ key: d.toISOString().slice(0, 10), wd: fmtDay.format(d), label: fmtNum.format(d) });
  }
  return out;
}

const chip = (active) =>
  `border px-4 py-2.5 text-sm font-bold transition-all duration-300 ${
    active
      ? 'border-signal bg-signal text-white scale-[1.03]'
      : 'border-line text-dim hover:border-bone/40 hover:text-bone'
  }`;

export default function TestDrive() {
  const days = useMemo(nextDays, []);
  const [branch, setBranch] = useState(branches[0]);
  const [carId, setCarId] = useState(driveCars[0].id);
  const [day, setDay] = useState(days[1]);
  const [time, setTime] = useState(times[3]);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [done, setDone] = useState(false);
  const car = driveCars.find((c) => c.id === carId);

  return (
    <section id="testdrive" className="noise relative overflow-hidden bg-carbon px-6 py-24 md:px-12 md:py-32">
      <span className="text-stroke-faint pointer-events-none absolute bottom-0 right-0 select-none font-display text-[18vw] leading-none" dir="ltr" aria-hidden>
        DRIVE
      </span>

      <SectionHeading tag="Test Drive — Book yours" ar="احجز تجربة قيادة" en="TEST DRIVE" />

      <div className="relative grid gap-10 lg:grid-cols-[1fr_1.2fr]">
        {/* car preview */}
        <Reveal className="relative min-h-72 overflow-hidden border border-line bg-gradient-to-b from-smoke/50 via-carbon to-void">
          <span className="text-stroke-faint pointer-events-none absolute inset-x-0 top-4 select-none text-center font-display text-7xl leading-none" dir="ltr" aria-hidden>{car.brand}</span>
          <div className="absolute inset-0 flex flex-col items-center justify-center px-8 pt-8">
            <AnimatePresence mode="wait">
              <motion.img
                key={car.id}
                src={car.cut}
                alt={car.model}
                initial={{ opacity: 0, x: 60, scale: 0.96 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                exit={{ opacity: 0, x: -60, scale: 0.96 }}
                transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
                className="max-h-[68%] w-auto max-w-full object-contain drop-shadow-[0_24px_28px_rgba(0,0,0,0.45)]"
                dir="ltr"
              />
            </AnimatePresence>
            <div className="car-shadow -mt-2 h-9 w-[58%] rounded-[100%]" />
          </div>
          <div className="absolute bottom-5 right-5">
            <p className="font-grotesk text-[11px] uppercase tracking-[0.3em] text-signal" dir="ltr">{car.brand}</p>
            <p className="mt-1 text-3xl font-black text-bone">{car.modelAr}</p>
            <p className="mt-1 font-grotesk text-sm text-dim" dir="ltr">{car.hp} HP · 0—100 in {car.accel.toFixed(1)}s</p>
          </div>
        </Reveal>

        {/* form */}
        <Reveal delay={0.1}>
          <AnimatePresence mode="wait">
            {done ? (
              <motion.div
                key="done"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex h-full min-h-96 flex-col items-center justify-center border border-line bg-void/60 px-8 text-center"
              >
                <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 200, damping: 14, delay: 0.15 }}>
                  <CheckCircle2 size={72} className="text-signal" />
                </motion.div>
                <h3 className="mt-6 text-3xl font-black text-bone">اتحجزت يا وحش</h3>
                <p className="mt-3 max-w-md leading-relaxed text-dim">
                  {car.modelAr} هتكون جاهزة ليك في فرع {branch.ar}، يوم {day.wd} {day.label} الساعة {time}.
                  هنكلمك على {phone || 'رقمك'} للتأكيد قبل المعاد.
                </p>
                <p className="mt-5 border border-line px-4 py-2 font-grotesk text-sm tracking-[0.25em] text-bone" dir="ltr">
                  REF: APX-{car.id.toUpperCase().slice(0, 4)}-{time.replace(':', '')}
                </p>
                <button onClick={() => setDone(false)} className="mt-6 text-sm font-bold text-signal underline-offset-4 hover:underline">
                  عدّل الحجز
                </button>
              </motion.div>
            ) : (
              <motion.form
                key="form"
                exit={{ opacity: 0, y: -20 }}
                className="space-y-7"
                onSubmit={(e) => {
                  e.preventDefault();
                  setDone(true);
                }}
              >
                <div>
                  <h3 className="mb-3 flex items-center gap-2 font-black text-bone"><MapPin size={17} className="text-signal" /> الفرع</h3>
                  <div className="flex flex-wrap gap-2">
                    {branches.map((b) => (
                      <button type="button" key={b.id} onClick={() => setBranch(b)} className={chip(branch.id === b.id)} data-cursor={b.ar}>
                        {b.ar}
                      </button>
                    ))}
                  </div>
                  <p className="mt-2 text-sm text-dim">{branch.addr}</p>
                </div>

                <div>
                  <h3 className="mb-3 font-black text-bone">العربية</h3>
                  <div className="flex flex-wrap gap-2">
                    {driveCars.map((c) => (
                      <button type="button" key={c.id} onClick={() => setCarId(c.id)} className={chip(carId === c.id)} data-cursor={c.model}>
                        {c.modelAr}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid gap-7 sm:grid-cols-2">
                  <div>
                    <h3 className="mb-3 font-black text-bone">اليوم</h3>
                    <div className="flex flex-wrap gap-2">
                      {days.map((d) => (
                        <button type="button" key={d.key} onClick={() => setDay(d)} className={`${chip(day.key === d.key)} flex flex-col items-center leading-tight`}>
                          <span>{d.wd}</span>
                          <span className="font-grotesk text-[11px] opacity-75">{d.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h3 className="mb-3 font-black text-bone">الساعة</h3>
                    <div className="flex flex-wrap gap-2" dir="ltr">
                      {times.map((t) => (
                        <button type="button" key={t} onClick={() => setTime(t)} className={`${chip(time === t)} font-grotesk`}>
                          {t}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="grid gap-3 sm:grid-cols-2">
                  <input required value={name} onChange={(e) => setName(e.target.value)} placeholder="اسمك" className="border border-line bg-void/60 px-4 py-3.5 font-bold text-bone placeholder:text-dim focus:border-signal focus:outline-none" />
                  <input required value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="رقم الموبايل" inputMode="tel" className="border border-line bg-void/60 px-4 py-3.5 font-bold text-bone placeholder:text-dim focus:border-signal focus:outline-none" />
                </div>

                <div className="flex flex-wrap items-center justify-between gap-4 border-t border-line pt-6">
                  <p className="text-sm leading-relaxed text-dim">
                    الملخص: <span className="font-bold text-bone">{car.modelAr}</span> — {branch.ar} — {day.wd} {day.label} — <span dir="ltr">{time}</span>
                  </p>
                  <button type="submit" className="group flex items-center gap-2 rounded-full bg-signal px-8 py-4 font-black text-white transition-transform hover:scale-105" data-cursor="ابعت">
                    أكّد الحجز
                    <ArrowLeft className="transition-transform group-hover:-translate-x-1" size={18} />
                  </button>
                </div>
              </motion.form>
            )}
          </AnimatePresence>
        </Reveal>
      </div>
    </section>
  );
}
