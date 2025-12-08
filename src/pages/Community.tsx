import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { db, auth } from "@/firebase/config";
import { collection, query, getDocs, limit, where, onSnapshot } from "firebase/firestore";
import { ensureUserIdentity } from "@/lib/randomIdentity";
import { sendFriendRequest, acceptFriendRequest, rejectFriendRequest, getIncomingRequests, getFriends } from "@/lib/friends";
import { getOrCreateChat } from "@/lib/chat";
import Layout from "@/components/shared/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Users, UserPlus, MessageCircle, Check, X } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface UserProfile {
    id: string;
    randomPseudonym?: string;
    avatarId?: number;
}

export default function Community() {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState("chats");
    const [users, setUsers] = useState<UserProfile[]>([]);
    const [requests, setRequests] = useState<any[]>([]);
    const [friends, setFriends] = useState<UserProfile[]>([]);
    const [myIdentity, setMyIdentity] = useState<any>(null);

    const [chats, setChats] = useState<any[]>([]);
    const [error, setError] = useState<string | null>(null);

    // Ensure current user has an identity
    useEffect(() => {
        if (user) {
            ensureUserIdentity(user.uid)
                .then(identity => setMyIdentity(identity))
                .catch(err => {
                    console.error("Identity Error:", err);
                    setError("Failed to load identity: " + err.message);
                });
        }
    }, [user]);

    // Fetch data based on tab
    useEffect(() => {
        if (!user) return;
        setError(null);

        const fetchData = async () => {
            try {
                if (activeTab === "discover") {
                    const q = query(collection(db, "users"), limit(20));
                    const snap = await getDocs(q);
                    const allUsers = snap.docs.map(d => ({ id: d.id, ...d.data() })) as UserProfile[];
                    setUsers(allUsers.filter(u => u.id !== user.uid));
                } else if (activeTab === "requests") {
                    const reqs = await getIncomingRequests(user.uid);
                    setRequests(reqs);
                } else if (activeTab === "friends") {
                    const friendIds = await getFriends(user.uid);
                    if (friendIds.length > 0) {
                        const friendsData = [];
                        for (const fid of friendIds) {
                            // @ts-ignore
                            const snap = await getDocs(query(collection(db, "users"), where("__name__", "==", fid)));
                            if (!snap.empty) friendsData.push({ id: snap.docs[0].id, ...snap.docs[0].data() });
                        }
                        setFriends(friendsData as UserProfile[]);
                    } else {
                        setFriends([]);
                    }
                }
            } catch (err: any) {
                console.error("Fetch Error:", err);
                setError(`Error loading ${activeTab}: ` + err.message);
            }
        };

        fetchData();
    }, [user, activeTab]);

    // Listen for chats when on Chats tab
    useEffect(() => {
        if (!user || activeTab !== "chats") return;

        const q = query(
            collection(db, "chats"),
            where("users", "array-contains", user.uid)
        );

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const chatList = snapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            }));
            // Sort by last message time locally
            // @ts-ignore
            chatList.sort((a, b) => (b.lastMessageTime?.seconds || 0) - (a.lastMessageTime?.seconds || 0));
            setChats(chatList);
        });

        return () => unsubscribe();
    }, [user, activeTab]);

    const handleConnect = async (targetUser: UserProfile) => {
        if (!user || !myIdentity) return;
        await sendFriendRequest(user.uid, targetUser.id, myIdentity.randomPseudonym || "Anonymous");
        alert("Request sent!");
    };

    const handleAccept = async (req: any) => {
        if (!user) return;
        await acceptFriendRequest(req.id, req.fromUserId, user.uid);
        setRequests(prev => prev.filter(r => r.id !== req.id));
    };

    const handleReject = async (req: any) => {
        await rejectFriendRequest(req.id);
        setRequests(prev => prev.filter(r => r.id !== req.id));
    };

    const handleChat = async (friendId: string) => {
        if (!user) return;
        const chatId = await getOrCreateChat(user.uid, friendId);
        navigate(`/chat/${chatId}`);
    };

    return (
        <Layout>
            <div className="max-w-4xl mx-auto space-y-8">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent inline-flex items-center gap-2">
                            <Users className="h-8 w-8 text-primary" />
                            Community Hub
                        </h1>
                        <p className="text-muted-foreground mt-2">
                            Connect with others, find support, and make new friends.
                        </p>
                    </div>
                </div>

                <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                    <TabsList className="grid w-full grid-cols-4 glass-card">
                        <TabsTrigger value="chats">Chats</TabsTrigger>
                        <TabsTrigger value="discover">Discover</TabsTrigger>
                        <TabsTrigger value="requests">Requests {requests.length > 0 && `(${requests.length})`}</TabsTrigger>
                        <TabsTrigger value="friends">My Friends</TabsTrigger>
                    </TabsList>

                    <TabsContent value="chats" className="mt-6 space-y-4">
                        {chats.length === 0 ? (
                            <div className="text-center py-12 text-muted-foreground">
                                <MessageCircle className="h-12 w-12 mx-auto mb-4 opacity-50" />
                                <p>No conversations yet. Find friends to chat!</p>
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
                    </TabsContent>

                    <TabsContent value="discover" className="mt-6 space-y-4">
                        {users.length === 0 ? (
                            <div className="text-center py-12 text-muted-foreground">
                                <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
                                <p>No other users found yet.</p>
                                <p className="text-sm mt-2">Invite friends to join!</p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {users.map(u => (
                                    <Card key={u.id} className="glass-card border-none">
                                        <CardContent className="p-4 flex items-center justify-between">
                                            <div className="flex items-center gap-3">
                                                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                                                    <Users className="h-5 w-5 text-primary" />
                                                </div>
                                                <div>
                                                    <h3 className="font-semibold">{u.randomPseudonym || "Anonymous User"}</h3>
                                                    <p className="text-xs text-muted-foreground">IamBuddy Member</p>
                                                </div>
                                            </div>
                                            <Button size="sm" variant="outline" onClick={() => handleConnect(u)}>
                                                <UserPlus className="h-4 w-4 mr-2" />
                                                Connect
                                            </Button>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        )}
                    </TabsContent>

                    <TabsContent value="requests" className="mt-6 space-y-4">
                        {requests.length === 0 ? (
                            <p className="text-center text-muted-foreground py-8">No pending requests.</p>
                        ) : (
                            requests.map(req => (
                                <Card key={req.id} className="glass-card border-none">
                                    <CardContent className="p-4 flex items-center justify-between">
                                        <div>
                                            <h3 className="font-semibold">{req.fromUserName || "Someone"}</h3>
                                            <p className="text-xs text-muted-foreground">wants to be your buddy.</p>
                                        </div>
                                        <div className="flex gap-2">
                                            <Button size="sm" onClick={() => handleAccept(req)}>
                                                <Check className="h-4 w-4 mr-2" /> Accept
                                            </Button>
                                            <Button size="sm" variant="ghost" onClick={() => handleReject(req)}>
                                                <X className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))
                        )}
                    </TabsContent>

                    <TabsContent value="friends" className="mt-6 space-y-4">
                        {friends.length === 0 ? (
                            <p className="text-center text-muted-foreground py-8">No friends yet. Go to Discover!</p>
                        ) : (
                            friends.map(f => (
                                <Card key={f.id} className="glass-card border-none">
                                    <CardContent className="p-4 flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <div className="h-10 w-10 rounded-full bg-green-500/10 flex items-center justify-center">
                                                <Users className="h-5 w-5 text-green-500" />
                                            </div>
                                            <div>
                                                <h3 className="font-semibold">{f.randomPseudonym || "Anonymous User"}</h3>
                                                <p className="text-xs text-muted-foreground">Friend</p>
                                            </div>
                                        </div>
                                        <Button size="sm" onClick={() => handleChat(f.id)}>
                                            <MessageCircle className="h-4 w-4 mr-2" />
                                            Chat
                                        </Button>
                                    </CardContent>
                                </Card>
                            ))
                        )}
                    </TabsContent>
                </Tabs>
            </div>
        </Layout>
    );
}
