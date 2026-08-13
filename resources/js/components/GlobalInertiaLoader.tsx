import { router } from '@inertiajs/react';
import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';

export default function GlobalInertiaLoader() {
    const [loading, setLoading] = useState(false);
    const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    useEffect(() => {
        const unbindStart = router.on('start', (event) => {
            const visit = event.detail.visit;
            // Ignore background syncs & minor actions (preserveScroll / preserveState)
            if (visit.preserveScroll || visit.preserveState) {
                return;
            }

            if (timerRef.current) {
                clearTimeout(timerRef.current);
            }

            // Fast 150ms threshold: fast requests won't flicker full-screen loader
            timerRef.current = setTimeout(() => {
                setLoading(true);
            }, 150);
        });

        const handleFinish = () => {
            if (timerRef.current) {
                clearTimeout(timerRef.current);
                timerRef.current = null;
            }
            setLoading(false);
        };

        const unbindFinish = router.on('finish', handleFinish);

        return () => {
            if (timerRef.current) {
                clearTimeout(timerRef.current);
            }
            unbindStart();
            unbindFinish();
        };
    }, []);

    return (
        <AnimatePresence>
            {loading && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.15 }}
                    className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#04080f]/85 p-4 font-['Rajdhani',sans-serif] backdrop-blur-md"
                >
                    <motion.div
                        initial={{ scale: 0.9 }}
                        animate={{
                            scale: [0.97, 1.03, 0.97],
                            opacity: [0.85, 1, 0.85],
                        }}
                        transition={{
                            repeat: Infinity,
                            duration: 1.5,
                            ease: 'easeInOut',
                        }}
                        className="mb-6 flex h-32 w-32 items-center justify-center"
                    >
                        <img
                            src="/images/logo-fast.webp"
                            alt="SkillVentura Logo"
                            className="h-full w-full object-contain"
                            loading="eager"
                            decoding="sync"
                        />
                    </motion.div>

                    <h3
                        className="mb-1 text-center text-lg font-bold tracking-widest text-yellow-400 uppercase"
                        style={{ fontFamily: "'Orbitron', sans-serif" }}
                    >
                        MEMUAT HALAMAN...
                    </h3>

                    <p className="text-center text-sm font-medium text-slate-400">
                        Menyiapkan data SkillVentura...
                    </p>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
