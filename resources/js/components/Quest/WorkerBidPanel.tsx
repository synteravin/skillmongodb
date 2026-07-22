import React from 'react';
import { useForm } from '@inertiajs/react';
import { Briefcase, MessageSquare, Send, Link as LinkIcon, FileText, XCircle, Clock } from 'lucide-react';
import { Quest, Bid } from '@/types/quest';

interface Props {
    quest: Quest;
    myBid: Bid | null;
    can: {
        bid: boolean;
    };
    setSelectedChatBid: (bid: { id: string; name: string } | null) => void;
}

export default function WorkerBidPanel({
    quest,
    myBid,
    can,
    setSelectedChatBid,
}: Props) {
    const { data, setData, post, processing, errors, reset } = useForm({
        bid_amount: '',
        cv: '',
        portfolio: '',
        proposal: '',
    });

    const handleBidSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(`/student/quests/${quest._id}/bid`, {
            onSuccess: () => reset(),
        });
    };

    const formatDate = (dateStr: string) => {
        const d = new Date(dateStr);
        return d.toLocaleDateString('id-ID', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    const minBudget = quest.min_budget ?? quest.min_salary ?? 0;
    const maxBudget = quest.max_budget ?? quest.max_salary ?? 0;

    return (
        <div className="relative overflow-hidden space-y-5 rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-gradient-to-b dark:from-[#0e0e1a] dark:to-[#090910]">
            <div className="absolute top-0 right-8 left-8 h-px bg-gradient-to-r from-transparent via-slate-300 to-transparent dark:via-slate-700 pointer-events-none select-none z-0" />
            <div className="relative z-10 flex items-center justify-between border-b border-slate-100 pb-3 dark:border-slate-800">
                <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200">
                    Proposal Penawaran Proyek
                </h3>
            </div>

            {/* Case A: Already Bid */}
            {myBid ? (
                <div className="space-y-4">
                    <div
                        className={`flex items-start gap-3 rounded-xl border bg-white p-4 dark:bg-[#0d0f17] ${
                            myBid.status === 'rejected'
                                ? 'border-red-200 dark:border-red-900/40'
                                : 'border-amber-200 dark:border-amber-900/40'
                        }`}
                    >
                        {myBid.status === 'rejected' ? (
                            <XCircle size={16} className="mt-0.5 shrink-0 text-red-500 dark:text-red-400" />
                        ) : (
                            <Clock size={16} className="mt-0.5 shrink-0 text-amber-500 dark:text-amber-400" />
                        )}
                        <div className="text-left">
                            <span
                                className={`block text-xs font-semibold uppercase tracking-wide ${
                                    myBid.status === 'rejected'
                                        ? 'text-red-600 dark:text-red-400'
                                        : 'text-amber-600 dark:text-amber-400'
                                }`}
                            >
                                {myBid.status === 'rejected'
                                    ? 'Penawaran Belum Terpilih'
                                    : 'Penawaran Sedang Ditinjau'}
                            </span>
                            <p className="mt-0.5 text-xs leading-relaxed text-slate-500 dark:text-slate-400">
                                {myBid.status === 'rejected'
                                    ? 'Maaf, proposal penawaran Anda belum terpilih untuk proyek ini.'
                                    : 'Proposal penawaran Anda telah terkirim dan sedang ditinjau oleh pemilik proyek.'}
                            </p>
                        </div>
                    </div>

                    <div className="space-y-3.5 rounded-xl border border-slate-200 bg-slate-50 p-4 text-xs dark:border-slate-800 dark:bg-[#040812]">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <strong className="block text-[10px] tracking-wider text-slate-400 uppercase">
                                    Harga Penawaran
                                </strong>
                                <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                                    Rp {myBid.bid_amount.toLocaleString('id-ID')}
                                </span>
                            </div>
                            <div>
                                <strong className="block text-[10px] tracking-wider text-slate-400 uppercase">
                                    Tanggal Pengajuan
                                </strong>
                                <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                                    {formatDate(myBid.created_at)}
                                </span>
                            </div>
                        </div>

                        <div className="border-t border-slate-100 pt-2 dark:border-slate-800">
                            <strong className="block text-[10px] tracking-wider text-slate-400 uppercase">
                                Proposal Penawaran
                            </strong>
                            <p className="mt-1 leading-relaxed text-slate-600 dark:text-slate-300 whitespace-pre-wrap">
                                {myBid.proposal}
                            </p>
                        </div>

                        <div className="grid grid-cols-2 gap-2 border-t border-slate-100 pt-2 dark:border-slate-800">
                            {myBid.cv && (
                                <a
                                    href={myBid.cv.startsWith('http') ? myBid.cv : '#'}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center justify-center gap-1 rounded bg-slate-100 py-1.5 text-center text-[10px] font-bold text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-indigo-400 dark:hover:bg-slate-700"
                                >
                                    <FileText size={12} />
                                    Tautan CV
                                </a>
                            )}
                            {myBid.portfolio && (
                                <a
                                    href={
                                        myBid.portfolio.startsWith('http')
                                            ? myBid.portfolio
                                            : '#'
                                    }
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center justify-center gap-1 rounded bg-slate-100 py-1.5 text-center text-[10px] font-bold text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-indigo-400 dark:hover:bg-slate-700"
                                >
                                    <LinkIcon size={12} />
                                    Portofolio
                                </a>
                            )}
                        </div>
                    </div>

                    {myBid.status !== 'rejected' && (
                        <button
                            type="button"
                            onClick={() =>
                                setSelectedChatBid({
                                    id: myBid._id,
                                    name: quest.creator.name,
                                })
                            }
                            className="flex w-full items-center justify-center gap-1.5 cursor-pointer rounded-lg bg-indigo-600 py-2.5 text-xs font-bold text-white uppercase tracking-wider transition-all hover:bg-indigo-700"
                        >
                            <MessageSquare size={14} />
                            Hubungi Klien
                        </button>
                    )}
                </div>
            ) : quest.status === 'open' && can.bid ? (
                /* Case B: Place Bid Form */
                <form onSubmit={handleBidSubmit} className="space-y-4">
                    <div className="space-y-1.5">
                        <label className="text-[10px] font-bold text-slate-400 uppercase">
                            Harga Penawaran (IDR) <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                            <span className="absolute top-2.5 left-3 text-xs font-bold text-slate-400">
                                Rp
                            </span>
                            <input
                                type="number"
                                required
                                placeholder={`Rentang anggaran: Rp ${minBudget.toLocaleString('id-ID')} - Rp ${maxBudget.toLocaleString('id-ID')}`}
                                value={data.bid_amount}
                                onChange={(e) => setData('bid_amount', e.target.value)}
                                className="w-full rounded-lg border border-slate-200 bg-slate-50 py-2.5 pr-3 pl-9 text-xs font-bold text-slate-800 focus:border-indigo-650 focus:outline-none dark:border-slate-800 dark:bg-[#040812] dark:text-white"
                            />
                        </div>
                        {errors.bid_amount && (
                            <p className="text-xs font-semibold text-red-500">
                                {errors.bid_amount}
                            </p>
                        )}
                    </div>

                    <div className="space-y-1.5">
                        <label className="text-[10px] font-bold text-slate-400 uppercase">
                            Proposal / Penjelasan Kemampuan Pekerjaan{' '}
                            <span className="text-red-500">*</span>
                        </label>
                        <textarea
                            required
                            placeholder="Jelaskan mengapa Anda kandidat terbaik dan bagaimana Anda berencana menyelesaikan proyek ini secara profesional..."
                            rows={4}
                            value={data.proposal}
                            onChange={(e) => setData('proposal', e.target.value)}
                            className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-800 focus:border-indigo-650 focus:outline-none dark:border-slate-800 dark:bg-[#040812] dark:text-white"
                        />
                        {errors.proposal && (
                            <p className="text-xs font-semibold text-red-500">
                                {errors.proposal}
                            </p>
                        )}
                    </div>

                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <div className="space-y-1.5">
                            <label className="text-[10px] font-bold text-slate-400 uppercase">
                                Tautan Dokumen CV <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="url"
                                required
                                placeholder="https://drive.google.com/... (CV Publik)"
                                value={data.cv}
                                onChange={(e) => setData('cv', e.target.value)}
                                className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-800 focus:border-indigo-650 focus:outline-none dark:border-slate-800 dark:bg-[#040812] dark:text-white"
                            />
                            {errors.cv && (
                                <p className="text-xs font-semibold text-red-500">
                                    {errors.cv}
                                </p>
                            )}
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-[10px] font-bold text-slate-400 uppercase">
                                Tautan Portofolio <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="url"
                                required
                                placeholder="https://github.com/... atau behance.net/..."
                                value={data.portfolio}
                                onChange={(e) => setData('portfolio', e.target.value)}
                                className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-800 focus:border-indigo-650 focus:outline-none dark:border-slate-800 dark:bg-[#040812] dark:text-white"
                            />
                            {errors.portfolio && (
                                <p className="text-xs font-semibold text-red-500">
                                    {errors.portfolio}
                                </p>
                            )}
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={processing}
                        className="w-full cursor-pointer rounded-lg bg-indigo-650 py-2.5 text-xs font-bold text-white uppercase tracking-wider transition-all hover:bg-indigo-700 disabled:opacity-50"
                    >
                        {processing ? 'Mengirim Proposal...' : 'Kirim Proposal Proyek'}
                    </button>
                </form>
            ) : (
                /* Case C: Bidding Closed */
                <div className="py-8 text-center text-slate-400 dark:text-slate-500">
                    <Briefcase className="mx-auto mb-2 h-9 w-9 text-slate-300 dark:text-slate-700" />
                    <p className="text-xs font-bold uppercase tracking-wider text-slate-500">
                        Penerimaan Proposal Ditutup
                    </p>
                    <p className="text-[11px] text-slate-400">
                        Proyek ini sudah terisi atau sudah melewati masa bidding aktif.
                    </p>
                </div>
            )}
        </div>
    );
}
