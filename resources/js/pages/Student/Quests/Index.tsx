import { Link, router, usePage } from '@inertiajs/react';
import React, { useState } from 'react';
import {
    Search,
    Compass,
    Activity,
    Info,
    CheckCircle2,
    Plus,
    History,
    ArrowLeft,
    Briefcase,
    Sparkles,
} from 'lucide-react';

import { Quest } from '@/types/quest';
import QuestItemCard from '@/components/Quest/QuestItemCard';

interface Props {
    quests: Quest[];
    totalQuests: number;
    currentLimit: number;
    completedQuestsCount: number;
    myQuests?: Quest[];
    filters: {
        search?: string;
        status?: string;
        limit?: number;
    };
}

export default function Index({
    quests,
    totalQuests,
    currentLimit,
    completedQuestsCount,
    myQuests = [],
    filters,
}: Props) {
    const { props: inertiaProps } = usePage<any>();
    const currentUser = inertiaProps.auth?.user;

    const [activeMainTab, setActiveMainTab] = useState<'bursa' | 'saya'>('bursa');
    const [search, setSearch] = useState(filters.search || '');
    const [status, setStatus] = useState(filters.status || '');
    const [sortBy, setSortBy] = useState<
        'latest' | 'highest_salary' | 'closest_deadline'
    >('latest');
    const [isLoadingMore, setIsLoadingMore] = useState(false);
    const [myWorkerLimit, setMyWorkerLimit] = useState(3);
    const [myCreatorLimit, setMyCreatorLimit] = useState(3);

    // Sort original quests list
    const sortedQuests = [...quests].sort((a, b) => {
        if (sortBy === 'highest_salary') {
            return b.max_salary - a.max_salary;
        }
        if (sortBy === 'closest_deadline') {
            return (
                new Date(a.deadline).getTime() - new Date(b.deadline).getTime()
            );
        }
        return 0;
    });

    // Bursa Quest: Tampilkan semua quest tanpa mengecualikan quest buatan sendiri
    const bursaQuests = sortedQuests;

    // My Quests: Quests grouped by role
    const myWorkerQuests = myQuests.filter((quest) => quest.worker_id === currentUser?.id);
    const myCreatorQuests = myQuests.filter((quest) => quest.creator_id === currentUser?.id);

    const displayedWorkerQuests = myWorkerQuests.slice(0, myWorkerLimit);
    const displayedCreatorQuests = myCreatorQuests.slice(0, myCreatorLimit);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        router.get(
            '/student/quests',
            { search, status, limit: 12 },
            { preserveState: true, replace: true },
        );
    };

    const handleStatusFilter = (newStatus: string) => {
        setStatus(newStatus);
        router.get(
            '/student/quests',
            { search, status: newStatus, limit: 12 },
            { preserveState: true, replace: true },
        );
    };

    const handleLoadMore = () => {
        setIsLoadingMore(true);
        router.get(
            '/student/quests',
            { search, status, limit: currentLimit + 12 },
            {
                preserveScroll: true,
                preserveState: true,
                onFinish: () => setIsLoadingMore(false),
            },
        );
    };

    const handleLoadLess = () => {
        setIsLoadingMore(true);
        router.get(
            '/student/quests',
            { search, status, limit: 12 },
            {
                preserveScroll: false,
                preserveState: true,
                onFinish: () => setIsLoadingMore(false),
            },
        );
    };

    return (
        <div
            className="relative flex min-h-screen flex-col overflow-x-hidden bg-slate-50 p-3 text-slate-800 transition-colors duration-200 sm:p-6 md:p-8 dark:bg-[#060813] dark:text-white"
            style={{ fontFamily: "'Outfit', sans-serif" }}
        >
            {/* Ambient top-center glow */}
            <div className="pointer-events-none absolute top-0 left-1/2 z-0 h-[450px] w-full max-w-7xl -translate-x-1/2 rounded-full bg-indigo-500/5 blur-[120px] select-none" />

            <div className="relative z-10 mx-auto flex min-h-0 w-full max-w-6xl flex-1 flex-col space-y-6">
                {/* HERO BANNER & HEADER */}
                <div className="relative overflow-hidden rounded-3xl border border-slate-200 bg-gradient-to-br from-indigo-500/10 via-purple-500/5 to-transparent p-6 shadow-md dark:border-slate-800/80 dark:from-indigo-950/20 dark:via-purple-950/10 dark:to-transparent">
                    {/* Decorative abstract glows */}
                    <div className="absolute top-0 right-0 -z-10 h-32 w-32 rounded-full bg-indigo-500/10 blur-2xl" />
                    <div className="absolute bottom-0 left-0 -z-10 h-24 w-24 rounded-full bg-purple-500/10 blur-xl" />

                    <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
                        {/* Title & Description */}
                        <div className="flex items-start gap-4">
                            <Link
                                href="/student/dashboard"
                                className="mt-1 shrink-0 cursor-pointer rounded-xl border border-slate-200 bg-white p-2.5 text-slate-500 shadow-sm transition-all hover:border-indigo-500/30 hover:text-indigo-650 dark:border-slate-800 dark:bg-[#0c122c]/40 dark:text-slate-400 dark:hover:text-indigo-400"
                                title="Kembali ke Dashboard"
                            >
                                <ArrowLeft size={16} />
                            </Link>
                            <div>
                                <div className="flex items-center gap-2">
                                    <span className="font-['Orbitron'] text-[10px] font-black tracking-widest text-indigo-600 uppercase dark:text-indigo-400">
                                        Quest Hub
                                    </span>
                                </div>
                                <h1 className="mt-1 font-['Oxanium'] text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl dark:text-white">
                                    QUEST BOARD
                                </h1>
                                <p className="mt-1 max-w-xl text-xs leading-relaxed font-medium text-slate-500 dark:text-slate-400">
                                    Cari lowongan pekerjaan, selesaikan quest,
                                    kumpulkan EXP & Gold untuk menaikkan
                                    reputasi karakter RPG Anda di SkillMongo.
                                </p>
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="flex flex-wrap items-center gap-3">
                            <Link
                                href="/student/quests/history"
                                className="inline-flex transform items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4.5 py-2.5 font-['Orbitron'] text-xs font-bold tracking-wider text-slate-700 uppercase shadow-sm transition-all duration-305 hover:bg-slate-100 active:scale-95 dark:border-blue-500/25 dark:bg-[#0c122c]/40 dark:text-blue-200 dark:hover:bg-blue-955/40"
                            >
                                <History className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                                Riwayat Quest
                            </Link>

                            <Link
                                href="/student/quests/create"
                                className="inline-flex transform items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 px-5 py-2.5 font-['Orbitron'] text-xs font-bold tracking-wider text-white uppercase shadow-[0_0_20px_rgba(124,58,237,0.3)] transition-all duration-300 hover:scale-[1.02] hover:from-purple-700 hover:to-indigo-700 active:scale-98"
                            >
                                <Plus className="h-4 w-4" />
                                Tambah Quest
                            </Link>
                        </div>
                    </div>

                    {/* Stats Grid inside Hero */}
                    <div className="mt-6 grid grid-cols-2 gap-3 border-t border-slate-200/60 pt-6 sm:grid-cols-4 dark:border-slate-800/60">
                        {[
                            {
                                label: 'Quest Tersedia',
                                val: quests.filter((q) => q.status === 'open').length,
                                icon: Compass,
                                color: 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20',
                            },
                            {
                                label: 'Pekerjaan Saya',
                                val: myWorkerQuests.filter((q) => q.status === 'ongoing').length,
                                icon: Activity,
                                color: 'text-blue-500 bg-blue-500/10 border-blue-500/20',
                            },
                            {
                                label: 'Quest Saya',
                                val: myCreatorQuests.length,
                                icon: Info,
                                color: 'text-amber-500 bg-amber-500/10 border-amber-500/20',
                            },
                            {
                                label: 'Quest Diselesaikan',
                                val: completedQuestsCount,
                                icon: CheckCircle2,
                                color: 'text-purple-500 bg-purple-500/10 border-purple-500/20',
                            },
                        ].map((statItem, index) => (
                            <div
                                key={index}
                                className="flex items-center gap-3 rounded-2xl border border-slate-200/50 bg-white/40 p-3 shadow-sm backdrop-blur-sm dark:border-slate-800/40 dark:bg-black/10"
                            >
                                <div
                                    className={`flex h-9 w-9 items-center justify-center rounded-xl border ${statItem.color}`}
                                >
                                    <statItem.icon size={16} />
                                </div>
                                <div>
                                    <span className="block text-[9px] font-bold tracking-widest text-slate-400 uppercase">
                                        {statItem.label}
                                    </span>
                                    <span className="font-['Orbitron'] text-sm font-extrabold text-slate-900 dark:text-white">
                                        {statItem.val}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* TAB SWITCHER UTAMA */}
                <div className="flex gap-2 rounded-2xl bg-slate-200/40 p-1.5 dark:bg-slate-900/40 backdrop-blur-sm self-start">
                    <button
                        onClick={() => setActiveMainTab('bursa')}
                        className={`flex cursor-pointer items-center gap-2 px-6 py-2.5 rounded-xl font-['Orbitron'] text-xs font-black tracking-widest uppercase transition-all duration-300 ${
                            activeMainTab === 'bursa'
                                ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md'
                                : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                        }`}
                    >
                        <Compass size={14} />
                        Bursa Quest ({bursaQuests.length})
                    </button>
                    <button
                        onClick={() => setActiveMainTab('saya')}
                        className={`flex cursor-pointer items-center gap-2 px-6 py-2.5 rounded-xl font-['Orbitron'] text-xs font-black tracking-widest uppercase transition-all duration-300 ${
                            activeMainTab === 'saya'
                                ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md'
                                : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                        }`}
                    >
                        <Briefcase size={14} />
                        Quest Saya ({myQuests.length})
                    </button>
                </div>

                {activeMainTab === 'bursa' ? (
                    <>
                        {/* FILTERS & SEARCH */}
                        <div className="rounded-2xl border border-slate-200 bg-white/70 p-4 shadow-sm backdrop-blur-md transition-all duration-300 dark:border-slate-800/80 dark:bg-[#0c122c]/40">
                            <form
                                onSubmit={handleSearch}
                                className="flex flex-col items-center gap-4 md:flex-row"
                            >
                                <div className="relative w-full md:flex-1">
                                    <input
                                        type="text"
                                        placeholder="Cari lowongan quest..."
                                        value={search}
                                        onChange={(e) => setSearch(e.target.value)}
                                        className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pr-4 pl-11 font-['Oxanium'] text-xs text-slate-800 transition-colors focus:border-indigo-500 focus:outline-none sm:text-sm dark:border-slate-800 dark:bg-black/20 dark:text-white"
                                    />
                                    <Search className="absolute top-3 left-3.5 h-5 w-5 text-slate-400 dark:text-slate-500" />
                                </div>

                                {/* Sort Selector */}
                                <div className="w-full font-['Oxanium'] md:w-48">
                                    <select
                                        value={sortBy}
                                        onChange={(e) =>
                                            setSortBy(e.target.value as any)
                                        }
                                        className="w-full cursor-pointer rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-xs font-bold tracking-wider text-slate-650 uppercase focus:border-indigo-500 focus:outline-none dark:border-slate-800 dark:bg-black/20 dark:text-slate-300"
                                    >
                                        <option
                                            value="latest"
                                            className="bg-white dark:bg-[#060813]"
                                        >
                                            Urutan: Terbaru
                                        </option>
                                        <option
                                            value="highest_salary"
                                            className="bg-white dark:bg-[#060813]"
                                        >
                                            Gaji Tertinggi
                                        </option>
                                        <option
                                            value="closest_deadline"
                                            className="bg-white dark:bg-[#060813]"
                                        >
                                            Deadline Terdekat
                                        </option>
                                    </select>
                                </div>

                                {/* Status Pills */}
                                <div className="flex w-full scrollbar-thin gap-2 overflow-x-auto pb-1 md:w-auto md:pb-0">
                                    {[
                                        { val: '', label: 'Semua' },
                                        { val: 'open', label: 'Tersedia' },
                                        { val: 'ongoing', label: 'Berjalan' },
                                        { val: 'completed', label: 'Selesai' },
                                    ].map((statusOption) => (
                                        <button
                                            key={statusOption.val}
                                            type="button"
                                            onClick={() =>
                                                handleStatusFilter(statusOption.val)
                                            }
                                            className={`cursor-pointer rounded-xl border px-4 py-2 font-['Orbitron'] text-xs font-bold tracking-wider whitespace-nowrap uppercase transition-all duration-300 ${
                                                status === statusOption.val
                                                    ? 'border-indigo-500 bg-indigo-600 text-white shadow-[0_0_12px_rgba(99,102,241,0.4)]'
                                                    : 'border-slate-200 bg-slate-50 text-slate-500 hover:border-indigo-500/50 hover:bg-indigo-500/5 dark:border-slate-800 dark:bg-black/20 dark:text-slate-400'
                                            }`}
                                        >
                                            {statusOption.label}
                                        </button>
                                    ))}
                                </div>
                            </form>
                        </div>

                        {/* QUEST LIST */}
                        {bursaQuests.length === 0 ? (
                            <div className="flex flex-1 flex-col items-center justify-center rounded-2xl border border-slate-200 bg-white/40 py-20 text-center font-['Oxanium'] shadow-sm backdrop-blur-sm dark:border-slate-800/80 dark:bg-[#0c122c]/20">
                                <Briefcase className="mb-4 h-14 w-14 animate-pulse text-slate-300 dark:text-blue-900/40" />
                                <p className="text-base font-bold text-slate-600 dark:text-blue-300">
                                    Tidak ada quest yang tersedia
                                </p>
                                <p className="mx-auto mt-1 max-w-sm text-xs leading-relaxed text-slate-400 dark:text-slate-500">
                                    Coba ubah kata kunci pencarian Anda atau periksa
                                    filter status lainnya untuk melihat lowongan quest.
                                </p>
                            </div>
                        ) : (
                            <>
                                <div className="grid grid-cols-1 gap-6 pb-12 md:grid-cols-2 lg:grid-cols-3">
                                    {bursaQuests.map((quest) => (
                                        <QuestItemCard key={quest._id} quest={quest} />
                                    ))}
                                </div>

                                {(quests.length < totalQuests || currentLimit > 12) && (
                                    <div className="flex flex-wrap items-center justify-center gap-4 pb-16">
                                        {/* Show Less Button */}
                                        {currentLimit > 12 && (
                                            <button
                                                onClick={handleLoadLess}
                                                disabled={isLoadingMore}
                                                className="cursor-pointer group flex items-center gap-2 rounded-xl border border-rose-200 bg-white/80 px-6 py-3 font-['Orbitron'] text-xs font-bold tracking-wider uppercase text-rose-600 transition-all duration-300 hover:border-rose-500 hover:bg-rose-600 hover:text-white hover:shadow-[0_0_15px_rgba(244,63,94,0.4)] disabled:opacity-50 dark:border-rose-500/30 dark:bg-rose-950/20 dark:text-rose-400 dark:hover:bg-rose-600 dark:hover:text-white"
                                            >
                                                <span className="transition-transform duration-300 group-hover:-translate-y-0.5">↑</span>
                                                Tampilkan Lebih Sedikit
                                            </button>
                                        )}

                                        {/* Show More Button */}
                                        {quests.length < totalQuests && (
                                            <button
                                                onClick={handleLoadMore}
                                                disabled={isLoadingMore}
                                                className="cursor-pointer group flex items-center gap-2.5 rounded-xl border border-indigo-200 bg-white/80 px-6 py-3 font-['Orbitron'] text-xs font-bold tracking-wider uppercase text-indigo-600 transition-all duration-300 hover:border-indigo-500 hover:bg-indigo-600 hover:text-white hover:shadow-[0_0_15px_rgba(99,102,241,0.4)] disabled:opacity-50 dark:border-indigo-500/30 dark:bg-indigo-950/20 dark:text-indigo-400 dark:hover:bg-indigo-600 dark:hover:text-white"
                                            >
                                                {isLoadingMore ? (
                                                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                    </svg>
                                                ) : (
                                                    <>
                                                        Tampilkan Lebih Banyak
                                                        <span className="transition-transform duration-300 group-hover:translate-y-0.5">↓</span>
                                                    </>
                                                )}
                                            </button>
                                        )}
                                    </div>
                                )}
                            </>
                        )}
                    </>
                ) : (
                    <div className="space-y-8 pb-16">
                        {/* Sebagai Pekerja */}
                        <div className="space-y-4">
                            <div className="flex items-center justify-between border-b border-slate-200 pb-2 dark:border-slate-800">
                                <h2 className="font-['Orbitron'] text-sm font-black tracking-wider text-slate-900 uppercase dark:text-white flex items-center gap-2 border-l-2 border-emerald-500 pl-2.5">
                                    Sebagai Pekerja ({myWorkerQuests.length})
                                </h2>
                                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                                    Pekerjaan Aktif & Kontrak Anda
                                </span>
                            </div>

                            {myWorkerQuests.length === 0 ? (
                                <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-200 bg-white/40 py-12 text-center font-['Oxanium'] dark:border-slate-800/80 dark:bg-black/10">
                                    <Briefcase className="mb-3 h-10 w-10 text-slate-300 dark:text-slate-755" />
                                    <p className="text-sm font-bold text-slate-600 dark:text-slate-350">
                                        Anda belum mengambil atau diterima di quest mana pun.
                                    </p>
                                    <button
                                        onClick={() => setActiveMainTab('bursa')}
                                        className="mt-2.5 font-['Orbitron'] text-xs font-black uppercase text-indigo-600 dark:text-indigo-400 hover:underline"
                                    >
                                        Cari Lowongan Kerja →
                                    </button>
                                </div>
                            ) : (
                                <>
                                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                                        {displayedWorkerQuests.map((quest) => (
                                            <QuestItemCard key={quest._id} quest={quest} />
                                        ))}
                                    </div>
                                    
                                    {(myWorkerQuests.length > 3 || myWorkerLimit > 3) && (
                                        <div className="flex justify-center gap-3 pt-4">
                                            {myWorkerLimit < myWorkerQuests.length && (
                                                <button
                                                    onClick={() => setMyWorkerLimit((prev) => Math.min(prev + 6, myWorkerQuests.length))}
                                                    className="cursor-pointer group flex items-center gap-1.5 rounded-xl border border-indigo-200 bg-white/80 px-4 py-2 font-['Orbitron'] text-[10px] font-bold tracking-wider uppercase text-indigo-600 transition-all duration-300 hover:border-indigo-500 hover:bg-indigo-600 hover:text-white dark:border-indigo-500/30 dark:bg-indigo-950/20 dark:text-indigo-400 dark:hover:bg-indigo-600 dark:hover:text-white"
                                                >
                                                    Tampilkan Lebih Banyak ↓
                                                </button>
                                            )}
                                            {myWorkerLimit > 3 && (
                                                <button
                                                    onClick={() => setMyWorkerLimit(3)}
                                                    className="cursor-pointer group flex items-center gap-1.5 rounded-xl border border-rose-200 bg-white/80 px-4 py-2 font-['Orbitron'] text-[10px] font-bold tracking-wider uppercase text-rose-600 transition-all duration-300 hover:border-rose-500 hover:bg-rose-600 hover:text-white dark:border-rose-500/30 dark:bg-rose-950/20 dark:text-rose-400 dark:hover:bg-rose-600 dark:hover:text-white"
                                                >
                                                    Tampilkan Lebih Sedikit ↑
                                                </button>
                                            )}
                                        </div>
                                    )}
                                </>
                            )}
                        </div>

                        {/* Sebagai Pembuat */}
                        <div className="space-y-4">
                            <div className="flex items-center justify-between border-b border-slate-200 pb-2 dark:border-slate-800">
                                <h2 className="font-['Orbitron'] text-sm font-black tracking-wider text-slate-900 uppercase dark:text-white flex items-center gap-2 border-l-2 border-purple-500 pl-2.5">
                                    Sebagai Pembuat ({myCreatorQuests.length})
                                </h2>
                                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                                    Quest yang Anda rilis ke publik
                                </span>
                            </div>

                            {myCreatorQuests.length === 0 ? (
                                <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-200 bg-white/40 py-12 text-center font-['Oxanium'] dark:border-slate-800/80 dark:bg-black/10">
                                    <Sparkles className="mb-3 h-10 w-10 text-slate-300 dark:text-slate-755" />
                                    <p className="text-sm font-bold text-slate-600 dark:text-slate-350">
                                        Anda belum merilis lowongan quest apa pun.
                                    </p>
                                    <Link
                                        href="/student/quests/create"
                                        className="mt-2.5 font-['Orbitron'] text-xs font-black uppercase text-purple-600 dark:text-purple-400 hover:underline"
                                    >
                                        Buat Quest Sekarang →
                                    </Link>
                                </div>
                            ) : (
                                <>
                                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                                        {displayedCreatorQuests.map((quest) => (
                                            <QuestItemCard key={quest._id} quest={quest} />
                                        ))}
                                    </div>

                                    {(myCreatorQuests.length > 3 || myCreatorLimit > 3) && (
                                        <div className="flex justify-center gap-3 pt-4">
                                            {myCreatorLimit < myCreatorQuests.length && (
                                                <button
                                                    onClick={() => setMyCreatorLimit((prev) => Math.min(prev + 6, myCreatorQuests.length))}
                                                    className="cursor-pointer group flex items-center gap-1.5 rounded-xl border border-indigo-200 bg-white/80 px-4 py-2 font-['Orbitron'] text-[10px] font-bold tracking-wider uppercase text-indigo-600 transition-all duration-305 hover:border-indigo-500 hover:bg-indigo-600 hover:text-white dark:border-indigo-500/30 dark:bg-indigo-950/20 dark:text-indigo-400 dark:hover:bg-indigo-600 dark:hover:text-white"
                                                >
                                                    Tampilkan Lebih Banyak ↓
                                                </button>
                                            )}
                                            {myCreatorLimit > 3 && (
                                                <button
                                                    onClick={() => setMyCreatorLimit(3)}
                                                    className="cursor-pointer group flex items-center gap-1.5 rounded-xl border border-rose-200 bg-white/80 px-4 py-2 font-['Orbitron'] text-[10px] font-bold tracking-wider uppercase text-rose-600 transition-all duration-305 hover:border-rose-500 hover:bg-rose-600 hover:text-white dark:border-rose-500/30 dark:bg-rose-950/20 dark:text-rose-400 dark:hover:bg-rose-600 dark:hover:text-white"
                                                >
                                                    Tampilkan Lebih Sedikit ↑
                                                </button>
                                            )}
                                        </div>
                                    )}
                                </>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
