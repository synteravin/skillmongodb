import React, { useState } from 'react';
import { useForm } from '@inertiajs/react';
import { ShieldAlert } from 'lucide-react';
import { Quest } from '@/types/quest';

interface Props {
    quest: Quest;
    isCreator: boolean;
    isWorker: boolean;
}

export default function DisputePanel({ quest, isCreator, isWorker }: Props) {
    const [showDisputeModal, setShowDisputeModal] = useState(false);

    const disputeForm = useForm({
        reason: '',
    });

    const handleDisputeSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        disputeForm.post(`/student/quests/${quest._id}/dispute`, {
            onSuccess: () => {
                setShowDisputeModal(false);
                disputeForm.reset();
            },
        });
    };

    if (!(isCreator || isWorker)) return null;
    if (!['ongoing', 'submitted', 'approved'].includes(quest.status)) return null;

    return (
        <>
            <div className="relative overflow-hidden space-y-4 rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-gradient-to-b dark:from-[#0e0e1a] dark:to-[#090910]">
                <div className="absolute top-0 right-8 left-8 h-px bg-gradient-to-r from-transparent via-slate-300 to-transparent dark:via-slate-700 pointer-events-none select-none z-0" />
                <h3 className="relative z-10 flex items-center gap-2 border-b border-slate-100 pb-3 text-sm font-bold text-slate-850 dark:border-slate-800 dark:text-slate-200">
                    <ShieldAlert
                        size={15}
                        className="text-amber-500"
                    />
                    Pusat Bantuan & Penyelesaian Sengketa
                </h3>
                <p className="text-xs leading-relaxed text-slate-500 dark:text-slate-400">
                    Apakah terjadi kendala dalam pengerjaan proyek, ketidaksesuaian hasil kerja (deliverables), atau pelanggaran kesepakatan? Anda dapat mengajukan banding agar administrator bertindak sebagai mediator arbitrase.
                </p>
                <button
                    type="button"
                    onClick={() => setShowDisputeModal(true)}
                    className="w-full cursor-pointer rounded-lg border border-amber-200 bg-amber-50/50 py-2.5 text-center text-xs font-bold text-amber-700 transition-colors hover:bg-amber-100/50 dark:border-amber-900/40 dark:bg-amber-950/20 dark:text-amber-400"
                >
                    Ajukan Banding (Dispute)
                </button>
            </div>

            {/* Dispute Modal */}
            {showDisputeModal && (
                <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
                    <div
                        onClick={() => setShowDisputeModal(false)}
                        className="absolute inset-0 cursor-pointer bg-black/60 backdrop-blur-sm"
                    />
                    <div className="relative overflow-hidden z-10 w-full max-w-md rounded-xl border border-slate-200 bg-white p-6 shadow-xl dark:border-slate-800 dark:bg-gradient-to-b dark:from-[#0e0e1a] dark:to-[#090910]">
                        <div className="absolute top-0 right-8 left-8 h-px bg-gradient-to-r from-transparent via-slate-300 to-transparent dark:via-slate-700 pointer-events-none select-none z-0" />
                        <h3 className="relative z-10 mb-2 flex items-center gap-2 text-base font-bold text-slate-800 dark:text-amber-400">
                            <ShieldAlert className="text-amber-500" />
                            Ajukan Dispute / Banding
                        </h3>
                        <p className="mb-4 text-xs text-slate-500 dark:text-slate-400">
                            Jelaskan detail kendala atau dasar perselisihan yang Anda alami. Laporan ini akan ditinjau oleh mediator admin untuk diproses lebih lanjut.
                        </p>

                        <form onSubmit={handleDisputeSubmit} className="space-y-4">
                            <div className="space-y-1.5">
                                <label className="text-[10px] font-bold text-slate-450 uppercase">
                                    Alasan & Kronologi Banding <span className="text-red-500">*</span>
                                </label>
                                <textarea
                                    required
                                    placeholder="Tuliskan secara rinci kronologi kejadian dan alasan pengajuan banding..."
                                    rows={4}
                                    value={disputeForm.data.reason}
                                    onChange={(e) =>
                                        disputeForm.setData('reason', e.target.value)
                                    }
                                    className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-800 focus:border-amber-600 focus:outline-none dark:border-slate-800 dark:bg-[#030712] dark:text-white"
                                />
                                {disputeForm.errors.reason && (
                                    <p className="text-xs font-semibold text-red-500">
                                        {disputeForm.errors.reason}
                                    </p>
                                )}
                            </div>

                            <div className="flex justify-end gap-2 pt-2">
                                <button
                                    type="button"
                                    onClick={() => setShowDisputeModal(false)}
                                    className="cursor-pointer rounded-lg bg-slate-100 px-4 py-2 text-xs font-semibold text-slate-700 transition-colors hover:bg-slate-200 dark:bg-[#0d1117] dark:text-slate-300 dark:hover:bg-slate-800"
                                >
                                    Batal
                                </button>
                                <button
                                    type="submit"
                                    disabled={disputeForm.processing}
                                    className="cursor-pointer rounded-lg bg-amber-600 px-4 py-2 text-xs font-bold text-white transition-colors hover:bg-amber-700 disabled:opacity-50"
                                >
                                    {disputeForm.processing ? 'Mengirim...' : 'Kirim Laporan'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </>
    );
}
