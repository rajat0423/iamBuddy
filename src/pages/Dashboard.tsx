import { useAuth } from "@/hooks/useAuth";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Play, BookOpen, Gamepad2 } from "lucide-react";
import BuddyMascot from "@/components/home/BuddyMascot";
import WellnessWidget from "@/components/home/WellnessWidget";
import QuickActions from "@/components/home/QuickActions";
import Layout from "@/components/shared/Layout";

export default function Dashboard() {
    const { user } = useAuth();
    const firstName = user?.displayName?.split(" ")[0] || "Buddy";

    return (
        <Layout>
            <div className="space-y-8 pb-24">
                {/* 1. Top App Bar (Mobile only, desktop has sidebar) */}
                <div className="flex items-center justify-between md:hidden">
                    <h1 className="text-xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                        IamBuddy
                    </h1>
                    <Link to="/profile">
                        <div className="h-10 w-10 rounded-full bg-gradient-to-br from-primary to-secondary p-[2px] cursor-pointer hover:scale-105 transition-transform">
                            <img
                                src={user?.photoURL || "https://api.dicebear.com/7.x/avataaars/svg?seed=Buddy"}
                                alt="Profile"
                                className="h-full w-full rounded-full bg-white object-cover"
                            />
                        </div>
                    </Link>
                </div>

                {/* 2. Hero Greeting Section */}
                <section className="relative flex flex-col items-center text-center space-y-4 py-6">
                    <div className="space-y-2 z-10">
                        <h1 className="text-4xl font-bold text-foreground animate-in fade-in slide-in-from-bottom-4 duration-700">
                            Hello, {firstName} <span className="inline-block animate-wave">👋</span>
                        </h1>
                        <p className="text-lg text-muted-foreground animate-in fade-in slide-in-from-bottom-5 duration-1000 delay-100">
                            How are you feeling today?
                        </p>
                    </div>

                    <BuddyMascot className="my-4" />

                    {/* 3. Primary Wellness CTA */}
                    <Link to="/assessment">
                        <Button
                            size="lg"
                            className="rounded-full px-8 py-6 text-lg shadow-lg shadow-primary/20 hover:scale-105 transition-transform duration-300 animate-in fade-in zoom-in duration-500 delay-300"
                        >
                            Start Today's Check-In
                            <span className="ml-2 text-xs opacity-80 font-normal block sm:inline sm:ml-4">
                                (Takes 60s)
                            </span>
                        </Button>
                    </Link>
                </section>

                {/* 4. Quick-Action Carousel */}
                <section className="space-y-4 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-200">
                    <div className="flex items-center justify-between px-1">
                        <h2 className="text-xl font-semibold text-foreground">Quick Actions</h2>
                    </div>
                    <QuickActions />
                </section>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-300">
                    {/* 5. Recent Activity Block */}
                    <section className="space-y-4">
                        <h2 className="text-xl font-semibold text-foreground">Recent Activity</h2>
                        <Card className="glass-card border-none overflow-hidden">
                            <CardContent className="p-0">
                                <div className="p-4 border-b border-gray-100 dark:border-gray-800 flex items-center gap-4 hover:bg-black/5 transition-colors cursor-pointer">
                                    <div className="h-10 w-10 rounded-full bg-purple-100 flex items-center justify-center text-purple-600">
                                        <BookOpen className="h-5 w-5" />
                                    </div>
                                    <div>
                                        <p className="font-medium">Morning Journal</p>
                                        <p className="text-xs text-muted-foreground">Written yesterday</p>
                                    </div>
                                </div>
                                <div className="p-4 border-b border-gray-100 dark:border-gray-800 flex items-center gap-4 hover:bg-black/5 transition-colors cursor-pointer">
                                    <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                                        <Play className="h-5 w-5" />
                                    </div>
                                    <div>
                                        <p className="font-medium">Rain Sounds</p>
                                        <p className="text-xs text-muted-foreground">Played 2 hours ago</p>
                                    </div>
                                </div>
                                <div className="p-4 flex items-center gap-4 hover:bg-black/5 transition-colors cursor-pointer">
                                    <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center text-green-600">
                                        <Gamepad2 className="h-5 w-5" />
                                    </div>
                                    <div>
                                        <p className="font-medium">Bubble Pop</p>
                                        <p className="text-xs text-muted-foreground">High score: 1250</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </section>

                    {/* 6. Wellness Score Widget */}
                    <section className="space-y-4">
                        <h2 className="text-xl font-semibold text-foreground">Wellness Score</h2>
                        <WellnessWidget score={82} trend="up" />

                        {/* Mini Tip Card */}
                        <div className="glass-card p-4 rounded-2xl flex items-start gap-3 mt-4 bg-gradient-to-br from-orange-50 to-pink-50 dark:from-orange-950/30 dark:to-pink-950/30 border-none">
                            <span className="text-2xl">💡</span>
                            <div>
                                <h4 className="font-semibold text-sm">Daily Tip</h4>
                                <p className="text-xs text-muted-foreground mt-1">
                                    Taking a 5-minute walk can boost your mood by 15%. Try it now!
                                </p>
                            </div>
                        </div>
                    </section>
                </div>
            </div>
        </Layout>
    );
}
