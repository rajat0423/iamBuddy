import { db } from "@/firebase/config";
import { collection, addDoc, serverTimestamp, query, where, getDocs } from "firebase/firestore";

export async function getOrCreateChat(userA: string, userB: string) {
    // Query for chats where userA is a participant
    const chatQuery = query(
        collection(db, "chats"),
        where("users", "array-contains", userA)
    );

    const snap = await getDocs(chatQuery);

    // Search for a chat that contains both users
    for (const docItem of snap.docs) {
        const data = docItem.data();
        if (data.users.includes(userB)) {
            return docItem.id; // existing chat
        }
    }

    // Create a new chat
    const chat = await addDoc(collection(db, "chats"), {
        users: [userA, userB],
        createdAt: serverTimestamp(),
        lastMessage: null,
        lastMessageTime: serverTimestamp(),
    });

    return chat.id;
}
