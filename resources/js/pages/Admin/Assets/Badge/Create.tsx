import { useForm, Link } from '@inertiajs/react';
import { useState, useEffect, useRef } from 'react';
import AppLayout from '@/layouts/app-layout';
import { ArrowLeft } from 'lucide-react';

export default function Create() {
    const fileRef = useRef<HTMLInputElement>(null);
    const { data, setData, post, processing, errors } = useForm({
        name: '',
        order: 1,
        icon: null as File | null,
    });

    const [preview, setPreview] = useState<string | null>(null);
    const [dragActive, setDragActive] = useState(false);

    const handleImage = (file: File | null) => {
        if (!file || !file.type.startsWith('image/')) return;
        setData('icon', file);
        setPreview(URL.createObjectURL(file));
    };

    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setDragActive(false);
        if (e.dataTransfer.files[0]) {
            handleImage(e.dataTransfer.files[0]);
        }
    };

    useEffect(() => {
        return () => {
            if (preview) URL.revokeObjectURL(preview);
        };
    }, [preview]);

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/admin/assets/badges', { forceFormData: true });
    };

    return (
        <AppLayout>
            <div
                className="min-h-screen bg-[#f8fafc] px-4 py-8 transition-colors duration-200 sm:px-6 lg:px-8 dark:bg-[#030712]"
                style={{ fontFamily: "'Outfit', sans-serif" }}
            >
                <div className="w-full space-y-6">
                    {/* Header */}
                    <div>
                        <Link
                            href="/admin/assets"
                            className="mb-3 inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-600 transition-colors hover:border-slate-300 hover:bg-slate-50 hover:text-slate-900 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-400 dark:hover:border-slate-700 dark:hover:bg-slate-800 dark:hover:text-slate-100"
                        >
                            <ArrowLeft className="h-4 w-4" />
                            Back to Assets
                        </Link>
                        <h1
                            className="text-2xl font-bold tracking-tight text-slate-800 dark:text-white"
                            style={{ fontFamily: 'Orbitron, sans-serif' }}
                        >
                            Create Badge
                        </h1>
                        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                            Add a new badge for the student progression system.
                        </p>
                    </div>

                    {/* Form Card */}
                    <form onSubmit={submit} className="space-y-5">
                        <div className="relative overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-gradient-to-b dark:from-[#0e0e1a] dark:to-[#090910]">
                            {/* top accent line */}
                            <div className="absolute top-0 right-8 left-8 h-px bg-gradient-to-r from-transparent via-slate-300 to-transparent dark:via-slate-700" />

                            <div className="border-b border-slate-200 px-6 py-4 dark:border-white/5">
                                <h2 className="text-sm font-bold tracking-[0.2em] text-slate-800 uppercase dark:text-white">
                                    Badge Details
                                </h2>
                            </div>

                            <div className="space-y-6 p-4 sm:p-6">
                                {/* Row: Name + Order */}
                                <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
                                    {/* Badge Name */}
                                    <div className="sm:col-span-2">
                                        <label className="mb-1.5 block text-xs font-semibold tracking-wider text-slate-500 uppercase dark:text-slate-400">
                                            Badge Name
                                        </label>
                                        <input
                                            type="text"
                                            value={data.name}
                                            onChange={(e) =>
                                                setData('name', e.target.value)
                                            }
                                            placeholder="e.g. Bronze, Silver, Gold"
                                            className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-900 transition outline-none focus:border-slate-400 focus:ring-1 focus:ring-slate-400 dark:border-slate-700 dark:bg-white/5 dark:text-white dark:placeholder-slate-600 dark:focus:border-slate-500 dark:focus:ring-slate-500"
                                        />
                                        {errors.name && (
                                            <p className="mt-1.5 text-xs font-medium text-red-500">
                                                {errors.name}
                                            </p>
                                        )}
                                    </div>

                                    {/* Order */}
                                    <div>
                                        <label className="mb-1.5 block text-xs font-semibold tracking-wider text-slate-500 uppercase dark:text-slate-400">
                                            Order
                                        </label>
                                        <input
                                            type="number"
                                            min={1}
                                            value={data.order}
                                            onChange={(e) =>
                                                setData(
                                                    'order',
                                                    parseInt(e.target.value) ||
                                                        1,
                                                )
                                            }
                                            className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-900 transition outline-none focus:border-slate-400 focus:ring-1 focus:ring-slate-400 dark:border-slate-700 dark:bg-white/5 dark:text-white dark:focus:border-slate-500 dark:focus:ring-slate-500"
                                        />
                                        {errors.order && (
                                            <p className="mt-1.5 text-xs font-medium text-red-500">
                                                {errors.order}
                                            </p>
                                        )}
                                    </div>
                                </div>

                                {/* Image Upload */}
                                <div>
                                    <label className="mb-1.5 block text-xs font-semibold tracking-wider text-slate-500 uppercase dark:text-slate-400">
                                        Badge Icon
                                    </label>
                                    <div
                                        onDragOver={(e) => {
                                            e.preventDefault();
                                            setDragActive(true);
                                        }}
                                        onDragLeave={() => setDragActive(false)}
                                        onDrop={handleDrop}
                                        onClick={() => fileRef.current?.click()}
                                        className={`group relative flex cursor-pointer flex-col items-center justify-center overflow-hidden rounded-xl border-2 border-dashed p-6 text-center transition-all sm:p-8 ${
                                            dragActive
                                                ? 'border-slate-400 bg-slate-50 dark:border-slate-500 dark:bg-white/5'
                                                : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50 dark:border-slate-700 dark:hover:border-slate-600 dark:hover:bg-white/[0.03]'
                                        }`}
                                    >
                                        <input
                                            ref={fileRef}
                                            type="file"
                                            accept="image/*"
                                            className="hidden"
                                            onChange={(e) =>
                                                handleImage(
                                                    e.target.files?.[0] || null,
                                                )
                                            }
                                        />

                                        {preview ? (
                                            <div className="relative">
                                                <div className="absolute inset-0 z-10 rounded-xl bg-black/40 opacity-0 transition-opacity group-hover:opacity-100" />
                                                <div className="flex h-20 w-20 items-center justify-center rounded-xl border border-slate-200 bg-slate-50 p-2 sm:h-28 sm:w-28 dark:border-slate-700 dark:bg-white/5">
                                                    <img
                                                        src={preview}
                                                        alt="Preview"
                                                        className="h-full w-full object-contain"
                                                    />
                                                </div>
                                                <div className="absolute inset-0 z-20 flex items-center justify-center opacity-0 transition-opacity group-hover:opacity-100">
                                                    <span className="rounded-lg bg-white/90 px-3 py-1.5 text-xs font-semibold text-slate-900 shadow-sm backdrop-blur-sm dark:bg-black/70 dark:text-white">
                                                        Change
                                                    </span>
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="flex flex-col items-center gap-2">
                                                <div className="rounded-full border border-slate-200 bg-slate-100 p-3 text-slate-400 dark:border-slate-700 dark:bg-white/5 dark:text-slate-500">
                                                    <svg
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        width="22"
                                                        height="22"
                                                        fill="none"
                                                        viewBox="0 0 24 24"
                                                        stroke="currentColor"
                                                        strokeWidth={1.5}
                                                    >
                                                        <path
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                            d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5m-13.5-9L12 3m0 0 4.5 4.5M12 3v13.5"
                                                        />
                                                    </svg>
                                                </div>
                                                <p className="text-sm font-medium text-slate-700 dark:text-slate-300">
                                                    Click to upload or drag and
                                                    drop
                                                </p>
                                                <p className="text-xs text-slate-400 dark:text-slate-500">
                                                    PNG, JPG, WEBP up to 2MB
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                    {errors.icon && (
                                        <p className="mt-1.5 text-xs font-medium text-red-500">
                                            {errors.icon}
                                        </p>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-end">
                            <Link
                                href="/admin/assets"
                                className="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition-all hover:bg-slate-50 dark:border-slate-700 dark:bg-white/5 dark:text-slate-300 dark:hover:bg-white/10"
                            >
                                Cancel
                            </Link>
                            <button
                                type="submit"
                                disabled={processing}
                                className="inline-flex items-center justify-center gap-2 rounded-xl bg-slate-800 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-slate-700 disabled:opacity-50 dark:bg-white/10 dark:hover:bg-white/20"
                            >
                                {processing ? 'Saving...' : 'Save Badge'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </AppLayout>
    );
}
