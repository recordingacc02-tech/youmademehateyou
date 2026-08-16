const PIANO_SAMPLES = [
  { file: 'A2', freq: 110 },
  { file: 'C3', freq: 130.81 },
  { file: 'A3', freq: 220 },
  { file: 'B3', freq: 246.94 },
  { file: 'C4', freq: 261.63 },
  { file: 'D4', freq: 293.66 },
  { file: 'E4', freq: 329.63 },
  { file: 'G4', freq: 392 },
  { file: 'A4', freq: 440 },
];

let ctx = null;
let master = null;
let pianoBus = null;
let pianoTimer = null;
let on = false;
const buffers = {};
let samplesRequested = false;
const listeners = new Set();

const notify = () => listeners.forEach((fn) => fn(on));

const loadSamples = () => {
  if (samplesRequested || !ctx) return;
  samplesRequested = true;
  PIANO_SAMPLES.forEach(({ file }) => {
    fetch(`/audio/piano/${file}.mp3`)
      .then((r) => r.arrayBuffer())
      .then((ab) => ctx.decodeAudioData(ab))
      .then((buf) => {
        buffers[file] = buf;
      })
      .catch(() => {});
  });
};

const playSynthNote = (ac, f) => {
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
};

const playSampleNote = (ac, entry, octaveDown) => {
  const buf = buffers[entry.file];
  if (!buf) return false;
  const t = ac.currentTime + 0.05;
  const src = ac.createBufferSource();
  src.buffer = buf;
  src.playbackRate.value = octaveDown ? 0.5 : 1;
  const g = ac.createGain();
  g.gain.value = 0.26 + Math.random() * 0.12;
  src.connect(g);
  g.connect(pianoBus);
  src.start(t);
  return true;
};

const scheduleNote = () => {
  if (!on || !ctx) return;
  const entry = PIANO_SAMPLES[Math.floor(Math.random() * PIANO_SAMPLES.length)];
  const octaveDown = Math.random() < 0.22;
  if (!playSampleNote(ctx, entry, octaveDown)) {
    playSynthNote(ctx, entry.freq * (octaveDown ? 0.5 : 1));
  }
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
  loadSamples();
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

const noiseBurst = (t, { freq, q, gain, dur }) => {
  const len = Math.floor(ctx.sampleRate * dur);
  const buf = ctx.createBuffer(1, len, ctx.sampleRate);
  const data = buf.getChannelData(0);
  for (let i = 0; i < len; i += 1) data[i] = (Math.random() * 2 - 1) * (1 - i / len) ** 2;
  const src = ctx.createBufferSource();
  src.buffer = buf;
  const bp = ctx.createBiquadFilter();
  bp.type = 'bandpass';
  bp.frequency.value = freq;
  bp.Q.value = q;
  const g = ctx.createGain();
  g.gain.setValueAtTime(gain, t);
  g.gain.exponentialRampToValueAtTime(0.001, t + dur);
  src.connect(bp);
  bp.connect(g);
  g.connect(master);
  src.start(t);
};

const thock = (t, { from, to, gain, dur }) => {
  const o = ctx.createOscillator();
  o.type = 'sine';
  o.frequency.setValueAtTime(from, t);
  o.frequency.exponentialRampToValueAtTime(to, t + dur * 0.8);
  const og = ctx.createGain();
  og.gain.setValueAtTime(gain, t);
  og.gain.exponentialRampToValueAtTime(0.001, t + dur);
  o.connect(og);
  og.connect(master);
  o.start(t);
  o.stop(t + dur + 0.02);
};

export const clack = () => {
  if (!on || !ctx) return;
  const t = ctx.currentTime + 0.02;
  noiseBurst(t, { freq: 1600 + Math.random() * 600, q: 1.2, gain: 0.12, dur: 0.09 });
  thock(t, { from: 185 + Math.random() * 50, to: 90, gain: 0.08, dur: 0.07 });
};

export const backspaceClack = () => {
  if (!on || !ctx) return;
  const t = ctx.currentTime + 0.02;
  noiseBurst(t, { freq: 520 + Math.random() * 260, q: 0.8, gain: 0.16, dur: 0.14 });
  thock(t, { from: 120 + Math.random() * 30, to: 55, gain: 0.11, dur: 0.12 });
};

export const enterClack = () => {
  if (!on || !ctx) return;
  const t = ctx.currentTime + 0.02;
  noiseBurst(t, { freq: 1300 + Math.random() * 300, q: 1.4, gain: 0.13, dur: 0.1 });
  thock(t, { from: 150, to: 70, gain: 0.1, dur: 0.09 });
  thock(t + 0.07, { from: 85, to: 45, gain: 0.09, dur: 0.14 });
};
