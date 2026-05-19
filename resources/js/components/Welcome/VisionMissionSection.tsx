import { Sparkles } from 'lucide-react';

export default function VisionMissionSection() {
    return (
        <section className="relative -mt-24 py-12 md:py-20 lg:-mt-34 lg:py-24 2xl:py-32">
            <div className="relative z-10 container mx-auto px-4 md:px-6">
                <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2 lg:gap-16">
                    {/* ================= MOBILE TITLE (SM ONLY) ================= */}
                    <div className="mt-10 flex justify-center md:hidden">
                        <div className="relative flex items-center justify-center">
                            <Sparkles className="absolute -top-7 h-8 w-8 animate-pulse text-purple-400 drop-shadow-[0_0_16px_rgba(168,85,247,1)] drop-shadow-[0_0_32px_rgba(96,165,250,1)]" />
                            <Sparkles className="absolute -left-9 h-7 w-7 animate-pulse text-blue-400 drop-shadow-[0_0_16px_rgba(96,165,250,1)] drop-shadow-[0_0_32px_rgba(168,85,247,1)]" />

                            <h2
                                className="bg-gradient-to-r from-purple-500 via-violet-400 to-blue-500 bg-clip-text px-4 text-3xl font-bold text-transparent drop-shadow-[0_0_18px_rgba(168,85,247,0.9)] drop-shadow-[0_0_30px_rgba(96,165,250,0.9)]"
                                style={{ fontFamily: 'Orbitron' }}
                            >
                                Vision & Mission
                            </h2>

                            <Sparkles className="absolute -right-9 h-7 w-7 animate-pulse text-purple-400 drop-shadow-[0_0_16px_rgba(168,85,247,1)] drop-shadow-[0_0_32px_rgba(96,165,250,1)]" />
                            <Sparkles className="absolute -bottom-7 h-8 w-8 animate-pulse text-blue-400 drop-shadow-[0_0_16px_rgba(96,165,250,1)] drop-shadow-[0_0_32px_rgba(168,85,247,1)]" />
                        </div>
                    </div>

                    {/* ================= LEFT : CIRCLE AREA ================= */}
                    <div className="relative hidden items-center justify-center md:flex lg:-translate-x-16">
                        {/* ================= ARROWS ================= */}
                        <div className="pointer-events-none absolute inset-0 z-50 hidden lg:block">
                            {/* ---------- ARROW 1 ---------- */}
                            {/* curve */}
                            <img
                                src="/images/arrow/curve1-black.webp"
                                className="absolute top-[26px] right-[135px] w-[26px] rotate-[0deg] lg:top-[28px] lg:right-[110px] lg:w-[30px] lg:rotate-[-2deg] xl:top-[37px] xl:right-[160px] xl:w-[33px] xl:rotate-[-2deg] 2xl:top-[38px] 2xl:right-[200px] 2xl:w-[38px] 2xl:rotate-[0deg] dark:hidden"
                            />

                            <img
                                src="/images/arrow/curve1.webp"
                                className="absolute top-[26px] right-[135px] hidden w-[26px] rotate-[0deg] lg:top-[28px] lg:right-[110px] lg:w-[30px] lg:rotate-[-2deg] xl:top-[37px] xl:right-[160px] xl:w-[33px] xl:rotate-[-2deg] 2xl:top-[38px] 2xl:right-[200px] 2xl:w-[38px] 2xl:rotate-[0deg] dark:block"
                            />

                            {/* arrow */}
                            <img
                                src="/images/arrow/arrow1-black.webp"
                                className="absolute -top-[30px] right-[35px] w-[110px] rotate-[13deg] lg:-top-[44px] lg:right-[11px] lg:w-[125px] lg:rotate-[7deg] xl:-top-[39px] xl:right-[37px] xl:w-[145px] xl:rotate-[13deg] 2xl:-top-[48px] 2xl:right-[63px] 2xl:w-[165px] 2xl:rotate-[13deg] dark:hidden"
                            />

                            <img
                                src="/images/arrow/arrow1.webp"
                                className="absolute -top-[30px] right-[35px] hidden w-[110px] rotate-[13deg] lg:-top-[44px] lg:right-[11px] lg:w-[125px] lg:rotate-[7deg] xl:-top-[39px] xl:right-[37px] xl:w-[145px] xl:rotate-[13deg] 2xl:-top-[48px] 2xl:right-[63px] 2xl:w-[165px] 2xl:rotate-[13deg] dark:block"
                            />

                            {/* ---------- ARROW 2 ---------- */}
                            {/* curve */}
                            <img
                                src="/images/arrow/curve1-black.webp"
                                className="absolute right-[120px] bottom-[115px] w-[26px] rotate-[20deg] lg:right-[89px] lg:bottom-[127px] lg:w-[29px] xl:right-[138px] xl:bottom-[145px] xl:w-[33px] 2xl:right-[175px] 2xl:bottom-[163px] 2xl:w-[38px] dark:hidden"
                            />

                            <img
                                src="/images/arrow/curve1.webp"
                                className="absolute right-[120px] bottom-[115px] hidden w-[26px] rotate-[20deg] lg:right-[89px] lg:bottom-[127px] lg:w-[29px] xl:right-[138px] xl:bottom-[145px] xl:w-[33px] 2xl:right-[175px] 2xl:bottom-[163px] 2xl:w-[38px] dark:block"
                            />

                            {/* arrow */}
                            <img
                                src="/images/arrow/arrow1-black.webp"
                                className="absolute top-[22px] right-[14px] w-[108px] rotate-[27deg] lg:top-[27px] lg:right-[-20px] lg:w-[120px] xl:top-[32px] xl:right-[9px] xl:w-[140px] 2xl:top-[33px] 2xl:right-[28px] 2xl:w-[160px] dark:hidden"
                            />

                            <img
                                src="/images/arrow/arrow1.webp"
                                className="absolute top-[22px] right-[14px] hidden w-[108px] rotate-[27deg] lg:top-[27px] lg:right-[-20px] lg:w-[120px] xl:top-[32px] xl:right-[9px] xl:w-[140px] 2xl:top-[33px] 2xl:right-[28px] 2xl:w-[160px] dark:block"
                            />

                            {/* ---------- ARROW 3 ---------- */}
                            {/* curve */}
                            <img
                                src="/images/arrow/curve1-black.webp"
                                className="absolute right-[120px] bottom-[70px] w-[26px] rotate-[44deg] lg:right-[88px] lg:bottom-[74px] lg:w-[30px] xl:right-[138px] xl:bottom-[89px] xl:w-[32px] 2xl:right-[175px] 2xl:bottom-[98px] 2xl:w-[38px] dark:hidden"
                            />

                            <img
                                src="/images/arrow/curve1.webp"
                                className="absolute right-[120px] bottom-[70px] hidden w-[26px] rotate-[44deg] lg:right-[88px] lg:bottom-[74px] lg:w-[30px] xl:right-[138px] xl:bottom-[89px] xl:w-[32px] 2xl:right-[175px] 2xl:bottom-[98px] 2xl:w-[38px] dark:block"
                            />

                            {/* arrow */}
                            <img
                                src="/images/arrow/arrow1-black.webp"
                                className="absolute right-[2px] bottom-[64px] w-[110px] rotate-[40deg] lg:right-[-37px] lg:bottom-[66px] lg:w-[125px] lg:rotate-[43deg] xl:right-[-7px] xl:bottom-[75px] xl:w-[145px] xl:rotate-[43deg] 2xl:right-[11px] 2xl:bottom-[90px] 2xl:w-[162px] 2xl:rotate-[40deg] dark:hidden"
                            />

                            <img
                                src="/images/arrow/arrow1.webp"
                                className="absolute right-[2px] bottom-[64px] hidden w-[110px] rotate-[40deg] lg:right-[-37px] lg:bottom-[66px] lg:w-[125px] lg:rotate-[43deg] xl:right-[-7px] xl:bottom-[75px] xl:w-[145px] xl:rotate-[43deg] 2xl:right-[11px] 2xl:bottom-[90px] 2xl:w-[162px] 2xl:rotate-[40deg] dark:block"
                            />

                            {/* ---------- ARROW 4 ---------- */}
                            {/* curve */}
                            <img
                                src="/images/arrow/curve1-black.webp"
                                className="absolute right-[140px] bottom-[20px] w-[26px] rotate-[65deg] lg:right-[108px] lg:bottom-[26px] lg:w-[30px] xl:right-[160px] xl:bottom-[32px] xl:w-[34px] 2xl:right-[200px] 2xl:bottom-[38px] 2xl:w-[38px] dark:hidden"
                            />

                            <img
                                src="/images/arrow/curve1.webp"
                                className="absolute right-[140px] bottom-[20px] hidden w-[26px] rotate-[65deg] lg:right-[108px] lg:bottom-[26px] lg:w-[30px] xl:right-[160px] xl:bottom-[32px] xl:w-[34px] 2xl:right-[200px] 2xl:bottom-[38px] 2xl:w-[38px] dark:block"
                            />

                            {/* arrow */}
                            <img
                                src="/images/arrow/arrow1-black.webp"
                                className="absolute right-[14px] bottom-[14px] w-[110px] rotate-[54deg] lg:right-[-16px] lg:bottom-[-10px] lg:w-[125px] lg:rotate-[64deg] xl:right-[17px] xl:bottom-[-11px] xl:w-[145px] xl:rotate-[64deg] 2xl:right-[29px] 2xl:bottom-[-4px] 2xl:w-[165px] 2xl:rotate-[57deg] dark:hidden"
                            />

                            <img
                                src="/images/arrow/arrow1.webp"
                                className="absolute right-[14px] bottom-[14px] hidden w-[110px] rotate-[54deg] lg:right-[-16px] lg:bottom-[-10px] lg:w-[125px] lg:rotate-[64deg] xl:right-[17px] xl:bottom-[-11px] xl:w-[145px] xl:rotate-[64deg] 2xl:right-[29px] 2xl:bottom-[-4px] 2xl:w-[165px] 2xl:rotate-[57deg] dark:block"
                            />
                        </div>

                        {/* ================= CENTER LOGO ================= */}
                        <img
                            src="/images/Ventura.webp"
                            alt="Ventura Logo"
                            className="absolute top-1/2 left-1/2 w-[260px] -translate-x-1/2 -translate-y-1/2 object-contain lg:w-[295px] xl:w-[337px] 2xl:w-[385px]"
                        />

                        {/* ================= COLOR SEGMENT ================= */}
                        <svg
                            viewBox="0 0 320 320"
                            className="absolute z-20 -ml-4 hidden h-[210px] w-[210px] lg:block lg:h-[250px] lg:w-[250px] xl:h-[285px] xl:w-[285px] 2xl:h-[320px] 2xl:w-[320px]"
                        >
                            <circle
                                cx="160"
                                cy="160"
                                r="153"
                                stroke="#EE0202"
                                strokeWidth="14"
                                fill="none"
                                strokeDasharray="60 901"
                                strokeDashoffset="-60"
                            />
                            <circle
                                cx="160"
                                cy="160"
                                r="153"
                                stroke="#3B28F6"
                                strokeWidth="14"
                                fill="none"
                                strokeDasharray="60 901"
                                strokeDashoffset="0"
                            />
                            <circle
                                cx="160"
                                cy="160"
                                r="153"
                                stroke="#68FF57"
                                strokeWidth="14"
                                fill="none"
                                strokeDasharray="60 901"
                                strokeDashoffset="60"
                            />
                            <circle
                                cx="160"
                                cy="160"
                                r="153"
                                stroke="#F0E427"
                                strokeWidth="14"
                                fill="none"
                                strokeDasharray="60 901"
                                strokeDashoffset="120"
                            />
                        </svg>

                        {/* ================= OUTER CIRCLE ================= */}
                        <div className="relative z-10 -ml-4 h-[220px] w-[220px] rounded-full border-[8px] border-cyan-400 lg:h-[248px] lg:w-[248px] lg:border-[10px] xl:h-[285px] xl:w-[280px] xl:border-[12px] 2xl:h-[320px] 2xl:w-[320px] 2xl:border-[14px]" />
                    </div>
                    {/* ================= RIGHT : CARD LIST ================= */}
                    <div className="space-y-6 lg:space-y-8">
                        {/* ================= CARD 1 ================= */}
                        <div className="relative flex items-center lg:-translate-x-[60px]">
                            <div className="relative top-2.5 z-20 flex h-[80px] w-[80px] items-center justify-center rounded-full bg-[#161A4E] md:h-[95px] md:w-[95px] lg:h-[110px] lg:w-[110px]">
                                <span className="absolute inset-0 rounded-full border-2 border-blue-500 border-r-transparent border-b-transparent"></span>
                                <img
                                    src="/images/roket.webp"
                                    className="w-8 object-contain md:w-10 lg:w-12"
                                />
                            </div>

                            <div className="absolute top-[54px] left-[60px] z-10 rounded-tl-[20px] rounded-tr-[22px] rounded-br-[22px] rounded-bl-[3px] bg-[#F0E427] px-4 py-2 font-semibold text-black md:top-[45px] md:left-[70px] md:px-6 md:py-3 lg:top-[50px] lg:left-[74px] lg:px-8 lg:py-4">
                                <p
                                    className="ml-2 text-sm font-bold md:text-base"
                                    style={{ fontFamily: 'Orbitron' }}
                                >
                                    Mission
                                </p>
                            </div>

                            <div className="-ml-[20px] flex h-[90px] flex-1 items-center rounded-tl-[200px] rounded-tr-[70px] rounded-br-[70px] rounded-bl-[10px] border border-[3px] border-[#F0E427] bg-[#161A4E] pr-4 pl-[110px] md:h-[95px] md:pl-[120px] lg:-ml-[30px] lg:h-[100px] lg:rounded-tl-[250px] lg:rounded-tr-[90px] lg:rounded-br-[90px] lg:pr-6 lg:pl-[135px]">
                                <p
                                    className="text-xs leading-relaxed font-extrabold text-gray-300 md:text-sm"
                                    style={{ fontFamily: 'Oxanium' }}
                                >
                                    Lorem ipsum dolor sit amet
                                    consectetur adipisicing elit.
                                </p>
                            </div>
                        </div>

                        {/* ================= CARD 2 ================= */}
                        <div className="relative flex items-center">
                            <div className="relative top-2.5 z-20 flex h-[80px] w-[80px] items-center justify-center rounded-full bg-[#161A4E] md:h-[95px] md:w-[95px] lg:h-[110px] lg:w-[110px]">
                                <span className="absolute inset-0 rounded-full border-2 border-blue-500 border-r-transparent border-b-transparent"></span>
                                <img
                                    src="/images/lamp.webp"
                                    className="w-8 object-contain md:w-10 lg:w-12"
                                />
                            </div>

                            <div className="absolute top-[54px] left-[60px] z-10 rounded-tl-[20px] rounded-tr-[22px] rounded-br-[22px] rounded-bl-[3px] bg-[#68FF57] px-4 py-2 font-semibold text-black md:top-[45px] md:left-[70px] md:px-6 md:py-3 lg:top-[50px] lg:left-[74px] lg:px-8 lg:py-4">
                                <p
                                    className="ml-2 text-sm font-bold md:text-base"
                                    style={{ fontFamily: 'Orbitron' }}
                                >
                                    Vision
                                </p>
                            </div>

                            <div className="-ml-[20px] flex h-[90px] flex-1 items-center rounded-tl-[200px] rounded-tr-[70px] rounded-br-[70px] rounded-bl-[10px] border border-[3px] border-[#F0E427] bg-[#161A4E] pr-4 pl-[110px] md:h-[95px] md:pl-[120px] lg:-ml-[30px] lg:h-[100px] lg:rounded-tl-[250px] lg:rounded-tr-[90px] lg:rounded-br-[90px] lg:pr-6 lg:pl-[135px]">
                                <p
                                    className="text-xs leading-relaxed font-extrabold text-gray-300 md:text-sm"
                                    style={{ fontFamily: 'Oxanium' }}
                                >
                                    Becoming the leading gamified
                                    learning ecosystem.
                                </p>
                            </div>
                        </div>

                        {/* ================= CARD 3 ================= */}
                        <div className="relative flex items-center">
                            <div className="relative top-2.5 z-20 flex h-[80px] w-[80px] items-center justify-center rounded-full bg-[#161A4E] md:h-[95px] md:w-[95px] lg:h-[110px] lg:w-[110px]">
                                <span className="absolute inset-0 rounded-full border-2 border-blue-500 border-r-transparent border-b-transparent"></span>
                                <img
                                    src="/images/diamond.webp"
                                    className="w-8 object-contain md:w-10 lg:w-12"
                                />
                            </div>

                            <div className="absolute top-[54px] left-[60px] z-10 rounded-tl-[20px] rounded-tr-[22px] rounded-br-[22px] rounded-bl-[3px] bg-[#3B28F6] px-4 py-2 font-semibold text-black md:top-[45px] md:left-[70px] md:px-6 md:py-3 lg:top-[50px] lg:left-[74px] lg:px-8 lg:py-4">
                                <p
                                    className="ml-2 text-sm font-bold md:text-base"
                                    style={{ fontFamily: 'Orbitron' }}
                                >
                                    Value
                                </p>
                            </div>

                            <div className="-ml-[20px] flex h-[90px] flex-1 items-center rounded-tl-[200px] rounded-tr-[70px] rounded-br-[70px] rounded-bl-[10px] border border-[3px] border-[#F0E427] bg-[#161A4E] pr-4 pl-[110px] md:h-[95px] md:pl-[120px] lg:-ml-[30px] lg:h-[100px] lg:rounded-tl-[250px] lg:rounded-tr-[90px] lg:rounded-br-[90px] lg:pr-6 lg:pl-[135px]">
                                <p
                                    className="text-xs leading-relaxed font-extrabold text-gray-300 md:text-sm"
                                    style={{ fontFamily: 'Oxanium' }}
                                >
                                    Innovation, accessibility, and
                                    community learning.
                                </p>
                            </div>
                        </div>

                        {/* ================= CARD 4 ================= */}
                        <div className="relative flex items-center lg:-translate-x-[60px]">
                            <div className="relative top-2.5 z-20 flex h-[80px] w-[80px] items-center justify-center rounded-full bg-[#161A4E] md:h-[95px] md:w-[95px] lg:h-[110px] lg:w-[110px]">
                                <span className="absolute inset-0 rounded-full border-2 border-blue-500 border-r-transparent border-b-transparent"></span>
                                <img
                                    src="/images/target.webp"
                                    className="w-8 object-contain md:w-10 lg:w-12"
                                />
                            </div>

                            <div className="absolute top-[54px] left-[60px] z-10 rounded-tl-[20px] rounded-tr-[22px] rounded-br-[22px] rounded-bl-[3px] bg-red-700 px-4 py-2 font-semibold text-black md:top-[45px] md:left-[70px] md:px-6 md:py-3 lg:top-[50px] lg:left-[74px] lg:px-8 lg:py-4">
                                <p
                                    className="ml-2 text-sm font-bold md:text-base"
                                    style={{ fontFamily: 'Orbitron' }}
                                >
                                    Goals
                                </p>
                            </div>

                            <div className="-ml-[20px] flex h-[90px] flex-1 items-center rounded-tl-[200px] rounded-tr-[70px] rounded-br-[70px] rounded-bl-[10px] border border-[3px] border-[#F0E427] bg-[#161A4E] pr-4 pl-[110px] md:h-[95px] md:pl-[120px] lg:-ml-[30px] lg:h-[100px] lg:rounded-tl-[250px] lg:rounded-tr-[90px] lg:rounded-br-[90px] lg:pr-6 lg:pl-[135px]">
                                <p
                                    className="text-xs leading-relaxed font-extrabold text-gray-300 md:text-sm"
                                    style={{ fontFamily: 'Oxanium' }}
                                >
                                    Empower learners with real-world
                                    tech skills.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
