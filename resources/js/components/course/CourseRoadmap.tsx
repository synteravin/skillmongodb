import FundamentalNode from "./FundamentalNode"
import CareerBranch from "./CareerBranch"
import { usePage } from "@inertiajs/react"

type Module = {
    _id: string
    title: string
    slug: string
}

type Path = {
    _id: string
    name: string
    modules: Module[]
}

type CareerGroup = {
    _id: string
    name: string
    paths: Path[]
}

type Course = {
    _id: string
    title: string
    basic_paths: Path[]
    career_groups: CareerGroup[]
}

type Mentor = {
    _id: string
    name: string
    avatar?: string | null
}

export default function CourseRoadmap({ course, mentors }: { course: Course, mentors: Mentor[] }) {
    if (!course) return null;
    const { badges } = usePage().props as any;
    return (
        <section className="w-full py-16 sm:py-20 bg-[#040812] relative overflow-hidden font-sans border-t-2 border-[#1e2759] mt-20 text-white rounded-xl shadow-[inset_0_0_50px_rgba(0,0,0,0.5)]">
            <div className="mx-auto max-w-[1200px] px-2 sm:px-4 relative z-10">

                <div className="flex flex-col items-center">
                    {/* FUNDAMENTAL SECTION */}
                    <div className="flex flex-col flex-nowrap items-center w-full">
                        {course.basic_paths?.map((path, index) => (
                            <FundamentalNode
                                key={String(path._id)}
                                title={path.name}
                                index={index}
                                isLast={index === (course.basic_paths.length - 1)}
                                href={`/admin/paths/${path._id}/modules`}
                            />
                        ))}
                    </div>

                    {/* CONNECTING PIPES TO BRANCHES */}
                    {course.career_groups?.length > 0 && (
                        <div className="w-full flex justify-center mt-0">
                            {course.career_groups.map((group, idx) => {
                                const isFirst = idx === 0;
                                const isLast = idx === course.career_groups.length - 1;
                                const hasMultiple = course.career_groups.length > 1;

                                return (
                                    <div key={`pipe-${group._id}`} className="relative flex flex-col items-center flex-1 max-w-[340px]">
                                        {/* Horizontal line piece linking the centers */}
                                        {hasMultiple && (
                                            <>
                                                {!isFirst && <div className="absolute top-0 left-0 w-1/2 h-[2px] bg-gray-300"></div>}
                                                {!isLast && <div className="absolute top-0 right-0 w-1/2 h-[2px] bg-gray-300"></div>}
                                            </>
                                        )}
                                        {/* Vertical line dropping to the CareerHeader */}
                                        <div className="w-[2px] h-10 bg-gray-300"></div>

                                        {/* Placed CareerBranch inside the column so it centers perfectly under the vertical drop */}
                                        <CareerBranch group={group} index={idx} total={course.career_groups.length} badges={badges} mentors={mentors} courseId={course._id} />
                                    </div>
                                )
                            })}
                        </div>
                    )}
                </div>

            </div>
        </section>
    )
}