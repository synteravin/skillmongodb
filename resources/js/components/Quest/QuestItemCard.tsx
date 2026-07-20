import React from 'react';
import { Link, usePage } from '@inertiajs/react';
import { DollarSign, Calendar, Lock } from 'lucide-react';
import { Quest } from '@/types/quest';

interface QuestItemCardProps {
    quest: Quest;
}

export default function QuestItemCard({ quest }: QuestItemCardProps) {
    const { props } = usePage<any>();
    const currentUser = props.auth?.user;
    const isMyWorker = currentUser?.id === quest.worker_id;
    const isMyCreator = currentUser?.id === quest.creator_id;
    const isOngoingByOthers =
        quest.worker_id && quest.worker_id !== currentUser?.id;

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
        return `${datePart} ${timePart}`;
    };

    const getQuestRank = (maxSalary: number) => {
        if (maxSalary >= 10000000) {
            return {
                rank: 'Enterprise',
                color: 'border-blue-500/30 bg-blue-500/10 text-blue-700 dark:border-blue-500/30 dark:bg-blue-500/20 dark:text-blue-400',
            };
        }
        if (maxSalary >= 5000000) {
            return {
                rank: 'Expert',
                color: 'border-indigo-500/30 bg-indigo-500/10 text-indigo-700 dark:border-indigo-500/30 dark:bg-indigo-500/20 dark:text-indigo-400',
            };
        }
        if (maxSalary >= 2500000) {
            return {
                rank: 'Intermediate',
                color: 'border-emerald-500/30 bg-emerald-500/10 text-emerald-700 dark:border-emerald-500/30 dark:bg-emerald-500/20 dark:text-emerald-400',
            };
        }
        if (maxSalary >= 1000000) {
            return {
                rank: 'Entry-Level',
                color: 'border-slate-300 bg-slate-100 text-slate-700 dark:border-slate-700 dark:bg-slate-800/60 dark:text-slate-300',
            };
        }
        return {
            rank: 'Basic',
            color: 'border-amber-500/30 bg-amber-500/10 text-amber-700 dark:border-amber-500/30 dark:bg-amber-500/20 dark:text-amber-400',
        };
    };

    const isCompleted = quest.status === 'completed';
    const rankInfo = getQuestRank(quest.max_salary);

    return (
        <div
            className={`group relative flex flex-col justify-between overflow-hidden rounded-xl border p-5 transition-all duration-200 ${
                isCompleted
                    ? 'cursor-default border-emerald-500/30 bg-emerald-50/20 dark:border-emerald-950/60 dark:bg-gradient-to-b dark:from-[#061512] dark:to-[#030807]'
                    : isMyWorker
                      ? 'border-emerald-400/60 bg-emerald-50/40 hover:border-emerald-500 hover:shadow-sm dark:border-emerald-500/40 dark:bg-gradient-to-b dark:from-[#081b16] dark:to-[#030a08]'
                      : isMyCreator
                        ? 'border-indigo-400/60 bg-indigo-50/40 hover:border-indigo-500 hover:shadow-sm dark:border-indigo-500/40 dark:bg-gradient-to-b dark:from-[#0e0e24] dark:to-[#090914]'
                        : isOngoingByOthers
                          ? 'border-slate-300 bg-slate-100/90 dark:border-slate-800 dark:bg-gradient-to-b dark:from-[#0a0d17] dark:to-[#06080f]'
                          : 'border-slate-300 bg-white hover:border-indigo-400 hover:shadow-md dark:border-slate-800 dark:bg-gradient-to-b dark:from-[#0e0e1a] dark:to-[#090910] dark:hover:border-slate-700'
            }`}
        >
            <div className="pointer-events-none absolute top-0 right-8 left-8 z-0 h-px bg-gradient-to-r from-transparent via-slate-300 to-transparent select-none dark:via-slate-700" />
            <div className="relative z-10 flex h-full flex-col justify-between">
                {/* Badge Header */}
                <div className="mb-3.5 flex flex-wrap items-center justify-between gap-2 text-[10px]">
                    <div className="flex flex-wrap items-center gap-1.5 font-medium">
                        <span
                            className={`rounded border px-2 py-0.5 font-semibold ${rankInfo.color}`}
                        >
                            {rankInfo.rank}
                        </span>

                        {isMyWorker && !isCompleted && (
                            <span className="flex items-center gap-1.5 rounded border border-emerald-500/30 bg-emerald-500/10 px-2 py-0.5 font-bold text-emerald-700 dark:border-emerald-500/30 dark:bg-emerald-500/20 dark:text-emerald-400">
                                <span className="relative flex h-1.5 w-1.5">
                                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75"></span>
                                    <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-500"></span>
                                </span>
                                Pekerjaan Anda
                            </span>
                        )}

                        {isMyCreator && !isCompleted && (
                            <span className="rounded border border-indigo-500/30 bg-indigo-500/10 px-2 py-0.5 font-bold text-indigo-700 dark:border-indigo-500/30 dark:bg-indigo-500/20 dark:text-indigo-400">
                                Proyek Anda
                            </span>
                        )}

                        {isOngoingByOthers && !isCompleted && (
                            <span className="flex items-center gap-1 rounded border border-amber-500/30 bg-amber-500/10 px-2 py-0.5 font-bold text-amber-700 dark:border-amber-500/30 dark:bg-amber-500/20 dark:text-amber-400">
                                <Lock size={10} />
                                Terisi
                            </span>
                        )}
                    </div>

                    <span
                        className={`rounded-full border px-2.5 py-0.5 text-[9px] font-extrabold uppercase tracking-wider ${
                            quest.status === 'open'
                                ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-700 dark:border-emerald-500/30 dark:bg-emerald-500/20 dark:text-emerald-400'
                                : quest.status === 'ongoing'
                                  ? 'border-sky-500/30 bg-sky-500/10 text-sky-700 dark:border-sky-500/30 dark:bg-sky-500/20 dark:text-sky-400'
                                  : quest.status === 'approved' ||
                                      quest.status === 'payment' ||
                                      quest.status === 'submitted'
                                    ? 'border-amber-500/30 bg-amber-500/10 text-amber-700 dark:border-amber-500/30 dark:bg-amber-500/20 dark:text-amber-400'
                                    : 'border-emerald-500/30 bg-emerald-500/10 text-emerald-700 dark:border-emerald-500/30 dark:bg-emerald-500/20 dark:text-emerald-400'
                        }`}
                    >
                        {quest.status === 'open'
                            ? 'Tersedia'
                            : quest.status === 'ongoing'
                              ? 'Berjalan'
                              : quest.status === 'approved' ||
                                  quest.status === 'payment'
                                ? 'Pelunasan'
                                : quest.status === 'submitted'
                                  ? 'Ditinjau'
                                  : 'Selesai'}
                    </span>
                </div>

                {/* Title */}
                <h2
                    className={`mb-2 line-clamp-1 text-sm font-bold tracking-tight transition-colors sm:text-base ${
                        isCompleted
                            ? 'text-slate-500 dark:text-slate-400'
                            : isMyWorker
                              ? 'text-slate-900 group-hover:text-emerald-600 dark:text-white dark:group-hover:text-emerald-400'
                              : isMyCreator
                                ? 'text-slate-900 group-hover:text-indigo-600 dark:text-white dark:group-hover:text-indigo-400'
                                : isOngoingByOthers
                                  ? 'text-slate-800 dark:text-slate-300'
                                  : 'text-slate-900 group-hover:text-indigo-600 dark:text-white dark:group-hover:text-indigo-400'
                    }`}
                >
                    {quest.title}
                </h2>

                {/* Description */}
                <p
                    className={`mb-4.5 line-clamp-3 text-xs font-normal leading-relaxed ${
                        isCompleted
                            ? 'text-slate-500 dark:text-slate-500'
                            : isOngoingByOthers
                              ? 'text-slate-600 dark:text-slate-400'
                              : 'text-slate-600 dark:text-slate-400'
                    }`}
                >
                    {quest.description}
                </p>

                {/* Specifications details */}
                <div className="mb-4 grid grid-cols-2 gap-3 border-t border-slate-200 pt-3 text-[11px] dark:border-slate-800">
                    <div className="flex items-center gap-2.5 text-slate-700 dark:text-slate-300">
                        <DollarSign className="h-4 w-4 shrink-0 text-slate-500 dark:text-slate-400" />
                        <div>
                            <span className="block text-[9px] font-bold tracking-wider text-slate-500 uppercase dark:text-slate-400">
                                Anggaran
                            </span>
                            <span
                                className={`font-bold ${
                                    isCompleted || isOngoingByOthers
                                        ? 'text-slate-700 dark:text-slate-300'
                                        : 'text-slate-900 dark:text-white'
                                }`}
                            >
                                {formatCurrency(quest.min_salary)} -{' '}
                                {formatCurrency(quest.max_salary)}
                            </span>
                        </div>
                    </div>

                    <div className="flex items-center gap-2.5 text-slate-700 dark:text-slate-300">
                        <Calendar className="h-4 w-4 shrink-0 text-slate-500 dark:text-slate-400" />
                        <div>
                            <span className="block text-[9px] font-bold tracking-wider text-slate-500 uppercase dark:text-slate-400">
                                Batas Waktu
                            </span>
                            <span
                                className={`font-bold ${
                                    isCompleted || isOngoingByOthers
                                        ? 'text-slate-700 dark:text-slate-300'
                                        : 'text-slate-900 dark:text-white'
                                }`}
                            >
                                {formatDate(quest.deadline)}
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="flex items-center justify-between border-t border-slate-200 pt-3 dark:border-slate-800">
                <div className="flex items-center gap-2 text-xs text-slate-700 dark:text-slate-300">
                    <div className="flex h-5 w-5 items-center justify-center rounded-full bg-slate-200 font-extrabold text-slate-800 dark:bg-slate-800 dark:text-slate-200">
                        {quest.creator.name.substring(0, 1).toUpperCase()}
                    </div>
                    <span className="truncate max-w-[100px] font-bold text-slate-800 dark:text-slate-200">
                        {quest.creator.name}
                    </span>
                </div>

                {isCompleted ? (
                    <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700 dark:text-emerald-400">
                        Selesai ✓
                    </span>
                ) : (
                    <Link
                        href={`/student/quests/${quest._id}`}
                        className={`inline-flex items-center gap-1 text-xs font-bold transition-colors ${
                            isOngoingByOthers
                                ? 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200'
                                : 'text-indigo-700 hover:underline dark:text-indigo-400'
                        }`}
                    >
                        Lihat Proyek →
                    </Link>
                )}
            </div>
        </div>
    );
}
