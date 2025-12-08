import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { db } from "@/firebase/config";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import Layout from "@/components/shared/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Frown, Meh, Smile, Loader2, Heart, CloudRain, Sun } from "lucide-react";

const moods = [
    { value: 1, label: "Very Bad", icon: CloudRain, color: "text-gray-500" },
    { value: 2, label: "Bad", icon: Frown, color: "text-blue-500" },
    { value: 3, label: "Neutral", icon: Meh, color: "text-yellow-500" },
    { value: 4, label: "Good", icon: Smile, color: "text-green-500" },
    { value: 5, label: "Very Good", icon: Sun, color: "text-orange-500" },
];

const activities = {
    1: "It's okay to not be okay. How about listening to some calming music?",
    2: "Tough day? Maybe try a short breathing exercise.",
    3: "Feeling balanced. A quick walk might be nice.",
    4: "Great! Use this energy to work on a creative project.",
    5: "Awesome! Share your positivity with a friend.",
};

export default function MoodCheckIn() {
    const { user } = useAuth();
    const [selectedMood, setSelectedMood] = useState<number | null>(null);
    const [note, setNote] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [suggestion, setSuggestion] = useState<string | null>(null);

    const handleSubmit = async () => {
        if (!user || !selectedMood) return;
        setIsSubmitting(true);

        try {
            const moodData = {
                userId: user.uid,
                mood: selectedMood,
                note,
                activity: activities[selectedMood as keyof typeof activities],
                timestamp: serverTimestamp(),
            };

            await addDoc(collection(db, "users", user.uid, "mood_logs"), moodData);
            setSuggestion(moodData.activity);
        } catch (error) {
            console.error("Error saving mood:", error);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Layout>
            <div className="max-w-2xl mx-auto space-y-8">
                <div className="text-center space-y-2">
                    <h1 className="text-3xl font-bold text-gray-900">Daily Mood Check-in</h1>
                    <p className="text-gray-500">
                        Track your emotional well-being and get personalized suggestions.
                    </p>
                </div>

                {!suggestion ? (
                    <Card>
                        <CardHeader>
                            <CardTitle>How are you feeling right now?</CardTitle>
                            <CardDescription>Select the icon that best represents your current mood.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="flex justify-between items-center px-4">
                                {moods.map((m) => (
                                    <button
                                        key={m.value}
                                        onClick={() => setSelectedMood(m.value)}
                                        className={`flex flex-col items-center gap-2 p-4 rounded-xl transition-all ${selectedMood === m.value
                                                ? "bg-primary/10 scale-110 ring-2 ring-primary"
                                                : "hover:bg-gray-100 hover:scale-105"
                                            }`}
                                    >
                                        <m.icon className={`h-10 w-10 ${m.color}`} />
                                        <span className="text-xs font-medium text-gray-600">{m.label}</span>
                                    </button>
                                ))}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="note">Add a note (optional)</Label>
                                <textarea
                                    id="note"
                                    className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                    placeholder="What's on your mind?"
                                    value={note}
                                    onChange={(e) => setNote(e.target.value)}
                                />
                            </div>
                        </CardContent>
                        <CardFooter>
                            <Button
                                className="w-full"
                                onClick={handleSubmit}
                                disabled={!selectedMood || isSubmitting}
                            >
                                {isSubmitting ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Saving...
                                    </>
                                ) : (
                                    "Log Mood"
                                )}
                            </Button>
                        </CardFooter>
                    </Card>
                ) : (
                    <Card className="bg-green-50 border-green-200">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-green-800">
                                <Heart className="h-6 w-6 fill-green-600 text-green-600" />
                                Mood Logged!
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-lg text-green-900 font-medium">
                                "{suggestion}"
                            </p>
                            <p className="mt-4 text-green-700">
                                Thanks for checking in. Your mood has been recorded.
                            </p>
                        </CardContent>
                        <CardFooter>
                            <Button
                                variant="outline"
                                className="w-full bg-white hover:bg-green-100 text-green-700 border-green-300"
                                onClick={() => {
                                    setSuggestion(null);
                                    setSelectedMood(null);
                                    setNote("");
                                }}
                            >
                                Check in again
                            </Button>
                        </CardFooter>
                    </Card>
                )}
            </div>
        </Layout>
    );
}
