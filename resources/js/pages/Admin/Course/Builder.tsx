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

            <div className="border border-gray-200 dark:border-slate-800 rounded-2xl p-6 
                bg-white dark:bg-gradient-to-br dark:from-[#0b0f2a] dark:to-[#050619] shadow-lg transition">

                {/* Top Action */}
                <div className="flex justify-between items-center mb-6">
                    <Link
                        href="/admin/levelbadge"
                        className="text-sm font-medium px-4 py-2 rounded-lg 
                        bg-emerald-100 text-emerald-600 
                        dark:bg-emerald-500/10 dark:text-emerald-400 
                        hover:bg-emerald-500 hover:text-white 
                        transition duration-300"
                    >
                        Manage Badges
                    </Link>

                    <button
                        onClick={() => setOpenBasicPath(true)}
                        className="px-4 py-2 bg-indigo-600 text-white rounded-lg shadow 
                        hover:bg-indigo-700 hover:scale-105 
                        transition duration-300"
                    >
                        + Path
                    </button>
                </div>

                {/* Title */}
                <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4 tracking-wide">
                    Basic Fundamental
                </h2>

                {/* Content */}
                <div className="space-y-4">

                    {course.basic_paths?.map(path => (

                        <div
                            key={String(path._id)}
                            className="border border-gray-200 dark:border-slate-700 rounded-xl p-4 
                            bg-gray-50 dark:bg-slate-800/60 
                            hover:bg-gray-100 dark:hover:bg-slate-800 
                            transition duration-300 shadow-sm"
                        >

                            <p className="font-semibold text-emerald-600 dark:text-emerald-400 text-base">
                                {path.name}
                            </p>

                            <div className="ml-4 mt-3 space-y-2 text-sm 
                                text-gray-600 dark:text-slate-300">

                                {path.modules?.map(module => (

                                    <div 
                                        key={String(module._id)}
                                        className="hover:text-gray-900 dark:hover:text-white transition cursor-pointer"
                                    >
                                        • {module.title}
                                    </div>

                                ))}

                            </div>

                        </div>

                    ))}

                </div>

            </div>


                {/* ================= CAREER PATH ================= */}

            <div className="border border-gray-200 dark:border-slate-800 rounded-2xl p-6 
                bg-white dark:bg-gradient-to-br dark:from-[#0b0f2a] dark:to-[#050619] 
                shadow-lg transition">

                {/* Header */}
                <div className="flex items-center justify-between mb-6 p-4 rounded-xl  bg-gray-50 dark:bg-slate-800/60 border border-gray-200 dark:border-slate-700">
                    {/* Title */}
                    <h2 className="text-xl font-semibold text-gray-800 dark:text-white tracking-wide">
                        Career Path
                    </h2>

                    {/* Button */}
                    <button
                        onClick={() => setOpenCareerGroup(true)}
                        className="px-5 py-2.5  bg-indigo-600 text-white text-sm font-medium rounded-xl shadow-md hover:bg-indigo-700 hover:scale-[1.03] transition duration-300"
                    >
                        + Career Group
                    </button>

                </div>

                {/* Content */}
                <div className="space-y-6">

                    {course.career_groups?.map(group => (

                        <div key={String(group._id)} 
                            className="p-4 rounded-xl border border-gray-200 dark:border-slate-700 
                            bg-gray-50 dark:bg-slate-800/50 shadow-sm">

                            {/* Group Header */}
                            <div className="flex items-center justify-between mb-3">

                                <h3 className="font-semibold text-emerald-600 dark:text-emerald-400">
                                    {group.name}
                                </h3>

                                <button
                                    onClick={() => openCareerPathModal(group._id)}
                                    className="text-sm px-3 py-1 rounded-lg 
                                    bg-indigo-500 text-white 
                                    hover:bg-indigo-600 hover:scale-105 
                                    transition duration-300"
                                >
                                    + Path
                                </button>

                            </div>

                            {/* Paths */}
                            <div className="space-y-3 ml-2">

                                {group.paths?.map(path => (

                                    <div
                                        key={String(path._id)}
                                        className="border border-gray-200 dark:border-slate-700 rounded-xl p-4 
                                        bg-white dark:bg-slate-800/60 
                                        hover:bg-gray-100 dark:hover:bg-slate-800 
                                        transition duration-300"
                                    >

                                        <p className="font-semibold text-gray-800 dark:text-white">
                                            {path.name}
                                        </p>

                                        <div className="ml-4 mt-3 space-y-2 text-sm 
                                            text-gray-600 dark:text-slate-300">

                                            {path.modules?.map(module => (

                                                <div 
                                                    key={String(module._id)}
                                                    className="hover:text-gray-900 dark:hover:text-white transition cursor-pointer"
                                                >
                                                    • {module.title}
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

                    <div className="flex justify-end gap-3 pt-4 border-t border-gray-200 dark:border-slate-700">

                    <button
                        onClick={() => setOpenCareerGroup(false)}
                        className="px-4 py-2 
                        rounded-lg 
                        bg-gray-100 dark:bg-slate-800 
                        text-gray-700 dark:text-slate-300 
                        border border-gray-200 dark:border-slate-700"
                    >
                        Cancel
                    </button>

                    <button
                        disabled={!careerGroupName.trim()}
                        onClick={createCareerGroup}
                        className="px-5 py-2 
                        rounded-lg 
                        bg-indigo-600 dark:bg-[#3B28F6] 
                        text-white 
                        disabled:opacity-40"
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

                   <div className="flex justify-end gap-3 pt-4 border-t border-gray-200 dark:border-slate-700">
                        <button
                            onClick={() => setOpenBasicPath(false)}
                            className="px-4 py-2 
                            rounded-lg 
                            bg-gray-100 dark:bg-slate-800 
                            text-gray-700 dark:text-slate-300 
                            border border-gray-200 dark:border-slate-700"
                        >
                            Cancel
                        </button>

                        <button
                            disabled={!basicPathName.trim()}
                            onClick={createBasicPath}
                            className="px-5 py-2 
                            rounded-lg  bg-indigo-600
                            dark:bg-[#3B28F6] text-white 
                            disabled:opacity-40"
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

                   <div className="flex justify-end gap-3 pt-4 border-t border-gray-200 dark:border-slate-700">

                    <button
                        onClick={() => setOpenCareerPath(false)}
                        className="px-4 py-2 
                        rounded-lg 
                        bg-gray-100 dark:bg-slate-800 
                        text-gray-700 dark:text-slate-300 
                        border border-gray-200 dark:border-slate-700"
                    >
                        Cancel
                    </button>

                    <button
                        disabled={!careerPathName.trim()}
                        onClick={createCareerPath}
                        className="px-5 py-2 
                        rounded-lg 
                        bg-indigo-600 dark:bg-indigo-500 
                        text-white 
                        border border-indigo-600 dark:border-indigo-500
                        disabled:opacity-40"
                    >
                        Create
                    </button>

                </div>

                </Modal>

            </div>

        </AppLayout>

    )

}