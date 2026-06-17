import AppLayout from '@/layouts/app-layout';
import { Link, usePage } from '@inertiajs/react';

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
            <div className="relative min-h-screen bg-[#f8fafc] px-6 py-4 sm:px-6 lg:px-10 overflow-hidden text-slate-900 dark:bg-[#030712] dark:text-white transition-colors duration-200">
                <div className="relative z-10 mx-auto max-w-7xl space-y-4 sm:space-y-5">

                    {/* HEADER — keep original premium style */}
                    <header
                        className="relative overflow-hidden rounded-xl px-6 py-5 bg-[#f5f6ff] dark:bg-[#0d0f17]"
                        style={{
                            backgroundImage: `
                            linear-gradient(rgba(59,40,246,0.07) 1px, transparent 1px),
                            linear-gradient(90deg, rgba(59,40,246,0.07) 1px, transparent 1px)
                            `,
                            backgroundSize: '40px 40px',
                        }}
                    >
                        {/* Corner brackets kept ONLY on the header as originally requested */}
                        <span className="absolute left-3.5 top-3.5 h-3 w-3 border-l border-t dark:border-[rgba(59,40,246,0.45)] border-[rgba(59,40,246,0.2)]" />
                        <span className="absolute right-3.5 top-3.5 h-3 w-3 border-r border-t dark:border-[rgba(59,40,246,0.45)] border-[rgba(59,40,246,0.2)]" />
                        <span className="absolute bottom-3.5 left-3.5 h-3 w-3 border-b border-l dark:border-[rgba(59,40,246,0.45)] border-[rgba(59,40,246,0.2)]" />
                        <span className="absolute bottom-3.5 right-3.5 h-3 w-3 border-b border-r dark:border-[rgba(59,40,246,0.45)] border-[rgba(59,40,246,0.2)]" />

                        <div className="relative z-10 flex flex-col gap-3">
                            {/* Badge */}
                            <div className="inline-flex w-fit items-center gap-1.5 rounded border px-2.5 py-1
                            dark:border-[rgba(59,40,246,0.35)] dark:bg-[rgba(59,40,246,0.1)]
                            border-[rgba(59,40,246,0.2)] bg-[rgba(59,40,246,0.06)]"
                            >
                                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[#3B28F6]" />
                                <span className="text-[11px] font-medium uppercase tracking-[0.12em] text-[#3B28F6]">
                                    Dashboard
                                </span>
                            </div>

                            {/* Title */}
                            <h1
                                className="m-0 text-3xl font-bold leading-none tracking-tight"
                                style={{
                                    background: 'linear-gradient(135deg, #2a1ce0 0%, #3B28F6 100%)',
                                    WebkitBackgroundClip: 'text',
                                    WebkitTextFillColor: 'transparent',
                                    backgroundClip: 'text',
                                    fontFamily: 'Orbitron, sans-serif',
                                }}
                            >
                                Skill Ventura
                            </h1>

                            {/* Subtitle */}
                            <div className="flex items-center gap-2.5">
                                <div className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full text-[10px] font-semibold
                                    dark:bg-[rgba(59,40,246,0.2)] bg-[rgba(59,40,246,0.08)] text-[#3B28F6]"
                                >
                                    {user.name.split(' ').map((n: string) => n[0]).join('').slice(0, 2).toUpperCase()}
                                </div>
                                <p className="m-0 text-[13.5px] dark:text-slate-400/70 text-slate-600/75">
                                    Welcome back,{' '}
                                    <span className="font-medium text-[#3B28F6]">
                                        {user.name}
                                    </span>
                                    <span className="mx-2 inline-block h-[11px] w-px dark:bg-white/10 bg-black/10 align-middle" />
                                    <span className="text-xs dark:text-slate-400/30 text-slate-500/35 tracking-wide">
                                        Platform health &amp; activity
                                    </span>
                                </p>
                            </div>
                        </div>
                    </header>

                    {/* KPI CARDS */}
                    <section className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                        <StatCard
                            title="Total Users"
                            value={metrics.users.total.toString()}
                            subtitle={`${metrics.users.student} Students, ${metrics.users.mentor} Mentors`}
                        />
                        <StatCard
                            title="Published Courses"
                            value={metrics.courses.published.toString()}
                            subtitle={`Out of ${metrics.courses.total} total courses`}
                        />
                        <StatCard
                            title="Approved Submissions"
                            value={metrics.submissions.approved.toString()}
                            subtitle={`Out of ${metrics.submissions.total} total submissions`}
                        />
                    </section>

                    {/* MAIN CONTENT GRID */}
                    <div className="grid gap-5 lg:grid-cols-2 lg:gap-6">

                        {/* POPULAR COURSES */}
                        <div className="relative overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-gradient-to-b dark:from-[#0e0e1a] dark:to-[#090910] dark:shadow-none flex flex-col justify-between">
                            {/* Top accent line */}
                            <div className="absolute top-0 right-8 left-8 h-px bg-gradient-to-r from-transparent via-slate-300 to-transparent dark:via-slate-700" />

                            <div>
                                {/* Header */}
                                <div className="border-b border-slate-200 px-5 py-3.5 sm:px-6 dark:border-white/5">
                                    <h2 className="text-sm font-bold uppercase tracking-[0.2em] text-slate-800 dark:text-white"
                                        style={{ fontFamily: "'Outfit', sans-serif" }}>
                                        Most Popular Courses
                                    </h2>
                                </div>

                                {/* List */}
                                <div className="divide-y divide-slate-100 dark:divide-white/5">
                                    {popularCourses.length > 0 ? (
                                        popularCourses.map((course, i) => (
                                            <div key={course._id}
                                                className="flex items-center justify-between gap-4 py-2.5 px-5 transition-colors hover:bg-slate-50 dark:hover:bg-slate-900/40"
                                                style={{ fontFamily: "'Outfit', sans-serif" }}
                                            >
                                                <div className="flex items-center gap-4 min-w-0">
                                                    <span className="text-sm font-black tabular-nums shrink-0 text-slate-400 dark:text-slate-500">
                                                        #{i + 1}
                                                    </span>
                                                    <h3 className="truncate text-sm font-semibold text-slate-800 dark:text-white">{course.title}</h3>
                                                </div>
                                                <span className="text-xs font-medium shrink-0 text-slate-500 dark:text-slate-400">
                                                    {course.students_count} enrolled
                                                </span>
                                            </div>
                                        ))
                                    ) : (
                                        <div className="p-8 text-center text-sm text-slate-400 dark:text-slate-500" style={{ fontFamily: "'Outfit', sans-serif" }}>
                                            No active courses found.
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Footer */}
                            <div className="border-t border-slate-200 px-5 py-3 text-center dark:border-white/5">
                                <Link
                                    href="/admin/courses"
                                    className="text-xs font-semibold text-slate-600 hover:text-slate-900 transition-colors inline-flex items-center gap-1 dark:text-slate-400 dark:hover:text-white"
                                    style={{ fontFamily: "'Outfit', sans-serif" }}
                                >
                                    View All Courses <span className="text-sm font-normal">→</span>
                                </Link>
                            </div>
                        </div>

                        {/* LEADERBOARD */}
                        <div className="relative overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-gradient-to-b dark:from-[#0e0e1a] dark:to-[#090910] dark:shadow-none flex flex-col justify-between">
                            {/* Top accent line */}
                            <div className="absolute top-0 right-8 left-8 h-px bg-gradient-to-r from-transparent via-slate-300 to-transparent dark:via-slate-700" />

                            <div>
                                <div className="border-b border-slate-200 px-5 py-3.5 sm:px-6 dark:border-white/5">
                                    <h2 className="text-sm font-bold uppercase tracking-[0.2em] text-slate-800 dark:text-white"
                                        style={{ fontFamily: "'Outfit', sans-serif" }}>
                                        Global Leaderboard
                                    </h2>
                                </div>

                                <div className="space-y-1.5 p-4">
                                    {leaderboard.length > 0 ? (
                                        leaderboard.map((u, i) => (
                                            <div key={u._id}
                                                className="flex items-center gap-2.5 rounded-lg py-2 px-3 border border-slate-100 bg-slate-50/50 dark:border-white/5 dark:bg-white/[0.02]"
                                                style={{ fontFamily: "'Outfit', sans-serif" }}>
                                                <div className={`flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full text-[10px] font-bold border ${
                                                    i === 0
                                                        ? 'bg-gradient-to-br from-amber-100 to-amber-200 text-amber-900 border-amber-300 dark:from-amber-300 dark:to-amber-500 dark:border-amber-400 dark:text-amber-950'
                                                        : i === 1
                                                            ? 'bg-gradient-to-br from-slate-100 to-slate-200 text-slate-900 border-slate-300 dark:from-slate-200 dark:to-slate-400'
                                                            : i === 2
                                                                ? 'bg-gradient-to-br from-orange-100 to-orange-200 text-orange-900 border-orange-300 dark:from-amber-600 dark:to-amber-800 dark:text-amber-50 dark:border-amber-700'
                                                                : 'text-slate-500 dark:text-slate-400 border-slate-200 dark:border-white/5 bg-slate-50 dark:bg-white/[0.02]'
                                                }`}>
                                                    {i + 1}
                                                </div>
                                                <div className="min-w-0 flex-1">
                                                    <p className="truncate text-xs font-semibold text-slate-800 dark:text-white">{u.name}</p>
                                                    <p className="text-[9px] text-slate-400 dark:text-slate-500">
                                                        Lv.{u.level} · {u.exp} EXP
                                                    </p>
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <div className="py-4 text-center text-sm text-slate-400 dark:text-slate-500" style={{ fontFamily: "'Outfit', sans-serif" }}>
                                            No data available
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* RECENT REGISTRATIONS */}
                        <div className="relative overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-gradient-to-b dark:from-[#0e0e1a] dark:to-[#090910] dark:shadow-none flex flex-col justify-between">
                            {/* Top accent line */}
                            <div className="absolute top-0 right-8 left-8 h-px bg-gradient-to-r from-transparent via-slate-300 to-transparent dark:via-slate-700" />

                            <div>
                                <div className="border-b border-slate-200 px-5 py-3.5 sm:px-6 dark:border-white/5">
                                    <h2 className="text-sm font-bold uppercase tracking-[0.2em] text-slate-800 dark:text-white"
                                        style={{ fontFamily: "'Outfit', sans-serif" }}>
                                        Recent Registrations
                                    </h2>
                                </div>

                                <div className="overflow-x-auto">
                                    <table className="w-full text-left border-collapse" style={{ fontFamily: "'Outfit', sans-serif" }}>
                                        <thead>
                                            <tr className="border-b border-slate-100 bg-slate-50/50 text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:border-white/5 dark:bg-white/[0.01] dark:text-slate-400">
                                                <th className="px-5 py-2.5">Name</th>
                                                <th className="px-5 py-2.5">Email</th>
                                                <th className="px-5 py-2.5">Role</th>
                                                <th className="px-5 py-2.5">Joined</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-slate-100 dark:divide-white/5">
                                            {latestUsers.map((u) => (
                                                <tr
                                                    key={u._id}
                                                    className="hover:bg-slate-50/50 transition-colors text-xs text-slate-800 dark:hover:bg-white/[0.02] dark:text-slate-200"
                                                >
                                                    <td className="px-5 py-2 font-medium flex items-center gap-2">
                                                        <img
                                                            src={u.avatar_url || `https://ui-avatars.com/api/?name=${u.name}&background=6366f1&color=fff`}
                                                            className="h-5 w-5 rounded-full object-cover border border-slate-200 dark:border-white/5"
                                                            alt={u.name}
                                                        />
                                                        <span className="truncate max-w-[100px]">{u.name}</span>
                                                    </td>
                                                    <td className="px-5 py-2 text-slate-500 dark:text-slate-400 truncate max-w-[130px]">{u.email}</td>
                                                    <td className="px-5 py-2">
                                                        {u.role && (
                                                            <span className={`inline-block rounded px-1.5 py-0.5 text-[9px] font-extrabold tracking-wider uppercase border ${
                                                                u.role === 'admin'
                                                                    ? 'bg-rose-500/10 text-rose-600 border-rose-500/20 dark:text-rose-400'
                                                                    : u.role === 'mentor'
                                                                        ? 'bg-indigo-500/10 text-indigo-600 border-indigo-500/20 dark:text-indigo-400'
                                                                        : 'bg-slate-100 text-slate-600 border-slate-200 dark:bg-white/5 dark:text-slate-400 dark:border-white/5'
                                                            }`}>
                                                                {u.role}
                                                            </span>
                                                        )}
                                                    </td>
                                                    <td className="px-5 py-2 text-slate-500 dark:text-slate-400 whitespace-nowrap text-[10px]">{u.created_at}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>

                            {/* Footer */}
                            <div className="border-t border-slate-200 px-5 py-3 text-center dark:border-white/5">
                                <Link
                                    href="/admin/users"
                                    className="text-xs font-semibold text-slate-600 hover:text-slate-900 transition-colors inline-flex items-center gap-1 dark:text-slate-400 dark:hover:text-white"
                                    style={{ fontFamily: "'Outfit', sans-serif" }}
                                >
                                    View All Users <span className="text-sm font-normal">→</span>
                                </Link>
                            </div>
                        </div>

                        {/* ACCOUNT SUMMARY */}
                        <div className="relative overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-gradient-to-b dark:from-[#0e0e1a] dark:to-[#090910] dark:shadow-none p-5 sm:p-6 flex flex-col justify-between">
                            {/* Top accent line */}
                            <div className="absolute top-0 right-8 left-8 h-px bg-gradient-to-r from-transparent via-slate-300 to-transparent dark:via-slate-700" />

                            <div>
                                <h3 className="mb-5 text-[0.6rem] font-bold uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400"
                                    style={{ fontFamily: "'Outfit', sans-serif" }}>
                                    Account Summary
                                </h3>

                                <div className="grid grid-cols-3 gap-3" style={{ fontFamily: "'Outfit', sans-serif" }}>
                                    {[
                                        { label: 'Students', value: metrics.users.student, textClass: 'text-emerald-600 dark:text-emerald-400' },
                                        { label: 'Mentors',  value: metrics.users.mentor,  textClass: 'text-indigo-600 dark:text-indigo-400' },
                                        { label: 'Admins',   value: metrics.users.admin,   textClass: 'text-rose-600 dark:text-rose-400' },
                                    ].map(({ label, value, textClass }) => (
                                        <div key={label}
                                             className="flex flex-col items-center justify-center py-3 px-2 rounded-lg border text-center border-slate-200 bg-slate-50 dark:border-slate-800 dark:bg-white/[0.02]">
                                             <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">{label}</span>
                                             <span className={`text-xl font-black tabular-nums ${textClass}`}>{value}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </AppLayout>
    );
}

function StatCard({ title, value, subtitle }: { title: string; value: string; subtitle: string }) {
    return (
        <div
            className="relative overflow-hidden rounded-xl border border-slate-200 p-4 sm:p-5 dark:border-slate-800"
            style={{ fontFamily: "'Outfit', sans-serif" }}
        >
            <div className="absolute inset-0 bg-white dark:bg-gradient-to-b dark:from-[#0e0e1a] dark:to-[#090910]" />
            {/* Top accent line */}
            <div className="absolute top-0 right-8 left-8 h-px bg-gradient-to-r from-transparent via-slate-300 to-transparent dark:via-slate-700" />

            {/* Content */}
            <div className="relative z-10">
                <p className="text-[0.6rem] font-semibold tracking-[0.2em] text-slate-500 uppercase dark:text-slate-500">
                    {title}
                </p>

                <p className="mt-2 text-2xl leading-none font-black tracking-tight text-slate-800 sm:text-3xl dark:text-white">
                    {value}
                </p>

                <p className="mt-2 text-xs tracking-wide text-slate-500 dark:text-slate-400/60">
                    {subtitle}
                </p>
            </div>
        </div>
    );
}