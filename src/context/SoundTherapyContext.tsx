import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import type { SoundTrack } from '@/data/sound-therapy';
import { audioGenerator } from '@/lib/audio-generator';

interface ActiveTrack {
    id: string;
    track: SoundTrack;
    volume: number; // 0-1
    isPlaying: boolean;
    audio: HTMLAudioElement | null; // Null if using generator
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

    // Effect to handle play/pause/volume changes
    useEffect(() => {
        activeTracks.forEach((at: ActiveTrack) => {
            const effectiveVolume = at.volume * globalVolume;

            if (at.audio) {
                // HTML Audio
                at.audio.volume = effectiveVolume;
                if (at.isPlaying && isPlaying) {
                    at.audio.play().catch((e: unknown) => console.error("Play error:", e));
                } else {
                    at.audio.pause();
                }
            } else {
                // Audio Generator Logic (Fallback or specific synthetic tracks)
                audioGenerator.setVolume(effectiveVolume);
                if (at.isPlaying && isPlaying) {
                    // Map IDs to generator functions if we still want synthetic backups
                    // For now, since we have URLs, this is mostly unused unless we add specific synth tracks.
                    if (at.track.category === 'healing') audioGenerator.playBinaural(200, 5);
                    else audioGenerator.playWhiteNoise(); // Default fallback
                } else {
                    audioGenerator.stop();
                }
            }
        });

        // If no tracks, stop generator
        if (activeTracks.length === 0) {
            audioGenerator.stop();
        }

    }, [activeTracks, isPlaying, globalVolume]);

    const playTrack = (track: SoundTrack) => {
        // If already active, just ensure it's playing
        const existing = activeTracks.find((at: ActiveTrack) => at.id === track.id);
        if (existing) {
            const updated = activeTracks.map((at: ActiveTrack) =>
                at.id === track.id ? { ...at, isPlaying: true } : at
            );
            setActiveTracks(updated);
            setIsPlaying(true);
            return;
        }

        // Limit max tracks
        if (activeTracks.length >= 3) {
            // Simplification: Replace oldest? For now just don't add.
            // return;
        }

        // Determine if we should use the synth generator
        let audio: HTMLAudioElement | null = null;

        // New logic: Only use generator if NO URL is provided, or if explicitly flagged (future proofing)
        // With the new library, all tracks have URLs, so we default to HTML Audio.
        const isGenerated = !track.url || track.id.includes('binaural-beta'); // Example of keeping some logic if needed

        if (!isGenerated) {
            audio = new Audio(track.url);
            audio.loop = true;
            audio.addEventListener('error', (e) => {
                console.warn("Audio load failed", e);
            });
        }

        const newActive: ActiveTrack = {
            id: track.id,
            track,
            volume: 0.5,
            isPlaying: true,
            audio
        };

        setActiveTracks((prev: ActiveTrack[]) => [...prev, newActive]);
        setIsPlaying(true);
    };

    const updateTrackState = (id: string, updates: Partial<ActiveTrack>) => {
        setActiveTracks((prev: ActiveTrack[]) => prev.map((at: ActiveTrack) => {
            if (at.id === id) {
                return { ...at, ...updates };
            }
            return at;
        }));
    };

    const togglePlayTrack = (id: string) => {
        const track = activeTracks.find((at: ActiveTrack) => at.id === id);
        if (track) {
            updateTrackState(id, { isPlaying: !track.isPlaying });
        }
    };

    const removeTrack = (id: string) => {
        const track = activeTracks.find((at: ActiveTrack) => at.id === id);
        if (track) {
            if (track.audio) track.audio.pause();
            else audioGenerator.stop(); // If it was the generated one

            setActiveTracks((prev: ActiveTrack[]) => prev.filter((at: ActiveTrack) => at.id !== id));
        }
        if (activeTracks.length <= 1) { // We just removed one, so if length was 1, now 0
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
        activeTracks.forEach((at: ActiveTrack) => {
            if (at.audio) at.audio.pause();
        });
        audioGenerator.stop();
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
