import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowUpLeft, Gauge, Menu, Phone, X } from 'lucide-react';

const links = [
  { ar: 'الرئيسية', en: 'HOME', href: '#hero' },
  { ar: 'النجم', en: 'SPOTLIGHT', href: '#spotlight' },
  { ar: 'التشكيلة', en: 'COLLECTION', href: '#collection' },
  { ar: 'الجاليري', en: 'GALLERY', href: '#gallery' },
  { ar: 'إحنا مين', en: 'ABOUT', href: '#about' },
  { ar: 'كلّمنا', en: 'CONTACT', href: '#contact' },
];

export default function Navbar({ mode = 'normal', onToggleMode }) {
  const sport = mode === 'sport';
  const [open, setOpen] = useState(false);

  return (
    <>
      <motion.header
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        className="fixed inset-x-0 top-0 z-[100] mix-blend-difference"
      >
        <div className="flex items-center justify-between px-6 py-5 md:px-12">
          <a href="#hero" className="flex items-baseline gap-2" data-cursor="ELSHAZLY">
            <span className="font-display text-2xl tracking-wide text-white" dir="ltr">
              ELSHAZLY<span className="text-signal">.</span>
            </span>
            <span className="hidden text-sm font-bold text-white/80 sm:block">موتورز</span>
          </a>

          <div className="hidden items-center gap-3 font-grotesk text-[11px] uppercase tracking-[0.3em] text-white/70 lg:flex" dir="ltr">
            <span className="h-2 w-2 rounded-full bg-signal animate-pulse-dot" />
            Cairo · New Cairo Showroom
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onToggleMode}
              data-cursor={sport ? 'اطفي السبورت' : 'شغّل السبورت'}
              aria-label={sport ? 'إيقاف وضع السبورت' : 'تفعيل وضع السبورت'}
              aria-pressed={sport}
              className={`flex items-center gap-2 border px-4 py-2 text-sm font-bold transition-all duration-300 ${
                sport
                  ? 'border-signal bg-signal text-white shadow-[0_0_22px_rgba(255,30,0,0.55)]'
                  : 'border-white/40 text-white hover:border-signal hover:text-signal'
              }`}
            >
              <Gauge size={15} className={sport ? 'animate-pulse' : ''} />
              <span className="hidden font-grotesk text-[11px] uppercase tracking-[0.2em] sm:inline" dir="ltr">Sport</span>
              {sport && <span className="h-1.5 w-1.5 rounded-full bg-white animate-pulse-dot" />}
            </button>
            <a
              href="tel:+201099687092"
              className="hidden items-center gap-2 border border-white/40 px-4 py-2 text-sm font-bold text-white transition-colors hover:bg-white hover:text-black md:flex"
              data-cursor="اتصل"
            >
              <Phone size={15} />
              <span dir="ltr">+20 109 968 7091</span>
            </a>
            <button
              onClick={() => setOpen(true)}
              className="flex items-center gap-2 bg-white px-4 py-2 text-sm font-black text-black"
              data-cursor="القايمة"
              aria-label="فتح القائمة"
            >
              <Menu size={17} />
              القايمة
            </button>
          </div>
        </div>
      </motion.header>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ clipPath: 'inset(0 0 100% 0)' }}
            animate={{ clipPath: 'inset(0 0 0% 0)' }}
            exit={{ clipPath: 'inset(0 0 100% 0)' }}
            transition={{ duration: 0.7, ease: [0.83, 0, 0.17, 1] }}
            className="noise fixed inset-0 z-[150] flex flex-col bg-carbon"
          >
            <div className="flex items-center justify-between px-6 py-5 md:px-12">
              <span className="font-display text-2xl text-bone" dir="ltr">
                ELSHAZLY<span className="text-signal">.</span>
              </span>
              <button
                onClick={() => setOpen(false)}
                className="flex items-center gap-2 border border-line px-4 py-2 text-sm font-bold text-bone hover:border-signal hover:text-signal"
                aria-label="إغلاق القائمة"
              >
                <X size={17} /> اقفل
              </button>
            </div>

            <nav className="flex flex-1 flex-col justify-center px-6 md:px-12">
              {links.map((l, i) => (
                <div key={l.href} className="overflow-hidden border-b border-line">
                  <motion.a
                    href={l.href}
                    onClick={() => setOpen(false)}
                    initial={{ y: '110%' }}
                    animate={{ y: 0 }}
                    transition={{ delay: 0.25 + i * 0.07, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                    className="group flex items-center justify-between py-3 md:py-4"
                    data-cursor="روح"
                  >
                    <span className="flex items-baseline gap-4">
                      <span className="font-grotesk text-xs text-signal" dir="ltr">
                        0{i + 1}
                      </span>
                      <span className="text-4xl font-black text-bone transition-all duration-300 group-hover:-translate-x-2 group-hover:text-signal md:text-6xl">
                        {l.ar}
                      </span>
                    </span>
                    <span className="flex items-center gap-3">
                      <span className="font-display text-lg tracking-widest text-dim" dir="ltr">
                        {l.en}
                      </span>
                      <ArrowUpLeft className="text-dim transition-all duration-300 group-hover:-translate-y-1 group-hover:text-signal" />
                    </span>
                  </motion.a>
                </div>
              ))}
            </nav>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7 }}
              className="flex flex-wrap items-center justify-between gap-3 px-6 pb-8 font-grotesk text-[11px] uppercase tracking-[0.3em] text-dim md:px-12"
              dir="ltr"
            >
              <span>Instagram — @elshazlymotors.eg</span>
              <span>Open daily 10AM — 12AM</span>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
