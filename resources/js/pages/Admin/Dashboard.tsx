import AppLayout from '@/layouts/app-layout';
import { Link } from '@inertiajs/react';
import { Users, UserPlus, Sparkles, Activity, ArrowRight } from 'lucide-react';

export default function Dashboard({ user }: any) {
    return (
        <AppLayout>
            <div className="min-h-screen bg-slate-50 px-4 py-3 sm:px-6 lg:px-10 dark:bg-slate-950">
                <div className="mx-auto max-w-7xl space-y-4">
                    {/* ================= HEADER ================= */}
                    <header className="flex flex-col gap-2">
                        <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl dark:text-white">
                            Admin Dashboard
                        </h1>
                        <p className="max-w-2xl text-sm text-slate-500 dark:text-slate-400">
                            Welcome back,{' '}
                            <span className="font-semibold text-indigo-600 dark:text-indigo-400">
                                {user.name}
                            </span>
                            . Manage users, content, and system activity.
                        </p>
                    </header>

                    {/* ================= STATS ================= */}
                    <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                        <StatCard
                            title="Students"
                            value="12"
                            icon={Users}
                            color="indigo"
                        />
                        <StatCard
                            title="Courses"
                            value="0"
                            icon={Sparkles}
                            color="emerald"
                        />
                        {/* <StatCard
                            title="Active Sessions"
                            value="89"
                            icon={Activity}
                            color="amber"
                        /> */}
                        <StatCard
                            title="Submissions"
                            value="45"
                            icon={UserPlus}
                            color="rose"
                        />
                    </section>

                    {/* ================= ACTIONS ================= */}
                    <section className="grid gap-6 md:grid-cols-2">
                        {/* Manage Characters */}
                        {/* <ActionCard
                            title="Character Management"
                            description="Create, edit, and manage playable characters that define the student journey."
                            actionLabel="Manage Characters"
                            href="/admin/characters"
                            gradient="from-indigo-600 to-purple-600"
                        /> */}

                        {/* System Overview */}
                        {/* <ActionCard
                            title="System Overview"
                            description="Monitor system activity, user progress, and platform health in real time."
                            disabled
                        /> */}
                    </section>
                </div>
            </div>
        </AppLayout>
    );
}

/* ================= STAT CARD ================= */

function StatCard({
    title,
    value,
    icon: Icon,
    color,
}: {
    title: string;
    value: string;
    icon: any;
    color: 'indigo' | 'emerald' | 'amber' | 'rose';
}) {
    const colorMap = {
        indigo: 'bg-indigo-600/10 text-indigo-600 dark:text-indigo-400',
        emerald: 'bg-emerald-600/10 text-emerald-600 dark:text-emerald-400',
        amber: 'bg-amber-500/10 text-amber-600 dark:text-amber-400',
        rose: 'bg-rose-600/10 text-rose-600 dark:text-rose-400',
    };

    return (
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:shadow-md dark:border-slate-800 dark:bg-slate-900">
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                        {title}
                    </p>
                    <p className="mt-2 text-3xl font-bold text-slate-900 dark:text-white">
                        {value}
                    </p>
                </div>

                <div
                    className={`flex h-12 w-12 items-center justify-center rounded-xl ${colorMap[color]}`}
                >
                    <Icon size={22} />
                </div>
            </div>
        </div>
    );
}

/* ================= ACTION CARD ================= */

function ActionCard({
    title,
    description,
    actionLabel,
    href,
    gradient,
    disabled = false,
}: {
    title: string;
    description: string;
    actionLabel?: string;
    href?: string;
    gradient?: string;
    disabled?: boolean;
}) {
    return (
        <div className="relative overflow-hidden rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition hover:shadow-md dark:border-slate-800 dark:bg-slate-900">
            {/* glow */}
            {!disabled && (
                <div
                    className={`pointer-events-none absolute -top-24 -right-24 h-64 w-64 rounded-full bg-gradient-to-br ${gradient} opacity-20 blur-3xl`}
                />
            )}

            <h2 className="text-xl font-semibold text-slate-900 dark:text-white">
                {title}
            </h2>
            <p className="mt-2 max-w-md text-sm text-slate-500 dark:text-slate-400">
                {description} 
            </p>

            {disabled ? (
                <button
                    disabled
                    className="mt-6 inline-flex rounded-xl bg-slate-200 px-5 py-2.5 text-sm text-slate-400 dark:bg-slate-800"
                >
                    Coming Soon
                </button>
            ) : (
                <Link
                    href={href!}
                    className={`mt-6 inline-flex items-center gap-2 rounded-xl bg-gradient-to-r ${gradient} px-6 py-3 text-sm font-semibold text-white shadow transition hover:opacity-90`}
                >
                    {actionLabel}
                    <ArrowRight size={16} />
                </Link>
            )}
        </div>
    );
}
