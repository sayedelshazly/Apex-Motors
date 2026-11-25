import { useState } from 'react';
import { AtSign, Check, Copy, MapPin, Phone } from 'lucide-react';
import { Reveal } from './Reveal';
import { useLang } from '../i18n.jsx';
import Logo from './Logo';

export default function Footer() {
  const { t } = useLang();
  const [copied, setCopied] = useState('');
  const copy = async (key, value) => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(key);
      setTimeout(() => setCopied(''), 1500);
    } catch { /* clipboard unavailable — the link itself still works */ }
  };
  const pill = 'group inline-flex items-center gap-2.5 rounded-full border border-line/70 bg-white/[0.03] py-1.5 pe-2 ps-1.5 backdrop-blur transition-all duration-300 hover:-translate-y-0.5 hover:border-signal/70';
  const chip = 'flex h-7 w-7 items-center justify-center rounded-full bg-signal/15 text-signal transition-colors duration-300 group-hover:bg-signal group-hover:text-white';
  const copyBtn = 'flex h-7 w-7 items-center justify-center rounded-full text-dim transition-colors hover:bg-white/10 hover:text-bone';
  return (
    <footer id="contact" className="relative overflow-hidden">
      {/* CTA */}
      <div className="px-6 py-24 text-center md:px-12 md:py-32">
        <Reveal>
          <p className="font-grotesk text-[11px] uppercase tracking-[0.35em] text-signal" dir="ltr">Have a beast in mind?</p>
          <h2 className="mx-auto mt-5 max-w-4xl text-5xl font-black leading-[1.1] text-bone md:text-7xl">
            {t('ft.titleA')}
            <br />
            <span className="text-stroke-signal font-display tracking-wide" dir="ltr">WAITING FOR YOU</span>
          </h2>
          <p className="mx-auto mt-6 max-w-lg leading-relaxed text-dim">
            {t('ft.body')}
          </p>
          <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
            <a href="#testdrive" className="rounded-full bg-signal px-8 py-4 font-black text-white transition-transform hover:scale-105" data-cursor={t('ft.lets')}>
              {t('ft.book')}
            </a>
            <a href="https://wa.me/201099687091" target="_blank" rel="noreferrer" className="rounded-full border border-line px-8 py-4 font-black text-bone transition-colors hover:border-signal hover:text-signal" data-cursor={t('ft.wa')}>
              {t('ft.wa')}
            </a>
          </div>
        </Reveal>
      </div>

      {/* giant wordmark */}
      <div className="flex justify-center pb-3">
        <Logo className="h-14 w-14 text-bone" />
      </div>
      <div className="select-none px-2" dir="ltr" aria-hidden>
        <div className="text-stroke-faint whitespace-nowrap text-center font-display text-[16.5vw] leading-[0.78]">
          ELSHAZLY
        </div>
      </div>

      <div className="border-t border-line px-6 py-8 md:px-12">
        <div className="flex flex-wrap items-center justify-between gap-5 text-sm text-dim">
          <span className="flex items-center gap-2">
            <MapPin size={15} className="text-signal" />
            {t('ft.addr')}
          </span>
          <span className={pill} dir="ltr">
            <a href="tel:+201099687091" className="flex items-center gap-2.5">
              <span className={chip}><Phone size={13} /></span>
              <span className="font-grotesk tracking-wider text-bone/90">+20 109 968 7091</span>
            </a>
            <button type="button" onClick={() => copy('phone', '+201099687091')} className={copyBtn} aria-label="copy phone">
              {copied === 'phone' ? <Check size={13} className="text-signal" /> : <Copy size={13} />}
            </button>
          </span>
          <span className={pill} dir="ltr">
            <a href="https://instagram.com/elshazlymotors.eg" target="_blank" rel="noreferrer" className="flex items-center gap-2.5">
              <span className={chip}><AtSign size={13} /></span>
              <span className="font-grotesk tracking-wider text-bone/90">elshazlymotors.eg</span>
            </a>
            <button type="button" onClick={() => copy('mail', 'elshazlymotors.eg')} className={copyBtn} aria-label="copy handle">
              {copied === 'mail' ? <Check size={13} className="text-signal" /> : <Copy size={13} />}
            </button>
          </span>
        </div>
        <p className="mt-6 text-center font-grotesk text-[11px] uppercase tracking-[0.3em] text-dim/70" dir="ltr">
          © 2026 Apex Motors — Not just browsing cars. Experiencing speed.
        </p>
      </div>
    </footer>
  );
}
