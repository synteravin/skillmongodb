import { useState } from 'react';
import { AppContent } from '@/components/app-content';
import { AppShell } from '@/components/app-shell';
import Sidebar from '@/components/sidebar';
import { Menu } from 'lucide-react';
import { usePage } from '@inertiajs/react';
import type { AppLayoutProps } from '@/types';

export default function AppSidebarLayout({
    children,
    breadcrumbs = [],
}: AppLayoutProps) {
    // Smart initialization: start open on desktop, closed on mobile to prevent layout shifts
    const [isOpen, setSidebarOpen] = useState(() => {
        if (typeof window !== 'undefined') {
            return window.innerWidth >= 768;
        }
        return true;
    });

    const { props } = usePage<any>();

    return (
        <AppShell variant="sidebar">
            <Sidebar isOpen={isOpen} setSidebarOpen={setSidebarOpen} />
            <AppContent
                variant="sidebar"
                className={`min-h-screen overflow-x-hidden transition-all duration-300 ml-0
        ${isOpen ? 'md:ml-64' : 'md:ml-16'}
    `}
            >
                {/* Premium Sticky Mobile Header Navbar */}
                <header className="sticky top-0 z-20 flex h-14 items-center justify-between border-b border-slate-200/80 bg-white/85 px-4 backdrop-blur-md dark:border-slate-800/80 dark:bg-slate-900/85 md:hidden">
                    <div className="flex items-center gap-3">
                        {/* Hamburger Button with large touch target */}
                        <button
                            onClick={() => setSidebarOpen(true)}
                            className="flex h-10 w-10 items-center justify-center rounded-lg text-slate-500 hover:bg-slate-100 active:scale-95 transition dark:text-slate-400 dark:hover:bg-slate-800"
                        >
                            <Menu size={20} />
                        </button>
                        <span className="text-sm font-bold tracking-tight text-slate-900 dark:text-white select-none">
                            Skill
                            <span className="text-indigo-600 dark:text-indigo-400">
                                Ventura
                            </span>
                        </span>
                    </div>

                    {/* Balanced visual right-side element showing user avatar */}
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 text-xs font-semibold text-white shadow-sm select-none">
                        {props?.auth?.user?.name?.charAt(0)}
                    </div>
                </header>

                {children}
            </AppContent>
        </AppShell>
    );
}
