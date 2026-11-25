import { motion } from 'framer-motion';

/** Fade/slide reveal when scrolled into view */
export function Reveal({ children, delay = 0, y = 36, className = '' }) {
  return (
    <motion.div
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ delay, duration: 0.85, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/** Section heading: small tag + huge bilingual title with line-mask reveal */
export function SectionHeading({ tag, ar, en, stroke = false }) {
  return (
    <div className="relative z-10 mb-12 md:mb-16">
      <Reveal>
        <p className="mb-4 flex items-center gap-3 font-grotesk text-[11px] uppercase tracking-[0.35em] text-signal" dir="ltr">
          <span className="h-[2px] w-10 bg-signal" />
          {tag}
        </p>
      </Reveal>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <motion.div
          className="overflow-hidden"
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: '-60px' }}
        >
          <motion.h2
            variants={{ hidden: { y: '110%' }, show: { y: 0, transition: { duration: 0.85, ease: [0.22, 1, 0.36, 1] } } }}
            className="text-5xl font-black leading-[1.05] text-bone md:text-7xl"
          >
            {ar}
          </motion.h2>
        </motion.div>
        <span
          className={`font-display text-4xl tracking-wide md:text-6xl ${stroke ? 'text-stroke-faint' : 'text-smoke'}`}
          dir="ltr"
          aria-hidden
        >
          {en}
        </span>
      </div>
    </div>
  );
}
