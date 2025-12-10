
// Re-export types from new system
export type { EmotionalIndices, Option, Question, BranchType } from "@/lib/mood-scoring";
export type { Recommendation } from "@/data/recommendations";
export { getRecommendations } from "@/data/recommendations";
export { QUESTIONS, FLOW_ORDER } from "@/data/questions";
export { calculateNewIndices, determineBranch, INITIAL_INDICES, getMoodProfileLabel } from "@/lib/mood-scoring";

// Legacy type support if needed (optional)
export interface MoodProfile {
    score: number;
    label: string;
}
