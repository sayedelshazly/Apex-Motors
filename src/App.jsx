import { useEffect, useRef, useState } from 'react';
import { AnimatePresence } from 'framer-motion';
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
import HorizontalGallery from './components/HorizontalGallery';
import About from './components/About';
import TestDrive from './components/TestDrive';
import Footer from './components/Footer';
import ScrollSpeedo from './components/ScrollSpeedo';
import HeadlightFlash from './components/HeadlightFlash';

gsap.registerPlugin(ScrollTrigger);

export default function App() {
  const [loading, setLoading] = useState(true);
  const [theme, setTheme] = useState(
    () => document.documentElement.dataset.theme || 'dark'
  );
  const [flash, setFlash] = useState(null); // { id, to }
  const timers = useRef([]);

  const toggleTheme = () => {
    const to = theme === 'dark' ? 'light' : 'dark';
    timers.current.forEach(clearTimeout);
    document.documentElement.classList.add('theming');
    setFlash({ id: Date.now(), to });
    // flip mid-flash, while the beams are at full blast
    timers.current.push(setTimeout(() => {
      setTheme(to);
      document.documentElement.dataset.theme = to;
      try { localStorage.setItem('apex-theme', to); } catch { /* private mode */ }
    }, 720));
    timers.current.push(setTimeout(() => setFlash(null), 2050));
    timers.current.push(setTimeout(() => {
      document.documentElement.classList.remove('theming');
    }, 2300));
  };

  useEffect(() => () => timers.current.forEach(clearTimeout), []);

  // Lenis smooth scroll driven by GSAP's ticker (keeps ScrollTrigger in sync)
  useEffect(() => {
    const lenis = new Lenis({ duration: 1.15, smoothWheel: true });
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
        lenis.scrollTo(el, { offset: 0, duration: 1.4 });
      }
    };
    document.addEventListener('click', onClick);
    return () => {
      document.removeEventListener('click', onClick);
      gsap.ticker.remove(tick);
      lenis.destroy();
    };
  }, []);

  // lock scroll during preload
  useEffect(() => {
    document.body.style.overflow = loading ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [loading]);

  return (
    <div className="bg-void font-ar text-bone antialiased">
      <AnimatePresence>
        {loading && <Preloader onDone={() => setLoading(false)} />}
      </AnimatePresence>

      <Cursor />
      <AnimatePresence>{flash && <HeadlightFlash key={flash.id} to={flash.to} />}</AnimatePresence>
      <ScrollSpeedo />
      <Navbar theme={theme} onToggleTheme={toggleTheme} />

      <main>
        <Hero started={!loading} />
        <Marquee />
        <Spotlight />
        <HorizontalGallery />
        <Collection />
        <Marquee dark />
        <About />
        <TestDrive />
      </main>

      <Footer />
    </div>
  );
}
