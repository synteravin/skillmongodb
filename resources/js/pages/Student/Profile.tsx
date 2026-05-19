import { Link, router, useForm } from '@inertiajs/react';
import {
    ArrowLeft,
    Power,
    Camera,
    UserCog,
    ArrowRightLeft,
    Loader2,
} from 'lucide-react';
import { useState, useRef } from 'react';

type Props = {
    user: {
        name: string;
        email: string;
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

    const { data, setData, post, processing, errors } = useForm({
        name: user.name,
        email: user.email,
        avatar: null as File | null,
    });

    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleAvatarClick = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setData('avatar', e.target.files[0]);
        }
    };

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/student/profile', {
            preserveScroll: true,
        });
    };

    const progress =
        ((user.exp - user.exp_min) / (user.exp_max - user.exp_min)) * 100;

    const starProgress = ((user.total_score % 500) / 500) * 100;

    return (
        <div className="flex h-screen w-screen flex-col overflow-hidden bg-[#f0f2fa] text-gray-900 transition-colors duration-300 dark:bg-[#0c0c14] dark:text-white">
            {/* BG GLOW */}
            <div className="pointer-events-none absolute inset-0 z-0 flex items-center justify-center">
                <div className="h-[400px] w-[700px] rounded-full bg-blue-600 opacity-5 blur-[160px] dark:opacity-10" />
            </div>

            {/* ── TOOLBAR ── */}
            <div className="relative z-10 flex flex-shrink-0 items-center justify-between px-4 pt-3 pb-2 md:px-8">
                {/* BACK */}
                <Link href="/student/dashboard">
                    <div
                        className="flex items-center gap-2 border border-[#3B28F6] px-4 py-1.5 font-['Orbitron'] text-[11px] tracking-widest text-[#3B28F6] transition-all hover:border-cyan-500 hover:text-cyan-600 hover:shadow-[0_0_10px_rgba(0,180,220,0.2)] dark:text-blue-400 dark:hover:border-cyan-400 dark:hover:text-cyan-400 dark:hover:shadow-[0_0_10px_rgba(0,212,255,0.35)]"
                        style={{
                            clipPath:
                                'polygon(8px 0%,100% 0%,100% 100%,0% 100%,0% 8px)',
                        }}
                    >
                        <ArrowLeft size={13} strokeWidth={2.5} />
                        BACK
                    </div>
                </Link>

                {/* SWITCH */}
                <Link
                    href="/student/profile/switch"
                    className="flex h-9 w-9 items-center justify-center border border-[#3B28F6] text-[#3B28F6] transition-all hover:border-cyan-500 hover:text-cyan-600 hover:shadow-[0_0_12px_rgba(0,180,220,0.2)] dark:hover:border-cyan-400 dark:hover:text-cyan-400 dark:hover:shadow-[0_0_12px_rgba(0,212,255,0.4)]"
                    title="Switch Account"
                >
                    <ArrowRightLeft size={16} strokeWidth={2} />
                </Link>
            </div>

            <form
                onSubmit={submit}
                className="relative z-10 flex min-h-0 flex-1 flex-col gap-3 overflow-hidden px-4 pb-4 md:flex-row md:gap-4 md:px-8"
            >
                {/* ══════════ LEFT PANEL ══════════ */}
                <div className="flex w-full flex-shrink-0 flex-col gap-3 md:w-[260px] lg:w-[280px] xl:w-[295px] 2xl:w-[310px]">
                    {/* PROFILE CARD */}
                    <div className="flex h-[320px] flex-col items-center border-2 border-[#3B28F6]/60 bg-white p-4 text-center shadow-[0_4px_20px_rgba(59,40,246,0.07)] md:p-5 dark:bg-[#050619] dark:shadow-none">
                        {/* AVATAR */}
                        <div
                            className="relative mb-3 flex-shrink-0"
                            style={{ width: '130px', height: '148px' }}
                        >
                            <div
                                className="h-full w-full cursor-pointer overflow-hidden"
                                style={{
                                    clipPath:
                                        'polygon(0% 25%, 50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%)',
                                }}
                                onClick={() => setShowImage(true)}
                            >
                                <img
                                    src={
                                        data.avatar
                                            ? URL.createObjectURL(data.avatar)
                                            : (user.avatar ??
                                              '/images/aizen.jpeg')
                                    }
                                    className="h-full w-full object-cover"
                                    alt="avatar"
                                />
                            </div>
                            <button
                                type="button"
                                onClick={handleAvatarClick}
                                className="absolute right-2 bottom-2 z-10 flex h-7 w-7 items-center justify-center rounded-full bg-[#FACC15] shadow-lg transition hover:scale-110"
                            >
                                <Camera
                                    size={13}
                                    strokeWidth={3}
                                    className="text-black"
                                />
                            </button>
                            <input
                                type="file"
                                ref={fileInputRef}
                                className="hidden"
                                accept="image/*"
                                onChange={handleFileChange}
                            />
                        </div>

                        {/* NAME */}
                        <h2 className="mb-1 font-['Orbitron'] text-base leading-tight font-extrabold tracking-wide break-words text-gray-900 dark:text-white">
                            {user.name}
                        </h2>

                        {/* LEVEL */}
                        <p className="mb-3 text-sm font-extrabold text-[#3B28F6]">
                            Level {user.level}
                        </p>

                        {/* STATS */}
                        <div className="flex w-full items-center border-t border-gray-200 pt-3 text-sm dark:border-gray-700">
                            <div className="flex-1 text-center">
                                <p className="font-bold text-yellow-500 dark:text-yellow-400">
                                    {user.courses}
                                </p>
                                <p className="mt-0.5 text-[10px] tracking-widest text-gray-400">
                                    COURSES
                                </p>
                            </div>
                            <div className="h-8 w-px bg-gray-200 dark:bg-gray-700" />
                            <div className="flex-1 text-center">
                                <p
                                    className={`font-bold ${user.avg_score >= 90 ? 'text-green-500' : user.avg_score >= 75 ? 'text-[#3B28F6]' : 'text-red-500'}`}
                                >
                                    {user.avg_score}%
                                </p>
                                <p className="mt-0.5 text-[10px] tracking-widest text-gray-400">
                                    AVG SCORE
                                </p>
                            </div>
                            <div className="h-8 w-px bg-gray-200 dark:bg-gray-700" />
                            <div className="flex-1 text-center">
                                <p className="font-bold text-gray-800 dark:text-white">
                                    420
                                </p>
                                <p className="mt-0.5 text-[10px] tracking-widest text-gray-400">
                                    HOURS
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* LOGOUT */}
                    <button
                        type="button"
                        onClick={() => router.post('/logout')}
                        className="mt-auto flex w-full items-center justify-center gap-2 border-2 border-[#3B28F6] bg-white py-2.5 font-['Orbitron'] text-sm font-bold text-red-500 transition hover:text-red-400 hover:shadow-[0_0_12px_rgba(239,68,68,0.2)] dark:bg-[#050619] dark:hover:shadow-[0_0_12px_rgba(239,68,68,0.3)]"
                    >
                        <Power size={16} strokeWidth={3} />
                        SYSTEM LOG OUT
                    </button>
                </div>

                {/* ══════════ RIGHT PANEL ══════════ */}
                <div className="flex min-h-0 min-w-0 flex-1 flex-col gap-2">
                    {/* MASTERY LEVEL */}
                    <div className="flex-shrink-0 border-2 border-[#3B28F6] bg-white p-4 shadow-[0_2px_16px_rgba(59,40,246,0.07)] dark:bg-[#090915] dark:shadow-[0_0_20px_rgba(59,40,246,0.12)]">
                        <div className="flex items-center gap-4">
                            {/* CIRCLE */}
                            <div
                                className="flex h-[58px] w-[58px] flex-shrink-0 items-center justify-center rounded-full border-[4px] border-[#3B28F6] font-['Orbitron'] text-2xl font-black text-gray-900 dark:text-white"
                                style={{
                                    boxShadow:
                                        '0 0 18px rgba(59,40,246,0.3), inset 0 0 12px rgba(59,40,246,0.08)',
                                }}
                            >
                                {user.level}
                            </div>

                            <div className="min-w-0 flex-1">
                                <div className="flex items-baseline justify-between">
                                    <p className="font-['Orbitron'] text-lg leading-none font-bold tracking-widest text-gray-900 xl:text-xl dark:text-gray-100">
                                        MASTERY LEVEL
                                    </p>
                                    <span className="ml-2 flex-shrink-0 font-['Orbitron'] text-xs text-yellow-500 dark:text-yellow-400">
                                        {user.exp}
                                        <span className="text-gray-400 dark:text-gray-500">
                                            /{user.exp_max}
                                        </span>
                                    </span>
                                </div>

                                {/* EXP BAR */}
                                <div className="mt-2 h-2.5 w-full overflow-hidden bg-gray-100 dark:bg-[#0f1235]">
                                    <div
                                        className="h-full bg-gradient-to-r from-blue-500 via-purple-500 to-yellow-400 transition-all duration-700"
                                        style={{
                                            width: `${Math.min(progress, 100)}%`,
                                        }}
                                    />
                                </div>

                                {/* ONLINE */}
                                <div className="mt-1.5 flex items-center justify-end gap-1">
                                    <span className="h-1.5 w-1.5 rounded-full bg-green-500 shadow-[0_0_4px_#4ade80] dark:bg-green-400" />
                                    <span className="font-['Orbitron'] text-[9px] tracking-widest text-green-600 dark:text-green-400">
                                        ONLINE
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* OPERATOR DATA */}
                    <div className="relative flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden border-2 border-[#3B28F6] bg-white p-1 shadow-[0_2px_16px_rgba(59,40,246,0.07)] md:p-5 lg:p-5 xl:p-5 dark:bg-[#090915] dark:shadow-[0_0_20px_rgba(59,40,246,0.12)]">
                        {/* top glow line */}
                        <div
                            className="absolute top-0 right-0 left-0 h-px"
                            style={{
                                background:
                                    'linear-gradient(90deg,transparent,#3B28F6,#00e5ff,#3B28F6,transparent)',
                            }}
                        />

                        {/* TITLE */}
                        <h3 className="mb-1 flex flex-shrink-0 items-center gap-2 font-['Orbitron'] text-sm font-bold tracking-[3px] text-[#0070b8] md:mb-1 md:text-base xl:text-lg dark:text-[#00d4ff]">
                            <UserCog size={20} strokeWidth={2} />
                            OPERATOR DATA
                        </h3>

                        {/* CONTENT BODY */}
                        <div className="flex flex-1 flex-col justify-between gap-2 overflow-y-auto pr-1 md:overflow-hidden md:pr-0 xl:gap-2">
                            {/* RANK CARD */}
                            <div className="relative flex flex-col items-start gap-3 overflow-hidden rounded-lg border border-[#3B28F6]/25 bg-[#3B28F6]/[0.04] p-2.5 sm:flex-row sm:items-center md:p-2 xl:p-8 dark:border-[#3B28F6]/60 dark:bg-[#3B28F6]/5">
                                <div className="h-[48px] w-[48px] flex-shrink-0 xl:h-[52px] xl:w-[52px]">
                                    <svg
                                        viewBox="0 0 80 80"
                                        className="h-full w-full"
                                    >
                                        <defs>
                                            <clipPath id="rankHexClip">
                                                <polygon points="40,4 74,22 74,58 40,76 6,58 6,22" />
                                            </clipPath>
                                        </defs>
                                        <image
                                            href={
                                                user.rank?.image ??
                                                '/images/romawi.png'
                                            }
                                            x="0"
                                            y="10"
                                            width="80"
                                            height="80"
                                            preserveAspectRatio="xMidYMid slice"
                                            clipPath="url(#rankHexClip)"
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
                                <div className="flex w-full min-w-0 flex-1 flex-col justify-center gap-1 text-center sm:text-left xl:gap-1.5">
                                    <div className="flex flex-col items-center justify-between gap-1 sm:flex-row sm:items-end sm:gap-0">
                                        <div className="flex flex-col items-center sm:items-start">
                                            <p className="mb-0.5 text-[7px] leading-none font-bold tracking-[2px] text-[#3B28F6]/60 uppercase xl:text-[8px] dark:text-blue-600">
                                                CURRENT RANK
                                            </p>
                                            <p className="font-['Orbitron'] text-sm leading-none font-bold tracking-wider text-[#3B28F6] drop-shadow-md xl:text-base dark:text-blue-400">
                                                {user.rank?.name ?? 'NEXUS II'}
                                            </p>
                                            <div className="mt-0.5 flex gap-0.5 xl:gap-1">
                                                {Array.from({
                                                    length:
                                                        user.rank?.star ?? 1,
                                                }).map((_, i) => (
                                                    <img
                                                        key={i}
                                                        src="https://cdn-icons-png.flaticon.com/512/1828/1828884.png"
                                                        className="h-3 w-3 animate-pulse opacity-80 xl:h-2.5 xl:w-2.5"
                                                        alt="star"
                                                    />
                                                ))}
                                            </div>
                                        </div>

                                        <div className="text-right">
                                            <div className="font-['Orbitron'] text-[10px] text-yellow-500 dark:text-yellow-400">
                                                {Math.floor(
                                                    user.total_score % 500,
                                                )}
                                                <span className="text-gray-400 dark:text-gray-600">
                                                    /500
                                                </span>
                                            </div>
                                            <p className="mt-1 text-[9px] text-gray-400 dark:text-gray-500">
                                                {Math.floor(starProgress)}%
                                            </p>
                                        </div>
                                    </div>

                                    {/* PROGRESS */}
                                    <div className="mt-2 h-1.5 w-full overflow-hidden rounded-sm border border-gray-200 bg-gray-100 dark:border-[#1a1f3a] dark:bg-[#0f1235]">
                                        <div
                                            className="h-full rounded-sm transition-all duration-700"
                                            style={{
                                                width: `${Math.min(starProgress, 100)}%`,
                                                background:
                                                    'linear-gradient(90deg,#00bfff,#00e5ff)',
                                                boxShadow: '0 0 6px #00d4ff',
                                            }}
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* FIELDS */}
                            <div className="grid grid-cols-1 gap-x-4 gap-y-2 sm:grid-cols-2 md:gap-y-3 xl:gap-y-4">
                                <div className="flex flex-col">
                                    <label className="mb-1 block text-[9px] tracking-[2px] text-yellow-600 dark:text-yellow-400">
                                        USERNAME
                                    </label>
                                    <input
                                        type="text"
                                        value={data.name}
                                        onChange={(e) =>
                                            setData('name', e.target.value)
                                        }
                                        className="w-full border border-[#3B28F6]/30 bg-gray-50 px-3 py-1.5 font-['Oxanium'] text-sm tracking-wide text-gray-700 transition-all outline-none focus:border-[#3B28F6] focus:shadow-[0_0_8px_rgba(59,40,246,0.2)] md:py-2 xl:py-3 xl:text-base dark:border-[#1e2a6e] dark:bg-[#050510] dark:text-gray-400"
                                    />
                                    {errors.name && (
                                        <span className="mt-1 text-xs text-red-500">
                                            {errors.name}
                                        </span>
                                    )}
                                </div>

                                <div className="flex flex-col">
                                    <label className="mb-1 block text-[9px] tracking-[2px] text-yellow-600 dark:text-yellow-400">
                                        EMAIL
                                    </label>
                                    <input
                                        type="email"
                                        value={data.email}
                                        onChange={(e) =>
                                            setData('email', e.target.value)
                                        }
                                        placeholder=""
                                        className="w-full border border-[#3B28F6]/30 bg-gray-50 px-3 py-1.5 font-['Oxanium'] text-sm tracking-wide text-gray-700 transition-all outline-none focus:border-[#3B28F6] focus:shadow-[0_0_8px_rgba(59,40,246,0.2)] md:py-2 xl:py-3 xl:text-base dark:border-[#1e2a6e] dark:bg-[#050510] dark:text-gray-400"
                                    />
                                    {errors.email && (
                                        <span className="mt-1 text-xs text-red-500">
                                            {errors.email}
                                        </span>
                                    )}
                                </div>

                                <div className="flex flex-col">
                                    <label className="mb-1 block text-[9px] tracking-[2px] text-yellow-600 dark:text-yellow-400">
                                        SOCIAL UPLINK
                                    </label>
                                    <input
                                        placeholder=""
                                        className="w-full border border-[#3B28F6]/30 bg-gray-50 px-3 py-1.5 font-['Oxanium'] text-sm tracking-wide text-gray-700 transition-all outline-none focus:border-[#3B28F6] focus:shadow-[0_0_8px_rgba(59,40,246,0.2)] md:py-2 xl:py-3 xl:text-base dark:border-[#1e2a6e] dark:bg-[#050510] dark:text-gray-400"
                                    />
                                </div>

                                <div className="flex flex-col">
                                    <label className="mb-1 block text-[9px] tracking-[2px] text-yellow-600 dark:text-yellow-400">
                                        FAV COURSE
                                    </label>
                                    <input
                                        placeholder=""
                                        className="w-full border border-[#3B28F6]/30 bg-gray-50 px-3 py-1.5 font-['Oxanium'] text-sm tracking-wide text-gray-700 transition-all outline-none focus:border-[#3B28F6] focus:shadow-[0_0_8px_rgba(59,40,246,0.2)] md:py-2 xl:py-3 xl:text-base dark:border-[#1e2a6e] dark:bg-[#050510] dark:text-gray-400"
                                    />
                                </div>
                            </div>

                            {/* LAST MISSION */}
                            <div className="flex flex-col">
                                <p className="mb-1 text-[9px] tracking-[3px] text-yellow-600 dark:text-yellow-400">
                                    LAST MISSION / COURSE
                                </p>
                                {user.last_course ? (
                                    <div className="flex items-center gap-3 border border-[#3B28F6]/25 bg-blue-50/40 p-2 md:p-2.5 xl:p-3 dark:border-[#3B28F6]/40 dark:bg-[rgba(0,0,20,0.5)]">
                                        <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center border border-[#3B28F6] bg-gradient-to-br from-[#eef0ff] to-[#e0e4ff] xl:h-12 xl:w-12 dark:from-[#0a0a2a] dark:to-[#1a1040]">
                                            <img
                                                src="/images/romawi.webp"
                                                className="h-6 w-6 object-contain xl:h-8 xl:w-8"
                                                alt="Badge"
                                            />
                                        </div>
                                        <div className="min-w-0 flex-1">
                                            <p className="truncate text-xs font-bold tracking-wide text-gray-800 md:text-sm xl:text-base dark:text-[#e0e8ff]">
                                                {user.last_course.course_name ||
                                                    'Data Science Mastery'}
                                            </p>
                                            <p className="mt-0.5 truncate text-[9px] text-gray-400 md:text-[10px] xl:text-xs dark:text-gray-500">
                                                {user.last_course.path_name ||
                                                    'Level 4'}{' '}
                                                •{' '}
                                                {user.last_course.module_name ||
                                                    'Encryption Protocols'}
                                            </p>
                                        </div>
                                        <Link
                                            href={user.last_course?.url || '#'}
                                            className="bg-[#3B28F6] px-4 py-1.5 font-['Orbitron'] text-[10px] font-bold tracking-wide text-white transition-all hover:opacity-90 md:text-xs xl:px-6 xl:py-2 dark:bg-yellow-400 dark:text-black"
                                        >
                                            RESUME
                                        </Link>
                                    </div>
                                ) : (
                                    <div className="border border-[#3B28F6]/25 p-2 text-center font-['Orbitron'] text-xs tracking-widest text-gray-400 uppercase md:p-3 dark:border-[#3B28F6]/40 dark:text-gray-600">
                                        NO ACTIVE COURSE
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* SAVE BUTTON */}
                        <div className="mt-auto flex flex-shrink-0 justify-end pt-2 md:pt-3 xl:pt-4">
                            <button
                                type="submit"
                                disabled={processing}
                                className="flex items-center justify-center gap-2 px-8 py-2 font-['Orbitron'] text-xs font-bold tracking-widest text-white transition-all hover:shadow-[0_0_24px_rgba(59,40,246,0.7)] disabled:cursor-not-allowed disabled:opacity-50 md:py-2.5 xl:px-12 xl:py-3 xl:text-sm"
                                style={{
                                    background:
                                        'linear-gradient(90deg,#3B28F6,#1a10b0)',
                                    clipPath:
                                        'polygon(12px 0%,100% 0%,calc(100% - 12px) 100%,0% 100%)',
                                    boxShadow: '0 0 16px rgba(59,40,246,0.35)',
                                }}
                            >
                                {processing ? (
                                    <Loader2
                                        className="animate-spin"
                                        size={18}
                                    />
                                ) : null}
                                SAVE CHANGES
                            </button>
                        </div>
                    </div>
                </div>
            </form>

            {/* MODAL AVATAR */}
            {showImage && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/80"
                    onClick={() => setShowImage(false)}
                >
                    <img
                        src={user.avatar ?? '/images/iam.webp'}
                        onClick={(e) => e.stopPropagation()}
                        className="max-h-[90%] max-w-[90%] object-contain"
                        alt="avatar full"
                    />
                </div>
            )}
        </div>
    );
}
