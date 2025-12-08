import { useState } from "react";
import Layout from "@/components/shared/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea"; // We might need to create this or use standard textarea
import { generatePrompt } from "@/lib/genkit";
import { db } from "@/firebase/config";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { useAuth } from "@/hooks/useAuth";
import { Sparkles, PenTool, Save, RefreshCw, BookOpen } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function Prompts() {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [prompt, setPrompt] = useState<string>("");
    const [response, setResponse] = useState<string>("");
    const [isLoading, setIsLoading] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleGenerate = async () => {
        setIsLoading(true);
        setError(null);
        const newPrompt = await generatePrompt();
        setPrompt(newPrompt);
        setIsLoading(false);
    };

    const handleSave = async () => {
        if (!user || !prompt || !response) return;

        setIsSaving(true);
        setError(null);
        try {
            await addDoc(collection(db, "users", user.uid, "journal_entries"), {
                title: "Prompt: " + prompt,
                content: response,
                mood: "Creative", // Default mood for writing prompts
                createdAt: serverTimestamp(),
                tags: ["creative-writing", "prompt"]
            });
            alert("Saved to Journal!");
            setResponse("");
            setPrompt("");
            navigate("/journal");
        } catch (error: any) {
            console.error("Error saving to journal:", error);
            setError("Failed to save: " + error.message);
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <Layout>
            <div className="max-w-3xl mx-auto space-y-8">
                <div className="text-center space-y-4">
                    <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent inline-flex items-center gap-3">
                        <Sparkles className="h-10 w-10 text-purple-500" />
                        Creative Writing
                    </h1>
                    <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                        Unleash your creativity and clear your mind. Generate a prompt, write your thoughts, and save them to your journal.
                    </p>
                    {error && (
                        <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-lg text-red-500 text-sm max-w-lg mx-auto text-left space-y-2">
                            <div className="font-bold flex items-center gap-2">
                                <span>❌ Error:</span>
                                <span>{error}</span>
                            </div>
                            <div className="text-xs bg-black/5 dark:bg-white/5 p-3 rounded font-mono space-y-1">
                                <p><strong>Debug Info:</strong></p>
                                <p>Project ID: {import.meta.env.VITE_FIREBASE_PROJECT_ID}</p>
                                <p>User ID: {user?.uid || "Not Logged In"}</p>
                                <p>Auth Status: {user ? "Authenticated" : "Unauthenticated"}</p>
                            </div>
                            <div className="text-xs opacity-90">
                                <strong>Action Required:</strong><br />
                                1. Go to Firebase Console &gt; Firestore &gt; Rules.<br />
                                2. Ensure you are in project: <strong>{import.meta.env.VITE_FIREBASE_PROJECT_ID}</strong>.<br />
                                3. Publish the "Allow All" rules provided in the walkthrough.
                            </div>
                        </div>
                    )}
                </div>

                <Card className="glass-card border-none shadow-xl overflow-hidden">
                    <CardContent className="p-8 space-y-6">
                        {/* Prompt Section */}
                        <div className="bg-white/50 dark:bg-black/20 p-6 rounded-2xl border border-white/20 min-h-[120px] flex flex-col items-center justify-center text-center transition-all">
                            {prompt ? (
                                <p className="text-xl font-medium text-gray-800 dark:text-gray-100 italic">
                                    "{prompt}"
                                </p>
                            ) : (
                                <div className="text-muted-foreground flex flex-col items-center gap-2">
                                    <BookOpen className="h-8 w-8 opacity-50" />
                                    <p>Click generate to get started...</p>
                                </div>
                            )}
                        </div>

                        <div className="flex justify-center">
                            <Button
                                onClick={handleGenerate}
                                disabled={isLoading}
                                size="lg"
                                className="bg-gradient-to-r from-purple-500 to-pink-500 hover:opacity-90 transition-all shadow-md"
                            >
                                {isLoading ? (
                                    <RefreshCw className="h-5 w-5 mr-2 animate-spin" />
                                ) : (
                                    <Sparkles className="h-5 w-5 mr-2" />
                                )}
                                {prompt ? "New Prompt" : "Generate Prompt"}
                            </Button>
                        </div>

                        {/* Writing Area */}
                        {prompt && (
                            <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
                                <textarea
                                    className="w-full min-h-[300px] p-6 rounded-xl bg-white/40 dark:bg-black/20 border border-white/20 focus:ring-2 focus:ring-purple-500/50 outline-none resize-none text-lg leading-relaxed transition-all placeholder:text-muted-foreground/50"
                                    placeholder="Start writing here..."
                                    value={response}
                                    onChange={(e) => setResponse(e.target.value)}
                                />

                                <div className="flex justify-end">
                                    <Button
                                        onClick={handleSave}
                                        disabled={isSaving || !response.trim()}
                                        className="bg-primary text-white hover:bg-primary/90"
                                    >
                                        {isSaving ? (
                                            <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                                        ) : (
                                            <Save className="h-4 w-4 mr-2" />
                                        )}
                                        Save to Journal
                                    </Button>
                                </div>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </Layout>
    );
}
