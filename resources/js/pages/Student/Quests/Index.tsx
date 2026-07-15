import { Link, router } from '@inertiajs/react';
import React, { useState } from 'react';
import {
    Search,
    Calendar,
    DollarSign,
    Users,
    Plus,
    Briefcase,
    History,
    X,
    ExternalLink,
    FileArchive,
    Download,
    Star,
    ArrowLeft,
    Award,
    User,
    Compass,
    Activity,
    Info,
    CheckCircle2,
} from 'lucide-react';

import { Quest, HistoryQuest } from '@/types/quest';
import QuestItemCard from '@/components/Quest/QuestItemCard';

interface Props {
    quests: Quest[];
    historyQuests: HistoryQuest[];
    filters: {
        search?: string;
        status?: string;
    };
}

export default function Index({ quests, historyQuests, filters }: Props) {
    const [search, setSearch] = useState(filters.search || '');
    const [status, setStatus] = useState(filters.status || '');
    const [sortBy, setSortBy] = useState<
        'latest' | 'highest_salary' | 'closest_deadline'
    >('latest');
    const [isHistoryOpen, setIsHistoryOpen] = useState(false);
    const [expandedQuestId, setExpandedQuestId] = useState<string | null>(null);

    // Inner filter for History Drawer
    const [historyRoleFilter, setHistoryRoleFilter] = useState<
        'all' | 'creator' | 'worker' | 'bidder'
    >('all');

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

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        router.get(
            '/student/quests',
            { search, status },
            { preserveState: true, replace: true },
        );
    };

    const handleStatusFilter = (newStatus: string) => {
        setStatus(newStatus);
        router.get(
            '/student/quests',
            { search, status: newStatus },
            { preserveState: true, replace: true },
        );
    };

    const formatCurrency = (num: number) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
        }).format(num);
    };

    const formatDate = (dateStr: string) => {
        const d = new Date(dateStr);
        const datePart = d.toLocaleDateString('id-ID', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });
        const timePart = d.toLocaleTimeString('id-ID', {
            hour: '2-digit',
            minute: '2-digit',
        });
        return `${datePart} pukul ${timePart}`;
    };

    const formatBytes = (bytes: number) => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const dm = 2;
        const sizes = ['Bytes', 'KB', 'MB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return (
            parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i]
        );
    };

    // Filter history by role tab
    const filteredHistoryQuests = historyQuests.filter((item) => {
        if (historyRoleFilter === 'creator') return item.is_creator;
        if (historyRoleFilter === 'worker') return item.is_worker;
        if (historyRoleFilter === 'bidder')
            return !item.is_creator && !item.is_worker;
        return true;
    });

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
                                className="mt-1 shrink-0 cursor-pointer rounded-xl border border-slate-200 bg-white p-2.5 text-slate-500 shadow-sm transition-all hover:border-indigo-500/30 hover:text-indigo-600 dark:border-slate-800 dark:bg-[#0c122c]/40 dark:text-slate-400 dark:hover:text-indigo-400"
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
                            <button
                                type="button"
                                onClick={() => setIsHistoryOpen(true)}
                                className="inline-flex transform cursor-pointer items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4.5 py-2.5 font-['Orbitron'] text-xs font-bold tracking-wider text-slate-700 uppercase shadow-sm transition-all duration-300 hover:bg-slate-100 active:scale-95 dark:border-blue-500/25 dark:bg-[#0c122c]/40 dark:text-blue-200 dark:hover:bg-blue-950/40"
                            >
                                <History className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                                Riwayat Quest
                            </button>

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
                                val: quests.filter((q) => q.status === 'open')
                                    .length,
                                icon: Compass,
                                color: 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20',
                            },
                            {
                                label: 'Dalam Pengerjaan',
                                val: quests.filter(
                                    (q) => q.status === 'ongoing',
                                ).length,
                                icon: Activity,
                                color: 'text-blue-500 bg-blue-500/10 border-blue-500/20',
                            },
                            {
                                label: 'Menunggu Review',
                                val: quests.filter((q) =>
                                    [
                                        'submitted',
                                        'approved',
                                        'payment',
                                    ].includes(q.status),
                                ).length,
                                icon: Info,
                                color: 'text-amber-500 bg-amber-500/10 border-amber-500/20',
                            },
                            {
                                label: 'Quest Diselesaikan',
                                val: historyQuests.filter(
                                    (q) => q.status === 'completed',
                                ).length,
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
                                className="w-full cursor-pointer rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-xs font-bold tracking-wider text-slate-600 uppercase focus:border-indigo-500 focus:outline-none dark:border-slate-800 dark:bg-black/20 dark:text-slate-300"
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
                {sortedQuests.length === 0 ? (
                    <div className="flex flex-1 flex-col items-center justify-center rounded-2xl border border-slate-200 bg-white/40 py-20 text-center font-['Oxanium'] shadow-sm backdrop-blur-sm dark:border-slate-800/80 dark:bg-[#0c122c]/20">
                        <Briefcase className="mb-4 h-14 w-14 animate-pulse text-slate-300 dark:text-blue-900/40" />
                        <p className="text-base font-bold text-slate-600 dark:text-blue-200">
                            Tidak ada quest yang tersedia
                        </p>
                        <p className="mx-auto mt-1 max-w-sm text-xs leading-relaxed text-slate-400 dark:text-slate-500">
                            Coba ubah kata kunci pencarian Anda atau periksa
                            filter status lainnya untuk melihat quest yang
                            tersedia.
                        </p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 gap-6 pb-12 md:grid-cols-2">
                        {sortedQuests.map((quest) => (
                            <QuestItemCard key={quest._id} quest={quest} />
                        ))}
                    </div>
                )}
            </div>

            {/* Quest History Drawer */}
            {isHistoryOpen && (
                <div className="fixed inset-0 z-[100] flex justify-end font-['Oxanium']">
                    {/* Backdrop */}
                    <div
                        className="absolute inset-0 cursor-pointer bg-black/60 backdrop-blur-md transition-opacity duration-300"
                        onClick={() => setIsHistoryOpen(false)}
                    />

                    {/* Drawer Content */}
                    <div className="relative z-10 flex h-full w-full max-w-lg translate-x-0 transform flex-col border-l border-slate-200 bg-white shadow-2xl backdrop-blur-lg transition-transform duration-300 md:max-w-xl dark:border-slate-800/80 dark:bg-[#070b19]/95">
                        {/* Drawer Header */}
                        <div className="bg-slate-55 flex items-center justify-between border-b border-slate-200 p-5 dark:border-slate-800 dark:bg-black/20">
                            <div className="flex items-center gap-2.5">
                                <History className="text-indigo-550 h-5 w-5 dark:text-indigo-400" />
                                <h2 className="font-['Orbitron'] text-sm font-extrabold tracking-wider text-slate-900 uppercase sm:text-base dark:text-white">
                                    Riwayat Quest Saya
                                </h2>
                            </div>
                            <button
                                onClick={() => setIsHistoryOpen(false)}
                                className="cursor-pointer rounded-lg p-1.5 text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-white/10 dark:hover:text-white"
                            >
                                <X className="h-5 w-5" />
                            </button>
                        </div>

                        {/* Quick filter tabs inside history drawer */}
                        <div className="flex scrollbar-none gap-2 overflow-x-auto border-b border-slate-200 bg-slate-50/30 px-5 py-2.5 font-['Orbitron'] text-[9px] font-black tracking-wider uppercase dark:border-slate-800 dark:bg-black/10">
                            {[
                                { key: 'all', label: 'Semua' },
                                { key: 'creator', label: 'Pembuat' },
                                { key: 'worker', label: 'Pekerja' },
                                { key: 'bidder', label: 'Bidder' },
                            ].map((roleTab) => (
                                <button
                                    key={roleTab.key}
                                    onClick={() => {
                                        setHistoryRoleFilter(
                                            roleTab.key as any,
                                        );
                                        setExpandedQuestId(null);
                                    }}
                                    className={`cursor-pointer rounded-lg border px-3 py-1.5 whitespace-nowrap transition-all ${
                                        historyRoleFilter === roleTab.key
                                            ? 'border-indigo-500 bg-indigo-600 text-white shadow-sm'
                                            : 'border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100 dark:border-white/5 dark:bg-white/5 dark:text-slate-400 dark:hover:bg-white/10 dark:hover:text-white'
                                    }`}
                                >
                                    {roleTab.label}
                                </button>
                            ))}
                        </div>

                        {/* List / Content */}
                        <div className="flex-1 scrollbar-thin space-y-4 overflow-y-auto p-5">
                            {filteredHistoryQuests.length === 0 ? (
                                <div className="py-20 text-center text-slate-500">
                                    <Briefcase className="mx-auto mb-3 h-12 w-12 animate-pulse text-indigo-500 opacity-30" />
                                    <p className="text-sm font-bold text-slate-600 dark:text-slate-300">
                                        Tidak ada riwayat quest
                                    </p>
                                    <p className="mx-auto mt-1 max-w-[280px] text-[11px] leading-relaxed text-slate-400 dark:text-slate-400">
                                        Anda tidak memiliki catatan quest dengan
                                        filter peran "
                                        {historyRoleFilter === 'all'
                                            ? 'Semua'
                                            : historyRoleFilter === 'creator'
                                              ? 'Pembuat'
                                              : historyRoleFilter === 'worker'
                                                ? 'Pekerja'
                                                : 'Bidder'}
                                        ".
                                    </p>
                                </div>
                            ) : (
                                filteredHistoryQuests.map((item) => {
                                    const isExpanded =
                                        expandedQuestId === item._id;
                                    return (
                                        <div
                                            key={item._id}
                                            className={`rounded-2xl border border-slate-200 bg-slate-50/50 transition-all duration-300 dark:bg-black/25 ${
                                                isExpanded
                                                    ? 'border-indigo-500/50 shadow-[0_0_15px_rgba(99,102,241,0.12)]'
                                                    : 'border-slate-200 hover:border-slate-300 dark:border-slate-800 dark:hover:border-slate-700'
                                            }`}
                                        >
                                            {/* Accordion Trigger/Header */}
                                            <div
                                                onClick={() =>
                                                    setExpandedQuestId(
                                                        isExpanded
                                                            ? null
                                                            : item._id,
                                                    )
                                                }
                                                className="flex cursor-pointer items-center justify-between gap-4 p-4 select-none"
                                            >
                                                <div className="min-w-0 space-y-1">
                                                    <div className="flex flex-wrap items-center gap-2">
                                                        <span
                                                            className={`rounded px-2 py-0.5 font-['Orbitron'] text-[8px] font-bold tracking-wider uppercase ${
                                                                item.status ===
                                                                'completed'
                                                                    ? 'border border-green-500/20 bg-green-500/10 text-green-600 dark:text-green-400'
                                                                    : item.status ===
                                                                        'approved'
                                                                      ? 'border border-indigo-500/20 bg-indigo-500/10 text-indigo-600 dark:text-indigo-400'
                                                                      : item.status ===
                                                                          'submitted'
                                                                        ? 'border border-amber-500/20 bg-amber-500/10 text-amber-600 dark:text-amber-400'
                                                                        : item.status ===
                                                                            'ongoing'
                                                                          ? 'border border-blue-500/20 bg-blue-500/10 text-blue-600 dark:text-blue-400'
                                                                          : item.status ===
                                                                              'expired'
                                                                            ? 'border border-red-500/20 bg-red-500/10 text-red-600 dark:text-red-400'
                                                                            : 'border border-slate-500/20 bg-slate-500/10 text-slate-600 dark:text-slate-400'
                                                            }`}
                                                        >
                                                            {item.status ===
                                                            'completed'
                                                                ? 'Selesai'
                                                                : item.status ===
                                                                    'approved'
                                                                  ? 'Disetujui'
                                                                  : item.status ===
                                                                      'submitted'
                                                                    ? 'Ditinjau'
                                                                    : item.status ===
                                                                        'ongoing'
                                                                      ? 'Berjalan'
                                                                      : item.status ===
                                                                          'expired'
                                                                        ? 'Kadaluarsa'
                                                                        : 'Bidding'}
                                                        </span>

                                                        {item.is_creator ? (
                                                            <span className="rounded border border-purple-500/20 bg-purple-500/10 px-2 py-0.5 font-['Orbitron'] text-[8px] font-bold tracking-wider text-purple-600 uppercase dark:text-purple-400">
                                                                Pembuat
                                                            </span>
                                                        ) : item.is_worker ? (
                                                            <span className="rounded border border-indigo-500/20 bg-indigo-500/10 px-2 py-0.5 font-['Orbitron'] text-[8px] font-bold tracking-wider text-indigo-600 uppercase dark:text-indigo-400">
                                                                Pekerja
                                                            </span>
                                                        ) : (
                                                            <span className="rounded border border-slate-200 bg-slate-500/10 px-2 py-0.5 font-['Orbitron'] text-[8px] font-bold tracking-wider text-slate-500 uppercase dark:text-slate-400">
                                                                Bidder
                                                            </span>
                                                        )}
                                                    </div>

                                                    <h3 className="truncate text-xs font-bold text-slate-800 dark:text-slate-200">
                                                        {item.title}
                                                    </h3>

                                                    <p className="text-[10px] text-slate-500 dark:text-slate-400">
                                                        {item.is_creator
                                                            ? item.worker
                                                                ? `Pekerja: ${item.worker.name}`
                                                                : 'Belum Ada Pekerja'
                                                            : `Pembuat: ${item.creator.name}`}
                                                    </p>
                                                </div>

                                                <div className="flex shrink-0 items-center gap-1.5">
                                                    <span className="font-['Orbitron'] text-[10px] font-bold text-purple-600 dark:text-purple-400">
                                                        {item.is_creator
                                                            ? `${formatCurrency(item.min_salary)} - ${formatCurrency(item.max_salary)}`
                                                            : item.my_bid
                                                              ? formatCurrency(
                                                                    item.my_bid
                                                                        .bid_amount,
                                                                )
                                                              : formatCurrency(
                                                                    item.min_salary,
                                                                )}
                                                    </span>
                                                    <svg
                                                        className={`h-3.5 w-3.5 text-slate-400 transition-transform duration-300 dark:text-slate-500 ${
                                                            isExpanded
                                                                ? 'rotate-180 transform'
                                                                : ''
                                                        }`}
                                                        fill="none"
                                                        stroke="currentColor"
                                                        strokeWidth="2.5"
                                                        viewBox="0 0 24 24"
                                                    >
                                                        <path
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                            d="M19.5 8.25l-7.5 7.5-7.5-7.5"
                                                        />
                                                    </svg>
                                                </div>
                                            </div>

                                            {/* Accordion Content */}
                                            {isExpanded && (
                                                <div className="space-y-4 rounded-b-2xl border-t border-slate-200 bg-slate-50/30 px-4 pt-4 pb-4 font-['Oxanium'] text-xs dark:border-slate-800/60 dark:bg-black/10">
                                                    {/* Stepper Progress Horizontal Timeline */}
                                                    <div className="space-y-3.5 rounded-xl border border-slate-200 bg-slate-100/50 p-3.5 font-['Orbitron'] text-[8px] font-bold tracking-wider dark:border-slate-800/80 dark:bg-black/20">
                                                        <span className="block border-b border-slate-200 pb-1.5 text-[8px] font-bold tracking-wider text-slate-500 uppercase dark:border-slate-800">
                                                            Progress Alur Quest
                                                        </span>
                                                        <div className="relative flex items-center justify-between pt-1.5">
                                                            <div className="absolute top-1/2 right-0 left-0 z-0 h-0.5 -translate-y-1/2 bg-slate-200 dark:bg-slate-800" />
                                                            <div
                                                                className="absolute top-1/2 left-0 z-0 h-0.5 -translate-y-1/2 bg-indigo-500 transition-all duration-350"
                                                                style={{
                                                                    width:
                                                                        item.status ===
                                                                        'open'
                                                                            ? '0%'
                                                                            : item.status ===
                                                                                'ongoing'
                                                                              ? '25%'
                                                                              : item.status ===
                                                                                  'submitted'
                                                                                ? '50%'
                                                                                : item.status ===
                                                                                    'approved'
                                                                                  ? '75%'
                                                                                  : '100%',
                                                                }}
                                                            />

                                                            {[
                                                                {
                                                                    key: 'open',
                                                                    label: 'Bidding',
                                                                },
                                                                {
                                                                    key: 'ongoing',
                                                                    label: 'Proyek',
                                                                },
                                                                {
                                                                    key: 'submitted',
                                                                    label: 'Tinjau',
                                                                },
                                                                {
                                                                    key: 'approved',
                                                                    label: 'Setuju',
                                                                },
                                                                {
                                                                    key: 'completed',
                                                                    label: 'Selesai',
                                                                },
                                                            ].map(
                                                                (step, idx) => {
                                                                    const statuses =
                                                                        [
                                                                            'open',
                                                                            'ongoing',
                                                                            'submitted',
                                                                            'approved',
                                                                            'completed',
                                                                        ];
                                                                    const currentIdx =
                                                                        statuses.indexOf(
                                                                            item.status,
                                                                        );
                                                                    const stepIdx =
                                                                        statuses.indexOf(
                                                                            step.key,
                                                                        );
                                                                    const isCompleted =
                                                                        stepIdx <
                                                                            currentIdx ||
                                                                        item.status ===
                                                                            'completed';
                                                                    const isActive =
                                                                        item.status ===
                                                                        step.key;

                                                                    return (
                                                                        <div
                                                                            key={
                                                                                step.key
                                                                            }
                                                                            className="relative z-10 flex flex-col items-center"
                                                                        >
                                                                            <div
                                                                                className={`flex h-5 w-5 items-center justify-center rounded-full border text-[8px] transition-all duration-300 ${
                                                                                    isCompleted
                                                                                        ? 'border-indigo-500 bg-indigo-600 text-white shadow-sm'
                                                                                        : isActive
                                                                                          ? 'border-purple-500 bg-purple-600 text-white shadow-sm'
                                                                                          : 'border-slate-200 bg-slate-50 text-slate-400 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-500'
                                                                                }`}
                                                                            >
                                                                                {isCompleted
                                                                                    ? '✓'
                                                                                    : idx +
                                                                                      1}
                                                                            </div>
                                                                            <span
                                                                                className={`mt-1 text-[7px] tracking-widest uppercase ${
                                                                                    isActive ||
                                                                                    isCompleted
                                                                                        ? 'font-black text-indigo-500 dark:text-indigo-400'
                                                                                        : 'text-slate-400 dark:text-slate-500'
                                                                                }`}
                                                                            >
                                                                                {
                                                                                    step.label
                                                                                }
                                                                            </span>
                                                                        </div>
                                                                    );
                                                                },
                                                            )}
                                                        </div>
                                                    </div>

                                                    {/* Description overview */}
                                                    <div className="space-y-1 rounded-xl border border-slate-200 bg-white p-3 dark:border-slate-800/80 dark:bg-black/15">
                                                        <span className="block text-[8px] font-semibold text-slate-400 uppercase">
                                                            Deskripsi Quest
                                                        </span>
                                                        <p className="text-[11px] leading-relaxed whitespace-pre-wrap text-slate-700 dark:text-slate-300">
                                                            {item.description}
                                                        </p>
                                                    </div>

                                                    {/* Details Budget */}
                                                    <div className="grid grid-cols-2 gap-3 text-[11px]">
                                                        <div>
                                                            <span className="block text-[8px] font-semibold text-slate-400 uppercase">
                                                                Anggaran Gaji
                                                            </span>
                                                            <p className="font-bold text-slate-800 dark:text-slate-200">
                                                                {formatCurrency(
                                                                    item.min_salary,
                                                                )}{' '}
                                                                -{' '}
                                                                {formatCurrency(
                                                                    item.max_salary,
                                                                )}
                                                            </p>
                                                        </div>
                                                        <div>
                                                            <span className="block text-[8px] font-semibold text-slate-400 uppercase">
                                                                Tenggat Waktu
                                                            </span>
                                                            <p className="font-bold text-slate-800 dark:text-slate-200">
                                                                {formatDate(
                                                                    item.deadline,
                                                                )}
                                                            </p>
                                                        </div>
                                                    </div>

                                                    {/* Bid Info */}
                                                    {item.my_bid && (
                                                        <div className="space-y-2 border-t border-slate-800/40 pt-3">
                                                            <h4 className="font-['Orbitron'] text-[9px] font-bold tracking-wider text-slate-400 uppercase">
                                                                Detail Penawaran
                                                                (Bid) Anda
                                                            </h4>
                                                            <div className="grid grid-cols-2 gap-2 text-[11px]">
                                                                <div>
                                                                    <span className="block text-[8px] text-slate-500">
                                                                        Jumlah
                                                                        Bid
                                                                    </span>
                                                                    <p className="font-bold text-purple-600 dark:text-purple-400">
                                                                        {formatCurrency(
                                                                            item
                                                                                .my_bid
                                                                                .bid_amount,
                                                                        )}
                                                                    </p>
                                                                </div>
                                                                <div>
                                                                    <span className="block text-[8px] text-slate-500">
                                                                        Status
                                                                        Bid
                                                                    </span>
                                                                    <span
                                                                        className={`inline-block rounded border px-1.5 py-0.5 font-['Orbitron'] text-[8px] font-black tracking-wider ${
                                                                            item
                                                                                .my_bid
                                                                                .status ===
                                                                            'accepted'
                                                                                ? 'border-green-500/20 bg-green-500/10 text-green-600 dark:text-green-400'
                                                                                : item
                                                                                        .my_bid
                                                                                        .status ===
                                                                                    'rejected'
                                                                                  ? 'border-red-500/20 bg-red-500/10 text-red-600 dark:text-red-400'
                                                                                  : 'border-amber-500/20 bg-amber-500/10 text-amber-600 dark:text-amber-400'
                                                                        }`}
                                                                    >
                                                                        {item
                                                                            .my_bid
                                                                            .status ===
                                                                        'accepted'
                                                                            ? 'Diterima'
                                                                            : item
                                                                                    .my_bid
                                                                                    .status ===
                                                                                'rejected'
                                                                              ? 'Ditolak'
                                                                              : 'Menunggu'}
                                                                    </span>
                                                                </div>
                                                            </div>
                                                            {item.my_bid
                                                                .proposal && (
                                                                <div>
                                                                    <span className="block text-[8px] text-slate-500">
                                                                        Proposal
                                                                        Anda
                                                                    </span>
                                                                    <p className="text-[11px] leading-relaxed whitespace-pre-wrap text-slate-700 dark:text-slate-300">
                                                                        {
                                                                            item
                                                                                .my_bid
                                                                                .proposal
                                                                        }
                                                                    </p>
                                                                </div>
                                                            )}
                                                            {(item.my_bid.cv ||
                                                                item.my_bid
                                                                    .portfolio) && (
                                                                <div className="flex flex-wrap gap-2.5 pt-1">
                                                                    {item.my_bid
                                                                        .cv && (
                                                                        <a
                                                                            href={
                                                                                item
                                                                                    .my_bid
                                                                                    .cv
                                                                            }
                                                                            target="_blank"
                                                                            rel="noopener noreferrer"
                                                                            className="inline-flex items-center gap-1 text-[10px] text-indigo-600 hover:underline dark:text-indigo-400"
                                                                        >
                                                                            CV
                                                                            Lampiran{' '}
                                                                            <ExternalLink className="h-3 w-3" />
                                                                        </a>
                                                                    )}
                                                                    {item.my_bid
                                                                        .portfolio && (
                                                                        <a
                                                                            href={
                                                                                item
                                                                                    .my_bid
                                                                                    .portfolio
                                                                            }
                                                                            target="_blank"
                                                                            rel="noopener noreferrer"
                                                                            className="inline-flex items-center gap-1 text-[10px] text-indigo-600 hover:underline dark:text-indigo-400"
                                                                        >
                                                                            Portofolio
                                                                            Lampiran{' '}
                                                                            <ExternalLink className="h-3 w-3" />
                                                                        </a>
                                                                    )}
                                                                </div>
                                                            )}
                                                        </div>
                                                    )}

                                                    {/* Revision Notes if ongoing */}
                                                    {item.status ===
                                                        'ongoing' &&
                                                        item.revision_note && (
                                                            <div className="space-y-1 rounded-xl border border-red-500/20 bg-red-500/10 p-3">
                                                                <span className="block font-['Orbitron'] text-[8px] font-bold tracking-wider text-red-600 uppercase dark:text-red-400">
                                                                    {item.is_creator
                                                                        ? 'Feedback Revisi Anda:'
                                                                        : 'Minta Revisi Dari Pembuat:'}
                                                                </span>
                                                                <p className="text-[11px] leading-relaxed whitespace-pre-wrap text-red-800 italic dark:text-red-200">
                                                                    "
                                                                    {
                                                                        item.revision_note
                                                                    }
                                                                    "
                                                                </p>
                                                            </div>
                                                        )}

                                                    {/* Work Submission Details */}
                                                    {(item.status ===
                                                        'submitted' ||
                                                        item.status ===
                                                            'approved' ||
                                                        item.status ===
                                                            'completed') && (
                                                        <div className="space-y-3 border-t border-slate-200 pt-3 dark:border-slate-800/40">
                                                            <h4 className="font-['Orbitron'] text-[9px] font-bold tracking-wider text-slate-500 uppercase dark:text-slate-400">
                                                                {item.is_creator
                                                                    ? 'Hasil Pekerjaan Pekerja'
                                                                    : 'Hasil Pekerjaan yang Dikirim'}
                                                            </h4>

                                                            {item.submission_file && (
                                                                <div className="space-y-1">
                                                                    <span className="block text-[8px] text-slate-500">
                                                                        Berkas
                                                                        ZIP
                                                                        Utama
                                                                    </span>
                                                                    <div className="flex items-center justify-between rounded-xl border border-amber-500/20 bg-amber-500/5 p-2.5">
                                                                        <div className="flex min-w-0 items-center gap-2.5">
                                                                            <FileArchive className="h-5 w-5 shrink-0 text-amber-600 dark:text-amber-500" />
                                                                            <div className="min-w-0">
                                                                                <p className="truncate text-xs font-semibold text-slate-800 dark:text-slate-200">
                                                                                    {
                                                                                        item
                                                                                            .submission_file
                                                                                            .name
                                                                                    }
                                                                                </p>
                                                                                <p className="text-[10px] text-slate-500">
                                                                                    {formatBytes(
                                                                                        item
                                                                                            .submission_file
                                                                                            .size,
                                                                                    )}
                                                                                </p>
                                                                            </div>
                                                                        </div>
                                                                        <a
                                                                            href={
                                                                                item
                                                                                    .submission_file
                                                                                    .url
                                                                            }
                                                                            target="_blank"
                                                                            rel="noopener noreferrer"
                                                                            className="flex cursor-pointer items-center justify-center rounded-lg p-1.5 text-amber-600 transition-colors hover:bg-amber-500/10 hover:text-amber-700 dark:text-amber-400 dark:hover:text-amber-500"
                                                                            title="Unduh ZIP di Tab Baru"
                                                                        >
                                                                            <Download className="h-4 w-4" />
                                                                        </a>
                                                                    </div>
                                                                </div>
                                                            )}

                                                            {item.submission_link && (
                                                                <div>
                                                                    <span className="block text-[8px] text-slate-500">
                                                                        Link
                                                                        Pekerjaan
                                                                        Pendukung
                                                                    </span>
                                                                    <a
                                                                        href={
                                                                            item.submission_link
                                                                        }
                                                                        target="_blank"
                                                                        rel="noopener noreferrer"
                                                                        className="mt-0.5 block text-[11px] font-semibold break-all text-indigo-600 hover:underline dark:text-indigo-400"
                                                                    >
                                                                        {
                                                                            item.submission_link
                                                                        }
                                                                    </a>
                                                                </div>
                                                            )}

                                                            {item.submission_note && (
                                                                <div>
                                                                    <span className="block text-[8px] text-slate-500">
                                                                        Catatan
                                                                        Pengiriman
                                                                    </span>
                                                                    <p className="rounded-lg border border-slate-200 bg-white p-2.5 text-[11px] leading-relaxed whitespace-pre-wrap text-slate-700 dark:border-slate-800 dark:bg-slate-950/20 dark:text-slate-300">
                                                                        {
                                                                            item.submission_note
                                                                        }
                                                                    </p>
                                                                </div>
                                                            )}
                                                        </div>
                                                    )}

                                                    {/* Rating, Review Comment, and Gamification Rewards for Completed */}
                                                    {item.status ===
                                                        'completed' && (
                                                        <div className="space-y-3 border-t border-slate-200 pt-3 dark:border-slate-800/40">
                                                            <h4 className="font-['Orbitron'] text-[9px] font-bold tracking-wider text-slate-500 uppercase dark:text-slate-400">
                                                                {item.is_creator
                                                                    ? 'Hasil Ulasan & Hadiah Pekerja'
                                                                    : 'Hasil Ulasan & Hadiah'}
                                                            </h4>

                                                            {item.rating && (
                                                                <div className="space-y-1.5 rounded-xl border border-slate-200 bg-white p-3 dark:border-slate-800/80 dark:bg-slate-950/20">
                                                                    <div className="flex gap-0.5">
                                                                        {[
                                                                            1,
                                                                            2,
                                                                            3,
                                                                            4,
                                                                            5,
                                                                        ].map(
                                                                            (
                                                                                star,
                                                                            ) => (
                                                                                <Star
                                                                                    key={
                                                                                        star
                                                                                    }
                                                                                    className={`h-4 w-4 ${
                                                                                        star <=
                                                                                        (item.rating ??
                                                                                            0)
                                                                                            ? 'fill-amber-400 text-amber-400'
                                                                                            : 'text-slate-300 dark:text-slate-600'
                                                                                    }`}
                                                                                />
                                                                            ),
                                                                        )}
                                                                    </div>
                                                                    {item.rating_comment && (
                                                                        <p className="text-xs leading-relaxed text-slate-600 italic dark:text-slate-300">
                                                                            "
                                                                            {
                                                                                item.rating_comment
                                                                            }
                                                                            "
                                                                        </p>
                                                                    )}
                                                                </div>
                                                            )}

                                                            <div className="grid grid-cols-3 gap-2 pt-1 text-center font-['Orbitron'] text-[9px] font-black">
                                                                <div className="flex flex-col gap-0.5 rounded-xl border border-purple-500/20 bg-purple-500/10 p-2 text-purple-600 dark:text-purple-300">
                                                                    <span className="font-sans text-[7.5px] text-slate-500">
                                                                        EXP{' '}
                                                                        {item.is_creator
                                                                            ? '(Pek)'
                                                                            : ''}
                                                                    </span>
                                                                    <span>
                                                                        +250 EXP
                                                                    </span>
                                                                </div>
                                                                <div className="flex flex-col gap-0.5 rounded-xl border border-amber-500/20 bg-amber-500/10 p-2 text-amber-600 dark:text-amber-400">
                                                                    <span className="font-sans text-[7.5px] text-slate-500">
                                                                        GOLD{' '}
                                                                        {item.is_creator
                                                                            ? '(Pek)'
                                                                            : ''}
                                                                    </span>
                                                                    <span>
                                                                        +150
                                                                        GOLD
                                                                    </span>
                                                                </div>
                                                                <div className="flex flex-col gap-0.5 rounded-xl border border-indigo-500/20 bg-indigo-500/10 p-2 text-indigo-600 dark:text-indigo-300">
                                                                    <span className="font-sans text-[7.5px] text-slate-500">
                                                                        ERP{' '}
                                                                        {item.is_creator
                                                                            ? '(Pek)'
                                                                            : ''}
                                                                    </span>
                                                                    <span>
                                                                        +100 ERP
                                                                    </span>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    )}

                                                    {/* Link to detail page */}
                                                    <div className="pt-2">
                                                        <Link
                                                            href={`/student/quests/${item._id}`}
                                                            className="flex w-full items-center justify-center gap-1.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 py-2.5 text-center font-['Orbitron'] text-[9px] font-bold tracking-wider text-white uppercase transition-colors hover:from-indigo-700 hover:to-purple-700"
                                                        >
                                                            Buka Halaman Quest{' '}
                                                            <ExternalLink className="h-3.5 w-3.5" />
                                                        </Link>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    );
                                })
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
