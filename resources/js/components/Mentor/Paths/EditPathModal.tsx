import { useForm } from '@inertiajs/react';
import { FormEvent, useEffect } from 'react';
import { Edit, X } from 'lucide-react';
import { Path, Group } from '@/types/paths';

interface EditPathModalProps {
    group: Group;
    path: Path | null;
    onClose: () => void;
}

export default function EditPathModal({
    group,
    path,
    onClose,
}: EditPathModalProps) {
    const { data, setData, put, processing, reset, errors } = useForm({
        name: '',
        description: '',
    });

    useEffect(() => {
        if (path) {
            setData({
                name: path.name || '',
                description: path.description || '',
            });
        }
    }, [path]);

    if (!path) return null;

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        put(
            `/mentor/career-groups/${group.slug || group.id}/paths/${path.slug || path.id}`,
            {
                onSuccess: () => {
                    reset();
                    onClose();
                },
            },
        );
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-xs transition-opacity duration-300">
            <div className="relative w-full max-w-md animate-in rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl duration-200 zoom-in-95 fade-in dark:border-slate-800 dark:bg-slate-950">
                {/* Close button */}
                <button
                    type="button"
                    onClick={onClose}
                    className="absolute top-4 right-4 rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-900 dark:hover:text-slate-200"
                >
                    <X className="h-5 w-5" />
                </button>

                <div className="mb-5 flex items-center gap-3">
                    <div className="rounded-xl border border-amber-200 bg-amber-50 p-2.5 text-amber-600 dark:border-amber-900/60 dark:bg-amber-950/60 dark:text-amber-400">
                        <Edit className="h-5 w-5" />
                    </div>
                    <div>
                        <h3 className="text-lg font-bold text-slate-800 dark:text-white">
                            Edit Learning Path
                        </h3>
                        <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
                            Perbarui nama atau deskripsi path ini.
                        </p>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="mb-2 ml-1 block text-[11px] font-bold tracking-wider text-slate-500 uppercase dark:text-slate-400">
                            Nama Path
                        </label>
                        <input
                            type="text"
                            required
                            value={data.name}
                            onChange={(e) => setData('name', e.target.value)}
                            placeholder="Nama path..."
                            className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-900 shadow-sm transition-all focus:border-transparent focus:ring-2 focus:ring-amber-500 focus:outline-none dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100"
                        />
                        {errors.name && (
                            <p className="mt-1 text-xs text-rose-500">
                                {errors.name}
                            </p>
                        )}
                    </div>

                    <div>
                        <label className="mb-2 ml-1 block text-[11px] font-bold tracking-wider text-slate-500 uppercase dark:text-slate-400">
                            Deskripsi Singkat
                        </label>
                        <textarea
                            rows={3}
                            value={data.description}
                            onChange={(e) =>
                                setData('description', e.target.value)
                            }
                            placeholder="Deskripsi..."
                            className="w-full resize-none rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-900 shadow-sm transition-all focus:border-transparent focus:ring-2 focus:ring-amber-500 focus:outline-none dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100"
                        />
                        {errors.description && (
                            <p className="mt-1 text-xs text-rose-500">
                                {errors.description}
                            </p>
                        )}
                    </div>

                    <div className="border-slate-150 flex items-center gap-3 border-t pt-4 dark:border-slate-800">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 cursor-pointer rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-500 transition-colors hover:bg-slate-50 dark:border-slate-800 dark:text-slate-400 dark:hover:bg-slate-900"
                        >
                            Batal
                        </button>
                        <button
                            type="submit"
                            disabled={processing}
                            className="flex-1 cursor-pointer rounded-xl bg-amber-600 px-4 py-2.5 text-sm font-bold text-white shadow-md shadow-amber-500/20 transition-all hover:bg-amber-500 active:scale-95 disabled:opacity-50"
                        >
                            {processing ? 'Menyimpan...' : 'Update Path'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
