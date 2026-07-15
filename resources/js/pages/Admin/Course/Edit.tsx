import { useForm, Link } from '@inertiajs/react';
import { useState, useRef } from 'react';
import AppLayout from '@/layouts/app-layout';
import {
    Upload,
    Image as ImageIcon,
    ArrowLeft,
    BookOpen,
    AlertCircle,
} from 'lucide-react';

type Course = {
    _id: string;
    title: string;
    description: string;
    thumbnail: string | null;
    thumbnail_url?: string | null;
    slug: string;
};

export default function Edit({ course }: { course: Course }) {
    const { data, setData, post, processing, errors } = useForm({
        _method: 'PUT',
        title: course.title || '',
        description: course.description || '',
        thumbnail: null as File | null,
    });

    const initialPreview =
        course.thumbnail_url ||
        (course.thumbnail?.startsWith('http')
            ? course.thumbnail
            : course.thumbnail
              ? `/storage/${course.thumbnail}`
              : null);

    const [preview, setPreview] = useState<string | null>(initialPreview);
    const [isDragging, setIsDragging] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    function handleFile(file: File) {
        if (!file.type.startsWith('image/')) {
            alert('Please upload an image file');
            return;
        }
        setData('thumbnail', file);
        setPreview(URL.createObjectURL(file));
    }

    function handleDrop(e: React.DragEvent) {
        e.preventDefault();
        setIsDragging(false);
        const file = e.dataTransfer.files?.[0];
        if (file) handleFile(file);
    }

    function submit(e: React.FormEvent) {
        e.preventDefault();
        post(`/admin/courses/${course.slug}`, {
            forceFormData: true,
        });
    }

    return (
        <AppLayout>
            <div
                className="min-h-screen bg-[#f8fafc] px-4 py-8 text-slate-800 transition-colors duration-200 sm:px-6 lg:px-8 dark:bg-[#030712] dark:text-white"
                style={{ fontFamily: "'Outfit', sans-serif" }}
            >
                <div className="mx-auto max-w-[1200px] space-y-6 sm:space-y-8">
                    {/* Header Section */}
                    <div className="relative flex flex-col gap-4 overflow-hidden rounded-3xl border border-slate-200 bg-white p-6 shadow-sm backdrop-blur-xl sm:p-8 dark:border-slate-800/60 dark:bg-[#0d0f17]/50">
                        <div className="pointer-events-none absolute top-0 right-0 h-96 w-96 rounded-full bg-indigo-500/5 blur-[100px] dark:bg-indigo-500/10" />

                        <div className="relative z-10 mb-2 flex items-center gap-4">
                            <Link
                                href="/admin/courses"
                                className="group rounded-xl bg-slate-100 p-2.5 text-slate-500 transition-all hover:bg-slate-200 hover:text-slate-900 dark:bg-slate-800/50 dark:text-slate-400 dark:hover:bg-slate-700 dark:hover:text-white"
                            >
                                <ArrowLeft
                                    size={18}
                                    className="transition-transform group-hover:-translate-x-1"
                                />
                            </Link>
                            <div className="h-8 w-px bg-slate-200 dark:bg-slate-800/60" />
                            <div className="flex items-center gap-2 rounded-xl border border-blue-100 bg-blue-50 px-4 py-2 text-[#3B28F6] dark:border-indigo-500/20 dark:bg-indigo-500/10 dark:text-indigo-400">
                                <span className="text-xs font-semibold tracking-wide uppercase">
                                    Edit Course
                                </span>
                            </div>
                        </div>

                        <div className="relative z-10">
                            <h1
                                className="text-2xl font-bold tracking-tight text-slate-800 sm:text-3xl dark:text-white"
                                style={{ fontFamily: 'Orbitron, sans-serif' }}
                            >
                                Update Course Details
                            </h1>
                            <p className="mt-2 max-w-2xl text-sm leading-relaxed text-slate-500 dark:text-slate-400">
                                Modify the foundational details of your course.
                                To manage modules and lessons, use the Course
                                Builder.
                            </p>
                        </div>
                    </div>

                    {/* Form Section */}
                    <form
                        onSubmit={submit}
                        className="flex flex-col gap-6 sm:gap-8 lg:flex-row"
                    >
                        {/* Left Column - Form Fields */}
                        <div className="flex-1 space-y-6">
                            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm backdrop-blur-md sm:p-8 dark:border-slate-800/60 dark:bg-slate-900/40">
                                <div className="mb-8 flex items-center gap-3">
                                    <div className="rounded-xl bg-blue-50 p-2.5 text-[#3B28F6] dark:bg-indigo-500/20 dark:text-indigo-400">
                                        <BookOpen size={20} />
                                    </div>
                                    <h2 className="text-lg font-bold text-slate-800 dark:text-white">
                                        Course Details
                                    </h2>
                                </div>

                                <div className="space-y-6">
                                    {/* Title Input */}
                                    <div className="space-y-2">
                                        <label className="ml-1 text-xs font-semibold tracking-[0.14em] text-slate-500 uppercase dark:text-slate-400">
                                            Course Title{' '}
                                            <span className="text-rose-500">
                                                *
                                            </span>
                                        </label>
                                        <div className="group relative">
                                            <input
                                                type="text"
                                                value={data.title}
                                                onChange={(e) =>
                                                    setData(
                                                        'title',
                                                        e.target.value,
                                                    )
                                                }
                                                placeholder="e.g., Advanced Laravel Architecture"
                                                className="dark:border-slate-850 dark:placeholder:text-slate-650 relative w-full rounded-xl border border-slate-200 bg-slate-50 px-5 py-4 text-slate-900 transition-all placeholder:text-slate-400 focus:border-[#3B28F6] focus:ring-1 focus:ring-[#3B28F6] focus:outline-none dark:bg-slate-950/80 dark:text-white"
                                            />
                                        </div>
                                        {errors.title && (
                                            <div className="dark:text-rose-450 mt-2 ml-1 flex items-center gap-1.5 text-sm text-rose-500">
                                                <AlertCircle size={14} />
                                                <span>{errors.title}</span>
                                            </div>
                                        )}
                                    </div>

                                    {/* Description Input */}
                                    <div className="space-y-2">
                                        <label className="ml-1 text-xs font-semibold tracking-[0.14em] text-slate-500 uppercase dark:text-slate-400">
                                            Description
                                        </label>
                                        <div className="group relative">
                                            <textarea
                                                rows={8}
                                                value={data.description}
                                                onChange={(e) =>
                                                    setData(
                                                        'description',
                                                        e.target.value,
                                                    )
                                                }
                                                placeholder="What will students learn from this course? Briefly explain the goals and outcomes..."
                                                className="dark:border-slate-850 dark:placeholder:text-slate-650 relative w-full resize-none rounded-xl border border-slate-200 bg-slate-50 px-5 py-4 text-slate-900 transition-all placeholder:text-slate-400 focus:border-[#3B28F6] focus:ring-1 focus:ring-[#3B28F6] focus:outline-none dark:bg-slate-950/80 dark:text-white"
                                            />
                                        </div>
                                        {errors.description && (
                                            <div className="dark:text-rose-450 mt-2 ml-1 flex items-center gap-1.5 text-sm text-rose-500">
                                                <AlertCircle size={14} />
                                                <span>
                                                    {errors.description}
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Right Column - Thumbnail & Actions */}
                        <div className="flex flex-col gap-6 lg:w-[400px]">
                            {/* Thumbnail Upload Card */}
                            <div className="flex flex-col rounded-3xl border border-slate-200 bg-white p-6 shadow-sm backdrop-blur-md dark:border-slate-800/60 dark:bg-slate-900/40">
                                <div className="mb-6 flex items-center justify-between">
                                    <h2 className="flex items-center gap-2 text-base font-bold text-slate-800 dark:text-white">
                                        <ImageIcon
                                            size={18}
                                            className="text-[#3B28F6] dark:text-indigo-400"
                                        />
                                        Cover Image
                                    </h2>
                                    {preview && preview !== initialPreview && (
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setPreview(initialPreview);
                                                setData('thumbnail', null);
                                                if (fileInputRef.current)
                                                    fileInputRef.current.value =
                                                        '';
                                            }}
                                            className="hover:text-rose-450 rounded-xl bg-rose-50 px-3 py-1.5 text-xs font-semibold text-rose-500 transition-colors hover:bg-rose-100 dark:bg-rose-500/10 dark:hover:bg-rose-500/20"
                                        >
                                            Undo Change
                                        </button>
                                    )}
                                </div>

                                <div
                                    className={`group relative min-h-[260px] flex-1 cursor-pointer overflow-hidden rounded-2xl border-2 border-dashed transition-all duration-300 ${
                                        isDragging
                                            ? 'scale-[1.02] border-[#3B28F6] bg-[#3B28F6]/10'
                                            : preview
                                              ? 'border-transparent bg-slate-100 dark:bg-slate-950/50'
                                              : 'border-slate-200 hover:border-[#3B28F6]/50 hover:bg-slate-50 dark:border-slate-800 dark:hover:border-indigo-500/50 dark:hover:bg-slate-800/30'
                                    }`}
                                    onDragOver={(e) => {
                                        e.preventDefault();
                                        setIsDragging(true);
                                    }}
                                    onDragLeave={() => setIsDragging(false)}
                                    onDrop={handleDrop}
                                    onClick={() =>
                                        fileInputRef.current?.click()
                                    }
                                >
                                    {preview ? (
                                        <>
                                            <img
                                                src={preview}
                                                alt="Course Preview"
                                                className="h-full w-full object-cover"
                                            />
                                            <div className="absolute inset-0 flex items-center justify-center bg-slate-900/60 opacity-0 backdrop-blur-sm transition-opacity duration-300 group-hover:opacity-100 dark:bg-slate-950/60">
                                                <div className="flex items-center gap-2 rounded-xl border border-white/20 bg-white/10 px-5 py-2.5 text-sm font-medium text-white backdrop-blur-md">
                                                    <Upload size={16} />
                                                    Change Image
                                                </div>
                                            </div>
                                        </>
                                    ) : (
                                        <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center">
                                            <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-slate-100 shadow-sm transition-all duration-300 group-hover:scale-110 group-hover:bg-[#3B28F6]/20 dark:bg-slate-900">
                                                <Upload
                                                    size={24}
                                                    className="text-slate-400 transition-colors group-hover:text-[#3B28F6] dark:text-slate-500"
                                                />
                                            </div>
                                            <h3 className="mb-1 font-semibold text-slate-800 dark:text-white">
                                                Upload Thumbnail
                                            </h3>
                                            <p className="text-xs text-slate-400 sm:text-sm">
                                                Drag & drop or click to browse
                                            </p>
                                            <p className="mt-4 text-[10px] font-bold tracking-wider text-slate-400 uppercase dark:text-slate-600">
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
                                        const file = e.target.files?.[0];
                                        if (file) handleFile(file);
                                    }}
                                />
                                {errors.thumbnail && (
                                    <div className="dark:text-rose-450 mt-4 flex items-center justify-center gap-1.5 text-sm text-rose-500">
                                        <AlertCircle size={14} />
                                        <span>{errors.thumbnail}</span>
                                    </div>
                                )}
                            </div>

                            {/* Submit Actions */}
                            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm backdrop-blur-md dark:border-slate-800/60 dark:bg-slate-900/40">
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="group relative w-full overflow-hidden rounded-xl bg-slate-800 p-4 font-semibold text-white transition-all hover:bg-slate-700 hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-50 dark:bg-[#3B28F6] dark:hover:bg-[#2A1CE0]"
                                >
                                    <div className="relative flex items-center justify-center gap-2">
                                        {processing ? (
                                            <>
                                                <div className="h-5 w-5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                                                <span>Updating Course...</span>
                                            </>
                                        ) : (
                                            <>
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
    );
}
