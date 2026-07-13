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
    Sparkles,
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
    mockType: 'course' | 'editor' | 'check' | 'stats' | 'achieve' | 'guild' | 'quest' | 'portfolio';
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
            { title: 'laravel basics', subtitle: 'Setup & MVC Layout', done: true },
            { title: 'routing & views', subtitle: 'Blade Templating', done: true },
        ],
    },
    {
        title: 'Laravel CRUD Basics',
        subtitle: 'CRUD Laravel Lengkap: Dari Migrasi, Model, Controller, Hingga Validasi',
        nodes: [
            { title: 'data migrations', subtitle: 'Database Schemas', done: false }, // Available/Active
            { title: 'eloquent models', subtitle: 'CRUD Operations', locked: true },
        ],
    },
    {
        title: 'Laravel Auth & Mid',
        subtitle: 'Laravel Authentication & Middleware: Membangun Sistem Login Modern',
        nodes: [
            { title: 'user session', subtitle: 'Auth Controllers', locked: true },
            { title: 'auth middleware', subtitle: 'Route Protection', locked: true },
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
        <div className="relative flex w-full flex-col items-center px-1 sm:px-0 max-w-[280px]">
            <div
                className="relative block w-full p-[2px] transition-all duration-300 hover:shadow-[0_4px_18px_rgba(99,102,241,0.35)] hover:-translate-y-0.5 cursor-pointer"
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
                                className="font-bold select-none text-[13px]"
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
                            className="absolute right-1.5 bottom-1.5 z-20 flex items-center justify-center animate-pulse"
                            style={{
                                width: '20px',
                                height: '20px',
                                borderRadius: '50%',
                                background: done ? '#2563eb' : locked ? '#94a3b8' : '#3b82f6',
                                border: done ? '2px solid #fff' : locked ? '2px solid #e2e8f0' : '2px solid #fff',
                                boxShadow: done
                                    ? '0 0 8px rgba(37,99,235,0.6)'
                                    : locked
                                      ? 'none'
                                      : '0 0 8px rgba(59,130,246,0.5)',
                            }}
                        >
                            {locked ? (
                                <svg viewBox="0 0 16 16" fill="white" className="h-2.5 w-2.5">
                                    <path d="M11 7V5a3 3 0 1 0-6 0v2H4a1 1 0 0 0-1 1v6a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1V8a1 1 0 0 0-1-1h-1ZM6 5a2 2 0 1 1 4 0v2H6V5Z" />
                                </svg>
                            ) : done ? (
                                <svg viewBox="0 0 16 16" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="h-2.5 w-2.5">
                                    <polyline points="2,9 6,13 14,4" />
                                </svg>
                            ) : (
                                <svg viewBox="0 0 16 16" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="h-2.5 w-2.5">
                                    <polyline points="5,3 11,8 5,13" />
                                </svg>
                            )}
                        </div>
                    </div>

                    {/* Title + Status Label */}
                    <div className="relative flex flex-1 flex-col justify-center gap-0.5 overflow-hidden px-4 py-2 text-left">
                        <span
                            className="text-xs md:text-sm leading-snug font-bold font-['Orbitron'] truncate"
                            style={{ color: titleColor }}
                        >
                            {title}
                        </span>
                        <span
                            className="text-[10px] md:text-[11px] font-semibold font-['Oxanium'] truncate"
                            style={{ color: statusColor }}
                        >
                            {statusLabel}
                        </span>
                    </div>

                    {/* Right side lock or arrow button */}
                    <div className="flex flex-shrink-0 items-center justify-center pr-4">
                        {locked ? (
                            <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5" style={{ color: statusColor }}>
                                <rect x="5" y="11" width="14" height="10" rx="2.5" fill="currentColor" fillOpacity="0.15" stroke="currentColor" strokeWidth="1.5" />
                                <path d="M8 11V7a4 4 0 0 1 8 0v4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                                <circle cx="12" cy="16" r="1.5" fill="currentColor" />
                            </svg>
                        ) : (
                            <div
                                className="flex h-8 w-8 items-center justify-center rounded-full cursor-pointer hover:scale-105 transition-transform"
                                style={{
                                    background: done ? '#2563eb' : '#4f46e5',
                                    boxShadow: '0 0 10px rgba(59,130,246,0.4)',
                                }}
                            >
                                <svg viewBox="0 0 16 16" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="h-3.5 w-3.5">
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
    const currentStep = walkthroughSteps.find(s => s.id === activeStepId) || walkthroughSteps[0];

    return (
        <section
            id="learn"
            className="relative py-16 w-full flex items-center justify-center"
            style={{ backgroundColor: '#ffffff' }}
        >
            {/* Main Gamified Card Container */}
            <div
                className="w-full max-w-6xl rounded-3xl p-8 md:p-12 text-white shadow-2xl relative transition-all duration-300 min-h-[680px] flex flex-col justify-between"
                style={{ backgroundColor: '#191D53' }}
            >
                {/* Header */}
                <div className="text-center mb-8">
                    <h2 className="mb-2 text-3xl font-black text-white md:text-4xl tracking-wide font-['Orbitron']">
                        Gamified Learning for Every Skill Level
                    </h2>
                    <p className="text-slate-300 text-xs md:text-sm font-['Oxanium']">
                        Level Up Your Skills Through VENTURA's Gamified Learning Roadmap
                    </p>
                </div>

                {/* Tabs Switcher */}
                <div className="flex justify-center border-b border-white/10 mb-8 pb-4">
                    <div className="flex flex-wrap justify-center gap-4 md:gap-8">
                        {[
                            { id: 'interactive-lessons', label: 'Interactive Lessons' },
                            { id: 'beginner-path', label: 'Beginner Path' },
                            { id: 'Instant-start', label: 'Instant Start' },
                            { id: 'real-simulations', label: 'Real Simulations' },
                        ].map((tab) => {
                            const isActive = activeTab === tab.id;
                            return (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`relative px-4 py-2 text-xs md:text-sm font-bold tracking-wide uppercase transition-all duration-300 font-['Orbitron'] focus:outline-none ${
                                        isActive
                                            ? 'text-white border-b-2 border-yellow-400 bg-[#252a6a]/60 rounded-t-lg shadow-[inset_0_0_8px_rgba(59,40,246,0.3)]'
                                            : 'text-slate-400 hover:text-white hover:bg-white/5 rounded-t-lg'
                                    }`}
                                >
                                    {tab.label}
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* Dynamic Content Area */}
                <div className="flex-1 rounded-2xl bg-[#08091a] p-6 md:p-8 border border-white/10 relative overflow-hidden flex flex-col justify-center min-h-[460px]">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={activeTab}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.25 }}
                            className="w-full h-full"
                        >
                            {/* ============================================================================
                                TAB 1 — INTERACTIVE LESSONS (Walkthrough Orientasi Platform)
                               ============================================================================ */}
                            {activeTab === 'interactive-lessons' && (
                                <div className="flex flex-col gap-6 w-full">
                                    {/* Horizontal Clickable Stepper */}
                                    <div className="flex justify-between items-center relative py-4 max-w-4xl mx-auto w-full">
                                        {/* Connector Line */}
                                        <div className="absolute top-1/2 left-0 right-0 h-[2px] bg-slate-800 -translate-y-1/2 -z-10">
                                            <div
                                                className="h-full bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 transition-all duration-500"
                                                style={{ width: `${((activeStepId - 1) / 7) * 100}%` }}
                                            />
                                        </div>

                                        {walkthroughSteps.map((step) => {
                                            const StepIcon = step.icon;
                                            const isPast = step.id < activeStepId;
                                            const isCurrent = step.id === activeStepId;
                                            return (
                                                <button
                                                    key={step.id}
                                                    onClick={() => setActiveStepId(step.id)}
                                                    className={`relative z-10 flex h-10 w-10 items-center justify-center rounded-full border transition-all duration-300 ${
                                                        isCurrent
                                                            ? 'border-yellow-400 bg-blue-600 text-white shadow-[0_0_15px_rgba(59,130,246,0.6)] scale-110'
                                                            : isPast
                                                              ? 'border-blue-500 bg-slate-900 text-blue-400'
                                                              : 'border-slate-800 bg-slate-950 text-slate-500 hover:border-slate-600'
                                                    }`}
                                                >
                                                    <StepIcon size={16} />
                                                    <span className="absolute -bottom-6 text-[9px] font-bold font-['Orbitron'] whitespace-nowrap text-slate-400">
                                                        Step {step.id}
                                                    </span>
                                                </button>
                                            );
                                        })}
                                    </div>

                                    {/* Detailed Walkthrough Info Display */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center bg-[#13174D]/25 border border-white/5 rounded-2xl p-6 md:p-8 mt-4 max-w-4xl mx-auto w-full">
                                        {/* Left Side: Text info */}
                                        <div className="text-left flex flex-col justify-between h-full min-h-[180px]">
                                            <div>
                                                <span className="inline-flex items-center gap-1 rounded bg-yellow-400/10 px-2 py-0.5 text-[9px] font-black text-yellow-400 uppercase tracking-widest font-['Orbitron'] mb-3">
                                                    <Sparkles size={10} className="animate-spin" /> {currentStep.badgeName}
                                                </span>
                                                <h3 className="text-xl font-bold text-white font-['Orbitron'] uppercase tracking-wide mb-2">
                                                    {currentStep.title}
                                                </h3>
                                                <p className="text-xs leading-relaxed text-slate-300 font-['Oxanium']">
                                                    {currentStep.desc}
                                                </p>
                                            </div>

                                            <div className="flex gap-4 items-center mt-6 border-t border-white/5 pt-4">
                                                <div className="flex flex-col">
                                                    <span className="text-[9px] text-slate-500 font-bold uppercase">Estimated Reward</span>
                                                    <span className="text-sm font-black text-cyan-400 font-['Orbitron']">{currentStep.reward}</span>
                                                </div>
                                                <button
                                                    onClick={() => activeStepId < 8 ? setActiveStepId(activeStepId + 1) : setActiveStepId(1)}
                                                    className="ml-auto flex items-center gap-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 px-4 py-2 text-xs font-bold text-white shadow-md transition-all hover:scale-105"
                                                >
                                                    <span>{activeStepId === 8 ? 'Ulangi Panduan' : 'Langkah Berikutnya'}</span>
                                                    <ArrowRight size={12} />
                                                </button>
                                            </div>
                                        </div>

                                        {/* Right Side: Mock UI Representation based on Step */}
                                        <div className="h-full min-h-[180px] bg-black/60 rounded-xl border border-white/10 p-5 flex items-center justify-center relative overflow-hidden font-mono">
                                            {currentStep.mockType === 'course' && (
                                                <div className="w-full text-left text-xs text-slate-400 space-y-2">
                                                    <div className="text-cyan-400 font-bold text-center border-b border-white/5 pb-2 mb-2 font-['Orbitron'] uppercase">Jalur Belajar Tersedia</div>
                                                    <div className="flex justify-between border-b border-white/5 py-1"><span>[1] Laravel Backend</span><span className="text-emerald-400">Pilih Quest</span></div>
                                                    <div className="flex justify-between border-b border-white/5 py-1"><span>[2] React Frontend</span><span className="text-emerald-400">Pilih Quest</span></div>
                                                    <div className="flex justify-between py-1"><span>[3] Solidity Web3</span><span className="text-emerald-400">Pilih Quest</span></div>
                                                </div>
                                            )}
                                            {currentStep.mockType === 'editor' && (
                                                <div className="w-full text-left text-[10px] space-y-1.5">
                                                    <div className="text-slate-500">// editor.tsx</div>
                                                    <div className="text-purple-400">function <span className="text-blue-400">startLearning</span>() {'{'}</div>
                                                    <div className="text-slate-300">&nbsp;&nbsp;console.log(<span className="text-yellow-300">"Hello Ventura!"</span>);</div>
                                                    <div className="text-slate-300">&nbsp;&nbsp;return <span className="text-emerald-400">true</span>;</div>
                                                    <div className="text-purple-400">{'}'}</div>
                                                    <div className="text-center bg-blue-600/20 text-blue-400 rounded py-1 mt-2 text-[8px] font-bold tracking-widest animate-pulse">RUNNING CODE PLAYGROUND...</div>
                                                </div>
                                            )}
                                            {currentStep.mockType === 'check' && (
                                                <div className="w-full text-center space-y-3">
                                                    <div className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 animate-bounce">
                                                        <CheckCircle size={20} />
                                                    </div>
                                                    <div className="text-xs text-slate-300 font-['Orbitron']">COMPILE SUCCESS: 12/12 TESTS PASSED</div>
                                                    <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                                                        <div className="h-full bg-emerald-500 w-full" />
                                                    </div>
                                                </div>
                                            )}
                                            {currentStep.mockType === 'stats' && (
                                                <div className="w-full text-left space-y-2">
                                                    <div className="text-yellow-400 font-bold font-['Orbitron'] border-b border-white/5 pb-2 text-center uppercase">Statistik Naik Level</div>
                                                    <div className="flex justify-between items-center text-xs">
                                                        <span>EXP: +1,240</span>
                                                        <span className="text-cyan-400">Level 4</span>
                                                    </div>
                                                    <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
                                                        <div className="h-full bg-cyan-400 w-3/4" />
                                                    </div>
                                                    <div className="flex justify-between items-center text-xs mt-1">
                                                        <span>Gold Balance</span>
                                                        <span className="text-yellow-400 font-bold">1,850 Gold</span>
                                                    </div>
                                                </div>
                                            )}
                                            {currentStep.mockType === 'achieve' && (
                                                <div className="w-full text-center space-y-2">
                                                    <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-yellow-400/10 text-yellow-400 border border-yellow-400/40 shadow-[0_0_15px_rgba(250,204,21,0.3)]">
                                                        <Trophy size={24} className="animate-pulse" />
                                                    </div>
                                                    <div className="text-xs text-white font-bold font-['Orbitron']">Lencana Terbuka: NOVICE SLAYER</div>
                                                    <div className="text-[9px] text-slate-500">Kategori: Laravel CRUD Basics</div>
                                                </div>
                                            )}
                                            {currentStep.mockType === 'guild' && (
                                                <div className="w-full text-left text-xs space-y-2">
                                                    <div className="text-purple-400 font-bold text-center border-b border-white/5 pb-1 uppercase font-['Orbitron']">Guild Active Lobby</div>
                                                    <div className="flex items-center gap-2">
                                                        <div className="h-5 w-5 rounded-full bg-cyan-500 flex items-center justify-center text-[9px] text-black font-bold">JD</div>
                                                        <span>JohnDoe joined voice channel</span>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <div className="h-5 w-5 rounded-full bg-purple-500 flex items-center justify-center text-[9px] text-black font-bold">AN</div>
                                                        <span>Anang: "Siapa raid malam ini?"</span>
                                                    </div>
                                                </div>
                                            )}
                                            {currentStep.mockType === 'quest' && (
                                                <div className="w-full text-left text-xs space-y-2">
                                                    <div className="text-rose-400 font-bold text-center border-b border-white/5 pb-1 uppercase font-['Orbitron']">Quest In Progress</div>
                                                    <div className="bg-slate-900/60 p-2 rounded border border-white/5">
                                                        <div className="font-bold text-white text-[10px]">Payment Webhook Integration</div>
                                                        <div className="text-[9px] text-slate-400 mt-1">Status: Coding | Reward: 400 Gold</div>
                                                    </div>
                                                </div>
                                            )}
                                            {currentStep.mockType === 'portfolio' && (
                                                <div className="w-full text-center space-y-3">
                                                    <div className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-blue-500/20 text-blue-400 border border-blue-500/40">
                                                        <Briefcase size={20} />
                                                    </div>
                                                    <div className="text-xs text-white font-bold font-['Orbitron']">PORTFOLIO EXPORT READY</div>
                                                    <div className="text-[8px] bg-white/10 text-white rounded px-2 py-1 inline-block select-all cursor-pointer">https://skillventura.com/verify/anang</div>
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
                                <div className="relative pt-4 w-full">
                                    {/* Desktop tree line connections */}
                                    <div className="hidden md:block absolute top-0 left-1/2 -translate-x-1/2 w-[66.6%] h-12 border-b-2 border-white/20" />
                                    <div className="hidden md:block absolute top-0 left-1/2 -translate-x-1/2 w-[2px] h-12 bg-white/20" />
                                    <div className="hidden md:block absolute top-12 left-[16.6%] w-[2px] h-6 bg-white/20" />
                                    <div className="hidden md:block absolute top-12 left-1/2 -translate-x-1/2 w-[2px] h-6 bg-white/20" />
                                    <div className="hidden md:block absolute top-12 right-[16.6%] w-[2px] h-6 bg-white/20" />

                                    {/* 3 Branch columns */}
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-4 relative z-10 w-full">
                                        {beginnerBranches.map((branch, branchIndex) => {
                                            return (
                                                <div
                                                    key={branchIndex}
                                                    className="flex flex-col items-center"
                                                >
                                                    {/* Header Branch */}
                                                    <div className="text-center min-h-[60px] flex flex-col justify-center px-4">
                                                        <h4 className="text-sm font-black text-white font-['Orbitron'] uppercase tracking-wide">
                                                            {branch.title}
                                                        </h4>
                                                        <p className="text-[10px] text-slate-400 font-['Oxanium'] max-w-[220px] mx-auto mt-1 leading-relaxed">
                                                            {branch.subtitle}
                                                        </p>
                                                    </div>

                                                    {/* Line from branch header to node 1 */}
                                                    <div className="w-[2px] h-8 bg-white/20 my-1" />

                                                    {/* Node I */}
                                                    <StudentModuleNodeClone
                                                        title={branch.nodes[0].title}
                                                        subtitle={branch.nodes[0].subtitle}
                                                        index={0}
                                                        locked={branch.nodes[0].locked}
                                                        done={branch.nodes[0].done}
                                                    />

                                                    {/* Line from node 1 to node 2 */}
                                                    <div className="w-[2px] h-8 bg-white/20 my-1" />

                                                    {/* Node II */}
                                                    <StudentModuleNodeClone
                                                        title={branch.nodes[1].title}
                                                        subtitle={branch.nodes[1].subtitle}
                                                        index={1}
                                                        locked={branch.nodes[1].locked}
                                                        done={branch.nodes[1].done}
                                                    />

                                                    {/* Connecting element for mobile roadmap stack */}
                                                    {branchIndex < 2 && (
                                                        <div className="md:hidden w-[2px] h-10 bg-white/20 mt-4 relative">
                                                            <div className="absolute -bottom-2 -left-[5px] border-l-4 border-r-4 border-t-4 border-transparent border-t-white/30" />
                                                        </div>
                                                    )}
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            )}

                            {/* ============================================================================
                                TAB 3 — INSTANT START (Launchpad Kartu Aksi Cepat)
                               ============================================================================ */}
                            {activeTab === 'Instant-start' && (
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full py-4">
                                    {launchCards.map((card, i) => {
                                        const CardIcon = card.icon;
                                        return (
                                            <div
                                                key={i}
                                                className={`group flex flex-col justify-between rounded-2xl border p-5 backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:shadow-lg ${card.color}`}
                                            >
                                                <div className="text-left">
                                                    <div className="flex justify-between items-center mb-4">
                                                        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-slate-900/60 border border-white/10 shadow-[inset_0_0_10px_rgba(255,255,255,0.05)]">
                                                            <CardIcon size={18} />
                                                        </div>
                                                        <span className="rounded bg-white/5 border border-white/10 px-2 py-0.5 text-[9px] font-bold text-slate-400 font-['Oxanium']">
                                                            {card.duration}
                                                        </span>
                                                    </div>

                                                    <span className="inline-flex items-center gap-1 rounded bg-white/5 border border-white/10 px-2 py-0.5 text-[8px] font-black text-slate-400 uppercase tracking-wider font-['Orbitron'] mb-2">
                                                        {card.difficulty}
                                                    </span>

                                                    <h4 className="mb-2 text-base font-bold text-white font-['Orbitron'] tracking-wide uppercase">
                                                        {card.title}
                                                    </h4>
                                                    <p className="text-xs leading-relaxed text-slate-400 font-['Oxanium']">
                                                        {card.desc}
                                                    </p>
                                                </div>

                                                <div className="mt-5 flex justify-end">
                                                    <button className="flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-xs font-semibold text-white transition-all hover:bg-white hover:text-slate-950 group-hover:bg-white group-hover:text-slate-950">
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
                                <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 w-full py-4 text-left">
                                    {/* Left Side: Quest Board Upwork Style (3 columns of width) */}
                                    <div className="lg:col-span-3 flex flex-col gap-4">
                                        <div className="flex items-center justify-between border-b border-white/10 pb-3 mb-1">
                                            <div className="flex items-center gap-2">
                                                <Compass className="text-blue-400 animate-spin" size={18} />
                                                <h3 className="text-base font-bold text-white font-['Orbitron'] uppercase tracking-wide">
                                                    Quest Board (Simulasi Pasar Lepas)
                                                </h3>
                                            </div>
                                            <span className="rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20 px-2 py-0.5 text-[10px] font-bold">
                                                Proyek Aktif
                                            </span>
                                        </div>

                                        {activeQuests.map((quest, index) => (
                                            <div
                                                key={index}
                                                className="group border border-white/5 bg-[#13174D]/10 hover:bg-[#13174D]/30 p-4 rounded-xl transition-all duration-300 hover:border-white/10 hover:shadow-md cursor-pointer"
                                            >
                                                <div className="flex justify-between items-start gap-4 mb-2">
                                                    <h4 className="text-sm font-bold text-white group-hover:text-blue-400 transition-colors font-['Orbitron'] truncate">
                                                        {quest.title}
                                                    </h4>
                                                    <span className="rounded bg-white/5 border border-white/10 px-2 py-0.5 text-[8px] font-bold text-slate-400 font-['Oxanium'] shrink-0">
                                                        {quest.difficulty}
                                                    </span>
                                                </div>
                                                <p className="text-xs text-slate-400 font-['Oxanium'] mb-3 line-clamp-1">
                                                    {quest.desc}
                                                </p>
                                                <div className="flex justify-between items-center text-[10px] text-slate-500 border-t border-white/5 pt-2.5">
                                                    <div className="flex gap-4">
                                                        <span>Bids: <strong className="text-slate-300">{quest.bids} penawar</strong></span>
                                                        <span>Reward: <strong className="text-yellow-400">{quest.reward}</strong></span>
                                                    </div>
                                                    <span className="text-blue-400 font-bold group-hover:underline flex items-center gap-0.5">
                                                        Ajukan Proposal <ChevronRight size={10} />
                                                    </span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    {/* Right Side: Discord/Team Lobby + Reviews (2 columns of width) */}
                                    <div className="lg:col-span-2 flex flex-col gap-6">
                                        {/* Team Lobby block */}
                                        <div className="bg-[#13174D]/15 border border-white/5 rounded-2xl p-5 relative overflow-hidden">
                                            <div className="absolute top-2 right-2 flex h-2 w-2 rounded-full bg-emerald-500 animate-ping" />
                                            <div className="flex items-center gap-2 border-b border-white/5 pb-3 mb-4">
                                                <Users className="text-purple-400" size={18} />
                                                <h4 className="text-sm font-bold text-white font-['Orbitron'] uppercase">Lobi Guild Aktif</h4>
                                            </div>

                                            <div className="space-y-3">
                                                <div className="flex items-center justify-between text-xs">
                                                    <span className="text-slate-400 font-bold">Raid ID: #08-API-Build</span>
                                                    <span className="text-purple-400 font-bold animate-pulse">Live</span>
                                                </div>

                                                <div className="flex gap-2">
                                                    {/* User Avatars representation */}
                                                    {['AN', 'JD', 'RM', 'KS'].map((name, i) => (
                                                        <div
                                                            key={i}
                                                            className="h-8 w-8 rounded-full bg-slate-900 border border-white/20 flex items-center justify-center text-[9px] font-black text-white hover:scale-110 transition-transform cursor-pointer relative"
                                                        >
                                                            <div className="absolute -top-1 -right-1 h-2 w-2 rounded-full bg-emerald-400 border border-slate-950" />
                                                            {name}
                                                        </div>
                                                    ))}
                                                    <div className="h-8 w-8 rounded-full border-2 border-dashed border-white/10 flex items-center justify-center text-slate-500 cursor-pointer hover:border-white/30 text-xs">
                                                        +
                                                    </div>
                                                </div>

                                                <div className="bg-slate-950/60 p-3 rounded-lg border border-white/5 mt-2 flex items-center gap-3">
                                                    <Zap className="text-yellow-400 animate-bounce" size={20} />
                                                    <div className="text-left">
                                                        <div className="text-[10px] font-bold text-slate-400 uppercase">Clan Bonus Booster</div>
                                                        <div className="text-[9px] text-yellow-400 font-black tracking-widest font-['Orbitron']">XP MULTIPLIER: +25% ACTIVE</div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Peer Reviews block */}
                                        <div className="bg-[#13174D]/15 border border-white/5 rounded-2xl p-5 flex-1">
                                            <div className="flex items-center gap-2 border-b border-white/5 pb-3 mb-3">
                                                <UserCheck className="text-cyan-400" size={18} />
                                                <h4 className="text-sm font-bold text-white font-['Orbitron'] uppercase">Evaluasi Peer-Review</h4>
                                            </div>

                                            <div className="text-left space-y-2">
                                                <div className="flex gap-0.5 text-yellow-400">
                                                    {[...Array(5)].map((_, i) => <Star key={i} size={10} fill="currentColor" />)}
                                                </div>
                                                <blockquote className="text-[11px] leading-relaxed text-slate-400 italic">
                                                    "Kode tersusun dengan baik, modular, dan penanganan middleware JWT aman. Evaluasi code review disetujui. +50 Gold bonus!"
                                                </blockquote>
                                                <div className="text-[9px] text-slate-500 border-t border-white/5 pt-2 flex justify-between">
                                                    <span>Reviewer: Mentor Ridhwan</span>
                                                    <span className="text-cyan-400">Verified</span>
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
