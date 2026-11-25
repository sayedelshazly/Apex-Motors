import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { BadgeCheck, HandCoins, KeyRound, ShieldCheck } from 'lucide-react';
import { Reveal } from './Reveal';

const perks = [
  { icon: BadgeCheck, t: 'فحص ٢١٠ نقطة', d: 'كل عربية بتعدي على فحص فني كامل قبل ما تدخل المعرض، وتقريرها بيوصلك قبل ما تدفع جنيه.' },
  { icon: HandCoins, t: 'تمويل وتقسيط', d: 'موافقة مبدئية في ٢٤ ساعة مع أكبر البنوك وشركات التمويل، ومقدم يبدأ من ٢٠٪.' },
  { icon: ShieldCheck, t: 'ضمان سنة كاملة', d: 'ضمان حقيقي على الموتور والفتيس، وصيانة مجانية أول ٦ شهور عندنا أو عند الوكيل.' },
  { icon: KeyRound, t: 'استبدال عربيتك', d: 'قيّم عربيتك القديمة في ٣٠ دقيقة وادفع الفرق بس. من غير لف ولا وجع دماغ.' },
];

export default function About() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const y = useTransform(scrollYProgress, [0, 1], ['-8%', '8%']);

  return (
    <section id="about" className="relative overflow-hidden px-6 py-24 md:px-12 md:py-32">
      <div className="grid items-center gap-12 lg:grid-cols-2">
        {/* parallax image */}
        <div ref={ref} className="relative aspect-[4/3] overflow-hidden" data-cursor="المعرض">
          <motion.img
            src="/cars/ferrari.jpg"
            alt="صالة عرض الشاذلي موتورز"
            style={{ y, scale: 1.18 }}
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-void/60 to-transparent" />
          <div className="absolute bottom-5 right-5 border border-line bg-void/60 px-5 py-4 backdrop-blur-md">
            <div className="font-display text-3xl text-bone" dir="ltr">SINCE 2012</div>
            <div className="mt-1 text-sm font-bold text-dim">١٢ سنة بنجمع الوحوش</div>
          </div>
        </div>

        <div>
          <Reveal>
            <p className="mb-4 flex items-center gap-3 font-grotesk text-[11px] uppercase tracking-[0.35em] text-signal" dir="ltr">
              <span className="h-[2px] w-10 bg-signal" /> Who we are
            </p>
            <h2 className="text-4xl font-black leading-snug text-bone md:text-6xl">
              إحنا مش معرض…
              <br />
              إحنا <span className="text-signal">نادي أصحاب</span> الذوق العالي
            </h2>
            <p className="mt-6 max-w-xl leading-loose text-dim">
              من ٢٠١٢ وإحنا بنسافر العالم ندوّر على العربيات اللي مش بتتلاقى: نسخ محدودة،
              ألوان نادرة، وعدادات قليلة. كل عربية عندنا ليها حكاية، وشغلنا إن الحكاية دي تكمل معاك.
            </p>
          </Reveal>

          <div className="mt-10 grid gap-px border border-line bg-line sm:grid-cols-2">
            {perks.map((p, i) => (
              <Reveal key={p.t} delay={i * 0.08} className="bg-carbon">
                <div className="group h-full p-6 transition-colors duration-300 hover:bg-smoke">
                  <p.icon className="text-signal transition-transform duration-300 group-hover:-translate-y-1" size={26} />
                  <h3 className="mt-4 text-lg font-black text-bone">{p.t}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-dim">{p.d}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
