import { useForm, Link } from '@inertiajs/react';
import { useState, useEffect, useRef } from 'react';
import AppLayout from '@/layouts/app-layout';
import { ArrowLeft } from 'lucide-react';

type Rank = {
    id: string;
    name: string;
    image: string;
    image_url: string;
};

export default function Edit({ rank }: { rank: Rank }) {
    const fileRef = useRef<HTMLInputElement>(null);
    const { data, setData, post, processing, errors } = useForm({
        _method: 'put',
        name: rank.name ?? '',
        image: null as File | null,
    });

    const [preview, setPreview] = useState<string | null>(null);
    const [dragActive, setDragActive] = useState(false);

    const handleImage = (file: File | null) => {
        if (!file || !file.type.startsWith('image/')) return;
        setData('image', file);
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
        post(`/admin/assets/ranks/${rank.id}`, { forceFormData: true });
    };

    return (
<AppLayout>
    <div
        className="min-h-screen bg-[#f8fafc] dark:bg-[#030712] py-8 px-4 sm:px-6 lg:px-8 transition-colors duration-200"
        style={{ fontFamily: "'Outfit', sans-serif" }}
    >
        <div className="w-full space-y-6">

            {/* Header */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
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
                        Edit Rank
                    </h1>
                    <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                        Update rank details and insignia.
                    </p>
                </div>

                {/* Rank ID badge */}
                <div className="inline-flex items-center self-start rounded-lg border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-medium text-slate-500 dark:border-slate-700 dark:bg-white/5 dark:text-slate-400">
                    ID: <span className="ml-1.5 font-mono text-slate-700 dark:text-slate-300">{rank.id}</span>
                </div>
            </div>

            {/* Form Card */}
            <form onSubmit={submit} className="space-y-5">
                <div className="relative overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-gradient-to-b dark:from-[#0e0e1a] dark:to-[#090910]">
                    {/* top accent line */}
                    <div className="absolute top-0 right-8 left-8 h-px bg-gradient-to-r from-transparent via-slate-300 to-transparent dark:via-slate-700" />

                    <div className="border-b border-slate-200 px-6 py-4 dark:border-white/5">
                        <h2 className="text-sm font-bold uppercase tracking-[0.2em] text-slate-800 dark:text-white">
                            Rank Details
                        </h2>
                    </div>

                    <div className="space-y-6 p-4 sm:p-6">
                        {/* Rank Name */}
                        <div>
                            <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                                Rank Name
                            </label>
                            <input
                                type="text"
                                value={data.name}
                                onChange={(e) => setData('name', e.target.value)}
                                placeholder="e.g. Bronze, Silver, Gold"
                                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-900 outline-none transition focus:border-slate-400 focus:ring-1 focus:ring-slate-400 dark:border-slate-700 dark:bg-white/5 dark:text-white dark:focus:border-slate-500 dark:focus:ring-slate-500 dark:placeholder-slate-600"
                            />
                            {errors.name && (
                                <p className="mt-1.5 text-xs font-medium text-red-500">{errors.name}</p>
                            )}
                        </div>

                        {/* Image Upload */}
                        <div>
                            <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                                Rank Icon
                            </label>
                            <div
                                onDragOver={(e) => { e.preventDefault(); setDragActive(true); }}
                                onDragLeave={() => setDragActive(false)}
                                onDrop={handleDrop}
                                onClick={() => fileRef.current?.click()}
                                className={`group relative flex cursor-pointer flex-col items-center justify-center overflow-hidden rounded-xl border-2 border-dashed p-6 sm:p-8 text-center transition-all ${
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
                                    onChange={(e) => handleImage(e.target.files?.[0] || null)}
                                />

                                <div className="relative">
                                    <div className="absolute inset-0 z-10 rounded-xl bg-black/40 opacity-0 transition-opacity group-hover:opacity-100" />
                                    <div className="flex h-20 w-20 sm:h-28 sm:w-28 items-center justify-center rounded-xl border border-slate-200 bg-slate-50 p-2 dark:border-slate-700 dark:bg-white/5">
                                        <img
                                            src={preview ?? rank.image_url}
                                            onError={(e) => {
                                                (e.currentTarget as HTMLImageElement).src = '/images/default-rank.png';
                                            }}
                                            alt="Preview"
                                            className="h-full w-full object-contain"
                                        />
                                    </div>
                                    <div className="absolute inset-0 z-20 flex items-center justify-center opacity-0 transition-opacity group-hover:opacity-100">
                                        <span className="rounded-lg bg-white/90 px-3 py-1.5 text-xs font-semibold text-slate-900 shadow-sm backdrop-blur-sm dark:bg-black/70 dark:text-white">
                                            Change Image
                                        </span>
                                    </div>
                                </div>

                                <div className="mt-4">
                                    <p className="text-sm font-medium text-slate-700 dark:text-slate-300">
                                        Click to replace or drag and drop
                                    </p>
                                    <p className="mt-1 text-xs text-slate-400 dark:text-slate-500">
                                        Leave empty to keep current image
                                    </p>
                                </div>
                            </div>
                            {errors.image && (
                                <p className="mt-1.5 text-xs font-medium text-red-500">{errors.image}</p>
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
                        {processing ? 'Updating...' : 'Update Rank'}
                    </button>
                </div>
            </form>

        </div>
    </div>
</AppLayout>
    );
}