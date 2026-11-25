import { useEffect, useState } from 'react';
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

gsap.registerPlugin(ScrollTrigger);

export default function App() {
  const [loading, setLoading] = useState(true);

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
      <ScrollSpeedo />
      <Navbar />

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
