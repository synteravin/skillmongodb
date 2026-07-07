import { Link, router } from "@inertiajs/react";
import React, { useState } from "react";
import { Search, Calendar, DollarSign, Users, Plus, Briefcase } from "lucide-react";

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

interface Props {
    quests: Quest[];
    filters: {
        search?: string;
        status?: string;
    };
}

export default function Index({ quests, filters }: Props) {
    const [search, setSearch] = useState(filters.search || "");
    const [status, setStatus] = useState(filters.status || "");

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

                    <Link
                        href="/student/quests/create"
                        className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-white font-semibold font-['Oxanium'] uppercase tracking-wider text-xs sm:text-sm bg-gradient-to-r from-[#3B28F6] to-[#7c3aed] hover:from-[#4c2fff] hover:to-[#8b5cf6] shadow-[0_0_15px_rgba(124,58,237,0.4)] transition-all duration-300 transform hover:scale-[1.03]"
                    >
                        <Plus className="w-4 h-4 sm:w-5 sm:h-5" />
                        Tambah Quest
                    </Link>
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
        </div>
    );
}
