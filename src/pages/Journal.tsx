import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { db } from "@/firebase/config";
import { collection, addDoc, query, orderBy, onSnapshot, serverTimestamp, Timestamp } from "firebase/firestore";
import Layout from "@/components/shared/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { PenTool, Plus, Calendar, Book } from "lucide-react";

interface JournalEntry {
    id: string;
    title: string;
    content: string;
    timestamp: Timestamp;
}

export default function Journal() {
    const { user } = useAuth();
    const [entries, setEntries] = useState<JournalEntry[]>([]);
    const [isCreating, setIsCreating] = useState(false);
    const [newTitle, setNewTitle] = useState("");
    const [newContent, setNewContent] = useState("");

    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!user) return;

        const q = query(
            collection(db, "users", user.uid, "journal_entries"),
            orderBy("timestamp", "desc")
        );

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const data = snapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            })) as JournalEntry[];
            setEntries(data);
        }, (err) => {
            console.error("Journal Fetch Error:", err);
            setError("Failed to load entries: " + err.message);
        });

        return () => unsubscribe();
    }, [user]);

    const handleSave = async () => {
        if (!user || !newTitle.trim() || !newContent.trim()) return;
        setError(null);

        try {
            await addDoc(collection(db, "users", user.uid, "journal_entries"), {
                title: newTitle,
                content: newContent,
                timestamp: serverTimestamp(),
            });
            setIsCreating(false);
            setNewTitle("");
            setNewContent("");
        } catch (error: any) {
            console.error("Error saving journal entry:", error);
            setError("Failed to save: " + error.message);
        }
    };

    return (
        <Layout>
            <div className="max-w-4xl mx-auto space-y-8">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent inline-flex items-center gap-2">
                            <Book className="h-8 w-8 text-primary" />
                            Personal Journal
                        </h1>
                        <p className="text-muted-foreground mt-2">
                            A private space for your thoughts and reflections.
                        </p>
                        {error && (
                            <div className="mt-2 p-2 bg-red-500/10 border border-red-500/20 rounded text-red-500 text-xs">
                                Error: {error}
                            </div>
                        )}
                    </div>
                    <Button onClick={() => setIsCreating(!isCreating)} className="gap-2">
                        <Plus className="h-4 w-4" />
                        New Entry
                    </Button>
                </div>

                {isCreating && (
                    <Card className="glass-card border-none animate-in slide-in-from-top-4 duration-300">
                        <CardHeader>
                            <CardTitle>New Entry</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <Input
                                placeholder="Title (e.g., Today's Wins)"
                                value={newTitle}
                                onChange={(e) => setNewTitle(e.target.value)}
                                className="bg-white/50 dark:bg-slate-900/50"
                            />
                            <textarea
                                className="w-full min-h-[200px] p-4 rounded-xl border border-input bg-white/50 dark:bg-slate-900/50 focus:outline-none focus:ring-2 focus:ring-ring resize-none"
                                placeholder="Write your thoughts here..."
                                value={newContent}
                                onChange={(e) => setNewContent(e.target.value)}
                            />
                            <div className="flex justify-end gap-2">
                                <Button variant="ghost" onClick={() => setIsCreating(false)}>
                                    Cancel
                                </Button>
                                <Button onClick={handleSave} disabled={!newTitle || !newContent}>
                                    Save Entry
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                )}

                <div className="grid gap-6">
                    {entries.length === 0 && !isCreating ? (
                        <div className="text-center py-12 text-muted-foreground">
                            <PenTool className="h-12 w-12 mx-auto mb-4 opacity-50" />
                            <p>No entries yet. Start writing today!</p>
                        </div>
                    ) : (
                        entries.map((entry) => (
                            <Card key={entry.id} className="glass-card border-none hover:shadow-md transition-all">
                                <CardHeader>
                                    <div className="flex items-center justify-between">
                                        <CardTitle className="text-xl">{entry.title}</CardTitle>
                                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                            <Calendar className="h-4 w-4" />
                                            {entry.timestamp?.toDate().toLocaleDateString()}
                                        </div>
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <p className="whitespace-pre-wrap text-muted-foreground leading-relaxed">
                                        {entry.content}
                                    </p>
                                </CardContent>
                            </Card>
                        ))
                    )}
                </div>
            </div>
        </Layout>
    );
}
