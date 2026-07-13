import { useForm, Link } from '@inertiajs/react';
import React, { useState, useEffect } from 'react';
import {
    ArrowLeft,
    Save,
    Briefcase,
    DollarSign,
    Calendar,
    FileText,
    Image as ImageIcon,
    Plus,
    Trash2,
    Paperclip,
    FileArchive,
    AlertCircle,
    Award,
    Sparkles,
    CheckCircle,
    Info,
} from 'lucide-react';

export default function Create({ template }: { template?: any }) {
    const { data, setData, post, processing, errors, transform } = useForm({
        title: template?.title ?? '',
        description: template?.description ?? '',
        min_salary: template?.min_salary ? String(template.min_salary) : '',
        max_salary: template?.max_salary ? String(template.max_salary) : '',
        deadline: '',
        images: [] as File[],
        files: [] as File[],
    });

    const [clientErrors, setClientErrors] = useState<{
        images?: string;
        files?: string;
    }>({});

    // Dynamic RPG rewards estimator states
    const [rewards, setRewards] = useState({
        exp: 100,
        gold: 50,
        erp: 20,
        rank: 'Bronze',
    });

    // Calculate rewards dynamically when budget changes
    useEffect(() => {
        const minVal = parseFloat(data.min_salary) || 0;
        const maxVal = parseFloat(data.max_salary) || 0;
        const avgBudget = (minVal + maxVal) / 2;

        // EXP calculation: 100 base + 1 EXP per 10k IDR budget, max 1000
        const exp = Math.min(
            1000,
            Math.max(100, Math.round(100 + avgBudget * 0.0001)),
        );

        // Gold calculation: 50 base + 1 Gold per 20k IDR max budget, max 500
        const gold = Math.min(
            500,
            Math.max(50, Math.round(50 + maxVal * 0.00005)),
        );

        // ERP calculation: 20 base + 1 ERP per 50k IDR avg budget, max 200
        const erp = Math.min(
            200,
            Math.max(20, Math.round(20 + avgBudget * 0.00002)),
        );

        let rank = 'Bronze';
        if (maxVal >= 10000000) {
            rank = 'Mythic';
        } else if (maxVal >= 5000000) {
            rank = 'Diamond';
        } else if (maxVal >= 2500000) {
            rank = 'Gold';
        } else if (maxVal >= 1000000) {
            rank = 'Silver';
        }

        setRewards({ exp, gold, erp, rank });
    }, [data.min_salary, data.max_salary]);

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files) return;
        const selected = Array.from(e.target.files);
        const validImages: File[] = [];
        let errorMsg = '';

        selected.forEach((file) => {
            if (file.size > 2 * 1024 * 1024) {
                errorMsg = `Gambar "${file.name}" melebihi batas 2MB.`;
            } else if (!file.type.startsWith('image/')) {
                errorMsg = `Berkas "${file.name}" harus berupa gambar.`;
            } else {
                validImages.push(file);
            }
        });

        if (errorMsg) {
            setClientErrors((prev) => ({ ...prev, images: errorMsg }));
        } else {
            setClientErrors((prev) => ({ ...prev, images: undefined }));
        }

        if (validImages.length > 0) {
            setData('images', [...data.images, ...validImages]);
        }
        e.target.value = '';
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files) return;
        const selected = Array.from(e.target.files);
        const validFiles: File[] = [];
        let errorMsg = '';
        const allowedExtensions = ['pdf', 'doc', 'docx', 'xls', 'xlsx', 'zip'];

        selected.forEach((file) => {
            const ext = file.name.split('.').pop()?.toLowerCase();
            if (file.size > 10 * 1024 * 1024) {
                errorMsg = `Berkas "${file.name}" melebihi batas 10MB.`;
            } else if (!ext || !allowedExtensions.includes(ext)) {
                errorMsg = `Ekstensi berkas "${file.name}" tidak diizinkan. Gunakan PDF, Word, Excel, atau ZIP.`;
            } else {
                validFiles.push(file);
            }
        });

        if (errorMsg) {
            setClientErrors((prev) => ({ ...prev, files: errorMsg }));
        } else {
            setClientErrors((prev) => ({ ...prev, files: undefined }));
        }

        if (validFiles.length > 0) {
            setData('files', [...data.files, ...validFiles]);
        }
        e.target.value = '';
    };

    const removeImage = (index: number) => {
        const updated = [...data.images];
        updated.splice(index, 1);
        setData('images', updated);
    };

    const removeFile = (index: number) => {
        const updated = [...data.files];
        updated.splice(index, 1);
        setData('files', updated);
    };

    const formatBytes = (bytes: number) => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const dm = 2;
        const sizes = ['Bytes', 'KB', 'MB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return (
            parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i]
        );
    };

    const getFileIcon = (fileName: string) => {
        const ext = fileName.split('.').pop()?.toLowerCase();
        if (ext === 'zip')
            return <FileArchive className="h-5 w-5 text-amber-500" />;
        return <FileText className="h-5 w-5 text-indigo-500" />;
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        transform((data) => ({
            ...data,
            deadline: data.deadline
                ? new Date(data.deadline).toISOString()
                : '',
        }));
        post('/student/quests');
    };

    return (
        <div
            className="relative flex min-h-screen flex-col overflow-x-hidden bg-slate-50 p-3 text-slate-800 transition-colors duration-205 sm:p-6 md:p-8 dark:bg-[#060813] dark:text-white"
            style={{ fontFamily: "'Outfit', sans-serif" }}
        >
            {/* Ambient top-center glow */}
            <div className="pointer-events-none absolute top-0 left-1/2 z-0 h-[450px] w-full max-w-7xl -translate-x-1/2 rounded-full bg-indigo-500/5 blur-[120px] select-none" />

            <div className="relative z-10 mx-auto flex min-h-0 w-full max-w-6xl flex-1 flex-col space-y-6">
                {/* HEADER */}
                <div className="flex flex-col gap-4 border-b border-slate-200 pb-5 sm:flex-row sm:items-center sm:justify-between dark:border-slate-800/80">
                    <div className="space-y-1">
                        <Link
                            href="/student/quests"
                            className="hover:text-indigo-650 inline-flex items-center gap-1.5 font-['Orbitron'] text-xs font-bold tracking-widest text-slate-500 uppercase transition-colors dark:text-slate-400 dark:hover:text-indigo-400"
                        >
                            <ArrowLeft size={14} />
                            Kembali ke Quest Board
                        </Link>
                        <h2 className="flex items-center gap-2 font-['Oxanium'] text-xl font-extrabold tracking-tight text-slate-900 sm:text-2xl md:text-3xl dark:text-white">
                            <Sparkles className="h-6 w-6 animate-pulse text-indigo-500" />
                            POSTING QUEST BARU
                        </h2>
                    </div>
                </div>

                {/* TWO-COLUMN FORM LAYOUT */}
                <form
                    onSubmit={handleSubmit}
                    className="grid grid-cols-1 items-start gap-8 lg:grid-cols-12"
                >
                    {/* LEFT COLUMN: Main Form details (lg:col-span-8) */}
                    <div className="space-y-6 lg:col-span-8">
                        {/* Card 1: Informasi Utama */}
                        <div className="space-y-5 rounded-2xl border border-slate-200 bg-white/70 p-6 shadow-md backdrop-blur-md transition-all duration-300 dark:border-slate-800/80 dark:bg-[#0c122c]/40">
                            <div className="flex items-center gap-2 border-b border-slate-100 pb-3 dark:border-slate-800">
                                <Briefcase className="h-5 w-5 text-indigo-500" />
                                <h3 className="font-['Orbitron'] text-xs font-black tracking-wider text-slate-700 uppercase dark:text-blue-200">
                                    Informasi Utama Pekerjaan
                                </h3>
                            </div>

                            {/* Job Title */}
                            <div className="space-y-2">
                                <label className="block font-['Orbitron'] text-[10px] font-bold tracking-wider text-slate-400 uppercase">
                                    Judul Quest / Pekerjaan{' '}
                                    <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    required
                                    placeholder="Contoh: Membuat Landing Page Next.js dengan Tailwind CSS"
                                    value={data.title}
                                    onChange={(e) =>
                                        setData('title', e.target.value)
                                    }
                                    className="text-slate-805 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 font-['Oxanium'] text-xs transition-colors focus:border-indigo-500 focus:outline-none sm:text-sm dark:border-slate-800 dark:bg-black/20 dark:text-white"
                                />
                                {errors.title && (
                                    <p className="mt-1 font-['Oxanium'] text-xs font-semibold text-red-500">
                                        {errors.title}
                                    </p>
                                )}
                            </div>

                            {/* Job Description */}
                            <div className="space-y-2">
                                <label className="block font-['Orbitron'] text-[10px] font-bold tracking-wider text-slate-400 uppercase">
                                    Detail Kebutuhan Pekerjaan{' '}
                                    <span className="text-red-500">*</span>
                                </label>
                                <textarea
                                    required
                                    placeholder="Jelaskan secara rinci spesifikasi pekerjaan, teknologi yang digunakan, serta kriteria hasil pengerjaan (output) yang diharapkan..."
                                    rows={8}
                                    value={data.description}
                                    onChange={(e) =>
                                        setData('description', e.target.value)
                                    }
                                    className="text-slate-805 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 font-['Oxanium'] text-xs leading-relaxed transition-colors focus:border-indigo-500 focus:outline-none sm:text-sm dark:border-slate-800 dark:bg-black/20 dark:text-white"
                                />
                                {errors.description && (
                                    <p className="mt-1 font-['Oxanium'] text-xs font-semibold text-red-500">
                                        {errors.description}
                                    </p>
                                )}
                            </div>
                        </div>

                        {/* Card 2: Berkas Pendukung & Lampiran */}
                        <div className="space-y-5 rounded-2xl border border-slate-200 bg-white/70 p-6 shadow-md backdrop-blur-md transition-all duration-300 dark:border-slate-800/80 dark:bg-[#0c122c]/40">
                            <div className="flex items-center gap-2 border-b border-slate-100 pb-3 dark:border-slate-800">
                                <Paperclip className="h-5 w-5 text-indigo-500" />
                                <h3 className="font-['Orbitron'] text-xs font-black tracking-wider text-slate-700 uppercase dark:text-blue-200">
                                    Berkas & Lampiran Pendukung
                                </h3>
                            </div>

                            {/* Image Uploader */}
                            <div className="space-y-3 font-['Oxanium']">
                                <label className="block font-['Orbitron'] text-[10px] font-bold tracking-wider text-slate-400 uppercase">
                                    Unggah Gambar (Maks. 2MB per gambar)
                                </label>

                                {/* Image Preview Grid */}
                                {data.images.length > 0 && (
                                    <div className="mb-3 grid grid-cols-2 gap-3.5 sm:grid-cols-3">
                                        {data.images.map((file, index) => (
                                            <div
                                                key={index}
                                                className="group relative flex flex-col items-center overflow-hidden rounded-xl border border-slate-200 bg-slate-50 p-1 dark:border-slate-800 dark:bg-black/20"
                                            >
                                                <img
                                                    src={URL.createObjectURL(
                                                        file,
                                                    )}
                                                    alt={file.name}
                                                    className="h-20 w-full rounded-lg object-cover"
                                                />
                                                <span className="mt-1 w-full truncate px-1 text-center text-[9px] text-slate-500 dark:text-slate-400">
                                                    {file.name}
                                                </span>
                                                <span className="text-[8px] text-slate-400">
                                                    {formatBytes(file.size)}
                                                </span>
                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        removeImage(index)
                                                    }
                                                    className="bg-red-650 absolute top-2 right-2 cursor-pointer rounded-full p-1 text-white opacity-90 transition-all hover:scale-105 hover:bg-red-700"
                                                >
                                                    <Trash2 className="h-3 w-3" />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                )}

                                <div className="relative">
                                    <input
                                        type="file"
                                        accept="image/*"
                                        multiple
                                        onChange={handleImageChange}
                                        id="quest-images-input"
                                        className="hidden"
                                    />
                                    <label
                                        htmlFor="quest-images-input"
                                        className="flex cursor-pointer flex-col items-center justify-center gap-1.5 rounded-xl border border-dashed border-slate-300 bg-slate-50/50 px-4 py-5 text-xs text-slate-500 transition-all duration-300 hover:border-indigo-500 dark:border-slate-800 dark:bg-black/15 dark:text-slate-400 dark:hover:border-indigo-500/50"
                                    >
                                        <ImageIcon className="h-5 w-5 animate-bounce text-indigo-500" />
                                        <span className="dark:text-slate-350 font-bold text-slate-700">
                                            Seret atau pilih gambar Anda
                                        </span>
                                        <span className="text-[10px] text-slate-400">
                                            Format JPEG, PNG, WEBP
                                        </span>
                                    </label>
                                </div>

                                {clientErrors.images && (
                                    <p className="mt-1 flex items-center gap-1 text-xs font-semibold text-red-500">
                                        <AlertCircle className="h-3.5 w-3.5 shrink-0" />{' '}
                                        {clientErrors.images}
                                    </p>
                                )}
                                {errors.images && (
                                    <p className="mt-1 text-xs font-semibold text-red-500">
                                        {errors.images}
                                    </p>
                                )}
                            </div>

                            {/* Document Uploader */}
                            <div className="space-y-3 border-t border-slate-100 pt-4 font-['Oxanium'] dark:border-slate-800/60">
                                <label className="block font-['Orbitron'] text-[10px] font-bold tracking-wider text-slate-400 uppercase">
                                    Dokumen Penunjang (PDF, Word, Excel, ZIP -
                                    Maks. 10MB)
                                </label>

                                {/* Selected Documents List */}
                                {data.files.length > 0 && (
                                    <div className="mb-3 space-y-2">
                                        {data.files.map((file, index) => (
                                            <div
                                                key={index}
                                                className="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50 p-2.5 dark:border-slate-800/80 dark:bg-black/20"
                                            >
                                                <div className="flex min-w-0 items-center gap-3">
                                                    {getFileIcon(file.name)}
                                                    <div className="min-w-0">
                                                        <p className="text-slate-705 truncate text-xs font-semibold dark:text-slate-200">
                                                            {file.name}
                                                        </p>
                                                        <p className="text-[10px] text-slate-400">
                                                            {formatBytes(
                                                                file.size,
                                                            )}
                                                        </p>
                                                    </div>
                                                </div>
                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        removeFile(index)
                                                    }
                                                    className="hover:text-red-650 cursor-pointer rounded-lg p-1.5 text-red-500 transition-colors hover:bg-red-500/10"
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                )}

                                <div className="relative">
                                    <input
                                        type="file"
                                        accept=".pdf,.doc,.docx,.xls,.xlsx,.zip"
                                        multiple
                                        onChange={handleFileChange}
                                        id="quest-files-input"
                                        className="hidden"
                                    />
                                    <label
                                        htmlFor="quest-files-input"
                                        className="flex cursor-pointer flex-col items-center justify-center gap-1.5 rounded-xl border border-dashed border-slate-300 bg-slate-50/50 px-4 py-5 text-xs text-slate-500 transition-all duration-300 hover:border-indigo-500 dark:border-slate-800 dark:bg-black/15 dark:text-slate-400 dark:hover:border-indigo-500/50"
                                    >
                                        <FileArchive className="h-5 w-5 animate-bounce text-indigo-500" />
                                        <span className="dark:text-slate-350 font-bold text-slate-700">
                                            Seret atau pilih dokumen tugas
                                        </span>
                                        <span className="text-[10px] text-slate-400">
                                            Format PDF, DOC, DOCX, XLS, XLSX,
                                            ZIP
                                        </span>
                                    </label>
                                </div>

                                {clientErrors.files && (
                                    <p className="mt-1 flex items-center gap-1 text-xs font-semibold text-red-500">
                                        <AlertCircle className="h-3.5 w-3.5 shrink-0" />{' '}
                                        {clientErrors.files}
                                    </p>
                                )}
                                {errors.files && (
                                    <p className="mt-1 text-xs font-semibold text-red-500">
                                        {errors.files}
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* RIGHT COLUMN: Budget, deadline & Live Estimation widgets (lg:col-span-4) */}
                    <div className="space-y-6 lg:col-span-4">
                        {/* Card 3: Financial settings & Deadline */}
                        <div className="space-y-4 rounded-2xl border border-slate-200 bg-white/70 p-6 font-['Oxanium'] shadow-md backdrop-blur-md dark:border-slate-800/80 dark:bg-[#0c122c]/40">
                            <div className="flex items-center gap-2 border-b border-slate-100 pb-3 dark:border-slate-800">
                                <DollarSign className="h-5 w-5 text-indigo-500" />
                                <h3 className="font-['Orbitron'] text-xs font-black tracking-wider text-slate-700 uppercase dark:text-blue-200">
                                    Anggaran & Deadline
                                </h3>
                            </div>

                            {/* Min Budget */}
                            <div className="space-y-1.5">
                                <label className="block font-['Orbitron'] text-[10px] font-bold tracking-wider text-slate-400 uppercase">
                                    Gaji Minimal (IDR){' '}
                                    <span className="text-red-500">*</span>
                                </label>
                                <div className="relative">
                                    <span className="absolute top-3 left-3 text-xs font-bold text-slate-400">
                                        Rp
                                    </span>
                                    <input
                                        type="number"
                                        required
                                        placeholder="Contoh: 500000"
                                        value={data.min_salary}
                                        onChange={(e) =>
                                            setData(
                                                'min_salary',
                                                e.target.value,
                                            )
                                        }
                                        className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pr-3 pl-9 text-xs font-bold text-slate-800 focus:border-indigo-500 focus:outline-none dark:border-slate-800 dark:bg-black/20 dark:text-white"
                                    />
                                </div>
                                {errors.min_salary && (
                                    <p className="mt-0.5 text-xs font-semibold text-red-500">
                                        {errors.min_salary}
                                    </p>
                                )}
                            </div>

                            {/* Max Budget */}
                            <div className="space-y-1.5">
                                <label className="block font-['Orbitron'] text-[10px] font-bold tracking-wider text-slate-400 uppercase">
                                    Gaji Maksimal (IDR){' '}
                                    <span className="text-red-500">*</span>
                                </label>
                                <div className="relative">
                                    <span className="absolute top-3 left-3 text-xs font-bold text-slate-400">
                                        Rp
                                    </span>
                                    <input
                                        type="number"
                                        required
                                        placeholder="Contoh: 1500000"
                                        value={data.max_salary}
                                        onChange={(e) =>
                                            setData(
                                                'max_salary',
                                                e.target.value,
                                            )
                                        }
                                        className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pr-3 pl-9 text-xs font-bold text-slate-800 focus:border-indigo-500 focus:outline-none dark:border-slate-800 dark:bg-black/20 dark:text-white"
                                    />
                                </div>
                                {errors.max_salary && (
                                    <p className="mt-0.5 text-xs font-semibold text-red-500">
                                        {errors.max_salary}
                                    </p>
                                )}
                            </div>

                            {/* Deadline */}
                            <div className="space-y-1.5 border-t border-slate-100 pt-2 dark:border-slate-800/40">
                                <label className="block font-['Orbitron'] text-[10px] font-bold tracking-wider text-slate-400 uppercase">
                                    Tenggat Waktu{' '}
                                    <span className="text-red-500">*</span>
                                </label>
                                <div className="relative">
                                    <input
                                        type="datetime-local"
                                        required
                                        value={data.deadline}
                                        onChange={(e) =>
                                            setData('deadline', e.target.value)
                                        }
                                        className="w-full cursor-pointer rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-xs font-bold text-slate-800 focus:border-indigo-500 focus:outline-none dark:border-slate-800 dark:bg-black/20 dark:text-white"
                                    />
                                </div>
                                {errors.deadline && (
                                    <p className="mt-0.5 text-xs font-semibold text-red-500">
                                        {errors.deadline}
                                    </p>
                                )}
                            </div>
                        </div>

                        {/* Card 4: RPG Rewards Estimator */}
                        <div className="space-y-4 rounded-2xl border border-slate-200 bg-white/70 p-6 font-['Orbitron'] shadow-md backdrop-blur-md dark:border-slate-800/80 dark:bg-[#0c122c]/40">
                            <div className="flex items-center justify-between border-b border-slate-100 pb-3 dark:border-slate-800">
                                <div className="flex items-center gap-2">
                                    <Award className="h-5 w-5 animate-pulse text-purple-500" />
                                    <h3 className="text-xs font-black tracking-wider text-slate-700 uppercase dark:text-blue-200">
                                        Quest Rewards Estimator
                                    </h3>
                                </div>
                                <span className="text-purple-650 dark:text-purple-305 rounded-md border border-purple-500/20 bg-purple-500/10 px-2 py-0.5 text-[9px] font-black tracking-wider uppercase">
                                    Rank: {rewards.rank}
                                </span>
                            </div>

                            <p className="font-sans text-[10px] leading-relaxed text-slate-500 dark:text-slate-400">
                                <Info className="-mt-0.5 mr-1 inline h-3.5 w-3.5 text-indigo-500" />
                                Hadiah RPG akan otomatis dikalkulasikan
                                berdasarkan anggaran quest Anda dan akan
                                ditambahkan ke akun pekerja saat tugas
                                disetujui.
                            </p>

                            <div className="grid grid-cols-3 gap-2.5 pt-1 text-center font-['Orbitron'] text-xs font-bold">
                                <div className="flex flex-col items-center rounded-xl border border-purple-500/20 bg-purple-500/10 py-2.5 text-purple-600 transition-transform hover:scale-[1.03] dark:text-purple-300">
                                    <Award className="mb-1 h-4 w-4 text-purple-500" />
                                    <span className="font-sans text-[8px] font-semibold text-slate-400">
                                        EXP
                                    </span>
                                    <span className="text-[11px] font-black">
                                        +{rewards.exp}
                                    </span>
                                </div>
                                <div className="flex flex-col items-center rounded-xl border border-amber-500/20 bg-amber-500/10 py-2.5 text-amber-600 transition-transform hover:scale-[1.03] dark:text-amber-400">
                                    <Award className="mb-1 h-4 w-4 text-amber-500" />
                                    <span className="font-sans text-[8px] font-semibold text-slate-400">
                                        GOLD
                                    </span>
                                    <span className="text-[11px] font-black">
                                        +{rewards.gold}
                                    </span>
                                </div>
                                <div className="dark:text-indigo-305 flex flex-col items-center rounded-xl border border-indigo-500/20 bg-indigo-500/10 py-2.5 text-indigo-600 transition-transform hover:scale-[1.03]">
                                    <Award className="mb-1 h-4 w-4 text-indigo-500" />
                                    <span className="font-sans text-[8px] font-semibold text-slate-400">
                                        ERP
                                    </span>
                                    <span className="text-[11px] font-black">
                                        +{rewards.erp}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Action buttons */}
                        <div className="flex gap-3 pt-2">
                            <Link
                                href="/student/quests"
                                className="flex-1 rounded-xl border border-slate-200 bg-slate-100/50 py-3 text-center font-['Orbitron'] text-xs font-black tracking-wider text-slate-600 uppercase transition-colors hover:bg-slate-200/50 dark:border-slate-800 dark:bg-blue-950/20 dark:text-slate-400 dark:hover:bg-blue-900/10"
                            >
                                Batal
                            </Link>
                            <button
                                type="submit"
                                disabled={processing}
                                className="flex-1 transform cursor-pointer rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 py-3 text-center font-['Orbitron'] text-xs font-black tracking-wider text-white uppercase shadow-[0_0_15px_rgba(99,102,241,0.4)] transition-all duration-300 hover:from-purple-700 hover:to-indigo-700 active:scale-[0.98] disabled:opacity-50"
                            >
                                {processing ? 'Mengirim...' : 'Publikasikan'}
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
}
