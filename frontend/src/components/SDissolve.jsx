import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export const SDissolve = () => {
  const canvasRef = useRef(null);
  const progressRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    const g = canvas.getContext('2d');
    let raf;
    let running = true;
    let particles = [];
    let rect = null;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    const sample = () => {
      const el = document.querySelector('[data-testid="letter-s"]');
      if (!el) return;
      const r = el.getBoundingClientRect();
      if (r.width < 10) return;
      rect = r;
      const cs = getComputedStyle(el);
      const off = document.createElement('canvas');
      off.width = Math.ceil(r.width);
      off.height = Math.ceil(r.height);
      const og = off.getContext('2d');
      og.font = `${cs.fontWeight} ${cs.fontSize}px 'Cormorant Garamond', Georgia, serif`;
      og.textAlign = 'center';
      og.textBaseline = 'middle';
      og.fillStyle = '#ffffff';
      og.fillText('S', off.width / 2, off.height / 2);
      const data = og.getImageData(0, 0, off.width, off.height).data;
      const pts = [];
      for (let y = 0; y < off.height; y += 3) {
        for (let x = 0; x < off.width; x += 3) {
          if (data[(y * off.width + x) * 4 + 3] > 100) pts.push({ x, y });
        }
      }
      if (!pts.length) return;
      const N = Math.min(420, pts.length);
      particles = [];
      for (let i = 0; i < N; i += 1) {
        const p = pts[Math.floor((i / N) * pts.length)];
        particles.push({
          ox: p.x,
          oy: p.y,
          t0: Math.random() * 0.75,
          vx: 30 + Math.random() * 120,
          vy: -(60 + Math.random() * 200),
          sway: Math.random() * Math.PI * 2,
          size: 0.6 + Math.random() * 1.4,
        });
      }
    };
    document.fonts.ready.then(() => setTimeout(sample, 300));

    const tick = (t) => {
      if (!running) return;
      g.clearRect(0, 0, canvas.width, canvas.height);
      if (rect && particles.length) {
        const p = progressRef.current;
        particles.forEach((pt) => {
          const local = (p - pt.t0) / (1 - pt.t0);
          if (local <= 0) {
            const a = 0.1 + 0.08 * Math.sin(t * 0.002 + pt.sway);
            g.fillStyle = `rgba(232, 216, 200, ${a.toFixed(3)})`;
            g.fillRect(rect.left + pt.ox, rect.top + pt.oy, pt.size, pt.size);
          } else if (local < 1) {
            const x = rect.left + pt.ox + pt.vx * local + Math.sin(pt.sway + local * 6) * 8;
            const y = rect.top + pt.oy + pt.vy * local;
            const a = 0.4 * (1 - local);
            g.fillStyle = `rgba(232, 216, 200, ${a.toFixed(3)})`;
            g.fillRect(x, y, pt.size, pt.size);
          }
        });
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
        progressRef.current = Math.min(1, Math.max(0, (self.progress - 0.16) / 0.45));
      },
      onRefresh: () => {
        setTimeout(sample, 120);
      },
    });

    return () => {
      running = false;
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
      st.kill();
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      data-testid="s-dissolve-canvas"
      aria-hidden="true"
      className="absolute inset-0 pointer-events-none"
    />
  );
};
