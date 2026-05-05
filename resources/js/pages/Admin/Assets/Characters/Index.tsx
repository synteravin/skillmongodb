import AppLayout from '@/layouts/app-layout';
import { router } from '@inertiajs/react';
import { Plus, Pencil, Trash2 } from 'lucide-react';

type Character = {
    id: string;
    name: string;
    backstory: string;
    avatar: string;
    avatar_url: string;
};

export default function CharacterIndex({
    characters,
}: {
    characters: Character[];
}) {
    const destroy = (id: string) => {
        if (!confirm('Delete this character?')) return;

        // ✅ FIX
        router.delete(`/admin/assets/characters/${id}`);
    };

    return (
        <AppLayout>
            <div className="min-h-screen bg-slate-50 px-4 py-8 sm:px-6 lg:px-10 dark:bg-slate-950">
                <div className="mx-auto max-w-7xl space-y-8">

                    {/* HEADER */}
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                            <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
                                Characters
                            </h1>
                            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                                Manage playable characters available for students.
                            </p>
                        </div>

                        {/* ✅ FIX */}
                        <a
                            href="/admin/assets/characters/create"
                            className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 px-5 py-3 text-sm font-semibold text-white shadow-lg transition hover:opacity-90"
                        >
                            <Plus size={16} />
                            New Character
                        </a>
                    </div>

                    {/* CONTENT */}
                    {characters.length === 0 ? (
                        <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-12 text-center dark:border-slate-700 dark:bg-slate-900">
                            <p className="text-slate-500 dark:text-slate-400">
                                No characters created yet.
                            </p>
                        </div>
                    ) : (
                        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                            {characters.map((char) => (
                                <div
                                    key={char.id}
                                    className="group relative overflow-hidden rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl dark:border-slate-800 dark:bg-slate-900"
                                >
                                    {/* Glow */}
                                    <div className="pointer-events-none absolute -top-20 -right-20 h-40 w-40 rounded-full bg-indigo-500/20 opacity-0 blur-3xl transition group-hover:opacity-100" />

                                    {/* Avatar */}
                                    <div className="relative z-10 flex justify-center">
                                        <img
                                            src={char.avatar_url}
                                            alt={char.name}
                                            className="h-28 w-28 rounded-full object-cover shadow-lg ring-4 ring-slate-100 transition group-hover:scale-105 dark:ring-slate-800"
                                        />
                                    </div>

                                    {/* Name */}
                                    <h2 className="relative z-10 mt-4 text-center text-lg font-semibold text-slate-900 dark:text-white">
                                        {char.name}
                                    </h2>

                                    {/* Backstory */}
                                    <p className="relative z-10 mt-2 line-clamp-3 text-center text-sm text-slate-500 dark:text-slate-400">
                                        {char.backstory}
                                    </p>

                                    {/* Actions */}
                                    <div className="relative z-10 mt-6 flex items-center justify-between">

                                        {/* ✅ FIX */}
                                        <a
                                            href={`/admin/assets/characters/${char.id}/edit`}
                                            className="inline-flex items-center gap-1 text-sm font-medium text-indigo-600 hover:underline dark:text-indigo-400"
                                        >
                                            <Pencil size={14} />
                                            Edit
                                        </a>

                                        <button
                                            onClick={() => destroy(char.id)}
                                            className="inline-flex items-center gap-1 text-sm font-medium text-red-600 hover:underline dark:text-red-400"
                                        >
                                            <Trash2 size={14} />
                                            Delete
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </AppLayout>
    );
}