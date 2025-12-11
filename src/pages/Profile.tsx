import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { db, auth } from "@/firebase/config";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { updateProfile } from "firebase/auth";
import { Button } from "@/components/ui/button";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { avatars } from "@/lib/avatars";
import { cn } from "@/lib/utils";
import Layout from "@/components/shared/Layout";
import MoodChart from "@/components/profile/MoodChart";
import StreakTree from "@/components/profile/StreakTree";
import { Badge } from "@/components/ui/badge";
import { Edit2, Save, Sparkles } from "lucide-react"; // Icons

export default function Profile() {
    const { user } = useAuth();
    const [displayName, setDisplayName] = useState("");
    const [selectedAvatar, setSelectedAvatar] = useState("");
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        const fetchProfile = async () => {
            if (user) {
                const docRef = doc(db, "users", user.uid);
                const docSnap = await getDoc(docRef);
                if (docSnap.exists()) {
                    const data = docSnap.data();
                    setDisplayName(data.displayName || "");
                    setSelectedAvatar(data.photoURL || avatars[0]);
                }
                setLoading(false);
            }
        };
        fetchProfile();
    }, [user]);

    const handleSave = async () => {
        if (!user) return;
        setSaving(true);
        try {
            const docRef = doc(db, "users", user.uid);
            await updateDoc(docRef, {
                photoURL: selectedAvatar,
            });

            // Also update the Auth profile so it reflects immediately in the UI (sidebar etc)
            if (auth.currentUser) {
                await updateProfile(auth.currentUser, {
                    photoURL: selectedAvatar
                });
            }

            alert("Profile updated successfully!");
        } catch (error: unknown) {
            console.error("Error updating profile:", error);
            alert("Failed to update profile.");
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <div>Loading profile...</div>;

    return (
        <Layout>
            <div className="container mx-auto p-4 sm:p-6 space-y-8">
                {/* Header Section */}
                <div className="flex flex-col md:flex-row items-start justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-purple-400 bg-clip-text text-transparent inline-flex items-center gap-2">
                            <Sparkles className="h-6 w-6 text-yellow-400" />
                            Your Profile
                        </h1>
                        <p className="text-muted-foreground mt-2">Manage your identity and track your wellness journey.</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Left Column: Stats & Streaks */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Daily Assessment Graph */}
                        <MoodChart />

                        {/* Streak Tree */}
                        <StreakTree />
                    </div>

                    {/* Right Column: Identity Management */}
                    <div className="space-y-6">
                        <Card className="glass-card border-none">
                            <CardHeader>
                                <CardTitle className="flex items-center justify-between">
                                    <span>Identity</span>
                                    <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">Anonymous</Badge>
                                </CardTitle>
                                <CardDescription>Your safe space identity</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                {/* Current Avatar Preview */}
                                <div className="flex justify-center">
                                    <div className="relative group">
                                        <div className="absolute inset-0 bg-primary/20 rounded-full blur-xl group-hover:blur-2xl transition-all" />
                                        <img
                                            src={selectedAvatar}
                                            alt="Current Avatar"
                                            className="w-32 h-32 rounded-full border-4 border-white/10 shadow-xl relative z-10"
                                        />
                                        <div className="absolute bottom-0 right-0 z-20 bg-primary text-white p-2 rounded-full shadow-lg">
                                            <Edit2 className="h-4 w-4" />
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-2 text-center">
                                    <Label>Assigned Name</Label>
                                    <div className="p-3 bg-white/5 border border-white/10 rounded-xl text-foreground font-medium text-lg">
                                        {displayName || "Anonymous Buddy"}
                                    </div>
                                    <p className="text-xs text-muted-foreground">
                                        Randomized to protect your privacy.
                                    </p>
                                </div>

                                <div className="space-y-4">
                                    <Label>Choose Avatar</Label>
                                    <div className="grid grid-cols-4 gap-3">
                                        {avatars.map((avatar) => (
                                            <div
                                                key={avatar}
                                                className={cn(
                                                    "cursor-pointer rounded-full p-0.5 transition-all relative overflow-hidden aspect-square",
                                                    selectedAvatar === avatar
                                                        ? "ring-2 ring-primary ring-offset-2 ring-offset-black"
                                                        : "opacity-70 hover:opacity-100 hover:scale-105"
                                                )}
                                                onClick={() => setSelectedAvatar(avatar)}
                                            >
                                                <img
                                                    src={avatar}
                                                    alt="Avatar Option"
                                                    className="h-full w-full rounded-full object-cover"
                                                />
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <Button
                                    onClick={handleSave}
                                    disabled={saving}
                                    className="w-full bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-white font-semibold shadow-lg shadow-indigo-500/25 transition-all hover:scale-[1.02] active:scale-[0.98] border border-indigo-500/20"
                                    size="lg"
                                >
                                    {saving ? (
                                        "Saving..."
                                    ) : (
                                        <>
                                            <Save className="mr-2 h-4 w-4" /> Save Changes
                                        </>
                                    )}
                                </Button>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </Layout>
    );
}
