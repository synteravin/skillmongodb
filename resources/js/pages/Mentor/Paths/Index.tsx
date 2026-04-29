import AppLayout from '@/layouts/app-layout';
import { useForm } from '@inertiajs/react';
import { useState } from 'react';

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
            <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6">
                <div className="max-w-7xl mx-auto grid lg:grid-cols-3 gap-6">

                    {/* LEFT SIDE - CREATE */}
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-2xl shadow-xl p-6 border border-slate-200">

                            <h2 className="text-xl font-bold text-slate-800">
                                Create New Path
                            </h2>

                            <p className="text-sm text-slate-500 mt-1">
                                Add new learning path to {group.name}
                            </p>

                            <form onSubmit={submit} className="mt-6 space-y-4">

                                {/* INPUT NAME */}
                                <div>
                                    <label className="text-sm font-semibold text-slate-600">
                                        Path Name
                                    </label>

                                    <input
                                        type="text"
                                        value={data.name}
                                        onFocus={() => setFocus(true)}
                                        onBlur={() => setFocus(false)}
                                        onChange={(e) => setData('name', e.target.value)}
                                        placeholder="e.g. Advanced React"
                                        className={`w-full mt-2 px-4 py-3 rounded-xl border transition 
                                    ${focus
                                                ? 'border-indigo-500 ring-2 ring-indigo-100'
                                                : 'border-slate-200'
                                            } outline-none`}
                                    />
                                </div>

                                {/* DESCRIPTION */}
                                <div>
                                    <label className="text-sm font-semibold text-slate-600">
                                        Description
                                    </label>

                                    <textarea
                                        value={data.description}
                                        onChange={(e) => setData('description', e.target.value)}
                                        placeholder="Explain what student will learn..."
                                        className="w-full mt-2 px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 outline-none"
                                    />
                                </div>

                                {/* BUTTON */}
                                <button
                                    disabled={processing}
                                    className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-3 rounded-xl font-semibold shadow-md hover:shadow-lg transition active:scale-95"
                                >
                                    {processing ? 'Creating...' : 'Create Path'}
                                </button>

                            </form>
                        </div>
                    </div>

                    {/* RIGHT SIDE - LIST */}
                    <div className="lg:col-span-2">
                        <div className="bg-white rounded-2xl shadow-xl p-6 border border-slate-200">

                            {/* HEADER */}
                            <div className="flex items-center justify-between">
                                <div>
                                    <h2 className="text-xl font-bold text-slate-800">
                                        {group.name} Paths
                                    </h2>
                                    <p className="text-sm text-slate-500">
                                        Manage learning progression
                                    </p>
                                </div>

                                <div className="text-sm text-slate-400">
                                    {paths.length} Paths
                                </div>
                            </div>

                            {/* LIST */}
                            <div className="mt-6 space-y-4">

                                {paths.length === 0 && (
                                    <div className="text-center py-12 text-slate-400">
                                        No paths created yet
                                    </div>
                                )}

                                {paths.map((path, index) => (
                                    <div
                                        key={path.id}
                                        className="group flex items-center justify-between p-4 rounded-xl border border-slate-200 hover:border-indigo-300 hover:shadow-md transition"
                                    >

                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 rounded-lg bg-indigo-100 flex items-center justify-center font-bold text-indigo-600">
                                                {index + 1}
                                            </div>

                                            <div>
                                                <p className="font-semibold text-slate-800">
                                                    {path.name}
                                                </p>
                                                <p className="text-xs text-slate-400">
                                                    Order #{path.order}
                                                </p>
                                            </div>
                                        </div>

                                        {/* ACTIONS */}
                                        <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition">

                                            <button className="px-3 py-1 text-xs rounded-lg bg-slate-100 hover:bg-indigo-100 text-slate-600">
                                                Edit
                                            </button>

                                            <button className="px-3 py-1 text-xs rounded-lg bg-red-100 hover:bg-red-200 text-red-600">
                                                Delete
                                            </button>

                                        </div>

                                    </div>
                                ))}

                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </AppLayout>
    );
}