import { login, register } from "@/routes";
import { Head, Link, usePage } from "@inertiajs/react";
import { AnimatePresence, motion, useScroll, useTransform } from "framer-motion";
import { ChevronRight, ArrowRight, LayoutGrid, Menu, Music, Slack, Users, X, Zap, Sparkles, Sun, Moon, MessageCircle } from "lucide-react";
import { useState, useEffect } from "react";


export default function Welcome({ auth }: { auth: { user: any } }) {
    const { url } = usePage()

    const [activeSection, setActiveSection] = useState('home')
    const { scrollY } = useScroll()
    const y1 = useTransform(scrollY, [0, 500], [0, 200])
    const y2 = useTransform(scrollY, [0, 500], [0, -150])

    const [openFaq, setOpenFaq] = useState<number | null>(null)
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

    const toggleFaq = (index: number) => {
        setOpenFaq(openFaq === index ? null : index);
    };
    const [darkMode, setDarkMode] = useState(false)

    useEffect(() => {
        const savedTheme = localStorage.getItem("theme")

        if (savedTheme === "dark") {
            document.documentElement.classList.add("dark")
            setDarkMode(true)
        } else {
            document.documentElement.classList.remove("dark")
            setDarkMode(false)
        }
    }, [])
    const toggleTheme = () => {
        const html = document.documentElement

        if (darkMode) {
            html.classList.remove("dark")
            localStorage.setItem("theme", "light")
        } else {
            html.classList.add("dark")
            localStorage.setItem("theme", "dark")
        }

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
    return (
        <>
            <Head title="SkillVentura - Level Up Your Life" />
            <div className="relative min-h-screen w-full overflow-x-hidden bg-white text-[#1e293b] dark:bg-[#020202] dark:text-slate-100 font-sans antialiased transition-colors duration-300 2xl:max-w-[1780px] 2xl:mx-auto">

                {/* Navbar */}
               <header className="fixed top-0 left-0 right-0 z-50">
                     <motion.nav className="flex w-full items-center justify-between border-b dark:bg-[#04062d] bg-white px-8 py-4  shadow-sm">
                        <div className="flex items-center gap-2">
                            {/* Use existing logo logic or fallback to icon */}
                            <div className="flex items-center justify-center rounded-lg text-white">
                                {/* <Gem size={24} /> */}
                                <img src="/images/logo.png" alt="Logo" className="h-15 w-auto object-contain" />
                            </div>
                            <span style={{ fontFamily: 'Orbitron' }} className=" hidden text-2xl   font-bold tracking-tight mt-3 text-slate-900 dark:text-slate-100 sm:block">
                                SKILL VENTURA
                            </span>
                        </div>

                        <div className="hidden items-center gap-16 text-3xl mt-3 font-black md:flex tracking-wide drop-shadow-sm">

                            <a
                                href="#"
                                onClick={() => setActiveSection('home')}
                                className={`transition-all duration-300  ${activeSection === 'home'
                                    ? 'text-yellow-500 '
                                    : 'text-slate-600 hover:text-yellow-400 dark:text-slate-100'
                                    }`}
                                style={{ fontFamily: 'Lalezar' }}
                            >
                                HOME
                            </a>

                            <a
                                href="#about"
                                onClick={() => setActiveSection('about')}
                                className={`transition-all duration-300 ${activeSection === 'about'
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
                                className={`transition-all duration-300 ${activeSection === 'learn'
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
                                className={`transition-all duration-300 ${activeSection === 'contact'
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
                                className="flex items-center justify-center w-10 h-10 rounded-full bg-white/80 dark:bg-[#0f172a] border border-white/30 dark:border-white/10 shadow hover:scale-105 transition"
                            >
                                {darkMode ? (
                                    <Sun size={18} className="text-yellow-400" />
                                ) : (
                                    <Moon size={18} className="text-slate-700" />
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
                                transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
                                className="fixed top-20 left-0 right-0 z-40
                                    flex flex-col gap-6
                                    border-b border-white/10
                                    bg-white
                                    dark:bg-gradient-to-b from-[#0b1120] to-[#0f172a]
                                    px-6 pt-8 pb-10                              
                                    shadow-2xl
                                    md:hidden
                                    "
                            >
                                <a href="#"
                                    onClick={() => setMobileMenuOpen(false)}
                                    style={{ fontFamily: 'Oxanium' }}
                                    className="text-2xl font-bold text-slate-800 dark:text-slate-100 hover:text-slate-600 dark:hover:text-slate-300  ">
                                    HOME
                                </a>

                                <a href="#about"
                                    onClick={() => setMobileMenuOpen(false)}
                                    style={{ fontFamily: 'Oxanium' }}
                                    className="text-2xl font-bold text-slate-800 dark:text-slate-100 hover:text-slate-600 dark:hover:text-slate-300  ">
                                    ABOUT
                                </a>

                                <a href="#learn"
                                    onClick={() => setMobileMenuOpen(false)}
                                    style={{ fontFamily: 'Oxanium' }}
                                    className="text-2xl font-bold text-slate-800 dark:text-slate-100 hover:text-slate-600 dark:hover:text-slate-300  ">
                                    LEARN
                                </a>

                                <a href="#contact"
                                    onClick={() => setMobileMenuOpen(false)}
                                    style={{ fontFamily: 'Oxanium' }}
                                    className="text-2xl font-bold text-slate-800 dark:text-slate-100 hover:text-slate-600 dark:hover:text-slate-300  ">
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


                {/* Hero Section */}
                <section id="home" className="relative overflow-visible pt-32 pb-40">

                    {/* GLOBAL GLOW LIGHT / DARK */}
                    <div className="absolute -bottom-[250px] right-[-150px] w-[600px] h-[600px] md:w-[900px] md:h-[900px] bg-[#E9E5FF] dark:bg-[#3B28F6]  dark:opacity-60 blur-[180px] dark:blur-[260px] rounded-full -z-10 transition-all duration-500" />
                    <div className="absolute -bottom-[200px] left-0 w-[500px] h-[500px] md:w-[700px] md:h-[700px] bg-blue-200 dark:bg-blue-700  dark:opacity-40 blur-[150px] dark:blur-[220px] rounded-full -z-10 transition-all duration-500" />

                    {/* GRID */}
                    <img src="/images/grid-left.png" className="absolute left-0 top-0 w-1/2 h-[85%] object-cover pointer-events-none [mask-image:linear-gradient(to_bottom,black_80%,transparent_100%)]" />
                    <img src="/images/gird-right.png" className="absolute right-0 top-0 w-1/2 h-[85%] object-cover pointer-events-none [mask-image:linear-gradient(to_bottom,black_80%,transparent_100%)]" />

                    <div className="relative z-10 container mx-auto px-4 md:px-0 lg:px-0 2xl:px-0">
                        <div className="flex flex-col items-center gap-8 lg:flex-row">

                            {/* LEFT TEXT */}
                            <div className="flex-1 text-center px-6 lg:text-left lg:ml-6 ">
                                <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} style={{ fontFamily: "Lalezar" }} className="mb-6 text-4xl md:text-7xl font-black leading-[1.1] tracking-wide text-[#020101] dark:text-white drop-shadow-[4px_3px_0_#FACC15B3]">
                                    Learn The Skills <br /> Play The Game <br /> Level Up Your Live
                                </motion.h1>

                                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="flex justify-center lg:justify-start">
                                    <div className="group inline-block">
                                        <Link href={login()} style={{ fontFamily: "Orbitron" }} className="flex items-center gap-2 rounded-lg bg-yellow-400 text-slate-950 px-8 py-4 text-lg font-bold transition-all duration-200 hover:translate-x-1 hover:shadow-[0_4px_0_rgba(0,0,0,0.4)]">
                                            Start to learn
                                            <ArrowRight size={20} strokeWidth={3} className="transition-transform duration-200 group-hover:translate-x-1" />
                                        </Link>
                                    </div>
                                </motion.div>
                            </div>

                           {/* HERO IMAGE - Hidden Only On Mobile */}
                            <div className="relative flex-1 items-center justify-center hidden sm:flex">

                                {/* INNER GLOW */}
                                <div className="absolute w-[700px] h-[700px] md:w-[700px] md:h-[700px] lg:w-[600px] lg:h-[600px] xl:w-[7300px] xl:h-[700px] 2xl:w-[700px] 2xl:h-[700px] left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-[#3B28F6] dark:bg-[#4c3be1] dark:opacity-60 blur-[500px] dark:blur-[280px] rounded-full -z-10 transition-all duration-500" />
                                <div className="absolute w-[500px] h-[500px] md:w-[700px] md:h-[700px] lg:w-[600px] lg:h-[600px] xl:w-[700px] xl:h-[700px] 2xl:w-[700px] 2xl:h-[700px] left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-[#3B28F6] dark:bg-[#3B28F6] dark:opacity-60 blur-[500px] dark:blur-[220px] rounded-full -z-10 transition-all duration-500" />

                                <img src="/images/play.png" alt="controller" className="relative z-10 w-[260px] md:w-[420px] lg:w-[480px] xl:w-[540px] 2xl:w-[600px] drop-shadow-none dark:drop-shadow-[0_20px_50px_rgba(0,0,0,0.4)] transition-all duration-500" />

                            </div>
                        </div>
                    </div>

                    {/* MARQUEE - ALWAYS VISIBLE */}
                    <div className="relative z-20 mt-24 w-full rotate-[3deg]">
                        <div className="bg-gradient-to-r from-white/80 via-slate-200/60 to-white/80 dark:from-black/70 dark:via-indigo-900/60 dark:to-black/70 backdrop-blur-lg border border-slate-200/50 dark:border-white/10 shadow-lg dark:shadow-2xl transition-all duration-500">
                            <div className="animate-infinite-scroll flex w-max items-center gap-12 md:gap-20 px-6 md:px-10 py-4 md:py-6 text-slate-600 dark:text-white/70 text-sm md:text-base">
                                {[...Array(2)].map((_, i) => (
                                    <div key={i} className="flex items-center gap-12 md:gap-20">
                                        <span className="flex items-center gap-3"><Music size={22} /> Spotify</span>
                                        <span className="flex items-center gap-3"><Slack size={22} /> Slack</span>
                                        <span className="flex items-center gap-3"><LayoutGrid size={22} /> Y Combinator</span>
                                        <span className="flex items-center gap-3"><MessageCircle size={22} /> Discord</span>
                                        <span className="flex items-center gap-3"><Zap size={22} /> Linear</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                </section>

                {/* ===================== ABOUT SECTION ===================== */}
                <section id="about" className="relative py-12 md:py-24 2xl:py-32">
                    <div className="relative z-10 container mx-auto px-6">
                        <div className="mx-auto max-w-4xl 2xl:max-w-6xl">

                            {/* 🔥 CARD UTAMA */}
                            <div className="relative bg-[#13174D] rounded-tl-[18px] md:rounded-tl-[12px] rounded-tr-[24px] md:rounded-tr-[32px] rounded-bl-[32px] md:rounded-bl-[55px] rounded-br-[32px] md:rounded-br-[55px] px-5 sm:px-8 md:px-12 py-14 sm:py-16 md:py-20 overflow-visible shadow-[0_10px_30px_rgba(0,0,0,0.35)] md:shadow-none">

                                {/* 🔥 TOP BADGE (LG ONLY) */}
                                <div className="hidden lg:flex absolute -top-[60px] right-0 h-[100px] px-[90px] bg-[#13174D] items-center justify-center rounded-tr-[32px]">
                                    <div className="absolute -left-[95px] top-0 w-[120px] h-[100px] bg-[#13174D] -skew-x-[50deg]" />
                                    <div className="absolute inset-[18px_30px] border border-cyan-300 rounded-[60px]" />
                                    <span className="font-['Orbitron'] text-[24px] font-semibold tracking-[5px] text-gray-200">About Section</span>
                                </div>

                                <div className="pointer-events-none absolute inset-0 z-[40]">

                                    {/* 🔥 PNG 1 — PHONE (KIRI ATAS) */}
                                    <div className="absolute top-6 left-4 sm:top-10 sm:left-8 md:top-12 md:left-12 lg:top-[20px] lg:left-[280px]">
                                        <img
                                            src="/images/phone.png"
                                            alt="phone"
                                            className="w-16 sm:w-20 md:w-24 lg:w-18 drop-shadow-2xl"
                                        />
                                    </div>

                                    {/* 🔥 PNG 2 — MONITOR (KIRI BAWAH) */}
                                    <div className="absolute bottom-16 left-6 sm:bottom-20 sm:left-12 md:bottom-24 md:left-16 lg:bottom-[1px] lg:left-[60px]">
                                        <img
                                            src="/images/monitor.png"
                                            alt="monitor"
                                            className="w-20 sm:w-24 md:w-28 lg:w-24 drop-shadow-2xl"
                                        />
                                    </div>

                                    {/* 🔥 PNG 3 — GAMEPAD MIRING (KANAN BAWAH) */}
                                    <div className="absolute bottom-14 right-4 sm:bottom-18 sm:right-10 md:none md:bottom-20 md:right-14 lg:bottom-[60px] lg:right-[5px] rotate-[5deg]">
                                        <img
                                            src="/images/gamepad.png"
                                            alt="gamepad"
                                            className="w-20 sm:w-24 md:w-28 lg:w-32 drop-shadow-2xl"
                                        />
                                    </div>

                                </div>
                                {/* 🔥 GRID WRAPPER */}
                                <div className="grid gap-14 sm:gap-16 md:gap-20 md:grid-cols-2">

                                    {/* 🔥 MOBILE HEADER */}
                                    <div className="lg:hidden col-span-full flex justify-center mb-4 sm:mb-6">
                                        <div className="px-6 py-3 rounded-full border border-cyan-300/60 backdrop-blur-md bg-white/5">
                                            <span className="font-['Orbitron'] text-base sm:text-lg tracking-[3px] text-cyan-200">About Section</span>
                                        </div>
                                    </div>

                                    {/* ================= CARD 1 ================= */}
                                    <div className="relative md:mb-0 mb-12 md:translate-x-8 lg:translate-x-0">

                                        <div className="relative bg-[#1D215D] rounded-[28px] p-8 z-10 shadow-[0_12px_30px_rgba(0,0,0,0.4)] md:shadow-[0_15px_35px_rgba(0,0,0,0.45)] lg:shadow-[0_8px_25px_rgba(0,0,0,0.35)] border border-cyan-400/40">

                                            {/* Zigzag Accent (mobile & tab only) */}
                                            <div className="lg:hidden absolute -top-3 left-8 w-16 h-2 bg-cyan-400 rounded-full" />

                                            <p className="text-slate-300 leading-relaxed">
                                                Skill Ventura adalah sebuah project berbasis teknologi yang dirancang untuk mengembangkan keterampilan
                                                pengguna secara progresif melalui pendekatan pembelajaran interaktif dan berbasis tantangan.
                                                Lorem ipsum, dolor sit amet consectetur adipisicing elit. Accusamus repellat delectus beatae?
                                                Eius nemo amet nostrum fugiat recusandae! Fugiat, voluptates?Lorem ipsum dolor sit amet consectetur
                                                adipisicing elit. Pariatur, assumenda?
                                            </p>

                                        </div>

                                        {/* Bottom Badge (LG ONLY) */}
                                        <div className="hidden lg:block absolute -bottom-[38px] left-0 w-[180px] h-[60px] bg-[#1D215D] z-20 rounded-bl-[28px] rounded-br-[28px]" />

                                        {/* Teal Shape (LG ONLY) */}
                                        <div className="hidden lg:block absolute -bottom-[29px] left-[173px] w-[120px] h-[28px] bg-[#13174D] rounded-tl-[15px] rounded-tr-[10px] z-30" />

                                    </div>


                                    {/* ================= CARD 2 ================= */}
                                    <div className="relative mt-10 md:mt-14 lg:mt-0 md:-translate-x-8 lg:translate-x-0">

                                        <div className="relative bg-[#1D215D] rounded-[28px] p-8 z-10 shadow-[0_12px_30px_rgba(0,0,0,0.4)] md:shadow-[0_15px_35px_rgba(0,0,0,0.45)] lg:shadow-[0_8px_25px_rgba(0,0,0,0.35)] border border-cyan-400/40">

                                            {/* Zigzag Accent (mobile & tab only) */}
                                            <div className="lg:hidden absolute -top-3 right-8 w-16 h-2 bg-pink-400 rounded-full" />

                                            <p className="text-slate-300 leading-relaxed">
                                                We gamify the experience to make learning addictive, fun, and effective. Level up your real-world stats while having fun.
                                                Lorem ipsum dolor sit amet, consectetur adipisicing elit. Nihil quod omnis eveniet reprehenderit ab pariatur tempora eum
                                                iure magnam quo nemo id, eligendi corrupti ea. Inventore quibusdam sequi dicta sed reprehenderit optio autem ullam
                                                modi ex eum, voluptatem dolor officiis tempora nihil iusto consequatur. Doloribus!
                                            </p>

                                        </div>

                                        {/* Top Badge (LG ONLY) */}
                                        <div className="hidden lg:block absolute -top-[45px] right-0 w-[210px] h-[70px] bg-[#1D215D] z-20 rounded-tl-[32px] rounded-tr-[32px]" />

                                        {/* Teal Shape (LG ONLY) */}
                                        <div className="hidden lg:block absolute -top-[36px] right-[200px] w-[140px] h-[32px] bg-[#13174D] rounded-bl-[18px] rounded-br-[12px] z-30" />

                                    </div>

                                </div>

                                {/* 🔥 LEKUKAN BAWAH */}
                                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[180px] sm:w-[220px] md:w-[260px] h-[50px] sm:h-[60px] md:h-[70px] bg-white dark:bg-[#020202] rounded-t-[24px] md:rounded-t-[32px]" />

                            </div>

                        </div>
                    </div>
                </section>


                {/* ===================== VISION & MISSION SECTION ===================== */}
                <section className="relative py-12 md:py-20 lg:py-24 2xl:py-32 -mt-24 lg:-mt-34">
                    <div className="relative z-10 container mx-auto px-4 md:px-6">

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">

                            {/* ================= MOBILE TITLE (SM ONLY) ================= */}
                            <div className="md:hidden mt-10 flex justify-center">
                                <div className="relative flex items-center justify-center">

                                    <Sparkles className="absolute -top-7 w-8 h-8 text-purple-400 animate-pulse drop-shadow-[0_0_16px_rgba(168,85,247,1)] drop-shadow-[0_0_32px_rgba(96,165,250,1)]" />
                                    <Sparkles className="absolute -left-9 w-7 h-7 text-blue-400 animate-pulse drop-shadow-[0_0_16px_rgba(96,165,250,1)] drop-shadow-[0_0_32px_rgba(168,85,247,1)]" />

                                    <h2 className="text-3xl font-bold px-4 bg-gradient-to-r from-purple-500 via-violet-400 to-blue-500 bg-clip-text text-transparent drop-shadow-[0_0_18px_rgba(168,85,247,0.9)] drop-shadow-[0_0_30px_rgba(96,165,250,0.9)]" style={{ fontFamily: "Orbitron" }}>
                                        Vision & Mission
                                    </h2>

                                    <Sparkles className="absolute -right-9 w-7 h-7 text-purple-400 animate-pulse drop-shadow-[0_0_16px_rgba(168,85,247,1)] drop-shadow-[0_0_32px_rgba(96,165,250,1)]" />
                                    <Sparkles className="absolute -bottom-7 w-8 h-8 text-blue-400 animate-pulse drop-shadow-[0_0_16px_rgba(96,165,250,1)] drop-shadow-[0_0_32px_rgba(168,85,247,1)]" />

                                </div>
                            </div>



                            {/* ================= LEFT : CIRCLE AREA ================= */}
                            <div className="relative hidden md:flex items-center justify-center lg:-translate-x-16">

                                {/* ================= ARROWS ================= */}
                                <div className="absolute inset-0 z-50 hidden lg:block pointer-events-none">

                                    {/* ---------- ARROW 1 ---------- */}
                                    {/* curve */}
                                    <img
                                        src="/images/arrow/curve1-black.png"
                                        className="absolute dark:hidden
                                        rotate-[0deg] lg:rotate-[-2deg] xl:rotate-[-2deg] 2xl:rotate-[0deg]
                                        w-[26px] lg:w-[30px] xl:w-[33px] 2xl:w-[38px]
                                        top-[26px] lg:top-[28px] xl:top-[37px] 2xl:top-[38px]
                                        right-[135px] lg:right-[110px] xl:right-[160px] 2xl:right-[200px]"
                                    />

                                    <img
                                        src="/images/arrow/curve1.png"
                                        className="absolute hidden dark:block
                                        rotate-[0deg] lg:rotate-[-2deg] xl:rotate-[-2deg] 2xl:rotate-[0deg]
                                        w-[26px] lg:w-[30px] xl:w-[33px] 2xl:w-[38px]
                                        top-[26px] lg:top-[28px] xl:top-[37px] 2xl:top-[38px]
                                        right-[135px] lg:right-[110px] xl:right-[160px] 2xl:right-[200px]"
                                    />

                                    {/* arrow */}
                                    <img
                                        src="/images/arrow/arrow1-black.png"
                                        className="absolute dark:hidden
                                        rotate-[13deg] lg:rotate-[7deg] xl:rotate-[13deg] 2xl:rotate-[13deg]
                                        w-[110px] lg:w-[125px] xl:w-[145px] 2xl:w-[165px]
                                        -top-[30px] lg:-top-[44px] xl:-top-[39px] 2xl:-top-[48px]
                                        right-[35px] lg:right-[11px] xl:right-[37px] 2xl:right-[63px]"
                                    />

                                    <img
                                        src="/images/arrow/arrow1.png"
                                        className="absolute hidden dark:block
                                        rotate-[13deg] lg:rotate-[7deg] xl:rotate-[13deg] 2xl:rotate-[13deg]
                                        w-[110px] lg:w-[125px] xl:w-[145px] 2xl:w-[165px]
                                        -top-[30px] lg:-top-[44px] xl:-top-[39px] 2xl:-top-[48px]
                                        right-[35px] lg:right-[11px] xl:right-[37px] 2xl:right-[63px]"
                                    />

                                    {/* ---------- ARROW 2 ---------- */}
                                    {/* curve */}
                                    <img
                                        src="/images/arrow/curve1-black.png"
                                        className="absolute dark:hidden
                                        rotate-[20deg]
                                        w-[26px] lg:w-[29px] xl:w-[33px] 2xl:w-[38px]
                                        bottom-[115px] lg:bottom-[127px] xl:bottom-[145px] 2xl:bottom-[163px]
                                        right-[120px] lg:right-[89px] xl:right-[138px] 2xl:right-[175px]"
                                    />

                                    <img
                                        src="/images/arrow/curve1.png"
                                        className="absolute hidden dark:block
                                        rotate-[20deg]
                                        w-[26px] lg:w-[29px] xl:w-[33px] 2xl:w-[38px]
                                        bottom-[115px] lg:bottom-[127px] xl:bottom-[145px] 2xl:bottom-[163px]
                                        right-[120px] lg:right-[89px] xl:right-[138px] 2xl:right-[175px]"
                                    />

                                    {/* arrow */}
                                    <img
                                        src="/images/arrow/arrow1-black.png"
                                        className="absolute dark:hidden
                                        rotate-[27deg]
                                        w-[108px] lg:w-[120px] xl:w-[140px] 2xl:w-[160px]
                                        top-[22px] lg:top-[27px] xl:top-[32px] 2xl:top-[33px]
                                        right-[14px] lg:right-[-20px] xl:right-[9px] 2xl:right-[28px]"
                                    />

                                    <img
                                        src="/images/arrow/arrow1.png"
                                        className="absolute hidden dark:block
                                        rotate-[27deg]
                                        w-[108px] lg:w-[120px] xl:w-[140px] 2xl:w-[160px]
                                        top-[22px] lg:top-[27px] xl:top-[32px] 2xl:top-[33px]
                                        right-[14px] lg:right-[-20px] xl:right-[9px] 2xl:right-[28px]"
                                    />

                                    {/* ---------- ARROW 3 ---------- */}
                                    {/* curve */}
                                    <img
                                        src="/images/arrow/curve1-black.png"
                                        className="absolute dark:hidden
                                        rotate-[44deg]
                                        w-[26px] lg:w-[30px] xl:w-[32px] 2xl:w-[38px]
                                        bottom-[70px] lg:bottom-[74px] xl:bottom-[89px] 2xl:bottom-[98px]
                                        right-[120px] lg:right-[88px] xl:right-[138px] 2xl:right-[175px]"
                                    />

                                    <img
                                        src="/images/arrow/curve1.png"
                                        className="absolute hidden dark:block
                                        rotate-[44deg]
                                        w-[26px] lg:w-[30px] xl:w-[32px] 2xl:w-[38px]
                                        bottom-[70px] lg:bottom-[74px] xl:bottom-[89px] 2xl:bottom-[98px]
                                        right-[120px] lg:right-[88px] xl:right-[138px] 2xl:right-[175px]"
                                    />

                                    {/* arrow */}
                                    <img
                                        src="/images/arrow/arrow1-black.png"
                                        className="absolute dark:hidden
                                        rotate-[40deg] lg:rotate-[43deg] xl:rotate-[43deg] 2xl:rotate-[40deg]
                                        w-[110px] lg:w-[125px] xl:w-[145px] 2xl:w-[162px]
                                        bottom-[64px] lg:bottom-[66px] xl:bottom-[75px] 2xl:bottom-[90px]
                                        right-[2px] lg:right-[-37px] xl:right-[-7px] 2xl:right-[11px]"
                                    />

                                    <img
                                        src="/images/arrow/arrow1.png"
                                        className="absolute hidden dark:block
                                        rotate-[40deg] lg:rotate-[43deg] xl:rotate-[43deg] 2xl:rotate-[40deg]
                                        w-[110px] lg:w-[125px] xl:w-[145px] 2xl:w-[162px]
                                        bottom-[64px] lg:bottom-[66px] xl:bottom-[75px] 2xl:bottom-[90px]
                                        right-[2px] lg:right-[-37px] xl:right-[-7px] 2xl:right-[11px]"
                                    />

                                    {/* ---------- ARROW 4 ---------- */}
                                    {/* curve */}
                                    <img
                                        src="/images/arrow/curve1-black.png"
                                        className="absolute dark:hidden
                                        rotate-[65deg]
                                        w-[26px] lg:w-[30px] xl:w-[34px] 2xl:w-[38px]
                                        bottom-[20px] lg:bottom-[26px] xl:bottom-[32px] 2xl:bottom-[38px]
                                        right-[140px] lg:right-[108px] xl:right-[160px] 2xl:right-[200px]"
                                    />

                                    <img
                                        src="/images/arrow/curve1.png"
                                        className="absolute hidden dark:block
                                        rotate-[65deg]
                                        w-[26px] lg:w-[30px] xl:w-[34px] 2xl:w-[38px]
                                        bottom-[20px] lg:bottom-[26px] xl:bottom-[32px] 2xl:bottom-[38px]
                                        right-[140px] lg:right-[108px] xl:right-[160px] 2xl:right-[200px]"
                                    />

                                    {/* arrow */}
                                    <img
                                        src="/images/arrow/arrow1-black.png"
                                        className="absolute dark:hidden
                                        rotate-[54deg] lg:rotate-[64deg] xl:rotate-[64deg] 2xl:rotate-[57deg]
                                        w-[110px] lg:w-[125px] xl:w-[145px] 2xl:w-[165px]
                                        bottom-[14px] lg:bottom-[-10px] xl:bottom-[-11px] 2xl:bottom-[-4px]
                                        right-[14px] lg:right-[-16px] xl:right-[17px] 2xl:right-[29px]"
                                    />

                                    <img
                                        src="/images/arrow/arrow1.png"
                                        className="absolute hidden dark:block
                                        rotate-[54deg] lg:rotate-[64deg] xl:rotate-[64deg] 2xl:rotate-[57deg]
                                        w-[110px] lg:w-[125px] xl:w-[145px] 2xl:w-[165px]
                                        bottom-[14px] lg:bottom-[-10px] xl:bottom-[-11px] 2xl:bottom-[-4px]
                                        right-[14px] lg:right-[-16px] xl:right-[17px] 2xl:right-[29px]"
                                    />

                                </div>


                                {/* ================= CENTER LOGO ================= */}
                                <img
                                    src="/images/Ventura.png"
                                    alt="Ventura Logo"
                                    className="absolute object-contain
                                    w-[260px] lg:w-[295px] xl:w-[337px] 2xl:w-[385px]
                                    top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
                                />


                                {/* ================= COLOR SEGMENT ================= */}
                                <svg
                                    viewBox="0 0 320 320"
                                    className="absolute hidden lg:block z-20 -ml-4
                                    w-[210px] lg:w-[250px] xl:w-[285px] 2xl:w-[320px]
                                    h-[210px] lg:h-[250px] xl:h-[285px] 2xl:h-[320px]"
                                >
                                    <circle cx="160" cy="160" r="153" stroke="#EE0202" strokeWidth="14" fill="none" strokeDasharray="60 901" strokeDashoffset="-60" />
                                    <circle cx="160" cy="160" r="153" stroke="#3B28F6" strokeWidth="14" fill="none" strokeDasharray="60 901" strokeDashoffset="0" />
                                    <circle cx="160" cy="160" r="153" stroke="#68FF57" strokeWidth="14" fill="none" strokeDasharray="60 901" strokeDashoffset="60" />
                                    <circle cx="160" cy="160" r="153" stroke="#F0E427" strokeWidth="14" fill="none" strokeDasharray="60 901" strokeDashoffset="120" />
                                </svg>


                                {/* ================= OUTER CIRCLE ================= */}
                                <div
                                    className="relative rounded-full border-cyan-400 z-10 -ml-4
                                    w-[220px] lg:w-[248px] xl:w-[280px] 2xl:w-[320px]
                                    h-[220px] lg:h-[248px] xl:h-[285px] 2xl:h-[320px]
                                    border-[8px] lg:border-[10px] xl:border-[12px] 2xl:border-[14px]"
                                />

                            </div>
                            {/* ================= RIGHT : CARD LIST ================= */}
                            <div className="space-y-6 lg:space-y-8">

                                {/* ================= CARD 1 ================= */}
                                <div className="relative flex items-center lg:-translate-x-[60px]">

                                    <div className="relative w-[80px] md:w-[95px] lg:w-[110px] h-[80px] md:h-[95px] lg:h-[110px] top-2.5 rounded-full bg-[#161A4E] flex items-center justify-center z-20">
                                        <span className="absolute inset-0 rounded-full border-2 border-blue-500 border-r-transparent border-b-transparent"></span>
                                        <img src="/images/roket.png" className="w-8 md:w-10 lg:w-12 object-contain" />
                                    </div>

                                    <div className="absolute left-[60px] md:left-[70px] lg:left-[74px] top-[54px] md:top-[45px] lg:top-[50px] bg-[#F0E427] text-black px-4 md:px-6 lg:px-8 py-2 md:py-3 lg:py-4 font-semibold z-10 rounded-tl-[20px] rounded-tr-[22px] rounded-bl-[3px] rounded-br-[22px]">
                                        <p className="ml-2 font-bold text-sm md:text-base" style={{ fontFamily: "Orbitron" }}>Mission</p>
                                    </div>

                                    <div className="-ml-[20px] lg:-ml-[30px] flex-1 bg-[#161A4E] border border-[#F0E427] border-[3px] h-[90px] md:h-[95px] lg:h-[100px] rounded-tl-[200px] lg:rounded-tl-[250px] rounded-bl-[10px] rounded-tr-[70px] lg:rounded-tr-[90px] rounded-br-[70px] lg:rounded-br-[90px] flex items-center pl-[110px] md:pl-[120px] lg:pl-[135px] pr-4 lg:pr-6">
                                        <p className="text-gray-300 text-xs md:text-sm leading-relaxed font-extrabold" style={{ fontFamily: "Oxanium" }}>
                                            Lorem ipsum dolor sit amet consectetur adipisicing elit.
                                        </p>
                                    </div>

                                </div>

                                {/* ================= CARD 2 ================= */}
                                <div className="relative flex items-center">

                                    <div className="relative w-[80px] md:w-[95px] lg:w-[110px] h-[80px] md:h-[95px] lg:h-[110px] top-2.5 rounded-full bg-[#161A4E] flex items-center justify-center z-20">
                                        <span className="absolute inset-0 rounded-full border-2 border-blue-500 border-r-transparent border-b-transparent"></span>
                                        <img src="/images/lamp.png" className="w-8 md:w-10 lg:w-12 object-contain" />
                                    </div>

                                    <div className="absolute left-[60px] md:left-[70px] lg:left-[74px] top-[54px] md:top-[45px] lg:top-[50px] bg-[#68FF57] text-black px-4 md:px-6 lg:px-8 py-2 md:py-3 lg:py-4 font-semibold z-10 rounded-tl-[20px] rounded-tr-[22px] rounded-bl-[3px] rounded-br-[22px]">
                                        <p className="ml-2 font-bold text-sm md:text-base" style={{ fontFamily: "Orbitron" }}>Vision</p>
                                    </div>

                                    <div className="-ml-[20px] lg:-ml-[30px] flex-1 bg-[#161A4E] border border-[#F0E427] border-[3px] h-[90px] md:h-[95px] lg:h-[100px] rounded-tl-[200px] lg:rounded-tl-[250px] rounded-bl-[10px] rounded-tr-[70px] lg:rounded-tr-[90px] rounded-br-[70px] lg:rounded-br-[90px] flex items-center pl-[110px] md:pl-[120px] lg:pl-[135px] pr-4 lg:pr-6">
                                        <p className="text-gray-300 text-xs md:text-sm leading-relaxed font-extrabold" style={{ fontFamily: "Oxanium" }}>
                                            Becoming the leading gamified learning ecosystem.
                                        </p>
                                    </div>

                                </div>

                                {/* ================= CARD 3 ================= */}
                                <div className="relative flex items-center">

                                    <div className="relative w-[80px] md:w-[95px] lg:w-[110px] h-[80px] md:h-[95px] lg:h-[110px] top-2.5 rounded-full bg-[#161A4E] flex items-center justify-center z-20">
                                        <span className="absolute inset-0 rounded-full border-2 border-blue-500 border-r-transparent border-b-transparent"></span>
                                        <img src="/images/diamond.png" className="w-8 md:w-10 lg:w-12 object-contain" />
                                    </div>

                                    <div className="absolute left-[60px] md:left-[70px] lg:left-[74px] top-[54px] md:top-[45px] lg:top-[50px] bg-[#3B28F6] text-black px-4 md:px-6 lg:px-8 py-2 md:py-3 lg:py-4 font-semibold z-10 rounded-tl-[20px] rounded-tr-[22px] rounded-bl-[3px] rounded-br-[22px]">
                                        <p className="ml-2 font-bold text-sm md:text-base" style={{ fontFamily: "Orbitron" }}>Value</p>
                                    </div>

                                    <div className="-ml-[20px] lg:-ml-[30px] flex-1 bg-[#161A4E] border border-[#F0E427] border-[3px] h-[90px] md:h-[95px] lg:h-[100px] rounded-tl-[200px] lg:rounded-tl-[250px] rounded-bl-[10px] rounded-tr-[70px] lg:rounded-tr-[90px] rounded-br-[70px] lg:rounded-br-[90px] flex items-center pl-[110px] md:pl-[120px] lg:pl-[135px] pr-4 lg:pr-6">
                                        <p className="text-gray-300 text-xs md:text-sm leading-relaxed font-extrabold" style={{ fontFamily: "Oxanium" }}>
                                            Innovation, accessibility, and community learning.
                                        </p>
                                    </div>

                                </div>

                                {/* ================= CARD 4 ================= */}
                                <div className="relative flex items-center lg:-translate-x-[60px]">

                                    <div className="relative w-[80px] md:w-[95px] lg:w-[110px] h-[80px] md:h-[95px] lg:h-[110px] top-2.5 rounded-full bg-[#161A4E] flex items-center justify-center z-20">
                                        <span className="absolute inset-0 rounded-full border-2 border-blue-500 border-r-transparent border-b-transparent"></span>
                                        <img src="/images/target.png" className="w-8 md:w-10 lg:w-12 object-contain" />
                                    </div>

                                    <div className="absolute left-[60px] md:left-[70px] lg:left-[74px] top-[54px] md:top-[45px] lg:top-[50px] bg-red-700 text-black px-4 md:px-6 lg:px-8 py-2 md:py-3 lg:py-4 font-semibold z-10 rounded-tl-[20px] rounded-tr-[22px] rounded-bl-[3px] rounded-br-[22px]">
                                        <p className="ml-2 font-bold text-sm md:text-base" style={{ fontFamily: "Orbitron" }}>Goals</p>
                                    </div>

                                    <div className="-ml-[20px] lg:-ml-[30px] flex-1 bg-[#161A4E] border border-[#F0E427] border-[3px] h-[90px] md:h-[95px] lg:h-[100px] rounded-tl-[200px] lg:rounded-tl-[250px] rounded-bl-[10px] rounded-tr-[70px] lg:rounded-tr-[90px] rounded-br-[70px] lg:rounded-br-[90px] flex items-center pl-[110px] md:pl-[120px] lg:pl-[135px] pr-4 lg:pr-6">
                                        <p className="text-gray-300 text-xs md:text-sm leading-relaxed font-extrabold" style={{ fontFamily: "Oxanium" }}>
                                            Empower learners with real-world tech skills.
                                        </p>
                                    </div>

                                </div>

                            </div>

                        </div>
                    </div>
                </section>

                {/* Gamified Map Section */}
                <section
                    id="learn"
                    className="relativ overflow-hidden bg-[#0f172a] py-24">
                    <div className="relative z-10 container mx-auto px-6 text-center">
                        <div className="mb-16">
                            <h2 className="mb-4 text-3xl font-black text-white md:text-5xl">
                                Gamified Learning for Every Skill Level
                            </h2>
                            <p className="text-slate-400">
                                Level Up Your Skills Through VENTURA'S Gamified
                                Learning Roadmap
                            </p>
                        </div>

                        <div className="mb-12 flex justify-center gap-4">
                            <span className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-slate-300">
                                Interactive Lessons
                            </span>
                            <span className="rounded-full bg-blue-600 px-4 py-2 text-sm font-bold text-white shadow-lg shadow-blue-600/20">
                                Beginner Path
                            </span>
                            <span className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-slate-300">
                                Instant Start
                            </span>
                            <span className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-slate-300">
                                Real Simulations
                            </span>
                        </div>

                        {/* Map Visual Fallback */}
                        <div className="group relative mx-auto aspect-video w-full max-w-5xl overflow-hidden rounded-3xl border border-white/10 bg-[#1e293b] shadow-2xl">
                            {/* Map Pattern */}
                            <div className="absolute inset-0 bg-[url('https://upload.wikimedia.org/wikipedia/commons/e/ec/World_map_blank_without_borders.svg')] bg-cover bg-center opacity-20 grayscale" />

                            {/* Grid Overlay */}
                            <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:40px_40px]" />

                            {/* Map Points */}
                            <MapPoint
                                top="30%"
                                left="20%"
                                label="Basis Realm"
                            />
                            <MapPoint
                                top="50%"
                                left="50%"
                                label="Grand Line (New World)"
                                color="bg-yellow-400"
                            />
                            <MapPoint
                                top="70%"
                                left="80%"
                                label="Expert Zone"
                            />
                        </div>
                    </div>
                </section>

                {/* FAQ Section */}
                <section className="relative md:py-24 py-16 2xl:py-32">
                    <div className="container mx-auto max-w-4xl px-6">

                        {/* Title */}
                        <h2 className="mb-16 text-center text-4xl font-black">
                            <span className="text-[#3B28F6]">Frequently Asked </span>
                            <span className="text-[#FACC15]">Questions</span>
                        </h2>

                        {/* FAQ List */}
                        <div className="flex flex-col border border-[#3c418a]">

                            {[
                                'What is SKILL VENTURA and how does it work?',
                                'Do I need prior experience to start learning?',
                                'Are the lessons designed for beginners?',
                                'How does the gamified learning system work?',
                                'What Skills can I learn on SKILL VENTURA?',
                                'Is there a structured learning roadmap to follow?',
                                'How do missions and challenges help me improve?',
                                'Do I earn XP or rewards as I complete tasks?',
                                'Can I learn at my own pace?',
                                'Does SKILL VENTURA provide a structured learning roadmap?',
                            ].map((q, i) => (
                                <div key={i} className="border-b border-[#3c418a] last:border-none">

                                    <button
                                        onClick={() => toggleFaq(i)}
                                        className="flex w-full items-center justify-between bg-[#1D215D] px-6 py-5 text-left text-white transition-all"
                                    >
                                        <div className="flex items-center gap-4">

                                            {/* Yellow Dot */}
                                            <div className="h-4 w-4 rounded-full bg-yellow-400" />

                                            <span className="font-medium tracking-wide">
                                                {q}
                                            </span>
                                        </div>

                                        {/* Arrow */}
                                        <ChevronRight
                                            className={`transition-transform duration-300 ${openFaq === i
                                                ? 'rotate-90 text-white'
                                                : 'text-white'
                                                }`}
                                        />
                                    </button>

                                    <AnimatePresence>
                                        {openFaq === i && (
                                            <motion.div
                                                initial={{ height: 0, opacity: 0 }}
                                                animate={{ height: 'auto', opacity: 1 }}
                                                exit={{ height: 0, opacity: 0 }}
                                                className="overflow-hidden bg-[#1D215D]"
                                            >
                                                <div className="px-14 pb-6 pt-2 text-sm leading-relaxed text-gray-200">
                                                    Yes, Skill Ventura offers a comprehensive
                                                    learning experience tailored to your needs.
                                                    We combine theory with practice in a fun,
                                                    engaging way.
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* CTA Footer */}
                <section className="relative py-4 mt-[-20px]">

                    {/* Outer Glow */}
                    <div className="pointer-events-none absolute top-[-70px] left-39">
                        <div className="h-[200px] w-[200px] rounded-full bg-blue-800 blur-[70px] animate-pulse"></div>
                    </div>

                    <div className="container relative z-10 mx-auto flex justify-center px-4 sm:px-6">

                        {/* CTA Card */}
                        <div className="relative w-full max-w-[990px] min-h-[180px] md:min-h-[200px] lg:min-h-[240px] rounded-tl-[370px] rounded-tr-[20px] rounded-bl-[20px] rounded-br-[370px] border border-white bg-[#1D215D] shadow-2xl flex flex-col items-center justify-center text-center px-6 sm:px-8 md:px-10 lg:px-12 py-8 md:py-10">

                            <h2 className="max-w-[650px] text-white font-bold leading-tight text-lg sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl" style={{ fontFamily: "Orbitron" }}>
                                Join Us to Learn Level Up and <br />
                                Master Real-World Tech Skills
                            </h2>

                            <button
                                onClick={() => window.location.href = "https://discord.gg/yourlink"}
                                className="mt-4 md:mt-5 flex items-center gap-2 rounded-xl bg-gradient-to-r from-purple-500 via-violet-500 to-blue-500 text-white font-bold px-5 py-2 sm:px-6 sm:py-3 md:px-8 md:py-4 shadow-lg transition hover:scale-105"
                                style={{ fontFamily: "Orbitron" }}
                            >
                                Join Community <Users size={20} />
                            </button>

                        </div>

                    </div>

                </section>

                {/* CONTACT SECTION */}
                <section id="contact" className="pt-20 sm:pt-24 md:pt-32 pb-16 sm:pb-20 md:pb-24">
                <div className="container mx-auto px-6">

                    {/* Title */}
                    <h2
                    className="mb-10 sm:mb-12 md:mb-16 text-center text-3xl sm:text-4xl md:text-5xl font-extrabold text-transparent bg-[#3B28F6] bg-clip-text"
                    style={{ fontFamily: "lalezar" }}
                    >
                    Contact <span className="text-[#FACC15]"> Us </span>
                    </h2>

                    <div className="grid items-center gap-10 md:gap-12 md:grid-cols-2">

                    {/* LEFT TEXT */}
                    <div className="text-center md:text-left">
                        <h3 className="mb-4 sm:mb-6 text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
                        Kontak Kami
                        </h3>

                        <p className="mb-4 sm:mb-6 leading-relaxed text-gray-600 dark:text-gray-300 text-sm sm:text-base">
                        SKILL VENTURA contact support is available Monday to Friday,
                        from 8 AM to 4 PM. During these hours, our team is ready to
                        assist with questions, guidance, or any support you need while
                        using the platform. Messages sent outside these hours will be
                        answered on the next working day.
                        </p>

                        <p className="leading-relaxed text-gray-600 dark:text-gray-300 text-sm sm:text-base">
                        We remain committed to providing helpful and timely support
                        to ensure your learning experience on SKILL VENTURA stays
                        smooth and enjoyable.
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


                {/* FOOTER */}
                <footer className="border-t border-gray-200 dark:border-white/10 pt-12 sm:pt-14 md:pt-16 pb-10">

                <div className="container mx-auto px-6 grid gap-12 md:grid-cols-4">

                    {/* BRAND */}
                    <div className="text-center md:text-left max-w-sm mx-auto md:mx-0">

                    <div className="flex items-center justify-center md:justify-start gap-3 mb-4">
                        <img src="/images/logo.png" className="w-10" />

                        <div>
                        <h3 className="font-bold text-lg text-gray-900 dark:text-white">
                            SKILL VENTURA
                        </h3>

                        <p className="text-xs text-gray-500 dark:text-gray-400">
                            Learn Like a Hero, Grow Like a Pro
                        </p>
                        </div>
                    </div>

                    <h4 className="font-semibold mb-2 text-gray-900 dark:text-white">
                        Learn in SKILL VENTURA
                    </h4>

                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 leading-relaxed">
                        A gamified learning platform where you level up through real
                        projects, missions, and a guided skill-building roadmap.
                    </p>

                    <div className="space-y-1 text-sm text-gray-600 dark:text-gray-400">
                        <p>📍 Bogor, Indonesia</p>
                        <p>📞 +62 223 4432 5968</p>
                    </div>

                    </div>


                    {/* SOCIAL MEDIA */}
                    <div className="flex flex-col items-center gap-6">

                    <h4 className="text-lg font-semibold text-gray-900 dark:text-white">
                        Social Media
                    </h4>

                    <div className="flex gap-6 text-xl">

                        <i className="fa-brands fa-instagram text-pink-500 hover:scale-110 transition cursor-pointer"></i>

                        <i className="fa-brands fa-whatsapp text-green-500 hover:scale-110 transition cursor-pointer"></i>

                        <i className="fa-brands fa-facebook text-blue-600 hover:scale-110 transition cursor-pointer"></i>

                        <i className="fa-brands fa-github text-gray-900 dark:text-white hover:scale-110 transition cursor-pointer"></i>

                        <i className="fa-brands fa-x-twitter text-gray-900 dark:text-white hover:scale-110 transition cursor-pointer"></i>

                        <i className="fa-brands fa-linkedin text-blue-700 hover:scale-110 transition cursor-pointer"></i>

                    </div>

                    </div>


                 {/* PROGRAM */}
                    <div className="text-center md:text-left">

                    <h4 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">
                        Program
                    </h4>

                    <ul className="space-y-2 sm:space-y-0 sm:flex sm:flex-wrap sm:justify-center md:justify-start sm:gap-x-6 sm:gap-y-2 text-sm text-gray-600 dark:text-gray-400">

                        <li>Online course</li>
                        <li>Bootcamp</li>
                        <li>Learn gaming</li>
                        <li>Corporate training</li>
                        <li>Partnership</li>

                    </ul>

                    </div>


            {/* COMPANY & SUPPORT */}
            <div className="grid grid-cols-2 gap-8 text-center md:text-left">

            {/* COMPANY */}
            <div>
                <h4 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">
                Company
                </h4>

                <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                <li>About us</li>
                <li>Blog</li>
                <li>Learn</li>
                <li>Komunitas</li>
                </ul>
            </div>


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

function MapPoint({
    top,
    left,
    label,
    color = 'bg-white',
}: {
    top: string;
    left: string;
    label: string;
    color?: string;
}) {
    return (
        <div
            className="group absolute -translate-x-1/2 -translate-y-1/2 transform cursor-pointer"
            style={{ top, left }}
        >
            <div
                className={`h-4 w-4 rounded-full ${color} animate-pulse shadow-[0_0_20px_currentColor]`}
            />
            <div className="pointer-events-none absolute top-6 left-1/2 -translate-x-1/2 rounded-md bg-black/80 px-3 py-1 text-xs font-bold whitespace-nowrap text-white opacity-0 transition-opacity group-hover:opacity-100">
                {label}
            </div>
        </div>
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
