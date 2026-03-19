import { Head, usePage } from '@inertiajs/react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useState, useEffect } from 'react';

// Sections
import Navbar from '@/components/Welcome/Navbar';
import HeroSection from '@/components/Welcome/HeroSection';
import AboutSection from '@/components/Welcome/AboutSection';
import VisionMissionSection from '@/components/Welcome/VisionMissionSection';
import GamifiedMapSection from '@/components/Welcome/GamifiedMapSection';
import FaqSection from '@/components/Welcome/FaqSection';
import CtaSection from '@/components/Welcome/CtaSection';
import ContactSection from '@/components/Welcome/ContactSection';
import Footer from '@/components/Welcome/Footer';

export default function Welcome({ auth }: { auth: { user: any } }) {
    const { url } = usePage();

    const { scrollY } = useScroll();
    const y1 = useTransform(scrollY, [0, 500], [0, 200]);
    const y2 = useTransform(scrollY, [0, 500], [0, -150]);

    const [darkMode, setDarkMode] = useState(false);

    useEffect(() => {
        const savedTheme = localStorage.getItem('theme');

        if (savedTheme === 'dark') {
            document.documentElement.classList.add('dark');
            setDarkMode(true);
        } else {
            document.documentElement.classList.remove('dark');
            setDarkMode(false);
        }
    }, []);

    const toggleTheme = () => {
        const html = document.documentElement;

        if (darkMode) {
            html.classList.remove('dark');
            localStorage.setItem('theme', 'light');
        } else {
            html.classList.add('dark');
            localStorage.setItem('theme', 'dark');
        }

<<<<<<< HEAD
        setDarkMode(!darkMode)
    }
    useEffect(() => {
    const sections = document.querySelectorAll("section[id]");

    const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    setActiveSection(entry.target.id);
                }
            });
        },
        {
            threshold: 0.6, // makin besar = harus lebih masuk dulu
        }
    );

    sections.forEach((section) => observer.observe(section));

    return () => {
        sections.forEach((section) => observer.unobserve(section));
    };
}, []);
=======
        setDarkMode(!darkMode);
    };

>>>>>>> 8412a4539279281d61c182d9b8fa21e1c448a38c
    return (
        <>
            <Head title="SkillVentura - Level Up Your Life" />
            <div className="relative min-h-screen w-full overflow-x-hidden bg-white font-sans text-[#1e293b] antialiased transition-colors duration-300 2xl:mx-auto 2xl:max-w-[1780px] dark:bg-[#020202] dark:text-slate-100">
                <Navbar auth={auth} darkMode={darkMode} toggleTheme={toggleTheme} />
                <HeroSection />
                <AboutSection />
                <VisionMissionSection />
                <GamifiedMapSection />
                <FaqSection />
                <CtaSection />
                <ContactSection />
                <Footer />
            </div>

<<<<<<< HEAD

            {/* SUPPORT */}
            <div>
                <h4 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">
                Support
                </h4>

                <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                <li>Hubungi Kami</li>
                <li>Syarat dan Ketentuan</li>
                <li>Kebijakan dan Privasi</li>
                </ul>
            </div>

            </div>

                            </div>


                            {/* COPYRIGHT */}
             <div className="container mx-auto px-6 mt-12 border-t border-gray-200 dark:border-white/10 pt-6">

                                <p className="text-xs text-gray-500 dark:text-gray-400 text-center md:text-left">
                                © SKILL VENTURA Learn. All Rights Reserved
                                </p>

                            </div>

                            </footer>
            </div>

=======
>>>>>>> 8412a4539279281d61c182d9b8fa21e1c448a38c
            <style>{`
                .animate-infinite-scroll {
                    animation: infinite-scroll 25s linear infinite;
                }
                @keyframes infinite-scroll {
                    from { transform: translateX(0); }
                    to { transform: translateX(-100%); }
                }
                .text-stroke {
                    -webkit-text-stroke: 1px rgba(255,255,255,0.1);
                }
            `}</style>
        </>
    );
}

// Subcomponents

function NodeItem({
    color,
    text,
    delay,
}: {
    color: string;
    text: string;
    delay: number;
}) {
    return (
        <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay }}
            className="flex items-center gap-4"
        >
            <div className="h-[2px] w-16 bg-white/20" />
            <div className="group flex w-64 cursor-pointer items-center justify-between rounded-full border border-white/10 bg-[#0f172a] px-6 py-3 transition-colors hover:border-white/30">
                <span className="font-bold text-slate-300 group-hover:text-white">
                    {text}
                </span>
                <div className={`h-3 w-3 rounded-full ${color}`} />
            </div>
        </motion.div>
    );
}

function GameControllerGraphic() {
    return (
        <svg
            viewBox="0 0 400 300"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="h-full w-full drop-shadow-2xl"
        >
            <path
                d="M70 110C70 80 100 60 140 60H260C300 60 330 80 330 110V200C330 230 300 250 260 250C240 250 230 230 230 210L200 200L170 210C170 230 160 250 140 250C100 250 70 230 70 200V110Z"
                fill="url(#grad1)"
                stroke="rgba(255,255,255,0.2)"
                strokeWidth="2"
            />
            <circle
                cx="120"
                cy="130"
                r="15"
                fill="#3b82f6"
                className="animate-pulse"
            />
            <path
                d="M110 160H130M120 150V170"
                stroke="white"
                strokeWidth="4"
                strokeLinecap="round"
            />
            <circle cx="280" cy="130" r="8" fill="#ef4444" />
            <circle cx="260" cy="150" r="8" fill="#eab308" />
            <circle cx="280" cy="170" r="8" fill="#22c55e" />
            <circle cx="300" cy="150" r="8" fill="#3b82f6" />
            <defs>
                <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#1e293b" />
                    <stop offset="50%" stopColor="#0f172a" />
                    <stop offset="100%" stopColor="#1e1b4b" />
                </linearGradient>
            </defs>
        </svg>
    );
}
