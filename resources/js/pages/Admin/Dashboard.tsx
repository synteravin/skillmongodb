import AppLayout from '@/layouts/app-layout';
import { Link, usePage } from '@inertiajs/react';
import { 
    Users, BookOpen, CheckCircle, Trophy, 
    TrendingUp, Shield, GraduationCap, Clock
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
        users: { student: number; mentor: number; admin: number; total: number; };
        courses: { total: number; published: number; };
        submissions: { total: number; approved: number; };
    };
    popularCourses: PopularCourse[];
    leaderboard: LeaderboardUser[];
    latestUsers: MetricUser[];
}

export default function Dashboard({ metrics, popularCourses, leaderboard, latestUsers }: DashboardProps) {
    const { auth } = usePage().props as any;
    const user = auth.user;

    return (
        <AppLayout>
            <div className="min-h-screen bg-slate-50 px-4 py-6 sm:px-6 lg:px-10 dark:bg-[#0B1120]">
                <div className="mx-auto max-w-7xl space-y-8">
                    
                    {/* HEADER */}
                    <header className="flex flex-col gap-2 relative">
                        <div className="absolute -top-20 -left-20 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none"></div>
                        <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl dark:text-white flex items-center gap-3">
                            <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-purple-400">
                                Command Center
                            </span>
                        </h1>
                        <p className="max-w-2xl text-sm text-slate-500 dark:text-slate-400">
                            Welcome back,{' '}
                            <span className="font-semibold text-indigo-600 dark:text-indigo-400">
                                {user.name}
                            </span>
                            . Here is the overview of your platform's health and activity.
                        </p>
                    </header>

                    {/* KPI CARDS */}
                    <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
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
                    <div className="grid gap-8 lg:grid-cols-3">
                        
                        {/* LEFT COLUMN: 2 SPANS */}
                        <div className="space-y-8 lg:col-span-2">
                            
                            {/* POPULAR COURSES */}
                            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800/80 rounded-3xl shadow-sm overflow-hidden">
                                <div className="p-6 border-b border-slate-200 dark:border-slate-800/80 flex items-center gap-3">
                                    <div className="p-2 bg-indigo-500/10 rounded-xl text-indigo-500">
                                        <TrendingUp size={20} />
                                    </div>
                                    <h2 className="text-lg font-bold text-slate-900 dark:text-white">Most Popular Courses</h2>
                                </div>
                                <div className="divide-y divide-slate-100 dark:divide-slate-800/50">
                                    {popularCourses.length > 0 ? popularCourses.map((course, i) => (
                                        <div key={course._id} className="p-4 flex items-center gap-4 hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
                                            <div className="w-12 h-12 rounded-xl bg-slate-100 dark:bg-slate-800 overflow-hidden flex-shrink-0">
                                                {course.thumbnail_url ? (
                                                    <img src={course.thumbnail_url} className="w-full h-full object-cover" alt={course.title} />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center text-slate-400"><BookOpen size={20}/></div>
                                                )}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <h3 className="text-sm font-semibold text-slate-900 dark:text-white truncate">{course.title}</h3>
                                                <p className="text-xs text-slate-500 mt-1 flex items-center gap-1">
                                                    <Users size={12} /> {course.students_count} enrolled students
                                                </p>
                                            </div>
                                            <div className="text-xl font-black text-slate-200 dark:text-slate-800">
                                                #{i + 1}
                                            </div>
                                        </div>
                                    )) : (
                                        <div className="p-8 text-center text-slate-500 text-sm">No active courses found.</div>
                                    )}
                                </div>
                            </div>

                            {/* RECENT REGISTRATIONS */}
                            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800/80 rounded-3xl shadow-sm overflow-hidden">
                                <div className="p-6 border-b border-slate-200 dark:border-slate-800/80 flex items-center gap-3">
                                    <div className="p-2 bg-emerald-500/10 rounded-xl text-emerald-500">
                                        <Clock size={20} />
                                    </div>
                                    <h2 className="text-lg font-bold text-slate-900 dark:text-white">Recent Registrations</h2>
                                </div>
                                <div className="divide-y divide-slate-100 dark:divide-slate-800/50">
                                    {latestUsers.map((u) => (
                                        <div key={u._id} className="p-4 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
                                            <div className="flex items-center gap-3">
                                                <img 
                                                    src={u.avatar_url || `https://ui-avatars.com/api/?name=${u.name}&background=6366f1&color=fff`} 
                                                    className="w-10 h-10 rounded-full bg-slate-800 object-cover"
                                                />
                                                <div>
                                                    <p className="text-sm font-medium text-slate-900 dark:text-white">{u.name}</p>
                                                    <p className="text-xs text-slate-500">{u.email}</p>
                                                </div>
                                            </div>
                                            <div className="flex flex-col items-end">
                                                <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-md ${
                                                    u.role === 'admin' ? 'bg-rose-500/10 text-rose-500' :
                                                    u.role === 'mentor' ? 'bg-indigo-500/10 text-indigo-500' :
                                                    'bg-slate-500/10 text-slate-400'
                                                }`}>
                                                    {u.role}
                                                </span>
                                                <span className="text-[10px] text-slate-500 mt-1">{u.created_at}</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* RIGHT COLUMN: 1 SPAN */}
                        <div className="space-y-8">
                            
                            {/* LEADERBOARD */}
                            <div className="bg-gradient-to-b from-indigo-900 to-slate-900 border border-indigo-500/20 rounded-3xl shadow-lg shadow-indigo-900/20 overflow-hidden relative">
                                <div className="absolute top-0 right-0 p-16 bg-indigo-500/10 blur-3xl rounded-full"></div>
                                <div className="p-6 border-b border-indigo-500/10 flex items-center gap-3 relative z-10">
                                    <div className="p-2 bg-amber-500/20 rounded-xl text-amber-400 shadow-[0_0_15px_rgba(251,191,36,0.3)]">
                                        <Trophy size={20} />
                                    </div>
                                    <h2 className="text-lg font-bold text-white">Global Leaderboard</h2>
                                </div>
                                <div className="p-4 space-y-3 relative z-10">
                                    {leaderboard.length > 0 ? leaderboard.map((user, i) => (
                                        <div key={user._id} className="bg-white/5 border border-white/5 rounded-2xl p-3 flex items-center gap-3 backdrop-blur-sm">
                                            <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm shadow-inner ${
                                                i === 0 ? 'bg-gradient-to-br from-amber-300 to-amber-500 text-amber-950' :
                                                i === 1 ? 'bg-gradient-to-br from-slate-300 to-slate-500 text-slate-900' :
                                                i === 2 ? 'bg-gradient-to-br from-orange-400 to-orange-700 text-orange-950' :
                                                'bg-slate-800 text-slate-400'
                                            }`}>
                                                {i + 1}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm font-semibold text-white truncate">{user.name}</p>
                                                <p className="text-[10px] text-indigo-300">Level {user.level} • {user.exp} EXP</p>
                                            </div>
                                        </div>
                                    )) : (
                                        <div className="text-center text-slate-400 text-sm py-4">No data available</div>
                                    )}
                                </div>
                            </div>

                            {/* PLATFORM ROLES */}
                            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800/80 rounded-3xl shadow-sm p-6">
                                <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-4 uppercase tracking-wider">User Distribution</h3>
                                <div className="space-y-4">
                                    <div>
                                        <div className="flex justify-between text-xs mb-1">
                                            <span className="text-slate-400 font-medium flex items-center gap-1.5"><GraduationCap size={14}/> Students</span>
                                            <span className="text-white font-bold">{metrics.users.student}</span>
                                        </div>
                                        <div className="w-full bg-slate-800 rounded-full h-2">
                                            <div className="bg-emerald-500 h-2 rounded-full" style={{ width: `${Math.max(5, (metrics.users.student / metrics.users.total) * 100)}%` }}></div>
                                        </div>
                                    </div>
                                    <div>
                                        <div className="flex justify-between text-xs mb-1">
                                            <span className="text-slate-400 font-medium flex items-center gap-1.5"><Users size={14}/> Mentors</span>
                                            <span className="text-white font-bold">{metrics.users.mentor}</span>
                                        </div>
                                        <div className="w-full bg-slate-800 rounded-full h-2">
                                            <div className="bg-indigo-500 h-2 rounded-full" style={{ width: `${Math.max(5, (metrics.users.mentor / metrics.users.total) * 100)}%` }}></div>
                                        </div>
                                    </div>
                                    <div>
                                        <div className="flex justify-between text-xs mb-1">
                                            <span className="text-slate-400 font-medium flex items-center gap-1.5"><Shield size={14}/> Admins</span>
                                            <span className="text-white font-bold">{metrics.users.admin}</span>
                                        </div>
                                        <div className="w-full bg-slate-800 rounded-full h-2">
                                            <div className="bg-rose-500 h-2 rounded-full" style={{ width: `${Math.max(5, (metrics.users.admin / metrics.users.total) * 100)}%` }}></div>
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
        <div className="relative overflow-hidden rounded-3xl border border-slate-200 dark:border-slate-800/80 bg-white dark:bg-slate-900 p-6 shadow-sm group hover:-translate-y-1 hover:shadow-lg transition-all duration-300">
            <div className={`absolute -right-6 -top-6 w-24 h-24 rounded-full blur-2xl opacity-20 transition-opacity group-hover:opacity-40 ${color === 'indigo' ? 'bg-indigo-500' : color === 'emerald' ? 'bg-emerald-500' : 'bg-amber-500'}`}></div>
            
            <div className="flex items-start justify-between relative z-10">
                <div>
                    <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
                        {title}
                    </p>
                    <p className="mt-2 text-3xl font-black text-slate-900 dark:text-white tracking-tight">
                        {value}
                    </p>
                    <p className="mt-2 text-xs font-medium text-slate-400">
                        {subtitle}
                    </p>
                </div>

                <div className={`flex h-12 w-12 items-center justify-center rounded-2xl ${colorMap[color]}`}>
                    <Icon size={24} strokeWidth={2.5} />
                </div>
            </div>
        </div>
    );
}
