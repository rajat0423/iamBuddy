export interface SoundTrack {
    id: string;
    title: string;
    category: 'spiritual' | 'nature' | 'healing' | 'focus' | 'sleep' | 'breath';
    duration: number; // in seconds, mainly for loops/guided
    thumbnail: string;
    url: string; // Audio URL
    description: string;
    tags: string[];
    color: string;
}

export interface SoundCategory {
    id: string;
    title: string;
    description: string;
    icon?: any;
}

export const CATEGORIES: SoundCategory[] = [
    { id: 'spiritual', title: 'Spiritual Healing', description: 'Chants, bowls, and mantras for grounding.' },
    { id: 'nature', title: 'Nature Therapy', description: 'Immersive environmental sounds.' },
    { id: 'healing', title: 'Healing Frequencies', description: 'Binaural beats and Solfeggio tones.' },
    { id: 'focus', title: 'Focus & Flow', description: 'Boost productivity and concentration.' },
    { id: 'sleep', title: 'Sleep & Unwind', description: 'Drift off with soothing melodies.' },
    { id: 'breath', title: 'Breathwork', description: 'Guided breathing sessions.' },
];

// Placeholder URLs - Using standard sample audio for demo purposes
// In production these would be hosted assets.


export const SOUND_LIBRARY: SoundTrack[] = [
    // Spiritual
    {
        id: 'om-chant',
        title: 'Om Chanting 432Hz',
        category: 'spiritual',
        duration: 300,
        thumbnail: 'https://images.unsplash.com/photo-1603209873994-0f2c45e8e8ce?w=400&auto=format&fit=crop&q=60',
        url: 'https://cdn.pixabay.com/download/audio/2021/08/20/audio_448e8a6096.mp3?filename=meditation-bowl-436.mp3', // Bowl sound closer match
        description: 'Deep resonant Om vibration for grounding.',
        tags: ['om', 'meditation', 'chant'],
        color: 'bg-amber-500'
    },
    {
        id: 'tibetan-bowls',
        title: 'Tibetan Singing Bowls',
        category: 'spiritual',
        duration: 300,
        thumbnail: 'https://images.unsplash.com/photo-1593121528641-59754c000109?w=400&auto=format&fit=crop&q=60',
        url: 'https://cdn.pixabay.com/download/audio/2021/08/20/audio_448e8a6096.mp3?filename=meditation-bowl-436.mp3',
        description: 'Harmonic resonance for chakra balancing.',
        tags: ['bowls', 'tibetan', 'healing'],
        color: 'bg-orange-400'
    },

    // Nature
    {
        id: 'rain-heavy',
        title: 'Heavy Rain',
        category: 'nature',
        duration: 0,
        thumbnail: 'https://images.unsplash.com/photo-1515694346937-94d85e41e6f0?w=400&auto=format&fit=crop&q=60',
        url: 'https://cdn.pixabay.com/download/audio/2022/02/10/audio_fc56c7e80a.mp3?filename=rain-and-thunder-16023.mp3',
        description: 'Consistent heavy rain on a rooftop.',
        tags: ['rain', 'nature', 'sleep'],
        color: 'bg-blue-600'
    },
    {
        id: 'ocean-waves',
        title: 'Ocean Waves',
        category: 'nature',
        duration: 0,
        thumbnail: 'https://images.unsplash.com/photo-1518837695005-2083093ee35b?w=400&auto=format&fit=crop&q=60',
        url: 'https://cdn.pixabay.com/download/audio/2021/09/06/audio_031802d334.mp3?filename=ocean-wave-2-10499.mp3',
        description: 'Rhythmic waves crashing on shore.',
        tags: ['ocean', 'water', 'calm'],
        color: 'bg-cyan-500'
    },
    {
        id: 'forest-birds',
        title: 'Forest Ambience',
        category: 'nature',
        duration: 0,
        thumbnail: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400&auto=format&fit=crop&q=60',
        url: 'https://cdn.pixabay.com/download/audio/2021/09/06/audio_363c2e827b.mp3?filename=forest-wind-and-birds-6881.mp3',
        description: 'Birds chirping in a quiet forest.',
        tags: ['forest', 'birds', 'morning'],
        color: 'bg-green-600'
    },

    // Healing Frequencies
    {
        id: '528hz',
        title: '528Hz Miracle Tone',
        category: 'healing',
        duration: 600,
        thumbnail: 'https://images.unsplash.com/photo-1454551436830-466547a192b0?w=400&auto=format&fit=crop&q=60',
        url: 'https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf07a.mp3?filename=lofi-study-112191.mp3', // Placeholder, using lofi for soft ambient
        description: 'Frequency for DNA repair and emotional healing.',
        tags: ['528hz', 'solfeggio', 'healing'],
        color: 'bg-purple-500'
    },

    // Focus
    {
        id: 'white-noise',
        title: 'White Noise',
        category: 'focus',
        duration: 0,
        thumbnail: 'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?w=400&auto=format&fit=crop&q=60',
        url: 'https://cdn.pixabay.com/download/audio/2022/01/18/audio_d0a13f69d2.mp3?filename=white-noise-8117.mp3',
        description: 'Pure static for blocking distractions.',
        tags: ['noise', 'focus', 'work'],
        color: 'bg-slate-400'
    },
    {
        id: 'lofi-beats',
        title: 'Chill Lo-Fi',
        category: 'focus',
        duration: 0,
        thumbnail: 'https://images.unsplash.com/photo-1516280440614-6697288d5d38?w=400&auto=format&fit=crop&q=60',
        url: 'https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf07a.mp3?filename=lofi-study-112191.mp3',
        description: 'Relaxed beats for studying.',
        tags: ['lofi', 'beats', 'study'],
        color: 'bg-indigo-400'
    },

    // Sleep
    {
        id: 'piano-dream',
        title: 'Dreamy Piano',
        category: 'sleep',
        duration: 0,
        thumbnail: 'https://images.unsplash.com/photo-1520523839897-bd0b52f945a0?w=400&auto=format&fit=crop&q=60',
        url: 'https://cdn.pixabay.com/download/audio/2022/03/09/audio_24fe8577eb.mp3?filename=piano-moment-9835.mp3',
        description: 'Soft piano melodies for deep sleep.',
        tags: ['piano', 'sleep', 'soft'],
        color: 'bg-blue-900'
    }
];
