import { useEffect, useRef, useState } from 'react';

const PIANO_NOTES = [220, 246.94, 261.63, 293.66, 329.63, 392, 440];

export const useAudioHum = () => {
  const [on, setOn] = useState(false);
  const ctxRef = useRef(null);
  const masterRef = useRef(null);
  const pianoBusRef = useRef(null);
  const pianoTimerRef = useRef(null);
  const onRef = useRef(false);

  const scheduleNote = () => {
    if (!onRef.current || !ctxRef.current) return;
    const ac = ctxRef.current;
    const bus = pianoBusRef.current;
    const f = PIANO_NOTES[Math.floor(Math.random() * PIANO_NOTES.length)] * (Math.random() < 0.22 ? 0.5 : 1);
    const t = ac.currentTime + 0.06;
    const env = ac.createGain();
    env.gain.setValueAtTime(0, t);
    env.gain.linearRampToValueAtTime(0.07, t + 0.04);
    env.gain.exponentialRampToValueAtTime(0.0004, t + 3.4);
    const low = ac.createOscillator();
    low.type = 'sine';
    low.frequency.value = f;
    const high = ac.createOscillator();
    high.type = 'triangle';
    high.frequency.value = f * 2;
    const highGain = ac.createGain();
    highGain.gain.value = 0.18;
    low.connect(env);
    high.connect(highGain);
    highGain.connect(env);
    env.connect(bus);
    low.start(t);
    high.start(t);
    low.stop(t + 3.6);
    high.stop(t + 3.6);
    pianoTimerRef.current = setTimeout(scheduleNote, 3200 + Math.random() * 3800);
  };

  const buildGraph = () => {
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return false;
    const ac = new AC();
    const master = ac.createGain();
    master.gain.value = 0;
    master.connect(ac.destination);

    const humGain = ac.createGain();
    humGain.gain.value = 0.03;
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
    filter.connect(humGain);
    humGain.connect(master);

    const bus = ac.createGain();
    const dry = ac.createGain();
    dry.gain.value = 0.8;
    const delay = ac.createDelay(1);
    delay.delayTime.value = 0.42;
    const fb = ac.createGain();
    fb.gain.value = 0.32;
    const wet = ac.createGain();
    wet.gain.value = 0.5;
    bus.connect(dry);
    dry.connect(master);
    bus.connect(delay);
    delay.connect(fb);
    fb.connect(delay);
    delay.connect(wet);
    wet.connect(master);

    ctxRef.current = ac;
    masterRef.current = master;
    pianoBusRef.current = bus;
    return true;
  };

  const toggle = () => {
    if (!ctxRef.current && !buildGraph()) return;
    const ac = ctxRef.current;
    if (ac.state === 'suspended') ac.resume();
    const now = ac.currentTime;
    const master = masterRef.current;
    master.gain.cancelScheduledValues(now);
    master.gain.setValueAtTime(master.gain.value, now);
    const next = !on;
    master.gain.linearRampToValueAtTime(next ? 1 : 0, now + 1.4);
    onRef.current = next;
    setOn(next);
    if (next) {
      pianoTimerRef.current = setTimeout(scheduleNote, 1600);
    } else if (pianoTimerRef.current) {
      clearTimeout(pianoTimerRef.current);
    }
  };

  useEffect(() => {
    return () => {
      if (pianoTimerRef.current) clearTimeout(pianoTimerRef.current);
      if (ctxRef.current) ctxRef.current.close();
    };
  }, []);

  return { on, toggle };
};
