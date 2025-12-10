import { Music, PenTool, Smile, Gamepad2, Users } from "lucide-react";
import { cn } from "@/lib/utils";
import { useNavigate } from "react-router-dom";

const actions = [
    {
        icon: Music,
        title: "Soundscapes",
        desc: "Play calming sounds",
        color: "bg-blue-100 text-blue-600",
        path: "/music"
    },
    {
        icon: PenTool,
        title: "Journal",
        desc: "Write a quick entry",
        color: "bg-purple-100 text-purple-600",
        path: "/journal"
    },
    {
        icon: Smile,
        title: "Mood Check",
        desc: "Log how you feel",
        color: "bg-yellow-100 text-yellow-600",
        path: "/mood"
    },
    {
        icon: Gamepad2,
        title: "Games",
        desc: "Relax with games",
        color: "bg-green-100 text-green-600",
        path: "/games"
    },
    {
        icon: Users,
        title: "Community",
        desc: "Connect with others",
        color: "bg-pink-100 text-pink-600",
        path: "/community"
    }
];

export default function QuickActions() {
    const navigate = useNavigate();

    return (
        <div className="w-full overflow-x-auto pb-4 pt-2 scrollbar-hide">
            <div className="flex gap-4 px-1 min-w-max">
                {actions.map((action, index) => (
                    <div
                        key={index}
                        onClick={() => navigate(action.path)}
                        className="glass-card w-64 p-4 rounded-2xl flex items-center gap-4 cursor-pointer group hover:-translate-y-1 transition-transform"
                    >
                        <div className={cn("h-12 w-12 rounded-full flex items-center justify-center shadow-sm transition-transform group-hover:scale-110", action.color)}>
                            <action.icon className="h-6 w-6" />
                        </div>
                        <div>
                            <h4 className="font-semibold text-foreground">{action.title}</h4>
                            <p className="text-xs text-muted-foreground">{action.desc}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
