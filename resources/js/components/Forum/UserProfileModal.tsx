import React from 'react';
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
    if (!open) return null;

    return (
        <div
            className="animate-fade-in fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
            onClick={onClose}
        >
            <div
                onClick={(e) => e.stopPropagation()}
                className="relative w-full max-w-[340px] overflow-hidden rounded-3xl border border-[#3b28f6]/30 bg-black/40 p-5 text-white shadow-[0_0_50px_rgba(59,40,246,0.25)] backdrop-blur-sm"
            >
                {/* Close button */}
                <button
                    type="button"
                    onClick={onClose}
                    className="absolute top-4 right-4 z-10 rounded-full p-1 text-slate-400 transition hover:bg-slate-800/50 hover:text-white"
                >
                    <X className="h-4 w-4" />
                </button>

                {loading ? (
                    <div className="flex flex-col items-center justify-center py-12">
                        <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#facc15] border-t-transparent"></div>
                        <p className="mt-4 font-['Oxanium'] text-xs text-slate-400">
                            Memuat profil...
                        </p>
                    </div>
                ) : profile ? (
                    <div className="flex flex-col">
                        {/* Top Section: Two columns (Avatar & Level) */}
                        <div className="mb-5 grid grid-cols-[120px_1fr] items-center gap-4">
                            {/* Left: Square avatar with slightly rounded corners */}
                            <div className="relative aspect-square w-full overflow-hidden rounded-2xl border border-[#3b28f6]/20 bg-slate-900 shadow-[0_4px_20px_rgba(59,40,246,0.15)]">
                                {profile.avatar ? (
                                    <img
                                        src={profile.avatar}
                                        alt={profile.name}
                                        className="h-full w-full object-cover"
                                    />
                                ) : (
                                    <div className="flex h-full w-full items-center justify-center bg-indigo-950/40">
                                        <UserIcon className="h-10 w-10 text-indigo-400" />
                                    </div>
                                )}
                                {/* Role Badge */}
                                <div className="absolute bottom-1.5 left-1/2 -translate-x-1/2 rounded-full border border-[#facc15]/30 bg-black/80 px-2 py-0.5 font-['Oxanium'] text-[8px] font-bold tracking-wider text-[#facc15] uppercase">
                                    {profile.role}
                                </div>
                            </div>

                            {/* Right: Username & Level Circle */}
                            <div className="flex flex-col items-center justify-center">
                                <h3
                                    className="mb-3 w-full truncate text-center font-['Oxanium'] text-sm leading-tight font-bold text-white"
                                    title={profile.name}
                                >
                                    {profile.name}
                                </h3>

                                {/* Circle Level */}
                                <div className="relative flex h-18 w-18 flex-col items-center justify-center rounded-full border-4 border-indigo-700/80 bg-black/60 shadow-[0_0_15px_rgba(59,40,246,0.5)]">
                                    <span className="font-['Orbitron'] text-xl font-black text-white">
                                        {profile.level}
                                    </span>
                                    {/* Subtitle label */}
                                    <span className="-mt-0.5 font-['Oxanium'] text-[7px] font-bold tracking-widest text-[#facc15] uppercase">
                                        LEVEL
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Divider */}
                        <div className="mb-4 w-full border-t border-[#3b28f6]/10"></div>

                        {/* Content Rows */}
                        <div className="flex flex-col gap-3.5">
                            {/* Row 1: ERP & Rank Badge */}
                            <div className="flex items-center justify-between rounded-2xl border border-[#3b28f6]/10 bg-black/30 px-4 py-3 shadow-inner">
                                <div className="flex flex-col">
                                    <span className="font-['Oxanium'] text-xs font-bold tracking-wider text-slate-400">
                                        ERP
                                    </span>
                                    <span className="mt-0.5 font-['Orbitron'] text-xs font-black text-indigo-400">
                                        {profile.erp.toLocaleString()} pts
                                    </span>
                                </div>
                                {profile.rank_image ? (
                                    <div className="flex items-center gap-2 rounded-xl border border-[#3b28f6]/10 bg-black/40 px-2.5 py-1">
                                        <img
                                            src={profile.rank_image}
                                            alt={profile.rank_name ?? ''}
                                            className="h-5 w-5 object-contain"
                                        />
                                        <span className="font-['Oxanium'] text-[10px] font-bold text-slate-200">
                                            {profile.rank_name}
                                        </span>
                                    </div>
                                ) : (
                                    <span className="rounded-xl bg-black/20 px-2.5 py-1 font-['Oxanium'] text-[10px] font-bold text-slate-500">
                                        Unranked
                                    </span>
                                )}
                            </div>

                            {/* Row 2: Completed Course */}
                            <div className="flex flex-col rounded-2xl border border-[#3b28f6]/10 bg-black/30 px-4 py-3 shadow-inner">
                                <div className="mb-2 flex w-full items-center justify-between">
                                    <span className="font-['Oxanium'] text-xs font-bold tracking-wider text-slate-400">
                                        Completed Course
                                    </span>
                                    <div className="flex items-center gap-1">
                                        <span className="font-['Orbitron'] text-xs font-black text-[#facc15]">
                                            {profile.courses.length}
                                        </span>
                                        <svg
                                            className="h-3.5 w-3.5 text-slate-400"
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

                                {/* Horizontal list of courses thumbnails/icons */}
                                {profile.courses && profile.courses.length > 0 ? (
                                    <div className="custom-scrollbar scrollbar-none flex gap-2.5 overflow-x-auto py-1">
                                        {profile.courses.map((course, idx) => (
                                            <div
                                                key={idx}
                                                className="h-7 w-7 shrink-0 overflow-hidden rounded-lg border border-[#3b28f6]/20 bg-black shadow-[0_2px_8px_rgba(0,0,0,0.4)]"
                                                title={course.name}
                                            >
                                                {course.thumbnail ? (
                                                    <img
                                                        src={course.thumbnail}
                                                        alt={course.name}
                                                        className="h-full w-full object-cover"
                                                    />
                                                ) : (
                                                    <div className="flex h-full w-full items-center justify-center bg-indigo-950/40 font-['Oxanium'] text-[9px] font-bold text-indigo-400">
                                                        {course.name
                                                            .substring(0, 2)
                                                            .toUpperCase()}
                                                    </div>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="font-['Oxanium'] text-[10px] text-slate-500 italic">
                                        Belum mengikuti kelas apa pun.
                                    </p>
                                )}
                            </div>

                            {/* Row 3: Social Handle */}
                            <div className="flex items-center justify-between rounded-2xl border border-[#3b28f6]/10 bg-black/30 px-4 py-2.5 shadow-inner">
                                <span className="max-w-[200px] truncate font-['Oxanium'] text-xs font-semibold text-slate-300">
                                    {profile.linkedin
                                        ? (() => {
                                              try {
                                                  const url = profile.linkedin.replace(/\/$/, '');
                                                  const parts = url.split('/');
                                                  const handle = parts[parts.length - 1];
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
                                        className="flex h-8 w-8 items-center justify-center rounded-xl border border-[#3b28f6]/30 bg-gradient-to-tr from-[#3b28f6] to-[#0077b5] text-white shadow-[0_0_10px_rgba(0,119,181,0.4)] transition duration-300 hover:scale-105 active:scale-95"
                                    >
                                        <svg
                                            className="h-4 w-4 fill-current"
                                            viewBox="0 0 24 24"
                                        >
                                            <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                                        </svg>
                                    </a>
                                ) : (
                                    <div className="flex h-8 w-8 cursor-not-allowed items-center justify-center rounded-xl border border-slate-800 bg-slate-900 text-slate-600">
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
