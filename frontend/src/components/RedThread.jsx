import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const SNAP = 0.2;

export const RedThread = () => {
  const ref = useRef(null);
  const progressRef = useRef(0);

  useEffect(() => {
    const canvas = ref.current;
    const g = canvas.getContext('2d');
    let raf;
    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    const rEl = () => document.querySelector('.scene-letters [data-testid="letter-r"]');
    const sEl = () => document.querySelector('.scene-letters [data-testid="letter-s"]');

    const tick = (t) => {
      g.clearRect(0, 0, canvas.width, canvas.height);
      const r = rEl();
      const s = sEl();
      if (r && s) {
        const rr = r.getBoundingClientRect();
        const sr = s.getBoundingClientRect();
        const ax = rr.left + rr.width * 0.82;
        const ay = rr.top + rr.height * 0.54;
        const bx = sr.left + sr.width * 0.2;
        const by = sr.top + sr.height * 0.54;
        const p = progressRef.current;
        g.lineWidth = 1.1;
        g.lineCap = 'round';
        if (p < SNAP) {
          const tension = p / SNAP;
          const sag = (46 - tension * 38) * (1 + 0.08 * Math.sin(t * 0.0016));
          const alpha = 0.5 - tension * 0.1;
          g.strokeStyle = `rgba(146, 32, 42, ${alpha.toFixed(3)})`;
          g.beginPath();
          g.moveTo(ax, ay);
          g.quadraticCurveTo((ax + bx) / 2, Math.max(ay, by) + sag, bx, by);
          g.stroke();
        } else {
          const f = Math.min(1, (p - SNAP) / 0.3);
          const alpha = 0.5 * (1 - f);
          if (alpha > 0.01) {
            const len = 70 * (1 - f * 0.4);
            const swingA = Math.sin(t * 0.0022) * 20;
            const swingB = Math.sin(t * 0.0026 + 1.7) * 20;
            g.strokeStyle = `rgba(146, 32, 42, ${alpha.toFixed(3)})`;
            g.beginPath();
            g.moveTo(ax, ay);
            g.quadraticCurveTo(ax + 24, ay + len * 0.6, ax + swingA, ay + len);
            g.stroke();
            g.beginPath();
            g.moveTo(bx, by);
            g.quadraticCurveTo(bx - 24, by + len * 0.6, bx + swingB, by + len);
            g.stroke();
          }
        }
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    const st = ScrollTrigger.create({
      trigger: '.scene-letters',
      start: 'top top',
      end: '+=280%',
      scrub: true,
      onUpdate: (self) => {
        progressRef.current = self.progress;
      },
    });

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
      st.kill();
    };
  }, []);

  return (
    <canvas
      ref={ref}
      data-testid="red-thread-canvas"
      aria-hidden="true"
      className="absolute inset-0 pointer-events-none"
    />
  );
};
