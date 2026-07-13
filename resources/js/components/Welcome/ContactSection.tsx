export default function ContactSection() {
    return (
        <section
            id="contact"
            className="pt-20 pb-16 sm:pt-24 sm:pb-20 md:pt-32 md:pb-24"
        >
            <div className="container mx-auto px-6">
                {/* Title */}
                <h2
                    className="mb-10 bg-[#3B28F6] bg-clip-text text-center text-3xl font-extrabold text-transparent sm:mb-12 sm:text-4xl md:mb-16 md:text-5xl"
                    style={{ fontFamily: 'lalezar' }}
                >
                    Contact <span className="text-[#FACC15]"> Us </span>
                </h2>

                <div className="grid items-center gap-10 md:grid-cols-2 md:gap-12">
                    {/* LEFT TEXT */}
                    <div className="text-center md:text-left">
                        <h3 className="mb-4 text-xl font-bold text-gray-900 sm:mb-6 sm:text-2xl dark:text-white">
                            Kontak Kami
                        </h3>

                        <p className="mb-4 text-sm leading-relaxed text-gray-600 sm:mb-6 sm:text-base dark:text-gray-300">
                            SKILL VENTURA contact support is available Monday to
                            Friday, from 8 AM to 4 PM. During these hours, our
                            team is ready to assist with questions, guidance, or
                            any support you need while using the platform.
                            Messages sent outside these hours will be answered
                            on the next working day.
                        </p>

                        <p className="text-sm leading-relaxed text-gray-600 sm:text-base dark:text-gray-300">
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
                            className="w-full max-w-xs sm:max-w-sm md:max-w-md"
                        />
                    </div>
                </div>
            </div>
        </section>
    );
}
