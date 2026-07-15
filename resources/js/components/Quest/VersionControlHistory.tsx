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
        return `${datePart} pukul ${timePart}`;
    };

    if (!quest.submission_history || quest.submission_history.length === 0) {
        return null;
    }

    return (
        <div className="space-y-4 rounded-2xl border border-slate-200 bg-white/70 p-6 font-['Oxanium'] shadow-md backdrop-blur-md transition-all duration-300 dark:border-slate-800/80 dark:bg-[#0c122c]/40">
            <h3 className="border-b border-slate-100 pb-3 font-['Orbitron'] text-xs font-bold tracking-wider text-slate-700 uppercase dark:border-slate-800 dark:text-blue-200">
                Riwayat Penyerahan Berkas (Version Control)
            </h3>
            <div className="max-h-[300px] space-y-3 overflow-y-auto pr-1">
                {quest.submission_history.map((historyItem) => (
                    <div
                        key={historyItem.version}
                        className="flex items-center justify-between gap-4 rounded-xl border border-slate-200 bg-slate-50/50 p-3 dark:border-slate-800 dark:bg-black/10"
                    >
                        <div className="min-w-0 space-y-1">
                            <div className="flex items-center gap-2">
                                <span className="rounded bg-indigo-500/10 px-1.5 py-0.5 font-['Orbitron'] text-[10px] font-bold text-indigo-600 uppercase dark:text-indigo-400">
                                    v{historyItem.version}
                                </span>
                                <span className="text-[10px] text-slate-400">
                                    {historyItem.submitted_at
                                        ? formatDate(historyItem.submitted_at)
                                        : ''}
                                </span>
                            </div>
                            {historyItem.submission_note && (
                                <p className="truncate text-xs text-slate-600 dark:text-slate-300">
                                    {historyItem.submission_note}
                                </p>
                            )}
                            {historyItem.submission_link && (
                                <a
                                    href={historyItem.submission_link}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="block truncate text-[11px] text-indigo-500 hover:underline"
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
                                className="flex shrink-0 cursor-pointer items-center justify-center rounded-lg p-2 text-indigo-500 transition-colors hover:bg-indigo-500/10 hover:text-indigo-700"
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
