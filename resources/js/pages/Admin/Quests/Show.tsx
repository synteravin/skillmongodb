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
    CheckCircle2
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

    // Define active tab
    const [activeTab, setActiveTab] = useState<'detail' | 'project' | 'bids'>('detail');

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
                className="relative min-h-screen overflow-hidden bg-slate-50 px-2 py-4 text-slate-800 transition-colors duration-205 sm:px-3 lg:px-5 dark:bg-[#060813] dark:text-white"
                style={{ fontFamily: "'Outfit', sans-serif" }}
            >
                {/* Ambient top-center glow */}
                <div className="pointer-events-none absolute top-0 left-1/2 z-0 h-[450px] w-full max-w-7xl -translate-x-1/2 rounded-full bg-indigo-500/5 blur-[120px] select-none" />

                <div className="relative z-10 mx-auto max-w-7xl space-y-6">
                    {/* BACK LINK & BADGE */}
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-200 dark:border-slate-800/80 pb-5">
                        <div className="space-y-1">
                            <Link
                                href="/admin/quests"
                                className="inline-flex items-center gap-1.5 text-xs font-bold tracking-widest text-slate-500 uppercase transition-colors hover:text-indigo-600 dark:text-slate-400 dark:hover:text-indigo-400 font-['Orbitron']"
                            >
                                <ArrowLeft size={14} />
                                Kembali ke Daftar Quest
                            </Link>
                            <h2 className="text-xl sm:text-2xl md:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white font-['Oxanium']">
                                {quest.title}
                            </h2>
                        </div>

                        <div className="flex items-center gap-3">
                            <span
                                className={`shrink-0 rounded-xl px-4 py-1.5 text-xs font-black uppercase tracking-wider font-['Orbitron'] border ${
                                    quest.status === 'open'
                                        ? 'bg-green-500/10 text-green-700 border-green-500/20 dark:text-green-400'
                                        : quest.status === 'draft'
                                        ? 'bg-amber-500/10 text-amber-700 border-amber-500/20 dark:text-amber-400'
                                        : quest.status === 'rejected'
                                        ? 'bg-red-500/10 text-red-700 border-red-500/20 dark:text-red-400'
                                        : quest.status === 'ongoing'
                                        ? 'bg-blue-500/10 text-blue-700 border-blue-500/20 dark:text-blue-400'
                                        : quest.status === 'approved'
                                        ? 'bg-purple-500/10 text-purple-700 border-purple-500/20 dark:text-purple-400'
                                        : quest.status === 'submitted'
                                        ? 'bg-yellow-500/10 text-yellow-700 border-yellow-500/20 dark:text-yellow-400'
                                        : 'bg-slate-500/10 text-slate-600 border-slate-500/20 dark:text-slate-400'
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

                    {/* METRICS / STATS OVERVIEW */}
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                        <div className="flex items-center gap-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white/70 dark:bg-[#0c122c]/40 p-4 shadow-sm backdrop-blur-md">
                            <div className="rounded-xl bg-indigo-500/10 p-3 text-indigo-600 dark:text-indigo-400 shrink-0">
                                <TrendingUp className="h-5 w-5" />
                            </div>
                            <div className="font-['Oxanium']">
                                <span className="block text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                                    Total Penawaran
                                </span>
                                <span className="text-base font-extrabold text-slate-900 dark:text-white font-['Orbitron']">
                                    {bids.length} Bid
                                </span>
                            </div>
                        </div>

                        <div className="flex items-center gap-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white/70 dark:bg-[#0c122c]/40 p-4 shadow-sm backdrop-blur-md">
                            <div className="rounded-xl bg-purple-500/10 p-3 text-purple-600 dark:text-purple-400 shrink-0">
                                <DollarSign className="h-5 w-5" />
                            </div>
                            <div className="font-['Oxanium']">
                                <span className="block text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                                    Rata-Rata Penawaran
                                </span>
                                <span className="text-base font-extrabold text-slate-900 dark:text-white font-['Orbitron']">
                                    {averageBid > 0 ? formatCurrency(averageBid) : 'Rp 0'}
                                </span>
                            </div>
                        </div>

                        <div className="flex items-center gap-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white/70 dark:bg-[#0c122c]/40 p-4 shadow-sm backdrop-blur-md">
                            <div className="rounded-xl bg-blue-500/10 p-3 text-blue-600 dark:text-blue-400 shrink-0">
                                <Briefcase className="h-5 w-5" />
                            </div>
                            <div className="font-['Oxanium']">
                                <span className="block text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                                    Rentang Anggaran
                                </span>
                                <span className="text-xs font-black text-slate-900 dark:text-white font-['Orbitron']">
                                    {formatCurrency(quest.min_salary)} - {formatCurrency(quest.max_salary)}
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
                                <div className="space-y-4 rounded-2xl border border-amber-500/20 bg-amber-500/5 p-6 shadow-md dark:bg-amber-955/10 font-['Oxanium']">
                                    <div className="border-b border-amber-500/10 pb-3">
                                        <span className="inline-block text-[10px] font-bold tracking-widest text-amber-600 uppercase dark:text-amber-400 font-['Orbitron']">
                                            ⚠️ Moderasi Posting Quest
                                        </span>
                                        <h3 className="text-sm font-bold text-slate-800 dark:text-amber-300 mt-1">
                                            Persetujuan Quest Baru
                                        </h3>
                                    </div>
                                    <p className="text-xs leading-relaxed text-slate-500 dark:text-slate-300">
                                        Quest ini dikirim oleh <strong>{quest.creator.name}</strong> dan membutuhkan persetujuan Anda sebagai administrator sebelum dipublikasikan ke papan quest publik.
                                    </p>

                                    <div className="flex gap-3 pt-2">
                                        <button
                                            onClick={() => setShowApprovePostConfirm(true)}
                                            className="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all cursor-pointer shadow-sm text-center font-['Orbitron']"
                                        >
                                            Setujui & Publikasikan
                                        </button>
                                        <button
                                            onClick={() => setShowRejectPostForm(true)}
                                            className="flex-1 py-2.5 bg-red-600 hover:bg-red-700 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all cursor-pointer shadow-sm text-center font-['Orbitron']"
                                        >
                                            Tolak Quest
                                        </button>
                                    </div>
                                </div>
                            )}

                            {quest.status === 'rejected' && (
                                <div className="space-y-3 rounded-2xl border border-red-500/20 bg-red-500/5 p-6 shadow-md dark:bg-red-955/10 font-['Oxanium']">
                                    <span className="inline-block text-[10px] font-bold tracking-widest text-red-600 uppercase dark:text-red-400 font-['Orbitron']">
                                        ❌ Quest Ditolak
                                    </span>
                                    <h3 className="text-sm font-bold text-red-600 dark:text-red-400">
                                        Status: Ditolak Admin
                                    </h3>
                                    {quest.rejection_note && (
                                        <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl space-y-1">
                                            <span className="block text-[9px] font-bold uppercase tracking-wider text-red-500">Catatan Penolakan Anda:</span>
                                            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed whitespace-pre-wrap">{quest.rejection_note}</p>
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* Stepper Progress Timeline */}
                            {quest.status !== 'draft' && quest.status !== 'rejected' && (
                                <div className="p-6 rounded-2xl bg-white/70 dark:bg-[#0c122c]/40 border border-slate-200 dark:border-slate-800 shadow-sm font-['Orbitron'] text-[9px] sm:text-[10px] font-bold tracking-wider space-y-4">
                                    <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100 dark:border-slate-800 pb-2">
                                        Alur Progress Quest
                                    </span>
                                    <div className="flex items-center justify-between relative pt-2">
                                        <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 h-0.5 bg-slate-200 dark:bg-slate-800/80 z-0" />
                                        <div 
                                            className="absolute left-0 top-1/2 -translate-y-1/2 h-0.5 bg-indigo-500 z-0 transition-all duration-500" 
                                            style={{
                                                width: quest.status === 'open' ? '0%'
                                                    : quest.status === 'ongoing' ? '25%'
                                                    : quest.status === 'submitted' ? '50%'
                                                    : quest.status === 'approved' ? '75%'
                                                    : '105%'
                                            }}
                                        />

                                        {[
                                            { key: 'open', label: 'Bidding' },
                                            { key: 'ongoing', label: 'Pengerjaan' },
                                            { key: 'submitted', label: 'Tinjauan' },
                                            { key: 'approved', label: 'Disetujui' },
                                            { key: 'completed', label: 'Selesai' }
                                        ].map((step, idx) => {
                                            const statuses = ['open', 'ongoing', 'submitted', 'approved', 'completed'];
                                            const currentIdx = statuses.indexOf(quest.status);
                                            const stepIdx = statuses.indexOf(step.key);
                                            const isCompleted = stepIdx < currentIdx || quest.status === 'completed';
                                            const isActive = quest.status === step.key;

                                            return (
                                                <div key={step.key} className="flex flex-col items-center z-10 relative">
                                                    <div 
                                                        className={`w-6 h-6 sm:w-7 sm:h-7 rounded-full flex items-center justify-center border-2 transition-all duration-350 ${
                                                            isCompleted
                                                                ? 'bg-indigo-600 border-indigo-505 text-white shadow-[0_0_10px_rgba(99,102,241,0.4)]'
                                                                : isActive
                                                                ? 'bg-purple-600 border-purple-500 text-white shadow-[0_0_10px_rgba(168,85,247,0.4)]'
                                                                : 'bg-white dark:bg-[#0c122c] border-slate-200 dark:border-slate-800 text-slate-400'
                                                        }`}
                                                    >
                                                        {isCompleted ? '✓' : idx + 1}
                                                    </div>
                                                    <span 
                                                        className={`mt-1.5 text-[8px] sm:text-[9px] uppercase tracking-widest ${
                                                            isActive || isCompleted ? 'text-indigo-600 dark:text-purple-300 font-black' : 'text-slate-400'
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
                            <div className="flex border-b border-slate-200 dark:border-slate-800/80 gap-6 font-['Orbitron'] text-xs font-black tracking-wider shrink-0">
                                <button
                                    onClick={() => setActiveTab('detail')}
                                    className={`pb-3 relative transition-colors cursor-pointer ${
                                        activeTab === 'detail'
                                            ? 'text-indigo-600 dark:text-indigo-400 font-extrabold'
                                            : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-200'
                                    }`}
                                >
                                    <span className="flex items-center gap-1.5 font-['Orbitron']">
                                        <FileText size={14} />
                                        Spesifikasi Quest
                                    </span>
                                    {activeTab === 'detail' && (
                                        <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-600 dark:bg-indigo-400 rounded-full" />
                                    )}
                                </button>

                                <button
                                    onClick={() => setActiveTab('project')}
                                    className={`pb-3 relative transition-colors cursor-pointer ${
                                        activeTab === 'project'
                                            ? 'text-indigo-600 dark:text-indigo-400 font-extrabold'
                                            : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-200'
                                    }`}
                                >
                                    <span className="flex items-center gap-1.5 font-['Orbitron']">
                                        <Briefcase size={14} />
                                        Manajemen Pengerjaan
                                    </span>
                                    {activeTab === 'project' && (
                                        <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-600 dark:bg-indigo-400 rounded-full" />
                                    )}
                                </button>

                                <button
                                    onClick={() => setActiveTab('bids')}
                                    className={`pb-3 relative transition-colors cursor-pointer ${
                                        activeTab === 'bids'
                                            ? 'text-indigo-600 dark:text-indigo-400 font-extrabold'
                                            : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-200'
                                    }`}
                                >
                                    <span className="flex items-center gap-1.5 font-['Orbitron']">
                                        <MessageSquare size={14} />
                                        Pelamar ({bids.length})
                                    </span>
                                    {activeTab === 'bids' && (
                                        <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-600 dark:bg-indigo-400 rounded-full" />
                                    )}
                                </button>
                            </div>

                            {/* TAB 1: DETAILS */}
                            {activeTab === 'detail' && (
                                <div className="bg-white/70 dark:bg-[#0c122c]/40 backdrop-blur-md rounded-2xl border border-slate-200 dark:border-slate-800/80 p-6 shadow-md transition-all duration-300 space-y-6">
                                    <div className="space-y-3">
                                        <h3 className="text-xs font-bold uppercase font-['Orbitron'] text-slate-400 dark:text-blue-300/60 tracking-wider">
                                            Deskripsi Pekerjaan
                                        </h3>
                                        <div className="text-sm sm:text-base leading-relaxed text-slate-700 dark:text-slate-200 bg-slate-50/50 dark:bg-black/10 rounded-xl p-4 border border-slate-100 dark:border-slate-800/40 whitespace-pre-wrap font-['Oxanium']">
                                            {quest.description}
                                        </div>
                                    </div>

                                    {/* Lampiran Quest (Gambar & File) */}
                                    {((quest.images && quest.images.length > 0) || (quest.files && quest.files.length > 0)) && (
                                        <div className="space-y-5 border-t border-slate-100 dark:border-slate-800 pt-5 font-['Oxanium']">
                                            <h3 className="text-xs font-bold uppercase font-['Orbitron'] text-slate-400 tracking-wider">
                                                Lampiran Pendukung
                                            </h3>

                                            {/* Images Gallery */}
                                            {quest.images && quest.images.length > 0 && (
                                                <div className="space-y-2.5">
                                                    <span className="block text-[10px] text-slate-400 uppercase tracking-wider font-semibold">
                                                        Galeri Gambar
                                                    </span>
                                                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                                                        {quest.images.map((img, index) => (
                                                            <div key={index} className="relative group rounded-xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-black/20 p-1">
                                                                <img
                                                                    src={img.url}
                                                                    alt={img.name}
                                                                    onClick={() => setPreviewImage(img)}
                                                                    className="w-full h-24 object-cover rounded-lg cursor-pointer transition-transform hover:scale-[1.02]"
                                                                />
                                                                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 pointer-events-none group-hover:pointer-events-auto">
                                                                    <button
                                                                        type="button"
                                                                        onClick={() => setPreviewImage(img)}
                                                                        className="p-1.5 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors cursor-pointer"
                                                                        title="Detail Gambar"
                                                                    >
                                                                        <ImageIcon className="w-4 h-4" />
                                                                    </button>
                                                                    <a
                                                                        href={img.url}
                                                                        target="_blank"
                                                                        rel="noopener noreferrer"
                                                                        className="p-1.5 bg-indigo-500 hover:bg-indigo-700 text-white rounded-lg transition-colors cursor-pointer"
                                                                        title="Unduh di Tab Baru"
                                                                    >
                                                                        <Download className="w-4 h-4" />
                                                                    </a>
                                                                </div>
                                                                <span className="block text-[9px] text-slate-500 dark:text-slate-400 truncate text-center mt-1 px-1">
                                                                    {img.name}
                                                                </span>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}

                                            {/* Files List */}
                                            {quest.files && quest.files.length > 0 && (
                                                <div className="space-y-2.5">
                                                    <span className="block text-[10px] text-slate-400 uppercase tracking-wider font-semibold">
                                                        Dokumen Lampiran
                                                    </span>
                                                    <div className="space-y-2">
                                                        {quest.files.map((file, index) => {
                                                            const ext = file.name.split(".").pop()?.toLowerCase();
                                                            const isZip = ext === "zip";
                                                            return (
                                                                <div key={index} className="flex items-center justify-between p-3 rounded-xl border border-slate-200 dark:border-slate-800/80 bg-slate-50/50 dark:bg-black/20">
                                                                    <div className="flex items-center gap-3 min-w-0">
                                                                        {isZip ? (
                                                                            <FileArchive className="w-5 h-5 text-amber-500 shrink-0" />
                                                                        ) : (
                                                                            <FileText className="w-5 h-5 text-indigo-500 shrink-0" />
                                                                        )}
                                                                        <div className="min-w-0">
                                                                            <p className="text-xs font-semibold text-slate-700 dark:text-slate-200 truncate">
                                                                                {file.name}
                                                                            </p>
                                                                            <p className="text-[10px] text-slate-400 font-semibold">
                                                                                {formatBytes(file.size)}
                                                                            </p>
                                                                        </div>
                                                                    </div>
                                                                    <a
                                                                        href={file.url}
                                                                        target="_blank"
                                                                        rel="noopener noreferrer"
                                                                        className="flex items-center justify-center p-1.5 text-indigo-500 hover:text-indigo-705 hover:bg-indigo-500/10 rounded-lg transition-colors cursor-pointer"
                                                                        title="Unduh berkas di Tab Baru"
                                                                    >
                                                                        <Download className="w-4.5 h-4.5" />
                                                                    </a>
                                                                </div>
                                                            );
                                                        })}
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* TAB 2: PROJECT WORKFLOW & VERIFICATION */}
                            {activeTab === 'project' && (
                                <div className="bg-white/70 dark:bg-[#0c122c]/40 backdrop-blur-md rounded-2xl border border-slate-200 dark:border-slate-800/80 p-6 shadow-md transition-all duration-300 space-y-5">
                                    <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                                        <h3 className="text-sm font-bold uppercase font-['Orbitron'] text-slate-800 dark:text-blue-200 tracking-wider">
                                            Alur Kerja & Status Penyelesaian
                                        </h3>
                                        
                                        {/* Worker chat shortcut */}
                                        {quest.worker && (() => {
                                            const acceptedBid = bids.find(b => b.status === "accepted" || b.student._id === quest.worker_id);
                                            if (acceptedBid) {
                                                return (
                                                    <button
                                                        onClick={() => setSelectedChatBid({ id: acceptedBid._id, name: quest.worker?.name ?? "" })}
                                                        className="px-3.5 py-1.5 rounded-xl text-xs font-bold font-['Orbitron'] uppercase tracking-wider text-white bg-indigo-600 hover:bg-indigo-700 shadow-sm transition-all duration-350 cursor-pointer flex items-center gap-1.5 relative shrink-0"
                                                    >
                                                        <MessageSquare size={12} />
                                                        Chat Pekerja
                                                        {acceptedBid.unread_messages_count > 0 && (
                                                            <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[8px] font-black text-white ring-2 ring-white dark:ring-slate-900 animate-pulse">
                                                                {acceptedBid.unread_messages_count}
                                                            </span>
                                                        )}
                                                    </button>
                                                );
                                            }
                                            return null;
                                        })()}
                                    </div>

                                    {quest.worker ? (
                                        <div className="p-4 rounded-xl bg-slate-50 dark:bg-black/20 border border-slate-200 dark:border-slate-800/50 flex flex-col sm:flex-row sm:items-center justify-between gap-4 font-['Oxanium']">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-full bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-600 dark:text-indigo-400 font-bold shrink-0">
                                                    {quest.worker.name.substring(0, 2).toUpperCase()}
                                                </div>
                                                <div>
                                                    <span className="block text-[9px] text-slate-400 uppercase tracking-wider font-semibold">Pekerja Ditugaskan</span>
                                                    <span className="font-bold text-slate-800 dark:text-white text-sm">{quest.worker.name}</span>
                                                    <span className="block text-xs text-slate-500">{quest.worker.email}</span>
                                                </div>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="py-6 text-center text-slate-400 dark:text-blue-300/40 font-['Oxanium']">
                                            <Briefcase className="w-8 h-8 mx-auto mb-2 opacity-50 text-indigo-500" />
                                            <p className="font-bold text-xs uppercase font-['Orbitron']">Belum ada pekerja ditunjuk.</p>
                                            <p className="text-[11px] text-slate-500">Silakan terima salah satu penawaran masuk pada tab "Pelamar" untuk memulai pengerjaan quest.</p>
                                        </div>
                                    )}

                                    {quest.status === 'ongoing' && (
                                        <div className="space-y-4 font-['Oxanium'] border-t border-slate-100 dark:border-slate-800/50 pt-4">
                                            <p className="text-xs text-slate-500 dark:text-blue-300/60 leading-relaxed">
                                                Status quest ini adalah <strong>Dalam Pengerjaan</strong>. Pekerja saat ini sedang menyelesaikan deskripsi tugas.
                                            </p>
                                            {quest.revision_note && (
                                                <div className="p-3.5 rounded-xl bg-red-500/10 border border-red-500/20 space-y-1">
                                                    <span className="block text-[10px] font-bold text-red-500 uppercase tracking-wider">⚠️ Menunggu Revisi Pekerja</span>
                                                    <p className="text-xs text-slate-600 dark:text-slate-300 italic">"{quest.revision_note}"</p>
                                                </div>
                                            )}
                                        </div>
                                    )}

                                    {quest.status === 'approved' && (
                                        <div className="p-4 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-center flex flex-col gap-2 font-['Oxanium'] border-t border-slate-100 dark:border-slate-800/50 pt-4">
                                            <span className="block text-xs font-bold uppercase font-['Orbitron'] tracking-wider text-indigo-600 dark:text-indigo-400">
                                                Disetujui & Menunggu Berkas ZIP Final
                                            </span>
                                            <p className="text-[11px] text-slate-500 dark:text-slate-300">
                                                Ulasan pengerjaan telah disetujui. Menunggu pekerja menyerahkan berkas proyek ZIP final agar quest ditutup dan rewards RPG didistribusikan.
                                            </p>
                                        </div>
                                    )}

                                    {quest.status === 'submitted' && (
                                        <div className="space-y-5 font-['Oxanium'] border-t border-slate-100 dark:border-slate-800/50 pt-4">
                                            <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 text-center flex flex-col gap-1">
                                                <span className="block text-xs font-bold uppercase font-['Orbitron'] tracking-wider text-amber-600 dark:text-amber-400">
                                                    Penyerahan Tugas Masuk
                                                </span>
                                                <p className="text-xs text-slate-500 dark:text-blue-300/60 leading-relaxed">
                                                    Pekerja telah selesai melakukan penyerahan tugas awal. Silakan review hasil pekerjaannya di bawah ini.
                                                </p>
                                            </div>

                                            <div className="space-y-3.5 text-xs bg-slate-50/50 dark:bg-black/20 p-4 rounded-xl border border-slate-200 dark:border-slate-800/80">
                                                {quest.submission_file && (
                                                    <div className="space-y-1">
                                                        <strong className="block text-slate-400 uppercase tracking-wider text-[10px]">Berkas Pekerjaan Utama (ZIP)</strong>
                                                        <div className="flex items-center justify-between p-2.5 rounded-xl border border-amber-200/40 dark:border-amber-500/20 bg-amber-500/5 dark:bg-amber-955/10">
                                                            <div className="flex items-center gap-2.5 min-w-0">
                                                                <FileArchive className="w-5 h-5 text-amber-500 shrink-0" />
                                                                <div className="min-w-0">
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
                                                        <p className="text-slate-700 dark:text-slate-300 bg-white/40 dark:bg-black/15 p-2.5 rounded-lg border border-slate-200 dark:border-slate-800/40 whitespace-pre-wrap leading-relaxed">
                                                            {quest.submission_note}
                                                        </p>
                                                    </div>
                                                )}
                                            </div>

                                            {!showApproveForm && !showRejectForm && (
                                                <div className="flex gap-3 border-t border-slate-200 dark:border-slate-800 pt-4">
                                                    <button
                                                        onClick={() => setShowApproveForm(true)}
                                                        className="flex-1 py-2.5 rounded-xl text-xs font-bold font-['Orbitron'] uppercase tracking-wider text-white bg-green-600 hover:bg-green-700 shadow-sm transition-colors cursor-pointer"
                                                    >
                                                        Setujui & Selesaikan
                                                    </button>
                                                    <button
                                                        onClick={() => setShowRejectForm(true)}
                                                        className="flex-1 py-2.5 rounded-xl text-xs font-bold font-['Orbitron'] uppercase tracking-wider text-white bg-red-605 hover:bg-red-700 shadow-sm transition-colors cursor-pointer"
                                                    >
                                                        Tolak / Minta Revisi
                                                    </button>
                                                </div>
                                            )}

                                            {showApproveForm && (
                                                <form onSubmit={handleApproveWork} className="space-y-4 border-t border-slate-100 dark:border-slate-800 pt-4">
                                                    <h4 className="text-xs font-bold uppercase font-['Orbitron'] text-slate-700 dark:text-blue-200">
                                                        Berikan Penilaian & Ulasan Pekerja
                                                    </h4>
                                                    <div className="space-y-1">
                                                        <label className="text-[10px] font-bold uppercase text-slate-400 tracking-wider">
                                                            Rating Kinerja
                                                        </label>
                                                        <div className="flex gap-1.5 justify-center py-1">
                                                            {[1, 2, 3, 4, 5].map((val) => (
                                                                <button
                                                                    key={val}
                                                                    type="button"
                                                                    onClick={() => approveForm.setData("rating", val)}
                                                                    className="focus:outline-none transition-transform active:scale-95 cursor-pointer"
                                                                >
                                                                    <Star
                                                                        className={`w-7 h-7 ${
                                                                            val <= approveForm.data.rating
                                                                                ? "text-amber-400 fill-amber-400"
                                                                                : "text-slate-300 dark:text-slate-600"
                                                                        }`}
                                                                    />
                                                                </button>
                                                            ))}
                                                        </div>
                                                    </div>

                                                    <div className="space-y-1">
                                                        <label className="text-[10px] font-bold uppercase text-slate-400 tracking-wider">
                                                            Ulasan Anda
                                                        </label>
                                                        <textarea
                                                            placeholder="Berikan ulasan tentang penyelesaian pekerjaan..."
                                                            rows={3}
                                                            value={approveForm.data.rating_comment}
                                                            onChange={(e) => approveForm.setData("rating_comment", e.target.value)}
                                                            className="w-full px-3 py-2 bg-slate-50 dark:bg-black/20 border border-slate-200 dark:border-slate-800 rounded-xl text-xs focus:outline-none focus:border-indigo-500 text-slate-800 dark:text-white"
                                                        />
                                                    </div>

                                                    <div className="flex gap-2">
                                                        <button
                                                            type="submit"
                                                            disabled={approveForm.processing}
                                                            className="flex-1 py-2 rounded-xl text-xs font-bold font-['Orbitron'] uppercase tracking-wider text-white bg-green-600 hover:bg-green-700 disabled:opacity-50 transition-colors cursor-pointer"
                                                        >
                                                            {approveForm.processing ? "Menyelesaikan..." : "Kirim Ulasan & Setujui"}
                                                        </button>
                                                        <button
                                                            type="button"
                                                            onClick={() => {
                                                                setShowApproveForm(false);
                                                                approveForm.reset();
                                                            }}
                                                            className="px-3 py-2 rounded-xl text-xs font-bold font-['Orbitron'] uppercase tracking-wider text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-white transition-colors"
                                                        >
                                                            Batal
                                                        </button>
                                                    </div>
                                                </form>
                                            )}

                                            {showRejectForm && (
                                                <form onSubmit={handleRejectWork} className="space-y-4 border-t border-slate-100 dark:border-slate-800 pt-4">
                                                    <h4 className="text-xs font-bold uppercase font-['Orbitron'] text-slate-700 dark:text-blue-200">
                                                        Kirim Feedback Revisi
                                                    </h4>
                                                    <div className="space-y-1">
                                                        <label className="text-[10px] font-bold uppercase text-slate-400 tracking-wider">
                                                            Detail Revisi yang Harus Diperbaiki <span className="text-red-500">*</span>
                                                        </label>
                                                        <textarea
                                                            required
                                                            placeholder="Jelaskan secara rinci apa saja yang perlu diperbaiki pekerja..."
                                                            rows={4}
                                                            value={rejectForm.data.revision_note}
                                                            onChange={(e) => rejectForm.setData("revision_note", e.target.value)}
                                                            className="w-full px-3 py-2 bg-slate-50 dark:bg-black/20 border border-slate-200 dark:border-slate-800 rounded-xl text-xs focus:outline-none focus:border-red-500 text-slate-800 dark:text-white"
                                                        />
                                                    </div>

                                                    <div className="flex gap-2">
                                                        <button
                                                            type="submit"
                                                            disabled={rejectForm.processing}
                                                            className="flex-1 py-2 rounded-xl text-xs font-bold font-['Orbitron'] uppercase tracking-wider text-white bg-red-600 hover:bg-red-700 disabled:opacity-50 transition-colors cursor-pointer"
                                                        >
                                                            {rejectForm.processing ? "Mengirim..." : "Kirim Catatan Revisi"}
                                                        </button>
                                                        <button
                                                            type="button"
                                                            onClick={() => {
                                                                setShowRejectForm(false);
                                                                rejectForm.reset();
                                                            }}
                                                            className="px-3 py-2 rounded-xl text-xs font-bold font-['Orbitron'] uppercase tracking-wider text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-white transition-colors"
                                                        >
                                                            Batal
                                                        </button>
                                                    </div>
                                                </form>
                                            )}
                                        </div>
                                    )}

                                    {quest.status === 'completed' && (
                                        <div className="space-y-4 font-['Oxanium'] border-t border-slate-100 dark:border-slate-800/50 pt-4">
                                            <div className="p-4 rounded-xl bg-green-500/10 border border-green-500/20 text-center flex flex-col gap-1">
                                                <Check className="w-8 h-8 text-green-500 mx-auto" />
                                                <span className="block text-xs font-bold uppercase tracking-wider text-green-600 dark:text-green-400 font-['Orbitron']">
                                                    Quest Selesai
                                                </span>
                                                <p className="text-xs text-slate-500 dark:text-blue-300/60 leading-relaxed">
                                                    Pekerjaan telah disetujui, berkas final ZIP telah terkirim, dan quest diselesaikan secara resmi.
                                                </p>
                                            </div>

                                            {quest.rating && (
                                                <div className="p-4 rounded-xl bg-slate-50/50 dark:bg-black/20 border border-slate-200/20 dark:border-slate-500/5 space-y-2 text-center">
                                                    <span className="block text-[10px] text-slate-400 uppercase tracking-wider font-semibold font-['Oxanium']">Ulasan Penilaian Anda</span>
                                                    <div className="flex justify-center gap-1 font-['Oxanium']">
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
                                                        <p className="text-xs italic text-slate-600 dark:text-slate-300 bg-white/40 dark:bg-black/10 p-2.5 rounded-lg border border-slate-100 dark:border-blue-500/5 font-['Oxanium']">
                                                            "{quest.rating_comment}"
                                                        </p>
                                                    )}
                                                </div>
                                            )}

                                            <div className="space-y-3 text-xs bg-slate-50/50 dark:bg-black/20 p-4 rounded-xl border border-slate-200 dark:border-slate-800">
                                                {quest.submission_file && (
                                                    <div className="space-y-1">
                                                        <strong className="block text-slate-400 uppercase tracking-wider text-[10px]">Berkas Proyek Final (ZIP)</strong>
                                                        <div className="flex items-center justify-between p-2.5 rounded-xl border border-amber-200/40 dark:border-amber-500/20 bg-amber-500/5 dark:bg-amber-955/10">
                                                            <div className="flex items-center gap-2.5 min-w-0">
                                                                <FileArchive className="w-5 h-5 text-amber-500 shrink-0" />
                                                                <div className="min-w-0">
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
                                                        <strong className="block text-slate-400 uppercase tracking-wider text-[10px] mb-1">Tautan Demo Pekerjaan</strong>
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

                            {/* TAB 3: BIDS / CANDIDATES */}
                            {activeTab === 'bids' && (
                                <div className="bg-white/70 dark:bg-[#0c122c]/40 backdrop-blur-md rounded-2xl border border-slate-200 dark:border-slate-800/80 p-6 shadow-md transition-all duration-300 space-y-5">
                                    <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                                        <h3 className="text-sm font-bold uppercase font-['Orbitron'] text-slate-800 dark:text-blue-200 tracking-wider">
                                            Pelamar yang Mendaftar
                                        </h3>
                                        <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-purple-500/10 border border-purple-500/20 text-purple-600 dark:text-purple-300">
                                            {bids.length} Pelamar
                                        </span>
                                    </div>

                                    {bids.length === 0 ? (
                                        <div className="py-12 text-center text-slate-400 dark:text-blue-300/40 font-['Oxanium']">
                                            <Briefcase className="w-10 h-10 mx-auto mb-2 opacity-50 text-indigo-500" />
                                            <p className="font-bold text-xs uppercase font-['Orbitron']">Belum ada pelamar.</p>
                                            <p className="text-[11px] text-slate-500">Siswa belum mengajukan proposal penawaran untuk quest ini.</p>
                                        </div>
                                    ) : (
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-h-[750px] overflow-y-auto pr-1">
                                            {bids.map((bid) => (
                                                <div
                                                    key={bid._id}
                                                    className={`p-4 rounded-xl border flex flex-col justify-between gap-3.5 transition-all duration-300 ${
                                                        bid.status === "accepted"
                                                            ? "bg-green-500/10 border-green-500/35 dark:border-green-500/20"
                                                            : bid.status === "rejected"
                                                            ? "bg-slate-100/50 dark:bg-[#111425] border-slate-200/50 dark:border-slate-800/40 opacity-65"
                                                            : "bg-slate-50/50 dark:bg-black/20 border-slate-200 dark:border-slate-800/60 hover:border-purple-500/50"
                                                    }`}
                                                >
                                                    <div className="font-['Oxanium'] space-y-3">
                                                        <div className="flex items-start justify-between gap-3">
                                                            <div className="flex items-center gap-2.5 min-w-0">
                                                                <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-600 text-xs font-bold text-white flex items-center justify-center shrink-0">
                                                                    {bid.student.name.substring(0, 2).toUpperCase()}
                                                                </div>
                                                                <div className="min-w-0">
                                                                    <span className="font-extrabold text-xs text-slate-800 dark:text-white block truncate">
                                                                        {bid.student.name}
                                                                    </span>
                                                                    <span className="text-[10px] text-slate-400 block truncate">
                                                                        {bid.student.email}
                                                                    </span>
                                                                </div>
                                                            </div>
                                                            <span className="font-black text-purple-600 dark:text-purple-300 text-xs font-['Orbitron'] shrink-0 ml-1">
                                                                {formatCurrency(bid.bid_amount)}
                                                            </span>
                                                        </div>

                                                        <div className="text-xs text-slate-500 dark:text-slate-300 space-y-1.5 bg-white/50 dark:bg-[#090b16] p-2.5 rounded-lg border border-slate-100 dark:border-slate-800/40">
                                                            <p className="line-clamp-3 leading-relaxed">
                                                                <strong className="block text-[8px] text-slate-400 uppercase tracking-wider mb-0.5 font-['Orbitron']">Proposal</strong>
                                                                {bid.proposal}
                                                            </p>
                                                            <div className="flex gap-2 pt-1">
                                                                <a
                                                                    href={bid.cv.startsWith("http") ? bid.cv : "#"}
                                                                    target="_blank"
                                                                    rel="noopener noreferrer"
                                                                    className="flex-1 py-1 rounded bg-slate-100 hover:bg-slate-200 dark:bg-slate-800/50 dark:hover:bg-slate-800 text-[10px] text-center font-bold text-slate-600 dark:text-indigo-300 truncate"
                                                                >
                                                                    CV Link
                                                                </a>
                                                                <a
                                                                    href={bid.portfolio.startsWith("http") ? bid.portfolio : "#"}
                                                                    target="_blank"
                                                                    rel="noopener noreferrer"
                                                                    className="flex-1 py-1 rounded bg-slate-100 hover:bg-slate-200 dark:bg-slate-800/50 dark:hover:bg-slate-800 text-[10px] text-center font-bold text-slate-600 dark:text-indigo-300 truncate"
                                                                >
                                                                    Portfolio
                                                                </a>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div className="flex gap-2 w-full pt-1">
                                                        {canAccept && bid.status === 'pending' && (
                                                            <button
                                                                onClick={() => handleAcceptBid(bid._id)}
                                                                className="flex-1 py-1.5 rounded-lg text-[10px] font-bold font-['Orbitron'] uppercase tracking-wider text-white bg-green-600 hover:bg-green-700 shadow-sm transition-all duration-300 cursor-pointer animate-pulse"
                                                            >
                                                                Terima
                                                            </button>
                                                        )}
                                                        <button
                                                            onClick={() => handleDeleteBid(bid._id)}
                                                            className="px-2.5 py-1.5 rounded-lg text-slate-500 hover:text-red-500 hover:bg-red-500/10 dark:hover:bg-red-950/20 bg-slate-100 dark:bg-slate-800 transition-colors cursor-pointer flex items-center justify-center shrink-0"
                                                            title="Hapus Bid Penawaran"
                                                        >
                                                            <Trash2 size={12} />
                                                        </button>
                                                        <button
                                                            onClick={() => setSelectedChatBid({ id: bid._id, name: bid.student.name })}
                                                            className="flex-1 py-1.5 rounded-lg text-[10px] font-bold font-['Orbitron'] uppercase tracking-wider text-white bg-indigo-600 hover:bg-indigo-700 shadow-sm transition-all duration-300 cursor-pointer relative"
                                                        >
                                                            Chat
                                                            {bid.unread_messages_count > 0 && (
                                                                <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-red-500 text-[8px] font-black text-white ring-2 ring-white dark:ring-slate-900 animate-pulse">
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
                            )}
                        </div>

                        {/* RIGHT COLUMN: SIDEBAR METADATA INFO (lg:col-span-4) */}
                        <div className="lg:col-span-4 space-y-6">
                            
                            {/* QUEST METADATA DETAILS */}
                            <div className="bg-white/70 dark:bg-[#0c122c]/40 backdrop-blur-md rounded-2xl border border-slate-200 dark:border-slate-800/80 p-6 shadow-md transition-all duration-300 space-y-5 font-['Oxanium']">
                                <h3 className="text-xs font-bold uppercase font-['Orbitron'] text-slate-700 dark:text-blue-200 tracking-wider border-b border-slate-100 dark:border-slate-800 pb-3">
                                    Rincian Quest
                                </h3>

                                <div className="space-y-4">
                                    {/* Creator info */}
                                    <div className="flex items-center gap-3">
                                        <div className="w-9 h-9 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-600 dark:text-indigo-400 shrink-0">
                                            <User className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <span className="block text-[10px] text-slate-400 uppercase tracking-wider font-semibold">Diposting Oleh</span>
                                            <span className="text-xs sm:text-sm font-bold text-slate-800 dark:text-white">
                                                {quest.creator.name}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Budget spec */}
                                    <div className="flex items-center gap-3">
                                        <div className="w-9 h-9 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-600 dark:text-purple-400 shrink-0">
                                            <DollarSign className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <span className="block text-[10px] text-slate-400 uppercase tracking-wider font-semibold">Gaji / Anggaran</span>
                                            <span className="text-sm font-bold text-slate-800 dark:text-white font-['Orbitron']">
                                                {formatCurrency(quest.min_salary)} - {formatCurrency(quest.max_salary)}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Deadline Spec */}
                                    <div className="flex items-center gap-3">
                                        <div className="w-9 h-9 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-650 dark:text-indigo-400 shrink-0">
                                            <Calendar className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <span className="block text-[10px] text-slate-400 uppercase tracking-wider font-semibold">Tenggat Waktu</span>
                                            <span className="text-xs sm:text-sm font-bold text-slate-800 dark:text-white">
                                                {formatDate(quest.deadline)}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                {/* RPG Rewards */}
                                <div className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-3">
                                    <span className="block text-[10px] font-bold uppercase font-['Orbitron'] tracking-wider text-purple-600 dark:text-purple-450">
                                        🎁 RPG Quest Rewards
                                    </span>
                                    <div className="grid grid-cols-3 gap-2 text-center text-xs font-bold font-['Orbitron']">
                                        <div className="py-2.5 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-605 dark:text-purple-300 flex flex-col items-center hover:scale-[1.03] transition-transform">
                                            <Award className="w-3.5 h-3.5 text-purple-500 mb-1" />
                                            <span className="text-[9px] text-slate-400 font-semibold font-['Oxanium']">EXP</span>
                                            <span className="text-[11px] font-black">+250</span>
                                        </div>
                                        <div className="py-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-600 dark:text-amber-400 flex flex-col items-center hover:scale-[1.03] transition-transform">
                                            <Award className="w-3.5 h-3.5 text-amber-500 mb-1" />
                                            <span className="text-[9px] text-slate-400 font-semibold font-['Oxanium']">GOLD</span>
                                            <span className="text-[11px] font-black">+150</span>
                                        </div>
                                        <div className="py-2.5 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-600 dark:text-indigo-305 flex flex-col items-center hover:scale-[1.03] transition-transform">
                                            <Award className="w-3.5 h-3.5 text-indigo-500 mb-1" />
                                            <span className="text-[9px] text-slate-400 font-semibold font-['Oxanium']">ERP</span>
                                            <span className="text-[11px] font-black">+100</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* WORKER SUMMARY (Right column status card) */}
                            {quest.worker && (
                                <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-between gap-3 font-['Oxanium'] shadow-sm">
                                    <div className="flex items-center gap-2.5 min-w-0">
                                        <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
                                        <div className="min-w-0">
                                            <span className="block text-[8px] text-slate-400 uppercase tracking-wider font-semibold">Status Pekerja</span>
                                            <span className="font-bold text-slate-800 dark:text-white text-xs truncate block">{quest.worker.name}</span>
                                        </div>
                                    </div>
                                    <span className="text-[9px] font-bold uppercase bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 px-2 py-0.5 rounded font-['Orbitron'] shrink-0">
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
                        className="absolute inset-0 bg-black/80 backdrop-blur-md transition-all cursor-pointer"
                    />
                    
                    <div className="relative max-w-4xl w-full max-h-[85vh] bg-slate-900/90 dark:bg-slate-950/95 border border-white/10 rounded-2xl p-4 flex flex-col items-center shadow-2xl z-10 overflow-hidden font-['Oxanium']">
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
                        <h3 className="text-base sm:text-lg font-bold uppercase font-['Orbitron'] text-slate-800 dark:text-red-405 tracking-wider mb-2">
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
                                    className="w-full px-3 py-2 bg-slate-55 dark:bg-black/20 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:border-red-500 text-xs text-slate-800 dark:text-white"
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
                                    className="px-4 py-2 rounded-xl text-xs font-semibold uppercase bg-red-650 hover:bg-red-750 text-white transition-all cursor-pointer disabled:opacity-50 font-['Orbitron']"
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
