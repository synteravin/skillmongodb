import { Head, Link, router, useForm, usePage } from '@inertiajs/react';
import {
    ArrowUpRight,
    CheckCircle2,
    ExternalLink,
    Eye,
    Globe,
    HeartHandshake,
    Info,
    RefreshCw,
    Save,
    Sparkles,
    Tag,
    Trash2,
    Upload,
    X,
} from 'lucide-react';
import React, { useRef, useState } from 'react';
import ConfirmModal from '@/components/ui/ConfirmModal';
import DonationBannerCard from '@/components/Welcome/DonationBannerCard';
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
    const [isDragging, setIsDragging] = useState(false);

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

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
        const file = e.dataTransfer.files?.[0] ?? null;
        if (file) {
            setData('image', file);
            setPreviewUrl(URL.createObjectURL(file));
        }
    };

    const handleCancelFile = (e?: React.MouseEvent) => {
        if (e) {
            e.stopPropagation();
        }
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
            <Head title="Pengaturan Banner Donasi" />

            <div
                className="mx-auto w-full max-w-6xl space-y-5 p-4 sm:p-6 lg:p-8"
                style={{ fontFamily: "'Outfit', sans-serif" }}
            >
                {/* Header Hero Section - Compact & Sleek */}
                <div className="relative overflow-hidden rounded-xl border border-slate-200/80 bg-[#f5f6ff] px-5 py-4 shadow-2xs sm:px-6 sm:py-5 dark:border-slate-800/80 dark:bg-[#0d0f17]">
                    <div
                        className="pointer-events-none absolute inset-0 z-0 opacity-60 dark:opacity-30"
                        style={{
                            backgroundImage: `
                                radial-gradient(circle at top right, rgba(124, 92, 255, 0.12), transparent 70%),
                                radial-gradient(circle at bottom left, rgba(250, 204, 21, 0.10), transparent 60%)
                            `,
                        }}
                    />

                    <div className="relative z-10 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                        <div className="space-y-1">
                            <div className="flex items-center gap-2">
                                <span className="inline-flex items-center gap-1 rounded-full border border-indigo-500/20 bg-indigo-500/10 px-2.5 py-0.5 text-[0.62rem] font-semibold tracking-wider text-indigo-600 uppercase dark:text-indigo-400">
                                    <HeartHandshake className="h-3 w-3 text-amber-500" />
                                    Platform Configuration
                                </span>
                            </div>

                            <h1 className="text-xl font-bold tracking-tight text-slate-900 sm:text-2xl dark:text-white">
                                Banner Donasi (Saweria / Trakteer)
                            </h1>

                            <p className="text-xs text-slate-500 sm:text-sm dark:text-slate-400">
                                Kelola media banner donasi dan tautan platform
                                dukungan di section Hero halaman utama.
                            </p>
                        </div>

                        <div className="flex shrink-0 items-center gap-2 pt-1 sm:pt-0">
                            <Link
                                href="/"
                                target="_blank"
                                className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white/90 px-3 py-1.5 text-xs font-semibold text-slate-700 shadow-2xs backdrop-blur-md transition hover:bg-slate-100 hover:text-indigo-600 dark:border-slate-700 dark:bg-slate-900/80 dark:text-slate-200 dark:hover:bg-slate-800"
                            >
                                <Eye className="h-3.5 w-3.5" />
                                <span>Lihat di Home</span>
                                <ArrowUpRight className="h-3 w-3" />
                            </Link>
                        </div>
                    </div>
                </div>

                {flash?.success && (
                    <div className="flex items-center gap-2.5 rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-2.5 text-xs font-medium text-emerald-700 sm:text-sm dark:text-emerald-300">
                        <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-500" />
                        <span>{flash.success}</span>
                    </div>
                )}

                {/* SINGLE MASTER CARD UNIFIED CONTAINER */}
                <div className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm dark:border-slate-800/80 dark:bg-[#0c0e17]">
                    {/* Master Card Top Bar */}
                    <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 px-6 py-4 dark:border-slate-800/80">
                        <div className="flex items-center gap-2.5">
                            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
                                <Sparkles className="h-4 w-4 text-amber-500" />
                            </div>
                            <div>
                                <h2 className="text-sm font-bold text-slate-900 sm:text-base dark:text-white">
                                    Konfigurasi & Pratinjau Banner
                                </h2>
                                <p className="text-xs text-slate-500 dark:text-slate-400">
                                    Pratinjau visual dan form pengaturan dalam
                                    satu panel terpadu.
                                </p>
                            </div>
                        </div>

                        <div>
                            {data.is_active ? (
                                <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-bold text-emerald-600 dark:text-emerald-400">
                                    <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                                    Aktif di Home
                                </span>
                            ) : (
                                <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-500/10 px-3 py-1 text-xs font-bold text-slate-500 dark:text-slate-400">
                                    <span className="h-2 w-2 rounded-full bg-slate-400" />
                                    Disembunyikan
                                </span>
                            )}
                        </div>
                    </div>

                    {/* Master Form with Interior Columns */}
                    <form onSubmit={handleSubmit}>
                        <div className="grid gap-0 lg:grid-cols-12 lg:divide-x divide-slate-100 dark:divide-slate-800/80">
                            {/* SISI KIRI: Visual Banner & Interactive Dropzone Preview */}
                            <div className="flex flex-col justify-between space-y-4 p-6 sm:p-7 lg:col-span-5">
                                <div className="space-y-3">
                                    <div className="flex items-center justify-between">
                                        <span className="text-xs font-semibold tracking-wider text-slate-700 uppercase dark:text-slate-300">
                                            Visual & Pratinjau
                                        </span>
                                        <span className="text-[11px] font-medium text-slate-400">
                                            Skala Hero: ~180px
                                        </span>
                                    </div>

                                    {/* Unified Interactive Dropzone & Preview Canvas */}
                                    <div
                                        onDragOver={handleDragOver}
                                        onDragLeave={handleDragLeave}
                                        onDrop={handleDrop}
                                        onClick={() =>
                                            fileInputRef.current?.click()
                                        }
                                        className={`group relative flex min-h-[220px] cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed p-5 transition-all duration-200 ${
                                            isDragging
                                                ? 'border-indigo-500 bg-indigo-50/70 dark:border-indigo-400 dark:bg-indigo-950/40'
                                                : 'border-slate-300/80 bg-slate-50/60 hover:border-indigo-500/70 hover:bg-slate-50/90 dark:border-slate-700/80 dark:bg-slate-900/30 dark:hover:border-indigo-400/60'
                                        }`}
                                    >
                                        <input
                                            ref={fileInputRef}
                                            type="file"
                                            accept="image/png,image/jpeg,image/webp"
                                            onChange={handleFileChange}
                                            className="hidden"
                                        />

                                        {previewUrl ? (
                                            <div className="w-full space-y-3 text-center">
                                                {/* Status badge when new file is selected */}
                                                {data.image && (
                                                    <div className="mx-auto flex max-w-xs items-center justify-between rounded-lg border border-indigo-400/30 bg-indigo-500/10 px-2.5 py-1 text-xs text-indigo-700 dark:text-indigo-300">
                                                        <span className="truncate font-medium text-[11px]">
                                                            {data.image.name} (
                                                            {formatFileSize(
                                                                data.image.size,
                                                            )}
                                                            )
                                                        </span>
                                                        <button
                                                            type="button"
                                                            onClick={
                                                                handleCancelFile
                                                            }
                                                            title="Batalkan pilihan"
                                                            className="ml-2 inline-flex shrink-0 items-center gap-0.5 rounded bg-white/80 px-1.5 py-0.5 text-[9px] font-bold text-rose-600 hover:bg-rose-50 dark:bg-slate-900/80 dark:text-rose-400"
                                                        >
                                                            <X className="h-3 w-3" />
                                                            Batal
                                                        </button>
                                                    </div>
                                                )}

                                                {/* Card Preview */}
                                                <div className="flex justify-center">
                                                    <div className="w-full max-w-[180px] pointer-events-none transition-transform duration-200 group-hover:scale-[1.02]">
                                                        <DonationBannerCard
                                                            title={data.title}
                                                            url={data.url}
                                                            imageUrl={previewUrl}
                                                            isAdminOrMentor={
                                                                false
                                                            }
                                                        />
                                                    </div>
                                                </div>

                                                {/* Floating prompt */}
                                                <div className="inline-flex items-center gap-1.5 rounded-full bg-white/90 px-3 py-1 text-[11px] font-semibold text-indigo-600 shadow-2xs backdrop-blur-xs transition group-hover:bg-indigo-600 group-hover:text-white dark:bg-slate-900/90 dark:text-indigo-400 dark:group-hover:bg-indigo-600 dark:group-hover:text-white">
                                                    <RefreshCw className="h-3 w-3 transition-transform duration-300 group-hover:rotate-180" />
                                                    <span>
                                                        Klik / seret untuk ganti
                                                        gambar
                                                    </span>
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="py-4 text-center">
                                                <div className="mx-auto mb-2.5 flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-500/10 text-indigo-600 transition-transform duration-200 group-hover:scale-110 dark:text-indigo-400">
                                                    <Upload className="h-5 w-5" />
                                                </div>
                                                <p className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                                                    Tarik & lepas gambar, atau{' '}
                                                    <span className="text-indigo-600 underline underline-offset-2 dark:text-indigo-400">
                                                        pilih file
                                                    </span>
                                                </p>
                                                <p className="mt-1 text-[10px] text-slate-400 dark:text-slate-500">
                                                    PNG, JPG, JPEG, atau WEBP
                                                    (Maks. 4MB)
                                                </p>
                                            </div>
                                        )}

                                        {/* Dragging State Overlay */}
                                        {isDragging && (
                                            <div className="pointer-events-none absolute inset-0 z-20 flex flex-col items-center justify-center rounded-xl bg-indigo-600/90 text-white backdrop-blur-xs">
                                                <Upload className="mb-2 h-7 w-7 animate-bounce" />
                                                <p className="text-xs font-bold">
                                                    Lepaskan file gambar di sini
                                                </p>
                                            </div>
                                        )}
                                    </div>

                                    {errors.image && (
                                        <p className="text-xs font-medium text-rose-500">
                                            {errors.image}
                                        </p>
                                    )}
                                </div>

                                {/* Guidance Note */}
                                <div className="flex items-start gap-2 rounded-xl border border-indigo-200/50 bg-indigo-50/40 p-2.5 text-xs text-indigo-800 dark:border-indigo-900/30 dark:bg-indigo-950/20 dark:text-indigo-300">
                                    <Info className="mt-0.5 h-3.5 w-3.5 shrink-0 text-indigo-500" />
                                    <div className="text-[11px] leading-relaxed">
                                        <strong className="font-semibold">
                                            Rasio Ideal (~2.7 : 1):
                                        </strong>{' '}
                                        Rekomendasi{' '}
                                        <span className="font-semibold text-indigo-950 dark:text-indigo-200">
                                            540 × 200 px
                                        </span>{' '}
                                        atau{' '}
                                        <span className="font-semibold text-indigo-950 dark:text-indigo-200">
                                            450 × 165 px
                                        </span>
                                        .
                                    </div>
                                </div>
                            </div>

                            {/* SISI KANAN: Form Pengaturan Detail */}
                            <div className="flex flex-col justify-between space-y-5 p-6 sm:p-7 lg:col-span-7">
                                <div className="space-y-4">
                                    {/* Input: URL Link */}
                                    <div className="space-y-1.5">
                                        <label className="flex items-center justify-between text-xs font-semibold tracking-wider text-slate-700 uppercase dark:text-slate-300">
                                            <span>URL Tautan Donasi</span>
                                            <span className="text-[11px] font-bold text-amber-500">
                                                Wajib
                                            </span>
                                        </label>

                                        <div className="relative">
                                            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400 dark:text-slate-500">
                                                <Globe className="h-4 w-4" />
                                            </div>
                                            <input
                                                type="text"
                                                required
                                                value={data.url}
                                                onChange={(e) =>
                                                    setData(
                                                        'url',
                                                        e.target.value,
                                                    )
                                                }
                                                placeholder="https://teer.id/username atau saweria.co/username"
                                                className="w-full rounded-xl border border-slate-200 bg-slate-50/50 py-2.5 pr-4 pl-10 text-sm font-medium text-slate-900 placeholder-slate-400 transition-all focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-500/10 focus:outline-none dark:border-slate-800 dark:bg-slate-900/60 dark:text-white dark:focus:bg-slate-900"
                                            />
                                        </div>

                                        <div className="flex flex-wrap items-center gap-1.5 pt-0.5">
                                            <span className="text-[11px] text-slate-400">
                                                Platform:
                                            </span>
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    setData(
                                                        'url',
                                                        'https://teer.id/fot98sbqcmggbrot2l0l',
                                                    )
                                                }
                                                className="inline-flex cursor-pointer items-center rounded-md border border-slate-200 bg-white px-2 py-0.5 text-[10px] font-semibold text-slate-600 hover:border-indigo-300 hover:text-indigo-600 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-400 dark:hover:text-indigo-300"
                                            >
                                                Trakteer (teer.id/...)
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    setData(
                                                        'url',
                                                        'https://saweria.co/username',
                                                    )
                                                }
                                                className="inline-flex cursor-pointer items-center rounded-md border border-slate-200 bg-white px-2 py-0.5 text-[10px] font-semibold text-slate-600 hover:border-indigo-300 hover:text-indigo-600 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-400 dark:hover:text-indigo-300"
                                            >
                                                Saweria (saweria.co/...)
                                            </button>
                                        </div>

                                        {errors.url && (
                                            <p className="text-xs font-medium text-rose-500">
                                                {errors.url}
                                            </p>
                                        )}
                                    </div>

                                    {/* Input: Judul Banner */}
                                    <div className="space-y-1.5">
                                        <label className="flex items-center justify-between text-xs font-semibold tracking-wider text-slate-700 uppercase dark:text-slate-300">
                                            <span>Judul / Label Banner</span>
                                            <span className="text-[11px] font-medium text-slate-400">
                                                Opsional
                                            </span>
                                        </label>

                                        <div className="relative">
                                            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400 dark:text-slate-500">
                                                <Tag className="h-4 w-4" />
                                            </div>
                                            <input
                                                type="text"
                                                value={data.title}
                                                onChange={(e) =>
                                                    setData(
                                                        'title',
                                                        e.target.value,
                                                    )
                                                }
                                                placeholder="Contoh: Dukung Pengembang Platform"
                                                className="w-full rounded-xl border border-slate-200 bg-slate-50/50 py-2.5 pr-4 pl-10 text-sm font-medium text-slate-900 placeholder-slate-400 transition-all focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-500/10 focus:outline-none dark:border-slate-800 dark:bg-slate-900/60 dark:text-white dark:focus:bg-slate-900"
                                            />
                                        </div>
                                        <p className="text-[11px] text-slate-400">
                                            Label default &quot;Dukung
                                            Pengembang Platform&quot; akan
                                            digunakan jika dikosongkan.
                                        </p>

                                        {errors.title && (
                                            <p className="text-xs font-medium text-rose-500">
                                                {errors.title}
                                            </p>
                                        )}
                                    </div>

                                    {/* Toggle: Tampilkan di Home */}
                                    <div className="flex items-center justify-between rounded-xl border border-slate-200/80 bg-slate-50/70 p-3.5 dark:border-slate-800/80 dark:bg-slate-900/50">
                                        <div className="pr-3">
                                            <div className="flex items-center gap-2">
                                                <p className="text-sm font-semibold text-slate-900 dark:text-white">
                                                    Tampilkan di Section Home
                                                </p>
                                                <span
                                                    className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-bold ${
                                                        data.is_active
                                                            ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                                                            : 'bg-slate-500/10 text-slate-500 dark:text-slate-400'
                                                    }`}
                                                >
                                                    {data.is_active
                                                        ? 'Aktif'
                                                        : 'Non-aktif'}
                                                </span>
                                            </div>
                                            <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
                                                Tampilkan banner donasi di atas
                                                judul utama halaman depan.
                                            </p>
                                        </div>

                                        {/* Custom Switch Toggle */}
                                        <button
                                            type="button"
                                            role="switch"
                                            aria-checked={data.is_active}
                                            onClick={() =>
                                                setData(
                                                    'is_active',
                                                    !data.is_active,
                                                )
                                            }
                                            className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:outline-none dark:focus:ring-offset-slate-900 ${
                                                data.is_active
                                                    ? 'bg-emerald-500'
                                                    : 'bg-slate-300 dark:bg-slate-700'
                                            }`}
                                        >
                                            <span
                                                aria-hidden="true"
                                                className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out ${
                                                    data.is_active
                                                        ? 'translate-x-5'
                                                        : 'translate-x-0'
                                                }`}
                                            />
                                        </button>
                                    </div>
                                </div>

                                {/* Action Buttons & Target Link */}
                                <div className="space-y-3 pt-3 border-t border-slate-100 dark:border-slate-800/60">
                                    <div className="flex flex-wrap items-center gap-3">
                                        <button
                                            type="submit"
                                            disabled={processing}
                                            className="inline-flex cursor-pointer items-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-[#3B28F6] px-5 py-2 text-sm font-bold text-white shadow-md shadow-indigo-500/25 transition-all duration-200 hover:from-indigo-500 hover:to-indigo-700 active:scale-95 disabled:opacity-50"
                                        >
                                            <Save className="h-4 w-4" />
                                            <span>
                                                {processing
                                                    ? 'Menyimpan...'
                                                    : 'Simpan Banner'}
                                            </span>
                                        </button>

                                        {canDelete && (
                                            <button
                                                type="button"
                                                onClick={handleDeleteClick}
                                                className="inline-flex cursor-pointer items-center gap-1.5 rounded-xl border border-rose-500/30 bg-rose-500/10 px-4 py-2 text-sm font-semibold text-rose-600 transition-all duration-200 hover:bg-rose-500/20 active:scale-95 dark:text-rose-400"
                                            >
                                                <Trash2 className="h-4 w-4" />
                                                <span>Hapus Banner</span>
                                            </button>
                                        )}
                                    </div>

                                    {previewUrl && data.url && (
                                        <div className="flex items-center justify-between rounded-lg bg-slate-50 px-3 py-2 text-xs dark:bg-slate-900/60 text-slate-500 dark:text-slate-400">
                                            <span>Target Tautan:</span>
                                            <a
                                                href={data.url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="inline-flex items-center gap-1 font-semibold text-indigo-600 hover:underline dark:text-indigo-400"
                                            >
                                                <span className="max-w-[220px] truncate">
                                                    {data.url}
                                                </span>
                                                <ExternalLink className="h-3 w-3 shrink-0" />
                                            </a>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </form>
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
