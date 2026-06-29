import { MessageSquareMore, MoonStar, SunMedium, Store } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import SpeechBubble from '@/components/SpeechBubble';
import BottomNav from '@/components/Student/BottomNav';
import { Link } from '@inertiajs/react';
import { useAppearance } from '@/hooks/use-appearance';

interface Character {
    name: string;
    avatar: string;
}

interface User {
    name: string;
    username: string;
    level: number;
    xp: number;
    gold: number;
    avatar: string;
    character: {
        name: string;
        avatar: string;
    };
}

export default function Dashboard({ user }: { user: User }) {
    const { resolvedAppearance, updateAppearance } = useAppearance();
    const dark = resolvedAppearance === 'dark';

    const toggleTheme = () => {
        updateAppearance(dark ? 'light' : 'dark');
    };

    return (
        <div className="relative min-h-screen overflow-hidden bg-[#fdfcfc] text-black transition-colors duration-500 dark:bg-[#020202] dark:text-white">
            {/* ── DARK MODE: original tidak diubah sama sekali ── */}
            <StarBackground />

            {/* ── LIGHT MODE: hanya bg yang diganti, titik-titik warna warni ── */}
            <LightBackground />

            <TopBar user={user} dark={dark} toggleTheme={toggleTheme} />

            <StoreButton />

            <CharacterSection avatar={user.character.avatar} />

            <BottomNav />
        </div>
    );
}

/* =========================================================
   DARK MODE STAR BACKGROUND — original, 100% tidak berubah
========================================================= */

function StarBackground() {
    return (
        <div className="absolute inset-0 z-0 hidden overflow-hidden dark:block">
            <div
                className="absolute inset-0 opacity-70"
                style={{
                    backgroundImage: `
            radial-gradient(1px 1px at 20px 30px, #6042FF, transparent),
            radial-gradient(2px 2px at 40px 70px, #93c5fd, transparent),
            radial-gradient(1.5px 1.5px at 130px 80px, #fde68a, transparent),
            radial-gradient(3px 3px at 160px 30px, #c084fc, transparent),
            radial-gradient(2px 2px at 200px 150px, #ffffff, transparent),
            radial-gradient(1px 1px at 300px 200px, #93c5fd, transparent),
            radial-gradient(2.5px 2.5px at 350px 100px, #facc15, transparent)
          `,
                    backgroundSize: '600px 400px',
                }}
            />

            <div className="absolute top-[50px] left-1/2 h-[100px] w-[1600px] -translate-x-1/2 rounded-full bg-blue-500 opacity-70 blur-[180px]" />
            <div className="absolute top-[450px] left-1/2 h-[100px] w-[1600px] -translate-x-1/2 rounded-full bg-blue-500 opacity-70 blur-[180px]" />
        </div>
    );
}

/* =========================================================
   LIGHT MODE BACKGROUND
   - Hanya muncul saat light mode (block dark:hidden)
   - Aurora gradient soft
   - Titik-titik bintang warna warni (violet, blue, gold, pink)
   - TIDAK menyentuh komponen lain sama sekali
========================================================= */

function LightBackground() {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const drawStars = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            // star kecil: lebih banyak
            for (let i = 0; i < 620; i++) {
                const x = Math.random() * canvas.width;
                const y = Math.random() * canvas.height;

                const inGlowArea = y < 190 || y > canvas.height - 190;
                const size = Math.random() * 0.9 + 0.12;
                const alpha = inGlowArea
                    ? Math.random() * 0.48 + 0.38
                    : Math.random() * 0.34 + 0.18;

                const color = inGlowArea ? '255,255,255' : '170,215,255';
                const shadowColor = inGlowArea
                    ? 'rgba(195,240,255,.9)'
                    : 'rgba(135,195,255,.45)';

                ctx.beginPath();
                ctx.arc(x, y, size, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(${color},${alpha})`;
                ctx.shadowBlur = Math.random() * (inGlowArea ? 11 : 7) + 2;
                ctx.shadowColor = shadowColor;
                ctx.fill();
            }

            // star sedang: glow lebih detail
            for (let i = 0; i < 120; i++) {
                const x = Math.random() * canvas.width;
                const y = Math.random() * canvas.height;

                const inGlowArea = y < 190 || y > canvas.height - 190;
                const size = Math.random() * 0.75 + 1;
                const alpha = inGlowArea
                    ? Math.random() * 0.36 + 0.28
                    : Math.random() * 0.28 + 0.14;

                const color = inGlowArea ? '255,255,255' : '180,220,255';
                const shadowColor = inGlowArea
                    ? 'rgba(200,245,255,.75)'
                    : 'rgba(150,205,255,.5)';

                ctx.beginPath();
                ctx.arc(x, y, size, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(${color},${alpha})`;
                ctx.shadowBlur = Math.random() * 18 + 7;
                ctx.shadowColor = shadowColor;
                ctx.fill();
            }

            // star besar tipis
            for (let i = 0; i < 42; i++) {
                const x = Math.random() * canvas.width;
                const y = Math.random() * canvas.height;

                const inGlowArea = y < 190 || y > canvas.height - 190;
                const size = Math.random() * 1.2 + 1.15;
                const alpha = inGlowArea
                    ? Math.random() * 0.18 + 0.15
                    : Math.random() * 0.13 + 0.09;

                const color = inGlowArea ? '255,255,255' : '175,215,255';

                ctx.beginPath();
                ctx.arc(x, y, size, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(${color},${alpha})`;
                ctx.shadowBlur = Math.random() * 26 + 12;
                ctx.shadowColor = inGlowArea
                    ? 'rgba(190,235,255,.5)'
                    : 'rgba(140,200,255,.42)';
                ctx.fill();
            }
        };

        drawStars();
        window.addEventListener('resize', drawStars);
        return () => window.removeEventListener('resize', drawStars);
    }, []);

    const bigStars = [
        { size: 18, left: '7%', top: '20%' },
        { size: 13, left: '14%', top: '38%' },
        { size: 12, left: '22%', top: '72%' },
        { size: 14, left: '36%', top: '32%' },
        { size: 12, left: '53%', top: '68%' },
        { size: 16, left: '62%', top: '50%' },
        { size: 15, left: '68%', top: '24%' },
        { size: 13, left: '86%', top: '58%' },
        { size: 14, left: '79%', top: '40%' },
        { size: 16, left: '28%', top: '18%' },
        { size: 14, left: '58%', top: '78%' },
        { size: 13, left: '84%', top: '28%' },
        { size: 12, left: '44%', top: '20%' },
        { size: 11, left: '73%', top: '76%' },
    ];

    const smallStars = [
        { w: 1, h: 1, left: '8%', top: '10%', color: 'rgba(170,215,255,0.95)' },
        {
            w: 1.5,
            h: 1.5,
            left: '22%',
            top: '20%',
            color: 'rgba(255,255,255,0.96)',
        },
        { w: 1, h: 1, left: '30%', top: '12%', color: 'rgba(170,215,255,0.9)' },
        {
            w: 1.75,
            h: 1.75,
            left: '42%',
            top: '8%',
            color: 'rgba(255,255,255,0.95)',
        },
        {
            w: 1.5,
            h: 1.5,
            left: '55%',
            top: '14%',
            color: 'rgba(255,255,255,0.96)',
        },
        {
            w: 1,
            h: 1,
            left: '62%',
            top: '10%',
            color: 'rgba(170,215,255,0.82)',
        },
        {
            w: 1,
            h: 1,
            left: '74%',
            top: '16%',
            color: 'rgba(170,215,255,0.88)',
        },
        {
            w: 1.5,
            h: 1.5,
            left: '90%',
            top: '18%',
            color: 'rgba(255,255,255,0.94)',
        },

        {
            w: 1,
            h: 1,
            left: '12%',
            top: '50%',
            color: 'rgba(170,215,255,0.76)',
        },
        {
            w: 1.5,
            h: 1.5,
            left: '28%',
            top: '58%',
            color: 'rgba(170,215,255,0.8)',
        },
        {
            w: 1,
            h: 1,
            left: '42%',
            top: '48%',
            color: 'rgba(170,215,255,0.78)',
        },
        {
            w: 1.25,
            h: 1.25,
            left: '52%',
            top: '42%',
            color: 'rgba(170,215,255,0.86)',
        },
        {
            w: 1.5,
            h: 1.5,
            left: '64%',
            top: '54%',
            color: 'rgba(170,215,255,0.78)',
        },
        {
            w: 1,
            h: 1,
            left: '68%',
            top: '62%',
            color: 'rgba(170,215,255,0.72)',
        },
        {
            w: 1.25,
            h: 1.25,
            left: '82%',
            top: '48%',
            color: 'rgba(170,215,255,0.86)',
        },

        {
            w: 1,
            h: 1,
            left: '18%',
            top: '84%',
            color: 'rgba(170,215,255,0.72)',
        },
        {
            w: 1.5,
            h: 1.5,
            left: '34%',
            top: '82%',
            color: 'rgba(170,215,255,0.76)',
        },
        {
            w: 1,
            h: 1,
            left: '44%',
            top: '74%',
            color: 'rgba(170,215,255,0.75)',
        },
        {
            w: 1.25,
            h: 1.25,
            left: '56%',
            top: '88%',
            color: 'rgba(170,215,255,0.72)',
        },
        {
            w: 1.5,
            h: 1.5,
            left: '78%',
            top: '84%',
            color: 'rgba(255,255,255,0.92)',
        },
        {
            w: 1,
            h: 1,
            left: '94%',
            top: '88%',
            color: 'rgba(170,215,255,0.76)',
        },
    ];

    return (
        <div className="absolute inset-0 z-0 block overflow-hidden dark:hidden">
            <div
                className="absolute inset-0"
                style={{
                    background: `
            radial-gradient(
              ellipse 120% 90% at 50% 50%,
              rgba(255,255,255,.35) 0%,
              rgba(235,242,255,.18) 28%,
              transparent 65%
            )
          `,
                }}
            />

            <div
                className="absolute inset-0"
                style={{
                    background: `
            linear-gradient(
              135deg,
              #f9fcff 0%,
              #e4eeff 42%,
              #c7d8ff 100%
            )
          `,
                }}
            />

            <div
                className="absolute inset-x-0 top-[50px] h-[100px] rounded-full opacity-95 blur-[140px]"
                style={{
                    background: `
            linear-gradient(
              90deg,
              rgba(120,190,255,0) 0%,
              rgba(120,190,255,.22) 10%,
              rgba(90,170,255,.40) 24%,
              rgba(70,155,255,.70) 50%,
              rgba(90,170,255,.40) 76%,
              rgba(120,190,255,.22) 90%,
              rgba(120,190,255,0) 100%
            )
          `,
                }}
            />

            <div
                className="absolute inset-x-0 top-[24%] h-[110px] rounded-full opacity-80 blur-[95px]"
                style={{
                    background: `
      radial-gradient(
        ellipse at center,
        rgba(70,160,255,0.85) 0%,
        rgba(50,145,255,0.62) 18%,
        rgba(30,125,255,0.42) 38%,
        rgba(0,105,255,0.24) 58%,
        rgba(0,80,220,0.10) 78%,
        rgba(0,120,255,0) 100%
      )
    `,
                }}
            />

            <div
                className="absolute inset-x-0 bottom-[50px] h-[110px] rounded-full opacity-95 blur-[140px]"
                style={{
                    background: `
            linear-gradient(
              90deg,
              rgba(120,190,255,0) 0%,
              rgba(120,190,255,.22) 10%,
              rgba(95,175,255,.36) 24%,
              rgba(70,160,255,.70) 50%,
              rgba(95,175,255,.36) 76%,
              rgba(120,190,255,.22) 90%,
              rgba(120,190,255,0) 100%
            )
          `,
                }}
            />

            {bigStars.map((star, index) => (
                <div
                    key={`big-star-${index}`}
                    className="absolute"
                    style={{
                        width: `${star.size}px`,
                        height: `${star.size}px`,
                        left: star.left,
                        top: star.top,
                    }}
                >
                    <div
                        style={{
                            position: 'absolute',
                            left: '50%',
                            top: '50%',
                            width: '1px',
                            height: '100%',
                            transform: 'translate(-50%, -50%)',
                            borderRadius: '999px',
                            background: 'white',
                            boxShadow:
                                '0 0 6px rgba(255,255,255,.9), 0 0 14px rgba(185,220,255,.72), 0 0 26px rgba(90,160,255,.42)',
                        }}
                    />
                    <div
                        style={{
                            position: 'absolute',
                            left: '50%',
                            top: '50%',
                            width: '100%',
                            height: '1px',
                            transform: 'translate(-50%, -50%)',
                            borderRadius: '999px',
                            background: 'white',
                            boxShadow:
                                '0 0 6px rgba(255,255,255,.9), 0 0 14px rgba(185,220,255,.72), 0 0 26px rgba(90,160,255,.42)',
                        }}
                    />
                </div>
            ))}

            {smallStars.map((star, index) => (
                <div
                    key={`small-star-${index}`}
                    className="absolute rounded-full"
                    style={{
                        width: `${star.w}px`,
                        height: `${star.h}px`,
                        left: star.left,
                        top: star.top,
                        background: star.color,
                        boxShadow:
                            '0 0 4px rgba(255,255,255,.88), 0 0 10px rgba(170,215,255,.7), 0 0 18px rgba(100,175,255,.38)',
                    }}
                />
            ))}

            <canvas
                ref={canvasRef}
                className="absolute inset-0 opacity-75"
                style={{ width: '100%', height: '100%', pointerEvents: 'none' }}
            />
        </div>
    );
}

/* =========================================================
   TOP BAR — original 100% tidak berubah
========================================================= */

function TopBar({
    user,
    dark,
    toggleTheme,
}: {
    user: User;
    dark: boolean;
    toggleTheme: () => void;
}) {
    return (
        <header className="relative z-20 flex w-full items-center justify-between px-3 py-3 md:px-6 md:py-4 lg:px-10 lg:py-6">
            {/* LEFT */}
            <div className="relative md:absolute md:top-2 md:left-2 flex items-center gap-2 md:gap-4 lg:gap-5">
                <Link
                    href="/student/profile"
                    className="relative h-[55px] w-[55px] md:h-[70px] md:w-[70px] flex-shrink-0"
                >
                    <div className="absolute inset-[8px] md:inset-[10px] overflow-hidden rounded-md">
                        <img
                            src={user.avatar ?? '/images/default-avatar.svg'}
                            className="h-full w-full object-cover"
                        />
                    </div>

                    <img
                        src="/images/border.webp"
                        className="pointer-events-none absolute inset-0 h-full w-full object-contain"
                    />
                </Link>

                <div className="leading-tight">
                    <p
                        className=" text-xs sm:text-sm font-semibold md:text-lg lg:text-2xl truncate max-w-[90px] sm:max-w-[150px] md:max-w-none"
                        style={{ fontFamily: 'Orbitron' }}
                        title={user.username || user.name}
                    >
                        {user.username || user.name}
                    </p>

                    <p
                        className="text-[10px] sm:text-xs font-semibold md:text-sm lg:text-xl md:text-inherit dark:md:text-inherit "
                        style={{ fontFamily: 'Orbitron' }}
                    >
                        lvl {user.level}
                    </p>
                </div>
            </div>

            {/* RIGHT */}
            <div className="relative md:absolute md:top-2 md:right-2 flex items-center gap-1 sm:gap-2 md:gap-3 lg:gap-4 xl:gap-5">
                <div className="flex items-center gap-1 sm:gap-2 rounded-2xl border border-amber-200/90 bg-amber-50/90 px-2 py-1.5 md:px-3 md:py-2 shadow-sm dark:border-amber-400/30 dark:bg-amber-400/10">
                    <img
                        src="/images/Gold.webp"
                        className="h-5 w-5 object-contain md:h-8 md:w-8"
                    />
                    <div className="text-[11px] sm:text-sm font-semibold tracking-wide text-slate-900 md:text-base dark:text-amber-100">
                        {user.gold.toLocaleString()}
                    </div>
                </div>

                <button
                    className="relative inline-flex items-center justify-center rounded-2xl border border-slate-200/80 bg-white/90 p-2 md:px-3 md:py-2 shadow-sm shadow-slate-400/10 transition duration-300 hover:-translate-y-0.5 hover:border-slate-300 hover:bg-slate-100 dark:border-slate-700/80 dark:bg-slate-900/90 dark:shadow-black/20 dark:hover:border-slate-600 dark:hover:bg-slate-800"
                    aria-label="Messages"
                >
                    <MessageSquareMore className="h-5 w-5 text-slate-700 md:h-6 md:w-6 dark:text-sky-300" />
                    <span className="absolute top-1.5 right-1.5 h-2 w-2 animate-pulse rounded-full bg-rose-500 ring-2 ring-white dark:ring-slate-950" />
                </button>

                <button
                    onClick={toggleTheme}
                    className="inline-flex items-center justify-center rounded-2xl border border-slate-200/80 bg-slate-100/90 p-2 md:px-3 md:py-2 shadow-sm shadow-slate-400/10 transition duration-300 hover:-translate-y-0.5 hover:border-slate-300 hover:bg-slate-200 dark:border-slate-700/80 dark:bg-slate-900/90 dark:shadow-black/20 dark:hover:border-slate-600 dark:hover:bg-slate-800"
                    aria-label={
                        dark ? 'Switch to light mode' : 'Switch to dark mode'
                    }
                >
                    {dark ? (
                        <MoonStar className="h-5 w-5 text-slate-100 md:h-6 md:w-6" />
                    ) : (
                        <SunMedium className="h-5 w-5 text-slate-700 md:h-6 md:w-6" />
                    )}
                </button>
            </div>
        </header>
    );
}

/* =========================================================
   STORE BUTTON — original 100% tidak berubah
========================================================= */

function StoreButton() {
    return (
        <div className="absolute top-1/2 left-2 z-20 hidden -translate-y-1/2 bg-blue-200/40 shadow-lg backdrop-blur-sm md:left-3 md:block lg:left-4 xl:left-6 dark:bg-[#1D215D]/30">
            <button className="relative flex w-16 flex-col items-center justify-center gap-1 py-3 text-[10px] font-semibold tracking-wider md:w-20 md:gap-2 md:py-4 md:text-xs lg:w-24 lg:py-6 lg:text-sm xl:w-28 xl:text-base 2xl:w-32">
                <Store className="h-4 w-4 text-yellow-400 md:h-6 md:w-6 lg:h-7 lg:w-7 xl:h-8 xl:w-8 2xl:h-8 2xl:w-8" />

                <span>Store</span>

                <div className="absolute top-0 right-0 h-16 w-full border-t-2 border-r-2 border-blue-500 md:h-20 lg:h-26 xl:h-28"></div>
                <div className="absolute bottom-0 left-0 h-16 w-full border-b-2 border-l-2 border-yellow-400 md:h-20 lg:h-26 xl:h-28"></div>
            </button>
        </div>
    );
}

/* =========================================================
   CHARACTER SECTION — original 100% tidak berubah
========================================================= */

function CharacterSection({ avatar }: { avatar: string }) {
    const [showBubble, setShowBubble] = useState(false);
    const [displayText, setDisplayText] = useState('');

    const fullText = `You're ready for battle!
Check out these upgrades —
they'll help you survive
and dominate the game`;

    useEffect(() => {
        const interval = setInterval(() => {
            triggerBubble();
        }, 60000);

        return () => clearInterval(interval);
    }, []);

    const triggerBubble = () => {
        setShowBubble(true);
        setTimeout(() => setShowBubble(false), 8000);
    };

    useEffect(() => {
        if (!showBubble) return;

        let i = 0;
        setDisplayText('');

        const interval = setInterval(() => {
            setDisplayText((prev) => prev + fullText.charAt(i));
            i++;

            if (i >= fullText.length) clearInterval(interval);
        }, 25);

        return () => clearInterval(interval);
    }, [showBubble]);

    return (
        <div className="absolute inset-0 z-10 pointer-events-none">
            {/* Mobile: centered horizontally, bottom-0 agar kaki tenggelam ke fixed BottomNav (z-30) */}
            {/* Desktop md+: absolute right-positioned, bottom negatif agar tenggelam ke absolute BottomNav */}
            <div className="
                absolute pointer-events-auto
                bottom-0 md:bottom-[-90px] lg:bottom-[-120px]
                left-1/2 -translate-x-1/2
                md:left-auto md:translate-x-24 md:right-[180px]
                lg:translate-x-5 lg:right-[220px]
                xl:right-[260px]
                2xl:right-[370px]
            ">
                {showBubble && (
                    <SpeechBubble className="animate-fadeIn absolute bottom-full mb-4 left-1/2 -translate-x-1/2 md:bottom-auto md:top-12 md:left-auto md:translate-x-0 md:-right-56 lg:-right-75">
                        <p className="text-xs leading-relaxed whitespace-pre-line md:text-sm lg:text-base">
                            {displayText}
                            <span className="animate-pulse">|</span>
                        </p>
                    </SpeechBubble>
                )}

                <img
                    src={avatar}
                    onClick={triggerBubble}
                    className="relative z-50 h-[300px] cursor-pointer transition hover:scale-[1.02] sm:h-[340px] md:h-[420px] lg:h-[540px] xl:h-[600px] 2xl:h-[620px]"
                    style={{ animation: 'breathe 3s ease-in-out infinite' }}
                />
            </div>
        </div>
    );
}
