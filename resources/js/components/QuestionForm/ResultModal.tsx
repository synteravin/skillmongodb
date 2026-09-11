import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';
// ─── Types ────────────────────────────────────────────────────────────────────

interface Result {
    exp: number;
    gold: number;
    erp: number;
    score: number;
    passed?: boolean;
}

interface ResultModalProps {
    open: boolean;
    result: Result | null;
    onClose: () => void;
    onViewExplanation?: () => void;
    onRetry?: () => void;
}

interface RewardItem {
    label: string;
    value: number;
    icon: string;
    color: string;
    glowColor: string;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function useCountUp(
    target: number,
    active: boolean,
    steps = 20,
    intervalMs = 30,
) {
    const [count, setCount] = useState(0);

    useEffect(() => {
        if (!active) return;
        const safe = Math.max(0, Number(target ?? 0));
        let current = 0;
        const step = Math.max(1, Math.ceil(safe / steps));

        const timer = setInterval(() => {
            current += step;
            if (current >= safe) {
                setCount(safe);
                clearInterval(timer);
            } else {
                setCount(current);
            }
        }, intervalMs);

        return () => clearInterval(timer);
    }, [target, active]);

    return count;
}

// ─── Sub-components ───────────────────────────────────────────────────────────

const HexDecorLine = ({ isPassed = true }: { isPassed?: boolean }) => (
    <div className="mb-3 sm:mb-6 [@media(max-height:550px)]:mb-2 flex items-center justify-center gap-2">
        <div
            className={`h-px flex-1 ${isPassed ? 'bg-gradient-to-r from-transparent via-[#3b82f6]/60 to-transparent' : 'bg-gradient-to-r from-transparent via-[#ef4444]/60 to-transparent'}`}
        />
        <div
            className={`h-2 w-2 rotate-45 ${isPassed ? 'bg-[#3b82f6]/60' : 'bg-[#ef4444]/60'}`}
        />
        <div
            className={`h-px flex-1 ${isPassed ? 'bg-gradient-to-r from-transparent via-[#3b82f6]/60 to-transparent' : 'bg-gradient-to-r from-transparent via-[#ef4444]/60 to-transparent'}`}
        />
    </div>
);

interface RewardCardProps {
    item: RewardItem;
    index: number;
}

const RewardCard = ({ item, index }: RewardCardProps) => (
    <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
            delay: 0.15 + index * 0.1,
            type: 'spring',
            stiffness: 180,
            damping: 18,
        }}
        whileHover={{ y: -3, transition: { duration: 0.2 } }}
        className="relative flex items-center justify-between px-3 sm:px-4 py-2 sm:py-3.5 [@media(max-height:550px)]:py-1.5 [@media(max-height:550px)]:px-3 min-h-[50px] sm:min-h-[76px] [@media(max-height:550px)]:min-h-[46px]"
    >
        {/* Card BG */}
        <div
            className="absolute inset-0 rounded-xl border border-[#1e3a5f]/70"
            style={{
                background:
                    'linear-gradient(135deg, rgba(10,20,40,0.95) 0%, rgba(15,25,50,0.9) 100%)',
                boxShadow: 'inset 0 1px 0 rgba(96,165,250,0.07)',
            }}
        />

        {/* Left – icon circle */}
        <div className="relative flex items-center gap-2.5 sm:gap-4 [@media(max-height:550px)]:gap-2">
            <div
                className="relative flex h-9 w-9 sm:h-12 sm:w-12 [@media(max-height:550px)]:h-8 [@media(max-height:550px)]:w-8 shrink-0 items-center justify-center rounded-full"
                style={{
                    background: 'rgba(6,12,28,0.9)',
                    border: '1.5px solid rgba(234,179,8,0.35)',
                    boxShadow: `0 0 12px ${item.glowColor}`,
                }}
            >
                <img
                    src={item.icon}
                    alt={item.label}
                    className="h-8 w-8 sm:h-11 sm:w-11 [@media(max-height:550px)]:h-7 [@media(max-height:550px)]:w-7 object-contain"
                />
            </div>

            {/* Middle – label */}
            <span
                className="relative text-xs sm:text-sm [@media(max-height:550px)]:text-xs font-bold tracking-widest uppercase"
                style={{
                    fontFamily: "'Orbitron', sans-serif",
                    color: 'rgba(200,220,255,0.85)',
                    letterSpacing: '0.18em',
                }}
            >
                {item.label}
            </span>
        </div>

        {/* Right – value */}
        <span
            className="relative text-lg sm:text-2xl [@media(max-height:550px)]:text-base font-extrabold tracking-wide"
            style={{
                fontFamily: "'Orbitron', sans-serif",
                color: item.color,
                textShadow: `0 0 10px ${item.glowColor}`,
            }}
        >
            +{item.value}
        </span>
    </motion.div>
);

// ─── Main Component ────────────────────────────────────────────────────────────

export default function ResultModal({
    open,
    result,
    onClose,
    onViewExplanation,
    onRetry,
}: ResultModalProps) {
    const active = open && !!result;
    const isPassed = result?.passed !== false;

    const exp = useCountUp(result?.exp ?? 0, active);
    const gold = useCountUp(result?.gold ?? 0, active);
    const erp = useCountUp(result?.score ?? 0, active);

    const rewards: RewardItem[] = [
        {
            label: 'EXP',
            value: exp,
            icon: '/images/exp.webp',
            color: '#93c5fd',
            glowColor: 'rgba(59,130,246,0.45)',
        },
        {
            label: 'GOLD',
            value: gold,
            icon: '/images/Gold.webp',
            color: '#fbbf24',
            glowColor: 'rgba(251,191,36,0.45)',
        },
        {
            label: 'ERP',
            value: erp,
            icon: '/images/erp.webp',
            color: '#c084fc',
            glowColor: 'rgba(192,132,252,0.45)',
        },
    ];

    if (!open || !result) return null;

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
                    style={{
                        backdropFilter: 'blur(14px)',
                        background: 'rgba(0,5,20,0.78)',
                    }}
                />

                {/* ── Modal ── */}
                <motion.div
                    key="modal"
                    initial={{ opacity: 0, scale: 0.72, y: 60 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.72, y: 60 }}
                    transition={{ type: 'spring', stiffness: 130, damping: 16 }}
                    className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 overflow-y-auto custom-scrollbar"
                >
                    <div
                        className="relative flex flex-col w-full max-w-md landscape:max-w-lg [@media(max-height:550px)]:max-w-lg max-h-[92vh] overflow-y-auto custom-scrollbar rounded-2xl p-5 sm:p-8 landscape:p-4 [@media(max-height:550px)]:p-3.5 landscape:px-6 [@media(max-height:550px)]:px-5"
                        style={{
                            background:
                                'linear-gradient(160deg, #060d1f 0%, #080f22 50%, #040a18 100%)',
                            border: `3px solid ${isPassed ? '#3B28F6' : '#ef4444'}`,
                            boxShadow: isPassed
                                ? '0 0 0 1px rgba(59,40,246,0.2), 0 0 30px rgba(59,40,246,0.5), 0 0 70px rgba(59,40,246,0.25), inset 0 1px 0 rgba(96,165,250,0.08)'
                                : '0 0 0 1px rgba(239,68,68,0.2), 0 0 30px rgba(239,68,68,0.5), 0 0 70px rgba(239,68,68,0.25), inset 0 1px 0 rgba(248,113,113,0.08)',
                        }}
                    >
                        {/* Ambient glow layers */}
                        <div
                            className="pointer-events-none absolute top-0 left-1/2 h-32 w-72 -translate-x-1/2"
                            style={{
                                background: isPassed
                                    ? 'radial-gradient(ellipse at center, rgba(59,130,246,0.18) 0%, transparent 70%)'
                                    : 'radial-gradient(ellipse at center, rgba(239,68,68,0.18) 0%, transparent 70%)',
                            }}
                        />
                        <div
                            className="pointer-events-none absolute bottom-0 left-1/2 h-24 w-56 -translate-x-1/2"
                            style={{
                                background: isPassed
                                    ? 'radial-gradient(ellipse at center, rgba(139,92,246,0.15) 0%, transparent 70%)'
                                    : 'radial-gradient(ellipse at center, rgba(225,29,72,0.15) 0%, transparent 70%)',
                            }}
                        />

                        {/* ── Title ── */}
                        <motion.div
                            initial={{ opacity: 0, y: -16 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.05 }}
                            className="relative mb-1.5 sm:mb-2 [@media(max-height:550px)]:mb-1 text-center"
                        >
                            <h1
                                className="text-xl font-black tracking-[0.18em] uppercase sm:text-3xl [@media(max-height:550px)]:text-lg sm:tracking-[0.2em]"
                                style={{
                                    fontFamily: "'Orbitron', sans-serif",
                                    color: isPassed ? '#f0f8ff' : '#fca5a5',
                                    textShadow: isPassed
                                        ? '0 0 20px rgba(96,165,250,0.5), 0 0 40px rgba(139,92,246,0.25)'
                                        : '0 0 20px rgba(239,68,68,0.5), 0 0 40px rgba(225,29,72,0.25)',
                                }}
                            >
                                {isPassed ? 'Congratulations' : 'Belum Lulus'}
                            </h1>
                        </motion.div>

                        <HexDecorLine isPassed={isPassed} />

                        {/* ── Content Body ── */}
                        {isPassed ? (
                            /* ── Reward Cards ── */
                            <div className="relative mb-4 sm:mb-8 [@media(max-height:550px)]:mb-3 flex flex-col gap-2 sm:gap-3 [@media(max-height:550px)]:gap-1.5">
                                {rewards.map((item, index) => (
                                    <RewardCard
                                        key={item.label}
                                        item={item}
                                        index={index}
                                    />
                                ))}
                            </div>
                        ) : (
                            /* ── Failed Message Box ── */
                            <div className="relative mb-4 sm:mb-8 [@media(max-height:550px)]:mb-3 flex flex-col items-center justify-center rounded-xl border border-red-500/30 bg-slate-950/60 p-4 sm:p-6 [@media(max-height:550px)]:p-3 text-center">
                                <div
                                    className="mb-1 sm:mb-2 text-2xl sm:text-4xl [@media(max-height:550px)]:text-xl font-extrabold text-red-400"
                                    style={{
                                        fontFamily: "'Orbitron', sans-serif",
                                    }}
                                >
                                    {result.score}%
                                </div>
                                <p className="text-xs sm:text-sm font-semibold text-slate-300">
                                    Batas kelulusan minimal adalah{' '}
                                    <span className="font-bold text-amber-400">
                                        75%
                                    </span>
                                    .
                                </p>
                                <p className="mt-1 sm:mt-2 text-[11px] sm:text-xs text-slate-400">
                                    Jangan berkecil hati! Silakan pelajari
                                    kembali materi dan coba lagi.
                                </p>
                            </div>
                        )}

                        {/* ── Buttons ── */}
                        <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-2.5">
                            {!isPassed && onRetry && (
                                <motion.button
                                    whileHover={{ scale: 1.04 }}
                                    whileTap={{ scale: 0.96 }}
                                    onClick={onRetry}
                                    className="min-w-[110px] flex-1 rounded-xl bg-emerald-600 px-3 sm:px-4 py-2 sm:py-3 [@media(max-height:550px)]:py-1.5 text-[11px] sm:text-xs font-bold tracking-wider text-white uppercase shadow-lg shadow-emerald-600/30 transition-all duration-300 hover:bg-emerald-500"
                                    style={{
                                        fontFamily: "'Orbitron', sans-serif",
                                    }}
                                >
                                    🔄 Coba Lagi
                                </motion.button>
                            )}

                            <motion.button
                                whileHover={{ scale: 1.04 }}
                                whileTap={{ scale: 0.96 }}
                                onClick={onViewExplanation || onClose}
                                className="min-w-[120px] flex-1 rounded-xl border border-yellow-400/60 bg-yellow-400/10 px-3 sm:px-4 py-2 sm:py-3 [@media(max-height:550px)]:py-1.5 text-[11px] sm:text-xs font-bold tracking-wider text-yellow-300 uppercase transition-all duration-300 hover:bg-yellow-400/20"
                                style={{
                                    fontFamily: "'Orbitron', sans-serif",
                                }}
                            >
                                💡 Lihat
                            </motion.button>

                            <motion.button
                                whileHover={{ scale: 1.04 }}
                                whileTap={{ scale: 0.96 }}
                                onClick={onClose}
                                className={`min-w-[130px] flex-1 rounded-xl px-3 sm:px-4 py-2 sm:py-3 [@media(max-height:550px)]:py-1.5 text-[11px] sm:text-xs font-bold tracking-wider uppercase transition-all duration-300 ${
                                    isPassed
                                        ? 'border border-indigo-400/50 bg-indigo-600 text-white shadow-lg shadow-indigo-600/40 hover:bg-indigo-500'
                                        : 'border border-slate-600/60 bg-slate-800 text-slate-200 hover:bg-slate-700'
                                }`}
                                style={{
                                    fontFamily: "'Orbitron', sans-serif",
                                }}
                            >
                                Kembali ke Modul
                            </motion.button>
                        </div>

                        {/* Bottom scan line */}
                        <div
                            className="absolute right-0 bottom-0 left-0 h-px"
                            style={{
                                background: isPassed
                                    ? 'linear-gradient(90deg, transparent, rgba(59,130,246,0.5) 30%, rgba(139,92,246,0.5) 70%, transparent)'
                                    : 'linear-gradient(90deg, transparent, rgba(239,68,68,0.5) 30%, rgba(225,29,72,0.5) 70%, transparent)',
                            }}
                        />
                    </div>
                </motion.div>
            </>
        </AnimatePresence>
    );
}
