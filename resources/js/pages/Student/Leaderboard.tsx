import { Link } from '@inertiajs/react';
import React from 'react';
import { Star } from 'lucide-react';

type Player = {
    id?: number;
    name: string;
    avatar?: string | null;
    total_score: number;
    position?: number;
    rank: {
        name: string;
        image: string;
        star: number;
    };
};

export default function Leaderboard({
    leaderboard = [],
    currentUser = null,
}: {
    leaderboard: Player[];
    currentUser?: Player | null;
}) {
    const activeUser = currentUser || leaderboard[0];

    const getRankIcon = (index: number) => {
        if (index === 0) {
            return (
                <img
                    src="/images/peringkat1.webp"
                    alt="Rank 1"
                    className="h-[32px] w-[32px] shrink-0 object-contain drop-shadow-[0_0_10px_rgba(250,204,21,0.9)] transition-all duration-300 sm:h-[38px] sm:w-[38px] md:h-[44px] md:w-[44px] lg:h-[48px] lg:w-[48px] xl:h-[52px] xl:w-[52px]"
                />
            );
        }
        if (index === 1) {
            return (
                <img
                    src="/images/peringkat2.webp"
                    alt="Rank 2"
                    className="h-[28px] w-[28px] shrink-0 object-contain drop-shadow-[0_0_10px_rgba(203,213,225,0.8)] transition-all duration-300 sm:h-[34px] sm:w-[34px] md:h-[40px] md:w-[40px] lg:h-[44px] lg:w-[44px] xl:h-[48px] xl:w-[48px]"
                />
            );
        }
        if (index === 2) {
            return (
                <img
                    src="/images/peringkat3.webp"
                    alt="Rank 3"
                    className="h-[28px] w-[28px] shrink-0 object-contain drop-shadow-[0_0_10px_rgba(217,119,6,0.8)] transition-all duration-300 sm:h-[34px] sm:w-[34px] md:h-[40px] md:w-[40px] lg:h-[44px] lg:w-[44px] xl:h-[48px] xl:w-[48px]"
                />
            );
        }
        return (
            <span className="w-6 shrink-0 text-center font-['Orbitron'] text-xs font-extrabold text-blue-600 sm:text-sm md:text-base dark:text-blue-300">
                #{index + 1}
            </span>
        );
    };

    const getRankColor = (index: number) => {
        if (index === 0) return 'text-yellow-600 dark:text-yellow-400';
        if (index === 1) return 'text-slate-700 dark:text-blue-100';
        if (index === 2) return 'text-amber-700 dark:text-amber-300';
        return 'text-slate-800 dark:text-white';
    };

    const getRankStyle = (index: number) => {
        if (index === 0)
            return 'border-yellow-400/80 shadow-[0_0_15px_rgba(250,204,21,0.3)] bg-gradient-to-r from-yellow-500/15 via-amber-50 to-amber-100/40 dark:from-yellow-500/20 dark:via-blue-950/50 dark:to-blue-900/40';
        if (index === 1)
            return 'border-slate-300 dark:border-blue-400/70 shadow-[0_0_15px_rgba(59,130,246,0.25)] bg-gradient-to-r from-slate-100 via-blue-50/60 to-slate-200/50 dark:from-blue-500/20 dark:via-blue-950/50 dark:to-blue-900/40';
        if (index === 2)
            return 'border-amber-400/80 dark:border-amber-500/70 shadow-[0_0_15px_rgba(245,158,11,0.25)] bg-gradient-to-r from-amber-100/50 via-orange-50 to-amber-100/30 dark:from-amber-500/20 dark:via-blue-950/50 dark:to-blue-900/40';
        return 'border-blue-200 dark:border-blue-500/40 bg-white/70 dark:bg-blue-950/40 hover:border-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/50';
    };

    return (
        <div className="relative flex h-screen flex-col overflow-hidden bg-gradient-to-br from-[#f8fafc] via-[#eff6ff] to-[#e2e8f0] p-3 text-slate-800 transition-colors duration-500 sm:p-6 md:p-8 dark:from-[#050816] dark:via-[#0b1026] dark:to-[#050816] dark:text-white">
            {/* Ambient Background Glow */}
            <div className="pointer-events-none fixed top-0 left-0 z-0 h-full w-full overflow-hidden">
                <div className="absolute top-[-10%] left-[-10%] h-72 w-72 rounded-full bg-blue-500/20 blur-[100px] sm:h-96 sm:w-96 sm:blur-[120px] dark:bg-blue-600/20" />
                <div className="absolute right-[-10%] bottom-[-10%] h-72 w-72 rounded-full bg-yellow-400/20 blur-[100px] sm:h-96 sm:w-96 sm:blur-[120px] dark:bg-yellow-500/15" />
            </div>

            <div className="relative z-10 mx-auto flex min-h-0 w-full flex-1 flex-col">
                {/* HEADER */}
                <div className="-mt-3 mb-4 flex shrink-0 items-center gap-3 sm:-mt-7 sm:mb-6 sm:gap-6 md:mb-8">
                    <div className="group relative shrink-0 cursor-pointer">
                        <svg
                            className="h-[36px] w-[80px] overflow-visible sm:h-[49px] sm:w-[110px] md:h-[55px] md:w-[125px]"
                            viewBox="0 0 110 46"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <defs>
                                <linearGradient
                                    id="back_border_grad_lb"
                                    x1="0%"
                                    y1="0%"
                                    x2="100%"
                                    y2="0%"
                                >
                                    <stop offset="0%" stopColor="#3B28F6" />
                                    <stop offset="100%" stopColor="#FACC15" />
                                </linearGradient>
                            </defs>
                            <path
                                d="M 3,3 H 127 L 97,47 H 3 Z"
                                className="fill-blue-50/60 transition-colors dark:fill-[#080e28]/40"
                                stroke="url(#back_border_grad_lb)"
                                strokeWidth="2"
                                strokeLinejoin="miter"
                                style={{
                                    filter: 'drop-shadow(0 0 3px rgba(59, 130, 246, 0.35))',
                                }}
                            />
                        </svg>

                        <Link
                            href="/student/dashboard"
                            className="absolute inset-0 flex items-center justify-center text-[#1e3a8a] dark:text-blue-200"
                        >
                            <svg
                                className="h-8 w-8 sm:h-11 sm:w-11 md:h-12 md:w-12"
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

                    <h1 className="font-['Orbitron'] text-xl font-extrabold tracking-[0.05em] text-[#1e3a8a] uppercase transition-colors duration-500 sm:text-2xl sm:tracking-[0.1em] md:text-3xl lg:text-4xl dark:text-[#F0F0F0]">
                        LEADERBOARD
                    </h1>
                </div>

                {/* MAIN CONTENT AREA */}
                <div className="grid h-full min-h-0 flex-1 grid-cols-1 gap-4 overflow-hidden lg:grid-cols-12 lg:gap-8">
                    {/* LEFT: RANK VISUAL */}
                    {activeUser && (
                        <div className="flex shrink-0 flex-col items-center justify-center p-2 sm:p-4 lg:col-span-4">
                            <div className="flex w-full flex-col items-center justify-center gap-1.5 text-center">
                                {/* Dynamic Rank Stars (Above Rank Image) */}
                                <div className="relative z-20 mt-2 -mb-1 flex shrink-0 items-center gap-1.5 sm:mt-4">
                                    {Array.from({
                                        length: Math.min(
                                            Math.max(
                                                activeUser.rank?.star ?? 1,
                                                1,
                                            ),
                                            3,
                                        ),
                                    }).map((_, i) => (
                                        <Star
                                            key={i}
                                            className="h-5 w-5 fill-yellow-400 text-yellow-400 drop-shadow-[0_0_10px_rgba(250,204,21,0.8)] sm:h-6 sm:w-6 md:h-7 md:w-7"
                                        />
                                    ))}
                                </div>

                                {/* Rank Image with Sharp Glowing Neon Aura */}
                                <div className="relative flex shrink-0 items-center justify-center p-1">
                                    <img
                                        src={
                                            activeUser.rank?.image ??
                                            '/images/default-rank.png'
                                        }
                                        alt={activeUser.rank?.name ?? 'Rank'}
                                        className="relative z-10 h-20 w-20 object-contain sm:h-32 sm:w-32 md:h-44 md:w-44 lg:h-56 lg:w-56 xl:h-60 xl:w-60"
                                        style={{
                                            filter: 'drop-shadow(0 0 3px rgba(255, 255, 255, 0.9)) drop-shadow(0 0 6px rgba(56, 189, 248, 0.95)) drop-shadow(0 0 12px rgba(14, 165, 233, 0.8))',
                                        }}
                                    />
                                </div>

                                {/* Rank Name & Title */}
                                <div className="flex flex-col items-center">
                                    <p className="font-['Orbitron'] text-[10px] font-bold tracking-[0.2em] text-sky-600 uppercase sm:text-xs dark:text-sky-400">
                                        YOUR CURRENT RANK
                                    </p>
                                    <h2 className="mt-1 font-['Orbitron'] text-base font-extrabold text-slate-800 drop-shadow-[0_0_12px_rgba(56,189,248,0.6)] sm:text-lg md:text-xl lg:text-2xl xl:text-3xl dark:text-sky-300">
                                        {activeUser.rank?.name || 'Unranked'}
                                    </h2>
                                    {activeUser.position && (
                                        <span className="mt-1 inline-block rounded-full border border-sky-400/30 bg-sky-500/10 px-3 py-0.5 font-['Orbitron'] text-xs font-bold text-sky-600 shadow-[0_0_10px_rgba(56,189,248,0.2)] sm:text-sm dark:bg-sky-400/15 dark:text-sky-300">
                                            PERINGKAT #{activeUser.position}
                                        </span>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* RIGHT: LIST CONTAINER */}
                    <div
                        className={`flex h-full min-h-0 flex-col ${
                            activeUser ? 'lg:col-span-8' : 'lg:col-span-12'
                        }`}
                    >
                        <div className="relative flex min-h-0 w-full flex-1 flex-col overflow-hidden rounded-3xl border border-blue-200 bg-white/80 p-4 shadow-xl backdrop-blur-md sm:p-6 dark:border-blue-500/30 dark:bg-black/60 dark:shadow-2xl">
                            {/* Glass reflection accent */}
                            <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-blue-400/[0.05] to-transparent" />

                            {/* TABLE HEADER */}
                            <div className="grid shrink-0 grid-cols-12 items-center border-b border-blue-200 px-4 pb-3 font-['Orbitron'] text-xs font-bold tracking-widest text-blue-600 uppercase dark:border-blue-500/30 dark:text-blue-300">
                                <div className="col-span-2 text-center">
                                    RANK
                                </div>
                                <div className="col-span-7 pl-4 text-left sm:pl-10">
                                    PLAYER
                                </div>
                                <div className="col-span-3 text-right">
                                    SCORE
                                </div>
                            </div>

                            {/* SCROLLABLE PLAYER LIST */}
                            {leaderboard.length === 0 ? (
                                <div className="flex flex-1 flex-col items-center justify-center py-12 font-['Oxanium'] text-slate-500 dark:text-blue-200">
                                    <p>No players on the leaderboard yet.</p>
                                </div>
                            ) : (
                                <div className="custom-scrollbar mt-3 -mr-2 min-h-0 flex-1 space-y-3 overflow-y-auto pr-2">
                                    {leaderboard.map((player, index) => {
                                        const isCurrentUser = Boolean(
                                            currentUser &&
                                            (player.id === currentUser.id ||
                                                player.name ===
                                                    currentUser.name),
                                        );

                                        return (
                                            <div
                                                key={player.name + index}
                                                className={`group grid grid-cols-12 items-center rounded-2xl border p-2.5 transition-all duration-300 sm:p-3 ${
                                                    isCurrentUser
                                                        ? 'border-sky-400 bg-gradient-to-r from-sky-500/20 via-blue-500/15 to-cyan-500/20 shadow-[0_0_20px_rgba(56,189,248,0.4)] dark:border-sky-400 dark:from-sky-500/30 dark:via-blue-900/50 dark:to-cyan-900/40'
                                                        : getRankStyle(index)
                                                }`}
                                            >
                                                {/* RANKING IDENTIFIER */}
                                                <div className="col-span-2 flex items-center justify-center overflow-hidden">
                                                    {getRankIcon(index)}
                                                </div>

                                                {/* USER INFO */}
                                                <div className="col-span-7 flex items-center gap-3 overflow-hidden pl-4 sm:gap-4 sm:pl-10">
                                                    <div className="relative shrink-0">
                                                        <img
                                                            src={
                                                                player.avatar ||
                                                                '/images/default-avatar.svg'
                                                            }
                                                            onError={(e) => {
                                                                const img =
                                                                    e.currentTarget as HTMLImageElement;
                                                                if (
                                                                    !img.dataset
                                                                        .fallback
                                                                ) {
                                                                    img.dataset.fallback =
                                                                        'true';
                                                                    img.src =
                                                                        '/images/default-avatar.svg';
                                                                }
                                                            }}
                                                            className={`h-9 w-9 rounded-full border-2 object-cover transition-colors duration-300 sm:h-10 sm:w-10 md:h-11 md:w-11 ${
                                                                isCurrentUser
                                                                    ? 'border-sky-400 shadow-[0_0_12px_rgba(56,189,248,0.8)]'
                                                                    : index ===
                                                                        0
                                                                      ? 'border-yellow-400 shadow-[0_0_8px_rgba(250,204,21,0.6)]'
                                                                      : index ===
                                                                          1
                                                                        ? 'border-slate-300 dark:border-slate-200'
                                                                        : index ===
                                                                            2
                                                                          ? 'border-amber-400'
                                                                          : 'border-blue-300 group-hover:border-blue-500 dark:border-blue-400/80'
                                                            }`}
                                                            alt={player.name}
                                                        />
                                                    </div>

                                                    <div className="flex min-w-0 flex-col">
                                                        <span
                                                            className={`truncate font-['Oxanium'] text-xs font-bold transition-colors sm:text-sm md:text-base ${
                                                                isCurrentUser
                                                                    ? 'font-extrabold text-sky-600 dark:text-sky-300'
                                                                    : getRankColor(
                                                                          index,
                                                                      )
                                                            }`}
                                                        >
                                                            {player.name}
                                                        </span>
                                                        <div className="mt-0.5 flex min-w-0 items-center gap-2">
                                                            <span className="truncate font-['Oxanium'] text-[11px] font-medium text-blue-600 sm:text-xs dark:text-cyan-300">
                                                                {player.rank
                                                                    ?.name ||
                                                                    'Unranked'}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* SCORE */}
                                                <div className="col-span-3 text-right font-['Oxanium']">
                                                    <span
                                                        className={`text-sm font-black tracking-tight sm:text-base md:text-lg ${
                                                            isCurrentUser
                                                                ? 'text-sky-600 drop-shadow-[0_0_8px_rgba(56,189,248,0.6)] dark:text-sky-300'
                                                                : index === 0
                                                                  ? 'text-yellow-600 drop-shadow-[0_0_8px_rgba(250,204,21,0.6)] dark:text-yellow-400'
                                                                  : 'text-slate-800 group-hover:text-blue-600 dark:text-white dark:group-hover:text-blue-200'
                                                        }`}
                                                    >
                                                        {player.total_score.toLocaleString()}
                                                    </span>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Scoped CSS for custom scrollbar */}
            <style>{`
                .custom-scrollbar::-webkit-scrollbar {
                    width: 6px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: rgba(59, 130, 246, 0.05);
                    border-radius: 10px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: rgba(59, 130, 246, 0.4);
                    border-radius: 10px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                    background: rgba(59, 130, 246, 0.7);
                }
            `}</style>
        </div>
    );
}
