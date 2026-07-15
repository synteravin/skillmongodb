import React, { useState } from 'react';
import { router } from '@inertiajs/react';
import { Star, Trash2, Check, MessageSquare, Briefcase } from 'lucide-react';
import ConfirmModal from '../ConfirmModal';
import { Quest, Bid } from '@/types/quest';

interface Props {
    quest: Quest;
    bids: Bid[];
    setSelectedChatBid: (bid: { id: string; name: string } | null) => void;
}

export default function BidsTabPanel({ quest, bids, setSelectedChatBid }: Props) {
    const [acceptBidId, setAcceptBidId] = useState<string | null>(null);
    const [shortlistedBidIds, setShortlistedBidIds] = useState<string[]>([]);
    const [archivedBidIds, setArchivedBidIds] = useState<string[]>([]);

    const formatCurrency = (num: number) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
        }).format(num);
    };

    const handleAcceptBid = (bidId: string) => {
        setAcceptBidId(bidId);
    };

    const handleConfirmAccept = () => {
        if (acceptBidId) {
            router.post(`/student/quests/${quest._id}/accept-bid/${acceptBidId}`, {}, {
                onSuccess: () => setAcceptBidId(null),
            });
        }
    };

    const sortedBids = [...bids].sort((a, b) => {
        const aShort = shortlistedBidIds.includes(a._id) ? 1 : 0;
        const bShort = shortlistedBidIds.includes(b._id) ? 1 : 0;
        const aArch = archivedBidIds.includes(a._id) ? 1 : 0;
        const bArch = archivedBidIds.includes(b._id) ? 1 : 0;
        if (aShort !== bShort) return bShort - aShort;
        return aArch - bArch;
    });

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
                    {sortedBids.map((bid) => {
                        const isShortlisted = shortlistedBidIds.includes(bid._id);
                        const isArchived = archivedBidIds.includes(bid._id);

                        return (
                            <div
                                key={bid._id}
                                className={`group relative flex flex-col justify-between gap-3.5 rounded-xl border p-4 transition-all duration-350 ${
                                    bid.status === 'accepted'
                                        ? 'border-green-500/35 bg-green-500/10'
                                        : bid.status === 'rejected'
                                          ? 'border-slate-200/50 bg-slate-100/50 opacity-65 dark:border-slate-800/40 dark:bg-slate-900/40'
                                          : isShortlisted
                                            ? 'border-purple-500/40 bg-purple-500/10 shadow-[0_0_12px_rgba(124,58,237,0.15)]'
                                            : isArchived
                                              ? 'border-slate-200 bg-slate-100/30 opacity-30 dark:border-slate-800/20 dark:bg-slate-900/10'
                                              : 'border-slate-200 bg-slate-50/50 hover:border-purple-500/50 dark:border-slate-800/60 dark:bg-black/20'
                                }`}
                            >
                                <div className="space-y-3 font-['Oxanium']">
                                    <div className="flex items-start justify-between">
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
                                        <div className="ml-2 flex shrink-0 items-center gap-1">
                                            <span className="mr-1 font-['Orbitron'] text-xs font-black text-purple-600 dark:text-purple-300">
                                                {formatCurrency(bid.bid_amount)}
                                            </span>
                                            {bid.status === 'pending' && (
                                                <>
                                                    <button
                                                        type="button"
                                                        onClick={() => {
                                                            if (isShortlisted) {
                                                                setShortlistedBidIds((prev) =>
                                                                    prev.filter((id) => id !== bid._id),
                                                                );
                                                            } else {
                                                                setShortlistedBidIds((prev) => [
                                                                    ...prev,
                                                                    bid._id,
                                                                ]);
                                                                setArchivedBidIds((prev) =>
                                                                    prev.filter((id) => id !== bid._id),
                                                                );
                                                            }
                                                        }}
                                                        className={`cursor-pointer rounded-lg border p-1 transition-colors ${
                                                            isShortlisted
                                                                ? 'border-amber-400 bg-amber-500/10 text-amber-500 hover:bg-amber-500/20'
                                                                : 'border-slate-200 bg-slate-50 text-slate-400 hover:text-amber-500 dark:border-slate-800 dark:bg-slate-800'
                                                        }`}
                                                        title={
                                                            isShortlisted
                                                                ? 'Batal Unggul'
                                                                : 'Shortlist (Unggulan)'
                                                        }
                                                    >
                                                        <Star
                                                            size={11}
                                                            className={
                                                                isShortlisted
                                                                    ? 'fill-amber-500 text-amber-500'
                                                                    : ''
                                                            }
                                                        />
                                                    </button>
                                                    <button
                                                        type="button"
                                                        onClick={() => {
                                                            if (isArchived) {
                                                                setArchivedBidIds((prev) =>
                                                                    prev.filter((id) => id !== bid._id),
                                                                );
                                                            } else {
                                                                setArchivedBidIds((prev) => [
                                                                    ...prev,
                                                                    bid._id,
                                                                ]);
                                                                setShortlistedBidIds((prev) =>
                                                                    prev.filter((id) => id !== bid._id),
                                                                );
                                                            }
                                                        }}
                                                        className={`cursor-pointer rounded-lg border p-1 transition-colors ${
                                                            isArchived
                                                                ? 'border-red-400 bg-red-500/10 text-red-500 hover:bg-red-500/20'
                                                                : 'border-slate-200 bg-slate-50 text-slate-400 hover:text-red-500 dark:border-slate-800 dark:bg-slate-800'
                                                        }`}
                                                        title={
                                                            isArchived
                                                                ? 'Batal Arsipkan'
                                                                : 'Arsipkan (Sembunyikan)'
                                                        }
                                                    >
                                                        <Trash2 size={11} />
                                                    </button>
                                                </>
                                            )}
                                        </div>
                                    </div>

                                    <div>
                                        <span className="block text-[8px] font-bold tracking-wider text-slate-400 uppercase">
                                            Proposal Penawaran
                                        </span>
                                        <p className="mt-1 line-clamp-3 text-xs leading-relaxed text-slate-600 dark:text-slate-350">
                                            {bid.proposal}
                                        </p>
                                    </div>

                                    <div className="grid grid-cols-2 gap-2 border-t border-slate-100 pt-2 dark:border-slate-800/40">
                                        {bid.cv && (
                                            <a
                                                href={bid.cv.startsWith('http') ? bid.cv : '#'}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="rounded bg-slate-100/60 py-1 text-center text-[10px] font-bold text-slate-500 hover:bg-slate-100 dark:bg-slate-800/40 dark:text-indigo-400"
                                            >
                                                Berkas CV
                                            </a>
                                        )}
                                        {bid.portfolio && (
                                            <a
                                                href={bid.portfolio.startsWith('http') ? bid.portfolio : '#'}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="rounded bg-slate-100/60 py-1 text-center text-[10px] font-bold text-slate-500 hover:bg-slate-100 dark:bg-slate-800/40 dark:text-indigo-400"
                                            >
                                                Portofolio
                                            </a>
                                        )}
                                    </div>
                                </div>

                                <div className="flex gap-2 border-t border-slate-100/60 pt-3 dark:border-slate-800/60">
                                    {bid.status === 'pending' && (
                                        <button
                                            type="button"
                                            onClick={() => handleAcceptBid(bid._id)}
                                            className="flex-1 flex cursor-pointer items-center justify-center gap-1 rounded-lg bg-indigo-650 py-1.5 font-['Orbitron'] text-[10px] font-bold tracking-wider text-white uppercase transition-colors hover:bg-indigo-700"
                                        >
                                            <Check size={12} />
                                            Terima Pekerja
                                        </button>
                                    )}

                                    {bid.status !== 'rejected' && (
                                        <button
                                            type="button"
                                            onClick={() =>
                                                setSelectedChatBid({
                                                    id: bid._id,
                                                    name: bid.student.name,
                                                })
                                            }
                                            className={`flex cursor-pointer items-center justify-center gap-1.5 rounded-lg py-1.5 font-['Orbitron'] text-[10px] font-bold tracking-wider uppercase transition-colors ${
                                                bid.status === 'accepted'
                                                    ? 'flex-1 bg-green-600 text-white hover:bg-green-700'
                                                    : 'w-full bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700'
                                            }`}
                                        >
                                            <MessageSquare size={11} />
                                            Chat Pelamar
                                        </button>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            <ConfirmModal
                open={!!acceptBidId}
                title="Pilih Pekerja"
                message="Apakah Anda yakin ingin memilih pekerja ini? Tindakan ini akan menutup bidding quest."
                confirmText="Pilih Pekerja"
                cancelText="Batal"
                variant="primary"
                onConfirm={handleConfirmAccept}
                onClose={() => setAcceptBidId(null)}
            />
        </div>
    );
}
