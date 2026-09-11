import { useState } from 'react';
import { ChevronRight } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';

export default function FaqSection() {
    const [openFaq, setOpenFaq] = useState<number | null>(null);

    const toggleFaq = (index: number) => {
        setOpenFaq(openFaq === index ? null : index);
    };

    return (
        <section className="relative py-16 md:py-24 2xl:py-32">
            {/* Ambient Tech Glows */}
            <div className="pointer-events-none absolute top-12 -right-16 z-0">
                <div className="h-[230px] w-[230px] rounded-full bg-blue-800 blur-[75px]" />
            </div>
            <div className="pointer-events-none absolute bottom-12 -left-16 z-0">
                <div className="h-[210px] w-[210px] rounded-full bg-blue-800 blur-[70px]" />
            </div>

            <div className="relative z-10 container mx-auto max-w-4xl px-6">
                {/* Title */}
                <h2 className="mb-16 text-center text-4xl font-black">
                    <span className="text-[#3B28F6]">Frequently Asked </span>
                    <span className="text-[#FACC15]">Questions</span>
                </h2>

                {/* FAQ List */}
                <div className="flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-[#3c418a] dark:bg-[#1D215D]">
                    {[
                        {
                            q: 'Apa itu SKILL VENTURA dan bagaimana cara kerjanya?',
                            a: 'SKILL VENTURA adalah platform Learning Management System (LMS) berbasis gamifikasi yang dirancang untuk membantu Anda menguasai keterampilan teknologi modern melalui materi terstruktur, simulasi praktik langsung, quest berbayar, dan sistem leveling interaktif.',
                        },
                        {
                            q: 'Apakah saya membutuhkan pengalaman sebelumnya untuk mulai belajar?',
                            a: 'Tidak perlu. SKILL VENTURA menyediakan modul pembelajaran mulai dari tingkat pemula (beginner) hingga tingkat lanjut (advanced) dengan panduan langkah demi langkah yang ramah bagi pemula.',
                        },
                        {
                            q: 'Bagaimana cara kerja sistem gamifikasi di SKILL VENTURA?',
                            a: 'Setiap kali Anda menyelesaikan materi, kuis, atau tugas, Anda akan memperoleh XP, menaikkan level karakter, membuka lencana pencapaian (achievements), serta dapat bersaing di leaderboard komunitas.',
                        },
                        {
                            q: 'Keahlian (skills) apa saja yang dapat saya pelajari?',
                            a: 'Anda dapat mempelajari berbagai bidang teknologi yang diminati industri saat ini, seperti Web Development, Cyber Security, Cloud Computing, Data Science, Artificial Intelligence, Mobile Development, hingga UI/UX Design.',
                        },
                        {
                            q: 'Apakah tersedia roadmap atau jalur belajar yang terstruktur?',
                            a: 'Ya, kami menyediakan fitur Skill Tree dan alur belajar karier yang jelas. Anda dapat memilih jalur keahlian yang diinginkan dan mengikuti rangkaian modul yang saling terhubung secara runtut.',
                        },
                        {
                            q: 'Bagaimana misi (quest) dan tantangan membantu mengasah kemampuan saya?',
                            a: 'Quest disusun berdasarkan studi kasus nyata dari dunia kerja. Dengan menyelesaikannya, Anda tidak hanya memperkuat pemahaman teori, tetapi juga membangun portofolio proyek yang siap dipresentasikan kepada calon perekrut.',
                        },
                        {
                            q: 'Apakah saya mendapatkan XP atau reward setelah menyelesaikan tugas?',
                            a: 'Tentu saja! Setiap penyelesaian quest dan tantangan akan memberikan reward berupa XP, badge eksklusif, peningkatan tier, serta reward kompensasi pada quest industri tertentu.',
                        },
                        {
                            q: 'Bisakah saya belajar dengan kecepatan dan waktu saya sendiri (self-paced)?',
                            a: 'Ya, seluruh materi di SKILL VENTURA dapat diakses fleksibel 24/7. Anda bebas mengatur ritme dan waktu belajar sesuai dengan kesibukan dan kenyamanan Anda.',
                        },
                        {
                            q: 'Bagaimana jika saya mengalami kendala atau kesulitan saat belajar?',
                            a: 'Anda dapat bertanya dan berdiskusi langsung dengan mentor serta sesama rekan pembelajar melalui fitur Forum Diskusi Komunitas, atau menghubungi tim support kami melalui menu kontak.',
                        },
                        {
                            q: 'Bagaimana cara mendaftar dan mulai belajar di SKILL VENTURA?',
                            a: 'Cukup klik tombol "Start to learn" di halaman utama, buat akun Anda, pilih karakter dan skill tree yang ingin ditekuni, lalu mulailah petualangan belajar Anda!',
                        },
                    ].map((faq, i) => (
                        <div
                            key={i}
                            className="border-b border-slate-200 last:border-none dark:border-[#3c418a]"
                        >
                            <button
                                onClick={() => toggleFaq(i)}
                                className="flex w-full items-center justify-between bg-white px-6 py-5 text-left text-slate-800 transition-all hover:bg-slate-50/90 dark:bg-[#1D215D] dark:text-white dark:hover:bg-[#252a73]"
                            >
                                <div className="flex items-center gap-4">
                                    {/* Yellow Dot */}
                                    <div className="h-3.5 w-3.5 shrink-0 rounded-full bg-yellow-400 shadow-xs" />

                                    <span className="font-semibold tracking-wide text-slate-900 dark:text-white">
                                        {faq.q}
                                    </span>
                                </div>

                                {/* Arrow */}
                                <ChevronRight
                                    className={`transition-transform duration-300 text-slate-400 dark:text-white ${
                                        openFaq === i
                                            ? 'rotate-90 text-blue-600 dark:text-yellow-400'
                                            : ''
                                    }`}
                                />
                            </button>

                            <AnimatePresence>
                                {openFaq === i && (
                                    <motion.div
                                        initial={{
                                            height: 0,
                                            opacity: 0,
                                        }}
                                        animate={{
                                            height: 'auto',
                                            opacity: 1,
                                        }}
                                        exit={{ height: 0, opacity: 0 }}
                                        className="overflow-hidden bg-slate-50/80 dark:bg-[#15194a]"
                                    >
                                        <div className="px-14 pt-2 pb-6 text-sm leading-relaxed text-slate-600 dark:text-gray-200">
                                            {faq.a}
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
