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
        <div className="grid grid-cols-1 gap-5 rounded-2xl border border-slate-200 bg-white/70 p-6 font-['Oxanium'] shadow-sm backdrop-blur-md md:grid-cols-3 dark:border-slate-800 dark:bg-[#0c122c]/40">
            {/* Column 1: Escrow Amount */}
            <div className="flex items-center gap-4 border-r border-slate-100 pr-5 dark:border-slate-800/80">
                <div className="min-w-0 flex-1">
                    <span className="block text-[10px] font-semibold tracking-wider text-slate-400 uppercase">
                        Dana di Escrow
                    </span>
                    <span className="text-xl font-black text-slate-800 dark:text-white">
                        {quest.accepted_bid_amount
                            ? formatCurrency(quest.accepted_bid_amount)
                            : formatCurrency(quest.max_salary)}
                    </span>
                    <span className="mt-1 block text-[10px] text-slate-500">
                        {quest.accepted_bid_amount
                            ? 'Nilai Kontrak Aktif'
                            : 'Estimasi Anggaran Maksimal'}
                    </span>
                </div>
            </div>

            {/* Column 2: Escrow Status */}
            <div className="flex items-center gap-4 border-r border-slate-100 px-2 md:px-5 dark:border-slate-800/80">
                <div>
                    <span className="block text-[10px] font-semibold tracking-wider text-slate-400 uppercase">
                        Status Escrow
                    </span>
                    <span
                        className={`mt-0.5 inline-block rounded px-2 py-0.5 font-['Orbitron'] text-[10px] font-black tracking-wider uppercase ${
                            ['approved', 'completed'].includes(quest.status)
                                ? 'bg-emerald-500/20 text-emerald-600 dark:text-emerald-400'
                                : quest.status === 'disputed'
                                  ? 'animate-pulse bg-red-500/20 text-red-600 dark:text-red-400'
                                  : 'bg-amber-500/20 text-amber-600 dark:text-amber-400'
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
                    <span className="mt-1 block text-[10px] text-slate-500">
                        Platform Escrow Aman 100%
                    </span>
                </div>
            </div>

            {/* Column 3: Platform Oversight */}
            <div className="flex items-center gap-4 pl-2 md:pl-5">
                <div className="min-w-0 flex-1">
                    <span className="block text-[10px] font-semibold tracking-wider text-slate-400 uppercase">
                        Audit Keamanan
                    </span>
                    <span className="block truncate text-xs font-bold text-slate-800 dark:text-white">
                        Pekerja:{' '}
                        {quest.worker ? quest.worker.name : 'Mencari Pelamar'}
                    </span>
                    <span className="mt-1 block text-[10px] text-slate-500">
                        Fee Platform: 10% Terintegrasi
                    </span>
                </div>
            </div>
        </div>
    );
}
