import { Link, router, Head } from '@inertiajs/react';
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    ArrowLeft,
    DollarSign,
    Calendar,
    Users,
    Award,
    Star,
    Search,
    ChevronLeft,
    ChevronRight,
    ChevronUp,
    ChevronDown,
    CheckCircle2,
    Lock,
    MessageSquare,
    ExternalLink,
    Download,
    FileArchive,
    Clock,
    Eye,
    Check,
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
        return `${datePart} pukul ${timePart}`;
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

    // Rank calculator based on salary (matching QuestItemCard)
    const getQuestRank = (maxSalary: number) => {
        if (maxSalary >= 10000000) {
            return {
                rank: 'Mythic',
                color: 'border-purple-500/20 bg-purple-500/10 text-purple-700 dark:text-purple-400',
            };
        }
        if (maxSalary >= 5000000) {
            return {
                rank: 'Diamond',
                color: 'border-cyan-500/20 bg-cyan-500/10 text-cyan-700 dark:text-cyan-400',
            };
        }
        if (maxSalary >= 2500000) {
            return {
                rank: 'Gold',
                color: 'border-yellow-500/20 bg-yellow-500/10 text-yellow-700 dark:text-yellow-400',
            };
        }
        if (maxSalary >= 1000000) {
            return {
                rank: 'Silver',
                color: 'border-slate-500/20 bg-slate-500/10 text-slate-700 dark:text-slate-400',
            };
        }
        return {
            rank: 'Bronze',
            color: 'border-orange-500/20 bg-orange-500/10 text-orange-700 dark:text-orange-400',
        };
    };

    const getAccentBorderClass = (status: string) => {
        switch (status) {
            case 'completed':
                return 'border-l-4 border-l-emerald-500 dark:border-l-emerald-500';
            case 'ongoing':
                return 'border-l-4 border-l-blue-500 dark:border-l-blue-500';
            case 'open':
                return 'border-l-4 border-l-amber-500 dark:border-l-amber-500';
            case 'expired':
                return 'border-l-4 border-l-rose-500 dark:border-l-rose-500';
            case 'submitted':
                return 'border-l-4 border-l-purple-500 dark:border-l-purple-500';
            case 'approved':
            case 'payment':
                return 'border-l-4 border-l-cyan-500 dark:border-l-cyan-500';
            default:
                return 'border-l-4 border-l-slate-400 dark:border-l-slate-600';
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
            return `${days} hari ${hours} jam`;
        }
        return `${hours} jam`;
    };

    return (
        <div
            className="relative flex min-h-screen flex-col overflow-x-hidden bg-slate-50 text-slate-800 transition-colors duration-200 dark:bg-[#060813] dark:text-white"
            style={{ fontFamily: "'Outfit', sans-serif" }}
        >
            <div className="pointer-events-none absolute top-0 left-1/2 z-0 h-[450px] w-full max-w-7xl -translate-x-1/2 rounded-full bg-indigo-500/5 blur-[120px] select-none" />

            <div className="relative z-10 mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
                {/* Back Link & Title */}
                <div className="mb-8 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <Link
                            href="/student/quests"
                            className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 transition-all hover:bg-slate-100 hover:text-slate-900 dark:border-slate-800 dark:bg-[#0c122c]/40 dark:text-slate-400 dark:hover:border-indigo-500/30 dark:hover:text-white"
                        >
                            <ArrowLeft size={16} />
                        </Link>
                        <div>
                            <h1 className="font-['Orbitron'] text-xl font-black tracking-wider text-slate-900 uppercase dark:text-white">
                                Quest Log History
                            </h1>
                            <p className="text-xs text-slate-500 dark:text-slate-400">
                                Catatan petualangan dan penyelesaian quest Anda
                            </p>
                        </div>
                    </div>
                </div>

                {/* RPG Stats Card Banner */}
                <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
                    {/* Quests Completed */}
                    <div className="relative overflow-hidden rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-6 backdrop-blur-md dark:border-emerald-500/10 dark:bg-emerald-950/15">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="font-['Orbitron'] text-[10px] font-extrabold tracking-wider text-emerald-600 uppercase dark:text-emerald-400">
                                    Quest Selesai
                                </p>
                                <p className="mt-2 font-['Orbitron'] text-3xl font-black text-slate-900 dark:text-white">
                                    {stats.completed_quests_count}
                                </p>
                            </div>
                            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400">
                                <CheckCircle2 size={24} />
                            </div>
                        </div>
                        <div className="absolute -right-4 -bottom-4 h-16 w-16 rotate-12 text-emerald-500/5 dark:text-emerald-500/10">
                            <CheckCircle2 size={64} />
                        </div>
                    </div>

                    {/* Total Bid (Pekerja) */}
                    <div className="relative overflow-hidden rounded-2xl border border-indigo-500/20 bg-indigo-500/5 p-6 backdrop-blur-md dark:border-indigo-500/10 dark:bg-indigo-950/15">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="font-['Orbitron'] text-[10px] font-extrabold tracking-wider text-indigo-600 uppercase dark:text-indigo-400">
                                    Total Bid (Pekerja)
                                </p>
                                <p className="mt-2 font-['Orbitron'] text-2xl font-black text-slate-900 dark:text-white">
                                    {formatCurrency(stats.total_bids_placed)}
                                </p>
                            </div>
                            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-500/10 text-indigo-600 dark:bg-indigo-500/20 dark:text-indigo-400">
                                <DollarSign size={24} />
                            </div>
                        </div>
                        <div className="absolute -right-4 -bottom-4 h-16 w-16 rotate-12 text-indigo-500/5 dark:text-indigo-500/10">
                            <DollarSign size={64} />
                        </div>
                    </div>

                    {/* Total Bid (Pembuat Quest) */}
                    <div className="relative overflow-hidden rounded-2xl border border-amber-500/20 bg-amber-500/5 p-6 backdrop-blur-md dark:border-amber-500/10 dark:bg-amber-950/15">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="font-['Orbitron'] text-[10px] font-extrabold tracking-wider text-amber-600 uppercase dark:text-amber-400">
                                    Total Bid (Pembuat Quest)
                                </p>
                                <p className="mt-2 font-['Orbitron'] text-2xl font-black text-slate-900 dark:text-white">
                                    {formatCurrency(stats.total_bids_received)}
                                </p>
                            </div>
                            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-500/10 text-amber-600 dark:bg-amber-500/20 dark:text-amber-400">
                                <DollarSign size={24} />
                            </div>
                        </div>
                        <div className="absolute -right-4 -bottom-4 h-16 w-16 rotate-12 text-amber-500/5 dark:text-amber-500/10">
                            <DollarSign size={64} />
                        </div>
                    </div>
                </div>

                {/* Filter and Search Bar */}
                <div className="mb-6 flex flex-col gap-4 rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm xl:flex-row xl:items-center xl:justify-between dark:border-slate-800 dark:bg-[#0d1117]">
                    {/* Search */}
                    <div className="relative w-full xl:max-w-md">
                        <input
                            type="text"
                            placeholder="Cari judul quest..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pr-4 pl-10 text-xs focus:border-indigo-500 focus:outline-none dark:border-slate-800 dark:bg-slate-900"
                        />
                        <Search className="absolute top-3 left-3.5 h-4 w-4 text-slate-400" />
                    </div>

                    <div className="flex flex-1 flex-col gap-4 sm:flex-row sm:items-center sm:justify-between xl:justify-end">
                        {/* Role Filter Pills */}
                        <div className="flex w-full scrollbar-none gap-1.5 overflow-x-auto sm:w-auto">
                            {[
                                { key: 'all', label: 'Semua Peran' },
                                { key: 'worker', label: 'Pekerja' },
                                { key: 'creator', label: 'Pembuat' },
                                { key: 'bidder', label: 'Pelamar' },
                            ].map((roleOption) => (
                                <button
                                    key={roleOption.key}
                                    onClick={() =>
                                        setRoleFilter(roleOption.key)
                                    }
                                    className={`rounded-xl px-4 py-2 font-['Orbitron'] text-xs font-semibold tracking-wider whitespace-nowrap uppercase transition-all ${
                                        roleFilter === roleOption.key
                                            ? 'bg-indigo-600 text-white shadow-sm hover:bg-indigo-700'
                                            : 'bg-slate-50 text-slate-600 hover:bg-slate-100 dark:bg-slate-900/60 dark:text-slate-400 dark:hover:bg-slate-900 dark:hover:text-white'
                                    }`}
                                >
                                    {roleOption.label}
                                </button>
                            ))}
                        </div>

                        {/* Status Dropdown */}
                        <div className="w-full shrink-0 sm:w-44">
                            <select
                                value={statusFilter}
                                onChange={(e) =>
                                    setStatusFilter(e.target.value)
                                }
                                className="w-full cursor-pointer rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-xs font-semibold text-slate-600 uppercase focus:border-indigo-500 focus:outline-none dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300"
                            >
                                <option value="all">Semua Status</option>
                                <option value="open">Bidding</option>
                                <option value="ongoing">Berjalan</option>
                                <option value="submitted">Tinjauan</option>
                                <option value="approved">Disetujui</option>
                                <option value="payment">Pembayaran</option>
                                <option value="completed">Selesai</option>
                                <option value="rejected">Ditolak</option>
                                <option value="expired">Kadaluarsa</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* Main Content - Quest Cards Grid (Identical to Quest Index) */}
                {quests.data.length === 0 ? (
                    <div className="rounded-2xl border border-dashed border-slate-200 py-24 text-center dark:border-slate-800">
                        <Users className="mx-auto mb-4 h-14 w-14 animate-pulse text-indigo-500/20" />
                        <p className="dark:text-slate-350 text-base font-bold text-slate-700">
                            Tidak ada quest dalam riwayat
                        </p>
                        <p className="mt-1.5 text-xs text-slate-400 dark:text-slate-400">
                            Coba ubah pencarian atau filter peran/status Anda
                        </p>
                    </div>
                ) : (
                    <div className="mx-auto flex w-full flex-col gap-4 pb-12">
                        {quests.data.map((item) => {
                            const isExpanded = expandedQuestId === item._id;

                            return (
                                <div
                                    key={item._id}
                                    className={`rounded-2xl border bg-white/70 backdrop-blur-md transition-all duration-305 dark:bg-[#0c122c]/40 ${getAccentBorderClass(item.status)} ${
                                        isExpanded
                                            ? 'border-indigo-500/50 shadow-[0_0_15px_rgba(99,102,241,0.12)]'
                                            : 'border-slate-200 hover:border-slate-300 dark:border-slate-800/80 dark:hover:border-slate-700'
                                    }`}
                                >
                                    {/* Accordion Trigger/Header */}
                                    <div
                                        onClick={() =>
                                            setExpandedQuestId(
                                                isExpanded ? null : item._id,
                                            )
                                        }
                                        className="flex cursor-pointer flex-col justify-between gap-4 p-5 select-none sm:flex-row sm:items-center"
                                    >
                                        <div className="min-w-0 flex-1 space-y-2">
                                            <div className="flex flex-wrap items-center gap-2">
                                                {/* Status Badge */}
                                                <span
                                                    className={`rounded px-2.5 py-0.5 font-['Orbitron'] text-[9px] font-black tracking-wider uppercase ${
                                                        item.status ===
                                                        'completed'
                                                            ? 'border border-emerald-500/20 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                                                            : item.status ===
                                                                    'approved' ||
                                                                item.status ===
                                                                    'payment'
                                                              ? 'border border-cyan-500/20 bg-cyan-500/10 text-cyan-600 dark:text-cyan-400'
                                                              : item.status ===
                                                                  'submitted'
                                                                ? 'border border-purple-500/20 bg-purple-500/10 text-purple-600 dark:text-purple-400'
                                                                : item.status ===
                                                                    'ongoing'
                                                                  ? 'border border-blue-500/20 bg-blue-500/10 text-blue-600 dark:text-blue-400'
                                                                  : item.status ===
                                                                      'expired'
                                                                    ? 'border border-red-500/20 bg-red-500/10 text-red-600 dark:text-red-400'
                                                                    : 'border border-slate-500/20 bg-slate-500/10 text-slate-600 dark:text-slate-400'
                                                    }`}
                                                >
                                                    {item.status === 'completed'
                                                        ? 'Selesai'
                                                        : item.status ===
                                                                'approved' ||
                                                            item.status ===
                                                                'payment'
                                                          ? 'Pembayaran'
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

                                                {/* Role Badge */}
                                                {item.is_creator ? (
                                                    <span className="rounded border border-purple-500/20 bg-purple-500/10 px-2 py-0.5 font-['Orbitron'] text-[9px] font-bold tracking-wider text-purple-600 uppercase dark:text-purple-400">
                                                        Pembuat
                                                    </span>
                                                ) : item.is_worker ? (
                                                    <span className="rounded border border-indigo-500/20 bg-indigo-500/10 px-2 py-0.5 font-['Orbitron'] text-[9px] font-bold tracking-wider text-indigo-600 uppercase dark:text-indigo-400">
                                                        Pekerja
                                                    </span>
                                                ) : (
                                                    <span className="rounded border border-slate-200 bg-slate-500/10 px-2 py-0.5 font-['Orbitron'] text-[9px] font-bold tracking-wider text-slate-500 uppercase dark:border-slate-700 dark:text-slate-400">
                                                        Pelamar
                                                    </span>
                                                )}
                                            </div>

                                            <h3 className="truncate font-['Oxanium'] text-sm font-extrabold text-slate-800 sm:text-base dark:text-slate-200">
                                                {item.title}
                                            </h3>

                                            <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-slate-500 dark:text-slate-400">
                                                <span>
                                                    {item.is_creator
                                                        ? item.worker
                                                            ? `Pekerja: ${item.worker.name}`
                                                            : 'Belum Ada Pekerja'
                                                        : `Pembuat: ${item.creator.name}`}
                                                </span>
                                                {item.bids_count !==
                                                    undefined &&
                                                    item.status === 'open' && (
                                                        <div className="flex items-center gap-1 rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-semibold text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                                                            <Users
                                                                size={10}
                                                                className="text-indigo-500 dark:text-indigo-400"
                                                            />
                                                            {item.bids_count}{' '}
                                                            Bid
                                                        </div>
                                                    )}
                                                {[
                                                    'ongoing',
                                                    'submitted',
                                                ].includes(item.status) && (
                                                    <span className="flex items-center gap-1 text-[10px] font-semibold text-amber-600 dark:text-amber-400">
                                                        <Clock
                                                            size={11}
                                                            className="animate-pulse text-amber-500"
                                                        />
                                                        {getDeadlineCountdown(
                                                            item.deadline,
                                                        )}
                                                    </span>
                                                )}
                                            </div>
                                        </div>

                                        <div className="flex w-full shrink-0 items-center justify-between gap-4 border-t border-slate-100 pt-3 sm:w-auto sm:justify-end sm:border-0 sm:pt-0 dark:border-slate-800">
                                            <span
                                                className={`font-['Orbitron'] text-xs font-black ${
                                                    item.is_worker
                                                        ? 'text-emerald-600 dark:text-emerald-400'
                                                        : item.is_creator
                                                          ? 'text-purple-600 dark:text-purple-400'
                                                          : 'text-indigo-600 dark:text-indigo-400'
                                                }`}
                                            >
                                                {item.is_creator
                                                    ? item.accepted_bid_amount
                                                        ? formatCurrency(
                                                              item.accepted_bid_amount,
                                                          )
                                                        : `${formatCurrency(item.min_salary)} - ${formatCurrency(item.max_salary)}`
                                                    : item.my_bid
                                                      ? formatCurrency(
                                                            item.my_bid
                                                                .bid_amount,
                                                        )
                                                      : formatCurrency(
                                                            item.min_salary,
                                                        )}
                                            </span>
                                            <div
                                                className={`flex h-8 w-8 items-center justify-center rounded-full transition-colors ${isExpanded ? 'bg-indigo-100 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400' : 'bg-slate-100 text-slate-400 dark:bg-slate-800 dark:text-slate-500'}`}
                                            >
                                                <motion.div
                                                    animate={{
                                                        rotate: isExpanded
                                                            ? 180
                                                            : 0,
                                                    }}
                                                    transition={{
                                                        duration: 0.3,
                                                        ease: 'easeInOut',
                                                    }}
                                                >
                                                    <ChevronDown className="h-4 w-4" />
                                                </motion.div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Accordion Content */}
                                    <AnimatePresence initial={false}>
                                        {isExpanded && (
                                            <motion.div
                                                initial={{
                                                    height: 0,
                                                    opacity: 0,
                                                }}
                                                animate={{
                                                    height: 'auto',
                                                    opacity: 1,
                                                }}
                                                exit={{ height: 0, opacity: 0 }}
                                                transition={{
                                                    duration: 0.3,
                                                    ease: 'easeInOut',
                                                }}
                                                className="overflow-hidden"
                                            >
                                                <div className="grid grid-cols-1 gap-6 border-t border-slate-200 bg-white/40 p-5 font-['Oxanium'] text-xs md:grid-cols-3 dark:border-slate-800/80 dark:bg-black/10">
                                                    {/* Kolom 1 & 2: Informasi Quest & Stepper Progress */}
                                                    <div className="space-y-4 md:col-span-2">
                                                        {/* Deskripsi */}
                                                        <div className="space-y-1.5">
                                                            <span className="block text-[9px] font-bold tracking-wider text-slate-400 uppercase dark:text-slate-500">
                                                                Deskripsi Quest
                                                            </span>
                                                            <p className="dark:text-slate-350 text-xs leading-relaxed whitespace-pre-wrap text-slate-700">
                                                                {
                                                                    item.description
                                                                }
                                                            </p>
                                                        </div>

                                                        {/* Stepper Progress Horizontal Timeline */}
                                                        <div className="space-y-3 rounded-xl border border-slate-200 bg-white p-4 font-['Orbitron'] text-[9px] font-bold tracking-wider dark:border-slate-800/80 dark:bg-black/20">
                                                            <span className="block border-b border-slate-100 pb-2 text-[9px] font-bold tracking-wider text-slate-500 uppercase dark:border-slate-800">
                                                                Progress Alur
                                                                Quest
                                                            </span>
                                                            <div className="scrollbar-none overflow-x-auto pb-1">
                                                                <div className="relative mx-auto grid w-full max-w-2xl min-w-[450px] grid-cols-6 gap-0 pt-2">
                                                                    {(() => {
                                                                        const historyStatuses =
                                                                            [
                                                                                'open',
                                                                                'ongoing',
                                                                                'submitted',
                                                                                'approved',
                                                                                'payment',
                                                                                'completed',
                                                                            ];
                                                                        const mappedStatus =
                                                                            item.status;
                                                                        const currentIdx =
                                                                            historyStatuses.indexOf(
                                                                                mappedStatus,
                                                                            );
                                                                        const lineWidth =
                                                                            currentIdx >=
                                                                            0
                                                                                ? `${(currentIdx / (historyStatuses.length - 1)) * 100}%`
                                                                                : '0%';

                                                                        return (
                                                                            <>
                                                                                {/* Stepper Line Container (bounded perfectly between first and last node centers in a 6-col grid layout) */}
                                                                                <div className="absolute top-[20px] right-[8.33%] left-[8.33%] z-0 h-[3px] -translate-y-1/2">
                                                                                    {/* Background Line */}
                                                                                    <div className="absolute inset-0 rounded-full bg-slate-200 dark:bg-slate-800/80" />
                                                                                    {/* Active Line */}
                                                                                    <div
                                                                                        className="absolute top-0 bottom-0 left-0 rounded-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 transition-all duration-700 ease-out"
                                                                                        style={{
                                                                                            width: lineWidth,
                                                                                        }}
                                                                                    />
                                                                                </div>

                                                                                {[
                                                                                    {
                                                                                        key: 'open',
                                                                                        label: 'Bidding',
                                                                                    },
                                                                                    {
                                                                                        key: 'ongoing',
                                                                                        label: 'Pengerjaan',
                                                                                    },
                                                                                    {
                                                                                        key: 'submitted',
                                                                                        label: 'Tinjauan',
                                                                                    },
                                                                                    {
                                                                                        key: 'approved',
                                                                                        label: 'Disetujui',
                                                                                    },
                                                                                    {
                                                                                        key: 'payment',
                                                                                        label: 'Pembayaran',
                                                                                    },
                                                                                    {
                                                                                        key: 'completed',
                                                                                        label: 'Selesai',
                                                                                    },
                                                                                ].map(
                                                                                    (
                                                                                        step,
                                                                                        idx,
                                                                                    ) => {
                                                                                        const stepIdx =
                                                                                            historyStatuses.indexOf(
                                                                                                step.key,
                                                                                            );
                                                                                        const isCompleted =
                                                                                            currentIdx !==
                                                                                                -1 &&
                                                                                            (stepIdx <
                                                                                                currentIdx ||
                                                                                                item.status ===
                                                                                                    'completed');
                                                                                        const isActive =
                                                                                            currentIdx !==
                                                                                                -1 &&
                                                                                            mappedStatus ===
                                                                                                step.key;

                                                                                        return (
                                                                                            <div
                                                                                                key={
                                                                                                    step.key
                                                                                                }
                                                                                                className="relative z-10 flex w-full min-w-0 flex-col items-center"
                                                                                            >
                                                                                                <div
                                                                                                    className={`flex h-6 w-6 items-center justify-center rounded-full border text-[9px] transition-all duration-300 ${
                                                                                                        isCompleted
                                                                                                            ? 'border-indigo-500 bg-indigo-600 text-white shadow-sm'
                                                                                                            : isActive
                                                                                                              ? 'border-purple-500 bg-purple-600 text-white shadow-sm'
                                                                                                              : 'border-slate-200 bg-slate-50 text-slate-500 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-400'
                                                                                                    }`}
                                                                                                >
                                                                                                    {isCompleted ? (
                                                                                                        <Check className="h-3 w-3 stroke-[3.5]" />
                                                                                                    ) : (
                                                                                                        idx +
                                                                                                        1
                                                                                                    )}
                                                                                                </div>
                                                                                                <span
                                                                                                    className={`mt-2 w-full px-0.5 text-center text-[7.5px] leading-tight font-black tracking-widest break-words uppercase transition-all duration-300 sm:text-[9px] ${
                                                                                                        isActive
                                                                                                            ? 'text-purple-600 dark:text-purple-400'
                                                                                                            : isCompleted
                                                                                                              ? 'text-indigo-600 dark:text-indigo-400'
                                                                                                              : 'text-slate-500 dark:text-slate-400'
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
                                                                            </>
                                                                        );
                                                                    })()}
                                                                </div>
                                                            </div>
                                                        </div>

                                                        {/* Informasi Pengiriman Pekerjaan (Tinjau/Selesai) */}
                                                        {(item.submission_link ||
                                                            item.submission_file ||
                                                            item.submission_note) && (
                                                            <div className="dark:border-slate-850 space-y-3 rounded-xl border border-slate-200/60 bg-white/60 p-4 dark:bg-[#0c122c]/10">
                                                                <span className="block text-[9px] font-bold tracking-wider text-slate-400 uppercase dark:text-slate-500">
                                                                    Hasil
                                                                    Pengiriman
                                                                    Pekerjaan
                                                                </span>

                                                                {item.submission_file && (
                                                                    <div className="flex items-center justify-between rounded-xl border border-amber-200/40 bg-amber-500/5 p-2.5 dark:border-amber-500/20 dark:bg-amber-950/10">
                                                                        <div className="flex min-w-0 items-center gap-2.5">
                                                                            <FileArchive className="h-5 w-5 shrink-0 text-amber-500" />
                                                                            <div className="min-w-0">
                                                                                <p className="text-slate-750 truncate text-xs font-semibold dark:text-slate-200">
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
                                                                            className="flex cursor-pointer items-center justify-center rounded-lg p-1.5 text-amber-600 transition-colors hover:bg-amber-500/10 hover:text-amber-700"
                                                                            title="Unduh ZIP Pekerjaan"
                                                                        >
                                                                            <Download className="h-4.5 w-4.5" />
                                                                        </a>
                                                                    </div>
                                                                )}

                                                                {item.submission_link && (
                                                                    <div className="space-y-0.5">
                                                                        <span className="block text-[8px] font-semibold text-slate-400 uppercase">
                                                                            Tautan
                                                                            Repositori
                                                                            /
                                                                            Demo
                                                                        </span>
                                                                        <a
                                                                            href={
                                                                                item.submission_link
                                                                            }
                                                                            target="_blank"
                                                                            rel="noopener noreferrer"
                                                                            className="inline-flex items-center gap-1 text-xs font-bold text-indigo-500 hover:underline"
                                                                        >
                                                                            {
                                                                                item.submission_link
                                                                            }
                                                                            <ExternalLink
                                                                                size={
                                                                                    10
                                                                                }
                                                                            />
                                                                        </a>
                                                                    </div>
                                                                )}

                                                                {item.submission_note && (
                                                                    <div className="space-y-0.5">
                                                                        <span className="block text-[8px] font-semibold text-slate-400 uppercase">
                                                                            Catatan
                                                                            Pekerja
                                                                        </span>
                                                                        <p className="rounded-lg border border-slate-200/50 bg-white/40 p-2.5 text-xs leading-relaxed text-slate-700 dark:border-slate-800/40 dark:bg-black/15 dark:text-slate-300">
                                                                            {
                                                                                item.submission_note
                                                                            }
                                                                        </p>
                                                                    </div>
                                                                )}
                                                            </div>
                                                        )}

                                                        {/* Status Penjelasan Dinamis Berdasarkan Kondisi */}
                                                        <div className="space-y-1 rounded-xl border border-slate-200/60 bg-slate-50/50 p-4 dark:border-slate-800/40 dark:bg-black/15">
                                                            <span className="block text-[9px] font-bold tracking-wider text-slate-500 uppercase dark:text-slate-400">
                                                                Status Fase Saat
                                                                Ini
                                                            </span>
                                                            <p className="text-xs leading-relaxed text-slate-600 dark:text-slate-400">
                                                                {item.status ===
                                                                'open'
                                                                    ? item.is_creator
                                                                        ? `Quest Anda sedang berada dalam tahap bidding pasar. Pelamar dapat menaruh penawaran harga. Anda memiliki ${item.bids_count || 0} pelamar saat ini.`
                                                                        : item.my_bid
                                                                          ? `Anda telah menaruh penawaran bid sebesar ${formatCurrency(item.my_bid.bid_amount)} untuk quest ini. Status tawaran Anda: ${item.my_bid.status === 'pending' ? 'Menunggu Review' : item.my_bid.status}.`
                                                                          : 'Quest dalam masa penawaran bid terbuka bagi seluruh siswa.'
                                                                    : item.status ===
                                                                        'ongoing'
                                                                      ? item.is_worker
                                                                          ? 'Anda telah disetujui sebagai pekerja quest! Silakan selesaikan proyek sebelum tenggat waktu dan kirim repositori/berkas di halaman detail.'
                                                                          : item.is_creator
                                                                            ? `Quest Anda sedang aktif dikerjakan oleh pekerja ${item.worker?.name || ''}. Tunggu penyerahan berkas tugas dari mereka.`
                                                                            : 'Quest ini sedang berjalan aktif dikerjakan oleh pelamar terpilih.'
                                                                      : item.status ===
                                                                          'submitted'
                                                                        ? item.is_creator
                                                                            ? 'Pekerja telah menyerahkan hasil pekerjaan. Silakan lakukan review persetujuan atau minta revisi berkas di halaman detail.'
                                                                            : item.is_worker
                                                                              ? 'Hasil pekerjaan Anda telah dikirim dan sedang dalam proses review peninjauan oleh pembuat quest.'
                                                                              : 'Hasil pengerjaan dikirim dan sedang ditinjau.'
                                                                        : item.status ===
                                                                                'approved' ||
                                                                            item.status ===
                                                                                'payment'
                                                                          ? item.is_creator
                                                                              ? 'Pekerjaan disetujui! Lakukan transfer dana kesepakatan secara offline ke pekerja, lalu unggah bukti transfer di halaman detail.'
                                                                              : item.is_worker
                                                                                ? 'Pekerjaan Anda disetujui! Silakan verifikasi dana masuk ke rekening Anda. Unggah ZIP final setelah dana lunas.'
                                                                                : 'Pekerjaan disetujui, dalam proses rilis dana pembayaran.'
                                                                          : item.status ===
                                                                              'expired'
                                                                            ? item.is_creator
                                                                                ? 'Quest ini telah kadaluarsa karena melewati batas waktu. Anda dapat mengubah tenggat waktu dan membukanya kembali.'
                                                                                : 'Quest ini telah kadaluarsa melewati batas waktu.'
                                                                            : 'Quest telah diselesaikan secara resmi. Dana telah ditransfer ke pekerja dan rewards karakter telah didistribusikan.'}
                                                            </p>
                                                        </div>
                                                    </div>

                                                    {/* Kolom 3: Finansial, RPG Rewards, & Aksi Cepat */}
                                                    <div className="space-y-4 border-t border-dashed border-slate-200 pt-4 md:border-t-0 md:border-l md:pt-0 md:pl-5 dark:border-slate-800/80">
                                                        {/* RPG Rewards */}
                                                        <div className="space-y-2">
                                                            <span className="block text-[9px] font-bold tracking-wider text-slate-400 uppercase dark:text-slate-500">
                                                                Hadiah RPG Quest
                                                            </span>
                                                            <div className="flex flex-wrap gap-2">
                                                                {item.rewards
                                                                    ?.gold && (
                                                                    <div className="flex items-center gap-1.5 rounded-xl border border-amber-500/20 bg-amber-500/10 px-3 py-1.5 font-['Orbitron'] text-xs font-bold text-amber-600 shadow-sm dark:text-amber-400">
                                                                        💰 +
                                                                        {
                                                                            item
                                                                                .rewards
                                                                                .gold
                                                                        }{' '}
                                                                        Gold
                                                                    </div>
                                                                )}
                                                                {item.rewards
                                                                    ?.exp && (
                                                                    <div className="flex items-center gap-1.5 rounded-xl border border-indigo-500/20 bg-indigo-500/10 px-3 py-1.5 font-['Orbitron'] text-xs font-bold text-indigo-600 shadow-sm dark:text-indigo-400">
                                                                        ✨ +
                                                                        {
                                                                            item
                                                                                .rewards
                                                                                .exp
                                                                        }{' '}
                                                                        XP
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </div>

                                                        {/* Detail Kontrak */}
                                                        <div className="space-y-2">
                                                            <span className="block text-[9px] font-bold tracking-wider text-slate-400 uppercase dark:text-slate-500">
                                                                Detail Kontrak
                                                            </span>
                                                            <div className="space-y-2 rounded-xl border border-slate-100 bg-slate-50/50 p-3.5 text-[11px] dark:border-slate-800/60 dark:bg-black/20">
                                                                <div className="flex items-center justify-between">
                                                                    <span className="text-[9px] font-semibold text-slate-400 uppercase">
                                                                        Nilai
                                                                        Kontrak
                                                                    </span>
                                                                    <span className="font-bold text-slate-800 dark:text-white">
                                                                        {item.is_creator
                                                                            ? item.accepted_bid_amount
                                                                                ? formatCurrency(
                                                                                      item.accepted_bid_amount,
                                                                                  )
                                                                                : `${formatCurrency(item.min_salary)} - ${formatCurrency(item.max_salary)}`
                                                                            : item.my_bid
                                                                              ? formatCurrency(
                                                                                    item
                                                                                        .my_bid
                                                                                        .bid_amount,
                                                                                )
                                                                              : formatCurrency(
                                                                                    item.min_salary,
                                                                                )}
                                                                    </span>
                                                                </div>
                                                                <div className="flex items-center justify-between border-t border-slate-100/60 pt-2 dark:border-slate-800/40">
                                                                    <span className="text-[9px] font-semibold text-slate-400 uppercase">
                                                                        Status
                                                                        Escrow
                                                                    </span>
                                                                    <span
                                                                        className={`font-bold ${item.status === 'completed' ? 'text-emerald-500' : 'animate-pulse text-amber-500'}`}
                                                                    >
                                                                        {item.status ===
                                                                        'completed'
                                                                            ? 'Tuntas / Cair'
                                                                            : 'Terkunci (Escrow)'}
                                                                    </span>
                                                                </div>
                                                            </div>
                                                        </div>

                                                        {/* Feedback Ulasan (jika selesai) */}
                                                        {item.status ===
                                                            'completed' &&
                                                            item.rating && (
                                                                <div className="space-y-2 rounded-xl border border-indigo-500/10 bg-indigo-500/[0.02] p-3.5 text-center">
                                                                    <span className="block text-[8px] font-bold tracking-widest text-slate-400 uppercase dark:text-indigo-400">
                                                                        Feedback
                                                                        Ulasan
                                                                    </span>
                                                                    <div className="flex justify-center gap-1">
                                                                        {[
                                                                            1,
                                                                            2,
                                                                            3,
                                                                            4,
                                                                            5,
                                                                        ].map(
                                                                            (
                                                                                starVal,
                                                                            ) => (
                                                                                <Star
                                                                                    key={
                                                                                        starVal
                                                                                    }
                                                                                    className={`h-4 w-4 ${
                                                                                        starVal <=
                                                                                        (item.rating ??
                                                                                            0)
                                                                                            ? 'fill-amber-400 text-amber-400'
                                                                                            : 'dark:text-slate-750 text-slate-200'
                                                                                    }`}
                                                                                />
                                                                            ),
                                                                        )}
                                                                    </div>
                                                                    {item.rating_comment && (
                                                                        <p className="dark:text-slate-350 mt-1 text-[11px] leading-relaxed text-slate-600 italic">
                                                                            "
                                                                            {
                                                                                item.rating_comment
                                                                            }
                                                                            "
                                                                        </p>
                                                                    )}
                                                                </div>
                                                            )}

                                                        {/* RPG Stamp */}
                                                        {item.status ===
                                                            'completed' && (
                                                            <div className="relative flex justify-center py-2">
                                                                <div className="rotate-[-6deg] transform rounded-lg border-4 border-double border-emerald-500/35 bg-emerald-500/5 px-4 py-1.5 font-['Orbitron'] text-[10px] font-black tracking-widest text-emerald-500 uppercase shadow-sm select-none">
                                                                    ⭐ QUEST
                                                                    CLEAR ⭐
                                                                </div>
                                                            </div>
                                                        )}

                                                        {/* Aksi Cepat */}
                                                        <div className="space-y-2 border-t border-slate-100 pt-2 dark:border-slate-800/40">
                                                            <span className="block text-[9px] font-bold tracking-wider text-slate-400 uppercase dark:text-slate-500">
                                                                Aksi Cepat
                                                            </span>
                                                            <div className="flex gap-2">
                                                                <Link
                                                                    href={`/student/quests/${item._id}`}
                                                                    className="flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-indigo-600 py-2.5 font-['Orbitron'] text-[9px] font-bold text-white uppercase shadow-sm transition-all hover:bg-indigo-700 hover:shadow"
                                                                >
                                                                    <MessageSquare
                                                                        size={
                                                                            11
                                                                        }
                                                                    />
                                                                    Chat
                                                                </Link>
                                                                <Link
                                                                    href={`/student/quests/${item._id}`}
                                                                    className="flex flex-1 items-center justify-center gap-1.5 rounded-xl border border-slate-300 py-2.5 font-['Orbitron'] text-[9px] font-bold text-slate-700 uppercase transition-all hover:bg-slate-100 dark:border-slate-800 dark:text-slate-300 dark:hover:bg-slate-900"
                                                                >
                                                                    <Eye
                                                                        size={
                                                                            11
                                                                        }
                                                                    />
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
                    <div className="mt-8 flex flex-col items-center justify-between gap-4 border-t border-slate-200/85 pt-6 sm:flex-row dark:border-slate-800">
                        <span className="text-xs text-slate-500 dark:text-slate-400">
                            Menampilkan{' '}
                            <span className="font-semibold text-slate-800 dark:text-white">
                                {quests.from}
                            </span>{' '}
                            –{' '}
                            <span className="font-semibold text-slate-800 dark:text-white">
                                {quests.to}
                            </span>{' '}
                            dari{' '}
                            <span className="font-semibold text-slate-800 dark:text-white">
                                {quests.total}
                            </span>{' '}
                            riwayat quest
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
                                        className={`flex h-7 min-w-7 items-center justify-center rounded-lg px-2 text-xs font-semibold tabular-nums transition-colors ${
                                            link.active
                                                ? 'border border-indigo-300 bg-indigo-50 text-indigo-600 dark:border-indigo-500/40 dark:bg-indigo-500/10 dark:text-indigo-400'
                                                : 'border border-slate-200 text-slate-600 hover:border-slate-300 hover:text-slate-800 dark:border-slate-800 dark:text-slate-400 dark:hover:border-slate-700 dark:hover:text-slate-200'
                                        }`}
                                    >
                                        {labelText}
                                    </Link>
                                ) : (
                                    <span
                                        key={i}
                                        className="flex h-7 min-w-7 cursor-not-allowed items-center justify-center rounded-lg border border-slate-200 px-2 text-xs font-semibold text-slate-400 tabular-nums opacity-50 dark:border-slate-800 dark:text-slate-600"
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
