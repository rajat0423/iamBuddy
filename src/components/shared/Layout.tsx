import { Link, useLocation } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import {
    LayoutDashboard,
    MessageSquare,
    Users,
    Gamepad2,
    PenTool,
    User,
    LogOut,
    Activity,
    Smile,
    Sparkles,
    Music,
    Video,
} from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
    { icon: LayoutDashboard, label: "Dashboard", path: "/dashboard" },
    { icon: Users, label: "Community", path: "/community" },
    { icon: Music, label: "Music Lounge", path: "/music" },
    { icon: Gamepad2, label: "Wellness Games", path: "/games" },
    { icon: Sparkles, label: "Creative Writing", path: "/prompts" },
    { icon: PenTool, label: "Journal", path: "/journal" },
    { icon: Video, label: "Live Therapy", path: "/therapy" },
    { icon: Activity, label: "Assessment", path: "/assessment" },
    { icon: Smile, label: "Mood Check-in", path: "/mood" },
    { icon: User, label: "Profile", path: "/profile" },
];

export default function Layout({ children }: { children: React.ReactNode }) {
    const { logout, user } = useAuth();
    const location = useLocation();

    return (
        <div className="flex h-screen bg-gray-50 dark:bg-slate-950 overflow-hidden">
            {/* Glass Sidebar */}
            <aside className="w-72 glass-sidebar hidden md:flex flex-col z-20">
                <div className="p-8">
                    <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center shadow-lg shadow-primary/20">
                            <span className="text-white font-bold text-xl">B</span>
                        </div>
                        <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                            IamBuddy
                        </h1>
                    </div>
                </div>

                <nav className="flex-1 px-6 space-y-2 py-4">
                    {navItems.map((item) => {
                        const isActive = location.pathname === item.path;
                        return (
                            <Link key={item.path} to={item.path}>
                                <Button
                                    variant="ghost"
                                    className={cn(
                                        "w-full justify-start gap-3 h-12 text-base font-medium transition-all duration-300",
                                        isActive
                                            ? "bg-primary/10 text-primary shadow-sm"
                                            : "text-gray-500 hover:text-gray-900 hover:bg-gray-100/50"
                                    )}
                                >
                                    <item.icon className={cn("h-5 w-5 transition-colors", isActive ? "text-primary" : "text-gray-400")} />
                                    {item.label}
                                </Button>
                            </Link>
                        );
                    })}
                </nav>

                <div className="p-6 border-t border-gray-100 dark:border-gray-800">
                    <div className="flex items-center gap-3 mb-6 px-2">
                        <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
                            {user?.photoURL ? (
                                <img src={user.photoURL} alt="User" className="h-full w-full object-cover" />
                            ) : (
                                <User className="h-5 w-5 text-gray-500" />
                            )}
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-900 truncate">
                                {user?.displayName || "Buddy User"}
                            </p>
                            <p className="text-xs text-gray-500 truncate">
                                {user?.email}
                            </p>
                        </div>
                    </div>
                    <Button
                        variant="ghost"
                        className="w-full justify-start gap-3 text-red-500 hover:text-red-600 hover:bg-red-50/50"
                        onClick={logout}
                    >
                        <LogOut className="h-5 w-5" />
                        Logout
                    </Button>
                </div>
            </aside>

            {/* Main Content Area */}
            <main className="flex-1 relative overflow-hidden flex flex-col">
                {/* Decorative Background Blobs */}
                <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
                    <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-primary/5 rounded-full blur-3xl" />
                    <div className="absolute bottom-[-10%] left-[-5%] w-[500px] h-[500px] bg-secondary/5 rounded-full blur-3xl" />
                </div>

                {/* Mobile Header */}
                <header className="md:hidden h-16 glass border-b flex items-center justify-between px-4 z-20">
                    <div className="flex items-center gap-2">
                        <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                            <span className="text-white font-bold">B</span>
                        </div>
                        <span className="font-bold text-lg">IamBuddy</span>
                    </div>
                    {/* TODO: Mobile Menu Trigger */}
                </header>

                {/* Scrollable Content */}
                <div className="flex-1 overflow-y-auto p-4 md:p-8 scroll-smooth">
                    <div className="max-w-5xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
                        {children}
                    </div>
                </div>
            </main>
        </div>
    );
}
