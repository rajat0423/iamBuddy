import { useState, useEffect, useCallback, useMemo } from "react";
// import { soundManager } from "@/lib/sound"; // Sound removed as per user request
import { motion, AnimatePresence } from "framer-motion";
import GameShell from "@/components/games/GameShell";
import GameResult from "@/components/games/GameResult";


type GameState = 'PREVIEW' | 'PLAYING' | 'RESULT';

interface Level {
    gridSize: number;
    sequenceLength: number;
    speed: number;
}

// Configuration based on level
// Defined outside component to avoid recreation on every render
const getLevelConfig = (lvl: number): Level => {
    // Increase grid size every 3 levels
    const gridSize = lvl <= 3 ? 3 : lvl <= 6 ? 4 : 5;
    // Sequence length increases with level
    const sequenceLength = 3 + Math.floor((lvl - 1) / 2);
    // Speed increases slightly
    const speed = Math.max(400, 800 - (lvl * 30));
    return { gridSize, sequenceLength, speed };
};

export default function MemoryGrid() {
    const [gameState, setGameState] = useState<GameState>('PREVIEW');
    const [level, setLevel] = useState(1);
    const [score, setScore] = useState(0);
    const [sequence, setSequence] = useState<number[]>([]);
    const [playerSequence, setPlayerSequence] = useState<number[]>([]);
    const [showingSequenceIndex, setShowingSequenceIndex] = useState(-1);
    const [streak, setStreak] = useState(0);

    // Memoize config so it doesn't change on every render unless level changes
    const config = useMemo(() => getLevelConfig(level), [level]);

    const startGame = useCallback(() => {
        setGameState('PREVIEW');
        setPlayerSequence([]);
        setShowingSequenceIndex(-1);

        // Generate new sequence
        const totalTiles = config.gridSize * config.gridSize;
        const newSequence: number[] = [];
        for (let i = 0; i < config.sequenceLength; i++) {
            let nextTile;
            do {
                nextTile = Math.floor(Math.random() * totalTiles);
            } while (newSequence.length > 0 && newSequence[newSequence.length - 1] === nextTile); // Prevent immediate duplicate for clarity
            newSequence.push(nextTile);
        }
        setSequence(newSequence);

        // Play sequence animation
        let i = 0;
        const interval = setInterval(() => {
            setShowingSequenceIndex(i); // Show index in sequence array
            // soundManager.playSequenceTone(newSequence[i]); // Removed sound
            setTimeout(() => setShowingSequenceIndex(-1), config.speed * 0.6); // Hide tile

            i++;
            if (i >= newSequence.length) {
                clearInterval(interval);
                setTimeout(() => setGameState('PLAYING'), 500);
            }
        }, config.speed);

        // Cleanup interval on unmount or restart
        return () => clearInterval(interval);

    }, [config]);

    useEffect(() => {
        const cleanup = startGame();
        return () => {
            if (cleanup) cleanup();
        };
    }, [startGame]);

    const handleTileClick = (index: number) => {
        if (gameState !== 'PLAYING') return;

        const newPlayerSequence = [...playerSequence, index];
        setPlayerSequence(newPlayerSequence);
        // soundManager.playSequenceTone(index); // Removed sound

        // Check if correct so far
        const currentIndex = newPlayerSequence.length - 1;
        if (newPlayerSequence[currentIndex] !== sequence[currentIndex]) {
            // Wrong tile!
            // soundManager.playError(); // Removed sound
            endGame(false);
            return;
        }

        // Correct! Check if sequence complete
        if (newPlayerSequence.length === sequence.length) {
            // Level complete
            setScore((s: number) => s + (10 * level) + (streak * 5));
            setStreak((s: number) => s + 1);
            // soundManager.playMatch(); // Removed sound
            setTimeout(() => {
                setLevel((l: number) => l + 1);
                // Effect will trigger startGame
            }, 500);
        }
    };

    const endGame = (completed: boolean) => {
        setGameState('RESULT');
        if (!completed) {
            setStreak(0);
        }
    };

    const restartGame = () => {
        setLevel(1);
        setScore(0);
        setStreak(0);
        startGame();
    };

    return (
        <GameShell
            title="Memory Grid"
            score={score}
            onRestart={restartGame}
            className="flex flex-col items-center justify-center p-6"
        >
            <div className="flex flex-col items-center justify-center w-full max-w-lg mx-auto h-full space-y-8">

                {/* Helper Text */}
                <div className="text-center h-8">
                    {gameState === 'PREVIEW' && (
                        <p className="text-lg font-medium text-primary animate-pulse">Watch the sequence...</p>
                    )}
                    {gameState === 'PLAYING' && (
                        <p className="text-lg font-medium text-slate-500">Repeat the pattern</p>
                    )}
                </div>

                {/* Grid */}
                <div
                    className="grid gap-4 w-full aspect-square max-h-[500px]"
                    style={{
                        gridTemplateColumns: `repeat(${config.gridSize}, 1fr)`
                    }}
                >
                    {Array.from({ length: config.gridSize * config.gridSize }).map((_, i) => {
                        // Determine state of this tile
                        const isSequenceActive = gameState === 'PREVIEW' && showingSequenceIndex !== -1 && sequence[showingSequenceIndex] === i;

                        // Assign a consistent color based on index
                        const COLORS = [
                            "from-pink-500 to-rose-500",
                            "from-orange-500 to-amber-500",
                            "from-yellow-400 to-amber-400", // Brighter yellow
                            "from-lime-500 to-green-600",
                            "from-emerald-400 to-teal-500",
                            "from-cyan-400 to-sky-500",
                            "from-indigo-400 to-purple-500",
                            "from-fuchsia-400 to-pink-500",
                            "from-rose-400 to-red-500",
                        ];
                        const colorClass = COLORS[i % COLORS.length];

                        return (
                            <motion.button
                                key={i}
                                whileTap={{ scale: 0.9 }}
                                onClick={() => handleTileClick(i)}
                                disabled={gameState !== 'PLAYING'}
                                animate={isSequenceActive ? {
                                    scale: [1, 1.1, 1],
                                    brightness: [1, 1.5, 1],
                                    filter: "brightness(1.5)",
                                    transition: { duration: 0.3 }
                                } : {
                                    scale: 1,
                                    filter: "brightness(1)",
                                }}
                                className={`
                  relative rounded-2xl shadow-lg border-b-4 border-black/10 overflow-hidden
                  bg-gradient-to-br ${colorClass}
                  ${gameState === 'PLAYING' ? 'hover:brightness-110 cursor-pointer' : 'cursor-default'}
                  transition-all duration-200
                `}
                            >
                                {/* Active Glow Effect */}
                                <AnimatePresence>
                                    {isSequenceActive && (
                                        <motion.div
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            exit={{ opacity: 0 }}
                                            className="absolute inset-0 bg-white/50 mix-blend-overlay"
                                        />
                                    )}
                                </AnimatePresence>

                                {/* Inner Shine */}
                                <div className="absolute top-0 left-0 w-full h-1/2 bg-gradient-to-b from-white/20 to-transparent pointer-events-none" />
                            </motion.button>
                        );
                    })}
                </div>
            </div>

            {/* Result Overlay */}
            <AnimatePresence>
                {gameState === 'RESULT' && (
                    <GameResult
                        result={{
                            score: score,
                            streak: streak,
                            accuracy: Math.min(100, Math.floor((score / (level * 10)) * 100)), // Rough approximation
                            message: "Pattern Lost!"
                        }}
                        onReplay={restartGame}
                        onExit={() => window.history.back()}
                    />
                )}
            </AnimatePresence>
        </GameShell>
    );
}
