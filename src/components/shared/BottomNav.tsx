import { Home, Music, Gamepad2, Users, LayoutDashboard } from "lucide-react";
import { useLocation, Link } from "react-router-dom";
import { cn } from "@/lib/utils";

const navItems = [
    { icon: Home, label: "Home", path: "/dashboard" },
    { icon: Music, label: "Sounds", path: "/music" },
    { icon: Gamepad2, label: "Games", path: "/games" },
    { icon: Users, label: "Community", path: "/community" },
    { icon: LayoutDashboard, label: "More", path: "/menu" }, // Placeholder for full menu
];

export default function BottomNav() {
    const location = useLocation();

    return (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 w-[90%] max-w-md z-50">
            <nav className="glass rounded-full px-6 py-3 flex items-center justify-between shadow-xl shadow-primary/10">
                {navItems.map((item) => {
                    const isActive = location.pathname === item.path;
                    return (
                        <Link key={item.path} to={item.path} className="relative group">
                            <div className={cn(
                                "p-2 rounded-full transition-all duration-300 flex flex-col items-center gap-1",
                                isActive ? "text-primary -translate-y-2" : "text-muted-foreground hover:text-foreground"
                            )}>
                                <div className={cn(
                                    "p-2 rounded-full transition-all",
                                    isActive ? "bg-primary/10 shadow-sm" : ""
                                )}>
                                    <item.icon className="h-5 w-5" />
                                </div>
                                <span className={cn(
                                    "text-[10px] font-medium transition-opacity absolute -bottom-4 w-max",
                                    isActive ? "opacity-100" : "opacity-0"
                                )}>
                                    {item.label}
                                </span>
                            </div>
                            {isActive && (
                                <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-1 h-1 bg-primary rounded-full" />
                            )}
                        </Link>
                    );
                })}
            </nav>
        </div>
    );
}
