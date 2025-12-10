import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { db } from "@/firebase/config";
import { collection, query, getDocs, limit, where, onSnapshot } from "firebase/firestore";
import { ensureUserIdentity } from "@/lib/randomIdentity";
import { sendFriendRequest, acceptFriendRequest, rejectFriendRequest, getIncomingRequests, getFriends, getOutgoingRequests } from "@/lib/friends";
import { getOrCreateChat } from "@/lib/chat";
import Layout from "@/components/shared/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Users, UserPlus, MessageCircle, Check, X, Heart, Brain, Sun, Sparkles, User, Clock } from "lucide-react";
import { useNavigate } from "react-router-dom";

import { doc, getDoc } from "firebase/firestore";
import { avatars } from "@/lib/avatars";

import { type FriendRequest } from "@/lib/friends";

interface UserProfile {
    id: string;
    randomPseudonym?: string;
    displayName?: string;
    avatarId?: number;
    photoURL?: string;
}

interface Identity {
    randomPseudonym: string;
    avatarId: number;
}

interface ChatSession {
    id: string;
    users: string[];
    lastMessage: string | null;
    lastMessageTime: any; // Firestore Timestamp
    otherUserName?: string;
    otherUserAvatar?: string;
}

const COMMUNITIES = [
    {
        id: "community_anxiety",
        name: "Anxiety Support",
        description: "A safe space to share feelings and finding calm.",
        icon: Brain,
        color: "text-purple-400",
        bgColor: "bg-purple-500/10"
    },
    {
        id: "community_depression",
        name: "Depression Support",
        description: "You are not alone. Connect and heal together.",
        icon: Heart,
        color: "text-blue-400",
        bgColor: "bg-blue-500/10"
    },
    {
        id: "community_mindfulness",
        name: "Mindfulness & Zen",
        description: "Meditation tips, mindful moments and peace.",
        icon: Sun,
        color: "text-orange-400",
        bgColor: "bg-orange-500/10"
    },
    {
        id: "community_wellness",
        name: "Positivity & Wellness",
        description: "Daily affirmations and positive vibes only.",
        icon: Sparkles,
        color: "text-yellow-400",
        bgColor: "bg-yellow-500/10"
    },
    {
        id: "community_relationships",
        name: "Relationship Advice",
        description: "Navigating connections with friends and family.",
        icon: Users,
        color: "text-pink-400",
        bgColor: "bg-pink-500/10"
    }
];

export default function Community() {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState("communities");
    const [users, setUsers] = useState<UserProfile[]>([]);
    const [requests, setRequests] = useState<FriendRequest[]>([]);
    const [friends, setFriends] = useState<UserProfile[]>([]);
    const [myIdentity, setMyIdentity] = useState<Identity | null>(null);
    const [outgoingRequestIds, setOutgoingRequestIds] = useState<Set<string>>(new Set());

    const [chats, setChats] = useState<ChatSession[]>([]);
    const [, setError] = useState<string | null>(null);

    // Ensure current user has an identity
    useEffect(() => {
        if (user) {
            ensureUserIdentity(user.uid)
                .then(identity => setMyIdentity(identity as Identity))
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

                    // Fetch my outgoing requests to update UI
                    const myRequests = await getOutgoingRequests(user.uid);
                    // @ts-ignore
                    const sentIds = new Set(myRequests.map(r => r.toUserId));
                    setOutgoingRequestIds(sentIds);

                } else if (activeTab === "requests") {
                    const reqs = await getIncomingRequests(user.uid);
                    setRequests(reqs as FriendRequest[]);
                } else if (activeTab === "friends") {
                    const friendIds = await getFriends(user.uid);
                    if (friendIds.length > 0) {
                        const friendsData = [];
                        for (const fid of friendIds) {
                            const snap = await getDocs(query(collection(db, "users"), where("__name__", "==", fid)));
                            if (!snap.empty) friendsData.push({ id: snap.docs[0].id, ...snap.docs[0].data() });
                        }
                        setFriends(friendsData as UserProfile[]);
                    } else {
                        setFriends([]);
                    }
                }
            } catch (err) {
                const message = err instanceof Error ? err.message : "Unknown error";
                console.error("Fetch Error:", err);
                setError(`Error loading ${activeTab}: ` + message);
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

        const unsubscribe = onSnapshot(q, async (snapshot) => {
            const chatListProms = snapshot.docs.map(async (docSnap) => {
                const data = docSnap.data();

                // If it's a community chat (shouldn't be in this list usually unless we add user to it, but for now we separate them)
                // Actually, if we use the same 'chats' collection, public chats might not have 'users' array including us unless we join.
                // For this implementation, the "Communities" tabs links directly to the chat ID.
                // The "Chats" tab is for DMs.

                const otherUserId = data.users.find((u: string) => u !== user.uid);
                let otherUserName = "Unknown User";
                let otherUserAvatar = undefined;

                if (otherUserId) {
                    const userDoc = await getDoc(doc(db, "users", otherUserId));
                    if (userDoc.exists()) {
                        const userData = userDoc.data();
                        otherUserName = userData.displayName || userData.randomPseudonym || "Anonymous";
                        otherUserAvatar = userData.photoURL || avatars[(userData.avatarId || 0) % avatars.length];
                    }
                }

                return {
                    id: docSnap.id,
                    ...data,
                    otherUserName,
                    otherUserAvatar
                };
            });

            const chatList = await Promise.all(chatListProms);

            // Sort by last message time locally
            chatList.sort((a, b) => {
                const timeA = (a as ChatSession).lastMessageTime?.seconds || 0;
                const timeB = (b as ChatSession).lastMessageTime?.seconds || 0;
                return timeB - timeA;
            });
            setChats(chatList as ChatSession[]);
        });

        return () => unsubscribe();
    }, [user, activeTab]);

    const handleConnect = async (targetUser: UserProfile) => {
        if (!user || !myIdentity) return;
        setOutgoingRequestIds(prev => new Set(prev).add(targetUser.id)); // Optimistic update
        await sendFriendRequest(user.uid, targetUser.id, user.displayName || myIdentity.randomPseudonym || "Anonymous");
    };

    const handleAccept = async (req: FriendRequest) => {
        if (!user) return;
        await acceptFriendRequest(req.id, req.fromUserId, user.uid);
        await acceptFriendRequest(req.id, req.fromUserId, user.uid);

        // Optimistically update UI
        setRequests(prev => prev.filter(r => r.id !== req.id));

        // Fetch new friend details to add to list immediately
        try {
            const newFriendDoc = await getDoc(doc(db, "users", req.fromUserId));
            if (newFriendDoc.exists()) {
                const newFriend = { id: newFriendDoc.id, ...newFriendDoc.data() } as UserProfile;
                setFriends(prev => [...prev, newFriend]);
            }
        } catch (e) {
            console.error("Error updating friends list:", e);
        }
    };

    const handleReject = async (req: FriendRequest) => {
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
                    <TabsList className="grid w-full grid-cols-5 glass-card">
                        <TabsTrigger value="communities">Topics</TabsTrigger>
                        <TabsTrigger value="chats">Chats</TabsTrigger>
                        <TabsTrigger value="discover">Discover</TabsTrigger>
                        <TabsTrigger value="requests">Requests {requests.length > 0 && `(${requests.length})`}</TabsTrigger>
                        <TabsTrigger value="friends">Friends</TabsTrigger>
                    </TabsList>

                    <TabsContent value="communities" className="mt-6 space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {COMMUNITIES.map((community) => (
                                <Card
                                    key={community.id}
                                    className="glass-card border-none hover:bg-white/5 transition-all cursor-pointer group"
                                    onClick={() => navigate(`/chat/${community.id}`)}
                                >
                                    <CardContent className="p-6 flex items-start gap-4">
                                        <div className={`p-3 rounded-xl ${community.bgColor} ${community.color}`}>
                                            <community.icon className="h-8 w-8" />
                                        </div>
                                        <div className="flex-1">
                                            <h3 className="text-lg font-bold group-hover:text-primary transition-colors">
                                                {community.name}
                                            </h3>
                                            <p className="text-sm text-muted-foreground mt-1">
                                                {community.description}
                                            </p>
                                            <div className="mt-4 flex items-center gap-2 text-xs font-medium text-primary/80">
                                                <MessageCircle className="h-3 w-3" />
                                                Start Chatting
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </TabsContent>

                    <TabsContent value="chats" className="mt-6 space-y-4">
                        {chats.length === 0 ? (
                            <div className="text-center py-12 text-muted-foreground">
                                <MessageCircle className="h-12 w-12 mx-auto mb-4 opacity-50" />
                                <p>No private conversations yet.</p>
                                <p className="text-sm">Join a Topic below or find friends!</p>
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
                                            <div className="h-12 w-12 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white font-bold text-lg overflow-hidden">
                                                {chat.otherUserAvatar ? (
                                                    <img src={chat.otherUserAvatar} alt="Avatar" className="h-full w-full object-cover" />
                                                ) : (
                                                    <MessageCircle className="h-6 w-6" />
                                                )}
                                            </div>
                                            <div>
                                                <h3 className="font-semibold group-hover:text-primary transition-colors">
                                                    {chat.otherUserName || "Conversation"}
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
                                <Button variant="outline" size="sm" className="mt-4" onClick={() => import("@/lib/seed").then(m => m.seedUsers())}>
                                    Dev: Seed Dummy Users
                                </Button>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {users.map(u => (
                                    <Card key={u.id} className="glass-card border-none">
                                        <CardContent className="p-4 flex items-center justify-between">
                                            <div className="flex items-center gap-3">
                                                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center overflow-hidden">
                                                    <img
                                                        src={u.photoURL || avatars[(u.avatarId || 0) % avatars.length]}
                                                        alt="Avatar"
                                                        className="h-full w-full object-cover"
                                                    />
                                                </div>
                                                <div>
                                                    <h3 className="font-semibold">{u.displayName || u.randomPseudonym || "Anonymous User"}</h3>
                                                    <p className="text-xs text-muted-foreground">IamBuddy Member</p>
                                                </div>
                                            </div>
                                            <Button
                                                size="sm"
                                                variant={outgoingRequestIds.has(u.id) ? "ghost" : "outline"}
                                                onClick={() => handleConnect(u)}
                                                disabled={outgoingRequestIds.has(u.id)}
                                                className={outgoingRequestIds.has(u.id) ? "text-muted-foreground" : ""}
                                            >
                                                {outgoingRequestIds.has(u.id) ? (
                                                    <>
                                                        <Clock className="h-4 w-4 mr-2" />
                                                        Request Sent
                                                    </>
                                                ) : (
                                                    <>
                                                        <UserPlus className="h-4 w-4 mr-2" />
                                                        Connect
                                                    </>
                                                )}
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
                                            <div className="h-10 w-10 rounded-full bg-green-500/10 flex items-center justify-center overflow-hidden">
                                                <img
                                                    src={f.photoURL || avatars[(f.avatarId || 0) % avatars.length]}
                                                    alt="Avatar"
                                                    className="h-full w-full object-cover"
                                                />
                                            </div>
                                            <div>
                                                <h3 className="font-semibold">{f.displayName || f.randomPseudonym || "Anonymous User"}</h3>
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
