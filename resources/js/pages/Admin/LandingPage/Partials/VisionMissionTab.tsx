import { router } from '@inertiajs/react';
import { Loader2, Save } from 'lucide-react';
import React, { useState } from 'react';
import type { VisionMissionPillar } from '@/types/landing-page';

interface Props {
    pillars: VisionMissionPillar[];
}

export default function VisionMissionTab({ pillars: initialPillars }: Props) {
    const [pillars, setPillars] = useState<VisionMissionPillar[]>(
        initialPillars || [],
    );
    const [isSaving, setIsSaving] = useState(false);

    const handlePillarChange = (
        index: number,
        field: keyof VisionMissionPillar,
        value: string,
    ) => {
        setPillars((prev) => {
            const next = [...prev];
            next[index] = { ...next[index], [field]: value };
            return next;
        });
    };

    const submitVisionMission = (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);
        router.post(
            '/admin/landing-page/vision-mission',
            { pillars },
            {
                preserveScroll: true,
                onFinish: () => setIsSaving(false),
            },
        );
    };

    return (
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8 dark:border-slate-800 dark:bg-slate-900">
            <div className="mb-6 flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 pb-5 dark:border-slate-800">
                <div>
                    <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                        Visi, Misi, Nilai & Tujuan (4 Pilar)
                    </h2>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                        Sesuaikan isi 4 pilar filosofi platform. Teks Mission
                        tidak lagi menggunakan teks statis/lorem ipsum dan dapat
                        diubah secara dinamis.
                    </p>
                </div>
                <span className="rounded-full bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-700 dark:bg-amber-950/40 dark:text-amber-300">
                    4 Pilar Aktif
                </span>
            </div>

            <form onSubmit={submitVisionMission} className="space-y-6">
                <div className="grid gap-6 sm:grid-cols-2">
                    {pillars.map((pillar, idx) => (
                        <div
                            key={pillar.id || idx}
                            className="relative rounded-2xl border border-slate-200/90 bg-slate-50/50 p-5 transition-shadow hover:shadow-xs dark:border-slate-800 dark:bg-slate-950/50"
                        >
                            <div className="mb-4 flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-900 p-2 shadow-xs dark:bg-slate-800">
                                        <img
                                            src={pillar.icon}
                                            alt={pillar.title}
                                            className="h-6 w-6 object-contain"
                                        />
                                    </div>
                                    <div>
                                        <span className="text-xs font-bold text-slate-400 uppercase">
                                            Pilar #{idx + 1}
                                        </span>
                                        <h3 className="font-bold text-slate-900 dark:text-white">
                                            {pillar.badge || pillar.title}
                                        </h3>
                                    </div>
                                </div>

                                <span
                                    className="rounded-full px-2.5 py-0.5 text-xs font-bold text-slate-900"
                                    style={{
                                        backgroundColor:
                                            pillar.badge_color || '#F0E427',
                                    }}
                                >
                                    {pillar.badge}
                                </span>
                            </div>

                            <div className="space-y-3">
                                <div>
                                    <label className="mb-1 block text-xs font-semibold text-slate-600 dark:text-slate-300">
                                        Label Badge
                                    </label>
                                    <input
                                        type="text"
                                        value={pillar.badge}
                                        onChange={(e) =>
                                            handlePillarChange(
                                                idx,
                                                'badge',
                                                e.target.value,
                                            )
                                        }
                                        className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2 text-sm text-slate-900 focus:border-indigo-500 focus:outline-none dark:border-slate-700 dark:bg-slate-900 dark:text-white"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="mb-1 block text-xs font-semibold text-slate-600 dark:text-slate-300">
                                        Teks Deskripsi / Pernyataan
                                    </label>
                                    <textarea
                                        rows={3}
                                        value={pillar.description}
                                        onChange={(e) =>
                                            handlePillarChange(
                                                idx,
                                                'description',
                                                e.target.value,
                                            )
                                        }
                                        className="w-full rounded-xl border border-slate-300 bg-white p-3 text-sm leading-relaxed text-slate-900 focus:border-indigo-500 focus:outline-none dark:border-slate-700 dark:bg-slate-900 dark:text-white"
                                        placeholder="Tuliskan isi pilar..."
                                        required
                                    />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="flex justify-end pt-3">
                    <button
                        type="submit"
                        disabled={isSaving}
                        className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700 disabled:opacity-50 dark:bg-indigo-500 dark:hover:bg-indigo-600"
                    >
                        {isSaving ? (
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
