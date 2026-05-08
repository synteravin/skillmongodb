import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import ResultModal from "@/components/QuestionForm/ResultModal"
import { router } from "@inertiajs/react"
import { Flag } from "lucide-react"
 
/* ─────────────────────────────────────────────
   BOX SOAL
   ───────────────────────────────────────────── */
function BoxSoal({  question }: { current: number, total: number, question: any }) {
    return (
        <div className="relative w-full h-full p-4 md:p-6 lg:p-8">
            {/* <div className="absolute top-0 left-0 w-8 md:w-12 h-8 md:h-12 border-t-[3px] border-l-[3px] border-[#FACC15] z-20"></div>
            <div className="absolute top-0 right-0 w-8 md:w-12 h-8 md:h-12 border-t-[3px] border-r-[3px] border-[#FACC15] z-20"></div>
            <div className="absolute bottom-0 left-0 w-8 md:w-12 h-8 md:h-12 border-b-[3px] border-l-[3px] border-[#FACC15] z-20"></div>
            <div className="absolute bottom-0 right-0 w-8 md:w-12 h-8 md:h-12 border-b-[3px] border-r-[3px] border-[#FACC15] z-20"></div> */}

<div className="w-full h-full p-[4px] bg-[#3B28F6]">
  <div className="w-full h-full p-[15px] bg-[#04080f]">
    
    <div className="w-full h-full p-[4px] bg-[#3B28F6]">
      <div className="w-full h-full p-[15px] bg-[#04080f]">
        
        {/* Inner Content */}
        <div className="relative w-full h-full bg-[#04080f] p-9 min-h-[350px] flex flex-col border-4 border-[#3B28F6]">

            {/* ================= garis raide atas  ================= */}
            <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-[270px] h-[9px]  overflow-visible z-20">
            <div className="relative w-full h-full flex items-center justify-center">

                {/* ================= TRAPESIUM (ATAS) ================= */}
                <div
                className="absolute -top-2 left-1/2 -translate-x-1/2 w-[273px] h-[8.5px] bg-yellow-400"
                style={{
                  clipPath: "polygon(0% 0%, 100% 0%, 90% 100%, 10% 100%)"
                }}
                />
                <div className="absolute top-0.5 left-34 -translate-x-1/2 w-[227px] h-[5.5px] bg-[#3B28F6]" />

                {/* ================= TITIK KUNING (BAWAH) ================= */}
                <div className="absolute top-2 left-1/2 -translate-x-1/2 w-[227px] flex justify-between px-2">
                {Array.from({ length: 10 }).map((_, i) => (
                    <div key={i} className="w-2 h-2 bg-yellow-400 rounded-full" />
                ))}
                </div>

                {/* tanda > kanan */}
                <div className="absolute right-3 mt-7 -translate-y-1/2">
                <div className="relative w-[32px] h-[32px]">

                    {/* garis atas */}
                    <div className="absolute top-1/2 -left-58 w-[32px] h-[4.5px] bg-[#3B28F6] rotate-[19deg] origin-right  rounded-full" />
                    
                    {/* garis bawah */}
                    <div className="absolute top-1/2 -left-58 w-[32px] h-[4px] bg-[#3B28F6] -rotate-[19deg] origin-right rounded-full" />

                </div>
                </div>
               {/* tanda < kiri (hasil mirror dari >) */}
                <div className="absolute left-3 mt-7 -translate-y-1/2">
                <div className="relative w-[32px] h-[32px]">

                    {/* garis atas */}
                    <div className="absolute top-1/2 -right-58 w-[32px] h-[4.5px] bg-[#3B28F6] -rotate-[19deg] origin-left rounded-full" />
                    
                    {/* garis bawah */}
                    <div className="absolute top-1/2 -right-58 w-[32px] h-[4px] bg-[#3B28F6] rotate-[19deg] origin-left rounded-full" />

                </div>
                </div>
                                
            </div>
            </div>
            {/* ================= garis raide BAWAH ================= */}
            <div className="absolute -bottom-[35px] left-1/2 -translate-x-1/2 w-[270px] h-[9px] overflow-visible z-20">
            <div className="relative w-full h-full flex items-center justify-center">

                  {/* ================= TITIK KUNING ================= */}
                <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-[227px] flex justify-between px-2">
                {Array.from({ length: 10 }).map((_, i) => (
                    <div key={i} className="w-2 h-2 bg-yellow-400 rounded-full" />
                ))}
                </div>

                {/* garis tengah */}
                <div className="absolute top-0.5 left-1/2 -translate-x-1/2 w-[227px] h-[5.5px] bg-[#3B28F6]" />

                {/* ================= BOX KUNING ================= */}
                <div
                className="absolute top-2 left-1/2 -translate-x-1/2 w-[264px] h-[9px] bg-yellow-400"
                style={{
                    clipPath: "polygon(8% 0%, 92% 0%, 100% 100%, 0% 100%)",
                }}
                />

                {/* tanda > kanan */}
                <div className="absolute right-3 mt-7 -translate-y-1/2">
                <div className="relative w-[32px] h-[32px]">

                    <div className="absolute top-1/2 -left-58 w-[32px] h-[4.5px] bg-[#3B28F6] rotate-[19deg] origin-right rounded-full" />
                    
                    <div className="absolute top-1/2 -left-58 w-[32px] h-[4px] bg-[#3B28F6] -rotate-[19deg] origin-right rounded-full" />

                </div>
                </div>

                {/* tanda < kiri */}
                <div className="absolute left-3 mt-7 -translate-y-1/2">
                <div className="relative w-[32px] h-[32px]">

                    <div className="absolute top-1/2 -right-58 w-[32px] h-[4.5px] bg-[#3B28F6] -rotate-[19deg] origin-left rounded-full" />
                    
                    <div className="absolute top-1/2 -right-58 w-[32px] h-[4px] bg-[#3B28F6] rotate-[19deg] origin-left rounded-full" />

                </div>
                </div>

            </div>
            </div>
            {/* ================= ORIGINAL CUT HITAM ================= */}
            <div className="absolute -top-6 left-1/2 -translate-x-1/2 w-[270px] h-[8px] bg-[#04080f] z-10" />
            <div className="absolute  -top-2 left-1/2 -translate-x-1/2 w-[270px] h-[9px] bg-[#04080f] z-10" />
            <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 w-[270px] h-[8px] bg-[#04080f] z-10" />
            <div className="absolute -bottom-11 left-1/2 -translate-x-1/2 w-[270px] h-[8px] bg-[#04080f] z-10" />

                {/* Content */}
            <div className="flex flex-col flex-1 gap-4 min-h-0 w-full">

                {question.media_url && (
                    <div className="w-full flex-shrink-0 h-[120px] md:h-[150px] lg:h-[180px] -mt-4 flex items-center justify-center">
                        <img
                            src={question.media_url}
                            alt="Soal"
                            className="w-full h-full object-contain"
                        />
                    </div>
                )}

                <div
                    className="
                     flex-1 overflow-y-auto min-h-0 w-full max-w-[700px] mx-auto text-white font-semibold px-2 md:px-4
                    text-sm sm:text-base md:text-xs lg:text-xs xl:text-sm 2xl:text-lg
                    leading-normal

                    [scrollbar-width:thin] [scrollbar-color:#3B28F6_#0d0d1a]
                    [&::-webkit-scrollbar]:w-[6px]
                    [&::-webkit-scrollbar-track]:bg-[#0d0d1a]
                    [&::-webkit-scrollbar-track]:rounded-full
                    [&::-webkit-scrollbar-thumb]:bg-[#3B28F6]
                    [&::-webkit-scrollbar-thumb]:rounded-full
                    [&::-webkit-scrollbar-thumb:hover]:bg-[#5a46ff]
                "
                >
                    {question.question_text}
                </div>

            </div>
                    </div>
                </div>

                </div>
                </div>

            </div>
            </div>
                )
            }


 
function AnswerButton({ label, text, selected, onClick }: any) {
    const outerClip = "polygon(0 0, 30px 0, 45px 15px, 120px 15px, 135px 0, 100% 0, 100% 100%, 0 100%)";
    const innerClip = "polygon(0 0, 31px 0, 46px 14px, 119px 14px, 134px 0, 100% 0, 100% 100%, 0 100%)";

    return (
        <motion.button
            whileTap={{ scale: 0.98 }}
            onClick={onClick}
            className="w-full text-left relative group mb-6 outline-none block mt-7"
        >
          <div className="relative">

        {/* ================= TOP TRAPEZIUM ================= */}
        <div
            className="absolute -top-[14px] w-[173px] h-[12px] z-[1]"
        >
            <svg
            className="absolute inset-0 w-full h-full overflow-visible"
            viewBox="0 0 100 8"
            preserveAspectRatio="none"
            >
            <path
                d="
                M10 0
                L90 0
                L100 8
                L0 8
                Z
                "
                fill="none"
                stroke="#3B82F6"
                strokeWidth="1"
                vectorEffect="non-scaling-stroke"
            />
            </svg>
        </div>

        {/* ================= CUT LINE ================= */}
        <div
        className="absolute -top-[3px] left-[34.5px] w-[97px] h-[2px] bg-[#04080f] z-[3] rounded-bl-sm rounded-br-md"
        />

        {/* ================= BOTTOM TRAPEZIUM ================= */}
        <div
            className="absolute -top-1 left-[34px] w-[98px] h-[16px] z-[2]"
        >
            <svg
            className="absolute inset-0 w-full h-full overflow-visible"
            viewBox="0 0 100 16"
            preserveAspectRatio="none"
            >
            <path
                d="
                M0 2
                L13 15
                L87 15
                L100 2
                "
                fill="none"
                stroke="#3B82F6"
                strokeWidth="1.2"
                vectorEffect="non-scaling-stroke"
            />
            </svg>
        </div>

        </div>


            {/* Wrapper Border (Outer) */}
            <div
                className={`p-[2px] transition-colors duration-300 ${
                    selected ? "bg-[#FACC15]" : "bg-[#3B28F6] group-hover:bg-[#00e5ff]"
                }`}
                style={{ clipPath: outerClip }}
            > 
                {/* Konten Utama (Inner) */}
                <div
                    className={`w-full h-full transition-colors duration-300 pt-4 ${
                        selected ? "bg-[#1a1505]" : "bg-[#0a0f1d]"
                    }`}
                    style={{ clipPath: innerClip }}
                >
                    {/* Hover Glow Effect */}
                    <div
                        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"
                        style={{ background: "linear-gradient(90deg, rgba(59,40,246,0.2) 0%, transparent 100%)" }}
                    />

                    {/* Content Layout */}
                    <div className="px-2 py-2 flex gap-4 relative z-10 items-start">
                        <span className={`font-mono font-bold text-lg mt-0.5 ${
                            selected ? "text-[#FACC15]" : "text-[#3B28F6] group-hover:text-[#00e5ff]"
                        }`}>
                            {label}.
                        </span>
                        <span className={`text-base leading-relaxed ${
                            selected ? "text-white" : "text-gray-300 group-hover:text-white"
                        }`}>
                            {text}
                        </span>
                    </div>
                </div>
            </div>
        </motion.button>
    );
}
/* ─────────────────────────────────────────────
   MAIN COMPONENT
   ───────────────────────────────────────────── */
export default function Play({ quiz, has_submitted }: any) {
    const [current, setCurrent]         = useState(0)
    const [answers, setAnswers]         = useState<any[]>([])
    const [selected, setSelected]       = useState<string | null>(null)
    const [loading, setLoading]         = useState(false)
    const [showResult, setShowResult]   = useState(false)
    const [finalResult, setFinalResult] = useState<any>(null)
 
    if (!quiz?.questions?.length) return null
 
    const question = quiz.questions[current]
    const total    = quiz.questions.length
    const labels   = ["A", "B", "C", "D", "E"]
 
    const selectAnswer = (id: string) => { if (!loading) setSelected(id) }
 
    const handleBack = () => {
        if (current > 0) {
            setCurrent(current - 1)
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
            const csrf      = document.querySelector('meta[name="csrf-token"]')?.getAttribute("content")
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
            <div className="min-h-screen flex items-center justify-center bg-[#04080f] font-['Rajdhani',sans-serif]">
                <div
                    className="p-10 border-2 border-[#3B28F6] text-center relative"
                    style={{ clipPath: "polygon(30px 0, 100% 0, 100% calc(100% - 30px), calc(100% - 30px) 100%, 0 100%, 0 30px)" }}
                >
                    <div className="absolute top-0 left-0 w-8 h-8 border-t-[3px] border-l-[3px] border-[#FACC15] z-20" />
                    <div className="absolute bottom-0 right-0 w-8 h-8 border-b-[3px] border-r-[3px] border-[#FACC15] z-20" />
                    <h1 className="text-3xl font-bold mb-4 text-[#FACC15] tracking-[4px]">MISSION COMPLETED</h1>
                    <p className="text-gray-300 mb-8 text-lg">Kamu sudah menyelesaikan quiz ini.</p>
                    <button
                        onClick={() => router.visit(`/student/courses/${quiz.course_slug}`)}
                        className="px-8 py-3 font-bold text-black bg-[#FACC15] hover:bg-yellow-300 transition-colors"
                        style={{ clipPath: "polygon(15px 0, 100% 0, calc(100% - 15px) 100%, 0 100%)", letterSpacing: 2 }}
                    >
                        KEMBALI KE COURSE
                    </button>
                </div>
            </div>
        )
    }
 
    /* ── PLAY ── */
    return (
        <>
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Rajdhani:wght@500;600;700&family=Share+Tech+Mono&display=swap');
 
                html, body {
                    overflow: hidden !important;
                    height: 100vh !important;
                    background: #04080f;
                    -ms-overflow-style: none;
                }
                html::-webkit-scrollbar,
                body::-webkit-scrollbar { display: none; }
 
                :root {
                    /* tinggi footer wrapper */
                    --footer-h: 90px;
 
                    /* trapesium biru kiri & kanan */
                    --footer-trap-w: 442px;
                    --footer-trap-h: 50px;
 
                    /* garis kuning bawah kiri & kanan */
                    --footer-line-bottom-w: 381px;
 
                    /* garis kuning tengah atas */
                    --footer-line-top-w: 42%;
 
                    /* posisi diagonal 
                    --footer-diag-left: 444px;   
                    --footer-diag-right: 440px;  
 
                    /* container tombol */
                    --footer-btn-container-w: 42%;
                    --footer-btn-container-margin-left: -21%;
                    --footer-btn-container-top: calc(43% + 12px);
 
                    /* tombol back & next */
                    --footer-btn-left: -49px;
                    --footer-btn-right: -49px;
                    --footer-btn-w: 220px;
                    --footer-btn-h: 62px;
                    --footer-btn-font-size: 32px;
 
                    /* page counter */
                    --footer-counter-w: 155px;
                    --footer-counter-h: 62px;
                    --footer-counter-font: 28px;
                    --footer-counter-margin-left: -70px;
                }
 
                /* ── md (768px ke atas) ── */
                @media (min-width: 768px) {
                    :root {
                        --footer-h: 110px;
                        --footer-trap-h: 65px;
                    }
                }
 
                /* ── lg (1024px ke atas) ── */
                @media (min-width: 1024px) {
                    :root {
                        --footer-h: 110px;
                        --footer-trap-h: 65px;
                        --footer-trap-w: 442px;
                        --footer-line-bottom-w: 381px;
                        --footer-diag-left: 444px;
                        --footer-diag-right: 440px;
                        --footer-btn-w: 280px;
                        --footer-btn-h: 62px;
                        --footer-btn-font-size: 32px;
                        --footer-counter-w: 155px;
                        --footer-counter-h: 62px;
                        --footer-counter-font: 28px;
                    }
                }
 
                /* ── xl (1280px ke atas) ── */
                @media (min-width: 1280px) {
                    :root {
                        --footer-btn-w: 280px;
                        --footer-counter-w: 155px;
                    }
                }
            `}</style>
 
            <div className="h-screen overflow-hidden flex flex-col bg-[#04080f] font-['Rajdhani',sans-serif]">
 
                <div className="flex-1 overflow-hidden
                    flex flex-col md:flex-row
                    gap-4
                    w-full max-w-[1500px] mx-auto
                    px-4 pt-4
                    pb-[100px]">
 
                    {/* BOX SOAL */}
                    <div className="w-full md:w-[58%] h-[52%] md:h-full shrink-0">
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={question.id}
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                transition={{ duration: 0.3 }}
                                className="w-full h-full"
                            >
                                <BoxSoal current={current} total={total} question={question} />
                            </motion.div>
                        </AnimatePresence>
                    </div>
 
                    {/* PILIHAN JAWABAN */}
                    <div className="w-full md:w-[42%] flex-1 md:flex-none
                        flex flex-col justify-center
                        overflow-y-auto
                        [scrollbar-width:none]
                        [&::-webkit-scrollbar]:hidden">
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={question.id + "-answers"}
                                initial={{ opacity: 0, x: 40 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -40 }}
                                transition={{ duration: 0.3 }}
                                className="w-full"
                            >
                                {question.answers.map((a: any, idx: number) => (
                                    <AnswerButton
                                        key={a.id}
                                        label={labels[idx] ?? String(idx + 1)}
                                        text={a.answer_text}
                                        selected={selected === a.id}
                                        onClick={() => selectAnswer(a.id)}
                                    />
                                ))}
                            </motion.div>
                        </AnimatePresence>
                    </div>
 
                </div>
 
                {/* ════════════════════════════════════════════════
                    FOOTER — ORIGINAL CODE ANDA, tidak diubah sama sekali
                    Ukuran dikontrol lewat CSS variables di atas
                    ════════════════════════════════════════════════ */}
                <div className="fixed bottom-4 left-0 w-full z-40"
                    style={{ height: "var(--footer-h)" }}>
 
                    <div className="absolute inset-0 pointer-events-none">
 
                        {/* LEFT BOX */}
                        <div
                            className="absolute -bottom-[2px] left-0"
                            style={{
                                width: "var(--footer-trap-w)",
                                height: "var(--footer-trap-h)",
                                clipPath: "polygon(0 0, 100% 0, calc(100% - 68px) 100%, 0 100%)",
                                background: "#3B28F6",
                            }}
                        />
 
                        {/* RIGHT BOX */}
                        <div
                            className="absolute -bottom-[2px] right-0"
                            style={{
                                width: "var(--footer-trap-w)",
                                height: "var(--footer-trap-h)",
                                clipPath: "polygon(0 0, 100% 0, 100% 100%, 65px 100%)",
                                background: "#3B28F6",
                            }}
                        />
 
                        {/* TOP MAIN HORIZONTAL LINE */}
                        <div
                            className="absolute top-[43%] left-1/2 -translate-x-1/2 h-[5px] bg-[#FACC15] rounded-tl-lg rounded-tr-lg"
                            style={{ width: "var(--footer-line-top-w)" }}
                        />
 
                        {/* BOTTOM LEFT LINE */}
                        <div
                            className="absolute -bottom-2 left-0 h-[5px] bg-[#FACC15]"
                            style={{ width: "var(--footer-line-bottom-w)" }}
                        />
 
                        {/* BOTTOM RIGHT LINE */}
                        <div
                            className="absolute -bottom-2 right-0 h-[5px] bg-[#FACC15]"
                            style={{ width: "var(--footer-line-bottom-w)" }}
                        />
 
                        {/* DIAGONAL LEFT */}
                        <div
                            className="absolute -bottom-8 w-[5px] h-[95px] rounded-tl-sm bg-yellow-400 shadow-[0_0_12px_rgba(250,204,21,0.8)]"
                            style={{
                                left: "var(--footer-diag-left)",
                                transform: "rotate(45deg)",
                                transformOrigin: "top left",
                            }}
                        />
 
                        {/* DIAGONAL RIGHT */}
                        <div
                            className="absolute -bottom-8 w-[5px] h-[95px] bg-yellow-400 rounded-tr-sm shadow-[0_0_12px_rgba(250,204,21,0.8)]"
                            style={{
                                right: "var(--footer-diag-right)",
                                transform: "translateX(-100%) rotate(-45deg)",
                                transformOrigin: "top right",
                            }}
                        />
 
                    </div>
 
                    {/* BUTTONS */}
                    <div
                        style={{
                            position: "absolute",
                            left: "50%",
                            marginLeft: "var(--footer-btn-container-margin-left)",
                            top: "var(--footer-btn-container-top)",
                            width: "var(--footer-btn-container-w)",
                            height: "70px",
                        }}
                    >
 
                        {/* BACK BUTTON */}
                        <motion.button
                            whileTap={{ scale: 0.95 }}
                            onClick={handleBack}
                            disabled={current === 0}
                            style={{
                                position: "absolute",
                                left: "var(--footer-btn-left)",
                                top: -4,
                                width: "var(--footer-btn-w)",
                                height: "var(--footer-btn-h)",
                                opacity: current === 0 ? 0.4 : 1,
                                color: "#FACC15",
                                fontSize: 12,
                                fontWeight: "bold",
                                letterSpacing: "3px",
                            }}
                        >
                            <svg style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}
                                viewBox="0 0 260 45" preserveAspectRatio="none">
                                <path d="M55 0 H258 V45 H0 V45 L0 45 Z"
                                    fill="none" stroke="#FACC15" strokeWidth={6} vectorEffect="non-scaling-stroke" />
                            </svg>
                            <span
                                className="relative z-10 flex items-center justify-center w-full h-full font-['orbitron'] text-white"
                                style={{ fontSize: "var(--footer-btn-font-size)" }}
                            >
                                &lt;&lt; BACK
                            </span>
                        </motion.button>
 
                        {/* PAGE COUNTER */}
                        <div
                            style={{
                                position: "absolute",
                                left: "49%",
                                marginLeft: "var(--footer-counter-margin-left)",
                                top: -4,
                                width: "var(--footer-counter-w)",
                                height: "var(--footer-counter-h)",
                                border: "4px solid #FACC15",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                color: "#FACC15",
                                fontSize: "var(--footer-counter-font)",
                                fontWeight: "bold",
                                letterSpacing: "3px",
                            }}
                        >
                            {String(current + 1).padStart(2, "0")}
                            <span style={{ margin: "0 8px", opacity: 0.5 }}>/</span>
                            {String(total).padStart(2, "0")}
                        </div>
 
                        {/* NEXT BUTTON */}
                        <motion.button
                            whileTap={{ scale: 0.95 }}
                            onClick={next}
                            disabled={!selected || loading}
                            style={{
                                position: "absolute",
                                right: "var(--footer-btn-right)",
                                top: -4,
                                width: "var(--footer-btn-w)",
                                height: "var(--footer-btn-h)",
                                opacity: (!selected || loading) ? 0.4 : 1,
                                color: "#FACC15",
                                fontSize: 12,
                                fontWeight: "bold",
                                letterSpacing: "3px",
                            }}
                        >
                            <svg style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}
                                viewBox="0 0 260 45" preserveAspectRatio="none">
                                <path d="M0 0 H205 L258 45 H0 Z"
                                    fill="none" stroke="#FACC15" strokeWidth={6} vectorEffect="non-scaling-stroke" />
                            </svg>
                            <span
                                className="relative z-10 flex items-center justify-center gap-2 w-full h-full font-['orbitron'] text-white"
                                style={{ fontSize: "var(--footer-btn-font-size)" }}
                            >
                                {loading ? "..." : current + 1 === total
                                    ? <><span>FINISH</span><Flag className="w-8 h-8 text-white" strokeWidth={3} /></>
                                    : "NEXT >>"}
                            </span>
                        </motion.button>
 
                    </div>
 
                </div>

                <div>
                    <div>
                        <div>
                        
                        </div>
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