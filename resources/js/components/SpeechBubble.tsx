interface SpeechBubbleProps {
    children: React.ReactNode;
    className?: string;
}

export default function SpeechBubble({
    children,
    className = '',
}: SpeechBubbleProps) {
    return (
        <div
            className={`relative max-w-xs rounded-xl bg-black/70 px-5 py-4 text-sm text-gray-200 shadow-xl backdrop-blur ${className} `}
            style={{ fontFamily: 'Orbitron' }}
        >
            {children}

            {/* Tail */}
            <div className="absolute -bottom-3 left-1/2 h-6 w-6 -translate-x-1/2 rotate-45 bg-black/70 md:left-10 md:translate-x-0"></div>
        </div>
    );
}
