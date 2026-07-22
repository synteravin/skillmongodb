import React, { useEffect, useState } from 'react';
import { ShieldCheck, Info } from 'lucide-react';

interface QuestRewardsEstimatorProps {
    maxSalary: number;
}

export default function QuestRewardsEstimator({
    maxSalary,
}: QuestRewardsEstimatorProps) {
    const [rewards, setRewards] = useState({
        exp: 100,
        gold: 50,
        erp: 20,
        rank: 'Bronze',
    });

    useEffect(() => {
        const maxVal = maxSalary || 0;
        const avgBudget = maxVal;

        const exp = Math.min(
            1000,
            Math.max(100, Math.round(100 + avgBudget * 0.0001)),
        );

        const gold = Math.min(
            500,
            Math.max(50, Math.round(50 + maxVal * 0.00005)),
        );

        const erp = Math.min(
            200,
            Math.max(20, Math.round(20 + avgBudget * 0.00002)),
        );

        let rank = 'Basic';
        if (maxVal >= 10000000) {
            rank = 'Enterprise';
        } else if (maxVal >= 5000000) {
            rank = 'Expert';
        } else if (maxVal >= 2500000) {
            rank = 'Intermediate';
        } else if (maxVal >= 1000000) {
            rank = 'Entry-Level';
        }

        setRewards({ exp, gold, erp, rank });
    }, [maxSalary]);

    return (
        <div className="relative space-y-4 overflow-hidden rounded-xl border border-slate-200/80 bg-white p-5 dark:border-slate-800/80 dark:bg-gradient-to-b dark:from-[#0e0e1a] dark:to-[#090910]">
            <div className="pointer-events-none absolute top-0 right-8 left-8 z-0 h-px bg-gradient-to-r from-transparent via-slate-300 to-transparent select-none dark:via-slate-700" />
            <div className="relative z-10 flex items-center justify-between border-b border-slate-100 pb-3 dark:border-slate-800">
                <div className="flex items-center gap-2">
                    <ShieldCheck className="text-indigo-650 h-4.5 w-4.5 dark:text-indigo-400" />
                    <h3 className="text-xs font-semibold text-slate-700 dark:text-slate-200">
                        Platform Poin Kontribusi
                    </h3>
                </div>
                <span className="text-indigo-650 rounded-md border border-slate-200 bg-slate-50 px-2 py-0.5 text-[10px] font-semibold dark:border-slate-800 dark:bg-[#030712] dark:text-indigo-400">
                    Proyek: {rewards.rank}
                </span>
            </div>

            <p className="text-[11px] leading-relaxed text-slate-500 dark:text-slate-400">
                <Info className="-mt-0.5 mr-1 inline h-3.5 w-3.5 text-indigo-500" />
                Poin kontribusi dan engagement secara otomatis dihitung
                berdasarkan anggaran dan ditambahkan ke profil profesional
                pekerja setelah pekerjaan disetujui.
            </p>

            <div className="grid grid-cols-3 gap-2.5 pt-1 text-center text-xs">
                {/* EXP */}
                <div className="flex flex-col items-center rounded-xl border border-slate-100 bg-slate-50/50 py-2.5 dark:border-slate-800 dark:bg-[#030712]">
                    <span className="text-[9px] font-medium text-slate-400">
                        XP Kerja
                    </span>
                    <span className="text-xs font-bold text-slate-800 dark:text-white">
                        +{rewards.exp}
                    </span>
                </div>

                {/* GOLD */}
                <div className="flex flex-col items-center rounded-xl border border-slate-100 bg-slate-50/50 py-2.5 dark:border-slate-800 dark:bg-[#030712]">
                    <span className="text-[9px] font-medium text-slate-400">
                        Gold Token
                    </span>
                    <span className="text-xs font-bold text-slate-800 dark:text-white">
                        +{rewards.gold}
                    </span>
                </div>

                {/* ERP */}
                <div className="flex flex-col items-center rounded-xl border border-slate-100 bg-slate-50/50 py-2.5 dark:border-slate-800 dark:bg-[#030712]">
                    <span className="text-[9px] font-medium text-slate-400">
                        Reputasi (ERP)
                    </span>
                    <span className="text-xs font-bold text-slate-800 dark:text-white">
                        +{rewards.erp}
                    </span>
                </div>
            </div>
        </div>
    );
}
