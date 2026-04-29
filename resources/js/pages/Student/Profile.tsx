import { Link, router } from "@inertiajs/react";
import { ArrowLeft } from "lucide-react";

type Props = {
    user: {
        name: string;
        level: number;
        avatar: string;

        exp_min: number;
        exp: number;
        exp_max: number;

        gold: number;
        courses: number;
        avg_score: number;

        total_score: number; // 🔥 untuk star progress

        rank?: {
            name: string;
            image: string;
            star: number;
        };

        last_course?: {
            course_name: string;
            path_name: string;
            module_name: string;
            url: string;
        };
    };
};

export default function ProfilePage({ user }: Props) {
    const progress =
        ((user.exp - user.exp_min) / (user.exp_max - user.exp_min)) * 100;
    const glowMap: Record<string, string> = {
        Hatching: "rgba(59,130,246,0.7)",
        Wyvern: "rgba(34,197,94,0.7)",
        Drake: "rgba(168,85,247,0.7)",
        Hydra: "rgba(239,68,68,0.7)",
        Monarch: "rgba(250,204,21,0.7)",
        Infernal: "rgba(249,115,22,0.7)",
        Zenith: "rgba(34,211,238,0.7)",
    };

    const glow = glowMap[user.rank?.name ?? ""] || "rgba(59,130,246,0.7)";

    // ⚠️ pastikan ini dari backend
    const starProgress = ((user.total_score % 500) / 500) * 100;
    return (
        <div className="min-h-screen bg-[#050816] text-white p-6">

            {/* TOP NAV */}
            <div className="flex justify-between items-center mb-6">
                <Link
                    href="/student/dashboard"
                    className="absolute left-4 w-8 h-8 flex items-center justify-center border border-[#1e2759] rounded hover:border-blue-500 transition-colors text-blue-500"
                >
                    <ArrowLeft size={16} />
                </Link>
            </div>

            <div className="grid grid-cols-12 gap-6">

                {/* LEFT PROFILE */}
                <div className="col-span-12 lg:col-span-4 border border-blue-700 p-6 bg-[#070c20]">

                    <div className="flex flex-col items-center text-center">

                        {/* AVATAR */}
                        <div className="relative w-[120px] h-[120px] mb-4">

                            {/* AVATAR */}
                            <div className="absolute inset-[10px] overflow-hidden rounded-md">
                                <img
                                    src={user.avatar ?? "/images/aizen.jpeg"}
                                    className="w-full h-full object-cover"
                                />
                            </div>

                            {/* BORDER */}
                            <img
                                src="/images/border.png"
                                className="absolute inset-0 w-full h-full object-contain pointer-events-none"
                            />

                        </div>
                        {/* username */}
                        <h2 className="text-lg font-bold">{user.name}</h2>
                        <p className="text-blue-400 text-sm mb-4">
                            Level {user.level}
                        </p>
                        <div className="w-full border-t border-blue-800 pt-4 flex justify-between text-sm">
                            <div>
                                <p className="text-yellow-400 font-bold">
                                    {user.courses}
                                </p>
                                <p className="text-gray-400 text-xs">COURSES</p>
                            </div>
                            <div>
                                <p
                                    className={`font-bold ${user.avg_score >= 90
                                        ? "text-green-400"
                                        : user.avg_score >= 75
                                            ? "text-blue-400"
                                            : "text-red-400"
                                        }`}
                                >
                                    {user.avg_score}%
                                </p>
                                <p className="text-gray-400 text-xs">AVG SCORE</p>
                            </div>
                            <div>
                                <p className="text-white font-bold">420</p>
                                <p className="text-gray-400 text-xs">HOURS</p>
                            </div>
                        </div>

                        <button
                            onClick={() => router.post('/logout')}
                            className="mt-6 w-full border border-red-500 text-red-500 py-2 hover:bg-red-500 hover:text-white transition"
                        >
                            ⏻ SYSTEM LOG OUT
                        </button>
                    </div>
                </div>

                {/* RIGHT CONTENT */}
                <div className="col-span-12 lg:col-span-8 space-y-4">

                    {/* MASTERY LEVEL */}
                    <div className="border border-blue-700 p-2 bg-[#070c20]">
                        <div className="flex items-center gap-4">

                            <div className="w-10 h-10 flex items-center justify-center rounded-full border-2 border-blue-500 text-xl font-bold flex-shrink-0">
                                {user.level}
                            </div>

                            <div className="flex-1">

                                <div className="w-full h-3 bg-[#1a1f3a] rounded">
                                    <div
                                        className="h-full bg-gradient-to-r from-blue-500 to-yellow-400 transition-all duration-500 shadow-[0_0_8px_#3b82f6]"
                                        style={{
                                            width: `${Math.min(progress, 100)}%`
                                        }}
                                    />
                                    <div className="text-right text-xs text-yellow-400 mt-1">
                                        {user.exp} / {user.exp_max}
                                    </div>
                                </div>



                            </div>

                            <span className="text-green-400 text-xs">● ONLINE</span>
                        </div>
                    </div>

                    {/* OPERATOR DATA */}
                    <div className="border border-blue-700 p-3 bg-[#070c20]">

                        <h3 className="text-blue-400 mb-4 font-semibold">
                            OPERATOR DATA
                        </h3>

                        {/* RANK */}
                        <div className="flex items-center gap-4 mb-6 border border-blue-800 p-4 bg-gradient-to-br from-[#0b1025] to-[#0a0f2c] rounded-xl shadow-lg">

                            {/* IMAGE */}
                            <div className="relative">
                                <img
                                    src={user.rank?.image ?? "/images/default-rank.png"}
                                    className="w-28 h-28 object-contain"
                                    style={{ filter: `drop-shadow(0 0 12px ${glow})` }}
                                />

                                <div
                                    className="absolute inset-0 blur-xl rounded-full"
                                    style={{ background: glow, opacity: 0.2 }}
                                />
                            </div>

                            {/* INFO */}
                            <div className="w-full">

                                <p className="text-xs text-gray-400">CURRENT RANK</p>

                                <p className="font-bold text-lg"
                                    style={{ color: glow }}>
                                    {user.rank?.name ?? "Unranked"}
                                </p>

                                {/* ⭐ STAR */}
                                <div className="flex gap-1 mt-1">
                                    {Array.from({ length: user.rank?.star ?? 1 }).map((_, i) => (
                                        <img
                                            key={i}
                                            src="https://cdn-icons-png.flaticon.com/512/1828/1828884.png"
                                            className="w-4 h-4 animate-pulse"
                                        />
                                    ))}
                                </div>

                                {/* ⭐ PROGRESS (QUIZ SCORE) */}
                                <div className="mt-2">

                                    <div className="flex justify-between text-[10px] text-gray-400 mb-1">
                                        <span>Progress to next star</span>
                                        <span>{Math.floor(starProgress)}%</span>
                                    </div>

                                    <div className="w-full h-2 bg-[#1a1f3a] rounded overflow-hidden">
                                        <div
                                            className="h-full transition-all duration-500"
                                            style={{
                                                width: `${starProgress}%`,
                                                background: `linear-gradient(to right, ${glow}, gold)`
                                            }}
                                        />
                                    </div>

                                </div>

                            </div>
                        </div>

                        {/* FORM */}
                        <div className="grid grid-cols-2 gap-4">
                            <input placeholder="USERNAME" className="bg-transparent border border-blue-800 p-2" />
                            <input placeholder="EMAIL" className="bg-transparent border border-blue-800 p-2" />
                            <input placeholder="SOCIAL UPLINK" className="bg-transparent border border-blue-800 p-2" />
                            <input placeholder="FAV COURSE" className="bg-transparent border border-blue-800 p-2" />
                        </div>

                        {/* LAST COURSE */}
                        {user.last_course ? (
                            <div className="mt-6 border border-blue-800 p-4 flex justify-between items-center">

                                <p className="text-sm font-semibold">
                                    {user.last_course.course_name}
                                </p>

                                <p className="text-xs text-gray-400">
                                    {user.last_course.path_name} • {user.last_course.module_name}
                                </p>

                                <Link
                                    href={user.last_course.url}
                                    className="bg-yellow-400 text-black px-4 py-1 font-bold hover:bg-yellow-300 transition"
                                >
                                    RESUME
                                </Link>

                            </div>
                        ) : (
                            <div className="mt-6 border border-blue-800 p-4 text-center text-gray-400 text-sm">
                                No active course
                            </div>
                        )}

                        <div className="flex justify-end mt-6">
                            <button className="bg-blue-600 px-6 py-2 font-semibold hover:bg-blue-500">
                                SAVE CHANGES
                            </button>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}