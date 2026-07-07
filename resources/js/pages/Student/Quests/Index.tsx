import { Link, router } from "@inertiajs/react";
import React, { useState } from "react";
import { Search, Calendar, DollarSign, Users, Plus, Briefcase, History, X, ExternalLink, FileArchive, Download, Star } from "lucide-react";

interface Quest {
    _id: string;
    title: string;
    description: string;
    min_salary: number;
    max_salary: number;
    deadline: string;
    status: string;
    creator: {
        name: string;
        role: string;
    };
    bids_count: number;
}

interface HistoryQuest {
    _id: string;
    title: string;
    description: string;
    min_salary: number;
    max_salary: number;
    deadline: string;
    status: string;
    creator: {
        name: string;
        role: string;
    };
    worker_id?: string;
    is_worker: boolean;
    my_bid?: {
        bid_amount: number;
        status: string;
        proposal?: string;
        cv?: string;
        portfolio?: string;
    } | null;
    submission_link?: string;
    submission_note?: string;
    submission_file?: {
        name: string;
        size: number;
        url: string;
    } | null;
    submitted_at?: string;
    completed_at?: string;
    rating?: number;
    rating_comment?: string;
    revision_note?: string;
}

interface Props {
    quests: Quest[];
    historyQuests: HistoryQuest[];
    filters: {
        search?: string;
        status?: string;
    };
}

export default function Index({ quests, historyQuests, filters }: Props) {
    const [search, setSearch] = useState(filters.search || "");
    const [status, setStatus] = useState(filters.status || "");
    const [isHistoryOpen, setIsHistoryOpen] = useState(false);
    const [expandedQuestId, setExpandedQuestId] = useState<string | null>(null);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        router.get(
            "/student/quests",
            { search, status },
            { preserveState: true, replace: true }
        );
    };

    const handleStatusFilter = (newStatus: string) => {
        setStatus(newStatus);
        router.get(
            "/student/quests",
            { search, status: newStatus },
            { preserveState: true, replace: true }
        );
    };

    const formatCurrency = (num: number) => {
        return new Intl.NumberFormat("id-ID", {
            style: "currency",
            currency: "IDR",
            minimumFractionDigits: 0,
        }).format(num);
    };

    const formatDate = (dateStr: string) => {
        return new Date(dateStr).toLocaleDateString("id-ID", {
            year: "numeric",
            month: "long",
            day: "numeric",
        });
    };

    const formatBytes = (bytes: number) => {
        if (bytes === 0) return "0 Bytes";
        const k = 1024;
        const dm = 2;
        const sizes = ["Bytes", "KB", "MB"];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
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
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 -mt-3 sm:-mt-6 mb-6 md:mb-8 shrink-0">
                    <div className="flex items-center gap-3 sm:gap-6">
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
                                href="/student/dashboard"
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
                            QUEST BOARD
                        </h1>
                    </div>

                    <div className="flex gap-2.5 shrink-0 flex-wrap">
                        <button
                            type="button"
                            onClick={() => setIsHistoryOpen(true)}
                            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-slate-700 dark:text-blue-100 font-semibold font-['Oxanium'] uppercase tracking-wider text-xs bg-white/80 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-500/20 hover:bg-slate-55 dark:hover:bg-blue-950/60 shadow-sm transition-all duration-300 transform hover:scale-[1.03] cursor-pointer"
                        >
                            <History className="w-4 h-4 sm:w-4.5 sm:h-4.5 text-purple-500" />
                            Riwayat Quest
                        </button>

                        <Link
                            href="/student/quests/create"
                            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-white font-semibold font-['Oxanium'] uppercase tracking-wider text-xs bg-gradient-to-r from-[#3B28F6] to-[#7c3aed] hover:from-[#4c2fff] hover:to-[#8b5cf6] shadow-[0_0_15px_rgba(124,58,237,0.4)] transition-all duration-300 transform hover:scale-[1.03]"
                        >
                            <Plus className="w-4 h-4 sm:w-4.5 sm:h-4.5" />
                            Tambah Quest
                        </Link>
                    </div>
                </div>

                {/* FILTERS & SEARCH */}
                <div className="bg-white/70 dark:bg-blue-950/20 backdrop-blur-md rounded-2xl border border-blue-200 dark:border-blue-500/30 p-4 mb-6 shadow-md transition-all duration-300">
                    <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-4 items-center">
                        <div className="relative w-full md:flex-1">
                            <input
                                type="text"
                                placeholder="Cari quest freelance..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="w-full pl-11 pr-4 py-2.5 bg-slate-100/50 dark:bg-[#0c122c]/50 border border-blue-200 dark:border-blue-500/20 rounded-xl focus:outline-none focus:border-purple-500 dark:focus:border-purple-400 font-['Oxanium'] transition-colors"
                            />
                            <Search className="absolute left-3.5 top-3.5 text-slate-400 dark:text-blue-300/60 w-5 h-5" />
                        </div>

                        <div className="flex gap-2 w-full md:w-auto overflow-x-auto pb-1 md:pb-0 scrollbar-thin">
                            {["", "open", "ongoing", "completed"].map((statusOption) => (
                                <button
                                    key={statusOption}
                                    type="button"
                                    onClick={() => handleStatusFilter(statusOption)}
                                    className={`px-4 py-2 rounded-xl text-xs font-bold uppercase font-['Orbitron'] tracking-wider border transition-all duration-300 whitespace-nowrap ${
                                        status === statusOption
                                            ? "bg-purple-600 border-purple-500 text-white shadow-[0_0_12px_rgba(168,85,247,0.4)]"
                                            : "bg-slate-100/60 dark:bg-[#0c122c]/40 border-blue-200 dark:border-blue-500/20 text-slate-600 dark:text-blue-200 hover:border-purple-500 hover:bg-purple-500/10"
                                    }`}
                                >
                                    {statusOption === "" ? "Semua" : statusOption === "open" ? "Tersedia" : statusOption === "ongoing" ? "Berjalan" : "Selesai"}
                                </button>
                            ))}
                        </div>
                    </form>
                </div>

                {/* QUEST LIST */}
                {quests.length === 0 ? (
                    <div className="flex-1 flex flex-col items-center justify-center py-20 bg-white/40 dark:bg-blue-950/10 backdrop-blur-sm rounded-3xl border border-blue-200/50 dark:border-blue-500/10 text-center font-['Oxanium']">
                        <Briefcase className="w-16 h-16 text-slate-300 dark:text-blue-900/60 mb-4 animate-pulse" />
                        <p className="text-lg font-semibold text-slate-600 dark:text-blue-200">Tidak ada quest yang ditemukan</p>
                        <p className="text-sm text-slate-400 dark:text-slate-500 mt-1">Coba sesuaikan kata kunci pencarian atau filter Anda.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-12">
                        {quests.map((quest) => (
                            <div
                                key={quest._id}
                                className="group relative bg-white/70 dark:bg-blue-950/30 backdrop-blur-md border border-blue-200 dark:border-blue-500/20 hover:border-purple-400 dark:hover:border-purple-500/50 rounded-2xl p-5 shadow-sm hover:shadow-[0_0_20px_rgba(124,58,237,0.15)] flex flex-col justify-between transition-all duration-300 transform hover:scale-[1.015]"
                            >
                                <div>
                                    <div className="flex items-start justify-between gap-3 mb-3">
                                        <h2 className="text-base sm:text-lg font-black font-['Oxanium'] tracking-tight text-slate-900 dark:text-white line-clamp-1 group-hover:text-[#3B28F6] dark:group-hover:text-purple-300 transition-colors">
                                            {quest.title}
                                        </h2>
                                        <span
                                            className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider font-['Orbitron'] ${
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

                                    <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-300 line-clamp-3 mb-4 leading-relaxed font-['Oxanium']">
                                        {quest.description}
                                    </p>

                                    <div className="grid grid-cols-2 gap-3 text-[11px] sm:text-xs font-['Oxanium'] border-t border-slate-100 dark:border-blue-500/10 pt-4 mb-4">
                                        <div className="flex items-center gap-2 text-slate-500 dark:text-blue-300/80">
                                            <DollarSign className="w-4 h-4 text-purple-500 shrink-0" />
                                            <div>
                                                <span className="block text-[9px] text-slate-400">Rentang Gaji</span>
                                                <span className="font-semibold text-slate-700 dark:text-white">
                                                    {formatCurrency(quest.min_salary)} - {formatCurrency(quest.max_salary)}
                                                </span>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-2 text-slate-500 dark:text-blue-300/80">
                                            <Calendar className="w-4 h-4 text-purple-500 shrink-0" />
                                            <div>
                                                <span className="block text-[9px] text-slate-400">Deadline</span>
                                                <span className="font-semibold text-slate-700 dark:text-white">
                                                    {formatDate(quest.deadline)}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center justify-between border-t border-slate-100 dark:border-blue-500/10 pt-4 mt-auto">
                                    <div className="flex flex-col">
                                        <span className="text-[9px] text-slate-400">Diposting Oleh</span>
                                        <span className="text-xs font-bold text-slate-600 dark:text-blue-200">
                                            {quest.creator.name}
                                            <span className="text-[10px] font-normal text-slate-400 ml-1">
                                                ({quest.creator.role === "admin" ? "Admin" : "Siswa"})
                                            </span>
                                        </span>
                                    </div>

                                    <div className="flex items-center gap-3">
                                        <div className="flex items-center gap-1 text-[11px] sm:text-xs text-slate-400 dark:text-blue-300/60 font-semibold font-['Oxanium']">
                                            <Users className="w-4 h-4 text-slate-400" />
                                            <span>{quest.bids_count} Bid</span>
                                        </div>

                                        <Link
                                            href={`/student/quests/${quest._id}`}
                                            className="px-4 py-1.5 rounded-lg text-xs font-bold font-['Orbitron'] uppercase tracking-wider text-purple-600 dark:text-purple-300 bg-purple-500/10 border border-purple-500/20 group-hover:bg-purple-600 group-hover:text-white group-hover:border-purple-500 transition-all duration-300"
                                        >
                                            Detail
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Quest History Drawer */}
            {isHistoryOpen && (
                <div className="fixed inset-0 z-[100] flex justify-end font-['Oxanium']">
                    {/* Backdrop */}
                    <div
                        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-300"
                        onClick={() => setIsHistoryOpen(false)}
                    />

                    {/* Drawer Content */}
                    <div className="relative w-full max-w-lg md:max-w-xl h-full bg-white dark:bg-[#080d26] border-l border-blue-200 dark:border-blue-500/20 shadow-2xl flex flex-col z-10 transition-transform duration-300 transform translate-x-0">
                        {/* Header */}
                        <div className="p-5 border-b border-blue-200 dark:border-blue-500/20 flex items-center justify-between bg-slate-50 dark:bg-black/10">
                            <div className="flex items-center gap-2.5">
                                <History className="w-5 h-5 text-purple-500" />
                                <h2 className="text-sm sm:text-base font-extrabold uppercase font-['Orbitron'] tracking-wider text-slate-800 dark:text-white">
                                    Riwayat Quest Saya
                                </h2>
                            </div>
                            <button
                                onClick={() => setIsHistoryOpen(false)}
                                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-655 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {/* List / Content */}
                        <div className="flex-1 overflow-y-auto p-5 space-y-4 scrollbar-thin">
                            {(!historyQuests || historyQuests.length === 0) ? (
                                <div className="text-center py-16 text-slate-400 dark:text-blue-300/40">
                                    <Briefcase className="w-12 h-12 mx-auto mb-3 opacity-30 animate-pulse" />
                                    <p className="font-bold text-sm">Belum Ada Riwayat Quest</p>
                                    <p className="text-xs mt-1 text-slate-500 max-w-[280px] mx-auto leading-relaxed">
                                        Anda belum mengambil quest atau mengajukan bid pekerjaan apapun saat ini.
                                    </p>
                                </div>
                            ) : (
                                historyQuests.map((item) => {
                                    const isExpanded = expandedQuestId === item._id;
                                    return (
                                        <div
                                            key={item._id}
                                            className={`rounded-2xl border transition-all duration-300 bg-white/50 dark:bg-black/20 ${
                                                isExpanded
                                                    ? "border-purple-500 dark:border-purple-500/60 shadow-lg"
                                                    : "border-blue-200 dark:border-blue-500/10 hover:border-blue-300 dark:hover:border-blue-500/30"
                                            }`}
                                        >
                                            {/* Accordion Trigger/Header */}
                                            <div
                                                onClick={() => setExpandedQuestId(isExpanded ? null : item._id)}
                                                className="p-4 cursor-pointer flex items-center justify-between gap-4 select-none"
                                            >
                                                <div className="min-w-0 space-y-1">
                                                    <div className="flex items-center gap-2 flex-wrap">
                                                        <span className={`px-2 py-0.5 rounded text-[9px] font-bold font-['Orbitron'] uppercase tracking-wider ${
                                                            item.status === 'completed'
                                                                ? 'bg-green-500/10 text-green-500 border border-green-500/20'
                                                                : item.status === 'submitted'
                                                                ? 'bg-amber-500/10 text-amber-500 border border-amber-500/20'
                                                                : item.status === 'ongoing'
                                                                ? 'bg-blue-500/10 text-blue-500 border border-blue-500/20'
                                                                : 'bg-slate-500/10 text-slate-500 border border-slate-500/20'
                                                        }`}>
                                                            {item.status === 'completed' ? 'Selesai' : item.status === 'submitted' ? 'Ditinjau' : item.status === 'ongoing' ? 'Berjalan' : 'Bidding'}
                                                        </span>
                                                        {item.is_worker ? (
                                                            <span className="px-2 py-0.5 rounded text-[9px] font-bold font-['Orbitron'] uppercase tracking-wider bg-indigo-500/10 text-indigo-500 border border-indigo-500/20">
                                                                Pekerja
                                                            </span>
                                                        ) : (
                                                            <span className="px-2 py-0.5 rounded text-[9px] font-bold font-['Orbitron'] uppercase tracking-wider bg-slate-500/10 text-slate-500 border border-slate-500/20">
                                                                Bidder
                                                            </span>
                                                        )}
                                                    </div>
                                                    <h3 className="font-bold text-xs sm:text-sm text-slate-850 dark:text-white truncate">
                                                        {item.title}
                                                    </h3>
                                                    <p className="text-[10px] text-slate-400">
                                                        Pembuat: {item.creator.name}
                                                    </p>
                                                </div>
                                                <div className="shrink-0 flex items-center gap-1.5">
                                                    <span className="text-[11px] font-bold font-['Orbitron'] text-purple-650 dark:text-purple-400">
                                                        {item.my_bid ? formatCurrency(item.my_bid.bid_amount) : formatCurrency(item.min_salary)}
                                                    </span>
                                                    <svg
                                                        className={`w-4 h-4 text-slate-400 transition-transform duration-300 ${
                                                            isExpanded ? "transform rotate-180" : ""
                                                        }`}
                                                        fill="none"
                                                        stroke="currentColor"
                                                        strokeWidth="2.5"
                                                        viewBox="0 0 24 24"
                                                    >
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                                                    </svg>
                                                </div>
                                            </div>

                                            {/* Accordion Content */}
                                            {isExpanded && (
                                                <div className="px-4 pb-4 border-t border-blue-200/50 dark:border-blue-500/5 pt-4 space-y-4 text-xs font-['Oxanium']">
                                                    {/* Overview */}
                                                    <div className="space-y-1 bg-slate-50/50 dark:bg-black/10 p-3 rounded-xl border border-blue-200/10">
                                                        <span className="block text-[9px] text-slate-400 uppercase font-semibold">Deskripsi Quest</span>
                                                        <p className="text-slate-600 dark:text-slate-350 leading-relaxed text-[11px] whitespace-pre-wrap">
                                                            {item.description}
                                                        </p>
                                                    </div>

                                                    {/* Salary Range & Deadline */}
                                                    <div className="grid grid-cols-2 gap-3 text-[11px]">
                                                        <div>
                                                            <span className="block text-[9px] text-slate-400 uppercase font-semibold">Gaji Quest</span>
                                                            <p className="font-semibold text-slate-700 dark:text-white">
                                                                {formatCurrency(item.min_salary)} - {formatCurrency(item.max_salary)}
                                                            </p>
                                                        </div>
                                                        <div>
                                                            <span className="block text-[9px] text-slate-400 uppercase font-semibold">Batas Waktu</span>
                                                            <p className="font-semibold text-slate-700 dark:text-white">
                                                                {formatDate(item.deadline)}
                                                            </p>
                                                        </div>
                                                    </div>

                                                    {/* Bid Info */}
                                                    {item.my_bid && (
                                                        <div className="space-y-2.5 border-t border-blue-200/30 dark:border-blue-500/5 pt-3">
                                                            <h4 className="font-bold text-[10px] text-slate-400 uppercase tracking-wider">Detail Penawaran (Bid) Anda</h4>
                                                            <div className="grid grid-cols-2 gap-2 text-[11px]">
                                                                <div>
                                                                    <span className="block text-[9px] text-slate-400 uppercase">Jumlah Bid</span>
                                                                    <p className="font-bold text-purple-600 dark:text-purple-400">
                                                                        {formatCurrency(item.my_bid.bid_amount)}
                                                                    </p>
                                                                </div>
                                                                <div>
                                                                    <span className="block text-[9px] text-slate-400 uppercase">Status Bid</span>
                                                                    <span className={`inline-block px-1.5 py-0.5 rounded text-[9px] font-bold font-['Orbitron'] tracking-wider ${
                                                                        item.my_bid.status === 'accepted'
                                                                            ? 'bg-green-500/10 text-green-500 border border-green-500/20'
                                                                            : item.my_bid.status === 'rejected'
                                                                            ? 'bg-red-500/10 text-red-500 border border-red-500/20'
                                                                            : 'bg-amber-500/10 text-amber-500 border border-amber-500/20'
                                                                    }`}>
                                                                        {item.my_bid.status === 'accepted' ? 'Diterima' : item.my_bid.status === 'rejected' ? 'Ditolak' : 'Menunggu'}
                                                                    </span>
                                                                </div>
                                                            </div>
                                                            {item.my_bid.proposal && (
                                                                <div>
                                                                    <span className="block text-[9px] text-slate-400 uppercase">Proposal Anda</span>
                                                                    <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-[11px] whitespace-pre-wrap">
                                                                        {item.my_bid.proposal}
                                                                    </p>
                                                                </div>
                                                            )}
                                                            {(item.my_bid.cv || item.my_bid.portfolio) && (
                                                                <div className="flex gap-2 flex-wrap">
                                                                    {item.my_bid.cv && (
                                                                        <a href={item.my_bid.cv} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-[10px] text-indigo-500 hover:underline">
                                                                            CV Lampiran <ExternalLink className="w-3 h-3" />
                                                                        </a>
                                                                    )}
                                                                    {item.my_bid.portfolio && (
                                                                        <a href={item.my_bid.portfolio} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-[10px] text-indigo-500 hover:underline">
                                                                            Portofolio Lampiran <ExternalLink className="w-3 h-3" />
                                                                        </a>
                                                                    )}
                                                                </div>
                                                            )}
                                                        </div>
                                                    )}

                                                    {/* Revision Notes if ongoing */}
                                                    {item.status === 'ongoing' && item.revision_note && (
                                                        <div className="p-3 bg-red-500/5 dark:bg-red-500/10 border border-red-500/20 rounded-xl space-y-1">
                                                            <span className="block text-[9px] font-bold uppercase tracking-wider text-red-500">Minta Revisi Dari Pembuat:</span>
                                                            <p className="text-[11px] text-slate-700 dark:text-slate-350 leading-relaxed whitespace-pre-wrap">
                                                                {item.revision_note}
                                                            </p>
                                                        </div>
                                                    )}

                                                    {/* Work Submission Details */}
                                                    {(item.status === 'submitted' || item.status === 'completed') && (
                                                        <div className="space-y-3 border-t border-blue-200/30 dark:border-blue-500/5 pt-3">
                                                            <h4 className="font-bold text-[10px] text-slate-400 uppercase tracking-wider">Hasil Pekerjaan yang Dikirim</h4>
                                                            
                                                            {item.submission_file && (
                                                                <div className="space-y-1">
                                                                    <span className="block text-[9px] text-slate-400 uppercase">Berkas ZIP Utama</span>
                                                                    <div className="flex items-center justify-between p-2.5 rounded-xl border border-amber-200/40 dark:border-amber-500/20 bg-amber-500/5 dark:bg-amber-950/10">
                                                                        <div className="flex items-center gap-2.5 min-w-0">
                                                                            <FileArchive className="w-5 h-5 text-amber-500 shrink-0" />
                                                                            <div className="min-w-0 font-['Oxanium']">
                                                                                <p className="text-xs font-semibold text-slate-700 dark:text-slate-200 truncate">
                                                                                    {item.submission_file.name}
                                                                                </p>
                                                                                <p className="text-[10px] text-slate-400">
                                                                                    {formatBytes(item.submission_file.size)}
                                                                                </p>
                                                                            </div>
                                                                        </div>
                                                                        <a
                                                                            href={item.submission_file.url}
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

                                                            {item.submission_link && (
                                                                <div>
                                                                    <span className="block text-[9px] text-slate-400 uppercase">Link Pekerjaan Pendukung</span>
                                                                    <a href={item.submission_link} target="_blank" rel="noopener noreferrer" className="text-indigo-500 hover:underline break-all font-semibold block text-[11px] mt-0.5">
                                                                        {item.submission_link}
                                                                    </a>
                                                                </div>
                                                            )}

                                                            {item.submission_note && (
                                                                <div>
                                                                    <span className="block text-[9px] text-slate-400 uppercase font-semibold">Catatan Pengiriman</span>
                                                                    <p className="text-slate-650 dark:text-slate-350 leading-relaxed text-[11px] whitespace-pre-wrap bg-slate-50 dark:bg-black/10 p-2 rounded-lg border border-slate-100 dark:border-blue-500/5">
                                                                        {item.submission_note}
                                                                    </p>
                                                                </div>
                                                            )}
                                                        </div>
                                                    )}

                                                    {/* Rating, Review Comment, and Gamification Rewards for Completed */}
                                                    {item.status === 'completed' && (
                                                        <div className="space-y-3 border-t border-blue-200/30 dark:border-blue-500/5 pt-3">
                                                            <h4 className="font-bold text-[10px] text-slate-400 uppercase tracking-wider">Hasil Ulasan & Hadiah</h4>
                                                            
                                                            {item.rating && (
                                                                <div className="space-y-1.5 p-3 rounded-xl bg-slate-50 dark:bg-black/10 border border-slate-100 dark:border-blue-500/5">
                                                                    <div className="flex gap-0.5">
                                                                        {[1, 2, 3, 4, 5].map((star) => (
                                                                            <Star
                                                                                key={star}
                                                                                className={`w-4.5 h-4.5 ${
                                                                                    star <= (item.rating ?? 0)
                                                                                        ? "text-amber-400 fill-amber-400"
                                                                                        : "text-slate-300 dark:text-slate-600"
                                                                                }`}
                                                                            />
                                                                        ))}
                                                                    </div>
                                                                    {item.rating_comment && (
                                                                        <p className="text-xs italic text-slate-600 dark:text-slate-300 leading-relaxed">
                                                                            "{item.rating_comment}"
                                                                        </p>
                                                                    )}
                                                                </div>
                                                            )}

                                                            <div className="grid grid-cols-3 gap-2 text-center font-['Orbitron'] text-[10px] font-bold pt-1">
                                                                <div className="p-2 rounded-lg bg-purple-500/10 border border-purple-500/20 text-purple-600 dark:text-purple-300 flex flex-col gap-0.5">
                                                                    <span className="text-[9px] text-slate-400 font-sans">EXP</span>
                                                                    <span>+250 EXP</span>
                                                                </div>
                                                                <div className="p-2 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-600 dark:text-amber-400 flex flex-col gap-0.5">
                                                                    <span className="text-[9px] text-slate-400 font-sans">Gold</span>
                                                                    <span>+150 Gold</span>
                                                                </div>
                                                                <div className="p-2 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-indigo-600 dark:text-indigo-300 flex flex-col gap-0.5">
                                                                    <span className="text-[9px] text-slate-400 font-sans">ERP (Quiz)</span>
                                                                    <span>+100 ERP</span>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    )}

                                                    {/* Link to detail page */}
                                                    <div className="pt-2">
                                                        <Link
                                                            href={`/student/quests/${item._id}`}
                                                            className="w-full py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-750 text-white font-bold text-center rounded-xl flex items-center justify-center gap-1.5 uppercase font-['Orbitron'] tracking-wider text-[10px] transition-colors"
                                                        >
                                                            Buka Halaman Quest <ExternalLink className="w-3.5 h-3.5" />
                                                        </Link>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    );
                                })
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
