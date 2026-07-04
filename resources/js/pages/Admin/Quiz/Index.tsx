import AppLayout from "@/layouts/app-layout"
import { router } from "@inertiajs/react"
import { useState } from "react"
import { Layers, Edit2, Trash2, HelpCircle, BookOpen } from "lucide-react"
import ConfirmModal from "@/components/ui/ConfirmModal"

type Quiz = {
    id: string
    module_name?: string
    path_name?: string
    difficulty: string
    questions_count: number
}

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
            <div className="relative min-h-screen bg-slate-50 dark:bg-[#030712] text-slate-800 dark:text-white p-4 sm:p-6 lg:p-8 w-full mx-auto overflow-hidden">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[400px] pointer-events-none select-none bg-[radial-gradient(circle_at_top_center,rgba(124,92,255,0.08),transparent_50%)] dark:bg-[radial-gradient(circle_at_top_center,rgba(124,92,255,0.12),transparent_50%)] z-0" />

                <div className="relative z-10 w-full mx-auto space-y-6 sm:space-y-8">

                    {/* HEADER */}
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white dark:bg-[#060B1A]/80 p-6 rounded-xl border border-slate-350 dark:border-white/8 backdrop-blur-sm shadow-sm dark:shadow-md">
                        <div>
                            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white flex items-center gap-3">
                                <div className="p-2 bg-[#7C5CFF]/10 dark:bg-[#7C5CFF]/15 border border-[#7C5CFF]/20 dark:border-[#7C5CFF]/25 rounded-lg text-[#7C5CFF]">
                                    <HelpCircle size={24} />
                                </div>
                                Quiz Management
                            </h1>
                            <p className="text-slate-500 dark:text-slate-400 text-sm mt-2 ml-1">
                                Manage quizzes, questions, and difficulty levels across all modules.
                            </p>
                        </div>
                    </div>

                    {/* QUIZ LIST */}
                    {quizzes.length === 0 ? (
                        <div className="flex flex-col items-center justify-center p-12 border border-dashed border-slate-350 dark:border-white/8 rounded-xl bg-white dark:bg-[#060B1A]/40 text-center shadow-sm">
                            <BookOpen size={48} className="text-slate-400 dark:text-slate-500 mb-4 opacity-70 dark:opacity-50" />
                            <h3 className="text-lg font-medium text-slate-800 dark:text-slate-350 mb-1">No quizzes found</h3>
                            <p className="text-slate-500 dark:text-slate-450 text-sm">Create a quiz from the Module Builder to see it here.</p>
                        </div>
                    ) : (
                        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                            {quizzes.map((quiz) => (
                                <div
                                    key={quiz.id}
                                    className="group bg-white dark:bg-[#060B1A]/80 backdrop-blur-sm border border-slate-300 dark:border-white/8 rounded-xl p-5 hover:border-[#7C5CFF]/50 dark:hover:border-[#7C5CFF]/50 hover:shadow-lg hover:shadow-slate-200/80 dark:hover:shadow-[#7C5CFF]/5 transition-all duration-200 ease-out flex flex-col h-full"
                                >
                                    <div className="flex items-start justify-between mb-4">
                                        <div className="p-2.5 bg-[#7C5CFF]/10 border border-[#7C5CFF]/20 rounded-lg text-[#7C5CFF] group-hover:scale-105 transition-transform duration-200">
                                            <Layers size={20} />
                                        </div>
                                        <span className={`text-[10px] sm:text-xs font-bold px-2.5 py-1 rounded-lg uppercase tracking-wider border ${quiz.difficulty === 'hard' ? 'bg-rose-500/10 text-rose-600 dark:text-rose-450 border-rose-500/20' :
                                                quiz.difficulty === 'medium' ? 'bg-amber-500/10 text-amber-600 dark:text-amber-450 border-amber-500/20' :
                                                    'bg-emerald-500/10 text-emerald-600 dark:text-emerald-450 border-emerald-500/20'
                                            }`}>
                                            {quiz.difficulty}
                                        </span>
                                    </div>

                                    <h2 className="text-base sm:text-lg font-semibold text-slate-800 dark:text-white mb-1 line-clamp-2">
                                        {quiz.module_name || quiz.path_name || 'Untitled Quiz'}
                                    </h2>

                                    <p className="text-sm text-slate-500 dark:text-slate-400 mb-6 flex items-center gap-1.5 font-medium">
                                        <HelpCircle size={14} className="text-slate-450 dark:text-slate-500" />
                                        {quiz.questions_count} Questions
                                    </p>

                                    <div className="mt-auto flex items-center gap-2 pt-4 border-t border-slate-200 dark:border-white/5">
                                        <button
                                            type="button"
                                            onClick={() => router.get(`/admin/quiz/${quiz.id}/edit`)}
                                            className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-slate-50 dark:bg-white/4 hover:bg-[#7C5CFF]/10 dark:hover:bg-[#7C5CFF]/15 hover:text-[#7C5CFF] text-slate-700 dark:text-white rounded-lg text-sm font-medium transition-colors border border-slate-300 dark:border-white/8 hover:border-[#7C5CFF]/30 cursor-pointer"
                                        >
                                            <Edit2 size={14} />
                                            Edit
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => handleDeleteQuiz(quiz)}
                                            className="px-3 py-2 bg-slate-50 dark:bg-white/4 hover:bg-rose-50 dark:hover:bg-rose-500/10 text-slate-650 dark:text-slate-350 hover:text-rose-600 dark:hover:text-rose-450 rounded-lg text-sm font-medium transition-colors border border-slate-300 dark:border-white/8 hover:border-rose-500/30 cursor-pointer"
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
                onClose={() => setConfirmModal((prev) => ({ ...prev, open: false }))}
                onConfirm={confirmModal.onConfirm}
                title={confirmModal.title}
                message={confirmModal.message}
                confirmText={confirmModal.confirmText}
                variant={confirmModal.variant}
            />
        </AppLayout>
    )
}