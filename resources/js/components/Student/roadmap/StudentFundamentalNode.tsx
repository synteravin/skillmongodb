import React from "react";
import { Link } from "@inertiajs/react";

type Props = {
    title: string;
    locked?: boolean;
    done?: boolean;
    thumbnail?: string | null;
    href?: string;
};

export default function StudentFundamentalNode({ title, locked = false, done = false, thumbnail, href }: Props) {
    const Wrapper = href && !locked ? Link : "div";

    return (
    <div
        className={`relative flex flex-col items-center w-full 
        max-w-[280px] 
        md:max-w-[290px] 
        lg:max-w-[300px] 
        xl:max-w-[400px] 
        2xl:max-w-[470px] 
        z-10 transition-all 
        ${locked ? 'opacity-40 grayscale' : ''}`}
        >
        <Wrapper 
            {...(href && !locked ? { href } : {})}
            className="block w-full rounded-sm p-[2px] transition-all"
            style={{
                background: "linear-gradient(to right, #3b82f6, #7c3aed, #facc15)"
            }}
        >
            <div className="w-full h-full rounded-sm bg-[#0D1037] p-3 flex gap-3 items-center">

            {/* ICON / IMAGE */}
            <div className={`
                w-16 h-16 rounded-lg flex items-center justify-center flex-shrink-0 overflow-hidden border
                ${done 
                    ? 'bg-green-900/30 border-green-500' 
                    : locked 
                        ? 'bg-gray-800/40 border-gray-600' 
                        : 'bg-blue-900/40 border-blue-500'
                }
            `}>
                {thumbnail ? (
                    <img
                        src={`/storage/${thumbnail}`}
                        className="w-full h-full object-cover"
                        alt="thumbnail"
                    />
                ) : done ? (
                    // ✅ Completed — Book terbuka warna hijau
                    <svg viewBox="0 0 24 24" fill="none" className="w-7 h-7 text-green-400">
                        <path d="M2 6c0-1.1.9-2 2-2h5a3 3 0 0 1 3 3v13a2.5 2.5 0 0 0-2.5-2.5H4a2 2 0 0 1-2-2V6Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>
                        <path d="M22 6c0-1.1-.9-2-2-2h-5a3 3 0 0 0-3 3v13a2.5 2.5 0 0 1 2.5-2.5H20a2 2 0 0 0 2-2V6Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>
                        <path d="M12 7v13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                    </svg>
                ) : locked ? (
                    <svg viewBox="0 0 24 24" fill="none" className="w-7 h-7 text-gray-400">
                        <rect x="5" y="11" width="14" height="10" rx="2.5" fill="currentColor" fillOpacity="0.15" stroke="currentColor" strokeWidth="1.5"/>
                        <path d="M8 11V7a4 4 0 0 1 8 0v4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                        <circle cx="12" cy="16" r="1.5" fill="currentColor" fillOpacity="0.9"/>
                        <line x1="12" y1="17.5" x2="12" y2="19" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                    </svg>
                ) : (
                    <svg viewBox="0 0 24 24" fill="none" className="w-7 h-7 text-blue-400">
                        <path d="M12 2C12 2 7 6 7 13l2 2c0-4 1.5-7 3-9 1.5 2 3 5 3 9l2-2c0-7-5-11-5-11Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>
                        <path d="M9 15l-2 4 3-1M15 15l2 4-3-1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                        <circle cx="12" cy="13" r="1.5" fill="currentColor"/>
                    </svg>
                )}
            </div>

                {/* TEXT */}
                <div className="flex flex-col text-left">
                    <h3 className="font-['Orbitron'] font-bold text-white text-sm leading-tight uppercase tracking-wide md:text-[13px]">
                        {title}
                    </h3>

                    <p className="text-[10px] sm:text-[11px] text-gray-400 mt-1 leading-snug line-clamp-2">
                        Kelas ini akan membantumu memahami dasar-dasar pemrograman web modern, mulai dari HTML, CSS, hingga JavaScript,
                        dengan pendekatan yang praktis dan mudah diikuti.
                    </p>
                </div>
            </div>
        </Wrapper>

    </div>
    );
}
