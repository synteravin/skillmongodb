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

        <div className="flex flex-col items-center space-y-12">

            {/* BASIC FUNDAMENTAL */}

            <div className="flex flex-col items-center space-y-6">

                {course.basic_paths.map((path, index) => (

                    <FundamentalNode
                        key={path._id}
                        title={path.name}
                        index={index}
                    />

                ))}

            </div>


            {/* CAREER BRANCH */}

            <div className="flex gap-20">

                {course.career_groups.map(group => (

                    <CareerBranch
                        key={group._id}
                        group={group}
                    />

                ))}

            </div>

        </div>

    )

}