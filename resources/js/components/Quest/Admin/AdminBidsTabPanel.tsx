import React from 'react';
import { Briefcase, Trash2 } from 'lucide-react';
import { Quest, Bid } from '@/types/quest';

interface AdminBidsTabPanelProps {
    quest: Quest;
    bids: Bid[];
    formatCurrency: (num: number) => string;
    handleAcceptBid: (bidId: string) => void;
    handleDeleteBid: (bidId: string) => void;
    setSelectedChatBid: (bid: { id: string; name: string } | null) => void;
}

export default function AdminBidsTabPanel({
    quest,
    bids,
    formatCurrency,
    handleAcceptBid,
    handleDeleteBid,
    setSelectedChatBid,
}: AdminBidsTabPanelProps) {
    const canAccept = quest.status === 'open';

    return (
        <div className="relative overflow-hidden space-y-5 rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-gradient-to-b dark:from-[#0e0e1a] dark:to-[#090910]">
            <div className="absolute top-0 right-8 left-8 h-px bg-gradient-to-r from-transparent via-slate-300 to-transparent dark:via-slate-700" />
            <div className="flex items-center justify-between border-b border-slate-200 pb-3 dark:border-slate-800">
                <h3 className="text-sm font-extrabold tracking-wider text-slate-900 uppercase dark:text-white">
                    Pelamar yang Mendaftar
                </h3>
                <span className="rounded-md border border-indigo-500/30 bg-indigo-500/10 px-2.5 py-0.5 text-xs font-bold text-indigo-700 dark:text-indigo-300">
                    {bids.length} Pelamar
                </span>
            </div>

            {bids.length === 0 ? (
                <div className="py-12 text-center text-slate-500 dark:text-slate-400">
                    <Briefcase className="mx-auto mb-2 h-10 w-10 text-indigo-500 opacity-60" />
                    <p className="text-xs font-extrabold uppercase text-slate-800 dark:text-slate-300">
                        Belum ada pelamar.
                    </p>
                    <p className="text-[11px] font-semibold text-slate-600 dark:text-slate-400">
                        Siswa belum mengajukan proposal penawaran untuk quest ini.
                    </p>
                </div>
            ) : (
                <div className="grid max-h-[750px] grid-cols-1 gap-4 overflow-y-auto pr-1 sm:grid-cols-2">
                    {bids.map((bid) => (
                        <div
                            key={bid._id}
                            className={`flex flex-col justify-between gap-3.5 rounded-xl border p-4 transition-all duration-300 ${
                                bid.status === 'accepted'
                                    ? 'border-emerald-500/40 bg-emerald-500/10 dark:border-emerald-500/30'
                                    : bid.status === 'rejected'
                                      ? 'border-slate-300 bg-slate-100 opacity-70 dark:border-slate-800 dark:bg-slate-900/40'
                                      : 'border-slate-300 bg-slate-50/70 hover:border-indigo-500/50 dark:border-slate-800 dark:bg-[#030712]'
                            }`}
                        >
                            <div className="space-y-3">
                                <div className="flex items-start justify-between gap-3">
                                    <div className="flex min-w-0 items-center gap-2.5">
                                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-tr from-indigo-600 to-indigo-800 text-xs font-bold text-white shadow-sm">
                                            {bid.student.name.substring(0, 2).toUpperCase()}
                                        </div>
                                        <div className="min-w-0">
                                            <span className="block truncate text-xs font-extrabold text-slate-900 dark:text-white">
                                                {bid.student.name}
                                            </span>
                                            <span className="block truncate text-[10px] font-semibold text-slate-500 dark:text-slate-400">
                                                {bid.student.email}
                                            </span>
                                        </div>
                                    </div>
                                    <span className="ml-1 shrink-0 text-xs font-extrabold text-indigo-700 dark:text-indigo-300">
                                        {formatCurrency(bid.bid_amount)}
                                    </span>
                                </div>

                                <div className="space-y-1.5 rounded-lg border border-slate-300 bg-white p-3 text-xs text-slate-800 dark:border-slate-800 dark:bg-[#0d0f17] dark:text-slate-200">
                                    <p className="line-clamp-3 leading-relaxed">
                                        <strong className="mb-1 block text-[9px] font-bold tracking-wider text-slate-600 uppercase dark:text-slate-400">
                                            Proposal
                                        </strong>
                                        {bid.proposal}
                                    </p>
                                    <div className="flex gap-2 pt-1.5">
                                        <a
                                            href={bid.cv.startsWith('http') ? bid.cv : '#'}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex-1 truncate rounded bg-slate-200 py-1 text-center text-[10px] font-bold text-slate-800 hover:bg-slate-300 dark:bg-slate-800 dark:text-indigo-300 dark:hover:bg-slate-700"
                                        >
                                            CV Link
                                        </a>
                                        <a
                                            href={bid.portfolio.startsWith('http') ? bid.portfolio : '#'}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex-1 truncate rounded bg-slate-200 py-1 text-center text-[10px] font-bold text-slate-800 hover:bg-slate-300 dark:bg-slate-800 dark:text-indigo-300 dark:hover:bg-slate-700"
                                        >
                                            Portfolio
                                        </a>
                                    </div>
                                </div>
                            </div>

                            <div className="flex w-full gap-2 pt-1">
                                {canAccept && bid.status === 'pending' && (
                                    <button
                                        onClick={() => handleAcceptBid(bid._id)}
                                        className="flex-1 cursor-pointer rounded-lg bg-emerald-600 py-1.5 text-[10px] font-bold tracking-wider text-white uppercase shadow-sm transition-all duration-200 hover:bg-emerald-700"
                                    >
                                        Terima
                                    </button>
                                )}
                                <button
                                    onClick={() => handleDeleteBid(bid._id)}
                                    className="flex shrink-0 cursor-pointer items-center justify-center rounded-lg bg-slate-200 px-2.5 py-1.5 text-slate-700 transition-colors hover:bg-red-500/20 hover:text-red-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-red-950/40 dark:hover:text-red-400"
                                    title="Hapus Bid Penawaran"
                                >
                                    <Trash2 size={12} />
                                </button>
                                <button
                                    onClick={() =>
                                        setSelectedChatBid({
                                            id: bid._id,
                                            name: bid.student.name,
                                        })
                                    }
                                    className="relative flex-1 cursor-pointer rounded-lg bg-indigo-600 py-1.5 text-[10px] font-bold tracking-wider text-white uppercase shadow-sm transition-all duration-200 hover:bg-indigo-700"
                                >
                                    Chat
                                    {bid.unread_messages_count > 0 && (
                                        <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5 animate-pulse items-center justify-center rounded-full bg-red-500 text-[8px] font-black text-white ring-2 ring-white dark:ring-slate-900">
                                            {bid.unread_messages_count}
                                        </span>
                                    )}
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
