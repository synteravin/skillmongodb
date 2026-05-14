import { Link } from "@inertiajs/react";
import { Trophy, ArrowLeft, Star, Crown, Medal } from "lucide-react";

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
    leaderboard,
}: {
    leaderboard: Player[];
}) {

    const topPlayer = leaderboard[0];

    // 🔥 GLOW BASED ON SCORE
    const glow =
        topPlayer?.total_score >= 3000 ? "#ef4444" :
            topPlayer?.total_score >= 2500 ? "#eab308" :
                topPlayer?.total_score >= 2000 ? "#f97316" :
                    topPlayer?.total_score >= 1500 ? "#a855f7" :
                        topPlayer?.total_score >= 1000 ? "#3b82f6" :
                            "#22c55e";

    const getRankStyle = (index: number) => {
        if (index === 0) return "border-yellow-500/50 shadow-[0_0_15px_rgba(234,179,8,0.2)] bg-gradient-to-r from-yellow-500/10 to-transparent";
        if (index === 1) return "border-slate-300/50 shadow-[0_0_15px_rgba(203,213,225,0.2)] bg-gradient-to-r from-slate-300/10 to-transparent";
        if (index === 2) return "border-amber-700/50 shadow-[0_0_15px_rgba(180,83,9,0.2)] bg-gradient-to-r from-amber-700/10 to-transparent";
        return "border-blue-900/40 bg-[#070c20]/50 hover:border-blue-500/50 hover:bg-blue-900/20 hover:shadow-[0_0_15px_rgba(59,130,246,0.15)]";
    };

    const getRankIcon = (index: number) => {
        if (index === 0) return <Crown className="w-5 h-5 text-yellow-400 drop-shadow-[0_0_8px_rgba(250,204,21,0.8)]" />;
        if (index === 1) return <Medal className="w-5 h-5 text-slate-300 drop-shadow-[0_0_8px_rgba(203,213,225,0.8)]" />;
        if (index === 2) return <Medal className="w-5 h-5 text-amber-600 drop-shadow-[0_0_8px_rgba(217,119,6,0.8)]" />;
        return <span className="text-gray-500 font-bold w-5 text-center">#{index + 1}</span>;
    };

    const getRankColor = (index: number) => {
        if (index === 0) return "text-yellow-400";
        if (index === 1) return "text-slate-300";
        if (index === 2) return "text-amber-500";
        return "text-gray-400";
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-[#050816] via-[#0b1026] to-[#050816] text-white p-1 md:p-5 selection:bg-blue-500/30">

            {/* Background Ambient Glows */}
            <div className="fixed top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
                <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-blue-600/20 rounded-full blur-[120px]"></div>
                <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-purple-600/20 rounded-full blur-[120px]"></div>
            </div>

            <div className="max-w-6xl mx-auto relative z-10">
                {/* HEADER */}
                <div className="flex items-center gap-4 mb-5">
                    <Link
                        href="/student/dashboard"
                        className="p-3 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 text-gray-300 hover:text-white transition-all backdrop-blur-sm group"
                    >
                        <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                    </Link>

                    <div className="flex items-center gap-3">
                        <div className="p-3 rounded-xl bg-gradient-to-br from-yellow-500/20 to-orange-500/20 border border-yellow-500/30 backdrop-blur-md shadow-[0_0_15px_rgba(234,179,8,0.3)]">
                            <Trophy className="w-6 h-6 text-yellow-400" />
                        </div>
                        <div>
                            <h1 className="text-3xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">
                                Global Leaderboard
                            </h1>
                            <p className="text-sm text-blue-400/80 font-medium tracking-wide">TOP TIER PLAYERS</p>
                        </div>
                    </div>
                </div>

                <div className="grid lg:grid-cols-5 gap-8 lg:gap-12">

                    {/* ================= LEFT (TOP PLAYER) ================= */}
                    {topPlayer && (
                        <div className="lg:col-span-2 flex flex-col items-center justify-center relative p-8 rounded-3xl bg-gradient-to-b from-white/[0.03] to-transparent border border-white/[0.05] backdrop-blur-sm">

                            {/* Decorative Top Accent */}
                            <div className="absolute top-0 w-32 h-1 bg-gradient-to-r from-transparent via-yellow-500 to-transparent opacity-50"></div>

                            <div className="text-center mb-8">
                                <p className="text-xs font-bold text-yellow-500 tracking-[0.2em] mb-1">
                                    CURRENT CHAMPION
                                </p>
                                <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-yellow-200 to-yellow-600">
                                    {topPlayer.rank?.name || "Grandmaster"}
                                </h2>

                                <div className="flex items-center justify-center gap-1.5 mt-3">
                                    {Array.from({ length: topPlayer.rank?.star ?? 1 }).map((_, i) => (
                                        <Star
                                            key={i}
                                            className="w-5 h-5 fill-yellow-400 text-yellow-400 drop-shadow-[0_0_8px_rgba(250,204,21,0.6)]"
                                        />
                                    ))}
                                </div>
                            </div>

                            {/* RANK VISUAL */}
                            <div className="relative flex items-center justify-center mb-10 w-full aspect-square max-w-[300px]">
                                {/* Pulsing Ambient Glow */}
                                <div
                                    className="absolute inset-0 rounded-full blur-[80px] opacity-40 animate-pulse"
                                    style={{ background: glow }}
                                />

                                {/* Rotating Ring Effect */}
                                <div
                                    className="absolute inset-4 rounded-full border border-white/10 border-t-white/40 animate-[spin_10s_linear_infinite]"
                                />
                                <div
                                    className="absolute inset-8 rounded-full border border-white/5 border-b-white/20 animate-[spin_15s_linear_infinite_reverse]"
                                />

                                {/* IMAGE */}
                                <img
                                    src={topPlayer.rank?.image ?? "/images/default-rank.png"}
                                    alt={topPlayer.rank?.name}
                                    className="w-48 h-48 sm:w-64 sm:h-64 object-contain relative z-10 hover:scale-110 transition-transform duration-700 ease-out"
                                    style={{
                                        filter: `drop-shadow(0 0 25px ${glow})`,
                                    }}
                                />
                            </div>

                            {/* PLAYER INFO */}
                            <div className="text-center w-full relative z-10">
                                <div className="inline-flex items-center justify-center gap-3 px-6 py-2 rounded-2xl bg-black/40 border border-white/10 backdrop-blur-md mb-4 shadow-[0_4px_20px_rgba(0,0,0,0.5)]">
                                    <span className="text-sm text-gray-400 font-medium">SCORE</span>
                                    <span className="text-3xl font-black text-yellow-400 drop-shadow-[0_2px_10px_rgba(250,204,21,0.3)] tracking-tight">
                                        {topPlayer.total_score.toLocaleString()}
                                    </span>
                                </div>

                                <div className="flex items-center justify-center gap-4 mt-2">
                                    <img
                                        src={topPlayer.avatar || "/images/aizen.jpeg"}
                                        onError={(e) => {
                                            (e.currentTarget as HTMLImageElement).src = "/images/aizen.jpeg";
                                        }}
                                        className="w-14 h-14 rounded-full object-cover border-2 border-white/20 shadow-lg"
                                        alt={topPlayer.name}
                                    />
                                    <p className="text-xl font-bold text-white tracking-wide">
                                        {topPlayer.name || "Unknown Warrior"}
                                    </p>
                                </div>
                            </div>

                            {/* Decorative Bottom Accent */}
                            <div className="absolute bottom-0 w-32 h-1 bg-gradient-to-r from-transparent via-blue-500 to-transparent opacity-30"></div>
                        </div>
                    )}

                    {/* ================= RIGHT (LIST) ================= */}
                    <div className="lg:col-span-3 flex flex-col h-full">

                        {/* LIST CONTAINER */}
                        <div className="bg-black/20 backdrop-blur-md border border-white/10 rounded-3xl p-6 flex-1 shadow-2xl relative overflow-hidden flex flex-col">

                            {/* Glass reflection */}
                            <div className="absolute inset-0 bg-gradient-to-br from-white/[0.02] to-transparent pointer-events-none"></div>

                            {/* HEADER TABLE */}
                            <div className="grid grid-cols-12 text-xs font-bold text-gray-400 uppercase tracking-widest mb-4 px-4 pb-3 border-b border-white/10">
                                <p className="col-span-2 text-center">Rank</p>
                                <p className="col-span-7">Player</p>
                                <p className="col-span-3 text-right">Score</p>
                            </div>

                            {/* LIST SCROLLABLE AREA */}
                            <div className="flex-1 overflow-y-auto pr-2 -mr-2 space-y-3 custom-scrollbar min-h-[400px] max-h-[600px]">
                                {leaderboard.map((player, index) => (
                                    <div
                                        key={player.name + index}
                                        className={`group grid grid-cols-12 items-center p-3 rounded-2xl border transition-all duration-300 ${getRankStyle(index)}`}
                                    >
                                        {/* RANKING IDENTIFIER */}
                                        <div className="col-span-2 flex justify-center items-center">
                                            {getRankIcon(index)}
                                        </div>

                                        {/* USER INFO */}
                                        <div className="col-span-7 flex items-center gap-4">
                                            <div className="relative">
                                                <img
                                                    src={player.avatar || "/images/aizen.jpeg"}
                                                    onError={(e) => {
                                                        (e.currentTarget as HTMLImageElement).src = "/images/aizen.jpeg";
                                                    }}
                                                    className={`w-11 h-11 rounded-full object-cover border-2 transition-colors duration-300 ${index === 0 ? "border-yellow-400" :
                                                        index === 1 ? "border-slate-300" :
                                                            index === 2 ? "border-amber-600" :
                                                                "border-blue-900/50 group-hover:border-blue-500"
                                                        }`}
                                                    alt={player.name}
                                                />
                                                {/* Little rank indicator on avatar for top 3 */}
                                                {index < 3 && (
                                                    <div className="absolute -bottom-1 -right-1 bg-black rounded-full p-0.5">
                                                        <img
                                                            src={`/images/tier-${index + 1}.png`}
                                                            onError={(e) => {
                                                                if (!(e.currentTarget as HTMLImageElement).dataset.fallback) {
                                                                    (e.currentTarget as HTMLImageElement).src = "/images/aizen.jpeg";
                                                                    (e.currentTarget as HTMLImageElement).dataset.fallback = "true";
                                                                }
                                                            }}
                                                            className="w-4 h-4 rounded-full"
                                                        />
                                                    </div>
                                                )}
                                            </div>

                                            <div className="flex flex-col">
                                                <span className={`text-base font-bold truncate transition-colors ${getRankColor(index)}`}>
                                                    {player.name}
                                                </span>
                                                <span className="text-xs text-gray-500 font-medium">
                                                    {player.rank?.name || "Unranked"}
                                                </span>
                                            </div>
                                        </div>

                                        {/* SCORE */}
                                        <div className="col-span-3 text-right">
                                            <span className={`text-lg font-black tracking-tight ${index === 0 ? "text-yellow-400 drop-shadow-[0_0_8px_rgba(250,204,21,0.5)]" :
                                                "text-white group-hover:text-blue-200"
                                                }`}>
                                                {player.total_score.toLocaleString()}
                                            </span>
                                        </div>

                                    </div>
                                ))}

                                {leaderboard.length === 0 && (
                                    <div className="h-full flex flex-col items-center justify-center text-gray-500 py-12">
                                        <Trophy className="w-16 h-16 mb-4 opacity-20" />
                                        <p>No players on the leaderboard yet.</p>
                                    </div>
                                )}
                            </div>

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
                    background: rgba(255, 255, 255, 0.02);
                    border-radius: 10px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: rgba(59, 130, 246, 0.3);
                    border-radius: 10px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                    background: rgba(59, 130, 246, 0.6);
                }
            `}</style>
        </div>
    );
}