import { useState } from 'react';
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
    attachment?: string;
    deadline?: string;
    created_at: string;
}

interface StudentSubmission {
    id: string;
    _id?: string;
    submission_id: string;
    status: string;
    grade?: string | number;
    feedback?: string;
    certificate_url?: string;
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

    const [expandedCardId, setExpandedCardId] = useState<string | null>(null);

    const toggleCard = (id: string) => {
        setExpandedCardId(expandedCardId === id ? null : id);
    };

    return (
        <div className="flex min-h-screen bg-slate-50 dark:bg-[#020202]">
            {/* ─── SIDEBAR (DESKTOP) ─── */}
            <aside className="w-[240px] shrink-0 flex-col bg-white dark:bg-[#050619] border-r border-slate-200 dark:border-slate-800/60 min-h-screen hidden md:flex sticky top-0">
                {/* Logo */}
                <div className="px-6 py-6 border-b border-slate-100 dark:border-slate-800/60">
                    <div className="flex items-center gap-3">
                        <img src="/images/logo-sv.webp" alt="Skill Ventura Logo" className="w-8 h-8 object-contain shrink-0" />
                        <span className="text-gray-900 dark:text-white text-sm tracking-widest leading-tight" style={{ fontFamily: "'Orbitron', sans-serif", fontWeight: 700 }}>
                            Skill<span className="text-[#FACC15]">Ventura</span>
                        </span>
                    </div>
                </div>

                {/* Nav */}
                <nav className="flex-1 px-4 py-6 space-y-2">
                    <Link href="/student/course" className="flex items-center gap-3 px-4 py-3 rounded-xl text-slate-500 dark:text-slate-400 hover:text-gray-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/60 transition-all text-sm font-medium group">
                        <ArrowLeft className="w-4 h-4 shrink-0 group-hover:-translate-x-1 transition-transform" />
                        <span className="font-['Oxanium']">Back to Dashboard</span>
                    </Link>
                    <div className="my-4 border-t border-slate-100 dark:border-slate-800/60" />
                    <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-[#3B28F6]/10 dark:bg-[#3B28F6]/15 border border-[#3B28F6]/20 text-[#3B28F6] dark:text-white text-sm font-semibold">
                        <ClipboardList className="w-4 h-4 text-[#3B28F6] dark:text-[#FACC15]" />
                        <span className="font-['Oxanium']">Assignments</span>
                    </div>
                </nav>

                {/* Footer accent */}
                <div className="p-4 border-t border-slate-100 dark:border-slate-800/60">
                    <div className="h-1 w-full rounded-full bg-gradient-to-r from-[#3B28F6] via-[#6d5bff] to-[#FACC15] opacity-60" />
                </div>
            </aside>

            {/* ─── MAIN CONTENT ─── */}
            <main className="flex-1 w-full max-w-full md:max-w-[calc(100vw-240px)] flex flex-col">
                
                {/* ─── MOBILE HEADER ─── */}
                <div className="md:hidden flex items-center justify-between px-6 py-4 bg-white dark:bg-[#050619] border-b border-slate-200 dark:border-slate-800/60 sticky top-0 z-20">
                    <div className="flex items-center gap-3">
                        <img src="/images/logo-sv.webp" alt="Logo" className="w-6 h-6 object-contain" />
                        <span className="text-gray-900 dark:text-white text-xs tracking-widest font-bold font-['Orbitron']">
                            Skill<span className="text-[#FACC15]">Ventura</span>
                        </span>
                    </div>
                    <Link href="/student/course" className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700">
                        <ArrowLeft className="w-4 h-4" />
                    </Link>
                </div>

                {/* Page Header */}
                <div className="relative border-b border-slate-200 dark:border-slate-800/60 bg-white dark:bg-transparent px-6 py-8 md:px-12 md:py-12">
                    <div className="absolute inset-0 bg-gradient-to-b from-[#3B28F6]/5 to-transparent dark:from-[#3B28F6]/10 pointer-events-none" />
                    <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center gap-5">
                        <div className="p-4 rounded-2xl bg-white dark:bg-[#050619] border border-slate-200 dark:border-slate-800 shadow-sm">
                            <ClipboardList className="w-8 h-8 text-[#3B28F6] dark:text-[#FACC15]" />
                        </div>
                        <div>
                            <h1 className="text-2xl md:text-4xl font-extrabold text-gray-900 dark:text-white font-['Orbitron'] tracking-tight">
                                {group.name} Module
                            </h1>
                            <p className="text-slate-500 dark:text-slate-400 mt-2 text-sm md:text-base font-['Oxanium']">
                                Review your instructions and submit your tasks below.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Submission Cards */}
                <div className="flex-1 p-6 md:p-12 lg:px-16 lg:py-12 pb-24">
                    {submissions.length === 0 ? (
                        <div className="text-center py-24 bg-white dark:bg-[#050619]/50 rounded-3xl border border-slate-200 dark:border-slate-800/60">
                            <div className="w-20 h-20 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-6">
                                <ClipboardList className="w-10 h-10 text-slate-400 dark:text-slate-500" />
                            </div>
                            <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-2 font-['Orbitron']">No Assignments Yet</h3>
                            <p className="text-slate-500 dark:text-slate-400 max-w-md mx-auto font-['Oxanium']">
                                Your mentor hasn't published any assignments for this career branch yet. Check back later!
                            </p>
                        </div>
                    ) : (
                        <div className="flex flex-col gap-6 max-w-5xl mx-auto">
                            {submissions.map((submission) => {
                                const status = getStatusInfo(submission);
                                const isSubmitted = studentSubmissions[submission.id || submission._id as string];
                                const submissionId = submission.id || submission._id;
                                const isExpanded = expandedCardId === submissionId;

                                return (
                                    <div key={submissionId} className="flex flex-col gap-4">
                                        
                                        {/* SEPARATED MENTOR EVALUATION CARD (MOVED TO TOP) */}
                                        {isSubmitted && isSubmitted.status === 'graded' && (
                                            <div className="p-6 md:p-8 rounded-3xl bg-white dark:bg-[#050619] border border-emerald-200 dark:border-emerald-500/30 shadow-md flex flex-col md:flex-row gap-8 relative overflow-hidden">
                                                {/* Decorative Background */}
                                                <div className="absolute -right-20 -top-20 w-64 h-64 bg-emerald-500/5 dark:bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

                                                {/* Grade Block */}
                                                <div className="flex flex-col items-center justify-center shrink-0">
                                                    <div className="p-3 bg-emerald-100 dark:bg-emerald-500/20 rounded-2xl mb-3 ring-4 ring-emerald-50 dark:ring-emerald-500/5">
                                                        <CheckCircle2 className="w-8 h-8 text-emerald-600 dark:text-emerald-400" />
                                                    </div>
                                                    <div className="text-center">
                                                        <span className="block text-3xl font-black text-emerald-600 dark:text-emerald-400 font-['Orbitron']">
                                                            {isSubmitted.grade}
                                                        </span>
                                                        <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                                                            Score
                                                        </span>
                                                    </div>
                                                </div>

                                                {/* Feedback Block */}
                                                <div className="flex-1 border-t md:border-t-0 md:border-l border-slate-100 dark:border-slate-800/60 pt-6 md:pt-0 md:pl-8">
                                                    <h4 className="font-bold text-emerald-900 dark:text-emerald-300 font-['Orbitron'] text-lg mb-3">
                                                        Mentor Feedback
                                                    </h4>
                                                    <div className="bg-emerald-50/50 dark:bg-[#020202]/40 p-5 rounded-2xl border border-emerald-100/50 dark:border-emerald-500/10 mb-5">
                                                        <p className="text-emerald-800 dark:text-emerald-200/80 italic text-sm md:text-base leading-relaxed font-['Oxanium']">
                                                            "{isSubmitted.feedback || 'No written feedback provided.'}"
                                                        </p>
                                                    </div>

                                                    {isSubmitted.certificate_url && (
                                                        <a
                                                            href={isSubmitted.certificate_url}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="inline-flex items-center gap-2 text-sm font-bold bg-emerald-600 hover:bg-emerald-500 text-white px-6 py-3 rounded-xl transition-all shadow-md shadow-emerald-600/20"
                                                        >
                                                            <ClipboardList className="w-4 h-4" /> View Certificate
                                                        </a>
                                                    )}
                                                </div>
                                            </div>
                                        )}

                                        {/* ASSIGNMENT CARD */}
                                        <div
                                            className={`group relative flex flex-col bg-white dark:bg-[#050619] rounded-3xl border transition-all duration-300 overflow-hidden ${isExpanded ? 'border-[#3B28F6]/50 dark:border-[#FACC15]/50 shadow-lg' : 'border-slate-200 dark:border-slate-800/80 shadow-sm hover:border-[#3B28F6]/30 dark:hover:border-[#3B28F6]/50 hover:shadow-md'}`}
                                        >
                                            {/* Color Accent Line */}
                                            <div className={`absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#3B28F6] to-[#FACC15] transition-opacity ${isExpanded ? 'opacity-100' : 'opacity-0 group-hover:opacity-50'}`} />

                                            {/* COMPACT HEADER (Always Visible) */}
                                            <div 
                                                className="p-6 md:p-8 cursor-pointer flex flex-col md:flex-row md:items-center justify-between gap-6"
                                                onClick={() => toggleCard(submissionId as string)}
                                            >
                                                <div className="flex-1">
                                                    <div className="flex items-center gap-3 mb-3">
                                                        <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider border ${status.color}`}>
                                                            {status.icon}
                                                            {status.label}
                                                        </div>
                                                        <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider font-['Oxanium'] bg-slate-100 dark:bg-slate-800 px-3 py-1.5 rounded-lg flex items-center gap-1.5">
                                                            {submission.submission_type === 'link' ? <ArrowRight className="w-3.5 h-3.5" /> : <ClipboardList className="w-3.5 h-3.5" />}
                                                            {submission.submission_type} FORMAT
                                                        </span>
                                                    </div>
                                                    
                                                    <h3 className="text-xl md:text-2xl font-extrabold text-gray-900 dark:text-white font-['Orbitron'] leading-tight group-hover:text-[#3B28F6] dark:group-hover:text-[#FACC15] transition-colors">
                                                        {submission.title}
                                                    </h3>
                                                </div>
                                                
                                                <div className="flex items-center gap-6">
                                                    <div className="hidden md:flex flex-col items-end">
                                                        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Deadline</span>
                                                        <span className="text-sm font-medium text-slate-700 dark:text-slate-300 font-['Oxanium'] flex items-center gap-1.5">
                                                            <Calendar className="w-4 h-4 text-[#FACC15]" />
                                                            {submission.deadline ? new Date(submission.deadline).toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }) : 'No Deadline'}
                                                        </span>
                                                    </div>
                                                    <div className={`p-3 rounded-xl border transition-all ${isExpanded ? 'bg-[#3B28F6] border-[#3B28F6] text-white' : 'bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400'}`}>
                                                        <svg className={`w-5 h-5 transform transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                                        </svg>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* EXPANDABLE BODY (Instructions & Feedback) */}
                                            <div className={`transition-all duration-500 ease-in-out ${isExpanded ? 'max-h-[2000px] opacity-100' : 'max-h-0 opacity-0 overflow-hidden'}`}>
                                                <div className="p-6 md:p-8 pt-0 border-t border-slate-100 dark:border-slate-800/50">
                                                    
                                                    <div className="prose prose-sm md:prose-base dark:prose-invert max-w-none mt-6 mb-8">
                                                        <p className="text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-line font-['Oxanium'] text-[15px] md:text-[16px]">
                                                            {submission.description}
                                                        </p>
                                                    </div>

                                                    {/* Reference Material */}
                                                    {submission.attachment && (
                                                        <div className="mb-8">
                                                            <a
                                                                href={`/storage/${submission.attachment}`}
                                                                target="_blank"
                                                                rel="noopener noreferrer"
                                                                className="inline-flex items-center gap-3 text-sm font-bold text-[#3B28F6] dark:text-[#FACC15] bg-[#3B28F6]/5 dark:bg-[#FACC15]/10 hover:bg-[#3B28F6]/10 dark:hover:bg-[#FACC15]/20 px-5 py-3 rounded-xl border border-[#3B28F6]/20 dark:border-[#FACC15]/20 transition-colors"
                                                            >
                                                                <div className="p-1.5 bg-white dark:bg-black/20 rounded-md">
                                                                    <ClipboardList className="w-4 h-4" />
                                                                </div>
                                                                Download Reference Material
                                                            </a>
                                                        </div>
                                                    )}

                                                    <div className="flex justify-end pt-4">
                                                        <Link
                                                            href={`/student/submissions/${submissionId}`}
                                                            className={`inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl font-bold transition-all text-sm uppercase tracking-wider ${
                                                                isSubmitted
                                                                    ? 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-300 dark:border-slate-700 hover:border-[#3B28F6]/50 hover:text-[#3B28F6] dark:hover:text-[#FACC15]'
                                                                    : 'bg-[#3B28F6] text-white hover:bg-[#5140ff] shadow-lg shadow-[#3B28F6]/20 hover:shadow-[#3B28F6]/40'
                                                            }`}
                                                        >
                                                            <span>{isSubmitted ? 'View Workspace' : 'Open Workspace to Submit'}</span>
                                                            <ArrowRight className="w-4 h-4" />
                                                        </Link>
                                                    </div>
                                                </div>
                                            </div>
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