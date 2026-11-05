import { useForm } from '@inertiajs/react';
import { ExternalLink, Loader2, Save, Users } from 'lucide-react';
import React from 'react';
import type { LandingPageCommunity } from '@/types/landing-page';

interface Props {
    community: Required<LandingPageCommunity>;
}

export default function CommunityTab({ community }: Props) {
    const communityForm = useForm<Required<LandingPageCommunity>>({
        title:
            community.title ||
            'Join Us to Learn Level Up and\nMaster Real-World Tech',
        button_text: community.button_text || 'Join Community',
        discord_url: community.discord_url || 'https://discord.gg/yourlink',
        is_active: community.is_active ?? true,
    });

    const submitCommunity = (e: React.FormEvent) => {
        e.preventDefault();
        communityForm.post('/admin/landing-page/community', {
            preserveScroll: true,
        });
    };

    return (
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8 dark:border-slate-800 dark:bg-slate-900">
            <div className="mb-6 flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 pb-5 dark:border-slate-800">
                <div>
                    <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                        Ajakan Bergabung Komunitas (CTA)
                    </h2>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                        Atur headline ajakan bergabung, teks tombol, serta
                        tautan Discord atau grup komunitas resmi platform.
                    </p>
                </div>
                <span className="rounded-full bg-violet-50 px-3 py-1 text-xs font-semibold text-violet-700 dark:bg-violet-950/40 dark:text-violet-300">
                    Komunitas CTA
                </span>
            </div>

            <form onSubmit={submitCommunity} className="max-w-2xl space-y-5">
                <div>
                    <label className="mb-1.5 block text-xs font-semibold text-slate-700 dark:text-slate-300">
                        Headline Ajakan (Title)
                    </label>
                    <textarea
                        rows={3}
                        value={communityForm.data.title}
                        onChange={(e) =>
                            communityForm.setData('title', e.target.value)
                        }
                        className="w-full rounded-xl border border-slate-300 bg-white p-3.5 text-sm font-semibold text-slate-900 focus:border-indigo-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                        placeholder="Join Us to Learn Level Up and Master Real-World Tech"
                        required
                    />
                    <p className="mt-1 text-[11px] text-slate-400">
                        Gunakan baris baru (Enter) jika ingin memecah baris
                        judul di layar lebar.
                    </p>
                </div>

                <div className="grid gap-5 sm:grid-cols-2">
                    <div>
                        <label className="mb-1.5 block text-xs font-semibold text-slate-700 dark:text-slate-300">
                            Teks Tombol
                        </label>
                        <input
                            type="text"
                            value={communityForm.data.button_text}
                            onChange={(e) =>
                                communityForm.setData(
                                    'button_text',
                                    e.target.value,
                                )
                            }
                            className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 focus:border-indigo-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                            placeholder="Join Community"
                            required
                        />
                    </div>

                    <div>
                        <label className="mb-1.5 block text-xs font-semibold text-slate-700 dark:text-slate-300">
                            Tautan Discord / Komunitas
                        </label>
                        <div className="relative">
                            <input
                                type="url"
                                value={communityForm.data.discord_url}
                                onChange={(e) =>
                                    communityForm.setData(
                                        'discord_url',
                                        e.target.value,
                                    )
                                }
                                className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 pr-10 text-sm text-slate-900 focus:border-indigo-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                                placeholder="https://discord.gg/..."
                                required
                            />
                            <a
                                href={communityForm.data.discord_url}
                                target="_blank"
                                rel="noreferrer"
                                className="absolute top-1/2 right-3 -translate-y-1/2 text-slate-400 hover:text-indigo-600"
                                title="Uji Tautan"
                            >
                                <ExternalLink className="h-4 w-4" />
                            </a>
                        </div>
                    </div>
                </div>

                {/* Preview Box */}
                <div className="mt-4 rounded-2xl border border-indigo-500/20 bg-indigo-50/20 p-5 dark:border-indigo-500/20 dark:bg-slate-950/40">
                    <span className="text-[11px] font-bold tracking-wider text-indigo-600 uppercase dark:text-indigo-400">
                        Pratinjau Tombol
                    </span>
                    <div className="mt-3 flex items-center gap-3">
                        <button
                            type="button"
                            className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-purple-500 via-violet-500 to-blue-500 px-5 py-2.5 text-xs font-bold text-white shadow-md"
                            style={{ fontFamily: 'Orbitron' }}
                        >
                            {communityForm.data.button_text}
                            <Users className="h-4 w-4" />
                        </button>
                        <span className="text-xs text-slate-500 dark:text-slate-400">
                            Menuju ke: {communityForm.data.discord_url}
                        </span>
                    </div>
                </div>

                <div className="flex justify-end pt-3">
                    <button
                        type="submit"
                        disabled={communityForm.processing}
                        className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700 disabled:opacity-50 dark:bg-indigo-500 dark:hover:bg-indigo-600"
                    >
                        {communityForm.processing ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                            <Save className="h-4 w-4" />
                        )}
                        Simpan Ajakan Komunitas
                    </button>
                </div>
            </form>
        </div>
    );
}
