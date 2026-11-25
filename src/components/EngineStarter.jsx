import { useEffect, useRef, useState } from 'react';
import { Flame, Power, Zap } from 'lucide-react';

/**
 * Interactive engine starter with a PER-CAR synthesized voice.
 * The sound character is derived from the car's real engine:
 * cylinders set the firing frequency, V10/V12/flat-plane run brighter,
 * muscle V8s lope at idle, turbo cars whistle under boost and blow off
 * when you lift, superchargers whine, and the EV hums and sings.
 * All synthesized live with Web Audio — no audio files.
 */
const REDLINES = { hyper: 8500, super: 8200, sport: 7500, muscle: 6800, electric: 12000 };
const REDLINE_OVERRIDES = { corvette: 8600, challenger: 6200, supra: 6800 };
const IDLE = 950;

function engineProfile(car) {
  const e = car.engine || '';
  if (car.category === 'electric' || /Dual Motor|· EV/i.test(e)) {
    return { ev: true, cyl: 0, turbo: false, supercharged: false, bright: 1, lope: 0 };
  }
  let cyl = 8;
  if (/W16/.test(e)) cyl = 16;
  else if (/V12/.test(e)) cyl = 12;
  else if (/V10/.test(e)) cyl = 10;
  else if (/V6/.test(e)) cyl = 6;
  else if (/I6|2JZ/.test(e)) cyl = 6;
  const flatPlane = /Flat-Plane/i.test(e);
  return {
    ev: false,
    cyl,
    flatPlane,
    turbo: /Turbo|Biturbo/i.test(e),
    supercharged: /Supercharged/i.test(e),
    bright: cyl >= 10 || flatPlane ? 1.55 : cyl === 6 ? 1.15 : 0.9,
    lope: car.category === 'muscle' ? 1 : 0,
  };
}

export default function EngineStarter({ car, compact = false, onStateChange }) {
  const profile = engineProfile(car);
  const redline = REDLINE_OVERRIDES[car.id] || REDLINES[car.category] || 7500;
  const [phase, setPhase] = useState('off'); // off | cranking | on
  const [revving, setRevving] = useState(false);

  const audioRef = useRef(null);
  const simRef = useRef({ rpm: 0, revHold: false, phase: 'off', crankStart: 0 });
  const needleRef = useRef(null);
  const readoutRef = useRef(null);
  const wrapRef = useRef(null);

  /* ---------- audio graph ---------- */
  const buildAudio = () => {
    const Ctx = window.AudioContext || window.webkitAudioContext;
    if (!Ctx) return null;
    const ctx = new Ctx();
    const master = ctx.createGain();
    master.gain.value = 0;
    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.value = profile.ev ? 3200 : 420;
    filter.Q.value = 2;
    filter.connect(master);
    master.connect(ctx.destination);

    const osc1 = ctx.createOscillator();
    const osc2 = ctx.createOscillator();
    const sub = ctx.createOscillator();
    if (profile.ev) {
      osc1.type = 'sine'; osc2.type = 'triangle'; sub.type = 'sine';
    } else {
      osc1.type = 'sawtooth'; osc2.type = 'sawtooth'; osc2.detune.value = 9; sub.type = 'square';
    }
    const g1 = ctx.createGain(); g1.gain.value = 0.5;
    const g2 = ctx.createGain(); g2.gain.value = 0.28;
    const gSub = ctx.createGain(); gSub.gain.value = 0.4;
    osc1.connect(g1); g1.connect(filter);
    osc2.connect(g2); g2.connect(filter);
    sub.connect(gSub); gSub.connect(filter);

    // exhaust noise (skipped for EV)
    let bp = null;
    let noiseBuf = null;
    if (!profile.ev) {
      const len = ctx.sampleRate * 1.2;
      noiseBuf = ctx.createBuffer(1, len, ctx.sampleRate);
      const data = noiseBuf.getChannelData(0);
      for (let i = 0; i < len; i++) data[i] = Math.random() * 2 - 1;
      const noise = ctx.createBufferSource(); noise.buffer = noiseBuf; noise.loop = true;
      bp = ctx.createBiquadFilter(); bp.type = 'bandpass'; bp.frequency.value = 300; bp.Q.value = 0.8;
      const gNoise = ctx.createGain(); gNoise.gain.value = 0.12;
      noise.connect(bp); bp.connect(gNoise); gNoise.connect(filter);
      noise.start();
    }

    // turbo / supercharger whistle
    let whistle = null;
    let gWhistle = null;
    if (profile.turbo || profile.supercharged) {
      whistle = ctx.createOscillator(); whistle.type = 'sine'; whistle.frequency.value = 400;
      gWhistle = ctx.createGain(); gWhistle.gain.value = 0;
      whistle.connect(gWhistle); gWhistle.connect(ctx.destination);
      whistle.start();
    }

    osc1.start(); osc2.start(); sub.start();
    return { ctx, master, filter, osc1, osc2, sub, bp, whistle, gWhistle, noiseBuf };
  };

  const killAudio = () => {
    const a = audioRef.current;
    if (!a) return;
    try {
      a.master.gain.setTargetAtTime(0, a.ctx.currentTime, 0.05);
      if (a.gWhistle) a.gWhistle.gain.setTargetAtTime(0, a.ctx.currentTime, 0.03);
      const ctx = a.ctx;
      setTimeout(() => ctx.close().catch(() => {}), 220);
    } catch { /* already closed */ }
    audioRef.current = null;
  };

  /* blow-off valve: psssh when you lift off a boosted engine */
  const blowOff = () => {
    const a = audioRef.current;
    if (!a || !a.noiseBuf || simRef.current.rpm < 3600) return;
    try {
      const { ctx } = a;
      const src = ctx.createBufferSource(); src.buffer = a.noiseBuf;
      const bp = ctx.createBiquadFilter(); bp.type = 'bandpass'; bp.Q.value = 1.1;
      bp.frequency.setValueAtTime(2900, ctx.currentTime);
      bp.frequency.exponentialRampToValueAtTime(650, ctx.currentTime + 0.28);
      const g = ctx.createGain();
      g.gain.setValueAtTime(0.22, ctx.currentTime);
      g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.3);
      src.connect(bp); bp.connect(g); g.connect(ctx.destination);
      src.start(); src.stop(ctx.currentTime + 0.32);
    } catch { /* noop */ }
  };

  /* ---------- simulation loop ---------- */
  useEffect(() => {
    let raf;
    const loop = (t) => {
      const s = simRef.current;
      if (s.phase === 'cranking') {
        s.rpm = 260 + Math.sin(t / 55) * 70 + Math.random() * 30;
        if (t - s.crankStart > 650) {
          s.phase = 'on';
          setPhase('on');
        }
      } else if (s.phase === 'on') {
        const idleTarget = profile.ev ? 0 : IDLE;
        const target = s.revHold ? redline : idleTarget;
        const rate = s.revHold ? (profile.ev ? 0.09 : 0.055) : 0.035;
        s.rpm += (target - s.rpm) * rate;
        if (!s.revHold && !profile.ev) s.rpm += Math.sin(t / 90) * 6; // idle wobble
      } else {
        s.rpm += (0 - s.rpm) * 0.08;
      }

      const ratio = Math.max(0, Math.min(1, s.rpm / redline));
      if (needleRef.current) {
        needleRef.current.style.transform = `rotate(${-90 + ratio * 180}deg)`;
      }
      if (readoutRef.current) {
        readoutRef.current.textContent = Math.round(s.rpm).toLocaleString('en-US');
      }
      if (wrapRef.current) {
        wrapRef.current.dataset.hot = ratio > 0.78 ? 'true' : 'false';
      }

      const a = audioRef.current;
      if (a && s.phase !== 'off') {
        const now = a.ctx.currentTime;
        if (profile.ev) {
          const f = 55 + ratio * 980;
          a.osc1.frequency.setTargetAtTime(f, now, 0.03);
          a.osc2.frequency.setTargetAtTime(f * 2.02, now, 0.03);
          a.sub.frequency.setTargetAtTime(f / 2, now, 0.03);
          const vol = s.phase === 'on' ? 0.05 + ratio * 0.14 : 0;
          a.master.gain.setTargetAtTime(vol, now, 0.06);
        } else {
          const f = (s.rpm / 60) * (profile.cyl / 2) * 0.5; // firing fundamental
          a.osc1.frequency.setTargetAtTime(f, now, 0.03);
          a.osc2.frequency.setTargetAtTime(f * 1.5, now, 0.03);
          a.sub.frequency.setTargetAtTime(f / 2, now, 0.03);
          a.filter.frequency.setTargetAtTime((380 + ratio * 1600) * profile.bright, now, 0.05);
          if (a.bp) a.bp.frequency.setTargetAtTime(250 + ratio * 900, now, 0.05);
          let vol = s.phase === 'cranking' ? 0.1 : 0.14 + ratio * 0.1;
          if (profile.lope && s.phase === 'on') {
            vol *= 1 + 0.13 * Math.sin((t / 1000) * (s.rpm / 60) * Math.PI) * (1 - ratio);
          }
          a.master.gain.setTargetAtTime(vol, now, 0.06);
          if (a.whistle) {
            const wTarget = s.revHold && ratio > 0.2
              ? (profile.supercharged ? 500 + ratio * 1700 : 350 + ratio * ratio * 2600)
              : 300;
            a.whistle.frequency.setTargetAtTime(wTarget, now, 0.05);
            const wGain = s.revHold && ratio > 0.2
              ? (profile.supercharged ? 0.055 : 0.032) * ratio
              : 0;
            a.gWhistle.gain.setTargetAtTime(wGain, now, 0.07);
          }
        }
      }
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [redline, car.id]);

  useEffect(() => () => killAudio(), []);
  useEffect(() => {
    simRef.current.phase = 'off';
    simRef.current.revHold = false;
    setPhase('off');
    setRevving(false);
    killAudio();
    onStateChange?.(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [car.id]);

  const toggle = async () => {
    const s = simRef.current;
    if (s.phase === 'off') {
      if (!audioRef.current) audioRef.current = buildAudio();
      if (audioRef.current?.ctx.state === 'suspended') {
        try { await audioRef.current.ctx.resume(); } catch { /* headless */ }
      }
      if (profile.ev) {
        s.phase = 'on';
        setPhase('on');
      } else {
        s.phase = 'cranking';
        s.crankStart = performance.now();
        setPhase('cranking');
      }
      onStateChange?.(true);
      if (navigator.vibrate) navigator.vibrate(60);
    } else {
      s.phase = 'off';
      s.revHold = false;
      setPhase('off');
      setRevving(false);
      killAudio();
      onStateChange?.(false);
    }
  };

  const hold = (v) => {
    if (simRef.current.phase !== 'on') return;
    if (!v && simRef.current.revHold && profile.turbo) blowOff();
    simRef.current.revHold = v;
    setRevving(v);
    if (v && navigator.vibrate) navigator.vibrate(15);
  };

  const ticks = Array.from({ length: 13 }, (_, i) => i / 12);
  const voiceNote = profile.ev
    ? 'كهربا بالكامل — همهمة وصفارة موتور كهربائي'
    : profile.supercharged
      ? 'سوبرتشارجر — اسمع الصفير وانت دايس'
      : profile.turbo
        ? 'تيربو — اسمع الصفارة… ولما تسيب: بستشش 💨'
        : `${profile.cyl} سلندر بصوتها المتولّد حسب شخصية الموتور`;

  return (
    <div
      ref={wrapRef}
      data-hot="false"
      className={`border border-line bg-void/70 ${compact ? 'p-4' : 'p-5'} select-none`}
    >
      <div className="flex items-center justify-between gap-3">
        <h4 className="flex items-center gap-2 font-black text-bone">
          {profile.ev ? <Zap size={17} className="text-signal" /> : <Flame size={17} className="text-signal" />}
          {profile.ev ? 'شغّل الكهربا واسمع' : 'اسمع صوت الموتور'}
        </h4>
        <span className="font-grotesk text-[10px] uppercase tracking-[0.25em] text-dim" dir="ltr">
          {car.engine}
        </span>
      </div>

      <div className="mt-4 flex flex-col items-center gap-5 sm:flex-row">
        {/* gauge */}
        <div className="relative mx-auto w-40 shrink-0 sm:w-44" dir="ltr">
          <svg viewBox="0 0 200 120" className="w-full">
            <path d="M 20 105 A 85 85 0 0 1 180 105" fill="none" stroke="#26262c" strokeWidth="10" strokeLinecap="round" />
            <path
              d="M 20 105 A 85 85 0 0 1 180 105"
              fill="none" stroke="#ff4b1f" strokeWidth="10" strokeLinecap="round"
              strokeDasharray="267" strokeDashoffset="-213"
              opacity="0.9"
            />
            {ticks.map((r, i) => {
              const ang = (-90 + r * 180) * (Math.PI / 180);
              const x1 = 100 + Math.sin(ang) * 68, y1 = 105 - Math.cos(ang) * 68;
              const x2 = 100 + Math.sin(ang) * 76, y2 = 105 - Math.cos(ang) * 76;
              return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke={r > 0.8 ? '#ff4b1f' : '#5c594f'} strokeWidth="2" />;
            })}
          </svg>
          <div
            ref={needleRef}
            className="absolute bottom-[13px] left-1/2 h-[62px] w-[3px] origin-bottom rounded bg-bone shadow-[0_0_10px_rgba(255,75,31,0.7)]"
            style={{ transform: 'rotate(-90deg)', translate: '-50% 0' }}
          />
          <div className="absolute bottom-[6px] left-1/2 h-3.5 w-3.5 -translate-x-1/2 rounded-full border-2 border-smoke bg-bone" />
          <div className="absolute inset-x-0 bottom-[-16px] text-center">
            <span ref={readoutRef} className="font-display text-2xl text-bone">0</span>
            <span className="ml-1 font-grotesk text-[9px] uppercase tracking-[0.2em] text-dim">rpm</span>
          </div>
        </div>

        {/* controls */}
        <div className="flex w-full flex-1 flex-col items-stretch gap-3 pb-4">
          <button
            onClick={toggle}
            data-cursor={phase === 'off' ? 'دوّر' : 'بطّل'}
            className={`group flex min-h-12 items-center justify-center gap-2 rounded-full px-5 py-3.5 font-black transition-all duration-300 ${
              phase === 'off'
                ? 'bg-signal text-white hover:scale-[1.03]'
                : 'bg-bone text-void hover:bg-signal hover:text-white'
            }`}
          >
            <Power size={18} className={phase === 'cranking' ? 'animate-spin' : ''} />
            {phase === 'off'
              ? (profile.ev ? 'شغّل الكهربا' : 'دوّر الموتور')
              : phase === 'cranking' ? 'بيدوّر…' : 'بطّل'}
          </button>

          <button
            disabled={phase !== 'on'}
            onPointerDown={() => hold(true)}
            onPointerUp={() => hold(false)}
            onPointerLeave={() => hold(false)}
            onContextMenu={(e) => e.preventDefault()}
            data-cursor="بنزين"
            className={`min-h-12 touch-none rounded-full border px-5 py-3.5 font-black transition-all duration-150 ${
              phase !== 'on'
                ? 'border-line text-dim/40'
                : revving
                  ? 'scale-[1.04] border-signal bg-signal text-white shadow-[0_0_28px_rgba(255,75,31,0.45)]'
                  : 'border-bone/30 text-bone hover:border-signal hover:text-signal'
            }`}
          >
            {profile.ev ? 'دوس كهربا — امسك الزرار ⚡' : 'دوس بنزين — امسك الزرار 🏁'}
          </button>

          <p className="text-center text-xs leading-relaxed text-dim">
            {phase === 'off' && voiceNote}
            {phase === 'cranking' && 'المارش شغال… ثواني ويدور'}
            {phase === 'on' && (revving
              ? 'إيوه كده! خليك دايس'
              : profile.ev
                ? `جاهزة للانطلاق — الموتور بيلف لحد ${(redline / 1000).toFixed(0)} ألف`
                : `الموتور داير على السلانسيه — الردلاين عند ${(redline / 1000).toFixed(1)} ألف`)}
          </p>
        </div>
      </div>

      <style>{`[data-hot="true"]{animation:engshake .12s linear infinite}@keyframes engshake{0%{transform:translate(0,0)}25%{transform:translate(.6px,-.6px)}75%{transform:translate(-.6px,.6px)}100%{transform:translate(0,0)}}`}</style>
    </div>
  );
}
