import React, { useState } from 'react';
import { X, User as UserIcon } from 'lucide-react';
import { SelectedProfile } from './types';

interface UserProfileModalProps {
    open: boolean;
    loading: boolean;
    profile: SelectedProfile | null;
    onClose: () => void;
}

export default function UserProfileModal({
    open,
    loading,
    profile,
    onClose,
}: UserProfileModalProps) {
    const [isCoursesExpanded, setIsCoursesExpanded] = useState(false);

    if (!open) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Background Overlay (Sibling layout to prevent nested blur rendering bugs on mobile) */}
            <div
                className="animate-fade-in absolute inset-0 bg-black/60 backdrop-blur-xs"
                onClick={onClose}
            />

            {/* Modal Container */}
            <div
                onClick={(e) => e.stopPropagation()}
                className="xs:max-w-[390px] animate-scale-up relative w-full max-w-[360px] overflow-hidden rounded-[24px] border border-[#3B28F6] bg-white/20 text-slate-800 antialiased shadow-[0_8px_32px_0_rgba(59,40,246,0.1)] backdrop-blur-md transition-all duration-300 sm:max-w-[430px] dark:bg-black/20 dark:text-white dark:shadow-[0_8px_32px_0_rgba(0,0,0,0.4)]"
                style={{
                    transform: 'translate3d(0,0,0)',
                    backfaceVisibility: 'hidden',
                    WebkitBackfaceVisibility: 'hidden',
                    WebkitFontSmoothing: 'antialiased',
                    MozOsxFontSmoothing: 'grayscale',
                }}
            >
                {/* Close button */}
                <button
                    type="button"
                    onClick={onClose}
                    className="absolute top-2.5 right-2.5 z-20 rounded-full bg-white/10 p-1.5 text-slate-400 transition hover:bg-white/20 hover:text-slate-700 dark:bg-black/30 dark:hover:bg-slate-800/40 dark:hover:text-white"
                >
                    <X className="h-3.5 w-3.5" />
                </button>

                {loading ? (
                    <div className="flex flex-col items-center justify-center px-6 py-16">
                        <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#facc15] border-t-transparent"></div>
                        <p className="mt-4 font-['Oxanium'] text-xs text-slate-400">
                            Memuat profil...
                        </p>
                    </div>
                ) : profile ? (
                    <div className="flex flex-col">
                        {/* Top Section: Split Layout (Avatar & Username/Level) */}
                        <div className="grid grid-cols-[140px_1fr] sm:grid-cols-[165px_1fr]">
                            {/* Left: Square avatar matching top-left rounding */}
                            <div className="relative aspect-square w-full overflow-hidden bg-slate-100/10 dark:bg-[#0c0c1e]/10">
                                {profile.avatar ? (
                                    <img
                                        src={profile.avatar}
                                        alt={profile.name}
                                        className="h-full w-full rounded-tl-[22px] object-cover"
                                    />
                                ) : (
                                    <div className="flex h-full w-full items-center justify-center rounded-tl-[22px] bg-indigo-950/10">
                                        <UserIcon className="h-10 w-10 text-indigo-400" />
                                    </div>
                                )}
                                {/* Role Badge */}
                                <div className="absolute bottom-1.5 left-1/2 -translate-x-1/2 rounded-full border border-[#facc15]/30 bg-black/80 px-2 py-0.5 font-['Oxanium'] text-[8px] font-bold tracking-wider whitespace-nowrap text-[#facc15] uppercase">
                                    {profile.role}
                                </div>
                            </div>

                            {/* Right: Username & Level Circle */}
                            <div className="flex flex-col items-center justify-center p-3 text-center select-none sm:p-4">
                                <h3
                                    className="mb-3 w-full truncate font-['Orbitron'] text-sm font-bold tracking-wider text-slate-800 sm:text-base dark:text-white"
                                    title={profile.name}
                                >
                                    {profile.name}
                                </h3>

                                {/* Circle Level */}
                                <div className="relative flex h-16 w-16 items-center justify-center rounded-full border-[3px] border-[#3B28F6] bg-white/10 shadow-[0_0_8px_rgba(161,98,7,0.6)] backdrop-blur-xs sm:h-18 sm:w-18 dark:bg-black/30 dark:shadow-[0_0_8px_rgba(234,179,8,0.4)]">
                                    <span className="font-['Orbitron'] text-lg font-black text-slate-800 italic sm:text-xl dark:text-white">
                                        {profile.level}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Content Rows */}
                        <div className="flex flex-col gap-3 bg-transparent px-0 pt-3 pb-0">
                            {/* Row 1: ERP & Rank Badge */}
                            <div className="bg-[#99E4FD]/08 flex w-full items-center justify-between rounded-none border-y border-[#99E4FD]/15 px-5 py-3.5 shadow-xs backdrop-blur-xs transition duration-200 hover:bg-[#99E4FD]/12">
                                <span className="font-['Oxanium'] text-xs font-bold tracking-wider text-slate-600 uppercase dark:text-[#99E4FD]/80">
                                    ERP
                                </span>
                                {profile.rank_image ? (
                                    <img
                                        src={profile.rank_image}
                                        alt={profile.rank_name ?? 'Rank'}
                                        className="h-7 w-7 object-contain"
                                    />
                                ) : (
                                    <span className="font-['Oxanium'] text-[10px] font-bold text-slate-500 dark:text-slate-400">
                                        Unranked
                                    </span>
                                )}
                            </div>

                            {/* Row 2: Completed Course */}
                            <div className="bg-[#99E4FD]/08 flex w-full flex-col rounded-none border-y border-[#99E4FD]/15 px-5 py-3.5 shadow-xs backdrop-blur-xs transition duration-200 hover:bg-[#99E4FD]/12">
                                <div
                                    onClick={() =>
                                        setIsCoursesExpanded(!isCoursesExpanded)
                                    }
                                    className="flex w-full cursor-pointer items-center justify-between select-none"
                                >
                                    <span className="text-slate-655 font-['Oxanium'] text-xs font-bold tracking-wider dark:text-[#99E4FD]/80">
                                        Completed Course
                                    </span>
                                    <div className="flex items-center gap-1.5">
                                        <span className="font-['Orbitron'] text-xs font-black text-[#3B28F6] dark:text-[#99E4FD]">
                                            {profile.courses.length}
                                        </span>
                                        <svg
                                            className={`h-3.5 w-3.5 text-slate-400 transition-transform duration-200 dark:text-[#99E4FD]/60 ${isCoursesExpanded ? 'rotate-90' : ''}`}
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            stroke="currentColor"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2.5}
                                                d="M9 5l7 7-7 7"
                                            />
                                        </svg>
                                    </div>
                                </div>

                                {isCoursesExpanded && (
                                    <div className="border-slate-250/20 animate-fade-in mt-3 flex flex-wrap gap-2 border-t pt-2.5 dark:border-[#99E4FD]/20">
                                        {profile.courses &&
                                        profile.courses.length > 0 ? (
                                            profile.courses.map(
                                                (course, idx) => (
                                                    <div
                                                        key={idx}
                                                        className="h-7 w-7 shrink-0 overflow-hidden rounded-xs border border-slate-200 bg-slate-100 shadow-xs dark:border-[#3b28f6]/20 dark:bg-black"
                                                        title={course.name}
                                                    >
                                                        {course.thumbnail ? (
                                                            <img
                                                                src={
                                                                    course.thumbnail
                                                                }
                                                                alt={
                                                                    course.name
                                                                }
                                                                className="h-full w-full object-cover"
                                                            />
                                                        ) : (
                                                            <div className="flex h-full w-full items-center justify-center bg-indigo-950/40 font-['Oxanium'] text-[9px] font-bold text-indigo-400">
                                                                {course.name
                                                                    .substring(
                                                                        0,
                                                                        2,
                                                                    )
                                                                    .toUpperCase()}
                                                            </div>
                                                        )}
                                                    </div>
                                                ),
                                            )
                                        ) : (
                                            <p className="font-['Oxanium'] text-[10px] text-slate-500 italic">
                                                Belum mengikuti kelas apa pun.
                                            </p>
                                        )}
                                    </div>
                                )}
                            </div>

                            {/* Row 3: LinkedIn Handle */}
                            <div className="bg-[#99E4FD]/08 flex w-full items-center justify-between rounded-b-[22px] border-t border-[#99E4FD]/15 px-5 py-3.5 shadow-xs backdrop-blur-xs transition duration-200 hover:bg-[#99E4FD]/12">
                                <span className="text-slate-655 max-w-[200px] truncate font-['Oxanium'] text-xs font-semibold dark:text-[#99E4FD]/80">
                                    {profile.linkedin
                                        ? (() => {
                                              try {
                                                  const url =
                                                      profile.linkedin.replace(
                                                          /\/$/,
                                                          '',
                                                      );
                                                  const parts = url.split('/');
                                                  const handle =
                                                      parts[parts.length - 1];
                                                  return handle
                                                      ? `@${handle}`
                                                      : `@${profile.username}`;
                                              } catch {
                                                  return `@${profile.username}`;
                                              }
                                          })()
                                        : `@${profile.username}`}
                                </span>
                                {profile.linkedin ? (
                                    <a
                                        href={profile.linkedin}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex h-7 w-7 items-center justify-center rounded-md bg-[#0077b5] text-white transition-transform hover:scale-105"
                                    >
                                        <svg
                                            className="h-4 w-4 fill-current"
                                            viewBox="0 0 24 24"
                                        >
                                            <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                                        </svg>
                                    </a>
                                ) : (
                                    <div className="flex h-7 w-7 cursor-not-allowed items-center justify-center rounded-md bg-slate-200/50 text-slate-400 dark:bg-slate-800/40 dark:text-slate-600">
                                        <svg
                                            className="h-4 w-4 fill-current opacity-40"
                                            viewBox="0 0 24 24"
                                        >
                                            <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                                        </svg>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                ) : null}
            </div>
        </div>
    );
}
