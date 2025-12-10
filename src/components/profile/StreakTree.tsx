import { Zap, Info } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { cn } from "@/lib/utils";

// Mock data for streak logic
const STREAK_DAYS = 30; // Max days to show on this tree stage
const CURRENT_STREAK = 12;

// Pre-defined coordinates for leaves on a "tree" structure (approximate)
const LEAF_POSITIONS = [
    { x: 50, y: 30 }, { x: 40, y: 40 }, { x: 60, y: 40 }, // Top
    { x: 30, y: 50 }, { x: 70, y: 50 }, { x: 45, y: 55 }, { x: 55, y: 55 },
    { x: 20, y: 60 }, { x: 80, y: 60 }, { x: 35, y: 65 }, { x: 65, y: 65 },
    { x: 25, y: 70 }, { x: 75, y: 70 }, { x: 50, y: 20 }, { x: 45, y: 35 },
    { x: 55, y: 35 }, { x: 35, y: 45 }, { x: 65, y: 45 }, { x: 40, y: 25 },
    { x: 60, y: 25 }, { x: 15, y: 65 }, { x: 85, y: 65 }, { x: 50, y: 15 },
    { x: 42, y: 28 }, { x: 58, y: 28 }, { x: 32, y: 52 }, { x: 68, y: 52 },
    { x: 22, y: 62 }, { x: 78, y: 62 }, { x: 50, y: 10 }
];

export default function StreakTree() {
    return (
        <Card className="border-none overflow-hidden relative min-h-[400px] shadow-xl">
            {/* Background Gradient - Darker for better text contrast */}
            <div className="absolute inset-0 bg-gradient-to-b from-slate-900 via-green-950 to-emerald-950" />

            {/* Ambient Light Effect */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-1/2 bg-green-500/10 blur-[100px] pointer-events-none" />

            <CardHeader className="relative z-10">
                <div className="flex flex-row items-center justify-between">
                    <div>
                        <CardTitle className="flex items-center gap-3 text-2xl text-white drop-shadow-md">
                            <div className="p-2 bg-yellow-500/20 rounded-full">
                                <Zap className="h-6 w-6 text-yellow-400 fill-yellow-400 animate-[pulse_3s_ease-in-out_infinite]" />
                            </div>
                            <span className="font-bold tracking-wide text-transparent bg-clip-text bg-gradient-to-r from-yellow-200 to-yellow-500">
                                My Growth Tree
                            </span>
                        </CardTitle>
                        <CardDescription className="text-emerald-200/70 mt-1">
                            Nurture your mind, grow your tree.
                        </CardDescription>
                    </div>
                    <div className="text-right">
                        <div className="text-4xl font-black text-white drop-shadow-lg tracking-tighter">
                            {CURRENT_STREAK}
                        </div>
                        <div className="text-xs font-medium text-emerald-400 uppercase tracking-widest">
                            Day Streak
                        </div>
                    </div>
                </div>
            </CardHeader>

            <CardContent className="relative z-10 flex justify-center items-end h-[300px] mt-4">
                <div className="relative w-full h-full max-w-[320px] mx-auto">
                    {/* SVG Tree Structure */}
                    <svg viewBox="0 0 100 100" className="w-full h-full overflow-visible drop-shadow-2xl">
                        {/* Trunk and Branches */}
                        <path
                            d="M50 100 L50 80 Q50 60 30 50 M50 80 Q50 60 70 50 M50 80 L50 40 Q50 30 40 20 M50 40 Q50 30 60 20"
                            stroke="#5D4037"
                            strokeWidth="4"
                            fill="none"
                            strokeLinecap="round"
                            className="bg-blend-multiply"
                        />
                        <path
                            d="M50 100 Q45 90 50 80"
                            stroke="#3E2723"
                            strokeWidth="5"
                            fill="none"
                        />

                        {/* Leaves */}
                        {LEAF_POSITIONS.slice(0, STREAK_DAYS).map((pos, i) => {
                            const isUnlocked = i < CURRENT_STREAK;
                            const isLatest = i === CURRENT_STREAK - 1;

                            return (
                                <g key={i} transform={`translate(${pos.x}, ${pos.y})`}>
                                    {isUnlocked ? (
                                        <g className={cn(
                                            "origin-center transition-all duration-1000 ease-out",
                                            isLatest ? "animate-[bounce_2s_infinite]" : ""
                                        )}>
                                            <circle cx="0" cy="0" r="3" className="fill-emerald-500" />
                                            <circle cx="-1.5" cy="-2" r="2.5" className="fill-green-400 opacity-80" />
                                            <circle cx="1.5" cy="-2" r="2.5" className="fill-green-600 opacity-80" />

                                            {/* Glow for active leaves */}
                                            <circle cx="0" cy="0" r="6" className="fill-green-400/20 blur-sm" />
                                        </g>
                                    ) : (
                                        <circle cx="0" cy="0" r="1" className="fill-white/10" />
                                    )}
                                </g>
                            );
                        })}
                    </svg>
                </div>

                {/* Stats Footer */}
                <div className="absolute -bottom-2 w-full flex justify-between px-4 py-3 bg-black/20 backdrop-blur-md rounded-t-xl border border-white/5">
                    <div className="flex items-center gap-2 text-xs text-emerald-200">
                        <Info className="h-3 w-3" />
                        <span>Next milestone: 15 days</span>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
