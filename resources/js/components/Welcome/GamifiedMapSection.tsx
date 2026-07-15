import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    BookOpen,
    Play,
    CheckCircle,
    Coins,
    Trophy,
    Users,
    Sword,
    Briefcase,
    ChevronRight,
    ArrowRight,
    Star,
    Compass,
    UserCheck,
    MessageSquare,
    Zap,
    TrendingUp,
    Shield,
    Terminal,
    Brain,
} from 'lucide-react';

/* ============================================================================
   TAB 1: DATA PLATFORM WALKTHROUGH
   ============================================================================ */
interface WalkthroughStep {
    id: number;
    title: string;
    desc: string;
    icon: React.ComponentType<any>;
    reward: string;
    badgeName: string;
    mockType:
        | 'course'
        | 'editor'
        | 'check'
        | 'stats'
        | 'achieve'
        | 'guild'
        | 'quest'
        | 'portfolio';
}

const walkthroughSteps: WalkthroughStep[] = [
    {
        id: 1,
        title: 'Choose a Course',
        desc: 'Pilih jalur spesialisasi belajar Anda mulai dari Frontend, Backend, UI/UX, hingga Blockchain.',
        icon: BookOpen,
        reward: '+50 XP',
        badgeName: 'Novice Selector',
        mockType: 'course',
    },
    {
        id: 2,
        title: 'Start Learning',
        desc: 'Tulis kode pemrograman nyata secara langsung melalui sandbox editor terintegrasi di browser.',
        icon: Play,
        reward: '+100 XP',
        badgeName: 'Code Runner',
        mockType: 'editor',
    },
    {
        id: 3,
        title: 'Complete Lessons',
        desc: 'Kirimkan kode Anda dan dapatkan evaluasi langsung dari mesin penguji otomatis kami.',
        icon: CheckCircle,
        reward: '+150 XP',
        badgeName: 'Lesson Master',
        mockType: 'check',
    },
    {
        id: 4,
        title: 'Earn XP & Gold',
        desc: 'Dapatkan XP untuk menaikkan statistik profil Anda, dan Gold untuk transaksi eksklusif.',
        icon: Coins,
        reward: '+200 Gold',
        badgeName: 'Treasury Collector',
        mockType: 'stats',
    },
    {
        id: 5,
        title: 'Unlock Achievements',
        desc: 'Peroleh lencana pencapaian (badges) langka saat menaklukkan modul yang sulit.',
        icon: Trophy,
        reward: 'Unlock Badge',
        badgeName: 'Achievement Hunter',
        mockType: 'achieve',
    },
    {
        id: 6,
        title: 'Join Community',
        desc: 'Bergabunglah ke dalam Guild dan lobi obrolan sesama developer untuk belajar bersama.',
        icon: Users,
        reward: 'Guild Access',
        badgeName: 'Clan Member',
        mockType: 'guild',
    },
    {
        id: 7,
        title: 'Complete Quests',
        desc: 'Ambil tantangan nyata dari proyek kontributor industri untuk menguji kompetensi lapangan.',
        icon: Sword,
        reward: '+500 XP & Gold',
        badgeName: 'Quest Slayer',
        mockType: 'quest',
    },
    {
        id: 8,
        title: 'Build Portfolio',
        desc: 'Publikasikan seluruh data pengerjaan quest Anda menjadi portofolio terverifikasi siap kerja.',
        icon: Briefcase,
        reward: 'Sertifikat Kerja',
        badgeName: 'Certified Elite',
        mockType: 'portfolio',
    },
];

/* ============================================================================
   TAB 2: DATA SKILL TREE (BEGINNER PATH CONDENSED PREVIEW)
   ============================================================================ */
interface SkillNode {
    title: string;
    subtitle: string;
    locked?: boolean;
    done?: boolean;
}

interface TreeBranch {
    title: string;
    subtitle: string;
    nodes: SkillNode[];
}

const beginnerBranches: TreeBranch[] = [
    {
        title: 'Laravel Fundamentals',
        subtitle: 'Dasar-Dasar Laravel: Memahami Struktur, Routing, dan Blade',
        nodes: [
            {
                title: 'laravel basics',
                subtitle: 'Setup & MVC Layout',
                done: true,
            },
            {
                title: 'routing & views',
                subtitle: 'Blade Templating',
                done: true,
            },
        ],
    },
    {
        title: 'Laravel CRUD Basics',
        subtitle:
            'CRUD Laravel Lengkap: Dari Migrasi, Model, Controller, Hingga Validasi',
        nodes: [
            {
                title: 'data migrations',
                subtitle: 'Database Schemas',
                done: false,
            }, // Available/Active
            {
                title: 'eloquent models',
                subtitle: 'CRUD Operations',
                locked: true,
            },
        ],
    },
    {
        title: 'Laravel Auth & Mid',
        subtitle:
            'Laravel Authentication & Middleware: Membangun Sistem Login Modern',
        nodes: [
            {
                title: 'user session',
                subtitle: 'Auth Controllers',
                locked: true,
            },
            {
                title: 'auth middleware',
                subtitle: 'Route Protection',
                locked: true,
            },
        ],
    },
];

/* ============================================================================
   TAB 3: DATA INSTANT START (ACTION LAUNCHPAD)
   ============================================================================ */
interface ActionLaunchCard {
    title: string;
    desc: string;
    difficulty: 'Beginner Friendly' | 'Intermediate' | 'Advanced';
    duration: string;
    icon: React.ComponentType<any>;
    cta: string;
    color: string;
}

const launchCards: ActionLaunchCard[] = [
    {
        title: 'Start Web Development',
        desc: 'Mulai dari dasar-dasar HTML, CSS, hingga integrasi database MySQL.',
        difficulty: 'Beginner Friendly',
        duration: '12 Hours',
        icon: BookOpen,
        cta: 'Start Now',
        color: 'border-cyan-500/20 hover:border-cyan-500 text-cyan-400 bg-cyan-950/20',
    },
    {
        title: 'Laravel API Master',
        desc: 'Pelajari RESTful API, otentikasi JWT, dan penanganan middleware.',
        difficulty: 'Intermediate',
        duration: '8 Hours',
        icon: Terminal,
        cta: 'Launch Class',
        color: 'border-blue-500/20 hover:border-blue-500 text-blue-400 bg-blue-950/20',
    },
    {
        title: 'Smart Contracts Web3',
        desc: 'Deploy contract Solidity pertama Anda dan integrasikan dengan Metamask.',
        difficulty: 'Advanced',
        duration: '15 Hours',
        icon: Zap,
        cta: 'Enter Arena',
        color: 'border-purple-500/20 hover:border-purple-500 text-purple-400 bg-purple-950/20',
    },
    {
        title: 'Daily Code Sprint',
        desc: 'Selesaikan tantangan harian berhadiah koin emas untuk asah otak konsisten.',
        difficulty: 'Beginner Friendly',
        duration: '30 Mins',
        icon: Sword,
        cta: 'Fight Now',
        color: 'border-emerald-500/20 hover:border-emerald-500 text-emerald-400 bg-emerald-950/20',
    },
    {
        title: 'AI Study Planner',
        desc: 'Gunakan AI untuk merancang modul kurikulum otomatis sesuai minat Anda.',
        difficulty: 'Beginner Friendly',
        duration: '5 Mins',
        icon: Brain,
        cta: 'Generate Plan',
        color: 'border-amber-500/20 hover:border-amber-500 text-amber-400 bg-amber-950/20',
    },
    {
        title: 'Join Open Guild Lobby',
        desc: 'Cari tim belajar aktif dan ajukan bimbingan tatap muka dengan mentor.',
        difficulty: 'Intermediate',
        duration: 'Ongoing',
        icon: Users,
        cta: 'Find Guild',
        color: 'border-rose-500/20 hover:border-rose-500 text-rose-400 bg-rose-950/20',
    },
];

/* ============================================================================
   TAB 4: DATA REAL SIMULATIONS (QUEST MARKETPLACE)
   ============================================================================ */
interface QuestItem {
    title: string;
    reward: string;
    bids: number;
    difficulty: 'Easy' | 'Medium' | 'Hard';
    desc: string;
}

const activeQuests: QuestItem[] = [
    {
        title: 'Web3 NFT Minting Portal',
        reward: '650 Gold + 120 XP',
        bids: 14,
        difficulty: 'Hard',
        desc: 'Membangun antar muka minting dApp terintegrasi web3 provider.',
    },
    {
        title: 'SaaS Multi-Tenant Payment Integration',
        reward: '480 Gold + 90 XP',
        bids: 9,
        difficulty: 'Medium',
        desc: 'Integrasikan gerbang pembayaran dengan webhook notifikasi transaksi.',
    },
    {
        title: 'Realtime Chat Collab Panel',
        reward: '350 Gold + 70 XP',
        bids: 18,
        difficulty: 'Easy',
        desc: 'Implementasikan socket.io untuk fitur obrolan tim di modul kerja.',
    },
];

/* ============================================================================
   COMPONENTS
   ============================================================================ */

// Tiruan Komponen StudentModuleNode dari Roadmap.tsx
function StudentModuleNodeClone({
    title,
    subtitle,
    index,
    locked = false,
    done = false,
}: {
    title: string;
    subtitle: string;
    index: number;
    locked?: boolean;
    done?: boolean;
}) {
    const romanNumerals = ['I', 'II', 'III', 'IV', 'V', 'VI'];
    const roman = romanNumerals[index] || String(index + 1);

    const wrapperBg = done
        ? 'linear-gradient(135deg, #60a5fa, #3b82f6, #93c5fd)'
        : locked
          ? 'linear-gradient(135deg, #cbd5e1, #94a3b8, #cbd5e1)'
          : 'linear-gradient(135deg, #60a5fa, #818cf8, #60a5fa)';

    const wrapperShadow = done
        ? '0 2px 16px rgba(59,130,246,0.25)'
        : locked
          ? 'none'
          : '0 2px 16px rgba(99,102,241,0.2)';

    const innerBg = done
        ? 'linear-gradient(135deg, #0a1f3a 0%, #0d2040 100%)'
        : locked
          ? 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)'
          : 'linear-gradient(135deg, #0f1d40 0%, #0a1530 100%)';

    const badgeContainerBg = locked ? '#1e293b' : '#000000';
    const titleColor = done ? '#93c5fd' : locked ? '#475569' : '#e2e8f0';
    const statusColor = done ? '#60a5fa' : locked ? '#475569' : '#818cf8';
    const statusLabel = done ? 'Completed' : locked ? 'Locked' : 'Available';

    return (
        <div className="relative flex w-full max-w-[280px] flex-col items-center px-1 sm:px-0">
            <div
                className="relative block w-full cursor-pointer p-[2px] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_4px_18px_rgba(99,102,241,0.35)]"
                style={{
                    borderRadius: '14px',
                    background: wrapperBg,
                    boxShadow: wrapperShadow,
                }}
            >
                <div
                    className="flex w-full items-center gap-0 overflow-hidden"
                    style={{
                        borderRadius: '12px',
                        minHeight: '72px',
                        background: innerBg,
                    }}
                >
                    {/* Badge / Icon - flush left */}
                    <div
                        className="relative flex flex-shrink-0 items-center justify-center self-stretch"
                        style={{
                            width: '72px',
                            borderRadius: '10px 0 0 10px',
                            background: badgeContainerBg,
                            overflow: 'hidden',
                        }}
                    >
                        <div
                            className="flex h-12 w-12 items-center justify-center rounded-full"
                            style={{
                                background: locked
                                    ? 'radial-gradient(circle at 35% 35%, #e2e8f0 0%, #94a3b8 60%, #64748b 100%)'
                                    : 'radial-gradient(circle at 35% 35%, #fbbf24 0%, #d97706 60%, #92400e 100%)',
                                boxShadow: locked
                                    ? 'inset 0 2px 4px rgba(255,255,255,0.4), 0 2px 8px rgba(0,0,0,0.15)'
                                    : 'inset 0 2px 4px rgba(255,255,255,0.3), 0 0 14px rgba(251,191,36,0.4)',
                                border: locked
                                    ? '2px solid #cbd5e1'
                                    : '2px solid rgba(251,191,36,0.6)',
                            }}
                        >
                            <span
                                className="text-[13px] font-bold select-none"
                                style={{
                                    fontFamily: 'Orbitron, sans-serif',
                                    color: locked ? '#64748b' : '#fff',
                                }}
                            >
                                {roman}
                            </span>
                        </div>

                        {/* Status Badge pojok kanan bawah */}
                        <div
                            className="absolute right-1.5 bottom-1.5 z-20 flex animate-pulse items-center justify-center"
                            style={{
                                width: '20px',
                                height: '20px',
                                borderRadius: '50%',
                                background: done
                                    ? '#2563eb'
                                    : locked
                                      ? '#94a3b8'
                                      : '#3b82f6',
                                border: done
                                    ? '2px solid #fff'
                                    : locked
                                      ? '2px solid #e2e8f0'
                                      : '2px solid #fff',
                                boxShadow: done
                                    ? '0 0 8px rgba(37,99,235,0.6)'
                                    : locked
                                      ? 'none'
                                      : '0 0 8px rgba(59,130,246,0.5)',
                            }}
                        >
                            {locked ? (
                                <svg
                                    viewBox="0 0 16 16"
                                    fill="white"
                                    className="h-2.5 w-2.5"
                                >
                                    <path d="M11 7V5a3 3 0 1 0-6 0v2H4a1 1 0 0 0-1 1v6a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1V8a1 1 0 0 0-1-1h-1ZM6 5a2 2 0 1 1 4 0v2H6V5Z" />
                                </svg>
                            ) : done ? (
                                <svg
                                    viewBox="0 0 16 16"
                                    fill="none"
                                    stroke="white"
                                    strokeWidth="2.5"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    className="h-2.5 w-2.5"
                                >
                                    <polyline points="2,9 6,13 14,4" />
                                </svg>
                            ) : (
                                <svg
                                    viewBox="0 0 16 16"
                                    fill="none"
                                    stroke="white"
                                    strokeWidth="2.5"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    className="h-2.5 w-2.5"
                                >
                                    <polyline points="5,3 11,8 5,13" />
                                </svg>
                            )}
                        </div>
                    </div>

                    {/* Title + Status Label */}
                    <div className="relative flex flex-1 flex-col justify-center gap-0.5 overflow-hidden px-4 py-2 text-left">
                        <span
                            className="truncate font-['Orbitron'] text-xs leading-snug font-bold md:text-sm"
                            style={{ color: titleColor }}
                        >
                            {title}
                        </span>
                        <span
                            className="truncate font-['Oxanium'] text-[10px] font-semibold md:text-[11px]"
                            style={{ color: statusColor }}
                        >
                            {statusLabel}
                        </span>
                    </div>

                    {/* Right side lock or arrow button */}
                    <div className="flex flex-shrink-0 items-center justify-center pr-4">
                        {locked ? (
                            <svg
                                viewBox="0 0 24 24"
                                fill="none"
                                className="h-5 w-5"
                                style={{ color: statusColor }}
                            >
                                <rect
                                    x="5"
                                    y="11"
                                    width="14"
                                    height="10"
                                    rx="2.5"
                                    fill="currentColor"
                                    fillOpacity="0.15"
                                    stroke="currentColor"
                                    strokeWidth="1.5"
                                />
                                <path
                                    d="M8 11V7a4 4 0 0 1 8 0v4"
                                    stroke="currentColor"
                                    strokeWidth="1.5"
                                    strokeLinecap="round"
                                />
                                <circle
                                    cx="12"
                                    cy="16"
                                    r="1.5"
                                    fill="currentColor"
                                />
                            </svg>
                        ) : (
                            <div
                                className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-full transition-transform hover:scale-105"
                                style={{
                                    background: done ? '#2563eb' : '#4f46e5',
                                    boxShadow: '0 0 10px rgba(59,130,246,0.4)',
                                }}
                            >
                                <svg
                                    viewBox="0 0 16 16"
                                    fill="none"
                                    stroke="white"
                                    strokeWidth="2.5"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    className="h-3.5 w-3.5"
                                >
                                    <polyline points="5,3 11,8 5,13" />
                                </svg>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default function GamifiedMapSection() {
    const [activeTab, setActiveTab] = useState<string>('beginner-path');

    // State khusus untuk Tab 1 (Platform Onboarding Walkthrough)
    const [activeStepId, setActiveStepId] = useState<number>(1);
    const currentStep =
        walkthroughSteps.find((s) => s.id === activeStepId) ||
        walkthroughSteps[0];

    return (
        <section
            id="learn"
            className="relative flex w-full items-center justify-center py-16"
            style={{ backgroundColor: '#ffffff' }}
        >
            {/* Main Gamified Card Container */}
            <div
                className="relative flex min-h-[680px] w-full max-w-6xl flex-col justify-between rounded-3xl p-8 text-white shadow-2xl transition-all duration-300 md:p-12"
                style={{ backgroundColor: '#191D53' }}
            >
                {/* Header */}
                <div className="mb-8 text-center">
                    <h2 className="mb-2 font-['Orbitron'] text-3xl font-black tracking-wide text-white md:text-4xl">
                        Gamified Learning for Every Skill Level
                    </h2>
                    <p className="font-['Oxanium'] text-xs text-slate-300 md:text-sm">
                        Level Up Your Skills Through VENTURA's Gamified Learning
                        Roadmap
                    </p>
                </div>

                {/* Tabs Switcher */}
                <div className="mb-8 flex justify-center border-b border-white/10 pb-4">
                    <div className="flex flex-wrap justify-center gap-4 md:gap-8">
                        {[
                            {
                                id: 'interactive-lessons',
                                label: 'Interactive Lessons',
                            },
                            { id: 'beginner-path', label: 'Beginner Path' },
                            { id: 'Instant-start', label: 'Instant Start' },
                            {
                                id: 'real-simulations',
                                label: 'Real Simulations',
                            },
                        ].map((tab) => {
                            const isActive = activeTab === tab.id;
                            return (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`relative px-4 py-2 font-['Orbitron'] text-xs font-bold tracking-wide uppercase transition-all duration-300 focus:outline-none md:text-sm ${
                                        isActive
                                            ? 'rounded-t-lg border-b-2 border-yellow-400 bg-[#252a6a]/60 text-white shadow-[inset_0_0_8px_rgba(59,40,246,0.3)]'
                                            : 'rounded-t-lg text-slate-400 hover:bg-white/5 hover:text-white'
                                    }`}
                                >
                                    {tab.label}
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* Dynamic Content Area */}
                <div className="relative flex min-h-[460px] flex-1 flex-col justify-center overflow-hidden rounded-2xl border border-white/10 bg-[#08091a] p-6 md:p-8">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={activeTab}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.25 }}
                            className="h-full w-full"
                        >
                            {/* ============================================================================
                                TAB 1 — INTERACTIVE LESSONS (Walkthrough Orientasi Platform)
                               ============================================================================ */}
                            {activeTab === 'interactive-lessons' && (
                                <div className="flex w-full flex-col gap-6">
                                    {/* Horizontal Clickable Stepper */}
                                    <div className="relative mx-auto flex w-full max-w-4xl items-center justify-between py-4">
                                        {/* Connector Line */}
                                        <div className="absolute top-1/2 right-0 left-0 -z-10 h-[2px] -translate-y-1/2 bg-slate-800">
                                            <div
                                                className="h-full bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 transition-all duration-500"
                                                style={{
                                                    width: `${((activeStepId - 1) / 7) * 100}%`,
                                                }}
                                            />
                                        </div>

                                        {walkthroughSteps.map((step) => {
                                            const StepIcon = step.icon;
                                            const isPast =
                                                step.id < activeStepId;
                                            const isCurrent =
                                                step.id === activeStepId;
                                            return (
                                                <button
                                                    key={step.id}
                                                    onClick={() =>
                                                        setActiveStepId(step.id)
                                                    }
                                                    className={`relative z-10 flex h-10 w-10 items-center justify-center rounded-full border transition-all duration-300 ${
                                                        isCurrent
                                                            ? 'scale-110 border-yellow-400 bg-blue-600 text-white shadow-[0_0_15px_rgba(59,130,246,0.6)]'
                                                            : isPast
                                                              ? 'border-blue-500 bg-slate-900 text-blue-400'
                                                              : 'border-slate-800 bg-slate-950 text-slate-500 hover:border-slate-600'
                                                    }`}
                                                >
                                                    <StepIcon size={16} />
                                                    <span className="absolute -bottom-6 font-['Orbitron'] text-[9px] font-bold whitespace-nowrap text-slate-400">
                                                        Step {step.id}
                                                    </span>
                                                </button>
                                            );
                                        })}
                                    </div>

                                    {/* Detailed Walkthrough Info Display */}
                                    <div className="mx-auto mt-4 grid w-full max-w-4xl grid-cols-1 items-center gap-8 rounded-2xl border border-white/5 bg-[#13174D]/25 p-6 md:grid-cols-2 md:p-8">
                                        {/* Left Side: Text info */}
                                        <div className="flex h-full min-h-[180px] flex-col justify-between text-left">
                                            <div>
                                                <span className="mb-3 inline-flex items-center gap-1 rounded bg-yellow-400/10 px-2 py-0.5 font-['Orbitron'] text-[9px] font-black tracking-widest text-yellow-400 uppercase">
                                                    {currentStep.badgeName}
                                                </span>
                                                <h3 className="mb-2 font-['Orbitron'] text-xl font-bold tracking-wide text-white uppercase">
                                                    {currentStep.title}
                                                </h3>
                                                <p className="font-['Oxanium'] text-xs leading-relaxed text-slate-300">
                                                    {currentStep.desc}
                                                </p>
                                            </div>

                                            <div className="mt-6 flex items-center gap-4 border-t border-white/5 pt-4">
                                                <div className="flex flex-col">
                                                    <span className="text-[9px] font-bold text-slate-500 uppercase">
                                                        Estimated Reward
                                                    </span>
                                                    <span className="font-['Orbitron'] text-sm font-black text-cyan-400">
                                                        {currentStep.reward}
                                                    </span>
                                                </div>
                                                <button
                                                    onClick={() =>
                                                        activeStepId < 8
                                                            ? setActiveStepId(
                                                                  activeStepId +
                                                                      1,
                                                              )
                                                            : setActiveStepId(1)
                                                    }
                                                    className="ml-auto flex items-center gap-1.5 rounded-lg bg-blue-600 px-4 py-2 text-xs font-bold text-white shadow-md transition-all hover:scale-105 hover:bg-blue-500"
                                                >
                                                    <span>
                                                        {activeStepId === 8
                                                            ? 'Ulangi Panduan'
                                                            : 'Langkah Berikutnya'}
                                                    </span>
                                                    <ArrowRight size={12} />
                                                </button>
                                            </div>
                                        </div>

                                        {/* Right Side: Mock UI Representation based on Step */}
                                        <div className="relative flex h-full min-h-[180px] items-center justify-center overflow-hidden rounded-xl border border-white/10 bg-black/60 p-5 font-mono">
                                            {currentStep.mockType ===
                                                'course' && (
                                                <div className="w-full space-y-2 text-left text-xs text-slate-400">
                                                    <div className="mb-2 border-b border-white/5 pb-2 text-center font-['Orbitron'] font-bold text-cyan-400 uppercase">
                                                        Jalur Belajar Tersedia
                                                    </div>
                                                    <div className="flex justify-between border-b border-white/5 py-1">
                                                        <span>
                                                            [1] Laravel Backend
                                                        </span>
                                                        <span className="text-emerald-400">
                                                            Pilih Quest
                                                        </span>
                                                    </div>
                                                    <div className="flex justify-between border-b border-white/5 py-1">
                                                        <span>
                                                            [2] React Frontend
                                                        </span>
                                                        <span className="text-emerald-400">
                                                            Pilih Quest
                                                        </span>
                                                    </div>
                                                    <div className="flex justify-between py-1">
                                                        <span>
                                                            [3] Solidity Web3
                                                        </span>
                                                        <span className="text-emerald-400">
                                                            Pilih Quest
                                                        </span>
                                                    </div>
                                                </div>
                                            )}
                                            {currentStep.mockType ===
                                                'editor' && (
                                                <div className="w-full space-y-1.5 text-left text-[10px]">
                                                    <div className="text-slate-500">
                                                        // editor.tsx
                                                    </div>
                                                    <div className="text-purple-400">
                                                        function{' '}
                                                        <span className="text-blue-400">
                                                            startLearning
                                                        </span>
                                                        () {'{'}
                                                    </div>
                                                    <div className="text-slate-300">
                                                        &nbsp;&nbsp;console.log(
                                                        <span className="text-yellow-300">
                                                            "Hello Ventura!"
                                                        </span>
                                                        );
                                                    </div>
                                                    <div className="text-slate-300">
                                                        &nbsp;&nbsp;return{' '}
                                                        <span className="text-emerald-400">
                                                            true
                                                        </span>
                                                        ;
                                                    </div>
                                                    <div className="text-purple-400">
                                                        {'}'}
                                                    </div>
                                                    <div className="mt-2 animate-pulse rounded bg-blue-600/20 py-1 text-center text-[8px] font-bold tracking-widest text-blue-400">
                                                        RUNNING CODE
                                                        PLAYGROUND...
                                                    </div>
                                                </div>
                                            )}
                                            {currentStep.mockType ===
                                                'check' && (
                                                <div className="w-full space-y-3 text-center">
                                                    <div className="inline-flex h-10 w-10 animate-bounce items-center justify-center rounded-full border border-emerald-500/40 bg-emerald-500/20 text-emerald-400">
                                                        <CheckCircle
                                                            size={20}
                                                        />
                                                    </div>
                                                    <div className="font-['Orbitron'] text-xs text-slate-300">
                                                        COMPILE SUCCESS: 12/12
                                                        TESTS PASSED
                                                    </div>
                                                    <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-800">
                                                        <div className="h-full w-full bg-emerald-500" />
                                                    </div>
                                                </div>
                                            )}
                                            {currentStep.mockType ===
                                                'stats' && (
                                                <div className="w-full space-y-2 text-left">
                                                    <div className="border-b border-white/5 pb-2 text-center font-['Orbitron'] font-bold text-yellow-400 uppercase">
                                                        Statistik Naik Level
                                                    </div>
                                                    <div className="flex items-center justify-between text-xs">
                                                        <span>EXP: +1,240</span>
                                                        <span className="text-cyan-400">
                                                            Level 4
                                                        </span>
                                                    </div>
                                                    <div className="h-2 w-full overflow-hidden rounded-full bg-slate-800">
                                                        <div className="h-full w-3/4 bg-cyan-400" />
                                                    </div>
                                                    <div className="mt-1 flex items-center justify-between text-xs">
                                                        <span>
                                                            Gold Balance
                                                        </span>
                                                        <span className="font-bold text-yellow-400">
                                                            1,850 Gold
                                                        </span>
                                                    </div>
                                                </div>
                                            )}
                                            {currentStep.mockType ===
                                                'achieve' && (
                                                <div className="w-full space-y-2 text-center">
                                                    <div className="inline-flex h-12 w-12 items-center justify-center rounded-full border border-yellow-400/40 bg-yellow-400/10 text-yellow-400 shadow-[0_0_15px_rgba(250,204,21,0.3)]">
                                                        <Trophy
                                                            size={24}
                                                            className="animate-pulse"
                                                        />
                                                    </div>
                                                    <div className="font-['Orbitron'] text-xs font-bold text-white">
                                                        Lencana Terbuka: NOVICE
                                                        SLAYER
                                                    </div>
                                                    <div className="text-[9px] text-slate-500">
                                                        Kategori: Laravel CRUD
                                                        Basics
                                                    </div>
                                                </div>
                                            )}
                                            {currentStep.mockType ===
                                                'guild' && (
                                                <div className="w-full space-y-2 text-left text-xs">
                                                    <div className="border-b border-white/5 pb-1 text-center font-['Orbitron'] font-bold text-purple-400 uppercase">
                                                        Guild Active Lobby
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <div className="flex h-5 w-5 items-center justify-center rounded-full bg-cyan-500 text-[9px] font-bold text-black">
                                                            JD
                                                        </div>
                                                        <span>
                                                            JohnDoe joined voice
                                                            channel
                                                        </span>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <div className="flex h-5 w-5 items-center justify-center rounded-full bg-purple-500 text-[9px] font-bold text-black">
                                                            AN
                                                        </div>
                                                        <span>
                                                            Anang: "Siapa raid
                                                            malam ini?"
                                                        </span>
                                                    </div>
                                                </div>
                                            )}
                                            {currentStep.mockType ===
                                                'quest' && (
                                                <div className="w-full space-y-2 text-left text-xs">
                                                    <div className="border-b border-white/5 pb-1 text-center font-['Orbitron'] font-bold text-rose-400 uppercase">
                                                        Quest In Progress
                                                    </div>
                                                    <div className="rounded border border-white/5 bg-slate-900/60 p-2">
                                                        <div className="text-[10px] font-bold text-white">
                                                            Payment Webhook
                                                            Integration
                                                        </div>
                                                        <div className="mt-1 text-[9px] text-slate-400">
                                                            Status: Coding |
                                                            Reward: 400 Gold
                                                        </div>
                                                    </div>
                                                </div>
                                            )}
                                            {currentStep.mockType ===
                                                'portfolio' && (
                                                <div className="w-full space-y-3 text-center">
                                                    <div className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-blue-500/40 bg-blue-500/20 text-blue-400">
                                                        <Briefcase size={20} />
                                                    </div>
                                                    <div className="font-['Orbitron'] text-xs font-bold text-white">
                                                        PORTFOLIO EXPORT READY
                                                    </div>
                                                    <div className="inline-block cursor-pointer rounded bg-white/10 px-2 py-1 text-[8px] text-white select-all">
                                                        https://skillventura.com/verify/anang
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* ============================================================================
                                TAB 2 — BEGINNER PATH (Condensed Preview Peta Progres Skill Tree)
                               ============================================================================ */}
                            {activeTab === 'beginner-path' && (
                                <div className="relative w-full pt-4">
                                    {/* Desktop tree line connections */}
                                    <div className="absolute top-0 left-1/2 hidden h-12 w-[66.6%] -translate-x-1/2 border-b-2 border-white/20 md:block" />
                                    <div className="absolute top-0 left-1/2 hidden h-12 w-[2px] -translate-x-1/2 bg-white/20 md:block" />
                                    <div className="absolute top-12 left-[16.6%] hidden h-6 w-[2px] bg-white/20 md:block" />
                                    <div className="absolute top-12 left-1/2 hidden h-6 w-[2px] -translate-x-1/2 bg-white/20 md:block" />
                                    <div className="absolute top-12 right-[16.6%] hidden h-6 w-[2px] bg-white/20 md:block" />

                                    {/* 3 Branch columns */}
                                    <div className="relative z-10 grid w-full grid-cols-1 gap-8 md:grid-cols-3 md:gap-4">
                                        {beginnerBranches.map(
                                            (branch, branchIndex) => {
                                                return (
                                                    <div
                                                        key={branchIndex}
                                                        className="flex flex-col items-center"
                                                    >
                                                        {/* Header Branch */}
                                                        <div className="flex min-h-[60px] flex-col justify-center px-4 text-center">
                                                            <h4 className="font-['Orbitron'] text-sm font-black tracking-wide text-white uppercase">
                                                                {branch.title}
                                                            </h4>
                                                            <p className="mx-auto mt-1 max-w-[220px] font-['Oxanium'] text-[10px] leading-relaxed text-slate-400">
                                                                {
                                                                    branch.subtitle
                                                                }
                                                            </p>
                                                        </div>

                                                        {/* Line from branch header to node 1 */}
                                                        <div className="my-1 h-8 w-[2px] bg-white/20" />

                                                        {/* Node I */}
                                                        <StudentModuleNodeClone
                                                            title={
                                                                branch.nodes[0]
                                                                    .title
                                                            }
                                                            subtitle={
                                                                branch.nodes[0]
                                                                    .subtitle
                                                            }
                                                            index={0}
                                                            locked={
                                                                branch.nodes[0]
                                                                    .locked
                                                            }
                                                            done={
                                                                branch.nodes[0]
                                                                    .done
                                                            }
                                                        />

                                                        {/* Line from node 1 to node 2 */}
                                                        <div className="my-1 h-8 w-[2px] bg-white/20" />

                                                        {/* Node II */}
                                                        <StudentModuleNodeClone
                                                            title={
                                                                branch.nodes[1]
                                                                    .title
                                                            }
                                                            subtitle={
                                                                branch.nodes[1]
                                                                    .subtitle
                                                            }
                                                            index={1}
                                                            locked={
                                                                branch.nodes[1]
                                                                    .locked
                                                            }
                                                            done={
                                                                branch.nodes[1]
                                                                    .done
                                                            }
                                                        />

                                                        {/* Connecting element for mobile roadmap stack */}
                                                        {branchIndex < 2 && (
                                                            <div className="relative mt-4 h-10 w-[2px] bg-white/20 md:hidden">
                                                                <div className="absolute -bottom-2 -left-[5px] border-t-4 border-r-4 border-l-4 border-transparent border-t-white/30" />
                                                            </div>
                                                        )}
                                                    </div>
                                                );
                                            },
                                        )}
                                    </div>
                                </div>
                            )}

                            {/* ============================================================================
                                TAB 3 — INSTANT START (Launchpad Kartu Aksi Cepat)
                               ============================================================================ */}
                            {activeTab === 'Instant-start' && (
                                <div className="grid w-full grid-cols-1 gap-6 py-4 sm:grid-cols-2 lg:grid-cols-3">
                                    {launchCards.map((card, i) => {
                                        const CardIcon = card.icon;
                                        return (
                                            <div
                                                key={i}
                                                className={`group flex flex-col justify-between rounded-2xl border p-5 backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:shadow-lg ${card.color}`}
                                            >
                                                <div className="text-left">
                                                    <div className="mb-4 flex items-center justify-between">
                                                        <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-white/10 bg-slate-900/60 shadow-[inset_0_0_10px_rgba(255,255,255,0.05)]">
                                                            <CardIcon
                                                                size={18}
                                                            />
                                                        </div>
                                                        <span className="rounded border border-white/10 bg-white/5 px-2 py-0.5 font-['Oxanium'] text-[9px] font-bold text-slate-400">
                                                            {card.duration}
                                                        </span>
                                                    </div>

                                                    <span className="mb-2 inline-flex items-center gap-1 rounded border border-white/10 bg-white/5 px-2 py-0.5 font-['Orbitron'] text-[8px] font-black tracking-wider text-slate-400 uppercase">
                                                        {card.difficulty}
                                                    </span>

                                                    <h4 className="mb-2 font-['Orbitron'] text-base font-bold tracking-wide text-white uppercase">
                                                        {card.title}
                                                    </h4>
                                                    <p className="font-['Oxanium'] text-xs leading-relaxed text-slate-400">
                                                        {card.desc}
                                                    </p>
                                                </div>

                                                <div className="mt-5 flex justify-end">
                                                    <button className="flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-xs font-semibold text-white transition-all group-hover:bg-white group-hover:text-slate-950 hover:bg-white hover:text-slate-950">
                                                        <span>{card.cta}</span>
                                                        <ArrowRight size={12} />
                                                    </button>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}

                            {/* ============================================================================
                                TAB 4 — REAL SIMULATIONS (Simulation & Quest Marketplace Dashboard)
                               ============================================================================ */}
                            {activeTab === 'real-simulations' && (
                                <div className="grid w-full grid-cols-1 gap-8 py-4 text-left lg:grid-cols-5">
                                    {/* Left Side: Quest Board Upwork Style (3 columns of width) */}
                                    <div className="flex flex-col gap-4 lg:col-span-3">
                                        <div className="mb-1 flex items-center justify-between border-b border-white/10 pb-3">
                                            <div className="flex items-center gap-2">
                                                <Compass
                                                    className="animate-spin text-blue-400"
                                                    size={18}
                                                />
                                                <h3 className="font-['Orbitron'] text-base font-bold tracking-wide text-white uppercase">
                                                    Quest Board (Simulasi Pasar
                                                    Lepas)
                                                </h3>
                                            </div>
                                            <span className="rounded-full border border-blue-500/20 bg-blue-500/10 px-2 py-0.5 text-[10px] font-bold text-blue-400">
                                                Proyek Aktif
                                            </span>
                                        </div>

                                        {activeQuests.map((quest, index) => (
                                            <div
                                                key={index}
                                                className="group cursor-pointer rounded-xl border border-white/5 bg-[#13174D]/10 p-4 transition-all duration-300 hover:border-white/10 hover:bg-[#13174D]/30 hover:shadow-md"
                                            >
                                                <div className="mb-2 flex items-start justify-between gap-4">
                                                    <h4 className="truncate font-['Orbitron'] text-sm font-bold text-white transition-colors group-hover:text-blue-400">
                                                        {quest.title}
                                                    </h4>
                                                    <span className="shrink-0 rounded border border-white/10 bg-white/5 px-2 py-0.5 font-['Oxanium'] text-[8px] font-bold text-slate-400">
                                                        {quest.difficulty}
                                                    </span>
                                                </div>
                                                <p className="mb-3 line-clamp-1 font-['Oxanium'] text-xs text-slate-400">
                                                    {quest.desc}
                                                </p>
                                                <div className="flex items-center justify-between border-t border-white/5 pt-2.5 text-[10px] text-slate-500">
                                                    <div className="flex gap-4">
                                                        <span>
                                                            Bids:{' '}
                                                            <strong className="text-slate-300">
                                                                {quest.bids}{' '}
                                                                penawar
                                                            </strong>
                                                        </span>
                                                        <span>
                                                            Reward:{' '}
                                                            <strong className="text-yellow-400">
                                                                {quest.reward}
                                                            </strong>
                                                        </span>
                                                    </div>
                                                    <span className="flex items-center gap-0.5 font-bold text-blue-400 group-hover:underline">
                                                        Ajukan Proposal{' '}
                                                        <ChevronRight
                                                            size={10}
                                                        />
                                                    </span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    {/* Right Side: Discord/Team Lobby + Reviews (2 columns of width) */}
                                    <div className="flex flex-col gap-6 lg:col-span-2">
                                        {/* Team Lobby block */}
                                        <div className="relative overflow-hidden rounded-2xl border border-white/5 bg-[#13174D]/15 p-5">
                                            <div className="absolute top-2 right-2 flex h-2 w-2 animate-ping rounded-full bg-emerald-500" />
                                            <div className="mb-4 flex items-center gap-2 border-b border-white/5 pb-3">
                                                <Users
                                                    className="text-purple-400"
                                                    size={18}
                                                />
                                                <h4 className="font-['Orbitron'] text-sm font-bold text-white uppercase">
                                                    Lobi Guild Aktif
                                                </h4>
                                            </div>

                                            <div className="space-y-3">
                                                <div className="flex items-center justify-between text-xs">
                                                    <span className="font-bold text-slate-400">
                                                        Raid ID: #08-API-Build
                                                    </span>
                                                    <span className="animate-pulse font-bold text-purple-400">
                                                        Live
                                                    </span>
                                                </div>

                                                <div className="flex gap-2">
                                                    {/* User Avatars representation */}
                                                    {[
                                                        'AN',
                                                        'JD',
                                                        'RM',
                                                        'KS',
                                                    ].map((name, i) => (
                                                        <div
                                                            key={i}
                                                            className="relative flex h-8 w-8 cursor-pointer items-center justify-center rounded-full border border-white/20 bg-slate-900 text-[9px] font-black text-white transition-transform hover:scale-110"
                                                        >
                                                            <div className="absolute -top-1 -right-1 h-2 w-2 rounded-full border border-slate-950 bg-emerald-400" />
                                                            {name}
                                                        </div>
                                                    ))}
                                                    <div className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-full border-2 border-dashed border-white/10 text-xs text-slate-500 hover:border-white/30">
                                                        +
                                                    </div>
                                                </div>

                                                <div className="mt-2 flex items-center gap-3 rounded-lg border border-white/5 bg-slate-950/60 p-3">
                                                    <Zap
                                                        className="animate-bounce text-yellow-400"
                                                        size={20}
                                                    />
                                                    <div className="text-left">
                                                        <div className="text-[10px] font-bold text-slate-400 uppercase">
                                                            Clan Bonus Booster
                                                        </div>
                                                        <div className="font-['Orbitron'] text-[9px] font-black tracking-widest text-yellow-400">
                                                            XP MULTIPLIER: +25%
                                                            ACTIVE
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Peer Reviews block */}
                                        <div className="flex-1 rounded-2xl border border-white/5 bg-[#13174D]/15 p-5">
                                            <div className="mb-3 flex items-center gap-2 border-b border-white/5 pb-3">
                                                <UserCheck
                                                    className="text-cyan-400"
                                                    size={18}
                                                />
                                                <h4 className="font-['Orbitron'] text-sm font-bold text-white uppercase">
                                                    Evaluasi Peer-Review
                                                </h4>
                                            </div>

                                            <div className="space-y-2 text-left">
                                                <div className="flex gap-0.5 text-yellow-400">
                                                    {[...Array(5)].map(
                                                        (_, i) => (
                                                            <Star
                                                                key={i}
                                                                size={10}
                                                                fill="currentColor"
                                                            />
                                                        ),
                                                    )}
                                                </div>
                                                <blockquote className="text-[11px] leading-relaxed text-slate-400 italic">
                                                    "Kode tersusun dengan baik,
                                                    modular, dan penanganan
                                                    middleware JWT aman.
                                                    Evaluasi code review
                                                    disetujui. +50 Gold bonus!"
                                                </blockquote>
                                                <div className="flex justify-between border-t border-white/5 pt-2 text-[9px] text-slate-500">
                                                    <span>
                                                        Reviewer: Mentor Ridhwan
                                                    </span>
                                                    <span className="text-cyan-400">
                                                        Verified
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </motion.div>
                    </AnimatePresence>
                </div>
            </div>
        </section>
    );
}
