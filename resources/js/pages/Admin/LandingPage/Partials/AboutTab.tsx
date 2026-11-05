import { useForm } from '@inertiajs/react';
import { Loader2, Save } from 'lucide-react';
import React from 'react';
import type { LandingPageAbout } from '@/types/landing-page';

interface Props {
    about: Required<LandingPageAbout>;
}

export default function AboutTab({ about }: Props) {
    const aboutForm = useForm<Required<LandingPageAbout>>({
        badge_title: about.badge_title || 'About Section',
        card_1_title: about.card_1_title || 'LMS & Jalur Belajar Modern',
        card_1_text: about.card_1_text || '',
        card_2_title: about.card_2_title || 'Gamifikasi & Sistem Level',
        card_2_text: about.card_2_text || '',
    });

    const submitAbout = (e: React.FormEvent) => {
        e.preventDefault();
        aboutForm.post('/admin/landing-page/about', {
            preserveScroll: true,
        });
    };

    return (
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8 dark:border-slate-800 dark:bg-slate-900">
            <div className="mb-6 flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 pb-5 dark:border-slate-800">
                <div>
                    <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                        Konten About Section
                    </h2>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                        Atur teks penjelasan platform LMS dan sistem gamifikasi
                        yang tampil pada kartu utama About di landing page.
                    </p>
                </div>
                <span className="rounded-full bg-indigo-50 px-3 py-1 text-xs font-semibold text-indigo-700 dark:bg-indigo-950/40 dark:text-indigo-300">
                    2 Kartu Konten
                </span>
            </div>

            <form onSubmit={submitAbout} className="space-y-6">
                {/* Badge Title */}
                <div>
                    <label className="mb-1.5 block text-xs font-semibold tracking-wider text-slate-600 uppercase dark:text-slate-300">
                        Judul Badge Atas
                    </label>
                    <input
                        type="text"
                        value={aboutForm.data.badge_title}
                        onChange={(e) =>
                            aboutForm.setData('badge_title', e.target.value)
                        }
                        className="w-full max-w-md rounded-xl border border-slate-300 bg-slate-50/50 px-4 py-2.5 text-sm text-slate-900 transition focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                        placeholder="About Section"
                        required
                    />
                    {aboutForm.errors.badge_title && (
                        <p className="mt-1 text-xs text-rose-500">
                            {aboutForm.errors.badge_title}
                        </p>
                    )}
                </div>

                <div className="grid gap-6 md:grid-cols-2">
                    {/* CARD 1: LMS Overview */}
                    <div className="rounded-2xl border border-cyan-500/20 bg-cyan-50/20 p-5 dark:border-cyan-500/20 dark:bg-slate-950/40">
                        <div className="mb-3 flex items-center justify-between">
                            <span className="inline-flex items-center gap-1.5 text-xs font-bold text-cyan-700 dark:text-cyan-400">
                                <span className="h-2 w-2 rounded-full bg-cyan-500" />
                                Kartu 1 (Kiri) - Overview LMS
                            </span>
                        </div>

                        <div className="space-y-3">
                            <div>
                                <label className="mb-1 block text-xs font-semibold text-slate-600 dark:text-slate-300">
                                    Label / Judul Kartu 1
                                </label>
                                <input
                                    type="text"
                                    value={aboutForm.data.card_1_title}
                                    onChange={(e) =>
                                        aboutForm.setData(
                                            'card_1_title',
                                            e.target.value,
                                        )
                                    }
                                    className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2 text-sm text-slate-900 transition focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 focus:outline-none dark:border-slate-700 dark:bg-slate-900 dark:text-white"
                                    required
                                />
                            </div>

                            <div>
                                <label className="mb-1 block text-xs font-semibold text-slate-600 dark:text-slate-300">
                                    Paragraf Deskripsi
                                </label>
                                <textarea
                                    rows={7}
                                    value={aboutForm.data.card_1_text}
                                    onChange={(e) =>
                                        aboutForm.setData(
                                            'card_1_text',
                                            e.target.value,
                                        )
                                    }
                                    className="w-full rounded-xl border border-slate-300 bg-white p-3.5 text-sm leading-relaxed text-slate-900 transition focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 focus:outline-none dark:border-slate-700 dark:bg-slate-900 dark:text-white"
                                    placeholder="Tuliskan penjelasan mengenai LMS..."
                                    required
                                />
                                <div className="mt-1 flex justify-between text-[11px] text-slate-400">
                                    <span>Disarankan 200 - 450 karakter</span>
                                    <span>
                                        {aboutForm.data.card_1_text.length}{' '}
                                        karakter
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* CARD 2: Gamification */}
                    <div className="rounded-2xl border border-pink-500/20 bg-pink-50/20 p-5 dark:border-pink-500/20 dark:bg-slate-950/40">
                        <div className="mb-3 flex items-center justify-between">
                            <span className="inline-flex items-center gap-1.5 text-xs font-bold text-pink-700 dark:text-pink-400">
                                <span className="h-2 w-2 rounded-full bg-pink-500" />
                                Kartu 2 (Kanan) - Sistem Gamifikasi
                            </span>
                        </div>

                        <div className="space-y-3">
                            <div>
                                <label className="mb-1 block text-xs font-semibold text-slate-600 dark:text-slate-300">
                                    Label / Judul Kartu 2
                                </label>
                                <input
                                    type="text"
                                    value={aboutForm.data.card_2_title}
                                    onChange={(e) =>
                                        aboutForm.setData(
                                            'card_2_title',
                                            e.target.value,
                                        )
                                    }
                                    className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2 text-sm text-slate-900 transition focus:border-pink-500 focus:ring-2 focus:ring-pink-500/20 focus:outline-none dark:border-slate-700 dark:bg-slate-900 dark:text-white"
                                    required
                                />
                            </div>

                            <div>
                                <label className="mb-1 block text-xs font-semibold text-slate-600 dark:text-slate-300">
                                    Paragraf Deskripsi
                                </label>
                                <textarea
                                    rows={7}
                                    value={aboutForm.data.card_2_text}
                                    onChange={(e) =>
                                        aboutForm.setData(
                                            'card_2_text',
                                            e.target.value,
                                        )
                                    }
                                    className="w-full rounded-xl border border-slate-300 bg-white p-3.5 text-sm leading-relaxed text-slate-900 transition focus:border-pink-500 focus:ring-2 focus:ring-pink-500/20 focus:outline-none dark:border-slate-700 dark:bg-slate-900 dark:text-white"
                                    placeholder="Tuliskan penjelasan gamifikasi..."
                                    required
                                />
                                <div className="mt-1 flex justify-between text-[11px] text-slate-400">
                                    <span>Disarankan 200 - 450 karakter</span>
                                    <span>
                                        {aboutForm.data.card_2_text.length}{' '}
                                        karakter
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex justify-end pt-3">
                    <button
                        type="submit"
                        disabled={aboutForm.processing}
                        className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700 disabled:opacity-50 dark:bg-indigo-500 dark:hover:bg-indigo-600"
                    >
                        {aboutForm.processing ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                            <Save className="h-4 w-4" />
                        )}
                        Simpan
                    </button>
                </div>
            </form>
        </div>
    );
}
