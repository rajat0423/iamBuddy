import { db } from "@/firebase/config";
import { doc, updateDoc, collection, query, getDocs } from "firebase/firestore";

export async function markMessagesAsRead(chatId: string, userId: string) {
    // Only query messages that haven't been read by this user yet to save reads/writes
    // Note: 'array-contains' is not supported for 'not-in' or 'does-not-contain'. 
    // So we fetch recent messages and filter client side or just fetch all.
    // For scalability, we should probably only check the last N messages or use a 'readBy' map.
    // Sticking to user's implementation for now but optimizing query if possible.

    const q = query(collection(db, "chats", chatId, "messages"));
    const snap = await getDocs(q);

    const updates = snap.docs.map(async (msg) => {
        const data = msg.data();
        if (!data.readBy?.includes(userId)) {
            await updateDoc(doc(db, "chats", chatId, "messages", msg.id), {
                readBy: [...(data.readBy || []), userId],
            });
        }
    });

    await Promise.all(updates);
}
