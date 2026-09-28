import { Link, useForm } from '@inertiajs/react';
import React, { useRef, useState } from 'react';
import {
    X,
    FileText,
    Calendar,
    CloudUpload,
    Save,
    RotateCcw,
    ShieldAlert,
    AlertCircle,
    CheckCircle2,
    ArrowLeft,
    File as FileIcon,
    Download,
    Sparkles,
    ShieldCheck,
    Coins,
    Award,
    Percent,
    Info,
} from 'lucide-react';
import PageBackground from '@/components/Student/PageBackground';

interface ExistingAttachment {
    name: string;
    path: string;
    url: string;
    size?: number;
}

interface QuestEditProps {
    quest: {
        _id: string;
        id?: string;
        slug?: string;
        title: string;
        description: string;
        min_budget: number;
        max_budget: number;
        min_salary?: number;
        max_salary?: number;
        dp_percentage?: number;
        deadline: string;
        status: string;
        rejection_note?: string;
        images?: ExistingAttachment[];
        files?: ExistingAttachment[];
    };
}

export default function Edit({ quest }: QuestEditProps) {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [dragActive, setDragActive] = useState(false);

    const [existingImages, setExistingImages] = useState<ExistingAttachment[]>(
        quest.images || [],
    );
    const [existingFiles, setExistingFiles] = useState<ExistingAttachment[]>(
        quest.files || [],
    );

    const [newAttachmentPreviews, setNewAttachmentPreviews] = useState<{
        images: { name: string; url: string; file: File }[];
        files: { name: string; size: number; file: File }[];
    }>({ images: [], files: [] });

    // Inertia form hook
    const { data, setData, post, processing, errors } = useForm({
        _method: 'put',
        title: quest.title || '',
        description: quest.description || '',
        min_budget: (quest.min_budget || quest.min_salary || '') as number | string,
        max_budget: (quest.max_budget || quest.max_salary || '') as number | string,
        min_salary: (quest.min_budget || quest.min_salary || '') as number | string,
        max_salary: (quest.max_budget || quest.max_salary || '') as number | string,
        dp_percentage: (quest.dp_percentage || 10) as number | string,
        deadline: quest.deadline
            ? quest.deadline.includes('T')
                ? quest.deadline.slice(0, 16)
                : quest.deadline
            : '',
        retained_images: (quest.images || []).map((i) => i.path),
        retained_files: (quest.files || []).map((f) => f.path),
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

    const handleRemoveExistingImage = (path: string) => {
        const updated = existingImages.filter((img) => img.path !== path);
        setExistingImages(updated);
        const retainedPaths = updated.map((i) => i.path);
        setData('retained_images', retainedPaths);
    };

    const handleRemoveExistingFile = (path: string) => {
        const updated = existingFiles.filter((f) => f.path !== path);
        setExistingFiles(updated);
        const retainedPaths = updated.map((f) => f.path);
        setData('retained_files', retainedPaths);
    };

    const handleFileAdd = (filesList: FileList) => {
        const addedFiles = Array.from(filesList);
        const imagesList = [...newAttachmentPreviews.images];
        const docsList = [...newAttachmentPreviews.files];

        addedFiles.forEach((file) => {
            if (file.type.startsWith('image/')) {
                const url = URL.createObjectURL(file);
                imagesList.push({ name: file.name, url, file });
            } else {
                docsList.push({ name: file.name, size: file.size, file });
            }
        });

        setNewAttachmentPreviews({ images: imagesList, files: docsList });

        setData((prev) => ({
            ...prev,
            images: imagesList.map((i) => i.file),
            files: docsList.map((d) => d.file),
        }));
    };

    const handleRemoveNewFile = (type: 'images' | 'files', idx: number) => {
        const newImages = [...newAttachmentPreviews.images];
        const newFiles = [...newAttachmentPreviews.files];

        if (type === 'images') {
            URL.revokeObjectURL(newImages[idx].url);
            newImages.splice(idx, 1);
        } else {
            newFiles.splice(idx, 1);
        }

        setNewAttachmentPreviews({ images: newImages, files: newFiles });

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

    // Minimum datetime allowed (now + 5 mins)
    const minDateTime = new Date(Date.now() + 5 * 60 * 1000)
        .toISOString()
        .slice(0, 16);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(`/quests/${quest.slug || quest.id || quest._id}/update`, {
            forceFormData: true,
        });
    };

    const isRejected = quest.status === 'rejected';

    return (
        <div
            className="relative flex min-h-screen w-full flex-col overflow-x-hidden bg-[#fdfcfc] text-slate-800 transition-colors duration-200 dark:bg-[#020202] dark:text-white"
            style={{ fontFamily: "'Outfit', sans-serif" }}
        >
            <PageBackground />

            {/* HEADER SECTION */}
            <div className="w-full flex-shrink-0 px-1 pt-0.5">
                <div
                    className="relative rounded-md p-[2px] md:p-[3px]"
                    style={{
                        backgroundImage: isRejected
                            ? 'linear-gradient(to bottom, #dc2626 0%, #ef4444 40%, #f97316 80%, #facc15 100%)'
                            : 'linear-gradient(to bottom, #3B28F6 0%, #4c2fff 30%, #7c3aed 50%, #facc15 100%)',
                    }}
                >
                    <div className="relative flex items-center justify-between gap-2 rounded-[4px] bg-white px-3 py-3 md:px-6 md:py-4 dark:bg-[#040812]">
                        {/* Back Button */}
                        <Link
                            href={`/quests/${quest.slug || quest.id || quest._id}`}
                            className="relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-slate-200 bg-slate-50 text-slate-700 transition-all hover:bg-slate-100 dark:border-slate-800 dark:bg-[#0b1021] dark:text-slate-300 dark:hover:bg-slate-800"
                            title="Kembali ke Detail Quest"
                        >
                            <ArrowLeft className="h-5 w-5" />
                        </Link>

                        {/* Title */}
                        <div className="flex-1 text-center">
                            <h1 className="font-['Orbitron'] text-xs font-black tracking-[0.05em] text-slate-900 uppercase min-[390px]:text-sm sm:text-lg md:text-xl lg:text-2xl dark:text-white">
                                {isRejected
                                    ? 'PERBAIKI & AJUKAN ULANG PROYEK'
                                    : 'EDIT DRAF PENUGASAN PROYEK'}
                            </h1>
                            <p className="mt-0.5 text-[10px] tracking-wider text-slate-500 uppercase md:text-xs dark:text-slate-400">
                                {isRejected
                                    ? 'SESUAIKAN RINCIAN SESUAI CATATAN ADMINISTRATOR SEBELUM TAYANG DI BURSA'
                                    : 'PERBARUI PARAMETER DAN LAMPIRAN DRAF PROYEK'}
                            </p>
                        </div>

                        {/* Status Badge */}
                        <div className="hidden shrink-0 items-center gap-2 md:flex">
                            <span
                                className={`rounded-xl px-3 py-1.5 font-['Orbitron'] text-xs font-black tracking-wider uppercase shadow-xs ${
                                    isRejected
                                        ? 'border border-red-200 bg-red-100/80 text-red-700 dark:border-red-900/60 dark:bg-red-950/60 dark:text-red-300'
                                        : 'border border-amber-200 bg-amber-100/80 text-amber-800 dark:border-amber-900/60 dark:bg-amber-950/60 dark:text-amber-300'
                                }`}
                            >
                                {isRejected ? 'DITOLAK ADMIN' : 'DRAF PROYEK'}
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            {/* MAIN CONTENT AREA */}
            <div className="relative z-10 flex min-h-0 w-full max-w-none flex-1 flex-col space-y-6 px-4 py-8 sm:px-6 lg:px-10">
                {/* SPECIAL PROMINENT REJECTION BANNER (When Rejected by Admin) */}
                {isRejected && (
                    <div className="relative overflow-hidden rounded-2xl border-2 border-red-500/80 bg-gradient-to-br from-red-50 via-white to-red-50/40 p-5 shadow-lg dark:border-red-600/70 dark:from-red-950/50 dark:via-[#090b14] dark:to-red-950/30 md:p-6">
                        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                            <div className="flex items-start gap-4">
                                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-red-600 text-white shadow-md shadow-red-500/20 dark:bg-red-600">
                                    <ShieldAlert className="h-6 w-6" />
                                </div>
                                <div className="space-y-2">
                                    <div className="flex flex-wrap items-center gap-2">
                                        <h2 className="font-['Orbitron'] text-sm font-black tracking-wider text-red-900 uppercase dark:text-red-200 md:text-base">
                                            Pengajuan Proyek Ditolak Administrator
                                        </h2>
                                        <span className="rounded-full bg-red-200/70 px-2.5 py-0.5 text-[10px] font-bold text-red-800 dark:bg-red-900/60 dark:text-red-200">
                                            Perlu Tindakan Perbaikan
                                        </span>
                                    </div>

                                    {/* Exact Admin Feedback Box */}
                                    <div className="relative rounded-xl border border-red-200/90 bg-white/90 p-4 shadow-xs dark:border-red-900/60 dark:bg-[#0c101c]">
                                        <div className="flex items-center gap-1.5 text-[10px] font-bold tracking-wider text-red-600 uppercase dark:text-red-400">
                                            <AlertCircle className="h-3.5 w-3.5" />
                                            Catatan Alasan Penolakan dari Admin:
                                        </div>
                                        <p className="mt-1.5 text-xs font-semibold leading-relaxed whitespace-pre-wrap text-slate-800 dark:text-slate-200">
                                            {quest.rejection_note ||
                                                'Deskripsi, ruang lingkup pengerjaan, atau penawaran anggaran belum memenuhi standar kurasi. Silakan lengkapi detail dan berkas pendukung.'}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Workflow Stepper Mini Guide */}
                            <div className="rounded-xl border border-red-200/60 bg-red-100/40 p-3 text-xs dark:border-red-900/40 dark:bg-red-950/40 lg:max-w-xs">
                                <span className="block font-['Orbitron'] text-[10px] font-black tracking-wider text-red-800 uppercase dark:text-red-300">
                                    Alur Verifikasi Ulang:
                                </span>
                                <ul className="mt-2 space-y-1.5 text-[11px] text-slate-700 dark:text-slate-300">
                                    <li className="flex items-center gap-1.5 font-bold text-red-600 dark:text-red-400">
                                        <span className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-red-600 text-[9px] font-black text-white">
                                            1
                                        </span>
                                        Ditolak Admin (Saat Ini)
                                    </li>
                                    <li className="flex items-center gap-1.5 font-semibold text-slate-800 dark:text-slate-200">
                                        <span className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-amber-500 text-[9px] font-black text-white">
                                            2
                                        </span>
                                        Perbaiki Data & Unggah Berkas
                                    </li>
                                    <li className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400">
                                        <span className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-slate-300 text-[9px] font-black text-slate-700 dark:bg-slate-700 dark:text-slate-300">
                                            3
                                        </span>
                                        Admin Memverifikasi Ulang
                                    </li>
                                    <li className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400">
                                        <span className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-slate-300 text-[9px] font-black text-slate-700 dark:bg-slate-700 dark:text-slate-300">
                                            4
                                        </span>
                                        Tayang Aktif di Bursa Quest
                                    </li>
                                </ul>
                            </div>
                        </div>

                        {/* Practical Action Tips */}
                        <div className="mt-4 border-t border-red-200/80 pt-3 dark:border-red-900/60">
                            <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-[11px] font-medium text-red-700 dark:text-red-300">
                                <span className="flex items-center gap-1.5">
                                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
                                    Perjelas kriteria deliverable & hasil akhir
                                </span>
                                <span className="flex items-center gap-1.5">
                                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
                                    Pastikan rentang anggaran proporsional
                                </span>
                                <span className="flex items-center gap-1.5">
                                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
                                    Sertakan dokumen referensi / aset pendukung
                                </span>
                            </div>
                        </div>
                    </div>
                )}

                {/* FORM BODY SPLIT LAYOUT */}
                <form
                    onSubmit={handleSubmit}
                    className="grid grid-cols-1 items-start gap-8 lg:grid-cols-12"
                >
                    {/* LEFT COLUMN: FORM INPUTS (col-span-8) */}
                    <div className="space-y-6 lg:col-span-8">
                        {/* CARD 1: INFORMASI UTAMA */}
                        <div className="space-y-6 rounded-2xl border border-slate-300 bg-white p-6 shadow-sm dark:border-slate-800/80 dark:bg-gradient-to-b dark:from-[#0e0e1a] dark:to-[#090910]">
                            <div className="flex items-center justify-between border-b border-slate-100 pb-3 dark:border-slate-800">
                                <h3 className="flex items-center gap-2 font-['Orbitron'] text-xs font-bold tracking-wider text-slate-800 uppercase dark:text-slate-200">
                                    <FileText className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
                                    Informasi Utama Penugasan
                                </h3>
                                {isRejected && (
                                    <span className="text-[10px] font-bold text-amber-600 dark:text-amber-400">
                                        Periksa kembali kesesuaian judul & deskripsi
                                    </span>
                                )}
                            </div>

                            {/* Input: Judul Proyek */}
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
                                    placeholder="Contoh: Pembuatan Landing Page Startup EdTech"
                                    value={data.title}
                                    onChange={(e) => setData('title', e.target.value)}
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

                            {/* Input: Deskripsi */}
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
                                    placeholder="Tuliskan secara komprehensif spesifikasi proyek, deliverables yang diharapkan, repositori acuan, serta kriteria evaluasi penugasan..."
                                    value={data.description}
                                    onChange={(e) => setData('description', e.target.value)}
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
                        </div>

                        {/* CARD 2: ANGGARAN & DEADLINE */}
                        <div className="space-y-6 rounded-2xl border border-slate-300 bg-white p-6 shadow-sm dark:border-slate-800/80 dark:bg-gradient-to-b dark:from-[#0e0e1a] dark:to-[#090910]">
                            <div className="border-b border-slate-100 pb-3 dark:border-slate-800">
                                <h3 className="flex items-center gap-2 font-['Orbitron'] text-xs font-bold tracking-wider text-slate-800 uppercase dark:text-slate-200">
                                    <span className="font-extrabold text-emerald-600 dark:text-emerald-400">Rp</span>
                                    Anggaran & Tenggat Waktu
                                </h3>
                            </div>

                            {/* Input: Anggaran (Salary) */}
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
                                            value={formatNumberWithDots(data.min_budget)}
                                            onChange={(e) => {
                                                const raw = e.target.value.replace(/\D/g, '');
                                                const val = raw ? parseInt(raw, 10) : '';
                                                setData((prev) => ({
                                                    ...prev,
                                                    min_budget: val,
                                                    min_salary: val,
                                                }));
                                            }}
                                            className={`w-full rounded-xl border bg-slate-50/90 py-3 pr-4 pl-11 text-xs font-semibold text-slate-900 focus:bg-white focus:outline-none dark:bg-[#030712] dark:text-white ${
                                                errors.min_budget || errors.min_salary
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
                                    {(errors.min_budget || errors.min_salary) && (
                                        <p className="flex items-center gap-1 text-[11px] font-bold text-red-500">
                                            <AlertCircle size={13} />{' '}
                                            {errors.min_budget || errors.min_salary}
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
                                            value={formatNumberWithDots(data.max_budget)}
                                            onChange={(e) => {
                                                const raw = e.target.value.replace(/\D/g, '');
                                                const val = raw ? parseInt(raw, 10) : '';
                                                setData((prev) => ({
                                                    ...prev,
                                                    max_budget: val,
                                                    max_salary: val,
                                                }));
                                            }}
                                            className={`w-full rounded-xl border bg-slate-50/90 py-3 pr-4 pl-11 text-xs font-semibold text-slate-900 focus:bg-white focus:outline-none dark:bg-[#030712] dark:text-white ${
                                                errors.max_budget || errors.max_salary
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
                                    {(errors.max_budget || errors.max_salary) && (
                                        <p className="flex items-center gap-1 text-[11px] font-bold text-red-500">
                                            <AlertCircle size={13} />{' '}
                                            {errors.max_budget || errors.max_salary}
                                        </p>
                                    )}
                                </div>
                            </div>

                            {/* Input: Uang Muka (DP) */}
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
                                                        {formatRupiah(estimatedDpAmount)}
                                                    </strong>{' '}
                                                    &bull; Pelunasan Akhir:{' '}
                                                    <strong className="text-emerald-600 dark:text-emerald-400">
                                                        {formatRupiah(estimatedFinalAmount)}
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

                            {/* Input: Deadline */}
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
                                        onChange={(e) => setData('deadline', e.target.value)}
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
                        </div>

                        {/* CARD 3: MANAJEMEN LAMPIRAN & BERKAS */}
                        <div className="space-y-6 rounded-2xl border border-slate-300 bg-white p-6 shadow-sm dark:border-slate-800/80 dark:bg-gradient-to-b dark:from-[#0e0e1a] dark:to-[#090910]">
                            <div className="border-b border-slate-100 pb-3 dark:border-slate-800">
                                <h3 className="flex items-center gap-2 font-['Orbitron'] text-xs font-bold tracking-wider text-slate-800 uppercase dark:text-slate-200">
                                    <CloudUpload className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
                                    Lampiran & Berkas Pendukung
                                </h3>
                                <p className="mt-0.5 text-[11px] text-slate-500 dark:text-slate-400">
                                    Pertahankan berkas sebelumnya atau tambahkan referensi baru untuk memperjelas kebutuhan proyek.
                                </p>
                            </div>

                            {/* Existing Images */}
                            {existingImages.length > 0 && (
                                <div className="space-y-2">
                                    <span className="text-[11px] font-bold text-slate-600 uppercase dark:text-slate-400">
                                        Gambar Tersimpan ({existingImages.length})
                                    </span>
                                    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                                        {existingImages.map((img, idx) => (
                                            <div
                                                key={idx}
                                                className="group relative overflow-hidden rounded-xl border border-slate-200 bg-slate-50/80 p-1.5 transition-all dark:border-slate-800 dark:bg-[#0c101c]"
                                            >
                                                <img
                                                    src={img.url}
                                                    alt={img.name}
                                                    className="h-24 w-full rounded-lg object-cover"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => handleRemoveExistingImage(img.path)}
                                                    title="Hapus gambar ini"
                                                    className="absolute top-2.5 right-2.5 flex h-6 w-6 items-center justify-center rounded-full bg-red-600 text-white shadow-sm transition-transform hover:scale-110"
                                                >
                                                    <X className="h-3.5 w-3.5" />
                                                </button>
                                                <span className="mt-1 block truncate text-center text-[10px] text-slate-600 dark:text-slate-400">
                                                    {img.name}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Existing Files */}
                            {existingFiles.length > 0 && (
                                <div className="space-y-2">
                                    <span className="text-[11px] font-bold text-slate-600 uppercase dark:text-slate-400">
                                        Dokumen & Berkas Tersimpan ({existingFiles.length})
                                    </span>
                                    <div className="space-y-2">
                                        {existingFiles.map((file, idx) => (
                                            <div
                                                key={idx}
                                                className="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50/80 px-3.5 py-2.5 text-xs dark:border-slate-800 dark:bg-[#0c101c]"
                                            >
                                                <div className="flex items-center gap-2 truncate">
                                                    <FileIcon className="h-4 w-4 shrink-0 text-indigo-500" />
                                                    <span className="truncate font-semibold text-slate-800 dark:text-slate-200">
                                                        {file.name}
                                                    </span>
                                                    {file.size ? (
                                                        <span className="text-[10px] text-slate-400">
                                                            ({formatBytes(file.size)})
                                                        </span>
                                                    ) : null}
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    {file.url && (
                                                        <a
                                                            href={file.url}
                                                            target="_blank"
                                                            rel="noreferrer"
                                                            download
                                                            className="flex h-7 w-7 items-center justify-center rounded-lg bg-slate-200 text-slate-700 transition-colors hover:bg-slate-300 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
                                                            title="Unduh Berkas"
                                                        >
                                                            <Download className="h-3.5 w-3.5" />
                                                        </a>
                                                    )}
                                                    <button
                                                        type="button"
                                                        onClick={() => handleRemoveExistingFile(file.path)}
                                                        title="Hapus berkas ini"
                                                        className="flex h-7 w-7 items-center justify-center rounded-lg bg-red-100 text-red-600 transition-colors hover:bg-red-200 dark:bg-red-950/60 dark:text-red-400 dark:hover:bg-red-900"
                                                    >
                                                        <X className="h-3.5 w-3.5" />
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Drag & Drop Upload Zone for New Attachments */}
                            <div className="space-y-2">
                                <label className="text-xs font-bold tracking-wider text-slate-700 uppercase dark:text-slate-300">
                                    Tambah Berkas / Gambar Baru
                                </label>
                                <div
                                    onDragEnter={handleDrag}
                                    onDragLeave={handleDrag}
                                    onDragOver={handleDrag}
                                    onDrop={handleDrop}
                                    onClick={() => fileInputRef.current?.click()}
                                    className={`flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed p-6 text-center transition-all ${
                                        dragActive
                                            ? 'border-indigo-600 bg-indigo-50/50 dark:border-indigo-500 dark:bg-indigo-950/20'
                                            : 'border-slate-300 bg-slate-50/50 hover:border-indigo-400 hover:bg-slate-100/50 dark:border-slate-800 dark:bg-[#040812] dark:hover:border-slate-700'
                                    }`}
                                >
                                    <CloudUpload className="h-8 w-8 text-indigo-600 dark:text-indigo-400" />
                                    <p className="mt-2 text-xs font-bold text-slate-800 dark:text-slate-200">
                                        Klik atau seret berkas baru ke sini
                                    </p>
                                    <p className="mt-1 text-[10px] text-slate-400">
                                        Format didukung: PNG, JPG, WEBP, PDF, DOCX, ZIP (Maks 10MB per file)
                                    </p>
                                    <input
                                        ref={fileInputRef}
                                        type="file"
                                        multiple
                                        onChange={(e) =>
                                            e.target.files && handleFileAdd(e.target.files)
                                        }
                                        className="hidden"
                                    />
                                </div>
                            </div>

                            {/* Previews of Newly Added Files */}
                            {(newAttachmentPreviews.images.length > 0 ||
                                newAttachmentPreviews.files.length > 0) && (
                                <div className="space-y-3 pt-2">
                                    <span className="text-[11px] font-bold text-slate-600 uppercase dark:text-slate-400">
                                        Berkas Baru Siap Diunggah:
                                    </span>

                                    {newAttachmentPreviews.images.length > 0 && (
                                        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                                            {newAttachmentPreviews.images.map((img, idx) => (
                                                <div
                                                    key={idx}
                                                    className="group relative overflow-hidden rounded-xl border border-indigo-200 bg-indigo-50/30 p-1.5 dark:border-indigo-900/40"
                                                >
                                                    <img
                                                        src={img.url}
                                                        alt={img.name}
                                                        className="h-20 w-full rounded-lg object-cover"
                                                    />
                                                    <button
                                                        type="button"
                                                        onClick={() => handleRemoveNewFile('images', idx)}
                                                        className="absolute top-2.5 right-2.5 flex h-5 w-5 items-center justify-center rounded-full bg-red-600 text-white shadow-xs"
                                                    >
                                                        <X className="h-3 w-3" />
                                                    </button>
                                                    <span className="mt-1 block truncate text-center text-[10px] text-indigo-950 dark:text-indigo-200">
                                                        {img.name}
                                                    </span>
                                                </div>
                                            ))}
                                        </div>
                                    )}

                                    {newAttachmentPreviews.files.length > 0 && (
                                        <div className="space-y-2">
                                            {newAttachmentPreviews.files.map((file, idx) => (
                                                <div
                                                    key={idx}
                                                    className="flex items-center justify-between rounded-xl border border-indigo-200 bg-indigo-50/30 px-3.5 py-2 text-xs dark:border-indigo-900/40"
                                                >
                                                    <span className="truncate font-semibold text-slate-800 dark:text-slate-200">
                                                        {file.name} ({formatBytes(file.size)})
                                                    </span>
                                                    <button
                                                        type="button"
                                                        onClick={() => handleRemoveNewFile('files', idx)}
                                                        className="text-red-500 transition-colors hover:text-red-700"
                                                    >
                                                        <X className="h-4 w-4" />
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* RIGHT COLUMN: REWARDS ESTIMATOR & ACTION SIDEBAR (col-span-4) */}
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

                        {/* REVISION GUIDELINES CARD */}
                        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800/80 dark:bg-gradient-to-b dark:from-[#0e0e1a] dark:to-[#090910]">
                            <h4 className="flex items-center gap-2 font-['Orbitron'] text-xs font-bold tracking-wider text-slate-800 uppercase dark:text-slate-200">
                                <Sparkles className="h-4 w-4 text-amber-500" />
                                Tips Sukses Kurasi Admin
                            </h4>
                            <ul className="mt-3 space-y-2 text-xs leading-relaxed text-slate-600 dark:text-slate-400">
                                <li className="flex items-start gap-2">
                                    <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-indigo-500" />
                                    <span>
                                        Gunakan judul yang ringkas, spesifik, dan tidak ambigu.
                                    </span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-indigo-500" />
                                    <span>
                                        Rincikan format deliverable akhir (contoh: ZIP, GitHub, link Figma).
                                    </span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-indigo-500" />
                                    <span>
                                        Tetapkan tenggat waktu yang realistis agar pengerja dapat menyelesaikan proyek dengan prima.
                                    </span>
                                </li>
                            </ul>
                        </div>

                        {/* ACTION SUBMIT CARD */}
                        <div className="space-y-2.5 pt-1">
                            <button
                                type="submit"
                                disabled={processing}
                                className={`flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl py-3.5 font-['Orbitron'] text-xs font-black tracking-wider text-white uppercase shadow-md transition-all duration-300 disabled:opacity-50 ${
                                    isRejected
                                        ? 'bg-gradient-to-r from-red-600 via-red-500 to-amber-600 hover:from-red-500 hover:to-amber-500 shadow-red-500/20'
                                        : 'bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-500 hover:to-indigo-600 shadow-indigo-500/20'
                                }`}
                            >
                                {processing ? (
                                    <>
                                        <RotateCcw className="h-4 w-4 animate-spin" />
                                        Menyimpan & Mengirim...
                                    </>
                                ) : isRejected ? (
                                    <>
                                        <RotateCcw className="h-4 w-4" />
                                        Kirim Ulang ke Admin
                                    </>
                                ) : (
                                    <>
                                        <Save className="h-4 w-4" />
                                        Simpan Perubahan
                                    </>
                                )}
                            </button>

                            <Link
                                href={`/quests/${quest.slug || quest.id || quest._id}`}
                                className="flex w-full items-center justify-center rounded-xl border border-slate-200 bg-white py-3 font-['Orbitron'] text-xs font-bold tracking-wider text-slate-700 uppercase transition-colors hover:bg-slate-100 dark:border-slate-800 dark:bg-[#0b1021] dark:text-slate-300 dark:hover:bg-slate-800"
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
