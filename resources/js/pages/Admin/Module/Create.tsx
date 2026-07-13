import { useState } from 'react';
import { router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import {
    Layers,
    Upload,
    X,
    FileText,
    Image as ImageIcon,
    Video,
    ArrowLeft,
} from 'lucide-react';

type Props = {
    pathId: string;
};

export default function CreateModule({ pathId }: Props) {
    const [title, setTitle] = useState('');
    const [files, setFiles] = useState<File[]>([]);
    const [loading, setLoading] = useState(false);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files) return;
        setFiles((prev) => [...prev, ...Array.from(e.target.files!)]);
    };

    const removeFile = (index: number) => {
        setFiles((prev) => prev.filter((_, i) => i !== index));
    };

    const detectType = (file: File) => {
        if (file.type.startsWith('image')) return 'image';
        if (file.type.startsWith('video')) return 'video';
        return 'file';
    };

    const getFileIcon = (file: File) => {
        const type = detectType(file);
        if (type === 'image')
            return <ImageIcon size={20} className="text-emerald-400" />;
        if (type === 'video')
            return <Video size={20} className="text-purple-400" />;
        return <FileText size={20} className="text-amber-400" />;
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!title.trim()) {
            alert('Title wajib diisi');
            return;
        }

        const formData = new FormData();

        formData.append('title', title);
        formData.append('path_id', pathId);

        files.forEach((file, index) => {
            formData.append(`contents[${index}][file]`, file);
            formData.append(`contents[${index}][type]`, detectType(file));
        });

        setLoading(true);

        router.post('/admin/modules', formData, {
            forceFormData: true,
            onFinish: () => setLoading(false),
            onError: (err) => {
                console.log(err);
                alert('Terjadi error');
            },
        });
    };

    return (
        <AppLayout>
            <div
                className="relative min-h-screen overflow-hidden bg-[#f8fafc] px-4 py-8 text-slate-800 transition-colors duration-200 sm:px-6 lg:px-10 dark:bg-[#030712] dark:text-white"
                style={{ fontFamily: "'Outfit', sans-serif" }}
            >
                {/* Subtle top-center ambient glow (visible on dark mode) */}
                <div className="pointer-events-none absolute top-0 left-1/2 z-0 h-[450px] w-full max-w-7xl -translate-x-1/2 rounded-full bg-indigo-500/5 blur-[120px] select-none dark:bg-indigo-500/5" />

                <div className="relative z-10 mx-auto flex w-full flex-col gap-6">
                    {/* HEADER */}
                    <header
                        className="relative overflow-hidden rounded-xl border border-slate-200 bg-[#f5f6ff] px-6 py-5 dark:border-white/5 dark:bg-[#0d0f17]"
                        style={{
                            backgroundImage: `
                                linear-gradient(rgba(59,40,246,0.07) 1px, transparent 1px),
                                linear-gradient(90deg, rgba(59,40,246,0.07) 1px, transparent 1px)
                            `,
                            backgroundSize: '40px 40px',
                        }}
                    >
                        {/* Corner brackets */}
                        <span className="absolute top-3.5 left-3.5 h-3 w-3 border-t border-l border-[rgba(59,40,246,0.2)] dark:border-[rgba(59,40,246,0.45)]" />
                        <span className="absolute top-3.5 right-3.5 h-3 w-3 border-t border-r border-[rgba(59,40,246,0.2)] dark:border-[rgba(59,40,246,0.45)]" />
                        <span className="absolute bottom-3.5 left-3.5 h-3 w-3 border-b border-l border-[rgba(59,40,246,0.2)] dark:border-[rgba(59,40,246,0.45)]" />
                        <span className="absolute right-3.5 bottom-3.5 h-3 w-3 border-r border-b border-[rgba(59,40,246,0.2)] dark:border-[rgba(59,40,246,0.45)]" />

                        <div className="relative z-10 flex flex-col gap-2">
                            <button
                                onClick={() => window.history.back()}
                                className="mb-2 flex items-center gap-1.5 text-xs font-semibold tracking-wider text-slate-500 uppercase transition-colors hover:text-[#3B28F6] dark:text-slate-400 dark:hover:text-[#7C5CFF]"
                            >
                                <ArrowLeft size={14} /> Back
                            </button>

                            {/* Badge */}
                            <div className="inline-flex w-fit items-center gap-1.5 rounded border border-[rgba(59,40,246,0.2)] bg-[rgba(59,40,246,0.06)] px-2.5 py-1 dark:border-[rgba(59,40,246,0.35)] dark:bg-[rgba(59,40,246,0.1)]">
                                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[#3B28F6]" />
                                <span className="text-[10px] font-bold tracking-[0.12em] text-[#3B28F6] uppercase">
                                    Modules
                                </span>
                            </div>

                            <h1
                                className="m-0 text-2xl leading-none font-bold tracking-tight text-[#3B28F6] sm:text-3xl dark:text-[#7C5CFF]"
                                style={{
                                    fontFamily: 'Orbitron, sans-serif',
                                }}
                            >
                                Create New Module
                            </h1>
                            <p className="m-0 text-xs text-slate-600/75 sm:text-sm dark:text-slate-400/70">
                                Add a new learning module with images, videos,
                                or files.
                            </p>
                        </div>
                    </header>

                    {/* FORM */}
                    <form
                        onSubmit={handleSubmit}
                        className="relative z-10 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm dark:border-white/8 dark:bg-[#060B1A]/80"
                    >
                        {/* Top accent line */}
                        <div className="absolute top-0 right-8 left-8 h-px bg-gradient-to-r from-transparent via-slate-200 to-transparent dark:via-slate-800" />

                        <div className="space-y-6 p-6 sm:p-8">
                            {/* TITLE */}
                            <div className="space-y-2">
                                <label className="ml-1 block text-xs font-bold tracking-[0.15em] text-slate-400 uppercase dark:text-slate-500">
                                    Module Title{' '}
                                    <span className="text-rose-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    placeholder="e.g. Introduction to React Fundamentals"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3.5 text-slate-900 transition-all outline-none placeholder:text-slate-400 focus:border-[#3B28F6] focus:ring-1 focus:ring-[#3B28F6] dark:border-slate-800 dark:bg-slate-950 dark:text-white dark:placeholder:text-slate-600 dark:focus:border-[#7C5CFF] dark:focus:ring-[#7C5CFF]"
                                    required
                                />
                            </div>

                            {/* FILE INPUT */}
                            <div className="space-y-2">
                                <label className="ml-1 block text-xs font-bold tracking-[0.15em] text-slate-400 uppercase dark:text-slate-500">
                                    Upload Content Files (Optional)
                                </label>

                                <div className="group relative">
                                    <input
                                        type="file"
                                        multiple
                                        onChange={handleFileChange}
                                        className="absolute inset-0 z-10 h-full w-full cursor-pointer opacity-0"
                                    />
                                    <div className="flex w-full flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed border-slate-200 bg-slate-50/50 p-8 text-center transition-all duration-200 group-hover:border-[#3B28F6]/50 group-hover:bg-[#3B28F6]/5 dark:border-slate-800 dark:bg-slate-950/30 dark:group-hover:bg-[#7C5CFF]/5 dark:hover:border-[#7C5CFF]/50">
                                        <div className="rounded-xl border border-slate-200 bg-slate-100 p-3 transition-transform duration-300 group-hover:scale-110 dark:border-slate-800 dark:bg-slate-900">
                                            <Upload
                                                className="text-slate-500 group-hover:text-[#3B28F6] dark:text-slate-400 dark:hover:text-[#7C5CFF]"
                                                size={24}
                                            />
                                        </div>
                                        <div>
                                            <p className="dark:text-slate-350 text-sm font-semibold text-slate-700 group-hover:text-[#3B28F6] dark:group-hover:text-[#7C5CFF]">
                                                Click to upload or drag and drop
                                            </p>
                                            <p className="dark:text-slate-550 mt-1 text-xs text-slate-500">
                                                Images, Videos, PDFs, or other
                                                documents
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* PREVIEW FILE */}
                            {files.length > 0 && (
                                <div className="border-slate-150 space-y-3 border-t pt-6 dark:border-slate-800/80">
                                    <p className="ml-1 flex items-center justify-between text-xs font-bold tracking-[0.15em] text-slate-400 uppercase dark:text-slate-500">
                                        <span>
                                            Selected Files ({files.length})
                                        </span>
                                        <button
                                            type="button"
                                            onClick={() => setFiles([])}
                                            className="hover:text-rose-650 text-xs font-bold tracking-wider text-rose-500 uppercase transition-colors"
                                        >
                                            Clear All
                                        </button>
                                    </p>

                                    <div className="custom-scrollbar grid max-h-[300px] grid-cols-1 gap-3 overflow-y-auto pr-2 sm:grid-cols-2">
                                        {files.map((file, i) => (
                                            <div
                                                key={i}
                                                className="border-slate-150 group relative flex items-center gap-3 rounded-xl border bg-slate-50/50 p-3 dark:border-slate-800 dark:bg-slate-950/50"
                                            >
                                                <div className="shrink-0 rounded-lg border border-slate-200 bg-slate-100 p-2 dark:border-slate-800 dark:bg-slate-900">
                                                    {getFileIcon(file)}
                                                </div>
                                                <div className="flex min-w-0 flex-1 flex-col pr-6">
                                                    <span className="truncate text-sm font-semibold text-slate-800 dark:text-slate-200">
                                                        {file.name}
                                                    </span>
                                                    <span className="mt-0.5 text-xs text-slate-500 dark:text-slate-500">
                                                        {(
                                                            file.size / 1024
                                                        ).toFixed(2)}{' '}
                                                        KB
                                                    </span>
                                                </div>

                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        removeFile(i)
                                                    }
                                                    className="hover:text-rose-550 absolute right-3 rounded-lg p-1.5 text-slate-400 opacity-0 transition-colors group-hover:opacity-100 hover:bg-rose-50 dark:text-slate-500 dark:hover:bg-rose-500/10 dark:hover:text-rose-400"
                                                    title="Remove File"
                                                >
                                                    <X size={14} />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* SUBMIT */}
                        <div className="border-slate-150 dark:border-slate-850 flex justify-end gap-3 border-t bg-slate-50/50 p-6 sm:p-8 dark:bg-slate-950/50">
                            <button
                                type="button"
                                onClick={() => window.history.back()}
                                className="dark:hover:bg-slate-850 rounded-xl border border-slate-200 px-5 py-2.5 text-sm font-semibold text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-800 sm:border-transparent dark:border-slate-700 dark:text-slate-400 dark:hover:text-white"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={loading || !title.trim()}
                                className="flex items-center gap-2 rounded-xl bg-[#3B28F6] px-8 py-2.5 text-sm font-semibold text-white shadow-md shadow-[#3B28F6]/10 transition-all hover:bg-[#2a1ce0] disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                {loading ? (
                                    <>
                                        <svg
                                            className="h-4 w-4 animate-spin text-white"
                                            xmlns="http://www.w3.org/2000/svg"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                        >
                                            <circle
                                                className="opacity-25"
                                                cx="12"
                                                cy="12"
                                                r="10"
                                                stroke="currentColor"
                                                strokeWidth="4"
                                            ></circle>
                                            <path
                                                className="opacity-75"
                                                fill="currentColor"
                                                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                            ></path>
                                        </svg>
                                        Creating...
                                    </>
                                ) : (
                                    'Create Module'
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </AppLayout>
    );
}
