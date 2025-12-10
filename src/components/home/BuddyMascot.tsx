import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';

export default function BuddyMascot({ className }: { className?: string }) {
    const [position, setPosition] = useState({ y: 0 });

    // Simple floating animation effect
    useEffect(() => {
        const interval = setInterval(() => {
            setPosition({ y: Math.sin(Date.now() / 1000) * 10 });
        }, 50);
        return () => clearInterval(interval);
    }, []);

    return (
        <div
            className={cn("relative w-48 h-48 transition-transform duration-100 ease-out", className)}
            style={{ transform: `translateY(${position.y}px)` }}
        >
            {/* Glow Effect */}
            <div className="absolute inset-0 bg-primary/20 rounded-full blur-3xl scale-110 animate-pulse" />

            {/* Mascot SVG */}
            <svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full relative z-10 drop-shadow-xl">
                {/* Body */}
                <circle cx="100" cy="100" r="80" fill="url(#bodyGradient)" />

                {/* Eyes */}
                <circle cx="70" cy="90" r="8" fill="#1F2A37" className="animate-blink" />
                <circle cx="130" cy="90" r="8" fill="#1F2A37" className="animate-blink" />

                {/* Cheeks */}
                <circle cx="60" cy="110" r="10" fill="#FFCABF" opacity="0.6" />
                <circle cx="140" cy="110" r="10" fill="#FFCABF" opacity="0.6" />

                {/* Smile */}
                <path d="M70 120 Q100 140 130 120" stroke="#1F2A37" strokeWidth="6" strokeLinecap="round" />

                {/* Shine */}
                <circle cx="140" cy="60" r="15" fill="white" opacity="0.3" />

                <defs>
                    <linearGradient id="bodyGradient" x1="100" y1="20" x2="100" y2="180" gradientUnits="userSpaceOnUse">
                        <stop stopColor="#DDEFF8" />
                        <stop offset="1" stopColor="#BFDCDC" />
                    </linearGradient>
                </defs>
            </svg>
        </div>
    );
}
