import AppLayout from '@/layouts/app-layout';
import { router, Link } from '@inertiajs/react';
import { Plus, Pencil, Trash2, Users, Search } from 'lucide-react';
import { useState } from 'react';

type Character = {
    id: string;
    name: string;
    backstory: string;
    avatar: string;
    avatar_url: string;
};

export default function CharacterIndex({ characters }: { characters: Character[] }) {
    const [searchQuery, setSearchQuery] = useState('');

    const destroy = (id: string) => {
        if (!confirm('Delete this character?')) return;
        router.delete(`/admin/assets/characters/${id}`);
    };

    const filteredCharacters = characters.filter((char) =>
        char.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <AppLayout>
            <div className="min-h-screen bg-slate-50 px-4 py-8 sm:px-6 lg:px-10 dark:bg-[#0B1120]">
                <div className="mx-auto max-w-7xl space-y-8">
                    {/* Header */}
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                            <h1 className="flex items-center gap-2 text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
                                <Users className="h-8 w-8 text-indigo-500" />
                                Characters
                            </h1>
                            <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                                Manage playable characters, mentors, and their abilities.
                            </p>
                        </div>
                        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                                <input
                                    type="text"
                                    placeholder="Search characters..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-10 pr-4 text-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 sm:w-64 dark:border-slate-800 dark:bg-slate-900 dark:text-white dark:focus:border-indigo-400"
                                />
                            </div>
                            <Link
                                href="/admin/assets/characters/create"
                                className="inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-indigo-500 focus:ring-2 focus:ring-indigo-500/50"
                            >
                                <Plus size={18} />
                                New Character
                            </Link>
                        </div>
                    </div>

                    {/* Content */}
                    {filteredCharacters.length === 0 ? (
                        <div className="flex flex-col items-center justify-center rounded-2xl border border-slate-200 bg-white p-16 text-center shadow-sm dark:border-slate-800 dark:bg-slate-900">
                            <div className="mb-4 rounded-full bg-slate-100 p-4 dark:bg-slate-800">
                                <Users className="h-8 w-8 text-slate-400" />
                            </div>
                            <h3 className="text-lg font-semibold text-slate-900 dark:text-white">No characters found</h3>
                            <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                                {searchQuery ? 'Try adjusting your search terms.' : 'Get started by creating a new character.'}
                            </p>
                        </div>
                    ) : (
                        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                            {filteredCharacters.map((char) => (
                                <div
                                    key={char.id}
                                    className="group flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg dark:border-slate-800 dark:bg-slate-900"
                                >

                                    <div className="relative h-24 w-full bg-slate-100 dark:bg-slate-800/50">
                                        <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 to-purple-500/10 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                                    </div>

                                    <div className="relative flex flex-1 flex-col px-6 pb-6">

                                        <div className="absolute -top-22 left-1/2 -translate-x-1/2">
                                            <div className="rounded-full bg-white p-1.5 shadow-sm dark:bg-slate-900">
                                                <img
                                                    src={char.avatar_url}
                                                    alt={char.name}
                                                    className="h-30 w-30 rounded-full object-cover shadow-inner"
                                                />
                                            </div>
                                        </div>

                                        <div className="mt-12 flex-1 text-center">
                                            <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                                                {char.name}
                                            </h2>
                                            <p className="mt-2 line-clamp-3 text-sm text-slate-600 dark:text-slate-400">
                                                {char.backstory || 'No backstory provided.'}
                                            </p>
                                        </div>


                                        <div className="mt-6 flex items-center justify-between border-t border-slate-100 pt-4 dark:border-slate-800">
                                            <Link
                                                href={`/admin/assets/characters/${char.id}/edit`}
                                                className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-100 hover:text-indigo-600 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-indigo-400"
                                            >
                                                <Pencil size={14} />
                                                Edit
                                            </Link>
                                            <button
                                                type="button"
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    destroy(char.id);
                                                }}
                                                className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium text-slate-600 transition-colors hover:bg-red-50 hover:text-red-600 dark:text-slate-400 dark:hover:bg-red-950/30 dark:hover:text-red-400"
                                            >
                                                <Trash2 size={14} />
                                                Delete
                                            </button>
                                        </div>
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