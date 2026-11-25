import { useEffect, useRef } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';

export default function Cursor() {
  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const ringX = useSpring(x, { stiffness: 170, damping: 21, mass: 0.7 });
  const ringY = useSpring(y, { stiffness: 170, damping: 21, mass: 0.7 });
  const ringRef = useRef(null);
  const labelRef = useRef(null);

  useEffect(() => {
    if (window.matchMedia('(pointer: coarse)').matches) return;
    const move = (e) => {
      x.set(e.clientX);
      y.set(e.clientY);
      const t = e.target.closest('[data-cursor]');
      const ring = ringRef.current;
      if (!ring) return;
      if (t) {
        ring.dataset.active = 'true';
        if (labelRef.current) labelRef.current.textContent = t.dataset.cursor || '';
      } else {
        ring.dataset.active = 'false';
        if (labelRef.current) labelRef.current.textContent = '';
      }
    };
    window.addEventListener('mousemove', move);
    return () => window.removeEventListener('mousemove', move);
  }, [x, y]);

  return (
    <>
      {/* centre dot follows instantly */}
      <motion.div
        className="pointer-events-none fixed left-0 top-0 z-[200] hidden h-1.5 w-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-signal md:block"
        style={{ x, y }}
      />
      {/* trailing ring — grows over interactive elements */}
      <motion.div
        ref={ringRef}
        className="group pointer-events-none fixed left-0 top-0 z-[199] hidden items-center justify-center rounded-full border border-bone/50 transition-[width,height,background-color,border-color] duration-300 data-[active=true]:border-signal data-[active=true]:bg-signal/90 md:flex"
        style={{ x: ringX, y: ringY, translateX: '-50%', translateY: '-50%' }}
        initial={{ width: 36, height: 36 }}
      >
        <span
          ref={labelRef}
          className="px-1 text-center font-ar text-[10px] font-bold leading-none text-white opacity-0 transition-opacity duration-200 group-data-[active=true]:opacity-100"
        />
        <style>{`[data-active="true"]{width:76px!important;height:76px!important}`}</style>
      </motion.div>
    </>
  );
}
