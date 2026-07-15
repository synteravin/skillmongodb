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
            <div className="space-y-4 rounded-2xl border border-slate-200 bg-white/70 p-6 font-['Oxanium'] shadow-md backdrop-blur-md transition-all duration-300 dark:border-slate-800/80 dark:bg-[#0c122c]/40">
                <h3 className="flex items-center gap-2 border-b border-slate-100 pb-3 font-['Orbitron'] text-xs font-bold tracking-wider text-slate-700 uppercase dark:border-slate-800 dark:text-blue-200">
                    <ShieldAlert
                        size={15}
                        className="animate-pulse text-amber-500"
                    />
                    Pusat Bantuan & Penyelesaian Sengketa
                </h3>
                <p className="text-xs font-medium leading-relaxed text-slate-500 dark:text-blue-300/60">
                    Apakah ada kendala besar, ketidaksesuaian deliverables, atau
                    wanprestasi dari pihak lawan? Anda dapat mengajukan banding agar
                    Admin masuk sebagai mediator (arbitrase).
                </p>
                <button
                    type="button"
                    onClick={() => setShowDisputeModal(true)}
                    className="w-full cursor-pointer rounded-xl border border-amber-500/20 bg-amber-500/10 py-2.5 text-center font-['Orbitron'] text-xs font-bold tracking-wider text-amber-600 uppercase transition-all hover:bg-amber-500/20 dark:text-amber-300"
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
                    <div className="relative z-10 w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 font-['Oxanium'] shadow-2xl dark:border-slate-800 dark:bg-slate-900">
                        <h3 className="mb-2 flex items-center gap-2 font-['Orbitron'] text-base font-bold tracking-wider text-slate-800 uppercase sm:text-lg dark:text-amber-400">
                            <ShieldAlert className="text-amber-500" />
                            Ajukan Dispute / Banding
                        </h3>
                        <p className="mb-4 text-xs text-slate-500 dark:text-slate-400">
                            Jelaskan kendala atau dasar perselisihan yang Anda alami.
                            Laporan ini akan dipelajari oleh Admin untuk dilakukan
                            arbitrase.
                        </p>

                        <form onSubmit={handleDisputeSubmit} className="space-y-4">
                            <div className="space-y-1.5">
                                <label className="text-[10px] font-bold text-slate-500 uppercase dark:text-slate-400">
                                    Alasan & Kronologi Banding{' '}
                                    <span className="text-red-500">*</span>
                                </label>
                                <textarea
                                    required
                                    placeholder="Tuliskan detail kronologi dan alasan mengapa Anda mengajukan dispute..."
                                    rows={4}
                                    value={disputeForm.data.reason}
                                    onChange={(e) =>
                                        disputeForm.setData('reason', e.target.value)
                                    }
                                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-800 focus:border-amber-500 focus:outline-none dark:border-slate-800 dark:bg-black/20 dark:text-white"
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
                                    className="cursor-pointer rounded-xl bg-slate-100 px-4 py-2 text-xs font-semibold text-slate-700 uppercase transition-all hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
                                >
                                    Batal
                                </button>
                                <button
                                    type="submit"
                                    disabled={disputeForm.processing}
                                    className="cursor-pointer rounded-xl bg-amber-600 px-4 py-2 font-['Orbitron'] text-xs font-semibold text-white uppercase transition-all hover:bg-amber-700 disabled:opacity-50"
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
