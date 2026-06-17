import { useState } from "react"
import { router, Link } from "@inertiajs/react"
import {
    Plus,
    FolderGit2,
    PlusCircle,
    Layers,
    ArrowLeft
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
            <div 
                className="min-h-screen bg-[#f8fafc] dark:bg-[#030712] text-slate-800 dark:text-white px-4 py-8 sm:px-6 lg:px-8 transition-colors duration-200"
                style={{ fontFamily: "'Outfit', sans-serif" }}
            >
                <div className="w-full mx-auto space-y-8">

                    {/* ================= HEADER HERO SECTION ================= */}
                <header
                        className="relative overflow-hidden rounded-xl px-6 py-5 bg-white dark:bg-[#0d0f17] border border-slate-200 dark:border-slate-800 shadow-sm"
                        style={{
                            backgroundImage: `
                            linear-gradient(rgba(59,40,246,0.03) 1px, transparent 1px),
                            linear-gradient(90deg, rgba(59,40,246,0.03) 1px, transparent 1px)
                            `,
                            backgroundSize: '40px 40px',
                        }}
                    >
                        {/* Corner brackets */}
                        <span className="absolute left-3.5 top-3.5 h-3 w-3 border-l border-t border-slate-200 dark:border-[rgba(59,40,246,0.35)]" />
                        <span className="absolute right-3.5 top-3.5 h-3 w-3 border-r border-t border-slate-200 dark:border-[rgba(59,40,246,0.35)]" />
                        <span className="absolute bottom-3.5 left-3.5 h-3 w-3 border-b border-l border-slate-200 dark:border-[rgba(59,40,246,0.35)]" />
                        <span className="absolute bottom-3.5 right-3.5 h-3 w-3 border-b border-r border-slate-200 dark:border-[rgba(59,40,246,0.35)]" />

                        <div className="relative z-10 flex flex-col gap-3">
                            <div className="flex items-center gap-3">
                                {/* Back button */}
                                <Link
                                    href="/admin/courses"
                                    className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-slate-700 transition-all group"
                                    title="Back to Courses"
                                >
                                    <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
                                </Link>
                                <div className="h-8 w-px bg-slate-200 dark:bg-slate-800/60" />

                                {/* Badge */}
                                <div className="inline-flex w-fit items-center gap-1.5 rounded border px-2.5 py-1
                                dark:border-[rgba(59,40,246,0.35)] dark:bg-[rgba(59,40,246,0.1)]
                                border-slate-200 bg-slate-50 text-slate-600 dark:text-[#7C5CFF]"
                                >
                                    <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[#3B28F6]" />
                                    <span className="text-[10px] font-bold uppercase tracking-[0.12em]">
                                        Course Builder Workspace
                                    </span>
                                </div>
                            </div>

                            {/* Title */}
                            <h1
                                className="m-0 text-2xl sm:text-3xl font-bold leading-none tracking-tight"
                                style={{
                                    background: 'linear-gradient(135deg, #2a1ce0 0%, #3B28F6 100%)',
                                    WebkitBackgroundClip: 'text',
                                    WebkitTextFillColor: 'transparent',
                                    backgroundClip: 'text',
                                    fontFamily: 'Orbitron, sans-serif',
                                }}
                            >
                                {course.title}
                            </h1>

                            {/* Subtitle */}
                            <p className="m-0 text-xs sm:text-sm text-slate-500 dark:text-slate-400">
                                Design and structure your curriculum by organizing basic fundamentals and career paths.
                            </p>
                        </div>
                    </header>

                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

                        {/* ================= LEFT COLUMN (Basic Fundamentals) ================= */}
                        <div className="lg:col-span-5">
                            <div
                                className="relative flex flex-col overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-gradient-to-b dark:from-[#0e0e1a] dark:to-[#090910]"
                                style={{ fontFamily: "'Outfit', sans-serif" }}
                            >
                                {/* Top accent line */}
                                <div className="absolute top-0 right-8 left-8 h-px bg-gradient-to-r from-transparent via-slate-300 to-transparent dark:via-slate-700" />

                                {/* Card Header */}
                                <div className="flex items-center justify-between border-b border-slate-200 px-5 py-3.5 sm:px-6 dark:border-white/5">
                                    <div>
                                        <h2 className="text-sm font-bold tracking-[0.2em] text-slate-800 uppercase dark:text-white">
                                            Basic Fundamentals
                                        </h2>
                                        <p className="mt-0.5 text-[10px] text-slate-400 dark:text-slate-500">
                                            Foundation paths for all students
                                        </p>
                                    </div>
                                    <button
                                        onClick={() => setOpenBasicPath(true)}
                                        className="inline-flex items-center gap-1.5 rounded border border-slate-200 bg-slate-50 px-3 py-1.5 text-[10px] font-bold uppercase tracking-widest text-slate-600 transition-colors hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-800/50 dark:text-slate-300 dark:hover:bg-slate-800"
                                        title="Add Path"
                                    >
                                        <Plus className="w-3 h-3" />
                                        Add Path
                                    </button>
                                </div>

                                {/* Card Body */}
                                <div className="p-5 sm:p-6 space-y-3">
                                    {course.basic_paths?.length === 0 ? (
                                        <div className="flex flex-col items-center justify-center py-12 text-center">
                                            <Layers className="w-8 h-8 text-slate-300 dark:text-slate-700 mx-auto mb-3" />
                                            <p className="text-xs font-semibold tracking-wider text-slate-400 uppercase dark:text-slate-500">
                                                No fundamental paths yet
                                            </p>
                                        </div>
                                    ) : (
                                        course.basic_paths?.map(path => (
                                            <div
                                                key={String(path._id)}
                                                className="rounded-lg border border-slate-200 bg-slate-50/50 p-3.5 transition-colors hover:bg-slate-100 dark:border-slate-800 dark:bg-slate-900/10 dark:hover:bg-slate-800/20"
                                            >
                                                <div className="flex items-start justify-between gap-3 mb-2.5">
                                                    <h3 className="text-xs font-semibold text-slate-800 dark:text-white truncate">
                                                        {path.name}
                                                    </h3>
                                                    <span className="rounded border border-slate-200 bg-white px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-slate-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-400 shrink-0">
                                                        {path.modules?.length ?? 0} modules
                                                    </span>
                                                </div>
                                                <div className="border-t border-slate-200 dark:border-slate-800 mt-2.5 pt-2.5 space-y-1.5">
                                                    {path.modules?.length === 0 ? (
                                                        <p className="text-[10px] text-slate-400 dark:text-slate-500 italic">No modules added yet.</p>
                                                    ) : (
                                                        path.modules?.map(module => (
                                                            <div key={String(module._id)} className="flex items-center gap-2">
                                                                <span className="w-1 h-1 rounded-full bg-slate-400 dark:bg-slate-600 shrink-0" />
                                                                <span className="text-[11px] text-slate-600 dark:text-slate-300 truncate">{module.title}</span>
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
                        <div className="lg:col-span-7">
                            <div
                                className="relative flex flex-col overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-gradient-to-b dark:from-[#0e0e1a] dark:to-[#090910]"
                                style={{ fontFamily: "'Outfit', sans-serif" }}
                            >
                                {/* Top accent line */}
                                <div className="absolute top-0 right-8 left-8 h-px bg-gradient-to-r from-transparent via-slate-300 to-transparent dark:via-slate-700" />

                                {/* Card Header */}
                                <div className="flex items-center justify-between border-b border-slate-200 px-5 py-3.5 sm:px-6 dark:border-white/5">
                                    <div>
                                        <h2 className="text-sm font-bold tracking-[0.2em] text-slate-800 uppercase dark:text-white">
                                            Career Paths
                                        </h2>
                                        <p className="mt-0.5 text-[10px] text-slate-400 dark:text-slate-500">
                                            Group paths by career trajectory
                                        </p>
                                    </div>
                                    <button
                                        onClick={() => setOpenCareerGroup(true)}
                                        className="inline-flex items-center gap-1.5 rounded border border-slate-200 bg-slate-50 px-3 py-1.5 text-[10px] font-bold uppercase tracking-widest text-slate-600 transition-colors hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-800/50 dark:text-slate-300 dark:hover:bg-slate-800"
                                    >
                                        <PlusCircle className="w-3 h-3" />
                                        New Group
                                    </button>
                                </div>

                                {/* Card Body */}
                                <div className="p-5 sm:p-6 space-y-4">
                                    {course.career_groups?.length === 0 ? (
                                        <div className="flex flex-col items-center justify-center py-12 text-center">
                                            <FolderGit2 className="w-8 h-8 text-slate-300 dark:text-slate-700 mx-auto mb-3" />
                                            <p className="text-xs font-semibold tracking-wider text-slate-400 uppercase dark:text-slate-500">
                                                No career groups yet
                                            </p>
                                            <p className="mt-1.5 text-[10px] text-slate-400 dark:text-slate-600 max-w-xs">
                                                Create career groups to organize specific learning paths for different professional roles.
                                            </p>
                                        </div>
                                    ) : (
                                        course.career_groups?.map(group => (
                                            <div
                                                key={String(group._id)}
                                                className="overflow-hidden rounded-lg border border-slate-200 dark:border-slate-800"
                                            >
                                                {/* Group Header */}
                                                <div className="flex items-center justify-between bg-slate-50 dark:bg-slate-900/30 px-4 py-3 border-b border-slate-200 dark:border-slate-800">
                                                    <div className="flex items-center gap-2.5">
                                                        <div className="h-2 w-2 rounded-full bg-slate-400 dark:bg-slate-500 shadow-sm" />
                                                        <span className="text-xs font-semibold text-slate-800 dark:text-white">
                                                            {group.name}
                                                        </span>
                                                        <span className="rounded border border-slate-200 bg-white px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-slate-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-400">
                                                            {group.paths?.length ?? 0} paths
                                                        </span>
                                                    </div>
                                                    <button
                                                        onClick={() => openCareerPathModal(group._id)}
                                                        className="inline-flex items-center gap-1 rounded border border-slate-200 bg-white px-2.5 py-1 text-[9px] font-bold uppercase tracking-wider text-slate-600 transition-colors hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
                                                    >
                                                        <Plus className="w-3 h-3" />
                                                        Path
                                                    </button>
                                                </div>

                                                {/* Paths Grid */}
                                                <div className="p-4 bg-white/30 dark:bg-transparent">
                                                    {group.paths?.length === 0 ? (
                                                        <p className="py-4 text-center text-[10px] text-slate-400 dark:text-slate-500 italic">
                                                            No paths added to this group yet.
                                                        </p>
                                                    ) : (
                                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                                            {group.paths?.map(path => (
                                                                <div
                                                                    key={String(path._id)}
                                                                    className="rounded-lg border border-slate-200 bg-slate-50/50 p-3 transition-colors hover:bg-slate-100 dark:border-slate-800 dark:bg-slate-900/10 dark:hover:bg-slate-800/20"
                                                                >
                                                                    <div className="flex items-center justify-between gap-2 mb-2">
                                                                        <h4 className="text-[11px] font-semibold text-slate-800 dark:text-white truncate">
                                                                            {path.name}
                                                                        </h4>
                                                                        <span className="rounded border border-slate-200 bg-white px-1.5 py-0.5 text-[9px] font-bold text-slate-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-400 shrink-0">
                                                                            {path.modules?.length ?? 0} mod
                                                                        </span>
                                                                    </div>
                                                                    <div className="space-y-1">
                                                                        {path.modules?.length === 0 ? (
                                                                            <p className="text-[10px] text-slate-400 dark:text-slate-600 italic">Empty path</p>
                                                                        ) : (
                                                                            path.modules?.map(module => (
                                                                                <div key={String(module._id)} className="flex items-center gap-1.5" title={module.title}>
                                                                                    <span className="w-1 h-1 rounded-full bg-slate-400 dark:bg-slate-600 shrink-0" />
                                                                                    <span className="text-[10px] text-slate-600 dark:text-slate-400 truncate">{module.title}</span>
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
                    <div className="rounded-3xl bg-slate-900 dark:bg-[#020202] border border-slate-800 shadow-sm p-4 sm:p-6 md:p-8 overflow-hidden relative mt-8">
                        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[80%] h-32 bg-indigo-500/10 rounded-full blur-[100px] pointer-events-none"></div>
                        <div className="relative z-10 overflow-x-auto min-w-full">
                            <CourseRoadmap course={course} mentors={mentors} />
                        </div>
                    </div>

                    {/* ================= MODALS ================= */}

                    {/* Modal: Create Career Group */}
                <Modal open={openCareerGroup} title="kok masi ada warna vur" onClose={() => setOpenCareerGroup(false)}>
                    <div
                        className="relative overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-gradient-to-b dark:from-[#0e0e1a] dark:to-[#090910] dark:shadow-none"
                        style={{ fontFamily: "'Outfit', sans-serif" }}
                    >
                        {/* Top accent line */}
                        <div className="absolute top-0 right-8 left-8 h-px bg-gradient-to-r from-transparent via-slate-300 to-transparent dark:via-slate-700" />

                        <div className="p-5 sm:p-6 space-y-5">
                            <div>
                                <label className="block text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500 mb-2">
                                    Group Name
                                </label>
                                <input
                                    value={careerGroupName}
                                    onChange={(e) => setCareerGroupName(e.target.value)}
                                    placeholder="Frontend Web Developer"
                                    className="w-full rounded-lg border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-900 placeholder-slate-400 transition-colors focus:border-slate-400 focus:outline-none dark:border-slate-700 dark:bg-slate-900 dark:text-white dark:placeholder-slate-500 dark:focus:border-slate-500"
                                    autoFocus
                                />
                            </div>

                            <div className="h-px bg-slate-100 dark:bg-white/5" />

                            <div className="flex justify-end gap-2.5">
                                <button
                                    onClick={() => setOpenCareerGroup(false)}
                                    className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-600 transition-colors hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-300 dark:hover:bg-slate-800"
                                >
                                    Cancel
                                </button>
                                <button
                                    disabled={!careerGroupName.trim()}
                                    onClick={createCareerGroup}
                                    className="rounded-lg border border-slate-800 bg-slate-800 px-4 py-2 text-xs font-bold text-white transition-colors hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-40 dark:border-white/10 dark:bg-white/10 dark:hover:bg-white/15"
                                >
                                    Create Group
                                </button>
                            </div>
                        </div>
                    </div>
                </Modal>

                    {/* Modal: Create Basic Path */}
                <Modal open={openBasicPath} title="Create Basic Path" onClose={() => setOpenBasicPath(false)}>
                    <div className="space-y-5" style={{ fontFamily: "'Outfit', sans-serif" }}>
                        <div>
                            <label className="block text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500 mb-2">
                                Path Name
                            </label>
                            <input
                                value={basicPathName}
                                onChange={(e) => setBasicPathName(e.target.value)}
                                placeholder="HTML & CSS Fundamentals"
                                className="w-full rounded-lg border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-900 placeholder-slate-400 transition-colors focus:border-slate-400 focus:outline-none dark:border-slate-700 dark:bg-slate-900 dark:text-white dark:placeholder-slate-500 dark:focus:border-slate-500"
                                autoFocus
                            />
                        </div>
                        <div className="h-px bg-slate-100 dark:bg-white/5" />
                        <div className="flex justify-end gap-2.5">
                            <button
                                onClick={() => setOpenBasicPath(false)}
                                className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-600 transition-colors hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-300 dark:hover:bg-slate-800"
                            >
                                Cancel
                            </button>
                            <button
                                disabled={!basicPathName.trim()}
                                onClick={createBasicPath}
                                className="rounded-lg border border-slate-800 bg-slate-800 px-4 py-2 text-xs font-bold text-white transition-colors hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-40 dark:border-white/10 dark:bg-white/10 dark:hover:bg-white/15"
                            >
                                Create Path
                            </button>
                        </div>
                    </div>
                </Modal>

                    {/* Modal: Create Career Path */}
                    <Modal open={openCareerPath} title="Create Career Path" onClose={() => setOpenCareerPath(false)}>
                        <div className="space-y-5" style={{ fontFamily: "'Outfit', sans-serif" }}>
                            <div>
                                <label className="block text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500 mb-2">
                                    Path Name
                                </label>
                                <input
                                    value={careerPathName}
                                    onChange={(e) => setCareerPathName(e.target.value)}
                                    placeholder="React.js Mastery"
                                    className="w-full rounded-lg border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-900 placeholder-slate-400 transition-colors focus:border-slate-400 focus:outline-none dark:border-slate-700 dark:bg-slate-900 dark:text-white dark:placeholder-slate-500 dark:focus:border-slate-500"
                                    autoFocus
                                />
                            </div>
                            <div className="h-px bg-slate-100 dark:bg-slate-800" />
                            <div className="flex justify-end gap-2.5">
                                <button
                                    onClick={() => setOpenCareerPath(false)}
                                    className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-600 transition-colors hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-300 dark:hover:bg-slate-800"
                                >
                                    Cancel
                                </button>
                                <button
                                    disabled={!careerPathName.trim()}
                                    onClick={createCareerPath}
                                    className="rounded-lg border border-slate-800 bg-slate-800 px-4 py-2 text-xs font-bold text-white transition-colors hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-40 dark:border-indigo-500/50 dark:bg-indigo-600 dark:hover:bg-indigo-500"
                                >
                                    Create Path
                                </button>
                            </div>
                        </div>
                    </Modal>

                </div>
            </div>
        </AppLayout>
    )
}
