let ctx: AudioContext | null = null;

export function getAudioContext(): AudioContext {
  if (!ctx) ctx = new AudioContext();
  if (ctx.state === 'suspended') ctx.resume();
  return ctx;
}

/**
 * Play a single sharp transient click — the fundamental unit of a die rolling.
 * freqHz:   centre frequency of the bandpass filter (controls "heaviness")
 * volume:   linear gain
 * decayMs:  how fast the click fades (heavier dice = longer decay)
 */
function playClick(
  ac: AudioContext,
  freqHz: number,
  volume: number,
  decayMs = 35,
): void {
  const samples = Math.floor(ac.sampleRate * decayMs / 1000);
  const buffer = ac.createBuffer(1, samples, ac.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < samples; i++) {
    // White noise with a cubic decay envelope — sounds like a surface impact
    data[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / samples, 3);
  }

  const src = ac.createBufferSource();
  src.buffer = buffer;

  const bpf = ac.createBiquadFilter();
  bpf.type = 'bandpass';
  bpf.frequency.value = freqHz;
  bpf.Q.value = 1.5 + Math.random() * 0.8;

  const gain = ac.createGain();
  gain.gain.value = volume * (0.7 + Math.random() * 0.6);

  src.connect(bpf);
  bpf.connect(gain);
  gain.connect(ac.destination);
  src.start();
}

/**
 * Start the die-rolling click loop.
 *
 * dicePool: array of die face counts (e.g. [20, 20, 6])
 *  - More dice  → clicks fire more frequently
 *  - Bigger die → deeper pitch (lower bandpass frequency) + slower decay
 *
 * Returns a stop function; call it when the dice settle.
 */
export function startDiceRoll(dicePool: number[]): () => void {
  const ac = getAudioContext();
  let active = true;
  // Store the pending tick handle so we can cancel it immediately on stop —
  // without this, a long inter-click gap keeps "ticking" silently for up to
  // a second after the dice settle.
  let nextTickHandle: ReturnType<typeof setTimeout> | null = null;

  const numDice = Math.max(1, dicePool.length);
  const avgSides =
    dicePool.length > 0
      ? dicePool.reduce((s, d) => s + d, 0) / dicePool.length
      : 6;

  const baseFreq = Math.max(1400, 3500 - avgSides * 75);
  const baseDecay = 25 + avgSides * 1.2;

  const startTime = performance.now();
  const rollDuration = 1800;
  let tickIndex = 0;

  const tick = () => {
    if (!active) return;
    tickIndex++;

    const elapsed = performance.now() - startTime;
    const t = Math.min(elapsed / rollDuration, 1);

    playClick(
      ac,
      baseFreq + (Math.random() - 0.5) * 700,
      0.22,
      baseDecay,
    );

    if (tickIndex % (4 + Math.floor(Math.random() * 3)) === 0) {
      playClick(ac, 180 + Math.random() * 120, 0.28, baseDecay * 2);
    }

    const fastInterval = Math.max(45, 220 - numDice * 18);
    const slowInterval = fastInterval * 5;
    const easedT = t < 0.6 ? (t / 0.6) * 0.15 : 0.15 + ((t - 0.6) / 0.4) * 0.85;
    const baseInterval = fastInterval + (slowInterval - fastInterval) * easedT;
    const interval = baseInterval * (0.7 + Math.random() * 0.6);
    nextTickHandle = setTimeout(tick, interval);
  };

  tick();

  return () => {
    active = false;
    if (nextTickHandle !== null) {
      clearTimeout(nextTickHandle);
      nextTickHandle = null;
    }
  };
}

/**
 * Play settle thuds once the dice come to rest.
 *
 * dicePool:    die face counts, used to vary thud depth/duration
 * isMaxValue:  trigger the cyberpunk chime if true
 */
export function playDiceSettle(dicePool: number[], isMaxValue: boolean): void {
  const ac = getAudioContext();

  const avgSides =
    dicePool.length > 0
      ? dicePool.reduce((s, d) => s + d, 0) / dicePool.length
      : 6;

  // Bigger dice → deeper thud (lower LP cutoff), longer body
  const thudFreq = Math.max(120, 500 - avgSides * 14);
  const thudDecay = 0.07 + (avgSides / 20) * 0.05;

  const numThuds = Math.min(dicePool.length, 6);

  for (let i = 0; i < numThuds; i++) {
    const delay = i * 22; // stagger each die landing slightly
    setTimeout(() => {
      const samples = Math.floor(ac.sampleRate * thudDecay);
      const buffer = ac.createBuffer(1, samples, ac.sampleRate);
      const data = buffer.getChannelData(0);
      for (let j = 0; j < samples; j++) {
        data[j] =
          (Math.random() * 2 - 1) * Math.pow(1 - j / samples, 2.2);
      }

      const src = ac.createBufferSource();
      src.buffer = buffer;

      const lpf = ac.createBiquadFilter();
      lpf.type = 'lowpass';
      lpf.frequency.value = thudFreq + Math.random() * 80;

      const gain = ac.createGain();
      gain.gain.value = 0.45 + Math.random() * 0.25;

      src.connect(lpf);
      lpf.connect(gain);
      gain.connect(ac.destination);
      src.start();
    }, delay);
  }

  if (isMaxValue) {
    setTimeout(playChime, 160);
  }
}

/**
 * Cyberpunk-flavoured chime for a maximum die result (nat-20, etc.).
 * A minor-major seventh arpeggio with a metallic triangle-wave root.
 */
export function playChime(): void {
  const ac = getAudioContext();
  const notes = [
    { freq: 440.0,  type: 'triangle' as OscillatorType, delay: 0.00 },
    { freq: 523.25, type: 'sine'     as OscillatorType, delay: 0.07 },
    { freq: 659.25, type: 'sine'     as OscillatorType, delay: 0.14 },
    { freq: 880.0,  type: 'sine'     as OscillatorType, delay: 0.21 },
  ];

  notes.forEach(({ freq, type, delay }) => {
    const osc = ac.createOscillator();
    osc.type = type;
    osc.frequency.value = freq;

    const gain = ac.createGain();
    const t = ac.currentTime + delay;
    gain.gain.setValueAtTime(0, t);
    gain.gain.linearRampToValueAtTime(0.17, t + 0.012);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 1.4);

    osc.connect(gain);
    gain.connect(ac.destination);
    osc.start(t);
    osc.stop(t + 1.5);
  });
}
