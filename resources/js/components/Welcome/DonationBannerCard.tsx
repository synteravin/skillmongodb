import React from 'react';
import { Link } from '@inertiajs/react';
import { ExternalLink, HeartHandshake, Settings, Trash2 } from 'lucide-react';

export interface DonationBannerCardProps {
    title?: string | null;
    url?: string;
    imageUrl?: string | null;
    isAdminOrMentor?: boolean;
    onDelete?: (e: React.MouseEvent) => void;
    className?: string;
}

export default function DonationBannerCard({
    title,
    url,
    imageUrl,
    isAdminOrMentor = false,
    onDelete,
    className = '',
}: DonationBannerCardProps) {
    const targetUrl = url
        ? url.startsWith('http')
            ? url
            : `https://${url}`
        : 'https://teer.id/fot98sbqcmggbrot2l0l';

    const bannerImage = imageUrl || '/images/donation-banner.jpg';
    const bannerTitle = title || 'Dukung Pengembang Platform';

    return (
        <div
            className={`group relative overflow-hidden rounded-xl border border-indigo-500/20 bg-gradient-to-br from-white/95 via-indigo-50/40 to-amber-50/30 p-1 shadow-xs shadow-indigo-950/5 backdrop-blur-xl transition-all duration-300 hover:border-amber-400/60 hover:shadow-md hover:shadow-amber-500/10 dark:border-white/10 dark:from-[#0d1124]/90 dark:via-[#090d1c]/90 dark:to-[#120f24]/90 dark:shadow-black/40 dark:hover:border-amber-400/40 ${className}`}
        >
            <a
                href={targetUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="block"
            >
                {/* Image Container with Slim Aspect Ratio */}
                <div className="relative aspect-[2.7/1] w-full overflow-hidden rounded-lg bg-slate-900/60">
                    <img
                        src={bannerImage}
                        alt={bannerTitle}
                        className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                    />

                    {/* Gradient Overlay for Text Legibility */}
                    <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20" />

                    {/* Support Platform Badge (Top Left) */}
                    <div className="absolute top-1 left-1 z-10">
                        <span className="inline-flex items-center gap-1 rounded-full border border-white/20 bg-slate-950/80 px-1.5 py-0.5 text-[7.5px] font-bold text-amber-300 shadow-xs backdrop-blur-md">
                            <HeartHandshake className="h-2 w-2 text-amber-400 animate-pulse" />
                            <span>Support</span>
                        </span>
                    </div>
                </div>

                {/* Bottom Details & CTA Bar */}
                <div className="flex items-center justify-between gap-1 px-1 pt-1 pb-0.5">
                    <div className="min-w-0 flex-1">
                        <p
                            className="truncate text-[10px] font-bold text-slate-800 transition-colors group-hover:text-indigo-600 dark:text-white dark:group-hover:text-amber-300"
                            title={bannerTitle}
                        >
                            {bannerTitle}
                        </p>
                        <p className="truncate text-[8px] font-medium text-slate-400 dark:text-slate-500">
                            Saweria / Trakteer
                        </p>
                    </div>

                    <span className="inline-flex shrink-0 items-center gap-0.5 rounded-md bg-gradient-to-r from-amber-500 to-orange-500 px-1.5 py-0.5 text-[9px] font-extrabold text-slate-950 shadow-xs shadow-amber-500/20 transition-all duration-200 group-hover:scale-105 group-hover:shadow-xs group-hover:shadow-amber-500/35">
                        <span>Dukung</span>
                        <ExternalLink className="h-2 w-2" />
                    </span>
                </div>
            </a>

            {/* Admin / Mentor Floating Action Buttons */}
            {isAdminOrMentor && (
                <div className="absolute top-1.5 right-1.5 z-20 flex items-center gap-0.5">
                    <Link
                        href="/donation-banner"
                        title="Edit Banner Donasi"
                        className="inline-flex h-4 items-center gap-0.5 rounded-full border border-white/20 bg-slate-950/85 px-1.5 text-[7.5px] font-semibold text-white shadow-xs backdrop-blur-md transition hover:bg-indigo-600"
                    >
                        <Settings className="h-2 w-2" />
                        <span>Edit</span>
                    </Link>

                    {onDelete && (
                        <button
                            type="button"
                            onClick={onDelete}
                            title="Hapus Banner Donasi"
                            className="inline-flex h-4 cursor-pointer items-center justify-center rounded-full border border-white/20 bg-rose-950/85 px-1 text-[7.5px] font-semibold text-rose-300 shadow-xs backdrop-blur-md transition hover:bg-rose-600 hover:text-white"
                        >
                            <Trash2 className="h-2 w-2" />
                        </button>
                    )}
                </div>
            )}
        </div>
    );
}
