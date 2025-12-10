import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { doc, getDoc, updateDoc, arrayRemove, deleteDoc } from "firebase/firestore";
import { db } from "@/firebase/config";
import { useAuth } from "@/hooks/useAuth";
import { ensureUserIdentity } from "@/lib/randomIdentity";
import { useChatMessages } from "@/hooks/useChatMessages";
import { sendMessage } from "@/lib/sendMessage";
import { setTyping, listenTyping } from "@/lib/typing";
import { markMessagesAsRead } from "@/lib/markRead";
import Layout from "@/components/shared/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Send, Check, CheckCheck, Trash2, AlertTriangle } from "lucide-react";
import { avatars } from "@/lib/avatars";

export default function ChatRoom() {
    const { chatId } = useParams<{ chatId: string }>();
    const navigate = useNavigate();
    const { user } = useAuth();
    const messages = useChatMessages(chatId);
    const [text, setText] = useState("");
    const [isTyping, setIsTyping] = useState(false);
    const [otherUser, setOtherUser] = useState<{ id: string, name: string, avatar?: string } | null>(null);
    const [myIdentity, setMyIdentity] = useState<{ randomPseudonym: string, avatarId: number } | null>(null);
    const [otherUserTyping, setOtherUserTyping] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const typingTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

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

    // Fetch chat details and other user info
    useEffect(() => {
        if (!chatId || !user) return;

        // Fetch my identity for avatar fallback
        ensureUserIdentity(user.uid).then(id => setMyIdentity(id as { randomPseudonym: string, avatarId: number }));

        let unsubscribeTyping: () => void;

        const fetchChatDetails = async () => {
            try {
                const chatDoc = await getDoc(doc(db, "chats", chatId));
                if (chatDoc.exists()) {
                    const data = chatDoc.data();
                    const otherUserId = data.users.find((u: string) => u !== user.uid);

                    if (otherUserId) {
                        // Fetch other user profile
                        const userDoc = await getDoc(doc(db, "users", otherUserId));
                        if (userDoc.exists()) {
                            const userData = userDoc.data();
                            setOtherUser({
                                id: otherUserId,
                                name: userData.randomPseudonym || "Anonymous",
                                avatar: userData.photoURL || avatars[(userData.avatarId || 0) % avatars.length]
                            });
                        } else {
                            setOtherUser({ id: otherUserId, name: "Unknown User" });
                        }

                        // Listen for typing
                        unsubscribeTyping = listenTyping(chatId, otherUserId, (isTyping) => {
                            setOtherUserTyping(isTyping);
                        });
                    }
                }
            } catch (error) {
                console.error("Error fetching chat details:", error);
            }
        };

        fetchChatDetails();

        return () => {
            if (unsubscribeTyping) unsubscribeTyping();
        };
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

    const deleteChat = async () => {
        if (!chatId || !user) return;

        if (!confirm("Delete this conversation? It will be removed from your list.")) return;

        try {
            // Remove user from the chat's 'users' array
            await updateDoc(doc(db, "chats", chatId), {
                users: arrayRemove(user.uid)
            });

            // Note: In a real app, we might check if 'users' is empty and delete the doc entirely using a Cloud Function.
            // Client-side check for cleanup (optional/risky without transactions, but fine for now):
            const chatDoc = await getDoc(doc(db, "chats", chatId));
            if (chatDoc.exists() && chatDoc.data().users.length === 0) {
                await deleteDoc(doc(db, "chats", chatId));
            }

            alert("Conversation removed.");
            navigate("/community");
        } catch (error) {
            console.error("Error deleting chat:", error);
            alert("Failed to delete chat.");
        }
    };

    return (
        <Layout>
            <div className="max-w-4xl mx-auto h-[calc(100vh-8rem)] flex flex-col">
                <Card className="flex-1 glass-card border-none flex flex-col overflow-hidden shadow-xl">
                    {/* Header */}
                    <div className="p-4 border-b border-white/10 bg-white/5 backdrop-blur-sm flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white font-bold overflow-hidden">
                            <img
                                src={otherUser?.avatar || avatars[0]}
                                alt="Avatar"
                                className="h-full w-full object-cover"
                            />
                        </div>
                        <div className="flex-1">
                            <h2 className="font-semibold text-lg">{otherUser?.name || "Chat"}</h2>
                            {otherUserTyping ? (
                                <p className="text-xs text-primary animate-pulse">Typing...</p>
                            ) : (
                                <p className="text-xs text-muted-foreground">Online</p>
                            )}
                        </div>
                        <Button variant="ghost" size="icon" className="text-red-500 hover:bg-red-500/10" onClick={deleteChat} title="Delete Conversation">
                            <Trash2 className="h-5 w-5" />
                        </Button>
                    </div>

                    {/* Safety Warning */}
                    <div className="bg-yellow-500/10 border-b border-yellow-500/20 p-2 text-center">
                        <p className="text-xs text-yellow-600 dark:text-yellow-400 flex items-center justify-center gap-2">
                            <AlertTriangle className="h-3 w-3" />
                            Safety Note: Sharing social media IDs is restricted. Keep conversations safe!
                        </p>
                    </div>

                    {/* Messages */}
                    <div className="flex-1 overflow-y-auto p-4 space-y-4">
                        {messages.map((msg) => {
                            const isMe = msg.sender === user?.uid;
                            const isRead = msg.readBy?.length > 1;

                            return (
                                <div
                                    key={msg.id}
                                    className={`flex items-end gap-2 ${isMe ? "flex-row-reverse" : "flex-row"}`}
                                >
                                    <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center overflow-hidden flex-shrink-0 border border-white/20">
                                        {isMe ? (
                                            <img
                                                src={user?.photoURL || avatars[(myIdentity?.avatarId || 0) % avatars.length] || avatars[0]}
                                                alt="Me"
                                                className="h-full w-full object-cover"
                                            />
                                        ) : (
                                            <img
                                                src={otherUser?.avatar || avatars[0]}
                                                alt="Other"
                                                className="h-full w-full object-cover"
                                            />
                                        )}
                                    </div>
                                    <div className={`flex flex-col ${isMe ? "items-end" : "items-start"} max-w-[70%]`}>
                                        <div
                                            className={`p-3 rounded-2xl text-sm shadow-sm ${isMe
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
