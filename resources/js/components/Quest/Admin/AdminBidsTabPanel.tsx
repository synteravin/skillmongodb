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
        <div className="space-y-5 rounded-2xl border border-slate-200 bg-white/70 p-6 shadow-md backdrop-blur-md transition-all duration-300 dark:border-slate-800/80 dark:bg-[#0c122c]/40">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 dark:border-slate-800">
                <h3 className="font-['Orbitron'] text-sm font-bold tracking-wider text-slate-800 uppercase dark:text-blue-200">
                    Pelamar yang Mendaftar
                </h3>
                <span className="rounded-md border border-purple-500/20 bg-purple-500/10 px-2 py-0.5 text-xs font-semibold text-purple-600 dark:text-purple-300">
                    {bids.length} Pelamar
                </span>
            </div>

            {bids.length === 0 ? (
                <div className="py-12 text-center font-['Oxanium'] text-slate-400 dark:text-blue-300/40">
                    <Briefcase className="mx-auto mb-2 h-10 w-10 text-indigo-500 opacity-50" />
                    <p className="font-['Orbitron'] text-xs font-bold uppercase">
                        Belum ada pelamar.
                    </p>
                    <p className="text-[11px] text-slate-500">
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
                                    ? 'border-green-500/35 bg-green-500/10 dark:border-green-500/20'
                                    : bid.status === 'rejected'
                                      ? 'border-slate-200/50 bg-slate-100/50 opacity-65 dark:border-slate-800/40 dark:bg-[#111425]'
                                      : 'border-slate-200 bg-slate-50/50 hover:border-purple-500/50 dark:border-slate-800/60 dark:bg-black/20'
                            }`}
                        >
                            <div className="space-y-3 font-['Oxanium']">
                                <div className="flex items-start justify-between gap-3">
                                    <div className="flex min-w-0 items-center gap-2.5">
                                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-tr from-indigo-500 to-purple-600 text-xs font-bold text-white">
                                            {bid.student.name.substring(0, 2).toUpperCase()}
                                        </div>
                                        <div className="min-w-0">
                                            <span className="block truncate text-xs font-extrabold text-slate-800 dark:text-white">
                                                {bid.student.name}
                                            </span>
                                            <span className="block truncate text-[10px] text-slate-400">
                                                {bid.student.email}
                                            </span>
                                        </div>
                                    </div>
                                    <span className="ml-1 shrink-0 font-['Orbitron'] text-xs font-black text-purple-600 dark:text-purple-300">
                                        {formatCurrency(bid.bid_amount)}
                                    </span>
                                </div>

                                <div className="space-y-1.5 rounded-lg border border-slate-100 bg-white/50 p-2.5 text-xs text-slate-500 dark:border-slate-800/40 dark:bg-[#090b16] dark:text-slate-300">
                                    <p className="line-clamp-3 leading-relaxed">
                                        <strong className="mb-0.5 block font-['Orbitron'] text-[8px] tracking-wider text-slate-400 uppercase">
                                            Proposal
                                        </strong>
                                        {bid.proposal}
                                    </p>
                                    <div className="flex gap-2 pt-1">
                                        <a
                                            href={bid.cv.startsWith('http') ? bid.cv : '#'}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex-1 truncate rounded bg-slate-100 py-1 text-center text-[10px] font-bold text-slate-600 hover:bg-slate-200 dark:bg-slate-800/50 dark:text-indigo-300 dark:hover:bg-slate-800"
                                        >
                                            CV Link
                                        </a>
                                        <a
                                            href={bid.portfolio.startsWith('http') ? bid.portfolio : '#'}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex-1 truncate rounded bg-slate-100 py-1 text-center text-[10px] font-bold text-slate-600 hover:bg-slate-200 dark:bg-slate-800/50 dark:text-indigo-300 dark:hover:bg-slate-800"
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
                                        className="flex-1 animate-pulse cursor-pointer rounded-lg bg-green-600 py-1.5 font-['Orbitron'] text-[10px] font-bold tracking-wider text-white uppercase shadow-sm transition-all duration-300 hover:bg-green-700"
                                    >
                                        Terima
                                    </button>
                                )}
                                <button
                                    onClick={() => handleDeleteBid(bid._id)}
                                    className="flex shrink-0 cursor-pointer items-center justify-center rounded-lg bg-slate-100 px-2.5 py-1.5 text-slate-500 transition-colors hover:bg-red-500/10 hover:text-red-500 dark:bg-slate-800 dark:hover:bg-red-950/20"
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
                                    className="relative flex-1 cursor-pointer rounded-lg bg-indigo-600 py-1.5 font-['Orbitron'] text-[10px] font-bold tracking-wider text-white uppercase shadow-sm transition-all duration-300 hover:bg-indigo-700"
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
