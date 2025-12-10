import type { LucideIcon } from "lucide-react";

export type GameType = 'memory' | 'focus' | 'emotion' | 'bubble' | 'shape-match';

export interface GameStats {
    score: number;
    streak: number;
    accuracy: number; // 0-100
    bestScore: number;
    gamesPlayed: number;
}

export interface GameResult {
    score: number;
    accuracy: number;
    streak: number;
    message: string;
}

export interface GameConfig {
    id: GameType;
    title: string;
    description: string;
    icon: LucideIcon;
    color: string;
    route: string;
    difficulty: 'Easy' | 'Medium' | 'Hard';
}
