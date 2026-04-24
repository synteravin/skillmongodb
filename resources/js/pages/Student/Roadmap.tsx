import React from "react";
import StudentFundamentalNode from "@/components/Student/roadmap/StudentFundamentalNode";
import StudentCareerBranch from "@/components/Student/roadmap/StudentCareerBranch";
import { Link, usePage } from "@inertiajs/react";
import { ArrowLeft } from "lucide-react";

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
    progress
}: {
    course: Course;
    progress: Progress | null;
}) {

    const safeProgress: Progress = progress ?? {
        stage: "fundamental",
        selected_path_id: null,
        completed_modules: [],
        completed_paths: []
    };

    const { badges } = usePage().props as any;

    return (
            <div className="min-h-screen bg-[#e6ebf2] dark:bg-[#040812] text-gray-800 dark:text-slate-200 font-sans">
                <div className="w-full pb-0 pt-0.5 m-0 ">

                {/* ================= HEADER ================= */}
                    <div className="relative  w-full sticky top-0 z-50">
                        {/* GRADIENT BORDER (SAMA KAYAK NAV) */}
                       <div
                            className="relative border-[2px] md:border-[3px]"
                            style={{
                            borderImage:
                                "linear-gradient(to bottom, #3B28F6 0%, #4c2fff 30%, #7c3aed 50%, #facc15 100%) 1",
                            }}
                          >
                            {/* INNER CONTENT */}
                            <div className="rounded-lg py-5 px-4 md:px-6 flex items-center relative bg-white dark:bg-[#040812]">


                                {/* Back Button */}
                                <Link
                                    href="/student/course"
                                     className="border-2 border-blue-800 rounded bg-gray-200 dark:bg-[#0b1021] flex items-center justify-center p-2 hover:bg-blue-900/40 hover:border-blue-600 transition-colors w-10 h-10 md:w-12 md:h-12 absolute left-4 md:left-6 z-10"
                                >
                                    <svg
                                        viewBox="0 0 48 48"
                                        className="w-7 h-7 md:w-9 md:h-9 9 text-indigo-500 scale-125 hover:scale-150 transition-transform duration-200"
                                    >
                                        <rect x="12" y="20" width="29" height="4" fill="currentColor" />
                                        <rect x="8" y="20" width="4" height="4" fill="currentColor" />
                                        <rect x="5" y="20" width="5" height="4" fill="currentColor" />
                                        <rect x="8" y="16" width="4" height="4" fill="currentColor" />
                                        <rect x="8" y="24" width="4" height="4" fill="currentColor" />
                                        <rect x="12" y="12" width="4" height="4" fill="currentColor" />
                                        <rect x="12" y="28" width="4" height="4" fill="currentColor" />
                                        <rect x="16" y="8" width="4" height="4" fill="currentColor" />
                                        <rect x="16" y="32" width="4" height="4" fill="currentColor" />
                                        <rect x="16" y="32" width="4" height="4" fill="currentColor" />
                                    </svg>
                                </Link>

                                {/* Title */}
                                <h1 className="w-full text-center text-xl md:text-2xl lg:text-3xl font-['Orbitron'] font-bold text-gray-900 dark:text-white tracking-[0.1em] md:tracking-[0.15em] drop-shadow-[0_0_10px_rgba(255,255,255,0.3)] uppercase">
                                    {course.title}
                                </h1>
                            </div>
                        </div>
                    </div>


                {/* ================= FUNDAMENTAL ================= */}
                <div className="flex flex-col flex-nowrap items-center w-full mt-2">
                    {course.basic_paths?.map((path: any) => {

                        const done = path.is_completed;
                        const locked = !path.is_unlocked;

                        // 🔥 FINAL FIX (NO LOGIC DI FRONTEND)
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
                                <div className="w-[2px] h-12 bg-[#F0F0F0]"></div>
                            </React.Fragment>
                        );
                    })}
                </div>

                {/* ================= CAREER ================= */}
                {course.career_groups?.length > 0 && (
                    <div className="w-full flex flex-row items-start justify-center mt-0 relative z-10">
                        {course.career_groups.map((group: any, idx: number) => {

                            const isFirst = idx === 0;
                            const isLast = idx === course.career_groups.length - 1;
                            const hasMultiple = course.career_groups.length > 1;

                            return (
                                <div
                                    key={group._id}
                                    className="relative flex flex-col items-center flex-1 max-w-[340px]"
                                >

                                    {/* CONNECTION LINE */}
                                    {hasMultiple && (
                                        <>
                                            {!isFirst && (
                                                <div className="absolute top-0 left-0 w-1/2 h-[2px] bg-[#F0F0F0] z-0"></div>
                                            )}
                                            {!isLast && (
                                                <div className="absolute top-0 right-0 w-1/2 h-[2px] bg-[#F0F0F0] z-0"></div>
                                            )}
                                        </>
                                    )}

                                    <div className="w-[2px] h-10 bg-[#F0F0F0] z-10 hidden sm:block"></div>

                                    <StudentCareerBranch
                                        group={group}
                                        progress={safeProgress}
                                        badges={badges}
                                        courseId={course._id}
                                        basicCompleted={course.basic_paths.every((p: any) => p.is_completed)}
                                    />
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
}