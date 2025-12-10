import type { SoundTrack } from "@/data/sound-therapy";
import { Play, Pause } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSoundTherapy } from "@/context/SoundTherapyContext";
import { cn } from "@/lib/utils";

interface SoundCardProps {
    track: SoundTrack;
}

export default function SoundCard({ track }: SoundCardProps) {
    const { playTrack, activeTracks, removeTrack } = useSoundTherapy();

    const active = activeTracks.find(at => at.id === track.id);


    const handlePlay = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (active) {
            removeTrack(track.id);
        } else {
            playTrack(track);
        }
    };

    return (
        <div className="group relative overflow-hidden rounded-2xl aspect-square cursor-pointer transition-all hover:scale-[1.02] active:scale-95">
            {/* Background Image */}
            <div className="absolute inset-0">
                <img
                    src={track.thumbnail}
                    alt={track.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className={cn("absolute inset-0 bg-black/30 group-hover:bg-black/50 transition-colors", active ? "bg-black/60" : "")} />
            </div>

            {/* Content info */}
            <div className="absolute inset-0 p-4 flex flex-col justify-end text-white">
                <div className="transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                    <h3 className="font-bold text-lg leading-tight mb-1">{track.title}</h3>
                    <p className="text-xs opacity-80 line-clamp-1">{track.description}</p>
                </div>
            </div>

            {/* Center Play Button */}
            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <Button
                    size="icon"
                    variant="secondary"
                    className={cn("h-14 w-14 rounded-full shadow-lg scale-90 group-hover:scale-100 transition-all duration-300", active ? "bg-primary text-primary-foreground hover:bg-primary/90" : "bg-white/90 hover:bg-white")}
                    onClick={handlePlay}
                >
                    {active ? <Pause className="h-6 w-6" /> : <Play className="h-6 w-6 ml-1" />}
                </Button>
            </div>

            {/* Active Indicator */}
            {active && (
                <div className="absolute top-3 right-3">
                    <div className="flex gap-1 h-3 items-end">
                        <div className="w-1 bg-primary animate-[bounce_1s_infinite]" />
                        <div className="w-1 bg-primary animate-[bounce_1.2s_infinite]" />
                        <div className="w-1 bg-primary animate-[bounce_0.8s_infinite]" />
                    </div>
                </div>
            )}
        </div>
    );
}
