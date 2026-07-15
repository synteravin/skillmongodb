import React from 'react';
import { Check } from 'lucide-react';

interface QuestStepperProps {
    status: string;
}

export default function QuestStepper({ status }: QuestStepperProps) {
    if (status === 'draft' || status === 'rejected') {
        return null;
    }

    const steps = [
        { key: 'open', label: 'Bidding' },
        { key: 'ongoing', label: 'Pengerjaan' },
        { key: 'submitted', label: 'Tinjauan' },
        { key: 'approved', label: 'Disetujui' },
        { key: 'payment', label: 'Pembayaran' },
        { key: 'completed', label: 'Selesai' },
    ];

    const statuses = steps.map((s) => s.key);
    const currentIdx = statuses.includes(status) ? statuses.indexOf(status) : 0;

    return (
        <div className="w-full rounded-2xl border border-slate-200/40 bg-white/50 p-4 py-6 font-['Orbitron'] shadow-inner backdrop-blur-sm dark:border-slate-800/40 dark:bg-black/10">
            <div className="relative grid grid-cols-6 gap-0">
                {/* Stepper Line Container (bounded perfectly between first and last node centers in a 6-col grid layout) */}
                <div className="absolute top-[14px] right-[8.33%] left-[8.33%] z-0 h-[3px] -translate-y-1/2 sm:top-[16px]">
                    {/* Background Line */}
                    <div className="absolute inset-0 rounded-full bg-slate-200 dark:bg-slate-800/80" />

                    {/* Active Progress Line */}
                    <div
                        className="absolute top-0 bottom-0 left-0 rounded-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 transition-all duration-700 ease-out"
                        style={{
                            width: `${(currentIdx / (steps.length - 1)) * 100}%`,
                        }}
                    />
                </div>

                {steps.map((step, idx) => {
                    const stepIdx = idx;
                    const isCompleted =
                        stepIdx < currentIdx || status === 'completed';
                    const isActive = status === step.key;

                    return (
                        <div
                            key={step.key}
                            className="relative z-10 flex w-full min-w-0 flex-col items-center"
                        >
                            {/* Step Node */}
                            <div
                                className={`flex h-7 w-7 cursor-default items-center justify-center rounded-full border-2 transition-all duration-500 sm:h-8 sm:w-8 ${
                                    isCompleted
                                        ? 'dark:bg-indigo-650 scale-105 border-indigo-500 bg-indigo-600 text-white shadow-[0_0_15px_rgba(99,102,241,0.6)]'
                                        : isActive
                                          ? 'dark:bg-purple-650 scale-110 border-purple-500 bg-purple-600 text-white shadow-[0_0_15px_rgba(168,85,247,0.6)] ring-4 ring-purple-500/20'
                                          : 'border-slate-200 bg-white text-slate-400 dark:border-slate-800 dark:bg-[#0c122c] dark:text-slate-500'
                                }`}
                            >
                                {isCompleted ? (
                                    <Check className="h-3.5 w-3.5 stroke-[3px] sm:h-4 sm:w-4" />
                                ) : (
                                    <span className="font-['Oxanium'] text-xs font-bold">
                                        {idx + 1}
                                    </span>
                                )}
                            </div>

                            {/* Step Label */}
                            <span
                                className={`mt-2.5 w-full px-0.5 text-center text-[8px] leading-tight font-black tracking-widest break-words uppercase transition-all duration-300 sm:text-[10px] ${
                                    isActive
                                        ? 'scale-105 text-purple-600 drop-shadow-[0_0_6px_rgba(168,85,247,0.2)] dark:text-purple-400'
                                        : isCompleted
                                          ? 'text-indigo-600 dark:text-indigo-400'
                                          : 'text-slate-405 dark:text-slate-500'
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
