import { Link } from '@inertiajs/react';
import React, { useState, useRef, useEffect } from 'react';

interface Certificate {
    id: string;
    certificate_id: string;
    course_name: string;
    assignment_title: string;
    certificate_url: string;
}

interface Props {
    certificates: Certificate[];
}

export default function Index({ certificates }: Props) {
    const [printingId, setPrintingId] = useState<string | null>(null);

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

    const handlePrint = (id: string, url: string) => {
        setPrintingId(id);
        setTimeout(() => {
            setPrintingId(null);
            window.open(url, '_blank', 'noopener,noreferrer');
        }, 1200);
    };

    return (
        <div className="relative flex h-screen flex-col overflow-hidden bg-gradient-to-br from-[#f8fafc] via-[#f1f5f9] to-[#e2e8f0] p-4 text-slate-800 transition-colors duration-500 sm:p-6 md:p-8 dark:from-[#050b18] dark:via-[#0a0f26] dark:to-[#040815] dark:text-white">
            {/* Background Glows */}
            <div
                className="pointer-events-none absolute inset-0 z-0 overflow-hidden"
                style={{ height: contentHeight, minHeight: '100%' }}
            >
                {Array.from({ length: pages }).map((_, i) => (
                    <div
                        key={i}
                        className="absolute left-1/2 h-[300px] w-[1800px] max-w-full -translate-x-1/2 rounded-full bg-[#3B82F6] opacity-[0.08] blur-[120px] md:blur-[150px] dark:opacity-[0.16]"
                        style={{ top: `${20 + i * 100}vh` }}
                    />
                ))}
            </div>

            <div
                ref={contentRef}
                className="relative z-10 mx-auto flex min-h-0 w-full flex-1 flex-col"
            >
                {/* HEADER */}
                <div className="-mt-7 mb-8 flex shrink-0 items-center gap-4 sm:mb-10 sm:gap-6 md:mb-12">
                    {/* Back Button Container */}
                    <div className="group relative shrink-0 cursor-pointer">
                        <svg
                            className="h-[40px] w-[90px] overflow-visible sm:h-[49px] sm:w-[110px] md:h-[55px] md:w-[125px]"
                            viewBox="0 0 110 46"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <defs>
                                <linearGradient
                                    id="back_border_grad"
                                    x1="0%"
                                    y1="0%"
                                    x2="100%"
                                    y2="0%"
                                >
                                    <stop offset="0%" stopColor="#3B28F6" />
                                    <stop offset="100%" stopColor="#FACC15" />
                                </linearGradient>
                            </defs>
                            {/* Angled cut shape path */}
                            <path
                                d="M 3,3 H 127 L 97,47 H 3 Z"
                                className="fill-slate-100/20 transition-colors dark:fill-[#080e28]/40"
                                stroke="url(#back_border_grad)"
                                strokeWidth="2"
                                strokeLinejoin="miter"
                                style={{
                                    filter: 'drop-shadow(0 0 3px rgba(59, 130, 246, 0.35))',
                                }}
                            />
                        </svg>

                        <Link
                            href="/student/dashboard"
                            className="absolute inset-0 flex items-center justify-center text-[#1e3a8a] dark:text-blue-200"
                        >
                            <svg
                                className="h-9 w-9 sm:h-11 sm:w-11 md:h-12 md:w-12"
                                viewBox="0 0 44 44"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="3"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            >
                                {/* Arrow head pointing left */}
                                <path d="M 6 17 L 13 10 M 6 17 L 13 24" />
                                {/* Horizontal shaft then U-curve going right and curving down */}
                                <path d="M 9 17 H 36 C 42 19 43 30 32 30 H 15" />
                            </svg>
                        </Link>
                    </div>

                    <h1 className="font-['Orbitron'] text-xl font-extrabold tracking-[0.05em] text-[#1e3a8a] uppercase transition-colors duration-500 sm:text-2xl sm:tracking-[0.1em] md:text-3xl lg:text-4xl dark:text-[#F0F0F0]">
                        CERTIFICATE
                    </h1>
                </div>

                {/* CARD CONTAINER — isi sisa tinggi layar */}
                <div
                    className="relative flex min-h-0 w-full flex-1 flex-col rounded-2xl p-[1.5px]"
                    style={{
                        background:
                            'linear-gradient(to right, #3B28F6 0%, #4c2fff 30%, #7c3aed 50%, #facc15 100%)',
                    }}
                >
                    <div className="flex min-h-0 flex-1 flex-col rounded-[14px] bg-white p-6 transition-colors duration-500 sm:p-8 md:p-10 dark:bg-[#0b0d32]">
                        {/* HEADER — cuma muncul di lg+, fixed di atas, gak ikut scroll */}
                        <div className="mb-2 hidden shrink-0 grid-cols-3 items-center border-b border-slate-200/60 px-6 pb-4 font-['Orbitron'] text-sm font-bold tracking-[0.2em] text-slate-600 uppercase transition-colors duration-500 lg:grid dark:border-slate-800/60 dark:text-[#f0f0f0]">
                            <div className="text-left">ID CERTIFICATE</div>
                            <div className="text-center">NAME COURSE</div>
                            <div className="text-right">ACTIONS</div>
                        </div>

                        {certificates.length === 0 ? (
                            <div className="flex flex-1 items-center justify-center text-center font-['Oxanium'] text-xs font-bold tracking-[0.2em] text-slate-400 uppercase sm:text-base sm:tracking-[0.25em] dark:text-slate-500">
                                NO CERTIFICATES YET
                            </div>
                        ) : (
                            <div className="custom-scrollbar -mr-1 min-h-0 flex-1 space-y-3 overflow-y-auto pr-1 sm:space-y-4">
                                {certificates.map((cert) => (
                                    <div
                                        key={cert.id}
                                        className="rounded-xl border border-slate-300 bg-slate-100 px-4 py-4 shadow-sm transition-all duration-300 sm:px-6 sm:py-5 dark:border-slate-800/60 dark:bg-[#99E4FD]/5"
                                    >
                                        {/* ===== MOBILE / TABLET (base sampai < lg): stacked card ===== */}
                                        <div className="flex flex-col gap-3 lg:hidden">
                                            <div>
                                                <p className="mb-1 font-['Orbitron'] text-[9px] tracking-[0.2em] text-slate-500 uppercase dark:text-slate-400">
                                                    ID Certificate
                                                </p>
                                                <p className="font-['Orbitron'] text-xs font-bold tracking-wider break-all text-slate-900 sm:text-sm dark:text-slate-200">
                                                    {cert.certificate_id}
                                                </p>
                                            </div>

                                            <div>
                                                <p className="mb-1 font-['Orbitron'] text-[9px] tracking-[0.2em] text-slate-500 uppercase dark:text-slate-400">
                                                    Name Course
                                                </p>
                                                <p className="font-['Orbitron'] text-xs font-extrabold tracking-wider break-words text-slate-950 uppercase sm:text-sm dark:text-slate-100">
                                                    {cert.course_name}
                                                </p>
                                            </div>

                                            <button
                                                onClick={() =>
                                                    handlePrint(
                                                        cert.id,
                                                        cert.certificate_url,
                                                    )
                                                }
                                                disabled={printingId !== null}
                                                className="inline-flex w-full cursor-pointer items-center justify-center gap-1.5 rounded-md bg-indigo-600 px-4 py-2 text-xs text-white transition-colors hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto sm:self-end sm:text-sm dark:bg-[#3B28F6] dark:text-white dark:hover:bg-[#4c2fff]"
                                                style={{
                                                    fontFamily:
                                                        "'Orbitron', sans-serif",
                                                }}
                                            >
                                                {printingId === cert.id ? (
                                                    <span className="flex items-center justify-center gap-1.5">
                                                        <svg
                                                            className="h-3.5 w-3.5 animate-spin text-white"
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
                                                            />
                                                            <path
                                                                className="opacity-75"
                                                                fill="currentColor"
                                                                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                                            />
                                                        </svg>
                                                        <span>CETAK...</span>
                                                    </span>
                                                ) : (
                                                    <span>CETAK</span>
                                                )}
                                            </button>
                                        </div>

                                        {/* ===== DESKTOP (lg+): grid 3 kolom kayak semula ===== */}
                                        <div className="hidden grid-cols-3 items-center lg:grid">
                                            <div className="pr-4 text-left font-['Orbitron'] text-sm font-bold tracking-wider break-all text-slate-900 dark:text-slate-200">
                                                {cert.certificate_id}
                                            </div>

                                            <div className="px-2 text-center font-['Orbitron'] text-sm font-extrabold tracking-wider break-words text-slate-950 uppercase dark:text-slate-100">
                                                {cert.course_name}
                                            </div>

                                            <div className="text-right">
                                                <button
                                                    onClick={() =>
                                                        handlePrint(
                                                            cert.id,
                                                            cert.certificate_url,
                                                        )
                                                    }
                                                    disabled={
                                                        printingId !== null
                                                    }
                                                    className="inline-flex cursor-pointer items-center justify-center rounded-md bg-indigo-600 px-4 py-1.5 text-white transition-colors hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-[#3B28F6] dark:text-white dark:hover:bg-[#4c2fff]"
                                                    style={{
                                                        fontFamily:
                                                            "'Orbitron', sans-serif",
                                                    }}
                                                >
                                                    {printingId === cert.id ? (
                                                        <span className="flex items-center justify-center gap-1.5">
                                                            <svg
                                                                className="h-3.5 w-3.5 animate-spin text-white"
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
                                                                />
                                                                <path
                                                                    className="opacity-75"
                                                                    fill="currentColor"
                                                                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                                                />
                                                            </svg>
                                                            <span>
                                                                CETAK...
                                                            </span>
                                                        </span>
                                                    ) : (
                                                        <span>CETAK</span>
                                                    )}
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
