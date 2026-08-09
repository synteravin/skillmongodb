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
import CharacterOnboardingTour from '@/components/Student/CharacterOnboardingTour';
import { Link, router } from '@inertiajs/react';
import { useAppearance } from '@/hooks/use-appearance';
import PageBackground from '@/components/Student/PageBackground';

interface Character {
    name: string;
    avatar: string;
}

interface User {
    id?: string | number;
    _id?: string;
    name: string;
    username: string;
    level: number;
    xp: number;
    gold: number;
    avatar: string;
    has_completed_onboarding?: boolean;
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
    quest_slug?: string;
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
    const [showTour, setShowTour] = useState(() => {
        if (user.has_completed_onboarding) return false;
        if (typeof window !== 'undefined') {
            const localCompleted = localStorage.getItem(
                `onboarding_completed_${user.id || user.username || user.name}`,
            );
            if (localCompleted === 'true') return false;
        }
        return true;
    });
    const [activeTargetId, setActiveTargetId] = useState<string | undefined>(
        !user.has_completed_onboarding ? 'nav-item-my-course' : undefined,
    );

    const toggleTheme = () => {
        updateAppearance(dark ? 'light' : 'dark');
    };

    return (
        <div className="relative min-h-screen overflow-hidden bg-[#fdfcfc] text-black transition-colors duration-500 dark:bg-[#020202] dark:text-white">
            <PageBackground />

            <TopBar
                user={user}
                notifications={notifications}
                dark={dark}
                toggleTheme={toggleTheme}
            />

            <LevelRankCard user={user} />

            {!showTour && <CharacterSection character={user.character} />}

            {showTour && (
                <CharacterOnboardingTour
                    character={user.character}
                    onStepChange={(targetId) => setActiveTargetId(targetId)}
                    onClose={() => {
                        setShowTour(false);
                        setActiveTargetId(undefined);
                        if (typeof window !== 'undefined') {
                            localStorage.setItem(
                                `onboarding_completed_${user.id || user.username || user.name}`,
                                'true',
                            );
                        }
                    }}
                />
            )}

            <BottomNav
                activeOnboardingTarget={showTour ? activeTargetId : undefined}
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
            `/notifications/${item.id}/read`,
            {},
            {
                preserveScroll: true,
                onSuccess: () => {
                    if (item.data.quest_slug) {
                        router.visit(`/quests/${item.data.quest_slug}`);
                    } else if (item.data.type === 'submission_graded') {
                        router.visit(`/certificates`);
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
                    href="/profile"
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
                                className="fixed inset-0 z-40 bg-black/20 md:bg-transparent"
                            />
                            <div className="absolute top-full right-2 z-50 mt-2 w-[350px] rounded-2xl border border-slate-200 bg-white/95 p-4 font-sans shadow-2xl backdrop-blur-md sm:right-4 sm:w-[440px] md:right-6 md:w-[480px] dark:border-slate-800 dark:bg-[#0c0e18]/95">
                                <div className="flex items-center justify-between border-b border-slate-100 pb-3 dark:border-slate-800">
                                    <div className="flex items-center gap-2">
                                        <Bell className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
                                        <h3 className="text-xs font-bold tracking-wider text-slate-800 uppercase dark:text-slate-100">
                                            Pesan & Notifikasi
                                        </h3>
                                    </div>
                                    <button
                                        onClick={() => setShowModal(false)}
                                        className="cursor-pointer rounded-lg p-1 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                                    >
                                        <X size={14} />
                                    </button>
                                </div>

                                <div className="mt-3 max-h-[420px] space-y-2 overflow-y-auto pr-1">
                                    {notifications.length === 0 ? (
                                        <div className="py-8 text-center text-slate-400 dark:text-slate-500">
                                            <Bell className="mx-auto mb-2 h-8 w-8 text-slate-300 dark:text-slate-700" />
                                            <p className="text-xs font-semibold">
                                                Belum ada pesan atau notifikasi
                                            </p>
                                        </div>
                                    ) : (
                                        notifications.map((item) => {
                                            const isUnread = !item.read_at;
                                            return (
                                                <div
                                                    key={item.id}
                                                    onClick={() =>
                                                        handleNotificationClick(
                                                            item,
                                                        )
                                                    }
                                                    className={`group flex cursor-pointer items-start gap-3 rounded-xl border p-3 transition-all ${
                                                        isUnread
                                                            ? 'border-indigo-200 bg-indigo-50/60 dark:border-indigo-900/50 dark:bg-indigo-950/40'
                                                            : 'border-slate-100 bg-slate-50/60 hover:bg-slate-100 dark:border-slate-800/60 dark:bg-slate-900/40 dark:hover:bg-slate-800/60'
                                                    }`}
                                                >
                                                    <div className="mt-0.5 shrink-0">
                                                        {item.data.type ===
                                                            'bid_accepted' ||
                                                        item.data.type ===
                                                            'work_approved' ||
                                                        item.data.type ===
                                                            'quest_completed' ||
                                                        item.data.type ===
                                                            'quest_approved' ||
                                                        item.data.type ===
                                                            'submission_graded' ? (
                                                            <CheckCircle2
                                                                size={16}
                                                                className="text-emerald-500"
                                                            />
                                                        ) : item.data.type ===
                                                              'bid_rejected' ||
                                                          item.data.type ===
                                                              'work_rejected' ||
                                                          item.data.type ===
                                                              'quest_rejected' ? (
                                                            <XCircle
                                                                size={16}
                                                                className="font-bold text-red-500"
                                                            />
                                                        ) : item.data.type ===
                                                              'work_submitted' ||
                                                          item.data.type ===
                                                              'payment_uploaded' ||
                                                          item.data.type ===
                                                              'bid_received' ? (
                                                            <Clock
                                                                size={16}
                                                                className="text-amber-500"
                                                            />
                                                        ) : (
                                                            <Info
                                                                size={16}
                                                                className="text-indigo-500"
                                                            />
                                                        )}
                                                    </div>
                                                    <div className="min-w-0 flex-1">
                                                        <div className="flex items-center justify-between gap-1">
                                                            <span className="truncate text-xs font-bold text-slate-800 dark:text-white">
                                                                {item.data
                                                                    .title ||
                                                                    'Notifikasi Proyek'}
                                                            </span>
                                                            <span className="shrink-0 text-[9px] font-medium text-slate-400">
                                                                {
                                                                    item.created_at
                                                                }
                                                            </span>
                                                        </div>
                                                        <p className="dark:text-slate-350 mt-0.5 line-clamp-2 text-[11px] leading-relaxed text-slate-600">
                                                            {item.data.message}
                                                        </p>
                                                        {item.data.quest_id && (
                                                            <div className="mt-1 flex items-center gap-1 text-[10px] font-bold text-indigo-600 group-hover:underline dark:text-indigo-400">
                                                                <span>
                                                                    Buka Quest
                                                                </span>
                                                                <ArrowRight
                                                                    size={10}
                                                                />
                                                            </div>
                                                        )}
                                                        {item.data.type ===
                                                            'submission_graded' && (
                                                            <div className="mt-1 flex items-center gap-1 text-[10px] font-bold text-indigo-600 group-hover:underline dark:text-indigo-400">
                                                                <span>
                                                                    Buka
                                                                    Sertifikat
                                                                </span>
                                                                <ArrowRight
                                                                    size={10}
                                                                />
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
        <div className="absolute top-20 left-3 z-20 flex w-48 flex-col gap-2 rounded-2xl border border-indigo-500/40 bg-white/85 p-3.5 shadow-lg shadow-indigo-500/10 backdrop-blur-md sm:top-24 sm:left-3 sm:w-60 md:top-28 md:left-2 dark:border-indigo-500/40 dark:bg-[#070918]/85 dark:shadow-black/30">
            {/* Header: Unwrapped Larger Rank Logo, Name & Stars */}
            <div className="flex items-center gap-3">
                <img
                    src={rank.image || '/images/romawi.png'}
                    className="h-16 w-16 shrink-0 object-contain drop-shadow-md sm:h-20 sm:w-20"
                    alt={rank.name}
                />
                <div className="min-w-0 flex-1">
                    <span className="block font-['Orbitron'] text-[8px] font-bold tracking-widest text-indigo-600 uppercase dark:text-indigo-400">
                        LEVEL RANK ini
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
                    <span className="text-slate-500 dark:text-slate-400">
                        ERP Reputasi
                    </span>
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
   STORE BUTTON — match reference design
========================================================= */

function StoreButton() {
    return (
        <Link
            href="/store"
            className="group absolute top-1/2 left-4 z-20 hidden h-24 w-20 -translate-y-1/2 cursor-pointer flex-col items-center justify-center rounded-sm border-2 border-blue-600 bg-[#070b28]/80 shadow-[0_0_15px_rgba(59,40,246,0.3)] transition duration-300 hover:border-amber-400 hover:bg-[#0c1242]/90 sm:left-6 sm:h-28 sm:w-24 md:flex"
        >
            <Store className="h-7 w-7 text-amber-400 transition duration-300 group-hover:scale-110" />
            <span className="mt-2 font-['Orbitron'] text-xs font-bold tracking-wider text-white">
                Store
            </span>
            <div className="pointer-events-none absolute inset-0 border border-amber-400/40" />
        </Link>
    );
}

/* =========================================================
   CHARACTER SECTION — match reference design
========================================================= */

function CharacterSection({
    character,
}: {
    character: { name: string; avatar: string };
}) {
    const [showBubble, setShowBubble] = useState(false);
    const [displayText, setDisplayText] = useState('');
    const [messageIndex, setMessageIndex] = useState(0);

    // 5 pesan puitis & mendalam tentang belajar dan dunia kerja
    const messages = [
        'Belajar bukanlah tentang seberapa cepat kamu sampai, melainkan seberapa dalam kamu memahami setiap langkah. Di Ventura ini, kamu sedang menempa masa depanmu sendiri. ✨',
        'Dunia kerja tak menanyakan dari mana kamu memulai, tetapi karya apa yang telah kamu ciptakan. Asah ilmumu dengan sungguh-sungguh, sebab keahlian sejati tak pernah berbohong. ⚔️',
        'Kesalahan dalam belajar adalah batu pijakan menuju kedewasaan berpikir. Jangan takut gagal, karena dari setiap percobaan, lahir seorang profesional yang tangguh. 🌟',
        'Ilmu yang kamu kumpulkan hari ini adalah senjata terbaikmu untuk menaklukkan setiap tantangan industri besok. Jadilah ahli yang bernilai dan berintegritas. 🚀',
        'Setiap jam yang kamu dedikasikan untuk belajar adalah investasi abadi bagi impianmu. Teruslah melangkah, Master, puncak kejayaan sudah di depan mata. 🎓',
    ];

    const currentMessage = messages[messageIndex];

    // Otomatis ganti kata-kata setiap 1 menit (60 detik)
    useEffect(() => {
        const interval = setInterval(() => {
            triggerNextBubble();
        }, 60000);

        return () => clearInterval(interval);
    }, []);

    const triggerNextBubble = () => {
        setMessageIndex((prev) => (prev + 1) % messages.length);
        setShowBubble(true);
    };

    // Auto-hide setelah 10 detik
    useEffect(() => {
        if (!showBubble) return;

        const timer = setTimeout(() => {
            setShowBubble(false);
        }, 10000);

        return () => clearTimeout(timer);
    }, [showBubble, messageIndex]);

    // Efek ketikan (Typewriter)
    useEffect(() => {
        if (!showBubble) return;

        let i = 0;
        setDisplayText('');

        const interval = setInterval(() => {
            i++;
            setDisplayText(currentMessage.slice(0, i));

            if (i >= currentMessage.length) clearInterval(interval);
        }, 22);

        return () => clearInterval(interval);
    }, [showBubble, messageIndex]);

    return (
        <div className="pointer-events-none absolute inset-0 z-10 overflow-hidden">
            <div className="pointer-events-auto absolute -bottom-10 left-1/2 -translate-x-1/2 md:right-[32%] md:-bottom-14 md:left-auto md:translate-x-0 lg:right-[36%] lg:-bottom-16 xl:right-[38%] xl:-bottom-20">
                {/* Speech Bubble Spesial Dashboard (Melayang pas di atas kepala hero) */}
                {showBubble && (
                    <div className="animate-fadeIn pointer-events-auto absolute bottom-[98%] left-[35%] z-50 w-56 sm:bottom-[100%] sm:left-[40%] sm:w-64 md:bottom-[102%] md:left-[45%] md:w-72 lg:w-80">
                        <div className="relative rounded-2xl border border-[#3B28F6]/50 bg-gradient-to-b from-[#0b0903]/95 via-[#070b24]/95 to-[#05081c]/95 p-3 text-slate-200 shadow-[0_0_25px_-3px_rgba(59,40,246,0.6),0_0_10px_rgba(251,191,36,0.2)] backdrop-blur-md sm:p-4">
                            {/* Top glowing accent line */}
                            <div className="absolute top-0 right-4 left-4 h-[1.5px] bg-gradient-to-r from-transparent via-amber-400 to-transparent" />

                            {/* Header Spesial Dashboard - Nama karakter dinamis */}
                            <div className="mb-2 flex items-center gap-1.5 border-b border-[#3B28F6]/25 pb-1">
                                <span className="inline-block h-2 w-2 animate-pulse rounded-full bg-amber-400 shadow-[0_0_8px_3px_rgba(251,191,36,0.8)]" />
                                <h4 className="flex items-center gap-1 font-['Orbitron'] text-[10px] font-extrabold tracking-widest text-amber-400 uppercase sm:text-xs">
                                    {character.name}
                                </h4>
                            </div>

                            {/* Content dengan Typewriter */}
                            <div className="flex min-h-[48px] items-center sm:min-h-[56px]">
                                <p className="font-sans text-[9.5px] leading-relaxed font-medium text-slate-200 sm:text-xs">
                                    {displayText}
                                    <span className="ml-0.5 animate-pulse font-bold text-amber-400">
                                        |
                                    </span>
                                </p>
                            </div>

                            {/* Ekor Arrow (Pointer) di kiri bawah mengarah ke kepala/bahu Hero */}
                            <div className="absolute -bottom-1.5 left-4 h-3 w-3 rotate-45 border-r border-b border-[#3B28F6]/50 bg-[#05081c] sm:left-6 sm:h-3.5 sm:w-3.5" />
                        </div>
                    </div>
                )}

                {/* Karakter Hero */}
                <img
                    src={character.avatar}
                    onClick={triggerNextBubble}
                    className="relative z-20 h-[300px] cursor-pointer transition hover:scale-[1.02] sm:h-[360px] md:h-[440px] lg:h-[500px] xl:h-[540px]"
                    style={{ animation: 'breathe 3s ease-in-out infinite' }}
                    title="Klik hero untuk kata-kata penyemangat!"
                />
            </div>
        </div>
    );
}
