import { useSoundTherapy } from "@/context/SoundTherapyContext";
import { Button } from "@/components/ui/button";
import { Play, Pause, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";
import FullScreenPlayer from "./FullScreenPlayer";
import { motion, AnimatePresence } from "framer-motion";

export default function MiniPlayer() {
    const { activeTracks, isPlaying, toggleGlobalPlay, clearAll } = useSoundTherapy();
    const [isFullOpen, setIsFullOpen] = useState(false);

    if (activeTracks.length === 0) return null;

    const mainTrack = activeTracks[activeTracks.length - 1].track;

    return (
        <>
            <AnimatePresence>
                {!isFullOpen && (
                    <motion.div
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: 20, opacity: 0 }}
                        className="fixed bottom-20 left-4 right-4 md:left-64 md:right-8 h-16 z-40 bg-background/80 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl flex items-center pr-2 overflow-hidden cursor-pointer hover:bg-background/90 transition-colors"
                        onClick={() => setIsFullOpen(true)}
                    >
                        {/* Progress Bar (Visual) */}
                        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-secondary">
                            <div className={cn("h-full bg-primary transition-all duration-1000", isPlaying ? "w-full animate-[progress_60s_linear]" : "w-1/3")} />
                        </div>

                        {/* Art */}
                        <div className="h-16 w-16 relative flex-shrink-0">
                            <img src={mainTrack.thumbnail} alt={mainTrack.title} className="w-full h-full object-cover" />
                            {isPlaying && (
                                <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                                    <div className="flex gap-1 h-3 items-end">
                                        <div className="w-0.5 bg-white animate-[bounce_1s_infinite]" />
                                        <div className="w-0.5 bg-white animate-[bounce_1.2s_infinite]" />
                                        <div className="w-0.5 bg-white animate-[bounce_0.8s_infinite]" />
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Info */}
                        <div className="flex-1 px-4 min-w-0">
                            <h4 className="font-semibold text-sm truncate">
                                {activeTracks.length > 1 ? "Custom Mix" : mainTrack.title}
                            </h4>
                            <p className="text-xs text-muted-foreground truncate">
                                {activeTracks.length > 1 ? `${activeTracks.length} Active Sounds` : mainTrack.category}
                            </p>
                        </div>

                        {/* Controls */}
                        <div className="flex items-center gap-1">
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={(e) => { e.stopPropagation(); toggleGlobalPlay(); }}
                                className="h-10 w-10 rounded-full hover:bg-primary/10"
                            >
                                {isPlaying ? <Pause className="h-5 w-5 fill-current" /> : <Play className="h-5 w-5 ml-0.5 fill-current" />}
                            </Button>
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={(e) => { e.stopPropagation(); clearAll(); }}
                                className="h-10 w-10 rounded-full hover:bg-destructive/10 hover:text-destructive"
                            >
                                <X className="h-5 w-5" />
                            </Button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <FullScreenPlayer isOpen={isFullOpen} onClose={() => setIsFullOpen(false)} />
        </>
    );
}
