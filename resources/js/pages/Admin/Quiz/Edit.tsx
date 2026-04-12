import { useEffect, useState } from "react"
import { router } from "@inertiajs/react"

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
        if (quiz) {
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
            if (!q.question_text) {
                alert("Question tidak boleh kosong")
                return false
            }

            if (q.answers.length < 2) {
                alert("Minimal 2 jawaban")
                return false
            }

            if (!q.answers.some((a) => a.is_correct)) {
                alert("Harus ada 1 jawaban benar")
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
            `/admin/quiz/${quiz.id}`,
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
        <div className="max-w-3xl mx-auto p-6">
            <h1 className="text-2xl font-bold mb-6">Edit Quiz</h1>

            {questions.map((q, i) => (
                <QuestionCard
                    key={i}
                    index={i}
                    data={q}
                    onChange={(data) => updateQuestion(i, data)}
                    onDelete={() => removeQuestion(i)}
                />
            ))}

            <button
                onClick={addQuestion}
                className="mt-4 px-4 py-2 bg-gray-200 rounded-lg"
            >
                + Add Question
            </button>

            <button
                onClick={submit}
                disabled={loading}
                className="mt-6 w-full bg-black text-white py-3 rounded-xl"
            >
                {loading ? "Updating..." : "Update Quiz"}
            </button>
        </div>
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
        <div className="border rounded-xl p-4 mb-6 shadow-sm">
            <div className="flex justify-between mb-3">
                <h2 className="font-semibold">
                    Question {index + 1}
                </h2>

                <button onClick={onDelete} className="text-red-500 text-sm">
                    Delete
                </button>
            </div>

            <input
                type="text"
                value={data.question_text}
                onChange={(e) =>
                    onChange({ ...data, question_text: e.target.value })
                }
                className="w-full mb-4 border p-2 rounded"
            />

            {data.answers.map((a, i) => (
                <div
                    key={i}
                    className={`flex gap-2 mb-2 p-2 rounded ${a.is_correct ? "bg-green-100" : ""
                        }`}
                >
                    <input
                        type="text"
                        value={a.answer_text}
                        onChange={(e) =>
                            updateAnswer(i, {
                                ...a,
                                answer_text: e.target.value,
                            })
                        }
                        className="flex-1 border p-2 rounded"
                    />

                    <input
                        type="checkbox"
                        checked={a.is_correct}
                        onChange={(e) =>
                            updateAnswer(i, {
                                ...a,
                                is_correct: e.target.checked,
                            })
                        }
                    />

                    <button
                        onClick={() => removeAnswer(i)}
                        className="text-red-500"
                    >
                        ✕
                    </button>
                </div>
            ))}

            <button
                onClick={addAnswer}
                className="text-sm text-blue-500"
            >
                + Add Answer
            </button>
        </div>
    )
}