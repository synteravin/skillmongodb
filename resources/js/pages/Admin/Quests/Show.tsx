import { Link, router, usePage, useForm } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import {
    ArrowLeft,
    Calendar,
    DollarSign,
    Briefcase,
    FileText,
    User,
    Check,
    Trash2,
    Mail,
    Sparkles,
    UserCheck,
    FolderGit,
    FileSpreadsheet,
    MessageSquare,
    TrendingUp,
    Star,
    Paperclip,
    Download,
    Image as ImageIcon,
    FileArchive,
} from 'lucide-react';
import React, { useState } from 'react';
import QuestChatPanel from '@/components/Quest/QuestChatPanel';
import ConfirmModal from '@/components/ConfirmModal';

interface Quest {
    _id: string;
    title: string;
    description: string;
    min_salary: number;
    max_salary: number;
    deadline: string;
    status: string;
    creator_id: string;
    creator: {
        name: string;
    };
    worker?: {
        name: string;
        email: string;
    } | null;
    worker_id?: string | null;
    submission_link?: string | null;
    submission_note?: string | null;
    submitted_at?: string | null;
    completed_at?: string | null;
    revision_note?: string | null;
    rejection_note?: string | null;
    rating?: number | null;
    rating_comment?: string | null;
    images?: Array<{ name: string; url: string }>;
    files?: Array<{ name: string; url: string; size: number }>;
    submission_file?: { name: string; url: string; size: number } | null;
}

interface Bid {
    _id: string;
    bid_amount: number;
    cv: string;
    portfolio: string;
    proposal: string;
    status: string;
    created_at: string;
    student: {
        _id: string;
        name: string;
        email: string;
    };
    unread_messages_count: number;
}

interface Props {
    quest: Quest;
    bids: Bid[];
}

export default function Show({ quest, bids }: Props) {
    const [selectedChatBid, setSelectedChatBid] = useState<{ id: string; name: string } | null>(null);
    const [previewImage, setPreviewImage] = useState<{ url: string; name: string } | null>(null);
    const [acceptBidId, setAcceptBidId] = useState<string | null>(null);
    const [deleteBidId, setDeleteBidId] = useState<string | null>(null);
    const [showApproveForm, setShowApproveForm] = useState(false);
    const [showRejectForm, setShowRejectForm] = useState(false);
    const { props } = usePage<any>();
    const currentUserId = props.auth?.user?._id;

    const approveForm = useForm({
        rating: 5,
        rating_comment: '',
    });

    const rejectForm = useForm({
        revision_note: '',
    });

    const handleApproveWork = (e: React.FormEvent) => {
        e.preventDefault();
        approveForm.post(`/admin/quests/${quest._id}/approve`, {
            onSuccess: () => {
                setShowApproveForm(false);
                approveForm.reset();
            },
        });
    };

    const handleRejectWork = (e: React.FormEvent) => {
        e.preventDefault();
        rejectForm.post(`/admin/quests/${quest._id}/reject`, {
            onSuccess: () => {
                setShowRejectForm(false);
                rejectForm.reset();
            },
        });
    };

    const [showRejectPostForm, setShowRejectPostForm] = useState(false);
    const [showApprovePostConfirm, setShowApprovePostConfirm] = useState(false);

    const rejectPostForm = useForm({
        rejection_note: '',
    });

    const handleApprovePost = () => {
        router.post(`/admin/quests/${quest._id}/approve-post`, {}, {
            onSuccess: () => setShowApprovePostConfirm(false),
        });
    };

    const handleRejectPost = (e: React.FormEvent) => {
        e.preventDefault();
        rejectPostForm.post(`/admin/quests/${quest._id}/reject-post`, {
            onSuccess: () => {
                setShowRejectPostForm(false);
                rejectPostForm.reset();
            },
        });
    };

    const handleAcceptBid = (bidId: string) => {
        setAcceptBidId(bidId);
    };

    const handleDeleteBid = (bidId: string) => {
        setDeleteBidId(bidId);
    };

    const formatCurrency = (num: number) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
        }).format(num);
    };

    const formatBytes = (bytes: number) => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const dm = 2;
        const sizes = ['Bytes', 'KB', 'MB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
    };

    const formatDate = (dateStr: string) => {
        return new Date(dateStr).toLocaleDateString('id-ID', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });
    };

    // Calculate Average Bid
    const averageBid =
        bids.length > 0
            ? Math.round(
                  bids.reduce((sum, bid) => sum + bid.bid_amount, 0) /
                      bids.length,
              )
            : 0;

    // Admin can accept bid on any quest as long as it is open
    const canAccept = quest.status === 'open';

    return (
        <AppLayout>
            <div
                className="relative min-h-screen overflow-hidden bg-[#f8fafc] px-2 py-4 text-slate-800 transition-colors duration-200 sm:px-3 lg:px-5 dark:bg-[#030712] dark:text-white"
                style={{ fontFamily: "'Outfit', sans-serif" }}
            >
                {/* Subtle top-center ambient glow */}
                <div className="pointer-events-none absolute top-0 left-1/2 z-0 h-[450px] w-full max-w-7xl -translate-x-1/2 rounded-full bg-indigo-500/5 blur-[120px] select-none dark:bg-indigo-500/5" />

                <div className="relative z-10 mx-auto max-w-7xl space-y-6">
                    {/* BACK LINK */}
                    <div className="flex items-center justify-between">
                        <Link
                            href="/admin/quests"
                            className="inline-flex items-center gap-1.5 text-xs font-semibold tracking-wider text-slate-500 uppercase transition-colors hover:text-indigo-600 dark:text-slate-400 dark:hover:text-indigo-400"
                        >
                            <ArrowLeft size={14} />
                            Kembali ke Daftar Quest
                        </Link>

                        <div className="flex items-center gap-2">
                            <span
                                className={`shrink-0 rounded-full px-3 py-1 text-xs font-bold tracking-wider uppercase ${
                                    quest.status === 'open'
                                        ? 'bg-green-100 text-green-700 dark:bg-green-950/40 dark:text-green-400'
                                        : quest.status === 'draft'
                                        ? 'bg-amber-100 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400'
                                        : quest.status === 'rejected'
                                        ? 'bg-red-100 text-red-700 dark:bg-red-950/40 dark:text-red-400'
                                        : quest.status === 'ongoing'
                                        ? 'bg-blue-100 text-blue-700 dark:bg-blue-950/40 dark:text-blue-400'
                                        : quest.status === 'approved'
                                        ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-950/40 dark:text-indigo-400'
                                        : quest.status === 'submitted'
                                        ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-950/40 dark:text-yellow-400'
                                        : 'bg-slate-100 text-slate-600 dark:bg-slate-900/60 dark:text-slate-400'
                                }`}
                            >
                                Status:{' '}
                                {quest.status === 'open'
                                    ? 'Tersedia'
                                    : quest.status === 'draft'
                                    ? 'Draft / Menunggu Persetujuan'
                                    : quest.status === 'rejected'
                                    ? 'Ditolak'
                                    : quest.status === 'ongoing'
                                    ? 'Berjalan'
                                    : quest.status === 'approved'
                                    ? 'Disetujui'
                                    : quest.status === 'submitted'
                                    ? 'Ditinjau'
                                    : 'Selesai'}
                            </span>
                        </div>
                    </div>

                    {/* METRICS / STATS OVERVIEW */}
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                        <div className="flex items-center gap-4 rounded-xl border border-slate-200/80 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-[#0d1117]">
                            <div className="rounded-lg bg-indigo-500/10 p-3 text-indigo-600 dark:text-indigo-400">
                                <TrendingUp className="h-5 w-5" />
                            </div>
                            <div>
                                <span className="block text-xs font-medium text-slate-400">
                                    Total Penawaran
                                </span>
                                <span className="text-xl font-bold text-slate-900 dark:text-white">
                                    {bids.length} Bid
                                </span>
                            </div>
                        </div>

                        <div className="flex items-center gap-4 rounded-xl border border-slate-200/80 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-[#0d1117]">
                            <div className="rounded-lg bg-emerald-500/10 p-3 text-emerald-600 dark:text-emerald-400">
                                <DollarSign className="h-5 w-5" />
                            </div>
                            <div>
                                <span className="block text-xs font-medium text-slate-400">
                                    Rata-Rata Penawaran
                                </span>
                                <span className="text-xl font-bold text-slate-900 dark:text-white">
                                    {averageBid > 0
                                        ? formatCurrency(averageBid)
                                        : 'Rp 0'}
                                </span>
                            </div>
                        </div>

                        <div className="flex items-center gap-4 rounded-xl border border-slate-200/80 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-[#0d1117]">
                            <div className="rounded-lg bg-blue-500/10 p-3 text-blue-600 dark:text-blue-400">
                                <Briefcase className="h-5 w-5" />
                            </div>
                            <div>
                                <span className="block text-xs font-medium text-slate-400">
                                    Rentang Anggaran
                                </span>
                                <span className="block max-w-[200px] truncate text-sm font-extrabold text-slate-900 dark:text-white">
                                    {formatCurrency(quest.min_salary)} -{' '}
                                    {formatCurrency(quest.max_salary)}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* MAIN TWO-COLUMN LAYOUT */}
                    <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-12">
                        {/* LEFT COLUMN: BIDS LIST & MODERATION (lg:col-span-7) */}
                        <div className="space-y-6 lg:col-span-7">
                            <div className="rounded-xl border border-slate-200/80 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-[#0d1117]">
                                <div className="mb-6 flex items-center justify-between border-b border-slate-100 pb-4 dark:border-slate-800">
                                    <div>
                                        <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                                            Penawaran Masuk (Bids)
                                        </h3>
                                        <p className="mt-1 text-xs text-slate-400">
                                            Daftar siswa yang mengajukan diri
                                            untuk menyelesaikan pekerjaan
                                            freelance ini.
                                        </p>
                                    </div>
                                    <span className="rounded-md bg-indigo-500/10 px-2 py-0.5 text-xs font-semibold text-indigo-600 dark:text-indigo-400">
                                        {bids.length} Pelamar
                                    </span>
                                </div>

                                {bids.length === 0 ? (
                                    <div className="py-20 text-center text-slate-400">
                                        <Briefcase className="mx-auto mb-3 h-12 w-12 text-indigo-500 opacity-30" />
                                        <p className="text-base font-semibold">
                                            Belum Ada Penawaran
                                        </p>
                                        <p className="mt-1 text-xs text-slate-400/80">
                                            Siswa belum mengirimkan proposal
                                            penawaran untuk quest ini.
                                        </p>
                                    </div>
                                ) : (
                                    <div className="max-h-[700px] space-y-6 overflow-y-auto pr-2">
                                        {bids.map((bid) => (
                                            <div
                                                key={bid._id}
                                                className={`group rounded-xl border p-5 transition-all duration-300 ${
                                                    bid.status === 'accepted'
                                                        ? 'border-green-500/30 bg-green-500/5 shadow-sm dark:border-green-500/20'
                                                        : bid.status ===
                                                            'rejected'
                                                          ? 'border-slate-200/50 bg-slate-50 opacity-60 dark:border-slate-800/40 dark:bg-slate-900/20'
                                                          : 'border-slate-200/80 bg-white hover:border-indigo-500/40 hover:shadow-md dark:border-slate-800/80 dark:bg-[#121620]'
                                                }`}
                                            >
                                                <div className="flex flex-col gap-4">
                                                    {/* Bid Header */}
                                                    <div className="flex items-start justify-between gap-4">
                                                        <div className="flex items-center gap-3">
                                                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-tr from-indigo-500 to-purple-600 text-sm font-bold text-white shadow-sm">
                                                                {bid.student.name
                                                                    .substring(
                                                                        0,
                                                                        2,
                                                                    )
                                                                    .toUpperCase()}
                                                            </div>
                                                            <div>
                                                                <h4 className="flex items-center gap-2 text-sm font-bold text-slate-950 dark:text-white">
                                                                    {
                                                                        bid
                                                                            .student
                                                                            .name
                                                                    }
                                                                    {bid.status ===
                                                                        'accepted' && (
                                                                        <span className="inline-flex items-center gap-0.5 rounded bg-green-500/20 px-1.5 py-0.5 text-[9px] font-extrabold text-green-500 uppercase">
                                                                            Worker
                                                                        </span>
                                                                    )}
                                                                </h4>
                                                                <span className="mt-0.5 flex items-center gap-1.5 text-xs text-slate-400 dark:text-slate-500">
                                                                    <Mail
                                                                        size={
                                                                            12
                                                                        }
                                                                        className="text-slate-400"
                                                                    />
                                                                    {
                                                                        bid
                                                                            .student
                                                                            .email
                                                                    }
                                                                </span>
                                                            </div>
                                                        </div>

                                                        <div className="text-right">
                                                            <span className="block text-[10px] font-semibold tracking-wider text-slate-400 uppercase">
                                                                Harga Penawaran
                                                            </span>
                                                            <span className="text-base font-extrabold text-indigo-600 dark:text-indigo-400">
                                                                {formatCurrency(
                                                                    bid.bid_amount,
                                                                )}
                                                            </span>
                                                        </div>
                                                    </div>

                                                    {/* Bid Content */}
                                                    <div className="grid grid-cols-1 gap-3 rounded-xl border border-slate-200/60 bg-slate-50 p-4 dark:border-slate-800/60 dark:bg-slate-900/60">
                                                        <div className="space-y-1">
                                                            <span className="inline-flex items-center gap-1 text-[10px] font-bold tracking-wider text-slate-400 uppercase">
                                                                <MessageSquare
                                                                    size={10}
                                                                    className="text-indigo-500"
                                                                />
                                                                Proposal
                                                                Pekerjaan
                                                            </span>
                                                            <p className="text-xs leading-relaxed whitespace-pre-line text-slate-600 dark:text-slate-300">
                                                                {bid.proposal}
                                                            </p>
                                                        </div>

                                                        <div className="grid grid-cols-1 gap-3 border-t border-slate-200/40 pt-3 sm:grid-cols-2 dark:border-slate-800/40">
                                                            <div className="min-w-0 space-y-1">
                                                                <span className="inline-flex items-center gap-1 text-[10px] font-bold tracking-wider text-slate-400 uppercase">
                                                                    <FileSpreadsheet
                                                                        size={
                                                                            10
                                                                        }
                                                                        className="text-indigo-500"
                                                                    />
                                                                    Tautan CV
                                                                </span>
                                                                <a
                                                                    href={
                                                                        bid.cv.startsWith(
                                                                            'http',
                                                                        )
                                                                            ? bid.cv
                                                                            : '#'
                                                                    }
                                                                    target="_blank"
                                                                    rel="noopener noreferrer"
                                                                    className="block truncate text-xs font-semibold text-indigo-600 hover:text-indigo-700 hover:underline dark:text-indigo-400 dark:hover:text-indigo-300"
                                                                >
                                                                    {bid.cv}
                                                                </a>
                                                            </div>

                                                            <div className="min-w-0 space-y-1">
                                                                <span className="inline-flex items-center gap-1 text-[10px] font-bold tracking-wider text-slate-400 uppercase">
                                                                    <FolderGit
                                                                        size={
                                                                            10
                                                                        }
                                                                        className="text-indigo-500"
                                                                    />
                                                                    Portofolio
                                                                </span>
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
                                                                    className="block truncate text-xs font-semibold text-indigo-600 hover:text-indigo-700 hover:underline dark:text-indigo-400 dark:hover:text-indigo-300"
                                                                >
                                                                    {
                                                                        bid.portfolio
                                                                    }
                                                                </a>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    {/* Actions Row */}
                                                    <div className="flex items-center justify-between gap-3 pt-2">
                                                        <span className="text-[10px] text-slate-400">
                                                            Dikirim pada:{' '}
                                                            {formatDate(
                                                                bid.created_at,
                                                            )}
                                                        </span>

                                                        <div className="flex gap-2">
                                                            {canAccept &&
                                                                bid.status ===
                                                                    'pending' && (
                                                                    <button
                                                                        onClick={() =>
                                                                            handleAcceptBid(
                                                                                bid._id,
                                                                            )
                                                                        }
                                                                        className="inline-flex cursor-pointer items-center justify-center gap-1.5 rounded-lg bg-emerald-600 px-4 py-1.5 text-xs font-semibold text-white shadow-sm transition-colors hover:bg-emerald-700"
                                                                    >
                                                                        <UserCheck
                                                                            size={
                                                                                14
                                                                            }
                                                                        />
                                                                        Terima
                                                                    </button>
                                                                )}
                                                            <button
                                                                onClick={() =>
                                                                    setSelectedChatBid({
                                                                        id: bid._id,
                                                                        name: bid.student.name,
                                                                    })
                                                                }
                                                                className="relative inline-flex cursor-pointer items-center justify-center gap-1.5 rounded-lg bg-indigo-600 px-3 py-1.5 text-xs font-semibold text-white shadow-sm transition-colors hover:bg-indigo-700"
                                                                title="Hubungi Pelamar"
                                                            >
                                                                <MessageSquare size={14} />
                                                                Chat
                                                                {bid.unread_messages_count > 0 && (
                                                                    <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[8px] font-black text-white ring-2 ring-white dark:ring-slate-900 animate-pulse">
                                                                        {bid.unread_messages_count}
                                                                    </span>
                                                                )}
                                                            </button>
                                                            <button
                                                                onClick={() =>
                                                                    handleDeleteBid(
                                                                        bid._id,
                                                                    )
                                                                }
                                                                className="inline-flex cursor-pointer items-center justify-center rounded-lg border border-red-200 p-1.5 text-red-500 transition-colors hover:bg-red-500 hover:text-white dark:border-red-950"
                                                                title="Hapus Penawaran (Moderasi)"
                                                            >
                                                                <Trash2
                                                                    size={14}
                                                                />
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* RIGHT COLUMN: QUEST DETAILS (lg:col-span-5) */}
                        <div className="space-y-6 lg:sticky lg:top-8 lg:col-span-5">
                            {quest.status === 'draft' && (
                                <div className="space-y-4 rounded-xl border border-amber-500/20 bg-amber-500/5 p-6 shadow-sm dark:bg-amber-950/10">
                                    <div className="border-b border-amber-500/10 pb-3">
                                        <span className="inline-block text-[0.6rem] font-bold tracking-[0.2em] text-amber-600 uppercase dark:text-amber-400">
                                            Moderasi Posting Quest
                                        </span>
                                        <h3 className="text-base font-bold text-slate-800 dark:text-amber-300">
                                            Persetujuan Quest Baru
                                        </h3>
                                    </div>
                                    <p className="text-xs leading-relaxed text-slate-500 dark:text-slate-400">
                                        Quest ini dikirim oleh <strong>{quest.creator.name}</strong> dan membutuhkan persetujuan Anda sebelum dipublikasikan ke papan quest publik.
                                    </p>

                                    <div className="flex flex-col gap-2 pt-2">
                                        <button
                                            onClick={() => setShowApprovePostConfirm(true)}
                                            className="w-full py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all cursor-pointer shadow-sm text-center"
                                        >
                                            Setujui & Publikasikan
                                        </button>
                                        <button
                                            onClick={() => setShowRejectPostForm(true)}
                                            className="w-full py-2 bg-red-600 hover:bg-red-750 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all cursor-pointer shadow-sm text-center"
                                        >
                                            Tolak Quest
                                        </button>
                                    </div>
                                </div>
                            )}

                            {quest.status === 'rejected' && (
                                <div className="space-y-3 rounded-xl border border-red-500/20 bg-red-500/5 p-6 shadow-sm dark:bg-red-950/10">
                                    <span className="inline-block text-[0.6rem] font-bold tracking-[0.2em] text-red-600 uppercase dark:text-red-400">
                                        Quest Ditolak
                                    </span>
                                    <h3 className="text-base font-bold text-red-600 dark:text-red-400">
                                        Status: Ditolak
                                    </h3>
                                    {quest.rejection_note && (
                                        <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl space-y-1">
                                            <span className="block text-[9px] font-bold uppercase tracking-wider text-red-500">Catatan Penolakan Anda:</span>
                                            <p className="text-xs text-slate-650 dark:text-slate-300 leading-relaxed whitespace-pre-wrap">{quest.rejection_note}</p>
                                        </div>
                                    )}
                                </div>
                            )}

                            <div className="space-y-6 rounded-xl border border-slate-200/80 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-[#0d1117]">
                                <div className="border-b border-slate-100 pb-4 dark:border-slate-800">
                                    <span className="mb-1 inline-block text-[0.6rem] font-bold tracking-[0.2em] text-indigo-500 uppercase dark:text-indigo-400">
                                        Quest Specification
                                    </span>
                                    <h2 className="text-xl leading-snug font-bold text-slate-900 dark:text-white">
                                        {quest.title}
                                    </h2>
                                </div>

                                <div className="space-y-2">
                                    <h3 className="text-xs font-bold tracking-wider text-slate-400 uppercase">
                                        Deskripsi Pekerjaan
                                    </h3>
                                    <div className="rounded-xl border border-slate-200/50 bg-slate-50 p-4 text-sm leading-relaxed whitespace-pre-line text-slate-600 dark:border-slate-800 dark:bg-slate-900/50 dark:text-slate-300">
                                        {quest.description}
                                    </div>
                                </div>

                                {/* Lampiran Quest (Gambar & File) */}
                                {((quest.images && quest.images.length > 0) || (quest.files && quest.files.length > 0)) && (
                                    <div className="space-y-4 border-t border-slate-100 dark:border-slate-800 pt-4">
                                        <h3 className="text-xs font-bold tracking-wider text-slate-400 uppercase">
                                            Lampiran Pekerjaan
                                        </h3>

                                        {/* Images Gallery */}
                                        {quest.images && quest.images.length > 0 && (
                                            <div className="space-y-2">
                                                <span className="block text-[10px] text-slate-400 uppercase tracking-wider font-semibold font-['Oxanium']">
                                                    Gambar Pendukung
                                                </span>
                                                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                                                    {quest.images.map((img, index) => (
                                                        <div key={index} className="relative group rounded-xl overflow-hidden border border-slate-200/40 dark:border-slate-800 bg-slate-50 dark:bg-black/20 p-1">
                                                            <img
                                                                src={img.url}
                                                                alt={img.name}
                                                                onClick={() => setPreviewImage(img)}
                                                                className="w-full h-20 object-cover rounded-lg cursor-pointer transition-transform hover:scale-[1.02]"
                                                            />
                                                            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1.5 pointer-events-none group-hover:pointer-events-auto">
                                                                <button
                                                                    onClick={() => setPreviewImage(img)}
                                                                    className="p-1 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors cursor-pointer"
                                                                    title="Detail Gambar"
                                                                >
                                                                    <ImageIcon className="w-3.5 h-3.5" />
                                                                </button>
                                                                <a
                                                                    href={img.url}
                                                                    target="_blank"
                                                                    rel="noopener noreferrer"
                                                                    className="p-1 bg-indigo-500 hover:bg-indigo-600 text-white rounded-lg transition-colors cursor-pointer"
                                                                    title="Unduh di Tab Baru"
                                                                >
                                                                    <Download className="w-3.5 h-3.5" />
                                                                </a>
                                                            </div>
                                                            <span className="block text-[8px] text-slate-500 dark:text-slate-400 truncate text-center mt-1 px-1 font-['Oxanium']">
                                                                {img.name}
                                                            </span>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        )}

                                        {/* Files List */}
                                        {quest.files && quest.files.length > 0 && (
                                            <div className="space-y-2">
                                                <span className="block text-[10px] text-slate-400 uppercase tracking-wider font-semibold font-['Oxanium']">
                                                    Dokumen Pendukung
                                                </span>
                                                <div className="space-y-2">
                                                    {quest.files.map((file, index) => {
                                                        const ext = file.name.split(".").pop()?.toLowerCase();
                                                        const isZip = ext === "zip";
                                                        const formatBytes = (bytes: number) => {
                                                            if (bytes === 0) return "0 Bytes";
                                                            const k = 1024;
                                                            const dm = 2;
                                                            const sizes = ["Bytes", "KB", "MB"];
                                                            const i = Math.floor(Math.log(bytes) / Math.log(k));
                                                            return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
                                                        };
                                                        return (
                                                            <div key={index} className="flex items-center justify-between p-2 rounded-xl border border-slate-200/40 dark:border-slate-800 bg-slate-50 dark:bg-black/20">
                                                                <div className="flex items-center gap-2 min-w-0">
                                                                    {isZip ? (
                                                                        <FileArchive className="w-4 h-4 text-amber-500 shrink-0" />
                                                                    ) : (
                                                                        <FileText className="w-4 h-4 text-indigo-500 shrink-0" />
                                                                    )}
                                                                    <div className="min-w-0 font-['Oxanium']">
                                                                        <p className="text-[11px] font-semibold text-slate-700 dark:text-slate-200 truncate">
                                                                            {file.name}
                                                                        </p>
                                                                        <p className="text-[9px] text-slate-400">
                                                                            {formatBytes(file.size)}
                                                                        </p>
                                                                    </div>
                                                                </div>
                                                                <a
                                                                    href={file.url}
                                                                    target="_blank"
                                                                    rel="noopener noreferrer"
                                                                    className="flex items-center justify-center p-1 text-indigo-500 hover:text-indigo-600 hover:bg-indigo-500/10 rounded-lg transition-colors cursor-pointer"
                                                                    title="Unduh berkas di Tab Baru"
                                                                >
                                                                    <Download className="w-4 h-4" />
                                                                </a>
                                                            </div>
                                                        );
                                                    })}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                )}

                                 {/* Hadiah Quest */}
                                 <div className="space-y-3 border-t border-slate-100 pt-4 dark:border-slate-800 font-['Oxanium']">
                                     <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                                         Hadiah Penyelesaian
                                     </span>
                                     <div className="grid grid-cols-3 gap-2 text-center text-[11px] font-bold">
                                         <div className="py-2 rounded-lg bg-purple-500/10 border border-purple-500/20 text-purple-600 dark:text-purple-300 flex flex-col items-center">
                                             <span className="text-[8px] text-slate-400 font-semibold">EXP</span>
                                             <span className="font-['Orbitron']">+250</span>
                                         </div>
                                         <div className="py-2 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-600 dark:text-amber-400 flex flex-col items-center">
                                             <span className="text-[8px] text-slate-400 font-semibold">GOLD</span>
                                             <span className="font-['Orbitron']">+150</span>
                                         </div>
                                         <div className="py-2 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-indigo-600 dark:text-indigo-300 flex flex-col items-center">
                                             <span className="text-[8px] text-slate-400 font-semibold">ERP</span>
                                             <span className="font-['Orbitron']">+100</span>
                                         </div>
                                     </div>
                                 </div>

                                {/* Quick Details Grid */}
                                <div className="space-y-4 border-t border-slate-100 pt-4 dark:border-slate-800">
                                    <div className="flex items-center gap-3">
                                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-slate-100 text-slate-500 dark:bg-slate-800">
                                            <DollarSign className="h-4 w-4 text-indigo-500" />
                                        </div>
                                        <div>
                                            <span className="block text-[10px] font-semibold text-slate-400 uppercase">
                                                Rentang Anggaran
                                            </span>
                                            <span className="text-sm font-bold text-slate-800 dark:text-white">
                                                {formatCurrency(
                                                    quest.min_salary,
                                                )}{' '}
                                                -{' '}
                                                {formatCurrency(
                                                    quest.max_salary,
                                                )}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-3">
                                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-slate-100 text-slate-500 dark:bg-slate-800">
                                            <Calendar className="h-4 w-4 text-indigo-500" />
                                        </div>
                                        <div>
                                            <span className="block text-[10px] font-semibold text-slate-400 uppercase">
                                                Tenggat Waktu
                                            </span>
                                            <span className="text-sm font-bold text-slate-800 dark:text-white">
                                                {formatDate(quest.deadline)}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-3">
                                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-slate-100 text-slate-500 dark:bg-slate-800">
                                            <User className="h-4 w-4 text-indigo-500" />
                                        </div>
                                        <div>
                                            <span className="block text-[10px] font-semibold text-slate-400 uppercase">
                                                Diposting Oleh
                                            </span>
                                            <span className="text-sm font-bold text-slate-800 dark:text-white">
                                                {quest.creator.name}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                {/* Active Worker Info */}
                                {quest.worker && (
                                    <div className="space-y-4">
                                        <div className="flex items-start justify-between gap-3 rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-4">
                                            <div className="flex items-start gap-3">
                                                <Check className="mt-0.5 h-5 w-5 shrink-0 text-emerald-500" />
                                                <div>
                                                    <span className="block text-[10px] font-semibold tracking-wider text-emerald-600 uppercase dark:text-emerald-400">
                                                        Pekerja Terpilih
                                                    </span>
                                                    <span className="mt-0.5 block font-bold text-slate-900 dark:text-white">
                                                        {quest.worker.name}
                                                    </span>
                                                    <span className="block text-xs text-slate-400">
                                                        ({quest.worker.email})
                                                    </span>
                                                </div>
                                            </div>
                                            {(() => {
                                                const acceptedBid = bids.find(b => b.status === "accepted" || b.student._id === quest.worker_id);
                                                if (acceptedBid) {
                                                    return (
                                                        <button
                                                            onClick={() => setSelectedChatBid({ id: acceptedBid._id, name: quest.worker?.name ?? "" })}
                                                            className="px-2.5 py-1 rounded-lg text-[10px] font-bold font-['Orbitron'] uppercase tracking-wider text-white bg-indigo-600 hover:bg-indigo-700 transition-colors cursor-pointer flex items-center gap-1 relative shrink-0"
                                                        >
                                                            <MessageSquare size={10} />
                                                            Chat
                                                            {acceptedBid.unread_messages_count > 0 && (
                                                                <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-red-500 text-[8px] font-black text-white ring-2 ring-white dark:ring-slate-900 animate-pulse">
                                                                    {acceptedBid.unread_messages_count}
                                                                </span>
                                                            )}
                                                        </button>
                                                    );
                                                }
                                                return null;
                                            })()}
                                        </div>

                                        {quest.status === 'ongoing' && (
                                            <div className="space-y-3">
                                                {quest.revision_note && (
                                                    <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 space-y-1">
                                                        <span className="block text-[10px] font-bold text-red-500 uppercase tracking-wider">⚠️ Menunggu Revisi Pekerja</span>
                                                        <p className="text-xs text-slate-600 dark:text-slate-300 italic">"{quest.revision_note}"</p>
                                                    </div>
                                                )}
                                                <div className="p-3 rounded-xl bg-blue-500/10 border border-blue-500/20 text-center text-xs text-blue-600 dark:text-blue-400 font-bold tracking-wider">
                                                    DALAM PROSES PENGERJAAN
                                                </div>
                                            </div>
                                        )}

                                        {quest.status === 'approved' && (
                                            <div className="space-y-3">
                                                <div className="p-4 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-center flex flex-col gap-1.5 font-['Oxanium']">
                                                    <span className="block text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                                                        Disetujui & Menunggu Berkas Final
                                                    </span>
                                                    <p className="text-[11px] text-slate-400">
                                                        Pekerjaan ini telah disetujui. Menunggu pekerja mengunggah berkas ZIP final untuk menyelesaikan quest secara resmi.
                                                    </p>
                                                </div>
                                            </div>
                                        )}

                                        {quest.status === 'submitted' && (
                                            <div className="space-y-4 rounded-xl border border-slate-200/80 dark:border-slate-800 bg-slate-50/50 dark:bg-black/20 p-4">
                                                <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-center flex flex-col gap-1.5">
                                                    <span className="block text-xs font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400">
                                                        Pekerjaan Siap Ditinjau
                                                    </span>
                                                    <p className="text-[11px] text-slate-400">
                                                        Pekerja telah mengirimkan hasil pekerjaannya. Silakan tinjau tautan di bawah ini.
                                                    </p>
                                                </div>
                                                <div className="space-y-3 text-xs">
                                                     {quest.submission_file && (
                                                         <div className="space-y-1">
                                                             <strong className="block text-slate-400 uppercase tracking-wider text-[10px]">Berkas Pekerjaan Utama (ZIP)</strong>
                                                             <div className="flex items-center justify-between p-2.5 rounded-xl border border-amber-200/40 dark:border-amber-500/20 bg-amber-500/5 dark:bg-amber-950/10">
                                                                 <div className="flex items-center gap-2.5 min-w-0">
                                                                     <FileArchive className="w-5 h-5 text-amber-500 shrink-0" />
                                                                     <div className="min-w-0 font-['Oxanium']">
                                                                         <p className="text-xs font-semibold text-slate-750 dark:text-slate-200 truncate">
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
                                                                     className="flex items-center justify-center p-1.5 text-amber-600 hover:text-amber-700 hover:bg-amber-500/10 rounded-lg transition-colors cursor-pointer"
                                                                     title="Unduh ZIP di Tab Baru"
                                                                 >
                                                                     <Download className="w-4.5 h-4.5" />
                                                                 </a>
                                                             </div>
                                                         </div>
                                                     )}

                                                     {quest.submission_link && (
                                                         <div>
                                                             <strong className="block text-slate-400 uppercase tracking-wider text-[10px] mb-1">Link Hasil Pekerjaan</strong>
                                                             <a href={quest.submission_link} target="_blank" rel="noopener noreferrer" className="text-indigo-500 hover:underline break-all font-semibold">
                                                                 {quest.submission_link}
                                                             </a>
                                                         </div>
                                                     )}

                                                     {quest.submission_note && (
                                                         <div>
                                                             <strong className="block text-slate-400 uppercase tracking-wider text-[10px] mb-1">Catatan Pekerja</strong>
                                                             <p className="text-slate-700 dark:text-slate-300 bg-white/40 dark:bg-black/10 p-2.5 rounded-lg border border-slate-100 dark:border-slate-800/40 whitespace-pre-wrap">
                                                                 {quest.submission_note}
                                                             </p>
                                                         </div>
                                                     )}
                                                 </div>

                                                {!showApproveForm && !showRejectForm && (
                                                    <div className="flex gap-2 border-t border-slate-100 dark:border-slate-800 pt-3">
                                                        <button
                                                            onClick={() => setShowApproveForm(true)}
                                                            className="flex-1 py-2 rounded-lg text-xs font-bold uppercase tracking-wider text-white bg-green-600 hover:bg-green-700 shadow-sm transition-colors cursor-pointer"
                                                        >
                                                            Setujui & Selesai
                                                        </button>
                                                        <button
                                                            onClick={() => setShowRejectForm(true)}
                                                            className="flex-1 py-2 rounded-lg text-xs font-bold uppercase tracking-wider text-white bg-red-600 hover:bg-red-700 shadow-sm transition-colors cursor-pointer"
                                                        >
                                                            Tolak / Revisi
                                                        </button>
                                                    </div>
                                                )}

                                                {showApproveForm && (
                                                    <form onSubmit={handleApproveWork} className="space-y-4 border-t border-slate-100 dark:border-slate-800 pt-4">
                                                        <h4 className="text-xs font-bold uppercase text-slate-700 dark:text-slate-300">
                                                            Berikan Penilaian & Ulasan
                                                        </h4>
                                                        <div className="space-y-1">
                                                            <label className="text-[10px] font-bold uppercase text-slate-400 tracking-wider">
                                                                Rating Pekerja
                                                            </label>
                                                            <div className="flex gap-1.5 justify-center py-1">
                                                                {[1, 2, 3, 4, 5].map((val) => (
                                                                    <button
                                                                        key={val}
                                                                        type="button"
                                                                        onClick={() => approveForm.setData('rating', val)}
                                                                        className="focus:outline-none transition-transform active:scale-95"
                                                                    >
                                                                        <Star
                                                                            className={`w-7 h-7 cursor-pointer ${
                                                                                val <= approveForm.data.rating
                                                                                    ? 'text-amber-400 fill-amber-400'
                                                                                    : 'text-slate-300 dark:text-slate-600'
                                                                            }`}
                                                                        />
                                                                    </button>
                                                                ))}
                                                            </div>
                                                            {approveForm.errors.rating && (
                                                                <p className="text-xs text-red-500 font-semibold">{approveForm.errors.rating}</p>
                                                            )}
                                                        </div>

                                                        <div className="space-y-1">
                                                            <label className="text-[10px] font-bold uppercase text-slate-400 tracking-wider">
                                                                Ulasan / Testimoni Pekerjaan
                                                            </label>
                                                            <textarea
                                                                placeholder="Tuliskan ulasan/testimoni tentang kinerja pekerja..."
                                                                rows={3}
                                                                value={approveForm.data.rating_comment}
                                                                onChange={(e) => approveForm.setData('rating_comment', e.target.value)}
                                                                className="w-full px-3 py-2 bg-slate-100/50 dark:bg-black/30 border border-slate-200 dark:border-slate-800 rounded-xl text-xs focus:outline-none focus:border-indigo-500 text-slate-800 dark:text-white"
                                                            />
                                                            {approveForm.errors.rating_comment && (
                                                                <p className="text-xs text-red-500 font-semibold">{approveForm.errors.rating_comment}</p>
                                                            )}
                                                        </div>

                                                        <div className="flex gap-2">
                                                            <button
                                                                type="submit"
                                                                disabled={approveForm.processing}
                                                                className="flex-1 py-2 rounded-lg text-xs font-bold uppercase tracking-wider text-white bg-green-600 hover:bg-green-700 disabled:opacity-50 transition-colors cursor-pointer"
                                                            >
                                                                {approveForm.processing ? 'Menyelesaikan...' : 'Selesaikan Quest'}
                                                            </button>
                                                            <button
                                                                type="button"
                                                                onClick={() => {
                                                                    setShowApproveForm(false);
                                                                    approveForm.reset();
                                                                }}
                                                                className="px-3 py-2 rounded-lg text-xs font-bold uppercase tracking-wider text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-white transition-colors"
                                                            >
                                                                Batal
                                                            </button>
                                                        </div>
                                                    </form>
                                                )}

                                                {showRejectForm && (
                                                    <form onSubmit={handleRejectWork} className="space-y-4 border-t border-slate-100 dark:border-slate-800 pt-4">
                                                        <h4 className="text-xs font-bold uppercase text-slate-700 dark:text-slate-300">
                                                            Feedback Revisi
                                                        </h4>
                                                        <div className="space-y-1">
                                                            <label className="text-[10px] font-bold uppercase text-slate-400 tracking-wider">
                                                                Detail Revisi yang Diminta
                                                            </label>
                                                            <textarea
                                                                required
                                                                placeholder="Tuliskan ulasan bagian mana saja yang perlu diperbaiki oleh pekerja..."
                                                                rows={4}
                                                                value={rejectForm.data.revision_note}
                                                                onChange={(e) => rejectForm.setData('revision_note', e.target.value)}
                                                                className="w-full px-3 py-2 bg-slate-100/50 dark:bg-black/30 border border-slate-200 dark:border-slate-800 rounded-xl text-xs focus:outline-none focus:border-indigo-500 text-slate-800 dark:text-white"
                                                            />
                                                            {rejectForm.errors.revision_note && (
                                                                <p className="text-xs text-red-500 font-semibold">{rejectForm.errors.revision_note}</p>
                                                            )}
                                                        </div>

                                                        <div className="flex gap-2">
                                                            <button
                                                                type="submit"
                                                                disabled={rejectForm.processing}
                                                                className="flex-1 py-2 rounded-lg text-xs font-bold uppercase tracking-wider text-white bg-red-600 hover:bg-red-700 disabled:opacity-50 transition-colors cursor-pointer"
                                                            >
                                                                {rejectForm.processing ? 'Mengirim...' : 'Kirim Permintaan Revisi'}
                                                            </button>
                                                            <button
                                                                type="button"
                                                                onClick={() => {
                                                                    setShowRejectForm(false);
                                                                    rejectForm.reset();
                                                                }}
                                                                className="px-3 py-2 rounded-lg text-xs font-bold uppercase tracking-wider text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-white transition-colors"
                                                            >
                                                                Batal
                                                            </button>
                                                        </div>
                                                    </form>
                                                )}
                                            </div>
                                        )}

                                        {quest.status === 'completed' && (
                                            <div className="space-y-4 rounded-xl border border-slate-200/80 dark:border-slate-800 bg-slate-50/50 dark:bg-black/20 p-4">
                                                <div className="p-3 rounded-xl bg-green-500/10 border border-green-500/20 text-center flex flex-col gap-1">
                                                    <Check className="w-8 h-8 text-green-500 mx-auto" />
                                                    <span className="block text-xs font-bold uppercase tracking-wider text-green-600 dark:text-green-400">
                                                        Quest Selesai
                                                    </span>
                                                    <p className="text-xs text-slate-500 dark:text-blue-300/60 leading-relaxed">
                                                        Pekerjaan telah disetujui dan diselesaikan secara resmi.
                                                    </p>
                                                </div>

                                                {quest.rating && (
                                                    <div className="p-3 rounded-xl bg-white/40 dark:bg-black/20 border border-slate-200/50 dark:border-slate-800/40 space-y-2 text-center">
                                                        <span className="block text-[10px] text-slate-400 uppercase tracking-wider font-semibold">Penilaian Penilai</span>
                                                        <div className="flex justify-center gap-1">
                                                            {[1, 2, 3, 4, 5].map((star) => (
                                                                <Star
                                                                    key={star}
                                                                    className={`w-5 h-5 ${
                                                                        star <= (quest.rating ?? 0)
                                                                            ? 'text-amber-400 fill-amber-400'
                                                                            : 'text-slate-300 dark:text-slate-600'
                                                                    }`}
                                                                />
                                                            ))}
                                                        </div>
                                                        {quest.rating_comment && (
                                                            <p className="text-xs italic text-slate-600 dark:text-slate-300 whitespace-pre-wrap bg-white/40 dark:bg-black/10 p-2.5 rounded-lg border border-slate-100 dark:border-slate-800/40">
                                                                "{quest.rating_comment}"
                                                            </p>
                                                        )}
                                                    </div>
                                                )}

                                                <div className="space-y-3 text-xs">
                                                    {quest.submission_file && (
                                                        <div className="space-y-1">
                                                            <strong className="block text-slate-400 uppercase tracking-wider text-[10px]">Berkas Pekerjaan Utama (ZIP)</strong>
                                                            <div className="flex items-center justify-between p-2.5 rounded-xl border border-amber-200/40 dark:border-amber-500/20 bg-amber-500/5 dark:bg-amber-950/10">
                                                                <div className="flex items-center gap-2.5 min-w-0">
                                                                    <FileArchive className="w-5 h-5 text-amber-500 shrink-0" />
                                                                    <div className="min-w-0 font-['Oxanium']">
                                                                        <p className="text-xs font-semibold text-slate-755 dark:text-slate-200 truncate">
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
                                                                    className="flex items-center justify-center p-1.5 text-amber-600 hover:text-amber-700 hover:bg-amber-500/10 rounded-lg transition-colors cursor-pointer"
                                                                    title="Unduh ZIP di Tab Baru"
                                                                >
                                                                    <Download className="w-4.5 h-4.5" />
                                                                </a>
                                                            </div>
                                                        </div>
                                                    )}

                                                    {quest.submission_link && (
                                                        <div>
                                                            <strong className="block text-slate-400 uppercase tracking-wider text-[10px] mb-1">Tautan Pekerjaan</strong>
                                                            <a href={quest.submission_link} target="_blank" rel="noopener noreferrer" className="text-indigo-500 hover:underline break-all font-semibold">
                                                                {quest.submission_link}
                                                            </a>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {/* Image Preview Modal */}
            {previewImage && (
                <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
                    {/* Backdrop */}
                    <div
                        onClick={() => setPreviewImage(null)}
                        className="absolute inset-0 bg-black/80 backdrop-blur-md transition-all cursor-pointer"
                    />
                    
                    {/* Modal Content */}
                    <div className="relative max-w-4xl w-full max-h-[85vh] bg-slate-900/90 dark:bg-slate-950/95 border border-white/10 rounded-2xl p-4 flex flex-col items-center shadow-2xl z-10 overflow-hidden font-['Oxanium']">
                        {/* Header */}
                        <div className="w-full flex justify-between items-center pb-2 mb-3 border-b border-white/10">
                            <span className="text-sm font-bold text-white truncate max-w-xs sm:max-w-md">
                                {previewImage.name}
                            </span>
                            <button
                                onClick={() => setPreviewImage(null)}
                                className="w-7 h-7 flex items-center justify-center rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
                            >
                                ✕
                            </button>
                        </div>
                        
                        {/* Image body */}
                        <div className="w-full flex-1 flex items-center justify-center min-h-0">
                            <img
                                src={previewImage.url}
                                alt={previewImage.name}
                                className="max-w-full max-h-[70vh] object-contain rounded-lg shadow-md"
                            />
                        </div>
                    </div>
                </div>
            )}

            {selectedChatBid && (
                <QuestChatPanel
                    bidId={selectedChatBid.id}
                    questTitle={quest.title}
                    targetUserName={selectedChatBid.name}
                    onClose={() => {
                        setSelectedChatBid(null);
                        router.reload({ only: ['bids'] });
                    }}
                />
            )}

            {/* Confirm Modal Pilih Pekerja */}
            <ConfirmModal
                open={!!acceptBidId}
                title="Pilih Pekerja"
                message="Apakah Anda yakin ingin memilih pekerja ini? Tindakan ini akan menutup bidding quest."
                confirmText="Pilih Pekerja"
                cancelText="Batal"
                variant="primary"
                onConfirm={() => {
                    if (acceptBidId) {
                        router.post(`/admin/quests/${quest._id}/accept-bid/${acceptBidId}`);
                    }
                }}
                onClose={() => setAcceptBidId(null)}
            />

            {/* Confirm Modal Hapus Bid */}
            <ConfirmModal
                open={!!deleteBidId}
                title="Hapus Penawaran"
                message="Apakah Anda yakin ingin menghapus/memoderasi penawaran ini?"
                confirmText="Hapus"
                cancelText="Batal"
                variant="danger"
                onConfirm={() => {
                    if (deleteBidId) {
                        router.delete(`/admin/quests/${quest._id}/bids/${deleteBidId}`);
                    }
                }}
                onClose={() => setDeleteBidId(null)}
            />

            {/* Confirm Modal Approve Post */}
            <ConfirmModal
                open={showApprovePostConfirm}
                title="Setujui Quest"
                message="Apakah Anda yakin ingin menyetujui dan mempublikasikan quest ini ke papan quest publik?"
                confirmText="Setujui"
                cancelText="Batal"
                variant="primary"
                onConfirm={handleApprovePost}
                onClose={() => setShowApprovePostConfirm(false)}
            />

            {/* Reject Post Modal */}
            {showRejectPostForm && (
                <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
                    <div
                        onClick={() => setShowRejectPostForm(false)}
                        className="absolute inset-0 bg-black/60 backdrop-blur-sm cursor-pointer"
                    />
                    <div className="relative max-w-md w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-2xl z-10 font-['Oxanium']">
                        <h3 className="text-base sm:text-lg font-bold uppercase font-['Orbitron'] text-slate-800 dark:text-red-400 tracking-wider mb-2">
                            Tolak Quest
                        </h3>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
                            Berikan umpan balik atau alasan penolakan agar pembuat quest tahu apa yang harus diperbaiki.
                        </p>

                        <form onSubmit={handleRejectPost} className="space-y-4">
                            <div className="space-y-1.5">
                                <label className="text-[10px] font-bold uppercase text-slate-500 dark:text-slate-400">
                                    Catatan Penolakan <span className="text-red-500">*</span>
                                </label>
                                <textarea
                                    required
                                    placeholder="Tulis alasan penolakan quest disini..."
                                    rows={4}
                                    value={rejectPostForm.data.rejection_note}
                                    onChange={(e) => rejectPostForm.setData('rejection_note', e.target.value)}
                                    className="w-full px-3 py-2 bg-slate-50 dark:bg-black/20 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:border-red-500 text-xs text-slate-800 dark:text-white"
                                />
                                {rejectPostForm.errors.rejection_note && (
                                    <p className="text-xs text-red-500 font-semibold">{rejectPostForm.errors.rejection_note}</p>
                                )}
                            </div>

                            <div className="flex gap-2 justify-end pt-2">
                                <button
                                    type="button"
                                    onClick={() => setShowRejectPostForm(false)}
                                    className="px-4 py-2 rounded-xl text-xs font-semibold uppercase bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 transition-all cursor-pointer"
                                >
                                    Batal
                                </button>
                                <button
                                    type="submit"
                                    disabled={rejectPostForm.processing}
                                    className="px-4 py-2 rounded-xl text-xs font-semibold uppercase bg-red-650 hover:bg-red-750 text-white transition-all cursor-pointer disabled:opacity-50"
                                >
                                    {rejectPostForm.processing ? 'Mengirim...' : 'Tolak Quest'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </AppLayout>
    );
}
