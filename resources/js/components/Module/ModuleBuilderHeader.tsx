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
            className={`relative w-full overflow-hidden rounded-2xl border border-slate-200/90 bg-white/90 p-5 shadow-sm backdrop-blur-xl transition-all sm:p-6 dark:border-white/5 dark:bg-[#0d0f17] ${className}`}
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

            <div className="relative z-10 flex flex-col gap-5">
                {/* TOP BAR: Navigation, Breadcrumbs & Global Status */}
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-4 dark:border-slate-800/60">
                    <div className="flex flex-wrap items-center gap-2.5">
                        {backHref ? (
                            <Link
                                href={backHref}
                                className="group flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-slate-50 text-slate-500 transition-all hover:border-indigo-300 hover:bg-white hover:text-indigo-600 active:scale-95 dark:border-slate-800 dark:bg-slate-900/80 dark:text-slate-400 dark:hover:border-indigo-500/50 dark:hover:bg-slate-800 dark:hover:text-white"
                                title="Kembali"
                            >
                                <ArrowLeft
                                    size={16}
                                    className="transition-transform group-hover:-translate-x-0.5"
                                />
                            </Link>
                        ) : (
                            <button
                                type="button"
                                onClick={() => window.history.back()}
                                className="group flex h-9 w-9 cursor-pointer items-center justify-center rounded-xl border border-slate-200 bg-slate-50 text-slate-500 transition-all hover:border-indigo-300 hover:bg-white hover:text-indigo-600 active:scale-95 dark:border-slate-800 dark:bg-slate-900/80 dark:text-slate-400 dark:hover:border-indigo-500/50 dark:hover:bg-slate-800 dark:hover:text-white"
                                title="Kembali"
                            >
                                <ArrowLeft
                                    size={16}
                                    className="transition-transform group-hover:-translate-x-0.5"
                                />
                            </button>
                        )}

                        <div className="h-5 w-px bg-slate-200 dark:bg-slate-800" />

                        <div className="inline-flex items-center gap-1.5 rounded-full border border-indigo-500/20 bg-indigo-500/10 px-2.5 py-0.5 text-[10px] font-bold tracking-[0.1em] text-indigo-600 uppercase dark:text-indigo-400">
                            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-indigo-500" />
                            <span>Path Module Builder</span>
                        </div>

                        <span className="rounded-full border border-slate-200 bg-slate-100 px-2.5 py-0.5 text-xs font-semibold text-slate-700 shadow-2xs dark:border-slate-800 dark:bg-slate-900/70 dark:text-slate-300">
                            Path: {path.name}
                        </span>

                        <span className="rounded-full border border-slate-200/80 bg-white/80 px-2.5 py-0.5 text-xs text-slate-500 dark:border-slate-800 dark:bg-slate-950/60 dark:text-slate-400">
                            {modulesCount} Modul
                        </span>
                    </div>

                    {/* Right status indicator in top bar */}
                    <div>
                        {hasQuiz ? (
                            <span className="inline-flex items-center gap-2 rounded-full border border-emerald-500/25 bg-emerald-50/80 px-3 py-1 text-xs font-bold text-emerald-700 shadow-2xs dark:border-emerald-500/20 dark:bg-emerald-950/30 dark:text-emerald-300">
                                <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-500" />
                                Final Quiz Aktif
                            </span>
                        ) : (
                            <span className="inline-flex items-center gap-2 rounded-full border border-amber-500/25 bg-amber-50/80 px-3 py-1 text-xs font-semibold text-amber-700 shadow-2xs dark:border-amber-500/20 dark:bg-amber-950/30 dark:text-amber-300">
                                <span className="h-2 w-2 rounded-full bg-amber-500" />
                                Belum Ada Final Quiz
                            </span>
                        )}
                    </div>
                </div>

                {/* MAIN ROW: Heading and Seamless Quiz Controls */}
                <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-center">
                    {/* Left: Title & Description */}
                    <div className="space-y-1.5">
                        <h1
                            className="m-0 bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-800 bg-clip-text text-2xl font-bold tracking-tight text-transparent sm:text-3xl dark:from-white dark:via-slate-100 dark:to-indigo-200"
                            style={{ fontFamily: 'Orbitron, sans-serif' }}
                        >
                            Module Builder
                        </h1>
                        <p className="max-w-xl text-xs text-slate-500 sm:text-sm dark:text-slate-400">
                            {path.description ||
                                'Susun kurikulum, kelola materi pembelajaran, dan konfigurasi evaluasi kelulusan untuk path ini.'}
                        </p>
                    </div>

                    {/* Right: Integrated Action & Metadata (No nested card-in-card) */}
                    <div className="flex flex-col items-start gap-3 sm:flex-row sm:items-center lg:flex-col lg:items-end lg:gap-2.5">
                        {hasQuiz ? (
                            <>
                                {/* Metadata chips (No icons) */}
                                <div className="flex flex-wrap items-center gap-2 text-xs">
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

                                {/* Action Buttons */}
                                <div className="flex items-center gap-2">
                                    <button
                                        type="button"
                                        onClick={() => router.get(editUrl)}
                                        className="inline-flex cursor-pointer items-center justify-center rounded-xl border border-indigo-200 bg-indigo-50/80 px-4 py-2 text-xs font-bold text-indigo-700 shadow-2xs transition-all hover:border-indigo-300 hover:bg-indigo-100 hover:text-indigo-800 active:scale-95 dark:border-indigo-500/30 dark:bg-indigo-500/15 dark:text-indigo-300 dark:hover:bg-indigo-500/25"
                                        title="Edit Soal & Kunci Jawaban"
                                    >
                                        Edit Final Quiz
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => onDeleteQuiz(quizIdentifier)}
                                        className="inline-flex cursor-pointer items-center justify-center rounded-xl border border-rose-200 bg-rose-50 px-3.5 py-2 text-xs font-semibold text-rose-600 transition-all hover:border-rose-300 hover:bg-rose-100 active:scale-95 dark:border-rose-500/20 dark:bg-rose-500/10 dark:text-rose-400 dark:hover:bg-rose-500/20"
                                        title="Hapus Final Quiz"
                                    >
                                        Hapus
                                    </button>
                                </div>
                            </>
                        ) : (
                            <button
                                type="button"
                                onClick={() => router.get(createUrl)}
                                className="inline-flex cursor-pointer items-center justify-center rounded-xl bg-gradient-to-r from-indigo-600 to-[#3B28F6] px-5 py-2.5 text-xs font-bold text-white shadow-md shadow-indigo-500/25 transition-all hover:scale-[1.01] hover:shadow-lg hover:shadow-indigo-500/40 active:scale-95 dark:from-indigo-500 dark:to-purple-600"
                            >
                                + Buat Final Quiz
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </header>
    );
}
