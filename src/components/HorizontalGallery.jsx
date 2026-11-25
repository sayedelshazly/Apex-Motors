import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { MoveLeft } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const slides = [
  { img: '/cars/cut/ferrari.webp', en: 'LaFerrari', ar: 'أسطورة هايبرد', stat: '963 HP' },
  { img: '/cars/cut/mclaren.webp', en: '720S', ar: 'كاربون طاير', stat: '341 KM/H' },
  { img: '/cars/cut/lamborghini.webp', en: 'Huracán', ar: 'صوت يهز الشارع', stat: '640 HP' },
  { img: '/cars/cut/amg-gtr.webp', en: 'AMG GT R', ar: 'وحش الحلبة', stat: '3.6 S' },
  { img: '/cars/cut/mustang.webp', en: 'Mustang', ar: 'عضلات أمريكية', stat: 'V8 5.0' },
  { img: '/cars/cut/camaro.webp', en: 'Camaro SS', ar: 'روح متمردة', stat: '455 HP' },
];

export default function HorizontalGallery() {
  const wrapRef = useRef(null);
  const trackRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const track = trackRef.current;
      const getAmount = () => Math.max(0, track.scrollWidth - window.innerWidth);
      gsap.to(track, {
        x: () => getAmount(), // RTL page: content flows right→left, so we push +x
        ease: 'none',
        scrollTrigger: {
          trigger: wrapRef.current,
          start: 'top top',
          end: () => `+=${getAmount()}`,
          pin: true,
          scrub: 1,
          invalidateOnRefresh: true,
          anticipatePin: 1,
        },
      });
    }, wrapRef);
    return () => ctx.revert();
  }, []);

  return (
    <section id="gallery" ref={wrapRef} className="relative overflow-hidden bg-carbon">
      <div className="flex items-center justify-between px-6 pt-14 md:px-12">
        <h2 className="flex items-center gap-3 text-2xl font-black text-bone md:text-4xl">
          الجاليري
          <span className="font-display text-lg tracking-widest text-dim" dir="ltr">GALLERY</span>
        </h2>
        <span className="flex items-center gap-2 text-sm font-bold text-signal">
          كمّل سكرول
          <MoveLeft className="animate-pulse" size={18} />
        </span>
      </div>

      <div ref={trackRef} className="flex w-max items-stretch gap-6 px-6 py-12 md:px-12" dir="rtl">
        {slides.map((s, i) => (
          <article key={s.en} className="group relative w-[78vw] shrink-0 overflow-hidden border border-line bg-gradient-to-b from-smoke/50 via-carbon to-void sm:w-[52vw] lg:w-[38vw]" data-cursor={s.en}>
            <div className="relative flex aspect-[4/3] flex-col items-center justify-center overflow-hidden px-7 pt-8">
              <div className="absolute left-1/2 top-1/2 h-40 w-[70%] -translate-x-1/2 -translate-y-1/2 rounded-[100%] bg-signal/10 blur-[70px]" />
              <img src={s.img} alt={s.en} loading="lazy" className="relative max-h-[68%] w-auto max-w-full object-contain drop-shadow-[0_22px_26px_rgba(0,0,0,0.45)] transition-transform duration-[1400ms] group-hover:scale-108" dir="ltr" />
              <div className="car-shadow -mt-2 h-9 w-[60%] rounded-[100%]" />
              <span className="text-stroke absolute right-4 top-2 font-display text-6xl md:text-7xl" dir="ltr">0{i + 1}</span>
              <div className="absolute inset-x-0 bottom-0 flex items-end justify-between p-5">
                <div>
                  <h3 className="font-display text-3xl tracking-wide text-bone md:text-4xl" dir="ltr">{s.en}</h3>
                  <p className="mt-1 font-bold text-bone/75">{s.ar}</p>
                </div>
                <span className="bg-signal px-3 py-1.5 font-grotesk text-sm font-bold text-white" dir="ltr">{s.stat}</span>
              </div>
            </div>
          </article>
        ))}

        {/* end card */}
        <div className="speed-stripes flex w-[60vw] shrink-0 flex-col items-center justify-center gap-4 border border-line sm:w-[36vw]">
          <p className="font-display text-4xl text-bone md:text-5xl" dir="ltr">YOUR TURN</p>
          <p className="font-bold text-dim">دورك تركب</p>
          <a href="#testdrive" className="rounded-full bg-bone px-6 py-3 font-black text-void transition-colors hover:bg-signal hover:text-white" data-cursor="احجز">
            احجز تجربة قيادة
          </a>
        </div>
      </div>
    </section>
  );
}
