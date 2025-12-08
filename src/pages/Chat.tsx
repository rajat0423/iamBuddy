import { useState, useEffect, useRef } from "react";
import { useAuth } from "@/hooks/useAuth";
import { db } from "@/firebase/config";
import { collection, addDoc, query, orderBy, limit, onSnapshot, serverTimestamp, Timestamp } from "firebase/firestore";
import Layout from "@/components/shared/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Send, User, MessageCircle } from "lucide-react";

interface Message {
    id: string;
    text: string;
    userId: string;
    displayName: string;
    photoURL?: string;
    timestamp: Timestamp;
    createdAt: Timestamp;
}

export default function Chat() {
    const { user } = useAuth();
    const [messages, setMessages] = useState<Message[]>([]);
    const [newMessage, setNewMessage] = useState("");
    const [error, setError] = useState<string | null>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const q = query(
            collection(db, "chats", "global_chat", "messages"),
            orderBy("createdAt", "asc"),
            limit(50)
        );

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const msgs = snapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            })) as Message[];
            setMessages(msgs);
            setError(null);
        }, (err: any) => {
            console.error("Chat Error:", err);
            setError(`Error: ${err.code || err.message || "Unknown error"}`);
        });

        return () => unsubscribe();
    }, []);


    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        if (newMessage.trim() === "" || !user) return;

        try {
            await addDoc(collection(db, "chats", "global_chat", "messages"), {
                text: newMessage,
                createdAt: serverTimestamp(),
                uid: user.uid,
                displayName: user.displayName || "Anonymous",
                photoURL: user.photoURL,
            });
            setNewMessage("");
            setError(null);
        } catch (error: any) {
            console.error("Error sending message:", error);
            setError("Failed to send message: " + error.message);
        }
    };

    return (
        <Layout>
            <div className="max-w-4xl mx-auto h-[calc(100vh-8rem)] flex flex-col">
                <div className="mb-6 text-center space-y-2">
                    <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent inline-flex items-center gap-2">
                        <MessageCircle className="h-8 w-8 text-primary" />
                        Community Chat
                    </h1>
                    <p className="text-muted-foreground">
                        Connect with others in a safe, supportive space.
                    </p>
                </div>

                <Card className="flex-1 glass-card border-none flex flex-col overflow-hidden shadow-xl">
                    {/* Messages Area */}
                    <div className="flex-1 overflow-y-auto p-4 space-y-4 scroll-smooth">
                        {error && (
                            <div className="bg-red-500/10 border border-red-500/50 text-red-500 p-3 rounded-lg text-sm text-center">
                                {error}
                            </div>
                        )}
                        {messages.length === 0 ? (
                            <div className="h-full flex flex-col items-center justify-center text-muted-foreground opacity-50">
                                <MessageCircle className="h-12 w-12 mb-2" />
                                <p>No messages yet. Be the first to say hi!</p>
                            </div>
                        ) : (
                            messages.map((msg) => {
                                const isMe = msg.userId === user?.uid;
                                return (
                                    <div
                                        key={msg.id}
                                        className={`flex items-end gap-2 ${isMe ? "flex-row-reverse" : "flex-row"}`}
                                    >
                                        <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center overflow-hidden flex-shrink-0 border border-white/20">
                                            {msg.photoURL ? (
                                                <img src={msg.photoURL} alt={msg.displayName} className="h-full w-full object-cover" />
                                            ) : (
                                                <User className="h-4 w-4 text-muted-foreground" />
                                            )}
                                        </div>
                                        <div
                                            className={`max-w-[70%] p-3 rounded-2xl text-sm shadow-sm ${isMe
                                                ? "bg-primary text-primary-foreground rounded-br-none"
                                                : "bg-white dark:bg-slate-800 text-foreground rounded-bl-none border border-border"
                                                }`}
                                        >
                                            {!isMe && (
                                                <p className="text-[10px] font-semibold opacity-70 mb-1">
                                                    {msg.displayName}
                                                </p>
                                            )}
                                            <p>{msg.text}</p>
                                        </div>
                                    </div>
                                );
                            })
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Input Area */}
                    <div className="p-4 bg-white/50 dark:bg-black/20 border-t border-white/10 backdrop-blur-md">
                        <form onSubmit={handleSendMessage} className="flex gap-2">
                            <Input
                                value={newMessage}
                                onChange={(e) => setNewMessage(e.target.value)}
                                placeholder="Type a message..."
                                className="flex-1 bg-white/50 dark:bg-slate-900/50 border-white/20 focus-visible:ring-primary"
                            />
                            <Button type="submit" size="icon" disabled={!newMessage.trim()}>
                                <Send className="h-4 w-4" />
                            </Button>
                        </form>
                    </div>
                </Card>
            </div>
        </Layout>
    );
}
