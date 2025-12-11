import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { db } from "@/firebase/config";
import { collection, addDoc, query, orderBy, onSnapshot, serverTimestamp, Timestamp, deleteDoc, doc, updateDoc } from "firebase/firestore";
import Layout from "@/components/shared/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { PenTool, Plus, Calendar, Book, Trash2, Pencil } from "lucide-react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";

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
    const [editingId, setEditingId] = useState<string | null>(null);
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

    const [deleteId, setDeleteId] = useState<string | null>(null);

    const handleSave = async () => {
        if (!user || !newTitle.trim() || !newContent.trim()) return;
        setError(null);

        try {
            if (editingId) {
                // Update existing entry
                const docRef = doc(db, "users", user.uid, "journal_entries", editingId);
                await updateDoc(docRef, {
                    title: newTitle,
                    content: newContent,
                    timestamp: serverTimestamp(), // Optional: Update timestamp on edit? Let's keep it for now to bump to top or add 'updatedAt'
                });
                setEditingId(null);
            } else {
                // Create new entry
                await addDoc(collection(db, "users", user.uid, "journal_entries"), {
                    title: newTitle,
                    content: newContent,
                    timestamp: serverTimestamp(),
                });
            }

            setIsCreating(false);
            setNewTitle("");
            setNewContent("");
        } catch (error: unknown) {
            console.error("Error saving journal entry:", error);
            const err = error as { message: string };
            setError("Failed to save: " + err.message);
        }
    };

    const handleEdit = (entry: JournalEntry) => {
        setNewTitle(entry.title);
        setNewContent(entry.content);
        setEditingId(entry.id);
        setIsCreating(true);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const cancelEdit = () => {
        setIsCreating(false);
        setEditingId(null);
        setNewTitle("");
        setNewContent("");
    };

    const confirmDelete = (id: string) => {
        setDeleteId(id);
    };

    const handleDelete = async () => {
        if (!user || !deleteId) return;
        try {
            await deleteDoc(doc(db, "users", user.uid, "journal_entries", deleteId));
            setDeleteId(null);
            if (editingId === deleteId) {
                cancelEdit();
            }
        } catch (error: unknown) {
            console.error("Error deleting entry:", error);
            alert("Failed to delete entry.");
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
                    {!isCreating && (
                        <Button onClick={() => setIsCreating(true)} className="gap-2">
                            <Plus className="h-4 w-4" />
                            New Entry
                        </Button>
                    )}
                </div>

                {isCreating && (
                    <Card className="glass-card border-none animate-in slide-in-from-top-4 duration-300">
                        <CardHeader>
                            <CardTitle>{editingId ? "Edit Entry" : "New Entry"}</CardTitle>
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
                                <Button variant="ghost" onClick={cancelEdit}>
                                    Cancel
                                </Button>
                                <Button onClick={handleSave} disabled={!newTitle || !newContent}>
                                    {editingId ? "Update Entry" : "Save Entry"}
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
                            <Card key={entry.id} className="glass-card border-none hover:shadow-md transition-all group relative">
                                <CardHeader>
                                    <div className="flex items-center justify-between">
                                        <CardTitle className="text-xl">{entry.title}</CardTitle>
                                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                            <Calendar className="h-4 w-4" />
                                            {entry.timestamp?.toDate().toLocaleDateString()}
                                            <div className="flex items-center gap-1 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="h-8 w-8 text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors"
                                                    onClick={() => handleEdit(entry)}
                                                    title="Edit entry"
                                                >
                                                    <Pencil className="h-4 w-4" />
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="h-8 w-8 text-muted-foreground hover:text-red-500 hover:bg-red-500/10 transition-colors"
                                                    onClick={() => confirmDelete(entry.id)}
                                                    title="Delete entry"
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </div>
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

            {/* Custom Delete Confirmation Dialog */}
            <Dialog open={!!deleteId} onOpenChange={(open) => !open && setDeleteId(null)}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Delete Journal Entry?</DialogTitle>
                        <DialogDescription>
                            This action cannot be undone. This will permanently delete your journal entry.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter className="gap-2 sm:gap-0">
                        <Button variant="ghost" onClick={() => setDeleteId(null)}>
                            Cancel
                        </Button>
                        <Button
                            variant="destructive"
                            onClick={handleDelete}
                            className="bg-red-500 hover:bg-red-600 text-white"
                        >
                            Delete
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </Layout>
    );
}
