import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import ResultModal from "@/components/QuestionForm/ResultModal"
import { router } from "@inertiajs/react"

export default function Play({ quiz }: any) {
    const [current, setCurrent] = useState(0)
    const [answers, setAnswers] = useState<any[]>([])
    const [selected, setSelected] = useState<string | null>(null)
    const [loading, setLoading] = useState(false)

    const [showResult, setShowResult] = useState(false)
    const [finalResult, setFinalResult] = useState<any>(null)

    if (!quiz.questions.length) return null

    const question = quiz.questions[current]

    /* ================= SELECT ================= */
    const selectAnswer = (id: string) => {
        if (loading) return
        setSelected(id)
    }

    /* ================= NEXT ================= */
    const next = () => {
        if (!selected) return

        const updated = [
            ...answers,
            { question_id: question.id, answer_id: selected }
        ]

        setAnswers(updated)
        setSelected(null)

        if (current + 1 < quiz.questions.length) {
            setCurrent(current + 1)
        } else {
            submit(updated)
        }
    }

    /* ================= SUBMIT ================= */
    const submit = async (finalAnswers: any[]) => {
        setLoading(true)

        try {
            const csrf = document
                .querySelector('meta[name="csrf-token"]')
                ?.getAttribute('content')
            const formatted = Object.fromEntries(
                finalAnswers.map(a => [a.question_id, a.answer_id])
            )
            const res = await fetch(`/student/quiz/${quiz.id}/submit`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "X-CSRF-TOKEN": csrf || "",
                    Accept: "application/json"
                },
                credentials: "include",
                body: JSON.stringify({ answers: formatted })
            })

            const data = await res.json()

            setFinalResult(data.result)
            setShowResult(true)

        } catch {
            alert("Submit gagal")
        } finally {
            setLoading(false)
        }
    }

    const progress = ((current + 1) / quiz.questions.length) * 100

    return (
        <>
            <div className="min-h-screen bg-[#0b0f1a] flex items-center justify-center p-6 text-white">

                <div className="w-full max-w-3xl">

                    {/* HEADER */}
                    <div className="mb-6">
                        <div className="flex justify-between text-sm text-gray-400 mb-2">
                            <span>MISSION {current + 1}</span>
                            <span>{Math.round(progress)}%</span>
                        </div>

                        <div className="w-full h-2 bg-gray-800 rounded-full overflow-hidden">
                            <motion.div
                                className="h-full bg-blue-500"
                                initial={{ width: 0 }}
                                animate={{ width: `${progress}%` }}
                            />
                        </div>
                    </div>

                    {/* CARD */}
                    <div className="bg-[#111827] border border-[#1f2937] rounded-3xl p-8 shadow-2xl">

                        <AnimatePresence mode="wait">

                            <motion.div
                                key={question.id}
                                initial={{ opacity: 0, x: 50 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -50 }}
                                transition={{ duration: 0.3 }}
                            >

                                {/* IMAGE */}
                                {question.media_url && (
                                    <img
                                        src={question.media_url}
                                        className="w-full h-64 object-cover rounded-xl mb-6"
                                    />
                                )}

                                {/* QUESTION */}
                                <h2 className="text-2xl font-bold mb-6 leading-relaxed">
                                    {question.question_text}
                                </h2>

                                {/* ANSWERS */}
                                <div className="space-y-3">
                                    {question.answers.map((a: any) => (
                                        <motion.button
                                            whileTap={{ scale: 0.97 }}
                                            key={a.id}
                                            onClick={() => selectAnswer(a.id)}
                                            className={`w-full p-4 rounded-xl text-left border transition-all duration-200
                                            ${selected === a.id
                                                    ? "bg-blue-500 border-blue-400 text-white shadow-lg scale-[1.02]"
                                                    : "bg-[#0b1220] border-gray-700 hover:border-blue-400 hover:bg-[#0f172a]"
                                                }`}
                                        >
                                            {a.answer_text}
                                        </motion.button>
                                    ))}
                                </div>

                                {/* BUTTON */}
                                <motion.button
                                    whileTap={{ scale: 0.95 }}
                                    onClick={next}
                                    disabled={!selected || loading}
                                    className={`mt-6 w-full py-3 rounded-xl font-semibold transition
                                        ${!selected
                                            ? "bg-gray-700 text-gray-400 cursor-not-allowed"
                                            : "bg-blue-500 hover:bg-blue-600 text-white shadow-lg"}
                                    `}
                                >
                                    {loading
                                        ? "Processing..."
                                        : current + 1 === quiz.questions.length
                                            ? "Finish Mission"
                                            : "Next"}
                                </motion.button>

                            </motion.div>

                        </AnimatePresence>
                    </div>
                </div>
            </div>

            <ResultModal
                open={showResult}
                result={finalResult}
                onClose={() => router.visit(`/student/courses/${quiz.course_slug}`)}
            />
        </>
    )
}