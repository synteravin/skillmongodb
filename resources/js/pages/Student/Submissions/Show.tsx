import { useForm, Link } from '@inertiajs/react';
import {
    FileText,
    Link as LinkIcon,
    UploadCloud,
    CheckCircle2,
    AlertCircle,
    MessageSquare,
    ClipboardList,
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
        notes: '',
    });

    const [dragActive, setDragActive] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleDrag = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === 'dragenter' || e.type === 'dragover') {
            setDragActive(true);
        } else if (e.type === 'dragleave') {
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
        <div className="flex h-screen flex-col overflow-hidden bg-[#f0f4ff] text-[#1e293b] dark:bg-[#040812] dark:text-white">
            {/* ================= HEADER ================= */}
            <div className="w-full flex-shrink-0 px-1 pt-0.5">
                <div
                    className="relative rounded-md p-[2px] md:p-[3px]"
                    style={{
                        backgroundImage:
                            'linear-gradient(to right, #2563EB 0%, #3b82f6 30%, #6366f1 50%, #facc15 100%)',
                    }}
                >
                    <div className="flex items-center gap-4 rounded-[4px] bg-white px-4 py-4 shadow-sm md:px-6 dark:bg-[#040812] dark:shadow-none">
                        <Link
                            href={`/student/career-groups/${submission.group_id}/submissions`}
                            className="flex h-10 w-10 shrink-0 items-center justify-center rounded border-2 border-blue-300 bg-[#eff6ff] p-2 transition-colors hover:border-blue-500 hover:bg-blue-100 md:h-12 md:w-12 dark:border-blue-800 dark:bg-[#0b1021] dark:hover:border-blue-600 dark:hover:bg-blue-900/40"
                        >
                            <svg
                                viewBox="0 0 48 48"
                                className="h-7 w-7 scale-125 text-blue-600 transition-transform duration-200 hover:scale-150 md:h-9 md:w-9 dark:text-indigo-500"
                            >
                                <rect
                                    x="12"
                                    y="20"
                                    width="29"
                                    height="4"
                                    fill="currentColor"
                                />
                                <rect
                                    x="8"
                                    y="20"
                                    width="4"
                                    height="4"
                                    fill="currentColor"
                                />
                                <rect
                                    x="5"
                                    y="20"
                                    width="5"
                                    height="4"
                                    fill="currentColor"
                                />
                                <rect
                                    x="8"
                                    y="16"
                                    width="4"
                                    height="4"
                                    fill="currentColor"
                                />
                                <rect
                                    x="8"
                                    y="24"
                                    width="4"
                                    height="4"
                                    fill="currentColor"
                                />
                                <rect
                                    x="12"
                                    y="12"
                                    width="4"
                                    height="4"
                                    fill="currentColor"
                                />
                                <rect
                                    x="12"
                                    y="28"
                                    width="4"
                                    height="4"
                                    fill="currentColor"
                                />
                                <rect
                                    x="16"
                                    y="8"
                                    width="4"
                                    height="4"
                                    fill="currentColor"
                                />
                                <rect
                                    x="16"
                                    y="32"
                                    width="4"
                                    height="4"
                                    fill="currentColor"
                                />
                            </svg>
                        </Link>
                        <h1 className="truncate font-['Orbitron'] text-xl font-bold tracking-[0.15em] text-[#1e3a8a] uppercase md:text-2xl lg:text-3xl dark:text-white">
                            {submission.title}
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
                <div className="scrollbar-thin scrollbar-track-transparent scrollbar-thumb-blue-200 dark:scrollbar-thumb-blue-500/30 flex min-h-0 flex-1 flex-col gap-4 overflow-y-auto rounded-xl border border-blue-200 bg-white p-4 shadow-sm sm:gap-5 sm:p-5 md:gap-6 md:p-8 dark:border-blue-500/30 dark:bg-gradient-to-b dark:from-[#0d1229] dark:to-[#080d1e] dark:shadow-none">
                    {/* Header Info */}
                    <div className="border-b border-blue-100 pb-4 sm:pb-5 md:pb-6 dark:border-blue-500/15">
                        <div className="mb-2 flex items-center gap-2 sm:mb-3">
                            <span className="inline-flex items-center gap-1.5 rounded-md border border-blue-300 bg-blue-50 px-2.5 py-1 text-[10px] font-bold tracking-wider text-blue-600 uppercase sm:px-3 sm:text-xs dark:border-blue-500/30 dark:bg-blue-500/10 dark:text-blue-400">
                                <FileText className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
                                {submission.submission_type} Submission
                            </span>
                        </div>
                        <h2 className="font-['Orbitron'] text-xl font-extrabold text-[#1e3a8a] sm:text-2xl md:text-3xl dark:text-white">
                            {submission.title} DIMANA INI
                        </h2>
                        <p className="mt-2 font-['Oxanium'] text-xs leading-relaxed whitespace-pre-line text-slate-700 sm:mt-3 sm:text-sm md:text-base dark:text-gray-300">
                            {submission.description}
                        </p>

                        {submission.attachment && (
                            <div className="mt-3 sm:mt-4">
                                <a
                                    href={`/storage/${submission.attachment}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-1.5 rounded-lg border border-blue-300 bg-blue-50 px-3 py-1.5 text-[11px] font-bold text-blue-700 transition-colors hover:bg-blue-100 sm:gap-2 sm:px-4 sm:py-2 sm:text-xs dark:border-blue-500/40 dark:bg-blue-500/20 dark:text-blue-300 dark:hover:bg-blue-500/30"
                                >
                                    <ClipboardList className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                                    Download Reference Material
                                </a>
                            </div>
                        )}
                    </div>

                    {/* Submission Hub */}
                    <div className="flex flex-col gap-4 sm:gap-5 md:gap-6">
                        <div className="flex items-center gap-2.5 sm:gap-3">
                            <div className="flex h-8 w-8 items-center justify-center rounded-xl border border-blue-300 bg-blue-50 sm:h-9 sm:w-9 md:h-10 md:w-10 dark:border-blue-500/30 dark:bg-blue-500/10">
                                <UploadCloud className="h-4 w-4 text-blue-600 sm:h-5 sm:w-5 dark:text-blue-400" />
                            </div>
                            <div>
                                <h3 className="font-['Orbitron'] text-base font-bold text-[#1e3a8a] sm:text-lg dark:text-white">
                                    Submission Hub
                                </h3>
                                <p className="font-['Oxanium'] text-[10px] font-semibold tracking-wider text-slate-400 uppercase sm:text-xs">
                                    Secure Workspace
                                </p>
                            </div>
                        </div>

                        {isSubmitted && (
                            <div className="flex flex-col gap-3 rounded-xl border border-emerald-300 bg-emerald-50/50 p-4 sm:gap-4 sm:p-5 md:p-6 dark:border-emerald-500/30 dark:bg-emerald-500/10">
                                <div className="flex items-center gap-3 sm:gap-4">
                                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-100 sm:h-11 sm:w-11 md:h-12 md:w-12 dark:bg-emerald-500/20">
                                        <CheckCircle2 className="h-5 w-5 text-emerald-600 sm:h-6 sm:w-6 dark:text-emerald-400" />
                                    </div>
                                    <div>
                                        <h4 className="font-['Orbitron'] text-sm font-bold text-emerald-900 sm:text-base dark:text-emerald-300">
                                            Task Submitted!
                                        </h4>
                                        <p className="font-['Oxanium'] text-[11px] text-emerald-700 sm:text-xs dark:text-emerald-400/80">
                                            Your work has been uploaded and is
                                            awaiting mentor review.
                                        </p>
                                    </div>
                                </div>

                                <div className="mt-1 flex flex-col gap-2.5 sm:mt-2 sm:gap-3">
                                    {studentSubmission?.link && (
                                        <div className="rounded-lg border border-emerald-200 bg-white p-3 sm:p-4 dark:border-emerald-500/20 dark:bg-black/20">
                                            <label className="mb-1 flex items-center gap-1.5 text-[9px] font-bold tracking-widest text-slate-400 uppercase sm:text-[10px]">
                                                <LinkIcon className="h-3 w-3 sm:h-3.5 sm:w-3.5" />{' '}
                                                Project URL
                                            </label>
                                            <a
                                                href={studentSubmission.link}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="font-['Oxanium'] text-xs font-medium break-all text-blue-600 underline sm:text-sm dark:text-blue-400"
                                            >
                                                {studentSubmission.link}
                                            </a>
                                        </div>
                                    )}

                                    {studentSubmission?.file_path && (
                                        <div className="flex items-center justify-between rounded-lg border border-emerald-200 bg-white p-3 sm:p-4 dark:border-emerald-500/20 dark:bg-black/20">
                                            <div>
                                                <label className="mb-1 flex items-center gap-1.5 text-[9px] font-bold tracking-widest text-slate-400 uppercase sm:text-[10px]">
                                                    <FileText className="h-3 w-3 sm:h-3.5 sm:w-3.5" />{' '}
                                                    Attached Document
                                                </label>
                                                <div className="font-['Oxanium'] text-xs font-bold text-slate-700 sm:text-sm dark:text-gray-200">
                                                    File Uploaded Successfully
                                                </div>
                                            </div>
                                            <CheckCircle2 className="h-4 w-4 text-emerald-600 sm:h-5 sm:w-5 dark:text-emerald-400" />
                                        </div>
                                    )}

                                    {studentSubmission?.notes && (
                                        <div className="rounded-lg border border-emerald-200 bg-white p-3 sm:p-4 dark:border-emerald-500/20 dark:bg-black/20">
                                            <label className="mb-1 flex items-center gap-1.5 text-[9px] font-bold tracking-widest text-slate-400 uppercase sm:text-[10px]">
                                                <MessageSquare className="h-3 w-3 sm:h-3.5 sm:w-3.5" />{' '}
                                                Private Notes
                                            </label>
                                            <div className="font-['Oxanium'] text-xs text-slate-600 italic sm:text-sm dark:text-gray-300">
                                                "{studentSubmission.notes}"
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {!isGraded && (
                                    <div className="mt-1 flex items-start gap-2.5 rounded-lg border border-amber-300 bg-amber-50 p-3 text-[11px] text-amber-800 sm:mt-2 sm:gap-3 sm:p-3.5 sm:text-xs dark:border-amber-500/30 dark:bg-amber-500/10 dark:text-amber-300">
                                        <AlertCircle className="mt-0.5 h-3.5 w-3.5 shrink-0 sm:h-4 sm:w-4" />
                                        <div>
                                            <strong className="font-['Orbitron']">
                                                Need to make changes?
                                            </strong>
                                            <p className="mt-0.5 font-['Oxanium']">
                                                You can overwrite your
                                                submission using the form below
                                                as long as it hasn't been
                                                graded.
                                            </p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}

                        {(!isSubmitted || !isGraded) && (
                            <form
                                onSubmit={submit}
                                className="flex flex-col gap-4 sm:gap-5 md:gap-6"
                            >
                                {submission.submission_type === 'link' ? (
                                    <div>
                                        <label className="mb-1.5 block text-[11px] font-bold tracking-widest text-slate-500 uppercase sm:mb-2 sm:text-xs dark:text-gray-400">
                                            Project URL{' '}
                                            <span className="text-red-500">
                                                *
                                            </span>
                                        </label>
                                        <div className="relative">
                                            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 sm:pl-4">
                                                <LinkIcon className="h-3.5 w-3.5 text-slate-400 sm:h-4 sm:w-4" />
                                            </div>
                                            <input
                                                type="url"
                                                required
                                                placeholder="https://github.com/username/project"
                                                value={data.link}
                                                onChange={(e) =>
                                                    setData(
                                                        'link',
                                                        e.target.value,
                                                    )
                                                }
                                                className="w-full rounded-xl border border-blue-200 bg-white py-3 pr-3 pl-9 text-xs font-medium text-slate-800 transition-all outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 sm:py-3.5 sm:pr-4 sm:pl-11 sm:text-sm dark:border-blue-500/30 dark:bg-white/5 dark:text-white dark:focus:border-blue-400"
                                            />
                                        </div>
                                        {errors.link && (
                                            <p className="mt-1.5 text-[11px] font-medium text-red-500 sm:text-xs">
                                                {errors.link}
                                            </p>
                                        )}
                                    </div>
                                ) : (
                                    <div>
                                        <label className="mb-1.5 block text-[11px] font-bold tracking-widest text-slate-500 uppercase sm:mb-2 sm:text-xs dark:text-gray-400">
                                            Upload File{' '}
                                            <span className="text-red-500">
                                                *
                                            </span>
                                        </label>
                                        <div
                                            className={`flex min-h-[140px] cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed p-5 text-center transition-all sm:min-h-[160px] sm:p-6 md:p-8 ${
                                                dragActive
                                                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-500/10'
                                                    : 'border-blue-200 bg-blue-50/50 hover:border-blue-400 hover:bg-blue-50 dark:border-blue-500/30 dark:bg-white/5 dark:hover:border-blue-400'
                                            } ${
                                                data.file
                                                    ? 'border-emerald-500 bg-emerald-50 dark:border-emerald-500/40 dark:bg-emerald-500/10'
                                                    : ''
                                            }`}
                                            onDragEnter={handleDrag}
                                            onDragLeave={handleDrag}
                                            onDragOver={handleDrag}
                                            onDrop={handleDrop}
                                            onClick={() =>
                                                fileInputRef.current?.click()
                                            }
                                        >
                                            <input
                                                type="file"
                                                ref={fileInputRef}
                                                onChange={(e) =>
                                                    setData(
                                                        'file',
                                                        e.target.files?.[0] ||
                                                            null,
                                                    )
                                                }
                                                className="hidden"
                                            />

                                            {data.file ? (
                                                <div className="flex flex-col items-center">
                                                    <div className="mb-2.5 flex h-10 w-10 items-center justify-center rounded-full bg-emerald-100 sm:mb-3 sm:h-11 sm:w-11 md:h-12 md:w-12 dark:bg-emerald-500/20">
                                                        <FileText className="h-5 w-5 text-emerald-600 sm:h-6 sm:w-6 dark:text-emerald-400" />
                                                    </div>
                                                    <p className="max-w-[200px] truncate font-['Oxanium'] text-xs font-bold text-emerald-900 sm:max-w-[250px] sm:text-sm dark:text-emerald-300">
                                                        {data.file.name}
                                                    </p>
                                                    <p className="mt-1 text-[11px] text-emerald-600 sm:text-xs dark:text-emerald-400/80">
                                                        Ready to upload
                                                    </p>
                                                    <button
                                                        type="button"
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            setData(
                                                                'file',
                                                                null,
                                                            );
                                                        }}
                                                        className="mt-3 rounded-lg bg-slate-200 px-2.5 py-1 text-[11px] font-bold text-slate-700 transition-colors hover:bg-red-500 hover:text-white sm:mt-4 sm:px-3 sm:py-1.5 sm:text-xs dark:bg-slate-800 dark:text-gray-300"
                                                    >
                                                        Remove File
                                                    </button>
                                                </div>
                                            ) : (
                                                <div className="flex flex-col items-center">
                                                    <div className="mb-2.5 flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 sm:mb-3 sm:h-11 sm:w-11 md:h-12 md:w-12 dark:bg-blue-500/20">
                                                        <UploadCloud className="h-5 w-5 text-blue-600 sm:h-6 sm:w-6 dark:text-blue-400" />
                                                    </div>
                                                    <p className="font-['Oxanium'] text-xs font-bold text-slate-700 sm:text-sm dark:text-gray-200">
                                                        Click to browse or drag
                                                        file here
                                                    </p>
                                                    <p className="mt-1 text-[11px] text-slate-400 sm:text-xs">
                                                        Supported: PDF, ZIP,
                                                        DOCX (Max 10MB)
                                                    </p>
                                                </div>
                                            )}
                                        </div>
                                        {errors.file && (
                                            <p className="mt-1.5 text-[11px] font-medium text-red-500 sm:text-xs">
                                                {errors.file}
                                            </p>
                                        )}
                                    </div>
                                )}

                                <div>
                                    <label className="mb-1.5 block text-[11px] font-bold tracking-widest text-slate-500 uppercase sm:mb-2 sm:text-xs dark:text-gray-400">
                                        Private Notes{' '}
                                        <span className="font-normal text-slate-400 normal-case">
                                            (Optional)
                                        </span>
                                    </label>
                                    <textarea
                                        rows={4}
                                        placeholder="Add context, challenges you faced, or questions for your mentor..."
                                        value={data.notes}
                                        onChange={(e) =>
                                            setData('notes', e.target.value)
                                        }
                                        className="w-full rounded-xl border border-blue-200 bg-white p-3 text-xs font-medium text-slate-800 transition-all outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 sm:p-4 sm:text-sm dark:border-blue-500/30 dark:bg-white/5 dark:text-white dark:focus:border-blue-400"
                                    />
                                    {errors.notes && (
                                        <p className="mt-1.5 text-[11px] font-medium text-red-500 sm:text-xs">
                                            {errors.notes}
                                        </p>
                                    )}
                                </div>

                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="flex items-center justify-center gap-1.5 rounded-xl bg-blue-600 px-5 py-3 font-['Orbitron'] text-[11px] font-bold tracking-wider text-white uppercase shadow-md shadow-blue-600/20 transition-all hover:bg-blue-700 disabled:opacity-50 sm:gap-2 sm:px-6 sm:py-3.5 sm:text-xs"
                                >
                                    <UploadCloud className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                                    <span>
                                        {isSubmitted
                                            ? 'Update Submission'
                                            : 'Submit Assignment'}
                                    </span>
                                </button>
                            </form>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
