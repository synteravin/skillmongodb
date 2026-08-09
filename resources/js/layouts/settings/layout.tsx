import { Link, usePage } from '@inertiajs/react';
import type { PropsWithChildren } from 'react';
import { Settings, ShieldCheck } from 'lucide-react';
import Heading from '@/components/heading';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { useCurrentUrl } from '@/hooks/use-current-url';
import { cn, toUrl } from '@/lib/utils';
import { edit as editAppearance } from '@/routes/appearance';
import { edit } from '@/routes/profile';
import { show } from '@/routes/two-factor';
import { edit as editPassword } from '@/routes/user-password';
import type { NavItem, SharedData } from '@/types';

export default function SettingsLayout({ children }: PropsWithChildren) {
    const { isCurrentUrl } = useCurrentUrl();
    const { props } = usePage<SharedData>();
    const userRole = props.auth.user.role;
    const isAdminOrMentor = userRole === 'admin' || userRole === 'mentor';

    // When server-side rendering, we only render the layout on the client...
    if (typeof window === 'undefined') {
        return null;
    }

    const navItems = isAdminOrMentor
        ? [
              {
                  title: 'Settings',
                  href: edit(),
                  icon: Settings,
              },
              {
                  title: 'Two-Factor Auth',
                  href: show(),
                  icon: ShieldCheck,
              },
          ]
        : [
              {
                  title: 'Profile',
                  href: edit(),
                  icon: null,
              },
              {
                  title: 'Password',
                  href: editPassword(),
                  icon: null,
              },
              {
                  title: 'Two-Factor Auth',
                  href: show(),
                  icon: null,
              },
              {
                  title: 'Appearance',
                  href: editAppearance(),
                  icon: null,
              },
          ];

    const isTwoFactorPage = isCurrentUrl(show());

    return (
        <div
            className={cn(
                'px-4 py-6',
                isAdminOrMentor && 'px-6 py-8 sm:px-8 lg:px-10',
            )}
        >
            {isAdminOrMentor ? (
                <div className="relative mb-8 overflow-hidden rounded-xl border border-slate-200/80 bg-[#f5f6ff] p-6 shadow-sm sm:p-8 md:p-10 dark:border-slate-800 dark:bg-[#0d0f17]">
                    {/* Grid Pattern Motif */}
                    <div
                        className="pointer-events-none absolute inset-0 z-0"
                        style={{
                            backgroundImage: `
                                linear-gradient(rgba(59, 40, 246, 0.07) 1px, transparent 1px),
                                linear-gradient(90deg, rgba(59, 40, 246, 0.07) 1px, transparent 1px)
                            `,
                            backgroundSize: '40px 40px',
                        }}
                    />

                    <div className="absolute top-0 right-8 left-8 z-0 h-px bg-gradient-to-r from-transparent via-slate-300 to-transparent dark:via-slate-700" />

                    <div className="relative z-10 flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
                        <div className="space-y-3">
                            <span className="inline-block text-[0.6rem] font-semibold tracking-[0.2em] text-slate-500 uppercase dark:text-slate-500">
                                Configuration
                            </span>
                            <h1 className="text-2xl leading-snug font-semibold tracking-tight text-slate-800 md:text-[28px] dark:text-white">
                                {isTwoFactorPage
                                    ? 'Two-Factor Authentication'
                                    : 'Account Settings'}
                            </h1>
                            <p className="text-sm leading-relaxed text-slate-500 md:text-[15px] dark:text-slate-400/60">
                                {isTwoFactorPage
                                    ? "Manage your account's two-factor authentication security settings."
                                    : 'Manage your profile, password, security, and appearance settings.'}
                            </p>
                        </div>

                        <div className="shrink-0">
                            {isTwoFactorPage ? (
                                <Button
                                    asChild
                                    variant="outline"
                                    className="border-slate-200 bg-white font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800/50"
                                >
                                    <Link href={edit()}>
                                        <Settings className="mr-2 h-4 w-4 text-slate-500" />
                                        Back to Settings
                                    </Link>
                                </Button>
                            ) : (
                                <Button
                                    asChild
                                    className="bg-indigo-600 font-semibold text-white shadow-xs hover:bg-indigo-700"
                                >
                                    <Link href={show()}>
                                        <ShieldCheck className="mr-2 h-4 w-4 text-white" />
                                        Two-Factor Auth
                                    </Link>
                                </Button>
                            )}
                        </div>
                    </div>
                </div>
            ) : (
                <Heading
                    title="Settings"
                    description="Manage your profile and account settings"
                />
            )}

            {isAdminOrMentor ? (
                <div className="w-full">{children}</div>
            ) : (
                <div className="flex flex-col lg:flex-row lg:space-x-12">
                    <aside className="w-full max-w-xl lg:w-48">
                        <nav
                            className="flex flex-col space-y-1 space-x-0"
                            aria-label="Settings"
                        >
                            {navItems.map((item, index) => {
                                const active = isCurrentUrl(item.href);
                                return (
                                    <Button
                                        key={`${toUrl(item.href)}-${index}`}
                                        size="sm"
                                        variant="ghost"
                                        asChild
                                        className={cn('w-full justify-start', {
                                            'bg-muted': active,
                                        })}
                                    >
                                        <Link href={item.href}>
                                            {item.icon && (
                                                <item.icon className="h-4 w-4" />
                                            )}
                                            {item.title}
                                        </Link>
                                    </Button>
                                );
                            })}
                        </nav>
                    </aside>

                    <Separator className="my-6 lg:hidden" />

                    <div className="flex-1 md:max-w-2xl">
                        <section className="max-w-xl space-y-12">
                            {children}
                        </section>
                    </div>
                </div>
            )}
        </div>
    );
}
