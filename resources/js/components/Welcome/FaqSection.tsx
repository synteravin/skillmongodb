import { useState } from 'react';
import { ChevronRight } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';

export default function FaqSection() {
    const [openFaq, setOpenFaq] = useState<number | null>(null);

    const toggleFaq = (index: number) => {
        setOpenFaq(openFaq === index ? null : index);
    };

    return (
        <section className="relative py-16 md:py-24 2xl:py-32">
            <div className="container mx-auto max-w-4xl px-6">
                {/* Title */}
                <h2 className="mb-16 text-center text-4xl font-black">
                    <span className="text-[#3B28F6]">Frequently Asked </span>
                    <span className="text-[#FACC15]">Questions</span>
                </h2>

                {/* FAQ List */}
                <div className="flex flex-col border border-[#3c418a]">
                    {[
                        'What is SKILL VENTURA and how does it work?',
                        'Do I need prior experience to start learning?',
                        'Are the lessons designed for beginners?',
                        'How does the gamified learning system work?',
                        'What Skills can I learn on SKILL VENTURA?',
                        'Is there a structured learning roadmap to follow?',
                        'How do missions and challenges help me improve?',
                        'Do I earn XP or rewards as I complete tasks?',
                        'Can I learn at my own pace?',
                        'Does SKILL VENTURA provide a structured learning roadmap?',
                    ].map((q, i) => (
                        <div
                            key={i}
                            className="border-b border-[#3c418a] last:border-none"
                        >
                            <button
                                onClick={() => toggleFaq(i)}
                                className="flex w-full items-center justify-between bg-[#1D215D] px-6 py-5 text-left text-white transition-all"
                            >
                                <div className="flex items-center gap-4">
                                    {/* Yellow Dot */}
                                    <div className="h-4 w-4 rounded-full bg-yellow-400" />

                                    <span className="font-medium tracking-wide">
                                        {q}
                                    </span>
                                </div>

                                {/* Arrow */}
                                <ChevronRight
                                    className={`transition-transform duration-300 ${
                                        openFaq === i
                                            ? 'rotate-90 text-white'
                                            : 'text-white'
                                    }`}
                                />
                            </button>

                            <AnimatePresence>
                                {openFaq === i && (
                                    <motion.div
                                        initial={{
                                            height: 0,
                                            opacity: 0,
                                        }}
                                        animate={{
                                            height: 'auto',
                                            opacity: 1,
                                        }}
                                        exit={{ height: 0, opacity: 0 }}
                                        className="overflow-hidden bg-[#1D215D]"
                                    >
                                        <div className="px-14 pt-2 pb-6 text-sm leading-relaxed text-gray-200">
                                            Yes, Skill Ventura offers a
                                            comprehensive learning experience
                                            tailored to your needs. We combine
                                            theory with practice in a fun,
                                            engaging way.
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
