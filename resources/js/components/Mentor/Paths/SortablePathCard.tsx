import { Path, Group } from '@/types/paths';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Link } from '@inertiajs/react';
import { GripVertical, Edit, Layers, Trash2 } from 'lucide-react';

interface SortablePathCardProps {
    path: Path;
    index: number;
    group: Group;
    onEdit: (path: Path) => void;
    onDelete: (path: Path) => void;
    isFundamental?: boolean;
}

export default function SortablePathCard({
    path,
    index,
    group,
    onEdit,
    onDelete,
    isFundamental = false,
}: SortablePathCardProps) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ id: path.id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.4 : 1,
    };

    return (
        <div
            ref={setNodeRef}
            style={style}
            className="group relative flex flex-col overflow-hidden rounded-xl border border-slate-200 bg-white p-4 shadow-sm shadow-slate-100/60 transition-all hover:border-indigo-300 hover:bg-slate-50 hover:shadow-md hover:shadow-indigo-900/5 sm:p-5 dark:border-slate-800 dark:bg-slate-900/30 dark:hover:border-indigo-500/50 dark:hover:bg-slate-900/60"
        >
            {/* Left accent line */}
            <div
                className={`absolute top-0 left-0 h-full w-[3px] transition-opacity ${
                    isFundamental
                        ? 'bg-indigo-500'
                        : 'bg-slate-400 dark:bg-slate-500'
                } opacity-0 group-hover:opacity-100`}
            />

            {/* Top content row */}
            <div className="flex w-full items-start gap-4">
                {/* Drag Handle */}
                <div
                    {...attributes}
                    {...listeners}
                    className="mt-1 flex shrink-0 cursor-grab touch-none items-center justify-center p-1.5 text-slate-400 transition-colors hover:text-indigo-600 dark:hover:text-indigo-400"
                    title="Tarik untuk memindahkan"
                >
                    <GripVertical size={18} />
                </div>

                {/* Number Badge */}
                <div
                    className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border font-bold shadow-xs ${
                        isFundamental
                            ? 'border-indigo-100 bg-indigo-50 text-indigo-700 dark:border-indigo-900 dark:bg-indigo-950/40 dark:text-indigo-300'
                            : 'border-slate-200 bg-slate-50 text-slate-600 dark:border-slate-700 dark:bg-slate-800/60 dark:text-slate-400'
                    }`}
                >
                    {index + 1}
                </div>

                {/* Text Block */}
                <div className="min-w-0 flex-1">
                    <h3 className="text-slate-850 text-sm font-bold leading-snug transition-colors group-hover:text-indigo-600 sm:text-base dark:text-slate-100 dark:group-hover:text-indigo-400">
                        {path.name || 'Nama Path Tidak Tersedia'}
                    </h3>
                    <p className="mt-1.5 text-xs leading-relaxed text-slate-500 dark:text-slate-400">
                        {path.description || 'Tidak ada deskripsi.'}
                    </p>
                </div>
            </div>

            {/* Bottom Actions Row */}
            <div className="mt-4 flex w-full items-center justify-end gap-2 border-t border-slate-100 pt-3.5 dark:border-slate-800/60">
                <button
                    type="button"
                    onClick={() => onEdit(path)}
                    className="inline-flex h-8 cursor-pointer items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 text-xs font-semibold text-slate-700 transition-colors hover:bg-slate-50 hover:text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700 dark:hover:text-white"
                    title="Ubah Nama/Deskripsi"
                >
                    <Edit className="h-3.5 w-3.5" />
                    <span>Ubah</span>
                </button>

                <Link
                    href={`/mentor/career-groups/${group.slug}/paths/${path.slug || path.id}/modules`}
                    className={`inline-flex h-8 items-center gap-1.5 rounded-lg border px-3 text-xs font-semibold transition-colors ${
                        isFundamental
                            ? 'border-indigo-200 bg-indigo-50/50 text-indigo-700 hover:bg-indigo-100 hover:text-indigo-900 dark:border-indigo-900/60 dark:bg-indigo-950/40 dark:text-indigo-300 dark:hover:bg-indigo-900/60 dark:hover:text-indigo-100'
                            : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50 hover:text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700 dark:hover:text-white'
                    }`}
                    title="Edit Detail Materi / Modul"
                >
                    <Layers className="h-3.5 w-3.5" />
                    <span>Materi</span>
                </Link>

                <button
                    type="button"
                    onClick={() => onDelete(path)}
                    className="inline-flex h-8 cursor-pointer items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 text-xs font-semibold text-slate-700 transition-colors hover:bg-rose-50 hover:text-rose-600 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-rose-950/20 dark:hover:text-rose-400"
                    title="Hapus Path"
                >
                    <Trash2 className="h-3.5 w-3.5" />
                    <span>Hapus</span>
                </button>
            </div>
        </div>
    );
}
