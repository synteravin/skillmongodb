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
                    color: 'text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-500/10 border-emerald-200 dark:border-emerald-500/20',
                    icon: <CheckCircle2 className="w-4 h-4" />
                };
            }
            if (studentSub.status === 'late') {
                return {
                    label: 'Submitted Late',
                    color: 'text-orange-600 dark:text-orange-400 bg-orange-50 dark:bg-orange-500/10 border-orange-200 dark:border-orange-500/20',
                    icon: <Clock className="w-4 h-4" />
                };
            }
            return {
                label: 'Submitted',
                color: 'text-[#3B28F6] bg-[#3B28F6]/10 border-[#3B28F6]/30',
                icon: <CheckCircle2 className="w-4 h-4" />
            };
        }

        if (isPastDeadline) {
            return {
                label: 'Missing',
                color: 'text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-500/10 border-red-200 dark:border-red-500/20',
                icon: <AlertCircle className="w-4 h-4" />
            };
        }

        return {
            label: 'Pending',
            color: 'text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-500/10 border-slate-200 dark:border-slate-500/20',
            icon: <Clock className="w-4 h-4" />
        };
    };

    return (
        <div className="flex min-h-screen bg-slate-100 dark:bg-[#020202]">

            {/* ─── SIDEBAR ─── */}
            <aside className="w-[200px] shrink-0 flex flex-col bg-white dark:bg-[#050619] border-r border-[#3B28F6]/30 dark:border-[#3B28F6] min-h-screen shadow-sm dark:shadow-none">

                {/* Logo */}
                <div className="px-5 py-5 border-b border-slate-100 dark:border-slate-800/60">
                    <div className="flex items-center gap-2.5">
                        <img
                            src="/images/logo-sv.webp"
                            alt="Skill Ventura Logo"
                            className="w-8 h-8 object-contain shrink-0"
                        />
                        <span
                            className="text-gray-900 dark:text-white text-[13px] tracking-widest leading-tight"
                            style={{ fontFamily: "'Orbitron', sans-serif", fontWeight: 700 }}
                        >
                            Skill<span className="text-[#FACC15]">Ventura</span>
                        </span>
                    </div>
                </div>

                {/* Nav */}
                <nav className="flex-1 px-3 py-5 space-y-1">
                    {/* Back to Dashboard */}
                    <Link
                        href="/student/course"
                        className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-slate-500 dark:text-slate-400 hover:text-gray-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/60 transition-all text-sm font-medium group"
                    >
                        <ArrowLeft className="w-4 h-4 shrink-0 group-hover:-translate-x-0.5 transition-transform" />
                        <span className="font-['Oxanium']">Back to Dashboard</span>
                    </Link>

                    {/* Divider */}
                    <div className="my-3 border-t border-slate-100 dark:border-slate-800/60" />

                    {/* Active: Assignments */}
                    <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl bg-[#3B28F6]/10 dark:bg-[#3B28F6]/15 border border-[#3B28F6]/25 dark:border-[#3B28F6]/30 text-gray-900 dark:text-white text-sm font-semibold">
                        <div className="w-8 h-8 rounded-lg bg-[#3B28F6] flex items-center justify-center shrink-0 shadow-md shadow-[#3B28F6]/40">
                            <ClipboardList className="w-4 h-4 text-white" />
                        </div>
                        <span className="font-['Oxanium']">Assignments</span>
                    </div>
                </nav>

                {/* Footer accent */}
                <div className="px-5 py-4 border-t border-slate-100 dark:border-slate-800/60">
                    <div className="h-1 w-full rounded-full bg-gradient-to-r from-[#3B28F6] via-[#6d5bff] to-[#FACC15] opacity-60" />
                </div>
            </aside>

            {/* ─── MAIN CONTENT ─── */}
            <main className="flex-1 overflow-y-auto">

                {/* Page Header */}
                <div className="relative overflow-hidden border-b border-[#3B28F6]/30 dark:border-[#3B28F6] bg-white dark:bg-[#050619] px-8 py-8 shadow-sm dark:shadow-none">
                    <div className="relative z-10 flex items-center gap-4">
                        <div className="p-3 rounded-2xl bg-[#3B28F6]/10 dark:bg-[#3B28F6]/20 border border-[#3B28F6]/25 dark:border-[#3B28F6]/30 shadow-lg shadow-[#3B28F6]/10 dark:shadow-[#3B28F6]/20">
                            <ClipboardList className="w-8 h-8 text-[#3B28F6]" />
                        </div>
                        <div>
                            <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white font-['Orbitron'] tracking-tight">
                                Assignments
                            </h1>
                            <p className="text-slate-500 dark:text-slate-400 mt-1 text-base font-['Oxanium']">
                                {group.name} Module Submissions
                            </p>
                        </div>
                    </div>
                </div>

                {/* Submission Cards */}
                <div className="px-8 py-8">
                    {submissions.length === 0 ? (
                        <div className="text-center py-24">
                            <div className="w-20 h-20 bg-slate-200 dark:bg-slate-800/50 rounded-full flex items-center justify-center mx-auto mb-4 border border-slate-300 dark:border-slate-700/50">
                                <ClipboardList className="w-10 h-10 text-slate-400 dark:text-slate-500" />
                            </div>
                            <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-2">No Assignments Yet</h3>
                            <p className="text-slate-500 dark:text-slate-400 max-w-md mx-auto">
                                Your mentor hasn't published any assignments for this career branch yet. Check back later!
                            </p>
                        </div>
                    ) : (
                        <div className="flex flex-col gap-4">
                            {submissions.map((submission) => {
                                const status = getStatusInfo(submission);
                                const isSubmitted = studentSubmissions[submission.id || submission._id as string];
                                const submissionId = submission.id || submission._id;

                                return (
                                    <div
                                        key={submissionId}
                                        className="group relative flex flex-col justify-between p-6 rounded-2xl border border-[#3B28F6]/25 dark:border-[#3B28F6] bg-white dark:bg-[#050619] shadow-sm dark:shadow-none hover:shadow-md dark:hover:shadow-none hover:border-[#3B28F6]/50 dark:hover:border-[#3B28F6] transition-all duration-300 overflow-hidden"
                                    >
                                        {/* Glow top-right for submitted */}
                                        {isSubmitted && (
                                            <div className="absolute top-0 right-0 w-28 h-28 bg-[#3B28F6]/5 dark:bg-[#3B28F6]/8 rounded-bl-full pointer-events-none blur-2xl" />
                                        )}

                                        <div>
                                            <div className="flex justify-between items-start mb-4">
                                                <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${status.color}`}>
                                                    {status.icon}
                                                    {status.label}
                                                </div>
                                                <span className="text-xs font-medium text-slate-500 dark:text-slate-500 px-2 py-1 bg-slate-100 dark:bg-slate-900/60 rounded-lg border border-slate-200 dark:border-slate-800">
                                                    {submission.submission_type.toUpperCase()}
                                                </span>
                                            </div>

                                            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2 group-hover:text-[#3B28F6] dark:group-hover:text-[#FACC15] transition-colors">
                                                {submission.title}
                                            </h3>

                                            <p className="text-sm text-slate-500 dark:text-slate-400 line-clamp-2 mb-6">
                                                {submission.description}
                                            </p>
                                        </div>

                                        <div className="flex items-center justify-between mt-auto pt-4 border-t border-slate-100 dark:border-slate-700/50">
                                            <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
                                                <Calendar className="w-4 h-4 text-[#FACC15]/80 dark:text-[#FACC15]/70" />
                                                <span>
                                                    {submission.deadline
                                                        ? new Date(submission.deadline).toLocaleDateString('en-US', {
                                                            month: 'short',
                                                            day: 'numeric',
                                                            hour: '2-digit',
                                                            minute: '2-digit'
                                                        })
                                                        : 'No Deadline'}
                                                </span>
                                            </div>

                                            <Link
                                                href={`/student/submissions/${submissionId}`}
                                                className={`inline-flex items-center justify-center p-2 rounded-xl transition-all ${
                                                    isSubmitted
                                                        ? 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-white hover:bg-slate-200 dark:hover:bg-slate-600'
                                                        : 'bg-[#3B28F6] text-white hover:bg-[#5140ff] hover:shadow-lg hover:shadow-[#3B28F6]/30'
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
            </main>
        </div>
    );
}