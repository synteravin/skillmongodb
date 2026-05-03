import { useState } from 'react';
import StudentModuleNode from './StudentModuleNode';

import { User } from 'lucide-react';

import { router } from '@inertiajs/react';

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
            <div
                className={`relative mb-0 flex w-full flex-col overflow-hidden rounded-xl border-2 shadow-lg transition-all ${isCompleted
                        ? 'border-emerald-400 shadow-[0_0_40px_rgba(52,211,153,0.35)]'
                        : isChosen
                        ? 'border-blue-400 shadow-[0_0_40px_rgba(96,165,250,0.35)]'
                        : 'border-[#3B28F6] shadow-[0_0_35px_6px_rgba(59,40,246,0.5)]'
                    } ${!basicCompleted || isOtherChosen ? 'opacity-50 grayscale' : ''} `}
            >
                {/* GRADIENT BORDER TOP ACCENT */}
                <div className={`absolute top-0 right-0 left-0 z-10 h-[3px] bg-gradient-to-r from-transparent ${isCompleted ? 'via-emerald-500' : 'via-blue-500'} to-transparent`} />

                <div className="relative flex h-full w-full flex-col rounded-xl bg-[#050619] p-5">
                    {/* LOCK OVERLAY */}
                    {(!basicCompleted || isOtherChosen) && (
                        <div className="absolute inset-0 z-30 flex items-center justify-center rounded-xl backdrop-blur-[1px]">
                            <svg
                                width="64"
                                height="64"
                                viewBox="0 0 24 24"
                                fill="none"
                                className="opacity-80 drop-shadow-xl"
                            >
                                <rect
                                    x="4"
                                    y="10"
                                    width="16"
                                    height="12"
                                    rx="3"
                                    fill="#050d1f"
                                    stroke="#1e3a8a"
                                    strokeWidth="1.5"
                                />
                                <path
                                    d="M8 10V7a4 4 0 0 1 8 0v3"
                                    stroke="#1e3a8a"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                />
                                <circle cx="12" cy="16" r="2" fill="#1e3a8a" />
                                <path
                                    d="M12 16v2.5"
                                    stroke="#1e3a8a"
                                    strokeWidth="1.5"
                                    strokeLinecap="round"
                                />
                            </svg>
                        </div>
                    )}

                    {/* THUMBNAIL — bulat di tengah atas */}
                    <div className="mb-4 flex justify-center">
                        <div className="relative">
                            {/* glow ring */}
                            <div className={`absolute inset-0 scale-110 rounded-full ${isCompleted ? 'bg-emerald-500/20' : 'bg-blue-500/20'} blur-md`} />
                            <div className={`relative flex h-20 w-20 items-center justify-center overflow-hidden rounded-full border-2 ${isCompleted ? 'border-emerald-500 shadow-[0_0_20px_rgba(52,211,153,0.4)]' : 'border-blue-500 shadow-[0_0_20px_rgba(59,130,246,0.4)]'} bg-[#0b1333]`}>
                                {group.thumbnail ? (
                                    <img
                                        src={`/storage/${group.thumbnail}`}
                                        className="h-full w-full object-cover"
                                        alt={group.name}
                                    />
                                ) : (
                                    <svg
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        className="h-9 w-9 text-blue-400"
                                    >
                                        <path
                                            d="M12 2C12 2 7 6 7 13l2 2c0-4 1.5-7 3-9 1.5 2 3 5 3 9l2-2c0-7-5-11-5-11Z"
                                            stroke="currentColor"
                                            strokeWidth="1.5"
                                            strokeLinejoin="round"
                                        />
                                        <path
                                            d="M9 15l-2 4 3-1M15 15l2 4-3-1"
                                            stroke="currentColor"
                                            strokeWidth="1.5"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                        />
                                        <circle
                                            cx="12"
                                            cy="13"
                                            r="1.5"
                                            fill="currentColor"
                                        />
                                    </svg>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* TITLE */}
                    <h2 className="mb-2 text-center font-['Orbitron'] text-base leading-tight font-bold tracking-widest text-white uppercase sm:text-lg">
                        {group.name}
                    </h2>

                    {/* DESCRIPTION */}
                    <p className="mb-4 line-clamp-4 px-1 text-center text-[10px] leading-relaxed font-semibold text-gray-400">
                        A special package to become a professional {group.name}{' '}
                        Developer, starting with modern web development
                        fundamentals and progressing to advanced topics and
                        real-world projects the next
                    </p>

                    {/* STATS */}
                    <div className="mb-4 flex justify-between gap-2">
                        <div className="flex flex-1 flex-col items-center justify-center gap-0.5 rounded-lg border border-[#1A2E99] bg-[#020101] p-2 text-center">
                            <span className="block text-[9px] font-semibold tracking-wider text-[#F0E427] uppercase">
                                Learning Path
                            </span>
                            <span className="block text-sm font-bold text-[#B3B3B3]">
                                {totalModules} Units
                            </span>
                        </div>
                    </div>

                    {/* HEADER */}

                    {/* FOOTER — mentor + button */}
                    <div className="relative z-40 flex items-center justify-between border-t border-[#1A2E99]/80 pt-3">
                        {/* MENTOR */}
                        <div className="flex max-w-[60%] items-center gap-2">
                            {group.mentor &&
                                group.mentor.avatar &&
                                group.mentor.avatar !== 'null' ? (
                                <img
                                    src={
                                        group.mentor.avatar.startsWith('http')
                                            ? group.mentor.avatar
                                            : `/storage/${group.mentor.avatar}`
                                    }
                                    className="h-10 w-10 flex-shrink-0 rounded-full border border-gray-400 object-cover"
                                    alt="mentor"
                                />
                            ) : (
                                <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full border border-blue-500 bg-gradient-to-br from-blue-500 to-indigo-600">
                                    {group.mentor?.name ? (
                                        <span className="text-[11px] font-bold text-white">
                                            {group.mentor.name
                                                .charAt(0)
                                                .toUpperCase()}
                                        </span>
                                    ) : (
                                        <User className="h-5 w-5 text-white" />
                                    )}
                                </div>
                            )}
                            <div className="flex flex-col truncate">
                                <span className="truncate text-[10px] leading-none font-bold text-[#F0F0F0]">
                                    {group.mentor?.name ?? 'No Mentor'}
                                </span>
                                <span className="mt-0.5 truncate text-[8px] text-gray-400">
                                    {group.mentor
                                        ? `${group.name} Professional`
                                        : 'Unassigned'}
                                </span>
                            </div>
                        </div>

                        {/* START BUTTON */}
                        {isCompleted ? (
                            <button
                                disabled
                                className="flex-shrink-0 rounded-xl border-2 border-emerald-500 bg-emerald-500/10 px-4 py-1 font-['Orbitron'] text-[12px] font-bold tracking-widest uppercase text-emerald-400 shadow-[0_0_8px_1px_rgba(52,211,153,0.3)]"
                            >
                                Completed
                            </button>
                        ) : (
                            <button
                                onClick={() => handleStart(firstPath)}
                                disabled={!basicCompleted || isOtherChosen}
                                className={`flex-shrink-0 rounded-xl border-2 px-4 py-1 font-['Orbitron'] text-[12px] font-bold tracking-widest uppercase transition-all duration-300 ${isOtherChosen || !basicCompleted
                                        ? 'cursor-not-allowed border-gray-700 bg-gray-900 text-gray-500'
                                        : `border-[#3B28F6] bg-[#05080f] text-white shadow-[0_0_8px_1px_rgba(59,40,246,0.3),inset_0_0_8px_rgba(59,40,246,0.05)] hover:border-[#5a47ff] hover:bg-[#080d1a] hover:shadow-[0_0_14px_3px_rgba(59,40,246,0.45),inset_0_0_10px_rgba(59,40,246,0.1)]`
                                    } `}
                            >
                                Start
                            </button>
                        )}
                    </div>
                </div>
            </div>

            {/* connector line */}
            <div
                className={`h-8 w-[2px] bg-gray-500 ${isOtherChosen ? 'opacity-30' : ''}`}
            ></div>

            {/* paths list — sama seperti sebelumnya */}
            <div
                className={`flex w-full flex-col items-center ${!basicCompleted || isOtherChosen ? 'opacity-60 grayscale' : ''}`}
            >
                {/* LINE */}
                <div
                    className={`h-8 w-[2px] bg-gray-500 ${isOtherChosen ? 'opacity-30' : ''}`}
                ></div>

                {/* PATHS */}
                <div
                    className={`flex w-full flex-col items-center ${(!basicCompleted || (!hasChosenPath && !isCompleted) || isOtherChosen) ? 'opacity-60 grayscale' : ''}`}
                >
                    {group.paths.map((p: any, idx: number) => {
                        const done = progress.completed_paths?.includes(
                            String(p._id),
                        );
                        const badge = badges?.find(
                            (b: any) =>
                                parseInt(b.order?.toString().trim()) ===
                                idx + 1,
                        );

                        let locked = false;

                        if (!basicCompleted) locked = true;
                        if (isOtherChosen) locked = true;

                        // ❌ basic belum selesai
                        if (!basicCompleted) locked = true;

                        // ❌ belum pilih branch -> semua path dikunci, KECUALI group ini completed
                        if (!hasChosenPath && !isCompleted) locked = true;

                        // ❌ branch lain setelah pilih
                        if (hasChosenPath && isOtherChosen) locked = true;

                        // 🔓 unlock berdasarkan urutan (hanya kalau branch dipilih)

                        if (!locked && idx > 0) {
                            const prevPath = group.paths[idx - 1];
                            locked = !progress.completed_paths?.includes(
                                String(prevPath._id),
                            );
                        }

                        return (
                            <div
                                className="flex w-full flex-col items-center"
                                key={String(p._id)}
                            >
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
                                <div className="h-6 w-[2px] bg-gray-500"></div>
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
