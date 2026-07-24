import React from 'react';

interface SpeechBubbleProps {
    children: React.ReactNode;
    className?: string;
    tailPosition?: 'bottom' | 'bottom-left' | 'right' | 'left' | 'none';
}

export default function SpeechBubble({
    children,
    className = '',
    tailPosition = 'bottom',
}: SpeechBubbleProps) {
    return (
        <div
            className={`relative rounded-2xl border border-indigo-500/30 bg-white/95 p-4 text-sm text-slate-900 shadow-2xl shadow-indigo-500/20 backdrop-blur-xl dark:border-indigo-500/40 dark:bg-[#070b24]/95 dark:text-slate-100 ${className}`}
            style={{ fontFamily: 'Orbitron, sans-serif' }}
        >
            {children}

            {/* Dynamic Tail Pointer */}
            {tailPosition === 'bottom' && (
                <div className="absolute -bottom-2.5 left-1/2 h-4 w-4 -translate-x-1/2 rotate-45 border-r border-b border-indigo-500/30 bg-white dark:border-indigo-500/40 dark:bg-[#070b24]" />
            )}
            {tailPosition === 'bottom-left' && (
                <div className="absolute -bottom-2.5 left-10 sm:left-12 h-4 w-4 rotate-45 border-r border-b border-indigo-500/30 bg-white dark:border-indigo-500/40 dark:bg-[#070b24]" />
            )}
            {tailPosition === 'right' && (
                <div className="absolute top-6 -right-2 h-4 w-4 rotate-45 border-t border-r border-indigo-500/30 bg-white dark:border-indigo-500/40 dark:bg-[#070b24]" />
            )}
            {tailPosition === 'left' && (
                <div className="absolute top-6 -left-2 h-4 w-4 rotate-45 border-b border-l border-indigo-500/30 bg-white dark:border-indigo-500/40 dark:bg-[#070b24]" />
            )}
        </div>
    );
}
