import AppLayout from '@/layouts/app-layout';
import { useForm, Link } from '@inertiajs/react';
import {
    ArrowLeft, Calendar, FileText, Link as LinkIcon,
    CheckCircle2, MessageSquare, Download, User, Star, Award, ChevronRight
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
                                href={`/mentor/submissions/${studentSubmission.submission_id}`}
                                className="flex items-center justify-center w-10 h-10 rounded-xl bg-slate-50 hover:bg-slate-100 dark:bg-slate-900 text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white border border-slate-200 dark:border-slate-850 transition-all shadow-sm"
                            >
                                <ArrowLeft className="w-5 h-5" />
                            </Link>
                            <div>
                                <div className="flex items-center gap-2 mb-1">
                                    <span className="text-xs font-bold uppercase tracking-widest text-indigo-600 dark:text-indigo-400">
                                        {studentSubmission.submission.group?.name || 'Project'}
                                    </span>
                                    <ChevronRight className="w-3 h-3 text-slate-400 dark:text-slate-600" />
                                    <span className="text-xs font-bold uppercase tracking-widest text-slate-500">
                                        Student Review
                                    </span>
                                </div>
                                <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight flex items-center gap-3">
                                    {studentSubmission.submission.title}
                                </h1>
                            </div>
                        </div>
                        {isGraded && (
                            <div className="flex items-center gap-2 px-4 py-2 bg-emerald-50 border border-emerald-250 dark:bg-emerald-500/10 dark:border-emerald-500/20 rounded-xl shadow-sm">
                                <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-450" />
                                <span className="text-sm font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400">
                                    Graded
                                </span>
                            </div>
                        )}
                    </div>
                </div>

                <div className="grid lg:grid-cols-12 gap-6 items-start">
                    
                    {/* LEFT COLUMN - CONTENT */}
                    <div className="lg:col-span-7 xl:col-span-8 space-y-6">
                        
                        {/* STUDENT PROFILE CARD */}
                        <div className="relative overflow-hidden rounded-xl border border-slate-200 p-6 shadow-sm dark:border-slate-800">
                            <div className="absolute inset-0 bg-white dark:bg-gradient-to-b dark:from-[#0e0e1a] dark:to-[#090910]" />
                            <div className="absolute top-0 right-8 left-8 h-px bg-gradient-to-r from-transparent via-slate-300 to-transparent dark:via-slate-700" />

                            <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                                <div className="flex items-center gap-5">
                                    <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-650 flex items-center justify-center text-white font-black text-2xl shadow-md shrink-0">
                                        {studentSubmission.student.name.charAt(0)}
                                    </div>
                                    <div>
                                        <h2 className="text-xl font-extrabold text-slate-900 dark:text-white mb-1">
                                            {studentSubmission.student.name}
                                        </h2>
                                        <div className="flex items-center gap-2 text-sm text-slate-550 dark:text-slate-400 font-medium">
                                            <User className="w-4 h-4 text-slate-400 dark:text-slate-550" />
                                            {studentSubmission.student.email}
                                        </div>
                                    </div>
                                </div>
                                <div className="flex flex-col sm:items-end gap-1">
                                    <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-450">
                                        Submitted At
                                    </span>
                                    <div className="flex items-center gap-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 px-3 py-1.5 rounded-xl text-sm text-slate-700 dark:text-slate-300 font-semibold shadow-sm">
                                        <Calendar className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                                        {new Date(studentSubmission.created_at).toLocaleString('en-GB', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* STUDENT'S WORK */}
                        <div className="relative overflow-hidden rounded-xl border border-slate-200 p-6 sm:p-8 shadow-sm dark:border-slate-800">
                            <div className="absolute inset-0 bg-white dark:bg-gradient-to-b dark:from-[#0e0e1a] dark:to-[#090910]" />
                            <div className="absolute top-0 right-8 left-8 h-px bg-gradient-to-r from-transparent via-slate-300 to-transparent dark:via-slate-700" />
                            
                            <div className="relative z-10">
                                <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-200 dark:border-slate-800/60">
                                    <div className="p-2 bg-indigo-500/10 rounded-lg">
                                        <FileText className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                                    </div>
                                    <h3 className="text-xl font-bold text-slate-900 dark:text-white tracking-wide">
                                        Student's Work
                                    </h3>
                                </div>

                                <div className="space-y-6">
                                    {studentSubmission.link && (
                                        <div className="bg-slate-50/50 dark:bg-slate-950/40 border border-slate-200 dark:border-slate-850 rounded-xl p-5 shadow-sm">
                                            <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-3 block">
                                                Project / Repository Link
                                            </label>
                                            <a
                                                href={studentSubmission.link}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="group flex items-center justify-between p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 hover:bg-slate-50 dark:hover:bg-slate-900/60 hover:border-slate-350 dark:hover:border-slate-700 transition-all shadow-sm"
                                            >
                                                <div className="flex items-center gap-4 truncate">
                                                    <div className="p-2.5 bg-indigo-50 dark:bg-indigo-950/50 rounded-lg text-indigo-600 dark:text-indigo-400 group-hover:text-white group-hover:bg-indigo-600 transition-colors">
                                                        <LinkIcon className="w-5 h-5" />
                                                    </div>
                                                    <span className="text-indigo-600 dark:text-indigo-400 group-hover:text-indigo-700 dark:group-hover:text-indigo-300 font-bold truncate text-sm sm:text-base">
                                                        {studentSubmission.link}
                                                    </span>
                                                </div>
                                                <ArrowLeft className="w-5 h-5 text-indigo-500 group-hover:text-indigo-650 rotate-135 transition-colors shrink-0" />
                                            </a>
                                        </div>
                                    )}

                                    {studentSubmission.file_path && (
                                        <div className="bg-slate-50/50 dark:bg-slate-950/40 border border-slate-200 dark:border-slate-850 rounded-xl p-5 shadow-sm">
                                            <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-3 block">
                                                Attached Document
                                            </label>
                                            <a
                                                href={`/storage/${studentSubmission.file_path}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="group flex items-center justify-between p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 hover:bg-slate-50 dark:hover:bg-slate-900/60 hover:border-slate-350 dark:hover:border-slate-700 transition-all shadow-sm"
                                            >
                                                <div className="flex items-center gap-4 truncate">
                                                    <div className="p-2.5 bg-blue-50 dark:bg-blue-950/50 rounded-lg text-blue-600 dark:text-blue-400 group-hover:text-white group-hover:bg-blue-600 transition-colors shrink-0">
                                                        <Download className="w-5 h-5" />
                                                    </div>
                                                    <span className="text-blue-600 dark:text-blue-400 group-hover:text-blue-700 dark:group-hover:text-blue-300 font-bold truncate text-sm sm:text-base">
                                                        Download Submission File
                                                    </span>
                                                </div>
                                                <ArrowLeft className="w-5 h-5 text-blue-500 group-hover:text-blue-650 rotate-135 transition-colors shrink-0" />
                                            </a>
                                        </div>
                                    )}

                                    {studentSubmission.notes && (
                                        <div className="bg-slate-50/50 dark:bg-slate-950/40 border border-slate-200 dark:border-slate-850 rounded-xl p-5 shadow-sm">
                                            <label className="flex items-center gap-2 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-3">
                                                <MessageSquare className="w-4 h-4 text-slate-400" /> Student's Note
                                            </label>
                                            <div className="p-4 rounded-xl bg-white dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 whitespace-pre-wrap leading-relaxed font-medium italic">
                                                "{studentSubmission.notes}"
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* ASSIGNMENT REFERENCE */}
                        <div className="relative overflow-hidden rounded-xl border border-slate-200 p-6 sm:p-8 shadow-sm dark:border-slate-800">
                            <div className="absolute inset-0 bg-white dark:bg-gradient-to-b dark:from-[#0e0e1a] dark:to-[#090910]" />
                            <div className="absolute top-0 right-8 left-8 h-px bg-gradient-to-r from-transparent via-slate-300 to-transparent dark:via-slate-700" />
                            
                            <div className="relative z-10">
                                <h3 className="text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-5 flex items-center gap-2">
                                    <FileText className="w-4 h-4 text-slate-450 dark:text-slate-500" /> Assignment Instructions
                                </h3>
                                <div className="bg-slate-50/50 dark:bg-slate-950/40 border border-slate-200 dark:border-slate-850 p-5 rounded-xl shadow-sm">
                                    <p className="text-slate-700 dark:text-slate-300 whitespace-pre-wrap leading-loose font-medium text-sm">
                                        {studentSubmission.submission.description}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* RIGHT COLUMN - GRADING */}
                    <div className="lg:col-span-5 xl:col-span-4">
                        <div className="relative overflow-hidden rounded-xl border border-indigo-100 dark:border-slate-800 p-6 sm:p-8 shadow-md sticky top-8">
                            <div className="absolute inset-0 bg-white dark:bg-gradient-to-b dark:from-[#0e0e1a] dark:to-[#090910]" />
                            <div className="absolute top-0 right-8 left-8 h-px bg-gradient-to-r from-transparent via-indigo-200 to-transparent dark:via-slate-700" />

                            <div className="relative z-10">
                                <div className="flex items-center gap-3 mb-8 border-b border-slate-200 dark:border-slate-800 pb-5">
                                    <div className="p-2.5 bg-gradient-to-br from-indigo-500 to-purple-650 rounded-xl shadow-md">
                                        <Award className="w-6 h-6 text-white" />
                                    </div>
                                    <h2 className="text-xl font-extrabold text-slate-900 dark:text-white tracking-wide">
                                        Evaluation
                                    </h2>
                                </div>

                                <form onSubmit={submit} className="space-y-8">
                                    
                                    {/* SCORE INPUT */}
                                    <div className="bg-slate-50/50 dark:bg-slate-950/40 border border-slate-200 dark:border-slate-850 p-5 rounded-xl shadow-sm">
                                        <div className="flex flex-col items-center justify-center gap-3 mb-5">
                                            <label className="text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">
                                                Final Score
                                            </label>
                                            {/* STARS */}
                                            <div className="flex gap-1.5 bg-white dark:bg-slate-950 py-2 px-4 rounded-full border border-slate-200 dark:border-slate-800 shadow-sm">
                                                {[1, 2, 3, 4, 5].map((star) => (
                                                    <Star
                                                        key={star}
                                                        className={`w-6 h-6 ${star <= stars
                                                            ? 'fill-yellow-400 text-yellow-400 drop-shadow-[0_0_12px_rgba(250,204,21,0.6)]'
                                                            : 'text-slate-300 dark:text-slate-700'
                                                            } transition-all duration-500`}
                                                    />
                                                ))}
                                            </div>
                                        </div>

                                        <div className="relative max-w-[200px] mx-auto">
                                            <input
                                                type="number"
                                                min="0"
                                                max="100"
                                                required
                                                value={data.grade === 0 && !isGraded ? '' : data.grade}
                                                onChange={e => setData('grade', parseInt(e.target.value) || 0)}
                                                className="w-full bg-white dark:bg-slate-950 border-2 border-indigo-100 dark:border-slate-800 rounded-xl px-4 py-5 text-5xl font-black text-center text-emerald-600 dark:text-emerald-400 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition-all placeholder-slate-300 dark:placeholder-slate-800"
                                                placeholder="0"
                                            />
                                        </div>
                                        {errors.grade && <p className="text-rose-500 font-bold text-xs mt-3 text-center">{errors.grade}</p>}
                                    </div>

                                    {/* FEEDBACK */}
                                    <div className="bg-slate-50/50 dark:bg-slate-950/40 border border-slate-200 dark:border-slate-850 p-5 rounded-xl shadow-sm">
                                        <label className="flex items-center gap-2 text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-4">
                                            <MessageSquare className="w-4 h-4 text-slate-400" /> Mentor Feedback
                                        </label>
                                        <textarea
                                            rows={7}
                                            required
                                            placeholder="Provide constructive feedback, highlight what was done well, and suggest areas for improvement..."
                                            value={data.feedback}
                                            onChange={e => setData('feedback', e.target.value)}
                                            className="w-full bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-4 text-slate-850 dark:text-slate-200 placeholder-slate-400 dark:placeholder-slate-700 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition-all resize-none text-sm font-medium"
                                        />
                                        {errors.feedback && <p className="text-rose-550 font-bold text-xs mt-2">{errors.feedback}</p>}
                                    </div>

                                    {/* SUBMIT BUTTON */}
                                    <div className="pt-2">
                                        <button
                                            type="submit"
                                            disabled={processing}
                                            className={`w-full flex justify-center items-center gap-2 py-4 rounded-xl font-extrabold text-sm uppercase tracking-widest transition-all duration-300 shadow-md active:scale-[0.98]
                                                ${processing 
                                                    ? 'bg-slate-100 text-slate-400 dark:bg-slate-850 dark:text-slate-600 border border-slate-250 dark:border-slate-800 cursor-not-allowed'
                                                    : 'bg-indigo-650 hover:bg-indigo-600 text-white hover:shadow-lg hover:shadow-indigo-550/20 border border-indigo-650 hover:border-indigo-600'
                                                }`}
                                        >
                                            {processing ? 'Processing...' : (isGraded ? 'Update Review' : 'Submit Review')}
                                        </button>

                                        {isGraded && (
                                            <p className="text-xs text-center text-emerald-600 dark:text-emerald-500 font-bold mt-4 px-2">
                                                This submission has been graded. Submitting again will update the existing grade and regenerate the certificate.
                                            </p>
                                        )}
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </AppLayout>
    );
}