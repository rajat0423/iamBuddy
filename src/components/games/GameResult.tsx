import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Trophy, RefreshCw, ArrowLeft } from "lucide-react";
import type { GameResult as GameResultType } from "@/types/games";

interface GameResultProps {
    result: GameResultType;
    onReplay: () => void;
    onExit: () => void;
}

export default function GameResult({ result, onReplay, onExit }: GameResultProps) {
    return (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-md p-4">
            <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="w-full max-w-md bg-white dark:bg-slate-900 rounded-2xl shadow-2xl p-8 border border-slate-200 dark:border-slate-800 text-center space-y-8"
            >
                <div className="mx-auto w-24 h-24 bg-yellow-100 dark:bg-yellow-900/30 rounded-full flex items-center justify-center mb-4">
                    <Trophy className="w-12 h-12 text-yellow-500" />
                </div>

                <div className="space-y-2">
                    <h2 className="text-3xl font-bold">{result.message}</h2>
                    <p className="text-muted-foreground">Great mental workout!</p>
                </div>

                <div className="grid grid-cols-2 gap-4 py-4">
                    <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-xl">
                        <p className="text-sm text-muted-foreground">Score</p>
                        <p className="text-2xl font-bold text-primary">{result.score}</p>
                    </div>
                    <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-xl">
                        <p className="text-sm text-muted-foreground">Accuracy</p>
                        <p className="text-2xl font-bold text-blue-500">{result.accuracy}%</p>
                    </div>
                </div>

                <div className="space-y-3">
                    <Button onClick={onReplay} className="w-full h-12 text-lg rounded-xl gap-2">
                        <RefreshCw className="h-5 w-5" /> Play Again
                    </Button>
                    <Button onClick={onExit} variant="outline" className="w-full h-12 text-lg rounded-xl gap-2">
                        <ArrowLeft className="h-5 w-5" /> Back to Menu
                    </Button>
                </div>
            </motion.div>
        </div>
    );
}
