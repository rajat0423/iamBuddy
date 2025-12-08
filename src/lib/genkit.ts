import { GoogleGenerativeAI } from "@google/generative-ai";

// Fallback prompts if API is unavailable
const FALLBACK_PROMPTS = [
    "Describe a place where you feel completely safe and at peace. What do you see, hear, and smell?",
    "Write a letter to your future self, five years from now. What do you hope they have achieved?",
    "List three things you are grateful for today, and explain why they matter to you.",
    "Imagine you are a tree in a quiet forest. Describe your surroundings and how you weather the seasons.",
    "Write about a challenge you overcame recently. What strengths did you discover in yourself?",
    "Describe your perfect day from waking up to going to sleep.",
    "If you could have a conversation with anyone, living or dead, who would it be and what would you say?",
    "What does 'happiness' mean to you right now? Describe it as a physical object.",
    "Write about a small act of kindness you witnessed or performed recently.",
    "Describe a favorite childhood memory that brings you joy.",
    "If you could fly, where would you go first? Describe the view from above.",
    "Write a short story about a character who finds a mysterious key. What does it open?",
    "What is one worry you can let go of today? Visualize it floating away like a balloon.",
    "Describe the sound of rain against the window. How does it make you feel?",
    "Write about a talent or skill you would love to learn and why."
];

export async function generatePrompt(): Promise<string> {
    const apiKey = import.meta.env.VITE_GOOGLE_GENAI_API_KEY;

    if (!apiKey) {
        console.warn("No GenAI API Key found. Using fallback prompts.");
        return getRandomFallback();
    }

    try {
        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ model: "gemini-pro" });

        const result = await model.generateContent(
            "Generate a short, inspiring creative writing prompt for mental wellness, mindfulness, or self-reflection. Keep it under 30 words."
        );
        const response = await result.response;
        const text = response.text();
        return text || getRandomFallback();
    } catch (error) {
        console.error("Error generating prompt with AI:", error);
        return getRandomFallback();
    }
}

function getRandomFallback() {
    return FALLBACK_PROMPTS[Math.floor(Math.random() * FALLBACK_PROMPTS.length)];
}
