import React from "react";
import StudentFundamentalNode from "@/components/Student/roadmap/StudentFundamentalNode";
import StudentCareerBranch from "@/components/Student/roadmap/StudentCareerBranch";
import { Link, usePage } from "@inertiajs/react";

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

/* ================= MAIN ================= */
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

    return (
        <div className="h-screen w-full overflow-hidden flex flex-col bg-[#e6ebf2] dark:bg-[#040812] text-gray-800 dark:text-slate-200 font-sans">

            {/* ================= HEADER (DIAM) ================= */}
            <div className="flex-shrink-0 w-full pt-0.5 px-1">
                <div
                    className="relative border-[2px] md:border-[3px]"
                    style={{
                        borderImage: "linear-gradient(to bottom, #3B28F6 0%, #4c2fff 30%, #7c3aed 50%, #facc15 100%) 1",
                    }}
                >
                    <div className="py-4 px-4 md:px-6 flex items-center gap-4 bg-[#040812]">

                        {/* Back Button */}
                        <Link
                            href="/student/course"
                            className="border-2 border-blue-800 rounded bg-gray-200 dark:bg-[#0b1021] flex items-center justify-center p-2 hover:bg-blue-900/40 hover:border-blue-600 transition-colors w-10 h-10 md:w-12 md:h-12 shrink-0"
                        >
                            <svg viewBox="0 0 48 48" className="w-7 h-7 md:w-9 md:h-9 text-indigo-500 scale-125 hover:scale-150 transition-transform duration-200">
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
                        <h1 className="absolute left-0 right-0 text-center text-xl md:text-2xl lg:text-3xl 2xl:text-4xl font-['Orbitron'] font-bold text-gray-900 dark:text-white tracking-[0.1em] md:tracking-[0.15em] drop-shadow-[0_0_10px_rgba(255,255,255,0.3)] uppercase px-16 pointer-events-none">
                            {course.title}
                        </h1>
                    </div>
                </div>
            </div>

            {/* ================= BODY (YANG SCROLL) ================= */}
            <div
                className="flex-1 overflow-y-auto"
                style={{
                    scrollbarWidth: "thin",
                    scrollbarColor: "rgba(99,130,255,0.3) transparent",
                }}
            >
                <div className="w-full max-w-screen-2xl mx-auto px-4 md:px-8 lg:px-12 2xl:px-16 pb-16">

                    {/* ================= FUNDAMENTAL ================= */}
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
                                    <div className="w-[2px] h-12 bg-[#F0F0F0] dark:bg-white/10" />
                                </React.Fragment>
                            );
                        })}
                    </div>

                    {/* ================= CAREER GROUPS ================= */}
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
                                                    <div className="absolute top-0 left-0 w-1/2 h-[2px] bg-[#F0F0F0] dark:bg-white/10 z-0 hidden sm:block" />
                                                )}
                                                {!isLast && (
                                                    <div className="absolute top-0 right-0 w-1/2 h-[2px] bg-[#F0F0F0] dark:bg-white/10 z-0 hidden sm:block" />
                                                )}
                                            </>
                                        )}

                                        <div className="w-[2px] h-10 bg-[#F0F0F0] dark:bg-white/10 z-10 hidden sm:block" />

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
    );
}