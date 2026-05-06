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
            <div className="min-h-screen p-4 sm:p-6 lg:p-8 max-w-[1200px] mx-auto space-y-6 sm:space-y-8">

                {/* Header Section */}
                <div className="flex flex-col gap-4 bg-slate-900/50 p-6 sm:p-8 rounded-3xl border border-slate-800/60 backdrop-blur-xl relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-[100px] pointer-events-none" />

                    <div className="flex items-center gap-4 mb-2 relative z-10">
                        <Link
                            href="/admin/courses"
                            className="p-2.5 rounded-xl bg-slate-800/50 text-slate-400 hover:text-white hover:bg-slate-700 transition-all group"
                        >
                            <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
                        </Link>
                        <div className="h-8 w-px bg-slate-800/60" />
                        <div className="flex items-center gap-2 text-indigo-400 bg-indigo-500/10 px-4 py-2 rounded-xl border border-indigo-500/20">
                            <Sparkles size={16} />
                            <span className="text-sm font-semibold tracking-wide uppercase">Edit Course</span>
                        </div>
                    </div>

                    <div className="relative z-10">
                        <h1 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">
                            Update Course Details
                        </h1>
                        <p className="text-slate-400 text-base mt-3 max-w-2xl leading-relaxed">
                            Modify the foundational details of your course. To manage modules and lessons, use the Course Builder.
                        </p>
                    </div>
                </div>

                {/* Form Section */}
                <form onSubmit={submit} className="flex flex-col lg:flex-row gap-6 sm:gap-8">

                    {/* Left Column - Form Fields */}
                    <div className="flex-1 space-y-6">
                        <div className="bg-slate-900/40 p-6 sm:p-8 rounded-3xl border border-slate-800/60 backdrop-blur-md">
                            <div className="flex items-center gap-3 mb-8">
                                <div className="p-2.5 bg-indigo-500/20 rounded-xl text-indigo-400">
                                    <BookOpen size={22} />
                                </div>
                                <h2 className="text-xl font-bold text-white">Course Details</h2>
                            </div>

                            <div className="space-y-6">
                                {/* Title Input */}
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-slate-300 ml-1">
                                        Course Title <span className="text-rose-500">*</span>
                                    </label>
                                    <div className="relative group">
                                        <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/20 to-purple-500/20 rounded-xl blur-md opacity-0 group-focus-within:opacity-100 transition-opacity" />
                                        <input
                                            type="text"
                                            value={data.title}
                                            onChange={(e) => setData("title", e.target.value)}
                                            placeholder="e.g., Advanced Laravel Architecture"
                                            className="relative w-full bg-slate-950/80 border border-slate-800 rounded-xl px-5 py-4 text-white placeholder:text-slate-600 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
                                        />
                                    </div>
                                    {errors.title && (
                                        <div className="flex items-center gap-1.5 text-rose-400 text-sm mt-2 ml-1">
                                            <AlertCircle size={14} />
                                            <span>{errors.title}</span>
                                        </div>
                                    )}
                                </div>

                                {/* Description Input */}
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-slate-300 ml-1">
                                        Description
                                    </label>
                                    <div className="relative group">
                                        <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/20 to-purple-500/20 rounded-xl blur-md opacity-0 group-focus-within:opacity-100 transition-opacity" />
                                        <textarea
                                            rows={8}
                                            value={data.description}
                                            onChange={(e) => setData("description", e.target.value)}
                                            placeholder="What will students learn from this course? Briefly explain the goals and outcomes..."
                                            className="relative w-full bg-slate-950/80 border border-slate-800 rounded-xl px-5 py-4 text-white placeholder:text-slate-600 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all resize-none"
                                        />
                                    </div>
                                    {errors.description && (
                                        <div className="flex items-center gap-1.5 text-rose-400 text-sm mt-2 ml-1">
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
                        <div className="bg-slate-900/40 p-6 rounded-3xl border border-slate-800/60 backdrop-blur-md flex flex-col">
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-lg font-bold text-white flex items-center gap-2">
                                    <ImageIcon size={20} className="text-indigo-400" />
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
                                        className="text-xs font-medium text-rose-400 hover:text-rose-300 bg-rose-500/10 hover:bg-rose-500/20 px-3 py-1.5 rounded-xl transition-colors"
                                    >
                                        Undo Change
                                    </button>
                                )}
                            </div>

                            <div
                                className={`relative flex-1 min-h-[260px] rounded-2xl border-2 border-dashed transition-all duration-300 overflow-hidden group cursor-pointer ${isDragging
                                        ? 'border-indigo-500 bg-indigo-500/10 scale-[1.02]'
                                        : preview
                                            ? 'border-transparent bg-slate-950/50'
                                            : 'border-slate-800 hover:border-indigo-500/50 hover:bg-slate-800/30'
                                    }`}
                                onDragOver={(e) => { e.preventDefault(); setIsDragging(true) }}
                                onDragLeave={() => setIsDragging(false)}
                                onDrop={handleDrop}
                                onClick={() => fileInputRef.current?.click()}
                            >
                                {preview ? (
                                    <>
                                        <img src={preview} alt="Course Preview" className="w-full h-full object-cover" />
                                        <div className="absolute inset-0 bg-slate-950/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center backdrop-blur-sm">
                                            <div className="bg-white/10 text-white px-5 py-2.5 rounded-xl border border-white/20 backdrop-blur-md font-medium text-sm flex items-center gap-2">
                                                <Upload size={16} />
                                                Change Image
                                            </div>
                                        </div>
                                    </>
                                ) : (
                                    <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center">
                                        <div className="w-16 h-16 bg-slate-900 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 group-hover:bg-indigo-500/20 transition-all duration-300 shadow-xl">
                                            <Upload size={28} className="text-slate-500 group-hover:text-indigo-400 transition-colors" />
                                        </div>
                                        <h3 className="text-white font-medium mb-1.5">Upload Thumbnail</h3>
                                        <p className="text-slate-500 text-sm">
                                            Drag & drop or click to browse
                                        </p>
                                        <p className="text-slate-600 text-xs mt-4 uppercase tracking-wider font-semibold">
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
                                <div className="flex items-center justify-center gap-1.5 text-rose-400 text-sm mt-4">
                                    <AlertCircle size={14} />
                                    <span>{errors.thumbnail}</span>
                                </div>
                            )}
                        </div>

                        {/* Submit Actions */}
                        <div className="bg-slate-900/40 p-6 rounded-3xl border border-slate-800/60 backdrop-blur-md">
                            <button
                                disabled={processing}
                                className="w-full relative overflow-hidden group bg-slate-800 rounded-xl font-medium text-white p-4 transition-all hover:shadow-2xl hover:shadow-indigo-500/20 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-600 opacity-90 transition-opacity group-hover:opacity-100" />
                                <div className="relative flex justify-center items-center gap-2">
                                    {processing ? (
                                        <>
                                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                            <span>Updating Course...</span>
                                        </>
                                    ) : (
                                        <>
                                            <Sparkles size={18} className="group-hover:animate-pulse text-indigo-200" />
                                            <span>Save Changes</span>
                                        </>
                                    )}
                                </div>
                            </button>
                        </div>

                    </div>
                </form>

            </div>
        </AppLayout>
    )
}
