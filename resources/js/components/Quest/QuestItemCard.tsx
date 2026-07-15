import React from 'react';
import { Link } from '@inertiajs/react';
import { DollarSign, Calendar, Users } from 'lucide-react';
import { Quest } from '@/types/quest';

interface QuestItemCardProps {
    quest: Quest;
}

export default function QuestItemCard({ quest }: QuestItemCardProps) {
    const formatCurrency = (num: number) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
        }).format(num);
    };

    const formatDate = (dateStr: string) => {
        const d = new Date(dateStr);
        const datePart = d.toLocaleDateString('id-ID', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });
        const timePart = d.toLocaleTimeString('id-ID', {
            hour: '2-digit',
            minute: '2-digit',
        });
        return `${datePart} pukul ${timePart}`;
    };

    const getQuestRank = (maxSalary: number) => {
        if (maxSalary >= 10000000) {
            return {
                rank: 'Mythic',
                color: 'border-purple-500/20 bg-purple-500/10 text-purple-700 dark:text-purple-400',
            };
        }
        if (maxSalary >= 5000000) {
            return {
                rank: 'Diamond',
                color: 'border-cyan-500/20 bg-cyan-500/10 text-cyan-700 dark:text-cyan-400',
            };
        }
        if (maxSalary >= 2500000) {
            return {
                rank: 'Gold',
                color: 'border-yellow-500/20 bg-yellow-500/10 text-yellow-700 dark:text-yellow-400',
            };
        }
        if (maxSalary >= 1000000) {
            return {
                rank: 'Silver',
                color: 'border-slate-500/20 bg-slate-500/10 text-slate-700 dark:text-slate-400',
            };
        }
        return {
            rank: 'Bronze',
            color: 'border-orange-500/20 bg-orange-500/10 text-orange-700 dark:text-orange-400',
        };
    };

    const rankInfo = getQuestRank(quest.max_salary);

    return (
        <div className="group relative flex transform flex-col justify-between rounded-2xl border border-slate-200 bg-white/70 p-5 shadow-sm backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:border-indigo-500/45 hover:shadow-[0_0_20px_rgba(99,102,241,0.08)] dark:border-slate-800/80 dark:bg-[#0c122c]/40 dark:hover:border-indigo-500/40">
            <div>
                {/* Badge header */}
                <div className="mb-3 flex items-start justify-between gap-3 font-['Orbitron']">
                    <span className={`rounded border px-2 py-0.5 text-[9px] font-black tracking-wider uppercase ${rankInfo.color}`}>
                        Rank: {rankInfo.rank}
                    </span>

                    <span className={`rounded-full border px-2.5 py-0.5 text-[9px] font-black tracking-wider uppercase ${
                        quest.status === 'open'
                            ? 'border-green-500/20 bg-green-500/10 text-green-700 dark:text-green-400'
                            : quest.status === 'ongoing'
                            ? 'border-blue-500/20 bg-blue-500/10 text-blue-700 dark:text-blue-400'
                            : 'border-slate-500/20 bg-slate-500/10 text-slate-600 dark:text-slate-400'
                    }`}>
                        {quest.status === 'open'
                            ? 'Tersedia'
                            : quest.status === 'ongoing'
                            ? 'Berjalan'
                            : 'Selesai'}
                    </span>
                </div>

                {/* Title */}
                <h2 className="mb-2 line-clamp-1 font-['Oxanium'] text-sm font-extrabold tracking-tight text-slate-900 transition-colors group-hover:text-indigo-600 sm:text-base dark:text-white dark:group-hover:text-indigo-400">
                    {quest.title}
                </h2>

                {/* Description */}
                <p className="dark:text-slate-350 mb-4 line-clamp-3 font-['Oxanium'] text-xs leading-relaxed text-slate-500">
                    {quest.description}
                </p>

                {/* Specifications details */}
                <div className="mb-4 grid grid-cols-2 gap-3 border-t border-slate-100 pt-4 font-['Oxanium'] text-[11px] dark:border-slate-800/40">
                    <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400">
                        <DollarSign className="h-4 w-4 shrink-0 text-indigo-500" />
                        <div>
                            <span className="block text-[8px] font-semibold tracking-wider text-slate-400 uppercase">
                                Rentang Gaji
                            </span>
                            <span className="font-bold text-slate-700 dark:text-white">
                                {formatCurrency(quest.min_salary)} - {formatCurrency(quest.max_salary)}
                            </span>
                        </div>
                    </div>

                    <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400">
                        <Calendar className="h-4 w-4 shrink-0 text-indigo-500" />
                        <div>
                            <span className="block text-[8px] font-semibold tracking-wider text-slate-400 uppercase">
                                Deadline
                            </span>
                            <span className="font-bold text-slate-700 dark:text-white">
                                {formatDate(quest.deadline)}
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Card Footer */}
            <div className="mt-auto flex items-center justify-between border-t border-slate-100 pt-4 dark:border-slate-800/40">
                <div className="flex flex-col font-['Oxanium']">
                    <span className="text-[8px] font-semibold tracking-wider text-slate-400 uppercase">
                        Diposting Oleh
                    </span>
                    <span className="text-xs font-bold text-slate-600 dark:text-slate-350">
                        {quest.creator.name}
                        <span className="ml-1 text-[10px] font-medium text-slate-400">
                            ({quest.creator.role === 'admin' ? 'Admin' : 'Siswa'})
                        </span>
                    </span>
                </div>

                <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1 font-['Oxanium'] text-xs font-semibold text-slate-400 dark:text-slate-550">
                        <Users className="h-4 w-4" />
                        <span>{quest.bids_count} Bid</span>
                    </div>

                    <Link
                        href={`/student/quests/${quest._id}`}
                        className="rounded-xl bg-slate-900 px-3.5 py-1.5 font-['Orbitron'] text-[10px] font-bold tracking-wider text-white uppercase transition-all duration-300 hover:bg-indigo-650 hover:shadow-[0_0_12px_rgba(99,102,241,0.3)] dark:bg-blue-950/40 dark:hover:bg-indigo-600"
                    >
                        Detail
                    </Link>
                </div>
            </div>
        </div>
    );
}
