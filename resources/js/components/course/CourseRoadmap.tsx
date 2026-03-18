import FundamentalNode from "./FundamentalNode"
import CareerBranch from "./CareerBranch"

type Module = {
    _id: string
    title: string
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
    title: string
    basic_paths: Path[]
    career_groups: CareerGroup[]
}

export default function CourseRoadmap({ course }: { course: Course }) {

    return (

        <section className="w-full py-16 sm:py-20">

            <div className="mx-auto max-w-5xl px-4 sm:px-6">

                {/* HEADER */}

                <div className="text-center mb-16">

                    <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight text-gray-900 dark:text-white">
                        {course.title} Roadmap
                    </h2>

                    <p className="mt-3 text-sm sm:text-base text-gray-600 dark:text-gray-400">
                        Ikuti jalur pembelajaran dari fundamental hingga spesialisasi karier.
                    </p>

                </div>


                <div className="flex flex-col items-center gap-16">

                    {/* FUNDAMENTAL SECTION */}

                    <div className="flex flex-col items-center gap-6">

                        {course.basic_paths.map((path, index) => (

                            <FundamentalNode
                                key={String(path._id)}
                                title={path.name}
                                index={index}
                            />

                        ))}

                    </div>


                    {/* CAREER BRANCH SECTION */}
                    <div className="w-full max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-20 items-start justify-items-center">
                        {course.career_groups.map(group => (
                            <CareerBranch
                                key={String(group._id)}
                                group={group}
                            />
                        ))}
                    </div>

                </div>

            </div>

        </section>

    )

}