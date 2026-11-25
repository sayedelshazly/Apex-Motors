/**
 * Synthesized exhaust burst for SPORT mode — a double rev blip when the
 * mode engages, a low blip when it disengages. Pure Web Audio, no files.
 */
export function playRev(on = true) {
  try {
    const Ctx = window.AudioContext || window.webkitAudioContext;
    if (!Ctx) return;
    const ctx = new Ctx();
    const t = ctx.currentTime;

    const master = ctx.createGain();
    master.gain.value = 0;
    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.value = 520;
    filter.Q.value = 2;
    filter.connect(master);
    master.connect(ctx.destination);

    const saw = ctx.createOscillator(); saw.type = 'sawtooth';
    const sub = ctx.createOscillator(); sub.type = 'square';
    const g1 = ctx.createGain(); g1.gain.value = 0.5;
    const g2 = ctx.createGain(); g2.gain.value = 0.35;
    saw.connect(g1); g1.connect(filter);
    sub.connect(g2); g2.connect(filter);

    const len = ctx.sampleRate;
    const buf = ctx.createBuffer(1, len, ctx.sampleRate);
    const d = buf.getChannelData(0);
    for (let i = 0; i < len; i++) d[i] = Math.random() * 2 - 1;
    const noise = ctx.createBufferSource(); noise.buffer = buf; noise.loop = true;
    const bp = ctx.createBiquadFilter(); bp.type = 'bandpass'; bp.frequency.value = 420; bp.Q.value = 0.7;
    const gn = ctx.createGain(); gn.gain.value = 0.14;
    noise.connect(bp); bp.connect(gn); gn.connect(filter);

    const F = (rpm) => (rpm / 60) * 2; // V8-ish firing fundamental

    if (on) {
      const pts = [[0.42, 5400], [0.56, 1700], [0.98, 6100], [1.5, 950]];
      saw.frequency.setValueAtTime(F(900), t);
      sub.frequency.setValueAtTime(F(900) / 2, t);
      pts.forEach(([dt, rpm]) => {
        saw.frequency.exponentialRampToValueAtTime(F(rpm), t + dt);
        sub.frequency.exponentialRampToValueAtTime(F(rpm) / 2, t + dt);
      });
      filter.frequency.setValueAtTime(520, t);
      filter.frequency.exponentialRampToValueAtTime(2400, t + 0.42);
      filter.frequency.exponentialRampToValueAtTime(900, t + 0.56);
      filter.frequency.exponentialRampToValueAtTime(2600, t + 0.98);
      filter.frequency.exponentialRampToValueAtTime(620, t + 1.5);
      master.gain.setValueAtTime(0, t);
      master.gain.linearRampToValueAtTime(0.22, t + 0.06);
      master.gain.setValueAtTime(0.22, t + 1.25);
      master.gain.exponentialRampToValueAtTime(0.001, t + 1.6);
      saw.start(t); sub.start(t); noise.start(t);
      saw.stop(t + 1.65); sub.stop(t + 1.65); noise.stop(t + 1.65);
      setTimeout(() => ctx.close().catch(() => {}), 1900);
    } else {
      saw.frequency.setValueAtTime(F(1500), t);
      saw.frequency.exponentialRampToValueAtTime(F(480), t + 0.3);
      sub.frequency.setValueAtTime(F(1500) / 2, t);
      sub.frequency.exponentialRampToValueAtTime(F(480) / 2, t + 0.3);
      master.gain.setValueAtTime(0, t);
      master.gain.linearRampToValueAtTime(0.15, t + 0.04);
      master.gain.exponentialRampToValueAtTime(0.001, t + 0.42);
      saw.start(t); sub.start(t); noise.start(t);
      saw.stop(t + 0.48); sub.stop(t + 0.48); noise.stop(t + 0.48);
      setTimeout(() => ctx.close().catch(() => {}), 750);
    }
  } catch { /* audio unavailable */ }
}
