import { Link, router, useForm } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import {
    Pencil,
    Trash2,
    Plus,
    Image as ImageIcon,
    ArrowRight,
    BookOpen,
    Upload,
    AlertCircle,
    Globe,
    FileText,
} from 'lucide-react';
import { useState, useRef } from 'react';
import Modal from '@/components/ui/Modal';
import ConfirmModal from '@/components/ui/ConfirmModal';
import AlertModal from '@/components/ui/AlertModal';

type Course = {
    _id: string;
    title: string;
    description: string;
    thumbnail: string | null;
    thumbnail_url?: string | null;
    slug: string;
    status: 'draft' | 'published';
};

export default function Index({ courses }: { courses: Course[] }) {
    const [openModal, setOpenModal] = useState<'create' | 'edit' | null>(null);
    const [editingCourse, setEditingCourse] = useState<Course | null>(null);
    const [preview, setPreview] = useState<string | null>(null);
    const [isDragging, setIsDragging] = useState(false);
    const [alertMessage, setAlertMessage] = useState<string | null>(null);
    const [confirmDeleteSlug, setConfirmDeleteSlug] = useState<string | null>(
        null,
    );
    const fileInputRef = useRef<HTMLInputElement>(null);

    const { data, setData, post, processing, errors, reset, clearErrors } =
        useForm({
            _method: 'POST',
            title: '',
            description: '',
            thumbnail: null as File | null,
        });

    function handleFile(file: File) {
        if (!file.type.startsWith('image/')) {
            setAlertMessage('Please upload an image file.');
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

    function openCreate() {
        clearErrors();
        reset();
        setData('_method', 'POST');
        setPreview(null);
        setEditingCourse(null);
        setOpenModal('create');
    }

    function openEdit(course: Course) {
        clearErrors();
        reset();
        setData({
            _method: 'PUT',
            title: course.title,
            description: course.description || '',
            thumbnail: null,
        });
        const initialPreview =
            course.thumbnail_url ||
            (course.thumbnail?.startsWith('http')
                ? course.thumbnail
                : course.thumbnail
                  ? `/storage/${course.thumbnail}`
                  : null);
        setPreview(initialPreview);
        setEditingCourse(course);
        setOpenModal('edit');
    }

    function closeModal() {
        setOpenModal(null);
        setEditingCourse(null);
        reset();
    }

    function submit(e: React.FormEvent) {
        e.preventDefault();
        const url =
            openModal === 'edit' && editingCourse
                ? `/admin/courses/${editingCourse.slug}`
                : '/admin/courses';

        post(url, {
            forceFormData: true,
            onSuccess: () => closeModal(),
        });
    }

    function deleteCourse(slug: string) {
        setConfirmDeleteSlug(slug);
    }

    function executeDeleteCourse() {
        if (confirmDeleteSlug) {
            router.delete(`/admin/courses/${confirmDeleteSlug}`);
            setConfirmDeleteSlug(null);
        }
    }

    function handleTogglePublish(course: Course) {
        router.post(
            `/admin/courses/${course.slug}/publish`,
            {},
            {
                preserveScroll: true,
            },
        );
    }

    return (
        <AppLayout>
            <div
                className="relative min-h-screen overflow-hidden bg-[#f8fafc] px-4 py-8 text-slate-800 transition-colors duration-200 sm:px-6 lg:px-10 dark:bg-[#030712] dark:text-white"
                style={{ fontFamily: "'Outfit', sans-serif" }}
            >
                {/* Subtle top-center ambient glow (visible on dark mode) */}
                <div className="pointer-events-none absolute top-0 left-1/2 z-0 h-[450px] w-full max-w-7xl -translate-x-1/2 rounded-full bg-indigo-500/5 blur-[120px] select-none dark:bg-indigo-500/5" />

                <div className="relative z-10 mx-auto max-w-7xl space-y-6">
                    {/* HEADER */}
                    <div className="relative overflow-hidden rounded-xl border border-slate-200/80 bg-[#f5f6ff] p-6 shadow-sm sm:p-8 md:p-10 dark:border-slate-800 dark:bg-[#0d0f17]">
                        {/* Grid Pattern Motif */}
                        <div
                            className="pointer-events-none absolute inset-0 z-0"
                            style={{
                                backgroundImage: `
                                    linear-gradient(rgba(59, 40, 246, 0.07) 1px, transparent 1px),
                                    linear-gradient(90deg, rgba(59, 40, 246, 0.07) 1px, transparent 1px)
                                `,
                                backgroundSize: '40px 40px',
                            }}
                        />

                        <div className="absolute top-0 right-8 left-8 z-0 h-px bg-gradient-to-r from-transparent via-slate-300 to-transparent dark:via-slate-700" />

                        <div className="relative z-10 flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
                            <div className="max-w-2xl space-y-3">
                                <span className="inline-block text-[0.6rem] font-semibold tracking-[0.2em] text-slate-500 uppercase dark:text-slate-500">
                                    Courses
                                </span>
                                <h1 className="text-2xl leading-snug font-semibold tracking-tight text-slate-800 md:text-[28px] dark:text-white">
                                    Course Management
                                </h1>
                                <p className="text-sm leading-relaxed text-slate-500 md:text-[15px] dark:text-slate-400/60">
                                    Manage, organize, and publish your learning
                                    content.
                                </p>
                            </div>

                            <button
                                onClick={openCreate}
                                className="relative z-10 inline-flex shrink-0 items-center gap-2 rounded-xl bg-[#3B28F6] px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-[#2a1ce0]"
                            >
                                <Plus size={18} />
                                Create Course
                            </button>
                        </div>
                    </div>

                    {/* GRID */}
                    {courses.length > 0 ? (
                        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                            {courses.map((course) => (
                                <div
                                    key={course._id}
                                    className="group flex flex-col overflow-hidden rounded-xl border border-slate-200 bg-white transition-all duration-200 ease-out hover:-translate-y-0.5 hover:border-[#3B28F6]/50 hover:shadow-md dark:border-white/8 dark:bg-[#060B1A]/80 dark:hover:border-[#7C5CFF]/50 dark:hover:shadow-lg dark:hover:shadow-[#7C5CFF]/5"
                                >
                                    <Link
                                        href={`/admin/courses/${course.slug}`}
                                        className="relative block h-48 overflow-hidden bg-slate-100 sm:h-52 dark:bg-white/5"
                                    >
                                        {/* Status Badge */}
                                        <div className="absolute top-3 left-3 z-10">
                                            {course.status === 'published' ? (
                                                <span className="inline-flex items-center gap-1.5 rounded-lg border border-emerald-500/20 bg-emerald-500/10 px-2.5 py-1 text-[10px] font-bold tracking-wider text-emerald-600 dark:text-emerald-400 uppercase shadow-sm backdrop-blur-md">
                                                    <Globe
                                                        size={10}
                                                        className="shrink-0"
                                                    />
                                                    Published
                                                </span>
                                            ) : (
                                                <span className="inline-flex items-center gap-1.5 rounded-lg border border-amber-500/20 bg-amber-500/10 px-2.5 py-1 text-[10px] font-bold tracking-wider text-amber-600 dark:text-amber-400 uppercase shadow-sm backdrop-blur-md">
                                                    <FileText
                                                        size={10}
                                                        className="shrink-0"
                                                    />
                                                    Draft
                                                </span>
                                            )}
                                        </div>

                                        {course.thumbnail_url ||
                                        course.thumbnail ? (
                                            <img
                                                src={
                                                    course.thumbnail_url ||
                                                    (course.thumbnail?.startsWith(
                                                        'http',
                                                    )
                                                        ? course.thumbnail
                                                        : `/storage/${course.thumbnail}`)
                                                }
                                                alt={course.title}
                                                className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                                            />
                                        ) : (
                                            <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-400 dark:text-slate-500">
                                                <ImageIcon
                                                    size={32}
                                                    className="mb-2 opacity-40"
                                                />
                                                <span className="text-xs font-semibold tracking-wider uppercase">
                                                    No Cover Image
                                                </span>
                                            </div>
                                        )}
                                        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/30 via-transparent to-transparent dark:from-[#030712]" />
                                    </Link>

                                    <div className="flex flex-1 flex-col p-5">
                                        <Link
                                            href={`/admin/courses/${course.slug}`}
                                            className="mb-2 block transition-colors group-hover:text-[#3B28F6] dark:group-hover:text-[#7C5CFF]"
                                        >
                                            <h2
                                                className="line-clamp-1 text-base leading-snug font-bold text-slate-800 dark:text-white"
                                                title={course.title}
                                            >
                                                {course.title}
                                            </h2>
                                        </Link>

                                        <p className="mb-6 line-clamp-2 flex-1 text-xs leading-relaxed text-slate-500 sm:text-sm dark:text-slate-400">
                                            {course.description ||
                                                'No description provided.'}
                                        </p>

                                        <div className="mt-auto flex items-center justify-between border-t border-slate-100 pt-4 dark:border-white/5">
                                            <Link
                                                href={`/admin/courses/${course.slug}`}
                                                className="flex items-center gap-1.5 text-xs font-semibold text-[#3B28F6] transition-colors hover:text-[#2A1CE0] sm:text-sm dark:text-[#7C5CFF] dark:hover:text-[#8B5CF6]"
                                            >
                                                Details
                                            </Link>

                                            <div className="flex items-center gap-1">
                                                <button
                                                    onClick={() =>
                                                        handleTogglePublish(
                                                            course,
                                                        )
                                                    }
                                                    className={`cursor-pointer rounded-lg p-2 transition-colors ${
                                                        course.status ===
                                                        'published'
                                                            ? 'text-emerald-500 hover:bg-emerald-50 hover:text-emerald-600 dark:hover:bg-emerald-500/10'
                                                            : 'text-amber-500 hover:bg-amber-50 hover:text-amber-600 dark:hover:bg-amber-500/10'
                                                    }`}
                                                    title={
                                                        course.status ===
                                                        'published'
                                                            ? 'Revert to Draft'
                                                            : 'Publish Course'
                                                    }
                                                >
                                                    {course.status ===
                                                    'published' ? (
                                                        <FileText size={15} />
                                                    ) : (
                                                        <Globe size={15} />
                                                    )}
                                                </button>
                                                <button
                                                    onClick={() =>
                                                        openEdit(course)
                                                    }
                                                    className="dark:text-slate-555 cursor-pointer rounded-lg p-2 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-white/5 dark:hover:text-white"
                                                    title="Edit Details"
                                                >
                                                    <Pencil size={15} />
                                                </button>
                                                <button
                                                    onClick={() =>
                                                        deleteCourse(
                                                            course.slug,
                                                        )
                                                    }
                                                    className="hover:text-red-650 dark:text-slate-555 cursor-pointer rounded-lg p-2 text-slate-400 transition-colors hover:bg-red-50 dark:hover:bg-red-500/10 dark:hover:text-red-400"
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
                        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-slate-200 bg-white py-24 shadow-sm dark:border-white/8 dark:bg-[#060B1A]/60">
                            <div className="dark:text-slate-400 mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-slate-50 text-slate-400 shadow-inner dark:bg-white/5">
                                <BookOpen size={32} />
                            </div>
                            <h3 className="mb-2 text-lg font-bold text-slate-800 dark:text-white">
                                No courses created yet
                            </h3>
                            <p className="mb-6 max-w-sm text-center text-sm text-slate-500 dark:text-slate-400">
                                Your learning platform is empty. Get started by
                                creating your first course and building an
                                engaging curriculum.
                            </p>
                            <button
                                onClick={openCreate}
                                className="flex items-center gap-2 rounded-xl border border-transparent bg-slate-800 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-slate-700 dark:bg-white/10 dark:hover:bg-white/20"
                            >
                                <Plus size={18} />
                                Create First Course
                            </button>
                        </div>
                    )}

                    {/* MODAL */}
                    <Modal
                        open={openModal !== null}
                        title={
                            openModal === 'edit'
                                ? 'Edit Course'
                                : 'Create Course'
                        }
                        onClose={closeModal}
                        maxWidth="max-w-4xl"
                    >
                        <form
                            onSubmit={submit}
                            className="grid grid-cols-1 gap-6 pt-2 md:grid-cols-[0.9fr_1.1fr]"
                        >
                            <div className="space-y-3">
                                <div className="flex items-center justify-between">
                                    <label className="text-xs font-semibold tracking-[0.14em] text-slate-500 uppercase dark:text-slate-400">
                                        Course Cover
                                    </label>

                                    {preview && (
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setPreview(null);
                                                setData('thumbnail', null);
                                                if (fileInputRef.current)
                                                    fileInputRef.current.value =
                                                        '';
                                            }}
                                            className="hover:text-rose-600 dark:hover:text-rose-400 text-xs font-medium text-rose-500 transition-colors"
                                        >
                                            Remove
                                        </button>
                                    )}
                                </div>

                                <div
                                    onDragOver={(e) => {
                                        e.preventDefault();
                                        setIsDragging(true);
                                    }}
                                    onDragLeave={() => setIsDragging(false)}
                                    onDrop={handleDrop}
                                    onClick={() =>
                                        fileInputRef.current?.click()
                                    }
                                    className={`relative flex aspect-[4/3] cursor-pointer items-center justify-center overflow-hidden rounded-xl border transition-colors ${isDragging ? 'border-[#3B28F6] bg-[#3B28F6]/10' : preview ? 'border-slate-200 bg-slate-50 dark:border-white/10 dark:bg-white/[0.03]' : 'border-dashed border-slate-200 bg-slate-50 hover:border-[#3B28F6]/50 hover:bg-slate-100 dark:border-white/10 dark:bg-white/[0.03] dark:hover:border-[#3B28F6]/50 dark:hover:bg-white/[0.05]'}`}
                                >
                                    {preview ? (
                                        <>
                                            <img
                                                src={preview}
                                                alt="Course Preview"
                                                className="h-full w-full object-cover"
                                            />
                                            <div className="absolute inset-0 flex items-center justify-center bg-slate-900/60 opacity-0 backdrop-blur-sm transition-opacity hover:opacity-100 dark:bg-[#030712]/55">
                                                <div className="inline-flex items-center gap-2 rounded-xl border border-white/20 bg-white/10 px-4 py-2 text-sm font-medium text-white">
                                                    <Upload size={16} />
                                                    Change Image
                                                </div>
                                            </div>
                                        </>
                                    ) : (
                                        <div className="flex flex-col items-center px-6 text-center">
                                            <div className="mb-3 flex size-12 items-center justify-center rounded-xl border border-slate-200 bg-slate-100 text-slate-400 dark:border-white/10 dark:bg-[#0B1020] dark:text-[#3B28F6]">
                                                <Upload size={20} />
                                            </div>
                                            <h3 className="text-sm font-semibold text-slate-800 dark:text-white">
                                                Upload Thumbnail
                                            </h3>
                                            <p className="mt-1 max-w-[220px] text-xs leading-relaxed text-slate-400">
                                                Drag and drop image here, or
                                                click to browse files.
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
                                    <div className="dark:text-rose-400 flex items-center gap-2 rounded-xl border border-rose-500/20 bg-rose-500/10 px-3 py-2 text-xs text-rose-500">
                                        <AlertCircle size={14} />
                                        <span>{errors.thumbnail}</span>
                                    </div>
                                )}
                            </div>

                            <div className="flex flex-col justify-between space-y-5">
                                <div className="space-y-4">
                                    <div className="space-y-2">
                                        <label className="ml-1 text-xs font-semibold tracking-[0.14em] text-slate-500 uppercase dark:text-slate-400">
                                            Course Title{' '}
                                            <span className="text-rose-500">
                                                *
                                            </span>
                                        </label>

                                        <input
                                            type="text"
                                            value={data.title}
                                            onChange={(e) =>
                                                setData('title', e.target.value)
                                            }
                                            placeholder="e.g., Advanced Laravel Architecture"
                                            className="dark:placeholder:text-slate-650 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 transition-colors outline-none placeholder:text-slate-400 focus:border-[#3B28F6] focus:bg-white dark:border-white/10 dark:bg-white/[0.03] dark:text-white dark:focus:bg-white/[0.05]"
                                        />

                                        {errors.title && (
                                            <div className="dark:text-rose-400 ml-1 flex items-center gap-1.5 text-xs text-rose-500">
                                                <AlertCircle size={13} />
                                                <span>{errors.title}</span>
                                            </div>
                                        )}
                                    </div>

                                    <div className="space-y-2">
                                        <label className="ml-1 text-xs font-semibold tracking-[0.14em] text-slate-500 uppercase dark:text-slate-400">
                                            Description
                                        </label>

                                        <textarea
                                            rows={6}
                                            value={data.description}
                                            onChange={(e) =>
                                                setData(
                                                    'description',
                                                    e.target.value,
                                                )
                                            }
                                            placeholder="What will students learn from this course?"
                                            className="dark:placeholder:text-slate-650 w-full resize-none rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 transition-colors outline-none placeholder:text-slate-400 focus:border-[#3B28F6] focus:bg-white dark:border-white/10 dark:bg-white/[0.03] dark:text-white dark:focus:bg-white/[0.05]"
                                        />

                                        {errors.description && (
                                            <div className="dark:text-rose-400 ml-1 flex items-center gap-1.5 text-xs text-rose-500">
                                                <AlertCircle size={13} />
                                                <span>
                                                    {errors.description}
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <div className="flex justify-end gap-3 border-t border-slate-200 pt-5 dark:border-white/10">
                                    <button
                                        type="button"
                                        onClick={closeModal}
                                        className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50 dark:border-white/10 dark:bg-white/[0.03] dark:text-slate-300 dark:hover:bg-white/[0.07]"
                                    >
                                        Cancel
                                    </button>

                                    <button
                                        type="submit"
                                        disabled={processing}
                                        className="inline-flex items-center justify-center gap-2 rounded-xl border-transparent bg-slate-800 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-[#3B28F6] dark:hover:bg-[#2A1CE0]"
                                    >
                                        {processing ? (
                                            <>
                                                <span className="size-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                                                Saving...
                                            </>
                                        ) : openModal === 'edit' ? (
                                            'Save Changes'
                                        ) : (
                                            'Create Course'
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
    );
}
