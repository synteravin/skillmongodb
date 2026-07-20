import React from 'react';
import { Sparkles } from 'lucide-react';

interface QuestRewardsCardProps {
    rewards?: {
        exp?: number;
        gold?: number;
        erp?: number;
    } | null;
}

const QuestRewardsCard: React.FC<QuestRewardsCardProps> = ({ rewards }) => {
    const exp = rewards?.exp ?? 250;
    const gold = rewards?.gold ?? 150;
    const erp = rewards?.erp ?? 100;

    return (
        <div className="space-y-3 border-t border-slate-100 pt-4 dark:border-slate-800">
            <span className="block text-[10px] font-semibold tracking-wider text-slate-400 uppercase">
                Poin Kontribusi & Nilai Proyek
            </span>
            <div className="grid grid-cols-3 gap-2 text-center text-xs">
                {/* EXP Card */}
                <div className="flex flex-col items-center rounded-xl border border-slate-100 bg-slate-50/50 py-2 dark:border-slate-800 dark:bg-[#030712]">
                    <Sparkles className="mb-1 h-3.5 w-3.5 text-slate-400 dark:text-slate-500" />
                    <span className="text-[9px] font-medium text-slate-405">
                        XP Kerja
                    </span>
                    <span className="text-xs font-bold text-slate-800 dark:text-white">
                        +{exp}
                    </span>
                </div>

                {/* GOLD Card */}
                <div className="flex flex-col items-center rounded-xl border border-slate-100 bg-slate-50/50 py-2 dark:border-slate-800 dark:bg-[#030712]">
                    <Sparkles className="mb-1 h-3.5 w-3.5 text-slate-400 dark:text-slate-500" />
                    <span className="text-[9px] font-medium text-slate-405">
                        Gold Token
                    </span>
                    <span className="text-xs font-bold text-slate-800 dark:text-white">
                        +{gold}
                    </span>
                </div>

                {/* ERP Card */}
                <div className="flex flex-col items-center rounded-xl border border-slate-100 bg-slate-50/50 py-2 dark:border-slate-800 dark:bg-[#030712]">
                    <Sparkles className="mb-1 h-3.5 w-3.5 text-slate-400 dark:text-slate-500" />
                    <span className="text-[9px] font-medium text-slate-405">
                        Reputasi (ERP)
                    </span>
                    <span className="text-xs font-bold text-slate-800 dark:text-white">
                        +{erp}
                    </span>
                </div>
            </div>
        </div>
    );
};

export default QuestRewardsCard;
