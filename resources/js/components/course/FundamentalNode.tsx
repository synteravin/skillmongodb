import { Link } from '@inertiajs/react';

type Props = {
    title: string
    index: number
    isLast?: boolean
    href?: string
    thumbnail?: string | null
}

export default function FundamentalNode({ title, isLast, href, thumbnail }: Props) {
    return (
        <div className="flex flex-col items-center relative z-10 w-full max-w-[420px] mx-auto transition-all">
            <Link 
                href={href || "#"} 
                className="block w-full rounded-xl transition-all p-[2px] hover:shadow-[0_4px_20px_rgba(99,102,241,0.35)]"
                style={{
                    background: "linear-gradient(to right, #3b82f6, #7c3aed, #facc15)",
                    boxShadow: "0 0 0 1px rgba(59,130,246,0.3), 0 2px 12px rgba(99,102,241,0.15)",
                }}
            >
                <div className="w-full h-full rounded-xl p-4 flex gap-4 items-center bg-[#0D1037] text-white">
                    {/* Icon / Image block */}
                    <div className="w-16 h-16 rounded-lg flex items-center justify-center flex-shrink-0 overflow-hidden border-2 bg-blue-900/40 border-blue-500">
                        {thumbnail ? (
                            <img
                                src={`/storage/${thumbnail}`}
                                className="w-full h-full object-cover"
                                alt="thumbnail"
                            />
                        ) : (
                            /* rocket icon */
                            <svg viewBox="0 0 24 24" fill="none" className="w-7 h-7 text-blue-400">
                                <path d="M12 2C12 2 7 6 7 13l2 2c0-4 1.5-7 3-9 1.5 2 3 5 3 9l2-2c0-7-5-11-5-11Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>
                                <path d="M9 15l-2 4 3-1M15 15l2 4-3-1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                                <circle cx="12" cy="13" r="1.5" fill="currentColor"/>
                            </svg>
                        )}
                    </div>

                    <div className="flex flex-col text-left min-w-0">
                        <h3 className="font-['Orbitron'] font-bold text-sm uppercase tracking-wide text-white leading-tight truncate">
                            {title}
                        </h3>
                        <p className="text-[10px] sm:text-[11px] text-slate-400 mt-1 leading-snug line-clamp-2 font-sans">
                            This fundamental module covers the core concepts, syntax, and essential tools required to begin programming modern web solutions.
                        </p>
                    </div>
                </div>
            </Link>

            {!isLast && <div className="w-[2px] h-12 bg-blue-500/70"></div>}
        </div>
    )
}