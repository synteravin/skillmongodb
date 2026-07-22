import React from 'react';
import { Quest } from '@/types/quest';

interface QuestRevisionNotesProps {
    quest: Quest;
    viewType:
        | 'creator_ongoing'
        | 'creator_submitted'
        | 'worker_ongoing'
        | 'worker_submitted'
        | 'admin_submitted'
        | 'admin_ongoing';
}

export default function QuestRevisionNotes({ quest, viewType }: QuestRevisionNotesProps) {
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
            <div className="space-y-1.5 rounded-lg border border-red-200 bg-red-50/15 p-3.5">
                <span className="block text-[10px] font-bold tracking-wider text-red-700 uppercase">
                    Pemberitahuan: {label}
                </span>
                <p className="text-slate-655 dark:text-slate-300 mt-1 text-xs leading-relaxed whitespace-pre-wrap italic">
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
        <div className="space-y-3">
            {/* Latest Revision */}
            <div className="space-y-1.5 rounded-lg border border-red-200 bg-red-50/15 p-3.5">
                <span className="block text-[10px] font-bold tracking-wider text-red-700 uppercase">
                    Pemberitahuan: {mainLabel}
                </span>
                <p className="dark:text-slate-300 mt-1 text-xs leading-relaxed whitespace-pre-wrap text-slate-600 italic">
                    "{latestRevision.note}"
                </p>
                <div className="text-slate-400 mt-1 flex items-center gap-1 text-[9px]">
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
                <div className="relative overflow-hidden rounded-lg border border-slate-200 bg-slate-50/30 dark:border-slate-800 dark:bg-gradient-to-b dark:from-[#0e0e1a] dark:to-[#090910]">
                    <div className="absolute top-0 right-8 left-8 h-px bg-gradient-to-r from-transparent via-slate-300 to-transparent dark:via-slate-700 pointer-events-none select-none z-0" />
                    <details className="relative z-10 group">
                        <summary className="flex cursor-pointer items-center justify-between px-3.5 py-2 text-[10px] font-bold tracking-wider text-slate-500 uppercase select-none hover:text-slate-700 dark:text-slate-400 dark:hover:text-white">
                            <span>
                                Lihat Riwayat Revisi Sebelumnya (
                                {quest.revisions.length - 1})
                            </span>
                            <span className="text-[8px] transition-transform group-open:rotate-180">
                                ▼
                            </span>
                        </summary>
                        <div className="max-h-[220px] space-y-3 overflow-y-auto border-t border-slate-200 px-3.5 pt-3 pb-3 dark:border-slate-800">
                            {quest.revisions
                                .slice(0, -1)
                                .reverse()
                                .map((rev, idx) => {
                                    const revNum =
                                        quest.revisions!.length - 1 - idx;
                                    return (
                                        <div
                                            key={idx}
                                            className="relative overflow-hidden space-y-1 rounded-lg border border-slate-200 bg-white p-3 dark:border-slate-800 dark:bg-gradient-to-b dark:from-[#0e0e1a] dark:to-[#090910]"
                                        >
                                            <div className="flex items-center justify-between text-[9px] font-bold text-slate-500">
                                                <span>REVISI #{revNum}</span>
                                                <span className="text-slate-400 font-normal">
                                                    {new Date(
                                                        rev.created_at,
                                                    ).toLocaleString('id-ID', {
                                                        dateStyle: 'medium',
                                                        timeStyle: 'short',
                                                    })}
                                                </span>
                                            </div>
                                            <p className="dark:text-slate-350 mt-1 text-xs leading-relaxed whitespace-pre-wrap text-slate-655 italic">
                                                "{rev.note}"
                                            </p>
                                            <div className="text-slate-400 text-[9px]">
                                                Diminta oleh:{' '}
                                                <span className="font-semibold text-slate-505 dark:text-slate-300">
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
