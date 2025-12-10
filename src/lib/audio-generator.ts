declare global {
    interface Window {
        webkitAudioContext: typeof AudioContext;
    }
}

export class AudioGenerator {
    private ctx: AudioContext | null = null;
    private masterGain: GainNode | null = null;
    private currentSource: AudioScheduledSourceNode | null = null;
    private activeOscillators: OscillatorNode[] = [];
    private initialized = false;

    constructor() { }

    private init() {
        if (this.initialized) return;

        try {
            const AudioContextClass = window.AudioContext || window.webkitAudioContext;
            this.ctx = new AudioContextClass();
            this.masterGain = this.ctx.createGain();
            this.masterGain.gain.value = 0.5;
            this.masterGain.connect(this.ctx.destination);
            this.initialized = true;
        } catch (e) {
            console.error("AudioGenerator: Web Audio API not supported", e);
        }
    }

    public setVolume(value: number) {
        if (this.masterGain) {
            this.masterGain.gain.setTargetAtTime(value, this.ctx?.currentTime || 0, 0.1);
        }
    }

    public stop() {
        if (this.currentSource) {
            try {
                this.currentSource.stop();
                this.currentSource.disconnect();
            } catch (e) { }
            this.currentSource = null;
        }

        this.activeOscillators.forEach(osc => {
            try {
                osc.stop();
                osc.disconnect();
            } catch (e) { }
        });
        this.activeOscillators = [];
    }

    public playWhiteNoise() {
        this.stop();
        if (!this.initialized) this.init();
        if (!this.ctx || !this.masterGain) return;
        if (this.ctx.state === 'suspended') this.ctx.resume();

        const bufferSize = this.ctx.sampleRate * 2; // 2 seconds buffer
        const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
        const data = buffer.getChannelData(0);

        for (let i = 0; i < bufferSize; i++) {
            data[i] = Math.random() * 2 - 1;
        }

        const noise = this.ctx.createBufferSource();
        noise.buffer = buffer;
        noise.loop = true;

        // Filter to soften it (Pink-ish noise)
        const filter = this.ctx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.value = 1000;

        noise.connect(filter);
        filter.connect(this.masterGain);
        noise.start();

        this.currentSource = noise; // Treat noise node as source

    }

    public playBinaural(baseFreq: number, beatFreq: number) {
        this.stop();
        if (!this.initialized) this.init();
        if (!this.ctx || !this.masterGain) return;
        if (this.ctx.state === 'suspended') this.ctx.resume();

        const merger = this.ctx.createChannelMerger(2);

        // Left Ear
        const oscL = this.ctx.createOscillator();
        oscL.type = 'sine';
        oscL.frequency.value = baseFreq;
        const panL = this.ctx.createStereoPanner();
        panL.pan.value = -1;

        oscL.connect(panL);
        panL.connect(merger, 0, 0); // Connect to input 0 (Left channel of merger? Merger inputs are mono)
        // Standard merger logic: connect mono source to specific input of merger
        // Actually for stereo panner, better to just connect panner to master.

        // Let's use simple stereo panners connecting to master
        const osc1 = this.ctx.createOscillator();
        osc1.frequency.value = baseFreq;
        const panner1 = this.ctx.createStereoPanner();
        panner1.pan.value = -1; // Left
        osc1.connect(panner1);
        panner1.connect(this.masterGain);

        const osc2 = this.ctx.createOscillator();
        osc2.frequency.value = baseFreq + beatFreq;
        const panner2 = this.ctx.createStereoPanner();
        panner2.pan.value = 1; // Right
        osc2.connect(panner2);
        panner2.connect(this.masterGain);

        osc1.start();
        osc2.start();

        this.activeOscillators = [osc1, osc2];

    }

    public playFrequency(freq: number) {
        this.stop();
        if (!this.initialized) this.init();
        if (!this.ctx || !this.masterGain) return;
        if (this.ctx.state === 'suspended') this.ctx.resume();

        const osc = this.ctx.createOscillator();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, this.ctx.currentTime);

        osc.connect(this.masterGain);
        osc.start();

        this.activeOscillators = [osc];

    }
}

export const audioGenerator = new AudioGenerator();
