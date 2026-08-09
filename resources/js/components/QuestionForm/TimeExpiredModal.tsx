import { motion, AnimatePresence } from 'framer-motion';

interface TimeExpiredModalProps {
    open: boolean;
    onProceed: () => void;
}

export default function TimeExpiredModal({
    open,
    onProceed,
}: TimeExpiredModalProps) {
    if (!open) return null;

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-md">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9, y: 20 }}
                    className="relative w-full max-w-md overflow-hidden rounded-2xl border border-rose-500/40 bg-[#070b19] p-6 text-center text-white shadow-2xl shadow-rose-950/50"
                >
                    <div className="mx-auto mb-4 flex h-16 w-16 animate-pulse items-center justify-center rounded-full border border-rose-500/50 bg-rose-500/10 text-3xl text-rose-400">
                        ⏱️
                    </div>

                    <h2
                        className="mb-2 text-2xl font-black tracking-widest text-rose-400 uppercase"
                        style={{ fontFamily: "'Orbitron', sans-serif" }}
                    >
                        Waktu Habis!
                    </h2>

                    <p className="mb-6 text-sm leading-relaxed text-slate-300">
                        Waktu pengerjaan kuis telah selesai. Seluruh jawaban
                        Anda yang telah terisi telah disimpan dan dikirim
                        otomatis.
                    </p>

                    <motion.button
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.97 }}
                        onClick={onProceed}
                        className="w-full rounded-xl border border-yellow-400 bg-yellow-400 py-3 font-['Orbitron'] text-sm font-bold tracking-wider text-black shadow-lg shadow-yellow-400/20 transition-all hover:bg-yellow-300"
                    >
                        Lihat Hasil Kuis
                    </motion.button>
                </motion.div>
            </div>
        </AnimatePresence>
    );
}
