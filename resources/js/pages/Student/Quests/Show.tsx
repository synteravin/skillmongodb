import { useForm, Link, router, usePage } from "@inertiajs/react";
import React, { useState } from "react";
import { ArrowLeft, Send, Check, Calendar, DollarSign, Briefcase, FileText, User, Star, Paperclip, Download, Image as ImageIcon, FileArchive } from "lucide-react";
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
    const [selectedChatBid, setSelectedChatBid] = useState<{ id: string; name: string } | null>(null);
    const [previewImage, setPreviewImage] = useState<{ url: string; name: string } | null>(null);
    const [acceptBidId, setAcceptBidId] = useState<string | null>(null);
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

    return (
        <div className="min-h-screen bg-gradient-to-br from-[#f8fafc] via-[#eff6ff] to-[#e2e8f0] dark:from-[#050816] dark:via-[#0b1026] dark:to-[#050816] text-slate-800 dark:text-white flex flex-col p-3 sm:p-6 md:p-8 relative overflow-x-hidden transition-colors duration-500">
            {/* Ambient Glows */}
            <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
                <div className="absolute top-[-10%] left-[-10%] w-72 h-72 sm:w-96 sm:h-96 bg-blue-500/20 dark:bg-blue-600/15 rounded-full blur-[100px] sm:blur-[120px]" />
                <div className="absolute bottom-[-10%] right-[-10%] w-72 h-72 sm:w-96 sm:h-96 bg-purple-500/20 dark:bg-purple-600/15 rounded-full blur-[100px] sm:blur-[120px]" />
            </div>

            <div className="w-full max-w-6xl mx-auto relative z-10 flex-1 flex flex-col min-h-0">
                {/* HEADER */}
                <div className="flex items-center gap-3 sm:gap-6 -mt-3 sm:-mt-6 mb-6 md:mb-8 shrink-0">
                    <div className="relative group cursor-pointer shrink-0">
                        <svg
                            className="w-[80px] h-[36px] sm:w-[110px] sm:h-[49px] md:w-[125px] md:h-[55px] overflow-visible"
                            viewBox="0 0 110 46"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <defs>
                                <linearGradient id="back_border_grad_lb" x1="0%" y1="0%" x2="100%" y2="0%">
                                    <stop offset="0%" stopColor="#3B28F6" />
                                    <stop offset="100%" stopColor="#FACC15" />
                                </linearGradient>
                            </defs>
                            <path
                                d="M 3,3 H 127 L 97,47 H 3 Z"
                                className="fill-blue-50/60 dark:fill-[#080e28]/40 transition-colors"
                                stroke="url(#back_border_grad_lb)"
                                strokeWidth="2"
                                strokeLinejoin="miter"
                                style={{ filter: "drop-shadow(0 0 3px rgba(59, 130, 246, 0.35))" }}
                            />
                        </svg>

                        <Link
                            href="/student/quests"
                            className="absolute inset-0 flex items-center justify-center text-[#1e3a8a] dark:text-blue-200"
                        >
                            <svg
                                className="w-8 h-8 sm:w-11 sm:h-11 md:w-12 md:h-12"
                                viewBox="0 0 44 44"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="3"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            >
                                <path d="M 6 17 L 13 10 M 6 17 L 13 24" />
                                <path d="M 9 17 H 36 C 42 19 43 30 32 30 H 15" />
                            </svg>
                        </Link>
                    </div>

                    <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-extrabold tracking-[0.05em] sm:tracking-[0.1em] uppercase font-['Orbitron'] text-[#1e3a8a] dark:text-[#F0F0F0] transition-colors duration-500">
                        QUEST DETAIL
                    </h1>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                    {/* LEFT COLUMN: QUEST DETAILS */}
                    <div className="lg:col-span-7 bg-white/70 dark:bg-blue-950/20 backdrop-blur-md rounded-2xl border border-blue-200 dark:border-blue-500/30 p-6 shadow-md transition-all duration-300">
                        <div className="flex items-start justify-between gap-4 mb-4">
                            <h2 className="text-xl sm:text-2xl font-black font-['Oxanium'] tracking-tight text-slate-900 dark:text-white leading-tight">
                                {quest.title}
                            </h2>
                            <span
                                className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider font-['Orbitron'] shrink-0 ${
                                    quest.status === "open"
                                        ? "bg-green-100 text-green-700 dark:bg-green-950/40 dark:text-green-400 border border-green-200 dark:border-green-800/40"
                                        : quest.status === "ongoing"
                                        ? "bg-blue-100 text-blue-700 dark:bg-blue-950/40 dark:text-blue-400 border border-blue-200 dark:border-blue-800/40"
                                        : "bg-slate-100 text-slate-600 dark:bg-slate-900/60 dark:text-slate-400 border border-slate-200 dark:border-slate-800/40"
                                }`}
                            >
                                {quest.status === "open" ? "Tersedia" : quest.status === "ongoing" ? "Berjalan" : "Selesai"}
                            </span>
                        </div>

                        {/* Posted By */}
                        <div className="flex items-center gap-3 text-xs sm:text-sm text-slate-500 dark:text-blue-300/80 mb-6 font-['Oxanium']">
                            <div className="w-8 h-8 rounded-full bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-600 dark:text-purple-300 shrink-0">
                                <User className="w-4 h-4" />
                            </div>
                            <div>
                                <span className="block text-[10px] text-slate-400">Diposting Oleh</span>
                                <span className="font-bold text-slate-700 dark:text-white">
                                    {quest.creator.name}
                                    <span className="text-xs font-normal text-slate-400 ml-1">
                                        ({quest.creator.role === "admin" ? "Admin" : "Siswa"})
                                    </span>
                                </span>
                            </div>
                        </div>

                        <div className="space-y-4 mb-6">
                            <h3 className="text-sm font-bold uppercase font-['Orbitron'] text-slate-700 dark:text-blue-200 tracking-wider">
                                Deskripsi Pekerjaan
                            </h3>
                            <div className="text-sm sm:text-base text-slate-600 dark:text-slate-200 leading-relaxed font-['Oxanium'] whitespace-pre-line bg-slate-50/50 dark:bg-[#0c122c]/30 rounded-xl p-4 border border-blue-200/40 dark:border-blue-500/10">
                                {quest.description}
                            </div>
                        </div>

                        {/* Lampiran Quest (Gambar & File) */}
                        {((quest.images && quest.images.length > 0) || (quest.files && quest.files.length > 0)) && (
                            <div className="space-y-4 mb-6 border-t border-slate-100 dark:border-blue-500/10 pt-5">
                                <h3 className="text-sm font-bold uppercase font-['Orbitron'] text-slate-700 dark:text-blue-200 tracking-wider">
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
                                                <div key={index} className="relative group rounded-xl overflow-hidden border border-blue-200/40 dark:border-blue-500/10 bg-slate-50/50 dark:bg-black/20 p-1">
                                                    <img
                                                        src={img.url}
                                                        alt={img.name}
                                                        onClick={() => setPreviewImage(img)}
                                                        className="w-full h-24 object-cover rounded-lg cursor-pointer transition-transform hover:scale-[1.02]"
                                                    />
                                                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 pointer-events-none group-hover:pointer-events-auto">
                                                        <button
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
                                                            className="p-1.5 bg-[#3B28F6] hover:bg-[#2a1ce0] text-white rounded-lg transition-colors cursor-pointer"
                                                            title="Unduh di Tab Baru"
                                                        >
                                                            <Download className="w-4 h-4" />
                                                        </a>
                                                    </div>
                                                    <span className="block text-[9px] text-slate-500 dark:text-slate-400 truncate text-center mt-1 px-1 font-['Oxanium']">
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
                                                    <div key={index} className="flex items-center justify-between p-3 rounded-xl border border-blue-200/40 dark:border-blue-500/10 bg-slate-50/50 dark:bg-black/20">
                                                        <div className="flex items-center gap-3 min-w-0">
                                                            {isZip ? (
                                                                <FileArchive className="w-5 h-5 text-amber-500 shrink-0" />
                                                            ) : (
                                                                <FileText className="w-5 h-5 text-indigo-500 shrink-0" />
                                                            )}
                                                            <div className="min-w-0 font-['Oxanium']">
                                                                <p className="text-xs font-semibold text-slate-700 dark:text-slate-200 truncate">
                                                                    {file.name}
                                                                </p>
                                                                <p className="text-[10px] text-slate-400">
                                                                    {formatBytes(file.size)}
                                                                </p>
                                                            </div>
                                                        </div>
                                                        <a
                                                            href={file.url}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="flex items-center justify-center p-1.5 text-indigo-500 hover:text-indigo-600 hover:bg-indigo-500/10 rounded-lg transition-colors cursor-pointer"
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

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 font-['Oxanium'] border-t border-slate-100 dark:border-blue-500/10 pt-5">
                            <div className="flex items-center gap-3 bg-slate-50/50 dark:bg-[#0c122c]/20 p-3 rounded-xl border border-blue-200/30 dark:border-blue-500/10">
                                <DollarSign className="w-5 h-5 text-purple-500 shrink-0" />
                                <div>
                                    <span className="block text-[10px] text-slate-400 uppercase tracking-wider font-semibold">Rentang Gaji</span>
                                    <span className="font-bold text-slate-800 dark:text-white">
                                        {formatCurrency(quest.min_salary)} - {formatCurrency(quest.max_salary)}
                                    </span>
                                </div>
                            </div>

                            <div className="flex items-center gap-3 bg-slate-50/50 dark:bg-[#0c122c]/20 p-3 rounded-xl border border-blue-200/30 dark:border-blue-500/10">
                                <Calendar className="w-5 h-5 text-purple-500 shrink-0" />
                                <div>
                                    <span className="block text-[10px] text-slate-400 uppercase tracking-wider font-semibold">Tenggat Waktu</span>
                                    <span className="font-bold text-slate-800 dark:text-white">
                                        {formatDate(quest.deadline)}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {quest.worker && (
                            <div className="mt-6 p-4 rounded-xl bg-green-500/10 border border-green-500/20 flex items-center gap-3 font-['Oxanium']">
                                <Check className="w-6 h-6 text-green-500 shrink-0" />
                                <div>
                                    <span className="block text-[10px] text-green-600 dark:text-green-400 uppercase tracking-wider font-semibold">Pekerja Terpilih</span>
                                    <span className="font-bold text-slate-800 dark:text-white">
                                        {quest.worker.name} ({quest.worker.email})
                                    </span>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* RIGHT COLUMN: ACTION PANELS */}
                    <div className="lg:col-span-5 space-y-6">
                        {quest.status === "open" ? (
                            can.accept ? (
                                /* OWNER VIEW: SHOW ALL BIDS */
                                <div className="bg-white/70 dark:bg-blue-950/20 backdrop-blur-md rounded-2xl border border-blue-200 dark:border-blue-500/30 p-6 shadow-md transition-all duration-300">
                                    <h3 className="text-base sm:text-lg font-bold uppercase font-['Orbitron'] text-slate-700 dark:text-blue-200 tracking-wider mb-4 flex items-center justify-between">
                                        <span>Penawaran Masuk</span>
                                        <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-purple-500/10 border border-purple-500/20 text-purple-600 dark:text-purple-300">
                                            {bids.length} Pelamar
                                        </span>
                                    </h3>

                                    {bids.length === 0 ? (
                                        <div className="py-12 text-center text-slate-400 dark:text-blue-300/40 font-['Oxanium']">
                                            <Briefcase className="w-10 h-10 mx-auto mb-2 opacity-50" />
                                            <p>Belum ada penawaran masuk.</p>
                                        </div>
                                    ) : (
                                        <div className="space-y-4 max-h-[500px] overflow-y-auto pr-1">
                                            {bids.map((bid) => (
                                                <div
                                                    key={bid._id}
                                                    className={`p-4 rounded-xl border flex flex-col justify-between gap-3 transition-all duration-300 ${
                                                        bid.status === "accepted"
                                                            ? "bg-green-500/10 border-green-500/30"
                                                            : bid.status === "rejected"
                                                            ? "bg-slate-100/50 dark:bg-slate-900/40 border-slate-200/50 dark:border-slate-800/40 opacity-60"
                                                            : "bg-slate-50/50 dark:bg-[#0c122c]/40 border-blue-200/40 dark:border-blue-500/10 hover:border-purple-500/50"
                                                    }`}
                                                >
                                                    <div className="font-['Oxanium']">
                                                        <div className="flex items-center justify-between mb-2">
                                                            <span className="font-extrabold text-sm text-slate-800 dark:text-white">
                                                                {bid.student.name}
                                                            </span>
                                                            <span className="font-black text-purple-600 dark:text-purple-300 text-sm">
                                                                {formatCurrency(bid.bid_amount)}
                                                            </span>
                                                        </div>

                                                        <div className="text-xs text-slate-500 dark:text-slate-300 mb-3 space-y-1 bg-white/50 dark:bg-black/20 p-2.5 rounded-lg border border-slate-100 dark:border-blue-500/5">
                                                            <p className="line-clamp-4">
                                                                <strong className="block text-[10px] text-slate-400 uppercase tracking-wider mb-0.5">Proposal</strong>
                                                                {bid.proposal}
                                                            </p>
                                                            <p className="truncate mt-1.5">
                                                                <strong className="block text-[10px] text-slate-400 uppercase tracking-wider mb-0.5">CV</strong>
                                                                {bid.cv}
                                                            </p>
                                                            <p className="truncate mt-1.5">
                                                                <strong className="block text-[10px] text-slate-400 uppercase tracking-wider mb-0.5">Portofolio</strong>
                                                                {bid.portfolio}
                                                            </p>
                                                        </div>

                                                        <span className="text-[10px] text-slate-400">
                                                            Diajukan pada {formatDate(bid.created_at)}
                                                        </span>
                                                    </div>

                                                    <div className="flex gap-2 w-full">
                                                        {quest.status === "open" && bid.status === "pending" && (
                                                            <button
                                                                onClick={() => handleAcceptBid(bid._id)}
                                                                className="flex-1 py-1.5 rounded-lg text-xs font-bold font-['Orbitron'] uppercase tracking-wider text-white bg-green-600 hover:bg-green-700 shadow-sm transition-all duration-300 cursor-pointer"
                                                            >
                                                                Terima
                                                            </button>
                                                        )}
                                                        <button
                                                            onClick={() => setSelectedChatBid({ id: bid._id, name: bid.student.name })}
                                                            className="flex-1 py-1.5 rounded-lg text-xs font-bold font-['Orbitron'] uppercase tracking-wider text-white bg-indigo-600 hover:bg-indigo-700 shadow-sm transition-all duration-300 cursor-pointer relative"
                                                        >
                                                            Chat
                                                            {bid.unread_messages_count > 0 && (
                                                                <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[8px] font-black text-white ring-2 ring-white dark:ring-slate-900 animate-pulse">
                                                                    {bid.unread_messages_count}
                                                                </span>
                                                            )}
                                                        </button>
                                                    </div>
                                                    {bid.status === "accepted" && (
                                                        <span className="block text-center text-xs font-bold uppercase font-['Orbitron'] tracking-wider text-green-600 dark:text-green-400 py-1 bg-green-500/10 border border-green-500/20 rounded-lg">
                                                            Pekerja Terpilih
                                                        </span>
                                                    )}
                                                    {bid.status === "rejected" && (
                                                        <span className="block text-center text-xs font-bold uppercase font-['Orbitron'] tracking-wider text-slate-400 py-1 bg-slate-500/5 border border-slate-500/10 rounded-lg">
                                                            Ditolak
                                                        </span>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            ) : (
                                /* STUDENT VIEW: BID FORM OR MY BID DETAILS */
                                <div className="bg-white/70 dark:bg-blue-950/20 backdrop-blur-md rounded-2xl border border-blue-200 dark:border-blue-500/30 p-6 shadow-md transition-all duration-300">
                                    {myBid ? (
                                        /* ALREADY BID: SHOW BID DETAILS */
                                        <div className="space-y-4 font-['Oxanium']">
                                            <h3 className="text-base sm:text-lg font-bold uppercase font-['Orbitron'] text-slate-700 dark:text-blue-200 tracking-wider">
                                                Penawaran Anda
                                            </h3>

                                            <div className="p-4 rounded-xl border border-blue-200/40 dark:border-blue-500/10 bg-slate-50/50 dark:bg-[#0c122c]/40 space-y-4">
                                                <div className="flex justify-between items-center border-b border-slate-100 dark:border-blue-500/10 pb-2">
                                                    <span className="text-xs text-slate-400">Harga Penawaran</span>
                                                    <span className="font-black text-purple-600 dark:text-purple-300 text-base">
                                                        {formatCurrency(myBid.bid_amount)}
                                                    </span>
                                                </div>

                                                <div className="space-y-1">
                                                    <span className="block text-[10px] text-slate-400 uppercase tracking-wider font-semibold">Pesan Proposal</span>
                                                    <p className="text-xs text-slate-600 dark:text-slate-200 bg-white/40 dark:bg-black/20 p-2.5 rounded-lg border border-slate-100 dark:border-blue-500/5 whitespace-pre-line">
                                                        {myBid.proposal}
                                                    </p>
                                                </div>

                                                <div className="space-y-1">
                                                    <span className="block text-[10px] text-slate-400 uppercase tracking-wider font-semibold">Tautan/Detail CV</span>
                                                    <p className="text-xs text-slate-600 dark:text-slate-200 bg-white/40 dark:bg-black/20 p-2.5 rounded-lg border border-slate-100 dark:border-blue-500/5 truncate">
                                                        {myBid.cv}
                                                    </p>
                                                </div>

                                                <div className="space-y-1">
                                                    <span className="block text-[10px] text-slate-400 uppercase tracking-wider font-semibold">Tautan Portofolio</span>
                                                    <p className="text-xs text-slate-600 dark:text-slate-200 bg-white/40 dark:bg-black/20 p-2.5 rounded-lg border border-slate-100 dark:border-blue-500/5 truncate">
                                                        {myBid.portfolio}
                                                    </p>
                                                </div>

                                                <div className="pt-2 border-t border-slate-100 dark:border-blue-500/10">
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
                                                        <span className="block text-center text-xs font-bold uppercase font-['Orbitron'] tracking-wider text-red-600 dark:text-red-400 py-1.5 bg-red-500/10 border border-red-500/20 rounded-lg">
                                                            Penawaran Ditolak
                                                        </span>
                                                    )}
                                                </div>

                                                <div className="pt-4 border-t border-slate-100 dark:border-blue-500/10">
                                                    <button
                                                        onClick={() => setSelectedChatBid({ id: myBid._id, name: quest.creator.name })}
                                                        className="w-full py-2.5 rounded-xl text-xs font-bold font-['Orbitron'] uppercase tracking-wider text-white bg-indigo-600 hover:bg-indigo-700 shadow-md transition-all duration-300 cursor-pointer flex items-center justify-center gap-2 relative"
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
                                            <h3 className="text-base sm:text-lg font-bold uppercase font-['Orbitron'] text-slate-700 dark:text-blue-200 tracking-wider">
                                                Ajukan Penawaran
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
                                                    className="w-full px-3.5 py-2 bg-slate-100/50 dark:bg-[#0c122c]/50 border border-blue-200 dark:border-blue-500/20 rounded-xl focus:outline-none focus:border-purple-500 dark:focus:border-purple-400 transition-colors"
                                                />
                                                {errors.bid_amount && (
                                                    <p className="text-xs text-red-500 font-semibold">{errors.bid_amount}</p>
                                                )}
                                            </div>

                                            {/* CV details / link */}
                                            <div className="space-y-1.5">
                                                <label className="text-xs font-bold uppercase text-slate-600 dark:text-blue-200">
                                                    Tautan / Deskripsi CV
                                                </label>
                                                <input
                                                    type="text"
                                                    placeholder="Contoh: linktr.ee/cv-saya atau linkedin.com/in/username"
                                                    value={data.cv}
                                                    onChange={(e) => setData("cv", e.target.value)}
                                                    className="w-full px-3.5 py-2 bg-slate-100/50 dark:bg-[#0c122c]/50 border border-blue-200 dark:border-blue-500/20 rounded-xl focus:outline-none focus:border-purple-500 dark:focus:border-purple-400 transition-colors"
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
                                                    placeholder="Contoh: github.com/username atau behance.net/username"
                                                    value={data.portfolio}
                                                    onChange={(e) => setData("portfolio", e.target.value)}
                                                    className="w-full px-3.5 py-2 bg-slate-100/50 dark:bg-[#0c122c]/50 border border-blue-200 dark:border-blue-500/20 rounded-xl focus:outline-none focus:border-purple-500 dark:focus:border-purple-400 transition-colors"
                                                />
                                                {errors.portfolio && (
                                                    <p className="text-xs text-red-500 font-semibold">{errors.portfolio}</p>
                                                )}
                                            </div>

                                            {/* Proposal message */}
                                            <div className="space-y-1.5">
                                                <label className="text-xs font-bold uppercase text-slate-600 dark:text-blue-200">
                                                    Pesan Proposal
                                                </label>
                                                <textarea
                                                    placeholder="Tuliskan mengapa Anda adalah orang yang tepat untuk pekerjaan ini..."
                                                    rows={4}
                                                    value={data.proposal}
                                                    onChange={(e) => setData("proposal", e.target.value)}
                                                    className="w-full px-3.5 py-2 bg-slate-100/50 dark:bg-[#0c122c]/50 border border-blue-200 dark:border-blue-500/20 rounded-xl focus:outline-none focus:border-purple-500 dark:focus:border-purple-400 transition-colors"
                                                />
                                                {errors.proposal && (
                                                    <p className="text-xs text-red-500 font-semibold">{errors.proposal}</p>
                                                )}
                                            </div>

                                            {/* Submit Button */}
                                            <button
                                                type="submit"
                                                disabled={processing}
                                                className="w-full py-2.5 rounded-xl text-white font-semibold font-['Oxanium'] uppercase tracking-wider text-xs sm:text-sm bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 shadow-[0_0_15px_rgba(99,102,241,0.4)] disabled:opacity-50 transition-all duration-300 transform hover:scale-[1.02]"
                                            >
                                                {processing ? "Mengajukan..." : "Ajukan Bid"}
                                            </button>
                                        </form>
                                    ) : (
                                        /* CANNOT BID (E.G. QUEST CLOSED, ALREADY ONGOING, OR USER NOT STUDENT) */
                                        <div className="py-8 text-center text-slate-400 dark:text-blue-300/40 font-['Oxanium']">
                                            <Briefcase className="w-10 h-10 mx-auto mb-2 opacity-50" />
                                            <p>Bidding ditutup untuk quest ini.</p>
                                            <p className="text-xs mt-1 text-slate-500">Quest berstatus ongoing/completed atau Anda login sebagai administrator.</p>
                                        </div>
                                    )}
                                </div>
                            )
                        ) : (
                            /* QUEST IS NOT OPEN (ONGOING, SUBMITTED, COMPLETED, CANCELLED) */
                            <div className="space-y-6">
                                {currentUser?.id === quest.worker_id ? (
                                    /* WORKER WORKFLOW */
                                    <div className="bg-white/70 dark:bg-blue-950/20 backdrop-blur-md rounded-2xl border border-blue-200 dark:border-blue-500/30 p-6 shadow-md transition-all duration-300">
                                        <h3 className="text-base sm:text-lg font-bold uppercase font-['Orbitron'] text-slate-700 dark:text-blue-200 tracking-wider mb-4">
                                            Pekerjaan Anda
                                        </h3>
                                        
                                        {quest.status === "ongoing" && (
                                            <div className="space-y-4">
                                                {quest.revision_note && (
                                                    <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 space-y-1 font-['Oxanium']">
                                                        <span className="block text-xs font-bold uppercase font-['Orbitron'] tracking-wider text-red-600 dark:text-red-400">
                                                            ⚠️ Permintaan Revisi:
                                                        </span>
                                                        <p className="text-xs text-slate-600 dark:text-slate-300 whitespace-pre-wrap leading-relaxed">
                                                            {quest.revision_note}
                                                        </p>
                                                    </div>
                                                )}

                                                <form onSubmit={handleWorkSubmit} className="space-y-4 font-['Oxanium']">
                                                    <p className="text-xs text-slate-500 dark:text-blue-300/60 leading-relaxed">
                                                        Anda telah dipilih untuk menyelesaikan pekerjaan ini! Silakan kerjakan dan kirimkan berkas hasil pekerjaan Anda berupa berkas **ZIP (maks 50MB)** serta tautan pendukung (opsional).
                                                    </p>

                                                    {/* ZIP Deliverable File Input */}
                                                    <div className="space-y-1.5">
                                                        <label className="text-xs font-bold uppercase text-slate-600 dark:text-blue-200 flex items-center gap-1.5">
                                                            <FileArchive className="w-4 h-4 text-amber-500" />
                                                            Berkas Pekerjaan Utama (ZIP) <span className="text-red-500">*</span>
                                                        </label>
                                                        <input
                                                            type="file"
                                                            accept=".zip"
                                                            required
                                                            onChange={(e) => {
                                                                const files = e.target.files;
                                                                if (files && files.length > 0) {
                                                                    submissionForm.setData("submission_file", files[0]);
                                                                }
                                                            }}
                                                            className="w-full px-3 py-2 bg-slate-100/50 dark:bg-[#0c122c]/50 border border-blue-200 dark:border-blue-500/20 rounded-xl focus:outline-none focus:border-purple-500 text-xs text-slate-800 dark:text-white"
                                                        />
                                                        {submissionForm.errors.submission_file && (
                                                            <p className="text-xs text-red-500 font-semibold">{submissionForm.errors.submission_file}</p>
                                                        )}
                                                    </div>

                                                    {/* Optional Link Input */}
                                                    <div className="space-y-1.5">
                                                        <label className="text-xs font-bold uppercase text-slate-600 dark:text-blue-200">
                                                            Tautan Repositori / Demo Pendukung (Opsional)
                                                        </label>
                                                        <input
                                                            type="url"
                                                            placeholder="https://github.com/username/project"
                                                            value={submissionForm.data.submission_link}
                                                            onChange={(e) => submissionForm.setData("submission_link", e.target.value)}
                                                            className="w-full px-3.5 py-2 bg-slate-100/50 dark:bg-[#0c122c]/50 border border-blue-200 dark:border-blue-500/20 rounded-xl focus:outline-none focus:border-purple-500 text-xs text-slate-800 dark:text-white"
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
                                                            placeholder="Tuliskan catatan tambahan mengenai hasil pekerjaan Anda..."
                                                            rows={4}
                                                            value={submissionForm.data.submission_note}
                                                            onChange={(e) => submissionForm.setData("submission_note", e.target.value)}
                                                            className="w-full px-3.5 py-2 bg-slate-100/50 dark:bg-[#0c122c]/50 border border-blue-200 dark:border-blue-500/20 rounded-xl focus:outline-none focus:border-purple-500 text-xs text-slate-800 dark:text-white"
                                                        />
                                                        {submissionForm.errors.submission_note && (
                                                            <p className="text-xs text-red-500 font-semibold">{submissionForm.errors.submission_note}</p>
                                                        )}
                                                    </div>

                                                    <button
                                                        type="submit"
                                                        disabled={submissionForm.processing}
                                                        className="w-full py-2.5 rounded-xl text-white font-semibold uppercase tracking-wider text-xs bg-[#3B28F6] hover:bg-[#2a1ce0] disabled:opacity-50 transition-all cursor-pointer"
                                                    >
                                                        {submissionForm.processing ? "Mengirim..." : "Kirim Hasil Pekerjaan"}
                                                    </button>
                                                </form>
                                            </div>
                                        )}

                                        {quest.status === "submitted" && (
                                            <div className="space-y-4 font-['Oxanium']">
                                                <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 flex flex-col gap-2">
                                                    <span className="block text-center text-xs font-bold uppercase font-['Orbitron'] tracking-wider text-amber-600 dark:text-amber-400">
                                                        Menunggu Tinjauan
                                                    </span>
                                                    <p className="text-xs text-slate-500 dark:text-blue-300/60 leading-relaxed text-center">
                                                        Hasil pekerjaan Anda telah dikirimkan. Pembuat quest akan meninjau hasil pekerjaan Anda.
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
                                                            <strong className="block text-slate-400 uppercase tracking-wider text-[10px]">Link Pekerjaan Pendukung</strong>
                                                            <a href={quest.submission_link} target="_blank" rel="noopener noreferrer" className="text-indigo-500 hover:underline break-all font-semibold">
                                                                {quest.submission_link}
                                                            </a>
                                                        </div>
                                                    )}

                                                    {quest.submission_note && (
                                                        <div>
                                                            <strong className="block text-slate-400 uppercase tracking-wider text-[10px]">Catatan Anda</strong>
                                                            <p className="text-slate-700 dark:text-slate-300 bg-white/40 dark:bg-black/20 p-2.5 rounded-lg border border-slate-100 dark:border-blue-500/5 whitespace-pre-wrap">
                                                                {quest.submission_note}
                                                            </p>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        )}

                                        {quest.status === "completed" && (
                                            <div className="space-y-4 font-['Oxanium']">
                                                <div className="p-4 rounded-xl bg-green-500/10 border border-green-500/20 flex flex-col gap-2 text-center">
                                                    <Check className="w-8 h-8 text-green-500 mx-auto" />
                                                    <span className="block text-xs font-bold uppercase font-['Orbitron'] tracking-wider text-green-600 dark:text-green-400">
                                                        Pekerjaan Selesai & Disetujui!
                                                    </span>
                                                    <p className="text-xs text-slate-500 dark:text-blue-300/60 leading-relaxed">
                                                        Selamat! Hasil pekerjaan Anda telah disetujui oleh pembuat quest. Anda telah mendapatkan hadiah EXP, Gold, dan ERP!
                                                    </p>
                                                </div>

                                                {quest.rating && (
                                                    <div className="p-4 rounded-xl bg-slate-50/50 dark:bg-black/20 border border-blue-200/20 dark:border-blue-500/5 space-y-2 text-center">
                                                        <span className="block text-[10px] text-slate-400 uppercase tracking-wider font-semibold">Ulasan Pembuat Quest</span>
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
                                                            <p className="text-xs italic text-slate-600 dark:text-slate-300 whitespace-pre-wrap bg-white/40 dark:bg-black/10 p-2.5 rounded-lg border border-slate-100 dark:border-blue-500/5">
                                                                "{quest.rating_comment}"
                                                            </p>
                                                        )}
                                                    </div>
                                                )}

                                                <div className="grid grid-cols-3 gap-2 text-center font-['Orbitron'] text-xs font-bold">
                                                    <div className="p-2.5 rounded-lg bg-purple-500/10 border border-purple-500/20 text-purple-600 dark:text-purple-300">
                                                        +250 EXP
                                                    </div>
                                                    <div className="p-2.5 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-600 dark:text-amber-400">
                                                        +150 Gold
                                                    </div>
                                                    <div className="p-2.5 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-indigo-600 dark:text-indigo-300">
                                                        +100 ERP
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                ) : (currentUser?.id === quest.creator_id || currentUser?.role === "admin") ? (
                                    /* CREATOR / ADMIN WORKFLOW */
                                    <div className="bg-white/70 dark:bg-[#0c122c]/40 backdrop-blur-md rounded-2xl border border-blue-200 dark:border-blue-500/30 p-6 shadow-md transition-all duration-300 space-y-4">
                                        <h3 className="text-base sm:text-lg font-bold uppercase font-['Orbitron'] text-slate-700 dark:text-blue-200 tracking-wider">
                                            Status Pekerjaan
                                        </h3>
                                        
                                        {quest.status === "ongoing" && (
                                            <div className="space-y-4 font-['Oxanium']">
                                                <p className="text-xs text-slate-500 dark:text-blue-300/60 leading-relaxed">
                                                    Quest ini sedang berjalan. Pekerja terpilih (<strong>{quest.worker?.name}</strong>) sedang mengerjakan proyek ini.
                                                </p>
                                                {quest.revision_note && (
                                                    <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/20 space-y-1">
                                                        <span className="block text-[10px] font-bold uppercase font-['Orbitron'] tracking-wider text-amber-600 dark:text-amber-400">
                                                            Feedback Revisi Anda:
                                                        </span>
                                                        <p className="text-xs text-slate-600 dark:text-slate-300 whitespace-pre-wrap leading-relaxed">
                                                            {quest.revision_note}
                                                        </p>
                                                    </div>
                                                )}
                                                <div className="p-4 rounded-xl bg-blue-500/10 border border-blue-500/20 text-center text-xs text-blue-600 dark:text-blue-400 font-bold font-['Orbitron']">
                                                    DALAM PROSES PENGERJAAN
                                                </div>
                                            </div>
                                        )}

                                        {quest.status === "submitted" && (
                                            <div className="space-y-4 font-['Oxanium']">
                                                <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 text-center flex flex-col gap-1.5">
                                                    <span className="block text-xs font-bold uppercase font-['Orbitron'] tracking-wider text-amber-600 dark:text-amber-400">
                                                        Pekerjaan Siap Ditinjau
                                                    </span>
                                                    <p className="text-[11px] text-slate-400">
                                                        Pekerja telah mengirimkan hasil pekerjaannya. Silakan tinjau tautan di bawah ini.
                                                    </p>
                                                </div>
                                                
                                                <div className="space-y-3 text-xs bg-slate-50/50 dark:bg-black/20 p-4 rounded-xl border border-blue-200/20 dark:border-blue-500/5">
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
                                                            <p className="text-slate-700 dark:text-slate-300 bg-white/40 dark:bg-black/10 p-2.5 rounded-lg border border-slate-100 dark:border-blue-500/5 whitespace-pre-wrap">
                                                                {quest.submission_note}
                                                            </p>
                                                        </div>
                                                    )}
                                                </div>

                                                {!showApproveForm && !showRejectForm && (
                                                    <div className="flex gap-2">
                                                        <button
                                                            onClick={() => setShowApproveForm(true)}
                                                            className="flex-1 py-2 rounded-lg text-xs font-bold font-['Orbitron'] uppercase tracking-wider text-white bg-green-600 hover:bg-green-700 shadow-sm transition-colors cursor-pointer"
                                                        >
                                                            Setujui & Selesai
                                                        </button>
                                                        <button
                                                            onClick={() => setShowRejectForm(true)}
                                                            className="flex-1 py-2 rounded-lg text-xs font-bold font-['Orbitron'] uppercase tracking-wider text-white bg-red-600 hover:bg-red-700 shadow-sm transition-colors cursor-pointer"
                                                        >
                                                            Tolak / Revisi
                                                        </button>
                                                    </div>
                                                )}

                                                {showApproveForm && (
                                                    <form onSubmit={submitApproval} className="space-y-4 border-t border-slate-100 dark:border-blue-500/10 pt-4">
                                                        <h4 className="text-xs font-bold uppercase font-['Orbitron'] text-slate-700 dark:text-blue-200">
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
                                                                        onClick={() => reviewForm.setData("rating", val)}
                                                                        className="focus:outline-none transition-transform active:scale-95"
                                                                    >
                                                                        <Star
                                                                            className={`w-7 h-7 cursor-pointer ${
                                                                                val <= reviewForm.data.rating
                                                                                    ? "text-amber-400 fill-amber-400"
                                                                                    : "text-slate-300 dark:text-slate-600"
                                                                            }`}
                                                                        />
                                                                    </button>
                                                                ))}
                                                            </div>
                                                            {reviewForm.errors.rating && (
                                                                <p className="text-xs text-red-500 font-semibold">{reviewForm.errors.rating}</p>
                                                            )}
                                                        </div>

                                                        <div className="space-y-1">
                                                            <label className="text-[10px] font-bold uppercase text-slate-400 tracking-wider">
                                                                Ulasan / Testimoni Pekerjaan
                                                            </label>
                                                            <textarea
                                                                placeholder="Tuliskan ulasan/testimoni tentang kinerja pekerja..."
                                                                rows={3}
                                                                value={reviewForm.data.rating_comment}
                                                                onChange={(e) => reviewForm.setData("rating_comment", e.target.value)}
                                                                className="w-full px-3 py-2 bg-slate-100/50 dark:bg-[#0c122c]/50 border border-blue-200 dark:border-blue-500/20 rounded-xl text-xs focus:outline-none focus:border-purple-500 text-slate-800 dark:text-white"
                                                            />
                                                            {reviewForm.errors.rating_comment && (
                                                                <p className="text-xs text-red-500 font-semibold">{reviewForm.errors.rating_comment}</p>
                                                            )}
                                                        </div>

                                                        <div className="flex gap-2">
                                                            <button
                                                                type="submit"
                                                                disabled={reviewForm.processing}
                                                                className="flex-1 py-2 rounded-lg text-xs font-bold font-['Orbitron'] uppercase tracking-wider text-white bg-green-600 hover:bg-green-700 disabled:opacity-50 transition-colors cursor-pointer"
                                                            >
                                                                {reviewForm.processing ? "Menyelesaikan..." : "Selesaikan Quest"}
                                                            </button>
                                                            <button
                                                                type="button"
                                                                onClick={() => {
                                                                    setShowApproveForm(false);
                                                                    reviewForm.reset();
                                                                }}
                                                                className="px-3 py-2 rounded-lg text-xs font-bold font-['Orbitron'] uppercase tracking-wider text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-white transition-colors"
                                                            >
                                                                Batal
                                                            </button>
                                                        </div>
                                                    </form>
                                                )}

                                                {showRejectForm && (
                                                    <form onSubmit={submitRejection} className="space-y-4 border-t border-slate-100 dark:border-blue-500/10 pt-4">
                                                        <h4 className="text-xs font-bold uppercase font-['Orbitron'] text-slate-700 dark:text-blue-200">
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
                                                                value={reviewForm.data.revision_note}
                                                                onChange={(e) => reviewForm.setData("revision_note", e.target.value)}
                                                                className="w-full px-3 py-2 bg-slate-100/50 dark:bg-[#0c122c]/50 border border-blue-200 dark:border-blue-500/20 rounded-xl text-xs focus:outline-none focus:border-purple-500 text-slate-800 dark:text-white"
                                                            />
                                                            {reviewForm.errors.revision_note && (
                                                                <p className="text-xs text-red-500 font-semibold">{reviewForm.errors.revision_note}</p>
                                                            )}
                                                        </div>

                                                        <div className="flex gap-2">
                                                            <button
                                                                type="submit"
                                                                disabled={reviewForm.processing}
                                                                className="flex-1 py-2 rounded-lg text-xs font-bold font-['Orbitron'] uppercase tracking-wider text-white bg-red-600 hover:bg-red-700 disabled:opacity-50 transition-colors cursor-pointer"
                                                            >
                                                                {reviewForm.processing ? "Mengirim..." : "Kirim Permintaan Revisi"}
                                                            </button>
                                                            <button
                                                                type="button"
                                                                onClick={() => {
                                                                    setShowRejectForm(false);
                                                                    reviewForm.reset();
                                                                }}
                                                                className="px-3 py-2 rounded-lg text-xs font-bold font-['Orbitron'] uppercase tracking-wider text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-white transition-colors"
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
                                                    <span className="block text-xs font-bold uppercase font-['Orbitron'] tracking-wider text-green-600 dark:text-green-400">
                                                        Quest Selesai
                                                    </span>
                                                    <p className="text-xs text-slate-500 dark:text-blue-300/60 leading-relaxed">
                                                        Pekerjaan telah disetujui dan diselesaikan secara resmi.
                                                    </p>
                                                </div>

                                                {quest.rating && (
                                                    <div className="p-4 rounded-xl bg-slate-50/50 dark:bg-black/20 border border-blue-200/20 dark:border-blue-500/5 space-y-2 text-center">
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
                                                            <p className="text-xs italic text-slate-600 dark:text-slate-300 whitespace-pre-wrap bg-white/40 dark:bg-black/10 p-2.5 rounded-lg border border-slate-100 dark:border-blue-500/5">
                                                                "{quest.rating_comment}"
                                                            </p>
                                                        )}
                                                    </div>
                                                )}

                                                <div className="space-y-3 text-xs bg-slate-50/50 dark:bg-black/20 p-4 rounded-xl border border-blue-200/20 dark:border-blue-500/5">
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
                                ) : (
                                    /* OTHER STUDENTS VIEW */
                                    <div className="bg-white/70 dark:bg-blue-950/20 backdrop-blur-md rounded-2xl border border-blue-200 dark:border-blue-500/30 p-6 shadow-md transition-all duration-300 text-center py-12 text-slate-400 dark:text-blue-300/40 font-['Oxanium']">
                                        <Briefcase className="w-10 h-10 mx-auto mb-2 opacity-50" />
                                        <p className="font-bold">Bidding Ditutup</p>
                                        <p className="text-xs mt-1 text-slate-500">Quest ini sedang berjalan atau telah diselesaikan oleh pekerja terpilih.</p>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>
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
