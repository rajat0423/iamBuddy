import { db } from "@/firebase/config";
import { doc, setDoc } from "firebase/firestore";
import { generateRandomName } from "@/lib/randomIdentity";

export const seedUsers = async () => {
    const dummyUsers = Array.from({ length: 5 }).map((_, i) => {
        const name = generateRandomName();
        return {
            uid: `dummy_user_${i}_${Date.now()}`,
            email: `dummy${i}@example.com`,
            displayName: name,
            randomPseudonym: name,
            photoURL: `https://api.dicebear.com/7.x/avataaars/svg?seed=${name.replace(" ", "")}`,
            createdAt: new Date(),
            isDummy: true
        };
    });

    for (const user of dummyUsers) {
        await setDoc(doc(db, "users", user.uid), user);
    }

    alert("5 Dummy Users Added! Refresh the list.");
};
