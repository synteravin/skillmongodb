import AppLayout from '@/layouts/app-layout';
import { router, Link } from '@inertiajs/react';
import { useState } from 'react';

type Character = {
    id: string;
    name: string;
    tagline?: string;
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
                            Character Management
                        </h1>
                        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                            Manage playable characters, mentors, and their abilities.
                        </p>
                    </div>
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                        <div className="relative">
                            <svg
                                className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                                strokeWidth={2}
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35m0 0A7 7 0 1 0 6.65 16.65 7 7 0 0 0 16.65 16.65z" />
                            </svg>
                            <input
                                type="text"
                                placeholder="Search characters..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-10 pr-4 text-sm outline-none transition focus:border-slate-400 focus:ring-1 focus:ring-slate-400 sm:w-64 dark:border-slate-700 dark:bg-white/5 dark:text-white dark:focus:border-slate-500 dark:placeholder-slate-600"
                            />
                        </div>
                        <Link
                            href="/admin/assets/characters/create"
                            className="inline-flex items-center justify-center gap-2 rounded-xl bg-slate-800 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-slate-700 dark:bg-white/10 dark:hover:bg-white/20"
                        >
                            + New Character
                        </Link>
                    </div>
                </div>

                {/* Content */}
                {filteredCharacters.length === 0 ? (
                    <div className="relative overflow-hidden rounded-xl border border-slate-200 bg-white p-12 text-center shadow-sm dark:border-slate-800 dark:bg-gradient-to-b dark:from-[#0e0e1a] dark:to-[#090910]">
                        <div className="absolute top-0 right-8 left-8 h-px bg-gradient-to-r from-transparent via-slate-300 to-transparent dark:via-slate-700" />
                        <p className="text-sm font-medium text-slate-800 dark:text-white">
                            {searchQuery ? 'No characters match your search' : 'No characters created yet'}
                        </p>
                        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                            {searchQuery ? 'Try adjusting your search terms.' : 'Get started by creating a new character.'}
                        </p>
                    </div>
                ) : (
                    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                        {filteredCharacters.map((char) => (
                            <div
                                key={char.id}
                                className="group relative flex flex-col overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md dark:border-slate-800 dark:bg-gradient-to-b dark:from-[#0e0e1a] dark:to-[#090910]"
                            >
                                {/* top accent line */}
                                <div className="absolute top-0 right-6 left-6 h-px bg-gradient-to-r from-transparent via-slate-300 to-transparent dark:via-slate-700" />

                                {/* Card Header / Banner area */}
                                <div className="relative h-20 w-full bg-slate-50/50 dark:bg-white/[0.01] border-b border-slate-100 dark:border-white/5">
                                    <div className="absolute inset-0 bg-gradient-to-r from-slate-500/5 via-transparent to-slate-500/5 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                                </div>

                                {/* Card Body */}
                                <div className="relative flex flex-1 flex-col px-6 pb-6 pt-12 text-center">
                                    {/* Avatar - overlapping the banner */}
                                    <div className="absolute -top-10 left-1/2 -translate-x-1/2">
                                        <div className="flex h-20 w-20 items-center justify-center rounded-full border-4 border-white bg-slate-50 p-1 shadow-md dark:border-[#0c0c16] dark:bg-slate-900 ring-1 ring-slate-200/50 dark:ring-white/5">
                                            <img
                                                src={char.avatar_url}
                                                alt={char.name}
                                                onError={(e) => {
                                                    (e.currentTarget as HTMLImageElement).src = '/images/default-avatar.png';
                                                }}
                                                className="h-full w-full rounded-full object-cover"
                                            />
                                        </div>
                                    </div>

                                    {/* Name & Tagline */}
                                    <div className="flex-1 space-y-2">
                                        <h3 className="text-base font-bold text-slate-800 dark:text-white" style={{ fontFamily: 'Orbitron, sans-serif' }}>
                                            {char.name}
                                        </h3>
                                        {char.tagline && (
                                            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                                                {char.tagline}
                                            </p>
                                        )}
                                        <p className="mt-2 line-clamp-3 text-xs leading-relaxed text-slate-500 dark:text-slate-400">
                                            {char.backstory || 'No backstory provided.'}
                                        </p>
                                    </div>

                                    {/* Actions */}
                                    <div className="mt-6 flex items-center justify-end gap-2 border-t border-slate-100 pt-4 dark:border-white/5">
                                        <Link
                                            href={`/admin/assets/characters/${char.id}/edit`}
                                            className="inline-flex items-center justify-center rounded-lg border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-semibold text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-900 dark:border-slate-700 dark:bg-white/5 dark:text-slate-300 dark:hover:bg-white/10 dark:hover:text-white"
                                        >
                                            Edit
                                        </Link>
                                        <button
                                            type="button"
                                            onClick={() => destroy(char.id)}
                                            className="inline-flex items-center justify-center rounded-lg border border-red-200 bg-red-50 px-3 py-1.5 text-xs font-semibold text-red-600 transition-colors hover:bg-red-100 dark:border-red-500/20 dark:bg-red-500/10 dark:text-red-400 dark:hover:bg-red-500/20"
                                        >
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