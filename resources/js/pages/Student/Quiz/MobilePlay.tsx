import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, MoreHorizontal, Flag } from 'lucide-react';
import { router } from '@inertiajs/react';

interface MobilePlayProps {
    quiz: any;
    has_submitted: boolean;
    user_stats: {
        level: number;
        xp: number;
        exp_max: number;
        gold: number;
    };
    current: number;
    setCurrent: (val: number) => void;
    answers: any[];
    setAnswers: (val: any[]) => void;
    selected: string | null;
    setSelected: (val: string | null) => void;
    loading: boolean;
    next: () => void;
    handleBack: () => void;
}

const AnswerButton = ({ label, text, selected, onClick }: any) => {
    return (
        <motion.button
            whileTap={{ scale: 0.98 }}
            onClick={onClick}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg border text-left transition-all duration-300 ${
                selected
                    ? 'bg-[#151c38] border-yellow-400 shadow-[0_0_12px_rgba(250,204,21,0.25)]'
                    : 'bg-[#0d1222] border-[#1e293b] hover:border-[#3B28F6] hover:bg-[#121829]'
            }`}
        >
            <div
                className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-bold transition-all duration-300 ${
                    selected ? 'bg-yellow-400 text-black' : 'bg-[#3B28F6] text-white'
                }`}
            >
                {label}
            </div>
            <span
                className={`text-sm font-semibold transition-colors duration-300 ${
                    selected ? 'text-yellow-400' : 'text-gray-300'
                }`}
            >
                {text}
            </span>
        </motion.button>
    );
};

const QuestionBox = ({ question, isLandscape }: { question: any; isLandscape: boolean }) => {
    return (
        <div className={`flex flex-col gap-3 min-h-0 w-full ${isLandscape ? 'h-full overflow-y-auto pr-1' : ''}`}>
            {question.media_url && (
                <div className="flex-shrink-0 w-full bg-white rounded-xl p-2 border border-slate-700/50 flex items-center justify-center overflow-hidden">
                    <img
                        src={question.media_url}
                        alt="Question media"
                        className="max-h-[140px] sm:max-h-[180px] w-auto object-contain"
                    />
                </div>
            )}
            <div className="text-sm sm:text-base font-semibold leading-relaxed text-gray-200 select-none">
                {question.question_text}
            </div>
        </div>
    );
};

const NavigationFooter = ({
    current,
    total,
    selected,
    loading,
    handleBack,
    next,
}: {
    current: number;
    total: number;
    selected: boolean;
    loading: boolean;
    handleBack: () => void;
    next: () => void;
}) => {
    return (
        <div className="flex items-center justify-between gap-3 w-full mt-auto pt-4 bg-[#04080f]/95">
            {/* BACK BUTTON */}
            <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={handleBack}
                disabled={current === 0}
                className={`flex-1 flex items-center justify-center py-2 px-3 border border-[#3B28F6]/80 text-white font-['Orbitron'] font-bold text-xs rounded transition-all duration-300 ${
                    current === 0 ? 'opacity-30 cursor-not-allowed' : 'hover:bg-[#3B28F6]/20'
                }`}
            >
                &lt;&lt; BACK
            </motion.button>

            {/* COUNTER */}
            <div className="flex-shrink-0 flex items-center justify-center px-4 py-2 border border-yellow-400/80 font-['Orbitron'] text-xs font-bold text-yellow-400 rounded">
                {String(current + 1).padStart(2, '0')}
                <span className="mx-1 opacity-50">/</span>
                {String(total).padStart(2, '0')}
            </div>

            {/* NEXT / FINISH BUTTON */}
            <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={next}
                disabled={!selected || loading}
                className={`flex-1 flex items-center justify-center py-2 px-3 border border-yellow-400 bg-yellow-400 text-black font-['Orbitron'] font-bold text-xs rounded transition-all duration-300 ${
                    !selected || loading ? 'opacity-40 cursor-not-allowed' : 'hover:bg-yellow-300'
                }`}
            >
                {loading ? '...' : current + 1 === total ? (
                    <span className="flex items-center gap-1">
                        FINISH <Flag className="h-3 w-3 text-black" strokeWidth={3} />
                    </span>
                ) : 'NEXT >>'}
            </motion.button>
        </div>
    );
};

export default function MobilePlay({
    quiz,
    has_submitted,
    user_stats,
    current,
    setCurrent,
    answers,
    setAnswers,
    selected,
    setSelected,
    loading,
    next,
    handleBack,
}: MobilePlayProps) {
    const [isLandscape, setIsLandscape] = useState(false);

    useEffect(() => {
        const checkOrientation = () => {
            setIsLandscape(window.innerWidth > window.innerHeight);
        };
        checkOrientation();
        window.addEventListener('resize', checkOrientation);
        return () => window.removeEventListener('resize', checkOrientation);
    }, []);

    const handleExit = () => {
        router.visit(`/student/courses/${quiz.course_slug}`);
    };

    if (!quiz?.questions?.length) return null;
    const question = quiz.questions[current];
    const total = quiz.questions.length;
    const labels = ['A', 'B', 'C', 'D', 'E'];

    // RENDERING PORTRAIT
    if (!isLandscape) {
        return (
            <div className="flex h-screen flex-col overflow-hidden bg-[#04080f] font-['Rajdhani',sans-serif] text-white">
                {/* Header (EXP & Gold) */}
                <header className="flex-shrink-0 flex items-center justify-between px-4 py-3 bg-[#0a0f1d] border-b border-[#3B28F6]/20">
                    
                    
                    <div className="flex items-center gap-3">
                        {/* EXP Progress Bar */}
                        <div className="flex items-center gap-2 bg-[#121829] px-2.5 py-1 rounded-full border border-blue-500/30">
                            <span className="text-[10px] font-['Orbitron'] font-black text-blue-400">LV.{user_stats.level}</span>
                            <div className="h-1.5 w-16 bg-slate-800 rounded-full overflow-hidden">
                                <div 
                                    className="h-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-500" 
                                    style={{ width: `${(user_stats.xp / user_stats.exp_max) * 100}%` }}
                                />
                            </div>
                            <span className="text-[9px] font-mono text-gray-400">{user_stats.xp}/{user_stats.exp_max}</span>
                        </div>
                        {/* Gold Coin */}
                        <div className="flex items-center gap-1 bg-[#121829] px-2.5 py-1 rounded-full border border-yellow-500/30">
                            <img src="/images/Gold.webp" className="h-4.5 w-4.5 object-contain" alt="Gold" />
                            <span className="text-[10px] font-['Orbitron'] font-bold text-yellow-400">{user_stats.gold.toLocaleString()}</span>
                        </div>
                    </div>

                    <button className="p-2 -mr-2 text-white opacity-60 hover:opacity-100 transition-opacity">
                        <MoreHorizontal className="h-6 w-6" />
                    </button>
                </header>

                {/* Main Content Area */}
                <main className="flex-1 flex flex-col min-h-0 overflow-y-auto px-4 py-4 gap-4">
                    {/* Question Box */}
                    <div className="flex-shrink-0">
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={question.id}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                transition={{ duration: 0.25 }}
                            >
                                <QuestionBox question={question} isLandscape={false} />
                            </motion.div>
                        </AnimatePresence>
                    </div>

                    {/* Answers Options */}
                    <div className="flex-1 flex flex-col gap-2.5 pb-4">
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={question.id + '-answers'}
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                transition={{ duration: 0.25 }}
                                className="flex flex-col gap-2.5"
                            >
                                {question.answers.map((a: any, idx: number) => (
                                    <AnswerButton
                                        key={a.id}
                                        label={labels[idx] ?? String(idx + 1)}
                                        text={a.answer_text}
                                        selected={selected === a.id}
                                        onClick={() => setSelected(a.id)}
                                    />
                                ))}
                            </motion.div>
                        </AnimatePresence>
                    </div>
                </main>

                {/* Navigation Footer */}
                <footer className="flex-shrink-0 px-4 pb-4 bg-[#04080f]">
                    <NavigationFooter
                        current={current}
                        total={total}
                        selected={selected !== null}
                        loading={loading}
                        handleBack={handleBack}
                        next={next}
                    />
                </footer>
            </div>
        );
    }

    // RENDERING LANDSCAPE
    return (
        <div className="flex h-screen w-screen overflow-hidden bg-[#04080f] font-['Rajdhani',sans-serif] text-white">
            {/* Left Sidebar */}
            <aside className="w-14 shrink-0 flex flex-col items-center justify-between py-4 border-r border-[#3B28F6]/20 bg-[#070b18]">
                

                {/* Stats stacked vertically */}
                <div className="flex flex-col items-center gap-5">
                    {/* Gold */}
                    <div className="flex flex-col items-center gap-1">
                        <img src="/images/Gold.webp" className="h-5 w-5 object-contain" alt="Gold" />
                        <span className="text-[10px] font-['Orbitron'] font-bold text-yellow-400">{user_stats.gold.toLocaleString()}</span>
                    </div>

                    {/* EXP/Level */}
                    <div className="flex flex-col items-center gap-1">
                        <div className="flex h-7 w-7 items-center justify-center rounded-full border border-blue-500/50 bg-[#121829] text-[10px] font-['Orbitron'] font-black text-blue-400">
                            L{user_stats.level}
                        </div>
                        <span className="text-[8px] font-mono text-gray-400">{user_stats.xp}/{user_stats.exp_max}</span>
                    </div>
                </div>

                <button className="p-2 text-white opacity-60 hover:opacity-100 transition-opacity">
                    <MoreHorizontal className="h-6 w-6" />
                </button>
            </aside>

            {/* Split Main Content Area */}
            <main className="flex-1 flex min-h-0 w-full overflow-hidden p-4 gap-4">
                {/* Column 1 (Left): Question Box */}
                <div className="flex-1 flex flex-col min-h-0 w-1/2 overflow-hidden border border-[#3B28F6]/10 bg-[#060a16] p-4 rounded-xl shadow-lg">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={question.id}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 10 }}
                            transition={{ duration: 0.25 }}
                            className="h-full"
                        >
                            <QuestionBox question={question} isLandscape={true} />
                        </motion.div>
                    </AnimatePresence>
                </div>

                {/* Column 2 (Right): Answers + Navigation */}
                <div className="flex-1 flex flex-col min-h-0 w-1/2 justify-between">
                    {/* Options list scrollable */}
                    <div className="flex-1 overflow-y-auto pr-1 flex flex-col gap-2 [scrollbar-width:thin] [scrollbar-color:#3B28F6_#0d0d1a] [&::-webkit-scrollbar]:w-[4px] [&::-webkit-scrollbar-thumb]:bg-[#3B28F6]">
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={question.id + '-answers-landscape'}
                                initial={{ opacity: 0, x: 10 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -10 }}
                                transition={{ duration: 0.25 }}
                                className="flex flex-col gap-2"
                            >
                                {question.answers.map((a: any, idx: number) => (
                                    <AnswerButton
                                        key={a.id}
                                        label={labels[idx] ?? String(idx + 1)}
                                        text={a.answer_text}
                                        selected={selected === a.id}
                                        onClick={() => setSelected(a.id)}
                                    />
                                ))}
                            </motion.div>
                        </AnimatePresence>
                    </div>

                    {/* Bottom Navigation Row */}
                    <div className="shrink-0">
                        <NavigationFooter
                            current={current}
                            total={total}
                            selected={selected !== null}
                            loading={loading}
                            handleBack={handleBack}
                            next={next}
                        />
                    </div>
                </div>
            </main>
        </div>
    );
}
