import { Settings } from "lucide-react"
import { router } from "@inertiajs/react"

type Props = {
    title: string
    index: number
    isLast?: boolean
    isSubmission?: boolean
    badge?: {
        icon: string
        icon_url?: string | null
    }
    pathId?: string
}

export default function ModuleNode({
    title,
    index,
    isLast,
    isSubmission,
    badge,
    pathId
}: Props) {

    const romanNumerals = [
        "I", "II", "III", "IV", "V", "VI",
        "VII", "VIII", "IX", "X", "XI", "XII",
    ];
    const roman = romanNumerals[index] || String(index + 1);

    const hasValidIcon =
        badge &&
        badge.icon &&
        badge.icon !== "null" &&
        badge.icon !== "";

    const iconSrc = badge?.icon_url || badge?.icon || "";

    const statusLabel = "Available";

    return (
        <div className="flex flex-col items-center w-full relative px-1 sm:px-0">
            {/* Outer Wrapper with border gradient */}
            <div
                className="relative w-full transition-all duration-300 mb-0 z-10"
                style={{
                    borderRadius: "14px",
                    padding: "2px",
                    background: "linear-gradient(135deg, #60a5fa, #818cf8, #60a5fa)",
                    boxShadow: "0 2px 16px rgba(99,102,241,0.2)",
                }}
            >
                {/* Inner Card */}
                <div
                    className="flex items-center gap-0 w-full overflow-hidden"
                    style={{
                        borderRadius: "12px",
                        minHeight: "72px",
                        background: "linear-gradient(135deg, #0f1d40 0%, #0a1530 100%)",
                    }}
                >
                    {/* BADGE / ICON */}
                    <div
                        className="relative flex-shrink-0 self-stretch flex items-center justify-center bg-[#000000]"
                        style={{
                            width: "72px",
                            borderRadius: "10px 0 0 10px",
                            overflow: "hidden",
                        }}
                    >
                        {hasValidIcon ? (
                            <img
                                src={iconSrc}
                                className="w-12 h-12 object-cover rounded-lg"
                                alt="badge"
                            />
                        ) : isSubmission ? (
                            <div
                                className="flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-r from-[#818cf8] to-[#4f46e5] shadow-[0_0_14px_rgba(99,102,241,0.4)]"
                            >
                                <svg viewBox="0 0 24 24" className="w-6 h-6" fill="white">
                                    <path d="M12 2l2.9 6.3L22 9.3l-5 4.9 1.2 6.9L12 18l-6.2 3.1L7 14.2 2 9.3l7.1-1L12 2z"/>
                                </svg>
                            </div>
                        ) : (
                            <div
                                className="flex items-center justify-center w-12 h-12 rounded-full border-2 border-[rgba(251,191,36,0.6)]"
                                style={{
                                    background: "radial-gradient(circle at 35% 35%, #fbbf24 0%, #d97706 60%, #92400e 100%)",
                                    boxShadow: "inset 0 2px 4px rgba(255,255,255,0.3), 0 0 14px rgba(251,191,36,0.4)",
                                }}
                            >
                                <span
                                    className="font-bold select-none text-white"
                                    style={{
                                        fontFamily: "Orbitron, sans-serif",
                                        fontSize: roman.length > 3 ? "10px" : "13px",
                                        textShadow: "0 1px 3px rgba(0,0,0,0.4)",
                                    }}
                                >
                                    {roman}
                                </span>
                            </div>
                        )}

                        {/* Status Icon on the bottom right corner of left badge */}
                        <div
                            className="absolute bottom-1.5 right-1.5 flex items-center justify-center z-20 w-5 h-5 rounded-full border-2 border-white bg-[#3b82f6] shadow-[0_0_8px_rgba(59,130,246,0.5)]"
                        >
                            <svg viewBox="0 0 16 16" fill="none" stroke="white" strokeWidth="2.5"
                                strokeLinecap="round" strokeLinejoin="round" className="w-2.5 h-2.5">
                                <polyline points="5,3 11,8 5,13"/>
                            </svg>
                        </div>
                    </div>

                    {/* TITLE & STATUS */}
                    <div className="flex-1 flex flex-col justify-center px-4 py-2 gap-0.5 relative overflow-hidden">
                        <span
                            className="font-bold text-sm leading-snug font-['Orbitron'] text-[#e2e8f0]"
                        >
                            {title}
                        </span>

                        <span
                            className="text-[11px] font-semibold text-[#818cf8]"
                        >
                            {statusLabel}
                        </span>
                    </div>

                    {/* MANAGE / SETTINGS BUTTON */}
                    <div className="flex-shrink-0 flex items-center justify-center pr-4">
                        {!isSubmission && pathId ? (
                            <button
                                onClick={() => router.visit(`/admin/paths/${pathId}/modules`)}
                                className="flex items-center justify-center w-8 h-8 rounded-full bg-[#4f46e5] shadow-[0_0_10px_rgba(79,70,229,0.4)] hover:bg-[#6366f1] transition-all duration-300 group"
                                title="Manage Module Paths"
                            >
                                <Settings
                                    size={16}
                                    className="text-white group-hover:rotate-45 transition-transform duration-300"
                                />
                            </button>
                        ) : null}
                    </div>

                </div>
            </div>

            {/* PIPE (Connector line below) */}
            {!isLast && <div className="w-[2px] h-6 bg-blue-500/70"></div>}
        </div>
    )
}