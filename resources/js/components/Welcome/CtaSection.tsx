import { Users } from 'lucide-react';

export default function CtaSection() {
    return (
        <section className="relative mt-[-20px] py-4">
            {/* Outer Glows */}
            <div className="pointer-events-none absolute top-[-70px] left-39 z-0">
                <div className="h-[200px] w-[200px] rounded-full bg-blue-800 blur-[70px]"></div>
            </div>
            <div className="pointer-events-none absolute -bottom-10 right-20 z-0">
                <div className="h-[200px] w-[200px] rounded-full bg-blue-800 blur-[70px]"></div>
            </div>

            <div className="relative z-10 container mx-auto flex justify-center px-4 sm:px-6">
                {/* CTA Card */}
                <div className="relative flex min-h-[160px] w-full max-w-[990px] flex-col items-center justify-center rounded-tl-[60px] rounded-tr-[16px] rounded-br-[60px] rounded-bl-[16px] border border-cyan-400/40 bg-[#1D215D] px-5 py-8 text-center shadow-2xl sm:rounded-tl-[120px] sm:rounded-br-[120px] sm:px-8 sm:py-10 md:min-h-[200px] md:rounded-tl-[370px] md:rounded-tr-[20px] md:rounded-br-[370px] md:rounded-bl-[20px] md:px-10 md:py-12 lg:min-h-[240px] lg:px-12">
                    <h2
                        className="max-w-[650px] text-xs leading-relaxed font-bold text-white sm:text-lg sm:leading-tight md:text-2xl lg:text-3xl xl:text-4xl"
                        style={{ fontFamily: 'Orbitron' }}
                    >
                        Join Us to Learn Level Up and{' '}
                        <br className="hidden sm:inline" />
                        Master Real-World Tech
                    </h2>

                    <button
                        onClick={() =>
                            (window.location.href =
                                'https://discord.gg/yourlink')
                        }
                        className="mt-4 flex items-center gap-2 rounded-xl bg-gradient-to-r from-purple-500 via-violet-500 to-blue-500 px-4 py-2.5 text-xs font-bold text-white shadow-lg transition hover:scale-105 sm:mt-5 sm:px-6 sm:py-3 sm:text-sm md:px-8 md:py-4 md:text-base"
                        style={{ fontFamily: 'Orbitron' }}
                    >
                        Join Community <Users className="h-4 w-4 sm:h-5 sm:w-5" />
                    </button>
                </div>
            </div>
        </section>
    );
}
