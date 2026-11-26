import { useEffect, useRef, useState } from 'react';
import { Flame, Power, Zap } from 'lucide-react';
import { useLang } from '../i18n.jsx';

/**
 * Interactive engine starter with a PER-CAR synthesized voice.
 * The sound character is derived from the car's real engine:
 * cylinders set the firing frequency, V10/V12/flat-plane run brighter,
 * muscle V8s lope at idle, exhausts crackle on lift-off, turbo cars whistle under boost and blow off
 * when you lift, superchargers whine, and the EV hums and sings.
 * All synthesized live with Web Audio — no audio files.
 */
const REDLINES = { hyper: 8500, super: 8200, sport: 7500, muscle: 6800, electric: 12000 };
const REDLINE_OVERRIDES = { corvette: 8600, challenger: 6200, supra: 6800 };
const IDLE = 950;

/* Hand-tuned VOICE per car, derived from its real engine: idle speed,
   idle lope (the lumpy cam chop of muscle V8s), how fast it revs,
   exhaust crackle on lift-off, a scream harmonic for V10 / V12 /
   flat-plane engines, turbo & supercharger whistle and blow-off
   weight, sub-bass, brightness, starter-crank length — plus the
   bilingual note shown to visitors. No two cars share a voice. */
const VOICES = {
  chiron:      { idle: 900,  lope: 0.03, revMul: 0.90, crackle: 0,    harm: 0,    subMul: 1.5,  whistleMul: 1.15, brightMul: 0.9,  crankMs: 800, sig: { ar: 'هدير W16 بأربعة تيربو — قوة هادية ومرعبة', en: 'W16 quad-turbo rumble — calm, terrifying power' } },
  laferrari:   { idle: 1000, lope: 0.02, revMul: 1.35, crackle: 0.25, harm: 0.16, brightMul: 1.3, crankMs: 600, sig: { ar: 'أوبرا V12 من مارانيلو', en: 'A V12 opera from Maranello' } },
  huracan:     { idle: 1050, lope: 0.04, revMul: 1.40, crackle: 0.50, harm: 0.15, brightMul: 1.3, crankMs: 550, sig: { ar: 'صرخة V10 إيطالية لحد آخر نفس', en: 'Italian V10 scream to the last breath' } },
  'audi-r8':   { idle: 1000, lope: 0.04, revMul: 1.35, crackle: 0.45, harm: 0.17, brightMul: 1.4, crankMs: 550, sig: { ar: 'أعلى صرخة V10 في التشكيلة', en: 'The highest V10 scream in the collection' } },
  '720s':      { idle: 950,  lope: 0.03, revMul: 1.45, crackle: 0.20, harm: 0.08, whistleMul: 1.2, brightMul: 1.1, crankMs: 550, sig: { ar: 'توين تيربو بريطاني حاد كالموس', en: 'British twin-turbo, sharp as a razor' } },
  corvette:    { idle: 900,  lope: 0.03, revMul: 1.40, crackle: 0.30, harm: 0.15, brightMul: 1.25, detune: 10, crankMs: 600, sig: { ar: 'فلات بلين بيغني لحد 8,600 لفة', en: 'Flat-plane crank singing to 8,600 rpm' } },
  'amg-gtr':   { idle: 850,  lope: 0.10, revMul: 1.00, crackle: 0.85, harm: 0,    subMul: 1.3, crankMs: 700, sig: { ar: 'زئير AMG العميق… وفرقعات عادم ما بترحمش', en: 'Deep AMG growl — and exhaust crackle with no mercy' } },
  'amg-gt':    { idle: 875,  lope: 0.09, revMul: 1.00, crackle: 0.70, harm: 0,    subMul: 1.3, brightMul: 1.05, crankMs: 700, sig: { ar: 'بيتوربو بيتنفس تقيل وبيزأر', en: 'Biturbo breathing heavy, roaring' } },
  m5:          { idle: 900,  lope: 0.06, revMul: 1.05, crackle: 0.40, harm: 0,    whistleMul: 1.1, subMul: 1.15, crankMs: 650, sig: { ar: 'V8 ألماني منضبط… لحد ما تدوس', en: 'Disciplined German V8 — until you floor it' } },
  panamera:    { idle: 850,  lope: 0.04, revMul: 0.95, crackle: 0.15, harm: 0,    brightMul: 0.95, subMul: 1.1, crankMs: 650, sig: { ar: 'فخامة هادية بصوت V8 واثق', en: 'Quiet luxury, confident V8 voice' } },
  mustang:     { idle: 800,  lope: 0.22, revMul: 0.90, crackle: 0.55, harm: 0,    subMul: 1.35, crankMs: 750, sig: { ar: 'لوب الكويوتي الأمريكاني الأصلي على ٨٠٠ لفة', en: 'Original Coyote lope, idling low at 800 rpm' } },
  camaro:      { idle: 825,  lope: 0.26, revMul: 0.88, crackle: 0.60, harm: 0,    subMul: 1.3, crankMs: 750, sig: { ar: 'LT1 بيلوب وهو واقف وبيفرقع لما ترفع رجلك', en: 'LT1 loping at idle, popping when you lift' } },
  challenger:  { idle: 775,  lope: 0.30, revMul: 0.80, crackle: 0.50, harm: 0,    scMul: 2.0, subMul: 1.3, crankMs: 800, sig: { ar: 'واين السوبرتشارجير الشيطاني فوق هدير الهيمي', en: 'Demonic supercharger whine over HEMI thunder' } },
  m440i:       { idle: 900,  lope: 0.03, revMul: 1.10, crackle: 0.25, harm: 0.03, whistleMul: 1.25, crankMs: 600, sig: { ar: 'ستة سلندر B58 بصافرة تيربو ناعمة', en: 'B58 straight-six with a smooth turbo whistle' } },
  m4:          { idle: 950,  lope: 0.05, revMul: 1.15, crackle: 0.65, harm: 0.05, whistleMul: 1.3, detune: 6, crankMs: 600, sig: { ar: 'S58 توين تيربو شرّاس — بربل وفرقعات على الرفعة', en: 'S58 twin-turbo — angry burbles on lift-off' } },
  gtr:         { idle: 950,  lope: 0.05, revMul: 1.20, crackle: 0.30, harm: 0.04, whistleMul: 1.6, bovMul: 1.7, crankMs: 600, sig: { ar: 'جودزيلا: تيربوهات بتصفّر وبلو أوف بيعلن الحرب', en: 'Godzilla: whistling turbos, war-declaring blow-off' } },
  supra:       { idle: 900,  lope: 0.06, revMul: 1.00, crackle: 0.35, harm: 0.03, whistleMul: 2.3, bovMul: 2.5, spool: true, brightMul: 1.1, crankMs: 650, sig: { ar: 'الأسطورة 2JZ: سبول التيربو… وبعده البلو أوف بيهز الشارع', en: 'The legendary 2JZ: turbo spool… then a street-shaking blow-off' } },
  taycan:      { sig: { ar: 'همهمة كهربا من المستقبل… ونقلة الجيربوكس مسموعة', en: 'An electric hum from the future — hear the two-speed shift' } },
};

function engineProfile(car) {
  const e = car.engine || '';
  const v = VOICES[car.id] || {};
  if (car.category === 'electric' || /Dual Motor|· EV/i.test(e)) {
    return { ev: true, cyl: 0, turbo: false, supercharged: false, bright: 1, idle: 0, lopeAmp: 0, revMul: 1, crackle: 0, harm: 0, harmMul: 3, crankMs: 0, sig: v.sig };
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
    bright: (cyl >= 10 || flatPlane ? 1.55 : cyl === 6 ? 1.15 : 0.9) * (v.brightMul || 1),
    idle: v.idle || IDLE,
    lopeAmp: v.lope ?? (car.category === 'muscle' ? 0.18 : 0.03),
    revMul: v.revMul || 1,
    crackle: v.crackle || 0,
    harm: v.harm || 0,
    harmMul: cyl === 10 ? 2.5 : 3,
    crankMs: v.crankMs || 650,
    sig: v.sig,
    whistleMul: v.whistleMul || 1,
    bovMul: v.bovMul || 1,
    subMul: v.subMul || 1,
    scMul: v.scMul || 1,
    spool: !!v.spool,
    detune: v.detune || 0,
  };
}

export default function EngineStarter({ car, compact = false, onStateChange }) {
  const { t, lang } = useLang();
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
      osc1.type = 'sawtooth'; osc2.type = 'sawtooth'; osc2.detune.value = 9 + (profile.detune || 0); sub.type = 'square';
    }
    const g1 = ctx.createGain(); g1.gain.value = 0.5;
    const g2 = ctx.createGain(); g2.gain.value = 0.28;
    const gSub = ctx.createGain(); gSub.gain.value = 0.4 * (profile.subMul || 1);
    osc1.connect(g1); g1.connect(filter);
    osc2.connect(g2); g2.connect(filter);
    sub.connect(gSub); gSub.connect(filter);

    // scream harmonic (V10 / V12 / flat-plane shriek) — silent elsewhere
    const osc3 = ctx.createOscillator(); osc3.type = 'sawtooth';
    const g3 = ctx.createGain(); g3.gain.value = 0;
    osc3.connect(g3); g3.connect(filter);

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

    osc1.start(); osc2.start(); sub.start(); osc3.start();
    return { ctx, master, filter, osc1, osc2, sub, osc3, g3, bp, whistle, gWhistle, noiseBuf };
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
      g.gain.setValueAtTime(0.22 * (profile.bovMul || 1), ctx.currentTime);
      g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.3);
      src.connect(bp); bp.connect(g); g.connect(ctx.destination);
      src.start(); src.stop(ctx.currentTime + 0.32);
    } catch { /* noop */ }
  };

  /* one exhaust pop — a short, harsh noise snap */
  const pop = (intensity = 1) => {
    const a = audioRef.current;
    if (!a || !a.noiseBuf) return;
    try {
      const { ctx } = a;
      const src = ctx.createBufferSource(); src.buffer = a.noiseBuf;
      src.playbackRate.value = 0.7 + Math.random() * 0.7;
      const bp = ctx.createBiquadFilter(); bp.type = 'bandpass'; bp.Q.value = 0.9;
      bp.frequency.value = 750 + Math.random() * 1500;
      const g = ctx.createGain();
      const t0 = ctx.currentTime;
      g.gain.setValueAtTime(0.0001, t0);
      g.gain.exponentialRampToValueAtTime(Math.max(0.02, 0.3 * intensity), t0 + 0.008);
      g.gain.exponentialRampToValueAtTime(0.001, t0 + 0.07 + Math.random() * 0.05);
      src.connect(bp); bp.connect(g); g.connect(ctx.destination);
      src.start(); src.stop(t0 + 0.16);
    } catch { /* noop */ }
  };

  /* a ragged burst of pops when you lift off a crackly exhaust */
  const crackleBurst = () => {
    const n = 3 + Math.floor(Math.random() * 4);
    for (let i = 0; i < n; i++) {
      setTimeout(() => pop(0.45 + Math.random() * 0.55), 40 + i * (55 + Math.random() * 85));
    }
  };

  /* ---------- simulation loop ---------- */
  useEffect(() => {
    let raf;
    const loop = (t) => {
      const s = simRef.current;
      if (s.phase === 'cranking') {
        s.rpm = 260 + Math.sin(t / 55) * 70 + Math.random() * 30;
        if (t - s.crankStart > (profile.crankMs || 650)) {
          s.phase = 'on';
          setPhase('on');
        }
      } else if (s.phase === 'on') {
        const idleTarget = profile.ev ? 0 : profile.idle;
        const target = s.revHold ? redline : idleTarget;
        const rate = s.revHold ? (profile.ev ? 0.09 : 0.055 * (profile.revMul || 1)) : 0.035;
        s.rpm += (target - s.rpm) * rate;
        if (!s.revHold && !profile.ev) s.rpm += Math.sin(t / 90) * 6; // idle wobble
        s.spool = (s.spool ?? 0) + ((s.rpm / redline) - (s.spool ?? 0)) * 0.04; // turbo spool lags the revs
      } else if (s.phase === 'stopping') {
        s.rpm += (0 - s.rpm) * (profile.ev ? 0.06 : 0.036);
        if (!profile.ev && s.rpm < 850 && s.rpm > 70) s.rpm += (Math.random() - 0.62) * 42; // dying stumble
        s.spool = Math.max(0, (s.spool ?? 0) - 0.011); // turbo spins down slowly after key-off
        if (s.rpm / redline < 0.012 && (!(profile.turbo || profile.supercharged) || (s.spool ?? 0) < 0.05)) {
          s.phase = 'off';
          setPhase('off');
          killAudio();
          onStateChange?.(false);
        }
      } else {
        s.rpm += (0 - s.rpm) * 0.08;
      }

      const ratio = Math.max(0, Math.min(1, s.rpm / redline));
      const shown = Math.round(s.rpm);
      if (shown !== s._shown) {
        s._shown = shown;
        if (needleRef.current) {
          needleRef.current.style.transform = `rotate(${-90 + ratio * 180}deg)`;
        }
        if (readoutRef.current) {
          readoutRef.current.textContent = shown.toLocaleString('en-US');
        }
      }
      if (wrapRef.current) {
        wrapRef.current.dataset.hot = ratio > 0.78 ? 'true' : 'false';
      }

      const a = audioRef.current;
      if (a && s.phase !== 'off') {
        const now = a.ctx.currentTime;
        if (profile.ev) {
          const shift = ratio > 0.55 ? 1.16 : 1; // the Taycan's two-speed box steps the whine up
          const f = (55 + ratio * 980) * shift;
          a.osc1.frequency.setTargetAtTime(f, now, 0.03);
          a.osc2.frequency.setTargetAtTime(f * 2.02, now, 0.03);
          a.sub.frequency.setTargetAtTime(f / 2, now, 0.03);
          const vol = s.phase === 'on' || s.phase === 'stopping' ? 0.05 + ratio * 0.14 : 0;
          a.master.gain.setTargetAtTime(vol, now, 0.06);
        } else {
          const f = (s.rpm / 60) * (profile.cyl / 2) * 0.5; // firing fundamental
          a.osc1.frequency.setTargetAtTime(f, now, 0.03);
          a.osc2.frequency.setTargetAtTime(f * 1.5, now, 0.03);
          a.sub.frequency.setTargetAtTime(f / 2, now, 0.03);
          if (a.osc3) {
            a.osc3.frequency.setTargetAtTime(f * (profile.harmMul || 3), now, 0.03);
            a.g3.gain.setTargetAtTime((profile.harm || 0) * Math.pow(ratio, 1.4), now, 0.06);
          }
          a.filter.frequency.setTargetAtTime((380 + ratio * 1600) * profile.bright, now, 0.05);
          if (a.bp) a.bp.frequency.setTargetAtTime(250 + ratio * 900, now, 0.05);
          let vol = s.phase === 'cranking' ? 0.1 : 0.14 + ratio * 0.1;
          if (s.phase === 'stopping') {
            vol *= 0.35 + ratio * 0.75;
            if (s.rpm < 900) vol *= 1 - 0.45 * Math.max(0, Math.sin(t / 110)) * Math.max(0.3, 1 - ratio * 3); // cough dips
          }
          if (profile.lopeAmp && s.phase === 'on') {
            vol *= 1 + profile.lopeAmp * Math.sin((t / 1000) * (s.rpm / 60) * Math.PI) * Math.max(0, 1 - ratio * 2.2);
          }
          if (profile.crackle && s.revHold && ratio > 0.72 && Math.random() < profile.crackle * 0.012) {
            pop(0.4 + Math.random() * 0.5); // overrun pops while you hold it high
          }
          a.master.gain.setTargetAtTime(vol, now, 0.06);
          if (a.whistle) {
            if (s.phase === 'stopping') {
              const sp = s.spool ?? 0;
              a.whistle.frequency.setTargetAtTime(300 + sp * sp * 2400, now, 0.08);
              a.gWhistle.gain.setTargetAtTime(0.03 * (profile.supercharged ? (profile.scMul || 1) : (profile.whistleMul || 1)) * sp, now, 0.08);
            } else {
            const wTarget = s.revHold && ratio > 0.2
              ? profile.spool
                ? 300 + Math.pow(ratio, 1.35) * 3300
                : (profile.supercharged ? 500 + ratio * 1700 : 350 + ratio * ratio * 2600)
              : 300;
            a.whistle.frequency.setTargetAtTime(wTarget, now, profile.spool ? 0.12 : 0.05);
            const wGain = s.revHold && ratio > 0.2
              ? (profile.supercharged ? 0.055 * (profile.scMul || 1) : 0.032 * (profile.whistleMul || 1)) * ratio
              : 0;
            a.gWhistle.gain.setTargetAtTime(wGain, now, 0.07);
            }
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
    } else if (s.phase === 'on') {
      // shutdown: the engine winds down, stumbles and dies — and a
      // turbo keeps spooling down after the key is off
      s.phase = 'stopping';
      s.revHold = false;
      setPhase('stopping');
      setRevving(false);
      if (navigator.vibrate) navigator.vibrate(25);
    } else if (s.phase === 'cranking') {
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
    if (!v && simRef.current.revHold) {
      if (profile.turbo) blowOff();
      if (profile.crackle && simRef.current.rpm > 3600) crackleBurst();
    }
    simRef.current.revHold = v;
    setRevving(v);
    if (v && navigator.vibrate) navigator.vibrate(15);
  };

  const ticks = Array.from({ length: 13 }, (_, i) => i / 12);
  const voiceNote = profile.sig
    ? profile.sig[lang] || profile.sig.en
    : profile.ev
    ? t('eng.voiceEv')
    : profile.supercharged
      ? t('eng.voiceSc')
      : profile.turbo
        ? t('eng.voiceTurbo')
        : t('eng.voiceCyl', { cyl: profile.cyl });

  return (
    <div
      ref={wrapRef}
      data-hot="false"
      className={`border border-line bg-void/70 ${compact ? 'p-4' : 'p-5'} select-none`}
    >
      <div className="flex items-center justify-between gap-3">
        <h4 className="flex items-center gap-2 font-black text-bone">
          {profile.ev ? <Zap size={17} className="text-signal" /> : <Flame size={17} className="text-signal" />}
          {profile.ev ? t('eng.listenEv') : t('eng.listen')}
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
            style={{ transform: 'rotate(-90deg)', translate: '-50% 0', transition: 'transform .22s cubic-bezier(0.22, 1, 0.36, 1)' }}
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
            data-cursor={phase === 'off' ? t('eng.cursorStart') : t('eng.cursorStop')}
            className={`group flex min-h-12 items-center justify-center gap-2 rounded-full px-5 py-3.5 font-black transition-all duration-300 ${
              phase === 'off'
                ? 'bg-signal text-white hover:scale-[1.03]'
                : 'bg-bone text-void hover:bg-signal hover:text-white'
            }`}
          >
            <Power size={18} className={phase === 'cranking' ? 'animate-spin' : ''} />
            {phase === 'off'
              ? (profile.ev ? t('eng.startEv') : t('eng.start'))
              : phase === 'cranking' ? t('eng.cranking') : phase === 'stopping' ? t('eng.stopping') : t('eng.stop')}
          </button>

          <button
            disabled={phase !== 'on'}
            onPointerDown={() => hold(true)}
            onPointerUp={() => hold(false)}
            onPointerLeave={() => hold(false)}
            onContextMenu={(e) => e.preventDefault()}
            data-cursor={t('eng.cursorGas')}
            className={`min-h-12 touch-none rounded-full border px-5 py-3.5 font-black transition-all duration-150 ${
              phase !== 'on'
                ? 'border-line text-dim/40'
                : revving
                  ? 'scale-[1.04] border-signal bg-signal text-white shadow-[0_0_28px_rgba(255,75,31,0.45)]'
                  : 'border-bone/30 text-bone hover:border-signal hover:text-signal'
            }`}
          >
            {profile.ev ? t('eng.holdEv') : t('eng.hold')}
          </button>

          <p className="text-center text-xs leading-relaxed text-dim">
            {phase === 'off' && voiceNote}
            {phase === 'cranking' && t('eng.crankMsg')}
            {phase === 'on' && (revving
              ? t('eng.keepMsg')
              : profile.ev
                ? t('eng.readyMsg', { k: (redline / 1000).toFixed(0) })
                : t('eng.idleMsg', { k: (redline / 1000).toFixed(1) }))}
          </p>
        </div>
      </div>

      <style>{`[data-hot="true"]{animation:engshake .12s linear infinite}@keyframes engshake{0%{transform:translate(0,0)}25%{transform:translate(.6px,-.6px)}75%{transform:translate(-.6px,.6px)}100%{transform:translate(0,0)}}`}</style>
    </div>
  );
}
