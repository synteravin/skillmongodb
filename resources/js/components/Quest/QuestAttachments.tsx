import React from 'react';
import { Download, FileArchive, FileText, Image as ImageIcon } from 'lucide-react';

interface ImageAttachment {
    name: string;
    url: string;
}

interface FileAttachment {
    name: string;
    url: string;
    size: number;
}

interface QuestAttachmentsProps {
    images?: ImageAttachment[];
    files?: FileAttachment[];
    onPreviewImage: (img: ImageAttachment) => void;
}

export default function QuestAttachments({
    images,
    files,
    onPreviewImage,
}: QuestAttachmentsProps) {
    if ((!images || images.length === 0) && (!files || files.length === 0)) {
        return null;
    }

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

    return (
        <div className="space-y-5 border-t border-slate-100 pt-5 dark:border-slate-800">
            <h3 className="text-xs font-semibold tracking-wider text-slate-400 uppercase">
                Lampiran Pendukung
            </h3>

            {/* Images Gallery */}
            {images && images.length > 0 && (
                <div className="space-y-2.5">
                    <span className="block text-[10px] font-semibold tracking-wider text-slate-450 uppercase">
                        Galeri Gambar
                    </span>
                    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                        {images.map((img, index) => (
                            <div
                                key={index}
                                className="group relative overflow-hidden rounded-lg border border-slate-200 bg-slate-50/50 p-1 dark:border-slate-800 dark:bg-[#030712]"
                            >
                                <img
                                    src={img.url}
                                    alt={img.name}
                                    onClick={() => onPreviewImage(img)}
                                    className="h-24 w-full cursor-pointer rounded object-cover transition-transform hover:scale-[1.02]"
                                />
                                <div className="pointer-events-none absolute inset-0 flex items-center justify-center gap-2 bg-black/50 opacity-0 transition-opacity group-hover:pointer-events-auto group-hover:opacity-100">
                                    <button
                                        type="button"
                                        onClick={() => onPreviewImage(img)}
                                        className="cursor-pointer rounded bg-white/20 p-1.5 text-white transition-colors hover:bg-white/30"
                                        title="Detail Gambar"
                                    >
                                        <ImageIcon className="h-4 w-4" />
                                    </button>
                                    <a
                                        href={img.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="cursor-pointer rounded bg-indigo-600 p-1.5 text-white transition-colors hover:bg-indigo-700"
                                        title="Unduh di Tab Baru"
                                    >
                                        <Download className="h-4 w-4" />
                                    </a>
                                </div>
                                <span className="mt-1 block truncate px-1 text-center text-[9px] text-slate-500 dark:text-slate-400">
                                    {img.name}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Files List */}
            {files && files.length > 0 && (
                <div className="space-y-2.5">
                    <span className="block text-[10px] font-semibold tracking-wider text-slate-450 uppercase">
                        Dokumen Lampiran
                    </span>
                    <div className="space-y-2">
                        {files.map((file, index) => {
                            const ext = file.name.split('.').pop()?.toLowerCase();
                            const isZip = ext === 'zip';
                            return (
                                <div
                                    key={index}
                                    className="flex items-center justify-between rounded-lg border border-slate-200 bg-slate-50/50 p-3 dark:border-slate-800 dark:bg-[#030712]"
                                >
                                    <div className="flex min-w-0 items-center gap-3">
                                        {isZip ? (
                                            <FileArchive className="h-5 w-5 shrink-0 text-amber-500" />
                                        ) : (
                                            <FileText className="h-5 w-5 shrink-0 text-indigo-500" />
                                        )}
                                        <div className="min-w-0">
                                            <p className="truncate text-xs font-semibold text-slate-705 dark:text-slate-200">
                                                {file.name}
                                            </p>
                                            <p className="text-slate-400 text-[10px]">
                                                {formatBytes(file.size)}
                                            </p>
                                        </div>
                                    </div>
                                    <a
                                        href={file.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex cursor-pointer items-center justify-center rounded-lg p-1.5 text-indigo-650 hover:bg-indigo-50 dark:text-indigo-400 dark:hover:bg-indigo-950/40"
                                        title="Unduh berkas"
                                    >
                                        <Download className="h-4 w-4" />
                                    </a>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}
        </div>
    );
}
