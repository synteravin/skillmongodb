import AppLayout from '@/layouts/app-layout';
import { Link, router } from '@inertiajs/react';
import {
    Plus,
    FileText,
    Calendar,
    CheckCircle2,
    Clock,
    Eye,
    Edit,
    Send,
    Layers,
    ArrowLeft,
} from 'lucide-react';

type Submission = {
    id: string;
    title: string;
    description: string;
    submission_type: string;
    deadline: string;
    status: 'draft' | 'published';
};

type Group = {
    id: string;
    name: string;
};

interface Props {
    group: Group;
    submissions: Submission[];
}

export default function SubmissionIndex({ group, submissions }: Props) {
    const publishSubmission = (submissionId: string) => {
        router.post(`/mentor/submissions/${submissionId}/publish`);
    };

    return (
        <AppLayout>
            <div
                className="mx-auto w-full space-y-6 p-4 sm:p-6 lg:p-8"
                style={{ fontFamily: "'Outfit', sans-serif" }}
            >
                {/* Hero Header Card */}
                <div className="relative overflow-hidden rounded-xl border border-slate-200/80 bg-white p-6 shadow-sm shadow-slate-100/50 sm:p-8 dark:border-slate-800 dark:bg-gradient-to-b dark:from-[#0e0e1a] dark:to-[#090910]">
                    {/* Decorative background icon */}
                    <div className="pointer-events-none absolute top-0 right-0 p-10 opacity-5 select-none dark:opacity-10"></div>
                    <div className="relative z-10 flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
                        <div className="max-w-2xl space-y-3">
                            {/* Breadcrumb row */}
                            <div className="flex flex-wrap items-center gap-3">
                                <Link
                                    href="/mentor/dashboard"
                                    className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 shadow-sm transition-all hover:border-indigo-300 hover:text-indigo-600 dark:border-slate-700 dark:bg-slate-800/60 dark:text-slate-300 dark:hover:border-indigo-500/50 dark:hover:text-indigo-400"
                                >
                                    <ArrowLeft className="h-5 w-5" />
                                </Link>
                                <span className="inline-flex items-center gap-1.5 rounded-full border border-indigo-100 bg-indigo-50 px-3 py-1 text-xs font-semibold text-indigo-600 dark:border-indigo-500/20 dark:bg-indigo-500/10 dark:text-indigo-400">
                                    Submission Management
                                </span>
                            </div>

                            <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl dark:text-white">
                                {group.name}
                            </h1>
                            <p className="text-base leading-relaxed text-slate-500 dark:text-slate-400">
                                Manage assignments, track deadlines, and review
                                student progress for this career branch.
                            </p>
                        </div>

                        <div className="shrink-0">
                            <Link
                                href={`/mentor/career-groups/${group.id}/submissions/create`}
                                className="group font-outfit inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-2.5 font-semibold text-slate-700 shadow-sm transition-all hover:border-slate-400 hover:text-slate-900 active:scale-95 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:border-slate-500 dark:hover:text-white"
                            >
                                <Plus className="h-4 w-4 transition-transform duration-300 group-hover:rotate-90" />
                                Create Submission
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Submissions List Card */}
                <div className="overflow-hidden rounded-xl border border-slate-200/80 bg-white shadow-sm shadow-slate-100/50 dark:border-slate-800 dark:bg-gradient-to-b dark:from-[#0e0e1a] dark:to-[#090910]">
                    {/* Card header */}
                    <div className="flex items-center gap-3 border-b border-slate-100 px-6 py-5 dark:border-slate-800">
                        <div className="rounded-xl bg-indigo-50 p-2.5 text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-400">
                            <Layers className="h-5 w-5" />
                        </div>
                        <div>
                            <h2 className="text-base font-bold text-slate-800 dark:text-white">
                                All Submissions
                            </h2>
                            <p className="text-xs text-slate-500 dark:text-slate-400">
                                {submissions.length}{' '}
                                {submissions.length === 1
                                    ? 'assignment'
                                    : 'assignments'}{' '}
                                total
                            </p>
                        </div>
                    </div>

                    <div className="p-6">
                        {submissions.length > 0 ? (
                            <div className="grid grid-cols-1 gap-4">
                                {submissions.map((submission) => (
                                    <div
                                        key={submission.id}
                                        className="group relative flex flex-col justify-between gap-4 rounded-xl border border-slate-200/60 bg-slate-50/85 p-5 shadow-xs transition-all duration-200 hover:border-slate-300 hover:bg-white hover:shadow-sm md:flex-row md:items-center dark:border-slate-800 dark:bg-slate-800/30 dark:hover:border-slate-700 dark:hover:bg-slate-800/60"
                                    >
                                        {/* Left accent line on hover */}
                                        <div className="absolute top-0 left-0 h-full w-0.5 rounded-l-xl bg-indigo-500 opacity-0 transition-opacity group-hover:opacity-100" />

                                        {/* Content */}
                                        <div className="min-w-0 flex-1 space-y-2 pl-1">
                                            <div className="flex flex-wrap items-center gap-3">
                                                <h3 className="truncate text-base font-bold text-slate-900 dark:text-white">
                                                    {submission.title}
                                                </h3>
                                                {/* Badge — visible on mobile */}
                                                <span
                                                    className={`inline-flex shrink-0 items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold md:hidden ${
                                                        submission.status ===
                                                        'published'
                                                            ? 'border border-emerald-200 bg-emerald-50 text-emerald-600 dark:border-emerald-500/20 dark:bg-emerald-500/10 dark:text-emerald-400'
                                                            : 'border border-amber-200 bg-amber-50 text-amber-600 dark:border-amber-500/20 dark:bg-amber-500/10 dark:text-amber-400'
                                                    }`}
                                                >
                                                    {submission.status ===
                                                    'published' ? (
                                                        <CheckCircle2 className="h-3 w-3" />
                                                    ) : (
                                                        <Clock className="h-3 w-3" />
                                                    )}
                                                    <span className="capitalize">
                                                        {submission.status}
                                                    </span>
                                                </span>
                                            </div>

                                            <p className="line-clamp-2 text-sm text-slate-500 dark:text-slate-400">
                                                {submission.description}
                                            </p>

                                            <div className="flex flex-wrap items-center gap-2 pt-1">
                                                <span className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-2.5 py-1 text-xs text-slate-500 dark:border-slate-700 dark:bg-slate-900/60 dark:text-slate-400">
                                                    <FileText className="h-3.5 w-3.5" />
                                                    <span className="capitalize">
                                                        {
                                                            submission.submission_type
                                                        }{' '}
                                                        Format
                                                    </span>
                                                </span>
                                                <span className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-2.5 py-1 text-xs text-slate-500 dark:border-slate-700 dark:bg-slate-900/60 dark:text-slate-400">
                                                    <Calendar className="h-3.5 w-3.5" />
                                                    {submission.deadline
                                                        ? new Date(
                                                              submission.deadline,
                                                          ).toLocaleString()
                                                        : 'No deadline'}
                                                </span>
                                            </div>
                                        </div>

                                        {/* Right actions */}
                                        <div className="flex shrink-0 flex-col items-stretch gap-3 border-t border-slate-100 pt-3 sm:flex-row sm:items-center md:border-t-0 md:pt-0 dark:border-slate-800">
                                            {/* Status badge — desktop only */}
                                            <span
                                                className={`hidden items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold md:inline-flex ${
                                                    submission.status ===
                                                    'published'
                                                        ? 'border border-emerald-200 bg-emerald-50 text-emerald-600 dark:border-emerald-500/20 dark:bg-emerald-500/10 dark:text-emerald-400'
                                                        : 'border border-amber-200 bg-amber-50 text-amber-600 dark:border-amber-500/20 dark:bg-amber-500/10 dark:text-amber-400'
                                                }`}
                                            >
                                                {submission.status ===
                                                'published' ? (
                                                    <CheckCircle2 className="h-3.5 w-3.5" />
                                                ) : (
                                                    <Clock className="h-3.5 w-3.5" />
                                                )}
                                                <span className="capitalize">
                                                    {submission.status}
                                                </span>
                                            </span>

                                            {/* Action buttons */}
                                            <div className="flex items-center gap-2">
                                                <Link
                                                    href={`/mentor/submissions/${submission.id}`}
                                                    className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-600 shadow-sm transition-colors hover:border-indigo-300 hover:text-indigo-600 sm:flex-none dark:border-slate-700 dark:bg-slate-800/60 dark:text-slate-300 dark:hover:border-indigo-500/50 dark:hover:text-indigo-400"
                                                    title="View Details"
                                                >
                                                    <Eye className="h-4 w-4" />
                                                    <span className="sm:hidden lg:inline">
                                                        View
                                                    </span>
                                                </Link>

                                                <Link
                                                    href={`/mentor/submissions/${submission.id}/edit`}
                                                    className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-600 shadow-sm transition-colors hover:border-indigo-300 hover:text-indigo-600 sm:flex-none dark:border-slate-700 dark:bg-slate-800/60 dark:text-slate-300 dark:hover:border-indigo-500/50 dark:hover:text-indigo-400"
                                                    title="Edit"
                                                >
                                                    <Edit className="h-4 w-4" />
                                                    <span className="sm:hidden lg:inline">
                                                        Edit
                                                    </span>
                                                </Link>

                                                {submission.status ===
                                                    'draft' && (
                                                    <button
                                                        onClick={() =>
                                                            publishSubmission(
                                                                submission.id,
                                                            )
                                                        }
                                                        className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-emerald-600 px-3 py-2 text-sm font-medium text-white shadow-sm shadow-emerald-500/20 transition-all hover:bg-emerald-500 hover:shadow-emerald-500/30 active:scale-95 sm:flex-none"
                                                        title="Publish"
                                                    >
                                                        <Send className="h-4 w-4" />
                                                        <span className="sm:hidden lg:inline">
                                                            Publish
                                                        </span>
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="rounded-xl border-2 border-dashed border-slate-200 bg-slate-50/50 px-4 py-16 text-center dark:border-slate-700 dark:bg-slate-800/20">
                                <Layers className="mx-auto mb-4 h-14 w-14 text-slate-300 dark:text-slate-600" />
                                <h3 className="mb-2 text-base font-bold text-slate-800 dark:text-white">
                                    No Submissions Found
                                </h3>
                                <p className="mx-auto mb-6 max-w-md text-sm text-slate-500 dark:text-slate-400">
                                    There are currently no submissions created
                                    for this career group. Click the button
                                    below to create your first assignment.
                                </p>
                                <Link
                                    href={`/mentor/career-groups/${group.id}/submissions/create`}
                                    className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-2.5 font-semibold text-white shadow-sm shadow-indigo-500/20 transition-all hover:bg-indigo-700 active:scale-95"
                                >
                                    <Plus className="h-4 w-4" />
                                    Create Submission
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
