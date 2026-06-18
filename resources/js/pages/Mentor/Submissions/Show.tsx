import AppLayout from '@/layouts/app-layout';
import { Link } from '@inertiajs/react';
import {
    ArrowLeft,
    FileText,
    Calendar,
    CheckCircle2,
    Clock,
    Users,
    ChevronRight,
    Search,
} from 'lucide-react';

type Submission = {
    id: string;
    group_id?: string;
    title: string;
    description: string;
    deadline: string;
    status: 'draft' | 'published';
};

type StudentSubmission = {
    id: string;
    student_name: string;
    status: 'submitted' | 'late' | 'graded';
    submitted_at: string;
};

interface Props {
    submission: Submission;
    studentSubmissions: StudentSubmission[];
}

export default function SubmissionShow({ submission, studentSubmissions }: Props) {
    const statusBadge = {
        submitted: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/20',
        late: 'bg-red-50 text-red-600 dark:bg-red-500/10 dark:text-red-400 border border-red-200 dark:border-red-500/20',
        graded: 'bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400 border border-blue-200 dark:border-blue-500/20',
    };

    return (
        <AppLayout>
            <div
                className="w-full mx-auto space-y-6 p-4 sm:p-6 lg:p-8"
                style={{ fontFamily: "'Outfit', sans-serif" }}
            >
                {/* Page Header */}
                <div className="flex items-center gap-4">
                    <Link
                        href={`/mentor/career-groups/${submission.group_id}/submissions`}
                        className="inline-flex items-center justify-center w-10 h-10 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/60 text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 hover:border-indigo-300 dark:hover:border-indigo-500/50 transition-all shadow-sm"
                    >
                        <ArrowLeft className="w-5 h-5" />
                    </Link>
                    <div>
                        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
                            Submission Details
                        </h1>
                        <p className="text-sm text-slate-500 dark:text-slate-400">
                            Review assignment requirements and student work
                        </p>
                    </div>
                </div>

                {/* Submission Info Card */}
                <div className="rounded-xl bg-white dark:bg-gradient-to-b dark:from-[#0e0e1a] dark:to-[#090910] border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
                    <div className="p-6 sm:p-8 flex flex-col lg:flex-row gap-8">
                        {/* Main info */}
                        <div className="flex-1 space-y-5 min-w-0">
                            {/* Title + status */}
                            <div className="flex flex-wrap items-center gap-3">
                                <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white leading-tight">
                                    {submission.title}
                                </h2>
                                <span
                                    className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold shrink-0 ${
                                        submission.status === 'published'
                                            ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/30'
                                            : 'bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-400 border border-amber-200 dark:border-amber-500/30'
                                    }`}
                                >
                                    {submission.status === 'published' ? (
                                        <CheckCircle2 className="w-3.5 h-3.5" />
                                    ) : (
                                        <Clock className="w-3.5 h-3.5" />
                                    )}
                                    <span className="capitalize">{submission.status}</span>
                                </span>
                            </div>

                            {/* Description */}
                            <p className="text-slate-600 dark:text-slate-300 leading-relaxed whitespace-pre-line">
                                {submission.description}
                            </p>

                            {/* Deadline chip */}
                            <div className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
                                <Calendar className="w-4 h-4 text-indigo-500 dark:text-indigo-400 shrink-0" />
                                <span className="text-sm font-medium text-slate-600 dark:text-slate-400">Deadline:</span>
                                <span className="text-sm font-bold text-slate-900 dark:text-white">
                                    {submission.deadline
                                        ? new Date(submission.deadline).toLocaleString()
                                        : 'Not Set'}
                                </span>
                            </div>
                        </div>

                        {/* Stats sidebar */}
                        <div className="w-full lg:w-56 shrink-0 flex flex-row lg:flex-col gap-4">
                            <div className="flex-1 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700/60 p-5">
                                <div className="flex items-center gap-2 mb-2 text-slate-500 dark:text-slate-400">
                                    <Users className="w-4 h-4" />
                                    <span className="text-xs font-semibold uppercase tracking-wide">Total Submissions</span>
                                </div>
                                <div className="text-3xl font-extrabold text-slate-900 dark:text-white">
                                    {studentSubmissions.length}
                                </div>
                            </div>

                            <div className="flex-1 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700/60 p-5">
                                <div className="flex items-center gap-2 mb-2 text-slate-500 dark:text-slate-400">
                                    <FileText className="w-4 h-4" />
                                    <span className="text-xs font-semibold uppercase tracking-wide">Graded</span>
                                </div>
                                <div className="text-3xl font-extrabold text-slate-900 dark:text-white">
                                    {studentSubmissions.filter((s) => s.status === 'graded').length}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Student Submissions Table Card */}
                <div className="rounded-xl bg-white dark:bg-gradient-to-b dark:from-[#0e0e1a] dark:to-[#090910] border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
                    {/* Table header */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 px-6 py-5 border-b border-slate-100 dark:border-slate-800">
                        <div className="flex items-center gap-3">
                            <div className="p-2.5 rounded-xl bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
                                <FileText className="w-5 h-5" />
                            </div>
                            <div>
                                <h3 className="text-base font-bold text-slate-800 dark:text-white">Student Work</h3>
                                <p className="text-xs text-slate-500 dark:text-slate-400">
                                    {studentSubmissions.length} student{studentSubmissions.length !== 1 ? 's' : ''} submitted
                                </p>
                            </div>
                        </div>

                        {/* Search */}
                        <div className="relative">
                            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                            <input
                                type="text"
                                placeholder="Search students..."
                                className="w-full sm:w-60 pl-9 pr-4 py-2 bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-slate-900 dark:text-white placeholder-slate-400 transition-all"
                            />
                        </div>
                    </div>

                    {/* Responsive table */}
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left">
                            <thead className="bg-slate-50 dark:bg-slate-900/40 text-slate-500 dark:text-slate-400 text-xs font-semibold uppercase tracking-wider border-b border-slate-100 dark:border-slate-800">
                                <tr>
                                    <th className="px-6 py-4 whitespace-nowrap">Student</th>
                                    <th className="px-6 py-4 whitespace-nowrap">Status</th>
                                    <th className="px-6 py-4 whitespace-nowrap">Submitted At</th>
                                    <th className="px-6 py-4 text-right whitespace-nowrap">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                                {studentSubmissions.length > 0 ? (
                                    studentSubmissions.map((item) => (
                                        <tr
                                            key={item.id}
                                            className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors group"
                                        >
                                            {/* Student */}
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-xs shrink-0 shadow-sm">
                                                        {item.student_name.charAt(0).toUpperCase()}
                                                    </div>
                                                    <span className="font-semibold text-slate-900 dark:text-white whitespace-nowrap">
                                                        {item.student_name}
                                                    </span>
                                                </div>
                                            </td>

                                            {/* Status */}
                                            <td className="px-6 py-4">
                                                <span
                                                    className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold ${statusBadge[item.status]}`}
                                                >
                                                    <span className="w-1.5 h-1.5 rounded-full bg-current" />
                                                    <span className="capitalize">{item.status}</span>
                                                </span>
                                            </td>

                                            {/* Submitted at */}
                                            <td className="px-6 py-4 text-slate-500 dark:text-slate-400 whitespace-nowrap">
                                                {item.submitted_at || '—'}
                                            </td>

                                            {/* Action */}
                                            <td className="px-6 py-4 text-right">
                                                <Link
                                                    href={`/mentor/student-submissions/${item.id}`}
                                                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white dark:bg-slate-800/60 text-indigo-600 dark:text-indigo-400 border border-slate-200 dark:border-slate-700 hover:border-indigo-300 dark:hover:border-indigo-500/50 hover:shadow-sm font-semibold transition-all text-sm whitespace-nowrap"
                                                >
                                                    Review
                                                    <ChevronRight className="w-4 h-4 opacity-60 group-hover:opacity-100 transition-opacity" />
                                                </Link>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={4} className="px-6 py-16 text-center">
                                            <div className="flex flex-col items-center gap-3">
                                                <div className="p-4 rounded-full bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-700">
                                                    <Users className="w-8 h-8 text-slate-300 dark:text-slate-600" />
                                                </div>
                                                <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">
                                                    No student submissions yet.
                                                </p>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}