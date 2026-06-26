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
        <div className="min-h-screen bg-gradient-to-br from-[#f8fafc] via-[#f1f5f9] to-[#e2e8f0] dark:from-[#050b18] dark:via-[#0a0f26] dark:to-[#040815] text-slate-800 dark:text-white flex flex-col p-4 sm:p-6 md:p-8 relative overflow-hidden transition-colors duration-500">

            <div className="w-full mx-auto relative z-10 flex-1 flex flex-col justify-center">
                {/* HEADER */}
                <div className="flex items-center gap-4 sm:gap-6 -mt-5 md:mb-12">
                    {/* Back Button Container */}
                <div className="relative group cursor-pointer shrink-0">
                        <svg
                            className="w-[110px] h-[49px] overflow-visible"
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
                            className="w-15 h-12 "
                            viewBox="0 0 40 40"
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

               {/* CARD CONTAINER */}
        <div
            className="relative w-full rounded-2xl p-[1.5px]"
            style={{
                background: "linear-gradient(to right, #3B28F6 0%, #4c2fff 30%, #7c3aed 50%, #facc15 100%)",
            }}
        >
            <div className="bg-white dark:bg-[#100f0f] rounded-[14px] p-6 sm:p-8 md:p-10 min-h-[480px] transition-colors duration-500">
                                
                        {/* TABLE WRAPPER WITH RESPONSIVE SCROLL */}
                        <div className="overflow-x-auto custom-scrollbar -mx-6 px-6 sm:-mx-8 sm:px-8 md:-mx-10 md:px-10">
                            <div className="min-w-[650px] space-y-4">
                                
                                {/* TABLE HEADER */}
                                <div className="grid grid-cols-3 items-center mb-6 px-6 text-xs sm:text-sm font-bold text-slate-400 dark:text-[#f0f0f0] uppercase tracking-[0.2em] font-['Orbitron'] border-b border-slate-200/60 dark:border-slate-800/60 pb-4 transition-colors duration-500">
                                    <div className="text-left">ID CERTIFICATE</div>
                                    <div className="text-center">NAME COURSE</div>
                                    <div className="text-right">ACTIONS</div>
                                </div>

                                {/* TABLE CONTENT */}
                                {certificates.length === 0 ? (
                                    <div className="text-center py-24 text-slate-400 dark:text-slate-500 uppercase tracking-[0.25em] text-sm sm:text-base font-bold font-['Oxanium']">
                                        NO CERTIFICATES YET
                                    </div>
                                ) : (
                                    certificates.map((cert) => (
                                        <div
                                            key={cert.id}
                                            className="grid grid-cols-3 items-center bg-slate-50/60 dark:bg-[#99E4FD]/5 border  rounded-xl px-6 py-5 transition-all duration-300 "
                                        >
                                            {/* ID Certificate */}
                                            <div className="text-left font-['Orbitron'] font-medium text-slate-700 dark:text-slate-200 text-xs sm:text-sm tracking-wider">
                                                {cert.certificate_id}
                                            </div>

                                            {/* Name Course */}
                                            <div className="text-center font-['Orbitron'] font-bold text-slate-850 dark:text-slate-100 uppercase text-xs sm:text-sm tracking-wider">
                                                {cert.course_name}
                                            </div>

                                            {/* Actions */}
                                            <div className="text-right">
                                                <button
                                                    onClick={() => handlePrint(cert.id, cert.certificate_url)}
                                                    disabled={printingId !== null}
                                                   className="inline-flex items-center justify-center px-2 py-1 rounded-sm cursor-pointer bg-indigo-100 text-indigo-700 dark:bg-[#3B28F6] dark:text-white"
                                                    style={{
                                                        fontFamily: "'Orbitron', sans-serif"}}
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
                                    ))
                                )}
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
}
