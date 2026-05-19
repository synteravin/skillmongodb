export default function AboutSection() {
    return (
        <section
            id="about"
            className="relative py-12 md:py-24 2xl:py-32"
        >
            <div className="relative z-10 container mx-auto px-6">
                <div className="mx-auto max-w-4xl 2xl:max-w-6xl">
                    {/* 🔥 CARD UTAMA */}
                    <div className="relative overflow-visible rounded-tl-[18px] rounded-tr-[24px] rounded-br-[32px] rounded-bl-[32px] bg-[#13174D] px-5 py-14 shadow-[0_10px_30px_rgba(0,0,0,0.35)] sm:px-8 sm:py-16 md:rounded-tl-[12px] md:rounded-tr-[32px] md:rounded-br-[55px] md:rounded-bl-[55px] md:px-12 md:py-20 md:shadow-none">
                        {/* 🔥 TOP BADGE (LG ONLY) */}
                        <div className="absolute -top-[60px] right-0 hidden h-[100px] items-center justify-center rounded-tr-[32px] bg-[#13174D] px-[90px] lg:flex">
                            <div className="absolute top-0 -left-[95px] h-[100px] w-[120px] -skew-x-[50deg] bg-[#13174D]" />
                            <div className="absolute inset-[18px_30px] rounded-[60px] border border-cyan-300" />
                            <span className="font-['Orbitron'] text-[24px] font-semibold tracking-[5px] text-gray-200">
                                About Section
                            </span>
                        </div>

                        <div className="pointer-events-none absolute inset-0 z-[40]">
                            {/* 🔥 PNG 1 — PHONE (KIRI ATAS) */}
                            <div className="absolute top-6 left-4 sm:top-10 sm:left-8 md:top-12 md:left-12 lg:top-[20px] lg:left-[280px]">
                                <img
                                    src="/images/phone.webp"
                                    alt="phone"
                                    className="w-16 drop-shadow-2xl sm:w-20 md:w-24 lg:w-18"
                                />
                            </div>

                            {/* 🔥 PNG 2 — MONITOR (KIRI BAWAH) */}
                            <div className="absolute bottom-16 left-6 sm:bottom-20 sm:left-12 md:bottom-24 md:left-16 lg:bottom-[1px] lg:left-[60px]">
                                <img
                                    src="/images/monitor.webp"
                                    alt="monitor"
                                    className="w-20 drop-shadow-2xl sm:w-24 md:w-28 lg:w-24"
                                />
                            </div>

                            {/* 🔥 PNG 3 — GAMEPAD MIRING (KANAN BAWAH) */}
                            <div className="md:none absolute right-4 bottom-14 rotate-[5deg] sm:right-10 sm:bottom-18 md:right-14 md:bottom-20 lg:right-[5px] lg:bottom-[60px]">
                                <img
                                    src="/images/gamepad.webp"
                                    alt="gamepad"
                                    className="w-20 drop-shadow-2xl sm:w-24 md:w-28 lg:w-32"
                                />
                            </div>
                        </div>
                        {/* 🔥 GRID WRAPPER */}
                        <div className="grid gap-14 sm:gap-16 md:grid-cols-2 md:gap-20">
                            {/* 🔥 MOBILE HEADER */}
                            <div className="col-span-full mb-4 flex justify-center sm:mb-6 lg:hidden">
                                <div className="rounded-full border border-cyan-300/60 bg-white/5 px-6 py-3 backdrop-blur-md">
                                    <span className="font-['Orbitron'] text-base tracking-[3px] text-cyan-200 sm:text-lg">
                                        About Section
                                    </span>
                                </div>
                            </div>

                            {/* ================= CARD 1 ================= */}
                            <div className="relative mb-12 md:mb-0 md:translate-x-8 lg:translate-x-0">
                                <div className="relative z-10 rounded-[28px] border border-cyan-400/40 bg-[#1D215D] p-8 shadow-[0_12px_30px_rgba(0,0,0,0.4)] md:shadow-[0_15px_35px_rgba(0,0,0,0.45)] lg:shadow-[0_8px_25px_rgba(0,0,0,0.35)]">
                                    {/* Zigzag Accent (mobile & tab only) */}
                                    <div className="absolute -top-3 left-8 h-2 w-16 rounded-full bg-cyan-400 lg:hidden" />

                                    <p className="leading-relaxed text-slate-300">
                                        Skill Ventura adalah sebuah
                                        project berbasis teknologi yang
                                        dirancang untuk mengembangkan
                                        keterampilan pengguna secara
                                        progresif melalui pendekatan
                                        pembelajaran interaktif dan
                                        berbasis tantangan. Lorem ipsum,
                                        dolor sit amet consectetur
                                        adipisicing elit. Accusamus
                                        repellat delectus beatae? Eius
                                        nemo amet nostrum fugiat
                                        recusandae! Fugiat,
                                        voluptates?Lorem ipsum dolor sit
                                        amet consectetur adipisicing
                                        elit. Pariatur, assumenda?
                                    </p>
                                </div>

                                {/* Bottom Badge (LG ONLY) */}
                                <div className="absolute -bottom-[38px] left-0 z-20 hidden h-[60px] w-[180px] rounded-br-[28px] rounded-bl-[28px] bg-[#1D215D] lg:block" />

                                {/* Teal Shape (LG ONLY) */}
                                <div className="absolute -bottom-[29px] left-[173px] z-30 hidden h-[28px] w-[120px] rounded-tl-[15px] rounded-tr-[10px] bg-[#13174D] lg:block" />
                            </div>

                            {/* ================= CARD 2 ================= */}
                            <div className="relative mt-10 md:mt-14 md:-translate-x-8 lg:mt-0 lg:translate-x-0">
                                <div className="relative z-10 rounded-[28px] border border-cyan-400/40 bg-[#1D215D] p-8 shadow-[0_12px_30px_rgba(0,0,0,0.4)] md:shadow-[0_15px_35px_rgba(0,0,0,0.45)] lg:shadow-[0_8px_25px_rgba(0,0,0,0.35)]">
                                    {/* Zigzag Accent (mobile & tab only) */}
                                    <div className="absolute -top-3 right-8 h-2 w-16 rounded-full bg-pink-400 lg:hidden" />

                                    <p className="leading-relaxed text-slate-300">
                                        We gamify the experience to make
                                        learning addictive, fun, and
                                        effective. Level up your
                                        real-world stats while having
                                        fun. Lorem ipsum dolor sit amet,
                                        consectetur adipisicing elit.
                                        Nihil quod omnis eveniet
                                        reprehenderit ab pariatur
                                        tempora eum iure magnam quo nemo
                                        id, eligendi corrupti ea.
                                        Inventore quibusdam sequi dicta
                                        sed reprehenderit optio autem
                                        ullam modi ex eum, voluptatem
                                        dolor officiis tempora nihil
                                        iusto consequatur. Doloribus!
                                    </p>
                                </div>

                                {/* Top Badge (LG ONLY) */}
                                <div className="absolute -top-[45px] right-0 z-20 hidden h-[70px] w-[210px] rounded-tl-[32px] rounded-tr-[32px] bg-[#1D215D] lg:block" />

                                {/* Teal Shape (LG ONLY) */}
                                <div className="absolute -top-[36px] right-[200px] z-30 hidden h-[32px] w-[140px] rounded-br-[12px] rounded-bl-[18px] bg-[#13174D] lg:block" />
                            </div>
                        </div>

                        {/* 🔥 LEKUKAN BAWAH */}
                        <div className="absolute bottom-0 left-1/2 h-[50px] w-[180px] -translate-x-1/2 rounded-t-[24px] bg-white sm:h-[60px] sm:w-[220px] md:h-[70px] md:w-[260px] md:rounded-t-[32px] dark:bg-[#020202]" />
                    </div>
                </div>
            </div>
        </section>
    );
}
