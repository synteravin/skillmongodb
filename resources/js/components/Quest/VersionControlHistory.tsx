import React from 'react';
import { Download } from 'lucide-react';
import { Quest } from '@/types/quest';

interface Props {
    quest: Quest;
}

export default function VersionControlHistory({ quest }: Props) {
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

    if (!quest.submission_history || quest.submission_history.length === 0) {
        return null;
    }

    return (
        <div className="relative overflow-hidden space-y-4 rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-gradient-to-b dark:from-[#0e0e1a] dark:to-[#090910]">
            <div className="absolute top-0 right-8 left-8 h-px bg-gradient-to-r from-transparent via-slate-300 to-transparent dark:via-slate-700 pointer-events-none select-none z-0" />
            <h3 className="relative z-10 border-b border-slate-105 pb-3 text-xs font-bold text-slate-800 uppercase dark:border-slate-800 dark:text-slate-200">
                Riwayat Penyerahan Berkas (Version Control)
            </h3>
            <div className="max-h-[300px] space-y-3 overflow-y-auto pr-1">
                {quest.submission_history.map((historyItem) => (
                    <div
                        key={historyItem.version}
                        className="flex items-center justify-between gap-4 rounded-xl border border-slate-200 bg-slate-50/50 p-3 dark:border-slate-800 dark:bg-[#040812]"
                    >
                        <div className="min-w-0 space-y-1">
                            <div className="flex items-center gap-2">
                                <span className="rounded bg-indigo-50 px-1.5 py-0.5 text-[10px] font-semibold text-indigo-700 dark:bg-[#040812] dark:text-indigo-400">
                                    v{historyItem.version}
                                </span>
                                <span className="text-[10px] text-slate-400">
                                    {historyItem.submitted_at
                                        ? formatDate(historyItem.submitted_at)
                                        : ''}
                                </span>
                            </div>
                            {historyItem.submission_note && (
                                <p className="truncate text-xs text-slate-650 dark:text-slate-350">
                                    {historyItem.submission_note}
                                </p>
                            )}
                            {historyItem.submission_link && (
                                <a
                                    href={historyItem.submission_link}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="block truncate text-[11px] text-indigo-600 hover:underline dark:text-indigo-400"
                                >
                                    {historyItem.submission_link}
                                </a>
                            )}
                        </div>
                        {historyItem.submission_file && (
                            <a
                                href={historyItem.submission_file.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex shrink-0 cursor-pointer items-center justify-center rounded-lg p-2 text-indigo-600 transition-colors hover:bg-indigo-50 dark:text-indigo-400 dark:hover:bg-slate-800"
                                title={`Unduh versi ${historyItem.version}`}
                            >
                                <Download className="h-4 w-4" />
                            </a>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}
