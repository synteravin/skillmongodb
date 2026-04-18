import { motion, AnimatePresence } from "framer-motion"

export default function ResultModal({ open, result, onClose }: any) {
    if (!open || !result) return null

    return (
        <AnimatePresence>
            <>
                {/* BACKDROP */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 bg-black/70 backdrop-blur-lg z-50"
                />

                {/* MODAL WRAPPER */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.7, y: 80 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.7, y: 80 }}
                    transition={{ type: "spring", stiffness: 120 }}
                    className="fixed inset-0 z-50 flex items-center justify-center px-4"
                >
                    {/* CARD */}
                    <div className="relative w-full max-w-md overflow-hidden rounded-3xl bg-gradient-to-br from-[#0f172a] via-[#111827] to-[#020617] border border-blue-500/20 shadow-[0_0_40px_rgba(59,130,246,0.4)] p-8 text-center text-white">

                        {/* 🔥 GLOW BACKGROUND (FIX POINTER) */}
                        <div className="absolute inset-0 opacity-20 blur-3xl bg-blue-500 pointer-events-none" />

                        {/* 🔥 DECORATION */}
                        <div className="absolute -top-10 -right-10 w-40 h-40 bg-blue-500 opacity-20 blur-3xl pointer-events-none" />
                        <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-purple-500 opacity-20 blur-3xl pointer-events-none" />

                        {/* ICON */}
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ type: "spring", stiffness: 200 }}
                            className="text-7xl mb-4 relative z-10"
                        >
                            🏆
                        </motion.div>

                        {/* TITLE */}
                        <motion.h1
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-3xl font-extrabold tracking-wide mb-2 relative z-10"
                        >
                            MISSION COMPLETE
                        </motion.h1>

                        <p className="text-blue-300 text-sm mb-6 relative z-10">
                            You finished the challenge
                        </p>

                        {/* SCORE CIRCLE */}
                        <div className="relative flex justify-center mb-6 z-10">
                            <div className="w-32 h-32 rounded-full border-4 border-blue-400 flex items-center justify-center shadow-[0_0_20px_rgba(59,130,246,0.6)]">
                                <span className="text-4xl font-extrabold">
                                    {result.score}
                                </span>
                            </div>
                        </div>

                        {/* PROGRESS BAR */}
                        <div className="mb-6 relative z-10">
                            <p className="text-xs text-gray-400 mb-2">PROGRESS</p>

                            <div className="w-full h-2 bg-gray-800 rounded-full overflow-hidden">
                                <motion.div
                                    initial={{ width: 0 }}
                                    animate={{ width: `${result.score}%` }}
                                    className="h-full bg-blue-500"
                                />
                            </div>
                        </div>

                        {/* BUTTON */}
                        <motion.button
                            whileTap={{ scale: 0.95 }}
                            onClick={onClose}
                            className="relative z-20 w-full py-3 rounded-xl font-semibold bg-blue-500 hover:bg-blue-600 transition shadow-lg shadow-blue-500/30"
                        >
                            Continue Journey →
                        </motion.button>
                    </div>
                </motion.div>
            </>
        </AnimatePresence>
    )
}