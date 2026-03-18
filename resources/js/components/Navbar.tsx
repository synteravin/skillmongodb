import { login, register } from '@/routes';
import { Link } from '@inertiajs/react';
import { Menu, X, Sun, Moon } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Navbar({
    auth,
    activeSection,
    setActiveSection,
    mobileMenuOpen,
    setMobileMenuOpen,
    darkMode,
    toggleTheme,
}: any) {
    return (
        <header className="fixed top-0 right-0 left-0 z-50">
            <motion.nav className="flex w-full items-center justify-between border-b bg-white px-8 py-4 shadow-sm dark:bg-[#04062d]">
                {/* LOGO */}

                <div className="flex items-center gap-2">
                    <img
                        src="/images/logo.png"
                        className="h-15 w-auto object-contain"
                    />

                    <span
                        style={{ fontFamily: 'Orbitron' }}
                        className="mt-3 hidden text-2xl font-bold tracking-tight text-slate-900 sm:block dark:text-slate-100"
                    >
                        SKILL VENTURA
                    </span>
                </div>

                {/* MENU */}

                <div className="mt-3 hidden items-center gap-16 text-3xl font-black tracking-wide drop-shadow-sm md:flex">
                    <a
                        href="#"
                        onClick={() => setActiveSection('home')}
                        className={
                            activeSection === 'home'
                                ? 'text-yellow-500'
                                : 'text-slate-600 hover:text-yellow-400 dark:text-slate-100'
                        }
                        style={{ fontFamily: 'Lalezar' }}
                    >
                        HOME
                    </a>

                    <a
                        href="#about"
                        onClick={() => setActiveSection('about')}
                        className={
                            activeSection === 'about'
                                ? 'text-yellow-500'
                                : 'text-slate-600 hover:text-yellow-400 dark:text-slate-100'
                        }
                        style={{ fontFamily: 'Lalezar' }}
                    >
                        ABOUT
                    </a>

                    <a
                        href="#learn"
                        onClick={() => setActiveSection('learn')}
                        className={
                            activeSection === 'learn'
                                ? 'text-yellow-500'
                                : 'text-slate-600 hover:text-yellow-400 dark:text-slate-100'
                        }
                        style={{ fontFamily: 'Lalezar' }}
                    >
                        LEARN
                    </a>

                    <a
                        href="#contact"
                        onClick={() => setActiveSection('contact')}
                        className={
                            activeSection === 'contact'
                                ? 'text-yellow-500'
                                : 'text-slate-600 hover:text-yellow-400 dark:text-slate-100'
                        }
                        style={{ fontFamily: 'Lalezar' }}
                    >
                        CONTACT
                    </a>
                </div>

                {/* BUTTON */}

                <div className="hidden items-center gap-3 md:flex">
                    <Link
                        href={login()}
                        className="rounded-sm bg-blue-600 px-5 py-2.5 text-sm font-bold text-white"
                    >
                        Login
                    </Link>

                    <Link
                        href={register()}
                        className="rounded-xl bg-yellow-400 px-5 py-2.5 text-sm font-bold text-black"
                    >
                        Register
                    </Link>

                    <button
                        onClick={toggleTheme}
                        className="flex h-10 w-10 items-center justify-center rounded-full bg-white/80 dark:bg-[#0f172a]"
                    >
                        {darkMode ? <Sun size={18} /> : <Moon size={18} />}
                    </button>
                </div>

                <button
                    className="p-2 text-slate-600 md:hidden"
                    onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                >
                    {mobileMenuOpen ? <X /> : <Menu />}
                </button>
            </motion.nav>
        </header>
    );
}
