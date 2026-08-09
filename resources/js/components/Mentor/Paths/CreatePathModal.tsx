import { useForm } from '@inertiajs/react';
import { FormEvent, useEffect } from 'react';
import { Plus, X } from 'lucide-react';
import { Group } from '@/types/paths';

interface CreatePathModalProps {
    group: Group;
    phase: 'basic_fundamental' | 'career_branch' | null;
    onClose: () => void;
}

export default function CreatePathModal({
    group,
    phase,
    onClose,
}: CreatePathModalProps) {
    const { data, setData, post, processing, reset, errors } = useForm({
        name: '',
        description: '',
        is_fundamental: phase === 'basic_fundamental',
    });

    useEffect(() => {
        setData('is_fundamental', phase === 'basic_fundamental');
    }, [phase]);

    if (!phase) return null;

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        post(`/mentor/career-groups/${group.slug || group.id}/paths`, {
            onSuccess: () => {
                reset();
                onClose();
            },
        });
    };

    const isBasic = phase === 'basic_fundamental';

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
                    <div
                        className={`rounded-xl border p-2.5 ${
                            isBasic
                                ? 'border-indigo-200 bg-indigo-50 text-indigo-600 dark:border-indigo-900 dark:bg-indigo-950/60 dark:text-indigo-400'
                                : 'border-emerald-200 bg-emerald-50 text-emerald-600 dark:border-emerald-900 dark:bg-emerald-950/60 dark:text-emerald-400'
                        }`}
                    >
                        <Plus className="h-5 w-5" />
                    </div>
                    <div>
                        <h3 className="text-lg font-bold text-slate-800 dark:text-white">
                            Tambah Path Baru
                        </h3>
                        <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
                            {isBasic
                                ? 'Membuat materi Basic Fundamental (Course Utama)'
                                : 'Membuat materi Progression (Career Branch)'}
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
                            placeholder="Contoh: Pengenalan HTML & CSS"
                            className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-900 shadow-sm transition-all focus:border-transparent focus:ring-2 focus:ring-indigo-500 focus:outline-none dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100"
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
                            placeholder="Jelaskan secara ringkas materi yang akan dipelajari..."
                            className="w-full resize-none rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-900 shadow-sm transition-all focus:border-transparent focus:ring-2 focus:ring-indigo-500 focus:outline-none dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100"
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
                            className={`flex-1 cursor-pointer rounded-xl px-4 py-2.5 text-sm font-bold text-white shadow-md transition-all active:scale-95 disabled:opacity-50 ${
                                isBasic
                                    ? 'bg-indigo-600 shadow-indigo-500/20 hover:bg-indigo-500'
                                    : 'bg-emerald-600 shadow-emerald-500/20 hover:bg-emerald-500'
                            }`}
                        >
                            {processing ? 'Menyimpan...' : 'Simpan Path'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
