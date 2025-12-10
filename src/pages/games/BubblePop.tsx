import { useState, useEffect, useRef } from "react";
import { soundManager } from "@/lib/sound";
import { motion, AnimatePresence } from "framer-motion";
import Layout from "@/components/shared/Layout";
import { Button } from "@/components/ui/button";
import { ArrowLeft, RefreshCw, Trophy } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface Bubble {
    id: number;
    x: number;
    y: number;
    size: number;
    color: string;
    speed: number;
}

const COLORS = [
    "bg-red-400", "bg-blue-400", "bg-green-400", "bg-yellow-400",
    "bg-purple-400", "bg-pink-400", "bg-indigo-400", "bg-teal-400"
];

export default function BubblePop() {
    const navigate = useNavigate();
    const [bubbles, setBubbles] = useState<Bubble[]>([]);
    const [score, setScore] = useState(0);
    const [timeLeft, setTimeLeft] = useState(60);
    const [isPlaying, setIsPlaying] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);
    const requestRef = useRef<number>(0);

    const spawnBubble = () => {
        if (!containerRef.current) return;
        const width = containerRef.current.clientWidth;

        const newBubble: Bubble = {
            id: Date.now() + Math.random(),
            x: Math.random() * (width - 60),
            y: containerRef.current.clientHeight + 60,
            size: Math.random() * 40 + 40, // 40-80px
            color: COLORS[Math.floor(Math.random() * COLORS.length)],
            speed: Math.random() * 2 + 1,
        };

        setBubbles((prev: Bubble[]) => [...prev, newBubble]);
    };

    const startGame = () => {
        setIsPlaying(true);
        setScore(0);
        setTimeLeft(60);
        setBubbles([]);
    };

    useEffect(() => {
        if (!isPlaying) return;

        const interval = setInterval(() => {
            spawnBubble();
        }, 800);

        const timer = setInterval(() => {
            setTimeLeft((prev: number) => {
                if (prev <= 1) {
                    setIsPlaying(false);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => {
            clearInterval(interval);
            clearInterval(timer);
        };
    }, [isPlaying]);

    useEffect(() => {
        if (!isPlaying) return;

        const updatePositions = () => {
            setBubbles((prev: Bubble[]) =>
                prev
                    .map((b: Bubble) => ({ ...b, y: b.y - b.speed }))
                    .filter((b: Bubble) => b.y > -100)
            );
            requestRef.current = requestAnimationFrame(updatePositions);
        };

        requestRef.current = requestAnimationFrame(updatePositions);
        return () => cancelAnimationFrame(requestRef.current);
    }, [isPlaying]);

    const popBubble = (id: number) => {
        if (!isPlaying) return;
        setBubbles((prev: Bubble[]) => prev.filter((b: Bubble) => b.id !== id));
        setScore((s: number) => s + 10);

        // Simple pop sound effect using Web Audio API
        soundManager.playPop();
    };

    return (
        <Layout>
            <div className="h-[calc(100vh-8rem)] max-w-4xl mx-auto flex flex-col relative overflow-hidden">
                <div className="flex items-center justify-between mb-4 z-10">
                    <Button variant="ghost" onClick={() => navigate("/games")}>
                        <ArrowLeft className="mr-2 h-4 w-4" /> Back
                    </Button>
                    <div className="flex gap-6 text-xl font-bold">
                        <div className="flex items-center gap-2 text-primary">
                            <Trophy className="h-6 w-6" />
                            {score}
                        </div>
                        <div className="w-16 text-center tabular-nums bg-secondary/50 rounded-lg">
                            {timeLeft}s
                        </div>
                    </div>
                </div>

                <div
                    ref={containerRef}
                    className="flex-1 bg-gradient-to-b from-blue-50 to-indigo-100 dark:from-slate-900 dark:to-slate-800 rounded-3xl relative overflow-hidden border-4 border-white/20 shadow-xl"
                >
                    {!isPlaying && (
                        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/40 backdrop-blur-sm z-50 text-white">
                            <h1 className="text-5xl font-bold mb-4">Bubble Pop</h1>
                            <p className="text-xl mb-8 opacity-90">Pop as many bubbles as you can!</p>
                            <Button
                                size="lg"
                                onClick={startGame}
                                className="text-xl h-16 w-48 rounded-full shadow-lg hover:scale-105 transition-transform bg-primary"
                            >
                                {score > 0 ? <RefreshCw className="mr-2 h-6 w-6" /> : null}
                                {score > 0 ? "Play Again" : "Start"}
                            </Button>
                            {score > 0 && <p className="mt-4 text-2xl font-bold">Final Score: {score}</p>}
                        </div>
                    )}

                    <AnimatePresence>
                        {bubbles.map((bubble: Bubble) => (
                            <motion.button
                                key={bubble.id}
                                initial={{ scale: 0, opacity: 0 }}
                                animate={{
                                    x: bubble.x,
                                    y: bubble.y,
                                    scale: 1,
                                    opacity: 0.8
                                }}
                                exit={{ scale: 1.5, opacity: 0 }}
                                onClick={() => popBubble(bubble.id)}
                                className={`absolute rounded-full cursor-pointer shadow-inner backdrop-blur-sm border-2 border-white/40 ${bubble.color}`}
                                style={{
                                    width: bubble.size,
                                    height: bubble.size,
                                    left: 0, // Position is handled by translate via Framer Motion animate x/y or just style top/left.
                                    // Optimization: Use style directly for frequent updates to avoid React render overhead, 
                                    // but for <50 items motion is fine. 
                                    // Actually, Framer Motion animate prop is heavy for 60fps game loop. 
                                    // Let's use inline styles for position.
                                }}
                            // Override animate to avoid conflict with loop
                            // Using style for performance
                            >
                                {/* Glare effect */}
                                <div className="absolute top-2 left-3 w-1/3 h-1/3 bg-white/40 rounded-full blur-[1px]" />
                            </motion.button>
                        ))}
                        {/* Re-render optimization: Map directly to div with inline styles for position */}
                        {bubbles.map((bubble: Bubble) => (
                            <div
                                key={bubble.id}
                                onMouseDown={() => popBubble(bubble.id)}
                                className={`absolute rounded-full cursor-pointer shadow-inner backdrop-blur-md border border-white/50 ${bubble.color} hover:brightness-110 active:scale-95 transition-transform`}
                                style={{
                                    width: bubble.size,
                                    height: bubble.size,
                                    transform: `translate(${bubble.x}px, ${bubble.y}px)`,
                                    opacity: 0.8
                                }}
                            >
                                <div className="absolute top-[15%] left-[20%] w-[25%] h-[15%] bg-white/60 rounded-[50%] rotate-[-45deg] blur-[0.5px]" />
                            </div>
                        ))}
                    </AnimatePresence>
                </div>
            </div>
        </Layout>
    );
}
