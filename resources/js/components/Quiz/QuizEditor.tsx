import React, { useState, useEffect } from 'react';
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
    Clock,
    AlertCircle,
    Loader2,
} from 'lucide-react';
import ConfirmModal from '@/components/ui/ConfirmModal';

/* ================= TYPES ================= */

export type Answer = {
    answer_text: string;
    is_correct: boolean;
};

export type Question = {
    id?: string;
    question_text: string;
    media_url?: string;
    media_file?: File;
    answers: Answer[];
};

export interface QuizEditorProps {
    mode: 'create' | 'edit';
    role: 'admin' | 'mentor';
    pathId?: string;
    initialDifficulty?: string;
    initialDuration?: number;
    initialQuestions?: Question[];
    submitUrl: string;
    backUrl?: string;
}

const OPTION_LETTERS = ['A', 'B', 'C', 'D', 'E', 'F'];

export default function QuizEditor({
    mode,
    role,
    pathId,
    initialDifficulty = 'medium',
    initialDuration = 15,
    initialQuestions,
    submitUrl,
    backUrl,
}: QuizEditorProps) {
    const [difficulty, setDifficulty] = useState<string>(initialDifficulty);
    const [duration, setDuration] = useState<number>(initialDuration);
    const [questions, setQuestions] = useState<Question[]>(
        initialQuestions && initialQuestions.length > 0
            ? initialQuestions
            : [
                  {
                      question_text: '',
                      media_url: '',
                      media_file: undefined,
                      answers: [
                          { answer_text: '', is_correct: false },
                          { answer_text: '', is_correct: false },
                          { answer_text: '', is_correct: false },
                          { answer_text: '', is_correct: false },
                      ],
                  },
              ],
    );

    useEffect(() => {
        if (initialQuestions && initialQuestions.length > 0) {
            setQuestions(initialQuestions);
        }
        if (initialDuration) {
            setDuration(initialDuration);
        }
        if (initialDifficulty) {
            setDifficulty(initialDifficulty);
        }
    }, [initialQuestions, initialDuration, initialDifficulty]);

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
        confirmText: 'Konfirmasi',
        variant: 'danger',
        onConfirm: () => {},
    });

    /* ================= ACTIONS ================= */

    const addQuestion = () => {
        setQuestions((prev) => [
            ...prev,
            {
                question_text: '',
                media_url: '',
                media_file: undefined,
                answers: [
                    { answer_text: '', is_correct: false },
                    { answer_text: '', is_correct: false },
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
            message: `Apakah Anda yakin ingin menghapus pertanyaan #${index + 1}? Tindakan ini tidak dapat dibatalkan.`,
            confirmText: 'Hapus Pertanyaan',
            variant: 'danger',
            onConfirm: () => {
                setQuestions((prev) => prev.filter((_, i) => i !== index));
            },
        });
    };

    const updateQuestion = (index: number, data: Question) => {
        setQuestions((prev) => {
            const next = [...prev];
            next[index] = data;
            return next;
        });
    };

    /* ================= VALIDATION ================= */

    const isQuestionValid = (q: Question) => {
        if (!q.question_text.trim()) return false;
        if (q.answers.length < 2) return false;
        if (q.answers.some((a) => !a.answer_text.trim())) return false;
        if (!q.answers.some((a) => a.is_correct)) return false;
        return true;
    };

    const validQuestionsCount = questions.filter(isQuestionValid).length;
    const allQuestionsValid =
        questions.length > 0 && validQuestionsCount === questions.length;

    const validate = () => {
        if (questions.length === 0) {
            alert('Minimal harus ada 1 pertanyaan pada kuis.');
            return false;
        }

        for (let i = 0; i < questions.length; i++) {
            const q = questions[i];
            if (!q.question_text.trim()) {
                alert(`Pertanyaan #${i + 1} belum memiliki teks pertanyaan.`);
                return false;
            }

            if (q.answers.length < 2) {
                alert(`Pertanyaan #${i + 1} minimal harus memiliki 2 pilihan jawaban.`);
                return false;
            }

            for (let j = 0; j < q.answers.length; j++) {
                if (!q.answers[j].answer_text.trim()) {
                    alert(
                        `Pertanyaan #${i + 1}, opsi jawaban ${OPTION_LETTERS[j] || j + 1} masih kosong.`,
                    );
                    return false;
                }
            }

            const hasCorrect = q.answers.some((a) => a.is_correct);
            if (!hasCorrect) {
                alert(
                    `Pertanyaan #${i + 1} belum memiliki kunci jawaban yang benar. Silakan centang minimal satu opsi jawaban benar.`,
                );
                return false;
            }
        }

        return true;
    };

    /* ================= SUBMIT ================= */

    const submit = () => {
        if (!validate()) return;

        setLoading(true);
        const formData = new FormData();

        if (mode === 'edit') {
            formData.append('_method', 'PUT');
        }

        if (pathId) {
            formData.append('path_id', pathId);
        }
        formData.append('difficulty', difficulty.toLowerCase());
        formData.append('duration', String(duration));

        questions.forEach((q, i) => {
            if (q.id) {
                formData.append(`questions[${i}][id]`, q.id);
            }
            formData.append(`questions[${i}][question_text]`, q.question_text);

            if (q.media_file) {
                formData.append(`questions[${i}][media]`, q.media_file);
            } else if (q.media_url) {
                formData.append(`questions[${i}][media_url]`, q.media_url);
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

        router.post(submitUrl, formData, {
            forceFormData: true,
            onFinish: () => setLoading(false),
        });
    };

    return (
        <AppLayout>
            <div
                className="min-h-screen bg-transparent px-4 py-8 text-slate-800 transition-colors duration-200 sm:px-6 lg:px-8 dark:bg-transparent dark:text-white"
                style={{ fontFamily: "'Outfit', sans-serif" }}
            >
                <div className="mx-auto w-full max-w-5xl space-y-6">
                    {/* ================= HEADER HERO ================= */}
                    <header
                        className="relative w-full overflow-hidden rounded-2xl border border-slate-200 bg-white/80 p-6 shadow-sm backdrop-blur-xl dark:border-white/5 dark:bg-[#0d0f17]"
                        style={{
                            backgroundImage: `
                                radial-gradient(circle at top right, rgba(124, 92, 255, 0.12), transparent 70%),
                                radial-gradient(circle at bottom left, rgba(56, 189, 248, 0.05), transparent 60%)
                            `,
                        }}
                    >
                        {/* Top Gradient Line */}
                        <div className="absolute top-0 right-0 left-0 h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500" />

                        <div className="relative z-10 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                            <div className="flex items-start gap-4">
                                <button
                                    type="button"
                                    onClick={() => {
                                        if (backUrl) {
                                            router.get(backUrl);
                                        } else {
                                            window.history.back();
                                        }
                                    }}
                                    className="mt-1 flex h-10 w-10 shrink-0 cursor-pointer items-center justify-center rounded-xl border border-slate-200 bg-slate-50 text-slate-500 transition-all hover:border-indigo-300 hover:bg-white hover:text-indigo-600 active:scale-95 dark:border-slate-800 dark:bg-slate-900/80 dark:text-slate-400 dark:hover:border-indigo-500/50 dark:hover:bg-slate-800 dark:hover:text-white"
                                    title="Kembali"
                                >
                                    <ArrowLeft size={18} />
                                </button>

                                <div className="space-y-1.5">
                                    <div className="flex flex-wrap items-center gap-2">
                                        <div className="inline-flex items-center gap-1.5 rounded-full border border-indigo-500/20 bg-indigo-500/10 px-2.5 py-0.5 text-[10px] font-bold tracking-[0.1em] text-indigo-600 uppercase dark:text-indigo-400">
                                            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-indigo-500" />
                                            <span>Final Quiz Builder</span>
                                        </div>

                                        <span className="rounded-full border border-slate-200 bg-slate-100 px-2.5 py-0.5 text-xs font-semibold text-slate-700 dark:border-slate-800 dark:bg-slate-900/70 dark:text-slate-300">
                                            {mode === 'create'
                                                ? 'Pembuatan Kuis Baru'
                                                : 'Mode Edit Kuis'}
                                        </span>
                                    </div>

                                    <h1
                                        className="m-0 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl dark:text-white"
                                        style={{
                                            fontFamily: 'Orbitron, sans-serif',
                                        }}
                                    >
                                        {mode === 'create'
                                            ? 'Buat Final Quiz'
                                            : 'Edit Final Quiz'}
                                    </h1>

                                    <p className="max-w-2xl text-xs text-slate-500 sm:text-sm dark:text-slate-400">
                                        {mode === 'create'
                                            ? 'Rancang butir pertanyaan, tentukan kunci jawaban, serta atur durasi dan kesulitan evaluasi kelulusan.'
                                            : 'Perbarui butir pertanyaan, kunci jawaban, durasi pengerjaan, dan tingkat kesulitan kuis.'}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </header>

                    {/* ================= QUIZ SETTINGS BAR ================= */}
                    <div className="grid grid-cols-1 gap-4 rounded-2xl border border-slate-200/90 bg-white/70 p-5 shadow-xs sm:grid-cols-3 dark:border-slate-800/80 dark:bg-[#060B1A]/80">
                        {/* Difficulty Selector */}
                        <div className="space-y-1.5">
                            <label className="text-[11px] font-bold tracking-wider text-slate-500 uppercase dark:text-slate-400">
                                Tingkat Kesulitan
                            </label>
                            <div className="flex items-center gap-1.5">
                                {[
                                    {
                                        key: 'easy',
                                        label: 'Easy',
                                        activeClass:
                                            'border-emerald-500/40 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold',
                                    },
                                    {
                                        key: 'medium',
                                        label: 'Medium',
                                        activeClass:
                                            'border-amber-500/40 bg-amber-500/10 text-amber-600 dark:text-amber-400 font-bold',
                                    },
                                    {
                                        key: 'hard',
                                        label: 'Hard',
                                        activeClass:
                                            'border-rose-500/40 bg-rose-500/10 text-rose-600 dark:text-rose-400 font-bold',
                                    },
                                ].map((d) => (
                                    <button
                                        key={d.key}
                                        type="button"
                                        onClick={() => setDifficulty(d.key)}
                                        className={`flex-1 cursor-pointer rounded-xl border py-2 text-center text-xs transition-all ${
                                            difficulty.toLowerCase() === d.key
                                                ? d.activeClass
                                                : 'border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100 dark:border-slate-800 dark:bg-slate-900/60 dark:text-slate-400 dark:hover:bg-slate-800'
                                        }`}
                                    >
                                        {d.label}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Duration Setting */}
                        <div className="space-y-1.5">
                            <label className="text-[11px] font-bold tracking-wider text-slate-500 uppercase dark:text-slate-400">
                                Durasi Pengerjaan
                            </label>
                            <div className="flex items-center gap-2">
                                <div className="relative flex-1">
                                    <input
                                        type="number"
                                        min={1}
                                        max={180}
                                        value={duration}
                                        onChange={(e) =>
                                            setDuration(
                                                Math.max(
                                                    1,
                                                    parseInt(e.target.value) || 15,
                                                ),
                                            )
                                        }
                                        className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2 pr-14 pl-3.5 text-xs font-bold text-slate-900 transition-all focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 focus:outline-none dark:border-slate-800 dark:bg-slate-900/60 dark:text-white"
                                    />
                                    <span className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-xs text-slate-400 dark:text-slate-500">
                                        Menit
                                    </span>
                                </div>
                                <div className="flex items-center gap-1">
                                    {[15, 30, 45].map((preset) => (
                                        <button
                                            key={preset}
                                            type="button"
                                            onClick={() => setDuration(preset)}
                                            className={`cursor-pointer rounded-lg px-2 py-1.5 text-[11px] font-semibold transition-all ${
                                                duration === preset
                                                    ? 'border border-indigo-500/30 bg-indigo-50 text-indigo-700 dark:bg-indigo-500/20 dark:text-indigo-300'
                                                    : 'border border-slate-200 bg-slate-50 text-slate-500 hover:bg-slate-100 dark:border-slate-800 dark:bg-slate-900/50 dark:text-slate-400'
                                            }`}
                                        >
                                            {preset}m
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Question Stats Overview */}
                        <div className="space-y-1.5 sm:border-l sm:border-slate-200 sm:pl-4 dark:sm:border-slate-800">
                            <label className="text-[11px] font-bold tracking-wider text-slate-500 uppercase dark:text-slate-400">
                                Status Kuis
                            </label>
                            <div className="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2 text-xs dark:border-slate-800 dark:bg-slate-900/60">
                                <span className="font-medium text-slate-600 dark:text-slate-300">
                                    {questions.length} Pertanyaan
                                </span>
                                {allQuestionsValid ? (
                                    <span className="inline-flex items-center gap-1 rounded-md bg-emerald-50 px-2 py-0.5 text-[11px] font-bold text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300">
                                        <Check size={12} /> Siap Disimpan
                                    </span>
                                ) : (
                                    <span className="inline-flex items-center gap-1 rounded-md bg-amber-50 px-2 py-0.5 text-[11px] font-semibold text-amber-700 dark:bg-amber-500/15 dark:text-amber-300">
                                        {validQuestionsCount}/{questions.length} Lengkap
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* ================= QUESTIONS LIST ================= */}
                    <div className="space-y-5">
                        {questions.length === 0 ? (
                            <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-300 bg-white/60 p-12 text-center shadow-xs dark:border-slate-800 dark:bg-[#060B1A]/60">
                                <HelpCircle
                                    size={48}
                                    className="mb-3 text-slate-400 dark:text-slate-600"
                                />
                                <h3 className="mb-1 text-base font-bold text-slate-800 dark:text-white">
                                    Belum Ada Pertanyaan
                                </h3>
                                <p className="mb-5 max-w-sm text-xs text-slate-500 dark:text-slate-400">
                                    Mulai susun kuis dengan menambahkan butir pertanyaan pertama.
                                </p>
                                <button
                                    type="button"
                                    onClick={addQuestion}
                                    className="inline-flex cursor-pointer items-center gap-2 rounded-xl bg-indigo-600 px-5 py-2.5 text-xs font-bold text-white shadow-md shadow-indigo-500/20 transition-all hover:bg-indigo-500 active:scale-95"
                                >
                                    <Plus size={16} />
                                    <span>Tambah Pertanyaan Pertama</span>
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

                    {/* ================= BOTTOM ACTION BAR ================= */}
                    <div className="sticky bottom-4 z-20 flex flex-col items-center justify-between gap-3 rounded-2xl border border-slate-200/90 bg-white/90 p-4 shadow-lg backdrop-blur-md sm:flex-row dark:border-slate-800/90 dark:bg-[#0d0f17]/90">
                        <button
                            type="button"
                            onClick={addQuestion}
                            className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl border border-slate-300 bg-slate-50 px-5 py-2.5 text-xs font-bold text-slate-700 shadow-2xs transition-all hover:border-indigo-300 hover:bg-white hover:text-indigo-600 active:scale-95 sm:w-auto dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:border-indigo-500/50 dark:hover:bg-slate-700 dark:hover:text-white"
                        >
                            <Plus size={15} />
                            <span>Tambah Pertanyaan Baru</span>
                        </button>

                        <div className="flex w-full items-center justify-between gap-4 sm:w-auto">
                            <span className="text-xs text-slate-500 dark:text-slate-400">
                                {questions.length} Soal Terdaftar
                            </span>

                            <button
                                type="button"
                                onClick={submit}
                                disabled={loading}
                                className="flex cursor-pointer items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-[#3B28F6] px-6 py-2.5 text-xs font-bold text-white shadow-md shadow-indigo-500/25 transition-all hover:scale-[1.01] hover:shadow-lg hover:shadow-indigo-500/40 active:scale-95 disabled:cursor-not-allowed disabled:opacity-50 dark:from-indigo-500 dark:to-purple-600"
                            >
                                {loading ? (
                                    <>
                                        <Loader2 size={16} className="animate-spin" />
                                        <span>Menyimpan Kuis...</span>
                                    </>
                                ) : (
                                    <>
                                        <Check size={16} />
                                        <span>
                                            {mode === 'create'
                                                ? 'Simpan Final Quiz'
                                                : 'Simpan Perubahan'}
                                        </span>
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
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

/* ================= QUESTION CARD COMPONENT ================= */

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
        if (data.answers.length >= OPTION_LETTERS.length) {
            alert(`Maksimal ${OPTION_LETTERS.length} pilihan jawaban.`);
            return;
        }
        onChange({
            ...data,
            answers: [...data.answers, { answer_text: '', is_correct: false }],
        });
    };

    const removeAnswer = (i: number) => {
        if (data.answers.length <= 2) {
            alert('Setiap pertanyaan harus memiliki minimal 2 pilihan jawaban.');
            return;
        }
        const newAnswers = data.answers.filter((_, idx) => idx !== i);
        onChange({ ...data, answers: newAnswers });
    };

    const hasCorrectAnswer = data.answers.some((a) => a.is_correct);
    const correctCount = data.answers.filter((a) => a.is_correct).length;
    const isComplete = Boolean(
        data.question_text.trim() &&
            hasCorrectAnswer &&
            data.answers.every((a) => a.answer_text.trim()),
    );

    return (
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xs transition-all hover:border-slate-300 dark:border-slate-800/90 dark:bg-[#060B1A]/90 dark:hover:border-slate-700/80">
            {/* Header Soal */}
            <div className="flex items-center justify-between border-b border-slate-100 bg-slate-50/80 px-5 py-3.5 dark:border-slate-800/60 dark:bg-slate-900/40">
                <div className="flex items-center gap-3">
                    <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-indigo-500/10 text-xs font-bold text-indigo-600 dark:bg-indigo-500/20 dark:text-indigo-400">
                        #{index + 1}
                    </span>
                    <span className="text-sm font-bold text-slate-800 dark:text-white">
                        Pertanyaan #{index + 1}
                    </span>

                    {/* Status Pill */}
                    {isComplete ? (
                        <span className="inline-flex items-center rounded-full bg-emerald-50 px-2.5 py-0.5 text-[11px] font-bold text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300">
                            ✓ Siap
                        </span>
                    ) : !hasCorrectAnswer ? (
                        <span className="inline-flex items-center rounded-full bg-rose-50 px-2.5 py-0.5 text-[11px] font-semibold text-rose-600 dark:bg-rose-500/15 dark:text-rose-400">
                            Pilih kunci jawaban
                        </span>
                    ) : (
                        <span className="inline-flex items-center rounded-full bg-amber-50 px-2.5 py-0.5 text-[11px] font-semibold text-amber-700 dark:bg-amber-500/15 dark:text-amber-300">
                            Belum lengkap
                        </span>
                    )}
                </div>

                <button
                    type="button"
                    onClick={onDelete}
                    className="cursor-pointer rounded-lg p-2 text-slate-400 transition-colors hover:bg-rose-50 hover:text-rose-600 dark:text-slate-500 dark:hover:bg-rose-500/10 dark:hover:text-rose-400"
                    title="Hapus Pertanyaan"
                >
                    <Trash2 size={16} />
                </button>
            </div>

            <div className="space-y-5 p-5 sm:p-6">
                {/* Input Teks Pertanyaan */}
                <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                        Teks Pertanyaan <span className="text-rose-500">*</span>
                    </label>
                    <textarea
                        rows={3}
                        placeholder="Contoh: Tag HTML mana yang digunakan untuk mendefinisikan navigasi utama dalam halaman web?"
                        value={data.question_text}
                        onChange={(e) =>
                            onChange({ ...data, question_text: e.target.value })
                        }
                        className="w-full resize-y rounded-xl border border-slate-200 bg-slate-50/80 px-4 py-3 text-sm text-slate-900 transition-all placeholder:text-slate-400 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 focus:outline-none dark:border-slate-800 dark:bg-slate-950/60 dark:text-white dark:placeholder:text-slate-500"
                    />
                </div>

                {/* Media Attachment (Gambar) */}
                <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                        Lampiran Gambar <span className="font-normal text-slate-400">(Opsional)</span>
                    </label>

                    {data.media_url ? (
                        <div className="relative flex flex-col items-center gap-3 rounded-xl border border-slate-200 bg-slate-50/80 p-4 sm:flex-row dark:border-slate-800 dark:bg-slate-950/50">
                            <img
                                src={data.media_url}
                                alt={`Media pertanyaan ${index + 1}`}
                                className="h-28 w-auto max-w-xs rounded-lg border border-slate-200 object-contain dark:border-slate-800"
                            />
                            <div className="flex-1 space-y-1 text-center sm:text-left">
                                <div className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                                    {data.media_file
                                        ? data.media_file.name
                                        : 'Gambar terlampir'}
                                </div>
                                <p className="text-[11px] text-slate-400">
                                    Gambar ini akan ditampilkan pada siswa saat mengerjakan soal.
                                </p>
                            </div>
                            <button
                                type="button"
                                onClick={() =>
                                    onChange({
                                        ...data,
                                        media_file: undefined,
                                        media_url: undefined,
                                    })
                                }
                                className="inline-flex cursor-pointer items-center gap-1.5 rounded-lg border border-rose-200 bg-rose-50 px-3 py-1.5 text-xs font-semibold text-rose-600 transition-colors hover:bg-rose-100 dark:border-rose-500/20 dark:bg-rose-500/10 dark:text-rose-400 dark:hover:bg-rose-500/20"
                            >
                                <X size={14} />
                                <span>Hapus Gambar</span>
                            </button>
                        </div>
                    ) : (
                        <div>
                            <label className="inline-flex cursor-pointer items-center gap-2 rounded-xl border border-dashed border-slate-300 bg-slate-50/60 px-4 py-2.5 text-xs font-semibold text-slate-600 transition-all hover:border-indigo-400 hover:bg-indigo-50/40 hover:text-indigo-600 active:scale-95 dark:border-slate-800 dark:bg-slate-900/40 dark:text-slate-400 dark:hover:border-indigo-500 dark:hover:text-white">
                                <ImageIcon size={15} />
                                <span>+ Sisipkan Gambar Soal</span>
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
                        </div>
                    )}
                </div>

                {/* Pilihan Jawaban */}
                <div className="space-y-3 pt-2">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                        <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                            Pilihan Jawaban <span className="font-normal text-slate-400">(Tandai lingkaran untuk menetapkan kunci jawaban)</span>
                        </label>
                        <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-[11px] font-semibold text-slate-600 dark:bg-slate-900/80 dark:text-slate-300">
                            {correctCount > 0
                                ? `✓ ${correctCount} Kunci Jawaban Terpilih`
                                : 'Belum Ada Kunci'}
                        </span>
                    </div>

                    <div className="space-y-2.5">
                        {data.answers.map((a, i) => {
                            const letter = OPTION_LETTERS[i] || String(i + 1);
                            return (
                                <div
                                    key={i}
                                    className={`flex items-center gap-2.5 rounded-xl border p-2 transition-all sm:gap-3 ${
                                        a.is_correct
                                            ? 'border-emerald-500/40 bg-emerald-500/5 shadow-2xs dark:border-emerald-500/30 dark:bg-emerald-500/10'
                                            : 'border-slate-200 bg-slate-50/70 hover:border-slate-300 dark:border-slate-800 dark:bg-slate-950/50 dark:hover:border-slate-700'
                                    }`}
                                >
                                    {/* Option Letter Pill */}
                                    <span
                                        className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-xs font-bold transition-all ${
                                            a.is_correct
                                                ? 'bg-emerald-500 text-white shadow-2xs'
                                                : 'border border-slate-200 bg-white text-slate-600 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300'
                                        }`}
                                    >
                                        {letter}
                                    </span>

                                    {/* Toggle Correct Button */}
                                    <button
                                        type="button"
                                        onClick={() =>
                                            updateAnswer(i, {
                                                ...a,
                                                is_correct: !a.is_correct,
                                            })
                                        }
                                        className={`flex h-8 cursor-pointer items-center justify-center rounded-lg px-2.5 text-xs font-semibold transition-all ${
                                            a.is_correct
                                                ? 'bg-emerald-500/20 text-emerald-700 dark:bg-emerald-500/30 dark:text-emerald-300'
                                                : 'text-slate-400 hover:bg-slate-200/60 hover:text-slate-700 dark:hover:bg-slate-800 dark:hover:text-slate-200'
                                        }`}
                                        title={
                                            a.is_correct
                                                ? 'Kunci Jawaban Benar (Klik untuk batalkan)'
                                                : 'Tandai sebagai kunci jawaban'
                                        }
                                    >
                                        {a.is_correct ? (
                                            <CheckCircle2 size={16} />
                                        ) : (
                                            <Circle size={16} />
                                        )}
                                    </button>

                                    {/* Input Text */}
                                    <input
                                        type="text"
                                        placeholder={`Tulis opsi jawaban ${letter}...`}
                                        value={a.answer_text}
                                        onChange={(e) =>
                                            updateAnswer(i, {
                                                ...a,
                                                answer_text: e.target.value,
                                            })
                                        }
                                        className="flex-1 border-none bg-transparent px-1 py-1 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-0 dark:text-white dark:placeholder:text-slate-500"
                                    />

                                    {/* Delete Option */}
                                    {data.answers.length > 2 && (
                                        <button
                                            type="button"
                                            onClick={() => removeAnswer(i)}
                                            className="cursor-pointer rounded-lg p-2 text-slate-400 transition-colors hover:bg-rose-50 hover:text-rose-600 dark:hover:bg-rose-500/10 dark:hover:text-rose-400"
                                            title="Hapus Opsi"
                                        >
                                            <X size={15} />
                                        </button>
                                    )}
                                </div>
                            );
                        })}
                    </div>

                    {/* Add Option Button */}
                    {data.answers.length < OPTION_LETTERS.length && (
                        <div className="pt-1">
                            <button
                                type="button"
                                onClick={addAnswer}
                                className="inline-flex cursor-pointer items-center gap-1.5 rounded-lg border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-semibold text-slate-600 transition-all hover:border-indigo-300 hover:bg-white hover:text-indigo-600 active:scale-95 dark:border-slate-800 dark:bg-slate-900/60 dark:text-slate-400 dark:hover:text-white"
                            >
                                <Plus size={13} />
                                <span>
                                    Tambah Opsi{' '}
                                    {OPTION_LETTERS[data.answers.length] || ''}
                                </span>
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
