import { useForm, Link, router, usePage } from '@inertiajs/react';
import React, { useState } from 'react';
import {
    ArrowLeft,
    Send,
    Check,
    Calendar,
    DollarSign,
    Briefcase,
    FileText,
    User,
    Star,
    Paperclip,
    Download,
    Image as ImageIcon,
    FileArchive,
    CheckCircle2,
    MessageSquare,
    Eye,
    EyeOff,
    Clock,
    Award,
    ShieldAlert,
} from 'lucide-react';
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
        role: string;
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
                <span className="block font-['Orbitron'] text-[10px] font-bold tracking-wider text-red-600 uppercase dark:text-red-400">
                    ⚠️ {mainLabel}
                </span>
                <p className="dark:text-slate-350 mt-1 text-xs leading-relaxed whitespace-pre-wrap text-slate-600 italic">
                    "{latestRevision.note}"
                </p>
                <div className="text-slate-450 mt-1 flex items-center gap-1 font-sans text-[9px] dark:text-slate-500">
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

interface Props {
    quest: Quest;
    bids: Bid[];
    myBid: Bid | null;
    can: {
        bid: boolean;
        accept: boolean;
    };
}

export default function Show({ quest, bids, myBid, can }: Props) {
    const { props } = usePage<any>();
    const currentUser = props.auth?.user;
    const isCreator = currentUser?.id === quest.creator_id;
    const isWorker = currentUser?.id === quest.worker_id;

    // Define initial active tab
    const [activeTab, setActiveTab] = useState<'detail' | 'project' | 'bids'>(
        isCreator && quest.status === 'open' ? 'bids' : 'detail',
    );
    const [selectedChatBid, setSelectedChatBid] = useState<{
        id: string;
        name: string;
    } | null>(null);
    const [previewImage, setPreviewImage] = useState<{
        url: string;
        name: string;
    } | null>(null);
    const [acceptBidId, setAcceptBidId] = useState<string | null>(null);
    const [shortlistedBidIds, setShortlistedBidIds] = useState<string[]>([]);
    const [archivedBidIds, setArchivedBidIds] = useState<string[]>([]);

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

    const handleAcceptBid = (bidId: string) => {
        setAcceptBidId(bidId);
    };

    const submissionForm = useForm<{
        submission_file: File | null;
        submission_link: string;
        submission_note: string;
    }>({
        submission_file: null,
        submission_link: '',
        submission_note: '',
    });

    const finalZipForm = useForm<{
        submission_file: File | null;
    }>({
        submission_file: null,
    });

    const handleFinalZipSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        finalZipForm.post(`/student/quests/${quest._id}/submit-final-zip`, {
            onSuccess: () => finalZipForm.reset(),
        });
    };

    const handleWorkSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        submissionForm.post(`/student/quests/${quest._id}/submit`, {
            onSuccess: () => submissionForm.reset(),
        });
    };

    const [showApproveForm, setShowApproveForm] = useState(false);
    const [showRejectForm, setShowRejectForm] = useState(false);

    const reviewForm = useForm({
        rating: 5,
        rating_comment: '',
        revision_note: '',
    });

    const submitApproval = (e: React.FormEvent) => {
        e.preventDefault();
        reviewForm.post(`/student/quests/${quest._id}/approve`, {
            onSuccess: () => {
                setShowApproveForm(false);
                reviewForm.reset();
            },
        });
    };

    const submitRejection = (e: React.FormEvent) => {
        e.preventDefault();
        reviewForm.post(`/student/quests/${quest._id}/reject`, {
            onSuccess: () => {
                setShowRejectForm(false);
                reviewForm.reset();
            },
        });
    };

    const [showDisputeModal, setShowDisputeModal] = useState(false);

    const disputeForm = useForm({
        reason: '',
    });

    const handleDisputeSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        disputeForm.post(`/student/quests/${quest._id}/dispute`, {
            onSuccess: () => {
                setShowDisputeModal(false);
                disputeForm.reset();
            },
        });
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

    // Calculate days remaining
    const calculateDaysRemaining = () => {
        const diff = new Date(quest.deadline).getTime() - new Date().getTime();
        const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
        return days > 0 ? `${days} Hari Tersisa` : 'Tenggat Waktu Habis';
    };

    return (
        <div className="relative flex min-h-screen flex-col overflow-x-hidden bg-slate-50 p-4 font-sans text-slate-800 transition-colors duration-300 sm:p-6 md:p-8 dark:bg-[#060813] dark:text-slate-100">
            {/* Ambient Background Glows */}
            <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
                <div className="absolute top-0 right-1/4 h-[500px] w-[500px] rounded-full bg-indigo-500/10 blur-[150px]" />
                <div className="absolute bottom-10 left-1/4 h-[400px] w-[400px] rounded-full bg-purple-500/10 blur-[150px]" />
            </div>

            <div className="z-10 mx-auto flex w-full max-w-7xl flex-1 flex-col gap-6">
                {/* 1. TOP HEADER & BREADCRUMB */}
                <div className="flex flex-col gap-4 border-b border-slate-200 pb-5 sm:flex-row sm:items-center sm:justify-between dark:border-slate-800/80">
                    <div className="space-y-1">
                        <Link
                            href="/student/quests"
                            className="inline-flex items-center gap-2 font-['Orbitron'] text-xs font-bold tracking-widest text-slate-500 uppercase transition-colors hover:text-indigo-600 dark:text-slate-400 dark:hover:text-indigo-400"
                        >
                            <ArrowLeft size={14} />
                            Kembali ke Board
                        </Link>
                        <h2 className="font-['Oxanium'] text-xl font-extrabold tracking-tight text-slate-900 sm:text-2xl md:text-3xl dark:text-white">
                            {quest.title}
                        </h2>
                    </div>

                    <div className="flex items-center gap-3">
                        <span
                            className={`rounded-xl border px-4 py-1.5 font-['Orbitron'] text-xs font-black tracking-wider uppercase ${
                                quest.status === 'open'
                                    ? 'border-emerald-500/20 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                                    : quest.status === 'draft'
                                      ? 'border-amber-500/20 bg-amber-500/10 text-amber-600 dark:text-amber-400'
                                      : quest.status === 'rejected'
                                        ? 'border-red-500/20 bg-red-500/10 text-red-600 dark:text-red-400'
                                        : quest.status === 'ongoing'
                                          ? 'border-indigo-500/20 bg-indigo-500/10 text-indigo-600 dark:text-indigo-400'
                                          : quest.status === 'approved'
                                            ? 'border-purple-500/20 bg-purple-500/10 text-purple-600 dark:text-purple-400'
                                            : quest.status === 'submitted'
                                              ? 'border-yellow-500/20 bg-yellow-500/10 text-yellow-600 dark:text-yellow-400'
                                              : 'border-slate-500/20 bg-slate-500/10 text-slate-600 dark:text-slate-400'
                            }`}
                        >
                            {quest.status === 'open'
                                ? 'Tersedia'
                                : quest.status === 'draft'
                                  ? 'Menunggu Review'
                                  : quest.status === 'rejected'
                                    ? 'Ditolak'
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

                {/* 2. OVERVIEW BANNER */}
                <div className="relative space-y-6 overflow-hidden rounded-2xl border border-slate-200 bg-gradient-to-br from-white to-slate-50/50 p-6 shadow-xl dark:border-[#1d2645] dark:from-[#0d1226]/85 dark:to-[#090d1a]/95">
                    {/* Banners */}
                    {quest.status === 'draft' && (
                        <div className="flex gap-3 rounded-xl border border-amber-500/25 bg-amber-500/10 p-4 font-['Oxanium']">
                            <Clock className="mt-0.5 h-5 w-5 shrink-0 text-amber-500" />
                            <div>
                                <span className="block font-['Orbitron'] text-xs font-bold tracking-wider text-amber-600 uppercase dark:text-amber-400">
                                    ⏳ Menunggu Persetujuan Admin
                                </span>
                                <p className="mt-1 text-xs leading-relaxed text-slate-500 dark:text-slate-300">
                                    Quest Anda telah berhasil diajukan and
                                    sedang menunggu moderasi/persetujuan dari
                                    pihak Admin sebelum dipublikasikan ke papan
                                    quest umum.
                                </p>
                            </div>
                        </div>
                    )}

                    {quest.status === 'rejected' && (
                        <div className="space-y-3 rounded-xl border border-red-500/25 bg-red-500/10 p-4 font-['Oxanium']">
                            <div className="flex gap-3">
                                <ShieldAlert className="mt-0.5 h-5 w-5 shrink-0 text-red-500" />
                                <div>
                                    <span className="block font-['Orbitron'] text-xs font-bold tracking-wider text-red-600 uppercase dark:text-red-400">
                                        ❌ Quest Ditolak Oleh Admin
                                    </span>
                                    <p className="mt-1 text-xs leading-relaxed text-slate-500 dark:text-slate-300">
                                        Pihak administrator telah menolak
                                        pengajuan quest ini. Anda dapat
                                        memperbaiki detail quest di bawah ini
                                        sesuai alasan penolakannya.
                                    </p>
                                </div>
                            </div>
                            {quest.rejection_note && (
                                <div className="rounded-lg border border-red-500/10 bg-red-500/5 p-3">
                                    <strong className="block font-['Orbitron'] text-[10px] tracking-wider text-red-500 uppercase">
                                        Alasan Penolakan:
                                    </strong>
                                    <p className="mt-1 text-xs leading-relaxed whitespace-pre-wrap text-slate-600 dark:text-slate-300">
                                        {quest.rejection_note}
                                    </p>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Stepper Progress Timeline */}
                    {quest.status !== 'draft' &&
                        quest.status !== 'rejected' && (
                            <div className="border-b border-slate-200/60 pb-4 font-['Orbitron'] text-[9px] font-bold tracking-wider sm:text-[10px] dark:border-slate-800/60">
                                <div className="relative flex items-center justify-between">
                                    <div className="absolute top-1/2 right-0 left-0 z-0 h-0.5 -translate-y-1/2 bg-slate-200 dark:bg-slate-800/80" />
                                    <div
                                        className="absolute top-1/2 left-0 z-0 h-0.5 -translate-y-1/2 bg-indigo-500 transition-all duration-300"
                                        style={{
                                            width:
                                                quest.status === 'open'
                                                    ? '0%'
                                                    : quest.status === 'ongoing'
                                                      ? '25%'
                                                      : quest.status ===
                                                          'submitted'
                                                        ? '50%'
                                                        : quest.status ===
                                                            'approved'
                                                          ? '75%'
                                                          : '100%',
                                        }}
                                    />

                                    {[
                                        { key: 'open', label: 'Bidding' },
                                        { key: 'ongoing', label: 'Pengerjaan' },
                                        { key: 'submitted', label: 'Tinjauan' },
                                        { key: 'approved', label: 'Disetujui' },
                                        { key: 'completed', label: 'Selesai' },
                                    ].map((step, idx) => {
                                        const statuses = [
                                            'open',
                                            'ongoing',
                                            'submitted',
                                            'approved',
                                            'completed',
                                        ];
                                        const currentIdx = statuses.indexOf(
                                            quest.status,
                                        );
                                        const stepIdx = statuses.indexOf(
                                            step.key,
                                        );
                                        const isCompleted =
                                            stepIdx < currentIdx ||
                                            quest.status === 'completed';
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
                                                            ? 'border-indigo-500 bg-indigo-600 text-white shadow-[0_0_10px_rgba(99,102,241,0.4)]'
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
                                                        isActive || isCompleted
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

                    {/* Metadata & Creator */}
                    <div className="flex flex-col justify-between gap-4 font-['Oxanium'] md:flex-row md:items-center">
                        <div className="flex items-center gap-3.5 text-xs text-slate-500 sm:text-sm dark:text-blue-300/80">
                            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-indigo-500/20 bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
                                <User className="h-4 w-4" />
                            </div>
                            <div>
                                <span className="block text-[10px] font-semibold text-slate-400 uppercase">
                                    Pemilik Quest
                                </span>
                                <span className="text-sm font-bold text-slate-800 dark:text-white">
                                    {quest.creator.name}
                                    <span className="ml-1.5 text-xs font-normal text-slate-400">
                                        (
                                        {quest.creator.role === 'admin'
                                            ? 'Administrator'
                                            : 'Siswa'}
                                        )
                                    </span>
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* 3. MAIN CONTENT GRID */}
                <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-12">
                    {/* LEFT COLUMN: TAB NAVIGATION & TAB PANELS (col-span-8) */}
                    <div className="space-y-6 lg:col-span-8">
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
                                <span className="flex items-center gap-1.5">
                                    <FileText size={14} />
                                    Deskripsi Quest
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
                                    {isCreator
                                        ? 'Manajemen Proyek'
                                        : isWorker
                                          ? 'Pengerjaan Proyek'
                                          : 'Status & Penawaran'}
                                </span>
                                {activeTab === 'project' && (
                                    <span className="absolute right-0 bottom-0 left-0 h-0.5 rounded-full bg-indigo-600 dark:bg-indigo-400" />
                                )}
                            </button>

                            {isCreator && quest.status === 'open' && (
                                <button
                                    onClick={() => setActiveTab('bids')}
                                    className={`relative cursor-pointer pb-3 transition-colors ${
                                        activeTab === 'bids'
                                            ? 'font-extrabold text-indigo-600 dark:text-indigo-400'
                                            : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-200'
                                    }`}
                                >
                                    <span className="flex items-center gap-1.5">
                                        <MessageSquare size={14} />
                                        Pelamar ({bids.length})
                                    </span>
                                    {activeTab === 'bids' && (
                                        <span className="absolute right-0 bottom-0 left-0 h-0.5 rounded-full bg-indigo-600 dark:bg-indigo-400" />
                                    )}
                                </button>
                            )}
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
                                {((quest.images && quest.images.length > 0) ||
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
                                                            (img, index) => (
                                                                <div
                                                                    key={index}
                                                                    className="group relative overflow-hidden rounded-xl border border-slate-200 bg-slate-50/50 p-1 dark:border-slate-800/80 dark:bg-black/20"
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
                                                            (file, index) => {
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
                                                                                <p className="text-slate-405 text-[10px]">
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
                                                                            className="flex cursor-pointer items-center justify-center rounded-lg p-1.5 text-indigo-500 transition-colors hover:bg-indigo-500/10 hover:text-indigo-700"
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

                        {/* TAB 2: PROJECT MANAGEMENT */}
                        {activeTab === 'project' && (
                            <div className="space-y-6">
                                {/* DISPUTE STATUS ALERT */}
                                {quest.dispute && (
                                    <div
                                        className={`flex gap-3 rounded-xl border p-4 font-['Oxanium'] ${
                                            quest.status === 'disputed'
                                                ? 'text-red-650 border-red-500/20 bg-red-500/10 dark:text-red-400'
                                                : 'border-green-500/20 bg-green-500/10 text-green-600 dark:text-green-400'
                                        }`}
                                    >
                                        <ShieldAlert className="h-5 w-5 shrink-0 text-red-500" />
                                        <div className="space-y-1 text-xs">
                                            <span className="block font-['Orbitron'] font-bold tracking-wider uppercase">
                                                {quest.status === 'disputed'
                                                    ? 'Quest Ditangguhkan (Dispute Diajukan)'
                                                    : 'Arbitrase Sengketa Selesai'}
                                            </span>
                                            <p className="dark:text-slate-350 leading-relaxed text-slate-500">
                                                {quest.status === 'disputed'
                                                    ? `Dispute diajukan oleh ${quest.dispute.filer_name} dengan alasan: "${quest.dispute.reason}". Dana escrow ditangguhkan sementara menunggu keputusan arbitrase admin.`
                                                    : `Perselisihan telah diselesaikan oleh Admin dengan putusan: ${
                                                          [
                                                              'refund',
                                                              'refund_creator',
                                                          ].includes(
                                                              quest.dispute
                                                                  .ruling ?? '',
                                                          )
                                                              ? 'Pengembalian dana (refund) penuh kepada pembuat quest.'
                                                              : [
                                                                      'pay_worker',
                                                                      'release_payout',
                                                                  ].includes(
                                                                      quest
                                                                          .dispute
                                                                          .ruling ??
                                                                          '',
                                                                  )
                                                                ? 'Pembayaran penuh diserahkan kepada pekerja.'
                                                                : `Bagi hasil (${quest.dispute.split_percentage}% untuk pekerja).`
                                                      } Catatan: "${quest.dispute.note}".`}
                                            </p>
                                        </div>
                                    </div>
                                )}

                                {isCreator ? (
                                    /* 1. CREATOR WORKFLOW PANEL */
                                    <div className="space-y-5 rounded-2xl border border-slate-200 bg-white/70 p-6 shadow-md backdrop-blur-md transition-all duration-300 dark:border-slate-800/80 dark:bg-[#0c122c]/40">
                                        <div className="flex items-center justify-between border-b border-slate-100 pb-3 dark:border-slate-800">
                                            <h3 className="font-['Orbitron'] text-sm font-bold tracking-wider text-slate-800 uppercase dark:text-blue-200">
                                                Alur Kerja Pekerjaan
                                            </h3>
                                            {(() => {
                                                const acceptedBid = bids.find(
                                                    (b) =>
                                                        b.status ===
                                                            'accepted' ||
                                                        b.student_id ===
                                                            quest.worker_id,
                                                );
                                                if (
                                                    acceptedBid &&
                                                    quest.worker
                                                ) {
                                                    return (
                                                        <button
                                                            onClick={() =>
                                                                setSelectedChatBid(
                                                                    {
                                                                        id: acceptedBid._id,
                                                                        name: quest
                                                                            .worker
                                                                            .name,
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

                                        {quest.worker && (
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
                                        )}

                                        {quest.status === 'ongoing' && (
                                            <div className="space-y-4 font-['Oxanium']">
                                                <p className="text-xs leading-relaxed text-slate-500 dark:text-blue-300/60">
                                                    Pekerja sedang menyelesaikan
                                                    tugas. Status quest saat ini
                                                    adalah{' '}
                                                    <strong>
                                                        Dalam Pengerjaan
                                                    </strong>
                                                    .
                                                </p>
                                                <RevisionHistory
                                                    quest={quest}
                                                    viewType="creator_ongoing"
                                                />
                                            </div>
                                        )}

                                        {quest.status === 'approved' && (
                                            <div className="flex flex-col gap-2 rounded-xl border border-indigo-500/20 bg-indigo-500/10 p-4 text-center font-['Oxanium']">
                                                <span className="block font-['Orbitron'] text-xs font-bold tracking-wider text-indigo-600 uppercase dark:text-indigo-400">
                                                    Disetujui & Menunggu Berkas
                                                    Final
                                                </span>
                                                <p className="text-[11px] text-slate-500 dark:text-slate-300">
                                                    Anda telah menyetujui hasil
                                                    review pekerjaan ini. Saat
                                                    ini, sistem sedang menunggu
                                                    pekerja mengunggah berkas
                                                    proyek ZIP final agar quest
                                                    selesai dan rewards RPG
                                                    dikirimkan secara otomatis.
                                                </p>
                                            </div>
                                        )}

                                        {quest.status === 'submitted' && (
                                            <div className="space-y-5 font-['Oxanium']">
                                                <div className="flex flex-col gap-1 rounded-xl border border-amber-500/20 bg-amber-500/10 p-4 text-center">
                                                    <span className="block font-['Orbitron'] text-xs font-bold tracking-wider text-amber-600 uppercase dark:text-amber-400">
                                                        Hasil Pekerjaan Terkirim
                                                    </span>
                                                    <p className="text-xs leading-relaxed text-slate-500 dark:text-blue-300/60">
                                                        Pekerja telah selesai
                                                        melakukan penyerahan
                                                        tugas awal. Silakan
                                                        review hasil
                                                        pekerjaannya di bawah
                                                        ini.
                                                    </p>
                                                </div>

                                                <RevisionHistory
                                                    quest={quest}
                                                    viewType="creator_submitted"
                                                />

                                                <div className="space-y-3.5 rounded-xl border border-slate-200 bg-slate-50/50 p-4 text-xs dark:border-slate-800/80 dark:bg-black/20">
                                                    {quest.submission_file && (
                                                        <div className="space-y-1">
                                                            <strong className="block text-[10px] tracking-wider text-slate-400 uppercase">
                                                                Berkas Pekerjaan
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
                                                                Link Hasil
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

                                                    {quest.submission_note && (
                                                        <div>
                                                            <strong className="mb-1 block text-[10px] tracking-wider text-slate-400 uppercase">
                                                                Catatan dari
                                                                Pekerja
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
                                                        <div className="flex gap-3 border-t border-slate-100 pt-4 dark:border-slate-800">
                                                            <button
                                                                onClick={() =>
                                                                    setShowApproveForm(
                                                                        true,
                                                                    )
                                                                }
                                                                className="flex-1 cursor-pointer rounded-xl bg-green-600 py-2.5 font-['Orbitron'] text-xs font-bold tracking-wider text-white uppercase shadow-sm transition-colors hover:bg-green-700"
                                                            >
                                                                Setujui &
                                                                Lanjutkan
                                                            </button>
                                                            <button
                                                                onClick={() =>
                                                                    setShowRejectForm(
                                                                        true,
                                                                    )
                                                                }
                                                                className="flex-1 cursor-pointer rounded-xl bg-red-600 py-2.5 font-['Orbitron'] text-xs font-bold tracking-wider text-white uppercase shadow-sm transition-colors hover:bg-red-700"
                                                            >
                                                                Tolak / Minta
                                                                Revisi
                                                            </button>
                                                        </div>
                                                    )}

                                                {showApproveForm && (
                                                    <form
                                                        onSubmit={
                                                            submitApproval
                                                        }
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
                                                                    1, 2, 3, 4,
                                                                    5,
                                                                ].map((val) => (
                                                                    <button
                                                                        key={
                                                                            val
                                                                        }
                                                                        type="button"
                                                                        onClick={() =>
                                                                            reviewForm.setData(
                                                                                'rating',
                                                                                val,
                                                                            )
                                                                        }
                                                                        className="cursor-pointer transition-transform focus:outline-none active:scale-95"
                                                                    >
                                                                        <Star
                                                                            className={`h-7 w-7 ${
                                                                                val <=
                                                                                reviewForm
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
                                                                    reviewForm
                                                                        .data
                                                                        .rating_comment
                                                                }
                                                                onChange={(e) =>
                                                                    reviewForm.setData(
                                                                        'rating_comment',
                                                                        e.target
                                                                            .value,
                                                                    )
                                                                }
                                                                className="text-slate-808 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs focus:border-indigo-500 focus:outline-none dark:border-slate-800 dark:bg-black/20 dark:text-white"
                                                            />
                                                        </div>

                                                        <div className="flex gap-2">
                                                            <button
                                                                type="submit"
                                                                disabled={
                                                                    reviewForm.processing
                                                                }
                                                                className="flex-1 cursor-pointer rounded-xl bg-green-600 py-2 font-['Orbitron'] text-xs font-bold tracking-wider text-white uppercase transition-colors hover:bg-green-700 disabled:opacity-50"
                                                            >
                                                                {reviewForm.processing
                                                                    ? 'Menyelesaikan...'
                                                                    : 'Kirim Ulasan & Setujui'}
                                                            </button>
                                                            <button
                                                                type="button"
                                                                onClick={() => {
                                                                    setShowApproveForm(
                                                                        false,
                                                                    );
                                                                    reviewForm.reset();
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
                                                        onSubmit={
                                                            submitRejection
                                                        }
                                                        className="space-y-4 border-t border-slate-100 pt-4 dark:border-slate-800"
                                                    >
                                                        <h4 className="font-['Orbitron'] text-xs font-bold text-slate-700 uppercase dark:text-blue-200">
                                                            Kirim Feedback
                                                            Revisi
                                                        </h4>
                                                        <div className="space-y-1">
                                                            <label className="text-[10px] font-bold tracking-wider text-slate-400 uppercase">
                                                                Detail Revisi
                                                                yang Harus
                                                                Diperbaiki{' '}
                                                                <span className="text-red-500">
                                                                    *
                                                                </span>
                                                            </label>
                                                            <textarea
                                                                required
                                                                placeholder="Jelaskan secara rinci apa saja yang perlu diperbaiki pekerja..."
                                                                rows={4}
                                                                value={
                                                                    reviewForm
                                                                        .data
                                                                        .revision_note
                                                                }
                                                                onChange={(e) =>
                                                                    reviewForm.setData(
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
                                                                    reviewForm.processing
                                                                }
                                                                className="bg-red-650 flex-1 cursor-pointer rounded-xl py-2 font-['Orbitron'] text-xs font-bold tracking-wider text-white uppercase transition-colors hover:bg-red-700 disabled:opacity-50"
                                                            >
                                                                {reviewForm.processing
                                                                    ? 'Mengirim...'
                                                                    : 'Kirim Catatan Revisi'}
                                                            </button>
                                                            <button
                                                                type="button"
                                                                onClick={() => {
                                                                    setShowRejectForm(
                                                                        false,
                                                                    );
                                                                    reviewForm.reset();
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
                                            <div className="space-y-4 font-['Oxanium']">
                                                <div className="flex flex-col gap-1 rounded-xl border border-green-500/20 bg-green-500/10 p-4 text-center">
                                                    <Check className="mx-auto h-8 w-8 text-green-500" />
                                                    <span className="block font-['Orbitron'] text-xs font-bold tracking-wider text-green-600 uppercase dark:text-green-400">
                                                        Quest Selesai
                                                    </span>
                                                    <p className="text-xs leading-relaxed text-slate-500 dark:text-blue-300/60">
                                                        Pekerjaan telah
                                                        disetujui, berkas final
                                                        ZIP telah terkirim, dan
                                                        quest diselesaikan
                                                        secara resmi.
                                                    </p>
                                                </div>

                                                {quest.rating && (
                                                    <div className="space-y-2 rounded-xl border border-slate-200/20 bg-slate-50/50 p-4 text-center dark:border-slate-500/5 dark:bg-black/20">
                                                        <span className="block text-[10px] font-semibold tracking-wider text-slate-400 uppercase">
                                                            Ulasan Penilaian
                                                            Anda
                                                        </span>
                                                        <div className="flex justify-center gap-1">
                                                            {[
                                                                1, 2, 3, 4, 5,
                                                            ].map((star) => (
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
                                                            ))}
                                                        </div>
                                                        {quest.rating_comment && (
                                                            <p className="rounded-lg border border-slate-100 bg-white/40 p-2.5 text-xs text-slate-600 italic dark:border-blue-500/5 dark:bg-black/10 dark:text-slate-300">
                                                                "
                                                                {
                                                                    quest.rating_comment
                                                                }
                                                                "
                                                            </p>
                                                        )}
                                                    </div>
                                                )}

                                                <div className="space-y-3 rounded-xl border border-slate-200 bg-slate-50/50 p-4 text-xs dark:border-slate-800/40 dark:bg-black/20">
                                                    {quest.submission_file && (
                                                        <div className="space-y-1">
                                                            <strong className="block text-[10px] tracking-wider text-slate-400 uppercase">
                                                                Berkas Proyek
                                                                Final (ZIP)
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
                                ) : isWorker ? (
                                    /* 2. WORKER WORKFLOW PANEL */
                                    <div className="space-y-5 rounded-2xl border border-slate-200 bg-white/70 p-6 shadow-md backdrop-blur-md transition-all duration-300 dark:border-slate-800/80 dark:bg-[#0c122c]/40">
                                        <div className="flex items-center justify-between border-b border-slate-100 pb-3 dark:border-slate-800">
                                            <h3 className="font-['Orbitron'] text-sm font-bold tracking-wider text-slate-800 uppercase dark:text-blue-200">
                                                Penyerahan Tugas Proyek
                                            </h3>
                                            {myBid && (
                                                <button
                                                    onClick={() =>
                                                        setSelectedChatBid({
                                                            id: myBid._id,
                                                            name: quest.creator
                                                                .name,
                                                        })
                                                    }
                                                    className="relative flex shrink-0 cursor-pointer items-center gap-1.5 rounded-xl bg-indigo-600 px-3 py-1.5 font-['Orbitron'] text-xs font-bold tracking-wider text-white uppercase shadow-sm transition-all duration-350 hover:bg-indigo-700"
                                                >
                                                    <MessageSquare size={12} />
                                                    Chat Pemilik
                                                    {myBid.unread_messages_count >
                                                        0 && (
                                                        <span className="absolute -top-1 -right-1 flex h-4 w-4 animate-pulse items-center justify-center rounded-full bg-red-500 text-[8px] font-black text-white ring-2 ring-white dark:ring-slate-900">
                                                            {
                                                                myBid.unread_messages_count
                                                            }
                                                        </span>
                                                    )}
                                                </button>
                                            )}
                                        </div>

                                        {quest.status === 'ongoing' && (
                                            <div className="space-y-4">
                                                <RevisionHistory
                                                    quest={quest}
                                                    viewType="worker_ongoing"
                                                />

                                                <form
                                                    onSubmit={handleWorkSubmit}
                                                    className="space-y-4 font-['Oxanium']"
                                                >
                                                    <p className="text-xs leading-relaxed text-slate-500 dark:text-blue-300/60">
                                                        Kirimkan hasil pekerjaan
                                                        Anda agar pemilik quest
                                                        dapat meninjau dan
                                                        memberikan persetujuan
                                                        pengerjaan.
                                                    </p>

                                                    {/* ZIP Deliverable File Input with Drag-and-Drop */}
                                                    <div className="space-y-2">
                                                        <label className="flex items-center gap-1.5 font-['Orbitron'] text-xs font-bold text-slate-600 uppercase dark:text-blue-200">
                                                            <FileArchive className="h-4 w-4 text-amber-500" />
                                                            Berkas Proyek Utama
                                                            (ZIP){' '}
                                                            <span className="font-normal text-slate-400">
                                                                (Opsional)
                                                            </span>
                                                        </label>

                                                        <input
                                                            id="submission-file-input"
                                                            type="file"
                                                            accept=".zip"
                                                            onChange={(e) => {
                                                                const files =
                                                                    e.target
                                                                        .files;
                                                                if (
                                                                    files &&
                                                                    files.length >
                                                                        0
                                                                ) {
                                                                    submissionForm.setData(
                                                                        'submission_file',
                                                                        files[0],
                                                                    );
                                                                }
                                                            }}
                                                            className="hidden"
                                                        />

                                                        {submissionForm.data
                                                            .submission_file ? (
                                                            <div className="flex items-center justify-between rounded-xl border border-purple-500/30 bg-purple-500/5 p-3.5">
                                                                <div className="flex min-w-0 items-center gap-3">
                                                                    <FileArchive className="h-6 w-6 shrink-0 text-purple-500" />
                                                                    <div className="min-w-0">
                                                                        <p className="truncate text-xs font-bold text-slate-700 dark:text-slate-200">
                                                                            {
                                                                                submissionForm
                                                                                    .data
                                                                                    .submission_file
                                                                                    .name
                                                                            }
                                                                        </p>
                                                                        <p className="text-[10px] text-slate-400">
                                                                            {(
                                                                                submissionForm
                                                                                    .data
                                                                                    .submission_file
                                                                                    .size /
                                                                                1024 /
                                                                                1024
                                                                            ).toFixed(
                                                                                2,
                                                                            )}{' '}
                                                                            MB
                                                                        </p>
                                                                    </div>
                                                                </div>
                                                                <button
                                                                    type="button"
                                                                    onClick={() =>
                                                                        submissionForm.setData(
                                                                            'submission_file',
                                                                            null,
                                                                        )
                                                                    }
                                                                    className="shrink-0 cursor-pointer rounded-lg px-2.5 py-1 font-['Orbitron'] text-[10px] font-bold tracking-wider text-red-600 uppercase transition-colors hover:bg-red-500/10 dark:text-red-400"
                                                                >
                                                                    Hapus
                                                                </button>
                                                            </div>
                                                        ) : (
                                                            <div
                                                                onClick={() =>
                                                                    document
                                                                        .getElementById(
                                                                            'submission-file-input',
                                                                        )
                                                                        ?.click()
                                                                }
                                                                onDragOver={(
                                                                    e,
                                                                ) => {
                                                                    e.preventDefault();
                                                                    e.currentTarget.classList.add(
                                                                        'border-purple-500',
                                                                        'bg-purple-500/5',
                                                                    );
                                                                }}
                                                                onDragLeave={(
                                                                    e,
                                                                ) => {
                                                                    e.preventDefault();
                                                                    e.currentTarget.classList.remove(
                                                                        'border-purple-500',
                                                                        'bg-purple-500/5',
                                                                    );
                                                                }}
                                                                onDrop={(e) => {
                                                                    e.preventDefault();
                                                                    e.currentTarget.classList.remove(
                                                                        'border-purple-500',
                                                                        'bg-purple-500/5',
                                                                    );
                                                                    const files =
                                                                        e
                                                                            .dataTransfer
                                                                            .files;
                                                                    if (
                                                                        files &&
                                                                        files.length >
                                                                            0 &&
                                                                        files[0].name.endsWith(
                                                                            '.zip',
                                                                        )
                                                                    ) {
                                                                        submissionForm.setData(
                                                                            'submission_file',
                                                                            files[0],
                                                                        );
                                                                    }
                                                                }}
                                                                className="flex cursor-pointer flex-col items-center justify-center gap-1.5 rounded-xl border-2 border-dashed border-slate-200 bg-slate-50/50 p-5 text-center transition-all duration-300 hover:border-purple-500 dark:border-slate-800/80 dark:bg-black/20 dark:hover:border-purple-400"
                                                            >
                                                                <FileArchive className="h-8 w-8 text-slate-400 dark:text-blue-500/40" />
                                                                <span className="text-xs font-bold text-slate-600 dark:text-blue-300">
                                                                    Seret &
                                                                    lepas berkas
                                                                    ZIP
                                                                </span>
                                                                <span className="text-[10px] text-slate-400">
                                                                    atau klik
                                                                    untuk
                                                                    memilih
                                                                    berkas
                                                                </span>
                                                            </div>
                                                        )}

                                                        {submissionForm.progress && (
                                                            <div className="space-y-1">
                                                                <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-200 dark:bg-slate-800">
                                                                    <div
                                                                        className="h-1.5 animate-pulse rounded-full bg-purple-600 transition-all duration-300"
                                                                        style={{
                                                                            width: `${submissionForm.progress.percentage}%`,
                                                                        }}
                                                                    />
                                                                </div>
                                                                <span className="block text-right font-['Orbitron'] text-[8px] font-bold tracking-widest text-slate-400 uppercase">
                                                                    Mengunggah:{' '}
                                                                    {
                                                                        submissionForm
                                                                            .progress
                                                                            .percentage
                                                                    }
                                                                    %
                                                                </span>
                                                            </div>
                                                        )}

                                                        {submissionForm.errors
                                                            .submission_file && (
                                                            <p className="text-xs font-semibold text-red-500">
                                                                {
                                                                    submissionForm
                                                                        .errors
                                                                        .submission_file
                                                                }
                                                            </p>
                                                        )}
                                                    </div>

                                                    {/* Required Link Input */}
                                                    <div className="space-y-1.5">
                                                        <label className="text-xs font-bold text-slate-600 uppercase dark:text-blue-200">
                                                            Tautan Repositori /
                                                            Demo Hasil Pekerjaan{' '}
                                                            <span className="text-red-500">
                                                                *
                                                            </span>
                                                        </label>
                                                        <input
                                                            type="url"
                                                            placeholder="https://github.com/username/project"
                                                            required
                                                            value={
                                                                submissionForm
                                                                    .data
                                                                    .submission_link
                                                            }
                                                            onChange={(e) =>
                                                                submissionForm.setData(
                                                                    'submission_link',
                                                                    e.target
                                                                        .value,
                                                                )
                                                            }
                                                            className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-xs text-slate-800 focus:border-purple-500 focus:outline-none dark:border-slate-800 dark:bg-black/20 dark:text-white"
                                                        />
                                                        {submissionForm.errors
                                                            .submission_link && (
                                                            <p className="text-xs font-semibold text-red-500">
                                                                {
                                                                    submissionForm
                                                                        .errors
                                                                        .submission_link
                                                                }
                                                            </p>
                                                        )}
                                                    </div>

                                                    <div className="space-y-1.5">
                                                        <label className="text-xs font-bold text-slate-600 uppercase dark:text-blue-200">
                                                            Catatan Tambahan
                                                        </label>
                                                        <textarea
                                                            placeholder="Berikan deskripsi singkat tentang pengiriman pekerjaan ini..."
                                                            rows={4}
                                                            value={
                                                                submissionForm
                                                                    .data
                                                                    .submission_note
                                                            }
                                                            onChange={(e) =>
                                                                submissionForm.setData(
                                                                    'submission_note',
                                                                    e.target
                                                                        .value,
                                                                )
                                                            }
                                                            className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-xs text-slate-800 focus:border-purple-500 focus:outline-none dark:border-slate-800 dark:bg-black/20 dark:text-white"
                                                        />
                                                        {submissionForm.errors
                                                            .submission_note && (
                                                            <p className="text-xs font-semibold text-red-500">
                                                                {
                                                                    submissionForm
                                                                        .errors
                                                                        .submission_note
                                                                }
                                                            </p>
                                                        )}
                                                    </div>

                                                    <button
                                                        type="submit"
                                                        disabled={
                                                            submissionForm.processing
                                                        }
                                                        className="w-full cursor-pointer rounded-xl bg-indigo-600 py-2.5 font-['Orbitron'] text-xs font-semibold tracking-wider text-white uppercase shadow-md transition-all hover:bg-indigo-700 disabled:opacity-50"
                                                    >
                                                        {submissionForm.processing
                                                            ? 'Mengirim...'
                                                            : 'Kirim Hasil Pekerjaan'}
                                                    </button>
                                                </form>
                                            </div>
                                        )}

                                        {quest.status === 'approved' && (
                                            <div className="space-y-4 font-['Oxanium']">
                                                <div className="flex flex-col gap-2 rounded-xl border border-indigo-500/25 bg-indigo-500/10 p-4 text-center">
                                                    <CheckCircle2 className="mx-auto h-8 w-8 text-indigo-500" />
                                                    <span className="block text-xs font-bold tracking-wider text-indigo-600 uppercase dark:text-indigo-400">
                                                        Persetujuan Diterima!
                                                    </span>
                                                    <p className="text-xs leading-relaxed text-slate-500 dark:text-blue-300/60">
                                                        Kerja bagus! Hasil
                                                        pengerjaan Anda telah
                                                        disetujui. Silakan
                                                        unggah berkas final
                                                        (.zip) proyek Anda di
                                                        bawah ini untuk
                                                        meresmikan penyelesaian
                                                        quest dan membuka kunci
                                                        reward RPG Anda.
                                                    </p>
                                                </div>

                                                <form
                                                    onSubmit={
                                                        handleFinalZipSubmit
                                                    }
                                                    className="space-y-4"
                                                >
                                                    <div className="space-y-2">
                                                        <label className="flex items-center gap-1.5 font-['Orbitron'] text-xs font-bold text-slate-600 uppercase dark:text-blue-200">
                                                            <FileArchive className="h-4 w-4 text-amber-500" />
                                                            Upload Berkas Proyek
                                                            Final (ZIP){' '}
                                                            <span className="text-red-500">
                                                                *
                                                            </span>
                                                        </label>

                                                        <input
                                                            id="final-zip-file-input"
                                                            type="file"
                                                            accept=".zip"
                                                            onChange={(e) => {
                                                                const files =
                                                                    e.target
                                                                        .files;
                                                                if (
                                                                    files &&
                                                                    files.length >
                                                                        0
                                                                ) {
                                                                    finalZipForm.setData(
                                                                        'submission_file',
                                                                        files[0],
                                                                    );
                                                                }
                                                            }}
                                                            className="hidden"
                                                        />

                                                        {finalZipForm.data
                                                            .submission_file ? (
                                                            <div className="flex items-center justify-between rounded-xl border border-indigo-500/30 bg-indigo-500/5 p-3.5">
                                                                <div className="flex min-w-0 items-center gap-3">
                                                                    <FileArchive className="h-6 w-6 shrink-0 text-indigo-500" />
                                                                    <div className="min-w-0">
                                                                        <p className="truncate text-xs font-bold text-slate-700 dark:text-slate-200">
                                                                            {
                                                                                finalZipForm
                                                                                    .data
                                                                                    .submission_file
                                                                                    .name
                                                                            }
                                                                        </p>
                                                                        <p className="text-[10px] text-slate-400">
                                                                            {(
                                                                                finalZipForm
                                                                                    .data
                                                                                    .submission_file
                                                                                    .size /
                                                                                1024 /
                                                                                1024
                                                                            ).toFixed(
                                                                                2,
                                                                            )}{' '}
                                                                            MB
                                                                        </p>
                                                                    </div>
                                                                </div>
                                                                <button
                                                                    type="button"
                                                                    onClick={() =>
                                                                        finalZipForm.setData(
                                                                            'submission_file',
                                                                            null,
                                                                        )
                                                                    }
                                                                    className="text-red-650 shrink-0 cursor-pointer rounded-lg px-2.5 py-1 font-['Orbitron'] text-[10px] font-bold tracking-wider uppercase transition-colors hover:bg-red-500/10 dark:text-red-400"
                                                                >
                                                                    Hapus
                                                                </button>
                                                            </div>
                                                        ) : (
                                                            <div
                                                                onClick={() =>
                                                                    document
                                                                        .getElementById(
                                                                            'final-zip-file-input',
                                                                        )
                                                                        ?.click()
                                                                }
                                                                onDragOver={(
                                                                    e,
                                                                ) => {
                                                                    e.preventDefault();
                                                                    e.currentTarget.classList.add(
                                                                        'border-indigo-500',
                                                                        'bg-indigo-500/5',
                                                                    );
                                                                }}
                                                                onDragLeave={(
                                                                    e,
                                                                ) => {
                                                                    e.preventDefault();
                                                                    e.currentTarget.classList.remove(
                                                                        'border-indigo-500',
                                                                        'bg-indigo-500/5',
                                                                    );
                                                                }}
                                                                onDrop={(e) => {
                                                                    e.preventDefault();
                                                                    e.currentTarget.classList.remove(
                                                                        'border-indigo-500',
                                                                        'bg-indigo-500/5',
                                                                    );
                                                                    const files =
                                                                        e
                                                                            .dataTransfer
                                                                            .files;
                                                                    if (
                                                                        files &&
                                                                        files.length >
                                                                            0 &&
                                                                        files[0].name.endsWith(
                                                                            '.zip',
                                                                        )
                                                                    ) {
                                                                        finalZipForm.setData(
                                                                            'submission_file',
                                                                            files[0],
                                                                        );
                                                                    }
                                                                }}
                                                                className="flex cursor-pointer flex-col items-center justify-center gap-1.5 rounded-xl border-2 border-dashed border-slate-200 bg-slate-50/50 p-5 text-center transition-all duration-300 hover:border-indigo-500 dark:border-slate-800 dark:bg-black/20 dark:hover:border-indigo-400"
                                                            >
                                                                <FileArchive className="h-8 w-8 text-slate-400 dark:text-blue-500/40" />
                                                                <span className="text-xs font-bold text-slate-600 dark:text-blue-300">
                                                                    Seret &
                                                                    lepas berkas
                                                                    ZIP Final
                                                                </span>
                                                                <span className="text-[10px] text-slate-400">
                                                                    atau klik
                                                                    untuk
                                                                    memilih
                                                                    berkas
                                                                </span>
                                                            </div>
                                                        )}

                                                        {finalZipForm.progress && (
                                                            <div className="space-y-1">
                                                                <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-200 dark:bg-slate-800">
                                                                    <div
                                                                        className="h-1.5 animate-pulse rounded-full bg-indigo-600 transition-all duration-300"
                                                                        style={{
                                                                            width: `${finalZipForm.progress.percentage}%`,
                                                                        }}
                                                                    />
                                                                </div>
                                                                <span className="block text-right font-['Orbitron'] text-[8px] font-bold tracking-widest text-slate-400 uppercase">
                                                                    Mengunggah:{' '}
                                                                    {
                                                                        finalZipForm
                                                                            .progress
                                                                            .percentage
                                                                    }
                                                                    %
                                                                </span>
                                                            </div>
                                                        )}

                                                        {finalZipForm.errors
                                                            .submission_file && (
                                                            <p className="text-xs font-semibold text-red-500">
                                                                {
                                                                    finalZipForm
                                                                        .errors
                                                                        .submission_file
                                                                }
                                                            </p>
                                                        )}
                                                    </div>

                                                    <button
                                                        type="submit"
                                                        disabled={
                                                            finalZipForm.processing
                                                        }
                                                        className="w-full cursor-pointer rounded-xl bg-indigo-600 py-2.5 font-['Orbitron'] text-xs font-semibold tracking-wider text-white uppercase shadow-md transition-all hover:bg-indigo-700 disabled:opacity-50"
                                                    >
                                                        {finalZipForm.processing
                                                            ? 'Mengirim...'
                                                            : 'Kirim Berkas Final & Klaim Hadiah'}
                                                    </button>
                                                </form>
                                            </div>
                                        )}

                                        {quest.status === 'submitted' && (
                                            <div className="space-y-4 font-['Oxanium']">
                                                <div className="flex flex-col gap-1.5 rounded-xl border border-amber-500/25 bg-amber-500/10 p-4 text-center">
                                                    <span className="block font-['Orbitron'] text-xs font-bold tracking-wider text-amber-600 uppercase dark:text-amber-400">
                                                        Menunggu Review Pemilik
                                                    </span>
                                                    <p className="text-xs leading-relaxed text-slate-500 dark:text-blue-300/60">
                                                        Hasil penyerahan tugas
                                                        Anda telah dikirim.
                                                        Pemilik quest akan
                                                        meninjau kelayakan
                                                        pekerjaan Anda.
                                                    </p>
                                                </div>

                                                <RevisionHistory
                                                    quest={quest}
                                                    viewType="worker_submitted"
                                                />

                                                <div className="space-y-3.5 rounded-xl border border-slate-200 bg-slate-50/50 p-4 text-xs dark:border-slate-800 dark:bg-black/20">
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
                                                                        <p className="truncate text-xs font-semibold text-slate-700 dark:text-slate-200">
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
                                                                >
                                                                    <Download className="h-4.5 w-4.5" />
                                                                </a>
                                                            </div>
                                                        </div>
                                                    )}

                                                    {quest.submission_link && (
                                                        <div>
                                                            <strong className="mb-1 block text-[10px] tracking-wider text-slate-400 uppercase">
                                                                Tautan
                                                                Repository
                                                            </strong>
                                                            <a
                                                                href={
                                                                    quest.submission_link
                                                                }
                                                                target="_blank"
                                                                rel="noopener noreferrer"
                                                                className="font-['Oxanium'] font-semibold break-all text-indigo-500 hover:underline"
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
                                                                Catatan Anda
                                                            </strong>
                                                            <p className="text-slate-705 dark:text-slate-350 rounded-lg border border-slate-200 bg-white/40 p-2.5 font-['Oxanium'] leading-relaxed whitespace-pre-wrap dark:border-slate-800/40 dark:bg-black/15">
                                                                {
                                                                    quest.submission_note
                                                                }
                                                            </p>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        )}

                                        {quest.status === 'completed' && (
                                            <div className="space-y-4 font-['Oxanium']">
                                                <div className="flex flex-col gap-1.5 rounded-xl border border-green-500/25 bg-green-500/10 p-4 text-center">
                                                    <Check className="mx-auto h-8 w-8 text-green-500" />
                                                    <span className="block font-['Orbitron'] text-xs font-bold tracking-wider text-green-600 uppercase dark:text-green-400">
                                                        Quest Selesai
                                                    </span>
                                                    <p className="text-xs leading-relaxed text-slate-500 dark:text-blue-300/60">
                                                        Selamat! Tugas Anda
                                                        telah disetujui, berkas
                                                        final ZIP telah diterima
                                                        oleh sistem, dan hadiah
                                                        RPG Anda telah
                                                        ditambahkan secara
                                                        resmi!
                                                    </p>
                                                </div>

                                                {quest.rating && (
                                                    <div className="space-y-2 rounded-xl border border-slate-200/20 bg-slate-50/50 p-4 text-center dark:border-slate-500/5 dark:bg-black/20">
                                                        <span className="block text-[10px] font-semibold tracking-wider text-slate-400 uppercase">
                                                            Ulasan Kinerja Anda
                                                        </span>
                                                        <div className="flex justify-center gap-1 font-['Oxanium']">
                                                            {[
                                                                1, 2, 3, 4, 5,
                                                            ].map((star) => (
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
                                                            ))}
                                                        </div>
                                                        {quest.rating_comment && (
                                                            <p className="rounded-lg border border-slate-100 bg-white/40 p-2.5 text-xs text-slate-600 italic dark:border-blue-500/5 dark:bg-black/10 dark:text-slate-300">
                                                                "
                                                                {
                                                                    quest.rating_comment
                                                                }
                                                                "
                                                            </p>
                                                        )}
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                ) : (
                                    /* 3. VIEWER / APPLICANT WORKFLOW PANEL */
                                    <div className="space-y-5 rounded-2xl border border-slate-200 bg-white/70 p-6 font-['Oxanium'] shadow-md backdrop-blur-md transition-all duration-300 dark:border-slate-800/80 dark:bg-[#0c122c]/40">
                                        {myBid ? (
                                            /* ALREADY BID: SHOW BID DETAILS */
                                            <div className="space-y-4">
                                                <h3 className="border-b border-slate-100 pb-3 font-['Orbitron'] text-sm font-bold tracking-wider text-slate-800 uppercase dark:border-slate-800 dark:text-blue-200">
                                                    Penawaran Anda
                                                </h3>

                                                <div className="space-y-4 rounded-xl border border-slate-200 bg-slate-50/50 p-4 dark:border-slate-800 dark:bg-black/10">
                                                    <div className="flex items-center justify-between border-b border-slate-100 pb-2 dark:border-slate-800/50">
                                                        <span className="text-xs font-semibold text-slate-400 uppercase">
                                                            Harga Penawaran
                                                        </span>
                                                        <span className="text-base font-black text-purple-600 dark:text-purple-300">
                                                            {formatCurrency(
                                                                myBid.bid_amount,
                                                            )}
                                                        </span>
                                                    </div>

                                                    <div className="space-y-1">
                                                        <span className="block text-[10px] font-semibold tracking-wider text-slate-400 uppercase">
                                                            Proposal
                                                        </span>
                                                        <p className="rounded-lg border border-slate-200 bg-white/50 p-2.5 text-xs leading-relaxed whitespace-pre-line text-slate-600 dark:border-slate-800/30 dark:bg-black/15 dark:text-slate-300">
                                                            {myBid.proposal}
                                                        </p>
                                                    </div>

                                                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                                                        <div className="space-y-1">
                                                            <span className="block text-[10px] font-semibold tracking-wider text-slate-400 uppercase">
                                                                Tautan CV
                                                            </span>
                                                            <p className="truncate rounded-lg border border-slate-200 bg-white/50 p-2 text-xs text-indigo-500 hover:underline dark:border-slate-800/30 dark:bg-black/15">
                                                                <a
                                                                    href={
                                                                        myBid.cv.startsWith(
                                                                            'http',
                                                                        )
                                                                            ? myBid.cv
                                                                            : '#'
                                                                    }
                                                                    target="_blank"
                                                                    rel="noopener noreferrer"
                                                                >
                                                                    {myBid.cv}
                                                                </a>
                                                            </p>
                                                        </div>
                                                        <div className="space-y-1">
                                                            <span className="block text-[10px] font-semibold tracking-wider text-slate-400 uppercase">
                                                                Portofolio
                                                            </span>
                                                            <p className="truncate rounded-lg border border-slate-200 bg-white/50 p-2 text-xs text-indigo-500 hover:underline dark:border-slate-800/30 dark:bg-black/15">
                                                                <a
                                                                    href={
                                                                        myBid.portfolio.startsWith(
                                                                            'http',
                                                                        )
                                                                            ? myBid.portfolio
                                                                            : '#'
                                                                    }
                                                                    target="_blank"
                                                                    rel="noopener noreferrer"
                                                                >
                                                                    {
                                                                        myBid.portfolio
                                                                    }
                                                                </a>
                                                            </p>
                                                        </div>
                                                    </div>

                                                    <div className="border-t border-slate-100 pt-2 dark:border-slate-800">
                                                        <span className="mb-2 block text-[10px] font-semibold tracking-wider text-slate-400 uppercase">
                                                            Status Penawaran
                                                        </span>
                                                        {myBid.status ===
                                                            'pending' && (
                                                            <span className="block rounded-lg border border-amber-500/20 bg-amber-500/10 py-1.5 text-center font-['Orbitron'] text-xs font-bold tracking-wider text-amber-600 uppercase dark:text-amber-400">
                                                                Menunggu
                                                                Keputusan
                                                            </span>
                                                        )}
                                                        {myBid.status ===
                                                            'accepted' && (
                                                            <span className="block rounded-lg border border-green-500/20 bg-green-500/10 py-1.5 text-center font-['Orbitron'] text-xs font-bold tracking-wider text-green-600 uppercase dark:text-green-400">
                                                                Penawaran
                                                                Diterima!
                                                            </span>
                                                        )}
                                                        {myBid.status ===
                                                            'rejected' && (
                                                            <span className="dark:text-red-405 block rounded-lg border border-red-500/20 bg-red-500/10 py-1.5 text-center font-['Orbitron'] text-xs font-bold tracking-wider text-red-600 uppercase">
                                                                Penawaran
                                                                Ditolak
                                                            </span>
                                                        )}
                                                    </div>

                                                    <div className="border-t border-slate-100 pt-3 dark:border-slate-800">
                                                        <button
                                                            onClick={() =>
                                                                setSelectedChatBid(
                                                                    {
                                                                        id: myBid._id,
                                                                        name: quest
                                                                            .creator
                                                                            .name,
                                                                    },
                                                                )
                                                            }
                                                            className="relative flex w-full animate-pulse cursor-pointer items-center justify-center gap-2 rounded-xl bg-indigo-600 py-2 font-['Orbitron'] text-xs font-bold tracking-wider text-white uppercase shadow-md transition-all duration-300 hover:bg-indigo-700"
                                                        >
                                                            Chat dengan Pembuat
                                                            {myBid.unread_messages_count >
                                                                0 && (
                                                                <span className="absolute -top-1 -right-1 flex h-4 w-4 animate-pulse items-center justify-center rounded-full bg-red-500 text-[8px] font-black text-white ring-2 ring-white dark:ring-slate-900">
                                                                    {
                                                                        myBid.unread_messages_count
                                                                    }
                                                                </span>
                                                            )}
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        ) : can.bid ? (
                                            /* NOT BID YET: SHOW BID FORM */
                                            <form
                                                onSubmit={handleBidSubmit}
                                                className="space-y-4 font-['Oxanium']"
                                            >
                                                <h3 className="border-b border-slate-100 pb-3 font-['Orbitron'] text-sm font-bold tracking-wider text-slate-800 uppercase dark:border-slate-800 dark:text-blue-200">
                                                    Ajukan Bid Penawaran
                                                </h3>

                                                {/* Bid Amount */}
                                                <div className="space-y-1.5">
                                                    <label className="text-xs font-bold text-slate-600 uppercase dark:text-blue-200">
                                                        Harga Penawaran (Rupiah)
                                                    </label>
                                                    <input
                                                        type="number"
                                                        placeholder={`Range: ${quest.min_salary} - ${quest.max_salary}`}
                                                        value={data.bid_amount}
                                                        onChange={(e) =>
                                                            setData(
                                                                'bid_amount',
                                                                e.target.value,
                                                            )
                                                        }
                                                        className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 font-['Orbitron'] text-xs font-bold transition-colors focus:border-indigo-500 focus:outline-none dark:border-slate-800 dark:bg-black/20"
                                                    />
                                                    {data.bid_amount &&
                                                        (Number(
                                                            data.bid_amount,
                                                        ) < quest.min_salary ||
                                                            Number(
                                                                data.bid_amount,
                                                            ) >
                                                                quest.max_salary) && (
                                                            <p className="mt-1 flex items-center gap-1 font-['Orbitron'] text-[9px] font-bold tracking-wider text-amber-600 uppercase dark:text-amber-400">
                                                                ⚠️ Di luar
                                                                budget (
                                                                {formatCurrency(
                                                                    quest.min_salary,
                                                                )}{' '}
                                                                -{' '}
                                                                {formatCurrency(
                                                                    quest.max_salary,
                                                                )}
                                                                )
                                                            </p>
                                                        )}
                                                    {errors.bid_amount && (
                                                        <p className="text-xs font-semibold text-red-500">
                                                            {errors.bid_amount}
                                                        </p>
                                                    )}
                                                </div>

                                                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                                    {/* CV details / link */}
                                                    <div className="space-y-1.5">
                                                        <label className="text-xs font-bold text-slate-600 uppercase dark:text-blue-200">
                                                            Tautan / Deskripsi
                                                            CV
                                                        </label>
                                                        <input
                                                            type="text"
                                                            placeholder="Contoh: linktr.ee/cv-saya"
                                                            value={data.cv}
                                                            onChange={(e) =>
                                                                setData(
                                                                    'cv',
                                                                    e.target
                                                                        .value,
                                                                )
                                                            }
                                                            className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-xs text-slate-800 focus:border-indigo-500 focus:outline-none dark:border-slate-800 dark:bg-black/20 dark:text-white"
                                                        />
                                                        {errors.cv && (
                                                            <p className="text-xs font-semibold text-red-500">
                                                                {errors.cv}
                                                            </p>
                                                        )}
                                                    </div>

                                                    {/* Portfolio links */}
                                                    <div className="space-y-1.5">
                                                        <label className="text-xs font-bold text-slate-600 uppercase dark:text-blue-200">
                                                            Tautan Portofolio
                                                        </label>
                                                        <input
                                                            type="text"
                                                            placeholder="Contoh: github.com/username"
                                                            value={
                                                                data.portfolio
                                                            }
                                                            onChange={(e) =>
                                                                setData(
                                                                    'portfolio',
                                                                    e.target
                                                                        .value,
                                                                )
                                                            }
                                                            className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-xs text-slate-800 focus:border-indigo-500 focus:outline-none dark:border-slate-800 dark:bg-black/20 dark:text-white"
                                                        />
                                                        {errors.portfolio && (
                                                            <p className="text-xs font-semibold text-red-500">
                                                                {
                                                                    errors.portfolio
                                                                }
                                                            </p>
                                                        )}
                                                    </div>
                                                </div>

                                                {/* Proposal message */}
                                                <div className="space-y-1.5">
                                                    <label className="text-xs font-bold text-slate-600 uppercase dark:text-blue-200">
                                                        Pesan Proposal
                                                    </label>
                                                    <textarea
                                                        placeholder="Tuliskan mengapa Anda adalah kandidat yang paling tepat untuk menyelesaikan tugas ini..."
                                                        rows={4}
                                                        value={data.proposal}
                                                        onChange={(e) =>
                                                            setData(
                                                                'proposal',
                                                                e.target.value,
                                                            )
                                                        }
                                                        className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-xs text-slate-800 focus:border-indigo-500 focus:outline-none dark:border-slate-800 dark:bg-black/20 dark:text-white"
                                                    />
                                                    {errors.proposal && (
                                                        <p className="text-xs font-semibold text-red-500">
                                                            {errors.proposal}
                                                        </p>
                                                    )}
                                                </div>

                                                {/* Submit Button */}
                                                <button
                                                    type="submit"
                                                    disabled={processing}
                                                    className="w-full transform cursor-pointer rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 py-3 font-['Orbitron'] text-xs font-black tracking-widest text-white uppercase shadow-md transition-all duration-300 hover:scale-[1.01] hover:from-indigo-500 hover:to-purple-500 hover:shadow-lg hover:shadow-indigo-500/20 active:scale-[0.99] disabled:opacity-50 sm:text-sm"
                                                >
                                                    {processing
                                                        ? 'Mengajukan...'
                                                        : 'Kirim Lamaran Quest'}
                                                </button>
                                            </form>
                                        ) : (
                                            /* CANNOT BID (E.G. QUEST CLOSED, ALREADY ONGOING, OR USER NOT STUDENT) */
                                            <div className="py-8 text-center font-['Oxanium'] text-slate-400 dark:text-blue-300/40">
                                                <Briefcase className="mx-auto mb-2 h-10 w-10 text-indigo-500 opacity-50" />
                                                <p className="font-['Orbitron'] text-xs font-bold tracking-wider uppercase">
                                                    Bidding Ditutup
                                                </p>
                                                <p className="mt-1 text-[11px] text-slate-500">
                                                    Quest berstatus
                                                    ongoing/completed atau Anda
                                                    login sebagai administrator.
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                )}

                                {/* VERSION CONTROL HISTORY */}
                                {quest.submission_history &&
                                    quest.submission_history.length > 0 && (
                                        <div className="space-y-4 rounded-2xl border border-slate-200 bg-white/70 p-6 font-['Oxanium'] shadow-md backdrop-blur-md transition-all duration-300 dark:border-slate-800/80 dark:bg-[#0c122c]/40">
                                            <h3 className="border-b border-slate-100 pb-3 font-['Orbitron'] text-xs font-bold tracking-wider text-slate-700 uppercase dark:border-slate-800 dark:text-blue-200">
                                                Riwayat Penyerahan Berkas
                                                (Version Control)
                                            </h3>
                                            <div className="max-h-[300px] space-y-3 overflow-y-auto pr-1">
                                                {quest.submission_history.map(
                                                    (historyItem) => (
                                                        <div
                                                            key={
                                                                historyItem.version
                                                            }
                                                            className="border-slate-150 flex items-center justify-between gap-4 rounded-xl border bg-slate-50/50 p-3 dark:border-slate-800 dark:bg-black/10"
                                                        >
                                                            <div className="min-w-0 space-y-1">
                                                                <div className="flex items-center gap-2">
                                                                    <span className="rounded bg-indigo-500/10 px-1.5 py-0.5 font-['Orbitron'] text-[10px] font-bold text-indigo-600 uppercase dark:text-indigo-400">
                                                                        v
                                                                        {
                                                                            historyItem.version
                                                                        }
                                                                    </span>
                                                                    <span className="text-[10px] text-slate-400">
                                                                        {historyItem.submitted_at
                                                                            ? formatDate(
                                                                                  historyItem.submitted_at,
                                                                              )
                                                                            : ''}
                                                                    </span>
                                                                </div>
                                                                {historyItem.submission_note && (
                                                                    <p className="text-slate-650 dark:text-slate-350 truncate text-xs">
                                                                        {
                                                                            historyItem.submission_note
                                                                        }
                                                                    </p>
                                                                )}
                                                                {historyItem.submission_link && (
                                                                    <a
                                                                        href={
                                                                            historyItem.submission_link
                                                                        }
                                                                        target="_blank"
                                                                        rel="noopener noreferrer"
                                                                        className="block truncate text-[11px] text-indigo-500 hover:underline"
                                                                    >
                                                                        {
                                                                            historyItem.submission_link
                                                                        }
                                                                    </a>
                                                                )}
                                                            </div>
                                                            {historyItem.submission_file && (
                                                                <a
                                                                    href={
                                                                        historyItem
                                                                            .submission_file
                                                                            .url
                                                                    }
                                                                    target="_blank"
                                                                    rel="noopener noreferrer"
                                                                    className="flex shrink-0 cursor-pointer items-center justify-center rounded-lg p-2 text-indigo-500 transition-colors hover:bg-indigo-500/10 hover:text-indigo-700"
                                                                    title={`Unduh versi ${historyItem.version}`}
                                                                >
                                                                    <Download className="h-4 w-4" />
                                                                </a>
                                                            )}
                                                        </div>
                                                    ),
                                                )}
                                            </div>
                                        </div>
                                    )}

                                {/* DISPUTE SYSTEM CARD */}
                                {(isCreator || isWorker) &&
                                    [
                                        'ongoing',
                                        'submitted',
                                        'approved',
                                    ].includes(quest.status) && (
                                        <div className="space-y-4 rounded-2xl border border-slate-200 bg-white/70 p-6 font-['Oxanium'] shadow-md backdrop-blur-md transition-all duration-300 dark:border-slate-800/80 dark:bg-[#0c122c]/40">
                                            <h3 className="flex items-center gap-2 border-b border-slate-100 pb-3 font-['Orbitron'] text-xs font-bold tracking-wider text-slate-700 uppercase dark:border-slate-800 dark:text-blue-200">
                                                <ShieldAlert
                                                    size={15}
                                                    className="text-amber-505 animate-pulse"
                                                />
                                                Pusat Bantuan & Penyelesaian
                                                Sengketa
                                            </h3>
                                            <p className="text-xs leading-relaxed font-medium text-slate-500 dark:text-blue-300/60">
                                                Apakah ada kendala besar,
                                                ketidaksesuaian deliverables,
                                                atau wanprestasi dari pihak
                                                lawan? Anda dapat mengajukan
                                                banding agar Admin masuk sebagai
                                                mediator (arbitrase).
                                            </p>
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    setShowDisputeModal(true)
                                                }
                                                className="w-full cursor-pointer rounded-xl border border-amber-500/20 bg-amber-500/10 py-2.5 text-center font-['Orbitron'] text-xs font-bold tracking-wider text-amber-600 uppercase transition-all hover:bg-amber-500/20 dark:text-amber-300"
                                            >
                                                Ajukan Banding (Dispute)
                                            </button>
                                        </div>
                                    )}
                            </div>
                        )}

                        {/* TAB 3: BIDS / APPLICANTS LIST (Creator Only, Quest Open) */}
                        {activeTab === 'bids' &&
                            isCreator &&
                            quest.status === 'open' && (
                                <div className="space-y-5 rounded-2xl border border-slate-200 bg-white/70 p-6 shadow-md backdrop-blur-md transition-all duration-300 dark:border-slate-800/80 dark:bg-[#0c122c]/40">
                                    <div className="flex items-center justify-between border-b border-slate-100 pb-3 dark:border-slate-800">
                                        <h3 className="font-['Orbitron'] text-sm font-bold tracking-wider text-slate-800 uppercase dark:text-blue-200">
                                            Pelamar yang Mendaftar
                                        </h3>
                                        <span className="text-purple-650 rounded-md border border-purple-500/20 bg-purple-500/10 px-2 py-0.5 text-xs font-semibold dark:text-purple-300">
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
                                        (() => {
                                            const sortedBids = [...bids].sort(
                                                (a, b) => {
                                                    const aShort =
                                                        shortlistedBidIds.includes(
                                                            a._id,
                                                        )
                                                            ? 1
                                                            : 0;
                                                    const bShort =
                                                        shortlistedBidIds.includes(
                                                            b._id,
                                                        )
                                                            ? 1
                                                            : 0;
                                                    const aArch =
                                                        archivedBidIds.includes(
                                                            a._id,
                                                        )
                                                            ? 1
                                                            : 0;
                                                    const bArch =
                                                        archivedBidIds.includes(
                                                            b._id,
                                                        )
                                                            ? 1
                                                            : 0;
                                                    if (aShort !== bShort)
                                                        return bShort - aShort;
                                                    return aArch - bArch;
                                                },
                                            );

                                            return (
                                                <div className="grid max-h-[750px] grid-cols-1 gap-4 overflow-y-auto pr-1 sm:grid-cols-2">
                                                    {sortedBids.map((bid) => {
                                                        const isShortlisted =
                                                            shortlistedBidIds.includes(
                                                                bid._id,
                                                            );
                                                        const isArchived =
                                                            archivedBidIds.includes(
                                                                bid._id,
                                                            );

                                                        return (
                                                            <div
                                                                key={bid._id}
                                                                className={`group relative flex flex-col justify-between gap-3.5 rounded-xl border p-4 transition-all duration-350 ${
                                                                    bid.status ===
                                                                    'accepted'
                                                                        ? 'border-green-500/35 bg-green-500/10'
                                                                        : bid.status ===
                                                                            'rejected'
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
                                                                        <div className="ml-2 flex shrink-0 items-center gap-1">
                                                                            <span className="mr-1 font-['Orbitron'] text-xs font-black text-purple-600 dark:text-purple-300">
                                                                                {formatCurrency(
                                                                                    bid.bid_amount,
                                                                                )}
                                                                            </span>
                                                                            {bid.status ===
                                                                                'pending' && (
                                                                                <>
                                                                                    <button
                                                                                        type="button"
                                                                                        onClick={() => {
                                                                                            if (
                                                                                                isShortlisted
                                                                                            ) {
                                                                                                setShortlistedBidIds(
                                                                                                    (
                                                                                                        prev,
                                                                                                    ) =>
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
                                                                                                    (
                                                                                                        prev,
                                                                                                    ) => [
                                                                                                        ...prev,
                                                                                                        bid._id,
                                                                                                    ],
                                                                                                );
                                                                                                setArchivedBidIds(
                                                                                                    (
                                                                                                        prev,
                                                                                                    ) =>
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
                                                                                        className={`cursor-pointer rounded-lg border p-1 transition-colors ${
                                                                                            isShortlisted
                                                                                                ? 'border-amber-405 bg-amber-500/10 text-amber-500 hover:bg-amber-500/20'
                                                                                                : 'bg-slate-55 border-slate-200 text-slate-400 hover:text-amber-500 dark:border-slate-800 dark:bg-slate-800'
                                                                                        }`}
                                                                                        title={
                                                                                            isShortlisted
                                                                                                ? 'Batal Unggul'
                                                                                                : 'Shortlist (Unggulan)'
                                                                                        }
                                                                                    >
                                                                                        <Star
                                                                                            size={
                                                                                                11
                                                                                            }
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
                                                                                            if (
                                                                                                isArchived
                                                                                            ) {
                                                                                                setArchivedBidIds(
                                                                                                    (
                                                                                                        prev,
                                                                                                    ) =>
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
                                                                                                    (
                                                                                                        prev,
                                                                                                    ) => [
                                                                                                        ...prev,
                                                                                                        bid._id,
                                                                                                    ],
                                                                                                );
                                                                                                setShortlistedBidIds(
                                                                                                    (
                                                                                                        prev,
                                                                                                    ) =>
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
                                                                                        className={`cursor-pointer rounded-lg border p-1 transition-colors ${
                                                                                            isArchived
                                                                                                ? 'border-slate-500 bg-slate-500/15 text-slate-600 dark:text-slate-400'
                                                                                                : 'border-slate-200 bg-slate-50 text-slate-400 hover:text-slate-600 dark:border-slate-800 dark:bg-slate-800'
                                                                                        }`}
                                                                                        title={
                                                                                            isArchived
                                                                                                ? 'Tampilkan Kembali'
                                                                                                : 'Arsipkan Penawaran'
                                                                                        }
                                                                                    >
                                                                                        {isArchived ? (
                                                                                            <Eye
                                                                                                size={
                                                                                                    11
                                                                                                }
                                                                                            />
                                                                                        ) : (
                                                                                            <EyeOff
                                                                                                size={
                                                                                                    11
                                                                                                }
                                                                                            />
                                                                                        )}
                                                                                    </button>
                                                                                </>
                                                                            )}
                                                                        </div>
                                                                    </div>

                                                                    <div className="space-y-1.5 rounded-lg border border-slate-100 bg-white/50 p-2.5 font-['Oxanium'] text-xs text-slate-500 dark:border-slate-800/40 dark:bg-black/20 dark:text-slate-300">
                                                                        <p className="line-clamp-3 leading-relaxed">
                                                                            <strong className="mb-0.5 block text-[8px] tracking-wider text-slate-400 uppercase">
                                                                                Proposal
                                                                            </strong>
                                                                            {
                                                                                bid.proposal
                                                                            }
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
                                                                                CV
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
                                                                    {quest.status ===
                                                                        'open' &&
                                                                        bid.status ===
                                                                            'pending' && (
                                                                            <button
                                                                                onClick={() =>
                                                                                    handleAcceptBid(
                                                                                        bid._id,
                                                                                    )
                                                                                }
                                                                                className="flex-1 cursor-pointer rounded-lg bg-green-600 py-1.5 font-['Orbitron'] text-[10px] font-bold tracking-wider text-white uppercase shadow-sm transition-all duration-300 hover:bg-green-700"
                                                                            >
                                                                                Terima
                                                                            </button>
                                                                        )}
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
                                                        );
                                                    })}
                                                </div>
                                            );
                                        })()
                                    )}
                                </div>
                            )}
                    </div>

                    {/* RIGHT COLUMN: SIDEBAR SPECIFICATION CARDS (col-span-4) */}
                    <div className="space-y-6 lg:col-span-4">
                        {/* SPECIFICATION CARD */}
                        <div className="space-y-5 rounded-2xl border border-slate-200 bg-white/70 p-6 font-['Oxanium'] shadow-md backdrop-blur-md transition-all duration-300 dark:border-slate-800/80 dark:bg-[#0c122c]/40">
                            <h3 className="border-b border-slate-100 pb-3 font-['Orbitron'] text-xs font-bold tracking-wider text-slate-700 uppercase dark:border-slate-800 dark:text-blue-200">
                                Rincian Quest
                            </h3>

                            {/* Budget Spec */}
                            <div className="flex items-center gap-3">
                                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-purple-500/20 bg-purple-500/10 text-purple-600 dark:text-purple-400">
                                    <DollarSign className="h-5 w-5" />
                                </div>
                                <div>
                                    <span className="block text-[10px] font-semibold tracking-wider text-slate-400 uppercase">
                                        Gaji / Anggaran
                                    </span>
                                    <span className="font-['Orbitron'] text-sm font-bold text-slate-800 dark:text-white">
                                        {formatCurrency(quest.min_salary)} -{' '}
                                        {formatCurrency(quest.max_salary)}
                                    </span>
                                </div>
                            </div>

                            {/* Deadline Spec */}
                            <div className="flex items-center gap-3">
                                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-indigo-500/20 bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
                                    <Calendar className="h-5 w-5" />
                                </div>
                                <div>
                                    <span className="text-slate-405 block text-[10px] font-semibold tracking-wider uppercase">
                                        Tenggat Waktu
                                    </span>
                                    <span className="text-xs font-bold text-slate-800 sm:text-sm dark:text-white">
                                        {formatDate(quest.deadline)}
                                    </span>
                                </div>
                            </div>

                            {/* Countdown Progress */}
                            {quest.status === 'open' && (
                                <div className="pt-2">
                                    <div className="mb-1 flex items-center justify-between text-[10px] font-bold text-slate-400 uppercase">
                                        <span>Estimasi Waktu</span>
                                        <span className="font-['Orbitron'] text-indigo-600 dark:text-indigo-400">
                                            {calculateDaysRemaining()}
                                        </span>
                                    </div>
                                    <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
                                        <div className="h-full w-[65%] rounded-full bg-indigo-600" />
                                    </div>
                                </div>
                            )}

                            {/* RPG Rewards Container */}
                            <div className="space-y-3 border-t border-slate-100 pt-4 dark:border-slate-800">
                                <span className="block font-['Orbitron'] text-[10px] font-bold tracking-wider text-purple-600 uppercase dark:text-purple-400">
                                    🎁 RPG Quest Rewards
                                </span>
                                <div className="grid grid-cols-3 gap-2 text-center font-['Orbitron'] text-xs font-bold">
                                    <div className="flex flex-col items-center rounded-xl border border-purple-500/20 bg-purple-500/10 py-2.5 text-purple-600 transition-transform hover:scale-[1.03] dark:text-purple-300">
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
                                    <div className="flex flex-col items-center rounded-xl border border-indigo-500/20 bg-indigo-500/10 py-2.5 text-indigo-600 transition-transform hover:scale-[1.03] dark:text-indigo-300">
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

                        {/* WORKER SUMMARY (Right column shortcut) */}
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

            {/* Chat Panel Overlay */}
            {selectedChatBid && (
                <QuestChatPanel
                    bidId={selectedChatBid.id}
                    questTitle={quest.title}
                    targetUserName={selectedChatBid.name}
                    onClose={() => {
                        setSelectedChatBid(null);
                        router.reload({ only: ['bids', 'myBid'] });
                    }}
                />
            )}

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
                        post(
                            `/student/quests/${quest._id}/accept-bid/${acceptBidId}`,
                        );
                    }
                }}
                onClose={() => setAcceptBidId(null)}
            />
            {/* Dispute Modal */}
            {showDisputeModal && (
                <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
                    <div
                        onClick={() => setShowDisputeModal(false)}
                        className="absolute inset-0 cursor-pointer bg-black/60 backdrop-blur-sm"
                    />
                    <div className="relative z-10 w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 font-['Oxanium'] shadow-2xl dark:border-slate-800 dark:bg-slate-900">
                        <h3 className="mb-2 flex items-center gap-2 font-['Orbitron'] text-base font-bold tracking-wider text-slate-800 uppercase sm:text-lg dark:text-amber-400">
                            <ShieldAlert className="text-amber-500" />
                            Ajukan Dispute / Banding
                        </h3>
                        <p className="mb-4 text-xs text-slate-500 dark:text-slate-400">
                            Jelaskan kendala atau dasar perselisihan yang Anda
                            alami. Laporan ini akan dipelajari oleh Admin untuk
                            dilakukan arbitrase.
                        </p>

                        <form
                            onSubmit={handleDisputeSubmit}
                            className="space-y-4"
                        >
                            <div className="space-y-1.5">
                                <label className="text-[10px] font-bold text-slate-500 uppercase dark:text-slate-400">
                                    Alasan & Kronologi Banding{' '}
                                    <span className="text-red-500">*</span>
                                </label>
                                <textarea
                                    required
                                    placeholder="Tuliskan detail kronologi dan alasan mengapa Anda mengajukan dispute..."
                                    rows={4}
                                    value={disputeForm.data.reason}
                                    onChange={(e) =>
                                        disputeForm.setData(
                                            'reason',
                                            e.target.value,
                                        )
                                    }
                                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-800 focus:border-amber-500 focus:outline-none dark:border-slate-800 dark:bg-black/20 dark:text-white"
                                />
                                {disputeForm.errors.reason && (
                                    <p className="text-xs font-semibold text-red-500">
                                        {disputeForm.errors.reason}
                                    </p>
                                )}
                            </div>

                            <div className="flex justify-end gap-2 pt-2">
                                <button
                                    type="button"
                                    onClick={() => setShowDisputeModal(false)}
                                    className="cursor-pointer rounded-xl bg-slate-100 px-4 py-2 text-xs font-semibold text-slate-700 uppercase transition-all hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
                                >
                                    Batal
                                </button>
                                <button
                                    type="submit"
                                    disabled={disputeForm.processing}
                                    className="cursor-pointer rounded-xl bg-amber-600 px-4 py-2 font-['Orbitron'] text-xs font-semibold text-white uppercase transition-all hover:bg-amber-700 disabled:opacity-50"
                                >
                                    {disputeForm.processing
                                        ? 'Mengirim...'
                                        : 'Kirim Laporan'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
