import { useForm, Link } from '@inertiajs/react';
import {
    ArrowLeft, Calendar, FileText, Link as LinkIcon,
    UploadCloud, CheckCircle2, AlertCircle, MessageSquare, Download,
    ClipboardList
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
    certificate_url?: string;
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
        <div className="flex min-h-screen bg-slate-50 dark:bg-[#020202]">
            {/* ─── SIDEBAR (DESKTOP) ─── */}
            <aside className="w-[240px] shrink-0 flex-col bg-white dark:bg-[#050619] border-r border-slate-200 dark:border-slate-800/60 min-h-screen hidden md:flex sticky top-0">
                <div className="px-6 py-6 border-b border-slate-100 dark:border-slate-800/60">
                    <div className="flex items-center gap-3">
                        <img
                            src="/images/logo-sv.webp"
                            alt="Skill Ventura Logo"
                            className="w-8 h-8 object-contain shrink-0"
                        />
                        <span
                            className="text-gray-900 dark:text-white text-sm tracking-widest leading-tight"
                            style={{ fontFamily: "'Orbitron', sans-serif", fontWeight: 700 }}
                        >
                            Skill<span className="text-[#FACC15]">Ventura</span>
                        </span>
                    </div>
                </div>

                <nav className="flex-1 px-4 py-6 space-y-2">
                    <Link
                        href={`/student/career-groups/${submission.group_id}/submissions`}
                        className="flex items-center gap-3 px-4 py-3 rounded-xl text-slate-500 dark:text-slate-400 hover:text-gray-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/60 transition-all text-sm font-medium group"
                    >
                        <ArrowLeft className="w-4 h-4 shrink-0 group-hover:-translate-x-1 transition-transform" />
                        <span className="font-['Oxanium']">Back to List</span>
                    </Link>

                    <div className="my-4 border-t border-slate-100 dark:border-slate-800/60" />

                    <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-[#3B28F6]/10 dark:bg-[#3B28F6]/15 border border-[#3B28F6]/20 text-[#3B28F6] dark:text-white text-sm font-semibold shadow-inner">
                        <UploadCloud className="w-4 h-4 text-[#3B28F6] dark:text-[#FACC15]" />
                        <span className="font-['Oxanium']">Workspace</span>
                    </div>
                </nav>
            </aside>

            {/* ─── MAIN CONTENT: FOCUS WORKSPACE ─── */}
            <main className="flex-1 w-full max-w-full md:max-w-[calc(100vw-240px)] flex flex-col relative">
                
                {/* ─── MOBILE HEADER ─── */}
                <div className="md:hidden flex items-center justify-between px-6 py-4 bg-white dark:bg-[#050619] border-b border-slate-200 dark:border-slate-800/60 sticky top-0 z-20 shadow-sm">
                    <div className="flex items-center gap-3">
                        <img src="/images/logo-sv.webp" alt="Logo" className="w-6 h-6 object-contain" />
                        <span className="text-gray-900 dark:text-white text-xs tracking-widest font-bold font-['Orbitron']">
                            Skill<span className="text-[#FACC15]">Ventura</span>
                        </span>
                    </div>
                    <Link
                        href={`/student/career-groups/${submission.group_id}/submissions`}
                        className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                    >
                        <ArrowLeft className="w-4 h-4" />
                    </Link>
                </div>

                <div className="flex-1 flex flex-col items-center justify-center p-6 py-12 md:p-12 lg:p-16 relative">
                    {/* Decorative Background Elements */}
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-2xl h-64 bg-gradient-to-b from-[#3B28F6]/5 to-transparent dark:from-[#3B28F6]/10 pointer-events-none rounded-b-full blur-3xl opacity-60" />

                    <div className="w-full max-w-3xl relative z-10 flex flex-col items-center">
                        
                        {/* Header Area */}
                        <div className="text-center mb-10 w-full">
                            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/50 text-slate-600 dark:text-slate-300 text-xs font-bold uppercase tracking-widest mb-6 shadow-sm">
                                <FileText className="w-3.5 h-3.5 text-[#3B28F6] dark:text-[#FACC15]" />
                                {submission.submission_type} Submission
                            </div>
                            
                            <h1 className="text-3xl md:text-5xl lg:text-6xl font-extrabold text-[#1e3a8a] dark:text-white font-['Orbitron'] leading-tight mb-4 tracking-tight">
                                {submission.title}
                            </h1>
                            <p className="text-slate-500 dark:text-slate-400 text-sm md:text-base font-['Oxanium'] max-w-lg mx-auto leading-relaxed">
                                You are about to submit your work. Please ensure all requirements are met before uploading.
                            </p>
                        </div>

                        {/* WORKSPACE: ACTION AREA */}
                        <div className="w-full relative">
                            {/* Glow Effect */}
                            <div className="absolute -inset-1 bg-gradient-to-r from-[#3B28F6]/20 to-[#FACC15]/20 rounded-3xl blur-xl opacity-50 dark:opacity-70 pointer-events-none" />

                            <div className="relative rounded-3xl border border-slate-200 dark:border-slate-700/80 bg-white dark:bg-[#050619]/90 backdrop-blur-xl p-8 md:p-12 shadow-2xl">
                                
                                <div className="flex items-center gap-4 border-b border-slate-100 dark:border-slate-800/80 pb-6 mb-8">
                                    <div className="p-3 bg-[#3B28F6]/10 dark:bg-[#FACC15]/10 rounded-xl">
                                        <UploadCloud className="w-6 h-6 text-[#3B28F6] dark:text-[#FACC15]" />
                                    </div>
                                    <div>
                                        <h2 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white font-['Orbitron']">
                                            Submission Hub
                                        </h2>
                                        <p className="text-xs text-slate-500 dark:text-slate-400 font-['Oxanium'] uppercase tracking-wider mt-1">
                                            Secure Workspace
                                        </p>
                                    </div>
                                </div>

                                {isSubmitted ? (
                                    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                                        <div className="flex flex-col items-center justify-center py-10 border border-emerald-200 dark:border-emerald-500/30 bg-emerald-50/50 dark:bg-emerald-500/5 rounded-2xl text-center shadow-inner">
                                            <div className="w-20 h-20 bg-emerald-100 dark:bg-emerald-500/20 rounded-full flex items-center justify-center mb-5 ring-4 ring-emerald-50 dark:ring-emerald-500/10 shadow-lg shadow-emerald-500/10">
                                                <CheckCircle2 className="w-10 h-10 text-emerald-600 dark:text-emerald-400" />
                                            </div>
                                            <h3 className="text-emerald-800 dark:text-emerald-300 font-extrabold text-2xl font-['Orbitron']">Task Submitted!</h3>
                                            <p className="text-emerald-600 dark:text-emerald-400/80 text-sm mt-2 font-['Oxanium'] max-w-sm">
                                                Your work has been securely uploaded and is awaiting mentor review.
                                            </p>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            {studentSubmission?.link && (
                                                <div className="col-span-1 md:col-span-2 bg-slate-50 dark:bg-slate-900/40 p-5 rounded-2xl border border-slate-200 dark:border-slate-800">
                                                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3 block flex items-center gap-2">
                                                        <LinkIcon className="w-3.5 h-3.5" /> Project URL
                                                    </label>
                                                    <a
                                                        href={studentSubmission.link}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="text-sm font-medium text-[#3B28F6] dark:text-[#FACC15] hover:underline break-all"
                                                    >
                                                        {studentSubmission.link}
                                                    </a>
                                                </div>
                                            )}

                                            {studentSubmission?.file_path && (
                                                <div className="col-span-1 md:col-span-2 bg-slate-50 dark:bg-slate-900/40 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 flex items-center justify-between">
                                                    <div>
                                                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1 block flex items-center gap-2">
                                                            <FileText className="w-3.5 h-3.5" /> Attached Document
                                                        </label>
                                                        <div className="text-sm font-bold text-slate-700 dark:text-slate-300">
                                                            File Uploaded Successfully
                                                        </div>
                                                    </div>
                                                    <div className="p-2 bg-emerald-100 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 rounded-full">
                                                        <CheckCircle2 className="w-4 h-4" />
                                                    </div>
                                                </div>
                                            )}

                                            {studentSubmission?.notes && (
                                                <div className="col-span-1 md:col-span-2 bg-slate-50 dark:bg-slate-900/40 p-5 rounded-2xl border border-slate-200 dark:border-slate-800">
                                                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3 block flex items-center gap-2">
                                                        <MessageSquare className="w-3.5 h-3.5" /> Private Notes
                                                    </label>
                                                    <div className="text-sm text-slate-600 dark:text-slate-300 italic font-['Oxanium']">
                                                        "{studentSubmission.notes}"
                                                    </div>
                                                </div>
                                            )}
                                        </div>

                                        {!isGraded && (
                                            <div className="mt-8 pt-8 border-t border-slate-100 dark:border-slate-800">
                                                <div className="flex items-start gap-4 p-4 rounded-xl bg-amber-50 dark:bg-amber-500/10 border border-amber-200/50 dark:border-amber-500/20 text-amber-700 dark:text-amber-400/90 text-sm">
                                                    <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
                                                    <div>
                                                        <strong className="block mb-1 font-['Orbitron']">Need to make changes?</strong>
                                                        <span className="font-['Oxanium']">You can overwrite your submission using the form below as long as it hasn't been graded.</span>
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                ) : null}

                                {(!isSubmitted || (!isGraded)) && (
                                    <form onSubmit={submit} className={`space-y-8 ${isSubmitted ? 'mt-8' : ''} animate-in fade-in duration-700`}>
                                        {submission.submission_type === 'link' ? (
                                            <div className="group">
                                                <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-3 block">
                                                    Project URL <span className="text-red-500">*</span>
                                                </label>
                                                <div className="relative">
                                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                                        <LinkIcon className="w-5 h-5 text-slate-400 group-focus-within:text-[#3B28F6] dark:group-focus-within:text-[#FACC15] transition-colors" />
                                                    </div>
                                                    <input
                                                        type="url"
                                                        required
                                                        placeholder="https://github.com/username/project"
                                                        value={data.link}
                                                        onChange={e => setData('link', e.target.value)}
                                                        className="w-full bg-slate-50 dark:bg-[#020202] border border-slate-200 dark:border-slate-700 rounded-2xl pl-12 pr-4 py-4 text-gray-900 dark:text-white placeholder-slate-400 focus:ring-2 focus:ring-[#3B28F6]/50 dark:focus:ring-[#FACC15]/50 outline-none transition-all text-sm font-medium shadow-inner"
                                                    />
                                                </div>
                                                {errors.link && <p className="text-red-500 text-xs mt-2 font-medium">{errors.link}</p>}
                                            </div>
                                        ) : (
                                            <div>
                                                <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-3 block">
                                                    Upload File <span className="text-red-500">*</span>
                                                </label>
                                                <div
                                                    className={`relative border-2 border-dashed rounded-2xl p-10 text-center transition-all duration-300 cursor-pointer flex flex-col items-center justify-center min-h-[200px] ${
                                                        dragActive 
                                                            ? 'border-[#3B28F6] bg-[#3B28F6]/5 scale-[1.02]' 
                                                            : 'border-slate-300 dark:border-slate-700 hover:border-[#3B28F6]/50 hover:bg-slate-50 dark:hover:bg-slate-800/30'
                                                    } ${data.file ? 'border-emerald-500/50 bg-emerald-50 dark:bg-emerald-500/5' : ''}`}
                                                    onDragEnter={handleDrag}
                                                    onDragLeave={handleDrag}
                                                    onDragOver={handleDrag}
                                                    onDrop={handleDrop}
                                                    onClick={() => fileInputRef.current?.click()}
                                                >
                                                    <input
                                                        type="file"
                                                        ref={fileInputRef}
                                                        onChange={e => setData('file', e.target.files?.[0] || null)}
                                                        className="hidden"
                                                    />

                                                    {data.file ? (
                                                        <div className="flex flex-col items-center animate-in zoom-in duration-300">
                                                            <div className="p-4 bg-emerald-100 dark:bg-emerald-500/20 rounded-full mb-4 ring-4 ring-emerald-50 dark:ring-emerald-500/10">
                                                                <FileText className="w-8 h-8 text-emerald-600 dark:text-emerald-400" />
                                                            </div>
                                                            <p className="text-sm text-emerald-800 dark:text-emerald-300 font-bold truncate max-w-[250px] px-2">{data.file.name}</p>
                                                            <p className="text-xs text-emerald-600/70 dark:text-emerald-400/60 mt-1 font-medium">Ready to upload</p>
                                                            <button
                                                                type="button"
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    setData('file', null);
                                                                }}
                                                                className="text-xs text-slate-500 hover:text-white mt-4 transition-colors font-bold px-4 py-2 bg-slate-200 dark:bg-slate-800 hover:bg-red-500 dark:hover:bg-red-500 rounded-full"
                                                            >
                                                                Remove File
                                                            </button>
                                                        </div>
                                                    ) : (
                                                        <div className="flex flex-col items-center opacity-70 hover:opacity-100 transition-opacity">
                                                            <div className="p-4 bg-slate-100 dark:bg-slate-800 rounded-full mb-4 group-hover:scale-110 transition-transform">
                                                                <UploadCloud className="w-8 h-8 text-slate-500 dark:text-slate-400" />
                                                            </div>
                                                            <p className="text-base text-slate-700 dark:text-slate-300 font-bold font-['Oxanium']">Click to browse or drag file here</p>
                                                            <p className="text-xs text-slate-500 mt-2 font-medium tracking-wide">Supported: PDF, ZIP, DOCX (Max 10MB)</p>
                                                        </div>
                                                    )}
                                                </div>
                                                {errors.file && <p className="text-red-500 text-xs mt-2 font-medium">{errors.file}</p>}
                                            </div>
                                        )}

                                        <div>
                                            <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-3 block flex items-center justify-between">
                                                <span>Private Notes <span className="text-slate-400 font-normal normal-case">(Optional)</span></span>
                                            </label>
                                            <textarea
                                                rows={4}
                                                placeholder="Add context, challenges you faced, or questions for your mentor..."
                                                value={data.notes}
                                                onChange={e => setData('notes', e.target.value)}
                                                className="w-full bg-slate-50 dark:bg-[#020202] border border-slate-200 dark:border-slate-700 rounded-2xl p-5 text-gray-900 dark:text-white placeholder-slate-400 focus:ring-2 focus:ring-[#3B28F6]/50 dark:focus:ring-[#FACC15]/50 outline-none transition-all resize-none text-sm font-medium shadow-inner"
                                            />
                                            {errors.notes && <p className="text-red-500 text-xs mt-2 font-medium">{errors.notes}</p>}
                                        </div>

                                        <button
                                            type="submit"
                                            disabled={processing}
                                            className="relative w-full overflow-hidden group rounded-2xl disabled:opacity-70 disabled:cursor-not-allowed"
                                        >
                                            <div className="absolute inset-0 bg-gradient-to-r from-[#3B28F6] to-[#5140ff] dark:from-[#3B28F6] dark:to-[#FACC15]/80 transition-transform duration-500 group-hover:scale-[1.05]" />
                                            <div className="relative flex justify-center items-center gap-3 px-8 py-4 text-white font-bold text-sm uppercase tracking-widest shadow-xl shadow-[#3B28F6]/30">
                                                <UploadCloud className="w-5 h-5" />
                                                <span>{isSubmitted ? 'Update Submission' : 'Submit Assignment'}</span>
                                            </div>
                                        </button>
                                    </form>
                                )}
                            </div>
                        </div>

                    </div>
                </div>
            </main>
        </div>
    );
}
