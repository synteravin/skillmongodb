import { login, register } from '@/routes';
import { Link } from '@inertiajs/react';
import { AnimatePresence, motion } from 'framer-motion';
import { Menu, X, Sun, Moon } from 'lucide-react';
import { useState } from 'react';

export default function Navbar({ auth, darkMode, toggleTheme }: { auth: any, darkMode: boolean, toggleTheme: () => void }) {
    const [activeSection, setActiveSection] = useState('home');
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    return (
        <header className="fixed top-0 right-0 left-0 z-50">
            <motion.nav className="flex w-full items-center justify-between border-b bg-white px-8 py-4 shadow-sm dark:bg-[#04062d]">
                <div className="flex items-center gap-2">
                    {/* Use existing logo logic or fallback to icon */}
                    <div className="flex items-center justify-center rounded-lg text-white">
                        {/* <Gem size={24} /> */}
                        <img
                            src="/images/logo.png"
                            alt="Logo"
                            className="h-15 w-auto object-contain"
                        />
                    </div>
                    <span
                        style={{ fontFamily: 'Orbitron' }}
                        className="mt-3 hidden text-2xl font-bold tracking-tight text-slate-900 sm:block dark:text-slate-100"
                    >
                        SKILL VENTURA
                    </span>
                </div>

                <div className="mt-3 hidden items-center gap-16 text-3xl font-black tracking-wide drop-shadow-sm md:flex">
                    <a
                        href="#"
                        onClick={() => setActiveSection('home')}
                        className={`transition-all duration-300 ${
                            activeSection === 'home'
                                ? 'text-yellow-500'
                                : 'text-slate-600 hover:text-yellow-400 dark:text-slate-100'
                        }`}
                        style={{ fontFamily: 'Lalezar' }}
                    >
                        HOME
                    </a>

                    <a
                        href="#about"
                        onClick={() => setActiveSection('about')}
                        className={`transition-all duration-300 ${
                            activeSection === 'about'
                                ? 'text-yellow-500'
                                : 'text-slate-600 hover:text-yellow-400 dark:text-slate-100'
                        }`}
                        style={{ fontFamily: 'Lalezar' }}
                    >
                        ABOUT
                    </a>

                    <a
                        href="#learn"
                        onClick={() => setActiveSection('learn')}
                        className={`transition-all duration-300 ${
                            activeSection === 'learn'
                                ? 'text-yellow-500'
                                : 'text-slate-600 hover:text-yellow-400 dark:text-slate-100'
                        }`}
                        style={{ fontFamily: 'Lalezar' }}
                    >
                        LEARN
                    </a>

                    <a
                        href="#contact"
                        onClick={() => setActiveSection('contact')}
                        className={`transition-all duration-300 ${
                            activeSection === 'contact'
                                ? 'text-yellow-500'
                                : 'text-slate-600 hover:text-yellow-400 dark:text-slate-100'
                        }`}
                        style={{ fontFamily: 'Lalezar' }}
                    >
                        CONTACT
                    </a>
                </div>

                <div className="hidden items-center gap-3 md:flex">
                    {auth?.user ? (
                        <Link
                            href={
                                auth.user.role === 'admin'
                                    ? '/admin/dashboard'
                                    : auth.user.role === 'mentor'
                                      ? '/mentor/dashboard'
                                      : '/student/dashboard'
                            }
                            className="rounded-xs bg-blue-600 px-5 py-2.5 text-sm font-bold text-white shadow-lg shadow-blue-600/20 transition-all hover:bg-blue-700"
                        >
                            Dashboard
                        </Link>
                    ) : (
                        <>
                            <Link
                                href={login()}
                                className="rounded-sm bg-blue-600 px-5 py-2.5 text-sm font-bold text-white shadow-lg shadow-blue-600/20 transition-all hover:bg-blue-700"
                            >
                                Login
                            </Link>
                            <Link
                                href={register()}
                                className="rounded-xl bg-yellow-400 px-5 py-2.5 text-sm font-bold text-black shadow-lg shadow-yellow-400/20 transition-all hover:bg-yellow-300"
                            >
                                Register
                            </Link>
                        </>
                    )}
                    <button
                        onClick={toggleTheme}
                        className="flex h-10 w-10 items-center justify-center rounded-full border border-white/30 bg-white/80 shadow transition hover:scale-105 dark:border-white/10 dark:bg-[#0f172a]"
                    >
                        {darkMode ? (
                            <Sun
                                size={18}
                                className="text-yellow-400"
                            />
                        ) : (
                            <Moon
                                size={18}
                                className="text-slate-700"
                            />
                        )}
                    </button>
                </div>

                {/* Mobile Menu Toggle */}
                <button
                    className="p-2 text-slate-600 md:hidden"
                    onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                >
                    {mobileMenuOpen ? <X /> : <Menu />}
                </button>
            </motion.nav>

            {/* Mobile Menu */}
            <AnimatePresence>
                {mobileMenuOpen && (
                    <motion.div
                        initial={{ y: -40 }}
                        animate={{ y: 0 }}
                        exit={{ y: 0 }}
                        transition={{
                            duration: 0.2,
                            ease: [0.4, 0, 0.2, 1],
                        }}
                        className="fixed top-20 right-0 left-0 z-40 flex flex-col gap-6 border-b border-white/10 bg-white from-[#0b1120] to-[#0f172a] px-6 pt-8 pb-10 shadow-2xl md:hidden dark:bg-gradient-to-b"
                    >
                        <a
                            href="#"
                            onClick={() => setMobileMenuOpen(false)}
                            style={{ fontFamily: 'Oxanium' }}
                            className="text-2xl font-bold text-slate-800 hover:text-slate-600 dark:text-slate-100 dark:hover:text-slate-300"
                        >
                            HOME
                        </a>

                        <a
                            href="#about"
                            onClick={() => setMobileMenuOpen(false)}
                            style={{ fontFamily: 'Oxanium' }}
                            className="text-2xl font-bold text-slate-800 hover:text-slate-600 dark:text-slate-100 dark:hover:text-slate-300"
                        >
                            ABOUT
                        </a>

                        <a
                            href="#learn"
                            onClick={() => setMobileMenuOpen(false)}
                            style={{ fontFamily: 'Oxanium' }}
                            className="text-2xl font-bold text-slate-800 hover:text-slate-600 dark:text-slate-100 dark:hover:text-slate-300"
                        >
                            LEARN
                        </a>

                        <a
                            href="#contact"
                            onClick={() => setMobileMenuOpen(false)}
                            style={{ fontFamily: 'Oxanium' }}
                            className="text-2xl font-bold text-slate-800 hover:text-slate-600 dark:text-slate-100 dark:hover:text-slate-300"
                        >
                            CONTACT
                        </a>

                        <div className="my-4 h-px bg-white/10" />

                        <Link
                            href={login()}
                            className="w-full rounded-lg bg-blue-600 py-3 text-center font-bold text-white"
                        >
                            Login
                        </Link>

                        <Link
                            href={register()}
                            className="w-full rounded-lg bg-yellow-400 py-3 text-center font-bold text-black"
                        >
                            Join For Free
                        </Link>
                    </motion.div>
                )}
            </AnimatePresence>
        </header>
    );
}
