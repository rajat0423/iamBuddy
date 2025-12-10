import {
    Area,
    AreaChart,
    CartesianGrid,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from "recharts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const data = [
    { day: "Mon", score: 65, mood: "Okay" },
    { day: "Tue", score: 50, mood: "Low" },
    { day: "Wed", score: 75, mood: "Good" },
    { day: "Thu", score: 85, mood: "Great" },
    { day: "Fri", score: 70, mood: "Good" },
    { day: "Sat", score: 90, mood: "Excellent" },
    { day: "Sun", score: 80, mood: "Great" },
];

export default function MoodChart() {
    return (
        <Card className="glass-card border-none text-white">
            <CardHeader>
                <CardTitle>Assessment History</CardTitle>
                <CardDescription className="text-white/60">Your mood journey over the last 7 days</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="h-[200px] w-full mt-4">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={data}>
                            <defs>
                                <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.8} />
                                    <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.1)" />
                            <XAxis
                                dataKey="day"
                                tickLine={false}
                                axisLine={false}
                                tick={{ fill: 'rgba(255,255,255,0.5)', fontSize: 12 }}
                            />
                            <YAxis
                                hide
                                domain={[0, 100]}
                            />
                            <Tooltip
                                contentStyle={{ backgroundColor: 'rgba(0,0,0,0.8)', border: 'none', borderRadius: '8px', color: '#fff' }}
                                itemStyle={{ color: '#fff' }}
                                cursor={{ stroke: 'rgba(255,255,255,0.2)' }}
                            />
                            <Area
                                type="monotone"
                                dataKey="score"
                                stroke="#8b5cf6"
                                strokeWidth={3}
                                fillOpacity={1}
                                fill="url(#colorScore)"
                            />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </CardContent>
        </Card>
    );
}
