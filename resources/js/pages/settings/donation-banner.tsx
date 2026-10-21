import { Head, router, useForm, usePage } from '@inertiajs/react';
import {
    AlertCircle,
    CheckCircle2,
    ExternalLink,
    HeartHandshake,
    ImageIcon,
    Info,
    Trash2,
    Upload,
    X,
} from 'lucide-react';
import React, { useRef, useState } from 'react';
import ConfirmModal from '@/components/ui/ConfirmModal';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Banner Donasi',
        href: '/donation-banner',
    },
];

interface DonationBannerData {
    id: string;
    title: string | null;
    url: string;
    image_url: string | null;
    is_active: boolean;
}

export default function DonationBannerPage({
    banner,
}: {
    banner: DonationBannerData | null;
}) {
    const { flash } = usePage<{ flash?: { success?: string; error?: string } }>()
        .props;

    const fileInputRef = useRef<HTMLInputElement | null>(null);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

    const [previewUrl, setPreviewUrl] = useState<string | null>(
        banner?.image_url ?? null,
    );

    const { data, setData, post, processing, errors } = useForm<{
        title: string;
        url: string;
        is_active: boolean;
        image: File | null;
    }>({
        title: banner?.title ?? '',
        url: banner?.url || 'https://teer.id/fot98sbqcmggbrot2l0l',
        is_active: banner?.is_active ?? true,
        image: null,
    });

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0] ?? null;
        setData('image', file);
        if (file) {
            setPreviewUrl(URL.createObjectURL(file));
        }
    };

    const handleCancelFile = () => {
        setData('image', null);
        setPreviewUrl(banner?.image_url ?? null);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/donation-banner', {
            forceFormData: true,
            preserveScroll: true,
        });
    };

    const handleDeleteClick = () => {
        setIsDeleteModalOpen(true);
    };

    const handleConfirmDelete = () => {
        router.delete('/donation-banner', {
            preserveScroll: true,
            onSuccess: () => {
                setPreviewUrl(null);
                setData({
                    title: '',
                    url: '',
                    is_active: false,
                    image: null,
                });
                if (fileInputRef.current) {
                    fileInputRef.current.value = '';
                }
            },
        });
    };

    const formatFileSize = (bytes: number): string => {
        if (bytes < 1024 * 1024) {
            return `${(bytes / 1024).toFixed(1)} KB`;
        }
        return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
    };

    const canDelete = Boolean(banner?.is_active || banner?.image_url);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Banner Donasi" />

            <div
                className="mx-auto w-full space-y-8 p-4 sm:p-6 lg:p-8"
                style={{ fontFamily: "'Outfit', sans-serif" }}
            >
                {/* Header Hero Section */}
                <div className="relative overflow-hidden rounded-xl border border-slate-300 bg-[#f5f6ff] p-6 shadow-sm sm:p-8 md:p-10 dark:border-slate-800 dark:bg-[#0d0f17]">
                    <div
                        className="pointer-events-none absolute inset-0 z-0 opacity-70 dark:opacity-40"
                        style={{
                            backgroundImage: `
                                radial-gradient(circle at top right, rgba(124, 92, 255, 0.12), transparent 70%),
                                radial-gradient(circle at bottom left, rgba(250, 204, 21, 0.10), transparent 60%)
                            `,
                        }}
                    />

                    <div className="absolute top-0 right-8 left-8 z-0 h-px bg-gradient-to-r from-transparent via-slate-300 to-transparent dark:via-slate-700" />

                    <div className="relative z-10 flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
                        <div className="max-w-2xl space-y-3">
                            <span className="inline-flex items-center gap-1.5 text-[0.65rem] font-semibold tracking-[0.2em] text-indigo-500 uppercase dark:text-indigo-400">
                                <HeartHandshake className="h-3.5 w-3.5" />
                                Platform Support
                            </span>

                            <h1 className="text-2xl leading-snug font-semibold tracking-tight text-slate-800 md:text-[28px] dark:text-white">
                                Banner Donasi (Saweria / Trakteer)
                            </h1>

                            <p className="text-sm leading-relaxed text-slate-500 md:text-[15px] dark:text-slate-400/60">
                                Kelola gambar banner dan tautan donasi
                                (Saweria, Trakteer, atau platform dukungan
                                lainnya) yang akan ditampilkan pada section Home
                                di halaman utama.
                            </p>
                        </div>
                    </div>
                </div>

                {flash?.success && (
                    <div className="flex items-center gap-2.5 rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-sm font-medium text-emerald-700 dark:text-emerald-300">
                        <CheckCircle2 className="h-4 w-4 shrink-0" />
                        <span>{flash.success}</span>
                    </div>
                )}

                {/* Form & Preview Area */}
                <div className="grid gap-8 lg:grid-cols-12">
                    <form
                        onSubmit={handleSubmit}
                        className="space-y-6 rounded-xl border border-slate-300 bg-white p-6 lg:col-span-7 dark:border-slate-800 dark:bg-gradient-to-b dark:from-[#0e0e1a] dark:to-[#090910]"
                    >
                        {/* Image Upload */}
                        <div>
                            <label className="mb-2 block text-sm font-semibold text-slate-800 dark:text-slate-200">
                                Gambar Banner Donasi{' '}
                                {!banner?.image_url && !data.image && (
                                    <span className="text-rose-500">*</span>
                                )}
                            </label>

                            {data.image ? (
                                <div className="flex items-center justify-between rounded-xl border border-indigo-500/40 bg-indigo-50/50 p-4 dark:border-indigo-400/30 dark:bg-indigo-950/30">
                                    <div className="flex min-w-0 items-center gap-3">
                                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-indigo-500/15 text-indigo-600 dark:text-indigo-400">
                                            <ImageIcon className="h-5 w-5" />
                                        </div>
                                        <div className="min-w-0">
                                            <p className="truncate text-sm font-semibold text-slate-800 dark:text-slate-200">
                                                {data.image.name}
                                            </p>
                                            <p className="text-xs text-slate-500 dark:text-slate-400">
                                                {formatFileSize(data.image.size)} • File baru dipilih
                                            </p>
                                        </div>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={handleCancelFile}
                                        title="Batalkan pilihan gambar"
                                        className="inline-flex cursor-pointer items-center gap-1 rounded-lg border border-slate-300 bg-white px-2.5 py-1.5 text-xs font-semibold text-slate-700 shadow-sm transition hover:bg-slate-100 hover:text-rose-600 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-rose-400"
                                    >
                                        <X className="h-3.5 w-3.5" />
                                        Batal
                                    </button>
                                </div>
                            ) : (
                                <label className="group flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-slate-300 bg-slate-50/60 p-6 text-center transition hover:border-indigo-500 hover:bg-indigo-50/30 dark:border-slate-700 dark:bg-slate-900/40 dark:hover:border-indigo-400 dark:hover:bg-indigo-950/20">
                                    <Upload className="mb-2 h-8 w-8 text-slate-400 transition group-hover:text-indigo-500" />
                                    <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                                        Klik untuk memilih gambar banner
                                    </span>
                                    <span className="mt-1 text-xs text-slate-400">
                                        PNG, JPG, JPEG, atau WEBP (Maks. 4MB)
                                    </span>
                                    <input
                                        ref={fileInputRef}
                                        type="file"
                                        accept="image/png,image/jpeg,image/webp"
                                        onChange={handleFileChange}
                                        className="hidden"
                                    />
                                </label>
                            )}

                            {/* Rekomendasi Rasio Aspect */}
                            <div className="mt-2.5 flex items-start gap-2 rounded-lg border border-indigo-200/60 bg-indigo-50/50 p-2.5 text-xs text-indigo-700 dark:border-indigo-900/40 dark:bg-indigo-950/20 dark:text-indigo-300">
                                <Info className="mt-0.5 h-4 w-4 shrink-0 text-indigo-500" />
                                <span className="leading-relaxed">
                                    <strong>Panduan Desain:</strong> Gunakan gambar berformat landscape dengan rasio <strong>~3.5:1</strong> (misal <strong>450 × 130 px</strong> atau <strong>225 × 65 px</strong>) agar gambar tampil proporsional tanpa terpotong di pojok kiri atas Home.
                                </span>
                            </div>

                            {errors.image && (
                                <p className="mt-1.5 text-xs font-medium text-rose-500">
                                    {errors.image}
                                </p>
                            )}
                        </div>

                        {/* URL Link */}
                        <div>
                            <label className="mb-2 block text-sm font-semibold text-slate-800 dark:text-slate-200">
                                URL Link Saweria / Trakteer{' '}
                                <span className="text-rose-500">*</span>
                            </label>
                            <input
                                type="text"
                                required
                                value={data.url}
                                onChange={(e) => setData('url', e.target.value)}
                                placeholder="https://teer.id/fot98sbqcmggbrot2l0l atau teer.id/username"
                                className="w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 placeholder-slate-400 focus:border-indigo-500 focus:outline-none dark:border-slate-700 dark:bg-slate-900 dark:text-white"
                            />
                            <p className="mt-1 text-[11px] text-slate-500 dark:text-slate-400">
                                Masukkan URL lengkap platform donasi (otomatis ditambahkan awalan https:// jika belum ada).
                            </p>
                            {errors.url && (
                                <p className="mt-1.5 text-xs font-medium text-rose-500">
                                    {errors.url}
                                </p>
                            )}
                        </div>

                        {/* Optional Title / Caption */}
                        <div>
                            <label className="mb-2 block text-sm font-semibold text-slate-800 dark:text-slate-200">
                                Judul / Label Banner (Opsional)
                            </label>
                            <input
                                type="text"
                                value={data.title}
                                onChange={(e) =>
                                    setData('title', e.target.value)
                                }
                                placeholder="Contoh: Dukung Platform SkillVentura via Saweria / Trakteer"
                                className="w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 placeholder-slate-400 focus:border-indigo-500 focus:outline-none dark:border-slate-700 dark:bg-slate-900 dark:text-white"
                            />
                            {errors.title && (
                                <p className="mt-1.5 text-xs font-medium text-rose-500">
                                    {errors.title}
                                </p>
                            )}
                        </div>

                        {/* Active Toggle */}
                        <div className="flex items-center justify-between rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 dark:border-slate-800 dark:bg-slate-900/60">
                            <div>
                                <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                                    Tampilkan di Section Home
                                </p>
                                <p className="text-xs text-slate-500 dark:text-slate-400">
                                    Jika aktif, banner akan muncul di halaman
                                    utama (Home) bagi semua pengunjung.
                                </p>
                            </div>
                            <input
                                type="checkbox"
                                checked={data.is_active}
                                onChange={(e) =>
                                    setData('is_active', e.target.checked)
                                }
                                className="h-5 w-5 cursor-pointer rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                            />
                        </div>

                        {/* Buttons */}
                        <div className="flex flex-wrap items-center gap-3 pt-2">
                            <button
                                type="submit"
                                disabled={processing}
                                className="cursor-pointer rounded-lg bg-[#7C5CFF] px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-[#6a48eb] disabled:opacity-50"
                            >
                                {processing ? 'Menyimpan...' : 'Simpan Banner'}
                            </button>

                            {canDelete && (
                                <button
                                    type="button"
                                    onClick={handleDeleteClick}
                                    className="inline-flex cursor-pointer items-center gap-1.5 rounded-lg border border-rose-500/30 bg-rose-500/10 px-4 py-2.5 text-sm font-semibold text-rose-600 transition hover:bg-rose-500/20 dark:text-rose-400"
                                >
                                    <Trash2 className="h-4 w-4" />
                                    Hapus Banner
                                </button>
                            )}
                        </div>
                    </form>

                    {/* Live Preview Card */}
                    <div className="space-y-4 rounded-xl border border-slate-300 bg-white p-6 lg:col-span-5 dark:border-slate-800 dark:bg-gradient-to-b dark:from-[#0e0e1a] dark:to-[#090910]">
                        <div className="flex items-center justify-between">
                            <div>
                                <h2 className="text-base font-semibold text-slate-800 dark:text-white">
                                    Pratinjau Banner
                                </h2>
                                <p className="text-xs text-slate-500 dark:text-slate-400">
                                    Ukuran aktual di pojok kiri atas section Home.
                                </p>
                            </div>

                            {previewUrl && (
                                <div>
                                    {data.is_active ? (
                                        <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2 py-0.5 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">
                                            <CheckCircle2 className="h-3 w-3" />
                                            Aktif di Home
                                        </span>
                                    ) : (
                                        <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/10 px-2 py-0.5 text-[11px] font-semibold text-amber-600 dark:text-amber-400">
                                            <AlertCircle className="h-3 w-3" />
                                            Non-aktif
                                        </span>
                                    )}
                                </div>
                            )}
                        </div>

                        {previewUrl ? (
                            <div className="space-y-3">
                                <div className="max-w-[225px] overflow-hidden rounded-lg border border-[#FACC15]/80 bg-[#13174D] shadow-lg">
                                    <a
                                        href={
                                            data.url
                                                ? data.url.startsWith('http')
                                                    ? data.url
                                                    : `https://${data.url}`
                                                : '#'
                                        }
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="group block"
                                    >
                                        <div className="relative overflow-hidden">
                                            <img
                                                src={previewUrl}
                                                alt={
                                                    data.title ||
                                                    'Donation Banner'
                                                }
                                                className="h-16 w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                                            />
                                            <div className="flex items-center justify-between gap-1.5 bg-gradient-to-r from-[#13174D] via-[#1D215D] to-[#13174D] px-2.5 py-1.5 text-white">
                                                <div className="flex min-w-0 items-center gap-1.5">
                                                    <span className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-[#FACC15] text-slate-950 shadow">
                                                        <HeartHandshake className="h-2.5 w-2.5" />
                                                    </span>
                                                    <span className="truncate font-['Oxanium'] text-[10px] font-bold tracking-wide sm:text-[11px]">
                                                        {data.title ||
                                                            'Support Trakteer'}
                                                    </span>
                                                </div>
                                                <span className="inline-flex shrink-0 items-center gap-0.5 rounded bg-[#FACC15] px-1.5 py-0.5 font-['Orbitron'] text-[9px] font-extrabold text-slate-950 transition group-hover:bg-yellow-300">
                                                    Donate
                                                    <ExternalLink className="h-2.5 w-2.5" />
                                                </span>
                                            </div>
                                        </div>
                                    </a>
                                </div>
                                {data.url && (
                                    <p className="truncate text-xs text-slate-500 dark:text-slate-400">
                                        Target URL:{' '}
                                        <a
                                            href={data.url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-indigo-500 underline"
                                        >
                                            {data.url}
                                        </a>
                                    </p>
                                )}
                            </div>
                        ) : (
                            <div className="flex h-48 flex-col items-center justify-center rounded-xl border border-dashed border-slate-300 bg-slate-50 p-6 text-center dark:border-slate-800 dark:bg-slate-900/40">
                                <ImageIcon className="mb-2 h-8 w-8 text-slate-400" />
                                <p className="text-xs font-medium text-slate-600 dark:text-slate-300">
                                    Banner donasi sedang non-aktif
                                </p>
                                <p className="mt-1 text-[11px] text-slate-400">
                                    Unggah gambar dan aktifkan toggle untuk menampilkan banner di Home.
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Modal Konfirmasi Hapus Banner */}
            <ConfirmModal
                open={isDeleteModalOpen}
                title="Hapus Banner Donasi"
                message="Apakah Anda yakin ingin menghapus banner donasi dari halaman Home? Tindakan ini akan menghapus gambar yang tersimpan dan menyembunyikan banner dari pengunjung."
                confirmText="Ya, Hapus Banner"
                cancelText="Batal"
                variant="danger"
                onConfirm={handleConfirmDelete}
                onClose={() => setIsDeleteModalOpen(false)}
            />
        </AppLayout>
    );
}
