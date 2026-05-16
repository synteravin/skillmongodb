import { Link, usePage } from '@inertiajs/react';
import {
    BookOpen,
    ChevronLeft,
    ChevronRight,
    Home,
    Menu,
    Sparkles,
    Users,
    LogOut,
    Settings,
    Box,
    UserCircle,
    UserCheck,
    UserCheckIcon,
} from 'lucide-react';
import { useEffect } from 'react';

/* -------------------------------------------------------------------------- */
/* TYPES */
/* -------------------------------------------------------------------------- */
type Role = 'admin' | 'mentor' | 'student';

type MenuItem = {
    name: string;
    icon: React.ComponentType<{ size?: number }>;
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
        icon: UserCheckIcon,
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
            {/* Mobile Toggle */}
            <button
                onClick={() => setSidebarOpen(!isOpen)}
                className="fixed top-4 left-4 z-50 rounded-md bg-indigo-600 p-2 text-white shadow-lg md:hidden"
            >
                <Menu size={18} />
            </button>

            {/* Sidebar */}
            <aside
                className={`fixed inset-y-0 left-0 z-40 flex flex-col ${isOpen ? 'w-64' : 'w-16'} border-r border-white bg-white shadow-sm transition-all duration-300 ease-in-out dark:border-slate-800 dark:bg-slate-900 ${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'} `}
            >
                {/* Desktop Toggle */}
                <button
                    onClick={() => setSidebarOpen(!isOpen)}
                    className="absolute top-4 -right-3 hidden h-7 w-7 items-center justify-center rounded-full bg-indigo-700 text-white shadow-md transition hover:scale-105 md:flex dark:border-indigo-700 dark:bg-indigo-800"
                >
                    {isOpen ? (
                        <ChevronLeft size={14} />
                    ) : (
                        <ChevronRight size={14} />
                    )}
                </button>

                {/* Brand */}
                {isOpen && (
                    <div className="px-6 py-6">
                        <h1 className="text-lg font-bold tracking-tight text-slate-900 dark:text-white">
                            Skill
                            <span className="text-indigo-600 dark:text-indigo-400">
                                Ventura
                            </span>
                        </h1>
                        <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                            Learning Management System
                        </p>
                    </div>
                )}

                {/* Menu */}
                <nav className="flex-1 space-y-1 px-2">
                    {menu
                        .filter((item) => hasRole(item.roles))
                        .map((item) => {
                            const href =
                                item.name === 'Dashboard'
                                    ? getDashboardRoute()
                                    : item.href;

                            const Icon = item.icon;
                            const active = isActiveRoute(href);

                            return (
                                <Link
                                    key={item.name}
                                    href={href}
                                    className={`group relative flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all duration-200 ${active
                                        ? 'bg-indigo-50 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400'
                                        : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white'
                                        } `}
                                    onClick={() =>
                                        window.innerWidth < 768 &&
                                        setSidebarOpen(false)
                                    }
                                >
                                    {active && (
                                        <span className="absolute left-0 h-6 w-1 rounded-r bg-indigo-600 dark:bg-indigo-400" />
                                    )}
                                    <Icon size={18} />
                                    {isOpen && <span>{item.name}</span>}
                                </Link>
                            );
                        })}
                </nav>

                {/* User Section */}
                <div className="mt-auto border-t border-slate-200 p-4 dark:border-slate-800">
                    <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 text-sm font-semibold text-white shadow">
                            {props?.auth?.user?.name?.charAt(0)}
                        </div>

                        {isOpen && (
                            <div className="flex flex-col">
                                <span className="text-sm font-medium text-slate-900 dark:text-white">
                                    {props?.auth?.user?.name}
                                </span>
                                <span className="text-xs text-slate-500 dark:text-slate-400">
                                    {props?.auth?.user?.email}
                                </span>
                            </div>
                        )}
                    </div>

                    <div className="mt-4 flex items-center gap-2">
                        {/* Settings */}
                        <Link
                            href="/settings"
                            className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-slate-100 px-3 py-2 text-slate-700 transition hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
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
                            className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-red-50 px-3 py-2 text-red-600 transition hover:bg-red-100 dark:bg-red-900/30 dark:text-red-400 dark:hover:bg-red-900/50"
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
                    <div className="border-t border-slate-200 px-5 py-4 text-xs text-slate-500 dark:border-slate-800 dark:text-slate-400">
                        © {new Date().getFullYear()} SkillVentura
                    </div>
                )}
            </aside>
        </>
    );
}
