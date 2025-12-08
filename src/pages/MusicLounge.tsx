import { useState, useRef, useEffect } from "react";
import Layout from "@/components/shared/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Play, Pause, SkipBack, SkipForward, Volume2, Music, CloudRain, Wind, Coffee } from "lucide-react";
import { Slider } from "@/components/ui/slider";

const tracks = [
    {
        id: 1,
        title: "Gentle Rain",
        artist: "Nature Sounds",
        icon: CloudRain,
        color: "text-blue-400",
        bg: "bg-blue-400/20",
        url: "https://cdn.pixabay.com/download/audio/2022/02/10/audio_fc56c7e80a.mp3?filename=rain-and-thunder-16023.mp3", // Placeholder
    },
    {
        id: 2,
        title: "Forest Ambience",
        artist: "Relaxation",
        icon: Wind,
        color: "text-green-400",
        bg: "bg-green-400/20",
        url: "https://cdn.pixabay.com/download/audio/2021/09/06/audio_363c2e827b.mp3?filename=forest-wind-and-birds-6881.mp3", // Placeholder
    },
    {
        id: 3,
        title: "Lo-Fi Beats",
        artist: "Chill Vibes",
        icon: Coffee,
        color: "text-amber-400",
        bg: "bg-amber-400/20",
        url: "https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf07a.mp3?filename=lofi-study-112191.mp3", // Placeholder
    },
];

export default function MusicLounge() {
    const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);
    const [volume, setVolume] = useState([0.5]);
    const audioRef = useRef<HTMLAudioElement | null>(null);

    const currentTrack = tracks[currentTrackIndex];

    useEffect(() => {
        if (audioRef.current) {
            audioRef.current.volume = volume[0];
        }
    }, [volume]);

    useEffect(() => {
        if (isPlaying) {
            audioRef.current?.play().catch(() => setIsPlaying(false));
        } else {
            audioRef.current?.pause();
        }
    }, [isPlaying, currentTrackIndex]);

    const togglePlay = () => setIsPlaying(!isPlaying);

    const nextTrack = () => {
        setCurrentTrackIndex((prev) => (prev + 1) % tracks.length);
        setIsPlaying(true);
    };

    const prevTrack = () => {
        setCurrentTrackIndex((prev) => (prev - 1 + tracks.length) % tracks.length);
        setIsPlaying(true);
    };

    return (
        <Layout>
            <div className="max-w-4xl mx-auto h-[calc(100vh-8rem)] flex flex-col justify-center relative overflow-hidden">
                {/* Visualizer Background Effect */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none -z-10">
                    <div className={`w-64 h-64 rounded-full blur-3xl transition-colors duration-1000 ${currentTrack.bg} ${isPlaying ? "animate-pulse scale-110" : "scale-100"}`} />
                    <div className={`absolute w-96 h-96 rounded-full blur-3xl opacity-30 transition-colors duration-1000 ${currentTrack.bg} ${isPlaying ? "animate-ping" : ""}`} />
                </div>

                <div className="text-center space-y-2 mb-8">
                    <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent inline-flex items-center gap-2">
                        <Music className="h-8 w-8 text-primary" />
                        Mindful Music Lounge
                    </h1>
                    <p className="text-muted-foreground">
                        Immerse yourself in calming sounds to relax and focus.
                    </p>
                </div>

                <div className="grid md:grid-cols-2 gap-8 items-center">
                    {/* Now Playing Card */}
                    <Card className="glass-card border-none overflow-hidden relative aspect-square flex flex-col items-center justify-center p-8">
                        <div className={`w-48 h-48 rounded-full flex items-center justify-center mb-6 transition-all duration-700 ${currentTrack.bg} ${isPlaying ? "animate-[spin_10s_linear_infinite]" : ""}`}>
                            <currentTrack.icon className={`h-24 w-24 ${currentTrack.color}`} />
                        </div>
                        <div className="text-center space-y-1">
                            <h2 className="text-2xl font-bold">{currentTrack.title}</h2>
                            <p className="text-muted-foreground">{currentTrack.artist}</p>
                        </div>
                    </Card>

                    {/* Controls & Playlist */}
                    <div className="space-y-6">
                        <Card className="glass-card border-none p-6">
                            <div className="flex flex-col gap-6">
                                {/* Progress Bar (Visual only for MVP) */}
                                <div className="h-1 w-full bg-muted rounded-full overflow-hidden">
                                    <div className={`h-full ${currentTrack.color.replace("text-", "bg-")} w-1/3 animate-pulse`} />
                                </div>

                                {/* Main Controls */}
                                <div className="flex items-center justify-center gap-6">
                                    <Button variant="ghost" size="icon" onClick={prevTrack} className="h-12 w-12 rounded-full hover:bg-primary/10">
                                        <SkipBack className="h-6 w-6" />
                                    </Button>
                                    <Button
                                        size="icon"
                                        onClick={togglePlay}
                                        className={`h-16 w-16 rounded-full shadow-lg transition-transform hover:scale-105 ${isPlaying ? "bg-primary" : "bg-secondary"}`}
                                    >
                                        {isPlaying ? <Pause className="h-8 w-8" /> : <Play className="h-8 w-8 pl-1" />}
                                    </Button>
                                    <Button variant="ghost" size="icon" onClick={nextTrack} className="h-12 w-12 rounded-full hover:bg-primary/10">
                                        <SkipForward className="h-6 w-6" />
                                    </Button>
                                </div>

                                {/* Volume */}
                                <div className="flex items-center gap-3 px-4">
                                    <Volume2 className="h-4 w-4 text-muted-foreground" />
                                    <Slider
                                        value={[volume[0] * 100]}
                                        max={100}
                                        step={1}
                                        onValueChange={(val) => setVolume([val[0] / 100])}
                                        className="flex-1"
                                    />
                                </div>
                            </div>
                        </Card>

                        {/* Playlist */}
                        <Card className="glass-card border-none p-4">
                            <div className="space-y-2">
                                {tracks.map((track, index) => (
                                    <button
                                        key={track.id}
                                        onClick={() => {
                                            setCurrentTrackIndex(index);
                                            setIsPlaying(true);
                                        }}
                                        className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all ${currentTrackIndex === index
                                                ? "bg-primary/10 ring-1 ring-primary/20"
                                                : "hover:bg-white/40 dark:hover:bg-white/5"
                                            }`}
                                    >
                                        <div className={`p-2 rounded-lg ${track.bg}`}>
                                            <track.icon className={`h-4 w-4 ${track.color}`} />
                                        </div>
                                        <div className="text-left flex-1">
                                            <p className={`text-sm font-medium ${currentTrackIndex === index ? "text-primary" : ""}`}>
                                                {track.title}
                                            </p>
                                            <p className="text-xs text-muted-foreground">{track.artist}</p>
                                        </div>
                                        {currentTrackIndex === index && isPlaying && (
                                            <div className="flex gap-0.5 items-end h-3">
                                                <div className="w-0.5 bg-primary h-full animate-[bounce_1s_infinite]" />
                                                <div className="w-0.5 bg-primary h-2/3 animate-[bounce_1.2s_infinite]" />
                                                <div className="w-0.5 bg-primary h-1/3 animate-[bounce_0.8s_infinite]" />
                                            </div>
                                        )}
                                    </button>
                                ))}
                            </div>
                        </Card>
                    </div>
                </div>

                <audio
                    ref={audioRef}
                    src={currentTrack.url}
                    onEnded={nextTrack}
                    loop={false}
                />
            </div>
        </Layout>
    );
}
