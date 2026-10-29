import React, { useState } from 'react';
import { useForm, router } from '@inertiajs/react';
import {
    MessageSquare,
    Briefcase,
    FileArchive,
    Download,
    Star,
    Check,
    FileImage,
    ShieldCheck,
    UploadCloud,
    AlertCircle,
    ArrowRight,
    RefreshCw,
    Coins,
} from 'lucide-react';
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
    const formatCurrency = (num: number) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
        }).format(num);
    };

    // Financial calculations
    const contractAmount = quest.accepted_bid_amount || quest.max_salary || 0;
    const dpPercentage = quest.dp_percentage || 10;
    const dpAmount = quest.dp_amount || Math.round((contractAmount * dpPercentage) / 100);
    const remainingBalance = Math.max(0, contractAmount - dpAmount);

    // Local form states
    const [showConfirmDeliveryModal, setShowConfirmDeliveryModal] = useState(false);
    const [showZipRevisionModal, setShowZipRevisionModal] = useState(false);
    const [isConfirmingDp, setIsConfirmingDp] = useState(false);

    // DP Upload Form
    const dpForm = useForm({
        dp_proof: null as File | null,
    });

    const handleUploadDpProof = (e: React.FormEvent) => {
        e.preventDefault();
        dpForm.post(`/admin/quests/${quest.slug}/upload-dp`, {
            preserveScroll: true,
            onSuccess: () => {
                dpForm.reset();
            },
        });
    };

    // Direct Confirm DP Action (Admin bypass / verification)
    const handleConfirmDp = () => {
        if (!confirm('Apakah Anda yakin ingin mengonfirmasi penerimaan uang muka (DP) ini? Status quest akan otomatis berpindah ke "Dalam Pengerjaan" (ongoing).')) {
            return;
        }

        setIsConfirmingDp(true);
        router.post(
            `/admin/quests/${quest.slug}/confirm-dp`,
            {},
            {
                preserveScroll: true,
                onFinish: () => setIsConfirmingDp(false),
            },
        );
    };

    // Final Payment (Pelunasan) Form
    const paymentForm = useForm({
        payment_proof: null as File | null,
    });

    const handleUploadPaymentProof = (e: React.FormEvent) => {
        e.preventDefault();
        paymentForm.post(`/admin/quests/${quest.slug}/upload-payment`, {
            preserveScroll: true,
            onSuccess: () => {
                paymentForm.reset();
            },
        });
    };

    // Final Delivery Confirmation Form (with Star rating & review)
    const confirmDeliveryForm = useForm({
        rating: 5,
        rating_comment: '',
    });

    const handleConfirmDelivery = (e: React.FormEvent) => {
        e.preventDefault();
        confirmDeliveryForm.post(`/admin/quests/${quest.slug}/confirm-delivery`, {
            preserveScroll: true,
            onSuccess: () => {
                setShowConfirmDeliveryModal(false);
                confirmDeliveryForm.reset();
            },
        });
    };

    // Request Master ZIP Revision Form
    const zipRevisionForm = useForm({
        revision_note: '',
    });

    const handleRequestZipRevision = (e: React.FormEvent) => {
        e.preventDefault();
        zipRevisionForm.post(`/admin/quests/${quest.slug}/request-delivery-revision`, {
            preserveScroll: true,
            onSuccess: () => {
                setShowZipRevisionModal(false);
                zipRevisionForm.reset();
            },
        });
    };

    const acceptedBid = bids.find(
        (b) => b.status === 'accepted' || b.student?._id === quest.worker_id,
    );

    return (
        <div className="relative space-y-6 overflow-hidden rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-gradient-to-b dark:from-[#0e0e1a] dark:to-[#090910]">
            <div className="absolute top-0 right-8 left-8 h-px bg-gradient-to-r from-transparent via-slate-300 to-transparent dark:via-slate-700" />
            
            {/* Header with worker chat shortcut */}
            <div className="flex items-center justify-between border-b border-slate-200 pb-3 dark:border-slate-800">
                <h3 className="text-sm font-extrabold tracking-wider text-slate-900 uppercase dark:text-white">
                    Alur Kerja & Pembayaran Quest
                </h3>

                {acceptedBid && quest.worker && (
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
                        {Boolean(acceptedBid.unread_messages_count && acceptedBid.unread_messages_count > 0) && (
                            <span className="absolute -top-1.5 -right-1.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-red-500 px-1.5 text-[10px] font-extrabold text-white ring-2 ring-white animate-pulse dark:ring-slate-900">
                                {acceptedBid.unread_messages_count > 99
                                    ? '99+'
                                    : acceptedBid.unread_messages_count}
                            </span>
                        )}
                    </button>
                )}
            </div>

            {/* Worker summary header */}
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

                    <div className="flex items-center gap-2">
                        <span className="rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs font-bold text-slate-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200">
                            Status: <span className="uppercase text-indigo-600 dark:text-indigo-400">{quest.status}</span>
                        </span>
                    </div>
                </div>
            ) : (
                <div className="py-6 text-center text-slate-500 dark:text-slate-400">
                    <Briefcase className="mx-auto mb-2 h-8 w-8 text-indigo-500 opacity-60" />
                    <p className="text-xs font-extrabold text-slate-800 uppercase dark:text-slate-300">
                        Belum ada pekerja ditunjuk.
                    </p>
                    <p className="text-[11px] font-semibold text-slate-600 dark:text-slate-400">
                        Silakan terima salah satu penawaran masuk pada tab "Pelamar" untuk memulai pengerjaan quest.
                    </p>
                </div>
            )}

            {/* P2P Financial Breakdown Card */}
            {quest.worker && quest.status !== 'draft' && (
                <div className="rounded-xl border border-indigo-500/20 bg-indigo-500/5 p-4 dark:border-indigo-500/20 dark:bg-indigo-950/20">
                    <div className="mb-2.5 flex items-center gap-2 text-indigo-700 dark:text-indigo-400">
                        <Coins size={16} />
                        <h4 className="text-xs font-extrabold tracking-wider uppercase">
                            Struktur Kontrak & Rincian Pembayaran P2P
                        </h4>
                    </div>

                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                        <div className="rounded-lg border border-slate-200 bg-white p-3 dark:border-slate-800 dark:bg-slate-900/80">
                            <span className="block text-[10px] font-bold text-slate-500 uppercase dark:text-slate-400">
                                Total Nilai Kontrak
                            </span>
                            <span className="text-base font-extrabold text-slate-900 dark:text-white">
                                {formatCurrency(contractAmount)}
                            </span>
                            <span className="mt-1 block text-[10px] text-slate-500 dark:text-slate-400">
                                Sesuai tawaran pelamar
                            </span>
                        </div>

                        <div className="rounded-lg border border-slate-200 bg-white p-3 dark:border-slate-800 dark:bg-slate-900/80">
                            <div className="flex items-center justify-between">
                                <span className="block text-[10px] font-bold text-slate-500 uppercase dark:text-slate-400">
                                    Uang Muka (DP {dpPercentage}%)
                                </span>
                                {quest.dp_confirmed_at || ['ongoing', 'submitted', 'approved', 'payment', 'delivered', 'completed'].includes(quest.status) ? (
                                    <span className="rounded bg-emerald-500/10 px-1.5 py-0.5 text-[9px] font-bold text-emerald-600 dark:text-emerald-400">
                                        Terkonfirmasi
                                    </span>
                                ) : quest.dp_proof ? (
                                    <span className="rounded bg-amber-500/10 px-1.5 py-0.5 text-[9px] font-bold text-amber-600 dark:text-amber-400">
                                        Diunggah
                                    </span>
                                ) : (
                                    <span className="rounded bg-red-500/10 px-1.5 py-0.5 text-[9px] font-bold text-red-600 dark:text-red-400">
                                        Belum Ada
                                    </span>
                                )}
                            </div>
                            <span className="text-base font-extrabold text-amber-600 dark:text-amber-400">
                                {formatCurrency(dpAmount)}
                            </span>
                            <span className="mt-1 block text-[10px] text-slate-500 dark:text-slate-400">
                                Dibayar di awal pengerjaan
                            </span>
                        </div>

                        <div className="rounded-lg border border-slate-200 bg-white p-3 dark:border-slate-800 dark:bg-slate-900/80">
                            <div className="flex items-center justify-between">
                                <span className="block text-[10px] font-bold text-slate-500 uppercase dark:text-slate-400">
                                    Sisa Pelunasan Akhir
                                </span>
                                {['payment', 'delivered', 'completed'].includes(quest.status) ? (
                                    <span className="rounded bg-emerald-500/10 px-1.5 py-0.5 text-[9px] font-bold text-emerald-600 dark:text-emerald-400">
                                        {quest.status === 'completed' ? 'Selesai & Lunas' : 'Diunggah'}
                                    </span>
                                ) : quest.status === 'approved' ? (
                                    <span className="animate-pulse rounded bg-indigo-500/20 px-1.5 py-0.5 text-[9px] font-bold text-indigo-700 dark:text-indigo-300">
                                        Wajib Ditransfer
                                    </span>
                                ) : (
                                    <span className="rounded bg-slate-100 px-1.5 py-0.5 text-[9px] font-bold text-slate-600 dark:bg-slate-800 dark:text-slate-400">
                                        Menunggu Hasil
                                    </span>
                                )}
                            </div>
                            <span className="text-base font-extrabold text-emerald-600 dark:text-emerald-400">
                                {formatCurrency(remainingBalance)}
                            </span>
                            <span className="mt-1 block text-[10px] text-slate-500 dark:text-slate-400">
                                Dibayar setelah pekerjaan disetujui
                            </span>
                        </div>
                    </div>
                </div>
            )}

            {/* PHASE 1: DOWN PAYMENT (DP) */}
            {quest.status === 'down_payment' && (
                <div className="space-y-4 border-t border-slate-200 pt-4 dark:border-slate-800">
                    <div className="flex flex-col gap-2 rounded-xl border border-amber-500/30 bg-amber-500/10 p-4 text-center">
                        <span className="block text-xs font-bold tracking-wider text-amber-700 uppercase dark:text-amber-300">
                            Tahap Pembayaran Awal (Uang Muka / DP {dpPercentage}%)
                        </span>
                        <p className="text-[11px] font-semibold text-slate-700 dark:text-slate-300">
                            Pekerja telah dipilih. Nominal DP adalah{' '}
                            <strong className="text-amber-600 dark:text-amber-400">{formatCurrency(dpAmount)}</strong>{' '}
                            ({dpPercentage}% dari total kontrak {formatCurrency(contractAmount)}).
                            {quest.dp_proof
                                ? ' Bukti transfer DP telah diunggah. Menunggu konfirmasi penerimaan dari pekerja atau verifikasi langsung oleh Admin.'
                                : ' Silakan transfer uang muka ke pekerja dan unggah bukti transfer di bawah ini agar pengerjaan dapat dimulai.'}
                        </p>
                    </div>

                    {/* Upload DP Form (if not yet uploaded) */}
                    {!quest.dp_proof && (
                        <div className="space-y-3 rounded-xl border border-slate-300 bg-slate-50/70 p-4 dark:border-slate-800 dark:bg-[#030712]">
                            <h4 className="text-xs font-extrabold text-slate-900 uppercase dark:text-white">
                                Unggah Bukti Transfer Uang Muka (DP)
                            </h4>
                            <p className="text-[11px] font-semibold text-slate-600 dark:text-slate-400">
                                Unggah tangkapan layar / struk mutasi m-banking atau e-wallet atas transfer DP senilai{' '}
                                <strong>{formatCurrency(dpAmount)}</strong>.
                            </p>

                            <form onSubmit={handleUploadDpProof} className="space-y-4">
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-bold text-slate-600 uppercase dark:text-slate-400">
                                        Berkas Struk / Bukti Transfer DP <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="file"
                                        required
                                        accept="image/png, image/jpeg, image/jpg, image/webp"
                                        onChange={(e) => {
                                            const file = e.target.files?.[0];
                                            if (file) {
                                                dpForm.setData('dp_proof', file);
                                            }
                                        }}
                                        className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs text-slate-800 focus:border-indigo-600 focus:outline-none dark:border-slate-800 dark:bg-[#030712] dark:text-white"
                                    />
                                    {dpForm.errors.dp_proof && (
                                        <p className="text-xs font-semibold text-red-500">
                                            {dpForm.errors.dp_proof}
                                        </p>
                                    )}
                                </div>

                                <button
                                    type="submit"
                                    disabled={dpForm.processing}
                                    className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-xs font-bold tracking-wider text-white uppercase shadow-md transition-all hover:bg-indigo-700 disabled:opacity-50"
                                >
                                    <UploadCloud size={16} />
                                    {dpForm.processing ? 'Mengunggah Bukti DP...' : 'Kirim Bukti Pembayaran DP'}
                                </button>
                            </form>
                        </div>
                    )}

                    {/* Display DP Proof & Admin Bypass Button */}
                    {quest.dp_proof && (
                        <div className="space-y-4 rounded-xl border border-slate-300 bg-slate-50/70 p-4 text-xs dark:border-slate-800 dark:bg-[#030712]">
                            <div className="flex items-center justify-between">
                                <span className="block text-[10px] font-bold tracking-wider text-slate-600 uppercase dark:text-slate-400">
                                    Bukti Transfer DP
                                </span>
                                <span className="rounded bg-amber-500/10 px-2 py-0.5 text-[10px] font-bold text-amber-600 dark:text-amber-400">
                                    Menunggu Konfirmasi
                                </span>
                            </div>

                            <div className="flex flex-col gap-3">
                                <div className="flex items-center justify-between gap-3 rounded-lg border border-slate-200 bg-white p-3 dark:border-slate-800 dark:bg-slate-900">
                                    <div className="flex min-w-0 items-center gap-2.5">
                                        <FileImage className="h-6 w-6 shrink-0 text-indigo-600 dark:text-indigo-400" />
                                        <div className="min-w-0">
                                            <p className="truncate text-xs font-bold text-slate-900 dark:text-slate-200">
                                                {quest.dp_proof.name}
                                            </p>
                                            <p className="text-[10px] font-semibold text-slate-500 dark:text-slate-400">
                                                Diunggah:{' '}
                                                {quest.dp_uploaded_at
                                                    ? new Date(quest.dp_uploaded_at).toLocaleDateString('id-ID', {
                                                          dateStyle: 'medium',
                                                      })
                                                    : '-'}
                                            </p>
                                        </div>
                                    </div>
                                    <a
                                        href={quest.dp_proof.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg bg-indigo-500/10 text-indigo-600 hover:bg-indigo-500/20 dark:text-indigo-400"
                                        title="Unduh / Lihat Bukti Transfer DP"
                                    >
                                        <Download size={16} />
                                    </a>
                                </div>

                                <div className="relative max-w-sm overflow-hidden rounded-lg border border-slate-300 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
                                    <a
                                        href={quest.dp_proof.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="group block"
                                    >
                                        <img
                                            src={quest.dp_proof.url}
                                            alt="Bukti Transfer DP"
                                            className="max-h-48 w-full object-contain transition-transform duration-300 group-hover:scale-105"
                                        />
                                        <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                                            <span className="rounded bg-black/60 px-2 py-1 text-[9px] font-bold tracking-wider text-white uppercase">
                                                Perbesar Bukti 🔍
                                            </span>
                                        </div>
                                    </a>
                                </div>
                            </div>

                            {/* Superadmin Direct Confirm Button */}
                            <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-3.5 dark:border-emerald-500/30">
                                <div className="flex items-center gap-2 text-emerald-800 dark:text-emerald-300">
                                    <ShieldCheck size={18} />
                                    <span className="text-xs font-bold uppercase">
                                        Aksi Superadmin: Verifikasi & Konfirmasi DP Langsung
                                    </span>
                                </div>
                                <p className="mt-1 text-[11px] text-slate-700 dark:text-slate-300">
                                    Jika dana DP telah masuk ke rekening atau terverifikasi di mutasi kas, Anda dapat langsung mengonfirmasi penerimaan DP untuk memulai tahap pengerjaan tanpa harus menunggu tindakan pekerja.
                                </p>
                                <button
                                    type="button"
                                    onClick={handleConfirmDp}
                                    disabled={isConfirmingDp}
                                    className="mt-3 flex cursor-pointer items-center justify-center gap-2 rounded-lg bg-emerald-600 px-4 py-2 text-xs font-bold tracking-wider text-white uppercase shadow-sm transition-colors hover:bg-emerald-700 disabled:opacity-50"
                                >
                                    <Check size={14} />
                                    {isConfirmingDp ? 'Mengonfirmasi...' : 'Konfirmasi Penerimaan DP (Mulai Pengerjaan)'}
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            )}

            {/* PHASE 2: ONGOING OR REVISION */}
            {['ongoing', 'revision'].includes(quest.status) && (
                <div className="space-y-4 border-t border-slate-200 pt-4 dark:border-slate-800">
                    <p className="text-xs leading-relaxed font-semibold text-slate-600 dark:text-slate-400">
                        Status quest ini adalah{' '}
                        <strong className="font-bold text-slate-900 dark:text-white">
                            {quest.status === 'revision' ? 'Dalam Revisi' : 'Dalam Pengerjaan'}
                        </strong>
                        . Pekerja saat ini sedang menyelesaikan deskripsi tugas dan hasil pekerjaan.
                    </p>
                    <RevisionHistory quest={quest} viewType="admin_ongoing" />
                </div>
            )}

            {/* PHASE 3: SUBMITTED (PREVIEW REVIEW) */}
            {quest.status === 'submitted' && (
                <div className="space-y-5 border-t border-slate-200 pt-4 dark:border-slate-800">
                    <div className="flex flex-col gap-1 rounded-xl border border-amber-500/30 bg-amber-500/10 p-4 text-center">
                        <span className="block text-xs font-bold tracking-wider text-amber-700 uppercase dark:text-amber-300">
                            Penyerahan Tugas Masuk (Tinjauan Milestone)
                        </span>
                        <p className="text-xs leading-relaxed font-semibold text-slate-700 dark:text-slate-300">
                            Pekerja telah melakukan penyerahan tugas untuk ditinjau. Silakan periksa hasil pekerjaannya di bawah ini.
                        </p>
                    </div>

                    <RevisionHistory quest={quest} viewType="admin_submitted" />

                    <div className="space-y-3.5 rounded-xl border border-slate-300 bg-slate-50/70 p-4 text-xs dark:border-slate-800 dark:bg-[#030712]">
                        {quest.submission_file && (
                            <div className="space-y-1">
                                <strong className="block text-[10px] tracking-wider text-slate-600 uppercase dark:text-slate-400">
                                    Berkas Pekerjaan Utama
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
                                        title="Unduh Berkas di Tab Baru"
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
                                Setujui Hasil (Lanjut ke Pelunasan)
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
                            className="space-y-4 rounded-xl border border-emerald-500/20 bg-emerald-50/50 p-4 dark:border-emerald-900/40 dark:bg-emerald-950/20"
                        >
                            <h4 className="text-xs font-bold text-emerald-800 uppercase dark:text-emerald-400">
                                Konfirmasi Persetujuan Hasil Pekerjaan
                            </h4>
                            <p className="text-xs text-slate-600 dark:text-slate-400">
                                Dengan menyetujui hasil pengerjaan ini, Anda menyatakan bahwa milestone pekerja telah memenuhi ekspektasi. Quest akan beralih ke tahap <strong>Pelunasan (Pembayaran Akhir)</strong>.
                            </p>

                            <div className="flex gap-2">
                                <button
                                    type="submit"
                                    disabled={approveForm.processing}
                                    className="cursor-pointer rounded-lg bg-emerald-600 px-4 py-2 text-xs font-bold tracking-wider text-white uppercase transition-colors hover:bg-emerald-700 disabled:opacity-50"
                                >
                                    {approveForm.processing ? 'Menyetujui...' : 'Ya, Setujui & Lanjutkan ke Pelunasan'}
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
                                    onChange={(e) =>
                                        rejectForm.setData('revision_note', e.target.value)
                                    }
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

            {/* PHASE 4: APPROVED (PELUNASAN / FINAL PAYMENT) */}
            {quest.status === 'approved' && (
                <div className="space-y-4 border-t border-slate-200 pt-4 dark:border-slate-800">
                    <div className="flex flex-col gap-2 rounded-xl border border-indigo-500/30 bg-indigo-500/10 p-4 text-center">
                        <span className="block text-xs font-bold tracking-wider text-indigo-700 uppercase dark:text-indigo-300">
                            Hasil Disetujui & Wajib Pembayaran Akhir (Pelunasan)
                        </span>
                        <p className="text-[11px] font-semibold text-slate-700 dark:text-slate-300">
                            Hasil pekerjaan telah disetujui! Langkah berikutnya adalah mentransfer sisa pembayaran kontrak{' '}
                            (Sisa:{' '}
                            <strong className="text-emerald-600 dark:text-emerald-400">
                                {formatCurrency(remainingBalance)}
                            </strong>
                            ) ke rekening pekerja dan mengunggah bukti transfer akhir di bawah ini.
                        </p>
                    </div>

                    <div className="space-y-3 rounded-xl border border-slate-300 bg-slate-50/70 p-4 dark:border-slate-800 dark:bg-[#030712]">
                        <h4 className="text-xs font-extrabold text-slate-900 uppercase dark:text-white">
                            Unggah Bukti Transfer Pelunasan Akhir
                        </h4>
                        <p className="text-[11px] font-semibold text-slate-600 dark:text-slate-400">
                            Setelah bukti pelunasan diunggah, status akan beralih ke <strong>Menunggu Berkas Final</strong> dan pekerja akan mengunggah master arsip ZIP.
                        </p>

                        <form onSubmit={handleUploadPaymentProof} className="space-y-4">
                            <div className="space-y-1.5">
                                <label className="text-[10px] font-bold text-slate-600 uppercase dark:text-slate-400">
                                    Bukti Transfer Pelunasan <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="file"
                                    required
                                    accept="image/png, image/jpeg, image/jpg, image/webp"
                                    onChange={(e) => {
                                        const file = e.target.files?.[0];
                                        if (file) {
                                            paymentForm.setData('payment_proof', file);
                                        }
                                    }}
                                    className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs text-slate-800 focus:border-indigo-600 focus:outline-none dark:border-slate-800 dark:bg-[#030712] dark:text-white"
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
                                className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 py-2.5 text-xs font-bold tracking-wider text-white uppercase shadow-md transition-all hover:bg-emerald-700 disabled:opacity-50"
                            >
                                <UploadCloud size={16} />
                                {paymentForm.processing ? 'Mengunggah Bukti Pelunasan...' : 'Kirim Bukti Pembayaran Akhir (Pelunasan)'}
                            </button>
                        </form>
                    </div>
                </div>
            )}

            {/* PHASE 5: PAYMENT PROOF UPLOADED (WAITING FOR MASTER ZIP) */}
            {quest.status === 'payment' && (
                <div className="space-y-4 border-t border-slate-200 pt-4 dark:border-slate-800">
                    <div className="flex flex-col gap-2 rounded-xl border border-amber-500/30 bg-amber-500/10 p-4 text-center">
                        <span className="block text-xs font-bold tracking-wider text-amber-700 uppercase dark:text-amber-300">
                            Bukti Pelunasan Diunggah & Menunggu Berkas Master ZIP Final
                        </span>
                        <p className="text-[11px] font-semibold text-slate-700 dark:text-slate-300">
                            Bukti transfer pelunasan senilai{' '}
                            <strong className="text-emerald-600 dark:text-emerald-400">{formatCurrency(remainingBalance)}</strong>{' '}
                            telah diunggah. Sistem sedang menunggu pekerja mengonfirmasi mutasi rekening dan mengirimkan berkas proyek final master (.zip).
                        </p>
                    </div>

                    {quest.payment_proof && (
                        <div className="rounded-xl border border-slate-300 bg-slate-50/70 p-4 text-xs dark:border-slate-800 dark:bg-[#030712]">
                            <span className="mb-2 block text-[10px] font-bold tracking-wider text-slate-600 uppercase dark:text-slate-400">
                                Bukti Transfer Pelunasan
                            </span>
                            <div className="flex flex-col gap-3">
                                <div className="flex items-center justify-between gap-3 rounded-lg border border-slate-200 bg-white p-3 dark:border-slate-800 dark:bg-slate-900">
                                    <div className="flex min-w-0 items-center gap-2">
                                        <FileImage className="h-5 w-5 shrink-0 text-indigo-600 dark:text-indigo-400" />
                                        <div className="min-w-0">
                                            <p className="truncate text-xs font-bold text-slate-900 dark:text-slate-200">
                                                {quest.payment_proof.name}
                                            </p>
                                            <p className="text-[10px] font-semibold text-slate-500 dark:text-slate-400">
                                                Diunggah:{' '}
                                                {quest.payment_uploaded_at
                                                    ? new Date(quest.payment_uploaded_at).toLocaleDateString('id-ID', {
                                                          dateStyle: 'medium',
                                                      })
                                                    : '-'}
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
                                <div className="relative max-w-sm overflow-hidden rounded-lg border border-slate-300 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
                                    <a
                                        href={quest.payment_proof.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="group block"
                                    >
                                        <img
                                            src={quest.payment_proof.url}
                                            alt="Bukti Transfer Pembayaran"
                                            className="max-h-48 w-full object-contain transition-transform duration-300 group-hover:scale-105"
                                        />
                                        <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                                            <span className="rounded bg-black/60 px-2 py-1 text-[8px] font-bold tracking-wider text-white uppercase">
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

            {/* PHASE 6: DELIVERED (MASTER ZIP SUBMITTED - VERIFICATION & REVIEW) */}
            {quest.status === 'delivered' && (
                <div className="space-y-5 border-t border-slate-200 pt-4 dark:border-slate-800">
                    <div className="flex flex-col gap-1.5 rounded-xl border border-indigo-200 bg-indigo-50/20 p-4 dark:border-indigo-900/40 dark:bg-indigo-950/20">
                        <span className="block text-xs font-bold tracking-wider text-indigo-700 uppercase dark:text-indigo-400">
                            Master Berkas Proyek Final (ZIP) Telah Diunggah!
                        </span>
                        <p className="text-xs leading-relaxed text-slate-700 dark:text-slate-300">
                            Pekerja telah mengunggah seluruh berkas arsip final master. Silakan unduh dan verifikasi kelengkapan berkas sebelum memberikan konfirmasi penyelesaian akhir dan rating ulasan.
                        </p>
                    </div>

                    {quest.submission_file && (
                        <div className="space-y-2 rounded-xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-[#030712]">
                            <strong className="block text-[10px] tracking-wider text-slate-600 uppercase dark:text-slate-400">
                                Berkas Master ZIP Final
                            </strong>
                            <div className="flex items-center justify-between rounded-xl border border-indigo-200 bg-indigo-500/5 p-3 dark:border-slate-800 dark:bg-[#0d1117]">
                                <div className="flex min-w-0 items-center gap-3">
                                    <FileArchive className="h-6 w-6 shrink-0 text-indigo-500" />
                                    <div className="min-w-0">
                                        <p className="truncate text-xs font-bold text-slate-800 dark:text-slate-200">
                                            {quest.submission_file.name}
                                        </p>
                                        <p className="text-[10px] text-slate-400">
                                            {formatBytes(quest.submission_file.size)}
                                        </p>
                                    </div>
                                </div>
                                <a
                                    href={quest.submission_file.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex cursor-pointer items-center gap-1.5 rounded-lg bg-indigo-600 px-3.5 py-1.5 text-xs font-bold text-white shadow-xs transition-colors hover:bg-indigo-700"
                                >
                                    <Download size={14} /> Unduh Master ZIP
                                </a>
                            </div>
                        </div>
                    )}

                    {quest.submission_link && (
                        <div className="rounded-xl border border-slate-200 bg-slate-50 p-3 text-xs dark:border-slate-800 dark:bg-[#030712]">
                            <strong className="mb-1 block text-[10px] tracking-wider text-slate-600 uppercase dark:text-slate-400">
                                Link Demo / Deployment
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

                    {!showConfirmDeliveryModal && !showZipRevisionModal && (
                        <div className="flex flex-col gap-3 pt-2 sm:flex-row">
                            <button
                                type="button"
                                onClick={() => setShowConfirmDeliveryModal(true)}
                                className="flex-1 cursor-pointer rounded-xl bg-emerald-600 py-3 text-xs font-bold tracking-wider text-white uppercase shadow-md transition-all hover:bg-emerald-700"
                            >
                                Konfirmasi Berkas Sesuai & Selesaikan Quest
                            </button>
                            <button
                                type="button"
                                onClick={() => setShowZipRevisionModal(true)}
                                className="cursor-pointer rounded-xl border border-amber-300 bg-amber-50 px-4 py-3 text-xs font-bold tracking-wider text-amber-700 uppercase transition-colors hover:bg-amber-100 dark:border-amber-700/60 dark:bg-amber-950/20 dark:text-amber-400 dark:hover:bg-amber-900/30"
                            >
                                Minta Perbaikan / Kirim Ulang ZIP
                            </button>
                        </div>
                    )}

                    {/* Modal / Form Konfirmasi Akhir & Ulasan */}
                    {showConfirmDeliveryModal && (
                        <form
                            onSubmit={handleConfirmDelivery}
                            className="space-y-4 rounded-xl border border-emerald-300/80 bg-emerald-50/30 p-4 dark:border-emerald-900/50 dark:bg-emerald-950/20"
                        >
                            <h4 className="text-xs font-bold text-emerald-800 uppercase dark:text-emerald-400">
                                Konfirmasi Akhir & Penilaian Kinerja Pekerja
                            </h4>
                            <p className="text-xs text-slate-600 dark:text-slate-400">
                                Berikan penilaian bintang dan ulasan untuk pekerja sebelum menyelesaikan quest ini secara resmi. Reward EXP & Gold akan otomatis dicairkan ke pekerja.
                            </p>

                            <div className="space-y-1">
                                <label className="text-[10px] font-bold tracking-wider text-slate-600 uppercase dark:text-slate-400">
                                    Rating Bintang <span className="text-red-500">*</span>
                                </label>
                                <div className="flex gap-2 py-1">
                                    {[1, 2, 3, 4, 5].map((val) => (
                                        <button
                                            key={val}
                                            type="button"
                                            onClick={() => confirmDeliveryForm.setData('rating', val)}
                                            className="cursor-pointer transition-transform hover:scale-110 focus:outline-none"
                                        >
                                            <Star
                                                className={`h-7 w-7 ${
                                                    val <= confirmDeliveryForm.data.rating
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
                                    Ulasan Penyelesaian Pekerjaan
                                </label>
                                <textarea
                                    placeholder="Berikan ulasan tentang hasil akhir proyek dan dedikasi pekerja..."
                                    rows={3}
                                    value={confirmDeliveryForm.data.rating_comment}
                                    onChange={(e) => confirmDeliveryForm.setData('rating_comment', e.target.value)}
                                    className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs font-semibold text-slate-900 focus:border-emerald-600 focus:outline-none dark:border-slate-800 dark:bg-[#030712] dark:text-white"
                                />
                            </div>

                            <div className="flex gap-2">
                                <button
                                    type="submit"
                                    disabled={confirmDeliveryForm.processing}
                                    className="flex-1 cursor-pointer rounded-lg bg-emerald-600 py-2.5 text-xs font-bold tracking-wider text-white uppercase transition-colors hover:bg-emerald-700 disabled:opacity-50"
                                >
                                    {confirmDeliveryForm.processing ? 'Menyelesaikan Quest...' : 'Selesaikan Quest & Berikan Ulasan'}
                                </button>
                                <button
                                    type="button"
                                    onClick={() => {
                                        setShowConfirmDeliveryModal(false);
                                        confirmDeliveryForm.reset();
                                    }}
                                    className="rounded-lg px-4 py-2 text-xs font-bold tracking-wider text-slate-600 uppercase transition-colors hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
                                >
                                    Batal
                                </button>
                            </div>
                        </form>
                    )}

                    {/* Modal / Form Minta Revisi Master ZIP */}
                    {showZipRevisionModal && (
                        <form
                            onSubmit={handleRequestZipRevision}
                            className="space-y-4 rounded-xl border border-amber-300/80 bg-amber-50/30 p-4 dark:border-amber-900/50 dark:bg-amber-950/20"
                        >
                            <h4 className="text-xs font-bold text-amber-800 uppercase dark:text-amber-400">
                                Permintaan Perbaikan / Pengunggahan Ulang Berkas ZIP
                            </h4>
                            <p className="text-xs text-slate-600 dark:text-slate-400">
                                Jelaskan kelalaian atau berkas yang masih kurang dari arsip ZIP yang diunggah pekerja.
                            </p>

                            <div className="space-y-1">
                                <label className="text-[10px] font-bold tracking-wider text-slate-600 uppercase dark:text-slate-400">
                                    Catatan Kekurangan Berkas <span className="text-red-500">*</span>
                                </label>
                                <textarea
                                    required
                                    placeholder="Contoh: Berkas README dan konfigurasi deployment belum disertakan..."
                                    rows={4}
                                    value={zipRevisionForm.data.revision_note}
                                    onChange={(e) => zipRevisionForm.setData('revision_note', e.target.value)}
                                    className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs font-semibold text-slate-900 focus:border-amber-600 focus:outline-none dark:border-slate-800 dark:bg-[#030712] dark:text-white"
                                />
                            </div>

                            <div className="flex gap-2">
                                <button
                                    type="submit"
                                    disabled={zipRevisionForm.processing}
                                    className="flex-1 cursor-pointer rounded-lg bg-amber-600 py-2.5 text-xs font-bold tracking-wider text-white uppercase transition-colors hover:bg-amber-700 disabled:opacity-50"
                                >
                                    {zipRevisionForm.processing ? 'Mengirim...' : 'Kirim Catatan Perbaikan ZIP'}
                                </button>
                                <button
                                    type="button"
                                    onClick={() => {
                                        setShowZipRevisionModal(false);
                                        zipRevisionForm.reset();
                                    }}
                                    className="rounded-lg px-4 py-2 text-xs font-bold tracking-wider text-slate-600 uppercase transition-colors hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
                                >
                                    Batal
                                </button>
                            </div>
                        </form>
                    )}
                </div>
            )}

            {/* PHASE 7: COMPLETED */}
            {quest.status === 'completed' && (
                <div className="space-y-4 border-t border-slate-200 pt-4 dark:border-slate-800">
                    <div className="flex flex-col gap-1 rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-4 text-center">
                        <Check className="mx-auto h-8 w-8 text-emerald-600 dark:text-emerald-400" />
                        <span className="block text-xs font-bold tracking-wider text-emerald-700 uppercase dark:text-emerald-300">
                            Quest Resmi Diselesaikan & Lunas
                        </span>
                        <p className="text-xs leading-relaxed font-semibold text-slate-700 dark:text-slate-300">
                            Pekerjaan telah disetujui, pembayaran DP & Pelunasan telah selesai, berkas final master ZIP telah terverifikasi, dan reward telah dicairkan.
                        </p>
                    </div>

                    {quest.rating && (
                        <div className="space-y-2 rounded-xl border border-slate-300 bg-slate-50/70 p-4 text-center dark:border-slate-800 dark:bg-[#030712]">
                            <span className="block text-[10px] font-bold tracking-wider text-slate-600 uppercase dark:text-slate-400">
                                Ulasan Penilaian
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
                                    Berkas Proyek Final (Master ZIP)
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
                                        title="Unduh Berkas Master ZIP"
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
                                    Bukti Transfer Pembayaran Akhir (Pelunasan)
                                </strong>
                                <div className="flex items-center justify-between rounded-xl border border-indigo-500/30 bg-indigo-500/10 p-2.5 dark:border-indigo-500/30">
                                    <div className="flex min-w-0 items-center gap-2.5">
                                        <FileImage className="h-5 w-5 shrink-0 text-indigo-600 dark:text-indigo-400" />
                                        <div className="min-w-0">
                                            <p className="truncate text-xs font-bold text-slate-900 dark:text-slate-200">
                                                {quest.payment_proof.name}
                                            </p>
                                            <p className="text-[10px] font-semibold text-slate-500 dark:text-slate-400">
                                                {quest.payment_uploaded_at
                                                    ? new Date(quest.payment_uploaded_at).toLocaleDateString('id-ID', {
                                                          dateStyle: 'medium',
                                                      })
                                                    : '-'}
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
                            </div>
                        )}

                        {quest.dp_proof && (
                            <div className="mt-2.5 space-y-2">
                                <strong className="mb-1 block text-[10px] tracking-wider text-slate-600 uppercase dark:text-slate-400">
                                    Bukti Transfer Pembayaran Awal (DP)
                                </strong>
                                <div className="flex items-center justify-between rounded-xl border border-amber-500/30 bg-amber-500/10 p-2.5 dark:border-amber-500/30">
                                    <div className="flex min-w-0 items-center gap-2.5">
                                        <FileImage className="h-5 w-5 shrink-0 text-amber-600 dark:text-amber-400" />
                                        <div className="min-w-0">
                                            <p className="truncate text-xs font-bold text-slate-900 dark:text-slate-200">
                                                {quest.dp_proof.name}
                                            </p>
                                            <p className="text-[10px] font-semibold text-slate-500 dark:text-slate-400">
                                                {quest.dp_uploaded_at
                                                    ? new Date(quest.dp_uploaded_at).toLocaleDateString('id-ID', {
                                                          dateStyle: 'medium',
                                                      })
                                                    : '-'}
                                            </p>
                                        </div>
                                    </div>
                                    <a
                                        href={quest.dp_proof.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex cursor-pointer items-center justify-center rounded-lg p-1.5 text-amber-600 transition-colors hover:bg-amber-500/20 dark:text-amber-400"
                                        title="Unduh Bukti Transfer DP"
                                    >
                                        <Download className="h-4.5 w-4.5" />
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
