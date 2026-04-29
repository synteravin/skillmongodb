import { Link, router } from '@inertiajs/react';
import { ArrowLeft, Power, Camera, UserCog, RefreshCw } from 'lucide-react';
import { useState } from 'react';

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
            thumbnail?: string; // ← tambah ini
        };
    };
};

export default function ProfilePage({ user }: Props) {
    const [showImage, setShowImage] = useState(false);
    const progress =
        ((user.exp - user.exp_min) / (user.exp_max - user.exp_min)) * 100;

    const glowMap: Record<string, string> = {
        Hatching: 'rgba(59,130,246,0.7)',
        Wyvern: 'rgba(34,197,94,0.7)',
        Drake: 'rgba(168,85,247,0.7)',
        Hydra: 'rgba(239,68,68,0.7)',
        Monarch: 'rgba(250,204,21,0.7)',
        Infernal: 'rgba(249,115,22,0.7)',
        Zenith: 'rgba(34,211,238,0.7)',
    };

    const glow = glowMap[user.rank?.name ?? ''] || 'rgba(59,130,246,0.7)';

    // ⚠️ pastikan ini dari backend
    const starProgress = ((user.total_score % 500) / 500) * 100;

    return (
        <div className="relative flex h-screen w-screen flex-col overflow-hidden bg-[#020202] text-white">
            {/* ── BACKGROUND GLOW ── */}
            <div className="pointer-events-none absolute inset-0 z-0 flex items-center justify-center">
                <div className="h-[300px] w-[600px] bg-blue-500 opacity-20 blur-[180px]" />
            </div>

            {/* ── TOP BAR ── */}
            <div className="relative z-10 flex flex-shrink-0 items-center justify-between px-4 pt-3 pb-2 md:px-6">
                {/* BACK */}
                <Link
                    href="/student/dashboard"
                    className="group flex items-center gap-2"
                >
                    <div className="flex h-8 w-8 items-center justify-center rounded border border-[#1e2759] text-blue-500 transition-all duration-300 group-hover:border-blue-500 group-hover:shadow-[0_0_10px_rgba(59,130,246,0.6)]">
                        <ArrowLeft size={16} />
                    </div>
                    <span className="text-sm font-medium tracking-wide text-blue-400 transition-all duration-300 group-hover:text-blue-300">
                        Back
                    </span>
                </Link>

                {/* SWITCH / TUKAR ICON — pojok kanan atas */}
                <Link
                    href="/student/profile/switch"
                    className="flex h-9 w-9 items-center justify-center rounded border border-[#3B28F6] text-[#3B28F6] transition-all duration-300 hover:border-cyan-400 hover:text-cyan-400 hover:shadow-[0_0_12px_rgba(0,212,255,0.5)]"
                    title="Switch Account"
                >
                    <RefreshCw size={17} strokeWidth={2} />
                </Link>
            </div>

            {/* ── MAIN CONTENT ── */}
            <div className="relative z-10 flex min-h-0 flex-1 flex-col gap-3 px-4 pb-3 md:flex-row md:gap-4 md:px-6">
                {/* ══════════ LEFT PANEL WRAPPER ══════════ */}
                <div className="right-2.5 flex w-full flex-shrink-0 flex-col gap-3 md:w-[260px] lg:w-[280px] xl:w-[295px] 2xl:w-[310px]">
                    {/* PROFILE CARD */}
                    <div className="flex h-[320px] flex-col items-center border-2 border-[#3B28F6] bg-[#050619] p-4 text-center md:p-5">
                        {/* AVATAR */}

                        <div className="relative mb-4 h-[120px] w-[120px]">
                            {/* AVATAR */}
                            <div className="absolute inset-[10px] overflow-hidden rounded-md">
                                <img
                                    src={user.avatar ?? '/images/aizen.jpeg'}
                                    className="h-full w-full object-cover"
                                />
                            </div>

                            {/* BORDER */}
                            <img
                                src="/images/border.png"
                                className="pointer-events-none absolute inset-0 h-full w-full object-contain"
                            />
                        </div>
                        {/* username */}
                        <h2 className="text-lg font-bold">{user.name}</h2>
                        <p className="mb-4 text-sm text-blue-400">
                            Level {user.level}
                        </p>
                        <div className="flex w-full justify-between border-t border-blue-800 pt-4 text-sm">
                            <div>
                                <p className="font-bold text-yellow-400">
                                    {user.courses}
                                </p>
                                <p className="text-xs text-gray-400">COURSES</p>
                            </div>
                            <div>
                                <p
                                    className={`font-bold ${
                                        user.avg_score >= 90
                                            ? 'text-green-400'
                                            : user.avg_score >= 75
                                              ? 'text-blue-400'
                                              : 'text-red-400'
                                    }`}
                                >
                                    {user.avg_score}%
                                </p>
                                <p className="text-xs text-gray-400">
                                    AVG SCORE
                                </p>
                            </div>
                            <div>
                                <p className="font-bold text-white">420</p>
                                <p className="text-xs text-gray-400">HOURS</p>
                            </div>
                        </div>

                        <button
                            onClick={() => router.post('/logout')}
                            className="mt-6 w-full border border-red-500 py-2 text-red-500 transition hover:bg-red-500 hover:text-white"
                        >
                            ⏻ SYSTEM LOG OUT
                        </button>
                    </div>
                </div>

                {/* RIGHT CONTENT */}
                <div className="col-span-12 space-y-4 lg:col-span-8">
                    {/* MASTERY LEVEL */}
                    <div className="border border-blue-700 bg-[#070c20] p-2">
                        <div className="flex items-center gap-4">
                            <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full border-2 border-blue-500 text-xl font-bold">
                                {user.level}
                            </div>

                            <div className="flex-1">
                                <div className="h-3 w-full rounded bg-[#1a1f3a]">
                                    <div
                                        className="h-full bg-gradient-to-r from-blue-500 to-yellow-400 shadow-[0_0_8px_#3b82f6] transition-all duration-500"
                                        style={{
                                            width: `${Math.min(progress, 100)}%`,
                                        }}
                                    />
                                    <div className="mt-1 text-right text-xs text-yellow-400">
                                        {user.exp} / {user.exp_max}
                                    </div>
                                </div>
                            </div>

                            <span className="text-xs text-green-400">
                                ● ONLINE
                            </span>
                        </div>
                    </div>

                    {/* OPERATOR DATA */}
                    <div className="border border-blue-700 bg-[#070c20] p-3">
                        <h3 className="mb-4 font-semibold text-blue-400">
                            OPERATOR DATA
                        </h3>

                        {/* RANK */}
                        <div className="mb-6 flex items-center gap-4 rounded-xl border border-blue-800 bg-gradient-to-br from-[#0b1025] to-[#0a0f2c] p-4 shadow-lg">
                            {/* IMAGE */}
                            <div className="relative">
                                <img
                                    src={
                                        user.rank?.image ??
                                        '/images/default-rank.png'
                                    }
                                    className="h-28 w-28 object-contain"
                                    style={{
                                        filter: `drop-shadow(0 0 12px ${glow})`,
                                    }}
                                />

                                <div
                                    className="absolute inset-0 rounded-full blur-xl"
                                    style={{ background: glow, opacity: 0.2 }}
                                />
                            </div>

                            {/* INFO */}
                            <div className="w-full">
                                <p className="text-xs text-gray-400">
                                    CURRENT RANK
                                </p>

                                <p
                                    className="text-lg font-bold"
                                    style={{ color: glow }}
                                >
                                    {user.rank?.name ?? 'Unranked'}
                                </p>

                                {/* ⭐ STAR */}
                                <div className="mt-1 flex gap-1">
                                    {Array.from({
                                        length: user.rank?.star ?? 1,
                                    }).map((_, i) => (
                                        <img
                                            key={i}
                                            src="https://cdn-icons-png.flaticon.com/512/1828/1828884.png"
                                            className="h-4 w-4 animate-pulse"
                                        />
                                    ))}
                                </div>

                                {/* ⭐ PROGRESS (QUIZ SCORE) */}
                                <div className="mt-2">
                                    <div className="mb-1 flex justify-between text-[10px] text-gray-400">
                                        <span>Progress to next star</span>
                                        <span>{Math.floor(starProgress)}%</span>
                                    </div>

                                    <div className="h-2 w-full overflow-hidden rounded bg-[#1a1f3a]">
                                        <div
                                            className="h-full transition-all duration-500"
                                            style={{
                                                width: `${starProgress}%`,
                                                background: `linear-gradient(to right, ${glow}, gold)`,
                                            }}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* FORM */}
                        <div className="grid grid-cols-2 gap-4">
                            <input
                                placeholder="USERNAME"
                                className="border border-blue-800 bg-transparent p-2"
                            />
                            <input
                                placeholder="EMAIL"
                                className="border border-blue-800 bg-transparent p-2"
                            />
                            <input
                                placeholder="SOCIAL UPLINK"
                                className="border border-blue-800 bg-transparent p-2"
                            />
                            <input
                                placeholder="FAV COURSE"
                                className="border border-blue-800 bg-transparent p-2"
                            />
                        </div>

                        {/* LAST COURSE */}
                        {user.last_course ? (
                            <div className="mt-6 flex items-center justify-between border border-blue-800 p-4">
                                <p className="text-sm font-semibold">
                                    {user.last_course.course_name}
                                </p>

                                <p className="text-xs text-gray-400">
                                    {user.last_course.path_name} •{' '}
                                    {user.last_course.module_name}
                                </p>

                                <Link
                                    href={user.last_course.url}
                                    className="bg-yellow-400 px-4 py-1 font-bold text-black transition hover:bg-yellow-300"
                                >
                                    RESUME
                                </Link>
                            </div>
                        ) : (
                            <div className="mt-6 border border-blue-800 p-4 text-center text-sm text-gray-400">
                                No active course
                            </div>
                        )}

                        <div className="mt-6 flex justify-end">
                            <button className="bg-blue-600 px-6 py-2 font-semibold hover:bg-blue-500">
                                SAVE CHANGES
                            </button>
                        </div>

                        {/* NAME */}
                        <h2 className="mb-1 font-['Orbitron'] text-base leading-tight font-extrabold tracking-wide break-words">
                            {user.name}
                        </h2>

                        {/* LEVEL */}
                        <p className="mb-3 text-sm font-extrabold text-[#3B28F6]">
                            Level {user.level}
                        </p>

                        {/* STATS */}
                        <div className="flex w-full items-center border-t border-gray-700 pt-3 text-sm">
                            <div className="flex-1 text-center">
                                <p className="font-bold text-yellow-400">
                                    {user.courses}
                                </p>
                                <p className="mt-0.5 text-[10px] tracking-widest text-gray-400">
                                    COURSES
                                </p>
                            </div>
                            <div className="h-8 w-px bg-gray-700" />
                            <div className="flex-1 text-center">
                                <p
                                    className={`font-bold ${user.avg_score >= 90 ? 'text-green-400' : user.avg_score >= 75 ? 'text-[#3B28F6]' : 'text-red-500'}`}
                                >
                                    {user.avg_score}%
                                </p>
                                <p className="mt-0.5 text-[10px] tracking-widest text-gray-400">
                                    AVG SCORE
                                </p>
                            </div>
                            <div className="h-8 w-px bg-gray-700" />
                            <div className="flex-1 text-center">
                                <p className="font-bold text-white">420</p>
                                <p className="mt-0.5 text-[10px] tracking-widest text-gray-400">
                                    HOURS
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* LOGOUT — di luar profile card, otomatis di bawah */}
                    <button
                        onClick={() => router.post('/logout')}
                        className="mt-auto flex w-full items-center justify-center gap-2 border-2 border-[#3B28F6] bg-[#050619] py-2.5 font-['Orbitron'] text-sm font-bold text-red-500 transition hover:text-red-400 hover:shadow-[0_0_12px_rgba(239,68,68,0.3)]"
                    >
                        <Power size={16} strokeWidth={3} />
                        SYSTEM LOG OUT
                    </button>
                </div>
                {/* ══════════ RIGHT PANEL ══════════ */}
                <div className="flex min-h-0 min-w-0 flex-1 flex-col gap-3">
                    {/* MASTERY LEVEL */}
                    <div className="flex-shrink-0 border-2 border-[#3B28F6] bg-[#050619] p-4">
                        <div className="flex items-center gap-4">
                            {/* LEVEL CIRCLE */}
                            <div className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-full border-[4px] border-blue-500 font-['Orbitron'] text-2xl font-bold shadow-[0_0_12px_rgba(59,130,246,0.4)]">
                                {user.level}
                            </div>
                            <div className="min-w-0 flex-1">
                                <p className="mb-1 font-['Oxanium'] text-xl leading-none font-semibold tracking-widest text-gray-200 md:text-2xl">
                                    MASTERY LEVEL
                                </p>
                                <div className="mb-1 flex justify-end font-['Orbitron']">
                                    <span className="text-xs text-yellow-400">
                                        {user.exp}
                                    </span>
                                    <span className="mt-0.5 ml-1 text-[10px] text-gray-500">
                                        /{user.exp_max}
                                    </span>
                                </div>
                                <div className="h-2.5 w-full overflow-hidden bg-[#1a1f3a]">
                                    <div
                                        className="h-full bg-gradient-to-r from-blue-500 via-purple-500 to-yellow-400 transition-all duration-500"
                                        style={{
                                            width: `${Math.min(progress, 100)}%`,
                                        }}
                                    />
                                </div>
                                <div className="mt-1.5 flex items-center justify-end gap-1 text-[10px] text-green-400">
                                    <span className="h-1.5 w-1.5 rounded-full bg-green-400" />
                                    ONLINE
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* OPERATOR DATA */}
                    <div className="relative flex min-h-0 flex-1 flex-col overflow-hidden border-2 border-[#3B28F6] bg-[#050619] p-4 md:p-5">
                        {/* TOP GLOW LINE */}
                        <div
                            className="absolute top-0 right-0 left-0 h-px"
                            style={{
                                background:
                                    'linear-gradient(90deg, transparent, #3B28F6, #00e5ff, #3B28F6, transparent)',
                            }}
                        />

                        {/* TITLE */}
                        <h3 className="mb-3 flex flex-shrink-0 items-center gap-2 font-['Orbitron'] text-base font-bold tracking-widest text-[#3B28F6] md:text-lg">
                            <UserCog size={22} strokeWidth={2} />
                            OPERATOR DATA
                        </h3>

                        {/* RANK CARD */}
                        <div className="mb-3 flex flex-shrink-0 items-center gap-4 rounded-lg border border-[#3B28F6]/70 bg-[#3B28F6]/5 p-3">
                            {/* HEX AVATAR */}
                            <div className="h-[64px] w-[64px] flex-shrink-0">
                                <svg
                                    viewBox="0 0 80 80"
                                    className="h-full w-full"
                                >
                                    <defs>
                                        <clipPath id="hexClip">
                                            <polygon points="40,4 74,22 74,58 40,76 6,58 6,22" />
                                        </clipPath>
                                    </defs>
                                    <image
                                        href="/images/romawi.png"
                                        x="16"
                                        y="14"
                                        width="48"
                                        height="52"
                                        preserveAspectRatio="xMidYMid slice"
                                        clipPath="url(#hexClip)"
                                    />
                                    <polygon
                                        points="40,4 74,22 74,58 40,76 6,58 6,22"
                                        fill="none"
                                        stroke="#FACC15"
                                        strokeWidth="1.5"
                                    />
                                </svg>
                            </div>

                            {/* RANK INFO */}
                            <div className="flex min-w-0 flex-1 flex-col gap-1.5">
                                {/* LABEL + RANK NAME  |  XP NUMBER */}
                                <div className="-mt-5 flex items-end justify-between">
                                    {/* KIRI — label & rank */}
                                    <div>
                                        <p className="mb-0.5 text-[9px] font-bold tracking-[2px] text-gray-500">
                                            CURRENT RANK
                                        </p>
                                        <p
                                            className="font-['Orbitron'] text-lg leading-none font-bold tracking-wider text-[#3B28F6]"
                                            style={{
                                                textShadow:
                                                    '0 0 12px rgba(59,40,246,0.6)',
                                            }}
                                        >
                                            NEXUS II
                                        </p>
                                    </div>

                                    {/* KANAN — xp number */}
                                    <div className="flex items-baseline gap-1">
                                        <span className="font-['Orbitron'] text-base leading-none font-bold text-yellow-400">
                                            230
                                        </span>
                                        <span className="font-['Orbitron'] text-xs leading-none text-gray-500">
                                            / 500
                                        </span>
                                    </div>
                                </div>
                                {/* PROGRESS BAR */}
                                <div className="h-3 w-full overflow-hidden rounded-none border border-[#1a1f3a] bg-[#0f1235]">
                                    <div
                                        className="h-full rounded-r-full transition-all duration-700"
                                        style={{
                                            width: '46%',
                                            background:
                                                'linear-gradient(90deg, #00bfff, #00e5ff)',
                                            boxShadow: '0 0 8px #00d4ff',
                                        }}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* FIELDS */}
                        <div className="mb-3 flex flex-shrink-0 flex-wrap gap-4">
                            <div className="w-[48%]">
                                <label className="mb-1 block font-['Oxanium'] text-[10px] tracking-[2px] text-yellow-400">
                                    USERNAME
                                </label>
                                <input
                                    placeholder="ENTER USERNAME"
                                    className="w-full border border-[#1e2a6e] bg-[rgba(0,0,20,0.6)] px-3 py-2 font-['Orbitron'] text-sm tracking-wide text-[#c0d0ff] transition-all outline-none placeholder:text-[#2a3060] focus:border-[#3B28F6] focus:shadow-[0_0_8px_rgba(59,40,246,0.3)]"
                                />
                            </div>

                            <div className="w-[48%]">
                                <label className="mb-1 block font-['Oxanium'] text-[10px] tracking-[2px] text-yellow-400">
                                    EMAIL
                                </label>
                                <input
                                    placeholder="ENTER EMAIL"
                                    className="w-full border border-[#1e2a6e] bg-[rgba(0,0,20,0.6)] px-3 py-2 font-['Orbitron'] text-sm tracking-wide text-[#c0d0ff] transition-all outline-none placeholder:text-[#2a3060] focus:border-[#3B28F6] focus:shadow-[0_0_8px_rgba(59,40,246,0.3)]"
                                />
                            </div>

                            <div className="w-[48%]">
                                <label className="mb-1 block text-[10px] tracking-[2px] text-yellow-400">
                                    SOCIAL UPLINK
                                </label>
                                <input
                                    placeholder="SOCIAL HANDLE"
                                    className="w-full border border-[#1e2a6e] bg-[rgba(0,0,20,0.6)] px-3 py-2 font-['Orbitron'] text-sm tracking-wide text-[#c0d0ff] transition-all outline-none placeholder:text-[#2a3060] focus:border-[#3B28F6] focus:shadow-[0_0_8px_rgba(59,40,246,0.3)]"
                                />
                            </div>

                            <div className="w-[48%]">
                                <label className="mb-1 block font-['Oxanium'] text-[10px] tracking-[2px] text-yellow-400">
                                    FAV COURSE
                                </label>
                                <input
                                    placeholder="COURSE NAME"
                                    className="w-full border border-[#1e2a6e] bg-[rgba(0,0,20,0.6)] px-3 py-2 font-['Orbitron'] text-sm tracking-wide text-[#c0d0ff] transition-all outline-none placeholder:text-[#2a3060] focus:border-[#3B28F6] focus:shadow-[0_0_8px_rgba(59,40,246,0.3)]"
                                />
                            </div>
                        </div>

                        {/* LAST MISSION */}
                        <p className="mb-2 flex-shrink-0 text-[10px] tracking-[3px] text-yellow-400">
                            LAST MISSION / COURSE
                        </p>
                        <div className="mb-3 flex-shrink-0">
                            {user.last_course ? (
                                <div className="relative flex h-[72px] items-center gap-3 overflow-hidden border border-[#3B28F6]/60 p-3">
                                    <div
                                        className="absolute inset-0 bg-center"
                                        style={{
                                            backgroundImage:
                                                "url('/images/fullstack.png')",
                                            backgroundSize: '30%',
                                            // backgroundRepeat: "no-repeat"
                                        }}
                                    />
                                    {/* fade overlay */}
                                    <div
                                        className="absolute inset-0"
                                        style={{
                                            background:
                                                'linear-gradient(90deg, #050619 30%, transparent 60%, #050619 100%)',
                                        }}
                                    />

                                    {/* BADGE IV */}
                                    <div
                                        className="relative z-10 flex h-11 w-11 flex-shrink-0 items-center justify-center border border-[#FACC15]/60 font-['Orbitron'] text-sm font-black text-[#e0d0ff]"
                                        style={{
                                            background:
                                                'linear-gradient(135deg,#0a0a2a,#1a1040)',
                                            textShadow: '0 0 8px #3B28F6',
                                            boxShadow:
                                                '0 0 10px rgba(59,40,246,0.4)',
                                        }}
                                    >
                                        ⚔️
                                    </div>

                                    {/* TEXT */}
                                    <div className="relative z-10 min-w-0 flex-1">
                                        <p className="truncate text-sm font-bold tracking-wide text-white">
                                            {user.last_course.course_name}
                                        </p>
                                        <p className="mt-0.5 truncate text-[11px] text-gray-400">
                                            {user.last_course.path_name} •{' '}
                                            {user.last_course.module_name}
                                        </p>
                                    </div>

                                    {/* RESUME BUTTON */}
                                    <Link
                                        href={user.last_course.url}
                                        className="relative z-10 flex-shrink-0 bg-yellow-400 px-5 py-2 font-['Orbitron'] text-xs font-black tracking-wide text-black transition-colors hover:bg-yellow-300"
                                    >
                                        RESUME
                                    </Link>

                                    {/* GARIS BAWAH PROGRESS */}
                                    <div className="absolute right-0 bottom-0 left-0 h-[3px] bg-[#0f1235]">
                                        <div
                                            className="h-full transition-all duration-700"
                                            style={{
                                                width: '26%',
                                                background:
                                                    'linear-gradient(90deg, #3B28F6, #00e5ff)',
                                                boxShadow: '0 0 6px #00d4ff',
                                            }}
                                        />
                                    </div>
                                </div>
                            ) : (
                                <div className="border border-[#3B28F6]/40 p-3 text-center font-['Orbitron'] text-xs tracking-widest text-gray-500">
                                    NO ACTIVE COURSE
                                </div>
                            )}
                        </div>

                        <div className="mt-auto flex flex-shrink-0 justify-end">
                            <div
                                className="p-[2px]"
                                style={{
                                    background:
                                        'linear-gradient(90deg,#3B28F6,#6D5BFF)',
                                    clipPath:
                                        'polygon(0% 0%, 92% 0%, 100% 50%, 100% 100%, 0% 100%)',
                                    boxShadow: '0 0 20px rgba(59,40,246,0.6)',
                                }}
                            >
                                <button
                                    className="w-full px-10 py-3 font-['Orbitron'] text-sm font-bold tracking-widest text-white transition hover:shadow-[0_0_20px_rgba(59,40,246,1)] hover:brightness-125"
                                    style={{
                                        background:
                                            'linear-gradient(90deg,#3B28F6,#2a1fd6)',
                                        clipPath:
                                            'polygon(0% 0%, 92% 0%, 100% 50%, 100% 100%, 0% 100%)',
                                        textShadow:
                                            '0 0 6px rgba(255,255,255,0.6)',
                                    }}
                                >
                                    SAVE CHANGES
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* ── MODAL AVATAR ── */}
            {showImage && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/90"
                    onClick={() => setShowImage(false)}
                >
                    <img
                        src={user.avatar ?? '/images/iam.jpeg'}
                        onClick={(e) => e.stopPropagation()}
                        className="max-h-[90%] max-w-[90%] object-contain"
                        alt="avatar full"
                    />
                </div>
            )}
        </div>
    );
}
