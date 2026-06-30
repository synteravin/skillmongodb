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

           <div className="h-screen overflow-hidden flex flex-col bg-slate-100 dark:bg-[#020202] text-slate-900 dark:text-slate-200 font-sans">
               

            {/* ================= HEADER (DIAM) ================= */}
            <div className="w-full flex-shrink-0 px-1 pt-0.5">
                <div
                    className="relative border-[2px] md:border-[3px] border-transparent"
                    style={{
                        borderImage:
                            'linear-gradient(to bottom, #3B28F6 0%, #4c2fff 30%, #7c3aed 50%, #facc15 100%) 1',
                    }}
                >
                    <div className="flex items-center justify-between gap-2 bg-white dark:bg-[#040812] px-3 py-3 md:px-6 md:py-4 relative">

                      <Link
                            href="/student/dashboard"
                            className="relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded border-2 border-blue-500 bg-blue-100 transition-colors hover:border-blue-600 hover:bg-blue-200 dark:border-blue-800 dark:bg-[#0b1021] dark:hover:border-blue-600 dark:hover:bg-blue-900/40 md:h-12 md:w-12"
                        >
                            <svg viewBox="0 0 48 48" className="h-7 w-7 scale-125 text-indigo-600 transition-transform duration-200 hover:scale-150 dark:text-indigo-500 md:h-9 md:w-9">
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
                        <h1 className="flex-1 text-center text-sm min-[390px]:text-base sm:text-xl md:text-2xl lg:text-3xl 2xl:text-4xl font-['Orbitron'] font-bold dark:text-white text-[#1e3a8a] tracking-[0.05em] min-[390px]:tracking-[0.1em] md:tracking-[0.15em] uppercase">
                            SELECT YOUR COURSE
                        </h1>

                        {/* Spacer to center title on mobile */}
                        <div className="w-10 h-10 shrink-0 md:hidden" />
                    </div>
                </div>
            </div>
             <div className="flex-1 overflow-y-auto" style={{ scrollbarWidth: "thin", scrollbarColor: "rgba(99,130,255,0.3) transparent" }}>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 md:gap-8 lg:gap-10 xl:gap-14 p-4 md:p-6">
                        {courses.map((course) => {
                            const isLocked = course.status === 'locked'
                            const isActive = course.status === 'active'
                            const isCompleted = course.status === 'completed'
                            const isUnlocked = course.status === 'unlocked'

                            return (
                                <div
                                    key={course._id}
                                    className={`
                                        relative cursor-pointer group flex flex-col rounded-2xl sm:rounded-[28px] overflow-hidden
                                        border transition-all duration-500 shadow-[0_18px_45px_rgba(15,23,42,0.06)]
                                        ${isLocked ? 'bg-slate-100 dark:bg-[#02040f] border-blue-300 dark:border-[#1e3a8a] shadow-[0_0_30px_rgba(15,23,42,0.08)]' : 'bg-white dark:bg-[#061028] border-blue-300 dark:border-[#1e3a8a]'}
                                        ${isLocked && 'pointer-events-none'}
                                        ${
                                            !isLocked
                                                ? isActive
                                                    ? 'border-indigo-600 hover:shadow-[0_0_30px_rgba(59,40,246,0.12)]'
                                                    : isCompleted
                                                    ? 'border-emerald-500 hover:shadow-[0_0_25px_rgba(16,185,129,0.18)]'
                                                    : isUnlocked
                                                    ? 'border-[#FACC15] hover:shadow-[0_0_25px_rgba(250,204,21,0.14)]'
                                                    : 'border-[#FACC15] dark:border-[#FACC15] hover:shadow-[0_0_25px_rgba(250,204,21,0.12)]'
                                                : ''
                                        }
                                    `}
                                >
                                    {/* IMAGE */}
                                    <div className="relative w-full aspect-[16/9] overflow-hidden bg-slate-100 dark:bg-slate-900 border-b border-slate-200/40 dark:border-[#1e2759]/60">
                                        <img
                                            src={course.thumbnail}
                                            alt={course.title}
                                            className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                                            onError={(e) => {
                                                e.currentTarget.src = 'https://via.placeholder.com/400x300?text=No+Image'
                                            }}
                                        />

                                        <div className="absolute inset-0 bg-gradient-to-t from-slate-50/30 via-transparent to-slate-50/0 dark:from-[#020714]/95 dark:via-transparent dark:to-[#000000]/0 pointer-events-none" />
                                    </div>

                                    {/* CONTENT */}
                                    <div className="p-3 sm:p-4 md:p-5 flex flex-col flex-1">
                                        <h2 className="text-sm sm:text-base md:text-lg font-semibold text-slate-900 dark:text-slate-100 mb-1.5 line-clamp-1 transition-colors duration-300 group-hover:text-[#3b4ffa] dark:group-hover:text-[#8ea8ff]">
                                            {course.title}
                                        </h2>
                                        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 line-clamp-2 md:line-clamp-3 mb-4">
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
                                                    w-full py-1.5 sm:py-2 md:py-2.5 rounded-xl border text-center font-bold text-[10px] sm:text-xs md:text-sm transition-all duration-300 cursor-pointer
                                                    ${isActive && `
                                                        bg-indigo-600 border-indigo-600 text-white
                                                        shadow-[0_0_18px_rgba(79,70,229,0.18)]
                                                        hover:bg-indigo-500 hover:border-indigo-500
                                                    `}
                                                    ${isCompleted && `
                                                        bg-emerald-500 text-white border-emerald-500
                                                        hover:bg-emerald-600 hover:border-emerald-600
                                                        shadow-[0_0_10px_rgba(16,185,129,0.3)]
                                                    `}
                                                    ${isLocked && `
                                                        bg-slate-200 border-slate-200 text-slate-700
                                                        dark:bg-slate-700 dark:border-slate-700 dark:text-slate-300
                                                        shadow-sm cursor-not-allowed
                                                    `}
                                                    ${!course.status && `
                                                        border-[#FACC15] text-[#FACC15]
                                                        hover:bg-[#FACC15] hover:text-white
                                                        dark:hover:text-[#090d19]
                                                    `}
                                                    ${isUnlocked && `
                                                        border-[#FACC15] text-[#FACC15]
                                                        hover:bg-[#FACC15] hover:text-white
                                                    `}
                                                `}
                                            >
                                                {isActive && (
                                                    <span className="flex items-center justify-center gap-1">
                                                        <span className="w-1 h-1 sm:w-1.5 sm:h-1.5 rounded-full bg-white animate-pulse" />
                                                        In Progress
                                                    </span>
                                                )}
                                                {isCompleted && '✓ Selesai'}
                                                {isLocked && '🔒 Terkunci'}
                                                {isUnlocked && 'Mulai →'}
                                                {!course.status && 'Mulai →'}
                                            </div>
                                        </div>
                                    </div>

                                    {/* LOCK OVERLAY - CENTERED IN CARD */}
                                    {isLocked && (
                                        <div className="absolute inset-0 z-20 flex items-center justify-center px-4 rounded-2xl sm:rounded-[28px]">
                                            <div className="flex items-center justify-center w-10 h-10 sm:w-14 sm:h-14 rounded-full bg-blue-200/60 dark:bg-blue-950/40 border border-blue-400 dark:border-blue-700 shadow-md">
                                                <Lock className="w-5 h-5 sm:w-7 sm:h-7 text-blue-600 dark:text-blue-400" />
                                            </div>
                                        </div>
                                    )}
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
                    className="fixed inset-0 z-[100] flex items-center justify-center bg-[#020202]/30 backdrop-blur-xs p-4 lg:p-6">
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
                                bg-[#020202] border-2 md:border-[3px] border-[#3B28F6] rounded-xl md:rounded-[16px] overflow-hidden will-change-[clip-path,opacity]">

                        {/* ================= THUMBNAIL ================= */}
                        <div className="relative w-full h-[140px] xs:h-[165px] md:h-[200px] lg:h-[220px] overflow-hidden">
                            {/* BACKGROUND (ISI AREA) */}
                            <img
                                src={selectedCourse.thumbnail}
                                className="absolute inset-0 w-full h-full object-cover scale-110 opacity-20"/>
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
                                    absolute top-2.5 right-2.5 md:top-3 md:right-3 z-10
                                    w-8 h-8 md:w-9 md:h-9 rounded-full
                                    bg-black/70 border border-white/20
                                    flex items-center justify-center
                                    hover:bg-red-500/80
                                    transition
                                "
                            >
                                <X className="w-3.5 h-3.5 md:w-4 md:h-4 text-white" />
                            </button>
                        </div>

                        {/* ================= BODY ================= */}
                        <div className="px-4 py-4 md:px-7 lg:px-8 md:py-5">

                            {/* TITLE */}
                            <h1 className="text-base xs:text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold text-white leading-snug">
                                {selectedCourse.title}
                            </h1>

                            {/* DIVIDER */}
                            <div className="flex items-center gap-3 my-3 md:my-4">
                                <div className="h-[1px] flex-1 bg-gradient-to-r from-[#3B28F6] to-transparent" />
                                <div className="w-2 h-2 rotate-45 border border-blue-500" />
                                <div className="h-[1px] flex-1 bg-gradient-to-l from-[#3B28F6] to-transparent" />
                            </div>

                            {/* ================= DESKRIPSI (SCROLL FIX) ================= */}
                            <div
                                className="max-h-[85px] xs:max-h-[110px] md:max-h-[130px] overflow-y-auto pr-1.5 text-xs xs:text-sm md:text-base text-slate-300
                                leading-relaxed [scrollbar-width:thin]
                                    [scrollbar-color:rgba(59,40,246,0.5)_transparent]
                                "
                            >
                                {selectedCourse.description}
                            </div>
                            
                            {/* ================= INFO BOX ================= */}
                            <div className="flex flex-wrap gap-2.5 md:gap-3 mt-4 md:mt-5">

                                {/* MODUL */}
                                <div className="
                                    flex items-center gap-1.5 xs:gap-2
                                    border border-white/10
                                    bg-[#03062C]
                                    px-2.5 py-1.5 xs:px-3 xs:py-2 rounded-md
                                    flex-1 min-w-[110px] xs:min-w-[140px] sm:min-w-[160px]
                                ">
                                    <BookOpen className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-400 shrink-0" />

                                    <span className="text-[11px] xs:text-xs sm:text-sm md:text-base lg:text-lg text-white leading-none font-extrabold">
                                        Modul: <span className="text-white font-bold">45</span>
                                    </span>
                                </div>

                                {/* FORMAT */}
                                <div className="
                                    flex items-center gap-1.5 xs:gap-2
                                    border border-white/10
                                    bg-[#03062C]
                                    px-2.5 py-1.5 xs:px-3 xs:py-2 rounded-md
                                    flex-1 min-w-[110px] xs:min-w-[140px] sm:min-w-[160px]
                                ">
                                    <MonitorPlay className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-400 shrink-0" />

                                    <span className="text-[11px] xs:text-xs sm:text-sm md:text-base lg:text-lg text-white leading-none font-extrabold">
                                        Format: <span className="text-white font-bold">Video & Project</span>
                                    </span>
                                </div>

                            </div>

                            {/* ================= BUTTON ================= */}
                            <button
                                onClick={handleLanjutKeConfirm}
                                className="
                                    mt-5 md:mt-6 w-full py-2.5 md:py-3 rounded-md
                                    flex items-center justify-center gap-2

                                    bg-[#FACC15]
                                    text-[#020202]
                                    font-bold text-xs xs:text-sm uppercase tracking-wide

                                    hover:bg-yellow-300
                                    active:scale-[0.97]

                                    transition-all duration-300
                                "
                            >
                                Mulai →
                            </button>
                        </div>

                        {/* FOOTER */}
                        <p className="text-[9px] sm:text-[10px] text-slate-600 text-center pb-3 md:pb-4 tracking-widest uppercase">
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
                            className="relative w-full max-w-2xl border border-[#FACC15] bg-[#020202] rounded shadow-[0_0_0_2px_rgba(0,191,255,0.2),0_0_30px_rgba(250,204,21,0.15)] md:shadow-[0_0_0_2px_rgba(0,191,255,0.2),0_0_50px_rgba(250,204,21,0.25)]"
                        >
                           
                            {/* Header */}
                            <div className="flex items-center gap-3 md:gap-5 px-4 py-2.5 md:px-5 md:py-3 relative z-10">
    
                                {/* GARIS */}
                                <div className="absolute bottom-0 left-4 right-4 md:left-5 md:right-5 h-[1px] bg-slate-800 dark:bg-slate-700/60" />

                                {/* ICON */}
                                <div
                                    className="w-6 h-6 md:w-7 md:h-7 flex items-center justify-center flex-shrink-0"
                                    style={{ border: "1px solid #FACC15", background: "rgba(250,204,21,0.15)" }}
                                >
                                    <TriangleAlert className="w-3.5 h-3.5 md:w-4 md:h-4 text-yellow-400" />
                                </div>

                                {/* TITLE */}
                                <h1
                                    className="text-white font-bold tracking-[0.12em] xs:tracking-[0.2em] sm:tracking-[0.3em] uppercase text-sm xs:text-base sm:text-lg md:text-xl"
                                    style={{ fontFamily: "Orbitron, sans-serif" }}
                                >
                                    Confirmation
                                </h1>
                            </div>

                            {/* Body */}
                            <div className="px-4 py-4 md:px-5 md:pt-5 md:pb-5 relative z-10 flex flex-col gap-3.5 md:gap-4">

                                {/* Question */}
                                <p
                                    className="text-white font-semibold text-center text-xs xs:text-sm sm:text-base md:text-lg leading-relaxed"
                                    style={{ fontFamily: "Orbitron", letterSpacing: "0.05em" }}
                                >
                                    Are you sure you want to select this course?
                                </p>

                                {/* Warning box */}
                                <div
                                    className="p-3 xs:p-4 border border-[#cc0000] bg-[#110000] shadow-[inset_0_0_15px_rgba(180,0,0,0.1)]"
                                >
                                    {/* Warning label */}
                                    <div className="flex items-center gap-2 mb-2 md:mb-3">
                                        <div className="text-red-600">
                                            <AlertOctagon className="w-5 h-5 md:w-6 md:h-6 font-bold" />
                                        </div>
                                        <p
                                            className="text-red-500 font-bold text-xs md:text-sm tracking-widest uppercase"
                                            style={{ fontFamily: "Oxanium" }}
                                        >
                                            System Warning
                                        </p>
                                    </div>

                                    {/* Warning text */}
                                    <p
                                        className="text-white text-xs xs:text-sm md:text-base leading-relaxed text-center"
                                        style={{ fontFamily: 'Oxanium' }}
                                    >
                                        Once selected, you{" "}
                                        <span className="text-[#EE0202] font-bold">must complete</span>
                                        {" "}this course before you can unlock or access other course.
                                    </p>
                                </div>

                                {/* Buttons */}
                                <div className="flex flex-col sm:flex-row gap-2.5 xs:gap-3 pt-1">
                                    <button
                                        onClick={handleCancelConfirm}
                                        className="flex-1 py-2 xs:py-2.5 md:py-3 tracking-[0.12em] xs:tracking-[0.2em] uppercase text-xs xs:text-sm sm:text-base md:text-lg transition-all duration-200 hover:bg-white/10"
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
                                        className="flex-1 py-2 xs:py-2.5 md:py-3 font-bold tracking-[0.12em] xs:tracking-[0.2em] uppercase text-xs xs:text-sm sm:text-base md:text-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                                        style={{
                                            fontFamily: "Oxanium",
                                            background: processing ? "rgba(250,204,21,0.15)" : "#FACC15",
                                            border: "1px solid #FACC15",
                                            color: processing ? "#FACC15" : "#020202",
                                            boxShadow: "0 0 12px rgba(250,204,21,0.25)",
                                        }}
                                        onMouseEnter={e => {
                                            if (!processing) (e.currentTarget as HTMLButtonElement).style.boxShadow = "0 0 24px rgba(250,204,21,0.65)";
                                        }}
                                        onMouseLeave={e => {
                                            (e.currentTarget as HTMLButtonElement).style.boxShadow = "0 0 12px rgba(250,204,21,0.25)";
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
