import { Head, Link, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import {
    AlertTriangle,
    CheckCircle2,
    Clock,
    Eye,
    Flag,
    Search,
    ShieldAlert,
    User,
    XCircle,
    ChevronRight,
} from 'lucide-react';
import React, { useState } from 'react';
import Modal from '@/components/ui/Modal';

interface QuestFlagItem {
    _id: string;
    reason: string;
    details?: string;
    status: 'pending' | 'resolved' | 'dismissed';
    action_taken?: string;
    created_at: string;
    reporter?: {
        name: string;
        email: string;
    } | null;
    reported_user?: {
        name: string;
    } | null;
    quest?: {
        _id: string;
        id: string;
        slug: string;
        title: string;
    } | null;
}

interface Props {
    flags: QuestFlagItem[];
}

export default function Flags({ flags }: Props) {
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState<string>('all');
    const [selectedFlag, setSelectedFlag] = useState<QuestFlagItem | null>(null);
    const [actionTaken, setActionTaken] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const filteredFlags = flags.filter((flag) => {
        const matchesSearch =
            (flag.quest?.title || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
            (flag.reporter?.name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
            (flag.reason || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
            (flag.details || '').toLowerCase().includes(searchQuery.toLowerCase());

        const matchesStatus =
            statusFilter === 'all' || flag.status === statusFilter;

        return matchesSearch && matchesStatus;
    });

    const pendingCount = flags.filter((f) => f.status === 'pending').length;
    const resolvedCount = flags.filter((f) => f.status === 'resolved').length;

    const handleResolve = (flagId: string) => {
        if (!actionTaken.trim()) return;

        setIsSubmitting(true);
        router.post(
            `/admin/quests-flags/${flagId}/resolve`,
            { action_taken: actionTaken },
            {
                onFinish: () => {
                    setIsSubmitting(false);
                    setSelectedFlag(null);
                    setActionTaken('');
                },
            }
        );
    };

    return (
        <AppLayout>
            <Head title="Antrean Moderasi Laporan Quest - Admin" />

            <div className="space-y-6 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-zinc-200 dark:border-zinc-800 pb-5">
                    <div>
                        <div className="flex items-center gap-2">
                            <span className="p-2 rounded-xl bg-amber-500/10 text-amber-500 border border-amber-500/20">
                                <Flag className="w-5 h-5" />
                            </span>
                            <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">
                                Antrean Laporan Moderasi Quest
                            </h1>
                        </div>
                        <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
                            Tinjau laporan dugaan kecurangan, spam, atau konten tidak pantas yang dilaporkan oleh pengguna bursa lowongan.
                        </p>
                    </div>

                    <div className="flex items-center gap-3">
                        <Link
                            href="/admin/quests"
                            className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-zinc-700 dark:text-zinc-300 bg-white dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 rounded-xl hover:bg-zinc-50 dark:hover:bg-zinc-700/50 transition-colors shadow-xs"
                        >
                            Kembali ke Daftar Quest
                        </Link>
                    </div>
                </div>

                {/* Metrics Stats */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="p-4 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-xs flex items-center justify-between">
                        <div>
                            <p className="text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                                Total Laporan
                            </p>
                            <p className="text-2xl font-bold text-zinc-900 dark:text-zinc-100 mt-1">
                                {flags.length}
                            </p>
                        </div>
                        <div className="p-3 bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 rounded-xl">
                            <ShieldAlert className="w-6 h-6" />
                        </div>
                    </div>

                    <div className="p-4 rounded-2xl bg-white dark:bg-zinc-900 border border-amber-500/30 shadow-xs flex items-center justify-between">
                        <div>
                            <p className="text-xs font-semibold uppercase tracking-wider text-amber-600 dark:text-amber-400">
                                Menunggu Tindakan
                            </p>
                            <p className="text-2xl font-bold text-amber-600 dark:text-amber-400 mt-1">
                                {pendingCount}
                            </p>
                        </div>
                        <div className="p-3 bg-amber-500/10 text-amber-500 rounded-xl">
                            <Clock className="w-6 h-6" />
                        </div>
                    </div>

                    <div className="p-4 rounded-2xl bg-white dark:bg-zinc-900 border border-emerald-500/30 shadow-xs flex items-center justify-between">
                        <div>
                            <p className="text-xs font-semibold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                                Selesai / Ditangani
                            </p>
                            <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400 mt-1">
                                {resolvedCount}
                            </p>
                        </div>
                        <div className="p-3 bg-emerald-500/10 text-emerald-500 rounded-xl">
                            <CheckCircle2 className="w-6 h-6" />
                        </div>
                    </div>
                </div>

                {/* Filters & Search */}
                <div className="flex flex-col sm:flex-row gap-3 items-center justify-between bg-white dark:bg-zinc-900 p-4 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-xs">
                    <div className="relative w-full sm:w-80">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                        <input
                            type="text"
                            placeholder="Cari laporan atau quest..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-9 pr-4 py-2 text-sm bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-200 dark:border-zinc-700/60 rounded-xl text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all"
                        />
                    </div>

                    <div className="flex items-center gap-2 w-full sm:w-auto">
                        {(['all', 'pending', 'resolved'] as const).map((st) => (
                            <button
                                key={st}
                                onClick={() => setStatusFilter(st)}
                                className={`px-3 py-1.5 text-xs font-medium rounded-lg capitalize transition-all ${
                                    statusFilter === st
                                        ? 'bg-amber-500 text-white shadow-xs'
                                        : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-700'
                                }`}
                            >
                                {st === 'all'
                                    ? 'Semua Status'
                                    : st === 'pending'
                                      ? 'Menunggu'
                                      : 'Selesai'}
                            </button>
                        ))}
                    </div>
                </div>

                {/* List Table / Cards */}
                {filteredFlags.length === 0 ? (
                    <div className="text-center py-16 bg-white dark:bg-zinc-900 rounded-2xl border border-dashed border-zinc-300 dark:border-zinc-800">
                        <ShieldAlert className="w-12 h-12 text-zinc-400 mx-auto mb-3" />
                        <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
                            Tidak Ada Laporan
                        </h3>
                        <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1 max-w-sm mx-auto">
                            Tidak ditemukan laporan moderasi yang cocok dengan kriteria pencarian atau status yang dipilih.
                        </p>
                    </div>
                ) : (
                    <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-xs overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-sm text-zinc-600 dark:text-zinc-400">
                                <thead className="bg-zinc-50 dark:bg-zinc-800/50 text-xs uppercase font-semibold text-zinc-500 dark:text-zinc-400 border-b border-zinc-200 dark:border-zinc-800">
                                    <tr>
                                        <th className="py-3.5 px-4">Quest / Lowongan</th>
                                        <th className="py-3.5 px-4">Pelapor</th>
                                        <th className="py-3.5 px-4">Alasan & Rincian</th>
                                        <th className="py-3.5 px-4">Status</th>
                                        <th className="py-3.5 px-4">Tanggal</th>
                                        <th className="py-3.5 px-4 text-right">Aksi</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800">
                                    {filteredFlags.map((flag) => (
                                        <tr
                                            key={flag._id}
                                            className="hover:bg-zinc-50/50 dark:hover:bg-zinc-800/30 transition-colors"
                                        >
                                            <td className="py-4 px-4 font-medium text-zinc-900 dark:text-zinc-100 max-w-xs">
                                                {flag.quest ? (
                                                    <Link
                                                        href={`/admin/quests/${flag.quest.slug || flag.quest.id || flag.quest._id}`}
                                                        className="hover:text-amber-500 transition-colors line-clamp-1 flex items-center gap-1.5"
                                                    >
                                                        <span>{flag.quest.title}</span>
                                                        <ChevronRight className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
                                                    </Link>
                                                ) : (
                                                    <span className="text-zinc-400 italic">
                                                        Quest Dihapus
                                                    </span>
                                                )}
                                                {flag.reported_user && (
                                                    <p className="text-xs text-zinc-400 font-normal mt-0.5">
                                                        Pembuat: {flag.reported_user.name}
                                                    </p>
                                                )}
                                            </td>

                                            <td className="py-4 px-4">
                                                <div className="flex items-center gap-2">
                                                    <div className="w-7 h-7 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-zinc-600 dark:text-zinc-400 text-xs font-bold">
                                                        {flag.reporter?.name?.charAt(0) || 'U'}
                                                    </div>
                                                    <div>
                                                        <p className="text-xs font-semibold text-zinc-900 dark:text-zinc-100">
                                                            {flag.reporter?.name || 'Anonim'}
                                                        </p>
                                                        <p className="text-[11px] text-zinc-400">
                                                            {flag.reporter?.email || '-'}
                                                        </p>
                                                    </div>
                                                </div>
                                            </td>

                                            <td className="py-4 px-4 max-w-sm">
                                                <span className="inline-block px-2 py-0.5 text-xs font-semibold rounded bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 mb-1">
                                                    {flag.reason}
                                                </span>
                                                {flag.details && (
                                                    <p className="text-xs text-zinc-600 dark:text-zinc-300 line-clamp-2">
                                                        {flag.details}
                                                    </p>
                                                )}
                                            </td>

                                            <td className="py-4 px-4">
                                                {flag.status === 'pending' ? (
                                                    <span className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
                                                        <Clock className="w-3 h-3" /> Menunggu
                                                    </span>
                                                ) : (
                                                    <span className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                                                        <CheckCircle2 className="w-3 h-3" /> Ditangani
                                                    </span>
                                                )}
                                                {flag.action_taken && (
                                                    <p className="text-[11px] text-zinc-400 mt-1 line-clamp-1 italic">
                                                        Aksi: {flag.action_taken}
                                                    </p>
                                                )}
                                            </td>

                                            <td className="py-4 px-4 text-xs text-zinc-400">
                                                {new Date(flag.created_at).toLocaleDateString('id-ID', {
                                                    day: 'numeric',
                                                    month: 'short',
                                                    year: 'numeric',
                                                })}
                                            </td>

                                            <td className="py-4 px-4 text-right">
                                                {flag.status === 'pending' ? (
                                                    <button
                                                        onClick={() => {
                                                            setSelectedFlag(flag);
                                                            setActionTaken('');
                                                        }}
                                                        className="px-3 py-1.5 text-xs font-semibold bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition-colors shadow-xs"
                                                    >
                                                        Tindak Lanjuti
                                                    </button>
                                                ) : (
                                                    <button
                                                        onClick={() => setSelectedFlag(flag)}
                                                        className="px-3 py-1.5 text-xs font-medium text-zinc-600 dark:text-zinc-400 bg-zinc-100 dark:bg-zinc-800 rounded-lg hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors"
                                                    >
                                                        Detail
                                                    </button>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </div>

            {/* Resolve / Details Modal */}
            {selectedFlag && (
                <Modal
                    open={!!selectedFlag}
                    onClose={() => setSelectedFlag(null)}
                    title={
                        selectedFlag.status === 'pending'
                            ? 'Tindak Lanjuti Laporan Moderasi'
                            : 'Rincian Laporan Moderasi'
                    }
                >
                    <div className="space-y-4 text-sm text-zinc-700 dark:text-zinc-300">
                        <div className="p-3.5 rounded-xl bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-200 dark:border-zinc-700/60 space-y-2">
                            <div>
                                <span className="text-xs text-zinc-400 block">Quest yang Dilaporkan:</span>
                                <span className="font-semibold text-zinc-900 dark:text-zinc-100">
                                    {selectedFlag.quest?.title || 'Quest telah dihapus'}
                                </span>
                            </div>
                            <div className="grid grid-cols-2 gap-2 pt-1 border-t border-zinc-200 dark:border-zinc-700/50">
                                <div>
                                    <span className="text-xs text-zinc-400 block">Pelapor:</span>
                                    <span className="font-medium text-zinc-800 dark:text-zinc-200">
                                        {selectedFlag.reporter?.name} ({selectedFlag.reporter?.email})
                                    </span>
                                </div>
                                <div>
                                    <span className="text-xs text-zinc-400 block">Alasan Laporan:</span>
                                    <span className="font-medium text-amber-600 dark:text-amber-400">
                                        {selectedFlag.reason}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {selectedFlag.details && (
                            <div>
                                <label className="text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 block mb-1">
                                    Rincian Tambahan dari Pelapor:
                                </label>
                                <div className="p-3 bg-zinc-100 dark:bg-zinc-800/80 rounded-xl text-zinc-800 dark:text-zinc-200 text-xs whitespace-pre-wrap">
                                    {selectedFlag.details}
                                </div>
                            </div>
                        )}

                        {selectedFlag.status === 'pending' ? (
                            <div className="space-y-2 pt-2">
                                <label className="text-xs font-semibold uppercase tracking-wider text-zinc-700 dark:text-zinc-300 block">
                                    Catatan Tindakan Admin:
                                </label>
                                <textarea
                                    value={actionTaken}
                                    onChange={(e) => setActionTaken(e.target.value)}
                                    placeholder="Contoh: Lowongan telah diperiksa dan dinyatakan aman / Lowongan telah diturunkan karena melanggar syarat bursa."
                                    rows={3}
                                    className="w-full px-3.5 py-2.5 text-sm bg-white dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 rounded-xl text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
                                />
                                <div className="flex gap-2 justify-end pt-3">
                                    <button
                                        type="button"
                                        onClick={() => setSelectedFlag(null)}
                                        className="px-4 py-2 text-sm text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-xl transition-colors"
                                    >
                                        Batal
                                    </button>
                                    <button
                                        type="button"
                                        disabled={!actionTaken.trim() || isSubmitting}
                                        onClick={() => handleResolve(selectedFlag._id)}
                                        className="px-4 py-2 text-sm font-semibold bg-amber-500 hover:bg-amber-600 text-white rounded-xl disabled:opacity-50 transition-colors shadow-xs"
                                    >
                                        {isSubmitting ? 'Menyimpan...' : 'Selesaikan Laporan'}
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-emerald-700 dark:text-emerald-300 text-xs">
                                <span className="font-semibold block mb-0.5">Tindakan Admin:</span>
                                {selectedFlag.action_taken || 'Laporan telah ditandai selesai.'}
                            </div>
                        )}
                    </div>
                </Modal>
            )}
        </AppLayout>
    );
}
