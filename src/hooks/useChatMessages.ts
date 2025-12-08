import { db } from "@/firebase/config";
import { collection, query, orderBy, onSnapshot, Timestamp } from "firebase/firestore";
import { useEffect, useState } from "react";

export interface ChatMessage {
    id: string;
    sender: string;
    text: string;
    createdAt: Timestamp;
    readBy: string[];
    type: "text" | "image" | "system";
}

export function useChatMessages(chatId: string | undefined) {
    const [messages, setMessages] = useState<ChatMessage[]>([]);

    useEffect(() => {
        if (!chatId) return;

        const q = query(
            collection(db, "chats", chatId, "messages"),
            orderBy("createdAt", "asc")
        );

        const unsub = onSnapshot(q, (snap) => {
            const msgs = snap.docs.map((d) => ({ id: d.id, ...d.data() })) as ChatMessage[];
            setMessages(msgs);
        });

        return () => unsub();
    }, [chatId]);

    return messages;
}
