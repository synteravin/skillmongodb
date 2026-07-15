import React, { useEffect, useState } from 'react';
import { Award, Info } from 'lucide-react';

interface QuestRewardsEstimatorProps {
    minSalary: string;
    maxSalary: string;
}

export default function QuestRewardsEstimator({
    minSalary,
    maxSalary,
}: QuestRewardsEstimatorProps) {
    const [rewards, setRewards] = useState({
        exp: 100,
        gold: 50,
        erp: 20,
        rank: 'Bronze',
    });

    useEffect(() => {
        const maxVal = parseFloat(maxSalary) || 0;
        const minVal = parseFloat(minSalary) || 0;
        const avgBudget = (minVal + maxVal) / 2;

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

        let rank = 'Bronze';
        if (maxVal >= 10000000) {
            rank = 'Mythic';
        } else if (maxVal >= 5000000) {
            rank = 'Diamond';
        } else if (maxVal >= 2500000) {
            rank = 'Gold';
        } else if (maxVal >= 1000000) {
            rank = 'Silver';
        }

        setRewards({ exp, gold, erp, rank });
    }, [minSalary, maxSalary]);

    return (
        <div className="space-y-4 rounded-2xl border border-slate-200 bg-white/70 p-6 font-['Orbitron'] shadow-md backdrop-blur-md dark:border-slate-800/80 dark:bg-[#0c122c]/40">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 dark:border-slate-800">
                <div className="flex items-center gap-2">
                    <Award className="h-5 w-5 animate-pulse text-purple-500" />
                    <h3 className="text-xs font-black tracking-wider text-slate-700 uppercase dark:text-blue-200">
                        Quest Rewards Estimator
                    </h3>
                </div>
                <span className="text-purple-655 rounded-md border border-purple-500/20 bg-purple-500/10 px-2 py-0.5 text-[9px] font-black tracking-wider uppercase dark:text-purple-300">
                    Rank: {rewards.rank}
                </span>
            </div>

            <p className="font-sans text-[10px] leading-relaxed text-slate-500 dark:text-slate-400">
                <Info className="-mt-0.5 mr-1 inline h-3.5 w-3.5 text-indigo-500" />
                Hadiah RPG akan otomatis dikalkulasikan berdasarkan anggaran quest Anda dan akan ditambahkan ke akun pekerja saat tugas disetujui.
            </p>

            <div className="grid grid-cols-3 gap-2.5 pt-1 text-center font-['Orbitron'] text-xs font-bold">
                <div className="flex flex-col items-center rounded-xl border border-purple-500/20 bg-purple-500/10 py-2.5 text-purple-600 transition-transform hover:scale-[1.03] dark:text-purple-300">
                    <Award className="mb-1 h-4 w-4 text-purple-500" />
                    <span className="font-sans text-[8px] font-semibold text-slate-400">
                        EXP
                    </span>
                    <span className="text-[11px] font-black">
                        +{rewards.exp}
                    </span>
                </div>
                <div className="flex flex-col items-center rounded-xl border border-amber-500/20 bg-amber-500/10 py-2.5 text-amber-600 transition-transform hover:scale-[1.03] dark:text-amber-400">
                    <Award className="mb-1 h-4 w-4 text-amber-500" />
                    <span className="font-sans text-[8px] font-semibold text-slate-400">
                        GOLD
                    </span>
                    <span className="text-[11px] font-black">
                        +{rewards.gold}
                    </span>
                </div>
                <div className="flex flex-col items-center rounded-xl border border-indigo-500/20 bg-indigo-500/10 py-2.5 text-indigo-600 transition-transform hover:scale-[1.03] dark:text-indigo-300">
                    <Award className="mb-1 h-4 w-4 text-indigo-500" />
                    <span className="font-sans text-[8px] font-semibold text-slate-400">
                        ERP
                    </span>
                    <span className="text-[11px] font-black">
                        +{rewards.erp}
                    </span>
                </div>
            </div>
        </div>
    );
}
