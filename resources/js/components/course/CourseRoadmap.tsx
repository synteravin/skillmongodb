import FundamentalNode from './FundamentalNode';
import CareerBranch from './CareerBranch';
import { usePage } from '@inertiajs/react';

type Module = {
    _id: string;
    title: string;
    slug: string;
};

type Path = {
    _id: string;
    name: string;
    modules: Module[];
    thumbnail?: string | null;
};

type CareerGroup = {
    _id: string;
    name: string;
    paths: Path[];
};

type Course = {
    _id: string;
    title: string;
    basic_paths: Path[];
    career_groups: CareerGroup[];
};

type Mentor = {
    _id: string;
    name: string;
    avatar?: string | null;
};

export default function CourseRoadmap({
    course,
    mentors,
}: {
    course: Course;
    mentors: Mentor[];
}) {
    if (!course) return null;
    const { badges } = usePage().props as any;
    return (
        <section className="relative mt-10 w-full overflow-hidden rounded-xl border-t border-slate-800 bg-[#020202] py-16 font-sans text-white shadow-[inset_0_0_50px_rgba(0,0,0,0.8)] sm:py-20">
            <div className="relative z-10 mx-auto max-w-[1200px] px-2 sm:px-4">
                <div className="flex flex-col items-center">
                    {/* FUNDAMENTAL SECTION */}
                    <div className="flex w-full flex-col flex-nowrap items-center">
                        {course.basic_paths?.map((path, index) => (
                            <FundamentalNode
                                key={String(path._id)}
                                title={path.name}
                                index={index}
                                isLast={index === course.basic_paths.length - 1}
                                thumbnail={path.thumbnail}
                                href={`/admin/paths/${path._id}/modules`}
                            />
                        ))}
                    </div>

                    {/* CONNECTING PIPES TO BRANCHES */}
                    {course.career_groups?.length > 0 && (
                        <div className="mt-0 flex w-full justify-center">
                            {course.career_groups.map((group, idx) => {
                                const isFirst = idx === 0;
                                const isLast =
                                    idx === course.career_groups.length - 1;
                                const hasMultiple =
                                    course.career_groups.length > 1;

                                return (
                                    <div
                                        key={`pipe-${group._id}`}
                                        className="relative flex max-w-[340px] flex-1 flex-col items-center"
                                    >
                                        {/* Horizontal line piece linking the centers */}
                                        {hasMultiple && (
                                            <>
                                                {!isFirst && (
                                                    <div className="absolute top-0 left-0 h-[2px] w-1/2 bg-blue-500/70"></div>
                                                )}
                                                {!isLast && (
                                                    <div className="absolute top-0 right-0 h-[2px] w-1/2 bg-blue-500/70"></div>
                                                )}
                                            </>
                                        )}
                                        {/* Vertical line dropping to the CareerHeader */}
                                        <div className="h-10 w-[2px] bg-blue-500/70"></div>

                                        {/* Placed CareerBranch inside the column so it centers perfectly under the vertical drop */}
                                        <CareerBranch
                                            group={group}
                                            index={idx}
                                            total={course.career_groups.length}
                                            badges={badges}
                                            mentors={mentors}
                                            courseId={course._id}
                                        />
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
}
