import { Link, router } from "@inertiajs/react";
import React, { useState } from "react";
import {
    Search,
    Calendar,
    DollarSign,
    Users,
    Plus,
    Briefcase,
    History,
    X,
    ExternalLink,
    FileArchive,
    Download,
    Star,
    ArrowLeft,
    Award,
    Sparkles,
    User,
    Compass,
    Activity,
    Info,
    CheckCircle2
} from "lucide-react";

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
    is_creator: boolean;
    worker?: {
        name: string;
        email: string;
    } | null;
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
    const [sortBy, setSortBy] = useState<"latest" | "highest_salary" | "closest_deadline">("latest");
    const [isHistoryOpen, setIsHistoryOpen] = useState(false);
    const [expandedQuestId, setExpandedQuestId] = useState<string | null>(null);

    // Inner filter for History Drawer
    const [historyRoleFilter, setHistoryRoleFilter] = useState<"all" | "creator" | "worker" | "bidder">("all");

    const sortedQuests = [...quests].sort((a, b) => {
        if (sortBy === "highest_salary") {
            return b.max_salary - a.max_salary;
        }
        if (sortBy === "closest_deadline") {
            return new Date(a.deadline).getTime() - new Date(b.deadline).getTime();
        }
        return 0;
    });

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

    // Dynamic RPG rewards badges based on budget rank
    const getQuestRank = (maxVal: number) => {
        if (maxVal >= 10000000) return { rank: "Mythic", color: "text-red-500 bg-red-500/10 border-red-500/20" };
        if (maxVal >= 5000000) return { rank: "Diamond", color: "text-blue-400 bg-blue-500/10 border-blue-500/20" };
        if (maxVal >= 2500000) return { rank: "Gold", color: "text-amber-500 bg-amber-500/10 border-amber-500/20" };
        if (maxVal >= 1000000) return { rank: "Silver", color: "text-slate-400 bg-slate-500/10 border-slate-500/20" };
        return { rank: "Bronze", color: "text-orange-500 bg-orange-500/10 border-orange-500/20" };
    };

    // Filter history by role tab
    const filteredHistoryQuests = historyQuests.filter((item) => {
        if (historyRoleFilter === "creator") return item.is_creator;
        if (historyRoleFilter === "worker") return item.is_worker;
        if (historyRoleFilter === "bidder") return !item.is_creator && !item.is_worker;
        return true;
    });

    return (
        <div 
            className="min-h-screen bg-slate-50 dark:bg-[#060813] text-slate-800 dark:text-white flex flex-col p-3 sm:p-6 md:p-8 relative overflow-x-hidden transition-colors duration-200"
            style={{ fontFamily: "'Outfit', sans-serif" }}
        >
            {/* Ambient top-center glow */}
            <div className="pointer-events-none absolute top-0 left-1/2 z-0 h-[450px] w-full max-w-7xl -translate-x-1/2 rounded-full bg-indigo-500/5 blur-[120px] select-none" />

            <div className="w-full max-w-6xl mx-auto relative z-10 flex-1 flex flex-col min-h-0 space-y-6">
                
                {/* HEADER */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-200 dark:border-slate-800/80 pb-5">
                    <div className="flex items-center gap-3">
                        <Link
                            href="/student/dashboard"
                            className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0c122c]/40 text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors shadow-sm cursor-pointer shrink-0"
                            title="Kembali ke Dashboard"
                        >
                            <ArrowLeft size={16} />
                        </Link>
                        <div>
                            <h2 className="text-xl sm:text-2xl md:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white font-['Oxanium']">
                                QUEST BOARD
                            </h2>
                            <p className="text-xs text-slate-400 font-medium">
                                Cari dan selesaikan berbagai quest menantang untuk menaikkan reputasi RPG Anda.
                            </p>
                        </div>
                    </div>

                    <div className="flex gap-2.5 shrink-0 flex-wrap">
                        <button
                            type="button"
                            onClick={() => setIsHistoryOpen(true)}
                            className="inline-flex items-center justify-center gap-2 px-4.5 py-2 rounded-xl text-slate-700 dark:text-blue-100 font-bold font-['Orbitron'] uppercase tracking-wider text-xs bg-white dark:bg-blue-950/20 border border-slate-200 dark:border-blue-500/20 hover:bg-slate-100 dark:hover:bg-blue-950/40 shadow-sm transition-all duration-300 transform active:scale-95 cursor-pointer"
                        >
                            <History className="w-4 h-4 text-purple-550 dark:text-purple-400" />
                            Riwayat Quest
                        </button>

                        <Link
                            href="/student/quests/create"
                            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-white font-bold font-['Orbitron'] uppercase tracking-wider text-xs bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 shadow-[0_0_15px_rgba(124,58,237,0.3)] transition-all duration-300 transform hover:scale-[1.02] active:scale-98"
                        >
                            <Plus className="w-4 h-4" />
                            Tambah Quest
                        </Link>
                    </div>
                </div>

                {/* FILTERS & SEARCH */}
                <div className="bg-white/70 dark:bg-[#0c122c]/40 backdrop-blur-md rounded-2xl border border-slate-200 dark:border-slate-800/80 p-4 shadow-sm transition-all duration-300">
                    <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-4 items-center">
                        <div className="relative w-full md:flex-1">
                            <input
                                type="text"
                                placeholder="Cari lowongan quest..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="w-full pl-11 pr-4 py-2.5 bg-slate-50 dark:bg-black/20 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:border-indigo-500 text-xs sm:text-sm text-slate-800 dark:text-white font-['Oxanium'] transition-colors"
                            />
                            <Search className="absolute left-3.5 top-3 text-slate-400 dark:text-slate-500 w-5 h-5" />
                        </div>

                        {/* Sort Selector */}
                        <div className="w-full md:w-48 font-['Oxanium']">
                            <select
                                value={sortBy}
                                onChange={(e) => setSortBy(e.target.value as any)}
                                className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-black/20 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:border-indigo-500 text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-350 cursor-pointer"
                            >
                                <option value="latest" className="bg-white dark:bg-[#060813]">Urutan: Terbaru</option>
                                <option value="highest_salary" className="bg-white dark:bg-[#060813]">Gaji Tertinggi</option>
                                <option value="closest_deadline" className="bg-white dark:bg-[#060813]">Deadline Terdekat</option>
                            </select>
                        </div>

                        {/* Status Pills */}
                        <div className="flex gap-2 w-full md:w-auto overflow-x-auto pb-1 md:pb-0 scrollbar-thin">
                            {[
                                { val: "", label: "Semua" },
                                { val: "open", label: "Tersedia" },
                                { val: "ongoing", label: "Berjalan" },
                                { val: "completed", label: "Selesai" }
                            ].map((statusOption) => (
                                <button
                                    key={statusOption.val}
                                    type="button"
                                    onClick={() => handleStatusFilter(statusOption.val)}
                                    className={`px-4 py-2 rounded-xl text-xs font-bold uppercase font-['Orbitron'] tracking-wider border transition-all duration-300 whitespace-nowrap cursor-pointer ${
                                        status === statusOption.val
                                            ? "bg-indigo-600 border-indigo-500 text-white shadow-[0_0_12px_rgba(99,102,241,0.4)]"
                                            : "bg-slate-50 dark:bg-black/20 border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 hover:border-indigo-500/50 hover:bg-indigo-500/5"
                                    }`}
                                >
                                    {statusOption.label}
                                </button>
                            ))}
                        </div>
                    </form>
                </div>

                {/* QUEST LIST */}
                {sortedQuests.length === 0 ? (
                    <div className="flex-1 flex flex-col items-center justify-center py-20 bg-white/40 dark:bg-[#0c122c]/20 backdrop-blur-sm rounded-2xl border border-slate-200 dark:border-slate-800/80 text-center font-['Oxanium'] shadow-sm">
                        <Briefcase className="w-14 h-14 text-slate-300 dark:text-blue-900/40 mb-4 animate-pulse" />
                        <p className="text-base font-bold text-slate-650 dark:text-blue-200">Tidak ada quest yang tersedia</p>
                        <p className="text-xs text-slate-400 dark:text-slate-500 mt-1 max-w-sm mx-auto leading-relaxed">
                            Coba ubah kata kunci pencarian Anda atau periksa filter status lainnya untuk melihat quest yang tersedia.
                        </p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-12">
                        {sortedQuests.map((quest) => {
                            const rankInfo = getQuestRank(quest.max_salary);
                            return (
                                <div
                                    key={quest._id}
                                    className="group relative bg-white/70 dark:bg-[#0c122c]/40 backdrop-blur-md border border-slate-200 dark:border-slate-800/80 hover:border-indigo-500/45 dark:hover:border-indigo-500/40 rounded-2xl p-5 shadow-sm hover:shadow-[0_0_20px_rgba(99,102,241,0.08)] flex flex-col justify-between transition-all duration-300 transform hover:-translate-y-1"
                                >
                                    <div>
                                        {/* Badge header */}
                                        <div className="flex items-start justify-between gap-3 mb-3 font-['Orbitron']">
                                            <span className={`px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-wider border ${rankInfo.color}`}>
                                                Rank: {rankInfo.rank}
                                            </span>
                                            
                                            <span
                                                className={`px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider border ${
                                                    quest.status === "open"
                                                        ? "bg-green-500/10 text-green-700 border-green-500/20 dark:text-green-400"
                                                        : quest.status === "ongoing"
                                                        ? "bg-blue-500/10 text-blue-700 border-blue-500/20 dark:text-blue-400"
                                                        : "bg-slate-500/10 text-slate-600 border-slate-500/20 dark:text-slate-400"
                                                }`}
                                            >
                                                {quest.status === "open" ? "Tersedia" : quest.status === "ongoing" ? "Berjalan" : "Selesai"}
                                            </span>
                                        </div>

                                        {/* Title */}
                                        <h2 className="text-sm sm:text-base font-extrabold font-['Oxanium'] tracking-tight text-slate-900 dark:text-white line-clamp-1 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors mb-2">
                                            {quest.title}
                                        </h2>

                                        {/* Description */}
                                        <p className="text-xs text-slate-500 dark:text-slate-350 line-clamp-3 mb-4 leading-relaxed font-['Oxanium']">
                                            {quest.description}
                                        </p>

                                        {/* Specifications details */}
                                        <div className="grid grid-cols-2 gap-3 text-[11px] font-['Oxanium'] border-t border-slate-100 dark:border-slate-800/40 pt-4 mb-4">
                                            <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400">
                                                <DollarSign className="w-4 h-4 text-indigo-500 shrink-0" />
                                                <div>
                                                    <span className="block text-[8px] text-slate-400 uppercase tracking-wider font-semibold">Rentang Gaji</span>
                                                    <span className="font-bold text-slate-700 dark:text-white">
                                                        {formatCurrency(quest.min_salary)} - {formatCurrency(quest.max_salary)}
                                                    </span>
                                                </div>
                                            </div>

                                            <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400">
                                                <Calendar className="w-4 h-4 text-indigo-500 shrink-0" />
                                                <div>
                                                    <span className="block text-[8px] text-slate-400 uppercase tracking-wider font-semibold">Deadline</span>
                                                    <span className="font-bold text-slate-700 dark:text-white">
                                                        {formatDate(quest.deadline)}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Card Footer */}
                                    <div className="flex items-center justify-between border-t border-slate-100 dark:border-slate-800/40 pt-4 mt-auto">
                                        <div className="flex flex-col font-['Oxanium']">
                                            <span className="text-[8px] text-slate-400 uppercase tracking-wider font-semibold">Diposting Oleh</span>
                                            <span className="text-xs font-bold text-slate-600 dark:text-slate-300">
                                                {quest.creator.name}
                                                <span className="text-[10px] font-medium text-slate-400 ml-1">
                                                    ({quest.creator.role === "admin" ? "Admin" : "Siswa"})
                                                </span>
                                            </span>
                                        </div>

                                        <div className="flex items-center gap-3">
                                            <div className="flex items-center gap-1 text-xs text-slate-400 dark:text-slate-500 font-semibold font-['Oxanium']">
                                                <Users className="w-4 h-4" />
                                                <span>{quest.bids_count} Bid</span>
                                            </div>

                                            <Link
                                                href={`/student/quests/${quest._id}`}
                                                className="px-4 py-1.5 rounded-lg text-[10px] font-bold font-['Orbitron'] uppercase tracking-wider text-indigo-650 dark:text-indigo-305 bg-indigo-500/10 border border-indigo-500/20 group-hover:bg-indigo-600 group-hover:text-white group-hover:border-indigo-600 transition-all duration-300"
                                            >
                                                Ambil Detail
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>

            {/* Quest History Drawer */}
            {isHistoryOpen && (
                <div className="fixed inset-0 z-[100] flex justify-end font-['Oxanium']">
                    {/* Backdrop */}
                    <div
                        className="absolute inset-0 bg-black/60 backdrop-blur-md transition-opacity duration-300 cursor-pointer"
                        onClick={() => setIsHistoryOpen(false)}
                    />

                    {/* Drawer Content */}
                    <div className="relative w-full max-w-lg md:max-w-xl h-full bg-slate-900/90 dark:bg-[#070b19]/95 border-l border-slate-800 shadow-2xl flex flex-col z-10 transition-transform duration-300 transform translate-x-0 backdrop-blur-lg">
                        
                        {/* Drawer Header */}
                        <div className="p-5 border-b border-slate-800 flex items-center justify-between bg-black/20">
                            <div className="flex items-center gap-2.5">
                                <History className="w-5 h-5 text-indigo-400" />
                                <h2 className="text-sm sm:text-base font-extrabold uppercase font-['Orbitron'] tracking-wider text-white">
                                    Riwayat Quest Saya
                                </h2>
                            </div>
                            <button
                                onClick={() => setIsHistoryOpen(false)}
                                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Quick filter tabs inside history drawer */}
                        <div className="px-5 py-2.5 border-b border-slate-800 bg-black/10 flex gap-2 font-['Orbitron'] text-[9px] font-black uppercase tracking-wider overflow-x-auto scrollbar-none">
                            {[
                                { key: "all", label: "Semua" },
                                { key: "creator", label: "Pembuat" },
                                { key: "worker", label: "Pekerja" },
                                { key: "bidder", label: "Bidder" }
                            ].map((roleTab) => (
                                <button
                                    key={roleTab.key}
                                    onClick={() => {
                                        setHistoryRoleFilter(roleTab.key as any);
                                        setExpandedQuestId(null);
                                    }}
                                    className={`px-3 py-1.5 rounded-lg border transition-all cursor-pointer whitespace-nowrap ${
                                        historyRoleFilter === roleTab.key
                                            ? "bg-indigo-600 border-indigo-500 text-white shadow-sm"
                                            : "bg-white/5 border-white/5 text-slate-400 hover:text-white hover:bg-white/10"
                                    }`}
                                >
                                    {roleTab.label}
                                </button>
                            ))}
                        </div>

                        {/* List / Content */}
                        <div className="flex-1 overflow-y-auto p-5 space-y-4 scrollbar-thin">
                            {filteredHistoryQuests.length === 0 ? (
                                <div className="text-center py-20 text-slate-500">
                                    <Briefcase className="w-12 h-12 mx-auto mb-3 opacity-30 animate-pulse text-indigo-450" />
                                    <p className="font-bold text-sm text-slate-350">Tidak ada riwayat quest</p>
                                    <p className="text-[11px] mt-1 text-slate-450 max-w-[280px] mx-auto leading-relaxed">
                                        Anda tidak memiliki catatan quest dengan filter peran "{historyRoleFilter === 'all' ? 'Semua' : historyRoleFilter === 'creator' ? 'Pembuat' : historyRoleFilter === 'worker' ? 'Pekerja' : 'Bidder'}".
                                    </p>
                                </div>
                            ) : (
                                filteredHistoryQuests.map((item) => {
                                    const isExpanded = expandedQuestId === item._id;
                                    return (
                                        <div
                                            key={item._id}
                                            className={`rounded-2xl border transition-all duration-300 bg-white/5 dark:bg-black/25 ${
                                                isExpanded
                                                    ? "border-indigo-500/50 shadow-[0_0_15px_rgba(99,102,241,0.12)]"
                                                    : "border-slate-800 hover:border-slate-700"
                                            }`}
                                        >
                                            {/* Accordion Trigger/Header */}
                                            <div
                                                onClick={() => setExpandedQuestId(isExpanded ? null : item._id)}
                                                className="p-4 cursor-pointer flex items-center justify-between gap-4 select-none"
                                            >
                                                <div className="min-w-0 space-y-1">
                                                    <div className="flex items-center gap-2 flex-wrap">
                                                        <span className={`px-2 py-0.5 rounded text-[8px] font-bold font-['Orbitron'] uppercase tracking-wider ${
                                                            item.status === 'completed'
                                                                ? 'bg-green-500/10 text-green-400 border border-green-500/20'
                                                                : item.status === 'approved'
                                                                ? 'bg-indigo-500/10 text-indigo-405 border border-indigo-500/20'
                                                                : item.status === 'submitted'
                                                                ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                                                                : item.status === 'ongoing'
                                                                ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                                                                : 'bg-slate-500/10 text-slate-400 border border-slate-500/20'
                                                        }`}>
                                                            {item.status === 'completed' ? 'Selesai' : item.status === 'approved' ? 'Disetujui' : item.status === 'submitted' ? 'Ditinjau' : item.status === 'ongoing' ? 'Berjalan' : 'Bidding'}
                                                        </span>
                                                        
                                                        {item.is_creator ? (
                                                            <span className="px-2 py-0.5 rounded text-[8px] font-bold font-['Orbitron'] uppercase tracking-wider bg-purple-500/10 text-purple-400 border border-purple-500/20">
                                                                Pembuat
                                                            </span>
                                                        ) : item.is_worker ? (
                                                            <span className="px-2 py-0.5 rounded text-[8px] font-bold font-['Orbitron'] uppercase tracking-wider bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                                                                Pekerja
                                                            </span>
                                                        ) : (
                                                            <span className="px-2 py-0.5 rounded text-[8px] font-bold font-['Orbitron'] uppercase tracking-wider bg-slate-500/10 text-slate-400 border border-slate-550/20">
                                                                Bidder
                                                            </span>
                                                        )}
                                                    </div>
                                                    
                                                    <h3 className="font-bold text-xs text-slate-200 truncate">
                                                        {item.title}
                                                    </h3>
                                                    
                                                    <p className="text-[10px] text-slate-450">
                                                        {item.is_creator
                                                            ? (item.worker ? `Pekerja: ${item.worker.name}` : "Belum Ada Pekerja")
                                                            : `Pembuat: ${item.creator.name}`
                                                        }
                                                    </p>
                                                </div>
                                                
                                                <div className="shrink-0 flex items-center gap-1.5">
                                                    <span className="text-[10px] font-bold font-['Orbitron'] text-purple-400">
                                                        {item.is_creator
                                                            ? `${formatCurrency(item.min_salary)} - ${formatCurrency(item.max_salary)}`
                                                            : item.my_bid
                                                            ? formatCurrency(item.my_bid.bid_amount)
                                                            : formatCurrency(item.min_salary)
                                                        }
                                                    </span>
                                                    <svg
                                                        className={`w-3.5 h-3.5 text-slate-500 transition-transform duration-300 ${
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
                                                <div className="px-4 pb-4 border-t border-slate-800/60 pt-4 space-y-4 text-xs font-['Oxanium'] bg-black/10 rounded-b-2xl">
                                                    
                                                    {/* Stepper Progress Horizontal Timeline */}
                                                    <div className="p-3.5 rounded-xl bg-black/20 border border-slate-800/80 font-['Orbitron'] text-[8px] font-bold tracking-wider space-y-3.5">
                                                        <span className="block text-[8px] font-bold text-slate-500 uppercase tracking-wider border-b border-slate-800 pb-1.5">
                                                            Progress Alur Quest
                                                        </span>
                                                        <div className="flex items-center justify-between relative pt-1.5">
                                                            <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 h-0.5 bg-slate-800 z-0" />
                                                            <div 
                                                                className="absolute left-0 top-1/2 -translate-y-1/2 h-0.5 bg-indigo-500 z-0 transition-all duration-350" 
                                                                style={{
                                                                    width: item.status === 'open' ? '0%'
                                                                        : item.status === 'ongoing' ? '25%'
                                                                        : item.status === 'submitted' ? '50%'
                                                                        : item.status === 'approved' ? '75%'
                                                                        : '100%'
                                                                }}
                                                            />

                                                            {[
                                                                { key: 'open', label: 'Bidding' },
                                                                { key: 'ongoing', label: 'Proyek' },
                                                                { key: 'submitted', label: 'Tinjau' },
                                                                { key: 'approved', label: 'Setuju' },
                                                                { key: 'completed', label: 'Selesai' }
                                                            ].map((step, idx) => {
                                                                const statuses = ['open', 'ongoing', 'submitted', 'approved', 'completed'];
                                                                const currentIdx = statuses.indexOf(item.status);
                                                                const stepIdx = statuses.indexOf(step.key);
                                                                const isCompleted = stepIdx < currentIdx || item.status === 'completed';
                                                                const isActive = item.status === step.key;

                                                                return (
                                                                    <div key={step.key} className="flex flex-col items-center z-10 relative">
                                                                        <div 
                                                                            className={`w-5 h-5 rounded-full flex items-center justify-center border text-[8px] transition-all duration-300 ${
                                                                                isCompleted
                                                                                    ? 'bg-indigo-600 border-indigo-500 text-white shadow-sm'
                                                                                    : isActive
                                                                                    ? 'bg-purple-600 border-purple-500 text-white shadow-sm'
                                                                                    : 'bg-slate-900 border-slate-800 text-slate-500'
                                                                            }`}
                                                                        >
                                                                            {isCompleted ? '✓' : idx + 1}
                                                                        </div>
                                                                        <span 
                                                                            className={`mt-1 text-[7px] uppercase tracking-widest ${
                                                                                isActive || isCompleted ? 'text-indigo-400 font-black' : 'text-slate-500'
                                                                            }`}
                                                                        >
                                                                            {step.label}
                                                                        </span>
                                                                    </div>
                                                                );
                                                            })}
                                                        </div>
                                                    </div>

                                                    {/* Description overview */}
                                                    <div className="space-y-1 bg-black/15 p-3 rounded-xl border border-slate-800/80">
                                                        <span className="block text-[8px] text-slate-405 uppercase font-semibold">Deskripsi Quest</span>
                                                        <p className="text-slate-350 leading-relaxed text-[11px] whitespace-pre-wrap">
                                                            {item.description}
                                                        </p>
                                                    </div>

                                                    {/* Details Budget */}
                                                    <div className="grid grid-cols-2 gap-3 text-[11px]">
                                                        <div>
                                                            <span className="block text-[8px] text-slate-450 uppercase font-semibold">Anggaran Gaji</span>
                                                            <p className="font-bold text-slate-205">
                                                                {formatCurrency(item.min_salary)} - {formatCurrency(item.max_salary)}
                                                            </p>
                                                        </div>
                                                        <div>
                                                            <span className="block text-[8px] text-slate-450 uppercase font-semibold">Tenggat Waktu</span>
                                                            <p className="font-bold text-slate-205">
                                                                {formatDate(item.deadline)}
                                                            </p>
                                                        </div>
                                                    </div>

                                                    {/* Bid Info */}
                                                    {item.my_bid && (
                                                        <div className="space-y-2 border-t border-slate-800/40 pt-3">
                                                            <h4 className="font-bold text-[9px] text-slate-400 uppercase tracking-wider font-['Orbitron']">Detail Penawaran (Bid) Anda</h4>
                                                            <div className="grid grid-cols-2 gap-2 text-[11px]">
                                                                <div>
                                                                    <span className="block text-[8px] text-slate-455">Jumlah Bid</span>
                                                                    <p className="font-bold text-purple-400">
                                                                        {formatCurrency(item.my_bid.bid_amount)}
                                                                    </p>
                                                                </div>
                                                                <div>
                                                                    <span className="block text-[8px] text-slate-455">Status Bid</span>
                                                                    <span className={`inline-block px-1.5 py-0.5 rounded text-[8px] font-black font-['Orbitron'] tracking-wider border ${
                                                                        item.my_bid.status === 'accepted'
                                                                            ? 'bg-green-500/10 text-green-400 border-green-500/20'
                                                                            : item.my_bid.status === 'rejected'
                                                                            ? 'bg-red-500/10 text-red-400 border-red-500/20'
                                                                            : 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                                                                    }`}>
                                                                        {item.my_bid.status === 'accepted' ? 'Diterima' : item.my_bid.status === 'rejected' ? 'Ditolak' : 'Menunggu'}
                                                                    </span>
                                                                </div>
                                                            </div>
                                                            {item.my_bid.proposal && (
                                                                <div>
                                                                    <span className="block text-[8px] text-slate-455">Proposal Anda</span>
                                                                    <p className="text-slate-350 leading-relaxed text-[11px] whitespace-pre-wrap">
                                                                        {item.my_bid.proposal}
                                                                    </p>
                                                                </div>
                                                            )}
                                                            {(item.my_bid.cv || item.my_bid.portfolio) && (
                                                                <div className="flex gap-2.5 flex-wrap pt-1">
                                                                    {item.my_bid.cv && (
                                                                        <a href={item.my_bid.cv} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-[10px] text-indigo-400 hover:underline">
                                                                            CV Lampiran <ExternalLink className="w-3 h-3" />
                                                                        </a>
                                                                    )}
                                                                    {item.my_bid.portfolio && (
                                                                        <a href={item.my_bid.portfolio} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-[10px] text-indigo-400 hover:underline">
                                                                            Portofolio Lampiran <ExternalLink className="w-3 h-3" />
                                                                        </a>
                                                                    )}
                                                                </div>
                                                            )}
                                                        </div>
                                                    )}

                                                    {/* Revision Notes if ongoing */}
                                                    {item.status === 'ongoing' && item.revision_note && (
                                                        <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl space-y-1">
                                                            <span className="block text-[8px] font-bold uppercase tracking-wider text-red-500 font-['Orbitron']">
                                                                {item.is_creator ? "Feedback Revisi Anda:" : "Minta Revisi Dari Pembuat:"}
                                                            </span>
                                                            <p className="text-[11px] text-slate-300 leading-relaxed whitespace-pre-wrap italic">
                                                                "{item.revision_note}"
                                                            </p>
                                                        </div>
                                                    )}

                                                    {/* Work Submission Details */}
                                                    {(item.status === 'submitted' || item.status === 'approved' || item.status === 'completed') && (
                                                        <div className="space-y-3 border-t border-slate-800/40 pt-3">
                                                            <h4 className="font-bold text-[9px] text-slate-400 uppercase tracking-wider font-['Orbitron']">
                                                                {item.is_creator ? "Hasil Pekerjaan Pekerja" : "Hasil Pekerjaan yang Dikirim"}
                                                            </h4>
                                                            
                                                            {item.submission_file && (
                                                                <div className="space-y-1">
                                                                    <span className="block text-[8px] text-slate-455">Berkas ZIP Utama</span>
                                                                    <div className="flex items-center justify-between p-2.5 rounded-xl border border-amber-500/20 bg-amber-500/5">
                                                                        <div className="flex items-center gap-2.5 min-w-0">
                                                                            <FileArchive className="w-5 h-5 text-amber-500 shrink-0" />
                                                                            <div className="min-w-0">
                                                                                <p className="text-xs font-semibold text-slate-200 truncate">
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
                                                                            className="flex items-center justify-center p-1.5 text-amber-400 hover:text-amber-500 hover:bg-amber-500/10 rounded-lg transition-colors cursor-pointer"
                                                                            title="Unduh ZIP di Tab Baru"
                                                                        >
                                                                            <Download className="w-4 h-4" />
                                                                        </a>
                                                                    </div>
                                                                </div>
                                                            )}

                                                            {item.submission_link && (
                                                                <div>
                                                                    <span className="block text-[8px] text-slate-455">Link Pekerjaan Pendukung</span>
                                                                    <a href={item.submission_link} target="_blank" rel="noopener noreferrer" className="text-indigo-400 hover:underline break-all font-semibold block text-[11px] mt-0.5">
                                                                        {item.submission_link}
                                                                    </a>
                                                                </div>
                                                            )}

                                                            {item.submission_note && (
                                                                <div>
                                                                    <span className="block text-[8px] text-slate-455">Catatan Pengiriman</span>
                                                                    <p className="text-slate-350 leading-relaxed text-[11px] whitespace-pre-wrap bg-slate-950/20 p-2.5 rounded-lg border border-slate-800">
                                                                        {item.submission_note}
                                                                    </p>
                                                                </div>
                                                            )}
                                                        </div>
                                                    )}

                                                    {/* Rating, Review Comment, and Gamification Rewards for Completed */}
                                                    {item.status === 'completed' && (
                                                        <div className="space-y-3 border-t border-slate-800/40 pt-3">
                                                            <h4 className="font-bold text-[9px] text-slate-400 uppercase tracking-wider font-['Orbitron']">
                                                                {item.is_creator ? "Hasil Ulasan & Hadiah Pekerja" : "Hasil Ulasan & Hadiah"}
                                                            </h4>
                                                            
                                                            {item.rating && (
                                                                <div className="space-y-1.5 p-3 rounded-xl bg-slate-950/20 border border-slate-800/80">
                                                                    <div className="flex gap-0.5">
                                                                        {[1, 2, 3, 4, 5].map((star) => (
                                                                            <Star
                                                                                key={star}
                                                                                className={`w-4 h-4 ${
                                                                                    star <= (item.rating ?? 0)
                                                                                        ? "text-amber-400 fill-amber-400"
                                                                                        : "text-slate-650"
                                                                                }`}
                                                                            />
                                                                        ))}
                                                                    </div>
                                                                    {item.rating_comment && (
                                                                        <p className="text-xs italic text-slate-300 leading-relaxed">
                                                                            "{item.rating_comment}"
                                                                        </p>
                                                                    )}
                                                                </div>
                                                            )}

                                                            <div className="grid grid-cols-3 gap-2 text-center font-['Orbitron'] text-[9px] font-black pt-1">
                                                                <div className="p-2 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-300 flex flex-col gap-0.5">
                                                                    <span className="text-[7.5px] text-slate-450 font-sans">EXP {item.is_creator ? "(Pek)" : ""}</span>
                                                                    <span>+250 EXP</span>
                                                                </div>
                                                                <div className="p-2 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex flex-col gap-0.5">
                                                                    <span className="text-[7.5px] text-slate-450 font-sans">GOLD {item.is_creator ? "(Pek)" : ""}</span>
                                                                    <span>+150 GOLD</span>
                                                                </div>
                                                                <div className="p-2 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 flex flex-col gap-0.5">
                                                                    <span className="text-[7.5px] text-slate-455 font-sans">ERP {item.is_creator ? "(Pek)" : ""}</span>
                                                                    <span>+100 ERP</span>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    )}

                                                    {/* Link to detail page */}
                                                    <div className="pt-2">
                                                        <Link
                                                            href={`/student/quests/${item._id}`}
                                                            className="w-full py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-bold text-center rounded-xl flex items-center justify-center gap-1.5 uppercase font-['Orbitron'] tracking-wider text-[9px] transition-colors"
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
