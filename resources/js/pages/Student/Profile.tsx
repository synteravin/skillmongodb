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
        <div className="relative flex min-h-screen w-screen flex-col overflow-x-hidden overflow-y-auto bg-[#050508] text-white font-['Oxanium']">
            {/* ── BACKGROUND GLOW ── */}
            <div className="pointer-events-none absolute inset-0 z-0 flex items-center justify-center">
                <div className="h-[300px] w-[600px] bg-blue-600 opacity-[0.03] blur-[150px]" />
            </div>

            {/* ── TOP BAR ── */}
            <div className="relative z-10 flex flex-shrink-0 items-center justify-between px-8 pt-8 pb-4">
                {/* BACK */}
                <Link
                    href="/student/dashboard"
                    className="group flex items-center gap-3 text-blue-700 hover:text-blue-500 transition-colors"
                >
                    <div className="flex h-8 w-8 items-center justify-center border border-blue-900/50 transition-all duration-300">
                        <ArrowLeft size={18} />
                    </div>
                    <span className="text-sm font-bold tracking-widest">
                        BACK
                    </span>
                </Link>

                {/* SWITCH ICON */}
                <Link
                    href="/student/profile/switch"
                    className="flex h-8 w-8 items-center justify-center text-blue-700 hover:text-blue-500 transition-all duration-300"
                    title="Switch Account"
                >
                    <RefreshCw size={22} strokeWidth={2.5} />
                </Link>
            </div>

            {/* ── MAIN CONTENT ── */}
            <div className="relative z-10 flex min-h-0 flex-1 flex-col gap-6 px-8 pb-8 md:flex-row">
                {/* ══════════ LEFT PANEL ══════════ */}
                <div className="flex w-full flex-shrink-0 flex-col justify-between md:w-[320px] lg:w-[340px]">
                    {/* PROFILE CARD */}
                    <div className="relative flex flex-col items-center border border-[#1a1c33] bg-[#020205] p-8 shadow-2xl">
                        {/* Top-right corner accent */}
                        <div className="absolute top-0 right-0 h-3 w-3 border-t-2 border-r-2 border-yellow-500" />
                        
                        {/* HEX AVATAR */}
                        <div className="relative mb-6 h-[140px] w-[140px]">
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
                            <div className="absolute bottom-1 right-2 flex h-6 w-6 items-center justify-center rounded bg-yellow-500 text-black shadow-[0_0_10px_rgba(234,179,8,0.5)] cursor-pointer hover:bg-yellow-400 transition-colors">
                                <Camera size={14} strokeWidth={3} />
                            </div>
                        </div>

                        {/* username */}
                        <h2 className="font-['Orbitron'] text-xl font-bold tracking-wider text-white">{user.name}</h2>
                        <p className="mt-1.5 text-sm text-[#1e2a6e] font-bold">
                            Level <span className="text-blue-600">{user.level}</span>
                        </p>

                        {/* LINE SEPARATOR */}
                        <div className="mt-8 mb-5 h-px w-full bg-[#1a1c33]" />

                        {/* STATS */}
                        <div className="flex w-full items-center justify-center gap-5 text-center">
                            <div className="flex flex-col items-center">
                                <p className="font-bold text-yellow-500 text-sm">{user.courses}</p>
                                <p className="text-[10px] text-gray-500 tracking-wider mt-1">COURSES</p>
                            </div>
                            <div className="h-8 w-px bg-[#1a1c33]" />
                            <div className="flex flex-col items-center">
                                <p className="font-bold text-blue-600 text-sm">{user.avg_score}%</p>
                                <p className="text-[10px] text-gray-500 tracking-wider mt-1">AVG SCORE</p>
                            </div>
                            <div className="h-8 w-px bg-[#1a1c33]" />
                            <div className="flex flex-col items-center">
                                <p className="font-bold text-white text-sm">420</p>
                                <p className="text-[10px] text-gray-500 tracking-wider mt-1">HOURS</p>
                            </div>
                        </div>
                    </div>

                    {/* SYSTEM LOG OUT BUTTON */}
                    <button
                        onClick={() => router.post('/logout')}
                        className="mt-6 flex w-full items-center justify-center gap-3 border border-red-900/30 bg-transparent py-4 font-['Orbitron'] text-xs font-bold text-red-600 transition hover:bg-red-950/20 hover:border-red-900/60"
                    >
                        <Power size={18} strokeWidth={2.5} />
                        SYSTEM LOG OUT
                    </button>
                </div>

                {/* ══════════ RIGHT PANEL ══════════ */}
                <div className="flex min-h-0 min-w-0 flex-1 flex-col gap-6">
                    {/* MASTERY LEVEL */}
                    <div className="flex-shrink-0 border border-[#1a1c33] bg-[#020205] p-6 shadow-xl">
                        <div className="flex flex-col sm:flex-row items-center gap-6 sm:gap-8 text-center sm:text-left">
                            {/* LEVEL CIRCLE */}
                            <div className="relative flex h-[72px] w-[72px] flex-shrink-0 items-center justify-center rounded-full border-[5px] border-blue-600 font-['Orbitron'] text-2xl font-bold text-white shadow-[0_0_20px_rgba(37,99,235,0.3)] mx-auto sm:mx-0">
                                <span className="absolute -inset-1.5 rounded-full border border-[#1a1c33]" />
                                {user.level}
                            </div>

                            <div className="min-w-0 flex-1 pt-1 w-full">
                                <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-2 gap-2 sm:gap-0">
                                    <p className="font-['Oxanium'] text-xl font-bold tracking-widest text-white">
                                        MASTERY LEVEL
                                    </p>
                                    <div className="font-['Orbitron'] text-right sm:text-left">
                                        <span className="text-sm font-bold text-yellow-500">
                                            {user.exp}
                                        </span>
                                        <span className="ml-1 text-[11px] text-gray-500">
                                            /{user.exp_max}
                                        </span>
                                    </div>
                                </div>
                                <div className="h-3 w-full bg-[#1a1f3a] rounded-sm overflow-hidden">
                                    <div
                                        className="h-full bg-gradient-to-r from-[#4B30A5] to-yellow-500 transition-all duration-500"
                                        style={{ width: `${Math.min(progress, 100)}%` }}
                                    />
                                </div>
                                <div className="mt-2.5 flex items-center justify-end gap-2 text-[9px] font-bold tracking-widest text-green-500 uppercase">
                                    <span className="h-1.5 w-1.5 rounded-full bg-green-500 shadow-[0_0_8px_#22c55e]" />
                                    ONLINE
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* OPERATOR DATA */}
                    <div className="relative flex min-h-0 flex-1 flex-col overflow-hidden border border-[#1a1c33] bg-[#020205] p-7 shadow-xl">
                        
                        {/* TITLE */}
                        <h3 className="mb-6 flex flex-shrink-0 items-center gap-3 font-['Orbitron'] text-base font-bold tracking-widest text-blue-700">
                            <UserCog size={24} strokeWidth={2} />
                            OPERATOR DATA
                        </h3>

                        {/* RANK CARD */}
                        <div className="mb-8 flex flex-shrink-0 items-center gap-5 rounded-lg border border-[#1a1c33] bg-[#020205] p-4 relative overflow-hidden">
                            {/* Blue glow accent */}
                            <div className="absolute top-0 left-1/4 right-1/4 h-[1px] bg-gradient-to-r from-transparent via-blue-600/50 to-transparent" />
                            <div className="absolute top-0 right-0 bottom-0 w-[1px] bg-gradient-to-b from-transparent via-blue-600/20 to-transparent" />
                            <div className="absolute bottom-0 right-0 left-0 h-[1px] bg-gradient-to-r from-transparent via-blue-600/50 to-transparent" />
                            <div className="absolute top-0 left-0 bottom-0 w-[1px] bg-gradient-to-b from-transparent via-blue-600/20 to-transparent" />
                            
                            {/* RANK IMAGE */}
                            <div className="relative h-[72px] w-[72px] flex-shrink-0">
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
                            <div className="flex min-w-0 flex-1 flex-col justify-center gap-2">
                                <div className="flex items-end justify-between">
                                    <div>
                                        <p className="text-[9px] font-bold tracking-[2px] text-blue-600 uppercase mb-0.5">
                                            CURRENT RANK
                                        </p>
                                        <p className="font-['Orbitron'] text-xl font-bold tracking-wider text-blue-500 shadow-blue-500/20 drop-shadow-md">
                                            {user.rank?.name ?? 'NEXUS II'}
                                        </p>
                                        {/* ⭐ STAR */}
                                        <div className="mt-1 flex gap-1">
                                            {Array.from({
                                                length: user.rank?.star ?? 1,
                                            }).map((_, i) => (
                                                <img
                                                    key={i}
                                                    src="https://cdn-icons-png.flaticon.com/512/1828/1828884.png"
                                                    className="h-3 w-3 animate-pulse opacity-80"
                                                    alt="star"
                                                />
                                            ))}
                                        </div>
                                    </div>

                                    <div className="flex flex-col items-end">
                                        <div className="flex items-baseline gap-1">
                                            <span className="font-['Orbitron'] text-xs font-bold text-yellow-500">
                                                {Math.floor(user.total_score % 500)}
                                            </span>
                                            <span className="font-['Orbitron'] text-[10px] text-gray-500">
                                                /500
                                            </span>
                                        </div>
                                        <span className="text-[9px] text-gray-500 font-bold mt-0.5">
                                            {Math.floor(starProgress)}%
                                        </span>
                                    </div>
                                </div>
                                {/* PROGRESS BAR */}
                                <div className="h-[6px] w-full bg-[#1a1f3a] rounded-full overflow-hidden mt-1">
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
                        <div className="mb-8 flex flex-shrink-0 flex-wrap gap-x-8 gap-y-5">
                            <div className="w-full sm:w-[calc(50%-16px)]">
                                <label className="mb-2 block font-['Oxanium'] text-[11px] font-bold tracking-[2px] text-yellow-500">
                                    USERNAME
                                </label>
                                <div className="border border-[#1a1c33] bg-[#000000] px-4 py-2.5 rounded-sm">
                                    <input
                                        placeholder=""
                                        defaultValue={user.name}
                                        className="w-full bg-transparent font-['Oxanium'] text-sm text-gray-300 outline-none"
                                    />
                                </div>
                            </div>

                            <div className="w-full sm:w-[calc(50%-16px)]">
                                <label className="mb-2 block font-['Oxanium'] text-[11px] font-bold tracking-[2px] text-yellow-500">
                                    EMAIL
                                </label>
                                <div className="border border-[#1a1c33] bg-[#000000] px-4 py-2.5 rounded-sm">
                                    <input
                                        placeholder=""
                                        className="w-full bg-transparent font-['Oxanium'] text-sm text-gray-300 outline-none"
                                    />
                                </div>
                            </div>

                            <div className="w-full sm:w-[calc(50%-16px)]">
                                <label className="mb-2 block font-['Oxanium'] text-[11px] font-bold tracking-[2px] text-yellow-500">
                                    SOCIAL UPLINK
                                </label>
                                <div className="border border-[#1a1c33] bg-[#000000] px-4 py-2.5 rounded-sm">
                                    <input
                                        placeholder=""
                                        className="w-full bg-transparent font-['Oxanium'] text-sm text-gray-300 outline-none"
                                    />
                                </div>
                            </div>

                            <div className="w-full sm:w-[calc(50%-16px)]">
                                <label className="mb-2 block font-['Oxanium'] text-[11px] font-bold tracking-[2px] text-yellow-500">
                                    FAV COURSE
                                </label>
                                <div className="border border-[#1a1c33] bg-[#000000] px-4 py-2.5 rounded-sm">
                                    <input
                                        placeholder=""
                                        className="w-full bg-transparent font-['Oxanium'] text-sm text-gray-300 outline-none"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* LAST MISSION */}
                        <p className="mb-3 flex-shrink-0 text-[11px] font-bold tracking-[3px] text-yellow-500">
                            LAST MISSION / COURSE
                        </p>
                        <div className="mb-4 flex-shrink-0">
                            {user.last_course ? (
                                <div className="relative flex flex-col sm:flex-row min-h-[76px] items-start sm:items-center gap-4 border border-[#1a1c33] bg-black p-4 sm:p-2.5 overflow-hidden rounded-sm">
                                    {/* background banner if any */}
                                    <div 
                                        className="absolute inset-0 right-1/4 bg-right bg-no-repeat opacity-50 mix-blend-screen pointer-events-none" 
                                        style={{ backgroundImage: "url('/images/fullstack.png')", backgroundSize: 'cover', backgroundPosition: 'center' }}
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-r from-black via-black/80 to-transparent pointer-events-none" />

                                    {/* BADGE IV */}
                                    <div className="hidden sm:flex relative z-10 h-14 w-14 flex-shrink-0 items-center justify-center bg-black/50 border border-blue-900/50 rounded-full shadow-[0_0_10px_rgba(30,58,138,0.5)]">
                                        <img src="/images/romawi.png" className="h-10 w-10 object-contain drop-shadow-[0_0_5px_rgba(255,255,255,0.3)]" alt="Badge" />
                                    </div>

                                    {/* TEXT */}
                                    <div className="relative z-10 min-w-0 flex-1 pl-0 sm:pl-2 w-full">
                                        <p className="truncate text-[15px] font-bold tracking-wide text-white drop-shadow-md">
                                            {user.last_course.course_name || 'Data Science Mastery'}
                                        </p>
                                        <p className="mt-1 truncate text-xs text-gray-400">
                                            {user.last_course.path_name || 'Level 4'} : {user.last_course.module_name || 'Encryption Protocols'}
                                        </p>
                                    </div>

                                    {/* RESUME BUTTON */}
                                    <Link
                                        href={user.last_course?.url || '#'}
                                        className="relative z-10 sm:mr-2 flex-shrink-0 bg-yellow-400 w-full sm:w-auto text-center px-6 py-2.5 sm:py-2 font-['Orbitron'] text-xs font-bold tracking-widest text-black transition-colors hover:bg-yellow-300 rounded-sm mt-2 sm:mt-0"
                                    >
                                        RESUME
                                    </Link>
                                    
                                    <div className="absolute bottom-0 right-0 left-0 h-0.5 bg-gradient-to-r from-transparent via-[#4B30A5] to-blue-500 shadow-[0_-2px_10px_#2563eb]" />
                                </div>
                            ) : (
                                <div className="border border-[#1a1c33] p-4 text-center font-['Orbitron'] text-xs tracking-widest text-gray-500 bg-black">
                                    NO ACTIVE COURSE
                                </div>
                            )}
                        </div>

                        {/* SAVE CHANGES */}
                        <div className="mt-auto flex justify-end pt-4">
                            <button
                                className="bg-[#4a2ee6] px-8 py-3 font-['Oxanium'] text-[13px] font-bold tracking-widest text-white transition hover:bg-[#5b3df6] rounded-sm"
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
