import { login } from '@/routes';
import { Link } from '@inertiajs/react';
import { motion } from 'framer-motion';
import {
    ArrowRight,
    Code2,
    ShieldCheck,
    Cloud,
    Database,
    Brain,
    Smartphone,
    Globe,
    Palette,
    TrendingUp,
    Briefcase,
    Microscope,
    Gamepad2,
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
            <div className="relative z-20 mt-24 w-full rotate-[3deg] overflow-hidden">
                <div className="border border-slate-200/50 bg-gradient-to-r from-white/80 via-slate-200/60 to-white/80 shadow-lg backdrop-blur-lg transition-all duration-500 dark:border-white/10 dark:from-black/70 dark:via-indigo-900/60 dark:to-black/70 dark:shadow-2xl overflow-hidden">
                    <div className="animate-marquee hover:[animation-play-state:paused] flex w-max items-center py-4 md:py-6 text-slate-800 dark:text-white">
                        {[...Array(2)].map((_, i) => (
                            <div
                                key={i}
                                className="flex items-center gap-12 pr-12 md:gap-16 md:pr-16 shrink-0"
                            >
                                <div className="flex items-center gap-3 shrink-0">
                                    <Code2 size={22} className="text-slate-800 dark:text-white" />
                                    <span className="text-sm font-semibold tracking-wide md:text-base">Software Development</span>
                                </div>
                                <div className="flex items-center gap-3 shrink-0">
                                    <ShieldCheck size={22} className="text-slate-800 dark:text-white" />
                                    <span className="text-sm font-semibold tracking-wide md:text-base">Cyber Security</span>
                                </div>
                                <div className="flex items-center gap-3 shrink-0">
                                    <Cloud size={22} className="text-slate-800 dark:text-white" />
                                    <span className="text-sm font-semibold tracking-wide md:text-base">Cloud Computing</span>
                                </div>
                                <div className="flex items-center gap-3 shrink-0">
                                    <Database size={22} className="text-slate-800 dark:text-white" />
                                    <span className="text-sm font-semibold tracking-wide md:text-base">Data Science</span>
                                </div>
                                <div className="flex items-center gap-3 shrink-0">
                                    <Brain size={22} className="text-slate-800 dark:text-white" />
                                    <span className="text-sm font-semibold tracking-wide md:text-base">Artificial Intelligence</span>
                                </div>
                                <div className="flex items-center gap-3 shrink-0">
                                    <Smartphone size={22} className="text-slate-800 dark:text-white" />
                                    <span className="text-sm font-semibold tracking-wide md:text-base">Mobile Development</span>
                                </div>
                                <div className="flex items-center gap-3 shrink-0">
                                    <Globe size={22} className="text-slate-800 dark:text-white" />
                                    <span className="text-sm font-semibold tracking-wide md:text-base">Web Development</span>
                                </div>
                                <div className="flex items-center gap-3 shrink-0">
                                    <Palette size={22} className="text-slate-800 dark:text-white" />
                                    <span className="text-sm font-semibold tracking-wide md:text-base">UI/UX Design</span>
                                </div>
                                <div className="flex items-center gap-3 shrink-0">
                                    <TrendingUp size={22} className="text-slate-800 dark:text-white" />
                                    <span className="text-sm font-semibold tracking-wide md:text-base">Digital Marketing</span>
                                </div>
                                <div className="flex items-center gap-3 shrink-0">
                                    <Briefcase size={22} className="text-slate-800 dark:text-white" />
                                    <span className="text-sm font-semibold tracking-wide md:text-base">Business Management</span>
                                </div>
                                <div className="flex items-center gap-3 shrink-0">
                                    <Microscope size={22} className="text-slate-800 dark:text-white" />
                                    <span className="text-sm font-semibold tracking-wide md:text-base">Research & Innovation</span>
                                </div>
                                <div className="flex items-center gap-3 shrink-0">
                                    <Gamepad2 size={22} className="text-slate-800 dark:text-white" />
                                    <span className="text-sm font-semibold tracking-wide md:text-base">Game Development</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

        </section>
    );
}
