import { Link, router } from '@inertiajs/react';
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    DollarSign,
    Users,
    Star,
    Search,
    ChevronLeft,
    ChevronRight,
    ChevronDown,
    CheckCircle2,
    ExternalLink,
    Download,
    FileArchive,
    Clock,
    Eye,
    Check,
    Briefcase,
    MessageSquare,
} from 'lucide-react';

import { HistoryQuest } from '@/types/quest';

interface PaginatedHistory {
    data: HistoryQuest[];
    links: { url: string | null; label: string; active: boolean }[];
    current_page: number;
    last_page: number;
    total: number;
    from: number;
    to: number;
}

interface Props {
    quests: PaginatedHistory;
    stats: {
        completed_quests_count: number;
        total_bids_placed: number;
        total_bids_received: number;
    };
    filters: {
        search?: string;
        role?: string;
        status?: string;
    };
}

export default function HistoryPage({ quests, stats, filters }: Props) {
    const [searchQuery, setSearchQuery] = useState(filters?.search || '');
    const [roleFilter, setRoleFilter] = useState(filters?.role || 'all');
    const [statusFilter, setStatusFilter] = useState(filters?.status || 'all');
    const [expandedQuestId, setExpandedQuestId] = useState<string | null>(null);

    // Format Currency Helper
    const formatCurrency = (val: number) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
        }).format(val);
    };

    // Format Date Helper
    const formatDate = (dateStr?: string) => {
        if (!dateStr) return '-';
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
        return `${datePart} ${timePart}`;
    };

    // Debounced search and filter effect
    useEffect(() => {
        const hasSearchChanged = searchQuery !== (filters?.search || '');
        const hasRoleChanged = roleFilter !== (filters?.role || 'all');
        const hasStatusChanged = statusFilter !== (filters?.status || 'all');

        if (!hasSearchChanged && !hasRoleChanged && !hasStatusChanged) {
            return;
        }

        const timeout = setTimeout(() => {
            router.get(
                '/student/quests/history',
                {
                    search: searchQuery || undefined,
                    role: roleFilter !== 'all' ? roleFilter : undefined,
                    status: statusFilter !== 'all' ? statusFilter : undefined,
                },
                {
                    preserveState: true,
                    preserveScroll: true,
                    replace: true,
                },
            );
        }, 300);

        return () => clearTimeout(timeout);
    }, [searchQuery, roleFilter, statusFilter, filters]);

    const getAccentBorderClass = (status: string) => {
        switch (status) {
            case 'completed':
                return 'border-l-4 border-l-emerald-500';
            case 'ongoing':
                return 'border-l-4 border-l-indigo-600';
            case 'open':
                return 'border-l-4 border-l-amber-500';
            case 'expired':
                return 'border-l-4 border-l-red-500';
            case 'submitted':
                return 'border-l-4 border-l-purple-505';
            case 'approved':
            case 'payment':
                return 'border-l-4 border-l-cyan-500';
            default:
                return 'border-l-4 border-l-slate-400';
        }
    };

    const formatBytes = (bytes?: number, decimals = 2) => {
        if (!bytes) return '0 Bytes';
        const k = 1024;
        const dm = decimals < 0 ? 0 : decimals;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return (
            parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i]
        );
    };

    const getDeadlineCountdown = (deadlineStr?: string) => {
        if (!deadlineStr) return '';
        const diff = new Date(deadlineStr).getTime() - new Date().getTime();
        if (diff <= 0) {
            return 'Melewati Batas';
        }
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor(
            (diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60),
        );
        if (days > 0) {
            return `${days} Hari ${hours} Jam`;
        }
        return `${hours} Jam`;
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
                            href="/student/quests"
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
                            RIWAYAT PEKERJAAN
                        </h1>

                        {/* Spacer to center title on mobile */}
                        <div className="h-10 w-10 shrink-0 md:hidden" />
                    </div>
                </div>
            </div>

            <div className="relative z-10 w-full max-w-none px-4 py-8 sm:px-6 lg:px-10">

                {/* Professional Stats Cards */}
                <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
                    {/* Projects Completed */}
                    <div className="relative overflow-hidden rounded-xl border border-slate-300 bg-white p-5 shadow-sm dark:border-slate-800/80 dark:bg-gradient-to-b dark:from-[#0e0e1a] dark:to-[#090910]">
                        <div className="absolute top-0 right-8 left-8 h-px bg-gradient-to-r from-transparent via-slate-300 to-transparent dark:via-slate-700 pointer-events-none select-none z-0" />
                        <div className="relative z-10 flex items-center justify-between">
                            <div>
                                <p className="text-[10px] font-bold tracking-wider text-slate-600 uppercase dark:text-slate-400">
                                    Kontrak Diselesaikan
                                </p>
                                <p className="mt-2 text-2xl font-black text-slate-900 dark:text-white">
                                    {stats.completed_quests_count}
                                </p>
                            </div>
                            <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-emerald-100/80 text-emerald-700 dark:bg-[#030712] dark:text-emerald-400">
                                <CheckCircle2 size={20} />
                            </div>
                        </div>
                    </div>

                    {/* Total Bid (Pekerja) */}
                    <div className="relative overflow-hidden rounded-xl border border-slate-300 bg-white p-5 shadow-sm dark:border-slate-800/80 dark:bg-gradient-to-b dark:from-[#0e0e1a] dark:to-[#090910]">
                        <div className="absolute top-0 right-8 left-8 h-px bg-gradient-to-r from-transparent via-slate-300 to-transparent dark:via-slate-700 pointer-events-none select-none z-0" />
                        <div className="relative z-10 flex items-center justify-between">
                            <div>
                                <p className="text-[10px] font-bold tracking-wider text-slate-600 uppercase dark:text-slate-400">
                                    Total Penawaran (Sebagai Kontraktor)
                                </p>
                                <p className="mt-2 text-xl font-bold text-slate-900 dark:text-white">
                                    {formatCurrency(stats.total_bids_placed)}
                                </p>
                            </div>
                            <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-indigo-100/80 text-indigo-700 dark:bg-[#030712] dark:text-indigo-400">
                                <DollarSign size={20} />
                            </div>
                        </div>
                    </div>

                    {/* Total Bid (Pembuat Quest) */}
                    <div className="relative overflow-hidden rounded-xl border border-slate-300 bg-white p-5 shadow-sm dark:border-slate-800/80 dark:bg-gradient-to-b dark:from-[#0e0e1a] dark:to-[#090910]">
                        <div className="absolute top-0 right-8 left-8 h-px bg-gradient-to-r from-transparent via-slate-300 to-transparent dark:via-slate-700 pointer-events-none select-none z-0" />
                        <div className="relative z-10 flex items-center justify-between">
                            <div>
                                <p className="text-[10px] font-bold tracking-wider text-slate-600 uppercase dark:text-slate-400">
                                    Total Biaya Keluar (Sebagai Klien)
                                </p>
                                <p className="mt-2 text-xl font-bold text-slate-900 dark:text-white">
                                    {formatCurrency(stats.total_bids_received)}
                                </p>
                            </div>
                            <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-amber-100/80 text-amber-700 dark:bg-[#030712] dark:text-amber-400">
                                <DollarSign size={20} />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Filter and Search Bar */}
                <div className="relative overflow-hidden mb-6 flex flex-col gap-4 rounded-xl border border-slate-300 bg-white p-5 shadow-sm xl:flex-row xl:items-center xl:justify-between dark:border-slate-800/80 dark:bg-gradient-to-b dark:from-[#0e0e1a] dark:to-[#090910]">
                    <div className="absolute top-0 right-8 left-8 h-px bg-gradient-to-r from-transparent via-slate-300 to-transparent dark:via-slate-700 pointer-events-none select-none z-0" />
                    <div className="relative z-10 flex flex-col xl:flex-row xl:items-center xl:justify-between gap-4 w-full">
                    {/* Search */}
                    <div className="relative w-full xl:max-w-md">
                        <input
                            type="text"
                            placeholder="Cari judul kontrak proyek..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full rounded-lg border border-slate-300 bg-slate-50/90 py-2.5 pr-4 pl-10 text-xs font-semibold text-slate-900 placeholder:text-slate-500 focus:border-indigo-600 focus:bg-white focus:outline-none dark:border-slate-800 dark:bg-[#030712] dark:text-white"
                        />
                        <Search className="absolute top-3.5 left-3.5 h-4 w-4 text-slate-600 dark:text-slate-400" />
                    </div>

                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center xl:justify-end">
                        {/* Role Filter Pills */}
                        <div className="flex w-full gap-1.5 overflow-x-auto pb-1 sm:w-auto sm:pb-0 scrollbar-none">
                            {[
                                { key: 'all', label: 'Semua Peran' },
                                { key: 'worker', label: 'Pekerja' },
                                { key: 'creator', label: 'Klien' },
                                { key: 'bidder', label: 'Pelamar' },
                            ].map((roleOption) => (
                                <button
                                    key={roleOption.key}
                                    onClick={() =>
                                        setRoleFilter(roleOption.key)
                                    }
                                    className={`cursor-pointer rounded-lg px-3.5 py-2 text-xs font-bold whitespace-nowrap transition-all ${
                                        roleFilter === roleOption.key
                                            ? 'border border-indigo-600 bg-indigo-600 text-white shadow-sm'
                                            : 'border border-slate-300 bg-slate-100/90 text-slate-700 hover:bg-slate-200 hover:text-slate-900 dark:border-slate-800 dark:bg-[#030712] dark:text-slate-400'
                                    }`}
                                >
                                    {roleOption.label}
                                </button>
                            ))}
                        </div>

                        {/* Status Dropdown */}
                        <div className="relative w-full sm:w-44">
                            <select
                                value={statusFilter}
                                onChange={(e) =>
                                    setStatusFilter(e.target.value)
                                }
                                className="w-full cursor-pointer appearance-none rounded-lg border border-slate-300 bg-slate-50/90 px-3 py-2.5 pr-8 text-xs font-bold text-slate-800 focus:border-indigo-600 focus:bg-white focus:outline-none dark:border-slate-800 dark:bg-[#030712] dark:text-slate-300"
                            >
                                <option value="all">Semua Status</option>
                                <option value="open">Bidding</option>
                                <option value="ongoing">Pengerjaan</option>
                                <option value="submitted">Tinjauan</option>
                                <option value="approved">Disetujui</option>
                                <option value="payment">Pembayaran</option>
                                <option value="completed">Selesai</option>
                                <option value="rejected">Ditolak</option>
                                <option value="expired">Kadaluarsa</option>
                            </select>
                            <ChevronDown className="pointer-events-none absolute top-3.5 right-3 h-3.5 w-3.5 text-slate-600 dark:text-slate-400" />
                        </div>
                    </div>
                    </div>
                </div>

                {/* Main Content - Quest Cards Accordion */}
                {quests.data.length === 0 ? (
                    <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50/20 py-20 text-center dark:border-slate-800 dark:bg-[#0d1117]/30">
                        <Briefcase className="mx-auto mb-3 h-10 w-10 text-slate-355 dark:text-slate-700" />
                        <p className="text-sm font-bold text-slate-700 dark:text-slate-300">
                            Tidak ada data kerja dalam riwayat
                        </p>
                        <p className="mt-1 text-xs text-slate-400">
                            Coba ubah kata kunci pencarian atau filter peran/status Anda.
                        </p>
                    </div>
                ) : (
                    <div className="mx-auto flex w-full flex-col gap-4 pb-12">
                        {quests.data.map((item) => {
                            const isExpanded = expandedQuestId === item._id;

                            return (
                                <div
                                    key={item._id}
                                    className={`relative overflow-hidden rounded-xl border bg-white transition-all duration-200 ${getAccentBorderClass(item.status)} ${
                                        isExpanded
                                            ? 'border-indigo-500/40 shadow-md dark:border-indigo-500/40 dark:bg-gradient-to-b dark:from-[#0e0e1a] dark:to-[#090910]'
                                            : 'border-slate-300 hover:border-indigo-400 hover:shadow-sm dark:border-slate-800/80 dark:bg-gradient-to-b dark:from-[#0e0e1a] dark:to-[#090910] dark:hover:border-slate-750'
                                    }`}
                                >
                                    <div className="absolute top-0 right-8 left-8 h-px bg-gradient-to-r from-transparent via-slate-300 to-transparent dark:via-slate-700 pointer-events-none select-none z-0" />
                                    {/* Accordion Trigger/Header */}
                                    <div
                                        onClick={() =>
                                            setExpandedQuestId(
                                                isExpanded ? null : item._id,
                                            )
                                        }
                                        className="relative z-10 flex cursor-pointer flex-col justify-between gap-4 p-5 select-none sm:flex-row sm:items-center"
                                    >
                                        <div className="min-w-0 flex-1 space-y-2">
                                            <div className="flex flex-wrap items-center gap-2">
                                                {/* Status Badge */}
                                                <span
                                                    className={`rounded border px-2.5 py-0.5 text-[9.5px] font-extrabold uppercase ${
                                                        item.status === 'completed'
                                                            ? 'border-emerald-500/40 bg-emerald-100 text-emerald-800 dark:border-slate-800 dark:bg-[#030712] dark:text-emerald-450'
                                                            : ['approved', 'payment'].includes(item.status)
                                                              ? 'border-amber-500/40 bg-amber-100 text-amber-900 dark:border-slate-800 dark:bg-[#030712] dark:text-cyan-405'
                                                              : item.status === 'submitted'
                                                                ? 'border-purple-500/40 bg-purple-100 text-purple-900 dark:border-slate-800 dark:bg-[#030712] dark:text-purple-400'
                                                                : item.status === 'ongoing'
                                                                  ? 'border-blue-500/40 bg-blue-100 text-blue-900 dark:border-slate-800 dark:bg-[#030712] dark:text-indigo-400'
                                                                  : item.status === 'expired'
                                                                    ? 'border-red-500/40 bg-red-100 text-red-900 dark:border-slate-800 dark:bg-[#030712] dark:text-red-400'
                                                                    : 'border-slate-300 bg-slate-200/80 text-slate-800 dark:border-slate-800 dark:bg-[#030712] dark:text-slate-400'
                                                    }`}
                                                >
                                                    {item.status === 'completed'
                                                        ? 'Selesai'
                                                        : ['approved', 'payment'].includes(item.status)
                                                          ? 'Pembayaran'
                                                          : item.status === 'submitted'
                                                            ? 'Ditinjau'
                                                            : item.status === 'ongoing'
                                                              ? 'Pengerjaan'
                                                              : item.status === 'expired'
                                                                ? 'Kadaluarsa'
                                                                : 'Bidding'}
                                                </span>

                                                {/* Role Badge */}
                                                {item.is_creator ? (
                                                    <span className="rounded border border-purple-300 bg-purple-100 px-2 py-0.5 text-[9.5px] font-extrabold text-purple-900 uppercase dark:border-slate-800 dark:bg-[#030712]">
                                                        Klien
                                                    </span>
                                                ) : item.is_worker ? (
                                                    <span className="rounded border border-indigo-300 bg-indigo-100 px-2 py-0.5 text-[9.5px] font-extrabold text-indigo-900 uppercase dark:border-slate-800 dark:bg-[#030712]">
                                                        Pekerja
                                                    </span>
                                                ) : (
                                                    <span className="rounded border border-slate-300 bg-slate-200/80 px-2 py-0.5 text-[9.5px] font-extrabold text-slate-800 uppercase dark:border-slate-800 dark:bg-[#030712] dark:text-slate-400">
                                                        Pelamar
                                                    </span>
                                                )}
                                            </div>

                                            <h3 className="truncate text-sm font-extrabold text-slate-900 sm:text-base dark:text-slate-200">
                                                {item.title}
                                            </h3>

                                            <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-slate-700 dark:text-slate-400">
                                                <span className="font-semibold text-slate-700 dark:text-slate-300">
                                                    {item.is_creator
                                                        ? item.worker
                                                            ? `Kontraktor: ${item.worker.name}`
                                                            : 'Belum Ada Pekerja'
                                                        : `Klien: ${item.creator.name}`}
                                                </span>
                                                {item.bids_count !== undefined && item.status === 'open' && (
                                                    <div className="flex items-center gap-1 rounded border border-slate-300 bg-slate-100 px-2 py-0.5 text-[10px] font-bold text-slate-800 dark:border-slate-800 dark:bg-[#040812] dark:text-slate-300">
                                                        <Users
                                                            size={10}
                                                            className="text-indigo-600 dark:text-indigo-400"
                                                        />
                                                        {item.bids_count} Proposal
                                                    </div>
                                                )}
                                                {['ongoing', 'submitted'].includes(item.status) && (
                                                    <span className="flex items-center gap-1 rounded border border-amber-300 bg-amber-100/90 px-2 py-0.5 text-[10px] font-bold text-amber-900 dark:border-slate-800 dark:bg-amber-950/40 dark:text-amber-400">
                                                        <Clock
                                                            size={11}
                                                            className="text-amber-600 dark:text-amber-400"
                                                        />
                                                        {getDeadlineCountdown(item.deadline)}
                                                    </span>
                                                )}
                                            </div>
                                        </div>

                                        <div className="flex w-full shrink-0 items-center justify-between gap-4 border-t border-slate-200 pt-3 sm:w-auto sm:justify-end sm:border-0 sm:pt-0 dark:border-slate-800">
                                            <span
                                                className={`text-xs font-black sm:text-sm ${
                                                    item.is_worker
                                                        ? 'text-emerald-700 dark:text-emerald-450'
                                                        : item.is_creator
                                                          ? 'text-purple-700 dark:text-purple-400'
                                                          : 'text-indigo-700 dark:text-indigo-400'
                                                }`}
                                            >
                                                {item.is_creator
                                                    ? item.accepted_bid_amount
                                                        ? formatCurrency(item.accepted_bid_amount)
                                                        : `${formatCurrency(item.min_salary)} - ${formatCurrency(item.max_salary)}`
                                                    : item.my_bid
                                                      ? formatCurrency(item.my_bid.bid_amount)
                                                      : formatCurrency(item.min_salary)}
                                            </span>
                                            <div
                                                className={`flex h-8 w-8 items-center justify-center rounded-full border transition-all ${
                                                    isExpanded
                                                        ? 'border-indigo-300 bg-indigo-100 text-indigo-700 dark:border-slate-800 dark:bg-slate-950 dark:text-indigo-400'
                                                        : 'border-slate-300 bg-slate-100 text-slate-700 hover:bg-slate-200 dark:border-slate-800 dark:bg-[#030712] dark:text-slate-400'
                                                }`}
                                            >
                                                <ChevronDown
                                                    className={`h-4 w-4 transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`}
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Accordion Content */}
                                    <AnimatePresence initial={false}>
                                        {isExpanded && (
                                            <motion.div
                                                initial={{ height: 0, opacity: 0 }}
                                                animate={{ height: 'auto', opacity: 1 }}
                                                exit={{ height: 0, opacity: 0 }}
                                                transition={{ duration: 0.2 }}
                                                className="overflow-hidden"
                                            >
                                                <div className="grid grid-cols-1 gap-6 border-t border-slate-300 bg-slate-50/70 p-5 text-xs md:grid-cols-3 dark:border-slate-800 dark:bg-[#030712]/40">
                                                    {/* Column 1 & 2: Project Specifications & Stepper */}
                                                    <div className="space-y-4 md:col-span-2">
                                                        <div className="space-y-1.5">
                                                            <span className="block text-[9.5px] font-bold tracking-wider text-slate-700 uppercase dark:text-slate-300">
                                                                Deskripsi Penugasan
                                                            </span>
                                                            <p className="text-xs leading-relaxed whitespace-pre-wrap font-normal text-slate-800 dark:text-slate-300">
                                                                {item.description}
                                                            </p>
                                                        </div>

                                                        {/* Stepper Progress Horizontal Timeline */}
                                                        <div className="space-y-3 rounded-lg border border-slate-300 bg-white p-4 dark:border-slate-800 dark:bg-[#0d1117]">
                                                            <span className="block border-b border-slate-200 pb-2 text-[9.5px] font-bold tracking-wider text-slate-700 uppercase dark:border-slate-800 dark:text-slate-300">
                                                                Milestone Kontrak Kerja
                                                            </span>
                                                            <div className="scrollbar-none overflow-x-auto pb-1">
                                                                <div className="relative mx-auto grid w-full max-w-2xl min-w-[450px] grid-cols-6 gap-0 pt-2">
                                                                    {(() => {
                                                                        const historyStatuses = [
                                                                            'open',
                                                                            'ongoing',
                                                                            'submitted',
                                                                            'approved',
                                                                            'payment',
                                                                            'completed',
                                                                        ];
                                                                        const mappedStatus = item.status;
                                                                        const currentIdx = historyStatuses.indexOf(mappedStatus);
                                                                        const lineWidth = currentIdx >= 0
                                                                            ? `${(currentIdx / (historyStatuses.length - 1)) * 100}%`
                                                                            : '0%';

                                                                        return (
                                                                            <>
                                                                                <div className="absolute top-[20px] right-[8.33%] left-[8.33%] z-0 h-[2px] -translate-y-1/2">
                                                                                    <div className="absolute inset-0 rounded-full bg-slate-300 dark:bg-[#040812]" />
                                                                                    <div
                                                                                        className="absolute top-0 bottom-0 left-0 rounded-full bg-indigo-600 transition-all duration-500"
                                                                                        style={{ width: lineWidth }}
                                                                                    />
                                                                                </div>

                                                                                {[
                                                                                    { key: 'open', label: 'Bidding' },
                                                                                    { key: 'ongoing', label: 'Pengerjaan' },
                                                                                    { key: 'submitted', label: 'Tinjauan' },
                                                                                    { key: 'approved', label: 'Disetujui' },
                                                                                    { key: 'payment', label: 'Pembayaran' },
                                                                                    { key: 'completed', label: 'Selesai' },
                                                                                ].map((step, idx) => {
                                                                                    const stepIdx = historyStatuses.indexOf(step.key);
                                                                                    const isCompleted = currentIdx !== -1 && (stepIdx < currentIdx || item.status === 'completed');
                                                                                    const isActive = currentIdx !== -1 && mappedStatus === step.key;

                                                                                    return (
                                                                                        <div
                                                                                            key={step.key}
                                                                                            className="relative z-10 flex w-full min-w-0 flex-col items-center"
                                                                                        >
                                                                                            <div
                                                                                                className={`flex h-5 w-5 items-center justify-center rounded-full border text-[9px] font-bold transition-all duration-355 ${
                                                                                                    isCompleted
                                                                                                        ? 'border-indigo-600 bg-indigo-600 text-white shadow-sm'
                                                                                                        : isActive
                                                                                                          ? 'border-indigo-600 bg-indigo-100 text-indigo-800 font-extrabold dark:bg-[#040812] dark:text-indigo-400'
                                                                                                          : 'border-slate-300 bg-slate-100 text-slate-600 font-semibold dark:border-slate-800 dark:bg-[#0d1117] dark:text-slate-400'
                                                                                                }`}
                                                                                            >
                                                                                                {isCompleted ? (
                                                                                                    <Check className="h-2.5 w-2.5 stroke-[3.5]" />
                                                                                                ) : (
                                                                                                    idx + 1
                                                                                                )}
                                                                                            </div>
                                                                                            <span
                                                                                                className={`mt-2 w-full px-0.5 text-center text-[7.5px] font-bold tracking-wider break-words uppercase transition-all duration-355 sm:text-[9px] ${
                                                                                                    isActive
                                                                                                        ? 'text-indigo-700 font-extrabold dark:text-indigo-400'
                                                                                                        : isCompleted
                                                                                                          ? 'text-indigo-700 font-bold dark:text-indigo-400'
                                                                                                          : 'text-slate-600 dark:text-slate-400'
                                                                                                }`}
                                                                                            >
                                                                                                {step.label}
                                                                                            </span>
                                                                                        </div>
                                                                                    );
                                                                                })}
                                                                            </>
                                                                        );
                                                                    })()}
                                                                </div>
                                                            </div>
                                                        </div>

                                                        {/* Submission details */}
                                                        {(item.submission_link || item.submission_file || item.submission_note) && (
                                                            <div className="space-y-3 rounded-lg border border-slate-300 bg-white p-4 dark:border-slate-800 dark:bg-[#0d1117]">
                                                                <span className="block text-[9.5px] font-bold tracking-wider text-slate-700 uppercase dark:text-slate-300">
                                                                    Hasil Deliverables Dikirim
                                                                </span>

                                                                {item.submission_file && (
                                                                    <div className="flex items-center justify-between rounded-lg border border-amber-300 bg-amber-50 p-2.5 dark:border-slate-800 dark:bg-[#030712]/40">
                                                                        <div className="flex min-w-0 items-center gap-2.5">
                                                                            <FileArchive className="h-5 w-5 shrink-0 text-amber-600" />
                                                                            <div className="min-w-0">
                                                                                <p className="truncate text-xs font-bold text-slate-900 dark:text-slate-200">
                                                                                    {item.submission_file.name}
                                                                                </p>
                                                                                <p className="text-[10px] font-semibold text-slate-500">
                                                                                    {formatBytes(item.submission_file.size)}
                                                                                </p>
                                                                            </div>
                                                                        </div>
                                                                        <a
                                                                            href={item.submission_file.url}
                                                                            target="_blank"
                                                                            rel="noopener noreferrer"
                                                                            className="flex cursor-pointer items-center justify-center rounded-lg p-1.5 text-amber-700 hover:bg-amber-100"
                                                                            title="Unduh ZIP Pekerjaan"
                                                                        >
                                                                            <Download className="h-4 w-4" />
                                                                        </a>
                                                                    </div>
                                                                )}

                                                                {item.submission_link && (
                                                                    <div className="space-y-0.5">
                                                                        <span className="block text-[8.5px] font-bold text-slate-600 uppercase">
                                                                            Tautan Demo / Hasil Kerja
                                                                        </span>
                                                                        <a
                                                                            href={item.submission_link}
                                                                            target="_blank"
                                                                            rel="noopener noreferrer"
                                                                            className="inline-flex items-center gap-1 text-xs font-bold text-indigo-700 hover:underline dark:text-indigo-400"
                                                                        >
                                                                            {item.submission_link}
                                                                            <ExternalLink size={10} />
                                                                        </a>
                                                                    </div>
                                                                )}

                                                                {item.submission_note && (
                                                                    <div className="space-y-0.5">
                                                                        <span className="block text-[8.5px] font-bold text-slate-600 uppercase">
                                                                            Catatan Tambahan
                                                                        </span>
                                                                        <p className="rounded border border-slate-300 bg-slate-50 p-2.5 text-xs leading-relaxed font-normal text-slate-800 dark:border-slate-800 dark:bg-[#030712] dark:text-slate-300">
                                                                            {item.submission_note}
                                                                        </p>
                                                                    </div>
                                                                )}
                                                            </div>
                                                        )}

                                                        {/* Current status comment description */}
                                                        <div className="space-y-1 rounded-lg border border-slate-300 bg-white p-4 dark:border-slate-800 dark:bg-[#0d1117]">
                                                            <span className="block text-[9.5px] font-bold tracking-wider text-slate-700 uppercase dark:text-slate-300">
                                                                Detail Kontrak Proyek
                                                            </span>
                                                            <p className="text-xs leading-relaxed font-medium text-slate-700 dark:text-slate-450">
                                                                {item.status === 'open'
                                                                    ? item.is_creator
                                                                        ? `Pendaftaran proyek ini dibuka. Proposal pelamar masuk sebanyak ${item.bids_count || 0}. Anda dapat meninjau di detail lowongan.`
                                                                        : item.my_bid
                                                                          ? `Proposal penawaran Anda senilai ${formatCurrency(item.my_bid.bid_amount)} telah terkirim. Menunggu tinjauan dari pemilik proyek.`
                                                                          : 'Pendaftaran terbuka untuk semua kandidat pelamar.'
                                                                    : item.status === 'ongoing'
                                                                      ? item.is_worker
                                                                          ? 'Anda sedang mengerjakan proyek ini. Pastikan Anda menyelesaikan deliverables sebelum batas tenggat waktu.'
                                                                          : item.is_creator
                                                                            ? `Proyek sedang dikerjakan oleh kontraktor ${item.worker?.name || ''}. Tunggu draf submission mereka.`
                                                                            : 'Proyek sedang dalam masa pengerjaan aktif oleh pekerja terpilih.'
                                                                      : item.status === 'submitted'
                                                                        ? item.is_creator
                                                                            ? 'Pekerja telah mengirimkan draf. Tinjau kelayakan hasil kerja atau minta revisi pada workspace pengerjaan.'
                                                                            : item.is_worker
                                                                              ? 'Draf pengerjaan Anda telah dikirim dan sedang dalam proses review peninjauan klien.'
                                                                              : 'Hasil pekerjaan dikirim dan sedang ditinjau.'
                                                                        : ['approved', 'payment'].includes(item.status)
                                                                          ? item.is_creator
                                                                              ? 'Draf disetujui! Silakan lakukan transfer dana pembayaran, lalu unggah bukti transfer di workspace detail.'
                                                                              : item.is_worker
                                                                                ? 'Pekerjaan Anda disetujui! Lakukan verifikasi pembayaran offline dari klien. Unggah berkas ZIP final jika dana telah masuk.'
                                                                                : 'Disetujui, dalam proses rilis dana pembayaran.'
                                                                          : item.status === 'expired'
                                                                            ? item.is_creator
                                                                                ? 'Kontrak dibatalkan otomatis karena melewati deadline.'
                                                                                : 'Kontrak dibatalkan otomatis.'
                                                                            : 'Kontrak proyek selesai secara resmi. Seluruh dana diserahkan dan nilai reputasi kerja didistribusikan.'}
                                                            </p>
                                                        </div>
                                                    </div>

                                                    {/* Column 3: Metrics, Escrow, Quick Actions */}
                                                    <div className="space-y-4 border-t border-dashed border-slate-300 pt-4 md:border-t-0 md:border-l md:pt-0 md:pl-5 dark:border-slate-800">
                                                        {/* Project value metrics */}
                                                        <div className="space-y-2">
                                                            <span className="block text-[9.5px] font-bold tracking-wider text-slate-700 uppercase dark:text-slate-300">
                                                                Nilai Reputasi & Kontribusi
                                                            </span>
                                                            <div className="flex flex-wrap gap-2">
                                                                {item.rewards?.gold && (
                                                                    <div className="flex items-center gap-1.5 rounded-lg border border-amber-300 bg-amber-100/80 px-2.5 py-1 text-xs font-extrabold text-amber-900 dark:border-slate-800 dark:bg-[#030712] dark:text-amber-400">
                                                                        + {item.rewards.gold} Gold
                                                                    </div>
                                                                )}
                                                                {item.rewards?.exp && (
                                                                    <div className="flex items-center gap-1.5 rounded-lg border border-purple-300 bg-purple-100/80 px-2.5 py-1 text-xs font-extrabold text-purple-900 dark:border-slate-800 dark:bg-[#030712] dark:text-purple-400">
                                                                        + {item.rewards.exp} XP
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </div>

                                                        {/* Contract Info */}
                                                        <div className="space-y-2">
                                                            <span className="block text-[9.5px] font-bold tracking-wider text-slate-700 uppercase dark:text-slate-300">
                                                                Ringkasan Finansial
                                                            </span>
                                                            <div className="space-y-2.5 rounded-lg border border-slate-300 bg-white p-3.5 text-[11px] dark:border-slate-800 dark:bg-[#030712]">
                                                                <div className="flex items-center justify-between">
                                                                    <span className="text-[9.5px] font-bold text-slate-600 uppercase dark:text-slate-400">
                                                                        Nilai Kontrak
                                                                    </span>
                                                                    <span className="font-extrabold text-slate-900 dark:text-white">
                                                                        {item.is_creator
                                                                            ? item.accepted_bid_amount
                                                                                ? formatCurrency(item.accepted_bid_amount)
                                                                                : `${formatCurrency(item.min_salary)} - ${formatCurrency(item.max_salary)}`
                                                                            : item.my_bid
                                                                              ? formatCurrency(item.my_bid.bid_amount)
                                                                              : formatCurrency(item.min_salary)}
                                                                    </span>
                                                                </div>
                                                                <div className="flex items-center justify-between border-t border-slate-200 pt-2 dark:border-slate-800">
                                                                    <span className="text-[9.5px] font-bold text-slate-600 uppercase dark:text-slate-400">
                                                                        Status Pembayaran
                                                                    </span>
                                                                    <span
                                                                        className={`rounded border px-2 py-0.5 text-[10px] font-bold ${
                                                                            item.status === 'completed'
                                                                                ? 'border-emerald-300 bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-400'
                                                                                : 'border-amber-300 bg-amber-100 text-amber-900 dark:bg-amber-950 dark:text-amber-400'
                                                                        }`}
                                                                    >
                                                                        {item.status === 'completed'
                                                                            ? 'Tuntas / Cair'
                                                                            : 'Ditahan (Escrow)'}
                                                                    </span>
                                                                </div>
                                                            </div>
                                                        </div>

                                                        {/* Review Feedback */}
                                                        {item.status === 'completed' && item.rating && (
                                                            <div className="space-y-2 rounded-lg border border-indigo-200 bg-indigo-50/50 p-3.5 text-center dark:border-slate-800 dark:bg-[#0d1117]">
                                                                <span className="block text-[8.5px] font-bold tracking-widest text-slate-700 uppercase dark:text-slate-400">
                                                                    Ulasan Klien
                                                                </span>
                                                                <div className="flex justify-center gap-1">
                                                                    {[1, 2, 3, 4, 5].map((starVal) => (
                                                                        <Star
                                                                            key={starVal}
                                                                            className={`h-3.5 w-3.5 ${
                                                                                starVal <= (item.rating ?? 0)
                                                                                    ? 'fill-amber-400 text-amber-400'
                                                                                    : 'text-slate-300 dark:text-slate-800'
                                                                            }`}
                                                                        />
                                                                    ))}
                                                                </div>
                                                                {item.rating_comment && (
                                                                    <p className="mt-1 text-[11px] leading-relaxed font-semibold text-slate-700 italic dark:text-slate-350">
                                                                        "{item.rating_comment}"
                                                                    </p>
                                                                )}
                                                            </div>
                                                        )}

                                                        {/* Action Buttons */}
                                                        <div className="space-y-2 border-t border-slate-200 pt-3 dark:border-slate-800">
                                                            <span className="block text-[9.5px] font-bold tracking-wider text-slate-700 uppercase dark:text-slate-300">
                                                                Aksi Cepat
                                                            </span>
                                                            <div className="flex gap-2">
                                                                <Link
                                                                    href={`/student/quests/${item._id}`}
                                                                    className="flex flex-1 items-center justify-center gap-1.5 rounded-lg border border-indigo-700/30 bg-indigo-600 py-2.5 text-xs font-bold text-white shadow-sm transition-all hover:bg-indigo-700"
                                                                >
                                                                    <MessageSquare size={13} />
                                                                    Chat
                                                                </Link>
                                                                <Link
                                                                    href={`/student/quests/${item._id}`}
                                                                    className="flex flex-1 items-center justify-center gap-1.5 rounded-lg border border-slate-300 bg-white py-2.5 text-xs font-bold text-slate-800 shadow-sm transition-all hover:bg-slate-100 hover:text-slate-900 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
                                                                >
                                                                    <Eye size={13} />
                                                                    Detail
                                                                </Link>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>
                            );
                        })}
                    </div>
                )}

                {/* Server-Side Pagination Links */}
                {quests.last_page > 1 && (
                    <div className="mt-8 flex flex-col items-center justify-between gap-4 border-t border-slate-205 pt-6 sm:flex-row dark:border-slate-800">
                        <span className="text-xs text-slate-505 dark:text-slate-400">
                            Menampilkan <span className="font-semibold text-slate-850 dark:text-white">{quests.from}</span> – <span className="font-semibold text-slate-850 dark:text-white">{quests.to}</span> dari <span className="font-semibold text-slate-850 dark:text-white">{quests.total}</span> data proyek
                        </span>

                        <div className="flex items-center gap-1">
                            {quests.links.map((link, i) => {
                                const labelLower = link.label.toLowerCase();
                                const isPrev =
                                    labelLower.includes('previous') ||
                                    labelLower.includes('&laquo;') ||
                                    labelLower.includes('laquo') ||
                                    labelLower.includes('pagination.previous');
                                const isNext =
                                    labelLower.includes('next') ||
                                    labelLower.includes('&raquo;') ||
                                    labelLower.includes('raquo') ||
                                    labelLower.includes('pagination.next');

                                const renderLabel = () => {
                                    if (isPrev)
                                        return (
                                            <ChevronLeft
                                                size={14}
                                                className="shrink-0"
                                            />
                                        );
                                    if (isNext)
                                        return (
                                            <ChevronRight
                                                size={14}
                                                className="shrink-0"
                                            />
                                        );
                                    return link.url ? link.label : null;
                                };

                                const labelText = renderLabel();
                                if (!labelText) return null;

                                return link.url ? (
                                    <Link
                                        key={i}
                                        href={link.url}
                                        preserveScroll
                                        className={`flex h-7 min-w-7 items-center justify-center rounded-lg px-2 text-xs font-semibold transition-colors ${
                                            link.active
                                                ? 'border border-indigo-200 bg-indigo-50 text-indigo-707 dark:border-slate-800 dark:bg-[#0d1117] dark:text-indigo-400'
                                                : 'border border-slate-200 text-slate-600 hover:border-slate-350 hover:text-slate-805 dark:border-slate-800 dark:bg-[#030712] dark:text-slate-400 dark:hover:border-slate-700 dark:hover:text-slate-200'
                                        }`}
                                    >
                                        {labelText}
                                    </Link>
                                ) : (
                                    <span
                                        key={i}
                                        className="flex h-7 min-w-7 cursor-not-allowed items-center justify-center rounded-lg border border-slate-200 px-2 text-xs font-semibold text-slate-400 opacity-50 dark:border-slate-800 dark:text-slate-650"
                                    >
                                        {labelText}
                                    </span>
                                );
                            })}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
