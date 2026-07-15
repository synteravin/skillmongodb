import React, { useState } from 'react';
import { useForm } from '@inertiajs/react';
import { Star, Download, FileArchive, MessageSquare, Check, FileImage } from 'lucide-react';
import RevisionHistory from './RevisionHistory';
import { Quest, Bid } from '@/types/quest';

interface Props {
    quest: Quest;
    bids: Bid[];
    setSelectedChatBid: (bid: { id: string; name: string } | null) => void;
    formatBytes: (bytes: number) => string;
}

export default function CreatorProjectPanel({
    quest,
    bids,
    setSelectedChatBid,
    formatBytes,
}: Props) {
    const [showApproveForm, setShowApproveForm] = useState(false);
    const [showRejectForm, setShowRejectForm] = useState(false);

    const reviewForm = useForm({
        rating: 5,
        rating_comment: '',
        revision_note: '',
    });

    const formatCurrency = (num: number) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
        }).format(num);
    };

    const submitApproval = (e: React.FormEvent) => {
        e.preventDefault();
        reviewForm.post(`/student/quests/${quest._id}/approve`, {
            onSuccess: () => {
                setShowApproveForm(false);
                reviewForm.reset();
            },
        });
    };

    const submitRejection = (e: React.FormEvent) => {
        e.preventDefault();
        reviewForm.post(`/student/quests/${quest._id}/reject`, {
            onSuccess: () => {
                setShowRejectForm(false);
                reviewForm.reset();
            },
        });
    };

    const extendForm = useForm({
        deadline: '',
    });

    const handleExtendDeadline = (e: React.FormEvent) => {
        e.preventDefault();
        extendForm.post(`/student/quests/${quest._id}/extend-deadline`, {
            onSuccess: () => extendForm.reset(),
        });
    };

    const paymentForm = useForm({
        payment_proof: null as File | null,
    });

    const handleUploadPaymentProof = (e: React.FormEvent) => {
        e.preventDefault();
        paymentForm.post(`/student/quests/${quest._id}/upload-payment`, {
            onSuccess: () => paymentForm.reset(),
        });
    };

    const acceptedBid = bids.find(
        (b) => b.status === 'accepted' || b.student?._id === quest.worker_id,
    );

    return (
        <div className="space-y-5 rounded-2xl border border-slate-200 bg-white/70 p-6 shadow-md backdrop-blur-md transition-all duration-300 dark:border-slate-800/80 dark:bg-[#0c122c]/40">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 dark:border-slate-800">
                <h3 className="font-['Orbitron'] text-sm font-bold tracking-wider text-slate-800 uppercase dark:text-blue-200">
                    Alur Kerja Pekerjaan
                </h3>
                {acceptedBid && quest.worker && (
                    <button
                        type="button"
                        onClick={() =>
                            setSelectedChatBid({
                                id: acceptedBid._id,
                                name: quest.worker?.name ?? 'Pekerja',
                            })
                        }
                        className="relative flex shrink-0 cursor-pointer items-center gap-1.5 rounded-xl bg-indigo-600 px-3.5 py-1.5 font-['Orbitron'] text-xs font-bold tracking-wider text-white uppercase shadow-sm transition-all duration-350 hover:bg-indigo-700"
                    >
                        <MessageSquare size={12} />
                        Chat Pekerja
                        {acceptedBid.unread_messages_count > 0 && (
                            <span className="absolute -top-1 -right-1 flex h-4 w-4 animate-pulse items-center justify-center rounded-full bg-red-500 text-[8px] font-black text-white ring-2 ring-white dark:ring-slate-900">
                                {acceptedBid.unread_messages_count}
                            </span>
                        )}
                    </button>
                )}
            </div>

            {quest.worker && (
                <div className="flex flex-col justify-between gap-4 rounded-xl border border-slate-200 bg-slate-55 p-4 font-['Oxanium'] sm:flex-row sm:items-center dark:border-slate-800/50 dark:bg-black/20">
                    <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-indigo-500/20 bg-indigo-500/10 font-bold text-indigo-600 dark:text-indigo-400">
                            {quest.worker.name.substring(0, 2).toUpperCase()}
                        </div>
                        <div>
                            <span className="block text-[9px] font-semibold tracking-wider text-slate-400 uppercase">
                                Pekerja Ditugaskan
                            </span>
                            <span className="text-sm font-bold text-slate-800 dark:text-white">
                                {quest.worker.name}
                            </span>
                            <span className="block text-xs text-slate-500">
                                {quest.worker.email}
                            </span>
                        </div>
                    </div>
                </div>
            )}

            {quest.status === 'ongoing' && (
                <div className="space-y-4 font-['Oxanium']">
                    <p className="text-xs leading-relaxed text-slate-500 dark:text-blue-300/60">
                        Pekerja sedang menyelesaikan tugas. Status quest saat ini
                        adalah <strong>Dalam Pengerjaan</strong>.
                    </p>
                    <RevisionHistory quest={quest} viewType="creator_ongoing" />
                </div>
            )}

            {quest.status === 'approved' && (
                <div className="space-y-4 font-['Oxanium']">
                    <div className="flex flex-col gap-2 rounded-xl border border-indigo-500/20 bg-indigo-500/10 p-4 text-center">
                        <span className="block font-['Orbitron'] text-xs font-bold tracking-wider text-indigo-600 uppercase dark:text-indigo-400">
                            Pekerjaan Disetujui! Silakan Lakukan Pembayaran
                        </span>
                        <p className="text-[11px] text-slate-500 dark:text-slate-355 leading-relaxed">
                            Anda telah menyetujui hasil pengerjaan. Langkah berikutnya adalah melakukan transfer dana pembayaran secara offline ke pekerja (sesuai kesepakatan bid) dan mengunggah bukti transfer di bawah ini untuk mengaktifkan fase Pembayaran.
                        </p>
                    </div>

                    <form onSubmit={handleUploadPaymentProof} className="space-y-4">
                        <div className="space-y-1.5">
                            <label className="text-[10px] font-bold text-slate-500 uppercase dark:text-slate-400">
                                Bukti Transfer Pembayaran <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="file"
                                required
                                accept="image/png, image/jpeg, image/jpg"
                                onChange={(e) => {
                                    const file = e.target.files?.[0];
                                    if (file) {
                                        paymentForm.setData('payment_proof', file);
                                    }
                                }}
                                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2 text-xs text-slate-800 focus:border-indigo-500 focus:outline-none dark:border-slate-800 dark:bg-black/20 dark:text-white"
                            />
                            {paymentForm.errors.payment_proof && (
                                <p className="text-xs font-semibold text-red-500">
                                    {paymentForm.errors.payment_proof}
                                </p>
                            )}
                        </div>

                        <button
                            type="submit"
                            disabled={paymentForm.processing}
                            className="w-full cursor-pointer rounded-xl bg-indigo-600 hover:bg-indigo-700 py-2.5 font-['Orbitron'] text-xs font-bold tracking-wider text-white uppercase shadow-sm transition-colors disabled:opacity-50"
                        >
                            {paymentForm.processing ? 'Mengirim...' : 'Kirim Bukti Pembayaran'}
                        </button>
                    </form>
                </div>
            )}

            {quest.status === 'payment' && (
                <div className="space-y-4 font-['Oxanium']">
                    <div className="flex flex-col gap-2 rounded-xl border border-amber-500/20 bg-amber-500/10 p-4 text-center">
                        <span className="block font-['Orbitron'] text-xs font-bold tracking-wider text-amber-600 uppercase dark:text-amber-400">
                            Menunggu Konfirmasi Pekerja
                        </span>
                        <p className="text-[11px] text-slate-500 dark:text-slate-355 leading-relaxed">
                            Bukti transfer pembayaran Anda telah diunggah. Saat ini sistem menunggu pekerja memverifikasi penerimaan dana di rekeningnya dan menyerahkan Berkas Proyek Final (ZIP) untuk menyelesaikan quest ini.
                        </p>
                    </div>

                    {quest.payment_proof && (
                        <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800/60 dark:bg-black/20">
                            <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">
                                Bukti Transfer Anda
                            </span>
                            <div className="flex flex-col gap-3">
                                <div className="flex items-center justify-between gap-3">
                                    <div className="flex min-w-0 items-center gap-2">
                                        <FileImage className="h-5 w-5 shrink-0 text-indigo-500" />
                                        <span className="text-xs font-semibold text-slate-750 dark:text-slate-200 truncate">
                                            {quest.payment_proof.name}
                                        </span>
                                    </div>
                                    <a
                                        href={quest.payment_proof.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex h-7 w-7 items-center justify-center rounded-lg bg-indigo-500/10 text-indigo-600 hover:bg-indigo-500/20 dark:text-indigo-400"
                                        title="Unduh Bukti Transfer"
                                    >
                                        <Download size={14} />
                                    </a>
                                </div>
                                <div className="relative overflow-hidden rounded-lg border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900 max-w-xs">
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
                <div className="space-y-5 font-['Oxanium']">
                    <div className="flex flex-col gap-1 rounded-xl border border-amber-500/20 bg-amber-500/10 p-4 text-center">
                        <span className="block font-['Orbitron'] text-xs font-bold tracking-wider text-amber-600 uppercase dark:text-amber-400">
                            Hasil Pekerjaan Terkirim
                        </span>
                        <p className="text-xs leading-relaxed text-slate-500 dark:text-blue-300/60">
                            Pekerja telah selesai melakukan penyerahan tugas
                            awal. Silakan review hasil pekerjaannya di bawah ini.
                        </p>
                    </div>

                    <RevisionHistory
                        quest={quest}
                        viewType="creator_submitted"
                    />

                    <div className="space-y-3.5 rounded-xl border border-slate-200 bg-slate-55 p-4 text-xs dark:border-slate-800/85 dark:bg-black/20">
                        {quest.submission_file && (
                            <div className="space-y-1">
                                <strong className="block text-[10px] tracking-wider text-slate-400 uppercase">
                                    Berkas Pekerjaan (ZIP)
                                </strong>
                                <div className="flex items-center justify-between rounded-xl border border-amber-200/40 bg-amber-500/5 p-2.5 dark:border-amber-500/20 dark:bg-amber-950/10">
                                    <div className="flex min-w-0 items-center gap-2.5">
                                        <FileArchive className="h-5 w-5 shrink-0 text-amber-500" />
                                        <div className="min-w-0">
                                            <p className="truncate text-xs font-semibold text-slate-750 dark:text-slate-200">
                                                {quest.submission_file.name}
                                            </p>
                                            <p className="text-[10px] text-slate-400">
                                                {formatBytes(
                                                    quest.submission_file.size,
                                                )}
                                            </p>
                                        </div>
                                    </div>
                                    <a
                                        href={quest.submission_file.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex cursor-pointer items-center justify-center rounded-lg p-1.5 text-amber-600 transition-colors hover:bg-amber-500/10 hover:text-amber-700"
                                        title="Unduh ZIP di Tab Baru"
                                    >
                                        <Download className="h-4.5 w-4.5" />
                                    </a>
                                </div>
                            </div>
                        )}

                        {quest.submission_link && (
                            <div>
                                <strong className="mb-1 block text-[10px] tracking-wider text-slate-400 uppercase">
                                    Link Hasil Pekerjaan
                                </strong>
                                <a
                                    href={quest.submission_link}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="font-semibold break-all text-indigo-500 hover:underline"
                                >
                                    {quest.submission_link}
                                </a>
                            </div>
                        )}

                        {quest.submission_note && (
                            <div>
                                <strong className="mb-1 block text-[10px] tracking-wider text-slate-400 uppercase">
                                    Catatan dari Pekerja
                                </strong>
                                <p className="rounded-lg border border-slate-200 bg-white/40 p-2.5 leading-relaxed whitespace-pre-wrap text-slate-700 dark:border-slate-800/40 dark:bg-black/15 dark:text-slate-300">
                                    {quest.submission_note}
                                </p>
                            </div>
                        )}
                    </div>

                    {!showApproveForm && !showRejectForm && (
                        <div className="flex gap-3 border-t border-slate-100 pt-4 dark:border-slate-800">
                            <button
                                onClick={() => setShowApproveForm(true)}
                                className="flex-1 cursor-pointer rounded-xl bg-green-600 py-2.5 font-['Orbitron'] text-xs font-bold tracking-wider text-white uppercase shadow-sm transition-colors hover:bg-green-700"
                            >
                                Setujui & Lanjutkan
                            </button>
                            <button
                                onClick={() => setShowRejectForm(true)}
                                className="flex-1 cursor-pointer rounded-xl bg-red-600 py-2.5 font-['Orbitron'] text-xs font-bold tracking-wider text-white uppercase shadow-sm transition-colors hover:bg-red-700"
                            >
                                Tolak / Minta Revisi
                            </button>
                        </div>
                    )}

                    {showApproveForm && (
                        <form
                            onSubmit={submitApproval}
                            className="space-y-4 border-t border-slate-100 pt-4 dark:border-slate-800"
                        >
                            <h4 className="font-['Orbitron'] text-xs font-bold text-slate-700 uppercase dark:text-blue-200">
                                Berikan Penilaian & Ulasan Pekerja
                            </h4>
                            <div className="space-y-1">
                                <label className="text-[10px] font-bold tracking-wider text-slate-400 uppercase">
                                    Rating Kinerja
                                </label>
                                <div className="flex justify-center gap-1.5 py-1">
                                    {[1, 2, 3, 4, 5].map((val) => (
                                        <button
                                            key={val}
                                            type="button"
                                            onClick={() =>
                                                reviewForm.setData(
                                                    'rating',
                                                    val,
                                                )
                                            }
                                            className="cursor-pointer transition-transform focus:outline-none active:scale-95"
                                        >
                                            <Star
                                                className={`h-7 w-7 ${
                                                    val <=
                                                    reviewForm.data.rating
                                                        ? 'fill-amber-400 text-amber-400'
                                                        : 'text-slate-300 dark:text-slate-600'
                                                }`}
                                            />
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="space-y-1">
                                <label className="text-[10px] font-bold tracking-wider text-slate-400 uppercase">
                                    Ulasan Anda
                                </label>
                                <textarea
                                    placeholder="Berikan ulasan tentang penyelesaian pekerjaan..."
                                    rows={3}
                                    value={reviewForm.data.rating_comment}
                                    onChange={(e) =>
                                        reviewForm.setData(
                                            'rating_comment',
                                            e.target.value,
                                        )
                                    }
                                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-800 focus:border-indigo-500 focus:outline-none dark:border-slate-800 dark:bg-black/20 dark:text-white"
                                />
                            </div>

                            <div className="flex gap-2">
                                <button
                                    type="submit"
                                    disabled={reviewForm.processing}
                                    className="flex-1 cursor-pointer rounded-xl bg-green-600 py-2 font-['Orbitron'] text-xs font-bold tracking-wider text-white uppercase transition-colors hover:bg-green-700 disabled:opacity-50"
                                >
                                    {reviewForm.processing
                                        ? 'Menyelesaikan...'
                                        : 'Kirim Ulasan & Setujui'}
                                </button>
                                <button
                                    type="button"
                                    onClick={() => {
                                        setShowApproveForm(false);
                                        reviewForm.reset();
                                    }}
                                    className="rounded-xl px-3 py-2 font-['Orbitron'] text-xs font-bold tracking-wider text-slate-500 uppercase transition-colors hover:text-slate-700 dark:text-slate-400 dark:hover:text-white"
                                >
                                    Batal
                                </button>
                            </div>
                        </form>
                    )}

                    {showRejectForm && (
                        <form
                            onSubmit={submitRejection}
                            className="space-y-4 border-t border-slate-100 pt-4 dark:border-slate-800"
                        >
                            <h4 className="font-['Orbitron'] text-xs font-bold text-slate-700 uppercase dark:text-blue-200">
                                Kirim Feedback Revisi
                            </h4>
                            <div className="space-y-1">
                                <label className="text-[10px] font-bold tracking-wider text-slate-400 uppercase">
                                    Detail Revisi yang Harus Diperbaiki{' '}
                                    <span className="text-red-500">*</span>
                                </label>
                                <textarea
                                    required
                                    placeholder="Jelaskan secara rinci apa saja yang perlu diperbaiki pekerja..."
                                    rows={4}
                                    value={reviewForm.data.revision_note}
                                    onChange={(e) =>
                                        reviewForm.setData(
                                            'revision_note',
                                            e.target.value,
                                        )
                                    }
                                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-800 focus:border-red-500 focus:outline-none dark:border-slate-800 dark:bg-black/20 dark:text-white"
                                />
                            </div>

                            <div className="flex gap-2">
                                <button
                                    type="submit"
                                    disabled={reviewForm.processing}
                                    className="flex-1 cursor-pointer rounded-xl bg-red-600 py-2 font-['Orbitron'] text-xs font-bold tracking-wider text-white uppercase transition-colors hover:bg-red-700 disabled:opacity-50"
                                >
                                    {reviewForm.processing
                                        ? 'Mengirim...'
                                        : 'Kirim Catatan Revisi'}
                                </button>
                                <button
                                    type="button"
                                    onClick={() => {
                                        setShowRejectForm(false);
                                        reviewForm.reset();
                                    }}
                                    className="rounded-xl px-3 py-2 font-['Orbitron'] text-xs font-bold tracking-wider text-slate-500 uppercase transition-colors hover:text-slate-700 dark:text-slate-400 dark:hover:text-white"
                                >
                                    Batal
                                </button>
                            </div>
                        </form>
                    )}
                </div>
            )}

            {quest.status === 'completed' && (
                <div className="space-y-4 font-['Oxanium']">
                    <div className="flex flex-col gap-1 rounded-xl border border-green-500/20 bg-green-500/10 p-4 text-center">
                        <Check className="mx-auto h-8 w-8 text-green-500" />
                        <span className="block font-['Orbitron'] text-xs font-bold tracking-wider text-green-600 uppercase dark:text-green-400">
                            Quest Selesai
                        </span>
                        <p className="text-xs leading-relaxed text-slate-500 dark:text-blue-300/60">
                            Pekerjaan telah disetujui, berkas final ZIP telah
                            terkirim, dan quest diselesaikan secara resmi.
                        </p>
                    </div>

                    {quest.rating && (
                        <div className="space-y-2 rounded-xl border border-slate-200/20 bg-slate-50 p-4 text-center dark:border-slate-500/5 dark:bg-black/20">
                            <span className="block text-[10px] font-semibold tracking-wider text-slate-400 uppercase">
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
                                <p className="rounded-lg border border-slate-100 bg-white/40 p-2.5 text-xs text-slate-600 italic dark:border-blue-500/5 dark:bg-black/10 dark:text-slate-300">
                                    "{quest.rating_comment}"
                                </p>
                            )}
                        </div>
                    )}

                    <div className="space-y-3 rounded-xl border border-slate-200 bg-slate-50 p-4 text-xs dark:border-slate-800/40 dark:bg-black/20">
                        {quest.submission_file && (
                            <div className="space-y-1">
                                <strong className="block text-[10px] tracking-wider text-slate-400 uppercase">
                                    Berkas Proyek Final (ZIP)
                                </strong>
                                <div className="flex items-center justify-between rounded-xl border border-amber-200/40 bg-amber-500/5 p-2.5 dark:border-amber-500/20 dark:bg-amber-950/10">
                                    <div className="flex min-w-0 items-center gap-2.5">
                                        <FileArchive className="h-5 w-5 shrink-0 text-amber-500" />
                                        <div className="min-w-0">
                                            <p className="truncate text-xs font-semibold text-slate-750 dark:text-slate-200">
                                                {quest.submission_file.name}
                                            </p>
                                            <p className="text-[10px] text-slate-400">
                                                {formatBytes(
                                                    quest.submission_file.size,
                                                )}
                                            </p>
                                        </div>
                                    </div>
                                    <a
                                        href={quest.submission_file.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex cursor-pointer items-center justify-center rounded-lg p-1.5 text-amber-600 transition-colors hover:bg-amber-500/10 hover:text-amber-700"
                                        title="Unduh ZIP di Tab Baru"
                                    >
                                        <Download className="h-4.5 w-4.5" />
                                    </a>
                                </div>
                            </div>
                        )}

                        {quest.submission_link && (
                            <div>
                                <strong className="mb-1 block text-[10px] tracking-wider text-slate-400 uppercase">
                                    Tautan Demo Pekerjaan
                                </strong>
                                <a
                                    href={quest.submission_link}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="font-semibold break-all text-indigo-500 hover:underline"
                                >
                                    {quest.submission_link}
                                </a>
                            </div>
                        )}

                        {quest.payment_proof && (
                            <div className="mt-2.5 space-y-2">
                                <strong className="mb-1 block text-[10px] tracking-wider text-slate-400 uppercase">
                                    Bukti Transfer Pembayaran
                                </strong>
                                <div className="flex items-center justify-between rounded-xl border border-indigo-200/40 bg-indigo-500/5 p-2.5 dark:border-indigo-500/20 dark:bg-indigo-950/10">
                                    <div className="flex min-w-0 items-center gap-2.5">
                                        <FileImage className="h-5 w-5 shrink-0 text-indigo-500" />
                                        <div className="min-w-0">
                                            <p className="truncate text-xs font-semibold text-slate-700 dark:text-slate-200">
                                                {quest.payment_proof.name}
                                            </p>
                                            <p className="text-[10px] text-slate-450">
                                                {quest.payment_uploaded_at ? new Date(quest.payment_uploaded_at).toLocaleDateString('id-ID', { dateStyle: 'medium' }) : ''}
                                            </p>
                                        </div>
                                    </div>
                                    <a
                                        href={quest.payment_proof.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex cursor-pointer items-center justify-center rounded-lg p-1.5 text-indigo-600 transition-colors hover:bg-indigo-500/10 hover:text-indigo-700"
                                        title="Unduh Bukti Transfer"
                                    >
                                        <Download className="h-4.5 w-4.5" />
                                    </a>
                                </div>
                                <div className="relative overflow-hidden rounded-lg border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900 max-w-xs">
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

            {quest.status === 'expired' && (
                <div className="space-y-4 font-['Oxanium'] border-t border-slate-100/60 pt-4 dark:border-slate-800/60">
                    <div className="rounded-xl border border-red-500/15 bg-red-500/5 p-4 dark:bg-red-950/10">
                        <span className="block font-['Orbitron'] text-xs font-bold tracking-wider text-red-600 uppercase dark:text-red-400">
                            ⏳ Perpanjang Tenggat Waktu (Re-open)
                        </span>
                        <p className="mt-1 text-xs leading-relaxed text-slate-500 dark:text-slate-300">
                            Quest ini telah kadaluarsa karena melewati batas waktu pengerjaan. Sebagai pembuat quest, Anda dapat menentukan tenggat waktu baru di bawah ini untuk membuka kembali pendaftaran quest (jika belum ada pekerja) atau melanjutkan pengerjaan proyek.
                        </p>
                    </div>

                    <form onSubmit={handleExtendDeadline} className="space-y-4">
                        <div className="space-y-1.5">
                            <label className="text-[10px] font-bold text-slate-500 uppercase dark:text-slate-400">
                                Tenggat Waktu Baru <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="datetime-local"
                                required
                                value={extendForm.data.deadline}
                                onChange={(e) => extendForm.setData('deadline', e.target.value)}
                                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2 text-xs text-slate-800 focus:border-indigo-500 focus:outline-none dark:border-slate-800 dark:bg-black/20 dark:text-white"
                            />
                            {extendForm.errors.deadline && (
                                <p className="text-xs font-semibold text-red-500">
                                    {extendForm.errors.deadline}
                                </p>
                            )}
                        </div>

                        <button
                            type="submit"
                            disabled={extendForm.processing}
                            className="w-full cursor-pointer rounded-xl bg-indigo-600 hover:bg-indigo-700 py-2.5 font-['Orbitron'] text-xs font-bold tracking-wider text-white uppercase shadow-sm transition-colors disabled:opacity-50"
                        >
                            {extendForm.processing ? 'Memproses...' : 'Aktifkan Kembali Quest'}
                        </button>
                    </form>
                </div>
            )}
        </div>
    );
}
