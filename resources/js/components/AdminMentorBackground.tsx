import React from 'react';
import { usePage } from '@inertiajs/react';

export default function AdminMentorBackground() {
    const { url, props } = usePage<any>();
    const userRole = props?.auth?.user?.role;
    const isMentor = url?.includes('/mentor') || userRole === 'mentor';

    return (
        <div
            className="pointer-events-none fixed inset-0 z-0 overflow-hidden select-none"
            aria-hidden="true"
        >
            {/* 1. ADAPTIVE BASE GRADIENT (SMOOTH SILK/OBSIDIAN, NO BOXES) */}
            <div className="absolute inset-0 bg-gradient-to-b from-[#f8faff] via-[#f1f5f9] to-[#edf2f7] dark:from-[#030712] dark:via-[#050B18] dark:to-[#070e22] transition-colors duration-500" />

            {/* 2. AMBIENT GLOWING NEBULAS & ORBS (ORGANIC RADIAL LIGHT) */}
            {/* Top Center Primary Luminous Aura */}
            <div
                className={`absolute top-[-120px] left-1/2 h-[550px] w-[1300px] -translate-x-1/2 rounded-full blur-[150px] transition-all duration-700 ${
                    isMentor
                        ? 'bg-gradient-to-b from-emerald-500/12 via-indigo-500/10 to-transparent dark:from-emerald-500/18 dark:via-indigo-500/22 dark:to-transparent'
                        : 'bg-gradient-to-b from-[#7C5CFF]/14 via-[#7C5CFF]/8 to-transparent dark:from-[#7C5CFF]/24 dark:via-[#7C5CFF]/15 dark:to-transparent'
                }`}
            />

            {/* Top Right Cyan/Sky Soft Orb */}
            <div
                className={`absolute top-[20px] -right-[80px] h-[500px] w-[600px] rounded-full blur-[140px] transition-all duration-700 ${
                    isMentor
                        ? 'bg-emerald-400/10 dark:bg-emerald-500/14'
                        : 'bg-sky-400/12 dark:bg-sky-500/16'
                }`}
            />

            {/* Bottom Left Deep Violet / Lavender Aura */}
            <div
                className={`absolute top-[550px] -left-[100px] h-[600px] w-[650px] rounded-full blur-[160px] transition-all duration-700 ${
                    isMentor
                        ? 'bg-indigo-500/10 dark:bg-indigo-600/18'
                        : 'bg-purple-500/10 dark:bg-purple-600/16'
                }`}
            />

            {/* Mid Center Subtle Ambient Light Pool */}
            <div className="absolute top-[30%] left-1/2 h-[400px] w-[800px] -translate-x-1/2 rounded-full bg-blue-500/[0.04] blur-[130px] dark:bg-indigo-500/[0.09]" />

            {/* 3. FLUID ORGANIC VECTOR WAVES (AURORA CURVES, NO SQUARES/GRIDS) */}
            <svg
                className="absolute inset-0 h-full w-full opacity-65 dark:opacity-50"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 1440 900"
                preserveAspectRatio="none"
            >
                <defs>
                    <linearGradient
                        id="aurora-wave-1"
                        x1="0%"
                        y1="0%"
                        x2="100%"
                        y2="0%"
                    >
                        <stop
                            offset="0%"
                            stopColor={isMentor ? '#10B981' : '#7C5CFF'}
                            stopOpacity="0"
                        />
                        <stop
                            offset="30%"
                            stopColor={isMentor ? '#10B981' : '#7C5CFF'}
                            stopOpacity="0.28"
                        />
                        <stop
                            offset="70%"
                            stopColor={isMentor ? '#6366F1' : '#38BDF8'}
                            stopOpacity="0.22"
                        />
                        <stop
                            offset="100%"
                            stopColor={isMentor ? '#6366F1' : '#38BDF8'}
                            stopOpacity="0"
                        />
                    </linearGradient>

                    <linearGradient
                        id="aurora-wave-2"
                        x1="0%"
                        y1="0%"
                        x2="100%"
                        y2="0%"
                    >
                        <stop
                            offset="0%"
                            stopColor={isMentor ? '#3B82F6' : '#6366F1'}
                            stopOpacity="0"
                        />
                        <stop
                            offset="45%"
                            stopColor={isMentor ? '#10B981' : '#A855F7'}
                            stopOpacity="0.2"
                        />
                        <stop
                            offset="80%"
                            stopColor={isMentor ? '#06B6D4' : '#0EA5E9'}
                            stopOpacity="0.18"
                        />
                        <stop
                            offset="100%"
                            stopColor={isMentor ? '#06B6D4' : '#0EA5E9'}
                            stopOpacity="0"
                        />
                    </linearGradient>
                </defs>

                {/* Primary Flowing Ribbon */}
                <path
                    d="M 0,180 C 320,80 500,280 840,160 C 1140,50 1300,220 1440,150"
                    fill="none"
                    stroke="url(#aurora-wave-1)"
                    strokeWidth="1.5"
                />

                {/* Counter Flowing Ribbon (Dashed) */}
                <path
                    d="M 0,230 C 280,310 540,120 900,240 C 1180,330 1320,160 1440,210"
                    fill="none"
                    stroke="url(#aurora-wave-2)"
                    strokeWidth="1.2"
                    strokeDasharray="8 10"
                />

                {/* Lower Harmonic Wave */}
                <path
                    d="M 0,460 C 380,360 640,540 980,410 C 1220,310 1360,470 1440,390"
                    fill="none"
                    stroke="url(#aurora-wave-1)"
                    strokeWidth="1"
                    opacity="0.6"
                />

                {/* Soft Ambient Depth Wave */}
                <path
                    d="M 0,680 C 360,780 680,600 1020,720 C 1260,800 1380,650 1440,690"
                    fill="none"
                    stroke="url(#aurora-wave-2)"
                    strokeWidth="1.2"
                    opacity="0.4"
                />
            </svg>

            {/* 4. CONCENTRIC ELLIPTICAL ORBITS (CIRCULAR AURA IN TOP RIGHT) */}
            <div className="absolute -top-[160px] -right-[160px] h-[580px] w-[580px] opacity-60 dark:opacity-45">
                {/* Outer Dashed Orbit */}
                <div
                    className={`absolute inset-0 rounded-full border border-dashed ${
                        isMentor
                            ? 'border-emerald-500/25 dark:border-emerald-400/30'
                            : 'border-[#7C5CFF]/25 dark:border-[#7C5CFF]/30'
                    }`}
                />
                {/* Middle Ring */}
                <div
                    className={`absolute inset-[90px] rounded-full border ${
                        isMentor
                            ? 'border-emerald-500/20 dark:border-emerald-400/25'
                            : 'border-indigo-500/20 dark:border-indigo-400/25'
                    }`}
                />
                {/* Inner Dashed Ring */}
                <div
                    className={`absolute inset-[190px] rounded-full border border-dashed ${
                        isMentor
                            ? 'border-teal-500/25 dark:border-teal-400/30'
                            : 'border-sky-500/25 dark:border-sky-400/30'
                    }`}
                />
                {/* Luminous Orbital Satellite Dot */}
                <div
                    className={`absolute top-[58px] right-[150px] h-3 w-3 rounded-full shadow-lg ${
                        isMentor
                            ? 'bg-emerald-400 shadow-emerald-400/60'
                            : 'bg-[#7C5CFF] shadow-[#7C5CFF]/60'
                    }`}
                />
            </div>

            {/* 5. TOP LASER HORIZON ACCENT (ELEGANT LINEAR LIGHT) */}
            <div
                className={`absolute top-0 right-0 left-0 h-[1.5px] bg-gradient-to-r from-transparent ${
                    isMentor
                        ? 'via-emerald-400/50 dark:via-emerald-400/70'
                        : 'via-[#7C5CFF]/50 dark:via-[#7C5CFF]/70'
                } to-transparent`}
            />

            {/* 6. FLOATING LUMINOUS STARDUST & CELESTIAL FLARES (NO SQUARES) */}
            {/* Sparkle 1 */}
            <div className="absolute top-[14%] left-[6%]">
                <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    className="opacity-70 dark:opacity-80"
                >
                    <path
                        d="M 12 0 Q 12 12 0 12 Q 12 12 12 24 Q 12 12 24 12 Q 12 12 12 0 Z"
                        className={
                            isMentor
                                ? 'fill-emerald-400 drop-shadow-[0_0_6px_rgba(52,211,153,0.8)]'
                                : 'fill-[#7C5CFF] drop-shadow-[0_0_6px_rgba(124,92,255,0.8)]'
                        }
                    />
                </svg>
            </div>

            {/* Sparkle 2 */}
            <div className="absolute top-[28%] right-[10%]">
                <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    className="opacity-60 dark:opacity-75"
                >
                    <path
                        d="M 12 0 Q 12 12 0 12 Q 12 12 12 24 Q 12 12 24 12 Q 12 12 12 0 Z"
                        className="fill-sky-400 drop-shadow-[0_0_5px_rgba(56,189,248,0.7)]"
                    />
                </svg>
            </div>

            {/* Sparkle 3 */}
            <div className="absolute top-[62%] left-[12%]">
                <svg
                    width="12"
                    height="12"
                    viewBox="0 0 24 24"
                    className="opacity-50 dark:opacity-70"
                >
                    <path
                        d="M 12 0 Q 12 12 0 12 Q 12 12 12 24 Q 12 12 24 12 Q 12 12 12 0 Z"
                        className={
                            isMentor
                                ? 'fill-teal-300 drop-shadow-[0_0_4px_rgba(94,234,212,0.6)]'
                                : 'fill-indigo-400 drop-shadow-[0_0_4px_rgba(129,140,248,0.6)]'
                        }
                    />
                </svg>
            </div>

            {/* Sparkle 4 */}
            <div className="absolute top-[75%] right-[18%]">
                <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    className="opacity-60 dark:opacity-75"
                >
                    <path
                        d="M 12 0 Q 12 12 0 12 Q 12 12 12 24 Q 12 12 24 12 Q 12 12 12 0 Z"
                        className={
                            isMentor
                                ? 'fill-emerald-300 drop-shadow-[0_0_5px_rgba(110,231,183,0.7)]'
                                : 'fill-purple-400 drop-shadow-[0_0_5px_rgba(192,132,252,0.7)]'
                        }
                    />
                </svg>
            </div>

            {/* Glowing Circular Stardust Particles (Smooth Dots) */}
            <div
                className="absolute top-[18%] left-[22%] h-1.5 w-1.5 rounded-full bg-white/90 shadow-[0_0_8px_rgba(255,255,255,0.9)]"
            />
            <div
                className={`absolute top-[35%] right-[25%] h-2 w-2 rounded-full ${
                    isMentor
                        ? 'bg-emerald-400/80 shadow-[0_0_10px_rgba(52,211,153,0.8)]'
                        : 'bg-[#7C5CFF]/80 shadow-[0_0_10px_rgba(124,92,255,0.8)]'
                }`}
            />
            <div
                className="absolute top-[48%] left-[8%] h-1 w-1 rounded-full bg-sky-300/80 shadow-[0_0_6px_rgba(125,211,252,0.8)]"
            />
            <div
                className="absolute top-[65%] right-[8%] h-1.5 w-1.5 rounded-full bg-indigo-300/80 shadow-[0_0_8px_rgba(165,180,252,0.8)]"
            />
            <div
                className="absolute top-[82%] left-[16%] h-2 w-2 rounded-full bg-purple-300/70 shadow-[0_0_8px_rgba(216,180,254,0.8)]"
            />
            <div
                className="absolute top-[88%] right-[28%] h-1 w-1 rounded-full bg-white/80 shadow-[0_0_6px_rgba(255,255,255,0.8)]"
            />
        </div>
    );
}
