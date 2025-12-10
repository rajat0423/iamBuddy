import { useSoundTherapy } from "@/context/SoundTherapyContext";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { X, Volume2 } from "lucide-react";

export default function SoundMixer() {
    const { activeTracks, setTrackVolume, removeTrack } = useSoundTherapy();

    if (activeTracks.length === 0) return null;

    return (
        <div className="space-y-4 py-4">
            <h3 className="font-semibold text-lg flex items-center gap-2">
                <Volume2 className="h-5 w-5 text-primary" />
                Current Mix
            </h3>

            <div className="space-y-4">
                {activeTracks.map(active => (
                    <div key={active.id} className="flex items-center gap-4 bg-secondary/30 p-3 rounded-xl">
                        <img
                            src={active.track.thumbnail}
                            alt={active.track.title}
                            className="w-12 h-12 rounded-lg object-cover"
                        />
                        <div className="flex-1 space-y-2">
                            <div className="flex justify-between items-center">
                                <span className="text-sm font-medium">{active.track.title}</span>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-6 w-6 text-muted-foreground hover:text-destructive"
                                    onClick={() => removeTrack(active.id)}
                                >
                                    <X className="h-4 w-4" />
                                </Button>
                            </div>
                            <Slider
                                value={[active.volume * 100]}
                                max={100}
                                step={1}
                                onValueChange={(v) => setTrackVolume(active.id, v[0] / 100)}
                                className="h-2"
                            />
                        </div>
                    </div>
                ))}
            </div>

            {activeTracks.length < 3 && (
                <p className="text-xs text-muted-foreground text-center italic mt-2">
                    Add up to {3 - activeTracks.length} more sounds to your mix
                </p>
            )}
        </div>
    );
}
