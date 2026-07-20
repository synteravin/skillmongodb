import React from 'react';
import { useForm } from '@inertiajs/react';
import { FileArchive, MessageSquare, Download, CheckCircle2, FileImage } from 'lucide-react';
import RevisionHistory from './RevisionHistory';
import { Quest, Bid } from '@/types/quest';

interface Props {
    quest: Quest;
    myBid: Bid | null;
    setSelectedChatBid: (bid: { id: string; name: string } | null) => void;
    formatBytes: (bytes: number) => string;
}

export default function WorkerProjectPanel({
    quest,
    myBid,
    setSelectedChatBid,
    formatBytes,
}: Props) {
    const submissionForm = useForm<{
        submission_file: File | null;
        submission_link: string;
        submission_note: string;
    }>({
        submission_file: null,
        submission_link: '',
        submission_note: '',
    });

    const finalZipForm = useForm<{
        submission_file: File | null;
    }>({
        submission_file: null,
    });

    const handleWorkSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        submissionForm.post(`/student/quests/${quest._id}/submit`, {
            onSuccess: () => submissionForm.reset(),
        });
    };

    const handleFinalZipSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        finalZipForm.post(`/student/quests/${quest._id}/submit-final-zip`, {
            onSuccess: () => finalZipForm.reset(),
        });
    };

    return (
        <div className="relative overflow-hidden space-y-5 rounded-2xl border border-slate-200 bg-white/70 p-6 shadow-md backdrop-blur-md transition-all duration-300 dark:border-slate-800/80 dark:bg-gradient-to-b dark:from-[#0e0e1a] dark:to-[#090910]">
            <div className="absolute top-0 right-8 left-8 h-px bg-gradient-to-r from-transparent via-slate-300 to-transparent dark:via-slate-700 pointer-events-none select-none z-0" />
            <div className="relative z-10 flex items-center justify-between border-b border-slate-100 pb-3 dark:border-slate-800">
                <h3 className="font-['Orbitron'] text-sm font-bold tracking-wider text-slate-800 uppercase dark:text-blue-200">
                    Penyerahan Tugas Proyek
                </h3>
                {myBid && (
                    <button
                        type="button"
                        onClick={() =>
                            setSelectedChatBid({
                                id: myBid._id,
                                name: quest.creator.name,
                            })
                        }
                        className="relative flex shrink-0 cursor-pointer items-center gap-1.5 rounded-xl bg-indigo-600 px-3 py-1.5 font-['Orbitron'] text-xs font-bold tracking-wider text-white uppercase shadow-sm transition-all duration-350 hover:bg-indigo-700"
                    >
                        <MessageSquare size={12} />
                        Chat Pemilik
                        {myBid.unread_messages_count > 0 && (
                            <span className="absolute -top-1 -right-1 flex h-4 w-4 animate-pulse items-center justify-center rounded-full bg-red-500 text-[8px] font-black text-white ring-2 ring-white dark:ring-slate-900">
                                {myBid.unread_messages_count}
                            </span>
                        )}
                    </button>
                )}
            </div>

            {quest.status === 'ongoing' && (
                <div className="space-y-4">
                    <RevisionHistory quest={quest} viewType="worker_ongoing" />

                    <form onSubmit={handleWorkSubmit} className="space-y-4 font-['Oxanium']">
                        <p className="text-xs leading-relaxed text-slate-500 dark:text-blue-300/60">
                            Kirimkan hasil pekerjaan Anda agar pemilik quest
                            dapat meninjau dan memberikan persetujuan pengerjaan.
                        </p>

                        {/* ZIP Deliverable File Input with Drag-and-Drop */}
                        <div className="space-y-2">
                            <label className="flex items-center gap-1.5 font-['Orbitron'] text-xs font-bold text-slate-600 uppercase dark:text-blue-200">
                                <FileArchive className="h-4 w-4 text-amber-500" />
                                Berkas Proyek Utama (ZIP){' '}
                                <span className="font-normal text-slate-400">
                                    (Opsional)
                                </span>
                            </label>

                            <input
                                id="submission-file-input"
                                type="file"
                                accept=".zip"
                                onChange={(e) => {
                                    const files = e.target.files;
                                    if (files && files.length > 0) {
                                        submissionForm.setData(
                                            'submission_file',
                                            files[0],
                                        );
                                    }
                                }}
                                className="hidden"
                            />

                            {submissionForm.data.submission_file ? (
                                <div className="flex items-center justify-between rounded-xl border border-purple-500/30 bg-purple-500/5 p-3.5">
                                    <div className="flex min-w-0 items-center gap-3">
                                        <FileArchive className="h-6 w-6 shrink-0 text-purple-500" />
                                        <div className="min-w-0">
                                            <p className="truncate text-xs font-bold text-slate-700 dark:text-slate-200">
                                                {submissionForm.data.submission_file.name}
                                            </p>
                                            <p className="text-[10px] text-slate-400">
                                                {(
                                                    submissionForm.data.submission_file.size /
                                                    1024 /
                                                    1024
                                                ).toFixed(2)}{' '}
                                                MB
                                            </p>
                                        </div>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() =>
                                            submissionForm.setData(
                                                'submission_file',
                                                null,
                                            )
                                        }
                                        className="shrink-0 cursor-pointer rounded-lg px-2.5 py-1 font-['Orbitron'] text-[10px] font-bold tracking-wider text-red-650 uppercase transition-colors hover:bg-red-500/10 dark:text-red-400"
                                    >
                                        Hapus
                                    </button>
                                </div>
                            ) : (
                                <div
                                    onClick={() =>
                                        document
                                            .getElementById('submission-file-input')
                                            ?.click()
                                    }
                                    onDragOver={(e) => {
                                        e.preventDefault();
                                        e.currentTarget.classList.add(
                                            'border-purple-500',
                                            'bg-purple-500/5',
                                        );
                                    }}
                                    onDragLeave={(e) => {
                                        e.preventDefault();
                                        e.currentTarget.classList.remove(
                                            'border-purple-500',
                                            'bg-purple-500/5',
                                        );
                                    }}
                                    onDrop={(e) => {
                                        e.preventDefault();
                                        e.currentTarget.classList.remove(
                                            'border-purple-500',
                                            'bg-purple-500/5',
                                        );
                                        const files = e.dataTransfer.files;
                                        if (
                                            files &&
                                            files.length > 0 &&
                                            files[0].name.endsWith('.zip')
                                        ) {
                                            submissionForm.setData(
                                                'submission_file',
                                                files[0],
                                            );
                                        }
                                    }}
                                    className="flex cursor-pointer flex-col items-center justify-center gap-1.5 rounded-xl border-2 border-dashed border-slate-200 bg-slate-50/50 p-5 text-center transition-all duration-300 hover:border-purple-500 dark:border-slate-800/80 dark:bg-black/20 dark:hover:border-purple-400"
                                >
                                    <FileArchive className="h-8 w-8 text-slate-400 dark:text-blue-500/40" />
                                    <span className="text-xs font-bold text-slate-600 dark:text-blue-300">
                                        Seret & lepas berkas ZIP
                                    </span>
                                    <span className="text-[10px] text-slate-400">
                                        atau klik untuk memilih berkas
                                    </span>
                                </div>
                            )}

                            {submissionForm.progress && (
                                <div className="space-y-1">
                                    <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-200 dark:bg-slate-800">
                                        <div
                                            className="h-1.5 animate-pulse rounded-full bg-purple-600 transition-all duration-300"
                                            style={{
                                                width: `${submissionForm.progress.percentage}%`,
                                            }}
                                        />
                                    </div>
                                    <span className="block text-right font-['Orbitron'] text-[8px] font-bold tracking-widest text-slate-400 uppercase">
                                        Mengunggah: {submissionForm.progress.percentage}%
                                    </span>
                                </div>
                            )}

                            {submissionForm.errors.submission_file && (
                                <p className="text-xs font-semibold text-red-500">
                                    {submissionForm.errors.submission_file}
                                </p>
                            )}
                        </div>

                        {/* Required Link Input */}
                        <div className="space-y-1.5">
                            <label className="text-xs font-bold text-slate-600 uppercase dark:text-blue-200">
                                Tautan Repositori / Demo Hasil Pekerjaan{' '}
                                <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="url"
                                placeholder="https://github.com/username/project"
                                required
                                value={submissionForm.data.submission_link}
                                onChange={(e) =>
                                    submissionForm.setData(
                                        'submission_link',
                                        e.target.value,
                                    )
                                }
                                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-xs text-slate-800 focus:border-purple-500 focus:outline-none dark:border-slate-800 dark:bg-black/20 dark:text-white"
                            />
                            {submissionForm.errors.submission_link && (
                                <p className="text-xs font-semibold text-red-500">
                                    {submissionForm.errors.submission_link}
                                </p>
                            )}
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-xs font-bold text-slate-600 uppercase dark:text-blue-200">
                                Catatan Tambahan
                            </label>
                            <textarea
                                placeholder="Berikan deskripsi singkat tentang pengiriman pekerjaan ini..."
                                rows={4}
                                value={submissionForm.data.submission_note}
                                onChange={(e) =>
                                    submissionForm.setData(
                                        'submission_note',
                                        e.target.value,
                                    )
                                }
                                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-xs text-slate-800 focus:border-purple-500 focus:outline-none dark:border-slate-800 dark:bg-black/20 dark:text-white"
                            />
                            {submissionForm.errors.submission_note && (
                                <p className="text-xs font-semibold text-red-500">
                                    {submissionForm.errors.submission_note}
                                </p>
                            )}
                        </div>

                        <button
                            type="submit"
                            disabled={submissionForm.processing}
                            className="w-full cursor-pointer rounded-xl bg-indigo-600 py-2.5 font-['Orbitron'] text-xs font-semibold tracking-wider text-white uppercase shadow-md transition-all hover:bg-indigo-700 disabled:opacity-50"
                        >
                            {submissionForm.processing
                                ? 'Mengirim...'
                                : 'Kirim Hasil Pekerjaan'}
                        </button>
                    </form>
                </div>
            )}

            {quest.status === 'approved' && (
                <div className="space-y-4 font-['Oxanium']">
                    <div className="flex flex-col gap-2 rounded-xl border border-indigo-500/25 bg-indigo-500/10 p-4 text-center">
                        <CheckCircle2 className="mx-auto h-8 w-8 text-indigo-500" />
                        <span className="block text-xs font-bold tracking-wider text-indigo-600 uppercase dark:text-indigo-400">
                            Persetujuan Diterima! Menunggu Pembayaran
                        </span>
                        <p className="text-xs leading-relaxed text-slate-500 dark:text-blue-300/60">
                            Kerja bagus! Hasil pengerjaan Anda telah disetujui. Saat ini sistem menunggu pembuat quest mengunggah bukti transfer pembayaran secara offline. Anda akan dapat mengunggah berkas proyek final ZIP dan menyelesaikan quest setelah bukti transfer dikirim.
                        </p>
                    </div>
                </div>
            )}

            {quest.status === 'payment' && (
                <div className="space-y-4 font-['Oxanium']">
                    <div className="flex flex-col gap-2 rounded-xl border border-amber-500/20 bg-amber-500/10 p-4 text-center">
                        <CheckCircle2 className="mx-auto h-8 w-8 text-amber-500" />
                        <span className="block text-xs font-bold tracking-wider text-amber-600 uppercase dark:text-amber-400">
                            Bukti Pembayaran Diunggah
                        </span>
                        <p className="text-xs leading-relaxed text-slate-500 dark:text-slate-305">
                            Pembuat quest telah mengunggah bukti transfer pembayaran. Silakan periksa rekening Anda. Jika dana telah masuk, unggah berkas proyek final (.zip) Anda di bawah ini untuk meresmikan penyelesaian quest dan mengklaim hadiah.
                        </p>
                    </div>

                    {quest.payment_proof && (
                        <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800/60 dark:bg-black/20">
                            <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">
                                Bukti Transfer Pembuat
                            </span>
                            <div className="flex flex-col gap-3">
                                <div className="flex items-center justify-between gap-3">
                                    <div className="flex min-w-0 items-center gap-2">
                                        <FileImage className="h-5 w-5 shrink-0 text-indigo-500" />
                                        <div className="min-w-0">
                                            <p className="truncate text-xs font-semibold text-slate-750 dark:text-slate-200">
                                                {quest.payment_proof.name}
                                            </p>
                                            <p className="text-[10px] text-slate-405">
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

                    <form onSubmit={handleFinalZipSubmit} className="space-y-4">
                        <div className="space-y-2">
                            <label className="flex items-center gap-1.5 font-['Orbitron'] text-xs font-bold text-slate-600 uppercase dark:text-blue-200">
                                <FileArchive className="h-4 w-4 text-amber-500" />
                                Upload Berkas Proyek Final (ZIP) <span className="text-red-500">*</span>
                            </label>

                            <input
                                id="final-zip-file-input"
                                type="file"
                                accept=".zip"
                                onChange={(e) => {
                                    const files = e.target.files;
                                    if (files && files.length > 0) {
                                        finalZipForm.setData(
                                            'submission_file',
                                            files[0],
                                        );
                                    }
                                }}
                                className="hidden"
                            />

                            {finalZipForm.data.submission_file ? (
                                <div className="flex items-center justify-between rounded-xl border border-indigo-500/30 bg-indigo-500/5 p-3.5">
                                    <div className="flex min-w-0 items-center gap-3">
                                        <FileArchive className="h-6 w-6 shrink-0 text-indigo-500" />
                                        <div className="min-w-0">
                                            <p className="truncate text-xs font-bold text-slate-700 dark:text-slate-200">
                                                {finalZipForm.data.submission_file.name}
                                            </p>
                                            <p className="text-[10px] text-slate-400">
                                                {(
                                                    finalZipForm.data.submission_file.size /
                                                    1024 /
                                                    1024
                                                ).toFixed(2)}{' '}
                                                MB
                                            </p>
                                        </div>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() =>
                                            finalZipForm.setData(
                                                'submission_file',
                                                null,
                                            )
                                        }
                                        className="shrink-0 cursor-pointer rounded-lg px-2.5 py-1 font-['Orbitron'] text-[10px] font-bold tracking-wider text-red-600 uppercase transition-colors hover:bg-red-500/10 dark:text-red-400"
                                    >
                                        Hapus
                                    </button>
                                </div>
                            ) : (
                                <div
                                    onClick={() =>
                                        document
                                            .getElementById('final-zip-file-input')
                                            ?.click()
                                    }
                                    onDragOver={(e) => {
                                        e.preventDefault();
                                        e.currentTarget.classList.add(
                                            'border-indigo-500',
                                            'bg-indigo-500/5',
                                        );
                                    }}
                                    onDragLeave={(e) => {
                                        e.preventDefault();
                                        e.currentTarget.classList.remove(
                                            'border-indigo-500',
                                            'bg-indigo-500/5',
                                        );
                                    }}
                                    onDrop={(e) => {
                                        e.preventDefault();
                                        e.currentTarget.classList.remove(
                                            'border-indigo-500',
                                            'bg-indigo-500/5',
                                        );
                                        const files = e.dataTransfer.files;
                                        if (
                                            files &&
                                            files.length > 0 &&
                                            files[0].name.endsWith('.zip')
                                        ) {
                                            finalZipForm.setData(
                                                'submission_file',
                                                files[0],
                                            );
                                        }
                                    }}
                                    className="flex cursor-pointer flex-col items-center justify-center gap-1.5 rounded-xl border-2 border-dashed border-slate-200 bg-slate-50/50 p-5 text-center transition-all duration-300 hover:border-indigo-500 dark:border-slate-800 dark:bg-black/20 dark:hover:border-indigo-400"
                                >
                                    <FileArchive className="h-8 w-8 text-slate-400 dark:text-blue-500/40" />
                                    <span className="text-xs font-bold text-slate-600 dark:text-blue-300">
                                        Seret & lepas berkas ZIP Final
                                    </span>
                                    <span className="text-[10px] text-slate-400">
                                        atau klik untuk memilih berkas
                                    </span>
                                </div>
                            )}

                            {finalZipForm.progress && (
                                <div className="space-y-1">
                                    <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-200 dark:bg-slate-800">
                                        <div
                                            className="h-1.5 animate-pulse rounded-full bg-indigo-600 transition-all duration-300"
                                            style={{
                                                width: `${finalZipForm.progress.percentage}%`,
                                            }}
                                        />
                                    </div>
                                    <span className="block text-right font-['Orbitron'] text-[8px] font-bold tracking-widest text-slate-400 uppercase">
                                        Mengunggah: {finalZipForm.progress.percentage}%
                                    </span>
                                </div>
                            )}

                            {finalZipForm.errors.submission_file && (
                                <p className="text-xs font-semibold text-red-500">
                                    {finalZipForm.errors.submission_file}
                                </p>
                            )}
                        </div>

                        <button
                            type="submit"
                            disabled={finalZipForm.processing || !finalZipForm.data.submission_file}
                            className="w-full cursor-pointer rounded-xl bg-indigo-600 py-2.5 font-['Orbitron'] text-xs font-semibold tracking-wider text-white uppercase shadow-md transition-all hover:bg-indigo-700 disabled:opacity-50"
                        >
                            {finalZipForm.processing
                                ? 'Mengirim...'
                                : 'Konfirmasi Pembayaran & Kirim Berkas Final'}
                        </button>
                    </form>
                </div>
            )}

            {quest.status === 'submitted' && (
                <div className="space-y-4 font-['Oxanium']">
                    <div className="flex flex-col gap-1.5 rounded-xl border border-amber-500/25 bg-amber-500/10 p-4 text-center">
                        <span className="block font-['Orbitron'] text-xs font-bold tracking-wider text-amber-600 uppercase dark:text-amber-400">
                            Menunggu Review Pemilik
                        </span>
                        <p className="text-xs leading-relaxed text-slate-500 dark:text-blue-300/60">
                            Hasil penyerahan tugas Anda telah dikirim. Pemilik
                            quest akan meninjau kelayakan pekerjaan Anda.
                        </p>
                    </div>

                    <RevisionHistory quest={quest} viewType="worker_submitted" />

                    <div className="space-y-3.5 rounded-xl border border-slate-200 bg-slate-50/50 p-4 text-xs dark:border-slate-800 dark:bg-black/20">
                        {quest.submission_file && (
                            <div className="space-y-1">
                                <strong className="block text-[10px] tracking-wider text-slate-400 uppercase">
                                    Berkas Dikirim (ZIP)
                                </strong>
                                <div className="flex items-center justify-between rounded-xl border border-amber-200/40 bg-amber-50/5 p-2.5 dark:border-amber-500/20 dark:bg-amber-950/10">
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
                                        className="flex cursor-pointer items-center justify-center rounded-lg p-1.5 text-amber-600 transition-colors hover:bg-amber-500/10 hover:text-amber-700"
                                        title="Unduh ZIP"
                                    >
                                        <Download className="h-4.5 w-4.5" />
                                    </a>
                                </div>
                            </div>
                        )}

                        {quest.submission_link && (
                            <div>
                                <strong className="mb-1 block text-[10px] tracking-wider text-slate-400 uppercase">
                                    Tautan Pekerjaan
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
                                    Catatan Anda
                                </strong>
                                <p className="rounded-lg border border-slate-200 bg-white/40 p-2.5 leading-relaxed whitespace-pre-wrap text-slate-700 dark:border-slate-800/40 dark:bg-black/15 dark:text-slate-300">
                                    {quest.submission_note}
                                </p>
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
                                            <p className="text-[10px] text-slate-400">
                                                {quest.payment_uploaded_at ? new Date(quest.payment_uploaded_at).toLocaleDateString('id-ID', { dateStyle: 'medium' }) : ''}
                                            </p>
                                        </div>
                                    </div>
                                    <a
                                        href={quest.payment_proof.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex cursor-pointer items-center justify-center rounded-lg p-1.5 text-indigo-650 transition-colors hover:bg-indigo-500/10 hover:text-indigo-700"
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

            {quest.status === 'completed' && (
                <div className="space-y-4 font-['Oxanium']">
                    <div className="flex flex-col gap-1.5 rounded-xl border border-green-500/25 bg-green-500/10 p-4 text-center">
                        <span className="block font-['Orbitron'] text-xs font-bold tracking-wider text-green-600 uppercase dark:text-green-400">
                            Quest Diselesaikan!
                        </span>
                        <p className="text-xs leading-relaxed text-slate-500 dark:text-blue-300/60">
                            Quest telah selesai sepenuhnya. Seluruh rewards EXP,
                            Gold, dan ERP Anda telah dikreditkan ke profil Anda.
                        </p>
                    </div>

                    <div className="space-y-3 rounded-xl border border-slate-200 bg-slate-50/50 p-4 text-xs dark:border-slate-800 dark:bg-black/20">
                        {quest.submission_file && (
                            <div className="space-y-1">
                                <strong className="block text-[10px] tracking-wider text-slate-400 uppercase">
                                    Berkas Proyek ZIP Final
                                </strong>
                                <div className="flex items-center justify-between rounded-xl border border-amber-200/40 bg-amber-50/5 p-2.5 dark:border-amber-500/20 dark:bg-amber-950/10">
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
                                        className="flex cursor-pointer items-center justify-center rounded-lg p-1.5 text-amber-600 transition-colors hover:bg-amber-500/10 hover:text-amber-700"
                                        title="Unduh ZIP Final"
                                    >
                                        <Download className="h-4.5 w-4.5" />
                                    </a>
                                </div>
                            </div>
                        )}

                        {quest.submission_link && (
                            <div>
                                <strong className="mb-1 block text-[10px] tracking-wider text-slate-400 uppercase">
                                    Tautan Pekerjaan
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
                    </div>
                </div>
            )}
        </div>
    );
}
