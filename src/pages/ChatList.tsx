import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { db } from "@/firebase/config";
import { collection, query, where, onSnapshot, getDocs, Timestamp } from "firebase/firestore";
import { getOrCreateChat } from "@/lib/chat";
import Layout from "@/components/shared/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { MessageCircle, UserPlus } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface Chat {
    id: string;
    users: string[];
    lastMessage?: string;
    lastMessageTime?: Timestamp;
}

export default function ChatList() {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [chats, setChats] = useState<Chat[]>([]);
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!user) return;

        const q = query(
            collection(db, "chats"),
            where("users", "array-contains", user.uid)
        );

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const chatList = snapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            })) as Chat[];
            // Sort by last message time locally
            chatList.sort((a, b) => (b.lastMessageTime?.seconds || 0) - (a.lastMessageTime?.seconds || 0));
            setChats(chatList);
        });

        return () => unsubscribe();
    }, [user]);

    const handleStartChat = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user || !email.trim()) return;
        setLoading(true);
        setError(null);

        try {
            // Find user by email (This requires a way to query users by email, which might need an index)
            // For MVP, we'll assume we can find them or just use the ID if known.
            // Since we don't have a public user directory, let's try to find a user doc with this email.
            // Note: This query requires an index on 'email' in 'users' collection.
            const userQuery = query(collection(db, "users"), where("email", "==", email));
            const userSnap = await getDocs(userQuery);

            if (userSnap.empty) {
                setError("User not found.");
                setLoading(false);
                return;
            }

            const otherUser = userSnap.docs[0];
            const chatId = await getOrCreateChat(user.uid, otherUser.id);
            navigate(`/chat/${chatId}`);
        } catch (err: unknown) {
            console.error("Error starting chat:", err);
            const error = err as { message: string };
            setError("Failed to start chat. " + error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Layout>
            <div className="max-w-4xl mx-auto space-y-8">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent inline-flex items-center gap-2">
                            <MessageCircle className="h-8 w-8 text-primary" />
                            Messages
                        </h1>
                        <p className="text-muted-foreground mt-2">
                            Your private conversations.
                        </p>
                    </div>
                </div>

                {/* Start New Chat */}
                <Card className="glass-card border-none p-6">
                    <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                        <UserPlus className="h-5 w-5 text-primary" />
                        Start a New Conversation
                    </h2>
                    <form onSubmit={handleStartChat} className="flex gap-4">
                        <div className="flex-1">
                            <Input
                                placeholder="Enter user email..."
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="bg-white/50 dark:bg-slate-900/50"
                            />
                        </div>
                        <Button type="submit" disabled={loading}>
                            {loading ? "Starting..." : "Start Chat"}
                        </Button>
                    </form>
                    {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
                </Card>

                {/* Chat List */}
                <div className="space-y-4">
                    {chats.length === 0 ? (
                        <div className="text-center py-12 text-muted-foreground">
                            <MessageCircle className="h-12 w-12 mx-auto mb-4 opacity-50" />
                            <p>No conversations yet.</p>
                        </div>
                    ) : (
                        chats.map((chat) => (
                            <Card
                                key={chat.id}
                                onClick={() => navigate(`/chat/${chat.id}`)}
                                className="glass-card border-none hover:shadow-md transition-all cursor-pointer group"
                            >
                                <CardContent className="p-4 flex items-center justify-between">
                                    <div className="flex items-center gap-4">
                                        <div className="h-12 w-12 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white font-bold text-lg">
                                            {/* Placeholder Avatar */}
                                            <MessageCircle className="h-6 w-6" />
                                        </div>
                                        <div>
                                            <h3 className="font-semibold group-hover:text-primary transition-colors">
                                                Conversation
                                            </h3>
                                            <p className="text-sm text-muted-foreground truncate max-w-[200px] sm:max-w-md">
                                                {chat.lastMessage || "No messages yet"}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="text-xs text-muted-foreground">
                                        {chat.lastMessageTime?.toDate().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </div>
                                </CardContent>
                            </Card>
                        ))
                    )}
                </div>
            </div>
        </Layout>
    );
}
