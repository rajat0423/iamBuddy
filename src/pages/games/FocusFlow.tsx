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

            setObjects(prev => [...prev, newObj]);
            lastSpawnRef.current = timestamp;
        }

        // Move objects & Cleanup off-screen
        setObjects(prev => {
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
            setObjects(prev => [...prev, newObj]);
        }, 1000 / difficultyRef.current);

        return () => clearInterval(spawnInterval);
    }, [isPlaying]);

    const handleObjectClick = (obj: FallingObject) => {
        // Remove object
        setObjects(prev => prev.filter(o => o.id !== obj.id));

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
        setObjects(prev => prev.filter(o => o.id !== obj.id));
    };

    return (
        <GameShell
            title="Focus Flow"
            score={score}
            onRestart={startGame}
            onPause={() => setIsPlaying(false)}
            className="p-0" // Full bleeding edge
        >
            {!isPlaying && !gameOver && (
                <div className="absolute inset-0 z-10 flex items-center justify-center bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm">
                    <Button size="lg" onClick={startGame} className="text-xl px-12 py-6 rounded-full">
                        Start Focus
                    </Button>
                </div>
            )}

            {/* HUD */}
            <div className="absolute top-4 left-0 right-0 flex justify-between px-8 z-20 pointer-events-none">
                <div className="bg-white/90 dark:bg-slate-800/90 backdrop-blur px-4 py-2 rounded-full shadow-sm flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">Target: </span>
                    <targetShape.icon className={`h-6 w-6 ${targetShape.color}`} />
                </div>

                <div className="bg-white/90 dark:bg-slate-800/90 backdrop-blur px-4 py-2 rounded-full shadow-sm flex items-center gap-1">
                    {Array.from({ length: 3 }).map((_, i) => (
                        <span key={i} className={`h-3 w-3 rounded-full ${i < lives ? 'bg-rose-500' : 'bg-slate-200 dark:bg-slate-700'}`} />
                    ))}
                </div>
            </div>

            {/* Game Area */}
            <div className="relative w-full h-[600px] overflow-hidden bg-gradient-to-b from-slate-50 to-white dark:from-slate-900 dark:to-slate-950">
                <AnimatePresence>
                    {objects.map(obj => {
                        const ShapeIcon = SHAPES.find(s => s.id === obj.shapeId)?.icon || Circle;
                        const shapeColor = SHAPES.find(s => s.id === obj.shapeId)?.color || 'text-gray-500';
                        const isTarget = obj.shapeId === targetShape.id;

                        return (
                            <motion.button
                                key={obj.id}
                                initial={{ y: -50, x: `${obj.x}%`, opacity: 0 }}
                                animate={{ y: 650, opacity: 1 }}
                                exit={{ scale: 0, opacity: 0 }}
                                transition={{ duration: 4 / difficultyRef.current, ease: "linear" }}
                                onAnimationComplete={() => handleAnimationComplete(obj)}
                                onMouseDown={() => handleObjectClick(obj)}
                                className="absolute focus:outline-none"
                                style={{ left: 0 }} // Positioning handled by x in initial
                            >
                                <div className={`p-4 rounded-full ${isTarget ? 'bg-primary/5' : ''} hover:bg-primary/10 transition-colors`}>
                                    <ShapeIcon className={`h-12 w-12 ${shapeColor} drop-shadow-md`} />
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
                            message: timeLeft === 0 ? "Session Complete" : "Focus Broken"
                        }}
                        onReplay={startGame}
                        onExit={() => window.history.back()}
                    />
                )}
            </AnimatePresence>

        </GameShell>
    );
}
