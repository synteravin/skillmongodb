import { useState } from "react"
import { router } from "@inertiajs/react"

import AppLayout from "@/layouts/app-layout"
import Modal from "@/components/ui/Modal"
import CourseRoadmap from "@/components/course/CourseRoadmap"

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
    _id: string
    title: string
    basic_paths: Path[]
    career_groups: CareerGroup[]
}

export default function Builder({ course }: { course: Course }) {

    /* ---------------- MODAL STATE ---------------- */

    const [openCareerGroup, setOpenCareerGroup] = useState(false)
    const [openBasicPath, setOpenBasicPath] = useState(false)

    /* ---------------- FORM STATE ---------------- */

    const [careerGroupName, setCareerGroupName] = useState("")
    const [pathName, setPathName] = useState("")

    /* ---------------- ACTIONS ---------------- */

    function createCareerGroup() {

        router.post("/admin/career-groups", {

            course_id: course._id,
            name: careerGroupName

        }, {

            preserveScroll: true

        })

        setCareerGroupName("")
        setOpenCareerGroup(false)

    }

    function createBasicPath() {

        router.post("/admin/paths", {

            course_id: course._id,
            phase: "basic_fundamental",
            name: pathName

        }, {

            preserveScroll: true

        })

        setPathName("")
        setOpenBasicPath(false)

    }

    /* ---------------- UI ---------------- */

    return (

        <AppLayout>

            <div className="p-8 max-w-6xl mx-auto space-y-10">

                {/* HEADER */}

                <div>

                    <h1 className="text-3xl font-bold">
                        {course.title}
                    </h1>
                    <p className="text-sm text-gray-500">
                        Course Builder
                    </p>

                </div>


                {/* ================= BASIC FUNDAMENTAL ================= */}

                <div className="border rounded-xl p-6">

                    <div className="flex justify-between mb-6">

                        <h2 className="text-lg font-semibold">
                            Basic Fundamental
                        </h2>

                        <button
                            onClick={() => setOpenBasicPath(true)}
                            className="px-3 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                        >
                            + Path
                        </button>

                    </div>


                    <div className="space-y-3">

                        {course.basic_paths?.map(path => (

                            <div
                                key={path._id}
                                className="border rounded-lg p-4"
                            >

                                <p className="font-medium">
                                    {path.name}
                                </p>

                                <div className="ml-4 mt-2 space-y-1 text-sm text-gray-500">

                                    {path.modules?.map(module => (

                                        <div key={module._id}>
                                            {module.title}
                                        </div>

                                    ))}

                                </div>

                            </div>

                        ))}

                    </div>

                </div>


                {/* ================= CAREER PATH ================= */}

                <div className="border rounded-xl p-6">

                    <div className="flex justify-between mb-6">

                        <h2 className="text-lg font-semibold">
                            Career Path
                        </h2>

                        <button
                            onClick={() => setOpenCareerGroup(true)}
                            className="px-3 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                        >
                            + Career Group
                        </button>

                    </div>


                    <div className="space-y-6">

                        {course.career_groups?.map(group => (

                            <div key={group._id}>

                                <h3 className="font-semibold mb-3">
                                    {group.name}
                                </h3>

                                <div className="space-y-3 ml-4">

                                    {group.paths?.map(path => (

                                        <div
                                            key={path._id}
                                            className="border rounded-lg p-4"
                                        >

                                            <p className="font-medium">
                                                {path.name}
                                            </p>

                                            <div className="ml-4 mt-2 space-y-1 text-sm text-gray-500">

                                                {path.modules?.map(module => (

                                                    <div key={module._id}>
                                                        {module.title}
                                                    </div>

                                                ))}

                                            </div>

                                        </div>

                                    ))}

                                </div>

                            </div>

                        ))}

                    </div>

                </div>


                {/* ================= ROADMAP VISUAL ================= */}

                <CourseRoadmap course={course} />


                {/* ================= MODAL CREATE CAREER GROUP ================= */}

                <Modal
                    open={openCareerGroup}
                    title="Create Career Group"
                    onClose={() => setOpenCareerGroup(false)}
                >

                    <div className="space-y-4">

                        <input
                            value={careerGroupName}
                            onChange={(e) => setCareerGroupName(e.target.value)}
                            placeholder="Frontend Developer"
                            className="w-full border rounded-lg p-2"
                        />

                        <div className="flex justify-end gap-2">

                            <button
                                onClick={() => setOpenCareerGroup(false)}
                                className="px-4 py-2 bg-gray-200 rounded"
                            >
                                Cancel
                            </button>

                            <button
                                onClick={createCareerGroup}
                                className="px-4 py-2 bg-indigo-600 text-white rounded"
                            >
                                Create
                            </button>

                        </div>

                    </div>

                </Modal>


                {/* ================= MODAL CREATE BASIC PATH ================= */}

                <Modal
                    open={openBasicPath}
                    title="Create Basic Path"
                    onClose={() => setOpenBasicPath(false)}
                >

                    <div className="space-y-4">

                        <input
                            value={pathName}
                            onChange={(e) => setPathName(e.target.value)}
                            placeholder="HTML Fundamental"
                            className="w-full border rounded-lg p-2"
                        />

                        <div className="flex justify-end gap-2">

                            <button
                                onClick={() => setOpenBasicPath(false)}
                                className="px-4 py-2 bg-gray-200 rounded"
                            >
                                Cancel
                            </button>

                            <button
                                onClick={createBasicPath}
                                className="px-4 py-2 bg-indigo-600 text-white rounded"
                            >
                                Create
                            </button>

                        </div>

                    </div>

                </Modal>

            </div>

        </AppLayout>

    )

}