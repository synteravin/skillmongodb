import AppLayout from '@/layouts/app-layout';
import { Link, usePage } from '@inertiajs/react';
import {
    Users,
    BookOpen,
    CheckCircle,
    Trophy,
    TrendingUp,
    Shield,
    GraduationCap,
    Clock,
} from 'lucide-react';

interface MetricUser {
    _id: string;
    name: string;
    email: string;
    role: string;
    avatar_url: string | null;
    created_at: string;
}

interface LeaderboardUser {
    _id: string;
    name: string;
    username: string;
    avatar_url: string | null;
    level: number;
    exp: number;
    rank: string | null;
}

interface PopularCourse {
    _id: string;
    title: string;
    thumbnail_url: string | null;
    students_count: number;
}

interface DashboardProps {
    metrics: {
        users: {
            student: number;
            mentor: number;
            admin: number;
            total: number;
        };
        courses: { total: number; published: number };
        submissions: { total: number; approved: number };
    };
    popularCourses: PopularCourse[];
    leaderboard: LeaderboardUser[];
    latestUsers: MetricUser[];
}

export default function Dashboard({
    metrics,
    popularCourses,
    leaderboard,
    latestUsers,
}: DashboardProps) {
    const { auth } = usePage().props as any;
    const user = auth.user;

    return (
        <AppLayout>
            <div className="min-h-screen bg-slate-50 px-6 py-6 sm:px-6 lg:px-10 dark:bg-[#0B1120]">
                <div className="mx-auto max-w-7xl space-y-6 sm:space-y-8">
                    {/* HEADER */}
                    <header className="relative flex flex-col gap-2">
                        <div className="pointer-events-none absolute -top-20 -left-20 h-64 w-64 rounded-full bg-indigo-500/10 blur-3xl"></div>
                        <h1 className="flex items-center gap-3 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl dark:text-white">
                            <span className="bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
                                Command Center
                            </span>
                        </h1>
                        <p className="max-w-2xl text-sm text-slate-500 dark:text-slate-400">
                            Welcome back,{' '}
                            <span className="font-semibold text-indigo-600 dark:text-indigo-400">
                                {user.name}
                            </span>
                            . Here is the overview of your platform's health and
                            activity.
                        </p>
                    </header>

                    {/* KPI CARDS */}
                    <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                        <StatCard
                            title="Total Users"
                            value={metrics.users.total.toString()}
                            subtitle={`${metrics.users.student} Students, ${metrics.users.mentor} Mentors`}
                            icon={Users}
                            color="indigo"
                        />
                        <StatCard
                            title="Published Courses"
                            value={metrics.courses.published.toString()}
                            subtitle={`Out of ${metrics.courses.total} total courses`}
                            icon={BookOpen}
                            color="emerald"
                        />
                        <StatCard
                            title="Approved Submissions"
                            value={metrics.submissions.approved.toString()}
                            subtitle={`Out of ${metrics.submissions.total} total submissions`}
                            icon={CheckCircle}
                            color="amber"
                        />
                    </section>

                    {/* MAIN CONTENT GRID */}
                    <div className="grid gap-6 lg:grid-cols-3 lg:gap-8">
                        {/* LEFT COLUMN: 2 SPANS */}
                        <div className="space-y-8 lg:col-span-2">
                            {/* POPULAR COURSES */}
                            <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm dark:border-slate-800/80 dark:bg-slate-900">
                                <div className="flex items-center gap-3 border-b border-slate-200 p-5 sm:p-6 dark:border-slate-800/80">
                                    <div className="rounded-xl bg-indigo-500/10 p-2 text-indigo-500">
                                        <TrendingUp size={20} />
                                    </div>
                                    <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                                        Most Popular Courses
                                    </h2>
                                </div>
                                <div className="divide-y divide-slate-100 dark:divide-slate-800/50">
                                    {popularCourses.length > 0 ? (
                                        popularCourses.map((course, i) => (
                                            <div
                                                key={course._id}
                                                className="flex items-center gap-4 p-4 transition-colors hover:bg-slate-50 sm:p-5 dark:hover:bg-slate-800/30"
                                            >
                                                <div className="h-12 w-12 flex-shrink-0 overflow-hidden rounded-xl bg-slate-100 dark:bg-slate-800">
                                                    {course.thumbnail_url ? (
                                                        <img
                                                            src={
                                                                course.thumbnail_url
                                                            }
                                                            className="h-full w-full object-cover"
                                                            alt={course.title}
                                                        />
                                                    ) : (
                                                        <div className="flex h-full w-full items-center justify-center text-slate-400">
                                                            <BookOpen
                                                                size={20}
                                                            />
                                                        </div>
                                                    )}
                                                </div>
                                                <div className="min-w-0 flex-1">
                                                    <h3 className="truncate text-sm font-semibold text-slate-900 dark:text-white">
                                                        {course.title}
                                                    </h3>
                                                    <p className="mt-1 flex items-center gap-1 text-xs text-slate-500">
                                                        <Users size={12} />{' '}
                                                        {course.students_count}{' '}
                                                        enrolled students
                                                    </p>
                                                </div>
                                                <div className="flex-shrink-0 text-lg font-black text-slate-200 sm:text-xl dark:text-slate-800">
                                                    #{i + 1}
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <div className="p-8 text-center text-sm text-slate-500">
                                            No active courses found.
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* RECENT REGISTRATIONS */}
                            <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm dark:border-slate-800/80 dark:bg-slate-900">
                                <div className="flex items-center gap-3 border-b border-slate-200 p-5 sm:p-6 dark:border-slate-800/80">
                                    <div className="rounded-xl bg-emerald-500/10 p-2 text-emerald-500">
                                        <Clock size={20} />
                                    </div>
                                    <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                                        Recent Registrations
                                    </h2>
                                </div>
                                <div className="divide-y divide-slate-100 dark:divide-slate-800/50">
                                    {latestUsers.map((u) => (
                                        <div
                                            key={u._id}
                                            className="flex items-center justify-between gap-4 p-4 transition-colors hover:bg-slate-50 sm:p-5 dark:hover:bg-slate-800/30"
                                        >
                                            <div className="flex min-w-0 flex-1 items-center gap-3">
                                                <img
                                                    src={
                                                        u.avatar_url ||
                                                        `https://ui-avatars.com/api/?name=${u.name}&background=6366f1&color=fff`
                                                    }
                                                    className="h-10 w-10 flex-shrink-0 rounded-full bg-slate-800 object-cover"
                                                    alt={u.name}
                                                />
                                                <div className="min-w-0 flex-1">
                                                    <div className="flex flex-wrap items-center gap-2">
                                                        <p className="truncate text-sm font-semibold text-slate-900 dark:text-white">
                                                            {u.name}
                                                        </p>
                                                        {u.role && (
                                                            <span
                                                                className={`flex-shrink-0 rounded px-1.5 py-0.5 text-[9px] font-extrabold tracking-wider uppercase ${
                                                                    u.role ===
                                                                    'admin'
                                                                        ? 'bg-rose-500/10 text-rose-500'
                                                                        : u.role ===
                                                                            'mentor'
                                                                          ? 'bg-indigo-500/10 text-indigo-500'
                                                                          : 'bg-slate-500/10 text-slate-400'
                                                                }`}
                                                            >
                                                                {u.role}
                                                            </span>
                                                        )}
                                                    </div>
                                                    <p className="mt-0.5 truncate text-xs text-slate-500">
                                                        {u.email}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="flex-shrink-0 text-right text-[10px] text-slate-500">
                                                {u.created_at}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* RIGHT COLUMN: 1 SPAN */}
                        <div className="space-y-8">
                            {/* LEADERBOARD */}
                            <div className="relative overflow-hidden rounded-3xl border border-indigo-500/20 bg-gradient-to-b from-indigo-900 to-slate-900 shadow-lg shadow-indigo-900/20">
                                <div className="absolute top-0 right-0 rounded-full bg-indigo-500/10 p-16 blur-3xl"></div>
                                <div className="relative z-10 flex items-center gap-3 border-b border-indigo-500/10 p-6">
                                    <div className="rounded-xl bg-amber-500/20 p-2 text-amber-400 shadow-[0_0_15px_rgba(251,191,36,0.3)]">
                                        <Trophy size={20} />
                                    </div>
                                    <h2 className="text-lg font-bold text-white">
                                        Global Leaderboard
                                    </h2>
                                </div>
                                <div className="relative z-10 space-y-3 p-4">
                                    {leaderboard.length > 0 ? (
                                        leaderboard.map((user, i) => (
                                            <div
                                                key={user._id}
                                                className="flex items-center gap-3 rounded-2xl border border-white/5 bg-white/5 p-3 backdrop-blur-sm"
                                            >
                                                <div
                                                    className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold shadow-inner ${
                                                        i === 0
                                                            ? 'bg-gradient-to-br from-amber-300 to-amber-500 text-amber-950'
                                                            : i === 1
                                                              ? 'bg-gradient-to-br from-slate-300 to-slate-500 text-slate-900'
                                                              : i === 2
                                                                ? 'bg-gradient-to-br from-orange-400 to-orange-700 text-orange-950'
                                                                : 'bg-slate-800 text-slate-400'
                                                    }`}
                                                >
                                                    {i + 1}
                                                </div>
                                                <div className="min-w-0 flex-1">
                                                    <p className="truncate text-sm font-semibold text-white">
                                                        {user.name}
                                                    </p>
                                                    <p className="text-[10px] text-indigo-300">
                                                        Level {user.level} •{' '}
                                                        {user.exp} EXP
                                                    </p>
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <div className="py-4 text-center text-sm text-slate-400">
                                            No data available
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* PLATFORM ROLES */}
                            <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6 dark:border-slate-800/80 dark:bg-slate-900">
                                <h3 className="mb-4 text-sm font-bold tracking-wider text-slate-900 uppercase dark:text-white">
                                    User Distribution
                                </h3>
                                <div className="space-y-4">
                                    <div>
                                        <div className="mb-1 flex justify-between text-xs">
                                            <span className="flex items-center gap-1.5 font-medium text-slate-500 dark:text-slate-400">
                                                <GraduationCap size={14} />{' '}
                                                Students
                                            </span>
                                            <span className="font-bold text-slate-900 dark:text-white">
                                                {metrics.users.student}
                                            </span>
                                        </div>
                                        <div className="h-2 w-full rounded-full bg-slate-100 dark:bg-slate-800">
                                            <div
                                                className="h-2 rounded-full bg-emerald-500"
                                                style={{
                                                    width: `${Math.max(5, (metrics.users.student / metrics.users.total) * 100)}%`,
                                                }}
                                            ></div>
                                        </div>
                                    </div>
                                    <div>
                                        <div className="mb-1 flex justify-between text-xs">
                                            <span className="flex items-center gap-1.5 font-medium text-slate-500 dark:text-slate-400">
                                                <Users size={14} /> Mentors
                                            </span>
                                            <span className="font-bold text-slate-900 dark:text-white">
                                                {metrics.users.mentor}
                                            </span>
                                        </div>
                                        <div className="h-2 w-full rounded-full bg-slate-100 dark:bg-slate-800">
                                            <div
                                                className="h-2 rounded-full bg-indigo-500"
                                                style={{
                                                    width: `${Math.max(5, (metrics.users.mentor / metrics.users.total) * 100)}%`,
                                                }}
                                            ></div>
                                        </div>
                                    </div>
                                    <div>
                                        <div className="mb-1 flex justify-between text-xs">
                                            <span className="flex items-center gap-1.5 font-medium text-slate-500 dark:text-slate-400">
                                                <Shield size={14} /> Admins
                                            </span>
                                            <span className="font-bold text-slate-900 dark:text-white">
                                                {metrics.users.admin}
                                            </span>
                                        </div>
                                        <div className="h-2 w-full rounded-full bg-slate-100 dark:bg-slate-800">
                                            <div
                                                className="h-2 rounded-full bg-rose-500"
                                                style={{
                                                    width: `${Math.max(5, (metrics.users.admin / metrics.users.total) * 100)}%`,
                                                }}
                                            ></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}

function StatCard({ title, value, subtitle, icon: Icon, color }: any) {
    const colorMap: Record<string, string> = {
        indigo: 'bg-indigo-500/10 text-indigo-500',
        emerald: 'bg-emerald-500/10 text-emerald-500',
        amber: 'bg-amber-500/10 text-amber-500',
        rose: 'bg-rose-500/10 text-rose-500',
    };

    return (
        <div className="group relative overflow-hidden rounded-3xl border border-slate-200 bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg sm:p-6 dark:border-slate-800/80 dark:bg-slate-900">
            <div
                className={`absolute -top-6 -right-6 h-24 w-24 rounded-full opacity-20 blur-2xl transition-opacity group-hover:opacity-40 ${color === 'indigo' ? 'bg-indigo-500' : color === 'emerald' ? 'bg-emerald-500' : 'bg-amber-500'}`}
            ></div>

            <div className="relative z-10 flex items-start justify-between">
                <div>
                    <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
                        {title}
                    </p>
                    <p className="mt-2 text-2xl font-black tracking-tight text-slate-900 sm:text-3xl dark:text-white">
                        {value}
                    </p>
                    <p className="mt-2 text-xs font-medium text-slate-400">
                        {subtitle}
                    </p>
                </div>

                <div
                    className={`flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl sm:h-12 sm:w-12 sm:rounded-2xl ${colorMap[color]}`}
                >
                    <Icon className="h-5 w-5 sm:h-6 sm:w-6" strokeWidth={2.5} />
                </div>
            </div>
        </div>
    );
}
