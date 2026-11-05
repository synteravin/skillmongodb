import React, { useState } from 'react';
import {
    CheckCircle2,
    Terminal,
    Code2,
    Cpu,
    GitBranch,
    BookOpen,
} from 'lucide-react';
import { StarBackground } from '@/components/Student/PageBackground';

interface FundamentalPath {
    id: string;
    levelName: string;
    title: string;
    description: string;
    icon: any;
    status: 'completed';
}

const fundamentalPaths: FundamentalPath[] = [
    {
        id: 'fund-logic',
        levelName: 'Level 1',
        title: 'Computer Science & Computational Logic',
        description:
            'Algoritma dasar, struktur data primitif, alur logika kondisi & iterasi sistemik.',
        icon: Cpu,
        status: 'completed',
    },
    {
        id: 'fund-git',
        levelName: 'Level 2',
        title: 'Git & Modern Version Control',
        description:
            'Git repository, branch lifecycle, commit hygiene, & kolaborasi tim GitHub.',
        icon: GitBranch,
        status: 'completed',
    },
    {
        id: 'fund-web',
        levelName: 'Level 3',
        title: 'Web & Programming Fundamentals',
        description:
            'Logika dasar web, arsitektur MVC, pemecahan masalah, & skema basis data dasar.',
        icon: BookOpen,
        status: 'completed',
    },
];

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
        avatar?: string;
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
            name: 'Mentor 1',
            role: 'Backend Architect',
            avatar: '/images/default-avatar.svg',
        },
        modules: [
            {
                title: 'PHP 8.4 OOP & Database Relations',
                status: 'done',
                roman: 'I',
                badgeIcon:
                    '/storage/badges/IUUoVXubkU2h0PfUCp7uU0xgknDEGhPimLVcmgkJ.png',
                levelName: 'Level I',
            },
            {
                title: 'Laravel 12 Architecture & Routing',
                status: 'done',
                roman: 'II',
                badgeIcon:
                    '/storage/badges/BpeaKCm8KBZB0wD45LqEzCyRWRKZWhN1N0rD2MKG.png',
                levelName: 'Level II',
            },
            {
                title: 'RESTful API & Sanctum Auth',
                status: 'active',
                roman: 'III',
                badgeIcon:
                    '/storage/badges/IN7lmxHe1ZeYPc4DxngTfYtlG2LpSULfGscqEdu9.png',
                levelName: 'Level III',
            },
            {
                title: 'Queue Workers, Caching & Deployment',
                status: 'locked',
                roman: 'IV',
                badgeIcon:
                    '/storage/badges/CZZ29km2j9e597j8uDHBh42nzDTf4ttPEonSWIf4.png',
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
            name: 'Mentor 2',
            role: 'Frontend Specialist',
            avatar: '/images/default-avatar.svg',
        },
        modules: [
            {
                title: 'Modern HTML5, Semantic UI & Tailwind v4',
                status: 'done',
                roman: 'I',
                badgeIcon:
                    '/storage/badges/IUUoVXubkU2h0PfUCp7uU0xgknDEGhPimLVcmgkJ.png',
                levelName: 'Level I',
            },
            {
                title: 'JavaScript ESNext & TypeScript Basics',
                status: 'done',
                roman: 'II',
                badgeIcon:
                    '/storage/badges/BpeaKCm8KBZB0wD45LqEzCyRWRKZWhN1N0rD2MKG.png',
                levelName: 'Level II',
            },
            {
                title: 'React 19 Hooks & State Management',
                status: 'active',
                roman: 'III',
                badgeIcon:
                    '/storage/badges/IN7lmxHe1ZeYPc4DxngTfYtlG2LpSULfGscqEdu9.png',
                levelName: 'Level III',
            },
            {
                title: 'Inertia.js v2 SPA & Wayfinder Routes',
                status: 'locked',
                roman: 'IV',
                badgeIcon:
                    '/storage/badges/CZZ29km2j9e597j8uDHBh42nzDTf4ttPEonSWIf4.png',
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
    const [hoveredBranchId, setHoveredBranchId] = useState<string | null>(
        'backend',
    );
    const [mobileSelectedTab, setMobileSelectedTab] = useState<
        'backend' | 'frontend'
    >('backend');

    return (
        <div className="relative flex w-full flex-col overflow-hidden rounded-2xl border border-slate-200/80 bg-[#fdfcfc] p-3 text-left font-sans text-slate-800 shadow-2xl transition-colors duration-500 sm:p-6 md:p-8 dark:border-blue-500/20 dark:bg-[#020202] dark:text-white">
            {/* Latar Belakang Kosmik Bintang Asli Ventura */}
            <StarBackground />

            <div className="relative z-10 mx-auto flex min-h-0 w-full flex-1 flex-col">
                {/* ═══════════════════════════════════════════════════════════════
                    HEADER (1:1 Exact Replica from Student/Roadmap.tsx)
                   ═══════════════════════════════════════════════════════════════ */}
                <div className="mb-6 w-full flex-shrink-0">
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
                            <h1 className="pointer-events-none absolute inset-x-0 px-10 text-center font-['Orbitron'] text-xs font-bold tracking-[0.05em] text-[#1e3a8a] uppercase drop-shadow-[0_0_10px_rgba(255,255,255,0.3)] sm:px-16 sm:text-lg md:text-xl md:tracking-[0.12em] lg:text-2xl dark:text-white">
                                Fullstack Web Developer
                            </h1>
                        </div>
                    </div>
                </div>

                {/* ═══════════════════════════════════════════════════════════════
                    ROADMAP TREE STRUCTURE (Clean Symmetrical Side-by-Side)
                   ═══════════════════════════════════════════════════════════════ */}
                <div className="relative flex flex-col items-center">
                    {/* ── 1. STUDENT FUNDAMENTAL NODES (Prerequisite Foundation Track) ── */}
                    <div className="relative z-10 flex w-full max-w-lg flex-col items-center">
                        {fundamentalPaths.map((item, index) => {
                            const ItemIcon = item.icon;

                            return (
                                <React.Fragment key={item.id}>
                                    <div
                                        className="group relative w-full cursor-pointer rounded-sm p-[2px] transition-all duration-300 hover:shadow-[0_4px_18px_rgba(99,102,241,0.35)]"
                                        style={{
                                            background:
                                                'linear-gradient(to right, #3b82f6, #7c3aed, #facc15)',
                                            boxShadow:
                                                '0 0 0 1px rgba(59,130,246,0.4), 0 2px 12px rgba(99,102,241,0.2)',
                                        }}
                                    >
                                        <div className="flex h-full w-full items-center gap-2 rounded-sm bg-white p-2.5 sm:gap-3 sm:p-3 dark:bg-[#0D1037]">
                                            {/* Icon / Thumbnail Box (1:1 from StudentFundamentalNode.tsx) */}
                                            <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center overflow-hidden rounded-lg border-2 border-blue-400 bg-blue-100 sm:h-16 sm:w-16 dark:border-blue-500 dark:bg-blue-900/40">
                                                <ItemIcon className="h-5 w-5 text-blue-500 sm:h-7 sm:w-7 dark:text-cyan-400" />
                                            </div>

                                            {/* Info */}
                                            <div className="min-w-0 flex-1 overflow-hidden">
                                                <div className="flex flex-wrap items-center gap-1 sm:gap-2">
                                                    <span className="font-['Orbitron'] text-[8px] font-bold tracking-wider text-emerald-500 uppercase sm:text-[9px] dark:text-emerald-400">
                                                        Fundamental Track ·{' '}
                                                        {item.levelName}
                                                    </span>
                                                    <span className="py-0.2 rounded bg-emerald-500/20 px-1 text-[7px] font-bold text-emerald-600 sm:px-1.5 sm:py-0.5 sm:text-[8px] dark:text-emerald-300">
                                                        ✓ Completed
                                                    </span>
                                                </div>
                                                <h4 className="font-['Orbitron'] text-[11px] leading-snug font-bold text-slate-900 transition-colors sm:text-sm dark:text-white">
                                                    {item.title}
                                                </h4>
                                                <p className="line-clamp-1 font-['Oxanium'] text-[10px] text-slate-600 sm:text-[11px] dark:text-slate-300">
                                                    {item.description}
                                                </p>
                                            </div>

                                            {/* Right Checkmark Status */}
                                            <div className="flex flex-shrink-0 items-center justify-center sm:pr-1">
                                                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-600 shadow-[0_0_10px_rgba(52,211,153,0.5)] sm:h-8 sm:w-8 dark:text-emerald-400">
                                                    <CheckCircle2 className="h-4 w-4 sm:h-4.5 sm:w-4.5" />
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Central Vertical Connector Line */}
                                    <div className="relative flex h-5 w-full flex-col items-center sm:h-6">
                                        <div className="w-[2px] flex-1 bg-blue-500/70 dark:bg-white/80" />
                                    </div>
                                </React.Fragment>
                            );
                        })}
                    </div>

                    {/* ── ROADMAP BRANCH CONNECTOR (Horizontal T-Split on Desktop) ── */}
                    <div className="relative mb-2 hidden h-8 w-full max-w-[720px] lg:block">
                        {/* Horizontal Line connecting left branch and right branch */}
                        <div className="absolute top-0 right-[25%] left-[25%] h-[2px] bg-blue-500/70 dark:bg-white/80" />
                        {/* Left Vertical Drop into Backend */}
                        <div className="absolute top-0 left-[25%] h-8 w-[2px] bg-blue-500/70 dark:bg-white/80" />
                        {/* Right Vertical Drop into Frontend */}
                        <div className="absolute top-0 right-[25%] h-8 w-[2px] bg-blue-500/70 dark:bg-white/80" />
                    </div>

                    {/* Mobile Branch Tab Switcher (< lg screens) */}
                    <div className="mb-6 flex w-full max-w-xs items-center justify-center gap-1 rounded-xl border border-white/10 bg-[#070921] p-1 font-['Orbitron'] text-[11px] sm:gap-2 sm:text-xs lg:hidden">
                        <button
                            onClick={() => setMobileSelectedTab('backend')}
                            className={`flex flex-1 items-center justify-center gap-1 rounded-lg px-2.5 py-1.5 font-bold whitespace-nowrap transition-all ${
                                mobileSelectedTab === 'backend'
                                    ? 'bg-blue-600 text-white shadow-[0_0_12px_rgba(59,130,246,0.6)]'
                                    : 'text-slate-400 hover:text-white'
                            }`}
                        >
                            <Terminal size={13} />
                            <span>Backend Path</span>
                        </button>
                        <button
                            onClick={() => setMobileSelectedTab('frontend')}
                            className={`flex flex-1 items-center justify-center gap-1 rounded-lg px-2.5 py-1.5 font-bold whitespace-nowrap transition-all ${
                                mobileSelectedTab === 'frontend'
                                    ? 'bg-indigo-600 text-white shadow-[0_0_12px_rgba(99,102,241,0.6)]'
                                    : 'text-slate-400 hover:text-white'
                            }`}
                        >
                            <Code2 size={13} />
                            <span>Frontend Path</span>
                        </button>
                    </div>

                    {/* ── 2. TWO PARALLEL ROADMAP TREES (Backend & Frontend Side-by-Side) ── */}
                    <div className="grid w-full max-w-5xl grid-cols-1 items-start justify-center gap-8 lg:grid-cols-2 lg:gap-12">
                        {authenticCareerGroups.map((group) => {
                            const isSelected = hoveredBranchId === group.id;
                            const isMobileActive =
                                mobileSelectedTab === group.id;
                            const GroupIcon = group.icon;

                            return (
                                <div
                                    key={group.id}
                                    onMouseEnter={() =>
                                        setHoveredBranchId(group.id)
                                    }
                                    className={`flex w-full flex-col items-center transition-opacity duration-300 ${
                                        isMobileActive
                                            ? 'flex'
                                            : 'hidden lg:flex'
                                    }`}
                                >
                                    {/* ── A. CAREER BRANCH CARD (1:1 from StudentCareerBranch.tsx) ── */}
                                    <div
                                        className={`group relative flex w-full flex-col overflow-hidden rounded-xl border-2 transition-all duration-300 ${
                                            isSelected
                                                ? '-translate-y-1 border-[#3B28F6] shadow-[0_0_35px_6px_rgba(59,40,246,0.4)]'
                                                : 'border-slate-300 bg-white opacity-90 hover:border-blue-400 hover:opacity-100 dark:border-blue-900/60 dark:bg-[#050619]/80'
                                        }`}
                                    >
                                        {/* TOP ACCENT LINE (1:1 from StudentCareerBranch.tsx) */}
                                        <div
                                            className={`absolute top-0 right-0 left-0 z-10 h-[3px] bg-gradient-to-r from-transparent ${
                                                group.id === 'backend'
                                                    ? 'via-blue-500'
                                                    : 'via-indigo-500'
                                            } to-transparent`}
                                        />

                                        {/* INNER CARD */}
                                        <div className="relative flex min-h-[270px] w-full flex-col justify-between rounded-xl bg-white p-4 sm:min-h-[290px] sm:p-5 dark:bg-[#050619]">
                                            <div>
                                                {/* Thumbnail Circle */}
                                                <div className="mb-3 flex justify-center">
                                                    <div className="relative">
                                                        <div
                                                            className={`absolute inset-0 scale-110 rounded-full blur-md ${
                                                                group.id ===
                                                                'backend'
                                                                    ? 'bg-blue-500/20'
                                                                    : 'bg-indigo-500/20'
                                                            }`}
                                                        />
                                                        <div
                                                            className={`relative flex h-14 w-14 items-center justify-center overflow-hidden rounded-full border-2 bg-blue-50 shadow-[0_0_20px_rgba(59,130,246,0.4)] transition-transform duration-300 group-hover:scale-105 sm:h-16 sm:w-16 dark:bg-[#0b1333] ${
                                                                group.id ===
                                                                'backend'
                                                                    ? 'border-blue-500 text-blue-600 dark:text-cyan-400'
                                                                    : 'border-indigo-500 text-indigo-600 dark:text-indigo-400'
                                                            }`}
                                                        >
                                                            <GroupIcon className="h-6 w-6 sm:h-7 sm:w-7" />
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Title */}
                                                <h2 className="mb-1 text-center font-['Orbitron'] text-xs font-bold tracking-wider text-slate-900 uppercase sm:text-base dark:text-white">
                                                    {group.name}
                                                </h2>

                                                {/* Description */}
                                                <p className="mb-3 line-clamp-2 text-center text-[10px] leading-relaxed text-slate-500 sm:text-[11px] dark:text-slate-400">
                                                    {group.description}
                                                </p>

                                                {/* Units Stats Box */}
                                                <div className="mb-3 flex justify-center">
                                                    <div className="flex w-full max-w-[200px] flex-col items-center justify-center gap-0.5 rounded-lg border border-[#1A2E99] bg-[#f8faff] px-3 py-1 text-center dark:bg-[#020101]">
                                                        <span className="block text-[8px] font-semibold tracking-wider text-[#1e3a8a] uppercase dark:text-[#F0E427]">
                                                            Learning Path
                                                        </span>
                                                        <span className="block font-['Orbitron'] text-[11px] font-bold text-slate-800 sm:text-xs dark:text-[#B3B3B3]">
                                                            {group.units} Units
                                                            · 4 Modules
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Footer — Mentor & Action Button */}
                                            <div className="relative z-20 flex items-center justify-between border-t border-slate-200 pt-3 dark:border-[#1A2E99]/80">
                                                <div className="flex max-w-[58%] items-center gap-1.5 sm:gap-2">
                                                    {group.mentor.avatar ? (
                                                        <img
                                                            src={
                                                                group.mentor
                                                                    .avatar
                                                            }
                                                            alt={
                                                                group.mentor
                                                                    .name
                                                            }
                                                            className={`h-7 w-7 shrink-0 rounded-full border object-cover shadow-sm transition-all hover:scale-105 sm:h-8 sm:w-8 ${
                                                                group.id ===
                                                                'backend'
                                                                    ? 'border-blue-400 shadow-[0_0_8px_rgba(59,130,246,0.4)]'
                                                                    : 'border-indigo-400 shadow-[0_0_8px_rgba(99,102,241,0.4)]'
                                                            }`}
                                                            onError={(e) => {
                                                                // fallback to initial if image fails
                                                                const parent = (
                                                                    e.target as HTMLElement
                                                                ).parentElement;
                                                                (
                                                                    e.target as HTMLElement
                                                                ).style.display =
                                                                    'none';
                                                                const fallback =
                                                                    parent?.querySelector(
                                                                        '.mentor-fallback-initial',
                                                                    );
                                                                if (fallback)
                                                                    (
                                                                        fallback as HTMLElement
                                                                    ).style.display =
                                                                        'flex';
                                                            }}
                                                        />
                                                    ) : null}
                                                    <div
                                                        className={`mentor-fallback-initial flex h-7 w-7 shrink-0 items-center justify-center rounded-full border text-[9px] font-bold text-white sm:h-8 sm:w-8 sm:text-[10px] ${
                                                            group.id ===
                                                            'backend'
                                                                ? 'border-blue-500 bg-gradient-to-br from-blue-500 to-indigo-600'
                                                                : 'border-indigo-500 bg-gradient-to-br from-indigo-500 to-purple-600'
                                                        } ${group.mentor.avatar ? 'hidden' : 'flex'}`}
                                                    >
                                                        {group.mentor.name.charAt(
                                                            0,
                                                        )}
                                                    </div>
                                                    <div className="flex flex-col truncate">
                                                        <span className="truncate text-[9px] leading-none font-bold text-slate-900 sm:text-[10px] dark:text-[#F0F0F0]">
                                                            {group.mentor.name}
                                                        </span>
                                                        <span className="mt-0.5 truncate text-[7px] text-slate-500 sm:text-[8px] dark:text-slate-400">
                                                            {group.mentor.role}
                                                        </span>
                                                    </div>
                                                </div>

                                                <button
                                                    type="button"
                                                    className={`shrink-0 rounded-lg border px-2.5 py-1 font-['Orbitron'] text-[9px] font-bold tracking-wider uppercase transition-all duration-300 sm:text-[10px] ${
                                                        isSelected
                                                            ? 'border-blue-500 bg-blue-600 text-white shadow-[0_0_12px_rgba(59,130,246,0.6)]'
                                                            : 'border-blue-300 bg-blue-50 text-blue-700 hover:bg-blue-100 dark:border-blue-800 dark:bg-blue-950/40 dark:text-blue-300'
                                                    }`}
                                                >
                                                    {isSelected
                                                        ? 'Branch Aktif'
                                                        : 'Pilih Branch'}
                                                </button>
                                            </div>
                                        </div>
                                    </div>

                                    {/* ── B. VERTICAL CONNECTOR FROM CARD TO PATH NODES ── */}
                                    <div className="relative flex h-6 w-full flex-col items-center sm:h-8">
                                        <div
                                            className={`w-[2px] flex-1 ${
                                                group.id === 'backend'
                                                    ? 'bg-blue-500/70 dark:bg-blue-400/80'
                                                    : 'bg-indigo-500/70 dark:bg-indigo-400/80'
                                            }`}
                                        />
                                    </div>

                                    {/* Section Path Label */}
                                    <div className="mb-3 flex items-center gap-2 sm:mb-4">
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
                                            const isDone =
                                                mod.status === 'done';
                                            const isActive =
                                                mod.status === 'active';
                                            const isLocked =
                                                mod.status === 'locked';

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
                                                            style={{
                                                                minHeight:
                                                                    '60px',
                                                            }}
                                                        >
                                                            {/* Flush Left Badge Box (1:1 from StudentModuleNode.tsx) */}
                                                            <div
                                                                className={`relative flex flex-shrink-0 items-center justify-center self-stretch ${
                                                                    isLocked
                                                                        ? 'bg-[#e2e8f0] dark:bg-[#1e293b]'
                                                                        : 'bg-[#030712] dark:bg-black'
                                                                }`}
                                                                style={{
                                                                    width: '60px',
                                                                    borderRadius:
                                                                        '10px 0 0 10px',
                                                                    overflow:
                                                                        'hidden',
                                                                }}
                                                            >
                                                                {/* Authentic Level Badge Dragon Crest Image */}
                                                                <img
                                                                    src={
                                                                        mod.badgeIcon
                                                                    }
                                                                    alt={`${mod.levelName} Badge`}
                                                                    className={`relative z-10 h-10 w-10 object-contain p-0.5 transition-all duration-300 group-hover:scale-110 sm:h-12 sm:w-12 ${
                                                                        isLocked
                                                                            ? 'opacity-35 grayscale'
                                                                            : isDone
                                                                              ? 'drop-shadow-[0_0_8px_rgba(59,130,246,0.6)]'
                                                                              : 'drop-shadow-[0_0_10px_rgba(99,102,241,0.6)]'
                                                                    }`}
                                                                    onError={(
                                                                        e,
                                                                    ) => {
                                                                        const parent =
                                                                            (
                                                                                e.target as HTMLElement
                                                                            )
                                                                                .parentElement;
                                                                        (
                                                                            e.target as HTMLElement
                                                                        ).style.display =
                                                                            'none';
                                                                        const fallback =
                                                                            parent?.querySelector(
                                                                                '.level-fallback-crest',
                                                                            );
                                                                        if (
                                                                            fallback
                                                                        )
                                                                            (
                                                                                fallback as HTMLElement
                                                                            ).style.display =
                                                                                'flex';
                                                                    }}
                                                                />

                                                                {/* Resilient Fallback Roman Numeral Crest (1:1 from StudentModuleNode.tsx) */}
                                                                <div
                                                                    className="level-fallback-crest hidden h-10 w-10 items-center justify-center rounded-full select-none sm:h-11 sm:w-11"
                                                                    style={{
                                                                        background:
                                                                            isLocked
                                                                                ? 'radial-gradient(circle at 35% 35%, #e2e8f0 0%, #94a3b8 60%, #64748b 100%)'
                                                                                : isDone
                                                                                  ? 'radial-gradient(circle at 35% 35%, #fbbf24 0%, #d97706 60%, #92400e 100%)'
                                                                                  : 'radial-gradient(circle at 35% 35%, #60a5fa 0%, #3b82f6 60%, #1d4ed8 100%)',
                                                                        boxShadow:
                                                                            isLocked
                                                                                ? 'inset 0 2px 4px rgba(255,255,255,0.4), 0 2px 8px rgba(0,0,0,0.15)'
                                                                                : isDone
                                                                                  ? 'inset 0 2px 4px rgba(255,255,255,0.3), 0 0 14px rgba(251,191,36,0.4)'
                                                                                  : 'inset 0 2px 4px rgba(255,255,255,0.3), 0 0 14px rgba(59,130,246,0.4)',
                                                                        border: isLocked
                                                                            ? '2px solid #cbd5e1'
                                                                            : isDone
                                                                              ? '2px solid rgba(251,191,36,0.6)'
                                                                              : '2px solid rgba(96,165,250,0.6)',
                                                                    }}
                                                                >
                                                                    <span
                                                                        className="font-['Orbitron'] text-xs font-bold sm:text-sm"
                                                                        style={{
                                                                            color: isLocked
                                                                                ? '#64748b'
                                                                                : '#fff',
                                                                            textShadow:
                                                                                isLocked
                                                                                    ? 'none'
                                                                                    : '0 1px 3px rgba(0,0,0,0.5)',
                                                                        }}
                                                                    >
                                                                        {
                                                                            mod.roman
                                                                        }
                                                                    </span>
                                                                </div>

                                                                {/* Status badge in bottom right (1:1 from StudentModuleNode.tsx) */}
                                                                <div
                                                                    className="absolute right-1 bottom-1 z-20 flex items-center justify-center"
                                                                    style={{
                                                                        width: '18px',
                                                                        height: '18px',
                                                                        borderRadius:
                                                                            '50%',
                                                                        background:
                                                                            isDone
                                                                                ? '#2563eb'
                                                                                : isLocked
                                                                                  ? '#94a3b8'
                                                                                  : '#3b82f6',
                                                                        border: isDone
                                                                            ? '2px solid #fff'
                                                                            : isLocked
                                                                              ? '2px solid #e2e8f0'
                                                                              : '2px solid #fff',
                                                                        boxShadow:
                                                                            isDone
                                                                                ? '0 0 8px rgba(37,99,235,0.6)'
                                                                                : isLocked
                                                                                  ? 'none'
                                                                                  : '0 0 8px rgba(59,130,246,0.5)',
                                                                    }}
                                                                >
                                                                    {isLocked ? (
                                                                        <svg
                                                                            viewBox="0 0 16 16"
                                                                            fill="white"
                                                                            className="h-2 w-2"
                                                                        >
                                                                            <path d="M11 7V5a3 3 0 1 0-6 0v2H4a1 1 0 0 0-1 1v6a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1V8a1 1 0 0 0-1-1h-1ZM6 5a2 2 0 1 1 4 0v2H6V5Z" />
                                                                        </svg>
                                                                    ) : isDone ? (
                                                                        <svg
                                                                            viewBox="0 0 16 16"
                                                                            fill="none"
                                                                            stroke="white"
                                                                            strokeWidth="2.5"
                                                                            strokeLinecap="round"
                                                                            strokeLinejoin="round"
                                                                            className="h-2 w-2"
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
                                                                            className="h-2 w-2"
                                                                        >
                                                                            <polyline points="5,3 11,8 5,13" />
                                                                        </svg>
                                                                    )}
                                                                </div>
                                                            </div>

                                                            {/* Module Title & Status Label (1:1 Hierarchy) */}
                                                            <div className="relative flex flex-1 flex-col justify-center gap-0.5 overflow-hidden px-2.5 py-1.5 sm:px-4 sm:py-2">
                                                                <span
                                                                    className={`line-clamp-2 font-['Orbitron'] text-[11px] leading-tight font-bold sm:text-sm ${
                                                                        isDone
                                                                            ? 'text-blue-950 dark:text-blue-200'
                                                                            : isLocked
                                                                              ? 'text-slate-400 dark:text-slate-500'
                                                                              : 'text-slate-900 dark:text-white'
                                                                    }`}
                                                                >
                                                                    {mod.title}
                                                                </span>

                                                                <div className="mt-0.5 flex items-center gap-1.5">
                                                                    <span
                                                                        className={`font-['Oxanium'] text-[10px] font-semibold sm:text-[11px] ${
                                                                            isDone
                                                                                ? 'text-blue-600 dark:text-blue-400'
                                                                                : isLocked
                                                                                  ? 'text-slate-400 dark:text-slate-500'
                                                                                  : 'text-indigo-600 dark:text-indigo-400'
                                                                        }`}
                                                                    >
                                                                        {isDone
                                                                            ? 'Completed'
                                                                            : isLocked
                                                                              ? 'Locked'
                                                                              : 'Available'}
                                                                    </span>
                                                                    <span className="text-[9px] text-slate-300 dark:text-slate-600">
                                                                        •
                                                                    </span>
                                                                    <span
                                                                        className={`font-['Orbitron'] text-[8px] font-bold tracking-wider uppercase sm:text-[9px] ${
                                                                            isDone
                                                                                ? 'text-blue-500 dark:text-cyan-400'
                                                                                : isLocked
                                                                                  ? 'text-slate-400 dark:text-slate-600'
                                                                                  : 'text-indigo-500 dark:text-indigo-400'
                                                                        }`}
                                                                    >
                                                                        {
                                                                            mod.levelName
                                                                        }
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
                                                                        <circle
                                                                            cx="12"
                                                                            cy="16"
                                                                            r="1.5"
                                                                            fill="currentColor"
                                                                        />
                                                                    </svg>
                                                                ) : (
                                                                    <div
                                                                        className="flex h-8 w-8 items-center justify-center rounded-full transition-transform duration-200 group-hover:scale-110"
                                                                        style={{
                                                                            background:
                                                                                isDone
                                                                                    ? '#2563eb'
                                                                                    : '#4f46e5',
                                                                            boxShadow:
                                                                                '0 0 10px rgba(59,130,246,0.4)',
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
                                                    style={{
                                                        minHeight: '68px',
                                                    }}
                                                >
                                                    {/* Flush Left Star Badge (1:1 from StudentModuleNode.tsx) */}
                                                    <div
                                                        className="relative flex flex-shrink-0 items-center justify-center self-stretch bg-[#e2e8f0] dark:bg-[#1e293b]"
                                                        style={{
                                                            width: '74px',
                                                            borderRadius:
                                                                '10px 0 0 10px',
                                                            overflow: 'hidden',
                                                        }}
                                                    >
                                                        <div
                                                            className="flex h-11 w-11 items-center justify-center rounded-full"
                                                            style={{
                                                                background:
                                                                    'radial-gradient(circle, #cbd5e1 0%, #94a3b8 100%)',
                                                                boxShadow:
                                                                    'none',
                                                            }}
                                                        >
                                                            <svg
                                                                viewBox="0 0 24 24"
                                                                className="h-6 w-6"
                                                                fill="white"
                                                            >
                                                                <path d="M12 2l2.9 6.3L22 9.3l-5 4.9 1.2 6.9L12 18l-6.2 3.1L7 14.2 2 9.3l7.1-1L12 2z" />
                                                            </svg>
                                                        </div>
                                                        <div
                                                            className="absolute right-1.5 bottom-1.5 z-20 flex items-center justify-center"
                                                            style={{
                                                                width: '20px',
                                                                height: '20px',
                                                                borderRadius:
                                                                    '50%',
                                                                background:
                                                                    '#94a3b8',
                                                                border: '2px solid #e2e8f0',
                                                            }}
                                                        >
                                                            <svg
                                                                viewBox="0 0 16 16"
                                                                fill="white"
                                                                className="h-2.5 w-2.5"
                                                            >
                                                                <path d="M11 7V5a3 3 0 1 0-6 0v2H4a1 1 0 0 0-1 1v6a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1V8a1 1 0 0 0-1-1h-1ZM6 5a2 2 0 1 1 4 0v2H6V5Z" />
                                                            </svg>
                                                        </div>
                                                    </div>

                                                    {/* Submission Title */}
                                                    <div className="relative flex flex-1 flex-col justify-center gap-0.5 overflow-hidden px-4 py-2">
                                                        <span className="truncate font-['Orbitron'] text-xs font-bold text-slate-500 sm:text-sm dark:text-slate-400">
                                                            {
                                                                group.submission
                                                                    .title
                                                            }
                                                        </span>
                                                        <div className="mt-0.5 flex items-center gap-1.5">
                                                            <span className="font-['Oxanium'] text-[11px] font-semibold text-amber-500 dark:text-amber-400">
                                                                Capstone
                                                                Submission
                                                            </span>
                                                            <span className="text-[10px] text-slate-300 dark:text-slate-600">
                                                                •
                                                            </span>
                                                            <span className="font-['Orbitron'] text-[9px] font-bold tracking-wider text-slate-400 uppercase dark:text-slate-500">
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
                                                            <circle
                                                                cx="12"
                                                                cy="16"
                                                                r="1.5"
                                                                fill="currentColor"
                                                            />
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
