import { useState } from 'react';
import {
    Search,
    User as UserIcon,
    Plus,
    Smile,
    SendHorizontal,
    CheckCheck,
    Pin,
    CornerUpLeft,
    Pencil,
    Trash2,
} from 'lucide-react';

interface MockCourseGroup {
    id: string;
    title: string;
    thumbnail: string | null;
    lastMessage: {
        senderName: string;
        message: string;
        time: string;
    };
}

const mockCourseGroups: MockCourseGroup[] = [
    {
        id: 'laravel',
        title: 'Laravel Fundamentals & CRUD',
        thumbnail: null,
        lastMessage: {
            senderName: 'Budi Santoso',
            message: 'Gunakan route model binding di controller...',
            time: '14:28',
        },
    },
    {
        id: 'react',
        title: 'React 19 & Inertia.js v2 SPA',
        thumbnail: null,
        lastMessage: {
            senderName: 'Nadia Kusuma',
            message: 'Partial reload nya sudah jalan lancar mas!',
            time: '11:15',
        },
    },
    {
        id: 'web3',
        title: 'Fullstack Systems & Deployment',
        thumbnail: null,
        lastMessage: {
            senderName: 'Mentor Danu',
            message: 'Jadwal live code review malam ini jam 20:00.',
            time: 'Kemarin',
        },
    },
];

export default function ForumTab() {
    const [selectedCourseId, setSelectedCourseId] = useState<string>('laravel');
    const [hoveredMessageId, setHoveredMessageId] = useState<string | null>(null);
    const [quickReactions, setQuickReactions] = useState<{ [key: string]: number }>({
        '👍': 12,
        '🔥': 7,
    });

    const handleReaction = (emoji: string) => {
        setQuickReactions((prev) => ({
            ...prev,
            [emoji]: (prev[emoji] || 0) + 1,
        }));
    };

    return (
        <div className="relative flex w-full flex-col overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-xl transition-colors duration-300 dark:border-blue-500/20 dark:bg-[#0f0e0e]">
            {/* ═══════════════════════════════════════════════════════════════
                FORUM WORKSPACE (Exact Structure: Sidebar + Chat Area)
               ═══════════════════════════════════════════════════════════════ */}
            <div className="flex min-h-[500px] w-full flex-col md:flex-row overflow-hidden text-left font-sans">
                {/* ── 1. SIDEBAR (1:1 Replica from ForumSidebar.tsx) ── */}
                <div className="flex w-full shrink-0 flex-col border-r border-slate-200 bg-slate-50/70 transition-colors duration-300 md:w-[260px] lg:w-[320px] dark:border-[#3B28F6]/20 dark:bg-[#0f0e0e]">
                    {/* Header Sidebar: Tombol Back Futuristik & Pencarian */}
                    <div className="border-b border-slate-200 p-3.5 dark:border-[#3B28F6]/20">
                        <div className="mb-3 flex items-center gap-3">
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
                                            id="back_border_grad_forum"
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
                                        className="fill-blue-50/80 transition-colors dark:fill-[#080e28]/40"
                                        stroke="url(#back_border_grad_forum)"
                                        strokeWidth="2"
                                        strokeLinejoin="miter"
                                        style={{
                                            filter: 'drop-shadow(0 0 3px rgba(59, 130, 246, 0.35))',
                                        }}
                                    />
                                </svg>
                                <div className="absolute inset-0 flex items-center justify-center text-[#1e3a8a] dark:text-blue-200">
                                    <svg
                                        className="h-6 w-6"
                                        viewBox="0 0 44 44"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="3"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    >
                                        <path d="M 6 17 L 13 10 M 6 17 L 13 24" />
                                        <path d="M 9 17 H 36 C 42 19 43 30 32 30 H 15" />
                                    </svg>
                                </div>
                            </div>

                            <h2 className="font-['Orbitron'] text-xs font-extrabold tracking-wider uppercase text-[#1e3a8a] dark:text-[#F0F0F0]">
                                Forum Group
                            </h2>
                        </div>

                        {/* Input Pencarian dengan Border Gradien Asli */}
                        <div className="relative">
                            <Search className="absolute top-1/2 left-3 z-10 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
                            <div className="w-full rounded-xl border border-slate-300/80 bg-white py-1.5 pr-3 pl-8 font-['Oxanium'] text-xs text-slate-600 shadow-xs select-none dark:border-white/10 dark:bg-[#040812] dark:text-slate-300">
                                Cari grup...
                            </div>
                        </div>
                    </div>

                    {/* Daftar Kursus / Grup (1:1 Replica) */}
                    <div className="flex-1 space-y-1 p-2 overflow-y-auto">
                        {mockCourseGroups.map((group) => {
                            const isActive = selectedCourseId === group.id;
                            return (
                                <div
                                    key={group.id}
                                    onClick={() => setSelectedCourseId(group.id)}
                                    className={`flex cursor-pointer items-center gap-2.5 rounded-lg border p-2.5 transition-all duration-200 ${
                                        isActive
                                            ? 'border-indigo-500/40 bg-indigo-50/80 shadow-xs dark:border-white dark:bg-slate-700/50'
                                            : 'border-slate-200 bg-white hover:bg-slate-50 hover:translate-x-1 dark:border-white/20 dark:bg-transparent dark:hover:bg-slate-700/30'
                                    }`}
                                >
                                    {/* Avatar Kursus */}
                                    <div className="relative flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-slate-200 bg-indigo-100 text-indigo-700 dark:border-white/10 dark:bg-indigo-950 dark:text-indigo-400">
                                        <UserIcon className="h-5 w-5" />
                                    </div>

                                    {/* Info & Cuplikan Chat */}
                                    <div className="min-w-0 flex-1">
                                        <div className="mb-0.5 flex items-center justify-between">
                                            <h3 className="truncate font-['Oxanium'] text-xs font-semibold text-slate-900 dark:text-white">
                                                {group.title}
                                            </h3>
                                            <span className="ml-1 shrink-0 font-['Oxanium'] text-[9px] text-slate-500 dark:text-slate-400">
                                                {group.lastMessage.time}
                                            </span>
                                        </div>
                                        <div className="truncate font-['Oxanium'] text-[11px] text-slate-600 dark:text-slate-400">
                                            <span className="font-semibold text-slate-800 dark:text-slate-300">
                                                {group.lastMessage.senderName}:{' '}
                                            </span>
                                            {group.lastMessage.message}
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* ── 2. CHAT AREA (1:1 Replica from ChatHeader + MessageBubble + MessageInput) ── */}
                <div className="flex flex-1 flex-col justify-between bg-white dark:bg-[#0f0e0e] transition-colors duration-300">
                    {/* Header Chat (1:1 Replica from ChatHeader.tsx dengan Border Gradien) */}
                    <div
                        className="z-10 shrink-0 p-[1px]"
                        style={{
                            background:
                                'linear-gradient(to bottom, #3B28F6 0%, #4c2fff 30%, #7c3aed 50%, #facc15 100%)',
                        }}
                    >
                        <div className="flex items-center justify-between border-b border-slate-200 bg-slate-50/90 px-4 py-3 dark:border-transparent dark:bg-[#0f0e0e]">
                            <div className="flex items-center gap-3">
                                <div className="flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-slate-200 bg-indigo-100 text-indigo-700 dark:border-white/10 dark:bg-indigo-950 dark:text-indigo-400">
                                    <UserIcon className="h-5 w-5" />
                                </div>
                                <div>
                                    <h3 className="font-['Oxanium'] text-xs font-bold text-slate-900 md:text-sm dark:text-white">
                                        Laravel Fundamentals & CRUD
                                    </h3>
                                    <p className="font-['Oxanium'] text-[10px] text-slate-500 dark:text-slate-400">
                                        Grup Diskusi Siswa & Mentor Aktif
                                    </p>
                                </div>
                            </div>

                            <span className="rounded-full border border-emerald-500/30 bg-emerald-50 px-2.5 py-0.5 font-['Oxanium'] text-[10px] font-bold text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400">
                                Online
                            </span>
                        </div>
                    </div>

                    {/* Chat Messages Body (1:1 Replica from MessageBubble.tsx) */}
                    <div className="flex-1 space-y-4 p-4 sm:p-5 overflow-y-auto">
                        {/* Pinned Message Bar */}
                        <div className="mx-auto flex max-w-md items-center gap-2 rounded-lg border border-amber-400/40 bg-amber-50 px-3 py-1.5 font-['Oxanium'] text-[10px] text-amber-900 shadow-xs dark:border-amber-400/30 dark:bg-amber-400/10 dark:text-amber-300">
                            <Pin className="h-3 w-3 rotate-45 text-amber-600 dark:text-[#facc15]" />
                            <span className="truncate">
                                <strong>Disematkan:</strong> Sertakan cuplikan controller & error log saat berkonsultasi.
                            </span>
                        </div>

                        {/* ── BUBBLE 1: Student Message (Incoming Left) ── */}
                        <div
                            onMouseEnter={() => setHoveredMessageId('b1')}
                            onMouseLeave={() => setHoveredMessageId(null)}
                            className="group relative flex max-w-[85%] items-start gap-2.5 mr-auto"
                        >
                            {/* Avatar dengan Border Biru 1:1 */}
                            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border-2 border-[#3B28F6] bg-indigo-50 text-indigo-700 text-xs font-bold dark:bg-slate-900 dark:text-slate-200">
                                FD
                            </div>

                            <div className="relative flex flex-col">
                                {/* Balon Chat Body (Exact 1:1 Student Styling) */}
                                <div
                                    className="relative flex flex-col rounded-[3px] border border-indigo-200 bg-[#eef2ff] p-3 text-slate-800 shadow-[0_1px_3px_rgba(0,0,0,0.05)] transition-all hover:shadow-[0_0_12px_rgba(59,40,246,0.2)] dark:border-[#3B28F6] dark:bg-[#3B28F6]/10 dark:text-slate-100 dark:shadow-[0_0_8px_rgba(59,40,246,0.15)] [--tail-bg:#eef2ff] dark:[--tail-bg:#0f0e0e]"
                                >
                                    {/* Ekor Balon Chat Kiri Asli */}
                                    <div
                                        className="pointer-events-none absolute top-[12px] left-[-6px] z-10 h-[10px] w-[10px]"
                                        style={{
                                            transform: 'rotate(-45deg)',
                                            borderWidth: '1px 0 0 1px',
                                            borderStyle: 'solid',
                                            borderColor: '#3B28F6',
                                            borderRadius: '2px 0 0 0',
                                            background:
                                                'linear-gradient(-45deg, transparent 48%, var(--tail-bg, #eef2ff) 0)',
                                        }}
                                    />

                                    {/* Sender Name with Dynamic Color & Authentic Level Rank */}
                                    <div className="mb-1 flex items-center gap-1.5">
                                        <img
                                            src="/images/ranks/6WSSbYgyA1mDS3Pemc80j80q35Lk3ad0bP6wP5HZ.png"
                                            alt="Hatchling Rank"
                                            className="h-3.5 w-3.5 object-contain"
                                        />
                                        <span
                                            className="font-['Oxanium'] text-xs font-bold text-sky-600 dark:text-[#64D2FF]"
                                        >
                                            Farhan Pratama
                                        </span>
                                    </div>

                                    {/* Message Text */}
                                    <p className="font-['Oxanium'] text-xs leading-relaxed text-slate-800 dark:text-slate-200">
                                        Halo mentor, cara handling route model binding di Laravel 12 dengan custom slug gimana ya? Selalu 404 kalau pake manual query di controller.
                                    </p>

                                    {/* Timestamp & Checkmark */}
                                    <div className="mt-1 flex items-center justify-end gap-1 font-['Oxanium'] text-[9px] text-slate-500 dark:text-slate-400">
                                        <span>14:24</span>
                                        <CheckCheck size={11} className="text-blue-500 dark:text-blue-400" />
                                    </div>
                                </div>

                                {/* Floating Hover Action Bar */}
                                {hoveredMessageId === 'b1' && (
                                    <div className="absolute -top-3 right-0 flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-2 py-0.5 shadow-md animate-in fade-in duration-150 dark:border-white/20 dark:bg-[#0a0d24]">
                                        <button
                                            onClick={() => handleReaction('👍')}
                                            className="hover:scale-125 transition-transform text-xs"
                                        >
                                            👍
                                        </button>
                                        <button
                                            onClick={() => handleReaction('🔥')}
                                            className="hover:scale-125 transition-transform text-xs"
                                        >
                                            🔥
                                        </button>
                                        <button className="hover:scale-125 transition-transform text-xs">
                                            ❤️
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* ── BUBBLE 2: Mentor Reply (Incoming with Mentor Badge) ── */}
                        <div
                            onMouseEnter={() => setHoveredMessageId('b2')}
                            onMouseLeave={() => setHoveredMessageId(null)}
                            className="group relative flex max-w-[85%] items-start gap-2.5 mr-auto"
                        >
                            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border-2 border-[#3B28F6] bg-amber-50 text-amber-700 text-xs font-bold shadow-xs dark:bg-slate-900 dark:text-yellow-400 dark:shadow-[0_0_10px_rgba(251,191,36,0.5)]">
                                BS
                            </div>

                            <div className="relative flex flex-col">
                                <div
                                    className="relative flex flex-col rounded-[3px] border border-indigo-200 bg-[#eef2ff] p-3 text-slate-800 shadow-[0_1px_3px_rgba(0,0,0,0.05)] transition-all hover:shadow-[0_0_12px_rgba(59,40,246,0.2)] dark:border-[#3B28F6] dark:bg-[#3B28F6]/10 dark:text-slate-100 dark:shadow-[0_0_8px_rgba(59,40,246,0.15)] [--tail-bg:#eef2ff] dark:[--tail-bg:#0f0e0e]"
                                >
                                    {/* Ekor Balon Chat Kiri */}
                                    <div
                                        className="pointer-events-none absolute top-[12px] left-[-6px] z-10 h-[10px] w-[10px]"
                                        style={{
                                            transform: 'rotate(-45deg)',
                                            borderWidth: '1px 0 0 1px',
                                            borderStyle: 'solid',
                                            borderColor: '#3B28F6',
                                            borderRadius: '2px 0 0 0',
                                            background:
                                                'linear-gradient(-45deg, transparent 48%, var(--tail-bg, #eef2ff) 0)',
                                        }}
                                    />

                                    {/* Top-Right Badge: Mentor Emerald */}
                                    <div className="absolute top-2 right-2 flex items-center gap-1">
                                        <span className="rounded-xs border border-emerald-500/40 bg-emerald-50 px-1.5 py-[1px] text-[8px] font-bold tracking-wider text-emerald-700 uppercase dark:border-emerald-500/30 dark:bg-emerald-500/20 dark:text-emerald-400">
                                            Mentor
                                        </span>
                                    </div>

                                    {/* Sender Name with Authentic Level Rank */}
                                    <div className="mb-1.5 flex items-center gap-1.5 pr-14">
                                        <img
                                            src="/images/ranks/ztTU3GkHJZTJDrfDddmoKvlob5f8fWSIPhWap69z.png"
                                            alt="Hydra Rank"
                                            className="h-3.5 w-3.5 object-contain"
                                        />
                                        <span
                                            className="font-['Oxanium'] text-xs font-bold text-amber-700 dark:text-[#FF9F0A]"
                                        >
                                            Budi Santoso
                                        </span>
                                    </div>

                                    {/* Message Text & Code */}
                                    <p className="font-['Oxanium'] text-xs leading-relaxed text-slate-800 dark:text-slate-200">
                                        Hai Farhan! Di Laravel 12 kamu cukup tentukan field di parameter rute:
                                    </p>
                                    <div className="my-2 rounded border border-slate-300 bg-slate-900 p-2 font-mono text-[10px] text-emerald-300 shadow-inner dark:border-white/10 dark:bg-black/80 dark:text-emerald-300">
                                        <code>Route::get('/course/{`{course:slug}`}', [CourseController::class, 'show']);</code>
                                    </div>
                                    <p className="font-['Oxanium'] text-[11px] text-slate-700 dark:text-slate-300">
                                        Laravel otomatis mencari data berdasarkan kolom slug tanpa query manual lagi 👍
                                    </p>

                                    {/* Grouped Reactions */}
                                    <div className="mt-2 flex items-center gap-1.5">
                                        <button
                                            onClick={() => handleReaction('👍')}
                                            className="flex items-center gap-1 rounded-full border border-blue-500/30 bg-blue-50 px-2 py-0.5 font-['Oxanium'] text-[10px] font-bold text-blue-700 transition-transform hover:scale-110 dark:bg-blue-500/10 dark:text-blue-300"
                                        >
                                            👍 {quickReactions['👍']}
                                        </button>
                                        <button
                                            onClick={() => handleReaction('🔥')}
                                            className="flex items-center gap-1 rounded-full border border-yellow-500/30 bg-yellow-50 px-2 py-0.5 font-['Oxanium'] text-[10px] font-bold text-yellow-700 transition-transform hover:scale-110 dark:bg-yellow-500/10 dark:text-yellow-300"
                                        >
                                            🔥 {quickReactions['🔥']}
                                        </button>
                                    </div>

                                    {/* Timestamp */}
                                    <div className="mt-1 flex items-center justify-end gap-1 font-['Oxanium'] text-[9px] text-slate-500 dark:text-slate-400">
                                        <span>14:28</span>
                                        <CheckCheck size={11} className="text-blue-500 dark:text-blue-400" />
                                    </div>
                                </div>

                                {hoveredMessageId === 'b2' && (
                                    <div className="absolute -top-3 right-0 flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-2 py-0.5 shadow-md animate-in fade-in duration-150 dark:border-white/20 dark:bg-[#0a0d24]">
                                        <button
                                            onClick={() => handleReaction('👍')}
                                            className="hover:scale-125 transition-transform text-xs"
                                        >
                                            👍
                                        </button>
                                        <button
                                            onClick={() => handleReaction('🔥')}
                                            className="hover:scale-125 transition-transform text-xs"
                                        >
                                            🔥
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* ── BUBBLE 3: Self Message (Outgoing Right, Yellow Border 1:1) ── */}
                        <div
                            onMouseEnter={() => setHoveredMessageId('b3')}
                            onMouseLeave={() => setHoveredMessageId(null)}
                            className="group relative flex max-w-[85%] items-start gap-2.5 ml-auto flex-row-reverse self-end"
                        >
                            <div className="relative flex flex-col items-end">
                                <div
                                    className="relative flex flex-col rounded-[3px] border border-amber-300 bg-[#fefce8] p-3 text-slate-800 shadow-[0_1px_3px_rgba(0,0,0,0.05)] transition-all hover:shadow-[0_0_12px_rgba(250,204,21,0.2)] dark:border-[#facc15] dark:bg-[#facc15]/10 dark:text-slate-100 dark:shadow-[0_0_8px_rgba(250,204,21,0.15)] [--tail-self-bg:#fefce8] dark:[--tail-self-bg:#0f0e0e]"
                                >
                                    {/* Ekor Balon Chat Kanan Asli */}
                                    <div
                                        className="pointer-events-none absolute top-[12px] right-[-5px] z-10 h-[10px] w-[10px]"
                                        style={{
                                            transform: 'rotate(-45deg)',
                                            borderWidth: '0 1px 1px 0',
                                            borderStyle: 'solid',
                                            borderColor: '#facc15',
                                            borderRadius: '0 0 1px 0',
                                            background:
                                                'linear-gradient(-45deg, var(--tail-self-bg, #fefce8) 51%, transparent 0)',
                                        }}
                                    />

                                    <p className="font-['Oxanium'] text-xs leading-relaxed text-slate-900 dark:text-slate-100">
                                        Wah langsung jalan mas Budi, ringkas banget! Terima kasih banyak bantuannya 🙌
                                    </p>

                                    <div className="mt-1 flex items-center justify-end gap-1 font-['Oxanium'] text-[9px] text-slate-500 dark:text-slate-400">
                                        <span>14:30</span>
                                        <CheckCheck size={11} className="text-blue-500 dark:text-blue-400" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* ── 3. MESSAGE INPUT BAR (1:1 Replica from MessageInput.tsx) ── */}
                    <div className="border-t border-slate-200 bg-slate-50/90 p-3 sm:px-4 sm:py-3 dark:border-white/20 dark:bg-[#0f0e0e]">
                        <div className="flex w-full items-end gap-2">
                            {/* Tombol Plus Lampirkan */}
                            <button
                                type="button"
                                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-slate-300 bg-white text-slate-700 transition hover:bg-slate-100 active:scale-95 dark:border-white dark:bg-black/60 dark:text-white dark:hover:bg-white/10"
                            >
                                <Plus size={18} />
                            </button>

                            {/* Tombol Emoji */}
                            <button
                                type="button"
                                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-slate-300 bg-white text-slate-700 transition hover:bg-slate-100 active:scale-95 dark:border-white dark:bg-black/60 dark:text-white dark:hover:bg-white/10"
                            >
                                <Smile size={18} />
                            </button>

                            {/* Kotak Teks Input Pesan */}
                            <div className="flex min-h-[36px] flex-1 items-center rounded-md border border-slate-300 bg-white px-3 py-1.5 font-['Oxanium'] text-xs text-slate-500 shadow-xs select-none dark:border-white/30 dark:bg-black dark:text-white/40">
                                Ketik pesan di Laravel Fundamentals...
                            </div>

                            {/* Tombol Kirim */}
                            <button
                                type="button"
                                className="group flex h-9 w-9 shrink-0 items-center justify-center rounded-md border border-blue-600 bg-blue-600 text-white shadow-xs transition-all hover:bg-blue-700 active:scale-95 dark:border-white/30 dark:bg-black dark:text-white dark:hover:border-white dark:hover:bg-white dark:hover:text-black"
                            >
                                <SendHorizontal
                                    size={18}
                                    className="transition-transform duration-150 group-hover:translate-x-0.5"
                                />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
