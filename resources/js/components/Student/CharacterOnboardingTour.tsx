import React, { useState, useEffect } from 'react';
import { router } from '@inertiajs/react';
import { ChevronRight, Sparkles, Compass, Award, Users, BookOpen, Briefcase, X } from 'lucide-react';
import SpeechBubble from '@/components/SpeechBubble';

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

export default function CharacterOnboardingTour({
    character,
    onStepChange,
    onClose,
}: CharacterOnboardingTourProps) {
    const [currentStepIndex, setCurrentStepIndex] = useState(0);
    const [displayText, setDisplayText] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const steps: Step[] = [
        {
            title: 'MY COURSE',
            targetId: 'nav-item-my-course',
            icon: BookOpen,
            message: `Selamat datang di Skillmongo! Aku ${character.name}, pemandu pribadimu!\nMari mulai dari MY COURSE. Di sini kamu bisa mengakses seluruh jalur pembelajaran, modul, dan kuis untuk meningkatkan Mastery Level serta XP-mu!`,
        },
        {
            title: 'QUEST BOARD',
            targetId: 'nav-item-quest',
            icon: Briefcase,
            message: `Selanjutnya ada QUEST! Tempat kamu mengambil proyek freelance nyata.\nSelesaikan tugas dari pembuat proyek untuk meraih imbalan Gold melimpah dan reputasi ERP!`,
        },
        {
            title: 'TIER LIST',
            targetId: 'nav-item-tier-list',
            icon: Award,
            message: `Di menu TIER LIST, kamu bisa memantau peringkat kompetitifmu dibanding siswa lain.\nTerus kumpulkan ERP untuk menaikkan bintang dan mencapai Rank tertinggi!`,
        },
        {
            title: 'CERTIFICATE',
            targetId: 'nav-item-certificate',
            icon: Compass,
            message: `Semua bukti kelulusan, lisensi keahlian, dan pencapaian resmi yang kamu dapatkan setelah menyelesaikan kursus akan tersimpan secara permanen di CERTIFICATE.`,
        },
        {
            title: 'FORUM KOMUNITAS',
            targetId: 'nav-item-forum',
            icon: Users,
            message: `Terakhir, kunjungi FORUM untuk berdiskusi, bertanya kepada mentor, dan berbagi wawasan dengan sesama kawan.\nSelamat bertualang di Skillmongo!`,
        },
    ];

    const currentStep = steps[currentStepIndex];

    // Notify parent of active step target ID for text lighting
    useEffect(() => {
        if (onStepChange) {
            onStepChange(currentStep.targetId);
        }
    }, [currentStepIndex]);

    // Typewriter effect per step (slice logic ensures 1st character is never lost)
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
        }, 18);

        return () => clearInterval(interval);
    }, [currentStepIndex]);

    const finishTour = () => {
        if (isSubmitting) return;
        setIsSubmitting(true);

        router.post(
            '/student/complete-onboarding',
            {},
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
            finishTour();
        }
    };

    const StepIcon = currentStep.icon;

    return (
        <div className="fixed inset-0 z-40 overflow-hidden pointer-events-auto">
            {/* Backdrop Dimmer Overlay (Friendly for Light & Dark Mode, stops above BottomNav) */}
            <div className="absolute top-0 right-0 left-0 bottom-[44px] md:bottom-[64px] lg:bottom-[80px] bg-slate-900/35 dark:bg-slate-950/70 backdrop-blur-[2px] dark:backdrop-blur-[3px] transition-all duration-300" />

            {/* Left-Side Container: Flex Row with Onboarding Character on LEFT and Dialogue Card on RIGHT */}
            <div className="pointer-events-auto absolute bottom-[55px] sm:bottom-[65px] md:bottom-[75px] left-3 sm:left-6 md:left-8 lg:left-12 z-50 flex items-center gap-3 sm:gap-4">
                {/* 1. Onboarding Character Sprite (Full-height, Left Side) */}
                <img
                    src={character.avatar}
                    className="h-[190px] sm:h-[250px] md:h-[310px] lg:h-[370px] xl:h-[410px] max-h-[calc(100vh-140px)] w-auto shrink-0 object-contain drop-shadow-[0_0_25px_rgba(99,102,241,0.5)]"
                    style={{ animation: 'breathe 3s ease-in-out infinite' }}
                    alt={`${character.name} Onboarding Guide`}
                />

                {/* 2. Onboarding Speech Bubble Dialogue Card (Positioned directly to the RIGHT of character) */}
                <SpeechBubble
                    tailPosition="left"
                    className="animate-fadeIn relative mb-6 sm:mb-10 w-[72vw] max-w-[260px] sm:max-w-[300px] md:max-w-[340px] lg:max-w-[380px] shadow-2xl !p-3 sm:!p-3.5 shrink-0 z-50"
                >
                    <div className="space-y-1.5">
                        {/* Top Header: Step Counter & Skip */}
                        <div className="flex items-center justify-between border-b border-slate-200/60 pb-1 dark:border-slate-800/60">
                            <div className="flex items-center gap-1.5">
                                <span className="flex h-4 w-4 items-center justify-center rounded-full bg-gradient-to-r from-amber-400 to-amber-500 font-['Orbitron'] text-[8px] font-black text-slate-950 shadow-sm">
                                    {currentStepIndex + 1}
                                </span>
                                <span className="font-['Orbitron'] text-[8px] sm:text-[9px] font-extrabold tracking-wider text-slate-500 dark:text-slate-400 uppercase">
                                    Langkah {currentStepIndex + 1} dari {steps.length}
                                </span>
                            </div>

                            <button
                                onClick={finishTour}
                                disabled={isSubmitting}
                                className="flex cursor-pointer items-center gap-0.5 rounded px-1 py-0.2 font-['Orbitron'] text-[8px] sm:text-[9px] font-bold text-slate-400 transition hover:text-red-500 dark:hover:text-red-400"
                                title="Lewati Tur"
                            >
                                <span>Lewati</span>
                                <X size={10} />
                            </button>
                        </div>

                        {/* Title & Typewriter Message (Small, realistic font size) */}
                        <div className="space-y-0.5 min-w-0">
                            <div className="flex items-center gap-1">
                                <StepIcon className="h-3 w-3 text-amber-500 dark:text-amber-400 shrink-0" />
                                <h3 className="font-['Orbitron'] text-[10px] sm:text-[11px] font-extrabold tracking-wide text-indigo-600 dark:text-amber-300 truncate">
                                    {currentStep.title}
                                </h3>
                            </div>

                            <p className="whitespace-pre-line font-medium leading-snug text-[10px] sm:text-[10.5px] text-slate-700 dark:text-slate-200">
                                {displayText}
                                {isTyping && (
                                    <span className="animate-pulse font-bold text-amber-500 dark:text-amber-400">
                                        |
                                    </span>
                                )}
                            </p>
                        </div>

                        {/* Bottom Footer: Step Dots & Next Button */}
                        <div className="flex items-center justify-between border-t border-slate-200/60 pt-1.5 dark:border-slate-800/60">
                            {/* Step Dots */}
                            <div className="flex items-center gap-1">
                                {steps.map((_, idx) => (
                                    <span
                                        key={idx}
                                        className={`h-1 rounded-full transition-all duration-300 ${
                                            idx === currentStepIndex
                                                ? 'w-3.5 bg-gradient-to-r from-amber-400 to-indigo-500'
                                                : 'w-1 bg-slate-300 dark:bg-slate-700'
                                        }`}
                                    />
                                ))}
                            </div>

                            {/* Next Button */}
                            <button
                                onClick={handleNext}
                                disabled={isSubmitting}
                                className="inline-flex cursor-pointer items-center gap-1 rounded-md bg-gradient-to-r from-indigo-600 via-indigo-600 to-indigo-700 px-2.5 py-0.5 font-['Orbitron'] text-[9px] sm:text-[10px] font-bold text-white shadow-sm shadow-indigo-500/20 transition hover:from-indigo-500 hover:to-indigo-600 active:scale-95 disabled:opacity-50"
                            >
                                <span>
                                    {currentStepIndex === steps.length - 1 ? 'Selesai' : 'Lanjut'}
                                </span>
                                {currentStepIndex === steps.length - 1 ? (
                                    <Sparkles size={10} />
                                ) : (
                                    <ChevronRight size={10} />
                                )}
                            </button>
                        </div>
                    </div>
                </SpeechBubble>
            </div>
        </div>
    );
}
