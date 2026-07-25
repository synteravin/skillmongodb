import React, { useState, useEffect } from 'react';
import { router } from '@inertiajs/react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Sparkles, Gift, X, BookOpen, Briefcase, Award, Compass, Users, CheckCircle2, Target } from 'lucide-react';

interface CharacterOnboardingTourProps {
    character: {
        name: string;
        avatar: string;
    };
    onStepChange?: (targetId: string) => void;
    onClose?: () => void;
}

interface Step {
    title: string;
    targetId: string;
    icon: React.ElementType;
    message: string;
}

interface RewardItem {
    label: string;
    value: number;
    icon: string;
    color: string;
    glowColor: string;
}

// Count-Up animation hook for modal rewards
function useCountUp(target: number, active: boolean, steps = 20, intervalMs = 30) {
    const [count, setCount] = useState(0);

    useEffect(() => {
        if (!active) {
            setCount(0);
            return;
        }
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

export default function CharacterOnboardingTour({
    character,
    onStepChange,
    onClose,
}: CharacterOnboardingTourProps) {
    const [currentStepIndex, setCurrentStepIndex] = useState(0);
    const [displayText, setDisplayText] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isMobileLandscape, setIsMobileLandscape] = useState(false);
    const [showRewardModal, setShowRewardModal] = useState(false);

    const steps: Step[] = [
        {
            title: 'MY COURSE',
            targetId: 'nav-item-my-course',
            icon: BookOpen,
            message: 'Di bagian MY COURSE, kamu akan menemukan seluruh peta pembelajaran (roadmap) dan materi interaktif yang dirancang khusus untuk mengasah skill teknismu.',
        },
        {
            title: 'MY COURSE',
            targetId: 'nav-item-my-course',
            icon: BookOpen,
            message: 'Setiap modul dilengkapi dengan video, modul bacaan, dan kuis praktis. Selesaikan semuanya untuk meningkatkan level RPG-mu dan mengumpulkan EXP!',
        },
        {
            title: 'QUEST BOARD',
            targetId: 'nav-item-quest',
            icon: Briefcase,
            message: 'QUEST BOARD adalah papan pekerjaan tempat kamu bisa melamar dan mengambil proyek freelance nyata dari klien industri.',
        },
        {
            title: 'QUEST BOARD',
            targetId: 'nav-item-quest',
            icon: Briefcase,
            message: 'Selesaikan proyek dengan hasil terbaik untuk mendapatkan imbalan Gold melimpah serta poin reputasi ERP (Enterprise Reputation Points)!',
        },
        {
            title: 'TIER LIST',
            targetId: 'nav-item-tier-list',
            icon: Award,
            message: 'Menu TIER LIST menampilkan peringkat persaingan seluruh siswa secara real-time. Buktikan kemampuanmu dan capai posisi puncak!',
        },
        {
            title: 'TIER LIST',
            targetId: 'nav-item-tier-list',
            icon: Award,
            message: 'Terus kumpulkan reputasi ERP dari Quest dan aktivitas belajar untuk menaikkan bintangmu dan membuka Rank tertinggi!',
        },
        {
            title: 'CERTIFICATE',
            targetId: 'nav-item-certificate',
            icon: Compass,
            message: 'Semua sertifikat kelulusan, lisensi keahlian, dan pencapaian resmi yang telah kamu perjuangkan di SkillVentura akan disimpan secara permanen di sini.',
        },
        {
            title: 'FORUM KOMUNITAS',
            targetId: 'nav-item-forum',
            icon: Users,
            message: 'Gunakan FORUM KOMUNITAS untuk berdiskusi dengan mentor, mengajukan pertanyaan seputar materi, dan berjejaring dengan kawan petualang lainnya.',
        },
        {
            title: 'FORUM KOMUNITAS',
            targetId: 'nav-item-forum',
            icon: Users,
            message: 'Selamat! Kamu telah mempelajari seluruh fitur navigasi dasar. Selesaikan panduan ini sekarang untuk langsung mengklaim hadiah awalmu!',
        },
    ];

    const currentStep = steps[currentStepIndex];

    // Detect mobile landscape orientation
    useEffect(() => {
        const handleResize = () => {
            setIsMobileLandscape(
                window.innerHeight < 500 && window.innerWidth > window.innerHeight
            );
        };
        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // Notify parent of active step target ID for text lighting
    useEffect(() => {
        if (onStepChange) {
            onStepChange(currentStep.targetId);
        }
    }, [currentStepIndex, onStepChange]);

    // Typewriter effect per step (fast, snappy typing for premium feel)
    useEffect(() => {
        let i = 0;
        setDisplayText('');
        setIsTyping(true);
        const fullMessage = currentStep.message;

        const interval = setInterval(() => {
            i++;
            setDisplayText(fullMessage.slice(0, i));
            if (i >= fullMessage.length) {
                setIsTyping(false);
                clearInterval(interval);
            }
        }, 10);

        return () => clearInterval(interval);
    }, [currentStepIndex]);

    const finishTour = (completed: boolean = false) => {
        if (isSubmitting) return;
        setIsSubmitting(true);

        router.post(
            '/student/complete-onboarding',
            { completed },
            {
                preserveScroll: true,
                preserveState: true,
                onFinish: () => {
                    setIsSubmitting(false);
                    if (onClose) onClose();
                },
            },
        );
    };

    const handleNext = () => {
        if (currentStepIndex < steps.length - 1) {
            setCurrentStepIndex((prev) => prev + 1);
        } else {
            // Open reward modal on final step completion
            setShowRewardModal(true);
        }
    };

    const handleBack = () => {
        if (currentStepIndex > 0) {
            setCurrentStepIndex((prev) => prev - 1);
        }
    };

    const StepIcon = currentStep.icon;

    // Count up values for Modal
    const expCount = useCountUp(60, showRewardModal);
    const goldCount = useCountUp(60, showRewardModal);
    const erpCount = useCountUp(35, showRewardModal);

    const modalRewards: RewardItem[] = [
        {
            label: 'EXP',
            value: expCount,
            icon: '/images/exp.webp',
            color: '#93c5fd',
            glowColor: 'rgba(59,130,246,0.45)',
        },
        {
            label: 'GOLD',
            value: goldCount,
            icon: '/images/gold.webp',
            color: '#fbbf24',
            glowColor: 'rgba(251,191,36,0.45)',
        },
        {
            label: 'ERP',
            value: erpCount,
            icon: '/images/erp.webp',
            color: '#c084fc',
            glowColor: 'rgba(192,132,252,0.45)',
        },
    ];

    // ============================================================
    // POSITIONING CONTROLLER (EDIT BREAKPOINT POSITIONS HERE)
    // ============================================================

    // 1. HERO CHARACTER POSITION & HEIGHT (waist-up, behind bottomnav)
    const heroBottomClass = isMobileLandscape
        ? '-bottom-[35px]'
        : '-bottom-[65px] xs:-bottom-[75px] sm:-bottom-[90px] md:-bottom-[85px] lg:-bottom-[180px] xl:-bottom-[230px] 2xl:-bottom-[270px]';

    const heroHeightClass = isMobileLandscape
        ? 'h-[270px]'
        : 'h-[285px] xs:h-[310px] sm:h-[340px] md:h-[320px] lg:h-[600px] xl:h-[720px] 2xl:h-[820px]';

    const heroLeftClass = isMobileLandscape
        ? 'left-[5px]'
        : 'left-0 sm:left-2 md:left-0 lg:left-8 xl:left-12 2xl:left-16';

    // 2. WELCOME SPEECH BUBBLE (TOP-RIGHT ABOVE HEAD)
    const welcomeBubbleClass = isMobileLandscape
        ? 'absolute bottom-[235px] left-[130px] w-[230px] z-50 pointer-events-auto animate-fadeIn'
        : 'absolute bottom-[270px] xs:bottom-[300px] sm:bottom-[340px] md:bottom-[290px] lg:bottom-[470px] xl:bottom-[550px] 2xl:bottom-[556px] left-[25px] xs:left-[35px] sm:left-[100px] md:left-[90px] lg:left-[230px] xl:left-[350px] 2xl:left-[420px] z-50 w-[calc(100vw-50px)] max-w-[200px] xs:max-w-[220px] sm:max-w-none sm:w-[260px] md:w-[220px] lg:w-[340px] xl:w-[380px] 2xl:w-[340px] pointer-events-auto animate-fadeIn';

    // 3. MAIN EXPLANATION CARD (SPEECH BUBBLE 2)
    const mainCardClass = isMobileLandscape
        ? 'absolute bottom-[85px] left-[350px] w-[250px] z-50 pointer-events-auto animate-fadeIn'
        : 'absolute bottom-[75px] xs:bottom-[80px] sm:bottom-[90px] md:bottom-[105px] lg:bottom-[200px] xl:bottom-[280px] 2xl:bottom-[310px] left-[145px] xs:left-[165px] sm:left-[205px] md:left-[210px] lg:left-[340px] xl:left-[460px] 2xl:left-[520px] z-50 w-[calc(100vw-155px)] xs:w-[calc(100vw-175px)] max-w-[190px] xs:max-w-[205px] sm:max-w-none sm:w-[250px] md:w-[250px] lg:w-[360px] xl:w-[380px] 2xl:w-[410px] pointer-events-auto animate-fadeIn';

    // 4. REWARDS INFO PANEL (RIGHT SIDE - VISIBLE ON MOBILE LANDSCAPE, MD, LG, XL, 2XL)
    const rewardsCardClass = isMobileLandscape
        ? 'flex absolute bottom-[85px] left-[620px] w-[115px] z-50 flex-col items-center gap-1.5 shrink-0 pointer-events-auto animate-fadeIn'
        : 'hidden md:flex absolute md:bottom-[105px] lg:bottom-[190px] xl:bottom-[270px] 2xl:bottom-[300px] md:left-[560px] lg:left-[720px] xl:left-[920px] 2xl:left-[1050px] z-50 flex-col items-center gap-2 md:gap-2.5 lg:gap-3 md:w-[120px] lg:w-[150px] xl:w-[176px] 2xl:w-[190px] shrink-0 pointer-events-auto animate-fadeIn';

    // 5. TREASURE TRAIL SVG POSITION & WIDTH
    const svgTrailClass = isMobileLandscape
        ? 'absolute top-1/2 -translate-y-1/2 -left-[53.5px] w-[53.5px] h-[30px] pointer-events-none overflow-visible z-10'
        : 'absolute top-1/2 -translate-y-1/2 md:-left-[132px] md:w-[132px] lg:-left-[67px] lg:w-[67px] xl:-left-[132px] xl:w-[132px] 2xl:-left-[179px] 2xl:w-[179px] h-[35px] pointer-events-none overflow-visible z-10';

    // 6. BACKLIGHT GLOW POSITION & SIZE
    const glowClass = isMobileLandscape
        ? 'absolute -bottom-[10px] -left-[10px] w-[160px] h-[160px] bg-gradient-to-tr from-blue-900/50 via-indigo-900/40 to-transparent rounded-full blur-[50px] pointer-events-none z-10'
        : 'absolute -bottom-[20%] left-[-10%] w-[200px] xs:w-[220px] sm:w-[350px] md:w-[320px] lg:w-[640px] h-[200px] xs:h-[220px] sm:h-[350px] md:h-[320px] lg:h-[640px] bg-gradient-to-tr from-blue-900/50 via-indigo-900/40 to-transparent rounded-full blur-[70px] sm:blur-[100px] pointer-events-none z-10';

    return (
        <div className="fixed inset-0 z-40 overflow-hidden pointer-events-none">
            {/* Backdrop Dimmer Overlay (No blur, dimmed color overlay, doesn't block bottomnav) */}
            <div className="absolute top-0 right-0 left-0 bottom-[44px] md:bottom-[64px] lg:bottom-[80px] bg-[#020202]/65 z-10 pointer-events-auto" />

            {/* Discreet Skip Button (Pill badge minimalis & discreet) */}
            <button
                onClick={() => finishTour(false)}
                disabled={isSubmitting}
                className="absolute top-3.5 right-3.5 md:top-4 md:right-4 z-50 flex cursor-pointer items-center gap-1.5 bg-slate-950/40 hover:bg-slate-900/80 border border-slate-800/40 hover:border-slate-700/70 rounded-full px-2.5 py-1 md:px-3 md:py-1 font-['Orbitron'] text-[9.5px] md:text-xs font-medium text-slate-400/60 hover:text-slate-200 transition-all duration-300 opacity-50 hover:opacity-100 pointer-events-auto backdrop-blur-xs select-none"
                title="Lewati Panduan"
            >
                <span className="hidden xs:inline">Lewati Panduan</span>
                <span className="xs:hidden">Lewati</span>
                <X size={12} className="opacity-70" />
            </button>

            {/* Ambient Radial Backlight Glow behind Hero */}
            <div className={glowClass} />

            {/* 1. STANDALONE CHARACTER: Zoomed Upper-Body (Waist-Up / dari perut ke atas) positioned behind BottomNav */}
            <img
                src={character.avatar}
                className={`absolute ${heroBottomClass} ${heroLeftClass} ${heroHeightClass} z-30 w-auto object-contain drop-shadow-[0_0_10px_rgba(30,58,138,1)] drop-shadow-[0_0_6px_rgba(15,23,42,1)] select-none pointer-events-none`}
                alt={`${character.name} Onboarding Guide`}
            />

            {/* 2. WELCOME SPEECH BUBBLE (Floats above Hero's head and offset to the right) */}
            <div className={welcomeBubbleClass}>
                <div className="relative w-full">
                    <div className="relative w-full bg-gradient-to-b from-[#0b0903]/95 to-[#070b24]/95 backdrop-blur-sm border border-[#3B28F6]/40 rounded-2xl p-2 xs:p-2.5 sm:p-3 md:p-2.5 lg:p-4 shadow-[0_0_15px_-3px_rgba(59,40,246,0.5)] text-slate-100 select-none">
                        {/* Top accent line */}
                        <div className="absolute top-0 left-3 right-3 h-px bg-gradient-to-r from-transparent via-amber-400/70 to-transparent" />
                        <h4 className="font-['Orbitron'] font-extrabold text-[7.5px] xs:text-[8px] sm:text-[10px] md:text-[9px] lg:text-xs text-amber-400 mb-0.5 sm:mb-1 uppercase tracking-wider flex items-center gap-1">
                            <span className="inline-block h-1 w-1 rounded-full bg-amber-400 shadow-[0_0_6px_2px_rgba(251,191,36,0.7)] animate-pulse" />
                            LEVEL UP YOUR LIFE! ✨
                        </h4>
                        <p className="text-[8px] xs:text-[8.5px] sm:text-[9.5px] md:text-[9.5px] lg:text-[11px] leading-relaxed text-slate-300 font-['Outfit',sans-serif]">
                            Aku <span className="font-semibold text-[#7c6bff]">{character.name}</span>, pemandu pribadimu! Aku akan memandumu di Ventura ini langkah demi langkah untuk menjadi <span className="font-semibold text-amber-300">Master sejati</span>!
                        </p>
                    </div>
                    {/* Pointer pointing down-left to the Hero's head */}
                    <div className="absolute -bottom-1.5 left-6 xs:left-8 md:left-10 lg:left-14 h-3 sm:h-3.5 w-3 sm:w-3.5 rotate-45 border-r border-b border-[#3B28F6]/40 bg-[#070b24]" />
                </div>
            </div>

            {/* 3. MAIN EXPLANATION CARD (Positioned lower, next to shoulder/chest, further right) */}
            <div className={mainCardClass}>
                <div className="relative rounded-2xl border border-[#3B28F6]/40 bg-gradient-to-b from-[#0b0903]/95 to-[#070b24]/95 backdrop-blur-sm p-2.5 xs:p-3 sm:p-4 md:p-3.5 lg:p-6 text-slate-200 shadow-[0_0_15px_-3px_rgba(59,40,246,0.5)]">

                    {/* Top accent line */}
                    <div className="absolute top-0 left-4 right-4 h-px bg-gradient-to-r from-transparent via-amber-400/70 to-transparent" />

                    {/* Mobile Portrait Rewards Badge (Shown inside Speech Bubble 2 only for Mobile Portrait users) */}
                    {!isMobileLandscape && (
                        <div className="md:hidden mb-1.5 bg-amber-500/10 border border-amber-500/30 rounded-lg px-1.5 py-0.5 text-[7.5px] xs:text-[8px] font-['Orbitron'] font-extrabold text-amber-400 flex items-center justify-center gap-1 animate-pulse">
                            <Gift size={10} />
                            <span>Hadiah Awal: Klaim +60 EXP | +60 Gold | +35 ERP saat Selesai!</span>
                        </div>
                    )}

                    {/* Header: Title and Icon */}
                    <div className="flex items-center gap-1.5 sm:gap-2 mb-1.5 sm:mb-2.5 md:mb-1.5 lg:mb-3">
                        <StepIcon className="h-3.5 w-3.5 sm:h-3.5 sm:w-3.5 md:h-3.5 md:w-3.5 lg:h-5 lg:w-5 text-amber-400" />
                        <h3 className="font-['Orbitron'] text-[8px] xs:text-[9px] sm:text-[11px] md:text-[11px] lg:text-sm font-black tracking-widest text-[#0A84FF] uppercase">
                            {currentStep.title}
                        </h3>
                    </div>

                    {/* Content: Description with Typewriter */}
                    <div className="min-h-[42px] xs:min-h-[48px] sm:min-h-[60px] md:min-h-[55px] lg:min-h-[85px] flex flex-col justify-start">
                        <p className="font-sans text-[8.5px] xs:text-[9px] sm:text-[11px] md:text-[11px] lg:text-sm font-medium leading-relaxed text-slate-300">
                            {displayText}
                            {isTyping && (
                                <span className="animate-pulse font-bold text-amber-400">|</span>
                            )}
                        </p>
                    </div>

                    {/* Footer: Action Buttons (Kembali & Lanjut) */}
                    <div className="flex items-center justify-between mt-2 sm:mt-3 md:mt-2.5 lg:mt-4 pt-2 sm:pt-2 md:pt-2 lg:pt-3 border-t border-[#3B28F6]/20">
                        {/* Back Button */}
                        {currentStepIndex > 0 ? (
                            <button
                                onClick={handleBack}
                                disabled={isSubmitting}
                                className="inline-flex cursor-pointer items-center gap-0.5 sm:gap-1 font-['Orbitron'] text-[7.5px] xs:text-[8px] sm:text-[9.5px] md:text-[9.5px] lg:text-xs font-bold text-[#0A84FF] hover:underline transition duration-300 disabled:opacity-50"
                            >
                                <ChevronLeft size={10} />
                                <span>Kembali</span>
                            </button>
                        ) : (
                            <div className="w-8 h-5" /> /* placeholder to preserve alignment */
                        )}

                        {/* Next / Finish Button */}
                        <button
                            onClick={handleNext}
                            disabled={isSubmitting}
                            className="inline-flex cursor-pointer items-center gap-1 rounded-lg bg-gradient-to-r from-indigo-600 to-[#0A84FF] px-2 py-0.5 xs:px-2.5 xs:py-1 sm:px-3 sm:py-1 font-['Orbitron'] text-[7.5px] xs:text-[8px] sm:text-[9.5px] md:text-[9.5px] lg:text-xs font-bold text-[#FFFFFF] shadow-md transition duration-300 hover:scale-105 active:scale-95 disabled:opacity-50"
                        >
                            <span>
                                {currentStepIndex === steps.length - 1 ? 'Selesai' : 'Lanjut'}
                            </span>
                            {currentStepIndex === steps.length - 1 ? (
                                <Sparkles size={10} className="animate-pulse text-amber-300" />
                            ) : (
                                <ChevronRight size={10} />
                            )}
                        </button>
                    </div>

                    {/* Pointer pointing left to the Hero's arm/shoulder */}
                    <div className="absolute top-[25%] -left-1.5 sm:-left-2 h-3 sm:h-3.5 w-3 sm:w-3.5 rotate-45 border-b border-l border-[#3B28F6]/40 bg-[#0a0912]" />
                </div>
            </div>

            {/* 4. RIGHT SIDE: Rewards Info Card (Visible on Mobile Landscape, md, lg, xl, 2xl) */}
            <div className={rewardsCardClass}>
                {/* Reward Notification Card */}
                <div className="relative w-full rounded-2xl border border-amber-400/50 bg-gradient-to-b from-[#0b0903]/95 to-[#070b24]/95 p-3.5 md:p-2.5 lg:p-3.5 xl:p-4 text-slate-200 shadow-[0_0_20px_rgba(245,158,11,0.2)] select-none">
                    {/* Icon Badge at Top-Left */}
                    <div className="absolute -top-4 -left-4 flex items-center justify-center w-9 h-9 md:w-7 md:h-7 lg:w-9 lg:h-9 xl:w-10 xl:h-10">
                        <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-[0_0_8px_rgba(245,158,11,0.7)]">
                            {/* Circuit trace lines */}
                            <line x1="0" y1="50" x2="22" y2="50" stroke="#f59e0b" strokeWidth="3" />
                            <circle cx="0" cy="50" r="3" fill="#f59e0b" />
                            <line x1="78" y1="50" x2="100" y2="50" stroke="#f59e0b" strokeWidth="3" />
                            <circle cx="100" cy="50" r="3" fill="#f59e0b" />
                            <line x1="50" y1="78" x2="50" y2="100" stroke="#f59e0b" strokeWidth="3" />
                            <circle cx="50" cy="100" r="3" fill="#f59e0b" />

                            {/* Background circle */}
                            <circle cx="50" cy="50" r="30" fill="#0b0903" stroke="#f59e0b" strokeWidth="2.5" />
                            {/* Inner ring */}
                            <circle cx="50" cy="50" r="20" fill="none" stroke="#f59e0b" strokeWidth="2" />
                            {/* Crosshair */}
                            <line x1="50" y1="24" x2="50" y2="34" stroke="#f59e0b" strokeWidth="2.5" />
                            <line x1="50" y1="66" x2="50" y2="76" stroke="#f59e0b" strokeWidth="2.5" />
                            <line x1="24" y1="50" x2="34" y2="50" stroke="#f59e0b" strokeWidth="2.5" />
                            <line x1="66" y1="50" x2="76" y2="50" stroke="#f59e0b" strokeWidth="2.5" />
                            {/* Center dot */}
                            <circle cx="50" cy="50" r="3.5" fill="#f59e0b" />
                        </svg>
                    </div>
                    <h4 className="font-['Orbitron'] text-[8px] md:text-[7.5px] lg:text-[8px] xl:text-[9px] font-extrabold text-amber-400 uppercase tracking-wider pt-1 mb-1">
                        Reward Menunggu
                    </h4>
                    <p className="text-[9.5px] md:text-[8.5px] lg:text-[9.5px] xl:text-[11px] font-sans font-medium leading-relaxed text-slate-300">
                        Ikuti setiap langkah panduanku untuk membuka <span className="font-extrabold text-amber-400">semua fitur dan hadiah!</span>
                    </p>
                </div>

               {/* Vertical Path connecting Reward Card to Hexagon */}
                <div className="flex flex-col items-center relative my-1">
                    <div className="w-0.5 h-5 xl:h-6 border-r-2 border-dashed border-[#3B28F6]/40" />

                    {/* Hexagon Gift Box Container */}
                    <div className="relative flex items-center justify-center w-14 h-14 xl:w-18 xl:h-18 shrink-0">

                        {/* SVG Winding Trail connecting Main Card Right Border to Hexagon Gift Box Left Border */}
                        <svg
                            viewBox="0 0 100 40"
                            preserveAspectRatio="none"
                            className={svgTrailClass}
                        >
                            <path
                                d="M 0 20 C 25 40, 45 -10, 75 35 S 90 40, 100 20"
                                fill="none"
                                stroke="#f59e0b"
                                strokeWidth="2.5"
                                strokeDasharray="4 4"
                                className="opacity-80"
                            />
                            
                        </svg>

                        {/* Static Shine Stars around Hexagon */}
                        <svg viewBox="0 0 8 8" className="absolute -top-2 -left-3 w-2.5 h-2.5 xl:w-3 xl:h-3 fill-amber-400 drop-shadow-[0_0_5px_rgba(245,158,11,0.9)]">
                            <path d="M4 0 L4.9 3.1 L8 4 L4.9 4.9 L4 8 L3.1 4.9 L0 4 L3.1 3.1 Z" />
                        </svg>
                        <svg viewBox="0 0 8 8" className="absolute top-1 -right-3 w-2 h-2 xl:w-2.5 xl:h-2.5 fill-amber-400 drop-shadow-[0_0_5px_rgba(245,158,11,0.9)]">
                            <path d="M4 0 L4.9 3.1 L8 4 L4.9 4.9 L4 8 L3.1 4.9 L0 4 L3.1 3.1 Z" />
                        </svg>
                        <svg viewBox="0 0 8 8" className="absolute -bottom-2 -right-1 w-2.5 h-2.5 xl:w-3 xl:h-3 fill-amber-400 drop-shadow-[0_0_5px_rgba(245,158,11,0.9)]">
                            <path d="M4 0 L4.9 3.1 L8 4 L4.9 4.9 L4 8 L3.1 4.9 L0 4 L3.1 3.1 Z" />
                        </svg>

                        {/* Hexagon Shape - Alternating Yellow/Blue Neon Border */}
                        <svg viewBox="0 0 100 100" className="absolute inset-0 w-full h-full overflow-visible drop-shadow-[0_0_10px_rgba(59,40,246,0.6)]">
                            <polygon
                                points="50,3 92,26.5 92,73.5 50,97 8,73.5 8,26.5"
                                fill="none"
                                stroke="#f59e0b"
                                strokeWidth="4"
                                strokeDasharray="14 14"
                                strokeLinecap="round"
                            />
                            <polygon
                                points="50,3 92,26.5 92,73.5 50,97 8,73.5 8,26.5"
                                fill="none"
                                stroke="#3B28F6"
                                strokeWidth="4"
                                strokeDasharray="14 14"
                                strokeDashoffset="14"
                                strokeLinecap="round"
                            />
                        </svg>
                        <div
                            className="absolute inset-[6px] bg-gradient-to-b from-[#0b0903]/95 to-[#070b24]/95 flex items-center justify-center"
                            style={{ clipPath: 'polygon(50% 0%, 93% 25%, 93% 75%, 50% 100%, 7% 75%, 7% 25%)' }}
                        >
                            <Gift className="w-6 h-6 xl:w-8 xl:h-8 text-[#9d8fff] drop-shadow-[0_0_14px_rgba(157,143,255,1)]" strokeWidth={1.75} />
                        </div>
                    </div>
                </div>
            </div>,

            {/* 5. REWARD COMPLETION MODAL (Shows when tour is completed) */}
            <AnimatePresence>
                {showRewardModal && (
                    <>
                        {/* Backdrop */}
                        <motion.div
                            key="reward-backdrop"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 z-50 bg-[#000514]/85 backdrop-blur-md pointer-events-auto"
                        />

                        {/* Modal Container */}
                        <motion.div
                            key="reward-modal"
                            initial={{ opacity: 0, scale: 0.75, y: 50 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.75, y: 50 }}
                            transition={{ type: 'spring', stiffness: 140, damping: 16 }}
                            className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-auto"
                        >
                            <div
                                className="relative w-full max-w-md overflow-hidden rounded-2xl p-6 sm:p-8 text-center text-slate-100 shadow-2xl"
                                style={{
                                    background: 'linear-gradient(160deg, #060d1f 0%, #080f22 50%, #040a18 100%)',
                                    border: '2px solid #3B28F6',
                                    boxShadow: '0 0 0 1px rgba(59,40,246,0.2), 0 0 40px rgba(59,40,246,0.5), inset 0 1px 0 rgba(96,165,250,0.1)',
                                }}
                            >
                                {/* Header Title */}
                                <div className="mb-2">
                                    <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 mb-3 animate-bounce">
                                        <Gift size={24} />
                                    </div>
                                    <h2
                                        className="text-xl sm:text-2xl font-black tracking-widest text-amber-400 uppercase"
                                        style={{ fontFamily: "'Orbitron', sans-serif" }}
                                    >
                                        PANDUAN SELESAI! ✨
                                    </h2>
                                    <p className="mt-1 text-xs text-slate-300 font-sans">
                                        Selamat! Kamu telah menyelesaikan seluruh Onboarding Tour dan berhak mengklaim hadiah awalmu:
                                    </p>
                                </div>

                                {/* Divider */}
                                <div className="my-4 flex items-center justify-center gap-2">
                                    <div className="h-px flex-1 bg-gradient-to-r from-transparent via-[#3b82f6]/60 to-transparent" />
                                    <div className="h-2 w-2 rotate-45 bg-[#3b82f6]/60" />
                                    <div className="h-px flex-1 bg-gradient-to-r from-transparent via-[#3b82f6]/60 to-transparent" />
                                </div>

                                {/* Reward Items Grid */}
                                <div className="my-5 flex flex-col gap-2.5">
                                    {modalRewards.map((item, idx) => (
                                        <motion.div
                                            key={item.label}
                                            initial={{ opacity: 0, x: -20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: 0.1 + idx * 0.1 }}
                                            className="relative flex items-center justify-between px-4 py-3 rounded-xl border border-slate-800 bg-[#070e24]/90"
                                        >
                                            <div className="flex items-center gap-3">
                                                <div
                                                    className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-900"
                                                    style={{
                                                        border: '1px solid rgba(234,179,8,0.3)',
                                                        boxShadow: `0 0 10px ${item.glowColor}`,
                                                    }}
                                                >
                                                    <img
                                                        src={item.icon}
                                                        alt={item.label}
                                                        className="h-6 w-6 object-contain"
                                                    />
                                                </div>
                                                <span
                                                    className="text-xs font-bold tracking-widest text-slate-200 uppercase"
                                                    style={{ fontFamily: "'Orbitron', sans-serif" }}
                                                >
                                                    {item.label}
                                                </span>
                                            </div>

                                            <span
                                                className="text-xl font-black"
                                                style={{
                                                    fontFamily: "'Orbitron', sans-serif",
                                                    color: item.color,
                                                    textShadow: `0 0 8px ${item.glowColor}`,
                                                }}
                                            >
                                                +{item.value}
                                            </span>
                                        </motion.div>
                                    ))}
                                </div>

                                {/* Claim Reward Action Button */}
                                <motion.button
                                    whileHover={{ scale: 1.04 }}
                                    whileTap={{ scale: 0.96 }}
                                    onClick={() => finishTour(true)}
                                    disabled={isSubmitting}
                                    className="w-full mt-2 cursor-pointer rounded-xl bg-gradient-to-r from-indigo-600 via-blue-600 to-indigo-600 py-3.5 font-['Orbitron'] text-xs sm:text-sm font-black tracking-widest text-white uppercase shadow-lg shadow-indigo-600/40 hover:shadow-indigo-500/60 transition duration-300 flex items-center justify-center gap-2"
                                >
                                    <CheckCircle2 size={16} />
                                    <span>KLAIM HADIAH & SELESAI</span>
                                </motion.button>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </div>
    );
}
