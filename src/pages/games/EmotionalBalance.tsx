import { useState, useEffect } from "react";
import { motion, AnimatePresence, useAnimation } from "framer-motion";
import GameShell from "@/components/games/GameShell";
import GameResult from "@/components/games/GameResult";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Smile, Frown, Meh, ArrowUp, ArrowLeft, ArrowRight } from "lucide-react";

type Category = 'positive' | 'negative' | 'neutral';

interface EmotionCard {
    id: number;
    content: string;
    type: 'emoji' | 'text';
    category: Category;
}

const CARDS: Omit<EmotionCard, 'id'>[] = [
    { content: "😄", type: 'emoji', category: 'positive' },
    { content: "🎉", type: 'emoji', category: 'positive' },
    { content: "Gratitude", type: 'text', category: 'positive' },
    { content: "Hope", type: 'text', category: 'positive' },
    { content: "😟", type: 'emoji', category: 'negative' },
    { content: "😠", type: 'emoji', category: 'negative' },
    { content: "Anxiety", type: 'text', category: 'negative' },
    { content: "Frustration", type: 'text', category: 'negative' },
    { content: "😐", type: 'emoji', category: 'neutral' },
    { content: "🤔", type: 'emoji', category: 'neutral' },
    { content: "Observable", type: 'text', category: 'neutral' },
    { content: "Fact", type: 'text', category: 'neutral' },
];

export default function EmotionalBalance() {
    const [score, setScore] = useState(0);
    const [timeLeft, setTimeLeft] = useState(60);
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentCard, setCurrentCard] = useState<EmotionCard | null>(null);
    const [gameOver, setGameOver] = useState(false);
    const controls = useAnimation();

    const startGame = () => {
        setScore(0);
        setTimeLeft(60);
        setIsPlaying(true);
        setGameOver(false);
        nextCard();
    };

    const nextCard = () => {
        const random = CARDS[Math.floor(Math.random() * CARDS.length)];
        setCurrentCard({ ...random, id: Date.now() });

        // Reset position
        controls.set({ x: 0, y: 0, opacity: 1, rotate: 0 });
    };

    const handleSort = async (direction: Category) => {
        if (!currentCard || !isPlaying) return;

        const isCorrect = currentCard.category === direction;

        // Animate card away
        let exitX = 0;
        let exitY = 0;
        if (direction === 'positive') exitX = 300;
        if (direction === 'negative') exitX = -300;
        if (direction === 'neutral') exitY = -300;

        await controls.start({
            x: exitX,
            y: exitY,
            opacity: 0,
            rotate: exitX ? (exitX > 0 ? 20 : -20) : 0,
            transition: { duration: 0.2 }
        });

        if (isCorrect) {
            setScore(s => s + 10);
        } else {
            // Penalty or just no points? Let's do visual feedback only for now
            // maybe shake screen?
        }

        nextCard();
    };

    // Timer
    useEffect(() => {
        if (!isPlaying) return;
        const timer = setInterval(() => {
            setTimeLeft(t => {
                if (t <= 1) {
                    setGameOver(true);
                    setIsPlaying(false);
                    return 0;
                }
                return t - 1;
            });
        }, 1000);
        return () => clearInterval(timer);
    }, [isPlaying]);

    return (
        <GameShell
            title="Emotional Sort"
            score={score}
            onRestart={startGame}
            className="flex flex-col items-center justify-center p-6 bg-slate-50/50 dark:bg-slate-900/50"
        >
            <div className="absolute top-4 right-4 bg-slate-100 dark:bg-slate-800 px-3 py-1 rounded-full font-mono text-sm">
                ⏱ {timeLeft}s
            </div>
            {!isPlaying && !gameOver && (
                <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm space-y-6">
                    <div className="grid grid-cols-3 gap-8 text-center max-w-md w-full px-4">
                        <div><ArrowLeft className="mx-auto text-rose-500 mb-2" /> Negative</div>
                        <div><ArrowUp className="mx-auto text-slate-500 mb-2" /> Neutral</div>
                        <div><ArrowRight className="mx-auto text-emerald-500 mb-2" /> Positive</div>
                    </div>
                    <Button size="lg" onClick={startGame} className="text-xl px-12 py-6 rounded-full">
                        Start Sorting
                    </Button>
                </div>
            )}

            {/* Sorting Zones Indicators (Visual only) */}
            <div className="absolute inset-0 pointer-events-none flex flex-col justify-between p-4 opacity-10">
                <div className="text-center font-bold text-slate-500">NEUTRAL</div>
                <div className="flex justify-between font-bold">
                    <div className="text-rose-500">NEGATIVE</div>
                    <div className="text-emerald-500">POSITIVE</div>
                </div>
            </div>

            {/* Card Area */}
            <div className="relative w-full max-w-sm aspect-[3/4] flex items-center justify-center mb-8">
                <AnimatePresence>
                    {currentCard && isPlaying && (
                        <motion.div
                            key={currentCard.id}
                            animate={controls}
                            drag
                            dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
                            dragElastic={0.2}
                            onDragEnd={(_, info) => {
                                if (info.offset.x > 100) handleSort('positive');
                                else if (info.offset.x < -100) handleSort('negative');
                                else if (info.offset.y < -100) handleSort('neutral');
                            }}
                            className="absolute w-full h-full"
                        >
                            <Card className="w-full h-full flex flex-col items-center justify-center p-8 text-center bg-white dark:bg-slate-800 shadow-2xl rounded-3xl border-slate-200 dark:border-slate-700 cursor-grab active:cursor-grabbing">
                                <span className="text-6xl mb-6">{currentCard.type === 'emoji' ? currentCard.content : '💭'}</span>
                                <h3 className="text-3xl font-bold text-slate-800 dark:text-slate-100">
                                    {currentCard.type === 'text' ? currentCard.content : ''}
                                </h3>
                                <p className="mt-8 text-muted-foreground text-sm uppercase tracking-widest">
                                    Swipe to Sort
                                </p>
                            </Card>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* Manual Controls (for accessibility/desktop) */}
            <div className="grid grid-cols-3 gap-4 w-full max-w-md z-20">
                <Button
                    variant="outline"
                    size="lg"
                    className="h-16 rounded-xl border-rose-200 text-rose-600 hover:bg-rose-50 dark:border-rose-900"
                    onClick={() => handleSort('negative')}
                    disabled={!isPlaying}
                >
                    <Frown className="h-6 w-6 mr-2" /> Neg
                </Button>
                <Button
                    variant="outline"
                    size="lg"
                    className="h-16 rounded-xl border-slate-200 text-slate-600 hover:bg-slate-50 dark:border-slate-700"
                    onClick={() => handleSort('neutral')}
                    disabled={!isPlaying}
                >
                    <Meh className="h-6 w-6 mr-2" /> Neu
                </Button>
                <Button
                    variant="outline"
                    size="lg"
                    className="h-16 rounded-xl border-emerald-200 text-emerald-600 hover:bg-emerald-50 dark:border-emerald-900"
                    onClick={() => handleSort('positive')}
                    disabled={!isPlaying}
                >
                    <Smile className="h-6 w-6 mr-2" /> Pos
                </Button>
            </div>

            {/* Result Overlay */}
            <AnimatePresence>
                {gameOver && (
                    <GameResult
                        result={{
                            score: score,
                            streak: 0,
                            accuracy: 100, // Placeholder
                            message: "Session Complete"
                        }}
                        onReplay={startGame}
                        onExit={() => window.history.back()}
                    />
                )}
            </AnimatePresence>

        </GameShell>
    );
}
