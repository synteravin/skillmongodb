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
} from 'lucide-react';
import React, { useState } from 'react';
import Modal from '@/components/ui/Modal';
import ConfirmModal from '@/components/ui/ConfirmModal';

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
    worker?: {
        name: string;
    } | null;
    bids_count: number;
}

interface Props {
    quests: Quest[];
}

export default function Index({ quests }: Props) {
    const [openModal, setOpenModal] = useState<'create' | 'edit' | null>(null);
    const [editingQuest, setEditingQuest] = useState<Quest | null>(null);
    const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState<
        'all' | 'draft' | 'open' | 'rejected' | 'ongoing' | 'completed'
    >('all');
    const [sortBy, setSortBy] = useState<
        'latest' | 'highest_salary' | 'closest_deadline'
    >('latest');

    const filteredQuests = quests.filter((quest) => {
        const matchesSearch =
            quest.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            quest.description.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesStatus =
            statusFilter === 'all' || quest.status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    const sortedFilteredQuests = [...filteredQuests].sort((a, b) => {
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
                    <div className="relative overflow-hidden rounded-xl border border-slate-200/80 bg-[#f5f6ff] p-6 shadow-sm sm:p-8 md:p-10 dark:border-slate-800 dark:bg-[#0d0f17]">
                        {/* Grid Pattern Motif */}
                        <div
                            className="pointer-events-none absolute inset-0 z-0"
                            style={{
                                backgroundImage: `
                                    linear-gradient(rgba(59, 40, 246, 0.07) 1px, transparent 1px),
                                    linear-gradient(90deg, rgba(59, 40, 246, 0.07) 1px, transparent 1px)
                                `,
                                backgroundSize: '40px 40px',
                            }}
                        />

                        <div className="absolute top-0 right-8 left-8 z-0 h-px bg-gradient-to-r from-transparent via-slate-300 to-transparent dark:via-slate-700" />

                        <div className="relative z-10 flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
                            <div className="max-w-2xl space-y-3">
                                <span className="inline-block text-[0.6rem] font-semibold tracking-[0.2em] text-slate-500 uppercase dark:text-slate-500">
                                    Freelance Platform
                                </span>
                                <h1 className="text-2xl leading-snug font-semibold tracking-tight text-slate-800 md:text-[28px] dark:text-white">
                                    Quest Management (Freelance)
                                </h1>
                                <p className="text-sm leading-relaxed text-slate-500 md:text-[15px] dark:text-slate-400/60">
                                    Kelola lowongan pekerjaan freelance,
                                    moderasi penawaran masuk dari siswa, dan
                                    pantau proyek yang berjalan.
                                </p>
                            </div>

                            <button
                                onClick={openCreate}
                                className="relative z-10 inline-flex shrink-0 items-center gap-2 rounded-xl bg-[#3B28F6] px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-[#2a1ce0]"
                            >
                                <Plus size={18} />
                                Buat Quest Baru
                            </button>
                        </div>
                    </div>

                    {/* FILTERS & SEARCH */}
                    <div className="flex flex-col items-center justify-between gap-4 rounded-xl border border-slate-200/80 bg-white p-4 shadow-sm md:flex-row dark:border-slate-800 dark:bg-[#0d1117]">
                        <div className="flex w-full flex-col items-center gap-3 sm:flex-row md:w-auto">
                            <div className="relative w-full sm:w-64 md:w-80">
                                <input
                                    type="text"
                                    placeholder="Cari judul atau deskripsi..."
                                    value={searchQuery}
                                    onChange={(e) =>
                                        setSearchQuery(e.target.value)
                                    }
                                    className="w-full rounded-lg border border-slate-200 bg-slate-50 py-2 pr-4 pl-10 text-sm focus:border-indigo-500 focus:outline-none dark:border-slate-800 dark:bg-slate-900"
                                />
                                <Search className="absolute top-2.5 left-3 h-4.5 w-4.5 text-slate-400" />
                            </div>

                            {/* Sort Selector */}
                            <select
                                value={sortBy}
                                onChange={(e) =>
                                    setSortBy(e.target.value as any)
                                }
                                className="dark:text-slate-350 w-full cursor-pointer rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-semibold text-slate-600 uppercase focus:border-indigo-500 focus:outline-none sm:w-44 dark:border-slate-800 dark:bg-slate-900"
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

                        <div className="flex w-full items-center gap-2 overflow-x-auto pb-1 md:w-auto md:pb-0">
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
                                    className={`rounded-lg border px-4 py-1.5 text-xs font-semibold tracking-wider uppercase transition-all ${
                                        statusFilter === statusOption
                                            ? 'border-indigo-500 bg-indigo-600 text-white shadow-sm'
                                            : 'border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300'
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

                    {/* QUEST TABLE */}
                    <div className="overflow-hidden rounded-xl border border-slate-200/80 bg-white shadow-sm dark:border-slate-800 dark:bg-[#0d1117]">
                        {sortedFilteredQuests.length === 0 ? (
                            <div className="py-20 text-center text-slate-500">
                                <Briefcase className="mx-auto mb-3 h-12 w-12 text-slate-300" />
                                <p className="text-base font-semibold">
                                    Tidak ada Quest yang ditemukan
                                </p>
                                <p className="mt-1 text-sm text-slate-400">
                                    Coba sesuaikan filter atau tambahkan quest
                                    baru.
                                </p>
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="w-full border-collapse text-left">
                                    <thead>
                                        <tr className="border-b border-slate-200/80 bg-slate-50 text-xs font-bold tracking-wider text-slate-500 uppercase dark:border-slate-800 dark:bg-slate-900/50">
                                            <th className="px-6 py-4">Quest</th>
                                            <th className="px-6 py-4">Gaji</th>
                                            <th className="px-6 py-4">
                                                Deadline
                                            </th>
                                            <th className="px-6 py-4">
                                                Pembuat
                                            </th>
                                            <th className="px-6 py-4">
                                                Pekerja
                                            </th>
                                            <th className="px-6 py-4">Bids</th>
                                            <th className="px-6 py-4">
                                                Status
                                            </th>
                                            <th className="px-6 py-4 text-right">
                                                Aksi
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-200/60 text-sm dark:divide-slate-800/60">
                                        {sortedFilteredQuests.map((quest) => (
                                            <tr
                                                key={quest._id}
                                                className="transition-colors hover:bg-slate-50/50 dark:hover:bg-slate-900/30"
                                            >
                                                <td className="px-6 py-4">
                                                    <span className="block max-w-xs truncate font-bold text-slate-900 dark:text-white">
                                                        {quest.title}
                                                    </span>
                                                    <span className="line-clamp-1 max-w-xs text-xs text-slate-400">
                                                        {quest.description}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 font-semibold text-slate-700 dark:text-slate-300">
                                                    {formatCurrency(
                                                        quest.min_salary,
                                                    )}{' '}
                                                    -{' '}
                                                    {formatCurrency(
                                                        quest.max_salary,
                                                    )}
                                                </td>
                                                <td className="px-6 py-4 text-slate-500 dark:text-slate-400">
                                                    {formatDate(quest.deadline)}
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span className="font-medium">
                                                        {quest.creator.name}
                                                    </span>
                                                    <span className="block text-[10px] text-slate-400 capitalize">
                                                        {quest.creator.role}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 font-medium text-slate-600 dark:text-slate-300">
                                                    {quest.worker ? (
                                                        quest.worker.name
                                                    ) : (
                                                        <span className="text-slate-400 italic">
                                                            Belum Ada
                                                        </span>
                                                    )}
                                                </td>
                                                <td className="px-6 py-4 font-bold text-indigo-600 dark:text-indigo-400">
                                                    {quest.bids_count} Bid
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span
                                                        className={`inline-block rounded-full px-2.5 py-0.5 text-[10px] font-bold tracking-wider uppercase ${
                                                            quest.status ===
                                                            'open'
                                                                ? 'bg-green-100 text-green-700 dark:bg-green-950/40 dark:text-green-400'
                                                                : quest.status ===
                                                                    'draft'
                                                                  ? 'bg-amber-100 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400'
                                                                  : quest.status ===
                                                                      'rejected'
                                                                    ? 'bg-red-105 dark:bg-red-955/40 text-red-700 dark:text-red-400'
                                                                    : quest.status ===
                                                                        'expired'
                                                                      ? 'bg-red-100 text-red-700 dark:bg-red-950/40 dark:text-red-400'
                                                                      : quest.status ===
                                                                          'ongoing'
                                                                        ? 'bg-blue-100 text-blue-700 dark:bg-blue-950/40 dark:text-blue-400'
                                                                        : 'bg-slate-100 text-slate-600 dark:bg-slate-900/60 dark:text-slate-400'
                                                        }`}
                                                    >
                                                        {quest.status === 'open'
                                                            ? 'Tersedia'
                                                            : quest.status ===
                                                                'draft'
                                                              ? 'Draft / Pending'
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
                                                <td className="px-6 py-4 text-right">
                                                    <div className="flex justify-end gap-2">
                                                        <Link
                                                            href={`/admin/quests/${quest._id}`}
                                                            title="Detail & Bid"
                                                            className="p-1.5 text-slate-400 transition-colors hover:text-indigo-600 dark:hover:text-indigo-400"
                                                        >
                                                            <Eye size={16} />
                                                        </Link>
                                                        <button
                                                            onClick={() =>
                                                                openEdit(quest)
                                                            }
                                                            title="Edit"
                                                            className="p-1.5 text-slate-400 transition-colors hover:text-amber-600 dark:hover:text-amber-400"
                                                        >
                                                            <Pencil size={16} />
                                                        </button>
                                                        <button
                                                            onClick={() =>
                                                                handleDelete(
                                                                    quest._id,
                                                                )
                                                            }
                                                            title="Delete"
                                                            className="p-1.5 text-slate-400 transition-colors hover:text-red-600"
                                                        >
                                                            <Trash2 size={16} />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
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
