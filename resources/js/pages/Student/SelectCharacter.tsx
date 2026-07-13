import { Head, router } from '@inertiajs/react';
import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Eye,
    Zap,
    Brain,
    Wrench,
    Sparkles,
    CheckCircle2,
    ChevronLeft,
    ChevronRight,
    Sword,
    TriangleAlert,
    Layers,
} from 'lucide-react';
import { Checkbox } from '@/components/ui/checkbox';

interface Character {
    _id: string;
    name: string;
    avatar: string;
    backstory: string;
    abilities: string[];
    character_type: string[];
    cosmetic_bonus: string[];
    tagline: string;
    quote: string;
    personality: string[];
    system_bonus: {
        exp_boost: number;
        gold_boost: number;
    };
    guide_power: {
        title: string;
        description: string;
    };
}

interface Props {
    characters: Character[];
}

export default function SelectCharacter({ characters }: Props) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [prevIndex, setPrevIndex] = useState(0);
    const [showModal, setShowModal] = useState(false);
    const [processing, setProcessing] = useState(false);
    const [direction, setDirection] = useState(0);

    const selected = characters[currentIndex];

    const paginate = (newDirection: number) => {
        setPrevIndex(currentIndex);
        setDirection(newDirection);
        const nextIndex =
            (currentIndex + newDirection + characters.length) %
            characters.length;
        setCurrentIndex(nextIndex);
    };

    const confirmSelection = () => {
        setShowModal(true);
    };

    const handleSubmit = () => {
        if (!selected) return;
        setProcessing(true);
        router.post(
            '/select-character',
            {
                character_id: selected._id,
            },
            {
                onFinish: () => setProcessing(false),
            },
        );
    };

    const iconMap: Record<string, any> = {
        'Visual Learn': Eye,
        Fast: Zap,
        Strategic: Brain,
        Practical: Wrench,
        Sword: Sword,
        Magic: Sparkles,
        Support: CheckCircle2,
        Agility: Zap,
        Intelligence: Brain,
    };

    const getIcon = (ability: string) => {
        const Icon = iconMap[ability] || Sparkles;
        return <Icon className="h-5 w-5" />;
    };

    const slideVariants = {
        enter: (direction: number) => ({
            x: direction > 0 ? 300 : -300,
            opacity: 0,
            scale: 0.9,
        }),
        center: {
            zIndex: 1,
            x: 0,
            opacity: 1,
            scale: 1,
        },
        exit: (direction: number) => ({
            zIndex: 0,
            x: direction < 0 ? 300 : -300,
            opacity: 0,
            scale: 0.9,
        }),
    };

    const [typedText, setTypedText] = useState('');

    const fullText = `You are about to lock in your character choice.
Once confirmed, this cannot be changed or reset.`;

    useEffect(() => {
        if (!showModal) return;

        let i = 0;
        setTypedText('');

        // ⏳ DELAY sebelum typing mulai
        const startDelay = setTimeout(() => {
            const interval = setInterval(() => {
                setTypedText(fullText.slice(0, i));

                i++;
                if (i > fullText.length) clearInterval(interval);
            }, 25); // speed typing
        }, 600); // delay sebelum mulai

        return () => clearTimeout(startDelay);
    }, [showModal]);
    return (
        <>
            <Head title="Select Character - SkillVentura" />

            {/* Main Background */}
            <div className="font-primary relative h-screen overflow-hidden bg-[#020202] text-white selection:bg-indigo-500/30">
                {/* Stars Background */}
                <div
                    className="absolute inset-0 z-0 opacity-70"
                    style={{
                        backgroundImage: `
                            radial-gradient(1px 1px at 20px 30px, #6042FF, transparent),
                            radial-gradient(2px 2px at 40px 70px, #93c5fd, transparent),
                            radial-gradient(1.5px 1.5px at 130px 80px, #fde68a, transparent),
                            radial-gradient(3px 3px at 160px 30px, #c084fc, transparent),
                            radial-gradient(2px 2px at 200px 150px, #ffffff, transparent),
                            radial-gradient(1px 1px at 300px 200px, #93c5fd, transparent),
                            radial-gradient(2.5px 2.5px at 350px 100px, #facc15, transparent),
                            radial-gradient(10px 10px at 420px 220px, #6042FF, transparent),
                            radial-gradient(2px 2px at 500px 50px, #ffffff, transparent),
                            radial-gradient(3px 3px at 600px 180px, #93c5fd, transparent)
                            `,
                        backgroundSize: '600px 400px',
                    }}
                />

                {/* Blue Glow */}
                <div className="absolute top-[20%] left-[-10%] h-[500px] w-[500px] rounded-full bg-blue-500/30 blur-[160px]" />
                {/* Yellow Glow */}
                <div className="absolute top-[-10%] right-[-10%] h-[500px] w-[500px] rounded-full bg-yellow-400/40 blur-[180px]" />

                {/* ===================== MOBILE LAYOUT ===================== */}
                <div className="relative z-10 flex h-full flex-col md:hidden">
                    {/* TOP: Character Card + Arrow + Dots — fixed height */}
                    <div className="flex flex-shrink-0 flex-col items-center justify-center px-4 pt-4 pb-2">
                        {/* Card + Arrows row */}
                        <div className="relative flex w-full items-center justify-center">
                            {/* Arrow Left */}
                            <button
                                onClick={() => paginate(-1)}
                                className="absolute left-0 z-20 flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-white/5 backdrop-blur-md transition-all duration-300 hover:border-indigo-500/50 hover:bg-indigo-500/10"
                            >
                                <ChevronLeft className="h-4 w-4 text-indigo-400" />
                            </button>

                            {/* Character Card */}
                            <AnimatePresence
                                initial={false}
                                custom={direction}
                                mode="wait"
                            >
                                <motion.div
                                    key={currentIndex}
                                    custom={direction}
                                    variants={slideVariants}
                                    initial="enter"
                                    animate="center"
                                    exit="exit"
                                    transition={{
                                        x: {
                                            type: 'spring',
                                            stiffness: 300,
                                            damping: 30,
                                        },
                                        opacity: { duration: 0.2 },
                                        scale: { duration: 0.4 },
                                    }}
                                    className="relative h-[175px] w-[130px] overflow-hidden rounded-[20px] bg-[linear-gradient(45deg,#1e3a8a_0%,#1e3a8a_25%,transparent_60%,#facc15_100%)] p-[2px]"
                                >
                                    <div className="absolute inset-[2px] overflow-hidden rounded-[18px] bg-[#0a0a0f]">
                                        <div
                                            className="absolute inset-0 opacity-40"
                                            style={{
                                                backgroundImage: `
                                                    radial-gradient(2px 2px at 20px 30px, #60a5fa, transparent),
                                                    radial-gradient(1px 1px at 90px 80px, white, transparent),
                                                    radial-gradient(2px 2px at 150px 120px, #fde68a, transparent)
                                                    `,
                                                backgroundSize: '200px 200px',
                                            }}
                                        />
                                        <div className="absolute top-[15%] left-[10%] z-[1] h-[100px] w-[150px] scale-x-[1.6] -rotate-45 bg-gradient-to-t from-blue-800 to-transparent blur-[40px]" />
                                        <motion.img
                                            initial={{ y: 20, opacity: 0 }}
                                            animate={{ y: 0, opacity: 1 }}
                                            src={selected.avatar}
                                            alt={selected.name}
                                            className="relative z-10 h-full w-full translate-y-[26%] scale-[1.4] object-cover object-top"
                                        />
                                    </div>
                                </motion.div>
                            </AnimatePresence>

                            {/* Arrow Right */}
                            <button
                                onClick={() => paginate(1)}
                                className="absolute right-0 z-20 flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-white/5 backdrop-blur-md transition-all duration-300 hover:border-indigo-500/50 hover:bg-indigo-500/10"
                            >
                                <ChevronRight className="h-4 w-4 text-indigo-400" />
                            </button>
                        </div>

                        {/* Pagination Dots — max 5 visible */}
                        <div className="mt-3 flex gap-2">
                            {(() => {
                                const total = characters.length;
                                const maxDots = 5;
                                if (total <= maxDots) {
                                    return characters.map((_, idx) => (
                                        <button
                                            key={idx}
                                            onClick={() => {
                                                setDirection(
                                                    idx > currentIndex ? 1 : -1,
                                                );
                                                setCurrentIndex(idx);
                                            }}
                                            className={`h-2 rounded-full transition-all duration-300 ${idx === currentIndex ? 'w-6 bg-[#FACC15]' : 'w-2 bg-white/30 hover:bg-white/50'}`}
                                        />
                                    ));
                                }
                                let start = Math.max(0, currentIndex - 2);
                                let end = Math.min(
                                    total - 1,
                                    start + maxDots - 1,
                                );
                                if (end - start < maxDots - 1)
                                    start = Math.max(0, end - maxDots + 1);
                                return Array.from(
                                    { length: end - start + 1 },
                                    (_, i) => {
                                        const idx = start + i;
                                        return (
                                            <button
                                                key={idx}
                                                onClick={() => {
                                                    setDirection(
                                                        idx > currentIndex
                                                            ? 1
                                                            : -1,
                                                    );
                                                    setCurrentIndex(idx);
                                                }}
                                                className={`h-2 rounded-full transition-all duration-300 ${idx === currentIndex ? 'w-6 bg-[#FACC15]' : 'w-2 bg-white/30 hover:bg-white/50'}`}
                                            />
                                        );
                                    },
                                );
                            })()}
                        </div>
                    </div>

                    {/* BOTTOM: Info Panel — scrollable */}
                    <div className="mx-3 mb-3 min-h-0 flex-1">
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={selected._id}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                transition={{ duration: 0.25 }}
                                className="relative flex h-full flex-col overflow-hidden rounded-[10px] border border-b-2 border-l-[3px] border-b-[#3B28F6] border-l-[#3B28F6] bg-[#070927]"
                            >
                                <div className="pointer-events-none absolute -top-10 -right-10 h-32 w-32 rounded-full bg-indigo-500/10 blur-3xl" />

                                {/* Scrollable content */}
                                <div className="custom-scrollbar relative z-10 flex-1 space-y-4 overflow-y-auto px-4 pt-4 pb-2">
                                    {/* Name + tags row */}
                                    <div className="flex items-center justify-between gap-2">
                                        <h1
                                            style={{ fontFamily: 'Orbitron' }}
                                            className="text-2xl font-black tracking-widest text-blue-50 uppercase"
                                        >
                                            {selected.name}
                                        </h1>
                                        <div className="flex flex-wrap justify-end gap-1">
                                            {(
                                                selected.character_type || []
                                            ).map((type, i) => (
                                                <span
                                                    key={i}
                                                    style={{
                                                        fontFamily: 'Oxanium',
                                                    }}
                                                    className="rounded-sm border border-[#4F46E5] bg-[#3B28F6]/20 px-2 py-0.5 text-[9px] tracking-[0.15em] text-[#A096FF] uppercase"
                                                >
                                                    {type}
                                                </span>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Tagline */}
                                    <p
                                        style={{ fontFamily: 'Oxanium' }}
                                        className="-mt-2 text-xs leading-relaxed text-[#B3B3B3]"
                                    >
                                        "{selected.tagline}"
                                    </p>

                                    {/* Abilities - compact icon row */}
                                    <div className="flex gap-4">
                                        {(
                                            selected.abilities || [
                                                'Visual Learn',
                                                'Fast',
                                                'Strategic',
                                                'Practical',
                                            ]
                                        )
                                            .slice(0, 4)
                                            .map((ability, i) => (
                                                <div
                                                    key={i}
                                                    className="flex flex-col items-center gap-1"
                                                >
                                                    <div className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white/70">
                                                        {getIcon(ability)}
                                                    </div>
                                                    <span className="text-center text-[8px] font-bold tracking-wider text-white/40 uppercase">
                                                        {ability}
                                                    </span>
                                                </div>
                                            ))}
                                    </div>

                                    {/* Divider */}
                                    <div className="border-t border-white/10" />

                                    {/* Guide Power — compact */}
                                    <div className="flex items-center gap-3 rounded-xl border border-[#3B28F6] bg-[#020101]/60 p-3 shadow-[0_0_11px_rgba(59,130,246,0.2)]">
                                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-[#810AC6]/70 bg-[#6042FF]/40">
                                            <Layers className="h-4 w-4 text-white" />
                                        </div>
                                        <div className="min-w-0">
                                            <h3
                                                style={{
                                                    fontFamily: 'Orbitron',
                                                }}
                                                className="mb-0.5 bg-gradient-to-r from-[#3B28F6] to-purple-500 bg-clip-text text-[9px] font-black tracking-widest text-transparent uppercase"
                                            >
                                                Guide Power:{' '}
                                                {selected.guide_power?.title ||
                                                    'Unknown'}
                                            </h3>
                                            <p
                                                style={{
                                                    fontFamily: 'Oxanium',
                                                }}
                                                className="line-clamp-2 text-[11px] leading-relaxed text-[#B3B3B3]/80"
                                            >
                                                {selected.guide_power
                                                    ?.description ||
                                                    'No power description available.'}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Starter Bonuses — compact */}
                                    <div className="rounded-xl border border-[#3B28F6] bg-[#020101]/60 p-3 shadow-[0_0_11px_rgba(59,130,246,0.2)]">
                                        <h3
                                            style={{ fontFamily: 'Orbitron' }}
                                            className="mb-3 text-[9px] tracking-widest text-[#FACC15] uppercase"
                                        >
                                            Starter Bonus
                                        </h3>
                                        <div className="grid grid-cols-2 gap-2">
                                            <div className="flex items-center gap-2">
                                                <Checkbox
                                                    checked
                                                    className="h-3 w-3 border-yellow-500/50 data-[state=checked]:bg-yellow-500 data-[state=checked]:text-black"
                                                />
                                                <span
                                                    style={{
                                                        fontFamily: 'Oxanium',
                                                    }}
                                                    className="text-[10px] font-semibold text-yellow-400"
                                                >
                                                    +
                                                    {selected.system_bonus
                                                        ?.exp_boost || 15}
                                                    % EXP
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <Checkbox
                                                    checked
                                                    className="h-3 w-3 border-amber-500/50 data-[state=checked]:bg-amber-500 data-[state=checked]:text-black"
                                                />
                                                <span
                                                    style={{
                                                        fontFamily: 'Oxanium',
                                                    }}
                                                    className="text-[10px] font-semibold text-amber-400"
                                                >
                                                    +
                                                    {selected.system_bonus
                                                        ?.gold_boost || 20}
                                                    % Gold
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-2 opacity-40">
                                                <Checkbox
                                                    disabled
                                                    className="h-3 w-3 border-[#FACC15] bg-[#A34B1D]"
                                                />
                                                <span
                                                    style={{
                                                        fontFamily: 'Oxanium',
                                                    }}
                                                    className="text-[10px] text-[#FACC15]"
                                                >
                                                    Focus Boost
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-2 opacity-40">
                                                <Checkbox
                                                    disabled
                                                    className="h-3 w-3 border-[#FACC15] bg-[#A34B1D]"
                                                />
                                                <span
                                                    style={{
                                                        fontFamily: 'Oxanium',
                                                    }}
                                                    className="text-[10px] text-[#F0F0F0]"
                                                >
                                                    Mind{' '}
                                                    <span className="text-[#FACC15]">
                                                        Sync
                                                    </span>
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Personality tags */}
                                    <div className="flex flex-wrap gap-1.5">
                                        {(selected.personality || []).map(
                                            (trait, i) => (
                                                <span
                                                    key={i}
                                                    style={{
                                                        fontFamily: 'Oxanium',
                                                    }}
                                                    className="rounded-full border border-[#6041FF] bg-[#1D215D] px-3 py-1 text-[10px] font-semibold text-[#6041FF]"
                                                >
                                                    {trait}
                                                </span>
                                            ),
                                        )}
                                    </div>

                                    {/* Origin Story — mobile */}
                                    <div className="rounded-xl border border-[#3B28F6] bg-[#020101]/60 p-3 shadow-[0_0_11px_rgba(59,130,246,0.2)]">
                                        <div className="mb-2 flex items-center gap-2">
                                            <div className="h-1.5 w-1.5 shrink-0 rounded-full bg-sky-400" />
                                            <h2
                                                style={{
                                                    fontFamily: 'Orbitron',
                                                }}
                                                className="text-[10px] font-bold tracking-widest text-slate-200 uppercase"
                                            >
                                                Origin Story
                                            </h2>
                                        </div>
                                        <div className="text-[11px] leading-relaxed text-slate-400">
                                            {selected.backstory ? (
                                                <p className="whitespace-pre-line">
                                                    {selected.backstory}
                                                </p>
                                            ) : (
                                                <p>
                                                    History lost in the records
                                                    of time.
                                                </p>
                                            )}
                                        </div>
                                        <div className="mt-3 border-l border-white/20 pl-3 text-[10px] text-slate-400 italic">
                                            "Learning is not about speed, but
                                            about consistency."
                                        </div>
                                    </div>

                                    {/* Quote — mobile */}
                                    <div className="rounded-xl border border-[#3B28F6] bg-[#020101]/60 p-3 text-center shadow-[0_0_11px_rgba(59,130,246,0.2)]">
                                        <p
                                            style={{ fontFamily: 'Orbitron' }}
                                            className="text-[11px] leading-relaxed font-semibold tracking-wide text-slate-200"
                                        >
                                            "
                                            {selected.quote ||
                                                'Ready for adventure.'}
                                            "
                                        </p>
                                        <span className="mt-1 block text-[10px] text-slate-500 italic">
                                            — {selected.name}
                                        </span>
                                    </div>
                                </div>

                                {/* Confirm Button — sticky bottom */}
                                <div className="flex-shrink-0 border-t border-white/10 p-3">
                                    <button
                                        onClick={confirmSelection}
                                        style={{ fontFamily: 'Oxanium' }}
                                        className="w-full rounded-sm bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 py-3 text-xs font-black tracking-widest text-white uppercase shadow-[0_0_12px_rgba(139,92,246,0.6)] transition-all duration-300 hover:shadow-[0_0_20px_rgba(139,92,246,0.8)] active:scale-95"
                                    >
                                        Confirm Selection
                                    </button>
                                </div>
                            </motion.div>
                        </AnimatePresence>
                    </div>
                </div>

                {/* ===================== DESKTOP LAYOUT ===================== */}
                <div className="relative z-10 container mx-auto hidden min-h-screen flex-col justify-center px-4 py-8 md:flex lg:py-12">
                    <div className="mx-auto flex w-full max-w-7xl flex-col items-center gap-8 md:flex-row md:items-start lg:gap-12">
                        {/* LEFT: Character Card Display */}
                        <div className="flex w-full flex-col items-center md:w-[260px] lg:w-[420px]">
                            <div className="group perspective-1000 relative">
                                <button
                                    onClick={() => paginate(-1)}
                                    className="absolute top-1/2 -left-14 z-20 hidden h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full border border-white/10 bg-white/5 backdrop-blur-md transition-all duration-300 hover:scale-110 hover:border-indigo-500/50 hover:bg-indigo-500/10 hover:shadow-[0_0_20px_rgba(99,102,241,0.6)] sm:flex"
                                >
                                    <ChevronLeft className="h-5 w-5 text-indigo-400 group-hover:text-white" />
                                </button>
                                <button
                                    onClick={() => paginate(1)}
                                    className="absolute top-1/2 -right-14 z-20 hidden h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full border border-white/10 bg-white/5 backdrop-blur-md transition-all duration-300 hover:scale-110 hover:border-indigo-500/50 hover:bg-indigo-500/10 hover:shadow-[0_0_20px_rgba(99,102,241,0.6)] sm:flex"
                                >
                                    <ChevronRight className="h-5 w-5 text-indigo-400" />
                                </button>

                                <AnimatePresence
                                    initial={false}
                                    custom={direction}
                                    mode="wait"
                                >
                                    <motion.div
                                        key={currentIndex}
                                        custom={direction}
                                        variants={slideVariants}
                                        initial="enter"
                                        animate="center"
                                        exit="exit"
                                        transition={{
                                            x: {
                                                type: 'spring',
                                                stiffness: 300,
                                                damping: 30,
                                            },
                                            opacity: { duration: 0.2 },
                                            scale: { duration: 0.4 },
                                        }}
                                        className="relative h-[220px] w-[160px] overflow-hidden rounded-[25px] bg-[linear-gradient(45deg,#1e3a8a_0%,#1e3a8a_25%,transparent_60%,#facc15_100%)] p-[2px] md:h-[270px] md:w-[200px] lg:h-[400px] lg:w-[300px] xl:h-[410px] xl:w-[300px] 2xl:h-[480px] 2xl:w-[340px]"
                                    >
                                        <div className="absolute inset-[2px] overflow-hidden rounded-[23px] bg-[#0a0a0f]">
                                            <div
                                                className="absolute inset-0 opacity-40"
                                                style={{
                                                    backgroundImage: `
                                                        radial-gradient(2px 2px at 20px 30px, #60a5fa, transparent),
                                                        radial-gradient(1px 1px at 90px 80px, white, transparent),
                                                        radial-gradient(2px 2px at 150px 120px, #fde68a, transparent)
                                                        `,
                                                    backgroundSize:
                                                        '200px 200px',
                                                }}
                                            />
                                            <div className="absolute top-[15%] left-[10%] z-[1] h-[140px] w-[220px] scale-x-[1.6] -rotate-45 bg-gradient-to-t from-blue-800 to-transparent blur-[50px]" />
                                            <motion.img
                                                initial={{ y: 20, opacity: 0 }}
                                                animate={{ y: 0, opacity: 1 }}
                                                src={selected.avatar}
                                                alt={selected.name}
                                                className="relative z-10 h-full w-full translate-y-[26%] scale-[1.4] object-cover object-top"
                                            />
                                        </div>
                                    </motion.div>
                                </AnimatePresence>
                            </div>

                            {/* Pagination Dots desktop — max 5 */}
                            <div className="mt-8 flex gap-2.5">
                                {(() => {
                                    const total = characters.length;
                                    const maxDots = 5;
                                    if (total <= maxDots) {
                                        return characters.map((_, idx) => (
                                            <button
                                                key={idx}
                                                onClick={() => {
                                                    setDirection(
                                                        idx > currentIndex
                                                            ? 1
                                                            : -1,
                                                    );
                                                    setCurrentIndex(idx);
                                                }}
                                                className={`h-2.5 rounded-full transition-all duration-300 ${idx === currentIndex ? 'w-10 bg-[#FACC15]' : 'w-2.5 bg-white/40 hover:bg-white/40'}`}
                                            />
                                        ));
                                    }
                                    let start = Math.max(0, currentIndex - 2);
                                    let end = Math.min(
                                        total - 1,
                                        start + maxDots - 1,
                                    );
                                    if (end - start < maxDots - 1)
                                        start = Math.max(0, end - maxDots + 1);
                                    return Array.from(
                                        { length: end - start + 1 },
                                        (_, i) => {
                                            const idx = start + i;
                                            return (
                                                <button
                                                    key={idx}
                                                    onClick={() => {
                                                        setDirection(
                                                            idx > currentIndex
                                                                ? 1
                                                                : -1,
                                                        );
                                                        setCurrentIndex(idx);
                                                    }}
                                                    className={`h-2.5 rounded-full transition-all duration-300 ${idx === currentIndex ? 'w-10 bg-[#FACC15]' : 'w-2.5 bg-white/40 hover:bg-white/40'}`}
                                                />
                                            );
                                        },
                                    );
                                })()}
                            </div>
                        </div>

                        {/* RIGHT: Detailed Information Panel */}
                        <div className="relative flex w-full max-w-[500px] flex-1 flex-col gap-2 pl-4 md:max-w-[600px] md:pl-4 lg:left-0 lg:max-w-[700px] lg:pl-0 xl:left-5 xl:max-w-[700px] xl:pl-12 2xl:left-14 2xl:max-w-[1200px] 2xl:pl-20">
                            <AnimatePresence mode="wait">
                                <motion.div
                                    key={selected._id}
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    transition={{ duration: 0.3 }}
                                    className="relative flex max-h-screen flex-col overflow-hidden rounded-[10px] border border-b-2 border-l-3 border-b-[#3B28F6] border-l-[#3B28F6] bg-[#070927] shadow-2xl backdrop-blur-3xl lg:h-[550px] xl:h-[590px] 2xl:h-[670px]"
                                >
                                    <div className="pointer-events-none absolute -top-20 -right-20 h-40 w-40 rounded-full bg-indigo-500/10 p-4 blur-3xl" />

                                    <div className="custom-scrollbar relative z-10 flex-1 overflow-y-auto p-8 lg:p-8">
                                        <div className="mb-8 flex flex-col gap-6">
                                            <div className="flex flex-wrap gap-3">
                                                {(
                                                    selected.character_type ||
                                                    []
                                                ).map((type, i) => (
                                                    <span
                                                        key={i}
                                                        style={{
                                                            fontFamily:
                                                                'Oxanium',
                                                        }}
                                                        className="rounded-sm border border-[#4F46E5] bg-[#3B28F6]/20 px-6 py-2 text-[13px] tracking-[0.2em] text-[#A096FF] uppercase shadow-[0_0_15px_rgba(79,70,229,0.7)] backdrop-blur-sm"
                                                    >
                                                        {type}
                                                    </span>
                                                ))}
                                            </div>
                                            <div>
                                                <h1
                                                    style={{
                                                        fontFamily: 'Orbitron',
                                                    }}
                                                    className="mb-2 text-6xl font-black tracking-tighter tracking-widest text-blue-50 uppercase sm:text-2xl md:text-4xl"
                                                >
                                                    {selected.name}
                                                </h1>
                                                <p
                                                    style={{
                                                        fontFamily: 'Oxanium',
                                                    }}
                                                    className="font-medium text-[#B3B3B3]"
                                                >
                                                    "{selected.tagline}"
                                                </p>
                                            </div>
                                            <div className="flex flex-wrap items-center gap-8 border-b border-white/60 pb-8">
                                                {(
                                                    selected.abilities || [
                                                        'Visual Learn',
                                                        'Fast',
                                                        'Strategic',
                                                        'Practical',
                                                    ]
                                                )
                                                    .slice(0, 4)
                                                    .map((ability, i) => (
                                                        <div
                                                            key={i}
                                                            className="group flex flex-col items-center gap-2"
                                                        >
                                                            <div className="flex h-12 w-12 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white/70 shadow-inner transition-all group-hover:border-indigo-500/50 group-hover:bg-indigo-500/10 group-hover:text-indigo-400">
                                                                {getIcon(
                                                                    ability,
                                                                )}
                                                            </div>
                                                            <span className="text-[9px] font-bold tracking-widest text-white/40 uppercase group-hover:text-white/60">
                                                                {ability}
                                                            </span>
                                                        </div>
                                                    ))}
                                            </div>
                                        </div>

                                        <div className="group mb-8">
                                            <div className="flex items-center gap-4 rounded-xl border border-[#3B28F6] bg-[#020101]/60 p-5 shadow-[0_0_11px_rgba(59,130,246,0.35)]">
                                                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full border border-[#810AC6]/70 bg-[#6042FF]/40 shadow-lg">
                                                    <Layers className="h-7 w-7 text-white" />
                                                </div>
                                                <div>
                                                    <h3
                                                        style={{
                                                            fontFamily:
                                                                'Orbitron',
                                                        }}
                                                        className="mb-1 bg-gradient-to-r from-[#3B28F6] to-purple-500 bg-clip-text text-xs font-black tracking-widest text-transparent uppercase"
                                                    >
                                                        Guide Power:{' '}
                                                        {selected.guide_power
                                                            ?.title ||
                                                            'Unknown'}
                                                    </h3>
                                                    <p
                                                        style={{
                                                            fontFamily:
                                                                'Oxanium',
                                                        }}
                                                        className="max-w-sm text-sm leading-relaxed text-[#B3B3B3]/80"
                                                    >
                                                        {selected.guide_power
                                                            ?.description ||
                                                            'No power description available.'}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Origin Story — desktop */}
                                        <div className="mb-8 rounded-2xl border border-[#3B28F6] bg-[#020101]/60 p-6 shadow-[0_0_11px_rgba(59,130,246,0.35)]">
                                            <div className="mb-4 flex items-center gap-3">
                                                <div className="h-2 w-2 rounded-full bg-sky-400" />
                                                <h2 className="text-lg font-semibold tracking-wide text-slate-200">
                                                    Origin Story
                                                </h2>
                                            </div>
                                            <div className="space-y-4 text-sm leading-relaxed text-slate-400">
                                                {selected.backstory ? (
                                                    <p className="whitespace-pre-line">
                                                        {selected.backstory}
                                                    </p>
                                                ) : (
                                                    <p>
                                                        History lost in the
                                                        records of time.
                                                    </p>
                                                )}
                                            </div>
                                            <div className="mt-6 border-l border-white/20 pl-4 text-sm text-slate-400 italic">
                                                "Learning is not about speed,
                                                but about consistency."
                                            </div>
                                        </div>

                                        <div className="mb-10 grid grid-cols-1 gap-8 lg:grid-cols-2">
                                            <div className="rounded-2xl border border-[#3B28F6] bg-[#020101]/60 p-6 shadow-[0_0_11px_rgba(59,130,246,0.35)]">
                                                <h3
                                                    style={{
                                                        fontFamily: 'Orbitron',
                                                    }}
                                                    className="mb-6 text-sm font-bold tracking-widest text-[#B3B3B3]/80 uppercase lg:text-base"
                                                >
                                                    Personality
                                                </h3>
                                                <div className="flex flex-wrap gap-4">
                                                    {(
                                                        selected.personality ||
                                                        []
                                                    ).map((trait, i) => (
                                                        <span
                                                            key={i}
                                                            style={{
                                                                fontFamily:
                                                                    'Oxanium',
                                                            }}
                                                            className="rounded-full border border-[#6041FF] bg-[#1D215D] px-5 py-2 text-sm font-semibold text-[#6041FF]"
                                                        >
                                                            {trait}
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>
                                            <div className="rounded-2xl border border-[#3B28F6] bg-[#020101]/60 p-6 shadow-[0_0_11px_rgba(59,130,246,0.35)]">
                                                <h3
                                                    style={{
                                                        fontFamily: 'Orbitron',
                                                    }}
                                                    className="mb-6 text-lg tracking-widest text-[#FACC15] uppercase lg:text-base"
                                                >
                                                    Starter Bonus
                                                </h3>
                                                <div className="space-y-4">
                                                    <div className="pointer-events-none flex items-center gap-3">
                                                        <Checkbox
                                                            checked
                                                            className="border-yellow-500/50 data-[state=checked]:bg-yellow-500 data-[state=checked]:text-black"
                                                        />
                                                        <span
                                                            style={{
                                                                fontFamily:
                                                                    'Oxanium',
                                                            }}
                                                            className="text-sm font-semibold tracking-wide text-yellow-400"
                                                        >
                                                            +
                                                            {selected
                                                                .system_bonus
                                                                ?.exp_boost ||
                                                                15}
                                                            % Learning EXP
                                                        </span>
                                                    </div>
                                                    <div className="pointer-events-none flex items-center gap-3">
                                                        <Checkbox
                                                            checked
                                                            className="border-amber-500/50 data-[state=checked]:bg-amber-500 data-[state=checked]:text-black"
                                                        />
                                                        <span
                                                            style={{
                                                                fontFamily:
                                                                    'Oxanium',
                                                            }}
                                                            className="text-sm font-semibold tracking-wide text-amber-400"
                                                        >
                                                            +
                                                            {selected
                                                                .system_bonus
                                                                ?.gold_boost ||
                                                                20}
                                                            % Gold Reward
                                                        </span>
                                                    </div>
                                                    <div className="flex cursor-not-allowed items-center gap-3 opacity-50">
                                                        <Checkbox
                                                            disabled
                                                            className="border-[#FACC15] bg-[#A34B1D]"
                                                        />
                                                        <span
                                                            style={{
                                                                fontFamily:
                                                                    'Oxanium',
                                                            }}
                                                            className="text-sm font-medium text-[#FACC15]"
                                                        >
                                                            Focus Boost{' '}
                                                            <span className="text-[#F0F0F0]">
                                                                Session
                                                            </span>
                                                        </span>
                                                    </div>
                                                    <div className="flex cursor-not-allowed items-center gap-3 opacity-50">
                                                        <Checkbox
                                                            disabled
                                                            className="border-[#FACC15] bg-[#A34B1D]"
                                                        />
                                                        <span
                                                            style={{
                                                                fontFamily:
                                                                    'Oxanium',
                                                            }}
                                                            className="text-sm font-medium text-[#F0F0F0]"
                                                        >
                                                            Mind{' '}
                                                            <span className="text-[#FACC15]">
                                                                Sync
                                                            </span>
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="rounded-2xl border border-[#3B28F6] bg-[#020101]/60 p-8 text-center shadow-[0_0_11px_rgba(59,130,246,0.35)]">
                                            <p
                                                style={{
                                                    fontFamily: 'Orbitron',
                                                }}
                                                className="text-xl leading-relaxed font-semibold tracking-wide text-slate-200"
                                            >
                                                "
                                                {selected.quote ||
                                                    'Ready for adventure.'}
                                                "
                                            </p>
                                            <div className="relative mt-4 flex items-center justify-center">
                                                <span className="text-xs text-slate-500 italic">
                                                    — {selected.name}
                                                </span>
                                                <div className="absolute bottom-[-6px] h-[3px] w-24 rounded-full bg-purple-500/50 blur-md" />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="relative border-t border-white/10 p-6 lg:p-8">
                                        <div className="flex flex-col gap-4 sm:flex-row">
                                            <button
                                                onClick={confirmSelection}
                                                style={{
                                                    fontFamily: 'Oxanium',
                                                }}
                                                className="flex-1 rounded-sm bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 px-8 py-4 text-sm font-black tracking-widest text-white uppercase shadow-[0_0_12px_rgba(139,92,246,0.6)] transition-all duration-300 hover:shadow-[0_0_20px_rgba(139,92,246,0.8)] active:scale-95"
                                            >
                                                Confirm Selection
                                            </button>
                                        </div>
                                    </div>
                                </motion.div>
                            </AnimatePresence>
                        </div>
                    </div>
                </div>

                {/* Confirm Modal */}
                <AnimatePresence>
                    {showModal && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4 backdrop-blur-md lg:p-6 xl:p-8"
                        >
                            <motion.div
                                initial={{
                                    clipPath: 'inset(50% 0% 50% 0%)',
                                    opacity: 0,
                                }}
                                animate={{
                                    clipPath: 'inset(0% 0% 0% 0%)',
                                    opacity: 1,
                                }}
                                exit={{
                                    clipPath: 'inset(50% 0% 50% 0%)',
                                    opacity: 0,
                                }}
                                transition={{
                                    duration: 0.5,
                                    ease: 'easeInOut',
                                }}
                                className="relative w-full max-w-xl overflow-hidden rounded-xs border border-[#3B28F6]/80 bg-[#020202] p-6 text-center shadow-[0_0_30px_rgba(59,130,246,0.6)] md:p-8 lg:p-10 xl:p-12"
                            >
                                <div className="absolute -top-20 -left-20 h-40 w-40 rounded-full bg-blue-500/20 blur-3xl" />
                                <div className="absolute -right-20 -bottom-20 h-40 w-40 rounded-full bg-purple-500/20 blur-3xl" />
                                <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full border-2 border-yellow-400 bg-[#F0E427]/30">
                                    <TriangleAlert className="h-8 w-8 text-yellow-400" />
                                </div>
                                <h1 className="text-3xl tracking-widest text-white uppercase md:text-4xl">
                                    Confirm Selection
                                </h1>
                                <p className="mt-2 mb-6 text-xs tracking-[0.2em] text-[#3B28F6] uppercase">
                                    System Alert: Action Final
                                </p>
                                <div className="mb-6 flex items-center justify-center gap-3">
                                    <div className="h-[1px] w-24 bg-[#3B28F6]" />
                                    <div className="h-3 w-3 rotate-45 border-2 border-blue-500" />
                                    <div className="h-[1px] w-24 bg-[#3B28F6]" />
                                </div>
                                <div className="mb-6 rounded-xl border border-blue-500/30 bg-blue-900/10 p-5 text-left">
                                    <p className="mb-3 text-center font-semibold text-yellow-400">
                                        Warning: Irreversible Action
                                    </p>
                                    <p className="font-mono text-sm leading-relaxed text-slate-100 md:text-base">
                                        {typedText}
                                        <span className="animate-pulse">|</span>
                                    </p>
                                </div>
                                <div className="flex flex-col gap-3 sm:flex-row">
                                    <button
                                        onClick={() => setShowModal(false)}
                                        className="flex-1 rounded-sm border border-white/10 bg-white/5 px-6 py-3 text-white/80 hover:bg-white/10"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={handleSubmit}
                                        disabled={processing}
                                        className="flex-1 rounded-sm border border-[#4F46E5] bg-[#3B28F6]/20 px-6 py-3 text-[#6252FF] shadow-[0_0_12px_rgba(139,92,246,0.6)] hover:shadow-[0_0_20px_rgba(139,92,246,0.8)]"
                                    >
                                        {processing ? 'Deploying...' : 'Deploy'}
                                    </button>
                                </div>
                                <p className="mt-8 text-[10px] tracking-wide text-slate-500">
                                    SYSTEM ID: SKILLVENTURA CHARACTER
                                </p>
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </>
    );
}
