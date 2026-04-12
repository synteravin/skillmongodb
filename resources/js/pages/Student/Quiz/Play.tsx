import { useState } from "react"
import ResultModal from "@/components/QuestionForm/ResultModal"
import { router } from "@inertiajs/react"

type Answer = {
    id: string
    answer_text: string
}

type Question = {
    id: string
    question_text: string
    media_url?: string
    answers: Answer[]
}

export default function Play({
    quiz
}: {
    quiz: {
        id: string
        questions: Question[]
    }
}) {
    const [current, setCurrent] = useState(0)
    const [answers, setAnswers] = useState<any[]>([])
    const [selected, setSelected] = useState<string | null>(null)
    const [loading, setLoading] = useState(false)

    const [showResult, setShowResult] = useState(false)
    const [finalResult, setFinalResult] = useState<{
        score: number
        passed: boolean
    } | null>(null)

    /* ================= GUARD ================= */

    if (!quiz.questions.length) {
        return (
            <div className="p-6 text-center text-gray-500">
                No questions available
            </div>
        )
    }

    const question = quiz.questions[current]

    /* ================= SELECT ================= */

    const selectAnswer = (answerId: string) => {
        if (loading) return
        setSelected(answerId)
    }

    /* ================= NEXT ================= */

    const next = () => {
        if (!selected) return

        const newAnswers = [
            ...answers,
            {
                question_id: question.id,
                answer_id: selected
            }
        ]

        setAnswers(newAnswers)
        setSelected(null)

        if (current + 1 < quiz.questions.length) {
            setCurrent(current + 1)
        } else {
            submit(newAnswers)
        }
    }

    /* ================= SUBMIT ================= */

    const submit = async (finalAnswers: any[]) => {
        setLoading(true)

        try {
            const csrf = document
                .querySelector('meta[name="csrf-token"]')
                ?.getAttribute('content')

            const res = await fetch(`/student/quiz/${quiz.id}/submit`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "X-CSRF-TOKEN": csrf || "",
                    "Accept": "application/json"
                },
                credentials: "include",
                body: JSON.stringify({
                    answers: finalAnswers
                })
            })

            if (!res.ok) {
                throw new Error("Submit failed")
            }

            const data = await res.json()

            setFinalResult(data.result)
            setShowResult(true)

            // 🔥 INI YANG LO TAMBAHIN
            if (data.message) {
                console.log(data.message)
            }

        } catch (err) {
            console.error(err)
            alert("Gagal submit quiz")
        } finally {
            setLoading(false)
        }
    }

    /* ================= RESET ================= */

    const resetQuiz = () => {
        setShowResult(false)
        setCurrent(0)
        setAnswers([])
        setSelected(null)
        setFinalResult(null)
    }

    /* ================= UI ================= */

    return (
        <>
            <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-6">

                <div className="w-full max-w-2xl">

                    {/* PROGRESS */}
                    <div className="mb-4">
                        <div className="flex justify-between text-sm text-gray-500 mb-1">
                            <span>
                                Question {current + 1} / {quiz.questions.length}
                            </span>
                            <span>
                                {Math.round(((current + 1) / quiz.questions.length) * 100)}%
                            </span>
                        </div>

                        <div className="w-full bg-gray-200 h-2 rounded-full">
                            <div
                                className="bg-black h-2 rounded-full transition-all"
                                style={{
                                    width: `${((current + 1) / quiz.questions.length) * 100}%`
                                }}
                            />
                        </div>
                    </div>

                    {/* CARD */}
                    <div className="bg-white shadow-2xl rounded-3xl p-8 border border-gray-100">

                        {/* IMAGE */}
                        {question.media_url && (
                            <img
                                src={question.media_url}
                                className="w-full h-60 object-cover rounded-xl mb-5"
                            />
                        )}

                        {/* QUESTION */}
                        <h2 className="text-xl font-semibold mb-6 text-gray-800">
                            {question.question_text}
                        </h2>

                        {/* ANSWERS */}
                        <div className="flex flex-col gap-3">
                            {question.answers.map((a) => (
                                <button
                                    key={a.id}
                                    onClick={() => selectAnswer(a.id)}
                                    disabled={loading}
                                    className={`p-4 rounded-xl border text-left transition-all duration-200
                                        ${selected === a.id
                                            ? "bg-black text-white border-black scale-[1.02]"
                                            : "hover:bg-gray-100 border-gray-200"
                                        }
                                    `}
                                >
                                    {a.answer_text}
                                </button>
                            ))}
                        </div>

                        {/* BUTTON */}
                        <button
                            onClick={next}
                            disabled={loading || !selected}
                            className={`mt-6 w-full py-3 rounded-xl font-medium transition
                                ${loading || !selected
                                    ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                                    : "bg-black text-white hover:opacity-90"
                                }
                            `}
                        >
                            {loading
                                ? "Submitting..."
                                : current + 1 === quiz.questions.length
                                    ? "Submit"
                                    : "Next"}
                        </button>
                    </div>
                </div>
            </div>

            {/* RESULT MODAL */}
            <ResultModal
                open={showResult}
                result={finalResult}
                onClose={() => router.visit(document.referrer)}
            />
        </>
    )
}