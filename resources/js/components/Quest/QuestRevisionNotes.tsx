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

export default function QuestRevisionNotes({
    quest,
    viewType,
}: QuestRevisionNotesProps) {
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
                <p className="text-slate-655 mt-1 text-xs leading-relaxed whitespace-pre-wrap italic dark:text-slate-300">
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
                <p className="mt-1 text-xs leading-relaxed whitespace-pre-wrap text-slate-600 italic dark:text-slate-300">
                    "{latestRevision.note}"
                </p>
                <div className="mt-1 flex items-center gap-1 text-[9px] text-slate-400">
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
                    <div className="pointer-events-none absolute top-0 right-8 left-8 z-0 h-px bg-gradient-to-r from-transparent via-slate-300 to-transparent select-none dark:via-slate-700" />
                    <details className="group relative z-10">
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
                                            className="relative space-y-1 overflow-hidden rounded-lg border border-slate-200 bg-white p-3 dark:border-slate-800 dark:bg-gradient-to-b dark:from-[#0e0e1a] dark:to-[#090910]"
                                        >
                                            <div className="flex items-center justify-between text-[9px] font-bold text-slate-500">
                                                <span>REVISI #{revNum}</span>
                                                <span className="font-normal text-slate-400">
                                                    {new Date(
                                                        rev.created_at,
                                                    ).toLocaleString('id-ID', {
                                                        dateStyle: 'medium',
                                                        timeStyle: 'short',
                                                    })}
                                                </span>
                                            </div>
                                            <p className="dark:text-slate-350 text-slate-655 mt-1 text-xs leading-relaxed whitespace-pre-wrap italic">
                                                "{rev.note}"
                                            </p>
                                            <div className="text-[9px] text-slate-400">
                                                Diminta oleh:{' '}
                                                <span className="text-slate-505 font-semibold dark:text-slate-300">
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
