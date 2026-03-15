let ctx: AudioContext | null = null;

export function getAudioContext(): AudioContext {
  if (!ctx) ctx = new AudioContext();
  if (ctx.state === 'suspended') ctx.resume();
  return ctx;
}

let brownNoiseBuffer: AudioBuffer | null = null;

export function getBrownNoiseBuffer(): AudioBuffer {
  const ac = getAudioContext();
  if (brownNoiseBuffer) return brownNoiseBuffer;
  const bufferSize = ac.sampleRate * 2;
  const buffer = ac.createBuffer(1, bufferSize, ac.sampleRate);
  const data = buffer.getChannelData(0);
  let lastOut = 0;
  for (let i = 0; i < bufferSize; i++) {
    const white = Math.random() * 2 - 1;
    lastOut = (lastOut + 0.02 * white) / 1.02;
    data[i] = lastOut * 3.5;
  }
  brownNoiseBuffer = buffer;
  return buffer;
}

export function startTumbleSound(): () => void {
  const ac = getAudioContext();
  const source = ac.createBufferSource();
  source.buffer = getBrownNoiseBuffer();
  source.loop = true;

  const filter = ac.createBiquadFilter();
  filter.type = 'bandpass';
  filter.frequency.value = 800;
  filter.Q.value = 0.5;

  const gainNode = ac.createGain();
  gainNode.gain.setValueAtTime(0, ac.currentTime);
  gainNode.gain.linearRampToValueAtTime(0.18, ac.currentTime + 0.1);

  source.connect(filter);
  filter.connect(gainNode);
  gainNode.connect(ac.destination);
  source.start();

  return () => {
    gainNode.gain.setValueAtTime(gainNode.gain.value, ac.currentTime);
    gainNode.gain.linearRampToValueAtTime(0, ac.currentTime + 0.15);
    setTimeout(() => { try { source.stop(); } catch { } }, 200);
  };
}

export function playThud(): void {
  const ac = getAudioContext();
  const bufferSize = ac.sampleRate * 0.12;
  const buffer = ac.createBuffer(1, bufferSize, ac.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < bufferSize; i++) {
    data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (bufferSize * 0.15));
  }

  const source = ac.createBufferSource();
  source.buffer = buffer;

  const filter = ac.createBiquadFilter();
  filter.type = 'lowpass';
  filter.frequency.value = 220;

  const gainNode = ac.createGain();
  gainNode.gain.value = 0.6;

  source.connect(filter);
  filter.connect(gainNode);
  gainNode.connect(ac.destination);
  source.start();
}

export function playChime(): void {
  const ac = getAudioContext();
  const notes = [880, 1108.73, 1318.51];
  notes.forEach((freq, i) => {
    const osc = ac.createOscillator();
    osc.type = 'sine';
    osc.frequency.value = freq;

    const gainNode = ac.createGain();
    const startTime = ac.currentTime + i * 0.06;
    gainNode.gain.setValueAtTime(0, startTime);
    gainNode.gain.linearRampToValueAtTime(0.22, startTime + 0.02);
    gainNode.gain.exponentialRampToValueAtTime(0.001, startTime + 1.2);

    osc.connect(gainNode);
    gainNode.connect(ac.destination);
    osc.start(startTime);
    osc.stop(startTime + 1.3);
  });
}
