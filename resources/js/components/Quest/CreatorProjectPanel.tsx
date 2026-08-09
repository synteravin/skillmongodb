import React, { useState } from 'react';
import { useForm } from '@inertiajs/react';
import {
    Star,
    Download,
    FileArchive,
    MessageSquare,
    Check,
    FileImage,
    Calendar,
    AlertCircle,
} from 'lucide-react';
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
        reviewForm.post(`/quests/${quest.slug}/approve`, {
            onSuccess: () => {
                setShowApproveForm(false);
                reviewForm.reset();
            },
        });
    };

    const submitRejection = (e: React.FormEvent) => {
        e.preventDefault();
        reviewForm.post(`/quests/${quest.slug}/reject`, {
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
        extendForm.post(`/quests/${quest.slug}/extend-deadline`, {
            onSuccess: () => extendForm.reset(),
        });
    };

    const paymentForm = useForm({
        payment_proof: null as File | null,
    });

    const handleUploadPaymentProof = (e: React.FormEvent) => {
        e.preventDefault();
        paymentForm.post(`/quests/${quest.slug}/upload-payment`, {
            onSuccess: () => paymentForm.reset(),
        });
    };

    const acceptedBid = bids.find(
        (b) => b.status === 'accepted' || b.student?._id === quest.worker_id,
    );

    return (
        <div className="relative space-y-5 overflow-hidden rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-gradient-to-b dark:from-[#0e0e1a] dark:to-[#090910]">
            <div className="pointer-events-none absolute top-0 right-8 left-8 z-0 h-px bg-gradient-to-r from-transparent via-slate-300 to-transparent select-none dark:via-slate-700" />
            <div className="relative z-10 flex items-center justify-between border-b border-slate-100 pb-3 dark:border-slate-800">
                <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200">
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
                        className="relative inline-flex cursor-pointer items-center gap-2 rounded-lg bg-gradient-to-r from-indigo-600 to-indigo-700 px-3.5 py-1.5 text-xs font-bold tracking-wider text-white uppercase shadow-md shadow-indigo-500/20 transition-all hover:from-indigo-500 hover:to-indigo-600 dark:from-indigo-600 dark:to-indigo-500 dark:hover:from-indigo-500 dark:hover:to-indigo-400"
                    >
                        <MessageSquare size={14} />
                        Chat Pekerja
                        {acceptedBid.unread_messages_count > 0 && (
                            <span className="absolute -top-1 -right-1 flex h-4.5 w-4.5 items-center justify-center rounded-full bg-red-500 text-[9px] font-bold text-white ring-2 ring-white dark:ring-slate-950">
                                {acceptedBid.unread_messages_count}
                            </span>
                        )}
                    </button>
                )}
            </div>

            {quest.worker && (
                <div className="flex flex-col justify-between gap-4 rounded-xl border border-slate-100 bg-slate-50 p-4 sm:flex-row sm:items-center dark:border-slate-800 dark:bg-[#030712]">
                    <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-indigo-100 font-bold text-indigo-700 dark:bg-slate-800 dark:text-indigo-400">
                            {quest.worker.name.substring(0, 2).toUpperCase()}
                        </div>
                        <div>
                            <span className="block text-[9px] font-medium tracking-wider text-slate-400 uppercase">
                                Pekerja Ditugaskan
                            </span>
                            <span className="text-sm font-bold text-slate-800 dark:text-white">
                                {quest.worker.name}
                            </span>
                            <span className="text-slate-505 block text-xs dark:text-slate-400">
                                {quest.worker.email}
                            </span>
                        </div>
                    </div>
                </div>
            )}

            {quest.status === 'ongoing' && (
                <div className="space-y-4">
                    <p className="text-slate-505 dark:text-slate-405 text-xs leading-relaxed">
                        Pekerja sedang menyelesaikan tugas. Status kontrak saat
                        ini adalah{' '}
                        <span className="font-semibold text-slate-700 dark:text-slate-200">
                            Dalam Pengerjaan
                        </span>
                        .
                    </p>
                    <RevisionHistory quest={quest} viewType="creator_ongoing" />
                </div>
            )}

            {quest.status === 'approved' && (
                <div className="space-y-4">
                    <div className="flex flex-col gap-1.5 rounded-xl border border-indigo-100 bg-indigo-50/30 p-4 dark:border-slate-800 dark:bg-[#030712]">
                        <span className="text-indigo-755 block text-xs font-semibold dark:text-indigo-400">
                            Hasil Pekerjaan Disetujui! Lanjutkan ke Pembayaran
                        </span>
                        <p className="text-slate-550 text-[11px] leading-relaxed dark:text-slate-400">
                            Anda telah menyetujui hasil pengerjaan. Langkah
                            berikutnya adalah melakukan transfer dana pembayaran
                            secara offline ke pekerja (sesuai kesepakatan bid)
                            dan mengunggah bukti transfer di bawah ini untuk
                            memverifikasi proses pembayaran.
                        </p>
                    </div>

                    <form
                        onSubmit={handleUploadPaymentProof}
                        className="space-y-4"
                    >
                        <div className="space-y-1.5">
                            <label className="text-[10px] font-bold text-slate-400 uppercase">
                                Bukti Transfer Pembayaran{' '}
                                <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="file"
                                required
                                accept="image/png, image/jpeg, image/jpg"
                                onChange={(e) => {
                                    const file = e.target.files?.[0];
                                    if (file) {
                                        paymentForm.setData(
                                            'payment_proof',
                                            file,
                                        );
                                    }
                                }}
                                className="border-slate-250 w-full rounded-lg border bg-slate-50 px-3 py-2 text-xs text-slate-800 focus:border-indigo-600 focus:outline-none dark:border-slate-800 dark:bg-[#030712] dark:text-white"
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
                            className="w-full cursor-pointer rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-700 px-4 py-2.5 text-xs font-bold tracking-wider text-white uppercase shadow-md shadow-indigo-500/20 transition-all hover:from-indigo-500 hover:to-indigo-600 disabled:opacity-50 dark:from-indigo-600 dark:to-indigo-500 dark:hover:from-indigo-500 dark:hover:to-indigo-400"
                        >
                            {paymentForm.processing
                                ? 'Mengirim...'
                                : 'Kirim Bukti Pembayaran'}
                        </button>
                    </form>
                </div>
            )}

            {quest.status === 'payment' && (
                <div className="space-y-4">
                    <div className="flex flex-col gap-1.5 rounded-xl border border-amber-100 bg-amber-50/30 p-4 dark:border-slate-800 dark:bg-[#030712]">
                        <span className="block text-xs font-semibold text-amber-700 dark:text-amber-400">
                            Menunggu Konfirmasi Pekerja
                        </span>
                        <p className="text-slate-550 text-[11px] leading-relaxed dark:text-slate-400">
                            Bukti transfer pembayaran Anda telah diunggah. Saat
                            ini sistem menunggu pekerja memverifikasi penerimaan
                            dana di rekeningnya dan menyerahkan Berkas Proyek
                            Final (ZIP) untuk menyelesaikan kontrak ini.
                        </p>
                    </div>

                    {quest.payment_proof && (
                        <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-[#030712]">
                            <span className="mb-2 block text-[10px] font-bold tracking-wider text-slate-400 uppercase">
                                Bukti Transfer Anda
                            </span>
                            <div className="flex flex-col gap-3">
                                <div className="flex items-center justify-between gap-3">
                                    <div className="flex min-w-0 items-center gap-2">
                                        <FileImage className="h-5 w-5 shrink-0 text-indigo-500" />
                                        <span className="truncate text-xs font-semibold text-slate-700 dark:text-slate-200">
                                            {quest.payment_proof.name}
                                        </span>
                                    </div>
                                    <a
                                        href={quest.payment_proof.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-indigo-650 flex h-7 w-7 items-center justify-center rounded-lg bg-indigo-50 hover:bg-indigo-100 dark:bg-slate-800 dark:text-indigo-400"
                                        title="Unduh Bukti Transfer"
                                    >
                                        <Download size={14} />
                                    </a>
                                </div>
                                <div className="relative max-w-xs overflow-hidden rounded-lg border border-slate-200 bg-white dark:border-slate-800 dark:bg-[#0d1117]">
                                    <a
                                        href={quest.payment_proof.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="group block"
                                    >
                                        <img
                                            src={quest.payment_proof.url}
                                            alt="Bukti Transfer Pembayaran"
                                            className="max-h-40 w-full object-contain transition-transform duration-300 group-hover:scale-105"
                                        />
                                        <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                                            <span className="rounded bg-black/70 px-2 py-1 text-[8px] font-bold tracking-wider text-white uppercase">
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
                <div className="space-y-5">
                    <div className="flex flex-col gap-1.5 rounded-xl border border-amber-100 bg-amber-50/30 p-4 dark:border-slate-800 dark:bg-[#030712]">
                        <span className="block text-xs font-semibold text-amber-700 dark:text-amber-400">
                            Hasil Pekerjaan Terkirim
                        </span>
                        <p className="text-xs leading-relaxed text-slate-500 dark:text-slate-400">
                            Pekerja telah melakukan penyerahan tugas proyek.
                            Silakan review hasil pekerjaannya di bawah ini.
                        </p>
                    </div>

                    <RevisionHistory
                        quest={quest}
                        viewType="creator_submitted"
                    />

                    <div className="space-y-3.5 rounded-xl border border-slate-100 bg-slate-50 p-4 text-xs dark:border-slate-800 dark:bg-[#030712]">
                        {quest.submission_file && (
                            <div className="space-y-1">
                                <strong className="block text-[10px] tracking-wider text-slate-400 uppercase">
                                    Berkas Pekerjaan (ZIP)
                                </strong>
                                <div className="flex items-center justify-between rounded-xl border border-amber-200/40 bg-amber-500/5 p-2.5 dark:border-slate-800 dark:bg-[#030712]">
                                    <div className="flex min-w-0 items-center gap-2.5">
                                        <FileArchive className="h-5 w-5 shrink-0 text-amber-500" />
                                        <div className="min-w-0">
                                            <p className="truncate text-xs font-semibold text-slate-700 dark:text-slate-200">
                                                {quest.submission_file.name}
                                            </p>
                                            <p className="text-slate-405 text-[10px]">
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
                                    className="font-semibold break-all text-indigo-600 hover:underline dark:text-indigo-400"
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
                                <p className="text-slate-650 rounded-lg border border-slate-200 bg-white p-2.5 leading-relaxed whitespace-pre-wrap dark:border-slate-800 dark:bg-[#0d1117] dark:text-slate-300">
                                    {quest.submission_note}
                                </p>
                            </div>
                        )}
                    </div>

                    {!showApproveForm && !showRejectForm && (
                        <div className="flex gap-3 border-t border-slate-100 pt-4 dark:border-slate-800">
                            <button
                                onClick={() => setShowApproveForm(true)}
                                className="flex-1 cursor-pointer rounded-lg bg-emerald-600 py-2.5 text-xs font-bold tracking-wider text-white uppercase transition-colors hover:bg-emerald-700"
                            >
                                Setujui & Selesai
                            </button>
                            <button
                                onClick={() => setShowRejectForm(true)}
                                className="flex-1 cursor-pointer rounded-lg bg-rose-600 py-2.5 text-xs font-bold tracking-wider text-white uppercase transition-colors hover:bg-rose-700"
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
                            <h4 className="text-xs font-bold text-slate-700 uppercase dark:text-indigo-400">
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
                                    className="focus:border-indigo-650 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-800 focus:outline-none dark:border-slate-800 dark:bg-[#030712] dark:text-white"
                                />
                            </div>

                            <div className="flex gap-2">
                                <button
                                    type="submit"
                                    disabled={reviewForm.processing}
                                    className="flex-1 cursor-pointer rounded-lg bg-emerald-600 py-2 text-xs font-bold tracking-wider text-white uppercase transition-colors hover:bg-emerald-700 disabled:opacity-50"
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
                                    className="dark:text-slate-455 rounded-lg px-4 py-2 text-xs font-semibold text-slate-500 hover:text-slate-700 dark:hover:text-white"
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
                            <h4 className="text-slate-750 text-xs font-bold uppercase dark:text-rose-400">
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
                                    className="border-slate-250 w-full rounded-lg border bg-slate-50 px-3 py-2 text-xs text-slate-800 focus:border-red-500 focus:outline-none dark:border-slate-800 dark:bg-[#030712] dark:text-white"
                                />
                            </div>

                            <div className="flex gap-2">
                                <button
                                    type="submit"
                                    disabled={reviewForm.processing}
                                    className="flex-1 cursor-pointer rounded-lg bg-rose-600 py-2 text-xs font-bold tracking-wider text-white uppercase transition-colors hover:bg-rose-700 disabled:opacity-50"
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
                                    className="dark:text-slate-455 rounded-lg px-4 py-2 text-xs font-semibold text-slate-500 hover:text-slate-700 dark:hover:text-white"
                                >
                                    Batal
                                </button>
                            </div>
                        </form>
                    )}
                </div>
            )}

            {quest.status === 'completed' && (
                <div className="space-y-4">
                    <div className="flex flex-col gap-1.5 rounded-xl border border-green-200 bg-green-50/15 p-4 text-center dark:border-green-900/40 dark:bg-green-950/10">
                        <Check className="mx-auto h-7 w-7 text-emerald-600" />
                        <span className="block text-xs font-semibold text-emerald-700 dark:text-emerald-400">
                            Pekerjaan Selesai
                        </span>
                        <p className="text-xs leading-relaxed text-slate-500 dark:text-slate-400">
                            Pekerjaan telah disetujui, berkas final ZIP telah
                            terkirim, dan quest diselesaikan secara resmi.
                        </p>
                    </div>

                    {quest.rating && (
                        <div className="space-y-2 rounded-xl border border-slate-200 bg-slate-50 p-4 text-center dark:border-slate-800 dark:bg-[#030712]">
                            <span className="block text-[10px] font-semibold tracking-wider text-slate-400 uppercase">
                                Penilaian Kinerja Pekerja
                            </span>
                            <div className="flex justify-center gap-1">
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <Star
                                        key={star}
                                        className={`h-5 w-5 ${
                                            star <= (quest.rating ?? 0)
                                                ? 'fill-amber-400 text-amber-400'
                                                : 'dark:text-slate-650 text-slate-300'
                                        }`}
                                    />
                                ))}
                            </div>
                            {quest.rating_comment && (
                                <p className="text-slate-605 dark:border-slate-850 dark:text-slate-350 rounded-lg border border-slate-100 bg-white p-2.5 text-xs italic dark:bg-[#0d1117]">
                                    "{quest.rating_comment}"
                                </p>
                            )}
                        </div>
                    )}

                    <div className="border-slate-150 space-y-3 rounded-xl border bg-slate-50 p-4 text-xs dark:border-slate-800 dark:bg-[#030712]">
                        {quest.submission_file && (
                            <div className="space-y-1">
                                <strong className="block text-[10px] tracking-wider text-slate-400 uppercase">
                                    Berkas Proyek Final (ZIP)
                                </strong>
                                <div className="flex items-center justify-between rounded-xl border border-amber-200 bg-amber-500/5 p-2.5 dark:border-slate-800 dark:bg-[#030712]">
                                    <div className="flex min-w-0 items-center gap-2.5">
                                        <FileArchive className="h-5 w-5 shrink-0 text-amber-500" />
                                        <div className="min-w-0">
                                            <p className="truncate text-xs font-semibold text-slate-700 dark:text-slate-200">
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
                                        className="text-amber-650 flex cursor-pointer items-center justify-center rounded-lg p-1.5 transition-colors hover:bg-amber-500/10 hover:text-amber-700"
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
                                    className="font-semibold break-all text-indigo-500 hover:underline dark:text-indigo-400"
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
                                <div className="flex items-center justify-between rounded-xl border border-indigo-200 bg-indigo-500/5 p-2.5 dark:border-slate-800 dark:bg-[#030712]">
                                    <div className="flex min-w-0 items-center gap-2.5">
                                        <FileImage className="h-5 w-5 shrink-0 text-indigo-500" />
                                        <div className="min-w-0">
                                            <p className="truncate text-xs font-semibold text-slate-700 dark:text-slate-200">
                                                {quest.payment_proof.name}
                                            </p>
                                            <p className="text-[10px] text-slate-400">
                                                {quest.payment_uploaded_at
                                                    ? new Date(
                                                          quest.payment_uploaded_at,
                                                      ).toLocaleDateString(
                                                          'id-ID',
                                                          {
                                                              dateStyle:
                                                                  'medium',
                                                          },
                                                      )
                                                    : ''}
                                            </p>
                                        </div>
                                    </div>
                                    <a
                                        href={quest.payment_proof.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-indigo-650 flex cursor-pointer items-center justify-center rounded-lg p-1.5 transition-colors hover:bg-indigo-500/10 hover:text-indigo-700"
                                        title="Unduh Bukti Transfer"
                                    >
                                        <Download className="h-4.5 w-4.5" />
                                    </a>
                                </div>
                                <div className="relative max-w-xs overflow-hidden rounded-lg border border-slate-200 bg-white dark:border-slate-800 dark:bg-[#0d1117]">
                                    <a
                                        href={quest.payment_proof.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="group block"
                                    >
                                        <img
                                            src={quest.payment_proof.url}
                                            alt="Bukti Transfer Pembayaran"
                                            className="max-h-40 w-full object-contain transition-transform duration-300 group-hover:scale-105"
                                        />
                                        <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                                            <span className="rounded bg-black/60 px-2 py-1 text-[8px] font-bold tracking-wider text-white uppercase">
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
                <div className="space-y-4 border-t border-slate-100/60 pt-4 dark:border-slate-800/60">
                    <div className="rounded-xl border border-red-200 bg-red-50/15 p-4 dark:border-slate-800 dark:bg-[#030712]">
                        <span className="text-red-655 block text-xs font-semibold dark:text-red-400">
                            Perpanjang Tenggat Waktu (Re-open)
                        </span>
                        <p className="mt-1 text-xs leading-relaxed text-slate-500 dark:text-slate-400">
                            Kontrak ini telah kadaluarsa karena melewati batas
                            waktu pengerjaan. Sebagai pemilik proyek, Anda dapat
                            menentukan tenggat waktu baru di bawah ini untuk
                            membuka kembali pendaftaran proyek (jika belum
                            terisi) atau melanjutkan pengerjaan.
                        </p>
                    </div>

                    <form onSubmit={handleExtendDeadline} className="space-y-4">
                        <div className="space-y-1.5">
                            <label className="text-[10px] font-bold text-slate-400 uppercase">
                                Tenggat Waktu Baru{' '}
                                <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="datetime-local"
                                required
                                value={extendForm.data.deadline}
                                onChange={(e) =>
                                    extendForm.setData(
                                        'deadline',
                                        e.target.value,
                                    )
                                }
                                className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3.5 py-2 text-xs text-slate-800 focus:border-indigo-600 focus:outline-none dark:border-slate-800 dark:bg-[#030712] dark:text-white"
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
                            className="w-full cursor-pointer rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-700 px-4 py-2.5 text-xs font-bold tracking-wider text-white uppercase shadow-md shadow-indigo-500/20 transition-all hover:from-indigo-500 hover:to-indigo-600 disabled:opacity-50 dark:from-indigo-600 dark:to-indigo-500 dark:hover:from-indigo-500 dark:hover:to-indigo-400"
                        >
                            {extendForm.processing
                                ? 'Memproses...'
                                : 'Aktifkan Kembali Kontrak'}
                        </button>
                    </form>
                </div>
            )}
        </div>
    );
}
