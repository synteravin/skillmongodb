import { useState } from 'react';
import { Link, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Plus, Edit2, Trash2, Shield, Save, Loader2 } from 'lucide-react';

type Rank = {
    id: string;
    name: string;
    image: string;
    image_url: string;
};

export default function Index({ ranks }: { ranks: Rank[] }) {
    const [items, setItems] = useState(ranks);
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
            id: item.id,
            order: index + 1,
        }));

        router.post('/admin/assets/ranks/reorder', { ranks: payload }, {
            onFinish: () => setIsSaving(false),
        });
    };

    const remove = (id: string) => {
        if (!confirm('Delete this rank?')) return;
        router.delete(`/admin/assets/ranks/${id}`);
    };

    return (
        <AppLayout>
            <div className="min-h-screen bg-slate-50 px-4 py-8 sm:px-6 lg:px-10 dark:bg-[#0B1120]">
                <div className="mx-auto max-w-5xl space-y-8">
                    {/* Header */}
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                            <h1 className="flex items-center gap-2 text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
                                <Shield className="h-8 w-8 text-amber-500" />
                                Rank Management
                            </h1>
                            <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                                Drag and drop to reorder student ranks, and configure rank badges.
                            </p>
                        </div>
                        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                            <button
                                type="button"
                                onClick={saveOrder}
                                disabled={isSaving}
                                className="inline-flex items-center justify-center gap-2 rounded-xl bg-slate-800 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-slate-700 focus:ring-2 focus:ring-slate-500/50 dark:bg-white/10 dark:hover:bg-white/20 disabled:opacity-50"
                            >
                                {isSaving ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
                                {isSaving ? 'Saving...' : 'Save Order'}
                            </button>

                            <Link
                                href="/admin/assets/ranks/create"
                                className="inline-flex items-center justify-center gap-2 rounded-xl bg-amber-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-amber-500 focus:ring-2 focus:ring-amber-500/50"
                            >
                                <Plus size={18} />
                                Add Rank
                            </Link>
                        </div>
                    </div>

                    {/* List */}
                    <div className="rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
                        <div className="border-b border-slate-200 px-6 py-4 dark:border-slate-800">
                            <h3 className="text-sm font-semibold text-slate-900 dark:text-white">Active Ranks</h3>
                        </div>

                        {items.length === 0 ? (
                            <div className="p-12 text-center">
                                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800">
                                    <Shield className="h-6 w-6 text-slate-400" />
                                </div>
                                <h3 className="text-sm font-medium text-slate-900 dark:text-white">No ranks created yet</h3>
                                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Get started by creating a new rank.</p>
                            </div>
                        ) : (
                            <div className="divide-y divide-slate-100 dark:divide-slate-800">
                                {items.map((rank, index) => (
                                    <div
                                        key={rank.id}
                                        draggable
                                        onDragStart={(e) => {
                                            e.dataTransfer.setData('index', index.toString());
                                            e.currentTarget.classList.add('opacity-50', 'bg-slate-50', 'dark:bg-slate-800/50');
                                        }}
                                        onDragEnd={(e) => {
                                            e.currentTarget.classList.remove('opacity-50', 'bg-slate-50', 'dark:bg-slate-800/50');
                                        }}
                                        onDragOver={(e) => e.preventDefault()}
                                        onDrop={(e) => {
                                            const dragIndex = Number(e.dataTransfer.getData('index'));
                                            handleDrag(dragIndex, index);
                                        }}
                                        className="flex cursor-grab items-center justify-between p-6 transition-colors hover:bg-slate-50 active:cursor-grabbing dark:hover:bg-slate-800/50"
                                    >
                                        {/* Left */}
                                        <div className="flex items-center gap-6">
                                            <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-slate-100 p-2 shadow-inner dark:bg-slate-950">
                                                <img
                                                    src={rank.image_url}
                                                    onError={(e) => {
                                                        (e.currentTarget as HTMLImageElement).src = '/images/default-rank.png';
                                                    }}
                                                    className="h-full w-full object-contain drop-shadow-md"
                                                />
                                            </div>

                                            <div>
                                                <div className="flex items-center gap-3">
                                                    <span className="flex h-6 w-6 items-center justify-center rounded-md bg-amber-100 text-xs font-bold text-amber-600 dark:bg-amber-500/20 dark:text-amber-400">
                                                        {index + 1}
                                                    </span>
                                                    <p className="text-lg font-bold text-slate-900 dark:text-white">
                                                        {rank.name}
                                                    </p>
                                                </div>
                                                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                                                    Drag to reorder rank position
                                                </p>
                                            </div>
                                        </div>

                                        {/* Right */}
                                        <div className="flex gap-2">
                                            <Link
                                                href={`/admin/assets/ranks/${rank.id}/edit`}
                                                className="inline-flex items-center justify-center rounded-lg bg-slate-100 p-2 text-slate-600 transition-colors hover:bg-slate-200 hover:text-slate-900 dark:bg-slate-800 dark:text-slate-400 dark:hover:bg-slate-700 dark:hover:text-white"
                                            >
                                                <Edit2 size={16} />
                                            </Link>

                                            <button
                                                onClick={() => remove(rank.id)}
                                                className="inline-flex items-center justify-center rounded-lg bg-red-50 p-2 text-red-600 transition-colors hover:bg-red-100 hover:text-red-700 dark:bg-red-500/10 dark:text-red-400 dark:hover:bg-red-500/20 dark:hover:text-red-300"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}