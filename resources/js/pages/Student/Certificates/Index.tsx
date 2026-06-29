import { Link } from '@inertiajs/react';
import React, { useState } from 'react';

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

    const handlePrint = (id: string, url: string) => {
        setPrintingId(id);
        setTimeout(() => {
            setPrintingId(null);
            window.open(url, '_blank', 'noopener,noreferrer');
        }, 1200);
    };

    return (
        <div className="h-screen bg-gradient-to-br from-[#f8fafc] via-[#f1f5f9] to-[#e2e8f0] dark:from-[#050b18] dark:via-[#0a0f26] dark:to-[#040815] text-slate-800 dark:text-white flex flex-col p-4 sm:p-6 md:p-8 relative overflow-hidden transition-colors duration-500">

            <div className="w-full mx-auto relative z-10 flex-1 flex flex-col min-h-0">

                {/* HEADER */}
                <div className="flex items-center gap-4 sm:gap-6 -mt-7 mb-8 sm:mb-10 md:mb-12 shrink-0">
                    {/* Back Button Container */}
                    <div className="relative group cursor-pointer shrink-0">
                        <svg
                            className="w-[90px] h-[40px] sm:w-[110px] sm:h-[49px] md:w-[125px] md:h-[55px] overflow-visible"
                            viewBox="0 0 110 46"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <defs>
                                <linearGradient id="back_border_grad" x1="0%" y1="0%" x2="100%" y2="0%">
                                    <stop offset="0%" stopColor="#3B28F6" />
                                    <stop offset="100%" stopColor="#FACC15" />
                                </linearGradient>
                            </defs>
                            {/* Angled cut shape path */}
                            <path
                                d="M 3,3 H 127 L 97,47 H 3 Z"
                                className="fill-slate-100/20 dark:fill-[#080e28]/40 transition-colors"
                                stroke="url(#back_border_grad)"
                                strokeWidth="2"
                                strokeLinejoin="miter"
                                style={{ filter: 'drop-shadow(0 0 3px rgba(59, 130, 246, 0.35))' }}
                            />
                        </svg>

                        <Link
                            href="/student/dashboard"
                            className="absolute inset-0 flex items-center justify-center text-[#1e3a8a] dark:text-blue-200 "
                        >
                            <svg
                                className="w-9 h-9 sm:w-11 sm:h-11 md:w-12 md:h-12"
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

                    <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-extrabold tracking-[0.05em] sm:tracking-[0.1em] uppercase font-['Orbitron'] text-[#1e3a8a] dark:text-[#F0F0F0] transition-colors duration-500">
                        CERTIFICATE
                    </h1>
                </div>

                {/* CARD CONTAINER — isi sisa tinggi layar */}
                <div
                    className="relative w-full rounded-2xl p-[1.5px] flex-1 flex flex-col min-h-0"
                    style={{
                        background: "linear-gradient(to right, #3B28F6 0%, #4c2fff 30%, #7c3aed 50%, #facc15 100%)",
                    }}
                >
                    <div className="bg-white dark:bg-[#100f0f] rounded-[14px] p-6 sm:p-8 md:p-10 flex-1 flex flex-col min-h-0 transition-colors duration-500">

                        {/* HEADER — cuma muncul di lg+, fixed di atas, gak ikut scroll */}
                        <div className="hidden lg:grid grid-cols-3 items-center mb-2 px-6 text-sm font-bold text-slate-400 dark:text-[#f0f0f0] uppercase tracking-[0.2em] font-['Orbitron'] border-b border-slate-200/60 dark:border-slate-800/60 pb-4 transition-colors duration-500 shrink-0">
                            <div className="text-left">ID CERTIFICATE</div>
                            <div className="text-center">NAME COURSE</div>
                            <div className="text-right">ACTIONS</div>
                        </div>

                        {certificates.length === 0 ? (
                            <div className="flex-1 flex items-center justify-center text-center text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] sm:tracking-[0.25em] text-xs sm:text-base font-bold font-['Oxanium']">
                                NO CERTIFICATES YET
                            </div>
                        ) : (
                            <div className="flex-1 overflow-y-auto min-h-0 custom-scrollbar pr-1 -mr-1 space-y-3 sm:space-y-4">
                                {certificates.map((cert) => (
                                    <div
                                        key={cert.id}
                                        className="bg-slate-50/60 dark:bg-[#99E4FD]/5 border border-slate-200/70 dark:border-slate-800/60 rounded-xl px-4 sm:px-6 py-4 sm:py-5 transition-all duration-300"
                                    >
                                        {/* ===== MOBILE / TABLET (base sampai < lg): stacked card ===== */}
                                        <div className="flex flex-col gap-3 lg:hidden">
                                            <div>
                                                <p className="text-[9px] uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500 font-['Orbitron'] mb-1">
                                                    ID Certificate
                                                </p>
                                                <p className="font-['Orbitron'] font-medium text-slate-700 dark:text-slate-200 text-xs sm:text-sm tracking-wider break-all">
                                                    {cert.certificate_id}
                                                </p>
                                            </div>

                                            <div>
                                                <p className="text-[9px] uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500 font-['Orbitron'] mb-1">
                                                    Name Course
                                                </p>
                                                <p className="font-['Orbitron'] font-bold text-slate-800 dark:text-slate-100 uppercase text-xs sm:text-sm tracking-wider break-words">
                                                    {cert.course_name}
                                                </p>
                                            </div>

                                            <button
                                                onClick={() => handlePrint(cert.id, cert.certificate_url)}
                                                disabled={printingId !== null}
                                                className="inline-flex items-center justify-center gap-1.5 w-full sm:w-auto sm:self-end px-3 py-2 rounded-sm cursor-pointer bg-indigo-100 text-indigo-700 dark:bg-[#3B28F6] dark:text-white disabled:opacity-50 disabled:cursor-not-allowed text-xs sm:text-sm"
                                                style={{ fontFamily: "'Orbitron', sans-serif" }}
                                            >
                                                {printingId === cert.id ? (
                                                    <span className="flex items-center gap-1.5 justify-center">
                                                        <svg className="animate-spin h-3.5 w-3.5 text-white" fill="none" viewBox="0 0 24 24">
                                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                                        </svg>
                                                        <span>CETAK...</span>
                                                    </span>
                                                ) : (
                                                    <span>CETAK</span>
                                                )}
                                            </button>
                                        </div>

                                        {/* ===== DESKTOP (lg+): grid 3 kolom kayak semula ===== */}
                                        <div className="hidden lg:grid grid-cols-3 items-center">
                                            <div className="text-left font-['Orbitron'] font-medium text-slate-700 dark:text-slate-200 text-sm tracking-wider break-all pr-4">
                                                {cert.certificate_id}
                                            </div>

                                            <div className="text-center font-['Orbitron'] font-bold text-slate-800 dark:text-slate-100 uppercase text-sm tracking-wider break-words px-2">
                                                {cert.course_name}
                                            </div>

                                            <div className="text-right">
                                                <button
                                                    onClick={() => handlePrint(cert.id, cert.certificate_url)}
                                                    disabled={printingId !== null}
                                                    className="inline-flex items-center justify-center px-2 py-1 rounded-sm cursor-pointer bg-indigo-100 text-indigo-700 dark:bg-[#3B28F6] dark:text-white disabled:opacity-50 disabled:cursor-not-allowed"
                                                    style={{ fontFamily: "'Orbitron', sans-serif" }}
                                                >
                                                    {printingId === cert.id ? (
                                                        <span className="flex items-center gap-1.5 justify-center">
                                                            <svg className="animate-spin h-3.5 w-3.5 text-white" fill="none" viewBox="0 0 24 24">
                                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                                            </svg>
                                                            <span>CETAK...</span>
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