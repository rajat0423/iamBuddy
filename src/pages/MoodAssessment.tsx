import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import Layout from "@/components/shared/Layout";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
    QUESTIONS,
    FLOW_ORDER,
    type Question,
    type Option,
    type EmotionalIndices,
    type BranchType,
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
    const [currentBranch, setCurrentBranch] = useState<BranchType | 'BASE'>('BASE');
    const [questionQueue, setQuestionQueue] = useState<string[]>([]);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [answers, setAnswers] = useState<Record<string, string>>({});

    // Result
    const [finalRecs, setFinalRecs] = useState<Recommendation[]>([]);

    // --- Actions ---

    const startAssessment = () => {
        setIndices(INITIAL_INDICES);
        setAnswers({});
        setCurrentBranch('BASE');
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
            setCurrentBranch(branch);

            // Load Branch Questions
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

        return (
            <Layout>
                <div className="min-h-[80vh] flex items-center justify-center p-4">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="w-full max-w-4xl mx-auto space-y-8"
                    >
                        {isCrisis ? (
                            <Card className="p-8 border-red-500 bg-red-50 dark:bg-red-900/20 text-center space-y-4">
                                <h1 className="text-3xl font-bold text-red-600">Please Stay Safe</h1>
                                <p className="text-xl">Your safety is the most important thing right now.</p>
                                <div className="flex justify-center gap-4 pt-4">
                                    <Button size="lg" className="bg-red-600 hover:bg-red-700 text-white w-full max-w-xs">
                                        Call Helpline (988)
                                    </Button>
                                </div>
                            </Card>
                        ) : (
                            <>
                                <div className="text-center space-y-4">
                                    <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
                                        {moodLabel}
                                    </h1>
                                    <p className="text-muted-foreground">Based on your responses, here is your personalized calm plan.</p>
                                </div>

                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                    {Object.entries(indices).map(([key, val]) => (
                                        <Card key={key} className="p-4 flex flex-col items-center justify-center relative overflow-hidden">
                                            <div className="absolute inset-0 bg-primary/5" style={{ height: `${val}%`, bottom: 0, top: 'auto' }} />
                                            <span className="text-2xl font-bold z-10">{Math.round(val)}</span>
                                            <span className="text-xs uppercase tracking-wider text-muted-foreground z-10">{key}</span>
                                        </Card>
                                    ))}
                                </div>

                                <div className="space-y-6">
                                    <h2 className="text-2xl font-semibold">Recommended Actions</h2>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                        {finalRecs.map((rec) => (
                                            <motion.div
                                                key={rec.id}
                                                whileHover={{ y: -5 }}
                                                className="h-full"
                                            >
                                                <Card className="h-full p-6 flex flex-col justify-between hover:shadow-lg transition-all cursor-pointer border-t-4"
                                                    style={{ borderTopColor: rec.color.replace('bg-', '') }}
                                                    onClick={() => navigate(rec.route)}
                                                >
                                                    <div className="space-y-4">
                                                        <div className={`w-12 h-12 rounded-xl ${rec.color} flex items-center justify-center text-white shadow-md`}>
                                                            <rec.icon className="w-6 h-6" />
                                                        </div>
                                                        <div>
                                                            <h3 className="font-bold text-lg">{rec.title}</h3>
                                                            <p className="text-sm text-muted-foreground mt-1">{rec.description}</p>
                                                        </div>
                                                    </div>
                                                    <Button variant="ghost" className="w-full mt-4 justify-between group">
                                                        Start Now
                                                        <span className="group-hover:translate-x-1 transition-transform">→</span>
                                                    </Button>
                                                </Card>
                                            </motion.div>
                                        ))}
                                    </div>
                                </div>

                                <div className="flex justify-center pt-8">
                                    <Button variant="outline" onClick={startAssessment}>Check In Again</Button>
                                </div>
                            </>
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
                        <Button size="lg" className="w-full text-lg h-14 rounded-xl" onClick={startAssessment}>
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
                <div className="w-full h-2 bg-slate-100 rounded-full mb-12 overflow-hidden">
                    <motion.div
                        className="h-full bg-primary"
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
