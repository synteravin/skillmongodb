import React from 'react';
import { Quest } from '@/types/quest';

interface AdminModerationCardProps {
    quest: Quest;
    setShowApprovePostConfirm: (show: boolean) => void;
    setShowRejectPostForm: (show: boolean) => void;
}

export default function AdminModerationCard({
    quest,
    setShowApprovePostConfirm,
    setShowRejectPostForm,
}: AdminModerationCardProps) {
    if (quest.status === 'draft') {
        return (
            <div className="space-y-4 rounded-xl border border-amber-500/30 bg-amber-500/10 p-5 shadow-sm dark:border-amber-500/30 dark:bg-amber-500/10">
                <div className="border-b border-amber-500/20 pb-3">
                    <span className="inline-block text-[10px] font-bold tracking-widest text-amber-700 uppercase dark:text-amber-400">
                        ⚠️ Moderasi Posting Quest
                    </span>
                    <h3 className="mt-1 text-sm font-extrabold text-slate-900 dark:text-amber-300">
                        Persetujuan Quest Baru
                    </h3>
                </div>
                <p className="text-xs font-semibold leading-relaxed text-slate-700 dark:text-slate-300">
                    Quest ini dikirim oleh{' '}
                    <strong className="font-bold text-slate-900 dark:text-white">{quest.creator.name}</strong>{' '}
                    dan membutuhkan persetujuan Anda sebagai
                    administrator sebelum dipublikasikan ke
                    papan quest publik.
                </p>

                <div className="flex gap-3 pt-2">
                    <button
                        onClick={() => setShowApprovePostConfirm(true)}
                        className="flex-1 cursor-pointer rounded-lg bg-emerald-600 py-2.5 text-center text-xs font-bold text-white uppercase shadow-sm transition-all hover:bg-emerald-700"
                    >
                        Setujui & Publikasikan
                    </button>
                    <button
                        onClick={() => setShowRejectPostForm(true)}
                        className="flex-1 cursor-pointer rounded-lg bg-red-600 py-2.5 text-center text-xs font-bold text-white uppercase shadow-sm transition-all hover:bg-red-700"
                    >
                        Tolak Quest
                    </button>
                </div>
            </div>
        );
    }

    if (quest.status === 'rejected') {
        return (
            <div className="space-y-3 rounded-xl border border-red-500/30 bg-red-500/10 p-5 shadow-sm dark:border-red-500/30 dark:bg-red-500/10">
                <span className="inline-block text-[10px] font-bold tracking-widest text-red-700 uppercase dark:text-red-400">
                    ❌ Quest Ditolak
                </span>
                <h3 className="text-sm font-extrabold text-red-700 dark:text-red-300">
                    Status: Ditolak Admin
                </h3>
                {quest.rejection_note && (
                    <div className="space-y-1 rounded-lg border border-red-500/20 bg-red-500/10 p-3">
                        <span className="block text-[9px] font-bold tracking-wider text-red-600 uppercase dark:text-red-400">
                            Catatan Penolakan Anda:
                        </span>
                        <p className="text-xs font-semibold leading-relaxed whitespace-pre-wrap text-slate-800 dark:text-slate-200">
                            {quest.rejection_note}
                        </p>
                    </div>
                )}
            </div>
        );
    }

    if (quest.status === 'expired') {
        return (
            <div className="space-y-3 rounded-xl border border-rose-500/30 bg-rose-500/10 p-5 shadow-sm dark:border-rose-500/30 dark:bg-rose-500/10">
                <span className="inline-block text-[10px] font-bold tracking-widest text-rose-700 uppercase dark:text-rose-400">
                    🚨 Quest Kadaluarsa (Expired)
                </span>
                <h3 className="text-sm font-extrabold text-rose-700 dark:text-rose-300">
                    Tenggat Waktu Terlewati
                </h3>
                <p className="text-xs font-semibold leading-relaxed text-slate-800 dark:text-slate-200">
                    Tenggat waktu pengerjaan proyek ini
                    telah berakhir sebelum pekerja berhasil
                    menyelesaikan tugasnya. Pekerja lama
                    dibebaskan dan penalti reputasi ERP
                    telah diberlakukan secara otomatis oleh
                    sistem.
                </p>
            </div>
        );
    }

    return null;
}
