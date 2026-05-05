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
        <div className="relative flex h-screen w-screen flex-col overflow-hidden bg-[#050508] text-white font-['Oxanium']">
            {/* ── BACKGROUND GLOW ── */}
            <div className="pointer-events-none absolute inset-0 z-0 flex items-center justify-center">
                <div className="h-[300px] w-[600px] bg-blue-600 opacity-[0.03] blur-[150px]" />
            </div>

            {/* ── TOP BAR ── */}
            <div className="relative z-10 flex flex-shrink-0 items-center justify-between px-4 sm:px-6 md:px-8 pt-4 pb-2 xl:pt-6 xl:pb-4">
                {/* BACK */}
                <Link
                    href="/student/dashboard"
                    className="group flex items-center gap-3 text-blue-700 hover:text-blue-500 transition-colors"
                >
                    <div className="flex h-6 w-6 xl:h-8 xl:w-8 items-center justify-center border border-blue-900/50 transition-all duration-300">
                        <ArrowLeft size={16} />
                    </div>
                    <span className="text-xs xl:text-sm font-bold tracking-widest">
                        BACK
                    </span>
                </Link>

                <Link
                    href="/student/profile/switch"
                    className="flex h-6 w-6 xl:h-8 xl:w-8 items-center justify-center text-blue-700 hover:text-blue-500 transition-all duration-300"
                    title="Switch Account"
                >
                    <RefreshCw size={18} className="xl:h-[22px] xl:w-[22px]" strokeWidth={2.5} />
                </Link>
            </div>

            {/* ── MAIN CONTENT ── */}
            <div className="relative z-10 flex min-h-0 flex-1 flex-col gap-3 xl:gap-5 px-4 sm:px-6 md:px-8 pb-3 xl:pb-6 md:flex-row">
                {/* ══════════ LEFT PANEL ══════════ */}
                <div className="flex min-h-0 w-full flex-shrink-0 flex-col justify-between md:w-[260px] lg:w-[280px] xl:w-[320px]">
                    {/* PROFILE CARD */}
                    <div className="relative flex flex-col items-center border border-[#1a1c33] bg-[#020205] p-4 lg:p-5 xl:p-6 shadow-2xl">
                        {/* Top-right corner accent */}
                        <div className="absolute top-0 right-0 h-2 w-2 xl:h-3 xl:w-3 border-t-2 border-r-2 border-yellow-500" />

                        {/* HEX AVATAR */}
                        <div className="relative mb-3 xl:mb-5 h-[80px] w-[80px] xl:h-[120px] xl:w-[120px]">
                            <svg viewBox="0 0 100 100" className="absolute inset-0 h-full w-full drop-shadow-xl">
                                <defs>
                                    <clipPath id="avatarHexClip">
                                        <polygon points="50,2 95,25 95,75 50,98 5,75 5,25" />
                                    </clipPath>
                                </defs>
                                <image
                                    href={user.avatar ?? '/images/aizen.jpeg'}
                                    x="0"
                                    y="0"
                                    width="100"
                                    height="100"
                                    preserveAspectRatio="xMidYMid slice"
                                    clipPath="url(#avatarHexClip)"
                                />
                                <polygon
                                    points="50,2 95,25 95,75 50,98 5,75 5,25"
                                    fill="none"
                                    stroke="#fff"
                                    strokeWidth="1.5"
                                />
                            </svg>
                            {/* Camera Icon Overlay */}
                            <div className="absolute bottom-1 right-1 flex h-4 w-4 xl:h-5 xl:w-5 items-center justify-center rounded bg-yellow-500 text-black shadow-[0_0_10px_rgba(234,179,8,0.5)] cursor-pointer hover:bg-yellow-400 transition-colors">
                                <Camera size={10} className="xl:h-[12px] xl:w-[12px]" strokeWidth={3} />
                            </div>
                        </div>

                        {/* username */}
                        <h2 className="font-['Orbitron'] text-base xl:text-lg font-bold tracking-wider text-white leading-none">{user.name}</h2>
                        <p className="mt-1 xl:mt-1.5 text-[10px] xl:text-xs text-[#1e2a6e] font-bold leading-none">
                            Level <span className="text-blue-600">{user.level}</span>
                        </p>

                        {/* LINE SEPARATOR */}
                        <div className="mt-3 mb-2 xl:mt-5 xl:mb-4 h-px w-full bg-[#1a1c33]" />

                        {/* STATS */}
                        <div className="flex w-full items-center justify-center gap-2 xl:gap-4 text-center">
                            <div className="flex flex-col items-center">
                                <p className="font-bold text-yellow-500 text-[10px] xl:text-xs leading-none">{user.courses}</p>
                                <p className="text-[8px] xl:text-[9px] text-gray-500 tracking-wider mt-1">COURSES</p>
                            </div>
                            <div className="h-5 xl:h-7 w-px bg-[#1a1c33]" />
                            <div className="flex flex-col items-center">
                                <p className="font-bold text-blue-600 text-[10px] xl:text-xs leading-none">{user.avg_score}%</p>
                                <p className="text-[8px] xl:text-[9px] text-gray-500 tracking-wider mt-1">AVG SCORE</p>
                            </div>
                            <div className="h-5 xl:h-7 w-px bg-[#1a1c33]" />
                            <div className="flex flex-col items-center">
                                <p className="font-bold text-white text-[10px] xl:text-xs leading-none">420</p>
                                <p className="text-[8px] xl:text-[9px] text-gray-500 tracking-wider mt-1">HOURS</p>
                            </div>
                        </div>
                    </div>

                    {/* SYSTEM LOG OUT BUTTON */}
                    <button
                        onClick={() => router.post('/logout')}
                        className="mt-3 xl:mt-4 flex w-full items-center justify-center gap-1.5 xl:gap-2 border border-red-900/30 bg-transparent py-2 xl:py-3 font-['Orbitron'] text-[9px] xl:text-[10px] font-bold text-red-600 transition hover:bg-red-950/20 hover:border-red-900/60"
                    >
                        <Power size={14} className="xl:h-[16px] xl:w-[16px]" strokeWidth={2.5} />
                        SYSTEM LOG OUTNIH
                    </button>
                </div>

                {/* ══════════ RIGHT PANEL ══════════ */}
                <div className="flex min-h-0 min-w-0 flex-1 flex-col gap-3 xl:gap-5">
                    {/* MASTERY LEVEL */}
                    <div className="flex-shrink-0 border border-[#1a1c33] bg-[#020205] p-2.5 sm:p-3 xl:p-4 shadow-xl">
                        <div className="flex flex-col sm:flex-row items-center gap-3 xl:gap-5 text-center sm:text-left">
                            {/* LEVEL CIRCLE */}
                            <div className="relative flex h-[40px] w-[40px] xl:h-[50px] xl:w-[50px] flex-shrink-0 items-center justify-center rounded-full border-[3px] border-blue-600 font-['Orbitron'] text-base xl:text-lg font-bold text-white shadow-[0_0_15px_rgba(37,99,235,0.3)] mx-auto sm:mx-0">
                                <span className="absolute -inset-1 rounded-full border border-[#1a1c33]" />
                                {user.level}
                            </div>

                            <div className="min-w-0 flex-1 w-full">
                                <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-1 gap-1 sm:gap-0">
                                    <p className="font-['Oxanium'] text-sm xl:text-base font-bold tracking-widest text-white leading-none">
                                        MASTERY LEVEL
                                    </p>
                                    <div className="font-['Orbitron'] text-right sm:text-left leading-none">
                                        <span className="text-[10px] xl:text-[11px] font-bold text-yellow-500">
                                            {user.exp}
                                        </span>
                                        <span className="ml-1 text-[8px] xl:text-[9px] text-gray-500">
                                            /{user.exp_max}
                                        </span>
                                    </div>
                                </div>
                                <div className="h-1.5 w-full bg-[#1a1f3a] rounded-sm overflow-hidden mt-0.5 xl:mt-1">
                                    <div
                                        className="h-full bg-gradient-to-r from-[#4B30A5] to-yellow-500 transition-all duration-500"
                                        style={{ width: `${Math.min(progress, 100)}%` }}
                                    />
                                </div>
                                <div className="mt-1 flex items-center justify-end gap-1 text-[7px] xl:text-[8px] font-bold tracking-widest text-green-500 uppercase leading-none">
                                    <span className="h-1 w-1 rounded-full bg-green-500 shadow-[0_0_8px_#22c55e]" />
                                    ONLINE
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* OPERATOR DATA */}
                    <div className="relative flex min-h-0 flex-1 flex-col justify-between overflow-hidden border border-[#1a1c33] bg-[#020205] p-3 sm:p-4 xl:p-6 shadow-xl">

                        {/* TITLE */}
                        <h3 className="flex flex-shrink-0 items-center gap-1.5 xl:gap-2 font-['Orbitron'] text-xs xl:text-sm font-bold tracking-widest text-blue-700 leading-none">
                            <UserCog size={16} className="xl:h-5 xl:w-5" strokeWidth={2} />
                            OPERATOR DATA
                        </h3>

                        {/* RANK CARD */}
                        <div className="flex flex-col sm:flex-row flex-shrink-0 items-center sm:items-start gap-2.5 xl:gap-4 rounded-lg border border-[#1a1c33] bg-[#020205] p-2.5 xl:p-3 relative overflow-hidden">
                            {/* Blue glow accent */}
                            <div className="absolute top-0 left-1/4 right-1/4 h-[1px] bg-gradient-to-r from-transparent via-blue-600/50 to-transparent" />
                            <div className="absolute top-0 right-0 bottom-0 w-[1px] bg-gradient-to-b from-transparent via-blue-600/20 to-transparent" />
                            <div className="absolute bottom-0 right-0 left-0 h-[1px] bg-gradient-to-r from-transparent via-blue-600/50 to-transparent" />
                            <div className="absolute top-0 left-0 bottom-0 w-[1px] bg-gradient-to-b from-transparent via-blue-600/20 to-transparent" />

                            {/* RANK IMAGE */}
                            <div className="relative h-[40px] w-[40px] xl:h-[50px] xl:w-[50px] flex-shrink-0">
                                <svg viewBox="0 0 100 100" className="absolute inset-0 h-full w-full drop-shadow-[0_0_10px_rgba(250,204,21,0.3)]">
                                    <defs>
                                        <clipPath id="rankHexClip">
                                            <polygon points="50,2 95,25 95,75 50,98 5,75 5,25" />
                                        </clipPath>
                                    </defs>
                                    <image
                                        href={user.rank?.image ?? '/images/romawi.png'}
                                        x="15"
                                        y="15"
                                        width="70"
                                        height="70"
                                        preserveAspectRatio="xMidYMid slice"
                                        clipPath="url(#rankHexClip)"
                                    />
                                    <polygon
                                        points="50,2 95,25 95,75 50,98 5,75 5,25"
                                        fill="none"
                                        stroke="#eab308"
                                        strokeWidth="1.5"
                                    />
                                </svg>
                            </div>

                            {/* RANK INFO */}
                            <div className="flex min-w-0 flex-1 flex-col justify-center gap-1 xl:gap-1.5 w-full text-center sm:text-left">
                                <div className="flex flex-col sm:flex-row items-center sm:items-end justify-between gap-1 sm:gap-0">
                                    <div className="flex flex-col items-center sm:items-start">
                                        <p className="text-[7px] xl:text-[8px] font-bold tracking-[2px] text-blue-600 uppercase mb-0.5 leading-none">
                                            CURRENT RANK
                                        </p>
                                        <p className="font-['Orbitron'] text-sm xl:text-base font-bold tracking-wider text-blue-500 shadow-blue-500/20 drop-shadow-md leading-none">
                                            {user.rank?.name ?? 'NEXUS II'}
                                        </p>
                                        {/* ⭐ STAR */}
                                        <div className="mt-0.5 flex gap-0.5 xl:gap-1">
                                            {Array.from({
                                                length: user.rank?.star ?? 1,
                                            }).map((_, i) => (
                                                <img
                                                    key={i}
                                                    src="https://cdn-icons-png.flaticon.com/512/1828/1828884.png"
                                                    className="h-2 w-2 xl:h-2.5 xl:w-2.5 animate-pulse opacity-80"
                                                    alt="star"
                                                />
                                            ))}
                                        </div>
                                    </div>

                                    <div className="flex flex-col items-center sm:items-end w-full sm:w-auto border-t sm:border-0 border-[#1a1c33] pt-1 sm:pt-0 mt-1 sm:mt-0 leading-none">
                                        <div className="flex items-baseline gap-1">
                                            <span className="font-['Orbitron'] text-[9px] xl:text-[10px] font-bold text-yellow-500">
                                                {Math.floor(user.total_score % 500)}
                                            </span>
                                            <span className="font-['Orbitron'] text-[8px] xl:text-[9px] text-gray-500">
                                                /500
                                            </span>
                                        </div>
                                        <span className="text-[7px] xl:text-[8px] text-gray-500 font-bold mt-0.5">
                                            {Math.floor(starProgress)}%
                                        </span>
                                    </div>
                                </div>
                                {/* PROGRESS BAR */}
                                <div className="h-[3px] xl:h-[4px] w-full bg-[#1a1f3a] rounded-full overflow-hidden mt-0.5">
                                    <div
                                        className="h-full transition-all duration-700 rounded-full"
                                        style={{
                                            width: `${Math.min(starProgress, 100)}%`,
                                            background: '#7dd3fc', // Light blue cyan
                                            boxShadow: '0 0 10px #38bdf8',
                                        }}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* FIELDS */}
                        <div className="flex flex-shrink-0 flex-wrap gap-x-4 xl:gap-x-6 gap-y-2 xl:gap-y-3">
                            <div className="w-full sm:w-[calc(50%-8px)] xl:w-[calc(50%-12px)]">
                                <label className="mb-0.5 block font-['Oxanium'] text-[8px] xl:text-[9px] font-bold tracking-[2px] text-yellow-500 leading-none">
                                    USERNAME
                                </label>
                                <div className="border border-[#1a1c33] bg-[#000000] px-2 py-1 xl:px-3 xl:py-1.5 rounded-sm">
                                    <input
                                        placeholder=""
                                        defaultValue={user.name}
                                        className="w-full bg-transparent font-['Oxanium'] text-[10px] xl:text-xs text-gray-300 outline-none leading-none"
                                    />
                                </div>
                            </div>

                            <div className="w-full sm:w-[calc(50%-8px)] xl:w-[calc(50%-12px)]">
                                <label className="mb-0.5 block font-['Oxanium'] text-[8px] xl:text-[9px] font-bold tracking-[2px] text-yellow-500 leading-none">
                                    EMAIL
                                </label>
                                <div className="border border-[#1a1c33] bg-[#000000] px-2 py-1 xl:px-3 xl:py-1.5 rounded-sm">
                                    <input
                                        placeholder=""
                                        className="w-full bg-transparent font-['Oxanium'] text-[10px] xl:text-xs text-gray-300 outline-none leading-none"
                                    />
                                </div>
                            </div>

                            <div className="w-full sm:w-[calc(50%-8px)] xl:w-[calc(50%-12px)]">
                                <label className="mb-0.5 block font-['Oxanium'] text-[8px] xl:text-[9px] font-bold tracking-[2px] text-yellow-500 leading-none">
                                    SOCIAL UPLINK
                                </label>
                                <div className="border border-[#1a1c33] bg-[#000000] px-2 py-1 xl:px-3 xl:py-1.5 rounded-sm">
                                    <input
                                        placeholder=""
                                        className="w-full bg-transparent font-['Oxanium'] text-[10px] xl:text-xs text-gray-300 outline-none leading-none"
                                    />
                                </div>
                            </div>

                            <div className="w-full sm:w-[calc(50%-8px)] xl:w-[calc(50%-12px)]">
                                <label className="mb-0.5 block font-['Oxanium'] text-[8px] xl:text-[9px] font-bold tracking-[2px] text-yellow-500 leading-none">
                                    FAV COURSE
                                </label>
                                <div className="border border-[#1a1c33] bg-[#000000] px-2 py-1 xl:px-3 xl:py-1.5 rounded-sm">
                                    <input
                                        placeholder=""
                                        className="w-full bg-transparent font-['Oxanium'] text-[10px] xl:text-xs text-gray-300 outline-none leading-none"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* LAST MISSION */}
                        <div className="flex-shrink-0">
                            <p className="mb-1 xl:mb-1.5 flex-shrink-0 text-[8px] xl:text-[9px] font-bold tracking-[3px] text-yellow-500 leading-none">
                                LAST MISSION / COURSE
                            </p>
                            <div className="flex-shrink-0">
                                {user.last_course ? (
                                    <div className="relative flex flex-col sm:flex-row min-h-[40px] xl:min-h-[50px] items-start sm:items-center gap-2 xl:gap-3 border border-[#1a1c33] bg-black p-2 xl:p-2.5 overflow-hidden rounded-sm">
                                        {/* background banner if any */}
                                        <div
                                            className="absolute inset-0 right-1/4 bg-right bg-no-repeat opacity-50 mix-blend-screen pointer-events-none"
                                            style={{ backgroundImage: "url('/images/fullstack.png')", backgroundSize: 'cover', backgroundPosition: 'center' }}
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/80 to-transparent pointer-events-none" />

                                        {/* BADGE IV */}
                                        <div className="hidden sm:flex relative z-10 h-6 w-6 xl:h-8 xl:w-8 flex-shrink-0 items-center justify-center bg-black/50 border border-blue-900/50 rounded-full shadow-[0_0_10px_rgba(30,58,138,0.5)]">
                                            <img src="/images/romawi.png" className="h-4 w-4 xl:h-5 xl:w-5 object-contain drop-shadow-[0_0_5px_rgba(255,255,255,0.3)]" alt="Badge" />
                                        </div>

                                        {/* TEXT */}
                                        <div className="relative z-10 min-w-0 flex-1 pl-0 sm:pl-1 w-full">
                                            <p className="truncate text-[11px] xl:text-xs font-bold tracking-wide text-white drop-shadow-md leading-none">
                                                {user.last_course.course_name || 'Data Science Mastery'}
                                            </p>
                                            <p className="mt-0.5 truncate text-[8px] xl:text-[9px] text-gray-400 leading-none">
                                                {user.last_course.path_name || 'Level 4'} : {user.last_course.module_name || 'Encryption Protocols'}
                                            </p>
                                        </div>

                                        {/* RESUME BUTTON */}
                                        <Link
                                            href={user.last_course?.url || '#'}
                                            className="relative z-10 sm:mr-1 flex-shrink-0 bg-yellow-400 w-full sm:w-auto text-center px-3 py-1 xl:px-4 xl:py-1.5 font-['Orbitron'] text-[8px] xl:text-[9px] font-bold tracking-widest text-black transition-colors hover:bg-yellow-300 rounded-sm mt-1 sm:mt-0 leading-none"
                                        >
                                            RESUME
                                        </Link>

                                        <div className="absolute bottom-0 right-0 left-0 h-px bg-gradient-to-r from-transparent via-[#4B30A5] to-blue-500 shadow-[0_-2px_10px_#2563eb]" />
                                    </div>
                                ) : (
                                    <div className="border border-[#1a1c33] p-2 text-center font-['Orbitron'] text-[8px] xl:text-[9px] tracking-widest text-gray-500 bg-black leading-none">
                                        NO ACTIVE COURSE
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* SAVE CHANGES */}
                        <div className="flex justify-end">
                            <button
                                className="bg-[#4a2ee6] w-full sm:w-auto px-4 py-1.5 xl:px-6 xl:py-2 font-['Oxanium'] text-[9px] xl:text-[11px] font-bold tracking-widest text-white transition hover:bg-[#5b3df6] rounded-sm leading-none"
                                style={{
                                    boxShadow: '0 4px 15px rgba(74, 46, 230, 0.4)',
                                }}
                            >
                                SAVE CHANGES
                            </button>
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
