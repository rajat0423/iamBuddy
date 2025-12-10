import type { Question } from "@/lib/mood-scoring";

export const QUESTIONS: Record<string, Question> = {
    // --- BASE QUESTIONS (5 mandatory) ---
    'q_base_1': {
        id: 'q_base_1',
        text: "How are you feeling right now?",
        type: 'single',
        branch: 'BASE',
        options: [
            { id: 'very_good', text: "Very Good", emoji: "😁", value: 2, weight: { Mood: 10, Energy: 5 } },
            { id: 'good', text: "Good", emoji: "🙂", value: 1, weight: { Mood: 5 } },
            { id: 'neutral', text: "Neutral", emoji: "😐", value: 0, weight: { Mood: 0 } },
            { id: 'low', text: "Low / Sad", emoji: "😔", value: -1, weight: { Mood: -10, Energy: -5 } },
            { id: 'very_low', text: "Very Low", emoji: "😣", value: -2, weight: { Mood: -20, Energy: -10 } },
            { id: 'stressed', text: "Stressed", emoji: "😫", value: -1, weight: { Stress: 15, Mood: -5 } },
            { id: 'anxious', text: "Anxious", emoji: "😰", value: -1, weight: { Stress: 10, CognitiveLoad: 10 } },
        ]
    },
    'q_base_2': {
        id: 'q_base_2',
        text: "How would you rate your current energy?",
        type: 'scale', // 0-4
        branch: 'BASE',
        options: [
            { id: '0', text: "Exhaused", value: -2, weight: { Energy: -15 } },
            { id: '1', text: "Low", value: -1, weight: { Energy: -5 } },
            { id: '2', text: "Okay", value: 0, weight: { Energy: 0 } },
            { id: '3', text: "Good", value: 1, weight: { Energy: 5 } },
            { id: '4', text: "High", value: 2, weight: { Energy: 15 } },
        ]
    },
    'q_base_3': {
        id: 'q_base_3',
        text: "How would you rate your current stress level?",
        type: 'scale',
        branch: 'BASE',
        options: [
            { id: '0', text: "None", value: -2, weight: { Stress: -10 } },
            { id: '1', text: "Low", value: -1, weight: { Stress: -5 } },
            { id: '2', text: "Moderate", value: 0, weight: { Stress: 5 } },
            { id: '3', text: "High", value: 1, weight: { Stress: 15 } },
            { id: '4', text: "Extreme", value: 2, weight: { Stress: 25 } },
        ]
    },
    'q_base_4': {
        id: 'q_base_4',
        text: "How focused/clear is your mind right now?",
        type: 'scale',
        branch: 'BASE',
        options: [
            { id: '0', text: "Brain Fog", value: -2, weight: { CognitiveLoad: 15 } }, // Negative focus = High load
            { id: '1', text: "Scattered", value: -1, weight: { CognitiveLoad: 10 } },
            { id: '2', text: "Okay", value: 0, weight: { CognitiveLoad: 0 } },
            { id: '3', text: "Clear", value: 1, weight: { CognitiveLoad: -10 } },
            { id: '4', text: "Sharp", value: 2, weight: { CognitiveLoad: -20 } },
        ]
    },
    'q_base_5': {
        id: 'q_base_5',
        text: "Have you had significant mood shifts in the last 24 hours?",
        type: 'boolean',
        branch: 'BASE',
        options: [
            { id: 'yes', text: "Yes", value: 1, weight: { Mood: -10, CognitiveLoad: 5 } },
            { id: 'no', text: "No", value: 0, weight: { Mood: 5 } },
        ]
    },

    // --- DEEP DIVE: STRESS ---
    'q_stress_trigger': {
        id: 'q_stress_trigger',
        text: "What triggered your stress today?",
        type: 'single',
        branch: 'STRESS',
        options: [
            { id: 'work', text: "Work/Exams", emoji: "💼", value: 0, weight: {} },
            { id: 'relations', text: "Relationships", emoji: "👥", value: 0, weight: {} },
            { id: 'health', text: "Health", emoji: "🏥", value: 0, weight: {} },
            { id: 'unknown', text: "Not sure", emoji: "🤷", value: 0, weight: {} },
        ]
    },
    'q_stress_duration': {
        id: 'q_stress_duration',
        text: "Is this stress new or long-running?",
        type: 'single',
        branch: 'STRESS',
        options: [
            { id: 'new', text: "New / Acute", value: 1, weight: { Stress: 5 } },
            { id: 'ongoing', text: "Long-running", value: 1, weight: { Stress: 10, Mood: -5 } },
        ]
    },
    'q_stress_symptoms': {
        id: 'q_stress_symptoms',
        text: "Do you have physical symptoms (headache, tightness)?",
        type: 'boolean',
        branch: 'STRESS',
        options: [
            { id: 'yes', text: "Yes", value: 1, weight: { Stress: 10 } },
            { id: 'no', text: "No", value: 0, weight: {} },
        ]
    },
    'q_stress_safe': {
        id: 'q_stress_safe',
        text: "Are you feeling safe right now?",
        type: 'boolean',
        branch: 'STRESS',
        options: [
            { id: 'yes', text: "Yes", value: 1, weight: {} },
            { id: 'no', text: "No", value: 0, weight: {} }, // Flags crisis
        ]
    },

    // --- DEEP DIVE: MOOD ---
    'q_mood_duration': {
        id: 'q_mood_duration',
        text: "How long have you felt low?",
        type: 'single',
        branch: 'MOOD',
        options: [
            { id: 'hours', text: "Just today", value: 0, weight: { Mood: -5 } },
            { id: 'days', text: "A few days", value: 0, weight: { Mood: -10 } },
            { id: 'weeks', text: "Weeks+", value: 0, weight: { Mood: -20 } },
        ]
    },
    'q_mood_motivation': {
        id: 'q_mood_motivation',
        text: "Do you feel motivated to do small tasks?",
        type: 'single',
        branch: 'MOOD',
        options: [
            { id: 'yes', text: "Yes", value: 1, weight: { Energy: 5 } },
            { id: 'bit', text: "A little bit", value: 0, weight: {} },
            { id: 'no', text: "No", value: -1, weight: { Energy: -10 } },
        ]
    },
    'q_mood_harm': {
        id: 'q_mood_harm',
        text: "Have you had thoughts of self-harm?",
        type: 'boolean',
        branch: 'MOOD',
        options: [
            { id: 'yes', text: "Yes", value: 1, weight: {} }, // CRITICAL FLAG
            { id: 'no', text: "No", value: 0, weight: {} },
        ]
    },
    'q_mood_preference': {
        id: 'q_mood_preference',
        text: "Would you prefer uplifting activities or calming ones?",
        type: 'single',
        branch: 'MOOD',
        options: [
            { id: 'uplift', text: "Uplifting", value: 0, weight: {} },
            { id: 'calm', text: "Calming", value: 0, weight: {} },
        ]
    },

    // --- OVERTHINKING ---
    'q_overthink_loop': {
        id: 'q_overthink_loop',
        text: "Is your mind repeating the same thought?",
        type: 'boolean',
        branch: 'OVERTHINKING',
        options: [
            { id: 'yes', text: "Yes", value: 1, weight: { CognitiveLoad: 10 } },
            { id: 'no', text: "No", value: 0, weight: {} },
        ]
    },
    'q_overthink_interfere': {
        id: 'q_overthink_interfere',
        text: "How much does it interfere with tasks?",
        type: 'single',
        branch: 'OVERTHINKING',
        options: [
            { id: 'none', text: "Not much", value: 0, weight: {} },
            { id: 'some', text: "Some distraction", value: 1, weight: { CognitiveLoad: 5 } },
            { id: 'lot', text: "Can't function", value: 2, weight: { CognitiveLoad: 20 } },
        ]
    },

    // --- LIGHT REFLECT ---
    'q_light_gratitude': {
        id: 'q_light_gratitude',
        text: "Quick check: What's one thing you're grateful for?",
        type: 'single',
        branch: 'LIGHT',
        options: [
            { id: 'health', text: "My Health", value: 0, weight: { Mood: 5 } },
            { id: 'people', text: "Friends/Family", value: 0, weight: { Mood: 5 } },
            { id: 'nature', text: "Nature/Weather", value: 0, weight: { Mood: 5 } },
            { id: 'self', text: "Myself", value: 0, weight: { Mood: 5 } },
        ]
    }
};

export const FLOW_ORDER = {
    BASE: ['q_base_1', 'q_base_2', 'q_base_3', 'q_base_4', 'q_base_5'],
    DEEP_DIVE_STRESS: ['q_stress_trigger', 'q_stress_duration', 'q_stress_symptoms', 'q_stress_safe'],
    DEEP_DIVE_MOOD: ['q_mood_duration', 'q_mood_motivation', 'q_mood_harm', 'q_mood_preference'],
    OVERTHINK_BRANCH: ['q_overthink_loop', 'q_overthink_interfere'],
    LIGHT_REFLECT_BRANCH: ['q_light_gratitude']
};
