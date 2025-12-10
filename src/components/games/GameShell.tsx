import type { ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowLeft, Pause, RefreshCw } from "lucide-react";

interface GameShellProps {
    children: ReactNode;
    title: string;
    score?: number;
    onPause?: () => void;
    onRestart?: () => void;
    className?: string;
}

export default function GameShell({
    children,
    title,
    score = 0,
    onPause,
    onRestart,
    className = ""
}: GameShellProps) {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-background flex flex-col items-center p-4 md:p-8">
            {/* Header */}
            <div className="w-full max-w-4xl flex items-center justify-between mb-8">
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => navigate('/games')}
                    className="rounded-full hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                    <ArrowLeft className="h-6 w-6" />
                </Button>

                <h1 className="text-xl md:text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">
                    {title}
                </h1>

                <div className="flex items-center gap-2">
                    {onRestart && (
                        <Button variant="ghost" size="icon" onClick={onRestart} className="rounded-full">
                            <RefreshCw className="h-5 w-5" />
                        </Button>
                    )}
                    {onPause && (
                        <Button variant="ghost" size="icon" onClick={onPause} className="rounded-full">
                            <Pause className="h-5 w-5" />
                        </Button>
                    )}
                    <div className="bg-primary/10 px-4 py-1.5 rounded-full font-mono font-bold text-primary">
                        {score}
                    </div>
                </div>
            </div>

            {/* Game Area */}
            <Card className={`w-full max-w-4xl flex-1 relative overflow-hidden bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm border-slate-200 dark:border-slate-800 shadow-xl ${className}`}>
                {children}
            </Card>
        </div>
    );
}
