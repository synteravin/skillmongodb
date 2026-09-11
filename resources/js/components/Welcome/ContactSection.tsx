export default function ContactSection() {
    return (
        <section
            id="contact"
            className="relative pt-20 pb-16 sm:pt-24 sm:pb-20 md:pt-32 md:pb-24"
        >
            {/* Ambient Tech Glows */}
            <div className="pointer-events-none absolute top-16 -left-14 z-0">
                <div className="h-[230px] w-[230px] rounded-full bg-blue-800 blur-[75px]" />
            </div>
            <div className="pointer-events-none absolute bottom-10 -right-16 z-0">
                <div className="h-[220px] w-[220px] rounded-full bg-blue-800 blur-[70px]" />
            </div>

            <div className="relative z-10 container mx-auto px-6">
                {/* Title */}
                <h2
                    className="mb-10 text-center text-3xl font-extrabold sm:mb-12 sm:text-4xl md:mb-16 md:text-5xl"
                    style={{ fontFamily: 'lalezar' }}
                >
                    <span className="text-[#3B28F6]">Contact</span>{' '}
                    <span className="text-yellow-500 dark:text-[#FACC15]">Us</span>
                </h2>

                <div className="relative mx-auto max-w-5xl rounded-3xl border border-slate-200/90 bg-white/90 p-8 shadow-sm backdrop-blur-sm sm:p-10 md:p-12 dark:border-white/10 dark:bg-white/[0.02] dark:shadow-none">
                    <div className="grid items-center gap-10 md:grid-cols-2 md:gap-12">
                        {/* LEFT TEXT */}
                        <div className="text-center md:text-left">
                            <h3 className="mb-4 text-xl font-bold text-slate-900 sm:mb-6 sm:text-2xl dark:text-white">
                                Kontak Kami
                            </h3>

                            <p className="mb-4 text-sm leading-relaxed text-slate-600 sm:mb-6 sm:text-base dark:text-gray-300">
                                SKILL VENTURA contact support is available Monday to
                                Friday, from 8 AM to 4 PM. During these hours, our
                                team is ready to assist with questions, guidance, or
                                any support you need while using the platform.
                                Messages sent outside these hours will be answered
                                on the next working day.
                            </p>

                            <p className="text-sm leading-relaxed text-slate-600 sm:text-base dark:text-gray-300">
                                We remain committed to providing helpful and timely
                                support to ensure your learning experience on SKILL
                                VENTURA stays smooth and enjoyable.
                            </p>
                        </div>

                        {/* RIGHT IMAGE */}
                        <div className="flex justify-center">
                            <img
                                src="/images/servis.webp"
                                alt="Customer Service"
                                className="w-full max-w-xs sm:max-w-sm md:max-w-md drop-shadow-sm"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
