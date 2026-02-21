import { Head, router } from '@inertiajs/react';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface Character {
    _id: string;
    name: string;
    avatar: string;
    backstory: string;
}

interface Props {
    characters: Character[];
}

export default function SelectCharacter({ characters }: Props) {
    const [selected, setSelected] = useState<Character | null>(null);
    const [showModal, setShowModal] = useState(false);
    const [processing, setProcessing] = useState(false);

    const handleSelect = (character: Character) => {
        setSelected(character);
    };

    const confirmSelection = () => {
        if (!selected) return;
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

    return (
        <>
            <Head title="Select Your Character" />

            <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-900 px-6 py-5">
                {/* Glow Background */}
                <div className="pointer-events-none absolute inset-0 opacity-30">
                    <div className="absolute -top-40 -left-40 h-[500px] w-[500px] rounded-full bg-indigo-600 blur-3xl" />
                    <div className="absolute right-0 bottom-0 h-[500px] w-[500px] rounded-full bg-purple-600 blur-3xl" />
                </div>

                <div className="relative z-10 mx-auto max-w-7xl">
                    {/* Title */}
                    <div className="mb-5 text-center">
                        <h1 className="text-4xl font-bold text-white md:text-5xl">
                            Choose Your Character
                        </h1>
                        <p className="mt-3 text-slate-400">
                            Your journey begins with a single choice.
                        </p>
                    </div>

                    {/* Grid */}
                    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                        {characters.map((character) => {
                            const isActive = selected?._id === character._id;

                            return (
                                <motion.div
                                    key={character._id}
                                    whileHover={{ scale: 1.05 }}
                                    transition={{
                                        type: 'spring',
                                        stiffness: 200,
                                    }}
                                    onClick={() => handleSelect(character)}
                                    className={`relative cursor-pointer rounded-3xl border p-8 backdrop-blur-xl transition-all duration-300 ${
                                        isActive
                                            ? 'border-indigo-500 bg-indigo-500/10 shadow-2xl shadow-indigo-500/30'
                                            : 'border-white/10 bg-white/5 hover:border-indigo-400 hover:bg-white/10'
                                    }`}
                                >
                                    {/* SELECT ICON INDICATOR */}
                                    {isActive && (
                                        <div className="absolute top-5 right-5">
                                            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg">
                                                ✓
                                            </div>
                                        </div>
                                    )}

                                    {/* Avatar */}
                                    <div className="flex justify-center">
                                        <div className="relative">
                                            <img
                                                src={character.avatar}
                                                alt={character.name}
                                                className="h-32 w-22 object-cover drop-shadow-2xl"
                                            />

                                            {isActive && (
                                                <div className="absolute inset-0 animate-pulse rounded-full ring-4 ring-indigo-500 ring-offset-2 ring-offset-slate-900" />
                                            )}
                                        </div>
                                    </div>

                                    {/* Name */}
                                    <h2 className="mt-6 text-center text-2xl font-semibold text-white">
                                        {character.name}
                                    </h2>

                                    {/* Backstory */}
                                    <p className="mt-4 text-center text-xs leading-relaxed text-slate-400">
                                        {character.backstory}
                                    </p>

                                    {/* Bottom highlight line */}
                                    {isActive && (
                                        <div className="absolute bottom-0 left-0 h-1 w-full rounded-b-3xl bg-gradient-to-r from-indigo-600 to-purple-600" />
                                    )}
                                </motion.div>
                            );
                        })}
                    </div>

                    {/* Button */}
                    <div className="mt-4 text-center">
                        <button
                            disabled={!selected}
                            onClick={confirmSelection}
                            className={`rounded-2xl px-10 py-4 text-sm font-semibold transition-all ${
                                selected
                                    ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-xl hover:scale-105'
                                    : 'cursor-not-allowed bg-slate-700 text-slate-400'
                            }`}
                        >
                            Begin Adventure
                        </button>
                    </div>
                </div>

                {/* ================= MODAL ================= */}
                <AnimatePresence>
                    {showModal && selected && (
                        <motion.div
                            key="modal"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4 backdrop-blur-lg"
                        >
                            <motion.div
                                initial={{ scale: 0.8, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                exit={{ scale: 0.8, opacity: 0 }}
                                transition={{ type: 'spring', stiffness: 200 }}
                                className="w-full max-w-md rounded-3xl border border-white/10 bg-white/10 p-8 shadow-2xl backdrop-blur-xl"
                            >
                                <div className="text-center">
                                    <h3 className="text-2xl font-bold text-white">
                                        Confirm Your Hero
                                    </h3>

                                    {/* <div className="mt-6 flex justify-center">
                                        <img
                                            src={selected.avatar}
                                            alt={selected.name}
                                            className="h-24 w-24 rounded-full shadow-xl"
                                        />
                                    </div> */}

                                    <p className="mt-4 text-slate-300">
                                        You have chosen{' '}
                                        <span className="font-semibold text-indigo-400">
                                            {selected.name}
                                        </span>
                                    </p>

                                    <p className="mt-2 text-sm text-slate-400">
                                        This choice cannot be changed later.
                                    </p>

                                    <div className="mt-8 flex gap-4">
                                        <button
                                            onClick={() => setShowModal(false)}
                                            className="flex-1 rounded-xl bg-slate-700 py-3 text-sm text-slate-300 hover:bg-slate-600"
                                        >
                                            Cancel
                                        </button>

                                        <button
                                            onClick={handleSubmit}
                                            disabled={processing}
                                            className="flex-1 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 py-3 text-sm font-semibold text-white shadow-lg hover:opacity-90"
                                        >
                                            {processing
                                                ? 'Entering World...'
                                                : 'Confirm'}
                                        </button>
                                    </div>
                                </div>
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </>
    );
}
