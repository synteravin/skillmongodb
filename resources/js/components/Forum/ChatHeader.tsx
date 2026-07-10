import React from 'react';
import { ArrowLeft, User as UserIcon } from 'lucide-react';
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
                    'linear-gradient(to bottom, #3B28F6 0%, #7c3aed 50%, #facc15 100%)',
            }}
        >
            <div className="flex items-center justify-between bg-[#121212] px-4 py-3 md:px-4 md:py-3.5 lg:px-6 lg:py-4.5">
                <div className="flex items-center gap-3">
                    {/* Tombol Back Mobile/Tablet */}
                    <button
                        type="button"
                        onClick={() => {
                            setShowChatMobile(false);
                            router.visit(basePath);
                        }}
                        className="mr-1 rounded-xl border border-[#facc15]/80 bg-black/60 p-2 text-[#facc15] transition duration-300 hover:border-[#facc15] hover:bg-black/80 active:scale-95 md:hidden"
                    >
                        <ArrowLeft className="h-4 w-4" />
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
                        <h2 className="font-['Orbitron'] text-sm font-bold tracking-wide text-white md:text-base">
                            {selectedCourse.title}
                        </h2>
                        <p className="text-[10px] text-[#facc15]">
                            Diskusi Kelas Aktif
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
