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
            <div className="min-h-screen bg-gradient-to-br from-[#020617] via-[#020617] to-black text-white p-4 sm:p-6 lg:p-8">
                <div className="max-w-5xl mx-auto space-y-6 sm:space-y-8">
                    
                    {/* HEADER */}
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-slate-900/50 p-6 rounded-2xl border border-slate-800/60 backdrop-blur-xl shadow-lg">
                        <div>
                            <h1 className="text-2xl sm:text-3xl font-bold text-white flex items-center gap-3">
                                <div className="p-2 bg-indigo-500/10 rounded-lg">
                                    <HelpCircle className="text-indigo-400" size={24} />
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
                        <div className="flex flex-col items-center justify-center p-12 border-2 border-dashed border-slate-800/60 rounded-2xl bg-slate-900/20 text-center">
                            <BookOpen size={48} className="text-slate-600 mb-4 opacity-50" />
                            <h3 className="text-lg font-medium text-slate-300 mb-1">No quizzes found</h3>
                            <p className="text-slate-500 text-sm">Create a quiz from the Module Builder to see it here.</p>
                        </div>
                    ) : (
                        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                            {quizzes.map((quiz) => (
                                <div
                                    key={quiz.id}
                                    className="group bg-slate-900/40 backdrop-blur-sm border border-slate-800/80 rounded-2xl p-5 hover:border-indigo-500/50 hover:shadow-lg hover:shadow-indigo-500/10 transition-all duration-300 flex flex-col h-full"
                                >
                                    <div className="flex items-start justify-between mb-4">
                                        <div className="p-2.5 bg-indigo-500/10 rounded-xl text-indigo-400 group-hover:scale-110 transition-transform duration-300">
                                            <Layers size={20} />
                                        </div>
                                        <span className={`text-[10px] sm:text-xs font-bold px-2.5 py-1 rounded-md uppercase tracking-wider border ${
                                            quiz.difficulty === 'hard' ? 'bg-rose-500/10 text-rose-400 border-rose-500/20' : 
                                            quiz.difficulty === 'medium' ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' : 
                                            'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                                        }`}>
                                            {quiz.difficulty}
                                        </span>
                                    </div>
                                    
                                    <h2 className="text-base sm:text-lg font-semibold text-white mb-1 line-clamp-2">
                                        {quiz.module_name}
                                    </h2>
                                    
                                    <p className="text-sm text-slate-400 mb-6 flex items-center gap-1.5">
                                        <HelpCircle size={14} />
                                        {quiz.questions_count} Questions
                                    </p>

                                    <div className="mt-auto flex items-center gap-2 pt-4 border-t border-slate-800/60">
                                        <button
                                            onClick={() => router.get(`/admin/quiz/${quiz.id}/edit`)}
                                            className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-slate-800 hover:bg-indigo-600 text-white rounded-xl text-sm font-medium transition-colors border border-slate-700 hover:border-indigo-500"
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
                                            className="px-3 py-2 bg-slate-800 hover:bg-rose-500/10 text-slate-300 hover:text-rose-400 rounded-xl text-sm font-medium transition-colors border border-slate-700 hover:border-rose-500/30"
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