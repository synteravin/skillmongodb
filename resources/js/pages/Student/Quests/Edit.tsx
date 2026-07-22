import { Link, useForm } from '@inertiajs/react';
import React, { useRef, useState } from 'react';
import {
    X,
    FileText,
    Calendar,
    CloudUpload,
    AlertTriangle,
    Save,
    RotateCcw,
} from 'lucide-react';
import QuestRewardsEstimator from '@/components/Quest/QuestRewardsEstimator';

interface ExistingAttachment {
    name: string;
    path: string;
    url: string;
    size?: number;
}

interface QuestEditProps {
    quest: {
        _id: string;
        title: string;
        description: string;
        min_budget: number;
        max_budget: number;
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
        quest.images || []
    );
    const [existingFiles, setExistingFiles] = useState<ExistingAttachment[]>(
        quest.files || []
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
        min_budget: quest.min_budget || 0,
        max_budget: quest.max_budget || 0,
        min_salary: quest.min_budget || 0,
        max_salary: quest.max_budget || 0,
        deadline: quest.deadline || '',
        retained_images: (quest.images || []).map((i) => i.path),
        retained_files: (quest.files || []).map((f) => f.path),
        images: [] as File[],
        files: [] as File[],
    });

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

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(`/student/quests/${quest._id}/update`);
    };

    const formatBytes = (bytes?: number) => {
        if (!bytes || bytes === 0) return '0 Bytes';
        const k = 1024;
        const dm = 2;
        const sizes = ['Bytes', 'KB', 'MB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return (
            parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i]
        );
    };

    return (
        <div
            className="flex min-h-screen w-full flex-col overflow-x-hidden bg-[#f8fafc] text-slate-800 transition-colors duration-200 dark:bg-[#030712] dark:text-white"
            style={{ fontFamily: "'Outfit', sans-serif" }}
        >
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
                            href={`/student/quests/${quest._id}`}
                            className="relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded border-2 border-blue-500 bg-blue-100 transition-colors hover:border-blue-600 hover:bg-blue-200 md:h-12 md:w-12 dark:border-blue-800 dark:bg-[#0b1021] dark:hover:border-blue-600 dark:hover:bg-blue-900/40"
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

                        {/* Title Section */}
                        <div className="flex-1 text-center">
                            <h1 className="text-sm font-black tracking-widest text-slate-800 uppercase md:text-xl dark:text-slate-100">
                                PERBAIKI & AJUKAN ULANG QUEST
                            </h1>
                            <p className="text-[10px] tracking-wider text-slate-500 uppercase md:text-xs dark:text-slate-400">
                                LENGKAPI DOKUMEN & PERBARUI DETAIL DRAF QUEST
                            </p>
                        </div>

                        {/* Decorative gaming elements */}
                        <div className="hidden items-center gap-2 md:flex">
                            <div className="flex flex-col items-end">
                                <span className="text-[10px] font-bold text-amber-500 uppercase">
                                    STATUS QUEST
                                </span>
                                <span className="rounded bg-amber-500/10 px-2 py-0.5 text-xs font-semibold text-amber-600 dark:text-amber-400">
                                    {quest.status === 'rejected'
                                        ? 'DITOLAK ADMIN'
                                        : 'DRAF'}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* MAIN CONTENT AREA */}
            <div className="mx-auto w-full max-w-5xl flex-1 px-4 py-6 md:px-8">
                {/* Rejection Alert Note if previously rejected */}
                {quest.status === 'rejected' && quest.rejection_note && (
                    <div className="mb-6 rounded-xl border border-red-200 bg-red-50/80 p-4 shadow-sm dark:border-red-900/40 dark:bg-red-950/30">
                        <div className="flex items-start gap-3">
                            <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-red-600 dark:text-red-400" />
                            <div>
                                <h3 className="text-xs font-bold tracking-wider text-red-800 uppercase dark:text-red-300">
                                    Catatan Alasan Penolakan Admin:
                                </h3>
                                <p className="mt-1 text-xs text-red-700 dark:text-red-300">
                                    "{quest.rejection_note}"
                                </p>
                                <p className="mt-2 text-[11px] font-medium text-red-600 dark:text-red-400">
                                    Silakan perbaiki data quest dan tambahkan berkas/gambar yang diminta di bawah ini, lalu klik tombol <strong>Kirim Ulang ke Admin</strong>.
                                </p>
                            </div>
                        </div>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* CARD 1: INFORMASI UTAMA */}
                    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm md:p-6 dark:border-slate-800 dark:bg-[#080d1a]">
                        <h2 className="mb-4 flex items-center gap-2 text-sm font-bold text-slate-800 uppercase dark:text-slate-100">
                            <FileText className="h-4 w-4 text-indigo-500" />
                            Informasi Utama Penugasan
                        </h2>

                        <div className="space-y-4">
                            {/* Judul Quest */}
                            <div>
                                <label className="mb-1 block text-xs font-semibold tracking-wider text-slate-600 uppercase dark:text-slate-400">
                                    Judul Quest / Penugasan{' '}
                                    <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    value={data.title}
                                    onChange={(e) =>
                                        setData('title', e.target.value)
                                    }
                                    placeholder="Contoh: Pembuatan Landing Page Startup EdTech"
                                    className="w-full rounded-lg border border-slate-300 bg-slate-50 px-3.5 py-2.5 text-xs text-slate-800 transition-colors focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 dark:border-slate-700 dark:bg-[#030712] dark:text-white"
                                />
                                {errors.title && (
                                    <p className="mt-1 text-xs text-red-500">
                                        {errors.title}
                                    </p>
                                )}
                            </div>

                            {/* Deskripsi */}
                            <div>
                                <label className="mb-1 block text-xs font-semibold tracking-wider text-slate-600 uppercase dark:text-slate-400">
                                    Deskripsi Lengkap & Kebutuhan Proyek{' '}
                                    <span className="text-red-500">*</span>
                                </label>
                                <textarea
                                    rows={5}
                                    value={data.description}
                                    onChange={(e) =>
                                        setData('description', e.target.value)
                                    }
                                    placeholder="Jelaskan kebutuhan, fitur yang diinginkan, kriteria hasil, serta instruksi khusus..."
                                    className="w-full rounded-lg border border-slate-300 bg-slate-50 px-3.5 py-2.5 text-xs leading-relaxed text-slate-800 transition-colors focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 dark:border-slate-700 dark:bg-[#030712] dark:text-white"
                                />
                                {errors.description && (
                                    <p className="mt-1 text-xs text-red-500">
                                        {errors.description}
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* CARD 2: ANGGARAN & DEADLINE */}
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                        {/* Anggaran */}
                        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm md:p-6 dark:border-slate-800 dark:bg-[#080d1a]">
                            <h2 className="mb-4 flex items-center gap-2 text-sm font-bold text-slate-800 uppercase dark:text-slate-100">
                                <span className="font-bold text-emerald-500">Rp</span>
                                Rentang Anggaran Imbalan (Rp)
                            </h2>

                            <div className="space-y-4">
                                <div>
                                    <label className="mb-1 block text-xs font-semibold text-slate-600 uppercase dark:text-slate-400">
                                        Anggaran Minimal (Rp){' '}
                                        <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="number"
                                        min={0}
                                        value={data.min_budget}
                                        onChange={(e) => {
                                            const val = parseInt(e.target.value) || 0;
                                            setData((prev) => ({
                                                ...prev,
                                                min_budget: val,
                                                min_salary: val,
                                            }));
                                        }}
                                        className="w-full rounded-lg border border-slate-300 bg-slate-50 px-3 py-2 text-xs text-slate-800 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 dark:border-slate-700 dark:bg-[#030712] dark:text-white"
                                    />
                                </div>

                                <div>
                                    <label className="mb-1 block text-xs font-semibold text-slate-600 uppercase dark:text-slate-400">
                                        Anggaran Maksimal (Rp){' '}
                                        <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="number"
                                        min={0}
                                        value={data.max_budget}
                                        onChange={(e) => {
                                            const val = parseInt(e.target.value) || 0;
                                            setData((prev) => ({
                                                ...prev,
                                                max_budget: val,
                                                max_salary: val,
                                            }));
                                        }}
                                        className="w-full rounded-lg border border-slate-300 bg-slate-50 px-3 py-2 text-xs text-slate-800 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 dark:border-slate-700 dark:bg-[#030712] dark:text-white"
                                    />
                                    {errors.max_budget && (
                                        <p className="mt-1 text-xs text-red-500">
                                            {errors.max_budget}
                                        </p>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Deadline & Rewards Preview */}
                        <div className="flex flex-col justify-between rounded-xl border border-slate-200 bg-white p-5 shadow-sm md:p-6 dark:border-slate-800 dark:bg-[#080d1a]">
                            <div>
                                <h2 className="mb-4 flex items-center gap-2 text-sm font-bold text-slate-800 uppercase dark:text-slate-100">
                                    <Calendar className="h-4 w-4 text-amber-500" />
                                    Tenggat Waktu Pengerjaan
                                </h2>

                                <div>
                                    <label className="mb-1 block text-xs font-semibold text-slate-600 uppercase dark:text-slate-400">
                                        Tanggal Deadline{' '}
                                        <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="date"
                                        value={data.deadline}
                                        onChange={(e) =>
                                            setData('deadline', e.target.value)
                                        }
                                        className="w-full rounded-lg border border-slate-300 bg-slate-50 px-3 py-2 text-xs text-slate-800 focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500 dark:border-slate-700 dark:bg-[#030712] dark:text-white"
                                    />
                                    {errors.deadline && (
                                        <p className="mt-1 text-xs text-red-500">
                                            {errors.deadline}
                                        </p>
                                    )}
                                </div>
                            </div>

                            {/* Rewards Estimator Component */}
                            <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800">
                                <QuestRewardsEstimator
                                    minBudget={data.min_budget}
                                    maxBudget={data.max_budget}
                                />
                            </div>
                        </div>
                    </div>

                    {/* CARD 3: BERKAS & GAMBAR LAMPIRAN */}
                    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm md:p-6 dark:border-slate-800 dark:bg-[#080d1a]">
                        <h2 className="mb-2 flex items-center gap-2 text-sm font-bold text-slate-800 uppercase dark:text-slate-100">
                            <CloudUpload className="h-4 w-4 text-indigo-500" />
                            Kelola Berkas & Gambar Lampiran Pendukung
                        </h2>
                        <p className="mb-4 text-xs text-slate-500 dark:text-slate-400">
                            Tambahkan berkas pendukung (PDF, Word, ZIP, Gambar PNG/JPG) yang diminta oleh Admin.
                        </p>

                        {/* Existing Attachments Section */}
                        {(existingImages.length > 0 || existingFiles.length > 0) && (
                            <div className="mb-6 space-y-4 rounded-lg border border-slate-200/80 bg-slate-50/60 p-4 dark:border-slate-800 dark:bg-[#030712]/50">
                                <h3 className="text-xs font-bold tracking-wider text-slate-600 uppercase dark:text-slate-300">
                                    Lampiran Yang Sudah Ada Sebelumnya:
                                </h3>

                                {/* Existing Images */}
                                {existingImages.length > 0 && (
                                    <div>
                                        <span className="block text-[11px] font-semibold text-slate-500 uppercase">
                                            Gambar Saat Ini:
                                        </span>
                                        <div className="mt-2 grid grid-cols-2 gap-3 sm:grid-cols-4">
                                            {existingImages.map((img) => (
                                                <div
                                                    key={img.path}
                                                    className="group relative overflow-hidden rounded-lg border border-slate-200 bg-white p-1 dark:border-slate-800 dark:bg-[#080d1a]"
                                                >
                                                    <img
                                                        src={img.url}
                                                        alt={img.name}
                                                        className="h-20 w-full rounded object-cover"
                                                    />
                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            handleRemoveExistingImage(
                                                                img.path
                                                            )
                                                        }
                                                        className="absolute top-2 right-2 rounded-full bg-red-600 p-1 text-white opacity-90 transition-opacity hover:opacity-100"
                                                        title="Hapus gambar ini"
                                                    >
                                                        <X className="h-3.5 w-3.5" />
                                                    </button>
                                                    <span className="mt-1 block truncate text-center text-[9px] text-slate-500">
                                                        {img.name}
                                                    </span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Existing Files */}
                                {existingFiles.length > 0 && (
                                    <div className="pt-2">
                                        <span className="block text-[11px] font-semibold text-slate-500 uppercase">
                                            Dokumen Saat Ini:
                                        </span>
                                        <div className="mt-2 space-y-2">
                                            {existingFiles.map((file) => (
                                                <div
                                                    key={file.path}
                                                    className="flex items-center justify-between rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs dark:border-slate-800 dark:bg-[#080d1a]"
                                                >
                                                    <div className="flex items-center gap-2 min-w-0">
                                                        <FileText className="h-4 w-4 shrink-0 text-indigo-500" />
                                                        <span className="truncate font-medium text-slate-700 dark:text-slate-200">
                                                            {file.name}
                                                        </span>
                                                        <span className="text-[10px] text-slate-400">
                                                            ({formatBytes(file.size)})
                                                        </span>
                                                    </div>
                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            handleRemoveExistingFile(
                                                                file.path
                                                            )
                                                        }
                                                        className="rounded p-1 text-red-500 hover:bg-red-50 dark:hover:bg-red-950/40"
                                                        title="Hapus berkas ini"
                                                    >
                                                        <X className="h-4 w-4" />
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Drag & Drop Upload Zone */}
                        <div
                            onDragEnter={handleDrag}
                            onDragLeave={handleDrag}
                            onDragOver={handleDrag}
                            onDrop={handleDrop}
                            onClick={() => fileInputRef.current?.click()}
                            className={`flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed p-6 text-center transition-colors ${
                                dragActive
                                    ? 'border-indigo-500 bg-indigo-50/50 dark:bg-indigo-950/20'
                                    : 'border-slate-300 hover:border-indigo-400 dark:border-slate-700 dark:hover:border-indigo-500'
                            }`}
                        >
                            <CloudUpload className="mb-2 h-8 w-8 text-indigo-500" />
                            <p className="text-xs font-semibold text-slate-700 dark:text-slate-200">
                                Klik atau seret berkas baru ke sini
                            </p>
                            <p className="mt-1 text-[10px] text-slate-400">
                                Format didukung: PNG, JPG, PDF, DOCX, ZIP (Maks 10MB per file)
                            </p>
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
                        </div>

                        {/* Previews of newly added files */}
                        {(newAttachmentPreviews.images.length > 0 ||
                            newAttachmentPreviews.files.length > 0) && (
                            <div className="mt-4 space-y-3">
                                <h4 className="text-xs font-bold text-slate-600 uppercase dark:text-slate-400">
                                    Berkas Baru Yang Akan Diunggah:
                                </h4>

                                {newAttachmentPreviews.images.length > 0 && (
                                    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                                        {newAttachmentPreviews.images.map(
                                            (img, idx) => (
                                                <div
                                                    key={idx}
                                                    className="group relative overflow-hidden rounded-lg border border-indigo-200 bg-indigo-50/30 p-1 dark:border-indigo-900/40"
                                                >
                                                    <img
                                                        src={img.url}
                                                        alt={img.name}
                                                        className="h-20 w-full rounded object-cover"
                                                    />
                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            handleRemoveNewFile(
                                                                'images',
                                                                idx
                                                            )
                                                        }
                                                        className="absolute top-2 right-2 rounded-full bg-red-600 p-1 text-white"
                                                    >
                                                        <X className="h-3.5 w-3.5" />
                                                    </button>
                                                </div>
                                            )
                                        )}
                                    </div>
                                )}

                                {newAttachmentPreviews.files.length > 0 && (
                                    <div className="space-y-2">
                                        {newAttachmentPreviews.files.map(
                                            (file, idx) => (
                                                <div
                                                    key={idx}
                                                    className="flex items-center justify-between rounded-lg border border-indigo-200 bg-indigo-50/30 px-3 py-2 text-xs dark:border-indigo-900/40"
                                                >
                                                    <span className="truncate font-medium text-slate-700 dark:text-slate-200">
                                                        {file.name} ({formatBytes(file.size)})
                                                    </span>
                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            handleRemoveNewFile(
                                                                'files',
                                                                idx
                                                            )
                                                        }
                                                        className="text-red-500 hover:text-red-700"
                                                    >
                                                        <X className="h-4 w-4" />
                                                    </button>
                                                </div>
                                            )
                                        )}
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                    {/* ACTION BUTTONS */}
                    <div className="flex items-center justify-end gap-3 pt-2">
                        <Link
                            href={`/student/quests/${quest._id}`}
                            className="rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-xs font-semibold text-slate-700 transition-colors hover:bg-slate-50 dark:border-slate-700 dark:bg-[#080d1a] dark:text-slate-300 dark:hover:bg-slate-800"
                        >
                            Batal
                        </Link>

                        <button
                            type="submit"
                            disabled={processing}
                            className="flex items-center gap-2 rounded-lg bg-gradient-to-r from-indigo-600 to-indigo-700 px-6 py-2.5 text-xs font-bold text-white shadow-md transition-all hover:from-indigo-500 hover:to-indigo-600 disabled:opacity-50"
                        >
                            {quest.status === 'rejected' ? (
                                <>
                                    <RotateCcw className="h-4 w-4" />
                                    KIRIM ULANG KE ADMIN
                                </>
                            ) : (
                                <>
                                    <Save className="h-4 w-4" />
                                    SIMPAN PERBAIKAN
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
