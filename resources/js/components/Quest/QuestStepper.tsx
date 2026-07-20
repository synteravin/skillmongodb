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
        <div className="relative overflow-hidden w-full rounded-xl border border-slate-300 bg-white p-5 py-6 dark:border-slate-800/80 dark:bg-gradient-to-b dark:from-[#0e0e1a] dark:to-[#090910]">
            <div className="absolute top-0 right-8 left-8 h-px bg-gradient-to-r from-transparent via-slate-300 to-transparent dark:via-slate-700 pointer-events-none select-none z-0" />
            <div className="relative z-10 grid grid-cols-6 gap-0">
                {/* Stepper Line Container */}
                <div className="absolute top-[14px] right-[8.33%] left-[8.33%] z-0 h-[2px] -translate-y-1/2 sm:top-[16px]">
                    {/* Background Line */}
                    <div className="absolute inset-0 rounded-full bg-slate-100 dark:bg-slate-800" />

                    {/* Active Progress Line */}
                    <div
                        className="absolute top-0 bottom-0 left-0 rounded-full bg-indigo-600 transition-all duration-700 ease-out"
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
                                className={`flex h-7 w-7 cursor-default items-center justify-center rounded-full border-2 transition-all duration-300 sm:h-8 sm:w-8 ${
                                    isCompleted
                                        ? 'border-indigo-650 bg-indigo-600 text-white shadow-sm'
                                        : isActive
                                          ? 'border-indigo-650 bg-white text-indigo-600 ring-4 ring-indigo-100 dark:bg-[#0d1117] dark:text-indigo-400 dark:ring-slate-800'
                                          : 'border-slate-200 bg-white text-slate-400 dark:border-slate-800 dark:bg-[#0d1117] dark:text-slate-500'
                                }`}
                            >
                                {isCompleted ? (
                                    <Check className="h-3.5 w-3.5 stroke-[3px] sm:h-4 sm:w-4" />
                                ) : (
                                    <span className="text-xs font-bold">
                                        {idx + 1}
                                    </span>
                                )}
                            </div>

                            {/* Step Label */}
                            <span
                                className={`mt-2.5 w-full px-0.5 text-center text-[10px] leading-tight font-medium tracking-wide break-words transition-all duration-300 ${
                                    isActive
                                        ? 'font-bold text-indigo-650 dark:text-indigo-400'
                                        : isCompleted
                                          ? 'text-slate-700 dark:text-slate-300'
                                          : 'text-slate-400 dark:text-slate-550'
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
