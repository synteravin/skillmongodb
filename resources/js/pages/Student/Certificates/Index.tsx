import { Link } from '@inertiajs/react';
import { Undo2 } from 'lucide-react';
import React from 'react';

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
    return (
        <div
            className="min-h-screen bg-[#020617] text-white flex flex-col p-3 sm:p-4"
            style={{ fontFamily: 'Orbitron, sans-serif' }}
        >
            {/* HEADER */}
            <div className="flex items-center mb-10 pl-4">
                <div className="relative group cursor-pointer mr-4">
                    <svg
                        className="w-[120px] h-[50px]"
                        viewBox="0 0 120 50"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path
                            d="M10 25 L30 5 H110 L90 45 H10 Z"
                            fill="rgba(15, 23, 42, 0.6)"
                            stroke="url(#paint_back_btn)"
                            strokeWidth="2"
                        />
                        <defs>
                            <linearGradient
                                id="paint_back_btn"
                                x1="0"
                                y1="25"
                                x2="120"
                                y2="25"
                                gradientUnits="userSpaceOnUse"
                            >
                                <stop stopColor="#facc15" />
                                <stop offset="1" stopColor="#3b82f6" />
                            </linearGradient>
                        </defs>
                    </svg>

                    <Link
                        href="/student/dashboard"
                        className="absolute inset-0 flex items-center justify-center text-white group-hover:text-yellow-400 transition-colors"
                    >
                        <Undo2 strokeWidth={3} className="w-8 h-8" />
                    </Link>
                </div>

                <h1 className="text-4xl font-black tracking-[0.15em] uppercase drop-shadow-[0_0_10px_rgba(255,255,255,0.3)]">
                    CERTIFICATE
                </h1>
            </div>

            {/* CONTAINER */}
            <div
                className="relative w-full max-w-6xl mx-auto rounded-xl p-[3px] shadow-[0_0_30px_rgba(79,70,229,0.2)]"
                style={{
                    background: 'linear-gradient(to right, #4f46e5, #a855f7, #facc15)',
                }}
            >
                <div className="bg-[#0f172a] rounded-lg p-8 sm:p-12 min-h-[500px]">

                    {/* TABLE HEADER */}
                    <div className="flex items-center mb-8 px-6 text-sm font-bold text-slate-300 uppercase tracking-widest border-b border-slate-700/50 pb-4">
                        <div className="w-1/3 text-left">ID CERTIFICATE</div>
                        <div className="w-1/3 text-center">NAME COURSE</div>
                        <div className="w-1/3 text-right">ACTIONS</div>
                    </div>

                    {/* TABLE CONTENT */}
                    <div className="space-y-5">
                        {certificates.length === 0 ? (
                            <div className="text-center py-16 text-slate-500 uppercase tracking-widest text-lg font-bold">
                                NO CERTIFICATES YET
                            </div>
                        ) : (
                            certificates.map((cert) => (
                                <div
                                    key={cert.id}
                                    className="flex items-center bg-[#1e293b] rounded-xl p-6 border border-transparent hover:border-indigo-500/50 hover:bg-[#334155] transition-all shadow-lg"
                                >
                                    <div className="w-1/3 font-bold text-slate-100 text-sm sm:text-base tracking-wider">
                                        {cert.certificate_id}
                                    </div>

                                    <div className="w-1/3 text-center font-bold text-slate-100 uppercase text-sm sm:text-base tracking-wider">
                                        {cert.course_name}
                                    </div>

                                    <div className="w-1/3 text-right">
                                        <a
                                            href={cert.certificate_url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="inline-flex items-center justify-center px-8 py-3 bg-gradient-to-r from-blue-600 to-indigo-500 rounded-lg text-white font-black uppercase text-sm tracking-widest hover:from-blue-500 hover:to-indigo-400 transition-all active:scale-95 shadow-[0_0_15px_rgba(79,70,229,0.6)]"
                                        >
                                            CETAK
                                        </a>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>

                </div>
            </div>
        </div>
    );
}