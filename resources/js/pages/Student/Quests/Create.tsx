import { Link, useForm } from '@inertiajs/react';
import React, { useRef, useState } from 'react';
import {
    Plus,
    X,
    FileText,
    DollarSign,
    Calendar,
    Award,
    CloudUpload,
} from 'lucide-react';
import QuestRewardsEstimator from '@/components/Quest/QuestRewardsEstimator';

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
        min_budget: 0,
        max_budget: 0,
        min_salary: 0,
        max_salary: 0,
        deadline: '',
        attachments: [] as File[],
    });

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

        // Update form state
        const allFiles = [...imagesList.map((i) => i.file), ...docsList.map((d) => d.file)];
        setData('attachments', allFiles);
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

        const allFiles = [...newImages.map((i) => i.file), ...newFiles.map((d) => d.file)];
        setData('attachments', allFiles);
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
        post('/student/quests');
    };

    return (
        <div
            className="flex min-h-screen w-full flex-col overflow-x-hidden bg-[#f8fafc] text-slate-800 transition-colors duration-200 dark:bg-[#030712] dark:text-white"
            style={{ fontFamily: "'Outfit', sans-serif" }}
        >
            {/* HEADER - Gaming style, consistent with other pages */}
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
                            href="/student/quests"
                            className="relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded border-2 border-blue-500 bg-blue-100 transition-colors hover:border-blue-600 hover:bg-blue-200 md:h-12 md:w-12 dark:border-blue-800 dark:bg-[#0b1021] dark:hover:border-blue-600 dark:hover:bg-blue-900/40"
                        >
                            <svg
                                viewBox="0 0 48 48"
                                className="h-7 w-7 scale-125 text-indigo-600 transition-transform duration-200 hover:scale-150 md:h-9 md:w-9 dark:text-indigo-500"
                            >
                                <rect x="12" y="20" width="29" height="4" fill="currentColor" />
                                <rect x="8" y="20" width="4" height="4" fill="currentColor" />
                                <rect x="5" y="20" width="5" height="4" fill="currentColor" />
                                <rect x="8" y="16" width="4" height="4" fill="currentColor" />
                                <rect x="8" y="24" width="4" height="4" fill="currentColor" />
                                <rect x="12" y="12" width="4" height="4" fill="currentColor" />
                                <rect x="12" y="28" width="4" height="4" fill="currentColor" />
                                <rect x="16" y="8" width="4" height="4" fill="currentColor" />
                                <rect x="16" y="32" width="4" height="4" fill="currentColor" />
                            </svg>
                        </Link>

                        {/* Title */}
                        <h1 className="flex-1 text-center font-['Orbitron'] text-sm font-bold tracking-[0.05em] text-[#1e3a8a] uppercase min-[390px]:text-base min-[390px]:tracking-[0.1em] sm:text-xl md:text-2xl md:tracking-[0.15em] lg:text-3xl 2xl:text-4xl dark:text-white">
                            POSTING PROYEK BARU
                        </h1>

                        {/* Spacer to center title on mobile */}
                        <div className="h-10 w-10 shrink-0 md:hidden" />
                    </div>
                </div>
            </div>

            <div className="relative z-10 flex min-h-0 w-full max-w-none flex-1 flex-col space-y-6 px-4 py-8 sm:px-6 lg:px-10">

                {/* Form Body Split Layout */}
                <form
                    onSubmit={handleSubmit}
                    className="grid grid-cols-1 items-start gap-6 lg:grid-cols-12"
                >
                    {/* Left Column: Inputs (col-span-8) */}
                    <div className="space-y-6 lg:col-span-8">
                        <div className="space-y-5 rounded-xl border border-slate-300 bg-white p-6 shadow-sm dark:border-slate-800/80 dark:bg-gradient-to-b dark:from-[#0e0e1a] dark:to-[#090910]">
                            
                            {/* Input: Judul Proyek */}
                            <div className="space-y-1.5">
                                <label className="text-[10px] font-bold tracking-wider text-slate-700 uppercase dark:text-slate-300">
                                    Judul Proyek Kerja
                                </label>
                                <input
                                    type="text"
                                    required
                                    placeholder="Contoh: Pembuatan UI/UX Aplikasi E-Learning Sederhana"
                                    value={data.title}
                                    onChange={(e) => setData('title', e.target.value)}
                                    className="w-full rounded-lg border border-slate-300 bg-slate-50/90 py-2.5 px-3.5 text-xs font-semibold text-slate-900 placeholder:text-slate-500 focus:border-indigo-600 focus:bg-white focus:outline-none dark:border-slate-800 dark:bg-[#030712] dark:text-white dark:placeholder:text-slate-500"
                                />
                                {errors.title && (
                                    <span className="text-[10px] font-bold text-red-600 dark:text-red-400">
                                        {errors.title}
                                    </span>
                                )}
                            </div>

                            {/* Input: Deskripsi */}
                            <div className="space-y-1.5">
                                <label className="text-[10px] font-bold tracking-wider text-slate-700 uppercase dark:text-slate-300">
                                    Deskripsi & Spesifikasi Penugasan
                                </label>
                                <textarea
                                    required
                                    rows={8}
                                    placeholder="Tuliskan secara detail mengenai kebutuhan proyek, deliverables yang diharapkan, serta repositori/kriteria peninjauan pengerjaan..."
                                    value={data.description}
                                    onChange={(e) => setData('description', e.target.value)}
                                    className="w-full rounded-lg border border-slate-300 bg-slate-50/90 py-2.5 px-3.5 text-xs font-semibold text-slate-900 placeholder:text-slate-500 focus:border-indigo-600 focus:bg-white focus:outline-none dark:border-slate-800 dark:bg-[#030712] dark:text-white dark:placeholder:text-slate-500"
                                />
                                {errors.description && (
                                    <span className="text-[10px] font-bold text-red-600 dark:text-red-400">
                                        {errors.description}
                                    </span>
                                )}
                            </div>

                            {/* Input: Anggaran (Salary) */}
                            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-bold tracking-wider text-slate-700 uppercase dark:text-slate-300">
                                        Anggaran Minimal (IDR)
                                    </label>
                                    <div className="relative">
                                        <input
                                            type="number"
                                            required
                                            min={0}
                                            value={data.min_budget || data.min_salary || ''}
                                            onChange={(e) => {
                                                const val = parseInt(e.target.value) || 0;
                                                setData((prev) => ({ ...prev, min_budget: val, min_salary: val }));
                                            }}
                                            className="w-full rounded-lg border border-slate-300 bg-slate-50/90 py-2.5 pr-3.5 pl-10 text-xs font-semibold text-slate-900 focus:border-indigo-600 focus:bg-white focus:outline-none dark:border-slate-800 dark:bg-[#030712] dark:text-white"
                                        />
                                        <DollarSign className="absolute top-3 left-3 h-4.5 w-4.5 text-slate-600 dark:text-slate-400" />
                                    </div>
                                    {(errors.min_budget || errors.min_salary) && (
                                        <span className="text-[10px] font-bold text-red-600 dark:text-red-400">
                                            {errors.min_budget || errors.min_salary}
                                        </span>
                                    )}
                                </div>

                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-bold tracking-wider text-slate-700 uppercase dark:text-slate-300">
                                        Anggaran Maksimal (IDR)
                                    </label>
                                    <div className="relative">
                                        <input
                                            type="number"
                                            required
                                            min={0}
                                            value={data.max_budget || data.max_salary || ''}
                                            onChange={(e) => {
                                                const val = parseInt(e.target.value) || 0;
                                                setData((prev) => ({ ...prev, max_budget: val, max_salary: val }));
                                            }}
                                            className="w-full rounded-lg border border-slate-300 bg-slate-50/90 py-2.5 pr-3.5 pl-10 text-xs font-semibold text-slate-900 focus:border-indigo-600 focus:bg-white focus:outline-none dark:border-slate-800 dark:bg-[#030712] dark:text-white"
                                        />
                                        <DollarSign className="absolute top-3 left-3 h-4.5 w-4.5 text-slate-600 dark:text-slate-400" />
                                    </div>
                                    {errors.max_salary && (
                                        <span className="text-[10px] font-bold text-red-600 dark:text-red-400">
                                            {errors.max_salary}
                                        </span>
                                    )}
                                </div>
                            </div>

                            {/* Input: Deadline */}
                            <div className="space-y-1.5">
                                <label className="text-[10px] font-bold tracking-wider text-slate-700 uppercase dark:text-slate-300">
                                    Batas Tanggat Waktu (Deadline)
                                </label>
                                <div className="relative">
                                    <input
                                        type="datetime-local"
                                        required
                                        value={data.deadline}
                                        onChange={(e) => setData('deadline', e.target.value)}
                                        className="w-full rounded-lg border border-slate-300 bg-slate-50/90 py-2.5 pr-3.5 pl-10 text-xs font-semibold text-slate-900 focus:border-indigo-600 focus:bg-white focus:outline-none dark:border-slate-800 dark:bg-[#030712] dark:text-white"
                                    />
                                    <Calendar className="absolute top-3 left-3 h-4.5 w-4.5 text-slate-600 dark:text-slate-400" />
                                </div>
                                {errors.deadline && (
                                    <span className="text-[10px] font-bold text-red-600 dark:text-red-400">
                                        {errors.deadline}
                                    </span>
                                )}
                            </div>

                            {/* Uploader Referensi Berkas */}
                            <div className="space-y-3">
                                <label className="text-[10px] font-bold tracking-wider text-slate-700 uppercase dark:text-slate-300">
                                    Lampiran Referensi File & Gambar
                                </label>

                                <div
                                    onDragEnter={handleDrag}
                                    onDragOver={handleDrag}
                                    onDragLeave={handleDrag}
                                    onDrop={handleDrop}
                                    onClick={() => fileInputRef.current?.click()}
                                    className={`flex flex-col items-center justify-center rounded-xl border border-dashed py-8 px-4 text-center transition-all ${
                                        dragActive
                                            ? 'border-indigo-600 bg-indigo-500/10'
                                            : 'border-slate-300 bg-slate-50/90 hover:border-indigo-400 hover:bg-slate-100 dark:border-slate-800 dark:bg-[#030712] dark:hover:bg-slate-900/40'
                                    }`}
                                >
                                    <input
                                        ref={fileInputRef}
                                        type="file"
                                        multiple
                                        onChange={(e) => e.target.files && handleFileAdd(e.target.files)}
                                        className="hidden"
                                    />
                                    <CloudUpload className="mb-2 h-7 w-7 text-indigo-600 dark:text-indigo-400" />
                                    <span className="text-xs font-bold text-slate-800 dark:text-slate-300">
                                        Klik untuk unggah berkas, atau seret file ke sini
                                    </span>
                                    <span className="mt-1 text-[10px] font-medium text-slate-500">
                                        Mendukung Gambar (PNG, JPG), berkas dokumen, dan arsip ZIP (Max. 5MB)
                                    </span>
                                </div>

                                {/* Previews List */}
                                {(attachmentPreviews.images.length > 0 || attachmentPreviews.files.length > 0) && (
                                    <div className="space-y-2.5 rounded-lg border border-slate-300 p-4 dark:border-slate-800 dark:bg-[#030712]/40">
                                        {/* Images Preview Grid */}
                                        {attachmentPreviews.images.length > 0 && (
                                            <div className="grid grid-cols-3 gap-3 sm:grid-cols-4 md:grid-cols-6">
                                                {attachmentPreviews.images.map((img, idx) => (
                                                    <div
                                                        key={`img_${idx}`}
                                                        className="group relative aspect-square overflow-hidden rounded-lg border border-slate-300 dark:border-slate-800"
                                                    >
                                                        <img
                                                            src={img.url}
                                                            alt={img.name}
                                                            className="h-full w-full object-cover"
                                                        />
                                                        <button
                                                            type="button"
                                                            onClick={() => handleRemoveFile('images', idx)}
                                                            className="absolute top-1 right-1 flex h-5 w-5 items-center justify-center rounded bg-slate-900/80 text-white hover:bg-slate-900"
                                                        >
                                                            <X size={12} />
                                                        </button>
                                                    </div>
                                                ))}
                                            </div>
                                        )}

                                        {/* Documents List */}
                                        {attachmentPreviews.files.length > 0 && (
                                            <div className="space-y-1.5">
                                                {attachmentPreviews.files.map((fileItem, idx) => (
                                                    <div
                                                        key={`file_${idx}`}
                                                        className="flex items-center justify-between rounded border border-slate-300 bg-white p-2 text-xs dark:border-slate-800 dark:bg-[#0d1117]"
                                                    >
                                                        <div className="flex items-center gap-2">
                                                            <FileText className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
                                                            <span className="truncate max-w-[200px] font-bold text-slate-800 dark:text-slate-300">
                                                                {fileItem.name}
                                                            </span>
                                                        </div>
                                                        <button
                                                            type="button"
                                                            onClick={() => handleRemoveFile('files', idx)}
                                                            className="text-red-600 hover:text-red-800 font-bold"
                                                        >
                                                            Hapus
                                                        </button>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Calculations & Estimations (col-span-4) */}
                    <div className="space-y-6 lg:col-span-4">
                        <div className="space-y-5 rounded-xl border border-slate-300 bg-white p-6 shadow-sm dark:border-slate-800/80 dark:bg-gradient-to-b dark:from-[#0e0e1a] dark:to-[#090910]">
                            
                            {/* Reputation & ERP Estimations */}
                            <QuestRewardsEstimator maxSalary={data.max_salary} />

                            {/* Submision Submit Action */}
                            <div className="border-t border-slate-200 pt-4 dark:border-slate-805">
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="flex w-full cursor-pointer items-center justify-center gap-1.5 rounded-lg bg-indigo-600 py-2.5 text-xs font-bold text-white shadow-md shadow-indigo-600/20 transition-colors hover:bg-indigo-700 border border-indigo-700/30"
                                >
                                    {processing ? 'Menyimpan...' : 'Posting Lowongan'}
                                    <Plus className="h-4.5 w-4.5 stroke-[3]" />
                                </button>
                                <p className="mt-2 text-[10px] text-center text-slate-400">
                                    Mengklik tombol di atas menyetujui bahwa dana proyek offline disetujui bersama pekerja.
                                </p>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
}
