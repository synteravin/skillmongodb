import { useState } from 'react';
import { Link } from '@inertiajs/react';
import { ClipboardList, CheckCircle2, Clock, AlertCircle, Calendar, ArrowRight } from 'lucide-react';

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
        const studentSub = studentSubmissions[submission.id || (submission._id as string)];
        const now = new Date();
        const deadline = submission.deadline ? new Date(submission.deadline) : null;
        const isPastDeadline = deadline && now > deadline;

        if (studentSub) {
            if (studentSub.status === 'graded') {
                return {
                    label: `Graded: ${studentSub.grade}`,
                    color: 'text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-500/10 border-emerald-200 dark:border-emerald-500/20',
                    icon: <CheckCircle2 className="w-4 h-4" />,
                };
            }
            if (studentSub.status === 'late') {
                return {
                    label: 'Submitted Late',
                    color: 'text-orange-600 dark:text-orange-400 bg-orange-50 dark:bg-orange-500/10 border-orange-200 dark:border-orange-500/20',
                    icon: <Clock className="w-4 h-4" />,
                };
            }
            return {
                label: 'Submitted',
                color: 'text-[#2563EB] dark:text-blue-400 bg-blue-50 dark:bg-blue-500/10 border-blue-200 dark:border-blue-500/30',
                icon: <CheckCircle2 className="w-4 h-4" />,
            };
        }

        if (isPastDeadline) {
            return {
                label: 'Missing',
                color: 'text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-500/10 border-red-200 dark:border-red-500/20',
                icon: <AlertCircle className="w-4 h-4" />,
            };
        }

        return {
            label: 'Pending',
            color: 'text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-500/10 border-slate-200 dark:border-slate-500/20',
            icon: <Clock className="w-4 h-4" />,
        };
    };

    const [expandedCardId, setExpandedCardId] = useState<string | null>(null);

    const toggleCard = (id: string) => {
        setExpandedCardId(expandedCardId === id ? null : id);
    };

    return (
        <div className="flex h-screen flex-col overflow-hidden bg-[#f0f4ff] text-[#1e293b] dark:bg-[#040812] dark:text-white">
            {/* ================= HEADER ================= */}
            <div className="w-full flex-shrink-0 px-1 pt-0.5">
                <div
                    className="relative border-[2px] border-transparent md:border-[3px]"
                    style={{
                        borderImage:
                            'linear-gradient(to right, #2563EB 0%, #3b82f6 30%, #6366f1 50%, #facc15 100%) 1',
                    }}
                >
                    <div className="flex items-center gap-4 bg-white px-4 py-4 shadow-sm md:px-6 dark:bg-[#040812] dark:shadow-none">
                        <Link
                            href="/student/course"
                            className="flex h-10 w-10 shrink-0 items-center justify-center rounded border-2 border-blue-300 bg-[#eff6ff] p-2 transition-colors hover:border-blue-500 hover:bg-blue-100 md:h-12 md:w-12 dark:border-blue-800 dark:bg-[#0b1021] dark:hover:border-blue-600 dark:hover:bg-blue-900/40"
                        >
                            <svg
                                viewBox="0 0 48 48"
                                className="h-7 w-7 scale-125 text-blue-600 transition-transform duration-200 hover:scale-150 md:h-9 md:w-9 dark:text-indigo-500"
                            >
                                <rect x="12" y="20" width="29" height="4" fill="currentColor" />
                                <rect x="8" y="20" width="4" height="4" fill="currentColor" />
                                <rect x="5" y="20" width="5" height="4" fill="currentColor" />
                                <rect x="8" y="16" width="4" height="4" fill="currentColor" />
                                <rect x="8" y="24" width="4" height="4" fill="currentColor" />
                                <rect x="12" y="12" width="4" height="4" fill="currentColor" />
                                <rect x="12" y="28" width="4" height="4" fill="currentColor" />
                                <rect x="16" y="8" width="4" height="4" fill="currentColor" />
                                <rect x="16" y="32" width="4" height="4" fill="currentColor" />
                            </svg>
                        </Link>
                        <h1 className="truncate font-['Orbitron'] text-xl font-bold tracking-[0.15em] text-[#1e3a8a] uppercase md:text-2xl lg:text-3xl dark:text-white">
                            {group.name}
                        </h1>
                    </div>
                </div>
            </div>

            {/* ================= MAIN ================= */}
            <div className="flex min-h-0 flex-1 flex-col gap-2 overflow-hidden px-1 pt-2 pb-1 md:flex-row">
                {/* ================= SIDEBAR (DESKTOP) ================= */}
                <div className="hidden w-full flex-col gap-2 overflow-hidden rounded-xl border border-blue-200 bg-white p-3 shadow-sm md:flex md:w-[260px] md:flex-shrink-0 lg:w-[280px] dark:border-blue-500/30 dark:bg-gradient-to-b dark:from-[#0d1229] dark:to-[#080d1e] dark:shadow-none">
                    <p className="flex-shrink-0 px-1 font-['Orbitron'] text-xs font-bold tracking-[0.2em] text-blue-500 uppercase dark:text-gray-400">
                        Navigation
                    </p>
                    <div className="flex flex-col gap-2">
                        <div className="relative flex items-center gap-3 rounded-xl border border-blue-400 bg-gradient-to-br from-[#dbeafe] to-[#eff6ff] px-3 py-3 shadow-[0_0_12px_rgba(59,130,246,0.15)] dark:border-blue-500/80 dark:from-[#1a2060] dark:to-[#0e1540] dark:shadow-[0_0_16px_rgba(99,130,255,0.2)]">
                            <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg border border-blue-400 bg-blue-100 dark:border-blue-500/60 dark:bg-blue-500/20">
                                <ClipboardList className="h-5 w-5 text-blue-600 dark:text-indigo-300" />
                            </div>
                            <div className="flex min-w-0 flex-col">
                                <span className="truncate font-['Oxanium'] text-sm font-bold text-[#1e3a8a] dark:text-white">
                                    Assignments
                                </span>
                            </div>
                            <div className="absolute top-2 bottom-2 left-0 w-[3px] rounded-full bg-gradient-to-b from-[#2563EB] to-[#6366f1] dark:from-[#99E4FD] dark:to-[#9681FF]" />
                        </div>
                    </div>
                </div>

                {/* MOBILE BANNER */}
                <div className="flex-shrink-0 md:hidden">
                    <div className="flex w-full items-center justify-between rounded-xl border border-blue-200 bg-white px-4 py-3 shadow-sm dark:border-blue-500/30 dark:bg-gradient-to-r dark:from-[#0d1229] dark:to-[#080d1e]">
                        <div className="flex items-center gap-2">
                            <ClipboardList className="h-4 w-4 text-blue-500 dark:text-blue-400" />
                            <span className="font-['Orbitron'] text-xs font-bold tracking-[0.2em] text-blue-500 uppercase dark:text-gray-400">
                                Assignments
                            </span>
                        </div>
                    </div>
                </div>

                {/* ================= CONTENT AREA (SCROLLABLE, NO OUTER CARD) ================= */}
                <div className="scrollbar-thin scrollbar-track-transparent scrollbar-thumb-blue-200 flex min-h-0 flex-1 flex-col gap-6 overflow-y-auto rounded-xl border border-blue-200 bg-white p-6 shadow-sm md:p-8 dark:border-blue-500/30 dark:bg-gradient-to-b dark:from-[#0d1229] dark:to-[#080d1e] dark:shadow-none dark:scrollbar-thumb-blue-500/30">
                    {submissions.length === 0 ? (
                        <div className="flex flex-1 flex-col items-center justify-center py-16 text-center">
                            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl border border-blue-200 bg-blue-50 dark:border-blue-500/30 dark:bg-blue-500/10">
                                <ClipboardList className="h-8 w-8 text-blue-500 dark:text-blue-400" />
                            </div>
                            <h3 className="mb-2 font-['Orbitron'] text-lg font-bold text-[#1e3a8a] dark:text-white">
                                No Assignments Yet
                            </h3>
                            <p className="max-w-md font-['Oxanium'] text-sm text-slate-500 dark:text-gray-400">
                                Your mentor hasn't published any assignments for this module yet.
                                Check back later!
                            </p>
                        </div>
                    ) : (
                        <div className="flex flex-col divide-y divide-blue-100 dark:divide-blue-500/15">
                            {submissions.map((submission) => {
                                const status = getStatusInfo(submission);
                                const isSubmitted =
                                    studentSubmissions[
                                        submission.id || (submission._id as string)
                                    ];
                                const submissionId = submission.id || submission._id;
                                const isExpanded = expandedCardId === submissionId;

                                return (
                                    <div key={submissionId} className="py-6 first:pt-0 last:pb-0">
                                        {/* Evaluation info if graded */}
                                        {isSubmitted && isSubmitted.status === 'graded' && (
                                            <div className="mb-4 flex flex-col gap-4 rounded-xl border border-emerald-300 bg-emerald-50/60 p-4 md:flex-row md:items-center dark:border-emerald-500/30 dark:bg-emerald-500/10">
                                                <div className="flex shrink-0 items-center gap-3">
                                                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-100 dark:bg-emerald-500/20">
                                                        <CheckCircle2 className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
                                                    </div>
                                                    <div>
                                                        <span className="font-['Orbitron'] text-2xl font-black text-emerald-600 dark:text-emerald-400">
                                                            {isSubmitted.grade}
                                                        </span>
                                                        <span className="ml-2 text-xs font-bold uppercase tracking-widest text-slate-400">
                                                            Score
                                                        </span>
                                                    </div>
                                                </div>
                                                <div className="flex-1 md:border-l md:border-emerald-200 md:pl-4 dark:md:border-emerald-500/20">
                                                    <h4 className="font-['Orbitron'] text-sm font-bold text-emerald-900 dark:text-emerald-300">
                                                        Mentor Feedback:
                                                    </h4>
                                                    <p className="font-['Oxanium'] text-xs leading-relaxed text-emerald-800 italic dark:text-emerald-200/80">
                                                        "{isSubmitted.feedback || 'No written feedback provided.'}"
                                                    </p>
                                                </div>
                                                {isSubmitted.certificate_url && (
                                                    <a
                                                        href={isSubmitted.certificate_url}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="inline-flex items-center gap-2 self-start rounded-lg bg-emerald-600 px-4 py-2 text-xs font-bold text-white shadow transition-colors hover:bg-emerald-500 md:self-center"
                                                    >
                                                        <ClipboardList className="h-4 w-4" /> View Certificate
                                                    </a>
                                                )}
                                            </div>
                                        )}

                                        {/* Main Item Row Header */}
                                        <div
                                            className="cursor-pointer transition-colors hover:opacity-90"
                                            onClick={() => toggleCard(submissionId as string)}
                                        >
                                            <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
                                                <div className="flex-1">
                                                    <div className="mb-2 flex flex-wrap items-center gap-2">
                                                        <div
                                                            className={`inline-flex items-center gap-1.5 rounded-md border px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider ${status.color}`}
                                                        >
                                                            {status.icon}
                                                            {status.label}
                                                        </div>
                                                        <span className="rounded-md bg-blue-50 px-2.5 py-1 font-['Oxanium'] text-[10px] font-bold uppercase tracking-wider text-blue-600 dark:bg-blue-500/10 dark:text-blue-400">
                                                            {submission.submission_type} FORMAT
                                                        </span>
                                                    </div>
                                                    <h3 className="font-['Orbitron'] text-lg font-extrabold text-[#1e3a8a] transition-colors md:text-xl dark:text-white">
                                                        {submission.title}
                                                    </h3>
                                                </div>

                                                <div className="flex items-center gap-4">
                                                    <div className="flex flex-col items-start md:items-end">
                                                        <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
                                                            Deadline 
                                                        </span>
                                                        <span className="flex items-center gap-1.5 font-['Oxanium'] text-xs font-medium text-slate-700 dark:text-gray-300">
                                                            <Calendar className="h-3.5 w-3.5 text-amber-500 dark:text-amber-400" />
                                                            {submission.deadline
                                                                ? new Date(submission.deadline).toLocaleDateString(
                                                                      'en-US',
                                                                      {
                                                                          month: 'short',
                                                                          day: 'numeric',
                                                                          hour: '2-digit',
                                                                          minute: '2-digit',
                                                                      },
                                                                  )
                                                                : 'No Deadline'}
                                                        </span>
                                                    </div>
                                                    <div className="rounded-lg border border-blue-200 bg-blue-50 p-2 text-blue-600 dark:border-blue-500/30 dark:bg-blue-500/20 dark:text-blue-400">
                                                        <svg
                                                            className={`h-4 w-4 transform transition-transform duration-300 ${
                                                                isExpanded ? 'rotate-180' : ''
                                                            }`}
                                                            fill="none"
                                                            viewBox="0 0 24 24"
                                                            stroke="currentColor"
                                                        >
                                                            <path
                                                                strokeLinecap="round"
                                                                strokeLinejoin="round"
                                                                strokeWidth={2}
                                                                d="M19 9l-7 7-7-7"
                                                            />
                                                        </svg>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

{/* Expandable Details */}
<div
    className={`transition-all duration-300 ease-in-out ${
        isExpanded
            ? 'mt-4 max-h-[1000px] opacity-100'
            : 'max-h-0 overflow-hidden opacity-0'
    }`}
>
    <div className="rounded-xl border border-blue-100 bg-[#f8faff] p-3 sm:p-4 md:p-5 dark:border-blue-500/20 dark:bg-white/5">
        <p className="whitespace-pre-line font-['Oxanium'] text-sm sm:text-base md:text-lg 2xl:text-xl leading-relaxed text-slate-700 dark:text-gray-300">
            {submission.description}
        </p>

        {submission.attachment && (
            <div className="mt-3 sm:mt-4">
                <a
                    href={`/storage/${submission.attachment}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 sm:gap-2 rounded-lg border border-blue-300 bg-blue-50 px-3 sm:px-4 py-1.5 sm:py-2 text-[11px] sm:text-xs font-bold text-blue-700 transition-colors hover:bg-blue-100 dark:border-blue-500/40 dark:bg-blue-500/20 dark:text-blue-300 dark:hover:bg-blue-500/30"
                >
                    <ClipboardList className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                    Download Reference Material
                </a>
            </div>
        )}

        <div className="mt-4 sm:mt-6 flex justify-end">
            <Link
                href={`/student/submissions/${submissionId}`}
                className={`inline-flex items-center justify-center gap-1.5 sm:gap-2 rounded-xl px-4 sm:px-6 py-2 sm:py-2.5 text-[11px] sm:text-xs font-bold uppercase tracking-wider transition-all ${
                    isSubmitted
                        ? 'border border-blue-300 bg-white text-blue-700 hover:bg-blue-50 dark:border-blue-500/40 dark:bg-blue-950 dark:text-blue-300 dark:hover:bg-blue-900/50'
                        : 'bg-blue-600 text-white shadow-md shadow-blue-600/20 hover:bg-blue-700'
                }`}
            >
                <span>
                    {isSubmitted
                        ? 'View Workspace'
                        : 'Open Workspace to Submit'}
                </span>
                <ArrowRight className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
            </Link>
        </div>
    </div>
</div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}