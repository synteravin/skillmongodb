import { useEffect, useState } from "react"
import { router } from "@inertiajs/react"
import AppLayout from "@/layouts/app-layout"
import { ArrowLeft, Check, CheckCircle2, Circle, Edit3, HelpCircle, Plus, Trash2, X } from "lucide-react"

/* ================= TYPES ================= */

type Answer = {
    answer_text: string
    is_correct: boolean
}

type Question = {
    question_text: string
    answers: Answer[]
}

type Quiz = {
    id: string
    module_id: string
    difficulty: string
    questions: Question[]
}

/* ================= COMPONENT ================= */

export default function Edit({ quiz }: { quiz: Quiz }) {
    const [questions, setQuestions] = useState<Question[]>([])
    const [loading, setLoading] = useState(false)

    /* ================= INIT DATA ================= */

    useEffect(() => {
        if (quiz && quiz.questions) {
            setQuestions(quiz.questions)
        }
    }, [quiz])

    /* ================= ACTIONS ================= */

    const addQuestion = () => {
        setQuestions([
            ...questions,
            {
                question_text: "",
                answers: [
                    { answer_text: "", is_correct: false },
                    { answer_text: "", is_correct: false },
                ],
            },
        ])
    }

    const removeQuestion = (index: number) => {
        setQuestions(questions.filter((_, i) => i !== index))
    }

    const updateQuestion = (index: number, data: Question) => {
        const newQuestions = [...questions]
        newQuestions[index] = data
        setQuestions(newQuestions)
    }

    /* ================= VALIDATION ================= */

    const validate = () => {
        if (questions.length === 0) {
            alert("Minimal 1 question")
            return false
        }

        for (let q of questions) {
            if (!q.question_text.trim()) {
                alert("Question tidak boleh kosong")
                return false
            }

            if (q.answers.length < 2) {
                alert("Minimal 2 jawaban")
                return false
            }

            let hasCorrect = false;
            for (let a of q.answers) {
                if (!a.answer_text.trim()) {
                    alert("Teks jawaban tidak boleh kosong");
                    return false;
                }
                if (a.is_correct) hasCorrect = true;
            }

            if (!hasCorrect) {
                alert("Harus ada setidaknya 1 jawaban benar untuk setiap pertanyaan")
                return false
            }
        }

        return true
    }

    /* ================= SUBMIT ================= */

    const submit = () => {
        if (!validate()) return

        setLoading(true)

        router.put(
            `/mentor/quiz/${quiz.id}`,
            {
                module_id: quiz.module_id,
                difficulty: quiz.difficulty,
                questions,
            },
            {
                onFinish: () => setLoading(false),
            }
        )
    }

    /* ================= UI ================= */

    return (
        <AppLayout>
            <div className="min-h-screen bg-gradient-to-br from-[#020617] via-[#020617] to-black text-white p-4 sm:p-6 lg:p-8">
                <div className="max-w-4xl mx-auto space-y-6 sm:space-y-8">

                    {/* HEADER */}
                    <div className="flex flex-col justify-center gap-4 bg-slate-900/50 p-6 rounded-2xl border border-slate-800/60 backdrop-blur-xl shadow-lg">
                        <button
                            onClick={() => window.history.back()}
                            className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors text-sm font-medium w-fit mb-2"
                        >
                            <ArrowLeft size={16} /> Back
                        </button>
                        <div>
                            <h1 className="text-2xl sm:text-3xl font-bold text-white flex items-center gap-3">
                                <div className="p-2 bg-indigo-500/10 rounded-lg">
                                    <Edit3 className="text-indigo-400" size={24} />
                                </div>
                                Edit Quiz
                            </h1>
                            <div className="flex items-center gap-3 mt-3 ml-1">
                                <span className={`text-xs font-bold px-2.5 py-1 rounded-md uppercase tracking-wider border ${quiz.difficulty === 'hard' ? 'bg-rose-500/10 text-rose-400 border-rose-500/20' :
                                    quiz.difficulty === 'medium' ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' :
                                        'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                                    }`}>
                                    {quiz.difficulty} Difficulty
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* QUESTIONS LIST */}
                    <div className="space-y-6">
                        {questions.length === 0 ? (
                            <div className="flex flex-col items-center justify-center p-12 border-2 border-dashed border-slate-800/60 rounded-2xl bg-slate-900/20 text-center">
                                <HelpCircle size={48} className="text-slate-600 mb-4 opacity-50" />
                                <h3 className="text-lg font-medium text-slate-300 mb-1">No questions</h3>
                                <p className="text-slate-500 text-sm mb-6">Add questions to complete this quiz.</p>
                                <button
                                    onClick={addQuestion}
                                    className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white px-5 py-2.5 rounded-xl text-sm font-medium transition-all shadow-lg shadow-indigo-500/20"
                                >
                                    <Plus size={16} />
                                    Add Question
                                </button>
                            </div>
                        ) : (
                            questions.map((q, i) => (
                                <QuestionCard
                                    key={i}
                                    index={i}
                                    data={q}
                                    onChange={(data) => updateQuestion(i, data)}
                                    onDelete={() => removeQuestion(i)}
                                />
                            ))
                        )}
                    </div>

                    {/* ACTIONS */}
                    {questions.length > 0 && (
                        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 bg-slate-900/50 p-6 rounded-2xl border border-slate-800/60 backdrop-blur-xl shadow-lg">
                            <button
                                onClick={addQuestion}
                                className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 transition-colors font-medium text-sm"
                            >
                                <Plus size={16} />
                                Add Another Question
                            </button>

                            <button
                                onClick={submit}
                                disabled={loading}
                                className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white transition-colors font-medium text-sm shadow-lg shadow-indigo-500/20 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {loading ? (
                                    <>
                                        <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Updating...
                                    </>
                                ) : (
                                    <>
                                        <Check size={16} />
                                        Update Quiz
                                    </>
                                )}
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </AppLayout>
    )
}

/* ================= QUESTION CARD ================= */

function QuestionCard({
    index,
    data,
    onChange,
    onDelete,
}: {
    index: number
    data: Question
    onChange: (data: Question) => void
    onDelete: () => void
}) {
    const updateAnswer = (i: number, answer: Answer) => {
        const newAnswers = [...data.answers]
        newAnswers[i] = answer
        onChange({ ...data, answers: newAnswers })
    }

    const addAnswer = () => {
        onChange({
            ...data,
            answers: [...data.answers, { answer_text: "", is_correct: false }],
        })
    }

    const removeAnswer = (i: number) => {
        const newAnswers = data.answers.filter((_, idx) => idx !== i)
        onChange({ ...data, answers: newAnswers })
    }

    return (
        <div className="bg-slate-900/40 backdrop-blur-md border border-slate-800/80 rounded-2xl overflow-hidden shadow-xl transition-all duration-300 hover:border-slate-700/80">
            {/* HEADER */}
            <div className="flex justify-between items-center bg-slate-950/50 p-4 border-b border-slate-800/60">
                <div className="flex items-center gap-3">
                    <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-indigo-500/10 text-indigo-400 font-bold text-sm">
                        {index + 1}
                    </span>
                    <span className="text-sm font-semibold text-slate-300">
                        Question Configuration
                    </span>
                </div>
                <button
                    onClick={onDelete}
                    className="p-2 text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors"
                    title="Delete Question"
                >
                    <Trash2 size={16} />
                </button>
            </div>

            <div className="p-5 sm:p-6 space-y-6">
                {/* QUESTION TEXT */}
                <div>
                    <label className="block text-xs font-medium text-slate-400 mb-1.5 ml-1">Question Text</label>
                    <textarea
                        placeholder="e.g. What is the core feature of React?"
                        value={data.question_text}
                        onChange={(e) => onChange({ ...data, question_text: e.target.value })}
                        rows={3}
                        className="w-full bg-slate-950/50 border border-slate-800 px-4 py-3 rounded-xl text-sm text-white outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all resize-y placeholder:text-slate-600"
                    />
                </div>

                {/* ANSWERS */}
                <div className="pt-4 border-t border-slate-800/60">
                    <div className="flex justify-between items-center mb-4">
                        <label className="block text-xs font-medium text-slate-400 ml-1">Possible Answers</label>
                        <span className="text-[10px] text-slate-500">Select the correct answer(s)</span>
                    </div>

                    <div className="space-y-3">
                        {data.answers.map((a, i) => (
                            <div
                                key={i}
                                className={`flex items-stretch gap-2 sm:gap-3 p-2 rounded-xl border transition-all duration-200 ${a.is_correct
                                    ? "bg-emerald-500/10 border-emerald-500/30 shadow-sm shadow-emerald-500/5"
                                    : "bg-slate-950/50 border-slate-800/80 hover:border-slate-700"
                                    }`}
                            >
                                {/* MARK AS CORRECT TOGGLE */}
                                <button
                                    onClick={() => updateAnswer(i, { ...a, is_correct: !a.is_correct })}
                                    className={`flex items-center justify-center px-3 sm:px-4 rounded-lg transition-colors ${a.is_correct
                                        ? 'bg-emerald-500/20 text-emerald-400'
                                        : 'bg-slate-800 hover:bg-slate-700 text-slate-400'
                                        }`}
                                    title="Mark as correct answer"
                                >
                                    {a.is_correct ? <CheckCircle2 size={18} /> : <Circle size={18} />}
                                </button>

                                {/* INPUT */}
                                <input
                                    type="text"
                                    placeholder={`Answer Option ${String.fromCharCode(65 + i)}...`}
                                    value={a.answer_text}
                                    onChange={(e) =>
                                        updateAnswer(i, { ...a, answer_text: e.target.value })
                                    }
                                    className="flex-1 bg-transparent border-none px-2 py-2.5 text-sm text-white outline-none focus:ring-0 placeholder:text-slate-600"
                                />

                                {/* DELETE */}
                                <button
                                    onClick={() => removeAnswer(i)}
                                    className="px-3 text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors"
                                    title="Remove answer"
                                >
                                    <X size={16} />
                                </button>
                            </div>
                        ))}
                    </div>

                    {/* ADD ANSWER BUTTON */}
                    <div className="mt-4">
                        <button
                            onClick={addAnswer}
                            className="flex items-center gap-2 text-xs font-medium text-indigo-400 hover:text-indigo-300 hover:bg-indigo-500/10 px-3 py-2 rounded-lg transition-colors"
                        >
                            <Plus size={14} />
                            Add Option
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}