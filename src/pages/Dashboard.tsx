import React from "react";
import Layout from "@/components/shared/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/hooks/useAuth";
import { Activity, Heart, MessageCircle, Sparkles } from "lucide-react";

export default function Dashboard() {
    const { user } = useAuth();

    return (
        <Layout>
            <div className="space-y-8">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                            Welcome back, {user?.displayName || "Friend"}!
                        </h1>
                        <p className="text-muted-foreground mt-2 text-lg">
                            Here's your daily wellness overview.
                        </p>
                    </div>
                    <div className="bg-primary/10 p-4 rounded-2xl shadow-sm border border-primary/10">
                        <Sparkles className="h-6 w-6 text-primary animate-pulse" />
                    </div>
                </div>

                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                    <DashboardCard
                        title="Mood Check-in"
                        icon={Heart}
                        value="Great"
                        description="Last checked 2 hours ago"
                        color="text-rose-500"
                        bg="bg-rose-50 dark:bg-rose-900/20"
                    />
                    <DashboardCard
                        title="Daily Goals"
                        icon={Activity}
                        value="2/3"
                        description="Completed today"
                        color="text-emerald-500"
                        bg="bg-emerald-50 dark:bg-emerald-900/20"
                    />
                    <DashboardCard
                        title="Community"
                        icon={MessageCircle}
                        value="5"
                        description="New messages"
                        color="text-blue-500"
                        bg="bg-blue-50 dark:bg-blue-900/20"
                    />
                    <DashboardCard
                        title="Streak"
                        icon={Sparkles}
                        value="7 Days"
                        description="Keep it up!"
                        color="text-amber-500"
                        bg="bg-amber-50 dark:bg-amber-900/20"
                    />
                </div>

                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
                    <Card className="col-span-4 glass-card border-none">
                        <CardHeader>
                            <CardTitle>Recent Activity</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="flex flex-col items-center justify-center h-40 text-center space-y-3">
                                <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center">
                                    <Activity className="h-6 w-6 text-muted-foreground" />
                                </div>
                                <p className="text-muted-foreground">
                                    No recent activity to show. Start by checking in!
                                </p>
                            </div>
                        </CardContent>
                    </Card>
                    <Card className="col-span-3 glass-card border-none">
                        <CardHeader>
                            <CardTitle>Recommended for You</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                <div className="flex items-center gap-4 p-4 bg-white/50 dark:bg-white/5 rounded-2xl border border-white/20 hover:bg-white/80 transition-colors cursor-pointer">
                                    <div className="bg-blue-100 dark:bg-blue-900/30 p-3 rounded-xl">
                                        <Activity className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-semibold">5-Minute Meditation</p>
                                        <p className="text-xs text-muted-foreground">Relaxation</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4 p-4 bg-white/50 dark:bg-white/5 rounded-2xl border border-white/20 hover:bg-white/80 transition-colors cursor-pointer">
                                    <div className="bg-emerald-100 dark:bg-emerald-900/30 p-3 rounded-xl">
                                        <Heart className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-semibold">Gratitude Journal</p>
                                        <p className="text-xs text-muted-foreground">Reflection</p>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </Layout>
    );
}

function DashboardCard({
    title,
    icon: Icon,
    value,
    description,
    color,
    bg,
}: {
    title: string;
    icon: any;
    value: string;
    description: string;
    color: string;
    bg: string;
}) {
    return (
        <Card className="glass-card border-none overflow-hidden relative group">
            <div className={`absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity ${color}`}>
                <Icon className="h-24 w-24 -mr-8 -mt-8 transform rotate-12" />
            </div>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
                <div className={`p-2 rounded-lg ${bg}`}>
                    <Icon className={`h-4 w-4 ${color}`} />
                </div>
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">{value}</div>
                <p className="text-xs text-muted-foreground mt-1">{description}</p>
            </CardContent>
        </Card>
    );
}
