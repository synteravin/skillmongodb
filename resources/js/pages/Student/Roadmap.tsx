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

    const isPathDone = (pathModules: any[]) => {
        if (!pathModules || pathModules.length === 0) return false;
        return safeProgress.completed_modules.includes(pathModules[pathModules.length - 1]._id);
    };
    
    const { badges } = usePage().props as any;
    
    return (
        <div className="min-h-screen bg-[#040812] text-white py-8 sm:py-16 overflow-hidden">
            <div className="max-w-[1200px] mx-auto px-4 flex flex-col items-center relative font-sans">

                {/* ================= HEADER BAR ================= */}
                <div className="w-full relative mb-16 px-2">
                    <div className="w-full bg-[#030616] flex items-center justify-center py-4 rounded relative overflow-hidden" 
                         style={{
                             borderTop: '2px solid transparent',
                             borderBottom: '2px solid #eab308',
                             borderImage: 'linear-gradient(to right, #3b82f6, #8b5cf6) 1 0 0 0',
                             borderImageSlice: '1 0 0 0'
                         }}>
                         
                         {/* We can use absolute positioning to emulate the gradient top border since border-image is tricky with radius */}
                         <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-blue-600 via-indigo-500 to-purple-600"></div>
                         
                         <Link 
                            href="/student/dashboard" 
                            className="absolute left-4 w-8 h-8 flex items-center justify-center border border-[#1e2759] rounded hover:border-blue-500 transition-colors text-blue-500"
                        >
                             <ArrowLeft size={16} />
                         </Link>
                         
                         <h1 className="text-lg sm:text-xl md:text-2xl font-['Orbitron'] font-bold text-white uppercase tracking-widest px-14 text-center">
                             {course.title}
                         </h1>
                    </div>
                </div>

                {/* ================= FUNDAMENTAL ================= */}
                <div className="flex flex-col flex-nowrap items-center w-full">
                    {course.basic_paths?.map((path: any, i: number) => {
                        const done = isPathDone(path.modules);
                        let locked = false;
                        if (i > 0) {
                            const prevPath = course.basic_paths[i - 1];
                            locked = !isPathDone(prevPath.modules);
                        }

                        const href = path.modules?.[0]?._id 
                            ? `/student/learn/${course._id}/${path._id}/${path.modules[0]._id}` 
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
                                <div className="w-[2px] h-12 bg-gray-500"></div>
                            </React.Fragment>
                        );
                    })}
                </div>

                {/* ================= BRANCH ================= */}
                {course.career_groups?.length > 0 && (
                    <div className="w-full flex flex-row items-start justify-center mt-0 relative z-10">
                        {course.career_groups.map((group: any, idx: number) => {
                            const isFirst = idx === 0;
                            const isLast = idx === course.career_groups.length - 1;
                            const hasMultiple = course.career_groups.length > 1;

                            return (
                                <div key={group._id} className="relative flex flex-col items-center flex-1 max-w-[340px]">
                                    {/* Horizontal Line Connections */}
                                    {hasMultiple && (
                                        <>
                                            {!isFirst && <div className="absolute top-0 left-0 w-1/2 h-[2px] bg-gray-500 z-0"></div>}
                                            {!isLast && <div className="absolute top-0 right-0 w-1/2 h-[2px] bg-gray-500 z-0"></div>}
                                        </>
                                    )}
                                    <div className="w-[2px] h-10 bg-gray-500 z-10 hidden sm:block"></div>
                                    <StudentCareerBranch
                                        group={group}
                                        progress={safeProgress}
                                        badges={badges}
                                        courseId={course._id}
                                    />
                                </div>
                            )
                        })}
                    </div>
                )}
            </div>
        </div>
    );
}
