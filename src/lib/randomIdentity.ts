import { db } from "@/firebase/config";
import { doc, updateDoc, getDoc, setDoc } from "firebase/firestore";

const ADJECTIVES = [
    "Calm", "Brave", "Happy", "Kind", "Gentle", "Wise", "Bright", "Sunny", "Peaceful", "Mindful",
    "Quiet", "Serene", "Joyful", "Radiant", "Steady", "Focus", "Relaxed", "Creative", "Honest", "Noble"
];

const NOUNS = [
    "Panda", "Eagle", "Tiger", "Lion", "Dolphin", "Owl", "Fox", "Bear", "Wolf", "Hawk",
    "Lotus", "River", "Mountain", "Tree", "Ocean", "Star", "Moon", "Sun", "Cloud", "Sky"
];

export function generateRandomName() {
    const adj = ADJECTIVES[Math.floor(Math.random() * ADJECTIVES.length)];
    const noun = NOUNS[Math.floor(Math.random() * NOUNS.length)];
    return `${adj} ${noun}`;
}

export async function ensureUserIdentity(userId: string) {
    const userRef = doc(db, "users", userId);
    const userSnap = await getDoc(userRef);

    if (userSnap.exists()) {
        const data = userSnap.data();
        if (!data.randomPseudonym) {
            const pseudonym = generateRandomName();
            // Also assign a random avatar ID if not present (1-20)
            const avatarId = data.avatarId || Math.floor(Math.random() * 20) + 1;

            await updateDoc(userRef, {
                randomPseudonym: pseudonym,
                avatarId: avatarId
            });
            return { ...data, randomPseudonym: pseudonym, avatarId };
        }
        return data;
    } else {
        // Create new user doc if it doesn't exist
        const pseudonym = generateRandomName();
        const avatarId = Math.floor(Math.random() * 20) + 1;
        const newData = {
            randomPseudonym: pseudonym,
            avatarId: avatarId,
            createdAt: new Date()
        };
        await setDoc(userRef, newData);
        return newData;
    }
}
