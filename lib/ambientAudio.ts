// Procedural Web Audio API soundscape generator for the Dark Academia Digital Library
// No external MP3 files needed - 100% reliable, zero latency, runs in any modern browser.

class LibraryAudioEngine {
  private ctx: AudioContext | null = null;
  private isPlaying = false;
  private rainGain: GainNode | null = null;
  private fireGain: GainNode | null = null;
  private masterGain: GainNode | null = null;
  private activeNodes: (AudioNode | number)[] = [];

  private initContext() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtx();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  // Synthesize soft rain against window glass (pink noise with resonant filters)
  private createRain(ctx: AudioContext, destination: GainNode) {
    const bufferSize = ctx.sampleRate * 2;
    const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
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
      output[i] = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362) * 0.04;
      b6 = white * 0.115926;
    }

    const whiteNoise = ctx.createBufferSource();
    whiteNoise.buffer = noiseBuffer;
    whiteNoise.loop = true;

    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(850, ctx.currentTime);

    const highpass = ctx.createBiquadFilter();
    highpass.type = 'highpass';
    highpass.frequency.setValueAtTime(220, ctx.currentTime);

    whiteNoise.connect(filter);
    filter.connect(highpass);
    highpass.connect(destination);
    whiteNoise.start();

    return whiteNoise;
  }

  // Synthesize gentle fireplace / candle crackle
  private startFireCrackle(ctx: AudioContext, destination: GainNode) {
    let timerId: number | null = null;

    const triggerCrackle = () => {
      if (!this.isPlaying) return;

      const duration = 0.01 + Math.random() * 0.03;
      const buffer = ctx.createBuffer(1, Math.floor(ctx.sampleRate * duration), ctx.sampleRate);
      const data = buffer.getChannelData(0);

      for (let i = 0; i < data.length; i++) {
        data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (data.length * 0.3));
      }

      const noise = ctx.createBufferSource();
      noise.buffer = buffer;

      const filter = ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(1400 + Math.random() * 1200, ctx.currentTime);
      filter.Q.setValueAtTime(2.5, ctx.currentTime);

      const crackleGain = ctx.createGain();
      crackleGain.gain.setValueAtTime(0.04 + Math.random() * 0.07, ctx.currentTime);

      noise.connect(filter);
      filter.connect(crackleGain);
      crackleGain.connect(destination);

      noise.start();
      noise.onended = () => {
        noise.disconnect();
        filter.disconnect();
        crackleGain.disconnect();
      };

      const nextDelay = 80 + Math.random() * 320;
      timerId = window.setTimeout(triggerCrackle, nextDelay);
    };

    triggerCrackle();

    return {
      stop: () => {
        if (timerId !== null) window.clearTimeout(timerId);
      },
    };
  }

  // Play a lush, resonant grand piano chord (Dark Academia D minor 9th / F major 7th)
  public playPianoChord(variant = 0) {
    try {
      this.initContext();
      if (!this.ctx) return;
      const ctx = this.ctx;

      const chordSets = [
        // Dm9 (Deep, contemplative, dark academia)
        [146.83, 220.00, 261.63, 293.66, 329.63, 440.00], // D3, A3, C4, D4, E4, A4
        // Fmaj7/A (Nostalgic, warm, luminous)
        [110.00, 174.61, 220.00, 261.63, 329.63, 349.23], // A2, F3, A3, C4, E4, F4
        // Gm7 (Mysterious, cinematic)
        [98.00, 146.83, 196.00, 233.08, 293.66, 349.23],  // G2, D3, G3, Bb3, D4, F4
      ];

      const frequencies = chordSets[variant % chordSets.length];
      const now = ctx.currentTime;

      const chordBus = ctx.createGain();
      chordBus.gain.setValueAtTime(0.22, now);
      chordBus.connect(ctx.destination);

      frequencies.forEach((freq, idx) => {
        const stagger = idx * 0.035; // gentle arpeggiated spread
        const startTime = now + stagger;

        // Fundamental
        const osc = ctx.createOscillator();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, startTime);

        // Harmonic shimmer
        const harmonic = ctx.createOscillator();
        harmonic.type = 'sine';
        harmonic.frequency.setValueAtTime(freq * 2, startTime);

        const noteGain = ctx.createGain();
        noteGain.gain.setValueAtTime(0.0001, startTime);
        // Hammer strike attack
        noteGain.gain.linearRampToValueAtTime(0.3 / (idx * 0.35 + 1), startTime + 0.015);
        // Long wooden grand piano decay
        noteGain.gain.exponentialRampToValueAtTime(0.0001, startTime + 4.2 + idx * 0.3);

        const filter = ctx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(freq * 3.5, startTime);
        filter.frequency.exponentialRampToValueAtTime(freq * 1.2, startTime + 3.0);

        osc.connect(filter);
        harmonic.connect(filter);
        filter.connect(noteGain);
        noteGain.connect(chordBus);

        osc.start(startTime);
        harmonic.start(startTime);

        osc.stop(startTime + 4.8);
        harmonic.stop(startTime + 4.8);
      });
    } catch (e) {
      console.warn('Audio play error', e);
    }
  }

  public toggleAtmosphere(): boolean {
    this.initContext();
    if (!this.ctx) return false;

    if (this.isPlaying) {
      this.stopAtmosphere();
      return false;
    } else {
      this.startAtmosphere();
      return true;
    }
  }

  public startAtmosphere() {
    this.initContext();
    if (!this.ctx || this.isPlaying) return;

    const ctx = this.ctx;
    this.isPlaying = true;

    const master = ctx.createGain();
    master.gain.setValueAtTime(0.0001, ctx.currentTime);
    master.gain.linearRampToValueAtTime(0.65, ctx.currentTime + 2.0); // smooth 2s fade in
    master.connect(ctx.destination);
    this.masterGain = master;

    // Rain layer
    const rainGain = ctx.createGain();
    rainGain.gain.setValueAtTime(0.28, ctx.currentTime);
    rainGain.connect(master);
    this.rainGain = rainGain;
    const rain = this.createRain(ctx, rainGain);
    this.activeNodes.push(rain);

    // Hearth fire crackle
    const fireGain = ctx.createGain();
    fireGain.gain.setValueAtTime(0.45, ctx.currentTime);
    fireGain.connect(master);
    this.fireGain = fireGain;
    const fire = this.startFireCrackle(ctx, fireGain);
    this.activeNodes.push(fire as unknown as AudioNode);
  }

  public stopAtmosphere() {
    if (!this.ctx || !this.isPlaying || !this.masterGain) return;

    const ctx = this.ctx;
    this.isPlaying = false;
    this.masterGain.gain.linearRampToValueAtTime(0.0001, ctx.currentTime + 1.2);

    window.setTimeout(() => {
      this.activeNodes.forEach((node) => {
        const candidate = node as unknown as { stop?: () => void; disconnect?: () => void };
        if (typeof candidate.stop === 'function') {
          candidate.stop();
        } else if (typeof candidate.disconnect === 'function') {
          candidate.disconnect();
        }
      });
      this.activeNodes = [];
    }, 1300);
  }

  public getStatus() {
    return this.isPlaying;
  }
}

export const libraryAudio = new LibraryAudioEngine();
