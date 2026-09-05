import React, { useState } from 'react';
import {
    CheckCircle2,
    Terminal,
    Code2,
} from 'lucide-react';
import { StarBackground } from '@/components/Student/PageBackground';

interface CareerGroup {
    id: string;
    name: string;
    shortName: string;
    icon: any;
    accentColor: string;
    description: string;
    units: number;
    mentor: {
        name: string;
        role: string;
    };
    modules: {
        title: string;
        status: 'done' | 'active' | 'locked';
        roman: string;
        badgeIcon: string;
        levelName: string;
    }[];
    submission: {
        title: string;
        status: 'done' | 'active' | 'locked';
    };
}

const authenticCareerGroups: CareerGroup[] = [
    {
        id: 'backend',
        name: 'Backend Web Development',
        shortName: 'Backend Path',
        icon: Terminal,
        accentColor: '#3B82F6',
        description:
            'Arsitektur server, basis data relasional, REST API berkinerja tinggi, autentikasi aman, serta deployment.',
        units: 4,
        mentor: {
            name: 'Ridhwan Anang',
            role: 'Backend Architect',
        },
        modules: [
            {
                title: 'PHP 8.4 OOP & Database Relations',
                status: 'done',
                roman: 'I',
                badgeIcon: '/images/badges/IUUoVXubkU2h0PfUCp7uU0xgknDEGhPimLVcmgkJ.png',
                levelName: 'Level I',
            },
            {
                title: 'Laravel 12 Architecture & Routing',
                status: 'done',
                roman: 'II',
                badgeIcon: '/images/badges/BpeaKCm8KBZB0wD45LqEzCyRWRKZWhN1N0rD2MKG.png',
                levelName: 'Level II',
            },
            {
                title: 'RESTful API & Sanctum Auth',
                status: 'active',
                roman: 'III',
                badgeIcon: '/images/badges/IN7lmxHe1ZeYPc4DxngTfYtlG2LpSULfGscqEdu9.png',
                levelName: 'Level III',
            },
            {
                title: 'Queue Workers, Caching & Deployment',
                status: 'locked',
                roman: 'IV',
                badgeIcon: '/images/badges/CZZ29km2j9e597j8uDHBh42nzDTf4ttPEonSWIf4.png',
                levelName: 'Level IV',
            },
        ],
        submission: {
            title: 'Submission: RESTful API Capstone Project',
            status: 'locked',
        },
    },
    {
        id: 'frontend',
        name: 'Frontend Web Development',
        shortName: 'Frontend Path',
        icon: Code2,
        accentColor: '#6366F1',
        description:
            'Antarmuka modern responsif, state management, SPA client-side routing, dan interaksi komponen terisolasi.',
        units: 4,
        mentor: {
            name: 'Ray Brandon',
            role: 'Frontend Specialist',
        },
        modules: [
            {
                title: 'Modern HTML5, Semantic UI & Tailwind v4',
                status: 'done',
                roman: 'I',
                badgeIcon: '/images/badges/IUUoVXubkU2h0PfUCp7uU0xgknDEGhPimLVcmgkJ.png',
                levelName: 'Level I',
            },
            {
                title: 'JavaScript ESNext & TypeScript Basics',
                status: 'done',
                roman: 'II',
                badgeIcon: '/images/badges/BpeaKCm8KBZB0wD45LqEzCyRWRKZWhN1N0rD2MKG.png',
                levelName: 'Level II',
            },
            {
                title: 'React 19 Hooks & State Management',
                status: 'active',
                roman: 'III',
                badgeIcon: '/images/badges/IN7lmxHe1ZeYPc4DxngTfYtlG2LpSULfGscqEdu9.png',
                levelName: 'Level III',
            },
            {
                title: 'Inertia.js v2 SPA & Wayfinder Routes',
                status: 'locked',
                roman: 'IV',
                badgeIcon: '/images/badges/CZZ29km2j9e597j8uDHBh42nzDTf4ttPEonSWIf4.png',
                levelName: 'Level IV',
            },
        ],
        submission: {
            title: 'Submission: Interactive Dashboard App',
            status: 'locked',
        },
    },
];

export default function SkillTreeTab() {
    const [hoveredBranchId, setHoveredBranchId] = useState<string | null>('backend');
    const [mobileSelectedTab, setMobileSelectedTab] = useState<'backend' | 'frontend'>('backend');

    return (
        <div className="relative flex w-full flex-col overflow-hidden rounded-2xl border border-blue-500/20 bg-[#fdfcfc] p-3 text-slate-800 shadow-2xl transition-colors duration-500 sm:p-6 md:p-8 dark:bg-[#020202] dark:text-white text-left font-sans">
            {/* Latar Belakang Kosmik Bintang Asli Ventura */}
            <StarBackground />

            <div className="relative z-10 mx-auto flex min-h-0 w-full flex-1 flex-col">
                {/* ═══════════════════════════════════════════════════════════════
                    HEADER (1:1 Exact Replica from Student/Roadmap.tsx)
                   ═══════════════════════════════════════════════════════════════ */}
                <div className="w-full flex-shrink-0 mb-6">
                    <div
                        className="relative rounded-md p-[2px] md:p-[3px]"
                        style={{
                            backgroundImage:
                                'linear-gradient(to bottom, #3B28F6 0%, #4c2fff 30%, #7c3aed 50%, #facc15 100%)',
                        }}
                    >
                        <div className="flex items-center gap-4 rounded-[4px] bg-white px-4 py-3 md:px-6 dark:bg-[#040812]">
                            {/* Tombol Back Retro Asli Roadmap */}
                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded border-2 border-blue-800 bg-gray-200 p-2 transition-colors hover:border-blue-600 hover:bg-blue-900/40 md:h-12 md:w-12 dark:bg-[#0b1021]">
                                <svg
                                    viewBox="0 0 48 48"
                                    className="h-7 w-7 scale-125 text-indigo-600 transition-transform duration-200 hover:scale-150 md:h-9 md:w-9 dark:text-indigo-500"
                                >
                                    <rect
                                        x="12"
                                        y="20"
                                        width="29"
                                        height="4"
                                        fill="currentColor"
                                    />
                                    <rect
                                        x="8"
                                        y="20"
                                        width="4"
                                        height="4"
                                        fill="currentColor"
                                    />
                                    <rect
                                        x="5"
                                        y="20"
                                        width="5"
                                        height="4"
                                        fill="currentColor"
                                    />
                                    <rect
                                        x="8"
                                        y="16"
                                        width="4"
                                        height="4"
                                        fill="currentColor"
                                    />
                                    <rect
                                        x="8"
                                        y="24"
                                        width="4"
                                        height="4"
                                        fill="currentColor"
                                    />
                                    <rect
                                        x="12"
                                        y="12"
                                        width="4"
                                        height="4"
                                        fill="currentColor"
                                    />
                                    <rect
                                        x="12"
                                        y="28"
                                        width="4"
                                        height="4"
                                        fill="currentColor"
                                    />
                                    <rect
                                        x="16"
                                        y="8"
                                        width="4"
                                        height="4"
                                        fill="currentColor"
                                    />
                                    <rect
                                        x="16"
                                        y="32"
                                        width="4"
                                        height="4"
                                        fill="currentColor"
                                    />
                                </svg>
                            </div>

                            {/* Course Title */}
                            <h1 className="pointer-events-none absolute right-0 left-0 px-16 text-center font-['Orbitron'] text-base font-bold tracking-[0.08em] text-[#1e3a8a] uppercase drop-shadow-[0_0_10px_rgba(255,255,255,0.3)] sm:text-lg md:text-xl md:tracking-[0.12em] lg:text-2xl dark:text-white">
                                Fullstack Web Developer
                            </h1>
                        </div>
                    </div>
                </div>

                {/* ═══════════════════════════════════════════════════════════════
                    ROADMAP TREE STRUCTURE (Clean Symmetrical Side-by-Side)
                   ═══════════════════════════════════════════════════════════════ */}
                <div className="relative flex flex-col items-center">
                    {/* ── 1. STUDENT FUNDAMENTAL NODE (1:1 from StudentFundamentalNode.tsx) ── */}
                    <div className="relative z-10 flex w-full max-w-lg flex-col items-center">
                        <div
                            className="group relative w-full cursor-pointer rounded-sm p-[2px] transition-all duration-300 hover:shadow-[0_4px_18px_rgba(99,102,241,0.35)]"
                            style={{
                                background:
                                    'linear-gradient(to right, #3b82f6, #7c3aed, #facc15)',
                                boxShadow:
                                    '0 0 0 1px rgba(59,130,246,0.4), 0 2px 12px rgba(99,102,241,0.2)',
                            }}
                        >
                            <div className="flex h-full w-full items-center gap-3 rounded-sm bg-white p-3 dark:bg-[#0D1037]">
                                {/* Icon / Thumbnail Box (1:1 from StudentFundamentalNode.tsx) */}
                                <div className="flex h-16 w-16 flex-shrink-0 items-center justify-center overflow-hidden rounded-lg border-2 border-blue-400 bg-blue-100 dark:border-blue-500 dark:bg-blue-900/40">
                                    <svg
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        className="h-7 w-7 text-blue-500 dark:text-cyan-400"
                                    >
                                        <path
                                            d="M2 6c0-1.1.9-2 2-2h5a3 3 0 0 1 3 3v13a2.5 2.5 0 0 0-2.5-2.5H4a2 2 0 0 1-2-2V6Z"
                                            stroke="currentColor"
                                            strokeWidth="1.5"
                                            strokeLinejoin="round"
                                        />
                                        <path
                                            d="M22 6c0-1.1-.9-2-2-2h-5a3 3 0 0 0-3 3v13a2.5 2.5 0 0 1 2.5-2.5H20a2 2 0 0 0 2-2V6Z"
                                            stroke="currentColor"
                                            strokeWidth="1.5"
                                            strokeLinejoin="round"
                                        />
                                    </svg>
                                </div>

                                {/* Info */}
                                <div className="flex-1 overflow-hidden">
                                    <div className="flex items-center gap-2">
                                        <span className="font-['Orbitron'] text-[9px] font-bold tracking-widest text-emerald-500 uppercase dark:text-emerald-400">
                                            Fundamental Track
                                        </span>
                                        <span className="rounded bg-emerald-500/20 px-1.5 py-0.5 text-[8px] font-bold text-emerald-600 dark:text-emerald-300">
                                            ✓ Completed
                                        </span>
                                    </div>
                                    <h4 className="font-['Orbitron'] text-xs font-bold text-slate-900 transition-colors sm:text-sm dark:text-white">
                                        Web & Programming Fundamentals
                                    </h4>
                                    <p className="line-clamp-1 font-['Oxanium'] text-[11px] text-slate-600 dark:text-slate-300">
                                        Logika dasar, arsitektur MVC, pemecahan masalah, & skema basis data dasar
                                    </p>
                                </div>

                                {/* Right Checkmark Status */}
                                <div className="flex flex-shrink-0 items-center justify-center pr-1">
                                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-600 shadow-[0_0_10px_rgba(52,211,153,0.5)] dark:text-emerald-400">
                                        <CheckCircle2 size={18} />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Central Vertical Connector Line down to Branch Split */}
                        <div className="relative flex h-8 w-full flex-col items-center">
                            <div className="w-[2px] flex-1 bg-blue-500/70 dark:bg-white/80" />
                        </div>
                    </div>

                    {/* ── ROADMAP BRANCH CONNECTOR (Horizontal T-Split on Desktop) ── */}
                    <div className="relative mb-2 hidden h-8 w-full max-w-[720px] lg:block">
                        {/* Horizontal Line connecting left branch and right branch */}
                        <div className="absolute top-0 left-[25%] right-[25%] h-[2px] bg-blue-500/70 dark:bg-white/80" />
                        {/* Left Vertical Drop into Backend */}
                        <div className="absolute top-0 left-[25%] h-8 w-[2px] bg-blue-500/70 dark:bg-white/80" />
                        {/* Right Vertical Drop into Frontend */}
                        <div className="absolute top-0 right-[25%] h-8 w-[2px] bg-blue-500/70 dark:bg-white/80" />
                    </div>

                    {/* Mobile Branch Tab Switcher (< lg screens) */}
                    <div className="mb-6 flex lg:hidden items-center justify-center gap-2 rounded-xl border border-white/10 bg-[#070921] p-1 font-['Orbitron'] text-xs">
                        <button
                            onClick={() => setMobileSelectedTab('backend')}
                            className={`flex items-center gap-1.5 rounded-lg px-3.5 py-1.5 font-bold transition-all ${
                                mobileSelectedTab === 'backend'
                                    ? 'bg-blue-600 text-white shadow-[0_0_12px_rgba(59,130,246,0.6)]'
                                    : 'text-slate-400 hover:text-white'
                            }`}
                        >
                            <Terminal size={14} />
                            <span>Backend Path</span>
                        </button>
                        <button
                            onClick={() => setMobileSelectedTab('frontend')}
                            className={`flex items-center gap-1.5 rounded-lg px-3.5 py-1.5 font-bold transition-all ${
                                mobileSelectedTab === 'frontend'
                                    ? 'bg-indigo-600 text-white shadow-[0_0_12px_rgba(99,102,241,0.6)]'
                                    : 'text-slate-400 hover:text-white'
                            }`}
                        >
                            <Code2 size={14} />
                            <span>Frontend Path</span>
                        </button>
                    </div>

                    {/* ── 2. TWO PARALLEL ROADMAP TREES (Backend & Frontend Side-by-Side) ── */}
                    <div className="grid w-full max-w-5xl grid-cols-1 gap-8 lg:grid-cols-2 lg:gap-12 items-start justify-center">
                        {authenticCareerGroups.map((group) => {
                            const isSelected = hoveredBranchId === group.id;
                            const isMobileActive = mobileSelectedTab === group.id;
                            const GroupIcon = group.icon;

                            return (
                                <div
                                    key={group.id}
                                    onMouseEnter={() => setHoveredBranchId(group.id)}
                                    className={`flex flex-col items-center w-full transition-opacity duration-300 ${
                                        isMobileActive ? 'flex' : 'hidden lg:flex'
                                    }`}
                                >
                                    {/* ── A. CAREER BRANCH CARD (1:1 from StudentCareerBranch.tsx) ── */}
                                    <div
                                        className={`group relative flex w-full flex-col overflow-hidden rounded-xl border-2 transition-all duration-300 ${
                                            isSelected
                                                ? 'border-[#3B28F6] shadow-[0_0_35px_6px_rgba(59,40,246,0.4)] -translate-y-1'
                                                : 'border-slate-300 bg-white opacity-90 hover:opacity-100 hover:border-blue-400 dark:border-blue-900/60 dark:bg-[#050619]/80'
                                        }`}
                                    >
                                        {/* TOP ACCENT LINE (1:1 from StudentCareerBranch.tsx) */}
                                        <div
                                            className={`absolute top-0 right-0 left-0 z-10 h-[3px] bg-gradient-to-r from-transparent ${
                                                group.id === 'backend' ? 'via-blue-500' : 'via-indigo-500'
                                            } to-transparent`}
                                        />

                                        {/* INNER CARD */}
                                        <div className="relative flex w-full min-h-[290px] flex-col justify-between rounded-xl p-5 bg-white dark:bg-[#050619]">
                                            <div>
                                                {/* Thumbnail Circle */}
                                                <div className="mb-3 flex justify-center">
                                                    <div className="relative">
                                                        <div
                                                            className={`absolute inset-0 scale-110 rounded-full blur-md ${
                                                                group.id === 'backend' ? 'bg-blue-500/20' : 'bg-indigo-500/20'
                                                            }`}
                                                        />
                                                        <div
                                                            className={`relative flex h-16 w-16 items-center justify-center overflow-hidden rounded-full border-2 bg-blue-50 shadow-[0_0_20px_rgba(59,130,246,0.4)] transition-transform duration-300 group-hover:scale-105 dark:bg-[#0b1333] ${
                                                                group.id === 'backend'
                                                                    ? 'border-blue-500 text-blue-600 dark:text-cyan-400'
                                                                    : 'border-indigo-500 text-indigo-600 dark:text-indigo-400'
                                                            }`}
                                                        >
                                                            <GroupIcon size={28} />
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Title */}
                                                <h2 className="mb-1 text-center font-['Orbitron'] text-sm font-bold tracking-wider text-slate-900 uppercase sm:text-base dark:text-white">
                                                    {group.name}
                                                </h2>

                                                {/* Description */}
                                                <p className="mb-3 line-clamp-2 text-center text-[11px] leading-relaxed text-slate-500 dark:text-slate-400">
                                                    {group.description}
                                                </p>

                                                {/* Units Stats Box */}
                                                <div className="mb-3 flex justify-center">
                                                    <div className="flex w-full max-w-[200px] flex-col items-center justify-center gap-0.5 rounded-lg border border-[#1A2E99] bg-[#f8faff] py-1 px-3 text-center dark:bg-[#020101]">
                                                        <span className="block text-[8px] font-semibold tracking-wider text-[#1e3a8a] uppercase dark:text-[#F0E427]">
                                                            Learning Path
                                                        </span>
                                                        <span className="block font-['Orbitron'] text-xs font-bold text-slate-800 dark:text-[#B3B3B3]">
                                                            {group.units} Units · 4 Modules
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Footer — Mentor & Action Button */}
                                            <div className="relative z-20 flex items-center justify-between border-t border-slate-200 pt-3 dark:border-[#1A2E99]/80">
                                                <div className="flex max-w-[60%] items-center gap-2">
                                                    <div
                                                        className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full border text-white text-[10px] font-bold ${
                                                            group.id === 'backend'
                                                                ? 'border-blue-500 bg-gradient-to-br from-blue-500 to-indigo-600'
                                                                : 'border-indigo-500 bg-gradient-to-br from-indigo-500 to-purple-600'
                                                        }`}
                                                    >
                                                        {group.mentor.name.charAt(0)}
                                                    </div>
                                                    <div className="flex flex-col truncate">
                                                        <span className="truncate text-[10px] leading-none font-bold text-slate-900 dark:text-[#F0F0F0]">
                                                            {group.mentor.name}
                                                        </span>
                                                        <span className="mt-0.5 truncate text-[8px] text-slate-500 dark:text-slate-400">
                                                            {group.mentor.role}
                                                        </span>
                                                    </div>
                                                </div>

                                                <button
                                                    type="button"
                                                    className={`shrink-0 rounded-lg border px-3 py-1 font-['Orbitron'] text-[10px] font-bold tracking-wider uppercase transition-all duration-300 ${
                                                        isSelected
                                                            ? 'border-blue-500 bg-blue-600 text-white shadow-[0_0_12px_rgba(59,130,246,0.6)]'
                                                            : 'border-blue-300 bg-blue-50 text-blue-700 hover:bg-blue-100 dark:border-blue-800 dark:bg-blue-950/40 dark:text-blue-300'
                                                    }`}
                                                >
                                                    {isSelected ? 'Branch Aktif' : 'Pilih Branch'}
                                                </button>
                                            </div>
                                        </div>
                                    </div>

                                    {/* ── B. VERTICAL CONNECTOR FROM CARD TO PATH NODES ── */}
                                    <div className="relative flex h-8 w-full flex-col items-center">
                                        <div
                                            className={`w-[2px] flex-1 ${
                                                group.id === 'backend'
                                                    ? 'bg-blue-500/70 dark:bg-blue-400/80'
                                                    : 'bg-indigo-500/70 dark:bg-indigo-400/80'
                                            }`}
                                        />
                                    </div>

                                    {/* Section Path Label */}
                                    <div className="mb-4 flex items-center gap-2">
                                        <div
                                            className={`h-[1px] w-6 bg-gradient-to-l ${
                                                group.id === 'backend'
                                                    ? 'from-blue-500'
                                                    : 'from-indigo-500'
                                            } to-transparent`}
                                        />
                                        <span
                                            className={`font-['Orbitron'] text-[9px] font-bold tracking-[0.25em] uppercase ${
                                                group.id === 'backend'
                                                    ? 'text-blue-600 dark:text-blue-400'
                                                    : 'text-indigo-600 dark:text-indigo-400'
                                            }`}
                                        >
                                            {group.shortName}
                                        </span>
                                        <div
                                            className={`h-[1px] w-6 bg-gradient-to-r ${
                                                group.id === 'backend'
                                                    ? 'from-blue-500'
                                                    : 'from-indigo-500'
                                            } to-transparent`}
                                        />
                                    </div>

                                    {/* ── C. MODULE NODES LIST (1:1 from StudentModuleNode.tsx) ── */}
                                    <div className="flex w-full flex-col items-center space-y-0">
                                        {group.modules.map((mod, index) => {
                                            const isDone = mod.status === 'done';
                                            const isActive = mod.status === 'active';
                                            const isLocked = mod.status === 'locked';

                                            return (
                                                <div
                                                    key={mod.title + index}
                                                    className="relative flex w-full flex-col items-center"
                                                >
                                                    {/* Node Card */}
                                                    <div
                                                        className="relative block w-full rounded-[14px] p-[2px] transition-all duration-300 hover:scale-[1.02] hover:shadow-lg"
                                                        style={{
                                                            background: isDone
                                                                ? 'linear-gradient(135deg, #60a5fa, #3b82f6, #93c5fd)'
                                                                : isLocked
                                                                  ? 'linear-gradient(135deg, #cbd5e1, #94a3b8, #cbd5e1)'
                                                                  : 'linear-gradient(135deg, #60a5fa, #818cf8, #60a5fa)',
                                                            boxShadow: isDone
                                                                ? '0 2px 14px rgba(59,130,246,0.2)'
                                                                : isLocked
                                                                  ? 'none'
                                                                  : '0 2px 14px rgba(99,102,241,0.25)',
                                                        }}
                                                    >
                                                        <div
                                                            className={`flex w-full items-center gap-0 overflow-hidden rounded-[12px] ${
                                                                isDone
                                                                    ? 'bg-white dark:bg-[#060e28]'
                                                                    : isLocked
                                                                      ? 'bg-slate-100 dark:bg-[#070b18]'
                                                                      : 'bg-white dark:bg-[#081233]'
                                                            }`}
                                                            style={{ minHeight: '68px' }}
                                                        >
                                                            {/* Flush Left Badge Box (1:1 from StudentModuleNode.tsx) */}
                                                            <div
                                                                className={`relative flex flex-shrink-0 items-center justify-center self-stretch ${
                                                                    isLocked
                                                                        ? 'bg-[#e2e8f0] dark:bg-[#1e293b]'
                                                                        : 'bg-[#030712] dark:bg-black'
                                                                }`}
                                                                style={{
                                                                    width: '74px',
                                                                    borderRadius: '10px 0 0 10px',
                                                                    overflow: 'hidden',
                                                                }}
                                                            >
                                                                {/* Authentic Level Badge Dragon Crest Image */}
                                                                <img
                                                                    src={mod.badgeIcon}
                                                                    alt={`${mod.levelName} Badge`}
                                                                    className={`h-12 w-12 object-contain p-0.5 transition-all duration-300 group-hover:scale-110 ${
                                                                        isLocked
                                                                            ? 'opacity-35 grayscale'
                                                                            : isDone
                                                                              ? 'drop-shadow-[0_0_8px_rgba(59,130,246,0.6)]'
                                                                              : 'drop-shadow-[0_0_10px_rgba(99,102,241,0.6)]'
                                                                    }`}
                                                                    onError={(e) => {
                                                                        (e.target as HTMLElement).style.display = 'none';
                                                                    }}
                                                                />

                                                                {/* Status badge in bottom right (1:1 from StudentModuleNode.tsx) */}
                                                                <div
                                                                    className="absolute right-1.5 bottom-1.5 z-20 flex items-center justify-center"
                                                                    style={{
                                                                        width: '20px',
                                                                        height: '20px',
                                                                        borderRadius: '50%',
                                                                        background: isDone
                                                                            ? '#2563eb'
                                                                            : isLocked
                                                                              ? '#94a3b8'
                                                                              : '#3b82f6',
                                                                        border: isDone
                                                                            ? '2px solid #fff'
                                                                            : isLocked
                                                                              ? '2px solid #e2e8f0'
                                                                              : '2px solid #fff',
                                                                        boxShadow: isDone
                                                                            ? '0 0 8px rgba(37,99,235,0.6)'
                                                                            : isLocked
                                                                              ? 'none'
                                                                              : '0 0 8px rgba(59,130,246,0.5)',
                                                                    }}
                                                                >
                                                                    {isLocked ? (
                                                                        <svg viewBox="0 0 16 16" fill="white" className="h-2.5 w-2.5">
                                                                            <path d="M11 7V5a3 3 0 1 0-6 0v2H4a1 1 0 0 0-1 1v6a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1V8a1 1 0 0 0-1-1h-1ZM6 5a2 2 0 1 1 4 0v2H6V5Z" />
                                                                        </svg>
                                                                    ) : isDone ? (
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

                                                            {/* Module Title & Status Label (1:1 Hierarchy) */}
                                                            <div className="relative flex flex-1 flex-col justify-center gap-0.5 overflow-hidden px-4 py-2">
                                                                <span
                                                                    className={`font-['Orbitron'] text-xs sm:text-sm font-bold leading-snug truncate ${
                                                                        isDone
                                                                            ? 'text-blue-950 dark:text-blue-200'
                                                                            : isLocked
                                                                              ? 'text-slate-400 dark:text-slate-500'
                                                                              : 'text-slate-900 dark:text-white'
                                                                    }`}
                                                                >
                                                                    {mod.title}
                                                                </span>

                                                                <div className="flex items-center gap-1.5 mt-0.5">
                                                                    <span
                                                                        className={`font-['Oxanium'] text-[11px] font-semibold ${
                                                                            isDone
                                                                                ? 'text-blue-600 dark:text-blue-400'
                                                                                : isLocked
                                                                                  ? 'text-slate-400 dark:text-slate-500'
                                                                                  : 'text-indigo-600 dark:text-indigo-400'
                                                                        }`}
                                                                    >
                                                                        {isDone ? 'Completed' : isLocked ? 'Locked' : 'Available'}
                                                                    </span>
                                                                    <span className="text-[10px] text-slate-300 dark:text-slate-600">•</span>
                                                                    <span
                                                                        className={`font-['Orbitron'] text-[9px] font-bold tracking-wider uppercase ${
                                                                            isDone
                                                                                ? 'text-blue-500 dark:text-cyan-400'
                                                                                : isLocked
                                                                                  ? 'text-slate-400 dark:text-slate-600'
                                                                                  : 'text-indigo-500 dark:text-indigo-400'
                                                                        }`}
                                                                    >
                                                                        {mod.levelName}
                                                                    </span>
                                                                </div>
                                                            </div>

                                                            {/* Right Action Button (1:1 from StudentModuleNode.tsx) */}
                                                            <div className="flex flex-shrink-0 items-center justify-center pr-4">
                                                                {isLocked ? (
                                                                    <svg
                                                                        viewBox="0 0 24 24"
                                                                        fill="none"
                                                                        className="h-5 w-5 text-slate-400 dark:text-slate-600"
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
                                                                        <circle cx="12" cy="16" r="1.5" fill="currentColor" />
                                                                    </svg>
                                                                ) : (
                                                                    <div
                                                                        className="flex h-8 w-8 items-center justify-center rounded-full transition-transform duration-200 group-hover:scale-110"
                                                                        style={{
                                                                            background: isDone ? '#2563eb' : '#4f46e5',
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

                                                    {/* Vertical Connector Line to Next Node */}
                                                    <div className="relative flex h-5 w-full flex-col items-center">
                                                        <div className="w-[2px] flex-1 bg-blue-200 dark:bg-blue-900/60" />
                                                    </div>
                                                </div>
                                            );
                                        })}

                                        {/* ── D. CAPSTONE SUBMISSION NODE (1:1 from StudentCareerBranch.tsx) ── */}
                                        <div className="relative flex w-full flex-col items-center">
                                            <div
                                                className="relative block w-full rounded-[14px] p-[2px] transition-all duration-300 hover:scale-[1.02]"
                                                style={{
                                                    background:
                                                        'linear-gradient(135deg, #cbd5e1, #94a3b8, #cbd5e1)',
                                                    boxShadow: 'none',
                                                }}
                                            >
                                                <div
                                                    className="flex w-full items-center gap-0 overflow-hidden rounded-[12px] bg-slate-100 dark:bg-[#070b18]"
                                                    style={{ minHeight: '68px' }}
                                                >
                                                    {/* Flush Left Star Badge (1:1 from StudentModuleNode.tsx) */}
                                                    <div
                                                        className="relative flex flex-shrink-0 items-center justify-center self-stretch bg-[#e2e8f0] dark:bg-[#1e293b]"
                                                        style={{
                                                            width: '74px',
                                                            borderRadius: '10px 0 0 10px',
                                                            overflow: 'hidden',
                                                        }}
                                                    >
                                                        <div
                                                            className="flex h-11 w-11 items-center justify-center rounded-full"
                                                            style={{
                                                                background:
                                                                    'radial-gradient(circle, #cbd5e1 0%, #94a3b8 100%)',
                                                                boxShadow: 'none',
                                                            }}
                                                        >
                                                            <svg viewBox="0 0 24 24" className="h-6 w-6" fill="white">
                                                                <path d="M12 2l2.9 6.3L22 9.3l-5 4.9 1.2 6.9L12 18l-6.2 3.1L7 14.2 2 9.3l7.1-1L12 2z" />
                                                            </svg>
                                                        </div>
                                                        <div
                                                            className="absolute right-1.5 bottom-1.5 z-20 flex items-center justify-center"
                                                            style={{
                                                                width: '20px',
                                                                height: '20px',
                                                                borderRadius: '50%',
                                                                background: '#94a3b8',
                                                                border: '2px solid #e2e8f0',
                                                            }}
                                                        >
                                                            <svg viewBox="0 0 16 16" fill="white" className="h-2.5 w-2.5">
                                                                <path d="M11 7V5a3 3 0 1 0-6 0v2H4a1 1 0 0 0-1 1v6a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1V8a1 1 0 0 0-1-1h-1ZM6 5a2 2 0 1 1 4 0v2H6V5Z" />
                                                            </svg>
                                                        </div>
                                                    </div>

                                                    {/* Submission Title */}
                                                    <div className="relative flex flex-1 flex-col justify-center gap-0.5 overflow-hidden px-4 py-2">
                                                        <span className="font-['Orbitron'] text-xs sm:text-sm font-bold text-slate-500 dark:text-slate-400 truncate">
                                                            {group.submission.title}
                                                        </span>
                                                        <div className="flex items-center gap-1.5 mt-0.5">
                                                            <span className="font-['Oxanium'] text-[11px] font-semibold text-amber-500 dark:text-amber-400">
                                                                Capstone Submission
                                                            </span>
                                                            <span className="text-[10px] text-slate-300 dark:text-slate-600">•</span>
                                                            <span className="font-['Orbitron'] text-[9px] font-bold tracking-wider uppercase text-slate-400 dark:text-slate-500">
                                                                Final Project
                                                            </span>
                                                        </div>
                                                    </div>

                                                    {/* Right Lock Icon */}
                                                    <div className="flex shrink-0 items-center pr-4">
                                                        <svg
                                                            viewBox="0 0 24 24"
                                                            fill="none"
                                                            className="h-5 w-5 text-slate-400 dark:text-slate-600"
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
                                                            <circle cx="12" cy="16" r="1.5" fill="currentColor" />
                                                        </svg>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
}
