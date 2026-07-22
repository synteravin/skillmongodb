import React from 'react';
import { TrendingUp, ShieldAlert, MessageSquare, Award, FolderGit } from 'lucide-react';
import { Quest, Bid } from '@/types/quest';

interface Transaction {
    _id: string;
    amount: number;
    type: string;
    description: string;
    created_at: string;
    user?: {
        name: string;
    } | null;
}

interface AdminArbitrationTabPanelProps {
    quest: Quest;
    transactions: Transaction[];
    formatDate: (dateStr: string) => string;
    formatCurrency: (num: number) => string;
    extendDeadlineForm: any;
    handleExtendDeadline: (e: React.FormEvent) => void;
    handleReopenBidding: () => void;
    handleForceCancel: () => void;
    handleArbitrate: (e: React.FormEvent) => void;
    arbitrateForm: any;
    setSelectedChatBid: (bid: { id: string; name: string } | null) => void;
    bids: Bid[];
}

export default function AdminArbitrationTabPanel({
    quest,
    transactions,
    formatDate,
    formatCurrency,
    extendDeadlineForm,
    handleExtendDeadline,
    handleReopenBidding,
    handleForceCancel,
    handleArbitrate,
    arbitrateForm,
    setSelectedChatBid,
    bids,
}: AdminArbitrationTabPanelProps) {
    return (
        <div className="space-y-6">
            {/* QUEST AUDIT TRAIL / EVENT HISTORY */}
            <div className="relative overflow-hidden rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-gradient-to-b dark:from-[#0e0e1a] dark:to-[#090910]">
                <div className="absolute top-0 right-8 left-8 h-px bg-gradient-to-r from-transparent via-slate-300 to-transparent dark:via-slate-700" />
                <h4 className="border-b border-slate-200 pb-3 text-xs font-extrabold tracking-wider text-slate-900 uppercase dark:border-slate-800 dark:text-white">
                    Log Aktivitas & Audit Trail Kejadian
                </h4>
                <div className="relative mt-5 space-y-6 border-l border-slate-300 pl-6 dark:border-slate-800">
                    {/* Event 1: Quest Created */}
                    <div className="relative">
                        <div className="absolute top-1 -left-[31px] flex h-4 w-4 items-center justify-center rounded-full border border-indigo-600 bg-white text-indigo-600 dark:bg-[#0d1117]">
                            <div className="h-2 w-2 rounded-full bg-indigo-600" />
                        </div>
                        <div>
                            <span className="block text-[10px] font-bold tracking-wider text-slate-600 uppercase dark:text-slate-400">
                                {quest.created_at ? formatDate(quest.created_at) : 'Baru saja'}
                            </span>
                            <span className="text-xs font-extrabold text-slate-900 dark:text-white">
                                Quest Dipublikasikan
                            </span>
                            <p className="mt-1 text-[11px] font-semibold text-slate-600 dark:text-slate-400">
                                Quest dibuat oleh <strong className="font-bold text-slate-900 dark:text-white">{quest.creator.name}</strong> dengan estimasi budget {formatCurrency(quest.min_budget ?? quest.min_salary ?? 0)} - {formatCurrency(quest.max_budget ?? quest.max_salary ?? 0)}.
                            </p>
                        </div>
                    </div>

                    {/* Event 2: Worker Assigned */}
                    {quest.worker && (
                        <div className="relative">
                            <div className="absolute top-1 -left-[31px] flex h-4 w-4 items-center justify-center rounded-full border border-emerald-600 bg-white text-emerald-600 dark:bg-[#0d1117]">
                                <div className="h-2 w-2 rounded-full bg-emerald-600" />
                            </div>
                            <div>
                                <span className="block text-[10px] font-bold tracking-wider text-slate-600 uppercase dark:text-slate-400">
                                    Pekerja Terpilih
                                </span>
                                <span className="text-xs font-extrabold text-slate-900 dark:text-white">
                                    Kontrak Kerja Dimulai
                                </span>
                                <p className="mt-1 text-[11px] font-semibold text-slate-600 dark:text-slate-400">
                                    Bidding ditutup. Pekerja <strong className="font-bold text-slate-900 dark:text-white">{quest.worker.name}</strong> ditugaskan dengan nilai kontrak <strong>{formatCurrency(quest.accepted_bid_amount || quest.max_salary)}</strong>.
                                </p>
                            </div>
                        </div>
                    )}

                    {/* Event 3: Submission History */}
                    {quest.submission_history &&
                        quest.submission_history.map((historyItem) => (
                            <div key={historyItem.version} className="relative">
                                <div className="absolute top-1 -left-[31px] flex h-4 w-4 items-center justify-center rounded-full border border-indigo-600 bg-white dark:bg-[#0d1117]">
                                    <div className="h-2 w-2 rounded-full bg-indigo-600" />
                                </div>
                                <div>
                                    <span className="block text-[10px] font-bold tracking-wider text-slate-600 uppercase dark:text-slate-400">
                                        {historyItem.submitted_at ? formatDate(historyItem.submitted_at) : 'Penyerahan Tugas'}
                                    </span>
                                    <span className="text-xs font-extrabold text-slate-900 dark:text-white">
                                        Deliverable Dikirim (Versi v{historyItem.version})
                                    </span>
                                    {historyItem.submission_note && (
                                        <p className="mt-1 text-[11px] font-semibold text-slate-600 italic dark:text-slate-300">
                                            Catatan Pekerja: "{historyItem.submission_note}"
                                        </p>
                                    )}
                                    {historyItem.submission_link && (
                                        <a
                                            href={historyItem.submission_link}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="mt-1 block truncate text-[11px] font-bold text-indigo-600 hover:underline dark:text-indigo-400"
                                        >
                                            Tautan Hasil Kerja: {historyItem.submission_link}
                                        </a>
                                    )}
                                </div>
                            </div>
                        ))}

                    {/* Event 4: Dispute Filed */}
                    {quest.dispute && (
                        <div className="relative">
                            <div className="absolute top-1 -left-[31px] flex h-4 w-4 items-center justify-center rounded-full border border-red-600 bg-white text-red-600 dark:bg-[#0d1117]">
                                <div className="h-2 w-2 rounded-full bg-red-600" />
                            </div>
                            <div>
                                <span className="block text-[10px] font-bold tracking-wider text-slate-600 uppercase dark:text-slate-400">
                                    Arbitrase Diajukan
                                </span>
                                <span className="text-xs font-extrabold text-slate-900 dark:text-white">
                                    Perselisihan (Dispute) Aktif
                                </span>
                                <p className="mt-1 text-[11px] font-semibold text-slate-600 dark:text-slate-400">
                                    Diajukan oleh <strong className="font-bold text-slate-900 dark:text-white">{quest.dispute.filer_name}</strong>. Alasan sengketa: <span className="text-red-700 italic dark:text-red-400">"{quest.dispute.reason}"</span>.
                                </p>
                            </div>
                        </div>
                    )}

                    {/* Event 5: Final Verdict */}
                    {quest.dispute && quest.dispute.status?.startsWith('resolved') && (
                        <div className="relative">
                            <div className="absolute top-1 -left-[31px] flex h-4 w-4 items-center justify-center rounded-full border border-purple-600 bg-white text-purple-600 dark:bg-[#0d1117]">
                                <div className="h-2 w-2 rounded-full bg-purple-600" />
                            </div>
                            <div>
                                <span className="block text-[10px] font-bold tracking-wider text-slate-600 uppercase dark:text-slate-400">
                                    {quest.dispute.ruled_at ? formatDate(quest.dispute.ruled_at) : 'Arbitrase Selesai'}
                                </span>
                                <span className="text-xs font-extrabold text-slate-900 dark:text-white">
                                    Vonis Arbitrase Dijatuhkan
                                </span>
                                <p className="mt-1 text-[11px] font-semibold text-slate-600 dark:text-slate-400">
                                    Mediator memutuskan vonis:{' '}
                                    <strong className="font-bold text-slate-900 dark:text-white">
                                        {quest.dispute.ruling === 'split'
                                            ? `Bagi Hasil (Pekerja ${quest.dispute.split_percentage}%)`
                                            : quest.dispute.ruling === 'refund'
                                              ? 'Refund Pembuat 100%'
                                              : 'Pekerja 100%'}
                                    </strong>
                                    .
                                </p>
                                {quest.dispute.note && (
                                    <p className="mt-1 text-[11px] font-semibold text-slate-600 italic dark:text-slate-300">
                                        Memo Admin: "{quest.dispute.note}"
                                    </p>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Action Control Panel */}
            <div className="relative overflow-hidden space-y-6 rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-gradient-to-b dark:from-[#0e0e1a] dark:to-[#090910]">
                <div className="absolute top-0 right-8 left-8 h-px bg-gradient-to-r from-transparent via-slate-300 to-transparent dark:via-slate-700" />
                <div className="flex items-center justify-between border-b border-slate-200 pb-3 dark:border-slate-800">
                    <h3 className="flex items-center gap-2 text-sm font-extrabold tracking-wider text-slate-900 uppercase dark:text-white">
                        <TrendingUp size={16} className="text-indigo-600 dark:text-indigo-400" />
                        Pusat Kontrol Administratif
                    </h3>
                </div>

                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                    {/* Extend Deadline Form */}
                    <form
                        onSubmit={handleExtendDeadline}
                        className="space-y-4 rounded-xl border border-slate-200 bg-slate-50/70 p-4 dark:border-slate-800 dark:bg-[#030712]"
                    >
                        <h4 className="text-xs font-extrabold tracking-wider text-slate-900 uppercase dark:text-white">
                            Perpanjang Tenggat Waktu
                        </h4>
                        <p className="text-[11px] font-semibold text-slate-600 dark:text-slate-400">
                            Ubah batas akhir pengiriman untuk memberikan waktu tambahan kepada pekerja.
                        </p>
                        <div className="space-y-2">
                            <input
                                type="datetime-local"
                                value={extendDeadlineForm.data.deadline}
                                onChange={(e) => extendDeadlineForm.setData('deadline', e.target.value)}
                                className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-900 focus:border-indigo-600 focus:outline-none dark:border-slate-800 dark:bg-[#0d0f17] dark:text-white"
                            />
                            {extendDeadlineForm.errors.deadline && (
                                <p className="text-xs font-semibold text-red-500">
                                    {extendDeadlineForm.errors.deadline}
                                </p>
                            )}
                        </div>
                        <button
                            type="submit"
                            disabled={extendDeadlineForm.processing}
                            className="w-full cursor-pointer rounded-lg bg-indigo-600 py-2 text-xs font-bold tracking-wider text-white uppercase transition-colors hover:bg-indigo-700 disabled:opacity-50"
                        >
                            {extendDeadlineForm.processing ? 'Memperbarui...' : 'Perpanjang Deadline'}
                        </button>
                    </form>

                    {/* Quick Recovery Actions */}
                    <div className="flex flex-col justify-between space-y-4 rounded-xl border border-slate-200 bg-slate-50/70 p-4 dark:border-slate-800 dark:bg-[#030712]">
                        <div>
                            <h4 className="text-xs font-extrabold tracking-wider text-slate-900 uppercase dark:text-white">
                                Tindakan Pemulihan Cepat
                            </h4>
                            <p className="mt-1 text-[11px] font-semibold text-slate-600 dark:text-slate-400">
                                Gunakan opsi di bawah ini jika terjadi kemacetan pengerjaan atau perselisihan sepihak.
                            </p>
                        </div>
                        <div className="grid grid-cols-1 gap-2 pt-2">
                            <button
                                type="button"
                                onClick={handleReopenBidding}
                                className="w-full cursor-pointer rounded-lg border border-amber-500/30 bg-amber-500/10 py-2.5 text-center text-xs font-bold tracking-wider text-amber-700 uppercase transition-all hover:bg-amber-500/20 dark:text-amber-400"
                            >
                                Buka Kembali Bidding
                            </button>
                            <button
                                type="button"
                                onClick={handleForceCancel}
                                className="w-full cursor-pointer rounded-lg border border-red-500/30 bg-red-500/10 py-2.5 text-center text-xs font-bold tracking-wider text-red-700 uppercase transition-all hover:bg-red-500/20 dark:text-red-400"
                            >
                                Batalkan Quest & Batalkan Reward
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Dispute & Arbitration Panel */}
            <div className="relative overflow-hidden space-y-6 rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-gradient-to-b dark:from-[#0e0e1a] dark:to-[#090910]">
                <div className="absolute top-0 right-8 left-8 h-px bg-gradient-to-r from-transparent via-slate-300 to-transparent dark:via-slate-700" />
                <div className="flex items-center justify-between border-b border-slate-200 pb-3 dark:border-slate-800">
                    <h3 className="flex items-center gap-2 text-sm font-extrabold tracking-wider text-slate-900 uppercase dark:text-white">
                        <ShieldAlert size={16} className="text-red-600 dark:text-red-400" />
                        Arbitrase Penyelidikan & Sengketa
                    </h3>
                    <span
                        className={`rounded-full border px-2.5 py-0.5 text-[10px] font-bold uppercase ${
                            quest.status === 'disputed'
                                ? 'text-red-700 border-red-500/30 bg-red-500/10 dark:text-red-400 animate-pulse'
                                : quest.dispute?.status?.startsWith('resolved')
                                  ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400'
                                  : 'text-slate-600 border-slate-300 bg-slate-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300'
                        }`}
                    >
                        {quest.status === 'disputed'
                            ? 'Dispute Aktif'
                            : quest.dispute?.status?.startsWith('resolved')
                              ? 'Selesai'
                              : 'Tidak Ada Sengketa'}
                    </span>
                </div>

                {quest.dispute ? (
                    <div className="space-y-6">
                        {/* Case Details Card */}
                        <div className="space-y-2 rounded-xl border border-red-500/30 bg-red-500/10 p-4 dark:border-red-500/30 dark:bg-red-950/20">
                            <div className="flex items-center justify-between text-xs font-semibold text-slate-600 dark:text-slate-400">
                                <span>
                                    Diajukan oleh: <strong className="font-bold text-slate-900 dark:text-white">{quest.dispute.filer_name}</strong>
                                </span>
                                <span>
                                    Tanggal Pengajuan: {quest.dispute.ruled_at ? formatDate(quest.dispute.ruled_at) : 'Baru saja'}
                                </span>
                            </div>
                            <p className="rounded-lg border border-slate-300 bg-white p-3 text-xs font-semibold italic text-slate-800 dark:border-slate-800 dark:bg-[#0d0f17] dark:text-slate-200">
                                "{quest.dispute.reason}"
                            </p>

                            <div className="mt-2 flex items-center justify-between border-t border-slate-200/40 pt-2 dark:border-slate-800">
                                <span className="text-[11px] font-semibold text-slate-600 dark:text-slate-400">
                                    Saluran komunikasi mediasi tripihak sengketa.
                                </span>
                                {(() => {
                                    const acceptedBid = bids?.find(
                                        (b) =>
                                            b.status === 'accepted' ||
                                            b.student?._id === quest.worker_id,
                                    );
                                    const otherPartyName = quest.worker?.name ?? 'Pekerja';
                                    if (acceptedBid) {
                                        return (
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    setSelectedChatBid({
                                                        id: acceptedBid._id,
                                                        name: `Mediasi: ${otherPartyName}`,
                                                    })
                                                }
                                                className="flex cursor-pointer items-center justify-center gap-1.5 rounded-lg bg-red-600 px-3 py-1.5 text-[10px] font-bold text-white uppercase transition-colors hover:bg-red-700"
                                            >
                                                <MessageSquare size={11} />
                                                Buka Ruang Mediasi
                                            </button>
                                        );
                                    }
                                    return null;
                                })()}
                            </div>
                        </div>

                        {/* Resolved Case verdict Card */}
                        {quest.dispute.status?.startsWith('resolved') ? (
                            <div className="space-y-4 rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-5 dark:border-emerald-500/30 dark:bg-emerald-950/20">
                                <h4 className="flex items-center gap-1.5 text-xs font-extrabold text-emerald-700 uppercase dark:text-emerald-300">
                                    <Award size={14} />
                                    Ketetapan Resmi Arbitrase
                                </h4>
                                <div className="grid grid-cols-2 gap-4 text-xs">
                                    <div>
                                        <span className="block text-[10px] font-bold text-slate-600 uppercase dark:text-slate-400">
                                            Status Pembayaran
                                        </span>
                                        <span className="font-bold text-slate-900 uppercase dark:text-white">
                                            {['refund', 'refund_creator'].includes(quest.dispute.ruling ?? '') && 'Pembatalan & Refund Penuh'}
                                            {['pay_worker', 'release_payout'].includes(quest.dispute.ruling ?? '') && 'Bayar Penuh Ke Pekerja'}
                                            {quest.dispute.ruling === 'split' && `Bagi Hasil (Pekerja ${quest.dispute.split_percentage}%)`}
                                        </span>
                                    </div>
                                    {quest.dispute.split_percentage !== undefined && quest.dispute.ruling === 'split' && (
                                        <div>
                                            <span className="block text-[10px] font-bold text-slate-600 uppercase dark:text-slate-400">
                                                Pembagian Dana
                                            </span>
                                            <span className="font-bold text-slate-900 dark:text-white">
                                                Pekerja {quest.dispute.split_percentage}% / Pembuat {100 - (quest.dispute.split_percentage ?? 0)}%
                                            </span>
                                        </div>
                                    )}
                                </div>
                                <div className="border-t border-emerald-500/20 pt-3 text-xs">
                                    <span className="mb-1 block text-[10px] font-bold text-slate-600 uppercase dark:text-slate-400">
                                        Catatan Vonis Mediator
                                    </span>
                                    <p className="font-semibold text-emerald-800 italic dark:text-emerald-300">
                                        "{quest.dispute.note ?? 'Sengketa diselesaikan.'}"
                                    </p>
                                </div>
                            </div>
                        ) : (
                            /* Active Dispute: Arbitrate Decision Form */
                            <form
                                onSubmit={handleArbitrate}
                                className="space-y-5 rounded-xl border border-slate-300 bg-slate-50/70 p-4 dark:border-slate-800 dark:bg-[#030712]"
                            >
                                <div className="flex items-center justify-between">
                                    <h4 className="text-xs font-extrabold tracking-wider text-slate-900 uppercase dark:text-white">
                                        Formulir Keputusan Arbitrase (Verdict)
                                    </h4>
                                    {(() => {
                                        const acceptedBid = bids?.find(
                                            (b) =>
                                                b.status === 'accepted' ||
                                                b.student?._id === quest.worker_id,
                                        );
                                        const otherPartyName = quest.worker?.name ?? 'Pekerja';
                                        if (acceptedBid) {
                                            return (
                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        setSelectedChatBid({
                                                            id: acceptedBid._id,
                                                            name: otherPartyName,
                                                        })
                                                    }
                                                    className="flex cursor-pointer items-center justify-center gap-1 rounded-lg bg-indigo-600 px-3 py-1 text-[10px] font-bold text-white uppercase hover:bg-indigo-700"
                                                >
                                                    <MessageSquare size={10} />
                                                    Masuk Ruang Mediasi (Chat)
                                                </button>
                                            );
                                        }
                                        return null;
                                    })()}
                                </div>

                                {/* Premium Verdict Options Selection */}
                                <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                                    <label
                                        className={`flex cursor-pointer flex-col items-center justify-center gap-1.5 rounded-xl border p-4 text-center transition-all ${
                                            arbitrateForm.data.ruling === 'refund'
                                                ? 'border-red-600 bg-red-500/10 font-bold text-red-700 shadow-sm dark:text-red-300'
                                                : 'text-slate-600 border-slate-300 bg-white hover:border-slate-400 dark:border-slate-800 dark:bg-[#0d0f17] dark:text-slate-300'
                                        }`}
                                    >
                                        <input
                                            type="radio"
                                            name="ruling"
                                            value="refund"
                                            checked={arbitrateForm.data.ruling === 'refund'}
                                            onChange={() => arbitrateForm.setData('ruling', 'refund')}
                                            className="sr-only"
                                        />
                                        <span className="block text-xs font-extrabold tracking-wider uppercase">
                                            Batalkan & Refund
                                        </span>
                                        <span className="block text-[10px] font-semibold leading-relaxed text-slate-500 dark:text-slate-400">
                                            Kembalikan 100% koin reward ke pembuat quest.
                                        </span>
                                    </label>

                                    <label
                                        className={`flex cursor-pointer flex-col items-center justify-center gap-1.5 rounded-xl border p-4 text-center transition-all ${
                                            arbitrateForm.data.ruling === 'pay_worker'
                                                ? 'border-emerald-600 bg-emerald-500/10 font-bold text-emerald-700 shadow-sm dark:text-emerald-300'
                                                : 'text-slate-600 border-slate-300 bg-white hover:border-slate-400 dark:border-slate-800 dark:bg-[#0d0f17] dark:text-slate-300'
                                        }`}
                                    >
                                        <input
                                            type="radio"
                                            name="ruling"
                                            value="pay_worker"
                                            checked={arbitrateForm.data.ruling === 'pay_worker'}
                                            onChange={() => arbitrateForm.setData('ruling', 'pay_worker')}
                                            className="sr-only"
                                        />
                                        <span className="block text-xs font-extrabold tracking-wider uppercase">
                                            Bayar Pekerja
                                        </span>
                                        <span className="block text-[10px] font-semibold leading-relaxed text-slate-500 dark:text-slate-400">
                                            Transfer 100% reward kepada pekerja terpilih.
                                        </span>
                                    </label>

                                    <label
                                        className={`flex cursor-pointer flex-col items-center justify-center gap-1.5 rounded-xl border p-4 text-center transition-all ${
                                            arbitrateForm.data.ruling === 'split'
                                                ? 'border-indigo-600 bg-indigo-500/10 font-bold text-indigo-700 shadow-sm dark:text-indigo-300'
                                                : 'text-slate-600 border-slate-300 bg-white hover:border-slate-400 dark:border-slate-800 dark:bg-[#0d0f17] dark:text-slate-300'
                                        }`}
                                    >
                                        <input
                                            type="radio"
                                            name="ruling"
                                            value="split"
                                            checked={arbitrateForm.data.ruling === 'split'}
                                            onChange={() => arbitrateForm.setData('ruling', 'split')}
                                            className="sr-only"
                                        />
                                        <span className="block text-xs font-extrabold tracking-wider uppercase">
                                            Bagi Hasil
                                        </span>
                                        <span className="block text-[10px] font-semibold leading-relaxed text-slate-500 dark:text-slate-400">
                                            Membagi reward secara proporsional sesuai kesepakatan.
                                        </span>
                                    </label>
                                </div>

                                {/* Custom Split Value Controls */}
                                {arbitrateForm.data.ruling === 'split' && (
                                    <div className="space-y-2 rounded-xl border border-indigo-500/30 bg-indigo-500/10 p-4 dark:border-indigo-500/30">
                                        <label className="block text-[10px] font-bold tracking-wider text-slate-600 uppercase dark:text-slate-400">
                                            Persentase Payout Pekerja (%) <span className="text-red-500">*</span>
                                        </label>
                                        <div className="flex items-center gap-4">
                                            <input
                                                type="range"
                                                min="1"
                                                max="99"
                                                value={arbitrateForm.data.split_percentage}
                                                onChange={(e) =>
                                                    arbitrateForm.setData('split_percentage', parseInt(e.target.value) || 50)
                                                }
                                                className="flex-1 accent-indigo-600"
                                            />
                                            <div className="w-16 shrink-0 rounded-lg border border-slate-300 bg-white px-2.5 py-1 text-center text-xs font-bold text-slate-900 dark:border-slate-800 dark:bg-[#0d0f17] dark:text-white">
                                                {arbitrateForm.data.split_percentage}%
                                            </div>
                                        </div>
                                        <span className="mt-1 block text-[10px] font-semibold text-slate-600 dark:text-slate-400">
                                            Pekerja akan menerima <strong className="text-slate-900 dark:text-white">{arbitrateForm.data.split_percentage}%</strong> dan sisa <strong className="text-slate-900 dark:text-white">{100 - (arbitrateForm.data.split_percentage ?? 0)}%</strong> dari reward dibatalkan/tidak dicairkan.
                                        </span>
                                        {arbitrateForm.errors.split_percentage && (
                                            <p className="text-xs font-semibold text-red-500">
                                                {arbitrateForm.errors.split_percentage}
                                            </p>
                                        )}
                                    </div>
                                )}

                                {/* Textarea for Decision Notes */}
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-bold text-slate-600 uppercase dark:text-slate-400">
                                        Catatan Keputusan / Memorandum Mediator <span className="text-red-500">*</span>
                                    </label>
                                    <textarea
                                        required
                                        placeholder="Tulis memorandum atau penjelasan hukum/kebijakan resmi mengenai keputusan sengketa ini..."
                                        rows={3}
                                        value={arbitrateForm.data.note}
                                        onChange={(e) => arbitrateForm.setData('note', e.target.value)}
                                        className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-xs font-semibold text-slate-900 focus:border-indigo-600 focus:outline-none dark:border-slate-800 dark:bg-[#0d0f17] dark:text-white"
                                    />
                                    {arbitrateForm.errors.note && (
                                        <p className="text-xs font-semibold text-red-500">
                                            {arbitrateForm.errors.note}
                                        </p>
                                    )}
                                </div>

                                <button
                                    type="submit"
                                    disabled={arbitrateForm.processing}
                                    className="w-full cursor-pointer rounded-lg bg-red-600 py-2.5 text-xs font-bold tracking-wider text-white uppercase shadow-md transition-colors hover:bg-red-700 disabled:opacity-50"
                                >
                                    {arbitrateForm.processing ? 'Memproses Keputusan...' : 'Kirim Keputusan Sengketa'}
                                </button>
                            </form>
                        )}
                    </div>
                ) : (
                    <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50/70 py-8 text-center text-slate-500 dark:border-slate-800 dark:bg-[#030712] dark:text-slate-400">
                        <ShieldAlert className="mx-auto mb-2 h-8 w-8 text-slate-400 opacity-60" />
                        <p className="text-xs font-extrabold uppercase text-slate-800 dark:text-slate-300">
                            Tidak Ada Sengketa Aktif
                        </p>
                        <p className="mt-0.5 text-[10px] font-semibold text-slate-600 dark:text-slate-400">
                            Quest ini berjalan dengan normal dan tidak berada dalam status banding/dispute.
                        </p>
                    </div>
                )}
            </div>

            {/* Quest Transaction Ledger */}
            <div className="relative overflow-hidden space-y-5 rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-gradient-to-b dark:from-[#0e0e1a] dark:to-[#090910]">
                <div className="absolute top-0 right-8 left-8 h-px bg-gradient-to-r from-transparent via-slate-300 to-transparent dark:via-slate-700" />
                <div className="flex items-center justify-between border-b border-slate-200 pb-3 dark:border-slate-800">
                    <h3 className="flex items-center gap-2 text-sm font-extrabold tracking-wider text-slate-900 uppercase dark:text-white">
                        <FolderGit size={16} className="text-purple-600 dark:text-purple-400" />
                        Buku Besar Transaksi Koin Gold (Quest Ledger)
                    </h3>
                    <span className="rounded-md border border-indigo-500/30 bg-indigo-500/10 px-2.5 py-0.5 text-xs font-bold text-indigo-700 dark:text-indigo-300">
                        {transactions.length} Transaksi
                    </span>
                </div>

                {transactions.length === 0 ? (
                    <div className="py-8 text-center text-slate-500 dark:text-slate-400">
                        <p className="text-xs font-extrabold uppercase text-slate-800 dark:text-slate-300">
                            Belum Ada Catatan Transaksi
                        </p>
                        <p className="text-[10px] font-semibold text-slate-600 dark:text-slate-400">
                            Belum ada transaksi dana/escrow koin Gold yang tercatat pada quest ini.
                        </p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full border-collapse text-left text-xs">
                            <thead>
                                <tr className="border-b border-slate-300 text-[10px] font-bold text-slate-600 uppercase dark:border-slate-800 dark:text-slate-400">
                                    <th className="py-2.5">Tanggal</th>
                                    <th className="py-2.5">Tipe</th>
                                    <th className="py-2.5">Pihak Terkait</th>
                                    <th className="py-2.5">Jumlah</th>
                                    <th className="py-2.5">Deskripsi</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-200 dark:divide-slate-800/60">
                                {transactions.map((t) => (
                                    <tr key={t._id} className="hover:bg-slate-50 dark:hover:bg-slate-900/40">
                                        <td className="py-2.5 font-semibold text-slate-600 dark:text-slate-400">
                                            {formatDate(t.created_at)}
                                        </td>
                                        <td className="py-2.5 text-[10px] font-bold uppercase">
                                            <span
                                                className={`rounded px-2 py-0.5 ${
                                                    t.type === 'hold_escrow'
                                                        ? 'border border-amber-500/30 bg-amber-500/10 text-amber-700 dark:text-amber-400'
                                                        : t.type === 'release_payout'
                                                          ? 'border border-emerald-500/30 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400'
                                                          : 'border border-indigo-500/30 bg-indigo-500/10 text-indigo-700 dark:text-indigo-400'
                                                }`}
                                            >
                                                {t.type === 'hold_escrow' && 'Hold Escrow'}
                                                {t.type === 'release_payout' && 'Release Payout'}
                                                {t.type === 'refund_escrow' && 'Refund Escrow'}
                                                {!['hold_escrow', 'release_payout', 'refund_escrow'].includes(t.type) && t.type}
                                            </span>
                                        </td>
                                        <td className="py-2.5 font-bold text-slate-900 dark:text-slate-200">
                                            {t.user?.name ?? 'Sistem / Escrow'}
                                        </td>
                                        <td className="py-2.5 font-extrabold text-amber-600 dark:text-amber-400">
                                            {t.amount > 0 ? `+${t.amount}` : t.amount} G
                                        </td>
                                        <td className="py-2.5 font-semibold text-slate-600 italic dark:text-slate-400">
                                            {t.description}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}
