import React from 'react';
import {
    Download,
    FileArchive,
    ExternalLink,
    CheckCircle2,
    AlertCircle,
    Clock,
    User,
    RefreshCw,
} from 'lucide-react';
import { Quest, QuestRound } from '@/types/quest';

interface Props {
    quest: Quest;
    isCreator?: boolean;
    isWorker?: boolean;
    formatBytes?: (bytes: number) => string;
}

export default function QuestIterationTimeline({
    quest,
    isCreator = false,
    isWorker = false,
    formatBytes = (bytes: number) => `${(bytes / 1024 / 1024).toFixed(2)} MB`,
}: Props) {
    const rounds: QuestRound[] = quest.rounds && quest.rounds.length > 0
        ? quest.rounds
        : (quest.submission_history || []).map((item, idx) => ({
              round_number: item.version,
              status: idx < (quest.revisions || []).length
                  ? 'changes_requested'
                  : ['approved', 'payment', 'delivered', 'completed'].includes(quest.status)
                    ? 'approved'
                    : 'submitted',
              submission: {
                  submitted_at: item.submitted_at,
                  link: item.submission_link,
                  note: item.submission_note,
                  file: item.submission_file,
                  changelog: item.changelog,
              },
              review: (quest.revisions && quest.revisions[idx])
                  ? {
                        reviewed_at: quest.revisions[idx].created_at,
                        reviewer_id: quest.revisions[idx].author_id,
                        reviewer_name: quest.revisions[idx].author_name,
                        status: 'changes_requested',
                        note: quest.revisions[idx].note,
                    }
                  : ['approved', 'payment', 'delivered', 'completed'].includes(quest.status) && idx === (quest.submission_history || []).length - 1
                    ? {
                          reviewed_at: quest.completed_at || null,
                          reviewer_id: quest.creator_id,
                          reviewer_name: quest.creator?.name || 'Pembuat Quest',
                          status: 'approved',
                          note: null,
                      }
                    : null,
          }));

    const formatDate = (dateStr?: string | null) => {
        if (!dateStr) return '';
        try {
            return new Date(dateStr).toLocaleString('id-ID', {
                dateStyle: 'medium',
                timeStyle: 'short',
            });
        } catch {
            return dateStr;
        }
    };

    if (rounds.length === 0) {
        return null;
    }

    return (
        <div className="relative space-y-4 overflow-hidden rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-gradient-to-b dark:from-[#0e0e1a] dark:to-[#090910]">
            <div className="pointer-events-none absolute top-0 right-8 left-8 z-0 h-px bg-gradient-to-r from-transparent via-slate-300 to-transparent select-none dark:via-slate-700" />
            
            <div className="relative z-10 flex flex-col gap-1 border-b border-slate-100 pb-3 sm:flex-row sm:items-center sm:justify-between dark:border-slate-800">
                <div className="flex items-center gap-2">
                    <RefreshCw className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
                    <h3 className="text-xs font-bold tracking-wider text-slate-800 uppercase dark:text-slate-200">
                        Siklus Pengerjaan & Riwayat Revisi
                    </h3>
                </div>
                <div className="flex items-center gap-2">
                    <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-[10px] font-bold text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                        Total {rounds.length} Iterasi
                    </span>
                    {quest.max_revisions && (
                        <span className="rounded-full bg-indigo-50 px-2.5 py-0.5 text-[10px] font-bold text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300">
                            Maks. {quest.max_revisions}x Revisi
                        </span>
                    )}
                </div>
            </div>

            <div className="space-y-4">
                {rounds.map((round) => {
                    const isChangesRequested = round.status === 'changes_requested';
                    const isApproved = round.status === 'approved';
                    const isSubmitted = round.status === 'submitted';

                    return (
                        <div
                            key={round.round_number}
                            className={`relative overflow-hidden rounded-xl border transition-all ${
                                isChangesRequested
                                    ? 'border-amber-200/80 bg-amber-500/[0.02] dark:border-amber-900/40 dark:bg-amber-950/10'
                                    : isApproved
                                      ? 'border-emerald-200/80 bg-emerald-500/[0.02] dark:border-emerald-900/40 dark:bg-emerald-950/10'
                                      : 'border-slate-200 bg-slate-50/40 dark:border-slate-800 dark:bg-[#040812]/50'
                            }`}
                        >
                            {/* Layer Header */}
                            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 bg-white/70 px-4 py-2.5 dark:border-slate-800/80 dark:bg-[#0b101b]/70">
                                <div className="flex items-center gap-2">
                                    <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-indigo-100 text-[10px] font-bold text-indigo-700 dark:bg-indigo-900/60 dark:text-indigo-300">
                                        #{round.round_number}
                                    </span>
                                    <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                                        Iterasi ke-{round.round_number} (v{round.round_number})
                                    </span>
                                </div>
                                <div>
                                    {isChangesRequested && (
                                        <span className="inline-flex items-center gap-1 rounded-full border border-amber-300/80 bg-amber-100/70 px-2.5 py-0.5 text-[9px] font-bold tracking-wider text-amber-800 uppercase dark:border-amber-800 dark:bg-amber-950/80 dark:text-amber-300">
                                            <AlertCircle className="h-3 w-3" />
                                            Perlu Revisi
                                        </span>
                                    )}
                                    {isApproved && (
                                        <span className="inline-flex items-center gap-1 rounded-full border border-emerald-300/80 bg-emerald-100/70 px-2.5 py-0.5 text-[9px] font-bold tracking-wider text-emerald-800 uppercase dark:border-emerald-800 dark:bg-emerald-950/80 dark:text-emerald-300">
                                            <CheckCircle2 className="h-3 w-3" />
                                            Disetujui
                                        </span>
                                    )}
                                    {isSubmitted && (
                                        <span className="inline-flex items-center gap-1 rounded-full border border-yellow-300/80 bg-yellow-100/70 px-2.5 py-0.5 text-[9px] font-bold tracking-wider text-yellow-800 uppercase dark:border-yellow-800 dark:bg-yellow-950/80 dark:text-yellow-300">
                                            <Clock className="h-3 w-3" />
                                            Menunggu Peninjauan
                                        </span>
                                    )}
                                </div>
                            </div>

                            {/* Layer Body: Submisi Pekerja */}
                            <div className="space-y-3 p-4">
                                <div className="space-y-2">
                                    <div className="flex items-center justify-between text-[10px] text-slate-400">
                                        <span className="font-semibold text-slate-600 uppercase dark:text-slate-300">
                                            📤 Hasil yang Diserahkan Pekerja
                                        </span>
                                        <span>{formatDate(round.submission.submitted_at)}</span>
                                    </div>

                                    {/* Link Hasil */}
                                    {round.submission.link && (
                                        <div className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white p-2.5 text-xs dark:border-slate-800 dark:bg-[#030712]">
                                            <ExternalLink className="h-4 w-4 shrink-0 text-indigo-600 dark:text-indigo-400" />
                                            <div className="min-w-0 flex-1">
                                                <span className="block text-[9px] text-slate-400 uppercase">Tautan Demo / Repositori:</span>
                                                <a
                                                    href={round.submission.link}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="block truncate font-semibold text-indigo-600 hover:underline dark:text-indigo-400"
                                                >
                                                    {round.submission.link}
                                                </a>
                                            </div>
                                        </div>
                                    )}

                                    {/* Berkas Lampiran */}
                                    {round.submission.file && (
                                        <div className="flex items-center justify-between rounded-lg border border-slate-200 bg-white p-2.5 text-xs dark:border-slate-800 dark:bg-[#030712]">
                                            <div className="flex min-w-0 items-center gap-2.5">
                                                <FileArchive className="h-5 w-5 shrink-0 text-amber-500" />
                                                <div className="min-w-0">
                                                    <p className="truncate font-semibold text-slate-800 dark:text-slate-200">
                                                        {round.submission.file.name}
                                                    </p>
                                                    <p className="text-[10px] text-slate-400">
                                                        {formatBytes(round.submission.file.size)}
                                                    </p>
                                                </div>
                                            </div>
                                            {round.submission.file.url && (
                                                <a
                                                    href={round.submission.file.url}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="flex cursor-pointer items-center gap-1 rounded-lg bg-indigo-50 px-2.5 py-1 text-xs font-semibold text-indigo-600 hover:bg-indigo-100 dark:bg-slate-800 dark:text-indigo-400 dark:hover:bg-slate-700"
                                                    title="Unduh Berkas"
                                                >
                                                    <Download className="h-3.5 w-3.5" />
                                                    <span>Unduh</span>
                                                </a>
                                            )}
                                        </div>
                                    )}

                                    {/* Catatan Pekerja */}
                                    {round.submission.note && (
                                        <div className="rounded-lg border border-slate-200/70 bg-white/80 p-2.5 text-xs text-slate-700 dark:border-slate-800/80 dark:bg-[#030712]/60 dark:text-slate-300">
                                            <span className="block text-[9px] font-bold text-slate-400 uppercase">Catatan Pengantar:</span>
                                            <p className="mt-0.5 leading-relaxed whitespace-pre-wrap">{round.submission.note}</p>
                                        </div>
                                    )}

                                    {/* Changelog Khusus Revisi */}
                                    {round.submission.changelog && (
                                        <div className="rounded-lg border border-indigo-200/80 bg-indigo-50/50 p-2.5 text-xs text-indigo-900 dark:border-indigo-900/50 dark:bg-indigo-950/30 dark:text-indigo-300">
                                            <span className="block text-[9px] font-bold tracking-wider text-indigo-600 uppercase dark:text-indigo-400">
                                                ✨ Catatan Perbaikan (Changelog):
                                            </span>
                                            <p className="mt-0.5 leading-relaxed whitespace-pre-wrap">{round.submission.changelog}</p>
                                        </div>
                                    )}
                                </div>

                                {/* Bagian Bawah: Respon Klien terhadap Submisi Ini */}
                                {round.review && (
                                    <div className="space-y-2 border-t border-slate-200/60 pt-3 dark:border-slate-800/60">
                                        <div className="flex items-center justify-between text-[10px] text-slate-400">
                                            <span className="flex items-center gap-1 font-semibold text-slate-600 uppercase dark:text-slate-300">
                                                <User className="h-3 w-3" />
                                                Tinjauan Klien ({round.review.reviewer_name})
                                            </span>
                                            <span>{formatDate(round.review.reviewed_at)}</span>
                                        </div>

                                        {round.review.status === 'changes_requested' && (
                                            <div className="space-y-1 rounded-lg border border-amber-300/70 bg-amber-50/50 p-3 text-xs text-amber-900 dark:border-amber-900/50 dark:bg-amber-950/30 dark:text-amber-300">
                                                <span className="block text-[9px] font-bold tracking-wider text-amber-700 uppercase dark:text-amber-400">
                                                    Instruksi Perbaikan / Revisi:
                                                </span>
                                                <p className="leading-relaxed whitespace-pre-wrap italic">
                                                    "{round.review.note}"
                                                </p>
                                            </div>
                                        )}

                                        {round.review.status === 'approved' && (
                                            <div className="flex items-center gap-2 rounded-lg border border-emerald-300/70 bg-emerald-50/40 p-2.5 text-xs text-emerald-800 dark:border-emerald-900/40 dark:bg-emerald-950/20 dark:text-emerald-300">
                                                <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600 dark:text-emerald-400" />
                                                <span>Hasil pekerjaan disetujui. Melanjutkan ke proses pelunasan dan berkas final.</span>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
