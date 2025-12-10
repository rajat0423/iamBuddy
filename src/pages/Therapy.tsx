import { useState, useMemo, useEffect } from "react";
import Layout from "@/components/shared/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Video, Mic, MicOff, VideoOff, PhoneOff, Users, MessageSquare, Loader2 } from "lucide-react";
import AgoraRTC from "agora-rtc-sdk-ng";
import useAgora from "@/hooks/useAgora";
import VideoPlayer from "@/components/video/VideoPlayer";
import { AGORA_APP_ID } from "@/lib/agora-config";

const SESSIONS = [
    {
        id: "room-1", // Changed to string for channel name
        title: "Anxiety Support Group",
        host: "Dr. Sarah Cohen",
        participants: 12,
        time: "Live Now",
        image: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=800&auto=format&fit=crop&q=60",
        token: "006eJxTYHgm5D2z5FjS5qft89f92j5745r2V+pbt7/P3v1+Vcyv4a0Cg4mZYVqaRbKpsUmSiUlSokVampGhuVlyooGhoZm5RZK5gce21IZARgY5n6dMDIwMEAjiszCUpBaXMDAAAJjPH7g=", // Generated token for room-1 uid 12345
    },
    {
        id: "room-2",
        title: "Mindfulness Practice",
        host: "Mark Williams",
        participants: 8,
        time: "Starts in 15 mins",
        image: "https://images.unsplash.com/photo-1544717305-2782549b5136?w=800&auto=format&fit=crop&q=60",
        token: "006eJxTYCh7eWJ330+5O3N8vUu0H72X2iV3avv+uTPs4sw3y/y/bFuhwGBiaWaRbGpskmRiklRokaZmZGhulpxoYGhoZm6RZG7gsS21IZCRoY5vNhMDIwMEgvgMDCWpxSUMDAA0YB+h", // Generated token for room-2 uid 12345
    },
];

export default function Therapy() {
    const [activeSessionId, setActiveSessionId] = useState<string | null>(null);
    const [isMuted, setIsMuted] = useState(false);
    const [isVideoOff, setIsVideoOff] = useState(false);

    // Initialize Agora Client
    const client = useMemo(() => AgoraRTC.createClient({ codec: "vp8", mode: "rtc" }), []);

    // Use Custom Hook
    const {
        localAudioTrack,
        localVideoTrack,
        joinState,
        leave,
        join,
        remoteUsers,
        error,
    } = useAgora(client);

    // Handle Join
    const handleJoin = async (id: string) => {
        if (!AGORA_APP_ID) {
            alert("Please configure a valid Agora App ID in src/lib/agora-config.ts");
            return;
        }
        const session = SESSIONS.find(s => s.id === id);
        setActiveSessionId(id);
        // Join with UID 12345 and the specific token
        await join(id, 12345, session?.token);
    };

    // Handle Leave
    const handleLeave = async () => {
        await leave();
        setActiveSessionId(null);
        setIsMuted(false);
        setIsVideoOff(false);
    };

    // Mute Logic
    useEffect(() => {
        if (localAudioTrack) {
            localAudioTrack.setEnabled(!isMuted);
        }
    }, [isMuted, localAudioTrack]);

    // Video Toggle Logic
    useEffect(() => {
        if (localVideoTrack) {
            localVideoTrack.setEnabled(!isVideoOff);
        }
    }, [isVideoOff, localVideoTrack]);


    if (activeSessionId) {
        const session = SESSIONS.find((s) => s.id === activeSessionId);
        return (
            <Layout>
                <div className="h-[calc(100vh-8rem)] flex flex-col">
                    <div className="flex-1 bg-black/95 rounded-2xl overflow-hidden relative shadow-2xl border border-white/10 flex flex-col items-center justify-center">

                        {/* Loading State */}
                        {!joinState && !error && <div className="text-white flex items-center gap-2"><Loader2 className="animate-spin" /> Joining {session?.title}...</div>}

                        {/* Error State */}
                        {error && (
                            <div className="flex flex-col items-center gap-4 text-red-500 p-8 text-center max-w-md">
                                <p className="text-xl font-bold">Failed to Join</p>
                                <p className="text-sm bg-black/50 p-4 rounded text-white font-mono break-all">
                                    {(error as any).code || error.name}: {error.message}
                                </p>
                                <Button variant="secondary" onClick={handleLeave}>Go Back</Button>
                            </div>
                        )}

                        {/* Video Grid */}
                        {joinState && (
                            <div className="w-full h-full p-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 auto-rows-fr">
                                {/* Local User */}
                                <div className="relative rounded-xl overflow-hidden bg-gray-900 border border-gray-800 shadow-lg">
                                    <VideoPlayer videoTrack={localVideoTrack} className="w-full h-full object-cover" />
                                    <div className="absolute bottom-2 left-2 bg-black/50 px-2 py-1 rounded-md text-white text-xs">You</div>
                                    {isVideoOff && (
                                        <div className="absolute inset-0 flex items-center justify-center bg-gray-800 text-white/50">
                                            <VideoOff className="h-12 w-12" />
                                        </div>
                                    )}
                                </div>

                                {/* Remote Users */}
                                {remoteUsers.map((user) => (
                                    <div key={user.uid} className="relative rounded-xl overflow-hidden bg-gray-900 border border-gray-800 shadow-lg">
                                        <VideoPlayer videoTrack={user.videoTrack} className="w-full h-full object-cover" />
                                        <div className="absolute bottom-2 left-2 bg-black/50 px-2 py-1 rounded-md text-white text-xs">User {user.uid}</div>
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* Overlay Session Info */}
                        <div className="absolute top-4 left-4 bg-black/50 backdrop-blur-md px-4 py-2 rounded-full text-white flex items-center gap-2 z-10">
                            <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                            {session?.title || "Live Session"}
                        </div>

                        {/* Controls */}
                        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex items-center gap-4 bg-black/60 backdrop-blur-xl p-4 rounded-full border border-white/10 z-20">
                            <Button
                                variant={isMuted ? "destructive" : "secondary"}
                                size="icon"
                                className="rounded-full h-12 w-12"
                                onClick={() => setIsMuted(!isMuted)}
                            >
                                {isMuted ? <MicOff className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
                            </Button>
                            <Button
                                variant={isVideoOff ? "destructive" : "secondary"}
                                size="icon"
                                className="rounded-full h-12 w-12"
                                onClick={() => setIsVideoOff(!isVideoOff)}
                            >
                                {isVideoOff ? <VideoOff className="h-5 w-5" /> : <Video className="h-5 w-5" />}
                            </Button>
                            <Button
                                variant="destructive"
                                size="icon"
                                className="rounded-full h-14 w-14"
                                onClick={handleLeave}
                            >
                                <PhoneOff className="h-6 w-6" />
                            </Button>
                            <Button variant="secondary" size="icon" className="rounded-full h-12 w-12">
                                <MessageSquare className="h-5 w-5" />
                            </Button>
                        </div>
                    </div>
                </div>
            </Layout>
        );
    }

    return (
        <Layout>
            <div className="max-w-5xl mx-auto space-y-8">
                <div className="text-center space-y-2 mb-12">
                    <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent inline-flex items-center gap-2">
                        <Video className="h-8 w-8 text-primary" />
                        Live Group Therapy
                    </h1>
                    <p className="text-muted-foreground">
                        Join professional-led support groups and connect with others.
                    </p>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                    {SESSIONS.map((session) => (
                        <Card key={session.id} className="glass-card border-none overflow-hidden group hover:ring-2 hover:ring-primary/50 transition-all">
                            <div className="h-48 overflow-hidden relative">
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent z-10" />
                                <img
                                    src={session.image}
                                    alt={session.title}
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                />
                                <div className="absolute bottom-4 left-4 z-20 text-white">
                                    <h3 className="font-bold text-xl">{session.title}</h3>
                                    <p className="text-white/80 text-sm">Hosted by {session.host}</p>
                                </div>
                                <div className="absolute top-4 right-4 z-20 bg-black/50 backdrop-blur-md px-3 py-1 rounded-full text-xs text-white font-medium flex items-center gap-1">
                                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                                    {session.time}
                                </div>
                            </div>
                            <CardContent className="p-6 flex items-center justify-between">
                                <div className="flex items-center gap-2 text-muted-foreground text-sm">
                                    <Users className="h-4 w-4" />
                                    {session.participants} participating
                                </div>
                                <Button onClick={() => handleJoin(session.id)}>
                                    Join Session
                                </Button>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        </Layout>
    );
}
