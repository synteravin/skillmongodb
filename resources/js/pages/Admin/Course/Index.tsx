import { Link, router, useForm } from "@inertiajs/react"
import AppLayout from "@/layouts/app-layout"
import { Pencil, Trash2, Plus, Image as ImageIcon, ArrowRight, BookOpen, Upload, AlertCircle } from "lucide-react"
import { useState, useRef } from "react"
import Modal from "@/components/ui/Modal"

type Course = {
    _id: string
    title: string
    description: string
    thumbnail: string | null
    thumbnail_url?: string | null
    slug: string
}

export default function Index({ courses }: { courses: Course[] }) {
    const [openModal, setOpenModal] = useState<"create" | "edit" | null>(null)
    const [editingCourse, setEditingCourse] = useState<Course | null>(null)
    const [preview, setPreview] = useState<string | null>(null)
    const [isDragging, setIsDragging] = useState(false)
    const fileInputRef = useRef<HTMLInputElement>(null)

    const { data, setData, post, processing, errors, reset, clearErrors } = useForm({
        _method: "POST",
        title: "",
        description: "",
        thumbnail: null as File | null
    })

    function handleFile(file: File) {
        if (!file.type.startsWith('image/')) {
            alert('Please upload an image file')
            return
        }
        setData("thumbnail", file)
        setPreview(URL.createObjectURL(file))
    }

    function handleDrop(e: React.DragEvent) {
        e.preventDefault()
        setIsDragging(false)
        const file = e.dataTransfer.files?.[0]
        if (file) handleFile(file)
    }

    function openCreate() {
        clearErrors()
        reset()
        setData("_method", "POST")
        setPreview(null)
        setEditingCourse(null)
        setOpenModal("create")
    }

    function openEdit(course: Course) {
        clearErrors()
        reset()
        setData({
            _method: "PUT",
            title: course.title,
            description: course.description || "",
            thumbnail: null
        })
        const initialPreview = course.thumbnail_url
            || (course.thumbnail?.startsWith('http') ? course.thumbnail : (course.thumbnail ? `/storage/${course.thumbnail}` : null))
        setPreview(initialPreview)
        setEditingCourse(course)
        setOpenModal("edit")
    }

    function closeModal() {
        setOpenModal(null)
        setEditingCourse(null)
        reset()
    }

    function submit(e: React.FormEvent) {
        e.preventDefault()
        const url = openModal === "edit" && editingCourse ? `/admin/courses/${editingCourse.slug}` : "/admin/courses"

        post(url, {
            forceFormData: true,
            onSuccess: () => closeModal()
        })
    }

    function deleteCourse(slug: string) {
        if (!confirm("Are you sure you want to delete this course? This action cannot be undone.")) return
        router.delete(`/admin/courses/${slug}`)
    }

    return (
        <AppLayout>
            <div className="min-h-screen p-4 sm:p-6 lg:p-8 w-full mx-auto space-y-6 sm:space-y-8">

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
                        onClick={openCreate}
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
                                    {course.thumbnail_url || course.thumbnail ? (
                                        <img src={course.thumbnail_url || (course.thumbnail?.startsWith('http') ? course.thumbnail : `/storage/${course.thumbnail}`)} alt={course.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
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
                                            <button
                                                onClick={() => openEdit(course)}
                                                className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                                                title="Edit Details"
                                            >
                                                <Pencil size={16} />
                                            </button>
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
                            onClick={openCreate}
                            className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-white px-6 py-3 rounded-xl text-sm font-medium transition-colors shadow-lg"
                        >
                            <Plus size={18} />
                            Create First Course
                        </button>
                    </div>
                )}

                {/* MODAL */}
                <Modal
                    open={openModal !== null}
                    title={openModal === "edit" ? "Edit Course" : "Create Course"}
                    onClose={closeModal}
                    maxWidth="max-w-4xl"
                >
                    <form onSubmit={submit} className="flex flex-col md:flex-row gap-6 lg:gap-8 pt-2">

                        {/* LEFT COLUMN: Thumbnail Upload */}
                        <div className="w-full md:w-2/5 flex flex-col space-y-4">
                            <div className="flex items-center justify-between">
                                <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-2">
                                    <ImageIcon size={18} className="text-indigo-500 dark:text-indigo-400" />
                                    Course Cover
                                </label>
                                {preview && (
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setPreview(null)
                                            setData("thumbnail", null)
                                            if (fileInputRef.current) fileInputRef.current.value = ""
                                        }}
                                        className="text-xs font-medium text-rose-500 dark:text-rose-400 hover:text-rose-600 dark:hover:text-rose-300 transition-colors"
                                    >
                                        Remove Image
                                    </button>
                                )}
                            </div>

                            <div
                                className={`relative w-full aspect-[4/3] rounded-2xl border-2 border-dashed transition-all duration-300 overflow-hidden group cursor-pointer flex flex-col items-center justify-center ${isDragging
                                        ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-500/10 scale-[1.02]'
                                        : preview
                                            ? 'border-transparent bg-slate-100 dark:bg-slate-900 shadow-inner'
                                            : 'border-slate-300 dark:border-slate-700 hover:border-indigo-400 dark:hover:border-indigo-500/50 bg-slate-50 dark:bg-slate-800/50 hover:bg-slate-100 dark:hover:bg-slate-800'
                                    }`}
                                onDragOver={(e) => { e.preventDefault(); setIsDragging(true) }}
                                onDragLeave={() => setIsDragging(false)}
                                onDrop={handleDrop}
                                onClick={() => fileInputRef.current?.click()}
                            >
                                {preview ? (
                                    <>
                                        <img src={preview} alt="Course Preview" className="w-full h-full object-cover" />
                                        <div className="absolute inset-0 bg-slate-900/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center backdrop-blur-sm">
                                            <div className="bg-white/20 text-white px-5 py-2.5 rounded-xl border border-white/30 shadow-lg font-medium text-sm flex items-center gap-2 transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                                                <Upload size={16} />
                                                Change Image
                                            </div>
                                        </div>
                                    </>
                                ) : (
                                    <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-6">
                                        <div className="w-16 h-16 bg-white dark:bg-slate-800 rounded-full flex items-center justify-center mb-4 shadow-sm border border-slate-100 dark:border-slate-700 group-hover:scale-110 group-hover:bg-indigo-50 dark:group-hover:bg-indigo-500/20 transition-all duration-300">
                                            <Upload size={24} className="text-slate-400 group-hover:text-indigo-500 dark:group-hover:text-indigo-400 transition-colors" />
                                        </div>
                                        <h3 className="text-slate-700 dark:text-slate-200 font-semibold mb-1">Upload Thumbnail</h3>
                                        <p className="text-slate-500 dark:text-slate-400 text-xs leading-relaxed max-w-[200px]">
                                            Drag and drop your image here, or click to browse files
                                        </p>
                                    </div>
                                )}
                            </div>
                            <input
                                ref={fileInputRef}
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={(e) => {
                                    const file = e.target.files?.[0]
                                    if (file) handleFile(file)
                                }}
                            />
                            {errors.thumbnail && (
                                <div className="flex items-center gap-1.5 text-rose-500 dark:text-rose-400 text-sm mt-1 bg-rose-50 dark:bg-rose-500/10 p-3 rounded-lg border border-rose-100 dark:border-rose-500/20">
                                    <AlertCircle size={16} />
                                    <span>{errors.thumbnail}</span>
                                </div>
                            )}
                        </div>

                        {/* RIGHT COLUMN: Form Inputs */}
                        <div className="w-full md:w-3/5 flex flex-col space-y-5 justify-between">

                            <div className="space-y-5">
                                {/* Title Input */}
                                <div className="space-y-2">
                                    <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 ml-1">
                                        Course Title <span className="text-rose-500">*</span>
                                    </label>
                                    <div className="relative group/input">
                                        <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/10 to-purple-500/10 dark:from-indigo-500/20 dark:to-purple-500/20 rounded-xl blur opacity-0 group-focus-within/input:opacity-100 transition-opacity duration-300" />
                                        <input
                                            type="text"
                                            value={data.title}
                                            onChange={(e) => setData("title", e.target.value)}
                                            placeholder="e.g., Advanced Laravel Architecture"
                                            className="relative w-full bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3.5 text-slate-800 dark:text-white placeholder:text-slate-400 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all shadow-sm"
                                        />
                                    </div>
                                    {errors.title && (
                                        <div className="flex items-center gap-1.5 text-rose-500 dark:text-rose-400 text-xs mt-1.5 ml-1">
                                            <AlertCircle size={14} />
                                            <span>{errors.title}</span>
                                        </div>
                                    )}
                                </div>

                                {/* Description Input */}
                                <div className="space-y-2">
                                    <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 ml-1">
                                        Description
                                    </label>
                                    <div className="relative group/input flex-1">
                                        <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/10 to-purple-500/10 dark:from-indigo-500/20 dark:to-purple-500/20 rounded-xl blur opacity-0 group-focus-within/input:opacity-100 transition-opacity duration-300" />
                                        <textarea
                                            rows={6}
                                            value={data.description}
                                            onChange={(e) => setData("description", e.target.value)}
                                            placeholder="What will students learn from this course? Provide a brief overview..."
                                            className="relative w-full bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3.5 text-slate-800 dark:text-white placeholder:text-slate-400 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all resize-none shadow-sm"
                                        />
                                    </div>
                                    {errors.description && (
                                        <div className="flex items-center gap-1.5 text-rose-500 dark:text-rose-400 text-xs mt-1.5 ml-1">
                                            <AlertCircle size={14} />
                                            <span>{errors.description}</span>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Actions (Bottom aligned) */}
                            <div className="flex justify-end gap-3 pt-6 mt-auto border-t border-slate-100 dark:border-slate-800/60">
                                <button
                                    type="button"
                                    onClick={closeModal}
                                    className="px-5 py-2.5 rounded-xl font-medium bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="relative overflow-hidden group px-8 py-2.5 rounded-xl font-medium text-white disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-md hover:shadow-lg active:scale-95"
                                >
                                    <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-purple-600 transition-opacity group-hover:opacity-90" />
                                    <div className="relative flex items-center justify-center gap-2">
                                        {processing ? (
                                            <>
                                                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                                <span>Saving...</span>
                                            </>
                                        ) : (
                                            <span>{openModal === "edit" ? "Save Changes" : "Create Course"}</span>
                                        )}
                                    </div>
                                </button>
                            </div>

                        </div>
                    </form>
                </Modal>

            </div>
        </AppLayout>
    )
}