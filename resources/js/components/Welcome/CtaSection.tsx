import { Users } from 'lucide-react';

export default function CtaSection() {
    return (
        <section className="relative mt-[-20px] py-4">
            {/* Outer Glow */}
            <div className="pointer-events-none absolute top-[-70px] left-39">
                <div className="h-[200px] w-[200px] animate-pulse rounded-full bg-blue-800 blur-[70px]"></div>
            </div>

            <div className="relative z-10 container mx-auto flex justify-center px-4 sm:px-6">
                {/* CTA Card */}
                <div className="relative flex min-h-[180px] w-full max-w-[990px] flex-col items-center justify-center rounded-tl-[370px] rounded-tr-[20px] rounded-br-[370px] rounded-bl-[20px] border border-white bg-[#1D215D] px-6 py-8 text-center shadow-2xl sm:px-8 md:min-h-[200px] md:px-10 md:py-10 lg:min-h-[240px] lg:px-12">
                    <h2
                        className="max-w-[650px] text-lg leading-tight font-bold text-white sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl"
                        style={{ fontFamily: 'Orbitron' }}
                    >
                        Join Us to Learn Level Up and <br />
                        Master Real-World Tech Skills
                    </h2>

                    <button
                        onClick={() =>
                            (window.location.href =
                                'https://discord.gg/yourlink')
                        }
                        className="mt-4 flex items-center gap-2 rounded-xl bg-gradient-to-r from-purple-500 via-violet-500 to-blue-500 px-5 py-2 font-bold text-white shadow-lg transition hover:scale-105 sm:px-6 sm:py-3 md:mt-5 md:px-8 md:py-4"
                        style={{ fontFamily: 'Orbitron' }}
                    >
                        Join Community <Users size={20} />
                    </button>
                </div>
            </div>
        </section>
    );
}
