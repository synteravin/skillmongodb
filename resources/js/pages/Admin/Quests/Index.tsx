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
    const [statusFilter, setStatusFilter] = useState<'all' | 'draft' | 'open' | 'rejected' | 'ongoing' | 'completed'>('all');

    const filteredQuests = quests.filter((quest) => {
        const matchesSearch =
            quest.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            quest.description.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesStatus =
            statusFilter === 'all' || quest.status === statusFilter;
        return matchesSearch && matchesStatus;
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
        return new Intl.NumberFormat("id-ID", {
            style: "currency",
            currency: "IDR",
            minimumFractionDigits: 0,
        }).format(num);
    };

    const formatDate = (dateStr: string) => {
        return new Date(dateStr).toLocaleDateString("id-ID", {
            year: "numeric",
            month: "long",
            day: "numeric",
        });
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
                                    Kelola lowongan pekerjaan freelance, moderasi penawaran masuk dari siswa, dan pantau proyek yang berjalan.
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
                    <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-white dark:bg-[#0d1117] border border-slate-200/80 dark:border-slate-800 p-4 rounded-xl shadow-sm">
                        <div className="relative w-full md:w-80">
                            <input
                                type="text"
                                placeholder="Cari judul atau deskripsi..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 border border-slate-200 dark:border-slate-800 rounded-lg bg-slate-50 dark:bg-slate-900 focus:outline-none focus:border-indigo-500 text-sm"
                            />
                            <Search className="absolute left-3 top-2.5 w-4.5 h-4.5 text-slate-400" />
                        </div>

                        <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto pb-1 md:pb-0">
                            {['all', 'draft', 'open', 'rejected', 'ongoing', 'completed'].map((statusOption) => (
                                <button
                                    key={statusOption}
                                    type="button"
                                    onClick={() => setStatusFilter(statusOption as any)}
                                    className={`px-4 py-1.5 rounded-lg text-xs font-semibold uppercase tracking-wider border transition-all ${
                                        statusFilter === statusOption
                                            ? "bg-indigo-600 border-indigo-500 text-white shadow-sm"
                                            : "bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100"
                                    }`}
                                >
                                    {statusOption === 'all'
                                        ? "Semua"
                                        : statusOption === 'draft'
                                        ? "Draft"
                                        : statusOption === 'open'
                                        ? "Tersedia"
                                        : statusOption === 'rejected'
                                        ? "Ditolak"
                                        : statusOption === 'ongoing'
                                        ? "Berjalan"
                                        : "Selesai"}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* QUEST TABLE */}
                    <div className="bg-white dark:bg-[#0d1117] border border-slate-200/80 dark:border-slate-800 rounded-xl shadow-sm overflow-hidden">
                        {filteredQuests.length === 0 ? (
                            <div className="py-20 text-center text-slate-500">
                                <Briefcase className="w-12 h-12 mx-auto text-slate-300 mb-3" />
                                <p className="font-semibold text-base">Tidak ada Quest yang ditemukan</p>
                                <p className="text-sm text-slate-400 mt-1">Coba sesuaikan filter atau tambahkan quest baru.</p>
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="w-full text-left border-collapse">
                                    <thead>
                                        <tr className="border-b border-slate-200/80 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 text-xs font-bold uppercase tracking-wider text-slate-500">
                                            <th className="px-6 py-4">Quest</th>
                                            <th className="px-6 py-4">Gaji</th>
                                            <th className="px-6 py-4">Deadline</th>
                                            <th className="px-6 py-4">Pembuat</th>
                                            <th className="px-6 py-4">Pekerja</th>
                                            <th className="px-6 py-4">Bids</th>
                                            <th className="px-6 py-4">Status</th>
                                            <th className="px-6 py-4 text-right">Aksi</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-200/60 dark:divide-slate-800/60 text-sm">
                                        {filteredQuests.map((quest) => (
                                            <tr key={quest._id} className="hover:bg-slate-50/50 dark:hover:bg-slate-900/30 transition-colors">
                                                <td className="px-6 py-4">
                                                    <span className="font-bold text-slate-900 dark:text-white block truncate max-w-xs">{quest.title}</span>
                                                    <span className="text-xs text-slate-400 line-clamp-1 max-w-xs">{quest.description}</span>
                                                </td>
                                                <td className="px-6 py-4 font-semibold text-slate-700 dark:text-slate-300">
                                                    {formatCurrency(quest.min_salary)} - {formatCurrency(quest.max_salary)}
                                                </td>
                                                <td className="px-6 py-4 text-slate-500 dark:text-slate-400">
                                                    {formatDate(quest.deadline)}
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span className="font-medium">{quest.creator.name}</span>
                                                    <span className="block text-[10px] text-slate-400 capitalize">{quest.creator.role}</span>
                                                </td>
                                                <td className="px-6 py-4 text-slate-600 dark:text-slate-300 font-medium">
                                                    {quest.worker ? quest.worker.name : <span className="text-slate-400 italic">Belum Ada</span>}
                                                </td>
                                                <td className="px-6 py-4 font-bold text-indigo-600 dark:text-indigo-400">
                                                    {quest.bids_count} Bid
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span
                                                        className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                                                            quest.status === "open"
                                                                ? "bg-green-100 text-green-700 dark:bg-green-950/40 dark:text-green-400"
                                                                : quest.status === "draft"
                                                                ? "bg-amber-100 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400"
                                                                : quest.status === "rejected"
                                                                ? "bg-red-105 text-red-700 dark:bg-red-955/40 dark:text-red-400"
                                                                : quest.status === "ongoing"
                                                                ? "bg-blue-100 text-blue-700 dark:bg-blue-950/40 dark:text-blue-400"
                                                                : "bg-slate-100 text-slate-600 dark:bg-slate-900/60 dark:text-slate-400"
                                                        }`}
                                                    >
                                                        {quest.status === "open"
                                                            ? "Tersedia"
                                                            : quest.status === "draft"
                                                            ? "Draft / Pending"
                                                            : quest.status === "rejected"
                                                            ? "Ditolak"
                                                            : quest.status === "ongoing"
                                                            ? "Berjalan"
                                                            : "Selesai"}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 text-right">
                                                    <div className="flex justify-end gap-2">
                                                        <Link
                                                            href={`/admin/quests/${quest._id}`}
                                                            title="Detail & Bid"
                                                            className="p-1.5 text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                                                        >
                                                            <Eye size={16} />
                                                        </Link>
                                                        <button
                                                            onClick={() => openEdit(quest)}
                                                            title="Edit"
                                                            className="p-1.5 text-slate-400 hover:text-amber-600 dark:hover:text-amber-400 transition-colors"
                                                        >
                                                            <Pencil size={16} />
                                                        </button>
                                                        <button
                                                            onClick={() => handleDelete(quest._id)}
                                                            title="Delete"
                                                            className="p-1.5 text-slate-400 hover:text-red-600 transition-colors"
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
                        <div className="p-3 bg-red-500/10 border border-red-500/20 text-red-500 rounded-lg text-xs font-semibold mb-4">
                            Terdapat kesalahan:
                            <ul className="list-disc list-inside mt-1 font-normal space-y-0.5">
                                {Object.entries(errors).map(([key, val]) => (
                                    <li key={key}>{val}</li>
                                ))}
                            </ul>
                        </div>
                    )}

                    <div className="space-y-1">
                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider">Judul Quest</label>
                        <input
                            type="text"
                            value={data.title}
                            onChange={(e) => setData('title', e.target.value)}
                            className="w-full px-3 py-2 border border-slate-200 dark:border-slate-800 rounded-lg bg-slate-50 dark:bg-slate-900 focus:outline-none focus:border-indigo-500 text-sm"
                            placeholder="Contoh: Membuat Logo Vector untuk Landing Page"
                        />
                        {errors.title && <p className="text-xs text-red-500 font-semibold">{errors.title}</p>}
                    </div>

                    <div className="space-y-1">
                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider">Deskripsi Pekerjaan</label>
                        <textarea
                            value={data.description}
                            onChange={(e) => setData('description', e.target.value)}
                            className="w-full px-3 py-2 border border-slate-200 dark:border-slate-800 rounded-lg bg-slate-50 dark:bg-slate-900 focus:outline-none focus:border-indigo-500 text-sm"
                            rows={4}
                            placeholder="Jelaskan spesifikasi teknis dan kriteria pekerjaan..."
                        />
                        {errors.description && <p className="text-xs text-red-500 font-semibold">{errors.description}</p>}
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider">Gaji Min (Rp)</label>
                            <input
                                type="number"
                                value={data.min_salary}
                                onChange={(e) => setData('min_salary', e.target.value)}
                                className="w-full px-3 py-2 border border-slate-200 dark:border-slate-800 rounded-lg bg-slate-50 dark:bg-slate-950 focus:outline-none focus:border-indigo-500 text-sm"
                                placeholder="Contoh: 1000000"
                            />
                            {errors.min_salary && <p className="text-xs text-red-500 font-semibold">{errors.min_salary}</p>}
                        </div>

                        <div className="space-y-1">
                            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider">Gaji Max (Rp)</label>
                            <input
                                type="number"
                                value={data.max_salary}
                                onChange={(e) => setData('max_salary', e.target.value)}
                                className="w-full px-3 py-2 border border-slate-200 dark:border-slate-800 rounded-lg bg-slate-50 dark:bg-slate-950 focus:outline-none focus:border-indigo-500 text-sm"
                                placeholder="Contoh: 2500000"
                            />
                            {errors.max_salary && <p className="text-xs text-red-500 font-semibold">{errors.max_salary}</p>}
                        </div>
                    </div>

                    <div className="space-y-1">
                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider">Deadline</label>
                        <input
                            type="date"
                            value={data.deadline}
                            onChange={(e) => setData('deadline', e.target.value)}
                            className="w-full px-3 py-2 border border-slate-200 dark:border-slate-800 rounded-lg bg-slate-50 dark:bg-slate-900 focus:outline-none focus:border-indigo-500 text-sm"
                        />
                        {errors.deadline && <p className="text-xs text-red-500 font-semibold">{errors.deadline}</p>}
                    </div>

                    <div className="flex justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800/80">
                        <button
                            type="button"
                            onClick={closeModal}
                            className="px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-800 font-semibold text-sm hover:bg-slate-100 dark:hover:bg-slate-900 text-slate-600 dark:text-slate-300 transition-colors"
                        >
                            Batal
                        </button>
                        <button
                            type="submit"
                            disabled={processing}
                            className="px-5 py-2 rounded-lg bg-[#3B28F6] hover:bg-[#2a1ce0] text-white font-semibold text-sm shadow-sm transition-colors disabled:opacity-50"
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
