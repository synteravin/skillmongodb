import { login } from '@/routes';
import { Link } from '@inertiajs/react';
import { motion } from 'framer-motion';
import {
    ArrowRight,
    Music,
    Slack,
    LayoutGrid,
    MessageCircle,
    Zap,
} from 'lucide-react';

export default function HeroSection() {
    return (
        <section id="home" className="relative overflow-visible pt-32 pb-40">
            {/* GLOBAL GLOW LIGHT / DARK */}
            <div className="absolute right-[-150px] -bottom-[250px] -z-10 h-[600px] w-[600px] rounded-full bg-[#E9E5FF] blur-[180px] transition-all duration-500 md:h-[900px] md:w-[900px] dark:bg-[#3B28F6] dark:opacity-60 dark:blur-[260px]" />
            <div className="absolute -bottom-[200px] left-0 -z-10 h-[500px] w-[500px] rounded-full bg-blue-200 blur-[150px] transition-all duration-500 md:h-[700px] md:w-[700px] dark:bg-blue-700 dark:opacity-40 dark:blur-[220px]" />

            {/* GRID */}
            <img
                src="/images/grid-left.webp"
                className="pointer-events-none absolute top-0 left-0 h-[85%] w-1/2 [mask-image:linear-gradient(to_bottom,black_80%,transparent_100%)] object-cover"
            />
            <img
                src="/images/gird-right.webp"
                className="pointer-events-none absolute top-0 right-0 h-[85%] w-1/2 [mask-image:linear-gradient(to_bottom,black_80%,transparent_100%)] object-cover"
            />

            <div className="relative z-10 container mx-auto px-4 md:px-0 lg:px-0 2xl:px-0">
                <div className="flex flex-col items-center gap-8 lg:flex-row">
                    {/* LEFT TEXT */}
                    <div className="flex-1 px-6 text-center lg:ml-6 lg:text-left">
                        <motion.h1
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            style={{ fontFamily: 'Lalezar' }}
                            className="mb-6 text-4xl leading-[1.1] font-black tracking-wide text-[#020101] drop-shadow-[4px_3px_0_#FACC15B3] md:text-7xl dark:text-white"
                        >
                            Learn The Skills <br /> Play The Game <br /> Level
                            Up Your Live
                        </motion.h1>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            className="flex justify-center lg:justify-start"
                        >
                            <div className="group inline-block">
                                <Link
                                    href={login()}
                                    style={{ fontFamily: 'Orbitron' }}
                                    className="flex items-center gap-2 rounded-lg bg-yellow-400 px-8 py-4 text-lg font-bold text-slate-950 transition-all duration-200 hover:translate-x-1 hover:shadow-[0_4px_0_rgba(0,0,0,0.4)]"
                                >
                                    Start to learn
                                    <ArrowRight
                                        size={20}
                                        strokeWidth={3}
                                        className="transition-transform duration-200 group-hover:translate-x-1"
                                    />
                                </Link>
                            </div>
                        </motion.div>
                    </div>

                    {/* HERO IMAGE - Hidden Only On Mobile */}
                    <div className="relative hidden flex-1 items-center justify-center sm:flex">
                        {/* INNER GLOW */}
                        <div className="absolute top-1/2 left-1/2 -z-10 h-[700px] w-[700px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#3B28F6] blur-[500px] transition-all duration-500 md:h-[700px] md:w-[700px] lg:h-[600px] lg:w-[600px] xl:h-[700px] xl:w-[300px] 2xl:h-[700px] 2xl:w-[700px] dark:bg-[#4c3be1] dark:opacity-60 dark:blur-[280px]" />
                        <div className="absolute top-1/2 left-1/2 -z-10 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#3B28F6] blur-[500px] transition-all duration-500 md:h-[700px] md:w-[700px] lg:h-[600px] lg:w-[600px] xl:h-[700px] xl:w-[700px] 2xl:h-[700px] 2xl:w-[700px] dark:bg-[#3B28F6] dark:opacity-60 dark:blur-[220px]" />

                        <img
                            src="/images/play.webp"
                            alt="controller"
                            className="relative z-10 w-[260px] drop-shadow-none transition-all duration-500 md:w-[420px] lg:w-[480px] xl:w-[540px] 2xl:w-[600px] dark:drop-shadow-[0_20px_50px_rgba(0,0,0,0.4)]"
                        />
                    </div>
                </div>
            </div>

            {/* MARQUEE - ALWAYS VISIBLE */}
            <div className="relative z-20 mt-24 w-full rotate-[3deg]">
                <div className="border border-slate-200/50 bg-gradient-to-r from-white/80 via-slate-200/60 to-white/80 shadow-lg backdrop-blur-lg transition-all duration-500 dark:border-white/10 dark:from-black/70 dark:via-indigo-900/60 dark:to-black/70 dark:shadow-2xl">
                    <div className="animate-infinite-scroll flex w-max items-center gap-12 px-6 py-4 text-sm text-slate-600 md:gap-20 md:px-10 md:py-6 md:text-base dark:text-white/70">
                        {[...Array(2)].map((_, i) => (
                            <div
                                key={i}
                                className="flex items-center gap-12 md:gap-20"
                            >
                                <span className="flex items-center gap-3">
                                    <Music size={22} /> Spotify
                                </span>
                                <span className="flex items-center gap-3">
                                    <Slack size={22} /> Slack
                                </span>
                                <span className="flex items-center gap-3">
                                    <LayoutGrid size={22} /> Y Combinator
                                </span>
                                <span className="flex items-center gap-3">
                                    <MessageCircle size={22} /> Discord
                                </span>
                                <span className="flex items-center gap-3">
                                    <Zap size={22} /> Linear
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
