import React from 'react';
import { Link, router } from '@inertiajs/react';
import { Search, User as UserIcon } from 'lucide-react';
import { CourseGroup, SelectedCourse } from './types';

interface ForumSidebarProps {
    courses: CourseGroup[];
    selectedCourse: SelectedCourse | null;
    searchQuery: string;
    setSearchQuery: (query: string) => void;
    showChatMobile: boolean;
    setShowChatMobile: (show: boolean) => void;
    basePath: string;
    dashboardRoute: string;
    role: string;
    isDark?: boolean;
}

const formatTime = (isoString: string) => {
    try {
        const date = new Date(isoString);
        return date.toLocaleTimeString('id-ID', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: true,
        });
    } catch {
        return '';
    }
};

export default function ForumSidebar({
    courses,
    selectedCourse,
    searchQuery,
    setSearchQuery,
    showChatMobile,
    setShowChatMobile,
    basePath,
    dashboardRoute,
    role,
    isDark = false,
}: ForumSidebarProps) {
    const [isSearchFocused, setIsSearchFocused] = React.useState(false);

    const filteredCourses = courses.filter((c) =>
        c.title.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div
            className={`flex w-full shrink-0 flex-col border-r border-slate-200 bg-white transition-colors duration-300 dark:border-[#3B28F6]/20 dark:bg-[#0f0e0e] animate-fade-in md:w-[210px] lg:w-[280px] xl:w-[340px] 2xl:w-[380px] ${
                showChatMobile ? 'hidden md:flex' : 'flex'
            }`}
        >
            {/* Header Sidebar: Tombol Back & Kolom Pencarian */}
            <div className="border-b border-slate-200 dark:border-[#3B28F6]/20 p-4">
                <div className="mb-4 flex items-center gap-3 sm:gap-6">
                    {/* Tombol Back Futuristik */}
                    <div className="group relative shrink-0 cursor-pointer">
                        <svg
                            className="h-[36px] w-[80px] overflow-visible md:h-[28px] md:w-[65px] lg:h-[38px] lg:w-[85px] xl:h-[49px] xl:w-[110px]"
                            viewBox="0 0 110 46"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <defs>
                                <linearGradient
                                    id="back_border_grad_lb"
                                    x1="0%"
                                    y1="0%"
                                    x2="100%"
                                    y2="0%"
                                >
                                    <stop offset="0%" stopColor="#3B28F6" />
                                    <stop offset="100%" stopColor="#FACC15" />
                                </linearGradient>
                            </defs>
                            <path
                                d="M 3,3 H 127 L 97,47 H 3 Z"
                                className="fill-blue-50/60 transition-colors dark:fill-[#080e28]/40"
                                stroke="url(#back_border_grad_lb)"
                                strokeWidth="2"
                                strokeLinejoin="miter"
                                style={{
                                    filter: 'drop-shadow(0 0 3px rgba(59, 130, 246, 0.35))',
                                }}
                            />
                        </svg>

                        <Link
                            href={dashboardRoute}
                            className="absolute inset-0 flex items-center justify-center text-[#1e3a8a] dark:text-blue-200"
                        >
                            <svg
                                className="h-8 w-8 md:h-6 md:w-6 lg:h-8 lg:w-8 xl:h-11 xl:w-11"
                                viewBox="0 0 44 44"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="3"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            >
                                <path d="M 6 17 L 13 10 M 6 17 L 13 24" />
                                <path d="M 9 17 H 36 C 42 19 43 30 32 30 H 15" />
                            </svg>
                        </Link>
                    </div>

                   <h1 className="font-['Orbitron'] font-extrabold tracking-[0.05em] whitespace-nowrap text-[#1e3a8a] 
                uppercase transition-colors duration-500 sm:text-xl sm:tracking-[0.1em] md:text-[11px] lg:text-[14px] xl:text-[18px] 2xl:text-lg dark:text-[#F0F0F0]">
                    Forum Group
                </h1>
                </div>

                {/* Input Pencarian */}
                <div className="relative">
                    <Search className="absolute top-1/2 left-3 md:left-2.5 z-10 h-4 w-4 md:h-3.5 md:w-3.5 -translate-y-1/2 text-slate-400" />
                    <input
                        type="text"
                        placeholder="Cari grup..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        onFocus={() => setIsSearchFocused(true)}
                        onBlur={() => setIsSearchFocused(false)}
                        className="w-full rounded-xl border border-transparent bg-slate-50 py-2.5 md:py-2 pr-4 pl-10 md:pl-8.5 text-sm md:text-xs text-slate-800 placeholder-slate-400 transition-all duration-200 outline-none dark:bg-transparent dark:text-white dark:placeholder-slate-500"
                        style={{
                            borderStyle: 'solid',
                            borderWidth: isSearchFocused ? '2px' : '1px',
                            borderColor: 'transparent',
                            backgroundImage: isDark
                                ? 'linear-gradient(#0f0e0e, #0f0e0e), linear-gradient(to bottom, #3B28F6 0%, #4c2fff 30%, #7c3aed 50%, #facc15 100%)'
                                : 'linear-gradient(#f8fafc, #f8fafc), linear-gradient(to bottom, #3B28F6 0%, #4c2fff 30%, #7c3aed 50%, #facc15 100%)',
                            backgroundOrigin: 'border-box',
                            backgroundClip: 'padding-box, border-box',
                            backgroundColor: 'transparent',
                            boxShadow: isSearchFocused
                                ? (isDark 
                                    ? '0 0 10px rgba(59, 40, 246, 0.25), 0 0 5px rgba(250, 204, 21, 0.15)' 
                                    : '0 0 10px rgba(59, 40, 246, 0.15), 0 0 5px rgba(250, 204, 21, 0.05)')
                                : 'none',
                        }}
                    />
                </div>
            </div>

            {/* Daftar Kursus / Grup */}
            <div className="scrollbar-thin scrollbar-thumb-indigo-900 scrollbar-track-transparent flex-1 overflow-y-auto">
                {filteredCourses.length === 0 ? (
                    <div className="flex flex-col items-center justify-center p-8 text-center text-slate-500">
                        <p className="text-sm">
                            Tidak ada grup forum yang ditemukan.
                        </p>
                    </div>
                ) : (
                    filteredCourses.map((group) => {
                        const isActive = selectedCourse?.id === group.id;
                        return (
                            <div
                                    key={group.id}
                                    onClick={() => {
                                        setShowChatMobile(true);
                                        if (!isActive) {
                                            router.visit(`${basePath}/${group.slug}`);
                                        }
                                    }}
                                    className={`flex cursor-pointer items-center gap-2.5 sm:gap-3 md:gap-1.5 lg:gap-2.5 rounded-lg border px-3 sm:px-4 md:px-2 lg:px-3 py-2.5 sm:py-3 md:py-2 lg:py-2.5 transition-colors duration-200 ${
                                    isActive
                                        ? 'bg-indigo-50/80 border-indigo-200/80 dark:bg-slate-600/40 dark:border-[#3B28F6]/30'
                                        : 'bg-transparent border-transparent hover:bg-slate-100/50 dark:bg-transparent dark:border-transparent dark:hover:bg-white/5'
                                }`}
                                >
                                {/* Avatar Kursus */}
                                <div className="relative h-10 w-10 md:h-8 md:w-8 lg:h-10 lg:w-10 xl:h-12 xl:w-12 shrink-0 overflow-hidden rounded-xl border border-slate-200 dark:border-white/10 bg-slate-900">
                                    {group.thumbnail ? (
                                        <img
                                            src={group.thumbnail}
                                            alt={group.title}
                                            className="h-full w-full object-cover"
                                        />
                                    ) : (
                                        <div className="flex h-full w-full items-center justify-center bg-indigo-950">
                                            <UserIcon className="h-6 w-6 text-indigo-400" />
                                        </div>
                                    )}
                                </div>

                                {/* Info & Cuplikan Chat */}
                                <div className="min-w-0 flex-1">
                                    <div className="mb-1 flex items-center justify-between">
                                        <h3 className="truncate font-['Oxanium'] text-sm md:text-xs lg:text-sm leading-none font-semibold text-slate-800 dark:text-white">
                                            {group.title}
                                        </h3>
                                        {group.last_message && (
                                            <span className="ml-2 shrink-0 text-[10px] md:text-[8px] lg:text-[10px] whitespace-nowrap text-slate-500">
                                                {formatTime(
                                                    group.last_message.created_at
                                                )}
                                            </span>
                                        )}
                                    </div>
                                    <div className="truncate text-xs md:text-[10px] lg:text-xs text-slate-500 dark:text-slate-400">
                                        {group.last_message ? (
                                            <>
                                                <span className="font-semibold text-slate-700 dark:text-slate-300">
                                                    {group.last_message.sender_name}
                                                    :
                                                </span>{' '}
                                                {group.last_message.message}
                                            </>
                                        ) : (
                                            <span className="text-slate-400 dark:text-slate-600 italic">
                                                Belum ada pesan
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </div>
                        );
                    })
                )}
            </div>
        </div>
    );
}
