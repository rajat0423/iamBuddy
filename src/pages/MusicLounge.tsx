import { useState, useMemo } from "react";
import Layout from "@/components/shared/Layout";
import { SoundTherapyProvider } from "@/context/SoundTherapyContext";
import { CATEGORIES, SOUND_LIBRARY } from "@/data/sound-therapy";
import SoundCard from "@/components/sound-therapy/SoundCard";
import CategoryPills from "@/components/sound-therapy/CategoryPills";
import MiniPlayer from "@/components/sound-therapy/MiniPlayer";
import { Music, Sparkles } from "lucide-react";


function SoundTherapyContent() {
    const [selectedCategory, setSelectedCategory] = useState("all");

    // Mood Recommendation Logic (Mock)
    // In a real app, this would read from a mood context or local storage
    const getRecommendation = () => {
        const hour = new Date().getHours();
        if (hour < 10) return { mood: "Morning Energy", tag: "focus" };
        if (hour > 20) return { mood: "Deep Sleep", tag: "sleep" };
        return { mood: "Stress Relief", tag: "nature" };
    };

    const recommendation = getRecommendation();

    const filteredSounds = useMemo(() => {
        if (selectedCategory === "all") return SOUND_LIBRARY;
        return SOUND_LIBRARY.filter(s => s.category === selectedCategory);
    }, [selectedCategory]);

    const recommendedSounds = useMemo(() => {
        return SOUND_LIBRARY.filter(s => s.category === recommendation.tag).slice(0, 2);
    }, [recommendation]);

    return (
        <Layout>
            <div className="max-w-7xl mx-auto pb-32 space-y-8 min-h-screen">
                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 py-6">
                    <div>
                        <h1 className="text-3xl font-bold bg-gradient-to-r from-teal-400 to-blue-500 bg-clip-text text-transparent flex items-center gap-2">
                            <Music className="h-8 w-8 text-teal-500" />
                            Sound Sanctuary
                        </h1>
                        <p className="text-muted-foreground mt-1">
                            Curated soundscapes for healing, focus, and sleep.
                        </p>
                    </div>
                    {/* Simple Mood Widget */}
                    <div className="bg-secondary/30 backdrop-blur-md px-4 py-2 rounded-full border border-white/10 flex items-center gap-3">
                        <div className="p-2 bg-yellow-500/20 rounded-full">
                            <Sparkles className="h-4 w-4 text-yellow-500" />
                        </div>
                        <div className="text-sm">
                            <p className="opacity-70 text-xs">Recommended for you</p>
                            <p className="font-semibold text-primary">{recommendation.mood}</p>
                        </div>
                    </div>
                </div>

                {/* Categories */}
                <CategoryPills
                    categories={CATEGORIES}
                    selectedId={selectedCategory}
                    onSelect={setSelectedCategory}
                />

                {/* Main Grid */}
                <div className="space-y-8">
                    {/* Recommended Section (Only if All is selected) */}
                    {selectedCategory === 'all' && (
                        <div className="space-y-4">
                            <h2 className="text-xl font-semibold flex items-center gap-2">
                                <Sparkles className="h-5 w-5 text-amber-400" />
                                Recommended for {recommendation.mood}
                            </h2>
                            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                                {recommendedSounds.map(track => (
                                    <SoundCard key={track.id} track={track} />
                                ))}
                            </div>
                        </div>
                    )}

                    {/* All Sounds */}
                    <div className="space-y-4">
                        <h2 className="text-xl font-semibold">
                            {selectedCategory === 'all' ? 'Browse All' : CATEGORIES.find(c => c.id === selectedCategory)?.title}
                        </h2>
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                            {filteredSounds.map(track => (
                                <SoundCard key={track.id} track={track} />
                            ))}
                        </div>
                        {filteredSounds.length === 0 && (
                            <div className="text-center py-20 opacity-50">
                                <p>No sounds found in this category yet.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <MiniPlayer />
        </Layout>
    );
}

export default function MusicLounge() {
    return (
        <SoundTherapyProvider>
            <SoundTherapyContent />
        </SoundTherapyProvider>
    );
}

