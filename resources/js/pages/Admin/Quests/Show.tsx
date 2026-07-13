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
    Clock,
    Award,
    ShieldAlert,
    CheckCircle2,
} from 'lucide-react';
import React, { useState } from 'react';
import QuestChatPanel from '@/components/Quest/QuestChatPanel';
import ConfirmModal from '@/components/ConfirmModal';

interface RevisionEntry {
    note: string;
    created_at: string;
    author_id: string;
    author_name: string;
}

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
    revisions?: Array<RevisionEntry>;
    rejection_note?: string | null;
    rating?: number | null;
    rating_comment?: string | null;
    images?: Array<{ name: string; url: string }>;
    files?: Array<{ name: string; url: string; size: number }>;
    submission_file?: { name: string; url: string; size: number } | null;
    tier?: string;
    custom_rewards?: { exp?: number; gold?: number } | null;
    dispute?: {
        status?: string;
        reason?: string;
        ruled_at?: string;
        ruling?: string;
        note?: string;
        split_percentage?: number;
        filer_id?: string;
        filer_name?: string;
    } | null;
    submission_history?: Array<{
        version: number;
        submitted_at: string;
        submission_link?: string | null;
        submission_note?: string | null;
        submission_file?: { name: string; url: string; size: number } | null;
    }>;
    rewards?: {
        exp?: number;
        gold?: number;
        erp?: number;
    };
}

const RevisionHistory = ({
    quest,
    viewType,
}: {
    quest: Quest;
    viewType:
        | 'creator_ongoing'
        | 'creator_submitted'
        | 'worker_ongoing'
        | 'worker_submitted'
        | 'admin_submitted'
        | 'admin_ongoing';
}) => {
    if (!quest.revisions || quest.revisions.length === 0) {
        if (!quest.revision_note) {
            return null;
        }

        let label = 'Instruksi/Catatan Revisi:';
        if (viewType === 'creator_ongoing') {
            label = 'Instruksi Revisi dari Anda:';
        } else if (viewType === 'creator_submitted') {
            label = 'Catatan Revisi Sebelumnya:';
        } else if (viewType === 'worker_ongoing') {
            label = 'Permintaan Revisi Pemilik:';
        } else if (viewType === 'worker_submitted') {
            label = 'Permintaan Revisi Sebelumnya:';
        } else if (viewType === 'admin_submitted') {
            label = 'Catatan Revisi Sebelumnya:';
        } else if (viewType === 'admin_ongoing') {
            label = 'Menunggu Revisi Pekerja:';
        }

        return (
            <div className="space-y-1 rounded-xl border border-red-500/20 bg-red-500/10 p-3.5 font-['Oxanium']">
                <span className="block font-['Orbitron'] text-[10px] font-bold tracking-wider text-red-600 uppercase dark:text-red-400">
                    ⚠️ {label}
                </span>
                <p className="text-slate-650 dark:text-slate-350 mt-1 text-xs leading-relaxed whitespace-pre-wrap italic">
                    "{quest.revision_note}"
                </p>
            </div>
        );
    }

    const latestRevision = quest.revisions[quest.revisions.length - 1];
    let mainLabel = 'Instruksi Revisi Terakhir:';
    if (viewType === 'creator_ongoing') {
        mainLabel = 'Instruksi Revisi Terakhir dari Anda:';
    } else if (viewType === 'creator_submitted') {
        mainLabel = 'Catatan/Permintaan Revisi Sebelumnya:';
    } else if (viewType === 'worker_ongoing') {
        mainLabel = 'Permintaan Revisi Pemilik:';
    } else if (viewType === 'worker_submitted') {
        mainLabel = 'Permintaan Revisi Sebelumnya:';
    } else if (viewType === 'admin_submitted') {
        mainLabel = 'Catatan/Permintaan Revisi Sebelumnya:';
    } else if (viewType === 'admin_ongoing') {
        mainLabel = 'Menunggu Revisi Pekerja (Terakhir):';
    }

    return (
        <div className="space-y-3 font-['Oxanium']">
            {/* Latest Revision */}
            <div className="space-y-1 rounded-xl border border-red-500/20 bg-red-500/10 p-3.5">
                <span className="text-red-650 dark:text-red-450 block font-['Orbitron'] text-[10px] font-bold tracking-wider uppercase">
                    ⚠️ {mainLabel}
                </span>
                <p className="dark:text-slate-350 mt-1 text-xs leading-relaxed whitespace-pre-wrap text-slate-600 italic">
                    "{latestRevision.note}"
                </p>
                <div className="text-slate-455 mt-1 flex items-center gap-1 font-sans text-[9px] dark:text-slate-500">
                    <span>Oleh {latestRevision.author_name} • </span>
                    <span>
                        {new Date(latestRevision.created_at).toLocaleString(
                            'id-ID',
                            {
                                dateStyle: 'medium',
                                timeStyle: 'short',
                            },
                        )}
                    </span>
                </div>
            </div>

            {/* Previous Revisions */}
            {quest.revisions.length > 1 && (
                <div className="overflow-hidden rounded-xl border border-slate-200 bg-slate-50/20 dark:border-slate-800/80 dark:bg-black/10">
                    <details className="group">
                        <summary className="flex cursor-pointer items-center justify-between px-3.5 py-2 font-['Orbitron'] text-[10px] font-bold tracking-wider text-slate-500 uppercase select-none hover:text-slate-700 dark:text-slate-400 dark:hover:text-white">
                            <span>
                                Lihat Riwayat Revisi Sebelumnya (
                                {quest.revisions.length - 1})
                            </span>
                            <span className="font-sans text-[8px] tracking-normal transition-transform group-open:rotate-180">
                                ▼
                            </span>
                        </summary>
                        <div className="max-h-[220px] space-y-3 overflow-y-auto border-t border-slate-200/60 px-3.5 pt-3 pb-3 dark:border-slate-800/60">
                            {quest.revisions
                                .slice(0, -1)
                                .reverse()
                                .map((rev, idx) => {
                                    const revNum =
                                        quest.revisions!.length - 1 - idx;
                                    return (
                                        <div
                                            key={idx}
                                            className="space-y-1 rounded-lg border border-slate-200/50 bg-slate-100/30 p-3 dark:border-slate-800/50 dark:bg-black/20"
                                        >
                                            <div className="flex items-center justify-between font-['Orbitron'] text-[9px] font-bold text-slate-500 dark:text-slate-400">
                                                <span>REVISI #{revNum}</span>
                                                <span className="text-slate-450 dark:text-slate-550 font-sans font-normal">
                                                    {new Date(
                                                        rev.created_at,
                                                    ).toLocaleString('id-ID', {
                                                        dateStyle: 'medium',
                                                        timeStyle: 'short',
                                                    })}
                                                </span>
                                            </div>
                                            <p className="dark:text-slate-350 mt-1 text-xs leading-relaxed whitespace-pre-wrap text-slate-600 italic">
                                                "{rev.note}"
                                            </p>
                                            <div className="text-slate-450 dark:text-slate-550 font-sans text-[9px]">
                                                Diminta oleh:{' '}
                                                <span className="dark:text-slate-450 font-semibold text-slate-500">
                                                    {rev.author_name}
                                                </span>
                                            </div>
                                        </div>
                                    );
                                })}
                        </div>
                    </details>
                </div>
            )}
        </div>
    );
};

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

interface Props {
    quest: Quest;
    bids: Bid[];
    transactions?: Transaction[];
}

export default function Show({ quest, bids, transactions = [] }: Props) {
    const [selectedChatBid, setSelectedChatBid] = useState<{
        id: string;
        name: string;
    } | null>(null);
    const [previewImage, setPreviewImage] = useState<{
        url: string;
        name: string;
    } | null>(null);
    const [acceptBidId, setAcceptBidId] = useState<string | null>(null);
    const [deleteBidId, setDeleteBidId] = useState<string | null>(null);
    const [showApproveForm, setShowApproveForm] = useState(false);
    const [showRejectForm, setShowRejectForm] = useState(false);
    const { props } = usePage<any>();
    const currentUserId = props.auth?.user?.id;

    // Define active tab
    const [activeTab, setActiveTab] = useState<
        'detail' | 'project' | 'bids' | 'arbitration'
    >('detail');

    const approveForm = useForm({
        rating: 5,
        rating_comment: '',
    });

    const rejectForm = useForm({
        revision_note: '',
    });

    const arbitrateForm = useForm({
        ruling: 'refund' as 'refund' | 'pay_worker' | 'split',
        split_percentage: 50,
        note: '',
    });

    const extendDeadlineForm = useForm({
        deadline: '',
    });

    const handleArbitrate = (e: React.FormEvent) => {
        e.preventDefault();
        arbitrateForm.post(`/admin/quests/${quest._id}/arbitrate`, {
            onSuccess: () => {
                arbitrateForm.reset();
            },
        });
    };

    const handleExtendDeadline = (e: React.FormEvent) => {
        e.preventDefault();

        const utcDeadline = extendDeadlineForm.data.deadline
            ? new Date(extendDeadlineForm.data.deadline).toISOString()
            : '';

        extendDeadlineForm.transform((data) => ({
            ...data,
            deadline: utcDeadline,
        }));

        extendDeadlineForm.post(`/admin/quests/${quest._id}/extend-deadline`, {
            onSuccess: () => {
                extendDeadlineForm.reset();
            },
        });
    };

    const handleForceCancel = () => {
        if (
            confirm(
                'Apakah Anda yakin ingin membatalkan quest ini secara paksa? Uang escrow akan dikembalikan penuh ke pembuat quest.',
            )
        ) {
            router.post(`/admin/quests/${quest._id}/force-cancel`);
        }
    };

    const handleReopenBidding = () => {
        if (
            confirm(
                'Apakah Anda yakin ingin membuka kembali bidding? Pekerja terpilih saat ini akan dilepas dan uang escrow dikembalikan ke pembuat quest.',
            )
        ) {
            router.post(`/admin/quests/${quest._id}/reopen-bidding`);
        }
    };

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
        router.post(
            `/admin/quests/${quest._id}/approve-post`,
            {},
            {
                onSuccess: () => setShowApprovePostConfirm(false),
            },
        );
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
        return (
            parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i]
        );
    };

    const formatDate = (dateStr: string) => {
        const d = new Date(dateStr);
        const datePart = d.toLocaleDateString('id-ID', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });
        const timePart = d.toLocaleTimeString('id-ID', {
            hour: '2-digit',
            minute: '2-digit',
        });
        return `${datePart} pukul ${timePart}`;
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
                className="relative min-h-screen overflow-hidden bg-slate-50 px-2 py-4 text-slate-800 transition-colors duration-205 sm:px-3 lg:px-5 dark:bg-[#060813] dark:text-white"
                style={{ fontFamily: "'Outfit', sans-serif" }}
            >
                {/* Ambient top-center glow */}
                <div className="pointer-events-none absolute top-0 left-1/2 z-0 h-[450px] w-full max-w-7xl -translate-x-1/2 rounded-full bg-indigo-500/5 blur-[120px] select-none" />

                <div className="relative z-10 mx-auto max-w-7xl space-y-6">
                    {/* BACK LINK & BADGE */}
                    <div className="flex flex-col gap-4 border-b border-slate-200 pb-5 sm:flex-row sm:items-center sm:justify-between dark:border-slate-800/80">
                        <div className="space-y-1">
                            <Link
                                href="/admin/quests"
                                className="inline-flex items-center gap-1.5 font-['Orbitron'] text-xs font-bold tracking-widest text-slate-500 uppercase transition-colors hover:text-indigo-600 dark:text-slate-400 dark:hover:text-indigo-400"
                            >
                                <ArrowLeft size={14} />
                                Kembali ke Daftar Quest
                            </Link>
                            <h2 className="font-['Oxanium'] text-xl font-extrabold tracking-tight text-slate-900 sm:text-2xl md:text-3xl dark:text-white">
                                {quest.title}
                            </h2>
                        </div>

                        <div className="flex items-center gap-3">
                            <span
                                className={`shrink-0 rounded-xl border px-4 py-1.5 font-['Orbitron'] text-xs font-black tracking-wider uppercase ${
                                    quest.status === 'open'
                                        ? 'border-green-500/20 bg-green-500/10 text-green-700 dark:text-green-400'
                                        : quest.status === 'draft'
                                          ? 'border-amber-500/20 bg-amber-500/10 text-amber-700 dark:text-amber-400'
                                          : quest.status === 'rejected'
                                            ? 'border-red-500/20 bg-red-500/10 text-red-700 dark:text-red-400'
                                            : quest.status === 'expired'
                                              ? 'border-red-500/20 bg-red-500/10 text-red-700 dark:text-red-400'
                                              : quest.status === 'ongoing'
                                                ? 'border-blue-500/20 bg-blue-500/10 text-blue-700 dark:text-blue-400'
                                                : quest.status === 'approved'
                                                  ? 'border-purple-500/20 bg-purple-500/10 text-purple-700 dark:text-purple-400'
                                                  : quest.status === 'submitted'
                                                    ? 'border-yellow-500/20 bg-yellow-500/10 text-yellow-700 dark:text-yellow-400'
                                                    : 'border-slate-500/20 bg-slate-500/10 text-slate-600 dark:text-slate-400'
                                }`}
                            >
                                {quest.status === 'open'
                                    ? 'Tersedia'
                                    : quest.status === 'draft'
                                      ? 'Menunggu Review'
                                      : quest.status === 'rejected'
                                        ? 'Ditolak'
                                        : quest.status === 'expired'
                                          ? 'Kadaluarsa'
                                          : quest.status === 'ongoing'
                                            ? 'Pengerjaan'
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
                        <div className="flex items-center gap-4 rounded-2xl border border-slate-200 bg-white/70 p-4 shadow-sm backdrop-blur-md dark:border-slate-800 dark:bg-[#0c122c]/40">
                            <div className="shrink-0 rounded-xl bg-indigo-500/10 p-3 text-indigo-600 dark:text-indigo-400">
                                <TrendingUp className="h-5 w-5" />
                            </div>
                            <div className="font-['Oxanium']">
                                <span className="block text-[10px] font-bold tracking-wider text-slate-400 uppercase">
                                    Total Penawaran
                                </span>
                                <span className="font-['Orbitron'] text-base font-extrabold text-slate-900 dark:text-white">
                                    {bids.length} Bid
                                </span>
                            </div>
                        </div>

                        <div className="flex items-center gap-4 rounded-2xl border border-slate-200 bg-white/70 p-4 shadow-sm backdrop-blur-md dark:border-slate-800 dark:bg-[#0c122c]/40">
                            <div className="shrink-0 rounded-xl bg-purple-500/10 p-3 text-purple-600 dark:text-purple-400">
                                <DollarSign className="h-5 w-5" />
                            </div>
                            <div className="font-['Oxanium']">
                                <span className="block text-[10px] font-bold tracking-wider text-slate-400 uppercase">
                                    Rata-Rata Penawaran
                                </span>
                                <span className="font-['Orbitron'] text-base font-extrabold text-slate-900 dark:text-white">
                                    {averageBid > 0
                                        ? formatCurrency(averageBid)
                                        : 'Rp 0'}
                                </span>
                            </div>
                        </div>

                        <div className="flex items-center gap-4 rounded-2xl border border-slate-200 bg-white/70 p-4 shadow-sm backdrop-blur-md dark:border-slate-800 dark:bg-[#0c122c]/40">
                            <div className="shrink-0 rounded-xl bg-blue-500/10 p-3 text-blue-600 dark:text-blue-400">
                                <Briefcase className="h-5 w-5" />
                            </div>
                            <div className="font-['Oxanium']">
                                <span className="block text-[10px] font-bold tracking-wider text-slate-400 uppercase">
                                    Rentang Anggaran
                                </span>
                                <span className="font-['Orbitron'] text-xs font-black text-slate-900 dark:text-white">
                                    {formatCurrency(quest.min_salary)} -{' '}
                                    {formatCurrency(quest.max_salary)}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* MAIN TWO-COLUMN LAYOUT */}
                    <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-12">
                        {/* LEFT COLUMN: TABS & CONTENT PANELS (lg:col-span-8) */}
                        <div className="space-y-6 lg:col-span-8">
                            {/* Moderation Post Card */}
                            {quest.status === 'draft' && (
                                <div className="dark:bg-amber-955/10 space-y-4 rounded-2xl border border-amber-500/20 bg-amber-500/5 p-6 font-['Oxanium'] shadow-md">
                                    <div className="border-b border-amber-500/10 pb-3">
                                        <span className="inline-block font-['Orbitron'] text-[10px] font-bold tracking-widest text-amber-600 uppercase dark:text-amber-400">
                                            ⚠️ Moderasi Posting Quest
                                        </span>
                                        <h3 className="mt-1 text-sm font-bold text-slate-800 dark:text-amber-300">
                                            Persetujuan Quest Baru
                                        </h3>
                                    </div>
                                    <p className="text-xs leading-relaxed text-slate-500 dark:text-slate-300">
                                        Quest ini dikirim oleh{' '}
                                        <strong>{quest.creator.name}</strong>{' '}
                                        dan membutuhkan persetujuan Anda sebagai
                                        administrator sebelum dipublikasikan ke
                                        papan quest publik.
                                    </p>

                                    <div className="flex gap-3 pt-2">
                                        <button
                                            onClick={() =>
                                                setShowApprovePostConfirm(true)
                                            }
                                            className="flex-1 cursor-pointer rounded-xl bg-emerald-600 py-2.5 text-center font-['Orbitron'] text-xs font-bold tracking-wider text-white uppercase shadow-sm transition-all hover:bg-emerald-700"
                                        >
                                            Setujui & Publikasikan
                                        </button>
                                        <button
                                            onClick={() =>
                                                setShowRejectPostForm(true)
                                            }
                                            className="flex-1 cursor-pointer rounded-xl bg-red-600 py-2.5 text-center font-['Orbitron'] text-xs font-bold tracking-wider text-white uppercase shadow-sm transition-all hover:bg-red-700"
                                        >
                                            Tolak Quest
                                        </button>
                                    </div>
                                </div>
                            )}

                            {quest.status === 'rejected' && (
                                <div className="dark:bg-red-955/10 space-y-3 rounded-2xl border border-red-500/20 bg-red-500/5 p-6 font-['Oxanium'] shadow-md">
                                    <span className="inline-block font-['Orbitron'] text-[10px] font-bold tracking-widest text-red-600 uppercase dark:text-red-400">
                                        ❌ Quest Ditolak
                                    </span>
                                    <h3 className="text-sm font-bold text-red-600 dark:text-red-400">
                                        Status: Ditolak Admin
                                    </h3>
                                    {quest.rejection_note && (
                                        <div className="space-y-1 rounded-xl border border-red-500/20 bg-red-500/10 p-3">
                                            <span className="block text-[9px] font-bold tracking-wider text-red-500 uppercase">
                                                Catatan Penolakan Anda:
                                            </span>
                                            <p className="text-xs leading-relaxed whitespace-pre-wrap text-slate-600 dark:text-slate-300">
                                                {quest.rejection_note}
                                            </p>
                                        </div>
                                    )}
                                </div>
                            )}

                            {quest.status === 'expired' && (
                                <div className="dark:bg-red-955/10 space-y-3 rounded-2xl border border-red-500/20 bg-red-500/5 p-6 font-['Oxanium'] shadow-md">
                                    <span className="inline-block font-['Orbitron'] text-[10px] font-bold tracking-widest text-red-600 uppercase dark:text-red-400">
                                        🚨 Quest Kadaluarsa (Expired)
                                    </span>
                                    <h3 className="text-sm font-bold text-red-600 dark:text-red-400">
                                        Tenggat Waktu Terlewati
                                    </h3>
                                    <p className="text-xs leading-relaxed text-slate-600 dark:text-slate-300">
                                        Tenggat waktu pengerjaan proyek ini
                                        telah berakhir sebelum pekerja berhasil
                                        menyelesaikan tugasnya. Pekerja lama
                                        dibebaskan dan penalti reputasi ERP
                                        telah diberlakukan secara otomatis oleh
                                        sistem.
                                    </p>
                                </div>
                            )}

                            {/* Stepper Progress Timeline */}
                            {quest.status !== 'draft' &&
                                quest.status !== 'rejected' && (
                                    <div className="space-y-4 rounded-2xl border border-slate-200 bg-white/70 p-6 font-['Orbitron'] text-[9px] font-bold tracking-wider shadow-sm sm:text-[10px] dark:border-slate-800 dark:bg-[#0c122c]/40">
                                        <span className="block border-b border-slate-100 pb-2 text-[10px] font-bold tracking-wider text-slate-400 uppercase dark:border-slate-800">
                                            Alur Progress Quest
                                        </span>
                                        <div className="relative flex items-center justify-between pt-2">
                                            <div className="absolute top-1/2 right-0 left-0 z-0 h-0.5 -translate-y-1/2 bg-slate-200 dark:bg-slate-800/80" />
                                            <div
                                                className="absolute top-1/2 left-0 z-0 h-0.5 -translate-y-1/2 bg-indigo-500 transition-all duration-500"
                                                style={{
                                                    width:
                                                        quest.status === 'open'
                                                            ? '0%'
                                                            : quest.status ===
                                                                'ongoing'
                                                              ? '25%'
                                                              : quest.status ===
                                                                  'submitted'
                                                                ? '50%'
                                                                : quest.status ===
                                                                    'approved'
                                                                  ? '75%'
                                                                  : '105%',
                                                }}
                                            />

                                            {[
                                                {
                                                    key: 'open',
                                                    label: 'Bidding',
                                                },
                                                {
                                                    key: 'ongoing',
                                                    label: 'Pengerjaan',
                                                },
                                                {
                                                    key: 'submitted',
                                                    label: 'Tinjauan',
                                                },
                                                {
                                                    key: 'approved',
                                                    label: 'Disetujui',
                                                },
                                                {
                                                    key: 'completed',
                                                    label: 'Selesai',
                                                },
                                            ].map((step, idx) => {
                                                const statuses = [
                                                    'open',
                                                    'ongoing',
                                                    'submitted',
                                                    'approved',
                                                    'completed',
                                                ];
                                                const currentIdx =
                                                    statuses.indexOf(
                                                        quest.status,
                                                    );
                                                const stepIdx =
                                                    statuses.indexOf(step.key);
                                                const isCompleted =
                                                    stepIdx < currentIdx ||
                                                    quest.status ===
                                                        'completed';
                                                const isActive =
                                                    quest.status === step.key;

                                                return (
                                                    <div
                                                        key={step.key}
                                                        className="relative z-10 flex flex-col items-center"
                                                    >
                                                        <div
                                                            className={`flex h-6 w-6 items-center justify-center rounded-full border-2 transition-all duration-350 sm:h-7 sm:w-7 ${
                                                                isCompleted
                                                                    ? 'border-indigo-505 bg-indigo-600 text-white shadow-[0_0_10px_rgba(99,102,241,0.4)]'
                                                                    : isActive
                                                                      ? 'border-purple-500 bg-purple-600 text-white shadow-[0_0_10px_rgba(168,85,247,0.4)]'
                                                                      : 'border-slate-200 bg-white text-slate-400 dark:border-slate-800 dark:bg-[#0c122c]'
                                                            }`}
                                                        >
                                                            {isCompleted
                                                                ? '✓'
                                                                : idx + 1}
                                                        </div>
                                                        <span
                                                            className={`mt-1.5 text-[8px] tracking-widest uppercase sm:text-[9px] ${
                                                                isActive ||
                                                                isCompleted
                                                                    ? 'font-black text-indigo-600 dark:text-purple-300'
                                                                    : 'text-slate-400'
                                                            }`}
                                                        >
                                                            {step.label}
                                                        </span>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                )}

                            {/* Tab Buttons */}
                            <div className="flex shrink-0 gap-6 border-b border-slate-200 font-['Orbitron'] text-xs font-black tracking-wider dark:border-slate-800/80">
                                <button
                                    onClick={() => setActiveTab('detail')}
                                    className={`relative cursor-pointer pb-3 transition-colors ${
                                        activeTab === 'detail'
                                            ? 'font-extrabold text-indigo-600 dark:text-indigo-400'
                                            : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-200'
                                    }`}
                                >
                                    <span className="flex items-center gap-1.5 font-['Orbitron']">
                                        <FileText size={14} />
                                        Spesifikasi Quest
                                    </span>
                                    {activeTab === 'detail' && (
                                        <span className="absolute right-0 bottom-0 left-0 h-0.5 rounded-full bg-indigo-600 dark:bg-indigo-400" />
                                    )}
                                </button>

                                <button
                                    onClick={() => setActiveTab('project')}
                                    className={`relative cursor-pointer pb-3 transition-colors ${
                                        activeTab === 'project'
                                            ? 'font-extrabold text-indigo-600 dark:text-indigo-400'
                                            : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-200'
                                    }`}
                                >
                                    <span className="flex items-center gap-1.5 font-['Orbitron']">
                                        <Briefcase size={14} />
                                        Manajemen Pengerjaan
                                    </span>
                                    {activeTab === 'project' && (
                                        <span className="absolute right-0 bottom-0 left-0 h-0.5 rounded-full bg-indigo-600 dark:bg-indigo-400" />
                                    )}
                                </button>

                                <button
                                    onClick={() => setActiveTab('bids')}
                                    className={`relative cursor-pointer pb-3 transition-colors ${
                                        activeTab === 'bids'
                                            ? 'font-extrabold text-indigo-600 dark:text-indigo-400'
                                            : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-200'
                                    }`}
                                >
                                    <span className="flex items-center gap-1.5 font-['Orbitron']">
                                        <MessageSquare size={14} />
                                        Pelamar ({bids.length})
                                    </span>
                                    {activeTab === 'bids' && (
                                        <span className="absolute right-0 bottom-0 left-0 h-0.5 rounded-full bg-indigo-600 dark:bg-indigo-400" />
                                    )}
                                </button>

                                <button
                                    onClick={() => setActiveTab('arbitration')}
                                    className={`relative cursor-pointer pb-3 transition-colors ${
                                        activeTab === 'arbitration'
                                            ? 'font-extrabold text-indigo-600 dark:text-indigo-400'
                                            : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-200'
                                    }`}
                                >
                                    <span className="flex items-center gap-1.5 font-['Orbitron']">
                                        <ShieldAlert size={14} />
                                        Arbitrase & Kontrol
                                    </span>
                                    {activeTab === 'arbitration' && (
                                        <span className="absolute right-0 bottom-0 left-0 h-0.5 rounded-full bg-indigo-600 dark:bg-indigo-400" />
                                    )}
                                </button>
                            </div>

                            {/* TAB 1: DETAILS */}
                            {activeTab === 'detail' && (
                                <div className="space-y-6 rounded-2xl border border-slate-200 bg-white/70 p-6 shadow-md backdrop-blur-md transition-all duration-300 dark:border-slate-800/80 dark:bg-[#0c122c]/40">
                                    <div className="space-y-3">
                                        <h3 className="font-['Orbitron'] text-xs font-bold tracking-wider text-slate-400 uppercase dark:text-blue-300/60">
                                            Deskripsi Pekerjaan
                                        </h3>
                                        <div className="rounded-xl border border-slate-100 bg-slate-50/50 p-4 font-['Oxanium'] text-sm leading-relaxed whitespace-pre-wrap text-slate-700 sm:text-base dark:border-slate-800/40 dark:bg-black/10 dark:text-slate-200">
                                            {quest.description}
                                        </div>
                                    </div>

                                    {/* Lampiran Quest (Gambar & File) */}
                                    {((quest.images &&
                                        quest.images.length > 0) ||
                                        (quest.files &&
                                            quest.files.length > 0)) && (
                                        <div className="space-y-5 border-t border-slate-100 pt-5 font-['Oxanium'] dark:border-slate-800">
                                            <h3 className="font-['Orbitron'] text-xs font-bold tracking-wider text-slate-400 uppercase">
                                                Lampiran Pendukung
                                            </h3>

                                            {/* Images Gallery */}
                                            {quest.images &&
                                                quest.images.length > 0 && (
                                                    <div className="space-y-2.5">
                                                        <span className="block text-[10px] font-semibold tracking-wider text-slate-400 uppercase">
                                                            Galeri Gambar
                                                        </span>
                                                        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                                                            {quest.images.map(
                                                                (
                                                                    img,
                                                                    index,
                                                                ) => (
                                                                    <div
                                                                        key={
                                                                            index
                                                                        }
                                                                        className="group relative overflow-hidden rounded-xl border border-slate-200 bg-slate-50/50 p-1 dark:border-slate-800 dark:bg-black/20"
                                                                    >
                                                                        <img
                                                                            src={
                                                                                img.url
                                                                            }
                                                                            alt={
                                                                                img.name
                                                                            }
                                                                            onClick={() =>
                                                                                setPreviewImage(
                                                                                    img,
                                                                                )
                                                                            }
                                                                            className="h-24 w-full cursor-pointer rounded-lg object-cover transition-transform hover:scale-[1.02]"
                                                                        />
                                                                        <div className="pointer-events-none absolute inset-0 flex items-center justify-center gap-2 bg-black/60 opacity-0 transition-opacity group-hover:pointer-events-auto group-hover:opacity-100">
                                                                            <button
                                                                                type="button"
                                                                                onClick={() =>
                                                                                    setPreviewImage(
                                                                                        img,
                                                                                    )
                                                                                }
                                                                                className="cursor-pointer rounded-lg bg-white/10 p-1.5 text-white transition-colors hover:bg-white/20"
                                                                                title="Detail Gambar"
                                                                            >
                                                                                <ImageIcon className="h-4 w-4" />
                                                                            </button>
                                                                            <a
                                                                                href={
                                                                                    img.url
                                                                                }
                                                                                target="_blank"
                                                                                rel="noopener noreferrer"
                                                                                className="cursor-pointer rounded-lg bg-indigo-500 p-1.5 text-white transition-colors hover:bg-indigo-700"
                                                                                title="Unduh di Tab Baru"
                                                                            >
                                                                                <Download className="h-4 w-4" />
                                                                            </a>
                                                                        </div>
                                                                        <span className="mt-1 block truncate px-1 text-center text-[9px] text-slate-500 dark:text-slate-400">
                                                                            {
                                                                                img.name
                                                                            }
                                                                        </span>
                                                                    </div>
                                                                ),
                                                            )}
                                                        </div>
                                                    </div>
                                                )}

                                            {/* Files List */}
                                            {quest.files &&
                                                quest.files.length > 0 && (
                                                    <div className="space-y-2.5">
                                                        <span className="block text-[10px] font-semibold tracking-wider text-slate-400 uppercase">
                                                            Dokumen Lampiran
                                                        </span>
                                                        <div className="space-y-2">
                                                            {quest.files.map(
                                                                (
                                                                    file,
                                                                    index,
                                                                ) => {
                                                                    const ext =
                                                                        file.name
                                                                            .split(
                                                                                '.',
                                                                            )
                                                                            .pop()
                                                                            ?.toLowerCase();
                                                                    const isZip =
                                                                        ext ===
                                                                        'zip';
                                                                    return (
                                                                        <div
                                                                            key={
                                                                                index
                                                                            }
                                                                            className="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50/50 p-3 dark:border-slate-800/80 dark:bg-black/20"
                                                                        >
                                                                            <div className="flex min-w-0 items-center gap-3">
                                                                                {isZip ? (
                                                                                    <FileArchive className="h-5 w-5 shrink-0 text-amber-500" />
                                                                                ) : (
                                                                                    <FileText className="h-5 w-5 shrink-0 text-indigo-500" />
                                                                                )}
                                                                                <div className="min-w-0">
                                                                                    <p className="truncate text-xs font-semibold text-slate-700 dark:text-slate-200">
                                                                                        {
                                                                                            file.name
                                                                                        }
                                                                                    </p>
                                                                                    <p className="text-[10px] font-semibold text-slate-400">
                                                                                        {formatBytes(
                                                                                            file.size,
                                                                                        )}
                                                                                    </p>
                                                                                </div>
                                                                            </div>
                                                                            <a
                                                                                href={
                                                                                    file.url
                                                                                }
                                                                                target="_blank"
                                                                                rel="noopener noreferrer"
                                                                                className="hover:text-indigo-705 flex cursor-pointer items-center justify-center rounded-lg p-1.5 text-indigo-500 transition-colors hover:bg-indigo-500/10"
                                                                                title="Unduh berkas di Tab Baru"
                                                                            >
                                                                                <Download className="h-4.5 w-4.5" />
                                                                            </a>
                                                                        </div>
                                                                    );
                                                                },
                                                            )}
                                                        </div>
                                                    </div>
                                                )}
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* TAB 2: PROJECT WORKFLOW & VERIFICATION */}
                            {activeTab === 'project' && (
                                <div className="space-y-5 rounded-2xl border border-slate-200 bg-white/70 p-6 shadow-md backdrop-blur-md transition-all duration-300 dark:border-slate-800/80 dark:bg-[#0c122c]/40">
                                    <div className="flex items-center justify-between border-b border-slate-100 pb-3 dark:border-slate-800">
                                        <h3 className="font-['Orbitron'] text-sm font-bold tracking-wider text-slate-800 uppercase dark:text-blue-200">
                                            Alur Kerja & Status Penyelesaian
                                        </h3>

                                        {/* Worker chat shortcut */}
                                        {quest.worker &&
                                            (() => {
                                                const acceptedBid = bids.find(
                                                    (b) =>
                                                        b.status ===
                                                            'accepted' ||
                                                        b.student._id ===
                                                            quest.worker_id,
                                                );
                                                if (acceptedBid) {
                                                    return (
                                                        <button
                                                            onClick={() =>
                                                                setSelectedChatBid(
                                                                    {
                                                                        id: acceptedBid._id,
                                                                        name:
                                                                            quest
                                                                                .worker
                                                                                ?.name ??
                                                                            '',
                                                                    },
                                                                )
                                                            }
                                                            className="relative flex shrink-0 cursor-pointer items-center gap-1.5 rounded-xl bg-indigo-600 px-3.5 py-1.5 font-['Orbitron'] text-xs font-bold tracking-wider text-white uppercase shadow-sm transition-all duration-350 hover:bg-indigo-700"
                                                        >
                                                            <MessageSquare
                                                                size={12}
                                                            />
                                                            Chat Pekerja
                                                            {acceptedBid.unread_messages_count >
                                                                0 && (
                                                                <span className="absolute -top-1 -right-1 flex h-4 w-4 animate-pulse items-center justify-center rounded-full bg-red-500 text-[8px] font-black text-white ring-2 ring-white dark:ring-slate-900">
                                                                    {
                                                                        acceptedBid.unread_messages_count
                                                                    }
                                                                </span>
                                                            )}
                                                        </button>
                                                    );
                                                }
                                                return null;
                                            })()}
                                    </div>

                                    {quest.worker ? (
                                        <div className="flex flex-col justify-between gap-4 rounded-xl border border-slate-200 bg-slate-50 p-4 font-['Oxanium'] sm:flex-row sm:items-center dark:border-slate-800/50 dark:bg-black/20">
                                            <div className="flex items-center gap-3">
                                                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-indigo-500/20 bg-indigo-500/10 font-bold text-indigo-600 dark:text-indigo-400">
                                                    {quest.worker.name
                                                        .substring(0, 2)
                                                        .toUpperCase()}
                                                </div>
                                                <div>
                                                    <span className="block text-[9px] font-semibold tracking-wider text-slate-400 uppercase">
                                                        Pekerja Ditugaskan
                                                    </span>
                                                    <span className="text-sm font-bold text-slate-800 dark:text-white">
                                                        {quest.worker.name}
                                                    </span>
                                                    <span className="block text-xs text-slate-500">
                                                        {quest.worker.email}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="py-6 text-center font-['Oxanium'] text-slate-400 dark:text-blue-300/40">
                                            <Briefcase className="mx-auto mb-2 h-8 w-8 text-indigo-500 opacity-50" />
                                            <p className="font-['Orbitron'] text-xs font-bold uppercase">
                                                Belum ada pekerja ditunjuk.
                                            </p>
                                            <p className="text-[11px] text-slate-500">
                                                Silakan terima salah satu
                                                penawaran masuk pada tab
                                                "Pelamar" untuk memulai
                                                pengerjaan quest.
                                            </p>
                                        </div>
                                    )}

                                    {quest.status === 'ongoing' && (
                                        <div className="space-y-4 border-t border-slate-100 pt-4 font-['Oxanium'] dark:border-slate-800/50">
                                            <p className="text-xs leading-relaxed text-slate-500 dark:text-blue-300/60">
                                                Status quest ini adalah{' '}
                                                <strong>
                                                    Dalam Pengerjaan
                                                </strong>
                                                . Pekerja saat ini sedang
                                                menyelesaikan deskripsi tugas.
                                            </p>
                                            <RevisionHistory
                                                quest={quest}
                                                viewType="admin_ongoing"
                                            />
                                        </div>
                                    )}

                                    {quest.status === 'approved' && (
                                        <div className="flex flex-col gap-2 rounded-xl border border-t border-indigo-500/20 border-slate-100 bg-indigo-500/10 p-4 pt-4 text-center font-['Oxanium'] dark:border-slate-800/50">
                                            <span className="block font-['Orbitron'] text-xs font-bold tracking-wider text-indigo-600 uppercase dark:text-indigo-400">
                                                Disetujui & Menunggu Berkas ZIP
                                                Final
                                            </span>
                                            <p className="text-[11px] text-slate-500 dark:text-slate-300">
                                                Ulasan pengerjaan telah
                                                disetujui. Menunggu pekerja
                                                menyerahkan berkas proyek ZIP
                                                final agar quest ditutup dan
                                                rewards RPG didistribusikan.
                                            </p>
                                        </div>
                                    )}

                                    {quest.status === 'submitted' && (
                                        <div className="space-y-5 border-t border-slate-100 pt-4 font-['Oxanium'] dark:border-slate-800/50">
                                            <div className="flex flex-col gap-1 rounded-xl border border-amber-500/20 bg-amber-500/10 p-4 text-center">
                                                <span className="block font-['Orbitron'] text-xs font-bold tracking-wider text-amber-600 uppercase dark:text-amber-400">
                                                    Penyerahan Tugas Masuk
                                                </span>
                                                <p className="text-xs leading-relaxed text-slate-500 dark:text-blue-300/60">
                                                    Pekerja telah selesai
                                                    melakukan penyerahan tugas
                                                    awal. Silakan review hasil
                                                    pekerjaannya di bawah ini.
                                                </p>
                                            </div>

                                            <RevisionHistory
                                                quest={quest}
                                                viewType="admin_submitted"
                                            />

                                            <div className="space-y-3.5 rounded-xl border border-slate-200 bg-slate-50/50 p-4 text-xs dark:border-slate-800/80 dark:bg-black/20">
                                                {quest.submission_file && (
                                                    <div className="space-y-1">
                                                        <strong className="block text-[10px] tracking-wider text-slate-400 uppercase">
                                                            Berkas Pekerjaan
                                                            Utama (ZIP)
                                                        </strong>
                                                        <div className="dark:bg-amber-955/10 flex items-center justify-between rounded-xl border border-amber-200/40 bg-amber-500/5 p-2.5 dark:border-amber-500/20">
                                                            <div className="flex min-w-0 items-center gap-2.5">
                                                                <FileArchive className="h-5 w-5 shrink-0 text-amber-500" />
                                                                <div className="min-w-0">
                                                                    <p className="text-slate-750 truncate text-xs font-semibold dark:text-slate-200">
                                                                        {
                                                                            quest
                                                                                .submission_file
                                                                                .name
                                                                        }
                                                                    </p>
                                                                    <p className="text-[10px] text-slate-400">
                                                                        {formatBytes(
                                                                            quest
                                                                                .submission_file
                                                                                .size,
                                                                        )}
                                                                    </p>
                                                                </div>
                                                            </div>
                                                            <a
                                                                href={
                                                                    quest
                                                                        .submission_file
                                                                        .url
                                                                }
                                                                target="_blank"
                                                                rel="noopener noreferrer"
                                                                className="flex cursor-pointer items-center justify-center rounded-lg p-1.5 text-amber-600 transition-colors hover:bg-amber-500/10 hover:text-amber-700"
                                                                title="Unduh ZIP di Tab Baru"
                                                            >
                                                                <Download className="h-4.5 w-4.5" />
                                                            </a>
                                                        </div>
                                                    </div>
                                                )}

                                                {quest.submission_link && (
                                                    <div>
                                                        <strong className="mb-1 block text-[10px] tracking-wider text-slate-400 uppercase">
                                                            Link Hasil Pekerjaan
                                                        </strong>
                                                        <a
                                                            href={
                                                                quest.submission_link
                                                            }
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="font-semibold break-all text-indigo-500 hover:underline"
                                                        >
                                                            {
                                                                quest.submission_link
                                                            }
                                                        </a>
                                                    </div>
                                                )}

                                                {quest.submission_note && (
                                                    <div>
                                                        <strong className="mb-1 block text-[10px] tracking-wider text-slate-400 uppercase">
                                                            Catatan Pekerja
                                                        </strong>
                                                        <p className="rounded-lg border border-slate-200 bg-white/40 p-2.5 leading-relaxed whitespace-pre-wrap text-slate-700 dark:border-slate-800/40 dark:bg-black/15 dark:text-slate-300">
                                                            {
                                                                quest.submission_note
                                                            }
                                                        </p>
                                                    </div>
                                                )}
                                            </div>

                                            {!showApproveForm &&
                                                !showRejectForm && (
                                                    <div className="flex gap-3 border-t border-slate-200 pt-4 dark:border-slate-800">
                                                        <button
                                                            onClick={() =>
                                                                setShowApproveForm(
                                                                    true,
                                                                )
                                                            }
                                                            className="flex-1 cursor-pointer rounded-xl bg-green-600 py-2.5 font-['Orbitron'] text-xs font-bold tracking-wider text-white uppercase shadow-sm transition-colors hover:bg-green-700"
                                                        >
                                                            Setujui & Selesaikan
                                                        </button>
                                                        <button
                                                            onClick={() =>
                                                                setShowRejectForm(
                                                                    true,
                                                                )
                                                            }
                                                            className="bg-red-605 flex-1 cursor-pointer rounded-xl py-2.5 font-['Orbitron'] text-xs font-bold tracking-wider text-white uppercase shadow-sm transition-colors hover:bg-red-700"
                                                        >
                                                            Tolak / Minta Revisi
                                                        </button>
                                                    </div>
                                                )}

                                            {showApproveForm && (
                                                <form
                                                    onSubmit={handleApproveWork}
                                                    className="space-y-4 border-t border-slate-100 pt-4 dark:border-slate-800"
                                                >
                                                    <h4 className="font-['Orbitron'] text-xs font-bold text-slate-700 uppercase dark:text-blue-200">
                                                        Berikan Penilaian &
                                                        Ulasan Pekerja
                                                    </h4>
                                                    <div className="space-y-1">
                                                        <label className="text-[10px] font-bold tracking-wider text-slate-400 uppercase">
                                                            Rating Kinerja
                                                        </label>
                                                        <div className="flex justify-center gap-1.5 py-1">
                                                            {[
                                                                1, 2, 3, 4, 5,
                                                            ].map((val) => (
                                                                <button
                                                                    key={val}
                                                                    type="button"
                                                                    onClick={() =>
                                                                        approveForm.setData(
                                                                            'rating',
                                                                            val,
                                                                        )
                                                                    }
                                                                    className="cursor-pointer transition-transform focus:outline-none active:scale-95"
                                                                >
                                                                    <Star
                                                                        className={`h-7 w-7 ${
                                                                            val <=
                                                                            approveForm
                                                                                .data
                                                                                .rating
                                                                                ? 'fill-amber-400 text-amber-400'
                                                                                : 'text-slate-300 dark:text-slate-600'
                                                                        }`}
                                                                    />
                                                                </button>
                                                            ))}
                                                        </div>
                                                    </div>

                                                    <div className="space-y-1">
                                                        <label className="text-[10px] font-bold tracking-wider text-slate-400 uppercase">
                                                            Ulasan Anda
                                                        </label>
                                                        <textarea
                                                            placeholder="Berikan ulasan tentang penyelesaian pekerjaan..."
                                                            rows={3}
                                                            value={
                                                                approveForm.data
                                                                    .rating_comment
                                                            }
                                                            onChange={(e) =>
                                                                approveForm.setData(
                                                                    'rating_comment',
                                                                    e.target
                                                                        .value,
                                                                )
                                                            }
                                                            className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-800 focus:border-indigo-500 focus:outline-none dark:border-slate-800 dark:bg-black/20 dark:text-white"
                                                        />
                                                    </div>

                                                    <div className="flex gap-2">
                                                        <button
                                                            type="submit"
                                                            disabled={
                                                                approveForm.processing
                                                            }
                                                            className="flex-1 cursor-pointer rounded-xl bg-green-600 py-2 font-['Orbitron'] text-xs font-bold tracking-wider text-white uppercase transition-colors hover:bg-green-700 disabled:opacity-50"
                                                        >
                                                            {approveForm.processing
                                                                ? 'Menyelesaikan...'
                                                                : 'Kirim Ulasan & Setujui'}
                                                        </button>
                                                        <button
                                                            type="button"
                                                            onClick={() => {
                                                                setShowApproveForm(
                                                                    false,
                                                                );
                                                                approveForm.reset();
                                                            }}
                                                            className="rounded-xl px-3 py-2 font-['Orbitron'] text-xs font-bold tracking-wider text-slate-500 uppercase transition-colors hover:text-slate-700 dark:text-slate-400 dark:hover:text-white"
                                                        >
                                                            Batal
                                                        </button>
                                                    </div>
                                                </form>
                                            )}

                                            {showRejectForm && (
                                                <form
                                                    onSubmit={handleRejectWork}
                                                    className="space-y-4 border-t border-slate-100 pt-4 dark:border-slate-800"
                                                >
                                                    <h4 className="font-['Orbitron'] text-xs font-bold text-slate-700 uppercase dark:text-blue-200">
                                                        Kirim Feedback Revisi
                                                    </h4>
                                                    <div className="space-y-1">
                                                        <label className="text-[10px] font-bold tracking-wider text-slate-400 uppercase">
                                                            Detail Revisi yang
                                                            Harus Diperbaiki{' '}
                                                            <span className="text-red-500">
                                                                *
                                                            </span>
                                                        </label>
                                                        <textarea
                                                            required
                                                            placeholder="Jelaskan secara rinci apa saja yang perlu diperbaiki pekerja..."
                                                            rows={4}
                                                            value={
                                                                rejectForm.data
                                                                    .revision_note
                                                            }
                                                            onChange={(e) =>
                                                                rejectForm.setData(
                                                                    'revision_note',
                                                                    e.target
                                                                        .value,
                                                                )
                                                            }
                                                            className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-800 focus:border-red-500 focus:outline-none dark:border-slate-800 dark:bg-black/20 dark:text-white"
                                                        />
                                                    </div>

                                                    <div className="flex gap-2">
                                                        <button
                                                            type="submit"
                                                            disabled={
                                                                rejectForm.processing
                                                            }
                                                            className="flex-1 cursor-pointer rounded-xl bg-red-600 py-2 font-['Orbitron'] text-xs font-bold tracking-wider text-white uppercase transition-colors hover:bg-red-700 disabled:opacity-50"
                                                        >
                                                            {rejectForm.processing
                                                                ? 'Mengirim...'
                                                                : 'Kirim Catatan Revisi'}
                                                        </button>
                                                        <button
                                                            type="button"
                                                            onClick={() => {
                                                                setShowRejectForm(
                                                                    false,
                                                                );
                                                                rejectForm.reset();
                                                            }}
                                                            className="rounded-xl px-3 py-2 font-['Orbitron'] text-xs font-bold tracking-wider text-slate-500 uppercase transition-colors hover:text-slate-700 dark:text-slate-400 dark:hover:text-white"
                                                        >
                                                            Batal
                                                        </button>
                                                    </div>
                                                </form>
                                            )}
                                        </div>
                                    )}

                                    {quest.status === 'completed' && (
                                        <div className="space-y-4 border-t border-slate-100 pt-4 font-['Oxanium'] dark:border-slate-800/50">
                                            <div className="flex flex-col gap-1 rounded-xl border border-green-500/20 bg-green-500/10 p-4 text-center">
                                                <Check className="mx-auto h-8 w-8 text-green-500" />
                                                <span className="block font-['Orbitron'] text-xs font-bold tracking-wider text-green-600 uppercase dark:text-green-400">
                                                    Quest Selesai
                                                </span>
                                                <p className="text-xs leading-relaxed text-slate-500 dark:text-blue-300/60">
                                                    Pekerjaan telah disetujui,
                                                    berkas final ZIP telah
                                                    terkirim, dan quest
                                                    diselesaikan secara resmi.
                                                </p>
                                            </div>

                                            {quest.rating && (
                                                <div className="space-y-2 rounded-xl border border-slate-200/20 bg-slate-50/50 p-4 text-center dark:border-slate-500/5 dark:bg-black/20">
                                                    <span className="block font-['Oxanium'] text-[10px] font-semibold tracking-wider text-slate-400 uppercase">
                                                        Ulasan Penilaian Anda
                                                    </span>
                                                    <div className="flex justify-center gap-1 font-['Oxanium']">
                                                        {[1, 2, 3, 4, 5].map(
                                                            (star) => (
                                                                <Star
                                                                    key={star}
                                                                    className={`h-5 w-5 ${
                                                                        star <=
                                                                        (quest.rating ??
                                                                            0)
                                                                            ? 'fill-amber-400 text-amber-400'
                                                                            : 'text-slate-300 dark:text-slate-600'
                                                                    }`}
                                                                />
                                                            ),
                                                        )}
                                                    </div>
                                                    {quest.rating_comment && (
                                                        <p className="rounded-lg border border-slate-100 bg-white/40 p-2.5 font-['Oxanium'] text-xs text-slate-600 italic dark:border-blue-500/5 dark:bg-black/10 dark:text-slate-300">
                                                            "
                                                            {
                                                                quest.rating_comment
                                                            }
                                                            "
                                                        </p>
                                                    )}
                                                </div>
                                            )}

                                            <div className="space-y-3 rounded-xl border border-slate-200 bg-slate-50/50 p-4 text-xs dark:border-slate-800 dark:bg-black/20">
                                                {quest.submission_file && (
                                                    <div className="space-y-1">
                                                        <strong className="block text-[10px] tracking-wider text-slate-400 uppercase">
                                                            Berkas Proyek Final
                                                            (ZIP)
                                                        </strong>
                                                        <div className="dark:bg-amber-955/10 flex items-center justify-between rounded-xl border border-amber-200/40 bg-amber-500/5 p-2.5 dark:border-amber-500/20">
                                                            <div className="flex min-w-0 items-center gap-2.5">
                                                                <FileArchive className="h-5 w-5 shrink-0 text-amber-500" />
                                                                <div className="min-w-0">
                                                                    <p className="text-slate-750 truncate text-xs font-semibold dark:text-slate-200">
                                                                        {
                                                                            quest
                                                                                .submission_file
                                                                                .name
                                                                        }
                                                                    </p>
                                                                    <p className="text-[10px] text-slate-400">
                                                                        {formatBytes(
                                                                            quest
                                                                                .submission_file
                                                                                .size,
                                                                        )}
                                                                    </p>
                                                                </div>
                                                            </div>
                                                            <a
                                                                href={
                                                                    quest
                                                                        .submission_file
                                                                        .url
                                                                }
                                                                target="_blank"
                                                                rel="noopener noreferrer"
                                                                className="flex cursor-pointer items-center justify-center rounded-lg p-1.5 text-amber-600 transition-colors hover:bg-amber-500/10 hover:text-amber-700"
                                                                title="Unduh ZIP di Tab Baru"
                                                            >
                                                                <Download className="h-4.5 w-4.5" />
                                                            </a>
                                                        </div>
                                                    </div>
                                                )}

                                                {quest.submission_link && (
                                                    <div>
                                                        <strong className="mb-1 block text-[10px] tracking-wider text-slate-400 uppercase">
                                                            Tautan Demo
                                                            Pekerjaan
                                                        </strong>
                                                        <a
                                                            href={
                                                                quest.submission_link
                                                            }
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="font-semibold break-all text-indigo-500 hover:underline"
                                                        >
                                                            {
                                                                quest.submission_link
                                                            }
                                                        </a>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* TAB 3: BIDS / CANDIDATES */}
                            {activeTab === 'bids' && (
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
                                                Siswa belum mengajukan proposal
                                                penawaran untuk quest ini.
                                            </p>
                                        </div>
                                    ) : (
                                        <div className="grid max-h-[750px] grid-cols-1 gap-4 overflow-y-auto pr-1 sm:grid-cols-2">
                                            {bids.map((bid) => (
                                                <div
                                                    key={bid._id}
                                                    className={`flex flex-col justify-between gap-3.5 rounded-xl border p-4 transition-all duration-300 ${
                                                        bid.status ===
                                                        'accepted'
                                                            ? 'border-green-500/35 bg-green-500/10 dark:border-green-500/20'
                                                            : bid.status ===
                                                                'rejected'
                                                              ? 'border-slate-200/50 bg-slate-100/50 opacity-65 dark:border-slate-800/40 dark:bg-[#111425]'
                                                              : 'border-slate-200 bg-slate-50/50 hover:border-purple-500/50 dark:border-slate-800/60 dark:bg-black/20'
                                                    }`}
                                                >
                                                    <div className="space-y-3 font-['Oxanium']">
                                                        <div className="flex items-start justify-between gap-3">
                                                            <div className="flex min-w-0 items-center gap-2.5">
                                                                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-tr from-indigo-500 to-purple-600 text-xs font-bold text-white">
                                                                    {bid.student.name
                                                                        .substring(
                                                                            0,
                                                                            2,
                                                                        )
                                                                        .toUpperCase()}
                                                                </div>
                                                                <div className="min-w-0">
                                                                    <span className="block truncate text-xs font-extrabold text-slate-800 dark:text-white">
                                                                        {
                                                                            bid
                                                                                .student
                                                                                .name
                                                                        }
                                                                    </span>
                                                                    <span className="block truncate text-[10px] text-slate-400">
                                                                        {
                                                                            bid
                                                                                .student
                                                                                .email
                                                                        }
                                                                    </span>
                                                                </div>
                                                            </div>
                                                            <span className="ml-1 shrink-0 font-['Orbitron'] text-xs font-black text-purple-600 dark:text-purple-300">
                                                                {formatCurrency(
                                                                    bid.bid_amount,
                                                                )}
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
                                                                    href={
                                                                        bid.cv.startsWith(
                                                                            'http',
                                                                        )
                                                                            ? bid.cv
                                                                            : '#'
                                                                    }
                                                                    target="_blank"
                                                                    rel="noopener noreferrer"
                                                                    className="flex-1 truncate rounded bg-slate-100 py-1 text-center text-[10px] font-bold text-slate-600 hover:bg-slate-200 dark:bg-slate-800/50 dark:text-indigo-300 dark:hover:bg-slate-800"
                                                                >
                                                                    CV Link
                                                                </a>
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
                                                                    className="flex-1 truncate rounded bg-slate-100 py-1 text-center text-[10px] font-bold text-slate-600 hover:bg-slate-200 dark:bg-slate-800/50 dark:text-indigo-300 dark:hover:bg-slate-800"
                                                                >
                                                                    Portfolio
                                                                </a>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div className="flex w-full gap-2 pt-1">
                                                        {canAccept &&
                                                            bid.status ===
                                                                'pending' && (
                                                                <button
                                                                    onClick={() =>
                                                                        handleAcceptBid(
                                                                            bid._id,
                                                                        )
                                                                    }
                                                                    className="flex-1 animate-pulse cursor-pointer rounded-lg bg-green-600 py-1.5 font-['Orbitron'] text-[10px] font-bold tracking-wider text-white uppercase shadow-sm transition-all duration-300 hover:bg-green-700"
                                                                >
                                                                    Terima
                                                                </button>
                                                            )}
                                                        <button
                                                            onClick={() =>
                                                                handleDeleteBid(
                                                                    bid._id,
                                                                )
                                                            }
                                                            className="flex shrink-0 cursor-pointer items-center justify-center rounded-lg bg-slate-100 px-2.5 py-1.5 text-slate-500 transition-colors hover:bg-red-500/10 hover:text-red-500 dark:bg-slate-800 dark:hover:bg-red-950/20"
                                                            title="Hapus Bid Penawaran"
                                                        >
                                                            <Trash2 size={12} />
                                                        </button>
                                                        <button
                                                            onClick={() =>
                                                                setSelectedChatBid(
                                                                    {
                                                                        id: bid._id,
                                                                        name: bid
                                                                            .student
                                                                            .name,
                                                                    },
                                                                )
                                                            }
                                                            className="relative flex-1 cursor-pointer rounded-lg bg-indigo-600 py-1.5 font-['Orbitron'] text-[10px] font-bold tracking-wider text-white uppercase shadow-sm transition-all duration-300 hover:bg-indigo-700"
                                                        >
                                                            Chat
                                                            {bid.unread_messages_count >
                                                                0 && (
                                                                <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5 animate-pulse items-center justify-center rounded-full bg-red-500 text-[8px] font-black text-white ring-2 ring-white dark:ring-slate-900">
                                                                    {
                                                                        bid.unread_messages_count
                                                                    }
                                                                </span>
                                                            )}
                                                        </button>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* TAB 4: ARBITRATION & CONTROL */}
                            {activeTab === 'arbitration' && (
                                <div className="space-y-6">
                                    {/* Action Control Panel */}
                                    <div className="space-y-6 rounded-2xl border border-slate-200 bg-white/70 p-6 shadow-md backdrop-blur-md transition-all duration-300 dark:border-slate-800/80 dark:bg-[#0c122c]/40">
                                        <div className="flex items-center justify-between border-b border-slate-100 pb-3 dark:border-slate-800">
                                            <h3 className="flex items-center gap-2 font-['Orbitron'] text-sm font-bold tracking-wider text-slate-800 uppercase dark:text-blue-200">
                                                <TrendingUp
                                                    size={16}
                                                    className="text-indigo-500"
                                                />
                                                Pusat Kontrol Administratif
                                            </h3>
                                        </div>

                                        <div className="grid grid-cols-1 gap-6 font-['Oxanium'] md:grid-cols-2">
                                            {/* Extend Deadline Form */}
                                            <form
                                                onSubmit={handleExtendDeadline}
                                                className="space-y-4 rounded-xl border border-slate-100 bg-slate-50/50 p-4 dark:border-slate-800/50 dark:bg-black/20"
                                            >
                                                <h4 className="font-['Orbitron'] text-xs font-bold tracking-wider text-slate-700 uppercase dark:text-slate-300">
                                                    Perpanjang Tenggat Waktu
                                                </h4>
                                                <p className="text-[11px] text-slate-400">
                                                    Ubah batas akhir pengiriman
                                                    untuk memberikan waktu
                                                    tambahan kepada pekerja.
                                                </p>
                                                <div className="space-y-2">
                                                    <input
                                                        type="datetime-local"
                                                        value={
                                                            extendDeadlineForm
                                                                .data.deadline
                                                        }
                                                        onChange={(e) =>
                                                            extendDeadlineForm.setData(
                                                                'deadline',
                                                                e.target.value,
                                                            )
                                                        }
                                                        className="text-slate-850 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs focus:border-indigo-500 focus:outline-none dark:border-slate-800 dark:bg-[#0c122c] dark:text-white"
                                                    />
                                                    {extendDeadlineForm.errors
                                                        .deadline && (
                                                        <p className="text-xs font-semibold text-red-500">
                                                            {
                                                                extendDeadlineForm
                                                                    .errors
                                                                    .deadline
                                                            }
                                                        </p>
                                                    )}
                                                </div>
                                                <button
                                                    type="submit"
                                                    disabled={
                                                        extendDeadlineForm.processing
                                                    }
                                                    className="w-full cursor-pointer rounded-xl bg-indigo-600 py-2 font-['Orbitron'] text-xs font-bold tracking-wider text-white uppercase transition-colors hover:bg-indigo-700 disabled:opacity-50"
                                                >
                                                    {extendDeadlineForm.processing
                                                        ? 'Memperbarui...'
                                                        : 'Perpanjang Deadline'}
                                                </button>
                                            </form>

                                            {/* Quick Recovery Actions */}
                                            <div className="flex flex-col justify-between space-y-4 rounded-xl border border-slate-100 bg-slate-50/50 p-4 dark:border-slate-800/50 dark:bg-black/20">
                                                <div>
                                                    <h4 className="font-['Orbitron'] text-xs font-bold tracking-wider text-slate-700 uppercase dark:text-slate-300">
                                                        Tindakan Pemulihan Cepat
                                                    </h4>
                                                    <p className="mt-1 text-[11px] text-slate-400">
                                                        Gunakan opsi di bawah
                                                        ini jika terjadi
                                                        kemacetan pengerjaan
                                                        atau perselisihan
                                                        sepihak.
                                                    </p>
                                                </div>
                                                <div className="grid grid-cols-1 gap-2 pt-2">
                                                    <button
                                                        type="button"
                                                        onClick={
                                                            handleReopenBidding
                                                        }
                                                        className="w-full cursor-pointer rounded-xl border border-amber-500/20 bg-amber-500/10 py-2.5 text-center font-['Orbitron'] text-xs font-bold tracking-wider text-amber-600 uppercase transition-all hover:bg-amber-500/20 dark:text-amber-300"
                                                    >
                                                        Buka Kembali Bidding
                                                    </button>
                                                    <button
                                                        type="button"
                                                        onClick={
                                                            handleForceCancel
                                                        }
                                                        className="w-full cursor-pointer rounded-xl border border-red-500/20 bg-red-500/10 py-2.5 text-center font-['Orbitron'] text-xs font-bold tracking-wider text-red-600 uppercase transition-all hover:bg-red-500/20 dark:text-red-300"
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
                                            <h3 className="flex items-center gap-2 font-['Orbitron'] text-sm font-bold tracking-wider text-slate-800 uppercase dark:text-blue-200">
                                                <ShieldAlert
                                                    size={16}
                                                    className="text-red-500"
                                                />
                                                Arbitrase Penyelidikan &
                                                Sengketa
                                            </h3>
                                            <span
                                                className={`rounded px-2 py-0.5 text-[10px] font-bold uppercase ${
                                                    quest.status === 'disputed'
                                                        ? 'text-red-650 dark:text-red-405 animate-pulse border border-red-500/20 bg-red-500/10'
                                                        : quest.dispute?.status?.startsWith(
                                                                'resolved',
                                                            )
                                                          ? 'border border-green-500/20 bg-green-500/10 text-green-600 dark:text-green-400'
                                                          : 'bg-slate-100 text-slate-400 dark:bg-slate-800'
                                                }`}
                                            >
                                                {quest.status === 'disputed'
                                                    ? 'Dispute Aktif'
                                                    : quest.dispute?.status?.startsWith(
                                                            'resolved',
                                                        )
                                                      ? 'Selesai'
                                                      : 'Tidak Ada Sengketa'}
                                            </span>
                                        </div>

                                        {quest.dispute ? (
                                            <div className="space-y-6 font-['Oxanium']">
                                                <div className="space-y-2 rounded-xl border border-red-200/20 bg-red-500/5 p-4 dark:border-red-500/10 dark:bg-red-950/10">
                                                    <div className="flex items-center justify-between text-xs font-semibold text-slate-500 dark:text-slate-400">
                                                        <span>
                                                            Diajukan oleh:{' '}
                                                            <strong className="text-slate-700 dark:text-white">
                                                                {
                                                                    quest
                                                                        .dispute
                                                                        .filer_name
                                                                }
                                                            </strong>
                                                        </span>
                                                        <span>
                                                            Tanggal:{' '}
                                                            {quest.dispute
                                                                .ruled_at
                                                                ? formatDate(
                                                                      quest
                                                                          .dispute
                                                                          .ruled_at,
                                                                  )
                                                                : 'Baru saja'}
                                                        </span>
                                                    </div>
                                                    <p className="text-slate-650 dark:text-red-305 rounded-lg border border-slate-100 bg-white/40 p-3 text-xs italic dark:border-red-500/5 dark:bg-black/10">
                                                        "{quest.dispute.reason}"
                                                    </p>
                                                </div>

                                                {quest.dispute.status?.startsWith(
                                                    'resolved',
                                                ) ? (
                                                    <div className="space-y-3 rounded-xl border border-green-200/20 bg-green-500/5 p-4 dark:border-green-500/10 dark:bg-green-950/10">
                                                        <h4 className="font-['Orbitron'] text-xs font-bold text-green-600 uppercase dark:text-green-400">
                                                            Keputusan Arbitrase
                                                            Admin
                                                        </h4>
                                                        <div className="grid grid-cols-2 gap-4 text-xs">
                                                            <div>
                                                                <span className="block text-[10px] font-bold text-slate-400 uppercase">
                                                                    Ruling
                                                                </span>
                                                                <span className="font-bold text-slate-800 uppercase dark:text-white">
                                                                    {[
                                                                        'refund',
                                                                        'refund_creator',
                                                                    ].includes(
                                                                        quest
                                                                            .dispute
                                                                            .ruling ??
                                                                            '',
                                                                    ) &&
                                                                        'Pembatalan Quest & Reward'}
                                                                    {[
                                                                        'pay_worker',
                                                                        'release_payout',
                                                                    ].includes(
                                                                        quest
                                                                            .dispute
                                                                            .ruling ??
                                                                            '',
                                                                    ) &&
                                                                        'Bayar Reward Penuh Ke Pekerja'}
                                                                    {quest
                                                                        .dispute
                                                                        .ruling ===
                                                                        'split' &&
                                                                        `Bagi Hasil (${quest.dispute.split_percentage}% Pekerja)`}
                                                                </span>
                                                            </div>
                                                            {quest.dispute
                                                                .split_percentage !==
                                                                undefined && (
                                                                <div>
                                                                    <span className="block text-[10px] font-bold text-slate-400 uppercase">
                                                                        Split
                                                                        Persentase
                                                                    </span>
                                                                    <span className="font-bold text-slate-800 dark:text-white">
                                                                        {
                                                                            quest
                                                                                .dispute
                                                                                .split_percentage
                                                                        }
                                                                        %
                                                                        Pekerja
                                                                        /{' '}
                                                                        {100 -
                                                                            (quest
                                                                                .dispute
                                                                                .split_percentage ??
                                                                                0)}
                                                                        %
                                                                        Pembuat
                                                                    </span>
                                                                </div>
                                                            )}
                                                        </div>
                                                        <div className="border-t border-green-500/10 pt-2 text-xs">
                                                            <span className="mb-1 block text-[10px] font-bold text-slate-400 uppercase">
                                                                Catatan
                                                                Keputusan
                                                            </span>
                                                            <p className="font-medium text-slate-600 italic dark:text-green-300">
                                                                "
                                                                {
                                                                    quest
                                                                        .dispute
                                                                        .note
                                                                }
                                                                "
                                                            </p>
                                                        </div>
                                                    </div>
                                                ) : (
                                                    <form
                                                        onSubmit={
                                                            handleArbitrate
                                                        }
                                                        className="space-y-4 rounded-xl border border-slate-100 bg-slate-50/50 p-4 dark:border-slate-800/50 dark:bg-black/20"
                                                    >
                                                        <h4 className="dark:text-slate-350 font-['Orbitron'] text-xs font-bold tracking-wider text-slate-800 uppercase">
                                                            Formulir
                                                            Penyelesaian
                                                            Sengketa (Verdict)
                                                        </h4>

                                                        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                                                            <label
                                                                className={`cursor-pointer rounded-xl border p-3 text-center transition-all ${
                                                                    arbitrateForm
                                                                        .data
                                                                        .ruling ===
                                                                    'refund'
                                                                        ? 'text-red-650 border-red-500 bg-red-500/10 font-bold shadow-sm dark:text-red-300'
                                                                        : 'border-slate-200 bg-white text-slate-500 dark:border-slate-800 dark:bg-[#0c122c]'
                                                                }`}
                                                            >
                                                                <input
                                                                    type="radio"
                                                                    name="ruling"
                                                                    value="refund"
                                                                    checked={
                                                                        arbitrateForm
                                                                            .data
                                                                            .ruling ===
                                                                        'refund'
                                                                    }
                                                                    onChange={() =>
                                                                        arbitrateForm.setData(
                                                                            'ruling',
                                                                            'refund',
                                                                        )
                                                                    }
                                                                    className="sr-only"
                                                                />
                                                                <span className="block font-['Orbitron'] text-xs uppercase">
                                                                    Batalkan Reward
                                                                </span>
                                                                <span className="mt-0.5 block text-[10px] text-slate-400">
                                                                    100% reward dibatalkan
                                                                </span>
                                                            </label>

                                                            <label
                                                                className={`cursor-pointer rounded-xl border p-3 text-center transition-all ${
                                                                    arbitrateForm
                                                                        .data
                                                                        .ruling ===
                                                                    'pay_worker'
                                                                        ? 'border-green-500 bg-green-500/10 font-bold text-green-600 shadow-sm dark:text-green-300'
                                                                        : 'border-slate-200 bg-white text-slate-500 dark:border-slate-800 dark:bg-[#0c122c]'
                                                                }`}
                                                            >
                                                                <input
                                                                    type="radio"
                                                                    name="ruling"
                                                                    value="pay_worker"
                                                                    checked={
                                                                        arbitrateForm
                                                                            .data
                                                                            .ruling ===
                                                                        'pay_worker'
                                                                    }
                                                                    onChange={() =>
                                                                        arbitrateForm.setData(
                                                                            'ruling',
                                                                            'pay_worker',
                                                                        )
                                                                    }
                                                                    className="sr-only"
                                                                />
                                                                <span className="block font-['Orbitron'] text-xs uppercase">
                                                                    Bayar
                                                                    Pekerja
                                                                </span>
                                                                <span className="mt-0.5 block text-[10px] text-slate-400">
                                                                    100% reward ke
                                                                    pekerja
                                                                </span>
                                                            </label>

                                                            <label
                                                                className={`cursor-pointer rounded-xl border p-3 text-center transition-all ${
                                                                    arbitrateForm
                                                                        .data
                                                                        .ruling ===
                                                                    'split'
                                                                        ? 'border-indigo-500 bg-indigo-500/10 font-bold text-indigo-600 shadow-sm dark:text-indigo-300'
                                                                        : 'border-slate-200 bg-white text-slate-500 dark:border-slate-800 dark:bg-[#0c122c]'
                                                                }`}
                                                            >
                                                                <input
                                                                    type="radio"
                                                                    name="ruling"
                                                                    value="split"
                                                                    checked={
                                                                        arbitrateForm
                                                                            .data
                                                                            .ruling ===
                                                                        'split'
                                                                    }
                                                                    onChange={() =>
                                                                        arbitrateForm.setData(
                                                                            'ruling',
                                                                            'split',
                                                                        )
                                                                    }
                                                                    className="sr-only"
                                                                />
                                                                <span className="block font-['Orbitron'] text-xs uppercase">
                                                                    Bagi Hasil
                                                                </span>
                                                                <span className="mt-0.5 block text-[10px] text-slate-400">
                                                                    Bagi dengan
                                                                    rasio custom
                                                                </span>
                                                            </label>
                                                        </div>

                                                        {arbitrateForm.data
                                                            .ruling ===
                                                            'split' && (
                                                            <div className="animate-fadeIn space-y-1.5">
                                                                <label className="text-[10px] font-bold text-slate-400 uppercase">
                                                                    Persentase
                                                                    untuk
                                                                    Pekerja (%){' '}
                                                                    <span className="text-red-500">
                                                                        *
                                                                    </span>
                                                                </label>
                                                                <input
                                                                    type="number"
                                                                    min="1"
                                                                    max="99"
                                                                    value={
                                                                        arbitrateForm
                                                                            .data
                                                                            .split_percentage
                                                                    }
                                                                    onChange={(
                                                                        e,
                                                                    ) =>
                                                                        arbitrateForm.setData(
                                                                            'split_percentage',
                                                                            parseInt(
                                                                                e
                                                                                    .target
                                                                                    .value,
                                                                            ) ||
                                                                                50,
                                                                        )
                                                                    }
                                                                    className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 font-['Orbitron'] text-xs text-slate-800 focus:border-indigo-500 focus:outline-none dark:border-slate-800 dark:bg-[#0c122c] dark:text-white"
                                                                />
                                                                <span className="mt-0.5 block text-[10px] text-slate-400">
                                                                     Sisa (
                                                                     {100 -
                                                                         arbitrateForm
                                                                             .data
                                                                             .split_percentage}
                                                                     %) dari
                                                                     reward
                                                                     dibatalkan/tidak
                                                                     dicairkan.
                                                                 </span>
                                                                {arbitrateForm
                                                                    .errors
                                                                    .split_percentage && (
                                                                    <p className="text-xs font-semibold text-red-500">
                                                                        {
                                                                            arbitrateForm
                                                                                .errors
                                                                                .split_percentage
                                                                        }
                                                                    </p>
                                                                )}
                                                            </div>
                                                        )}

                                                        <div className="space-y-1.5">
                                                            <label className="text-[10px] font-bold text-slate-400 uppercase">
                                                                Catatan
                                                                Keputusan /
                                                                Alasan Arbitrase{' '}
                                                                <span className="text-red-500">
                                                                    *
                                                                </span>
                                                            </label>
                                                            <textarea
                                                                required
                                                                placeholder="Berikan penjelasan atau dasar dari keputusan arbitrase Anda..."
                                                                rows={3}
                                                                value={
                                                                    arbitrateForm
                                                                        .data
                                                                        .note
                                                                }
                                                                onChange={(e) =>
                                                                    arbitrateForm.setData(
                                                                        'note',
                                                                        e.target
                                                                            .value,
                                                                    )
                                                                }
                                                                className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs text-slate-800 focus:border-indigo-500 focus:outline-none dark:border-slate-800 dark:bg-[#0c122c] dark:text-white"
                                                            />
                                                            {arbitrateForm
                                                                .errors
                                                                .note && (
                                                                <p className="text-xs font-semibold text-red-500">
                                                                    {
                                                                        arbitrateForm
                                                                            .errors
                                                                            .note
                                                                    }
                                                                </p>
                                                            )}
                                                        </div>

                                                        <button
                                                            type="submit"
                                                            disabled={
                                                                arbitrateForm.processing
                                                            }
                                                            className="bg-red-650 hover:bg-red-750 w-full cursor-pointer rounded-xl py-2.5 font-['Orbitron'] text-xs font-bold tracking-wider text-white uppercase shadow-lg transition-all disabled:opacity-50"
                                                        >
                                                            {arbitrateForm.processing
                                                                ? 'Memproses Keputusan...'
                                                                : 'Kirim Verdict Arbitrase'}
                                                        </button>
                                                    </form>
                                                )}
                                            </div>
                                        ) : (
                                            <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50/50 py-8 text-center font-['Oxanium'] text-slate-400 dark:border-slate-800 dark:bg-black/10 dark:text-blue-300/30">
                                                <ShieldAlert className="mx-auto mb-2 h-8 w-8 text-slate-400 opacity-40" />
                                                <p className="font-['Orbitron'] text-xs font-bold uppercase">
                                                    Tidak Ada Sengketa Aktif
                                                </p>
                                                <p className="text-[10px] text-slate-500">
                                                    Quest ini berjalan dengan
                                                    normal dan tidak berada
                                                    dalam status
                                                    banding/dispute.
                                                </p>
                                            </div>
                                        )}
                                    </div>

                                    {/* Quest Transaction Ledger */}
                                    <div className="space-y-5 rounded-2xl border border-slate-200 bg-white/70 p-6 shadow-md backdrop-blur-md transition-all duration-300 dark:border-slate-800/80 dark:bg-[#0c122c]/40">
                                        <div className="flex items-center justify-between border-b border-slate-100 pb-3 dark:border-slate-800">
                                            <h3 className="flex items-center gap-2 font-['Orbitron'] text-sm font-bold tracking-wider text-slate-800 uppercase dark:text-blue-200">
                                                <FolderGit
                                                    size={16}
                                                    className="text-purple-500"
                                                />
                                                Buku Besar Transaksi Koin Gold
                                                (Quest Ledger)
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
                                                    Belum ada transaksi
                                                    dana/escrow koin Gold yang
                                                    tercatat pada quest ini.
                                                </p>
                                            </div>
                                        ) : (
                                            <div className="overflow-x-auto">
                                                <table className="w-full border-collapse text-left font-['Oxanium'] text-xs">
                                                    <thead>
                                                        <tr className="border-b border-slate-100 text-[10px] font-bold text-slate-400 uppercase dark:border-slate-800/80">
                                                            <th className="py-2.5">
                                                                Tanggal
                                                            </th>
                                                            <th className="py-2.5">
                                                                Tipe
                                                            </th>
                                                            <th className="py-2.5">
                                                                Pihak Terkait
                                                            </th>
                                                            <th className="py-2.5">
                                                                Jumlah
                                                            </th>
                                                            <th className="py-2.5">
                                                                Deskripsi
                                                            </th>
                                                        </tr>
                                                    </thead>
                                                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800/50">
                                                        {transactions.map(
                                                            (t) => (
                                                                <tr
                                                                    key={t._id}
                                                                    className="hover:bg-slate-50/50 dark:hover:bg-black/10"
                                                                >
                                                                    <td className="py-2.5 font-semibold text-slate-500 dark:text-slate-400">
                                                                        {formatDate(
                                                                            t.created_at,
                                                                        )}
                                                                    </td>
                                                                    <td className="py-2.5 text-[10px] font-bold uppercase">
                                                                        <span
                                                                            className={`rounded px-2 py-0.5 ${
                                                                                t.type ===
                                                                                'hold_escrow'
                                                                                    ? 'border border-amber-500/20 bg-amber-500/10 text-amber-600 dark:text-amber-300'
                                                                                    : t.type ===
                                                                                        'release_payout'
                                                                                      ? 'dark:text-green-350 border border-green-500/20 bg-green-500/10 text-green-600'
                                                                                      : 'text-indigo-650 dark:text-indigo-350 border border-indigo-500/20 bg-indigo-500/10'
                                                                            }`}
                                                                        >
                                                                            {t.type ===
                                                                                'hold_escrow' &&
                                                                                'Hold Escrow'}
                                                                            {t.type ===
                                                                                'release_payout' &&
                                                                                'Release Payout'}
                                                                            {t.type ===
                                                                                'refund_escrow' &&
                                                                                'Refund Escrow'}
                                                                            {![
                                                                                'hold_escrow',
                                                                                'release_payout',
                                                                                'refund_escrow',
                                                                            ].includes(
                                                                                t.type,
                                                                            ) &&
                                                                                t.type}
                                                                        </span>
                                                                    </td>
                                                                    <td className="dark:text-slate-350 py-2.5 font-semibold text-slate-700">
                                                                        {t.user
                                                                            ?.name ??
                                                                            'Sistem / Escrow'}
                                                                    </td>
                                                                    <td className="py-2.5 font-['Orbitron'] font-black text-amber-500">
                                                                        {t.amount >
                                                                        0
                                                                            ? `+${t.amount}`
                                                                            : t.amount}{' '}
                                                                        G
                                                                    </td>
                                                                    <td className="dark:text-slate-450 py-2.5 text-slate-500 italic">
                                                                        {
                                                                            t.description
                                                                        }
                                                                    </td>
                                                                </tr>
                                                            ),
                                                        )}
                                                    </tbody>
                                                </table>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* RIGHT COLUMN: SIDEBAR METADATA INFO (lg:col-span-4) */}
                        <div className="space-y-6 lg:col-span-4">
                            {/* QUEST METADATA DETAILS */}
                            <div className="space-y-5 rounded-2xl border border-slate-200 bg-white/70 p-6 font-['Oxanium'] shadow-md backdrop-blur-md transition-all duration-300 dark:border-slate-800/80 dark:bg-[#0c122c]/40">
                                <h3 className="border-b border-slate-100 pb-3 font-['Orbitron'] text-xs font-bold tracking-wider text-slate-700 uppercase dark:border-slate-800 dark:text-blue-200">
                                    Rincian Quest
                                </h3>

                                <div className="space-y-4">
                                    {/* Creator info */}
                                    <div className="flex items-center gap-3">
                                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-indigo-500/20 bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
                                            <User className="h-5 w-5" />
                                        </div>
                                        <div>
                                            <span className="block text-[10px] font-semibold tracking-wider text-slate-400 uppercase">
                                                Diposting Oleh
                                            </span>
                                            <span className="text-xs font-bold text-slate-800 sm:text-sm dark:text-white">
                                                {quest.creator.name}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Budget spec */}
                                    <div className="flex items-center gap-3">
                                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-purple-500/20 bg-purple-500/10 text-purple-600 dark:text-purple-400">
                                            <DollarSign className="h-5 w-5" />
                                        </div>
                                        <div>
                                            <span className="block text-[10px] font-semibold tracking-wider text-slate-400 uppercase">
                                                Gaji / Anggaran
                                            </span>
                                            <span className="font-['Orbitron'] text-sm font-bold text-slate-800 dark:text-white">
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

                                    {/* Deadline Spec */}
                                    <div className="flex items-center gap-3">
                                        <div className="text-indigo-650 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-indigo-500/20 bg-indigo-500/10 dark:text-indigo-400">
                                            <Calendar className="h-5 w-5" />
                                        </div>
                                        <div>
                                            <span className="block text-[10px] font-semibold tracking-wider text-slate-400 uppercase">
                                                Tenggat Waktu
                                            </span>
                                            <span className="text-xs font-bold text-slate-800 sm:text-sm dark:text-white">
                                                {formatDate(quest.deadline)}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                {/* RPG Rewards */}
                                <div className="space-y-3 border-t border-slate-100 pt-4 dark:border-slate-800">
                                    <span className="dark:text-purple-450 block font-['Orbitron'] text-[10px] font-bold tracking-wider text-purple-600 uppercase">
                                        🎁 RPG Quest Rewards
                                    </span>

                                    <div className="grid grid-cols-3 gap-2 text-center font-['Orbitron'] text-xs font-bold">
                                        <div className="text-purple-605 flex flex-col items-center rounded-xl border border-purple-500/20 bg-purple-500/10 py-2.5 transition-transform hover:scale-[1.03] dark:text-purple-300">
                                            <Award className="mb-1 h-3.5 w-3.5 text-purple-500" />
                                            <span className="font-['Oxanium'] text-[9px] font-semibold text-slate-400">
                                                EXP
                                            </span>
                                            <span className="text-[11px] font-black">
                                                +250
                                            </span>
                                        </div>
                                        <div className="flex flex-col items-center rounded-xl border border-amber-500/20 bg-amber-500/10 py-2.5 text-amber-600 transition-transform hover:scale-[1.03] dark:text-amber-400">
                                            <Award className="mb-1 h-3.5 w-3.5 text-amber-500" />
                                            <span className="font-['Oxanium'] text-[9px] font-semibold text-slate-400">
                                                GOLD
                                            </span>
                                            <span className="text-[11px] font-black">
                                                +150
                                            </span>
                                        </div>
                                        <div className="dark:text-indigo-305 flex flex-col items-center rounded-xl border border-indigo-500/20 bg-indigo-500/10 py-2.5 text-indigo-600 transition-transform hover:scale-[1.03]">
                                            <Award className="mb-1 h-3.5 w-3.5 text-indigo-500" />
                                            <span className="font-['Oxanium'] text-[9px] font-semibold text-slate-400">
                                                ERP
                                            </span>
                                            <span className="text-[11px] font-black">
                                                +100
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* WORKER SUMMARY (Right column status card) */}
                            {quest.worker && (
                                <div className="flex items-center justify-between gap-3 rounded-xl border border-emerald-500/20 bg-emerald-500/10 p-4 font-['Oxanium'] shadow-sm">
                                    <div className="flex min-w-0 items-center gap-2.5">
                                        <CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-500" />
                                        <div className="min-w-0">
                                            <span className="block text-[8px] font-semibold tracking-wider text-slate-400 uppercase">
                                                Status Pekerja
                                            </span>
                                            <span className="block truncate text-xs font-bold text-slate-800 dark:text-white">
                                                {quest.worker.name}
                                            </span>
                                        </div>
                                    </div>
                                    <span className="shrink-0 rounded bg-emerald-500/20 px-2 py-0.5 font-['Orbitron'] text-[9px] font-bold text-emerald-600 uppercase dark:text-emerald-400">
                                        Aktif
                                    </span>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Image Preview Modal */}
            {previewImage && (
                <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
                    <div
                        onClick={() => setPreviewImage(null)}
                        className="absolute inset-0 cursor-pointer bg-black/80 backdrop-blur-md transition-all"
                    />

                    <div className="relative z-10 flex max-h-[85vh] w-full max-w-4xl flex-col items-center overflow-hidden rounded-2xl border border-white/10 bg-slate-900/90 p-4 font-['Oxanium'] shadow-2xl dark:bg-slate-950/95">
                        <div className="mb-3 flex w-full items-center justify-between border-b border-white/10 pb-2">
                            <span className="max-w-xs truncate text-sm font-bold text-white sm:max-w-md">
                                {previewImage.name}
                            </span>
                            <button
                                onClick={() => setPreviewImage(null)}
                                className="flex h-7 w-7 cursor-pointer items-center justify-center rounded-lg text-slate-400 transition-colors hover:bg-white/10 hover:text-white"
                            >
                                ✕
                            </button>
                        </div>

                        <div className="flex min-h-0 w-full flex-1 items-center justify-center">
                            <img
                                src={previewImage.url}
                                alt={previewImage.name}
                                className="max-h-[70vh] max-w-full rounded-lg object-contain shadow-md"
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
                        router.post(
                            `/admin/quests/${quest._id}/accept-bid/${acceptBidId}`,
                        );
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
                        router.delete(
                            `/admin/quests/${quest._id}/bids/${deleteBidId}`,
                        );
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
                        className="absolute inset-0 cursor-pointer bg-black/60 backdrop-blur-sm"
                    />
                    <div className="relative z-10 w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 font-['Oxanium'] shadow-2xl dark:border-slate-800 dark:bg-slate-900">
                        <h3 className="dark:text-red-405 mb-2 font-['Orbitron'] text-base font-bold tracking-wider text-slate-800 uppercase sm:text-lg">
                            Tolak Quest
                        </h3>
                        <p className="mb-4 text-xs text-slate-500 dark:text-slate-400">
                            Berikan umpan balik atau alasan penolakan agar
                            pembuat quest tahu apa yang harus diperbaiki.
                        </p>

                        <form onSubmit={handleRejectPost} className="space-y-4">
                            <div className="space-y-1.5">
                                <label className="text-[10px] font-bold text-slate-500 uppercase dark:text-slate-400">
                                    Catatan Penolakan{' '}
                                    <span className="text-red-500">*</span>
                                </label>
                                <textarea
                                    required
                                    placeholder="Tulis alasan penolakan quest disini..."
                                    rows={4}
                                    value={rejectPostForm.data.rejection_note}
                                    onChange={(e) =>
                                        rejectPostForm.setData(
                                            'rejection_note',
                                            e.target.value,
                                        )
                                    }
                                    className="bg-slate-55 w-full rounded-xl border border-slate-200 px-3 py-2 text-xs text-slate-800 focus:border-red-500 focus:outline-none dark:border-slate-800 dark:bg-black/20 dark:text-white"
                                />
                                {rejectPostForm.errors.rejection_note && (
                                    <p className="text-xs font-semibold text-red-500">
                                        {rejectPostForm.errors.rejection_note}
                                    </p>
                                )}
                            </div>

                            <div className="flex justify-end gap-2 pt-2">
                                <button
                                    type="button"
                                    onClick={() => setShowRejectPostForm(false)}
                                    className="cursor-pointer rounded-xl bg-slate-100 px-4 py-2 text-xs font-semibold text-slate-700 uppercase transition-all hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
                                >
                                    Batal
                                </button>
                                <button
                                    type="submit"
                                    disabled={rejectPostForm.processing}
                                    className="bg-red-650 hover:bg-red-750 cursor-pointer rounded-xl px-4 py-2 font-['Orbitron'] text-xs font-semibold text-white uppercase transition-all disabled:opacity-50"
                                >
                                    {rejectPostForm.processing
                                        ? 'Mengirim...'
                                        : 'Tolak Quest'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </AppLayout>
    );
}
