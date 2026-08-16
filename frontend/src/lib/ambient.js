const PIANO_NOTES = [220, 246.94, 261.63, 293.66, 329.63, 392, 440];

let ctx = null;
let master = null;
let pianoBus = null;
let pianoTimer = null;
let on = false;
const listeners = new Set();

const notify = () => listeners.forEach((fn) => fn(on));

const scheduleNote = () => {
  if (!on || !ctx) return;
  const ac = ctx;
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
  env.connect(pianoBus);
  low.start(t);
  high.start(t);
  low.stop(t + 3.6);
  high.stop(t + 3.6);
  pianoTimer = setTimeout(scheduleNote, 3200 + Math.random() * 3800);
};

const buildGraph = () => {
  const AC = window.AudioContext || window.webkitAudioContext;
  if (!AC) return false;
  const ac = new AC();
  master = ac.createGain();
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

  pianoBus = ac.createGain();
  const dry = ac.createGain();
  dry.gain.value = 0.8;
  const delay = ac.createDelay(1);
  delay.delayTime.value = 0.42;
  const fb = ac.createGain();
  fb.gain.value = 0.32;
  const wet = ac.createGain();
  wet.gain.value = 0.5;
  pianoBus.connect(dry);
  dry.connect(master);
  pianoBus.connect(delay);
  delay.connect(fb);
  fb.connect(delay);
  delay.connect(wet);
  wet.connect(master);

  ctx = ac;
  return true;
};

export const toggleAmbient = () => {
  if (!ctx && !buildGraph()) return on;
  if (ctx.state === 'suspended') ctx.resume();
  const now = ctx.currentTime;
  master.gain.cancelScheduledValues(now);
  master.gain.setValueAtTime(master.gain.value, now);
  on = !on;
  master.gain.linearRampToValueAtTime(on ? 1 : 0, now + 1.4);
  if (on) {
    pianoTimer = setTimeout(scheduleNote, 1600);
  } else if (pianoTimer) {
    clearTimeout(pianoTimer);
  }
  notify();
  return on;
};

export const ambientIsOn = () => on;

export const onAmbientChange = (fn) => {
  listeners.add(fn);
  return () => listeners.delete(fn);
};

export const clack = () => {
  if (!on || !ctx) return;
  const ac = ctx;
  const t = ac.currentTime + 0.02;
  const len = Math.floor(ac.sampleRate * 0.09);
  const buf = ac.createBuffer(1, len, ac.sampleRate);
  const data = buf.getChannelData(0);
  for (let i = 0; i < len; i += 1) data[i] = (Math.random() * 2 - 1) * (1 - i / len) ** 2;
  const src = ac.createBufferSource();
  src.buffer = buf;
  const bp = ac.createBiquadFilter();
  bp.type = 'bandpass';
  bp.frequency.value = 1600 + Math.random() * 600;
  bp.Q.value = 1.2;
  const g = ac.createGain();
  g.gain.setValueAtTime(0.12, t);
  g.gain.exponentialRampToValueAtTime(0.001, t + 0.09);
  src.connect(bp);
  bp.connect(g);
  g.connect(master);
  src.start(t);
  const o = ac.createOscillator();
  o.type = 'sine';
  o.frequency.setValueAtTime(185 + Math.random() * 50, t);
  o.frequency.exponentialRampToValueAtTime(90, t + 0.07);
  const og = ac.createGain();
  og.gain.setValueAtTime(0.08, t);
  og.gain.exponentialRampToValueAtTime(0.001, t + 0.08);
  o.connect(og);
  og.connect(master);
  o.start(t);
  o.stop(t + 0.1);
};
