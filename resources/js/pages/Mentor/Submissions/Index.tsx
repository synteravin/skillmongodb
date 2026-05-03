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
    Layers
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

export default function SubmissionIndex({
    group,
    submissions,
}: Props) {
    const publishSubmission = (submissionId: string) => {
        router.post(`/mentor/submissions/${submissionId}/publish`);
    };

    return (
        <AppLayout>
            <div className="w-full mx-auto space-y-8 p-4 sm:p-6 lg:p-8">
                {/* Header Hero Section */}
                <div className="relative overflow-hidden rounded-3xl bg-white dark:bg-[#0a0d27] border border-gray-100 dark:border-slate-800/60 shadow-xl shadow-indigo-500/5 dark:shadow-indigo-500/10 p-6 sm:p-8 md:p-10">
                    <div className="absolute top-0 right-0 p-12 opacity-10 pointer-events-none">
                        <FileText className="w-64 h-64 text-indigo-600 dark:text-indigo-400 transform rotate-12" />
                    </div>

                    <div className="absolute -left-10 -top-10 w-40 h-40 bg-indigo-500/20 dark:bg-indigo-500/10 rounded-full blur-3xl"></div>
                    <div className="absolute right-20 bottom-0 w-60 h-60 bg-emerald-500/20 dark:bg-emerald-500/10 rounded-full blur-3xl"></div>

                    <div className="relative z-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
                        <div className="space-y-4 max-w-2xl">
                            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 text-sm font-medium border border-indigo-100 dark:border-indigo-500/20">
                                <span>Submission Management</span>
                            </div>
                            <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">
                                {group.name}
                            </h1>
                            <p className="text-slate-500 dark:text-slate-400 text-lg">
                                Manage assignments, track deadlines, and review student progress for this career branch.
                            </p>
                        </div>

                        <div className="flex shrink-0">
                            <Link
                                href={`/mentor/career-groups/${group.id}/submissions/create`}
                                className="group relative inline-flex items-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-semibold shadow-md shadow-indigo-500/20 hover:shadow-lg hover:shadow-indigo-500/30 transition-all active:scale-95 overflow-hidden"
                            >
                                <Plus className="w-5 h-5 relative z-10 group-hover:rotate-90 transition-transform duration-300" />
                                <span className="relative z-10">Create Submission</span>
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Submissions List */}
                <div className="relative rounded-3xl p-6 lg:p-8 bg-white dark:bg-gradient-to-br dark:from-[#0b0f2a] dark:to-[#050619] border border-gray-100 dark:border-slate-800 shadow-lg">
                    <div className="absolute top-0 right-0 w-40 h-40 bg-blue-500/5 dark:bg-blue-500/10 rounded-bl-[100px] pointer-events-none"></div>
                    
                    <div className="flex items-center gap-3 mb-8 relative z-10">
                        <div className="p-3 rounded-xl bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400">
                            <Layers className="w-6 h-6" />
                        </div>
                        <h2 className="text-xl font-bold text-slate-800 dark:text-white">
                            All Submissions
                        </h2>
                    </div>

                    {submissions.length > 0 ? (
                        <div className="grid grid-cols-1 gap-4">
                            {submissions.map((submission) => (
                                <div 
                                    key={submission.id}
                                    className="group relative flex flex-col md:flex-row md:items-center justify-between gap-6 p-5 sm:p-6 rounded-2xl border border-gray-100 dark:border-slate-700/60 bg-gray-50/50 dark:bg-slate-800/40 hover:bg-white dark:hover:bg-slate-800/80 transition-all duration-300 shadow-sm hover:shadow-md"
                                >
                                    <div className="absolute top-0 left-0 w-1 h-full bg-indigo-500 rounded-l-2xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                    
                                    <div className="flex-1 space-y-3">
                                        <div className="flex items-start justify-between gap-4">
                                            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                                                {submission.title}
                                            </h3>
                                            <div className="flex items-center gap-2 shrink-0 md:hidden">
                                                <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${
                                                    submission.status === 'published'
                                                        ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/20'
                                                        : 'bg-amber-50 text-amber-600 dark:bg-amber-500/10 dark:text-amber-400 border border-amber-200 dark:border-amber-500/20'
                                                }`}>
                                                    {submission.status === 'published' ? <CheckCircle2 className="w-3.5 h-3.5" /> : <Clock className="w-3.5 h-3.5" />}
                                                    <span className="capitalize">{submission.status}</span>
                                                </span>
                                            </div>
                                        </div>
                                        
                                        <p className="text-slate-500 dark:text-slate-400 text-sm line-clamp-2 max-w-3xl">
                                            {submission.description}
                                        </p>
                                        
                                        <div className="flex flex-wrap items-center gap-4 text-xs font-medium text-slate-500 dark:text-slate-400 pt-2">
                                            <div className="flex items-center gap-1.5 bg-white dark:bg-slate-900 px-2.5 py-1.5 rounded-lg border border-gray-200 dark:border-slate-700">
                                                <FileText className="w-4 h-4 text-slate-400 dark:text-slate-500" />
                                                <span className="capitalize">{submission.submission_type} Format</span>
                                            </div>
                                            <div className="flex items-center gap-1.5 bg-white dark:bg-slate-900 px-2.5 py-1.5 rounded-lg border border-gray-200 dark:border-slate-700">
                                                <Calendar className="w-4 h-4 text-slate-400 dark:text-slate-500" />
                                                <span>{submission.deadline ? new Date(submission.deadline).toLocaleString() : 'No deadline'}</span>
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <div className="flex flex-col sm:flex-row items-center gap-3 shrink-0 mt-4 md:mt-0 pt-4 md:pt-0 border-t md:border-t-0 border-gray-100 dark:border-slate-700">
                                        <div className="hidden md:flex items-center gap-2 mr-4">
                                            <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${
                                                submission.status === 'published'
                                                    ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/20'
                                                    : 'bg-amber-50 text-amber-600 dark:bg-amber-500/10 dark:text-amber-400 border border-amber-200 dark:border-amber-500/20'
                                            }`}>
                                                {submission.status === 'published' ? <CheckCircle2 className="w-3.5 h-3.5" /> : <Clock className="w-3.5 h-3.5" />}
                                                <span className="capitalize">{submission.status}</span>
                                            </span>
                                        </div>
                                        
                                        <div className="flex items-center gap-2 w-full sm:w-auto">
                                            <Link
                                                href={`/mentor/submissions/${submission.id}`}
                                                className="flex-1 sm:flex-none inline-flex justify-center items-center gap-1.5 px-4 py-2 rounded-xl bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 border border-gray-200 dark:border-slate-600 hover:border-indigo-300 dark:hover:border-indigo-500/50 transition-colors shadow-sm text-sm font-medium"
                                                title="View Details"
                                            >
                                                <Eye className="w-4 h-4" />
                                                <span className="sm:hidden lg:inline">View</span>
                                            </Link>

                                            <Link
                                                href={`/mentor/submissions/${submission.id}/edit`}
                                                className="flex-1 sm:flex-none inline-flex justify-center items-center gap-1.5 px-4 py-2 rounded-xl bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 border border-gray-200 dark:border-slate-600 hover:border-blue-300 dark:hover:border-blue-500/50 transition-colors shadow-sm text-sm font-medium"
                                                title="Edit"
                                            >
                                                <Edit className="w-4 h-4" />
                                                <span className="sm:hidden lg:inline">Edit</span>
                                            </Link>

                                            {submission.status === 'draft' && (
                                                <button
                                                    onClick={() => publishSubmission(submission.id)}
                                                    className="flex-1 sm:flex-none inline-flex justify-center items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white shadow-sm shadow-emerald-500/20 hover:shadow-emerald-500/40 transition-all text-sm font-medium active:scale-95"
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
                        <div className="text-center py-16 px-4 border-2 border-dashed border-gray-200 dark:border-slate-700 rounded-2xl bg-gray-50/50 dark:bg-slate-800/20">
                            <Layers className="w-16 h-16 text-slate-300 dark:text-slate-600 mx-auto mb-4" />
                            <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-2">No Submissions Found</h3>
                            <p className="text-slate-500 dark:text-slate-400 text-sm max-w-md mx-auto mb-6">
                                There are currently no submissions created for this career group. Click the button below to create your first assignment.
                            </p>
                            <Link
                                href={`/mentor/career-groups/${group.id}/submissions/create`}
                                className="inline-flex items-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-semibold shadow-md shadow-indigo-500/20 transition-all"
                            >
                                <Plus className="w-5 h-5" />
                                <span>Create Submission</span>
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </AppLayout>
    );
}