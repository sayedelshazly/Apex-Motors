import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Rocket } from 'lucide-react';
import { useLang } from '../i18n.jsx';

/**
 * Floating launch-to-top button: a scroll-progress ring around a
 * rocket. One click and Lenis rockets you to the top at full speed.
 */
export default function BackToTop() {
  const { t } = useLang();
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const max = document.documentElement.scrollHeight - window.innerHeight;
        setProgress(max > 0 ? Math.min(1, window.scrollY / max) : 0);
      });
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      cancelAnimationFrame(raf);
    };
  }, []);

  const launch = () => {
    const dist = window.scrollY;
    const duration = Math.min(1.15, Math.max(0.45, dist / 5200));
    const easing = (t) => 1 - Math.pow(1 - t, 4); // easeOutQuart — launches hard
    if (window.__lenis) window.__lenis.scrollTo(0, { duration, easing });
    else window.scrollTo({ top: 0, behavior: 'smooth' });
    if (navigator.vibrate) navigator.vibrate(12);
  };

  const R = 21;
  const C = 2 * Math.PI * R;

  return (
    <AnimatePresence>
      {progress > 0.06 && (
        <motion.button
          initial={{ opacity: 0, y: 18, scale: 0.8 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 18, scale: 0.8 }}
          transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
          onClick={launch}
          data-cursor={t('top.cursor')}
          aria-label={t('top.aria')}
          className="group fixed bottom-5 right-5 z-[120] flex h-14 w-14 items-center justify-center rounded-full border border-signal/40 bg-void/80 shadow-[0_12px_34px_rgba(0,0,0,0.55)] backdrop-blur-md transition-colors hover:border-signal hover:bg-signal/15"
        >
          <svg viewBox="0 0 48 48" className="absolute inset-0 h-full w-full -rotate-90">
            <circle cx="24" cy="24" r={R} fill="none" stroke="rgba(255,255,255,0.12)" strokeWidth="2.5" />
            <circle
              cx="24" cy="24" r={R} fill="none"
              stroke="#ff4b1f" strokeWidth="2.5" strokeLinecap="round"
              strokeDasharray={C}
              strokeDashoffset={C * (1 - progress)}
              style={{ filter: 'drop-shadow(0 0 5px rgba(255,75,31,0.7))' }}
            />
          </svg>
          <Rocket
            size={20}
            className="-rotate-45 text-bone transition-all duration-300 group-hover:-translate-y-0.5 group-hover:text-signal"
          />
        </motion.button>
      )}
    </AnimatePresence>
  );
}
