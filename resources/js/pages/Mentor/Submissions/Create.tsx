import AppLayout from '@/layouts/app-layout';
import { useForm, Link } from '@inertiajs/react';
import { FormEventHandler } from 'react';
import { ArrowLeft, Save, FilePlus, Calendar, Link as LinkIcon, Paperclip } from 'lucide-react';

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
            <div className="w-full mx-auto space-y-8 p-4 sm:p-6 lg:p-8">
                
                {/* Header Section */}
                <div className="flex items-center gap-4 mb-6">
                    <Link
                        href={`/mentor/career-groups/${group.id}/submissions`}
                        className="p-2.5 rounded-xl bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 border border-gray-200 dark:border-slate-700 transition-colors"
                    >
                        <ArrowLeft className="w-5 h-5" />
                    </Link>
                    <div>
                        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
                            Create Submission
                        </h1>
                        <p className="text-sm text-slate-500 dark:text-slate-400">
                            Branch: <span className="font-semibold text-indigo-500">{group.name}</span>
                        </p>
                    </div>
                </div>

                <div className="mx-auto max-w-4xl relative">
                    {/* Decorative glow */}
                    <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 to-blue-500 rounded-3xl blur opacity-20 dark:opacity-30 pointer-events-none"></div>
                    
                    <div className="relative rounded-3xl bg-white dark:bg-[#0a0d27] border border-gray-100 dark:border-slate-800/80 shadow-xl overflow-hidden">
                        {/* Inner accent */}
                        <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 dark:bg-indigo-500/10 rounded-bl-full pointer-events-none"></div>

                        <form onSubmit={submit} className="p-6 sm:p-8 md:p-10 space-y-8 relative z-10">
                            
                            <div className="flex items-center gap-3 mb-2">
                                <div className="p-2.5 rounded-xl bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
                                    <FilePlus className="w-6 h-6" />
                                </div>
                                <h2 className="text-xl font-bold text-slate-800 dark:text-white">
                                    Assignment Details
                                </h2>
                            </div>

                            {/* Title */}
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                                    Title
                                </label>
                                <input
                                    type="text"
                                    value={data.title}
                                    onChange={(e) => setData('title', e.target.value)}
                                    className="w-full bg-slate-50 dark:bg-slate-900/50 border border-gray-200 dark:border-slate-700 rounded-xl px-4 py-3.5 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all shadow-sm"
                                    placeholder="e.g. Final Project: E-commerce Dashboard"
                                    autoFocus
                                />
                                {errors.title && (
                                    <p className="mt-2 text-sm text-red-500 flex items-center gap-1.5">
                                        <span className="w-1.5 h-1.5 rounded-full bg-red-500"></span>
                                        {errors.title}
                                    </p>
                                )}
                            </div>

                            {/* Description */}
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                                    Description
                                </label>
                                <textarea
                                    rows={5}
                                    value={data.description}
                                    onChange={(e) => setData('description', e.target.value)}
                                    className="w-full bg-slate-50 dark:bg-slate-900/50 border border-gray-200 dark:border-slate-700 rounded-xl px-4 py-3.5 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all shadow-sm resize-none"
                                    placeholder="Describe the task requirements, instructions, and grading criteria..."
                                />
                                {errors.description && (
                                    <p className="mt-2 text-sm text-red-500 flex items-center gap-1.5">
                                        <span className="w-1.5 h-1.5 rounded-full bg-red-500"></span>
                                        {errors.description}
                                    </p>
                                )}
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                {/* Submission Type */}
                                <div>
                                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2 flex items-center gap-2">
                                        <LinkIcon className="w-4 h-4 text-slate-400" />
                                        Submission Type
                                    </label>
                                    <div className="relative">
                                        <select
                                            value={data.submission_type}
                                            onChange={(e) => setData('submission_type', e.target.value)}
                                            className="w-full appearance-none bg-slate-50 dark:bg-slate-900/50 border border-gray-200 dark:border-slate-700 rounded-xl px-4 py-3.5 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all shadow-sm"
                                        >
                                            <option value="file">File Upload Only</option>
                                            <option value="link">URL Link Only</option>
                                            <option value="both">Both (File & Link)</option>
                                        </select>
                                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-slate-500">
                                            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                                        </div>
                                    </div>
                                    {errors.submission_type && (
                                        <p className="mt-2 text-sm text-red-500 flex items-center gap-1.5">
                                            <span className="w-1.5 h-1.5 rounded-full bg-red-500"></span>
                                            {errors.submission_type}
                                        </p>
                                    )}
                                </div>

                                {/* Deadline */}
                                <div>
                                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2 flex items-center gap-2">
                                        <Calendar className="w-4 h-4 text-slate-400" />
                                        Deadline
                                    </label>
                                    <input
                                        type="datetime-local"
                                        value={data.deadline}
                                        onChange={(e) => setData('deadline', e.target.value)}
                                        className="w-full bg-slate-50 dark:bg-slate-900/50 border border-gray-200 dark:border-slate-700 rounded-xl px-4 py-3 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all shadow-sm [color-scheme:light] dark:[color-scheme:dark]"
                                    />
                                    {errors.deadline && (
                                        <p className="mt-2 text-sm text-red-500 flex items-center gap-1.5">
                                            <span className="w-1.5 h-1.5 rounded-full bg-red-500"></span>
                                            {errors.deadline}
                                        </p>
                                    )}
                                </div>
                            </div>

                            {/* Attachment */}
                            <div className="pt-4 border-t border-gray-100 dark:border-slate-800">
                                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2 flex items-center gap-2">
                                    <Paperclip className="w-4 h-4 text-slate-400" />
                                    Attachment <span className="text-slate-400 dark:text-slate-500 font-normal">(Optional)</span>
                                </label>
                                <div className="mt-2 flex justify-center rounded-xl border border-dashed border-gray-300 dark:border-slate-600 px-6 py-8 bg-slate-50/50 dark:bg-slate-900/30 hover:bg-slate-50 dark:hover:bg-slate-900/50 transition-colors">
                                    <div className="text-center">
                                        <Paperclip className="mx-auto h-10 w-10 text-slate-300 dark:text-slate-500 mb-3" aria-hidden="true" />
                                        <div className="mt-4 flex text-sm leading-6 text-slate-600 dark:text-slate-400 justify-center">
                                            <label
                                                htmlFor="file-upload"
                                                className="relative cursor-pointer rounded-md font-semibold text-indigo-600 dark:text-indigo-400 hover:text-indigo-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-indigo-600 focus-within:ring-offset-2 focus-within:ring-offset-slate-900"
                                            >
                                                <span>Upload a file</span>
                                                <input 
                                                    id="file-upload" 
                                                    name="file-upload" 
                                                    type="file" 
                                                    className="sr-only" 
                                                    onChange={(e) => setData('attachment', e.target.files?.[0] || null)}
                                                />
                                            </label>
                                            <p className="pl-1">or drag and drop</p>
                                        </div>
                                        <p className="text-xs leading-5 text-slate-500 mt-1">
                                            {data.attachment ? data.attachment.name : 'PDF, DOCX, ZIP up to 10MB'}
                                        </p>
                                    </div>
                                </div>
                                {errors.attachment && (
                                    <p className="mt-2 text-sm text-red-500 flex items-center gap-1.5">
                                        <span className="w-1.5 h-1.5 rounded-full bg-red-500"></span>
                                        {errors.attachment}
                                    </p>
                                )}
                            </div>

                            <div className="flex items-center justify-end gap-4 pt-6 border-t border-gray-100 dark:border-slate-800">
                                <Link
                                    href={`/mentor/career-groups/${group.id}/submissions`}
                                    className="px-6 py-3 rounded-xl font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                                >
                                    Cancel
                                </Link>
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="inline-flex items-center gap-2 px-8 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold shadow-lg shadow-indigo-500/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed active:scale-95"
                                >
                                    <Save className="w-5 h-5" />
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