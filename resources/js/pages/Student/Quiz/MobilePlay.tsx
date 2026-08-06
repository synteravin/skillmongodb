import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, MoreHorizontal, Flag } from 'lucide-react';
import { router } from '@inertiajs/react';

interface MobilePlayProps {
    quiz: any;
    has_submitted: boolean;
    isReviewMode?: boolean;
    user_stats: {
        level: number;
        xp: number;
        exp_max: number;
        gold: number;
    };
    current: number;
    setCurrent: (val: number) => void;
    answers: any[];
    setAnswers: (val: any[]) => void;
    selected: any;
    setSelected: (val: any) => void;
    loading: boolean;
    next: () => void;
    handleBack: () => void;
    timeLeft?: number;
}

const AnswerButton = ({
    label,
    text,
    selected,
    isCorrect,
    isReviewMode,
    onClick,
}: any) => {
    let borderBg = selected
        ? 'bg-[#151c38] border-yellow-400 shadow-[0_0_12px_rgba(250,204,21,0.25)]'
        : 'bg-[#0d1222] border-[#1e293b] hover:border-[#3B28F6] hover:bg-[#121829]';
    let badgeBg = selected
        ? 'bg-yellow-400 text-black'
        : 'bg-[#3B28F6] text-white';
    let textColor = selected ? 'text-yellow-400' : 'text-gray-300';

    if (isReviewMode) {
        if (isCorrect) {
            borderBg =
                'bg-emerald-950/70 border-emerald-500 shadow-[0_0_12px_rgba(16,185,129,0.25)]';
            badgeBg = 'bg-emerald-500 text-white';
            textColor = 'text-emerald-200 font-semibold';
        } else if (selected) {
            borderBg =
                'bg-rose-950/70 border-rose-500 shadow-[0_0_12px_rgba(244,63,94,0.25)]';
            badgeBg = 'bg-rose-500 text-white';
            textColor = 'text-rose-200';
        }
    }

    return (
        <motion.button
            whileTap={!isReviewMode ? { scale: 0.98 } : undefined}
            onClick={!isReviewMode ? onClick : undefined}
            className={`flex w-full items-center justify-between rounded-lg border px-4 py-3 text-left transition-all duration-300 ${borderBg} ${isReviewMode ? 'cursor-default' : 'cursor-pointer'}`}
        >
            <div className="flex items-center gap-3">
                <div
                    className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-bold transition-all duration-300 ${badgeBg}`}
                >
                    {label}
                </div>
                <span
                    className={`text-sm font-semibold transition-colors duration-300 ${textColor}`}
                >
                    {text}
                </span>
            </div>
            {isReviewMode && isCorrect && (
                <span className="shrink-0 rounded-full border border-emerald-400/40 bg-emerald-400/20 px-2 py-0.5 text-xs font-bold text-emerald-400">
                    ✓ Kunci
                </span>
            )}
            {isReviewMode && !isCorrect && selected && (
                <span className="shrink-0 rounded-full border border-rose-400/40 bg-rose-400/20 px-2 py-0.5 text-xs font-bold text-rose-400">
                    ✗ Anda
                </span>
            )}
        </motion.button>
    );
};

const QuestionBox = ({
    question,
    isLandscape,
}: {
    question: any;
    isLandscape: boolean;
}) => {
    return (
        <div
            className={`flex min-h-0 w-full flex-col gap-3 ${isLandscape ? 'h-full overflow-y-auto pr-1' : ''}`}
        >
            {question.media_url && (
                <div className="flex w-full flex-shrink-0 items-center justify-center overflow-hidden rounded-xl border border-slate-700/50 bg-white p-2">
                    <img
                        src={question.media_url}
                        alt="Question media"
                        className="max-h-[140px] w-auto object-contain sm:max-h-[180px]"
                    />
                </div>
            )}
            <div className="text-sm leading-relaxed font-semibold text-gray-200 select-none sm:text-base">
                {question.question_text}
                {question.max_selectable > 1 && (
                    <span className="ml-2 inline-block rounded-full bg-yellow-400/20 px-2 py-0.5 text-xs font-bold text-yellow-400">
                        (Pilih {question.max_selectable} Jawaban)
                    </span>
                )}
                {question.explanation && (
                    <div className="mt-2.5 rounded-lg border border-indigo-500/40 bg-indigo-950/60 p-2.5 text-xs text-indigo-200">
                        <span className="font-bold text-yellow-400">
                            💡 Pembahasan:{' '}
                        </span>
                        {question.explanation}
                    </div>
                )}
            </div>
        </div>
    );
};

const NavigationFooter = ({
    current,
    total,
    selected,
    isReviewMode,
    loading,
    handleBack,
    next,
}: {
    current: number;
    total: number;
    selected: boolean;
    isReviewMode?: boolean;
    loading: boolean;
    handleBack: () => void;
    next: () => void;
}) => {
    return (
        <div className="mt-auto flex w-full items-center justify-between gap-3 bg-[#04080f]/95 pt-4">
            {/* BACK BUTTON */}
            <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={handleBack}
                disabled={current === 0}
                className={`flex flex-1 items-center justify-center rounded border border-[#3B28F6]/80 px-3 py-2 font-['Orbitron'] text-xs font-bold text-white transition-all duration-300 ${
                    current === 0
                        ? 'cursor-not-allowed opacity-30'
                        : 'hover:bg-[#3B28F6]/20'
                }`}
            >
                &lt;&lt; BACK
            </motion.button>

            {/* COUNTER */}
            <div className="flex flex-shrink-0 items-center justify-center rounded border border-yellow-400/80 px-4 py-2 font-['Orbitron'] text-xs font-bold text-yellow-400">
                {String(current + 1).padStart(2, '0')}
                <span className="mx-1 opacity-50">/</span>
                {String(total).padStart(2, '0')}
            </div>

            {/* NEXT / FINISH BUTTON */}
            <motion.button
                whileTap={
                    !isReviewMode && (!selected || loading)
                        ? undefined
                        : { scale: 0.95 }
                }
                onClick={next}
                disabled={isReviewMode ? loading : !selected || loading}
                className={`flex flex-1 items-center justify-center rounded border border-yellow-400 bg-yellow-400 px-3 py-2 font-['Orbitron'] text-xs font-bold text-black transition-all duration-300 ${
                    !isReviewMode && (!selected || loading)
                        ? 'cursor-not-allowed opacity-40'
                        : 'hover:bg-yellow-300'
                }`}
            >
                {loading ? (
                    '...'
                ) : current + 1 === total ? (
                    isReviewMode ? (
                        'KELUAR'
                    ) : (
                        <span className="flex items-center gap-1">
                            FINISH{' '}
                            <Flag
                                className="h-3 w-3 text-black"
                                strokeWidth={3}
                            />
                        </span>
                    )
                ) : (
                    'NEXT >>'
                )}
            </motion.button>
        </div>
    );
};

export default function MobilePlay({
    quiz,
    has_submitted,
    isReviewMode = false,
    user_stats,
    current,
    setCurrent,
    answers,
    setAnswers,
    selected,
    setSelected,
    loading,
    next,
    handleBack,
    timeLeft = (quiz?.duration || 15) * 60,
}: MobilePlayProps) {
    const [isLandscape, setIsLandscape] = useState(false);

    useEffect(() => {
        const checkOrientation = () => {
            setIsLandscape(window.innerWidth > window.innerHeight);
        };
        checkOrientation();
        window.addEventListener('resize', checkOrientation);
        return () => window.removeEventListener('resize', checkOrientation);
    }, []);

    const handleExit = () => {
        if (quiz?.course_slug && quiz?.path_slug && quiz?.module_slug) {
            router.visit(
                `/learn/${quiz.course_slug}/${quiz.path_slug}/${quiz.module_slug}`,
            );
        } else {
            router.visit(`/courses/${quiz?.course_slug}`);
        }
    };

    if (!quiz?.questions?.length) return null;
    const question = quiz.questions[current];
    const total = quiz.questions.length;
    const labels = ['A', 'B', 'C', 'D', 'E'];

    const formatTimer = (seconds: number) => {
        const m = Math.floor(seconds / 60);
        const s = seconds % 60;
        return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
    };

    // RENDERING PORTRAIT
    if (!isLandscape) {
        return (
            <div className="flex h-screen flex-col overflow-hidden bg-[#04080f] font-['Rajdhani',sans-serif] text-white">
                {/* Header (Timer & Review Mode) */}
                <header className="flex flex-shrink-0 items-center justify-between border-b border-[#3B28F6]/20 bg-[#0a0f1d] px-4 py-2.5">
                    <div className="flex items-center gap-2">
                        <button
                            onClick={handleExit}
                            className="flex items-center gap-1 rounded-lg border border-[#3B28F6]/40 bg-[#3B28F6]/10 px-2.5 py-1 text-xs font-bold text-gray-300 transition-colors hover:bg-[#3B28F6]/20"
                        >
                            <ChevronLeft className="h-4 w-4" />
                            <span>Keluar</span>
                        </button>
                        {quiz.is_review && (
                            <span className="rounded bg-yellow-400/20 px-2 py-0.5 text-[10px] font-bold text-yellow-300">
                                💡 REVIEW MODE
                            </span>
                        )}
                    </div>

                    {!quiz.is_review && quiz.duration && (
                        <div
                            className={`flex items-center gap-1.5 rounded-full px-3 py-1 font-['orbitron'] text-xs font-bold tracking-wider ${
                                timeLeft < 60
                                    ? 'animate-pulse border border-rose-500/60 bg-rose-500/20 text-rose-400'
                                    : 'border border-indigo-500/40 bg-indigo-500/20 text-indigo-300'
                            }`}
                        >
                            <span>⏱️ TIME: {formatTimer(timeLeft)}</span>
                        </div>
                    )}
                </header>

                {/* Main Content Area */}
                <main className="flex min-h-0 flex-1 flex-col gap-4 overflow-y-auto px-4 py-4">
                    {/* Question Box */}
                    <div className="flex-shrink-0">
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={question.id}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                transition={{ duration: 0.25 }}
                            >
                                <QuestionBox
                                    question={question}
                                    isLandscape={false}
                                />
                            </motion.div>
                        </AnimatePresence>
                    </div>

                    {/* Answers Options */}
                    <div className="flex flex-1 flex-col gap-2.5 pb-4">
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={question.id + '-answers'}
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                transition={{ duration: 0.25 }}
                                className="flex flex-col gap-2.5"
                            >
                                {question.answers.map((a: any, idx: number) => {
                                    const maxSelectable =
                                        question?.max_selectable || 1;
                                    const isSel = Array.isArray(selected)
                                        ? selected.includes(a.id)
                                        : selected === a.id;
                                    return (
                                        <AnswerButton
                                            key={a.id}
                                            label={
                                                labels[idx] ?? String(idx + 1)
                                            }
                                            text={a.answer_text}
                                            selected={isSel}
                                            isCorrect={a.is_correct}
                                            isReviewMode={isReviewMode}
                                            onClick={() => {
                                                if (maxSelectable === 1) {
                                                    setSelected([a.id]);
                                                } else {
                                                    const cur = Array.isArray(
                                                        selected,
                                                    )
                                                        ? selected
                                                        : [];
                                                    if (isSel) {
                                                        setSelected(
                                                            cur.filter(
                                                                (x: string) =>
                                                                    x !== a.id,
                                                            ),
                                                        );
                                                    } else if (
                                                        cur.length <
                                                        maxSelectable
                                                    ) {
                                                        setSelected([
                                                            ...cur,
                                                            a.id,
                                                        ]);
                                                    }
                                                }
                                            }}
                                        />
                                    );
                                })}
                            </motion.div>
                        </AnimatePresence>
                    </div>
                </main>

                {/* Navigation Footer */}
                <footer className="flex-shrink-0 bg-[#04080f] px-4 pb-4">
                    <NavigationFooter
                        current={current}
                        total={total}
                        selected={selected !== null}
                        isReviewMode={isReviewMode}
                        loading={loading}
                        handleBack={handleBack}
                        next={
                            current + 1 === total && isReviewMode
                                ? handleExit
                                : next
                        }
                    />
                </footer>
            </div>
        );
    }

    // RENDERING LANDSCAPE
    return (
        <div className="flex h-screen w-screen flex-col overflow-hidden bg-[#04080f] font-['Rajdhani',sans-serif] text-white">
            {/* Top Header */}
            <header className="flex flex-shrink-0 items-center justify-between border-b border-[#3B28F6]/20 bg-[#070b18] px-4 py-2">
                <div className="flex items-center gap-2">
                    <button
                        onClick={handleExit}
                        className="flex items-center gap-1.5 rounded-lg border border-[#3B28F6]/40 bg-[#3B28F6]/10 px-2.5 py-1 text-xs font-bold text-gray-300 transition-colors hover:bg-[#3B28F6]/20"
                    >
                        <ChevronLeft className="h-4 w-4" />
                        <span>Keluar</span>
                    </button>
                    {quiz.is_review && (
                        <span className="rounded bg-yellow-400/20 px-2.5 py-1 text-xs font-bold text-yellow-300">
                            💡 REVIEW MODE
                        </span>
                    )}
                </div>

                {!quiz.is_review && quiz.duration && (
                    <div
                        className={`flex items-center gap-1.5 rounded-full px-3.5 py-1 font-['orbitron'] text-xs font-bold tracking-wider ${
                            timeLeft < 60
                                ? 'animate-pulse border border-rose-500/60 bg-rose-500/20 text-rose-400 shadow-[0_0_10px_rgba(244,63,94,0.3)]'
                                : 'border border-indigo-500/40 bg-indigo-500/20 text-indigo-300 shadow-[0_0_10px_rgba(99,102,241,0.2)]'
                        }`}
                    >
                        <span>⏱️ TIME: {formatTimer(timeLeft)}</span>
                    </div>
                )}
            </header>

            {/* Split Main Content Area */}
            <main className="flex min-h-0 w-full flex-1 gap-3 overflow-hidden p-3">
                {/* Column 1 (Left): Question Box */}
                <div className="flex min-h-0 w-1/2 flex-1 flex-col overflow-hidden rounded-xl border border-[#3B28F6]/10 bg-[#060a16] p-4 shadow-lg">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={question.id}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 10 }}
                            transition={{ duration: 0.25 }}
                            className="h-full"
                        >
                            <QuestionBox
                                question={question}
                                isLandscape={true}
                            />
                        </motion.div>
                    </AnimatePresence>
                </div>

                {/* Column 2 (Right): Answers + Navigation */}
                <div className="flex min-h-0 w-1/2 flex-1 flex-col justify-between">
                    {/* Options list scrollable */}
                    <div className="flex flex-1 [scrollbar-width:thin] [scrollbar-color:#3B28F6_#0d0d1a] flex-col gap-2 overflow-y-auto pr-1 [&::-webkit-scrollbar]:w-[4px] [&::-webkit-scrollbar-thumb]:bg-[#3B28F6]">
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={question.id + '-answers-landscape'}
                                initial={{ opacity: 0, x: 10 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -10 }}
                                transition={{ duration: 0.25 }}
                                className="flex flex-col gap-2"
                            >
                                {question.answers.map((a: any, idx: number) => {
                                    const maxSelectable =
                                        question?.max_selectable || 1;
                                    const isSel = Array.isArray(selected)
                                        ? selected.includes(a.id)
                                        : selected === a.id;
                                    return (
                                        <AnswerButton
                                            key={a.id}
                                            label={
                                                labels[idx] ?? String(idx + 1)
                                            }
                                            text={a.answer_text}
                                            selected={isSel}
                                            onClick={() => {
                                                if (maxSelectable === 1) {
                                                    setSelected([a.id]);
                                                } else {
                                                    const cur = Array.isArray(
                                                        selected,
                                                    )
                                                        ? selected
                                                        : [];
                                                    if (isSel) {
                                                        setSelected(
                                                            cur.filter(
                                                                (x: string) =>
                                                                    x !== a.id,
                                                            ),
                                                        );
                                                    } else if (
                                                        cur.length <
                                                        maxSelectable
                                                    ) {
                                                        setSelected([
                                                            ...cur,
                                                            a.id,
                                                        ]);
                                                    }
                                                }
                                            }}
                                        />
                                    );
                                })}
                            </motion.div>
                        </AnimatePresence>
                    </div>

                    {/* Bottom Navigation Row */}
                    <div className="shrink-0">
                        <NavigationFooter
                            current={current}
                            total={total}
                            selected={selected !== null}
                            loading={loading}
                            handleBack={handleBack}
                            next={next}
                        />
                    </div>
                </div>
            </main>
        </div>
    );
}
