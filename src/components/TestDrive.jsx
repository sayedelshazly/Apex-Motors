import { useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowLeft, ArrowRight, CalendarDays, CarFront, CheckCircle2, ChevronDown, Clock, MapPin, Phone, User } from 'lucide-react';
import { cars } from '../data/cars';
import { Reveal, SectionHeading } from './Reveal';
import { useLang } from '../i18n.jsx';

const branches = [
  { id: 'newcairo', ar: 'القاهرة الجديدة', en: 'New Cairo', addr: 'التسعين الشمالي، بجوار مول ٥A', addrEn: 'North Teseen St., next to 5A Mall' },
  { id: 'zayed', ar: 'الشيخ زايد', en: 'Sheikh Zayed', addr: 'وصلة دهشور، جاليريا ٤٠', addrEn: 'Dahshur Link, Galleria 40' },
  { id: 'alex', ar: 'الإسكندرية', en: 'Alexandria', addr: 'طريق الكورنيش، سيدي جابر', addrEn: 'Corniche Rd., Sidi Gaber' },
];
const times = ['10:00', '12:30', '15:00', '17:30', '20:00'];
const driveCars = cars.slice(0, 8);

function nextDays(n = 7, lang = 'ar') {
  const out = [];
  const locale = lang === 'ar' ? 'ar-EG' : 'en-GB';
  const fmtDay = new Intl.DateTimeFormat(locale, { weekday: 'short' });
  const fmtNum = new Intl.DateTimeFormat(locale, { day: 'numeric', month: 'short' });
  for (let i = 1; i <= n; i++) {
    const d = new Date();
    d.setDate(d.getDate() + i);
    out.push({ key: d.toISOString().slice(0, 10), wd: fmtDay.format(d), label: fmtNum.format(d) });
  }
  return out;
}

const selectCls =
  'w-full appearance-none border border-line bg-void/60 py-2.5 pe-4 ps-10 font-bold text-bone [color-scheme:dark] transition-colors focus:border-signal focus:outline-none [&>option]:bg-carbon';
const labelCls = 'mb-1.5 flex items-center gap-1.5 text-xs font-black text-bone';

function Field({ label, icon: Icon, children }) {
  return (
    <div>
      <label className={labelCls}><Icon size={14} className="text-signal" /> {label}</label>
      <div className="relative">
        {children}
        <ChevronDown size={15} className="pointer-events-none absolute end-3 top-1/2 -translate-y-1/2 text-dim" />
      </div>
    </div>
  );
}

export default function TestDrive() {
  const { lang, t } = useLang();
  const days = useMemo(() => nextDays(7, lang), [lang]);
  const [branch, setBranch] = useState(branches[0]);
  const [carId, setCarId] = useState(driveCars[0].id);
  const [day, setDay] = useState(days[1]);
  const [time, setTime] = useState(times[3]);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [done, setDone] = useState(false);
  const car = driveCars.find((c) => c.id === carId);

  return (
    <section id="testdrive" className="noise relative overflow-hidden bg-carbon px-6 py-14 md:px-12 md:py-20">
      <span className="text-stroke-faint pointer-events-none absolute bottom-0 right-0 select-none font-display text-[11vw] leading-none opacity-60" dir="ltr" aria-hidden>
        DRIVE
      </span>

      <SectionHeading tag="Test Drive — Book yours" ar="احجز تجربة قيادة" en="TEST DRIVE" />

      <Reveal>
        <div className="relative mx-auto flex max-w-4xl flex-col overflow-hidden border border-line bg-void/40 md:flex-row">
          {/* small car preview */}
          <div className="relative h-44 shrink-0 overflow-hidden md:h-auto md:w-80">
            <AnimatePresence mode="wait">
              <motion.img
                key={car.id}
                src={car.img}
                alt={car.model}
                initial={{ opacity: 0, scale: 1.08 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                className="car-idle absolute inset-0 h-full w-full object-cover"
              />
            </AnimatePresence>
            <div className="absolute inset-0 bg-gradient-to-t from-void/90 via-transparent to-transparent" />
            <div className="absolute bottom-3 right-3">
              <p className="font-grotesk text-[9px] uppercase tracking-[0.3em] text-signal" dir="ltr">{car.brand}</p>
              <p className="mt-0.5 text-lg font-black leading-tight text-bone">{lang === 'ar' ? car.modelAr : car.model}</p>
              <p className="font-grotesk text-[11px] text-dim" dir="ltr">{car.hp} HP · {car.accel.toFixed(1)}s</p>
            </div>
          </div>

          {/* compact form — everything is a select */}
          <div className="min-w-0 flex-1 p-5 md:p-6">
            <AnimatePresence mode="wait">
              {done ? (
                <motion.div
                  key="done"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex h-full min-h-56 flex-col items-center justify-center text-center"
                >
                  <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 200, damping: 14, delay: 0.12 }}>
                    <CheckCircle2 size={52} className="text-signal" />
                  </motion.div>
                  <h3 className="mt-4 text-2xl font-black text-bone">{t('td.doneTitle')}</h3>
                  <p className="mt-2 max-w-md text-sm leading-relaxed text-dim">
                    {t('td.doneBody', { car: lang === 'ar' ? car.modelAr : car.model, branch: lang === 'ar' ? branch.ar : branch.en, day: `${day.wd} ${day.label}`, time, phone: phone || t('td.yourNumber') })}
                  </p>
                  <p className="mt-4 border border-line px-4 py-1.5 font-grotesk text-xs tracking-[0.25em] text-bone" dir="ltr">
                    REF: APX-{car.id.toUpperCase().slice(0, 4)}-{time.replace(':', '')}
                  </p>
                  <button onClick={() => setDone(false)} className="mt-4 text-sm font-bold text-signal underline-offset-4 hover:underline">
                    {t('td.edit')}
                  </button>
                </motion.div>
              ) : (
                <motion.form
                  key="form"
                  exit={{ opacity: 0, y: -14 }}
                  onSubmit={(e) => {
                    e.preventDefault();
                    setDone(true);
                  }}
                >
                  <div className="grid gap-3.5 sm:grid-cols-2">
                    <Field label={t('td.branch')} icon={MapPin}>
                      <select value={branch.id} onChange={(e) => setBranch(branches.find((b) => b.id === e.target.value))} className={selectCls} data-cursor={t('td.branch')}>
                        {branches.map((b) => (
                          <option key={b.id} value={b.id}>{lang === 'ar' ? b.ar : b.en}</option>
                        ))}
                      </select>
                    </Field>
                    <Field label={t('td.car')} icon={CarFront}>
                      <select value={carId} onChange={(e) => setCarId(e.target.value)} className={selectCls} data-cursor={t('td.car')}>
                        {driveCars.map((c) => (
                          <option key={c.id} value={c.id}>{lang === 'ar' ? c.modelAr : c.model}</option>
                        ))}
                      </select>
                    </Field>
                    <Field label={t('td.day')} icon={CalendarDays}>
                      <select value={day.key} onChange={(e) => setDay(days.find((d) => d.key === e.target.value))} className={selectCls} data-cursor={t('td.day')}>
                        {days.map((d) => (
                          <option key={d.key} value={d.key}>{d.wd} — {d.label}</option>
                        ))}
                      </select>
                    </Field>
                    <Field label={t('td.time')} icon={Clock}>
                      <select value={time} onChange={(e) => setTime(e.target.value)} className={`${selectCls} font-grotesk`} dir="ltr" data-cursor={t('td.time')}>
                        {times.map((x) => (
                          <option key={x} value={x}>{x}</option>
                        ))}
                      </select>
                    </Field>
                    <div>
                      <label className={labelCls}><User size={14} className="text-signal" /> {t('td.namePh')}</label>
                      <input required value={name} onChange={(e) => setName(e.target.value)} placeholder={t('td.namePh')} className="w-full border border-line bg-void/60 px-4 py-2.5 font-bold text-bone placeholder:text-dim/60 focus:border-signal focus:outline-none" />
                    </div>
                    <div>
                      <label className={labelCls}><Phone size={14} className="text-signal" /> {t('td.phonePh')}</label>
                      <input required value={phone} onChange={(e) => setPhone(e.target.value)} placeholder={t('td.phonePh')} inputMode="tel" className="w-full border border-line bg-void/60 px-4 py-2.5 font-bold text-bone placeholder:text-dim/60 focus:border-signal focus:outline-none" />
                    </div>
                  </div>

                  <p className="mt-3 text-xs text-dim">{lang === 'ar' ? branch.addr : branch.addrEn}</p>

                  <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-line pt-4">
                    <p className="text-[13px] leading-relaxed text-dim">
                      {t('td.summary')}: <span className="font-bold text-bone">{lang === 'ar' ? car.modelAr : car.model}</span> — {lang === 'ar' ? branch.ar : branch.en} — {day.wd} {day.label} — <span dir="ltr">{time}</span>
                    </p>
                    <button type="submit" className="group flex items-center gap-2 rounded-full bg-signal px-6 py-3 text-sm font-black text-white transition-transform hover:scale-105" data-cursor={t('td.send')}>
                      {t('td.confirm')}
                      {lang === 'ar'
                        ? <ArrowLeft className="transition-transform group-hover:-translate-x-1" size={16} />
                        : <ArrowRight className="transition-transform group-hover:translate-x-1" size={16} />}
                    </button>
                  </div>
                </motion.form>
              )}
            </AnimatePresence>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
