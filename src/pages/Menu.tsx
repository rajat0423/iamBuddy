import { Link } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import Layout from "@/components/shared/Layout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
    PenTool,
    User,
    LogOut,
    Smile,
    Sparkles,
    Video,
    ChevronRight
} from "lucide-react";

export default function Menu() {
    const { user, logout } = useAuth();

    const menuItems = [
        { icon: User, label: "My Profile", path: "/profile", color: "text-blue-500", bg: "bg-blue-500/10" },
        { icon: Smile, label: "Mood Check-In", path: "/mood", color: "text-orange-500", bg: "bg-orange-500/10" },
        { icon: PenTool, label: "Journal", path: "/journal", color: "text-purple-500", bg: "bg-purple-500/10" },
        { icon: Sparkles, label: "Soul Scripts", path: "/stories", color: "text-pink-500", bg: "bg-pink-500/10" },
        { icon: Video, label: "Live Therapy", path: "/therapy", color: "text-green-500", bg: "bg-green-500/10" },
    ];

    return (
        <Layout>
            <div className="max-w-md mx-auto space-y-6 pb-20">
                {/* Header Profile */}
                <div className="flex items-center gap-4 p-4 glass-card rounded-2xl border-none">
                    <div className="h-16 w-16 rounded-full bg-gradient-to-br from-primary to-secondary p-[2px]">
                        <img
                            src={user?.photoURL || "https://api.dicebear.com/7.x/avataaars/svg?seed=Buddy"}
                            alt="Profile"
                            className="h-full w-full rounded-full bg-white object-cover"
                        />
                    </div>
                    <div className="flex-1 min-w-0">
                        <h2 className="text-lg font-bold truncate">{user?.displayName || "Buddy User"}</h2>
                        <p className="text-sm text-muted-foreground truncate">{user?.email}</p>
                    </div>
                    <Link to="/profile">
                        <Button variant="ghost" size="icon" className="rounded-full">
                            <ChevronRight className="h-5 w-5 text-muted-foreground" />
                        </Button>
                    </Link>
                </div>

                {/* Menu Grid */}
                <div className="grid gap-3">
                    <h3 className="text-sm font-medium text-muted-foreground px-1">Features</h3>
                    {menuItems.map((item) => (
                        <Link key={item.path} to={item.path}>
                            <Card className="border-none shadow-sm hover:shadow-md transition-all active:scale-[0.98]">
                                <CardContent className="p-4 flex items-center gap-4">
                                    <div className={`h-10 w-10 rounded-xl ${item.bg} flex items-center justify-center ${item.color}`}>
                                        <item.icon className="h-5 w-5" />
                                    </div>
                                    <span className="flex-1 font-medium">{item.label}</span>
                                    <ChevronRight className="h-4 w-4 text-muted-foreground/50" />
                                </CardContent>
                            </Card>
                        </Link>
                    ))}
                </div>

                {/* Logout */}
                <div className="pt-4">
                    <Button
                        variant="destructive"
                        className="w-full h-12 rounded-xl shadow-lg shadow-red-500/20"
                        onClick={logout}
                    >
                        <LogOut className="mr-2 h-5 w-5" />
                        Sign Out
                    </Button>
                    <p className="text-center text-xs text-muted-foreground mt-6">
                        IamBuddy v2.0 &bull; Made with 💜
                    </p>
                </div>
            </div>
        </Layout>
    );
}
