import { useState } from "react"
import { router } from "@inertiajs/react"
import AppLayout from "@/layouts/app-layout"

/* ================= TYPES ================= */

type Answer = {
    answer_text: string
    is_correct: boolean
}

type Question = {
    question_text: string
    media_url?: string
    media_file?: File
    answers: Answer[]
}

/* ================= COMPONENT ================= */

export default function Create({ moduleId }: { moduleId: string }) {
    const [questions, setQuestions] = useState<Question[]>([])
    const [loading, setLoading] = useState(false)

    /* ================= ACTIONS ================= */

    const addQuestion = () => {
        setQuestions([
            ...questions,
            {
                question_text: "",
                media_url: "",
                media_file: undefined,
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

    /* ================= SUBMIT (FORMDATA) ================= */

    const submit = () => {
        if (!validate()) return

        const formData = new FormData()

        formData.append("module_id", moduleId)
        formData.append("difficulty", "medium")

        questions.forEach((q, i) => {
            formData.append(`questions[${i}][question_text]`, q.question_text)

            // 🔥 INI KUNCI
            if (q.media_file) {
                formData.append(`questions[${i}][media]`, q.media_file)
            }

            q.answers.forEach((a, j) => {
                formData.append(`questions[${i}][answers][${j}][answer_text]`, a.answer_text)
                formData.append(`questions[${i}][answers][${j}][is_correct]`, a.is_correct ? "1" : "0")
            })
        })

        router.post("/admin/quiz", formData, {
            forceFormData: true
        })
    }

    /* ================= UI ================= */

    return (
        <AppLayout>
            <div className="max-w-3xl mx-auto p-6">
                <h1 className="text-2xl font-bold mb-6">Create Quiz</h1>

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
                    {loading ? "Saving..." : "Save Quiz"}
                </button>
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
        <div className="border rounded-xl p-4 mb-6 shadow-sm">

            {/* HEADER */}
            <div className="flex justify-between items-center mb-3">
                <h2 className="font-semibold">
                    Question {index + 1}
                </h2>

                <button onClick={onDelete} className="text-red-500 text-sm">
                    Delete
                </button>
            </div>

            {/* 🔥 IMAGE UPLOAD */}
            <input
                type="file"
                accept="image/*"
                onChange={(e) => {
                    const file = e.target.files?.[0]
                    if (!file) return

                    onChange({
                        ...data,
                        media_file: file,
                        media_url: URL.createObjectURL(file)
                    })
                }}
                className="mb-3"
            />

            {/* 🔥 PREVIEW */}
            {data.media_url && (
                <img
                    src={data.media_url}
                    className="w-full max-h-60 object-cover rounded mb-3"
                />
            )}

            {/* QUESTION */}
            <input
                type="text"
                placeholder="Enter question..."
                value={data.question_text}
                onChange={(e) =>
                    onChange({ ...data, question_text: e.target.value })
                }
                className="w-full mb-4 border p-2 rounded"
            />

            {/* ANSWERS */}
            {data.answers.map((a, i) => (
                <div
                    key={i}
                    className={`flex items-center gap-2 mb-2 p-2 rounded ${a.is_correct ? "bg-green-100" : ""
                        }`}
                >
                    <input
                        type="text"
                        placeholder="Answer..."
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
                        className="text-red-500 text-sm"
                    >
                        ✕
                    </button>
                </div>
            ))}

            <button onClick={addAnswer} className="mt-2 text-sm text-blue-500">
                + Add Answer
            </button>

        </div>
    )
}