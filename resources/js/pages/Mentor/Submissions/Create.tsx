import AppLayout from '@/layouts/app-layout';
import { useForm, Link } from '@inertiajs/react';
import { FormEventHandler } from 'react';
import {
    ArrowLeft,
    Save,
    FilePlus,
    Calendar,
    Link as LinkIcon,
    Paperclip,
} from 'lucide-react';

type Group = {
    id: string;
    name: string;
};

interface Props {
    group: Group;
}

export default function CreateSubmission({ group }: Props) {
    const { data, setData, post, processing, errors } = useForm({
        title: '',
        description: '',
        submission_type: 'file',
        attachment: null as File | null,
        deadline: '',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        post(`/mentor/career-groups/${group.id}/submissions`);
    };

    return (
        <AppLayout>
            <div
                className="mx-auto w-full max-w-7xl space-y-8 p-4 text-slate-800 sm:p-6 lg:p-8 dark:text-slate-100"
                style={{ fontFamily: "'Outfit', sans-serif" }}
            >
                {/* Header Section */}
                <div className="mb-6 flex items-center gap-4">
                    <Link
                        href={`/mentor/career-groups/${group.id}/submissions`}
                        className="rounded-xl border border-slate-200 bg-white p-2.5 text-slate-500 shadow-sm transition-colors hover:bg-slate-50 hover:text-slate-800 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-400 dark:hover:bg-slate-700 dark:hover:text-white"
                    >
                        <ArrowLeft className="h-5 w-5" />
                    </Link>
                    <div>
                        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
                            Create Submission
                        </h1>
                        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                            Branch:{' '}
                            <span className="font-semibold text-indigo-600 dark:text-indigo-400">
                                {group.name}
                            </span>
                        </p>
                    </div>
                </div>

                <div className="mx-auto w-full">
                    <div className="font-outfit relative overflow-hidden rounded-xl border border-slate-200/80 bg-white shadow-md shadow-slate-100/50 dark:border-slate-800 dark:bg-gradient-to-b dark:from-[#0e0e1a] dark:to-[#090910] dark:shadow-none">
                        <form
                            onSubmit={submit}
                            className="relative z-10 space-y-8 p-6 sm:p-8 md:p-10"
                        >
                            <div className="mb-2 flex items-center gap-3">
                                <div className="rounded-xl border border-slate-200 bg-slate-100 p-2.5 text-slate-600 dark:border-slate-700 dark:bg-slate-800/60 dark:text-slate-300">
                                    <FilePlus className="h-6 w-6" />
                                </div>
                                <h2 className="text-xl font-bold text-slate-800 dark:text-white">
                                    Assignment Details
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
                                    className="w-full rounded-xl border border-slate-200 bg-slate-50/80 px-4 py-3 text-slate-900 placeholder-slate-400 shadow-sm transition-all duration-200 focus:border-indigo-500 focus:bg-white focus:outline-none dark:border-slate-800 dark:bg-[#030712] dark:text-white dark:placeholder-slate-500 dark:focus:bg-[#0d0f17]"
                                    placeholder="e.g. Final Project: E-commerce Dashboard"
                                    autoFocus
                                />
                                {errors.title && (
                                    <p className="mt-2 flex items-center gap-1.5 text-sm font-semibold text-rose-500">
                                        <span className="h-1.5 w-1.5 rounded-full bg-rose-500"></span>
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
                                    className="w-full resize-none rounded-xl border border-slate-200 bg-slate-50/80 px-4 py-3 text-slate-900 placeholder-slate-400 shadow-sm transition-all duration-200 focus:border-indigo-500 focus:bg-white focus:outline-none dark:border-slate-800 dark:bg-[#030712] dark:text-white dark:placeholder-slate-500 dark:focus:bg-[#0d0f17]"
                                    placeholder="Describe the task requirements, instructions, and grading criteria..."
                                />
                                {errors.description && (
                                    <p className="mt-2 flex items-center gap-1.5 text-sm font-semibold text-rose-500">
                                        <span className="h-1.5 w-1.5 rounded-full bg-rose-500"></span>
                                        {errors.description}
                                    </p>
                                )}
                            </div>

                            <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
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
                                            className="w-full cursor-pointer appearance-none rounded-xl border border-slate-200 bg-slate-50/80 px-4 py-3 pr-10 text-slate-900 shadow-sm transition-all duration-200 focus:border-indigo-500 focus:bg-white focus:outline-none dark:border-slate-800 dark:bg-[#030712] dark:text-white dark:focus:bg-[#0d0f17]"
                                        >
                                            <option value="file" className="bg-white text-slate-900 dark:bg-[#0d0f17] dark:text-white">
                                                File Upload Only
                                            </option>
                                            <option value="link" className="bg-white text-slate-900 dark:bg-[#0d0f17] dark:text-white">
                                                URL Link Only
                                            </option>
                                            <option value="both" className="bg-white text-slate-900 dark:bg-[#0d0f17] dark:text-white">
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
                                                ></path>
                                            </svg>
                                        </div>
                                    </div>
                                    {errors.submission_type && (
                                        <p className="mt-2 flex items-center gap-1.5 text-sm font-semibold text-rose-500">
                                            <span className="h-1.5 w-1.5 rounded-full bg-rose-500"></span>
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
                                        className="w-full rounded-xl border border-slate-200 bg-slate-50/80 px-4 py-3 text-slate-900 [color-scheme:light] shadow-sm transition-all duration-200 focus:border-indigo-500 focus:bg-white focus:outline-none dark:border-slate-800 dark:bg-[#030712] dark:text-white dark:[color-scheme:dark] dark:focus:bg-[#0d0f17]"
                                    />
                                    {errors.deadline && (
                                        <p className="mt-2 flex items-center gap-1.5 text-sm font-semibold text-rose-500">
                                            <span className="h-1.5 w-1.5 rounded-full bg-rose-500"></span>
                                            {errors.deadline}
                                        </p>
                                    )}
                                </div>
                            </div>

                            {/* Attachment */}
                            <div className="border-t border-slate-100 pt-4 dark:border-slate-800/60">
                                <label className="mb-2 ml-1 flex items-center gap-1.5 text-[11px] font-semibold tracking-wider text-slate-500 uppercase dark:text-slate-400">
                                    <Paperclip className="h-3.5 w-3.5 text-slate-400 dark:text-slate-500" />
                                    Attachment{' '}
                                    <span className="font-normal tracking-normal text-slate-400 normal-case dark:text-slate-500">
                                        (Optional)
                                    </span>
                                </label>
                                <div className="mt-2 flex justify-center rounded-xl border border-dashed border-slate-300 bg-slate-100/40 px-6 py-8 transition-colors hover:border-slate-400 hover:bg-slate-100/70 dark:border-slate-700 dark:bg-slate-950/40 dark:hover:border-slate-600 dark:hover:bg-slate-900/50">
                                    <div className="text-center">
                                        <Paperclip
                                            className="mx-auto mb-3 h-10 w-10 text-slate-300 dark:text-slate-500"
                                            aria-hidden="true"
                                        />
                                        <div className="mt-4 flex justify-center text-sm leading-6 text-slate-600 dark:text-slate-400">
                                            <label
                                                htmlFor="file-upload"
                                                className="relative cursor-pointer rounded-md font-semibold text-slate-700 underline decoration-slate-300 underline-offset-2 focus-within:ring-1 focus-within:ring-slate-400 focus-within:ring-offset-2 focus-within:ring-offset-white focus-within:outline-none hover:text-slate-900 dark:text-slate-200 dark:decoration-slate-600 dark:focus-within:ring-offset-slate-950 dark:hover:text-white"
                                            >
                                                <span>Upload a file</span>
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
                                                or drag and drop
                                            </p>
                                        </div>
                                        <p className="mt-1 text-xs leading-5 text-slate-500 dark:text-slate-400">
                                            {data.attachment
                                                ? data.attachment.name
                                                : 'PDF, DOCX, ZIP up to 10MB'}
                                        </p>
                                    </div>
                                </div>
                                {errors.attachment && (
                                    <p className="mt-2 flex items-center gap-1.5 text-sm font-semibold text-rose-500">
                                        <span className="h-1.5 w-1.5 rounded-full bg-rose-500"></span>
                                        {errors.attachment}
                                    </p>
                                )}
                            </div>

                            <div className="flex items-center justify-end gap-4 border-t border-slate-100 pt-6 dark:border-slate-800/60">
                                <Link
                                    href={`/mentor/career-groups/${group.id}/submissions`}
                                    className="rounded-xl border border-slate-200 bg-slate-50 px-6 py-3 font-medium text-slate-600 transition-colors hover:border-slate-300 hover:bg-slate-100 hover:text-slate-800 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300 dark:hover:border-slate-700 dark:hover:bg-slate-800 dark:hover:text-white"
                                >
                                    Cancel
                                </Link>
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-8 py-3 font-semibold text-slate-700 shadow-sm transition-colors hover:border-slate-400 hover:text-slate-900 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:border-slate-500 dark:hover:text-white"
                                >
                                    <Save className="h-5 w-5" />
                                    {processing ? 'Saving...' : 'Save as Draft'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
