import { ArrowUp, ArrowDown, Activity } from "lucide-react";

export default function WellnessWidget({ score = 85, trend = "up" }: { score?: number; trend?: "up" | "down" }) {
    const radius = 40;
    const circumference = 2 * Math.PI * radius;
    const strokeDashoffset = circumference - (score / 100) * circumference;

    return (
        <div className="glass-card rounded-3xl p-6 flex items-center justify-between relative overflow-hidden group cursor-pointer">
            {/* Background Decor */}
            <div className="absolute right-0 top-0 w-32 h-32 bg-gradient-to-br from-primary/10 to-secondary/10 rounded-bl-full -z-10 transition-transform group-hover:scale-110" />

            <div>
                <h3 className="text-lg font-semibold text-foreground mb-1">Wellness Score</h3>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    {trend === "up" ? (
                        <span className="flex items-center text-green-500 bg-green-50 px-2 py-0.5 rounded-full text-xs font-medium">
                            <ArrowUp className="w-3 h-3 mr-1" /> +2%
                        </span>
                    ) : (
                        <span className="flex items-center text-amber-500 bg-amber-50 px-2 py-0.5 rounded-full text-xs font-medium">
                            <ArrowDown className="w-3 h-3 mr-1" /> -1%
                        </span>
                    )}
                    <span>vs last week</span>
                </div>

                {/* Mini Sparkline Placeholder */}
                <div className="mt-4 h-8 w-24 flex items-end gap-1 opacity-50">
                    {[40, 60, 45, 70, 65, 85, 80].map((h, i) => (
                        <div key={i} className="w-2 bg-primary rounded-t-sm" style={{ height: `${h}%` }} />
                    ))}
                </div>
            </div>

            {/* Circular Gauge */}
            <div className="relative w-24 h-24 flex items-center justify-center">
                <svg className="w-full h-full transform -rotate-90">
                    {/* Background Circle */}
                    <circle
                        cx="48"
                        cy="48"
                        r={radius}
                        className="stroke-muted"
                        strokeWidth="8"
                        fill="none"
                    />
                    {/* Progress Circle */}
                    <circle
                        cx="48"
                        cy="48"
                        r={radius}
                        className="stroke-primary transition-all duration-1000 ease-out"
                        strokeWidth="8"
                        strokeLinecap="round"
                        fill="none"
                        style={{
                            strokeDasharray: circumference,
                            strokeDashoffset: strokeDashoffset,
                        }}
                    />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-2xl font-bold text-foreground">{score}</span>
                    <Activity className="w-4 h-4 text-primary" />
                </div>
            </div>
        </div>
    );
}
