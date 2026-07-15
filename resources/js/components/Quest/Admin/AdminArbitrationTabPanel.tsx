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
            <div className="rounded-2xl border border-slate-200 bg-white/70 p-6 shadow-md backdrop-blur-md dark:border-slate-800/80 dark:bg-[#0c122c]/40">
                <h4 className="border-b border-slate-100 pb-3 font-['Orbitron'] text-xs font-bold tracking-wider text-slate-700 uppercase dark:border-slate-800 dark:text-blue-200">
                    Log Aktivitas & Audit Trail Kejadian
                </h4>
                <div className="relative mt-5 space-y-6 border-l border-slate-200 pl-6 dark:border-slate-800">
                    {/* Event 1: Quest Created */}
                    <div className="relative">
                        <div className="absolute top-1 -left-[31px] flex h-4 w-4 items-center justify-center rounded-full border border-indigo-500 bg-white text-indigo-500 dark:bg-[#0c122c]">
                            <div className="h-2 w-2 rounded-full bg-indigo-500" />
                        </div>
                        <div>
                            <span className="block text-[10px] font-bold tracking-wider text-slate-400 uppercase">
                                {quest.created_at ? formatDate(quest.created_at) : 'Baru saja'}
                            </span>
                            <span className="text-xs font-bold text-slate-800 dark:text-white">
                                Quest Dipublikasikan
                            </span>
                            <p className="mt-1 text-[11px] text-slate-500">
                                Quest dibuat oleh <strong>{quest.creator.name}</strong> dengan estimasi budget {formatCurrency(quest.min_salary)} - {formatCurrency(quest.max_salary)}.
                            </p>
                        </div>
                    </div>

                    {/* Event 2: Worker Assigned */}
                    {quest.worker && (
                        <div className="relative">
                            <div className="absolute top-1 -left-[31px] flex h-4 w-4 items-center justify-center rounded-full border border-emerald-500 bg-white text-emerald-500 dark:bg-[#0c122c]">
                                <div className="h-2 w-2 rounded-full bg-emerald-500" />
                            </div>
                            <div>
                                <span className="block text-[10px] font-bold tracking-wider text-slate-400 uppercase">
                                    Pekerja Terpilih
                                </span>
                                <span className="text-xs font-bold text-slate-800 dark:text-white">
                                    Kontrak Kerja Dimulai
                                </span>
                                <p className="mt-1 text-[11px] text-slate-500">
                                    Bidding ditutup. Pekerja <strong>{quest.worker.name}</strong> ditugaskan dengan nilai kontrak <strong>{formatCurrency(quest.accepted_bid_amount || quest.max_salary)}</strong>.
                                </p>
                            </div>
                        </div>
                    )}

                    {/* Event 3: Submission History */}
                    {quest.submission_history &&
                        quest.submission_history.map((historyItem) => (
                            <div key={historyItem.version} className="relative">
                                <div className="text-indigo-550 absolute top-1 -left-[31px] flex h-4 w-4 items-center justify-center rounded-full border border-indigo-500 bg-white dark:bg-[#0c122c]">
                                    <div className="h-2 w-2 rounded-full bg-indigo-500" />
                                </div>
                                <div>
                                    <span className="block text-[10px] font-bold tracking-wider text-slate-400 uppercase">
                                        {historyItem.submitted_at ? formatDate(historyItem.submitted_at) : 'Penyerahan Tugas'}
                                    </span>
                                    <span className="text-xs font-bold text-slate-800 dark:text-white">
                                        Deliverable Dikirim (Versi v{historyItem.version})
                                    </span>
                                    {historyItem.submission_note && (
                                        <p className="mt-1 text-[11px] text-slate-500 italic">
                                            Catatan Pekerja: "{historyItem.submission_note}"
                                        </p>
                                    )}
                                    {historyItem.submission_link && (
                                        <a
                                            href={historyItem.submission_link}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="mt-1 block truncate text-[11px] text-indigo-500 hover:underline"
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
                            <div className="absolute top-1 -left-[31px] flex h-4 w-4 items-center justify-center rounded-full border border-red-500 bg-white text-red-500 dark:bg-[#0c122c]">
                                <div className="h-2 w-2 rounded-full bg-red-500" />
                            </div>
                            <div>
                                <span className="block text-[10px] font-bold tracking-wider text-slate-400 uppercase">
                                    Arbitrase Diajukan
                                </span>
                                <span className="text-xs font-bold text-slate-800 dark:text-white">
                                    Perselisihan (Dispute) Aktif
                                </span>
                                <p className="mt-1 text-[11px] text-slate-500">
                                    Diajukan oleh <strong>{quest.dispute.filer_name}</strong>. Alasan sengketa: <span className="text-red-600 italic dark:text-red-400">"{quest.dispute.reason}"</span>.
                                </p>
                            </div>
                        </div>
                    )}

                    {/* Event 5: Final Verdict */}
                    {quest.dispute && quest.dispute.status?.startsWith('resolved') && (
                        <div className="relative">
                            <div className="absolute top-1 -left-[31px] flex h-4 w-4 items-center justify-center rounded-full border border-purple-500 bg-white text-purple-500 dark:bg-[#0c122c]">
                                <div className="h-2 w-2 rounded-full bg-purple-500" />
                            </div>
                            <div>
                                <span className="block text-[10px] font-bold tracking-wider text-slate-400 uppercase">
                                    {quest.dispute.ruled_at ? formatDate(quest.dispute.ruled_at) : 'Arbitrase Selesai'}
                                </span>
                                <span className="text-xs font-bold text-slate-800 dark:text-white">
                                    Vonis Arbitrase Dijatuhkan
                                </span>
                                <p className="mt-1 text-[11px] text-slate-500">
                                    Mediator memutuskan vonis:{' '}
                                    <strong>
                                        {quest.dispute.ruling === 'split'
                                            ? `Bagi Hasil (Pekerja ${quest.dispute.split_percentage}%)`
                                            : quest.dispute.ruling === 'refund'
                                              ? 'Refund Pembuat 100%'
                                              : 'Pekerja 100%'}
                                    </strong>
                                    .
                                </p>
                                {quest.dispute.note && (
                                    <p className="mt-1 text-[11px] text-slate-500 italic">
                                        Memo Admin: "{quest.dispute.note}"
                                    </p>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Action Control Panel */}
            <div className="space-y-6 rounded-2xl border border-slate-200 bg-white/70 p-6 shadow-md backdrop-blur-md transition-all duration-300 dark:border-slate-800/80 dark:bg-[#0c122c]/40">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3 dark:border-slate-800">
                    <h3 className="flex items-center gap-2 text-sm font-bold tracking-wider text-slate-800 uppercase dark:text-blue-200">
                        <TrendingUp size={16} className="text-indigo-500" />
                        Pusat Kontrol Administratif
                    </h3>
                </div>

                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                    {/* Extend Deadline Form */}
                    <form
                        onSubmit={handleExtendDeadline}
                        className="space-y-4 rounded-xl border border-slate-100 bg-slate-50/50 p-4 dark:border-slate-800/50 dark:bg-black/20"
                    >
                        <h4 className="text-xs font-bold tracking-wider text-slate-700 uppercase dark:text-slate-300">
                            Perpanjang Tenggat Waktu
                        </h4>
                        <p className="text-slate-450 text-[11px] dark:text-slate-400">
                            Ubah batas akhir pengiriman untuk memberikan waktu tambahan kepada pekerja.
                        </p>
                        <div className="space-y-2">
                            <input
                                type="datetime-local"
                                value={extendDeadlineForm.data.deadline}
                                onChange={(e) => extendDeadlineForm.setData('deadline', e.target.value)}
                                className="text-slate-850 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs focus:border-indigo-500 focus:outline-none dark:border-slate-800 dark:bg-[#0c122c] dark:text-white"
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
                            className="w-full cursor-pointer rounded-xl bg-indigo-600 py-2 text-xs font-bold tracking-wider text-white uppercase transition-colors hover:bg-indigo-700 disabled:opacity-50"
                        >
                            {extendDeadlineForm.processing ? 'Memperbarui...' : 'Perpanjang Deadline'}
                        </button>
                    </form>

                    {/* Quick Recovery Actions */}
                    <div className="flex flex-col justify-between space-y-4 rounded-xl border border-slate-100 bg-slate-50/50 p-4 dark:border-slate-800/50 dark:bg-black/20">
                        <div>
                            <h4 className="text-xs font-bold tracking-wider text-slate-700 uppercase dark:text-slate-300">
                                Tindakan Pemulihan Cepat
                            </h4>
                            <p className="text-slate-455 mt-1 text-[11px] dark:text-slate-400">
                                Gunakan opsi di bawah ini jika terjadi kemacetan pengerjaan atau perselisihan sepihak.
                            </p>
                        </div>
                        <div className="grid grid-cols-1 gap-2 pt-2">
                            <button
                                type="button"
                                onClick={handleReopenBidding}
                                className="w-full cursor-pointer rounded-xl border border-amber-500/20 bg-amber-500/10 py-2.5 text-center text-xs font-bold tracking-wider text-amber-600 uppercase transition-all hover:bg-amber-500/20 dark:text-amber-300"
                            >
                                Buka Kembali Bidding
                            </button>
                            <button
                                type="button"
                                onClick={handleForceCancel}
                                className="w-full cursor-pointer rounded-xl border border-red-500/20 bg-red-500/10 py-2.5 text-center text-xs font-bold tracking-wider text-red-600 uppercase transition-all hover:bg-red-500/20 dark:text-red-300"
                            >
                                Batalkan Quest & Batalkan Reward
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Dispute & Arbitration Panel */}
            <div className="space-y-6 rounded-2xl border border-slate-200 bg-white/70 p-6 shadow-md backdrop-blur-md transition-all duration-300 dark:border-slate-800/80 dark:bg-[#0c122c]/40">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3 dark:border-slate-800">
                    <h3 className="flex items-center gap-2 text-sm font-bold tracking-wider text-slate-800 uppercase dark:text-blue-200">
                        <ShieldAlert size={16} className="text-red-500" />
                        Arbitrase Penyelidikan & Sengketa
                    </h3>
                    <span
                        className={`rounded-full border px-2.5 py-0.5 text-[10px] font-bold uppercase ${
                            quest.status === 'disputed'
                                ? 'text-red-605 animate-pulse border-red-500/20 bg-red-500/10 dark:text-red-400'
                                : quest.dispute?.status?.startsWith('resolved')
                                  ? 'border-emerald-500/20 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                                  : 'text-slate-455 border-slate-200 bg-slate-100 dark:border-slate-700 dark:bg-slate-800'
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
                        <div className="space-y-2 rounded-xl border border-red-200/20 bg-red-500/5 p-4 dark:border-red-500/10 dark:bg-red-955/10">
                            <div className="text-slate-505 flex items-center justify-between text-xs font-semibold dark:text-slate-400">
                                <span>
                                    Diajukan oleh: <strong className="text-slate-755 dark:text-white">{quest.dispute.filer_name}</strong>
                                </span>
                                <span>
                                    Tanggal Pengajuan: {quest.dispute.ruled_at ? formatDate(quest.dispute.ruled_at) : 'Baru saja'}
                                </span>
                            </div>
                            <p className="text-slate-655 rounded-lg border border-slate-100 bg-white/40 p-3 text-xs italic dark:border-red-500/5 dark:bg-black/10">
                                "{quest.dispute.reason}"
                            </p>

                            <div className="mt-2 flex items-center justify-between border-t border-slate-200/20 pt-2">
                                <span className="text-[11px] text-slate-500 dark:text-slate-400">
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
                                                className="flex cursor-pointer items-center justify-center gap-1.5 rounded-lg px-3 py-1.5 text-[10px] font-bold text-white uppercase transition-colors hover:bg-red-700 bg-red-605 bg-red-600"
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
                            <div className="space-y-4 rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-5 dark:border-emerald-500/10 dark:bg-emerald-955/10">
                                <h4 className="flex items-center gap-1.5 text-xs font-bold text-emerald-600 uppercase dark:text-emerald-400">
                                    <Award size={14} />
                                    Ketetapan Resmi Arbitrase
                                </h4>
                                <div className="grid grid-cols-2 gap-4 text-xs">
                                    <div>
                                        <span className="block text-[10px] font-bold text-slate-400 uppercase">
                                            Status Pembayaran
                                        </span>
                                        <span className="font-bold text-slate-800 uppercase dark:text-white">
                                            {['refund', 'refund_creator'].includes(quest.dispute.ruling ?? '') && 'Pembatalan & Refund Penuh'}
                                            {['pay_worker', 'release_payout'].includes(quest.dispute.ruling ?? '') && 'Bayar Penuh Ke Pekerja'}
                                            {quest.dispute.ruling === 'split' && `Bagi Hasil (Pekerja ${quest.dispute.split_percentage}%)`}
                                        </span>
                                    </div>
                                    {quest.dispute.split_percentage !== undefined && quest.dispute.ruling === 'split' && (
                                        <div>
                                            <span className="block text-[10px] font-bold text-slate-400 uppercase">
                                                Pembagian Dana
                                            </span>
                                            <span className="font-bold text-slate-800 dark:text-white">
                                                Pekerja {quest.dispute.split_percentage}% / Pembuat {100 - (quest.dispute.split_percentage ?? 0)}%
                                            </span>
                                        </div>
                                    )}
                                </div>
                                <div className="border-t border-emerald-500/10 pt-3 text-xs">
                                    <span className="mb-1 block text-[10px] font-bold text-slate-400 uppercase">
                                        Catatan Vonis Mediator
                                    </span>
                                    <p className="font-medium text-emerald-700 italic dark:text-emerald-300">
                                        "{quest.dispute.note ?? 'Sengketa diselesaikan.'}"
                                    </p>
                                </div>
                            </div>
                        ) : (
                            /* Active Dispute: Arbitrate Decision Form */
                            <form
                                onSubmit={handleArbitrate}
                                className="space-y-5 rounded-xl border border-slate-100 bg-slate-50/50 p-4 dark:border-slate-800/50 dark:bg-black/20"
                            >
                                <div className="flex items-center justify-between">
                                    <h4 className="text-xs font-bold tracking-wider text-slate-800 uppercase dark:text-slate-300">
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
                                                ? 'border-red-500 bg-red-500/10 font-bold text-red-600 shadow-sm dark:text-red-300'
                                                : 'text-slate-550 border-slate-200 bg-white hover:border-slate-300 dark:border-slate-800 dark:bg-[#0c122c]'
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
                                        <span className="block text-[10px] leading-relaxed font-normal text-slate-400">
                                            Kembalikan 100% koin reward ke pembuat quest.
                                        </span>
                                    </label>

                                    <label
                                        className={`flex cursor-pointer flex-col items-center justify-center gap-1.5 rounded-xl border p-4 text-center transition-all ${
                                            arbitrateForm.data.ruling === 'pay_worker'
                                                ? 'border-emerald-500 bg-emerald-500/10 font-bold text-emerald-600 shadow-sm'
                                                : 'text-slate-555 border-slate-200 bg-white hover:border-slate-300 dark:border-slate-800 dark:bg-[#0c122c]'
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
                                        <span className="block text-[10px] leading-relaxed font-normal text-slate-400">
                                            Transfer 100% reward kepada pekerja terpilih.
                                        </span>
                                    </label>

                                    <label
                                        className={`flex cursor-pointer flex-col items-center justify-center gap-1.5 rounded-xl border p-4 text-center transition-all ${
                                            arbitrateForm.data.ruling === 'split'
                                                ? 'border-indigo-500 bg-indigo-500/10 font-bold text-indigo-600 shadow-sm dark:text-indigo-300'
                                                : 'text-slate-555 border-slate-200 bg-white hover:border-slate-300 dark:border-slate-800 dark:bg-[#0c122c]'
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
                                        <span className="block text-[10px] leading-relaxed font-normal text-slate-400">
                                            Membagi reward secara proporsional sesuai kesepakatan.
                                        </span>
                                    </label>
                                </div>

                                {/* Custom Split Value Controls */}
                                {arbitrateForm.data.ruling === 'split' && (
                                    <div className="space-y-2 rounded-xl border border-indigo-500/10 bg-indigo-500/5 p-4 dark:border-indigo-500/5 dark:bg-indigo-950/10">
                                        <label className="block text-[10px] font-bold tracking-wider text-slate-400 uppercase">
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
                                            <div className="text-slate-850 w-16 shrink-0 rounded-lg border border-slate-200 bg-white px-2.5 py-1 text-center text-xs font-bold dark:border-slate-800 dark:bg-[#0c122c] dark:text-white">
                                                {arbitrateForm.data.split_percentage}%
                                            </div>
                                        </div>
                                        <span className="mt-1 block text-[10px] text-slate-400">
                                            Pekerja akan menerima <strong>{arbitrateForm.data.split_percentage}%</strong> dan sisa <strong>{100 - (arbitrateForm.data.split_percentage ?? 0)}%</strong> dari reward dibatalkan/tidak dicairkan.
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
                                    <label className="text-[10px] font-bold text-slate-400 uppercase">
                                        Catatan Keputusan / Memorandum Mediator <span className="text-red-500">*</span>
                                    </label>
                                    <textarea
                                        required
                                        placeholder="Tulis memorandum atau penjelasan hukum/kebijakan resmi mengenai keputusan sengketa ini..."
                                        rows={3}
                                        value={arbitrateForm.data.note}
                                        onChange={(e) => arbitrateForm.setData('note', e.target.value)}
                                        className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-xs text-slate-800 focus:border-indigo-500 focus:outline-none dark:border-slate-800 dark:bg-[#0c122c] dark:text-white"
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
                                    className="w-full cursor-pointer rounded-xl bg-red-600 py-2.5 text-xs font-bold tracking-wider text-white uppercase shadow-md transition-colors hover:bg-red-700 disabled:opacity-50"
                                >
                                    {arbitrateForm.processing ? 'Memproses Keputusan...' : 'Kirim Keputusan Sengketa'}
                                </button>
                            </form>
                        )}
                    </div>
                ) : (
                    <div className="text-slate-405 rounded-xl border border-dashed border-slate-200 bg-slate-50/50 py-8 text-center dark:border-slate-800 dark:bg-black/10 dark:text-blue-300/30">
                        <ShieldAlert className="mx-auto mb-2 h-8 w-8 animate-pulse text-slate-400 opacity-40" />
                        <p className="text-xs font-bold uppercase">
                            Tidak Ada Sengketa Aktif
                        </p>
                        <p className="mt-0.5 text-[10px] text-slate-500">
                            Quest ini berjalan dengan normal dan tidak berada dalam status banding/dispute.
                        </p>
                    </div>
                )}
            </div>

            {/* Quest Transaction Ledger */}
            <div className="space-y-5 rounded-2xl border border-slate-200 bg-white/70 p-6 shadow-md backdrop-blur-md transition-all duration-300 dark:border-slate-800/80 dark:bg-[#0c122c]/40">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3 dark:border-slate-800">
                    <h3 className="flex items-center gap-2 font-['Orbitron'] text-sm font-bold tracking-wider text-slate-800 uppercase dark:text-blue-200">
                        <FolderGit size={16} className="text-purple-500" />
                        Buku Besar Transaksi Koin Gold (Quest Ledger)
                    </h3>
                    <span className="rounded-md border border-indigo-500/20 bg-indigo-500/10 px-2 py-0.5 text-xs font-semibold text-indigo-600 dark:text-indigo-300">
                        {transactions.length} Transaksi
                    </span>
                </div>

                {transactions.length === 0 ? (
                    <div className="py-8 text-center font-['Oxanium'] text-slate-400 dark:text-blue-300/30">
                        <p className="font-['Orbitron'] text-xs font-bold uppercase">
                            Belum Ada Catatan Transaksi
                        </p>
                        <p className="text-[10px] text-slate-500">
                            Belum ada transaksi dana/escrow koin Gold yang tercatat pada quest ini.
                        </p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full border-collapse text-left font-['Oxanium'] text-xs">
                            <thead>
                                <tr className="border-b border-slate-100 text-[10px] font-bold text-slate-400 uppercase dark:border-slate-800/80">
                                    <th className="py-2.5">Tanggal</th>
                                    <th className="py-2.5">Tipe</th>
                                    <th className="py-2.5">Pihak Terkait</th>
                                    <th className="py-2.5">Jumlah</th>
                                    <th className="py-2.5">Deskripsi</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/50">
                                {transactions.map((t) => (
                                    <tr key={t._id} className="hover:bg-slate-50/50 dark:hover:bg-black/10">
                                        <td className="py-2.5 font-semibold text-slate-500 dark:text-slate-400">
                                            {formatDate(t.created_at)}
                                        </td>
                                        <td className="py-2.5 text-[10px] font-bold uppercase">
                                            <span
                                                className={`rounded px-2 py-0.5 ${
                                                    t.type === 'hold_escrow'
                                                        ? 'border border-amber-500/20 bg-amber-500/10 text-amber-600 dark:text-amber-300'
                                                        : t.type === 'release_payout'
                                                          ? 'border border-green-500/20 bg-green-500/10 text-green-600 dark:text-green-400'
                                                          : 'border border-indigo-500/20 bg-indigo-500/10 text-indigo-600 dark:text-indigo-400'
                                                }`}
                                            >
                                                {t.type === 'hold_escrow' && 'Hold Escrow'}
                                                {t.type === 'release_payout' && 'Release Payout'}
                                                {t.type === 'refund_escrow' && 'Refund Escrow'}
                                                {!['hold_escrow', 'release_payout', 'refund_escrow'].includes(t.type) && t.type}
                                            </span>
                                        </td>
                                        <td className="py-2.5 font-semibold text-slate-705 dark:text-slate-300">
                                            {t.user?.name ?? 'Sistem / Escrow'}
                                        </td>
                                        <td className="py-2.5 font-['Orbitron'] font-black text-amber-500">
                                            {t.amount > 0 ? `+${t.amount}` : t.amount} G
                                        </td>
                                        <td className="py-2.5 text-slate-500 italic dark:text-slate-400">
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
