import AppLayout from '@/layouts/app-layout';
import { useForm, Link } from '@inertiajs/react';
import { FormEventHandler } from 'react';
import { ArrowLeft, Save, Edit, Calendar, Link as LinkIcon, Paperclip } from 'lucide-react';

type Submission = {
    id: string;
    group_id?: string;
    title: string;
    description: string;
    submission_type: string;
    deadline: string;
};

interface Props {
    submission: Submission;
}

export default function EditSubmission({ submission }: Props) {
    const { data, setData, put, processing, errors } = useForm({
        title: submission.title || '',
        description: submission.description || '',
        submission_type: submission.submission_type || 'file',
        attachment: null as File | null,
        deadline: submission.deadline
            ? submission.deadline.slice(0, 16)
            : '',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        put(`/mentor/submissions/${submission.id}`);
    };

    return (
        <AppLayout>
            <div
                className="w-full mx-auto space-y-8 p-4 sm:p-6 lg:p-8"
                style={{ fontFamily: "'Outfit', sans-serif" }}
            >
                {/* Header */}
                <div className="flex items-center gap-4">
                    <Link
                        href={`/mentor/career-groups/${submission.group_id}/submissions`}
                        className="inline-flex items-center justify-center w-10 h-10 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/60 text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 hover:border-indigo-300 dark:hover:border-indigo-500/50 transition-all shadow-sm"
                    >
                        <ArrowLeft className="w-5 h-5" />
                    </Link>
                    <div>
                        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
                            Edit Submission
                        </h1>
                        <p className="text-sm text-slate-500 dark:text-slate-400">
                            Update assignment details
                        </p>
                    </div>
                </div>

                {/* Form Card */}
                    <div className="w-full mx-auto">
                    <div className="rounded-xl bg-white dark:bg-gradient-to-b dark:from-[#0e0e1a] dark:to-[#090910] border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden font-outfit">
                        {/* Top decorative line */}
                        <div className="relative">
                            <div className="absolute top-0 right-8 left-8 h-px bg-gradient-to-r from-transparent via-slate-200 to-transparent dark:via-slate-800" />
                        </div>

                        <form onSubmit={submit} className="p-6 sm:p-8 space-y-8">

                            {/* Section Header */}
                            <div className="flex items-center gap-3">
                                <div className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800/60 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                                    <Edit className="w-5 h-5" />
                                </div>
                                <h2 className="text-lg font-bold text-slate-800 dark:text-white">
                                    Assignment Information
                                </h2>
                            </div>

                            {/* Title */}
                            <div>
                                <label className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2 ml-1">
                                    <span className="w-1 h-1 rounded-full bg-slate-400 dark:bg-slate-500" />
                                    Title
                                </label>
                                <input
                                    type="text"
                                    value={data.title}
                                    onChange={(e) => setData('title', e.target.value)}
                                    placeholder="Enter submission title..."
                                    className="w-full bg-white dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder:text-slate-600 focus:outline-none focus:ring-1 focus:ring-slate-300 dark:focus:ring-slate-600 focus:border-slate-400 dark:focus:border-slate-500 transition-all duration-200 shadow-sm"
                                />
                                {errors.title && (
                                    <p className="mt-2 text-sm text-rose-500 flex items-center gap-1.5 font-semibold">
                                        <span className="w-1.5 h-1.5 rounded-full bg-rose-500 shrink-0" />
                                        {errors.title}
                                    </p>
                                )}
                            </div>

                            {/* Description */}
                            <div>
                                <div className="flex items-center justify-between mb-2 ml-1 mr-1">
                                    <label className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                                        <span className="w-1 h-1 rounded-full bg-slate-400 dark:bg-slate-500" />
                                        Description
                                    </label>
                                    <span className="text-[11px] text-slate-400 dark:text-slate-500 tabular-nums">
                                        {data.description?.length ?? 0} characters
                                    </span>
                                </div>
                                <textarea
                                    rows={5}
                                    value={data.description}
                                    onChange={(e) => setData('description', e.target.value)}
                                    placeholder="Describe the assignment requirements..."
                                    className="w-full bg-white dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder:text-slate-600 focus:outline-none focus:ring-1 focus:ring-slate-300 dark:focus:ring-slate-600 focus:border-slate-400 dark:focus:border-slate-500 transition-all duration-200 shadow-sm resize-none"
                                />
                                {errors.description && (
                                    <p className="mt-2 text-sm text-rose-500 flex items-center gap-1.5 font-semibold">
                                        <span className="w-1.5 h-1.5 rounded-full bg-rose-500 shrink-0" />
                                        {errors.description}
                                    </p>
                                )}
                            </div>

                            {/* Submission Type & Deadline */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Submission Type */}
                                <div>
                                    <label className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2 ml-1">
                                        <LinkIcon className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500" />
                                        Submission Type
                                    </label>
                                    <div className="relative">
                                        <select
                                            value={data.submission_type}
                                            onChange={(e) => setData('submission_type', e.target.value)}
                                            className="w-full appearance-none bg-white dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-slate-300 dark:focus:ring-slate-600 focus:border-slate-400 dark:focus:border-slate-500 transition-all duration-200 shadow-sm pr-10"
                                        >
                                            <option value="file">File Upload Only</option>
                                            <option value="link">URL Link Only</option>
                                            <option value="both">Both (File &amp; Link)</option>
                                        </select>
                                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-slate-400 dark:text-slate-500">
                                            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                                            </svg>
                                        </div>
                                    </div>
                                    {errors.submission_type && (
                                        <p className="mt-2 text-sm text-rose-500 flex items-center gap-1.5 font-semibold">
                                            <span className="w-1.5 h-1.5 rounded-full bg-rose-500 shrink-0" />
                                            {errors.submission_type}
                                        </p>
                                    )}
                                </div>

                                {/* Deadline */}
                                <div>
                                    <label className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2 ml-1">
                                        <Calendar className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500" />
                                        Deadline
                                    </label>
                                    <input
                                        type="datetime-local"
                                        value={data.deadline}
                                        onChange={(e) => setData('deadline', e.target.value)}
                                        className="w-full bg-white dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-slate-300 dark:focus:ring-slate-600 focus:border-slate-400 dark:focus:border-slate-500 transition-all duration-200 shadow-sm [color-scheme:light] dark:[color-scheme:dark]"
                                    />
                                    {errors.deadline && (
                                        <p className="mt-2 text-sm text-rose-500 flex items-center gap-1.5 font-semibold">
                                            <span className="w-1.5 h-1.5 rounded-full bg-rose-500 shrink-0" />
                                            {errors.deadline}
                                        </p>
                                    )}
                                </div>
                            </div>

                            {/* Replace Attachment */}
                            <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
                                <label className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-3 ml-1">
                                    <Paperclip className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500" />
                                    Replace Attachment{' '}
                                    <span className="text-slate-400 dark:text-slate-500 font-normal normal-case tracking-normal">(Optional)</span>
                                </label>
                                <div className="flex justify-center rounded-xl border border-dashed border-slate-300 dark:border-slate-700 px-6 py-10 bg-slate-50/50 dark:bg-slate-950/40 hover:bg-slate-50 dark:hover:bg-slate-900/50 hover:border-slate-400 dark:hover:border-slate-600 transition-colors">
                                    <div className="text-center">
                                        <Paperclip className="mx-auto h-10 w-10 text-slate-300 dark:text-slate-500 mb-3" aria-hidden="true" />
                                        <div className="flex text-sm leading-6 text-slate-600 dark:text-slate-400 justify-center">
                                            <label
                                                htmlFor="file-upload"
                                                className="relative cursor-pointer rounded-md font-semibold text-slate-700 dark:text-slate-200 hover:text-slate-900 dark:hover:text-white underline decoration-slate-300 dark:decoration-slate-600 underline-offset-2 focus-within:outline-none focus-within:ring-1 focus-within:ring-slate-400"
                                            >
                                                <span>Select new file</span>
                                                <input
                                                    id="file-upload"
                                                    name="file-upload"
                                                    type="file"
                                                    className="sr-only"
                                                    onChange={(e) => setData('attachment', e.target.files?.[0] || null)}
                                                />
                                            </label>
                                            <p className="pl-1">to replace existing</p>
                                        </div>
                                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                                            {data.attachment ? data.attachment.name : 'PDF, DOCX, ZIP up to 10MB'}
                                        </p>
                                    </div>
                                </div>
                                {errors.attachment && (
                                    <p className="mt-2 text-sm text-rose-500 flex items-center gap-1.5 font-semibold">
                                        <span className="w-1.5 h-1.5 rounded-full bg-rose-500 shrink-0" />
                                        {errors.attachment}
                                    </p>
                                )}
                            </div>

                            {/* Actions */}
                            <div className="flex flex-col-reverse sm:flex-row items-center justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
                                <Link
                                    href={`/mentor/career-groups/${submission.group_id}/submissions`}
                                    className="w-full sm:w-auto inline-flex justify-center items-center px-6 py-2.5 rounded-xl font-medium text-slate-600 hover:text-slate-800 dark:text-slate-300 dark:hover:text-white bg-slate-50 hover:bg-slate-100 dark:bg-slate-900 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 transition-colors"
                                >
                                    Cancel
                                </Link>
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="w-full sm:w-auto inline-flex justify-center items-center gap-2 px-8 py-2.5 rounded-xl bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white font-semibold border border-slate-200 dark:border-slate-700 hover:border-slate-400 dark:hover:border-slate-500 shadow-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed active:scale-95"
                                >
                                    <Save className="w-4 h-4" />
                                    {processing ? 'Updating...' : 'Update Submission'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}