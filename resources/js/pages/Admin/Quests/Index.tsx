import { Link, router, useForm } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import {
    Pencil,
    Trash2,
    Plus,
    Search,
    Briefcase,
    Calendar,
    DollarSign,
    Users,
    Eye,
    FileText,
    ChevronLeft,
    ChevronRight,
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

interface Props {
    quests: PaginatedQuests;
    filters: {
        search?: string;
        status?: string;
    };
}

export default function Index({ quests, filters }: Props) {
    const [openModal, setOpenModal] = useState<'create' | 'edit' | null>(null);
    const [editingQuest, setEditingQuest] = useState<Quest | null>(null);
    const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState(filters?.search || '');
    const [statusFilter, setStatusFilter] = useState<string>(filters?.status || 'all');
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
            return b.max_salary - a.max_salary;
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

        // Format ISO string to YYYY-MM-DD for date input
        const deadlineDate = quest.deadline ? quest.deadline.split('T')[0] : '';

        setData({
            title: quest.title,
            description: quest.description,
            min_salary: quest.min_salary.toString(),
            max_salary: quest.max_salary.toString(),
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
            put(`/admin/quests/${editingQuest._id}`, {
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

    return (
        <AppLayout>
            <div
                className="relative min-h-screen overflow-hidden bg-[#f8fafc] px-4 py-8 text-slate-800 transition-colors duration-200 sm:px-6 lg:px-10 dark:bg-[#030712] dark:text-white"
                style={{ fontFamily: "'Outfit', sans-serif" }}
            >
                {/* Subtle top-center ambient glow (visible on dark mode) */}
                <div className="pointer-events-none absolute top-0 left-1/2 z-0 h-[450px] w-full max-w-7xl -translate-x-1/2 rounded-full bg-indigo-500/5 blur-[120px] select-none dark:bg-indigo-500/5" />

                <div className="relative z-10 mx-auto max-w-7xl space-y-6">
                    {/* HEADER */}
                    <div className="relative overflow-hidden rounded-xl border border-slate-300 bg-white p-6 shadow-sm sm:p-8 md:p-10 dark:border-slate-800/80 dark:bg-gradient-to-b dark:from-[#0e0e1a] dark:to-[#090910]">
                        {/* Grid Pattern Motif */}
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
                                    Freelance Platform
                                </span>
                                <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 md:text-3xl dark:text-white">
                                    Quest Management (Freelance)
                                </h1>
                                <p className="text-xs font-semibold leading-relaxed text-slate-600 dark:text-slate-400">
                                    Kelola lowongan pekerjaan freelance,
                                    moderasi penawaran masuk dari siswa, dan
                                    pantau proyek yang berjalan.
                                </p>
                            </div>

                            <button
                                onClick={openCreate}
                                className="relative z-10 inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 py-2.5 text-xs font-bold text-white shadow-md shadow-indigo-600/30 transition-all hover:bg-indigo-700 cursor-pointer"
                            >
                                <Plus size={16} className="stroke-[2.5]" />
                                Buat Quest Baru
                            </button>
                        </div>
                    </div>

                    {/* FILTERS & SEARCH */}
                    <div className="relative overflow-hidden rounded-xl border border-slate-300 bg-white p-4 shadow-sm dark:border-slate-800/80 dark:bg-gradient-to-b dark:from-[#0e0e1a] dark:to-[#090910]">
                        <div className="absolute top-0 right-8 left-8 z-0 h-px bg-gradient-to-r from-transparent via-slate-300 to-transparent dark:via-slate-700 pointer-events-none select-none" />
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
                                        className="w-full rounded-lg border border-slate-300 bg-slate-50/80 py-2 pr-4 pl-10 text-xs font-semibold text-slate-900 placeholder:text-slate-500 transition-colors focus:border-indigo-600 focus:bg-white focus:outline-none dark:border-slate-800 dark:bg-[#030712] dark:text-white dark:placeholder:text-slate-500"
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
                                    <option value="latest">Urutan: Terbaru</option>
                                    <option value="highest_salary">
                                        Urutan: Gaji Tertinggi
                                    </option>
                                    <option value="closest_deadline">
                                        Urutan: Deadline Terdekat
                                    </option>
                                </select>
                            </div>

                            <div className="flex w-full items-center gap-1.5 overflow-x-auto pb-1 md:w-auto md:pb-0 scrollbar-none">
                                {[
                                    'all',
                                    'draft',
                                    'open',
                                    'rejected',
                                    'ongoing',
                                    'completed',
                                ].map((statusOption) => (
                                    <button
                                        key={statusOption}
                                        type="button"
                                        onClick={() =>
                                            setStatusFilter(statusOption as any)
                                        }
                                        className={`cursor-pointer rounded-lg px-3.5 py-2 text-xs font-bold transition-all whitespace-nowrap ${
                                            statusFilter === statusOption
                                                ? 'border border-indigo-600 bg-indigo-600 text-white shadow-sm'
                                                : 'border border-slate-300 bg-slate-100/90 text-slate-700 hover:bg-slate-200 hover:text-slate-900 dark:border-slate-800 dark:bg-[#030712] dark:text-slate-400 dark:hover:text-white'
                                        }`}
                                    >
                                        {statusOption === 'all'
                                            ? 'Semua'
                                            : statusOption === 'draft'
                                              ? 'Draft'
                                              : statusOption === 'open'
                                                ? 'Tersedia'
                                                : statusOption === 'rejected'
                                                  ? 'Ditolak'
                                                  : statusOption === 'ongoing'
                                                    ? 'Berjalan'
                                                    : 'Selesai'}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* QUEST TABLE */}
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
                                            <th className="px-6 py-3.5">Quest</th>
                                            <th className="px-6 py-3.5">Gaji / Anggaran</th>
                                            <th className="px-6 py-3.5">Deadline</th>
                                            <th className="px-6 py-3.5">Pembuat</th>
                                            <th className="px-6 py-3.5">Pekerja</th>
                                            <th className="px-6 py-3.5">Bids</th>
                                            <th className="px-6 py-3.5">Status</th>
                                            <th className="px-6 py-3.5 text-right">Aksi</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-200/80 text-xs dark:divide-slate-800/60">
                                        {sortedFilteredQuests.map((quest) => (
                                            <tr
                                                key={quest._id}
                                                className="transition-colors hover:bg-slate-50 dark:hover:bg-slate-900/40"
                                            >
                                                <td className="px-6 py-4">
                                                    <span className="block max-w-xs truncate font-bold text-slate-900 dark:text-white">
                                                        {quest.title}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 font-semibold text-slate-800 dark:text-slate-200 whitespace-nowrap">
                                                    {quest.accepted_bid_amount ? (
                                                        <span className="font-bold text-emerald-600 dark:text-emerald-400">
                                                            {formatCurrency(quest.accepted_bid_amount)}
                                                        </span>
                                                    ) : (
                                                        <span className="font-bold">
                                                            {formatCurrency(quest.min_salary)} - {formatCurrency(quest.max_salary)}
                                                        </span>
                                                    )}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span className="font-semibold text-slate-600 dark:text-slate-400">
                                                        {formatDate(quest.deadline)}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="flex items-center gap-2">
                                                        <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-slate-200 text-[10px] font-extrabold text-slate-700 uppercase border border-slate-300 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700">
                                                            {quest.creator.name.charAt(0)}
                                                        </div>
                                                        <span className="font-semibold text-slate-800 dark:text-slate-200">
                                                            {quest.creator.name}
                                                        </span>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    {quest.worker ? (
                                                        <div className="flex items-center gap-2">
                                                            <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-[10px] font-extrabold text-emerald-800 uppercase border border-emerald-300 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-800">
                                                                {quest.worker.name.charAt(0)}
                                                            </div>
                                                            <span className="font-semibold text-slate-800 dark:text-slate-200">
                                                                {quest.worker.name}
                                                            </span>
                                                        </div>
                                                    ) : (
                                                        <div className="flex items-center gap-1.5 text-slate-400 dark:text-slate-500">
                                                            <span className="relative flex h-1.5 w-1.5 shrink-0">
                                                                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-slate-400 opacity-75"></span>
                                                                <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-slate-400"></span>
                                                            </span>
                                                            <span className="text-xs italic">Mencari Pelamar</span>
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
                                                        className={`inline-flex items-center rounded-md px-2.5 py-1 text-[10px] font-extrabold tracking-wider uppercase border ${
                                                            quest.status === 'open'
                                                                ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-700 dark:border-emerald-500/30 dark:bg-emerald-500/20 dark:text-emerald-400'
                                                                : quest.status === 'draft'
                                                                  ? 'border-amber-500/30 bg-amber-500/10 text-amber-700 dark:border-amber-500/30 dark:bg-amber-500/20 dark:text-amber-400'
                                                                  : quest.status === 'rejected'
                                                                    ? 'border-red-500/30 bg-red-500/10 text-red-700 dark:border-red-500/30 dark:bg-red-500/20 dark:text-red-400'
                                                                    : quest.status === 'expired'
                                                                      ? 'border-rose-500/30 bg-rose-500/10 text-rose-700 dark:border-rose-500/30 dark:bg-rose-500/20 dark:text-rose-400'
                                                                      : quest.status === 'ongoing'
                                                                        ? 'border-sky-500/30 bg-sky-500/10 text-sky-700 dark:border-sky-500/30 dark:bg-sky-500/20 dark:text-sky-400'
                                                                        : 'border-slate-400/30 bg-slate-500/10 text-slate-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300'
                                                        }`}
                                                    >
                                                        {quest.status === 'open'
                                                            ? 'Tersedia'
                                                            : quest.status === 'draft'
                                                              ? 'Draft'
                                                              : quest.status === 'rejected'
                                                                ? 'Ditolak'
                                                                : quest.status === 'expired'
                                                                  ? 'Kadaluarsa'
                                                                  : quest.status === 'ongoing'
                                                                    ? 'Berjalan'
                                                                    : 'Selesai'}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 text-right whitespace-nowrap">
                                                    <div className="flex justify-end gap-1">
                                                        <Link
                                                            href={`/admin/quests/${quest._id}`}
                                                            title="Detail & Bid"
                                                            className="rounded-lg bg-indigo-50 px-3 py-1.5 text-[11px] font-bold text-indigo-600 hover:bg-indigo-100 dark:bg-indigo-950/50 dark:text-indigo-400 dark:hover:bg-indigo-900/60 transition-colors"
                                                        >
                                                            Detail
                                                        </Link>
                                                        <button
                                                            onClick={() => handleDelete(quest._id)}
                                                            className="cursor-pointer rounded-lg p-1.5 text-slate-400 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-950/40 dark:hover:text-red-400 transition-colors"
                                                            title="Hapus Quest"
                                                        >
                                                            <Trash2 size={14} />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}

                        {/* Pagination Footer */}
                        {quests.last_page > 1 && (
                            <div className="flex flex-col items-center justify-between gap-4 border-t border-slate-200 px-6 py-4 dark:border-slate-800 sm:flex-row">
                                <span className="text-xs text-slate-500 dark:text-slate-400">
                                    Menampilkan{' '}
                                    <span className="font-bold text-slate-900 dark:text-white">
                                        {quests.from}
                                    </span>{' '}
                                    sampai{' '}
                                    <span className="font-bold text-slate-900 dark:text-white">
                                        {quests.to}
                                    </span>{' '}
                                    dari{' '}
                                    <span className="font-bold text-slate-900 dark:text-white">
                                        {quests.total}
                                    </span>{' '}
                                    quest
                                </span>

                                <div className="flex items-center gap-1.5">
                                    {quests.links.map((link, i) => {
                                        const labelLower = link.label.toLowerCase();
                                        const isPrev = labelLower.includes('previous') || labelLower.includes('&laquo;') || labelLower.includes('laquo');
                                        const isNext = labelLower.includes('next') || labelLower.includes('&raquo;') || labelLower.includes('raquo');
                                        
                                        const renderLabel = () => {
                                            if (isPrev) return <ChevronLeft size={14} className="shrink-0" />;
                                            if (isNext) return <ChevronRight size={14} className="shrink-0" />;
                                            return link.label;
                                        };

                                        return link.url ? (
                                            <Link
                                                key={i}
                                                href={link.url}
                                                preserveScroll
                                                className={`flex h-7 min-w-7 items-center justify-center rounded-lg px-2 text-xs font-bold tabular-nums transition-colors ${
                                                    link.active
                                                        ? 'border border-indigo-600 bg-indigo-600 text-white shadow-sm'
                                                        : 'border border-slate-300 bg-white text-slate-700 hover:bg-slate-100 hover:text-slate-900 dark:border-slate-800 dark:bg-[#030712] dark:text-slate-300 dark:hover:text-white'
                                                }`}
                                            >
                                                {renderLabel()}
                                            </Link>
                                        ) : (
                                            <span
                                                key={i}
                                                className="cursor-not-allowed flex h-7 min-w-7 items-center justify-center rounded-lg border border-slate-300 bg-slate-100 px-2 text-xs font-semibold text-slate-400 tabular-nums opacity-60 dark:border-slate-800 dark:bg-[#030712] dark:text-slate-600"
                                            >
                                                {renderLabel()}
                                            </span>
                                        );
                                    })}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* CREATE/EDIT MODAL */}
            <Modal
                open={openModal !== null}
                title={openModal === 'edit' ? 'Edit Quest' : 'Buat Quest Baru'}
                onClose={closeModal}
            >
                <form onSubmit={submit} className="space-y-4 pt-2">
                    {Object.keys(errors).length > 0 && (
                        <div className="mb-4 rounded-lg border border-red-500/20 bg-red-500/10 p-3 text-xs font-semibold text-red-500">
                            Terdapat kesalahan:
                            <ul className="mt-1 list-inside list-disc space-y-0.5 font-normal">
                                {Object.entries(errors).map(([key, val]) => (
                                    <li key={key}>{val}</li>
                                ))}
                            </ul>
                        </div>
                    )}

                    <div className="space-y-1">
                        <label className="block text-xs font-bold tracking-wider text-slate-500 uppercase">
                            Judul Quest
                        </label>
                        <input
                            type="text"
                            value={data.title}
                            onChange={(e) => setData('title', e.target.value)}
                            className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none dark:border-slate-800 dark:bg-slate-900"
                            placeholder="Contoh: Membuat Logo Vector untuk Landing Page"
                        />
                        {errors.title && (
                            <p className="text-xs font-semibold text-red-500">
                                {errors.title}
                            </p>
                        )}
                    </div>

                    <div className="space-y-1">
                        <label className="block text-xs font-bold tracking-wider text-slate-500 uppercase">
                            Deskripsi Pekerjaan
                        </label>
                        <textarea
                            value={data.description}
                            onChange={(e) =>
                                setData('description', e.target.value)
                            }
                            className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none dark:border-slate-800 dark:bg-slate-900"
                            rows={4}
                            placeholder="Jelaskan spesifikasi teknis dan kriteria pekerjaan..."
                        />
                        {errors.description && (
                            <p className="text-xs font-semibold text-red-500">
                                {errors.description}
                            </p>
                        )}
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                            <label className="block text-xs font-bold tracking-wider text-slate-500 uppercase">
                                Gaji Min (Rp)
                            </label>
                            <input
                                type="number"
                                value={data.min_salary}
                                onChange={(e) =>
                                    setData('min_salary', e.target.value)
                                }
                                className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none dark:border-slate-800 dark:bg-slate-950"
                                placeholder="Contoh: 1000000"
                            />
                            {errors.min_salary && (
                                <p className="text-xs font-semibold text-red-500">
                                    {errors.min_salary}
                                </p>
                            )}
                        </div>

                        <div className="space-y-1">
                            <label className="block text-xs font-bold tracking-wider text-slate-500 uppercase">
                                Gaji Max (Rp)
                            </label>
                            <input
                                type="number"
                                value={data.max_salary}
                                onChange={(e) =>
                                    setData('max_salary', e.target.value)
                                }
                                className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none dark:border-slate-800 dark:bg-slate-950"
                                placeholder="Contoh: 2500000"
                            />
                            {errors.max_salary && (
                                <p className="text-xs font-semibold text-red-500">
                                    {errors.max_salary}
                                </p>
                            )}
                        </div>
                    </div>

                    <div className="space-y-1">
                        <label className="block text-xs font-bold tracking-wider text-slate-500 uppercase">
                            Deadline
                        </label>
                        <input
                            type="date"
                            value={data.deadline}
                            onChange={(e) =>
                                setData('deadline', e.target.value)
                            }
                            className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none dark:border-slate-800 dark:bg-slate-900"
                        />
                        {errors.deadline && (
                            <p className="text-xs font-semibold text-red-500">
                                {errors.deadline}
                            </p>
                        )}
                    </div>

                    <div className="flex justify-end gap-3 border-t border-slate-100 pt-4 dark:border-slate-800/80">
                        <button
                            type="button"
                            onClick={closeModal}
                            className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-600 transition-colors hover:bg-slate-100 dark:border-slate-800 dark:text-slate-300 dark:hover:bg-slate-900"
                        >
                            Batal
                        </button>
                        <button
                            type="submit"
                            disabled={processing}
                            className="rounded-lg bg-[#3B28F6] px-5 py-2 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-[#2a1ce0] disabled:opacity-50"
                        >
                            {processing ? 'Menyimpan...' : 'Simpan'}
                        </button>
                    </div>
                </form>
            </Modal>

            {/* DELETE CONFIRM MODAL */}
            <ConfirmModal
                open={confirmDeleteId !== null}
                title="Hapus Quest"
                message="Apakah Anda yakin ingin menghapus quest ini? Semua penawaran (bids) dari siswa pada quest ini juga akan dihapus permanen."
                onConfirm={executeDelete}
                onClose={() => setConfirmDeleteId(null)}
            />
        </AppLayout>
    );
}
