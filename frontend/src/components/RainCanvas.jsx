import { useEffect, useRef } from 'react';

export const RainCanvas = ({ active }) => {
  const canvasRef = useRef(null);
  const rafRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return undefined;
    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);
    return () => window.removeEventListener('resize', resize);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !active) return undefined;
    const g = canvas.getContext('2d');
    const spawn = (initial) => ({
      x: Math.random() * canvas.width,
      y: initial ? Math.random() * canvas.height : -10,
      v: 0.5 + Math.random() * 0.9,
      r: 0.8 + Math.random() * 1.6,
      wob: Math.random() * Math.PI * 2,
    });
    const drops = Array.from(
      { length: Math.min(18, Math.max(8, Math.floor(canvas.width / 90))) },
      () => spawn(true)
    );
    const tick = () => {
      g.globalCompositeOperation = 'destination-out';
      g.fillStyle = 'rgba(0,0,0,0.05)';
      g.fillRect(0, 0, canvas.width, canvas.height);
      g.globalCompositeOperation = 'source-over';
      drops.forEach((d) => {
        d.y += d.v;
        d.x += Math.sin(d.wob + d.y * 0.01) * 0.15;
        if (d.y > canvas.height + 10) Object.assign(d, spawn(false));
        g.beginPath();
        g.arc(d.x, d.y, d.r, 0, Math.PI * 2);
        g.fillStyle = 'rgba(210,220,235,0.10)';
        g.fill();
      });
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [active]);

  return (
    <canvas
      ref={canvasRef}
      data-testid="rain-canvas"
      aria-hidden="true"
      className={`fixed inset-0 z-40 pointer-events-none transition-opacity duration-[2000ms] ${
        active ? 'opacity-100' : 'opacity-0'
      }`}
    />
  );
};
