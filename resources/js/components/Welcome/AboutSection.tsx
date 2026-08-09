import { useState, useEffect, useRef } from 'react';

// Hook untuk mengukur ukuran component secara dinamis
function useComponentSize() {
    const [size, setSize] = useState({ width: 0, height: 0 });
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!ref.current) return;

        const updateSize = () => {
            if (ref.current) {
                const rect = ref.current.getBoundingClientRect();
                setSize({ width: rect.width, height: rect.height });
            }
        };

        updateSize();

        const observer = new ResizeObserver(() => {
            updateSize();
        });
        observer.observe(ref.current);

        return () => observer.disconnect();
    }, []);

    return [ref, size] as const;
}

// Hook untuk mendeteksi breakpoint layar secara dinamis
function useMediaQuery(query: string): boolean {
    const [matches, setMatches] = useState(false);

    useEffect(() => {
        const media = window.matchMedia(query);
        if (media.matches !== matches) {
            setMatches(media.matches);
        }
        const listener = () => setMatches(media.matches);
        media.addEventListener('change', listener);
        return () => media.removeEventListener('change', listener);
    }, [matches, query]);

    return matches;
}

interface CardBackgroundProps {
    width: number;
    height: number;
    isMd: boolean;
}

// Komponen SVG Background untuk Card 1 (Tab di Kiri Bawah)
function Card1Background({ width, height, isMd }: CardBackgroundProps) {
    if (width === 0 || height === 0) return null;

    const r = 28; // radius sudut utama
    const tr = 20; // radius tab
    const cr = 12; // radius lengkungan dalam (concave)
    const th = 38; // tinggi tab
    const tw = 180; // lebar tab

    const d = isMd
        ? `M 0 ${r}
           A ${r} ${r} 0 0 1 ${r} 0
           L ${width - r} 0
           A ${r} ${r} 0 0 1 ${width} ${r}
           L ${width} ${height - r}
           A ${r} ${r} 0 0 1 ${width - r} ${height}
           L ${tw + cr} ${height}
           A ${cr} ${cr} 0 0 0 ${tw} ${height + cr}
           L ${tw} ${height + th - tr}
           A ${tr} ${tr} 0 0 1 ${tw - tr} ${height + th}
           L ${tw - tr} ${height + th}
           L ${tr} ${height + th}
           A ${tr} ${tr} 0 0 1 0 ${height + th - tr}
           L 0 ${r}
           Z`
        : `M ${r} 0
           L ${width - r} 0
           A ${r} ${r} 0 0 1 ${width} ${r}
           L ${width} ${height - r}
           A ${r} ${r} 0 0 1 ${width - r} ${height}
           L ${r} ${height}
           A ${r} ${r} 0 0 1 0 ${height - r}
           L 0 ${r}
           A ${r} ${r} 0 0 1 ${r} 0
           Z`;

    return (
        <svg
            className="pointer-events-none absolute inset-0 z-0 h-full w-full overflow-visible"
            style={{
                filter: 'drop-shadow(0 12px 30px rgba(0,0,0,0.4))',
            }}
        >
            <path
                d={d}
                fill="#1D215D"
                stroke="rgba(34, 211, 238, 0.4)" // cyan-400/40
                strokeWidth="1"
            />
        </svg>
    );
}

// Komponen SVG Background untuk Card 2 (Tab di Kanan Atas)
function Card2Background({ width, height, isMd }: CardBackgroundProps) {
    if (width === 0 || height === 0) return null;

    const r = 28; // radius sudut utama
    const tr = 24; // radius tab
    const cr = 16; // radius lengkungan dalam (concave)
    const th = 45; // tinggi tab
    const tw = 210; // lebar tab

    const d = isMd
        ? `M 0 ${r}
           A ${r} ${r} 0 0 1 ${r} 0
           L ${width - tw - cr} 0
           A ${cr} ${cr} 0 0 0 ${width - tw} -${cr}
           L ${width - tw} -${th - tr}
           A ${tr} ${tr} 0 0 1 ${width - tw + tr} -${th}
           L ${width - tw + tr} -${th}
           L ${width - tr} -${th}
           A ${tr} ${tr} 0 0 1 ${width} -${th - tr}
           L ${width} ${height - r}
           A ${r} ${r} 0 0 1 ${width - r} ${height}
           L ${r} ${height}
           A ${r} ${r} 0 0 1 0 ${height - r}
           L 0 ${r}
           Z`
        : `M ${r} 0
           L ${width - r} 0
           A ${r} ${r} 0 0 1 ${width} ${r}
           L ${width} ${height - r}
           A ${r} ${r} 0 0 1 ${width - r} ${height}
           L ${r} ${height}
           A ${r} ${r} 0 0 1 0 ${height - r}
           L 0 ${r}
           A ${r} ${r} 0 0 1 ${r} 0
           Z`;

    return (
        <svg
            className="pointer-events-none absolute inset-0 z-0 h-full w-full overflow-visible"
            style={{
                filter: 'drop-shadow(0 12px 30px rgba(0,0,0,0.4))',
            }}
        >
            <path
                d={d}
                fill="#1D215D"
                stroke="rgba(34, 211, 238, 0.4)" // cyan-400/40
                strokeWidth="1"
            />
        </svg>
    );
}

export default function AboutSection() {
    const [card1Ref, card1Size] = useComponentSize();
    const [card2Ref, card2Size] = useComponentSize();
    const isMd = useMediaQuery('(min-width: 768px)');

    const card1Measured = card1Size.width > 0 && card1Size.height > 0;
    const card2Measured = card2Size.width > 0 && card2Size.height > 0;

    const card1Class = `relative z-10 p-8 transition-all duration-300 ${
        isMd && card1Measured
            ? 'border-transparent bg-transparent shadow-none'
            : 'rounded-[28px] border border-cyan-400/40 bg-[#1D215D] shadow-[0_12px_30px_rgba(0,0,0,0.4)] md:shadow-[0_15px_35px_rgba(0,0,0,0.45)] lg:shadow-[0_8px_25px_rgba(0,0,0,0.35)]'
    }`;

    const card2Class = `relative z-10 p-8 transition-all duration-300 ${
        isMd && card2Measured
            ? 'border-transparent bg-transparent shadow-none'
            : 'rounded-[28px] border border-cyan-400/40 bg-[#1D215D] shadow-[0_12px_30px_rgba(0,0,0,0.4)] md:shadow-[0_15px_35px_rgba(0,0,0,0.45)] lg:shadow-[0_8px_25px_rgba(0,0,0,0.35)]'
    }`;

    return (
        <section id="about" className="relative py-12 md:py-24 2xl:py-32">
            <div className="relative z-10 container mx-auto px-6">
                <div className="mx-auto max-w-4xl 2xl:max-w-6xl">
                    {/* 🔥 CARD UTAMA */}
                    <div className="relative overflow-visible rounded-tl-[18px] rounded-tr-[24px] rounded-br-[32px] rounded-bl-[32px] bg-[#13174D] px-5 py-14 shadow-[0_10px_30px_rgba(0,0,0,0.35)] sm:px-8 sm:py-16 md:rounded-tl-[12px] md:rounded-tr-[32px] md:rounded-br-[55px] md:rounded-bl-[55px] md:px-12 md:py-20 md:shadow-none">
                        {/* 🔥 TOP BADGE (MD & ABOVE RESPONSIVE) */}
                        <div className="absolute -top-[50px] right-0 hidden h-[80px] items-center justify-center rounded-tr-[24px] bg-[#13174D] px-[50px] md:flex lg:-top-[60px] lg:h-[100px] lg:rounded-tr-[32px] lg:px-[90px]">
                            <div className="absolute top-0 -left-[70px] h-[80px] w-[90px] -skew-x-[50deg] bg-[#13174D] lg:-left-[95px] lg:h-[100px] lg:w-[120px]" />
                            <div className="absolute inset-[14px_20px] rounded-[50px] border border-cyan-300 lg:inset-[18px_30px] lg:rounded-[60px]" />
                            <span className="font-['Orbitron'] text-[18px] font-semibold tracking-[4px] text-gray-200 lg:text-[24px] lg:tracking-[5px]">
                                About Section
                            </span>
                        </div>

                        <div className="pointer-events-none absolute inset-0 z-[40]">
                            {/* 🔥 PNG 1 — PHONE (KIRI ATAS) */}
                            <div className="absolute top-6 left-4 sm:top-10 sm:left-8 md:top-[20px] md:left-[180px] lg:left-[280px]">
                                <img
                                    src="/images/phone.webp"
                                    alt="phone"
                                    className="w-16 drop-shadow-2xl sm:w-20 md:w-24 lg:w-18"
                                />
                            </div>

                            {/* 🔥 PNG 2 — MONITOR (KIRI BAWAH) */}
                            <div className="absolute bottom-16 left-6 sm:bottom-20 sm:left-12 md:bottom-[1px] md:left-[30px] lg:left-[60px]">
                                <img
                                    src="/images/monitor.webp"
                                    alt="monitor"
                                    className="w-20 drop-shadow-2xl sm:w-24 md:w-28 lg:w-24"
                                />
                            </div>

                            {/* 🔥 PNG 3 — GAMEPAD MIRING (KANAN BAWAH) */}
                            <div className="absolute right-4 bottom-14 rotate-[5deg] sm:right-10 sm:bottom-18 md:right-[5px] md:bottom-[40px] lg:bottom-[60px]">
                                <img
                                    src="/images/gamepad.webp"
                                    alt="gamepad"
                                    className="w-20 drop-shadow-2xl sm:w-24 md:w-28 lg:w-32"
                                />
                            </div>
                        </div>
                        {/* 🔥 GRID WRAPPER */}
                        <div className="grid gap-14 sm:gap-16 md:grid-cols-2 md:gap-10 lg:gap-16 xl:gap-20">
                            {/* 🔥 MOBILE HEADER */}
                            <div className="col-span-full mb-4 flex justify-center sm:mb-6 md:hidden">
                                <div className="rounded-full border border-cyan-300/60 bg-white/5 px-6 py-3 backdrop-blur-md">
                                    <span className="font-['Orbitron'] text-base tracking-[3px] text-cyan-200 sm:text-lg">
                                        About Section
                                    </span>
                                </div>
                            </div>

                            {/* ================= CARD 1 ================= */}
                            <div className="relative mb-12 md:mb-0 md:translate-x-4 lg:translate-x-0">
                                <div ref={card1Ref} className={card1Class}>
                                    <Card1Background
                                        width={card1Size.width}
                                        height={card1Size.height}
                                        isMd={isMd}
                                    />

                                    {/* Zigzag Accent (mobile only) */}
                                    <div className="absolute -top-3 left-8 h-2 w-16 rounded-full bg-cyan-400 md:hidden" />

                                    <div className="relative z-10">
                                        <p className="text-xs leading-relaxed text-slate-300 md:text-sm lg:text-base">
                                            Skill Ventura merupakan platform
                                            Learning Management System (LMS)
                                            modern yang dirancang untuk membantu
                                            pengguna mengembangkan keterampilan
                                            melalui pengalaman belajar yang
                                            terstruktur, interaktif, dan mudah
                                            diakses. Platform ini menyediakan
                                            berbagai materi pembelajaran, jalur
                                            belajar (career path), simulasi
                                            praktik, serta pemantauan progres
                                            secara real-time sehingga pengguna
                                            dapat belajar sesuai kemampuan dan
                                            mencapai tujuan karier secara lebih
                                            efektif.
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* ================= CARD 2 ================= */}
                            <div className="relative mt-10 md:mt-0 md:-translate-x-4 lg:translate-x-0">
                                <div ref={card2Ref} className={card2Class}>
                                    <Card2Background
                                        width={card2Size.width}
                                        height={card2Size.height}
                                        isMd={isMd}
                                    />

                                    {/* Zigzag Accent (mobile only) */}
                                    <div className="absolute -top-3 right-8 h-2 w-16 rounded-full bg-pink-400 md:hidden" />

                                    <div className="relative z-10">
                                        <p className="text-xs leading-relaxed text-slate-300 md:text-sm lg:text-base">
                                            Untuk meningkatkan motivasi dan
                                            konsistensi belajar, Skill Ventura
                                            menggabungkan konsep gamifikasi ke
                                            dalam setiap proses pembelajaran.
                                            Pengguna dapat memperoleh XP,
                                            membuka achievement, meningkatkan
                                            level, mengumpulkan badge, serta
                                            berkompetisi melalui leaderboard dan
                                            berbagai challenge. Pendekatan ini
                                            membuat proses belajar terasa lebih
                                            menarik, menyenangkan, dan mendorong
                                            pengguna untuk terus mengembangkan
                                            keterampilan hingga siap menghadapi
                                            kebutuhan dunia kerja.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* 🔥 LEKUKAN BAWAH */}
                        <div className="absolute bottom-0 left-1/2 h-[50px] w-[180px] -translate-x-1/2 rounded-t-[24px] bg-white sm:h-[60px] sm:w-[220px] md:h-[70px] md:w-[260px] md:rounded-t-[32px] dark:bg-[#020202]" />
                    </div>
                </div>
            </div>
        </section>
    );
}
