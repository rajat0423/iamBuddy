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
            <div className="container mx-auto p-6">
                <Card className="max-w-2xl mx-auto">
                    <CardHeader>
                        <CardTitle>Your Profile</CardTitle>
                        <CardDescription>Manage your anonymous identity</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="space-y-2">
                            <Label>Choose an Avatar</Label>
                            <div className="grid grid-cols-4 gap-4 sm:grid-cols-6">
                                {avatars.map((avatar) => (
                                    <div
                                        key={avatar}
                                        className={cn(
                                            "cursor-pointer rounded-full border-2 p-1 transition-all",
                                            selectedAvatar === avatar
                                                ? "border-primary scale-110"
                                                : "border-transparent hover:border-gray-200"
                                        )}
                                        onClick={() => setSelectedAvatar(avatar)}
                                    >
                                        <img
                                            src={avatar}
                                            alt="Avatar"
                                            className="h-full w-full rounded-full"
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label>Assigned Identity</Label>
                            <div className="p-3 bg-muted rounded-md text-foreground font-medium">
                                {displayName || "Anonymous Buddy"}
                            </div>
                            <p className="text-xs text-muted-foreground">
                                Your identity is randomized to keep the community safe and anonymous.
                            </p>
                        </div>

                        <Button onClick={handleSave} disabled={saving}>
                            {saving ? "Saving..." : "Save Changes"}
                        </Button>
                    </CardContent>
                </Card>
            </div>
        </Layout>
    );
}
