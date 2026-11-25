import { ArrowUp, AtSign, MapPin, Phone } from 'lucide-react';
import { Reveal } from './Reveal';

export default function Footer() {
  return (
    <footer id="contact" className="relative overflow-hidden">
      {/* CTA */}
      <div className="px-6 py-24 text-center md:px-12 md:py-32">
        <Reveal>
          <p className="font-grotesk text-[11px] uppercase tracking-[0.35em] text-signal" dir="ltr">Have a beast in mind?</p>
          <h2 className="mx-auto mt-5 max-w-4xl text-5xl font-black leading-[1.1] text-bone md:text-7xl">
            عربيتك الجاية
            <br />
            <span className="text-stroke-signal font-display tracking-wide" dir="ltr">WAITING FOR YOU</span>
          </h2>
          <p className="mx-auto mt-6 max-w-lg leading-relaxed text-dim">
            عدّي علينا اشرب قهوة، اسمع صوت الموتور بنفسك، والباقي علينا.
            المعرض مفتوح كل يوم من ١٠ الصبح لـ ١٢ بالليل.
          </p>
          <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
            <a href="#testdrive" className="rounded-full bg-signal px-8 py-4 font-black text-white transition-transform hover:scale-105" data-cursor="يلا">
              احجز تجربة قيادة
            </a>
            <a href="https://wa.me/201099687092" target="_blank" rel="noreferrer" className="rounded-full border border-line px-8 py-4 font-black text-bone transition-colors hover:border-signal hover:text-signal" data-cursor="واتساب">
              كلّمنا واتساب
            </a>
          </div>
        </Reveal>
      </div>

      {/* giant wordmark */}
      <div className="select-none px-2" dir="ltr" aria-hidden>
        <div className="text-stroke-faint whitespace-nowrap text-center font-display text-[16.5vw] leading-[0.78]">
          ELSHAZLY
        </div>
      </div>

      <div className="border-t border-line px-6 py-8 md:px-12">
        <div className="flex flex-wrap items-center justify-between gap-5 text-sm text-dim">
          <span className="flex items-center gap-2">
            <MapPin size={15} className="text-signal" />
            التسعين الشمالي، القاهرة الجديدة
          </span>
          <a href="tel:+201099687092" className="flex items-center gap-2 hover:text-bone" dir="ltr">
            <Phone size={15} className="text-signal" /> +20 109 968 7092
          </a>
          <a href="#hero" className="flex items-center gap-2 hover:text-bone" dir="ltr">
            <AtSign size={15} className="text-signal" /> elshazlymotors.eg
          </a>
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="flex items-center gap-2 font-bold text-bone hover:text-signal"
            data-cursor="فوق"
          >
            ارجع فوق <ArrowUp size={16} />
          </button>
        </div>
        <p className="mt-6 text-center font-grotesk text-[11px] uppercase tracking-[0.3em] text-dim/70" dir="ltr">
          © 2026 Apex Motors — Not just browsing cars. Experiencing speed.
        </p>
      </div>
    </footer>
  );
}
