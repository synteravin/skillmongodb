import { useState } from 'react';
import { Link, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Loader2 } from 'lucide-react';

type Badge = {
    id: string;
    _id?: string;
    name: string;
    icon: string;
    icon_url: string;
    order: number;
};

export default function Index({ badges }: { badges: Badge[] }) {
    const [items, setItems] = useState(badges || []);
    const [isSaving, setIsSaving] = useState(false);

    const handleDrag = (dragIndex: number, hoverIndex: number) => {
        const updated = [...items];
        const draggedItem = updated[dragIndex];
        updated.splice(dragIndex, 1);
        updated.splice(hoverIndex, 0, draggedItem);
        setItems(updated);
    };

    const saveOrder = () => {
        setIsSaving(true);
        const payload = items.map((item, index) => ({
            id: item.id || item._id,
            order: index + 1,
        }));
        router.post('/admin/assets/badges/reorder', { badges: payload }, {
            onFinish: () => setIsSaving(false),
        });
    };

    const remove = (id: string) => {
        if (!confirm('Delete this badge?')) return;
        router.delete(`/admin/assets/badges/${id}`);
    };

    return (
        <AppLayout>
            <div
                className="min-h-screen bg-[#f8fafc] dark:bg-[#030712] px-4 py-8 sm:px-6 lg:px-10 transition-colors duration-200"
                style={{ fontFamily: "'Outfit', sans-serif" }}
            >
                <div className="w-full space-y-6">

                    {/* Header */}
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                            <h1
                                className="text-2xl font-bold tracking-tight text-slate-800 dark:text-white"
                                style={{ fontFamily: 'Orbitron, sans-serif' }}
                            >
                                Badge Management
                            </h1>
                            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                                Drag and drop to reorder badges, or set order manually when creating/editing.
                            </p>
                        </div>
                        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                            <button
                                type="button"
                                onClick={saveOrder}
                                disabled={isSaving}
                                className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition-all hover:bg-slate-50 disabled:opacity-50 dark:border-slate-700 dark:bg-white/5 dark:text-slate-200 dark:hover:bg-white/10"
                            >
                                {isSaving && <Loader2 size={16} className="animate-spin" />}
                                {isSaving ? 'Saving...' : 'Save Order'}
                            </button>
                            <Link
                                href="/admin/assets/badges/create"
                                className="inline-flex items-center justify-center gap-2 rounded-xl bg-slate-800 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-slate-700 dark:bg-white/10 dark:hover:bg-white/20"
                            >
                                + Add Badge
                            </Link>
                        </div>
                    </div>

                    {/* List Card */}
                    <div className="relative overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-gradient-to-b dark:from-[#0e0e1a] dark:to-[#090910]">
                        {/* top accent line */}
                        <div className="absolute top-0 right-8 left-8 h-px bg-gradient-to-r from-transparent via-slate-300 to-transparent dark:via-slate-700" />

                        {/* Card header */}
                        <div className="border-b border-slate-200 px-6 py-4 dark:border-white/5">
                            <h2 className="text-sm font-bold uppercase tracking-[0.2em] text-slate-800 dark:text-white">
                                Active Badges
                            </h2>
                        </div>

                        {items.length === 0 ? (
                            <div className="p-12 text-center">
                                <p className="text-sm font-medium text-slate-800 dark:text-white">No badges created yet</p>
                                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Get started by creating a new badge.</p>
                            </div>
                        ) : (
                            <div className="divide-y divide-slate-100 dark:divide-white/5">
                                {items.map((badge, index) => {
                                    const badgeId = badge.id || badge._id || '';
                                    return (
                                        <div
                                            key={badgeId || index}
                                            draggable
                                            onDragStart={(e) => {
                                                e.dataTransfer.setData('index', index.toString());
                                                e.currentTarget.classList.add('opacity-50');
                                            }}
                                            onDragEnd={(e) => {
                                                e.currentTarget.classList.remove('opacity-50');
                                            }}
                                            onDragOver={(e) => e.preventDefault()}
                                            onDrop={(e) => {
                                                const dragIndex = Number(e.dataTransfer.getData('index'));
                                                handleDrag(dragIndex, index);
                                            }}
                                            className="flex cursor-grab items-center justify-between px-6 py-4 transition-colors hover:bg-slate-50 active:cursor-grabbing dark:hover:bg-white/[0.02]"
                                        >
                                            {/* Left */}
                                            <div className="flex items-center gap-5">
                                                <div className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-xl border border-slate-200 bg-slate-50 p-2 dark:border-slate-800 dark:bg-white/[0.03]">
                                                    <img
                                                        src={badge.icon_url}
                                                        onError={(e) => {
                                                            (e.currentTarget as HTMLImageElement).src = '/images/default-rank.png';
                                                        }}
                                                        alt={badge.name}
                                                        className="h-full w-full object-contain"
                                                    />
                                                </div>
                                                <div>
                                                    <div className="flex items-center gap-2">
                                                        {/* Order badge from DB */}
                                                        <span className="flex h-5 min-w-5 items-center justify-center rounded bg-slate-100 px-1.5 text-[10px] font-bold text-slate-500 dark:bg-white/5 dark:text-slate-400">
                                                            #{badge.order}
                                                        </span>
                                                        <p className="text-sm font-semibold text-slate-800 dark:text-white">
                                                            {badge.name}
                                                        </p>
                                                    </div>
                                                    <p className="mt-0.5 text-xs text-slate-400 dark:text-slate-500">
                                                        Drag to reorder · current order: <span className="font-medium">{badge.order}</span>
                                                    </p>
                                                </div>
                                            </div>

                                            {/* Right */}
                                            <div className="flex gap-2">
                                                <Link
                                                    href={`/admin/assets/badges/${badgeId}/edit`}
                                                    className="inline-flex items-center justify-center rounded-lg border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-semibold text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-900 dark:border-slate-700 dark:bg-white/5 dark:text-slate-300 dark:hover:bg-white/10 dark:hover:text-white"
                                                >
                                                    Edit
                                                </Link>
                                                <button
                                                    onClick={() => remove(badgeId)}
                                                    className="inline-flex items-center justify-center rounded-lg border border-red-200 bg-red-50 px-3 py-1.5 text-xs font-semibold text-red-600 transition-colors hover:bg-red-100 dark:border-red-500/20 dark:bg-red-500/10 dark:text-red-400 dark:hover:bg-red-500/20"
                                                >
                                                    Delete
                                                </button>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>

                </div>
            </div>
        </AppLayout>
    );
}