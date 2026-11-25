import { useEffect, useRef } from 'react';

/**
 * SPORT mode scroll effects: the faster you scroll, the harder the
 * exhausts at the bottom corners spit flames and sparks, and speed
 * lines streak past. One canvas, one rAF loop, velocity-driven.
 */
export default function SportScrollFx() {
  const canvasRef = useRef(null);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let W = 0;
    let H = 0;
    const resize = () => {
      W = canvas.width = window.innerWidth;
      H = canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    let lastY = window.scrollY;
    let vel = 0; // smoothed px/frame
    const sparks = [];
    const lines = [];
    let raf;

    const loop = () => {
      const y = window.scrollY;
      const dy = Math.abs(y - lastY);
      lastY = y;
      vel += (dy - vel) * 0.18; // smooth like a needle
      const intensity = Math.max(0, Math.min(1, vel / 55));

      ctx.clearRect(0, 0, W, H);

      if (intensity > 0.04) {
        const anchors = [52, W - 52];
        const baseY = H - 6;

        /* exhaust flames — layered glow, flickering with intensity */
        for (const ax of anchors) {
          const flick = 0.82 + Math.random() * 0.36;
          const R = (46 + intensity * 95) * flick;
          const g = ctx.createRadialGradient(ax, baseY, 0, ax, baseY, R);
          g.addColorStop(0, `rgba(140, 190, 255, ${0.75 * intensity})`); // blue core
          g.addColorStop(0.35, `rgba(255, 110, 30, ${0.55 * intensity})`);
          g.addColorStop(0.7, `rgba(255, 45, 0, ${0.28 * intensity})`);
          g.addColorStop(1, 'rgba(255, 45, 0, 0)');
          ctx.fillStyle = g;
          ctx.beginPath();
          ctx.ellipse(ax, baseY, R * 1.25, R * 0.52, 0, 0, Math.PI * 2);
          ctx.fill();
        }

        /* sparks */
        const spawn = Math.round(intensity * 7);
        for (let i = 0; i < spawn; i++) {
          const ax = anchors[Math.random() < 0.5 ? 0 : 1];
          sparks.push({
            x: ax + (Math.random() - 0.5) * 26,
            y: baseY - Math.random() * 6,
            vx: (Math.random() - 0.5) * 1.6,
            vy: -(1.2 + Math.random() * 3.4) * (0.5 + intensity),
            life: 1,
            decay: 0.012 + Math.random() * 0.03,
            size: 1 + Math.random() * 2.2,
            hue: 18 + Math.random() * 38,
          });
        }
        for (let i = sparks.length - 1; i >= 0; i--) {
          const s = sparks[i];
          s.x += s.vx;
          s.y += s.vy;
          s.vy -= 0.012; // sparks keep rising a touch
          s.vx *= 0.985;
          s.life -= s.decay;
          if (s.life <= 0) { sparks.splice(i, 1); continue; }
          ctx.globalAlpha = Math.max(0, s.life) * 0.95;
          ctx.fillStyle = `hsl(${s.hue} 100% ${55 + s.life * 20}%)`;
          ctx.shadowColor = 'rgba(255,120,20,0.9)';
          ctx.shadowBlur = 6;
          ctx.beginPath();
          ctx.arc(s.x, s.y, s.size * s.life + 0.4, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.globalAlpha = 1;
        ctx.shadowBlur = 0;
        if (sparks.length > 220) sparks.splice(0, sparks.length - 220);

        /* speed lines — vertical streaks rushing upward */
        if (intensity > 0.3) {
          const want = Math.round((intensity - 0.3) * 22);
          while (lines.length < want) {
            lines.push({
              x: Math.random() * W,
              y: Math.random() * H,
              len: 60 + Math.random() * 190 * intensity,
              sp: 14 + Math.random() * 26,
              w: Math.random() < 0.85 ? 1 : 2,
            });
          }
          ctx.strokeStyle = 'rgba(255, 235, 220, 0.5)';
          for (let i = lines.length - 1; i >= 0; i--) {
            const L = lines[i];
            L.y -= L.sp * (0.4 + intensity);
            if (L.y + L.len < 0) { lines.splice(i, 1); continue; }
            ctx.lineWidth = L.w;
            ctx.globalAlpha = 0.05 + intensity * 0.16;
            ctx.beginPath();
            ctx.moveTo(L.x, L.y);
            ctx.lineTo(L.x, L.y + L.len);
            ctx.stroke();
          }
          ctx.globalAlpha = 1;
        } else {
          lines.length = 0;
        }
      } else {
        sparks.length = 0;
        lines.length = 0;
      }

      canvas.dataset.intensity = intensity.toFixed(2);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none fixed inset-0 z-[85]"
      aria-hidden
    />
  );
}
