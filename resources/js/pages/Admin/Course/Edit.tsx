import { useForm, Link } from "@inertiajs/react"
import { useState, useRef } from "react"
import AppLayout from "@/layouts/app-layout"
import { Upload, Image as ImageIcon, ArrowLeft, BookOpen, Sparkles, AlertCircle } from "lucide-react"

type Course = {
    _id: string
    title: string
    description: string
    thumbnail: string | null
    thumbnail_url?: string | null
    slug: string
}

export default function Edit({ course }: { course: Course }) {
    const { data, setData, post, processing, errors } = useForm({
        _method: "PUT",
        title: course.title || "",
        description: course.description || "",
        thumbnail: null as File | null
    })

    const initialPreview = course.thumbnail_url
        || (course.thumbnail?.startsWith('http') ? course.thumbnail : (course.thumbnail ? `/storage/${course.thumbnail}` : null))

    const [preview, setPreview] = useState<string | null>(initialPreview)
    const [isDragging, setIsDragging] = useState(false)
    const fileInputRef = useRef<HTMLInputElement>(null)

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

    function submit(e: React.FormEvent) {
        e.preventDefault()
        post(`/admin/courses/${course.slug}`, {
            forceFormData: true
        })
    }

    return (
        <AppLayout>
            <div 
                className="min-h-screen bg-[#f8fafc] dark:bg-[#030712] text-slate-800 dark:text-white px-4 py-8 sm:px-6 lg:px-8 transition-colors duration-200"
                style={{ fontFamily: "'Outfit', sans-serif" }}
            >
                <div className="max-w-[1200px] mx-auto space-y-6 sm:space-y-8">
                    {/* Header Section */}
                    <div className="flex flex-col gap-4 bg-white dark:bg-[#0d0f17]/50 p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-slate-800/60 backdrop-blur-xl relative overflow-hidden shadow-sm">
                        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/5 dark:bg-indigo-500/10 rounded-full blur-[100px] pointer-events-none" />

                        <div className="flex items-center gap-4 mb-2 relative z-10">
                            <Link
                                href="/admin/courses"
                                className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-slate-700 transition-all group"
                            >
                                <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
                            </Link>
                            <div className="h-8 w-px bg-slate-200 dark:bg-slate-800/60" />
                            <div className="flex items-center gap-2 text-[#3B28F6] dark:text-indigo-400 bg-blue-50 dark:bg-indigo-500/10 px-4 py-2 rounded-xl border border-blue-100 dark:border-indigo-500/20">
                                <Sparkles size={16} />
                                <span className="text-xs font-semibold tracking-wide uppercase">Edit Course</span>
                            </div>
                        </div>

                        <div className="relative z-10">
                            <h1 
                                className="text-2xl sm:text-3xl font-bold text-slate-800 dark:text-white tracking-tight"
                                style={{ fontFamily: "Orbitron, sans-serif" }}
                            >
                                Update Course Details
                            </h1>
                            <p className="text-slate-500 dark:text-slate-400 text-sm mt-2 max-w-2xl leading-relaxed">
                                Modify the foundational details of your course. To manage modules and lessons, use the Course Builder.
                            </p>
                        </div>
                    </div>

                    {/* Form Section */}
                    <form onSubmit={submit} className="flex flex-col lg:flex-row gap-6 sm:gap-8">

                        {/* Left Column - Form Fields */}
                        <div className="flex-1 space-y-6">
                            <div className="bg-white dark:bg-slate-900/40 p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-slate-800/60 backdrop-blur-md shadow-sm">
                                <div className="flex items-center gap-3 mb-8">
                                    <div className="p-2.5 bg-blue-50 dark:bg-indigo-500/20 rounded-xl text-[#3B28F6] dark:text-indigo-400">
                                        <BookOpen size={20} />
                                    </div>
                                    <h2 className="text-lg font-bold text-slate-800 dark:text-white">Course Details</h2>
                                </div>

                                <div className="space-y-6">
                                    {/* Title Input */}
                                    <div className="space-y-2">
                                        <label className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500 dark:text-slate-400 ml-1">
                                            Course Title <span className="text-rose-500">*</span>
                                        </label>
                                        <div className="relative group">
                                            <input
                                                type="text"
                                                value={data.title}
                                                onChange={(e) => setData("title", e.target.value)}
                                                placeholder="e.g., Advanced Laravel Architecture"
                                                className="relative w-full bg-slate-50 dark:bg-slate-950/80 border border-slate-200 dark:border-slate-850 rounded-xl px-5 py-4 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-650 focus:outline-none focus:border-[#3B28F6] focus:ring-1 focus:ring-[#3B28F6] transition-all"
                                            />
                                        </div>
                                        {errors.title && (
                                            <div className="flex items-center gap-1.5 text-rose-500 dark:text-rose-450 text-sm mt-2 ml-1">
                                                <AlertCircle size={14} />
                                                <span>{errors.title}</span>
                                            </div>
                                        )}
                                    </div>

                                    {/* Description Input */}
                                    <div className="space-y-2">
                                        <label className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500 dark:text-slate-400 ml-1">
                                            Description
                                        </label>
                                        <div className="relative group">
                                            <textarea
                                                rows={8}
                                                value={data.description}
                                                onChange={(e) => setData("description", e.target.value)}
                                                placeholder="What will students learn from this course? Briefly explain the goals and outcomes..."
                                                className="relative w-full bg-slate-50 dark:bg-slate-950/80 border border-slate-200 dark:border-slate-850 rounded-xl px-5 py-4 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-650 focus:outline-none focus:border-[#3B28F6] focus:ring-1 focus:ring-[#3B28F6] transition-all resize-none"
                                            />
                                        </div>
                                        {errors.description && (
                                            <div className="flex items-center gap-1.5 text-rose-500 dark:text-rose-450 text-sm mt-2 ml-1">
                                                <AlertCircle size={14} />
                                                <span>{errors.description}</span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Right Column - Thumbnail & Actions */}
                        <div className="lg:w-[400px] flex flex-col gap-6">

                            {/* Thumbnail Upload Card */}
                            <div className="bg-white dark:bg-slate-900/40 p-6 rounded-3xl border border-slate-200 dark:border-slate-800/60 backdrop-blur-md flex flex-col shadow-sm">
                                <div className="flex items-center justify-between mb-6">
                                    <h2 className="text-base font-bold text-slate-800 dark:text-white flex items-center gap-2">
                                        <ImageIcon size={18} className="text-[#3B28F6] dark:text-indigo-400" />
                                        Cover Image
                                    </h2>
                                    {preview && preview !== initialPreview && (
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setPreview(initialPreview)
                                                setData("thumbnail", null)
                                                if (fileInputRef.current) fileInputRef.current.value = ""
                                            }}
                                            className="text-xs font-semibold text-rose-500 hover:text-rose-450 bg-rose-50 dark:bg-rose-500/10 hover:bg-rose-100 dark:hover:bg-rose-500/20 px-3 py-1.5 rounded-xl transition-colors"
                                        >
                                            Undo Change
                                        </button>
                                    )}
                                </div>

                                <div
                                    className={`relative flex-1 min-h-[260px] rounded-2xl border-2 border-dashed transition-all duration-300 overflow-hidden group cursor-pointer ${isDragging
                                            ? 'border-[#3B28F6] bg-[#3B28F6]/10 scale-[1.02]'
                                            : preview
                                                ? 'border-transparent bg-slate-100 dark:bg-slate-950/50'
                                                : 'border-slate-200 dark:border-slate-800 hover:border-[#3B28F6]/50 dark:hover:border-indigo-500/50 hover:bg-slate-50 dark:hover:bg-slate-800/30'
                                        }`}
                                    onDragOver={(e) => { e.preventDefault(); setIsDragging(true) }}
                                    onDragLeave={() => setIsDragging(false)}
                                    onDrop={handleDrop}
                                    onClick={() => fileInputRef.current?.click()}
                                >
                                    {preview ? (
                                        <>
                                            <img src={preview} alt="Course Preview" className="w-full h-full object-cover" />
                                            <div className="absolute inset-0 bg-slate-900/60 dark:bg-slate-950/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center backdrop-blur-sm">
                                                <div className="bg-white/10 text-white px-5 py-2.5 rounded-xl border border-white/20 backdrop-blur-md font-medium text-sm flex items-center gap-2">
                                                    <Upload size={16} />
                                                    Change Image
                                                </div>
                                            </div>
                                        </>
                                    ) : (
                                        <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center">
                                            <div className="w-14 h-14 bg-slate-100 dark:bg-slate-900 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 group-hover:bg-[#3B28F6]/20 transition-all duration-300 shadow-sm">
                                                <Upload size={24} className="text-slate-400 dark:text-slate-500 group-hover:text-[#3B28F6] transition-colors" />
                                            </div>
                                            <h3 className="text-slate-800 dark:text-white font-semibold mb-1">Upload Thumbnail</h3>
                                            <p className="text-slate-400 text-xs sm:text-sm">
                                                Drag & drop or click to browse
                                            </p>
                                            <p className="text-slate-400 dark:text-slate-600 text-[10px] mt-4 uppercase tracking-wider font-bold">
                                                16:9 Ratio Recommended
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
                                    <div className="flex items-center justify-center gap-1.5 text-rose-500 dark:text-rose-450 text-sm mt-4">
                                        <AlertCircle size={14} />
                                        <span>{errors.thumbnail}</span>
                                    </div>
                                )}
                            </div>

                            {/* Submit Actions */}
                            <div className="bg-white dark:bg-slate-900/40 p-6 rounded-3xl border border-slate-200 dark:border-slate-800/60 backdrop-blur-md shadow-sm">
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="w-full relative overflow-hidden group bg-slate-800 dark:bg-[#3B28F6] hover:bg-slate-700 dark:hover:bg-[#2A1CE0] rounded-xl font-semibold text-white p-4 transition-all hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    <div className="relative flex justify-center items-center gap-2">
                                        {processing ? (
                                            <>
                                                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                                <span>Updating Course...</span>
                                            </>
                                        ) : (
                                            <>
                                                <Sparkles size={16} className="group-hover:animate-pulse text-indigo-200" />
                                                <span>Save Changes</span>
                                            </>
                                        )}
                                    </div>
                                </button>
                            </div>

                        </div>
                    </form>
                </div>
            </div>
        </AppLayout>
    )
}
