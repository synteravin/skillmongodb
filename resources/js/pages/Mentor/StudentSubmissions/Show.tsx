import AppLayout from '@/layouts/app-layout';
import { useForm, Link } from '@inertiajs/react';
import {
    ArrowLeft, Calendar, FileText, Link as LinkIcon,
    CheckCircle2, MessageSquare, Download, User, Star, Award, ChevronRight, Send
} from 'lucide-react';
import { FormEventHandler, useState, useEffect } from 'react';

interface Student {
    name: string;
    email: string;
}

interface CareerGroup {
    name: string;
}

interface Submission {
    title: string;
    description: string;
    submission_type: string;
    deadline?: string;
    group?: CareerGroup;
}

interface StudentSubmission {
    id: string;
    _id?: string;
    submission_id: string;
    file_path?: string;
    link?: string;
    notes?: string;
    status: string;
    grade?: number;
    feedback?: string;
    created_at: string;
    student: Student;
    submission: Submission;
}

interface Props {
    studentSubmission: StudentSubmission;
}

export default function Show({ studentSubmission }: Props) {
    const isGraded = studentSubmission.status === 'graded';

    const { data, setData, put, processing, errors } = useForm({
        grade: studentSubmission.grade || 0,
        feedback: studentSubmission.feedback || ''
    });

    const [stars, setStars] = useState(0);

    useEffect(() => {
        const calculateStars = (grade: number) => {
            if (grade === 0) return 0;
            if (grade <= 20) return 1;
            if (grade <= 40) return 2;
            if (grade <= 60) return 3;
            if (grade <= 80) return 4;
            return 5;
        };
        setStars(calculateStars(data.grade));
    }, [data.grade]);

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        const subId = studentSubmission.id || studentSubmission._id;
        put(`/mentor/student-submissions/${subId}/grade`);
    };

    const studentInitials = studentSubmission.student.name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .substring(0, 2)
        .toUpperCase();

    return (
        <AppLayout>
            <div className="w-full mx-auto space-y-6 p-4 sm:p-6 lg:p-8 max-w-7xl text-slate-800 dark:text-slate-100" style={{ fontFamily: "'Outfit', sans-serif" }}>

                {/* BREADCRUMB & HEADER */}
                <div className="relative overflow-hidden rounded-xl border border-slate-200 p-6 shadow-sm dark:border-slate-800">
                    <div className="absolute inset-0 bg-white dark:bg-gradient-to-b dark:from-[#0e0e1a] dark:to-[#090910]" />
                    <div className="absolute top-0 right-8 left-8 h-px bg-gradient-to-r from-transparent via-slate-300 to-transparent dark:via-slate-700" />

                    <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div className="flex items-center gap-4">
                            <Link
                                href="/mentor/dashboard"
                                className="flex items-center justify-center w-10 h-10 rounded-xl bg-slate-50 hover:bg-slate-100 dark:bg-slate-900 text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white border border-slate-200 dark:border-slate-800 transition-all shadow-sm shrink-0"
                            >
                                <ArrowLeft className="w-5 h-5" />
                            </Link>
                            <div>
                                <div className="flex items-center gap-2 mb-1 flex-wrap">
                                    <span className="text-xs font-bold uppercase tracking-widest text-indigo-600 dark:text-indigo-400">
                                        {studentSubmission.submission.group?.name || 'Project'}
                                    </span>
                                    <ChevronRight className="w-3 h-3 text-slate-400 dark:text-slate-600 shrink-0" />
                                    <span className="text-xs font-bold uppercase tracking-widest text-slate-500">
                                        Submission Assessment
                                    </span>
                                </div>
                                <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight flex items-center gap-3">
                                    {studentSubmission.submission.title}
                                </h1>
                            </div>
                        </div>
                        {isGraded && (
                            <div className="flex items-center gap-2 px-4 py-2 bg-emerald-50 border border-emerald-200 dark:bg-emerald-500/10 dark:border-emerald-500/20 rounded-xl shadow-sm self-start sm:self-auto shrink-0">
                                <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                                <span className="text-sm font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400">
                                    Graded
                                </span>
                            </div>
                        )}
                    </div>
                </div>

                {/* MAIN CONTAINER */}
                <div className="space-y-6">

                    {/* STUDENT WORK & SUBMISSION ARTIFACTS CARD */}
                    <div className="relative overflow-hidden rounded-xl border border-slate-200 p-6 sm:p-8 shadow-sm dark:border-slate-800">
                        <div className="absolute inset-0 bg-white dark:bg-gradient-to-b dark:from-[#0e0e1a] dark:to-[#090910]" />
                        <div className="absolute top-0 right-8 left-8 h-px bg-gradient-to-r from-transparent via-slate-300 to-transparent dark:via-slate-700" />

                        <div className="relative z-10 space-y-6">

                            {/* Student Profile Row */}
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 pb-6 border-b border-slate-200/80 dark:border-slate-800/80">
                                <div className="flex items-center gap-4">
                                    <div className="w-14 h-14 rounded-full bg-gradient-to-tr from-indigo-600 to-violet-500 flex items-center justify-center text-white font-black text-xl shadow-md shrink-0">
                                        {studentInitials}
                                    </div>
                                    <div>
                                        <h2 className="text-xl font-extrabold text-slate-900 dark:text-white mb-0.5">
                                            {studentSubmission.student.name}
                                        </h2>
                                        <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400 font-medium">
                                            <User className="w-4 h-4 text-slate-400 shrink-0" />
                                            {studentSubmission.student.email}
                                        </div>
                                    </div>
                                </div>
                                <div className="flex flex-col sm:items-end gap-1">
                                    <span className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                                        Submitted Timestamp
                                    </span>
                                    <div className="flex items-center gap-2 bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 px-3.5 py-1.5 rounded-xl text-sm text-slate-700 dark:text-slate-300 font-semibold shadow-sm w-fit">
                                        <Calendar className="w-4 h-4 text-indigo-600 dark:text-indigo-400 shrink-0" />
                                        {new Date(studentSubmission.created_at).toLocaleString('en-GB', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                                    </div>
                                </div>
                            </div>

                            {/* Submitted Links and Attachments */}
                            <div>
                                <div className="flex items-center gap-3 mb-6">
                                    <div className="p-2 bg-indigo-500/10 rounded-lg">
                                        <FileText className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                                    </div>
                                    <h3 className="text-lg font-bold text-slate-900 dark:text-white tracking-wide">
                                        Submitted Assets & Notes
                                    </h3>
                                </div>

                                <div className="grid md:grid-cols-2 gap-4">
                                    {studentSubmission.link && (
                                        <div className="bg-slate-50/60 dark:bg-slate-950/40 border border-slate-200/80 dark:border-slate-800/80 rounded-xl p-4 sm:p-5 shadow-sm flex flex-col justify-between gap-3">
                                            <div>
                                                <label className="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-2 block">
                                                    Project / Repository Link
                                                </label>
                                            </div>
                                            <a
                                                href={studentSubmission.link}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="group flex items-center justify-between p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:bg-indigo-50/50 dark:hover:bg-slate-850 hover:border-indigo-300 dark:hover:border-slate-700 transition-all shadow-sm"
                                            >
                                                <div className="flex items-center gap-3 truncate">
                                                    <div className="p-2 bg-indigo-50 dark:bg-indigo-950/50 rounded-lg text-indigo-600 dark:text-indigo-400 group-hover:bg-indigo-600 group-hover:text-white transition-colors shrink-0">
                                                        <LinkIcon className="w-4 h-4" />
                                                    </div>
                                                    <span className="text-indigo-600 dark:text-indigo-400 font-bold truncate text-sm">
                                                        {studentSubmission.link}
                                                    </span>
                                                </div>
                                                <ArrowLeft className="w-4 h-4 text-indigo-500 rotate-135 shrink-0 ml-2" />
                                            </a>
                                        </div>
                                    )}

                                    {studentSubmission.file_path && (
                                        <div className="bg-slate-50/60 dark:bg-slate-950/40 border border-slate-200/80 dark:border-slate-800/80 rounded-xl p-4 sm:p-5 shadow-sm flex flex-col justify-between gap-3">
                                            <div>
                                                <label className="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-2 block">
                                                    Attached Document
                                                </label>
                                            </div>
                                            <a
                                                href={`/storage/${studentSubmission.file_path}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="group flex items-center justify-between p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:bg-blue-50/50 dark:hover:bg-slate-850 hover:border-blue-300 dark:hover:border-slate-700 transition-all shadow-sm"
                                            >
                                                <div className="flex items-center gap-3 truncate">
                                                    <div className="p-2 bg-blue-50 dark:bg-blue-950/50 rounded-lg text-blue-600 dark:text-blue-400 group-hover:bg-blue-600 group-hover:text-white transition-colors shrink-0">
                                                        <Download className="w-4 h-4" />
                                                    </div>
                                                    <span className="text-blue-600 dark:text-blue-400 font-bold truncate text-sm">
                                                        Download Submission File
                                                    </span>
                                                </div>
                                                <ArrowLeft className="w-4 h-4 text-blue-500 rotate-135 shrink-0 ml-2" />
                                            </a>
                                        </div>
                                    )}
                                </div>

                                {studentSubmission.notes && (
                                    <div className="mt-4 bg-slate-50/60 dark:bg-slate-950/40 border border-slate-200/80 dark:border-slate-800/80 rounded-xl p-5 shadow-sm">
                                        <label className="flex items-center gap-2 text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-2">
                                            <MessageSquare className="w-4 h-4 text-slate-400" /> Student's Note
                                        </label>
                                        <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 whitespace-pre-wrap leading-relaxed text-sm font-medium italic">
                                            "{studentSubmission.notes}"
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* EVALUATION & MENTOR FEEDBACK SECTION (MAIN PROMINENT AREA) */}
                    <div className="relative overflow-hidden rounded-xl border border-indigo-200 dark:border-indigo-900/40 p-6 sm:p-8 shadow-md">
                        <div className="absolute inset-0 bg-white dark:bg-gradient-to-b dark:from-[#0e0e1a] dark:to-[#090910]" />
                        <div className="absolute top-0 right-8 left-8 h-px bg-gradient-to-r from-transparent via-indigo-400 dark:via-indigo-600 to-transparent" />

                        <div className="relative z-10">
                            <div className="flex items-center gap-3.5 mb-8 pb-5 border-b border-slate-200 dark:border-slate-800">
                                <div className="p-3 bg-gradient-to-br from-indigo-600 to-violet-600 rounded-xl shadow-md text-white">
                                    <Award className="w-6 h-6" />
                                </div>
                                <div>
                                    <h2 className="text-xl font-extrabold text-slate-900 dark:text-white tracking-wide">
                                        Reviewer Evaluation & Feedback
                                    </h2>
                                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                                        Provide a score and structured feedback for the student's submission.
                                    </p>
                                </div>
                            </div>

                            <form onSubmit={submit} className="space-y-6">
                                <div className="grid lg:grid-cols-12 gap-6 items-start">
                                    
                                    {/* SCORE & STAR RATING (LEFT/TOP SIDEBAR IN GRID) */}
                                    <div className="lg:col-span-4 bg-slate-50/80 dark:bg-slate-950/50 border border-slate-200 dark:border-slate-800 p-6 rounded-2xl shadow-sm space-y-6">
                                        <div className="text-center">
                                            <label className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest block mb-3">
                                                Final Score (0 - 100)
                                            </label>
                                            
                                            {/* Numeric Input */}
                                            <div className="relative max-w-[160px] mx-auto">
                                                <input
                                                    type="number"
                                                    min="0"
                                                    max="100"
                                                    required
                                                    value={data.grade === 0 && !isGraded ? '' : data.grade}
                                                    onChange={e => setData('grade', parseInt(e.target.value) || 0)}
                                                    className="w-full bg-white dark:bg-slate-900 border-2 border-indigo-200 dark:border-indigo-900/60 rounded-2xl px-4 py-4 text-4xl font-black text-center text-indigo-600 dark:text-indigo-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all placeholder-slate-300 dark:placeholder-slate-700 shadow-inner"
                                                    placeholder="0"
                                                />
                                            </div>
                                            {errors.grade && <p className="text-rose-500 font-bold text-xs mt-2">{errors.grade}</p>}
                                        </div>

                                        {/* Dynamic Stars */}
                                        <div className="flex flex-col items-center justify-center pt-2 border-t border-slate-200/80 dark:border-slate-800/80">
                                            <span className="text-[11px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-2">
                                                Rating Tier
                                            </span>
                                            <div className="flex gap-1.5 bg-white dark:bg-slate-900 py-2.5 px-4 rounded-full border border-slate-200 dark:border-slate-800 shadow-sm">
                                                {[1, 2, 3, 4, 5].map((star) => (
                                                    <Star
                                                        key={star}
                                                        className={`w-5 h-5 ${star <= stars
                                                            ? 'fill-amber-400 text-amber-400 drop-shadow-[0_0_10px_rgba(251,191,36,0.6)]'
                                                            : 'text-slate-300 dark:text-slate-700'
                                                            } transition-all duration-300`}
                                                    />
                                                ))}
                                            </div>
                                        </div>
                                    </div>

                                    {/* MENTOR FEEDBACK TEXTAREA (RIGHT/MAIN MAIN CONTENT AREA) */}
                                    <div className="lg:col-span-8 bg-slate-50/80 dark:bg-slate-950/50 border border-slate-200 dark:border-slate-800 p-6 rounded-2xl shadow-sm flex flex-col justify-between min-h-[260px]">
                                        <div>
                                            <label className="flex items-center gap-2 text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-3">
                                                <MessageSquare className="w-4 h-4 text-indigo-500" /> Detailed Mentor Feedback
                                            </label>
                                            <textarea
                                                rows={8}
                                                required
                                                placeholder="Provide detailed, constructive feedback for the student. Highlight key strengths, note areas for technical improvement, and offer actionable guidance..."
                                                value={data.feedback}
                                                onChange={e => setData('feedback', e.target.value)}
                                                className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-4 text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-600 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all resize-none text-sm font-medium leading-relaxed"
                                            />
                                            {errors.feedback && <p className="text-rose-500 font-bold text-xs mt-2">{errors.feedback}</p>}
                                        </div>
                                    </div>
                                </div>

                                {/* ACTION BUTTON BAR */}
                                <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-slate-200 dark:border-slate-800">
                                    <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                                        {isGraded ? (
                                            <span className="text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1.5">
                                                <CheckCircle2 className="w-4 h-4" />
                                                Submitting will update the existing grade and regenerate the student certificate.
                                            </span>
                                        ) : (
                                            <span>Submitting will finalize evaluation and automatically issue the certificate to the student.</span>
                                        )}
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={processing}
                                        className={`w-full sm:w-auto px-8 py-3.5 rounded-xl font-bold text-sm uppercase tracking-wider transition-all duration-300 shadow-md flex items-center justify-center gap-2.5 cursor-pointer active:scale-[0.99] shrink-0
                                            ${processing 
                                                ? 'bg-slate-200 text-slate-400 dark:bg-slate-800 dark:text-slate-600 cursor-not-allowed border border-slate-300 dark:border-slate-700'
                                                : 'bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-600 dark:hover:bg-indigo-500 text-white shadow-indigo-500/20 border border-indigo-600 dark:border-indigo-500'
                                            }`}
                                    >
                                        <Send className="w-4 h-4" />
                                        <span>{processing ? 'Processing...' : (isGraded ? 'Update Review' : 'Submit Review')}</span>
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>

                </div>
            </div>
        </AppLayout>
    );
}