import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import Layout from "@/components/shared/Layout";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
    Radar,
    RadarChart,
    PolarGrid,
    PolarAngleAxis,
    ResponsiveContainer
} from "recharts";
import {
    QUESTIONS,
    FLOW_ORDER,
    type Question,
    type Option,
    type EmotionalIndices,
    INITIAL_INDICES,
    calculateNewIndices,
    determineBranch,
    getMoodProfileLabel,
    getRecommendations,
    type Recommendation
} from "@/data/mood-engine";

type AssessmentState = 'START' | 'BASE' | 'DEEP_DIVE' | 'RESULT';

export default function MoodAssessment() {
    const navigate = useNavigate();

    // State Machine
    const [status, setStatus] = useState<AssessmentState>('START');
    const [indices, setIndices] = useState<EmotionalIndices>(INITIAL_INDICES);

    // Navigation & Data
    const [questionQueue, setQuestionQueue] = useState<string[]>([]);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [answers, setAnswers] = useState<Record<string, string>>({});

    // Result
    const [finalRecs, setFinalRecs] = useState<Recommendation[]>([]);

    // --- Actions ---

    const startAssessment = () => {
        setIndices(INITIAL_INDICES);
        setAnswers({});
        setQuestionQueue(FLOW_ORDER.BASE);
        setCurrentQuestionIndex(0);
        setStatus('BASE');
    };

    const handleAnswer = (option: Option) => {
        // 1. Update Indices
        const newIndices = calculateNewIndices(indices, option);
        setIndices(newIndices);

        // 2. Save Answer
        const currentQId = questionQueue[currentQuestionIndex];
        setAnswers(prev => ({ ...prev, [currentQId]: option.id }));

        // 3. Navigate
        if (currentQuestionIndex < questionQueue.length - 1) {
            // Next question in current queue
            setCurrentQuestionIndex(prev => prev + 1);
        } else {
            // Queue finished. Determine transition.
            handlePhaseTransition(newIndices);
        }
    };

    const handlePhaseTransition = (currentIndices: EmotionalIndices) => {
        if (status === 'BASE') {
            // Determine Branch
            const branch = determineBranch(currentIndices);

            // Load Branch Questions
            const nextQueue = FLOW_ORDER[branch as keyof typeof FLOW_ORDER];

            if (nextQueue && nextQueue.length > 0) {
                setQuestionQueue(nextQueue);
                setCurrentQuestionIndex(0);
                setStatus('DEEP_DIVE');
            } else {
                // No deep dive needed? Go to result.
                finishAssessment(currentIndices);
            }
        } else if (status === 'DEEP_DIVE') {
            // Finished Deep Dive -> Result
            finishAssessment(currentIndices);
        }
    };

    const finishAssessment = (finalIndices: EmotionalIndices) => {
        const recs = getRecommendations(finalIndices, answers);
        setFinalRecs(recs);
        setStatus('RESULT');
    };

    // --- UI Renderers ---

    const currentQuestionId = questionQueue[currentQuestionIndex];
    const question = QUESTIONS[currentQuestionId as keyof typeof QUESTIONS] as Question; // Safe cast as queue is built from keys

    const progress = status === 'BASE'
        ? ((currentQuestionIndex) / 5) * 50
        : 50 + ((currentQuestionIndex / (questionQueue.length || 1)) * 50);

    // Crisis Overlay
    const isCrisis = finalRecs.some(r => r.type === 'CRISIS');

    if (status === 'RESULT') {
        const moodLabel = getMoodProfileLabel(indices);

        // Prepare Data for Radar Chart
        const chartData = [
            { subject: 'Mood', A: Math.round(indices.Mood), fullMark: 100 },
            { subject: 'Energy', A: Math.round(indices.Energy), fullMark: 100 },
            { subject: 'Calmness', A: Math.round(100 - indices.Stress), fullMark: 100 }, // Invert Stress for chart so "Big" is Good
            { subject: 'Clarity', A: Math.round(100 - indices.CognitiveLoad), fullMark: 100 }, // Invert Load
        ];

        return (
            <Layout>
                <div className="min-h-[80vh] py-8 px-4 flex justify-center">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="w-full max-w-5xl space-y-8"
                    >
                        {isCrisis ? (
                            <Card className="p-8 border-red-500 bg-red-50 dark:bg-red-900/20 text-center space-y-4 shadow-xl">
                                <h1 className="text-3xl font-bold text-red-600">Please Stay Safe</h1>
                                <p className="text-xl">Your safety is the most important thing right now.</p>
                                <div className="flex justify-center gap-4 pt-4">
                                    <Button size="lg" className="bg-red-600 hover:bg-red-700 text-white w-full max-w-xs shadow-lg">
                                        Call Helpline (988)
                                    </Button>
                                </div>
                            </Card>
                        ) : (
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
                                {/* Left Column: Chart & Summary */}
                                <div className="space-y-6">
                                    <div className="text-center md:text-left space-y-2">
                                        <h1 className="text-4xl font-bold text-slate-800 dark:text-white">Wellness Snapshot</h1>
                                        <p className="text-xl font-medium text-primary">Status: {moodLabel}</p>
                                    </div>

                                    <Card className="p-6 bg-white dark:bg-slate-900/50 backdrop-blur-sm border-slate-200 dark:border-slate-800 shadow-xl rounded-3xl">
                                        <div className="h-[300px] w-full">
                                            <ResponsiveContainer width="100%" height="100%">
                                                <RadarChart cx="50%" cy="50%" outerRadius="80%" data={chartData}>
                                                    <PolarGrid stroke="#e2e8f0" />
                                                    <PolarAngleAxis dataKey="subject" tick={{ fill: '#64748b', fontSize: 12 }} />
                                                    <Radar
                                                        name="Wellness"
                                                        dataKey="A"
                                                        stroke="#8b5cf6"
                                                        strokeWidth={3}
                                                        fill="#8b5cf6"
                                                        fillOpacity={0.3}
                                                    />
                                                </RadarChart>
                                            </ResponsiveContainer>
                                        </div>
                                        <div className="grid grid-cols-2 gap-4 mt-6">
                                            {Object.entries(indices).map(([key, val]) => (
                                                <div key={key} className="text-center p-3 rounded-2xl bg-slate-50 dark:bg-slate-800">
                                                    <div className="text-xs uppercase tracking-wider text-slate-500 mb-1">{key}</div>
                                                    <div className="text-xl font-bold text-slate-800 dark:text-slate-200">{Math.round(val)}</div>
                                                </div>
                                            ))}
                                        </div>
                                    </Card>
                                </div>

                                {/* Right Column: Recommendations */}
                                <div className="space-y-6">
                                    <h2 className="text-2xl font-semibold flex items-center gap-2">
                                        <span>Recommended for You</span>
                                        <span className="text-sm font-normal text-muted-foreground bg-slate-100 dark:bg-slate-800 px-3 py-1 rounded-full">
                                            {finalRecs.length} Actions
                                        </span>
                                    </h2>

                                    <div className="space-y-4">
                                        {finalRecs.map((rec, idx) => (
                                            <motion.div
                                                key={rec.id}
                                                initial={{ opacity: 0, x: 20 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                transition={{ delay: idx * 0.1 }}
                                            >
                                                <Card
                                                    className="p-4 flex items-center gap-4 hover:shadow-lg transition-all cursor-pointer group border-l-4 overflow-hidden relative"
                                                    style={{ borderLeftColor: rec.color.replace('bg-', '') }} // Hack for color matching
                                                    onClick={() => navigate(rec.route)}
                                                >

                                                    {/* Icon Box */}
                                                    <div className={`w-14 h-14 rounded-2xl ${rec.color} flex-shrink-0 flex items-center justify-center text-white shadow-md group-hover:scale-110 transition-transform`}>
                                                        <rec.icon className="w-7 h-7" />
                                                    </div>

                                                    {/* Content */}
                                                    <div className="flex-1 min-w-0">
                                                        <h3 className="font-bold text-lg truncate group-hover:text-primary transition-colors">{rec.title}</h3>
                                                        <p className="text-sm text-slate-500 dark:text-slate-400 line-clamp-2">{rec.description}</p>
                                                    </div>

                                                    {/* Arrow */}
                                                    <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400 group-hover:bg-primary group-hover:text-white transition-colors">
                                                        <span className="group-hover:translate-x-0.5 transition-transform">→</span>
                                                    </div>
                                                </Card>
                                            </motion.div>
                                        ))}
                                    </div>

                                    <Button variant="outline" className="w-full mt-8" onClick={startAssessment}>
                                        Retake Check-in
                                    </Button>
                                </div>
                            </div>
                        )}
                    </motion.div>
                </div>
            </Layout>
        );
    }

    if (status === 'START') {
        return (
            <Layout>
                <div className="min-h-[80vh] flex flex-col items-center justify-center p-4 text-center space-y-8">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="space-y-6 max-w-lg"
                    >
                        <div className="w-24 h-24 bg-gradient-to-br from-blue-400 to-purple-500 rounded-3xl mx-auto flex items-center justify-center shadow-xl shadow-blue-500/20">
                            <span className="text-5xl">🧠</span>
                        </div>
                        <h1 className="text-4xl font-bold text-slate-900 dark:text-white">Daily Check-in</h1>
                        <p className="text-lg text-slate-600 dark:text-slate-300">
                            A smart, adaptive assessment to understand your mood and find the right balance tools for you, right now.
                        </p>
                        <Button size="lg" className="w-full text-lg h-14 rounded-xl shadow-lg hover:shadow-xl transition-all hover:-translate-y-1" onClick={startAssessment}>
                            Start Check-in
                        </Button>
                    </motion.div>
                </div>
            </Layout>
        );
    }

    // Question Renderer (BASE & DEEP_DIVE)
    return (
        <Layout>
            <div className="min-h-[80vh] flex flex-col items-center justify-center p-4 max-w-2xl mx-auto w-full">
                {/* Progress */}
                <div className="w-full flex items-center justify-between mb-4 text-xs font-semibold uppercase tracking-wider text-slate-400">
                    <span>Progress</span>
                    <span>{Math.round(progress)}%</span>
                </div>
                <div className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full mb-12 overflow-hidden">
                    <motion.div
                        className="h-full bg-gradient-to-r from-primary to-purple-500"
                        initial={{ width: 0 }}
                        animate={{ width: `${progress}%` }}
                        transition={{ duration: 0.5 }}
                    />
                </div>

                <AnimatePresence mode="wait">
                    {question && (
                        <motion.div
                            key={question.id}
                            initial={{ x: 20, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            exit={{ x: -20, opacity: 0 }}
                            className="w-full space-y-10"
                        >
                            <h2 className="text-3xl md:text-4xl font-bold text-center leading-tight">
                                {question.text}
                            </h2>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {question.options.map((opt) => (
                                    <motion.button
                                        key={opt.id}
                                        whileHover={{ scale: 1.02, backgroundColor: "rgba(var(--primary), 0.05)" }}
                                        whileTap={{ scale: 0.98 }}
                                        onClick={() => handleAnswer(opt)}
                                        className="p-6 rounded-2xl bg-white dark:bg-slate-800 border-2 border-transparent hover:border-primary/20 shadow-sm hover:shadow-md transition-all text-left flex items-center gap-4 group"
                                    >
                                        {opt.emoji && (
                                            <span className="text-3xl group-hover:scale-110 transition-transform block">{opt.emoji}</span>
                                        )}
                                        <span className={`font-medium ${opt.emoji ? 'text-lg' : 'text-xl text-center w-full'}`}>{opt.text}</span>
                                    </motion.button>
                                ))}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </Layout>
    );
}
