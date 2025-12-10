import { useState } from "react";
import Layout from "@/components/shared/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Video, Mic, MicOff, VideoOff, PhoneOff, Users, MessageSquare } from "lucide-react";

const SESSIONS = [
    {
        id: 1,
        title: "Anxiety Support Group",
        host: "Dr. Sarah Cohen",
        participants: 12,
        time: "Live Now",
        image: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=800&auto=format&fit=crop&q=60",
    },
    {
        id: 2,
        title: "Mindfulness Practice",
        host: "Mark Williams",
        participants: 8,
        time: "Starts in 15 mins",
        image: "https://images.unsplash.com/photo-1544717305-2782549b5136?w=800&auto=format&fit=crop&q=60",
    },
];

export default function Therapy() {
    const [activeSession, setActiveSession] = useState<number | null>(null);
    const [isMuted, setIsMuted] = useState(false);
    const [isVideoOff, setIsVideoOff] = useState(false);

    const handleJoin = (id: number) => {
        setActiveSession(id);
    };

    const handleLeave = () => {
        setActiveSession(null);
    };

    if (activeSession) {
        const session = SESSIONS.find((s) => s.id === activeSession);
        return (
            <Layout>
                <div className="h-[calc(100vh-8rem)] flex flex-col">
                    <div className="flex-1 bg-black/90 rounded-2xl overflow-hidden relative shadow-2xl border border-white/10">
                        {/* Main Video Feed (Placeholder) */}
                        <img
                            src={session?.image}
                            alt="Session Host"
                            className="w-full h-full object-cover opacity-80"
                        />

                        {/* Overlay UI */}
                        <div className="absolute top-4 left-4 bg-black/50 backdrop-blur-md px-4 py-2 rounded-full text-white flex items-center gap-2">
                            <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                            {session?.title}
                        </div>

                        {/* Participant Grid (Mock) */}
                        <div className="absolute top-4 right-4 flex gap-2">
                            {[1, 2, 3].map((i) => (
                                <div key={i} className="w-24 h-16 bg-gray-800 rounded-lg border border-white/20 overflow-hidden">
                                    <div className="w-full h-full bg-gradient-to-br from-gray-700 to-gray-900 flex items-center justify-center">
                                        <Users className="h-4 w-4 text-white/50" />
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Controls */}
                        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex items-center gap-4 bg-black/50 backdrop-blur-xl p-4 rounded-2xl border border-white/10">
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
