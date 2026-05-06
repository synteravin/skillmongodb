import { usePage, Link, router, useForm } from "@inertiajs/react";
import AppLayout from "@/layouts/app-layout";
import { Plus, Edit2, Trash2, X, Award, Save, UploadCloud } from "lucide-react";
import { useState, useEffect, useRef } from "react";

export default function Index() {
    const { badges } = usePage().props as any;

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [preview, setPreview] = useState<string | null>(null);
    const fileRef = useRef<HTMLInputElement>(null);

    const { data, setData, post, processing, errors, reset } = useForm({
        name: "",
        order: "",
        icon: null as File | null,
    });

    const handleDelete = (id: string) => {
        if (confirm("Are you sure you want to delete this badge?")) {
            router.delete(`/admin/assets/badges/${id}`);
        }
    };

    const handleFile = (file: File | null) => {
        if (!file || !file.type.startsWith('image/')) return;
        setData("icon", file);
        setPreview(URL.createObjectURL(file));
    };

    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        if (e.dataTransfer.files[0]) {
            handleFile(e.dataTransfer.files[0]);
        }
    };

    useEffect(() => {
        return () => {
            if (preview) {
                URL.revokeObjectURL(preview);
            }
        };
    }, [preview]);

    const closeModal = () => {
        setIsModalOpen(false);
        reset();
        if (preview) {
            URL.revokeObjectURL(preview);
            setPreview(null);
        }
    };

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post("/admin/assets/badges", {
            forceFormData: true,
            onSuccess: () => {
                closeModal();
            },
        });
    };

    return (
        <AppLayout>
            <div className="min-h-screen bg-slate-50 px-4 py-8 sm:px-6 lg:px-10 dark:bg-[#0B1120]">
                <div className="mx-auto max-w-5xl space-y-8">

                    {/* HEADER */}
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                            <h1 className="flex items-center gap-2 text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
                                <Award className="h-8 w-8 text-indigo-500" />
                                Badge Management
                            </h1>
                            <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                                Manage achievement badges and their visual assets.
                            </p>
                        </div>

                        <button 
                            onClick={() => setIsModalOpen(true)}
                            className="inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-indigo-500 focus:ring-2 focus:ring-indigo-500/50"
                        >
                            <Plus size={18} />
                            Add Badge
                        </button>
                    </div>

                    {/* TABLE CARD */}
                    <div className="rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
                        <div className="border-b border-slate-200 px-6 py-4 dark:border-slate-800">
                            <h3 className="text-sm font-semibold text-slate-900 dark:text-white">Active Badges</h3>
                        </div>

                        {/* TABLE HEAD */}
                        <div className="hidden grid-cols-[80px_1fr_120px_120px] items-center border-b border-slate-200 bg-slate-50 px-6 py-3 text-[11px] font-semibold uppercase tracking-wider text-slate-500 md:grid dark:border-slate-800 dark:bg-slate-800/50 dark:text-slate-400">
                            <span>Icon</span>
                            <span>Badge Details</span>
                            <span>Order</span>
                            <span className="text-right">Actions</span>
                        </div>

                        {/* TABLE BODY */}
                        <div className="flex flex-col divide-y divide-slate-100 dark:divide-slate-800">
                            {(!badges || badges.length === 0) ? (
                                <div className="p-12 text-center">
                                    <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800">
                                        <Award className="h-6 w-6 text-slate-400" />
                                    </div>
                                    <h3 className="text-sm font-medium text-slate-900 dark:text-white">No badges available</h3>
                                    <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Get started by creating a new badge.</p>
                                </div>
                            ) : (
                                badges.map((badge: any, i: number) => {
                                    const id = badge._id ?? badge.id;

                                    return (
                                        <div 
                                            key={id ?? i} 
                                            className="grid grid-cols-1 items-center gap-4 p-6 transition-colors hover:bg-slate-50 md:grid-cols-[80px_1fr_120px_120px] md:gap-0 md:py-4 dark:hover:bg-slate-800/50"
                                        >
                                            <div className="flex items-center justify-center md:justify-start">
                                                <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-slate-100 p-2 shadow-inner dark:bg-slate-950">
                                                    <img 
                                                        src={badge.icon_url} 
                                                        alt={badge.name}
                                                        onError={(e) => {
                                                            (e.currentTarget as HTMLImageElement).src = '/images/default-rank.png';
                                                        }}
                                                        className="h-full w-full object-contain drop-shadow-md"
                                                    />
                                                </div>
                                            </div>

                                            <div className="flex flex-col text-center md:text-left">
                                                <strong className="text-sm font-bold text-slate-900 dark:text-white">{badge.name}</strong>
                                                <p className="mt-0.5 text-[11px] text-slate-500 dark:text-slate-400">System Asset</p>
                                            </div>

                                            <div className="flex justify-center md:justify-start">
                                                <span className="inline-flex items-center justify-center rounded-lg bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                                                    #{badge.order}
                                                </span>
                                            </div>

                                            <div className="flex items-center justify-center gap-2 md:justify-end">
                                                <Link
                                                    href={`/admin/assets/badges/${id}/edit`}
                                                    className="inline-flex items-center justify-center rounded-lg bg-slate-100 p-2 text-slate-600 transition-colors hover:bg-slate-200 hover:text-slate-900 dark:bg-slate-800 dark:text-slate-400 dark:hover:bg-slate-700 dark:hover:text-white"
                                                    title="Edit Badge"
                                                >
                                                    <Edit2 size={16} />
                                                </Link>

                                                <button
                                                    onClick={() => handleDelete(id)}
                                                    className="inline-flex items-center justify-center rounded-lg bg-red-50 p-2 text-red-600 transition-colors hover:bg-red-100 hover:text-red-700 dark:bg-red-500/10 dark:text-red-400 dark:hover:bg-red-500/20 dark:hover:text-red-300"
                                                    title="Delete Badge"
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                        </div>
                                    );
                                })
                            )}
                        </div>
                    </div>

                </div>

                {/* MODAL CREATE */}
                {isModalOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-0">
                        <div 
                            className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm"
                            onClick={closeModal}
                        ></div>
                        
                        <form 
                            onSubmit={submit} 
                            className="relative w-full max-w-lg overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl dark:border-slate-800 dark:bg-slate-900"
                        >
                            {/* MODAL HEADER */}
                            <div className="flex items-center justify-between border-b border-slate-200 bg-slate-50 p-5 dark:border-slate-800 dark:bg-slate-900/50">
                                <div>
                                    <h2 className="text-lg font-bold text-slate-900 dark:text-white">Add New Badge</h2>
                                    <p className="text-sm text-slate-500 dark:text-slate-400">Upload system badge assets</p>
                                </div>
                                <button 
                                    type="button"
                                    onClick={closeModal}
                                    className="rounded-lg bg-slate-100 p-2 text-slate-500 transition-colors hover:bg-slate-200 hover:text-slate-900 dark:bg-slate-800 dark:text-slate-400 dark:hover:bg-slate-700 dark:hover:text-white"
                                >
                                    <X size={18} />
                                </button>
                            </div>

                            {/* MODAL BODY */}
                            <div className="p-6">
                                <div className="space-y-6">
                                    
                                    {/* PREVIEW & UPLOAD */}
                                    <div>
                                        <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
                                            Badge Icon
                                        </label>
                                        <div
                                            onDragOver={(e) => e.preventDefault()}
                                            onDrop={handleDrop}
                                            onClick={() => fileRef.current?.click()}
                                            className="group relative flex cursor-pointer flex-col items-center justify-center overflow-hidden rounded-2xl border-2 border-dashed border-slate-300 p-6 text-center transition-all hover:border-indigo-400 hover:bg-slate-50 dark:border-slate-700 dark:hover:border-indigo-500 dark:hover:bg-slate-800/50"
                                        >
                                            <input
                                                ref={fileRef}
                                                type="file"
                                                accept="image/*"
                                                className="hidden"
                                                onChange={(e) => {
                                                    handleFile(e.target.files?.[0] || null);
                                                    e.target.value = '';
                                                }}
                                            />

                                            {preview ? (
                                                <div className="flex h-24 w-24 items-center justify-center rounded-xl bg-slate-100 p-2 shadow-inner dark:bg-slate-950">
                                                    <img src={preview} alt="Preview" className="h-full w-full object-contain drop-shadow-md" />
                                                </div>
                                            ) : (
                                                <div className="flex flex-col items-center gap-2 text-slate-500 dark:text-slate-400">
                                                    <UploadCloud size={24} />
                                                    <span className="text-xs font-medium">Click to upload or drag image</span>
                                                </div>
                                            )}
                                        </div>
                                        {errors.icon && (
                                            <span className="mt-1.5 block text-xs font-medium text-red-500">{errors.icon}</span>
                                        )}
                                    </div>

                                    {/* FORM FIELDS */}
                                    <div className="grid gap-4 sm:grid-cols-2">
                                        <div>
                                            <label className="mb-1.5 block text-xs font-medium text-slate-700 dark:text-slate-300">Badge Name</label>
                                            <input
                                                type="text"
                                                placeholder="e.g. Elite Warrior"
                                                value={data.name}
                                                onChange={(e) => setData("name", e.target.value)}
                                                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-900 outline-none transition focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 dark:border-slate-700 dark:bg-slate-900/50 dark:text-white"
                                            />
                                            {errors.name && (
                                                <span className="mt-1.5 block text-xs font-medium text-red-500">{errors.name}</span>
                                            )}
                                        </div>

                                        <div>
                                            <label className="mb-1.5 block text-xs font-medium text-slate-700 dark:text-slate-300">Order Number</label>
                                            <input
                                                type="number"
                                                placeholder="0"
                                                value={data.order}
                                                onChange={(e) => setData("order", e.target.value)}
                                                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-900 outline-none transition focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 dark:border-slate-700 dark:bg-slate-900/50 dark:text-white"
                                            />
                                            {errors.order && (
                                                <span className="mt-1.5 block text-xs font-medium text-red-500">{errors.order}</span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* MODAL FOOTER */}
                            <div className="flex items-center justify-end gap-3 border-t border-slate-200 bg-slate-50 p-5 dark:border-slate-800 dark:bg-slate-900/50">
                                <button 
                                    type="button"
                                    onClick={closeModal}
                                    disabled={processing}
                                    className="inline-flex items-center justify-center rounded-xl bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm ring-1 ring-inset ring-slate-300 transition-all hover:bg-slate-50 disabled:opacity-50 dark:bg-slate-800 dark:text-slate-300 dark:ring-slate-700 dark:hover:bg-slate-700"
                                >
                                    Cancel
                                </button>
                                <button 
                                    type="submit"
                                    disabled={processing} 
                                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 py-2 text-sm font-semibold text-white shadow-sm transition-all hover:bg-indigo-500 focus:ring-2 focus:ring-indigo-500/50 disabled:opacity-50"
                                >
                                    <Save size={16} />
                                    {processing ? "Saving..." : "Save Badge"}
                                </button>
                            </div>
                        </form>
                    </div>
                )}
            </div>
        </AppLayout>
    );
}