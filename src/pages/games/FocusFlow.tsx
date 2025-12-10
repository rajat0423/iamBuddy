import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import GameShell from "@/components/games/GameShell";
import GameResult from "@/components/games/GameResult";
import { Button } from "@/components/ui/button";
import { Circle, Square, Triangle, Hexagon, Star } from "lucide-react";

// Game Constants
const GAME_DURATION = 90; // seconds
const SPAWN_RATE_START = 1500; // ms
const SHAPES = [
    { id: 'circle', icon: Circle, color: 'text-blue-500' },
    { id: 'square', icon: Square, color: 'text-emerald-500' },
    { id: 'triangle', icon: Triangle, color: 'text-yellow-500' },
    { id: 'hexagon', icon: Hexagon, color: 'text-purple-500' },
    { id: 'star', icon: Star, color: 'text-rose-500' },
];

interface FallingObject {
    id: number;
    shapeId: string;
    x: number; // Percentage 0-100
    speed: number;
}

export default function FocusFlow() {
    const [isPlaying, setIsPlaying] = useState(false);
    const [score, setScore] = useState(0);
    const [lives, setLives] = useState(3);
    const [timeLeft, setTimeLeft] = useState(GAME_DURATION);
    const [objects, setObjects] = useState<FallingObject[]>([]);
    const [targetShape, setTargetShape] = useState(SHAPES[0]);
    const [gameOver, setGameOver] = useState(false);

    const gameLoopRef = useRef<number | null>(null);
    const lastSpawnRef = useRef<number>(0);
    const difficultyRef = useRef(1);

    // Initialize Game
    const startGame = () => {
        setIsPlaying(true);
        setScore(0);
        setLives(3);
        setTimeLeft(GAME_DURATION);
        setObjects([]);
        setGameOver(false);
        difficultyRef.current = 1;

        // Pick random target
        setTargetShape(SHAPES[Math.floor(Math.random() * SHAPES.length)]);
    };

    const endGame = useCallback(() => {
        setIsPlaying(false);
        setGameOver(true);
        if (gameLoopRef.current) cancelAnimationFrame(gameLoopRef.current);
    }, []);

    // Main Game Loop using requestAnimationFrame for smooth movement
    const updateGame = useCallback((timestamp: number) => {
        if (!isPlaying) return;

        // Spawn new objects
        if (timestamp - lastSpawnRef.current > (SPAWN_RATE_START / difficultyRef.current)) {
            const id = Date.now();
            const randomShape = SHAPES[Math.floor(Math.random() * SHAPES.length)];
            const newObj: FallingObject = {
                id,
                shapeId: randomShape.id,
                x: Math.random() * 80 + 10, // Keep within 10-90% width
                speed: 0.3 * difficultyRef.current // Speed increases with difficulty
            };

            setObjects((prev: FallingObject[]) => [...prev, newObj]);
            lastSpawnRef.current = timestamp;
        }

        // Move objects & Cleanup off-screen
        setObjects((prev: FallingObject[]) => {
            const nextObjects = [];
            for (const obj of prev) {
                // Move down (we'll implement movement via CSS/Framer mostly, 
                // but here we manage logic state if we were doing canvas. 
                // actually for React DOM, we might just let CSS animation handle the fall 
                // OR update positions here. Let's rely on CSS animations for performance 
                // and just handle spawning/clicking here to avoid heavy React re-renders on 60fps loop for 20 objects)

                // ...Wait, for accurate "Missed" detection we need to know when they hit bottom.
                // Let's use a simpler approach: pure CSS animations with onAnimationEnd? 
                // No, because we need to click them.

                // Let's stick to a simpler state update for "active objects" and let Framer handle the "falling" visual.
                // We just add them, and they handle their own removal after a timeout.
                nextObjects.push(obj);
            }
            return nextObjects;
        });

        gameLoopRef.current = requestAnimationFrame(updateGame);
    }, [isPlaying]);

    // Timer Tick
    useEffect(() => {
        if (!isPlaying) return;
        const timer = setInterval(() => {
            setTimeLeft(prev => {
                if (prev <= 1) {
                    endGame();
                    return 0;
                }
                return prev - 1;
            });
            // Increase difficulty over time
            difficultyRef.current += 0.05;
        }, 1000);
        return () => clearInterval(timer);
    }, [isPlaying, endGame]);

    // Spawner Effect (Simpler than RAF loops for DOM nodes)
    useEffect(() => {
        if (!isPlaying) return;

        const spawnInterval = setInterval(() => {
            const id = Date.now() + Math.random();
            const randomShape = SHAPES[Math.floor(Math.random() * SHAPES.length)];
            const newObj: FallingObject = {
                id,
                shapeId: randomShape.id,
                x: Math.random() * 80 + 10,
                speed: 3 + Math.random() * 2 // Seconds to fall
            };
            setObjects((prev: FallingObject[]) => [...prev, newObj]);
        }, 1000 / difficultyRef.current);

        return () => clearInterval(spawnInterval);
    }, [isPlaying]);

    const handleObjectClick = (obj: FallingObject) => {
        // Remove object
        setObjects((prev: FallingObject[]) => prev.filter(o => o.id !== obj.id));

        if (obj.shapeId === targetShape.id) {
            // Correct!
            setScore(s => s + 10);
            // Haptic or sound could go here
        } else {
            // Wrong!
            setLives(l => {
                const newLives = l - 1;
                if (newLives <= 0) endGame();
                return newLives;
            });
        }
    };

    const handleAnimationComplete = (obj: FallingObject) => {
        // Logic for when object falls off screen without being clicked
        // If it was a target and we missed it -> penalty? 
        // For "Focus", usually missing a target is okay, but clicking wrong is bad.
        // Let's just remove it.
        setObjects((prev: FallingObject[]) => prev.filter(o => o.id !== obj.id));
    };

    return (
        <GameShell
            title="Focus Flow"
            score={score}
            onRestart={startGame}
            onPause={() => setIsPlaying(false)}
            className="p-0 overflow-hidden" // Full bleeding edge
        >
            {/* Background Atmosphere */}
            <div className="absolute inset-0 bg-gradient-to-b from-slate-900 to-slate-950 -z-10">
                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-100 contrast-150 mix-blend-overlay"></div>
                <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-purple-500/20 rounded-full blur-[100px] animate-pulse" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-blue-500/20 rounded-full blur-[100px] animate-pulse delay-1000" />
            </div>

            {!isPlaying && !gameOver && (
                <div className="absolute inset-0 z-30 flex flex-col items-center justify-center bg-black/40 backdrop-blur-md">
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="text-center space-y-6"
                    >
                        <div className="w-24 h-24 mx-auto rounded-3xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-purple-500/30">
                            <targetShape.icon className="w-12 h-12 text-white" />
                        </div>
                        <h2 className="text-3xl font-bold text-white tracking-tight">Focus Flow</h2>
                        <p className="text-slate-300 max-w-xs mx-auto">Catch the matching shapes. Avoid distractions.</p>
                        <Button
                            size="lg"
                            onClick={startGame}
                            className="text-lg px-12 py-6 rounded-2xl bg-white text-indigo-900 hover:bg-indigo-50 hover:scale-105 transition-all shadow-xl font-bold"
                        >
                            Start Flow
                        </Button>
                    </motion.div>
                </div>
            )}

            {/* Premium HUD */}
            <div className="absolute top-0 left-0 right-0 p-6 flex justify-between items-start z-20 pointer-events-none">
                <div className="flex flex-col gap-2">
                    <div className="bg-white/10 backdrop-blur-lg border border-white/20 px-5 py-3 rounded-2xl shadow-xl flex items-center gap-3">
                        <span className="text-xs font-bold text-white/60 uppercase tracking-widest">Target</span>
                        <div className="h-8 w-1px bg-white/20 mx-1"></div>
                        <targetShape.icon className={`h-8 w-8 ${targetShape.color} drop-shadow-md`} />
                    </div>
                </div>

                <div className="bg-white/10 backdrop-blur-lg border border-white/20 px-5 py-3 rounded-2xl shadow-xl flex items-center gap-1.5">
                    {Array.from({ length: 3 }).map((_, i) => (
                        <motion.span
                            key={i}
                            animate={{ scale: i < lives ? 1 : 0.8, opacity: i < lives ? 1 : 0.3 }}
                            className={`h-3 w-3 rounded-full ${i < lives ? 'bg-rose-500 shadow-[0_0_10px_rgba(244,63,94,0.6)]' : 'bg-slate-600'}`}
                        />
                    ))}
                </div>
            </div>

            {/* Game Area */}
            <div className="relative w-full h-[600px] overflow-hidden">
                <AnimatePresence>
                    {objects.map(obj => {
                        const ShapeIcon = SHAPES.find(s => s.id === obj.shapeId)?.icon || Circle;
                        // Use more vibrant colors via CSS for the glow
                        const shapeColor = SHAPES.find(s => s.id === obj.shapeId)?.color || 'text-gray-500';
                        const isTarget = obj.shapeId === targetShape.id;

                        return (
                            <motion.button
                                key={obj.id}
                                initial={{ y: -60, x: `${obj.x}%`, opacity: 0, rotate: 0 }}
                                animate={{ y: 650, opacity: 1, rotate: 360 }}
                                exit={{ scale: 0, opacity: 0, rotate: 720 }}
                                transition={{
                                    y: { duration: 4 / difficultyRef.current, ease: "linear" },
                                    rotate: { duration: 4 / difficultyRef.current, ease: "linear" },
                                    opacity: { duration: 0.2 }
                                }}
                                onAnimationComplete={() => handleAnimationComplete(obj)}
                                onMouseDown={() => handleObjectClick(obj)}
                                className="absolute focus:outline-none z-10 group"
                                style={{ left: 0 }}
                            >
                                <div className={`
                                    p-4 rounded-full transition-all duration-200 
                                    ${isTarget ? 'bg-primary/10 shadow-[0_0_30px_rgba(var(--primary),0.4)]' : ''} 
                                    group-hover:scale-110
                                `}>
                                    <ShapeIcon
                                        className={`h-14 w-14 ${shapeColor} drop-shadow-[0_8px_16px_rgba(0,0,0,0.3)] filter brightness-125`}
                                        strokeWidth={1.5}
                                    />
                                    {isTarget && (
                                        <div className="absolute inset-0 bg-white/30 rounded-full blur-md animate-pulse" />
                                    )}
                                </div>
                            </motion.button>
                        );
                    })}
                </AnimatePresence>
            </div>

            {/* Result */}
            <AnimatePresence>
                {gameOver && (
                    <GameResult
                        result={{
                            score,
                            streak: 0,
                            accuracy: 100, // Placeholder
                            message: timeLeft === 0 ? "Flow State Achieved" : "Focus Broken"
                        }}
                        onReplay={startGame}
                        onExit={() => window.history.back()}
                    />
                )}
            </AnimatePresence>
        </GameShell>
    );
}
