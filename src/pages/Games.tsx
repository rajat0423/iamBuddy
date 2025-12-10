import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import Layout from "@/components/shared/Layout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Brain, Zap, Heart, Sparkles, Trophy, Activity, ArrowRight, CircleDashed, Shapes } from "lucide-react";
import type { GameConfig } from "@/types/games";

const GAMES: GameConfig[] = [
    {
        id: 'memory',
        title: "Memory Legend",
        description: "Enhance pattern recall and spatial memory.",
        icon: Brain,
        color: "text-emerald-500",
        route: "/games/memory",
        difficulty: "Medium"
    },
    {
        id: 'focus',
        title: "Focus Flow",
        description: "Train attention and inhibition control.",
        icon: Zap,
        color: "text-blue-500",
        route: "/games/focus",
        difficulty: "Hard"
    },
    {
        id: 'emotion',
        title: "Emotional Balance",
        description: "Practice rapid emotional regulation.",
        icon: Heart,
        color: "text-rose-500",
        route: "/games/emotion",
        difficulty: "Easy"
    },
    {
        id: 'bubble',
        title: "Bubble Pop",
        description: "Simple stress relief by popping bubbles.",
        icon: CircleDashed,
        color: "text-purple-500",
        route: "/games/bubble",
        difficulty: "Easy"
    },
    {
        id: 'shape-match',
        title: "Shape Match",
        description: "Test your memory by matching pairs of shapes.",
        icon: Shapes,
        color: "text-orange-500",
        route: "/games/shape-match",
        difficulty: "Medium"
    }
];

export default function GameHub() {
    const navigate = useNavigate();

    return (
        <Layout>
            <div className="max-w-6xl mx-auto space-y-8 pb-12">
                {/* Header Section */}
                <div className="text-center space-y-4 py-8">
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="inline-flex items-center justify-center p-3 bg-primary/10 rounded-full mb-4"
                    >
                        <Sparkles className="h-8 w-8 text-primary" />
                    </motion.div>
                    <motion.h1
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary via-purple-500 to-secondary bg-clip-text text-transparent"
                    >
                        Brain & Balance
                    </motion.h1>
                    <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                        Scientifically inspired games to sharpen your mind and calm your spirit.
                    </p>
                </div>

                {/* Stats Overview */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-12">
                    <Card className="p-6 flex items-center gap-4 hover:shadow-lg transition-all border-none bg-gradient-to-br from-emerald-500/10 to-transparent">
                        <div className="p-4 bg-emerald-500/20 rounded-full text-emerald-600">
                            <Trophy className="h-6 w-6" />
                        </div>
                        <div>
                            <p className="text-sm text-muted-foreground font-medium">Total Score</p>
                            <h3 className="text-2xl font-bold">24,500</h3>
                        </div>
                    </Card>
                    <Card className="p-6 flex items-center gap-4 hover:shadow-lg transition-all border-none bg-gradient-to-br from-blue-500/10 to-transparent">
                        <div className="p-4 bg-blue-500/20 rounded-full text-blue-600">
                            <Activity className="h-6 w-6" />
                        </div>
                        <div>
                            <p className="text-sm text-muted-foreground font-medium">Daily Streak</p>
                            <h3 className="text-2xl font-bold">5 Days</h3>
                        </div>
                    </Card>
                    <Card className="p-6 flex items-center gap-4 hover:shadow-lg transition-all border-none bg-gradient-to-br from-rose-500/10 to-transparent">
                        <div className="p-4 bg-rose-500/20 rounded-full text-rose-600">
                            <Brain className="h-6 w-6" />
                        </div>
                        <div>
                            <p className="text-sm text-muted-foreground font-medium">Cognitive Level</p>
                            <h3 className="text-2xl font-bold">Level 12</h3>
                        </div>
                    </Card>
                </div>

                {/* Games Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {GAMES.map((game, index) => (
                        <motion.div
                            key={game.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                        >
                            <Card
                                onClick={() => navigate(game.route)}
                                className="group relative overflow-hidden h-full flex flex-col border-none shadow-md hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 cursor-pointer"
                            >
                                <div className={`absolute inset-0 opacity-0 group-hover:opacity-5 transition-opacity duration-500 bg-current ${game.color}`} />

                                <div className="p-8 flex flex-col flex-1 items-center text-center space-y-6">
                                    <div className={`p-6 rounded-2xl bg-slate-50 dark:bg-slate-800 ${game.color} transition-transform duration-500 group-hover:scale-110 group-hover:rotate-3`}>
                                        <game.icon className="h-10 w-10" />
                                    </div>

                                    <div className="space-y-2">
                                        <h3 className="text-2xl font-bold">{game.title}</h3>
                                        <p className="text-muted-foreground leading-relaxed">
                                            {game.description}
                                        </p>
                                    </div>

                                    <div className="pt-4 mt-auto w-full">
                                        <Button
                                            className="w-full rounded-full h-12 text-base group-hover:bg-primary group-hover:text-primary-foreground transition-all"
                                            variant="outline"
                                        >
                                            Play Now
                                            <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                                        </Button>
                                    </div>
                                </div>
                            </Card>
                        </motion.div>
                    ))}
                </div>
            </div>
        </Layout>
    );
}
