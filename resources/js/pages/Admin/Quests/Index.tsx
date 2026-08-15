import { Link, router, useForm } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import {
    Pencil,
    Trash2,
    Plus,
    Search,
    Briefcase,
    Calendar,
    Users,
    Eye,
    FileText,
    ChevronLeft,
    ChevronRight,
    Check,
    X,
    Clock,
    AlertTriangle,
    CheckCircle2,
    Sparkles,
    ShieldAlert,
} from 'lucide-react';
import React, { useState } from 'react';
import Modal from '@/components/ui/Modal';
import ConfirmModal from '@/components/ui/ConfirmModal';

import { Quest } from '@/types/quest';

interface PaginatedQuests {
    data: Quest[];
    links: { url: string | null; label: string; active: boolean }[];
    current_page: number;
    last_page: number;
    total: number;
    from: number;
    to: number;
}

interface StatusCounts {
    all: number;
    pending: number;
    open: number;
    ongoing: number;
    dispute: number;
    completed: number;
}

interface Props {
    quests: PaginatedQuests;
    statusCounts: StatusCounts;
    filters: {
        search?: string;
        status?: string;
    };
}

export default function Index({ quests, statusCounts, filters }: Props) {
    const [openModal, setOpenModal] = useState<'create' | 'edit' | null>(null);
    const [editingQuest, setEditingQuest] = useState<Quest | null>(null);
    const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

    // Quick Moderation State
    const [rejectingQuest, setRejectingQuest] = useState<Quest | null>(null);
    const [rejectionNote, setRejectionNote] = useState('');
    const [isSubmittingAction, setIsSubmittingAction] = useState(false);

    const [searchQuery, setSearchQuery] = useState(filters?.search || '');
    const [statusFilter, setStatusFilter] = useState<string>(
        filters?.status || 'all',
    );
    const [sortBy, setSortBy] = useState<
        'latest' | 'highest_salary' | 'closest_deadline'
    >('latest');

    React.useEffect(() => {
        const hasSearchChanged = searchQuery !== (filters?.search || '');
        const hasStatusChanged = statusFilter !== (filters?.status || 'all');

        if (!hasSearchChanged && !hasStatusChanged) {
            return;
        }

        const timeout = setTimeout(() => {
            router.get(
                '/admin/quests',
                {
                    search: searchQuery || undefined,
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
    }, [searchQuery, statusFilter, filters]);

    const sortedFilteredQuests = [...quests.data].sort((a, b) => {
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

    const { data, setData, post, put, processing, errors, reset, clearErrors } =
        useForm({
            title: '',
            description: '',
            min_budget: '',
            max_budget: '',
            min_salary: '',
            max_salary: '',
            deadline: '',
        });

    function openCreate() {
        clearErrors();
        reset();
        setEditingQuest(null);
        setOpenModal('create');
    }

    function openEdit(quest: Quest) {
        clearErrors();
        reset();

        const deadlineDate = quest.deadline ? quest.deadline.split('T')[0] : '';
        const minVal = (quest.min_budget ?? quest.min_salary ?? 0).toString();
        const maxVal = (quest.max_budget ?? quest.max_salary ?? 0).toString();

        setData({
            title: quest.title,
            description: quest.description,
            min_budget: minVal,
            max_budget: maxVal,
            min_salary: minVal,
            max_salary: maxVal,
            deadline: deadlineDate,
        });
        setEditingQuest(quest);
        setOpenModal('edit');
    }

    function closeModal() {
        setOpenModal(null);
        setEditingQuest(null);
        reset();
    }

    function submit(e: React.FormEvent) {
        e.preventDefault();
        if (openModal === 'edit' && editingQuest) {
            put(`/admin/quests/${editingQuest.slug}`, {
                onSuccess: () => closeModal(),
            });
        } else {
            post('/admin/quests', {
                onSuccess: () => closeModal(),
            });
        }
    }

    function handleDelete(id: string) {
        setConfirmDeleteId(id);
    }

    function executeDelete() {
        if (confirmDeleteId) {
            router.delete(`/admin/quests/${confirmDeleteId}`, {
                onSuccess: () => setConfirmDeleteId(null),
            });
        }
    }

    // Quick Moderation Handlers
    function handleQuickApprove(quest: Quest) {
        if (isSubmittingAction) return;
        setIsSubmittingAction(true);
        router.post(
            `/admin/quests/${quest.slug || quest._id}/approve-publish`,
            {},
            {
                preserveScroll: true,
                onFinish: () => setIsSubmittingAction(false),
            },
        );
    }

    function handleQuickRejectSubmit(e: React.FormEvent) {
        e.preventDefault();
        if (!rejectingQuest || !rejectionNote.trim() || isSubmittingAction)
            return;

        setIsSubmittingAction(true);
        router.post(
            `/admin/quests/${rejectingQuest.slug || rejectingQuest._id}/reject-publish`,
            { rejection_note: rejectionNote },
            {
                preserveScroll: true,
                onSuccess: () => {
                    setRejectingQuest(null);
                    setRejectionNote('');
                },
                onFinish: () => setIsSubmittingAction(false),
            },
        );
    }

    const formatCurrency = (num: number) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
        }).format(num);
    };

    const formatDate = (dateStr: string) => {
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

    const counts = statusCounts || {
        all: quests?.total || 0,
        pending: 0,
        open: 0,
        ongoing: 0,
        dispute: 0,
        completed: 0,
    };

    return (
        <AppLayout>
            <div
                className="relative min-h-screen overflow-hidden bg-[#f8fafc] px-4 py-8 text-slate-800 transition-colors duration-200 sm:px-6 lg:px-10 dark:bg-[#030712] dark:text-white"
                style={{ fontFamily: "'Outfit', sans-serif" }}
            >
                {/* Ambient Glow */}
                <div className="pointer-events-none absolute top-0 left-1/2 z-0 h-[450px] w-full max-w-7xl -translate-x-1/2 rounded-full bg-indigo-500/5 blur-[120px] select-none dark:bg-indigo-500/5" />

                <div className="relative z-10 mx-auto max-w-7xl space-y-6">
                    {/* HEADER */}
                    <div className="relative overflow-hidden rounded-xl border border-slate-300 bg-white p-6 shadow-sm sm:p-8 md:p-10 dark:border-slate-800/80 dark:bg-gradient-to-b dark:from-[#0e0e1a] dark:to-[#090910]">
                        <div
                            className="pointer-events-none absolute inset-0 z-0"
                            style={{
                                backgroundImage: `
                                    linear-gradient(rgba(59, 40, 246, 0.04) 1px, transparent 1px),
                                    linear-gradient(90deg, rgba(59, 40, 246, 0.04) 1px, transparent 1px)
                                `,
                                backgroundSize: '40px 40px',
                            }}
                        />

                        <div className="absolute top-0 right-8 left-8 z-0 h-px bg-gradient-to-r from-transparent via-slate-300 to-transparent dark:via-slate-700" />

                        <div className="relative z-10 flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
                            <div className="max-w-2xl space-y-2">
                                <span className="inline-block text-[10px] font-bold tracking-widest text-indigo-600 uppercase dark:text-indigo-400">
                                    Freelance Platform & Moderation Queue
                                </span>
                                <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 md:text-3xl dark:text-white">
                                    Quest Management & Triage
                                </h1>
                                <p className="text-xs leading-relaxed font-semibold text-slate-600 dark:text-slate-400">
                                    Tinjau posting quest baru, kelola penawaran
                                    freelance, dan pantau proyek yang sedang
                                    berjalan secara langsung.
                                </p>
                            </div>

                            <button
                                onClick={openCreate}
                                className="relative z-10 inline-flex shrink-0 cursor-pointer items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 py-2.5 text-xs font-bold text-white shadow-md shadow-indigo-600/30 transition-all hover:bg-indigo-700"
                            >
                                <Plus size={16} className="stroke-[2.5]" />
                                Buat Quest Baru
                            </button>
                        </div>
                    </div>

                    {/* TOP KPI METRIC CARDS (PROPOSED UX ARCHITECTURE) */}
                    <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
                        {/* Card 1: Pending Moderasi */}
                        <div
                            onClick={() => setStatusFilter('pending')}
                            className={`group relative cursor-pointer overflow-hidden rounded-xl border p-4 transition-all duration-200 ${
                                statusFilter === 'pending'
                                    ? 'border-amber-500 bg-amber-500/10 shadow-md shadow-amber-500/10'
                                    : 'border-slate-300 bg-white hover:border-amber-500/50 dark:border-slate-800/80 dark:bg-[#0e0e1a] dark:hover:border-amber-500/40'
                            }`}
                        >
                            <div className="flex items-center justify-between">
                                <span className="text-[11px] font-bold text-slate-600 uppercase dark:text-slate-400">
                                    Perlu Review
                                </span>
                                <div
                                    className={`flex h-8 w-8 items-center justify-center rounded-lg ${
                                        counts.pending > 0
                                            ? 'bg-amber-500/20 text-amber-500 animate-pulse'
                                            : 'bg-slate-100 text-slate-400 dark:bg-slate-800'
                                    }`}
                                >
                                    <Clock size={16} />
                                </div>
                            </div>
                            <div className="mt-3 flex items-baseline gap-2">
                                <span className="text-2xl font-black text-slate-900 dark:text-white">
                                    {counts.pending}
                                </span>
                                {counts.pending > 0 && (
                                    <span className="text-[10px] font-bold text-amber-500">
                                        Menunggu Persetujuan
                                    </span>
                                )}
                            </div>
                        </div>

                        {/* Card 2: Open Bidding */}
                        <div
                            onClick={() => setStatusFilter('open')}
                            className={`group relative cursor-pointer overflow-hidden rounded-xl border p-4 transition-all duration-200 ${
                                statusFilter === 'open'
                                    ? 'border-emerald-500 bg-emerald-500/10 shadow-md shadow-emerald-500/10'
                                    : 'border-slate-300 bg-white hover:border-emerald-500/50 dark:border-slate-800/80 dark:bg-[#0e0e1a] dark:hover:border-emerald-500/40'
                            }`}
                        >
                            <div className="flex items-center justify-between">
                                <span className="text-[11px] font-bold text-slate-600 uppercase dark:text-slate-400">
                                    Quest Aktif
                                </span>
                                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500/20 text-emerald-500">
                                    <Sparkles size={16} />
                                </div>
                            </div>
                            <div className="mt-3 flex items-baseline gap-2">
                                <span className="text-2xl font-black text-slate-900 dark:text-white">
                                    {counts.open}
                                </span>
                                <span className="text-[10px] font-bold text-emerald-500">
                                    Open Bidding
                                </span>
                            </div>
                        </div>

                        {/* Card 3: Ongoing */}
                        <div
                            onClick={() => setStatusFilter('ongoing')}
                            className={`group relative cursor-pointer overflow-hidden rounded-xl border p-4 transition-all duration-200 ${
                                statusFilter === 'ongoing'
                                    ? 'border-sky-500 bg-sky-500/10 shadow-md shadow-sky-500/10'
                                    : 'border-slate-300 bg-white hover:border-sky-500/50 dark:border-slate-800/80 dark:bg-[#0e0e1a] dark:hover:border-sky-500/40'
                            }`}
                        >
                            <div className="flex items-center justify-between">
                                <span className="text-[11px] font-bold text-slate-600 uppercase dark:text-slate-400">
                                    Pengerjaan
                                </span>
                                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-sky-500/20 text-sky-500">
                                    <CheckCircle2 size={16} />
                                </div>
                            </div>
                            <div className="mt-3 flex items-baseline gap-2">
                                <span className="text-2xl font-black text-slate-900 dark:text-white">
                                    {counts.ongoing}
                                </span>
                                <span className="text-[10px] font-bold text-sky-500">
                                    Dalam Pengerjaan
                                </span>
                            </div>
                        </div>

                        {/* Card 4: Dispute / Arbitration */}
                        <div
                            onClick={() => setStatusFilter('dispute')}
                            className={`group relative cursor-pointer overflow-hidden rounded-xl border p-4 transition-all duration-200 ${
                                statusFilter === 'dispute'
                                    ? 'border-rose-500 bg-rose-500/10 shadow-md shadow-rose-500/10'
                                    : 'border-slate-300 bg-white hover:border-rose-500/50 dark:border-slate-800/80 dark:bg-[#0e0e1a] dark:hover:border-rose-500/40'
                            }`}
                        >
                            <div className="flex items-center justify-between">
                                <span className="text-[11px] font-bold text-slate-600 uppercase dark:text-slate-400">
                                    Dispute / Arbitrase
                                </span>
                                <div
                                    className={`flex h-8 w-8 items-center justify-center rounded-lg ${
                                        counts.dispute > 0
                                            ? 'bg-rose-500/20 text-rose-500 animate-pulse'
                                            : 'bg-slate-100 text-slate-400 dark:bg-slate-800'
                                    }`}
                                >
                                    <ShieldAlert size={16} />
                                </div>
                            </div>
                            <div className="mt-3 flex items-baseline gap-2">
                                <span className="text-2xl font-black text-slate-900 dark:text-white">
                                    {counts.dispute}
                                </span>
                                {counts.dispute > 0 && (
                                    <span className="text-[10px] font-bold text-rose-500">
                                        Perlu Respon Admin
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* ACTIONABLE TRIAGE TABS & SEARCH */}
                    <div className="relative overflow-hidden rounded-xl border border-slate-300 bg-white p-4 shadow-sm dark:border-slate-800/80 dark:bg-gradient-to-b dark:from-[#0e0e1a] dark:to-[#090910]">
                        <div className="pointer-events-none absolute top-0 right-8 left-8 z-0 h-px bg-gradient-to-r from-transparent via-slate-300 to-transparent select-none dark:via-slate-700" />
                        <div className="relative z-10 flex flex-col items-center justify-between gap-4 md:flex-row">
                            <div className="flex w-full flex-col items-center gap-3 sm:flex-row md:w-auto">
                                <div className="relative w-full sm:w-64 md:w-80">
                                    <input
                                        type="text"
                                        placeholder="Cari judul atau deskripsi..."
                                        value={searchQuery}
                                        onChange={(e) =>
                                            setSearchQuery(e.target.value)
                                        }
                                        className="w-full rounded-lg border border-slate-300 bg-slate-50/80 py-2 pr-4 pl-10 text-xs font-semibold text-slate-900 transition-colors placeholder:text-slate-500 focus:border-indigo-600 focus:bg-white focus:outline-none dark:border-slate-800 dark:bg-[#030712] dark:text-white dark:placeholder:text-slate-500"
                                    />
                                    <Search className="absolute top-2.5 left-3 h-4 w-4 text-slate-500 dark:text-slate-400" />
                                </div>

                                {/* Sort Selector */}
                                <select
                                    value={sortBy}
                                    onChange={(e) =>
                                        setSortBy(e.target.value as any)
                                    }
                                    className="w-full cursor-pointer rounded-lg border border-slate-300 bg-slate-50/80 px-3.5 py-2 text-xs font-bold text-slate-800 focus:border-indigo-600 focus:bg-white focus:outline-none sm:w-48 dark:border-slate-800 dark:bg-[#030712] dark:text-slate-300"
                                >
                                    <option value="latest">
                                        Urutan: Terbaru
                                    </option>
                                    <option value="highest_salary">
                                        Urutan: Gaji Tertinggi
                                    </option>
                                    <option value="closest_deadline">
                                        Urutan: Deadline Terdekat
                                    </option>
                                </select>
                            </div>

                            {/* Triage Tabs Navigation */}
                            <div className="scrollbar-none flex w-full items-center gap-1.5 overflow-x-auto pb-1 md:w-auto md:pb-0">
                                {[
                                    {
                                        id: 'all',
                                        label: 'Semua',
                                        count: counts.all,
                                    },
                                    {
                                        id: 'pending',
                                        label: '🟡 Review',
                                        count: counts.pending,
                                    },
                                    {
                                        id: 'open',
                                        label: '🟢 Open',
                                        count: counts.open,
                                    },
                                    {
                                        id: 'ongoing',
                                        label: '🟣 Ongoing',
                                        count: counts.ongoing,
                                    },
                                    {
                                        id: 'dispute',
                                        label: '🔴 Dispute',
                                        count: counts.dispute,
                                    },
                                    {
                                        id: 'completed',
                                        label: '⚪ Selesai',
                                        count: counts.completed,
                                    },
                                ].map((tab) => (
                                    <button
                                        key={tab.id}
                                        type="button"
                                        onClick={() =>
                                            setStatusFilter(tab.id as any)
                                        }
                                        className={`inline-flex cursor-pointer items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-bold whitespace-nowrap transition-all ${
                                            statusFilter === tab.id
                                                ? 'border border-indigo-600 bg-indigo-600 text-white shadow-sm'
                                                : 'border border-slate-300 bg-slate-100/90 text-slate-700 hover:bg-slate-200 hover:text-slate-900 dark:border-slate-800 dark:bg-[#030712] dark:text-slate-400 dark:hover:text-white'
                                        }`}
                                    >
                                        <span>{tab.label}</span>
                                        <span
                                            className={`rounded-full px-1.5 py-0.2 text-[10px] font-extrabold ${
                                                statusFilter === tab.id
                                                    ? 'bg-white/20 text-white'
                                                    : 'bg-slate-200 text-slate-700 dark:bg-slate-800 dark:text-slate-300'
                                            }`}
                                        >
                                            {tab.count}
                                        </span>
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* QUEST TABLE WITH QUICK ACTION BAR */}
                    <div className="overflow-hidden rounded-xl border border-slate-300 bg-white shadow-sm dark:border-slate-800 dark:bg-[#0d1117]">
                        {sortedFilteredQuests.length === 0 ? (
                            <div className="py-20 text-center text-slate-500">
                                <Briefcase className="mx-auto mb-3 h-10 w-10 text-slate-400 dark:text-slate-600" />
                                <p className="text-sm font-extrabold text-slate-900 dark:text-slate-300">
                                    Tidak ada Quest yang ditemukan
                                </p>
                                <p className="mt-1 text-xs font-semibold text-slate-600 dark:text-slate-400">
                                    Coba sesuaikan filter atau tambahkan quest
                                    baru.
                                </p>
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="w-full border-collapse text-left">
                                    <thead>
                                        <tr className="border-b border-slate-300 bg-slate-100/80 text-[10px] font-extrabold tracking-wider text-slate-600 uppercase dark:border-slate-800 dark:bg-slate-900/80 dark:text-slate-400">
                                            <th className="px-6 py-3.5">
                                                Quest
                                            </th>
                                            <th className="px-6 py-3.5">
                                                Gaji / Anggaran
                                            </th>
                                            <th className="px-6 py-3.5">
                                                Deadline
                                            </th>
                                            <th className="px-6 py-3.5">
                                                Pembuat
                                            </th>
                                            <th className="px-6 py-3.5">
                                                Pekerja
                                            </th>
                                            <th className="px-6 py-3.5">
                                                Bids
                                            </th>
                                            <th className="px-6 py-3.5">
                                                Status
                                            </th>
                                            <th className="px-6 py-3.5 text-right">
                                                Aksi Moderasi
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-200/80 text-xs dark:divide-slate-800/60">
                                        {sortedFilteredQuests.map((quest) => {
                                            const isPendingReview =
                                                quest.status === 'draft' ||
                                                quest.status ===
                                                    'pending_approval';

                                            return (
                                                <tr
                                                    key={quest._id}
                                                    className={`transition-colors ${
                                                        isPendingReview
                                                            ? 'bg-amber-500/5 hover:bg-amber-500/10 dark:bg-amber-500/5 dark:hover:bg-amber-500/10'
                                                            : 'hover:bg-slate-50 dark:hover:bg-slate-900/40'
                                                    }`}
                                                >
                                                    <td className="px-6 py-4">
                                                        <div className="flex flex-col gap-1">
                                                            <div className="flex items-center gap-2">
                                                                <span className="block max-w-xs truncate font-bold text-slate-900 dark:text-white">
                                                                    {
                                                                        quest.title
                                                                    }
                                                                </span>
                                                                {isPendingReview && (
                                                                    <span className="rounded bg-amber-500 px-1.5 py-0.5 text-[9px] font-black text-black uppercase animate-pulse">
                                                                        NEW
                                                                    </span>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 font-semibold whitespace-nowrap text-slate-800 dark:text-slate-200">
                                                        {quest.accepted_bid_amount ? (
                                                            <span className="font-bold text-emerald-600 dark:text-emerald-400">
                                                                {formatCurrency(
                                                                    quest.accepted_bid_amount,
                                                                )}
                                                            </span>
                                                        ) : (
                                                            <span className="font-bold">
                                                                {formatCurrency(
                                                                    quest.min_budget ??
                                                                        quest.min_salary ??
                                                                        0,
                                                                )}{' '}
                                                                -{' '}
                                                                {formatCurrency(
                                                                    quest.max_budget ??
                                                                        quest.max_salary ??
                                                                        0,
                                                                )}
                                                            </span>
                                                        )}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <span className="font-semibold text-slate-600 dark:text-slate-400">
                                                            {formatDate(
                                                                quest.deadline,
                                                            )}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <div className="flex items-center gap-2">
                                                            <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-slate-300 bg-slate-200 text-[10px] font-extrabold text-slate-700 uppercase dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300">
                                                                {quest.creator.name.charAt(
                                                                    0,
                                                                )}
                                                            </div>
                                                            <span className="font-semibold text-slate-800 dark:text-slate-200">
                                                                {
                                                                    quest
                                                                        .creator
                                                                        .name
                                                                }
                                                            </span>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        {quest.worker ? (
                                                            <div className="flex items-center gap-2">
                                                                <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-emerald-300 bg-emerald-100 text-[10px] font-extrabold text-emerald-800 uppercase dark:border-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300">
                                                                    {quest.worker.name.charAt(
                                                                        0,
                                                                    )}
                                                                </div>
                                                                <span className="font-semibold text-slate-800 dark:text-slate-200">
                                                                    {
                                                                        quest
                                                                            .worker
                                                                            .name
                                                                    }
                                                                </span>
                                                            </div>
                                                        ) : (
                                                            <div className="flex items-center gap-1.5 text-slate-400 dark:text-slate-500">
                                                                <span className="relative flex h-1.5 w-1.5 shrink-0">
                                                                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-slate-400 opacity-75"></span>
                                                                    <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-slate-400"></span>
                                                                </span>
                                                                <span className="text-xs italic">
                                                                    Mencari
                                                                    Pelamar
                                                                </span>
                                                            </div>
                                                        )}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <span className="font-bold text-slate-900 dark:text-slate-200">
                                                            {quest.bids_count}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <span
                                                            className={`inline-flex items-center rounded-md border px-2.5 py-1 text-[10px] font-extrabold tracking-wider uppercase ${
                                                                quest.status ===
                                                                'open'
                                                                    ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-700 dark:border-emerald-500/30 dark:bg-emerald-500/20 dark:text-emerald-400'
                                                                    : isPendingReview
                                                                      ? 'border-amber-500/30 bg-amber-500/10 text-amber-700 dark:border-amber-500/30 dark:bg-amber-500/20 dark:text-amber-400'
                                                                      : quest.status ===
                                                                          'rejected'
                                                                        ? 'border-red-500/30 bg-red-500/10 text-red-700 dark:border-red-500/30 dark:bg-red-500/20 dark:text-red-400'
                                                                        : quest.status ===
                                                                            'expired'
                                                                          ? 'border-rose-500/30 bg-rose-500/10 text-rose-700 dark:border-rose-500/30 dark:bg-rose-500/20 dark:text-rose-400'
                                                                          : quest.status ===
                                                                              'ongoing'
                                                                            ? 'border-sky-500/30 bg-sky-500/10 text-sky-700 dark:border-sky-500/30 dark:bg-sky-500/20 dark:text-sky-400'
                                                                            : 'border-slate-400/30 bg-slate-500/10 text-slate-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300'
                                                            }`}
                                                        >
                                                            {quest.status ===
                                                            'open'
                                                                ? 'Tersedia'
                                                                : isPendingReview
                                                                  ? 'Draft'
                                                                  : quest.status ===
                                                                      'rejected'
                                                                    ? 'Ditolak'
                                                                    : quest.status ===
                                                                        'expired'
                                                                      ? 'Kadaluarsa'
                                                                      : quest.status ===
                                                                          'ongoing'
                                                                        ? 'Berjalan'
                                                                        : 'Selesai'}
                                                        </span>
                                                    </td>

                                                    {/* QUICK ACTION BAR */}
                                                    <td className="px-6 py-4 text-right whitespace-nowrap">
                                                        <div className="flex items-center justify-end gap-1.5">
                                                            {isPendingReview && (
                                                                <>
                                                                    <button
                                                                        onClick={() =>
                                                                            handleQuickApprove(
                                                                                quest,
                                                                            )
                                                                        }
                                                                        disabled={
                                                                            isSubmittingAction
                                                                        }
                                                                        title="Setujui & Publikasikan Quest"
                                                                        className="inline-flex cursor-pointer items-center gap-1 rounded-lg bg-emerald-600 px-2.5 py-1.5 text-[11px] font-bold text-white shadow-sm transition hover:bg-emerald-700 disabled:opacity-50"
                                                                    >
                                                                        <Check
                                                                            size={
                                                                                13
                                                                            }
                                                                        />
                                                                        Setujui
                                                                    </button>

                                                                    <button
                                                                        onClick={() =>
                                                                            setRejectingQuest(
                                                                                quest,
                                                                            )
                                                                        }
                                                                        disabled={
                                                                            isSubmittingAction
                                                                        }
                                                                        title="Tolak Quest & Beri Catatan"
                                                                        className="inline-flex cursor-pointer items-center gap-1 rounded-lg border border-rose-500/40 bg-rose-500/10 px-2.5 py-1.5 text-[11px] font-bold text-rose-500 transition hover:bg-rose-500/20 disabled:opacity-50"
                                                                    >
                                                                        <X
                                                                            size={
                                                                                13
                                                                            }
                                                                        />
                                                                        Tolak
                                                                    </button>
                                                                </>
                                                            )}

                                                            <Link
                                                                href={`/admin/quests/${quest.slug || quest._id}`}
                                                                title="Detail Proyek"
                                                                className="rounded-lg bg-indigo-50 px-3 py-1.5 text-[11px] font-bold text-indigo-600 transition-colors hover:bg-indigo-100 dark:bg-indigo-950/50 dark:text-indigo-400 dark:hover:bg-indigo-900/60"
                                                            >
                                                                Detail
                                                            </Link>

                                                            <button
                                                                onClick={() =>
                                                                    handleDelete(
                                                                        quest._id,
                                                                    )
                                                                }
                                                                className="cursor-pointer rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-950/40 dark:hover:text-red-400"
                                                                title="Hapus Quest"
                                                            >
                                                                <Trash2
                                                                    size={14}
                                                                />
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>

                    {/* PAGINATION */}
                    {quests.last_page > 1 && (
                        <div className="flex items-center justify-between border-t border-slate-200 pt-4 dark:border-slate-800">
                            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                                Menampilkan {quests.from} - {quests.to} dari{' '}
                                {quests.total} Quest
                            </span>
                            <div className="flex gap-1">
                                {quests.links.map((link, idx) => (
                                    <Link
                                        key={idx}
                                        href={link.url || '#'}
                                        dangerouslySetInnerHTML={{
                                            __html: link.label,
                                        }}
                                        className={`rounded-lg px-3 py-1.5 text-xs font-bold transition-colors ${
                                            link.active
                                                ? 'bg-indigo-600 text-white'
                                                : link.url
                                                  ? 'bg-white text-slate-700 hover:bg-slate-100 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800'
                                                  : 'cursor-not-allowed bg-slate-100 text-slate-400 dark:bg-slate-900/50 dark:text-slate-600'
                                        }`}
                                    />
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* QUICK REJECTION MODAL */}
            {rejectingQuest && (
                <Modal
                    open={!!rejectingQuest}
                    onClose={() => setRejectingQuest(null)}
                    title="Tolak & Minta Perbaikan Quest"
                >
                    <form
                        onSubmit={handleQuickRejectSubmit}
                        className="space-y-4"
                    >
                        <p className="text-xs font-semibold text-slate-600 dark:text-slate-400">
                            Berikan alasan atau catatan perbaikan untuk quest{' '}
                            <span className="font-bold text-slate-900 dark:text-white">
                                "{rejectingQuest.title}"
                            </span>
                            :
                        </p>
                        <div>
                            <textarea
                                value={rejectionNote}
                                onChange={(e) =>
                                    setRejectionNote(e.target.value)
                                }
                                placeholder="Contoh: Deskripsi kurang jelas, atau anggaran tidak sesuai standar..."
                                rows={4}
                                required
                                className="w-full rounded-lg border border-slate-300 bg-slate-50 p-3 text-xs font-semibold text-slate-900 focus:border-indigo-600 focus:bg-white focus:outline-none dark:border-slate-800 dark:bg-[#030712] dark:text-white"
                            />
                        </div>
                        <div className="flex justify-end gap-2 pt-2">
                            <button
                                type="button"
                                onClick={() => setRejectingQuest(null)}
                                className="rounded-lg bg-slate-100 px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:hover:bg-slate-700"
                            >
                                Batal
                            </button>
                            <button
                                type="submit"
                                disabled={isSubmittingAction}
                                className="rounded-lg bg-rose-600 px-4 py-2 text-xs font-bold text-white shadow-sm hover:bg-rose-700 disabled:opacity-50"
                            >
                                Kirim Penolakan
                            </button>
                        </div>
                    </form>
                </Modal>
            )}

            {/* CREATE / EDIT MODAL */}
            <Modal
                open={openModal !== null}
                onClose={closeModal}
                title={
                    openModal === 'create'
                        ? 'Buat Quest Baru'
                        : 'Edit Detail Quest'
                }
            >
                <form onSubmit={submit} className="space-y-4">
                    <div>
                        <label className="block text-xs font-bold text-slate-700 uppercase dark:text-slate-300">
                            Judul Quest
                        </label>
                        <input
                            type="text"
                            value={data.title}
                            onChange={(e) => setData('title', e.target.value)}
                            required
                            className="mt-1 w-full rounded-lg border border-slate-300 bg-slate-50 p-2.5 text-xs font-semibold text-slate-900 focus:border-indigo-600 focus:outline-none dark:border-slate-800 dark:bg-[#030712] dark:text-white"
                        />
                        {errors.title && (
                            <p className="mt-1 text-[11px] text-red-500">
                                {errors.title}
                            </p>
                        )}
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-slate-700 uppercase dark:text-slate-300">
                            Deskripsi
                        </label>
                        <textarea
                            value={data.description}
                            onChange={(e) =>
                                setData('description', e.target.value)
                            }
                            rows={3}
                            required
                            className="mt-1 w-full rounded-lg border border-slate-300 bg-slate-50 p-2.5 text-xs font-semibold text-slate-900 focus:border-indigo-600 focus:outline-none dark:border-slate-800 dark:bg-[#030712] dark:text-white"
                        />
                        {errors.description && (
                            <p className="mt-1 text-[11px] text-red-500">
                                {errors.description}
                            </p>
                        )}
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="block text-xs font-bold text-slate-700 uppercase dark:text-slate-300">
                                Min Anggaran (Rp)
                            </label>
                            <input
                                type="number"
                                value={data.min_budget}
                                onChange={(e) =>
                                    setData('min_budget', e.target.value)
                                }
                                required
                                className="mt-1 w-full rounded-lg border border-slate-300 bg-slate-50 p-2.5 text-xs font-semibold text-slate-900 focus:border-indigo-600 focus:outline-none dark:border-slate-800 dark:bg-[#030712] dark:text-white"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-slate-700 uppercase dark:text-slate-300">
                                Max Anggaran (Rp)
                            </label>
                            <input
                                type="number"
                                value={data.max_budget}
                                onChange={(e) =>
                                    setData('max_budget', e.target.value)
                                }
                                required
                                className="mt-1 w-full rounded-lg border border-slate-300 bg-slate-50 p-2.5 text-xs font-semibold text-slate-900 focus:border-indigo-600 focus:outline-none dark:border-slate-800 dark:bg-[#030712] dark:text-white"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-slate-700 uppercase dark:text-slate-300">
                            Deadline
                        </label>
                        <input
                            type="date"
                            value={data.deadline}
                            onChange={(e) =>
                                setData('deadline', e.target.value)
                            }
                            required
                            className="mt-1 w-full rounded-lg border border-slate-300 bg-slate-50 p-2.5 text-xs font-semibold text-slate-900 focus:border-indigo-600 focus:outline-none dark:border-slate-800 dark:bg-[#030712] dark:text-white"
                        />
                        {errors.deadline && (
                            <p className="mt-1 text-[11px] text-red-500">
                                {errors.deadline}
                            </p>
                        )}
                    </div>

                    <div className="flex justify-end gap-2 pt-2">
                        <button
                            type="button"
                            onClick={closeModal}
                            className="rounded-lg bg-slate-100 px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:hover:bg-slate-700"
                        >
                            Batal
                        </button>
                        <button
                            type="submit"
                            disabled={processing}
                            className="rounded-lg bg-indigo-600 px-4 py-2 text-xs font-bold text-white shadow-md hover:bg-indigo-700 disabled:opacity-50"
                        >
                            {openModal === 'create' ? 'Simpan' : 'Perbarui'}
                        </button>
                    </div>
                </form>
            </Modal>

            {/* CONFIRM DELETE MODAL */}
            <ConfirmModal
                open={confirmDeleteId !== null}
                onClose={() => setConfirmDeleteId(null)}
                onConfirm={executeDelete}
                title="Hapus Quest"
                message="Apakah Anda yakin ingin menghapus quest ini? Tindakan ini tidak dapat dibatalkan."
            />
        </AppLayout>
    );
}
