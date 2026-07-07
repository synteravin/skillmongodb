import { useForm, Link } from "@inertiajs/react";
import React from "react";
import { ArrowLeft, Save, Briefcase, DollarSign, Calendar, FileText } from "lucide-react";

export default function Create() {
    const { data, setData, post, processing, errors } = useForm({
        title: "",
        description: "",
        min_salary: "",
        max_salary: "",
        deadline: "",
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post("/student/quests");
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-[#f8fafc] via-[#eff6ff] to-[#e2e8f0] dark:from-[#050816] dark:via-[#0b1026] dark:to-[#050816] text-slate-800 dark:text-white flex flex-col p-3 sm:p-6 md:p-8 relative overflow-x-hidden transition-colors duration-500">
            {/* Ambient Glows */}
            <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
                <div className="absolute top-[-10%] left-[-10%] w-72 h-72 sm:w-96 sm:h-96 bg-blue-500/20 dark:bg-blue-600/15 rounded-full blur-[100px] sm:blur-[120px]" />
                <div className="absolute bottom-[-10%] right-[-10%] w-72 h-72 sm:w-96 sm:h-96 bg-purple-500/20 dark:bg-purple-600/15 rounded-full blur-[100px] sm:blur-[120px]" />
            </div>

            <div className="w-full max-w-2xl mx-auto relative z-10 flex-1 flex flex-col min-h-0">
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
                        POST QUEST
                    </h1>
                </div>

                {/* FORM CARD */}
                <div className="bg-white/70 dark:bg-blue-950/20 backdrop-blur-md rounded-2xl border border-blue-200 dark:border-blue-500/30 p-6 shadow-md transition-all duration-300">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Title */}
                        <div className="space-y-2">
                            <label className="flex items-center gap-2 text-xs sm:text-sm font-bold uppercase font-['Orbitron'] tracking-wider text-slate-700 dark:text-blue-200">
                                <Briefcase className="w-4 h-4 text-purple-500" />
                                Judul Pekerjaan
                            </label>
                            <input
                                type="text"
                                placeholder="Contoh: Membuat Landing Page Landing Page Next.js"
                                value={data.title}
                                onChange={(e) => setData("title", e.target.value)}
                                className="w-full px-4 py-2.5 bg-slate-100/50 dark:bg-[#0c122c]/50 border border-blue-200 dark:border-blue-500/20 rounded-xl focus:outline-none focus:border-purple-500 dark:focus:border-purple-400 font-['Oxanium'] transition-colors"
                            />
                            {errors.title && (
                                <p className="text-xs text-red-500 font-semibold mt-1 font-['Oxanium']">{errors.title}</p>
                            )}
                        </div>

                        {/* Description */}
                        <div className="space-y-2">
                            <label className="flex items-center gap-2 text-xs sm:text-sm font-bold uppercase font-['Orbitron'] tracking-wider text-slate-700 dark:text-blue-200">
                                <FileText className="w-4 h-4 text-purple-500" />
                                Detail Pekerjaan
                            </label>
                            <textarea
                                placeholder="Jelaskan kebutuhan pekerjaan secara detail, spesifikasi teknis, dan apa yang diharapkan dari pelamar..."
                                rows={6}
                                value={data.description}
                                onChange={(e) => setData("description", e.target.value)}
                                className="w-full px-4 py-2.5 bg-slate-100/50 dark:bg-[#0c122c]/50 border border-blue-200 dark:border-blue-500/20 rounded-xl focus:outline-none focus:border-purple-500 dark:focus:border-purple-400 font-['Oxanium'] transition-colors"
                            />
                            {errors.description && (
                                <p className="text-xs text-red-500 font-semibold mt-1 font-['Oxanium']">{errors.description}</p>
                            )}
                        </div>

                        {/* Salary Range */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="flex items-center gap-2 text-xs sm:text-sm font-bold uppercase font-['Orbitron'] tracking-wider text-slate-700 dark:text-blue-200">
                                    <DollarSign className="w-4 h-4 text-purple-500" />
                                    Gaji Minimal (Rupiah)
                                </label>
                                <input
                                    type="number"
                                    placeholder="Contoh: 1000000"
                                    value={data.min_salary}
                                    onChange={(e) => setData("min_salary", e.target.value)}
                                    className="w-full px-4 py-2.5 bg-slate-100/50 dark:bg-[#0c122c]/50 border border-blue-200 dark:border-blue-500/20 rounded-xl focus:outline-none focus:border-purple-500 dark:focus:border-purple-400 font-['Oxanium'] transition-colors"
                                />
                                {errors.min_salary && (
                                    <p className="text-xs text-red-500 font-semibold mt-1 font-['Oxanium']">{errors.min_salary}</p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <label className="flex items-center gap-2 text-xs sm:text-sm font-bold uppercase font-['Orbitron'] tracking-wider text-slate-700 dark:text-blue-200">
                                    <DollarSign className="w-4 h-4 text-purple-500" />
                                    Gaji Maksimal (Rupiah)
                                </label>
                                <input
                                    type="number"
                                    placeholder="Contoh: 3000000"
                                    value={data.max_salary}
                                    onChange={(e) => setData("max_salary", e.target.value)}
                                    className="w-full px-4 py-2.5 bg-slate-100/50 dark:bg-[#0c122c]/50 border border-blue-200 dark:border-blue-500/20 rounded-xl focus:outline-none focus:border-purple-500 dark:focus:border-purple-400 font-['Oxanium'] transition-colors"
                                />
                                {errors.max_salary && (
                                    <p className="text-xs text-red-500 font-semibold mt-1 font-['Oxanium']">{errors.max_salary}</p>
                                )}
                            </div>
                        </div>

                        {/* Deadline */}
                        <div className="space-y-2">
                            <label className="flex items-center gap-2 text-xs sm:text-sm font-bold uppercase font-['Orbitron'] tracking-wider text-slate-700 dark:text-blue-200">
                                <Calendar className="w-4 h-4 text-purple-500" />
                                Tenggat Waktu (Deadline)
                            </label>
                            <input
                                type="date"
                                value={data.deadline}
                                onChange={(e) => setData("deadline", e.target.value)}
                                className="w-full px-4 py-2.5 bg-slate-100/50 dark:bg-[#0c122c]/50 border border-blue-200 dark:border-blue-500/20 rounded-xl focus:outline-none focus:border-purple-500 dark:focus:border-purple-400 font-['Oxanium'] transition-colors"
                            />
                            {errors.deadline && (
                                <p className="text-xs text-red-500 font-semibold mt-1 font-['Oxanium']">{errors.deadline}</p>
                            )}
                        </div>

                        {/* Submit Buttons */}
                        <div className="flex justify-end gap-3 pt-4 border-t border-slate-100 dark:border-blue-500/10">
                            <Link
                                href="/student/quests"
                                className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl border border-blue-200 dark:border-blue-500/20 font-semibold font-['Oxanium'] uppercase tracking-wider text-xs sm:text-sm text-slate-600 dark:text-blue-200 bg-slate-100/50 dark:bg-[#0c122c]/40 hover:bg-slate-200/50 dark:hover:bg-blue-900/10 transition-all duration-300"
                            >
                                <ArrowLeft className="w-4 h-4" />
                                Batal
                            </Link>

                            <button
                                type="submit"
                                disabled={processing}
                                className="inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl text-white font-semibold font-['Oxanium'] uppercase tracking-wider text-xs sm:text-sm bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 shadow-[0_0_15px_rgba(99,102,241,0.4)] disabled:opacity-50 transition-all duration-300 transform hover:scale-[1.02]"
                            >
                                <Save className="w-4 h-4" />
                                {processing ? "Menyimpan..." : "Publikasikan"}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
