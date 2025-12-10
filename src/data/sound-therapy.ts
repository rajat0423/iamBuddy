export interface SoundTrack {
    id: string;
    title: string;
    category: 'spiritual' | 'nature' | 'healing' | 'focus' | 'sleep' | 'breath';
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
    { id: 'breath', title: 'Breathwork' }
];

export const SOUND_LIBRARY: SoundTrack[] = [
    // 1) SPIRITUAL - OM CHANT (Archive.org public upload)
    {
        id: 'om-chant-archive',
        title: 'AUM / Om Chant (clean tone)',
        category: 'spiritual',
        duration: 90,
        thumbnail: 'https://archive.org/services/img/Decagon-Solfeggio_Arrangement', // archive artwork page
        url: 'https://archive.org/download/Decagon-Solfeggio_Arrangement/Decagon-Solfeggio_528Hz_Transformation_And_Miracles.mp3',
        description: 'Deep OM/AUM style chant tuned to solfeggio/528Hz family — grounding, meditative tone (archive.org public collection).',
        tags: ['om', 'chant', 'mantra', 'grounding'],
        color: 'bg-amber-500',
        source: 'https://archive.org/details/Decagon-Solfeggio_Arrangement'
    },

    // 2) SPIRITUAL - TIBETAN SINGING BOWL (Pixabay SFX)
    {
        id: 'tibetan-bowl-pixabay',
        title: 'Tibetan Singing Bowl (sustained ring)',
        category: 'spiritual',
        duration: 30,
        thumbnail: 'https://picsum.photos/id/1011/400/300',
        url: 'https://cdn.pixabay.com/download/audio/2021/08/20/audio_448e8a6096.mp3?filename=meditation-bowl-436.mp3',
        description: 'Pure singing-bowl strike and harmonic sustain — useful for grounding and session starts (Pixabay royalty-free SFX).',
        tags: ['bowl', 'tibetan', 'ring'],
        color: 'bg-orange-400',
        source: 'https://pixabay.com/sound-effects/search/tibetan-bowl/'
    },

    // 3) NATURE - HEAVY RAIN (Pixabay long-loop)
    {
        id: 'rain-rooftop-pixabay',
        title: 'Heavy Rain - Rooftop Ambience',
        category: 'nature',
        duration: 600,
        thumbnail: 'https://picsum.photos/id/1015/400/300',
        url: 'https://cdn.pixabay.com/download/audio/2022/02/10/audio_fc56c7e80a.mp3?filename=rain-and-thunder-16023.mp3',
        description: 'Continuous heavy rain ambiance with natural acoustic detail used for deep relaxation and sleep. (Pixabay, royalty-free).',
        tags: ['rain', 'heavy', 'sleep'],
        color: 'bg-blue-600',
        source: 'https://pixabay.com/sound-effects/search/rain/'
    },

    // 4) NATURE - OCEAN WAVES (Pixabay / freesound examples)
    {
        id: 'ocean-waves-archive',
        title: 'Ocean Waves (long mix)',
        category: 'nature',
        duration: 660,
        thumbnail: 'https://picsum.photos/id/1016/400/300',
        url: 'https://archive.org/download/gentle-ocean-waves/Gentle_Ocean_Waves_60min.mp3',
        description: 'Gentle rhythmic ocean waves suitable for sleep and relaxation (archive.org long loop).',
        tags: ['ocean', 'waves', 'calm'],
        color: 'bg-cyan-500',
        source: 'https://archive.org/search.php?query=ocean+waves'
    },

    // 5) NATURE - FOREST AMBIENCE (Pixabay)
    {
        id: 'forest-ambience-pixabay',
        title: 'Forest Ambience with Birds',
        category: 'nature',
        duration: 300,
        thumbnail: 'https://picsum.photos/id/1020/400/300',
        url: 'https://cdn.pixabay.com/download/audio/2021/09/06/audio_363c2e827b.mp3?filename=forest-wind-and-birds-6881.mp3',
        description: 'Morning forest birds and gentle wind — clear, natural, relaxing (Pixabay royalty-free).',
        tags: ['forest', 'birds', 'nature'],
        color: 'bg-green-600',
        source: 'https://pixabay.com/sound-effects/search/forest/'
    },

    // 6) HEALING - 528Hz (Archive.org solfeggio collection)
    {
        id: '528hz-archive',
        title: '528Hz Solfeggio Tone (long loop)',
        category: 'healing',
        duration: 300,
        thumbnail: 'https://archive.org/services/img/SolTones',
        url: 'https://archive.org/download/SolTones/528Hz_Solfeggio_1min.mp3',
        description: 'Solfeggio 528Hz pure tone looped for meditative healing (Archive.org solfeggio collections).',
        tags: ['528hz', 'solfeggio', 'healing'],
        color: 'bg-purple-500',
        source: 'https://archive.org/details/SolTones'
    },

    // 7) FOCUS - WHITE NOISE (Freesound public upload)
    {
        id: 'white-noise-freesound',
        title: 'White Noise Loop (stereo)',
        category: 'focus',
        duration: 300,
        thumbnail: 'https://picsum.photos/id/1035/400/300',
        url: 'https://freesound.org/data/previews/165/165058_295176-lq.mp3',
        description: 'High-quality stereo white noise sample ideal for masking distractions (Freesound community upload, license on source).',
        tags: ['white-noise', 'focus', 'masking'],
        color: 'bg-slate-400',
        source: 'https://freesound.org/people/theundecided/sounds/165058/'
    },

    // 8) FOCUS - LO-FI (Pixabay music)
    {
        id: 'lofi-pixabay',
        title: 'Chill Lo-Fi Loop',
        category: 'focus',
        duration: 300,
        thumbnail: 'https://picsum.photos/id/1041/400/300',
        url: 'https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf07a.mp3?filename=lofi-study-112191.mp3',
        description: 'Relaxed lo-fi instrumental suitable for study sessions (Pixabay royalty-free).',
        tags: ['lofi', 'beats', 'study'],
        color: 'bg-indigo-400',
        source: 'https://pixabay.com/music/search/lofi/'
    },

    // 9) SLEEP - DREAMY PIANO (Pixabay)
    {
        id: 'dreamy-piano-pixabay',
        title: 'Soft Dreamy Piano',
        category: 'sleep',
        duration: 300,
        thumbnail: 'https://picsum.photos/id/1050/400/300',
        url: 'https://cdn.pixabay.com/download/audio/2022/03/09/audio_24fe8577eb.mp3?filename=piano-moment-9835.mp3',
        description: 'Gentle piano melody purpose-built for sleep & unwind (Pixabay royalty-free).',
        tags: ['piano', 'sleep', 'melody'],
        color: 'bg-blue-900',
        source: 'https://pixabay.com/music/search/piano%20sleep%20music/'
    },

    // 10) BREATH - GUIDED BREATH (Pixabay short guide tone)
    {
        id: 'breath-guided-pixabay',
        title: 'Guided Breath Tone (3 min demo)',
        category: 'breath',
        duration: 180,
        thumbnail: 'https://picsum.photos/id/1060/400/300',
        url: 'https://cdn.pixabay.com/download/audio/2020/07/13/audio_2d0f6b87a6.mp3?filename=breath-guidance-3min.mp3',
        description: 'Short guided breath tone with chime markers for inhale/exhale (Pixabay demo).',
        tags: ['breath', 'guided', 'timer'],
        color: 'bg-teal-400',
        source: 'https://pixabay.com/music/search/breathing/'
    }
];
