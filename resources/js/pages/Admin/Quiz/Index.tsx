import AppLayout from "@/layouts/app-layout"
import { router } from "@inertiajs/react"
import { Layers, Edit2, Trash2, HelpCircle, BookOpen } from "lucide-react"

type Quiz = {
    id: string
    module_name: string
    difficulty: string
    questions_count: number
}

export default function Index({ quizzes }: { quizzes: Quiz[] }) {
    return (
        <AppLayout>
            <div className="relative min-h-screen bg-[#030712] text-white p-4 sm:p-6 lg:p-8 w-full mx-auto overflow-hidden">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[400px] pointer-events-none select-none bg-[radial-gradient(circle_at_top_center,rgba(124,92,255,0.12),transparent_50%)] z-0" />

                <div className="relative z-10 w-full mx-auto space-y-6 sm:space-y-8">

                    {/* HEADER */}
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-[#060B1A]/80 p-6 rounded-xl border border-white/8 backdrop-blur-sm shadow-md">
                        <div>
                            <h1 className="text-2xl sm:text-3xl font-bold text-white flex items-center gap-3">
                                <div className="p-2 bg-[#7C5CFF]/15 border border-[#7C5CFF]/25 rounded-lg text-[#7C5CFF]">
                                    <HelpCircle size={24} />
                                </div>
                                Quiz Management
                            </h1>
                            <p className="text-slate-400 text-sm mt-2 ml-1">
                                Manage quizzes, questions, and difficulty levels across all modules.
                            </p>
                        </div>
                    </div>

                    {/* QUIZ LIST */}
                    {quizzes.length === 0 ? (
                        <div className="flex flex-col items-center justify-center p-12 border border-dashed border-white/8 rounded-xl bg-[#060B1A]/40 text-center">
                            <BookOpen size={48} className="text-slate-500 mb-4 opacity-50" />
                            <h3 className="text-lg font-medium text-slate-350 mb-1">No quizzes found</h3>
                            <p className="text-slate-450 text-sm">Create a quiz from the Module Builder to see it here.</p>
                        </div>
                    ) : (
                        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                            {quizzes.map((quiz) => (
                                <div
                                    key={quiz.id}
                                    className="group bg-[#060B1A]/80 backdrop-blur-sm border border-white/8 rounded-xl p-5 hover:border-[#7C5CFF]/50 hover:shadow-lg hover:shadow-[#7C5CFF]/5 transition-all duration-200 ease-out flex flex-col h-full"
                                >
                                    <div className="flex items-start justify-between mb-4">
                                        <div className="p-2.5 bg-[#7C5CFF]/10 border border-[#7C5CFF]/20 rounded-lg text-[#7C5CFF] group-hover:scale-105 transition-transform duration-200">
                                            <Layers size={20} />
                                        </div>
                                        <span className={`text-[10px] sm:text-xs font-bold px-2.5 py-1 rounded-lg uppercase tracking-wider border ${quiz.difficulty === 'hard' ? 'bg-rose-500/10 text-rose-400 border-rose-500/20' :
                                                quiz.difficulty === 'medium' ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' :
                                                    'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                                            }`}>
                                            {quiz.difficulty}
                                        </span>
                                    </div>

                                    <h2 className="text-base sm:text-lg font-semibold text-white mb-1 line-clamp-2">
                                        {quiz.module_name}
                                    </h2>

                                    <p className="text-sm text-slate-400 mb-6 flex items-center gap-1.5 font-medium">
                                        <HelpCircle size={14} className="text-slate-500" />
                                        {quiz.questions_count} Questions
                                    </p>

                                    <div className="mt-auto flex items-center gap-2 pt-4 border-t border-white/5">
                                        <button
                                            onClick={() => router.get(`/admin/quiz/${quiz.id}/edit`)}
                                            className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-white/4 hover:bg-[#7C5CFF]/15 hover:text-[#7C5CFF] text-white rounded-lg text-sm font-medium transition-colors border border-white/8 hover:border-[#7C5CFF]/30"
                                        >
                                            <Edit2 size={14} />
                                            Edit
                                        </button>
                                        <button
                                            onClick={() => {
                                                if (confirm("Are you sure you want to delete this quiz? This action cannot be undone.")) {
                                                    router.delete(`/admin/quiz/${quiz.id}`)
                                                }
                                            }}
                                            className="px-3 py-2 bg-white/4 hover:bg-rose-500/10 text-slate-300 hover:text-rose-400 rounded-lg text-sm font-medium transition-colors border border-white/8 hover:border-rose-500/30"
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
        </AppLayout>
    )
}