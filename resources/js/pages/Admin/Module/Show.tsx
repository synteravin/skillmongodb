import AppLayout from "@/layouts/app-layout";
import { router } from "@inertiajs/react";
import { Trash2, Plus, FileText, Video, Image as ImageIcon, ArrowLeft } from "lucide-react";
import { useState } from "react";
import ConfirmModal from "@/components/ui/ConfirmModal";

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
            case "text":
                return (
                    <div className="flex flex-col gap-2">
                        <h3 className="font-bold text-lg text-slate-800 dark:text-white">
                            {item.content.title}
                        </h3>
                        <p className="text-sm text-slate-655 dark:text-slate-355 leading-relaxed whitespace-pre-wrap">
                            {item.content.description}
                        </p>
                    </div>
                );

            case "image":
                return (
                    <div className="flex flex-col gap-3">
                        {item.content.title && (
                            <h3 className="font-bold text-lg text-slate-800 dark:text-white">
                                {item.content.title}
                            </h3>
                        )}
                        {url && (
                            <div className="rounded-xl overflow-hidden border border-slate-200 dark:border-white/10 max-w-xl">
                                <img src={url} alt="" className="w-full h-auto object-cover" />
                            </div>
                        )}
                    </div>
                );

            case "video":
                return (
                    <div className="flex flex-col gap-3">
                        {item.content.title && (
                            <h3 className="font-bold text-lg text-slate-800 dark:text-white">
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

            case "youtube":
                const ytId = url ? getYoutubeId(url) : null;
                return (
                    <div className="flex flex-col gap-3">
                        {item.content.title && (
                            <h3 className="font-bold text-lg text-slate-800 dark:text-white">
                                {item.content.title}
                            </h3>
                        )}
                        {ytId ? (
                            <div className="aspect-video max-w-2xl rounded-xl overflow-hidden border border-slate-200 dark:border-white/10">
                                <iframe
                                    src={`https://www.youtube.com/embed/${ytId}`}
                                    className="w-full h-full"
                                    allowFullScreen
                                />
                            </div>
                        ) : (
                            <p className="text-sm text-slate-400">Invalid YouTube URL</p>
                        )}
                    </div>
                );

            case "file":
                return (
                    <div className="flex flex-col gap-3">
                        {item.content.title && (
                            <h3 className="font-bold text-lg text-slate-800 dark:text-white">
                                {item.content.title}
                            </h3>
                        )}
                        {url && (
                            <a
                                href={url}
                                target="_blank"
                                rel="noreferrer"
                                className="inline-flex items-center gap-2 text-sm text-[#7C5CFF] hover:underline font-medium"
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
            <div className="relative min-h-screen bg-[#f8fafc] dark:bg-[#030712] text-slate-800 dark:text-white p-4 sm:p-6 lg:p-8 overflow-hidden">
                <div className="relative z-10 max-w-5xl mx-auto flex flex-col gap-6">

                    {/* HEADER */}
                    <header
                        className="relative overflow-hidden rounded-xl px-6 py-5 bg-[#f5f6ff] dark:bg-[#0d0f17] border border-slate-200 dark:border-white/5"
                        style={{
                            backgroundImage: `
                                linear-gradient(rgba(59,40,246,0.07) 1px, transparent 1px),
                                linear-gradient(90deg, rgba(59,40,246,0.07) 1px, transparent 1px)
                            `,
                            backgroundSize: "40px 40px",
                        }}
                    >
                        {/* Corner brackets */}
                        <span className="absolute left-3.5 top-3.5 h-3 w-3 border-l border-t dark:border-[rgba(59,40,246,0.45)] border-[rgba(59,40,246,0.2)]" />
                        <span className="absolute right-3.5 top-3.5 h-3 w-3 border-r border-t dark:border-[rgba(59,40,246,0.45)] border-[rgba(59,40,246,0.2)]" />
                        <span className="absolute bottom-3.5 left-3.5 h-3 w-3 border-b border-l dark:border-[rgba(59,40,246,0.45)] border-[rgba(59,40,246,0.2)]" />
                        <span className="absolute bottom-3.5 right-3.5 h-3 w-3 border-b border-r dark:border-[rgba(59,40,246,0.45)] border-[rgba(59,40,246,0.2)]" />

                        <div className="relative z-10 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                            <div className="flex flex-col gap-2">
                                <button 
                                    onClick={() => window.history.back()}
                                    className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400 hover:text-[#3B28F6] dark:hover:text-[#7C5CFF] transition-colors text-xs font-semibold uppercase tracking-wider mb-1"
                                >
                                    <ArrowLeft size={14} /> Back
                                </button>

                                {/* Badge */}
                                <div className="inline-flex w-fit items-center gap-1.5 rounded border px-2.5 py-1
                                    dark:border-[rgba(59,40,246,0.35)] dark:bg-[rgba(59,40,246,0.1)]
                                    border-[rgba(59,40,246,0.2)] bg-[rgba(59,40,246,0.06)]"
                                >
                                    <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[#3B28F6]" />
                                    <span className="text-[10px] font-bold uppercase tracking-[0.12em] text-[#3B28F6]">
                                        Module Contents
                                    </span>
                                </div>

                                <h1
                                    className="m-0 text-2xl sm:text-3xl font-bold leading-none tracking-tight text-[#3B28F6] dark:text-[#7C5CFF]"
                                    style={{
                                        fontFamily: "Orbitron, sans-serif",
                                    }}
                                >
                                    {module.title}
                                </h1>
                                <p className="m-0 text-xs sm:text-sm dark:text-slate-400/70 text-slate-600/75">
                                    Manage your module content blocks
                                </p>
                            </div>

                            {/* ADD CONTENT */}
                            <button
                                onClick={() =>
                                    router.visit(`/admin/modules/create?path_id=${module.path_id}`)
                                }
                                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#3B28F6] hover:bg-[#2a1ce0] text-white text-sm font-semibold shadow-sm transition-all hover:-translate-y-0.5 animate-in"
                            >
                                <Plus size={18} />
                                Add Content
                            </button>
                        </div>
                    </header>

                    {/* CONTENT LIST */}
                    <div className="flex flex-col gap-6">

                        {module.contents.length === 0 && (
                            <div className="border border-slate-200 dark:border-slate-800 rounded-xl p-10 text-center bg-white dark:bg-[#060B1A]/40 shadow-sm">
                                <p className="text-slate-500 dark:text-slate-400 font-medium">
                                    Belum ada content di module ini
                                </p>
                            </div>
                        )}

                        {module.contents.map((item: any, index: number) => (
                            <div
                                key={item._id}
                                className="group relative border border-slate-200 dark:border-slate-800/80 rounded-xl p-5 bg-white dark:bg-[#060B1A]/80 hover:border-[#3B28F6]/50 dark:hover:border-[#7C5CFF]/50 transition-all duration-300 shadow-sm hover:shadow-md dark:hover:shadow-lg dark:hover:shadow-[#7C5CFF]/5"
                            >
                                {/* Top accent line */}
                                <div className="absolute top-0 right-8 left-8 h-px bg-gradient-to-r from-transparent via-slate-200 to-transparent dark:via-slate-800" />

                                {/* ORDER BADGE */}
                                <div className="absolute -left-3 top-4 bg-[#3B28F6] dark:bg-[#7C5CFF] text-white text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center shadow">
                                    {index + 1}
                                </div>

                                {/* CONTENT */}
                                <div className="flex flex-col gap-4 pl-2">

                                    {renderContent(item)}

                                    {/* FOOTER */}
                                    <div className="flex justify-between items-center mt-2 pt-3 border-t border-slate-100 dark:border-white/5">

                                        <span className="text-[10px] font-bold uppercase tracking-[0.15em] text-slate-450 dark:text-slate-500">
                                            Type: {item.type}
                                        </span>

                                        {/* DELETE */}
                                        <button
                                            onClick={() => handleDeleteContent(item._id)}
                                            className="flex items-center gap-1.5 text-rose-500 hover:text-rose-600 text-xs font-bold transition cursor-pointer"
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
                onClose={() => setConfirmModal((prev) => ({ ...prev, open: false }))}
                onConfirm={confirmModal.onConfirm}
                title={confirmModal.title}
                message={confirmModal.message}
                confirmText={confirmModal.confirmText}
                variant={confirmModal.variant}
            />
        </AppLayout>
    );
}