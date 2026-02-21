import { login, register } from '@/routes';
import { Head, Link } from '@inertiajs/react';
import {
    AnimatePresence,
    motion,
    useScroll,
    useTransform,
} from 'framer-motion';
import {
    ChevronRight,
    Flame,
    Gamepad2,
    Gem,
    Headset,
    LayoutGrid,
    Menu,
    MessageCircle,
    Music,
    Rocket,
    Slack,
    Users,
    X,
    Zap,
} from 'lucide-react';
import { useState } from 'react';

export default function Welcome({ auth }: { auth: { user: any } }) {
    const { scrollY } = useScroll();
    const y1 = useTransform(scrollY, [0, 500], [0, 200]);
    const y2 = useTransform(scrollY, [0, 500], [0, -150]);

    const [openFaq, setOpenFaq] = useState<number | null>(null);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    const toggleFaq = (index: number) => {
        setOpenFaq(openFaq === index ? null : index);
    };

    return (
        <>
            <Head title="SkillVentura - Level Up Your Life" />

            <div className="relative min-h-screen w-full overflow-x-hidden bg-[#f3f4f6] font-sans text-[#1e293b] antialiased selection:bg-yellow-400 selection:text-black">
                {/* Navbar */}
                <header className="fixed top-0 right-0 left-0 z-50 px-4 py-4 md:px-8 md:py-6">
                    <nav className="mx-auto flex max-w-7xl items-center justify-between rounded-full border border-white/50 bg-white/80 px-6 py-3 shadow-sm backdrop-blur-md">
                        <div className="flex items-center gap-2">
                            {/* Use existing logo logic or fallback to icon */}
                            <div className="flex h-14 w-14 items-center justify-center rounded-lg text-white">
                                {/* <Gem size={24} /> */}
                                <img src="/images/logo.png" alt="Logo" />
                            </div>
                            <span className="hidden text-lg font-bold tracking-tight text-slate-900 sm:block">
                                SKILL VENTURA
                            </span>
                        </div>

                        <div className="hidden items-center gap-8 text-sm font-medium text-slate-600 md:flex">
                            <a href="#" className="font-bold text-yellow-500">
                                HOME
                            </a>
                            <a
                                href="#about"
                                className="transition-colors hover:text-blue-600"
                            >
                                ABOUT
                            </a>
                            <a
                                href="#learn"
                                className="transition-colors hover:text-blue-600"
                            >
                                LEARN
                            </a>
                            <a
                                href="#contact"
                                className="transition-colors hover:text-blue-600"
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
                                    className="rounded-full bg-blue-600 px-5 py-2.5 text-sm font-bold text-white shadow-lg shadow-blue-600/20 transition-all hover:bg-blue-700"
                                >
                                    Dashboard
                                </Link>
                            ) : (
                                <>
                                    <Link
                                        href={login()}
                                        className="rounded-full bg-blue-600 px-5 py-2.5 text-sm font-bold text-white shadow-lg shadow-blue-600/20 transition-all hover:bg-blue-700"
                                    >
                                        Login
                                    </Link>
                                    <Link
                                        href={register()}
                                        className="rounded-full bg-yellow-400 px-5 py-2.5 text-sm font-bold text-black shadow-lg shadow-yellow-400/20 transition-all hover:bg-yellow-300"
                                    >
                                        Register
                                    </Link>
                                </>
                            )}
                        </div>

                        {/* Mobile Menu Toggle */}
                        <button
                            className="p-2 text-slate-600 md:hidden"
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        >
                            {mobileMenuOpen ? <X /> : <Menu />}
                        </button>
                    </nav>

                    {/* Mobile Menu */}
                    <AnimatePresence>
                        {mobileMenuOpen && (
                            <motion.div
                                initial={{ opacity: 0, y: -20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                className="absolute top-20 right-4 left-4 z-50 flex flex-col gap-4 rounded-2xl border border-slate-100 bg-white p-6 shadow-xl md:hidden"
                            >
                                <a
                                    href="#"
                                    className="font-bold text-yellow-500"
                                >
                                    HOME
                                </a>
                                <a
                                    href="#about"
                                    className="font-medium text-slate-600"
                                >
                                    ABOUT
                                </a>
                                <a
                                    href="#learn"
                                    className="font-medium text-slate-600"
                                >
                                    LEARN
                                </a>
                                <a
                                    href="#contact"
                                    className="font-medium text-slate-600"
                                >
                                    CONTACT
                                </a>
                                <div className="my-2 h-px bg-slate-100" />
                                <Link
                                    href={login()}
                                    className="w-full rounded-xl bg-blue-50 py-3 text-center font-bold text-blue-600"
                                >
                                    Login
                                </Link>
                                <Link
                                    href={register()}
                                    className="w-full rounded-xl bg-yellow-400 py-3 text-center font-bold text-black"
                                >
                                    Join For Free
                                </Link>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </header>

                {/* Hero Section */}
                <section className="relative overflow-hidden bg-[#e0efff] pt-32 pb-20">
                    {/* Grid Background */}
                    <div className="absolute inset-0 bg-[linear-gradient(rgba(59,130,246,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(59,130,246,0.1)_1px,transparent_1px)] [mask-image:radial-gradient(ellipse_at_center,black_40%,transparent_80%)] bg-[size:40px_40px]" />

                    <div className="relative z-10 container mx-auto px-3">
                        <div className="flex flex-col items-center gap-8 lg:flex-row">
                            <div className="flex-1 text-center lg:text-left">
                                <motion.h1
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="mb-6 text-4xl leading-[1.1] font-black tracking-tight text-slate-900 md:text-6xl"
                                >
                                    Learn The Skills
                                    <br />
                                    <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                                        Play The Game
                                    </span>
                                    <br />
                                    Level Up Your Live
                                </motion.h1>

                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.1 }}
                                    className="mb-12 flex flex-col items-center justify-center gap-4 sm:flex-row lg:justify-start"
                                >
                                    <button className="flex transform items-center gap-2 rounded-xl bg-yellow-400 px-8 py-4 text-lg font-extrabold text-black shadow-[0_10px_20px_-5px_rgba(250,204,21,0.4)] transition-all hover:-translate-y-1 hover:bg-yellow-300 hover:shadow-[0_15px_25px_-5px_rgba(250,204,21,0.5)]">
                                        Start to learn{' '}
                                        <ChevronRight
                                            size={20}
                                            strokeWidth={3}
                                        />
                                    </button>
                                </motion.div>
                            </div>

                            <motion.div
                                style={{ y: y2 }}
                                className="relative flex flex-1 justify-center"
                            >
                                {/* 3D Controller Fallback using CSS/SVG */}
                                <div className="relative h-[300px] w-[300px] md:h-[450px] md:w-[450px]">
                                    <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-blue-500 to-cyan-400 opacity-30 blur-[100px]" />
                                    <div className="relative z-10 h-full w-full drop-shadow-2xl">
                                        {/* Abstract representation of controller if image fails or use specific SVG */}
                                        <img
                                            src="/images/stick.webp"
                                            alt="stick"
                                            className="h-full w-full object-contain"
                                        />
                                    </div>
                                </div>
                            </motion.div>
                        </div>
                    </div>
                </section>

                {/* Logos Marquee */}
                <section className="relative overflow-hidden bg-slate-900 py-6">
                    <div className="absolute inset-y-0 left-0 z-10 w-32 bg-gradient-to-r from-slate-900 to-transparent" />
                    <div className="absolute inset-y-0 right-0 z-10 w-32 bg-gradient-to-l from-slate-900 to-transparent" />

                    <div className="animate-infinite-scroll flex w-max items-center gap-16 px-4 text-xl font-bold text-white/50">
                        {[...Array(2)].map((_, i) => (
                            <div key={i} className="flex items-center gap-16">
                                <span className="flex items-center gap-2">
                                    <Music size={24} /> Spotify
                                </span>
                                <span className="flex items-center gap-2">
                                    <Slack size={24} /> Slack
                                </span>
                                <span className="flex items-center gap-2">
                                    <LayoutGrid size={24} /> Envato
                                </span>
                                <span className="flex items-center gap-2">
                                    <MessageCircle size={24} /> Discord
                                </span>
                                <span className="flex items-center gap-2">
                                    <Zap size={24} /> Linear
                                </span>
                                <span className="flex items-center gap-2">
                                    <Users size={24} /> Zoom
                                </span>
                            </div>
                        ))}
                    </div>
                </section>

                {/* About Me Section - Folder Style */}
                <section
                    id="about"
                    className="relative overflow-hidden bg-gradient-to-b from-indigo-900 to-slate-900 py-24 text-white"
                >
                    <div className="relative z-10 container mx-auto px-6">
                        <div className="mx-auto max-w-4xl">
                            {/* Folder Tab */}
                            <div className="relative flex h-12 w-64 items-center justify-center rounded-t-2xl border-x border-t border-white/10 bg-[#1e293b]">
                                <h2 className="font-mono text-2xl font-bold tracking-widest uppercase">
                                    About Me
                                </h2>
                            </div>

                            {/* Folder Body */}
                            <div className="relative rounded-tr-3xl rounded-b-3xl border border-white/10 bg-[#1e293b] p-8 shadow-2xl md:p-12">
                                <div className="grid gap-8 md:grid-cols-2">
                                    <div className="group relative rounded-2xl border border-white/5 bg-[#0f172a] p-6 transition-colors hover:border-blue-500/30">
                                        <div className="absolute -top-6 left-6 rotate-3 rounded-xl bg-pink-500 p-3 shadow-lg shadow-pink-500/30 transition-transform group-hover:rotate-6">
                                            <Rocket
                                                size={24}
                                                className="text-white"
                                            />
                                        </div>
                                        <p className="mt-6 leading-relaxed text-slate-300">
                                            Skill Ventura is a technology-based
                                            project designed to develop user
                                            skills progressively through
                                            interactive learning and
                                            challenge-based approaches.
                                        </p>
                                    </div>

                                    <div className="group relative rounded-2xl border border-white/5 bg-[#0f172a] p-6 transition-colors hover:border-blue-500/30">
                                        <div className="absolute -top-6 right-6 -rotate-3 rounded-xl bg-orange-500 p-3 shadow-lg shadow-orange-500/30 transition-transform group-hover:-rotate-6">
                                            <Gamepad2
                                                size={24}
                                                className="text-white"
                                            />
                                        </div>
                                        <p className="mt-6 leading-relaxed text-slate-300">
                                            We gamify the experience to make
                                            learning addictive, fun, and
                                            effective. Level up your real-world
                                            stats while having fun.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Orbiting Mission Nodes */}
                        <div className="relative mx-auto mt-32 hidden h-[400px] max-w-4xl md:block">
                            {/* Central Core */}
                            <div className="absolute top-1/2 left-0 -translate-y-1/2">
                                <div className="relative h-48 w-48">
                                    <div className="animate-spin-slow absolute inset-0 rounded-full border-4 border-dashed border-white/20" />
                                    <div className="absolute inset-4 rounded-full border-2 border-white/10" />
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <div className="flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-cyan-400 to-blue-600 shadow-[0_0_50px_rgba(34,211,238,0.4)]">
                                            <Flame
                                                size={40}
                                                className="text-white"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Connecting Lines & Nodes */}
                            <div className="absolute top-60 left-58 flex -translate-y-1/2 flex-col gap-3">
                                <NodeItem
                                    color="bg-yellow-400"
                                    text="Mission"
                                    delay={0}
                                />
                                Menyediakan platform pembelajaran berbasis
                                gamifikasi RPG yang mengubah proses belajar
                                menjadi perjalanan bertahap penuh misi, sehingga
                                setiap individu dapat berkembang dari pemula
                                hingga ahli melalui progress nyata, tantangan
                                terarah, dan pencapaian bermakna.
                                <NodeItem
                                    color="bg-red-400"
                                    text="Vision"
                                    delay={0.1}
                                />
                                Menjadi Learning Management System berbasis RPG
                                terdepan yang mendefinisikan ulang cara manusia
                                belajar di mana pembelajaran terasa menantang,
                                menyenangkan, personal, dan berkelanjutan, tanpa
                                batasan bidang atau latar belakang.
                                <NodeItem
                                    color="bg-green-400"
                                    text="Value"
                                    delay={0.2}
                                />
                                Progress Over Speed
                                <br />
                                Learning Is a Journey
                                <br />
                                Meaningful Achievement
                                <br />
                                Freedom with Structure
                                {/* <NodeItem
                                    color="bg-blue-400"
                                    text="Goals"
                                    delay={0.3}
                                />
                                Menjadi ekosistem pembelajaran berkelanjutan
                                Membantu individu menemukan arah belajar &
                                karier Menjembatani edukasi formal, informal,
                                dan industri */}
                            </div>
                        </div>
                    </div>
                </section>

                {/* Gamified Map Section */}
                <section
                    id="learn"
                    className="relative overflow-hidden bg-[#0f172a] py-24"
                >
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
                <section className="relative bg-white py-24">
                    <div className="container mx-auto max-w-3xl px-6">
                        <h2 className="mb-16 text-center text-4xl font-black text-slate-900">
                            Frequently Asked{' '}
                            <span className="text-yellow-500">Questions</span>
                        </h2>

                        <div className="flex flex-col gap-4">
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
                                <div key={i} className="group">
                                    <button
                                        onClick={() => toggleFaq(i)}
                                        className={`flex w-full items-center justify-between rounded-2xl p-5 text-left transition-all ${openFaq === i ? 'bg-[#0f172a] text-white shadow-xl' : 'bg-slate-50 text-slate-700 hover:bg-slate-100'}`}
                                    >
                                        <div className="flex items-center gap-4">
                                            <div
                                                className={`h-3 w-3 rounded-full ${openFaq === i ? 'bg-yellow-400' : 'bg-slate-300'}`}
                                            />
                                            <span className="font-bold">
                                                {q}
                                            </span>
                                        </div>
                                        <ChevronRight
                                            className={`transition-transform ${openFaq === i ? 'rotate-90 text-yellow-500' : 'text-slate-400'}`}
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
                                                className="overflow-hidden"
                                            >
                                                <div className="mt-2 ml-8 border-l-2 border-[#0f172a] p-5 pt-2 leading-relaxed text-slate-600">
                                                    Yes, Skill Ventura offers a
                                                    comprehensive learning
                                                    experience tailored to your
                                                    needs. We combine theory
                                                    with practice in a fun,
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
                <section className="bg-white py-20">
                    <div className="container mx-auto px-6">
                        <div className="relative overflow-hidden rounded-[3rem] bg-gradient-to-r from-[#1e1b4b] to-[#312e81] p-12 text-center shadow-2xl md:p-20">
                            <div className="absolute top-0 left-0 h-full w-full bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay" />
                            <div className="relative z-10">
                                <h2 className="mb-8 text-3xl font-black text-white md:text-5xl">
                                    Join Us to Learn, Level Up and
                                    <br />
                                    Master Real-World Tech Skills
                                </h2>
                                <button className="mx-auto flex items-center gap-2 rounded-xl bg-gradient-to-r from-purple-500 to-indigo-500 px-8 py-4 text-lg font-bold text-white shadow-lg transition-all hover:brightness-110">
                                    Join Community <Users size={20} />
                                </button>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Contact & Footer */}
                <footer id="contact" className="bg-slate-50 pt-20 pb-10">
                    <div className="container mx-auto mb-16 grid gap-12 px-6 md:grid-cols-4">
                        <div className="col-span-1 md:col-span-1">
                            <h3 className="mb-6 text-xl font-black">
                                Contact Us
                            </h3>
                            <p className="mb-6 text-sm leading-relaxed text-slate-500">
                                BANKAI's contact support is available Monday to
                                Friday, from 8 AM to 4 PM. We remain committed
                                to providing helpful and timely support.
                            </p>
                        </div>

                        <div className="col-span-1 flex items-end justify-center md:col-span-2">
                            {/* Support Avatar Visual */}
                            <div className="relative w-full max-w-sm">
                                <div className="absolute inset-x-0 bottom-0 h-40 rounded-t-full bg-gradient-to-t from-blue-100/50 to-transparent" />
                                <div className="relative z-10 flex flex-col items-center">
                                    <Headset
                                        size={80}
                                        className="mb-4 text-blue-600"
                                    />
                                    <div className="flex items-center gap-4 rounded-2xl bg-white px-6 py-4 shadow-xl">
                                        <div className="h-3 w-3 animate-pulse rounded-full bg-green-500" />
                                        <span className="font-bold text-slate-700">
                                            Support is Online
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="col-span-1">
                            <h3 className="mb-4 font-bold">Support</h3>
                            <ul className="space-y-2 text-sm text-slate-500">
                                <li>
                                    <a href="#">Help Center</a>
                                </li>
                                <li>
                                    <a href="#">Terms of Service</a>
                                </li>
                                <li>
                                    <a href="#">Privacy Policy</a>
                                </li>
                            </ul>
                        </div>
                    </div>

                    <div className="container mx-auto flex flex-col items-center justify-between gap-4 border-t border-slate-200 px-6 pt-8 md:flex-row">
                        <div className="flex items-center gap-2">
                            <Gem className="text-blue-600" />
                            <span className="font-bold text-slate-900">
                                SKILL VENTURA
                            </span>
                        </div>
                        <div className="flex gap-4 text-slate-400">
                            <Music
                                size={20}
                                className="cursor-pointer hover:text-blue-600"
                            />
                            <MessageCircle
                                size={20}
                                className="cursor-pointer hover:text-blue-600"
                            />
                            <Slack
                                size={20}
                                className="cursor-pointer hover:text-blue-600"
                            />
                        </div>
                        <p className="text-xs text-slate-400">
                            © 2026 Skill Ventura. All rights reserved.
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
