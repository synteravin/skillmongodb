import AppLayout from '@/layouts/app-layout';
import { router } from '@inertiajs/react';
import {
    Trash2,
    Plus,
    FileText,
    Video,
    Image as ImageIcon,
    ArrowLeft,
} from 'lucide-react';
import { useState } from 'react';
import ConfirmModal from '@/components/ui/ConfirmModal';

export default function ModuleShow({ module }: any) {
    const [confirmModal, setConfirmModal] = useState<{
        open: boolean;
        title: string;
        message: string;
        confirmText: string;
        variant: 'danger' | 'info' | 'primary';
        onConfirm: () => void;
    }>({
        open: false,
        title: '',
        message: '',
        confirmText: 'Confirm',
        variant: 'danger',
        onConfirm: () => {},
    });

    const handleDeleteContent = (contentId: string) => {
        setConfirmModal({
            open: true,
            title: 'Hapus Blok Konten',
            message: 'Apakah Anda yakin ingin menghapus blok konten ini?',
            confirmText: 'Hapus Konten',
            variant: 'danger',
            onConfirm: () => {
                router.delete(`/admin/module-contents/${contentId}`);
            },
        });
    };

    const getYoutubeId = (url: string) => {
        const regExp = /(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&]+)/;
        const match = url.match(regExp);
        return match ? match[1] : null;
    };

    const renderContent = (item: any) => {
        const url = item.content?.url;

        switch (item.type) {
            case 'text':
                return (
                    <div className="flex flex-col gap-2">
                        <h3 className="text-lg font-bold text-slate-800 dark:text-white">
                            {item.content.title}
                        </h3>
                        <p className="text-slate-655 dark:text-slate-355 text-sm leading-relaxed whitespace-pre-wrap">
                            {item.content.description}
                        </p>
                    </div>
                );

            case 'image':
                return (
                    <div className="flex flex-col gap-3">
                        {item.content.title && (
                            <h3 className="text-lg font-bold text-slate-800 dark:text-white">
                                {item.content.title}
                            </h3>
                        )}
                        {url && (
                            <div className="max-w-xl overflow-hidden rounded-xl border border-slate-200 dark:border-white/10">
                                <img
                                    src={url}
                                    alt=""
                                    className="h-auto w-full object-cover"
                                />
                            </div>
                        )}
                    </div>
                );

            case 'video':
                return (
                    <div className="flex flex-col gap-3">
                        {item.content.title && (
                            <h3 className="text-lg font-bold text-slate-800 dark:text-white">
                                {item.content.title}
                            </h3>
                        )}
                        {url && (
                            <video
                                src={url}
                                controls
                                className="w-full max-w-2xl rounded-xl border border-slate-200 dark:border-white/10"
                            />
                        )}
                    </div>
                );

            case 'youtube':
                const ytId = url ? getYoutubeId(url) : null;
                return (
                    <div className="flex flex-col gap-3">
                        {item.content.title && (
                            <h3 className="text-lg font-bold text-slate-800 dark:text-white">
                                {item.content.title}
                            </h3>
                        )}
                        {ytId ? (
                            <div className="aspect-video max-w-2xl overflow-hidden rounded-xl border border-slate-200 dark:border-white/10">
                                <iframe
                                    src={`https://www.youtube.com/embed/${ytId}`}
                                    className="h-full w-full"
                                    allowFullScreen
                                />
                            </div>
                        ) : (
                            <p className="text-sm text-slate-400">
                                Invalid YouTube URL
                            </p>
                        )}
                    </div>
                );

            case 'file':
                return (
                    <div className="flex flex-col gap-3">
                        {item.content.title && (
                            <h3 className="text-lg font-bold text-slate-800 dark:text-white">
                                {item.content.title}
                            </h3>
                        )}
                        {url && (
                            <a
                                href={url}
                                target="_blank"
                                rel="noreferrer"
                                className="inline-flex items-center gap-2 text-sm font-medium text-[#7C5CFF] hover:underline"
                            >
                                <FileText size={16} />
                                View Attached File
                            </a>
                        )}
                    </div>
                );

            default:
                return null;
        }
    };

    return (
        <AppLayout>
            <div className="relative min-h-screen overflow-hidden bg-[#f8fafc] p-4 text-slate-800 sm:p-6 lg:p-8 dark:bg-[#030712] dark:text-white">
                <div className="relative z-10 mx-auto flex max-w-5xl flex-col gap-6">
                    {/* HEADER */}
                    <header
                        className="relative overflow-hidden rounded-xl border border-slate-200 bg-[#f5f6ff] px-6 py-5 dark:border-white/5 dark:bg-[#0d0f17]"
                        style={{
                            backgroundImage: `
                                linear-gradient(rgba(59,40,246,0.07) 1px, transparent 1px),
                                linear-gradient(90deg, rgba(59,40,246,0.07) 1px, transparent 1px)
                            `,
                            backgroundSize: '40px 40px',
                        }}
                    >
                        {/* Corner brackets */}
                        <span className="absolute top-3.5 left-3.5 h-3 w-3 border-t border-l border-[rgba(59,40,246,0.2)] dark:border-[rgba(59,40,246,0.45)]" />
                        <span className="absolute top-3.5 right-3.5 h-3 w-3 border-t border-r border-[rgba(59,40,246,0.2)] dark:border-[rgba(59,40,246,0.45)]" />
                        <span className="absolute bottom-3.5 left-3.5 h-3 w-3 border-b border-l border-[rgba(59,40,246,0.2)] dark:border-[rgba(59,40,246,0.45)]" />
                        <span className="absolute right-3.5 bottom-3.5 h-3 w-3 border-r border-b border-[rgba(59,40,246,0.2)] dark:border-[rgba(59,40,246,0.45)]" />

                        <div className="relative z-10 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                            <div className="flex flex-col gap-2">
                                <button
                                    onClick={() => window.history.back()}
                                    className="mb-1 flex items-center gap-1.5 text-xs font-semibold tracking-wider text-slate-500 uppercase transition-colors hover:text-[#3B28F6] dark:text-slate-400 dark:hover:text-[#7C5CFF]"
                                >
                                    <ArrowLeft size={14} /> Back
                                </button>

                                {/* Badge */}
                                <div className="inline-flex w-fit items-center gap-1.5 rounded border border-[rgba(59,40,246,0.2)] bg-[rgba(59,40,246,0.06)] px-2.5 py-1 dark:border-[rgba(59,40,246,0.35)] dark:bg-[rgba(59,40,246,0.1)]">
                                    <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[#3B28F6]" />
                                    <span className="text-[10px] font-bold tracking-[0.12em] text-[#3B28F6] uppercase">
                                        Module Contents
                                    </span>
                                </div>

                                <h1
                                    className="m-0 text-2xl leading-none font-bold tracking-tight text-[#3B28F6] sm:text-3xl dark:text-[#7C5CFF]"
                                    style={{
                                        fontFamily: 'Orbitron, sans-serif',
                                    }}
                                >
                                    {module.title}
                                </h1>
                                <p className="m-0 text-xs text-slate-600/75 sm:text-sm dark:text-slate-400/70">
                                    Manage your module content blocks
                                </p>
                            </div>

                            {/* ADD CONTENT */}
                            <button
                                onClick={() =>
                                    router.visit(
                                        `/admin/modules/create?path_id=${module.path_id}`,
                                    )
                                }
                                className="inline-flex animate-in items-center gap-2 rounded-xl bg-[#3B28F6] px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:-translate-y-0.5 hover:bg-[#2a1ce0]"
                            >
                                <Plus size={18} />
                                Add Content
                            </button>
                        </div>
                    </header>

                    {/* CONTENT LIST */}
                    <div className="flex flex-col gap-6">
                        {module.contents.length === 0 && (
                            <div className="rounded-xl border border-slate-200 bg-white p-10 text-center shadow-sm dark:border-slate-800 dark:bg-[#060B1A]/40">
                                <p className="font-medium text-slate-500 dark:text-slate-400">
                                    Belum ada content di module ini
                                </p>
                            </div>
                        )}

                        {module.contents.map((item: any, index: number) => (
                            <div
                                key={item._id}
                                className="group relative rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition-all duration-300 hover:border-[#3B28F6]/50 hover:shadow-md dark:border-slate-800/80 dark:bg-[#060B1A]/80 dark:hover:border-[#7C5CFF]/50 dark:hover:shadow-lg dark:hover:shadow-[#7C5CFF]/5"
                            >
                                {/* Top accent line */}
                                <div className="absolute top-0 right-8 left-8 h-px bg-gradient-to-r from-transparent via-slate-200 to-transparent dark:via-slate-800" />

                                {/* ORDER BADGE */}
                                <div className="absolute top-4 -left-3 flex h-6 w-6 items-center justify-center rounded-full bg-[#3B28F6] text-xs font-bold text-white shadow dark:bg-[#7C5CFF]">
                                    {index + 1}
                                </div>

                                {/* CONTENT */}
                                <div className="flex flex-col gap-4 pl-2">
                                    {renderContent(item)}

                                    {/* FOOTER */}
                                    <div className="mt-2 flex items-center justify-between border-t border-slate-100 pt-3 dark:border-white/5">
                                        <span className="text-slate-450 text-[10px] font-bold tracking-[0.15em] uppercase dark:text-slate-500">
                                            Type: {item.type}
                                        </span>

                                        {/* DELETE */}
                                        <button
                                            onClick={() =>
                                                handleDeleteContent(item._id)
                                            }
                                            className="flex cursor-pointer items-center gap-1.5 text-xs font-bold text-rose-500 transition hover:text-rose-600"
                                        >
                                            <Trash2 size={14} />
                                            Delete
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
            <ConfirmModal
                open={confirmModal.open}
                onClose={() =>
                    setConfirmModal((prev) => ({ ...prev, open: false }))
                }
                onConfirm={confirmModal.onConfirm}
                title={confirmModal.title}
                message={confirmModal.message}
                confirmText={confirmModal.confirmText}
                variant={confirmModal.variant}
            />
        </AppLayout>
    );
}
