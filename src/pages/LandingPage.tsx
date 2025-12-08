import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Heart, Shield, MessageCircle, Sparkles, CheckCircle2, Users, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';

export default function LandingPage() {
    return (
        <div className="min-h-screen bg-white overflow-x-hidden">
            {/* Navigation */}
            <motion.nav
                initial={{ y: -100 }}
                animate={{ y: 0 }}
                transition={{ duration: 0.5 }}
                className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100"
            >
                <div className="flex items-center justify-between px-6 py-4 max-w-7xl mx-auto">
                    <div className="flex items-center gap-2">
                        <div className="bg-primary/10 p-2 rounded-lg">
                            <Sparkles className="h-6 w-6 text-primary" />
                        </div>
                        <span className="text-xl font-bold text-gray-900">IamBuddy</span>
                    </div>
                    <div className="hidden md:flex items-center gap-8">
                        <a href="#features" className="text-gray-600 hover:text-primary transition-colors">Features</a>
                        <a href="#how-it-works" className="text-gray-600 hover:text-primary transition-colors">How it Works</a>
                        <a href="#testimonials" className="text-gray-600 hover:text-primary transition-colors">Stories</a>
                    </div>
                    <div className="flex items-center gap-4">
                        <Link to="/login">
                            <Button variant="ghost" className="text-gray-600 hover:text-primary">Login</Button>
                        </Link>
                        <Link to="/signup">
                            <Button className="bg-primary hover:bg-primary/90 text-white rounded-full px-6 shadow-lg shadow-primary/25">
                                Get Started
                            </Button>
                        </Link>
                    </div>
                </div>
            </motion.nav>

            {/* Hero Section */}
            <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 px-6 overflow-hidden">
                {/* Background Gradients */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-7xl -z-10 pointer-events-none">
                    <div className="absolute top-20 left-10 w-72 h-72 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
                    <div className="absolute top-20 right-10 w-72 h-72 bg-yellow-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
                    <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
                </div>

                <div className="max-w-7xl mx-auto text-center relative z-10">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-gray-200 shadow-sm text-primary text-sm font-medium mb-8"
                    >
                        <Heart className="h-4 w-4 fill-current" />
                        <span>Your safe space for mental wellness</span>
                    </motion.div>

                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="text-5xl md:text-7xl font-bold text-gray-900 mb-6 tracking-tight leading-[1.1]"
                    >
                        Find Peace in <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-purple-600 to-pink-600">
                            Every Moment
                        </span>
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                        className="text-xl text-gray-600 mb-10 max-w-2xl mx-auto leading-relaxed"
                    >
                        IamBuddy is your personal AI companion for mental well-being. Connect, share, and grow in a supportive community designed just for you.
                    </motion.p>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 }}
                        className="flex flex-col sm:flex-row items-center justify-center gap-4"
                    >
                        <Link to="/signup">
                            <Button size="lg" className="h-14 px-8 text-lg rounded-full bg-primary hover:bg-primary/90 shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all duration-300">
                                Start Your Journey <ArrowRight className="ml-2 h-5 w-5" />
                            </Button>
                        </Link>
                        <Link to="/about">
                            <Button variant="outline" size="lg" className="h-14 px-8 text-lg rounded-full border-2 hover:bg-gray-50 bg-white/50 backdrop-blur-sm">
                                Learn More
                            </Button>
                        </Link>
                    </motion.div>
                </div>
            </section>

            {/* Features Section */}
            <section id="features" className="py-24 bg-gray-50/50">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Why Choose IamBuddy?</h2>
                        <p className="text-gray-600 max-w-2xl mx-auto text-lg">We provide the tools and support you need to maintain a healthy mind and balanced life.</p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        <FeatureCard
                            icon={<Shield className="h-8 w-8 text-blue-500" />}
                            title="Safe & Secure"
                            description="Your privacy is our top priority. Share your thoughts in a completely secure and anonymous environment."
                            delay={0.2}
                        />
                        <FeatureCard
                            icon={<MessageCircle className="h-8 w-8 text-green-500" />}
                            title="24/7 AI Support"
                            description="Access our intelligent AI companion whenever you need someone to talk to, day or night."
                            delay={0.4}
                        />
                        <FeatureCard
                            icon={<Heart className="h-8 w-8 text-red-500" />}
                            title="Personalized Care"
                            description="Get tailored recommendations and activities based on your mood and personal goals."
                            delay={0.6}
                        />
                    </div>
                </div>
            </section>

            {/* How It Works Section */}
            <section id="how-it-works" className="py-24 bg-white">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">How It Works</h2>
                        <p className="text-gray-600 max-w-2xl mx-auto text-lg">Simple steps to start your journey towards better mental health.</p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-12 relative">
                        {/* Connecting Line (Desktop) */}
                        <div className="hidden md:block absolute top-12 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-gray-200 to-transparent"></div>

                        <StepCard
                            number="01"
                            title="Create Account"
                            description="Sign up anonymously and set up your personal preferences."
                            delay={0.2}
                        />
                        <StepCard
                            number="02"
                            title="Check In"
                            description="Share how you're feeling and get instant AI support."
                            delay={0.4}
                        />
                        <StepCard
                            number="03"
                            title="Grow"
                            description="Track your progress and build healthy habits over time."
                            delay={0.6}
                        />
                    </div>
                </div>
            </section>

            {/* Testimonials Section */}
            <section id="testimonials" className="py-24 bg-primary/5">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Community Stories</h2>
                        <p className="text-gray-600 max-w-2xl mx-auto text-lg">Hear from people who have found peace with IamBuddy.</p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        <TestimonialCard
                            name="Sarah M."
                            role="Student"
                            content="IamBuddy helped me manage my exam anxiety. The AI companion is always there when I need to vent."
                            delay={0.2}
                        />
                        <TestimonialCard
                            name="James L."
                            role="Professional"
                            content="The daily check-ins have made me more self-aware. It's like having a therapist in my pocket."
                            delay={0.4}
                        />
                        <TestimonialCard
                            name="Emily R."
                            role="Artist"
                            content="I love the safe space this app provides. No judgment, just support. Highly recommended!"
                            delay={0.6}
                        />
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-24 px-6">
                <div className="max-w-5xl mx-auto bg-primary rounded-3xl p-12 text-center text-white relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-full bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20"></div>
                    <div className="relative z-10">
                        <h2 className="text-3xl md:text-5xl font-bold mb-6">Ready to find your peace?</h2>
                        <p className="text-primary-foreground/80 text-xl mb-10 max-w-2xl mx-auto">
                            Join thousands of others who are taking control of their mental well-being today.
                        </p>
                        <Link to="/signup">
                            <Button size="lg" variant="secondary" className="h-14 px-10 text-lg rounded-full shadow-lg hover:shadow-xl transition-all duration-300">
                                Get Started for Free
                            </Button>
                        </Link>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-white py-12 border-t border-gray-100">
                <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
                    <div className="flex items-center gap-2">
                        <div className="bg-primary/10 p-2 rounded-lg">
                            <Sparkles className="h-5 w-5 text-primary" />
                        </div>
                        <span className="text-lg font-bold text-gray-900">IamBuddy</span>
                    </div>
                    <div className="text-gray-500 text-sm">
                        &copy; {new Date().getFullYear()} IamBuddy. All rights reserved.
                    </div>
                    <div className="flex gap-6">
                        <a href="#" className="text-gray-400 hover:text-primary transition-colors">Privacy</a>
                        <a href="#" className="text-gray-400 hover:text-primary transition-colors">Terms</a>
                        <a href="#" className="text-gray-400 hover:text-primary transition-colors">Contact</a>
                    </div>
                </div>
            </footer>
        </div>
    );
}

function FeatureCard({ icon, title, description, delay }: { icon: React.ReactNode, title: string, description: string, delay: number }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay, duration: 0.5 }}
            className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 group"
        >
            <div className="mb-6 bg-gray-50 w-16 h-16 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                {icon}
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">{title}</h3>
            <p className="text-gray-600 leading-relaxed">{description}</p>
        </motion.div>
    );
}

function StepCard({ number, title, description, delay }: { number: string, title: string, description: string, delay: number }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay, duration: 0.5 }}
            className="relative bg-white p-6 rounded-2xl text-center z-10"
        >
            <div className="w-12 h-12 bg-primary text-white rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-6 shadow-lg shadow-primary/30">
                {number}
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">{title}</h3>
            <p className="text-gray-600">{description}</p>
        </motion.div>
    );
}

function TestimonialCard({ name, role, content, delay }: { name: string, role: string, content: string, delay: number }) {
    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay, duration: 0.5 }}
            className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100"
        >
            <div className="flex gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                ))}
            </div>
            <p className="text-gray-600 mb-6 italic">"{content}"</p>
            <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center text-gray-500 font-bold">
                    {name[0]}
                </div>
                <div>
                    <div className="font-bold text-gray-900">{name}</div>
                    <div className="text-sm text-gray-500">{role}</div>
                </div>
            </div>
        </motion.div>
    );
}
