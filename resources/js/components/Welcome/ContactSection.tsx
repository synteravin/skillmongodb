import type { LandingPageContact } from '@/types/landing-page';

interface Props {
    contact?: LandingPageContact;
}

export default function ContactSection({ contact }: Props = {}) {
    const subtitle = contact?.subtitle || 'Kontak Kami';
    const desc1 =
        contact?.description_1 ||
        'SKILL VENTURA contact support is available Monday to Friday, from 8 AM to 4 PM. During these hours, our team is ready to assist with questions, guidance, or any support you need while using the platform. Messages sent outside these hours will be answered on the next working day.';
    const desc2 =
        contact?.description_2 ||
        'We remain committed to providing helpful and timely support to ensure your learning experience on SKILL VENTURA stays smooth and enjoyable.';

    return (
        <section
            id="contact"
            className="relative pt-20 pb-16 sm:pt-24 sm:pb-20 md:pt-32 md:pb-24"
        >
            {/* Ambient Tech Glows */}
            <div className="pointer-events-none absolute top-16 -left-14 z-0">
                <div className="h-[230px] w-[230px] rounded-full bg-blue-800 blur-[75px]" />
            </div>
            <div className="pointer-events-none absolute -right-16 bottom-10 z-0">
                <div className="h-[220px] w-[220px] rounded-full bg-blue-800 blur-[70px]" />
            </div>

            <div className="relative z-10 container mx-auto px-6">
                {/* Title */}
                <h2
                    className="mb-10 text-center text-3xl font-extrabold sm:mb-12 sm:text-4xl md:mb-16 md:text-5xl"
                    style={{ fontFamily: 'lalezar' }}
                >
                    <span className="text-[#3B28F6]">Contact</span>{' '}
                    <span className="text-yellow-500 dark:text-[#FACC15]">
                        Us
                    </span>
                </h2>

                <div className="relative mx-auto max-w-5xl rounded-3xl border border-slate-200/90 bg-white/90 p-8 shadow-sm backdrop-blur-sm sm:p-10 md:p-12 dark:border-white/10 dark:bg-white/[0.02] dark:shadow-none">
                    <div className="grid items-center gap-10 md:grid-cols-2 md:gap-12">
                        {/* LEFT TEXT */}
                        <div className="text-center md:text-left">
                            <h3 className="mb-4 text-xl font-bold text-slate-900 sm:mb-6 sm:text-2xl dark:text-white">
                                {subtitle}
                            </h3>

                            <p className="mb-4 text-sm leading-relaxed text-slate-600 sm:mb-6 sm:text-base dark:text-gray-300">
                                {desc1}
                            </p>

                            <p className="text-sm leading-relaxed text-slate-600 sm:text-base dark:text-gray-300">
                                {desc2}
                            </p>

                            {(contact?.support_email ||
                                contact?.working_hours) && (
                                <div className="mt-6 flex flex-wrap items-center justify-center gap-3 md:justify-start">
                                    {contact?.working_hours && (
                                        <span className="inline-flex items-center rounded-lg border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-semibold text-slate-700 dark:border-white/10 dark:bg-white/5 dark:text-slate-300">
                                            🕒 {contact.working_hours}
                                        </span>
                                    )}
                                    {contact?.support_email && (
                                        <a
                                            href={`mailto:${contact.support_email}`}
                                            className="inline-flex items-center rounded-lg border border-indigo-500/20 bg-indigo-50/50 px-3 py-1.5 text-xs font-semibold text-indigo-700 hover:bg-indigo-100 dark:border-indigo-500/30 dark:bg-indigo-950/40 dark:text-indigo-300"
                                        >
                                            ✉️ {contact.support_email}
                                        </a>
                                    )}
                                </div>
                            )}
                        </div>

                        {/* RIGHT IMAGE */}
                        <div className="flex justify-center">
                            <img
                                src="/images/servis.webp"
                                alt="Customer Service"
                                className="w-full max-w-xs drop-shadow-sm sm:max-w-sm md:max-w-md"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
