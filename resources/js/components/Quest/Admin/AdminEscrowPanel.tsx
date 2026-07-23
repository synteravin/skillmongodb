import React from 'react';
import { Quest } from '@/types/quest';

interface AdminEscrowPanelProps {
    quest: Quest;
    formatCurrency: (num: number) => string;
}

export default function AdminEscrowPanel({
    quest,
    formatCurrency,
}: AdminEscrowPanelProps) {
    if (quest.status === 'draft') {
        return null;
    }

    return (
        <div className="relative overflow-hidden grid grid-cols-1 gap-5 rounded-xl border border-slate-200 bg-white p-6 shadow-sm md:grid-cols-3 dark:border-slate-800 dark:bg-gradient-to-b dark:from-[#0e0e1a] dark:to-[#090910]">
            <div className="absolute top-0 right-8 left-8 h-px bg-gradient-to-r from-transparent via-slate-300 to-transparent dark:via-slate-700" />

            {/* Column 1: Escrow Amount */}
            <div className="flex items-center gap-4 border-r border-slate-200 pr-5 dark:border-slate-800">
                <div className="min-w-0 flex-1">
                    <span className="block text-[10px] font-bold tracking-wider text-slate-500 uppercase dark:text-slate-400">
                        Dana di Escrow
                    </span>
                    <span className="text-xl font-extrabold text-slate-900 dark:text-white">
                        {quest.accepted_bid_amount
                            ? formatCurrency(quest.accepted_bid_amount)
                            : formatCurrency(quest.max_salary || 0)}
                    </span>
                    <span className="mt-1 block text-[10px] font-semibold text-slate-500 dark:text-slate-400">
                        {quest.accepted_bid_amount
                            ? 'Nilai Kontrak Aktif'
                            : 'Estimasi Anggaran Maksimal'}
                    </span>
                </div>
            </div>

            {/* Column 2: Escrow Status */}
            <div className="flex items-center gap-4 border-r border-slate-200 px-2 md:px-5 dark:border-slate-800">
                <div>
                    <span className="block text-[10px] font-bold tracking-wider text-slate-500 uppercase dark:text-slate-400">
                        Status Escrow
                    </span>
                    <span
                        className={`mt-1 inline-block rounded px-2.5 py-1 text-[10px] font-extrabold tracking-wider uppercase ${
                            ['approved', 'completed'].includes(quest.status)
                                ? 'bg-emerald-500/20 text-emerald-700 border border-emerald-500/30 dark:text-emerald-400'
                                : quest.status === 'disputed'
                                  ? 'animate-pulse bg-red-500/20 text-red-700 border border-red-500/30 dark:text-red-400'
                                  : 'bg-amber-500/20 text-amber-700 border border-amber-500/30 dark:text-amber-400'
                        }`}
                    >
                        {['approved', 'completed'].includes(quest.status)
                            ? 'Dicairkan (Released)'
                            : quest.status === 'disputed'
                              ? 'Ditangguhkan (Disputed)'
                              : quest.status === 'open'
                                ? 'Komitmen Awal'
                                : 'Mengunci Kontrak'}
                    </span>
                    <span className="mt-1 block text-[10px] font-semibold text-slate-500 dark:text-slate-400">
                        Platform Escrow Aman 100%
                    </span>
                </div>
            </div>

            {/* Column 3: Platform Oversight */}
            <div className="flex items-center gap-4 pl-2 md:pl-5">
                <div className="min-w-0 flex-1">
                    <span className="block text-[10px] font-bold tracking-wider text-slate-500 uppercase dark:text-slate-400">
                        Audit Keamanan
                    </span>
                    <span className="block truncate text-xs font-bold text-slate-900 dark:text-white">
                        Pekerja:{' '}
                        {quest.worker ? quest.worker.name : 'Mencari Pelamar'}
                    </span>
                    <span className="mt-1 block text-[10px] font-semibold text-slate-500 dark:text-slate-400">
                        Fee Platform: 10% Terintegrasi
                    </span>
                </div>
            </div>
        </div>
    );
}
