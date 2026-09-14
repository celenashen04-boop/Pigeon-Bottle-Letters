// Pure Web Audio API procedural ambient soundscape (Sea breeze & gentle rain)
// Completely self-contained, no external audio files needed!

let audioCtx: AudioContext | null = null;
let oceanGainNode: GainNode | null = null;
let isPlaying = false;
let waveTimer: any = null;

export function toggleAmbientSound(enable?: boolean): boolean {
  if (enable === undefined) {
    enable = !isPlaying;
  }

  if (!enable) {
    if (audioCtx && oceanGainNode) {
      oceanGainNode.gain.linearRampToValueAtTime(0.001, audioCtx.currentTime + 1.5);
      setTimeout(() => {
        if (waveTimer) clearInterval(waveTimer);
        isPlaying = false;
      }, 1500);
    }
    isPlaying = false;
    return false;
  }

  try {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (!audioCtx) {
      audioCtx = new AudioContextClass();
    }
    if (audioCtx.state === 'suspended') {
      audioCtx.resume();
    }

    // Create pink-noise buffer for soft ocean swell
    const bufferSize = audioCtx.sampleRate * 2;
    const noiseBuffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;
    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      b0 = 0.99886 * b0 + white * 0.0555179;
      b1 = 0.99332 * b1 + white * 0.0750759;
      b2 = 0.96900 * b2 + white * 0.1538520;
      b3 = 0.86650 * b3 + white * 0.3104856;
      b4 = 0.55000 * b4 + white * 0.5329522;
      b5 = -0.7616 * b5 - white * 0.0168980;
      output[i] = b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362;
      output[i] *= 0.05; // soft volume
      b6 = white * 0.115926;
    }

    const whiteNoise = audioCtx.createBufferSource();
    whiteNoise.buffer = noiseBuffer;
    whiteNoise.loop = true;

    // Low-pass filter for sea surge
    const filter = audioCtx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(320, audioCtx.currentTime);

    oceanGainNode = audioCtx.createGain();
    oceanGainNode.gain.setValueAtTime(0.001, audioCtx.currentTime);
    oceanGainNode.gain.linearRampToValueAtTime(0.18, audioCtx.currentTime + 2);

    whiteNoise.connect(filter);
    filter.connect(oceanGainNode);
    oceanGainNode.connect(audioCtx.destination);
    whiteNoise.start();

    // Modulate filter and gain to simulate ocean wave cycles (every 7 seconds)
    const swellCycle = () => {
      if (!audioCtx || !oceanGainNode) return;
      const now = audioCtx.currentTime;
      filter.frequency.linearRampToValueAtTime(650, now + 3.2);
      filter.frequency.linearRampToValueAtTime(240, now + 6.8);
      oceanGainNode.gain.linearRampToValueAtTime(0.22, now + 3.2);
      oceanGainNode.gain.linearRampToValueAtTime(0.12, now + 6.8);
    };

    swellCycle();
    waveTimer = setInterval(swellCycle, 7000);
    isPlaying = true;
    return true;
  } catch (err) {
    console.warn("Web Audio ambient error:", err);
    return false;
  }
}

export const toggleProceduralOcean = toggleAmbientSound;

export function setMasterVolume(volume: number) {
  if (oceanGainNode && audioCtx) {
    oceanGainNode.gain.setValueAtTime(Math.max(0, Math.min(1, volume * 0.2)), audioCtx.currentTime);
  }
}

export function playWaxSealThud() {
  try {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    const ctx = new AudioContextClass();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(140, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(35, ctx.currentTime + 0.18);

    gain.gain.setValueAtTime(0.3, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.22);

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.25);
  } catch {}
}
