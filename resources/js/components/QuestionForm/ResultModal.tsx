import { motion, AnimatePresence } from "framer-motion"
import { useEffect, useState } from "react"

// ─── Types ────────────────────────────────────────────────────────────────────

interface Result {
    exp: number
    gold: number
    erp: number
    score: number
}

interface ResultModalProps {
    open: boolean
    result: Result | null
    onClose: () => void
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

const HexDecorLine = () => (
    <div className="flex items-center gap-2 justify-center mb-6">
        <div className="h-px flex-1 bg-gradient-to-r from-transparent via-[#3b82f6]/60 to-transparent" />
        <div className="w-2 h-2 rotate-45 bg-[#3b82f6]/60" />
        <div className="h-px flex-1 bg-gradient-to-r from-transparent via-[#3b82f6]/60 to-transparent" />
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

export default function ResultModal({ open, result, onClose }: ResultModalProps) {
    const active = open && !!result

    const exp = useCountUp(result?.exp ?? 0, active)
    const gold = useCountUp(result?.gold ?? 0, active)
    const erp = useCountUp(result?.erp ?? 0, active)

    const rewards: RewardItem[] = [
        {
            label: "EXP",
            value: exp,
            icon: "/images/exp.png",
            color: "#93c5fd",
            glowColor: "rgba(59,130,246,0.45)",
        },
        {
            label: "GOLD",
            value: gold,
            icon: "/images/gold.png",
            color: "#fbbf24",
            glowColor: "rgba(251,191,36,0.45)",
        },
        {
            label: "ERP",
            value: erp,
            icon: "/images/erp.png",
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
                            border: "3px solid #3B28F6",
                            boxShadow:
                                "0 0 0 1px rgba(59,40,246,0.2), 0 0 30px rgba(59,40,246,0.5), 0 0 70px rgba(59,40,246,0.25), inset 0 1px 0 rgba(96,165,250,0.08)",
                            padding: "36px 28px 32px",
                        }}
                    >
                        {/* Ambient glow layers */}
                        <div
                            className="absolute top-0 left-1/2 -translate-x-1/2 w-72 h-32 pointer-events-none"
                            style={{
                                background:
                                    "radial-gradient(ellipse at center, rgba(59,130,246,0.18) 0%, transparent 70%)",
                            }}
                        />
                        <div
                            className="absolute bottom-0 left-1/2 -translate-x-1/2 w-56 h-24 pointer-events-none"
                            style={{
                                background:
                                    "radial-gradient(ellipse at center, rgba(139,92,246,0.15) 0%, transparent 70%)",
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
                                className="text-3xl font-black tracking-[0.2em] uppercase"
                                style={{
                                    fontFamily: "'Orbitron', sans-serif",
                                    color: "#f0f8ff",
                                    textShadow:
                                        "0 0 20px rgba(96,165,250,0.5), 0 0 40px rgba(139,92,246,0.25)",
                                    letterSpacing: "0.12em",
                                }}
                            >
                                Congratulations
                            </h1>
                        </motion.div>

                        <HexDecorLine />

                        {/* ── Reward Cards ── */}
                        <div className="relative flex flex-col gap-3 mb-8">
                            {rewards.map((item, index) => (
                                <RewardCard key={item.label} item={item} index={index} />
                            ))}
                        </div>

                        {/* ── OK Button ── */}
                        <div className="flex justify-center">
                            <motion.button
                                initial={{ opacity: 0, y: 16 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.5 }}
                                whileHover={{
                                    scale: 1.06,
                                    boxShadow:
                                        "0 0 35px rgba(59,40,246,0.8), 0 0 70px rgba(59,40,246,0.45)",
                                }}
                                whileTap={{ scale: 0.95 }}
                                onClick={onClose}
                                className="relative px-12 py-3 rounded-xl font-black uppercase tracking-widest transition-all duration-300 overflow-hidden"
                                style={{
                                    fontFamily: "'Orbitron', sans-serif",
                                    fontSize: "1.4rem",
                                    letterSpacing: "0.3em",
                                    color: "#fff",
                                    background: "#3B28F6",
                                    border: "1px solid rgba(99,102,241,0.5)",
                                    boxShadow:
                                        "0 0 20px rgba(59,40,246,0.6), 0 0 45px rgba(59,40,246,0.3), inset 0 1px 0 rgba(255,255,255,0.1)",
                                    minWidth: 150,
                                }}
                            >
                                {/* Button inner shimmer */}
                                <span
                                    className="absolute inset-0 pointer-events-none"
                                    style={{
                                        background:
                                            "linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.08) 50%, transparent 60%)",
                                    }}
                                />
                                OK
                            </motion.button>
                        </div>

                        {/* Bottom scan line */}
                        <div
                            className="absolute bottom-0 left-0 right-0 h-px"
                            style={{
                                background:
                                    "linear-gradient(90deg, transparent, rgba(59,130,246,0.5) 30%, rgba(139,92,246,0.5) 70%, transparent)",
                            }}
                        />
                    </div>
                </motion.div>
            </>
        </AnimatePresence>
    )
}