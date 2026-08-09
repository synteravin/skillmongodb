import { motion } from 'framer-motion';

interface SkillVenturaLoaderProps {
    text?: string;
    subtext?: string;
}

export default function SkillVenturaLoader({
    text = 'MEMUAT DATA...',
    subtext = 'Harap tunggu sebentar...',
}: SkillVenturaLoaderProps) {
    return (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#04080f]/90 p-4 font-['Rajdhani',sans-serif] backdrop-blur-md">
            <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{
                    scale: [0.97, 1.03, 0.97],
                    opacity: [0.85, 1, 0.85],
                }}
                transition={{
                    repeat: Infinity,
                    duration: 1.8,
                    ease: 'easeInOut',
                }}
                className="mb-6 flex h-36 w-36 items-center justify-center"
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
                {text}
            </h3>

            <p className="text-center text-sm font-medium text-slate-400">
                {subtext}
            </p>
        </div>
    );
}
