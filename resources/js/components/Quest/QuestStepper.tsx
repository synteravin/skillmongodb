import React from 'react';

interface QuestStepperProps {
    status: string;
}

export default function QuestStepper({ status }: QuestStepperProps) {
    if (status === 'draft' || status === 'rejected') {
        return null;
    }

    return (
        <div className="border-b border-slate-200/60 pb-4 font-['Orbitron'] text-[9px] font-bold tracking-wider sm:text-[10px] dark:border-slate-800/60">
            <div className="relative flex items-center justify-between">
                <div className="absolute top-1/2 right-0 left-0 z-0 h-0.5 -translate-y-1/2 bg-slate-200 dark:bg-slate-800/80" />
                <div
                    className="absolute top-1/2 left-0 z-0 h-0.5 -translate-y-1/2 bg-indigo-500 transition-all duration-300"
                    style={{
                        width:
                            status === 'open'
                                ? '0%'
                                : status === 'ongoing'
                                ? '25%'
                                : status === 'submitted'
                                ? '50%'
                                : status === 'approved'
                                ? '75%'
                                : '100%',
                    }}
                />

                {[
                    { key: 'open', label: 'Bidding' },
                    { key: 'ongoing', label: 'Pengerjaan' },
                    { key: 'submitted', label: 'Tinjauan' },
                    { key: 'approved', label: 'Disetujui' },
                    { key: 'completed', label: 'Selesai' },
                ].map((step, idx) => {
                    const statuses = [
                        'open',
                        'ongoing',
                        'submitted',
                        'approved',
                        'completed',
                    ];
                    const currentIdx = statuses.indexOf(status);
                    const stepIdx = statuses.indexOf(step.key);
                    const isCompleted = stepIdx < currentIdx || status === 'completed';
                    const isActive = status === step.key;

                    return (
                        <div
                            key={step.key}
                            className="relative z-10 flex flex-col items-center"
                        >
                            <div
                                className={`flex h-6 w-6 items-center justify-center rounded-full border-2 transition-all duration-350 sm:h-7 sm:w-7 ${
                                    isCompleted
                                        ? 'border-indigo-500 bg-indigo-600 text-white shadow-[0_0_10px_rgba(99,102,241,0.4)]'
                                        : isActive
                                        ? 'border-purple-500 bg-purple-600 text-white shadow-[0_0_10px_rgba(168,85,247,0.4)]'
                                        : 'border-slate-200 bg-white text-slate-400 dark:border-slate-800 dark:bg-[#0c122c]'
                                }`}
                            >
                                {isCompleted ? '✓' : idx + 1}
                            </div>
                            <span
                                className={`mt-1.5 text-[8px] tracking-widest uppercase sm:text-[9px] ${
                                    isActive || isCompleted
                                        ? 'font-black text-indigo-600 dark:text-purple-300'
                                        : 'text-slate-400'
                                }`}
                            >
                                {step.label}
                            </span>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
