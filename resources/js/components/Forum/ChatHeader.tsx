import React from 'react';
import { User as UserIcon } from 'lucide-react';
import { router } from '@inertiajs/react';
import { SelectedCourse } from './types';

interface ChatHeaderProps {
    selectedCourse: SelectedCourse;
    basePath: string;
    setShowChatMobile: (show: boolean) => void;
}

export default function ChatHeader({
    selectedCourse,
    basePath,
    setShowChatMobile,
}: ChatHeaderProps) {
    return (
        <div
            className="p-[1px] shrink-0 z-10"
            style={{
                background:
                    'linear-gradient(to bottom, #3B28F6 0%, #4c2fff 30%, #7c3aed 50%, #facc15 100%)',
            }}
        >
            <div className="flex items-center justify-between bg-white dark:bg-[#0f0e0e] transition-colors duration-300 px-4 py-3 md:px-4 md:py-3.5 lg:px-6 lg:py-4.5">
                <div className="flex items-center gap-3">
                    {/* Tombol Back Mobile/Tablet */}
                    <button
                        type="button"
                        onClick={() => {
                             setShowChatMobile(false);
                             router.visit(basePath);
                        }}
                        className="relative z-10 mr-2 flex h-10 w-10 shrink-0 items-center justify-center rounded border-2 border-blue-500 bg-blue-100 transition-colors hover:border-blue-600 hover:bg-blue-200 dark:border-blue-800 dark:bg-[#0b1021] dark:hover:border-blue-600 dark:hover:bg-blue-900/40 md:hidden active:scale-95"
                    >
                        <svg viewBox="0 0 48 48" className="h-7 w-7 scale-125 text-indigo-600 transition-transform duration-200 hover:scale-150 dark:text-indigo-500">
                            <rect x="12" y="20" width="29" height="4" fill="currentColor" />
                            <rect x="8"  y="20" width="4"  height="4" fill="currentColor" />
                            <rect x="5"  y="20" width="5"  height="4" fill="currentColor" />
                            <rect x="8"  y="16" width="4"  height="4" fill="currentColor" />
                            <rect x="8"  y="24" width="4"  height="4" fill="currentColor" />
                            <rect x="12" y="12" width="4"  height="4" fill="currentColor" />
                            <rect x="12" y="28" width="4"  height="4" fill="currentColor" />
                            <rect x="16" y="8"  width="4"  height="4" fill="currentColor" />
                            <rect x="16" y="32" width="4"  height="4" fill="currentColor" />
                        </svg>
                    </button>

                    <div className="h-9 w-9 md:h-10 md:w-10 overflow-hidden rounded-xl border border-[#3B28F6]/40 bg-slate-900 transition-all duration-300 hover:scale-105">
                        {selectedCourse.thumbnail ? (
                            <img
                                src={selectedCourse.thumbnail}
                                alt={selectedCourse.title}
                                className="h-full w-full object-cover"
                            />
                        ) : (
                            <div className="flex h-full w-full items-center justify-center bg-indigo-950">
                                <UserIcon className="h-5 w-5 text-indigo-400" />
                            </div>
                        )}
                    </div>
                    <div>
                        <h2 className="font-['Orbitron'] text-sm font-bold tracking-wide text-slate-800 dark:text-white md:text-base">
                            {selectedCourse.title}
                        </h2>
                        <p className="text-[10px] text-indigo-600 dark:text-[#facc15] font-semibold">
                            Diskusi Kelas Aktif
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
