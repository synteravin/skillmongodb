import React, { useState } from 'react';
import { router } from '@inertiajs/react';
import {
    Star,
    Archive,
    Check,
    MessageSquare,
    Briefcase,
    Award,
    FileText,
    ExternalLink,
} from 'lucide-react';
import ConfirmModal from '../ConfirmModal';
import { Quest, Bid } from '@/types/quest';

interface Props {
    quest: Quest;
    bids: Bid[];
    setSelectedChatBid: (bid: { id: string; name: string } | null) => void;
}

export default function BidsTabPanel({
    quest,
    bids,
    setSelectedChatBid,
}: Props) {
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
            router.post(
                `/student/quests/${quest._id}/accept-bid/${acceptBidId}`,
                {},
                {
                    onSuccess: () => setAcceptBidId(null),
                },
            );
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
        <div className="relative space-y-5 overflow-hidden rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-gradient-to-b dark:from-[#0e0e1a] dark:to-[#090910]">
            <div className="pointer-events-none absolute top-0 right-8 left-8 z-0 h-px bg-gradient-to-r from-transparent via-slate-300 to-transparent select-none dark:via-slate-700" />
            <div className="relative z-10 flex items-center justify-between border-b border-slate-100 pb-3 dark:border-slate-800">
                <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200">
                    Proposal Pelamar yang Masuk
                </h3>
                <span className="rounded-md bg-indigo-50 px-2 py-0.5 text-xs font-semibold text-indigo-700 dark:bg-indigo-950/20 dark:text-indigo-400">
                    {bids.length} Proposal
                </span>
            </div>

            {bids.length === 0 ? (
                <div className="py-12 text-center text-slate-400 dark:text-slate-500">
                    <Briefcase className="mx-auto mb-2 h-9 w-9 text-slate-300 dark:text-slate-700" />
                    <p className="text-xs font-bold tracking-wider text-slate-500 uppercase">
                        Belum ada proposal masuk
                    </p>
                    <p className="text-[11px] text-slate-400">
                        Siswa belum ada yang mengajukan penawaran harga untuk
                        proyek ini.
                    </p>
                </div>
            ) : (
                <div className="grid max-h-[750px] grid-cols-1 gap-4 overflow-y-auto pr-1 sm:grid-cols-2">
                    {sortedBids.map((bid) => {
                        const isShortlisted = shortlistedBidIds.includes(
                            bid._id,
                        );
                        const isArchived = archivedBidIds.includes(bid._id);

                        return (
                            <div
                                key={bid._id}
                                className={`group relative flex flex-col justify-between gap-3.5 rounded-xl border p-4.5 transition-all duration-200 ${
                                    bid.status === 'accepted'
                                        ? 'border-emerald-500/50 bg-[#061512] shadow-md shadow-emerald-950/20 dark:border-emerald-500/60 dark:bg-[#061512]'
                                        : bid.status === 'rejected'
                                          ? 'border-slate-800 bg-[#04060d] opacity-75 dark:border-slate-800 dark:bg-[#04060d]'
                                          : isShortlisted
                                            ? 'border-blue-500 bg-[#040a1c] shadow-md ring-1 shadow-blue-950/30 ring-blue-500/40 dark:border-blue-500/80 dark:bg-[#040a1c]'
                                            : isArchived
                                              ? 'border-slate-800/80 bg-[#03050c] opacity-90 dark:border-slate-800/80 dark:bg-[#03050c]'
                                              : 'border-slate-200/80 bg-[#f8fafc] shadow-sm hover:border-indigo-400 dark:border-slate-800/80 dark:bg-[#040714] dark:hover:border-slate-700'
                                }`}
                            >
                                <div className="flex flex-1 flex-col justify-between space-y-3">
                                    <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                                        <div className="flex min-w-0 items-center gap-2.5">
                                            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-slate-100 text-xs font-bold text-slate-700 dark:bg-slate-800 dark:text-slate-200">
                                                {bid.student.name
                                                    .substring(0, 2)
                                                    .toUpperCase()}
                                            </div>
                                            <div className="min-w-0">
                                                <div className="flex items-center gap-1.5">
                                                    <span className="block truncate text-xs font-semibold text-slate-800 dark:text-white">
                                                        {bid.student.name}
                                                    </span>
                                                    {isArchived && (
                                                        <span className="rounded border border-slate-700 bg-slate-800 px-1.5 py-0.5 text-[9px] font-bold text-slate-400">
                                                            Diarsipkan
                                                        </span>
                                                    )}
                                                </div>
                                                <span className="block truncate text-[10px] text-slate-400">
                                                    {bid.student.email}
                                                </span>
                                            </div>
                                        </div>
                                        <div className="flex shrink-0 items-center gap-1.5 self-end sm:self-auto">
                                            <span className="mr-1 text-xs font-bold text-indigo-600 dark:text-indigo-400">
                                                {formatCurrency(bid.bid_amount)}
                                            </span>
                                            {bid.status === 'pending' && (
                                                <>
                                                    <button
                                                        type="button"
                                                        onClick={() => {
                                                            if (isShortlisted) {
                                                                setShortlistedBidIds(
                                                                    (prev) =>
                                                                        prev.filter(
                                                                            (
                                                                                id,
                                                                            ) =>
                                                                                id !==
                                                                                bid._id,
                                                                        ),
                                                                );
                                                            } else {
                                                                setShortlistedBidIds(
                                                                    (prev) => [
                                                                        ...prev,
                                                                        bid._id,
                                                                    ],
                                                                );
                                                                setArchivedBidIds(
                                                                    (prev) =>
                                                                        prev.filter(
                                                                            (
                                                                                id,
                                                                            ) =>
                                                                                id !==
                                                                                bid._id,
                                                                        ),
                                                                );
                                                            }
                                                        }}
                                                        className={`cursor-pointer rounded-lg border p-1.5 transition-all ${
                                                            isShortlisted
                                                                ? 'border-blue-500 bg-blue-500/20 text-blue-400 shadow-sm ring-2 ring-blue-500/20'
                                                                : 'dark:border-slate-750 border-slate-200/80 bg-slate-50 text-slate-400 hover:border-blue-500 hover:text-blue-500 dark:bg-[#0b1021] dark:hover:border-blue-500 dark:hover:text-blue-400'
                                                        }`}
                                                        title={
                                                            isShortlisted
                                                                ? 'Batal Favorit'
                                                                : 'Favoritkan (Tandai Biru)'
                                                        }
                                                    >
                                                        <Star
                                                            size={13}
                                                            className={
                                                                isShortlisted
                                                                    ? 'fill-blue-400 text-blue-400'
                                                                    : ''
                                                            }
                                                        />
                                                    </button>
                                                    <button
                                                        type="button"
                                                        onClick={() => {
                                                            if (isArchived) {
                                                                setArchivedBidIds(
                                                                    (prev) =>
                                                                        prev.filter(
                                                                            (
                                                                                id,
                                                                            ) =>
                                                                                id !==
                                                                                bid._id,
                                                                        ),
                                                                );
                                                            } else {
                                                                setArchivedBidIds(
                                                                    (prev) => [
                                                                        ...prev,
                                                                        bid._id,
                                                                    ],
                                                                );
                                                                setShortlistedBidIds(
                                                                    (prev) =>
                                                                        prev.filter(
                                                                            (
                                                                                id,
                                                                            ) =>
                                                                                id !==
                                                                                bid._id,
                                                                        ),
                                                                );
                                                            }
                                                        }}
                                                        className={`cursor-pointer rounded-lg border p-1.5 transition-all ${
                                                            isArchived
                                                                ? 'border-red-500/60 bg-red-500/20 text-red-400 shadow-sm ring-2 ring-red-500/20'
                                                                : 'dark:border-slate-750 border-slate-200/80 bg-slate-50 text-slate-400 hover:border-red-500 hover:text-red-500 dark:bg-[#0b1021] dark:hover:border-red-500 dark:hover:text-red-400'
                                                        }`}
                                                        title={
                                                            isArchived
                                                                ? 'Batal Arsipkan'
                                                                : 'Arsipkan'
                                                        }
                                                    >
                                                        <Archive size={13} />
                                                    </button>
                                                </>
                                            )}
                                        </div>
                                    </div>

                                    <div className="flex-1">
                                        <span className="block text-[9px] font-medium tracking-wider text-slate-400 uppercase">
                                            Proposal
                                        </span>
                                        <p className="mt-1 line-clamp-3 text-xs leading-relaxed text-slate-600 dark:text-slate-350">
                                            {bid.proposal}
                                        </p>
                                    </div>
                                </div>

                                {/* BOTTOM ATTACHMENT & ACTION BUTTONS PUSHED FLUSH TO BOTTOM */}
                                <div className="mt-auto space-y-3 border-t border-slate-100/80 pt-3 dark:border-slate-800/80">
                                    {(bid.cv || bid.portfolio) && (
                                        <div className="grid grid-cols-2 gap-2">
                                            {bid.cv && (
                                                <a
                                                    href={
                                                        bid.cv.startsWith('http')
                                                            ? bid.cv
                                                            : '#'
                                                    }
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="flex items-center justify-center gap-1.5 rounded-lg border border-indigo-200/80 bg-indigo-50/50 px-2.5 py-1.5 text-center text-[11px] font-bold text-indigo-600 transition-all hover:border-indigo-400 hover:bg-indigo-100 dark:border-indigo-800/60 dark:bg-indigo-950/40 dark:text-indigo-300 dark:hover:border-indigo-500 dark:hover:bg-indigo-900/60"
                                                >
                                                    <FileText
                                                        size={12}
                                                        className="text-indigo-500 dark:text-indigo-400"
                                                    />
                                                    Berkas CV
                                                </a>
                                            )}
                                            {bid.portfolio && (
                                                <a
                                                    href={
                                                        bid.portfolio.startsWith(
                                                            'http',
                                                        )
                                                            ? bid.portfolio
                                                            : '#'
                                                    }
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="flex items-center justify-center gap-1.5 rounded-lg border border-purple-200/80 bg-purple-50/50 px-2.5 py-1.5 text-center text-[11px] font-bold text-purple-600 transition-all hover:border-purple-400 hover:bg-purple-100 dark:border-purple-800/60 dark:bg-purple-950/40 dark:text-purple-300 dark:hover:border-purple-500 dark:hover:bg-purple-900/60"
                                                >
                                                    <ExternalLink
                                                        size={12}
                                                        className="text-purple-500 dark:text-purple-400"
                                                    />
                                                    Portofolio
                                                </a>
                                            )}
                                        </div>
                                    )}

                                    <div className="flex flex-col gap-2 min-[400px]:flex-row">
                                        {bid.status === 'pending' && (
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    handleAcceptBid(bid._id)
                                                }
                                                className="flex flex-1 cursor-pointer items-center justify-center gap-1.5 rounded-lg border border-emerald-400/30 bg-gradient-to-r from-emerald-600 to-teal-600 px-3 py-2 text-xs font-bold tracking-wider text-white uppercase shadow-md shadow-emerald-950/20 transition-all hover:from-emerald-500 hover:to-teal-500 active:scale-[0.98]"
                                            >
                                                Terima
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
                                                className={`flex cursor-pointer items-center justify-center gap-1.5 rounded-lg px-3 py-2 text-xs font-bold tracking-wider uppercase shadow-sm transition-all active:scale-[0.98] ${
                                                    bid.status === 'accepted'
                                                        ? 'flex-1 border border-emerald-400/30 bg-emerald-600 text-white hover:bg-emerald-500'
                                                        : 'w-full border border-indigo-500/40 bg-indigo-600 text-white hover:bg-indigo-500 min-[400px]:flex-1 dark:border-indigo-400/40 dark:bg-indigo-600 dark:hover:bg-indigo-500'
                                                }`}
                                            >
                                                Chat
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            <ConfirmModal
                open={!!acceptBidId}
                title="Terima Proposal Kontrak"
                message="Apakah Anda yakin ingin menerima proposal penawaran dari pelamar ini? Tindakan ini akan menutup pendaftaran dan memulai kontrak pengerjaan."
                confirmText="Terima"
                cancelText="Batal"
                variant="primary"
                onConfirm={handleConfirmAccept}
                onClose={() => setAcceptBidId(null)}
            />
        </div>
    );
}
