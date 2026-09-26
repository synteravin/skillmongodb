import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ResultModal from '@/components/QuestionForm/ResultModal';
import TimeExpiredModal from '@/components/QuestionForm/TimeExpiredModal';
import { router, usePage } from '@inertiajs/react';
import { Clock, Flag, AlertOctagon, TriangleAlert, Gamepad2 } from 'lucide-react';
import CourseOnboardingTour from '@/components/Student/CourseOnboardingTour';

/* ============================================================================
   1. CODE BLOCK COMPONENT (IDE Style with Syntax Colors & Line Numbers)
   ============================================================================ */
function renderHighlightedLine(line: string) {
    if (!line) return <span>&nbsp;</span>;

    const tokens = line.split(/(<[^>]+>|"[^"]*"|'[^']*')/g);

    return (
        <>
            {tokens.map((token, idx) => {
                if (token.startsWith('<') && token.endsWith('>')) {
                    const tagParts = token.split(/(\s+)/);
                    return (
                        <span key={idx} className="text-cyan-400 font-semibold">
                            {tagParts.map((p, pIdx) => {
                                if (p.includes('=')) {
                                    const [attr, val] = p.split('=');
                                    return (
                                        <span key={pIdx}>
                                            <span className="text-emerald-400">{attr}</span>=
                                            <span className="text-yellow-300">{val}</span>
                                        </span>
                                    );
                                }
                                return p;
                            })}
                        </span>
                    );
                }
                if (
                    (token.startsWith('"') && token.endsWith('"')) ||
                    (token.startsWith("'") && token.endsWith("'"))
                ) {
                    return (
                        <span key={idx} className="text-yellow-300">
                            {token}
                        </span>
                    );
                }
                return <span key={idx} className="text-slate-200">{token}</span>;
            })}
        </>
    );
}

function CodeBlock({ code }: { code: string }) {
    const lines = code.trim().split('\n');
    return (
        <div className="my-1.5 sm:my-3 rounded-lg sm:rounded-xl border border-cyan-500/30 bg-[#050914] p-2 sm:p-3 md:p-4 font-mono text-[10px] sm:text-xs md:text-sm text-slate-200 shadow-[inset_0_0_20px_rgba(0,162,255,0.05)] overflow-x-auto hp-landscape-codeblock-el sm-md-codeblock-el md-lg-codeblock-el">
            <div className="flex gap-2 sm:gap-3">
                {/* Line Numbers */}
                <div className="select-none text-right text-slate-600 pr-2 sm:pr-3 border-r border-slate-800 font-mono">
                    {lines.map((_, i) => (
                        <div key={i} className="leading-snug sm:leading-relaxed">
                            {i + 1}
                        </div>
                    ))}
                </div>
                {/* Code Lines */}
                <div className="flex-1 overflow-x-auto whitespace-pre font-mono">
                    {lines.map((line, i) => (
                        <div key={i} className="leading-snug sm:leading-relaxed">
                            {renderHighlightedLine(line)}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

/* ============================================================================
   2. QUESTION CONTENT PARSER & FORMATTER
   ============================================================================ */
function parseQuestionContent(questionText: string) {
    if (!questionText) return { codeSnippet: null, questionPrompt: '' };

    const codeBlockMatch = questionText.match(
        /```(?:html|css|js|javascript|php)?\s*([\s\S]*?)```/i,
    );
    if (codeBlockMatch) {
        const codeSnippet = codeBlockMatch[1].trim();
        const questionPrompt = questionText
            .replace(/```(?:html|css|js|javascript|php)?\s*[\s\S]*?```/i, '')
            .trim();
        return { codeSnippet, questionPrompt };
    }

    if (
        questionText.includes('<!DOCTYPE') ||
        (questionText.includes('<html') && questionText.includes('</html>'))
    ) {
        const htmlEndIndex = questionText.indexOf('</html>');
        if (htmlEndIndex !== -1) {
            const codeSnippet = questionText
                .substring(0, htmlEndIndex + 7)
                .trim();
            const questionPrompt = questionText
                .substring(htmlEndIndex + 7)
                .trim();
            return { codeSnippet, questionPrompt };
        }
    }

    return { codeSnippet: null, questionPrompt: questionText };
}

function FormattedQuestionText({ text }: { text: string }) {
    if (!text) return null;

    const len = text ? text.length : 0;
    const parts = text.split(/(<[^>]+>|\b\w+\/)/g);

    let textClass = 'text-xs sm:text-sm md:text-base lg:text-lg xl:text-xl leading-relaxed text-slate-200 font-medium hp-landscape-prompt-text-long sm-md-prompt-text-long md-lg-prompt-text-long';
    if (len < 100) {
        textClass = 'text-base sm:text-lg md:text-2xl lg:text-3xl leading-relaxed text-slate-100 font-extrabold hp-landscape-prompt-text-short sm-md-prompt-text-short md-lg-prompt-text-short';
    } else if (len < 200) {
        textClass = 'text-sm sm:text-base md:text-xl lg:text-2xl leading-relaxed text-slate-100 font-bold hp-landscape-prompt-text-medium sm-md-prompt-text-medium md-lg-prompt-text-medium';
    }

    return (
        <p className={textClass}>
            {parts.map((part, idx) => {
                if (part.startsWith('<') && part.endsWith('>')) {
                    return (
                        <span
                            key={idx}
                            className="mx-0.5 inline-block font-mono font-bold text-yellow-400 bg-yellow-400/10 px-1.5 py-0.5 rounded border border-yellow-400/20"
                        >
                            {part}
                        </span>
                    );
                }
                if (/\b(one\/|two\/|three\/|\w+\/)/.test(part)) {
                    return (
                        <span key={idx} className="mx-0.5 font-mono font-bold text-yellow-400">
                            {part}
                        </span>
                    );
                }
                return <span key={idx}>{part}</span>;
            })}
        </p>
    );
}

/* ============================================================================
   3. REUSABLE CHAMFER CARD FRAME (Clean Siku Bevel Cut Corners & Full Unclipped Glow)
   ============================================================================ */
function ChamferCard({
    children,
    className = '',
}: {
    children: React.ReactNode;
    className?: string;
}) {
    return (
        <div className={`relative flex flex-col h-full w-full ${className}`}>
            {/* Outer SVG Non-scaling Blue Border Frame with Soft Ambient Glow */}
            <svg
                className="absolute inset-0 h-full w-full overflow-visible pointer-events-none z-0 filter drop-shadow-[0_0_16px_rgba(59,130,246,0.85)]"
                preserveAspectRatio="none"
                viewBox="0 0 500 600"
            >
                <path
                    d="M 16 2 L 484 2 L 498 16 L 498 584 L 484 598 L 16 598 L 2 584 L 2 16 Z"
                    fill="#070e20"
                    stroke="#3b82f6"
                    strokeWidth="2.5"
                    vectorEffect="non-scaling-stroke"
                />
            </svg>

            {/* Inner Content Container */}
            <div className="relative z-10 flex flex-col h-full w-full p-3 sm:p-5 md:p-6 lg:p-7 hp-landscape-card-inner-box sm-md-card-inner-box md-lg-card-inner-box overflow-hidden">
                {children}
            </div>
        </div>
    );
}

/* ============================================================================
   4. REUSABLE HEXAGON BUTTON FRAME (SVG Vector Stroke - Segi 6)
   ============================================================================ */
function HexagonButton({
    children,
    selected,
    isCorrect,
    isReviewMode,
    isYellowFill,
    onClick,
    disabled,
    className = '',
}: {
    children: React.ReactNode;
    selected?: boolean;
    isCorrect?: boolean;
    isReviewMode?: boolean;
    isYellowFill?: boolean;
    onClick?: () => void;
    disabled?: boolean;
    className?: string;
}) {
    let borderColor = selected ? '#FACC15' : '#3B28F6';
    let bgColor = selected ? '#0c1428' : '#070e20';

    if (isYellowFill) {
        borderColor = '#FACC15';
        bgColor = '#FACC15';
    }

    if (isReviewMode) {
        if (selected && isCorrect) {
            borderColor = '#10B981';
            bgColor = 'rgba(6, 78, 59, 0.5)';
        } else if (selected && !isCorrect) {
            borderColor = '#F43F5E';
            bgColor = 'rgba(136, 19, 55, 0.5)';
        } else if (isCorrect) {
            borderColor = '#10B981';
            bgColor = 'rgba(6, 78, 59, 0.2)';
        } else {
            borderColor = '#1e293b';
            bgColor = '#070e20';
        }
    }

    return (
        <button
            onClick={onClick}
            disabled={disabled}
            className={`group relative flex items-center justify-between w-full transition-all duration-300 outline-none ${
                disabled
                    ? 'opacity-40 cursor-not-allowed'
                    : 'cursor-pointer hover:brightness-110'
            } ${className}`}
        >
            {/* SVG Non-scaling Full Border Hexagon (Segi 6) Frame */}
            <svg
                className="absolute inset-0 h-full w-full overflow-visible pointer-events-none"
                preserveAspectRatio="none"
                viewBox="0 0 400 60"
            >
                <path
                    d="M 22 2 L 378 2 L 398 30 L 378 58 L 22 58 L 2 30 Z"
                    fill={bgColor}
                    stroke={borderColor}
                    strokeWidth="2.5"
                    vectorEffect="non-scaling-stroke"
                />
            </svg>

            {/* Inner Content with spacious padding away from slanted tips */}
            <div className="relative z-10 flex items-center justify-between w-full pl-6 sm:pl-8 md:pl-9 xl:pl-10 pr-4 sm:pr-5 md:pr-6 hp-landscape-hexagon-inner sm-md-hexagon-inner md-lg-hexagon-inner py-1.5 sm:py-2 md:py-2.5 lg:py-3">
                {children}
            </div>
        </button>
    );
}

/* ============================================================================
   5. DYNAMIC HELPER FOR ANSWER OPTION SIZES & STYLES (DYNAMIC SCALING)
   ============================================================================ */
function getOptionStyles(text: string) {
    const len = text ? text.length : 0;

    if (len < 40) {
        return {
            fontSizeClass: 'text-xs sm:text-sm md:text-base lg:text-base xl:text-lg 2xl:text-xl leading-snug font-bold hp-landscape-option-font-1 sm-md-option-font-1 md-lg-option-font-1',
            buttonClass: '!min-h-[38px] sm:!min-h-[42px] md:!min-h-[48px] lg:!min-h-[52px] xl:!min-h-[64px] 2xl:!min-h-[72px] !py-2 sm:!py-2.5 md:!py-2.5 lg:!py-3 xl:!py-4 2xl:!py-4.5 hp-landscape-option-btn-1 sm-md-option-btn-1 md-lg-option-btn-1',
            badgeClass: 'h-6 w-6 sm:h-7 sm:w-7 md:h-8 md:w-8 lg:h-8 lg:w-8 xl:h-10 xl:w-10 2xl:h-11 2xl:w-11 text-xs sm:text-xs md:text-sm xl:text-base 2xl:text-lg hp-landscape-option-badge-1 sm-md-option-badge-1 md-lg-option-badge-1',
        };
    }
    if (len < 80) {
        return {
            fontSizeClass: 'text-[11px] sm:text-xs md:text-xs lg:text-sm xl:text-base 2xl:text-lg leading-snug font-medium hp-landscape-option-font-2 sm-md-option-font-2 md-lg-option-font-2',
            buttonClass: '!min-h-[34px] sm:!min-h-[38px] md:!min-h-[44px] lg:!min-h-[46px] xl:!min-h-[58px] 2xl:!min-h-[64px] !py-1.5 sm:!py-1.5 md:!py-2 lg:!py-2.5 xl:!py-3.5 2xl:!py-4 hp-landscape-option-btn-2 sm-md-option-btn-2 md-lg-option-btn-2',
            badgeClass: 'h-5.5 w-5.5 sm:h-6 sm:w-6 md:h-6.5 md:w-6.5 lg:h-7 lg:w-7 xl:h-9 xl:w-9 2xl:h-10 2xl:w-10 text-[10px] sm:text-xs md:text-xs xl:text-sm 2xl:text-base hp-landscape-option-badge-2 sm-md-option-badge-2 md-lg-option-badge-2',
        };
    }
    if (len < 140) {
        return {
            fontSizeClass: 'text-[10px] sm:text-[11px] md:text-[11px] lg:text-xs xl:text-sm 2xl:text-base leading-tight font-medium hp-landscape-option-font-3 sm-md-option-font-3 md-lg-option-font-3',
            buttonClass: '!min-h-[32px] sm:!min-h-[36px] md:!min-h-[40px] lg:!min-h-[42px] xl:!min-h-[52px] 2xl:!min-h-[58px] !py-1 sm:!py-1.5 md:!py-1.5 lg:!py-2 xl:!py-3 2xl:!py-3.5 hp-landscape-option-btn-3 sm-md-option-btn-3 md-lg-option-btn-3',
            badgeClass: 'h-5 w-5 sm:h-5.5 sm:w-5.5 md:h-6 md:w-6 lg:h-6.5 lg:w-6.5 xl:h-8.5 xl:w-8.5 2xl:h-9.5 2xl:w-9.5 text-[9px] sm:text-[10px] md:text-[10px] xl:text-xs 2xl:text-sm hp-landscape-option-badge-3 sm-md-option-badge-3 md-lg-option-badge-3',
        };
    }
    return {
        fontSizeClass: 'text-[9px] sm:text-[10px] md:text-[10px] lg:text-[11px] xl:text-xs 2xl:text-sm leading-tight font-medium hp-landscape-option-font-4 sm-md-option-font-4 md-lg-option-font-4',
        buttonClass: '!min-h-[30px] sm:!min-h-[34px] md:!min-h-[36px] lg:!min-h-[38px] xl:!min-h-[48px] 2xl:!min-h-[54px] !py-1 sm:!py-1 md:!py-1.5 lg:!py-1.5 xl:!py-2.5 2xl:!py-3 hp-landscape-option-btn-4 sm-md-option-btn-4 md-lg-option-btn-4',
        badgeClass: 'h-4.5 w-4.5 sm:h-5 sm:w-5 md:h-5.5 md:w-5.5 lg:h-6 lg:w-6 xl:h-8 xl:w-8 2xl:h-9 2xl:w-9 text-[8px] sm:text-[9px] md:text-[9px] xl:text-xs 2xl:text-xs hp-landscape-option-badge-4 sm-md-option-badge-4 md-lg-option-badge-4',
    };
}

/* ============================================================================
   6. ANSWER OPTION COMPONENT
   ============================================================================ */
function AnswerOption({
    label,
    text,
    selected,
    isCorrect,
    isReviewMode,
    questionScore,
    onClick,
}: {
    label: string;
    text: string;
    selected: boolean;
    isCorrect?: boolean;
    isReviewMode?: boolean;
    questionScore?: number;
    onClick?: () => void;
}) {
    let hexBadgeBg = selected
        ? 'bg-[#FACC15] text-black font-black shadow-[0_0_10px_rgba(250,204,21,0.5)]'
        : 'bg-[#3B28F6] text-white font-bold';

    let textClass = selected ? 'text-white font-bold' : 'text-slate-200';

    if (isReviewMode) {
        if (selected && isCorrect) {
            hexBadgeBg = 'bg-emerald-500 text-white font-black';
            textClass = 'text-emerald-100 font-bold';
        } else if (selected && !isCorrect) {
            hexBadgeBg = 'bg-rose-500 text-white font-black';
            textClass = 'text-rose-200';
        } else if (isCorrect) {
            hexBadgeBg = 'bg-emerald-600 text-white';
            textClass = 'text-emerald-300';
        } else {
            hexBadgeBg = 'bg-slate-800 text-slate-400';
            textClass = 'text-slate-400';
        }
    }

    const { fontSizeClass, buttonClass, badgeClass } = getOptionStyles(text);

    return (
        <HexagonButton
            selected={selected}
            isCorrect={isCorrect}
            isReviewMode={isReviewMode}
            onClick={onClick}
            className={buttonClass}
        >
            <div className="flex items-center gap-2.5 sm:gap-3.5 md:gap-4.5 flex-1 min-w-0 py-0.5">
                {/* Left Hexagon Letter Badge */}
                <div
                    className={`flex shrink-0 items-center justify-center font-['Orbitron',sans-serif] transition-transform duration-300 group-hover:scale-105 ${badgeClass} ${hexBadgeBg}`}
                    style={{
                        clipPath:
                            'polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%)',
                    }}
                >
                    {label}
                </div>

                {/* Option Text */}
                <span
                    className={`font-mono text-left break-words whitespace-normal overflow-hidden ${fontSizeClass} ${textClass}`}
                >
                    {text}
                </span>
            </div>

            {/* Right Selection Indicator */}
            <div className="flex items-center gap-1.5 shrink-0 ml-2 sm:ml-3.5">
                {isReviewMode && selected && isCorrect && (
                    <span className="rounded-full border border-emerald-400/40 bg-emerald-400/20 px-1.5 py-0.5 font-['Orbitron',sans-serif] text-[8px] sm:text-xs font-bold text-emerald-400">
                        (+{questionScore || 20} Poin)
                    </span>
                )}
                {isReviewMode && selected && !isCorrect && (
                    <span className="rounded-full border border-rose-400/40 bg-rose-400/20 px-1.5 py-0.5 font-['Orbitron',sans-serif] text-[8px] sm:text-xs font-bold text-rose-400">
                        (0 Poin)
                    </span>
                )}

                {!isReviewMode && (
                    <div className="flex h-4.5 w-4.5 sm:h-6 sm:w-6 items-center justify-center">
                        {selected ? (
                            <div className="relative flex h-4 w-4 sm:h-5 sm:w-5 items-center justify-center">
                                <div className="absolute inset-0 rounded-full border-2 border-[#FACC15] animate-pulse" />
                                <div className="h-2.5 w-2.5 sm:h-3 sm:w-3 rounded-full border-2 border-[#FACC15] bg-[#FACC15]" />
                            </div>
                        ) : (
                            <div className="h-3.5 w-3.5 sm:h-5 sm:w-5 rounded-full border-2 border-[#3B28F6] group-hover:border-cyan-400 transition-colors" />
                        )}
                    </div>
                )}
            </div>
        </HexagonButton>
    );
}

/* ============================================================================
   7. MAIN PLAY COMPONENT
   ============================================================================ */
export default function Play({
    quiz,
    has_submitted,
    user_stats,
    character,
}: any) {
    const { auth } = usePage<any>().props;
    const activeCharacter = {
        name: character?.name || 'Noctrun Voss',
        avatar: character?.avatar || '/images/default-avatar.svg',
    };

    const [showQuizTour, setShowQuizTour] = useState(() => {
        if (typeof window !== 'undefined') {
            const completed = localStorage.getItem(
                `course_guide_quiz_completed_${auth?.user?.id || 'guest'}`,
            );
            return completed !== 'true';
        }
        return true;
    });

    const [current, setCurrent] = useState(0);
    const [answers, setAnswers] = useState<any[]>([]);
    const [selected, setSelected] = useState<string[]>([]);
    const [loading, setLoading] = useState(false);
    const [showResult, setShowResult] = useState(false);
    const [finalResult, setFinalResult] = useState<any>(null);

    const initialTimeLeft =
        typeof quiz?.remaining_seconds === 'number'
            ? quiz.remaining_seconds
            : (quiz?.duration || 15) * 60;

    const [timeLeft, setTimeLeft] = useState<number>(initialTimeLeft);

    useEffect(() => {
        if (typeof quiz?.remaining_seconds === 'number') {
            setTimeLeft(quiz.remaining_seconds);
        } else {
            setTimeLeft((quiz?.duration || 15) * 60);
        }
    }, [quiz?.remaining_seconds, quiz?.duration, quiz?.id]);

    const [showTimeExpired, setShowTimeExpired] = useState(false);
    const currentQuestion = quiz?.questions?.[current];

    const [isReviewMode, setIsReviewMode] = useState(() =>
        Boolean(quiz?.is_review),
    );

    useEffect(() => {
        if (
            !quiz?.duration ||
            showResult ||
            showTimeExpired ||
            quiz.is_review ||
            isReviewMode ||
            has_submitted
        )
            return;

        const timer = setInterval(() => {
            setTimeLeft((prev) => {
                if (prev <= 1) {
                    clearInterval(timer);
                    setShowTimeExpired(true);

                    const currentUpdated =
                        selected && selected.length > 0 && currentQuestion
                            ? [
                                  ...answers.filter(
                                      (a) => a.question_id !== currentQuestion.id,
                                  ),
                                  {
                                      question_id: currentQuestion.id,
                                      answer_id: selected,
                                  },
                              ]
                            : answers;

                    submit(currentUpdated, true);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, [
        answers,
        selected,
        currentQuestion,
        showResult,
        showTimeExpired,
        quiz?.duration,
        quiz?.is_review,
        isReviewMode,
        has_submitted,
    ]);

    const formatTimer = (seconds: number) => {
        const m = Math.floor(seconds / 60);
        const s = seconds % 60;
        return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
    };

    useEffect(() => {
        if (isReviewMode && currentQuestion?.user_answer_ids) {
            setSelected(currentQuestion.user_answer_ids);
        }
    }, [current, isReviewMode, currentQuestion]);

    const handleRetry = async () => {
        setIsReviewMode(false);
        setCurrent(0);
        setAnswers([]);
        setSelected([]);
        setShowResult(false);
        setFinalResult(null);

        const csrf = document
            .querySelector('meta[name="csrf-token"]')
            ?.getAttribute('content');
        const restartUrl =
            quiz?.course_slug && quiz?.path_slug
                ? `/courses/${quiz.course_slug}/paths/${quiz.path_slug}/quiz/restart`
                : `/quiz/${quiz?.id}/restart`;
        try {
            const res = await fetch(restartUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': csrf || '',
                    Accept: 'application/json',
                },
                credentials: 'include',
            });
            const data = await res.json();
            setTimeLeft(data.remaining_seconds ?? (quiz?.duration || 15) * 60);
        } catch {
            setTimeLeft((quiz?.duration || 15) * 60);
        }
    };

    const getExitUrl = () => {
        if (quiz?.course_slug && quiz?.path_slug && quiz?.module_slug) {
            return `/learn/${quiz.course_slug}/${quiz.path_slug}/${quiz.module_slug}`;
        }
        return `/courses/${quiz?.course_slug}`;
    };

    const handleExit = () => {
        router.visit(getExitUrl());
    };

    if (!quiz?.questions?.length) return null;

    const question = currentQuestion;
    const total = quiz.questions.length;
    const labels = ['A', 'B', 'C', 'D', 'E'];
    const maxSelectable = question?.max_selectable || 1;

    const selectAnswer = (id: string) => {
        if (loading) return;
        if (maxSelectable === 1) {
            setSelected([id]);
        } else {
            if (selected.includes(id)) {
                setSelected(selected.filter((x) => x !== id));
            } else if (selected.length < maxSelectable) {
                setSelected([...selected, id]);
            }
        }
    };

    const handleBack = () => {
        if (current > 0) {
            setCurrent(current - 1);
            if (!isReviewMode) {
                const prev = answers.find(
                    (a) => a.question_id === quiz.questions[current - 1].id,
                );
                const prevSel = prev?.answer_id;
                setSelected(
                    Array.isArray(prevSel) ? prevSel : prevSel ? [prevSel] : [],
                );
            }
        }
    };

    const next = () => {
        if (isReviewMode) {
            if (current + 1 < total) {
                setCurrent(current + 1);
            } else {
                handleExit();
            }
            return;
        }

        if (selected.length === 0) return;
        const updated = [
            ...answers.filter((a) => a.question_id !== question.id),
            { question_id: question.id, answer_id: selected },
        ];
        setAnswers(updated);
        if (current + 1 < total) {
            setCurrent(current + 1);
            const nextPrev = updated.find(
                (a) => a.question_id === quiz.questions[current + 1].id,
            );
            const nextSel = nextPrev?.answer_id;
            setSelected(
                Array.isArray(nextSel) ? nextSel : nextSel ? [nextSel] : [],
            );
        } else {
            submit(updated);
        }
    };

    const handleProceedTimeExpired = () => {
        setShowTimeExpired(false);
        setShowResult(true);
    };

    const submit = async (finalAnswers: any[], isAutoSubmit = false) => {
        setLoading(true);
        try {
            const csrf = document
                .querySelector('meta[name="csrf-token"]')
                ?.getAttribute('content');
            const formatted = Object.fromEntries(
                (finalAnswers || []).map((a) => [a.question_id, a.answer_id]),
            );
            const submitUrl =
                quiz.course_slug && quiz.path_slug
                    ? `/courses/${quiz.course_slug}/paths/${quiz.path_slug}/quiz/submit`
                    : `/quiz/${quiz.id}/submit`;
            const res = await fetch(submitUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': csrf || '',
                    Accept: 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify({ answers: formatted }),
            });
            const data = await res.json();
            if (!res.ok) {
                setFinalResult({
                    score: 0,
                    passed: false,
                    exp: 0,
                    gold: 0,
                    erp: 0,
                });
                if (!isAutoSubmit) {
                    setShowResult(true);
                }
                return;
            }
            setFinalResult(data.result);
            if (!isAutoSubmit) {
                setShowResult(true);
            }
        } catch {
            setFinalResult({
                score: 0,
                passed: false,
                exp: 0,
                gold: 0,
                erp: 0,
            });
            if (!isAutoSubmit) {
                setShowResult(true);
            }
        } finally {
            setLoading(false);
        }
    };

    const { codeSnippet, questionPrompt } = parseQuestionContent(
        question.question_text || '',
    );

    if (has_submitted && !isReviewMode) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-[#040814] p-4 font-['Rajdhani',sans-serif]">
                <div className="relative w-full max-w-xl rounded-2xl border border-[#FACC15] bg-[#070e20] p-8 text-center shadow-[0_0_50px_rgba(250,204,21,0.2)] md:p-10 text-white">
                    <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full border border-[#FACC15] bg-yellow-500/10">
                        <TriangleAlert className="h-7 w-7 text-yellow-400" />
                    </div>

                    <h1
                        className="mb-4 text-2xl font-bold tracking-[4px] text-white uppercase md:text-3xl"
                        style={{ fontFamily: 'Orbitron, sans-serif' }}
                    >
                        MISSION COMPLETED
                    </h1>

                    <p className="mb-6 text-base font-semibold text-slate-200 md:text-lg">
                        Kamu sudah menyelesaikan quiz ini.
                    </p>

                    <div className="mx-auto mb-8 max-w-lg rounded-xl border border-red-500/40 bg-red-950/30 p-4 text-left shadow-[inset_0_0_15px_rgba(180,0,0,0.2)]">
                        <div className="mb-2 flex items-center gap-2">
                            <div className="text-red-400">
                                <AlertOctagon className="h-5 w-5 font-bold" />
                            </div>
                            <p
                                className="text-xs font-bold tracking-widest text-red-400 uppercase"
                                style={{ fontFamily: 'Orbitron, sans-serif' }}
                            >
                                System Warning
                            </p>
                        </div>
                        <p className="text-xs leading-relaxed text-slate-300 md:text-sm">
                            Quiz ini telah disubmit. Anda{' '}
                            <span className="font-bold text-red-400">
                                tidak dapat mengubah
                            </span>{' '}
                            jawaban atau mengirim ulang kuis ini lagi.
                        </p>
                    </div>

                    <div className="mx-auto flex max-w-md justify-center">
                        <button
                            onClick={handleExit}
                            className="w-full cursor-pointer rounded-xl border border-[#3B28F6] bg-[#3B28F6] py-3 text-xs font-bold tracking-wider text-white uppercase shadow-[0_0_15px_rgba(59,40,246,0.4)] transition-all duration-300 hover:bg-[#2d1ed9] md:text-sm font-['Orbitron',sans-serif]"
                        >
                            KEMBALI KE COURSE
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <>
            <div className="h-screen w-screen bg-[#040814] font-['Rajdhani',sans-serif] text-white flex flex-col justify-between overflow-hidden p-1.5 sm:p-3 md:p-5 hp-landscape-container sm-md-container md-lg-container">
                {/* ── 1. HEADER (FLOATING TOP BAR) ── */}
                <div className="w-full flex items-center justify-between px-1.5 sm:px-4 md:px-6 pt-0 sm:pt-1 pb-0 sm:pb-1 mb-0.5 sm:mb-1 shrink-0 hp-landscape-header-bar sm-md-header-bar md-lg-header-bar">
                    {/* Logo & Stacked Text Left */}
                    <div className="flex items-center gap-2 sm:gap-3">
                        <img
                            src="/images/logo.webp"
                            alt="Skill Ventura Logo"
                            className="h-5 sm:h-8 md:h-10 w-auto object-contain drop-shadow-[0_0_10px_rgba(59,40,246,0.5)] hp-landscape-logo-img sm-md-logo-img md-lg-logo-img"
                        />
                        <div className="flex flex-col leading-tight font-['Orbitron',sans-serif]">
                            <span className="text-white font-extrabold text-[9px] sm:text-xs md:text-base tracking-[1px] sm:tracking-[2px] hp-landscape-logo-text-1 sm-md-logo-text-1 md-lg-logo-text-1">
                                SKILL
                            </span>
                            <span className="text-[#FACC15] font-black text-[10px] sm:text-sm md:text-lg tracking-[1px] sm:tracking-[2px] hp-landscape-logo-text-2 sm-md-logo-text-2 md-lg-logo-text-2">
                                VENTURA
                            </span>
                        </div>
                    </div>

                    {/* Timer Right */}
                    <div className="flex items-center gap-2 sm:gap-3">
                        {isReviewMode ? (
                            <div className="w-[100px] sm:w-[140px] md:w-[190px] hp-landscape-timer-container sm-md-timer-container md-lg-timer-container">
                                <HexagonButton className="!my-0 !py-0.5 !px-1.5 min-h-[26px] sm:min-h-[36px] hp-landscape-timer-button sm-md-timer-button md-lg-timer-button cursor-default">
                                    <span className="font-['Orbitron',sans-serif] text-[9px] sm:text-xs font-bold text-yellow-300">
                                        💡 REVIEW
                                    </span>
                                </HexagonButton>
                            </div>
                        ) : (
                            quiz.duration && (
                                <div className="w-[95px] sm:w-[135px] md:w-[190px] hp-landscape-timer-container sm-md-timer-container md-lg-timer-container">
                                    <HexagonButton className="!my-0 !py-0.5 !px-1.5 min-h-[26px] sm:min-h-[36px] hp-landscape-timer-button sm-md-timer-button md-lg-timer-button cursor-default">
                                        <div
                                            className={`flex items-center justify-center gap-1 sm:gap-2 font-['Orbitron',sans-serif] text-[9px] sm:text-xs md:text-sm font-bold tracking-wider hp-landscape-timer-text-wrap sm-md-timer-text-wrap md-lg-timer-text-wrap ${
                                                timeLeft < 60
                                                    ? 'text-rose-400 animate-pulse'
                                                    : 'text-[#FACC15]'
                                            }`}
                                        >
                                            <Clock className="h-3 w-3 sm:h-4 sm:w-4 text-[#FACC15] hp-landscape-timer-clock-icon sm-md-timer-clock-icon md-lg-timer-clock-icon" />
                                            <span>TIME: {formatTimer(timeLeft)}</span>
                                        </div>
                                    </HexagonButton>
                                </div>
                            )
                        )}
                    </div>
                </div>

                {/* ── 2. MAIN BODY AREA (2-COLUMN GRID IN LANDSCAPE & DESKTOP, STACKED IN PORTRAIT) ── */}
                <div className="w-full flex-1 flex flex-col md:grid md:grid-cols-12 gap-2 sm:gap-3 md:gap-4 lg:gap-5 min-h-0 mb-1 sm:mb-2 overflow-visible">
                    {/* ── LEFT COLUMN: QUESTION BOX (TOP IN PORTRAIT) ── */}
                    <div className="h-[52%] sm:h-[55%] md:h-full w-full flex-1 md:flex-none md:col-span-6 lg:col-span-6 flex flex-col min-h-0 relative p-1 sm:p-2 md:p-3 lg:p-4 sm-md-question-col">
                        <div className="flex-1 min-h-0 w-full relative">
                            <ChamferCard>
                                <AnimatePresence mode="wait">
                                    <motion.div
                                        key={question.id}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -10 }}
                                        transition={{ duration: 0.25 }}
                                        className="flex flex-col h-full overflow-hidden"
                                    >
                                        {/* 1. FIXED TOP NAVBAR inside Question Box */}
                                        <div className="shrink-0 mb-1.5 sm:mb-2 pb-1.5 sm:pb-2 border-b border-indigo-900/40 flex items-center gap-2 sm:gap-3 w-full bg-[#070e20] z-20 hp-landscape-card-top-nav sm-md-card-top-nav md-lg-card-top-nav">
                                            <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
                                                <Gamepad2 className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6 text-[#FACC15] fill-[#FACC15]/20 hp-landscape-gamepad-icon-el sm-md-gamepad-icon-el md-lg-gamepad-icon-el" />
                                                <span className="font-['Orbitron',sans-serif] text-[10px] sm:text-xs md:text-sm font-extrabold text-white tracking-widest hp-landscape-quiz-counter-text sm-md-quiz-counter-text md-lg-quiz-counter-text">
                                                    QUIZ{' '}
                                                    <span className="text-[#6366f1] font-bold ml-0.5 sm:ml-1">
                                                        {String(current + 1).padStart(2, '0')}{' '}
                                                        / {String(total).padStart(2, '0')}
                                                    </span>
                                                </span>
                                            </div>

                                            {/* Progress Bar Line */}
                                            <div className="flex-1 h-1 sm:h-1.5 bg-slate-900/80 rounded-full overflow-hidden relative border border-indigo-900/50 hp-landscape-progress-bar-h sm-md-progress-bar-h md-lg-progress-bar-h">
                                                <motion.div
                                                    className="h-full bg-[#6366f1] rounded-full shadow-[0_0_8px_rgba(99,102,241,0.6)]"
                                                    initial={{ width: 0 }}
                                                    animate={{ width: `${((current + 1) / total) * 100}%` }}
                                                    transition={{ duration: 0.3 }}
                                                />
                                            </div>
                                        </div>

                                        {/* 2. FIXED PHOTO / IMAGE MEDIA (If present) */}
                                        {question.media_url && (
                                            <div className="shrink-0 my-1 sm:my-1.5 flex w-full justify-center overflow-hidden rounded-xl border border-slate-700/50 bg-[#050914] p-1 sm:p-2">
                                                <img
                                                    src={question.media_url}
                                                    alt="Media Soal"
                                                    className="max-h-[80px] sm:max-h-[140px] md:max-h-[220px] w-auto object-contain"
                                                />
                                            </div>
                                        )}

                                        {/* 3. SCROLLABLE QUESTION PROMPT & CODE SECTION */}
                                        <div className="flex-1 overflow-y-auto min-h-0 pr-1 flex flex-col gap-1.5 sm:gap-2">
                                            {codeSnippet && <CodeBlock code={codeSnippet} />}

                                            <div className="mt-0.5 sm:mt-1">
                                                <div className="flex items-center gap-2 mb-1 hp-landscape-question-header-row sm-md-question-header-row md-lg-question-header-row">
                                                    <div className="flex h-4.5 w-4.5 sm:h-6 sm:w-6 items-center justify-center rounded-full bg-[#3B28F6] text-white text-[9px] sm:text-xs font-bold font-['Orbitron',sans-serif] hp-landscape-question-badge-circle sm-md-question-badge-circle md-lg-question-badge-circle">
                                                        ?
                                                    </div>
                                                    <h3 className="font-['Orbitron',sans-serif] font-bold text-xs sm:text-sm md:text-lg text-cyan-400 tracking-wide hp-landscape-question-title-text sm-md-question-title-text md-lg-question-title-text">
                                                        Pertanyaan
                                                    </h3>
                                                </div>

                                                <FormattedQuestionText text={questionPrompt} />

                                                {question.max_selectable > 1 && (
                                                    <span className="mt-1 sm:mt-1.5 inline-block rounded-full bg-yellow-400/20 px-2.5 py-0.5 text-[9px] sm:text-xs font-bold text-yellow-400 border border-yellow-400/30 font-['Orbitron',sans-serif]">
                                                        (Pilih {question.max_selectable} Jawaban)
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    </motion.div>
                                </AnimatePresence>
                            </ChamferCard>
                        </div>
                    </div>

                    {/* ── RIGHT COLUMN: ANSWER OPTIONS (BOTTOM IN PORTRAIT, RIGHT IN LANDSCAPE) ── */}
                    <div className="h-[48%] sm:h-[45%] md:h-full w-full shrink-0 md:shrink md:col-span-6 lg:col-span-6 flex flex-col justify-center min-h-0 relative p-0.5 sm:p-2 md:px-3 lg:px-6 sm-md-answers-col">
                        <div className="flex flex-col justify-start md:justify-center gap-2 sm:gap-2.5 md:gap-2 hp-landscape-options-wrapper sm-md-options-wrapper md-lg-options-wrapper my-auto max-h-full overflow-y-auto py-1 pr-1">
                            <AnimatePresence mode="wait">
                                <motion.div
                                    key={question.id + '-answers'}
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    transition={{ duration: 0.25 }}
                                    className="flex flex-col gap-2 sm:gap-2.5 md:gap-2 hp-landscape-options-wrapper sm-md-options-wrapper md-lg-options-wrapper"
                                >
                                    {question.answers.map((a: any, idx: number) => (
                                        <AnswerOption
                                            key={a.id}
                                            label={labels[idx] ?? String(idx + 1)}
                                            text={a.answer_text}
                                            selected={selected.includes(a.id)}
                                            isCorrect={a.is_correct}
                                            isReviewMode={isReviewMode}
                                            questionScore={
                                                question.max_score ||
                                                question.question_score ||
                                                20
                                            }
                                            onClick={() => selectAnswer(a.id)}
                                        />
                                    ))}
                                </motion.div>
                            </AnimatePresence>
                        </div>
                    </div>
                </div>

                {/* ── 3. BOTTOM FOOTER BAR WITH HEXAGON BACK & NEXT BUTTONS ── */}
                <div className="w-full flex items-center justify-between px-2 sm:px-4 md:px-6 py-1 sm:py-2 shrink-0 border-t border-indigo-900/30 bg-[#040814]/80 backdrop-blur-sm hp-landscape-footer-bar sm-md-footer-bar md-lg-footer-bar">
                    {/* BACK BUTTON (Bottom Left) */}
                    <div className="w-[110px] sm:w-[150px] md:w-[200px] hp-landscape-footer-btn-container sm-md-footer-btn-container md-lg-footer-btn-container">
                        <HexagonButton
                            onClick={handleBack}
                            disabled={current === 0}
                            className="!my-0 !py-0.5 sm:!py-1 min-h-[28px] sm:min-h-[36px] md:min-h-[44px] hp-landscape-footer-btn-el sm-md-footer-btn-el md-lg-footer-btn-el"
                        >
                            <span className="flex items-center justify-center w-full gap-1.5 sm:gap-2 font-['Orbitron',sans-serif] font-bold text-[10px] sm:text-xs md:text-sm text-white hp-landscape-footer-btn-label sm-md-footer-btn-label md-lg-footer-btn-label">
                                <span>&lt;</span> KEMBALI
                            </span>
                        </HexagonButton>
                    </div>

                    {/* NEXT / FINISH BUTTON (Bottom Right - Solid Yellow Fill) */}
                    <div className="w-[110px] sm:w-[150px] md:w-[200px] hp-landscape-footer-btn-container sm-md-footer-btn-container md-lg-footer-btn-container">
                        <HexagonButton
                            onClick={next}
                            isYellowFill={true}
                            disabled={(!isReviewMode && !selected?.length) || loading}
                            className="!my-0 !py-0.5 sm:!py-1 min-h-[28px] sm:min-h-[36px] md:min-h-[44px] hp-landscape-footer-btn-el sm-md-footer-btn-el md-lg-footer-btn-el"
                        >
                            <span className="flex items-center justify-center w-full gap-1.5 sm:gap-2 font-['Orbitron',sans-serif] font-black text-[10px] sm:text-xs md:text-sm text-black hp-landscape-footer-btn-label sm-md-footer-btn-label md-lg-footer-btn-label">
                                {loading ? (
                                    '...'
                                ) : current + 1 === total ? (
                                    isReviewMode ? (
                                        'KELUAR'
                                    ) : (
                                        <>
                                            FINISH <Flag className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-black" strokeWidth={3} />
                                        </>
                                    )
                                ) : (
                                    <>
                                        LANJUT <span>&gt;</span>
                                    </>
                                )}
                            </span>
                        </HexagonButton>
                    </div>
                </div>
            </div>

            <ResultModal
                open={showResult}
                result={finalResult}
                onClose={handleExit}
                onRetry={handleRetry}
            />
            <TimeExpiredModal
                open={showTimeExpired}
                onProceed={handleProceedTimeExpired}
            />

            {showQuizTour && (
                <CourseOnboardingTour
                    character={activeCharacter}
                    phase="quiz"
                    onClose={() => {
                        setShowQuizTour(false);
                        if (typeof window !== 'undefined') {
                            localStorage.setItem(
                                `course_guide_quiz_completed_${auth?.user?.id || 'guest'}`,
                                'true',
                            );
                        }
                    }}
                />
            )}
        </>
    );
}
