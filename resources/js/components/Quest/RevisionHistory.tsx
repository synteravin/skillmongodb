import React from 'react';
import { Quest } from '@/types/quest';

interface RevisionHistoryProps {
    quest: Quest;
    viewType:
        | 'creator_ongoing'
        | 'creator_submitted'
        | 'worker_ongoing'
        | 'worker_submitted'
        | 'admin_submitted'
        | 'admin_ongoing';
}

export default function RevisionHistory({ quest, viewType }: RevisionHistoryProps) {
    if (!quest.revisions || quest.revisions.length === 0) {
        if (!quest.revision_note) {
            return null;
        }

        let label = 'Instruksi/Catatan Revisi:';
        if (viewType === 'creator_ongoing') {
            label = 'Instruksi Revisi dari Anda:';
        } else if (viewType === 'creator_submitted') {
            label = 'Catatan Revisi Sebelumnya:';
        } else if (viewType === 'worker_ongoing') {
            label = 'Permintaan Revisi Pemilik:';
        } else if (viewType === 'worker_submitted') {
            label = 'Permintaan Revisi Sebelumnya:';
        } else if (viewType === 'admin_submitted') {
            label = 'Catatan Revisi Sebelumnya:';
        } else if (viewType === 'admin_ongoing') {
            label = 'Menunggu Revisi Pekerja:';
        }

        return (
            <div className="space-y-1 rounded-xl border border-red-500/20 bg-red-500/10 p-3.5 font-['Oxanium']">
                <span className="block font-['Orbitron'] text-[10px] font-bold tracking-wider text-red-600 uppercase dark:text-red-400">
                    ⚠️ {label}
                </span>
                <p className="text-slate-600 dark:text-slate-300 mt-1 text-xs leading-relaxed whitespace-pre-wrap italic">
                    "{quest.revision_note}"
                </p>
            </div>
        );
    }

    const latestRevision = quest.revisions[quest.revisions.length - 1];
    let mainLabel = 'Instruksi Revisi Terakhir:';
    if (viewType === 'creator_ongoing') {
        mainLabel = 'Instruksi Revisi Terakhir dari Anda:';
    } else if (viewType === 'creator_submitted') {
        mainLabel = 'Catatan/Permintaan Revisi Sebelumnya:';
    } else if (viewType === 'worker_ongoing') {
        mainLabel = 'Permintaan Revisi Pemilik:';
    } else if (viewType === 'worker_submitted') {
        mainLabel = 'Permintaan Revisi Sebelumnya:';
    } else if (viewType === 'admin_submitted') {
        mainLabel = 'Catatan/Permintaan Revisi Sebelumnya:';
    } else if (viewType === 'admin_ongoing') {
        mainLabel = 'Menunggu Revisi Pekerja (Terakhir):';
    }

    return (
        <div className="space-y-3 font-['Oxanium']">
            {/* Latest Revision */}
            <div className="space-y-1 rounded-xl border border-red-500/20 bg-red-500/10 p-3.5">
                <span className="block font-['Orbitron'] text-[10px] font-bold tracking-wider text-red-600 uppercase dark:text-red-400">
                    ⚠️ {mainLabel}
                </span>
                <p className="dark:text-slate-300 mt-1 text-xs leading-relaxed whitespace-pre-wrap text-slate-600 italic">
                    "{latestRevision.note}"
                </p>
                <div className="text-slate-450 mt-1 flex items-center gap-1 font-sans text-[9px] dark:text-slate-500">
                    <span>Oleh {latestRevision.author_name} • </span>
                    <span>
                        {new Date(latestRevision.created_at).toLocaleString(
                            'id-ID',
                            {
                                dateStyle: 'medium',
                                timeStyle: 'short',
                            },
                        )}
                    </span>
                </div>
            </div>

            {/* Previous Revisions */}
            {quest.revisions.length > 1 && (
                <div className="overflow-hidden rounded-xl border border-slate-200 bg-slate-50/20 dark:border-slate-800/80 dark:bg-black/10">
                    <details className="group">
                        <summary className="flex cursor-pointer items-center justify-between px-3.5 py-2 font-['Orbitron'] text-[10px] font-bold tracking-wider text-slate-500 uppercase select-none hover:text-slate-700 dark:text-slate-400 dark:hover:text-white">
                            <span>
                                Lihat Riwayat Revisi Sebelumnya (
                                {quest.revisions.length - 1})
                            </span>
                            <span className="font-sans text-[8px] tracking-normal transition-transform group-open:rotate-180">
                                ▼
                            </span>
                        </summary>
                        <div className="max-h-[220px] space-y-3 overflow-y-auto border-t border-slate-200/60 px-3.5 pt-3 pb-3 dark:border-slate-800/60">
                            {quest.revisions
                                .slice(0, -1)
                                .reverse()
                                .map((rev, idx) => {
                                    const revNum =
                                        quest.revisions!.length - 1 - idx;
                                    return (
                                        <div
                                            key={idx}
                                            className="space-y-1 rounded-lg border border-slate-200/50 bg-slate-100/30 p-3 dark:border-slate-800/50 dark:bg-black/20"
                                        >
                                            <div className="flex items-center justify-between font-['Orbitron'] text-[9px] font-bold text-slate-500 dark:text-slate-400">
                                                <span>REVISI #{revNum}</span>
                                                <span className="text-slate-500 dark:text-slate-400 font-sans font-normal">
                                                    {new Date(
                                                        rev.created_at,
                                                    ).toLocaleString('id-ID', {
                                                        dateStyle: 'medium',
                                                        timeStyle: 'short',
                                                    })}
                                                </span>
                                            </div>
                                            <p className="dark:text-slate-300 mt-1 text-xs leading-relaxed whitespace-pre-wrap text-slate-600 italic">
                                                "{rev.note}"
                                            </p>
                                            <div className="text-slate-500 dark:text-slate-400 font-sans text-[9px]">
                                                Diminta oleh:{' '}
                                                <span className="dark:text-slate-400 font-semibold text-slate-500">
                                                    {rev.author_name}
                                                </span>
                                            </div>
                                        </div>
                                    );
                                })}
                        </div>
                    </details>
                </div>
            )}
        </div>
    );
}
