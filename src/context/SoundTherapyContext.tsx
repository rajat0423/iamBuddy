import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import type { SoundTrack } from '@/data/sound-therapy';

interface ActiveTrack {
    id: string;
    track: SoundTrack;
    volume: number; // 0-1
    isPlaying: boolean;
    audio: HTMLAudioElement;
}

interface SoundTherapyContextType {
    activeTracks: ActiveTrack[];
    playTrack: (track: SoundTrack) => void;
    togglePlayTrack: (trackId: string) => void;
    removeTrack: (trackId: string) => void;
    setTrackVolume: (trackId: string, volume: number) => void;
    setGlobalVolume: (volume: number) => void;
    globalVolume: number;
    clearAll: () => void;
    isPlaying: boolean;
    toggleGlobalPlay: () => void;
}

const SoundTherapyContext = createContext<SoundTherapyContextType | undefined>(undefined);

export function SoundTherapyProvider({ children }: { children: ReactNode }) {
    const [activeTracks, setActiveTracks] = useState<ActiveTrack[]>([]);
    const [globalVolume, setGlobalVolumeValue] = useState(1);
    const [isPlaying, setIsPlaying] = useState(false);

    // Effect to handle play/pause/volume changes on actual audio elements
    useEffect(() => {
        activeTracks.forEach(at => {
            if (at.isPlaying && isPlaying) {
                at.audio.play().catch(e => console.error("Play error:", e));
            } else {
                at.audio.pause();
            }
            at.audio.volume = at.volume * globalVolume;
            at.audio.loop = true; // Default to loop for ambience
        });
    }, [activeTracks, isPlaying, globalVolume]);

    const playTrack = (track: SoundTrack) => {
        // If already active, just ensure it's playing
        const existing = activeTracks.find(at => at.id === track.id);
        if (existing) {
            updateTrackState(track.id, { isPlaying: true });
            setIsPlaying(true);
            return;
        }

        // Limit max tracks for performance (e.g., 3)
        if (activeTracks.length >= 3) {
            // Optional: warn user or remove oldest. For now, just return.
            // alert("Max 3 tracks allowed in mixer.");
            // return;
        }

        const audio = new Audio(track.url);
        audio.loop = true;

        const newActive: ActiveTrack = {
            id: track.id,
            track,
            volume: 0.5,
            isPlaying: true,
            audio
        };

        setActiveTracks(prev => [...prev, newActive]);
        setIsPlaying(true);
    };

    const updateTrackState = (id: string, updates: Partial<ActiveTrack>) => {
        setActiveTracks(prev => prev.map(at => {
            if (at.id === id) {
                return { ...at, ...updates };
            }
            return at;
        }));
    };

    const togglePlayTrack = (id: string) => {
        const track = activeTracks.find(at => at.id === id);
        if (track) {
            updateTrackState(id, { isPlaying: !track.isPlaying });
        }
    };

    const removeTrack = (id: string) => {
        const track = activeTracks.find(at => at.id === id);
        if (track) {
            track.audio.pause();
            setActiveTracks(prev => prev.filter(at => at.id !== id));
        }
        if (activeTracks.length <= 1) {
            setIsPlaying(false);
        }
    };

    const setTrackVolume = (id: string, vol: number) => {
        updateTrackState(id, { volume: vol });
    };

    const setGlobalVolume = (vol: number) => {
        setGlobalVolumeValue(vol);
    };

    const toggleGlobalPlay = () => {
        setIsPlaying(!isPlaying);
    };

    const clearAll = () => {
        activeTracks.forEach(at => at.audio.pause());
        setActiveTracks([]);
        setIsPlaying(false);
    };

    return (
        <SoundTherapyContext.Provider value={{
            activeTracks,
            playTrack,
            togglePlayTrack,
            removeTrack,
            setTrackVolume,
            setGlobalVolume,
            globalVolume,
            clearAll,
            isPlaying,
            toggleGlobalPlay
        }}>
            {children}
        </SoundTherapyContext.Provider>
    );
}

export function useSoundTherapy() {
    const context = useContext(SoundTherapyContext);
    if (!context) {
        throw new Error("useSoundTherapy must be used within a SoundTherapyProvider");
    }
    return context;
}
