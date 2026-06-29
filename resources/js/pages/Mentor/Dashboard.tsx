import AppLayout from '@/layouts/app-layout';
import { Link, router } from '@inertiajs/react';
import { ArrowRight, Clock, FileText } from 'lucide-react';

type CareerGroup = {
    id: string;
    name: string;
    paths_count: number;
};

type Mentor = {
    name: string;
    username: string;
    stats: {
        career_groups: number;
        students: number;
        active: number;
        pending_reviews: number;
    };
    careerGroups: CareerGroup[];
};

export default function Dashboard({ mentor, notifications = [] }: { mentor: Mentor; notifications?: any[] }) {
    const groups = mentor?.careerGroups ?? [];

    return (
        <AppLayout>
            <div className="w-full mx-auto space-y-8 p-4 sm:p-6 lg:p-8" style={{ fontFamily: "'Outfit', sans-serif" }}>

                {/* Header Hero Section */}
                <div className="relative overflow-hidden rounded-xl border border-slate-200 p-6 sm:p-8 md:p-10 dark:border-slate-800">
                    <div className="absolute inset-0 bg-white dark:bg-gradient-to-b dark:from-[#0e0e1a] dark:to-[#090910]" />
                    <div className="absolute top-0 right-8 left-8 h-px bg-gradient-to-r from-transparent via-slate-300 to-transparent dark:via-slate-700" />

                    <div className="relative z-10 space-y-4 max-w-2xl">
                        <span className="inline-block text-[0.6rem] font-semibold tracking-[0.2em] text-slate-500 uppercase dark:text-slate-500">
                            Mentor Overview
                        </span>

                        <h1 className="text-2xl md:text-[28px] font-semibold tracking-tight text-slate-800 dark:text-white leading-snug">
                            Welcome back, {mentor.username || mentor.name}
                        </h1>

                        <p className="text-slate-500 dark:text-slate-400/60 text-sm md:text-[15px] leading-relaxed">
                            Manage your assigned career branches, track student progress, and grade submissions.
                        </p>
                    </div>
                </div>

                {/* STATS */}
                <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    <Stat title="Career Branches" value={mentor.stats.career_groups} />
                    <Stat title="Total Students" value={mentor.stats.students} />
                    <Stat title="Active Students" value={mentor.stats.active} />
                    <Stat
                        title="Pending Reviews"
                        value={mentor.stats.pending_reviews}
                        highlight={mentor.stats.pending_reviews > 0}
                    />
                </section>

                {/* NOTIFICATIONS / REVIEW CENTER */}
                {notifications.length > 0 && (
                    <section className="relative overflow-hidden rounded-xl border border-slate-200 p-6 lg:p-8 dark:border-slate-800">
                        <div className="absolute inset-0 bg-white dark:bg-gradient-to-b dark:from-[#0e0e1a] dark:to-[#090910]" />
                        <div className="absolute top-0 right-8 left-8 h-px bg-gradient-to-r from-transparent via-slate-300 to-transparent dark:via-slate-700" />

                        <div className="relative z-10">
                            <div className="flex items-center justify-between mb-6">
                                <div>
                                    <div className="flex items-center gap-2.5">
                                        <h2 className="text-base font-semibold text-slate-800 dark:text-white">
                                            Submission Review Center
                                        </h2>
                                        <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
                                            {notifications.length} Pending
                                        </span>
                                    </div>
                                    <p className="text-sm text-slate-500 dark:text-slate-400/60 mt-1">
                                        Student assignments waiting for your grading and feedback.
                                    </p>
                                </div>
                            </div>

                            <div className="space-y-3">
                                {notifications.map((notif) => {
                                    const studentName = notif.data.student_name || 'Student';
                                    const studentInitials = studentName
                                        .split(' ')
                                        .map((n: string) => n[0])
                                        .join('')
                                        .substring(0, 2)
                                        .toUpperCase();

                                    return (
                                        <div
                                            key={notif.id}
                                            className="relative overflow-hidden flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-xl border border-slate-200/80 bg-slate-50/40 p-4 transition-all hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900/30 dark:hover:bg-slate-900/60"
                                        >
                                            <div className="relative z-10 flex items-start sm:items-center gap-3.5">
                                                <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-indigo-600 to-violet-500 flex items-center justify-center text-white font-semibold text-xs shrink-0 shadow-sm">
                                                    {studentInitials}
                                                </div>
                                                <div>
                                                    <div className="flex items-center gap-2 flex-wrap">
                                                        <span className="text-sm font-semibold text-slate-800 dark:text-white">
                                                            {studentName}
                                                        </span>
                                                        {notif.data.career_group_name && (
                                                            <span className="text-[11px] font-medium px-2 py-0.5 rounded bg-slate-200/60 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                                                                {notif.data.career_group_name}
                                                            </span>
                                                        )}
                                                    </div>
                                                    <p className="text-xs text-slate-500 dark:text-slate-400/70 mt-1 flex items-center gap-1.5 flex-wrap">
                                                        <FileText className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                                                        <span className="font-medium text-slate-700 dark:text-slate-300">
                                                            {notif.data.submission_title || notif.data.message}
                                                        </span>
                                                        <span className="text-slate-300 dark:text-slate-700 hidden sm:inline">•</span>
                                                        <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                                                        <span>{notif.created_at}</span>
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="relative z-10 flex items-center shrink-0 self-end sm:self-center">
                                                <button
                                                    onClick={() => router.post(`/mentor/notifications/${notif.id}/read`)}
                                                    className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-lg shadow-sm transition-colors cursor-pointer"
                                                >
                                                    <span>Review Submission</span>
                                                    <ArrowRight className="w-3.5 h-3.5" />
                                                </button>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </section>
                )}

                {/* CAREER GROUP LIST */}
                <section className="relative overflow-hidden rounded-xl border border-slate-200 p-6 lg:p-8 dark:border-slate-800">
                    <div className="absolute inset-0 bg-white dark:bg-gradient-to-b dark:from-[#0e0e1a] dark:to-[#090910]" />
                    <div className="absolute top-0 right-8 left-8 h-px bg-gradient-to-r from-transparent via-slate-300 to-transparent dark:via-slate-700" />

                    <div className="relative z-10">
                        <div className="mb-8">
                            <h2 className="text-base font-semibold text-slate-800 dark:text-white">
                                My Career Branches
                            </h2>
                        </div>

                        {groups.length === 0 ? (
                            <div className="relative overflow-hidden rounded-lg border border-dashed border-slate-200 p-12 text-center dark:border-slate-800">
                                <div className="absolute inset-0 bg-slate-50/50 dark:bg-slate-900/20" />
                                <div className="relative z-10">
                                    <h3 className="text-base font-semibold text-slate-800 dark:text-white mb-2">No Assignments Yet</h3>
                                    <p className="text-slate-500 dark:text-slate-400/60 max-w-md mx-auto text-sm">
                                        You have not been assigned to any career branch yet. Please contact the administrator.
                                    </p>
                                </div>
                            </div>
                        ) : (
                            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                                {groups.map((group) => (
                                    <div
                                        key={group.id}
                                        className="relative overflow-hidden flex flex-col justify-between rounded-lg border border-slate-200 bg-slate-50/40 p-6 transition-colors hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900/30 dark:hover:bg-slate-900/50"
                                    >
                                        <div className="relative z-10">
                                            <h3 className="text-lg font-semibold text-slate-800 dark:text-white mb-2">
                                                {group.name}
                                            </h3>

                                            <p className="inline-flex items-center px-3 py-1 rounded-full bg-white dark:bg-slate-900 text-xs font-medium text-slate-600 dark:text-slate-400/60 border border-slate-200 dark:border-slate-800">
                                                {group.paths_count} Learning Paths
                                            </p>
                                        </div>

                                        <div className="relative z-10 mt-8 flex flex-col gap-2">
                                            <Link
                                                href={`/mentor/career-groups/${group.id}/paths`}
                                                className="flex items-center justify-between rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-600 transition-colors hover:border-slate-300 hover:text-slate-800 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-400 dark:hover:border-slate-700 dark:hover:text-slate-200"
                                            >
                                                <span>Manage Paths</span>
                                                <ArrowRight className="w-4 h-4" />
                                            </Link>

                                            <Link
                                                href={`/mentor/career-groups/${group.id}/submissions`}
                                                className="flex items-center justify-between rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-indigo-600 transition-colors hover:border-indigo-300 hover:bg-indigo-50/50 dark:border-slate-800 dark:bg-slate-900 dark:text-indigo-400 dark:hover:border-indigo-500/40 dark:hover:bg-indigo-500/5"
                                            >
                                                <span>Submissions</span>
                                                <ArrowRight className="w-4 h-4" />
                                            </Link>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </section>

            </div>
        </AppLayout>
    );
}

/* ---------- STAT COMPONENT ---------- */
function Stat({
    title,
    value,
    highlight = false,
}: {
    title: string;
    value: string | number;
    highlight?: boolean;
}) {
    return (
        <div className={`relative overflow-hidden rounded-xl border p-6 transition-colors ${
            highlight
                ? 'border-amber-500/40 dark:border-amber-500/30 bg-amber-500/[0.02]'
                : 'border-slate-200 dark:border-slate-800'
        }`}>
            <div className="absolute inset-0 bg-white dark:bg-gradient-to-b dark:from-[#0e0e1a] dark:to-[#090910]" />
            <div className="absolute top-0 right-8 left-8 h-px bg-gradient-to-r from-transparent via-slate-300 to-transparent dark:via-slate-700" />

            <div className="relative z-10">
                <p className="text-sm font-medium text-slate-500 dark:text-slate-400/60">
                    {title}
                </p>
                <p className={`text-2xl font-semibold tracking-tight mt-1 ${
                    highlight ? 'text-amber-600 dark:text-amber-400' : 'text-slate-800 dark:text-white'
                }`}>
                    {value}
                </p>
            </div>
        </div>
    );
}