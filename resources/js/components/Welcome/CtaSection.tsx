import { Users } from 'lucide-react';
import type { LandingPageCommunity } from '@/types/landing-page';

interface Props {
    community?: LandingPageCommunity;
}

export default function CtaSection({ community }: Props = {}) {
    if (community?.is_active === false) {
        return null;
    }

    const title =
        community?.title ||
        'Join Us to Learn Level Up and\nMaster Real-World Tech';
    const buttonText = community?.button_text || 'Join Community';
    const discordUrl = community?.discord_url || 'https://discord.gg/yourlink';

    return (
        <section className="relative mt-[-20px] py-4">
            {/* Outer Glows */}
            <div className="pointer-events-none absolute top-[-70px] left-39 z-0">
                <div className="h-[200px] w-[200px] rounded-full bg-blue-800 blur-[70px]"></div>
            </div>
            <div className="pointer-events-none absolute right-20 -bottom-10 z-0">
                <div className="h-[200px] w-[200px] rounded-full bg-blue-800 blur-[70px]"></div>
            </div>

            <div className="relative z-10 container mx-auto flex justify-center px-4 sm:px-6">
                {/* CTA Card */}
                <div className="relative flex min-h-[160px] w-full max-w-[990px] flex-col items-center justify-center rounded-tl-[60px] rounded-tr-[16px] rounded-br-[60px] rounded-bl-[16px] border border-cyan-400/40 bg-[#1D215D] px-5 py-8 text-center shadow-2xl sm:rounded-tl-[120px] sm:rounded-br-[120px] sm:px-8 sm:py-10 md:min-h-[200px] md:rounded-tl-[370px] md:rounded-tr-[20px] md:rounded-br-[370px] md:rounded-bl-[20px] md:px-10 md:py-12 lg:min-h-[240px] lg:px-12">
                    <h2
                        className="max-w-[650px] text-xs leading-relaxed font-bold whitespace-pre-line text-white sm:text-lg sm:leading-tight md:text-2xl lg:text-3xl xl:text-4xl"
                        style={{ fontFamily: 'Orbitron' }}
                    >
                        {title}
                    </h2>

                    <a
                        href={discordUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="mt-4 inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-purple-500 via-violet-500 to-blue-500 px-4 py-2.5 text-xs font-bold text-white shadow-lg transition hover:scale-105 sm:mt-5 sm:px-6 sm:py-3 sm:text-sm md:px-8 md:py-4 md:text-base"
                        style={{ fontFamily: 'Orbitron' }}
                    >
                        {buttonText} <Users className="h-4 w-4 sm:h-5 sm:w-5" />
                    </a>
                </div>
            </div>
        </section>
    );
}
