import AppLayout from "@/layouts/app-layout";
import { Link } from "@inertiajs/react";

export default function AssetsPage({ stats }: any) {
    return (
        <AppLayout>
            <div className="relative min-h-screen bg-[#030712] text-white px-6 py-4 sm:px-6 lg:px-10 overflow-hidden">
                {/* Subtle top-center ambient glow */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[450px] pointer-events-none select-none z-0" />

                <div className="relative z-10 mx-auto max-w-7xl space-y-4 sm:space-y-5">
                    {/* HEADER */}
                    <header
                        className="relative overflow-hidden rounded-xl px-6 py-5 bg-[#0d0f17] dark:bg-[#0d0f17] bg-[#f5f6ff]"
                        style={{
                            backgroundImage: `
                            linear-gradient(rgba(59,40,246,0.07) 1px, transparent 1px),
                            linear-gradient(90deg, rgba(59,40,246,0.07) 1px, transparent 1px)
                            `,
                            backgroundSize: '40px 40px',
                        }}
                    >
                        {/* Corner brackets */}
                        <span className="absolute left-3.5 top-3.5 h-3 w-3 border-l border-t dark:border-[rgba(59,40,246,0.45)] border-[rgba(59,40,246,0.2)]" />
                        <span className="absolute right-3.5 top-3.5 h-3 w-3 border-r border-t dark:border-[rgba(59,40,246,0.45)] border-[rgba(59,40,246,0.2)]" />
                        <span className="absolute bottom-3.5 left-3.5 h-3 w-3 border-b border-l dark:border-[rgba(59,40,246,0.45)] border-[rgba(59,40,246,0.2)]" />
                        <span className="absolute bottom-3.5 right-3.5 h-3 w-3 border-b border-r dark:border-[rgba(59,40,246,0.45)] border-[rgba(59,40,246,0.2)]" />

                        <div className="relative z-10 flex flex-col gap-3">
                            {/* Badge */}
                            <div className="inline-flex w-fit items-center gap-1.5 rounded border px-2.5 py-1
                            dark:border-[rgba(59,40,246,0.35)] dark:bg-[rgba(59,40,246,0.1)]
                            border-[rgba(59,40,246,0.2)] bg-[rgba(59,40,246,0.06)]"
                            >
                                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[#3B28F6]" />
                                <span className="text-[11px] font-medium uppercase tracking-[0.12em] text-[#3B28F6]">
                                    Assets
                                </span>
                            </div>

                            {/* Title */}
                            <h1
                                className="m-0 text-3xl font-bold leading-none tracking-tight"
                                style={{
                                    background: 'linear-gradient(135deg, #2a1ce0 0%, #3B28F6 100%)',
                                    WebkitBackgroundClip: 'text',
                                    WebkitTextFillColor: 'transparent',
                                    backgroundClip: 'text',
                                    fontFamily:'Orbitron, sans-serif',
                                }}
                            >
                                Assets Management
                            </h1>

                            {/* Subtitle */}
                            <div className="flex items-center gap-2.5">
                                <p className="m-0 text-[13.5px] dark:text-slate-400/70 text-slate-600/75">
                                    Manage all game assets including ranks, characters, and badges.
                                    <span className="mx-2 inline-block h-[11px] w-px dark:bg-white/10 bg-black/10 align-middle" />
                                    <span className="text-xs dark:text-slate-400/30 text-slate-500/35 tracking-wide">
                                        Game asset control
                                    </span>
                                </p>
                            </div>
                        </div>
                    </header>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

                        {/* RANK */}
                        <Link
                            href="/admin/assets/ranks"
                            className="group relative overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-gradient-to-b dark:from-[#0e0e1a] dark:to-[#090910] dark:shadow-none transition-all duration-250 hover:-translate-y-0.5 hover:shadow-md dark:hover:shadow-[#6C63FF]/5"
                            style={{ fontFamily: "'Outfit', sans-serif" }}
                        >
                            {/* Top accent line */}
                            <div className="absolute top-0 right-8 left-8 h-px bg-gradient-to-r from-transparent via-slate-300 to-transparent dark:via-slate-700" />

                            <div className="p-4 sm:p-5">
                                <div className="flex justify-between items-center mb-3">
                                    <h2 className="font-semibold text-lg text-slate-800 group-hover:text-[#6C63FF] dark:text-white transition-colors">
                                        Level Rank
                                    </h2>
                                    <span className="text-xs text-[#6C63FF] font-semibold bg-[#6C63FF]/10 px-2.5 py-1 rounded-lg border border-[#6C63FF]/20">
                                        {stats?.ranks ?? 0}
                                    </span>
                                </div>
                                <p className="text-sm text-slate-400 leading-relaxed">
                                    Manage progression tiers and ranking system
                                </p>
                            </div>
                        </Link>

                        {/* CHARACTER */}
                        <Link
                            href="/admin/assets/characters"
                            className="group relative overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-gradient-to-b dark:from-[#0e0e1a] dark:to-[#090910] dark:shadow-none transition-all duration-250 hover:-translate-y-0.5 hover:shadow-md dark:hover:shadow-[#6C63FF]/5"
                            style={{ fontFamily: "'Outfit', sans-serif" }}
                        >
                            {/* Top accent line */}
                            <div className="absolute top-0 right-8 left-8 h-px bg-gradient-to-r from-transparent via-slate-300 to-transparent dark:via-slate-700" />

                            <div className="p-4 sm:p-5">
                                <div className="flex justify-between items-center mb-3">
                                    <h2 className="font-semibold text-lg text-slate-800 group-hover:text-[#6C63FF] dark:text-white transition-colors">
                                        Character
                                    </h2>
                                    <span className="text-xs text-[#6C63FF] font-semibold bg-[#6C63FF]/10 px-2.5 py-1 rounded-lg border border-[#6C63FF]/20">
                                        {stats?.characters ?? 0}
                                    </span>
                                </div>
                                <p className="text-sm text-slate-400 leading-relaxed">
                                    Manage avatars and playable identities
                                </p>
                            </div>
                        </Link>

                        {/* BADGE */}
                        <Link
                            href="/admin/assets/badges"
                            className="group relative overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-gradient-to-b dark:from-[#0e0e1a] dark:to-[#090910] dark:shadow-none transition-all duration-250 hover:-translate-y-0.5 hover:shadow-md dark:hover:shadow-[#6C63FF]/5"
                            style={{ fontFamily: "'Outfit', sans-serif" }}
                        >
                            {/* Top accent line */}
                            <div className="absolute top-0 right-8 left-8 h-px bg-gradient-to-r from-transparent via-slate-300 to-transparent dark:via-slate-700" />

                            <div className="p-4 sm:p-5">
                                <div className="flex justify-between items-center mb-3">
                                    <h2 className="font-semibold text-lg text-slate-800 group-hover:text-[#6C63FF] dark:text-white transition-colors">
                                        Level Badge
                                    </h2>
                                    <span className="text-xs text-[#6C63FF] font-semibold bg-[#6C63FF]/10 px-2.5 py-1 rounded-lg border border-[#6C63FF]/20">
                                        {stats?.badges ?? 0}
                                    </span>
                                </div>
                                <p className="text-sm text-slate-400 leading-relaxed">
                                    Manage achievements and milestones
                                </p>
                            </div>
                        </Link>

                    </div>
                </div>
            </div>
        </AppLayout>
    );
}