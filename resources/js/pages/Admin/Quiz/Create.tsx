import { useState } from 'react';
import { router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import {
    ArrowLeft,
    Check,
    CheckCircle2,
    Circle,
    HelpCircle,
    Image as ImageIcon,
    Plus,
    Trash2,
    X,
} from 'lucide-react';
import ConfirmModal from '@/components/ui/ConfirmModal';

/* ================= TYPES ================= */

type Answer = {
    answer_text: string;
    is_correct: boolean;
};

type Question = {
    question_text: string;
    media_url?: string;
    media_file?: File;
    answers: Answer[];
};

/* ================= COMPONENT ================= */

export default function Create({
    pathId,
    quiz,
}: {
    pathId: string;
    quiz?: {
        id: string;
        difficulty: string;
        questions: Question[];
    } | null;
}) {
    const [questions, setQuestions] = useState<Question[]>(
        quiz?.questions ?? [],
    );
    const [loading, setLoading] = useState(false);
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

    /* ================= ACTIONS ================= */

    const addQuestion = () => {
        setQuestions([
            ...questions,
            {
                question_text: '',
                media_url: '',
                media_file: undefined,
                answers: [
                    { answer_text: '', is_correct: false },
                    { answer_text: '', is_correct: false },
                ],
            },
        ]);
    };

    const handleRemoveQuestion = (index: number) => {
        setConfirmModal({
            open: true,
            title: 'Hapus Pertanyaan',
            message: `Apakah Anda yakin ingin menghapus pertanyaan #${index + 1} beserta seluruh opsi jawabannya?`,
            confirmText: 'Hapus Pertanyaan',
            variant: 'danger',
            onConfirm: () => {
                setQuestions((prev) => prev.filter((_, i) => i !== index));
            },
        });
    };

    const updateQuestion = (index: number, data: Question) => {
        const newQuestions = [...questions];
        newQuestions[index] = data;
        setQuestions(newQuestions);
    };

    /* ================= VALIDATION ================= */

    const validate = () => {
        if (questions.length === 0) {
            alert('Minimal 1 question');
            return false;
        }

        for (let q of questions) {
            if (!q.question_text.trim()) {
                alert('Question tidak boleh kosong');
                return false;
            }

            if (q.answers.length < 2) {
                alert('Minimal 2 jawaban');
                return false;
            }

            let hasCorrect = false;
            for (let a of q.answers) {
                if (!a.answer_text.trim()) {
                    alert('Teks jawaban tidak boleh kosong');
                    return false;
                }
                if (a.is_correct) hasCorrect = true;
            }

            if (!hasCorrect) {
                alert(
                    'Harus ada setidaknya 1 jawaban benar untuk setiap pertanyaan',
                );
                return false;
            }
        }

        return true;
    };

    /* ================= SUBMIT (FORMDATA) ================= */

    const submit = () => {
        if (!validate()) return;

        setLoading(true);
        const formData = new FormData();

        formData.append('path_id', pathId);
        formData.append('difficulty', 'medium'); // Can be made dynamic later

        questions.forEach((q, i) => {
            formData.append(`questions[${i}][question_text]`, q.question_text);

            // MEDIA FILE
            if (q.media_file) {
                formData.append(`questions[${i}][media]`, q.media_file);
            }

            q.answers.forEach((a, j) => {
                formData.append(
                    `questions[${i}][answers][${j}][answer_text]`,
                    a.answer_text,
                );
                formData.append(
                    `questions[${i}][answers][${j}][is_correct]`,
                    a.is_correct ? '1' : '0',
                );
            });
        });

        router.post(`/admin/paths/${pathId}/quiz`, formData, {
            forceFormData: true,
            onFinish: () => setLoading(false),
        });
    };

    /* ================= UI ================= */

    return (
        <AppLayout>
            <div className="min-h-screen bg-slate-50 p-4 text-slate-800 sm:p-6 lg:p-8 dark:bg-gradient-to-br dark:from-[#020617] dark:via-[#020617] dark:to-black dark:text-white">
                <div className="mx-auto w-full space-y-6 sm:space-y-8">
                    {/* HEADER */}
                    <header
                        className="relative w-full overflow-hidden rounded-xl border border-slate-200 bg-white px-6 py-5 shadow-sm backdrop-blur-xl dark:border-slate-800/60 dark:bg-slate-900/50 dark:shadow-lg"
                        style={{
                            backgroundImage: `
                                linear-gradient(rgba(148,163,184,0.05) 1px, transparent 1px),
                                linear-gradient(90deg, rgba(148,163,184,0.05) 1px, transparent 1px)
                            `,
                            backgroundSize: '40px 40px',
                        }}
                    >
                        {/* Corner brackets */}
                        <span className="absolute top-3.5 left-3.5 h-3 w-3 border-t border-l border-slate-300 dark:border-slate-700" />
                        <span className="absolute top-3.5 right-3.5 h-3 w-3 border-t border-r border-slate-300 dark:border-slate-700" />
                        <span className="absolute bottom-3.5 left-3.5 h-3 w-3 border-b border-l border-slate-300 dark:border-slate-700" />
                        <span className="absolute right-3.5 bottom-3.5 h-3 w-3 border-r border-b border-slate-300 dark:border-slate-700" />

                        <div className="relative z-10 flex flex-col gap-2">
                            <button
                                onClick={() => window.history.back()}
                                className="mb-2 flex w-fit cursor-pointer items-center gap-2 text-sm font-medium text-slate-500 transition-colors hover:text-slate-800 dark:text-slate-400 dark:hover:text-white"
                            >
                                <ArrowLeft size={16} /> Back
                            </button>

                            {/* Badge */}
                            <div className="inline-flex w-fit items-center gap-1.5 rounded border border-indigo-500/20 bg-indigo-500/10 px-2.5 py-1 dark:border-indigo-500/30">
                                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-indigo-500 dark:bg-indigo-400" />
                                <span className="text-indigo-650 text-[10px] font-bold tracking-[0.12em] uppercase dark:text-indigo-400">
                                    Quiz Builder
                                </span>
                            </div>

                            <h1 className="text-2xl font-bold text-slate-800 sm:text-3xl dark:text-white">
                                Create Quiz
                            </h1>
                            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                                Add questions, answers, and media to construct
                                your quiz.
                            </p>
                        </div>
                    </header>

                    {/* QUESTIONS LIST */}
                    <div className="space-y-6">
                        {questions.length === 0 ? (
                            <div className="border-slate-305 flex flex-col items-center justify-center rounded-2xl border-2 border-dashed bg-white p-12 text-center shadow-sm dark:border-slate-800/60 dark:bg-slate-900/20">
                                <HelpCircle
                                    size={48}
                                    className="dark:text-slate-655 mb-4 text-slate-400 opacity-50"
                                />
                                <h3 className="text-slate-750 mb-1 text-lg font-medium dark:text-slate-300">
                                    No questions yet
                                </h3>
                                <p className="mb-6 text-sm text-slate-500">
                                    Start building your quiz by adding the first
                                    question.
                                </p>
                                <button
                                    onClick={addQuestion}
                                    className="flex cursor-pointer items-center gap-2 rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-medium text-white shadow-lg shadow-indigo-500/20 transition-all hover:bg-indigo-500"
                                >
                                    + Add First Question
                                </button>
                            </div>
                        ) : (
                            questions.map((q, i) => (
                                <QuestionCard
                                    key={i}
                                    index={i}
                                    data={q}
                                    onChange={(data) => updateQuestion(i, data)}
                                    onDelete={() => handleRemoveQuestion(i)}
                                />
                            ))
                        )}
                    </div>

                    {/* ACTIONS */}
                    {questions.length > 0 && (
                        <div className="flex flex-col items-center justify-between gap-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm backdrop-blur-xl sm:flex-row dark:border-slate-800/60 dark:bg-slate-900/50 dark:shadow-lg">
                            <button
                                onClick={addQuestion}
                                className="text-slate-650 flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl border border-slate-300 bg-slate-50 px-5 py-2.5 text-sm font-medium transition-colors hover:bg-slate-100 hover:text-slate-800 sm:w-auto dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700 dark:hover:text-white"
                            >
                                <Plus size={16} />
                                Add Another Question
                            </button>

                            <button
                                onClick={submit}
                                disabled={loading}
                                className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-indigo-600 px-8 py-2.5 text-sm font-medium text-white shadow-lg shadow-indigo-500/20 transition-colors hover:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
                            >
                                {loading ? (
                                    <>
                                        <svg
                                            className="h-4 w-4 animate-spin text-white"
                                            xmlns="http://www.w3.org/2000/svg"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                        >
                                            <circle
                                                className="opacity-25"
                                                cx="12"
                                                cy="12"
                                                r="10"
                                                stroke="currentColor"
                                                strokeWidth="4"
                                            ></circle>
                                            <path
                                                className="opacity-75"
                                                fill="currentColor"
                                                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                            ></path>
                                        </svg>
                                        Saving...
                                    </>
                                ) : (
                                    <>
                                        <Check size={16} />
                                        Save Quiz
                                    </>
                                )}
                            </button>
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

/* ================= QUESTION CARD ================= */

function QuestionCard({
    index,
    data,
    onChange,
    onDelete,
}: {
    index: number;
    data: Question;
    onChange: (data: Question) => void;
    onDelete: () => void;
}) {
    const updateAnswer = (i: number, answer: Answer) => {
        const newAnswers = [...data.answers];
        newAnswers[i] = answer;
        onChange({ ...data, answers: newAnswers });
    };

    const addAnswer = () => {
        onChange({
            ...data,
            answers: [...data.answers, { answer_text: '', is_correct: false }],
        });
    };

    const removeAnswer = (i: number) => {
        const newAnswers = data.answers.filter((_, idx) => idx !== i);
        onChange({ ...data, answers: newAnswers });
    };

    return (
        <div className="overflow-hidden rounded-2xl border border-slate-300 bg-white shadow-sm backdrop-blur-md transition-all duration-300 hover:border-slate-400 dark:border-slate-800/80 dark:bg-slate-900/40 dark:shadow-xl dark:hover:border-slate-700/80">
            {/* HEADER */}
            <div className="flex items-center justify-between border-b border-slate-200 bg-slate-50 p-4 dark:border-slate-800/60 dark:bg-slate-950/50">
                <div className="flex items-center gap-3">
                    <span className="text-indigo-650 flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-500/10 text-sm font-bold dark:text-indigo-400">
                        {index + 1}
                    </span>
                    <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                        Question Configuration
                    </span>
                </div>
                <button
                    onClick={onDelete}
                    className="cursor-pointer rounded-lg p-2 text-slate-400 transition-colors hover:bg-rose-50 hover:text-rose-600 dark:text-slate-500 dark:hover:bg-rose-500/10 dark:hover:text-rose-400"
                    title="Delete Question"
                >
                    <Trash2 size={16} />
                </button>
            </div>

            <div className="space-y-6 p-5 sm:p-6">
                {/* QUESTION TEXT */}
                <div>
                    <label className="mb-1.5 ml-1 block text-xs font-semibold text-slate-500 dark:text-slate-400">
                        Question Text
                    </label>
                    <textarea
                        placeholder="e.g. What is the core feature of React?"
                        value={data.question_text}
                        onChange={(e) =>
                            onChange({ ...data, question_text: e.target.value })
                        }
                        rows={3}
                        className="w-full resize-y rounded-xl border border-slate-300 bg-slate-50 px-4 py-3 text-sm text-slate-800 transition-all outline-none placeholder:text-slate-400 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 dark:border-slate-800 dark:bg-slate-950/50 dark:text-white dark:placeholder:text-slate-600"
                    />
                </div>

                {/* IMAGE UPLOAD */}
                <div>
                    <label className="text-slate-550 mb-1.5 ml-1 block text-xs font-semibold dark:text-slate-400">
                        Attach Media (Optional)
                    </label>
                    <div className="flex items-start gap-4">
                        <label className="text-slate-655 group flex w-fit cursor-pointer items-center gap-2 rounded-xl border border-slate-300 bg-slate-50 px-4 py-2.5 text-sm transition-colors hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-800/50 dark:text-slate-300 dark:hover:bg-slate-700">
                            <ImageIcon
                                size={16}
                                className="text-slate-400 transition-colors group-hover:text-indigo-500 dark:group-hover:text-indigo-400"
                            />
                            <span>Choose Image</span>
                            <input
                                type="file"
                                accept="image/*"
                                onChange={(e) => {
                                    const file = e.target.files?.[0];
                                    if (!file) return;

                                    onChange({
                                        ...data,
                                        media_file: file,
                                        media_url: URL.createObjectURL(file),
                                    });
                                }}
                                className="hidden"
                            />
                        </label>
                        {data.media_file && (
                            <span className="text-slate-550 max-w-[200px] truncate py-2.5 text-sm sm:max-w-xs dark:text-slate-400">
                                {data.media_file.name}
                            </span>
                        )}
                        {data.media_url && (
                            <button
                                onClick={() =>
                                    onChange({
                                        ...data,
                                        media_file: undefined,
                                        media_url: undefined,
                                    })
                                }
                                className="ml-auto cursor-pointer rounded-xl p-2.5 text-rose-500 transition-colors hover:bg-rose-500/10"
                                title="Remove Image"
                            >
                                <X size={16} />
                            </button>
                        )}
                    </div>

                    {/* PREVIEW */}
                    {data.media_url && (
                        <div className="mt-4 flex justify-center rounded-xl border border-slate-200 bg-slate-100 p-4 dark:border-slate-800/50 dark:bg-black/40">
                            <img
                                src={data.media_url}
                                className="h-auto max-h-48 max-w-full rounded-lg object-contain shadow-sm"
                                alt="Question attached media preview"
                            />
                        </div>
                    )}
                </div>

                {/* ANSWERS */}
                <div className="border-t border-slate-200 pt-4 dark:border-slate-800/60">
                    <div className="mb-4 flex items-center justify-between">
                        <label className="text-slate-550 ml-1 block text-xs font-semibold dark:text-slate-400">
                            Possible Answers
                        </label>
                        <span className="text-[10px] text-slate-400 dark:text-slate-500">
                            Select the correct answer(s)
                        </span>
                    </div>

                    <div className="space-y-3">
                        {data.answers.map((a, i) => (
                            <div
                                key={i}
                                className={`flex items-stretch gap-2 rounded-xl border p-2 transition-all duration-200 sm:gap-3 ${
                                    a.is_correct
                                        ? 'border-emerald-500/30 bg-emerald-500/5 shadow-sm shadow-emerald-500/5 dark:border-emerald-500/40 dark:bg-emerald-500/10'
                                        : 'border-slate-300 bg-slate-50 hover:border-slate-400 dark:border-slate-800/80 dark:bg-slate-950/50 dark:hover:border-slate-700'
                                }`}
                            >
                                {/* MARK AS CORRECT TOGGLE */}
                                <button
                                    onClick={() =>
                                        updateAnswer(i, {
                                            ...a,
                                            is_correct: !a.is_correct,
                                        })
                                    }
                                    className={`flex items-center justify-center rounded-lg px-3 transition-colors sm:px-4 ${
                                        a.is_correct
                                            ? 'bg-emerald-500/10 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400'
                                            : 'dark:bg-slate-805 bg-slate-200/60 text-slate-400 hover:bg-slate-300/80 dark:hover:bg-slate-700'
                                    }`}
                                    title="Mark as correct answer"
                                >
                                    {a.is_correct ? (
                                        <CheckCircle2 size={18} />
                                    ) : (
                                        <Circle size={18} />
                                    )}
                                </button>

                                {/* INPUT */}
                                <input
                                    type="text"
                                    placeholder={`Answer Option ${String.fromCharCode(65 + i)}...`}
                                    value={a.answer_text}
                                    onChange={(e) =>
                                        updateAnswer(i, {
                                            ...a,
                                            answer_text: e.target.value,
                                        })
                                    }
                                    className="placeholder:text-slate-450 flex-1 border-none bg-transparent px-2 py-2.5 text-sm text-slate-800 outline-none focus:ring-0 dark:text-white dark:placeholder:text-slate-600"
                                />

                                {/* DELETE */}
                                <button
                                    onClick={() => removeAnswer(i)}
                                    className="dark:text-slate-550 hover:text-rose-650 cursor-pointer rounded-lg px-3 text-slate-400 transition-colors hover:bg-rose-50 dark:hover:bg-rose-500/10 dark:hover:text-rose-400"
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
                            className="text-indigo-650 hover:text-indigo-750 flex cursor-pointer items-center gap-2 rounded-lg px-3 py-2 text-xs font-semibold transition-colors hover:bg-indigo-50 dark:text-indigo-400 dark:hover:bg-indigo-500/10 dark:hover:text-indigo-300"
                        >
                            <Plus size={14} />
                            Add Option
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
