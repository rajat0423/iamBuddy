import { db } from "@/firebase/config";
import { collection, addDoc, serverTimestamp, doc, updateDoc } from "firebase/firestore";

export async function sendMessage(chatId: string, senderId: string, text: string) {
    if (!text.trim()) return;

    // Add message to subcollection
    await addDoc(collection(db, "chats", chatId, "messages"), {
        sender: senderId,
        text,
        createdAt: serverTimestamp(),
        readBy: [senderId],
        type: "text",
    });

    // Update last message on main chat doc for list view
    await updateDoc(doc(db, "chats", chatId), {
        lastMessage: text,
        lastMessageTime: serverTimestamp(),
    });
}
