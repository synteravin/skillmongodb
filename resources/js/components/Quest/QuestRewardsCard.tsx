import React from 'react';
import { Award } from 'lucide-react';

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
            <span className="block text-[10px] font-bold tracking-wider text-purple-600 uppercase dark:text-purple-400">
                🎁 RPG Quest Rewards
            </span>
            <div className="grid grid-cols-3 gap-2 text-center text-xs font-bold">
                {/* EXP Card */}
                <div className="py-2.5 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-600 dark:text-purple-300 flex flex-col items-center hover:scale-[1.03] transition-transform">
                    <Award className="w-3.5 h-3.5 text-purple-500 mb-1" />
                    <span className="text-[9px] text-slate-400 font-semibold">EXP</span>
                    <span className="text-[11px] font-black">+{exp}</span>
                </div>

                {/* GOLD Card */}
                <div className="py-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-600 dark:text-amber-400 flex flex-col items-center hover:scale-[1.03] transition-transform">
                    <Award className="w-3.5 h-3.5 text-amber-500 mb-1" />
                    <span className="text-[9px] text-slate-400 font-semibold">GOLD</span>
                    <span className="text-[11px] font-black">+{gold}</span>
                </div>

                {/* ERP Card */}
                <div className="py-2.5 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-600 dark:text-indigo-300 flex flex-col items-center hover:scale-[1.03] transition-transform">
                    <Award className="w-3.5 h-3.5 text-indigo-500 mb-1" />
                    <span className="text-[9px] text-slate-400 font-semibold">ERP</span>
                    <span className="text-[11px] font-black">+{erp}</span>
                </div>
            </div>
        </div>
    );
};

export default QuestRewardsCard;
