import React, { useState, useRef, useEffect } from "react";
import StudentFundamentalNode from "@/components/Student/roadmap/StudentFundamentalNode";
import StudentModuleNode from "@/components/Student/roadmap/StudentModuleNode";
import StudentCareerBranch from "@/components/Student/roadmap/StudentCareerBranch";
import { Link, router, usePage } from "@inertiajs/react";
import { User, ChevronDown } from "lucide-react";

/* ================= TYPES ================= */
type Course = {
    _id: string;
    title: string;
    slug: string;
    basic_paths: any[];
    career_groups: any[];
};

type Progress = {
    stage: "fundamental" | "path" | "done";
    selected_path_id?: string | null;
    completed_modules: string[];
    completed_paths?: string[];
};

/* ─────────────────────────────────────────────────────────────
   HELPER — perfectly-centered vertical roadmap connector line
───────────────────────────────────────────────────────────── */
function RoadmapLine({ height = "h-10" }: { height?: string }) {
    return (
        <div className={`flex w-full flex-col items-center ${height}`}>
            <div className="w-[2px] flex-1 bg-blue-500/70 dark:bg-white/80" />
        </div>
    );
}

/* ─────────────────────────────────────────────────────────────
   MOBILE CAREER BRANCH CARD
   — Vertical adaptation of StudentCareerBranch desktop card.
   — Uses 100% of the existing visual identity: same border
     gradient, same neon glow, same inner layout. No new design.
───────────────────────────────────────────────────────────── */
function MobileCareerCard({
    group,
    basicCompleted,
    isChosen,
    isOtherChosen,
    courseId,
    progress,
}: {
    group: any;
    basicCompleted: boolean;
    isChosen: boolean;
    isOtherChosen: boolean;
    courseId: string;
    progress: Progress;
}) {
    const [loading, setLoading] = useState(false);
    const isCompleted = group.is_completed;
    const isLocked = !basicCompleted || isOtherChosen;

    const firstPath = group.paths?.[0];
    const totalModules = group.paths.reduce(
        (sum: number, p: any) => sum + (p.modules?.length || 0),
        0,
    );

    const handleStart = () => {
        if (!firstPath?.modules?.[0]?._id || loading || isLocked) return;
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
        /* Outer wrapper — same border-gradient as desktop */
        <div
            className={`relative w-full overflow-hidden rounded-xl border-2 shadow-lg transition-all
                ${
                    isCompleted
                        ? "border-emerald-400 shadow-[0_0_40px_rgba(52,211,153,0.35)]"
                        : isChosen
                          ? "border-blue-400 shadow-[0_0_40px_rgba(96,165,250,0.35)]"
                          : isLocked
                            ? "border-blue-200 dark:border-[#3B28F6] shadow-[0_0_0_1px_rgba(147,197,253,0.4)] dark:shadow-[0_0_35px_6px_rgba(59,40,246,0.3)]"
                            : "border-[#3B28F6] shadow-[0_0_35px_6px_rgba(59,40,246,0.5)]"
                }`}
        >
            {/* TOP ACCENT LINE — exact match desktop */}
            <div
                className={`absolute top-0 right-0 left-0 z-10 h-[3px] bg-gradient-to-r from-transparent
                    ${isCompleted ? "via-emerald-500" : "via-blue-500"}
                    to-transparent`}
            />

            {/* INNER CARD */}
            <div
                className={`relative flex w-full flex-col rounded-xl p-5 dark:bg-[#050619]
                    ${
                        isLocked
                            ? "bg-[#f0f7ff]"
                            : isCompleted
                              ? "bg-emerald-50/60 dark:bg-[#050619]"
                              : "bg-white dark:bg-[#050619]"
                    }`}
            >
                {/* LOCK ICON — top-right corner */}
                {isLocked && (
                    <div
                        className="absolute top-3 right-3 z-30 flex h-7 w-7 items-center justify-center
                            rounded-full border border-blue-200 bg-white/90 shadow-sm
                            dark:border-[#1e3a8a] dark:bg-[#0b1333]/90"
                    >
                        <svg
                            viewBox="0 0 24 24"
                            fill="none"
                            className="h-3.5 w-3.5 text-blue-400 dark:text-[#1e3a8a]"
                        >
                            <rect
                                x="5"
                                y="11"
                                width="14"
                                height="10"
                                rx="2.5"
                                fill="currentColor"
                                fillOpacity="0.15"
                                stroke="currentColor"
                                strokeWidth="1.8"
                            />
                            <path
                                d="M8 11V7a4 4 0 0 1 8 0v4"
                                stroke="currentColor"
                                strokeWidth="1.8"
                                strokeLinecap="round"
                            />
                            <circle
                                cx="12"
                                cy="16"
                                r="1.5"
                                fill="currentColor"
                                fillOpacity="0.9"
                            />
                        </svg>
                    </div>
                )}

                {/* THUMBNAIL CIRCLE */}
                <div className="mb-4 flex justify-center">
                    <div className="relative">
                        <div
                            className={`absolute inset-0 scale-110 rounded-full blur-md
                                ${isCompleted ? "bg-emerald-500/20" : "bg-blue-500/20"}`}
                        />
                        <div
                            className={`relative flex h-20 w-20 items-center justify-center overflow-hidden rounded-full border-2
                                ${
                                    isCompleted
                                        ? "border-emerald-500 shadow-[0_0_20px_rgba(52,211,153,0.4)]"
                                        : isLocked
                                          ? "border-blue-200 shadow-[0_0_12px_rgba(147,197,253,0.3)] dark:border-blue-900 dark:shadow-none"
                                          : "border-blue-500 shadow-[0_0_20px_rgba(59,130,246,0.4)]"
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
                                <svg
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    className={`h-9 w-9 ${isLocked ? "text-blue-300 dark:text-blue-900" : "text-blue-400 dark:text-blue-400"}`}
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
                <h2
                    className={`mb-2 text-center font-['Orbitron'] text-base font-bold uppercase leading-tight tracking-widest
                        ${
                            isLocked
                                ? "text-[#3B82F6] dark:text-white/50"
                                : isCompleted
                                  ? "text-emerald-700 dark:text-white"
                                  : "text-gray-900 dark:text-white"
                        }`}
                >
                    {group.name}
                </h2>

                {/* DESCRIPTION */}
                <p
                    className={`mb-4 line-clamp-3 px-1 text-center text-[10px] font-semibold leading-relaxed
                        ${isLocked ? "text-[#3B82F6] dark:text-gray-600" : "text-gray-500 dark:text-gray-400"}`}
                >
                    A special package to become a professional {group.name}{" "}
                    Developer, starting with modern web development fundamentals
                    and progressing to advanced topics and real-world projects.
                </p>

                {/* STATS */}
                <div className="mb-4 flex justify-between gap-2">
                    <div
                        className={`flex flex-1 flex-col items-center justify-center gap-0.5 rounded-lg border p-2 text-center
                            ${
                                isLocked
                                    ? "border-blue-100 bg-blue-50/50 dark:border-[#1A2E99]/40 dark:bg-[#020101]"
                                    : "border-[#1A2E99] bg-[#f8faff] dark:bg-[#020101]"
                            }`}
                    >
                        <span
                            className={`block text-[9px] font-semibold uppercase tracking-wider
                                ${isLocked ? "text-blue-300 dark:text-[#F0E427]/50" : "text-[#F0E427] dark:text-[#F0E427]"}`}
                        >
                            Learning Path
                        </span>
                        <span
                            className={`block text-sm font-bold
                                ${isLocked ? "text-blue-300 dark:text-gray-600" : "text-gray-700 dark:text-[#B3B3B3]"}`}
                        >
                            {totalModules} Units
                        </span>
                    </div>
                </div>

                {/* FOOTER — mentor + start/finish button */}
                <div
                    className={`relative z-40 flex items-center justify-between border-t pt-3
                        ${isLocked ? "border-blue-100 dark:border-[#1A2E99]/30" : "border-blue-100 dark:border-[#1A2E99]/80"}`}
                >
                    {/* MENTOR */}
                    {group.mentor ? (
                        <Link
                            href={`/student/mentors/${group.mentor._id}`}
                            className="group/mentor flex max-w-[58%] cursor-pointer items-center gap-2"
                        >
                            {group.mentor.avatar &&
                            group.mentor.avatar !== "null" ? (
                                <img
                                    src={group.mentor.avatar}
                                    className="h-9 w-9 shrink-0 rounded-full border border-gray-400 object-cover shadow-sm transition-all group-hover/mentor:scale-105 group-hover/mentor:border-indigo-400"
                                    alt="mentor"
                                />
                            ) : (
                                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-blue-500 bg-gradient-to-br from-blue-500 to-indigo-600 transition-all group-hover/mentor:scale-105 group-hover/mentor:border-indigo-400">
                                    <span className="text-[11px] font-bold text-white">
                                        {group.mentor.name
                                            .charAt(0)
                                            .toUpperCase()}
                                    </span>
                                </div>
                            )}
                            <div className="flex flex-col truncate">
                                <span
                                    className={`truncate text-[10px] font-bold leading-none transition-colors
                                        ${isLocked ? "text-blue-400 dark:text-gray-500" : "text-gray-900 dark:text-[#F0F0F0] group-hover/mentor:text-indigo-500 dark:group-hover/mentor:text-[#00d4ff]"}`}
                                >
                                    {group.mentor.name}
                                </span>
                                <span
                                    className={`mt-0.5 truncate text-[8px]
                                        ${isLocked ? "text-blue-300/70 dark:text-gray-600" : "text-gray-400 dark:text-gray-450"}`}
                                >
                                    {group.name} Professional
                                </span>
                            </div>
                        </Link>
                    ) : (
                        <div className="flex max-w-[58%] items-center gap-2">
                            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-blue-200 bg-slate-200 dark:border-blue-900 dark:bg-slate-800">
                                <User className="h-4 w-4 text-gray-400 dark:text-gray-600" />
                            </div>
                            <div className="flex flex-col truncate">
                                <span className="truncate text-[10px] font-bold leading-none text-gray-400 dark:text-gray-600">
                                    No Mentor
                                </span>
                                <span className="mt-0.5 truncate text-[8px] text-gray-400 dark:text-gray-600">
                                    Unassigned
                                </span>
                            </div>
                        </div>
                    )}

                    {/* ACTION BUTTON */}
                    {isCompleted ? (
                        <button
                            disabled
                            className="shrink-0 rounded-xl border-2 border-emerald-500 bg-emerald-500/10 px-4 py-1 font-['Orbitron'] text-[11px] font-bold uppercase tracking-widest text-emerald-400 shadow-[0_0_8px_1px_rgba(52,211,153,0.3)]"
                        >
                            Finish
                        </button>
                    ) : (
                        <button
                            onClick={handleStart}
                            disabled={isLocked || loading}
                            className={`shrink-0 rounded-xl border-2 px-4 py-1 font-['Orbitron'] text-[11px] font-bold uppercase tracking-widest transition-all duration-300
                                ${
                                    isLocked
                                        ? "cursor-not-allowed border-sky-200 bg-sky-50 text-blue-500 shadow-sm dark:border-gray-700 dark:bg-gray-900 dark:text-gray-500 dark:shadow-none"
                                        : `border-sky-300 bg-sky-50 text-sky-700
                                        shadow-[0_3px_10px_rgba(56,189,248,0.22),inset_0_0_5px_rgba(255,255,255,0.7)]
                                        hover:border-sky-400 hover:bg-sky-100 hover:text-sky-800
                                        dark:border-[#3B28F6] dark:bg-[#05080f] dark:text-white
                                        dark:shadow-[0_3px_10px_rgba(59,40,246,0.35),inset_0_0_5px_rgba(59,40,246,0.12)]
                                        dark:hover:border-[#5a47ff] dark:hover:bg-[#080d1a]`
                                }`}
                        >
                            {loading ? "..." : "Start"}
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}

/* ─────────────────────────────────────────────────────────────
   MOBILE ROADMAP — full vertical flow (320px–767px only)
───────────────────────────────────────────────────────────── */
function MobileRoadmap({
    course,
    safeProgress,
    badges,
}: {
    course: Course;
    safeProgress: Progress;
    badges: any[];
}) {
    const basicCompleted = course.basic_paths.every((p: any) => p.is_completed);

    /* ── Determine pre-selected group from progress ── */
    const initialGroupIndex = safeProgress.selected_path_id
        ? course.career_groups.findIndex((g: any) =>
              g.paths.some(
                  (p: any) => p._id === safeProgress.selected_path_id,
              ),
          )
        : -1;

    const [selectedGroupIndex, setSelectedGroupIndex] =
        useState<number>(initialGroupIndex);
    const [dropdownOpen, setDropdownOpen] = useState(false);

    const selectedGroup =
        selectedGroupIndex >= 0
            ? course.career_groups[selectedGroupIndex]
            : null;

    /* ── For the selected group, compute lock state of each path ── */
    const hasChosenPath = !!safeProgress.selected_path_id;

    return (
        <div className="block md:hidden w-full">
            <div className="flex w-full flex-col items-center px-4 pb-24 pt-4">

                {/* ══════════════════════════════════════════
                    SECTION LABEL — course title as header
                ══════════════════════════════════════════ */}
                <div className="mb-3 w-full">
                    <div
                        className="relative w-full border-[2px] border-transparent"
                        style={{
                            borderImage:
                                "linear-gradient(to right, #3B28F6 0%, #4c2fff 40%, #facc15 100%) 1",
                        }}
                    >
                        <div className="bg-white px-4 py-2.5 dark:bg-[#040812]">
                            <p className="font-['Orbitron'] text-[9px] font-semibold uppercase tracking-[0.25em] text-blue-400 dark:text-blue-400">
                                Learning Path
                            </p>
                            <h2 className="font-['Orbitron'] text-sm font-bold uppercase tracking-[0.12em] text-gray-900 dark:text-white">
                                {course.title}
                            </h2>
                        </div>
                    </div>
                </div>

                {/* ══════════════════════════════════════════
                    SECTION 1 — FUNDAMENTALS
                ══════════════════════════════════════════ */}
                <div className="flex w-full flex-col items-center">
                    {/* Section badge */}
                    <div className="mb-3 flex items-center gap-2">
                        <div className="h-[1px] w-8 bg-gradient-to-l from-blue-500 to-transparent" />
                        <span className="font-['Orbitron'] text-[8px] font-bold uppercase tracking-[0.3em] text-blue-500 dark:text-blue-400">
                            Fundamentals
                        </span>
                        <div className="h-[1px] w-8 bg-gradient-to-r from-blue-500 to-transparent" />
                    </div>

                    {course.basic_paths?.map((path: any) => {
                        const done = path.is_completed;
                        const locked = !path.is_unlocked;
                        const href =
                            !locked && path.first_module_id
                                ? `/student/learn/${course._id}/${path._id}/${path.first_module_id}`
                                : undefined;

                        return (
                            <React.Fragment key={path._id}>
                                <StudentFundamentalNode
                                    title={path.name}
                                    locked={locked}
                                    done={done}
                                    thumbnail={path.thumbnail}
                                    href={href}
                                />
                                <RoadmapLine height="h-10" />
                            </React.Fragment>
                        );
                    })}
                </div>

                {/* ══════════════════════════════════════════
                    SECTION 2 — CAREER BRANCH SELECTOR CARD
                ══════════════════════════════════════════ */}
{/* ══════════════════════════════════════════
    SECTION 2 — CAREER BRANCH SELECTOR CARD
══════════════════════════════════════════ */}
<div className="flex w-full flex-col items-center">
    {/* Section badge */}
    <div className="mb-3 flex items-center gap-2">
        <div className="h-[1px] w-8 bg-gradient-to-l from-[#facc15] to-transparent" />
        <span className="font-['Orbitron'] text-[8px] font-bold uppercase tracking-[0.3em] text-amber-400 dark:text-amber-400">
            Choose Path
        </span>
        <div className="h-[1px] w-8 bg-gradient-to-r from-[#facc15] to-transparent" />
    </div>

    {/* Selector card */}
    <div className="relative w-full rounded-xl border-2 border-[#3B28F6] shadow-[0_0_35px_6px_rgba(59,40,246,0.4)] dark:shadow-[0_0_35px_6px_rgba(59,40,246,0.5)]">
        {/* Top accent line */}
        <div className="absolute top-0 right-0 left-0 z-10 h-[3px] bg-gradient-to-r from-transparent via-blue-500 to-transparent" />

        <div className="bg-white px-5 py-5 dark:bg-[#050619] rounded-xl">
            {/* Card header */}
            <div className="mb-1 flex items-center gap-2">
                <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border border-blue-400/50 bg-blue-50 dark:border-blue-500/30 dark:bg-blue-500/10">
                    <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        className="h-4 w-4 text-blue-500 dark:text-blue-400"
                    >
                        <path
                            d="M3 7h18M3 12h18M3 17h12"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                        />
                    </svg>
                </div>
                <h3 className="font-['Orbitron'] text-xs font-bold uppercase tracking-widest text-gray-900 dark:text-white">
                    Choose Your Career Branch
                </h3>
            </div>

            <p className="mb-4 text-[10px] leading-relaxed text-gray-500 dark:text-gray-400">
                Select your specialization path to continue your
                learning journey.
            </p>

            {/* ── CUSTOM DROPDOWN ── */}
            <div className="relative w-full">
                <button
                    onClick={() => setDropdownOpen((prev) => !prev)}
                    className={`flex w-full items-center justify-between gap-2 px-4 py-3 text-left transition-all duration-200
                        ${dropdownOpen
                            ? "rounded-t-xl border-2 border-b-0 border-[#3B28F6] bg-[#0b1333] dark:bg-[#0b1333]"
                            : "rounded-xl border-2 border-blue-400/60 bg-blue-50/50 dark:border-[#3B28F6]/70 dark:bg-[#0b1333]/50"
                        }`}
                    style={{
                        boxShadow: dropdownOpen
                            ? "0 0 20px rgba(59,40,246,0.25)"
                            : "0 0 14px rgba(59,40,246,0.12)",
                    }}
                >
                    <div className="flex items-center gap-2.5">
                        <div className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-md border transition-all duration-200
                            ${dropdownOpen
                                ? "border-blue-400/60 bg-blue-500/20"
                                : "border-blue-300/40 bg-blue-50 dark:border-blue-500/20 dark:bg-blue-500/10"}`}>
                            <svg viewBox="0 0 24 24" fill="none" className="h-3.5 w-3.5 text-blue-400">
                                <path d="M12 2C12 2 7 6 7 13l2 2c0-4 1.5-7 3-9 1.5 2 3 5 3 9l2-2c0-7-5-11-5-11Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>
                                <circle cx="12" cy="13" r="1.5" fill="currentColor"/>
                            </svg>
                        </div>
                        <span className={`font-['Orbitron'] text-[11px] font-bold uppercase tracking-wide transition-colors duration-200
                            ${selectedGroupIndex >= 0
                                ? dropdownOpen ? "text-blue-300" : "text-blue-600 dark:text-blue-300"
                                : "text-gray-400 dark:text-gray-500"}`}>
                            {selectedGroupIndex >= 0
                                ? course.career_groups[selectedGroupIndex].name
                                : "Select a branch…"}
                        </span>
                    </div>
                    <div className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full transition-all duration-300
                        ${dropdownOpen ? "bg-blue-500/20 rotate-180" : "bg-transparent"}`}>
                        <ChevronDown className="h-3.5 w-3.5 text-blue-400 dark:text-blue-400" />
                    </div>
                </button>

                {/* Dropdown list — nyambung ke trigger */}
                <div
                    className={`absolute left-0 right-0 top-full z-[9999] overflow-y-auto rounded-b-xl border-2 border-t-0 border-[#3B28F6] bg-white dark:bg-[#060d24] transition-all duration-200
                        ${dropdownOpen ? "max-h-[260px] opacity-100" : "max-h-0 opacity-0 pointer-events-none"}`}
                    style={{ boxShadow: "0 16px 32px rgba(59,40,246,0.25)" }}
                >
                    {/* Top separator line */}
                    <div className="mx-4 h-[1px] bg-gradient-to-r from-transparent via-[#3B28F6]/40 to-transparent" />

                    {course.career_groups.map((group: any, idx: number) => (
                        <button
                            key={group._id}
                            onClick={() => {
                                setSelectedGroupIndex(idx);
                                setDropdownOpen(false);
                            }}
                            className={`group/item flex w-full items-center gap-3 px-4 py-3 text-left transition-all duration-150
                                ${idx === selectedGroupIndex
                                    ? "bg-blue-500/8 dark:bg-blue-500/10"
                                    : "hover:bg-blue-50/70 dark:hover:bg-[#0b1333]/80"
                                }
                                ${idx < course.career_groups.length - 1 ? "border-b border-blue-100/50 dark:border-[#3B28F6]/15" : ""}`}
                        >
                            {/* Thumbnail */}
                            <div className={`flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-full border-2 transition-all duration-150
                                ${idx === selectedGroupIndex
                                    ? "border-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.4)]"
                                    : "border-blue-200/60 dark:border-blue-500/20 group-hover/item:border-blue-400/60"
                                } bg-blue-50 dark:bg-[#0b1333]`}>
                                {group.thumbnail ? (
                                    <img
                                        src={group.thumbnail}
                                        className="h-full w-full object-cover"
                                        alt={group.name}
                                    />
                                ) : (
                                    <svg viewBox="0 0 24 24" fill="none" className={`h-4 w-4 transition-colors ${idx === selectedGroupIndex ? "text-blue-500" : "text-blue-300 dark:text-blue-700"}`}>
                                        <path d="M12 2C12 2 7 6 7 13l2 2c0-4 1.5-7 3-9 1.5 2 3 5 3 9l2-2c0-7-5-11-5-11Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>
                                        <circle cx="12" cy="13" r="1.5" fill="currentColor"/>
                                    </svg>
                                )}
                            </div>

                            {/* Name + subtitle */}
                            <div className="flex min-w-0 flex-1 flex-col">
                                <span className={`font-['Orbitron'] text-[10px] font-bold uppercase tracking-wide transition-colors
                                    ${idx === selectedGroupIndex
                                        ? "text-blue-600 dark:text-blue-300"
                                        : "text-gray-700 dark:text-gray-300 group-hover/item:text-blue-500 dark:group-hover/item:text-blue-400"
                                    }`}>
                                    {group.name}
                                </span>
                                <span className="mt-0.5 truncate text-[9px] text-gray-400 dark:text-gray-600">
                                    {group.paths?.length ?? 0} paths · {group.paths?.reduce((s: number, p: any) => s + (p.modules?.length || 0), 0) ?? 0} modules
                                </span>
                            </div>

                            {/* Active indicator */}
                            {idx === selectedGroupIndex ? (
                                <div className="ml-auto flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-blue-500/15">
                                    <div className="h-2 w-2 rounded-full bg-blue-500 shadow-[0_0_6px_rgba(59,130,246,0.8)]" />
                                </div>
                            ) : (
                                <div className="ml-auto h-5 w-5 shrink-0 rounded-full border border-blue-100/40 dark:border-blue-500/10 group-hover/item:border-blue-300/40" />
                            )}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    </div>
</div>
                {/* ══════════════════════════════════════════
                    CONNECTOR + SECTION 3 — SELECTED BRANCH
                ══════════════════════════════════════════ */}
                <RoadmapLine height="h-10" />

                {selectedGroup === null ? (
                    /* ── PLACEHOLDER when no branch selected ── */
                    <div
                        className="relative w-full overflow-hidden rounded-xl border-2 border-blue-200/60 dark:border-[#3B28F6]/40"
                        style={{
                            boxShadow:
                                "0 0 20px rgba(59,40,246,0.08)",
                        }}
                    >
                        <div className="bg-white px-5 py-8 dark:bg-[#050619]">
                            <div className="flex flex-col items-center gap-3 text-center">
                                <div className="flex h-14 w-14 items-center justify-center rounded-full border border-blue-200/60 bg-blue-50/50 dark:border-[#3B28F6]/30 dark:bg-[#0b1333]/50">
                                    <span className="text-2xl">🔒</span>
                                </div>
                                <p className="font-['Orbitron'] text-xs font-bold uppercase tracking-wider text-gray-400 dark:text-gray-500">
                                    Select a Career Branch to continue
                                </p>
                                <p className="text-[10px] leading-relaxed text-gray-400 dark:text-gray-600">
                                    Your progress will be saved automatically in
                                    your chosen path.
                                </p>
                            </div>
                        </div>
                    </div>
                ) : (
                    /* ── SELECTED BRANCH — career card + module nodes ── */
                    <div className="flex w-full flex-col items-center">
                        {/* Section badge */}
                        <div className="mb-3 flex items-center gap-2">
                            <div className="h-[1px] w-8 bg-gradient-to-l from-blue-500 to-transparent" />
                            <span className="font-['Orbitron'] text-[8px] font-bold uppercase tracking-[0.3em] text-blue-500 dark:text-blue-400">
                                Your Branch
                            </span>
                            <div className="h-[1px] w-8 bg-gradient-to-r from-blue-500 to-transparent" />
                        </div>

                        {/* Career branch detail card */}
                        <MobileCareerCard
                            group={selectedGroup}
                            basicCompleted={basicCompleted}
                            isChosen={selectedGroup.paths.some(
                                (p: any) =>
                                    p._id === safeProgress.selected_path_id,
                            )}
                            isOtherChosen={
                                !!(
                                    safeProgress.selected_path_id &&
                                    !selectedGroup.paths.some(
                                        (p: any) =>
                                            p._id ===
                                            safeProgress.selected_path_id,
                                    )
                                )
                            }
                            courseId={course._id}
                            progress={safeProgress}
                        />

                        {/* ─── CONNECTOR + SECTION 4: MODULE NODES ─── */}
                        {selectedGroup.paths.length > 0 && (
                            <>
                                <RoadmapLine height="h-8" />

                                {/* Module paths section badge */}
                                <div className="mb-3 flex items-center gap-2">
                                    <div className="h-[1px] w-8 bg-gradient-to-l from-blue-500 to-transparent" />
                                    <span className="font-['Orbitron'] text-[8px] font-bold uppercase tracking-[0.3em] text-blue-500 dark:text-blue-400">
                                        Roadmap
                                    </span>
                                    <div className="h-[1px] w-8 bg-gradient-to-r from-blue-500 to-transparent" />
                                </div>

                                <div className="flex w-full flex-col items-center">
                                    {selectedGroup.paths.map(
                                        (p: any, idx: number) => {
                                            const done =
                                                safeProgress.completed_paths?.includes(
                                                    String(p._id),
                                                );

                                            const isOtherChosen =
                                                safeProgress.selected_path_id &&
                                                !selectedGroup.paths.some(
                                                    (sp: any) =>
                                                        sp._id ===
                                                        safeProgress.selected_path_id,
                                                );

                                            let locked = false;
                                            if (!basicCompleted) locked = true;
                                            if (isOtherChosen) locked = true;
                                            if (!hasChosenPath) locked = true;
                                            if (idx > 0) {
                                                const prevPath =
                                                    selectedGroup.paths[idx - 1];
                                                if (
                                                    !safeProgress.completed_paths?.includes(
                                                        String(prevPath._id),
                                                    )
                                                )
                                                    locked = true;
                                            }

                                            const badge = badges?.find(
                                                (b: any) =>
                                                    parseInt(
                                                        b.order
                                                            ?.toString()
                                                            .trim(),
                                                    ) === idx + 1,
                                            );

                                            return (
                                                <React.Fragment
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
                                                                ? `/student/learn/${course._id}/${p._id}/${p.modules[0]._id}`
                                                                : undefined
                                                        }
                                                    />
                                                    <RoadmapLine height="h-6" />
                                                </React.Fragment>
                                            );
                                        },
                                    )}

                                    {/* SUBMISSION node */}
                                    <StudentModuleNode
                                        title="Submission"
                                        index={selectedGroup.paths.length}
                                        isSubmission={true}
                                        href={`/student/career-groups/${selectedGroup._id}/submissions`}
                                        done={selectedGroup.is_completed}
                                        locked={
                                            !selectedGroup.is_completed &&
                                            (!basicCompleted ||
                                                !safeProgress.completed_paths?.includes(
                                                    String(
                                                        selectedGroup.paths[
                                                            selectedGroup.paths
                                                                .length - 1
                                                        ]?._id,
                                                    ),
                                                ))
                                        }
                                    />
                                </div>
                            </>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}

/* ═══════════════════════════════════════════════════════════
   MAIN PAGE
═══════════════════════════════════════════════════════════ */
export default function Roadmap({
    course,
    progress,
}: {
    course: Course;
    progress: Progress | null;
}) {
    const safeProgress: Progress = progress ?? {
        stage: "fundamental",
        selected_path_id: null,
        completed_modules: [],
        completed_paths: [],
    };

    const { badges } = usePage().props as any;

    const contentRef = useRef<HTMLDivElement>(null);
    const [contentHeight, setContentHeight] = useState(0);
    const [pages, setPages] = useState(1);

    useEffect(() => {
        const el = contentRef.current;
        if (!el) return;

        const handleResize = () => {
            const height = el.offsetHeight || el.scrollHeight;
            setContentHeight(height);
            const clientHeight = window.innerHeight;
            if (clientHeight > 0) {
                setPages(Math.max(1, Math.ceil(height / clientHeight)));
            }
        };

        handleResize();
        const observer = new ResizeObserver(handleResize);
        observer.observe(el);
        return () => observer.disconnect();
    }, []);

    return (
        <div className="h-screen w-full overflow-hidden flex flex-col bg-blue-100/30 dark:bg-[#020202] text-gray-800 dark:text-slate-200 font-sans">

            {/* ================= HEADER (unchanged, visible both breakpoints) ================= */}
            <div className="flex-shrink-0 w-full pt-0.5 px-1">
                <div
                    className="relative border-[2px] md:border-[3px]"
                    style={{
                        borderImage: "linear-gradient(to bottom, #3B28F6 0%, #4c2fff 30%, #7c3aed 50%, #facc15 100%) 1",
                    }}
                >
                    <div className="py-4 px-4 md:px-6 flex items-center gap-4 bg-white dark:bg-[#040812]">

                        {/* Back Button */}
                        <Link
                            href="/student/course"
                            className="border-2 border-blue-800 rounded bg-gray-200 dark:bg-[#0b1021] flex items-center justify-center p-2 hover:bg-blue-900/40 hover:border-blue-600 transition-colors w-10 h-10 md:w-12 md:h-12 shrink-0"
                        >
                            <svg viewBox="0 0 48 48" className="h-7 w-7 scale-125 text-indigo-600 transition-transform duration-200 hover:scale-150 dark:text-indigo-500 md:h-9 md:w-9">
                                <rect x="12" y="20" width="29" height="4" fill="currentColor" />
                                <rect x="8"  y="20" width="4"  height="4" fill="currentColor" />
                                <rect x="5"  y="20" width="5"  height="4" fill="currentColor" />
                                <rect x="8"  y="16" width="4"  height="4" fill="currentColor" />
                                <rect x="8"  y="24" width="4"  height="4" fill="currentColor" />
                                <rect x="12" y="12" width="4"  height="4" fill="currentColor" />
                                <rect x="12" y="28" width="4"  height="4" fill="currentColor" />
                                <rect x="16" y="8"  width="4"  height="4" fill="currentColor" />
                                <rect x="16" y="32" width="4"  height="4" fill="currentColor" />
                            </svg>
                        </Link>

                        {/* Title */}
                        <h1 className="absolute left-0 right-0 text-center text-xl md:text-2xl lg:text-3xl 2xl:text-4xl font-['Orbitron'] font-bold text-[#1e3a8a] dark:text-white tracking-[0.1em] md:tracking-[0.15em] drop-shadow-[0_0_10px_rgba(255,255,255,0.3)] uppercase px-16 pointer-events-none">
                            {course.title}
                        </h1>
                    </div>
                </div>
            </div>

            {/* ================= SCROLLABLE BODY ================= */}
            <div
                className="flex-1 overflow-y-auto overflow-x-clip relative"
                style={{
                    scrollbarWidth: "thin",
                    scrollbarColor: "rgba(99,130,255,0.3) transparent",
                }}
            >
                {/* Background Glows Container */}
                <div className="absolute top-0 left-0 w-full overflow-hidden pointer-events-none z-0" style={{ height: contentHeight }}>
                    {Array.from({ length: pages }).map((_, i) => (
                        <div
                            key={i}
                            className="absolute pointer-events-none left-1/2 -translate-x-1/2 w-[1800px] max-w-full h-[300px] bg-[#3B82F6] opacity-[0.08] dark:opacity-[0.16] blur-[120px] md:blur-[150px] rounded-full"
                            style={{ top: `${20 + i * 100}vh` }}
                        />
                    ))}
                </div>

                <div ref={contentRef} className="relative z-10">
                    {/* ── MOBILE LAYOUT (< md) — new vertical roadmap flow ── */}
                    <MobileRoadmap
                        course={course}
                        safeProgress={safeProgress}
                        badges={badges ?? []}
                    />

                    {/* ── DESKTOP LAYOUT (md+) — original, completely unchanged ── */}
                    <div className="hidden md:block w-full max-w-screen-2xl mx-auto px-4 md:px-8 lg:px-12 2xl:px-16 pb-16">

                        {/* FUNDAMENTAL */}
                        <div className="flex flex-col flex-nowrap items-center w-full mt-4">
                            {course.basic_paths?.map((path: any) => {
                                const done   = path.is_completed;
                                const locked = !path.is_unlocked;

                                const href =
                                    !locked && path.first_module_id
                                        ? `/student/learn/${course._id}/${path._id}/${path.first_module_id}`
                                        : undefined;

                                return (
                                    <React.Fragment key={path._id}>
                                        <StudentFundamentalNode
                                            title={path.name}
                                            locked={locked}
                                            done={done}
                                            thumbnail={path.thumbnail}
                                            href={href}
                                        />
                                        <div className="w-[2px] h-12 bg-blue-500/70 dark:bg-white/80" />
                                    </React.Fragment>
                                );
                            })}
                        </div>

                        {/* CAREER GROUPS */}
                        {course.career_groups?.length > 0 && (
                            <div className="w-full flex flex-col sm:flex-row flex-wrap items-start justify-center mt-0 relative z-10 gap-0">
                                {course.career_groups.map((group: any, idx: number) => {
                                    const isFirst     = idx === 0;
                                    const isLast      = idx === course.career_groups.length - 1;
                                    const hasMultiple = course.career_groups.length > 1;

                                    return (
                                        <div
                                            key={group._id}
                                            className="relative flex flex-col items-center flex-1 min-w-[260px] max-w-[340px] 2xl:max-w-[380px]"
                                        >
                                            {hasMultiple && (
                                                <>
                                                    {!isFirst && (
                                                        <div className="absolute top-0 left-0 w-1/2 h-[2px] bg-blue-500/70 dark:bg-white/80 z-0 hidden sm:block" />
                                                    )}
                                                    {!isLast && (
                                                        <div className="absolute top-0 right-0 w-1/2 h-[2px] bg-blue-500/70 dark:bg-white/80 z-0 hidden sm:block" />
                                                    )}
                                                </>
                                            )}

                                            <div className="w-[2px] h-10 bg-blue-500/70 dark:bg-white/80 z-10 hidden sm:block" />

                                            <StudentCareerBranch
                                                group={group}
                                                progress={safeProgress}
                                                badges={badges}
                                                courseId={course._id}
                                                basicCompleted={course.basic_paths.every(
                                                    (p: any) => p.is_completed
                                                )}
                                            />
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}