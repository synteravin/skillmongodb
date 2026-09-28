import React, { useState } from 'react';
import { Link, useForm } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Quest } from '@/types/quest';
import {
    Briefcase,
    Calendar,
    FileText,
    Image as ImageIcon,
    ShieldCheck,
    Coins,
    Award,
    Sparkles,
    AlertCircle,
    Info,
    Check,
    Percent,
    ArrowLeft,
} from 'lucide-react';

interface EditProps {
    quest: Quest;
}

export default function Edit({ quest }: EditProps) {
    let formattedDeadline = '';
    if (quest.deadline) {
        try {
            const d = new Date(quest.deadline);
            if (!isNaN(d.getTime())) {
                const local = new Date(
                    d.getTime() - d.getTimezoneOffset() * 60000,
                );
                formattedDeadline = local.toISOString().slice(0, 16);
            }
        } catch {
            formattedDeadline = '';
        }
    }

    const initialMinVal = quest.min_budget ?? quest.min_salary ?? 0;
    const initialMaxVal = quest.max_budget ?? quest.max_salary ?? 0;

    const { data, setData, put, processing, errors } = useForm({
        title: quest.title || '',
        description: quest.description || '',
        min_budget: initialMinVal ? String(initialMinVal) : '',
        max_budget: initialMaxVal ? String(initialMaxVal) : '',
        min_salary: initialMinVal ? String(initialMinVal) : '',
        max_salary: initialMaxVal ? String(initialMaxVal) : '',
        dp_percentage: (quest.dp_percentage ?? 10) as number | string,
        deadline: formattedDeadline,
    });

    // Format Rupiah currency
    const formatRupiah = (val: number | string | null | undefined): string => {
        const num = typeof val === 'string' ? parseInt(val) || 0 : val || 0;
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            maximumFractionDigits: 0,
        }).format(num);
    };

    // Format number with thousand dots separator automatically (e.g. 1000000 -> 1.000.000)
    const formatNumberWithDots = (
        val: number | string | null | undefined,
    ): string => {
        if (!val && val !== 0) return '';
        const clean = String(val).replace(/\D/g, '');
        if (!clean) return '';
        return new Intl.NumberFormat('id-ID').format(parseInt(clean, 10));
    };

    // Realtime Calculations
    const minBudgetNum = parseInt(String(data.min_budget)) || 0;
    const maxBudgetNum = parseInt(String(data.max_budget)) || 0;
    const avgBudgetNum = (minBudgetNum + maxBudgetNum) / 2;
    const dpPercent = Math.max(10, Math.min(100, Number(data.dp_percentage) || 10));

    const estimatedDpAmount = Math.round((maxBudgetNum * dpPercent) / 100);
    const estimatedFinalAmount = Math.max(0, maxBudgetNum - estimatedDpAmount);

    // Gamification Tier
    let tier = 'D';
    let tierLabel = 'Starter Task';
    let tierColor = 'border-slate-500/30 bg-slate-500/10 text-slate-600 dark:text-slate-300';

    if (maxBudgetNum >= 10000000) {
        tier = 'S';
        tierLabel = 'Mythic Enterprise';
        tierColor = 'border-amber-500/40 bg-amber-500/10 text-amber-600 dark:text-amber-400';
    } else if (maxBudgetNum >= 5000000) {
        tier = 'A';
        tierLabel = 'Expert Specialist';
        tierColor = 'border-purple-500/40 bg-purple-500/10 text-purple-600 dark:text-purple-400';
    } else if (maxBudgetNum >= 2500000) {
        tier = 'B';
        tierLabel = 'Intermediate Pro';
        tierColor = 'border-indigo-500/40 bg-indigo-500/10 text-indigo-600 dark:text-indigo-400';
    } else if (maxBudgetNum >= 1000000) {
        tier = 'C';
        tierLabel = 'Regular Standard';
        tierColor = 'border-sky-500/40 bg-sky-500/10 text-sky-600 dark:text-sky-400';
    }

    const calculatedExp = Math.min(
        1000,
        Math.max(100, Math.round(100 + avgBudgetNum * 0.0001)),
    );
    const calculatedGold = Math.min(
        500,
        Math.max(50, Math.round(50 + maxBudgetNum * 0.00005)),
    );
    const calculatedRep = Math.min(
        200,
        Math.max(20, Math.round(20 + avgBudgetNum * 0.00002)),
    );

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        put(`/admin/quests/${quest.slug || quest._id}`);
    };

    return (
        <AppLayout>
            <div
                className="relative min-h-screen px-4 py-8 sm:px-6 lg:px-10"
                style={{ fontFamily: "'Outfit', sans-serif" }}
            >
                {/* Background glow ambient */}
                <div className="pointer-events-none absolute top-0 left-1/2 z-0 h-[450px] w-full max-w-7xl -translate-x-1/2 rounded-full bg-indigo-500/5 blur-[120px] select-none dark:bg-indigo-500/5" />

                <div className="relative z-10 mx-auto max-w-6xl space-y-6">
                    {/* BREADCRUMB & BACK BUTTON */}
                    <div className="flex flex-wrap items-center justify-between gap-4">
                        <div className="flex items-center gap-3">
                            <Link
                                href="/admin/quests"
                                className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 shadow-sm transition hover:border-slate-300 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800"
                                title="Kembali ke Manajemen Quest"
                            >
                                <ArrowLeft size={18} />
                            </Link>
                            <div>
                                <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 dark:text-slate-400">
                                    <Link
                                        href="/admin/quests"
                                        className="transition hover:text-indigo-600 dark:hover:text-indigo-400"
                                    >
                                        Quests
                                    </Link>
                                    <span>/</span>
                                    <span className="text-slate-800 dark:text-slate-200 font-bold">
                                        Edit Quest
                                    </span>
                                </div>
                                <h1 className="text-xl font-extrabold text-slate-900 sm:text-2xl dark:text-white">
                                    Edit Parameter Quest
                                </h1>
                            </div>
                        </div>

                        {/* Badges */}
                        <div className="flex items-center gap-2">
                            <span className="inline-flex items-center gap-1.5 rounded-full border border-indigo-200 bg-indigo-50 px-3 py-1 text-xs font-bold text-indigo-700 dark:border-indigo-800 dark:bg-indigo-950/50 dark:text-indigo-300">
                                <ShieldCheck size={14} /> Admin Editor
                            </span>
                            <span className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-slate-100 px-3 py-1 text-xs font-bold text-slate-700 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300">
                                Status: {quest.status}
                            </span>
                        </div>
                    </div>

                    {/* FORM BODY: 2-COLUMN RESPONSIVE LAYOUT */}
                    <form
                        onSubmit={handleSubmit}
                        className="grid grid-cols-1 items-start gap-8 lg:grid-cols-12"
                    >
                        {/* LEFT COLUMN: Inputs (8 Cols) */}
                        <div className="space-y-6 lg:col-span-8">
                            <div className="space-y-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-[#0c0d16]">
                                {/* 1. Judul Proyek */}
                                <div className="space-y-2">
                                    <div className="flex items-center justify-between">
                                        <label className="text-xs font-bold tracking-wider text-slate-700 uppercase dark:text-slate-300">
                                            Judul Proyek Kerja
                                        </label>
                                        <span className="text-[11px] font-bold text-indigo-600 dark:text-indigo-400">
                                            Wajib
                                        </span>
                                    </div>
                                    <input
                                        type="text"
                                        required
                                        placeholder="Contoh: Pembuatan Landing Page E-Learning Responsif & Interaktif"
                                        value={data.title}
                                        onChange={(e) =>
                                            setData('title', e.target.value)
                                        }
                                        className={`w-full rounded-xl border bg-slate-50/90 px-4 py-3 text-xs font-semibold text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none dark:bg-[#030712] dark:text-white dark:placeholder:text-slate-500 ${
                                            errors.title
                                                ? 'border-red-500 focus:border-red-600'
                                                : 'border-slate-300 focus:border-indigo-600 dark:border-slate-800'
                                        }`}
                                    />
                                    {errors.title && (
                                        <p className="flex items-center gap-1 text-[11px] font-bold text-red-500">
                                            <AlertCircle size={13} /> {errors.title}
                                        </p>
                                    )}
                                </div>

                                {/* 2. Deskripsi & Spesifikasi Penugasan */}
                                <div className="space-y-2">
                                    <div className="flex items-center justify-between">
                                        <label className="text-xs font-bold tracking-wider text-slate-700 uppercase dark:text-slate-300">
                                            Deskripsi & Spesifikasi Deliverables
                                        </label>
                                        <span className="text-[11px] font-bold text-indigo-600 dark:text-indigo-400">
                                            Wajib
                                        </span>
                                    </div>
                                    <textarea
                                        required
                                        rows={10}
                                        placeholder="Tuliskan secara komprehensif spesifikasi proyek, deliverables yang diharapkan, repositori GitHub atau tools yang digunakan, serta kriteria evaluasi tugas..."
                                        value={data.description}
                                        onChange={(e) =>
                                            setData('description', e.target.value)
                                        }
                                        className={`w-full min-h-[220px] rounded-xl border bg-slate-50/90 p-4 text-xs font-semibold text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none dark:bg-[#030712] dark:text-white dark:placeholder:text-slate-500 ${
                                            errors.description
                                                ? 'border-red-500 focus:border-red-600'
                                                : 'border-slate-300 focus:border-indigo-600 dark:border-slate-800'
                                        }`}
                                    />
                                    {errors.description && (
                                        <p className="flex items-center gap-1 text-[11px] font-bold text-red-500">
                                            <AlertCircle size={13} />{' '}
                                            {errors.description}
                                        </p>
                                    )}
                                </div>

                                {/* 3. Rentang Anggaran (Min - Max Budget) */}
                                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                    {/* Min Budget */}
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold tracking-wider text-slate-700 uppercase dark:text-slate-300">
                                            Anggaran Minimal (IDR)
                                        </label>
                                        <div className="relative">
                                            <input
                                                type="text"
                                                inputMode="numeric"
                                                required
                                                placeholder="Contoh: 1.000.000"
                                                value={formatNumberWithDots(
                                                    data.min_budget,
                                                )}
                                                onChange={(e) => {
                                                    const raw = e.target.value.replace(
                                                        /\D/g,
                                                        '',
                                                    );
                                                    const val = raw
                                                        ? parseInt(raw, 10)
                                                        : '';
                                                    setData((prev) => ({
                                                        ...prev,
                                                        min_budget: val,
                                                        min_salary: val,
                                                    }));
                                                }}
                                                className={`w-full rounded-xl border bg-slate-50/90 py-3 pr-4 pl-11 text-xs font-semibold text-slate-900 focus:bg-white focus:outline-none dark:bg-[#030712] dark:text-white ${
                                                    errors.min_budget ||
                                                    errors.min_salary
                                                        ? 'border-red-500 focus:border-red-600'
                                                        : 'border-slate-300 focus:border-indigo-600 dark:border-slate-800'
                                                }`}
                                            />
                                            <span className="absolute top-3 left-4 text-xs font-extrabold text-slate-500 select-none dark:text-slate-400">
                                                Rp
                                            </span>
                                        </div>
                                        <span className="block text-[11px] font-medium text-slate-500 dark:text-slate-400">
                                            Terbaca: {formatRupiah(data.min_budget)}
                                        </span>
                                        {(errors.min_budget ||
                                            errors.min_salary) && (
                                            <p className="flex items-center gap-1 text-[11px] font-bold text-red-500">
                                                <AlertCircle size={13} />{' '}
                                                {errors.min_budget ||
                                                    errors.min_salary}
                                            </p>
                                        )}
                                    </div>

                                    {/* Max Budget */}
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold tracking-wider text-slate-700 uppercase dark:text-slate-300">
                                            Anggaran Maksimal (IDR)
                                        </label>
                                        <div className="relative">
                                            <input
                                                type="text"
                                                inputMode="numeric"
                                                required
                                                placeholder="Contoh: 2.500.000"
                                                value={formatNumberWithDots(
                                                    data.max_budget,
                                                )}
                                                onChange={(e) => {
                                                    const raw = e.target.value.replace(
                                                        /\D/g,
                                                        '',
                                                    );
                                                    const val = raw
                                                        ? parseInt(raw, 10)
                                                        : '';
                                                    setData((prev) => ({
                                                        ...prev,
                                                        max_budget: val,
                                                        max_salary: val,
                                                    }));
                                                }}
                                                className={`w-full rounded-xl border bg-slate-50/90 py-3 pr-4 pl-11 text-xs font-semibold text-slate-900 focus:bg-white focus:outline-none dark:bg-[#030712] dark:text-white ${
                                                    errors.max_budget ||
                                                    errors.max_salary
                                                        ? 'border-red-500 focus:border-red-600'
                                                        : 'border-slate-300 focus:border-indigo-600 dark:border-slate-800'
                                                }`}
                                            />
                                            <span className="absolute top-3 left-4 text-xs font-extrabold text-slate-500 select-none dark:text-slate-400">
                                                Rp
                                            </span>
                                        </div>
                                        <span className="block text-[11px] font-medium text-slate-500 dark:text-slate-400">
                                            Terbaca: {formatRupiah(data.max_budget)}
                                        </span>
                                        {(errors.max_budget ||
                                            errors.max_salary) && (
                                            <p className="flex items-center gap-1 text-[11px] font-bold text-red-500">
                                                <AlertCircle size={13} />{' '}
                                                {errors.max_budget ||
                                                    errors.max_salary}
                                            </p>
                                        )}
                                    </div>
                                </div>

                                {/* 4. Persentase Uang Muka (DP) */}
                                <div className="space-y-3 rounded-2xl border border-indigo-100 bg-indigo-50/40 p-4.5 dark:border-slate-800 dark:bg-[#030712]">
                                    <div className="flex items-center justify-between">
                                        <label className="flex items-center gap-1.5 text-xs font-bold tracking-wider text-indigo-700 uppercase dark:text-indigo-400">
                                            <Percent size={15} /> Persentase Uang
                                            Muka (DP)
                                        </label>
                                        <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">
                                            Batas Ketentuan: 10% - 100%
                                        </span>
                                    </div>

                                    <div className="space-y-3">
                                        <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                                            <div className="relative w-full sm:w-40">
                                                <input
                                                    type="text"
                                                    inputMode="numeric"
                                                    required
                                                    placeholder="10"
                                                    value={data.dp_percentage}
                                                    onChange={(e) => {
                                                        const raw = e.target.value.replace(/\D/g, '');
                                                        if (raw === '') {
                                                            setData('dp_percentage', '');
                                                            return;
                                                        }
                                                        const num = parseInt(raw, 10);
                                                        setData('dp_percentage', num > 100 ? 100 : num);
                                                    }}
                                                    onBlur={() => {
                                                        const num = parseInt(String(data.dp_percentage), 10);
                                                        if (!num || num < 10) {
                                                            setData('dp_percentage', 10);
                                                        } else if (num > 100) {
                                                            setData('dp_percentage', 100);
                                                        }
                                                    }}
                                                    className={`w-full rounded-xl border bg-white py-2.5 pr-8 pl-3.5 text-xs font-bold text-slate-900 focus:outline-none dark:bg-slate-950 dark:text-white ${
                                                        errors.dp_percentage
                                                            ? 'border-red-500 focus:border-red-600'
                                                            : 'border-slate-300 focus:border-indigo-600 dark:border-slate-800'
                                                    }`}
                                                />
                                                <span className="absolute top-2.5 right-3 text-xs font-bold text-slate-400 select-none">
                                                    %
                                                </span>
                                            </div>

                                            <div className="text-xs leading-relaxed text-slate-600 dark:text-slate-400">
                                                {maxBudgetNum > 0 ? (
                                                    <>
                                                        Estimasi DP Awal:{' '}
                                                        <strong className="text-indigo-600 dark:text-indigo-400">
                                                            {formatRupiah(
                                                                estimatedDpAmount,
                                                            )}
                                                        </strong>{' '}
                                                        &bull; Pelunasan Selesai:{' '}
                                                        <strong className="text-emerald-600 dark:text-emerald-400">
                                                            {formatRupiah(
                                                                estimatedFinalAmount,
                                                            )}
                                                        </strong>
                                                    </>
                                                ) : (
                                                    'Uang muka akan ditransfer ke pekerja setelah proposal penawaran diterima.'
                                                )}
                                            </div>
                                        </div>

                                        {/* Quick Preset Chips */}
                                        <div className="flex flex-wrap items-center gap-1.5 pt-1">
                                            <span className="text-[10px] font-semibold text-slate-400 select-none">
                                                Pilihan Cepat:
                                            </span>
                                            {[10, 25, 50, 100].map((preset) => (
                                                <button
                                                    key={preset}
                                                    type="button"
                                                    onClick={() => setData('dp_percentage', preset)}
                                                    className={`cursor-pointer rounded-lg border px-2.5 py-1 text-[11px] font-bold transition-all ${
                                                        Number(data.dp_percentage) === preset
                                                            ? 'border-indigo-600 bg-indigo-600 text-white shadow-xs'
                                                            : 'border-slate-200 bg-white text-slate-700 hover:border-indigo-300 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300 dark:hover:border-slate-700'
                                                    }`}
                                                >
                                                    {preset}%{preset === 10 ? ' (Min)' : preset === 100 ? ' (Penuh)' : ''}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                    {errors.dp_percentage && (
                                        <p className="flex items-center gap-1 text-[11px] font-bold text-red-500">
                                            <AlertCircle size={13} />{' '}
                                            {errors.dp_percentage}
                                        </p>
                                    )}
                                </div>

                                {/* 5. Tenggat Waktu (Deadline) */}
                                <div className="space-y-2">
                                    <div className="flex items-center justify-between">
                                        <label className="text-xs font-bold tracking-wider text-slate-700 uppercase dark:text-slate-300">
                                            Tenggat Waktu Pengerjaan (Deadline)
                                        </label>
                                        <span className="text-[11px] font-bold text-indigo-600 dark:text-indigo-400">
                                            Wajib
                                        </span>
                                    </div>
                                    <div className="relative">
                                        <input
                                            type="datetime-local"
                                            required
                                            value={data.deadline}
                                            onChange={(e) =>
                                                setData('deadline', e.target.value)
                                            }
                                            className={`w-full rounded-xl border bg-slate-50/90 py-3 pr-4 pl-11 text-xs font-semibold text-slate-900 focus:bg-white focus:outline-none dark:bg-[#030712] dark:text-white ${
                                                errors.deadline
                                                    ? 'border-red-500 focus:border-red-600'
                                                    : 'border-slate-300 focus:border-indigo-600 dark:border-slate-800'
                                            }`}
                                        />
                                        <Calendar className="absolute top-3 left-4 h-5 w-5 text-slate-500 select-none dark:text-slate-400" />
                                    </div>
                                    {errors.deadline && (
                                        <p className="flex items-center gap-1 text-[11px] font-bold text-red-500">
                                            <AlertCircle size={13} />{' '}
                                            {errors.deadline}
                                        </p>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* RIGHT COLUMN: Sticky Summary & Gamification (4 Cols) */}
                        <div className="space-y-5 lg:sticky lg:top-8 lg:col-span-4">
                            {/* Card 1: Tier & Rewards Classification */}
                            <div className="space-y-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-gradient-to-b dark:from-[#0e0e1a] dark:to-[#090910]">
                                <div className="flex items-center justify-between border-b border-slate-100 pb-3 dark:border-slate-800">
                                    <div className="flex items-center gap-2">
                                        <Sparkles
                                            size={17}
                                            className="text-amber-500"
                                        />
                                        <h3 className="text-xs font-bold text-slate-800 dark:text-slate-200">
                                            Klasifikasi Quest
                                        </h3>
                                    </div>
                                    <span
                                        className={`rounded-full border px-2.5 py-0.5 text-[11px] font-extrabold ${tierColor}`}
                                    >
                                        Tier {tier}
                                    </span>
                                </div>

                                <div>
                                    <p className="text-sm font-bold text-slate-900 dark:text-white">
                                        {tierLabel}
                                    </p>
                                    <p className="mt-1 text-xs leading-relaxed text-slate-500 dark:text-slate-400">
                                        Tier dihitung otomatis berdasarkan batas
                                        maksimal anggaran proyek yang ditentukan.
                                    </p>
                                </div>

                                {/* Rewards Grid */}
                                <div className="space-y-2 pt-1">
                                    <span className="text-[10px] font-bold text-slate-600 uppercase dark:text-slate-400">
                                        Estimasi Hadiah Pekerja
                                    </span>
                                    <div className="grid grid-cols-3 gap-2 text-center">
                                        <div className="flex flex-col items-center rounded-xl border border-slate-100 bg-slate-50/80 p-2.5 dark:border-slate-800 dark:bg-[#030712]">
                                            <Award
                                                size={15}
                                                className="mb-1 text-indigo-500"
                                            />
                                            <span className="text-[9px] font-medium text-slate-400">
                                                XP Kerja
                                            </span>
                                            <span className="text-xs font-extrabold text-slate-900 dark:text-white">
                                                +{calculatedExp}
                                            </span>
                                        </div>
                                        <div className="flex flex-col items-center rounded-xl border border-slate-100 bg-slate-50/80 p-2.5 dark:border-slate-800 dark:bg-[#030712]">
                                            <Coins
                                                size={15}
                                                className="mb-1 text-amber-500"
                                            />
                                            <span className="text-[9px] font-medium text-slate-400">
                                                Gold Token
                                            </span>
                                            <span className="text-xs font-extrabold text-slate-900 dark:text-white">
                                                +{calculatedGold}
                                            </span>
                                        </div>
                                        <div className="flex flex-col items-center rounded-xl border border-slate-100 bg-slate-50/80 p-2.5 dark:border-slate-800 dark:bg-[#030712]">
                                            <ShieldCheck
                                                size={15}
                                                className="mb-1 text-emerald-500"
                                            />
                                            <span className="text-[9px] font-medium text-slate-400">
                                                Reputasi
                                            </span>
                                            <span className="text-xs font-extrabold text-slate-900 dark:text-white">
                                                +{calculatedRep}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                {/* Financial Breakdown */}
                                <div className="space-y-2 border-t border-slate-100 pt-3 dark:border-slate-800">
                                    <span className="text-[10px] font-bold text-slate-600 uppercase dark:text-slate-400">
                                        Struktur Nilai Kontrak
                                    </span>
                                    <div className="space-y-2 rounded-xl border border-slate-100 bg-slate-50/70 p-3.5 text-xs dark:border-slate-800/80 dark:bg-[#030712]/50">
                                        <div className="flex justify-between">
                                            <span className="text-slate-500 dark:text-slate-400">
                                                Total Anggaran:
                                            </span>
                                            <span className="font-bold text-slate-900 dark:text-white">
                                                {formatRupiah(maxBudgetNum)}
                                            </span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-slate-500 dark:text-slate-400">
                                                Uang Muka ({dpPercent}%):
                                            </span>
                                            <span className="font-bold text-indigo-600 dark:text-indigo-400">
                                                {formatRupiah(estimatedDpAmount)}
                                            </span>
                                        </div>
                                        <div className="flex justify-between border-t border-slate-200/60 pt-2 dark:border-slate-800">
                                            <span className="text-slate-500 dark:text-slate-400">
                                                Pelunasan Akhir:
                                            </span>
                                            <span className="font-bold text-emerald-600 dark:text-emerald-400">
                                                {formatRupiah(
                                                    estimatedFinalAmount,
                                                )}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Card 2: Action Buttons */}
                            <div className="space-y-2.5 pt-1">
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 py-3.5 text-xs font-bold text-white shadow-lg shadow-indigo-600/30 transition hover:bg-indigo-700 disabled:opacity-50"
                                >
                                    {processing ? (
                                        <>
                                            <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                                            Menyimpan Perubahan...
                                        </>
                                    ) : (
                                        <>
                                            <Check size={16} />
                                            Simpan Perubahan
                                        </>
                                    )}
                                </button>

                                <Link
                                    href="/admin/quests"
                                    className="flex w-full items-center justify-center rounded-xl border border-slate-200 bg-white py-3 text-xs font-bold text-slate-700 transition hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
                                >
                                    Batal & Kembali
                                </Link>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </AppLayout>
    );
}
