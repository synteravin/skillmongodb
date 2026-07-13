import AppLayout from '@/layouts/app-layout';
import { useForm, Link } from '@inertiajs/react';
import { FormEventHandler } from 'react';
import {
    ArrowLeft,
    Save,
    Edit,
    Calendar,
    Link as LinkIcon,
    Paperclip,
} from 'lucide-react';

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
        deadline: submission.deadline ? submission.deadline.slice(0, 16) : '',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        put(`/mentor/submissions/${submission.id}`);
    };

    return (
        <AppLayout>
            <div
                className="mx-auto w-full space-y-8 p-4 sm:p-6 lg:p-8"
                style={{ fontFamily: "'Outfit', sans-serif" }}
            >
                {/* Header */}
                <div className="flex items-center gap-4">
                    <Link
                        href={`/mentor/career-groups/${submission.group_id}/submissions`}
                        className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 shadow-sm transition-all hover:border-indigo-300 hover:text-indigo-600 dark:border-slate-700 dark:bg-slate-800/60 dark:text-slate-300 dark:hover:border-indigo-500/50 dark:hover:text-indigo-400"
                    >
                        <ArrowLeft className="h-5 w-5" />
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
                <div className="mx-auto w-full">
                    <div className="font-outfit overflow-hidden rounded-xl border border-slate-200/80 bg-white shadow-md shadow-slate-100/50 dark:border-slate-800 dark:bg-gradient-to-b dark:from-[#0e0e1a] dark:to-[#090910]">
                        {/* Top decorative line */}
                        <div className="relative">
                            <div className="absolute top-0 right-8 left-8 h-px bg-gradient-to-r from-transparent via-slate-200 to-transparent dark:via-slate-800" />
                        </div>

                        <form
                            onSubmit={submit}
                            className="space-y-8 p-6 sm:p-8"
                        >
                            {/* Section Header */}
                            <div className="flex items-center gap-3">
                                <div className="rounded-xl border border-slate-200 bg-slate-100 p-2.5 text-slate-600 dark:border-slate-700 dark:bg-slate-800/60 dark:text-slate-300">
                                    <Edit className="h-5 w-5" />
                                </div>
                                <h2 className="text-lg font-bold text-slate-800 dark:text-white">
                                    Assignment Information
                                </h2>
                            </div>

                            {/* Title */}
                            <div>
                                <label className="mb-2 ml-1 flex items-center gap-1.5 text-[11px] font-semibold tracking-wider text-slate-500 uppercase dark:text-slate-400">
                                    <span className="h-1 w-1 rounded-full bg-slate-400 dark:bg-slate-500" />
                                    Title
                                </label>
                                <input
                                    type="text"
                                    value={data.title}
                                    onChange={(e) =>
                                        setData('title', e.target.value)
                                    }
                                    placeholder="Enter submission title..."
                                    className="dark:placeholder:text-slate-605 w-full rounded-xl border border-slate-200/90 bg-slate-50/80 px-4 py-3 text-slate-900 placeholder-slate-400 shadow-sm transition-all duration-200 focus:border-indigo-500 focus:bg-white focus:ring-1 focus:ring-indigo-500/20 focus:outline-none dark:border-slate-800 dark:text-slate-100"
                                />
                                {errors.title && (
                                    <p className="mt-2 flex items-center gap-1.5 text-sm font-semibold text-rose-500">
                                        <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-rose-500" />
                                        {errors.title}
                                    </p>
                                )}
                            </div>

                            {/* Description */}
                            <div>
                                <div className="mr-1 mb-2 ml-1 flex items-center justify-between">
                                    <label className="flex items-center gap-1.5 text-[11px] font-semibold tracking-wider text-slate-500 uppercase dark:text-slate-400">
                                        <span className="h-1 w-1 rounded-full bg-slate-400 dark:bg-slate-500" />
                                        Description
                                    </label>
                                    <span className="text-[11px] text-slate-400 tabular-nums dark:text-slate-500">
                                        {data.description?.length ?? 0}{' '}
                                        characters
                                    </span>
                                </div>
                                <textarea
                                    rows={5}
                                    value={data.description}
                                    onChange={(e) =>
                                        setData('description', e.target.value)
                                    }
                                    placeholder="Describe the assignment requirements..."
                                    className="dark:placeholder:text-slate-655 w-full resize-none rounded-xl border border-slate-200/90 bg-slate-50/80 px-4 py-3 text-slate-900 placeholder-slate-400 shadow-sm transition-all duration-200 focus:border-indigo-500 focus:bg-white focus:ring-1 focus:ring-indigo-500/20 focus:outline-none dark:border-slate-800 dark:text-slate-100"
                                />
                                {errors.description && (
                                    <p className="mt-2 flex items-center gap-1.5 text-sm font-semibold text-rose-500">
                                        <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-rose-500" />
                                        {errors.description}
                                    </p>
                                )}
                            </div>

                            {/* Submission Type & Deadline */}
                            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                                {/* Submission Type */}
                                <div>
                                    <label className="mb-2 ml-1 flex items-center gap-1.5 text-[11px] font-semibold tracking-wider text-slate-500 uppercase dark:text-slate-400">
                                        <LinkIcon className="h-3.5 w-3.5 text-slate-400 dark:text-slate-500" />
                                        Submission Type
                                    </label>
                                    <div className="relative">
                                        <select
                                            value={data.submission_type}
                                            onChange={(e) =>
                                                setData(
                                                    'submission_type',
                                                    e.target.value,
                                                )
                                            }
                                            className="w-full appearance-none rounded-xl border border-slate-200/90 bg-slate-50/80 px-4 py-3 pr-10 text-slate-900 shadow-sm transition-all duration-200 focus:border-indigo-500 focus:bg-white focus:ring-1 focus:ring-indigo-500/20 focus:outline-none dark:border-slate-800 dark:text-slate-100"
                                        >
                                            <option value="file">
                                                File Upload Only
                                            </option>
                                            <option value="link">
                                                URL Link Only
                                            </option>
                                            <option value="both">
                                                Both (File &amp; Link)
                                            </option>
                                        </select>
                                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-slate-400 dark:text-slate-500">
                                            <svg
                                                className="h-4 w-4"
                                                fill="none"
                                                stroke="currentColor"
                                                viewBox="0 0 24 24"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth="2"
                                                    d="M19 9l-7 7-7-7"
                                                />
                                            </svg>
                                        </div>
                                    </div>
                                    {errors.submission_type && (
                                        <p className="mt-2 flex items-center gap-1.5 text-sm font-semibold text-rose-500">
                                            <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-rose-500" />
                                            {errors.submission_type}
                                        </p>
                                    )}
                                </div>

                                {/* Deadline */}
                                <div>
                                    <label className="mb-2 ml-1 flex items-center gap-1.5 text-[11px] font-semibold tracking-wider text-slate-500 uppercase dark:text-slate-400">
                                        <Calendar className="h-3.5 w-3.5 text-slate-400 dark:text-slate-500" />
                                        Deadline
                                    </label>
                                    <input
                                        type="datetime-local"
                                        value={data.deadline}
                                        onChange={(e) =>
                                            setData('deadline', e.target.value)
                                        }
                                        className="w-full rounded-xl border border-slate-200/90 bg-slate-50/80 px-4 py-3 text-slate-900 [color-scheme:light] shadow-sm transition-all duration-200 focus:border-indigo-500 focus:bg-white focus:ring-1 focus:ring-indigo-500/20 focus:outline-none dark:border-slate-800 dark:text-slate-100 dark:[color-scheme:dark]"
                                    />
                                    {errors.deadline && (
                                        <p className="mt-2 flex items-center gap-1.5 text-sm font-semibold text-rose-500">
                                            <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-rose-500" />
                                            {errors.deadline}
                                        </p>
                                    )}
                                </div>
                            </div>

                            {/* Replace Attachment */}
                            <div className="border-t border-slate-100 pt-4 dark:border-slate-800">
                                <label className="mb-3 ml-1 flex items-center gap-1.5 text-[11px] font-semibold tracking-wider text-slate-500 uppercase dark:text-slate-400">
                                    <Paperclip className="h-3.5 w-3.5 text-slate-400 dark:text-slate-500" />
                                    Replace Attachment{' '}
                                    <span className="font-normal tracking-normal text-slate-400 normal-case dark:text-slate-500">
                                        (Optional)
                                    </span>
                                </label>
                                <div className="flex justify-center rounded-xl border border-dashed border-slate-300 bg-slate-100/40 px-6 py-10 transition-colors hover:border-slate-400 hover:bg-slate-100/70 dark:border-slate-700 dark:bg-slate-950/40 dark:hover:border-slate-600 dark:hover:bg-slate-900/50">
                                    <div className="text-center">
                                        <Paperclip
                                            className="mx-auto mb-3 h-10 w-10 text-slate-300 dark:text-slate-500"
                                            aria-hidden="true"
                                        />
                                        <div className="flex justify-center text-sm leading-6 text-slate-600 dark:text-slate-400">
                                            <label
                                                htmlFor="file-upload"
                                                className="relative cursor-pointer rounded-md font-semibold text-slate-700 underline decoration-slate-300 underline-offset-2 focus-within:ring-1 focus-within:ring-slate-400 focus-within:outline-none hover:text-slate-900 dark:text-slate-200 dark:decoration-slate-600 dark:hover:text-white"
                                            >
                                                <span>Select new file</span>
                                                <input
                                                    id="file-upload"
                                                    name="file-upload"
                                                    type="file"
                                                    className="sr-only"
                                                    onChange={(e) =>
                                                        setData(
                                                            'attachment',
                                                            e.target
                                                                .files?.[0] ||
                                                                null,
                                                        )
                                                    }
                                                />
                                            </label>
                                            <p className="pl-1">
                                                to replace existing
                                            </p>
                                        </div>
                                        <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                                            {data.attachment
                                                ? data.attachment.name
                                                : 'PDF, DOCX, ZIP up to 10MB'}
                                        </p>
                                    </div>
                                </div>
                                {errors.attachment && (
                                    <p className="mt-2 flex items-center gap-1.5 text-sm font-semibold text-rose-500">
                                        <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-rose-500" />
                                        {errors.attachment}
                                    </p>
                                )}
                            </div>

                            {/* Actions */}
                            <div className="flex flex-col-reverse items-center justify-end gap-3 border-t border-slate-100 pt-4 sm:flex-row dark:border-slate-800">
                                <Link
                                    href={`/mentor/career-groups/${submission.group_id}/submissions`}
                                    className="inline-flex w-full items-center justify-center rounded-xl border border-slate-200 bg-slate-50 px-6 py-2.5 font-medium text-slate-600 transition-colors hover:border-slate-300 hover:bg-slate-100 hover:text-slate-800 sm:w-auto dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:border-slate-600 dark:hover:bg-slate-800 dark:hover:text-white"
                                >
                                    Cancel
                                </Link>
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-8 py-2.5 font-semibold text-slate-700 shadow-sm transition-all hover:border-slate-400 hover:text-slate-900 active:scale-95 disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:border-slate-500 dark:hover:text-white"
                                >
                                    <Save className="h-4 w-4" />
                                    {processing
                                        ? 'Updating...'
                                        : 'Update Submission'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
