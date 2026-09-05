import { useState } from 'react';
import {
    Search,
    Compass,
    Calendar,
    Users,
    DollarSign,
    ArrowRight,
    ChevronDown,
    Lock,
    Sparkles,
    CheckCircle2,
} from 'lucide-react';
import { StarBackground } from '@/components/Student/PageBackground';

interface QuestCardData {
    id: string;
    title: string;
    description: string;
    rank: 'Enterprise' | 'Expert' | 'Intermediate' | 'Entry-Level';
    rankStyle: string;
    salary: string;
    deadline: string;
    bids: number;
    skills: string[];
}

const mockStudentQuests: QuestCardData[] = [
    {
        id: 'q1',
        title: 'Integrasi Payment Gateway & Webhook Notifikasi Transaksi',
        description:
            'Implementasikan payment flow aman menggunakan Midtrans Snap SDK, signature key validation, dan idempotent webhook listener.',
        rank: 'Intermediate',
        rankStyle:
            'border-emerald-500/40 bg-emerald-500/15 text-emerald-300 shadow-[0_0_12px_rgba(52,211,153,0.3)]',
        salary: 'Rp 2.500.000',
        deadline: '18 September 2026 23:59',
        bids: 9,
        skills: ['Laravel 12', 'REST API', 'Webhooks', 'MySQL'],
    },
    {
        id: 'q2',
        title: 'Slicing Responsive Analytics Dashboard ke React 19 + Tailwind v4',
        description:
            'Konversi desain Figma high-fidelity ke komponen modular React modern lengkap dengan dark mode state, dynamic charts, dan micro-animations.',
        rank: 'Entry-Level',
        rankStyle:
            'border-slate-500/40 bg-slate-700/30 text-slate-200 shadow-[0_0_10px_rgba(148,163,184,0.2)]',
        salary: 'Rp 1.400.000',
        deadline: '22 September 2026 18:00',
        bids: 14,
        skills: ['React 19', 'Tailwind v4', 'Inertia v2', 'Lucide'],
    },
    {
        id: 'q3',
        title: 'Realtime WebSocket Collaborative Canvas & Chat Room',
        description:
            'Membangun bidirectional socket cluster dengan Redis pub/sub untuk sinkronisasi kursor multi-user dan lobi suara terenkripsi.',
        rank: 'Enterprise',
        rankStyle:
            'border-blue-500/40 bg-blue-500/15 text-blue-300 shadow-[0_0_15px_rgba(59,130,246,0.35)]',
        salary: 'Rp 5.500.000',
        deadline: '28 September 2026 21:00',
        bids: 6,
        skills: ['Node.js', 'Socket.io', 'Redis', 'Docker'],
    },
];

export default function QuestTab() {
    const [activeSubTab, setActiveSubTab] = useState<'bursa' | 'saya'>('bursa');
    const [hoveredCard, setHoveredCard] = useState<string | null>(null);

    return (
        <div className="relative flex w-full flex-col overflow-hidden rounded-2xl border border-blue-500/20 bg-[#020202] text-white shadow-2xl">
            {/* Latar Belakang Kosmik Bintang Asli Ventura */}
            <StarBackground />

            {/* ═══════════════════════════════════════════════════════════════
                HEADER (1:1 Exact Replica from Student/Quests/Index.tsx)
               ═══════════════════════════════════════════════════════════════ */}
            <div className="relative z-10 w-full flex-shrink-0 p-3 sm:p-4 pb-0">
                <div
                    className="relative rounded-md p-[2px] md:p-[3px]"
                    style={{
                        backgroundImage:
                            'linear-gradient(to bottom, #3B28F6 0%, #4c2fff 30%, #7c3aed 50%, #facc15 100%)',
                    }}
                >
                    <div className="flex items-center justify-between rounded-[4px] bg-white px-4 py-3 md:px-6 md:py-3.5 dark:bg-[#040812]">
                        {/* Tombol Back Futuristik (Polygon SVG Asli) */}
                        <div className="group relative shrink-0 cursor-pointer">
                            <svg
                                className="h-[32px] w-[75px] overflow-visible"
                                viewBox="0 0 110 46"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <defs>
                                    <linearGradient
                                        id="back_border_grad_quest_tab"
                                        x1="0%"
                                        y1="0%"
                                        x2="100%"
                                        y2="0%"
                                    >
                                        <stop offset="0%" stopColor="#3B28F6" />
                                        <stop offset="100%" stopColor="#FACC15" />
                                    </linearGradient>
                                </defs>
                                <path
                                    d="M 3,3 H 127 L 97,47 H 3 Z"
                                    className="fill-blue-50/60 transition-colors dark:fill-[#080e28]/40"
                                    stroke="url(#back_border_grad_quest_tab)"
                                    strokeWidth="2"
                                    strokeLinejoin="miter"
                                    style={{
                                        filter: 'drop-shadow(0 0 3px rgba(59, 130, 246, 0.35))',
                                    }}
                                />
                            </svg>
                            <div className="absolute inset-0 flex items-center justify-center font-['Orbitron'] text-xs font-bold text-[#1e3a8a] dark:text-blue-200">
                                BACK
                            </div>
                        </div>

                        {/* Title */}
                        <h1 className="pointer-events-none absolute right-0 left-0 px-16 text-center font-['Orbitron'] text-sm sm:text-base md:text-lg lg:text-xl font-bold tracking-[0.08em] text-[#1e3a8a] uppercase drop-shadow-[0_0_10px_rgba(255,255,255,0.3)] dark:text-white">
                            BURSA QUEST & PROYEK
                        </h1>

                        <span className="hidden sm:inline-block rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-1 font-['Oxanium'] text-[10px] font-bold text-emerald-400">
                            ● 24 Quest Tersedia
                        </span>
                    </div>
                </div>
            </div>

            {/* ═══════════════════════════════════════════════════════════════
                STUDENT TOOLBAR CROP (Tabs + Search Bar + Filters)
               ═══════════════════════════════════════════════════════════════ */}
            <div className="relative z-10 border-b border-white/10 bg-[#070822]/80 p-4 text-left backdrop-blur-sm">
                <div className="flex flex-wrap items-center justify-between gap-3">
                    {/* Main Tabs (Bursa Quest vs Quest Saya) */}
                    <div className="flex rounded-xl border border-white/10 bg-[#030412] p-1 font-['Orbitron'] text-[11px]">
                        <button
                            onClick={() => setActiveSubTab('bursa')}
                            className={`flex items-center gap-1.5 rounded-lg px-3.5 py-1.5 font-bold transition-all ${
                                activeSubTab === 'bursa'
                                    ? 'bg-blue-600 text-white shadow-[0_0_12px_rgba(59,130,246,0.6)]'
                                    : 'text-slate-400 hover:text-white'
                            }`}
                        >
                            <Compass size={13} />
                            <span>Bursa Quest</span>
                        </button>
                        <button
                            onClick={() => setActiveSubTab('saya')}
                            className={`flex items-center gap-1.5 rounded-lg px-3.5 py-1.5 font-bold transition-all ${
                                activeSubTab === 'saya'
                                    ? 'bg-blue-600 text-white shadow-[0_0_12px_rgba(59,130,246,0.6)]'
                                    : 'text-slate-400 hover:text-white'
                            }`}
                        >
                            <span>Quest Saya</span>
                            <span className="flex h-4 w-4 items-center justify-center rounded-full bg-blue-500/30 text-[9px]">
                                2
                            </span>
                        </button>
                    </div>

                    {/* Search & Status Filter */}
                    <div className="flex flex-1 max-w-md items-center gap-2">
                        <div className="relative flex-1">
                            <Search
                                size={14}
                                className="absolute top-1/2 left-3 -translate-y-1/2 text-slate-400"
                            />
                            <div className="w-full rounded-xl border border-white/10 bg-[#0a0d2a] py-1.5 pr-3 pl-9 font-['Oxanium'] text-xs text-slate-300 select-none">
                                Cari judul quest atau keahlian...
                            </div>
                        </div>

                        <div className="hidden sm:flex items-center gap-1.5 rounded-xl border border-white/10 bg-[#0a0d2a] px-3 py-1.5 font-['Oxanium'] text-xs text-slate-300">
                            <span>Status: Tersedia</span>
                            <ChevronDown size={12} className="text-slate-400" />
                        </div>
                    </div>
                </div>
            </div>

            {/* ═══════════════════════════════════════════════════════════════
                QUEST ITEM CARDS (1:1 Replica from QuestItemCard.tsx)
               ═══════════════════════════════════════════════════════════════ */}
            <div className="relative z-10 p-4 sm:p-6">
                <div className="grid grid-cols-1 gap-4 text-left md:grid-cols-3">
                    {mockStudentQuests.map((quest) => {
                        const isHovered = hoveredCard === quest.id;

                        return (
                            <div
                                key={quest.id}
                                onMouseEnter={() => setHoveredCard(quest.id)}
                                onMouseLeave={() => setHoveredCard(null)}
                                className={`group relative flex cursor-pointer flex-col justify-between rounded-xl border p-5 transition-all duration-300 ${
                                    isHovered
                                        ? 'border-blue-400 bg-gradient-to-b from-[#111745] to-[#070924] shadow-[0_12px_35px_rgba(59,130,246,0.35)] -translate-y-1.5'
                                        : 'border-white/10 bg-[#070921]/90 hover:border-white/25'
                                }`}
                            >
                                <div>
                                    {/* Top badges (Rank & Status) */}
                                    <div className="mb-3 flex items-center justify-between gap-2">
                                        <span
                                            className={`rounded-md border px-2 py-0.5 font-['Orbitron'] text-[9px] font-bold uppercase tracking-wider ${quest.rankStyle}`}
                                        >
                                            {quest.rank}
                                        </span>
                                        <span className="rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2 py-0.5 font-['Oxanium'] text-[9px] font-bold text-emerald-400">
                                            ● Tersedia
                                        </span>
                                    </div>

                                    {/* Title */}
                                    <h4 className="font-['Orbitron'] text-sm font-bold text-white transition-colors group-hover:text-cyan-300 line-clamp-2">
                                        {quest.title}
                                    </h4>

                                    {/* Salary/Budget — Big Bold Green like in Student */}
                                    <div className="mt-3 flex items-baseline gap-1">
                                        <DollarSign
                                            size={16}
                                            className="text-emerald-400 self-center"
                                        />
                                        <span className="font-['Orbitron'] text-lg font-black text-emerald-400">
                                            {quest.salary}
                                        </span>
                                    </div>

                                    {/* Description */}
                                    <p className="mt-2 font-['Oxanium'] text-xs leading-relaxed text-slate-300 line-clamp-2">
                                        {quest.description}
                                    </p>

                                    {/* Skills Pills */}
                                    <div className="mt-3 flex flex-wrap gap-1">
                                        {quest.skills.map((skill, sIdx) => (
                                            <span
                                                key={sIdx}
                                                className="rounded border border-white/5 bg-slate-900/80 px-1.5 py-0.5 font-['Oxanium'] text-[9px] text-slate-300"
                                            >
                                                {skill}
                                            </span>
                                        ))}
                                    </div>
                                </div>

                                {/* Bottom Metadata & CTA Button */}
                                <div className="mt-5 border-t border-white/10 pt-3 text-[10px] font-['Oxanium'] text-slate-400">
                                    <div className="mb-3 flex items-center justify-between">
                                        <div className="flex items-center gap-1">
                                            <Calendar size={12} className="text-slate-400" />
                                            <span>{quest.deadline}</span>
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <Users size={12} className="text-slate-400" />
                                            <span>{quest.bids} Penawar</span>
                                        </div>
                                    </div>

                                    <button className="flex w-full items-center justify-center gap-1.5 rounded-lg border border-blue-500/40 bg-blue-600/30 py-2 font-['Orbitron'] text-xs font-bold text-white shadow-sm transition-all duration-200 group-hover:bg-blue-600 group-hover:shadow-[0_0_15px_rgba(59,130,246,0.6)]">
                                        <span>Detail & Ajukan Proposal</span>
                                        <ArrowRight
                                            size={12}
                                            className="transition-transform duration-200 group-hover:translate-x-1"
                                        />
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
