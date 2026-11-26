import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { MoveLeft, MoveRight } from 'lucide-react';
import { useLang } from '../i18n.jsx';

gsap.registerPlugin(ScrollTrigger);

const slides = [
  { img: '/cars/ferrari.webp', en: 'LaFerrari', ar: 'أسطورة هايبرد', capEn: 'Hybrid legend', stat: '963 HP' },
  { img: '/cars/mclaren.webp', en: '720S', ar: 'كاربون طاير', capEn: 'Flying carbon', stat: '341 KM/H' },
  { img: '/cars/lamborghini.webp', en: 'Huracán', ar: 'صوت يهز الشارع', capEn: 'A soundtrack that shakes the street', stat: '640 HP' },
  { img: '/cars/amg-gtr.webp', en: 'AMG GT R', ar: 'وحش الحلبة', capEn: 'Track beast', stat: '3.6 S' },
  { img: '/cars/mustang.webp', en: 'Mustang', ar: 'عضلات أمريكية', capEn: 'American muscle', stat: 'V8 5.0' },
  { img: '/cars/camaro.webp', en: 'Camaro SS', ar: 'روح متمردة', capEn: 'Rebel soul', stat: '455 HP' },
];

export default function HorizontalGallery() {
  const { lang, t } = useLang();
  const wrapRef = useRef(null);
  const trackRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const track = trackRef.current;
      const getAmount = () => Math.max(0, track.scrollWidth - window.innerWidth);
      gsap.to(track, {
        x: () => (document.documentElement.dir === 'rtl' ? getAmount() : -getAmount()),
        ease: 'none',
        scrollTrigger: {
          trigger: wrapRef.current,
          start: 'top top',
          end: () => `+=${getAmount()}`,
          pin: true,
          scrub: 1.35,
          invalidateOnRefresh: true,
          anticipatePin: 1,
        },
      });
    }, wrapRef);
    const lenis = window.__lenis;
    const onScroll = () => ScrollTrigger.update();
    if (lenis) lenis.on('scroll', onScroll);
    return () => { if (lenis) lenis.off('scroll', onScroll); ctx.revert(); };
  }, [lang]);

  return (
    <section id="gallery" ref={wrapRef} className="relative overflow-hidden bg-carbon">
      <div className="flex items-center justify-between px-6 pt-14 md:px-12">
        <h2 className="flex items-center gap-3 text-2xl font-black text-bone md:text-4xl">
          {lang === 'ar' ? 'الجاليري' : 'GALLERY'}
          <span className="font-display text-lg tracking-widest text-dim" dir="ltr">{lang === 'ar' ? 'GALLERY' : 'الجاليري'}</span>
        </h2>
        <span className="flex items-center gap-2 text-sm font-bold text-signal">
          {t('gal.keep')}
          {lang === 'ar' ? <MoveLeft className="animate-pulse" size={18} /> : <MoveRight className="animate-pulse" size={18} />}
        </span>
      </div>

      <div ref={trackRef} className="flex w-max items-stretch gap-6 px-6 py-12 md:px-12" dir="rtl">
        {slides.map((s, i) => (
          <article key={s.en} className="group relative w-[78vw] shrink-0 overflow-hidden sm:w-[52vw] lg:w-[38vw]" data-cursor={s.en}>
            <div className="relative aspect-[4/3] overflow-hidden">
              <img src={s.img} alt={s.en} loading="lazy" className="car-idle h-full w-full object-contain transition-transform duration-[1400ms] group-hover:scale-108 lg:object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-void/85 via-transparent to-transparent" />
              <span className="text-stroke absolute right-4 top-2 font-display text-6xl md:text-7xl" dir="ltr">0{i + 1}</span>
              <div className="absolute inset-x-0 bottom-0 flex items-end justify-between p-5">
                <div>
                  <h3 className="font-display text-3xl tracking-wide text-bone md:text-4xl" dir="ltr">{s.en}</h3>
                  <p className="mt-1 font-bold text-bone/75">{lang === 'ar' ? s.ar : s.capEn}</p>
                </div>
                <span className="bg-signal px-3 py-1.5 font-grotesk text-sm font-bold text-white" dir="ltr">{s.stat}</span>
              </div>
            </div>
          </article>
        ))}

        {/* end card */}
        <div className="speed-stripes flex w-[60vw] shrink-0 flex-col items-center justify-center gap-4 border border-line sm:w-[36vw]">
          <p className="font-display text-4xl text-bone md:text-5xl" dir="ltr">YOUR TURN</p>
          <p className="font-bold text-dim">{lang === 'ar' ? 'دورك تركب' : 'Your turn behind the wheel'}</p>
          <a href="#testdrive" className="rounded-full bg-bone px-6 py-3 font-black text-void transition-colors hover:bg-signal hover:text-white" data-cursor={t('spot.book')}>
            {t('spot.book')}
          </a>
        </div>
      </div>
    </section>
  );
}
