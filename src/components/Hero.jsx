import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ArrowDown, Gauge, Timer, Wind } from 'lucide-react';
import { useLang } from '../i18n.jsx';

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
  const { t } = useLang();
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] });
  const imgY = useTransform(scrollYProgress, [0, 1], ['0%', '22%']);
  const textY = useTransform(scrollYProgress, [0, 1], ['0%', '65%']);
  const fade = useTransform(scrollYProgress, [0, 0.7], [1, 0]);

  return (
    <section id="hero" ref={ref} className="noise relative flex min-h-svh flex-col overflow-hidden">
      {/* car backdrop — slow cinematic dolly-in + scroll parallax */}
      <motion.div style={{ y: imgY }} className="absolute inset-0">
        <motion.img
          src="/cars/bugatti-hero.webp" fetchPriority="high"
          alt="Bugatti Chiron"
          initial={{ scale: 1.18 }}
          animate={started ? { scale: 1.02 } : {}}
          transition={{ duration: 7, ease: [0.22, 1, 0.36, 1] }}
          className="car-idle h-[115%] w-full object-cover object-center max-sm:object-[72%_50%]"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-void/80 via-void/25 to-void" />
        <div className="absolute inset-0 bg-gradient-to-l from-void/70 via-transparent to-void/40" />
      </motion.div>

      {/* floating spec cards — زي مرجع إنستجرام */}
      <SpecCard className="right-[6%] top-[22%] hidden md:block" icon={Gauge} value="1600" unit="HP" label="Horsepower" delay={1.1} />
      <SpecCard className="left-[5%] top-[52%] hidden md:block" icon={Timer} value="2.4" unit="SEC" label="0—100 KM/H" delay={1.3} />
      <SpecCard className="bottom-[24%] right-[10%] hidden lg:block" icon={Wind} value="440" unit="KM/H" label="Top Speed" delay={1.5} />

      {/* headline */}
      <motion.div style={{ y: textY, opacity: fade }} className="relative z-10 flex flex-1 flex-col justify-end px-6 pb-10 pt-32 md:px-12">
        <motion.p
          initial={{ opacity: 0, x: 30 }}
          animate={started ? { opacity: 1, x: 0 } : {}}
          transition={{ delay: 0.5, duration: 0.7 }}
          className="mb-3 flex items-center gap-3 text-base font-bold text-bone md:text-lg"
        >
          <span className="h-[2px] w-10 bg-signal" />
          {t('hero.eyebrow')}
        </motion.p>

        <h1 className="font-display leading-[0.82]" dir="ltr">
          <span className="block overflow-hidden">
            <motion.span custom={0} variants={line} initial="hidden" animate={started ? 'show' : 'hidden'} className="block text-[13vw] tracking-tight text-bone md:text-[min(10.8rem,19vw)]">
              ELSHAZLY
            </motion.span>
          </span>
          <span className="block overflow-hidden">
            <motion.span custom={1} variants={line} initial="hidden" animate={started ? 'show' : 'hidden'} className="text-stroke block text-[13vw] tracking-tight md:text-[min(10.8rem,19vw)]">
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
            {t('hero.subA')}
            <span className="text-dim"> {t('hero.subB')}</span>
          </motion.p>

          <motion.a
            initial={{ opacity: 0, y: 20 }}
            animate={started ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 1, duration: 0.7 }}
            href="#collection"
            className="group flex items-center gap-3 rounded-full bg-bone px-7 py-3.5 font-black text-void transition-colors hover:bg-signal hover:text-white"
            data-cursor={t('hero.go')}
          >
            {t('hero.cta')}
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
