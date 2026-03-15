interface SpeechBubbleProps {
  children: React.ReactNode
  className?: string
}

export default function SpeechBubble({
  children,
  className = "",
}: SpeechBubbleProps) {
  return (
    <div
      className={`
      relative max-w-xs rounded-xl
      bg-black/70 backdrop-blur
      px-5 py-4 text-sm text-gray-200
      shadow-xl
      ${className}
      `}
      style={{ fontFamily: "Orbitron" }}
    >
      {children}

      {/* Tail */}
      <div className="absolute -bottom-3 left-10 h-6 w-6 rotate-45 bg-black/70"></div>
    </div>
  )
}