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
    Briefcase,
    ChevronDown,
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

    const [activeMainTab, setActiveMainTab] = useState<'bursa' | 'saya'>(
        'bursa',
    );
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
            return (
                (b.max_budget ?? b.max_salary ?? 0) -
                (a.max_budget ?? a.max_salary ?? 0)
            );
        }
        if (sortBy === 'closest_deadline') {
            return (
                new Date(a.deadline).getTime() - new Date(b.deadline).getTime()
            );
        }
        return 0;
    });

    const bursaQuests = sortedQuests;

    const myWorkerQuests = myQuests.filter(
        (quest) => quest.worker_id === currentUser?.id,
    );
    const myCreatorQuests = myQuests.filter(
        (quest) => quest.creator_id === currentUser?.id,
    );

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
            className="flex min-h-screen w-full flex-col overflow-x-hidden bg-[#f8fafc] text-slate-800 transition-colors duration-200 dark:bg-[#030712] dark:text-white"
            style={{ fontFamily: "'Outfit', sans-serif" }}
        >
            {/* HEADER - Gaming style, consistent with other pages */}
            <div className="w-full flex-shrink-0 px-1 pt-0.5">
                <div
                    className="relative rounded-md p-[2px] md:p-[3px]"
                    style={{
                        backgroundImage:
                            'linear-gradient(to bottom, #3B28F6 0%, #4c2fff 30%, #7c3aed 50%, #facc15 100%)',
                    }}
                >
                    <div className="relative flex items-center justify-between gap-2 rounded-[4px] bg-white px-3 py-3 md:px-6 md:py-4 dark:bg-[#040812]">
                        {/* Back Button */}
                        <Link
                            href="/student/dashboard"
                            className="relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded border-2 border-blue-500 bg-blue-100 transition-colors hover:border-blue-600 hover:bg-blue-200 md:h-12 md:w-12 dark:border-blue-800 dark:bg-[#0b1021] dark:hover:border-blue-600 dark:hover:bg-blue-900/40"
                        >
                            <svg
                                viewBox="0 0 48 48"
                                className="h-7 w-7 scale-125 text-indigo-600 transition-transform duration-200 hover:scale-150 md:h-9 md:w-9 dark:text-indigo-500"
                            >
                                <rect x="12" y="20" width="29" height="4" fill="currentColor" />
                                <rect x="8" y="20" width="4" height="4" fill="currentColor" />
                                <rect x="5" y="20" width="5" height="4" fill="currentColor" />
                                <rect x="8" y="16" width="4" height="4" fill="currentColor" />
                                <rect x="8" y="24" width="4" height="4" fill="currentColor" />
                                <rect x="12" y="12" width="4" height="4" fill="currentColor" />
                                <rect x="12" y="28" width="4" height="4" fill="currentColor" />
                                <rect x="16" y="8" width="4" height="4" fill="currentColor" />
                                <rect x="16" y="32" width="4" height="4" fill="currentColor" />
                            </svg>
                        </Link>

                        {/* Title */}
                        <h1 className="flex-1 text-center font-['Orbitron'] text-sm font-bold tracking-[0.05em] text-[#1e3a8a] uppercase min-[390px]:text-base min-[390px]:tracking-[0.1em] sm:text-xl md:text-2xl md:tracking-[0.15em] lg:text-3xl 2xl:text-4xl dark:text-white">
                            QUEST BOARD
                        </h1>

                        {/* Spacer to center title on mobile */}
                        <div className="h-10 w-10 shrink-0 md:hidden" />
                    </div>
                </div>
            </div>

            <div className="relative z-10 flex min-h-0 w-full max-w-none flex-1 flex-col space-y-4 px-4 py-4 sm:px-6 lg:px-10">

                {/* STATS */}
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                    {[
                        {
                            label: 'Proyek Tersedia',
                            val: quests.filter((q) => q.status === 'open').length,
                            icon: Compass,
                            accent: 'text-emerald-600 dark:text-emerald-400',
                        },
                        {
                            label: 'Kontrak Berjalan',
                            val: myWorkerQuests.filter((q) => q.status === 'ongoing').length,
                            icon: Activity,
                            accent: 'text-indigo-600 dark:text-indigo-400',
                        },
                        {
                            label: 'Tugas Saya Rilis',
                            val: myCreatorQuests.length,
                            icon: Info,
                            accent: 'text-amber-600 dark:text-amber-400',
                        },
                        {
                            label: 'Kontrak Selesai',
                            val: completedQuestsCount,
                            icon: CheckCircle2,
                            accent: 'text-slate-500 dark:text-slate-400',
                        },
                    ].map((statItem, index) => (
                        <div
                            key={index}
                            className="flex items-center gap-3 rounded-xl border border-slate-300 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-[#0d0f17]"
                        >
                            <statItem.icon size={18} className={`shrink-0 ${statItem.accent}`} strokeWidth={2} />
                            <div className="min-w-0">
                                <span className="block text-[10px] font-bold tracking-wider text-slate-600 uppercase dark:text-slate-400">
                                    {statItem.label}
                                </span>
                                <span className="text-base font-extrabold text-slate-900 dark:text-white">
                                    {statItem.val}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>

                {/* TAB SWITCHER + ACTION BUTTONS — satu baris */}
                <div className="flex flex-col gap-2.5 sm:flex-row sm:items-center sm:justify-between">
                    {/* Tab Switcher */}
                    <div className="flex gap-1.5 rounded-lg border border-slate-300 bg-slate-200/80 p-1 dark:border-slate-800 dark:bg-[#0d1117]">
                        <button
                            onClick={() => setActiveMainTab('bursa')}
                            className={`flex cursor-pointer items-center gap-2 rounded-md px-4 py-2 text-xs font-bold tracking-wide transition-all ${
                                activeMainTab === 'bursa'
                                    ? 'border border-indigo-500/40 bg-white text-indigo-700 shadow-sm dark:border-indigo-500/40 dark:bg-[#030712] dark:text-white'
                                    : 'text-slate-700 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
                            }`}
                        >
                            <Compass size={14} />
                            Bursa Lowongan ({bursaQuests.length})
                        </button>
                        <button
                            onClick={() => setActiveMainTab('saya')}
                            className={`flex cursor-pointer items-center gap-2 rounded-md px-4 py-2 text-xs font-bold tracking-wide transition-all ${
                                activeMainTab === 'saya'
                                    ? 'border border-indigo-500/40 bg-white text-indigo-700 shadow-sm dark:border-indigo-500/40 dark:bg-[#030712] dark:text-white'
                                    : 'text-slate-700 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
                            }`}
                        >
                            <Briefcase size={14} />
                            Proyek Saya ({myQuests.length})
                        </button>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-wrap items-center gap-2">
                        <Link
                            href="/student/quests/history"
                            className="inline-flex items-center justify-center gap-1.5 rounded-full border border-slate-300 bg-white px-4 py-2 text-xs font-bold text-slate-700 shadow-sm transition-all hover:bg-slate-100 hover:text-slate-900 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800/60 dark:hover:text-white"
                        >
                            <History className="h-3.5 w-3.5" />
                            Riwayat Pekerjaan
                        </Link>

                        <Link
                            href="/student/quests/create"
                            className="inline-flex items-center justify-center gap-1.5 rounded-full border border-indigo-700/30 bg-indigo-600 px-4.5 py-2 text-xs font-bold text-white shadow-md shadow-indigo-600/30 transition-all duration-200 hover:bg-indigo-700 hover:shadow-lg hover:shadow-indigo-600/40"
                        >
                            <Plus className="h-4 w-4 stroke-[3]" />
                            Posting Proyek Baru
                        </Link>
                    </div>
                </div>

                {activeMainTab === 'bursa' ? (
                    <>
                        {/* FILTERS & SEARCH */}
                        <div className="relative overflow-hidden rounded-xl border border-slate-300 bg-white p-4 shadow-sm dark:border-slate-800/80 dark:bg-gradient-to-b dark:from-[#0e0e1a] dark:to-[#090910]">
                            <div className="absolute top-0 right-8 left-8 h-px bg-gradient-to-r from-transparent via-slate-300 to-transparent dark:via-slate-700 pointer-events-none select-none z-0" />
                            <form
                                onSubmit={handleSearch}
                                className="relative z-10 flex flex-col items-center gap-3.5 md:flex-row"
                            >
                                {/* Search Input */}
                                <div className="relative w-full md:flex-1">
                                    <input
                                        type="text"
                                        placeholder="Cari lowongan proyek..."
                                        value={search}
                                        onChange={(e) => setSearch(e.target.value)}
                                        className="w-full rounded-lg border border-slate-300 bg-slate-50/80 py-2 pr-4 pl-10 text-xs font-semibold text-slate-900 placeholder:text-slate-500 transition-colors focus:border-indigo-600 focus:bg-white focus:outline-none dark:border-slate-800 dark:bg-[#030712] dark:text-white dark:placeholder:text-slate-500"
                                    />
                                    <Search className="absolute top-2.5 left-3 h-4.5 w-4.5 text-slate-600 dark:text-slate-400" />
                                </div>

                                {/* Sort Dropdown */}
                                <div className="relative w-full md:w-48">
                                    <select
                                        value={sortBy}
                                        onChange={(e) => setSortBy(e.target.value as any)}
                                        className="w-full cursor-pointer appearance-none rounded-lg border border-slate-300 bg-slate-50/80 px-3.5 py-2 pr-8 text-xs font-bold text-slate-800 focus:border-indigo-600 focus:bg-white focus:outline-none dark:border-slate-800 dark:bg-[#030712] dark:text-slate-300"
                                    >
                                        <option value="latest">Terbaru</option>
                                        <option value="highest_salary">Anggaran Tertinggi</option>
                                        <option value="closest_deadline">Deadline Terdekat</option>
                                    </select>
                                    <ChevronDown className="pointer-events-none absolute top-3 right-3 h-3.5 w-3.5 text-slate-600 dark:text-slate-400" />
                                </div>

                                {/* Status Filters */}
                                <div className="flex w-full gap-1.5 overflow-x-auto pb-1 md:w-auto md:pb-0 scrollbar-none">
                                    {[
                                        { val: '', label: 'Semua' },
                                        { val: 'open', label: 'Tersedia' },
                                        { val: 'ongoing', label: 'Berjalan' },
                                        { val: 'completed', label: 'Selesai' },
                                    ].map((statusOption) => (
                                        <button
                                            key={statusOption.val}
                                            type="button"
                                            onClick={() => handleStatusFilter(statusOption.val)}
                                            className={`cursor-pointer rounded-lg px-3.5 py-2 text-xs font-bold transition-all whitespace-nowrap ${
                                                status === statusOption.val
                                                    ? 'border border-indigo-600 bg-indigo-600 text-white shadow-sm'
                                                    : 'border border-slate-300 bg-slate-100/90 text-slate-700 hover:bg-slate-200 hover:text-slate-900 dark:border-slate-800 dark:bg-[#030712] dark:text-slate-400'
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
                            <div className="relative overflow-hidden flex flex-1 flex-col items-center justify-center rounded-xl border border-dashed border-slate-300 bg-white py-16 text-center shadow-sm dark:border-slate-800 dark:bg-gradient-to-b dark:from-[#0e0e1a] dark:to-[#090910]">
                                <div className="absolute top-0 right-8 left-8 h-px bg-gradient-to-r from-transparent via-slate-300 to-transparent dark:via-slate-700 pointer-events-none select-none z-0" />
                                <div className="relative z-10 flex flex-col items-center justify-center">
                                    <Briefcase className="mb-3 h-10 w-10 text-slate-500 dark:text-slate-700" />
                                <p className="text-sm font-extrabold text-slate-900 dark:text-slate-300">
                                    Tidak ada lowongan proyek tersedia
                                </p>
                                <p className="mx-auto mt-1 max-w-xs text-xs font-semibold text-slate-600">
                                    Coba ubah kata kunci pencarian atau sesuaikan filter status untuk melihat lowongan lain.
                                </p>
                                </div>
                            </div>
                        ) : (
                            <>
                                <div className="grid grid-cols-1 gap-5 pb-8 md:grid-cols-2 lg:grid-cols-3">
                                    {bursaQuests.map((quest) => (
                                        <QuestItemCard
                                            key={quest._id}
                                            quest={quest}
                                        />
                                    ))}
                                </div>

                                {(quests.length < totalQuests || currentLimit > 12) && (
                                    <div className="flex flex-wrap items-center justify-center gap-3 pb-16">
                                        {/* Show Less */}
                                        {currentLimit > 12 && (
                                            <button
                                                onClick={handleLoadLess}
                                                disabled={isLoadingMore}
                                                className="inline-flex cursor-pointer items-center gap-1.5 rounded-lg border border-red-300 bg-white px-4 py-2 text-xs font-bold text-red-700 shadow-sm transition-all hover:bg-red-50 dark:border-slate-800 dark:bg-[#030712] dark:text-red-400"
                                            >
                                                Tampilkan Lebih Sedikit
                                            </button>
                                        )}

                                        {/* Show More */}
                                        {quests.length < totalQuests && (
                                            <button
                                                onClick={handleLoadMore}
                                                disabled={isLoadingMore}
                                                className="inline-flex cursor-pointer items-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2 text-xs font-bold text-indigo-700 shadow-sm transition-all hover:bg-slate-100 dark:border-slate-800 dark:bg-[#030712] dark:text-indigo-400"
                                            >
                                                {isLoadingMore ? (
                                                    <svg
                                                        className="mr-1.5 h-3.5 w-3.5 animate-spin text-current"
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        fill="none"
                                                        viewBox="0 0 24 24"
                                                    >
                                                        <circle
                                                            className="opacity-25"
                                                            cx="12"
                                                            cy="12"
                                                            r="10"
                                                            stroke="currentColor"
                                                            strokeWidth="4"
                                                        ></circle>
                                                        <path
                                                            className="opacity-75"
                                                            fill="currentColor"
                                                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                                        ></path>
                                                    </svg>
                                                ) : (
                                                    'Tampilkan Lebih Banyak'
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
                            <div className="flex items-center justify-between border-b border-slate-300 pb-2 dark:border-slate-800">
                                <h2 className="flex items-center gap-2 pl-1 text-sm font-extrabold text-slate-900 uppercase dark:text-white">
                                    Sebagai Kontraktor / Pekerja ({myWorkerQuests.length})
                                </h2>
                                <span className="text-[10px] font-bold text-slate-600 uppercase tracking-wider dark:text-slate-400">
                                    Proyek Kerja Aktif Anda
                                </span>
                            </div>

                            {myWorkerQuests.length === 0 ? (
                                <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-slate-300 bg-slate-50/70 py-10 text-center dark:border-slate-800 dark:bg-[#0d1117]/30">
                                    <Briefcase className="mb-2.5 h-8 w-8 text-slate-500 dark:text-slate-700" />
                                    <p className="text-xs font-bold text-slate-800 dark:text-slate-300">
                                        Anda belum mengambil proyek apa pun.
                                    </p>
                                    <button
                                        onClick={() => setActiveMainTab('bursa')}
                                        className="mt-2 text-xs font-extrabold text-indigo-700 hover:underline dark:text-indigo-400"
                                    >
                                        Cari Lowongan Kerja →
                                    </button>
                                </div>
                            ) : (
                                <>
                                    <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
                                        {displayedWorkerQuests.map((quest) => (
                                            <QuestItemCard
                                                key={quest._id}
                                                quest={quest}
                                            />
                                        ))}
                                    </div>

                                    {(myWorkerQuests.length > 3 || myWorkerLimit > 3) && (
                                        <div className="flex justify-center gap-2 pt-3">
                                            {myWorkerLimit < myWorkerQuests.length && (
                                                <button
                                                    onClick={() =>
                                                        setMyWorkerLimit((prev) =>
                                                            Math.min(prev + 6, myWorkerQuests.length),
                                                        )
                                                    }
                                                    className="rounded-lg border border-slate-300 bg-white px-3.5 py-1.5 text-xs font-bold text-slate-800 shadow-sm hover:bg-slate-100 dark:border-slate-800 dark:bg-[#030712] dark:text-slate-300"
                                                >
                                                    Selengkapnya ↓
                                                </button>
                                            )}
                                            {myWorkerLimit > 3 && (
                                                <button
                                                    onClick={() => setMyWorkerLimit(3)}
                                                    className="rounded-lg border border-red-300 bg-white px-3.5 py-1.5 text-xs font-bold text-red-700 shadow-sm hover:bg-red-50 dark:border-slate-800 dark:bg-[#030712] dark:text-red-400"
                                                >
                                                    Sembunyikan ↑
                                                </button>
                                            )}
                                        </div>
                                    )}
                                </>
                            )}
                        </div>

                        {/* Sebagai Pembuat */}
                        <div className="space-y-4">
                            <div className="flex items-center justify-between border-b border-slate-300 pb-2 dark:border-slate-800">
                                <h2 className="flex items-center gap-2 pl-1 text-sm font-extrabold text-slate-900 uppercase dark:text-white">
                                    Sebagai Klien / Pemilik Proyek ({myCreatorQuests.length})
                                </h2>
                                <span className="text-[10px] font-bold text-slate-600 uppercase tracking-wider dark:text-slate-400">
                                    Proyek yang Anda posting
                                </span>
                            </div>
                            {myCreatorQuests.length === 0 ? (
                                <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-slate-300 bg-slate-50/70 py-10 text-center dark:border-slate-800 dark:bg-[#0d1117]/30">
                                    <p className="text-xs font-bold text-slate-800 dark:text-slate-300">
                                        Anda belum merilis lowongan proyek apa pun.
                                    </p>
                                    <Link
                                        href="/student/quests/create"
                                        className="mt-2 text-xs font-extrabold text-indigo-700 hover:underline dark:text-indigo-400"
                                    >
                                        Buat Lowongan Sekarang →
                                    </Link>
                                </div>
                            ) : (
                                <>
                                    <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
                                        {displayedCreatorQuests.map((quest) => (
                                            <QuestItemCard
                                                key={quest._id}
                                                quest={quest}
                                            />
                                        ))}
                                    </div>

                                    {(myCreatorQuests.length > 3 || myCreatorLimit > 3) && (
                                        <div className="flex justify-center gap-2 pt-3">
                                            {myCreatorLimit < myCreatorQuests.length && (
                                                <button
                                                    onClick={() =>
                                                        setMyCreatorLimit((prev) =>
                                                            Math.min(prev + 6, myCreatorQuests.length),
                                                        )
                                                    }
                                                    className="rounded-lg border border-slate-300 bg-white px-3.5 py-1.5 text-xs font-bold text-slate-800 shadow-sm hover:bg-slate-100 dark:border-slate-800 dark:bg-[#030712] dark:text-slate-300"
                                                >
                                                    Selengkapnya ↓
                                                </button>
                                            )}
                                            {myCreatorLimit > 3 && (
                                                <button
                                                    onClick={() => setMyCreatorLimit(3)}
                                                    className="rounded-lg border border-red-300 bg-white px-3.5 py-1.5 text-xs font-bold text-red-700 shadow-sm hover:bg-red-50 dark:border-slate-800 dark:bg-[#030712] dark:text-red-400"
                                                >
                                                    Sembunyikan ↑
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
