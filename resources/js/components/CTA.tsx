import { Users } from 'lucide-react';

export default function CTA() {
    return (
        <section className="py-16">
            <div className="mx-auto max-w-4xl px-6 text-center">
                <div className="rounded-3xl border border-white bg-[#1D215D] p-10 text-white shadow-2xl">
                    <h2 className="text-3xl font-bold">
                        Join Us and Level Up Your Skills
                    </h2>

                    <p className="mt-4 text-gray-300">
                        Learn through gamified missions and real-world projects.
                    </p>

                    <button
                        onClick={() =>
                            (window.location.href = 'https://discord.gg/')
                        }
                        className="mt-6 inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-purple-500 to-blue-500 px-6 py-3 font-bold"
                    >
                        Join Community <Users size={18} />
                    </button>
                </div>
            </div>
        </section>
    );
}
