import { useState, useEffect } from "react";
import { useSoundTherapy } from "@/context/SoundTherapyContext";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import {
    Play, Pause, ChevronDown, Volume2, Timer,
    Info, Heart, SlidersHorizontal, SkipBack, SkipForward
} from "lucide-react";
import {
    Dialog, DialogContent,
    DialogTrigger
} from "@/components/ui/dialog"; // Note: might need to adjust imports based on shadcn structure
import { Drawer, DrawerContent, DrawerTrigger } from "@/components/ui/drawer"; // Assuming standard shadcn drawer
import SoundMixer from "./SoundMixer";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

interface FullScreenPlayerProps {
    isOpen: boolean;
    onClose: () => void;
}

const TIMERS = [5, 10, 20, 30, 60];

export default function FullScreenPlayer({ isOpen, onClose }: FullScreenPlayerProps) {
    const {
        activeTracks, isPlaying, toggleGlobalPlay,
        globalVolume, setGlobalVolume, clearAll,
        playNext, playPrevious
    } = useSoundTherapy();

    // Use the first track as the "Main" display usually
    // Or if mixed, maybe show a "Mix" iconography.
    // For simplicity, we show the most recently added or first one.
    const mainTrack = activeTracks[activeTracks.length - 1]?.track;

    const [timerMinutes, setTimerMinutes] = useState<number | null>(null);
    const [timeLeft, setTimeLeft] = useState<number | null>(null);

    const [isFavorite, setIsFavorite] = useState(false);

    useEffect(() => {
        if (timerMinutes) {
            setTimeLeft(timerMinutes * 60);
        } else {
            setTimeLeft(null);
        }
    }, [timerMinutes]);

    useEffect(() => {
        if (!timeLeft || !isPlaying) return;

        const interval = setInterval(() => {
            setTimeLeft((prev) => {
                if (prev && prev <= 1) {
                    clearAll();
                    setTimerMinutes(null);
                    return null;
                }
                return prev ? prev - 1 : null;
            });
        }, 1000);

        return () => clearInterval(interval);
    }, [timeLeft, isPlaying]);

    const formatTime = (seconds: number) => {
        const m = Math.floor(seconds / 60);
        const s = seconds % 60;
        return `${m}:${s.toString().padStart(2, '0')}`;
    };

    if (!activeTracks.length && isOpen) {
        // Auto close if empty, but maybe wait for animation
        // onClose();
    }

    if (!mainTrack) return null;

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ y: "100%" }}
                    animate={{ y: 0 }}
                    exit={{ y: "100%" }}
                    transition={{ type: "spring", damping: 25, stiffness: 200 }}
                    className="fixed inset-0 z-[100] bg-background/95 backdrop-blur-3xl flex flex-col"
                >
                    {/* Header */}
                    <div className="flex items-center justify-between p-6">
                        <Button variant="ghost" size="icon" onClick={onClose} className="rounded-full">
                            <ChevronDown className="h-6 w-6" />
                        </Button>
                        <span className="text-xs font-medium tracking-widest uppercase opacity-70">Now Playing</span>
                        <Button variant="ghost" size="icon" className="rounded-full">
                            <Info className="h-5 w-5" />
                        </Button>
                    </div>

                    {/* Main Content */}
                    <div className="flex-1 flex flex-col items-center justify-center p-8 space-y-12">

                        {/* Wrapper for Circular Art & Waves */}
                        <div className="relative w-72 h-72 md:w-96 md:h-96 flex items-center justify-center">
                            {/* Animated Waves */}
                            {isPlaying && (
                                <>
                                    <div className="absolute inset-0 rounded-full bg-primary/20 animate-[ping_4s_cubic-bezier(0,0,0.2,1)_infinite]" />
                                    <div className="absolute inset-0 rounded-full bg-primary/10 animate-[ping_6s_cubic-bezier(0,0,0.2,1)_infinite] delay-1000" />
                                </>
                            )}

                            {/* Art Card */}
                            <div className="relative w-64 h-64 md:w-80 md:h-80 rounded-full overflow-hidden shadow-2xl ring-4 ring-white/10 rotate-slow">
                                <img
                                    src={mainTrack.thumbnail}
                                    alt={mainTrack.title}
                                    className={cn("w-full h-full object-cover transition-transform duration-[20s] linear-ease", isPlaying ? "rotate-3" : "")}
                                    style={{ animation: isPlaying ? 'spin 60s linear infinite' : 'none' }}
                                />
                                {/* Center hole for vinyl look? Or just gradient overlay */}
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                            </div>
                        </div>

                        {/* Text Info */}
                        <div className="text-center space-y-2">
                            <h2 className="text-3xl font-bold md:text-4xl">
                                {activeTracks.length > 1 ? "Custom Mix" : mainTrack.title}
                            </h2>
                            <p className="text-lg text-muted-foreground">
                                {activeTracks.length > 1
                                    ? `${activeTracks.length} sounds blending`
                                    : mainTrack.category.charAt(0).toUpperCase() + mainTrack.category.slice(1)}
                            </p>
                        </div>

                        {/* Controls */}
                        <div className="w-full max-w-md space-y-8">
                            {/* Time / Scrubber (Visual only for endless loops mostly) */}
                            <div className="space-y-2">
                                {timeLeft && (
                                    <div className="text-center font-mono text-2xl font-light text-primary">
                                        {formatTime(timeLeft)}
                                    </div>
                                )}
                            </div>

                            {/* Main Buttons */}
                            <div className="flex items-center justify-center gap-8">
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className={cn("h-12 w-12 rounded-full", isFavorite ? "text-red-500" : "text-muted-foreground")}
                                    onClick={() => setIsFavorite(!isFavorite)}
                                >
                                    <Heart className={cn("h-6 w-6", isFavorite ? "fill-current" : "")} />
                                </Button>

                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-12 w-12 rounded-full text-muted-foreground hover:text-primary"
                                    onClick={playPrevious}
                                >
                                    <SkipBack className="h-8 w-8" />
                                </Button>

                                <Button
                                    size="icon"
                                    className="h-20 w-20 rounded-full shadow-xl hover:scale-105 transition-transform"
                                    onClick={toggleGlobalPlay}
                                >
                                    {isPlaying ? <Pause className="h-8 w-8" /> : <Play className="h-8 w-8 ml-1" />}
                                </Button>

                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-12 w-12 rounded-full text-muted-foreground hover:text-primary"
                                    onClick={playNext}
                                >
                                    <SkipForward className="h-8 w-8" />
                                </Button>

                                <Drawer>
                                    <DrawerTrigger asChild>
                                        <Button variant="ghost" size="icon" className="h-12 w-12 rounded-full text-muted-foreground hover:text-primary">
                                            <SlidersHorizontal className="h-6 w-6" />
                                        </Button>
                                    </DrawerTrigger>
                                    <DrawerContent className="p-6 h-[60vh]">
                                        <div className="max-w-md mx-auto w-full h-full overflow-y-auto">
                                            <SoundMixer />
                                        </div>
                                    </DrawerContent>
                                </Drawer>
                            </div>

                            {/* Volume & Timer */}
                            <div className="flex items-center gap-4 px-4">
                                <Volume2 className="h-5 w-5 text-muted-foreground" />
                                <Slider
                                    value={[globalVolume * 100]}
                                    max={100}
                                    onValueChange={(v) => setGlobalVolume(v[0] / 100)}
                                    className="flex-1"
                                />

                                <Dialog>
                                    <DialogTrigger asChild>
                                        <Button variant="ghost" size="icon" className={cn("h-8 w-8", timerMinutes ? "text-primary bg-primary/10" : "text-muted-foreground")}>
                                            <Timer className="h-5 w-5" />
                                        </Button>
                                    </DialogTrigger>
                                    <DialogContent>
                                        <div className="text-center py-6 space-y-4">
                                            <h3 className="text-xl font-bold">Sleep Timer</h3>
                                            <div className="grid grid-cols-3 gap-3">
                                                {TIMERS.map(m => (
                                                    <Button
                                                        key={m}
                                                        variant={timerMinutes === m ? "default" : "outline"}
                                                        onClick={() => { setTimerMinutes(m); }}
                                                    >
                                                        {m} min
                                                    </Button>
                                                ))}
                                                <Button
                                                    variant="secondary"
                                                    onClick={() => setTimerMinutes(null)}
                                                    className="col-span-3 text-destructive"
                                                >
                                                    Cancel Timer
                                                </Button>
                                            </div>
                                        </div>
                                    </DialogContent>
                                </Dialog>
                            </div>
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}

// Add simple CSS animation to index.css later or rely on tailwind animate-spin
