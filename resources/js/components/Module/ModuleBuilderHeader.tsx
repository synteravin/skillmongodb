import React from 'react';
import { router, Link } from '@inertiajs/react';
import { ArrowLeft } from 'lucide-react';

export type QuizInfo = {
    id?: string;
    _id?: string;
    slug?: string;
    difficulty?: string;
    duration?: number;
    questions_count?: number;
};

export interface ModuleBuilderHeaderProps {
    path: {
        id?: string;
        _id?: string;
        slug?: string;
        name: string;
        description?: string;
        quiz?: QuizInfo | null;
    };
    modulesCount: number;
    role: 'admin' | 'mentor';
    careerGroupSlug?: string;
    backHref?: string;
    onDeleteQuiz: (quizId: string) => void;
    className?: string;
}

export default function ModuleBuilderHeader({
    path,
    modulesCount,
    role,
    careerGroupSlug,
    backHref,
    onDeleteQuiz,
    className = '',
}: ModuleBuilderHeaderProps) {
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
        <header
            className={`relative w-full overflow-hidden rounded-2xl border border-slate-200 bg-white/80 p-5 shadow-sm transition-all sm:p-6 dark:border-white/5 dark:bg-[#0d0f17] ${className}`}
            style={{
                backgroundImage: `
                    radial-gradient(circle at top right, rgba(124, 92, 255, 0.12), transparent 70%),
                    radial-gradient(circle at bottom left, rgba(56, 189, 248, 0.05), transparent 60%)
                `,
            }}
        >
            {/* Top Accent Gradient Line */}
            <div
                className={`absolute top-0 right-0 left-0 h-1 ${
                    hasQuiz
                        ? 'bg-gradient-to-r from-emerald-500 via-teal-400 to-indigo-500'
                        : 'bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500'
                }`}
            />

            <div className="relative z-10 flex flex-col justify-between gap-6 lg:flex-row lg:items-center">
                {/* LEFT: Path & Builder Info */}
                <div className="flex items-start gap-4">
                    {backHref ? (
                        <Link
                            href={backHref}
                            className="mt-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-slate-200 bg-slate-50 text-slate-500 transition-all hover:border-indigo-300 hover:bg-white hover:text-indigo-600 active:scale-95 dark:border-slate-800 dark:bg-slate-900/80 dark:text-slate-400 dark:hover:border-indigo-500/50 dark:hover:bg-slate-800 dark:hover:text-white"
                            title="Kembali"
                        >
                            <ArrowLeft size={18} />
                        </Link>
                    ) : (
                        <button
                            type="button"
                            onClick={() => window.history.back()}
                            className="mt-1 flex h-10 w-10 shrink-0 cursor-pointer items-center justify-center rounded-xl border border-slate-200 bg-slate-50 text-slate-500 transition-all hover:border-indigo-300 hover:bg-white hover:text-indigo-600 active:scale-95 dark:border-slate-800 dark:bg-slate-900/80 dark:text-slate-400 dark:hover:border-indigo-500/50 dark:hover:bg-slate-800 dark:hover:text-white"
                            title="Kembali"
                        >
                            <ArrowLeft size={18} />
                        </button>
                    )}

                    <div className="space-y-2">
                        {/* Meta Tags */}
                        <div className="flex flex-wrap items-center gap-2">
                            <div className="inline-flex items-center gap-1.5 rounded-full border border-indigo-500/20 bg-indigo-500/10 px-2.5 py-0.5 text-[10px] font-bold tracking-[0.1em] text-indigo-600 uppercase dark:text-indigo-400">
                                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-indigo-500" />
                                <span>Path Module Builder</span>
                            </div>

                            <span className="rounded-full border border-slate-200 bg-slate-100 px-2.5 py-0.5 text-xs font-semibold text-slate-700 shadow-2xs dark:border-slate-800 dark:bg-slate-900/70 dark:text-slate-300">
                                {path.name}
                            </span>

                            <span className="rounded-full border border-slate-200/80 bg-white/80 px-2.5 py-0.5 text-xs text-slate-500 dark:border-slate-800 dark:bg-slate-950/60 dark:text-slate-400">
                                {modulesCount} Modul Terdaftar
                            </span>
                        </div>

                        {/* Heading */}
                        <h1
                            className="m-0 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl dark:text-white"
                            style={{ fontFamily: 'Orbitron, sans-serif' }}
                        >
                            Module Builder
                        </h1>

                        <p className="max-w-xl text-xs text-slate-500 sm:text-sm dark:text-slate-400">
                            {path.description ||
                                'Susun kurikulum, kelola materi pembelajaran, dan konfigurasi evaluasi kelulusan untuk path ini.'}
                        </p>
                    </div>
                </div>

                {/* RIGHT: Final Quiz Sub-Card Panel */}
                <div className="flex w-full flex-col justify-between gap-3 rounded-xl border border-slate-200/90 bg-slate-50/70 p-4 shadow-2xs sm:flex-row sm:items-center lg:w-[380px] lg:shrink-0 lg:flex-col lg:items-stretch dark:border-slate-800/80 dark:bg-[#060B1A]/80">
                    <div className="space-y-2">
                        {/* Status Header */}
                        <div className="flex items-center justify-between gap-2">
                            <span className="font-['Orbitron'] text-[10px] font-bold tracking-wider text-slate-400 uppercase dark:text-slate-500">
                                Evaluasi Akhir Path
                            </span>
                            {hasQuiz ? (
                                <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/25 bg-emerald-50 px-2.5 py-0.5 text-[11px] font-bold text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300">
                                    <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-500" />
                                    Final Quiz Aktif
                                </span>
                            ) : (
                                <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-500/25 bg-amber-50 px-2.5 py-0.5 text-[11px] font-semibold text-amber-700 dark:bg-amber-500/15 dark:text-amber-300">
                                    <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
                                    Belum Dibuat
                                </span>
                            )}
                        </div>

                        {/* Quiz Metadata (Tanpa Icon) */}
                        {hasQuiz ? (
                            <div className="flex flex-wrap items-center gap-2 text-xs">
                                <span
                                    className={`inline-flex items-center rounded-md border px-2 py-0.5 font-semibold ${getDifficultyBadge()}`}
                                >
                                    {difficulty}
                                </span>
                                {questionsCount > 0 && (
                                    <span className="inline-flex items-center rounded-md border border-slate-200 bg-white px-2 py-0.5 font-medium text-slate-600 dark:border-slate-800 dark:bg-slate-900/60 dark:text-slate-300">
                                        {questionsCount} Pertanyaan
                                    </span>
                                )}
                                <span className="inline-flex items-center rounded-md border border-slate-200 bg-white px-2 py-0.5 font-medium text-slate-600 dark:border-slate-800 dark:bg-slate-900/60 dark:text-slate-300">
                                    Durasi {duration} Menit
                                </span>
                            </div>
                        ) : (
                            <p className="text-xs text-slate-500 dark:text-slate-400">
                                Uji pemahaman dan kelulusan siswa setelah menyelesaikan seluruh materi modul.
                            </p>
                        )}
                    </div>

                    {/* Quiz Action Buttons */}
                    <div className="flex items-center gap-2 pt-1">
                        {hasQuiz ? (
                            <>
                                <button
                                    type="button"
                                    onClick={() => router.get(editUrl)}
                                    className="flex-1 cursor-pointer rounded-xl border border-indigo-200 bg-indigo-50/70 px-3.5 py-2 text-center text-xs font-bold text-indigo-700 shadow-2xs transition-all hover:border-indigo-300 hover:bg-indigo-100 hover:text-indigo-800 active:scale-95 dark:border-indigo-500/30 dark:bg-indigo-500/15 dark:text-indigo-300 dark:hover:bg-indigo-500/25"
                                    title="Edit Soal & Kunci Jawaban"
                                >
                                    Edit Final Quiz
                                </button>
                                <button
                                    type="button"
                                    onClick={() => onDeleteQuiz(quizIdentifier)}
                                    className="cursor-pointer rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-xs font-semibold text-rose-600 transition-all hover:border-rose-300 hover:bg-rose-100 active:scale-95 dark:border-rose-500/20 dark:bg-rose-500/10 dark:text-rose-400 dark:hover:bg-rose-500/20"
                                    title="Hapus Final Quiz"
                                >
                                    Hapus
                                </button>
                            </>
                        ) : (
                            <button
                                type="button"
                                onClick={() => router.get(createUrl)}
                                className="w-full cursor-pointer rounded-xl bg-gradient-to-r from-indigo-600 to-[#3B28F6] px-4 py-2 text-center text-xs font-bold text-white shadow-sm shadow-indigo-500/25 transition-all hover:scale-[1.01] hover:shadow-md hover:shadow-indigo-500/40 active:scale-95 dark:from-indigo-500 dark:to-purple-600"
                            >
                                Buat Final Quiz
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </header>
    );
}
