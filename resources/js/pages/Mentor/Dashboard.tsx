import AppLayout from '@/layouts/app-layout';
import { Link, router, usePoll } from '@inertiajs/react';
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

export default function Dashboard({
    mentor,
    notifications = [],
}: {
    mentor: Mentor;
    notifications?: any[];
}) {
    const groups = mentor?.careerGroups ?? [];

    // Poll for notifications and stats every 30 seconds
    usePoll(30000, {
        only: ['notifications', 'mentor'],
    });

    return (
        <AppLayout>
            <div
                className="mx-auto w-full space-y-8 p-4 sm:p-6 lg:p-8"
                style={{ fontFamily: "'Outfit', sans-serif" }}
            >
                {/* Header Hero Section */}
                <div className="relative overflow-hidden rounded-xl border border-slate-200/80 bg-[#f5f6ff] p-6 shadow-sm sm:p-8 md:p-10 dark:border-slate-800 dark:bg-[#0d0f17]">
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
                        <div className="max-w-2xl space-y-3">
                            <span className="inline-block text-[0.6rem] font-semibold tracking-[0.2em] text-slate-500 uppercase dark:text-slate-500">
                                Mentor Overview
                            </span>
                            <h1 className="text-2xl leading-snug font-semibold tracking-tight text-slate-800 md:text-[28px] dark:text-white">
                                Welcome back,{' '}
                                <span className="font-semibold text-indigo-500 dark:text-indigo-400">
                                    {mentor.name || mentor.username}
                                </span>
                            </h1>
                            <p className="text-sm leading-relaxed text-slate-500 md:text-[15px] dark:text-slate-400/60">
                                Manage your assigned career branches, track
                                student progress, and grade submissions.
                            </p>
                        </div>
                    </div>
                </div>

                {/* STATS */}
                <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    <Stat
                        title="Career Branches"
                        value={mentor.stats.career_groups}
                    />
                    <Stat
                        title="Total Students"
                        value={mentor.stats.students}
                    />
                    <Stat title="Active Students" value={mentor.stats.active} />
                    <Stat
                        title="Pending Reviews"
                        value={mentor.stats.pending_reviews}
                        highlight={mentor.stats.pending_reviews > 0}
                    />
                </section>

                {/* NOTIFICATIONS / REVIEW CENTER */}
                {notifications.length > 0 && (
                    <section className="relative overflow-hidden rounded-xl border border-slate-200/80 p-6 shadow-sm shadow-slate-100/50 lg:p-8 dark:border-slate-800">
                        <div className="absolute inset-0 bg-white dark:bg-gradient-to-b dark:from-[#0e0e1a] dark:to-[#090910]" />
                        <div className="absolute top-0 right-8 left-8 h-px bg-gradient-to-r from-transparent via-slate-300 to-transparent dark:via-slate-700" />

                        <div className="relative z-10">
                            <div className="mb-6 flex items-center justify-between">
                                <div>
                                    <div className="flex items-center gap-2.5">
                                        <h2 className="text-base font-semibold text-slate-800 dark:text-white">
                                            Submission Review Center
                                        </h2>
                                        <span className="rounded-full border border-amber-500/20 bg-amber-500/10 px-2.5 py-0.5 text-xs font-semibold text-amber-600 dark:text-amber-400">
                                            {notifications.length} Pending
                                        </span>
                                    </div>
                                    <p className="mt-1 text-sm text-slate-500 dark:text-slate-400/60">
                                        Student assignments waiting for your
                                        grading and feedback.
                                    </p>
                                </div>
                            </div>

                            <div className="space-y-3">
                                {notifications.map((notif) => {
                                    const studentName =
                                        notif.data.student_name || 'Student';
                                    const studentInitials = studentName
                                        .split(' ')
                                        .map((n: string) => n[0])
                                        .join('')
                                        .substring(0, 2)
                                        .toUpperCase();

                                    return (
                                        <div
                                            key={notif.id}
                                            className="relative flex flex-col justify-between gap-4 overflow-hidden rounded-xl border border-slate-200/70 bg-slate-50/80 p-4 shadow-xs transition-all hover:bg-slate-100/60 sm:flex-row sm:items-center dark:border-slate-800 dark:bg-slate-900/30 dark:hover:bg-slate-900/60"
                                        >
                                            <div className="relative z-10 flex items-start gap-3.5 sm:items-center">
                                                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-tr from-indigo-600 to-violet-500 text-xs font-semibold text-white shadow-sm">
                                                    {studentInitials}
                                                </div>
                                                <div>
                                                    <div className="flex flex-wrap items-center gap-2">
                                                        <span className="text-sm font-semibold text-slate-800 dark:text-white">
                                                            {studentName}
                                                        </span>
                                                        {notif.data
                                                            .career_group_name && (
                                                            <span className="rounded border border-slate-200/50 bg-slate-100 px-2 py-0.5 text-[11px] font-medium text-slate-600 dark:border-slate-800 dark:bg-slate-800 dark:text-slate-400">
                                                                {
                                                                    notif.data
                                                                        .career_group_name
                                                                }
                                                            </span>
                                                        )}
                                                    </div>
                                                    <p className="mt-1 flex flex-wrap items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400/70">
                                                        <FileText className="h-3.5 w-3.5 shrink-0 text-slate-400" />
                                                        <span className="font-medium text-slate-700 dark:text-slate-300">
                                                            {notif.data
                                                                .submission_title ||
                                                                notif.data
                                                                    .message}
                                                        </span>
                                                        <span className="hidden text-slate-300 sm:inline dark:text-slate-700">
                                                            •
                                                        </span>
                                                        <Clock className="h-3.5 w-3.5 shrink-0 text-slate-400" />
                                                        <span>
                                                            {notif.created_at}
                                                        </span>
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="relative z-10 flex shrink-0 items-center self-end sm:self-center">
                                                <button
                                                    onClick={() =>
                                                        router.post(
                                                            `/mentor/notifications/${notif.id}/read`,
                                                        )
                                                    }
                                                    className="flex cursor-pointer items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-xs font-semibold text-white shadow-sm transition-colors hover:bg-indigo-700"
                                                >
                                                    <span>
                                                        Review Submission
                                                    </span>
                                                    <ArrowRight className="h-3.5 w-3.5" />
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
                <section className="relative overflow-hidden rounded-xl border border-slate-200/80 p-6 shadow-sm shadow-slate-100/50 lg:p-8 dark:border-slate-800">
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
                                    <h3 className="mb-2 text-base font-semibold text-slate-800 dark:text-white">
                                        No Assignments Yet
                                    </h3>
                                    <p className="mx-auto max-w-md text-sm text-slate-500 dark:text-slate-400/60">
                                        You have not been assigned to any career
                                        branch yet. Please contact the
                                        administrator.
                                    </p>
                                </div>
                            </div>
                        ) : (
                            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                                {groups.map((group) => (
                                    <div
                                        key={group.id}
                                        className="relative flex flex-col justify-between overflow-hidden rounded-lg border border-slate-200 bg-slate-50/80 p-6 shadow-xs transition-colors hover:bg-slate-100/60 dark:border-slate-800 dark:bg-slate-900/30 dark:hover:bg-slate-900/50"
                                    >
                                        <div className="relative z-10">
                                            <h3 className="mb-2 text-lg font-semibold text-slate-800 dark:text-white">
                                                {group.name}
                                            </h3>

                                            <p className="inline-flex items-center rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-medium text-slate-600 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-400/60">
                                                {group.paths_count} Learning
                                                Paths
                                            </p>
                                        </div>

                                        <div className="relative z-10 mt-8 flex flex-col gap-2">
                                            <Link
                                                href={`/mentor/career-groups/${group.id}/paths`}
                                                className="flex items-center justify-between rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-600 transition-colors hover:border-slate-300 hover:text-slate-800 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-400 dark:hover:border-slate-700 dark:hover:text-slate-200"
                                            >
                                                <span>Manage Paths</span>
                                                <ArrowRight className="h-4 w-4" />
                                            </Link>

                                            <Link
                                                href={`/mentor/career-groups/${group.id}/submissions`}
                                                className="flex items-center justify-between rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-indigo-600 transition-colors hover:border-indigo-300 hover:bg-indigo-50/50 dark:border-slate-800 dark:bg-slate-900 dark:text-indigo-400 dark:hover:border-indigo-500/40 dark:hover:bg-indigo-500/5"
                                            >
                                                <span>Submissions</span>
                                                <ArrowRight className="h-4 w-4" />
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
        <div
            className={`relative overflow-hidden rounded-xl border p-6 shadow-xs shadow-slate-100/80 transition-colors ${
                highlight
                    ? 'border-amber-500/45 bg-amber-500/[0.03] dark:border-amber-500/35'
                    : 'border-slate-200/80 dark:border-slate-800'
            }`}
        >
            <div className="absolute inset-0 bg-white dark:bg-gradient-to-b dark:from-[#0e0e1a] dark:to-[#090910]" />
            <div className="absolute top-0 right-8 left-8 h-px bg-gradient-to-r from-transparent via-slate-300 to-transparent dark:via-slate-700" />

            <div className="relative z-10">
                <p className="text-sm font-medium text-slate-500 dark:text-slate-400/60">
                    {title}
                </p>
                <p
                    className={`mt-1 text-2xl font-semibold tracking-tight ${
                        highlight
                            ? 'text-amber-600 dark:text-amber-400'
                            : 'text-slate-800 dark:text-white'
                    }`}
                >
                    {value}
                </p>
            </div>
        </div>
    );
}
