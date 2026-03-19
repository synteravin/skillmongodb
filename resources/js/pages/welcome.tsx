import { Head, usePage } from '@inertiajs/react';

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

        setDarkMode(!darkMode);
    };
    return (
        <>
            <Head title="SkillVentura - Level Up Your Life" />
            <div className="relative min-h-screen w-full overflow-x-hidden bg-white font-sans text-[#1e293b] antialiased transition-colors duration-300 2xl:mx-auto 2xl:max-w-[1780px] dark:bg-[#020202] dark:text-slate-100">
                <Navbar
                    auth={auth}
                    darkMode={darkMode}
                    toggleTheme={toggleTheme}
                />
                <HeroSection />
                <AboutSection />
                <VisionMissionSection />
                <GamifiedMapSection />
                <FaqSection />
                <CtaSection />
                <ContactSection />
                <Footer />
            </div>
        </>
    );
}
