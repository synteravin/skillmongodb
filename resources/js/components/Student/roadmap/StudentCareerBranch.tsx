import { useState } from 'react';
import StudentModuleNode from './StudentModuleNode';

import { User } from 'lucide-react';

import { router, Link } from '@inertiajs/react';

type Props = {
    group: any;
    progress: any;
    badges?: any[];
    courseId?: string;
    basicCompleted: boolean;
};

export default function StudentCareerBranch({
    group,
    progress,
    badges = [],
    courseId,
    basicCompleted,
}: Props) {
    const hasChosenPath = !!progress.selected_path_id;
    const isChosen = group.paths.some(
        (p: any) => p._id === progress.selected_path_id,
    );
    const isOtherChosen = progress.selected_path_id && !isChosen;
    const isCompleted = group.is_completed;

    const totalModules = group.paths.reduce(
        (sum: number, p: any) => sum + (p.modules?.length || 0),
        0,
    );

    const [loading, setLoading] = useState(false);

    // ✅ ambil first path dengan aman
    const firstPath = group.paths?.[0];

    // ✅ validasi bisa start atau tidak
    const canStart = firstPath?.modules?.length > 0;

    const handleStart = (firstPath: any) => {
        if (!firstPath) {
            console.error('Path tidak ditemukan');
            return;
        }

        if (!firstPath?.modules?.[0]?._id) {
            console.error('Path tidak punya module');
            return;
        }

        if (loading) return;

        setLoading(true);

        router.post(
            `/student/select-career/${firstPath._id}`,
            {},
            {
                onSuccess: () => {
                    router.visit(
                        `/student/learn/${courseId}/${firstPath._id}/${firstPath.modules[0]._id}`,
                    );
                },
                onFinish: () => setLoading(false),
            },
        );
    };

    return (
        <div className="text-sans relative flex w-full flex-col items-center px-8 sm:px-4">

            {/* ═══════════════════════════════════════════════
                CARD UTAMA
                - Tinggi FIXED agar semua card seragam
                  (mengikuti card judul 2 baris di referensi)
                - Light: bg putih / biru tipis saat locked
                - Dark : bg #050619 tetap
                - TIDAK ada opacity/grayscale wrapper
            ════════════════════════════════════════════════ */}
            <div
                className={`relative mb-0 flex w-full flex-col overflow-hidden rounded-xl border-2 shadow-lg transition-all
                    ${isCompleted
                        ? 'border-emerald-400 shadow-[0_0_40px_rgba(52,211,153,0.35)]'
                        : isChosen
                            ? 'border-blue-400 shadow-[0_0_40px_rgba(96,165,250,0.35)]'
                            : !basicCompleted || isOtherChosen
                                /* locked light: border biru tipis; dark: tetap ungu */
                                ? 'border-blue-200 dark:border-[#3B28F6] shadow-[0_0_0_1px_rgba(147,197,253,0.4)] dark:shadow-[0_0_35px_6px_rgba(59,40,246,0.3)]'
                                : 'border-[#3B28F6] shadow-[0_0_35px_6px_rgba(59,40,246,0.5)]'
                    }`}
            >
                {/* TOP ACCENT LINE */}
                <div
                    className={`absolute top-0 right-0 left-0 z-10 h-[3px] bg-gradient-to-r from-transparent
                        ${isCompleted ? 'via-emerald-500' : 'via-blue-500'}
                        to-transparent`}
                />

                {/* ── INNER CARD ── */}
                <div
                    className={`relative flex w-full flex-col rounded-xl p-5
                        dark:bg-[#050619]
                        ${!basicCompleted || isOtherChosen
                            ? 'bg-[#f0f7ff]'           /* light locked: biru sangat tipis */
                            : isCompleted
                                ? 'bg-emerald-50/60 dark:bg-[#050619]'
                                : 'bg-white dark:bg-[#050619]'
                        }`}
                >
                    {/* ── LOCK ICON pojok kanan atas (kecil, tidak nutupin konten) ── */}
                    {(!basicCompleted || isOtherChosen) && (
                        <div className="absolute top-3 right-3 z-30
                                        flex h-7 w-7 items-center justify-center
                                        rounded-full
                                        bg-white/90 dark:bg-[#0b1333]/90
                                        border border-blue-200 dark:border-[#1e3a8a]
                                        shadow-sm">
                            <svg viewBox="0 0 24 24" fill="none"
                                className="w-3.5 h-3.5 text-blue-400 dark:text-[#1e3a8a]">
                                <rect x="5" y="11" width="14" height="10" rx="2.5"
                                    fill="currentColor" fillOpacity="0.15"
                                    stroke="currentColor" strokeWidth="1.8" />
                                <path d="M8 11V7a4 4 0 0 1 8 0v4"
                                    stroke="currentColor" strokeWidth="1.8"
                                    strokeLinecap="round" />
                                <circle cx="12" cy="16" r="1.5"
                                    fill="currentColor" fillOpacity="0.9" />
                            </svg>
                        </div>
                    )}

                    {/* ── THUMBNAIL ── */}
                    <div className="mb-4 flex justify-center">
                        <div className="relative">
                            <div className={`absolute inset-0 scale-110 rounded-full blur-md
                                ${isCompleted ? 'bg-emerald-500/20' : 'bg-blue-500/20'}`}
                            />
                            <div className={`relative flex h-20 w-20 items-center justify-center
                                overflow-hidden rounded-full border-2
                                ${isCompleted
                                    ? 'border-emerald-500 shadow-[0_0_20px_rgba(52,211,153,0.4)]'
                                    : !basicCompleted || isOtherChosen
                                        ? 'border-blue-200 shadow-[0_0_12px_rgba(147,197,253,0.3)] dark:border-blue-900 dark:shadow-none'
                                        : 'border-blue-500 shadow-[0_0_20px_rgba(59,130,246,0.4)]'
                                }
                                bg-blue-50 dark:bg-[#0b1333]`}
                            >
                                {group.thumbnail ? (
                                    <img
                                        src={group.thumbnail}
                                        className="h-full w-full object-cover"
                                        alt={group.name}
                                    />
                                ) : (
                                    <svg viewBox="0 0 24 24" fill="none"
                                        className={`h-9 w-9
                                            ${!basicCompleted || isOtherChosen
                                                ? 'text-blue-300 dark:text-blue-900'
                                                : 'text-blue-400 dark:text-blue-400'
                                            }`}
                                    >
                                        <path d="M12 2C12 2 7 6 7 13l2 2c0-4 1.5-7 3-9 1.5 2 3 5 3 9l2-2c0-7-5-11-5-11Z"
                                            stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
                                        <path d="M9 15l-2 4 3-1M15 15l2 4-3-1"
                                            stroke="currentColor" strokeWidth="1.5"
                                            strokeLinecap="round" strokeLinejoin="round" />
                                        <circle cx="12" cy="13" r="1.5" fill="currentColor" />
                                    </svg>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* ── TITLE
                        line-clamp-2 + min-height paksa 2 baris
                        agar semua card tingginya sama ── */}
                    <h2
                        className={`mb-2 text-center font-['Orbitron'] text-base font-bold
                            tracking-widest uppercase leading-tight
                            sm:text-lg line-clamp-2
                            /* min-height = 2 baris: 2 × line-height (1.25) × font-size(18px) ≈ 3.5rem */
                            min-h-[3.5rem]
                            ${!basicCompleted || isOtherChosen
                                ? 'text-[#3B82F6] dark:text-white/50'
                                : isCompleted
                                    ? 'text-emerald-700 dark:text-white'
                                    : 'text-gray-900 dark:text-white'
                            }`}
                    >
                        {group.name}
                    </h2>

                    {/* ── DESCRIPTION ── */}
                    <p
                        className={`mb-4 line-clamp-4 px-1 text-center text-[10px]
                            leading-relaxed font-semibold
                            ${!basicCompleted || isOtherChosen
                                ? 'text-[#3B82F6] dark:text-gray-600'
                                : 'text-gray-500 dark:text-gray-400'
                            }`}
                    >
                        A special package to become a professional {group.name}{' '}
                        Developer, starting with modern web development
                        fundamentals and progressing to advanced topics and
                        real-world projects the next
                    </p>

                    {/* ── STATS ── */}
                    <div className="mb-4 flex justify-between gap-2">
                        <div className={`flex flex-1 flex-col items-center justify-center
                            gap-0.5 rounded-lg border p-2 text-center
                            ${!basicCompleted || isOtherChosen
                                ? 'border-blue-100 bg-blue-50/50 dark:border-[#1A2E99]/40 dark:bg-[#020101]'
                                : 'border-[#1A2E99] bg-[#f8faff] dark:bg-[#020101]'
                            }`}
                        >
                            <span className={`block text-[9px] font-semibold tracking-wider uppercase
                                ${!basicCompleted || isOtherChosen
                                    ? 'text-blue-300 dark:text-[#F0E427]/50'
                                    : 'text-[#F0E427] dark:text-[#F0E427]'
                                }`}>
                                Learning Path
                            </span>
                            <span className={`block text-sm font-bold
                                ${!basicCompleted || isOtherChosen
                                    ? 'text-blue-300 dark:text-gray-600'
                                    : 'text-gray-700 dark:text-[#B3B3B3]'
                                }`}>
                                {totalModules} Units
                            </span>
                        </div>
                    </div>

                    {/* ── FOOTER: mentor + button ── */}
                    <div className={`relative z-40 flex items-center justify-between
                        border-t pt-3
                        ${!basicCompleted || isOtherChosen
                            ? 'border-blue-100 dark:border-[#1A2E99]/30'
                            : 'border-blue-100 dark:border-[#1A2E99]/80'
                        }`}
                    >
                        {/* MENTOR */}
                        {group.mentor ? (
                            <Link
                                href={`/student/mentors/${group.mentor._id}`}
                                className="flex max-w-[60%] items-center gap-2 group/mentor cursor-pointer"
                            >
                                {group.mentor.avatar && group.mentor.avatar !== 'null' ? (
                                    <img
                                        src={group.mentor.avatar}
                                        className="h-10 w-10 flex-shrink-0 rounded-full border border-gray-400 object-cover group-hover/mentor:scale-105 group-hover/mentor:border-indigo-400 transition-all shadow-sm"
                                        alt="mentor"
                                    />
                                ) : (
                                    <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center
                                        rounded-full border border-blue-500
                                        bg-gradient-to-br from-blue-500 to-indigo-600 group-hover/mentor:scale-105 group-hover/mentor:border-indigo-400 transition-all">
                                        <span className="text-[11px] font-bold text-white">
                                            {group.mentor.name.charAt(0).toUpperCase()}
                                        </span>
                                    </div>
                                )}
                                <div className="flex flex-col truncate">
                                    <span className={`truncate text-[10px] leading-none font-bold transition-colors
                                        ${!basicCompleted || isOtherChosen
                                            ? 'text-blue-400 dark:text-gray-500'
                                            : 'text-gray-900 dark:text-[#F0F0F0] group-hover/mentor:text-indigo-500 dark:group-hover/mentor:text-[#00d4ff]'
                                        }`}>
                                        {group.mentor.name}
                                    </span>
                                    <span className={`mt-0.5 truncate text-[8px]
                                        ${!basicCompleted || isOtherChosen
                                            ? 'text-blue-300/70 dark:text-gray-600'
                                            : 'text-gray-400 dark:text-gray-450'
                                        }`}>
                                        {group.name} Professional
                                    </span>
                                </div>
                            </Link>
                        ) : (
                            <div className="flex max-w-[60%] items-center gap-2">
                                <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center
                                    rounded-full border border-blue-200 dark:border-blue-900
                                    bg-slate-200 dark:bg-slate-800">
                                    <User className="h-5 w-5 text-gray-400 dark:text-gray-600" />
                                </div>
                                <div className="flex flex-col truncate">
                                    <span className="truncate text-[10px] leading-none font-bold text-gray-400 dark:text-gray-600">
                                        No Mentor
                                    </span>
                                    <span className="mt-0.5 truncate text-[8px] text-gray-400 dark:text-gray-600">
                                        Unassigned
                                    </span>
                                </div>
                            </div>
                        )}

                        {/* START / COMPLETED BUTTON */}
                        {isCompleted ? (
                            <button
                                disabled
                                className="flex-shrink-0 rounded-xl border-2 border-emerald-500
                                    bg-emerald-500/10 px-4 py-1
                                    font-['Orbitron'] text-[12px] font-bold tracking-widest uppercase
                                    text-emerald-400 shadow-[0_0_8px_1px_rgba(52,211,153,0.3)]"
                            >
                                Finish
                            </button>
                        ) : (
                            <button
                                onClick={() => handleStart(firstPath)}
                                disabled={!basicCompleted || isOtherChosen}
                                className={`flex-shrink-0 rounded-xl border-2 px-4 py-1
                                    font-['Orbitron'] text-[12px] font-bold tracking-widest uppercase
                                    transition-all duration-300
                                    ${!basicCompleted || isOtherChosen
                                        ? 'cursor-not-allowed border-sky-200 bg-sky-50 text-blue-500 shadow-sm dark:border-gray-700 dark:bg-gray-900 dark:text-gray-500 dark:shadow-none'
                                        : `border-sky-300 bg-sky-50 text-sky-700
                                        shadow-[0_3px_10px_rgba(56,189,248,0.22),inset_0_0_5px_rgba(255,255,255,0.7)]
                                        hover:border-sky-400 hover:bg-sky-100 hover:text-sky-800
                                        hover:shadow-[0_5px_12px_rgba(56,189,248,0.28),inset_0_0_6px_rgba(255,255,255,0.8)]
                                        
                                        dark:border-[#3B28F6] dark:bg-[#05080f] dark:text-white
                                        dark:shadow-[0_3px_10px_rgba(59,40,246,0.35),inset_0_0_5px_rgba(59,40,246,0.12)]
                                        dark:hover:border-[#5a47ff] dark:hover:bg-[#080d1a]
                                        dark:hover:shadow-[0_5px_12px_rgba(59,40,246,0.45),inset_0_0_6px_rgba(59,40,246,0.16)]`
                                    }`}
                            >
                                Start
                            </button>
                        )}
                    </div>
                </div>
            </div>

            {/* ── CONNECTOR LINE bawah card ── */}
            <div className={`h-8 w-[2px]
                bg-blue-500 dark:bg-gray-500
                ${isOtherChosen ? 'opacity-30' : ''}`}
            />

            {/* ── PATHS LIST ── */}
            <div className={`flex w-full flex-col items-center
                ${!basicCompleted || isOtherChosen ? 'opacity-60' : ''}`}
            /* ↑ grayscale dihapus, cukup opacity ringan */
            >
                <div className={`h-8 w-[2px] bg-blue-200 dark:bg-gray-500
                    ${isOtherChosen ? 'opacity-30' : ''}`}
                />

                <div className={`flex w-full flex-col items-center
                    ${(!basicCompleted || (!hasChosenPath && !isCompleted) || isOtherChosen)
                        ? 'opacity-60'   /* hanya opacity, tidak grayscale */
                        : ''
                    }`}
                >
                    {group.paths.map((p: any, idx: number) => {
                        const done = progress.completed_paths?.includes(String(p._id));
                        const badge = badges?.find(
                            (b: any) => parseInt(b.order?.toString().trim()) === idx + 1,
                        );

                        let locked = false;
                        if (!basicCompleted) locked = true;
                        if (isOtherChosen) locked = true;
                        if (!basicCompleted) locked = true;
                        if (!hasChosenPath && !isCompleted) locked = true;
                        if (hasChosenPath && isOtherChosen) locked = true;

                        if (!locked && idx > 0) {
                            const prevPath = group.paths[idx - 1];
                            locked = !progress.completed_paths?.includes(String(prevPath._id));
                        }

                        return (
                            <div className="flex w-full flex-col items-center" key={String(p._id)}>
                                <StudentModuleNode
                                    title={p.name}
                                    done={done}
                                    locked={locked}
                                    index={idx}
                                    badge={badge}
                                    href={
                                        p.modules?.[0]?._id
                                            ? `/student/learn/${courseId}/${p._id}/${p.modules[0]._id}`
                                            : undefined
                                    }
                                />
                                <div className="h-6 w-[2px] bg-blue-200 dark:bg-gray-500" />
                            </div>
                        );
                    })}

                    {/* SUBMISSION */}
                    {group.paths.length > 0 && (
                        <StudentModuleNode
                            title="Submission"
                            index={group.paths.length}
                            isSubmission={true}
                            href={`/student/career-groups/${group._id}/submissions`}
                            done={isCompleted}
                            locked={
                                !isCompleted && (
                                    !basicCompleted ||
                                    isOtherChosen ||
                                    !progress.completed_paths?.includes(
                                        String(group.paths[group.paths.length - 1]._id)
                                    )
                                )
                            }
                        />
                    )}
                </div>
            </div>
        </div>
    );
}