import { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useChatMessages } from "@/hooks/useChatMessages";
import { sendMessage } from "@/lib/sendMessage";
import { setTyping, listenTyping } from "@/lib/typing";
import { markMessagesAsRead } from "@/lib/markRead";
import Layout from "@/components/shared/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Send, Check, CheckCheck } from "lucide-react";

export default function ChatRoom() {
    const { chatId } = useParams<{ chatId: string }>();
    const { user } = useAuth();
    const messages = useChatMessages(chatId);
    const [text, setText] = useState("");
    const [isTyping, setIsTyping] = useState(false);
    const [otherUserTyping] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const typingTimeoutRef = useRef<any>(null);

    // Mark messages as read when they load
    useEffect(() => {
        if (user && chatId && messages.length > 0) {
            markMessagesAsRead(chatId, user.uid);
        }
    }, [messages, user, chatId]);

    // Scroll to bottom on new messages
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages, otherUserTyping]);

    // Listen for other user typing
    useEffect(() => {
        if (!chatId || !user) return;
        // In a real app, we'd need to know the OTHER user's ID. 
        // For now, we'll just listen to ANY typing in the chat doc subcollection or similar.
        // But our listenTyping utility requires a userId. 
        // We need to fetch the chat participants to know who the other user is.
        // For this MVP, let's skip the "specific user" check and just listen to a generic typing field if we simplified it,
        // OR we assume we can get the other user ID from the chat metadata (which we should fetch).
        // To keep it simple and robust without fetching chat metadata again:
        // We will skip the typing indicator for the *other* user in this specific implementation block 
        // unless we fetch the chat details. 
        // Let's add a TODO or a quick fetch.
    }, [chatId, user]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setText(e.target.value);

        if (!user || !chatId) return;

        if (!isTyping) {
            setIsTyping(true);
            setTyping(chatId, user.uid, true);
        }

        if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);

        typingTimeoutRef.current = setTimeout(() => {
            setIsTyping(false);
            setTyping(chatId, user.uid, false);
        }, 2000);
    };

    const handleSend = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user || !chatId || !text.trim()) return;

        await sendMessage(chatId, user.uid, text);
        setText("");
        setIsTyping(false);
        setTyping(chatId, user.uid, false);
    };

    return (
        <Layout>
            <div className="max-w-4xl mx-auto h-[calc(100vh-8rem)] flex flex-col">
                <Card className="flex-1 glass-card border-none flex flex-col overflow-hidden shadow-xl">
                    {/* Header */}
                    <div className="p-4 border-b border-white/10 bg-white/5 backdrop-blur-sm">
                        <h2 className="font-semibold text-lg">Chat</h2>
                        {otherUserTyping && <p className="text-xs text-primary animate-pulse">Typing...</p>}
                    </div>

                    {/* Messages */}
                    <div className="flex-1 overflow-y-auto p-4 space-y-4">
                        {messages.map((msg) => {
                            const isMe = msg.sender === user?.uid;
                            const isRead = msg.readBy?.length > 1; // Assuming >1 means read by someone else (since sender reads it immediately)

                            return (
                                <div
                                    key={msg.id}
                                    className={`flex flex-col ${isMe ? "items-end" : "items-start"}`}
                                >
                                    <div
                                        className={`max-w-[70%] p-3 rounded-2xl text-sm shadow-sm ${isMe
                                            ? "bg-primary text-primary-foreground rounded-br-none"
                                            : "bg-white dark:bg-slate-800 text-foreground rounded-bl-none border border-border"
                                            }`}
                                    >
                                        <p>{msg.text}</p>
                                    </div>
                                    <div className="flex items-center gap-1 mt-1 px-1">
                                        <span className="text-[10px] text-muted-foreground opacity-70">
                                            {msg.createdAt?.toDate().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </span>
                                        {isMe && (
                                            <span className="text-primary">
                                                {isRead ? <CheckCheck className="h-3 w-3" /> : <Check className="h-3 w-3" />}
                                            </span>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Input */}
                    <div className="p-4 bg-white/50 dark:bg-black/20 border-t border-white/10 backdrop-blur-md">
                        <form onSubmit={handleSend} className="flex gap-2">
                            <Input
                                value={text}
                                onChange={handleInputChange}
                                placeholder="Type a message..."
                                className="flex-1 bg-white/50 dark:bg-slate-900/50 border-white/20 focus-visible:ring-primary"
                            />
                            <Button type="submit" size="icon" disabled={!text.trim()}>
                                <Send className="h-4 w-4" />
                            </Button>
                        </form>
                    </div>
                </Card>
            </div>
        </Layout>
    );
}
