import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ArrowDown, Gauge, Timer, Wind } from 'lucide-react';

const line = {
  hidden: { y: '115%' },
  show: (i) => ({
    y: 0,
    transition: { delay: 0.15 + i * 0.13, duration: 0.9, ease: [0.22, 1, 0.36, 1] },
  }),
};

function SpecCard({ className, icon: Icon, value, unit, label, delay }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      className={`absolute z-20 ${className}`}
    >
      <motion.div
        animate={{ y: [0, -10, 0] }}
        transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut', delay }}
        className="border border-line bg-void/60 px-4 py-3 backdrop-blur-md md:px-5 md:py-4"
        data-cursor="1600 HP"
      >
        <div className="flex items-center gap-2 text-signal">
          <Icon size={15} />
          <span className="font-grotesk text-[10px] uppercase tracking-[0.25em] text-dim">{label}</span>
        </div>
        <div className="mt-1 font-display text-2xl leading-none text-bone md:text-4xl" dir="ltr">
          {value}
          <span className="ml-1 text-sm text-signal md:text-base">{unit}</span>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default function Hero({ started }) {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] });
  const carY = useTransform(scrollYProgress, [0, 1], ['0%', '30%']);
  const textY = useTransform(scrollYProgress, [0, 1], ['0%', '65%']);
  const fade = useTransform(scrollYProgress, [0, 0.7], [1, 0]);

  return (
    <section id="hero" ref={ref} className="noise relative flex min-h-svh flex-col overflow-hidden">
      {/* garage backdrop: glow + light strips + floor */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-b from-smoke/60 via-void to-void" />
        <div className="absolute left-1/2 top-[6%] h-[46vh] w-[86vw] -translate-x-1/2 rounded-[100%] bg-signal/15 blur-[110px]" />
        <div className="absolute inset-x-0 top-24 flex justify-center gap-3 opacity-25" dir="ltr" aria-hidden>
          {Array.from({ length: 9 }).map((_, i) => (
            <span key={i} className="h-24 w-10 -skew-x-12 bg-gradient-to-b from-bone/50 to-transparent blur-[3px] md:h-32" />
          ))}
        </div>
        <span className="text-stroke-faint absolute inset-x-0 top-[13%] select-none text-center font-display text-[24vw] leading-none" dir="ltr" aria-hidden>
          CHIRON
        </span>
        <div className="speed-stripes absolute inset-x-0 bottom-0 h-40 opacity-60 [mask-image:linear-gradient(to_top,black,transparent)]" />
      </div>

      {/* the beast itself — cutout, no background */}
      <motion.div style={{ y: carY }} className="pointer-events-none absolute inset-x-0 top-[15%] z-[6] flex flex-col items-center md:top-[11%]">
        <motion.img
          src="/cars/cut/bugatti.webp"
          alt="Bugatti Chiron — من غير خلفية"
          initial={{ scale: 1.22, opacity: 0 }}
          animate={started ? { scale: 1, opacity: 1 } : {}}
          transition={{ duration: 1.6, ease: [0.22, 1, 0.36, 1] }}
          className="w-[min(880px,94vw)] drop-shadow-[0_35px_45px_rgba(0,0,0,0.45)]"
          dir="ltr"
        />
        <div className="car-shadow -mt-[4.5%] h-14 w-[62%] rounded-[100%]" />
        <motion.img
          src="/cars/cut/bugatti.webp"
          alt=""
          aria-hidden
          initial={{ opacity: 0 }}
          animate={started ? { opacity: 1 } : {}}
          transition={{ duration: 1.6, delay: 0.3 }}
          className="car-reflection -mt-[7%] w-[min(880px,94vw)]"
          dir="ltr"
        />
      </motion.div>

      {/* floating spec cards */}
      <SpecCard className="right-[6%] top-[30%] hidden md:block" icon={Gauge} value="1600" unit="HP" label="Horsepower" delay={1.1} />
      <SpecCard className="left-[5%] top-[46%] hidden md:block" icon={Timer} value="2.4" unit="SEC" label="0—100 KM/H" delay={1.3} />
      <SpecCard className="bottom-[30%] right-[9%] hidden lg:block" icon={Wind} value="440" unit="KM/H" label="Top Speed" delay={1.5} />

      {/* headline */}
      <motion.div style={{ y: textY, opacity: fade }} className="relative z-10 flex flex-1 flex-col justify-end px-6 pb-10 pt-32 md:px-12">
        <motion.p
          initial={{ opacity: 0, x: 30 }}
          animate={started ? { opacity: 1, x: 0 } : {}}
          transition={{ delay: 0.5, duration: 0.7 }}
          className="mb-3 flex items-center gap-3 text-base font-bold text-bone md:text-lg"
        >
          <span className="h-[2px] w-10 bg-signal" />
          معرض السيارات الفاخرة — القاهرة الجديدة
        </motion.p>

        <h1 className="font-display leading-[0.82]" dir="ltr">
          <span className="block overflow-hidden">
            <motion.span custom={0} variants={line} initial="hidden" animate={started ? 'show' : 'hidden'} className="block text-[13vw] tracking-tight text-bone md:text-[10.8rem]">
              ELSHAZLY
            </motion.span>
          </span>
          <span className="block overflow-hidden">
            <motion.span custom={1} variants={line} initial="hidden" animate={started ? 'show' : 'hidden'} className="text-stroke block text-[13vw] tracking-tight md:text-[10.8rem]">
              MOTORS
            </motion.span>
          </span>
        </h1>

        <div className="mt-6 flex flex-wrap items-end justify-between gap-6">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={started ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.85, duration: 0.7 }}
            className="max-w-md text-lg font-semibold leading-relaxed text-bone/85"
          >
            مش بنبيع عربيات… إحنا بنسلّمك وحش.
            <span className="text-dim"> أندر وأقوى العربيات في مصر، مختارة قطعة قطعة.</span>
          </motion.p>

          <motion.a
            initial={{ opacity: 0, y: 20 }}
            animate={started ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 1, duration: 0.7 }}
            href="#collection"
            className="group flex items-center gap-3 rounded-full bg-bone px-7 py-3.5 font-black text-void transition-colors hover:bg-signal hover:text-white"
            data-cursor="يلا بينا"
          >
            اكتشف التشكيلة
            <ArrowDown className="transition-transform duration-300 group-hover:translate-y-1" size={18} />
          </motion.a>
        </div>

        {/* stats strip */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={started ? { opacity: 1 } : {}}
          transition={{ delay: 1.25, duration: 0.8 }}
          className="mt-10 grid grid-cols-2 gap-px border border-line bg-line/40 backdrop-blur-sm md:grid-cols-4"
          dir="ltr"
        >
          {[
            ['+120', 'CARS IN SHOWROOM'],
            ['14', 'GLOBAL BRANDS'],
            ['12Y', 'OF PURE SPEED'],
            ['4.9', 'CLIENT RATING'],
          ].map(([v, l]) => (
            <div key={l} className="bg-void/55 px-5 py-4">
              <div className="font-display text-2xl text-bone md:text-3xl">{v}</div>
              <div className="mt-1 font-grotesk text-[10px] uppercase tracking-[0.25em] text-dim">{l}</div>
            </div>
          ))}
        </motion.div>
      </motion.div>
    </section>
  );
}
