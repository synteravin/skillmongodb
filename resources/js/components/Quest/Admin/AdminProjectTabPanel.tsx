import React from 'react';
import { MessageSquare, Briefcase, FileArchive, Download, Star, Check, FileImage } from 'lucide-react';
import { Quest, Bid } from '@/types/quest';
import RevisionHistory from '@/components/Quest/RevisionHistory';

interface AdminProjectTabPanelProps {
    quest: Quest;
    bids: Bid[];
    setSelectedChatBid: (bid: { id: string; name: string } | null) => void;
    formatBytes: (bytes: number) => string;
    showApproveForm: boolean;
    setShowApproveForm: (show: boolean) => void;
    showRejectForm: boolean;
    setShowRejectForm: (show: boolean) => void;
    approveForm: any;
    rejectForm: any;
    handleApproveWork: (e: React.FormEvent) => void;
    handleRejectWork: (e: React.FormEvent) => void;
}

export default function AdminProjectTabPanel({
    quest,
    bids,
    setSelectedChatBid,
    formatBytes,
    showApproveForm,
    setShowApproveForm,
    showRejectForm,
    setShowRejectForm,
    approveForm,
    rejectForm,
    handleApproveWork,
    handleRejectWork,
}: AdminProjectTabPanelProps) {
    return (
        <div className="relative overflow-hidden space-y-5 rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-gradient-to-b dark:from-[#0e0e1a] dark:to-[#090910]">
            <div className="absolute top-0 right-8 left-8 h-px bg-gradient-to-r from-transparent via-slate-300 to-transparent dark:via-slate-700" />
            <div className="flex items-center justify-between border-b border-slate-200 pb-3 dark:border-slate-800">
                <h3 className="text-sm font-extrabold tracking-wider text-slate-900 uppercase dark:text-white">
                    Alur Kerja & Status Penyelesaian
                </h3>

                {/* Worker chat shortcut */}
                {quest.worker &&
                    (() => {
                        const acceptedBid = bids.find(
                            (b) =>
                                b.status === 'accepted' ||
                                b.student._id === quest.worker_id,
                        );
                        if (acceptedBid) {
                            return (
                                <button
                                    onClick={() =>
                                        setSelectedChatBid({
                                            id: acceptedBid._id,
                                            name: quest.worker?.name ?? '',
                                        })
                                    }
                                    className="relative flex shrink-0 cursor-pointer items-center gap-1.5 rounded-lg bg-indigo-600 px-3.5 py-1.5 text-xs font-bold text-white uppercase shadow-sm transition-all hover:bg-indigo-700"
                                >
                                    <MessageSquare size={14} />
                                    Chat Pekerja
                                    {acceptedBid.unread_messages_count > 0 && (
                                        <span className="absolute -top-1 -right-1 flex h-4 w-4 animate-pulse items-center justify-center rounded-full bg-red-500 text-[8px] font-black text-white ring-2 ring-white dark:ring-slate-900">
                                            {acceptedBid.unread_messages_count}
                                        </span>
                                    )}
                                </button>
                            );
                        }
                        return null;
                    })()}
            </div>

            {quest.worker ? (
                <div className="flex flex-col justify-between gap-4 rounded-xl border border-slate-300 bg-slate-50/70 p-4 sm:flex-row sm:items-center dark:border-slate-800 dark:bg-[#030712]">
                    <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-indigo-500/30 bg-indigo-500/10 font-bold text-indigo-600 dark:text-indigo-400">
                            {quest.worker.name.substring(0, 2).toUpperCase()}
                        </div>
                        <div>
                            <span className="block text-[9px] font-bold tracking-wider text-slate-600 uppercase dark:text-slate-400">
                                Pekerja Ditugaskan
                            </span>
                            <span className="text-sm font-extrabold text-slate-900 dark:text-white">
                                {quest.worker.name}
                            </span>
                            <span className="block text-xs font-semibold text-slate-600 dark:text-slate-400">
                                {quest.worker.email}
                            </span>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="py-6 text-center text-slate-500 dark:text-slate-400">
                    <Briefcase className="mx-auto mb-2 h-8 w-8 text-indigo-500 opacity-60" />
                    <p className="text-xs font-extrabold uppercase text-slate-800 dark:text-slate-300">
                        Belum ada pekerja ditunjuk.
                    </p>
                    <p className="text-[11px] font-semibold text-slate-600 dark:text-slate-400">
                        Silakan terima salah satu penawaran masuk pada tab "Pelamar" untuk memulai pengerjaan quest.
                    </p>
                </div>
            )}

            {quest.status === 'ongoing' && (
                <div className="space-y-4 border-t border-slate-200 pt-4 dark:border-slate-800">
                    <p className="text-xs font-semibold leading-relaxed text-slate-600 dark:text-slate-400">
                        Status quest ini adalah <strong className="font-bold text-slate-900 dark:text-white">Dalam Pengerjaan</strong>. Pekerja saat ini sedang menyelesaikan deskripsi tugas.
                    </p>
                    <RevisionHistory quest={quest} viewType="admin_ongoing" />
                </div>
            )}

            {quest.status === 'approved' && (
                <div className="flex flex-col gap-2 rounded-xl border border-indigo-500/30 bg-indigo-500/10 p-4 text-center">
                    <span className="block text-xs font-bold tracking-wider text-indigo-700 uppercase dark:text-indigo-300">
                        Disetujui & Menunggu Pembayaran
                    </span>
                    <p className="text-[11px] font-semibold text-slate-700 dark:text-slate-300">
                        Hasil pekerjaan disetujui. Saat ini sistem menunggu pembuat quest mengunggah bukti transfer pembayaran secara offline.
                    </p>
                </div>
            )}

            {quest.status === 'payment' && (
                <div className="space-y-4 border-t border-slate-200 pt-4 dark:border-slate-800">
                    <div className="flex flex-col gap-2 rounded-xl border border-amber-500/30 bg-amber-500/10 p-4 text-center">
                        <span className="block text-xs font-bold tracking-wider text-amber-700 uppercase dark:text-amber-300">
                            Bukti Pembayaran Diunggah & Menunggu Berkas ZIP Final
                        </span>
                        <p className="text-[11px] font-semibold text-slate-700 dark:text-slate-300">
                            Pembuat quest telah mengunggah bukti transfer pembayaran. Sistem menunggu pekerja mengirim berkas proyek final (.zip) untuk menyelesaikan quest.
                        </p>
                    </div>

                    {quest.payment_proof && (
                        <div className="rounded-xl border border-slate-300 bg-slate-50/70 p-4 text-xs dark:border-slate-800 dark:bg-[#030712]">
                            <span className="block text-[10px] font-bold text-slate-600 uppercase tracking-wider mb-2 dark:text-slate-400">
                                Bukti Transfer Pembuat
                            </span>
                            <div className="flex flex-col gap-3">
                                <div className="flex items-center justify-between gap-3">
                                    <div className="flex min-w-0 items-center gap-2">
                                        <FileImage className="h-5 w-5 shrink-0 text-indigo-600 dark:text-indigo-400" />
                                        <div className="min-w-0">
                                            <p className="truncate text-xs font-bold text-slate-900 dark:text-slate-200">
                                                {quest.payment_proof.name}
                                            </p>
                                            <p className="text-[10px] font-semibold text-slate-500 dark:text-slate-400">
                                                Diunggah pada: {quest.payment_uploaded_at ? new Date(quest.payment_uploaded_at).toLocaleDateString('id-ID', { dateStyle: 'medium' }) : ''}
                                            </p>
                                        </div>
                                    </div>
                                    <a
                                        href={quest.payment_proof.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg bg-indigo-500/10 text-indigo-600 hover:bg-indigo-500/20 dark:text-indigo-400"
                                        title="Unduh Bukti Transfer"
                                    >
                                        <Download size={16} />
                                    </a>
                                </div>
                                <div className="relative overflow-hidden rounded-lg border border-slate-300 bg-white dark:border-slate-800 dark:bg-slate-900 max-w-xs shadow-sm">
                                    <a
                                        href={quest.payment_proof.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="block group"
                                    >
                                        <img
                                            src={quest.payment_proof.url}
                                            alt="Bukti Transfer Pembayaran"
                                            className="w-full object-contain max-h-40 transition-transform duration-300 group-hover:scale-105"
                                        />
                                        <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                                            <span className="rounded bg-black/60 px-2 py-1 text-[8px] font-bold text-white uppercase tracking-wider">
                                                Perbesar Gambar 🔍
                                            </span>
                                        </div>
                                    </a>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            )}

            {quest.status === 'submitted' && (
                <div className="space-y-5 border-t border-slate-200 pt-4 dark:border-slate-800">
                    <div className="flex flex-col gap-1 rounded-xl border border-amber-500/30 bg-amber-500/10 p-4 text-center">
                        <span className="block text-xs font-bold tracking-wider text-amber-700 uppercase dark:text-amber-300">
                            Penyerahan Tugas Masuk
                        </span>
                        <p className="text-xs font-semibold leading-relaxed text-slate-700 dark:text-slate-300">
                            Pekerja telah selesai melakukan penyerahan tugas awal. Silakan review hasil pekerjaannya di bawah ini.
                        </p>
                    </div>

                    <RevisionHistory quest={quest} viewType="admin_submitted" />

                    <div className="space-y-3.5 rounded-xl border border-slate-300 bg-slate-50/70 p-4 text-xs dark:border-slate-800 dark:bg-[#030712]">
                        {quest.submission_file && (
                            <div className="space-y-1">
                                <strong className="block text-[10px] tracking-wider text-slate-600 uppercase dark:text-slate-400">
                                    Berkas Pekerjaan Utama (ZIP)
                                </strong>
                                <div className="flex items-center justify-between rounded-xl border border-amber-500/30 bg-amber-500/10 p-2.5 dark:border-amber-500/30">
                                    <div className="flex min-w-0 items-center gap-2.5">
                                        <FileArchive className="h-5 w-5 shrink-0 text-amber-600 dark:text-amber-400" />
                                        <div className="min-w-0">
                                            <p className="truncate text-xs font-bold text-slate-900 dark:text-slate-200">
                                                {quest.submission_file.name}
                                            </p>
                                            <p className="text-[10px] font-semibold text-slate-500 dark:text-slate-400">
                                                {formatBytes(quest.submission_file.size)}
                                            </p>
                                        </div>
                                    </div>
                                    <a
                                        href={quest.submission_file.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex cursor-pointer items-center justify-center rounded-lg p-1.5 text-amber-700 transition-colors hover:bg-amber-500/20 dark:text-amber-400"
                                        title="Unduh ZIP di Tab Baru"
                                    >
                                        <Download className="h-4.5 w-4.5" />
                                    </a>
                                </div>
                            </div>
                        )}

                        {quest.submission_link && (
                            <div>
                                <strong className="mb-1 block text-[10px] tracking-wider text-slate-600 uppercase dark:text-slate-400">
                                    Link Hasil Pekerjaan
                                </strong>
                                <a
                                    href={quest.submission_link}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="font-bold break-all text-indigo-600 hover:underline dark:text-indigo-400"
                                >
                                    {quest.submission_link}
                                </a>
                            </div>
                        )}

                        {quest.submission_note && (
                            <div>
                                <strong className="mb-1 block text-[10px] tracking-wider text-slate-600 uppercase dark:text-slate-400">
                                    Catatan Pekerja
                                </strong>
                                <p className="rounded-lg border border-slate-300 bg-white p-3 leading-relaxed whitespace-pre-wrap text-slate-800 dark:border-slate-800 dark:bg-[#0d0f17] dark:text-slate-200">
                                    {quest.submission_note}
                                </p>
                            </div>
                        )}
                    </div>

                    {!showApproveForm && !showRejectForm && (
                        <div className="flex gap-3 border-t border-slate-200 pt-4 dark:border-slate-800">
                            <button
                                onClick={() => setShowApproveForm(true)}
                                className="flex-1 cursor-pointer rounded-lg bg-emerald-600 py-2.5 text-xs font-bold tracking-wider text-white uppercase shadow-sm transition-colors hover:bg-emerald-700"
                            >
                                Setujui & Selesaikan
                            </button>
                            <button
                                onClick={() => setShowRejectForm(true)}
                                className="flex-1 cursor-pointer rounded-lg bg-red-600 py-2.5 text-xs font-bold tracking-wider text-white uppercase shadow-sm transition-colors hover:bg-red-700"
                            >
                                Tolak / Minta Revisi
                            </button>
                        </div>
                    )}

                    {showApproveForm && (
                        <form
                            onSubmit={handleApproveWork}
                            className="space-y-4 border-t border-slate-200 pt-4 dark:border-slate-800"
                        >
                            <h4 className="text-xs font-bold text-slate-900 uppercase dark:text-white">
                                Berikan Penilaian & Ulasan Pekerja
                            </h4>
                            <div className="space-y-1">
                                <label className="text-[10px] font-bold tracking-wider text-slate-600 uppercase dark:text-slate-400">
                                    Rating Kinerja
                                </label>
                                <div className="flex justify-center gap-1.5 py-1">
                                    {[1, 2, 3, 4, 5].map((val) => (
                                        <button
                                            key={val}
                                            type="button"
                                            onClick={() => approveForm.setData('rating', val)}
                                            className="cursor-pointer transition-transform focus:outline-none active:scale-95"
                                        >
                                            <Star
                                                className={`h-7 w-7 ${
                                                    val <= approveForm.data.rating
                                                        ? 'fill-amber-400 text-amber-400'
                                                        : 'text-slate-300 dark:text-slate-600'
                                                }`}
                                            />
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="space-y-1">
                                <label className="text-[10px] font-bold tracking-wider text-slate-600 uppercase dark:text-slate-400">
                                    Ulasan Anda
                                </label>
                                <textarea
                                    placeholder="Berikan ulasan tentang penyelesaian pekerjaan..."
                                    rows={3}
                                    value={approveForm.data.rating_comment}
                                    onChange={(e) => approveForm.setData('rating_comment', e.target.value)}
                                    className="w-full rounded-lg border border-slate-300 bg-slate-50/80 px-3 py-2 text-xs font-semibold text-slate-900 focus:border-indigo-600 focus:bg-white focus:outline-none dark:border-slate-800 dark:bg-[#030712] dark:text-white"
                                />
                            </div>

                            <div className="flex gap-2">
                                <button
                                    type="submit"
                                    disabled={approveForm.processing}
                                    className="flex-1 cursor-pointer rounded-lg bg-emerald-600 py-2 text-xs font-bold tracking-wider text-white uppercase transition-colors hover:bg-emerald-700 disabled:opacity-50"
                                >
                                    {approveForm.processing ? 'Menyelesaikan...' : 'Kirim Ulasan & Setujui'}
                                </button>
                                <button
                                    type="button"
                                    onClick={() => {
                                        setShowApproveForm(false);
                                        approveForm.reset();
                                    }}
                                    className="rounded-lg px-3 py-2 text-xs font-bold tracking-wider text-slate-600 uppercase transition-colors hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
                                >
                                    Batal
                                </button>
                            </div>
                        </form>
                    )}

                    {showRejectForm && (
                        <form
                            onSubmit={handleRejectWork}
                            className="space-y-4 border-t border-slate-200 pt-4 dark:border-slate-800"
                        >
                            <h4 className="text-xs font-bold text-slate-900 uppercase dark:text-white">
                                Kirim Feedback Revisi
                            </h4>
                            <div className="space-y-1">
                                <label className="text-[10px] font-bold tracking-wider text-slate-600 uppercase dark:text-slate-400">
                                    Detail Revisi yang Harus Diperbaiki <span className="text-red-500">*</span>
                                </label>
                                <textarea
                                    required
                                    placeholder="Jelaskan secara rinci apa saja yang perlu diperbaiki pekerja..."
                                    rows={4}
                                    value={rejectForm.data.revision_note}
                                    onChange={(e) => rejectForm.setData('revision_note', e.target.value)}
                                    className="w-full rounded-lg border border-slate-300 bg-slate-50/80 px-3 py-2 text-xs font-semibold text-slate-900 focus:border-red-600 focus:bg-white focus:outline-none dark:border-slate-800 dark:bg-[#030712] dark:text-white"
                                />
                            </div>

                            <div className="flex gap-2">
                                <button
                                    type="submit"
                                    disabled={rejectForm.processing}
                                    className="flex-1 cursor-pointer rounded-lg bg-red-600 py-2 text-xs font-bold tracking-wider text-white uppercase transition-colors hover:bg-red-700 disabled:opacity-50"
                                >
                                    {rejectForm.processing ? 'Mengirim...' : 'Kirim Catatan Revisi'}
                                </button>
                                <button
                                    type="button"
                                    onClick={() => {
                                        setShowRejectForm(false);
                                        rejectForm.reset();
                                    }}
                                    className="rounded-lg px-3 py-2 text-xs font-bold tracking-wider text-slate-600 uppercase transition-colors hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
                                >
                                    Batal
                                </button>
                            </div>
                        </form>
                    )}
                </div>
            )}

            {quest.status === 'completed' && (
                <div className="space-y-4 border-t border-slate-200 pt-4 dark:border-slate-800">
                    <div className="flex flex-col gap-1 rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-4 text-center">
                        <Check className="mx-auto h-8 w-8 text-emerald-600 dark:text-emerald-400" />
                        <span className="block text-xs font-bold tracking-wider text-emerald-700 uppercase dark:text-emerald-300">
                            Quest Selesai
                        </span>
                        <p className="text-xs font-semibold leading-relaxed text-slate-700 dark:text-slate-300">
                            Pekerjaan telah disetujui, berkas final ZIP telah terkirim, dan quest diselesaikan secara resmi.
                        </p>
                    </div>

                    {quest.rating && (
                        <div className="space-y-2 rounded-xl border border-slate-300 bg-slate-50/70 p-4 text-center dark:border-slate-800 dark:bg-[#030712]">
                            <span className="block text-[10px] font-bold tracking-wider text-slate-600 uppercase dark:text-slate-400">
                                Ulasan Penilaian Anda
                            </span>
                            <div className="flex justify-center gap-1">
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <Star
                                        key={star}
                                        className={`h-5 w-5 ${
                                            star <= (quest.rating ?? 0)
                                                ? 'fill-amber-400 text-amber-400'
                                                : 'text-slate-300 dark:text-slate-600'
                                        }`}
                                    />
                                ))}
                            </div>
                            {quest.rating_comment && (
                                <p className="rounded-lg border border-slate-300 bg-white p-3 text-xs font-semibold text-slate-800 italic dark:border-slate-800 dark:bg-[#0d0f17] dark:text-slate-200">
                                    "{quest.rating_comment}"
                                </p>
                            )}
                        </div>
                    )}

                    <div className="space-y-3 rounded-xl border border-slate-300 bg-slate-50/70 p-4 text-xs dark:border-slate-800 dark:bg-[#030712]">
                        {quest.submission_file && (
                            <div className="space-y-1">
                                <strong className="block text-[10px] tracking-wider text-slate-600 uppercase dark:text-slate-400">
                                    Berkas Proyek Final (ZIP)
                                </strong>
                                <div className="flex items-center justify-between rounded-xl border border-amber-500/30 bg-amber-500/10 p-2.5 dark:border-amber-500/30">
                                    <div className="flex min-w-0 items-center gap-2.5">
                                        <FileArchive className="h-5 w-5 shrink-0 text-amber-600 dark:text-amber-400" />
                                        <div className="min-w-0">
                                            <p className="truncate text-xs font-bold text-slate-900 dark:text-slate-200">
                                                {quest.submission_file.name}
                                            </p>
                                            <p className="text-[10px] font-semibold text-slate-500 dark:text-slate-400">
                                                {formatBytes(quest.submission_file.size)}
                                            </p>
                                        </div>
                                    </div>
                                    <a
                                        href={quest.submission_file.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex cursor-pointer items-center justify-center rounded-lg p-1.5 text-amber-700 transition-colors hover:bg-amber-500/20 dark:text-amber-400"
                                        title="Unduh ZIP di Tab Baru"
                                    >
                                        <Download className="h-4.5 w-4.5" />
                                    </a>
                                </div>
                            </div>
                        )}

                        {quest.submission_link && (
                            <div>
                                <strong className="mb-1 block text-[10px] tracking-wider text-slate-600 uppercase dark:text-slate-400">
                                    Tautan Demo Pekerjaan
                                </strong>
                                <a
                                    href={quest.submission_link}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="font-bold break-all text-indigo-600 hover:underline dark:text-indigo-400"
                                >
                                    {quest.submission_link}
                                </a>
                            </div>
                        )}

                        {quest.payment_proof && (
                            <div className="mt-2.5 space-y-2">
                                <strong className="mb-1 block text-[10px] tracking-wider text-slate-600 uppercase dark:text-slate-400">
                                    Bukti Transfer Pembayaran
                                </strong>
                                <div className="flex items-center justify-between rounded-xl border border-indigo-500/30 bg-indigo-500/10 p-2.5 dark:border-indigo-500/30">
                                    <div className="flex min-w-0 items-center gap-2.5">
                                        <FileImage className="h-5 w-5 shrink-0 text-indigo-600 dark:text-indigo-400" />
                                        <div className="min-w-0">
                                            <p className="truncate text-xs font-bold text-slate-900 dark:text-slate-200">
                                                {quest.payment_proof.name}
                                            </p>
                                            <p className="text-[10px] font-semibold text-slate-500 dark:text-slate-400">
                                                {quest.payment_uploaded_at ? new Date(quest.payment_uploaded_at).toLocaleDateString('id-ID', { dateStyle: 'medium' }) : ''}
                                            </p>
                                        </div>
                                    </div>
                                    <a
                                        href={quest.payment_proof.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex cursor-pointer items-center justify-center rounded-lg p-1.5 text-indigo-600 transition-colors hover:bg-indigo-500/20 dark:text-indigo-400"
                                        title="Unduh Bukti Transfer"
                                    >
                                        <Download className="h-4.5 w-4.5" />
                                    </a>
                                </div>
                                <div className="relative overflow-hidden rounded-lg border border-slate-300 bg-white dark:border-slate-800 dark:bg-slate-900 max-w-xs">
                                    <a
                                        href={quest.payment_proof.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="block group"
                                    >
                                        <img
                                            src={quest.payment_proof.url}
                                            alt="Bukti Transfer Pembayaran"
                                            className="w-full object-contain max-h-40 transition-transform duration-300 group-hover:scale-105"
                                        />
                                        <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                                            <span className="rounded bg-black/60 px-2 py-1 text-[8px] font-bold text-white uppercase tracking-wider">
                                                Perbesar Gambar 🔍
                                            </span>
                                        </div>
                                    </a>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
