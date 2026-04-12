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
                    className="fixed inset-0 bg-black/40 backdrop-blur-md z-50"
                />

                {/* MODAL */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.9, y: 40 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9, y: 40 }}
                    className="fixed inset-0 z-50 flex items-center justify-center"
                >
                    <div className="bg-white rounded-3xl shadow-2xl p-10 w-[420px] text-center">

                        <div className="text-5xl mb-4">
                            {result.passed ? "🎉" : "😢"}
                        </div>

                        <h1 className="text-2xl font-bold mb-2">
                            {result.passed ? "Great Job!" : "Try Again"}
                        </h1>

                        <p className="text-gray-500 mb-2">Your Score</p>

                        <div className="text-5xl font-extrabold mb-4">
                            {result.score}
                        </div>

                        <div className={`mb-6 text-lg font-semibold ${result.passed
                                ? "text-green-500"
                                : "text-red-500"
                            }`}>
                            {result.passed ? "PASSED" : "FAILED"}
                        </div>

                        <button
                            onClick={onClose}
                            className="w-full bg-black text-white py-3 rounded-xl hover:opacity-90 transition"
                        >
                            Continue
                        </button>
                    </div>
                </motion.div>
            </>
        </AnimatePresence>
    )
}