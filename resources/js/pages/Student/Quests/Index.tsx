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
    Sparkles,
    User,
    Compass,
    Activity,
    Info,
    CheckCircle2,
} from 'lucide-react';

interface Quest {
    _id: string;
    title: string;
    description: string;
    min_salary: number;
    max_salary: number;
    deadline: string;
    status: string;
    creator: {
        name: string;
        role: string;
    };
    bids_count: number;
}

interface HistoryQuest {
    _id: string;
    title: string;
    description: string;
    min_salary: number;
    max_salary: number;
    deadline: string;
    status: string;
    creator: {
        name: string;
        role: string;
    };
    worker_id?: string;
    is_worker: boolean;
    is_creator: boolean;
    worker?: {
        name: string;
        email: string;
    } | null;
    my_bid?: {
        bid_amount: number;
        status: string;
        proposal?: string;
        cv?: string;
        portfolio?: string;
    } | null;
    submission_link?: string;
    submission_note?: string;
    submission_file?: {
        name: string;
        size: number;
        url: string;
    } | null;
    submitted_at?: string;
    completed_at?: string;
    rating?: number;
    rating_comment?: string;
    revision_note?: string;
}

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

    // Dynamic RPG rewards badges based on budget rank
    const getQuestRank = (maxVal: number) => {
        if (maxVal >= 10000000)
            return {
                rank: 'Mythic',
                color: 'text-red-500 bg-red-500/10 border-red-500/20',
            };
        if (maxVal >= 5000000)
            return {
                rank: 'Diamond',
                color: 'text-blue-400 bg-blue-500/10 border-blue-500/20',
            };
        if (maxVal >= 2500000)
            return {
                rank: 'Gold',
                color: 'text-amber-500 bg-amber-500/10 border-amber-500/20',
            };
        if (maxVal >= 1000000)
            return {
                rank: 'Silver',
                color: 'text-slate-400 bg-slate-500/10 border-slate-500/20',
            };
        return {
            rank: 'Bronze',
            color: 'text-orange-500 bg-orange-500/10 border-orange-500/20',
        };
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
                {/* HEADER */}
                <div className="flex flex-col gap-4 border-b border-slate-200 pb-5 sm:flex-row sm:items-center sm:justify-between dark:border-slate-800/80">
                    <div className="flex items-center gap-3">
                        <Link
                            href="/student/dashboard"
                            className="shrink-0 cursor-pointer rounded-xl border border-slate-200 bg-white p-2.5 text-slate-500 shadow-sm transition-colors hover:text-indigo-600 dark:border-slate-800 dark:bg-[#0c122c]/40 dark:text-slate-400 dark:hover:text-indigo-400"
                            title="Kembali ke Dashboard"
                        >
                            <ArrowLeft size={16} />
                        </Link>
                        <div>
                            <h2 className="font-['Oxanium'] text-xl font-extrabold tracking-tight text-slate-900 sm:text-2xl md:text-3xl dark:text-white">
                                QUEST BOARD
                            </h2>
                            <p className="text-xs font-medium text-slate-400">
                                Cari dan selesaikan berbagai quest menantang
                                untuk menaikkan reputasi RPG Anda.
                            </p>
                        </div>
                    </div>

                    <div className="flex shrink-0 flex-wrap gap-2.5">
                        <button
                            type="button"
                            onClick={() => setIsHistoryOpen(true)}
                            className="inline-flex transform cursor-pointer items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4.5 py-2 font-['Orbitron'] text-xs font-bold tracking-wider text-slate-700 uppercase shadow-sm transition-all duration-300 hover:bg-slate-100 active:scale-95 dark:border-blue-500/20 dark:bg-blue-950/20 dark:text-blue-100 dark:hover:bg-blue-950/40"
                        >
                            <History className="text-purple-550 h-4 w-4 dark:text-purple-400" />
                            Riwayat Quest
                        </button>

                        <Link
                            href="/student/quests/create"
                            className="inline-flex transform items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 px-5 py-2.5 font-['Orbitron'] text-xs font-bold tracking-wider text-white uppercase shadow-[0_0_15px_rgba(124,58,237,0.3)] transition-all duration-300 hover:scale-[1.02] hover:from-purple-700 hover:to-indigo-700 active:scale-98"
                        >
                            <Plus className="h-4 w-4" />
                            Tambah Quest
                        </Link>
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
                                className="dark:text-slate-350 w-full cursor-pointer rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-xs font-bold tracking-wider text-slate-600 uppercase focus:border-indigo-500 focus:outline-none dark:border-slate-800 dark:bg-black/20"
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
                        <div className="scrollbar-thin flex w-full gap-2 overflow-x-auto pb-1 md:w-auto md:pb-0">
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
                        <p className="text-slate-650 text-base font-bold dark:text-blue-200">
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
                        {sortedQuests.map((quest) => {
                            const rankInfo = getQuestRank(quest.max_salary);
                            return (
                                <div
                                    key={quest._id}
                                    className="group relative flex transform flex-col justify-between rounded-2xl border border-slate-200 bg-white/70 p-5 shadow-sm backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:border-indigo-500/45 hover:shadow-[0_0_20px_rgba(99,102,241,0.08)] dark:border-slate-800/80 dark:bg-[#0c122c]/40 dark:hover:border-indigo-500/40"
                                >
                                    <div>
                                        {/* Badge header */}
                                        <div className="mb-3 flex items-start justify-between gap-3 font-['Orbitron']">
                                            <span
                                                className={`rounded border px-2 py-0.5 text-[9px] font-black tracking-wider uppercase ${rankInfo.color}`}
                                            >
                                                Rank: {rankInfo.rank}
                                            </span>

                                            <span
                                                className={`rounded-full border px-2.5 py-0.5 text-[9px] font-black tracking-wider uppercase ${
                                                    quest.status === 'open'
                                                        ? 'border-green-500/20 bg-green-500/10 text-green-700 dark:text-green-400'
                                                        : quest.status ===
                                                            'ongoing'
                                                          ? 'border-blue-500/20 bg-blue-500/10 text-blue-700 dark:text-blue-400'
                                                          : 'border-slate-500/20 bg-slate-500/10 text-slate-600 dark:text-slate-400'
                                                }`}
                                            >
                                                {quest.status === 'open'
                                                    ? 'Tersedia'
                                                    : quest.status === 'ongoing'
                                                      ? 'Berjalan'
                                                      : 'Selesai'}
                                            </span>
                                        </div>

                                        {/* Title */}
                                        <h2 className="mb-2 line-clamp-1 font-['Oxanium'] text-sm font-extrabold tracking-tight text-slate-900 transition-colors group-hover:text-indigo-600 sm:text-base dark:text-white dark:group-hover:text-indigo-400">
                                            {quest.title}
                                        </h2>

                                        {/* Description */}
                                        <p className="dark:text-slate-350 mb-4 line-clamp-3 font-['Oxanium'] text-xs leading-relaxed text-slate-500">
                                            {quest.description}
                                        </p>

                                        {/* Specifications details */}
                                        <div className="mb-4 grid grid-cols-2 gap-3 border-t border-slate-100 pt-4 font-['Oxanium'] text-[11px] dark:border-slate-800/40">
                                            <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400">
                                                <DollarSign className="h-4 w-4 shrink-0 text-indigo-500" />
                                                <div>
                                                    <span className="block text-[8px] font-semibold tracking-wider text-slate-400 uppercase">
                                                        Rentang Gaji
                                                    </span>
                                                    <span className="font-bold text-slate-700 dark:text-white">
                                                        {formatCurrency(
                                                            quest.min_salary,
                                                        )}{' '}
                                                        -{' '}
                                                        {formatCurrency(
                                                            quest.max_salary,
                                                        )}
                                                    </span>
                                                </div>
                                            </div>

                                            <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400">
                                                <Calendar className="h-4 w-4 shrink-0 text-indigo-500" />
                                                <div>
                                                    <span className="block text-[8px] font-semibold tracking-wider text-slate-400 uppercase">
                                                        Deadline
                                                    </span>
                                                    <span className="font-bold text-slate-700 dark:text-white">
                                                        {formatDate(
                                                            quest.deadline,
                                                        )}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Card Footer */}
                                    <div className="mt-auto flex items-center justify-between border-t border-slate-100 pt-4 dark:border-slate-800/40">
                                        <div className="flex flex-col font-['Oxanium']">
                                            <span className="text-[8px] font-semibold tracking-wider text-slate-400 uppercase">
                                                Diposting Oleh
                                            </span>
                                            <span className="text-xs font-bold text-slate-600 dark:text-slate-300">
                                                {quest.creator.name}
                                                <span className="ml-1 text-[10px] font-medium text-slate-400">
                                                    (
                                                    {quest.creator.role ===
                                                    'admin'
                                                        ? 'Admin'
                                                        : 'Siswa'}
                                                    )
                                                </span>
                                            </span>
                                        </div>

                                        <div className="flex items-center gap-3">
                                            <div className="flex items-center gap-1 font-['Oxanium'] text-xs font-semibold text-slate-400 dark:text-slate-500">
                                                <Users className="h-4 w-4" />
                                                <span>
                                                    {quest.bids_count} Bid
                                                </span>
                                            </div>

                                            <Link
                                                href={`/student/quests/${quest._id}`}
                                                className="text-indigo-650 dark:text-indigo-305 rounded-lg border border-indigo-500/20 bg-indigo-500/10 px-4 py-1.5 font-['Orbitron'] text-[10px] font-bold tracking-wider uppercase transition-all duration-300 group-hover:border-indigo-600 group-hover:bg-indigo-600 group-hover:text-white"
                                            >
                                                Ambil Detail
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
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
                    <div className="relative z-10 flex h-full w-full max-w-lg translate-x-0 transform flex-col border-l border-slate-800 bg-slate-900/90 shadow-2xl backdrop-blur-lg transition-transform duration-300 md:max-w-xl dark:bg-[#070b19]/95">
                        {/* Drawer Header */}
                        <div className="flex items-center justify-between border-b border-slate-800 bg-black/20 p-5">
                            <div className="flex items-center gap-2.5">
                                <History className="h-5 w-5 text-indigo-400" />
                                <h2 className="font-['Orbitron'] text-sm font-extrabold tracking-wider text-white uppercase sm:text-base">
                                    Riwayat Quest Saya
                                </h2>
                            </div>
                            <button
                                onClick={() => setIsHistoryOpen(false)}
                                className="cursor-pointer rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-white/10 hover:text-white"
                            >
                                <X className="h-5 w-5" />
                            </button>
                        </div>

                        {/* Quick filter tabs inside history drawer */}
                        <div className="scrollbar-none flex gap-2 overflow-x-auto border-b border-slate-800 bg-black/10 px-5 py-2.5 font-['Orbitron'] text-[9px] font-black tracking-wider uppercase">
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
                                            : 'border-white/5 bg-white/5 text-slate-400 hover:bg-white/10 hover:text-white'
                                    }`}
                                >
                                    {roleTab.label}
                                </button>
                            ))}
                        </div>

                        {/* List / Content */}
                        <div className="scrollbar-thin flex-1 space-y-4 overflow-y-auto p-5">
                            {filteredHistoryQuests.length === 0 ? (
                                <div className="py-20 text-center text-slate-500">
                                    <Briefcase className="text-indigo-450 mx-auto mb-3 h-12 w-12 animate-pulse opacity-30" />
                                    <p className="text-slate-350 text-sm font-bold">
                                        Tidak ada riwayat quest
                                    </p>
                                    <p className="text-slate-450 mx-auto mt-1 max-w-[280px] text-[11px] leading-relaxed">
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
                                            className={`rounded-2xl border bg-white/5 transition-all duration-300 dark:bg-black/25 ${
                                                isExpanded
                                                    ? 'border-indigo-500/50 shadow-[0_0_15px_rgba(99,102,241,0.12)]'
                                                    : 'border-slate-800 hover:border-slate-700'
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
                                                                    ? 'border border-green-500/20 bg-green-500/10 text-green-400'
                                                                    : item.status ===
                                                                        'approved'
                                                                      ? 'text-indigo-405 border border-indigo-500/20 bg-indigo-500/10'
                                                                      : item.status ===
                                                                          'submitted'
                                                                        ? 'border border-amber-500/20 bg-amber-500/10 text-amber-400'
                                                                        : item.status ===
                                                                            'ongoing'
                                                                          ? 'border border-blue-500/20 bg-blue-500/10 text-blue-400'
                                                                          : item.status ===
                                                                              'expired'
                                                                            ? 'border border-red-500/20 bg-red-500/10 text-red-400'
                                                                            : 'border border-slate-500/20 bg-slate-500/10 text-slate-400'
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
                                                            <span className="rounded border border-purple-500/20 bg-purple-500/10 px-2 py-0.5 font-['Orbitron'] text-[8px] font-bold tracking-wider text-purple-400 uppercase">
                                                                Pembuat
                                                            </span>
                                                        ) : item.is_worker ? (
                                                            <span className="rounded border border-indigo-500/20 bg-indigo-500/10 px-2 py-0.5 font-['Orbitron'] text-[8px] font-bold tracking-wider text-indigo-400 uppercase">
                                                                Pekerja
                                                            </span>
                                                        ) : (
                                                            <span className="border-slate-550/20 rounded border bg-slate-500/10 px-2 py-0.5 font-['Orbitron'] text-[8px] font-bold tracking-wider text-slate-400 uppercase">
                                                                Bidder
                                                            </span>
                                                        )}
                                                    </div>

                                                    <h3 className="truncate text-xs font-bold text-slate-200">
                                                        {item.title}
                                                    </h3>

                                                    <p className="text-slate-450 text-[10px]">
                                                        {item.is_creator
                                                            ? item.worker
                                                                ? `Pekerja: ${item.worker.name}`
                                                                : 'Belum Ada Pekerja'
                                                            : `Pembuat: ${item.creator.name}`}
                                                    </p>
                                                </div>

                                                <div className="flex shrink-0 items-center gap-1.5">
                                                    <span className="font-['Orbitron'] text-[10px] font-bold text-purple-400">
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
                                                        className={`h-3.5 w-3.5 text-slate-500 transition-transform duration-300 ${
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
                                                <div className="space-y-4 rounded-b-2xl border-t border-slate-800/60 bg-black/10 px-4 pt-4 pb-4 font-['Oxanium'] text-xs">
                                                    {/* Stepper Progress Horizontal Timeline */}
                                                    <div className="space-y-3.5 rounded-xl border border-slate-800/80 bg-black/20 p-3.5 font-['Orbitron'] text-[8px] font-bold tracking-wider">
                                                        <span className="block border-b border-slate-800 pb-1.5 text-[8px] font-bold tracking-wider text-slate-500 uppercase">
                                                            Progress Alur Quest
                                                        </span>
                                                        <div className="relative flex items-center justify-between pt-1.5">
                                                            <div className="absolute top-1/2 right-0 left-0 z-0 h-0.5 -translate-y-1/2 bg-slate-800" />
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
                                                                                          : 'border-slate-800 bg-slate-900 text-slate-500'
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
                                                                                        ? 'font-black text-indigo-400'
                                                                                        : 'text-slate-500'
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
                                                    <div className="space-y-1 rounded-xl border border-slate-800/80 bg-black/15 p-3">
                                                        <span className="text-slate-405 block text-[8px] font-semibold uppercase">
                                                            Deskripsi Quest
                                                        </span>
                                                        <p className="text-slate-350 text-[11px] leading-relaxed whitespace-pre-wrap">
                                                            {item.description}
                                                        </p>
                                                    </div>

                                                    {/* Details Budget */}
                                                    <div className="grid grid-cols-2 gap-3 text-[11px]">
                                                        <div>
                                                            <span className="text-slate-450 block text-[8px] font-semibold uppercase">
                                                                Anggaran Gaji
                                                            </span>
                                                            <p className="text-slate-205 font-bold">
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
                                                            <span className="text-slate-450 block text-[8px] font-semibold uppercase">
                                                                Tenggat Waktu
                                                            </span>
                                                            <p className="text-slate-205 font-bold">
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
                                                                    <span className="text-slate-455 block text-[8px]">
                                                                        Jumlah
                                                                        Bid
                                                                    </span>
                                                                    <p className="font-bold text-purple-400">
                                                                        {formatCurrency(
                                                                            item
                                                                                .my_bid
                                                                                .bid_amount,
                                                                        )}
                                                                    </p>
                                                                </div>
                                                                <div>
                                                                    <span className="text-slate-455 block text-[8px]">
                                                                        Status
                                                                        Bid
                                                                    </span>
                                                                    <span
                                                                        className={`inline-block rounded border px-1.5 py-0.5 font-['Orbitron'] text-[8px] font-black tracking-wider ${
                                                                            item
                                                                                .my_bid
                                                                                .status ===
                                                                            'accepted'
                                                                                ? 'border-green-500/20 bg-green-500/10 text-green-400'
                                                                                : item
                                                                                        .my_bid
                                                                                        .status ===
                                                                                    'rejected'
                                                                                  ? 'border-red-500/20 bg-red-500/10 text-red-400'
                                                                                  : 'border-amber-500/20 bg-amber-500/10 text-amber-400'
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
                                                                    <span className="text-slate-455 block text-[8px]">
                                                                        Proposal
                                                                        Anda
                                                                    </span>
                                                                    <p className="text-slate-350 text-[11px] leading-relaxed whitespace-pre-wrap">
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
                                                                            className="inline-flex items-center gap-1 text-[10px] text-indigo-400 hover:underline"
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
                                                                            className="inline-flex items-center gap-1 text-[10px] text-indigo-400 hover:underline"
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
                                                                <span className="block font-['Orbitron'] text-[8px] font-bold tracking-wider text-red-500 uppercase">
                                                                    {item.is_creator
                                                                        ? 'Feedback Revisi Anda:'
                                                                        : 'Minta Revisi Dari Pembuat:'}
                                                                </span>
                                                                <p className="text-[11px] leading-relaxed whitespace-pre-wrap text-slate-300 italic">
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
                                                        <div className="space-y-3 border-t border-slate-800/40 pt-3">
                                                            <h4 className="font-['Orbitron'] text-[9px] font-bold tracking-wider text-slate-400 uppercase">
                                                                {item.is_creator
                                                                    ? 'Hasil Pekerjaan Pekerja'
                                                                    : 'Hasil Pekerjaan yang Dikirim'}
                                                            </h4>

                                                            {item.submission_file && (
                                                                <div className="space-y-1">
                                                                    <span className="text-slate-455 block text-[8px]">
                                                                        Berkas
                                                                        ZIP
                                                                        Utama
                                                                    </span>
                                                                    <div className="flex items-center justify-between rounded-xl border border-amber-500/20 bg-amber-500/5 p-2.5">
                                                                        <div className="flex min-w-0 items-center gap-2.5">
                                                                            <FileArchive className="h-5 w-5 shrink-0 text-amber-500" />
                                                                            <div className="min-w-0">
                                                                                <p className="truncate text-xs font-semibold text-slate-200">
                                                                                    {
                                                                                        item
                                                                                            .submission_file
                                                                                            .name
                                                                                    }
                                                                                </p>
                                                                                <p className="text-[10px] text-slate-400">
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
                                                                            className="flex cursor-pointer items-center justify-center rounded-lg p-1.5 text-amber-400 transition-colors hover:bg-amber-500/10 hover:text-amber-500"
                                                                            title="Unduh ZIP di Tab Baru"
                                                                        >
                                                                            <Download className="h-4 w-4" />
                                                                        </a>
                                                                    </div>
                                                                </div>
                                                            )}

                                                            {item.submission_link && (
                                                                <div>
                                                                    <span className="text-slate-455 block text-[8px]">
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
                                                                        className="mt-0.5 block text-[11px] font-semibold break-all text-indigo-400 hover:underline"
                                                                    >
                                                                        {
                                                                            item.submission_link
                                                                        }
                                                                    </a>
                                                                </div>
                                                            )}

                                                            {item.submission_note && (
                                                                <div>
                                                                    <span className="text-slate-455 block text-[8px]">
                                                                        Catatan
                                                                        Pengiriman
                                                                    </span>
                                                                    <p className="text-slate-350 rounded-lg border border-slate-800 bg-slate-950/20 p-2.5 text-[11px] leading-relaxed whitespace-pre-wrap">
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
                                                        <div className="space-y-3 border-t border-slate-800/40 pt-3">
                                                            <h4 className="font-['Orbitron'] text-[9px] font-bold tracking-wider text-slate-400 uppercase">
                                                                {item.is_creator
                                                                    ? 'Hasil Ulasan & Hadiah Pekerja'
                                                                    : 'Hasil Ulasan & Hadiah'}
                                                            </h4>

                                                            {item.rating && (
                                                                <div className="space-y-1.5 rounded-xl border border-slate-800/80 bg-slate-950/20 p-3">
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
                                                                                            : 'text-slate-650'
                                                                                    }`}
                                                                                />
                                                                            ),
                                                                        )}
                                                                    </div>
                                                                    {item.rating_comment && (
                                                                        <p className="text-xs leading-relaxed text-slate-300 italic">
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
                                                                <div className="flex flex-col gap-0.5 rounded-xl border border-purple-500/20 bg-purple-500/10 p-2 text-purple-300">
                                                                    <span className="text-slate-450 font-sans text-[7.5px]">
                                                                        EXP{' '}
                                                                        {item.is_creator
                                                                            ? '(Pek)'
                                                                            : ''}
                                                                    </span>
                                                                    <span>
                                                                        +250 EXP
                                                                    </span>
                                                                </div>
                                                                <div className="flex flex-col gap-0.5 rounded-xl border border-amber-500/20 bg-amber-500/10 p-2 text-amber-400">
                                                                    <span className="text-slate-450 font-sans text-[7.5px]">
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
                                                                <div className="flex flex-col gap-0.5 rounded-xl border border-indigo-500/20 bg-indigo-500/10 p-2 text-indigo-300">
                                                                    <span className="text-slate-455 font-sans text-[7.5px]">
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
