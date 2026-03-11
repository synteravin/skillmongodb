import { Head, router } from '@inertiajs/react';
import { useState, useEffect } from 'react';
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
    ScrollText,
    Star,
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

    return (
        <>
            <Head title="Select Character - SkillVentura" />

            {/* Main Background */}
            <div className="relative min-h-screen bg-[#020617] text-white selection:bg-indigo-500/30 font-primary overflow-hidden">
                {/* Dynamic Blurred Background Effects */}
                <div className="absolute inset-0 pointer-events-none">
                    <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-900/40 rounded-full blur-[120px] animate-pulse" />
                    <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-900/40 rounded-full blur-[120px] transition-all duration-1000" />
                    <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-[0.03]" />
                </div>

                <div className="relative z-10 container mx-auto px-4 py-8 lg:py-12 flex flex-col min-h-screen justify-center">
                    <div className="flex flex-col lg:flex-row gap-12 items-center lg:items-start max-w-7xl mx-auto w-full">

                        {/* LEFT: Character Card Display */}
                        <div className="w-full lg:w-[450px] flex flex-col items-center">
                            <div className="relative group perspective-1000">
                                {/* Navigation Arrows for Character */}
                                <button
                                    onClick={() => paginate(-1)}
                                    className="absolute -left-12 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/5 hover:bg-white/10 transition-colors z-20 hidden lg:block"
                                >
                                    <ChevronLeft className="w-5 h-5 text-indigo-400" />
                                </button>
                                <button
                                    onClick={() => paginate(1)}
                                    className="absolute -right-12 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/5 hover:bg-white/10 transition-colors z-20 hidden lg:block"
                                >
                                    <ChevronRight className="w-5 h-5 text-indigo-400" />
                                </button>

                                {/* Character Frame */}
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
                                        className="relative w-[170px] h-[240px] lg:w-[300px] lg:h-[400px] rounded-[25px] p-1 overflow-hidden"
                                    >
                                        {/* Glowing Border Interface */}
                                        <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/50 via-purple-500/50 to-indigo-500/50 animate-gradient-xy p-[2px] rounded-[25px]">
                                            <div className="absolute inset-0 bg-[#0a0a0f] rounded-[23px] m-[1px]" />
                                        </div>

                                        {/* Character Image Content */}
                                        <div className="relative h-full w-full rounded-[23px] overflow-hidden flex items-center justify-center p-2">
                                            {/* Sub-glow behind character */}
                                            <div className="absolute inset-0 bg-gradient-to-t from-indigo-900/40 to-transparent" />

                                            <motion.img
                                                initial={{ y: 20, opacity: 0 }}
                                                animate={{ y: 0, opacity: 1 }}
                                                src={selected.avatar}
                                                alt={selected.name}
                                                className="relative z-10 w-full h-full object-contain drop-shadow-[0_0_15px_rgba(99,102,241,0.5)]"
                                            />

                                            {/* Decorative Grid overlays */}
                                            <div className="absolute bottom-4 left-0 right-0 h-24 bg-gradient-to-t from-[#0a0a0f] to-transparent z-15" />
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
                                            ? 'w-10 bg-indigo-500'
                                            : 'w-2.5 bg-white/20 hover:bg-white/40'
                                            }`}
                                    />
                                ))}
                            </div>
                        </div>

                        {/* RIGHT: Detailed Information Panel */}
                        <div className="flex-1 w-full flex flex-col gap-3">
                            <AnimatePresence mode="wait">
                                <motion.div
                                    key={selected._id}
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    transition={{ duration: 0.3 }}
                                    className="rounded-[40px] border border-white/5 bg-[#0a0b14]/80 backdrop-blur-3xl shadow-2xl relative overflow-hidden flex flex-col max-h-screen lg:h-[530px]"
                                >
                                    {/* Glass Morph Decoration */}
                                    <div className="absolute -top-20 -right-20 w-40 h-40 bg-indigo-500/10 rounded-full blur-3xl p-4 pointer-events-none" />

                                    {/* Scrollable Content Area */}
                                    <div className="flex-1 overflow-y-auto p-8 lg:p-8 custom-scrollbar relative z-10">
                                        {/* Header Section */}
                                        <div className="flex flex-col gap-6 mb-8">
                                            <div className="flex flex-wrap gap-3">
                                                {(selected.character_type || []).map((type, i) => (
                                                    <span key={i} className="px-4 py-1.5 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-[10px] font-bold tracking-[0.2em] uppercase">
                                                        {type}
                                                    </span>
                                                ))}
                                            </div>

                                            <div>
                                                <h1 className="text-6xl font-black tracking-tighter text-white mb-2 uppercase font-mono">
                                                    {selected.name}
                                                </h1>
                                                <p className="text-indigo-300/60 font-medium italic">
                                                    "{selected.tagline}"
                                                </p>
                                            </div>

                                            {/* Trait Icons */}
                                            <div className="flex flex-wrap gap-8 items-center border-b border-white/5 pb-8">
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
                                            <div className="p-5 rounded-2xl border border-white/5 bg-white/5 group-hover:bg-indigo-500/5 transition-all flex gap-4 items-center">
                                                <div className="w-14 h-14 shrink-0 rounded-xl bg-gradient-to-br from-indigo-700 to-purple-800 flex items-center justify-center shadow-lg transform group-hover:rotate-12 transition-transform">
                                                    <Layers className="w-7 h-7 text-white" />
                                                </div>
                                                <div>
                                                    <h3 className="text-indigo-400 text-xs font-black uppercase tracking-widest mb-1">
                                                        Guide Power: {selected.guide_power?.title || 'Unknown'}
                                                    </h3>
                                                    <p className="text-slate-400 text-sm leading-relaxed max-w-sm">
                                                        {selected.guide_power?.description || 'No power description available.'}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Origin Story Section */}
                                        <div className="mb-10">
                                            <div className="flex items-center gap-3 mb-4">
                                                <div className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
                                                <h2 className="text-xl font-bold bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">Origin Story</h2>
                                            </div>
                                            <div className="text-slate-400 text-sm leading-relaxed space-y-4 max-w-2xl">
                                                {selected.backstory ? (
                                                    <p className="whitespace-pre-line">
                                                        {selected.backstory}
                                                    </p>
                                                ) : (
                                                    <p>History lost in the records of time.</p>
                                                )}
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
                                            {/* Personality */}
                                            <div>
                                                <h3 className="text-slate-500 text-[10px] font-black uppercase tracking-widest mb-4">Personality</h3>
                                                <div className="flex flex-wrap gap-2">
                                                    {(selected.personality || []).map((trait, i) => (
                                                        <span key={i} className="px-4 py-1.5 rounded-full bg-indigo-900/40 text-indigo-300 border border-indigo-500/20 text-xs font-bold transition-all hover:bg-indigo-500 hover:text-white cursor-default">
                                                            {trait}
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>

                                            {/* Starter Bonuses */}
                                            <div>
                                                <h3 className="text-slate-500 text-[10px] font-black uppercase tracking-widest mb-4">Starter Bonus</h3>
                                                <div className="space-y-4">
                                                    <div className="flex items-center gap-3 group/item pointer-events-none">
                                                        <Checkbox checked className="border-yellow-500/50 data-[state=checked]:bg-yellow-500 data-[state=checked]:text-black" />
                                                        <span className="text-xs font-bold text-yellow-500/90 tracking-wide">+{selected.system_bonus?.exp_boost || 15}% Learning EXP</span>
                                                    </div>
                                                    <div className="flex items-center gap-3 group/item pointer-events-none">
                                                        <Checkbox checked className="border-amber-500/50 data-[state=checked]:bg-amber-500 data-[state=checked]:text-black" />
                                                        <span className="text-xs font-bold text-amber-500/90 tracking-wide">+{selected.system_bonus?.gold_boost || 20}% Gold Reward</span>
                                                    </div>
                                                    <div className="flex items-center gap-3 group/item opacity-50 cursor-not-allowed">
                                                        <Checkbox disabled className="border-white/20" />
                                                        <span className="text-xs font-semibold text-white/40">Focus Boost Session</span>
                                                    </div>
                                                    <div className="flex items-center gap-3 group/item opacity-50 cursor-not-allowed">
                                                        <Checkbox disabled className="border-white/20" />
                                                        <span className="text-xs font-semibold text-white/40">Mind Sync</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Quote Box */}
                                        <div className="bg-gradient-to-r from-white/[0.03] to-transparent p-6 rounded-3xl border-l-2 border-indigo-500/50">
                                            <p className="text-lg font-medium text-white leading-snug tracking-tight mb-2">
                                                "{selected.quote || 'Ready for adventure.'}"
                                            </p>
                                            <span className="text-slate-500 text-xs font-bold uppercase tracking-widest">— {selected.name}</span>
                                        </div>
                                    </div>

                                    {/* Footer: Action Buttons (Fixed at Bottom) */}
                                    <div className="p-6 lg:p-8 border-t border-white/5 bg-[#0a0b14]/90 backdrop-blur-xl relative z-20">
                                        <div className="flex flex-col sm:flex-row gap-4">
                                            <button className="px-8 py-4 rounded-2xl bg-white/5 border border-white/10 text-white font-black text-sm uppercase tracking-widest hover:bg-white/10 transition-all active:scale-95 flex-1">
                                                Customize
                                            </button>
                                            <button
                                                onClick={confirmSelection}
                                                className="px-8 py-4 rounded-2xl bg-indigo-600 shadow-[0_0_20px_rgba(79,70,229,0.4)] hover:shadow-[0_0_30px_rgba(79,70,229,0.6)] text-white font-black text-sm uppercase tracking-widest hover:bg-indigo-500 transition-all active:scale-95 flex-1"
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
                            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-xl p-4"
                        >
                            <motion.div
                                initial={{ scale: 0.9, opacity: 0, y: 20 }}
                                animate={{ scale: 1, opacity: 1, y: 0 }}
                                exit={{ scale: 0.9, opacity: 0, y: 20 }}
                                className="bg-[#0f111a] border border-white/10 rounded-[40px] p-8 lg:p-12 max-w-xl w-full text-center relative overflow-hidden"
                            >
                                <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-indigo-500 to-purple-500" />

                                <ScrollText className="w-16 h-16 text-indigo-500 mx-auto mb-6 opacity-30" />

                                <h1 className="text-4xl font-black text-white mb-4 uppercase tracking-tighter">Confirm Character</h1>
                                <p className="text-slate-400 mb-10 leading-relaxed">
                                    Are you ready to begin your journey as <span className="text-indigo-400 font-bold uppercase tracking-wider">{selected.name}</span>? This decision will shape your learning experience at SkillVentura.
                                </p>

                                <div className="flex flex-col sm:flex-row gap-4">
                                    <button
                                        onClick={() => setShowModal(false)}
                                        className="px-8 py-4 rounded-2xl bg-white/5 border border-white/10 text-white font-bold text-sm uppercase flex-1 hover:bg-white/10"
                                    >
                                        I need a moment
                                    </button>
                                    <button
                                        onClick={handleSubmit}
                                        disabled={processing}
                                        className="px-8 py-4 rounded-2xl bg-indigo-600 text-white font-black text-sm uppercase flex-1 shadow-lg hover:bg-indigo-500 flex items-center justify-center gap-2"
                                    >
                                        {processing ? 'Forging Character...' : 'Let\'s Begin'}
                                        <ChevronRight className="w-4 h-4" />
                                    </button>
                                </div>
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            <style>{`
                @font-face {
                    font-family: 'Mono';
                    src: url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600;700&display=swap');
                }
                
                .perspective-1000 {
                    perspective: 1000px;
                }

                @keyframes gradient-xy {
                    0%, 100% {
                        background-position: 0% 0%;
                    }
                    50% {
                        background-position: 100% 100%;
                    }
                }

                .animate-gradient-xy {
                    background-size: 200% 200%;
                    animation: gradient-xy 5s ease infinite;
                }

                .custom-scrollbar::-webkit-scrollbar {
                    width: 5px;
                }

                .custom-scrollbar::-webkit-scrollbar-track {
                    background: transparent;
                }

                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: rgba(99, 102, 241, 0.1);
                    border-radius: 20px;
                }

                .custom-scrollbar:hover::-webkit-scrollbar-thumb {
                    background: rgba(99, 102, 241, 0.4);
                }
            `}</style>
        </>
    );
}
