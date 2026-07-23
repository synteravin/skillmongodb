import {
    MessageSquareMore,
    MoonStar,
    SunMedium,
    Store,
    Bell,
    X,
    CheckCircle2,
    XCircle,
    Info,
    ArrowRight,
    Clock,
} from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import SpeechBubble from '@/components/SpeechBubble';
import BottomNav from '@/components/Student/BottomNav';
import { Link, router } from '@inertiajs/react';
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
    rank?: {
        name: string;
        image: string;
        star: number;
        total_score: number;
        current_score: number;
        max_score: number;
    };
    character: {
        name: string;
        avatar: string;
    };
}

interface NotificationData {
    quest_id?: string;
    title?: string;
    message?: string;
    type?: string;
}

interface NotificationItem {
    id: string;
    data: NotificationData;
    read_at: string | null;
    created_at: string;
}

export default function Dashboard({
    user,
    notifications = [],
}: {
    user: User;
    notifications?: NotificationItem[];
}) {
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

            <TopBar
                user={user}
                notifications={notifications}
                dark={dark}
                toggleTheme={toggleTheme}
            />

            <LevelRankCard user={user} />

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
    notifications = [],
    dark,
    toggleTheme,
}: {
    user: User;
    notifications?: NotificationItem[];
    dark: boolean;
    toggleTheme: () => void;
}) {
    const [showModal, setShowModal] = useState(false);
    const unreadCount = notifications.filter((n) => !n.read_at).length;

    const handleNotificationClick = (item: NotificationItem) => {
        router.post(
            `/student/notifications/${item.id}/read`,
            {},
            {
                preserveScroll: true,
                onSuccess: () => {
                    if (item.data.quest_id) {
                        router.visit(`/student/quests/${item.data.quest_id}`);
                    }
                },
            },
        );
    };

    return (
        <header className="relative z-20 flex w-full items-center justify-between px-3 py-3 md:px-6 md:py-4 lg:px-10 lg:py-6">
            {/* LEFT */}
            <div className="relative flex items-center gap-2 md:absolute md:top-2 md:left-2 md:gap-4 lg:gap-5">
                <Link
                    href="/student/profile"
                    className="relative h-[55px] w-[55px] flex-shrink-0 md:h-[70px] md:w-[70px]"
                >
                    <div className="absolute inset-[8px] overflow-hidden rounded-md md:inset-[10px]">
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
                        className="max-w-[90px] truncate text-xs font-semibold sm:max-w-[150px] sm:text-sm md:max-w-none md:text-lg lg:text-2xl"
                        style={{ fontFamily: 'Orbitron' }}
                        title={user.username || user.name}
                    >
                        {user.username || user.name}
                    </p>

                    <p
                        className="text-[10px] font-semibold sm:text-xs md:text-sm md:text-inherit lg:text-xl dark:md:text-inherit"
                        style={{ fontFamily: 'Orbitron' }}
                    >
                        lvl {user.level}
                    </p>
                </div>
            </div>

            {/* RIGHT */}
            <div className="relative flex items-center gap-1 sm:gap-2 md:absolute md:top-2 md:right-2 md:gap-3 lg:gap-4 xl:gap-5">
                <div className="flex items-center gap-1 rounded-2xl border border-amber-200/90 bg-amber-50/90 px-2 py-1.5 shadow-sm sm:gap-2 md:px-3 md:py-2 dark:border-amber-400/30 dark:bg-amber-400/10">
                    <img
                        src="/images/Gold.webp"
                        className="h-5 w-5 object-contain md:h-8 md:w-8"
                    />
                    <div className="text-[11px] font-semibold tracking-wide text-slate-900 sm:text-sm md:text-base dark:text-amber-100">
                        {user.gold.toLocaleString()}
                    </div>
                </div>

                {/* NOTIFICATION BUTTON & DROPDOWN */}
                <div className="relative">
                    <button
                        onClick={() => setShowModal(!showModal)}
                        className="relative inline-flex cursor-pointer items-center justify-center rounded-2xl border border-slate-200/80 bg-white/90 p-2 shadow-sm shadow-slate-400/10 transition duration-300 hover:-translate-y-0.5 hover:border-slate-300 hover:bg-slate-100 md:px-3 md:py-2 dark:border-slate-700/80 dark:bg-slate-900/90 dark:shadow-black/20 dark:hover:border-slate-600 dark:hover:bg-slate-800"
                        aria-label="Messages"
                    >
                        <MessageSquareMore className="h-5 w-5 text-slate-700 md:h-6 md:w-6 dark:text-sky-300" />
                        {unreadCount > 0 && (
                            <span className="absolute top-1.5 right-1.5 flex h-4 w-4 animate-pulse items-center justify-center rounded-full bg-rose-500 text-[9px] font-black text-white ring-2 ring-white dark:ring-slate-950">
                                {unreadCount}
                            </span>
                        )}
                    </button>

                    {showModal && (
                        <>
                            <div
                                onClick={() => setShowModal(false)}
                                className="fixed inset-0 z-40 bg-black/20 backdrop-blur-xs md:bg-transparent"
                            />
                            <div className="absolute right-0 top-full mt-2 z-50 w-80 sm:w-96 rounded-2xl border border-slate-200 bg-white/95 p-4 shadow-2xl backdrop-blur-md dark:border-slate-800 dark:bg-[#0c0e18]/95 font-sans">
                                <div className="flex items-center justify-between border-b border-slate-100 pb-3 dark:border-slate-800">
                                    <div className="flex items-center gap-2">
                                        <Bell className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
                                        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-slate-100">
                                            Pesan & Notifikasi
                                        </h3>
                                    </div>
                                    <button
                                        onClick={() => setShowModal(false)}
                                        className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
                                    >
                                        <X size={14} />
                                    </button>
                                </div>

                                <div className="mt-3 max-h-80 space-y-2 overflow-y-auto pr-1">
                                    {notifications.length === 0 ? (
                                        <div className="py-8 text-center text-slate-400 dark:text-slate-500">
                                            <Bell className="mx-auto mb-2 h-8 w-8 text-slate-300 dark:text-slate-700" />
                                            <p className="text-xs font-semibold">Belum ada pesan atau notifikasi</p>
                                        </div>
                                    ) : (
                                        notifications.map((item) => {
                                            const isUnread = !item.read_at;
                                            return (
                                                <div
                                                    key={item.id}
                                                    onClick={() => handleNotificationClick(item)}
                                                    className={`group flex cursor-pointer items-start gap-3 rounded-xl border p-3 transition-all ${
                                                        isUnread
                                                            ? 'border-indigo-200 bg-indigo-50/60 dark:border-indigo-900/50 dark:bg-indigo-950/40'
                                                            : 'border-slate-100 bg-slate-50/60 hover:bg-slate-100 dark:border-slate-800/60 dark:bg-slate-900/40 dark:hover:bg-slate-800/60'
                                                    }`}
                                                >
                                                    <div className="mt-0.5 shrink-0">
                                                        {item.data.type === 'bid_accepted' ||
                                                        item.data.type === 'work_approved' ||
                                                        item.data.type === 'quest_completed' ||
                                                        item.data.type === 'quest_approved' ? (
                                                            <CheckCircle2 size={16} className="text-emerald-500" />
                                                        ) : item.data.type === 'bid_rejected' ||
                                                          item.data.type === 'work_rejected' ||
                                                          item.data.type === 'quest_rejected' ? (
                                                            <XCircle size={16} className="text-red-500 font-bold" />
                                                        ) : item.data.type === 'work_submitted' ||
                                                          item.data.type === 'payment_uploaded' ||
                                                          item.data.type === 'bid_received' ? (
                                                            <Clock size={16} className="text-amber-500" />
                                                        ) : (
                                                            <Info size={16} className="text-indigo-500" />
                                                        )}
                                                    </div>
                                                    <div className="min-w-0 flex-1">
                                                        <div className="flex items-center justify-between gap-1">
                                                            <span className="truncate text-xs font-bold text-slate-800 dark:text-white">
                                                                {item.data.title || 'Notifikasi Proyek'}
                                                            </span>
                                                            <span className="text-[9px] font-medium text-slate-400 shrink-0">
                                                                {item.created_at}
                                                            </span>
                                                        </div>
                                                        <p className="mt-0.5 text-[11px] leading-relaxed text-slate-600 dark:text-slate-350 line-clamp-2">
                                                            {item.data.message}
                                                        </p>
                                                        {item.data.quest_id && (
                                                            <div className="mt-1 flex items-center gap-1 text-[10px] font-bold text-indigo-600 dark:text-indigo-400 group-hover:underline">
                                                                <span>Buka Quest</span>
                                                                <ArrowRight size={10} />
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            );
                                        })
                                    )}
                                </div>
                            </div>
                        </>
                    )}
                </div>

                <button
                    onClick={toggleTheme}
                    className="inline-flex items-center justify-center rounded-2xl border border-slate-200/80 bg-slate-100/90 p-2 shadow-sm shadow-slate-400/10 transition duration-300 hover:-translate-y-0.5 hover:border-slate-300 hover:bg-slate-200 md:px-3 md:py-2 dark:border-slate-700/80 dark:bg-slate-900/90 dark:shadow-black/20 dark:hover:border-slate-600 dark:hover:bg-slate-800"
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
   LEVEL RANK CARD (ERP / REPUTATION)
========================================================= */

function LevelRankCard({ user }: { user: User }) {
    const rank = user.rank || {
        name: 'Unranked',
        image: '/images/romawi.png',
        star: 1,
        total_score: 0,
        current_score: 0,
        max_score: 500,
    };

    const progressPercent = Math.min(
        100,
        Math.max(0, (rank.current_score / rank.max_score) * 100),
    );

    return (
        <div className="absolute top-20 left-3 z-20 flex w-48 flex-col gap-2 rounded-2xl border border-indigo-500/40 bg-white/85 p-3.5 shadow-lg shadow-indigo-500/10 backdrop-blur-md sm:top-24 sm:left-4 sm:w-60 md:top-28 md:left-6 dark:border-indigo-500/40 dark:bg-[#070918]/85 dark:shadow-black/30">
            {/* Header: Unwrapped Larger Rank Logo, Name & Stars */}
            <div className="flex items-center gap-3">
                <img
                    src={rank.image || '/images/romawi.png'}
                    className="h-16 w-16 shrink-0 object-contain drop-shadow-md sm:h-20 sm:w-20"
                    alt={rank.name}
                />
                <div className="min-w-0 flex-1">
                    <span className="block font-['Orbitron'] text-[8px] font-bold tracking-widest text-indigo-600 uppercase dark:text-indigo-400">
                        LEVEL RANK
                    </span>
                    <h4 className="truncate font-['Orbitron'] text-xs font-black tracking-wide text-slate-900 sm:text-sm dark:text-white">
                        {rank.name}
                    </h4>
                    {/* Stars */}
                    <div className="mt-1 flex gap-0.5">
                        {Array.from({
                            length: Math.min(3, Math.max(1, rank.star)),
                        }).map((_, i) => (
                            <span key={i} className="text-xs text-amber-400">
                                ★
                            </span>
                        ))}
                    </div>
                </div>
            </div>

            {/* ERP Progress Bar */}
            <div className="space-y-1 border-t border-slate-200/80 pt-2 dark:border-slate-800/80">
                <div className="flex items-center justify-between text-[10px] font-bold">
                    <span className="text-slate-500 dark:text-slate-400">ERP Reputasi</span>
                    <span className="font-['Orbitron'] text-amber-500 dark:text-amber-400">
                        {rank.current_score}{' '}
                        <span className="text-slate-400 dark:text-slate-600">
                            / {rank.max_score}
                        </span>
                    </span>
                </div>
                <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-200/90 dark:bg-slate-800">
                    <div
                        className="h-full rounded-full bg-gradient-to-r from-blue-500 via-indigo-500 to-amber-400 transition-all duration-700"
                        style={{ width: `${progressPercent}%` }}
                    />
                </div>
            </div>
        </div>
    );
}

/* =========================================================
   STORE BUTTON — original 100% tidak berubah
========================================================= */

function StoreButton() {
    return (
        <div className="absolute top-1/2 left-2 z-20 hidden -translate-y-1/2 bg-blue-200/40 shadow-lg backdrop-blur-sm md:left-3 md:block lg:left-4 xl:left-6 dark:bg-[#1D215D]/30">

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
        <div className="pointer-events-none absolute inset-0 z-10">
            {/* Mobile: centered horizontally, bottom-0 agar kaki tenggelam ke fixed BottomNav (z-30) */}
            {/* Desktop md+: absolute right-positioned, bottom negatif agar tenggelam ke absolute BottomNav */}
            <div className="pointer-events-auto absolute bottom-0 left-1/2 -translate-x-1/2 md:right-[180px] md:bottom-[-90px] md:left-auto md:translate-x-24 lg:right-[220px] lg:bottom-[-120px] lg:translate-x-5 xl:right-[260px] 2xl:right-[370px]">
                {showBubble && (
                    <SpeechBubble className="animate-fadeIn absolute bottom-full left-1/2 mb-4 -translate-x-1/2 md:top-12 md:-right-56 md:bottom-auto md:left-auto md:translate-x-0 lg:-right-75">
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
