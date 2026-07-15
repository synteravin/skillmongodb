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
            <div className="dark:bg-amber-955/10 space-y-4 rounded-2xl border border-amber-500/20 bg-amber-500/5 p-6 font-['Oxanium'] shadow-md">
                <div className="border-b border-amber-500/10 pb-3">
                    <span className="inline-block font-['Orbitron'] text-[10px] font-bold tracking-widest text-amber-600 uppercase dark:text-amber-400">
                        ⚠️ Moderasi Posting Quest
                    </span>
                    <h3 className="mt-1 text-sm font-bold text-slate-800 dark:text-amber-300">
                        Persetujuan Quest Baru
                    </h3>
                </div>
                <p className="text-xs leading-relaxed text-slate-500 dark:text-slate-300">
                    Quest ini dikirim oleh{' '}
                    <strong>{quest.creator.name}</strong>{' '}
                    dan membutuhkan persetujuan Anda sebagai
                    administrator sebelum dipublikasikan ke
                    papan quest publik.
                </p>

                <div className="flex gap-3 pt-2">
                    <button
                        onClick={() => setShowApprovePostConfirm(true)}
                        className="flex-1 cursor-pointer rounded-xl bg-emerald-600 py-2.5 text-center font-['Orbitron'] text-xs font-bold tracking-wider text-white uppercase shadow-sm transition-all hover:bg-emerald-700"
                    >
                        Setujui & Publikasikan
                    </button>
                    <button
                        onClick={() => setShowRejectPostForm(true)}
                        className="flex-1 cursor-pointer rounded-xl bg-red-600 py-2.5 text-center font-['Orbitron'] text-xs font-bold tracking-wider text-white uppercase shadow-sm transition-all hover:bg-red-700"
                    >
                        Tolak Quest
                    </button>
                </div>
            </div>
        );
    }

    if (quest.status === 'rejected') {
        return (
            <div className="dark:bg-red-955/10 space-y-3 rounded-2xl border border-red-500/20 bg-red-500/5 p-6 font-['Oxanium'] shadow-md">
                <span className="inline-block font-['Orbitron'] text-[10px] font-bold tracking-widest text-red-600 uppercase dark:text-red-400">
                    ❌ Quest Ditolak
                </span>
                <h3 className="text-sm font-bold text-red-600 dark:text-red-400">
                    Status: Ditolak Admin
                </h3>
                {quest.rejection_note && (
                    <div className="space-y-1 rounded-xl border border-red-500/20 bg-red-500/10 p-3">
                        <span className="block text-[9px] font-bold tracking-wider text-red-500 uppercase">
                            Catatan Penolakan Anda:
                        </span>
                        <p className="text-xs leading-relaxed whitespace-pre-wrap text-slate-600 dark:text-slate-300">
                            {quest.rejection_note}
                        </p>
                    </div>
                )}
            </div>
        );
    }

    if (quest.status === 'expired') {
        return (
            <div className="dark:bg-red-955/10 space-y-3 rounded-2xl border border-red-500/20 bg-red-500/5 p-6 font-['Oxanium'] shadow-md">
                <span className="inline-block font-['Orbitron'] text-[10px] font-bold tracking-widest text-red-600 uppercase dark:text-red-400">
                    🚨 Quest Kadaluarsa (Expired)
                </span>
                <h3 className="text-sm font-bold text-red-600 dark:text-red-400">
                    Tenggat Waktu Terlewati
                </h3>
                <p className="text-xs leading-relaxed text-slate-600 dark:text-slate-300">
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
