import { db } from "@/firebase/config";
import { doc, setDoc, onSnapshot } from "firebase/firestore";

export async function setTyping(chatId: string, userId: string, status: boolean) {
    await setDoc(doc(db, "chats", chatId, "typing", userId), {
        typing: status,
    });
}

export function listenTyping(chatId: string, userId: string, callback: (isTyping: boolean) => void) {
    return onSnapshot(doc(db, "chats", chatId, "typing", userId), (snap) => {
        callback(snap.exists() ? snap.data().typing : false);
    });
}
