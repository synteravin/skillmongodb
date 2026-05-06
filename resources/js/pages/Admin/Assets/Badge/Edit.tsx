import { useForm, Link } from '@inertiajs/react';
import { useState, useEffect, useRef } from 'react';
import AppLayout from '@/layouts/app-layout';
import { ChevronLeft, Save, UploadCloud } from 'lucide-react';

type Badge = {
    _id?: string;
    id?: string;
    name: string;
    order: number;
    icon: string;
    icon_url: string;
};

export default function Edit({ badge }: { badge: Badge }) {
    const fileRef = useRef<HTMLInputElement>(null);
    const id = badge._id ?? badge.id;

    const { data, setData, post, processing, errors } = useForm({
        _method: 'put',
        name: badge.name || '',
        order: badge.order?.toString() || '',
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
        post(`/admin/assets/badges/${id}`, {
            forceFormData: true,
        });
    };

    return (
        <AppLayout>
            <div className="min-h-screen bg-slate-50 py-8 dark:bg-[#0B1120]">
                <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
                    {/* Header */}
                    <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                            <Link 
                                href="/admin/assets/badges" 
                                className="mb-2 inline-flex items-center gap-2 text-sm font-medium text-slate-500 transition-colors hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-300"
                            >
                                <ChevronLeft size={16} />
                                Back to Badges
                            </Link>
                            <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
                                Edit Badge
                            </h1>
                            <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                                Update badge details and visual identity.
                            </p>
                        </div>
                        
                        <div className="rounded-lg bg-indigo-500/10 px-3 py-1.5 text-xs font-medium text-indigo-600 dark:text-indigo-400">
                            Badge ID: <span className="font-mono">{id}</span>
                        </div>
                    </div>

                    {/* Form */}
                    <form onSubmit={submit} className="space-y-6">
                        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8 dark:border-slate-800 dark:bg-slate-900">
                            <div className="space-y-6">
                                {/* Image Upload */}
                                <div>
                                    <label className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">
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
                                        className={`group relative flex cursor-pointer flex-col items-center justify-center overflow-hidden rounded-2xl border-2 border-dashed p-8 text-center transition-all ${
                                            dragActive
                                                ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-500/10'
                                                : 'border-slate-300 hover:border-indigo-400 hover:bg-slate-50 dark:border-slate-700 dark:hover:border-indigo-500 dark:hover:bg-slate-800/50'
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
                                            <div className="flex h-32 w-32 items-center justify-center rounded-xl bg-slate-100 p-2 shadow-inner dark:bg-slate-950">
                                                <img
                                                    src={preview ?? badge.icon_url}
                                                    onError={(e) => {
                                                        (e.currentTarget as HTMLImageElement).src = '/images/default-rank.png';
                                                    }}
                                                    alt="Preview"
                                                    className="h-full w-full object-contain drop-shadow-md"
                                                />
                                            </div>
                                            <div className="absolute inset-0 z-20 flex items-center justify-center opacity-0 transition-opacity group-hover:opacity-100">
                                                <span className="rounded-lg bg-white/90 px-3 py-1.5 text-xs font-semibold text-slate-900 shadow-sm backdrop-blur-sm">
                                                    Change Image
                                                </span>
                                            </div>
                                        </div>
                                        
                                        <div className="mt-4">
                                            <p className="text-sm font-medium text-slate-900 dark:text-white">
                                                Click to replace or drag and drop
                                            </p>
                                            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                                                Leave empty to keep current image
                                            </p>
                                        </div>
                                    </div>
                                    {errors.icon && (
                                        <p className="mt-1.5 text-sm font-medium text-red-500">{errors.icon}</p>
                                    )}
                                </div>

                                {/* Form Fields */}
                                <div className="grid gap-6 sm:grid-cols-2">
                                    {/* Name Input */}
                                    <div>
                                        <label className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">
                                            Badge Name
                                        </label>
                                        <input
                                            type="text"
                                            value={data.name}
                                            onChange={(e) => setData('name', e.target.value)}
                                            placeholder="e.g. Elite Warrior"
                                            className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-900 outline-none transition focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 dark:border-slate-700 dark:bg-slate-900/50 dark:text-white"
                                        />
                                        {errors.name && (
                                            <p className="mt-1.5 text-sm font-medium text-red-500">{errors.name}</p>
                                        )}
                                    </div>

                                    {/* Order Input */}
                                    <div>
                                        <label className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">
                                            Order Number
                                        </label>
                                        <input
                                            type="number"
                                            value={data.order}
                                            onChange={(e) => setData('order', e.target.value)}
                                            placeholder="0"
                                            className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-900 outline-none transition focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 dark:border-slate-700 dark:bg-slate-900/50 dark:text-white"
                                        />
                                        {errors.order && (
                                            <p className="mt-1.5 text-sm font-medium text-red-500">{errors.order}</p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center justify-end gap-3">
                            <Link
                                href="/admin/assets/badges"
                                className="inline-flex items-center justify-center rounded-xl bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 shadow-sm ring-1 ring-inset ring-slate-300 transition-all hover:bg-slate-50 dark:bg-slate-900 dark:text-slate-300 dark:ring-slate-700 dark:hover:bg-slate-800"
                            >
                                Cancel
                            </Link>
                            <button
                                type="submit"
                                disabled={processing}
                                className="inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-indigo-500 focus:ring-2 focus:ring-indigo-500/50 disabled:opacity-50"
                            >
                                <Save size={18} />
                                {processing ? 'Updating...' : 'Update Badge'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </AppLayout>
    );
}