import AppLayout from '@/layouts/app-layout';
import { BookOpen, Users, Activity, ArrowRight, Layers, GraduationCap, ClipboardList, TrendingUp } from 'lucide-react';
import { Link, router } from '@inertiajs/react';
type CareerGroup = {
    id: string;
    name: string;
    paths_count: number;
};

type Mentor = {
    name: string;
    stats: {
        career_groups: number;
        students: number;
        active: number;
        progress: number;
    };
    careerGroups: CareerGroup[];
};

export default function Dashboard({ mentor, notifications = [] }: { mentor: Mentor, notifications?: any[] }) {
    const groups = mentor?.careerGroups ?? [];

    return (
        <AppLayout>
            <div className="w-full mx-auto space-y-8 p-4 sm:p-6 lg:p-8">
                
                {/* Header Hero Section */}
                <div className="relative overflow-hidden rounded-3xl bg-white dark:bg-[#0a0d27] border border-gray-100 dark:border-slate-800/60 shadow-xl shadow-indigo-500/5 dark:shadow-indigo-500/10 p-6 sm:p-8 md:p-10">
                    <div className="absolute top-0 right-0 p-12 opacity-10 pointer-events-none">
                        <GraduationCap className="w-64 h-64 text-indigo-600 dark:text-indigo-400 transform rotate-12" />
                    </div>

                    <div className="absolute -left-10 -top-10 w-40 h-40 bg-indigo-500/20 dark:bg-indigo-500/10 rounded-full blur-3xl"></div>
                    <div className="absolute right-20 bottom-0 w-60 h-60 bg-blue-500/20 dark:bg-blue-500/10 rounded-full blur-3xl"></div>

                    <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
                        <div className="space-y-4 max-w-2xl">
                            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 text-sm font-medium border border-indigo-100 dark:border-indigo-500/20">
                                <span>Overview</span>
                            </div>
                            <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">
                                Welcome back,{' '}
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-cyan-400">
                                    {mentor.name}
                                </span>
                            </h1>
                            <p className="text-slate-500 dark:text-slate-400 text-lg">
                                Manage your assigned career branches, track student progress, and grade submissions.
                            </p>
                        </div>
                    </div>
                </div>

                {/* STATS */}
                <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    <Stat 
                        title="Career Branches" 
                        value={mentor.stats.career_groups} 
                        icon={BookOpen} 
                        color="indigo" 
                    />
                    <Stat 
                        title="Total Students" 
                        value={mentor.stats.students} 
                        icon={Users} 
                        color="blue" 
                    />
                    <Stat 
                        title="Active Students" 
                        value={mentor.stats.active} 
                        icon={Activity} 
                        color="emerald" 
                    />
                    <Stat 
                        title="Avg Progress" 
                        value={`${mentor.stats.progress}%`} 
                        icon={TrendingUp} 
                        color="purple" 
                    />
                </section>

                {/* NOTIFICATIONS INBOX */}
                {notifications.length > 0 && (
                    <section className="relative rounded-3xl p-6 lg:p-8 bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-900/10 dark:to-orange-900/10 border border-amber-100 dark:border-amber-500/20 shadow-lg">
                        <div className="flex items-center gap-3 mb-6 relative z-10">
                            <div className="p-3 rounded-xl bg-amber-100 dark:bg-amber-500/20 text-amber-600 dark:text-amber-400">
                                <Activity className="w-6 h-6" />
                            </div>
                            <div>
                                <h2 className="text-xl font-bold text-slate-800 dark:text-white">
                                    Needs Attention
                                </h2>
                                <p className="text-sm text-amber-600/80 dark:text-amber-400/80 font-medium">
                                    You have {notifications.length} new student submissions waiting for your review.
                                </p>
                            </div>
                        </div>

                        <div className="space-y-4 relative z-10">
                            {notifications.map((notif) => (
                                <div key={notif.id} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm p-4 rounded-2xl border border-amber-100/50 dark:border-amber-500/10 shadow-sm hover:shadow-md transition-shadow">
                                    <div>
                                        <p className="text-sm font-semibold text-slate-800 dark:text-white">
                                            {notif.data.message}
                                        </p>
                                        <div className="flex items-center gap-2 mt-1">
                                            <span className="inline-block w-2 h-2 rounded-full bg-amber-500 animate-pulse"></span>
                                            <p className="text-xs text-slate-500 dark:text-slate-400">
                                                Task: {notif.data.submission_title} • {notif.created_at}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <Link
                                            href={`/mentor/student-submissions/${notif.data.student_submission_id}`}
                                            className="flex items-center justify-center px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white text-sm font-medium rounded-xl transition-colors shadow-sm shadow-amber-500/20"
                                        >
                                            Review Now
                                        </Link>
                                        <button 
                                            onClick={() => router.post(`/mentor/notifications/${notif.id}/read`, {}, { preserveScroll: true })}
                                            className="flex items-center justify-center p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700/50 rounded-xl transition-colors"
                                            title="Mark as Read"
                                        >
                                            <ArrowRight className="w-5 h-5" />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>
                )}

                {/* CAREER GROUP LIST */}
                <section className="relative rounded-3xl p-6 lg:p-8 bg-white dark:bg-gradient-to-br dark:from-[#0b0f2a] dark:to-[#050619] border border-gray-100 dark:border-slate-800 shadow-lg">
                    <div className="absolute top-0 right-0 w-40 h-40 bg-indigo-500/5 dark:bg-indigo-500/10 rounded-bl-[100px] pointer-events-none"></div>
                    
                    <div className="flex items-center gap-3 mb-8 relative z-10">
                        <div className="p-3 rounded-xl bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
                            <Layers className="w-6 h-6" />
                        </div>
                        <h2 className="text-xl font-bold text-slate-800 dark:text-white">
                            My Career Branches
                        </h2>
                    </div>

                    {groups.length === 0 ? (
                        <div className="rounded-3xl border border-dashed border-gray-200 dark:border-slate-700 bg-gray-50/50 dark:bg-slate-800/20 p-12 text-center">
                            <BookOpen className="w-16 h-16 text-slate-300 dark:text-slate-600 mx-auto mb-4" />
                            <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-2">No Assignments Yet</h3>
                            <p className="text-slate-500 dark:text-slate-400 max-w-md mx-auto">
                                You have not been assigned to any career branch yet. Please contact the administrator.
                            </p>
                        </div>
                    ) : (
                        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3 relative z-10">
                            {groups.map((group) => (
                                <div
                                    key={group.id}
                                    className="group flex flex-col justify-between rounded-2xl border border-gray-100 dark:border-slate-700/60 bg-gray-50/50 dark:bg-slate-800/40 hover:bg-white dark:hover:bg-slate-800/80 p-6 shadow-sm transition-all duration-300 hover:shadow-xl hover:shadow-indigo-500/5 hover:-translate-y-1 overflow-hidden relative"
                                >
                                    <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-indigo-500/10 to-transparent rounded-bl-full pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                    
                                    <div>
                                        <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
                                            {group.name}
                                        </h3>

                                        <p className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-900 text-xs font-medium text-slate-600 dark:text-slate-400 border border-gray-200 dark:border-slate-700">
                                            <BookOpen className="w-3.5 h-3.5" />
                                            {group.paths_count} Learning Paths
                                        </p>
                                    </div>

                                    <div className="mt-8 flex flex-col gap-3">
                                        <Link
                                            href={`/mentor/career-groups/${group.id}/paths`}
                                            className="flex items-center justify-between rounded-xl border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-4 py-3 text-sm font-semibold text-slate-700 dark:text-slate-300 hover:border-indigo-300 dark:hover:border-indigo-500/50 hover:text-indigo-600 dark:hover:text-indigo-400 transition-all group/link"
                                        >
                                            <span className="flex items-center gap-2">
                                                <Layers className="w-4 h-4" />
                                                Manage Paths
                                            </span>
                                            <ArrowRight className="w-4 h-4 opacity-50 group-hover/link:opacity-100 group-hover/link:translate-x-1 transition-all" />
                                        </Link>

                                        <Link
                                            href={`/mentor/career-groups/${group.id}/submissions`}
                                            className="flex items-center justify-between rounded-xl bg-indigo-600 px-4 py-3 text-sm font-semibold text-white shadow-sm shadow-indigo-500/20 hover:bg-indigo-700 hover:shadow-md hover:shadow-indigo-500/30 transition-all active:scale-95 group/link"
                                        >
                                            <span className="flex items-center gap-2">
                                                <ClipboardList className="w-4 h-4" />
                                                Submissions
                                            </span>
                                            <ArrowRight className="w-4 h-4 opacity-70 group-hover/link:opacity-100 group-hover/link:translate-x-1 transition-all" />
                                        </Link>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </section>

            </div>
        </AppLayout>
    );
}

/* ---------- STAT COMPONENT ---------- */
function Stat({
    title,
    value,
    icon: Icon,
    color = "indigo"
}: {
    title: string;
    value: string | number;
    icon: any;
    color?: "indigo" | "blue" | "emerald" | "purple";
}) {
    const colorStyles = {
        indigo: "text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-500/10 border-indigo-100 dark:border-indigo-500/20 shadow-indigo-500/5",
        blue: "text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-500/10 border-blue-100 dark:border-blue-500/20 shadow-blue-500/5",
        emerald: "text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-500/10 border-emerald-100 dark:border-emerald-500/20 shadow-emerald-500/5",
        purple: "text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-500/10 border-purple-100 dark:border-purple-500/20 shadow-purple-500/5",
    };

    const iconStyle = colorStyles[color];

    return (
        <div className="relative overflow-hidden rounded-3xl border border-gray-100 dark:border-slate-800/80 bg-white dark:bg-slate-900/50 p-6 shadow-lg shadow-slate-200/20 dark:shadow-none hover:-translate-y-1 transition-transform duration-300">
            <div className="relative z-10 flex items-center justify-between">
                <div className="space-y-1">
                    <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
                        {title}
                    </p>
                    <p className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                        {value}
                    </p>
                </div>
                <div className={`flex h-12 w-12 items-center justify-center rounded-2xl border ${iconStyle} shadow-sm`}>
                    <Icon className="w-6 h-6" />
                </div>
            </div>
            {/* Background decorative glow */}
            <div className={`absolute -right-6 -bottom-6 w-24 h-24 rounded-full blur-2xl opacity-20 ${iconStyle.split(' ')[1]}`}></div>
        </div>
    );
}