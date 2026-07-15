import { Link, router, usePage, useForm } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import {
    ArrowLeft,
    Calendar,
    DollarSign,
    Briefcase,
    FileText,
    User,
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
import QuestRewardsCard from '@/components/Quest/QuestRewardsCard';

import RevisionHistory from '@/components/Quest/RevisionHistory';
import QuestStepper from '@/components/Quest/QuestStepper';
import QuestAttachments from '@/components/Quest/QuestAttachments';
import { Quest, Bid } from '@/types/quest';
import AdminModerationCard from '@/components/Quest/Admin/AdminModerationCard';
import AdminEscrowPanel from '@/components/Quest/Admin/AdminEscrowPanel';
import AdminProjectTabPanel from '@/components/Quest/Admin/AdminProjectTabPanel';
import AdminBidsTabPanel from '@/components/Quest/Admin/AdminBidsTabPanel';
import AdminArbitrationTabPanel from '@/components/Quest/Admin/AdminArbitrationTabPanel';

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

    const [showArbitrateConfirm, setShowArbitrateConfirm] = useState(false);

    const handleArbitrate = (e: React.FormEvent) => {
        e.preventDefault();
        setShowArbitrateConfirm(true);
    };

    const handleConfirmArbitrate = () => {
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

    // Calculate days remaining
    const calculateDaysRemaining = () => {
        const now = new Date();
        const deadlineDate = new Date(quest.deadline);
        const diff = deadlineDate.getTime() - now.getTime();

        if (['completed', 'approved'].includes(quest.status)) {
            return {
                text: 'Selesai',
                className:
                    'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20',
                isExpired: false,
                isLate: false,
            };
        }

        if (quest.status === 'cancelled') {
            return {
                text: 'Dibatalkan',
                className:
                    'bg-red-500/10 text-red-600 dark:text-red-400 border border-red-500/20',
                isExpired: false,
                isLate: false,
            };
        }

        if (diff > 0) {
            const days = Math.floor(diff / (1000 * 60 * 60 * 24));
            const hours = Math.floor(
                (diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60),
            );
            const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

            let timeStr = '';
            if (days > 0) {
                timeStr = `${days}h ${hours}j Tersisa`;
            } else if (hours > 0) {
                timeStr = `${hours}j ${minutes}m ...`;
            } else {
                timeStr = `${minutes}m Tersisa`;
            }

            return {
                text: timeStr,
                className:
                    'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20',
                isExpired: false,
                isLate: false,
            };
        } else {
            const absDiff = Math.abs(diff);
            const days = Math.floor(absDiff / (1000 * 60 * 60 * 24));
            const hours = Math.floor(
                (absDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60),
            );

            let lateStr = '';
            if (days > 0) {
                lateStr = `${days}h ${hours}j`;
            } else {
                lateStr = `${hours}j`;
            }

            if (quest.status === 'open' || quest.status === 'draft') {
                return {
                    text: 'Pendaftaran Ditutup (Expired)',
                    className:
                        'bg-slate-500/10 text-slate-600 dark:text-slate-400 border border-slate-500/20',
                    isExpired: true,
                    isLate: false,
                };
            } else {
                return {
                    text: `Terlambat ${lateStr}`,
                    className:
                        'bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20 font-bold',
                    isExpired: true,
                    isLate: true,
                };
            }
        }
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
                    {/* 1. RPG HERO QUEST HEADER */}
                    <div className="relative overflow-hidden rounded-3xl border border-slate-200 bg-gradient-to-br from-white to-slate-50/50 p-6 shadow-xl dark:border-[#1d2645] dark:from-[#0d1226]/85 dark:to-[#090d1a]/95">
                        {/* Decorative abstract glows */}
                        <div className="absolute top-0 right-0 -z-10 h-32 w-32 rounded-full bg-indigo-500/10 blur-2xl" />
                        <div className="absolute bottom-0 left-0 -z-10 h-24 w-24 rounded-full bg-purple-500/10 blur-xl" />

                        <div className="space-y-6">
                            {/* Breadcrumbs & Badge */}
                            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                                <Link
                                    href="/admin/quests"
                                    className="inline-flex items-center gap-2 font-['Orbitron'] text-xs font-bold tracking-widest text-slate-500 uppercase transition-colors hover:text-indigo-600 dark:text-slate-400 dark:hover:text-indigo-400"
                                >
                                    <ArrowLeft size={14} />
                                    Kembali ke Daftar Quest
                                </Link>

                                <div>
                                    <span
                                        className={`rounded-xl border px-4 py-1.5 font-['Orbitron'] text-xs font-black tracking-wider uppercase ${
                                            quest.status === 'open'
                                                ? 'border-green-500/20 bg-green-500/10 text-green-700 dark:text-green-400'
                                                : quest.status === 'draft'
                                                  ? 'border-amber-500/20 bg-amber-500/10 text-amber-700 dark:text-amber-400'
                                                  : quest.status === 'rejected'
                                                    ? 'border-red-500/20 bg-red-500/10 text-red-700 dark:text-red-400'
                                                    : quest.status === 'expired'
                                                      ? 'border-red-500/20 bg-red-500/10 text-red-700 dark:text-red-400'
                                                      : quest.status ===
                                                          'ongoing'
                                                        ? 'border-blue-500/20 bg-blue-500/10 text-blue-700 dark:text-blue-400'
                                                        : quest.status ===
                                                            'approved'
                                                          ? 'border-purple-500/20 bg-purple-500/10 text-purple-700 dark:text-purple-400'
                                                          : quest.status ===
                                                              'payment'
                                                            ? 'border-amber-500/25 bg-amber-500/10 text-amber-700 dark:text-amber-400'
                                                            : quest.status ===
                                                                'submitted'
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
                                                    : quest.status ===
                                                        'approved'
                                                      ? 'Disetujui'
                                                      : quest.status ===
                                                          'payment'
                                                        ? 'Pembayaran'
                                                        : quest.status ===
                                                            'submitted'
                                                          ? 'Ditinjau'
                                                          : 'Selesai'}
                                    </span>
                                </div>
                            </div>

                            {/* Title and Creator Info */}
                            <div className="space-y-3 font-['Oxanium']">
                                <div className="flex items-center gap-2">
                                    <span className="font-['Orbitron'] text-[10px] font-black tracking-widest text-indigo-600 uppercase dark:text-indigo-400">
                                        Quest Moderation Portal
                                    </span>
                                </div>
                                <h1 className="text-2xl leading-tight font-extrabold tracking-tight text-slate-900 sm:text-3xl md:text-4xl dark:text-white">
                                    {quest.title}
                                </h1>

                                <div className="flex items-center gap-2.5 text-xs text-slate-500 sm:text-sm dark:text-blue-300/80">
                                    <div className="flex h-7 w-7 items-center justify-center rounded-full border border-indigo-500/20 bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
                                        <User className="h-3.5 w-3.5" />
                                    </div>
                                    <div>
                                        <span className="mr-1 text-[10px] font-semibold text-slate-400 uppercase">
                                            Pembuat:
                                        </span>
                                        <span className="font-bold text-slate-800 dark:text-white">
                                            {quest.creator?.name ?? 'Unknown'}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Stepper Progress Timeline */}
                            <QuestStepper status={quest.status} />

                            {/* Stats Metrics Subgrid */}
                            <div className="grid grid-cols-1 gap-4 border-t border-slate-200/60 pt-6 sm:grid-cols-3 dark:border-slate-800/60">
                                <div className="flex items-center gap-4 rounded-2xl border border-slate-200/50 bg-white/40 p-4 shadow-sm backdrop-blur-sm dark:border-slate-800/40 dark:bg-black/10">
                                    <div className="shrink-0 rounded-xl bg-indigo-500/10 p-3 text-indigo-600 dark:text-indigo-400">
                                        <TrendingUp className="h-5 w-5" />
                                    </div>
                                    <div>
                                        <span className="block text-[10px] font-bold tracking-wider text-slate-400 uppercase">
                                            Total Penawaran
                                        </span>
                                        <span className="text-base font-extrabold text-slate-900 dark:text-white">
                                            {bids.length} Bid
                                        </span>
                                    </div>
                                </div>

                                <div className="flex items-center gap-4 rounded-2xl border border-slate-200/50 bg-white/40 p-4 shadow-sm backdrop-blur-sm dark:border-slate-800/40 dark:bg-black/10">
                                    <div className="shrink-0 rounded-xl bg-purple-500/10 p-3 text-purple-600 dark:text-purple-400">
                                        <DollarSign className="h-5 w-5" />
                                    </div>
                                    <div>
                                        <span className="block text-[10px] font-bold tracking-wider text-slate-400 uppercase">
                                            Rata-Rata Penawaran
                                        </span>
                                        <span className="text-base font-extrabold text-slate-900 dark:text-white">
                                            {averageBid > 0
                                                ? formatCurrency(averageBid)
                                                : 'Rp 0'}
                                        </span>
                                    </div>
                                </div>

                                <div className="flex items-center gap-4 rounded-2xl border border-slate-200/50 bg-white/40 p-4 shadow-sm backdrop-blur-sm dark:border-slate-800/40 dark:bg-black/10">
                                    <div className="shrink-0 rounded-xl bg-blue-500/10 p-3 text-blue-600 dark:text-blue-400">
                                        <Briefcase className="h-5 w-5" />
                                    </div>
                                    <div className="min-w-0 flex-1">
                                        <span className="block text-[10px] font-bold tracking-wider text-slate-400 uppercase">
                                            Rentang Anggaran
                                        </span>
                                        <span className="text-xs font-black text-slate-900 dark:text-white">
                                            {formatCurrency(quest.min_salary)} -{' '}
                                            {formatCurrency(quest.max_salary)}
                                        </span>
                                        {quest.accepted_bid_amount && (
                                            <div className="mt-1 flex items-center gap-1 text-[10px] font-bold text-emerald-600 dark:text-emerald-400">
                                                <span>Kontrak:</span>
                                                <span>
                                                    {formatCurrency(
                                                        quest.accepted_bid_amount,
                                                    )}
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* MAIN TWO-COLUMN LAYOUT */}
                    <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-12">
                        {/* LEFT COLUMN: TABS & CONTENT PANELS (lg:col-span-8) */}
                        <div className="space-y-6 lg:col-span-8">
                            {/* Moderation Post Card */}
                            <AdminModerationCard
                                quest={quest}
                                setShowApprovePostConfirm={
                                    setShowApprovePostConfirm
                                }
                                setShowRejectPostForm={setShowRejectPostForm}
                            />

                            {/* Escrow Ledger & Financial Status Panel */}
                            <AdminEscrowPanel
                                quest={quest}
                                formatCurrency={formatCurrency}
                            />

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
                                    <QuestAttachments
                                        images={quest.images}
                                        files={quest.files}
                                        onPreviewImage={setPreviewImage}
                                    />
                                </div>
                            )}

                            {/* TAB 2: PROJECT WORKFLOW & VERIFICATION */}
                            {activeTab === 'project' && (
                                <AdminProjectTabPanel
                                    quest={quest}
                                    bids={bids}
                                    setSelectedChatBid={setSelectedChatBid}
                                    formatBytes={formatBytes}
                                    showApproveForm={showApproveForm}
                                    setShowApproveForm={setShowApproveForm}
                                    showRejectForm={showRejectForm}
                                    setShowRejectForm={setShowRejectForm}
                                    approveForm={approveForm}
                                    rejectForm={rejectForm}
                                    handleApproveWork={handleApproveWork}
                                    handleRejectWork={handleRejectWork}
                                />
                            )}

                            {/* TAB 3: BIDS / CANDIDATES */}
                            {activeTab === 'bids' && (
                                <AdminBidsTabPanel
                                    quest={quest}
                                    bids={bids}
                                    formatCurrency={formatCurrency}
                                    handleAcceptBid={handleAcceptBid}
                                    handleDeleteBid={handleDeleteBid}
                                    setSelectedChatBid={setSelectedChatBid}
                                />
                            )}

                            {/* TAB 4: ARBITRATION & CONTROL */}
                            {activeTab === 'arbitration' && (
                                <AdminArbitrationTabPanel
                                    quest={quest}
                                    transactions={transactions}
                                    formatDate={formatDate}
                                    formatCurrency={formatCurrency}
                                    extendDeadlineForm={extendDeadlineForm}
                                    handleExtendDeadline={handleExtendDeadline}
                                    handleReopenBidding={handleReopenBidding}
                                    handleForceCancel={handleForceCancel}
                                    handleArbitrate={handleArbitrate}
                                    arbitrateForm={arbitrateForm}
                                    setSelectedChatBid={setSelectedChatBid}
                                    bids={bids}
                                />
                            )}
                        </div>

                        {/* RIGHT COLUMN: SIDEBAR METADATA INFO (lg:col-span-4) */}
                        <div className="space-y-6 lg:col-span-4">
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
                                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-indigo-500/20 bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
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

                                    {/* Countdown Progress */}
                                    {[
                                        'open',
                                        'ongoing',
                                        'submitted',
                                        'disputed',
                                        'expired',
                                    ].includes(quest.status) &&
                                        (() => {
                                            const remaining =
                                                calculateDaysRemaining();
                                            return (
                                                <div className="pt-2">
                                                    <div className="flex items-center justify-between text-[10px] font-bold text-slate-400 uppercase">
                                                        <span>
                                                            {remaining.isLate
                                                                ? 'Status Keterlambatan'
                                                                : 'Sisa Waktu'}
                                                        </span>
                                                        <span
                                                            className={`rounded px-2 py-0.5 font-['Orbitron'] text-[10px] font-bold tracking-wider ${remaining.className}`}
                                                        >
                                                            {remaining.text}
                                                        </span>
                                                    </div>
                                                </div>
                                            );
                                        })()}
                                </div>

                                {/* RPG Rewards */}
                                <QuestRewardsCard rewards={quest.rewards} />
                            </div>
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
                    isDisputed={quest.status === 'disputed'}
                    creatorId={quest.creator_id}
                    workerId={quest.worker_id ?? undefined}
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

            {/* Confirm Modal Arbitrase Verdict */}
            <ConfirmModal
                open={showArbitrateConfirm}
                title="Kirim Vonis Arbitrase"
                message={`Apakah Anda yakin ingin menetapkan keputusan "${
                    arbitrateForm.data.ruling === 'refund'
                        ? 'Batalkan & Refund'
                        : arbitrateForm.data.ruling === 'pay_worker'
                          ? 'Bayar Pekerja'
                          : `Bagi Hasil ${arbitrateForm.data.split_percentage}% Pekerja`
                }"? Keputusan ini bersifat final, mengikat kedua belah pihak, dan saldo reward akan langsung dicairkan/dikembalikan sesuai vonis.`}
                confirmText="Kirim Vonis"
                cancelText="Batal"
                variant={
                    arbitrateForm.data.ruling === 'pay_worker'
                        ? 'primary'
                        : 'danger'
                }
                onConfirm={handleConfirmArbitrate}
                onClose={() => setShowArbitrateConfirm(false)}
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
                                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-800 focus:border-red-500 focus:outline-none dark:border-slate-800 dark:bg-black/20 dark:text-white"
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
                                    className="cursor-pointer rounded-xl bg-red-600 px-4 py-2 font-['Orbitron'] text-xs font-semibold text-white uppercase transition-all hover:bg-red-700 disabled:opacity-50"
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
