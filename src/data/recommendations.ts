import type { EmotionalIndices } from "@/lib/mood-scoring";
import type { LucideIcon } from "lucide-react";
import { Wind, Music, BookOpen, Brain, Phone, Heart } from "lucide-react";

export interface Recommendation {
    id: string;
    title: string;
    description: string;
    type: 'ACTION' | 'RESOURCE' | 'CRISIS';
    priority: 'HIGH' | 'MEDIUM' | 'LOW';
    icon: LucideIcon;
    route: string;
    color: string;
}

export const getRecommendations = (
    indices: EmotionalIndices,
    answers: Record<string, string> // questionId -> optionId
): Recommendation[] => {
    const recs: Recommendation[] = [];

    // --- CRISIS CHECKS ---
    if (answers['q_mood_harm'] === 'yes' || answers['q_stress_safe'] === 'no') {
        recs.push({
            id: 'crisis-helpline',
            title: 'Emergency Support',
            description: 'You are not alone. Connect with a crisis counselor now.',
            type: 'CRISIS',
            priority: 'HIGH',
            icon: Phone,
            route: '/therapy/crisis', // Or modal
            color: 'bg-red-600'
        });
        return recs; // Stop here if crisis
    }

    // --- HIGH STRESS ---
    if (indices.Stress >= 70) {
        recs.push({
            id: 'breathing-478',
            title: '4-7-8 Breathing',
            description: 'Immediate physiological reset for stress.',
            type: 'ACTION',
            priority: 'HIGH',
            icon: Wind,
            route: '/games/breath',
            color: 'bg-blue-500'
        });
        recs.push({
            id: 'sound-rain',
            title: 'Rain Sounds',
            description: 'Calm your environment.',
            type: 'RESOURCE',
            priority: 'MEDIUM',
            icon: Music,
            route: '/therapy',
            color: 'bg-cyan-500'
        });
    }

    // --- LOW MOOD ---
    if (indices.Mood <= 40) {
        recs.push({
            id: 'journal-vent',
            title: 'Vent Journal',
            description: 'Release negative thoughts safely.',
            type: 'ACTION',
            priority: 'HIGH',
            icon: BookOpen,
            route: '/journal',
            color: 'bg-indigo-500'
        });
        recs.push({
            id: 'game-bubble',
            title: 'Bubble Pop',
            description: 'Low-effort satisfaction.',
            type: 'ACTION',
            priority: 'MEDIUM',
            icon: Heart,
            route: '/games/bubble',
            color: 'bg-pink-500'
        });
    }

    // --- OVERTHINKING / COGNITIVE LOAD ---
    if (indices.CognitiveLoad >= 60) {
        recs.push({
            id: 'game-focus',
            title: 'Focus Flow',
            description: 'Ground your attention.',
            type: 'ACTION',
            priority: 'HIGH',
            icon: Brain,
            route: '/games/focus',
            color: 'bg-amber-500'
        });
    }

    // --- BALANCED / HIGH ENERGY ---
    if (recs.length === 0) {
        recs.push({
            id: 'challenge-shape',
            title: 'Shape Match',
            description: 'Keep your mind sharp.',
            type: 'ACTION',
            priority: 'MEDIUM',
            icon: Brain,
            route: '/games/shape-match',
            color: 'bg-emerald-500'
        });
        recs.push({
            id: 'community',
            title: 'Community Check-in',
            description: 'See how others are doing.',
            type: 'RESOURCE',
            priority: 'LOW',
            icon: Heart,
            route: '/community',
            color: 'bg-purple-500'
        });
    }

    return recs.slice(0, 3);
};
