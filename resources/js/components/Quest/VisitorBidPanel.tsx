import React from 'react';
import { useForm } from '@inertiajs/react';
import { Briefcase, MessageSquare } from 'lucide-react';
import { Quest, Bid } from '@/types/quest';

interface Props {
    quest: Quest;
    myBid: Bid | null;
    can: {
        bid: boolean;
    };
    setSelectedChatBid: (bid: { id: string; name: string } | null) => void;
}

export default function VisitorBidPanel({
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

    return (
        <div className="space-y-5 rounded-2xl border border-slate-200 bg-white/70 p-6 shadow-md backdrop-blur-md transition-all duration-300 dark:border-slate-800/80 dark:bg-[#0c122c]/40">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 dark:border-slate-800">
                <h3 className="font-['Orbitron'] text-sm font-bold tracking-wider text-slate-800 uppercase dark:text-blue-200">
                    Status & Penawaran Proyek
                </h3>
            </div>

            {/* Case A: Already Bid */}
            {myBid ? (
                <div className="space-y-4 font-['Oxanium']">
                    <div
                        className={`flex flex-col gap-1.5 rounded-xl border p-4 text-center ${
                            myBid.status === 'rejected'
                                ? 'border-red-500/25 bg-red-500/10 text-red-600 dark:text-red-400'
                                : 'border-amber-500/25 bg-amber-500/10 text-amber-600 dark:text-amber-400'
                        }`}
                    >
                        <span className="block font-['Orbitron'] text-xs font-bold tracking-wider uppercase">
                            {myBid.status === 'rejected'
                                ? 'Penawaran Ditolak'
                                : 'Penawaran Sedang Ditinjau'}
                        </span>
                        <p className="text-xs leading-relaxed text-slate-500 dark:text-blue-300/60">
                            {myBid.status === 'rejected'
                                ? 'Maaf, penawaran Anda belum terpilih untuk quest ini.'
                                : 'Proposal penawaran Anda telah berhasil dikirimkan dan saat ini sedang menunggu review dari pemilik quest.'}
                        </p>
                    </div>

                    <div className="space-y-3.5 rounded-xl border border-slate-200 bg-slate-50/50 p-4 text-xs dark:border-slate-800 dark:bg-black/20">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <strong className="block text-[10px] tracking-wider text-slate-400 uppercase">
                                    Harga Penawaran
                                </strong>
                                <span className="font-semibold text-slate-700 dark:text-slate-200">
                                    Rp {myBid.bid_amount.toLocaleString('id-ID')}
                                </span>
                            </div>
                            <div>
                                <strong className="block text-[10px] tracking-wider text-slate-400 uppercase">
                                    Waktu Pengajuan
                                </strong>
                                <span className="font-semibold text-slate-700 dark:text-slate-200">
                                    {formatDate(myBid.created_at)}
                                </span>
                            </div>
                        </div>

                        <div className="border-t border-slate-200/50 pt-2 dark:border-slate-800/50">
                            <strong className="block text-[10px] tracking-wider text-slate-400 uppercase">
                                Proposal Anda
                            </strong>
                            <p className="mt-1 leading-relaxed text-slate-600 dark:text-slate-300">
                                {myBid.proposal}
                            </p>
                        </div>

                        <div className="grid grid-cols-2 gap-2 border-t border-slate-200/50 pt-2 dark:border-slate-800/50">
                            {myBid.cv && (
                                <a
                                    href={myBid.cv.startsWith('http') ? myBid.cv : '#'}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="rounded bg-slate-100 py-1.5 text-center text-[10px] font-bold text-slate-600 hover:bg-slate-200 dark:bg-slate-800/50 dark:text-indigo-300"
                                >
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
                                    className="rounded bg-slate-100 py-1.5 text-center text-[10px] font-bold text-slate-600 hover:bg-slate-200 dark:bg-slate-800/50 dark:text-indigo-300"
                                >
                                    Tautan Portofolio
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
                            className="flex w-full items-center justify-center gap-1.5 cursor-pointer rounded-xl bg-indigo-600 py-2.5 font-['Orbitron'] text-xs font-bold tracking-wider text-white uppercase shadow-md transition-all hover:bg-indigo-700"
                        >
                            <MessageSquare size={14} />
                            Chat Pembuat Quest
                        </button>
                    )}
                </div>
            ) : quest.status === 'open' && can.bid ? (
                /* Case B: Place Bid Form */
                <form onSubmit={handleBidSubmit} className="space-y-4 font-['Oxanium']">
                    <div className="space-y-1.5">
                        <label className="text-[10px] font-bold text-slate-500 uppercase dark:text-slate-400">
                            Harga Penawaran (IDR) <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="number"
                            required
                            placeholder={`Rentang anggaran: Rp ${quest.min_salary.toLocaleString('id-ID')} - Rp ${quest.max_salary.toLocaleString('id-ID')}`}
                            value={data.bid_amount}
                            onChange={(e) => setData('bid_amount', e.target.value)}
                            className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-800 focus:border-indigo-500 focus:outline-none dark:border-slate-800 dark:bg-black/20 dark:text-white"
                        />
                        {errors.bid_amount && (
                            <p className="text-xs font-semibold text-red-500">
                                {errors.bid_amount}
                            </p>
                        )}
                    </div>

                    <div className="space-y-1.5">
                        <label className="text-[10px] font-bold text-slate-500 uppercase dark:text-slate-400">
                            Proposal / Penjelasan Kemampuan{' '}
                            <span className="text-red-500">*</span>
                        </label>
                        <textarea
                            required
                            placeholder="Jelaskan mengapa Anda kandidat terbaik dan bagaimana Anda akan menyelesaikan tugas ini..."
                            rows={4}
                            value={data.proposal}
                            onChange={(e) => setData('proposal', e.target.value)}
                            className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-800 focus:border-indigo-500 focus:outline-none dark:border-slate-800 dark:bg-black/20 dark:text-white"
                        />
                        {errors.proposal && (
                            <p className="text-xs font-semibold text-red-500">
                                {errors.proposal}
                            </p>
                        )}
                    </div>

                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <div className="space-y-1.5">
                            <label className="text-[10px] font-bold text-slate-500 uppercase dark:text-slate-400">
                                Tautan CV <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="url"
                                required
                                placeholder="https://drive.google.com/... (Gunakan tautan publik)"
                                value={data.cv}
                                onChange={(e) => setData('cv', e.target.value)}
                                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-800 focus:border-indigo-500 focus:outline-none dark:border-slate-800 dark:bg-black/20 dark:text-white"
                            />
                            {errors.cv && (
                                <p className="text-xs font-semibold text-red-500">
                                    {errors.cv}
                                </p>
                            )}
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-[10px] font-bold text-slate-500 uppercase dark:text-slate-400">
                                Tautan Portofolio <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="url"
                                required
                                placeholder="https://github.com/... atau behance.net/..."
                                value={data.portfolio}
                                onChange={(e) => setData('portfolio', e.target.value)}
                                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-800 focus:border-indigo-500 focus:outline-none dark:border-slate-800 dark:bg-black/20 dark:text-white"
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
                        className="w-full cursor-pointer rounded-xl bg-indigo-600 py-2.5 font-['Orbitron'] text-xs font-bold tracking-wider text-white uppercase shadow-md transition-all hover:bg-indigo-700 disabled:opacity-50"
                    >
                        {processing ? 'Mengirim Penawaran...' : 'Kirim Penawaran Proyek'}
                    </button>
                </form>
            ) : (
                /* Case C: Bidding Closed */
                <div className="py-8 text-center font-['Oxanium'] text-slate-400 dark:text-blue-300/40">
                    <Briefcase className="mx-auto mb-2 h-10 w-10 text-indigo-500 opacity-50" />
                    <p className="font-['Orbitron'] text-xs font-bold uppercase">
                        Quest Ditutup
                    </p>
                    <p className="text-[11px] text-slate-500">
                        Quest ini sudah tidak menerima proposal penawaran baru lagi.
                    </p>
                </div>
            )}
        </div>
    );
}
