import { Link, router, useForm } from "@inertiajs/react"
import AppLayout from "@/layouts/app-layout"
import { Pencil, Trash2, Plus, Image as ImageIcon, X, ArrowRight, BookOpen } from "lucide-react"
import { useState } from "react"

type Course = {
    _id: string
    title: string
    description: string
    thumbnail: string | null
    slug: string
}

export default function Index({ courses }: { courses: Course[] }) {

    const [showModal, setShowModal] = useState(false)

    function deleteCourse(slug: string) {
        if (!confirm("Are you sure you want to delete this course? This action cannot be undone.")) return
        router.delete(`/admin/courses/${slug}`)
    }

    return (
        <AppLayout>
            <div className="min-h-screen p-4 sm:p-6 lg:p-8 max-w-[1400px] mx-auto space-y-6 sm:space-y-8">

                {/* HEADER */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-slate-900 p-6 rounded-2xl shadow-lg">
                    <div>
                        <h1 className="text-2xl sm:text-3xl font-bold text-white flex items-center gap-3">
                            <div className="p-2 bg-indigo-500/10 rounded-lg">
                                <BookOpen className="text-indigo-400" size={24} />
                            </div>
                            Courses
                        </h1>
                        <p className="text-slate-400 text-sm mt-2">Manage, organize, and publish your learning content</p>
                    </div>

                    <button
                        onClick={() => setShowModal(true)}
                        className="group flex items-center gap-2 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-400 hover:to-purple-500 text-white px-5 py-2.5 rounded-xl text-sm font-medium transition-all shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40 hover:-translate-y-0.5"
                    >
                        <Plus size={18} className="transition-transform group-hover:rotate-90" />
                        Create Course
                    </button>
                </div>

                {/* GRID */}
                {courses.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {courses.map((course) => (
                            <div key={course._id} className="group flex flex-col bg-slate-900 backdrop-blur-md border border-slate-800 hover:border-indigo-500 rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-2xl hover:shadow-indigo-500 hover:-translate-y-1">

                                <Link href={`/admin/courses/${course.slug}`} className="relative h-48 sm:h-52 overflow-hidden bg-slate-800/50 block">
                                    {course.thumbnail ? (
                                        <img src={`/storage/${course.thumbnail}`} alt={course.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                                    ) : (
                                        <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-500">
                                            <ImageIcon size={32} className="mb-2 opacity-40" />
                                            <span className="text-xs font-medium uppercase tracking-wider">No Cover Image</span>
                                        </div>
                                    )}
                                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/20 to-transparent opacity-90" />
                                </Link>

                                <div className="flex flex-col flex-1 p-5 sm:p-6">
                                    <Link href={`/admin/courses/${course.slug}`} className="block mb-2 group-hover:text-indigo-400 transition-colors">
                                        <h2 className="text-lg font-bold text-white line-clamp-1 leading-snug" title={course.title}>{course.title}</h2>
                                    </Link>

                                    <p className="text-sm text-slate-400 line-clamp-2 mb-6 flex-1 leading-relaxed">
                                        {course.description || "No description provided."}
                                    </p>

                                    <div className="flex items-center justify-between pt-4 border-t border-slate-800/60 mt-auto">
                                        <Link
                                            href={`/admin/courses/${course.slug}`}
                                            className="flex items-center gap-1.5 text-sm font-semibold text-indigo-400 hover:text-indigo-300 transition-colors"
                                        >
                                            Open Builder
                                            <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
                                        </Link>

                                        <div className="flex items-center gap-1">
                                            <Link
                                                href={`/admin/courses/${course.slug}/edit`}
                                                className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                                                title="Edit Details"
                                            >
                                                <Pencil size={16} />
                                            </Link>
                                            <button
                                                onClick={() => deleteCourse(course.slug)}
                                                className="p-2 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                                                title="Delete Course"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center py-24 bg-slate-900/30 border border-slate-800/60 rounded-2xl border-dashed">
                        <div className="w-16 h-16 bg-slate-800/50 rounded-full flex items-center justify-center text-slate-400 mb-4 shadow-inner">
                            <BookOpen size={32} />
                        </div>
                        <h3 className="text-xl font-semibold text-white mb-2">No courses created yet</h3>
                        <p className="text-slate-400 text-sm mb-8 text-center max-w-md">Your learning platform is empty. Get started by creating your first course and building an engaging curriculum.</p>
                        <button
                            onClick={() => setShowModal(true)}
                            className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-white px-6 py-3 rounded-xl text-sm font-medium transition-colors shadow-lg"
                        >
                            <Plus size={18} />
                            Create First Course
                        </button>
                    </div>
                )}

                {/* MODAL */}
                {showModal && (
                    <CreateModal onClose={() => setShowModal(false)} />
                )}

            </div>
        </AppLayout>
    )
}

/* ================= MODAL ================= */

function CreateModal({ onClose }: { onClose: () => void }) {

    const { data, setData, post, processing, errors } = useForm({
        title: "",
        description: "",
        thumbnail: null as File | null
    })

    const [preview, setPreview] = useState<string | null>(null)

    const handleFile = (file: File) => {
        setData("thumbnail", file)
        setPreview(URL.createObjectURL(file))
    }

    const submit = (e: React.FormEvent) => {
        e.preventDefault()

        post("/admin/courses", {
            forceFormData: true,
            onSuccess: () => onClose()
        })
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm" onClick={onClose}>
            <div
                className="flex flex-col md:flex-row w-full max-w-4xl bg-[#0B1120] border border-slate-800 rounded-2xl shadow-2xl overflow-hidden"
                onClick={(e) => e.stopPropagation()}
            >
                {/* LEFT - PREVIEW */}
                <div className="md:w-[45%] p-6 md:p-8 bg-slate-900/50 border-b md:border-b-0 md:border-r border-slate-800/80 flex flex-col justify-center">
                    <h3 className="text-sm font-semibold text-slate-300 mb-4 flex items-center gap-2">
                        <ImageIcon size={16} className="text-indigo-400" />
                        Course Thumbnail
                    </h3>
                    <div
                        className="relative w-full aspect-video md:aspect-square lg:aspect-[4/3] rounded-xl bg-slate-950/50 border border-slate-800 flex flex-col items-center justify-center cursor-pointer overflow-hidden group hover:border-indigo-500/50 transition-all duration-300 shadow-inner"
                        onClick={() => document.getElementById("file")?.click()}
                    >
                        {preview ? (
                            <>
                                <img src={preview} alt="Preview" className="w-full h-full object-cover" />
                                <div className="absolute inset-0 bg-slate-950/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 backdrop-blur-[2px]">
                                    <span className="text-white text-sm font-medium bg-white/10 border border-white/20 px-4 py-2 rounded-lg backdrop-blur-md flex items-center gap-2">
                                        <Pencil size={16} />
                                        Change Image
                                    </span>
                                </div>
                            </>
                        ) : (
                            <div className="flex flex-col items-center text-slate-500 group-hover:text-indigo-400 transition-colors">
                                <div className="w-12 h-12 bg-slate-900 rounded-full flex items-center justify-center mb-3 group-hover:scale-110 transition-transform duration-300 shadow-sm">
                                    <Plus size={24} />
                                </div>
                                <span className="text-sm font-medium">Click to upload image</span>
                                <span className="text-xs text-slate-600 mt-1.5">Recommended ratio 16:9</span>
                            </div>
                        )}
                    </div>
                    <input
                        id="file"
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) =>
                            e.target.files && handleFile(e.target.files[0])
                        }
                    />
                </div>

                {/* RIGHT - FORM */}
                <div className="md:w-[55%] p-6 md:p-8 flex flex-col">
                    <div className="flex justify-between items-start mb-8">
                        <div>
                            <h2 className="text-2xl font-bold text-white">Create New Course</h2>
                            <p className="text-sm text-slate-400 mt-1">Set up the basic details for your new course.</p>
                        </div>
                        <button
                            onClick={onClose}
                            className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors bg-slate-900/50"
                        >
                            <X size={20} />
                        </button>
                    </div>

                    <form onSubmit={submit} className="flex flex-col gap-6 flex-1">
                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-2">Course Title <span className="text-rose-500">*</span></label>
                            <input
                                type="text"
                                placeholder="e.g. Advanced React Patterns & Architecture"
                                value={data.title}
                                onChange={(e) => setData("title", e.target.value)}
                                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-shadow placeholder:text-slate-600"
                                required
                            />
                            {errors.title && <p className="text-rose-400 text-xs mt-1.5">{errors.title}</p>}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-2">Short Description</label>
                            <textarea
                                rows={5}
                                placeholder="Briefly describe what students will learn in this course..."
                                value={data.description}
                                onChange={(e) => setData("description", e.target.value)}
                                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-shadow placeholder:text-slate-600 resize-none leading-relaxed"
                            />
                            {errors.description && <p className="text-rose-400 text-xs mt-1.5">{errors.description}</p>}
                        </div>

                        <div className="mt-auto pt-6 border-t border-slate-800/80 flex justify-end gap-3">
                            <button
                                type="button"
                                onClick={onClose}
                                className="px-6 py-2.5 rounded-xl text-sm font-medium text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={processing}
                                className="flex items-center gap-2 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-400 hover:to-purple-500 text-white px-6 py-2.5 rounded-xl text-sm font-medium transition-all shadow-lg shadow-indigo-500/25 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:from-indigo-500 disabled:hover:to-purple-600"
                            >
                                {processing ? (
                                    <>
                                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                        Creating...
                                    </>
                                ) : (
                                    "Create Course"
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}