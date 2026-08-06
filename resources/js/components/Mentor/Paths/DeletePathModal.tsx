import { useForm } from '@inertiajs/react';
import { AlertTriangle, X } from 'lucide-react';
import { Path, Group } from '@/types/paths';

interface DeletePathModalProps {
    group: Group;
    path: Path | null;
    onClose: () => void;
}

export default function DeletePathModal({
    group,
    path,
    onClose,
}: DeletePathModalProps) {
    const { delete: destroy, processing } = useForm();

    if (!path) return null;

    const handleDelete = () => {
        destroy(
            `/mentor/career-groups/${group.slug || group.id}/paths/${path.slug || path.id}`,
            {
                onSuccess: () => onClose(),
            },
        );
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-xs transition-opacity duration-300">
            <div className="relative w-full max-w-sm animate-in rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl duration-200 zoom-in-95 fade-in dark:border-slate-800 dark:bg-slate-950">
                {/* Close button */}
                <button
                    type="button"
                    onClick={onClose}
                    className="absolute top-4 right-4 rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-900 dark:hover:text-slate-200"
                >
                    <X className="h-5 w-5" />
                </button>

                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl border border-rose-200 bg-rose-50 text-rose-600 dark:border-rose-900/60 dark:bg-rose-950/60 dark:text-rose-400">
                    <AlertTriangle className="h-6 w-6" />
                </div>

                <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                    Hapus Path Ini?
                </h3>
                <p className="mt-1.5 text-sm text-slate-500 dark:text-slate-400">
                    Path{' '}
                    <strong className="font-semibold text-slate-800 dark:text-slate-200">
                        "{path.name}"
                    </strong>{' '}
                    dan seluruh modul serta materi di dalamnya akan dihapus
                    secara permanen.
                </p>

                <div className="mt-6 flex items-center gap-3">
                    <button
                        type="button"
                        onClick={onClose}
                        className="flex-1 cursor-pointer rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-600 transition-colors hover:bg-slate-50 dark:border-slate-800 dark:text-slate-400 dark:hover:bg-slate-900"
                    >
                        Batal
                    </button>
                    <button
                        type="button"
                        onClick={handleDelete}
                        disabled={processing}
                        className="flex-1 cursor-pointer rounded-xl bg-rose-600 px-4 py-2.5 text-sm font-bold text-white shadow-md shadow-rose-500/20 transition-all hover:bg-rose-500 active:scale-95 disabled:opacity-50"
                    >
                        {processing ? 'Menghapus...' : 'Hapus Path'}
                    </button>
                </div>
            </div>
        </div>
    );
}
