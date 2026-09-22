import { useState, useEffect } from 'react';
import { AppContent } from '@/components/app-content';
import { AppShell } from '@/components/app-shell';
import Sidebar from '@/components/sidebar';
import { Menu, CheckCircle2, AlertCircle, Info, X } from 'lucide-react';
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

    const [toast, setToast] = useState<{
        type: 'success' | 'error' | 'info';
        message: string;
    } | null>(null);

    useEffect(() => {
        const flash = props.flash;
        if (flash?.success) {
            setToast({ type: 'success', message: flash.success });
        } else if (flash?.error) {
            setToast({ type: 'error', message: flash.error });
        } else if (flash?.message) {
            setToast({ type: 'info', message: flash.message });
        }
    }, [props.flash]);

    useEffect(() => {
        if (!toast) return;
        const timer = setTimeout(() => {
            setToast(null);
        }, 6000);
        return () => clearTimeout(timer);
    }, [toast]);

    const isForum =
        typeof window !== 'undefined' &&
        window.location.pathname.includes('/forum');

    return (
        <AppShell variant="sidebar">
            <Sidebar isOpen={isOpen} setSidebarOpen={setSidebarOpen} />
            <AppContent
                variant="sidebar"
                className={`ml-0 min-h-screen bg-[#f8fafc] transition-all duration-300 dark:bg-background ${isOpen ? 'md:ml-64' : 'md:ml-16'} ${isForum ? 'h-screen overflow-hidden' : 'overflow-x-hidden'} `}
            >
                {/* Global Toast Notification */}
                {toast && (
                    <div className="fixed top-5 right-5 z-[99999] flex max-w-md items-center gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-2xl transition-all duration-300 animate-in fade-in slide-in-from-top-3 dark:border-slate-800 dark:bg-[#0d111a]">
                        {toast.type === 'success' ? (
                            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-emerald-500/20 text-emerald-600 dark:text-emerald-400">
                                <CheckCircle2 size={20} />
                            </div>
                        ) : toast.type === 'error' ? (
                            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-red-500/20 text-red-600 dark:text-red-400">
                                <AlertCircle size={20} />
                            </div>
                        ) : (
                            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-indigo-500/20 text-indigo-600 dark:text-indigo-400">
                                <Info size={20} />
                            </div>
                        )}
                        <div className="flex-1 pr-2">
                            <p className="text-xs font-bold text-slate-900 dark:text-white">
                                {toast.type === 'success'
                                    ? 'Berhasil!'
                                    : toast.type === 'error'
                                      ? 'Peringatan / Gagal'
                                      : 'Informasi'}
                            </p>
                            <p className="mt-0.5 text-[11px] leading-relaxed text-slate-600 dark:text-slate-300">
                                {toast.message}
                            </p>
                        </div>
                        <button
                            onClick={() => setToast(null)}
                            className="cursor-pointer text-slate-400 hover:text-slate-600 dark:hover:text-white p-1"
                        >
                            <X size={14} />
                        </button>
                    </div>
                )}

                {/* Premium Sticky Mobile Header Navbar */}
                <header className="sticky top-0 z-20 flex h-14 items-center justify-between border-b border-slate-200/80 bg-white/85 px-4 backdrop-blur-md md:hidden dark:border-slate-800/80 dark:bg-slate-900/85">
                    <div className="flex items-center gap-3">
                        {/* Hamburger Button with large touch target */}
                        <button
                            onClick={() => setSidebarOpen(true)}
                            className="flex h-10 w-10 items-center justify-center rounded-lg text-sky-500 transition hover:bg-sky-50 active:scale-95 dark:text-sky-400 dark:hover:bg-sky-950/20"
                        >
                            <Menu size={20} />
                        </button>
                        <span className="text-sm font-bold tracking-tight text-slate-900 select-none dark:text-white">
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
