export type MoodCategory = 'Mood' | 'Stress' | 'Energy' | 'CognitiveLoad';

export interface EmotionalIndices {
    Mood: number;          // 0-100 (Positive <-> Negative)
    Stress: number;        // 0-100 (Calm <-> Overwhelmed)
    Energy: number;        // 0-100 (Low <-> High)
    CognitiveLoad: number; // 0-100 (Clear <-> Overthinking)
}

export type EmotionalWeight = Partial<Record<MoodCategory, number>>;

export interface Option {
    id: string;
    text: string;
    emoji?: string;
    value: number; // Numeric value for calculation (e.g. -2 to +2)
    weight: EmotionalWeight; // Contribution to indices
    nextQuestionId?: string; // Optional direct override
}

export interface Question {
    id: string;
    text: string;
    type: 'single' | 'scale' | 'boolean';
    options: Option[];
    branch?: 'BASE' | 'STRESS' | 'MOOD' | 'OVERTHINKING' | 'LIGHT';
}

export type BranchType = 'DEEP_DIVE_STRESS' | 'DEEP_DIVE_MOOD' | 'OVERTHINK_BRANCH' | 'LIGHT_REFLECT_BRANCH';

// Initial State
export const INITIAL_INDICES: EmotionalIndices = {
    Mood: 50,
    Stress: 50,
    Energy: 50,
    CognitiveLoad: 50
};

// --- Logic ---

// Normalize a raw score to 0-100 range
// Assuming a typical max raw deviation of +/- 10 per question * 5 questions = +/- 50 range from 50 base
export const normalizeScore = (currentPathValue: number): number => {
    return Math.max(0, Math.min(100, currentPathValue));
};

export const calculateNewIndices = (
    currentIndices: EmotionalIndices,
    option: Option
): EmotionalIndices => {
    const newIndices = { ...currentIndices };

    // Apply weights * value
    Object.entries(option.weight).forEach(([category, weight]) => {
        const cat = category as MoodCategory;
        // Example: weight 10 * value -1 = -10 from index
        // Weights should be calibrated so 1 answering "Very Bad" (-2) with weight { Mood: 5 }
        // results in Mood -10.
        // We accumulate directly on the 0-100 scale here for simplicity, 
        // assuming weights are pre-calibrated for the 0-100 scale.

        let delta = weight * option.value;
        newIndices[cat] = normalizeScore(newIndices[cat] + delta);
    });

    return newIndices;
};

export const determineBranch = (indices: EmotionalIndices): BranchType => {
    // 1. Safety / Critical thresholds
    if (indices.Stress >= 70) return 'DEEP_DIVE_STRESS';
    if (indices.Mood <= 35) return 'DEEP_DIVE_MOOD';
    if (indices.CognitiveLoad >= 65) return 'OVERTHINK_BRANCH';

    // 2. Fallback
    return 'LIGHT_REFLECT_BRANCH';
};

export const getMoodProfileLabel = (indices: EmotionalIndices) => {
    if (indices.Stress > 70) return "High Stress";
    if (indices.Mood < 40) return "Low Mood";
    if (indices.Energy > 70 && indices.Mood > 60) return "High Energy";
    if (indices.CognitiveLoad > 60) return "Overwhelmed";
    return "Balanced";
};
