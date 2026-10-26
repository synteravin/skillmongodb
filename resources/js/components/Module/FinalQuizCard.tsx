import React from 'react';
import { router } from '@inertiajs/react';

export type QuizInfo = {
    id?: string;
    _id?: string;
    slug?: string;
    difficulty?: string;
    duration?: number;
    questions_count?: number;
};

export interface FinalQuizCardProps {
    path: {
        id?: string;
        _id?: string;
        slug?: string;
        name: string;
        quiz?: QuizInfo | null;
    };
    role: 'admin' | 'mentor';
    careerGroupSlug?: string;
    onDeleteQuiz: (quizId: string) => void;
    className?: string;
}

export default function FinalQuizCard({
    path,
    role,
    careerGroupSlug,
    onDeleteQuiz,
    className = '',
}: FinalQuizCardProps) {
    const hasQuiz = Boolean(
        path.quiz && (path.quiz.slug || path.quiz.id || path.quiz._id),
    );
    const quizIdentifier =
        path.quiz?.slug || path.quiz?.id || path.quiz?._id || '';

    const pathIdentifier = path.slug || path.id || path._id || '';

    const createUrl =
        role === 'admin'
            ? `/admin/paths/${pathIdentifier}/quiz/create`
            : `/mentor/career-groups/${careerGroupSlug}/paths/${pathIdentifier}/quiz/create`;

    const editUrl =
        role === 'admin'
            ? `/admin/quiz/${quizIdentifier}/edit`
            : `/mentor/quiz/${quizIdentifier}/edit`;

    const questionsCount = path.quiz?.questions_count ?? 0;
    const duration = path.quiz?.duration ?? 15;
    const difficulty = (path.quiz?.difficulty || 'medium').toUpperCase();

    const getDifficultyBadge = () => {
        switch (difficulty.toLowerCase()) {
            case 'hard':
                return 'border-rose-500/20 bg-rose-500/10 text-rose-600 dark:text-rose-400';
            case 'easy':
                return 'border-emerald-500/20 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400';
            default:
                return 'border-amber-500/20 bg-amber-500/10 text-amber-600 dark:text-amber-400';
        }
    };

    return (
        <div
            className={`relative overflow-hidden rounded-2xl border transition-all duration-300 ${
                hasQuiz
                    ? 'border-emerald-200/80 bg-gradient-to-br from-white via-emerald-50/20 to-white shadow-sm hover:border-emerald-300 hover:shadow-md dark:border-emerald-500/20 dark:from-[#060B1A] dark:via-emerald-950/10 dark:to-[#060B1A] dark:shadow-emerald-950/20'
                    : 'border-dashed border-slate-300 bg-white/70 hover:border-indigo-300 hover:bg-white dark:border-slate-800 dark:bg-[#060B1A]/60 dark:hover:border-indigo-500/40'
            } ${className}`}
        >
            {/* Top Accent Line */}
            <div
                className={`h-1 w-full ${
                    hasQuiz
                        ? 'bg-gradient-to-r from-emerald-500 via-teal-400 to-indigo-500'
                        : 'bg-gradient-to-r from-amber-400 via-slate-300 to-slate-200 dark:via-slate-700 dark:to-slate-800'
                }`}
            />

            <div className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
                {/* Left Section: Info (Tanpa Icon Box) */}
                <div className="space-y-1.5">
                    <div className="flex flex-wrap items-center gap-2">
                        <span className="font-['Orbitron'] text-xs font-bold tracking-wider text-slate-400 uppercase dark:text-slate-500">
                            Tahap Akhir Path
                        </span>
                        {hasQuiz ? (
                            <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/25 bg-emerald-50 px-2.5 py-0.5 text-[11px] font-bold text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300">
                                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-500" />
                                Final Quiz Aktif
                            </span>
                        ) : (
                            <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-500/25 bg-amber-50 px-2.5 py-0.5 text-[11px] font-semibold text-amber-700 dark:bg-amber-500/15 dark:text-amber-300">
                                <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
                                Belum Dikonfigurasi
                            </span>
                        )}
                    </div>

                    <h3 className="text-base font-bold text-slate-900 sm:text-lg dark:text-white">
                        {hasQuiz
                            ? `Final Quiz: Evaluasi Kelulusan "${path.name}"`
                            : `Final Quiz Belum Dibuat`}
                    </h3>

                    <p className="max-w-2xl text-xs text-slate-500 sm:text-sm dark:text-slate-400">
                        {hasQuiz
                            ? 'Kuis ini akan otomatis terbuka setelah siswa menyelesaikan seluruh modul dalam path ini untuk menentukan kelulusan.'
                            : 'Path ini belum memiliki evaluasi akhir. Tambahkan kuis untuk menguji pemahaman siswa setelah menyelesaikan materi.'}
                    </p>

                    {/* Metadata Tags if Quiz Exists */}
                    {hasQuiz && (
                        <div className="flex flex-wrap items-center gap-2 pt-1 text-xs">
                            <span
                                className={`inline-flex items-center rounded-md border px-2.5 py-0.5 font-semibold ${getDifficultyBadge()}`}
                            >
                                {difficulty}
                            </span>
                            {questionsCount > 0 && (
                                <span className="inline-flex items-center rounded-md border border-slate-200 bg-slate-50 px-2.5 py-0.5 font-medium text-slate-600 dark:border-slate-800 dark:bg-slate-900/60 dark:text-slate-300">
                                    {questionsCount} Pertanyaan
                                </span>
                            )}
                            <span className="inline-flex items-center rounded-md border border-slate-200 bg-slate-50 px-2.5 py-0.5 font-medium text-slate-600 dark:border-slate-800 dark:bg-slate-900/60 dark:text-slate-300">
                                Durasi {duration} Menit
                            </span>
                        </div>
                    )}
                </div>

                {/* Right Section: Actions */}
                <div className="flex shrink-0 items-center gap-2 pt-2 sm:pt-0">
                    {hasQuiz ? (
                        <>
                            <button
                                type="button"
                                onClick={() => router.get(editUrl)}
                                className="inline-flex cursor-pointer items-center rounded-xl border border-indigo-200 bg-indigo-50/70 px-4 py-2.5 text-xs font-bold text-indigo-700 shadow-2xs transition-all hover:border-indigo-300 hover:bg-indigo-100 hover:text-indigo-800 active:scale-95 dark:border-indigo-500/30 dark:bg-indigo-500/15 dark:text-indigo-300 dark:hover:bg-indigo-500/25"
                                title="Edit pertanyaan, jawaban, dan durasi kuis"
                            >
                                <span>Edit Final Quiz</span>
                            </button>

                            <button
                                type="button"
                                onClick={() => onDeleteQuiz(quizIdentifier)}
                                className="inline-flex cursor-pointer items-center justify-center rounded-xl border border-rose-200 bg-rose-50 px-3 py-2.5 text-xs font-semibold text-rose-600 transition-all hover:border-rose-300 hover:bg-rose-100 active:scale-95 dark:border-rose-500/20 dark:bg-rose-500/10 dark:text-rose-400 dark:hover:bg-rose-500/20"
                                title="Hapus Final Quiz"
                            >
                                <span>Hapus</span>
                            </button>
                        </>
                    ) : (
                        <button
                            type="button"
                            onClick={() => router.get(createUrl)}
                            className="inline-flex cursor-pointer items-center rounded-xl bg-gradient-to-r from-indigo-600 to-[#3B28F6] px-5 py-2.5 text-xs font-bold text-white shadow-sm shadow-indigo-500/25 transition-all hover:scale-[1.02] hover:shadow-md hover:shadow-indigo-500/40 active:scale-95 dark:from-indigo-500 dark:to-purple-600"
                        >
                            <span>Buat Final Quiz</span>
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}
