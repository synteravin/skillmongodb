import { useState } from "react"
import { router, Link } from "@inertiajs/react"

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

type Mentor = {
    _id: string
    name: string
    avatar?: string | null
}

export default function Builder({ course, mentors }: { course: Course, mentors: Mentor[] }) {

    /* ================= MODAL STATE ================= */

    const [openCareerGroup, setOpenCareerGroup] = useState(false)
    const [openBasicPath, setOpenBasicPath] = useState(false)
    const [openCareerPath, setOpenCareerPath] = useState(false)

    /* ================= FORM STATE ================= */

    const [careerGroupName, setCareerGroupName] = useState("")
    const [basicPathName, setBasicPathName] = useState("")
    const [careerPathName, setCareerPathName] = useState("")

    const [careerGroupId, setCareerGroupId] = useState<string | null>(null)

    /* ================= OPEN MODAL ================= */

    function openCareerPathModal(groupId: string) {

        if (!groupId) {
            console.error("Invalid group id")
            return
        }

        setCareerGroupId(groupId)
        setCareerPathName("")
        setOpenCareerPath(true)

    }

    /* ================= CREATE CAREER GROUP ================= */

    function createCareerGroup() {

        if (!careerGroupName.trim()) return

        router.post("/admin/career-groups", {

            course_id: String(course._id),
            name: careerGroupName

        }, {
            preserveScroll: true,
            onSuccess: () => {
                setCareerGroupName("")
                setOpenCareerGroup(false)
            }
        })

    }

    /* ================= CREATE BASIC PATH ================= */

    function createBasicPath() {

        if (!basicPathName.trim()) return

        router.post("/admin/paths", {

            course_id: String(course._id),
            phase: "basic_fundamental",
            name: basicPathName

        }, {
            preserveScroll: true,
            onSuccess: () => {
                setBasicPathName("")
                setOpenBasicPath(false)
            }
        })

    }

    /* ================= CREATE CAREER PATH ================= */

    function createCareerPath() {

        if (!careerGroupId) {
            console.error("Career group ID missing")
            return
        }

        if (!careerPathName.trim()) {
            console.error("Path name empty")
            return
        }

        router.post("/admin/paths", {

            course_id: String(course._id),
            career_group_id: String(careerGroupId),
            phase: "career_path",
            name: careerPathName.trim()

        }, {

            preserveScroll: true,

            onSuccess: () => {

                setCareerPathName("")
                setCareerGroupId(null)
                setOpenCareerPath(false)

            },

            onError: (errors) => {

                console.error("Create path failed:", errors)

            }

        })

    }

    return (

        <AppLayout>

            <div className="p-10 max-w-6xl mx-auto space-y-12">

                {/* HEADER */}

                <div>

                    <h1 className="text-3xl font-bold">
                        {course.title}
                    </h1>

                    <p className="text-sm text-gray-500 mt-1">
                        Course Builderrrr
                    </p>

                </div>


                {/* ================= BASIC FUNDAMENTAL ================= */}

                <div className="border rounded-xl p-6 bg-white/50 backdrop-blur-sm">

                    <Link
                        href="/admin/levelbadge"
                        className="bg-gray-200 px-3 py-1 rounded"
                    >
                        Manage Badges
                    </Link>

                    <div className="flex justify-between items-center mb-6">

                        <h2 className="text-lg font-semibold">
                            Basic Fundamental
                        </h2>

                        <button
                            onClick={() => setOpenBasicPath(true)}
                            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
                        >
                            + Path
                        </button>

                    </div>

                    <div className="space-y-3">

                        {course.basic_paths?.map(path => (

                            <div
                                key={String(path._id)}
                                className="border rounded-lg p-4 bg-gray-50"
                            >

                                <p className="font-medium">
                                    {path.name}
                                </p>

                                <div className="ml-4 mt-2 space-y-1 text-sm text-gray-500">

                                    {path.modules?.map(module => (

                                        <div key={String(module._id)}>
                                            {module.title}
                                        </div>

                                    ))}

                                </div>

                            </div>

                        ))}

                    </div>

                </div>


                {/* ================= CAREER PATH ================= */}

                <div className="border rounded-xl p-6 bg-white/50 backdrop-blur-sm">

                    <div className="flex justify-between items-center mb-6">

                        <h2 className="text-lg font-semibold">
                            Career Path
                        </h2>

                        <button
                            onClick={() => setOpenCareerGroup(true)}
                            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
                        >
                            + Career Group
                        </button>

                    </div>

                    <div className="space-y-6">

                        {course.career_groups?.map(group => (

                            <div key={String(group._id)}>

                                <div className="flex items-center justify-between mb-2">

                                    <h3 className="font-semibold">
                                        {group.name}
                                    </h3>

                                    <button
                                        onClick={() => openCareerPathModal(group._id)}
                                        className="text-sm px-3 py-1 bg-indigo-500 text-white rounded hover:bg-indigo-600"
                                    >
                                        + Path
                                    </button>

                                </div>

                                <div className="space-y-3 ml-4">

                                    {group.paths?.map(path => (

                                        <div
                                            key={String(path._id)}
                                            className="border rounded-lg p-4 bg-gray-50"
                                        >

                                            <p className="font-medium">
                                                {path.name}
                                            </p>

                                            <div className="ml-4 mt-2 space-y-1 text-sm text-gray-500">

                                                {path.modules?.map(module => (

                                                    <div key={String(module._id)}>
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


                {/* ================= ROADMAP ================= */}

                <CourseRoadmap course={course} mentors={mentors} />


                {/* ================= MODALS ================= */}

                <Modal
                    open={openCareerGroup}
                    title="Create Career Group"
                    onClose={() => setOpenCareerGroup(false)}
                >

                    <input
                        value={careerGroupName}
                        onChange={(e) => setCareerGroupName(e.target.value)}
                        placeholder="Frontend Developer"
                        className="w-full border rounded-lg p-3 mb-4"
                    />

                    <div className="flex justify-end gap-2">

                        <button
                            onClick={() => setOpenCareerGroup(false)}
                            className="px-4 py-2 bg-gray-200 rounded"
                        >
                            Cancel
                        </button>

                        <button
                            disabled={!careerGroupName.trim()}
                            onClick={createCareerGroup}
                            className="px-4 py-2 bg-indigo-600 text-white rounded disabled:opacity-40"
                        >
                            Create
                        </button>

                    </div>

                </Modal>


                <Modal
                    open={openBasicPath}
                    title="Create Basic Path"
                    onClose={() => setOpenBasicPath(false)}
                >

                    <input
                        value={basicPathName}
                        onChange={(e) => setBasicPathName(e.target.value)}
                        placeholder="HTML Fundamentals"
                        className="w-full border rounded-lg p-3 mb-4"
                    />

                    <div className="flex justify-end gap-2">

                        <button
                            onClick={() => setOpenBasicPath(false)}
                            className="px-4 py-2 bg-gray-200 rounded"
                        >
                            Cancel
                        </button>

                        <button
                            disabled={!basicPathName.trim()}
                            onClick={createBasicPath}
                            className="px-4 py-2 bg-indigo-600 text-white rounded disabled:opacity-40"
                        >
                            Create
                        </button>

                    </div>

                </Modal>

                <Modal
                    open={openCareerPath}
                    title="Create Career Path"
                    onClose={() => setOpenCareerPath(false)}
                >

                    <input
                        value={careerPathName}
                        onChange={(e) => setCareerPathName(e.target.value)}
                        placeholder="React Developer"
                        className="w-full border rounded-lg p-3 mb-4"
                    />

                    <div className="flex justify-end gap-2">

                        <button
                            onClick={() => setOpenCareerPath(false)}
                            className="px-4 py-2 bg-gray-200 rounded"
                        >
                            Cancel
                        </button>

                        <button
                            disabled={!careerPathName.trim()}
                            onClick={createCareerPath}
                            className="px-4 py-2 bg-indigo-600 text-white rounded disabled:opacity-40"
                        >
                            Create
                        </button>

                    </div>

                </Modal>

            </div>

        </AppLayout>

    )

}