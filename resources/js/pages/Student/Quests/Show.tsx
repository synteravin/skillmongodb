import { useForm, Link, router, usePage } from "@inertiajs/react";
import React, { useState } from "react";
import { ArrowLeft, Send, Check, Calendar, DollarSign, Briefcase, FileText, User, Star, Paperclip, Download, Image as ImageIcon, FileArchive, CheckCircle2, MessageSquare, Eye, EyeOff, Clock, Award, ShieldAlert } from "lucide-react";
import QuestChatPanel from "@/components/Quest/QuestChatPanel";
import ConfirmModal from "@/components/ConfirmModal";

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
        isCreator && quest.status === 'open' ? 'bids' : 'detail'
    );
    const [selectedChatBid, setSelectedChatBid] = useState<{ id: string; name: string } | null>(null);
    const [previewImage, setPreviewImage] = useState<{ url: string; name: string } | null>(null);
    const [acceptBidId, setAcceptBidId] = useState<string | null>(null);
    const [shortlistedBidIds, setShortlistedBidIds] = useState<string[]>([]);
    const [archivedBidIds, setArchivedBidIds] = useState<string[]>([]);
    
    const { data, setData, post, processing, errors, reset } = useForm({
        bid_amount: "",
        cv: "",
        portfolio: "",
        proposal: "",
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
        submission_link: "",
        submission_note: "",
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
        rating_comment: "",
        revision_note: "",
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

    const formatCurrency = (num: number) => {
        return new Intl.NumberFormat("id-ID", {
            style: "currency",
            currency: "IDR",
            minimumFractionDigits: 0,
        }).format(num);
    };

    const formatBytes = (bytes: number) => {
        if (bytes === 0) return "0 Bytes";
        const k = 1024;
        const dm = 2;
        const sizes = ["Bytes", "KB", "MB"];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
    };

    const formatDate = (dateStr: string) => {
        return new Date(dateStr).toLocaleDateString("id-ID", {
            year: "numeric",
            month: "long",
            day: "numeric",
        });
    };

    // Calculate days remaining
    const calculateDaysRemaining = () => {
        const diff = new Date(quest.deadline).getTime() - new Date().getTime();
        const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
        return days > 0 ? `${days} Hari Tersisa` : 'Tenggat Waktu Habis';
    };

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-[#060813] text-slate-800 dark:text-slate-100 flex flex-col p-4 sm:p-6 md:p-8 font-sans transition-colors duration-300 relative overflow-x-hidden">
            {/* Ambient Background Glows */}
            <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
                <div className="absolute top-0 right-1/4 w-[500px] h-[500px] rounded-full bg-indigo-500/10 blur-[150px]" />
                <div className="absolute bottom-10 left-1/4 w-[400px] h-[400px] rounded-full bg-purple-500/10 blur-[150px]" />
            </div>

            <div className="w-full max-w-7xl mx-auto z-10 flex-1 flex flex-col gap-6">
                
                {/* 1. TOP HEADER & BREADCRUMB */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-200 dark:border-slate-800/80 pb-5">
                    <div className="space-y-1">
                        <Link
                            href="/student/quests"
                            className="inline-flex items-center gap-2 text-xs font-bold text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 uppercase tracking-widest transition-colors font-['Orbitron']"
                        >
                            <ArrowLeft size={14} />
                            Kembali ke Board
                        </Link>
                        <h2 className="text-xl sm:text-2xl md:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white font-['Oxanium']">
                            {quest.title}
                        </h2>
                    </div>

                    <div className="flex items-center gap-3">
                        <span
                            className={`px-4 py-1.5 rounded-xl text-xs font-black uppercase tracking-wider font-['Orbitron'] border ${
                                quest.status === "open"
                                    ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20"
                                    : quest.status === "draft"
                                    ? "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20"
                                    : quest.status === "rejected"
                                    ? "bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20"
                                    : quest.status === "ongoing"
                                    ? "bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-500/20"
                                    : quest.status === "approved"
                                    ? "bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20"
                                    : quest.status === "submitted"
                                    ? "bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 border-yellow-500/20"
                                    : "bg-slate-500/10 text-slate-600 dark:text-slate-400 border-slate-500/20"
                            }`}
                        >
                            {quest.status === "open"
                                ? "Tersedia"
                                : quest.status === "draft"
                                ? "Menunggu Review"
                                : quest.status === "rejected"
                                ? "Ditolak"
                                : quest.status === "ongoing"
                                ? "Pengerjaan"
                                : quest.status === "approved"
                                ? "Disetujui"
                                : quest.status === "submitted"
                                ? "Ditinjau"
                                : "Selesai"}
                        </span>
                    </div>
                </div>

                {/* 2. OVERVIEW BANNER */}
                <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-white to-slate-50/50 dark:from-[#0d1226]/85 dark:to-[#090d1a]/95 border border-slate-200 dark:border-[#1d2645] p-6 shadow-xl space-y-6">
                    {/* Banners */}
                    {quest.status === 'draft' && (
                        <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/25 flex gap-3 font-['Oxanium']">
                            <Clock className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                            <div>
                                <span className="block text-xs font-bold uppercase font-['Orbitron'] tracking-wider text-amber-600 dark:text-amber-400">
                                    ⏳ Menunggu Persetujuan Admin
                                </span>
                                <p className="text-xs text-slate-500 dark:text-slate-300 leading-relaxed mt-1">
                                    Quest Anda telah berhasil diajukan and sedang menunggu moderasi/persetujuan dari pihak Admin sebelum dipublikasikan ke papan quest umum.
                                </p>
                            </div>
                        </div>
                    )}

                    {quest.status === 'rejected' && (
                        <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/25 space-y-3 font-['Oxanium']">
                            <div className="flex gap-3">
                                <ShieldAlert className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                                <div>
                                    <span className="block text-xs font-bold uppercase font-['Orbitron'] tracking-wider text-red-600 dark:text-red-400">
                                        ❌ Quest Ditolak Oleh Admin
                                    </span>
                                    <p className="text-xs text-slate-500 dark:text-slate-300 leading-relaxed mt-1">
                                        Pihak administrator telah menolak pengajuan quest ini. Anda dapat memperbaiki detail quest di bawah ini sesuai alasan penolakannya.
                                    </p>
                                </div>
                            </div>
                            {quest.rejection_note && (
                                <div className="p-3 bg-red-500/5 rounded-lg border border-red-500/10">
                                    <strong className="block text-[10px] text-red-500 uppercase tracking-wider font-['Orbitron']">Alasan Penolakan:</strong>
                                    <p className="text-xs text-slate-600 dark:text-slate-300 whitespace-pre-wrap leading-relaxed mt-1">
                                        {quest.rejection_note}
                                    </p>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Stepper Progress Timeline */}
                    {quest.status !== 'draft' && quest.status !== 'rejected' && (
                        <div className="pb-4 border-b border-slate-200/60 dark:border-slate-800/60 font-['Orbitron'] text-[9px] sm:text-[10px] font-bold tracking-wider">
                            <div className="flex items-center justify-between relative">
                                <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 h-0.5 bg-slate-200 dark:bg-slate-800/80 z-0" />
                                <div 
                                    className="absolute left-0 top-1/2 -translate-y-1/2 h-0.5 bg-indigo-500 z-0 transition-all duration-300" 
                                    style={{
                                        width: quest.status === 'open' ? '0%'
                                            : quest.status === 'ongoing' ? '25%'
                                            : quest.status === 'submitted' ? '50%'
                                            : quest.status === 'approved' ? '75%'
                                            : '100%'
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
                                                        ? 'bg-indigo-600 border-indigo-500 text-white shadow-[0_0_10px_rgba(99,102,241,0.4)]'
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

                    {/* Metadata & Creator */}
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 font-['Oxanium']">
                        <div className="flex items-center gap-3.5 text-xs sm:text-sm text-slate-500 dark:text-blue-300/80">
                            <div className="w-8 h-8 rounded-full bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-600 dark:text-indigo-400 shrink-0">
                                <User className="w-4 h-4" />
                            </div>
                            <div>
                                <span className="text-slate-400 block text-[10px] uppercase font-semibold">Pemilik Quest</span>
                                <span className="font-bold text-slate-800 dark:text-white text-sm">
                                    {quest.creator.name}
                                    <span className="text-xs font-normal text-slate-400 ml-1.5">
                                        ({quest.creator.role === "admin" ? "Administrator" : "Siswa"})
                                    </span>
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* 3. MAIN CONTENT GRID */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                    
                    {/* LEFT COLUMN: TAB NAVIGATION & TAB PANELS (col-span-8) */}
                    <div className="lg:col-span-8 space-y-6">
                        
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
                                <span className="flex items-center gap-1.5">
                                    <FileText size={14} />
                                    Deskripsi Quest
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
                                    {isCreator ? 'Manajemen Proyek' : isWorker ? 'Pengerjaan Proyek' : 'Status & Penawaran'}
                                </span>
                                {activeTab === 'project' && (
                                    <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-600 dark:bg-indigo-400 rounded-full" />
                                )}
                            </button>

                            {isCreator && quest.status === 'open' && (
                                <button
                                    onClick={() => setActiveTab('bids')}
                                    className={`pb-3 relative transition-colors cursor-pointer ${
                                        activeTab === 'bids'
                                            ? 'text-indigo-600 dark:text-indigo-400 font-extrabold'
                                            : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-200'
                                    }`}
                                >
                                    <span className="flex items-center gap-1.5">
                                        <MessageSquare size={14} />
                                        Pelamar ({bids.length})
                                    </span>
                                    {activeTab === 'bids' && (
                                        <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-600 dark:bg-indigo-400 rounded-full" />
                                    )}
                                </button>
                            )}
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
                                                        <div key={index} className="relative group rounded-xl overflow-hidden border border-slate-200 dark:border-slate-800/80 bg-slate-50/50 dark:bg-black/20 p-1">
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
                                                                        <p className="text-[10px] text-slate-405">
                                                                            {formatBytes(file.size)}
                                                                        </p>
                                                                    </div>
                                                                </div>
                                                                <a
                                                                    href={file.url}
                                                                    target="_blank"
                                                                    rel="noopener noreferrer"
                                                                    className="flex items-center justify-center p-1.5 text-indigo-500 hover:text-indigo-700 hover:bg-indigo-500/10 rounded-lg transition-colors cursor-pointer"
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

                        {/* TAB 2: PROJECT MANAGEMENT */}
                        {activeTab === 'project' && (
                            <div className="space-y-6">
                                
                                {isCreator ? (
                                    /* 1. CREATOR WORKFLOW PANEL */
                                    <div className="bg-white/70 dark:bg-[#0c122c]/40 backdrop-blur-md rounded-2xl border border-slate-200 dark:border-slate-800/80 p-6 shadow-md transition-all duration-300 space-y-5">
                                        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                                            <h3 className="text-sm font-bold uppercase font-['Orbitron'] text-slate-800 dark:text-blue-200 tracking-wider">
                                                Alur Kerja Pekerjaan
                                            </h3>
                                            {(() => {
                                                const acceptedBid = bids.find(b => b.status === "accepted" || b.student_id === quest.worker_id);
                                                if (acceptedBid && quest.worker) {
                                                    return (
                                                        <button
                                                            onClick={() => setSelectedChatBid({ id: acceptedBid._id, name: quest.worker.name })}
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

                                        {quest.worker && (
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
                                        )}

                                        {quest.status === "ongoing" && (
                                            <div className="space-y-4 font-['Oxanium']">
                                                <p className="text-xs text-slate-500 dark:text-blue-300/60 leading-relaxed">
                                                    Pekerja sedang menyelesaikan tugas. Status quest saat ini adalah <strong>Dalam Pengerjaan</strong>.
                                                </p>
                                                {quest.revision_note && (
                                                    <div className="p-3.5 rounded-xl bg-red-500/10 border border-red-500/20 space-y-1">
                                                        <span className="block text-[10px] font-bold uppercase font-['Orbitron'] tracking-wider text-red-650 dark:text-red-400">
                                                            ⚠️ Instruksi Revisi dari Anda:
                                                        </span>
                                                        <p className="text-xs text-slate-600 dark:text-slate-300 italic whitespace-pre-wrap leading-relaxed mt-1">
                                                            "{quest.revision_note}"
                                                        </p>
                                                    </div>
                                                )}
                                            </div>
                                        )}

                                        {quest.status === "approved" && (
                                            <div className="p-4 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-center flex flex-col gap-2 font-['Oxanium']">
                                                <span className="block text-xs font-bold uppercase font-['Orbitron'] tracking-wider text-indigo-600 dark:text-indigo-400">
                                                    Disetujui & Menunggu Berkas Final
                                                </span>
                                                <p className="text-[11px] text-slate-500 dark:text-slate-300">
                                                    Anda telah menyetujui hasil review pekerjaan ini. Saat ini, sistem sedang menunggu pekerja mengunggah berkas proyek ZIP final agar quest selesai dan rewards RPG dikirimkan secara otomatis.
                                                </p>
                                            </div>
                                        )}

                                        {quest.status === "submitted" && (
                                            <div className="space-y-5 font-['Oxanium']">
                                                <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 text-center flex flex-col gap-1">
                                                    <span className="block text-xs font-bold uppercase font-['Orbitron'] tracking-wider text-amber-600 dark:text-amber-400">
                                                        Hasil Pekerjaan Terkirim
                                                    </span>
                                                    <p className="text-xs text-slate-500 dark:text-blue-300/60 leading-relaxed">
                                                        Pekerja telah selesai melakukan penyerahan tugas awal. Silakan review hasil pekerjaannya di bawah ini.
                                                    </p>
                                                </div>

                                                <div className="space-y-3.5 text-xs bg-slate-50/50 dark:bg-black/20 p-4 rounded-xl border border-slate-200 dark:border-slate-800/80">
                                                    {quest.submission_file && (
                                                        <div className="space-y-1">
                                                            <strong className="block text-slate-400 uppercase tracking-wider text-[10px]">Berkas Pekerjaan (ZIP)</strong>
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
                                                            <strong className="block text-slate-400 uppercase tracking-wider text-[10px] mb-1">Catatan dari Pekerja</strong>
                                                            <p className="text-slate-700 dark:text-slate-300 bg-white/40 dark:bg-black/15 p-2.5 rounded-lg border border-slate-200 dark:border-slate-800/40 whitespace-pre-wrap leading-relaxed">
                                                                {quest.submission_note}
                                                            </p>
                                                        </div>
                                                    )}
                                                </div>

                                                {!showApproveForm && !showRejectForm && (
                                                    <div className="flex gap-3 border-t border-slate-100 dark:border-slate-800 pt-4">
                                                        <button
                                                            onClick={() => setShowApproveForm(true)}
                                                            className="flex-1 py-2.5 rounded-xl text-xs font-bold font-['Orbitron'] uppercase tracking-wider text-white bg-green-600 hover:bg-green-700 shadow-sm transition-colors cursor-pointer"
                                                        >
                                                            Setujui & Lanjutkan
                                                        </button>
                                                        <button
                                                            onClick={() => setShowRejectForm(true)}
                                                            className="flex-1 py-2.5 rounded-xl text-xs font-bold font-['Orbitron'] uppercase tracking-wider text-white bg-red-600 hover:bg-red-700 shadow-sm transition-colors cursor-pointer"
                                                        >
                                                            Tolak / Minta Revisi
                                                        </button>
                                                    </div>
                                                )}

                                                {showApproveForm && (
                                                    <form onSubmit={submitApproval} className="space-y-4 border-t border-slate-100 dark:border-slate-800 pt-4">
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
                                                                        onClick={() => reviewForm.setData("rating", val)}
                                                                        className="focus:outline-none transition-transform active:scale-95 cursor-pointer"
                                                                    >
                                                                        <Star
                                                                            className={`w-7 h-7 ${
                                                                                val <= reviewForm.data.rating
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
                                                                value={reviewForm.data.rating_comment}
                                                                onChange={(e) => reviewForm.setData("rating_comment", e.target.value)}
                                                                className="w-full px-3 py-2 bg-slate-50 dark:bg-black/20 border border-slate-200 dark:border-slate-800 rounded-xl text-xs focus:outline-none focus:border-indigo-500 text-slate-808 dark:text-white"
                                                            />
                                                        </div>

                                                        <div className="flex gap-2">
                                                            <button
                                                                type="submit"
                                                                disabled={reviewForm.processing}
                                                                className="flex-1 py-2 rounded-xl text-xs font-bold font-['Orbitron'] uppercase tracking-wider text-white bg-green-600 hover:bg-green-700 disabled:opacity-50 transition-colors cursor-pointer"
                                                            >
                                                                {reviewForm.processing ? "Menyelesaikan..." : "Kirim Ulasan & Setujui"}
                                                            </button>
                                                            <button
                                                                type="button"
                                                                onClick={() => {
                                                                    setShowApproveForm(false);
                                                                    reviewForm.reset();
                                                                }}
                                                                className="px-3 py-2 rounded-xl text-xs font-bold font-['Orbitron'] uppercase tracking-wider text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-white transition-colors"
                                                            >
                                                                Batal
                                                            </button>
                                                        </div>
                                                    </form>
                                                )}

                                                {showRejectForm && (
                                                    <form onSubmit={submitRejection} className="space-y-4 border-t border-slate-100 dark:border-slate-800 pt-4">
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
                                                                value={reviewForm.data.revision_note}
                                                                onChange={(e) => reviewForm.setData("revision_note", e.target.value)}
                                                                className="w-full px-3 py-2 bg-slate-50 dark:bg-black/20 border border-slate-200 dark:border-slate-800 rounded-xl text-xs focus:outline-none focus:border-red-500 text-slate-800 dark:text-white"
                                                            />
                                                        </div>

                                                        <div className="flex gap-2">
                                                            <button
                                                                type="submit"
                                                                disabled={reviewForm.processing}
                                                                className="flex-1 py-2 rounded-xl text-xs font-bold font-['Orbitron'] uppercase tracking-wider text-white bg-red-650 hover:bg-red-700 disabled:opacity-50 transition-colors cursor-pointer"
                                                            >
                                                                {reviewForm.processing ? "Mengirim..." : "Kirim Catatan Revisi"}
                                                            </button>
                                                            <button
                                                                type="button"
                                                                onClick={() => {
                                                                    setShowRejectForm(false);
                                                                    reviewForm.reset();
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

                                        {quest.status === "completed" && (
                                            <div className="space-y-4 font-['Oxanium']">
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
                                                        <span className="block text-[10px] text-slate-400 uppercase tracking-wider font-semibold">Ulasan Penilaian Anda</span>
                                                        <div className="flex justify-center gap-1">
                                                            {[1, 2, 3, 4, 5].map((star) => (
                                                                <Star
                                                                    key={star}
                                                                    className={`w-5 h-5 ${
                                                                        star <= (quest.rating ?? 0)
                                                                            ? "text-amber-400 fill-amber-400"
                                                                            : "text-slate-300 dark:text-slate-600"
                                                                    }`}
                                                                />
                                                            ))}
                                                        </div>
                                                        {quest.rating_comment && (
                                                            <p className="text-xs italic text-slate-600 dark:text-slate-300 bg-white/40 dark:bg-black/10 p-2.5 rounded-lg border border-slate-100 dark:border-blue-500/5">
                                                                "{quest.rating_comment}"
                                                            </p>
                                                        )}
                                                    </div>
                                                )}

                                                <div className="space-y-3 text-xs bg-slate-50/50 dark:bg-black/20 p-4 rounded-xl border border-slate-200 dark:border-slate-800/40">
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
                                ) : isWorker ? (
                                    /* 2. WORKER WORKFLOW PANEL */
                                    <div className="bg-white/70 dark:bg-[#0c122c]/40 backdrop-blur-md rounded-2xl border border-slate-200 dark:border-slate-800/80 p-6 shadow-md transition-all duration-300 space-y-5">
                                        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                                            <h3 className="text-sm font-bold uppercase font-['Orbitron'] text-slate-800 dark:text-blue-200 tracking-wider">
                                                Penyerahan Tugas Proyek
                                            </h3>
                                            {myBid && (
                                                <button
                                                    onClick={() => setSelectedChatBid({ id: myBid._id, name: quest.creator.name })}
                                                    className="px-3 py-1.5 rounded-xl text-xs font-bold font-['Orbitron'] uppercase tracking-wider text-white bg-indigo-600 hover:bg-indigo-700 shadow-sm transition-all duration-350 cursor-pointer flex items-center gap-1.5 relative shrink-0"
                                                >
                                                    <MessageSquare size={12} />
                                                    Chat Pemilik
                                                    {myBid.unread_messages_count > 0 && (
                                                        <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[8px] font-black text-white ring-2 ring-white dark:ring-slate-900 animate-pulse">
                                                            {myBid.unread_messages_count}
                                                        </span>
                                                    )}
                                                </button>
                                            )}
                                        </div>

                                        {quest.status === "ongoing" && (
                                            <div className="space-y-4">
                                                {quest.revision_note && (
                                                    <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 space-y-1 font-['Oxanium']">
                                                        <span className="block text-xs font-bold uppercase font-['Orbitron'] tracking-wider text-red-650 dark:text-red-400">
                                                            ⚠️ Permintaan Revisi Pemilik:
                                                        </span>
                                                        <p className="text-xs text-slate-600 dark:text-slate-300 italic whitespace-pre-wrap leading-relaxed mt-1">
                                                            "{quest.revision_note}"
                                                        </p>
                                                    </div>
                                                )}

                                                <form onSubmit={handleWorkSubmit} className="space-y-4 font-['Oxanium']">
                                                    <p className="text-xs text-slate-500 dark:text-blue-300/60 leading-relaxed">
                                                        Kirimkan hasil pekerjaan Anda agar pemilik quest dapat meninjau dan memberikan persetujuan pengerjaan.
                                                    </p>

                                                    {/* ZIP Deliverable File Input with Drag-and-Drop */}
                                                    <div className="space-y-2">
                                                        <label className="text-xs font-bold uppercase text-slate-600 dark:text-blue-200 flex items-center gap-1.5 font-['Orbitron']">
                                                            <FileArchive className="w-4 h-4 text-amber-500" />
                                                            Berkas Proyek Utama (ZIP) <span className="text-slate-400 font-normal">(Opsional)</span>
                                                        </label>
                                                        
                                                        <input
                                                            id="submission-file-input"
                                                            type="file"
                                                            accept=".zip"
                                                            onChange={(e) => {
                                                                const files = e.target.files;
                                                                if (files && files.length > 0) {
                                                                    submissionForm.setData("submission_file", files[0]);
                                                                }
                                                            }}
                                                            className="hidden"
                                                        />

                                                        {submissionForm.data.submission_file ? (
                                                            <div className="flex items-center justify-between p-3.5 rounded-xl border border-purple-500/30 bg-purple-500/5">
                                                                <div className="flex items-center gap-3 min-w-0">
                                                                    <FileArchive className="w-6 h-6 text-purple-500 shrink-0" />
                                                                    <div className="min-w-0">
                                                                        <p className="text-xs font-bold text-slate-700 dark:text-slate-200 truncate">
                                                                            {submissionForm.data.submission_file.name}
                                                                        </p>
                                                                        <p className="text-[10px] text-slate-400">
                                                                            {(submissionForm.data.submission_file.size / 1024 / 1024).toFixed(2)} MB
                                                                        </p>
                                                                    </div>
                                                                </div>
                                                                <button
                                                                    type="button"
                                                                    onClick={() => submissionForm.setData("submission_file", null)}
                                                                    className="px-2.5 py-1 rounded-lg text-[10px] font-bold font-['Orbitron'] uppercase tracking-wider text-red-600 dark:text-red-400 hover:bg-red-500/10 transition-colors cursor-pointer shrink-0"
                                                                >
                                                                    Hapus
                                                                </button>
                                                            </div>
                                                        ) : (
                                                            <div
                                                                onClick={() => document.getElementById("submission-file-input")?.click()}
                                                                onDragOver={(e) => {
                                                                    e.preventDefault();
                                                                    e.currentTarget.classList.add("border-purple-500", "bg-purple-500/5");
                                                                }}
                                                                onDragLeave={(e) => {
                                                                    e.preventDefault();
                                                                    e.currentTarget.classList.remove("border-purple-500", "bg-purple-500/5");
                                                                }}
                                                                onDrop={(e) => {
                                                                    e.preventDefault();
                                                                    e.currentTarget.classList.remove("border-purple-500", "bg-purple-500/5");
                                                                    const files = e.dataTransfer.files;
                                                                    if (files && files.length > 0 && files[0].name.endsWith(".zip")) {
                                                                        submissionForm.setData("submission_file", files[0]);
                                                                    }
                                                                }}
                                                                className="border-2 border-dashed border-slate-200 dark:border-slate-800/80 hover:border-purple-500 dark:hover:border-purple-400 rounded-xl p-5 text-center cursor-pointer transition-all duration-300 bg-slate-50/50 dark:bg-black/20 flex flex-col items-center justify-center gap-1.5"
                                                            >
                                                                <FileArchive className="w-8 h-8 text-slate-400 dark:text-blue-500/40" />
                                                                <span className="text-xs font-bold text-slate-600 dark:text-blue-300">Seret & lepas berkas ZIP</span>
                                                                <span className="text-[10px] text-slate-400">atau klik untuk memilih berkas</span>
                                                            </div>
                                                        )}

                                                        {submissionForm.progress && (
                                                            <div className="space-y-1">
                                                                <div className="w-full bg-slate-200 dark:bg-slate-800 rounded-full h-1.5 overflow-hidden">
                                                                    <div 
                                                                        className="bg-purple-600 h-1.5 rounded-full transition-all duration-300 animate-pulse"
                                                                        style={{ width: `${submissionForm.progress.percentage}%` }}
                                                                    />
                                                                </div>
                                                                <span className="block text-[8px] font-bold text-slate-400 uppercase tracking-widest text-right font-['Orbitron']">
                                                                    Mengunggah: {submissionForm.progress.percentage}%
                                                                </span>
                                                            </div>
                                                        )}

                                                        {submissionForm.errors.submission_file && (
                                                            <p className="text-xs text-red-500 font-semibold">{submissionForm.errors.submission_file}</p>
                                                        )}
                                                    </div>

                                                    {/* Required Link Input */}
                                                    <div className="space-y-1.5">
                                                        <label className="text-xs font-bold uppercase text-slate-600 dark:text-blue-200">
                                                            Tautan Repositori / Demo Hasil Pekerjaan <span className="text-red-500">*</span>
                                                        </label>
                                                        <input
                                                            type="url"
                                                            placeholder="https://github.com/username/project"
                                                            required
                                                            value={submissionForm.data.submission_link}
                                                            onChange={(e) => submissionForm.setData("submission_link", e.target.value)}
                                                            className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-black/20 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:border-purple-500 text-xs text-slate-800 dark:text-white"
                                                        />
                                                        {submissionForm.errors.submission_link && (
                                                            <p className="text-xs text-red-500 font-semibold">{submissionForm.errors.submission_link}</p>
                                                        )}
                                                    </div>

                                                    <div className="space-y-1.5">
                                                        <label className="text-xs font-bold uppercase text-slate-600 dark:text-blue-200">
                                                            Catatan Tambahan
                                                        </label>
                                                        <textarea
                                                            placeholder="Berikan deskripsi singkat tentang pengiriman pekerjaan ini..."
                                                            rows={4}
                                                            value={submissionForm.data.submission_note}
                                                            onChange={(e) => submissionForm.setData("submission_note", e.target.value)}
                                                            className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-black/20 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:border-purple-500 text-xs text-slate-800 dark:text-white"
                                                        />
                                                        {submissionForm.errors.submission_note && (
                                                            <p className="text-xs text-red-500 font-semibold">{submissionForm.errors.submission_note}</p>
                                                        )}
                                                    </div>

                                                    <button
                                                        type="submit"
                                                        disabled={submissionForm.processing}
                                                        className="w-full py-2.5 rounded-xl text-white font-semibold uppercase tracking-wider text-xs bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 transition-all cursor-pointer font-['Orbitron'] shadow-md"
                                                    >
                                                        {submissionForm.processing ? "Mengirim..." : "Kirim Hasil Pekerjaan"}
                                                    </button>
                                                </form>
                                            </div>
                                        )}

                                        {quest.status === "approved" && (
                                            <div className="space-y-4 font-['Oxanium']">
                                                <div className="p-4 rounded-xl bg-indigo-500/10 border border-indigo-500/25 flex flex-col gap-2 text-center">
                                                    <CheckCircle2 className="w-8 h-8 text-indigo-500 mx-auto" />
                                                    <span className="block text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                                                        Persetujuan Diterima!
                                                    </span>
                                                    <p className="text-xs text-slate-500 dark:text-blue-300/60 leading-relaxed">
                                                        Kerja bagus! Hasil pengerjaan Anda telah disetujui. Silakan unggah berkas final (.zip) proyek Anda di bawah ini untuk meresmikan penyelesaian quest dan membuka kunci reward RPG Anda.
                                                    </p>
                                                </div>

                                                <form onSubmit={handleFinalZipSubmit} className="space-y-4">
                                                    <div className="space-y-2">
                                                        <label className="text-xs font-bold uppercase text-slate-600 dark:text-blue-200 flex items-center gap-1.5 font-['Orbitron']">
                                                            <FileArchive className="w-4 h-4 text-amber-500" />
                                                            Upload Berkas Proyek Final (ZIP) <span className="text-red-500">*</span>
                                                        </label>

                                                        <input
                                                            id="final-zip-file-input"
                                                            type="file"
                                                            accept=".zip"
                                                            onChange={(e) => {
                                                                const files = e.target.files;
                                                                if (files && files.length > 0) {
                                                                    finalZipForm.setData("submission_file", files[0]);
                                                                }
                                                            }}
                                                            className="hidden"
                                                        />

                                                        {finalZipForm.data.submission_file ? (
                                                            <div className="flex items-center justify-between p-3.5 rounded-xl border border-indigo-500/30 bg-indigo-500/5">
                                                                <div className="flex items-center gap-3 min-w-0">
                                                                    <FileArchive className="w-6 h-6 text-indigo-500 shrink-0" />
                                                                    <div className="min-w-0">
                                                                        <p className="text-xs font-bold text-slate-700 dark:text-slate-200 truncate">
                                                                            {finalZipForm.data.submission_file.name}
                                                                        </p>
                                                                        <p className="text-[10px] text-slate-400">
                                                                            {(finalZipForm.data.submission_file.size / 1024 / 1024).toFixed(2)} MB
                                                                        </p>
                                                                    </div>
                                                                </div>
                                                                <button
                                                                    type="button"
                                                                    onClick={() => finalZipForm.setData("submission_file", null)}
                                                                    className="px-2.5 py-1 rounded-lg text-[10px] font-bold font-['Orbitron'] uppercase tracking-wider text-red-650 dark:text-red-400 hover:bg-red-500/10 transition-colors cursor-pointer shrink-0"
                                                                >
                                                                    Hapus
                                                                </button>
                                                            </div>
                                                        ) : (
                                                            <div
                                                                onClick={() => document.getElementById("final-zip-file-input")?.click()}
                                                                onDragOver={(e) => {
                                                                    e.preventDefault();
                                                                    e.currentTarget.classList.add("border-indigo-500", "bg-indigo-500/5");
                                                                }}
                                                                onDragLeave={(e) => {
                                                                    e.preventDefault();
                                                                    e.currentTarget.classList.remove("border-indigo-500", "bg-indigo-500/5");
                                                                }}
                                                                onDrop={(e) => {
                                                                    e.preventDefault();
                                                                    e.currentTarget.classList.remove("border-indigo-500", "bg-indigo-500/5");
                                                                    const files = e.dataTransfer.files;
                                                                    if (files && files.length > 0 && files[0].name.endsWith(".zip")) {
                                                                        finalZipForm.setData("submission_file", files[0]);
                                                                    }
                                                                }}
                                                                className="border-2 border-dashed border-slate-200 dark:border-slate-800 hover:border-indigo-500 dark:hover:border-indigo-400 rounded-xl p-5 text-center cursor-pointer transition-all duration-300 bg-slate-50/50 dark:bg-black/20 flex flex-col items-center justify-center gap-1.5"
                                                            >
                                                                <FileArchive className="w-8 h-8 text-slate-400 dark:text-blue-500/40" />
                                                                <span className="text-xs font-bold text-slate-600 dark:text-blue-300">Seret & lepas berkas ZIP Final</span>
                                                                <span className="text-[10px] text-slate-400">atau klik untuk memilih berkas</span>
                                                            </div>
                                                        )}

                                                        {finalZipForm.progress && (
                                                            <div className="space-y-1">
                                                                <div className="w-full bg-slate-200 dark:bg-slate-800 rounded-full h-1.5 overflow-hidden">
                                                                    <div 
                                                                        className="bg-indigo-600 h-1.5 rounded-full transition-all duration-300 animate-pulse"
                                                                        style={{ width: `${finalZipForm.progress.percentage}%` }}
                                                                    />
                                                                </div>
                                                                <span className="block text-[8px] font-bold text-slate-400 uppercase tracking-widest text-right font-['Orbitron']">
                                                                    Mengunggah: {finalZipForm.progress.percentage}%
                                                                </span>
                                                            </div>
                                                        )}

                                                        {finalZipForm.errors.submission_file && (
                                                            <p className="text-xs text-red-500 font-semibold">{finalZipForm.errors.submission_file}</p>
                                                        )}
                                                    </div>

                                                    <button
                                                        type="submit"
                                                        disabled={finalZipForm.processing}
                                                        className="w-full py-2.5 rounded-xl text-white font-semibold uppercase tracking-wider text-xs bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 transition-all cursor-pointer font-['Orbitron'] shadow-md"
                                                    >
                                                        {finalZipForm.processing ? "Mengirim..." : "Kirim Berkas Final & Klaim Hadiah"}
                                                    </button>
                                                </form>
                                            </div>
                                        )}

                                        {quest.status === "submitted" && (
                                            <div className="space-y-4 font-['Oxanium']">
                                                <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/25 flex flex-col gap-1.5 text-center">
                                                    <span className="block text-xs font-bold uppercase font-['Orbitron'] tracking-wider text-amber-600 dark:text-amber-400">
                                                        Menunggu Review Pemilik
                                                    </span>
                                                    <p className="text-xs text-slate-500 dark:text-blue-300/60 leading-relaxed">
                                                        Hasil penyerahan tugas Anda telah dikirim. Pemilik quest akan meninjau kelayakan pekerjaan Anda.
                                                    </p>
                                                </div>

                                                <div className="space-y-3.5 text-xs bg-slate-50/50 dark:bg-black/20 p-4 rounded-xl border border-slate-200 dark:border-slate-800">
                                                    {quest.submission_file && (
                                                        <div className="space-y-1">
                                                            <strong className="block text-slate-400 uppercase tracking-wider text-[10px]">Berkas Pekerjaan Utama (ZIP)</strong>
                                                            <div className="flex items-center justify-between p-2.5 rounded-xl border border-amber-200/40 dark:border-amber-500/20 bg-amber-500/5 dark:bg-amber-955/10">
                                                                <div className="flex items-center gap-2.5 min-w-0">
                                                                    <FileArchive className="w-5 h-5 text-amber-500 shrink-0" />
                                                                    <div className="min-w-0">
                                                                        <p className="text-xs font-semibold text-slate-700 dark:text-slate-200 truncate">
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
                                                                >
                                                                    <Download className="w-4.5 h-4.5" />
                                                                </a>
                                                            </div>
                                                        </div>
                                                    )}

                                                    {quest.submission_link && (
                                                        <div>
                                                            <strong className="block text-slate-400 uppercase tracking-wider text-[10px] mb-1">Tautan Repository</strong>
                                                            <a href={quest.submission_link} target="_blank" rel="noopener noreferrer" className="text-indigo-500 hover:underline break-all font-semibold font-['Oxanium']">
                                                                {quest.submission_link}
                                                            </a>
                                                        </div>
                                                    )}

                                                    {quest.submission_note && (
                                                        <div>
                                                            <strong className="block text-slate-400 uppercase tracking-wider text-[10px] mb-1">Catatan Anda</strong>
                                                            <p className="text-slate-705 dark:text-slate-350 bg-white/40 dark:bg-black/15 p-2.5 rounded-lg border border-slate-200 dark:border-slate-800/40 whitespace-pre-wrap leading-relaxed font-['Oxanium']">
                                                                {quest.submission_note}
                                                            </p>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        )}

                                        {quest.status === "completed" && (
                                            <div className="space-y-4 font-['Oxanium']">
                                                <div className="p-4 rounded-xl bg-green-500/10 border border-green-500/25 flex flex-col gap-1.5 text-center">
                                                    <Check className="w-8 h-8 text-green-500 mx-auto" />
                                                    <span className="block text-xs font-bold uppercase tracking-wider text-green-600 dark:text-green-400 font-['Orbitron']">
                                                        Quest Selesai
                                                    </span>
                                                    <p className="text-xs text-slate-500 dark:text-blue-300/60 leading-relaxed">
                                                        Selamat! Tugas Anda telah disetujui, berkas final ZIP telah diterima oleh sistem, dan hadiah RPG Anda telah ditambahkan secara resmi!
                                                    </p>
                                                </div>

                                                {quest.rating && (
                                                    <div className="p-4 rounded-xl bg-slate-50/50 dark:bg-black/20 border border-slate-200/20 dark:border-slate-500/5 space-y-2 text-center">
                                                        <span className="block text-[10px] text-slate-400 uppercase tracking-wider font-semibold">Ulasan Kinerja Anda</span>
                                                        <div className="flex justify-center gap-1 font-['Oxanium']">
                                                            {[1, 2, 3, 4, 5].map((star) => (
                                                                <Star
                                                                    key={star}
                                                                    className={`w-5 h-5 ${
                                                                        star <= (quest.rating ?? 0)
                                                                            ? "text-amber-400 fill-amber-400"
                                                                            : "text-slate-300 dark:text-slate-600"
                                                                    }`}
                                                                />
                                                            ))}
                                                        </div>
                                                        {quest.rating_comment && (
                                                            <p className="text-xs italic text-slate-600 dark:text-slate-300 bg-white/40 dark:bg-black/10 p-2.5 rounded-lg border border-slate-100 dark:border-blue-500/5">
                                                                "{quest.rating_comment}"
                                                            </p>
                                                        )}
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                ) : (
                                    /* 3. VIEWER / APPLICANT WORKFLOW PANEL */
                                    <div className="bg-white/70 dark:bg-[#0c122c]/40 backdrop-blur-md rounded-2xl border border-slate-200 dark:border-slate-800/80 p-6 shadow-md transition-all duration-300 space-y-5 font-['Oxanium']">
                                        {myBid ? (
                                            /* ALREADY BID: SHOW BID DETAILS */
                                            <div className="space-y-4">
                                                <h3 className="text-sm font-bold uppercase font-['Orbitron'] text-slate-800 dark:text-blue-200 tracking-wider border-b border-slate-100 dark:border-slate-800 pb-3">
                                                    Penawaran Anda
                                                </h3>

                                                <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-black/10 space-y-4">
                                                    <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-800/50 pb-2">
                                                        <span className="text-xs text-slate-400 uppercase font-semibold">Harga Penawaran</span>
                                                        <span className="font-black text-purple-600 dark:text-purple-300 text-base">
                                                            {formatCurrency(myBid.bid_amount)}
                                                        </span>
                                                    </div>

                                                    <div className="space-y-1">
                                                        <span className="block text-[10px] text-slate-400 uppercase tracking-wider font-semibold">Proposal</span>
                                                        <p className="text-xs text-slate-600 dark:text-slate-300 bg-white/50 dark:bg-black/15 p-2.5 rounded-lg border border-slate-200 dark:border-slate-800/30 whitespace-pre-line leading-relaxed">
                                                            {myBid.proposal}
                                                        </p>
                                                    </div>

                                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                                        <div className="space-y-1">
                                                            <span className="block text-[10px] text-slate-400 uppercase tracking-wider font-semibold">Tautan CV</span>
                                                            <p className="text-xs text-indigo-500 hover:underline bg-white/50 dark:bg-black/15 p-2 rounded-lg border border-slate-200 dark:border-slate-800/30 truncate">
                                                                <a href={myBid.cv.startsWith("http") ? myBid.cv : "#"} target="_blank" rel="noopener noreferrer">
                                                                    {myBid.cv}
                                                                </a>
                                                            </p>
                                                        </div>
                                                        <div className="space-y-1">
                                                            <span className="block text-[10px] text-slate-400 uppercase tracking-wider font-semibold">Portofolio</span>
                                                            <p className="text-xs text-indigo-500 hover:underline bg-white/50 dark:bg-black/15 p-2 rounded-lg border border-slate-200 dark:border-slate-800/30 truncate">
                                                                <a href={myBid.portfolio.startsWith("http") ? myBid.portfolio : "#"} target="_blank" rel="noopener noreferrer">
                                                                    {myBid.portfolio}
                                                                </a>
                                                            </p>
                                                        </div>
                                                    </div>

                                                    <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
                                                        <span className="block text-[10px] text-slate-400 uppercase tracking-wider font-semibold mb-2">Status Penawaran</span>
                                                        {myBid.status === "pending" && (
                                                            <span className="block text-center text-xs font-bold uppercase font-['Orbitron'] tracking-wider text-amber-600 dark:text-amber-400 py-1.5 bg-amber-500/10 border border-amber-500/20 rounded-lg">
                                                                Menunggu Keputusan
                                                            </span>
                                                        )}
                                                        {myBid.status === "accepted" && (
                                                            <span className="block text-center text-xs font-bold uppercase font-['Orbitron'] tracking-wider text-green-600 dark:text-green-400 py-1.5 bg-green-500/10 border border-green-500/20 rounded-lg">
                                                                Penawaran Diterima!
                                                            </span>
                                                        )}
                                                        {myBid.status === "rejected" && (
                                                            <span className="block text-center text-xs font-bold uppercase font-['Orbitron'] tracking-wider text-red-600 dark:text-red-405 py-1.5 bg-red-500/10 border border-red-500/20 rounded-lg">
                                                                Penawaran Ditolak
                                                            </span>
                                                        )}
                                                    </div>

                                                    <div className="pt-3 border-t border-slate-100 dark:border-slate-800">
                                                        <button
                                                            onClick={() => setSelectedChatBid({ id: myBid._id, name: quest.creator.name })}
                                                            className="w-full py-2 rounded-xl text-xs font-bold font-['Orbitron'] uppercase tracking-wider text-white bg-indigo-600 hover:bg-indigo-700 shadow-md transition-all duration-300 cursor-pointer flex items-center justify-center gap-2 relative animate-pulse"
                                                        >
                                                            Chat dengan Pembuat
                                                            {myBid.unread_messages_count > 0 && (
                                                                <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[8px] font-black text-white ring-2 ring-white dark:ring-slate-900 animate-pulse">
                                                                    {myBid.unread_messages_count}
                                                                </span>
                                                            )}
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        ) : can.bid ? (
                                            /* NOT BID YET: SHOW BID FORM */
                                            <form onSubmit={handleBidSubmit} className="space-y-4 font-['Oxanium']">
                                                <h3 className="text-sm font-bold uppercase font-['Orbitron'] text-slate-800 dark:text-blue-200 tracking-wider border-b border-slate-100 dark:border-slate-800 pb-3">
                                                    Ajukan Bid Penawaran
                                                </h3>

                                                {/* Bid Amount */}
                                                <div className="space-y-1.5">
                                                    <label className="text-xs font-bold uppercase text-slate-600 dark:text-blue-200">
                                                        Harga Penawaran (Rupiah)
                                                    </label>
                                                    <input
                                                        type="number"
                                                        placeholder={`Range: ${quest.min_salary} - ${quest.max_salary}`}
                                                        value={data.bid_amount}
                                                        onChange={(e) => setData("bid_amount", e.target.value)}
                                                        className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-black/20 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:border-indigo-500 transition-colors font-['Orbitron'] text-xs font-bold"
                                                    />
                                                    {data.bid_amount && (Number(data.bid_amount) < quest.min_salary || Number(data.bid_amount) > quest.max_salary) && (
                                                        <p className="text-[9px] text-amber-600 dark:text-amber-400 font-bold uppercase tracking-wider mt-1 flex items-center gap-1 font-['Orbitron']">
                                                            ⚠️ Di luar budget ({formatCurrency(quest.min_salary)} - {formatCurrency(quest.max_salary)})
                                                        </p>
                                                    )}
                                                    {errors.bid_amount && (
                                                        <p className="text-xs text-red-500 font-semibold">{errors.bid_amount}</p>
                                                    )}
                                                </div>

                                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                                    {/* CV details / link */}
                                                    <div className="space-y-1.5">
                                                        <label className="text-xs font-bold uppercase text-slate-600 dark:text-blue-200">
                                                            Tautan / Deskripsi CV
                                                        </label>
                                                        <input
                                                            type="text"
                                                            placeholder="Contoh: linktr.ee/cv-saya"
                                                            value={data.cv}
                                                            onChange={(e) => setData("cv", e.target.value)}
                                                            className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-black/20 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:border-indigo-500 text-xs text-slate-800 dark:text-white"
                                                        />
                                                        {errors.cv && (
                                                            <p className="text-xs text-red-500 font-semibold">{errors.cv}</p>
                                                        )}
                                                    </div>

                                                    {/* Portfolio links */}
                                                    <div className="space-y-1.5">
                                                        <label className="text-xs font-bold uppercase text-slate-600 dark:text-blue-200">
                                                            Tautan Portofolio
                                                        </label>
                                                        <input
                                                            type="text"
                                                            placeholder="Contoh: github.com/username"
                                                            value={data.portfolio}
                                                            onChange={(e) => setData("portfolio", e.target.value)}
                                                            className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-black/20 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:border-indigo-500 text-xs text-slate-800 dark:text-white"
                                                        />
                                                        {errors.portfolio && (
                                                            <p className="text-xs text-red-500 font-semibold">{errors.portfolio}</p>
                                                        )}
                                                    </div>
                                                </div>

                                                {/* Proposal message */}
                                                <div className="space-y-1.5">
                                                    <label className="text-xs font-bold uppercase text-slate-600 dark:text-blue-200">
                                                        Pesan Proposal
                                                    </label>
                                                    <textarea
                                                        placeholder="Tuliskan mengapa Anda adalah kandidat yang paling tepat untuk menyelesaikan tugas ini..."
                                                        rows={4}
                                                        value={data.proposal}
                                                        onChange={(e) => setData("proposal", e.target.value)}
                                                        className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-black/20 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:border-indigo-500 text-xs text-slate-800 dark:text-white"
                                                    />
                                                    {errors.proposal && (
                                                        <p className="text-xs text-red-500 font-semibold">{errors.proposal}</p>
                                                    )}
                                                </div>

                                                {/* Submit Button */}
                                                <button
                                                    type="submit"
                                                    disabled={processing}
                                                    className="w-full py-3 rounded-xl text-white font-black font-['Orbitron'] uppercase tracking-widest text-xs sm:text-sm bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 shadow-md hover:shadow-indigo-500/20 hover:shadow-lg disabled:opacity-50 transition-all duration-300 transform hover:scale-[1.01] active:scale-[0.99] cursor-pointer"
                                                >
                                                    {processing ? "Mengajukan..." : "Kirim Lamaran Quest"}
                                                </button>
                                            </form>
                                        ) : (
                                            /* CANNOT BID (E.G. QUEST CLOSED, ALREADY ONGOING, OR USER NOT STUDENT) */
                                            <div className="py-8 text-center text-slate-400 dark:text-blue-300/40 font-['Oxanium']">
                                                <Briefcase className="w-10 h-10 mx-auto mb-2 opacity-50 text-indigo-500" />
                                                <p className="font-bold uppercase tracking-wider text-xs font-['Orbitron']">Bidding Ditutup</p>
                                                <p className="text-[11px] mt-1 text-slate-500">Quest berstatus ongoing/completed atau Anda login sebagai administrator.</p>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        )}

                        {/* TAB 3: BIDS / APPLICANTS LIST (Creator Only, Quest Open) */}
                        {activeTab === 'bids' && isCreator && quest.status === 'open' && (
                            <div className="bg-white/70 dark:bg-[#0c122c]/40 backdrop-blur-md rounded-2xl border border-slate-200 dark:border-slate-800/80 p-6 shadow-md transition-all duration-300 space-y-5">
                                <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                                    <h3 className="text-sm font-bold uppercase font-['Orbitron'] text-slate-800 dark:text-blue-200 tracking-wider">
                                        Pelamar yang Mendaftar
                                    </h3>
                                    <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-purple-500/10 border border-purple-500/20 text-purple-650 dark:text-purple-300">
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
                                    (() => {
                                        const sortedBids = [...bids].sort((a, b) => {
                                            const aShort = shortlistedBidIds.includes(a._id) ? 1 : 0;
                                            const bShort = shortlistedBidIds.includes(b._id) ? 1 : 0;
                                            const aArch = archivedBidIds.includes(a._id) ? 1 : 0;
                                            const bArch = archivedBidIds.includes(b._id) ? 1 : 0;
                                            if (aShort !== bShort) return bShort - aShort;
                                            return aArch - bArch;
                                        });

                                        return (
                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-h-[750px] overflow-y-auto pr-1">
                                                {sortedBids.map((bid) => {
                                                    const isShortlisted = shortlistedBidIds.includes(bid._id);
                                                    const isArchived = archivedBidIds.includes(bid._id);

                                                    return (
                                                        <div
                                                            key={bid._id}
                                                            className={`p-4 rounded-xl border flex flex-col justify-between gap-3.5 transition-all duration-350 relative group ${
                                                                bid.status === "accepted"
                                                                    ? "bg-green-500/10 border-green-500/35"
                                                                    : bid.status === "rejected"
                                                                    ? "bg-slate-100/50 dark:bg-slate-900/40 border-slate-200/50 dark:border-slate-800/40 opacity-65"
                                                                    : isShortlisted
                                                                    ? "bg-purple-500/10 border-purple-500/40 shadow-[0_0_12px_rgba(124,58,237,0.15)]"
                                                                    : isArchived
                                                                    ? "bg-slate-100/30 dark:bg-slate-900/10 border-slate-200 dark:border-slate-800/20 opacity-30"
                                                                    : "bg-slate-50/50 dark:bg-black/20 border-slate-200 dark:border-slate-800/60 hover:border-purple-500/50"
                                                            }`}
                                                        >
                                                            <div className="font-['Oxanium'] space-y-3">
                                                                <div className="flex items-start justify-between">
                                                                    <div className="flex items-center gap-2.5 min-w-0">
                                                                        <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-600 text-xs font-bold text-white flex items-center justify-center shrink-0">
                                                                            {bid.student.name.substring(0,2).toUpperCase()}
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
                                                                    <div className="flex items-center gap-1 shrink-0 ml-2">
                                                                        <span className="font-black text-purple-600 dark:text-purple-300 text-xs mr-1 font-['Orbitron']">
                                                                            {formatCurrency(bid.bid_amount)}
                                                                        </span>
                                                                        {bid.status === "pending" && (
                                                                            <>
                                                                                <button
                                                                                    type="button"
                                                                                    onClick={() => {
                                                                                        if (isShortlisted) {
                                                                                            setShortlistedBidIds(prev => prev.filter(id => id !== bid._id));
                                                                                        } else {
                                                                                            setShortlistedBidIds(prev => [...prev, bid._id]);
                                                                                            setArchivedBidIds(prev => prev.filter(id => id !== bid._id));
                                                                                        }
                                                                                    }}
                                                                                    className={`p-1 rounded-lg border transition-colors cursor-pointer ${
                                                                                        isShortlisted
                                                                                            ? "bg-amber-500/10 border-amber-405 text-amber-500 hover:bg-amber-500/20"
                                                                                            : "bg-slate-55 dark:bg-slate-800 border-slate-200 dark:border-slate-800 text-slate-400 hover:text-amber-500"
                                                                                    }`}
                                                                                    title={isShortlisted ? "Batal Unggul" : "Shortlist (Unggulan)"}
                                                                                >
                                                                                    <Star size={11} className={isShortlisted ? "fill-amber-500 text-amber-500" : ""} />
                                                                                </button>
                                                                                <button
                                                                                    type="button"
                                                                                    onClick={() => {
                                                                                        if (isArchived) {
                                                                                            setArchivedBidIds(prev => prev.filter(id => id !== bid._id));
                                                                                        } else {
                                                                                            setArchivedBidIds(prev => [...prev, bid._id]);
                                                                                            setShortlistedBidIds(prev => prev.filter(id => id !== bid._id));
                                                                                        }
                                                                                    }}
                                                                                    className={`p-1 rounded-lg border transition-colors cursor-pointer ${
                                                                                        isArchived
                                                                                            ? "bg-slate-500/15 border-slate-500 text-slate-600 dark:text-slate-400"
                                                                                            : "bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-800 text-slate-400 hover:text-slate-600"
                                                                                    }`}
                                                                                    title={isArchived ? "Tampilkan Kembali" : "Arsipkan Penawaran"}
                                                                                >
                                                                                    {isArchived ? <Eye size={11} /> : <EyeOff size={11} />}
                                                                                </button>
                                                                            </>
                                                                        )}
                                                                    </div>
                                                                </div>

                                                                <div className="text-xs text-slate-500 dark:text-slate-300 space-y-1.5 bg-white/50 dark:bg-black/20 p-2.5 rounded-lg border border-slate-100 dark:border-slate-800/40 font-['Oxanium']">
                                                                    <p className="line-clamp-3 leading-relaxed">
                                                                        <strong className="block text-[8px] text-slate-400 uppercase tracking-wider mb-0.5">Proposal</strong>
                                                                        {bid.proposal}
                                                                    </p>
                                                                    <div className="flex gap-2 pt-1">
                                                                        <a
                                                                            href={bid.cv.startsWith("http") ? bid.cv : "#"}
                                                                            target="_blank"
                                                                            rel="noopener noreferrer"
                                                                            className="flex-1 py-1 rounded bg-slate-100 hover:bg-slate-200 dark:bg-slate-800/50 dark:hover:bg-slate-800 text-[10px] text-center font-bold text-slate-600 dark:text-indigo-300 truncate"
                                                                        >
                                                                            CV
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
                                                                {quest.status === "open" && bid.status === "pending" && (
                                                                    <button
                                                                        onClick={() => handleAcceptBid(bid._id)}
                                                                        className="flex-1 py-1.5 rounded-lg text-[10px] font-bold font-['Orbitron'] uppercase tracking-wider text-white bg-green-600 hover:bg-green-700 shadow-sm transition-all duration-300 cursor-pointer"
                                                                    >
                                                                        Terima
                                                                    </button>
                                                                )}
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
                    <div className="lg:col-span-4 space-y-6">
                        
                        {/* SPECIFICATION CARD */}
                        <div className="bg-white/70 dark:bg-[#0c122c]/40 backdrop-blur-md rounded-2xl border border-slate-200 dark:border-slate-800/80 p-6 shadow-md transition-all duration-300 space-y-5 font-['Oxanium']">
                            <h3 className="text-xs font-bold uppercase font-['Orbitron'] text-slate-700 dark:text-blue-200 tracking-wider border-b border-slate-100 dark:border-slate-800 pb-3">
                                Rincian Quest
                            </h3>

                            {/* Budget Spec */}
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
                                <div className="w-9 h-9 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-600 dark:text-indigo-400 shrink-0">
                                    <Calendar className="w-5 h-5" />
                                </div>
                                <div>
                                    <span className="block text-[10px] text-slate-405 uppercase tracking-wider font-semibold">Tenggat Waktu</span>
                                    <span className="text-xs sm:text-sm font-bold text-slate-800 dark:text-white">
                                        {formatDate(quest.deadline)}
                                    </span>
                                </div>
                            </div>

                            {/* Countdown Progress */}
                            {quest.status === 'open' && (
                                <div className="pt-2">
                                    <div className="flex items-center justify-between text-[10px] uppercase font-bold text-slate-400 mb-1">
                                        <span>Estimasi Waktu</span>
                                        <span className="text-indigo-600 dark:text-indigo-400 font-['Orbitron']">{calculateDaysRemaining()}</span>
                                    </div>
                                    <div className="w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
                                        <div className="bg-indigo-600 h-full w-[65%] rounded-full" />
                                    </div>
                                </div>
                            )}

                            {/* RPG Rewards Container */}
                            <div className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-3">
                                <span className="block text-[10px] font-bold uppercase font-['Orbitron'] tracking-wider text-purple-600 dark:text-purple-400">
                                    🎁 RPG Quest Rewards
                                </span>
                                <div className="grid grid-cols-3 gap-2 text-center text-xs font-bold font-['Orbitron']">
                                    <div className="py-2.5 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-600 dark:text-purple-300 flex flex-col items-center hover:scale-[1.03] transition-transform">
                                        <Award className="w-3.5 h-3.5 text-purple-500 mb-1" />
                                        <span className="text-[9px] text-slate-400 font-semibold font-['Oxanium']">EXP</span>
                                        <span className="text-[11px] font-black">+250</span>
                                    </div>
                                    <div className="py-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-600 dark:text-amber-400 flex flex-col items-center hover:scale-[1.03] transition-transform">
                                        <Award className="w-3.5 h-3.5 text-amber-500 mb-1" />
                                        <span className="text-[9px] text-slate-400 font-semibold font-['Oxanium']">GOLD</span>
                                        <span className="text-[11px] font-black">+150</span>
                                    </div>
                                    <div className="py-2.5 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-600 dark:text-indigo-300 flex flex-col items-center hover:scale-[1.03] transition-transform">
                                        <Award className="w-3.5 h-3.5 text-indigo-500 mb-1" />
                                        <span className="text-[9px] text-slate-400 font-semibold font-['Oxanium']">ERP</span>
                                        <span className="text-[11px] font-black">+100</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* WORKER SUMMARY (Right column shortcut) */}
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

            {/* Chat Panel Overlay */}
            {selectedChatBid && (
                <QuestChatPanel
                    bidId={selectedChatBid.id}
                    questTitle={quest.title}
                    targetUserName={selectedChatBid.name}
                    onClose={() => {
                        setSelectedChatBid(null);
                        router.reload({ only: ["bids", "myBid"] });
                    }}
                />
            )}

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
                        post(`/student/quests/${quest._id}/accept-bid/${acceptBidId}`);
                    }
                }}
                onClose={() => setAcceptBidId(null)}
            />
        </div>
    );
}
