/**
 * Mechanical switch click for SPORT mode — a snappy tick plus a low
 * thump, synthesized live. Shares one AudioContext across clicks.
 */
let ctx = null;

export function playClick() {
  try {
    const Ctx = window.AudioContext || window.webkitAudioContext;
    if (!Ctx) return;
    ctx = ctx || new Ctx();
    if (ctx.state === 'suspended') ctx.resume();
    const t = ctx.currentTime;

    // tick
    const osc = ctx.createOscillator();
    osc.type = 'square';
    osc.frequency.setValueAtTime(2100, t);
    osc.frequency.exponentialRampToValueAtTime(280, t + 0.03);
    const g = ctx.createGain();
    g.gain.setValueAtTime(0.055, t);
    g.gain.exponentialRampToValueAtTime(0.001, t + 0.045);
    osc.connect(g); g.connect(ctx.destination);
    osc.start(t); osc.stop(t + 0.05);

    // thump
    const thump = ctx.createOscillator();
    thump.type = 'sine';
    thump.frequency.setValueAtTime(165, t);
    thump.frequency.exponentialRampToValueAtTime(55, t + 0.06);
    const g2 = ctx.createGain();
    g2.gain.setValueAtTime(0.1, t);
    g2.gain.exponentialRampToValueAtTime(0.001, t + 0.075);
    thump.connect(g2); g2.connect(ctx.destination);
    thump.start(t); thump.stop(t + 0.08);
  } catch { /* audio unavailable */ }
}
