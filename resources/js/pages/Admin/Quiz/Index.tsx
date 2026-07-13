import AppLayout from '@/layouts/app-layout';
import { router } from '@inertiajs/react';
import { useState } from 'react';
import { Layers, Edit2, Trash2, HelpCircle, BookOpen } from 'lucide-react';
import ConfirmModal from '@/components/ui/ConfirmModal';

type Quiz = {
    id: string;
    module_name?: string;
    path_name?: string;
    difficulty: string;
    questions_count: number;
};

export default function Index({ quizzes }: { quizzes: Quiz[] }) {
    const [confirmModal, setConfirmModal] = useState<{
        open: boolean;
        title: string;
        message: string;
        confirmText: string;
        variant: 'danger' | 'info' | 'primary';
        onConfirm: () => void;
    }>({
        open: false,
        title: '',
        message: '',
        confirmText: 'Confirm',
        variant: 'danger',
        onConfirm: () => {},
    });

    const handleDeleteQuiz = (quiz: Quiz) => {
        const title = quiz.module_name || quiz.path_name || 'Kuis';
        setConfirmModal({
            open: true,
            title: 'Hapus Quiz',
            message: `Apakah Anda yakin ingin menghapus kuis untuk "${title}"? Tindakan ini tidak dapat dibatalkan.`,
            confirmText: 'Hapus Quiz',
            variant: 'danger',
            onConfirm: () => {
                router.delete(`/admin/quiz/${quiz.id}`);
            },
        });
    };

    return (
        <AppLayout>
            <div className="relative mx-auto min-h-screen w-full overflow-hidden bg-slate-50 p-4 text-slate-800 sm:p-6 lg:p-8 dark:bg-[#030712] dark:text-white">
                <div className="pointer-events-none absolute top-0 left-1/2 z-0 h-[400px] w-full max-w-7xl -translate-x-1/2 bg-[radial-gradient(circle_at_top_center,rgba(124,92,255,0.08),transparent_50%)] select-none dark:bg-[radial-gradient(circle_at_top_center,rgba(124,92,255,0.12),transparent_50%)]" />

                <div className="relative z-10 mx-auto w-full space-y-6 sm:space-y-8">
                    {/* HEADER */}
                    <div className="border-slate-350 flex flex-col items-start justify-between gap-4 rounded-xl border bg-white p-6 shadow-sm backdrop-blur-sm sm:flex-row sm:items-center dark:border-white/8 dark:bg-[#060B1A]/80 dark:shadow-md">
                        <div>
                            <h1 className="flex items-center gap-3 text-2xl font-bold text-slate-900 sm:text-3xl dark:text-white">
                                <div className="rounded-lg border border-[#7C5CFF]/20 bg-[#7C5CFF]/10 p-2 text-[#7C5CFF] dark:border-[#7C5CFF]/25 dark:bg-[#7C5CFF]/15">
                                    <HelpCircle size={24} />
                                </div>
                                Quiz Management
                            </h1>
                            <p className="mt-2 ml-1 text-sm text-slate-500 dark:text-slate-400">
                                Manage quizzes, questions, and difficulty levels
                                across all modules.
                            </p>
                        </div>
                    </div>

                    {/* QUIZ LIST */}
                    {quizzes.length === 0 ? (
                        <div className="border-slate-350 flex flex-col items-center justify-center rounded-xl border border-dashed bg-white p-12 text-center shadow-sm dark:border-white/8 dark:bg-[#060B1A]/40">
                            <BookOpen
                                size={48}
                                className="mb-4 text-slate-400 opacity-70 dark:text-slate-500 dark:opacity-50"
                            />
                            <h3 className="dark:text-slate-350 mb-1 text-lg font-medium text-slate-800">
                                No quizzes found
                            </h3>
                            <p className="dark:text-slate-450 text-sm text-slate-500">
                                Create a quiz from the Module Builder to see it
                                here.
                            </p>
                        </div>
                    ) : (
                        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                            {quizzes.map((quiz) => (
                                <div
                                    key={quiz.id}
                                    className="group flex h-full flex-col rounded-xl border border-slate-300 bg-white p-5 backdrop-blur-sm transition-all duration-200 ease-out hover:border-[#7C5CFF]/50 hover:shadow-lg hover:shadow-slate-200/80 dark:border-white/8 dark:bg-[#060B1A]/80 dark:hover:border-[#7C5CFF]/50 dark:hover:shadow-[#7C5CFF]/5"
                                >
                                    <div className="mb-4 flex items-start justify-between">
                                        <div className="rounded-lg border border-[#7C5CFF]/20 bg-[#7C5CFF]/10 p-2.5 text-[#7C5CFF] transition-transform duration-200 group-hover:scale-105">
                                            <Layers size={20} />
                                        </div>
                                        <span
                                            className={`rounded-lg border px-2.5 py-1 text-[10px] font-bold tracking-wider uppercase sm:text-xs ${
                                                quiz.difficulty === 'hard'
                                                    ? 'dark:text-rose-450 border-rose-500/20 bg-rose-500/10 text-rose-600'
                                                    : quiz.difficulty ===
                                                        'medium'
                                                      ? 'dark:text-amber-450 border-amber-500/20 bg-amber-500/10 text-amber-600'
                                                      : 'dark:text-emerald-450 border-emerald-500/20 bg-emerald-500/10 text-emerald-600'
                                            }`}
                                        >
                                            {quiz.difficulty}
                                        </span>
                                    </div>

                                    <h2 className="mb-1 line-clamp-2 text-base font-semibold text-slate-800 sm:text-lg dark:text-white">
                                        {quiz.module_name ||
                                            quiz.path_name ||
                                            'Untitled Quiz'}
                                    </h2>

                                    <p className="mb-6 flex items-center gap-1.5 text-sm font-medium text-slate-500 dark:text-slate-400">
                                        <HelpCircle
                                            size={14}
                                            className="text-slate-450 dark:text-slate-500"
                                        />
                                        {quiz.questions_count} Questions
                                    </p>

                                    <div className="mt-auto flex items-center gap-2 border-t border-slate-200 pt-4 dark:border-white/5">
                                        <button
                                            type="button"
                                            onClick={() =>
                                                router.get(
                                                    `/admin/quiz/${quiz.id}/edit`,
                                                )
                                            }
                                            className="flex flex-1 cursor-pointer items-center justify-center gap-2 rounded-lg border border-slate-300 bg-slate-50 px-3 py-2 text-sm font-medium text-slate-700 transition-colors hover:border-[#7C5CFF]/30 hover:bg-[#7C5CFF]/10 hover:text-[#7C5CFF] dark:border-white/8 dark:bg-white/4 dark:text-white dark:hover:bg-[#7C5CFF]/15"
                                        >
                                            <Edit2 size={14} />
                                            Edit
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() =>
                                                handleDeleteQuiz(quiz)
                                            }
                                            className="text-slate-650 dark:text-slate-350 dark:hover:text-rose-450 cursor-pointer rounded-lg border border-slate-300 bg-slate-50 px-3 py-2 text-sm font-medium transition-colors hover:border-rose-500/30 hover:bg-rose-50 hover:text-rose-600 dark:border-white/8 dark:bg-white/4 dark:hover:bg-rose-500/10"
                                            title="Delete Quiz"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
            <ConfirmModal
                open={confirmModal.open}
                onClose={() =>
                    setConfirmModal((prev) => ({ ...prev, open: false }))
                }
                onConfirm={confirmModal.onConfirm}
                title={confirmModal.title}
                message={confirmModal.message}
                confirmText={confirmModal.confirmText}
                variant={confirmModal.variant}
            />
        </AppLayout>
    );
}
