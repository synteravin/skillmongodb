import AppLayout from '@/layouts/app-layout';
import { Link } from '@inertiajs/react';
import { ClipboardList, CheckCircle2, Clock, AlertCircle, Calendar, ArrowRight, ArrowLeft } from 'lucide-react';

interface CareerGroup {
    id: string;
    _id?: string;
    name: string;
}

interface Submission {
    id: string;
    _id?: string;
    title: string;
    description: string;
    submission_type: string;
    deadline?: string;
    created_at: string;
}

interface StudentSubmission {
    id: string;
    _id?: string;
    submission_id: string;
    status: string;
    grade?: string | number;
    created_at: string;
}

interface Props {
    group: CareerGroup;
    submissions: Submission[];
    studentSubmissions: Record<string, StudentSubmission>;
}

export default function Index({ group, submissions, studentSubmissions }: Props) {

    const getStatusInfo = (submission: Submission) => {
        const studentSub = studentSubmissions[submission.id || submission._id as string];
        const now = new Date();
        const deadline = submission.deadline ? new Date(submission.deadline) : null;
        const isPastDeadline = deadline && now > deadline;

        if (studentSub) {
            if (studentSub.status === 'graded') {
                return {
                    label: `Graded: ${studentSub.grade}`,
                    color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
                    icon: <CheckCircle2 className="w-4 h-4" />
                };
            }
            if (studentSub.status === 'late') {
                return {
                    label: 'Submitted Late',
                    color: 'text-orange-400 bg-orange-500/10 border-orange-500/20',
                    icon: <Clock className="w-4 h-4" />
                };
            }
            return {
                label: 'Submitted',
                color: 'text-blue-400 bg-blue-500/10 border-blue-500/20',
                icon: <CheckCircle2 className="w-4 h-4" />
            };
        }

        if (isPastDeadline) {
            return {
                label: 'Missing',
                color: 'text-red-400 bg-red-500/10 border-red-500/20',
                icon: <AlertCircle className="w-4 h-4" />
            };
        }

        return {
            label: 'Pending',
            color: 'text-slate-400 bg-slate-500/10 border-slate-500/20',
            icon: <Clock className="w-4 h-4" />
        };
    };

    return (
        <div className="w-full mx-auto space-y-8 p-4 sm:p-6 lg:p-8">

            {/* HEADER */}
            <div className="relative overflow-hidden rounded-3xl bg-[#0a0d27] border border-slate-800/60 shadow-xl shadow-indigo-500/10 p-8 sm:p-10">
                <div className="absolute -left-10 -top-10 w-40 h-40 bg-indigo-500/20 rounded-full blur-3xl"></div>
                <div className="absolute right-0 bottom-0 w-60 h-60 bg-blue-500/10 rounded-full blur-3xl"></div>

                <div className="relative z-10">
                    <Link
                        href={`/student/course`}
                        className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-800/50 text-slate-300 hover:text-white hover:bg-slate-700 transition-colors text-sm font-medium border border-slate-700/50 mb-6 w-fit"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Back to Dashboard
                    </Link>

                    <div className="flex items-center gap-4">
                        <div className="p-3 rounded-2xl bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
                            <ClipboardList className="w-8 h-8" />
                        </div>
                        <div>
                            <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
                                Assignments
                            </h1>
                            <p className="text-slate-400 mt-2 text-lg">
                                {group.name} Module Submissions
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* LIST */}
            <div className="relative rounded-3xl bg-[#0b0f2a] border border-slate-800 p-6 sm:p-8 shadow-lg">
                {submissions.length === 0 ? (
                    <div className="text-center py-16">
                        <div className="w-20 h-20 bg-slate-800/50 rounded-full flex items-center justify-center mx-auto mb-4 border border-slate-700/50">
                            <ClipboardList className="w-10 h-10 text-slate-500" />
                        </div>
                        <h3 className="text-xl font-bold text-white mb-2">No Assignments Yet</h3>
                        <p className="text-slate-400 max-w-md mx-auto">
                            Your mentor hasn't published any assignments for this career branch yet. Check back later!
                        </p>
                    </div>
                ) : (
                    <div className="grid gap-4 md:grid-cols-2">
                        {submissions.map((submission) => {
                            const status = getStatusInfo(submission);
                            const isSubmitted = studentSubmissions[submission.id || submission._id as string];
                            const submissionId = submission.id || submission._id;

                            return (
                                <div
                                    key={submissionId}
                                    className="group relative flex flex-col justify-between p-6 rounded-2xl border border-slate-700/60 bg-slate-800/40 hover:bg-slate-800/80 hover:border-indigo-500/50 transition-all duration-300 overflow-hidden"
                                >
                                    {/* Status Glow Indicator */}
                                    {isSubmitted && (
                                        <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-bl-full pointer-events-none blur-xl"></div>
                                    )}

                                    <div>
                                        <div className="flex justify-between items-start mb-4">
                                            <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${status.color}`}>
                                                {status.icon}
                                                {status.label}
                                            </div>
                                            <span className="text-xs font-medium text-slate-500 px-2 py-1 bg-slate-900/50 rounded-lg border border-slate-800">
                                                {submission.submission_type.toUpperCase()}
                                            </span>
                                        </div>

                                        <h3 className="text-xl font-bold text-white mb-2 group-hover:text-indigo-400 transition-colors">
                                            {submission.title}
                                        </h3>

                                        <p className="text-sm text-slate-400 line-clamp-2 mb-6">
                                            {submission.description}
                                        </p>
                                    </div>

                                    <div className="flex items-center justify-between mt-auto pt-4 border-t border-slate-700/50">
                                        <div className="flex items-center gap-2 text-sm text-slate-400">
                                            <Calendar className="w-4 h-4" />
                                            <span>
                                                {submission.deadline
                                                    ? new Date(submission.deadline).toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })
                                                    : 'No Deadline'}
                                            </span>
                                        </div>

                                        <Link
                                            href={`/student/submissions/${submissionId}`}
                                            className={`inline-flex items-center justify-center p-2 rounded-xl transition-all ${isSubmitted
                                                ? 'bg-slate-700 text-white hover:bg-slate-600'
                                                : 'bg-indigo-600 text-white hover:bg-indigo-500 hover:shadow-lg hover:shadow-indigo-500/20'
                                                }`}
                                        >
                                            <ArrowRight className="w-5 h-5" />
                                        </Link>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
}
