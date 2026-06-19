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
            <div className="w-full mx-auto space-y-8 p-4 sm:p-6 lg:p-8" style={{ fontFamily: "'Outfit', sans-serif" }}>

                {/* Header Section */}
                <div className="flex items-center gap-4 mb-2">
                    <Link
                        href={`/mentor/dashboard`}
                        className="p-2.5 rounded-xl bg-white dark:bg-slate-800 text-slate-605 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 transition-colors shadow-sm"
                    >
                        <ArrowLeft className="w-5 h-5" />
                    </Link>
                    <div>
                        <h1 className="text-2xl font-semibold tracking-tight text-slate-800 dark:text-white">
                            Manage Learning Paths 
                        </h1>
                        <p className="text-sm text-slate-500 dark:text-slate-400/60">
                            Branch: <span className="font-semibold text-indigo-650 dark:text-indigo-400">{group.name}</span>
                        </p>
                    </div>
                </div>

                <div className="max-w-7xl mx-auto grid lg:grid-cols-3 gap-8">

                    {/* LEFT SIDE - CREATE FORM */}
                <div className="lg:col-span-1">
                        <div className="relative overflow-hidden rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm font-outfit">
                            <div className="absolute inset-0 bg-white dark:bg-gradient-to-b dark:from-[#0e0e1a] dark:to-[#090910]" />
                            <div className="absolute top-0 right-8 left-8 h-px bg-gradient-to-r from-transparent via-slate-300 to-transparent dark:via-slate-700" />

                            <div className="p-6 sm:p-8 relative z-10">
                                <div className="flex items-center gap-3 mb-6">
                                    <div className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800/60 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                                        <Plus className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <h2 className="text-lg font-semibold text-slate-800 dark:text-white">
                                            Create Path
                                        </h2>
                                        <p className="text-xs text-slate-500 dark:text-slate-400/60 mt-1">
                                            Add a new learning module
                                        </p>
                                    </div>
                                </div>

                                <form onSubmit={submit} className="space-y-5">
                                    <div>
                                        <label className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2 ml-1">
                                            <span className="w-1 h-1 rounded-full bg-slate-400 dark:bg-slate-500" />
                                            Path Name
                                        </label>
                                        <input
                                            type="text"
                                            value={data.name}
                                            onFocus={() => setFocus(true)}
                                            onBlur={() => setFocus(false)}
                                            onChange={(e) => setData('name', e.target.value)}
                                            placeholder="Advanced React"
                                            className={`w-full bg-white dark:bg-slate-950/60 rounded-xl px-4 py-3 text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder:text-slate-600 transition-all duration-200 shadow-sm outline-none border ${focus
                                                ? 'border-slate-400 dark:border-slate-500 ring-1 ring-slate-300 dark:ring-slate-600'
                                                : 'border-slate-200 dark:border-slate-800'
                                                }`}
                                        />
                                    </div>

                                    {/* DESCRIPTION */}
                                    <div>
                                        <div className="flex items-center justify-between mb-2 ml-1 mr-1">
                                            <label className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                                                <span className="w-1 h-1 rounded-full bg-slate-400 dark:bg-slate-500" />
                                                Description
                                            </label>
                                            <span className="text-[11px] text-slate-400 dark:text-slate-500 tabular-nums">
                                                {data.description?.length ?? 0}/250
                                            </span>
                                        </div>
                                        <textarea
                                            rows={4}
                                            maxLength={250}
                                            value={data.description}
                                            onChange={(e) => setData('description', e.target.value)}
                                            placeholder="Explain what the student will learn..."
                                            className="w-full bg-white dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder:text-slate-600 focus:outline-none focus:ring-1 focus:ring-slate-300 dark:focus:ring-slate-600 focus:border-slate-400 dark:focus:border-slate-500 transition-all duration-200 shadow-sm resize-none"
                                        />
                                    </div>

                                    {/* DIVIDER */}
                                    <div className="h-px bg-gradient-to-r from-transparent via-slate-200 dark:via-slate-800 to-transparent" />

                                    {/* BUTTON */}
                                    <button
                                        disabled={processing}
                                        className="w-full inline-flex justify-center items-center gap-2 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white py-3 rounded-xl font-semibold border border-slate-200 dark:border-slate-700 hover:border-slate-400 dark:hover:border-slate-500 shadow-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed active:scale-95 mt-4 font-outfit"
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
                        <div className="relative overflow-hidden rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm h-[600px] flex flex-col font-outfit">
                            <div className="absolute inset-0 bg-white dark:bg-gradient-to-b dark:from-[#0e0e1a] dark:to-[#090910]" />
                            <div className="absolute top-0 right-8 left-8 h-px bg-gradient-to-r from-transparent via-slate-300 to-transparent dark:via-slate-700" />

                            {/* HEADER */}
                            <div className="relative z-10 p-6 sm:px-8 sm:pt-8 border-b border-slate-200 dark:border-slate-800/60 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                <div className="flex items-center gap-3">
                                    <div className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800/60 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                                        <Map className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <h2 className="text-xl font-bold text-slate-800 dark:text-white flex items-center gap-2">
                                            Learning Progression
                                            <span className="inline-flex items-center justify-center bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-xs font-bold px-2 py-0.5 rounded-full border border-slate-200 dark:border-slate-700">
                                                {paths.length}
                                            </span>
                                        </h2>
                                    </div>
                                </div>

                                <Link
                                    href={`/mentor/career-groups/${group.id}/submissions`}
                                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white border border-slate-200 dark:border-slate-700 hover:border-slate-400 dark:hover:border-slate-500 shadow-sm transition-all font-semibold text-sm active:scale-95"
                                >
                                    <ClipboardList className="w-4 h-4" />
                                    Manage Submissions
                                </Link>
                            </div>

                            {/* LIST */}
                            <div className="relative z-10 p-6 sm:p-8 flex-1 flex flex-col min-h-0">
                                {paths.length === 0 ? (
                                    <div className="flex flex-col items-center justify-center h-full min-h-[300px] text-center border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-xl bg-slate-50/50 dark:bg-slate-800/20 p-8">
                                        <Layers className="w-16 h-16 text-slate-400 dark:text-slate-600 mb-4" />
                                        <h3 className="text-lg font-semibold text-slate-800 dark:text-white mb-2">No Paths Created</h3>
                                        <p className="text-slate-500 dark:text-slate-400/60 text-sm max-w-sm">
                                            Start building the curriculum by creating the first learning path for this branch using the form.
                                        </p>
                                    </div>
                                ) : (
                                    <div className="space-y-4 overflow-y-auto pr-1 -mr-1">
                                        {paths.map((path, index) => (
                                            <div
                                                key={path.id}
                                                className="group flex flex-col sm:flex-row sm:items-center justify-between p-4 sm:p-5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/30 hover:bg-slate-50 dark:hover:bg-slate-900/60 hover:border-slate-400 dark:hover:border-slate-600 transition-all shadow-sm hover:shadow-md relative overflow-hidden"
                                            >
                                                {/* Left accent line */}
                                                <div className="absolute top-0 left-0 w-[3px] h-full bg-slate-400 dark:bg-slate-500 opacity-0 group-hover:opacity-100 transition-opacity"></div>

                                                <div className="flex items-center gap-4">
                                                    <div className="w-12 h-12 rounded-xl border-2 border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-800/60 flex items-center justify-center font-bold text-slate-700 dark:text-slate-200 shrink-0">
                                                        {index + 1}
                                                    </div>

                                                    <div>
                                                        <p className="font-bold text-slate-800 dark:text-white text-lg">
                                                            {path.name}
                                                        </p>
                                                        <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">
                                                            Order sequence #{path.order}
                                                        </p>
                                                    </div>
                                                </div>

                                                {/* ACTIONS */}
                                                <div className="flex items-center gap-2 mt-4 sm:mt-0 pt-4 sm:pt-0 border-t sm:border-t-0 border-slate-100 dark:border-slate-800 opacity-100 sm:opacity-0 group-hover:opacity-100 transition-opacity justify-end">
                                                    <button
                                                        className="inline-flex items-center gap-1.5 px-3 py-2 text-sm font-semibold rounded-lg bg-slate-50 dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-800 dark:hover:text-slate-200 transition-colors border border-slate-200 dark:border-slate-700"
                                                        title="Edit Path"
                                                    >
                                                        <Edit className="w-4 h-4" />
                                                        <span className="sm:hidden lg:inline">Edit</span>
                                                    </button>

                                                    <Link
                                                        href={`/mentor/career-groups/${group.id}/paths/${path.id}/modules`}
                                                        className="inline-flex items-center gap-1.5 px-3 py-2 text-sm font-semibold rounded-lg bg-slate-50 dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-800 dark:hover:text-slate-200 border border-slate-200 dark:border-slate-700 transition-colors"
                                                        title="Detail Module"
                                                    >
                                                        <Layers className="w-4 h-4" />
                                                        <span className="sm:hidden lg:inline">
                                                            Detail
                                                        </span>
                                                    </Link>

                                                    <button
                                                        className="inline-flex items-center gap-1.5 px-3 py-2 text-sm font-semibold rounded-lg bg-slate-50 dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-rose-600 dark:hover:text-rose-400 border border-slate-200 dark:border-slate-700 transition-colors"
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