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
                color: 'border-purple-500/20 bg-purple-500/10 text-purple-705 dark:text-purple-400',
            };
        }
        if (maxSalary >= 5000000) {
            return {
                rank: 'Diamond',
                color: 'border-cyan-500/20 bg-cyan-500/10 text-cyan-705 dark:text-cyan-400',
            };
        }
        if (maxSalary >= 2500000) {
            return {
                rank: 'Gold',
                color: 'border-yellow-500/20 bg-yellow-500/10 text-yellow-705 dark:text-yellow-400',
            };
        }
        if (maxSalary >= 1000000) {
            return {
                rank: 'Silver',
                color: 'border-slate-500/20 bg-slate-500/10 text-slate-705 dark:text-slate-400',
            };
        }
        return {
            rank: 'Bronze',
            color: 'border-orange-500/20 bg-orange-500/10 text-orange-705 dark:text-orange-400',
        };
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
                            className="text-slate-650 flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-white transition-all hover:bg-slate-100 hover:text-slate-900 dark:border-slate-800 dark:bg-[#0c122c]/40 dark:text-slate-400 dark:hover:border-indigo-500/30 dark:hover:text-white"
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
                                <p className="dark:text-emerald-450 font-['Orbitron'] text-[10px] font-extrabold tracking-wider text-emerald-600 uppercase">
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
                    <div className="dark:bg-indigo-955/15 relative overflow-hidden rounded-2xl border border-indigo-500/20 bg-indigo-500/5 p-6 backdrop-blur-md dark:border-indigo-500/10">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-indigo-650 font-['Orbitron'] text-[10px] font-extrabold tracking-wider uppercase dark:text-indigo-400">
                                    Total Bid (Pekerja)
                                </p>
                                <p className="mt-2 font-['Orbitron'] text-2xl font-black text-slate-900 dark:text-white">
                                    {formatCurrency(stats.total_bids_placed)}
                                </p>
                            </div>
                            <div className="text-indigo-655 flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-500/10 dark:bg-indigo-500/20 dark:text-indigo-400">
                                <DollarSign size={24} />
                            </div>
                        </div>
                        <div className="absolute -right-4 -bottom-4 h-16 w-16 rotate-12 text-indigo-500/5 dark:text-indigo-500/10">
                            <DollarSign size={64} />
                        </div>
                    </div>

                    {/* Total Bid (Pembuat Quest) */}
                    <div className="dark:bg-amber-955/15 relative overflow-hidden rounded-2xl border border-amber-500/20 bg-amber-500/5 p-6 backdrop-blur-md dark:border-amber-500/10">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="dark:text-amber-450 font-['Orbitron'] text-[10px] font-extrabold tracking-wider text-amber-600 uppercase">
                                    Total Bid (Pembuat)
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
                                className="text-slate-655 w-full cursor-pointer rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-xs font-semibold uppercase focus:border-indigo-500 focus:outline-none dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300"
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
                        <p className="dark:text-slate-550 mt-1.5 text-xs text-slate-400">
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
                                    className={`rounded-2xl border bg-white/70 backdrop-blur-md transition-all duration-300 dark:bg-[#0c122c]/40 ${
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
                                                              ? 'border border-amber-500/20 bg-amber-500/10 text-amber-600 dark:text-amber-400'
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
                                                    {item.status === 'completed'
                                                        ? 'Selesai'
                                                        : item.status ===
                                                                'approved' ||
                                                            item.status ===
                                                                'payment'
                                                          ? 'Transfer'
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

                                            <div className="flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400">
                                                <span>
                                                    {item.is_creator
                                                        ? item.worker
                                                            ? `Pekerja: ${item.worker.name}`
                                                            : 'Belum Ada Pekerja'
                                                        : `Pembuat: ${item.creator.name}`}
                                                </span>
                                                {item.bids_count !==
                                                    undefined &&
                                                    item.status !==
                                                        'completed' && (
                                                        <div className="flex items-center gap-1 rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-semibold text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                                                            <Users
                                                                size={10}
                                                                className="text-indigo-500 dark:text-indigo-400"
                                                            />
                                                            {item.bids_count}{' '}
                                                            Bid
                                                        </div>
                                                    )}
                                            </div>
                                        </div>

                                        <div className="flex w-full shrink-0 items-center justify-between gap-4 border-t border-slate-100 pt-3 sm:w-auto sm:justify-end sm:border-0 sm:pt-0 dark:border-slate-800">
                                            <span className="font-['Orbitron'] text-xs font-bold text-indigo-600 dark:text-indigo-400">
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
                                                <div className="space-y-5 rounded-b-2xl border-t border-slate-200 bg-white/50 px-5 pt-5 pb-5 font-['Oxanium'] text-xs dark:border-slate-800/60 dark:bg-black/20">
                                                    {/* Stepper Progress Horizontal Timeline */}
                                                    <div className="space-y-4 overflow-hidden rounded-xl border border-slate-200 bg-white p-4 font-['Orbitron'] text-[9px] font-bold tracking-wider dark:border-slate-800/80 dark:bg-black/20">
                                                        <span className="block border-b border-slate-200 pb-2 text-[9px] font-bold tracking-wider text-slate-500 uppercase dark:border-slate-800">
                                                            Progress Alur Quest
                                                        </span>
                                                        <div className="scrollbar-none overflow-x-auto pb-2">
                                                            <div className="relative mx-auto flex min-w-[320px] items-center justify-between px-2 pt-2 md:px-6">
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
                                                                                            'approved' ||
                                                                                        item.status ===
                                                                                            'payment'
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
                                                                    (
                                                                        step,
                                                                        idx,
                                                                    ) => {
                                                                        const statuses =
                                                                            [
                                                                                'open',
                                                                                'ongoing',
                                                                                'submitted',
                                                                                'approved',
                                                                                'payment',
                                                                                'completed',
                                                                            ];
                                                                        const mappedItemStatus =
                                                                            item.status ===
                                                                            'payment'
                                                                                ? 'approved'
                                                                                : item.status;
                                                                        const currentIdx =
                                                                            statuses.indexOf(
                                                                                mappedItemStatus,
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
                                                                            mappedItemStatus ===
                                                                            step.key;

                                                                        return (
                                                                            <div
                                                                                key={
                                                                                    step.key
                                                                                }
                                                                                className="relative z-10 flex flex-col items-center"
                                                                            >
                                                                                <div
                                                                                    className={`flex h-6 w-6 items-center justify-center rounded-full border text-[9px] transition-all duration-300 ${
                                                                                        isCompleted
                                                                                            ? 'border-indigo-500 bg-indigo-600 text-white shadow-sm'
                                                                                            : isActive
                                                                                              ? 'border-purple-500 bg-purple-600 text-white shadow-sm'
                                                                                              : 'border-slate-200 bg-slate-50 text-slate-400 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-500'
                                                                                    }`}
                                                                                >
                                                                                    {isCompleted ? (
                                                                                        <CheckCircle2 className="h-3.5 w-3.5" />
                                                                                    ) : (
                                                                                        idx +
                                                                                        1
                                                                                    )}
                                                                                </div>
                                                                                <span
                                                                                    className={`mt-1.5 text-[8px] tracking-widest uppercase ${
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
                                                    </div>

                                                    {/* Description overview */}
                                                    <div className="space-y-1.5 rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-800/80 dark:bg-black/15">
                                                        <span className="block text-[9px] font-semibold tracking-wider text-slate-400 uppercase">
                                                            Deskripsi Quest
                                                        </span>
                                                        <p className="text-xs leading-relaxed whitespace-pre-wrap text-slate-700 dark:text-slate-300">
                                                            {item.description}
                                                        </p>
                                                    </div>

                                                    {/* Rewards (if completed) */}
                                                    {item.status ===
                                                        'completed' && (
                                                        <div className="flex flex-wrap gap-3 pt-1">
                                                            {item.rewards
                                                                ?.gold && (
                                                                <div className="flex items-center gap-1.5 rounded-xl border border-amber-500/20 bg-amber-500/10 px-3 py-2 text-amber-600 dark:text-amber-400">
                                                                    <Award
                                                                        size={
                                                                            14
                                                                        }
                                                                    />
                                                                    <span className="font-['Orbitron'] text-[10px] font-bold">
                                                                        +
                                                                        {
                                                                            item
                                                                                .rewards
                                                                                .gold
                                                                        }{' '}
                                                                        Gold
                                                                    </span>
                                                                </div>
                                                            )}
                                                            {item.rewards
                                                                ?.exp && (
                                                                <div className="flex items-center gap-1.5 rounded-xl border border-indigo-500/20 bg-indigo-500/10 px-3 py-2 text-indigo-600 dark:text-indigo-400">
                                                                    <Star
                                                                        size={
                                                                            14
                                                                        }
                                                                        className="fill-indigo-500/20"
                                                                    />
                                                                    <span className="font-['Orbitron'] text-[10px] font-bold">
                                                                        +
                                                                        {
                                                                            item
                                                                                .rewards
                                                                                .exp
                                                                        }{' '}
                                                                        XP
                                                                    </span>
                                                                </div>
                                                            )}
                                                        </div>
                                                    )}

                                                    {/* Action Link */}
                                                    <div className="pt-2">
                                                        <Link
                                                            href={`/student/quests/${item._id}`}
                                                            className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 py-3 font-['Orbitron'] text-[10px] font-bold tracking-wider text-white uppercase shadow-md transition-all hover:scale-[1.01] hover:from-indigo-700 hover:to-purple-700 hover:shadow-lg active:scale-[0.99]"
                                                        >
                                                            Lihat Detail Quest
                                                        </Link>
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
