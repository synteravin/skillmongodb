import { Link } from "@inertiajs/react";

type Player = {
    name: string;
    avatar?: string | null;
    total_score: number;
};

export default function Leaderboard({
    leaderboard,
}: {
    leaderboard: Player[];
}) {
    return (
        <div className="min-h-screen bg-[#050816] text-white p-6">

            {/* HEADER */}
            <h1 className="text-2xl font-bold text-blue-400 mb-6">
                🏆 QUIZ LEADERBOARD
            </h1>

            {/* LIST */}
            <div className="space-y-3">

                {leaderboard.map((player, index) => (
                    <div
                        key={index}
                        className="flex justify-between items-center border border-blue-800 p-4 bg-[#070c20]"
                    >
                        {/* LEFT SIDE */}
                        <div className="flex items-center gap-4">

                            {/* RANK */}
                            <span className="text-yellow-400 font-bold w-6">
                                #{index + 1}
                            </span>

                            {/* AVATAR (NON CLICKABLE) */}
                            <div className="relative h-[60px] w-[60px] flex-shrink-0">
                                <div className="absolute inset-[8px] overflow-hidden rounded-md">
                                    <img
                                        src={player.avatar ?? "/images/aizen.jpeg"}
                                        className="h-full w-full object-cover"
                                    />
                                </div>

                                <img
                                    src="/images/border.png"
                                    className="absolute inset-0 h-full w-full object-contain pointer-events-none"
                                />
                            </div>

                            {/* NAME */}
                            <span className="font-semibold">
                                {player.name}
                            </span>

                        </div>

                        {/* SCORE */}
                        <span className="text-green-400 font-bold">
                            {player.total_score}
                        </span>
                    </div>
                ))}

            </div>

            {/* BACK */}
            <Link
                href="/student/dashboard"
                className="inline-block mt-6 text-blue-400 hover:underline"
            >
                ← Back to Dashboard
            </Link>

        </div>
    );
}