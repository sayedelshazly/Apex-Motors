import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import Preloader from './components/Preloader';
import Cursor from './components/Cursor';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Marquee from './components/Marquee';
import Spotlight from './components/Spotlight';
import Collection from './components/Collection';
import Compare from './components/Compare';
import Hybrid from './components/Hybrid';
import HorizontalGallery from './components/HorizontalGallery';
import About from './components/About';
import TestDrive from './components/TestDrive';
import Footer from './components/Footer';
import ScrollSpeedo from './components/ScrollSpeedo';
import SportScrollFx from './components/SportScrollFx';
import BackToTop from './components/BackToTop';
import { playRev } from './lib/revSound';
import { playClick } from './lib/clickSound';

gsap.registerPlugin(ScrollTrigger);

/** Red sweep that fires the moment SPORT mode engages */
function SportFlash() {
  return (
    <motion.div className="pointer-events-none fixed inset-0 z-[235] overflow-hidden" aria-hidden
      initial={{ opacity: 1 }} exit={{ opacity: 0, transition: { duration: 0.2 } }}>
      <motion.div
        className="absolute inset-0"
        style={{ background: 'radial-gradient(90% 70% at 50% 110%, rgba(255,30,0,0.55), rgba(255,30,0,0.12) 55%, transparent 75%)' }}
        initial={{ opacity: 0 }}
        animate={{ opacity: [0, 1, 0] }}
        transition={{ duration: 0.75, times: [0, 0.3, 1], ease: 'easeOut' }}
      />
      <motion.div
        className="absolute inset-x-0 top-1/2 h-[2px] bg-gradient-to-r from-transparent via-[#ff3b1f] to-transparent"
        initial={{ scaleX: 0, opacity: 0 }}
        animate={{ scaleX: [0, 1, 1], opacity: [0, 1, 0] }}
        transition={{ duration: 0.75, times: [0, 0.35, 1], ease: 'easeOut' }}
      />
    </motion.div>
  );
}

export default function App() {
  const [loading, setLoading] = useState(true);
  const [mode, setMode] = useState(() => document.documentElement.dataset.mode || 'normal');
  const [sportFx, setSportFx] = useState(null);
  const fxTimer = useRef(null);

  const toggleMode = () => {
    const to = mode === 'sport' ? 'normal' : 'sport';
    setMode(to);
    if (to === 'sport') document.documentElement.dataset.mode = 'sport';
    else delete document.documentElement.dataset.mode;
    try { localStorage.setItem('apex-mode', to); } catch { /* private mode */ }
    playRev(to === 'sport');
    if (navigator.vibrate) navigator.vibrate(to === 'sport' ? [30, 40, 30] : 20);
    clearTimeout(fxTimer.current);
    if (to === 'sport') {
      setSportFx({ id: Date.now() });
      fxTimer.current = setTimeout(() => setSportFx(null), 800);
    }
  };

  // SPORT mode: mechanical click sounds on every button/link press
  useEffect(() => {
    if (mode !== 'sport') return;
    const onDown = (e) => {
      if (e.target.closest('button, a')) playClick();
    };
    document.addEventListener('pointerdown', onDown);
    return () => document.removeEventListener('pointerdown', onDown);
  }, [mode]);

  // Lenis smooth scroll driven by GSAP's ticker (keeps ScrollTrigger in sync)
  useEffect(() => {
    const lenis = new Lenis({ duration: 1.35, smoothWheel: true, easing: (t) => 1 - Math.pow(1 - t, 4) });
    window.__lenis = lenis;
    lenis.on('scroll', ScrollTrigger.update);
    const tick = (time) => lenis.raf(time * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);

    // anchor links through Lenis
    const onClick = (e) => {
      const a = e.target.closest('a[href^="#"]');
      if (!a) return;
      const el = document.querySelector(a.getAttribute('href'));
      if (el) {
        e.preventDefault();
        lenis.scrollTo(el, { offset: 0, duration: 1.6 });
      }
    };
    document.addEventListener('click', onClick);
    return () => {
      document.removeEventListener('click', onClick);
      gsap.ticker.remove(tick);
      delete window.__lenis;
      lenis.destroy();
    };
  }, []);

  // lock scroll during preload
  useEffect(() => {
    document.body.style.overflow = loading ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [loading]);

  return (
    <div className={`bg-void font-ar text-bone antialiased ${sportFx ? 'sport-shake' : ''}`}>
      <AnimatePresence>
        {loading && <Preloader onDone={() => setLoading(false)} />}
      </AnimatePresence>

      <Cursor />
      <AnimatePresence>{sportFx && <SportFlash key={sportFx.id} />}</AnimatePresence>
      {mode === 'sport' && <div className="sport-glow pointer-events-none fixed inset-0 z-[90]" aria-hidden />}
      {mode === 'sport' && <SportScrollFx />}
      <ScrollSpeedo />
      <BackToTop />
      <Navbar mode={mode} onToggleMode={toggleMode} />

      <main>
        <Hero started={!loading} />
        <Marquee />
        <Spotlight />
        <HorizontalGallery />
        <Collection />
        <Compare />
        <Hybrid />
        <Marquee dark />
        <About />
        <TestDrive />
      </main>

      <Footer />
    </div>
  );
}
