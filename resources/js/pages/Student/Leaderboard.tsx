import { Link } from "@inertiajs/react";
import React from "react";
import { Star } from "lucide-react";

type Player = {
    name: string;
    avatar?: string | null;
    total_score: number;
    rank: {
        name: string;
        image: string;
        star: number;
    };
};

export default function Leaderboard({
    leaderboard = [],
}: {
    leaderboard: Player[];
}) {
    const topPlayer = leaderboard[0];

    const getRankIcon = (index: number) => {
        if (index === 0) {
            return (
                <img
                    src="/images/peringkat1.webp"
                    alt="Rank 1"
                    className="h-8 w-8 sm:h-9 sm:w-9 md:h-10 md:w-10 shrink-0 object-contain drop-shadow-[0_0_10px_rgba(250,204,21,0.9)] transition-all"
                />
            );
        }
        if (index === 1) {
            return (
                <img
                    src="/images/peringkat2.webp"
                    alt="Rank 2"
                    className="h-7 w-7 sm:h-8 sm:w-8 md:h-9 md:w-9 shrink-0 object-contain drop-shadow-[0_0_10px_rgba(203,213,225,0.8)] transition-all"
                />
            );
        }
        if (index === 2) {
            return (
                <img
                    src="/images/peringkat3.webp"
                    alt="Rank 3"
                    className="h-7 w-7 sm:h-8 sm:w-8 md:h-9 md:w-9 shrink-0 object-contain drop-shadow-[0_0_10px_rgba(217,119,6,0.8)] transition-all"
                />
            );
        }
        return (
            <span className="w-6 shrink-0 text-center font-['Orbitron'] text-xs font-extrabold text-blue-300 sm:text-sm dark:text-blue-200">
                #{index + 1}
            </span>
        );
    };

    const getRankColor = (index: number) => {
        if (index === 0) return "text-yellow-400";
        if (index === 1) return "text-blue-100";
        if (index === 2) return "text-amber-300";
        return "text-white";
    };

    const getRankStyle = (index: number) => {
        if (index === 0) return "border-yellow-400/80 shadow-[0_0_15px_rgba(250,204,21,0.3)] bg-gradient-to-r from-yellow-500/20 via-blue-950/50 to-blue-900/40";
        if (index === 1) return "border-blue-400/70 shadow-[0_0_15px_rgba(59,130,246,0.25)] bg-gradient-to-r from-blue-500/20 via-blue-950/50 to-blue-900/40";
        if (index === 2) return "border-amber-500/70 shadow-[0_0_15px_rgba(245,158,11,0.25)] bg-gradient-to-r from-amber-500/20 via-blue-950/50 to-blue-900/40";
        return "border-blue-500/40 bg-blue-950/40 hover:border-blue-400 hover:bg-blue-900/50";
    };

    return (
        <div className="h-screen bg-gradient-to-br from-[#f8fafc] via-[#f1f5f9] to-[#e2e8f0] dark:from-[#050816] dark:via-[#0b1026] dark:to-[#050816] text-slate-800 dark:text-white flex flex-col p-3 sm:p-6 md:p-8 relative overflow-hidden transition-colors duration-500">
            
            {/* Ambient Background Glow */}
            <div className="fixed top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
                <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-blue-600/20 rounded-full blur-[120px]"></div>
                <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-yellow-500/15 rounded-full blur-[120px]"></div>
            </div>

            <div className="w-full mx-auto relative z-10 flex-1 flex flex-col min-h-0">

                {/* HEADER - Concept identical to Certificate page */}
                <div className="flex items-center gap-3 sm:gap-6 -mt-3 sm:-mt-7 mb-4 sm:mb-6 md:mb-8 shrink-0">
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
                                className="fill-slate-100/20 dark:fill-[#080e28]/40 transition-colors"
                                stroke="url(#back_border_grad_lb)"
                                strokeWidth="2"
                                strokeLinejoin="miter"
                                style={{ filter: 'drop-shadow(0 0 3px rgba(59, 130, 246, 0.35))' }}
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
                        LEADERBOARD
                    </h1>
                </div>

                {/* MAIN CONTENT AREA - FULL LAYER GRID */}
                <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-8 min-h-0 h-full overflow-hidden">
                    
                    {/* LEFT: RANK VISUAL (No Card Box, Intense Yellow Light Glow, No Score, No User) */}
                    {topPlayer && (
                        <div className="lg:col-span-4 flex flex-col items-center justify-center p-2 sm:p-4 shrink-0">
                            <div className="flex flex-row lg:flex-col items-center justify-center gap-4 lg:gap-3 text-left lg:text-center w-full">
                                
                                {/* Rank Image with Rich Multi-Layered Yellow Glow */}
                                <div className="relative flex items-center justify-center p-4 shrink-0">
                                    <div className="absolute inset-0 rounded-full bg-yellow-400/30 blur-2xl pointer-events-none" />
                                    <div className="absolute inset-2 rounded-full bg-yellow-500/20 blur-xl pointer-events-none" />
                                    
                                    <img
                                        src={topPlayer.rank?.image ?? "/images/default-rank.png"}
                                        alt={topPlayer.rank?.name ?? "Rank"}
                                        className="w-20 h-20 sm:w-32 sm:h-32 md:w-44 md:h-44 lg:w-60 lg:h-60 object-contain relative z-10"
                                        style={{
                                            filter: "drop-shadow(0 0 20px rgba(250, 204, 21, 0.9)) drop-shadow(0 0 35px rgba(234, 179, 8, 0.7)) drop-shadow(0 0 8px rgba(255, 255, 255, 0.95))",
                                        }}
                                    />
                                </div>

                                {/* Rank Name & Title in Orbitron Font */}
                                <div className="flex flex-col items-start lg:items-center">
                                    <p className="text-[10px] sm:text-xs font-bold text-yellow-500 dark:text-yellow-400 tracking-[0.2em] uppercase font-['Orbitron']">
                                        CURRENT CHAMPION RANK
                                    </p>
                                    <h2 className="text-base sm:text-lg md:text-xl lg:text-3xl font-extrabold font-['Orbitron'] text-slate-800 dark:text-yellow-300 mt-1 drop-shadow-[0_0_12px_rgba(250,204,21,0.5)]">
                                        {topPlayer.rank?.name || "Grandmaster"}
                                    </h2>
                                    {/* Dynamic Rank Stars */}
                                    <div className="flex items-center gap-1 mt-1.5">
                                        {Array.from({ length: Math.min(Math.max(topPlayer.rank?.star ?? 1, 1), 3) }).map((_, i) => (
                                            <Star
                                                key={i}
                                                className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-yellow-400 fill-yellow-400 "
                                            />
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* RIGHT: LIST CONTAINER (FULL LAYER, All Blue Borders, No Gray Colors) */}
                    <div className={`flex flex-col min-h-0 h-full ${topPlayer ? 'lg:col-span-8' : 'lg:col-span-12'}`}>
                        <div className="bg-blue-950/80 dark:bg-black/60 backdrop-blur-md border border-blue-500/30 rounded-3xl p-4 sm:p-6 flex-1 shadow-2xl relative overflow-hidden flex flex-col min-h-0 w-full">
                            
                            {/* Glass reflection accent */}
                            <div className="absolute inset-0 bg-gradient-to-br from-blue-400/[0.05] to-transparent pointer-events-none" />

                            {/* TABLE HEADER */}
                            <div className="grid grid-cols-12 items-center px-4 pb-3 text-xs font-bold text-blue-300 uppercase tracking-widest font-['Orbitron'] border-b border-blue-500/30 shrink-0">
                                <div className="col-span-2 text-center">RANK</div>
                                <div className="col-span-7 text-left pl-4 sm:pl-10">PLAYER</div>
                                <div className="col-span-3 text-right">SCORE</div>
                            </div>

                            {/* SCROLLABLE PLAYER LIST */}
                            {leaderboard.length === 0 ? (
                                <div className="flex-1 flex flex-col items-center justify-center text-blue-200 py-12 font-['Oxanium']">
                                    <p>No players on the leaderboard yet.</p>
                                </div>
                            ) : (
                                <div className="flex-1 overflow-y-auto pr-2 -mr-2 mt-3 space-y-3 custom-scrollbar min-h-0">
                                    {leaderboard.map((player, index) => (
                                        <div
                                            key={player.name + index}
                                            className={`group grid grid-cols-12 items-center p-3 rounded-2xl border transition-all duration-300 ${getRankStyle(index)}`}
                                        >
                                            {/* RANKING IDENTIFIER (Images for 1-3, Auto numbers for 4+) */}
                                            <div className="col-span-2 flex justify-center items-center">
                                                {getRankIcon(index)}
                                            </div>

                                            {/* USER INFO (Positioned towards center with pl-4 sm:pl-10, Robust Avatar handling) */}
                                            <div className="col-span-7 flex items-center gap-3 sm:gap-4 overflow-hidden pl-4 sm:pl-10">
                                                <div className="relative shrink-0">
                                                    <img
                                                        src={player.avatar || "/images/aizen.webp"}
                                                        onError={(e) => {
                                                            const img = e.currentTarget as HTMLImageElement;
                                                            if (!img.dataset.fallback) {
                                                                img.dataset.fallback = "true";
                                                                img.src = "/images/aizen.webp";
                                                            }
                                                        }}
                                                        className={`w-10 h-10 sm:w-11 sm:h-11 rounded-full object-cover border-2 transition-colors duration-300 ${
                                                            index === 0 ? "border-yellow-400 shadow-[0_0_8px_rgba(250,204,21,0.6)]" :
                                                            index === 1 ? "border-slate-200" :
                                                            index === 2 ? "border-amber-400" :
                                                            "border-blue-400/80 group-hover:border-blue-300"
                                                        }`}
                                                        alt={player.name}
                                                    />
                                                </div>

                                                <div className="flex flex-col min-w-0">
                                                    <span className={`text-sm sm:text-base font-bold truncate font-['Oxanium'] transition-colors ${getRankColor(index)}`}>
                                                        {player.name}
                                                    </span>
                                                    <div className="flex items-center gap-2 min-w-0 mt-0.5">
                                                        <span className="text-xs text-blue-300 dark:text-cyan-300 font-medium font-['Oxanium'] truncate">
                                                            {player.rank?.name || "Unranked"}
                                                        </span>
                                                        
                                                    </div>
                                                </div>
                                            </div>

                                            {/* SCORE */}
                                            <div className="col-span-3 text-right font-['Oxanium']">
                                                <span className={`text-base sm:text-lg font-black tracking-tight ${
                                                    index === 0 ? "text-yellow-400 drop-shadow-[0_0_8px_rgba(250,204,21,0.6)]" :
                                                    "text-white group-hover:text-blue-200"
                                                }`}>
                                                    {player.total_score.toLocaleString()}
                                                </span>
                                            </div>
                                        </div>
                                    ))}
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

