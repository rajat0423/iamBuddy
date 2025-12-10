export interface SoundTrack {
    id: string;
    title: string;
    category: 'spiritual' | 'nature' | 'healing' | 'focus' | 'sleep' ;
    duration: number; // seconds (best-effort; verify with ffprobe)
    thumbnail: string;
    url: string; // direct audio file URL
    description: string;
    tags: string[];
    color: string;
    source?: string; // page URL where the file & license are shown
}

/*
  NOTE:
  - These files were chosen because their source pages indicate public / creative-commons / royalty-free availability
  - Double-check license pages before commercial use
  - For production, host your own licensed audio (S3 / Cloud Storage) to avoid third-party bandwidth/terms issues
*/

export const CATEGORIES = [
    { id: 'all', title: 'All Sounds' },
    { id: 'spiritual', title: 'Spiritual' },
    { id: 'nature', title: 'Nature' },
    { id: 'healing', title: 'Healing' },
    { id: 'focus', title: 'Focus' },
    { id: 'sleep', title: 'Sleep' },
   
];

export const SOUND_LIBRARY: SoundTrack[] = [
    // 1) SPIRITUAL - OM CHANT (Local)
    {
        id: 'om-chant-archive',
        title: 'Deep Om Chant(Meditative)',
        category: 'spiritual',
        duration: 90,
        thumbnail: 'https://archive.org/services/img/Decagon-Solfeggio_Arrangement', // archive artwork page
        url: '/audio/om_chant.mp3',
        description: 'Deep OM/AUM style chant tuned to solfeggio/528Hz family — grounding, meditative tone.',
        tags: ['om', 'chant', 'mantra', 'grounding'],
        color: 'bg-amber-500',
        source: 'Local File'
    },

    // 2) SPIRITUAL - TIBETAN SINGING BOWL (Local)
    {
        id: 'tibetan-bowl-pixabay',
        title: 'Healing Tibetan Singing Bowl',
        category: 'spiritual',
        duration: 30,
        thumbnail: 'https://picsum.photos/id/1011/400/300',
        url: '/audio/tibetan-bowl-26240%20(1).mp3',
        description: 'Pure singing-bowl strike and harmonic sustain — useful for grounding and session starts.',
        tags: ['bowl', 'tibetan', 'ring'],
        color: 'bg-orange-400',
        source: 'Local File'
    },

    // 3) NATURE - HEAVY RAIN (Local)
    {
        id: 'rain-rooftop-pixabay',
        title: 'Heavy Rain Calming Tone',
        category: 'nature',
        duration: 600,
        thumbnail: 'https://picsum.photos/id/1015/400/300',
        url: '/audio/heavy-rain-white-noise-159772.mp3',
        description: 'Continuous heavy rain ambiance with natural acoustic detail used for deep relaxation and sleep.',
        tags: ['rain', 'heavy', 'sleep'],
        color: 'bg-blue-600',
        source: 'Local File'
    },

    // 4) NATURE - OCEAN WAVES (Local)
    {
        id: 'ocean-waves-archive',
        title: 'Ocean Waves (long mix)',
        category: 'nature',
        duration: 660,
        thumbnail: 'https://picsum.photos/id/1016/400/300',
        url: '/audio/ocean-waves.mp3',
        description: 'Gentle rhythmic ocean waves suitable for sleep and relaxation.',
        tags: ['ocean', 'waves', 'calm'],
        color: 'bg-cyan-500',
        source: 'Local File'
    },

    // 5) NATURE - FOREST AMBIENCE (Local)
    {
        id: 'forest-ambience-pixabay',
        title: 'Forest Ambience',
        category: 'nature',
        duration: 300,
        thumbnail: 'https://picsum.photos/id/1020/400/300',
        url: '/audio/forest-ambience-the-sound-of-trees-337586.mp3',
        description: 'Morning forest birds and gentle wind — clear, natural, relaxing.',
        tags: ['forest', 'birds', 'nature'],
        color: 'bg-green-600',
        source: 'Local File'
    },

    // 6) HEALING - 528Hz (Local)
    {
        id: '528hz-archive',
        title: '528Hz Healing Tone',
        category: 'healing',
        duration: 300,
        thumbnail: 'https://archive.org/services/img/SolTones',
        url: '/audio/528hz-274962.mp3',
        description: 'Solfeggio 528Hz pure tone looped for meditative healing.',
        tags: ['528hz', 'solfeggio', 'healing'],
        color: 'bg-purple-500',
        source: 'Local File'
    },

    // 7) FOCUS - WHITE NOISE (Local)
    {
        id: 'white-noise-freesound',
        title: 'White Noise Loop (stereo)',
        category: 'focus',
        duration: 300,
        thumbnail: 'https://picsum.photos/id/1035/400/300',
        url: '/audio/white-noise-378857.mp3',
        description: 'High-quality stereo white noise sample ideal for masking distractions.',
        tags: ['white-noise', 'focus', 'masking'],
        color: 'bg-slate-400',
        source: 'Local File'
    },

    // 8) FOCUS - LO-FI (Pixabay music)
    

    // 9) SLEEP - DREAMY PIANO (Local)
    {
        id: 'dreamy-piano-pixabay',
        title: 'Soft Dreamy Piano',
        category: 'sleep',
        duration: 300,
        thumbnail: 'https://picsum.photos/id/1050/400/300',
        url: '/audio/soft-dreamy-piano.mp3',
        description: 'Gentle piano melody purpose-built for sleep & unwind.',
        tags: ['piano', 'sleep', 'melody'],
        color: 'bg-blue-900',
        source: 'Local File'
    },

    // 10) BREATH - GUIDED BREATH (Pixabay short guide tone)
    
];
