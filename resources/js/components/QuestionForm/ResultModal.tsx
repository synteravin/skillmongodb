import { motion, AnimatePresence } from "framer-motion"
import { useEffect, useState } from "react"
// ─── Types ────────────────────────────────────────────────────────────────────

interface Result {
    exp: number
    gold: number
    erp: number
    score: number
    passed?: boolean
}

interface ResultModalProps {
    open: boolean
    result: Result | null
    onClose: () => void
    onRetry?: () => void
}

interface RewardItem {
    label: string
    value: number
    icon: string
    color: string
    glowColor: string
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function useCountUp(target: number, active: boolean, steps = 20, intervalMs = 30) {
    const [count, setCount] = useState(0)

    useEffect(() => {
        if (!active) return
        const safe = Math.max(0, Number(target ?? 0))
        let current = 0
        const step = Math.max(1, Math.ceil(safe / steps))

        const timer = setInterval(() => {
            current += step
            if (current >= safe) {
                setCount(safe)
                clearInterval(timer)
            } else {
                setCount(current)
            }
        }, intervalMs)

        return () => clearInterval(timer)
    }, [target, active])

    return count
}

// ─── Sub-components ───────────────────────────────────────────────────────────

const HexDecorLine = ({ isPassed = true }: { isPassed?: boolean }) => (
    <div className="flex items-center gap-2 justify-center mb-6">
        <div className={`h-px flex-1 ${isPassed ? 'bg-gradient-to-r from-transparent via-[#3b82f6]/60 to-transparent' : 'bg-gradient-to-r from-transparent via-[#ef4444]/60 to-transparent'}`} />
        <div className={`w-2 h-2 rotate-45 ${isPassed ? 'bg-[#3b82f6]/60' : 'bg-[#ef4444]/60'}`} />
        <div className={`h-px flex-1 ${isPassed ? 'bg-gradient-to-r from-transparent via-[#3b82f6]/60 to-transparent' : 'bg-gradient-to-r from-transparent via-[#ef4444]/60 to-transparent'}`} />
    </div>
)

interface RewardCardProps {
    item: RewardItem
    index: number
}

const RewardCard = ({ item, index }: RewardCardProps) => (
    <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 + index * 0.1, type: "spring", stiffness: 180, damping: 18 }}
        whileHover={{ y: -3, transition: { duration: 0.2 } }}
        className="relative flex items-center justify-between px-4"
        style={{ minHeight: 76 }}
    >
        {/* Card BG */}
        <div
            className="absolute inset-0 rounded-xl border border-[#1e3a5f]/70"
            style={{
                background:
                    "linear-gradient(135deg, rgba(10,20,40,0.95) 0%, rgba(15,25,50,0.9) 100%)",
                boxShadow: "inset 0 1px 0 rgba(96,165,250,0.07)",
            }}
        />

        {/* Left – icon circle */}
        <div className="relative flex items-center gap-4">
            <div
                className="relative flex items-center justify-center w-12 h-12 rounded-full"
                style={{
                    background: "rgba(6,12,28,0.9)",
                    border: "1.5px solid rgba(234,179,8,0.35)",
                    boxShadow: `0 0 12px ${item.glowColor}`,
                }}
            >
                <img
                    src={item.icon}
                    alt={item.label}
                    className="w-13 h-13 object-contain"
                />
            </div>

            {/* Middle – label */}
            <span
                className="relative text-sm font-bold tracking-widest uppercase"
                style={{
                    fontFamily: "'Orbitron', sans-serif",
                    color: "rgba(200,220,255,0.85)",
                    letterSpacing: "0.18em",
                }}
            >
                {item.label}
            </span>
        </div>

        {/* Right – value */}
        <span
            className="relative text-2xl font-extrabold tracking-wide"
            style={{
                fontFamily: "'Orbitron', sans-serif",
                color: item.color,
                textShadow: `0 0 10px ${item.glowColor}`,
            }}
        >
            +{item.value}
        </span>
    </motion.div>
)

// ─── Main Component ────────────────────────────────────────────────────────────

export default function ResultModal({ open, result, onClose, onRetry }: ResultModalProps) {
    const active = open && !!result
    const isPassed = result?.passed !== false

    const exp = useCountUp(result?.exp ?? 0, active)
    const gold = useCountUp(result?.gold ?? 0, active)
    const erp = useCountUp(result?.score ?? 0, active)

    const rewards: RewardItem[] = [
        {
            label: "EXP",
            value: exp,
            icon: "/images/exp.webp",
            color: "#93c5fd",
            glowColor: "rgba(59,130,246,0.45)",
        },
        {
            label: "GOLD",
            value: gold,
            icon: "/images/gold.webp",
            color: "#fbbf24",
            glowColor: "rgba(251,191,36,0.45)",
        },
        {
            label: "ERP",
            value: erp,
            icon: "/images/erp.webp",
            color: "#c084fc",
            glowColor: "rgba(192,132,252,0.45)",
        },
    ]

    if (!open || !result) return null

    return (
        <AnimatePresence>
            <>
                {/* ── Backdrop ── */}
                <motion.div
                    key="backdrop"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-50"
                    style={{ backdropFilter: "blur(14px)", background: "rgba(0,5,20,0.78)" }}
                />

                {/* ── Modal ── */}
                <motion.div
                    key="modal"
                    initial={{ opacity: 0, scale: 0.72, y: 60 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.72, y: 60 }}
                    transition={{ type: "spring", stiffness: 130, damping: 16 }}
                    className="fixed inset-0 z-50 flex items-center justify-center px-4"
                >
                    <div
                        className="relative w-full max-w-md rounded-2xl overflow-hidden"
                        style={{
                            background:
                                "linear-gradient(160deg, #060d1f 0%, #080f22 50%, #040a18 100%)",
                            border: `3px solid ${isPassed ? '#3B28F6' : '#ef4444'}`,
                            boxShadow: isPassed
                                ? "0 0 0 1px rgba(59,40,246,0.2), 0 0 30px rgba(59,40,246,0.5), 0 0 70px rgba(59,40,246,0.25), inset 0 1px 0 rgba(96,165,250,0.08)"
                                : "0 0 0 1px rgba(239,68,68,0.2), 0 0 30px rgba(239,68,68,0.5), 0 0 70px rgba(239,68,68,0.25), inset 0 1px 0 rgba(248,113,113,0.08)",
                            padding: "36px 28px 32px",
                        }}
                    >
                        {/* Ambient glow layers */}
                        <div
                            className="absolute top-0 left-1/2 -translate-x-1/2 w-72 h-32 pointer-events-none"
                            style={{
                                background: isPassed
                                    ? "radial-gradient(ellipse at center, rgba(59,130,246,0.18) 0%, transparent 70%)"
                                    : "radial-gradient(ellipse at center, rgba(239,68,68,0.18) 0%, transparent 70%)",
                            }}
                        />
                        <div
                            className="absolute bottom-0 left-1/2 -translate-x-1/2 w-56 h-24 pointer-events-none"
                            style={{
                                background: isPassed
                                    ? "radial-gradient(ellipse at center, rgba(139,92,246,0.15) 0%, transparent 70%)"
                                    : "radial-gradient(ellipse at center, rgba(225,29,72,0.15) 0%, transparent 70%)",
                            }}
                        />

                        {/* ── Title ── */}
                        <motion.div
                            initial={{ opacity: 0, y: -16 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.05 }}
                            className="relative text-center mb-2"
                        >
                            <h1
                                className="text-2xl sm:text-3xl font-black tracking-[0.2em] uppercase"
                                style={{
                                    fontFamily: "'Orbitron', sans-serif",
                                    color: isPassed ? "#f0f8ff" : "#fca5a5",
                                    textShadow: isPassed
                                        ? "0 0 20px rgba(96,165,250,0.5), 0 0 40px rgba(139,92,246,0.25)"
                                        : "0 0 20px rgba(239,68,68,0.5), 0 0 40px rgba(225,29,72,0.25)",
                                    letterSpacing: "0.12em",
                                }}
                            >
                                {isPassed ? "Congratulations" : "Belum Lulus"}
                            </h1>
                        </motion.div>

                        <HexDecorLine isPassed={isPassed} />

                        {/* ── Content Body ── */}
                        {isPassed ? (
                            /* ── Reward Cards ── */
                            <div className="relative flex flex-col gap-3 mb-8">
                                {rewards.map((item, index) => (
                                    <RewardCard key={item.label} item={item} index={index} />
                                ))}
                            </div>
                        ) : (
                            /* ── Failed Message Box ── */
                            <div className="relative flex flex-col items-center justify-center p-6 mb-8 text-center rounded-xl bg-slate-950/60 border border-red-500/30">
                                <div className="text-4xl font-extrabold text-red-400 mb-2" style={{ fontFamily: "'Orbitron', sans-serif" }}>
                                    {result.score}%
                                </div>
                                <p className="text-sm font-semibold text-slate-300">
                                    Batas kelulusan minimal adalah <span className="text-amber-400 font-bold">75%</span>.
                                </p>
                                <p className="text-xs text-slate-400 mt-2">
                                    Jangan berkecil hati! Silakan pelajari kembali materi dan coba lagi.
                                </p>
                            </div>
                        )}

                        {/* ── Buttons ── */}
                        <div className="flex items-center justify-center gap-3">
                            {!isPassed && onRetry && (
                                <motion.button
                                    whileHover={{ scale: 1.04 }}
                                    whileTap={{ scale: 0.96 }}
                                    onClick={onRetry}
                                    className="px-6 py-3 rounded-xl font-bold uppercase tracking-wider text-sm transition-all duration-300 bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-600/30"
                                    style={{ fontFamily: "'Orbitron', sans-serif" }}
                                >
                                    Coba Lagi
                                </motion.button>
                            )}

                            <motion.button
                                initial={{ opacity: 0, y: 16 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.2 }}
                                whileHover={{
                                    scale: 1.06,
                                    boxShadow: isPassed
                                        ? "0 0 35px rgba(59,40,246,0.8), 0 0 70px rgba(59,40,246,0.45)"
                                        : "0 0 25px rgba(239,68,68,0.5)",
                                }}
                                whileTap={{ scale: 0.95 }}
                                onClick={onClose}
                                className="relative px-8 py-3 rounded-xl font-black uppercase tracking-widest transition-all duration-300 overflow-hidden"
                                style={{
                                    fontFamily: "'Orbitron', sans-serif",
                                    fontSize: "1.1rem",
                                    letterSpacing: "0.2em",
                                    color: "#fff",
                                    background: isPassed ? "#3B28F6" : "rgba(255,255,255,0.1)",
                                    border: isPassed ? "1px solid rgba(99,102,241,0.5)" : "1px solid rgba(255,255,255,0.2)",
                                    boxShadow: isPassed
                                        ? "0 0 20px rgba(59,40,246,0.6), 0 0 45px rgba(59,40,246,0.3), inset 0 1px 0 rgba(255,255,255,0.1)"
                                        : "none",
                                }}
                            >
                                {isPassed ? "OK" : "Kembali"}
                            </motion.button>
                        </div>

                        {/* Bottom scan line */}
                        <div
                            className="absolute bottom-0 left-0 right-0 h-px"
                            style={{
                                background: isPassed
                                    ? "linear-gradient(90deg, transparent, rgba(59,130,246,0.5) 30%, rgba(139,92,246,0.5) 70%, transparent)"
                                    : "linear-gradient(90deg, transparent, rgba(239,68,68,0.5) 30%, rgba(225,29,72,0.5) 70%, transparent)",
                            }}
                        />
                    </div>
                </motion.div>
            </>
        </AnimatePresence>
    )
}