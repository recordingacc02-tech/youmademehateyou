import { useEffect, useRef, useState } from 'react';

export const useAudioHum = () => {
  const [on, setOn] = useState(false);
  const ctxRef = useRef(null);
  const gainRef = useRef(null);

  const toggle = () => {
    if (!ctxRef.current) {
      const AC = window.AudioContext || window.webkitAudioContext;
      if (!AC) return;
      const ac = new AC();
      const gain = ac.createGain();
      gain.gain.value = 0;
      const filter = ac.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.value = 240;
      [55, 82.5, 110.4].forEach((f) => {
        const osc = ac.createOscillator();
        osc.type = 'sine';
        osc.frequency.value = f;
        osc.connect(filter);
        osc.start();
      });
      filter.connect(gain);
      gain.connect(ac.destination);
      ctxRef.current = ac;
      gainRef.current = gain;
    }
    const ac = ctxRef.current;
    const gain = gainRef.current;
    if (ac.state === 'suspended') ac.resume();
    const now = ac.currentTime;
    gain.gain.cancelScheduledValues(now);
    gain.gain.setValueAtTime(gain.gain.value, now);
    gain.gain.linearRampToValueAtTime(on ? 0 : 0.028, now + 1.4);
    setOn(!on);
  };

  useEffect(() => {
    return () => {
      if (ctxRef.current) ctxRef.current.close();
    };
  }, []);

  return { on, toggle };
};
