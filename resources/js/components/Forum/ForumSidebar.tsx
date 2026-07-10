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
}: ForumSidebarProps) {
    const filteredCourses = courses.filter((c) =>
        c.title.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div
            className={`flex w-full shrink-0 flex-col border-r border-[#3B28F6]/20 bg-[#121212] animate-fade-in lg:w-[320px] xl:w-[380px] ${
                showChatMobile ? 'hidden lg:flex' : 'flex'
            }`}
        >
            {/* Header Sidebar: Tombol Back & Kolom Pencarian */}
            <div className="border-b border-[#3B28F6]/20 p-4">
                <div className="mb-4 flex items-center gap-3 sm:gap-6">
                    {/* Tombol Back Futuristik */}
                    <div className="group relative shrink-0 cursor-pointer">
                        <svg
                            className="h-[36px] w-[80px] overflow-visible sm:h-[49px] sm:w-[110px]"
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
                                className="h-8 w-8 sm:h-11 sm:w-11"
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

                    <h1 className="text-md font-['Orbitron'] font-extrabold tracking-[0.05em] whitespace-nowrap text-[#1e3a8a] uppercase transition-colors duration-500 sm:text-xl sm:tracking-[0.1em] md:text-2xl lg:text-3xl xl:text-4xl 2xl:text-lg dark:text-[#F0F0F0]">
                        Forum Group
                    </h1>
                </div>

                {/* Input Pencarian */}
                <div className="relative">
                    <Search className="absolute top-1/2 left-3 z-10 h-4 w-4 -translate-y-1/2 text-slate-400" />
                    <input
                        type="text"
                        placeholder="Cari grup diskusi..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full rounded-xl border-[1px] border-transparent bg-transparent py-2.5 pr-4 pl-10 text-sm text-white placeholder-slate-500 transition outline-none focus:ring-1 focus:ring-[#facc15]"
                        style={{
                            backgroundImage:
                                'linear-gradient(#121212, #121212), linear-gradient(to bottom, #3B28F6 0%, #4c2fff 30%, #7c3aed 50%, #facc15 100%)',
                            backgroundOrigin: 'border-box',
                            backgroundClip: 'padding-box, border-box',
                            backgroundColor: 'transparent',
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
                                className={`flex cursor-pointer items-center gap-2.5 sm:gap-3 rounded-lg border-1 border-white px-3 sm:px-4 py-2.5 sm:py-3 transition-colors duration-200 ${
                                    isActive
                                        ? 'bg-[#3B28F6]/15'
                                        : 'bg-[#121212] hover:bg-white/5'
                                }`}
                            >
                                {/* Avatar Kursus */}
                                <div className="relative h-10 w-10 lg:h-12 lg:w-12 shrink-0 overflow-hidden rounded-xl border border-white bg-slate-900">
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
                                        <h3 className="truncate font-['Oxanium'] text-sm leading-none font-semibold text-white">
                                            {group.title}
                                        </h3>
                                        {group.last_message && (
                                            <span className="ml-2 shrink-0 text-[10px] whitespace-nowrap text-slate-500">
                                                {formatTime(
                                                    group.last_message.created_at
                                                )}
                                            </span>
                                        )}
                                    </div>
                                    <div className="truncate text-xs text-slate-400">
                                        {group.last_message ? (
                                            <>
                                                <span className="font-semibold text-slate-300">
                                                    {group.last_message.sender_name}
                                                    :
                                                </span>{' '}
                                                {group.last_message.message}
                                            </>
                                        ) : (
                                            <span className="text-slate-600 italic">
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
