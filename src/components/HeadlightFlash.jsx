import { motion } from 'framer-motion';

/**
 * Headlight sweep shown while the theme flips: two beams flare from the
 * bottom corners like a car lighting up a garage, wash the screen, then
 * settle into the new theme.
 */
export default function HeadlightFlash({ to }) {
  const warm = to === 'light';
  return (
    <motion.div
      className="pointer-events-none fixed inset-0 z-[240] overflow-hidden"
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 0.5, ease: 'easeInOut' } }}
      aria-hidden
    >
      {/* wash */}
      <motion.div
        className={`absolute inset-0 ${warm ? 'bg-[#fff6df]' : 'bg-black'}`}
        initial={{ opacity: 0 }}
        animate={{ opacity: [0, warm ? 0.85 : 0.7, 0] }}
        transition={{ duration: 1.9, times: [0, 0.38, 1], ease: 'easeInOut' }}
      />
      {/* left beam */}
      <motion.div
        className="absolute bottom-[-12%] left-[-16%] h-[95%] w-[62%] origin-bottom-left"
        style={{
          background: 'linear-gradient(to top, rgba(255,236,180,0.85), rgba(255,214,120,0.28) 55%, transparent 78%)',
          clipPath: 'polygon(46% 100%, 58% 100%, 100% 0, 0 0)',
          filter: 'blur(6px)',
        }}
        initial={{ scaleY: 0, opacity: 0, rotate: -7 }}
        animate={{ scaleY: [0, 1, 1], opacity: [0, 1, 0], rotate: [-7, 0, 0] }}
        transition={{ duration: 1.9, times: [0, 0.45, 1], ease: [0.22, 1, 0.36, 1] }}
      />
      {/* right beam */}
      <motion.div
        className="absolute bottom-[-12%] right-[-16%] h-[95%] w-[62%] origin-bottom-right"
        style={{
          background: 'linear-gradient(to top, rgba(255,236,180,0.85), rgba(255,214,120,0.28) 55%, transparent 78%)',
          clipPath: 'polygon(42% 100%, 54% 100%, 0 0, 100% 0)',
          filter: 'blur(6px)',
        }}
        initial={{ scaleY: 0, opacity: 0, rotate: 7 }}
        animate={{ scaleY: [0, 1, 1], opacity: [0, 1, 0], rotate: [7, 0, 0] }}
        transition={{ duration: 1.9, times: [0, 0.45, 1], ease: [0.22, 1, 0.36, 1] }}
      />
      {/* headlight glows */}
      {[8, 92].map((left) => (
        <motion.span
          key={left}
          className="absolute bottom-[3%] h-16 w-40 -translate-x-1/2 rounded-[100%] bg-[#ffe9a8] blur-2xl"
          style={{ left: `${left}%` }}
          initial={{ opacity: 0, scale: 0.4 }}
          animate={{ opacity: [0, 0.95, 0], scale: [0.4, 1.25, 1.4] }}
          transition={{ duration: 1.9, times: [0, 0.38, 1], ease: 'easeInOut' }}
        />
      ))}
    </motion.div>
  );
}
