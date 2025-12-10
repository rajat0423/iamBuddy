import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import GameShell from "@/components/games/GameShell";
import GameResult from "@/components/games/GameResult";


type GameState = 'PREVIEW' | 'PLAYING' | 'RESULT';

interface Level {
    gridSize: number;
    sequenceLength: number;
    speed: number;
}

export default function MemoryGrid() {
    const [gameState, setGameState] = useState<GameState>('PREVIEW');
    const [level, setLevel] = useState(1);
    const [score, setScore] = useState(0);
    const [sequence, setSequence] = useState<number[]>([]);
    const [playerSequence, setPlayerSequence] = useState<number[]>([]);
    const [showingSequenceIndex, setShowingSequenceIndex] = useState(-1);
    const [streak, setStreak] = useState(0);

    // Configuration based on level
    const getLevelConfig = (lvl: number): Level => {
        // Increase grid size every 3 levels
        const gridSize = lvl <= 3 ? 3 : lvl <= 6 ? 4 : 5;
        // Sequence length increases with level
        const sequenceLength = 3 + Math.floor((lvl - 1) / 2);
        // Speed increases slightly
        const speed = Math.max(400, 800 - (lvl * 30));
        return { gridSize, sequenceLength, speed };
    };

    const config = getLevelConfig(level);

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
            setTimeout(() => setShowingSequenceIndex(-1), config.speed * 0.6); // Hide tile

            i++;
            if (i >= newSequence.length) {
                clearInterval(interval);
                setTimeout(() => setGameState('PLAYING'), 500);
            }
        }, config.speed);

    }, [level, config]);

    useEffect(() => {
        startGame();
    }, [startGame]);

    const handleTileClick = (index: number) => {
        if (gameState !== 'PLAYING') return;

        const newPlayerSequence = [...playerSequence, index];
        setPlayerSequence(newPlayerSequence);

        // Check if correct so far
        const currentIndex = newPlayerSequence.length - 1;
        if (newPlayerSequence[currentIndex] !== sequence[currentIndex]) {
            // Wrong tile!
            endGame(false);
            return;
        }

        // Correct! Check if sequence complete
        if (newPlayerSequence.length === sequence.length) {
            // Level complete
            setScore(s => s + (10 * level) + (streak * 5));
            setStreak(s => s + 1);
            setTimeout(() => {
                setLevel(l => l + 1);
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
                    className="grid gap-3 w-full aspect-square max-h-[500px]"
                    style={{
                        gridTemplateColumns: `repeat(${config.gridSize}, 1fr)`
                    }}
                >
                    {Array.from({ length: config.gridSize * config.gridSize }).map((_, i) => {
                        // Determine state of this tile
                        let isActive = false;

                        if (gameState === 'PREVIEW') {
                            // If we are showing this exact step in the sequence
                            if (showingSequenceIndex !== -1 && sequence[showingSequenceIndex] === i) {
                                isActive = true;
                            }
                        } else if (gameState === 'PLAYING') {
                            // Flash when user taps? could add visual feedback here
                        }

                        return (
                            <motion.button
                                key={i}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => handleTileClick(i)}
                                disabled={gameState !== 'PLAYING'}
                                className={`
                  rounded-2xl transition-all duration-200 relative overflow-hidden shadow-sm
                  ${isActive ? 'bg-primary shadow-[0_0_30px_rgba(var(--primary),0.6)] scale-105 z-10' : 'bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700'}
                `}
                            >
                                {/* Inner glow for active state */}
                                {isActive && (
                                    <motion.div
                                        layoutId="active-glow"
                                        className="absolute inset-0 bg-white/30"
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                    />
                                )}
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
