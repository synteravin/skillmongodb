import AppLayout from '@/layouts/app-layout';
import { useForm, Link } from '@inertiajs/react';
import {
    ArrowLeft, Calendar, FileText, Link as LinkIcon,
    UploadCloud, CheckCircle2, AlertCircle, MessageSquare, Download
} from 'lucide-react';
import { FormEventHandler, useState, useRef } from 'react';

interface CareerGroup {
    id: string;
    _id?: string;
    name: string;
}

interface User {
    name: string;
}

interface Submission {
    id: string;
    _id?: string;
    group_id: string;
    title: string;
    description: string;
    submission_type: 'file' | 'link';
    attachment?: string;
    deadline?: string;
    mentor?: User;
    group?: CareerGroup;
}

interface StudentSubmission {
    id: string;
    _id?: string;
    file_path?: string;
    link?: string;
    notes?: string;
    status: string;
    grade?: string | number;
    feedback?: string;
    certificate_path?: string;
}

interface Props {
    submission: Submission;
    studentSubmission: StudentSubmission | null;
}

export default function Show({ submission, studentSubmission }: Props) {
    const isSubmitted = !!studentSubmission;
    const isGraded = studentSubmission?.status === 'graded';

    const { data, setData, post, processing, errors } = useForm({
        file: null as File | null,
        link: '',
        notes: ''
    });

    const [dragActive, setDragActive] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleDrag = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === "dragenter" || e.type === "dragover") {
            setDragActive(true);
        } else if (e.type === "dragleave") {
            setDragActive(false);
        }
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            setData('file', e.dataTransfer.files[0]);
        }
    };

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        const submissionId = submission.id || submission._id;
        post(`/student/submissions/${submissionId}/submit`);
    };

    return (

        <div className="w-full mx-auto space-y-6 p-4 sm:p-6 lg:p-8 max-w-5xl">

            {/* Header Back Link */}
            <div className="flex items-center gap-4 mb-2">
                <Link
                    href={`/student/career-groups/${submission.group_id}/submissions`}
                    className="p-2.5 rounded-xl bg-slate-800 text-slate-300 hover:bg-slate-700 border border-slate-700 transition-colors"
                >
                    <ArrowLeft className="w-5 h-5" />
                </Link>
                <div>
                    <h1 className="text-2xl font-bold text-white">
                        {submission.title}
                    </h1>
                    <p className="text-sm text-slate-400">
                        {submission.group?.name || 'Assignment'}
                    </p>
                </div>
            </div>

            <div className="grid lg:grid-cols-3 gap-6">

                {/* LEFT COLUMN - Assignment Details */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="rounded-3xl bg-[#0b0f2a] border border-slate-800 shadow-xl p-6 sm:p-8">
                        <div className="flex flex-wrap items-center gap-4 mb-6 pb-6 border-b border-slate-800">
                            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-800/50 border border-slate-700 text-slate-300 text-sm font-medium">
                                <Calendar className="w-4 h-4 text-indigo-400" />
                                {submission.deadline
                                    ? `Due: ${new Date(submission.deadline).toLocaleString()}`
                                    : 'No Deadline'}
                            </div>
                            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-800/50 border border-slate-700 text-slate-300 text-sm font-medium uppercase">
                                {submission.submission_type === 'file' ? (
                                    <><FileText className="w-4 h-4 text-blue-400" /> File Upload</>
                                ) : (
                                    <><LinkIcon className="w-4 h-4 text-emerald-400" /> Link Submission</>
                                )}
                            </div>
                            {submission.mentor && (
                                <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-800/50 border border-slate-700 text-slate-300 text-sm font-medium">
                                    <span className="text-slate-500">Mentor:</span>
                                    <span className="text-indigo-400">{submission.mentor.name}</span>
                                </div>
                            )}
                        </div>

                        <div className="prose prose-invert prose-slate max-w-none">
                            <p className="text-slate-300 leading-relaxed whitespace-pre-wrap">
                                {submission.description}
                            </p>
                        </div>

                        {submission.attachment && (
                            <div className="mt-8 pt-6 border-t border-slate-800">
                                <h3 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
                                    <FileText className="w-4 h-4 text-indigo-400" />
                                    Reference Material
                                </h3>
                                <a
                                    href={`/storage/${submission.attachment}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center justify-between w-full p-4 rounded-xl border border-slate-700 bg-slate-800/30 hover:bg-slate-800 hover:border-indigo-500/50 transition-all group"
                                >
                                    <div className="flex items-center gap-3 truncate">
                                        <div className="p-2 bg-indigo-500/10 rounded-lg text-indigo-400">
                                            <FileText className="w-5 h-5" />
                                        </div>
                                        <span className="text-slate-300 font-medium truncate group-hover:text-indigo-300 transition-colors">
                                            Download Attachment
                                        </span>
                                    </div>
                                    <Download className="w-5 h-5 text-slate-500 group-hover:text-indigo-400 transition-colors shrink-0" />
                                </a>
                            </div>
                        )}
                    </div>

                    {/* MENTOR FEEDBACK IF GRADED */}
                    {isGraded && (
                        <div className="rounded-3xl bg-indigo-900/20 border border-indigo-500/30 shadow-xl p-6 sm:p-8 relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-8 opacity-10">
                                <CheckCircle2 className="w-32 h-32 text-indigo-400 transform rotate-12" />
                            </div>
                            <div className="relative z-10">
                                <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                                    <MessageSquare className="w-5 h-5 text-indigo-400" />
                                    Mentor Feedback & Grade
                                </h3>
                                <div className="mb-6 p-4 rounded-2xl bg-[#0a0d27]/50 border border-indigo-500/20">
                                    <div className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">
                                        {studentSubmission?.grade} / 100
                                    </div>
                                </div>
                                <div className="p-4 rounded-xl bg-slate-900/50 border border-slate-700/50">
                                    <p className="text-slate-300 italic">
                                        "{studentSubmission?.feedback || 'No written feedback provided.'}"
                                    </p>
                                </div>

                                {studentSubmission?.certificate_path && (
                                    <div className="mt-6 pt-6 border-t border-indigo-500/20">
                                        <h4 className="text-sm font-bold text-white mb-3 uppercase tracking-wider">Achievement Award</h4>
                                        <a
                                            href={studentSubmission.certificate_path}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="inline-flex items-center justify-between w-full p-4 rounded-xl border border-emerald-500/30 bg-emerald-500/10 hover:bg-emerald-500/20 hover:border-emerald-500/50 transition-all group"
                                        >
                                            <div className="flex items-center gap-3">
                                                <div className="p-2 bg-emerald-500/20 rounded-lg text-emerald-400">
                                                    <FileText className="w-5 h-5" />
                                                </div>
                                                <div className="text-left">
                                                    <div className="text-emerald-400 font-bold group-hover:text-emerald-300 transition-colors">
                                                        Certificate of Completion
                                                    </div>
                                                    <div className="text-xs text-emerald-500/70 mt-0.5">
                                                        Click to preview and download your PDF
                                                    </div>
                                                </div>
                                            </div>
                                            <Download className="w-5 h-5 text-emerald-500 group-hover:text-emerald-400 transition-colors shrink-0" />
                                        </a>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>

                {/* RIGHT COLUMN - Submission Form / Status */}
                <div className="lg:col-span-1">
                    <div className="rounded-3xl bg-[#0b0f2a] border border-slate-800 shadow-xl p-6 sm:p-8 sticky top-8">

                        <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                            <UploadCloud className="w-5 h-5 text-indigo-400" />
                            Your Work
                        </h2>

                        {isSubmitted ? (
                            <div className="space-y-6">
                                <div className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-emerald-500/30 bg-emerald-500/5 rounded-2xl text-center">
                                    <CheckCircle2 className="w-12 h-12 text-emerald-400 mb-3" />
                                    <h3 className="text-emerald-400 font-bold text-lg">Submitted Successfully</h3>
                                    <p className="text-slate-400 text-sm mt-1">
                                        Status: <span className="uppercase text-slate-300 font-bold">{studentSubmission?.status}</span>
                                    </p>
                                </div>

                                <div className="space-y-4">
                                    {studentSubmission?.link && (
                                        <div>
                                            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Submitted Link</label>
                                            <a
                                                href={studentSubmission.link}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="mt-1 flex items-center gap-2 text-indigo-400 hover:text-indigo-300 break-all bg-slate-900/50 p-3 rounded-lg border border-slate-800"
                                            >
                                                <LinkIcon className="w-4 h-4 shrink-0" />
                                                {studentSubmission.link}
                                            </a>
                                        </div>
                                    )}

                                    {studentSubmission?.file_path && (
                                        <div>
                                            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Submitted File</label>
                                            <div className="mt-1 flex items-center gap-2 text-blue-400 bg-slate-900/50 p-3 rounded-lg border border-slate-800">
                                                <FileText className="w-4 h-4 shrink-0" />
                                                File uploaded successfully
                                            </div>
                                        </div>
                                    )}

                                    {studentSubmission?.notes && (
                                        <div>
                                            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Your Notes</label>
                                            <div className="mt-1 text-slate-300 bg-slate-900/50 p-3 rounded-lg border border-slate-800 text-sm">
                                                {studentSubmission.notes}
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {!isGraded && (
                                    <div className="pt-6 border-t border-slate-800">
                                        <p className="text-sm text-slate-500 flex items-start gap-2">
                                            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-yellow-500" />
                                            You can resubmit your work to overwrite the previous submission until it is graded.
                                        </p>
                                    </div>
                                )}
                            </div>
                        ) : null}

                        {(!isSubmitted || (!isGraded)) && (
                            <form onSubmit={submit} className={`space-y-5 ${isSubmitted ? 'mt-6 pt-6 border-t border-slate-800' : ''}`}>
                                {submission.submission_type === 'link' ? (
                                    <div>
                                        <label className="block text-sm font-semibold text-slate-300 mb-2">Project/Repo URL</label>
                                        <input
                                            type="url"
                                            required
                                            placeholder="https://github.com/..."
                                            value={data.link}
                                            onChange={e => setData('link', e.target.value)}
                                            className="w-full bg-slate-900/50 border border-slate-700 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:ring-2 focus:ring-indigo-500/50 outline-none transition-all"
                                        />
                                        {errors.link && <p className="text-red-400 text-xs mt-1">{errors.link}</p>}
                                    </div>
                                ) : (
                                    <div>
                                        <label className="block text-sm font-semibold text-slate-300 mb-2">Upload File</label>
                                        <div
                                            className={`relative border-2 border-dashed rounded-xl p-6 text-center transition-all ${dragActive ? 'border-indigo-500 bg-indigo-500/10' : 'border-slate-700 hover:border-slate-500 hover:bg-slate-800/50'
                                                } ${data.file ? 'border-emerald-500/50 bg-emerald-500/5' : ''}`}
                                            onDragEnter={handleDrag}
                                            onDragLeave={handleDrag}
                                            onDragOver={handleDrag}
                                            onDrop={handleDrop}
                                        >
                                            <input
                                                type="file"
                                                ref={fileInputRef}
                                                onChange={e => setData('file', e.target.files?.[0] || null)}
                                                className="hidden"
                                            />

                                            {data.file ? (
                                                <div className="flex flex-col items-center">
                                                    <FileText className="w-8 h-8 text-emerald-400 mb-2" />
                                                    <p className="text-sm text-emerald-400 font-medium truncate w-full px-4">{data.file.name}</p>
                                                    <button
                                                        type="button"
                                                        onClick={() => setData('file', null)}
                                                        className="text-xs text-slate-500 hover:text-red-400 mt-2 transition-colors"
                                                    >
                                                        Remove
                                                    </button>
                                                </div>
                                            ) : (
                                                <div
                                                    className="flex flex-col items-center cursor-pointer"
                                                    onClick={() => fileInputRef.current?.click()}
                                                >
                                                    <UploadCloud className="w-8 h-8 text-slate-400 mb-2" />
                                                    <p className="text-sm text-slate-300 font-medium">Click or drag file here</p>
                                                    <p className="text-xs text-slate-500 mt-1">Max size: 10MB</p>
                                                </div>
                                            )}
                                        </div>
                                        {errors.file && <p className="text-red-400 text-xs mt-1">{errors.file}</p>}
                                    </div>
                                )}

                                <div>
                                    <label className="block text-sm font-semibold text-slate-300 mb-2">Additional Notes (Optional)</label>
                                    <textarea
                                        rows={3}
                                        placeholder="Any notes for your mentor..."
                                        value={data.notes}
                                        onChange={e => setData('notes', e.target.value)}
                                        className="w-full bg-slate-900/50 border border-slate-700 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:ring-2 focus:ring-indigo-500/50 outline-none transition-all resize-none"
                                    />
                                    {errors.notes && <p className="text-red-400 text-xs mt-1">{errors.notes}</p>}
                                </div>

                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="w-full inline-flex justify-center items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white py-3 rounded-xl font-bold shadow-lg shadow-indigo-500/20 transition-all disabled:opacity-50 active:scale-95"
                                >
                                    {isSubmitted ? 'Resubmit Work' : 'Submit Work'}
                                </button>
                            </form>
                        )}
                    </div>
                </div>

            </div>
        </div>
    );
}
