import { Link, usePage } from '@inertiajs/react';
import {
    BookOpen,
    ChevronLeft,
    ChevronRight,
    Home,
    Menu,
    X,
    Users,
    LogOut,
    Settings,
    Box,
    UserCheckIcon,
    User,
    FileSignature,
    MessageSquare,
    Briefcase,
} from 'lucide-react';
import { useEffect } from 'react';

/* -------------------------------------------------------------------------- */
/* TYPES */
/* -------------------------------------------------------------------------- */
type Role = 'admin' | 'mentor' | 'student';

type MenuItem = {
    name: string;
    icon: React.ComponentType<{ size?: number; className?: string }>;
    href: string;
    roles: Role[];
};

/* -------------------------------------------------------------------------- */
/* MENU CONFIG (STATIC ONLY) */
/* -------------------------------------------------------------------------- */
const menu: MenuItem[] = [
    {
        name: 'Dashboard',
        icon: Home,
        href: '/dashboard', // will be overridden dynamically
        roles: ['admin', 'mentor', 'student'],
    },
    {
        name: 'Courses',
        icon: BookOpen,
        href: '/admin/courses',
        roles: ['admin'],
    },
    {
        name: 'Student Journey',
        icon: UserCheckIcon,
        href: '/mentor/student-journey',
        roles: ['mentor'],
    },
    {
        name: 'My Profile',
        icon: User,
        href: '/mentor/profile',
        roles: ['mentor'],
    },
    {
        name: 'My Profile',
        icon: User,
        href: '/student/profile',
        roles: ['student'],
    },
    {
        name: 'Users',
        icon: Users,
        href: '/admin/users',
        roles: ['admin'],
    },
    {
        name: 'Assets',
        icon: Box,
        href: '/admin/assets',
        roles: ['admin'],
    },
    {
        name: 'Quests',
        icon: Briefcase,
        href: '/admin/quests',
        roles: ['admin'],
    },
    {
        name: 'Signature',
        icon: FileSignature,
        href: '/signature',
        roles: ['admin', 'mentor'],
    },
    {
        name: 'Forum Diskusi',
        icon: MessageSquare,
        href: '/admin/forum', // dynamically overridden below
        roles: ['admin', 'mentor'],
    },
];

/* -------------------------------------------------------------------------- */
/* COMPONENT */
/* -------------------------------------------------------------------------- */
export default function Sidebar({
    isOpen,
    setSidebarOpen,
}: {
    isOpen: boolean;
    setSidebarOpen: (open: boolean) => void;
}) {
    const { url, props } = usePage<any>();

    const userRole: Role | null = props?.auth?.user?.role ?? null;

    const hasRole = (allowed: Role[]) =>
        userRole ? allowed.includes(userRole) : false;

    const isActiveRoute = (href: string) =>
        url === href || url.startsWith(`${href}/`);

    /* -------------------- Dynamic Dashboard Route -------------------- */
    const getDashboardRoute = () => {
        switch (userRole) {
            case 'admin':
                return '/admin/dashboard';
            case 'mentor':
                return '/mentor/dashboard';
            case 'student':
                return '/student/dashboard';
            default:
                return '/dashboard';
        }
    };

    /* -------------------- Auto Close on Resize (Mobile) -------------------- */
    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth < 768) setSidebarOpen(false);
        };
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, [setSidebarOpen]);

    return (
        <>
            {/* Mobile Backdrop Overlay */}
            {isOpen && (
                <div
                    className="fixed inset-0 z-30 bg-[#030712]/60 backdrop-blur-sm transition-opacity duration-300 md:hidden"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside
                className={`fixed inset-y-0 left-0 z-40 flex w-64 flex-col rounded-r-xl border-r border-white/8 bg-[#060B1A] transition-all duration-300 ease-in-out md:translate-x-0 ${
                    isOpen ? 'translate-x-0' : '-translate-x-full'
                } ${isOpen ? 'md:w-64' : 'md:w-16'}`}
            >
                {/* Desktop Toggle Button */}
                <button
                    onClick={() => setSidebarOpen(!isOpen)}
                    className="absolute top-4 -right-3 hidden h-7 w-7 items-center justify-center rounded-full border border-transparent bg-sky-500 text-white shadow-[0_0_10px_rgba(14,165,233,0.3)] transition hover:scale-110 hover:bg-sky-600 md:flex dark:bg-sky-600 dark:hover:bg-sky-500"
                >
                    {isOpen ? (
                        <ChevronLeft size={14} />
                    ) : (
                        <ChevronRight size={14} />
                    )}
                </button>

                {/* Brand with Mobile Close Button */}
                {isOpen && (
                    <div className="flex items-start justify-between border-b border-white/5 px-6 py-6">
                        <div>
                            <h1 className="text-lg font-bold tracking-tight text-white select-none">
                                Skill
                                <span className="text-[#7C5CFF]">Ventura</span>
                            </h1>
                            <p className="mt-1 text-[11px] tracking-wide text-slate-400">
                                Learning Management System
                            </p>
                        </div>
                        {/* Mobile Close Button inside Drawer */}
                        <button
                            onClick={() => setSidebarOpen(false)}
                            className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 transition hover:bg-white/4 active:scale-95 md:hidden"
                        >
                            <X size={18} />
                        </button>
                    </div>
                )}

                {/* Menu */}
                <nav className="flex-1 space-y-1.5 px-3 py-6">
                    {menu
                        .filter((item) => hasRole(item.roles))
                        .map((item) => {
                            const href =
                                item.name === 'Dashboard'
                                    ? getDashboardRoute()
                                    : item.name === 'Forum Diskusi'
                                      ? `/${userRole}/forum`
                                      : item.href;

                            const Icon = item.icon;
                            const active = isActiveRoute(href);

                            return (
                                <Link
                                    key={item.name}
                                    href={href}
                                    className={`group relative flex items-center gap-3 border-l-[3px] px-3 py-2.5 text-sm font-medium transition-all duration-200 ${
                                        active
                                            ? 'rounded-r-lg border-[#7C5CFF] bg-[#7C5CFF]/15 text-white shadow-[inset_0_0_12px_rgba(124,92,255,0.08)]'
                                            : 'rounded-lg border-transparent text-slate-400 hover:bg-white/4 hover:text-white'
                                    }`}
                                    onClick={() =>
                                        window.innerWidth < 768 &&
                                        setSidebarOpen(false)
                                    }
                                >
                                    <Icon
                                        size={18}
                                        className={
                                            active
                                                ? 'text-[#7C5CFF]'
                                                : 'text-slate-400 transition-colors group-hover:text-white'
                                        }
                                    />
                                    {isOpen && <span>{item.name}</span>}
                                </Link>
                            );
                        })}
                </nav>

                {/* User Section */}
                <div
                    className={`mt-auto border-t border-white/8 bg-[#030712]/40 transition-all duration-300 ${isOpen ? 'p-4' : 'flex flex-col items-center p-3'}`}
                >
                    <div
                        className={`flex items-center ${isOpen ? 'w-full gap-3' : 'justify-center'}`}
                    >
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-[#7C5CFF]/30 bg-[#7C5CFF]/20 text-sm font-semibold text-[#7C5CFF] shadow-[0_0_10px_rgba(124,92,255,0.15)]">
                            {props?.auth?.user?.name?.charAt(0)}
                        </div>

                        {isOpen && (
                            <div className="flex min-w-0 flex-col">
                                <span className="truncate text-sm font-medium text-white">
                                    {props?.auth?.user?.name}
                                </span>
                                <span className="truncate text-[11px] text-slate-400">
                                    {props?.auth?.user?.email}
                                </span>
                            </div>
                        )}
                    </div>

                    <div
                        className={`mt-4 flex ${isOpen ? 'w-full flex-row gap-2' : 'flex-col items-center gap-2'}`}
                    >
                        {/* Settings */}
                        <Link
                            href="/settings"
                            className={`flex items-center justify-center gap-2 rounded-lg border border-white/8 bg-white/4 text-slate-300 transition hover:bg-white/8 ${
                                isOpen
                                    ? 'flex-1 px-3 py-2'
                                    : 'h-9 w-9 shrink-0 p-0'
                            }`}
                        >
                            <Settings size={16} />
                            {isOpen && (
                                <span className="text-xs font-medium">
                                    Settings
                                </span>
                            )}
                        </Link>

                        {/* Logout */}
                        <Link
                            href="/logout"
                            method="post"
                            as="button"
                            className={`flex items-center justify-center gap-2 rounded-lg border border-rose-500/20 bg-rose-500/10 text-rose-400 transition hover:bg-rose-500/20 ${
                                isOpen
                                    ? 'flex-1 px-3 py-2'
                                    : 'h-9 w-9 shrink-0 p-0'
                            }`}
                        >
                            <LogOut size={16} />
                            {isOpen && (
                                <span className="text-xs font-medium">
                                    Logout
                                </span>
                            )}
                        </Link>
                    </div>
                </div>

                {/* Footer */}
                {isOpen && (
                    <div className="border-t border-white/8 px-5 py-4 text-[10px] font-semibold tracking-wider text-slate-500 uppercase">
                        © {new Date().getFullYear()} SkillVentura
                    </div>
                )}
            </aside>
        </>
    );
}
