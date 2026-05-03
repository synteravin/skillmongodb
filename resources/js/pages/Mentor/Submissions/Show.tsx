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
    Search
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

export default function SubmissionShow({
    submission,
    studentSubmissions,
}: Props) {
    return (
        <AppLayout>
            <div className="w-full mx-auto space-y-8 p-4 sm:p-6 lg:p-8">
                
                {/* Header Section */}
                <div className="flex items-center gap-4 mb-2">
                    <Link
                        href={`/mentor/career-groups/${submission.group_id}/submissions`}
                        className="p-2.5 rounded-xl bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 border border-gray-200 dark:border-slate-700 transition-colors"
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
                <div className="relative rounded-3xl bg-white dark:bg-gradient-to-br dark:from-[#0b0f2a] dark:to-[#050619] border border-gray-100 dark:border-slate-800 shadow-xl overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 dark:bg-indigo-500/10 rounded-bl-full pointer-events-none blur-2xl"></div>
                    
                    <div className="p-6 sm:p-8 lg:p-10 relative z-10 flex flex-col md:flex-row gap-8">
                        <div className="flex-1 space-y-6">
                            <div className="flex flex-wrap items-center gap-3">
                                <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white">
                                    {submission.title}
                                </h2>
                                <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${
                                    submission.status === 'published'
                                        ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/30'
                                        : 'bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-400 border border-amber-200 dark:border-amber-500/30'
                                }`}>
                                    {submission.status === 'published' ? <CheckCircle2 className="w-4 h-4" /> : <Clock className="w-4 h-4" />}
                                    <span className="capitalize">{submission.status}</span>
                                </span>
                            </div>

                            <div className="prose prose-slate dark:prose-invert max-w-none">
                                <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-lg">
                                    {submission.description}
                                </p>
                            </div>

                            <div className="flex items-center gap-2 inline-flex bg-slate-50 dark:bg-slate-900 px-4 py-2.5 rounded-xl border border-gray-200 dark:border-slate-700">
                                <Calendar className="w-5 h-5 text-indigo-500 dark:text-indigo-400" />
                                <span className="font-medium text-slate-700 dark:text-slate-300">Deadline:</span>
                                <span className="text-slate-900 dark:text-white font-bold">{submission.deadline ? new Date(submission.deadline).toLocaleString() : 'Not Set'}</span>
                            </div>
                        </div>
                        
                        {/* Stats / Quick Info */}
                        <div className="w-full md:w-64 shrink-0 flex flex-col gap-4">
                            <div className="bg-slate-50 dark:bg-slate-800/50 rounded-2xl p-5 border border-gray-100 dark:border-slate-700">
                                <div className="flex items-center gap-3 mb-2 text-slate-500 dark:text-slate-400">
                                    <Users className="w-5 h-5" />
                                    <span className="font-semibold text-sm">Total Submissions</span>
                                </div>
                                <div className="text-3xl font-extrabold text-slate-900 dark:text-white">
                                    {studentSubmissions.length}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Student Submission Table */}
                <div className="relative rounded-3xl bg-white dark:bg-[#0a0d27] border border-gray-100 dark:border-slate-800 shadow-xl overflow-hidden">
                    <div className="p-6 border-b border-gray-100 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div className="flex items-center gap-3">
                            <div className="p-2.5 rounded-xl bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
                                <FileText className="w-5 h-5" />
                            </div>
                            <h3 className="text-lg font-bold text-slate-800 dark:text-white">
                                Student Work
                            </h3>
                        </div>
                        
                        <div className="relative">
                            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                            <input 
                                type="text"
                                placeholder="Search students..."
                                className="w-full sm:w-64 pl-9 pr-4 py-2 bg-slate-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-900 dark:text-white transition-all placeholder-slate-400"
                            />
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm">
                            <thead className="bg-slate-50 dark:bg-slate-900/50 text-slate-500 dark:text-slate-400 uppercase text-xs font-semibold tracking-wider border-b border-gray-200 dark:border-slate-800">
                                <tr>
                                    <th className="px-6 py-4">Student</th>
                                    <th className="px-6 py-4">Status</th>
                                    <th className="px-6 py-4">Submitted At</th>
                                    <th className="px-6 py-4 text-right">Action</th>
                                </tr>
                            </thead>

                            <tbody className="divide-y divide-gray-100 dark:divide-slate-800/60">
                                {studentSubmissions.length > 0 ? (
                                    studentSubmissions.map((item) => (
                                        <tr
                                            key={item.id}
                                            className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors group"
                                        >
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-xs shrink-0 shadow-sm">
                                                        {item.student_name.charAt(0)}
                                                    </div>
                                                    <span className="font-semibold text-slate-900 dark:text-white">
                                                        {item.student_name}
                                                    </span>
                                                </div>
                                            </td>

                                            <td className="px-6 py-4">
                                                <span
                                                    className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold ${
                                                        item.status === 'graded'
                                                            ? 'bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400 border border-blue-200 dark:border-blue-500/20'
                                                            : item.status === 'late'
                                                                ? 'bg-red-50 text-red-600 dark:bg-red-500/10 dark:text-red-400 border border-red-200 dark:border-red-500/20'
                                                                : 'bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/20'
                                                    }`}
                                                >
                                                    <span className="w-1.5 h-1.5 rounded-full bg-current"></span>
                                                    <span className="capitalize">{item.status}</span>
                                                </span>
                                            </td>

                                            <td className="px-6 py-4 text-slate-600 dark:text-slate-400 font-medium">
                                                {item.submitted_at || '-'}
                                            </td>

                                            <td className="px-6 py-4 text-right">
                                                <Link
                                                    href={`/mentor/student-submissions/${item.id}`}
                                                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 border border-gray-200 dark:border-slate-700 hover:border-indigo-300 dark:hover:border-indigo-500/50 hover:shadow-sm font-semibold transition-all group-hover:-translate-x-1"
                                                >
                                                    Review
                                                    <ChevronRight className="w-4 h-4 opacity-50 group-hover:opacity-100 transition-opacity" />
                                                </Link>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td
                                            colSpan={4}
                                            className="px-6 py-16 text-center"
                                        >
                                            <div className="flex flex-col items-center justify-center space-y-3">
                                                <div className="p-4 rounded-full bg-slate-50 dark:bg-slate-900">
                                                    <Users className="w-8 h-8 text-slate-300 dark:text-slate-600" />
                                                </div>
                                                <div className="text-slate-500 dark:text-slate-400 font-medium">
                                                    No student submissions yet.
                                                </div>
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