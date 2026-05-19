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
        <div className="relative flex flex-col items-center w-full max-w-[280px] md:max-w-[290px] lg:max-w-[300px] xl:max-w-[400px] 2xl:max-w-[470px] z-10 transition-all">
 
            <Wrapper
                {...(href && !locked ? { href } : {})}
                className={[
                    "block w-full rounded-sm transition-all p-[2px]",
                    !locked ? "hover:shadow-[0_4px_18px_rgba(99,102,241,0.35)]" : "",
                ].join(" ")}
                style={{
                    /* done & unlocked: SAMA — biru ungu kuning
                       locked: biru muda tipis saja */
                    background: locked
                        ? "linear-gradient(to right, #60a5fa, #3b82f6, #60a5fa)"
                        : "linear-gradient(to right, #3b82f6, #7c3aed, #facc15)",
                    boxShadow: locked
                        ? "0 0 0 1px rgba(96,165,250,0.7), 0 2px 14px rgba(59,130,246,0.35)"
                        : "0 0 0 1px rgba(59,130,246,0.4), 0 2px 12px rgba(99,102,241,0.2)",
                }}
            >
                <div
                    className={[
                        "w-full h-full rounded-sm p-3 flex gap-3 items-center",
                        "dark:bg-[#0D1037]",
                        /* light bg: biru tipis saat locked, putih saat unlocked/done */
                        locked ? "bg-[#f0f7ff]" : "bg-white",
                    ].join(" ")}
                >
                    {/* ── ICON / IMAGE ── */}
                    <div className={[
                        "w-16 h-16 rounded-lg flex items-center justify-center flex-shrink-0 overflow-hidden border-2",
                        locked
                            ? "bg-blue-50 border-blue-200 dark:bg-gray-800/40 dark:border-gray-600"
                            : "bg-blue-100 border-blue-400 dark:bg-blue-900/40 dark:border-blue-500",
                    ].join(" ")}>
                        {thumbnail ? (
                            <img
                                src={`/storage/${thumbnail}`}
                                className="w-full h-full object-cover"
                                alt="thumbnail"
                            />
                        ) : locked ? (
                            /* kunci — biru muda light, abu dark */
                            <svg viewBox="0 0 24 24" fill="none"
                                className="w-7 h-7 text-blue-300 dark:text-gray-400">
                                <rect x="5" y="11" width="14" height="10" rx="2.5"
                                    fill="currentColor" fillOpacity="0.15"
                                    stroke="currentColor" strokeWidth="1.5"/>
                                <path d="M8 11V7a4 4 0 0 1 8 0v4"
                                    stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                                <circle cx="12" cy="16" r="1.5"
                                    fill="currentColor" fillOpacity="0.9"/>
                                <line x1="12" y1="17.5" x2="12" y2="19"
                                    stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                            </svg>
                        ) : done ? (
                            /* done: buku — biru (bukan hijau) */
                            <svg viewBox="0 0 24 24" fill="none"
                                className="w-7 h-7 text-blue-500 dark:text-blue-400">
                                <path d="M2 6c0-1.1.9-2 2-2h5a3 3 0 0 1 3 3v13a2.5 2.5 0 0 0-2.5-2.5H4a2 2 0 0 1-2-2V6Z"
                                    stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>
                                <path d="M22 6c0-1.1-.9-2-2-2h-5a3 3 0 0 0-3 3v13a2.5 2.5 0 0 1 2.5-2.5H20a2 2 0 0 0 2-2V6Z"
                                    stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>
                                <path d="M12 7v13"
                                    stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                            </svg>
                        ) : (
                            /* unlocked: roket biru */
                            <svg viewBox="0 0 24 24" fill="none"
                                className="w-7 h-7 text-blue-500 dark:text-blue-400">
                                <path d="M12 2C12 2 7 6 7 13l2 2c0-4 1.5-7 3-9 1.5 2 3 5 3 9l2-2c0-7-5-11-5-11Z"
                                    stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>
                                <path d="M9 15l-2 4 3-1M15 15l2 4-3-1"
                                    stroke="currentColor" strokeWidth="1.5"
                                    strokeLinecap="round" strokeLinejoin="round"/>
                                <circle cx="12" cy="13" r="1.5" fill="currentColor"/>
                            </svg>
                        )}
                    </div>
 
                    {/* ── TEXT ── */}
                    <div className="flex flex-col text-left">
                        <h3 className={[
                            "font-['Orbitron'] font-bold text-sm leading-tight uppercase tracking-wide md:text-[13px]",
                            /* judul: biru medium saat locked, normal saat done/unlocked */
                            locked
                                ? "text-blue-500 dark:text-white"
                                : "text-gray-900 dark:text-white",
                        ].join(" ")}>
                            {title}
                        </h3>
 
                        <p className={[
                            "text-[10px] sm:text-[11px] mt-1 leading-snug line-clamp-2",
                            locked
                                ? "text-blue-400/80 dark:text-gray-400"
                                : "text-gray-500 dark:text-gray-400",
                        ].join(" ")}>
                            Kelas ini akan membantumu memahami dasar-dasar pemrograman web modern, mulai dari HTML, CSS, hingga JavaScript,
                            dengan pendekatan yang praktis dan mudah diikuti.
                        </p>
 
                        {/* label LOCKED */}
                        {locked && (
                            <span className="mt-1.5 inline-flex items-center gap-1 text-[10px] font-semibold
                                text-blue-300 dark:text-gray-500 uppercase tracking-wider">
                                <svg viewBox="0 0 16 16" className="w-3 h-3" fill="currentColor">
                                    <path d="M11 7V5a3 3 0 1 0-6 0v2H4a1 1 0 0 0-1 1v6a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1V8a1 1 0 0 0-1-1h-1ZM6 5a2 2 0 1 1 4 0v2H6V5Z"/>
                                </svg>
                                Selesaikan level sebelumnya
                            </span>
                        )}
 
                        {/* label DONE — style sama dengan locked tapi isi beda */}
                        {done && !locked && (
                            <span className="mt-1.5 inline-flex items-center gap-1 text-[10px] font-semibold
                                text-blue-400 dark:text-blue-400 uppercase tracking-wider">
                                {/* centang kecil */}
                                <svg viewBox="0 0 16 16" className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                    <polyline points="2,9 6,13 14,4"/>
                                </svg>
                                Level selesai
                            </span>
                        )}
                    </div>
                </div>
            </Wrapper>
        </div>
    );
}
