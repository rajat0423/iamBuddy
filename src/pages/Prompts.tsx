import { useState, useEffect } from "react";
import Layout from "@/components/shared/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { generatePrompt } from "@/lib/genkit";
import { db } from "@/firebase/config";
import { collection, addDoc, serverTimestamp, query, orderBy, onSnapshot, deleteDoc, doc, Timestamp } from "firebase/firestore";
import { useAuth } from "@/hooks/useAuth";
import { Sparkles, Save, RefreshCw, BookOpen, Trash2, MessageCircle, Send } from "lucide-react";
import { Input } from "@/components/ui/input";

interface Comment {
    id: string;
    text: string;
    authorName: string;
    createdAt: Timestamp;
}

interface Story {
    id: string;
    prompt: string;
    content: string;
    authorId: string;
    authorName: string;
    authorAvatar: string;
    createdAt: Timestamp;
    comments?: Comment[];
}

export default function StoryWriting() {
    const { user } = useAuth();
    const [prompt, setPrompt] = useState<string>("");
    const [response, setResponse] = useState<string>("");
    const [isLoading, setIsLoading] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [stories, setStories] = useState<Story[]>([]);
    const [commentText, setCommentText] = useState<{ [key: string]: string }>({});

    // Fetch Stories
    useEffect(() => {
        const q = query(collection(db, "stories"), orderBy("createdAt", "desc"));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const storiesData = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            })) as Story[];
            setStories(storiesData);
        });
        return () => unsubscribe();
    }, []);

    // Fetch Comments for each story (simplified: real-time listener for each might be heavy, but okay for MVP)
    useEffect(() => {
        const unsubscribes: (() => void)[] = [];
        stories.forEach(story => {
            const q = query(collection(db, "stories", story.id, "comments"), orderBy("createdAt", "asc"));
            const unsub = onSnapshot(q, (snapshot) => {
                const comments = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Comment[];
                setStories(prev => prev.map(s => s.id === story.id ? { ...s, comments } : s));
            });
            unsubscribes.push(unsub);
        });
        return () => unsubscribes.forEach(u => u());
    }, [stories.length]); // Re-run when new stories appear

    const handleGenerate = async () => {
        setIsLoading(true);
        const newPrompt = await generatePrompt();
        setPrompt(newPrompt);
        setIsLoading(false);
    };

    const handleSave = async () => {
        if (!user || !prompt || !response) return;
        setIsSaving(true);
        try {
            await addDoc(collection(db, "stories"), {
                prompt,
                content: response,
                authorId: user.uid,
                authorName: user.displayName || "Anonymous",
                authorAvatar: user.photoURL || "",
                createdAt: serverTimestamp(),
            });
            setResponse("");
            setPrompt("");
            alert("Story published!");
        } catch (error) {
            console.error("Error saving story:", error);
            alert("Failed to publish story.");
        } finally {
            setIsSaving(false);
        }
    };

    const handleDelete = async (storyId: string) => {
        if (!confirm("Delete this story?")) return;
        try {
            await deleteDoc(doc(db, "stories", storyId));
        } catch (error) {
            console.error("Error deleting story:", error);
            alert("Failed to delete story.");
        }
    };

    const handleAddComment = async (storyId: string) => {
        const text = commentText[storyId];
        if (!user || !text?.trim()) return;

        try {
            await addDoc(collection(db, "stories", storyId, "comments"), {
                text,
                authorName: user.displayName || "Anonymous",
                createdAt: serverTimestamp()
            });
            setCommentText(prev => ({ ...prev, [storyId]: "" }));
        } catch (error) {
            console.error("Error adding comment:", error);
        }
    };

    return (
        <Layout>
            <div className="max-w-4xl mx-auto space-y-8 pb-20">
                <div className="text-center space-y-4">
                    <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent inline-flex items-center gap-3">
                        <Sparkles className="h-10 w-10 text-purple-500" />
                        Soul Scripts
                    </h1>
                    <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                        Generate a prompt, write a story, and share it with the community!
                    </p>
                </div>

                {/* Writing Section */}
                <Card className="glass-card border-none shadow-xl">
                    <CardContent className="p-8 space-y-6">
                        <div className="bg-white/50 dark:bg-black/20 p-6 rounded-2xl border border-white/20 min-h-[100px] flex items-center justify-center text-center">
                            {prompt ? (
                                <p className="text-xl font-medium italic">"{prompt}"</p>
                            ) : (
                                <div className="text-muted-foreground flex flex-col items-center gap-2">
                                    <BookOpen className="h-8 w-8 opacity-50" />
                                    <p>Click generate to get started...</p>
                                </div>
                            )}
                        </div>

                        <div className="flex justify-center">
                            <Button onClick={handleGenerate} disabled={isLoading} size="lg" className="bg-gradient-to-r from-purple-500 to-pink-500">
                                {isLoading ? <RefreshCw className="h-5 w-5 mr-2 animate-spin" /> : <Sparkles className="h-5 w-5 mr-2" />}
                                {prompt ? "New Prompt" : "Generate Prompt"}
                            </Button>
                        </div>

                        {prompt && (
                            <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4">
                                <textarea
                                    className="w-full min-h-[200px] p-6 rounded-xl bg-white/40 dark:bg-black/20 border border-white/20 focus:ring-2 focus:ring-purple-500/50 outline-none resize-none text-lg"
                                    placeholder="Once upon a time..."
                                    value={response}
                                    onChange={(e) => setResponse(e.target.value)}
                                />
                                <div className="flex justify-end">
                                    <Button onClick={handleSave} disabled={isSaving || !response.trim()}>
                                        {isSaving ? <RefreshCw className="h-4 w-4 mr-2 animate-spin" /> : <Save className="h-4 w-4 mr-2" />}
                                        Publish Story
                                    </Button>
                                </div>
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Stories Feed */}
                <div className="space-y-6">
                    <h2 className="text-2xl font-bold">Community Stories</h2>
                    {stories.map(story => (
                        <Card key={story.id} className="glass-card border-none hover:shadow-md transition-all">
                            <CardHeader className="flex flex-row items-start justify-between">
                                <div className="flex items-center gap-3">
                                    <img src={story.authorAvatar || "https://api.dicebear.com/7.x/avataaars/svg?seed=Anonymous"} className="h-10 w-10 rounded-full bg-white" alt="Avatar" />
                                    <div>
                                        <CardTitle className="text-lg">{story.authorName}</CardTitle>
                                        <p className="text-xs text-muted-foreground">{story.createdAt?.toDate().toLocaleDateString()}</p>
                                    </div>
                                </div>
                                {user?.uid === story.authorId && (
                                    <Button variant="ghost" size="icon" className="text-red-400 hover:text-red-600" onClick={() => handleDelete(story.id)}>
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                )}
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="bg-purple-50 dark:bg-purple-900/20 p-3 rounded-lg text-sm italic text-muted-foreground">
                                    Prompt: {story.prompt}
                                </div>
                                <p className="whitespace-pre-wrap leading-relaxed">{story.content}</p>

                                {/* Comments Section */}
                                <div className="pt-4 border-t border-border/50 space-y-4">
                                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                        <MessageCircle className="h-4 w-4" />
                                        {story.comments?.length || 0} Comments
                                    </div>

                                    <div className="space-y-3 pl-4 border-l-2 border-border/50">
                                        {story.comments?.map(comment => (
                                            <div key={comment.id} className="text-sm">
                                                <span className="font-semibold">{comment.authorName}: </span>
                                                <span className="text-muted-foreground">{comment.text}</span>
                                            </div>
                                        ))}
                                    </div>

                                    <div className="flex gap-2">
                                        <Input
                                            placeholder="Write a comment..."
                                            value={commentText[story.id] || ""}
                                            onChange={(e) => setCommentText(prev => ({ ...prev, [story.id]: e.target.value }))}
                                            className="h-9 bg-white/50"
                                        />
                                        <Button size="icon" className="h-9 w-9" onClick={() => handleAddComment(story.id)}>
                                            <Send className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        </Layout>
    );
}
