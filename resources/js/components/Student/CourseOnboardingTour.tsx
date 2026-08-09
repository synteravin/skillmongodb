import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    BookOpen,
    AlertOctagon,
    HelpCircle,
    GraduationCap,
} from 'lucide-react';

interface CourseOnboardingTourProps {
    character: {
        name: string;
        avatar: string;
    };
    phase: 'intro' | 'warning' | 'learn' | 'quiz';
    onClose: () => void;
}

interface Step {
    title: string;
    icon: React.ElementType;
    message: string;
}

export default function CourseOnboardingTour({
    character,
    phase,
    onClose,
}: CourseOnboardingTourProps) {
    const [currentStepIndex, setCurrentStepIndex] = useState(0);
    const [displayText, setDisplayText] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const [isMobileLandscape, setIsMobileLandscape] = useState(false);

    const introSteps: Step[] = [
        {
            title: 'MEMILIH STRATEGI',
            icon: BookOpen,
            message:
                'Selamat datang di gerbang pembelajaran! Di sini kamu bebas memilih ilmu (course) yang ingin kamu kuasai demi karir impianmu.',
        },
        {
            title: 'REKOMENDASI KAMI',
            icon: GraduationCap,
            message:
                'Kami sangat menyarankan untuk mengambil course tingkat pemula terlebih dahulu jika kamu baru memulai petualangan ini.',
        },
        {
            title: 'ANALISA KURSUS',
            icon: HelpCircle,
            message:
                'Silakan klik salah satu kartu course di bawah ini untuk melihat detail modul, format pembelajaran, dan materi yang akan didapatkan.',
        },
    ];

    const warningSteps: Step[] = [
        {
            title: 'PERINGATAN SISTEM ⚠️',
            icon: AlertOctagon,
            message:
                'Tunggu sebentar! Pilihlah dengan bijak. Setelah kamu menekan tombol Confirm, sistem akan mengunci pilihanmu.',
        },
        {
            title: 'SELESAIKAN MISI',
            icon: AlertOctagon,
            message:
                'Kamu wajib menyelesaikan seluruh modul dan quiz pada course ini sampai akhir sebelum diizinkan mengambil course lainnya!',
        },
    ];

    const learnSteps: Step[] = [
        {
            title: 'BELAJAR MANDIRI 📖',
            icon: BookOpen,
            message:
                'Selamat datang di ruang belajar! Di sinilah tempat kamu menuntut ilmu. Bacalah setiap materi yang disediakan dengan seksama.',
        },
        {
            title: 'TANDAI SELESAI 🌟',
            icon: GraduationCap,
            message:
                'Jika sudah selesai mempelajari materi di modul ini, klik tombol "Tandai Selesai" untuk menyimpan progres belajarmu.',
        },
        {
            title: 'QUIZ AKHIR ⚔️',
            icon: HelpCircle,
            message:
                'Selesaikan semua modul untuk membuka Ujian/Quiz Akhir. Jawab dengan benar untuk menaikkan level dan mendapatkan reputasi!',
        },
    ];

    const quizSteps: Step[] = [
        {
            title: 'UJIAN AKHIR 🛡️',
            icon: BookOpen,
            message:
                'Ini adalah Ujian Akhir untuk menguji pemahamanmu. Buktikan kemampuanmu dan selesaikan tantangan ini!',
        },
        {
            title: 'FOKUS & TELITI 🧠',
            icon: AlertOctagon,
            message:
                'Baca pertanyaan dengan saksama dan pilih jawaban yang menurutmu paling tepat. Semoga sukses, Master!',
        },
    ];

    const steps =
        phase === 'intro'
            ? introSteps
            : phase === 'warning'
              ? warningSteps
              : phase === 'learn'
                ? learnSteps
                : quizSteps;

    const currentStep = steps[currentStepIndex];

    // Detect mobile landscape orientation
    useEffect(() => {
        const handleResize = () => {
            setIsMobileLandscape(
                window.innerHeight < 500 &&
                    window.innerWidth > window.innerHeight,
            );
        };
        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // Typewriter effect
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
        }, 12);

        return () => clearInterval(interval);
    }, [currentStepIndex, phase]);

    const handleNext = () => {
        if (currentStepIndex < steps.length - 1) {
            setCurrentStepIndex((prev) => prev + 1);
        } else {
            onClose();
        }
    };

    const handleScreenClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (isTyping) {
            // Speed up: show full message instantly
            setIsTyping(false);
            setDisplayText(currentStep.message);
        } else {
            handleNext();
        }
    };

    const StepIcon = currentStep.icon;

    // Responsive Positioning
    const heroBottomClass = isMobileLandscape
        ? '-bottom-[35px]'
        : '-bottom-[65px] xs:-bottom-[75px] sm:-bottom-[90px] md:-bottom-[85px] lg:-bottom-[180px] xl:-bottom-[230px] 2xl:-bottom-[270px]';

    const heroHeightClass = isMobileLandscape
        ? 'h-[270px]'
        : 'h-[285px] xs:h-[310px] sm:h-[340px] md:h-[320px] lg:h-[600px] xl:h-[720px] 2xl:h-[820px]';

    const heroLeftClass = isMobileLandscape
        ? 'left-[5px]'
        : 'left-0 sm:left-2 md:left-0 lg:left-8 xl:left-12 2xl:left-16';

    const welcomeBubbleClass = isMobileLandscape
        ? 'absolute bottom-[235px] left-[130px] w-[230px] z-50 pointer-events-auto animate-fadeIn'
        : 'absolute bottom-[270px] xs:bottom-[300px] sm:bottom-[340px] md:bottom-[290px] lg:bottom-[470px] xl:bottom-[550px] 2xl:bottom-[556px] left-[25px] xs:left-[35px] sm:left-[100px] md:left-[90px] lg:left-[230px] xl:left-[350px] 2xl:left-[420px] z-50 w-[calc(100vw-50px)] max-w-[200px] xs:max-w-[220px] sm:max-w-none sm:w-[260px] md:w-[220px] lg:w-[340px] xl:w-[380px] 2xl:w-[340px] pointer-events-auto animate-fadeIn';

    const mainCardClass = isMobileLandscape
        ? 'absolute bottom-[85px] left-[350px] w-[250px] z-50 pointer-events-auto animate-fadeIn'
        : 'absolute bottom-[75px] xs:bottom-[80px] sm:bottom-[90px] md:bottom-[105px] lg:bottom-[200px] xl:bottom-[280px] 2xl:bottom-[310px] left-[145px] xs:left-[165px] sm:left-[205px] md:left-[210px] lg:left-[340px] xl:left-[460px] 2xl:left-[520px] z-50 w-[calc(100vw-155px)] xs:w-[calc(100vw-175px)] max-w-[190px] xs:max-w-[205px] sm:max-w-none sm:w-[250px] md:w-[250px] lg:w-[360px] xl:w-[380px] 2xl:w-[410px] pointer-events-auto animate-fadeIn';

    const glowClass = isMobileLandscape
        ? 'absolute -bottom-[10px] -left-[10px] w-[160px] h-[160px] bg-gradient-to-tr from-blue-900/50 via-indigo-900/40 to-transparent rounded-full blur-[50px] pointer-events-none z-10'
        : 'absolute -bottom-[20%] left-[-10%] w-[200px] xs:w-[220px] sm:w-[350px] md:w-[320px] lg:w-[640px] h-[200px] xs:h-[220px] sm:h-[350px] md:h-[320px] lg:h-[640px] bg-gradient-to-tr from-blue-900/50 via-indigo-900/40 to-transparent rounded-full blur-[70px] sm:blur-[100px] pointer-events-none z-10';

    return (
        <div
            onClick={handleScreenClick}
            className="pointer-events-auto fixed inset-0 z-[120] cursor-pointer overflow-hidden bg-[#020202]/70"
        >
            {/* Ambient Radial Backlight Glow behind Hero */}
            <div className={glowClass} />

            {/* 1. HERO CHARACTER */}
            <img
                src={character.avatar}
                className={`absolute ${heroBottomClass} ${heroLeftClass} ${heroHeightClass} pointer-events-none z-30 w-auto object-contain drop-shadow-[0_0_6px_rgba(15,23,42,1)] drop-shadow-[0_0_10px_rgba(30,58,138,1)] select-none`}
                alt={`${character.name} Onboarding Guide`}
            />

            {/* 3. MAIN EXPLANATION CARD (No navigation buttons, click to continue) */}
            <div className={mainCardClass}>
                <div className="xs:p-3 relative rounded-2xl border border-[#3B28F6]/40 bg-gradient-to-b from-[#0b0903]/95 to-[#070b24]/95 p-2.5 text-slate-200 shadow-[0_0_15px_-3px_rgba(59,40,246,0.5)] backdrop-blur-sm sm:p-4 md:p-3.5 lg:p-6">
                    {/* Top accent line */}
                    <div className="absolute top-0 right-4 left-4 h-px bg-gradient-to-r from-transparent via-amber-400/70 to-transparent" />

                    {/* Header: Title and Icon */}
                    <div className="mb-1.5 flex items-center gap-1.5 sm:mb-2.5 sm:gap-2 md:mb-1.5 lg:mb-3">
                        <StepIcon className="h-3.5 w-3.5 text-amber-400 sm:h-3.5 sm:w-3.5 md:h-3.5 md:w-3.5 lg:h-5 lg:w-5" />
                        <h3 className="xs:text-[9px] font-['Orbitron'] text-[8px] font-black tracking-widest text-[#0A84FF] uppercase sm:text-[11px] md:text-[11px] lg:text-sm">
                            {currentStep.title}
                        </h3>
                    </div>

                    {/* Content: Description with Typewriter */}
                    <div className="xs:min-h-[48px] flex min-h-[42px] flex-col justify-start sm:min-h-[60px] md:min-h-[55px] lg:min-h-[85px]">
                        <p className="xs:text-[9px] font-sans text-[8.5px] leading-relaxed font-medium text-slate-300 sm:text-[11px] md:text-[11px] lg:text-sm">
                            {displayText}
                            {isTyping && (
                                <span className="animate-pulse font-bold text-amber-400">
                                    |
                                </span>
                            )}
                        </p>
                    </div>

                    {/* Pointer pointing left to the Hero's arm/shoulder */}
                    <div className="absolute top-[25%] -left-1.5 h-3 w-3 rotate-45 border-b border-l border-[#3B28F6]/40 bg-[#0a0912] sm:-left-2 sm:h-3.5 sm:w-3.5" />
                </div>
            </div>
        </div>
    );
}
