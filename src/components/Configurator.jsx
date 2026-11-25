import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { MessageCircle, Pipette, RotateCcw } from 'lucide-react';
import { cars } from '../data/cars';
import { Reveal, SectionHeading } from './Reveal';

/**
 * "لوّن وحشك" — live car colour configurator.
 * The transparent cutout is re-coloured in the browser: a greyscale base
 * keeps the car's light and shadow, a colour layer (masked by the same
 * cutout) lays the new paint over it, and an overlay pass restores depth.
 * The build is sent to the showroom on WhatsApp.
 */
const COLORS = [
  { name: 'اللون الأصلي', en: 'STOCK', hex: null },
  { name: 'أحمر روسو', en: 'ROSSO', hex: '#c1121f' },
  { name: 'برتقالي الشاذلي', en: 'SIGNAL', hex: '#ff4b1f' },
  { name: 'أزرق سباقات', en: 'RACING BLUE', hex: '#1d4ed8' },
  { name: 'سماوي جليدي', en: 'ICE', hex: '#7dd3fc' },
  { name: 'أصفر سولار', en: 'SOLAR', hex: '#facc15' },
  { name: 'برتقالي لافا', en: 'LAVA', hex: '#f97316' },
  { name: 'أخضر بريطاني', en: 'BRITISH', hex: '#166534' },
  { name: 'نعناعي', en: 'MINT', hex: '#34d399' },
  { name: 'بنفسجي ملكي', en: 'ROYAL', hex: '#7c3aed' },
  { name: 'وردي صارخ', en: 'HOT PINK', hex: '#ec4899' },
  { name: 'بني شوكولاتة', en: 'COCOA', hex: '#78350f' },
  { name: 'رمادي ناردو', en: 'NARDO', hex: '#6b7280' },
  { name: 'أسود فحمي', en: 'STEALTH', hex: '#232327' },
  { name: 'أبيض لؤلؤي', en: 'PEARL', hex: '#f2eee3' },
];

const WA_NUMBER = '201099687092';

export default function Configurator() {
  const [car, setCar] = useState(cars[2]); // Huracán — a colourful start
  const [color, setColor] = useState(COLORS[3]);
  const [custom, setCustom] = useState('#8b5cf6');
  const [finish, setFinish] = useState('gloss'); // gloss | matte

  const activeHex = color.hex === 'custom' ? custom : color.hex;
  const activeName = color.hex === 'custom' ? 'لون مخصص' : color.name;

  const maskStyle = activeHex
    ? {
        backgroundColor: activeHex,
        mixBlendMode: 'color',
        WebkitMaskImage: `url(${car.cut})`,
        maskImage: `url(${car.cut})`,
        WebkitMaskSize: '100% 100%',
        maskSize: '100% 100%',
        WebkitMaskRepeat: 'no-repeat',
        maskRepeat: 'no-repeat',
        opacity: finish === 'matte' ? 0.94 : 1,
      }
    : null;

  const waText = encodeURIComponent(
    `أهلاً الشاذلي موتورز 🎨\nعايز ألوّن ${car.modelAr} (${car.brand} ${car.model}) بلون «${activeName}»${activeHex ? ` ${activeHex}` : ''}\nالفنش: ${finish === 'matte' ? 'مطفي' : 'لامع'}\nسعر العربية المعلن: ${car.price} EGP\nممكن تفاصيل التغليف والحجز؟`
  );

  return (
    <section id="configurator" className="relative overflow-hidden px-6 py-24 md:px-12 md:py-32">
      <span className="text-stroke-faint pointer-events-none absolute -top-4 right-0 select-none font-display text-[20vw] leading-none" dir="ltr" aria-hidden>
        PAINT
      </span>

      <SectionHeading tag="Configurator — Color your beast" ar="لوّن وحشك" en="CONFIGURE" />

      <div className="relative mt-12 grid items-start gap-10 lg:grid-cols-[1.35fr_1fr]">
        {/* ---------- stage ---------- */}
        <Reveal>
          <div className="relative overflow-hidden border border-line bg-gradient-to-b from-smoke/70 via-carbon to-void px-6 pb-8 pt-10">
            <span className="pointer-events-none absolute inset-x-0 top-3 select-none text-center font-display text-[19vw] leading-none text-bone/[0.045] lg:text-[9.5rem]" dir="ltr" aria-hidden>
              {car.brand}
            </span>
            <span className="absolute right-4 top-4 z-20 border border-line bg-void/70 px-3 py-1.5 font-grotesk text-[10px] uppercase tracking-[0.25em] text-dim" dir="ltr">
              {car.brand} — {car.year}
            </span>

            <AnimatePresence mode="wait">
              <motion.div
                key={car.id + (activeHex || 'stock') + finish}
                initial={{ opacity: 0, x: 60 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -60 }}
                transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                className="relative z-10 mx-auto max-w-[560px]"
              >
                <div className="relative">
                  {/* luminance base (or the untouched stock photo-cut) */}
                  <img
                    src={car.cut}
                    alt={car.model}
                    className="block w-full"
                    style={
                      activeHex
                        ? { filter: `grayscale(1) contrast(1.12) brightness(${finish === 'matte' ? 0.96 : 0.88})` }
                        : undefined
                    }
                    draggable={false}
                  />
                  {activeHex && (
                    <>
                      {/* the new paint, clipped to the car's silhouette */}
                      <div className="absolute inset-0" style={maskStyle} aria-hidden />
                      {/* saturation pass — deepens the paint in the bright panels */}
                      <div
                        className="absolute inset-0"
                        aria-hidden
                        style={{
                          backgroundColor: activeHex,
                          mixBlendMode: 'multiply',
                          WebkitMaskImage: `url(${car.cut})`,
                          maskImage: `url(${car.cut})`,
                          WebkitMaskSize: '100% 100%',
                          maskSize: '100% 100%',
                          opacity: finish === 'matte' ? 0.22 : 0.3,
                        }}
                      />
                      {/* depth & highlights pass */}
                      <img
                        src={car.cut}
                        alt=""
                        aria-hidden
                        className="absolute inset-0 h-full w-full"
                        style={{ mixBlendMode: 'overlay', opacity: finish === 'matte' ? 0.14 : 0.3 }}
                        draggable={false}
                      />
                      {/* gloss shine */}
                      {finish === 'gloss' && (
                        <div
                          className="absolute inset-0"
                          aria-hidden
                          style={{
                            background: 'linear-gradient(115deg, transparent 30%, rgba(255,255,255,0.35) 45%, transparent 60%)',
                            mixBlendMode: 'overlay',
                            WebkitMaskImage: `url(${car.cut})`,
                            maskImage: `url(${car.cut})`,
                            WebkitMaskSize: '100% 100%',
                            maskSize: '100% 100%',
                          }}
                        />
                      )}
                    </>
                  )}
                </div>
                {/* floor shadow */}
                <div className="mx-auto mt-1 h-6 w-[78%] rounded-[100%] bg-black/60 blur-xl" aria-hidden />
              </motion.div>
            </AnimatePresence>

            <div className="relative z-10 mt-4 flex flex-wrap items-end justify-between gap-3">
              <div>
                <h3 className="text-2xl font-black text-bone">{car.modelAr}</h3>
                <p className="font-grotesk text-xs uppercase tracking-[0.25em] text-dim" dir="ltr">{car.model} · {car.hp} HP</p>
              </div>
              <div className="text-left" dir="ltr">
                <span className="font-display text-2xl text-bone">{car.price}</span>
                <span className="ml-1 font-grotesk text-[10px] uppercase tracking-[0.2em] text-signal">EGP</span>
              </div>
            </div>
          </div>

          {/* car picker */}
          <div className="mt-4 flex gap-2 overflow-x-auto pb-2 [&::-webkit-scrollbar]:hidden" style={{ scrollbarWidth: 'none' }}>
            {cars.map((c) => (
              <button
                key={c.id}
                onClick={() => setCar(c)}
                data-cursor={c.modelAr}
                className={`group w-24 shrink-0 border p-2 text-center transition-all duration-300 ${
                  car.id === c.id ? 'border-signal bg-signal/10' : 'border-line bg-carbon/60 hover:border-bone/40'
                }`}
              >
                <img src={c.cut} alt={c.model} className="h-10 w-full object-contain transition-transform duration-300 group-hover:scale-110" loading="lazy" />
                <span className={`mt-1 block truncate text-[10px] font-bold ${car.id === c.id ? 'text-signal' : 'text-dim'}`}>{c.modelAr}</span>
              </button>
            ))}
          </div>
        </Reveal>

        {/* ---------- controls ---------- */}
        <Reveal delay={0.1}>
          <div className="border border-line bg-carbon/60 p-6">
            <div className="flex items-center justify-between">
              <h4 className="font-black text-bone">اختار اللون</h4>
              <button
                onClick={() => setColor(COLORS[0])}
                className="flex items-center gap-1.5 text-xs font-bold text-dim transition-colors hover:text-signal"
              >
                <RotateCcw size={13} /> رجّع الأصلي
              </button>
            </div>

            <div className="mt-4 grid grid-cols-5 gap-2.5">
              {COLORS.map((c) => (
                <button
                  key={c.en}
                  onClick={() => setColor(c)}
                  data-cursor={c.name}
                  title={c.name}
                  className={`group flex flex-col items-center gap-1.5`}
                >
                  <span
                    className={`h-10 w-10 rounded-full border-2 transition-all duration-300 group-hover:scale-110 ${
                      color.en === c.en ? 'scale-110 border-signal shadow-[0_0_16px_rgba(255,75,31,0.45)]' : 'border-bone/20'
                    }`}
                    style={
                      c.hex
                        ? { background: `linear-gradient(135deg, ${c.hex}, ${c.hex}cc 55%, rgba(255,255,255,0.35))` }
                        : { background: 'conic-gradient(#c1121f, #facc15, #166534, #1d4ed8, #7c3aed, #c1121f)' }
                    }
                  />
                  <span className={`text-[9px] font-bold leading-none ${color.en === c.en ? 'text-signal' : 'text-dim'}`}>{c.name}</span>
                </button>
              ))}

              {/* custom colour */}
              <label
                className={`group relative flex cursor-pointer flex-col items-center gap-1.5`}
                data-cursor="لونك انت"
                title="لون مخصص"
              >
                <span
                  className={`relative flex h-10 w-10 items-center justify-center rounded-full border-2 transition-all duration-300 group-hover:scale-110 ${
                    color.hex === 'custom' ? 'scale-110 border-signal shadow-[0_0_16px_rgba(255,75,31,0.45)]' : 'border-bone/20'
                  }`}
                  style={{ background: custom }}
                >
                  <Pipette size={15} className="text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]" />
                </span>
                <span className={`text-[9px] font-bold leading-none ${color.hex === 'custom' ? 'text-signal' : 'text-dim'}`}>لون مخصص</span>
                <input
                  type="color"
                  value={custom}
                  onChange={(e) => { setCustom(e.target.value); setColor({ name: 'لون مخصص', en: 'CUSTOM', hex: 'custom' }); }}
                  className="absolute inset-0 cursor-pointer opacity-0"
                  aria-label="اختار لون مخصص"
                />
              </label>
            </div>

            {/* finish */}
            <h4 className="mt-7 font-black text-bone">الفنش</h4>
            <div className="mt-3 grid grid-cols-2 gap-2" dir="ltr">
              {[
                { id: 'gloss', ar: 'لامع', en: 'GLOSS' },
                { id: 'matte', ar: 'مطفي', en: 'MATTE' },
              ].map((f) => (
                <button
                  key={f.id}
                  onClick={() => setFinish(f.id)}
                  className={`rounded-full border px-4 py-3 font-black transition-all duration-300 ${
                    finish === f.id ? 'border-signal bg-signal text-white' : 'border-line text-dim hover:border-bone/40 hover:text-bone'
                  }`}
                >
                  {f.ar} <span className="font-grotesk text-[9px] uppercase tracking-[0.2em] opacity-70">{f.en}</span>
                </button>
              ))}
            </div>

            {/* summary + CTA */}
            <div className="mt-7 space-y-2 border-t border-line pt-5 text-sm">
              <p className="flex justify-between"><span className="text-dim">العربية</span><b className="text-bone">{car.modelAr}</b></p>
              <p className="flex justify-between">
                <span className="text-dim">اللون</span>
                <b className="flex items-center gap-2 text-bone">
                  {activeHex && <span className="h-3.5 w-3.5 rounded-full border border-bone/25" style={{ background: activeHex }} />}
                  {activeName}
                </b>
              </p>
              <p className="flex justify-between"><span className="text-dim">الفنش</span><b className="text-bone">{finish === 'matte' ? 'مطفي' : 'لامع'}</b></p>
              <p className="flex justify-between"><span className="text-dim">التغليف الكامل (Wrap)</span><b className="text-bone">يبدأ من 85,000 <span className="text-[10px] text-signal">EGP</span></b></p>
            </div>

            <a
              href={`https://wa.me/${WA_NUMBER}?text=${waText}`}
              target="_blank"
              rel="noreferrer"
              data-cursor="ابعت"
              className="mt-6 flex items-center justify-center gap-2 rounded-full bg-signal px-6 py-4 font-black text-white transition-transform duration-300 hover:scale-[1.02]"
            >
              <MessageCircle size={19} />
              ابعت التكوين واتساب
            </a>
            <p className="mt-3 text-center text-[11px] leading-relaxed text-dim">
              التلوين هنا محاكاة للتقريب — التنفيذ بيتم بفينيل أصلي (Wrap) بضمان ٥ سنين، واللون النهائي بيتراجع معاك على الطبيعة قبل التنفيذ.
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
