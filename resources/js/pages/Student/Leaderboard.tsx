import { Link } from "@inertiajs/react";

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

    return (
        <div className="min-h-screen bg-gradient-to-br from-[#050816] via-[#070c20] to-[#0a0f2c] text-white p-6">

            {/* HEADER */}
            <div className="flex items-center gap-4 mb-10">
                <Link href="/student/dashboard" className="text-2xl hover:text-blue-400 transition">
                    ←
                </Link>

                <h1 className="text-3xl font-bold tracking-wide">
                    TIER LIST
                </h1>
            </div>

            <div className="grid lg:grid-cols-2 gap-10">

                {/* ================= LEFT (TOP PLAYER) ================= */}
                <div className="flex flex-col items-center justify-center text-center">

                    <p className="text-gray-400 mb-4 tracking-wide">
                        TOP PLAYER
                    </p>
                    <div className="flex gap-1 mt-2">
                        {Array.from({ length: topPlayer?.rank?.star ?? 1 }).map((_, i) => (
                            <span
                                key={i}
                                className="text-yellow-400 text-xl drop-shadow-[0_0_6px_rgba(255,215,0,0.9)]"
                            >
                                ⭐
                            </span>
                        ))}
                    </div>
                    {/* RANK VISUAL */}
                    <div className="relative flex items-center justify-center mb-6">

                        {/* GLOW */}
                        {/* <div
                            className="absolute w-80 h-80 rounded-full blur-3xl opacity-30 animate-pulse"
                            style={{ background: glow }}
                        /> */}

                        {/* RING */}
                        {/* <div
                            className="absolute w-72 h-72 rounded-full"
                            style={{
                                boxShadow: `0 0 60px ${glow}`,
                            }}
                        /> */}

                        {/* IMAGE */}
                        <img
                            src={topPlayer?.rank?.image ?? "/images/default-rank.png"}
                            className="w-64 h-64 object-contain relative z-10 transition-transform duration-500 hover:scale-105"
                            style={{
                                filter: `drop-shadow(0 0 30px ${glow})`,
                            }}
                        />

                    </div>

                    {/* SCORE */}
                    <p className="text-4xl font-bold text-yellow-400">
                        {topPlayer?.total_score ?? 0}
                    </p>

                    {/* NAME */}
                    <p className="text-gray-400 mt-2">
                        {topPlayer?.name ?? "Unknown"}
                    </p>

                </div>

                {/* ================= RIGHT (LIST) ================= */}
                <div>

                    {/* HEADER TABLE */}
                    <div className="grid grid-cols-3 text-sm text-gray-400 mb-4 px-2 border-b border-blue-800 pb-2">
                        <p>Title</p>
                        <p>User</p>
                        <p className="text-right">Score</p>
                    </div>

                    {/* LIST */}
                    <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2">

                        {leaderboard.map((player, index) => (
                            <div
                                key={player.name + index}
                                className="grid grid-cols-3 items-center border border-blue-800 p-3 rounded-lg bg-[#070c20] hover:border-blue-500 hover:shadow-[0_0_15px_rgba(59,130,246,0.4)] transition-all duration-300"
                            >

                                {/* TITLE ICON */}
                                <div className="flex items-center gap-2">
                                    <img
                                        src={`/images/tier-${index + 1}.png`}
                                        onError={(e) => {
                                            const target = e.currentTarget as HTMLImageElement;

                                            if (!target.dataset.fallback) {
                                                target.src = "/images/aizen.jpeg"; // fallback aman
                                                target.dataset.fallback = "true";
                                            }
                                        }}
                                        className="w-10 h-10 object-contain"
                                    />

                                    <span className="text-xs text-gray-400">
                                        #{index + 1}
                                    </span>
                                </div>

                                {/* USER */}
                                <div className="flex items-center gap-3">
                                    <img
                                        src={player.avatar || "/images/aizen.jpeg"}
                                        onError={(e) => {
                                            (e.currentTarget as HTMLImageElement).src = "/images/aizen.jpeg";
                                        }}
                                        className="w-10 h-10 rounded object-cover border border-blue-500"
                                    />
                                    <span className="text-sm font-semibold truncate">
                                        {player.name}
                                    </span>
                                </div>

                                {/* SCORE */}
                                <div className="text-right font-bold text-lg text-yellow-400">
                                    {player.total_score}
                                </div>

                            </div>
                        ))}

                    </div>

                </div>

            </div>
        </div>
    );
}