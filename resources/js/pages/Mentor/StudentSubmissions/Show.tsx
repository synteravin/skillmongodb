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
            <div className="w-full mx-auto space-y-6 p-4 sm:p-6 lg:p-8 max-w-7xl font-sans text-slate-200">
                
                {/* BREADCRUMB & HEADER */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#0B1021] border border-slate-800 p-6 rounded-2xl shadow-xl">
                    <div className="flex items-center gap-4">
                        <Link
                            href={`/mentor/submissions/${studentSubmission.submission_id}`}
                            className="flex items-center justify-center w-10 h-10 rounded-xl bg-slate-800 text-slate-300 hover:bg-indigo-600 hover:text-white border border-slate-700 hover:border-indigo-500 transition-all shadow-md"
                        >
                            <ArrowLeft className="w-5 h-5" />
                        </Link>
                        <div>
                            <div className="flex items-center gap-2 mb-1">
                                <span className="text-xs font-bold uppercase tracking-widest text-indigo-400">
                                    {studentSubmission.submission.group?.name || 'Project'}
                                </span>
                                <ChevronRight className="w-3 h-3 text-slate-600" />
                                <span className="text-xs font-bold uppercase tracking-widest text-slate-500">
                                    Student Review
                                </span>
                            </div>
                            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center gap-3">
                                {studentSubmission.submission.title}
                            </h1>
                        </div>
                    </div>
                    {isGraded && (
                        <div className="flex items-center gap-2 px-4 py-2 bg-[#064E3B] border border-[#059669] rounded-xl shadow-[0_0_15px_rgba(5,150,105,0.2)]">
                            <CheckCircle2 className="w-5 h-5 text-[#34D399]" />
                            <span className="text-sm font-bold uppercase tracking-wider text-[#34D399]">
                                Graded
                            </span>
                        </div>
                    )}
                </div>

                <div className="grid lg:grid-cols-12 gap-6 items-start">
                    
                    {/* LEFT COLUMN - CONTENT */}
                    <div className="lg:col-span-7 xl:col-span-8 space-y-6">
                        
                        {/* STUDENT PROFILE CARD */}
                        <div className="bg-[#0B1021] border border-slate-800 rounded-2xl p-6 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                            <div className="flex items-center gap-5">
                                <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center text-white font-black text-2xl shadow-lg border-[3px] border-indigo-900 shrink-0">
                                    {studentSubmission.student.name.charAt(0)}
                                </div>
                                <div>
                                    <h2 className="text-xl font-extrabold text-white mb-1">
                                        {studentSubmission.student.name}
                                    </h2>
                                    <div className="flex items-center gap-2 text-sm text-slate-400 font-medium">
                                        <User className="w-4 h-4 text-slate-500" />
                                        {studentSubmission.student.email}
                                    </div>
                                </div>
                            </div>
                            <div className="flex flex-col sm:items-end gap-1">
                                <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                                    Submitted At
                                </span>
                                <div className="flex items-center gap-2 bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-lg text-sm text-slate-300 font-semibold shadow-inner">
                                    <Calendar className="w-4 h-4 text-indigo-400" />
                                    {new Date(studentSubmission.created_at).toLocaleString('en-GB', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                                </div>
                            </div>
                        </div>

                        {/* STUDENT'S WORK */}
                        <div className="bg-[#0B1021] border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-xl relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-600 rounded-full blur-[100px] opacity-20 pointer-events-none"></div>
                            
                            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-800">
                                <div className="p-2 bg-indigo-600 rounded-lg shadow-lg">
                                    <FileText className="w-5 h-5 text-white" />
                                </div>
                                <h3 className="text-xl font-bold text-white tracking-wide">
                                    Student's Work
                                </h3>
                            </div>

                            <div className="space-y-6 relative z-10">
                                {studentSubmission.link && (
                                    <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-inner">
                                        <label className="text-xs font-black text-slate-500 uppercase tracking-widest mb-3 block">
                                            Project / Repository Link
                                        </label>
                                        <a
                                            href={studentSubmission.link}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="group flex items-center justify-between p-4 rounded-xl border border-indigo-900 bg-[#0f172a] hover:bg-indigo-950 hover:border-indigo-500 transition-all shadow-md"
                                        >
                                            <div className="flex items-center gap-4 truncate">
                                                <div className="p-2.5 bg-indigo-900 rounded-lg text-indigo-400 group-hover:text-white group-hover:bg-indigo-600 transition-colors">
                                                    <LinkIcon className="w-5 h-5" />
                                                </div>
                                                <span className="text-indigo-400 group-hover:text-indigo-300 font-bold truncate text-sm sm:text-base">
                                                    {studentSubmission.link}
                                                </span>
                                            </div>
                                            <ArrowLeft className="w-5 h-5 text-indigo-600 group-hover:text-indigo-400 rotate-135 transition-colors shrink-0" />
                                        </a>
                                    </div>
                                )}

                                {studentSubmission.file_path && (
                                    <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-inner">
                                        <label className="text-xs font-black text-slate-500 uppercase tracking-widest mb-3 block">
                                            Attached Document
                                        </label>
                                        <a
                                            href={`/storage/${studentSubmission.file_path}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="group flex items-center justify-between p-4 rounded-xl border border-blue-900 bg-[#0f172a] hover:bg-blue-950 hover:border-blue-500 transition-all shadow-md"
                                        >
                                            <div className="flex items-center gap-4 truncate">
                                                <div className="p-2.5 bg-blue-900 rounded-lg text-blue-400 group-hover:text-white group-hover:bg-blue-600 transition-colors shrink-0">
                                                    <Download className="w-5 h-5" />
                                                </div>
                                                <span className="text-blue-400 group-hover:text-blue-300 font-bold truncate text-sm sm:text-base">
                                                    Download Submission File
                                                </span>
                                            </div>
                                            <ArrowLeft className="w-5 h-5 text-blue-600 group-hover:text-blue-400 rotate-135 transition-colors shrink-0" />
                                        </a>
                                    </div>
                                )}

                                {studentSubmission.notes && (
                                    <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-inner">
                                        <label className="flex items-center gap-2 text-xs font-black text-slate-500 uppercase tracking-widest mb-3">
                                            <MessageSquare className="w-4 h-4" /> Student's Note
                                        </label>
                                        <div className="p-4 rounded-xl bg-[#0f172a] border border-slate-800 text-slate-300 whitespace-pre-wrap leading-relaxed font-medium italic">
                                            "{studentSubmission.notes}"
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* ASSIGNMENT REFERENCE */}
                        <div className="bg-[#0B1021] border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-xl">
                            <h3 className="text-sm font-black text-slate-500 uppercase tracking-widest mb-5 flex items-center gap-2">
                                <FileText className="w-4 h-4" /> Assignment Instructions
                            </h3>
                            <div className="bg-slate-900 border border-slate-800 p-5 rounded-xl shadow-inner">
                                <p className="text-slate-300 whitespace-pre-wrap leading-loose font-medium text-sm">
                                    {studentSubmission.submission.description}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* RIGHT COLUMN - GRADING */}
                    <div className="lg:col-span-5 xl:col-span-4">
                        <div className="bg-[#0B1021] border border-indigo-900 rounded-2xl p-6 sm:p-8 shadow-[0_10px_40px_rgba(79,70,229,0.15)] sticky top-8">
                            <div className="flex items-center gap-3 mb-8 border-b border-slate-800 pb-5">
                                <div className="p-2.5 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl shadow-lg">
                                    <Award className="w-6 h-6 text-white" />
                                </div>
                                <h2 className="text-xl font-extrabold text-white tracking-wide">
                                    Evaluation
                                </h2>
                            </div>

                            <form onSubmit={submit} className="space-y-8">
                                
                                {/* SCORE INPUT */}
                                <div className="bg-slate-900 border border-slate-800 p-5 rounded-xl shadow-inner">
                                    <div className="flex flex-col items-center justify-center gap-3 mb-5">
                                        <label className="text-sm font-black text-slate-400 uppercase tracking-widest">
                                            Final Score
                                        </label>
                                        {/* STARS */}
                                        <div className="flex gap-1.5 bg-[#0f172a] py-2 px-4 rounded-full border border-slate-800">
                                            {[1, 2, 3, 4, 5].map((star) => (
                                                <Star
                                                    key={star}
                                                    className={`w-6 h-6 ${star <= stars
                                                        ? 'fill-yellow-400 text-yellow-400 drop-shadow-[0_0_12px_rgba(250,204,21,0.6)]'
                                                        : 'text-slate-700'
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
                                            className="w-full bg-[#050812] border-2 border-indigo-900 rounded-xl px-4 py-5 text-5xl font-black text-center text-emerald-400 focus:border-indigo-500 focus:ring-0 outline-none transition-all placeholder-slate-800 shadow-inner"
                                            placeholder="0"
                                        />
                                    </div>
                                    {errors.grade && <p className="text-red-500 font-bold text-xs mt-3 text-center">{errors.grade}</p>}
                                </div>

                                {/* FEEDBACK */}
                                <div className="bg-slate-900 border border-slate-800 p-5 rounded-xl shadow-inner">
                                    <label className="flex items-center gap-2 text-sm font-black text-slate-400 uppercase tracking-widest mb-4">
                                        <MessageSquare className="w-4 h-4" /> Mentor Feedback
                                    </label>
                                    <textarea
                                        rows={7}
                                        required
                                        placeholder="Provide constructive feedback, highlight what was done well, and suggest areas for improvement..."
                                        value={data.feedback}
                                        onChange={e => setData('feedback', e.target.value)}
                                        className="w-full bg-[#050812] border border-slate-800 rounded-xl px-4 py-4 text-slate-200 placeholder-slate-700 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition-all resize-none text-sm font-medium shadow-inner"
                                    />
                                    {errors.feedback && <p className="text-red-500 font-bold text-xs mt-2">{errors.feedback}</p>}
                                </div>

                                {/* SUBMIT BUTTON */}
                                <div className="pt-2">
                                    <button
                                        type="submit"
                                        disabled={processing}
                                        className={`w-full flex justify-center items-center gap-2 py-4 rounded-xl font-extrabold text-sm uppercase tracking-widest transition-all duration-300 shadow-lg active:scale-[0.98]
                                            ${processing 
                                                ? 'bg-slate-800 text-slate-500 border border-slate-700 cursor-not-allowed'
                                                : 'bg-indigo-600 hover:bg-indigo-500 text-white hover:shadow-[0_0_25px_rgba(79,70,229,0.4)] border border-indigo-500'
                                            }`}
                                    >
                                        {processing ? 'Processing...' : (isGraded ? 'Update Review' : 'Submit Review')}
                                    </button>

                                    {isGraded && (
                                        <p className="text-xs text-center text-emerald-500 font-bold mt-4 px-2">
                                            This submission has been graded. Submitting again will update the existing grade and regenerate the certificate.
                                        </p>
                                    )}
                                </div>
                            </form>
                        </div>
                    </div>

                </div>
            </div>
        </AppLayout>
    );
}