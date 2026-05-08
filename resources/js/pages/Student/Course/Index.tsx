import { Head, Link, router } from '@inertiajs/react'
import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { TriangleAlert, X, Lock,BookOpen,MonitorPlay,AlertOctagon  } from 'lucide-react'


type Course = {
    _id: string
    title: string
    description: string
    thumbnail: string
    slug: string
    status?: 'locked' | 'active' | 'completed' | 'unlocked' | null
}

export default function Index({ courses }: { courses: Course[] }) {
    const [selectedCourse, setSelectedCourse] = useState<Course | null>(null)
    const [showDescModal, setShowDescModal] = useState(false)
    const [showConfirmModal, setShowConfirmModal] = useState(false)
    const [processing, setProcessing] = useState(false)


    const handleMulaiBelajar = (course: Course) => {
        setSelectedCourse(course)
        setShowDescModal(true)
    }

    const handleLanjutKeConfirm = () => {
        setShowDescModal(false)
        setTimeout(() => setShowConfirmModal(true), 200)
    }

    const handleConfirm = () => {
        if (!selectedCourse || processing) return
        setProcessing(true)
        router.post('/student/courses/select', {
            course_id: selectedCourse._id,
            slug: selectedCourse.slug,
        })
    }

    const handleCancelDesc = () => {
        setShowDescModal(false)
        setSelectedCourse(null)
    }

    const handleCancelConfirm = () => {
        setShowConfirmModal(false)
        setSelectedCourse(null)
        setProcessing(false)
    }

    return (
        <>
            <Head title="My Courses" />

           <div className="h-screen overflow-hidden flex flex-col bg-[#e6ebf2] dark:bg-[#040812] text-gray-800 dark:text-slate-200 font-sans">
               

            {/* ================= HEADER (DIAM) ================= */}
            <div className="flex-shrink-0 w-full pt-0.5 px-1">
                <div
                    className="relative border-[2px] md:border-[3px]"
                    style={{
                        borderImage: "linear-gradient(to bottom, #3B28F6 0%, #4c2fff 30%, #7c3aed 50%, #facc15 100%) 1",
                    }}
                >
                    <div className="py-4 px-4 md:px-6 flex items-center gap-4 bg-[#040812]">

                        {/* Back Button */}
                        <Link
                            href="/student/dashboard"
                            className="border-2 border-blue-800 rounded bg-gray-200 dark:bg-[#0b1021] flex items-center justify-center p-2 hover:bg-blue-900/40 hover:border-blue-600 transition-colors w-10 h-10 md:w-12 md:h-12 shrink-0"
                        >
                            <svg viewBox="0 0 48 48" className="w-7 h-7 md:w-9 md:h-9 text-indigo-500 scale-125 hover:scale-150 transition-transform duration-200">
                                <rect x="12" y="20" width="29" height="4" fill="currentColor" />
                                <rect x="8"  y="20" width="4"  height="4" fill="currentColor" />
                                <rect x="5"  y="20" width="5"  height="4" fill="currentColor" />
                                <rect x="8"  y="16" width="4"  height="4" fill="currentColor" />
                                <rect x="8"  y="24" width="4"  height="4" fill="currentColor" />
                                <rect x="12" y="12" width="4"  height="4" fill="currentColor" />
                                <rect x="12" y="28" width="4"  height="4" fill="currentColor" />
                                <rect x="16" y="8"  width="4"  height="4" fill="currentColor" />
                                <rect x="16" y="32" width="4"  height="4" fill="currentColor" />
                            </svg>
                        </Link>

                        {/* Title */}
                        <h1 className="absolute left-0 right-0 text-center text-xl md:text-2xl lg:text-3xl 2xl:text-4xl font-['Orbitron'] font-bold text-gray-900 dark:text-white tracking-[0.1em] md:tracking-[0.15em] drop-shadow-[0_0_10px_rgba(255,255,255,0.3)] uppercase px-16 pointer-events-none">
                           SELECT YOUR COURSE
                        </h1>
                    </div>
                </div>
            </div>
             <div className="flex-1 overflow-y-auto" style={{ scrollbarWidth: "thin", scrollbarColor: "rgba(99,130,255,0.3) transparent" }}>
                <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-14 p-4 md:p-6">
                        {courses.map((course) => {
                            const isLocked = course.status === 'locked'
                            const isActive = course.status === 'active'
                            const isCompleted = course.status === 'completed'
                            const isUnlocked = course.status === 'unlocked'

                            return (
                                <div
                                    key={course._id}
                                    className={`
                                        relative cursor-pointer group flex flex-col
                                        bg-white dark:bg-[#0b1021]
                                        border-[3px] rounded-xl overflow-hidden
                                        transition-all duration-500
                                        hover:shadow-[0_10px_30px_rgba(0,0,0,0.1)]
                                        dark:hover:shadow-[0_0_25px_rgba(30,58,138,0.3)]
                                        ${isLocked && 'opacity-40 pointer-events-none'}
                                        ${
                                            isLocked
                                                ? 'border-gray-400 dark:border-gray-600'
                                                : isActive
                                                ? 'border-[#3B28F6]'
                                                : isCompleted
                                                ? 'border-blue-500'
                                                : isUnlocked
                                                ? 'border-yellow-400'
                                                : 'border-yellow-300 dark:border-yellow-400'
                                        }
                                    `}
                                >
                                    {isLocked && (
                                        <div className="absolute inset-0 flex items-center justify-center bg-black/10 z-20 rounded-xl">
                                            <Lock className="w-12 h-12 text-white drop-shadow-lg" />
                                        </div>
                                    )}

                                    {/* IMAGE */}
                                    <div className="relative w-full aspect-[16/9] overflow-hidden bg-gray-200 dark:bg-slate-900 border-b border-[#1e2759]/50">
                                        <img
                                            src={course.thumbnail}
                                            alt={course.title}
                                            className="absolute inset-0 w-full h-full object-cover transition-transform duration-700"
                                            onError={(e) => {
                                                e.currentTarget.src = 'https://via.placeholder.com/400x300?text=No+Image'
                                            }}
                                        />
                                    </div>

                                    {/* CONTENT */}
                                    <div className="p-4 md:p-5 flex flex-col flex-1">
                                        <h2 className="text-base md:text-lg font-bold text-gray-900 dark:text-white mb-2 line-clamp-1 group-hover:text-blue-400 transition">
                                            {course.title}
                                        </h2>
                                        <p className="text-xs md:text-sm text-gray-700 dark:text-slate-400 line-clamp-2 md:line-clamp-3 mb-6">
                                            {course.description}
                                        </p>

                                        {/* BUTTON */}
                                        <div className="mt-auto">
                                            <div
                                              onClick={(e) => {
                                                        e.stopPropagation()

                                                        // ❌ Kalau sedang dikerjakan → langsung masuk course
                                                        if (course.status === 'active') {
                                                            router.get(`/student/courses/${course.slug}`)
                                                            return
                                                        }

                                                        // ❌ Kalau sudah selesai → langsung masuk ulang
                                                        if (course.status === 'completed') {
                                                            router.get(`/student/courses/${course.slug}`)
                                                            return
                                                        }

                                                        // ✅ Hanya kondisi ini yang boleh buka modal
                                                        if (course.status === 'unlocked' || !course.status) {
                                                            handleMulaiBelajar(course)
                                                        }
                                                    }}
                                                className={`
                                                    w-full py-2 md:py-2.5 rounded-md border text-center font-bold text-xs md:text-sm transition-all duration-300 cursor-pointer
                                                    ${isActive && `
                                                        bg-[#050619] border-[#3B28F6] text-white
                                                        shadow-[0_0_3px_rgba(59,40,246,0.5)]
                                                        hover:bg-[#3B28F6] hover:border-[#2e1fd4]
                                                    `}
                                                    ${isCompleted && `
                                                        bg-emerald-500 text-white border-emerald-500
                                                        hover:bg-emerald-600 hover:border-emerald-600
                                                        shadow-[0_0_10px_rgba(16,185,129,0.3)]
                                                    `}
                                                    ${isLocked && 'bg-gray-700 text-gray-400 border-gray-700 cursor-not-allowed'}
                                                    ${!course.status && `
                                                        border-[#FACC15] text-[#FACC15]
                                                        hover:bg-yellow-500 hover:text-white
                                                        dark:hover:text-[#090d19]
                                                    `}
                                                    ${isUnlocked && `
                                                        border-yellow-400 text-yellow-400
                                                        hover:bg-yellow-500 hover:text-[#090d19]
                                                    `}
                                                `}
                                            >
                                                {isActive && (
                                                    <span className="flex items-center justify-center gap-1.5">
                                                        <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                                                        In Progress
                                                    </span>
                                                )}
                                                {isCompleted && '✓ Selesai (Ulangi)'}
                                                {isLocked && '🔒 Terkunci'}
                                                {isUnlocked && 'Mulai Belajar →'}
                                                {!course.status && 'Mulai Belajar →'}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
            </div>

                    {/* EMPTY */}
                    {courses.length === 0 && (
                        <div className="text-center text-slate-500 mt-20 text-xl tracking-wider">
                            BELUM ADA COURSE TERSEDIA.
                        </div>
                    )}
                </div>
            

            {/* ===================== MODAL 1: DESKRIPSI COURSE ===================== */}
            <AnimatePresence>
            {showDescModal && selectedCourse && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.25 }}
                    onClick={handleCancelDesc}
                    className=" fixed inset-0 z-[100] flex items-center justify-center bg-[#020202]/30 backdrop-blur-xs p-4 lg:p-6">
                    {/* ================= CARD MODAL ================= */}
                    <motion.div
                                initial={{
                                    clipPath: "inset(50% 0% 50% 0%)",
                                    opacity: 0
                                }}
                                animate={{
                                    clipPath: "inset(0% 0% 0% 0%)",
                                    opacity: 1
                                }}
                                exit={{
                                    clipPath: "inset(50% 0% 50% 0%)",
                                    opacity: 0
                                }}
                                transition={{
                                    duration: 0.45,
                                    ease: [0.22, 1, 0.36, 1] // lebih smooth dari easeInOut
                                }}
                            onClick={(e) => e.stopPropagation()}
                                className="relative w-full max-w-[560px] md:max-w-[640px] lg:max-w-[720px] xl:max-w-[780px] 2xl:max-w-[860px] 
                                bg-[#020202] border-[3px] border-[#3B28F6] rounded-[16px] overflow-hidden will-change-[clip-path,opacity]">

                        {/* ================= THUMBNAIL ================= */}
                    <div className="relative w-full h-[180px] md:h-[200px] lg:h-[220px] overflow-hidden">
                        {/* BACKGROUND (ISI AREA) */}
                        <img
                            src={selectedCourse.thumbnail}
                            className="absolute inset-0 w-full h-full object-cover blur-xs scale-110 opacity-40"/>
                        {/* MAIN IMAGE (TIDAK TERPOTONG) */}
                        <img
                            src={selectedCourse.thumbnail}
                            alt={selectedCourse.title}
                            className="relative z-10 w-full h-full object-contain object-center"
                            onError={(e) => {
                                e.currentTarget.src = 'https://via.placeholder.com/700x300?text=No+Image'
                            }}
                        />
                            {/* close button */}
                            <button
                                onClick={handleCancelDesc}
                                className="
                                    absolute top-3 right-3 z-10
                                    w-9 h-9 rounded-full
                                    bg-black/70 border border-white/20
                                    flex items-center justify-center
                                    hover:bg-red-500/80
                                    transition
                                "
                            >
                                <X className="w-4 h-4 text-white" />
                            </button>
                        </div>

                        {/* ================= BODY ================= */}
                        <div className="px-5 md:px-7 lg:px-8 py-5">

                            {/* TITLE */}
                            <h1 className="text-xl md:text-2xl lg:text-3xl font-bold text-white leading-snug">
                                {selectedCourse.title}
                            </h1>

                            {/* DIVIDER */}
                            <div className="flex items-center gap-3 my-4">
                                <div className="h-[1px] flex-1 bg-gradient-to-r from-[#3B28F6] to-transparent" />
                                <div className="w-2 h-2 rotate-45 border border-blue-500" />
                                <div className="h-[1px] flex-1 bg-gradient-to-l from-[#3B28F6] to-transparent" />
                            </div>

                            {/* ================= DESKRIPSI (SCROLL FIX) ================= */}
                            <div
                                className="max-h-[110px] md:max-h-[130px] overflow-y-auto pr-2 text-sm md:text-base text-slate-300
                                leading-relaxed [scrollbar-width:thin]
                                    [scrollbar-color:rgba(59,40,246,0.5)_transparent]
                                "
                            >
                                {selectedCourse.description}
                            </div>
                        {/* ================= INFO BOX ================= */}
                            <div className="flex flex-wrap gap-3 mt-5">

                                {/* MODUL */}
                                <div className="
                                    flex items-center gap-2
                                    border border-white/10
                                    bg-[#03062C]
                                    px-3 py-2 rounded-md
                                    flex-1 min-w-[160px]
                                ">
                                    <BookOpen size={19} className="text-yellow-400 shrink-0" />

                                    <span className="text-lg text-white leading-none font-extrabold">
                                        Modul: <span className="text-white font-bold">45</span>
                                    </span>
                                </div>

                                {/* FORMAT */}
                                <div className="
                                    flex items-center gap-2
                                    border border-white/10
                                    bg-[#03062C]
                                    px-3 py-2 rounded-md
                                    flex-1 min-w-[160px]
                                ">
                                    <MonitorPlay size={19} className="text-yellow-400 shrink-0" />

                                    <span className="text-lg text-white leading-none font-extrabold">
                                        Format: <span className="text-white font-bold">Video & Project</span>
                                    </span>
                                </div>

                            </div>

                            {/* ================= BUTTON ================= */}
                            <button
                                onClick={handleLanjutKeConfirm}
                                className="
                                    mt-6 w-full py-3 rounded-md
                                    flex items-center justify-center gap-2

                                    bg-[#FACC15]
                                    text-[#020202]
                                    font-bold text-sm uppercase tracking-wide

                                    hover:bg-yellow-300
                                    active:scale-[0.97]

                                    transition-all duration-300
                                "
                            >
                                Mulai →
                            </button>
                        </div>

                        {/* FOOTER */}
                        <p className="text-[10px] text-slate-600 text-center pb-4 tracking-widest uppercase">
                            Skillventura · Course
                        </p>

                    </motion.div>
                </motion.div>
            )}
            </AnimatePresence>


        {/* ===================== MODAL 2: KONFIRMASI ===================== */}
            <AnimatePresence>
                {showConfirmModal && selectedCourse && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[110] flex items-center justify-center bg-black/80 p-4 lg:p-6"
                    >
                        <motion.div
                            initial={{ clipPath: "inset(50% 0% 50% 0%)", opacity: 0 }}
                            animate={{ clipPath: "inset(0% 0% 0% 0%)", opacity: 1 }}
                            exit={{ clipPath: "inset(50% 0% 50% 0%)", opacity: 0 }}
                            transition={{ duration: 0.5, ease: "easeInOut" }}
                            className="relative w-full max-w-2xl"
                            style={{
                                border: "3px solid #F0C419",
                                boxShadow: "0 0 0 2px #00BFFF33, 0 0 50px rgba(240,196,25,0.25)",
                                background: "#020202",
                            }}
                        >
                           
                            {/* Header */}
                           <div className="flex items-center gap-5 px-5 py-3 relative z-10">
    
                                {/* GARIS */}
                                <div className="absolute bottom-0 left-5 right-5 h-[1px] bg-gray-600" />

                                {/* ICON */}
                                <div
                                    className="w-7 h-7 flex items-center justify-center flex-shrink-0"
                                    style={{ border: "1.5px solid #F0C419", background: "rgba(240,196,25,0.15)" }}
                                >
                                    <TriangleAlert className="w-4 h-4 text-yellow-400" />
                                </div>

                                {/* TITLE */}
                                <h1
                                    className="text-white font-bold tracking-[0.3em] uppercase text-xl"
                                    style={{ fontFamily: "Orbitron, sans-serif" }}
                                >
                                    Confirmation
                                </h1>
                            </div>

                            {/* Body */}
                            <div className="px-5 pt-5 pb-5 relative z-10 flex flex-col gap-4">

                                {/* Question */}
                                <p
                                    className="text-white font-semibold text-center text-base md:text-lg"
                                    style={{ fontFamily: "Orbitron", letterSpacing: "0.05em" }}
                                >
                                    Are you sure you want to select this course?
                                </p>

                                {/* Warning box */}
                                <div
                                    className="p-4"
                                    style={{
                                        background: "#110000",
                                        border: "1.5px solid #cc0000",
                                        boxShadow: "inset 0 0 20px rgba(180,0,0,0.1)",
                                    }}
                                >
                                    {/* Warning label */}
                                    <div className="flex items-center gap-2 mb-3">
                                        <div className=" text-red-600">
                                            <AlertOctagon className="w-6 h-6 font-bold" />
                                        </div>
                                        <p
                                            className="text-red-500 font-bold text-sm tracking-widest uppercase"
                                            style={{ fontFamily: "Oxanium" }}
                                        >
                                            System Warning
                                        </p>
                                    </div>

                                    {/* Warning text */}
                                    <p
                                        className="text-white text-sm md:text-base leading-relaxed text-center"
                                        style={{ fontFamily: 'Oxanium' }}
                                    >
                                        Once selected, you{" "}
                                        <span className="text-[#EE0202] font-bold">must complete</span>
                                        {" "}this course before you can unlock or access other course.
                                    </p>
                                </div>

                                {/* Buttons */}
                                <div className="flex flex-col sm:flex-row gap-3 pt-1">
                                    <button
                                        onClick={handleCancelConfirm}
                                        className="flex-1 py-3 tracking-[0.2em] uppercase text-lg transition-all duration-200 hover:bg-white/10"
                                        style={{
                                            fontFamily: "Oxanium",
                                            background: "#111",
                                            border: "1.5px solid #444",
                                            color: "#aaaaaa",
                                        }}
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={handleConfirm}
                                        disabled={processing}
                                        className="flex-1 py-3 font-bold tracking-[0.2em] uppercase text-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                                        style={{
                                            fontFamily: "Oxanium",
                                            background: processing ? "rgba(240,196,25,0.15)" : "#F0C419",
                                            border: "1.5px solid #F0C419",
                                            color: processing ? "#F0C419" : "#020202",
                                            boxShadow: "0 0 16px rgba(240,196,25,0.35)",
                                        }}
                                        onMouseEnter={e => {
                                            if (!processing) (e.currentTarget as HTMLButtonElement).style.boxShadow = "0 0 28px rgba(240,196,25,0.7)";
                                        }}
                                        onMouseLeave={e => {
                                            (e.currentTarget as HTMLButtonElement).style.boxShadow = "0 0 16px rgba(240,196,25,0.35)";
                                        }}
                                    >
                                        {processing ? "Processing..." : "Confirm >"}
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
            </>
    )
}
