import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import ResultModal from "@/components/QuestionForm/ResultModal"
import { router } from "@inertiajs/react"

/* ─────────────────────────────────────────────
   LAYERED-BORDER HELPERS
   ───────────────────────────────────────────── */

/** Outer glow + three stacked neon rectangles with corner cuts */
function CyberFrame({
    children,
    className = "",
    color = "#00d4ff",
    accent = "#f5c518",
}: {
    children: React.ReactNode
    className?: string
    color?: string
    accent?: string
}) {
    return (
        <div
            className={`relative ${className}`}
            style={
                {
                    "--neon": color,
                    "--acc": accent,
                } as React.CSSProperties
            }
        >
            {/* ── layer 3 (outermost) ── */}
            <div
                className="absolute inset-0 rounded-none pointer-events-none"
                style={{
                    border: `1px solid var(--neon)`,
                    boxShadow: `0 0 8px 1px var(--neon), inset 0 0 6px 1px var(--neon)`,
                    opacity: 0.45,
                }}
            />
            {/* ── layer 2 ── */}
            <div
                className="absolute inset-[4px] rounded-none pointer-events-none"
                style={{
                    border: `1px solid var(--neon)`,
                    opacity: 0.3,
                }}
            />
            {/* ── layer 1 (innermost) ── */}
            <div
                className="absolute inset-[8px] rounded-none pointer-events-none"
                style={{
                    border: `1px solid var(--neon)`,
                    opacity: 0.2,
                }}
            />

            {/* corner accents */}
            {["top-0 left-0", "top-0 right-0", "bottom-0 left-0", "bottom-0 right-0"].map(
                (pos, i) => (
                    <span
                        key={i}
                        className={`absolute ${pos} w-4 h-4 pointer-events-none`}
                        style={{
                            borderTop: i < 2 ? `2px solid var(--acc)` : undefined,
                            borderBottom: i >= 2 ? `2px solid var(--acc)` : undefined,
                            borderLeft: i % 2 === 0 ? `2px solid var(--acc)` : undefined,
                            borderRight: i % 2 === 1 ? `2px solid var(--acc)` : undefined,
                            boxShadow: `0 0 6px var(--acc)`,
                        }}
                    />
                )
            )}

            {/* content sits above all pseudo layers */}
            <div className="relative z-10">{children}</div>
        </div>
    )
}

/** Answer option button with layered border and no bg */
function AnswerButton({
    label,
    text,
    selected,
    onClick,
}: {
    label: string
    text: string
    selected: boolean
    onClick: () => void
}) {
    return (
        <motion.button
            whileTap={{ scale: 0.97 }}
            onClick={onClick}
            className="relative w-full text-left group"
            style={{ minHeight: 56 }}
        >
            {/* outer border */}
            <div
                className="absolute inset-0 pointer-events-none transition-all duration-200"
                style={{
                    border: selected
                        ? "1px solid #00d4ff"
                        : "1px solid rgba(0,212,255,0.35)",
                    boxShadow: selected
                        ? "0 0 10px 2px #00d4ff88, inset 0 0 8px 1px #00d4ff44"
                        : "none",
                }}
            />
            {/* mid border */}
            <div
                className="absolute inset-[3px] pointer-events-none transition-all duration-200"
                style={{
                    border: selected
                        ? "1px solid rgba(0,212,255,0.5)"
                        : "1px solid rgba(0,212,255,0.15)",
                }}
            />
            {/* inner border */}
            <div
                className="absolute inset-[6px] pointer-events-none"
                style={{
                    border: selected
                        ? "1px solid rgba(0,212,255,0.25)"
                        : "1px solid rgba(0,212,255,0.07)",
                }}
            />

            {/* selected fill */}
            {selected && (
                <div
                    className="absolute inset-0 pointer-events-none"
                    style={{
                        background: "linear-gradient(90deg, rgba(0,212,255,0.12) 0%, transparent 100%)",
                    }}
                />
            )}

            <div className="relative z-10 flex items-center gap-3 px-5 py-3">
                <span
                    className="font-mono text-sm font-bold shrink-0 transition-colors duration-200"
                    style={{ color: selected ? "#00d4ff" : "rgba(0,212,255,0.6)" }}
                >
                    {label}.
                </span>
                <span
                    className="text-sm leading-snug transition-colors duration-200"
                    style={{ color: selected ? "#ffffff" : "rgba(255,255,255,0.75)" }}
                >
                    {text}
                </span>
            </div>
        </motion.button>
    )
}

/* ─────────────────────────────────────────────
   MAIN COMPONENT
   ───────────────────────────────────────────── */
export default function Play({ quiz, has_submitted }: any) {
    const [current, setCurrent] = useState(0)
    const [answers, setAnswers] = useState<any[]>([])
    const [selected, setSelected] = useState<string | null>(null)
    const [loading, setLoading] = useState(false)
    const [showResult, setShowResult] = useState(false)
    const [finalResult, setFinalResult] = useState<any>(null)

    if (!quiz.questions.length) return null

    const question = quiz.questions[current]
    const total = quiz.questions.length
    const labels = ["A", "B", "C", "D", "E"]

    const selectAnswer = (id: string) => {
        if (loading) return
        setSelected(id)
    }

    const handleBack = () => {
        if (current > 0) {
            setCurrent(current - 1)
            // restore previously saved answer for that question
            const prev = answers.find(a => a.question_id === quiz.questions[current - 1].id)
            setSelected(prev?.answer_id ?? null)
        }
    }

    const next = () => {
        if (!selected) return

        const updated = [
            ...answers.filter(a => a.question_id !== question.id),
            { question_id: question.id, answer_id: selected },
        ]
        setAnswers(updated)
        setSelected(null)

        if (current + 1 < total) {
            setCurrent(current + 1)
        } else {
            submit(updated)
        }
    }

    const submit = async (finalAnswers: any[]) => {
        setLoading(true)
        try {
            const csrf = document.querySelector('meta[name="csrf-token"]')?.getAttribute("content")
            const formatted = Object.fromEntries(finalAnswers.map(a => [a.question_id, a.answer_id]))
            const res = await fetch(`/student/quiz/${quiz.id}/submit`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "X-CSRF-TOKEN": csrf || "",
                    Accept: "application/json",
                },
                credentials: "include",
                body: JSON.stringify({ answers: formatted }),
            })
            const data = await res.json()
            if (!res.ok) { alert(data.message || "Submit gagal"); return }
            setFinalResult(data.result)
            setShowResult(true)
        } catch {
            alert("Submit gagal")
        } finally {
            setLoading(false)
        }
    }

    /* ── ALREADY SUBMITTED ── */
    if (has_submitted) {
        return (
            <div
                className="min-h-screen flex items-center justify-center"
                style={{ background: "#04080f", fontFamily: "'Rajdhani', sans-serif" }}
            >
                <CyberFrame className="p-10 text-center" color="#00d4ff" accent="#f5c518">
                    <h1 className="text-2xl font-bold mb-4 text-white" style={{ letterSpacing: 2 }}>
                        🎯 MISSION COMPLETED
                    </h1>
                    <p className="text-gray-400 mb-6">Kamu sudah menyelesaikan quiz ini.</p>
                    <button
                        onClick={() => router.visit(`/student/courses/${quiz.course_slug}`)}
                        className="px-8 py-2 font-bold text-white"
                        style={{
                            background: "transparent",
                            border: "1px solid #00d4ff",
                            boxShadow: "0 0 8px #00d4ff88",
                            letterSpacing: 1,
                        }}
                    >
                        KEMBALI KE COURSE
                    </button>
                </CyberFrame>
            </div>
        )
    }

    /* ── PLAY ── */
    return (
        <>
            {/* Google Font */}
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Rajdhani:wght@400;600;700&family=Share+Tech+Mono&display=swap');

                body { background: #04080f; }

                .scan-line {
                    background: repeating-linear-gradient(
                        0deg,
                        transparent,
                        transparent 2px,
                        rgba(0,212,255,0.015) 2px,
                        rgba(0,212,255,0.015) 4px
                    );
                    pointer-events: none;
                }

                @keyframes flicker {
                    0%, 98%, 100% { opacity: 1 }
                    99% { opacity: 0.92 }
                }
            `}</style>

            <div
                className="min-h-screen flex flex-col"
                style={{
                    background: "radial-gradient(ellipse at 50% 0%, #071223 0%, #04080f 70%)",
                    fontFamily: "'Rajdhani', sans-serif",
                    animation: "flicker 8s infinite",
                }}
            >
                {/* scan-line overlay */}
                <div className="fixed inset-0 scan-line z-0 pointer-events-none" />

                {/* ── MAIN CONTENT ── */}
                <div className="relative z-10 flex-1 flex flex-col items-center justify-center p-6">
                    <div className="w-full max-w-5xl">

                        {/* QUESTION NUMBER BADGE */}
                        <div className="flex justify-center mb-4">
                            <div
                                className="px-5 py-1 font-mono text-xs tracking-widest"
                                style={{
                                    border: "1px solid rgba(245,197,24,0.5)",
                                    color: "#f5c518",
                                    background: "rgba(245,197,24,0.06)",
                                    letterSpacing: 4,
                                }}
                            >
                                QUESTION {String(current + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}
                            </div>
                        </div>

                        {/* SPLIT LAYOUT */}
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={question.id}
                                initial={{ opacity: 0, x: 40 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -40 }}
                                transition={{ duration: 0.28, ease: "easeInOut" }}
                                className="grid grid-cols-1 lg:grid-cols-2 gap-6"
                            >
                                {/* ── LEFT: QUESTION ── */}
                                <CyberFrame color="#00d4ff" accent="#f5c518">
                                    <div className="p-6 lg:p-8">
                                        {/* image or placeholder */}
                                        {question.media_url ? (
                                            <div className="mb-5 relative">
                                                <div
                                                    className="absolute inset-0 pointer-events-none"
                                                    style={{
                                                        border: "1px solid rgba(0,212,255,0.3)",
                                                        boxShadow: "inset 0 0 12px rgba(0,212,255,0.1)",
                                                    }}
                                                />
                                                <img
                                                    src={question.media_url}
                                                    alt="question media"
                                                    className="w-full object-cover"
                                                    style={{ maxHeight: 220, display: "block" }}
                                                />
                                            </div>
                                        ) : null}

                                        {/* question text */}
                                        <p
                                            className="text-white leading-relaxed text-base lg:text-[17px]"
                                            style={{ fontWeight: 600, letterSpacing: 0.3 }}
                                        >
                                            {question.question_text}
                                        </p>
                                    </div>
                                </CyberFrame>

                                {/* ── RIGHT: ANSWERS ── */}
                                <div className="flex flex-col gap-3">
                                    {question.answers.map((a: any, idx: number) => (
                                        <AnswerButton
                                            key={a.id}
                                            label={labels[idx] ?? String(idx + 1)}
                                            text={a.answer_text}
                                            selected={selected === a.id}
                                            onClick={() => selectAnswer(a.id)}
                                        />
                                    ))}
                                </div>
                            </motion.div>
                        </AnimatePresence>
                    </div>
                </div>

                {/* ── BOTTOM NAV ── */}
                <div
                    className="relative z-10 w-full"
                    style={{
                        background: "linear-gradient(180deg, transparent 0%, rgba(4,8,15,0.95) 30%)",
                        borderTop: "1px solid rgba(0,212,255,0.2)",
                        boxShadow: "0 -4px 24px rgba(0,212,255,0.08)",
                    }}
                >
                    <div className="max-w-5xl mx-auto flex items-center justify-between px-6 py-3 gap-4">

                        {/* BACK */}
                        <motion.button
                            whileTap={{ scale: 0.96 }}
                            onClick={handleBack}
                            disabled={current === 0}
                            className="relative flex items-center gap-2 px-8 py-3 font-bold tracking-widest text-sm"
                            style={{
                                background: "rgba(0,0,0,0.5)",
                                border: "1px solid rgba(0,212,255,0.4)",
                                color: current === 0 ? "rgba(255,255,255,0.25)" : "#00d4ff",
                                letterSpacing: 3,
                                minWidth: 130,
                                justifyContent: "center",
                                cursor: current === 0 ? "not-allowed" : "pointer",
                            }}
                        >
                            <span style={{ fontSize: 18, lineHeight: 1 }}>«</span>
                            BACK
                        </motion.button>

                        {/* PROGRESS INDICATOR */}
                        <div className="flex flex-col items-center gap-1 flex-1 max-w-xs">
                            <span
                                className="font-mono font-bold"
                                style={{
                                    color: "#f5c518",
                                    fontSize: 22,
                                    textShadow: "0 0 10px #f5c51888",
                                    letterSpacing: 1,
                                }}
                            >
                                {current + 1}.
                                <span style={{ color: "rgba(245,197,24,0.5)", fontSize: 14 }}>
                                    /{total}
                                </span>
                            </span>
                            {/* thin progress bar */}
                            <div
                                className="w-full rounded-none overflow-hidden"
                                style={{ height: 3, background: "rgba(0,212,255,0.1)", border: "1px solid rgba(0,212,255,0.2)" }}
                            >
                                <motion.div
                                    initial={false}
                                    animate={{ width: `${((current + 1) / total) * 100}%` }}
                                    transition={{ duration: 0.35 }}
                                    style={{
                                        height: "100%",
                                        background: "linear-gradient(90deg, #00d4ff, #f5c518)",
                                        boxShadow: "0 0 6px #00d4ff",
                                    }}
                                />
                            </div>
                        </div>

                        {/* NEXT / FINISH */}
                        <motion.button
                            whileTap={{ scale: 0.96 }}
                            onClick={next}
                            disabled={!selected || loading}
                            className="relative flex items-center gap-2 px-8 py-3 font-bold tracking-widest text-sm"
                            style={{
                                background: selected && !loading
                                    ? "linear-gradient(135deg, rgba(0,212,255,0.18), rgba(245,197,24,0.08))"
                                    : "rgba(0,0,0,0.5)",
                                border: selected && !loading
                                    ? "1px solid #00d4ff"
                                    : "1px solid rgba(0,212,255,0.2)",
                                boxShadow: selected && !loading
                                    ? "0 0 14px rgba(0,212,255,0.35)"
                                    : "none",
                                color: selected && !loading ? "#ffffff" : "rgba(255,255,255,0.25)",
                                letterSpacing: 3,
                                minWidth: 130,
                                justifyContent: "center",
                                cursor: !selected || loading ? "not-allowed" : "pointer",
                                transition: "all 0.2s",
                            }}
                        >
                            {loading
                                ? "PROCESSING..."
                                : current + 1 === total
                                    ? "FINISH"
                                    : "NEXT"}
                            {!loading && (
                                <span style={{ fontSize: 18, lineHeight: 1 }}>»</span>
                            )}
                        </motion.button>
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
