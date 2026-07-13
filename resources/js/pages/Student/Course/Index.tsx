import { Head, Link, router } from '@inertiajs/react';
import { useState, useRef, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import {
    TriangleAlert,
    X,
    Lock,
    BookOpen,
    MonitorPlay,
    AlertOctagon,
} from 'lucide-react';

type Course = {
    _id: string;
    title: string;
    description: string;
    thumbnail: string;
    slug: string;
    status?: 'locked' | 'active' | 'completed' | 'unlocked' | null;
};

export default function Index({ courses }: { courses: Course[] }) {
    const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
    const [showDescModal, setShowDescModal] = useState(false);
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [processing, setProcessing] = useState(false);

    const contentRef = useRef<HTMLDivElement>(null);
    const [contentHeight, setContentHeight] = useState(0);
    const [pages, setPages] = useState(1);

    useEffect(() => {
        const el = contentRef.current;
        if (!el) return;

        const handleResize = () => {
            const height = el.offsetHeight || el.scrollHeight;
            setContentHeight(height);
            const clientHeight = window.innerHeight;
            if (clientHeight > 0) {
                setPages(Math.max(1, Math.ceil(height / clientHeight)));
            }
        };

        handleResize();
        const observer = new ResizeObserver(handleResize);
        observer.observe(el);
        return () => observer.disconnect();
    }, []);

    const handleMulaiBelajar = (course: Course) => {
        setSelectedCourse(course);
        setShowDescModal(true);
    };

    const handleLanjutKeConfirm = () => {
        setShowDescModal(false);
        setTimeout(() => setShowConfirmModal(true), 200);
    };

    const handleConfirm = () => {
        if (!selectedCourse || processing) return;
        setProcessing(true);
        router.post('/student/courses/select', {
            course_id: selectedCourse._id,
            slug: selectedCourse.slug,
        });
    };

    const handleCancelDesc = () => {
        setShowDescModal(false);
        setSelectedCourse(null);
    };

    const handleCancelConfirm = () => {
        setShowConfirmModal(false);
        setSelectedCourse(null);
        setProcessing(false);
    };

    return (
        <>
            <Head title="My Courses" />

            <div className="flex h-screen flex-col overflow-hidden bg-slate-100 font-sans text-slate-900 dark:bg-[#020202] dark:text-slate-200">
                {/* ================= HEADER (DIAM) ================= */}
                <div className="w-full flex-shrink-0 px-1 pt-0.5">
                    <div
                        className="relative rounded-md p-[2px] md:p-[3px]"
                        style={{
                            backgroundImage:
                                'linear-gradient(to bottom, #3B28F6 0%, #4c2fff 30%, #7c3aed 50%, #facc15 100%)',
                        }}
                    >
                        <div className="relative flex items-center justify-between gap-2 rounded-[4px] bg-white px-3 py-3 md:px-6 md:py-4 dark:bg-[#040812]">
                            <Link
                                href="/student/dashboard"
                                className="relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded border-2 border-blue-500 bg-blue-100 transition-colors hover:border-blue-600 hover:bg-blue-200 md:h-12 md:w-12 dark:border-blue-800 dark:bg-[#0b1021] dark:hover:border-blue-600 dark:hover:bg-blue-900/40"
                            >
                                <svg
                                    viewBox="0 0 48 48"
                                    className="h-7 w-7 scale-125 text-indigo-600 transition-transform duration-200 hover:scale-150 md:h-9 md:w-9 dark:text-indigo-500"
                                >
                                    <rect
                                        x="12"
                                        y="20"
                                        width="29"
                                        height="4"
                                        fill="currentColor"
                                    />
                                    <rect
                                        x="8"
                                        y="20"
                                        width="4"
                                        height="4"
                                        fill="currentColor"
                                    />
                                    <rect
                                        x="5"
                                        y="20"
                                        width="5"
                                        height="4"
                                        fill="currentColor"
                                    />
                                    <rect
                                        x="8"
                                        y="16"
                                        width="4"
                                        height="4"
                                        fill="currentColor"
                                    />
                                    <rect
                                        x="8"
                                        y="24"
                                        width="4"
                                        height="4"
                                        fill="currentColor"
                                    />
                                    <rect
                                        x="12"
                                        y="12"
                                        width="4"
                                        height="4"
                                        fill="currentColor"
                                    />
                                    <rect
                                        x="12"
                                        y="28"
                                        width="4"
                                        height="4"
                                        fill="currentColor"
                                    />
                                    <rect
                                        x="16"
                                        y="8"
                                        width="4"
                                        height="4"
                                        fill="currentColor"
                                    />
                                    <rect
                                        x="16"
                                        y="32"
                                        width="4"
                                        height="4"
                                        fill="currentColor"
                                    />
                                </svg>
                            </Link>

                            {/* Title */}
                            <h1 className="flex-1 text-center font-['Orbitron'] text-sm font-bold tracking-[0.05em] text-[#1e3a8a] uppercase min-[390px]:text-base min-[390px]:tracking-[0.1em] sm:text-xl md:text-2xl md:tracking-[0.15em] lg:text-3xl 2xl:text-4xl dark:text-white">
                                SELECT YOUR COURSE
                            </h1>

                            {/* Spacer to center title on mobile */}
                            <div className="h-10 w-10 shrink-0 md:hidden" />
                        </div>
                    </div>
                </div>
                <div
                    className="relative flex-1 overflow-x-clip overflow-y-auto"
                    style={{
                        scrollbarWidth: 'thin',
                        scrollbarColor: 'rgba(99,130,255,0.3) transparent',
                    }}
                >
                    {/* Background Glows Container */}
                    <div
                        className="pointer-events-none absolute top-0 left-0 z-0 w-full overflow-hidden"
                        style={{ height: contentHeight, minHeight: '100%' }}
                    >
                        {Array.from({ length: pages }).map((_, i) => (
                            <div
                                key={i}
                                className="pointer-events-none absolute left-1/2 h-[300px] w-[1800px] max-w-full -translate-x-1/2 rounded-full bg-[#3B82F6] opacity-[0.08] blur-[120px] md:blur-[150px] dark:opacity-[0.16]"
                                style={{ top: `${20 + i * 100}vh` }}
                            />
                        ))}
                    </div>
                    <div
                        ref={contentRef}
                        className="relative z-10 grid grid-cols-2 gap-4 p-4 sm:gap-6 md:grid-cols-3 md:gap-8 md:p-6 lg:grid-cols-3 lg:gap-10 xl:grid-cols-4 xl:gap-14"
                    >
                        {courses.map((course) => {
                            const isLocked = course.status === 'locked';
                            const isActive = course.status === 'active';
                            const isCompleted = course.status === 'completed';
                            const isUnlocked = course.status === 'unlocked';

                            return (
                                <div
                                    key={course._id}
                                    className={`group relative flex cursor-pointer flex-col overflow-hidden rounded-[12px] border shadow-[0_18px_45px_rgba(15,23,42,0.06)] transition-all duration-500 ${isLocked ? 'border-blue-300 bg-slate-100 shadow-[0_0_30px_rgba(15,23,42,0.08)] dark:border-[#1e3a8a] dark:bg-[#02040f]' : 'border-blue-300 bg-white dark:border-[#1e3a8a] dark:bg-[#061028]'} ${isLocked && 'pointer-events-none'} ${
                                        !isLocked
                                            ? isActive
                                                ? 'border-indigo-600 hover:shadow-[0_0_30px_rgba(59,40,246,0.12)]'
                                                : isCompleted
                                                  ? 'border-emerald-500 hover:shadow-[0_0_25px_rgba(16,185,129,0.18)]'
                                                  : isUnlocked
                                                    ? 'border-[#FACC15] hover:shadow-[0_0_25px_rgba(250,204,21,0.14)]'
                                                    : 'border-[#FACC15] hover:shadow-[0_0_25px_rgba(250,204,21,0.12)] dark:border-[#FACC15]'
                                            : ''
                                    } `}
                                >
                                    {/* IMAGE */}
                                    <div className="relative aspect-[16/9] w-full overflow-hidden border-b border-slate-200/40 bg-slate-100 dark:border-[#1e2759]/60 dark:bg-slate-900">
                                        <img
                                            src={course.thumbnail}
                                            alt={course.title}
                                            className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                                            onError={(e) => {
                                                e.currentTarget.src =
                                                    'https://via.placeholder.com/400x300?text=No+Image';
                                            }}
                                        />

                                        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-slate-50/30 via-transparent to-slate-50/0 dark:from-[#020714]/95 dark:via-transparent dark:to-[#000000]/0" />
                                    </div>

                                    {/* CONTENT */}
                                    <div className="flex flex-1 flex-col p-3 sm:p-4 md:p-5">
                                        <h2 className="mb-1.5 line-clamp-1 text-sm font-semibold text-slate-900 transition-colors duration-300 group-hover:text-[#3b4ffa] sm:text-base md:text-lg dark:text-slate-100 dark:group-hover:text-[#8ea8ff]">
                                            {course.title}
                                        </h2>
                                        <p className="mb-4 line-clamp-2 text-xs text-slate-600 sm:text-sm md:line-clamp-3 dark:text-slate-400">
                                            {course.description}
                                        </p>

                                        {/* BUTTON */}
                                        <div className="mt-auto">
                                            <div
                                                onClick={(e) => {
                                                    e.stopPropagation();

                                                    // ❌ Kalau sedang dikerjakan → langsung masuk course
                                                    if (
                                                        course.status ===
                                                        'active'
                                                    ) {
                                                        router.get(
                                                            `/student/courses/${course.slug}`,
                                                        );
                                                        return;
                                                    }

                                                    // ❌ Kalau sudah selesai → langsung masuk ulang
                                                    if (
                                                        course.status ===
                                                        'completed'
                                                    ) {
                                                        router.get(
                                                            `/student/courses/${course.slug}`,
                                                        );
                                                        return;
                                                    }

                                                    // ✅ Hanya kondisi ini yang boleh buka modal
                                                    if (
                                                        course.status ===
                                                            'unlocked' ||
                                                        !course.status
                                                    ) {
                                                        handleMulaiBelajar(
                                                            course,
                                                        );
                                                    }
                                                }}
                                                className={`w-full cursor-pointer rounded-xl border py-1.5 text-center text-[10px] font-bold transition-all duration-300 sm:py-2 sm:text-xs md:py-2.5 md:text-sm ${
                                                    isActive &&
                                                    `border-indigo-600 bg-indigo-600 text-white shadow-[0_0_18px_rgba(79,70,229,0.18)] hover:border-indigo-500 hover:bg-indigo-500`
                                                } ${
                                                    isCompleted &&
                                                    `border-emerald-500 bg-emerald-500 text-white shadow-[0_0_10px_rgba(16,185,129,0.3)] hover:border-emerald-600 hover:bg-emerald-600`
                                                } ${
                                                    isLocked &&
                                                    `cursor-not-allowed border-slate-200 bg-slate-200 text-slate-700 shadow-sm dark:border-slate-700 dark:bg-slate-700 dark:text-slate-300`
                                                } ${
                                                    !course.status &&
                                                    `border-[#FACC15] text-[#FACC15] hover:bg-[#FACC15] hover:text-white dark:hover:text-[#090d19]`
                                                } ${
                                                    isUnlocked &&
                                                    `border-[#FACC15] text-[#FACC15] hover:bg-[#FACC15] hover:text-white`
                                                } `}
                                            >
                                                {isActive && (
                                                    <span className="flex items-center justify-center gap-1">
                                                        <span className="h-1 w-1 animate-pulse rounded-full bg-white sm:h-1.5 sm:w-1.5" />
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
                                        <div className="absolute inset-0 z-20 flex items-center justify-center rounded-sm px-4">
                                            <div className="flex h-10 w-10 items-center justify-center rounded-full border border-blue-400 bg-blue-200/60 shadow-md sm:h-14 sm:w-14 dark:border-blue-700 dark:bg-blue-950/40">
                                                <Lock className="h-5 w-5 text-blue-600 sm:h-7 sm:w-7 dark:text-blue-400" />
                                            </div>
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* EMPTY */}
                {courses.length === 0 && (
                    <div className="mt-20 text-center text-xl tracking-wider text-slate-500">
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
                        className="fixed inset-0 z-[100] flex items-center justify-center bg-[#020202]/30 p-4 backdrop-blur-xs lg:p-6"
                    >
                        {/* ================= CARD MODAL ================= */}
                        <motion.div
                            initial={{
                                clipPath: 'inset(50% 0% 50% 0%)',
                                opacity: 0,
                            }}
                            animate={{
                                clipPath: 'inset(0% 0% 0% 0%)',
                                opacity: 1,
                            }}
                            exit={{
                                clipPath: 'inset(50% 0% 50% 0%)',
                                opacity: 0,
                            }}
                            transition={{
                                duration: 0.45,
                                ease: [0.22, 1, 0.36, 1], // lebih smooth dari easeInOut
                            }}
                            onClick={(e) => e.stopPropagation()}
                            className="relative w-full max-w-[560px] overflow-hidden rounded-xl border-2 border-[#3B28F6] bg-[#020202] will-change-[clip-path,opacity] md:max-w-[640px] md:rounded-[16px] md:border-[3px] lg:max-w-[720px] xl:max-w-[780px] 2xl:max-w-[860px]"
                        >
                            {/* ================= THUMBNAIL ================= */}
                            <div className="xs:h-[165px] relative h-[140px] w-full overflow-hidden md:h-[200px] lg:h-[220px]">
                                {/* BACKGROUND (ISI AREA) */}
                                <img
                                    src={selectedCourse.thumbnail}
                                    className="absolute inset-0 h-full w-full scale-110 object-cover opacity-20"
                                />
                                {/* MAIN IMAGE (TIDAK TERPOTONG) */}
                                <img
                                    src={selectedCourse.thumbnail}
                                    alt={selectedCourse.title}
                                    className="relative z-10 h-full w-full object-contain object-center"
                                    onError={(e) => {
                                        e.currentTarget.src =
                                            'https://via.placeholder.com/700x300?text=No+Image';
                                    }}
                                />
                                {/* close button */}
                                <button
                                    onClick={handleCancelDesc}
                                    className="absolute top-2.5 right-2.5 z-10 flex h-8 w-8 items-center justify-center rounded-full border border-white/20 bg-black/70 transition hover:bg-red-500/80 md:top-3 md:right-3 md:h-9 md:w-9"
                                >
                                    <X className="h-3.5 w-3.5 text-white md:h-4 md:w-4" />
                                </button>
                            </div>

                            {/* ================= BODY ================= */}
                            <div className="px-4 py-4 md:px-7 md:py-5 lg:px-8">
                                {/* TITLE */}
                                <h1 className="xs:text-lg text-base leading-snug font-bold text-white sm:text-xl md:text-2xl lg:text-3xl">
                                    {selectedCourse.title}
                                </h1>

                                {/* DIVIDER */}
                                <div className="my-3 flex items-center gap-3 md:my-4">
                                    <div className="h-[1px] flex-1 bg-gradient-to-r from-[#3B28F6] to-transparent" />
                                    <div className="h-2 w-2 rotate-45 border border-blue-500" />
                                    <div className="h-[1px] flex-1 bg-gradient-to-l from-[#3B28F6] to-transparent" />
                                </div>

                                {/* ================= DESKRIPSI (SCROLL FIX) ================= */}
                                <div className="xs:max-h-[110px] xs:text-sm max-h-[85px] overflow-y-auto pr-1.5 text-xs leading-relaxed text-slate-300 [scrollbar-color:rgba(59,40,246,0.5)_transparent] [scrollbar-width:thin] md:max-h-[130px] md:text-base">
                                    {selectedCourse.description}
                                </div>

                                {/* ================= INFO BOX ================= */}
                                <div className="mt-4 flex flex-wrap gap-2.5 md:mt-5 md:gap-3">
                                    {/* MODUL */}
                                    <div className="xs:gap-2 xs:px-3 xs:py-2 xs:min-w-[140px] flex min-w-[110px] flex-1 items-center gap-1.5 rounded-md border border-white/10 bg-[#03062C] px-2.5 py-1.5 sm:min-w-[160px]">
                                        <BookOpen className="h-4 w-4 shrink-0 text-yellow-400 sm:h-5 sm:w-5" />

                                        <span className="xs:text-xs text-[11px] leading-none font-extrabold text-white sm:text-sm md:text-base lg:text-lg">
                                            Modul:{' '}
                                            <span className="font-bold text-white">
                                                45
                                            </span>
                                        </span>
                                    </div>

                                    {/* FORMAT */}
                                    <div className="xs:gap-2 xs:px-3 xs:py-2 xs:min-w-[140px] flex min-w-[110px] flex-1 items-center gap-1.5 rounded-md border border-white/10 bg-[#03062C] px-2.5 py-1.5 sm:min-w-[160px]">
                                        <MonitorPlay className="h-4 w-4 shrink-0 text-yellow-400 sm:h-5 sm:w-5" />

                                        <span className="xs:text-xs text-[11px] leading-none font-extrabold text-white sm:text-sm md:text-base lg:text-lg">
                                            Format:{' '}
                                            <span className="font-bold text-white">
                                                Video & Project
                                            </span>
                                        </span>
                                    </div>
                                </div>

                                {/* ================= BUTTON ================= */}
                                <button
                                    onClick={handleLanjutKeConfirm}
                                    className="xs:text-sm mt-5 flex w-full items-center justify-center gap-2 rounded-md bg-[#FACC15] py-2.5 text-xs font-bold tracking-wide text-[#020202] uppercase transition-all duration-300 hover:bg-yellow-300 active:scale-[0.97] md:mt-6 md:py-3"
                                >
                                    Mulai →
                                </button>
                            </div>

                            {/* FOOTER */}
                            <p className="pb-3 text-center text-[9px] tracking-widest text-slate-600 uppercase sm:text-[10px] md:pb-4">
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
                            initial={{
                                clipPath: 'inset(50% 0% 50% 0%)',
                                opacity: 0,
                            }}
                            animate={{
                                clipPath: 'inset(0% 0% 0% 0%)',
                                opacity: 1,
                            }}
                            exit={{
                                clipPath: 'inset(50% 0% 50% 0%)',
                                opacity: 0,
                            }}
                            transition={{ duration: 0.5, ease: 'easeInOut' }}
                            className="relative w-full max-w-2xl rounded border border-[#FACC15] bg-[#020202] shadow-[0_0_0_2px_rgba(0,191,255,0.2),0_0_30px_rgba(250,204,21,0.15)] md:shadow-[0_0_0_2px_rgba(0,191,255,0.2),0_0_50px_rgba(250,204,21,0.25)]"
                        >
                            {/* Header */}
                            <div className="relative z-10 flex items-center gap-3 px-4 py-2.5 md:gap-5 md:px-5 md:py-3">
                                {/* GARIS */}
                                <div className="absolute right-4 bottom-0 left-4 h-[1px] bg-slate-800 md:right-5 md:left-5 dark:bg-slate-700/60" />

                                {/* ICON */}
                                <div
                                    className="flex h-6 w-6 flex-shrink-0 items-center justify-center md:h-7 md:w-7"
                                    style={{
                                        border: '1px solid #FACC15',
                                        background: 'rgba(250,204,21,0.15)',
                                    }}
                                >
                                    <TriangleAlert className="h-3.5 w-3.5 text-yellow-400 md:h-4 md:w-4" />
                                </div>

                                {/* TITLE */}
                                <h1
                                    className="xs:tracking-[0.2em] xs:text-base text-sm font-bold tracking-[0.12em] text-white uppercase sm:text-lg sm:tracking-[0.3em] md:text-xl"
                                    style={{
                                        fontFamily: 'Orbitron, sans-serif',
                                    }}
                                >
                                    Confirmation
                                </h1>
                            </div>

                            {/* Body */}
                            <div className="relative z-10 flex flex-col gap-3.5 px-4 py-4 md:gap-4 md:px-5 md:pt-5 md:pb-5">
                                {/* Question */}
                                <p
                                    className="xs:text-sm text-center text-xs leading-relaxed font-semibold text-white sm:text-base md:text-lg"
                                    style={{
                                        fontFamily: 'Orbitron',
                                        letterSpacing: '0.05em',
                                    }}
                                >
                                    Are you sure you want to select this course?
                                </p>

                                {/* Warning box */}
                                <div className="xs:p-4 border border-[#cc0000] bg-[#110000] p-3 shadow-[inset_0_0_15px_rgba(180,0,0,0.1)]">
                                    {/* Warning label */}
                                    <div className="mb-2 flex items-center gap-2 md:mb-3">
                                        <div className="text-red-600">
                                            <AlertOctagon className="h-5 w-5 font-bold md:h-6 md:w-6" />
                                        </div>
                                        <p
                                            className="text-xs font-bold tracking-widest text-red-500 uppercase md:text-sm"
                                            style={{ fontFamily: 'Oxanium' }}
                                        >
                                            System Warning
                                        </p>
                                    </div>

                                    {/* Warning text */}
                                    <p
                                        className="xs:text-sm text-center text-xs leading-relaxed text-white md:text-base"
                                        style={{ fontFamily: 'Oxanium' }}
                                    >
                                        Once selected, you{' '}
                                        <span className="font-bold text-[#EE0202]">
                                            must complete
                                        </span>{' '}
                                        this course before you can unlock or
                                        access other course.
                                    </p>
                                </div>

                                {/* Buttons */}
                                <div className="xs:gap-3 flex flex-col gap-2.5 pt-1 sm:flex-row">
                                    <button
                                        onClick={handleCancelConfirm}
                                        className="xs:py-2.5 xs:tracking-[0.2em] xs:text-sm flex-1 py-2 text-xs tracking-[0.12em] uppercase transition-all duration-200 hover:bg-white/10 sm:text-base md:py-3 md:text-lg"
                                        style={{
                                            fontFamily: 'Oxanium',
                                            background: '#111',
                                            border: '1.5px solid #444',
                                            color: '#aaaaaa',
                                        }}
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={handleConfirm}
                                        disabled={processing}
                                        className="xs:py-2.5 xs:tracking-[0.2em] xs:text-sm flex-1 py-2 text-xs font-bold tracking-[0.12em] uppercase transition-all duration-300 disabled:cursor-not-allowed disabled:opacity-50 sm:text-base md:py-3 md:text-xl"
                                        style={{
                                            fontFamily: 'Oxanium',
                                            background: processing
                                                ? 'rgba(250,204,21,0.15)'
                                                : '#FACC15',
                                            border: '1px solid #FACC15',
                                            color: processing
                                                ? '#FACC15'
                                                : '#020202',
                                            boxShadow:
                                                '0 0 12px rgba(250,204,21,0.25)',
                                        }}
                                        onMouseEnter={(e) => {
                                            if (!processing)
                                                (
                                                    e.currentTarget as HTMLButtonElement
                                                ).style.boxShadow =
                                                    '0 0 24px rgba(250,204,21,0.65)';
                                        }}
                                        onMouseLeave={(e) => {
                                            (
                                                e.currentTarget as HTMLButtonElement
                                            ).style.boxShadow =
                                                '0 0 12px rgba(250,204,21,0.25)';
                                        }}
                                    >
                                        {processing
                                            ? 'Processing...'
                                            : 'Confirm >'}
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
