import AppLayout from '@/layouts/app-layout';
import { useForm } from '@inertiajs/react';
import { useState } from 'react';
import { Link } from '@inertiajs/react';
import { Map, Plus, Edit, Trash2, ClipboardList, Layers, ArrowLeft } from 'lucide-react';

interface Path {
    id: string;
    name: string;
    order: number;
}

interface Group {
    id: string;
    name: string;
}

interface Props {
    group: Group;
    paths: Path[];
}

export default function Index({ group, paths }: Props) {
    const { data, setData, post, processing, reset } = useForm({
        name: '',
        description: '',
    });

    const [focus, setFocus] = useState(false);

    const submit = (e: React.FormEvent) => {
        e.preventDefault();

        post(`/mentor/career-groups/${group.id}/paths`, {
            onSuccess: () => reset(),
        });
    };

    return (
        <AppLayout>
            <div className="w-full mx-auto space-y-8 p-4 sm:p-6 lg:p-8">

                {/* Header Section */}
                <div className="flex items-center gap-4 mb-2">
                    <Link
                        href={`/mentor/dashboard`}
                        className="p-2.5 rounded-xl bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 border border-gray-200 dark:border-slate-700 transition-colors"
                    >
                        <ArrowLeft className="w-5 h-5" />
                    </Link>
                    <div>
                        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
                            Manage Learning Paths
                        </h1>
                        <p className="text-sm text-slate-500 dark:text-slate-400">
                            Branch: <span className="font-semibold text-indigo-500">{group.name}</span>
                        </p>
                    </div>
                </div>

                <div className="max-w-7xl mx-auto grid lg:grid-cols-3 gap-8">

                    {/* LEFT SIDE - CREATE FORM */}
                    <div className="lg:col-span-1">
                        <div className="relative rounded-3xl bg-white dark:bg-[#0a0d27] border border-gray-100 dark:border-slate-800/80 shadow-xl overflow-hidden">
                            {/* Decorative glow */}
                            <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 dark:bg-indigo-500/10 rounded-bl-full pointer-events-none"></div>

                            <div className="p-6 sm:p-8 relative z-10">
                                <div className="flex items-center gap-3 mb-6">
                                    <div className="p-2.5 rounded-xl bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
                                        <Plus className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <h2 className="text-xl font-bold text-slate-800 dark:text-white">
                                            Create Path
                                        </h2>
                                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                                            Add a new learning module
                                        </p>
                                    </div>
                                </div>

                                <form onSubmit={submit} className="space-y-5">
                                    <div>
                                        <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                                            Path Name
                                        </label>
                                        <input
                                            type="text"
                                            value={data.name}
                                            onFocus={() => setFocus(true)}
                                            onBlur={() => setFocus(false)}
                                            onChange={(e) => setData('name', e.target.value)}
                                            placeholder="e.g. Advanced React"
                                            className={`w-full bg-slate-50 dark:bg-slate-900/50 rounded-xl px-4 py-3 text-slate-900 dark:text-white placeholder-slate-400 transition-all shadow-sm outline-none border ${focus
                                                ? 'border-indigo-500 ring-2 ring-indigo-500/20'
                                                : 'border-gray-200 dark:border-slate-700'
                                                }`}
                                        />
                                    </div>

                                    {/* DESCRIPTION */}
                                    <div>
                                        <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                                            Description
                                        </label>
                                        <textarea
                                            rows={4}
                                            value={data.description}
                                            onChange={(e) => setData('description', e.target.value)}
                                            placeholder="Explain what the student will learn..."
                                            className="w-full bg-slate-50 dark:bg-slate-900/50 border border-gray-200 dark:border-slate-700 rounded-xl px-4 py-3 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all shadow-sm resize-none"
                                        />
                                    </div>

                                    {/* BUTTON */}
                                    <button
                                        disabled={processing}
                                        className="w-full inline-flex justify-center items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-xl font-semibold shadow-lg shadow-indigo-500/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed active:scale-95 mt-4"
                                    >
                                        <Plus className="w-5 h-5" />
                                        {processing ? 'Creating...' : 'Create Path'}
                                    </button>
                                </form>
                            </div>
                        </div>
                    </div>

                    {/* RIGHT SIDE - LIST */}
                    <div className="lg:col-span-2">
                        <div className="relative rounded-3xl bg-white dark:bg-gradient-to-br dark:from-[#0b0f2a] dark:to-[#050619] border border-gray-100 dark:border-slate-800 shadow-xl overflow-hidden h-full flex flex-col">
                            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/5 dark:bg-blue-500/10 rounded-bl-full pointer-events-none blur-3xl"></div>

                            {/* HEADER */}
                            <div className="p-6 sm:px-8 sm:pt-8 border-b border-gray-100 dark:border-slate-800/60 relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                <div className="flex items-center gap-3">
                                    <div className="p-2.5 rounded-xl bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400">
                                        <Map className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <h2 className="text-xl font-bold text-slate-800 dark:text-white flex items-center gap-2">
                                            Learning Progression
                                            <span className="inline-flex items-center justify-center bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-xs font-bold px-2 py-0.5 rounded-full">
                                                {paths.length}
                                            </span>
                                        </h2>
                                    </div>
                                </div>

                                <Link
                                    href={`/mentor/career-groups/${group.id}/submissions`}
                                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 border border-gray-200 dark:border-slate-600 hover:border-indigo-300 dark:hover:border-indigo-500/50 shadow-sm transition-all font-semibold text-sm active:scale-95"
                                >
                                    <ClipboardList className="w-4 h-4" />
                                    Manage Submissions
                                </Link>
                            </div>

                            {/* LIST */}
                            <div className="p-6 sm:p-8 flex-1 relative z-10 overflow-y-auto">
                                {paths.length === 0 ? (
                                    <div className="flex flex-col items-center justify-center h-full min-h-[300px] text-center border-2 border-dashed border-gray-200 dark:border-slate-700 rounded-2xl bg-gray-50/50 dark:bg-slate-800/20 p-8">
                                        <Layers className="w-16 h-16 text-slate-300 dark:text-slate-600 mb-4" />
                                        <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-2">No Paths Created</h3>
                                        <p className="text-slate-500 dark:text-slate-400 text-sm max-w-sm">
                                            Start building the curriculum by creating the first learning path for this branch using the form.
                                        </p>
                                    </div>
                                ) : (
                                    <div className="space-y-4">
                                        {paths.map((path, index) => (
                                            <div
                                                key={path.id}
                                                className="group flex flex-col sm:flex-row sm:items-center justify-between p-4 sm:p-5 rounded-2xl border border-gray-100 dark:border-slate-700/60 bg-white dark:bg-slate-800/40 hover:bg-gray-50 dark:hover:bg-slate-800/80 hover:border-indigo-300 dark:hover:border-indigo-500/50 transition-all shadow-sm hover:shadow-md relative overflow-hidden"
                                            >
                                                {/* Left accent line */}
                                                <div className="absolute top-0 left-0 w-1 h-full bg-indigo-500 opacity-0 group-hover:opacity-100 transition-opacity"></div>

                                                <div className="flex items-center gap-4">
                                                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center font-bold text-white shadow-sm shrink-0">
                                                        {index + 1}
                                                    </div>

                                                    <div>
                                                        <p className="font-bold text-slate-900 dark:text-white text-lg">
                                                            {path.name}
                                                        </p>
                                                        <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">
                                                            Order sequence #{path.order}
                                                        </p>
                                                    </div>
                                                </div>

                                                {/* ACTIONS */}
                                                <div className="flex items-center gap-2 mt-4 sm:mt-0 pt-4 sm:pt-0 border-t sm:border-t-0 border-gray-100 dark:border-slate-700 opacity-100 sm:opacity-0 group-hover:opacity-100 transition-opacity justify-end">
                                                    <button
                                                        className="inline-flex items-center gap-1.5 px-3 py-2 text-sm font-semibold rounded-lg bg-slate-100 dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:bg-blue-100 dark:hover:bg-blue-500/20 hover:text-blue-600 dark:hover:text-blue-400 transition-colors border border-transparent dark:border-slate-700"
                                                        title="Edit Path"
                                                    >
                                                        <Edit className="w-4 h-4" />
                                                        <span className="sm:hidden lg:inline">Edit</span>
                                                    </button>

                                                    <Link
                                                        href={`/mentor/career-groups/${group.id}/paths/${path.id}/modules`}
                                                        className="inline-flex items-center gap-1.5 px-3 py-2 text-sm font-semibold rounded-lg bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-100 dark:hover:bg-indigo-500/20 border border-transparent dark:border-indigo-500/20 transition-colors"
                                                        title="Detail Module"
                                                    >
                                                        <Layers className="w-4 h-4" />
                                                        <span className="sm:hidden lg:inline">
                                                            Detail
                                                        </span>
                                                    </Link>

                                                    <button
                                                        className="inline-flex items-center gap-1.5 px-3 py-2 text-sm font-semibold rounded-lg bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-500/20 border border-transparent dark:border-red-500/20 transition-colors"
                                                        title="Delete Path"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                        <span className="sm:hidden lg:inline">Delete</span>
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}