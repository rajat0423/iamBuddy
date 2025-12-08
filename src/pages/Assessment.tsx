import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { db } from "@/firebase/config";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import Layout from "@/components/shared/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Loader2 } from "lucide-react";

const questions = [
    {
        id: "mood",
        text: "How have you been feeling lately?",
        options: [
            { value: "1", label: "Very Low" },
            { value: "2", label: "Low" },
            { value: "3", label: "Neutral" },
            { value: "4", label: "Good" },
            { value: "5", label: "Excellent" },
        ],
    },
    {
        id: "anxiety",
        text: "How often have you felt anxious or on edge?",
        options: [
            { value: "1", label: "Not at all" },
            { value: "2", label: "Several days" },
            { value: "3", label: "More than half the days" },
            { value: "4", label: "Nearly every day" },
        ],
    },
    {
        id: "sleep",
        text: "How would you rate your sleep quality?",
        options: [
            { value: "1", label: "Very Poor" },
            { value: "2", label: "Poor" },
            { value: "3", label: "Average" },
            { value: "4", label: "Good" },
            { value: "5", label: "Excellent" },
        ],
    },
    {
        id: "stress",
        text: "How manageable does your current stress level feel?",
        options: [
            { value: "1", label: "Unmanageable" },
            { value: "2", label: "Difficult" },
            { value: "3", label: "Manageable" },
            { value: "4", label: "Easy" },
        ],
    },
    {
        id: "optimism",
        text: "How optimistic do you feel about the future?",
        options: [
            { value: "1", label: "Not at all" },
            { value: "2", label: "Slightly" },
            { value: "3", label: "Moderately" },
            { value: "4", label: "Very" },
        ],
    },
];

export default function Assessment() {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [answers, setAnswers] = useState<Record<string, string>>({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleOptionChange = (questionId: string, value: string) => {
        setAnswers((prev) => ({ ...prev, [questionId]: value }));
    };

    const calculateScore = () => {
        // Simple scoring logic for MVP
        let total = 0;
        Object.values(answers).forEach((val) => {
            total += parseInt(val);
        });
        return total;
    };

    const handleSubmit = async () => {
        if (!user) return;
        setIsSubmitting(true);

        try {
            const score = calculateScore();
            const assessmentData = {
                userId: user.uid,
                answers,
                score,
                timestamp: serverTimestamp(),
                summary: score > 15 ? "Doing Well" : "Needs Attention",
            };

            await addDoc(collection(db, "users", user.uid, "assessments"), assessmentData);

            // Navigate to dashboard with a success state (could be improved with a toast)
            navigate("/dashboard");
        } catch (error) {
            console.error("Error saving assessment:", error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const isComplete = questions.every((q) => answers[q.id]);

    return (
        <Layout>
            <div className="max-w-2xl mx-auto space-y-8">
                <div className="text-center space-y-2">
                    <h1 className="text-3xl font-bold text-gray-900">Emotional Wellness Assessment</h1>
                    <p className="text-gray-500">
                        Answer these few questions to help us understand how you're doing.
                        Your responses are private and help us personalize your experience.
                    </p>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Check-in</CardTitle>
                        <CardDescription>Select the option that best describes your experience over the last 2 weeks.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-8">
                        {questions.map((q) => (
                            <div key={q.id} className="space-y-4">
                                <Label className="text-base font-medium">{q.text}</Label>
                                <RadioGroup
                                    onValueChange={(val) => handleOptionChange(q.id, val)}
                                    value={answers[q.id]}
                                    className="flex flex-col space-y-2"
                                >
                                    {q.options.map((opt) => (
                                        <div key={opt.value} className="flex items-center space-x-2">
                                            <RadioGroupItem value={opt.value} id={`${q.id}-${opt.value}`} />
                                            <Label htmlFor={`${q.id}-${opt.value}`} className="font-normal cursor-pointer">
                                                {opt.label}
                                            </Label>
                                        </div>
                                    ))}
                                </RadioGroup>
                            </div>
                        ))}
                    </CardContent>
                    <CardFooter>
                        <Button
                            className="w-full"
                            onClick={handleSubmit}
                            disabled={!isComplete || isSubmitting}
                        >
                            {isSubmitting ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Saving...
                                </>
                            ) : (
                                "Submit Assessment"
                            )}
                        </Button>
                    </CardFooter>
                </Card>
            </div>
        </Layout>
    );
}
