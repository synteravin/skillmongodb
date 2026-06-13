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
            <div className="relative min-h-screen bg-[#030712] text-white px-6 py-4 sm:px-6 lg:px-10 overflow-hidden">
                {/* Subtle top-center ambient glow */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[450px] pointer-events-none select-none  z-0" />

                <div className="relative z-10 mx-auto max-w-7xl space-y-4 sm:space-y-5">
                    {/* HEADER */}
                        <header
                        className="relative overflow-hidden rounded-xl px-6 py-5 bg-[#0d0f17] dark:bg-[#0d0f17] bg-[#f5f6ff]"
                        style={{
                            backgroundImage: `
                            linear-gradient(rgba(59,40,246,0.07) 1px, transparent 1px),
                            linear-gradient(90deg, rgba(59,40,246,0.07) 1px, transparent 1px)
                            `,
                            backgroundSize: '40px 40px',
                        }}
                        >
                        {/* Corner brackets */}
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
                                fontFamily:'Orbitron, sans-serif',
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
                    <div className="grid gap-5 lg:grid-cols-2 lg:gap-6">

                        {/* POPULAR COURSES */}
                        <div className="relative overflow-hidden rounded-xl border bg-gradient-to-b from-[#0e0e1a] to-[#090910] flex flex-col justify-between"
                            style={{ borderColor: 'rgba(108,99,255,0.15)' }}>

                            <span className="absolute top-2 left-2 h-2.5 w-2.5 border-t border-l" style={{ borderColor: '#6C63FF', opacity: 0.4 }} />
                            <span className="absolute top-2 right-2 h-2.5 w-2.5 border-t border-r" style={{ borderColor: '#6C63FF', opacity: 0.4 }} />
                            <span className="absolute bottom-2 left-2 h-2.5 w-2.5 border-b border-l" style={{ borderColor: '#6C63FF', opacity: 0.4 }} />
                            <span className="absolute bottom-2 right-2 h-2.5 w-2.5 border-b border-r" style={{ borderColor: '#6C63FF', opacity: 0.4 }} />

                            <div className="absolute top-0 left-8 right-8 h-px"
                                style={{ background: 'linear-gradient(90deg, transparent, rgba(108,99,255,0.4), transparent)' }} />

                            <div>
                                {/* Header */}
                                <div className="border-b px-5 py-3.5 sm:px-6" style={{ borderColor: 'rgba(255,255,255,0.05)' }}>
                                    <h2 className="text-sm font-bold uppercase tracking-[0.2em] text-white"
                                        style={{ fontFamily: "'Outfit', sans-serif" }}>
                                        Most Popular Courses
                                    </h2>
                                </div>

                                {/* List */}
                                <div className="divide-y" style={{ borderColor: 'rgba(255,255,255,0.04)' }}>
                                    {popularCourses.length > 0 ? (
                                        popularCourses.map((course, i) => (
                                            <div key={course._id}
                                                className="flex items-center justify-between gap-4 py-2.5 px-5 transition-colors"
                                                style={{ fontFamily: "'Outfit', sans-serif" }}
                                                onMouseEnter={e => (e.currentTarget.style.background = 'rgba(108,99,255,0.04)')}
                                                onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                                            >
                                                <div className="flex items-center gap-4 min-w-0">
                                                    <span className="text-sm font-black tabular-nums shrink-0" style={{ color: 'rgba(108,99,255,0.35)' }}>
                                                        #{i + 1}
                                                    </span>
                                                    <h3 className="truncate text-sm font-semibold text-white">{course.title}</h3>
                                                </div>
                                                <span className="text-xs font-medium shrink-0" style={{ color: 'rgba(255,255,255,0.4)' }}>
                                                    {course.students_count} enrolled
                                                </span>
                                            </div>
                                        ))
                                    ) : (
                                        <div className="p-8 text-center text-sm" style={{ color: 'rgba(255,255,255,0.3)', fontFamily: "'Outfit', sans-serif" }}>
                                            No active courses found.
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Footer */}
                            <div className="border-t px-5 py-3 text-center" style={{ borderColor: 'rgba(255,255,255,0.05)' }}>
                                <Link
                                    href="/admin/courses"
                                    className="text-xs font-semibold text-[#6C63FF] hover:text-[#8B5CF6] transition-colors inline-flex items-center gap-1"
                                    style={{ fontFamily: "'Outfit', sans-serif" }}
                                >
                                    View All Courses <span className="text-sm font-normal">→</span>
                                </Link>
                            </div>
                        </div>

                        {/* LEADERBOARD */}
                        <div className="relative overflow-hidden rounded-xl border bg-gradient-to-b from-[#0e0e1a] to-[#090910] flex flex-col justify-between"
                            style={{ borderColor: 'rgba(245,158,11,0.15)' }}>

                            <span className="absolute top-2 left-2 h-2.5 w-2.5 border-t border-l" style={{ borderColor: '#F59E0B', opacity: 0.4 }} />
                            <span className="absolute top-2 right-2 h-2.5 w-2.5 border-t border-r" style={{ borderColor: '#F59E0B', opacity: 0.4 }} />
                            <span className="absolute bottom-2 left-2 h-2.5 w-2.5 border-b border-l" style={{ borderColor: '#F59E0B', opacity: 0.4 }} />
                            <span className="absolute bottom-2 right-2 h-2.5 w-2.5 border-b border-r" style={{ borderColor: '#F59E0B', opacity: 0.4 }} />

                            <div className="absolute top-0 left-8 right-8 h-px"
                                style={{ background: 'linear-gradient(90deg, transparent, rgba(245,158,11,0.4), transparent)' }} />

                            <div>
                                <div className="border-b px-5 py-3.5 sm:px-6" style={{ borderColor: 'rgba(255,255,255,0.05)' }}>
                                    <h2 className="text-sm font-bold uppercase tracking-[0.2em] text-white"
                                        style={{ fontFamily: "'Outfit', sans-serif" }}>
                                        Global Leaderboard
                                    </h2>
                                </div>

                                <div className="space-y-1.5 p-4">
                                    {leaderboard.length > 0 ? (
                                        leaderboard.map((user, i) => (
                                            <div key={user._id}
                                                className="flex items-center gap-2.5 rounded-lg py-2 px-3"
                                                style={{
                                                    background: 'rgba(255,255,255,0.02)',
                                                    border: '1px solid rgba(255,255,255,0.04)',
                                                    fontFamily: "'Outfit', sans-serif",
                                                }}>
                                                <div className={`flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full text-[10px] font-bold border ${
                                                    i === 0
                                                        ? 'bg-gradient-to-br from-amber-300 to-amber-500 text-amber-950 border-amber-400'
                                                        : i === 1
                                                            ? 'bg-gradient-to-br from-slate-200 to-slate-400 text-slate-950 border-slate-300'
                                                            : i === 2
                                                                ? 'bg-gradient-to-br from-amber-600 to-amber-800 text-amber-50 border-amber-700'
                                                                : 'text-slate-400 border-white/5'
                                                }`}
                                                    style={{
                                                        background: i > 2 ? 'rgba(255,255,255,0.04)' : undefined,
                                                        fontFamily: "'Outfit', sans-serif",
                                                    }}>
                                                    {i + 1}
                                                </div>
                                                <div className="min-w-0 flex-1">
                                                    <p className="truncate text-xs font-semibold text-white">{user.name}</p>
                                                    <p className="text-[9px]" style={{ color: 'rgba(255,255,255,0.3)' }}>
                                                        Lv.{user.level} · {user.exp} EXP
                                                    </p>
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <div className="py-4 text-center text-sm" style={{ color: 'rgba(255,255,255,0.3)', fontFamily: "'Outfit ', sans-serif" }}>
                                            No data available
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* RECENT REGISTRATIONS */}
                        <div className="relative overflow-hidden rounded-xl border bg-gradient-to-b from-[#0e0e1a] to-[#090910] flex flex-col justify-between"
                            style={{ borderColor: 'rgba(16,185,129,0.15)' }}>

                            <span className="absolute top-2 left-2 h-2.5 w-2.5 border-t border-l" style={{ borderColor: '#10B981', opacity: 0.4 }} />
                            <span className="absolute top-2 right-2 h-2.5 w-2.5 border-t border-r" style={{ borderColor: '#10B981', opacity: 0.4 }} />
                            <span className="absolute bottom-2 left-2 h-2.5 w-2.5 border-b border-l" style={{ borderColor: '#10B981', opacity: 0.4 }} />
                            <span className="absolute bottom-2 right-2 h-2.5 w-2.5 border-b border-r" style={{ borderColor: '#10B981', opacity: 0.4 }} />

                            <div className="absolute top-0 left-8 right-8 h-px"
                                style={{ background: 'linear-gradient(90deg, transparent, rgba(16,185,129,0.4), transparent)' }} />

                            <div>
                                <div className="border-b px-5 py-3.5 sm:px-6" style={{ borderColor: 'rgba(255,255,255,0.05)' }}>
                                    <h2 className="text-sm font-bold uppercase tracking-[0.2em] text-white"
                                        style={{ fontFamily: "'Outfit', sans-serif" }}>
                                        Recent Registrations
                                    </h2>
                                </div>

                                <div className="overflow-x-auto">
                                    <table className="w-full text-left border-collapse" style={{ fontFamily: "'Outfit', sans-serif" }}>
                                        <thead>
                                            <tr className="border-b border-white/5 bg-white/[0.01] text-[10px] font-bold uppercase tracking-wider text-slate-400">
                                                <th className="px-5 py-2.5">Name</th>
                                                <th className="px-5 py-2.5">Email</th>
                                                <th className="px-5 py-2.5">Role</th>
                                                <th className="px-5 py-2.5">Joined</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-white/5">
                                            {latestUsers.map((u) => (
                                                <tr 
                                                    key={u._id}
                                                    className="hover:bg-[rgba(16,185,129,0.02)] transition-colors text-xs text-slate-200"
                                                >
                                                    <td className="px-5 py-2 font-medium flex items-center gap-2">
                                                        <img
                                                            src={u.avatar_url || `https://ui-avatars.com/api/?name=${u.name}&background=6366f1&color=fff`}
                                                            className="h-5 w-5 rounded-full object-cover"
                                                            style={{ border: '1px solid rgba(255,255,255,0.08)' }}
                                                            alt={u.name}
                                                        />
                                                        <span className="truncate max-w-[100px]">{u.name}</span>
                                                    </td>
                                                    <td className="px-5 py-2 text-slate-400 truncate max-w-[130px]">{u.email}</td>
                                                    <td className="px-5 py-2">
                                                        {u.role && (
                                                            <span className={`inline-block rounded px-1.5 py-0.5 text-[9px] font-extrabold tracking-wider uppercase border ${
                                                                u.role === 'admin'
                                                                    ? 'bg-rose-500/10 text-rose-400 border-rose-500/20'
                                                                    : u.role === 'mentor'
                                                                        ? 'bg-[#6C63FF]/10 text-[#6C63FF] border-[#6C63FF]/20'
                                                                        : 'bg-white/5 text-slate-400 border-white/5'
                                                            }`}>
                                                                {u.role}
                                                            </span>
                                                        )}
                                                    </td>
                                                    <td className="px-5 py-2 text-slate-400 whitespace-nowrap text-[10px]">{u.created_at}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>

                            {/* Footer */}
                            <div className="border-t px-5 py-3 text-center" style={{ borderColor: 'rgba(255,255,255,0.05)' }}>
                                <Link
                                    href="/admin/users"
                                    className="text-xs font-semibold text-[#10B981] hover:text-[#34D399] transition-colors inline-flex items-center gap-1"
                                    style={{ fontFamily: "'Outfit', sans-serif" }}
                                >
                                    View All Users <span className="text-sm font-normal">→</span>
                                </Link>
                            </div>
                        </div>

                        {/* ACCOUNT SUMMARY */}
                        <div className="relative overflow-hidden rounded-xl border bg-gradient-to-b from-[#0e0e1a] to-[#090910] p-5 sm:p-6 flex flex-col justify-between"
                            style={{ borderColor: 'rgba(108,99,255,0.15)' }}>

                            <span className="absolute top-2 left-2 h-2.5 w-2.5 border-t border-l" style={{ borderColor: '#6C63FF', opacity: 0.4 }} />
                            <span className="absolute top-2 right-2 h-2.5 w-2.5 border-t border-r" style={{ borderColor: '#6C63FF', opacity: 0.4 }} />
                            <span className="absolute bottom-2 left-2 h-2.5 w-2.5 border-b border-l" style={{ borderColor: '#6C63FF', opacity: 0.4 }} />
                            <span className="absolute bottom-2 right-2 h-2.5 w-2.5 border-b border-r" style={{ borderColor: '#6C63FF', opacity: 0.4 }} />

                            <div className="absolute top-0 left-8 right-8 h-px"
                                style={{ background: 'linear-gradient(90deg, transparent, rgba(108,99,255,0.4), transparent)' }} />

                            <div>
                                <h3 className="mb-5 text-[0.6rem] font-bold uppercase tracking-[0.2em] text-white"
                                    style={{ fontFamily: "'Outfit', sans-serif" }}>
                                    Account Summary
                                </h3>

                                <div className="grid grid-cols-3 gap-3" style={{ fontFamily: "'Outfit', sans-serif" }}>
                                    {[
                                        { label: 'Students', value: metrics.users.student, color: '#10B981', border: 'rgba(16,185,129,0.15)', bg: 'rgba(16,185,129,0.03)' },
                                        { label: 'Mentors',  value: metrics.users.mentor,  color: '#6C63FF', border: 'rgba(108,99,255,0.15)', bg: 'rgba(108,99,255,0.03)' },
                                        { label: 'Admins',   value: metrics.users.admin,   color: '#F43F5E', border: 'rgba(244,63,94,0.15)', bg: 'rgba(244,63,94,0.03)' },
                                    ].map(({ label, value, color, border, bg }) => (
                                        <div key={label} 
                                             className="flex flex-col items-center justify-center py-3 px-2 rounded-lg border text-center"
                                             style={{ borderColor: border, background: bg }}>
                                            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">{label}</span>
                                            <span className="text-xl font-black tabular-nums" style={{ color }}>{value}</span>
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

function StatCard({ title, value, subtitle, color }: any) {
    const accentMap: Record<string, string> = {
        indigo:  '#6C63FF',
        emerald: '#10B981',
        amber:   '#F59E0B',
        rose:    '#F43F5E',
    };
 
    const accent = accentMap[color] ?? accentMap.indigo;
 
    return (
        <div
            className="group relative overflow-hidden rounded-xl border p-4 sm:p-5 "
            style={{
                fontFamily: "'Outfit', sans-serif",
                borderColor: `${accent}22`,
                background: 'linear-gradient(160deg, #0e0e1a, #090910)',
                boxShadow: `inset 0 0 0 0 transparent`,
            }}
        >
            {/* Corner brackets */}
            <span className="absolute top-2 left-2 h-2.5 w-2.5 border-t border-l" style={{ borderColor: accent, opacity: 0.45 }} />
            <span className="absolute top-2 right-2 h-2.5 w-2.5 border-t border-r" style={{ borderColor: accent, opacity: 0.45 }} />
            <span className="absolute bottom-2 left-2 h-2.5 w-2.5 border-b border-l" style={{ borderColor: accent, opacity: 0.45 }} />
            <span className="absolute bottom-2 right-2 h-2.5 w-2.5 border-b border-r" style={{ borderColor: accent, opacity: 0.45 }} />
 
            {/* Top accent line */}
            <div
                className="absolute top-0 left-8 right-8 h-px"
                style={{ background: `linear-gradient(90deg, transparent, ${accent}55, transparent)` }}
            />
 
            {/* Content */}
            <p
                className="text-[0.6rem] font-semibold uppercase tracking-[0.2em]"
                style={{ color: 'rgba(255,255,255,0.4)' }}
            >
                {title}
            </p>
 
            <p
                className="mt-2 text-2xl sm:text-3xl font-black tracking-tight leading-none"
                style={{ color: accent, fontFamily: "'Outfit', sans-serif" }}
            >
                {value}
            </p>
 
            <p
                className="mt-2 text-xs tracking-wide"
                style={{ color: 'rgba(255,255,255,0.3)', fontFamily: "'Outfit', sans-serif" }}
            >
                {subtitle}
            </p>
        </div>
    );
}