import { Link, useForm } from '@inertiajs/react';
import React, { useRef, useState } from 'react';
import {
    Plus,
    X,
    FileText,
    Calendar,
    Award,
    CloudUpload,
    Coins,
    ShieldCheck,
    Sparkles,
    AlertCircle,
    Info,
    Percent,
} from 'lucide-react';
import PageBackground from '@/components/Student/PageBackground';

export default function Create() {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [dragActive, setDragActive] = useState(false);
    const [attachmentPreviews, setAttachmentPreviews] = useState<{
        images: { name: string; url: string; file: File }[];
        files: { name: string; size: number; file: File }[];
    }>({ images: [], files: [] });

    // Inertia form hook
    const { data, setData, post, processing, errors } = useForm({
        title: '',
        description: '',
        min_budget: '' as number | string,
        max_budget: '' as number | string,
        min_salary: '' as number | string,
        max_salary: '' as number | string,
        dp_percentage: 10 as number | string,
        deadline: '',
        images: [] as File[],
        files: [] as File[],
    });

    // Format bytes for uploaded files
    const formatBytes = (bytes: number) => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const dm = 1;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
    };

    // Format Rupiah currency
    const formatRupiah = (val: number | string | null | undefined): string => {
        const num = typeof val === 'string' ? parseInt(val, 10) || 0 : val || 0;
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

    const handleFileAdd = (filesList: FileList) => {
        const addedFiles = Array.from(filesList);
        const imagesList = [...attachmentPreviews.images];
        const docsList = [...attachmentPreviews.files];

        addedFiles.forEach((file) => {
            if (file.type.startsWith('image/')) {
                const url = URL.createObjectURL(file);
                imagesList.push({ name: file.name, url, file });
            } else {
                docsList.push({ name: file.name, size: file.size, file });
            }
        });

        setAttachmentPreviews({ images: imagesList, files: docsList });

        setData((prev) => ({
            ...prev,
            images: imagesList.map((i) => i.file),
            files: docsList.map((d) => d.file),
        }));
    };

    // Remove file handler
    const handleRemoveFile = (type: 'images' | 'files', idx: number) => {
        const newImages = [...attachmentPreviews.images];
        const newFiles = [...attachmentPreviews.files];

        if (type === 'images') {
            URL.revokeObjectURL(newImages[idx].url);
            newImages.splice(idx, 1);
        } else {
            newFiles.splice(idx, 1);
        }

        setAttachmentPreviews({ images: newImages, files: newFiles });

        setData((prev) => ({
            ...prev,
            images: newImages.map((i) => i.file),
            files: newFiles.map((d) => d.file),
        }));
    };

    const handleDrag = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === 'dragenter' || e.type === 'dragover') {
            setDragActive(true);
        } else if (e.type === 'dragleave') {
            setDragActive(false);
        }
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);
        if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
            handleFileAdd(e.dataTransfer.files);
        }
    };

    // Realtime Calculations
    const minBudgetNum = parseInt(String(data.min_budget), 10) || 0;
    const maxBudgetNum = parseInt(String(data.max_budget), 10) || 0;
    const avgBudgetNum = (minBudgetNum + maxBudgetNum) / 2;
    const dpPercent = Math.max(10, Math.min(100, Number(data.dp_percentage) || 10));

    const estimatedDpAmount = Math.round((maxBudgetNum * dpPercent) / 100);
    const estimatedFinalAmount = Math.max(0, maxBudgetNum - estimatedDpAmount);

    // Gamification Tier matching backend logic
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

    // Minimum datetime allowed (now + 5 mins)
    const minDateTime = new Date(Date.now() + 5 * 60 * 1000)
        .toISOString()
        .slice(0, 16);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/quests', {
            forceFormData: true,
        });
    };

    return (
        <div
            className="relative flex min-h-screen w-full flex-col overflow-x-hidden bg-[#fdfcfc] text-slate-800 transition-colors duration-200 dark:bg-[#020202] dark:text-white"
            style={{ fontFamily: "'Outfit', sans-serif" }}
        >
            <PageBackground />

            {/* HEADER - Gaming style */}
            <div className="w-full flex-shrink-0 px-1 pt-0.5">
                <div
                    className="relative rounded-md p-[2px] md:p-[3px]"
                    style={{
                        backgroundImage:
                            'linear-gradient(to bottom, #3B28F6 0%, #4c2fff 30%, #7c3aed 50%, #facc15 100%)',
                    }}
                >
                    <div className="relative flex items-center justify-between gap-2 rounded-[4px] bg-white px-3 py-3 md:px-6 md:py-4 dark:bg-[#040812]">
                        {/* Back Button */}
                        <Link
                            href="/quests"
                            className="relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded border-2 border-blue-500 bg-blue-100 transition-colors hover:border-blue-600 hover:bg-blue-200 md:h-12 md:w-12 dark:border-blue-800 dark:bg-[#0b1021] dark:hover:border-blue-600 dark:hover:bg-blue-900/40"
                            title="Kembali ke Bursa Quest"
                        >
                            <svg
                                viewBox="0 0 48 48"
                                className="h-7 w-7 scale-125 text-indigo-600 transition-transform duration-200 hover:scale-150 md:h-9 md:w-9 dark:text-indigo-500"
                            >
                                <rect
                                    x="12"
                                    y="20"
                                    width="29"
                                    height="4"
                                    fill="currentColor"
                                />
                                <rect
                                    x="8"
                                    y="20"
                                    width="4"
                                    height="4"
                                    fill="currentColor"
                                />
                                <rect
                                    x="5"
                                    y="20"
                                    width="5"
                                    height="4"
                                    fill="currentColor"
                                />
                                <rect
                                    x="8"
                                    y="16"
                                    width="4"
                                    height="4"
                                    fill="currentColor"
                                />
                                <rect
                                    x="8"
                                    y="24"
                                    width="4"
                                    height="4"
                                    fill="currentColor"
                                />
                                <rect
                                    x="12"
                                    y="12"
                                    width="4"
                                    height="4"
                                    fill="currentColor"
                                />
                                <rect
                                    x="12"
                                    y="28"
                                    width="4"
                                    height="4"
                                    fill="currentColor"
                                />
                                <rect
                                    x="16"
                                    y="8"
                                    width="4"
                                    height="4"
                                    fill="currentColor"
                                />
                                <rect
                                    x="16"
                                    y="32"
                                    width="4"
                                    height="4"
                                    fill="currentColor"
                                />
                            </svg>
                        </Link>

                        {/* Title */}
                        <div className="flex-1 text-center">
                            <h1 className="font-['Orbitron'] text-sm font-black tracking-[0.05em] text-[#1e3a8a] uppercase min-[390px]:text-base min-[390px]:tracking-[0.1em] sm:text-xl md:text-2xl md:tracking-[0.15em] lg:text-3xl dark:text-white">
                                POSTING PROYEK BARU
                            </h1>
                            <p className="mt-0.5 text-[10px] tracking-wider text-slate-500 uppercase md:text-xs dark:text-slate-400">
                                Buat Penugasan Proyek & Cari Rekan Kolaborator Terverifikasi
                            </p>
                        </div>

                        {/* Status Badge */}
                        <div className="hidden shrink-0 items-center gap-2 md:flex">
                            <span className="inline-flex items-center gap-1.5 rounded-full border border-indigo-200 bg-indigo-50 px-3 py-1 text-xs font-bold text-indigo-700 dark:border-indigo-800 dark:bg-indigo-950/50 dark:text-indigo-300">
                                <ShieldCheck size={14} /> Student Client
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="relative z-10 flex min-h-0 w-full max-w-none flex-1 flex-col space-y-6 px-4 py-8 sm:px-6 lg:px-10">
                {/* Form Body Split Layout */}
                <form
                    onSubmit={handleSubmit}
                    className="grid grid-cols-1 items-start gap-8 lg:grid-cols-12"
                >
                    {/* Left Column: Inputs (col-span-8) */}
                    <div className="space-y-6 lg:col-span-8">
                        <div className="space-y-6 rounded-2xl border border-slate-300 bg-white p-6 shadow-sm dark:border-slate-800/80 dark:bg-gradient-to-b dark:from-[#0e0e1a] dark:to-[#090910]">
                            {/* 1. Input: Judul Proyek */}
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
                                    placeholder="Contoh: Pembuatan UI/UX Aplikasi E-Learning Sederhana"
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

                            {/* 2. Input: Deskripsi & Spesifikasi Penugasan */}
                            <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                    <label className="text-xs font-bold tracking-wider text-slate-700 uppercase dark:text-slate-300">
                                        Deskripsi & Spesifikasi Deliverables
                                    </label>
                                    <span className="text-[11px] text-slate-400">
                                        {data.description.length} Karakter
                                    </span>
                                </div>
                                <textarea
                                    required
                                    rows={10}
                                    placeholder="Tuliskan secara detail mengenai kebutuhan proyek, deliverables yang diharapkan, repositori acuan, serta instruksi kriteria peninjauan pengerjaan..."
                                    value={data.description}
                                    onChange={(e) =>
                                        setData('description', e.target.value)
                                    }
                                    className={`w-full min-h-[220px] rounded-xl border bg-slate-50/90 p-4 text-xs font-semibold leading-relaxed text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none dark:bg-[#030712] dark:text-white dark:placeholder:text-slate-500 ${
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

                            {/* 3. Input: Rentang Anggaran (Min - Max Budget) */}
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

                            {/* 4. Input: Uang Muka (DP) */}
                            <div className="space-y-3 rounded-2xl border border-indigo-100 bg-indigo-50/40 p-4.5 dark:border-slate-800 dark:bg-[#030712]">
                                <div className="flex items-center justify-between">
                                    <label className="flex items-center gap-1.5 text-xs font-bold tracking-wider text-indigo-700 uppercase dark:text-indigo-400">
                                        <Percent size={15} /> Persentase Uang Muka (DP)
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
                                                    &bull; Pelunasan Akhir:{' '}
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

                            {/* 5. Input: Deadline */}
                            <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                    <label className="text-xs font-bold tracking-wider text-slate-700 uppercase dark:text-slate-300">
                                        Batas Tenggat Waktu (Deadline)
                                    </label>
                                    <span className="text-[11px] font-bold text-indigo-600 dark:text-indigo-400">
                                        Wajib
                                    </span>
                                </div>
                                <div className="relative">
                                    <input
                                        type="datetime-local"
                                        required
                                        min={minDateTime}
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
                                <span className="text-[11px] text-slate-500 dark:text-slate-400">
                                    Tentukan batas waktu pengerjaan final yang realistis bagi pelamar proyek.
                                </span>
                                {errors.deadline && (
                                    <p className="flex items-center gap-1 text-[11px] font-bold text-red-500">
                                        <AlertCircle size={13} />{' '}
                                        {errors.deadline}
                                    </p>
                                )}
                            </div>

                            {/* 6. Uploader Referensi Berkas */}
                            <div className="space-y-3">
                                <label className="text-xs font-bold tracking-wider text-slate-700 uppercase dark:text-slate-300">
                                    Lampiran Referensi File & Gambar
                                </label>

                                <div
                                    onDragEnter={handleDrag}
                                    onDragOver={handleDrag}
                                    onDragLeave={handleDrag}
                                    onDrop={handleDrop}
                                    onClick={() =>
                                        fileInputRef.current?.click()
                                    }
                                    className={`flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed p-6 text-center transition-all ${
                                        dragActive
                                            ? 'border-indigo-600 bg-indigo-50/50 dark:border-indigo-500 dark:bg-indigo-950/20'
                                            : 'border-slate-300 bg-slate-50/50 hover:border-indigo-400 hover:bg-slate-100/50 dark:border-slate-800 dark:bg-[#030712] dark:hover:border-slate-700'
                                    }`}
                                >
                                    <input
                                        ref={fileInputRef}
                                        type="file"
                                        multiple
                                        onChange={(e) =>
                                            e.target.files &&
                                            handleFileAdd(e.target.files)
                                        }
                                        className="hidden"
                                    />
                                    <CloudUpload className="mb-2 h-8 w-8 text-indigo-600 dark:text-indigo-400" />
                                    <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                                        Klik untuk unggah berkas, atau seret file ke sini
                                    </span>
                                    <span className="mt-1 text-[10px] font-medium text-slate-500 dark:text-slate-400">
                                        Format didukung: PNG, JPG, WEBP, PDF, DOCX, ZIP (Maks 10MB)
                                    </span>
                                </div>

                                {/* Previews List */}
                                {(attachmentPreviews.images.length > 0 ||
                                    attachmentPreviews.files.length > 0) && (
                                    <div className="space-y-3 rounded-xl border border-slate-200 p-4 dark:border-slate-800 dark:bg-[#030712]/40">
                                        {/* Images Preview Grid */}
                                        {attachmentPreviews.images.length >
                                            0 && (
                                            <div className="space-y-2">
                                                <span className="text-[11px] font-bold text-slate-600 uppercase dark:text-slate-400">
                                                    Gambar Terlampir ({attachmentPreviews.images.length})
                                                </span>
                                                <div className="grid grid-cols-3 gap-3 sm:grid-cols-4 md:grid-cols-6">
                                                    {attachmentPreviews.images.map(
                                                        (img, idx) => (
                                                            <div
                                                                key={`img_${idx}`}
                                                                className="group relative aspect-square overflow-hidden rounded-xl border border-slate-200 bg-slate-100 dark:border-slate-800 dark:bg-slate-900"
                                                            >
                                                                <img
                                                                    src={img.url}
                                                                    alt={img.name}
                                                                    className="h-full w-full object-cover"
                                                                />
                                                                <button
                                                                    type="button"
                                                                    onClick={(e) => {
                                                                        e.stopPropagation();
                                                                        handleRemoveFile(
                                                                            'images',
                                                                            idx,
                                                                        );
                                                                    }}
                                                                    className="absolute top-1.5 right-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-rose-600 text-white shadow-sm transition hover:bg-rose-700"
                                                                    title="Hapus gambar"
                                                                >
                                                                    <X size={12} />
                                                                </button>
                                                            </div>
                                                        ),
                                                    )}
                                                </div>
                                            </div>
                                        )}

                                        {/* Documents List */}
                                        {attachmentPreviews.files.length >
                                            0 && (
                                            <div className="space-y-2">
                                                <span className="text-[11px] font-bold text-slate-600 uppercase dark:text-slate-400">
                                                    Dokumen Referensi ({attachmentPreviews.files.length})
                                                </span>
                                                <div className="space-y-1.5">
                                                    {attachmentPreviews.files.map(
                                                        (fileItem, idx) => (
                                                            <div
                                                                key={`file_${idx}`}
                                                                className="flex items-center justify-between rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-xs dark:border-slate-800 dark:bg-[#0d1117]"
                                                            >
                                                                <div className="flex min-w-0 items-center gap-2">
                                                                    <FileText className="h-4 w-4 shrink-0 text-indigo-600 dark:text-indigo-400" />
                                                                    <span className="truncate font-semibold text-slate-800 dark:text-slate-200">
                                                                        {fileItem.name}
                                                                    </span>
                                                                    <span className="shrink-0 text-[10px] text-slate-400">
                                                                        ({formatBytes(fileItem.size)})
                                                                    </span>
                                                                </div>
                                                                <button
                                                                    type="button"
                                                                    onClick={() =>
                                                                        handleRemoveFile(
                                                                            'files',
                                                                            idx,
                                                                        )
                                                                    }
                                                                    className="text-slate-400 transition hover:text-rose-500"
                                                                    title="Hapus berkas"
                                                                >
                                                                    <X size={15} />
                                                                </button>
                                                            </div>
                                                        ),
                                                    )}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Sticky Summary & Gamification (col-span-4) */}
                    <div className="space-y-5 lg:sticky lg:top-8 lg:col-span-4">
                        {/* Card 1: Tier & Rewards Classification */}
                        <div className="space-y-4 rounded-2xl border border-slate-300 bg-white p-5 shadow-sm dark:border-slate-800/80 dark:bg-gradient-to-b dark:from-[#0e0e1a] dark:to-[#090910]">
                            <div className="flex items-center justify-between border-b border-slate-100 pb-3 dark:border-slate-800">
                                <div className="flex items-center gap-2">
                                    <Sparkles
                                        size={17}
                                        className="text-amber-500"
                                    />
                                    <h3 className="font-['Orbitron'] text-xs font-bold text-slate-800 uppercase dark:text-slate-200">
                                        Klasifikasi Quest
                                    </h3>
                                </div>
                                <span
                                    className={`rounded-full border px-2.5 py-0.5 font-['Orbitron'] text-[11px] font-extrabold ${tierColor}`}
                                >
                                    Tier {tier}
                                </span>
                            </div>

                            <div>
                                <p className="text-sm font-bold text-slate-900 dark:text-white">
                                    {tierLabel}
                                </p>
                                <p className="mt-1 text-xs leading-relaxed text-slate-500 dark:text-slate-400">
                                    Tier dan poin reputasi dihitung secara otomatis berdasarkan batas maksimal penawaran anggaran proyek.
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

                        {/* Card 2: Platform Review Notice */}
                        <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-4 text-xs leading-relaxed text-slate-600 dark:border-slate-800 dark:bg-[#030712]/40 dark:text-slate-400">
                            <Info
                                size={15}
                                className="-mt-0.5 mr-1.5 inline text-indigo-500"
                            />
                            Proyek yang dikirim akan melalui verifikasi kurasi Administrator terlebih dahulu sebelum tayang aktif di Bursa Quest agar mutu pengerjaan terjamin.
                        </div>

                        {/* Card 3: Action Buttons */}
                        <div className="space-y-2.5 pt-1">
                            <button
                                type="submit"
                                disabled={processing}
                                className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-indigo-600 py-3.5 font-['Orbitron'] text-xs font-bold text-white shadow-lg shadow-indigo-600/30 transition hover:bg-indigo-700 disabled:opacity-50"
                            >
                                {processing ? (
                                    <>
                                        <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                                        Memproses...
                                    </>
                                ) : (
                                    <>
                                        <Plus className="h-4.5 w-4.5 stroke-[3]" />
                                        Posting Lowongan Proyek
                                    </>
                                )}
                            </button>

                            <Link
                                href="/quests"
                                className="flex w-full items-center justify-center rounded-xl border border-slate-200 bg-white py-3 font-['Orbitron'] text-xs font-bold text-slate-700 uppercase transition hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
                            >
                                Batal & Kembali
                            </Link>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
}
