export class SoundManager {
    private ctx: AudioContext | null = null;
    private masterGain: GainNode | null = null;
    private initialized = false;

    constructor() {
        // Initialize context lazily on user interaction
    }

    private init() {
        if (this.initialized) return;

        try {
            // @ts-ignore - Handle cross-browser audio context
            const AudioContextClass = window.AudioContext || window.webkitAudioContext;
            this.ctx = new AudioContextClass();
            this.masterGain = this.ctx.createGain();
            this.masterGain.gain.value = 0.3; // Default volume
            this.masterGain.connect(this.ctx.destination);
            this.initialized = true;
        } catch (e) {
            console.error("Web Audio API not supported", e);
        }
    }

    private playTone(freq: number, type: OscillatorType, duration: number, volume = 1) {
        if (!this.initialized) this.init();
        if (!this.ctx || !this.masterGain) return;

        // Resume context if suspended (browser autoplay policy)
        if (this.ctx.state === 'suspended') {
            this.ctx.resume();
        }

        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = type;
        osc.frequency.setValueAtTime(freq, this.ctx.currentTime);

        gain.gain.setValueAtTime(volume, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + duration);

        osc.connect(gain);
        gain.connect(this.masterGain);

        osc.start();
        osc.stop(this.ctx.currentTime + duration);
    }

    playFlip() {
        // Sharp "ffft" sound
        this.playTone(400, 'triangle', 0.1, 0.5);
    }

    playMatch() {
        // High pleasant chime
        this.playTone(800, 'sine', 0.1, 0.6);
        setTimeout(() => this.playTone(1200, 'sine', 0.2, 0.6), 100);
    }

    playError() {
        // Low failing buzz
        this.playTone(150, 'sawtooth', 0.15, 0.4);
        setTimeout(() => this.playTone(120, 'sawtooth', 0.15, 0.4), 100);
    }

    playWin() {
        // Fanfare
        if (!this.initialized) this.init();
        [523.25, 659.25, 783.99, 1046.50].forEach((freq, i) => {
            setTimeout(() => this.playTone(freq, 'sine', 0.3, 0.6), i * 100);
        });
    }

    playPop() {
        // Bubble pop sound
        if (!this.initialized) this.init();
        if (!this.ctx || !this.masterGain) return;

        if (this.ctx.state === 'suspended') this.ctx.resume();

        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'sine';
        // Pitch drop for "bloop" effect
        osc.frequency.setValueAtTime(800, this.ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(400, this.ctx.currentTime + 0.1);

        gain.gain.setValueAtTime(0.5, this.ctx.currentTime);
        gain.gain.linearRampToValueAtTime(0, this.ctx.currentTime + 0.1);

        osc.connect(gain);
        gain.connect(this.masterGain);

        osc.start();
        osc.stop(this.ctx.currentTime + 0.1);
    }

    playSequenceTone(index: number) {
        // Simon-says style tones based on index
        const freqs = [300, 400, 500, 600, 700, 800, 900, 1000];
        const freq = freqs[index % freqs.length] || 440;
        this.playTone(freq, 'sine', 0.3, 0.6);
    }
}

export const soundManager = new SoundManager();
