import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Layers, Sword, Trophy, MessageSquare } from 'lucide-react';

// 4 Pillar Subcomponents (Acuan Fitur Student)
import SkillTreeTab from './Gamified/SkillTreeTab';
import QuestTab from './Gamified/QuestTab';
import TierListTab from './Gamified/TierListTab';
import ForumTab from './Gamified/ForumTab';

export default function GamifiedMapSection() {
    const [activeTab, setActiveTab] = useState<string>('skill-tree');

    const tabs = [
        {
            id: 'skill-tree',
            label: 'Pick Your Skill Tree',
            icon: Layers,
        },
        {
            id: 'quest-board',
            label: 'Quest',
            icon: Sword,
        },
        {
            id: 'tier-list',
            label: 'Tier List',
            icon: Trophy,
        },
        {
            id: 'forum-diskusi',
            label: 'Forum Diskusi',
            icon: MessageSquare,
        },
    ];

    return (
        <section
            id="learn"
            className="relative flex w-full items-center justify-center py-12 md:py-20 lg:py-28 transition-colors duration-300"
        >
            {/* Ambient Background Glows */}
            <div className="pointer-events-none absolute top-16 -left-12 z-0">
                <div className="h-[250px] w-[250px] rounded-full bg-blue-800 blur-[75px]" />
            </div>
            <div className="pointer-events-none absolute top-1/2 -right-14 z-0 -translate-y-1/2">
                <div className="h-[240px] w-[240px] rounded-full bg-blue-800 blur-[75px]" />
            </div>
            <div className="pointer-events-none absolute bottom-16 left-10 z-0">
                <div className="h-[220px] w-[220px] rounded-full bg-blue-800 blur-[70px]" />
            </div>

            <div className="container mx-auto px-4 sm:px-6 md:px-8 lg:px-12">
                {/* Main Gamified Card Container */}
                <div className="relative mx-auto flex w-full max-w-6xl flex-col justify-between rounded-3xl border border-slate-200/90 bg-white/95 p-6 text-slate-900 shadow-[0_20px_60px_rgba(15,23,42,0.08)] backdrop-blur-md transition-all duration-300 sm:p-8 md:p-10 lg:p-12 dark:border-blue-500/30 dark:bg-[#0c0f33] dark:text-white dark:shadow-[0_15px_50px_rgba(0,0,0,0.35)]">
                    {/* Header */}
                    <div className="mb-8 text-center">
                        <h2 className="mb-2.5 font-['Orbitron'] text-2xl font-black tracking-wide text-slate-900 sm:text-3xl md:text-4xl dark:text-white">
                            Gamified Learning for Every Skill Level
                        </h2>
                        <p className="mx-auto max-w-2xl font-['Oxanium'] text-xs text-slate-600 sm:text-sm dark:text-slate-300">
                            Jelajahi ekosistem pembelajaran VENTURA: dari skill tree terstruktur, quest industri berbayar, kompetisi rank, hingga forum kolaborasi.
                        </p>
                    </div>

                    {/* Tabs Switcher */}
                    <div className="mb-8 flex justify-center border-b border-slate-200 pb-4 dark:border-white/10">
                        <div className="flex flex-wrap justify-center gap-1.5 sm:gap-2 md:flex-nowrap md:gap-3 lg:gap-4">
                            {tabs.map((tab) => {
                                const isActive = activeTab === tab.id;
                                const TabIcon = tab.icon;

                                return (
                                    <button
                                        key={tab.id}
                                        onClick={() => setActiveTab(tab.id)}
                                        className={`group relative flex items-center gap-1.5 rounded-xl px-2.5 py-1.5 font-['Orbitron'] text-[10px] font-bold tracking-wider uppercase transition-all duration-300 focus:outline-none sm:gap-2 sm:px-4 sm:py-2.5 sm:text-xs md:text-xs lg:px-5 lg:tracking-widest ${
                                            isActive
                                                ? 'border-b-2 border-yellow-500 bg-blue-50 text-blue-900 shadow-sm dark:border-yellow-400 dark:bg-[#252a6a]/80 dark:text-white dark:shadow-[inset_0_0_12px_rgba(59,130,246,0.35)]'
                                                : 'text-slate-500 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-white/5 dark:hover:text-white'
                                        }`}
                                    >
                                        <TabIcon
                                            size={14}
                                            className={
                                                isActive
                                                    ? 'text-yellow-500 dark:text-yellow-400'
                                                    : 'text-slate-400 group-hover:text-slate-700 dark:text-slate-400 dark:group-hover:text-white'
                                            }
                                        />
                                        <span className="whitespace-nowrap">{tab.label}</span>
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* Dynamic Content Area */}
                    <div className="relative flex min-h-[520px] flex-1 flex-col justify-center overflow-hidden rounded-2xl border border-slate-200/90 bg-slate-50/70 p-3 sm:p-5 md:p-6 dark:border-white/10 dark:bg-[#07091d]/90">
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={activeTab}
                                initial={{ opacity: 0, y: 12 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -12 }}
                                transition={{ duration: 0.25 }}
                                className="h-full w-full"
                            >
                                {activeTab === 'skill-tree' && <SkillTreeTab />}
                                {activeTab === 'quest-board' && <QuestTab />}
                                {activeTab === 'tier-list' && <TierListTab />}
                                {activeTab === 'forum-diskusi' && <ForumTab />}
                            </motion.div>
                        </AnimatePresence>
                    </div>
                </div>
            </div>
        </section>
    );
}
