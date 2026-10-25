import React from 'react';
import {
    FileText,
    FileCode,
    FileSpreadsheet,
    Archive,
    File,
    ExternalLink,
    Download,
} from 'lucide-react';

export interface FileResourceCardProps {
    title?: string;
    description?: string;
    url?: string;
    name?: string;
    size?: number;
    mime?: string;
    className?: string;
    showDescription?: boolean;
}

export default function FileResourceCard({
    title,
    description,
    url,
    name,
    size,
    mime,
    className = '',
    showDescription = true,
}: FileResourceCardProps) {
    if (!url) {
        return null;
    }

    // Extract filename and extension
    const cleanUrl = url.split('?')[0];
    const fallbackName = cleanUrl.split('/').pop() || 'Berkas Materi';
    const displayName = title?.trim() || name || fallbackName;
    const originalFileName = name || fallbackName;

    const ext = (
        originalFileName.includes('.')
            ? originalFileName.split('.').pop()
            : cleanUrl.includes('.')
              ? cleanUrl.split('.').pop()
              : ''
    )?.toLowerCase() || '';

    // File type detection
    const isPdf = ext === 'pdf' || mime?.includes('pdf');
    const isArchive = ['zip', 'rar', '7z', 'tar', 'gz'].includes(ext);
    const isSheet = ['xls', 'xlsx', 'csv', 'ods'].includes(ext);
    const isCode = [
        'js',
        'ts',
        'jsx',
        'tsx',
        'py',
        'java',
        'c',
        'cpp',
        'cs',
        'php',
        'html',
        'css',
        'json',
        'sql',
        'sh',
        'md',
    ].includes(ext);
    const isPresentation = ['ppt', 'pptx', 'odp'].includes(ext);
    const isDoc = ['doc', 'docx', 'odt', 'rtf', 'txt'].includes(ext);

    // Format file size
    const formatFileSize = (bytes?: number) => {
        if (!bytes || bytes <= 0) return null;
        const kb = bytes / 1024;
        if (kb < 1024) return `${Math.round(kb)} KB`;
        const mb = kb / 1024;
        return `${mb.toFixed(1)} MB`;
    };

    const formattedSize = formatFileSize(size);

    // Dynamic style configuration based on file type
    const getBadgeConfig = () => {
        if (isPdf) {
            return {
                icon: FileText,
                bgClass: 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20',
                badgeClass: 'bg-rose-100 text-rose-700 dark:bg-rose-500/20 dark:text-rose-300',
                label: 'PDF',
            };
        }
        if (isArchive) {
            return {
                icon: Archive,
                bgClass: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20',
                badgeClass: 'bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-300',
                label: ext.toUpperCase() || 'ZIP',
            };
        }
        if (isSheet) {
            return {
                icon: FileSpreadsheet,
                bgClass: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20',
                badgeClass: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-300',
                label: ext.toUpperCase() || 'SPREADSHEET',
            };
        }
        if (isCode) {
            return {
                icon: FileCode,
                bgClass: 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20',
                badgeClass: 'bg-purple-100 text-purple-700 dark:bg-purple-500/20 dark:text-purple-300',
                label: ext.toUpperCase() || 'CODE',
            };
        }
        if (isPresentation) {
            return {
                icon: FileText,
                bgClass: 'bg-orange-500/10 text-orange-600 dark:text-orange-400 border border-orange-500/20',
                badgeClass: 'bg-orange-100 text-orange-700 dark:bg-orange-500/20 dark:text-orange-300',
                label: ext.toUpperCase() || 'SLIDES',
            };
        }
        if (isDoc) {
            return {
                icon: FileText,
                bgClass: 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20',
                badgeClass: 'bg-blue-100 text-blue-700 dark:bg-blue-500/20 dark:text-blue-300',
                label: ext.toUpperCase() || 'DOC',
            };
        }

        return {
            icon: File,
            bgClass: 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20',
            badgeClass: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-500/20 dark:text-indigo-300',
            label: ext.toUpperCase() || 'FILE',
        };
    };

    const config = getBadgeConfig();
    const IconComponent = config.icon;

    // Files that modern browsers can preview natively in a top-level tab
    const canPreviewInTab = isPdf || isCode || ext === 'txt';

    const downloadUrl = url.includes('?') ? `${url}&download=1` : `${url}?download=1`;

    return (
        <div
            className={`group/file flex flex-col justify-between gap-3 rounded-xl border border-slate-200/90 bg-white p-3.5 shadow-xs transition-all duration-200 hover:border-slate-300 hover:shadow-sm sm:flex-row sm:items-center sm:p-4 dark:border-slate-800 dark:bg-slate-900/60 dark:hover:border-slate-700 ${className}`}
        >
            <div className="flex min-w-0 items-start gap-3 sm:items-center">
                {/* File Format Icon */}
                <div
                    className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl transition-transform duration-200 group-hover/file:scale-105 ${config.bgClass}`}
                >
                    <IconComponent className="h-5 w-5" />
                </div>

                {/* File Details */}
                <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                        <h4 className="truncate text-sm font-semibold text-slate-800 dark:text-slate-100">
                            {displayName}
                        </h4>
                        <span
                            className={`rounded-md px-1.5 py-0.5 text-[10px] font-bold tracking-wider uppercase ${config.badgeClass}`}
                        >
                            {config.label}
                        </span>
                    </div>

                    <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                        {displayName !== originalFileName && (
                            <span className="truncate max-w-[220px] sm:max-w-[280px]">
                                {originalFileName}
                            </span>
                        )}
                        {displayName !== originalFileName && formattedSize && (
                            <span>•</span>
                        )}
                        {formattedSize && (
                            <span className="font-medium text-slate-600 dark:text-slate-400">
                                {formattedSize}
                            </span>
                        )}
                    </div>

                    {showDescription && description && (
                        <p className="mt-1 line-clamp-2 text-xs text-slate-500 dark:text-slate-400">
                            {description}
                        </p>
                    )}
                </div>
            </div>

            {/* Action Buttons */}
            <div className="flex shrink-0 items-center gap-2 border-t border-slate-100 pt-2 sm:border-t-0 sm:pt-0 dark:border-slate-800/60">
                {canPreviewInTab && (
                    <a
                        href={url}
                        target="_blank"
                        rel="noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="inline-flex cursor-pointer items-center gap-1.5 rounded-lg border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-semibold text-slate-700 shadow-2xs transition-colors hover:bg-slate-100 hover:text-slate-900 active:scale-95 dark:border-slate-700 dark:bg-slate-800/80 dark:text-slate-200 dark:hover:bg-slate-700"
                        title="Buka dokumen di tab baru"
                    >
                        <ExternalLink className="h-3.5 w-3.5" />
                        <span>Buka</span>
                    </a>
                )}

                <a
                    href={downloadUrl}
                    download={originalFileName}
                    onClick={(e) => e.stopPropagation()}
                    className="inline-flex cursor-pointer items-center gap-1.5 rounded-lg bg-[#3B28F6] px-3.5 py-1.5 text-xs font-semibold text-white shadow-2xs transition-all hover:bg-[#2a1ce0] hover:shadow-sm active:scale-95 dark:bg-[#7C5CFF] dark:hover:bg-[#6b47ff]"
                    title="Unduh berkas materi"
                >
                    <Download className="h-3.5 w-3.5" />
                    <span>Unduh</span>
                </a>
            </div>
        </div>
    );
}
