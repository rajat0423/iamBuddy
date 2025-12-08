import { useState, useEffect } from "react";
import Layout from "@/components/shared/Layout";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Sparkles, Sun, Moon, Cloud, Star, Heart, Music, Coffee, RefreshCw, Trophy } from "lucide-react";

const ICONS = [Sun, Moon, Cloud, Star, Heart, Music, Coffee, Sparkles];

interface CardType {
    id: number;
    icon: any;
    isFlipped: boolean;
    isMatched: boolean;
}

export default function Games() {
    const [cards, setCards] = useState<CardType[]>([]);
    const [flippedCards, setFlippedCards] = useState<number[]>([]);
    const [moves, setMoves] = useState(0);
    const [matches, setMatches] = useState(0);
    const [isWon, setIsWon] = useState(false);

    useEffect(() => {
        initializeGame();
    }, []);

    const initializeGame = () => {
        const shuffledIcons = [...ICONS, ...ICONS]
            .sort(() => Math.random() - 0.5)
            .map((icon, index) => ({
                id: index,
                icon,
                isFlipped: false,
                isMatched: false,
            }));
        setCards(shuffledIcons);
        setFlippedCards([]);
        setMoves(0);
        setMatches(0);
        setIsWon(false);
    };

    const handleCardClick = (id: number) => {
        if (flippedCards.length === 2 || cards[id].isFlipped || cards[id].isMatched) return;

        const newCards = [...cards];
        newCards[id].isFlipped = true;
        setCards(newCards);

        const newFlippedCards = [...flippedCards, id];
        setFlippedCards(newFlippedCards);

        if (newFlippedCards.length === 2) {
            setMoves((prev) => prev + 1);
            checkForMatch(newFlippedCards, newCards);
        }
    };

    const checkForMatch = (flipped: number[], currentCards: CardType[]) => {
        const [first, second] = flipped;
        if (currentCards[first].icon === currentCards[second].icon) {
            currentCards[first].isMatched = true;
            currentCards[second].isMatched = true;
            setCards(currentCards);
            setFlippedCards([]);
            setMatches((prev) => {
                const newMatches = prev + 1;
                if (newMatches === ICONS.length) setIsWon(true);
                return newMatches;
            });
        } else {
            setTimeout(() => {
                const resetCards = [...currentCards];
                resetCards[first].isFlipped = false;
                resetCards[second].isFlipped = false;
                setCards(resetCards);
                setFlippedCards([]);
            }, 1000);
        }
    };

    return (
        <Layout>
            <div className="max-w-4xl mx-auto h-[calc(100vh-8rem)] flex flex-col items-center justify-center">
                <div className="text-center space-y-2 mb-8">
                    <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent inline-flex items-center gap-2">
                        <Sparkles className="h-8 w-8 text-primary" />
                        Memory Match
                    </h1>
                    <p className="text-muted-foreground">
                        Clear your mind by finding matching pairs.
                    </p>
                </div>

                <div className="flex items-center gap-8 mb-6">
                    <div className="text-lg font-medium">Moves: {moves}</div>
                    <Button onClick={initializeGame} variant="outline" className="gap-2">
                        <RefreshCw className="h-4 w-4" />
                        Restart
                    </Button>
                </div>

                {isWon ? (
                    <Card className="glass-card border-none p-12 text-center space-y-6 animate-in zoom-in duration-500">
                        <div className="w-24 h-24 bg-yellow-100 rounded-full flex items-center justify-center mx-auto">
                            <Trophy className="h-12 w-12 text-yellow-500" />
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold text-primary">You Won!</h2>
                            <p className="text-muted-foreground">Great focus! You cleared the board in {moves} moves.</p>
                        </div>
                        <Button onClick={initializeGame} size="lg" className="w-full">
                            Play Again
                        </Button>
                    </Card>
                ) : (
                    <div className="grid grid-cols-4 gap-4 w-full max-w-md aspect-square">
                        {cards.map((card) => (
                            <button
                                key={card.id}
                                onClick={() => handleCardClick(card.id)}
                                className={`relative w-full h-full rounded-xl transition-all duration-500 transform preserve-3d ${card.isFlipped || card.isMatched ? "rotate-y-180" : ""
                                    }`}
                                style={{ perspective: "1000px" }}
                            >
                                <div
                                    className={`absolute inset-0 w-full h-full rounded-xl flex items-center justify-center backface-hidden transition-all duration-300 ${card.isFlipped || card.isMatched
                                            ? "bg-white dark:bg-slate-800 border-2 border-primary rotate-y-180"
                                            : "bg-gradient-to-br from-primary to-secondary shadow-md hover:shadow-lg hover:scale-105"
                                        }`}
                                >
                                    {(card.isFlipped || card.isMatched) ? (
                                        <card.icon className="h-8 w-8 text-primary animate-in zoom-in duration-300" />
                                    ) : (
                                        <Sparkles className="h-6 w-6 text-white/50" />
                                    )}
                                </div>
                            </button>
                        ))}
                    </div>
                )}
            </div>
        </Layout>
    );
}
