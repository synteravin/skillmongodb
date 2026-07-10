import React from 'react';

interface EmptyStateProps {
    type: 'no-messages' | 'no-course-selected';
}

export default function EmptyState({ type }: EmptyStateProps) {
    if (type === 'no-messages') {
        return (
            <div className="flex h-full animate-fade-in flex-col items-center justify-center text-center text-slate-500">
                <p className="font-['Oxanium'] text-sm">
                    Belum ada percakapan. Mulai obrolan pertama Anda!
                </p>
            </div>
        );
    }

    return (
        <div className="flex h-full animate-fade-in flex-col items-center justify-center p-8 text-center text-slate-500">
            <h3 className="mb-1 font-['Orbitron'] text-base font-bold text-slate-400">
                Pilih Obrolan Forum
            </h3>
            <p className="max-w-[280px] font-['Oxanium'] text-xs text-slate-500">
                Grup chat akan ditampilkan berdasarkan daftar kelas/kursus yang Anda ikuti.
            </p>
        </div>
    );
}
