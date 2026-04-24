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

export default function Create({ pathId }: { pathId: string }) {
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

        formData.append("path_id", pathId)
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

        router.post(`/admin/paths/${pathId}/quiz`, formData, {
            forceFormData: true
        })
    }

    /* ================= UI ================= */

    return (
       <AppLayout>
    <div className="max-w-4xl mx-auto p-6">

        {/* Header */}
        <div className="mb-6">
            <h1 className="text-2xl font-semibold text-gray-800 dark:text-white">
                Create Quiz
            </h1>
            <p className="text-sm text-gray-500 dark:text-slate-400">
                Add and manage your quiz questions
            </p>
        </div>

        {/* Container */}
        <div className="rounded-2xl border border-gray-200 dark:border-slate-700 
            bg-white dark:bg-slate-900 overflow-hidden">

            {/* Header */}
            <div className="grid grid-cols-12 px-5 py-3 
                bg-gray-50 dark:bg-slate-800/60 
                text-xs font-semibold tracking-wide 
                text-gray-500 dark:text-slate-400 uppercase">

                <div className="col-span-1">No</div>
                <div className="col-span-9">Question</div>
                <div className="col-span-2 text-right">Action</div>
            </div>

            {/* Rows */}
            <div>

                {questions.map((q, i) => (
                    <div
                        key={i}
                        className="grid grid-cols-12 items-start px-5 py-5 
                        border-t border-gray-100 dark:border-slate-800"
                    >

                        {/* Number (badge style biar ga kaku) */}
                        <div className="col-span-1">
                            <span className="text-xs px-2 py-1 rounded-md 
                                bg-gray-100 dark:bg-slate-800 
                                text-gray-600 dark:text-slate-400">
                                {i + 1}
                            </span>
                        </div>

                        {/* Question */}
                        <div className="col-span-9">
                            <QuestionCard
                                index={i}
                                data={q}
                                onChange={(data) => updateQuestion(i, data)}
                                onDelete={() => removeQuestion(i)}
                            />
                        </div>

                        {/* Action */}
                        <div className="col-span-2 text-right">
                            <button
                                onClick={() => removeQuestion(i)}
                                className="px-3 py-1 rounded-md text-sm 
                                bg-red-50 dark:bg-red-500/10 
                                text-red-600 dark:text-red-400"
                            >
                                Delete
                            </button>
                        </div>

                    </div>
                ))}

            </div>

        </div>

        {/* Footer */}
        <div className="flex justify-between items-center mt-6">

            <button
                onClick={addQuestion}
                className="px-4 py-2 rounded-lg 
                bg-gray-100 dark:bg-slate-800 
                text-gray-700 dark:text-slate-300 
                border border-gray-200 dark:border-slate-700"
            >
                + Add Question
            </button>

            <button
                onClick={submit}
                disabled={loading}
                className="px-6 py-3 rounded-lg 
                bg-indigo-600 dark:bg-indigo-500 
                text-white 
                border border-indigo-600 dark:border-indigo-500 
                disabled:opacity-40"
            >
                {loading ? "Saving..." : "Save Quiz"}
            </button>

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
<div className="border border-gray-200 dark:border-slate-700 
    rounded-2xl p-6 mb-6 
    bg-white dark:bg-slate-900">

    {/* HEADER */}
    <div className="flex justify-between items-center mb-5">

        <span className="text-sm font-medium px-3 py-1 rounded-md 
            bg-gray-100 dark:bg-slate-800 
            text-gray-700 dark:text-slate-300">
            Question {index + 1}
        </span>
    </div>

    {/* IMAGE UPLOAD */}
    <div className="mb-5">
        <label className="flex items-center gap-3 px-4 py-2 rounded-lg 
            border border-gray-200 dark:border-slate-700
            bg-gray-50 dark:bg-slate-800 
            text-sm text-gray-600 dark:text-slate-300 w-fit cursor-pointer">

            <span className="px-3 py-1 rounded-md 
                bg-indigo-600 dark:bg-indigo-500 
                text-white text-xs">
                Choose Image
            </span>

            <span>
                {data.media_file ? data.media_file.name : "No file selected"}
            </span>

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
                className="hidden"
            />
        </label>
    </div>

    {/* PREVIEW */}
    {data.media_url && (
        <img
            src={data.media_url}
            className="w-full max-h-64 object-cover rounded-lg mb-5"
        />
    )}

    {/* QUESTION (FULL WIDTH & LEBAR) */}
    <textarea
        placeholder="Enter question..."
        value={data.question_text}
        onChange={(e) =>
            onChange({ ...data, question_text: e.target.value })
        }
        rows={3}
        className="w-full mb-6 px-4 py-3 rounded-lg 
        border border-gray-200 dark:border-slate-700 
        bg-white dark:bg-slate-900 
        text-gray-800 dark:text-white"
    />

    {/* ANSWERS */}
    <div className="space-y-4">

        {data.answers.map((a, i) => (
            <div
                key={i}
                className={`flex items-center gap-4 p-4 rounded-lg border 
                ${a.is_correct
                    ? "bg-green-50 dark:bg-green-500/10 border-green-200 dark:border-green-500/20"
                    : "bg-gray-50 dark:bg-slate-800 border-gray-200 dark:border-slate-700"
                }`}
            >

                {/* LABEL (A,B,C,...) */}
                <div className="w-6 text-sm font-medium text-gray-500 dark:text-slate-400">
                    {String.fromCharCode(65 + i)}
                </div>

                {/* INPUT FULL WIDTH */}
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
                    className="flex-1 px-3 py-2 rounded-md 
                    border border-gray-200 dark:border-slate-700 
                    bg-white dark:bg-slate-900 
                    text-gray-800 dark:text-white"
                />

                {/* CHECK */}
                <input
                    type="checkbox"
                    checked={a.is_correct}
                    onChange={(e) =>
                        updateAnswer(i, {
                            ...a,
                            is_correct: e.target.checked,
                        })
                    }
                    className="w-4 h-4"
                />

                {/* DELETE */}
                <button
                    onClick={() => removeAnswer(i)}
                    className="text-red-500 text-sm px-2"
                >
                    ✕
                </button>

            </div>
        ))}

    </div>

    {/* ADD ANSWER */}
    <div className="mt-5">
        <button
            onClick={addAnswer}
            className="text-sm px-4 py-2 rounded-md 
            bg-gray-100 dark:bg-slate-800 
            text-gray-700 dark:text-slate-300"
        >
            + Add Answer
        </button>
    </div>

</div>
    )
}