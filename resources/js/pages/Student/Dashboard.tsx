// import AppLayout from '@/layouts/app-layout';
import { Sword, Trophy, BookOpen, Users, ScrollText } from 'lucide-react';
import { LogOut } from 'lucide-react';
import { Link } from '@inertiajs/react';

interface Character {
    name: string;
    avatar: string;
    backstory: string;
}

interface User {
    name: string;
    level: number;
    xp: number;
    character: Character;
}

export default function Dashboard({ user }: { user: User }) {
    return (
        // <AppLayout>
        <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-900 text-white">
            {/* ================= BACKGROUND STARS ================= */}
            <div className="pointer-events-none absolute inset-0 opacity-30">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(99,102,241,0.25),transparent_60%)]" />
            </div>

            {/* ================= TOP BAR ================= */}
            <header className="relative z-10 flex items-center justify-between px-6 py-4">
                <div className="flex items-center gap-4">
                    <img
                        src={user.character.avatar}
                        alt={user.character.name}
                        className="h-14 w-14 rounded-full border-2 border-indigo-500 object-cover shadow-lg"
                    />

                    <div>
                        <p className="text-sm text-slate-400">{user.name}</p>
                        <p className="text-lg font-bold">Lv. {user.level}</p>
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    <div className="rounded-xl bg-black/40 px-4 py-2 text-sm backdrop-blur">
                        XP: {user.xp}
                    </div>
                    <div className="rounded-xl bg-yellow-400/20 px-4 py-2 text-sm text-yellow-300 backdrop-blur">
                        Gold: 20897
                    </div>
                    {/* tambahkan fitur logout dan settings di sini */}
                    <Link
                        href="/logout"
                        method="post"
                        as="button"
                        className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-red-50 px-3 py-2 text-red-600 transition hover:bg-red-100 dark:bg-red-900/30 dark:text-red-400 dark:hover:bg-red-900/50"
                    >
                        <LogOut size={16} />

                        <span className="text-xs font-medium">Logout</span>
                    </Link>
                </div>
            </header>

            {/* ================= MAIN CONTENT ================= */}
            <main className="relative flex flex-col items-center justify-center px-6 py-10 text-center">
                {/* Character Display */}
                <div className="relative">
                    <img
                        src={user.character.avatar}
                        alt={user.character.name}
                        className="h-[450px] w-auto drop-shadow-[0_30px_60px_rgba(0,0,0,0.7)]"
                    />

                    {/* Glow */}
                    <div className="absolute inset-0 -z-10 rounded-full bg-indigo-600/20 blur-3xl" />
                </div>

                {/* Character Name */}
                {/* <h1 className="mt-6 text-3xl font-bold tracking-wide">
                    {user.character.name}
                </h1>

                <p className="mt-2 max-w-xl text-center text-sm text-slate-400">
                    {user.character.backstory}
                </p> */}

                {/* NPC Dialog */}
                {/* <div className="mt-8 max-w-md rounded-2xl border border-white/10 bg-black/40 p-5 text-sm text-slate-300 backdrop-blur">
                    <p>
                        “You’re ready for battle. Check out these upgrades —
                        they’ll help you survive and dominate the game.”
                    </p>
                </div> */}
            </main>

            {/* ================= BOTTOM NAV ================= */}
            <nav className="fixed right-0 bottom-0 left-0 z-20 border-t border-white/10 bg-black/60 backdrop-blur">
                <div className="mx-auto grid max-w-6xl grid-cols-5">
                    <NavItem icon={BookOpen} label="My Course" />
                    <NavItem icon={Sword} label="Mini Battle" />
                    <NavItem icon={Trophy} label="Tier List" />
                    <NavItem icon={ScrollText} label="Certificate" />
                    <NavItem icon={Users} label="Forum" />
                </div>
            </nav>
        </div>
        // </AppLayout>
    );
}

/* ================= NAV ITEM ================= */

function NavItem({ icon: Icon, label }: { icon: any; label: string }) {
    return (
        <button className="group flex flex-col items-center gap-1 py-3 transition hover:bg-white/5">
            <Icon
                size={20}
                className="text-slate-400 group-hover:text-indigo-400"
            />
            <span className="text-xs text-slate-400 group-hover:text-indigo-400">
                {label}
            </span>
        </button>
    );
}
