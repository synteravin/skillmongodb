import { motion, AnimatePresence } from "framer-motion"
import { useEffect, useState } from "react"

export default function ResultModal({ open, result, onClose }: any) {

    const [exp, setExp] = useState(0)
    const [gold, setGold] = useState(0)

    useEffect(() => {
        if (!result) return

        const safeExp = Number(result?.exp ?? 0)
        const safeGold = Number(result?.gold ?? 0)

        let e = 0
        let g = 0

        const expStep = Math.max(1, Math.ceil(safeExp / 20))
        const goldStep = Math.max(1, Math.ceil(safeGold / 20))

        const expInterval = setInterval(() => {
            e += expStep

            if (e >= safeExp) {
                e = safeExp
                clearInterval(expInterval)
            }

            setExp(e)
        }, 30)

        const goldInterval = setInterval(() => {
            g += goldStep

            if (g >= safeGold) {
                g = safeGold
                clearInterval(goldInterval)
            }

            setGold(g)
        }, 30)

        return () => {
            clearInterval(expInterval)
            clearInterval(goldInterval)
        }

    }, [result])

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

                {/* MODAL */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.7, y: 80 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.7, y: 80 }}
                    transition={{ type: "spring", stiffness: 120 }}
                    className="fixed inset-0 z-50 flex items-center justify-center px-4"
                >
                    <div className="relative w-full max-w-md overflow-hidden rounded-3xl bg-gradient-to-br from-[#0f172a] via-[#111827] to-[#020617] border border-blue-500/20 shadow-[0_0_40px_rgba(59,130,246,0.4)] p-8 text-center text-white">

                        {/* GLOW */}
                        <div className="absolute inset-0 opacity-20 blur-3xl bg-blue-500 pointer-events-none" />

                        {/* ICON */}
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ type: "spring", stiffness: 200 }}
                            className="text-7xl mb-4"
                        >
                            🏆
                        </motion.div>

                        {/* TITLE */}
                        <h1 className="text-3xl font-extrabold mb-2">
                            MISSION COMPLETE
                        </h1>

                        <p className="text-blue-300 text-sm mb-6">
                            You finished the challenge
                        </p>

                        {/* SCORE */}
                        <div className="flex justify-center mb-6">
                            <div className="w-32 h-32 rounded-full border-4 border-blue-400 flex items-center justify-center shadow-lg">
                                <span className="font-extrabold">
                                    <p>ERP</p>
                                    <span className="text-4xl font-extrabold">
                                        {result.score}
                                    </span>
                                </span>
                            </div>
                        </div>

                        {/* REWARD */}
                        <div className="grid grid-cols-2 gap-4 mb-6">

                            {/* EXP */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-4"
                            >
                                <p className="text-xs text-blue-300">EXP</p>
                                <p className="text-xl font-bold text-blue-400">
                                    +{exp}
                                </p>
                            </motion.div>

                            {/* GOLD */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.1 }}
                                className="bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-4"
                            >
                                <p className="text-xs text-yellow-300">GOLD</p>
                                <p className="text-xl font-bold text-yellow-400">
                                    +{gold}
                                </p>
                            </motion.div>

                        </div>

                        {/* PROGRESS BAR */}
                        <div className="mb-6">
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
                            className="w-full py-3 rounded-xl font-semibold bg-blue-500 hover:bg-blue-600 transition shadow-lg"
                        >
                            Continue Journey →
                        </motion.button>
                    </div>
                </motion.div>
            </>
        </AnimatePresence>
    )
}