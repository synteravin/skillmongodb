import { Link, router } from '@inertiajs/react';
import { ArrowLeft, Power, Camera, UserCog, ArrowRightLeft } from 'lucide-react';
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

        total_score: number;

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
            thumbnail?: string;
        };
    };
};

export default function ProfilePage({ user }: Props) {
    const [showImage, setShowImage] = useState(false);

    const progress =
        ((user.exp - user.exp_min) / (user.exp_max - user.exp_min)) * 100;

    const starProgress = ((user.total_score % 500) / 500) * 100;

    return (
        <div className="w-screen h-screen bg-[#f0f2fa] dark:bg-[#0c0c14] text-gray-900 dark:text-white overflow-hidden flex flex-col transition-colors duration-300">

            {/* BG GLOW */}
            <div className="absolute inset-0 pointer-events-none z-0 flex items-center justify-center">
                <div className="w-[700px] h-[400px] rounded-full bg-blue-600 opacity-5 dark:opacity-10 blur-[160px]" />
            </div>

            {/* ── TOOLBAR ── */}
            <div className="relative z-10 flex-shrink-0 flex items-center justify-between px-4 md:px-8 pt-3 pb-2">

                {/* BACK */}
                <Link href="/student/dashboard">
                    <div
                        className="flex items-center gap-2 px-4 py-1.5 border border-[#3B28F6] text-[#3B28F6] dark:text-blue-400 text-[11px] font-['Orbitron'] tracking-widest hover:border-cyan-500 hover:text-cyan-600 dark:hover:border-cyan-400 dark:hover:text-cyan-400 hover:shadow-[0_0_10px_rgba(0,180,220,0.2)] dark:hover:shadow-[0_0_10px_rgba(0,212,255,0.35)] transition-all"
                        style={{ clipPath: 'polygon(8px 0%,100% 0%,100% 100%,0% 100%,0% 8px)' }}
                    >
                        <ArrowLeft size={13} strokeWidth={2.5} />
                        BACK
                    </div>
                </Link>

                {/* SWITCH */}
                <Link
                    href="/student/profile/switch"
                    className="flex items-center justify-center w-9 h-9 border border-[#3B28F6] text-[#3B28F6] hover:border-cyan-500 hover:text-cyan-600 dark:hover:border-cyan-400 dark:hover:text-cyan-400 hover:shadow-[0_0_12px_rgba(0,180,220,0.2)] dark:hover:shadow-[0_0_12px_rgba(0,212,255,0.4)] transition-all"
                    title="Switch Account"
                >
                    <ArrowRightLeft size={16} strokeWidth={2} />
                </Link>
            </div>

            <main className="relative z-10 flex-1 flex flex-col md:flex-row gap-3 md:gap-4 px-4 md:px-8 pb-4 min-h-0 overflow-hidden">

                {/* ══════════ LEFT PANEL ══════════ */}
                <div className="w-full md:w-[260px] lg:w-[280px] xl:w-[295px] 2xl:w-[310px] flex-shrink-0 flex flex-col gap-3">

                    {/* PROFILE CARD */}
                    <div className="h-[320px] border-2 border-[#3B28F6]/60 bg-white dark:bg-[#050619] p-4 md:p-5 flex flex-col items-center text-center shadow-[0_4px_20px_rgba(59,40,246,0.07)] dark:shadow-none">

                        {/* AVATAR */}
                        <div
                            className="relative mb-3 cursor-pointer flex-shrink-0"
                            style={{ width: '130px', height: '148px' }}
                            onClick={() => setShowImage(true)}
                        >
                            <div
                                className="w-full h-full overflow-hidden"
                                style={{ clipPath: "polygon(0% 25%, 50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%)" }}
                            >
                                <img
                                    src={user.avatar ?? "/images/iam.webp"}
                                    className="w-full h-full object-cover"
                                    alt="avatar"
                                />
                            </div>
                            <button className="absolute bottom-2 right-2 bg-[#FACC15] w-7 h-7 rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition z-10">
                                <Camera size={13} strokeWidth={3} className="text-black" />
                            </button>
                        </div>

                        {/* NAME */}
                        <h2 className="text-base font-extrabold font-['Orbitron'] tracking-wide break-words leading-tight mb-1 text-gray-900 dark:text-white">
                            {user.name}
                        </h2>

                        {/* LEVEL */}
                        <p className="text-[#3B28F6] font-extrabold text-sm mb-3">
                            Level {user.level}
                        </p>

                        {/* STATS */}
                        <div className="w-full border-t border-gray-200 dark:border-gray-700 pt-3 flex items-center text-sm">
                            <div className="flex-1 text-center">
                                <p className="text-yellow-500 dark:text-yellow-400 font-bold">{user.courses}</p>
                                <p className="text-gray-400 text-[10px] mt-0.5 tracking-widest">COURSES</p>
                            </div>
                            <div className="w-px h-8 bg-gray-200 dark:bg-gray-700" />
                            <div className="flex-1 text-center">
                                <p className={`font-bold ${user.avg_score >= 90 ? "text-green-500" : user.avg_score >= 75 ? "text-[#3B28F6]" : "text-red-500"}`}>
                                    {user.avg_score}%
                                </p>
                                <p className="text-gray-400 text-[10px] mt-0.5 tracking-widest">AVG SCORE</p>
                            </div>
                            <div className="w-px h-8 bg-gray-200 dark:bg-gray-700" />
                            <div className="flex-1 text-center">
                                <p className="text-gray-800 dark:text-white font-bold">420</p>
                                <p className="text-gray-400 text-[10px] mt-0.5 tracking-widest">HOURS</p>
                            </div>
                        </div>
                    </div>

                    {/* LOGOUT */}
                    <button
                        onClick={() => router.post('/logout')}
                        className="mt-auto w-full border-2 border-[#3B28F6] bg-white dark:bg-[#050619] py-2.5 text-red-500 hover:text-red-400 hover:shadow-[0_0_12px_rgba(239,68,68,0.2)] dark:hover:shadow-[0_0_12px_rgba(239,68,68,0.3)] transition font-bold font-['Orbitron'] text-sm flex items-center justify-center gap-2"
                    >
                        <Power size={16} strokeWidth={3} />
                        SYSTEM LOG OUT
                    </button>
                </div>

                {/* ══════════ RIGHT PANEL ══════════ */}
                <div className="flex-1 flex flex-col gap-2 min-h-0 min-w-0">

                    {/* MASTERY LEVEL */}
                    <div className="flex-shrink-0 border-2 border-[#3B28F6] bg-white dark:bg-[#090915] p-4 shadow-[0_2px_16px_rgba(59,40,246,0.07)] dark:shadow-[0_0_20px_rgba(59,40,246,0.12)]">
                        <div className="flex items-center gap-4">

                            {/* CIRCLE */}
                            <div
                                className="w-[58px] h-[58px] flex-shrink-0 rounded-full border-[4px] border-[#3B28F6] flex items-center justify-center font-['Orbitron'] text-2xl font-black text-gray-900 dark:text-white"
                                style={{ boxShadow: '0 0 18px rgba(59,40,246,0.3), inset 0 0 12px rgba(59,40,246,0.08)' }}
                            >
                                {user.level}
                            </div>

                            <div className="flex-1 min-w-0">
                                <div className="flex items-baseline justify-between">
                                    <p className="font-['Orbitron'] text-lg xl:text-xl font-bold tracking-widest text-gray-900 dark:text-gray-100 leading-none">
                                        MASTERY LEVEL
                                    </p>
                                    <span className="font-['Orbitron'] text-xs text-yellow-500 dark:text-yellow-400 flex-shrink-0 ml-2">
                                        {user.exp}<span className="text-gray-400 dark:text-gray-500">/{user.exp_max}</span>
                                    </span>
                                </div>

                                {/* EXP BAR */}
                                <div className="w-full h-2.5 bg-gray-100 dark:bg-[#0f1235] overflow-hidden mt-2">
                                    <div
                                        className="h-full bg-gradient-to-r from-blue-500 via-purple-500 to-yellow-400 transition-all duration-700"
                                        style={{ width: `${Math.min(progress, 100)}%` }}
                                    />
                                </div>

                                {/* ONLINE */}
                                <div className="flex justify-end items-center gap-1 mt-1.5">
                                    <span className="w-1.5 h-1.5 rounded-full bg-green-500 dark:bg-green-400 shadow-[0_0_4px_#4ade80]" />
                                    <span className="font-['Orbitron'] text-[9px] text-green-600 dark:text-green-400 tracking-widest">ONLINE</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* OPERATOR DATA */}
                    <div className="relative flex-1 flex flex-col min-h-0 min-w-0 overflow-hidden border-2 border-[#3B28F6] bg-white dark:bg-[#090915] p-1 md:p-5 lg:p-5 xl:p-5 shadow-[0_2px_16px_rgba(59,40,246,0.07)] dark:shadow-[0_0_20px_rgba(59,40,246,0.12)]">

                        {/* top glow line */}
                        <div
                            className="absolute top-0 left-0 right-0 h-px"
                            style={{ background: 'linear-gradient(90deg,transparent,#3B28F6,#00e5ff,#3B28F6,transparent)' }}
                        />

                        {/* TITLE */}
                        <h3 className="flex-shrink-0 font-['Orbitron'] text-[#0070b8] dark:text-[#00d4ff] text-sm md:text-base xl:text-lg font-bold tracking-[3px] mb-1 md:mb-1 flex items-center gap-2">
                            <UserCog size={20} strokeWidth={2} />
                            OPERATOR DATA
                        </h3>

                        {/* CONTENT BODY */}
                        <div className="flex-1 overflow-y-auto md:overflow-hidden pr-1 md:pr-0 flex flex-col justify-between gap-2 xl:gap-2">

                            {/* RANK CARD */}
                            <div className="relative flex flex-col sm:flex-row items-start sm:items-center gap-3 rounded-lg border border-[#3B28F6]/25 dark:border-[#3B28F6]/60 bg-[#3B28F6]/[0.04] dark:bg-[#3B28F6]/5 p-2.5 md:p-2 xl:p-8 overflow-hidden">

                                <div className="w-[48px] h-[48px] xl:w-[52px] xl:h-[52px] flex-shrink-0">
                                    <svg viewBox="0 0 80 80" className="w-full h-full">
                                        <defs>
                                            <clipPath id="rankHexClip">
                                                <polygon points="40,4 74,22 74,58 40,76 6,58 6,22" />
                                            </clipPath>
                                        </defs>
                                        <image
                                            href={user.rank?.image ?? '/images/romawi.png'}
                                            x="0" y="10" width="80" height="80"
                                            preserveAspectRatio="xMidYMid slice"
                                            clipPath="url(#rankHexClip)"
                                        />
                                        <polygon
                                            points="40,4 74,22 74,58 40,76 6,58 6,22"
                                            fill="none" stroke="#FACC15" strokeWidth="1.5"
                                        />
                                    </svg>
                                </div>

                                {/* RANK INFO */}
                                <div className="flex min-w-0 flex-1 flex-col justify-center gap-1 xl:gap-1.5 w-full text-center sm:text-left">
                                    <div className="flex flex-col sm:flex-row items-center sm:items-end justify-between gap-1 sm:gap-0">
                                        <div className="flex flex-col items-center sm:items-start">
                                            <p className="text-[7px] xl:text-[8px] font-bold tracking-[2px] text-[#3B28F6]/60 dark:text-blue-600 uppercase mb-0.5 leading-none">
                                                CURRENT RANK
                                            </p>
                                            <p className="font-['Orbitron'] text-sm xl:text-base font-bold tracking-wider text-[#3B28F6] dark:text-blue-400 drop-shadow-md leading-none">
                                                {user.rank?.name ?? 'NEXUS II'}
                                            </p>
                                            <div className="mt-0.5 flex gap-0.5 xl:gap-1">
                                                {Array.from({ length: user.rank?.star ?? 1 }).map((_, i) => (
                                                    <img
                                                        key={i}
                                                        src="https://cdn-icons-png.flaticon.com/512/1828/1828884.png"
                                                        className="h-3 w-3 xl:h-2.5 xl:w-2.5 opacity-80 animate-pulse"
                                                        alt="star"
                                                    />
                                                ))}
                                            </div>
                                        </div>

                                        <div className="text-right">
                                            <div className="font-['Orbitron'] text-[10px] text-yellow-500 dark:text-yellow-400">
                                                {Math.floor(user.total_score % 500)}
                                                <span className="text-gray-400 dark:text-gray-600">/500</span>
                                            </div>
                                            <p className="text-[9px] text-gray-400 dark:text-gray-500 mt-1">
                                                {Math.floor(starProgress)}%
                                            </p>
                                        </div>
                                    </div>

                                    {/* PROGRESS */}
                                    <div className="w-full h-1.5 bg-gray-100 dark:bg-[#0f1235] border border-gray-200 dark:border-[#1a1f3a] rounded-sm overflow-hidden mt-2">
                                        <div
                                            className="h-full rounded-sm transition-all duration-700"
                                            style={{
                                                width: `${Math.min(starProgress, 100)}%`,
                                                background: 'linear-gradient(90deg,#00bfff,#00e5ff)',
                                                boxShadow: '0 0 6px #00d4ff',
                                            }}
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* FIELDS */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-2 md:gap-y-3 xl:gap-y-4">
                                <div className="flex flex-col">
                                    <label className="block text-[9px] text-yellow-600 dark:text-yellow-400 tracking-[2px] mb-1">USERNAME</label>
                                    <input
                                        defaultValue={user.name}
                                        className="w-full bg-gray-50 dark:bg-[#050510] border border-[#3B28F6]/30 dark:border-[#1e2a6e] text-gray-700 dark:text-gray-400 px-3 py-1.5 md:py-2 xl:py-3 font-['Oxanium'] text-sm xl:text-base tracking-wide outline-none focus:border-[#3B28F6] focus:shadow-[0_0_8px_rgba(59,40,246,0.2)] transition-all"
                                    />
                                </div>

                                <div className="flex flex-col">
                                    <label className="block text-[9px] text-yellow-600 dark:text-yellow-400 tracking-[2px] mb-1">EMAIL</label>
                                    <input
                                        placeholder=""
                                        className="w-full bg-gray-50 dark:bg-[#050510] border border-[#3B28F6]/30 dark:border-[#1e2a6e] text-gray-700 dark:text-gray-400 px-3 py-1.5 md:py-2 xl:py-3 font-['Oxanium'] text-sm xl:text-base tracking-wide outline-none focus:border-[#3B28F6] focus:shadow-[0_0_8px_rgba(59,40,246,0.2)] transition-all"
                                    />
                                </div>

                                <div className="flex flex-col">
                                    <label className="block text-[9px] text-yellow-600 dark:text-yellow-400 tracking-[2px] mb-1">SOCIAL UPLINK</label>
                                    <input
                                        placeholder=""
                                        className="w-full bg-gray-50 dark:bg-[#050510] border border-[#3B28F6]/30 dark:border-[#1e2a6e] text-gray-700 dark:text-gray-400 px-3 py-1.5 md:py-2 xl:py-3 font-['Oxanium'] text-sm xl:text-base tracking-wide outline-none focus:border-[#3B28F6] focus:shadow-[0_0_8px_rgba(59,40,246,0.2)] transition-all"
                                    />
                                </div>

                                <div className="flex flex-col">
                                    <label className="block text-[9px] text-yellow-600 dark:text-yellow-400 tracking-[2px] mb-1">FAV COURSE</label>
                                    <input
                                        placeholder=""
                                        className="w-full bg-gray-50 dark:bg-[#050510] border border-[#3B28F6]/30 dark:border-[#1e2a6e] text-gray-700 dark:text-gray-400 px-3 py-1.5 md:py-2 xl:py-3 font-['Oxanium'] text-sm xl:text-base tracking-wide outline-none focus:border-[#3B28F6] focus:shadow-[0_0_8px_rgba(59,40,246,0.2)] transition-all"
                                    />
                                </div>
                            </div>

                            {/* LAST MISSION */}
                            <div className="flex flex-col">
                                <p className="text-[9px] text-yellow-600 dark:text-yellow-400 tracking-[3px] mb-1">
                                    LAST MISSION / COURSE
                                </p>
                                {user.last_course ? (
                                    <div className="border border-[#3B28F6]/25 dark:border-[#3B28F6]/40 bg-blue-50/40 dark:bg-[rgba(0,0,20,0.5)] flex items-center gap-3 p-2 md:p-2.5 xl:p-3">
                                        <div
                                            className="w-10 h-10 xl:w-12 xl:h-12 flex-shrink-0 flex items-center justify-center border border-[#3B28F6] bg-gradient-to-br from-[#eef0ff] to-[#e0e4ff] dark:from-[#0a0a2a] dark:to-[#1a1040]"
                                        >
                                            <img src="/images/romawi.webp" className="h-6 w-6 xl:h-8 xl:w-8 object-contain" alt="Badge" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-xs md:text-sm xl:text-base font-bold text-gray-800 dark:text-[#e0e8ff] tracking-wide truncate">
                                                {user.last_course.course_name || 'Data Science Mastery'}
                                            </p>
                                            <p className="text-[9px] md:text-[10px] xl:text-xs text-gray-400 dark:text-gray-500 mt-0.5 truncate">
                                                {user.last_course.path_name || 'Level 4'} • {user.last_course.module_name || 'Encryption Protocols'}
                                            </p>
                                        </div>
                                        <Link
                                            href={user.last_course?.url || '#'}
                                            className="bg-[#3B28F6] dark:bg-yellow-400 text-white dark:text-black px-4 py-1.5 xl:px-6 xl:py-2 font-['Orbitron'] text-[10px] md:text-xs font-bold tracking-wide hover:opacity-90 transition-all"
                                        >
                                            RESUME
                                        </Link>
                                    </div>
                                ) : (
                                    <div className="border border-[#3B28F6]/25 dark:border-[#3B28F6]/40 p-2 md:p-3 text-center text-gray-400 dark:text-gray-600 text-xs font-['Orbitron'] tracking-widest uppercase">
                                        NO ACTIVE COURSE
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* SAVE BUTTON */}
                        <div className="flex justify-end pt-2 md:pt-3 xl:pt-4 flex-shrink-0 mt-auto">
                            <button
                                className="font-['Orbitron'] text-xs xl:text-sm font-bold tracking-widest text-white px-8 xl:px-12 py-2 md:py-2.5 xl:py-3 transition-all hover:shadow-[0_0_24px_rgba(59,40,246,0.7)]"
                                style={{
                                    background: 'linear-gradient(90deg,#3B28F6,#1a10b0)',
                                    clipPath: 'polygon(12px 0%,100% 0%,calc(100% - 12px) 100%,0% 100%)',
                                    boxShadow: '0 0 16px rgba(59,40,246,0.35)',
                                }}
                            >
                                SAVE CHANGES
                            </button>
                        </div>
                    </div>
                </div>
            </main>

            {/* MODAL AVATAR */}
            {showImage && (
                <div
                    className="fixed inset-0 bg-black/80 flex items-center justify-center z-50"
                    onClick={() => setShowImage(false)}
                >
                    <img
                        src={user.avatar ?? "/images/iam.webp"}
                        onClick={(e) => e.stopPropagation()}
                        className="max-w-[90%] max-h-[90%] object-contain"
                        alt="avatar full"
                    />
                </div>
            )}
        </div>
    );
}