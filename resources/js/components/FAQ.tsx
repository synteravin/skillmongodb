import { useState } from 'react';

export default function FAQ() {
    const [open, setOpen] = useState<number | null>(null);

    const data = [
        'What is Skill Ventura?',
        'Do I need experience?',
        'Is there a learning roadmap?',
    ];

    return (
        <section className="py-24">
            <div className="mx-auto max-w-3xl px-6">
                <h2 className="mb-16 text-center text-4xl font-bold">
                    Frequently Asked Questions
                </h2>

                <div className="space-y-4">
                    {data.map((q, i) => (
                        <div
                            key={i}
                            className="rounded-lg border border-gray-200 p-6 dark:border-white/10"
                        >
                            <button
                                onClick={() => setOpen(open === i ? null : i)}
                                className="flex w-full items-center justify-between text-left font-semibold"
                            >
                                {q}

                                <span className="text-lg">
                                    {open === i ? '-' : '+'}
                                </span>
                            </button>

                            {open === i && (
                                <p className="mt-4 text-sm text-gray-600 dark:text-gray-300">
                                    Skill Ventura adalah platform pembelajaran
                                    berbasis gamification yang membantu
                                    meningkatkan skill melalui roadmap,
                                    challenge, dan project nyata.
                                </p>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
