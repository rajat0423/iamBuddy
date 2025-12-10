import { useState, useEffect } from "react";
import { soundManager } from "@/lib/sound";
import { motion, AnimatePresence } from "framer-motion";
import GameShell from "@/components/games/GameShell";
import GameResult from "@/components/games/GameResult";
import {
    Circle, Square, Triangle, Hexagon, Star, Heart,
    Diamond, Cloud
} from "lucide-react";
import { cn } from "@/lib/utils";

// Define possible shapes
const SHAPES = [
    { id: 'circle', icon: Circle, color: 'text-red-500' },
    { id: 'square', icon: Square, color: 'text-blue-500' },
    { id: 'triangle', icon: Triangle, color: 'text-green-500' },
    { id: 'hexagon', icon: Hexagon, color: 'text-purple-500' },
    { id: 'star', icon: Star, color: 'text-yellow-500' },
    { id: 'heart', icon: Heart, color: 'text-pink-500' },
    { id: 'diamond', icon: Diamond, color: 'text-cyan-500' },
    { id: 'cloud', icon: Cloud, color: 'text-sky-400' },
];

interface Card {
    id: number;
    shapeId: string;
    isFlipped: boolean;
    isMatched: boolean;
}

export default function ShapeMatch() {
    const [cards, setCards] = useState<Card[]>([]);
    const [flippedIndices, setFlippedIndices] = useState<number[]>([]);
    const [score, setScore] = useState(0);
    const [moves, setMoves] = useState(0);
    const [gameWon, setGameWon] = useState(false);
    const [disabled, setDisabled] = useState(false);

    // Initialize Game
    const initializeGame = () => {
        // Create pairs
        const gameShapes = [...SHAPES.slice(0, 8)]; // Use 8 pairs for 4x4 grid
        const deck = [...gameShapes, ...gameShapes]
            .sort(() => Math.random() - 0.5)
            .map((shape, index) => ({
                id: index,
                shapeId: shape.id,
                isFlipped: false,
                isMatched: false
            }));

        setCards(deck);
        setFlippedIndices([]);
        setScore(0);
        setMoves(0);
        setGameWon(false);
        setDisabled(false);
    };

    useEffect(() => {
        initializeGame();
    }, []);

    // Handle Card Click
    const handleCardClick = (index: number) => {
        // Prevent clicking if disabled, already matched, or already flipped
        if (disabled || cards[index].isMatched || cards[index].isFlipped) return;

        soundManager.playFlip();

        const newCards = [...cards];
        newCards[index].isFlipped = true;
        setCards(newCards);

        const newFlippedIndices = [...flippedIndices, index];
        setFlippedIndices(newFlippedIndices);

        if (newFlippedIndices.length === 2) {
            setDisabled(true);
            setMoves(m => m + 1);
            checkForMatch(newFlippedIndices, newCards);
        }
    };

    const checkForMatch = (indices: number[], currentCards: Card[]) => {
        const [firstIndex, secondIndex] = indices;
        const card1 = currentCards[firstIndex];
        const card2 = currentCards[secondIndex];

        if (card1.shapeId === card2.shapeId) {
            soundManager.playMatch();

            // Match found
            setTimeout(() => {
                const matchedCards = [...currentCards];
                matchedCards[firstIndex].isMatched = true;
                matchedCards[secondIndex].isMatched = true;
                setCards(matchedCards);
                setFlippedIndices([]);
                setDisabled(false);
                setScore(prev => prev + 100);

                // Check for win
                if (matchedCards.every(c => c.isMatched)) {
                    soundManager.playWin();
                    setGameWon(true);
                }
            }, 500);

        } else {
            soundManager.playError();
            // No match
            setTimeout(() => {
                const resetCards = [...currentCards];
                resetCards[firstIndex].isFlipped = false;
                resetCards[secondIndex].isFlipped = false;
                setCards(resetCards);
                setFlippedIndices([]);
                setDisabled(false);
            }, 1000);
        }
    };

    // Helper to get icon component
    const getShapeIcon = (shapeId: string) => {
        const shape = SHAPES.find(s => s.id === shapeId);
        if (!shape) return null;
        const Icon = shape.icon;
        return <Icon className={cn("w-8 h-8 md:w-10 md:h-10", shape.color)} />;
    };

    return (
        <GameShell
            title="Shape Match"
            score={score}
            onRestart={initializeGame}
            className="flex flex-col items-center justify-center p-4"
        >
            <div className="w-full max-w-lg mx-auto flex flex-col items-center gap-6">

                {/* Stats */}
                <div className="flex gap-8 text-sm font-medium text-muted-foreground">
                    <div>Moves: <span className="text-primary">{moves}</span></div>
                    <div>Pairs: <span className="text-primary">{cards.filter(c => c.isMatched).length / 2} / 8</span></div>
                </div>

                {/* Grid */}
                <div className="grid grid-cols-4 gap-3 w-full aspect-square md:gap-4">
                    {cards.map((card, index) => (
                        <motion.button
                            key={card.id}
                            layout
                            className={cn(
                                "relative w-full h-full rounded-xl cursor-pointer perspective-1000",
                                card.isMatched ? "opacity-50 cursor-default" : ""
                            )}
                            onClick={() => handleCardClick(index)}
                            whileHover={!card.isFlipped && !card.isMatched ? { scale: 1.05 } : {}}
                            whileTap={!card.isFlipped && !card.isMatched ? { scale: 0.95 } : {}}
                        >
                            <div className={cn(
                                "w-full h-full relative transition-all duration-500 transform-style-3d",
                                card.isFlipped ? "rotate-y-180" : ""
                            )}>
                                {/* Front (Hidden) */}
                                <div className={cn(
                                    "absolute inset-0 backface-hidden bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl shadow-md flex items-center justify-center",
                                    !card.isFlipped && "rotate-y-0"
                                )}>
                                    <div className="w-8 h-8 border-2 border-white/20 rounded-full flex items-center justify-center">
                                        <div className="w-2 h-2 bg-white/40 rounded-full" />
                                    </div>
                                </div>

                                {/* Back (Revealed) */}
                                <div className={cn(
                                    "absolute inset-0 backface-hidden bg-white dark:bg-slate-800 rounded-xl shadow-lg border-2 border-indigo-100 dark:border-indigo-900 flex items-center justify-center rotate-y-180"
                                )}>
                                    {getShapeIcon(card.shapeId)}
                                </div>
                            </div>
                        </motion.button>
                    ))}
                </div>
            </div>

            {/* Win Overlay */}
            <AnimatePresence>
                {gameWon && (
                    <GameResult
                        result={{
                            score: score,
                            streak: 0,
                            accuracy: Math.max(0, 100 - (moves - 8) * 5), // Simple accuracy calc
                            message: "Excellent Memory!"
                        }}
                        onReplay={initializeGame}
                        onExit={() => window.history.back()}
                    />
                )}
            </AnimatePresence>
        </GameShell>
    );
}
