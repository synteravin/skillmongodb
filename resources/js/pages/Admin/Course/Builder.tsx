import { useState } from "react"
import { router, Link } from "@inertiajs/react"
import {
    Plus,
    BookOpen,
    Briefcase,
    GraduationCap,
    Trophy,
    ChevronRight,
    Sparkles,
    FolderGit2,
    Route,
    PlusCircle,
    Layers
} from "lucide-react"

import AppLayout from "@/layouts/app-layout"
import Modal from "@/components/ui/Modal"
import CourseRoadmap from "@/components/course/CourseRoadmap"

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

    /* ================= HANDLERS ================= */
    function openCareerPathModal(groupId: string) {
        if (!groupId) return
        setCareerGroupId(groupId)
        setCareerPathName("")
        setOpenCareerPath(true)
    }

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

    function createCareerPath() {
        console.log("CREATE CAREER PATH 🔥", {
            careerGroupId,
            name: careerPathName
        })
        if (!careerGroupId || !careerPathName.trim()) return
        router.post("/admin/paths", {
            course_id: String(course._id),
            career_group_id: String(careerGroupId),
            phase: "career_branch",
            name: careerPathName.trim()
        }, {
            preserveScroll: true,
            onSuccess: () => {
                setCareerPathName("")
                setCareerGroupId(null)
                setOpenCareerPath(false)
            }
        })
    }

    return (
        <AppLayout>
            <div className="w-full mx-auto space-y-8 p-4">

                {/* ================= HEADER HERO SECTION ================= */}
                <div className="relative overflow-hidden rounded-3xl bg-white dark:bg-[#0a0d27] border border-gray-100 dark:border-slate-800/60 shadow-xl shadow-indigo-500/5 dark:shadow-indigo-500/10 p-5 sm:p-7">
                    <div className="absolute top-0 right-0 p-12 opacity-10 pointer-events-none">
                        <GraduationCap className="w-64 h-64 text-indigo-600 dark:text-indigo-400 transform rotate-12" />
                    </div>

                    <div className="absolute -left-10 -top-10 w-40 h-40 bg-indigo-500/20 dark:bg-indigo-500/10 rounded-full blur-3xl"></div>
                    <div className="absolute right-20 bottom-0 w-60 h-60 bg-emerald-500/20 dark:bg-emerald-500/10 rounded-full blur-3xl"></div>

                    <div className="relative z-5 flex flex-col md:flex-row md:items-end justify-between gap-6">
                        <div className="space-y-4">
                            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 text-sm font-medium border border-indigo-100 dark:border-indigo-500/20">
                                {/* <Sparkles className="w-4 h-4" /> */}
                                <span>Course Builder Workspace</span>
                            </div>
                            <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">
                                {course.title}
                            </h1>
                            <p className="text-slate-500 dark:text-slate-400 max-w-2xl text-lg">
                                Design and structure your curriculum by organizing basic fundamentals and career paths.
                            </p>
                        </div>

                        {/* <div className="flex shrink-0">
                            <Link
                                href="/admin/levelbadge"
                                className="group relative inline-flex items-center gap-2 px-6 py-3 bg-white dark:bg-slate-800 border border-emerald-200 dark:border-emerald-500/30 rounded-xl text-emerald-600 dark:text-emerald-400 font-semibold shadow-sm hover:shadow-md hover:border-emerald-300 dark:hover:border-emerald-500/50 transition-all overflow-hidden"
                            >
                                <div className="absolute inset-0 bg-emerald-50 dark:bg-emerald-500/10 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out"></div>
                                <Trophy className="w-5 h-5 relative z-10 group-hover:scale-110 transition-transform" />
                                <span className="relative z-10">Manage Badges</span>
                            </Link>
                        </div> */}
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

                    {/* ================= LEFT COLUMN (Basic Fundamentals) ================= */}
                    <div className="lg:col-span-5 space-y-6">
                        <div className="relative rounded-3xl p-6 bg-white dark:bg-gradient-to-br dark:from-[#0b0f2a] dark:to-[#050619] border border-gray-100 dark:border-slate-800 shadow-lg">
                            {/* Decorative element */}
                            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 dark:bg-blue-500/10 rounded-bl-full pointer-events-none"></div>

                            <div className="flex items-center justify-between mb-8 relative z-10">
                                <div className="flex items-center gap-3">
                                    <div className="p-2.5 rounded-xl bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400">
                                        <BookOpen className="w-6 h-6" />
                                    </div>
                                    <h2 className="text-xl font-bold text-slate-800 dark:text-white">
                                        Basic Fundamentals
                                    </h2>
                                </div>
                                <button
                                    onClick={() => setOpenBasicPath(true)}
                                    className="p-2.5 rounded-xl bg-slate-300 hover:bg-blue-50 dark:bg-slate-800 dark:hover:bg-blue-500/20 text-slate-500 hover:text-blue-600 dark:text-slate-400 dark:hover:text-blue-400 transition-colors border border-transparent hover:border-blue-200 dark:hover:border-blue-500/30 group"
                                    title="Add Path"
                                >
                                    <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform duration-300" />
                                </button>
                            </div>

                            <div className="space-y-4">
                                {course.basic_paths?.length === 0 ? (
                                    <div className="text-center py-10 px-4 border-2 border-dashed border-gray-100 dark:border-slate-800 rounded-2xl">
                                        <Layers className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto mb-3" />
                                        <p className="text-slate-500 dark:text-slate-400 text-sm">No fundamental paths created yet.</p>
                                    </div>
                                ) : (
                                    course.basic_paths?.map(path => (
                                        <div key={String(path._id)} className="group rounded-2xl border border-gray-100 dark:border-slate-800 bg-gray-50/50 dark:bg-slate-800/30 hover:bg-white dark:hover:bg-slate-800/80 transition-all duration-300 shadow-sm hover:shadow-md p-5">
                                            <div className="flex items-center gap-3 mb-4">
                                                <div className="w-2 h-2 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.5)]"></div>
                                                <h3 className="font-semibold text-slate-800 dark:text-white text-lg">
                                                    {path.name}
                                                </h3>
                                            </div>

                                            <div className="space-y-2.5 ml-5 border-l-2 border-gray-100 dark:border-slate-700 pl-4">
                                                {path.modules?.length === 0 ? (
                                                    <p className="text-xs text-slate-400 dark:text-slate-500 italic">No modules added yet.</p>
                                                ) : (
                                                    path.modules?.map(module => (
                                                        <div key={String(module._id)} className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors cursor-pointer group/item">
                                                            <ChevronRight className="w-4 h-4 text-slate-300 dark:text-slate-600 group-hover/item:text-blue-500 transition-colors" />
                                                            <span className="font-medium">{module.title}</span>
                                                        </div>
                                                    ))
                                                )}
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    </div>

                    {/* ================= RIGHT COLUMN (Career Paths) ================= */}
                    <div className="lg:col-span-7 space-y-6">
                        <div className="relative rounded-3xl p-6 lg:p-8 bg-white dark:bg-gradient-to-br dark:from-[#0b0f2a] dark:to-[#050619] border border-gray-100 dark:border-slate-800 shadow-lg">
                            <div className="absolute top-0 right-0 w-40 h-40 bg-indigo-500/5 dark:bg-indigo-500/10 rounded-bl-[100px] pointer-events-none"></div>

                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 relative z-10">
                                <div className="flex items-center gap-3">
                                    <div className="p-3 rounded-xl bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
                                        <Briefcase className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <h2 className="text-xl font-bold text-slate-800 dark:text-white">
                                            Career Paths
                                        </h2>
                                        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Group paths by career trajectory</p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => setOpenCareerGroup(true)}
                                    className="inline-flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold rounded-xl shadow-md shadow-indigo-500/20 hover:shadow-lg hover:shadow-indigo-500/30 transition-all duration-300 active:scale-95"
                                >
                                    <PlusCircle className="w-4 h-4" />
                                    <span>Career Group</span>
                                </button>
                            </div>

                            <div className="space-y-6">
                                {course.career_groups?.length === 0 ? (
                                    <div className="text-center py-12 px-4 border-2 border-dashed border-gray-100 dark:border-slate-800 rounded-2xl">
                                        <FolderGit2 className="w-16 h-16 text-slate-200 dark:text-slate-700 mx-auto mb-4" />
                                        <h3 className="text-lg font-medium text-slate-700 dark:text-slate-300 mb-1">No Career Groups</h3>
                                        <p className="text-slate-500 dark:text-slate-400 text-sm max-w-sm mx-auto">Create career groups to organize specific learning paths for different professional roles.</p>
                                    </div>
                                ) : (
                                    course.career_groups?.map(group => (
                                        <div key={String(group._id)} className="rounded-2xl border border-gray-200/60 dark:border-slate-700/60 bg-gray-50/30 dark:bg-slate-800/20 overflow-hidden">

                                            <div className="flex items-center justify-between p-4 sm:p-5 bg-white/50 dark:bg-slate-800/40 border-b border-gray-200/60 dark:border-slate-700/60 backdrop-blur-sm">
                                                <div className="flex items-center gap-3">
                                                    <div className="p-1.5 rounded-lg bg-emerald-100 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400">
                                                        <Route className="w-5 h-5" />
                                                    </div>
                                                    <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100">
                                                        {group.name}
                                                    </h3>
                                                </div>
                                                <button
                                                    onClick={() => openCareerPathModal(group._id)}
                                                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-50 hover:bg-indigo-100 dark:bg-indigo-500/10 dark:hover:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 text-sm font-medium transition-colors border border-indigo-100 dark:border-indigo-500/20"
                                                >
                                                    <Plus className="w-4 h-4" />
                                                    <span>Path</span>
                                                </button>
                                            </div>

                                            <div className="p-4 sm:p-5">
                                                {group.paths?.length === 0 ? (
                                                    <p className="text-sm text-slate-400 dark:text-slate-500 italic text-center py-4">No paths added to this group yet.</p>
                                                ) : (
                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                        {group.paths?.map(path => (
                                                            <div key={String(path._id)} className="group/path relative rounded-xl border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800/80 p-4 hover:border-indigo-300 dark:hover:border-indigo-500/50 hover:shadow-md transition-all duration-300">
                                                                <div className="absolute top-0 left-0 w-1 h-full bg-indigo-500 rounded-l-xl opacity-0 group-hover/path:opacity-100 transition-opacity"></div>

                                                                <h4 className="font-semibold text-slate-800 dark:text-white mb-3 flex items-center gap-2">
                                                                    <div className="w-1.5 h-1.5 rounded-full bg-slate-300 dark:bg-slate-600 group-hover/path:bg-indigo-500 transition-colors"></div>
                                                                    {path.name}
                                                                </h4>

                                                                <div className="space-y-2 ml-3 border-l border-gray-100 dark:border-slate-700 pl-3">
                                                                    {path.modules?.length === 0 ? (
                                                                        <p className="text-xs text-slate-400 italic">Empty path</p>
                                                                    ) : (
                                                                        path.modules?.map(module => (
                                                                            <div key={String(module._id)} className="text-sm text-slate-600 dark:text-slate-300 truncate hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors cursor-pointer" title={module.title}>
                                                                                <span className="text-slate-400 dark:text-slate-500 mr-1.5 text-xs">●</span>
                                                                                {module.title}
                                                                            </div>
                                                                        ))
                                                                    )}
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* ================= ROADMAP VISUALIZATION ================= */}
                <div className="rounded-3xl bg-white dark:bg-[#0a0d27] border border-gray-100 dark:border-slate-800 shadow-xl p-2 sm:p-4 md:p-6 lg:p-8 overflow-hidden relative mt-8">
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[80%] h-32 bg-indigo-500/10 rounded-full blur-[100px] pointer-events-none"></div>
                    <div className="relative z-10">
                        <CourseRoadmap course={course} mentors={mentors} />
                    </div>
                </div>

                {/* ================= MODALS ================= */}
                <Modal open={openCareerGroup} title="Create Career Group" onClose={() => setOpenCareerGroup(false)}>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Group Name</label>
                            <input
                                value={careerGroupName}
                                onChange={(e) => setCareerGroupName(e.target.value)}
                                placeholder="e.g. Frontend Web Developer"
                                className="w-full bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-xl px-4 py-3 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                                autoFocus
                            />
                        </div>
                        <div className="flex justify-end gap-3 pt-6">
                            <button
                                onClick={() => setOpenCareerGroup(false)}
                                className="px-5 py-2.5 rounded-xl font-medium bg-gray-100 hover:bg-gray-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                disabled={!careerGroupName.trim()}
                                onClick={createCareerGroup}
                                className="px-6 py-2.5 rounded-xl font-medium bg-indigo-600 hover:bg-indigo-700 text-white disabled:opacity-50 disabled:cursor-not-allowed shadow-md shadow-indigo-500/20 transition-all active:scale-95"
                            >
                                Create Group
                            </button>
                        </div>
                    </div>
                </Modal>

                <Modal open={openBasicPath} title="Create Basic Path" onClose={() => setOpenBasicPath(false)}>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Path Name</label>
                            <input
                                value={basicPathName}
                                onChange={(e) => setBasicPathName(e.target.value)}
                                placeholder="e.g. HTML & CSS Fundamentals"
                                className="w-full bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-xl px-4 py-3 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                autoFocus
                            />
                        </div>
                        <div className="flex justify-end gap-3 pt-6">
                            <button
                                onClick={() => setOpenBasicPath(false)}
                                className="px-5 py-2.5 rounded-xl font-medium bg-gray-100 hover:bg-gray-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                disabled={!basicPathName.trim()}
                                onClick={createBasicPath}
                                className="px-6 py-2.5 rounded-xl font-medium bg-blue-600 hover:bg-blue-700 text-white disabled:opacity-50 disabled:cursor-not-allowed shadow-md shadow-blue-500/20 transition-all active:scale-95"
                            >
                                Create Path
                            </button>
                        </div>
                    </div>
                </Modal>

                <Modal open={openCareerPath} title="Create Career Path" onClose={() => setOpenCareerPath(false)}>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Path Name</label>
                            <input
                                value={careerPathName}
                                onChange={(e) => setCareerPathName(e.target.value)}
                                placeholder="e.g. React.js Mastery"
                                className="w-full bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-xl px-4 py-3 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                                autoFocus
                            />
                        </div>
                        <div className="flex justify-end gap-3 pt-6">
                            <button
                                onClick={() => setOpenCareerPath(false)}
                                className="px-5 py-2.5 rounded-xl font-medium bg-gray-100 hover:bg-gray-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                disabled={!careerPathName.trim()}
                                onClick={createCareerPath}
                                className="px-6 py-2.5 rounded-xl font-medium bg-indigo-600 hover:bg-indigo-700 text-white disabled:opacity-50 disabled:cursor-not-allowed shadow-md shadow-indigo-500/20 transition-all active:scale-95"
                            >
                                Create Path
                            </button>
                        </div>
                    </div>
                </Modal>

            </div>
        </AppLayout>
    )
}
