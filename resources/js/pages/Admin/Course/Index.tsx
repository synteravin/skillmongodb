import { Link, router, useForm } from "@inertiajs/react"
import AppLayout from "@/layouts/app-layout"
import { Pencil, Trash2, Plus, Image as ImageIcon, ArrowRight, BookOpen, Upload, AlertCircle } from "lucide-react"
import { useState, useRef } from "react"
import Modal from "@/components/ui/Modal"
import ConfirmModal from "@/components/ui/ConfirmModal"
import AlertModal from "@/components/ui/AlertModal"

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
    const [alertMessage, setAlertMessage] = useState<string | null>(null)
    const [confirmDeleteSlug, setConfirmDeleteSlug] = useState<string | null>(null)
    const fileInputRef = useRef<HTMLInputElement>(null)

    const { data, setData, post, processing, errors, reset, clearErrors } = useForm({
        _method: "POST",
        title: "",
        description: "",
        thumbnail: null as File | null
    })

    function handleFile(file: File) {
        if (!file.type.startsWith('image/')) {
            setAlertMessage('Please upload an image file.')
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
        setConfirmDeleteSlug(slug)
    }

    function executeDeleteCourse() {
        if (confirmDeleteSlug) {
            router.delete(`/admin/courses/${confirmDeleteSlug}`)
            setConfirmDeleteSlug(null)
        }
    }

    return (
        <AppLayout>
            <div 
                className="relative min-h-screen bg-[#f8fafc] dark:bg-[#030712] text-slate-800 dark:text-white px-4 py-8 sm:px-6 lg:px-10 overflow-hidden transition-colors duration-200"
                style={{ fontFamily: "'Outfit', sans-serif" }}
            >
                {/* Subtle top-center ambient glow (visible on dark mode) */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[450px] pointer-events-none select-none z-0 bg-indigo-500/5 dark:bg-indigo-500/5 rounded-full blur-[120px]" />

                <div className="relative z-10 mx-auto max-w-7xl space-y-6">
                    {/* HEADER */}
                    <div className="relative overflow-hidden rounded-xl border border-slate-200/80 p-6 sm:p-8 md:p-10 bg-[#f5f6ff] dark:bg-[#0d0f17] dark:border-slate-800 shadow-sm">
                        {/* Grid Pattern Motif */}
                        <div 
                            className="absolute inset-0 z-0 pointer-events-none"
                            style={{
                                backgroundImage: `
                                    linear-gradient(rgba(59, 40, 246, 0.07) 1px, transparent 1px),
                                    linear-gradient(90deg, rgba(59, 40, 246, 0.07) 1px, transparent 1px)
                                `,
                                backgroundSize: '40px 40px',
                            }}
                        />

                        <div className="absolute top-0 right-8 left-8 h-px bg-gradient-to-r from-transparent via-slate-300 to-transparent dark:via-slate-700 z-0" />

                        <div className="relative z-10 flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
                            <div className="max-w-2xl space-y-3">
                                <span className="inline-block text-[0.6rem] font-semibold tracking-[0.2em] text-slate-500 uppercase dark:text-slate-500">
                                    Courses
                                </span>
                                <h1 className="text-2xl md:text-[28px] font-semibold tracking-tight text-slate-800 dark:text-white leading-snug">
                                    Course Management
                                </h1>
                                <p className="text-slate-500 dark:text-slate-400/60 text-sm md:text-[15px] leading-relaxed">
                                    Manage, organize, and publish your learning content.
                                </p>
                            </div>

                            <button
                                onClick={openCreate}
                                className="relative z-10 inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#3B28F6] hover:bg-[#2a1ce0] text-white text-sm font-semibold shadow-sm transition-all shrink-0"
                            >
                                <Plus size={18} />
                                Create Course
                            </button>
                        </div>
                    </div>

                    {/* GRID */}
                    {courses.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {courses.map((course) => (
                                <div 
                                    key={course._id} 
                                    className="group flex flex-col bg-white dark:bg-[#060B1A]/80 border border-slate-200 dark:border-white/8 hover:border-[#3B28F6]/50 dark:hover:border-[#7C5CFF]/50 rounded-xl overflow-hidden transition-all duration-200 ease-out hover:-translate-y-0.5 hover:shadow-md dark:hover:shadow-lg dark:hover:shadow-[#7C5CFF]/5"
                                >
                                    <Link href={`/admin/courses/${course.slug}`} className="relative h-48 sm:h-52 overflow-hidden bg-slate-100 dark:bg-white/5 block">
                                        {course.thumbnail_url || course.thumbnail ? (
                                            <img src={course.thumbnail_url || (course.thumbnail?.startsWith('http') ? course.thumbnail : `/storage/${course.thumbnail}`)} alt={course.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                                        ) : (
                                            <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-400 dark:text-slate-500">
                                                <ImageIcon size={32} className="mb-2 opacity-40" />
                                                <span className="text-xs font-semibold uppercase tracking-wider">No Cover Image</span>
                                            </div>
                                        )}
                                        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/30 dark:from-[#030712] via-transparent to-transparent" />
                                    </Link>

                                    <div className="flex flex-col flex-1 p-5">
                                        <Link href={`/admin/courses/${course.slug}`} className="block mb-2 group-hover:text-[#3B28F6] dark:group-hover:text-[#7C5CFF] transition-colors">
                                            <h2 className="text-base font-bold text-slate-800 dark:text-white line-clamp-1 leading-snug" title={course.title}>{course.title}</h2>
                                        </Link>

                                        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 line-clamp-2 mb-6 flex-1 leading-relaxed">
                                            {course.description || "No description provided."}
                                        </p>

                                        <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-white/5 mt-auto">
                                            <Link
                                                href={`/admin/courses/${course.slug}`}
                                                className="flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-[#3B28F6] dark:text-[#7C5CFF] hover:text-[#2A1CE0] dark:hover:text-[#8B5CF6] transition-colors"
                                            >
                                                Open Builder
                                                <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
                                            </Link>

                                            <div className="flex items-center gap-1">
                                                <button
                                                    onClick={() => openEdit(course)}
                                                    className="p-2 rounded-lg text-slate-400 hover:text-slate-700 dark:text-slate-500 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/5 transition-colors"
                                                    title="Edit Details"
                                                >
                                                    <Pencil size={15} />
                                                </button>
                                                <button
                                                    onClick={() => deleteCourse(course.slug)}
                                                    className="p-2 rounded-lg text-slate-400 hover:text-red-600 dark:text-slate-500 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors"
                                                    title="Delete Course"
                                                >
                                                    <Trash2 size={15} />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center py-24 bg-white dark:bg-[#060B1A]/60 border border-slate-200 dark:border-white/8 border-dashed rounded-xl shadow-sm">
                            <div className="w-16 h-16 bg-slate-50 dark:bg-white/5 rounded-full flex items-center justify-center text-slate-400 dark:text-slate-550 mb-4 shadow-inner">
                                <BookOpen size={32} />
                            </div>
                            <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-2">No courses created yet</h3>
                            <p className="text-slate-500 dark:text-slate-400 text-sm mb-6 text-center max-w-sm">Your learning platform is empty. Get started by creating your first course and building an engaging curriculum.</p>
                            <button
                                onClick={openCreate}
                                className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-white px-5 py-2.5 rounded-xl text-sm font-semibold shadow-sm transition-colors dark:bg-white/10 dark:hover:bg-white/20 border border-transparent"
                            >
                                <Plus size={18} />
                                Create First Course
                            </button>
                        </div>
                    )}

                    {/* MODAL */}
                    <Modal open={openModal !== null} title={openModal === "edit" ? "Edit Course" : "Create Course"} onClose={closeModal} maxWidth="max-w-4xl">
                        <form onSubmit={submit} className="grid grid-cols-1 gap-6 pt-2 md:grid-cols-[0.9fr_1.1fr]">
                            <div className="space-y-3">
                                <div className="flex items-center justify-between">
                                    <label className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500 dark:text-slate-400">Course Cover</label>

                                    {preview && (
                                        <button type="button" onClick={() => { setPreview(null); setData("thumbnail", null); if (fileInputRef.current) fileInputRef.current.value = ""; }} className="text-xs font-medium text-rose-500 hover:text-rose-450 transition-colors">
                                            Remove
                                        </button>
                                    )}
                                </div>

                                <div
                                    onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                                    onDragLeave={() => setIsDragging(false)}
                                    onDrop={handleDrop}
                                    onClick={() => fileInputRef.current?.click()}
                                    className={`relative flex aspect-[4/3] cursor-pointer items-center justify-center overflow-hidden rounded-xl border transition-colors ${isDragging ? "border-[#3B28F6] bg-[#3B28F6]/10" : preview ? "border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/[0.03]" : "border-dashed border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/[0.03] hover:border-[#3B28F6]/50 dark:hover:border-[#3B28F6]/50 hover:bg-slate-100 dark:hover:bg-white/[0.05]"}`}
                                >
                                    {preview ? (
                                        <>
                                            <img src={preview} alt="Course Preview" className="h-full w-full object-cover" />
                                            <div className="absolute inset-0 flex items-center justify-center bg-slate-900/60 dark:bg-[#030712]/55 opacity-0 backdrop-blur-sm transition-opacity hover:opacity-100">
                                                <div className="inline-flex items-center gap-2 rounded-xl border border-white/20 bg-white/10 px-4 py-2 text-sm font-medium text-white">
                                                    <Upload size={16} />
                                                    Change Image
                                                </div>
                                            </div>
                                        </>
                                    ) : (
                                        <div className="flex flex-col items-center px-6 text-center">
                                            <div className="mb-3 flex size-12 items-center justify-center rounded-xl border border-slate-200 dark:border-white/10 bg-slate-100 dark:bg-[#0B1020] text-slate-400 dark:text-[#3B28F6]">
                                                <Upload size={20} />
                                            </div>
                                            <h3 className="text-sm font-semibold text-slate-800 dark:text-white">Upload Thumbnail</h3>
                                            <p className="mt-1 max-w-[220px] text-xs leading-relaxed text-slate-400">Drag and drop image here, or click to browse files.</p>
                                        </div>
                                    )}
                                </div>

                                <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={(e) => { const file = e.target.files?.[0]; if (file) handleFile(file); }} />

                                {errors.thumbnail && (
                                    <div className="flex items-center gap-2 rounded-xl border border-rose-500/20 bg-rose-500/10 px-3 py-2 text-xs text-rose-500 dark:text-rose-450">
                                        <AlertCircle size={14} />
                                        <span>{errors.thumbnail}</span>
                                    </div>
                                )}
                            </div>

                            <div className="flex flex-col justify-between space-y-5">
                                <div className="space-y-4">
                                    <div className="space-y-2">
                                        <label className="ml-1 text-xs font-semibold uppercase tracking-[0.14em] text-slate-500 dark:text-slate-400">
                                            Course Title <span className="text-rose-500">*</span>
                                        </label>

                                        <input
                                            type="text"
                                            value={data.title}
                                            onChange={(e) => setData("title", e.target.value)}
                                            placeholder="e.g., Advanced Laravel Architecture"
                                            className="w-full rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/[0.03] px-4 py-3 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-650 outline-none transition-colors focus:border-[#3B28F6] focus:bg-white dark:focus:bg-white/[0.05]"
                                        />

                                        {errors.title && (
                                            <div className="ml-1 flex items-center gap-1.5 text-xs text-rose-500 dark:text-rose-450">
                                                <AlertCircle size={13} />
                                                <span>{errors.title}</span>
                                            </div>
                                        )}
                                    </div>

                                    <div className="space-y-2">
                                        <label className="ml-1 text-xs font-semibold uppercase tracking-[0.14em] text-slate-500 dark:text-slate-400">Description</label>

                                        <textarea
                                            rows={6}
                                            value={data.description}
                                            onChange={(e) => setData("description", e.target.value)}
                                            placeholder="What will students learn from this course?"
                                            className="w-full resize-none rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/[0.03] px-4 py-3 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-650 outline-none transition-colors focus:border-[#3B28F6] focus:bg-white dark:focus:bg-white/[0.05]"
                                        />

                                        {errors.description && (
                                            <div className="ml-1 flex items-center gap-1.5 text-xs text-rose-500 dark:text-rose-450">
                                                <AlertCircle size={13} />
                                                <span>{errors.description}</span>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <div className="flex justify-end gap-3 border-t border-slate-200 dark:border-white/10 pt-5">
                                    <button type="button" onClick={closeModal} className="rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-white/[0.03] px-4 py-2.5 text-sm font-medium text-slate-700 dark:text-slate-300 transition-colors hover:bg-slate-50 dark:hover:bg-white/[0.07]">
                                        Cancel
                                    </button>

                                    <button type="submit" disabled={processing} className="inline-flex items-center justify-center gap-2 rounded-xl bg-slate-800 hover:bg-slate-700 dark:bg-[#3B28F6] dark:hover:bg-[#2A1CE0] border-transparent text-white px-5 py-2.5 text-sm font-semibold shadow-sm transition-colors disabled:cursor-not-allowed disabled:opacity-50">
                                        {processing ? (
                                            <>
                                                <span className="size-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                                                Saving...
                                            </>
                                        ) : (
                                            openModal === "edit" ? "Save Changes" : "Create Course"
                                        )}
                                    </button>
                                </div>
                            </div>
                        </form>
                    </Modal>

                    <ConfirmModal
                        open={!!confirmDeleteSlug}
                        title="Delete Course"
                        message="Are you sure you want to delete this course? This action cannot be undone."
                        confirmText="Delete Course"
                        variant="danger"
                        onConfirm={executeDeleteCourse}
                        onClose={() => setConfirmDeleteSlug(null)}
                    />

                    <AlertModal
                        open={!!alertMessage}
                        title="File Upload Notice"
                        message={alertMessage || ''}
                        onClose={() => setAlertMessage(null)}
                    />
                </div>
            </div>
        </AppLayout>
    )
}