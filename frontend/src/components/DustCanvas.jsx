import { useEffect, useRef } from 'react';

export const DustCanvas = () => {
  const ref = useRef(null);

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
    const motes = Array.from({ length: 36 }, () => ({
      x: Math.random(),
      y: Math.random(),
      r: 0.4 + Math.random() * 1.1,
      vx: (Math.random() - 0.5) * 0.00008,
      vy: -(0.00004 + Math.random() * 0.00012),
      a: 0.04 + Math.random() * 0.1,
      ph: Math.random() * Math.PI * 2,
    }));
    const tick = (t) => {
      g.clearRect(0, 0, canvas.width, canvas.height);
      motes.forEach((m) => {
        m.x += m.vx;
        m.y += m.vy;
        if (m.y < -0.02) {
          m.y = 1.02;
          m.x = Math.random();
        }
        if (m.x < -0.02) m.x = 1.02;
        if (m.x > 1.02) m.x = -0.02;
        const tw = 0.6 + 0.4 * Math.sin(t * 0.001 + m.ph);
        g.beginPath();
        g.arc(m.x * canvas.width, m.y * canvas.height, m.r, 0, Math.PI * 2);
        g.fillStyle = `rgba(232, 216, 200, ${(m.a * tw).toFixed(3)})`;
        g.fill();
      });
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <canvas
      ref={ref}
      data-testid="dust-canvas"
      aria-hidden="true"
      className="fixed inset-0 z-[5] pointer-events-none"
    />
  );
};
