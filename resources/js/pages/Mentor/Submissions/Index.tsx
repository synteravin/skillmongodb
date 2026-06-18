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
                className="w-full mx-auto space-y-6 p-4 sm:p-6 lg:p-8"
                style={{ fontFamily: "'Outfit', sans-serif" }}
            >
                {/* Hero Header Card */}
                <div className="relative overflow-hidden rounded-xl bg-white dark:bg-gradient-to-b dark:from-[#0e0e1a] dark:to-[#090910] border border-slate-200 dark:border-slate-800 shadow-sm p-6 sm:p-8">
                    {/* Decorative background icon */}
                    <div className="absolute top-0 right-0 p-10 opacity-5 dark:opacity-10 pointer-events-none select-none">
                    </div>
                    <div className="relative z-10 flex flex-col sm:flex-row sm:items-end justify-between gap-6">
                        <div className="space-y-3 max-w-2xl">
                            {/* Breadcrumb row */}
                            <div className="flex flex-wrap items-center gap-3">
                                <Link
                                    href="/mentor/dashboard"
                                    className="inline-flex items-center justify-center w-10 h-10 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/60 text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 hover:border-indigo-300 dark:hover:border-indigo-500/50 transition-all shadow-sm"
                                >
                                    <ArrowLeft className="w-5 h-5" />
                                </Link>
                                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 text-xs font-semibold border border-indigo-100 dark:border-indigo-500/20">
                                    Submission Management
                                </span>
                            </div>

                            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">
                                {group.name}
                            </h1>
                            <p className="text-slate-500 dark:text-slate-400 text-base leading-relaxed">
                                Manage assignments, track deadlines, and review student progress for this career branch.
                            </p>
                        </div>

                       <div className="shrink-0">
                            <Link
                                href={`/mentor/career-groups/${group.id}/submissions/create`}
                                className="group inline-flex items-center gap-2 px-5 py-2.5 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white rounded-xl font-semibold border border-slate-200 dark:border-slate-700 hover:border-slate-400 dark:hover:border-slate-500 shadow-sm transition-all active:scale-95 font-outfit"
                            >
                                <Plus className="w-4 h-4 group-hover:rotate-90 transition-transform duration-300" />
                                Create Submission
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Submissions List Card */}
                <div className="rounded-xl bg-white dark:bg-gradient-to-b dark:from-[#0e0e1a] dark:to-[#090910] border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
                    {/* Card header */}
                    <div className="flex items-center gap-3 px-6 py-5 border-b border-slate-100 dark:border-slate-800">
                        <div className="p-2.5 rounded-xl bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
                            <Layers className="w-5 h-5" />
                        </div>
                        <div>
                            <h2 className="text-base font-bold text-slate-800 dark:text-white">All Submissions</h2>
                            <p className="text-xs text-slate-500 dark:text-slate-400">
                                {submissions.length} {submissions.length === 1 ? 'assignment' : 'assignments'} total
                            </p>
                        </div>
                    </div>

                    <div className="p-6">
                        {submissions.length > 0 ? (
                            <div className="grid grid-cols-1 gap-4">
                                {submissions.map((submission) => (
                                    <div
                                        key={submission.id}
                                        className="group relative flex flex-col md:flex-row md:items-center justify-between gap-4 p-5 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/30 hover:bg-white dark:hover:bg-slate-800/60 hover:border-slate-200 dark:hover:border-slate-700 hover:shadow-sm transition-all duration-200"
                                    >
                                        {/* Left accent line on hover */}
                                        <div className="absolute top-0 left-0 w-0.5 h-full bg-indigo-500 rounded-l-xl opacity-0 group-hover:opacity-100 transition-opacity" />

                                        {/* Content */}
                                        <div className="flex-1 space-y-2 min-w-0 pl-1">
                                            <div className="flex flex-wrap items-center gap-3">
                                                <h3 className="text-base font-bold text-slate-900 dark:text-white truncate">
                                                    {submission.title}
                                                </h3>
                                                {/* Badge — visible on mobile */}
                                                <span
                                                    className={`md:hidden inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold shrink-0 ${
                                                        submission.status === 'published'
                                                            ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/20'
                                                            : 'bg-amber-50 text-amber-600 dark:bg-amber-500/10 dark:text-amber-400 border border-amber-200 dark:border-amber-500/20'
                                                    }`}
                                                >
                                                    {submission.status === 'published' ? (
                                                        <CheckCircle2 className="w-3 h-3" />
                                                    ) : (
                                                        <Clock className="w-3 h-3" />
                                                    )}
                                                    <span className="capitalize">{submission.status}</span>
                                                </span>
                                            </div>

                                            <p className="text-sm text-slate-500 dark:text-slate-400 line-clamp-2">
                                                {submission.description}
                                            </p>

                                            <div className="flex flex-wrap items-center gap-2 pt-1">
                                                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900/60 text-xs text-slate-500 dark:text-slate-400">
                                                    <FileText className="w-3.5 h-3.5" />
                                                    <span className="capitalize">{submission.submission_type} Format</span>
                                                </span>
                                                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900/60 text-xs text-slate-500 dark:text-slate-400">
                                                    <Calendar className="w-3.5 h-3.5" />
                                                    {submission.deadline
                                                        ? new Date(submission.deadline).toLocaleString()
                                                        : 'No deadline'}
                                                </span>
                                            </div>
                                        </div>

                                        {/* Right actions */}
                                        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-3 md:pt-0 border-t md:border-t-0 border-slate-100 dark:border-slate-800 shrink-0">
                                            {/* Status badge — desktop only */}
                                            <span
                                                className={`hidden md:inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${
                                                    submission.status === 'published'
                                                        ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/20'
                                                        : 'bg-amber-50 text-amber-600 dark:bg-amber-500/10 dark:text-amber-400 border border-amber-200 dark:border-amber-500/20'
                                                }`}
                                            >
                                                {submission.status === 'published' ? (
                                                    <CheckCircle2 className="w-3.5 h-3.5" />
                                                ) : (
                                                    <Clock className="w-3.5 h-3.5" />
                                                )}
                                                <span className="capitalize">{submission.status}</span>
                                            </span>

                                            {/* Action buttons */}
                                            <div className="flex items-center gap-2">
                                                <Link
                                                    href={`/mentor/submissions/${submission.id}`}
                                                    className="flex-1 sm:flex-none inline-flex justify-center items-center gap-1.5 px-3 py-2 rounded-xl bg-white dark:bg-slate-800/60 text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 border border-slate-200 dark:border-slate-700 hover:border-indigo-300 dark:hover:border-indigo-500/50 transition-colors shadow-sm text-sm font-medium"
                                                    title="View Details"
                                                >
                                                    <Eye className="w-4 h-4" />
                                                    <span className="sm:hidden lg:inline">View</span>
                                                </Link>

                                                <Link
                                                    href={`/mentor/submissions/${submission.id}/edit`}
                                                    className="flex-1 sm:flex-none inline-flex justify-center items-center gap-1.5 px-3 py-2 rounded-xl bg-white dark:bg-slate-800/60 text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 border border-slate-200 dark:border-slate-700 hover:border-indigo-300 dark:hover:border-indigo-500/50 transition-colors shadow-sm text-sm font-medium"
                                                    title="Edit"
                                                >
                                                    <Edit className="w-4 h-4" />
                                                    <span className="sm:hidden lg:inline">Edit</span>
                                                </Link>

                                                {submission.status === 'draft' && (
                                                    <button
                                                        onClick={() => publishSubmission(submission.id)}
                                                        className="flex-1 sm:flex-none inline-flex justify-center items-center gap-1.5 px-3 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white shadow-sm shadow-emerald-500/20 hover:shadow-emerald-500/30 transition-all text-sm font-medium active:scale-95"
                                                        title="Publish"
                                                    >
                                                        <Send className="w-4 h-4" />
                                                        <span className="sm:hidden lg:inline">Publish</span>
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-16 px-4 border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-xl bg-slate-50/50 dark:bg-slate-800/20">
                                <Layers className="w-14 h-14 text-slate-300 dark:text-slate-600 mx-auto mb-4" />
                                <h3 className="text-base font-bold text-slate-800 dark:text-white mb-2">
                                    No Submissions Found
                                </h3>
                                <p className="text-slate-500 dark:text-slate-400 text-sm max-w-md mx-auto mb-6">
                                    There are currently no submissions created for this career group. Click the button below to
                                    create your first assignment.
                                </p>
                                <Link
                                    href={`/mentor/career-groups/${group.id}/submissions/create`}
                                    className="inline-flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-semibold shadow-sm shadow-indigo-500/20 transition-all active:scale-95"
                                >
                                    <Plus className="w-4 h-4" />
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