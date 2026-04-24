import { Head, router } from '@inertiajs/react';
import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {Eye,Zap,Brain,Wrench,Sparkles,CheckCircle2,ChevronLeft,ChevronRight,Sword,TriangleAlert,Layers,} from 'lucide-react';
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
        const nextIndex = (currentIndex + newDirection + characters.length) % characters.length;
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
            }
        );
    };

    const iconMap: Record<string, any> = {
        'Visual Learn': Eye,
        'Fast': Zap,
        'Strategic': Brain,
        'Practical': Wrench,
        'Sword': Sword,
        'Magic': Sparkles,
        'Support': CheckCircle2,
        'Agility': Zap,
        'Intelligence': Brain,
    };

    const getIcon = (ability: string) => {
        const Icon = iconMap[ability] || Sparkles;
        return <Icon className="w-5 h-5" />;
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

const [typedText, setTypedText] = useState("");

const fullText = `You are about to lock in your character choice.
Once confirmed, this cannot be changed or reset.`;



useEffect(() => {
  if (!showModal) return;

 

  let i = 0;
  setTypedText("");

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
            <div className="relative min-h-screen bg-[#020202] text-white selection:bg-indigo-500/30 font-primary overflow-hidden">
                {/* Dynamic Blurred Background Effects */}
                <div className="relative min-h-screen bg-[#020202] text-white selection:bg-indigo-500/30 font-primary overflow-hidden">

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
                backgroundSize: "600px 400px"
                }}
                />

                {/* Blue Glow */}
                <div className="absolute top-[20%] left-[-10%] w-[500px] h-[500px] bg-blue-500/30 rounded-full blur-[160px] mb-7" />

                {/* Yellow Glow */}
                <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-yellow-400/40 rounded-full blur-[180px]" />

                {/* Content */}
                <div className="relative z-10 container mx-auto px-4 py-8 lg:py-12 flex flex-col min-h-screen justify-center">
                <div className="flex flex-col md:flex-row gap-8 lg:gap-12 items-center md:items-start max-w-7xl mx-auto w-full">

                        {/* LEFT: Character Card Display */}
                        <div className="w-full md:w-[260px] lg:w-[420px] flex flex-col items-center">
                            <div className="relative group perspective-1000">
                                {/* Navigation Arrows for Character */}
                                    <button
                                        onClick={() => paginate(-1)}
                                        className="absolute -left-14 top-1/2 -translate-y-1/2 z-20 hidden sm:flex items-center justify-center
                                        w-12 h-12 rounded-full
                                        bg-white/5 backdrop-blur-md
                                        border border-white/10
                                        hover:border-indigo-500/50
                                        hover:bg-indigo-500/10
                                        transition-all duration-300
                                        hover:scale-110
                                        hover:shadow-[0_0_20px_rgba(99,102,241,0.6)]"
                                    >
                                        <ChevronLeft className="w-5 h-5 text-indigo-400 group-hover:text-white" />
                                    </button>

                                    <button
                                        onClick={() => paginate(1)}
                                        className="absolute -right-14 top-1/2 -translate-y-1/2 z-20 hidden sm:flex items-center justify-center
                                        w-12 h-12 rounded-full
                                        bg-white/5 backdrop-blur-md
                                        border border-white/10
                                        hover:border-indigo-500/50
                                        hover:bg-indigo-500/10
                                        transition-all duration-300
                                        hover:scale-110
                                        hover:shadow-[0_0_20px_rgba(99,102,241,0.6)]"
                                    >
                                        <ChevronRight className="w-5 h-5 text-indigo-400" />
                                    </button>

                            <AnimatePresence initial={false} custom={direction} mode="wait">
                            <motion.div
                                key={currentIndex}
                                custom={direction}
                                variants={slideVariants}
                                initial="enter"
                                animate="center"
                                exit="exit"
                                transition={{
                                    x: { type: "spring", stiffness: 300, damping: 30 },
                                    opacity: { duration: 0.2 },
                                    scale: { duration: 0.4 }
                                }}
                                className="relative 
                                w-[160px] h-[220px] 
                                md:w-[200px] md:h-[270px] 
                                lg:w-[300px] lg:h-[400px] 
                                xl:w-[300px] xl:h-[410px] 
                                2xl:w-[340px] 2xl:h-[480px]
                                rounded-[25px] p-[2px] overflow-hidden
                                bg-[linear-gradient(45deg,#1e3a8a_0%,#1e3a8a_25%,transparent_60%,#facc15_100%)]"
                            >

                                {/* Inner Card */}
                                <div className="absolute inset-[2px] rounded-[23px] bg-[#0a0a0f] overflow-hidden">

                                    {/* Stars Background */}
                                    <div
                                        className="absolute inset-0 opacity-40"
                                        style={{
                                            backgroundImage: `
                                            radial-gradient(2px 2px at 20px 30px, #60a5fa, transparent),
                                            radial-gradient(1px 1px at 90px 80px, white, transparent),
                                            radial-gradient(2px 2px at 150px 120px, #fde68a, transparent)
                                            `,
                                            backgroundSize: "200px 200px"
                                        }}
                                    />

                                    {/* Cloud Effect */}
                                    <div className="absolute z-[1] top-[15%] left-[10%] w-[220px] h-[140px] bg-gradient-to-t from-blue-800 to-transparent blur-[50px] -rotate-45 scale-x-[1.6]" />

                                    {/* Character Image */}
                                    <motion.img
                                        initial={{ y: 20, opacity: 0 }}
                                        animate={{ y: 0, opacity: 1 }}
                                        src={selected.avatar}
                                        alt={selected.name}
                                        className="relative z-10 w-full h-full object-cover object-top scale-[1.4] translate-y-[26%]"
                                    />

                                </div>

                            </motion.div>
                            </AnimatePresence>
                            </div>

                            {/* Pagination Dots */}
                            <div className="flex gap-2.5 mt-8">
                                {characters.map((_, idx) => (
                                    <button
                                        key={idx}
                                        onClick={() => {
                                            setDirection(idx > currentIndex ? 1 : -1);
                                            setCurrentIndex(idx);
                                        }}
                                        className={`h-2.5 rounded-full transition-all duration-300 ${idx === currentIndex
                                            ? 'w-10 bg-[#FACC15]'
                                            : 'w-2.5 bg-white/40 hover:bg-white/40'
                                            }`}
                                    />
                                ))}
                            </div>
                        </div>

                        {/* RIGHT: Detailed Information Panel */}
                            <div className="relative flex-1 w-full 
                            max-w-[500px] md:max-w-[600px] lg:max-w-[700px] xl:max-w-[700px] 2xl:max-w-[1200px] 
                            flex flex-col gap-2 
                            pl-4 md:pl-4 lg:pl-0 xl:pl-12 2xl:pl-20 
                            lg:left-0 xl:left-5 2xl:left-14">
                            <AnimatePresence mode="wait">
                                <motion.div
                                    key={selected._id}
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    transition={{ duration: 0.3 }}
                                    className="rounded-[10px] border border-l-3 border-b-2 border-b-[#3B28F6] border-l-[#3B28F6] bg-[#070927] backdrop-blur-3xl shadow-2xl relative overflow-hidden flex flex-col max-h-screen lg:h-[550px] xl:h-[590px] 2xl:h-[670px]"
                                >
                                    {/* Glass Morph Decoration */}
                                    <div className="absolute -top-20 -right-20 w-40 h-40 bg-indigo-500/10 rounded-full blur-3xl p-4 pointer-events-none" />

                                    {/* Scrollable Content Area */}
                                    <div className="flex-1 overflow-y-auto p-8 lg:p-8 custom-scrollbar relative z-10">
                                        {/* Header Section */}

                                        <div className="flex flex-col gap-6 mb-8">
                                            <div className="flex flex-wrap gap-3">
                                                {(selected.character_type || []).map((type, i) => (
                                                    <span
                                                    key={i}
                                                    style={{ fontFamily: "Oxanium" }}
                                                    className="px-6 py-2 rounded-sm bg-[#3B28F6]/20 border border-[#4F46E5] text-[#A096FF] text-[13px]  tracking-[0.2em] uppercase backdrop-blur-sm shadow-[0_0_15px_rgba(79,70,229,0.7)]"
                                                    >
                                                    {type}
                                                    </span>
                                                ))}
                                            </div>

                                            <div>
                                                <h1 style={{fontFamily: "Orbitron"}} className="text-6xl md:text-4xl sm:text-2xl  font-black tracking-tighter text-blue-50 mb-2 uppercase tracking-widest ">
                                                    {selected.name}
                                                </h1>
                                                <p style={{fontFamily: "Oxanium"}} className="text-[#B3B3B3] font-medium ">
                                                    "{selected.tagline}"
                                                </p>
                                            </div>

                                            {/* Trait Icons */}
                                            <div className="flex flex-wrap gap-8 items-center border-b border-white/60 pb-8">
                                                {(selected.abilities || ['Visual Learn', 'Fast', 'Strategic', 'Practical']).slice(0, 4).map((ability, i) => (
                                                    <div key={i} className="flex flex-col items-center gap-2 group">
                                                        <div className="w-12 h-12 flex items-center justify-center rounded-full bg-white/5 border border-white/10 group-hover:border-indigo-500/50 group-hover:bg-indigo-500/10 transition-all text-white/70 group-hover:text-indigo-400 shadow-inner">
                                                            {getIcon(ability)}
                                                        </div>
                                                        <span className="text-[9px] font-bold text-white/40 group-hover:text-white/60 uppercase tracking-widest">{ability}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>

                                        {/* Guide Power Card */}
                                        <div className="mb-8 group">
                                            <div className="p-5 rounded-xl border border-[#3B28F6] bg-[#020101]/60  flex gap-4 items-center shadow-[0_0_11px_rgba(59,130,246,0.35)]">
                                                <div className="w-14 h-14 shrink-0 rounded-full bg-[#6042FF]/40 border border-[#810AC6]/70 flex items-center justify-center shadow-lg ">
                                                    <Layers className="w-7 h-7 text-white" />
                                                </div>
                                                <div>
                                                   <h3
                                                        style={{ fontFamily: "Orbitron" }}
                                                        className="bg-gradient-to-r from-[#3B28F6] to-purple-500 bg-clip-text text-transparent text-xs font-black uppercase tracking-widest mb-1"
                                                        >
                                                        Guide Power: {selected.guide_power?.title || 'Unknown'}
                                                    </h3>
                                                    <p style={{fontFamily: "Oxanium"}} className="text-[#B3B3B3]/80 text-sm leading-relaxed max-w-sm">
                                                        {selected.guide_power?.description || 'No power description available.'}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>

                                    {/* Origin Story Section */}
                                    <div className="mb-10 rounded-2xl border border-[#3B28F6] bg-[#020101]/60 p-6 shadow-[0_0_11px_rgba(59,130,246,0.35)]">

                                        {/* Title */}
                                        <div className="flex items-center gap-3 mb-4">
                                            <div className="w-2 h-2 rounded-full bg-sky-400" />
                                            <h2 className="text-lg font-semibold text-slate-200 tracking-wide">
                                                Origin Story
                                            </h2>
                                        </div>

                                        {/* Story Text */}
                                        <div className="text-slate-400 text-sm leading-relaxed space-y-4">
                                            {selected.backstory ? (
                                                <p className="whitespace-pre-line">
                                                    {selected.backstory}
                                                </p>
                                            ) : (
                                                <p>History lost in the records of time.</p>
                                            )}
                                        </div>

                                        {/* Quote */}
                                        <div className="mt-6 pl-4 border-l border-white/20 italic text-slate-400 text-sm">
                                            "Learning is not about speed, but about consistency."
                                        </div>

                                    </div>

                                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-10">
                                            {/* Personality */}
                                            <div className="rounded-2xl border border-[#3B28F6]  bg-[#020101]/60 p-6 shadow-[0_0_11px_rgba(59,130,246,0.35)]">

                                                <h3
                                                    style={{ fontFamily: "Orbitron" }}
                                                    className="text-[#B3B3B3]/80 text-sm font-bold tracking-widest uppercase mb-6 lg:text-base "
                                                >
                                                    Personality
                                                </h3>

                                                <div className="flex flex-wrap gap-4">
                                                    {(selected.personality || []).map((trait, i) => (
                                                        <span
                                                            key={i}
                                                            style={{fontFamily: "Oxanium"}}
                                                            className="px-5 py-2 rounded-full bg-[#1D215D] text-[#6041FF] border border-[#6041FF] text-sm font-semibold"
                                                        >
                                                            {trait}
                                                        </span>
                                                    ))}
                                                </div>

                                            </div>
                                            {/* Starter Bonuses */}
                                            <div className="rounded-2xl border border-[#3B28F6] bg-[#020101]/60 p-6 shadow-[0_0_11px_rgba(59,130,246,0.35)]">
                                                <h3
                                                    style={{ fontFamily: "Orbitron" }}
                                                    className="text-[#FACC15] text-lg  tracking-widest uppercase mb-6 lg:text-base"
                                                >
                                                    Starter Bonus
                                                </h3>

                                                <div className="space-y-4">

                                                    <div className="flex items-center gap-3 group/item pointer-events-none">
                                                        <Checkbox checked className="border-yellow-500/50 data-[state=checked]:bg-yellow-500 data-[state=checked]:text-black" />
                                                        <span
                                                        style={{fontFamily: "Oxanium"}} className="text-sm font-semibold text-yellow-400 tracking-wide">
                                                            +{selected.system_bonus?.exp_boost || 15}% Learning EXP
                                                        </span>
                                                    </div>

                                                    <div className="flex items-center gap-3 group/item pointer-events-none">
                                                        <Checkbox checked className="border-amber-500/50 data-[state=checked]:bg-amber-500 data-[state=checked]:text-black" />
                                                        <span 
                                                        style={{fontFamily: "Oxanium"}} className="text-sm font-semibold text-amber-400 tracking-wide">
                                                            +{selected.system_bonus?.gold_boost || 20}% Gold Reward
                                                        </span>
                                                    </div>

                                                    <div className="flex items-center gap-3 group/item opacity-50 cursor-not-allowed">
                                                        <Checkbox disabled className="bg-[#A34B1D] border-[#FACC15]" />
                                                        <span style={{fontFamily: "Oxanium"}} className="text-sm font-medium text-[#FACC15]">
                                                             Focus Boost 
                                                             <span style={{fontFamily: "Oxanium"}} className='text-[#F0F0F0]'>Session</span>
                                                        </span>
                                                    </div>

                                                    <div className="flex items-center gap-3 group/item opacity-50 cursor-not-allowed">
                                                        <Checkbox disabled className="bg-[#A34B1D] border-[#FACC15]" />
                                                        <span 
                                                        style={{fontFamily: "Oxanium"}} className="text-sm font-medium text-[#F0F0F0]">
                                                            Mind <span style={{fontFamily: "Oxanium"}} className='text-[#FACC15]'>Sync</span>
                                                        </span>
                                                    </div>

                                                </div>

                                            </div>
                                        </div>

                                        {/* Quote Box */}
                                       <div className="rounded-2xl border border-[#3B28F6] bg-[#020101]/60 p-8 text-center shadow-[0_0_11px_rgba(59,130,246,0.35)]">
                                                <p
                                                    style={{ fontFamily: "Orbitron" }}
                                                    className="text-xl font-semibold text-slate-200 leading-relaxed tracking-wide"
                                                >
                                                    "{selected.quote || 'Ready for adventure.'}"
                                                </p>

                                                <div className="mt-4 relative flex items-center justify-center">
                                                    <span className="text-slate-500 text-xs italic">
                                                        — {selected.name}
                                                    </span>

                                                    <div className="absolute bottom-[-6px] w-24 h-[3px] bg-purple-500/50 blur-md rounded-full"></div>
                                                </div>

                                            </div>
                                    </div>

                                        {/* Footer: Action Buttons (Fixed at Bottom) */}
                                        <div className="p-6 lg:p-8 border-t border-white/10 relative ">
                                            <div className="flex flex-col sm:flex-row gap-4">

                                                {/* Confirm Button */}
                                                <button
                                                    onClick={confirmSelection}
                                                    style={{fontFamily: "Oxanium"}}
                                                    className="px-8 py-4 rounded-sm font-black text-sm uppercase tracking-widest text-white
                                                    bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500
                                                    shadow-[0_0_12px_rgba(139,92,246,0.6)]
                                                    hover:shadow-[0_0_20px_rgba(139,92,246,0.8)]
                                                    transition-all duration-300 active:scale-95 flex-1"
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

                </div>
            {/* Confirm Modal */}
            <AnimatePresence>
            {showModal && (
                <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-[100] flex items-center justify-center 
                bg-black/50 backdrop-blur-md p-4 lg:p-6 xl:p-8"
                >
            <motion.div
            initial={{
                clipPath: "inset(50% 0% 50% 0%)", // tengah ketutup
                opacity: 0
            }}
            animate={{
                clipPath: "inset(0% 0% 0% 0%)", // kebuka full
                opacity: 1
            }}
            exit={{
                clipPath: "inset(50% 0% 50% 0%)",
                opacity: 0
            }}
            transition={{
                duration: 0.5,
                ease: "easeInOut"
            }}
            className="
                bg-[#020202]
                border border-[#3B28F6]/80
                rounded-xs
                p-6 md:p-8 lg:p-10 xl:p-12
                w-full max-w-xl text-center relative overflow-hidden
                shadow-[0_0_30px_rgba(59,130,246,0.6)] 
            "
            >

                    {/* 🌊 AURA */}
                    <div className="absolute -top-20 -left-20 w-40 h-40 bg-blue-500/20 blur-3xl rounded-full" />
                    <div className="absolute -bottom-20 -right-20 w-40 h-40 bg-purple-500/20 blur-3xl rounded-full" />

                    {/* ICON */}
                    <div className="w-16 h-16 mx-auto mb-6 rounded-full border-2 border-yellow-400 bg-[#F0E427]/30 flex items-center justify-center">
                    <TriangleAlert className="w-8 h-8 text-yellow-400" />
                    </div>

                    {/* TITLE */}
                    <h1 className="text-3xl md:text-4xl text-white tracking-widest uppercase">
                    Confirm Selection
                    </h1>

                    {/* SUBTITLE */}
                    <p className="text-[#3B28F6] text-xs tracking-[0.2em] uppercase mt-2 mb-6">
                    System Alert: Action Final
                    </p>

                    {/* DIVIDER */}
                    <div className="flex items-center justify-center gap-3 mb-6">
                    <div className="h-[1px] w-24 bg-[#3B28F6]" />
                    <div className="w-3 h-3 rotate-45 border-2 border-blue-500"></div>
                    <div className="h-[1px] w-24 bg-[#3B28F6]" />
                    </div>

                    {/* WARNING BOX */}
                    <div className="rounded-xl border border-blue-500/30 bg-blue-900/10 p-5 mb-6 text-left">
                    <p className="text-yellow-400 font-semibold text-center mb-3">
                        Warning: Irreversible Action
                    </p>

                    {/* ✨ TYPING TEXT */}
                    <p className="text-slate-100 text-sm md:text-base leading-relaxed font-mono">
                        {typedText}
                        <span className="animate-pulse">|</span>
                    </p>
                    </div>

                    {/* BUTTON */}
                    <div className="flex flex-col sm:flex-row gap-3">
                    <button
                        onClick={() => setShowModal(false)}
                        className="px-6 py-3 rounded-sm bg-white/5 border border-white/10 text-white/80 flex-1 hover:bg-white/10"
                    >
                        Cancel
                    </button>

                    <button
                        onClick={handleSubmit}
                        disabled={processing}
                        className="px-6 py-3 rounded-sm text-[#6252FF] flex-1 bg-[#3B28F6]/20 border border-[#4F46E5]
                        shadow-[0_0_12px_rgba(139,92,246,0.6)]
                        hover:shadow-[0_0_20px_rgba(139,92,246,0.8)]"
                    >
                        {processing ? "Deploying..." : "Deploy"}
                    </button>
                    </div>

                    {/* FOOTER */}
                    <p className="text-[10px] text-slate-500 mt-8 tracking-wide">
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
